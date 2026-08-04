#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
regeln_io.py — Lese-/Schreibzugriff der Werkzeuge auf die Feldauswahl-Datenschicht
`pruef-ids/_regeln.js` (ahbRulesByPrufId, seit dem Feldauswahl-Umbau Phase 2).

Die Datei ist JavaScript mit einem einzigen JSON-Objekt. Damit kein Format-Rauschen
in die Git-Historie gerät, schreibt dieses Modul EXAKT im Format des Migrators
(scripts/baue_pid_regeln.js): Kommentarkopf + `const ahbRulesByPrufId = ` +
JSON.stringify(daten, null, 1) + Modul-Export. Die Serialisierung übernimmt Node —
Python- und Node-JSON unterscheiden sich in Randfällen (Escaping).
"""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
from pathlib import Path

FUSS = "if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;\n"


def lade(pfad: Path) -> tuple[str, dict]:
    """Liest die Datendatei; liefert (Kommentarkopf, ahbRulesByPrufId)."""
    text = Path(pfad).read_text(encoding="utf-8")
    anker = "const ahbRulesByPrufId = "
    pos = text.index(anker)
    kopf = text[:pos]
    treffer = re.search(re.escape(anker) + r"(\{.*\});\n", text, re.S)
    if not treffer:
        raise ValueError(f"{pfad}: ahbRulesByPrufId nicht gefunden")
    return kopf, json.loads(treffer.group(1))


def schreibe(pfad: Path, kopf: str, daten: dict) -> None:
    """Schreibt die Datendatei im Format von scripts/baue_pid_regeln.js."""
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False,
                                     encoding="utf-8") as tmp:
        json.dump({"kopf": kopf, "daten": daten}, tmp, ensure_ascii=False)
        tmp_pfad = tmp.name
    skript = (
        "const fs = require('fs');"
        f"const uebergabe = JSON.parse(fs.readFileSync({json.dumps(tmp_pfad)}, 'utf8'));"
        f"fs.writeFileSync({json.dumps(str(Path(pfad)))}, uebergabe.kopf"
        " + 'const ahbRulesByPrufId = ' + JSON.stringify(uebergabe.daten, null, 1)"
        f" + ';\\n' + {json.dumps(FUSS)});"
    )
    ergebnis = subprocess.run(["node", "-e", skript], capture_output=True, text=True)
    Path(tmp_pfad).unlink(missing_ok=True)
    if ergebnis.returncode != 0:
        raise RuntimeError(f"Schreiben über Node fehlgeschlagen: {ergebnis.stderr}")


if __name__ == "__main__":
    # Selbsttest: Roundtrip über alle vier Ziele muss die Dateien unverändert lassen.
    import sys
    generator = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("edigen/EdifactGenerator")
    for rel in ["202604/Stammdaten/UTILMD/Strom", "202604/Stammdaten/UTILMD/Gas",
                "202610/Stammdaten/UTILMD/Strom", "202610/Stammdaten/UTILMD/Gas"]:
        pfad = generator / rel / "pruef-ids" / "_regeln.js"
        vorher = pfad.read_text(encoding="utf-8")
        kopf, daten = lade(pfad)
        schreibe(pfad, kopf, daten)
        nachher = pfad.read_text(encoding="utf-8")
        print(f"{rel}: Roundtrip {'identisch' if vorher == nachher else 'ABWEICHEND'}")
