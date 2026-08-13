#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lies_contrl_fehlercodes.py — liest die Codelisten der CONTRL-Servicesegmente
(DE0083 „Aktion, codiert" und DE0085 „Syntax-Fehler, codiert") aus dem
BDEW-MIG CONTRL und erzeugt `_engine/daten/uci-fehlercodes.js`.

Hintergrund (Protokoll Abschnitt 74): Die Datei enthielt bis dahin eine von Hand
gepflegte Teilliste von 12 „gängigen" Codes. Eine real erhaltene negative CONTRL
mit DE0085 = 26 („Duplikat gefunden") lief deshalb ohne Klartext durch — der
Ablehnungs-Abgleich zeigte nur die nackte Zahl. Nach der Projektkonvention müssen
Prüfgrundlagen maschinell aus den Originaldokumenten gelesen werden, nicht kuratiert.

WICHTIG — die Codeliste ist je Segment verschieden: DE0085 führt im UCI-Segment
(Übertragungsdatei-Ebene) andere Codes und andere Erläuterungen als im UCM
(Nachrichtenebene), UCS (Segmentebene) oder UCD (Datenelementebene). Beispiel
Code 26: im UCI „Duplikat einer früher empfangenen ÜBERTRAGUNGSDATEI", im UCM
„Duplikat einer NACHRICHT in der zugrundeliegenden Übertragungsdatei". Deshalb
wird je Segment eine eigene Liste ausgegeben.

Quelle: MIG_CONTRL (DOCX), Segmentlayout-Tabelle. Aufbau dort je Codeliste:

    0085<TAB>Syntax-Fehler, codiert<TAB>C<TAB>an..3<TAB><TAB>D<TAB>n..2<TAB><TAB>2<TAB>Syntax-Version …
    Mitteilung, dass die Syntax-Version …
    <TAB>7<TAB>Empfänger der Übertragungsdatei ist nicht der
    tatsächliche Empfänger
    Mitteilung, dass …

Also: `<TAB><code><TAB><Bezeichnung>` — die Bezeichnung darf umbrechen, die
darauffolgende Erläuterung beginnt mit „Mitteilung". Lange Listen laufen über
einen Seitenumbruch in eine Folgezeile der Tabelle weiter (dazwischen wiederholte
Spaltenköpfe), deshalb wird der Block bis zur nächsten DE-/Gruppenkennung gelesen.

Ausgabe: _engine/daten/uci-fehlercodes.js mit
  var contrlCodelisten = { "UCI": { "0083": [[code, text], …], "0085": [ … ] }, … }
  var uciFehlercodes0085 = [ … ]   // Vereinigung über alle Segmente (Kompatibilität)

Aufruf:  python3 werkzeuge/lies_contrl_fehlercodes.py [--pfad <MIG_CONTRL.docx>]
Ohne --pfad wird die MIG im Arbeitsordner gesucht (EDIGEN_ARBEITSORDNER).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

try:
    import docx  # python-docx
except ImportError:  # pragma: no cover
    sys.exit("python-docx fehlt: pip install python-docx")

REPO = Path(__file__).resolve().parents[1]
ARBEITSORDNER = Path(os.environ.get("EDIGEN_ARBEITSORDNER", REPO.parent.parent))
ZIEL = REPO / "_engine" / "daten" / "uci-fehlercodes.js"

# Segmentkopfzeile im MIG-Layout: "<Zähler>\t<Nr>\t\t<SEG>\t<St>\t…"
SEGMENTKOPF = re.compile(r"^\s*\d{4}\t(?:\d{5})?\t*([A-Z]{3})\t[MC]\t")
# Beginn einer Codeliste: "<DE>\t<Name>, codiert\t…"
CODELISTE_START = re.compile(r"^\s*(00(?:83|85))\t")
# Nächste DE-/Gruppenkennung beendet den Block (z. B. "0013\t…", "S011\t…").
NAECHSTE_KENNUNG = re.compile(r"^\s*(?:[0-9]{4}|[SC][0-9]{3})\t")
# Wiederholte Spaltenköpfe nach einem Seitenumbruch — überspringen, nicht beenden.
KOPFZEILE = re.compile(r"^\s*(?:\tStandard\tBDEW|Bez\tName\tSt\tFormat|Standard\tBDEW)")
# Ein Codeeintrag: <TAB><code><TAB><Bezeichnung …>
CODE_EINTRAG = re.compile(r"\t(\d{1,3})\t")


def zeilentext(row) -> str:
    """Zeilentext einer DOCX-Tabellenzeile ohne die Duplikate verbundener Zellen."""
    return "\t".join(dict.fromkeys(c.text for c in row.cells))


def finde_mig(pfad_arg: str | None) -> Path:
    if pfad_arg:
        p = Path(pfad_arg)
        if not p.is_file():
            sys.exit(f"MIG nicht gefunden: {p}")
        return p
    treffer = sorted(ARBEITSORDNER.rglob("MIG_CONTRL*.docx"))
    if not treffer:
        sys.exit(
            "MIG_CONTRL*.docx nicht im Arbeitsordner gefunden.\n"
            f"  Gesucht unter: {ARBEITSORDNER}\n"
            "  Abhilfe: EDIGEN_ARBEITSORDNER setzen oder --pfad angeben."
        )
    return treffer[-1]


def _entzeilen(text: str) -> str:
    """Layout-Zeilenumbrüche der DOCX-Zelle zu einer Zeile zusammenziehen."""
    text = re.sub(r"\s*\n\s*", " ", text)
    # Im DOCX steht gelegentlich ein weiches Trennzeichen ("MP- ID").
    text = re.sub(r"(\w)- (\w)", r"\1-\2", text)
    return re.sub(r"\s{2,}", " ", text).strip(" \t-")


def bezeichnung_saeubern(roh: str) -> tuple[str, str]:
    """(Bezeichnung, Erläuterung) — die Erläuterung beginnt mit „Mitteilung …"."""
    teile = roh.split("\nMitteilung", 1)
    bezeichnung = _entzeilen(teile[0])
    erlaeuterung = _entzeilen("Mitteilung" + teile[1]) if len(teile) > 1 else ""
    return bezeichnung, erlaeuterung


def lies_block(rows: list[str], start: int) -> tuple[str, int]:
    """Rohtext einer Codeliste ab Zeile `start` bis zur nächsten DE-Kennung."""
    teile = [rows[start]]
    i = start + 1
    while i < len(rows):
        zeile = rows[i]
        if KOPFZEILE.match(zeile) or not zeile.strip():
            i += 1
            continue
        if NAECHSTE_KENNUNG.match(zeile) or SEGMENTKOPF.match(zeile):
            break
        teile.append(zeile)
        i += 1
    return "\n".join(teile), i


def codes_aus_block(block: str) -> list[list[str]]:
    """[code, Bezeichnung, Erläuterung] aus dem Rohtext einer Codeliste."""
    # Vor dem ersten Codeeintrag stehen die Statusspalten (an..3, n..2 …) — die
    # enthalten keine reinen Zahlenfelder und stören das Muster deshalb nicht.
    treffer = list(CODE_EINTRAG.finditer(block))
    gesehen: dict[str, list[str]] = {}
    for k, m in enumerate(treffer):
        ende = treffer[k + 1].start() if k + 1 < len(treffer) else len(block)
        bezeichnung, erlaeuterung = bezeichnung_saeubern(block[m.end():ende])
        if bezeichnung:
            # Dubletten (gleicher Code mehrfach) auf den ersten Treffer eindampfen.
            gesehen.setdefault(m.group(1), [bezeichnung, erlaeuterung])
    return [[c] + t for c, t in sorted(gesehen.items(), key=lambda x: int(x[0]))]


def lies_codelisten(mig: Path) -> dict[str, dict[str, list[list[str]]]]:
    dokument = docx.Document(str(mig))
    ergebnis: dict[str, dict[str, list[list[str]]]] = {}
    for tabelle in dokument.tables:
        rows = [zeilentext(r) for r in tabelle.rows]
        segment = None
        i = 0
        while i < len(rows):
            kopf = SEGMENTKOPF.match(rows[i])
            if kopf:
                segment = kopf.group(1)
            start = CODELISTE_START.match(rows[i])
            if start and segment:
                block, weiter = lies_block(rows, i)
                codes = codes_aus_block(block)
                if codes:
                    ergebnis.setdefault(segment, {})[start.group(1)] = codes
                i = weiter
                continue
            i += 1
    return ergebnis


def schreibe(codelisten: dict[str, dict[str, list[list[str]]]], quelle: str) -> None:
    # Vereinigung aller DE0085-Listen für die bisherige flache API. Bei
    # segmentabhängig abweichendem Text gewinnt die allgemeinste Fassung (UCI,
    # dann UCM/UCS/UCD) — die segmentgenaue Fassung steht in contrlCodelisten.
    flach: dict[str, list[str]] = {}
    for segment in ("UCI", "UCM", "UCS", "UCD"):
        for eintrag in codelisten.get(segment, {}).get("0085", []):
            flach.setdefault(eintrag[0], eintrag[1:])
    flach_liste = [[c] + t for c, t in sorted(flach.items(), key=lambda x: int(x[0]))]

    def js_liste(eintraege: list[list[str]], einzug: str) -> str:
        breite = max((len(json.dumps(e[0], ensure_ascii=False)) for e in eintraege), default=4)
        zeilen = []
        for e in eintraege:
            felder = [f"{json.dumps(e[0], ensure_ascii=False):<{breite}}"]
            felder += [json.dumps(x, ensure_ascii=False) for x in e[1:]]
            zeilen.append(f"{einzug}[{', '.join(felder)}]")
        return ",\n".join(zeilen)

    teile = [
        "// _engine/daten/uci-fehlercodes.js",
        "// " + "-" * 66,
        "// Codelisten der CONTRL-Servicesegmente (UNTDID 0083 „Aktion, codiert" +
        "\" und",
        "// 0085 „Syntax-Fehler, codiert\").",
        "//",
        "// MASCHINELL ERZEUGT aus dem BDEW-MIG CONTRL durch",
        "// werkzeuge/lies_contrl_fehlercodes.py — nicht von Hand pflegen.",
        f"// Quelle: {quelle}",
        "//",
        "// Die Liste ist JE SEGMENT verschieden: DE0085 führt im UCI-Segment",
        "// (Übertragungsdatei-Ebene) andere Codes und Erläuterungen als im UCM",
        "// (Nachricht), UCS (Segment) oder UCD (Datenelement). Beispiel Code 26 —",
        "// UCI: Duplikat einer früher empfangenen ÜBERTRAGUNGSDATEI; UCM: Duplikat",
        "// einer NACHRICHT in der zugrundeliegenden Übertragungsdatei. Wer die",
        "// Ebene kennt (CONTRL-Generator, Ablehnungs-Abgleich), schlägt deshalb",
        "// segmentgenau über contrlCodelisten nach; uciFehlercodes0085 bleibt als",
        "// Vereinigung für die einfache Textanzeige erhalten.",
        "//",
        "// Eintragsformat: [code, Bezeichnung, Erläuterung aus der MIG].",
        "// " + "-" * 66,
        "var contrlCodelisten = {",
    ]
    for segment in sorted(codelisten):
        teile.append(f'  "{segment}": {{')
        des = codelisten[segment]
        for k, de in enumerate(sorted(des)):
            komma = "," if k + 1 < len(des) else ""
            teile.append(f'    "{de}": [')
            teile.append(js_liste(des[de], "      "))
            teile.append(f"    ]{komma}")
        teile.append("  }," if segment != sorted(codelisten)[-1] else "  }")
    teile.append("};")
    teile.append("")
    teile.append("// Vereinigung aller DE0085-Codes (Reihenfolge: numerisch).")
    teile.append("var uciFehlercodes0085 = [")
    teile.append(js_liste(flach_liste, "  "))
    teile.append("];")
    teile.append("")
    teile.append("// Segmentgenauer Nachschlag mit Rückfall auf die Vereinigung.")
    teile.append("// Rückgabe: { text, erlaeuterung, quelle } — quelle ist das Segment,")
    teile.append('// aus dessen Codeliste der Text stammt, "" wenn der Code in der MIG')
    teile.append("// gar nicht geführt wird (dann ist der Absender selbst auffällig).")
    teile.append("function contrlFehlereintrag(code, segment, de) {")
    teile.append("  var suche = function (liste) {")
    teile.append("    for (var i = 0; i < (liste || []).length; i++)")
    teile.append("      if (liste[i][0] === String(code)) return liste[i];")
    teile.append("    return null;")
    teile.append("  };")
    teile.append('  var deKey = de || "0085";')
    teile.append('  var eigen = suche(((contrlCodelisten || {})[segment || ""] || {})[deKey]);')
    teile.append("  if (eigen)")
    teile.append('    return { text: eigen[1], erlaeuterung: eigen[2] || "", quelle: segment };')
    teile.append('  if (deKey === "0085") {')
    teile.append("    var allg = suche(uciFehlercodes0085);")
    teile.append("    if (allg)")
    teile.append('      return { text: allg[1], erlaeuterung: allg[2] || "", quelle: "" };')
    teile.append("  }")
    teile.append('  return { text: "", erlaeuterung: "", quelle: null };')
    teile.append("}")
    teile.append("")
    teile.append("// Kurzform für die reine Textanzeige (bisherige Aufrufform).")
    teile.append("function contrlFehlertext(code, segment, de) {")
    teile.append("  return contrlFehlereintrag(code, segment, de).text;")
    teile.append("}")
    teile.append("")
    teile.append('if (typeof module !== "undefined")')
    teile.append("  module.exports = {")
    teile.append("    contrlCodelisten: contrlCodelisten,")
    teile.append("    uciFehlercodes0085: uciFehlercodes0085,")
    teile.append("    contrlFehlereintrag: contrlFehlereintrag,")
    teile.append("    contrlFehlertext: contrlFehlertext,")
    teile.append("  };")
    teile.append("")
    ZIEL.write_text("\n".join(teile), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pfad", help="Pfad zur MIG_CONTRL-DOCX (sonst Suche im Arbeitsordner)")
    args = ap.parse_args()

    mig = finde_mig(args.pfad)
    codelisten = lies_codelisten(mig)
    if not codelisten:
        sys.exit(f"Keine Codelisten in {mig.name} gefunden — Layout geprüft?")
    schreibe(codelisten, mig.name)

    print(f"Quelle : {mig}")
    for segment in sorted(codelisten):
        for de in sorted(codelisten[segment]):
            codes = [e[0] for e in codelisten[segment][de]]
            print(f"  {segment} DE{de}: {len(codes):>2} Codes  {', '.join(codes)}")
    print(f"Ziel   : {ZIEL.relative_to(REPO)}")


if __name__ == "__main__":
    main()
