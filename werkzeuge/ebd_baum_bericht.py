#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ebd_baum_bericht.py — schlüsselt die Entscheidungsbaum-Diagramme (EBD) lesbar auf.

Grundlage ist die Extraktion aus `werkzeuge/ebd_docx_leser.py` (Hochfrequenz-Werkzeug
**ebdamame** auf der DOCX-Fassung des BDEW-Dokuments). Erzeugt werden:

  * `<FV>/<Gruppe>/<Schlüssel>.md` und `.json`
        je Entscheidungsbaum eine eigene Datei, gruppiert nach Präfix (E, S, G, GS).
        So zeigt ein Vergleich zweier EBD-Fassungen genau, welcher Baum sich geändert
        hat — statt eines Unterschieds quer durch eine Sammeldatei.
  * `EBD-Baumstruktur_<FV>_<Gruppe>.md`
        Sammelfassung je Gruppe zum Durchlesen.
  * `EBD-Uebersicht_<FV>.md`
        Verzeichnis aller Bäume mit Titel, Zahl der Prüfschritte und Antwortcodes.
  * `ebd_baumstruktur_<FV>.json`
        alles in einer maschinenlesbaren Datei (Grundlage für `ebd-pfade.js`).

Aufruf:  python3 werkzeuge/ebd_baum_bericht.py [--quelle ahbdaten/ebd_docx.json]
                                               [--ziel ausgabe/]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

STAND_NAME = {"202604": "FV2604 (gültig 01.04.–30.09.2026)",
              "202610": "FV2610 (gültig ab 01.10.2026)"}


def kurz(text: str, n: int = 100) -> str:
    text = " ".join(str(text or "").split())
    return text if len(text) <= n else text[:n - 1] + "…"


def gruppe_von(key: str) -> str:
    """Präfix des Schlüssels: E, S, G, GS … (alles vor dem Unterstrich)."""
    return key.split("_", 1)[0] if "_" in key else "sonstige"


def baum_abschnitt(key: str, e: dict, kopf: bool = False, stand: str = "", quelle: str = "") -> str:
    """Ein Entscheidungsbaum als Markdown: Prüfschritte, Verzweigungen, Bedingungen."""
    schritte = e.get("schritte", {})
    verzweigungen = e.get("verzweigungen", {})
    bedingungen = e.get("bedingungen", {})
    z: list[str] = []
    ebene = "#" if kopf else "##"
    z.append(f"{ebene} {key} — {kurz(e.get('titel', ''), 90)}")
    if kopf:
        z.append("")
        z.append(f"*{STAND_NAME.get(stand, stand)} · Quelle: {quelle}*")
    if e.get("rolle"):
        z.append("")
        z.append(f"*Prüfende Rolle: {e['rolle']}*")
    z.append("")
    if not schritte:
        z.append(f"{ebene}# Codeliste")
        z.append("")
        z.append("Dieses Kapitel führt keinen Entscheidungsbaum, sondern eine Codeliste.")
        z.append("")
        for code in sorted(e.get("codes", {})):
            eintrag = e["codes"][code]
            zusatz = []
            if eintrag.get("cluster"):
                zusatz.append(f"Cluster {eintrag['cluster']}")
            if eintrag.get("text"):
                zusatz.append(kurz(eintrag["text"], 110))
            z.append(f"- **{code}**" + (f" · {' · '.join(zusatz)}" if zusatz else ""))
        z.append("")
        if e.get("verweistAuf"):
            z.append(f"*Verweist auf {e['verweistAuf']}.*")
            z.append("")
        return "\n".join(z) + "\n"
    z.append(f"{ebene}# Prüfschritte")
    z.append("")
    for nr in sorted(schritte, key=lambda x: (len(x), x)):
        z.append(f"- **{nr}** — {kurz(schritte[nr], 200)}")
        for antwort, weiter, code in verzweigungen.get(nr, []):
            if code and weiter:
                ziel = f"Antwortcode **{code}**, danach Schritt {weiter}"
            elif code:
                ziel = f"Antwortcode **{code}**"
            elif weiter:
                ziel = f"weiter mit Schritt {weiter}"
            else:
                ziel = "Ende"
            z.append(f"  - {'ja  ' if antwort else 'nein'} → {ziel}")
    z.append("")
    z.append(f"{ebene}# Antwortcodes und ihre zwingenden Antworten")
    z.append("")
    z.append("Aufgeführt sind die Prüfschritte, die auf **jedem** Weg zu diesem Code dieselbe")
    z.append("Antwort tragen. Codes ohne Eintrag sind über mehrere Zweige erreichbar und damit")
    z.append("an keine einzelne Antwort gebunden.")
    z.append("")
    for code in sorted(bedingungen):
        eintrag = (e.get("codes") or {}).get(code, {})
        kopfzeile = f"**{code}**"
        if eintrag.get("cluster"):
            kopfzeile += f" · Cluster {eintrag['cluster']}"
        if eintrag.get("text"):
            kopfzeile += f" · {kurz(eintrag['text'], 80)}"
        z.append(f"- {kopfzeile}")
        if bedingungen[code]:
            for nr, antwort in bedingungen[code]:
                z.append(f"  - Schritt {nr} **{'ja' if antwort else 'nein'}** — {kurz(schritte.get(nr, ''), 150)}")
        else:
            z.append("  - (über mehrere Zweige erreichbar)")
    z.append("")
    ohne = [c for c in sorted(e.get("codes", {})) if c not in bedingungen]
    if ohne:
        z.append(f"*Im Baum nicht erreicht: {', '.join(ohne)}*")
        z.append("")
    return "\n".join(z) + "\n"


def bericht(stand: str, inhalt: dict, nur: list[str] | None = None, gruppe: str = "") -> str:
    """Sammelfassung einer Gruppe (E, S, G, GS …)."""
    ebds = inhalt["ebds"]
    schluessel = nur if nur is not None else sorted(ebds)
    z: list[str] = []
    titel = f"Entscheidungsbaum-Diagramme {gruppe or ''}".strip()
    z.append(f"# {titel} — {STAND_NAME.get(stand, stand)}")
    z.append("")
    z.append(f"Quelle: {inhalt.get('quelle', '')}")
    z.append("")
    z.append(f"{len(schluessel)} Entscheidungsbäume. Je Baum stehen zuerst die Prüfschritte mit")
    z.append("ihren Verzweigungen, danach die Antwortcodes mit den Antworten, die zwingend zu")
    z.append("ihnen gehören. Jeder Baum liegt zusätzlich als eigene Datei bei.")
    z.append("")
    for key in schluessel:
        z.append(baum_abschnitt(key, ebds[key]))
    return "\n".join(z)


def uebersicht(stand: str, inhalt: dict, strukturiert: dict, gruppen: dict) -> str:
    z: list[str] = []
    z.append(f"# Übersicht der Entscheidungsbaum-Diagramme — {STAND_NAME.get(stand, stand)}")
    z.append("")
    z.append(f"Quelle: {inhalt.get('quelle', '')}")
    z.append("")
    for gruppe, schluessel in sorted(gruppen.items()):
        z.append(f"## Gruppe {gruppe} ({len(schluessel)} Bäume)")
        z.append("")
        z.append("| EBD | Titel | Prüfschritte | Antwortcodes | Datei |")
        z.append("|---|---|---:|---:|---|")
        for key in schluessel:
            e = strukturiert[key]
            fv = f"FV{stand[2:]}"
            z.append(f"| {key} | {kurz(e['titel'], 70)} | {len(e['schritte'])} | "
                     f"{len(e['bedingungen'])} | `{fv}/{gruppe}/{key}.md` |")
        z.append("")
    return "\n".join(z) + "\n"


def maschinenlesbar(inhalt: dict) -> dict:
    aus = {}
    for key, e in inhalt["ebds"].items():
        aus[key] = {
            "titel": e.get("titel", ""),
            "rolle": e.get("rolle", ""),
            "verweistAuf": e.get("verweistAuf", ""),
            "schritte": e.get("schritte", {}),
            "verzweigungen": e.get("verzweigungen", {}),
            "codes": {c: {"cluster": v.get("cluster", ""), "text": v.get("text", "")}
                      for c, v in (e.get("codes") or {}).items()},
            "bedingungen": e.get("bedingungen", {}),
        }
    return aus


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--quelle", default="ahbdaten/ebd_docx.json")
    p.add_argument("--codelisten", nargs="*",
                   default=["ahbdaten/ebd_2604.json", "ahbdaten/ebd_2610.json"],
                   help="Kapitel ohne Entscheidungsbaum (reine Codelisten aus dem PDF-Leser)")
    p.add_argument("--ziel", default="ausgabe")
    args = p.parse_args()

    daten = json.loads(Path(args.quelle).read_text(encoding="utf-8"))
    # Die Kapitel S_xxxx / G_xxxx / GS_xxx führen statt eines Baums eine Codeliste;
    # sie gehören in die Aufschlüsselung, damit jedes Kapitel des BDEW-Dokuments eine
    # eigene Datei hat.
    for pfad in args.codelisten:
        datei = Path(pfad)
        if not datei.exists():
            continue
        for stand, inhalt in json.loads(datei.read_text(encoding="utf-8")).items():
            ziel_stand = daten.setdefault(stand, {"quelle": inhalt.get("quelle", ""), "ebds": {}})
            for key, e in inhalt.get("ebds", {}).items():
                ziel_stand["ebds"].setdefault(key, e)
    ziel = Path(args.ziel)
    ziel.mkdir(parents=True, exist_ok=True)

    for stand, inhalt in sorted(daten.items()):
        fv = f"FV{stand[2:]}"
        strukturiert = maschinenlesbar(inhalt)
        gruppen: dict[str, list[str]] = {}
        for key in sorted(strukturiert):
            gruppen.setdefault(gruppe_von(key), []).append(key)

        # 1. je Baum eine Datei (Markdown + JSON), gruppiert nach Präfix
        einzeln = 0
        for gruppe, schluessel in sorted(gruppen.items()):
            ordner = ziel / fv / gruppe
            ordner.mkdir(parents=True, exist_ok=True)
            for key in schluessel:
                (ordner / f"{key}.md").write_text(
                    baum_abschnitt(key, inhalt["ebds"][key], kopf=True, stand=stand,
                                   quelle=inhalt.get("quelle", "")), encoding="utf-8")
                (ordner / f"{key}.json").write_text(
                    json.dumps({key: strukturiert[key]}, ensure_ascii=False, indent=1), encoding="utf-8")
                einzeln += 1

        # 2. Sammelfassung je Gruppe
        for gruppe, schluessel in sorted(gruppen.items()):
            sammel = ziel / f"EBD-Baumstruktur_{fv}_{gruppe}.md"
            sammel.write_text(bericht(stand, inhalt, nur=schluessel, gruppe=gruppe), encoding="utf-8")

        # 3. Übersicht und maschinenlesbare Gesamtdatei
        (ziel / f"EBD-Uebersicht_{fv}.md").write_text(uebersicht(stand, inhalt, strukturiert, gruppen),
                                                      encoding="utf-8")
        js = ziel / f"ebd_baumstruktur_{fv}.json"
        js.write_text(json.dumps(strukturiert, ensure_ascii=False, indent=1), encoding="utf-8")

        print(f"{stand}: {len(strukturiert)} Bäume in {len(gruppen)} Gruppen "
              f"({', '.join(f'{g}={len(k)}' for g, k in sorted(gruppen.items()))}), "
              f"{sum(len(e['schritte']) for e in strukturiert.values())} Prüfschritte, "
              f"{sum(len(e['bedingungen']) for e in strukturiert.values())} Antwortcodes")
        print(f"   -> {einzeln} Einzeldateien unter {ziel / fv}/")
        print(f"   -> {js} ({js.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
