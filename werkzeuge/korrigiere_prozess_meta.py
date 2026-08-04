#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
korrigiere_prozess_meta.py — gleicht `pruef-ids/_prozess-meta.js` gegen AHB und EBD ab.

Die Prozess-Meta steuert die Vorbelegung der UTILMD-Masken: Transaktionsgrund,
EBD-Nummer und der vorgeschlagene Antwortcode je Prüf-ID. Sie ist von Hand
angelegt worden und veraltet, sobald ein AHB oder ein Entscheidungsbaum
nachzieht. Maßgeblich sind:

  * der AHB der Prüf-ID  (`_form-meta.js`: STS+7 DE 9013 für den Grund,
    STS+E01 DE 1131 für die EBD-Nummer)
  * die Entscheidungsbaum-Diagramme (`_engine/daten/ebd-antwortcodes.js`:
    welche Codes ein EBD führt und zu welchem Cluster sie gehören)

Korrigiert werden nur Angaben, die den Quellen widersprechen:

  transaktionsgrund   nicht in der AHB-Codeliste  -> erster Code des AHB
  ebd                 nicht unter den AHB-EBD     -> passendes AHB-EBD
  antwortcode         im EBD nicht vorhanden oder -> erster Code des
                      im falschen Cluster            richtigen Clusters

Aufruf:  python3 werkzeuge/korrigiere_prozess_meta.py [--pruefen]
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

GENERATOR = Path("edigen/EdifactGenerator")
EBD_DATEI = GENERATOR / "_engine/daten/ebd-antwortcodes.js"
ORDNER = [
    ("202604", "202604/Stammdaten/UTILMD/Strom"),
    ("202604", "202604/Stammdaten/UTILMD/Gas"),
    ("202610", "202610/Stammdaten/UTILMD/Strom"),
    ("202610", "202610/Stammdaten/UTILMD/Gas"),
]


def lade_js_objekt(pfad: Path) -> dict:
    text = pfad.read_text(encoding="utf-8")
    m = re.search(r"^var\s+\w+\s*=\s*(\{.*\});\s*$", text, re.M | re.S)
    return json.loads(m.group(1)) if m else {}


def lade_prozessmeta(pfad: Path) -> dict:
    """`_prozess-meta.js` ist handgeschriebenes JavaScript — über node einlesen."""
    import subprocess
    ergebnis = subprocess.run(
        ["node", "-e", f"const m=require({json.dumps(str(pfad.resolve()))}); process.stdout.write(JSON.stringify(m));"],
        capture_output=True, text=True)
    return json.loads(ergebnis.stdout) if ergebnis.returncode == 0 and ergebnis.stdout.strip() else {}


def folge_verweis(ebds: dict, key: str) -> tuple[str, dict | None]:
    e, tiefe = ebds.get(key), 0
    while e and e.get("verweistAuf") and tiefe < 3:
        key, e, tiefe = e["verweistAuf"], ebds.get(e["verweistAuf"]), tiefe + 1
    return key, e


def ahb_angaben(instanzen: list) -> tuple[list[str], list[str]]:
    """(Transaktionsgründe, EBD-Nummern) laut AHB dieser Prüf-ID."""
    gruende: list[str] = []
    ebds: list[str] = []
    for inst in instanzen:
        if inst.get("seg") != "STS":
            continue
        kategorie = [c[0] for d in inst.get("des", []) if d["de"] == "9015" for c in d.get("codes", [])]
        if "7" in kategorie:
            for d in inst.get("des", []):
                if d["de"] == "9013" and d.get("pos", 2) == 2:
                    gruende += [c[0] for c in d.get("codes", [])]
        if "E01" in kategorie:
            for d in inst.get("des", []):
                if d["de"] == "1131":
                    ebds += [c[0] for c in d.get("codes", []) if re.fullmatch(r"(E|S|G|GS)_\d{3,4}", c[0])]
    return gruende, list(dict.fromkeys(ebds))


def ersetze_feld(text: str, pruefi: str, feld: str, wert: str) -> tuple[str, bool]:
    """Setzt ein Feld innerhalb des Eintrags einer Prüf-ID (JS-Objektliteral)."""
    muster = re.compile(r'("%s"\s*:\s*\{)((?:[^{}]|\{[^{}]*\})*?)(\b%s\s*:\s*)("[^"]*"|null)' % (pruefi, feld), re.S)
    m = muster.search(text)
    if not m:
        return text, False
    neu = f'{m.group(1)}{m.group(2)}{m.group(3)}"{wert}"'
    return text[:m.start()] + neu + text[m.end():], True


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--pruefen", action="store_true", help="nur berichten, nichts schreiben")
    args = p.parse_args()

    alleEbd = lade_js_objekt(EBD_DATEI)
    bericht: list[str] = []
    zaehler = {"grund": 0, "ebd": 0, "code": 0}

    for stand, rel in ORDNER:
        pd = GENERATOR / rel / "pruef-ids"
        meta = lade_js_objekt(pd / "_form-meta.js")
        datei = pd / "_prozess-meta.js"
        prozess = lade_prozessmeta(datei)
        ebds = alleEbd.get(stand, {}).get("ebds", {})
        text = datei.read_text(encoding="utf-8")

        for pruefi, pm in prozess.items():
            eintrag = meta.get(pruefi)
            if not eintrag:
                continue
            gruende, ahbEbds = ahb_angaben(eintrag.get("instanzen", []))
            cluster = {"ablehnung": "Ablehnung", "zustimmung": "Zustimmung"}.get(pm.get("antwortcluster") or "", "")

            # 1. Transaktionsgrund
            grund = pm.get("transaktionsgrund")
            if grund and gruende and grund not in gruende:
                text, ok = ersetze_feld(text, pruefi, "transaktionsgrund", gruende[0])
                if ok:
                    zaehler["grund"] += 1
                    bericht.append(f"{stand} {rel.split('/')[-1]} {pruefi}: Grund {grund} -> {gruende[0]}")

            # 2. EBD-Nummer: bevorzugt das AHB-EBD, das den Antwortcode im richtigen
            #    Cluster führt; sonst das erste des AHB.
            ebd = pm.get("ebd")
            if ahbEbds and ebd and ebd not in ahbEbds:
                treffer = None
                for kandidat in ahbEbds:
                    _, e = folge_verweis(ebds, kandidat)
                    if not e:
                        continue
                    codes = e.get("codes", {})
                    if pm.get("antwortcode") in codes and (not cluster or codes[pm["antwortcode"]].get("cluster") == cluster):
                        treffer = kandidat
                        break
                    if treffer is None and cluster and any(c.get("cluster") == cluster for c in codes.values()):
                        treffer = kandidat
                neu = treffer or ahbEbds[0]
                text, ok = ersetze_feld(text, pruefi, "ebd", neu)
                if ok:
                    zaehler["ebd"] += 1
                    bericht.append(f"{stand} {rel.split('/')[-1]} {pruefi}: EBD {ebd} -> {neu}")
                    ebd = neu

            # 3. Antwortcode gegen das (ggf. korrigierte) EBD
            code = pm.get("antwortcode")
            if code:
                quelle = ebd or (ahbEbds[0] if ahbEbds else None)
                _, e = folge_verweis(ebds, quelle) if quelle else (None, None)
                if e:
                    codes = e.get("codes", {})
                    passt = code in codes and (not cluster or not codes[code].get("cluster")
                                               or codes[code]["cluster"] == cluster)
                    if not passt:
                        # Vorrang: Codes des geforderten Clusters. Viele Entscheidungsbäume
                        # kennzeichnen nur die Ablehnungen — die übrigen Codes tragen kein
                        # Cluster und kommen für eine Bestätigung sehr wohl infrage.
                        moeglich = [c for c in sorted(codes)
                                    if c != "A**" and cluster and codes[c].get("cluster") == cluster]
                        if not moeglich:
                            moeglich = [c for c in sorted(codes)
                                        if c != "A**" and not codes[c].get("cluster")]
                        if not moeglich and code not in codes:
                            moeglich = [c for c in sorted(codes) if c != "A**"]
                        if moeglich:
                            text, ok = ersetze_feld(text, pruefi, "antwortcode", moeglich[0])
                            if ok:
                                zaehler["code"] += 1
                                bericht.append(f"{stand} {rel.split('/')[-1]} {pruefi}: Antwortcode {code} -> {moeglich[0]}"
                                               f" (aus {quelle}{', Cluster ' + cluster if cluster else ''})")

        if not args.pruefen:
            datei.write_text(text, encoding="utf-8")

    print(f"Prozess-Meta abgeglichen: {zaehler['grund']} Transaktionsgründe, "
          f"{zaehler['ebd']} EBD-Nummern, {zaehler['code']} Antwortcodes korrigiert")
    for zeile in bericht[:40]:
        print("   ", zeile)
    if len(bericht) > 40:
        print(f"    … und {len(bericht) - 40} weitere")


if __name__ == "__main__":
    main()
