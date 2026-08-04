#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
baue_form_meta.py — erzeugt aus der neuen AHB-Datenbasis für jeden Generator-Ordner
die Datei `pruef-ids/_form-meta.js` (Formular-Meta der zentralen Engine).

Ablauf je Ordner:
  1. Prüf-IDs des Ordners aus den vorhandenen <PID>.js ermitteln
  2. zugehörige AHB-Daten laden und in das Zeilenformat überführen, das
     `scripts/ahb_form_meta.py` erwartet (Feld `zeilentyp`)
  3. das Projektwerkzeug `ahb_form_meta.py` unverändert aufrufen
  4. Ergebnis als `_form-meta.js` schreiben

So bleibt die Aufbereitung in der Hand des vorhandenen Projektskripts; neu ist allein
die vollständige und korrigierte Datengrundlage.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import bedingungen

GENERATOR = Path("edigen/EdifactGenerator")
AHBDATEN = {"202604": Path("ahbdaten/FV2604"), "202610": Path("ahbdaten/FV2610")}
SKRIPT = GENERATOR / "scripts" / "ahb_form_meta.py"


def pruefids_des_ordners(ordner: Path) -> list[str]:
    return sorted(p.stem for p in ordner.glob("*.js") if re.fullmatch(r"\d+", p.stem))


def als_zeilenformat(daten: dict) -> dict:
    """Wandelt die eigene AHB-Struktur in das vom Projektskript erwartete Format."""
    zeilen: list[dict] = []
    letzter_abschnitt = None
    for z in daten["lines"]:
        abschnitt = (z.get("section_name") or "").strip()
        if abschnitt and abschnitt != letzter_abschnitt:
            zeilen.append({"zeilentyp": "segmentname", "section_name": abschnitt})
            letzter_abschnitt = abschnitt
        eintrag = {
            "zeilentyp": "datenelement" if z.get("data_element") else "segment_status",
            "section_name": abschnitt,
            "segment_group_key": z.get("segment_group_key"),
            "segment_code": z.get("segment_code"),
            "data_element": z.get("data_element"),
            "value_pool_entry": z.get("value_pool_entry"),
            "name": z.get("name") or "",
            "ahb_expression": z.get("ahb_expression") or "",
            "conditions": z.get("conditions") or "",
        }
        zeilen.append(eintrag)
    meta = dict(daten["meta"])
    meta["beschreibung"] = meta.get("description", "")
    return {"meta": meta, "lines": zeilen}


def ergaenze_schalter(instanzen: list[dict]) -> None:
    """Trägt je Segmentinstanz die maschinell auswertbaren Bedingungen ein.

    Zusätzlich werden Alternativpaare erkannt: Stehen in derselben Segmentgruppe zwei
    Instanzen desselben Segments, von denen genau eine an einen Codewert gebunden ist
    (SG5 LOC+Z22 „Ruhende Marktlokation" ⇐ STS+7 mit ZAP), so gilt für die andere die
    Umkehrung — sie ist zu füllen, solange dieser Code nicht gewählt ist. Ohne diese
    Ableitung böte das Formular beide Lokationsangaben gleichzeitig an.
    """
    for inst in instanzen:
        texte = bedingungen.zerlege_bedingungstexte(inst.get("bedingungen", ""))
        ausdruck = inst.get("sgExpr") or inst.get("expr") or ""
        analyse = bedingungen.analysiere(ausdruck, texte)
        # Nur eindeutig zuordenbare Bedingungen werden zu Schaltregeln: bezieht sich
        # eine Bedingung auf die dritte oder eine noch tiefere Wiederholung innerhalb
        # eines Segments (z. B. „STS+7++xxx+xxx+E01/E03"), lässt sich der Code nicht
        # sicher von gleichnamigen Codes anderer Positionen unterscheiden.
        # Nur Bedingungen, die einen Codewert *innerhalb* eines Segments benennen
        # (Position 2, z. B. „STS+7++xxx+ZAP"), werden zu Schaltregeln. Aussagen über
        # das bloße Vorhandensein eines Segments („Wenn SG7 STS+Z01 nicht vorhanden")
        # lassen sich am Formular nicht zuverlässig prüfen — dort ist der Qualifier
        # fest vorgegeben, unabhängig davon, ob der Anwender das Segment nutzt.
        # Sie bleiben deshalb reiner Hinweistext.
        regeln = [r for r in analyse["regeln"] if r.get("code") and r.get("position") == 2]
        # Verknüpft der AHB-Ausdruck mehrere Bedingungen mit ODER (∨) oder liefern
        # mehrere Bedingungen zugleich eine Regel, ist die Schaltlogik nicht mehr
        # eindeutig. Dann bleibt es beim Hinweistext — ein zu Unrecht ausgeblendetes
        # Pflichtsegment wäre schlimmer als gar keine Automatik.
        if "∨" in ausdruck or "⊻" in ausdruck or len(regeln) > 1:
            regeln = []
        if regeln:
            inst["schalter"] = [
                {k: r[k] for k in ("art", "sg", "seg", "qualifier", "code", "nr")} for r in regeln
            ]

    # Alternativpaare innerhalb einer Segmentgruppe
    gruppen: dict[tuple, list[dict]] = {}
    for inst in instanzen:
        gruppen.setdefault((inst.get("sg"), inst["seg"]), []).append(inst)
    for (_, _), gruppe in gruppen.items():
        if len(gruppe) != 2:
            continue
        mit = [i for i in gruppe if i.get("schalter")]
        ohne = [i for i in gruppe if not i.get("schalter")]
        if len(mit) != 1 or len(ohne) != 1:
            continue
        quelle = mit[0]["schalter"]
        if len(quelle) != 1 or quelle[0]["art"] != "code_vorhanden":
            continue
        gegen = dict(quelle[0])
        gegen["art"] = "code_fehlt"
        gegen["abgeleitet"] = True
        ohne[0]["schalter"] = [gegen]


def baue(ordner: Path, formatstand: str) -> tuple[int, int]:
    pruefids = pruefids_des_ordners(ordner)
    if not pruefids:
        return 0, 0
    quelle = AHBDATEN[formatstand]
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pfad = Path(tmp)
        gefunden = 0
        for pruefi in pruefids:
            datei = quelle / f"{pruefi}.json"
            if not datei.exists():
                continue
            daten = json.loads(datei.read_text(encoding="utf-8"))
            (tmp_pfad / f"{pruefi}.json").write_text(
                json.dumps(als_zeilenformat(daten), ensure_ascii=False), encoding="utf-8"
            )
            gefunden += 1
        if not gefunden:
            return len(pruefids), 0
        ziel_json = tmp_pfad / "_meta.json"
        ergebnis = subprocess.run(
            [sys.executable, str(SKRIPT.resolve()), str(tmp_pfad), str(ziel_json)],
            capture_output=True, text=True,
        )
        if ergebnis.returncode != 0:
            print(f"   FEHLER {ordner}: {ergebnis.stderr.strip()[:200]}")
            return len(pruefids), 0
        meta = json.loads(ziel_json.read_text(encoding="utf-8"))

    for eintrag in meta.values():
        ergaenze_schalter(eintrag["instanzen"])

    ziel = ordner / "_form-meta.js"
    # Den bisherigen Variablennamen beibehalten (MSCONS nutzt z. B. msconsFormMeta),
    # sonst finden die Seiten ihre Formular-Meta nicht mehr.
    name = "formMeta"
    if ziel.exists():
        treffer = re.search(r"^var\s+(\w+)\s*=", ziel.read_text(encoding="utf-8"), re.M)
        if treffer:
            name = treffer.group(1)
    rumpf = json.dumps(meta, ensure_ascii=False, separators=(",", ":"))
    # U+2028/U+2029 sind in JSON erlaubt, beenden in JavaScript aber die Zeile
    # und führen zu "Invalid or unexpected token" beim Laden der Datei.
    rumpf = rumpf.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")
    inhalt = (
        "// _form-meta.js - Formular-Meta (zentrale AHB-Formular-Engine).\n"
        "// Maschinell erzeugt mit scripts/ahb_form_meta.py - nicht von Hand pflegen.\n"
        "// Datengrundlage: vollständige AHB-Extraktion beider Tabellenlayouts (28.07.2026).\n"
        f"var {name} = " + rumpf + ";\n"
        f"if (typeof module !== 'undefined') module.exports = {name};\n"
    )
    ziel.write_text(inhalt, encoding="utf-8")
    instanzen = sum(len(m["instanzen"]) for m in meta.values())
    return len(pruefids), instanzen


if __name__ == "__main__":
    gesamt_pid = gesamt_inst = 0
    for formatstand in ("202604", "202610"):
        for ordner in sorted((GENERATOR / formatstand).rglob("pruef-ids")):
            n_pid, n_inst = baue(ordner, formatstand)
            if n_pid:
                rel = ordner.relative_to(GENERATOR)
                print(f"{str(rel):58s} {n_pid:4d} Prüf-IDs {n_inst:6d} Segmentinstanzen")
                gesamt_pid += n_pid
                gesamt_inst += n_inst
    print(f"\nGesamt: {gesamt_pid} Prüf-IDs, {gesamt_inst} Segmentinstanzen")
