#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pipeline.py — fährt die Datenpipeline eines Extraktionslaufs am Stück
(Umbauplan Phase 4.1/4.4): die dokumentierte Werkzeug-Reihenfolge, dahinter die
Regression. Die Reihenfolge ist damit erzwungen — insbesondere laufen die
Nachbearbeitungen IMMER nach `baue_form_meta.py` (das alle 36 `_form-meta.js`
überschreibt; bekannte Falle: einmal gingen dabei die Zeitscheiben-Ergänzungen
von 31 Prüf-IDs verloren).

Zeitscheiben-Schutz (4.4): Vor dem Lauf wird je UTILMD-Ziel festgehalten, welche
Prüf-IDs Verwendungszeitraum-Felder führen (`RFF_VZ_QUALITAET` in
`pruef-ids/_regeln.js`); nach den Nachbearbeitungen darf diese Menge nicht
geschrumpft sein — sonst bricht die Pipeline mit Befund ab.

Aufruf (aus beliebigem Ordner; der Arbeitsordner mit den Geschwistern
`eem/edi_energy_de/<FV>/` und `ahbdaten/` wird über EDIGEN_ARBEITSORDNER
bestimmt, Standard: zwei Ebenen über dem Repository):

    python3 werkzeuge/pipeline.py                 # kompletter Lauf + Smoke
    python3 werkzeuge/pipeline.py --ab ergaenze_zeitscheiben
    python3 werkzeuge/pipeline.py --nur-pruefen   # nur Zeitscheiben-Bestand + Smoke
    python3 werkzeuge/pipeline.py --volle-regression

Die EBD-Kette (ebd_docx_leser blockweise, fuege_ebd_teile, baue_ebd_daten) ist
bewusst NICHT Teil der Pipeline — sie läuft wegen der Zeitgrenzen je Block
weiterhin von Hand (werkzeuge/LIESMICH.md, Abschnitt EBD).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARBEITSORDNER = Path(os.environ.get("EDIGEN_ARBEITSORDNER", REPO.parent.parent))

#: Werkzeug-Reihenfolge des Extraktionslaufs (werkzeuge/LIESMICH.md, erweitert um
#: den Feldauswahl-Abgleich und den Registry-Neubau).
SCHRITTE: list[tuple[str, list[str]]] = [
    ("extrahiere_alle",          ["werkzeuge/extrahiere_alle.py"]),
    ("baue_form_meta",           ["werkzeuge/baue_form_meta.py"]),
    ("teile_sts_positionen",     ["werkzeuge/teile_sts_positionen.py"]),
    ("saeubere_beschreibungen",  ["werkzeuge/saeubere_beschreibungen.py"]),
    ("aktualisiere_utilmd_regeln", ["werkzeuge/aktualisiere_utilmd_regeln.py"]),
    ("ergaenze_zeitscheiben",    ["werkzeuge/ergaenze_zeitscheiben.py"]),
    ("repariere_bedingungen",    ["werkzeuge/repariere_bedingungen.py"]),
    ("ergaenze_bedingungstexte", ["werkzeuge/ergaenze_bedingungstexte.py"]),
    ("korrigiere_prozess_meta",  ["werkzeuge/korrigiere_prozess_meta.py"]),
    ("baue_prozessketten",       ["werkzeuge/baue_prozessketten.py"]),
]

UTILMD_ZIELE = [
    "202604/Stammdaten/UTILMD/Strom", "202604/Stammdaten/UTILMD/Gas",
    "202610/Stammdaten/UTILMD/Strom", "202610/Stammdaten/UTILMD/Gas",
]


def zeitscheiben_bestand() -> dict[str, list[str]]:
    """Je UTILMD-Ziel die Prüf-IDs mit Verwendungszeitraum-Feldern in _regeln.js."""
    bestand: dict[str, list[str]] = {}
    for rel in UTILMD_ZIELE:
        pfad = REPO / rel / "pruef-ids" / "_regeln.js"
        if not pfad.exists():
            bestand[rel] = []
            continue
        text = pfad.read_text(encoding="utf-8")
        m = re.search(r"const ahbRulesByPrufId = (\{.*\});\n", text, re.S)
        daten = json.loads(m.group(1)) if m else {}
        bestand[rel] = sorted(
            pid for pid, regel in daten.items()
            if any(s.get("id") == "RFF_VZ_QUALITAET" for s in regel.get("segments", []))
        )
    return bestand


def pruefe_zeitscheiben(vorher: dict[str, list[str]]) -> list[str]:
    befunde = []
    nachher = zeitscheiben_bestand()
    for rel, pids in vorher.items():
        fehlen = sorted(set(pids) - set(nachher.get(rel, [])))
        if fehlen:
            befunde.append(f"{rel}: Zeitscheiben-Felder verloren bei {len(fehlen)} "
                           f"Prüf-IDs ({', '.join(fehlen[:8])}{' …' if len(fehlen) > 8 else ''})")
    return befunde


def lauf(befehl: list[str], cwd: Path) -> None:
    print(f"\n=== {' '.join(befehl)}  (cwd={cwd})")
    ergebnis = subprocess.run(befehl, cwd=cwd)
    if ergebnis.returncode != 0:
        sys.exit(f"ABBRUCH: {' '.join(befehl)} endete mit Exit {ergebnis.returncode}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Datenpipeline des EdifactGenerators")
    parser.add_argument("--ab", metavar="SCHRITT",
                        help="erst ab diesem Schritt laufen (Name aus der Reihenfolge)")
    parser.add_argument("--nur-pruefen", action="store_true",
                        help="keine Extraktion: nur Zeitscheiben-Bestand ausgeben und Smoke fahren")
    parser.add_argument("--volle-regression", action="store_true",
                        help="nach dem Lauf die volle Regression statt Smoke")
    parser.add_argument("--ohne-regression", action="store_true",
                        help="Regression am Ende überspringen")
    args = parser.parse_args()

    # Layout-Prüfung: die Werkzeuge erwarten <Arbeitsordner>/edigen/EdifactGenerator.
    erwartet = ARBEITSORDNER / "edigen" / "EdifactGenerator"
    if not args.nur_pruefen and erwartet.resolve() != REPO.resolve():
        sys.exit(
            f"ABBRUCH: Arbeitsordner-Layout nicht gefunden.\n"
            f"  erwartet: {erwartet} -> {REPO}\n"
            f"  Die Werkzeuge sprechen die Geschwisterordner eem/edi_energy_de/ und ahbdaten/\n"
            f"  relativ zum Arbeitsordner an (werkzeuge/LIESMICH.md). Arbeitsordner setzen mit\n"
            f"  EDIGEN_ARBEITSORDNER oder das Repository unter edigen/EdifactGenerator einhängen."
        )

    vorher = zeitscheiben_bestand()
    print("Zeitscheiben-Bestand (Prüf-IDs mit Verwendungszeitraum-Feldern):")
    for rel, pids in vorher.items():
        print(f"  {rel:38s} {len(pids)}")

    if not args.nur_pruefen:
        aktiv = args.ab is None
        namen = [n for n, _ in SCHRITTE]
        if args.ab and args.ab not in namen:
            sys.exit(f"ABBRUCH: unbekannter Schritt {args.ab!r} (bekannt: {', '.join(namen)})")
        for name, befehl in SCHRITTE:
            if not aktiv and name == args.ab:
                aktiv = True
            if not aktiv:
                print(f"--- übersprungen: {name}")
                continue
            lauf([sys.executable] + befehl, ARBEITSORDNER)

        befunde = pruefe_zeitscheiben(vorher)
        if befunde:
            for b in befunde:
                print("BEFUND:", b)
            sys.exit("ABBRUCH: Zeitscheiben-Schutz hat Verluste festgestellt — "
                     "Stand prüfen (git diff), ergaenze_zeitscheiben.py erneut fahren.")
        print("\nZeitscheiben-Schutz: kein Verlust.")

        # Registry folgt der (neu gebauten) Formular-Meta.
        lauf([sys.executable, "scripts/baue_validator_registry.py"], REPO)

    if not args.ohne_regression:
        ziel = "regression" if args.volle_regression else "smoke"
        lauf(["npm", "run", ziel], REPO)


if __name__ == "__main__":
    main()
