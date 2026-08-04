#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
bedingungen.py — wertet AHB-Bedingungen so weit maschinell aus, dass das Formular
Felder abhängig von anderen Feldern schalten kann.

Beispiel aus dem AHB (UTILMD Strom, Prüf-ID 55001):

    SG5 "Marktlokation"          Muss [2061] ∧ [67]
    SG5 "Ruhende Marktlokation"  Muss [2061] ∧ [96]

    [2061] Segment bzw. Segmentgruppe ist genau einmal je SG4 IDE (Vorgang) anzugeben
    [67]   Wenn in keinem SG8 SEQ+Z79 … CCI+Z66/CAV+ZH9 … der Code 9991000002933
           (Ruhende Marktlokation ausprägen) vorhanden ist
    [96]   Wenn SG4 STS+7++xxx+ZAP (Transaktionsgrundergänzung ruhende Marktlokation)
           vorhanden

Daraus folgt: Wird im STS+7 die Ergänzung ZAP gewählt, ist LOC+Z22 (ruhende
Marktlokation) zu füllen; andernfalls LOC+Z16. Genau diese Ableitung leistet dieses
Modul: aus dem Bedingungstext wird eine prüfbare Aussage der Form

    {"art": "code_vorhanden", "sg": "SG4", "seg": "STS", "code": "ZAP"}

Nicht jede Bedingung ist so formuliert. Alles, was sich nicht eindeutig auflösen
lässt, bleibt unangetastet und wird weiterhin nur als Hinweistext geführt — lieber
keine Automatik als eine falsche.
"""

from __future__ import annotations

import re

# "[96] Wenn SG4 STS+7++xxx+ZAP (…) vorhanden"
RE_BEDINGUNG = re.compile(r"\[(\d+[A-Za-z]?)\]\s*(.*?)(?=\s*\[\d+[A-Za-z]?\]|\Z)", re.S)

# Verweis auf ein konkretes Segment mit Codewerten: SG4 STS+7++xxx+ZAP
RE_SEGMENTVERWEIS = re.compile(
    r"(?:(SG\d+)\s+)?([A-Z]{3})((?:\+[A-Za-z0-9x.]*)+)",
)

RE_NUMMER = re.compile(r"\[(\d+[A-Za-z]?)\]")

VERNEINEND = re.compile(r"\b(nicht vorhanden|nicht angegeben|in keinem|in keiner|nicht genutzt)\b", re.I)
BEJAHEND = re.compile(r"\bvorhanden\b", re.I)


def zerlege_bedingungstexte(text: str) -> dict[str, str]:
    """'[67] Wenn … [96] Wenn …' -> {'67': 'Wenn …', '96': 'Wenn …'}"""
    if not text:
        return {}
    return {nr: " ".join(inhalt.split()) for nr, inhalt in RE_BEDINGUNG.findall(text)}


def nummern(ausdruck: str) -> list[str]:
    """Alle Bedingungsnummern eines AHB-Ausdrucks in Reihenfolge."""
    return RE_NUMMER.findall(ausdruck or "")


def deute_bedingung(text: str) -> dict | None:
    """Übersetzt einen Bedingungstext in eine prüfbare Aussage — oder None.

    Erkannt wird das im AHB durchgängige Muster „Wenn <SG> <SEG>+<qualifier>+<code>
    (…) vorhanden" samt verneinter Form. Alles andere bleibt bewusst unbehandelt.
    """
    if not text or not text.lower().startswith("wenn"):
        return None
    verneint = bool(VERNEINEND.search(text))
    if not verneint and not BEJAHEND.search(text):
        return None

    treffer = RE_SEGMENTVERWEIS.search(text)
    if not treffer:
        return None
    sg, segment, rest = treffer.group(1), treffer.group(2), treffer.group(3)
    roh = [t for t in rest.split("+")][1:]  # führendes Leerstück vor dem ersten '+'
    if not roh:
        return None

    qualifier = roh[0]
    # Position des Codes innerhalb des Segments: "STS+7++xxx+ZAP" meint die zweite
    # Wiederholung (Transaktionsgrundergänzung), "STS+7++xxx+xxx+E01/E03" die dritte
    # (Transaktionsgrund befristete Anmeldung). Nur die zweite hat im Formular ein
    # eigenes Feld; für tiefere Positionen wird bewusst keine Automatik abgeleitet.
    nach_qualifier = [t for t in roh[1:] if t != ""]
    if not nach_qualifier:
        # "Wenn SG7 STS+Z01 nicht vorhanden" — die Aussage betrifft das Segment selbst,
        # erkennbar an seinem Qualifier.
        nach_qualifier = [qualifier]
    letzte = nach_qualifier[-1]
    position = len(nach_qualifier)
    if letzte.lower() == "xxx":
        return None

    codes = [c for c in re.split(r"[/,]", letzte) if re.fullmatch(r"[A-Za-z0-9]{1,17}", c)]
    if not codes:
        return None

    # Der Verweis muss vollständig erfasst sein. Steht im Text unmittelbar hinter dem
    # gefundenen Code noch etwas anderes (z. B. „AJT+A09+E_0470"), meint die Bedingung
    # einen genauer bezeichneten Wert, den das Formular so nicht führt.
    rest_im_text = text[treffer.end(): treffer.end() + 1]
    if rest_im_text and rest_im_text not in " ,.;:)(":
        return None

    return {
        "art": "code_fehlt" if verneint else "code_vorhanden",
        "sg": sg,
        "seg": segment,
        "qualifier": qualifier,
        "code": codes[0],
        "codes": codes,
        "position": position,
        "text": text,
    }


def analysiere(ausdruck: str, bedingungstexte: dict[str, str]) -> dict:
    """Fasst Ausdruck und Bedingungstexte zu einer auswertbaren Beschreibung zusammen."""
    ergebnis: dict = {"ausdruck": (ausdruck or "").strip(), "nummern": [], "regeln": []}
    for nr in nummern(ausdruck):
        ergebnis["nummern"].append(nr)
        text = bedingungstexte.get(nr)
        if not text:
            continue
        regel = deute_bedingung(text)
        if regel:
            regel["nr"] = nr
            ergebnis["regeln"].append(regel)
    return ergebnis
