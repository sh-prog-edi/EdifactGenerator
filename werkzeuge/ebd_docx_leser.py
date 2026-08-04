#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ebd_docx_leser.py — liest die Entscheidungsbaum-Diagramme (EBD) mit dem
Hochfrequenz-Werkzeug **ebdamame** aus der DOCX-Fassung des BDEW-Dokuments.

Die DOCX liegen im Spiegel `eem/edi_energy_de/<FV>/EBD_*.docx`. Gewählt wird je
Formatstand die Fassung mit dem jüngsten Dokumentstand (fünftes Feld im Dateinamen).

ebdamame liefert die Entscheidungsbäume strukturiert (Prüfschritte, Ergebnisse,
Antwortcodes mit Hinweistext). Das Cluster steht im Hinweistext als
„Cluster: Zustimmung" bzw. „Cluster: Ablehnung".

Kapitel, die statt eines Baums eine reine Codeliste führen (S_xxxx, G_xxxx: Code /
Nutzung / Name), kann ebdamame nicht konvertieren. Für sie liefert
`werkzeuge/ebd_pdf_leser.py` die Daten; beide Ergebnisse werden zusammengeführt.

Aufruf:  python3 werkzeuge/ebd_docx_leser.py [--ziel ahbdaten/ebd_docx.json]
"""

from __future__ import annotations

import argparse
import json
import re
import signal
from contextlib import contextmanager
from pathlib import Path

import docx
from ebdamame import EbdNoTableSection, get_all_ebd_keys, get_ebd_docx_tables
from ebdamame.docxtableconverter import DocxTableConverter

SPIEGEL = Path("eem/edi_energy_de")
GRENZE_JE_KAPITEL = 30       # Sekunden je Entscheidungsbaum


class Zeitueberschreitung(Exception):
    """Ein Kapitel ließ sich nicht in der vorgesehenen Zeit auswerten."""


@contextmanager
def zeitgrenze(sekunden: int):
    """Bricht einen Abschnitt nach `sekunden` ab (nur im Hauptthread verfügbar)."""
    def ausloesen(signum, rahmen):                            # noqa: ARG001
        raise Zeitueberschreitung()
    alt = signal.signal(signal.SIGALRM, ausloesen)
    signal.alarm(sekunden)
    try:
        yield
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, alt)

STAENDE = {"202604": "FV2604", "202610": "FV2610"}
CLUSTER_RE = re.compile(r"^\s*Cluster:\s*(Zustimmung|Ablehnung|Hinweis)\b\s*[:\-]?\s*", re.I)


def dokumentenstand(name: str) -> str:
    """Dokumentstand aus dem Dateinamen (…_<gültig ab>_<gültig bis>_<Stand>_<Art>_<ID>)."""
    teile = name.rsplit(".", 1)[0].split("_")
    if len(teile) >= 3 and re.fullmatch(r"\d{8}", teile[-3]):
        return teile[-3]
    return "00000000"


def waehle_docx(ordner: Path) -> Path | None:
    """EBD-DOCX mit dem jüngsten Dokumentstand; bei Gleichstand die Lesefassung.

    Gleiche Regel wie bei den AHB (werkzeuge/extrahiere_alle.py): Die konsolidierte
    Lesefassung ist nicht immer die aktuellste — maßgeblich ist der Dokumentstand.
    """
    kandidaten = list(ordner.glob("EBD_*.docx"))
    if not kandidaten:
        return None
    return max(kandidaten, key=lambda p: (dokumentenstand(p.name), "_ooox_" in p.name, p.name))


def lies(pfad: Path, von: int = 0, bis: int | None = None) -> dict:
    # ebdamame öffnet das Dokument je Schlüssel neu; bei 350 Schlüsseln sprengt das
    # den Arbeitsspeicher. Der Leser arbeitet deshalb in Blöcken (--von/--bis), die
    # nacheinander in eigenen Prozessen laufen.
    schluessel = dict(list(get_all_ebd_keys(pfad).items())[von:bis])
    ebds: dict[str, dict] = {}
    ohne_tabelle: list[str] = []

    for key, (titel, kapitel) in schluessel.items():
        try:
            tabellen = get_ebd_docx_tables(pfad, ebd_key=key)
        except Exception:                                    # noqa: BLE001 - Kapitel ohne Tabelle
            ohne_tabelle.append(key)
            continue
        if isinstance(tabellen, EbdNoTableSection):
            # Enthält den Hinweistext, etwa „Es ist das EBD E_0527 zu nutzen."
            text = getattr(tabellen, "remark", "") or ""
            v = re.search(r"EBD\s+((?:E|S|G|GS)_\d{3,4})", text)
            eintrag = {"titel": titel, "rolle": "", "codes": {}}
            if v:
                eintrag["verweistAuf"] = v.group(1)
                ebds[key] = eintrag
            continue
        # Einzelne Kapitel bringen die Konvertierung von ebdamame zum Stillstand
        # (E_0406/E_0407 im Formatstand 202604). Ohne Zeitgrenze bliebe der ganze Lauf
        # hängen; die Antwortcodes dieser Kapitel liefert dann der PDF-Leser.
        with zeitgrenze(GRENZE_JE_KAPITEL):
            try:
                conv = DocxTableConverter(
                    tabellen, ebd_key=key, ebd_name=titel,
                    chapter=kapitel.chapter_title, section=kapitel.section_title)
                tabelle = conv.convert_docx_tables_to_ebd_table()
            except (Exception, Zeitueberschreitung):         # noqa: BLE001 - Codelisten-Kapitel
                ohne_tabelle.append(key)
                continue

        codes: dict[str, dict] = {}
        for zeile in tabelle.rows:
            for unter in zeile.sub_rows:
                code = (unter.result_code or "").strip()
                if not code:
                    continue
                text = " ".join((unter.note or "").split())
                cluster = ""
                m = CLUSTER_RE.match(text)
                if m:
                    cluster = m.group(1).capitalize()
                    text = CLUSTER_RE.sub("", text).strip()
                vorhanden = codes.setdefault(code, {"cluster": "", "text": ""})
                if cluster and not vorhanden["cluster"]:
                    vorhanden["cluster"] = cluster
                if text and text not in vorhanden["text"]:
                    vorhanden["text"] = (vorhanden["text"] + " " + text).strip()
        if codes:
            rolle = getattr(tabelle.metadata, "role", "") or ""
            schritte, verzweigungen, bedingungen = wege(tabelle)
            eintrag = {"titel": titel, "rolle": rolle, "codes": codes}
            if schritte:
                eintrag["schritte"] = schritte
                eintrag["verzweigungen"] = verzweigungen
                eintrag["bedingungen"] = bedingungen
            ebds[key] = eintrag

    return {"ebds": ebds, "ohneTabelle": ohne_tabelle}


def wege(tabelle) -> tuple[dict, dict, dict]:
    """Prüfschritte, Verzweigungen und die notwendigen Bedingungen je Antwortcode.

    Ein Entscheidungsbaum beantwortet je Schritt eine Frage mit ja oder nein und
    verzweigt zum nächsten Schritt oder endet mit einem Antwortcode. Für die Auswahl
    im Formular ist entscheidend, **welche Antworten zwingend zu einem Code gehören**:
    In E_0614 (Kündigung Vertrag prüfen) fragt Schritt 10 „Wurde im Geschäftsvorfall
    angegeben, dass es sich um eine verbrauchende Marktlokation handelt?" — jeder Weg
    zu A12 verneint diesen Schritt. Wer eine verbrauchende Marktlokation meldet, kann
    A12 also nicht erhalten.

    Gespeichert wird deshalb nicht jeder einzelne Weg (deren Zahl wächst mit den
    Verzweigungen exponentiell), sondern je Code die **Schnittmenge** aller Wege: die
    Prüfschritte, die auf jedem Weg dieselbe Antwort tragen. Das genügt für die
    Auswertung und ist konservativ — was nicht auf allen Wegen gilt, schränkt nicht ein.

    Reißt die Suche die Obergrenze (sehr breite Bäume), bleibt der Code ohne
    Bedingungen und damit uneingeschränkt wählbar.

    Ergebnis:
        schritte       {"10": "Wurde im Geschäftsvorfall …?", …}
        verzweigungen  {"10": [[true, "20", ""], [false, "500", ""]], …}
                       je Schritt: (Antwort, Folgeschritt, Antwortcode)
        bedingungen    {"A12": [["10", false], ["500", true]], …}
    """
    schritte: dict[str, str] = {}
    folge: dict[str, list[tuple[bool, str, str]]] = {}
    for zeile in tabelle.rows:
        nr = str(zeile.step_number or "").strip()
        if not nr:
            continue
        schritte[nr] = " ".join((zeile.description or "").split())
        eintraege = folge.setdefault(nr, [])
        for unter in zeile.sub_rows:
            ergebnis = getattr(unter.check_result, "result", None)
            weiter = str(getattr(unter.check_result, "subsequent_step_number", "") or "").strip()
            code = (unter.result_code or "").strip()
            eintraege.append((bool(ergebnis), weiter, code))

    verzweigungen = {nr: [[a, w, c] for a, w, c in eintraege] for nr, eintraege in folge.items()}
    start = min(schritte, key=lambda x: (len(x), x)) if schritte else None
    bedingungen: dict[str, list | None] = {}
    if not start:
        return schritte, verzweigungen, {}

    GRENZE = 400          # Wege je Code, danach gilt der Code als unbeschränkt
    zaehler: dict[str, int] = {}

    def merke(code: str, weg: list) -> None:
        anzahl = zaehler.get(code, 0) + 1
        zaehler[code] = anzahl
        if bedingungen.get(code, "") is None:      # bereits als unbeschränkt vermerkt
            return
        if anzahl > GRENZE:
            bedingungen[code] = None
            return
        if code not in bedingungen:
            bedingungen[code] = list(weg)
            return
        # Schnittmenge: nur behalten, was auch dieser Weg trägt
        aktuell = {tuple(x) for x in weg}
        bedingungen[code] = [b for b in bedingungen[code] if tuple(b) in aktuell]

    def lauf(nr: str, weg: list, gesehen: frozenset) -> None:
        if nr not in folge or nr in gesehen:
            return
        for antwort, weiter, code in folge[nr]:
            neuerWeg = weg + [[nr, antwort]]
            # Ein Prüfschritt kann beides tragen: einen Antwortcode und einen
            # Folgeschritt (E_0043 Schritt 11 antwortet A01/A04 und prüft in
            # Schritt 12 weiter). Deshalb kein „elif".
            if code:
                merke(code, neuerWeg)
            if weiter and weiter in folge:
                lauf(weiter, neuerWeg, gesehen | {nr})

    lauf(start, [], frozenset())
    return schritte, verzweigungen, {c: (b or []) for c, b in bedingungen.items()}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--ziel", default="ahbdaten/ebd_docx.json")
    p.add_argument("--stand", default=None)
    p.add_argument("--von", type=int, default=0)
    p.add_argument("--bis", type=int, default=None)
    args = p.parse_args()

    ergebnis = {}
    for stand, fv in STAENDE.items():
        if args.stand and stand != args.stand:
            continue
        datei = waehle_docx(SPIEGEL / fv)
        if not datei:
            print(f"{stand}: keine EBD-DOCX im Spiegel")
            continue
        daten = lies(datei, args.von, args.bis)
        codes = sum(len(e["codes"]) for e in daten["ebds"].values())
        cluster = sum(1 for e in daten["ebds"].values() for c in e["codes"].values() if c["cluster"])
        print(f"{stand}: {datei.name}")
        print(f"   {len(daten['ebds'])} EBD, {codes} Codes ({cluster} mit Cluster), "
              f"{len(daten['ohneTabelle'])} Kapitel ohne konvertierbare Tabelle")
        ergebnis[stand] = {
            "quelle": f"{datei.name} (ebdamame)",
            "ebds": daten["ebds"],
            "ohneTabelle": daten["ohneTabelle"],
        }

    ziel = Path(args.ziel)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(json.dumps(ergebnis, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"-> {ziel}")


if __name__ == "__main__":
    main()
