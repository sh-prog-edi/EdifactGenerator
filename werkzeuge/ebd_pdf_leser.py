#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ebd_pdf_leser.py — liest die Entscheidungsbaum-Diagramme (EBD) aus dem
BDEW-Dokument „Entscheidungsbaum-Diagramme und Codelisten für die
Antwortnachrichten" und stellt je EBD-Schlüssel die Antwortcodes bereit.

Warum ein eigener Leser: Das Hochfrequenz-Werkzeug `ebdamame` liest die
**DOCX**-Fassung des Dokuments (`get_ebd_docx_tables`). In der Wissensdatenbank
liegt das EBD nur als PDF (kons_12240 / kons_12242) und als Textauszug vor; die
DOCX-Fassung ist nicht Teil des Spiegels. Der frühere Textauszug-Extraktor
(`scripts/ebd_extractor.py`) arbeitete mit Whitespace-Heuristiken und lieferte
abgeschnittene Hinweise und unvollständige Codelisten.

Dieser Leser wertet die Wortkoordinaten des PDF aus: Die Spaltengrenzen werden aus
der Tabellenkopfzeile („Nr. | Prüfschritt | Prüfergebnis | Code | Hinweis")
bestimmt, danach wird jede Textzeile positionsgenau in die Spalten einsortiert.
Damit bleiben Prüfergebnis, Code und Hinweis sauber getrennt — anders als bei einer
Zellenliste, in der Layout-Leerspalten die Zuordnung verschieben.

Gelesen werden je EBD:
  - Schlüssel (E_xxxx, S_xxxx, G_xxxx, GS_xxx) und Titel,
  - prüfende Rolle,
  - alle Antwortcodes mit vollständigem Hinweistext,
  - das im Hinweis ausgewiesene Cluster („Cluster: Zustimmung" / „Ablehnung").

Aufruf:  python3 werkzeuge/ebd_pdf_leser.py [--stand 202604] [--seiten N]
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import pdfplumber

QUELLEN = {
    "202604": ("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/ebd/EBD_4.2_kons_12240.pdf",
               "Entscheidungsbaum-Diagramme und Codelisten 4.2 (kons. 23.06.2026)"),
    "202610": ("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/ebd/EBD_4.3_kons_12242.pdf",
               "Entscheidungsbaum-Diagramme und Codelisten 4.3 (kons. 23.06.2026)"),
}

#: Überschrift eines EBD, etwa „6.6.4 E_0623_Lieferbeginn prüfen"
KOPF_RE = re.compile(r"^\s*\d+(?:\.\d+)+\s+((?:E|S|G|GS)_\d{3,4})_?\s*(.*?)\s*$")
ROLLE_RE = re.compile(r"^\s*Prüfende Rolle:\s*(.+?)\s*$")
CODE_RE = re.compile(r"^(A(?:\d{2}|\*\*))$")
CLUSTER_RE = re.compile(r"^Cluster:\s*(Zustimmung|Ablehnung|Hinweis)\b\s*[:\-]?\s*", re.I)
#: Verweis auf ein anderes EBD („Es ist das EBD E_0527 zu nutzen.")
VERWEIS_RE = re.compile(r"^Es ist das EBD ((?:E|S|G|GS)_\d{3,4})[_ ].*zu nutzen", re.I)
#: Zeilenhöhe, innerhalb derer Wörter zur selben Textzeile gehören
ZEILEN_TOLERANZ = 3.0
KOPFWOERTER = ("Nr.", "Prüfschritt", "Prüfergebnis", "Code", "Hinweis")
#: Zweiter Tabellentyp: reine Codelisten („Code | Nutzung | [Bedingung] | Name"),
#: wie sie die Servicenachrichten-Kapitel (S_xxxx) und Teile der Gas-Kapitel führen.
LISTE_KOPF = ("Code", "Nutzung", "Name")
#: Codes dieser Listen sind nicht A-Codes, sondern Antwortcodes der Codeliste
LISTE_CODE_RE = re.compile(r"^(?:[A-Z]{1,2}\d{2}|Z[A-Z]\d|[A-Z]\d{2})$")


def zeilen_aus_woertern(woerter: list[dict]) -> list[list[dict]]:
    """Wörter einer Seite nach y-Position zu Textzeilen gruppieren."""
    zeilen: list[list[dict]] = []
    for w in sorted(woerter, key=lambda x: (round(x["top"], 1), x["x0"])):
        if zeilen and abs(zeilen[-1][0]["top"] - w["top"]) <= ZEILEN_TOLERANZ:
            zeilen[-1].append(w)
        else:
            zeilen.append([w])
    return zeilen


def spaltengrenzen(zeile: list[dict]) -> dict | None:
    """Aus der Tabellenkopfzeile die x-Startpositionen der Spalten lesen."""
    text = {w["text"]: w["x0"] for w in zeile}
    if not all(k in text for k in KOPFWOERTER):
        return None
    return {k: text[k] for k in KOPFWOERTER}


def spalte_von(w: dict, grenzen: dict) -> str:
    """Spalte eines Wortes anhand seiner x-Position (Zuordnung nach Startspalte)."""
    x = w["x0"] + 1
    treffer = "Nr."
    for name in KOPFWOERTER:
        if x >= grenzen[name] - 6:
            treffer = name
    return treffer


def lies(pfad: Path, max_seiten: int | None = None) -> dict:
    ebds: dict[str, dict] = {}
    aktuell: str | None = None
    letzter_code: str | None = None
    grenzen: dict | None = None
    liste: dict | None = None

    with pdfplumber.open(pfad) as pdf:
        seiten = pdf.pages if max_seiten is None else pdf.pages[:max_seiten]
        for seite in seiten:
            woerter = seite.extract_words(use_text_flow=False, keep_blank_chars=False)
            for zeile in zeilen_aus_woertern(woerter):
                text = " ".join(w["text"] for w in zeile)

                # Überschrift eines EBD (Verzeichniseinträge tragen Punktführung)
                m = KOPF_RE.match(text)
                if m and "...." not in text:
                    schluessel = m.group(1)
                    titel = re.sub(r"\s*\(Basiert auf EBD:.*$", "", m.group(2)).strip()
                    aktuell = schluessel
                    letzter_code = None
                    liste = None
                    eintrag = ebds.setdefault(schluessel, {"titel": titel, "rolle": "", "codes": {}})
                    if titel and not eintrag["titel"]:
                        eintrag["titel"] = titel
                    continue

                r = ROLLE_RE.match(text)
                if r and aktuell:
                    ebds[aktuell]["rolle"] = r.group(1).split(" Kommentar")[0].strip()
                    continue

                neu = spaltengrenzen(zeile)
                if neu:
                    grenzen = neu
                    liste = None
                    letzter_code = None
                    continue

                # Kopfzeile einer Codeliste („Code Nutzung [Bedingung] Name")
                lk = {w["text"]: w["x0"] for w in zeile}
                if all(k in lk for k in LISTE_KOPF) and "Nr." not in lk:
                    liste = {k: lk[k] for k in LISTE_KOPF}
                    grenzen = None
                    letzter_code = None
                    continue

                if aktuell and liste and not text.startswith("Version:"):
                    # Erste Spalte = Code, letzte Spalte = Name/Beschreibung
                    code_w = [w["text"] for w in zeile if w["x0"] < liste["Nutzung"] - 4]
                    name_w = [w["text"] for w in zeile if w["x0"] >= liste["Name"] - 6]
                    kandidat = code_w[0] if code_w else ""
                    if LISTE_CODE_RE.match(kandidat):
                        letzter_code = kandidat
                        ziel = ebds[aktuell]["codes"].setdefault(kandidat, {"cluster": "", "text": ""})
                        rest = " ".join(name_w).strip()
                        if rest:
                            c = re.match(r"^(Zustimmung|Ablehnung)\b", rest, re.I)
                            if c and not ziel["cluster"]:
                                ziel["cluster"] = c.group(1).capitalize()
                            ziel["text"] = (ziel["text"] + " " + rest).strip()
                        continue
                    if letzter_code and name_w:
                        ziel = ebds[aktuell]["codes"][letzter_code]
                        ziel["text"] = (ziel["text"] + " " + " ".join(name_w)).strip()
                    continue

                if not aktuell or not grenzen or text.startswith("Version:"):
                    continue

                # Verweis auf ein anderes EBD („Es ist das EBD E_0527 zu nutzen.")
                v = VERWEIS_RE.match(text)
                if v:
                    ebds[aktuell]["verweistAuf"] = v.group(1)
                    continue

                # Wörter positionsgenau in die Spalten einsortieren. Die Spalte „Code"
                # ist schmal; bei enger Satzbreite rutscht das erste Wort des Hinweises
                # mit hinein. Deshalb gilt nur ein exakt passendes erstes Wort als Code,
                # alles danach gehört zum Hinweistext.
                teile: dict[str, list[str]] = {k: [] for k in KOPFWOERTER}
                for w in zeile:
                    teile[spalte_von(w, grenzen)].append(w["text"])
                code_spalte = teile["Code"]
                code_text = code_spalte[0] if code_spalte and CODE_RE.match(code_spalte[0]) else ""
                rest = code_spalte[1:] if code_text else code_spalte
                hinweis = " ".join(rest + teile["Hinweis"]).strip()

                if code_text:
                    letzter_code = code_text
                    ziel = ebds[aktuell]["codes"].setdefault(code_text, {"cluster": "", "text": ""})
                elif letzter_code and hinweis:
                    ziel = ebds[aktuell]["codes"][letzter_code]
                else:
                    continue

                if hinweis:
                    c = CLUSTER_RE.match(hinweis)
                    if c:
                        ziel["cluster"] = c.group(1).capitalize()
                        hinweis = CLUSTER_RE.sub("", hinweis).strip()
                    if hinweis:
                        ziel["text"] = (ziel["text"] + " " + hinweis).strip()

    # Trennstriche aus dem Blocksatz zusammenziehen, Leerzeichen normalisieren
    for e in ebds.values():
        for c in e["codes"].values():
            c["text"] = re.sub(r"(\w)- (\w)", r"\1\2", " ".join(c["text"].split()))
    return {k: v for k, v in ebds.items() if v["codes"] or v.get("verweistAuf")}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--seiten", type=int, default=None, help="nur die ersten N Seiten (Probelauf)")
    p.add_argument("--ziel", default="ahbdaten/ebd.json")
    p.add_argument("--stand", default=None, help="nur einen Formatstand lesen")
    args = p.parse_args()

    ergebnis = {}
    for stand, (pfad, quelle) in QUELLEN.items():
        if args.stand and stand != args.stand:
            continue
        datei = Path(pfad)
        if not datei.exists():
            print(f"{stand}: {pfad} fehlt")
            continue
        ebds = lies(datei, args.seiten)
        codes = sum(len(e["codes"]) for e in ebds.values())
        mit_cluster = sum(1 for e in ebds.values() for c in e["codes"].values() if c["cluster"])
        print(f"{stand}: {len(ebds)} EBD, {codes} Codes, davon {mit_cluster} mit Cluster")
        ergebnis[stand] = {"quelle": quelle, "ebds": ebds}

    ziel = Path(args.ziel)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    if ziel.exists() and args.stand:
        alt = json.loads(ziel.read_text(encoding="utf-8"))
        alt.update(ergebnis)
        ergebnis = alt
    ziel.write_text(json.dumps(ergebnis, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"-> {ziel}")


if __name__ == "__main__":
    main()
