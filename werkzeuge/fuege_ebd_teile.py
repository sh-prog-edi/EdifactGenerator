#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fuege_ebd_teile.py — fuehrt die Teilergebnisse der blockweisen EBD-Extraktion zusammen."""
import collections
import glob
import json

gesamt = collections.defaultdict(lambda: {"quelle": "", "ebds": {}, "ohneTabelle": []})
for f in sorted(glob.glob("/tmp/ebdteile/*.json")):
    try:
        d = json.load(open(f, encoding="utf-8"))
    except Exception:
        continue
    for stand, inhalt in d.items():
        g = gesamt[stand]
        g["quelle"] = inhalt.get("quelle", g["quelle"])
        g["ebds"].update(inhalt.get("ebds", {}))
        g["ohneTabelle"] = sorted(set(g["ohneTabelle"]) | set(inhalt.get("ohneTabelle", [])))
json.dump(gesamt, open("ahbdaten/ebd_docx.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for stand, i in gesamt.items():
    mit = sum(1 for e in i["ebds"].values() if e.get("bedingungen"))
    print(stand, len(i["ebds"]), "EBD,", mit, "mit Baumstruktur")
