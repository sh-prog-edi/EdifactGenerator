#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ergaenze_zeitscheiben.py — ergänzt in den kuratierten UTILMD-Regeldateien die Felder
für den Verwendungszeitraum der Daten (SG6 RFF + DTM+Z25/Z26).

Der AHB führt die Gruppe als Wiederholung mit fortlaufender Zeitraum-ID ([126]); die
Praxis nach einem Lieferbeginn kennt zwei Zeitscheiben: „Keine Daten" (Z53) bis zum
Lieferbeginn und „Gültige Daten" (Z49) ab dem Lieferbeginn. Die Rückmeldungen des
Datenclearings führen statt dessen Z47/Z54 (im System vorhanden / nicht vorhanden)
und Z48/Z55 (erwartet / nicht erwartet). Welche Qualitäten zur Auswahl stehen, wird
je Prüf-ID aus der AHB-Datenbasis übernommen.

Ergänzt werden je Prüf-ID mit Verwendungszeitraum:
  RFF_VZ_QUALITAET    Qualität des ersten Zeitraums (Auswahl aus dem AHB)
  RFF_VZ_QUALITAET_2  Qualität des zweiten Zeitraums
  DTM_Z25_2 / DTM_Z26_2   Verwendung der Daten ab/bis des zweiten Zeitraums
Alle Felder sind optional; bleiben sie leer, ändert sich die erzeugte Nachricht nicht.
Das Skript ist wiederholbar: vorhandene Einträge werden ersetzt.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

GENERATOR = Path("edigen/EdifactGenerator")
AHBDATEN = {"202604": Path("ahbdaten/FV2604"), "202610": Path("ahbdaten/FV2610")}
ORDNER = [
    "202604/Stammdaten/UTILMD/Strom", "202604/Stammdaten/UTILMD/Gas",
    "202610/Stammdaten/UTILMD/Strom", "202610/Stammdaten/UTILMD/Gas",
]

#: Qualitätsangaben des Verwendungszeitraums (DE1153) mit Klartext.
QUALITAET = {
    "Z47": "Im System vorhandene Daten",
    "Z48": "Erwartete Daten",
    "Z49": "Gültige Daten",
    "Z53": "Keine Daten",
    "Z54": "Im System keine Daten vorhanden",
    "Z55": "Keine Daten erwartet",
}

FELD_IDS = ("RFF_VZ_QUALITAET", "RFF_VZ_QUALITAET_2", "DTM_Z25_2", "DTM_Z26_2")


def zeitraum_codes(stand: str, pruefi: str) -> list[str]:
    datei = AHBDATEN[stand] / f"{pruefi}.json"
    if not datei.exists():
        return []
    daten = json.loads(datei.read_text(encoding="utf-8"))
    codes: list[str] = []
    for zeile in daten.get("lines", []):
        if zeile.get("segment_code") == "RFF" and zeile.get("data_element") == "1153":
            code = zeile.get("value_pool_entry")
            if code in QUALITAET and code not in codes:
                codes.append(code)
    return sorted(codes)


def optionen(codes: list[str]) -> str:
    teile = ['{ v: "", t: "– keine Angabe –" }']
    teile += [f'{{ v: "{c}", t: "{c} – {QUALITAET[c]}" }}' for c in codes]
    return "[" + ", ".join(teile) + "]"


def felder(codes: list[str]) -> str:
    opt = optionen(codes)
    return (
        f'        {{ id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", '
        f'status: "Kann", isSelect: true, options: {opt}, '
        f'rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" }},\n'
        f'        {{ id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", '
        f'status: "Kann", isSelect: true, options: {opt}, '
        f'rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" }},\n'
        f'        {{ id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", '
        f'status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" }},\n'
        f'        {{ id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", '
        f'status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" }},\n'
    )


def bearbeite(datei: Path, stand: str) -> bool:
    text = datei.read_text(encoding="utf-8")
    # vorhandene Ergänzungen entfernen (Wiederholbarkeit)
    text = re.sub(r'^[ \t]*\{ id: "(?:' + "|".join(FELD_IDS) + r')",[^\n]*\n', "", text, flags=re.M)
    if 'id: "DTM_Z25"' not in text:
        return False
    codes = zeitraum_codes(stand, datei.stem)
    if not codes:
        return False
    # hinter der letzten Zeile des ersten Verwendungszeitraums einfügen
    muster = re.compile(r'^([ \t]*\{ id: "DTM_Z2[56]",[^\n]*)\n', re.M)
    treffer = list(muster.finditer(text))
    if not treffer:
        return False
    letzte = treffer[-1]
    zeile = letzte.group(1)
    # fehlendes Komma ergänzen, wenn der Eintrag der letzte im Array war
    ersatz = zeile if zeile.rstrip().endswith(",") else zeile.rstrip() + ","
    text = text[:letzte.start()] + ersatz + "\n" + felder(codes) + text[letzte.end():]
    datei.write_text(text, encoding="utf-8")
    return True


if __name__ == "__main__":
    gesamt = 0
    for rel in ORDNER:
        stand = rel.split("/")[0]
        ordner = GENERATOR / rel / "pruef-ids"
        n = 0
        for datei in sorted(ordner.glob("[0-9]*.js")):
            if bearbeite(datei, stand):
                n += 1
        print(f"{rel:38s} {n} Prüf-IDs mit Verwendungszeitraum ergänzt")
        gesamt += n
    print(f"\nGesamt: {gesamt} Regeldateien")
