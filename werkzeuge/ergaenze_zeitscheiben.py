#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ergaenze_zeitscheiben.py — ergänzt in der Feldauswahl-Datenschicht der kuratierten
UTILMD-Masken (`pruef-ids/_regeln.js`) die Felder für den Verwendungszeitraum der
Daten (SG6 RFF + DTM+Z25/Z26).

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

Seit dem Feldauswahl-Umbau (Phase 2) liegen die Regeln als EINE Datendatei je Ziel;
gelesen und geschrieben wird über werkzeuge/regeln_io.py (formatstabil).
"""

from __future__ import annotations

import json
from pathlib import Path

import regeln_io

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


def optionen(codes: list[str]) -> list[dict]:
    return [{"v": "", "t": "– keine Angabe –"}] + [
        {"v": c, "t": f"{c} – {QUALITAET[c]}"} for c in codes
    ]


def felder(codes: list[str]) -> list[dict]:
    opt = optionen(codes)
    return [
        {"id": "RFF_VZ_QUALITAET", "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
         "status": "Kann", "isSelect": True, "options": opt,
         "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"},
        {"id": "RFF_VZ_QUALITAET_2", "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
         "status": "Kann", "isSelect": True, "options": opt,
         "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"},
        {"id": "DTM_Z25_2", "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
         "status": "Kann", "isDate": True,
         "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"},
        {"id": "DTM_Z26_2", "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
         "status": "Kann", "isDate": True,
         "rule": "AHB: zweiter Verwendungszeitraum [471]"},
    ]


def bearbeite(regel: dict, stand: str, pruefi: str) -> bool:
    """Ersetzt die Zeitscheiben-Felder einer Prüf-ID, wenn die AHB-Datenbasis
    Qualitätscodes liefert. Liefert sie keine (oder führt die Prüf-ID keinen
    Verwendungszeitraum), bleibt der Eintrag UNVERÄNDERT — bestehende Felder
    werden nie ersatzlos entfernt (Schutz vor unvollständiger Datenbasis)."""
    segmente = regel.get("segments") or []
    ohne = [s for s in segmente if s.get("id") not in FELD_IDS]
    if not any(s.get("id") == "DTM_Z25" for s in ohne):
        return False
    codes = zeitraum_codes(stand, pruefi)
    if not codes:
        return False
    # hinter dem letzten Eintrag des ersten Verwendungszeitraums einfügen
    letzte = max(i for i, s in enumerate(ohne) if s.get("id") in ("DTM_Z25", "DTM_Z26"))
    neu = ohne[:letzte + 1] + felder(codes) + ohne[letzte + 1:]
    if neu == segmente:
        return False   # unverändert — Datei nicht als geändert zählen
    regel["segments"] = neu
    return True


if __name__ == "__main__":
    gesamt = 0
    for rel in ORDNER:
        stand = rel.split("/")[0]
        pfad = GENERATOR / rel / "pruef-ids" / "_regeln.js"
        kopf, regeln = regeln_io.lade(pfad)
        n = 0
        for pruefi in sorted(regeln):
            if bearbeite(regeln[pruefi], stand, pruefi):
                n += 1
        if n:
            regeln_io.schreibe(pfad, kopf, regeln)
        print(f"{rel:38s} {n} Prüf-IDs mit Verwendungszeitraum ergänzt")
        gesamt += n
    print(f"\nGesamt: {gesamt} Prüf-IDs")
