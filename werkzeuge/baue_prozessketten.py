#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
baue_prozessketten.py — leitet je Quell-Prüf-ID die Folgenachrichten eines
Geschäftsprozesses samt übernehmbarer Felder ab.

Zwei Quellen:

1. **Anwendungsübersicht der Prüfidentifikatoren** (Blatt „Prüf-ID Prozessschritt"):
   Spalte „Reaktion auf Prüfidentifikator" liefert die unmittelbare Antwort, die
   Spalte „Bezeichnung aus Sequenzdiagramm" das gemeinsame Sequenzdiagramm — daraus
   ergeben sich die weiteren Nachrichten desselben Use-Cases.

2. **GPKE-Auslöser**: Einige Use-Cases folgen einem anderen, ohne dass die
   Anwendungsübersicht sie verknüpft. Der Use-Case „Abrechnungsdaten
   Netznutzungsabrechnung" etwa nennt als Auslöser ausdrücklich „Durchführung nach
   dem Prozessschritt zur Zuordnung des LFN zur Marktlokation im Rahmen des
   Use-Cases 'Lieferbeginn'". Solche Bezüge stehen nur im Fließtext und sind hier
   als benannte Nachfolge-Use-Cases hinterlegt.

Die Feldzuordnung wird aus den AHB-Daten abgeleitet: Ein Feld wird übernommen, wenn
Quelle und Ziel dasselbe Segment mit demselben Qualifier führen. Ausgenommen sind
Angaben, die je Nachricht neu zu vergeben sind (Nachrichten- und Dokumentennummer,
Erstellungsdatum, Vorgangsnummer) — die Vorgangsnummer der Quelle wird stattdessen
zur Referenz RFF+TN in der Antwort.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

import openpyxl

GENERATOR = Path("edigen/EdifactGenerator")
UEBERSICHT = {
    "202604": Path("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/Anwendungsuebersicht_3.3_LF_12258.xlsx"),
    "202610": Path("wdb/Wissensdatenbank/Wissensdatenbank/regelwerk/Anwendungsuebersicht_4.0_LF_12260.xlsx"),
}

#: Segmente, deren Werte je Nachricht neu vergeben werden.
NEU_JE_NACHRICHT = {"UNH", "UNB", "UNT", "UNZ", "BGM"}

#: Einzelne (Segment, Qualifier)-Paare, die ebenfalls nicht übernommen werden:
#: das Erstellungsdatum gehört zur neuen Nachricht, und die Marktpartner werden
#: über den Richtungstausch gesetzt, nicht als Feld kopiert.
NICHT_UEBERNEHMEN = {("DTM", "137"), ("NAD", "MS"), ("NAD", "MR")}

#: Datenelement, das in einem Segment den eigentlichen Wert trägt (kein Qualifier).
WERT_DE = {
    "LOC": "3225", "DTM": "2380", "RFF": "1154", "NAD": "3039", "IDE": "7402",
    "QTY": "6060", "MOA": "5004", "PIA": "7140", "SEQ": "1050", "FTX": "4440",
    "AGR": "7365", "CCI": "7036", "CAV": "7111", "LIN": "1082", "PRI": "5118",
}

#: Qualifier-Datenelement je Segment.
QUAL_DE = {
    "LOC": "3227", "DTM": "2005", "RFF": "1153", "NAD": "3035", "IDE": "7495",
    "STS": "9015", "SEQ": "1229", "CCI": "7059", "CAV": "7111", "AJT": "4465",
}

#: Nachgelagerte Use-Cases, die die GPKE im Fließtext an einen Prozessschritt bindet.
#: Schlüssel: Sequenzdiagramm -> Liste (Folge-Sequenzdiagramm, Beleg, Auslöser).
#:
#: Der **Auslöser** bestimmt, an welchen Zeilen des auslösenden Diagramms die Folge
#: erscheint:
#:   - "start":        an den Startschritten (bisheriges Verhalten) — dort liegen
#:                     die Daten des Prozesses zuerst vor.
#:   - "bestaetigung": an den Bestätigungsschritten (Beschreibung beginnt mit
#:                     „Bestätigung“) — auch wenn sie in der Anwendungsübersicht als
#:                     „Reaktion auf“ geführt sind; fachlich ist die Bestätigung der
#:                     Auslöser („Nachbedingung im Erfolgsfall“).
GPKE_FOLGEN = {
    "Kündigung": [
        ("Lieferbeginn",
         "GPKE Teil 2, UC „Kündigung“ (Weitere Anforderungen): Der Use-Case „Kündigung“ ist "
         "einem Use-Case „Lieferbeginn“ vorzuschalten — nach der bestätigten Kündigung meldet "
         "der LFN die Zuordnung beim NB an (UC „Lieferbeginn“, Auslöser „Lieferantenwechsel“).",
         ("bestaetigung",)),
    ],
    "Lieferbeginn": [
        ("Abrechnungsdaten Netznutzungsabrechnung",
         "GPKE Teil 2, UC „Abrechnungsdaten Netznutzungsabrechnung“: Auslöser ist die "
         "Zuordnung des LFN zur Marktlokation im Rahmen des Use-Cases „Lieferbeginn“ (Fall a); "
         "UC „Lieferbeginn“, Nachbedingung im Erfolgsfall.",
         ("start", "bestaetigung")),
        ("Abrechnungsdaten Bilanzkreisabrechnung",
         "GPKE Teil 2, UC „Abrechnungsdaten Bilanzkreisabrechnung“: Auslöser ist die "
         "Zuordnung des LFN zur Marktlokation im Rahmen des Use-Cases „Lieferbeginn“ (Fall a); "
         "UC „Lieferbeginn“, Nachbedingung im Erfolgsfall.",
         ("start", "bestaetigung")),
        ("Stammdatenänderung vom NB (verantwortlich) ausgehend",
         "GPKE Teil 2, UC „Stammdatenänderung vom NB (verantwortlich) ausgehend“: Nach der "
         "Bestätigung der Anmeldung übermittelt der NB dem LFN die von ihm verantworteten "
         "Stammdaten (Sequenzdiagramm-Schritt 1 „Änderung vom NB an LF“).",
         ("start", "bestaetigung")),
    ],
}

#: Rollen-Basiskürzel der Anwendungsübersicht, die auf dieselbe Marktpartner-ID
#: zeigen können. „LF“ ist der Sammelbegriff; in welcher Ausprägung er auftritt,
#: entscheidet der Prozess, aus dem die Quellnachricht stammt. Die Auflösung greift
#: erst, wenn die Quelle genau eine passende Rolle führt — sonst bleibt das Feld leer.
ROLLEN_SYNONYME = {
    "LF": ["LF", "LFN", "LFA", "LFZ"],
    "LFN": ["LFN", "LF"],
    "LFA": ["LFA", "LF"],
    "LFZ": ["LFZ", "LF"],
    "NB": ["NB", "VNB"],
    "VNB": ["VNB", "NB"],
}


def rolle(text: str) -> str:
    """Rollenbezeichnung aus der Spalte „Kommunikation von/an“.

    Der erläuternde Zusatz in Klammern bleibt erhalten: „NB (entspricht NBA)“ und
    „NB (entspricht NBN)“ sind zwei verschiedene Marktpartner. Zusammengeführt wird
    erst bei der Auflösung — und nur dann, wenn sie eindeutig ist.
    """
    return " ".join(str(text or "").split())


def lies_uebersicht(pfad: Path) -> list[dict]:
    wb = openpyxl.load_workbook(pfad, read_only=True, data_only=True)
    ws = wb["Prüf-ID Prozessschritt"]
    zeilen = list(ws.iter_rows(values_only=True))
    kopf = zeilen[0]

    def sp(anfang: str) -> int | None:
        for i, k in enumerate(kopf):
            if k and str(k).startswith(anfang):
                return i
        return None

    i = {
        "pid": sp("Prüfidentifikator"), "reaktion": sp("Reaktion auf"),
        "seq": sp("Bezeichnung aus Sequenz"), "schritt": sp("Prozessschritt aus Sequenz"),
        "bez": sp("Beschreibung des"), "von": sp("Kommunikation von"), "an": sp("Kommunikation an"),
        "aktion": sp("Aktion"), "ahb": sp("AHB"),
    }
    daten = []
    for z in zeilen[1:]:
        pid = str(z[i["pid"]] or "").strip()
        if not re.fullmatch(r"\d{5}", pid):
            continue
        daten.append({
            "pid": pid,
            "reaktion": str(z[i["reaktion"]] or "").strip(),
            "seq": " ".join(str(z[i["seq"]] or "").split()),
            "schritt": str(z[i["schritt"]] or "").strip(),
            "bez": " ".join(str(z[i["bez"]] or "").split()),
            "von": " ".join(str(z[i["von"]] or "").split()),
            "an": " ".join(str(z[i["an"]] or "").split()),
            "aktion": " ".join(str(z[i["aktion"]] or "").split()),
            "ahb": " ".join(str(z[i["ahb"]] or "").split()),
        })
    return daten


def lade_meta(formatstand: str) -> dict[str, dict]:
    """Alle Formular-Metas eines Formatstands, Prüf-ID -> Instanzen."""
    gesamt: dict[str, dict] = {}
    for datei in (GENERATOR / formatstand).rglob("pruef-ids/_form-meta.js"):
        treffer = re.search(r"^var\s+\w+\s*=\s*(\{.*\});\s*$", datei.read_text(encoding="utf-8"), re.M | re.S)
        if not treffer:
            continue
        for pruefi, eintrag in json.loads(treffer.group(1)).items():
            gesamt[pruefi] = eintrag
    return gesamt


def qualifier_von(inst: dict) -> str | None:
    de = QUAL_DE.get(inst["seg"])
    if not de:
        return None
    eintrag = next((d for d in inst["des"] if d["de"] == de), None)
    if not eintrag or not eintrag.get("codes"):
        return None
    return eintrag["codes"][0][0]


def wertfeld(inst: dict) -> str | None:
    """Das Datenelement, das den eigentlichen Wert trägt — sofern es frei befüllbar ist."""
    de = WERT_DE.get(inst["seg"])
    if not de:
        return None
    eintrag = next((d for d in inst["des"] if d["de"] == de), None)
    if not eintrag or eintrag.get("codes"):
        return None
    return de


def feldzuordnung(quelle: dict, ziel: dict) -> list[dict]:
    """Felder, die sich aus der Quellnachricht übernehmen lassen."""
    quell_index: dict[tuple, dict] = {}
    for inst in quelle["instanzen"]:
        q = qualifier_von(inst)
        w = wertfeld(inst)
        if not w:
            continue
        quell_index.setdefault((inst["seg"], q, w), inst)

    felder: list[dict] = []
    gesehen: set[tuple] = set()
    for inst in ziel["instanzen"]:
        if inst["seg"] in NEU_JE_NACHRICHT:
            continue
        q = qualifier_von(inst)
        w = wertfeld(inst)
        if not w:
            continue
        schluessel = (inst["seg"], q, w)

        # Vorgangsnummer der Quelle wird zur Referenz in der Antwort
        if inst["seg"] == "RFF" and q == "TN":
            if ("IDE", "24", "7402") in quell_index and schluessel not in gesehen:
                felder.append({
                    "seg": "RFF", "qualDe": "1153", "qual": "TN", "de": "1154",
                    "quelle": {"seg": "IDE", "qualDe": "7495", "qual": "24", "de": "7402"},
                    "grund": "Vorgangsnummer der Quellnachricht wird zur Referenz",
                })
                gesehen.add(schluessel)
            continue

        # Die eigene Vorgangsnummer wird neu vergeben, nicht übernommen
        if inst["seg"] == "IDE":
            continue

        if (inst["seg"], q) in NICHT_UEBERNEHMEN:
            continue

        if schluessel in quell_index and schluessel not in gesehen:
            eintrag = {"seg": inst["seg"], "de": w,
                       "quelle": {"seg": inst["seg"], "de": w}}
            if q:
                eintrag.update({"qualDe": QUAL_DE[inst["seg"]], "qual": q})
                eintrag["quelle"].update({"qualDe": QUAL_DE[inst["seg"]], "qual": q})
            felder.append(eintrag)
            gesehen.add(schluessel)
    return felder


#: Qualitätsangaben des Verwendungszeitraums (SG6 RFF DE1153). Die Übermittlung von
#: Daten führt Z49 „Gültige Daten" / Z53 „Keine Daten"; die Rückmeldungen des
#: Datenclearings führen Z47 „Im System vorhandene Daten", Z54 „Im System keine Daten
#: vorhanden", Z48 „Erwartete Daten", Z55 „Keine Daten erwartet".
ZEITRAUM_CODES = ("Z47", "Z48", "Z49", "Z53", "Z54", "Z55")


def zeitraum_merkmale(eintrag: dict) -> tuple[list[str], bool]:
    """Welche Zeitraum-Qualitäten führt die Nachricht — und gibt es ein DTM+Z26 („bis")?

    Ohne „bis" lässt sich nur ein offener Verwendungszeitraum abbilden; dann kann
    die Vorbelegung keine zwei Zeitscheiben anlegen (etwa Prüf-ID 55691).
    """
    codes: list[str] = []
    hat_bis = False
    for inst in eintrag.get("instanzen", []):
        for de in inst.get("des", []):
            vorhanden = [c[0] for c in (de.get("codes") or [])]
            if inst["seg"] == "RFF" and de["de"] == "1153":
                for c in vorhanden:
                    if c in ZEITRAUM_CODES and c not in codes:
                        codes.append(c)
            if inst["seg"] == "DTM" and de["de"] == "2005" and "Z26" in vorhanden:
                hat_bis = True
    return sorted(codes), hat_bis


def baue(formatstand: str) -> dict:
    uebersicht = lies_uebersicht(UEBERSICHT[formatstand])
    meta = lade_meta(formatstand)
    nach_seq: dict[str, list[dict]] = defaultdict(list)
    for z in uebersicht:
        nach_seq[z["seq"]].append(z)

    ketten: dict[str, dict] = {}
    for zeile in uebersicht:
        quelle = zeile["pid"]
        if quelle not in meta:
            continue
        seq = zeile["seq"]
        # Startschritte eines Sequenzdiagramms bekommen eine Kette mit den übrigen
        # Schritten des Diagramms; Reaktionszeilen nur dann eine (reine GPKE-)Kette,
        # wenn ein GPKE-Folgen-Eintrag sie als Auslöser nennt (etwa die Bestätigung
        # der Anmeldung 55002 — „Nachbedingung im Erfolgsfall“).
        ist_start = zeile["reaktion"] in ("", "x", "--", "None")
        ist_bestaetigung = zeile["bez"].startswith("Bestätigung")
        folgen = [
            (folge_seq, beleg)
            for folge_seq, beleg, ausloeser in GPKE_FOLGEN.get(seq, [])
            if ("start" in ausloeser and ist_start)
            or ("bestaetigung" in ausloeser and ist_bestaetigung)
        ]
        if not ist_start and not folgen:
            continue

        schritte: list[dict] = []
        gesehen: set[str] = set()

        def ergaenze(z: dict, herkunft: str) -> None:
            ziel = z["pid"]
            if ziel == quelle or ziel in gesehen or ziel not in meta:
                return
            felder = feldzuordnung(meta[quelle], meta[ziel])
            zeitraum_codes, hat_bis = zeitraum_merkmale(meta[ziel])
            gesehen.add(ziel)
            schritte.append({
                "zeitraum": bool(zeitraum_codes), "zeitraumCodes": zeitraum_codes,
                "zeitraumBis": hat_bis,
                "pid": ziel, "label": z["bez"], "von": z["von"], "an": z["an"],
                "vonRolle": rolle(z["von"]), "anRolle": rolle(z["an"]),
                "schritt": z["schritt"], "aktion": z["aktion"], "herkunft": herkunft,
                # Rückfallebene für den Fall, dass die Rollen nicht auflösbar sind:
                # Antworten auf die Quelle laufen in Gegenrichtung.
                "tauscheRichtung": rolle(z["von"]) != rolle(zeile["von"]),
                "felder": felder,
            })

        if ist_start:
            for z in sorted(nach_seq[seq], key=lambda x: (x["schritt"].zfill(3), x["pid"])):
                if z["ahb"] != zeile["ahb"]:
                    continue   # andere Sparte / anderer Nachrichtentyp desselben Diagramms
                if z["reaktion"] == quelle:
                    ergaenze(z, f"Anwendungsübersicht: Reaktion auf {quelle}")
                    continue
                if z["pid"] == quelle:
                    continue
                # Antwort auf eine *andere* Nachricht des Diagramms — gehört nicht in diese Kette
                if re.fullmatch(r"\d{5}", z["reaktion"] or ""):
                    continue
                # Parallelvariante desselben Schritts in derselben Richtung (etwa die
                # Anmeldung der erzeugenden statt der verbrauchenden Marktlokation)
                if z["schritt"] == zeile["schritt"] and z["von"] == zeile["von"] and z["an"] == zeile["an"]:
                    continue
                ergaenze(z, f"Anwendungsübersicht: Sequenzdiagramm „{seq}“, Schritt {z['schritt']}")

        for folge_seq, beleg in folgen:
            for z in sorted(nach_seq.get(folge_seq, []), key=lambda x: (x["schritt"].zfill(3), x["pid"])):
                if z["ahb"] != zeile["ahb"] or z["schritt"] != "1":
                    continue
                ergaenze(z, beleg)

        if schritte:
            ketten[quelle] = {
                "seq": seq, "label": zeile["bez"], "ahb": zeile["ahb"],
                # Rollen der Quellnachricht: daraus wird die Marktpartner-Zuordnung
                # der Folgenachrichten abgeleitet (NAD+MS -> von, NAD+MR -> an).
                "quelleVon": rolle(zeile["von"]), "quelleAn": rolle(zeile["an"]),
                "schritte": schritte,
            }
    return ketten


if __name__ == "__main__":
    alles = {stand: baue(stand) for stand in ("202604", "202610")}
    rumpf = json.dumps(alles, ensure_ascii=False, separators=(",", ":"))
    rumpf = rumpf.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029").replace("</", "<\\/")
    ziel = GENERATOR / "_engine" / "daten" / "prozessketten.js"
    synonyme = json.dumps(ROLLEN_SYNONYME, ensure_ascii=False, separators=(",", ":"))
    ziel.write_text(
        "// prozessketten.js - Folgenachrichten je Quell-Prüf-ID mit übernehmbaren Feldern.\n"
        "// Maschinell erzeugt (werkzeuge/baue_prozessketten.py) aus der Anwendungsübersicht\n"
        "// der Prüfidentifikatoren, den GPKE-Auslösern und der AHB-Datenbasis.\n"
        "// prozessRollen: Rollenbezeichnungen, die auf dieselbe Marktpartner-ID zeigen können.\n"
        "var prozessRollen = " + synonyme + ";\n"
        "var prozessketten = " + rumpf + ";\n"
        "if (typeof module !== 'undefined') module.exports = prozessketten;\n"
        "if (typeof module !== 'undefined') module.exports.rollen = prozessRollen;\n",
        encoding="utf-8",
    )
    for stand, ketten in alles.items():
        schritte = sum(len(k["schritte"]) for k in ketten.values())
        felder = sum(len(s["felder"]) for k in ketten.values() for s in k["schritte"])
        print(f"{stand}: {len(ketten)} Ketten, {schritte} Folgenachrichten, {felder} Feldzuordnungen")
    k = alles["202604"].get("55001")
    if k:
        print("\n55001 (202604):", k["seq"])
        for s in k["schritte"]:
            print(f"   {s['pid']} {s['label'][:36]:38s} {s['von']}->{s['an']:6s} Felder: {len(s['felder'])}")
