# Golden-Master — Formatstand 202610 (UTILMD Gas G1.2)

`messages.json` hält die erzeugten Nachrichten aller **89 Prüf-IDs** dieses Ziels
zeichengenau fest. Der Snapshot ist deterministisch (festes Datum, festes `Math.random`),
sodass jeder Lauf dieselbe Ausgabe erzeugt.

Prüfen und neu einfrieren:

```bash
EDIGEN_TARGET=202610/Stammdaten/UTILMD/Gas node _engine/tests/golden.js
EDIGEN_TARGET=202610/Stammdaten/UTILMD/Gas node _engine/tests/golden.js --update
```

Eine Abweichung ist zunächst ein Warnsignal: Sie zeigt, dass eine Änderung an der zentralen
Engine die Ausgabe dieses Formatstands verändert hat. Ist die Änderung gewollt, wird der
Snapshot mit `--update` neu gesetzt und die Begründung in `docs/` festgehalten.
