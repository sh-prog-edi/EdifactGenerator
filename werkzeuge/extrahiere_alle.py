#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extrahiere_alle.py — erzeugt für beide Formatstände eine einheitliche AHB-Datenbasis.

Für jede AHB-DOCX wird das Tabellenlayout bestimmt (klassisch tabulatorgetrennt oder
verschachtelte Tabellen) und der passende Leser angewendet. Ergebnis je Prüf-ID:

    ahbdaten/<FV>/<PID>.json   { "meta": {...}, "lines": [...] }

Es werden ausschließlich die konsolidierten Lesefassungen (`_ooox_`) verwendet; nur
wenn für einen Nachrichtentyp keine Lesefassung vorliegt, wird auf die
Änderungsfassung (`_xoxx_` / `_oxox_`) zurückgegriffen.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import docx  # noqa: E402

import nested_ahb_reader as NESTED  # noqa: E402
import tabs_ahb_reader as TABS  # noqa: E402

W = TABS.W


def layout_bestimmen(pfad: Path) -> str:
    """'nested', 'tabs' oder 'unbekannt' — anhand der Kopfzeilen der Tabellen."""
    try:
        d = docx.Document(str(pfad))
    except Exception:
        return "unbekannt"
    nested = tabs = 0
    for t in d.tables:
        trs = t._tbl.findall(W + "tr")  # noqa: SLF001
        if not trs:
            continue
        tcs = trs[0].findall(W + "tc")
        if len(tcs) < 2:
            continue
        if NESTED.read_head(trs[0]) is not None:
            nested += 1
            continue
        text = "".join(n.text or "" for n in tcs[-1].iter(W + "t"))
        if "Prüfidentifikator" in text:
            tabs += 1
    if nested and nested >= tabs:
        return "nested"
    if tabs:
        return "tabs"
    return "unbekannt"


def typ_und_version(name: str) -> tuple[str, str]:
    """('UTILMD_S', '2.1') aus dem Dateinamen."""
    m = re.match(r"AHB_([A-Z]+)_?([A-Z]?[\d.]+[a-z]?)_", name)
    if not m:
        return name, ""
    return m.group(1), m.group(2)


def dokumentenstand(name: str) -> str:
    """Der Dokumentstand aus dem Dateinamen (…_<gültig ab>_<gültig bis>_<Stand>_<Art>_<ID>.docx)."""
    teile = name.rsplit(".", 1)[0].split("_")
    if len(teile) >= 3:
        kandidat = teile[-3]
        if re.fullmatch(r"\d{8}", kandidat):
            return kandidat
    return "00000000"


def waehle_dateien(ordner: Path) -> list[Path]:
    """Je Nachrichtentyp und Version die Fassung mit dem jüngsten Dokumentstand.

    Wichtig: die konsolidierte Lesefassung (`_ooox_`) ist nicht immer die aktuellste.
    Für UTILMD Strom S2.1 etwa liegt die Lesefassung auf dem Stand 06.06.2025, während
    die Änderungsfassung vom 29.06.2026 den maßgeblichen Stand trägt und 44 Prüf-IDs
    mehr enthält. Deshalb entscheidet zuerst der Dokumentstand, erst bei Gleichstand
    die Lesefassung.
    """
    kandidaten: dict[str, list[Path]] = defaultdict(list)
    for pfad in sorted(ordner.glob("AHB_*.docx")):
        typ, version = typ_und_version(pfad.name)
        kandidaten[f"{typ}_{version}"].append(pfad)

    auswahl: list[Path] = []
    for _, pfade in sorted(kandidaten.items()):
        auswahl.append(
            max(pfade, key=lambda p: (dokumentenstand(p.name), "_ooox_" in p.name, p.name))
        )
    return auswahl


def extrahiere(ordner: Path, ziel: Path) -> dict:
    ziel.mkdir(parents=True, exist_ok=True)
    bericht: dict = {"dateien": [], "pruefids": 0}
    gesammelt: dict[str, dict] = {}

    for pfad in waehle_dateien(ordner):
        layout = layout_bestimmen(pfad)
        try:
            if layout == "nested":
                daten = NESTED.read_document(pfad)
            elif layout == "tabs":
                daten = TABS.read_document(pfad)
            else:
                daten = {}
        except Exception as fehler:  # pragma: no cover
            bericht["dateien"].append({"datei": pfad.name, "layout": layout, "fehler": str(fehler)})
            continue

        for pruefi, inhalt in daten.items():
            inhalt["meta"]["quelle"] = pfad.name
            inhalt["meta"]["layout"] = layout
            if pruefi not in gesammelt or len(inhalt["lines"]) > len(gesammelt[pruefi]["lines"]):
                gesammelt[pruefi] = inhalt

        bericht["dateien"].append({"datei": pfad.name, "layout": layout, "pruefids": len(daten)})
        print(f"   {pfad.name[:52]:54s} {layout:8s} {len(daten):4d} Prüf-IDs", flush=True)

    # Zweite Runde: Prüf-IDs, die in der jeweils jüngsten Fassung fehlen, aus den
    # übrigen Fassungen desselben Formatstands nachtragen (z. B. Anwendungsfälle, die
    # nur in der Änderungsfassung geführt werden).
    gewaehlt = {p.name for p in waehle_dateien(ordner)}
    for pfad in sorted(ordner.glob("AHB_*.docx")):
        if pfad.name in gewaehlt:
            continue
        layout = layout_bestimmen(pfad)
        try:
            daten = NESTED.read_document(pfad) if layout == "nested" else (
                TABS.read_document(pfad) if layout == "tabs" else {}
            )
        except Exception:
            continue
        ergaenzt = 0
        for pruefi, inhalt in daten.items():
            if pruefi in gesammelt:
                continue
            inhalt["meta"]["quelle"] = pfad.name
            inhalt["meta"]["layout"] = layout
            inhalt["meta"]["ergaenzt"] = True
            gesammelt[pruefi] = inhalt
            ergaenzt += 1
        if ergaenzt:
            bericht["dateien"].append({"datei": pfad.name, "layout": layout, "ergaenzt": ergaenzt})
            print(f"   + {pfad.name[:52]:52s} {layout:8s} {ergaenzt:4d} ergänzt", flush=True)

    for pruefi, inhalt in gesammelt.items():
        (ziel / f"{pruefi}.json").write_text(json.dumps(inhalt, ensure_ascii=False, indent=1), encoding="utf-8")

    bericht["pruefids"] = len(gesammelt)
    return bericht


if __name__ == "__main__":
    basis = Path("eem/edi_energy_de")
    gesamt = {}
    for fv in ("FV2604", "FV2610"):
        print(f"### {fv}")
        gesamt[fv] = extrahiere(basis / fv, Path("ahbdaten") / fv)
        print(f"    -> {gesamt[fv]['pruefids']} Prüf-IDs\n")
    Path("ahbdaten/extraktionsbericht.json").write_text(json.dumps(gesamt, ensure_ascii=False, indent=1), encoding="utf-8")
