#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ergaenze_bedingungstexte.py — sorgt dafür, dass die Bedingungs-Hilfe zu jedem im
Formular angezeigten Verweis [nn] auch den Klartext findet.

Zwei Befunde vom 28.07.2026:

1. Die vier UTILMD-Bedingungsdateien stellen ihre Texte nicht unter
   `window.EdiBedingungen` bereit — anders als alle übrigen Nachrichtentypen. Die
   Hilfe hätte dort selbst mit Fragezeichen-Symbol nur „Text noch nicht hinterlegt"
   angezeigt. Ergänzt wird eine Brücke, die `bedingungTexte`, die abgeleitete Art und
   die vorhandene Prüflogik übernimmt.

2. In den übrigen Ordnern fehlen einzelne Bedingungen, die in den Formularen
   referenziert werden. Ihre Texte stehen in den AHB-Rohdaten (Feld `conditions`) und
   werden von dort nachgetragen.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

GENERATOR = Path("edigen/EdifactGenerator")
AHBDATEN = {"202604": Path("ahbdaten/FV2604"), "202610": Path("ahbdaten/FV2610")}

RE_NUMMER = re.compile(r"\[([0-9]{1,4}|UB[0-9]+|[0-9]+P[0-9.]+)\]")
RE_BEDINGUNG = re.compile(r"\[(\d+[A-Za-z]?)\]\s*(.*?)(?=\s*\[\d+[A-Za-z]?\]|\Z)", re.S)

BRUECKE = """
// Bedingungs-Hilfe (Fragezeichen-Symbol an den Bedingungsausdrücken): sie erwartet die
// Texte unter window.EdiBedingungen als { "nn": { text, art, check } }. Diese Datei
// führt sie in eigenen Strukturen; die folgende Brücke stellt sie bereit, ohne an der
// bestehenden Verwendung etwas zu ändern.
if (typeof window !== 'undefined') {
    window.EdiBedingungen = window.EdiBedingungen || {};
    Object.keys(bedingungTexte).forEach(function (nr) {
        if (window.EdiBedingungen[nr]) return;
        var eintrag = { text: bedingungTexte[nr] };
        try { eintrag.art = bedingungsart(nr); } catch (e) { eintrag.art = 'sonstige'; }
        if (typeof bedingungLogik !== 'undefined' && bedingungLogik[nr])
            eintrag.check = bedingungLogik[nr];
        window.EdiBedingungen[nr] = eintrag;
    });
}
"""


def texte_aus_ahbdaten(pruefids: list[str], formatstand: str) -> dict[str, str]:
    """Sammelt Bedingungstexte aus den extrahierten AHB-Daten der Prüf-IDs."""
    quelle = AHBDATEN[formatstand]
    texte: dict[str, str] = {}
    for pruefi in pruefids:
        datei = quelle / f"{pruefi}.json"
        if not datei.exists():
            continue
        daten = json.loads(datei.read_text(encoding="utf-8"))
        for zeile in daten["lines"]:
            roh = zeile.get("conditions") or ""
            if not roh:
                continue
            for nr, text in RE_BEDINGUNG.findall(roh):
                text = " ".join(text.split())
                if text and (nr not in texte or len(text) > len(texte[nr])):
                    texte[nr] = text
    return texte


def vorhandene_nummern(bed_datei: Path) -> set[str]:
    if not bed_datei.exists():
        return set()
    ergebnis = subprocess.run(
        ["node", "-e", f"""
            global.window = {{}};
            const m = require({json.dumps(str(bed_datei.resolve()))});
            const b = (global.window && global.window.EdiBedingungen) || m || {{}};
            process.stdout.write(JSON.stringify(Object.keys(b)));"""],
        capture_output=True, text=True,
    )
    if ergebnis.returncode != 0 or not ergebnis.stdout.strip():
        return set()
    try:
        return set(json.loads(ergebnis.stdout))
    except json.JSONDecodeError:
        return set()


def referenzierte_nummern(meta_datei: Path) -> set[str]:
    treffer = re.search(r"var \w+ = (\{.*\});", meta_datei.read_text(encoding="utf-8"), re.S)
    if not treffer:
        return set()
    referenzen: set[str] = set()
    for eintrag in json.loads(treffer.group(1)).values():
        for inst in eintrag["instanzen"]:
            for feld in (inst.get("expr"), inst.get("sgExpr")):
                referenzen |= set(RE_NUMMER.findall(feld or ""))
            for de in inst["des"]:
                referenzen |= set(RE_NUMMER.findall(de.get("expr") or ""))
                for code in de.get("codes", []):
                    if len(code) > 2:
                        referenzen |= set(RE_NUMMER.findall(code[2] or ""))
    return referenzen


def art_aus_nummer(nr: str) -> str:
    """Grobe Einordnung analog zu den vorhandenen Bedingungsdateien."""
    if nr.startswith("UB"):
        return "zeitpunkt"
    if "P" in nr:
        return "wiederholbarkeit"
    try:
        zahl = int(nr)
    except ValueError:
        return "sonstige"
    if 900 <= zahl <= 999:
        return "format"
    if 2000 <= zahl <= 2999:
        return "wiederholbarkeit"
    return "voraussetzung"


def bearbeite_ordner(ordner: Path, formatstand: str) -> dict:
    bericht = {"ordner": str(ordner.relative_to(GENERATOR)), "bruecke": False, "ergaenzt": []}
    bed_datei = ordner / "_bedingungen.js"
    meta_datei = ordner / "_form-meta.js"
    if not bed_datei.exists() or not meta_datei.exists():
        return bericht

    inhalt = bed_datei.read_text(encoding="utf-8")

    # 1. Brücke zu window.EdiBedingungen, wo sie fehlt
    if "EdiBedingungen" not in inhalt and "bedingungTexte" in inhalt:
        inhalt = inhalt.rstrip() + "\n" + BRUECKE
        bed_datei.write_text(inhalt, encoding="utf-8")
        bericht["bruecke"] = True

    # 2. Fehlende Texte aus den AHB-Daten nachtragen
    vorhanden = vorhandene_nummern(bed_datei)
    referenzen = referenzierte_nummern(meta_datei)
    fehlend = sorted(referenzen - vorhanden, key=lambda x: (len(x), x))
    if not fehlend:
        return bericht

    pruefids = [p.stem for p in ordner.glob("*.js") if re.fullmatch(r"\d+", p.stem)]
    texte = texte_aus_ahbdaten(pruefids, formatstand)
    nachtrag = {nr: texte[nr] for nr in fehlend if nr in texte}
    if not nachtrag:
        return bericht

    zeilen = [
        "",
        "// --- Nachtrag 28.07.2026 -------------------------------------------------",
        "// Diese Bedingungen werden in den Formularen referenziert, fehlten aber in der",
        "// Bedingungsdatei; die Texte stammen aus der AHB-Extraktion desselben Stands.",
        "if (typeof window !== 'undefined') {",
        "    window.EdiBedingungen = window.EdiBedingungen || {};",
        "    var _nachtrag = {",
    ]
    for nr, text in sorted(nachtrag.items(), key=lambda x: (len(x[0]), x[0])):
        zeilen.append(f'        {json.dumps(nr)}: {{ text: {json.dumps(text, ensure_ascii=False)}, '
                      f'art: {json.dumps(art_aus_nummer(nr))} }},')
    zeilen += [
        "    };",
        "    Object.keys(_nachtrag).forEach(function (nr) {",
        "        if (!window.EdiBedingungen[nr]) window.EdiBedingungen[nr] = _nachtrag[nr];",
        "    });",
        "}",
        "",
    ]
    bed_datei.write_text(inhalt.rstrip() + "\n" + "\n".join(zeilen), encoding="utf-8")
    bericht["ergaenzt"] = sorted(nachtrag)
    bericht["ohne_text"] = sorted(set(fehlend) - set(nachtrag))
    return bericht


if __name__ == "__main__":
    berichte = []
    for formatstand in ("202604", "202610"):
        for ordner in sorted((GENERATOR / formatstand).rglob("pruef-ids")):
            b = bearbeite_ordner(ordner, formatstand)
            if b["bruecke"] or b["ergaenzt"]:
                berichte.append(b)
                print(f"{b['ordner']:56s} Brücke={'ja' if b['bruecke'] else '--'} "
                      f"ergänzt={len(b['ergaenzt']):3d} ohne Text={len(b.get('ohne_text', []))}")
    Path("protokoll_bedingungstexte.json").write_text(
        json.dumps(berichte, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(berichte)} Dateien angepasst")
