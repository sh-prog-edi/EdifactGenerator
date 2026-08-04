#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nested_ahb_reader.py — Roh-w:tc-Leser für AHB-DOCX mit verschachtelten Tabellen.

Hintergrund
-----------
Ab den Formatständen FV2604/FV2610 liefert der BDEW einen Teil der AHB-DOCX in einem
Layout, bei dem jede Tabellenzeile ihre Spalten nicht mehr tabulatorgetrennt in einer
Zelle führt, sondern als *verschachtelte Tabelle* (w:tbl innerhalb w:tc). python-docx'
Grid-Rekonstruktion (Table.row_cells) liefert für solche Zellen leeren Text, weshalb
kohlrahbi mit "The last paragraph should start with 'Prüfidentifikator'" abbricht und
0 Prüf-IDs extrahiert.

Dieser Leser greift direkt auf das Roh-XML (w:tr -> w:tc -> w:tbl -> w:tr -> w:tc) zu
und erzeugt dieselbe Datenstruktur wie `kohlrahbi ahb --file-type flatahb`.

Spaltensemantik (empirisch aus den DOCX abgeleitet und gegen kohlrahbi verifiziert):

  Spalte "EDIFACT Struktur" (äußeres tc[0]):
      [ leer , Segmentgruppe , Segment , Datenelement/Segment-ID , leer ]
      Segment-IDs sind fünfstellig (00003), Datenelemente vierstellig (0062).

  Spalte "Beschreibung + Prüf-IDs" (äußeres tc[1]):
      die letzten N Zellen (N = Anzahl Prüf-IDs im Kopf) tragen die AHB-Ausdrücke,
      davor stehen — je nach Zeilenart — Code (value pool) und/oder Bezeichnung.

  Spalte "Bedingung" (äußeres tc[2]): Bedingungstexte, wird separat gesammelt.

Bearbeiter: Steffen Haense / Claude — 28.07.2026
"""

from __future__ import annotations

import re
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

import docx
from docx.oxml.ns import qn

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

RE_SEGMENT_ID = re.compile(r"^\d{5}$")
RE_DATA_ELEMENT = re.compile(r"^\d{4}$")
RE_SEGMENT_GROUP = re.compile(r"^SG\d+$")
RE_SEGMENT_CODE = re.compile(r"^[A-Z]{3}$")
RE_PRUEFI = re.compile(r"^\d{5}$")


# --------------------------------------------------------------------------------------
# XML-Hilfen
# --------------------------------------------------------------------------------------

def _paragraph_text(p) -> str:
    """Text eines Absatzes; gelöschte Passagen (Änderungsverfolgung) bleiben außen vor."""
    parts: list[str] = []
    for node in p.iter():
        tag = node.tag
        if tag == W + "t":
            # Text innerhalb von w:del gehört zur gelöschten Fassung
            parent = node.getparent()
            skip = False
            while parent is not None:
                if parent.tag in (W + "del",):
                    skip = True
                    break
                if parent.tag in (W + "p",):
                    break
                parent = parent.getparent()
            if not skip and node.text:
                parts.append(node.text)
        elif tag == W + "tab":
            parts.append("\t")
    return "".join(parts).replace("\xa0", " ").strip()


def _cell_text(tc) -> str:
    """Text einer Zelle über ihre direkten Absätze (ohne verschachtelte Tabellen)."""
    return "\n".join(_paragraph_text(p) for p in tc.findall(W + "p")).strip()


def _grid_span(tc) -> int:
    gs = tc.find(W + "tcPr/" + W + "gridSpan")
    if gs is None:
        return 1
    try:
        return int(gs.get(qn("w:val")))
    except (TypeError, ValueError):
        return 1


#: Zellen schmaler als dieser Wert (Twips) sind Trennspalten ohne Inhalt.
TRENNSPALTE_MAX_BREITE = 100


@dataclass
class SubRow:
    """Eine Zeile einer verschachtelten Tabelle: Zellen mit Gitterposition und Breite."""

    cells: list[tuple[int, int, str]]  # (start, span, text)
    breiten: list[int] = field(default_factory=list)  # Zellbreite in Twips

    def texts(self) -> list[str]:
        return [t for _, _, t in self.cells]

    def inhaltszellen(self) -> list[tuple[int, int, str]]:
        """Zellen ohne die schmalen Trennspalten zwischen den Prüf-ID-Spalten.

        Ein Teil der DOCX trennt die Prüf-ID-Spalten durch wenige Twips breite
        Leerzellen. Sie tragen nie Inhalt und würden die Spaltenzählung verfälschen.
        """
        if not self.breiten or len(self.breiten) != len(self.cells):
            return list(self.cells)
        grenze = max(TRENNSPALTE_MAX_BREITE, int(0.15 * max(self.breiten)))
        behalten = [c for c, b in zip(self.cells, self.breiten) if b > grenze or c[2].strip()]
        return behalten or list(self.cells)


def _nested_rows(tc) -> list[SubRow] | None:
    """Liest die verschachtelte Tabelle einer Zelle; None, wenn keine vorhanden."""
    tbls = tc.findall(W + "tbl")
    if not tbls:
        return None
    rows: list[SubRow] = []
    for tbl in tbls:
        grid = [int(g.get(qn("w:w")) or 0) for g in tbl.findall(W + "tblGrid/" + W + "gridCol")]
        for tr in tbl.findall(W + "tr"):
            cells: list[tuple[int, int, str]] = []
            breiten: list[int] = []
            pos = 0
            for cc in tr.findall(W + "tc"):
                span = _grid_span(cc)
                cells.append((pos, span, _cell_text(cc)))
                breiten.append(sum(grid[pos: pos + span]) if grid else 0)
                pos += span
            rows.append(SubRow(cells=cells, breiten=breiten))
    return rows


# --------------------------------------------------------------------------------------
# Kopf
# --------------------------------------------------------------------------------------

@dataclass
class TableHead:
    pruefis: list[str]
    beschreibung: dict[str, str] = field(default_factory=dict)
    kommunikation: dict[str, str] = field(default_factory=dict)


def read_head(outer_row) -> TableHead | None:
    """Liest den Tabellenkopf einer verschachtelten AHB-Tabelle."""
    tcs = outer_row.findall(W + "tc")
    if len(tcs) < 2:
        return None
    rows = _nested_rows(tcs[1])
    if not rows:
        return None

    pruefi_row = None
    for r in rows:
        texts = r.texts()
        if any(t.strip() == "Prüfidentifikator" for t in texts):
            pruefi_row = r
            break
    if pruefi_row is None:
        return None

    # Alles rechts der Zelle "Prüfidentifikator" sind die Prüf-IDs.
    idx = next(i for i, (_, _, t) in enumerate(pruefi_row.cells) if t.strip() == "Prüfidentifikator")
    pruefis = [t.strip() for _, _, t in pruefi_row.cells[idx + 1:] if RE_PRUEFI.match(t.strip())]
    if not pruefis:
        return None

    head = TableHead(pruefis=pruefis)
    n = len(pruefis)

    def werte_nach_label(r: SubRow, label: str) -> list[tuple[int, str]]:
        """Die n Wertzellen rechts eines Kopf-Labels, mit ihrer Gitterposition."""
        idx = next((i for i, (_, _, t) in enumerate(r.cells) if t.strip() == label), None)
        if idx is None:
            return []
        out: list[tuple[int, str]] = []
        for start, _, t in r.cells[idx + 1:]:
            t = t.strip()
            if not t:
                continue
            if t == "Bedingung":  # Spaltenüberschrift rechts der Prüf-ID-Spalten
                break
            out.append((start, t))
            if len(out) == n:
                break
        return out

    # Zeilenindizes der Kopfabschnitte
    i_besch = next((i for i, r in enumerate(rows) if any(t.strip() == "Beschreibung" for _, _, t in r.cells)), None)
    i_komm = next((i for i, r in enumerate(rows) if any(t.strip() == "Kommunikation von" for _, _, t in r.cells)), None)
    i_pruefi = next(i for i, r in enumerate(rows) if any(t.strip() == "Prüfidentifikator" for _, _, t in r.cells))

    spalten_pos: list[int] = []

    if i_besch is not None:
        werte = werte_nach_label(rows[i_besch], "Beschreibung")
        spalten_pos = [pos for pos, _ in werte]
        for pruefi, (_, wert) in zip(pruefis, werte):
            head.beschreibung[pruefi] = wert

    if i_komm is not None:
        for pruefi, (_, wert) in zip(pruefis, werte_nach_label(rows[i_komm], "Kommunikation von")):
            head.kommunikation[pruefi] = wert

    # Fortsetzungszeilen der Beschreibung (zwischen "Beschreibung" und "Kommunikation von"):
    # Zuordnung über die Gitterposition der Beschreibungsspalten.
    if i_besch is not None and spalten_pos:
        ende = i_komm if i_komm is not None else i_pruefi
        grenze = max(spalten_pos) + 6  # rechts davon beginnt die Bedingungsspalte
        for r in rows[i_besch + 1: ende]:
            for start, _, t in r.cells:
                t = t.strip()
                if not t or start > grenze:
                    continue
                naechste = min(range(len(spalten_pos)), key=lambda k: abs(spalten_pos[k] - start))
                if abs(spalten_pos[naechste] - start) > 4:
                    continue
                pruefi = pruefis[naechste]
                head.beschreibung[pruefi] = (head.beschreibung.get(pruefi, "") + " " + t).strip()

    return head


# --------------------------------------------------------------------------------------
# Datenzeilen
# --------------------------------------------------------------------------------------

@dataclass
class StructInfo:
    segment_group_key: str | None = None
    segment_code: str | None = None
    data_element: str | None = None
    segment_id: str | None = None


def parse_struct(tc) -> StructInfo | None:
    """Zerlegt die Spalte 'EDIFACT Struktur' einer Datenzeile."""
    rows = _nested_rows(tc)
    if not rows:
        return None
    texts = [t.strip() for _, _, t in rows[0].cells if t.strip()]
    info = StructInfo()
    for t in texts:
        if RE_SEGMENT_GROUP.match(t):
            info.segment_group_key = t
        elif RE_SEGMENT_CODE.match(t) and info.segment_code is None:
            info.segment_code = t
        elif RE_SEGMENT_ID.match(t):
            info.segment_id = t
        elif RE_DATA_ELEMENT.match(t):
            info.data_element = t
        elif info.segment_code is not None and info.data_element is None and t not in ("",):
            # Qualifier-Spalte (selten belegt)
            info.data_element = t
    return info


@dataclass
class BodyEntry:
    name: str = ""
    value_pool_entry: str | None = None
    expressions: list[str] = field(default_factory=list)


def parse_body(tc, n_pruefis: int) -> list[BodyEntry]:
    """Zerlegt die Spalte 'Beschreibung + Prüf-IDs' einer Datenzeile."""
    rows = _nested_rows(tc)
    if not rows:
        # Segment-Statuszeilen einspaltiger Tabellen tragen den Ausdruck direkt
        # in der Zelle, ohne verschachtelte Tabelle.
        direkt = _cell_text(tc)
        if not direkt:
            return []
        teile = [t.strip() for t in direkt.split("\t") if t.strip()]
        if len(teile) == n_pruefis:
            return [BodyEntry(expressions=teile)]
        if n_pruefis == 1 and teile:
            return [BodyEntry(expressions=[teile[0]])]
        return []
    entries: list[BodyEntry] = []
    for r in rows:
        texts = [t.strip() for _, _, t in r.inhaltszellen()]
        if len(texts) < n_pruefis:
            continue
        exprs = texts[-n_pruefis:]
        vorne = [t for t in texts[:-n_pruefis] if t]
        entry = BodyEntry(expressions=[e.replace("\n", " ").strip() for e in exprs])
        if len(vorne) >= 2:
            entry.value_pool_entry = vorne[0]
            entry.name = " ".join(vorne[1:])
        elif len(vorne) == 1:
            entry.name = vorne[0]
        entries.append(entry)
    return entries


# --------------------------------------------------------------------------------------
# Tabellenlauf
# --------------------------------------------------------------------------------------

def is_nested_ahb_table(table) -> bool:
    tr = table._tbl.findall(W + "tr")
    if not tr:
        return False
    return read_head(tr[0]) is not None


def read_document(path: str | Path) -> dict[str, dict]:
    """Liest alle verschachtelten AHB-Tabellen eines Dokuments.

    Rückgabe: {pruefidentifikator: {"meta": {...}, "lines": [...]}}
    """
    document = docx.Document(str(path))
    ergebnis: dict[str, dict] = {}

    aktueller_kopf: TableHead | None = None
    section_name = ""
    letzte_segment_id: str | None = None

    for table in document.tables:
        trs = table._tbl.findall(W + "tr")
        if not trs:
            continue

        kopf = read_head(trs[0])
        start = 0
        if kopf is not None:
            aktueller_kopf = kopf
            section_name = ""
            letzte_segment_id = None
            start = 1
            for pruefi in kopf.pruefis:
                ergebnis.setdefault(
                    pruefi,
                    {
                        "meta": {
                            "pruefidentifikator": pruefi,
                            "description": kopf.beschreibung.get(pruefi, ""),
                            "direction": kopf.kommunikation.get(pruefi, ""),
                            "maus_version": "nested-reader/1.0",
                        },
                        "lines": [],
                    },
                )
        if aktueller_kopf is None:
            continue

        n = len(aktueller_kopf.pruefis)

        for tr in trs[start:]:
            tcs = tr.findall(W + "tc")
            if not tcs:
                continue

            struct_tc = tcs[0]
            body_tc = tcs[1] if len(tcs) > 1 else None
            cond_tc = tcs[2] if len(tcs) > 2 else None

            # Zelle ohne verschachtelte Tabelle: entweder Abschnittsüberschrift
            # oder die Statuszeile einer Segmentgruppe (nur "SG4" o. ä.).
            if not struct_tc.findall(W + "tbl"):
                txt = _cell_text(struct_tc).replace("\n", " ").strip()
                if RE_SEGMENT_GROUP.match(txt):
                    info = StructInfo(segment_group_key=txt)
                    letzte_segment_id = None
                else:
                    if txt:
                        section_name = txt
                    continue
            else:
                info = parse_struct(struct_tc)
                if info is None:
                    continue
                # Die Segment-ID steht nur in der Segmentzeile; die zugehörigen
                # Datenelement-Zeilen erben sie (so hält es auch kohlrahbi).
                if info.segment_id:
                    letzte_segment_id = info.segment_id
                elif info.data_element:
                    info.segment_id = letzte_segment_id
            entries = parse_body(body_tc, n) if body_tc is not None else []
            bedingung = _cell_text(cond_tc) if cond_tc is not None else ""

            for entry in entries:
                for pruefi, expr in zip(aktueller_kopf.pruefis, entry.expressions):
                    if not expr:
                        continue
                    ziel = ergebnis[pruefi]["lines"]
                    ziel.append(
                        {
                            "ahb_expression": expr,
                            "conditions": bedingung,
                            "data_element": info.data_element,
                            "guid": str(uuid.uuid5(uuid.NAMESPACE_URL, f"{pruefi}|{len(ziel)}|{info.segment_code}|{info.data_element}|{entry.value_pool_entry}")),
                            "index": len(ziel) + 1,
                            "name": entry.name,
                            "section_name": section_name,
                            "segment_code": info.segment_code,
                            "segment_group_key": info.segment_group_key,
                            "segment_id": info.segment_id,
                            "value_pool_entry": entry.value_pool_entry,
                        }
                    )

    return {p: v for p, v in ergebnis.items() if v["lines"]}


def read_many(paths: Iterable[str | Path]) -> dict[str, dict]:
    gesamt: dict[str, dict] = {}
    for p in paths:
        for pruefi, daten in read_document(p).items():
            if pruefi not in gesamt or len(daten["lines"]) > len(gesamt[pruefi]["lines"]):
                gesamt[pruefi] = daten
    return gesamt


if __name__ == "__main__":
    import json
    import sys

    for pfad in sys.argv[1:]:
        res = read_document(pfad)
        print(f"{Path(pfad).name}: {len(res)} Prüf-IDs")
        for pruefi, daten in sorted(res.items()):
            print(f"   {pruefi}: {len(daten['lines'])} Zeilen  {daten['meta']['description'][:40]!r} {daten['meta']['direction']!r}")
