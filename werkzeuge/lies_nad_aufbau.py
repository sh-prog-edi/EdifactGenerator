#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lies_nad_aufbau.py — liest den qualifierabhängigen Aufbau der NAD-Segmente aus den
BDEW-MIG-Segmentlayouts (UTILMD Strom/Gas, beide Formatstände).

Hintergrund (Protokoll Abschnitt 33): Die Belegung der NAD-Datenelementgruppen hängt
vom Qualifier DE3035 ab — bei der Marktlokationsanschrift (DP/Z59/Z60/Z63) ist C058
benutzt (DE3124, 1. Wiederholung Muss) und C080 „Nicht benutzt", bei den
Kunden-Segmenten (Z09/Z47/Z48/Z65 …) genau umgekehrt. Die pauschale MIG-Feldliste
(mig-formate.js) kennt je Segment+DE nur EINEN Status und kann das nicht abbilden.

Gelesen wird das Segmentlayout der MIG-DOCX: Jeder NAD-Block beginnt mit der
Segmentkopfzeile „NAD", führt in der DE3035-Zeile die Qualifier-Codes (Spalte
Anwendung/Bemerkung) und danach die Datenelementgruppen in Elementreihenfolge
(C082, C058, C080, C059, 3164, C819, 3251, 3207) mit dem BDEW-Status je
Wiederholung (M/R/D/N/O/C).

Ausgabe: _engine/daten/nad-aufbau.js
  var nadAufbau = { "<stand>": { "<format>": { "<qualifier>": {
      "elemente": { "<elementIndex ab 1 hinter dem Qualifier>":
          { "gruppe": "C058", "name": "…", "wdh": [ {"de": "3124", "st": "M"}, … ] } } } } } };

Der Validator (pruefeNadAufbau) prüft damit je NAD-Segment: benutzte/nicht benutzte
Gruppen, Anzahl der Wiederholungen und die Muss-Erstwiederholung.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import docx

GENERATOR = Path("edigen/EdifactGenerator")
QUELLEN = {
    "202604": {
        "UTILMD": {
            "S": "eem/edi_energy_de/FV2604/MIG_UTILMD_S2.1_20250606_20260930_20250606_ooox_10660.docx",
            "G": "eem/edi_energy_de/FV2604/MIG_UTILMD_G1.1_20260401_20260930_20260401_ooox_11961.docx",
        },
    },
    "202610": {
        "UTILMD": {
            "S": "wdb/Wissensdatenbank/Wissensdatenbank/fv2610-migs/MIG_UTILMDS_12270_12270.docx",
            "G": "wdb/Wissensdatenbank/Wissensdatenbank/fv2610-migs/MIG_UTILMDG_12277_12277.docx",
        },
    },
}

#: Zulässige Qualifier-Tokens (DE3035) — gegen das Code-Universum der AHB-Formular-
#: Metas geprüft, damit aus dem Bemerkungstext keine Wörter als Codes gelesen werden.
def lade_qualifier_universum() -> set[str]:
    codes: set[str] = set()
    for datei in GENERATOR.rglob("pruef-ids/_form-meta.js"):
        treffer = re.search(r"^var\s+\w+\s*=\s*(\{.*\});\s*$", datei.read_text(encoding="utf-8"), re.M | re.S)
        if not treffer:
            continue
        for eintrag in json.loads(treffer.group(1)).values():
            for inst in eintrag.get("instanzen", []):
                if inst.get("seg") != "NAD":
                    continue
                for de in inst.get("des", []):
                    if de.get("de") == "3035":
                        codes.update(c[0] for c in (de.get("codes") or []))
    return codes


def dedupliziere(zellen: list[str]) -> list[str]:
    aus: list[str] = []
    for z in zellen:
        if not aus or aus[-1] != z:
            aus.append(z)
    return aus


def lies_bloecke(pfad: Path, universum: set[str]) -> dict:
    """Alle NAD-Blöcke eines MIG: Qualifier -> Elementaufbau."""
    dokument = docx.Document(str(pfad))
    ergebnis: dict[str, dict] = {}
    for tabelle in dokument.tables:
        zeilen = [dedupliziere([re.sub(r"\s+", " ", c.text).strip() for c in r.cells]) for r in tabelle.rows]
        i = 0
        while i < len(zeilen):
            z = zeilen[i]
            # Segmentkopf „NAD" (allein in der ersten Zelle, ohne Beispielapostroph)
            if not (z and z[0] == "NAD"):
                i += 1
                continue
            # Block einlesen bis zum nächsten Segmentkopf oder Beispiel („NAD+…'")
            block: list[list[str]] = []
            j = i + 1
            while j < len(zeilen):
                erste = zeilen[j][0] if zeilen[j] else ""
                if re.fullmatch(r"[A-Z]{3}", erste) or "'" in erste:
                    break
                block.append(zeilen[j])
                j += 1
            eintrag = lies_block(block, universum)
            if eintrag:
                quals, elemente = eintrag
                for q in quals:
                    # Führt ein MIG denselben Qualifier mehrfach (nicht erwartet),
                    # bleibt der erste Block maßgeblich.
                    ergebnis.setdefault(q, elemente)
            i = j
    return ergebnis


def lies_block(block: list[list[str]], universum: set[str]):
    """Ein NAD-Block: ([Qualifier …], {Element -> Aufbau})."""
    quals: list[str] = []
    elemente: dict[str, dict] = {}
    element = 0            # 0 = DE3035; dahinter zählt jedes Composite/Standalone +1
    aktuelle_gruppe: dict | None = None

    def bdew_st(z: list[str]) -> str:
        # Deduplizierte Zeile: [Nr, Name, StdSt, (StdFormat), BdewSt, (BdewFormat), (Bemerkung)]
        # Der BDEW-Status ist der zweite Status-Buchstabe in der Zeile.
        stati = [x for x in z[2:] if re.fullmatch(r"[MRCDONX]", x)]
        return stati[1] if len(stati) >= 2 else (stati[0] if stati else "")

    for z in block:
        if not z:
            continue
        kopf = z[0]
        if kopf == "3035":
            bem = z[-1]
            quals = [t for t in re.findall(r"\b([A-Z]{1,3}\d{0,2})\b", bem) if t in universum]
            continue
        if re.fullmatch(r"C\d{3}", kopf):
            element += 1
            aktuelle_gruppe = {"gruppe": kopf, "name": z[1] if len(z) > 1 else "", "st": bdew_st(z), "wdh": []}
            elemente[str(element)] = aktuelle_gruppe
            continue
        if re.fullmatch(r"\d{4}", kopf):
            # Gruppendatenelemente gehören nur dann zur laufenden Gruppe, wenn ihre
            # DE-Nummer Mitglied der Gruppe ist (C082: 3039/1131/3055; C080 auch
            # 3045); sonst beginnt ein eigenständiges Element (Ort, PLZ, Land …).
            MITGLIEDER = {"C082": {"3039", "1131", "3055"}, "C058": {"3124"},
                          "C080": {"3036", "3045"}, "C059": {"3042"}, "C819": {"3229"}}
            if (aktuelle_gruppe is not None
                    and kopf in MITGLIEDER.get(aktuelle_gruppe["gruppe"], set())):
                aktuelle_gruppe["wdh"].append({"de": kopf, "st": bdew_st(z)})
            else:
                element += 1
                elemente[str(element)] = {"gruppe": kopf, "name": z[1] if len(z) > 1 else "",
                                          "st": bdew_st(z), "wdh": [{"de": kopf, "st": bdew_st(z)}]}
                aktuelle_gruppe = None
            continue
        # sonstige Zeilen (Beschreibungstexte) beenden die laufende Gruppe nicht
    if not quals or not elemente:
        return None
    return quals, elemente


if __name__ == "__main__":
    universum = lade_qualifier_universum()
    print(f"Qualifier-Universum aus den AHB-Metas: {len(universum)} Codes")
    alles: dict[str, dict] = {}
    for stand, formate in QUELLEN.items():
        alles[stand] = {}
        for format_, sparten in formate.items():
            for sparte, pfad in sparten.items():
                schluessel = f"{format_}_{ 'STROM' if sparte == 'S' else 'GAS' }"
                bloecke = lies_bloecke(Path(pfad), universum)
                alles[stand][schluessel] = bloecke
                print(f"{stand} {schluessel}: {len(bloecke)} NAD-Qualifier "
                      f"({', '.join(sorted(bloecke)[:8])}{' …' if len(bloecke) > 8 else ''})")

    rumpf = json.dumps(alles, ensure_ascii=False, separators=(",", ":"))
    ziel = GENERATOR / "_engine" / "daten" / "nad-aufbau.js"
    ziel.write_text(
        "// nad-aufbau.js - qualifierabhängiger Aufbau der NAD-Segmente laut BDEW-MIG.\n"
        "// Maschinell erzeugt (werkzeuge/lies_nad_aufbau.py) aus den Segmentlayouts der\n"
        "// MIG-DOCX (UTILMD Strom/Gas, beide Formatstände) - nicht von Hand pflegen.\n"
        "// Je Qualifier (DE3035): Elemente hinter dem Qualifier mit Datenelementgruppe,\n"
        "// BDEW-Status und Status je Wiederholung (M/R/D/N/O/C).\n"
        "var nadAufbau = " + rumpf + ";\n"
        "if (typeof module !== 'undefined') module.exports = nadAufbau;\n",
        encoding="utf-8",
    )
    print(f"geschrieben: {ziel}")
