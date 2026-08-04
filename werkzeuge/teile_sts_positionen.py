#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
teile_sts_positionen.py — ordnet die Datenelemente der STS-Segmente in der
Formular-Meta (`pruef-ids/_form-meta.js`) ihrer Position im Segment zu.

Warum: Das STS-Segment führt die Gruppe C556 („Statusanlaß") mehrfach, jede
Wiederholung mit dem Datenelement 9013. In UTILMD Strom sind das drei:

    STS+7++E01+ZW4+E03'
           |    |    +-- 3. C556: Ergänzung für Lieferende bei befristeter Anmeldung
           |    +------- 2. C556: Transaktionsgrundergänzung
           +------------ 1. C556: Transaktionsgrund

Die AHB-Tabelle nennt alle drei „DE 9013" und listet ihre Codes hintereinander;
die Extraktion legt sie deshalb in einen Topf. Das Formular bot daraus ein
einziges Mehrfachauswahlfeld an und der Generator schrieb nur den ersten Wert —
`STS+7++E03'` statt `STS+7++E03+ZW4'`.

Dieses Skript stellt die Positionen wieder her. Grundlage ist der aus dem MIG
gelesene Segmentaufbau (`werkzeuge/lies_sts_struktur.py`). Jedes Datenelement
einer STS-Instanz erhält

    "pos"    Nummer des Datenelements im Segment (0 = C601/9015, 1 = C555/4405,
             ab 2 die Wiederholungen von C556)
    "sub"    Nummer innerhalb der Gruppe (9013 = 0, 1131 = 1, 3055 = 2, 9012 = 3)
    "migSt"  Status laut MIG (M/R = anzugeben, D/C = bedingt)

und ein DE 9013 mit Codes mehrerer Wiederholungen wird in ebenso viele Einträge
zerlegt. Die Zuordnung der Codes folgt der AHB-Reihenfolge: Die Position wächst
monoton, jeder Code landet in der ersten Wiederholung ab der aktuellen Position,
deren MIG-Codeliste ihn führt. So bleibt „E01 … ZW6 ZW7 E01 E03" richtig
getrennt (Grund … Ergänzung, danach befristetes Lieferende).

Das Skript ist mehrfach anwendbar (idempotent): bereits zerlegte Instanzen
bleiben unverändert.

Aufruf:  python3 werkzeuge/teile_sts_positionen.py [--pruefen]
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

GENERATOR = Path("edigen/EdifactGenerator")
STRUKTUR = Path("ahbdaten/sts_struktur.json")

# Ordner -> Nachricht in der MIG-Struktur
NACHRICHT_AUS_PFAD = [
    ("UTILMD/Strom", "UTILMD_STROM"),
    ("UTILMD/Gas", "UTILMD_GAS"),
    ("UTILTS", "UTILTS"),
    ("IFTSTA", "IFTSTA"),
    ("INSRPT", "INSRPT"),
    ("MSCONS", "MSCONS"),
    ("ORDRSP", "ORDRSP"),
    ("COMDIS", "COMDIS"),
]
# Reihenfolge innerhalb der Gruppe C556 bzw. C601
SUB = {"9015": 0, "1131": 1, "3055": 2, "9012": 3, "9013": 0, "4405": 0}


def lade_meta(pfad: Path) -> tuple[str, dict, str]:
    text = pfad.read_text(encoding="utf-8")
    m = re.search(r"^var (\w+) = (\{.*\});$", text, re.M | re.S)
    if not m:
        raise SystemExit(f"{pfad}: unerwarteter Aufbau")
    return m.group(1), json.loads(m.group(2)), text


def schreibe_meta(pfad: Path, text: str, name: str, daten: dict) -> None:
    rumpf = json.dumps(daten, ensure_ascii=False, separators=(",", ":"))
    # Ersatz als Funktion: sonst deutete re.sub die Maskierungen im JSON (\n, \\) als
    # Rückverweise und schriebe echte Steuerzeichen in die Datei.
    neu = re.sub(r"^var \w+ = \{.*\};$", lambda _: f"var {name} = {rumpf};",
                 text, count=1, flags=re.M | re.S)
    pfad.write_text(neu, encoding="utf-8")


def nachricht_von(pfad: Path) -> str | None:
    s = pfad.as_posix()
    for teil, name in NACHRICHT_AUS_PFAD:
        if f"/{teil}/" in s:
            return name
    return None


def stand_von(pfad: Path) -> str | None:
    m = re.search(r"/(20\d{4})/", pfad.as_posix())
    return m.group(1) if m else None


def positionen(segment: dict) -> list[dict]:
    """Datenelemente des MIG-Segments mit ihrer Position: [{de, pos, sub, name, codes}]."""
    out: list[dict] = []
    element = 0
    for komposit in segment["komposita"]:
        for de in komposit["des"]:
            out.append({
                "de": de["de"],
                "pos": element,
                "sub": SUB.get(de["de"], 0),
                "name": de["name"],
                "st": de["st"],
                "codes": de["codes"],
            })
        element += 1
    return out


def waehle_segment(segmente: list[dict], q9015: str, meta_des: set[str]) -> dict | None:
    """MIG-Segment zur Instanz: gleicher Statuskategorie-Code, ähnlichste Datenelemente.

    Der Abschnittsname taugt nicht als Schlüssel — im AHB ist er mitunter umbrochen
    oder gekürzt („Transaktionsgrundergänzun g für Lie…"). Der Code des DE 9015 ist
    dagegen eindeutig; nur UTILMD Strom führt zwei Segmente mit E01 (mit und ohne
    Zeitraum-ID). Dort entscheidet die Menge der Datenelemente.
    """
    kandidaten = []
    for seg in segmente:
        pos = positionen(seg)
        q = next((p for p in pos if p["de"] == "9015"), None)
        if not q or (q["codes"] and q9015 not in q["codes"]):
            continue
        vorhanden = {p["de"] for p in pos if p["st"] != "N"}
        treffer = len(vorhanden & meta_des)
        zuviel = len(vorhanden ^ meta_des)
        kandidaten.append((treffer, -zuviel, seg))
    if not kandidaten:
        return None
    kandidaten.sort(key=lambda x: (x[0], x[1]), reverse=True)
    return kandidaten[0][2]


def teile_codes(codes: list, ziele: list[dict]) -> list[tuple[dict, list]]:
    """Codes der AHB-Reihenfolge nach auf die C556-Wiederholungen verteilen.

    Vorrang hat die Wiederholung, die den Code in ihrer MIG-Codeliste ausdrücklich
    führt. Wiederholungen ohne Codeliste (dort steht ein freier Antwortcode des EBD)
    nehmen nur auf, was sonst nirgends passt.
    """
    zuordnung: list[list] = [[] for _ in ziele]
    aktuell = 0
    for code in codes:
        gefunden = next((i for i in range(aktuell, len(ziele)) if code[0] in ziele[i]["codes"]), None)
        if gefunden is None:
            gefunden = next((i for i in range(aktuell, len(ziele)) if not ziele[i]["codes"]), aktuell)
        zuordnung[gefunden].append(code)
        aktuell = gefunden
    return list(zip(ziele, zuordnung))


def bearbeite(instanz: dict, segment: dict, bericht: list[str], kennung: str) -> bool:
    pos = positionen(segment)
    if all("pos" in d for d in instanz["des"]):
        return False                       # bereits zugeordnet
    geaendert = False
    neu: list[dict] = []
    for de in instanz["des"]:
        nr = de["de"]
        stellen = [p for p in pos if p["de"] == nr and p["st"] != "N"] or [p for p in pos if p["de"] == nr]
        if not stellen:
            neu.append(de)
            continue
        if nr != "9013" or len(stellen) < 2 or not de.get("codes"):
            de["pos"], de["sub"] = stellen[0]["pos"], stellen[0]["sub"]
            de["migSt"] = stellen[0]["st"]
            neu.append(de)
            geaendert = True
            continue
        # mehrere C556-Wiederholungen mit DE 9013: Codes verteilen. Eine Wiederholung
        # ohne MIG-Codeliste bleibt auch leer erhalten — dort trägt der Anwender den
        # Antwortcode des EBD ein.
        verteilt = teile_codes(de["codes"], stellen)
        belegt = [(stelle, codes) for stelle, codes in verteilt if codes or not stelle["codes"]]
        for stelle, codes in belegt:
            neu.append({
                "de": "9013",
                "name": stelle["name"] or de.get("name", ""),
                "expr": de.get("expr", ""),
                "codes": codes,
                "pos": stelle["pos"],
                "sub": stelle["sub"],
                "migSt": stelle["st"],
            })
        geaendert = True
        if len(belegt) > 1:
            bericht.append(f"{kennung}: " + " | ".join(
                f"E{stelle['pos'] + 1} {stelle['name'][:34]} = {','.join(c[0] for c in codes)}"
                for stelle, codes in belegt))
    instanz["des"] = neu
    return geaendert


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--pruefen", action="store_true", help="nur berichten, nichts schreiben")
    args = p.parse_args()

    struktur = json.loads(STRUKTUR.read_text(encoding="utf-8"))
    bericht: list[str] = []
    gesamt = {"dateien": 0, "instanzen": 0, "geteilt": 0, "ohneSegment": 0}

    for datei in sorted(GENERATOR.rglob("_form-meta.js")):
        nachricht, stand = nachricht_von(datei), stand_von(datei)
        if not nachricht or not stand:
            continue
        segmente = struktur.get(stand, {}).get(nachricht, {}).get("segmente")
        if not segmente:
            continue
        name, daten, text = lade_meta(datei)
        geaendert = False
        for pruefi, eintrag in daten.items():
            for instanz in eintrag.get("instanzen", []):
                if instanz.get("seg") != "STS":
                    continue
                if not instanz.get("des"):
                    continue              # Abschnittskopf ohne Datenelemente
                gesamt["instanzen"] += 1
                q = next((d for d in instanz["des"] if d["de"] == "9015"), None)
                q9015 = (q.get("codes") or [["", ""]])[0][0] if q else ""
                meta_des = {d["de"] for d in instanz["des"]}
                segment = waehle_segment(segmente, q9015, meta_des)
                if not segment:
                    gesamt["ohneSegment"] += 1
                    bericht.append(f"{stand} {nachricht} {pruefi}: kein MIG-Segment zu STS+{q9015}")
                    continue
                vorher = len([d for d in instanz["des"] if d["de"] == "9013"])
                if bearbeite(instanz, segment, bericht, f"{stand} {nachricht} {pruefi} STS+{q9015}"):
                    geaendert = True
                if len([d for d in instanz["des"] if d["de"] == "9013"]) > vorher:
                    gesamt["geteilt"] += 1
        if geaendert and not args.pruefen:
            schreibe_meta(datei, text, name, daten)
        gesamt["dateien"] += 1

    print(f"{gesamt['dateien']} Meta-Dateien, {gesamt['instanzen']} STS-Instanzen, "
          f"{gesamt['geteilt']} in mehrere Positionen zerlegt, "
          f"{gesamt['ohneSegment']} ohne MIG-Segment")
    warnungen = [z for z in bericht if "kein MIG-Segment" in z]
    for zeile in warnungen:
        print("  ! ", zeile)
    rest = [z for z in bericht if z not in warnungen]
    for zeile in rest[:20]:
        print("   ", zeile)
    if len(rest) > 20:
        print(f"    … und {len(rest) - 20} weitere Zerlegungen")


if __name__ == "__main__":
    main()
