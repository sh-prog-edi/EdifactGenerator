#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
mako_plattform.py — lokale Anbindung der BDEW-MaKo-Plattform (bdew-mako.de).

Zwei Aufgaben (Erstlauf und API-Erkundung: Protokoll Abschnitt 47):

  --dokumente   Abgleich des Quellen-Manifests (docs/QUELLEN_MANIFEST.json)
                gegen /api/documents: meldet Fassungen, die das Manifest nicht
                kennt (fileId oberhalb des Manifest-Bestands bzw. jüngeres
                validFrom) — die Frühwarnung für den nächsten Formatstand.
  --fragen      Veröffentlichte Q&A des BDEW-Forums Datenformate
                (/api/questions) einsammeln und als Markdown-Tabelle ausgeben;
                optional --suche <Begriff> (filtert Dokumentname/Frage/Antwort).

Die API paginiert im DevExtreme-Stil: ?skip=N&take=M, bei /api/documents auch
sort=[{"selector":"fileId","desc":true}] (URL-kodiert). Dieses Werkzeug läuft
LOKAL beim Auftraggeber (wie die übrigen Extraktionswerkzeuge); es lädt nur
Metadaten/Texte, keine Dokumente. Downloads weiterhin bewusst von Hand:
https://bdew-mako.de/api/downloadFile/<fileId>.
"""

from __future__ import annotations

import argparse
import json
import urllib.parse
import urllib.request
from pathlib import Path

BASIS = "https://bdew-mako.de/api"
REPO = Path(__file__).resolve().parents[1]
MANIFEST = REPO / "docs" / "QUELLEN_MANIFEST.json"


def hole(pfad: str, **params) -> dict:
    url = f"{BASIS}/{pfad}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    anfrage = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(anfrage, timeout=60) as antwort:
        return json.loads(antwort.read().decode("utf-8"))


def alle_seiten(pfad: str, take: int = 100, maximal: int = 5000, **params) -> list[dict]:
    eintraege: list[dict] = []
    skip = 0
    while skip < maximal:
        daten = hole(pfad, skip=skip, take=take, **params).get("data", [])
        eintraege.extend(daten)
        if len(daten) < take:
            break
        skip += take
    return eintraege


def abgleich_dokumente() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    bekannt = {d["makoFileId"] for d in manifest["dokumente"] if d.get("makoFileId")}
    max_id = max(bekannt)
    sort = json.dumps([{"selector": "fileId", "desc": True}])
    dokumente = alle_seiten("documents", sort=sort)
    neu = [d for d in dokumente if d.get("fileId") and d["fileId"] > max_id]
    print(f"Manifest: {len(bekannt)} fileIds, höchste {max_id} · Plattform: {len(dokumente)} Dokumente\n")
    if not neu:
        print("Keine Fassungen oberhalb des Manifest-Stands — Manifest aktuell.")
        return 0
    print(f"{len(neu)} Fassung(en) oberhalb des Manifest-Stands:\n")
    print("| fileId | Titel | Version | gültig ab | veröffentlicht |")
    print("|---|---|---|---|---|")
    for d in sorted(neu, key=lambda x: x["fileId"]):
        print(f"| {d['fileId']} | {d.get('title', '?')} | {d.get('version', '')} "
              f"| {str(d.get('validFrom', ''))[:10]} | {str(d.get('publicationDate', ''))[:10]} |")
    print("\nBewerten: Konsultationsfassung (nicht normativ) oder neue gültige Fassung?")
    print("Bei Übernahme: Wissensdatenbank + QUELLEN_MANIFEST.json nachführen, Pipeline fahren.")
    return 1


def fragen(suche: str | None) -> int:
    eintraege = alle_seiten("questions", take=50)
    if suche:
        s = suche.lower()
        eintraege = [e for e in eintraege if s in json.dumps(e, ensure_ascii=False).lower()]
    print(f"{len(eintraege)} veröffentlichte Q&A" + (f" (Filter: {suche})" if suche else "") + "\n")
    print("| Ticket | Dokument | Frage (kurz) | Antwort (kurz) |")
    print("|---|---|---|---|")
    kurz = lambda t, n: " ".join(str(t or "").split())[:n]
    for e in eintraege:
        print(f"| {e.get('ticketNumber', '?')} | {kurz(e.get('documentName'), 40)} "
              f"| {kurz(e.get('questionShort') or e.get('questionLong'), 90)} "
              f"| {kurz(e.get('answerShort') or e.get('answerLong'), 110)} |")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="BDEW-MaKo-Plattform: Dokument-Abgleich und Q&A")
    parser.add_argument("--dokumente", action="store_true", help="Manifest gegen /api/documents abgleichen")
    parser.add_argument("--fragen", action="store_true", help="Q&A des Forums Datenformate ausgeben")
    parser.add_argument("--suche", help="Q&A-Filter (Begriff in Dokument/Frage/Antwort)")
    args = parser.parse_args()
    if not (args.dokumente or args.fragen):
        parser.error("mindestens --dokumente oder --fragen angeben")
    rc = 0
    if args.dokumente:
        rc = abgleich_dokumente()
    if args.fragen:
        fragen(args.suche)
    raise SystemExit(rc)
