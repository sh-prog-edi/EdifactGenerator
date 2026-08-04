"""
Extraktor für das NEUE BDEW-AHB-docx-Layout (ab ca. 04/2026, z.B. MSCONS 3.1g, ORDERS 1.1a).

Strukturmerkmale des neuen Layouts:
- AHB-Tabellen beginnen mit 'EDIFACT Struktur' in der ersten Kopfzelle; der Kopf nennt
  "Prüfidentifikator" gefolgt von einer oder mehreren Prüfi-Nummern.
- Mehrere Prüfis in einer Tabelle teilen sich EINE gemeinsame Ausprägungsspalte.
- Jede Datenzeile: Zellen enthalten verschachtelte Ein-Zeilen-Tabellen:
    links:  [pad, Segmentgruppe, Segment, DE-oder-Segmentzähler, pad]
    mitte:  [pad, Code, Name, pad, Status]  ODER  [pad, Name, pad, Status]
    rechts: Bedingungs-/Hinweistexte (normale Absätze)
- Zeilen ohne verschachtelte Tabelle: Abschnittsname (Segmentname) oder
  Segment-/Gruppenstatus (Ausdruck als Absatztext "\t\tMuss …" in der Mittelzelle).
- Prüfi-Beschreibungen stehen als Absätze "Tabellenspalte = <Label> <Pruefi>" im Dokument.
"""

import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path

import docx
from docx.table import Table
from lxml import etree

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
PRUEFI_RE = re.compile(r"[1-9]\d{4}")
SEGMENT_COUNTER_RE = re.compile(r"^0\d{4}$")


def _text_with_tabs(el) -> str:
    parts = []
    first_p = True
    for node in el.iter():
        tag = etree.QName(node).localname
        if tag == "p":
            if not first_p:
                parts.append("\n")
            first_p = False
        elif tag == "t" and node.text:
            parts.append(node.text)
        elif tag == "tab":
            parts.append("\t")
        elif tag == "br":
            parts.append("\n")
    return "".join(parts)


def _own_paragraph_text(tc) -> str:
    """Text nur aus direkten Absätzen der Zelle (ohne verschachtelte Tabellen)."""
    parts = []
    for p in tc.findall("w:p", NS):
        t = _text_with_tabs(p)
        if t:
            parts.append(t)
    return "\n".join(parts)


def _nested_rows(tc) -> list[list[str]] | None:
    """Alle Zeilen der ersten verschachtelten Tabelle in der Zelle (oder None)."""
    tbl = tc.find(".//w:tbl", NS)
    if tbl is None:
        return None
    rows = []
    for tr in tbl.findall("w:tr", NS):
        rows.append([_text_with_tabs(ntc).strip() for ntc in tr.findall("w:tc", NS)])
    return rows or None


def _nested_row(tc) -> list[str] | None:
    """Erste Zeile der ersten verschachtelten Tabelle in der Zelle (oder None)."""
    rows = _nested_rows(tc)
    return rows[0] if rows else None


@dataclass
class AhbZeile:
    zeilentyp: str  # 'segmentname' | 'segment_status' | 'datenelement'
    section_name: str | None = None
    segment_group_key: str | None = None
    segment_code: str | None = None
    segment_id: str | None = None      # laufende Segmentnummer 0xxxx
    data_element: str | None = None
    value_pool_entry: str | None = None
    name: str | None = None
    ahb_expression: str | None = None
    bedingungen: str | None = None


@dataclass
class Anwendungsfall:
    pruefidentifikator: str
    beschreibung: str
    format: str
    quelldatei: str
    zeilen: list[AhbZeile] = field(default_factory=list)


def parse_header_pruefis(table: Table) -> list[str]:
    tr = table.rows[0]._tr
    tcs = tr.findall("w:tc", NS)
    header_text = "".join(_text_with_tabs(tc) for tc in tcs[1:])
    if "Prüfidentifikator" not in header_text:
        return []
    after = header_text.split("Prüfidentifikator", 1)[1]
    return PRUEFI_RE.findall(after)


def is_new_layout_ahb_table(table: Table) -> bool:
    try:
        tr = table.rows[0]._tr
        first_tc = tr.find("w:tc", NS)
        if first_tc is None:
            return False
        return _text_with_tabs(first_tc).strip().startswith("EDIFACT Struktur")
    except Exception:
        return False


def parse_header_labels(table: Table) -> list[str]:
    """Spaltenlabels für Tabellen OHNE Prüfidentifikator (z.B. APERAK/CONTRL)."""
    tr = table.rows[0]._tr
    tcs = tr.findall("w:tc", NS)
    header_text = "".join(_text_with_tabs(tc) for tc in tcs[1:])
    parts = [p.strip() for p in re.split(r"[\t\n]", header_text)]
    labels = [p for p in parts
              if p and p not in ("Beschreibung", "Bedingung") and len(p) > 2]
    # Silbentrennungs-Fragmente wieder zusammenfügen ("Anerkennungs-" + "meldung")
    merged: list[str] = []
    for p in labels:
        if merged and merged[-1].endswith("-"):
            merged[-1] = merged[-1][:-1] + p
        else:
            merged.append(p)
    return merged


def _count_mid_columns(table: Table) -> int:
    """Anzahl der Ausprägungsspalten anhand einer Datenzeile mit verschachtelter Tabelle."""
    for row in table.rows[1:]:
        tcs = row._tr.findall("w:tc", NS)
        if len(tcs) >= 3 and _nested_row(tcs[0]) is not None:
            return max(1, len(tcs) - 2)
    return 1


_SG_RE = re.compile(r"^SG\d+$")
_SEG_RE = re.compile(r"^[A-Z]{2,3}$")
_DE_RE = re.compile(r"^\d{4}$")


def _parse_left(left: list[str]):
    """Musterbasiert: SGxx | Segmentcode (3 Großbuchstaben) | 0xxxxx-Zähler | 4-stelliges DE"""
    sg = seg = seg_id = de = None
    for v in left:
        v = v.strip()
        if not v:
            continue
        if sg is None and _SG_RE.match(v):
            sg = v
        elif seg is None and _SEG_RE.match(v) and not _SG_RE.match(v):
            seg = v
        elif seg_id is None and SEGMENT_COUNTER_RE.match(v):
            seg_id = v
        elif de is None and _DE_RE.match(v):
            de = v
    return sg, seg, seg_id, de


_MODAL_RE = re.compile(r"^\s*(Muss|Soll|Kann|X)\b|^\s*[MSK]\s*$")
_STATUS_RE = re.compile(r"^\s*(Muss|Soll|Kann|X)(\b|\s|\[|$)|^\s*[MSK]\s*[\[(]")
_SINGLE_STATUS = {"M", "S", "K", "X"}


def _parse_mid(mid: list[str]):
    """Musterbasiert: Status = letzte Zelle mit Modalausdruck (X/Muss/Soll/Kann …),
    davor Code (kurzes Token) und/oder Name (Resttext)."""
    vals = []
    for v in mid:
        for sub in re.split(r"[\n\t]", v):
            sub = sub.strip()
            if sub:
                vals.append(sub)
    if not vals:
        return None, None, None
    status = None
    # Erste Status-Zelle von vorn suchen; alles danach sind Duplikate/Fortsetzungen.
    # Einzelbuchstaben M/S/K gelten nur als Status, wenn ab dort NUR noch
    # Statuszeichen folgen (sonst Codewert, z.B. TAX 5305 Code "S").
    rest = vals
    for i, v in enumerate(vals):
        if _STATUS_RE.match(v) or (
                v in ("M", "S", "K") and i > 0 and
                all(w in _SINGLE_STATUS or _STATUS_RE.match(w) for w in vals[i:])):
            status = v
            rest = vals[:i]
            break
    code = name = None
    if len(rest) >= 2:
        code, name = rest[0], rest[1]
        if len(rest) > 2:
            name = " ".join(rest[1:])
    elif len(rest) == 1:
        name = rest[0]
    # Normalisierung: Label ohne Code -> als Name führen
    if code and not name:
        code, name = None, code
    return code, name, status


def parse_header_labels_nested(table: Table) -> list[str]:
    """Labels aus verschachtelter Kopfzeilen-Tabelle (CONTRL-Variante)."""
    tr = table.rows[0]._tr
    tcs = tr.findall("w:tc", NS)
    for tc in tcs[1:]:
        nested = _nested_row(tc)
        if nested:
            return [c.replace("-\n", "").replace("\n", " ").strip() for c in nested
                    if c.strip() and c.strip() not in ("Beschreibung", "Bedingung")]
    return []


def _make_context(table: Table, fmt: str, source: str,
                  beschreibungen: dict[str, str]):
    """Spalten-/Schlüsselkontext aus einer Kopftabelle ('EDIFACT Struktur')."""
    pruefis = parse_header_pruefis(table)
    n_mid = _count_mid_columns(table)

    # Spalten -> Schlüssel: entweder Prüfis (geteilt oder 1:1) oder Header-Labels
    if pruefis:
        if n_mid == 1 or len(pruefis) != n_mid:
            column_keys: list[list[str]] = [pruefis] + [[] for _ in range(n_mid - 1)]
        else:
            column_keys = [[p] for p in pruefis]
        key_beschreibung = {p: beschreibungen.get(p, "") for p in pruefis}
        n_status_per_mid = 1
    else:
        labels = parse_header_labels_nested(table) or parse_header_labels(table)
        if not labels:
            return []
        keys = [f"{fmt}_{re.sub(r'[^A-Za-zÄÖÜäöüß0-9]+', '_', l).strip('_')[:40]}" for l in labels]
        if n_mid == len(keys):
            column_keys = [[k] for k in keys]
            n_status_per_mid = 1
        else:
            # eine Mittelzelle, mehrere Statusspalten darin (CONTRL) bzw.
            # tab-separierte Statusangaben (APERAK)
            column_keys = [keys] + [[] for _ in range(n_mid - 1)]
            n_status_per_mid = len(keys)
        key_beschreibung = {k: l for k, l in zip(keys, labels)}

    all_keys = [k for col in column_keys for k in col]
    if not all_keys:
        return None
    awf_by_key = {k: Anwendungsfall(k, key_beschreibung.get(k, ""), fmt, source) for k in all_keys}
    return {"column_keys": column_keys, "all_keys": all_keys,
            "awf_by_key": awf_by_key, "n_status_per_mid": n_status_per_mid,
            "current_section": None}


# Status ggf. mit Bedingungsausdruck: "X", "Muss [12]", "X [1P0..1]",
# "X [26] ⊻ ([70] ∧ ([65] ⊻ ..." (auch unvollständig umbrochen)
STATUS_TOKEN_RE = re.compile(r"^(X|Muss|Soll|Kann|[MSK])(\s*(\[[^\]]*\]|[∧∨⊻()]|V\b))*\s*$")


def _ist_expr_frag(t: str) -> bool:
    """Token besteht nur aus Bedingungssyntax ([12], [UB3], (…), Operatoren)."""
    return (bool(re.match(r"^(\s|[∧∨⊻().,\d]|V\b|\[[^\]]*\])+$", t))
            and any(c in t for c in "[]()∧∨⊻"))
_CODEISH_RE = re.compile(r"^[A-Za-z0-9_.\-]{1,18}$")


def is_continuation_table(table: Table) -> bool:
    """Fortsetzungstabelle im Tab-Dialekt (INVOIC 1.0a u.a.): AHB über viele kleine
    Tabellen verteilt; erste Zelle = Abschnittsname, weitere Zeilen 'SEG\\t0xxxx'."""
    try:
        if not (3 <= len(table.columns) <= 5):
            return False
        tr0 = table.rows[0]._tr
        tc0 = tr0.find("w:tc", NS)
        if tc0 is None or tc0.find(".//w:tbl", NS) is not None:
            return False
        first = _own_paragraph_text(tc0).strip()
        if not first or first.startswith("EDIFACT Struktur"):
            return False
        for row in table.rows:
            tcs = row._tr.findall("w:tc", NS)
            if not tcs or tcs[0].find(".//w:tbl", NS) is not None:
                return False
            own = _own_paragraph_text(tcs[0]).strip()
            if "\t" in own:
                sg, seg, seg_id, de = _parse_left([p.strip() for p in own.split("\t")])
                if seg and (seg_id or de):
                    return True
        return False
    except Exception:
        return False


def _parse_rows(ctx: dict, rows) -> None:
    column_keys = ctx["column_keys"]
    all_keys = ctx["all_keys"]
    awf_by_key = ctx["awf_by_key"]
    n_status_per_mid = ctx["n_status_per_mid"]

    def add(keys: list[str], zeile: AhbZeile):
        for k in keys:
            awf_by_key[k].zeilen.append(zeile)

    current_section = ctx["current_section"]
    for row in rows:
        tr = row._tr
        tcs = tr.findall("w:tc", NS)
        if not tcs:
            continue
        left = _nested_row(tcs[0])
        bed = _own_paragraph_text(tcs[-1]).strip() if len(tcs) > 2 else ""
        mid_tcs = tcs[1:-1] if len(tcs) > 2 else tcs[1:]

        if left is None:
            own = _own_paragraph_text(tcs[0]).strip()

            def tab_zeilen(sg, seg, seg_id, de, mid_text, last_zeilen, kontinuation=False):
                """Tab-Dialekt: Zeilen einer Mittelzelle verarbeiten (Codes, Namen,
                Statusspalten, Umbruch-Fragmente). Gibt last_zeilen zurück."""
                for line in [l for l in mid_text.split("\n") if l.strip()]:
                    tokens = [t.strip() for t in line.split("\t") if t.strip()]
                    statuses = []
                    while tokens and STATUS_TOKEN_RE.match(tokens[-1]):
                        statuses.insert(0, tokens.pop())
                    # Umbruch-Fortsetzung: kein Status und kein neuer Code ->
                    # Fragmente an die vorherige Zeile anhängen (Bedingungssyntax an
                    # den Ausdruck, Text an den Namen)
                    if not statuses and last_zeilen and tokens and (
                            len(tokens) == 1 or not _CODEISH_RE.match(tokens[0])):
                        efrag = " ".join(t for t in tokens if _ist_expr_frag(t))
                        nfrag = " ".join(t for t in tokens if not _ist_expr_frag(t))
                        uniq = []
                        for z in last_zeilen:
                            if not any(z is u for u in uniq):
                                uniq.append(z)
                        for z in uniq:
                            if efrag:
                                z.ahb_expression = ((z.ahb_expression or "") + " " + efrag).strip()
                            if nfrag:
                                z.name = ((z.name or "") + " " + nfrag).strip()
                        continue
                    code = tokens[0] if len(tokens) > 1 else None
                    name = tokens[-1] if tokens else None
                    last_zeilen = []
                    # Fortsetzungszelle ohne linke Angaben: reine Statuszeilen NICHT
                    # dem vorherigen Segment zuordnen (Kontext gilt nur für Codes)
                    z_sg, z_seg, z_id, z_de = (sg, seg, seg_id, de)
                    if kontinuation and not tokens:
                        z_sg = z_seg = z_id = z_de = None
                    if len(statuses) == len(all_keys):
                        for k, st in zip(all_keys, statuses):
                            z = AhbZeile(
                                zeilentyp="datenelement" if z_de else "segment_status",
                                section_name=current_section,
                                segment_group_key=z_sg,
                                segment_code=z_seg, segment_id=z_id, data_element=z_de,
                                value_pool_entry=code, name=name,
                                ahb_expression=st, bedingungen=bed or None)
                            awf_by_key[k].zeilen.append(z)
                            last_zeilen.append(z)
                    elif statuses or name:
                        z = AhbZeile(
                            zeilentyp="datenelement" if z_de else "segment_status",
                            section_name=current_section,
                            segment_group_key=z_sg,
                            segment_code=z_seg, segment_id=z_id, data_element=z_de,
                            value_pool_entry=code, name=name,
                            ahb_expression=" / ".join(statuses) or None,
                            bedingungen=bed or None)
                        add(all_keys, z)
                        last_zeilen.append(z)
                return last_zeilen

            if own and ("\t" in own or _SG_RE.match(own.strip())):
                # Tab-Variante (APERAK/INVOIC 1.0a/IFTSTA 2.0h): reine Tab-Struktur,
                # links "SEG\tDE", "SEG\t0xxxx", "SGx\tSEG\tDE" oder Gruppenstatus "SGx".
                lparts = [p.strip() for p in own.split("\t") if p.strip()]
                sg, seg, seg_id, de = _parse_left(lparts)
                mid_text = _own_paragraph_text(mid_tcs[0]) if mid_tcs else ""
                lz = tab_zeilen(sg, seg, seg_id, de, mid_text, [])
                ctx["tabctx"] = {"sg": sg, "seg": seg, "seg_id": seg_id, "de": de, "lz": lz}
            elif not own and ctx.get("tabctx") and mid_tcs and \
                    "\t" in _own_paragraph_text(mid_tcs[0]):
                # Tab-Dialekt: Zeile ohne linke Zelle = Fortsetzung der vorherigen
                # (z.B. lange Codelisten über Seitenumbrüche hinweg)
                tk = ctx["tabctx"]
                mid_text = _own_paragraph_text(mid_tcs[0])
                tk["lz"] = tab_zeilen(tk["sg"], tk["seg"], tk["seg_id"], tk["de"],
                                      mid_text, tk["lz"], kontinuation=True)
            elif own:
                if own.startswith("EDIFACT Struktur") or own.startswith("Beschreibung"):
                    continue  # wiederholte Kopfzeile bei Tabellen-/Seitenumbruch
                current_section = own
                ctx["tabctx"] = None  # neuer Abschnitt beendet die Zellen-Fortsetzung
                add(all_keys, AhbZeile(zeilentyp="segmentname", section_name=own))
            else:
                for j, tc in enumerate(mid_tcs):
                    expr = _own_paragraph_text(tc).strip()
                    keys = column_keys[j] if j < len(column_keys) else all_keys
                    if expr and keys:
                        add(keys, AhbZeile(zeilentyp="segment_status",
                                           section_name=current_section,
                                           ahb_expression=expr,
                                           bedingungen=bed or None))
            continue

        left_rows = _nested_rows(tcs[0]) or [left]
        for j, tc in enumerate(mid_tcs):
            keys = column_keys[j] if j < len(column_keys) else all_keys
            if not keys:
                continue
            mid_rows = _nested_rows(tc)
            if mid_rows is not None and n_status_per_mid == 1:
                # Zeilenpaare (links_i, mitte_i); fehlende linke Zeilen erben die letzte Struktur
                sg = seg = seg_id = de = None
                for i, mid in enumerate(mid_rows):
                    li = left_rows[i] if i < len(left_rows) else None
                    if li is not None:
                        n_sg, n_seg, n_id, n_de = _parse_left(li)
                        sg = n_sg or sg
                        seg = n_seg or seg
                        seg_id = n_id or seg_id
                        de = n_de if n_de else (de if li == [""] * len(li) or not any(x.strip() for x in li) else de)
                        if n_de:
                            de = n_de
                    code, name, status = _parse_mid(mid)
                    status_clean = (status or "").strip() or None
                    if code is None and name is None and status_clean and _MODAL_RE.match(status_clean):
                        add(keys, AhbZeile(zeilentyp="segment_status",
                                           section_name=current_section,
                                           segment_group_key=sg, segment_code=seg,
                                           segment_id=seg_id,
                                           ahb_expression=status_clean,
                                           bedingungen=bed or None))
                        continue
                    if code is None and name and _MODAL_RE.match(name.strip()) and de is None:
                        add(keys, AhbZeile(zeilentyp="segment_status",
                                           section_name=current_section,
                                           segment_group_key=sg, segment_code=seg,
                                           segment_id=seg_id,
                                           ahb_expression=name.strip(),
                                           bedingungen=bed or None))
                        continue
                    if code is None and name is None and status_clean is None:
                        continue
                    add(keys, AhbZeile(zeilentyp="datenelement", section_name=current_section,
                                       segment_group_key=sg, segment_code=seg,
                                       segment_id=seg_id, data_element=de,
                                       value_pool_entry=code, name=name,
                                       ahb_expression=status_clean,
                                       bedingungen=bed or None))
                continue
            sg, seg, seg_id, de = _parse_left(left_rows[0] if left_rows else [])
            mid = mid_rows[0] if mid_rows else None
            if mid is not None:
                if n_status_per_mid > 1:
                    # CONTRL-Variante: eine Mittelzelle, Statusspalte je Schlüssel am
                    # Ende; MEHRERE verschachtelte Zeilen = mehrere Codes mit
                    # spaltenweiser Zuordnung (z.B. UCI 0083: 7 nur Bestätigung, 4 Rest)
                    m_sg = m_seg = m_id = m_de = None
                    for i, mrow in enumerate(mid_rows):
                        li = left_rows[i] if i < len(left_rows) else None
                        if li is not None:
                            n_sg, n_seg, n_id, n_de = _parse_left(li)
                            m_sg = n_sg or m_sg
                            m_seg = n_seg or m_seg
                            m_id = n_id or m_id
                            if n_de:
                                m_de = n_de
                        e_sg, e_seg, e_id, e_de = (m_sg or sg, m_seg or seg, m_id or seg_id, m_de or de)
                        cells = mrow[1:] if mrow and mrow[0] == "" else list(mrow)
                        # Statusspalten: entweder direkt hintereinander (CONTRL) oder
                        # durch Leerzellen getrennt (APERAK: X | pad | X)
                        n = n_status_per_mid
                        tail = cells[-(2 * n - 1):]
                        if (n > 1 and len(tail) == 2 * n - 1
                                and all(tail[i] == "" for i in range(1, 2 * n - 1, 2))
                                and any(tail[i] for i in range(0, 2 * n - 1, 2))
                                and all(tail[i] == "" or STATUS_TOKEN_RE.match(tail[i])
                                        for i in range(0, 2 * n - 1, 2))):
                            statuses = tail[0::2]
                            rest = [c for c in cells[:-(2 * n - 1)] if c]
                        else:
                            statuses = cells[-n:]
                            rest = [c for c in cells[:-n] if c]
                        code = rest[0] if len(rest) > 1 else None
                        name = rest[-1] if rest else None
                        if name and _MODAL_RE.match(name.strip()) and e_de is None and code is None:
                            # Statuszeile: alle Zellen sind Modalausdrücke
                            mods = [c for c in cells if c]
                            for k, st in zip(keys, mods[-len(keys):] if len(mods) >= len(keys) else mods * len(keys)):
                                awf_by_key[k].zeilen.append(AhbZeile(
                                    zeilentyp="segment_status", section_name=current_section,
                                    segment_group_key=e_sg, segment_code=e_seg, segment_id=e_id,
                                    ahb_expression=st.strip() or None, bedingungen=bed or None))
                            continue
                        for k, st in zip(keys, statuses):
                            st_clean = (st or "").strip() or None
                            if st_clean or (name and not code):
                                awf_by_key[k].zeilen.append(AhbZeile(
                                    zeilentyp="datenelement", section_name=current_section,
                                    segment_group_key=e_sg, segment_code=e_seg,
                                    segment_id=e_id, data_element=e_de,
                                    value_pool_entry=code if st_clean else None,
                                    name=name if st_clean or not code else None,
                                    ahb_expression=st_clean, bedingungen=bed or None))
                    continue
                code, name, status = _parse_mid(mid)
                status_clean = (status or "").strip() or None
                if code is None and name and _MODAL_RE.match(name.strip()) and de is None:
                    add(keys, AhbZeile(zeilentyp="segment_status",
                                       section_name=current_section,
                                       segment_group_key=sg, segment_code=seg,
                                       segment_id=seg_id,
                                       ahb_expression=name.strip(),
                                       bedingungen=bed or None))
                    continue
                add(keys, AhbZeile(zeilentyp="datenelement", section_name=current_section,
                                   segment_group_key=sg, segment_code=seg,
                                   segment_id=seg_id, data_element=de,
                                   value_pool_entry=code, name=name,
                                   ahb_expression=status_clean,
                                   bedingungen=bed or None))
            else:
                expr = _own_paragraph_text(tc).strip()
                if expr or sg or seg:
                    add(keys, AhbZeile(zeilentyp="segment_status",
                                       section_name=current_section,
                                       segment_group_key=sg, segment_code=seg,
                                       segment_id=seg_id, data_element=de,
                                       ahb_expression=expr or None,
                                       bedingungen=bed or None))
    ctx["current_section"] = current_section


def parse_new_layout_table(table: Table, fmt: str, source: str,
                           beschreibungen: dict[str, str]) -> list[Anwendungsfall]:
    ctx = _make_context(table, fmt, source, beschreibungen)
    if ctx is None:
        return []
    _parse_rows(ctx, table.rows[1:])
    return list(ctx["awf_by_key"].values())


def collect_beschreibungen(doc) -> dict[str, str]:
    result = {}
    for para in doc.paragraphs:
        t = para.text.strip()
        if t.startswith("Tabellenspalte"):
            m = PRUEFI_RE.search(t)
            if m:
                label = t.split("=", 1)[-1]
                label = PRUEFI_RE.sub("", label).strip(" =\t")
                result[m.group(0)] = label
    return result


def extract_from_docx(docx_path: Path, fmt: str) -> dict[str, Anwendungsfall]:
    from kohlrahbi.read_functions import get_all_paragraphs_and_tables
    doc = docx.Document(str(docx_path))
    beschreibungen = collect_beschreibungen(doc)
    result: dict[str, Anwendungsfall] = {}

    def close(ctx):
        if not ctx:
            return
        for awf in ctx["awf_by_key"].values():
            if awf.pruefidentifikator in result:
                result[awf.pruefidentifikator].zeilen.extend(awf.zeilen)
            else:
                result[awf.pruefidentifikator] = awf

    ctx = None
    for item in get_all_paragraphs_and_tables(doc):
        if not isinstance(item, Table):
            continue  # Absätze (Überschriften) unterbrechen die Fortsetzung nicht
        if is_new_layout_ahb_table(item):
            close(ctx)
            ctx = _make_context(item, fmt, docx_path.name, beschreibungen)
            if ctx is not None:
                _parse_rows(ctx, item.rows[1:])
        elif ctx is not None and is_continuation_table(item):
            _parse_rows(ctx, item.rows)
        elif ctx is not None:
            close(ctx)
            ctx = None
    close(ctx)
    return result


def dump_outputs(awfs: dict[str, Anwendungsfall], out_root: Path, fmt: str) -> None:
    import csv
    import xlsxwriter

    cols = ["zeilentyp", "section_name", "segment_group_key", "segment_code",
            "segment_id", "data_element", "value_pool_entry", "name",
            "ahb_expression", "bedingungen"]
    header_de = ["Zeilentyp", "Abschnitt", "Segmentgruppe", "Segment", "Segment-Nr",
                 "Datenelement", "Code/Wert", "Name", "AHB-Ausdruck", "Bedingungen"]

    for pruefi, awf in sorted(awfs.items()):
        base = out_root / fmt
        (base / "json").mkdir(parents=True, exist_ok=True)
        (base / "csv").mkdir(parents=True, exist_ok=True)
        (base / "xlsx").mkdir(parents=True, exist_ok=True)

        with open(base / "json" / f"{pruefi}.json", "w", encoding="utf-8") as f:
            json.dump({"meta": {"pruefidentifikator": pruefi,
                                "beschreibung": awf.beschreibung,
                                "format": fmt,
                                "quelldatei": awf.quelldatei,
                                "layout": "bdew-neu-2026"},
                       "lines": [asdict(z) for z in awf.zeilen]},
                      f, ensure_ascii=False, indent=2)

        with open(base / "csv" / f"{pruefi}.csv", "w", encoding="utf-8-sig", newline="") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(header_de)
            for z in awf.zeilen:
                w.writerow([getattr(z, c) or "" for c in cols])

        wb = xlsxwriter.Workbook(str(base / "xlsx" / f"{pruefi}.xlsx"))
        ws = wb.add_worksheet(pruefi[:31])  # Excel-Blattnamen: max. 31 Zeichen
        bold = wb.add_format({"bold": True, "bg_color": "#D8DFE4"})
        for ci, h in enumerate(header_de):
            ws.write(0, ci, h, bold)
        for ri, z in enumerate(awf.zeilen, start=1):
            for ci, c in enumerate(cols):
                ws.write(ri, ci, getattr(z, c) or "")
        ws.autofit()
        wb.close()


if __name__ == "__main__":
    import sys
    p = Path(sys.argv[1])
    fmt = sys.argv[2] if len(sys.argv) > 2 else p.name.split("_")[1]
    out = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    res = extract_from_docx(p, fmt)
    print(f"{p.name}: {len(res)} Anwendungsfälle: {sorted(res)}")
    if out:
        dump_outputs(res, out, fmt)
        print(f"-> Ausgaben unter {out}/{fmt}/")
    else:
        for pruefi, awf in sorted(res.items())[:1]:
            print(f"--- {pruefi} ({awf.beschreibung}): {len(awf.zeilen)} Zeilen")
            for z in awf.zeilen[:14]:
                print("   ", z.zeilentyp[:12].ljust(12),
                      str(z.segment_group_key or "").ljust(4),
                      str(z.segment_code or "").ljust(4),
                      str(z.data_element or "").ljust(5),
                      str(z.value_pool_entry or "")[:16].ljust(16),
                      str(z.name or z.section_name or "")[:30].ljust(30),
                      str(z.ahb_expression or "")[:22])
