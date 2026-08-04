#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verifikation.py — vergleicht die eigenen AHB-Leser mit der kohlrahbi-Referenz und
klassifiziert jede Abweichung.

Der Vergleich ist kein Selbstzweck: kohlrahbi liest nur das klassische Tabellenlayout
und hat dort bekannte Schwächen (an Zeilenumbrüchen abgeschnittene Codewerte und
Bezeichnungen, vertauschte Code-/Namensspalte bei UNH DE0057). Ziel der Verifikation
ist deshalb nicht 100 % Deckungsgleichheit, sondern: **jede** Abweichung fällt in eine
benannte, nachvollziehbare Kategorie.

Kategorien:
  gleich                  — Zeile stimmt in allen fachlichen Feldern überein
  code_vollstaendiger     — eigener Leser hat den vollständigen Codewert, kohlrahbi einen
                            an der Umbruchstelle abgeschnittenen ("GABi-" statt "GABi-RLMmT")
  name_vollstaendiger     — eigener Leser hat die vollständige Bezeichnung
  name_kuerzer            — kohlrahbi hat die vollständigere Bezeichnung (echter Mangel)
  code_name_vertauscht    — kohlrahbi hat Code und Bezeichnung vertauscht
  ausdruck_abweichend     — die AHB-Ausdrücke unterscheiden sich (echter Mangel)
  struktur_abweichend     — Segment/Datenelement/Segmentgruppe unterscheiden sich
"""

from __future__ import annotations

import collections
import glob
import json
import re
import sys


def norm(s: str | None) -> str:
    return re.sub(r"\s+", "", s or "")


def klassifiziere(eigen: dict, kohl: dict) -> str:
    if (
        (eigen["segment_code"] or "") != (kohl["segment_code"] or "")
        or (eigen["data_element"] or "") != (kohl["data_element"] or "")
        or (eigen["segment_group_key"] or "") != (kohl["segment_group_key"] or "")
    ):
        return "struktur_abweichend"
    if norm(eigen["ahb_expression"]) != norm(kohl["ahb_expression"]):
        return "ausdruck_abweichend"

    e_code, e_name = norm(eigen["value_pool_entry"]), norm(eigen["name"])
    k_code, k_name = norm(kohl["value_pool_entry"]), norm(kohl["name"])
    if (e_code, e_name) == (k_code, k_name):
        return "gleich"
    if {e_code, e_name} == {k_code, k_name}:
        return "code_name_vertauscht"
    if e_code and k_code and e_code != k_code:
        if e_code.startswith(k_code):
            return "code_vollstaendiger"
        if k_code.startswith(e_code):
            return "code_kuerzer"
    if e_name != k_name:
        if e_name.startswith(k_name):
            return "name_vollstaendiger"
        if k_name.startswith(e_name):
            return "name_kuerzer"
    return "sonstige_abweichung"


def vergleiche(eigene: dict[str, dict], kohl_glob: str) -> tuple[collections.Counter, list]:
    kohl: dict[str, dict] = {}
    for p in glob.glob(kohl_glob):
        d = json.load(open(p))
        kohl[d["meta"]["pruefidentifikator"]] = d

    zaehler: collections.Counter = collections.Counter()
    auffaellig: list = []
    for pid in sorted(set(eigene) & set(kohl)):
        a, b = eigene[pid]["lines"], kohl[pid]["lines"]
        if len(a) != len(b):
            zaehler["zeilenzahl_abweichend"] += 1
            auffaellig.append((pid, "Zeilenzahl", len(a), len(b)))
            continue
        for i, (x, y) in enumerate(zip(a, b)):
            kat = klassifiziere(x, y)
            zaehler[kat] += 1
            if kat in ("struktur_abweichend", "ausdruck_abweichend", "name_kuerzer", "code_kuerzer", "sonstige_abweichung"):
                auffaellig.append((pid, i, kat, x, y))
    zaehler["pruefids_eigen"] = len(eigene)
    zaehler["pruefids_kohlrahbi"] = len(kohl)
    zaehler["pruefids_nur_kohlrahbi"] = len(set(kohl) - set(eigene))
    return zaehler, auffaellig


if __name__ == "__main__":
    sys.path.insert(0, "werkzeuge")
    import tabs_ahb_reader as T

    eigene = T.read_document(sys.argv[1])
    zaehler, auffaellig = vergleiche(eigene, sys.argv[2])
    for k, v in zaehler.most_common():
        print(f"{k:26s} {v}")
    print(f"\nauffällige Stellen: {len(auffaellig)}")
    for x in auffaellig[:10]:
        print("  ", x if len(x) == 4 else (x[0], x[1], x[2]))
