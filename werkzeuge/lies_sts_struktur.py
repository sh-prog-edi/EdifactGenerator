#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lies_sts_struktur.py — liest den Aufbau des STS-Segments aus den MIG-DOCX.

Hintergrund: Das STS-Segment ist im BDEW-MIG so aufgebaut

    STS + C601 + C555 + C556 [+ C556 [+ C556 …]]
          9015    4405    9013:1131:3055:9012

Die Gruppe C556 („Statusanlaß") wiederholt sich. In UTILMD Strom trägt das
Segment „Transaktionsgrund / Ergänzung / Transaktionsgrund befristete Anmeldung"
drei Wiederholungen mit jeweils dem Datenelement 9013:

    1. Wiederholung: Transaktionsgrund                 (E01, E03, ZX6 …)
    2. Wiederholung: Transaktionsgrundergänzung        (ZW3, ZW4, ZW5 …)
    3. Wiederholung: Ergänzung für Lieferende bei befristeter Anmeldung (E01, E03)

    Beispiel des MIG:  STS+7++E01+ZW4+E03'

Weil alle drei dasselbe Datenelement 9013 führen, wirft die AHB-Auswertung sie in
einen Topf. Diese Datei stellt die Reihenfolge wieder her: Sie liefert je Segment
die C556-Wiederholungen mit ihren zulässigen Codes, sodass Formular, Generator und
Validator jedem Code seine Position zuweisen können.

Aufruf:  python3 werkzeuge/lies_sts_struktur.py [--ziel <js>]
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import docx

SPIEGEL = Path("eem/edi_energy_de")
ZIEL = Path("edigen/EdifactGenerator/_engine/daten/sts-struktur.js")

# Formatstand -> Nachricht -> Namensmuster der MIG im Spiegel
NACHRICHTEN = {
    "UTILMD_STROM": "MIG_UTILMD_S*.docx",
    "UTILMD_GAS": "MIG_UTILMD_G*.docx",
    "UTILTS": "MIG_UTILTS_*.docx",
    "IFTSTA": "MIG_IFTSTA_*.docx",
    "INSRPT": "MIG_INSRPT_*.docx",
    "MSCONS": "MIG_MSCONS_*.docx",
    "ORDRSP": "MIG_ORDRSP_*.docx",
    "COMDIS": "MIG_COMDIS_*.docx",
}
STAENDE = {"202604": "FV2604", "202610": "FV2610"}

SEGKOPF_RE = re.compile(r"^\d{4}\s+\d{5}$")
CODE_RE = re.compile(r"^\t?([A-Z0-9][A-Z0-9_]{0,6})\t(.*)$")
KOPFZEILEN = {"Standard", "Bez", "Name", "St", "Format", "Bemerkung:", "Beispiel:"}
KOMPOSITA = {"C601", "C555", "C556"}
DATENELEMENTE = {"9015", "4405", "9013", "9012", "1131", "3055", "4404", "4295"}


def dokumentenstand(name: str) -> str:
    teile = name.rsplit(".", 1)[0].split("_")
    if len(teile) >= 3 and re.fullmatch(r"\d{8}", teile[-3]):
        return teile[-3]
    return "00000000"


def waehle_docx(ordner: Path, muster: str) -> Path | None:
    """Jüngster Dokumentstand; bei Gleichstand die Lesefassung (gleiche Regel wie EBD/AHB)."""
    kandidaten = list(ordner.glob(muster))
    if not kandidaten:
        return None
    return max(kandidaten, key=lambda p: (dokumentenstand(p.name), "_ooox_" in p.name, p.name))


def zeilen(dok: docx.Document) -> list[list[str]]:
    """Alle Tabellenzeilen als Liste von Zellen (waagerecht verbundene Zellen entdoppelt)."""
    out: list[list[str]] = []
    for tab in dok.tables:
        for reihe in tab.rows:
            zellen, gesehen = [], set()
            for zelle in reihe.cells:
                if id(zelle._tc) in gesehen:
                    continue
                gesehen.add(id(zelle._tc))
                zellen.append(zelle.text)
            out.append(zellen)
    return out


def codes_aus(text: str) -> dict[str, str]:
    """Codes einer MIG-Beschreibungszelle: Zeilen der Form ``\\t<CODE>\\t<Bedeutung>``."""
    treffer: dict[str, str] = {}
    for zeile in text.split("\n"):
        m = CODE_RE.match(zeile)
        if not m:
            continue
        code, bedeutung = m.group(1), " ".join(m.group(2).split())
        if code in treffer:
            continue
        treffer[code] = bedeutung
    return treffer


def kopf_aus(text: str) -> str:
    """Erste Zeile der Beschreibungszelle (der sprechende Name des Datenelements)."""
    for zeile in text.split("\n"):
        z = zeile.strip()
        if z and not CODE_RE.match(zeile):
            return z
        if z:
            break
    return ""


def lies(pfad: Path) -> list[dict]:
    reihen = zeilen(docx.Document(str(pfad)))
    segmente: list[dict] = []
    i = 0
    while i < len(reihen):
        z = reihen[i]
        if len(z) >= 2 and z[1].strip() == "STS" and SEGKOPF_RE.match(z[0].strip()):
            segment = {
                "id": z[0].split()[-1],
                "section": " ".join(z[3].split()) if len(z) > 3 else "",
                "komposita": [],
                "beispiel": "",
            }
            aktuell: dict | None = None
            letztes: dict | None = None
            j = i + 1
            while j < len(reihen):
                z2 = reihen[j]
                erste = z2[0].strip() if z2 else ""
                if SEGKOPF_RE.match(erste) and len(z2) >= 2 and z2[1].strip():
                    break
                text = z2[-1] if z2 else ""
                if erste in KOMPOSITA:
                    aktuell = {"komposit": erste, "st": z2[4].strip() if len(z2) > 4 else "", "des": []}
                    segment["komposita"].append(aktuell)
                    letztes = None
                elif erste in DATENELEMENTE:
                    if aktuell is None:                       # 4405 steht bei manchen MIG ohne C555
                        aktuell = {"komposit": "", "st": "", "des": []}
                        segment["komposita"].append(aktuell)
                    letztes = {
                        "de": erste,
                        "st": z2[4].strip() if len(z2) > 4 else "",
                        "fmt": z2[5].strip() if len(z2) > 5 else "",
                        "name": kopf_aus(text),
                        "codes": codes_aus(text),
                    }
                    aktuell["des"].append(letztes)
                elif letztes is not None and erste == "" and text and text.split("\n")[0].strip() not in KOPFZEILEN:
                    # Fortsetzung derselben Zelle nach einer eingeschobenen Kopfzeile
                    for code, bedeutung in codes_aus(text).items():
                        letztes["codes"].setdefault(code, bedeutung)
                for zelle in z2:
                    if zelle.strip().startswith("STS+") and not segment["beispiel"]:
                        segment["beispiel"] = " ".join(zelle.split())[:200]
                j += 1
            if segment["komposita"]:
                segmente.append(segment)
            i = j
            continue
        i += 1
    return segmente


def js_sicher(rumpf: str) -> str:
    return rumpf.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--ziel", default=str(ZIEL))
    args = p.parse_args()

    ergebnis: dict[str, dict] = {}
    for stand, fv in STAENDE.items():
        ordner = SPIEGEL / fv
        ergebnis[stand] = {}
        for nachricht, muster in NACHRICHTEN.items():
            datei = waehle_docx(ordner, muster)
            if not datei:
                datei = waehle_docx(SPIEGEL / "FV2604", muster)      # gilt formatstandübergreifend
            if not datei:
                print(f"{stand} {nachricht}: keine MIG im Spiegel")
                continue
            segmente = lies(datei)
            if not segmente:
                continue
            ergebnis[stand][nachricht] = {"quelle": datei.name, "segmente": segmente}
            mehrfach = [s for s in segmente
                        if sum(1 for k in s["komposita"] for d in k["des"] if d["de"] == "9013") > 1]
            print(f"{stand} {nachricht}: {len(segmente)} STS-Segmente, "
                  f"{len(mehrfach)} mit mehreren 9013-Positionen  ({datei.name})")
            for s in mehrfach:
                pos = [d["name"][:40] for k in s["komposita"] for d in k["des"] if d["de"] == "9013"]
                print(f"     {s['id']}: {' | '.join(pos)}")

    ziel = Path(args.ziel)
    # Zwischenstand als JSON: davon lebt werkzeuge/teile_sts_positionen.py
    roh = Path("ahbdaten/sts_struktur.json")
    roh.parent.mkdir(parents=True, exist_ok=True)
    roh.write_text(json.dumps(ergebnis, ensure_ascii=False, indent=1), encoding="utf-8")
    rumpf = js_sicher(json.dumps(ergebnis, ensure_ascii=False, separators=(",", ":")))
    ziel.write_text(
        "// sts-struktur.js - Aufbau des STS-Segments je Nachricht und Formatstand.\n"
        "// Maschinell gelesen mit werkzeuge/lies_sts_struktur.py aus den BDEW-MIG.\n"
        "// Je Segment die Reihenfolge der Komposita (C601/C555/C556) mit ihren\n"
        "// Datenelementen und zulaessigen Codes. Entscheidend fuer UTILMD Strom:\n"
        "// C556 wiederholt sich (Transaktionsgrund / Ergaenzung / befristetes Lieferende),\n"
        "// alle drei mit DE 9013 - Beispiel des MIG: STS+7++E01+ZW4+E03'\n"
        "var stsStruktur = " + rumpf + ";\n"
        "if (typeof module !== 'undefined') module.exports = stsStruktur;\n",
        encoding="utf-8",
    )
    print(f"-> {ziel} ({ziel.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
