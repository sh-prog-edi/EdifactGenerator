#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
baue_ebd_daten.py — erzeugt `_engine/daten/ebd-antwortcodes.js` aus der
EBD-Extraktion (`werkzeuge/ebd_pdf_leser.py`).

Struktur je Formatstand:
    { quelle, ebds: { "E_0623": { titel, rolle, verweistAuf?,
                                  codes: { "A51": { text, cluster } } } } }

Das Cluster („Zustimmung" / „Ablehnung") steht im EBD-Dokument im Hinweistext jedes
Codes und entscheidet, welche Codes eine Bestätigung bzw. eine Ablehnung anbieten darf.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ZIEL = Path("edigen/EdifactGenerator/_engine/daten/ebd-antwortcodes.js")
ZIEL_PFADE = Path("edigen/EdifactGenerator/_engine/daten/ebd-pfade.js")


def referenzierte_ebd() -> set[str]:
    """EBD-Nummern, die ein AHB im STS+E01/AJT (DE 1131) nennt.

    Nur für sie werden die Prüfschritt-Wege ausgeliefert — die übrigen Bäume des
    BDEW-Dokuments gehören zu Prozessen, die der Generator nicht führt.
    """
    treffer: set[str] = set()
    muster = re.compile(r"^(?:E|S|G|GS)_\d{3,4}$")
    for datei in Path("edigen/EdifactGenerator").rglob("_form-meta.js"):
        text = datei.read_text(encoding="utf-8")
        m = re.search(r"^var\s+\w+\s*=\s*(\{.*\});\s*$", text, re.M | re.S)
        if not m:
            continue
        for eintrag in json.loads(m.group(1)).values():
            for inst in eintrag.get("instanzen", []):
                if inst.get("seg") not in ("STS", "AJT"):
                    continue
                for de in inst.get("des", []):
                    if de.get("de") != "1131":
                        continue
                    for code in de.get("codes", []):
                        if muster.match(code[0]):
                            treffer.add(code[0])
    return treffer


def js_sicher(rumpf: str) -> str:
    return rumpf.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")


def baue(primaer: Path, ergaenzung: list[Path]) -> dict:
    """Quellen zusammenführen.

    Primärquelle ist die DOCX-Auswertung mit ebdamame (`ebd_docx_leser.py`): Sie ist
    strukturiert und erfasst auch Codes, die eine Textlage im PDF verschleiert
    (etwa AA1/AA2/AA3 in E_0406). Der PDF-Leser ergänzt die Kapitel, die ebdamame
    nicht kennt — die reinen Codelisten (S_xxxx, G_xxxx) mit den Antwortcodes der
    Servicenachrichten.
    """
    gesamt = json.loads(primaer.read_text(encoding="utf-8"))
    for stand in gesamt:
        gesamt[stand].pop("ohneTabelle", None)
    for q in ergaenzung:
        if not q.exists():
            continue
        for stand, inhalt in json.loads(q.read_text(encoding="utf-8")).items():
            ziel = gesamt.setdefault(stand, {"quelle": inhalt["quelle"], "ebds": {}})
            ergaenzt = 0
            for key, e in inhalt["ebds"].items():
                if key not in ziel["ebds"]:
                    ziel["ebds"][key] = e
                    ergaenzt += 1
            if ergaenzt:
                ziel["quelle"] = f'{ziel["quelle"]} + {ergaenzt} Codelisten aus {inhalt["quelle"]}'
    return gesamt


if __name__ == "__main__":
    import sys

    argumente = sys.argv[1:]
    primaer = Path(argumente[0] if argumente else "ahbdaten/ebd_docx.json")
    # Reihenfolge der Ergänzungen: Zuerst der Nachtrag (Kapitel, die die aktuelle
    # ebdamame-Fassung nicht in vertretbarer Zeit konvertiert — E_0406/E_0407 —,
    # übernommen aus der letzten vollständigen Auswertung), danach die Codelisten aus
    # dem PDF-Leser. Ein Kapitel wird nur ergänzt, wenn es noch fehlt.
    ergaenzung = [Path(x) for x in argumente[1:]] or [
        Path("ahbdaten/ebd_nachtrag.json"),
        Path("ahbdaten/ebd_2604.json"), Path("ahbdaten/ebd_2610.json")]
    daten = baue(primaer, ergaenzung)

    for stand, inhalt in daten.items():
        ebds = inhalt["ebds"]
        codes = sum(len(e["codes"]) for e in ebds.values())
        cluster = sum(1 for e in ebds.values() for c in e["codes"].values() if c.get("cluster"))
        verweise = sum(1 for e in ebds.values() if e.get("verweistAuf"))
        print(f"{stand}: {len(ebds)} EBD, {codes} Codes ({cluster} mit Cluster), {verweise} Verweise")

    # Die Prüfschritte und die Wege zu jedem Code kommen in eine eigene Datei: Sie
    # sind ein Vielfaches größer als die Codeliste und werden nur dort gebraucht, wo
    # die Auswahl der Antwortcodes am Geschäftsvorfall hängt. Aufgenommen werden die
    # Entscheidungsbäume, die ein AHB tatsächlich referenziert (STS+E01/AJT DE1131).
    referenziert = referenzierte_ebd()
    pfade: dict[str, dict] = {}
    for stand, inhalt in daten.items():
        ziel = pfade.setdefault(stand, {})
        for key, e in inhalt["ebds"].items():
            schritte = e.pop("schritte", None)
            verzweigungen = e.pop("verzweigungen", None)
            bedingungen = e.pop("bedingungen", None)
            if not schritte or bedingungen is None:
                continue
            if referenziert and key not in referenziert:
                continue
            ziel[key] = {"schritte": schritte, "verzweigungen": verzweigungen or {},
                         "bedingungen": bedingungen}
        print(f"{stand}: {len(ziel)} Entscheidungsbäume mit Prüfschritt-Wegen")

    rumpf_pfade = js_sicher(json.dumps(pfade, ensure_ascii=False, separators=(",", ":")))
    ZIEL_PFADE.write_text(
        "// ebd-pfade.js - Prüfschritte der Entscheidungsbaum-Diagramme (EBD) und die\n"
        "// Wege, auf denen ein Antwortcode erreicht wird.\n"
        "// Maschinell gelesen mit werkzeuge/ebd_docx_leser.py (Hochfrequenz-Werkzeug\n"
        "// ebdamame) aus der DOCX-Fassung des BDEW-Dokuments.\n"
        "// Je EBD: schritte {Nr: Frage}, verzweigungen {Nr: [[Antwort, Folgeschritt,\n"
        "// Code], ...]} und bedingungen {Code: [[Nr, Antwort], ...]} - letztere sind die\n"
        "// Antworten, die auf JEDEM Weg zu diesem Code gegeben werden.\n"
        "// Damit laesst sich vor der Auswahl bestimmen, welche Codes ein Geschaeftsvorfall\n"
        "// ueberhaupt erreichen kann - etwa E_0614 Schritt 10 (verbrauchende Marktlokation).\n"
        "var ebdPfade = " + rumpf_pfade + ";\n"
        "if (typeof module !== 'undefined') module.exports = ebdPfade;\n",
        encoding="utf-8",
    )
    print(f"-> {ZIEL_PFADE} ({ZIEL_PFADE.stat().st_size // 1024} KB)")

    rumpf = js_sicher(json.dumps(daten, ensure_ascii=False, separators=(",", ":")))
    ZIEL.write_text(
        "// ebd-antwortcodes.js - Antwortcodes der Entscheidungsbaum-Diagramme (EBD).\n"
        "// Maschinell gelesen mit werkzeuge/ebd_pdf_leser.py aus dem BDEW-Dokument\n"
        "// „Entscheidungsbaum-Diagramme und Codelisten für die Antwortnachrichten\".\n"
        "// Je Code: Hinweistext und Cluster (Zustimmung/Ablehnung) laut EBD.\n"
        "var ebdAntwortcodes = " + rumpf + ";\n"
        "if (typeof module !== 'undefined') module.exports = ebdAntwortcodes;\n",
        encoding="utf-8",
    )
    print(f"-> {ZIEL} ({ZIEL.stat().st_size // 1024} KB)")
