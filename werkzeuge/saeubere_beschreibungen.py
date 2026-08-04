#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
saeubere_beschreibungen.py — setzt die Bezeichnung je Prüf-ID in den `_form-meta.js`
aus der Anwendungsübersicht.

Die Bezeichnungen der AHB-Extraktion tragen Trennartefakte aus dem DOCX-Zeilenumbruch
(„Bestätigun g Anmeldung", „Informations meldung"). Die Anwendungsübersicht führt
denselben Text sauber als Zellwert. Da die Formular-Metas nach der Konsolidierung die
einzige Datenhaltung der AHB-Struktur sind, wird die Bezeichnung dort korrigiert —
Formular, Vollformular und Validator zeigen dann denselben, lesbaren Text.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import openpyxl

GENERATOR = Path("edigen/EdifactGenerator")
UEBERSICHT = {
    "202604": Path("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/Anwendungsuebersicht_3.3_LF_12258.xlsx"),
    "202610": Path("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/Anwendungsuebersicht_4.0_LF_12260.xlsx"),
}


def lade_bezeichnungen(formatstand: str) -> dict[str, str]:
    pfad = UEBERSICHT.get(formatstand)
    if not pfad or not pfad.exists():
        return {}
    wb = openpyxl.load_workbook(pfad, read_only=True, data_only=True)
    ws = wb["Prüf-ID Prozessschritt"]
    zeilen = list(ws.iter_rows(values_only=True))
    kopf = zeilen[0]
    i_pid = next((i for i, k in enumerate(kopf) if k and str(k).startswith("Prüfidentifikator")), None)
    i_bez = next((i for i, k in enumerate(kopf) if k and str(k).startswith("Beschreibung des")), None)
    if i_pid is None or i_bez is None:
        return {}
    namen: dict[str, str] = {}
    for z in zeilen[1:]:
        pid = str(z[i_pid] or "").strip()
        bez = " ".join(str(z[i_bez] or "").split())
        if re.fullmatch(r"\d{5}", pid) and bez:
            namen.setdefault(pid, bez)
    return namen


def js_sicher(rumpf: str) -> str:
    return rumpf.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")


def bearbeite(datei: Path, namen: dict[str, str]) -> int:
    text = datei.read_text(encoding="utf-8")
    treffer = re.search(r"^(var\s+\w+\s*=\s*)(\{.*\})(;\s*)$", text, re.M | re.S)
    if not treffer:
        return 0
    daten = json.loads(treffer.group(2))
    geaendert = 0
    for pruefi, eintrag in daten.items():
        sauber = namen.get(pruefi)
        if not sauber:
            # ohne Übersichtseintrag wenigstens Zeilenumbrüche normalisieren
            alt = " ".join((eintrag.get("beschreibung") or "").split())
            if alt != eintrag.get("beschreibung"):
                eintrag["beschreibung"] = alt
                geaendert += 1
            continue
        if eintrag.get("beschreibung") != sauber:
            eintrag["beschreibung"] = sauber
            geaendert += 1
    if not geaendert:
        return 0
    rumpf = js_sicher(json.dumps(daten, ensure_ascii=False, separators=(",", ":")))
    datei.write_text(text[:treffer.start(2)] + rumpf + text[treffer.end(2):], encoding="utf-8")
    return geaendert


if __name__ == "__main__":
    gesamt = 0
    for stand in ("202604", "202610"):
        namen = lade_bezeichnungen(stand)
        for datei in sorted((GENERATOR / stand).rglob("pruef-ids/_*meta.js")):
            n = bearbeite(datei, namen)
            if n:
                print(f"{datei.relative_to(GENERATOR)}: {n} Bezeichnungen gesetzt")
            gesamt += n
    print(f"\nGesamt: {gesamt} Bezeichnungen aus der Anwendungsübersicht übernommen")
