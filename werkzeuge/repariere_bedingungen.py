#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
repariere_bedingungen.py — behebt unmaskierte Zeilenumbrüche in `_bedingungen.js`.

Befund vom 28.07.2026: In 14 Bedingungsdateien enthalten die Texte der Bedingungen
[490] und [491] (Sommer-/Winterzeit-Tabellen) echte Zeilenumbrüche innerhalb eines
JavaScript-String-Literals. Solche Literale sind syntaktisch ungültig — die Datei
wird vom Browser gar nicht geladen und die Bedingungs-Hilfe bleibt auf der ganzen
Seite ohne Funktion.

Repariert wird zeichengenau: innerhalb doppelter Anführungszeichen werden Zeilen-
umbrüche zu \\n und Tabulatoren zu \\t, außerhalb bleibt alles unverändert.
"""

from __future__ import annotations

import sys
from pathlib import Path


def repariere(text: str) -> tuple[str, int]:
    ergebnis: list[str] = []
    im_string = False
    maskiert = False
    ersetzt = 0
    for zeichen in text:
        if im_string:
            if maskiert:
                ergebnis.append(zeichen)
                maskiert = False
                continue
            if zeichen == "\\":
                ergebnis.append(zeichen)
                maskiert = True
                continue
            if zeichen == '"':
                im_string = False
                ergebnis.append(zeichen)
                continue
            if zeichen == "\n":
                ergebnis.append("\\n")
                ersetzt += 1
                continue
            if zeichen == "\t":
                ergebnis.append("\\t")
                ersetzt += 1
                continue
            if zeichen == "\r":
                ersetzt += 1
                continue
            ergebnis.append(zeichen)
            continue
        if zeichen == '"':
            im_string = True
        ergebnis.append(zeichen)
    return "".join(ergebnis), ersetzt


if __name__ == "__main__":
    wurzel = Path(sys.argv[1] if len(sys.argv) > 1 else "edigen/EdifactGenerator")
    gesamt = 0
    for pfad in sorted(wurzel.rglob("_bedingungen.js")):
        original = pfad.read_text(encoding="utf-8")
        neu, ersetzt = repariere(original)
        if ersetzt:
            pfad.write_text(neu, encoding="utf-8")
            print(f"{pfad.relative_to(wurzel)}: {ersetzt} Umbrüche maskiert")
            gesamt += 1
    print(f"\n{gesamt} Dateien repariert")
