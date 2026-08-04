#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
aktualisiere_utilmd_regeln.py — gleicht die Prüf-ID-Regeldateien der UTILMD-Seiten
gegen den AHB ab.

Die UTILMD-Generatoren arbeiten (anders als die übrigen Seiten) mit kuratierten
Segmentlisten `ahbRules<PID>.segments`. Dieses Skript ändert daran nur, was der AHB
verlangt, und lässt alles andere unangetastet:

  * Codelisten: die Auswahl im STS+7 (Transaktionsgrundergänzung) wird auf die im AHB
    dieser Prüf-ID tatsächlich zugelassenen Codes gesetzt. Bisher stand dort für viele
    Prüf-IDs die generische Platzhalterliste ZW4/ZW3/ZW5.
  * Fehlende Segmente: im AHB geführte LOC-/DTM-/RFF-Segmente, die in der Regeldatei
    fehlen, werden ergänzt (z. B. LOC+Z22 „Ruhende Marktlokation").
  * Abhängigkeiten: Segmente, die laut AHB an einen Codewert gebunden sind, erhalten
    das Feld `abhaengig` — der Generator blendet sie entsprechend ein und aus.

Bestehende Einträge behalten Reihenfolge, Bezeichnung und Regelhinweis.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

GENERATOR = Path("edigen/EdifactGenerator")
ORDNER = [
    ("202604", "202604/Stammdaten/UTILMD/Strom"),
    ("202604", "202604/Stammdaten/UTILMD/Gas"),
    ("202610", "202610/Stammdaten/UTILMD/Strom"),
    ("202610", "202610/Stammdaten/UTILMD/Gas"),
]

# Codes, die im STS+7 als *Ergänzung* (2. C556) stehen, nicht als Transaktionsgrund.
RE_ERGAENZUNG = re.compile(r"^(ZW\d|ZX\d|ZAP|ZZB|ZZC)$")


def lade_prozessmeta(ordner: Path) -> dict:
    """Prozess-Metadaten der Seite (u. a. der vorgesehene Transaktionsgrund je Prüf-ID)."""
    datei = ordner / "pruef-ids" / "_prozess-meta.js"
    if not datei.exists():
        return {}
    ergebnis = subprocess.run(
        ["node", "-e", f"const m=require({json.dumps(str(datei.resolve()))}); process.stdout.write(JSON.stringify(m));"],
        capture_output=True, text=True,
    )
    if ergebnis.returncode != 0 or not ergebnis.stdout.strip():
        return {}
    return json.loads(ergebnis.stdout)


def lade_formmeta(ordner: Path) -> dict:
    datei = ordner / "pruef-ids" / "_form-meta.js"
    text = datei.read_text(encoding="utf-8")
    treffer = re.search(r"^var\s+\w+\s*=\s*(\{.*\});\s*$", text, re.M | re.S)
    return json.loads(treffer.group(1))


def lade_regeln(datei: Path) -> dict | None:
    """Liest ein ahbRules-Objekt über node aus (die Dateien sind JavaScript)."""
    ergebnis = subprocess.run(
        ["node", "-e", f"const m=require({json.dumps(str(datei.resolve()))}); process.stdout.write(JSON.stringify(m));"],
        capture_output=True, text=True,
    )
    if ergebnis.returncode != 0 or not ergebnis.stdout.strip():
        return None
    return json.loads(ergebnis.stdout)


def code_von(inst: dict, de: str) -> str | None:
    for eintrag in inst.get("des", []):
        if eintrag["de"] == de and eintrag.get("codes"):
            return eintrag["codes"][0][0]
    return None


def codes_von(inst: dict, de: str) -> list[tuple[str, str]]:
    for eintrag in inst.get("des", []):
        if eintrag["de"] == de:
            return [(c[0], c[1]) for c in eintrag.get("codes", [])]
    return []


def soll_segmente(instanzen: list[dict], vorgabe_grund: str | None = None) -> dict[str, dict]:
    """Leitet aus den AHB-Instanzen die Segment-Kennungen der Regeldateien ab."""
    soll: dict[str, dict] = {}
    for inst in instanzen:
        seg = inst["seg"]
        schalter = inst.get("schalter") or []
        # Der für die Hilfe anzuzeigende Ausdruck: Bedingung der Segmentgruppe und des
        # Segments, dazu die an einzelnen Codewerten hängenden Bedingungen.
        teile = []
        for kandidat in (inst.get("sgExpr"), inst.get("expr")):
            kandidat = (kandidat or "").strip()
            if kandidat and kandidat not in teile and re.search(r"[\[∧∨⊻⊕]", kandidat):
                teile.append(kandidat)
        code_bed = []
        for de in inst.get("des", []):
            for code in de.get("codes", []):
                ausdruck = (code[2] if len(code) > 2 else "") or ""
                for nummer in re.findall(r"\[[^\]]+\]", ausdruck):
                    marke = f"{code[0]} {nummer}"
                    if nummer not in " ".join(teile) and marke not in code_bed:
                        code_bed.append(marke)
        if code_bed:
            teile.append("Codes: " + ", ".join(code_bed))
        gemeinsam = {
            "expr": inst.get("sgExpr") or inst.get("expr") or "",
            "ahbExpr": " · ".join(teile),
            "section": inst.get("section") or "",
            "schalter": schalter,
        }
        if seg == "LOC":
            code = code_von(inst, "3227")
            if code:
                soll[f"LOC_{code}"] = {**gemeinsam, "art": "LOC", "code": code,
                                       "name": f"SG5 LOC+{code}: {inst.get('section') or 'Lokation'}"}
        elif seg == "DTM" and inst.get("sg"):
            code = code_von(inst, "2005")
            if code:
                soll[f"DTM_{code}"] = {**gemeinsam, "art": "DTM", "code": code,
                                       "name": f"SG4 DTM+{code}: {inst.get('section') or 'Datum'}"}
        elif seg == "RFF" and inst.get("sg"):
            code = code_von(inst, "1153")
            if code and code not in ("Z13", "TN"):
                soll[f"RFF_{code}"] = {**gemeinsam, "art": "RFF", "code": code,
                                       "name": f"SG6 RFF+{code}: {inst.get('section') or 'Referenz'}"}
        elif seg == "STS":
            art = code_von(inst, "9015")
            if art == "7":
                # Das MIG führt die Gruppe C556 dreimal, jede mit DE 9013:
                #   STS+7++<Grund>+<Ergänzung>+<Ergänzung befristetes Lieferende>
                # Die Formular-Meta trägt die Stelle je Eintrag (`pos`), gesetzt von
                # werkzeuge/teile_sts_positionen.py. Damit ist keine Heuristik über die
                # Codegestalt mehr nötig — sie ordnete etwa ZX6 („Änderung Daten der
                # MaLo", ein Grund) fälschlich der Ergänzung zu.
                nach_stelle: dict[int, list[tuple[str, str]]] = {}
                for eintrag in inst.get("des", []):
                    if eintrag["de"] != "9013" or "pos" not in eintrag:
                        continue
                    nach_stelle.setdefault(eintrag["pos"], []).extend(
                        (c[0], c[1]) for c in eintrag.get("codes", []))
                if nach_stelle:
                    gruende = nach_stelle.get(2, [])
                    ergaenzungen = nach_stelle.get(3, [])
                    befristet = nach_stelle.get(4, [])
                else:                                   # Rückfall: Meta ohne Positionsangabe
                    alle = codes_von(inst, "9013")
                    istErgaenzung = lambda code: bool(RE_ERGAENZUNG.match(code)) and code != vorgabe_grund
                    ergaenzungen = [c for c in alle if istErgaenzung(c[0])]
                    gruende = [c for c in alle if not istErgaenzung(c[0])]
                    befristet = []
                if befristet:
                    soll["STS_7_befristet"] = {
                        **gemeinsam, "art": "STS", "optionen": befristet,
                        "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung"}
                if ergaenzungen:
                    soll["STS_7"] = {**gemeinsam, "art": "STS", "optionen": ergaenzungen,
                                     "name": "SG4 STS+7: Transaktionsgrundergänzung"}
                if gruende:
                    # Der für diesen Anwendungsfall vorgesehene Transaktionsgrund steht
                    # an erster Stelle, damit Formular und erzeugte Nachricht ihn ohne
                    # Zutun des Anwenders tragen; die übrigen zulässigen Codes folgen.
                    if vorgabe_grund and any(c == vorgabe_grund for c, _ in gruende):
                        gruende = ([c for c in gruende if c[0] == vorgabe_grund]
                                   + [c for c in gruende if c[0] != vorgabe_grund])
                    soll["STS_7_grund"] = {**gemeinsam, "art": "STS", "optionen": gruende,
                                           "name": "SG4 STS+7: Transaktionsgrund"}
    return soll


def js_wert(wert) -> str:
    return json.dumps(wert, ensure_ascii=False)


def formatiere(regeln: dict, pruefi: str) -> str:
    zeilen = ["const ahbRules%s = {" % pruefi]
    zeilen.append(f"    pruefidentifikator: {js_wert(regeln['pruefidentifikator'])},")
    zeilen.append(f"    bezeichnung: {js_wert(regeln.get('bezeichnung', ''))},")
    zeilen.append("    segments: [")
    for i, seg in enumerate(regeln["segments"]):
        teile = [f"id: {js_wert(seg['id'])}", f"name: {js_wert(seg.get('name', ''))}",
                 f"status: {js_wert(seg.get('status', 'Kann'))}"]
        if seg.get("isSelect"):
            teile.append("isSelect: true")
            optionen = ", ".join(
                "{ v: %s, t: %s }" % (js_wert(o["v"]), js_wert(o["t"])) for o in seg.get("options", [])
            )
            teile.append(f"options: [{optionen}]")
        if seg.get("ahbExpr"):
            teile.append(f"ahbExpr: {js_wert(seg['ahbExpr'])}")
        if seg.get("bedingungen"):
            teile.append(f"bedingungen: {js_wert(seg['bedingungen'])}")
        if seg.get("abhaengig"):
            teile.append(f"abhaengig: {js_wert(seg['abhaengig'])}")
        if seg.get("rule"):
            teile.append(f"rule: {js_wert(seg['rule'])}")
        for schluessel, wert in seg.items():
            if schluessel in ("id", "name", "status", "isSelect", "options", "bedingungen", "abhaengig", "rule", "ahbExpr"):
                continue
            teile.append(f"{schluessel}: {js_wert(wert)}")
        komma = "," if i < len(regeln["segments"]) - 1 else ""
        zeilen.append("        { " + ", ".join(teile) + " }" + komma)
    zeilen.append("    ],")
    # Weitere Angaben des Regelobjekts unverändert übernehmen (z. B. `nutzdaten`,
    # der kuratierte SG8/SG10-Block einzelner Prüf-IDs). Ohne diese Übernahme gingen
    # sie beim Neuschreiben der Datei verloren.
    weitere = [k for k in regeln if k not in ("pruefidentifikator", "bezeichnung", "segments")]
    for i, schluessel in enumerate(weitere):
        komma = "," if i < len(weitere) - 1 else ""
        zeilen.append(f"    {schluessel}: {js_wert(regeln[schluessel])}{komma}")
    if not weitere:
        zeilen[-1] = "    ]"
    zeilen.append("};")
    zeilen.append("")
    zeilen.append(f"if (typeof module !== 'undefined') module.exports = ahbRules{pruefi};")
    return "\n".join(zeilen) + "\n"


def status_aus_ausdruck(ausdruck: str) -> str:
    ausdruck = (ausdruck or "").strip()
    if ausdruck == "Muss":
        return "Muss"
    if ausdruck.startswith("Muss"):
        return "Muss-bedingt"
    if ausdruck.startswith("Soll"):
        return "Soll"
    if ausdruck.startswith("Kann"):
        return "Kann"
    return "Bedingt"


def bearbeite(datei: Path, soll: dict[str, dict], instanzen: list | None = None) -> dict:
    bericht = {"datei": datei.name, "optionen_korrigiert": [], "ergaenzt": [], "abhaengig": []}
    regeln = lade_regeln(datei)
    if not regeln or "segments" not in regeln:
        bericht["fehler"] = "Regelobjekt nicht lesbar"
        return bericht

    vorhanden = {s["id"]: s for s in regeln["segments"]}

    # 1. Codelisten korrigieren
    for kennung, info in soll.items():
        if kennung not in vorhanden or "optionen" not in info:
            continue
        seg = vorhanden[kennung]
        ist = [o["v"] for o in seg.get("options", [])]
        soll_codes = [c for c, _ in info["optionen"]]
        if ist != soll_codes:
            seg["isSelect"] = True
            seg["options"] = [{"v": c, "t": f"{c} - {n}" if n else c} for c, n in info["optionen"]]
            bericht["optionen_korrigiert"].append({"id": kennung, "vorher": ist, "nachher": soll_codes})

    # 1b. Führt der AHB dieser Prüf-ID überhaupt keine Transaktionsgrundergänzung,
    #     darf das Formular auch keine anbieten. Betroffen sind die Ablehnungs- und
    #     Beendigungsfälle (55005, 55006, 55008, 55009, 55011, 55012): dort stand
    #     bisher die generische Platzhalterliste ZW4/ZW3/ZW5, obwohl das AHB-Feld
    #     ausschließlich Transaktionsgründe kennt.
    if "STS_7" not in soll and "STS_7_grund" in soll and "STS_7" in vorhanden:
        regeln["segments"] = [s for s in regeln["segments"] if s["id"] != "STS_7"]
        entfernt = vorhanden.pop("STS_7")
        bericht["optionen_korrigiert"].append(
            {"id": "STS_7", "vorher": [o["v"] for o in entfernt.get("options", [])], "nachher": "entfernt (AHB führt keine Ergänzung)"}
        )

    # 1b-2. Felder, deren Qualifier der AHB dieser Prüf-ID gar nicht führt, gehören
    #       nicht ins Formular. Sie stammen aus der Zeit, als die Masken von Hand je
    #       Prozess zusammengestellt wurden — etwa RFF+ACW in einer Bestätigung, die
    #       laut AHB RFF+TN führt, oder LOC+Z16 in einer reinen Antwortnachricht.
    if instanzen is not None:
        qualifier = {"LOC": "3227", "DTM": "2005", "RFF": "1153"}
        vorhandenImAhb = {art: set() for art in qualifier}
        for inst in instanzen:
            art = inst.get("seg")
            if art not in qualifier:
                continue
            for de in inst.get("des", []):
                if de["de"] == qualifier[art]:
                    vorhandenImAhb[art].update(c[0] for c in de.get("codes", []))
        entferneIds = []
        for seg in regeln["segments"]:
            m = re.fullmatch(r"(LOC|DTM|RFF)_([A-Z0-9]+)", seg["id"])
            if not m:
                continue
            art, code = m.group(1), m.group(2)
            if code == "Z13":                      # Prüfidentifikator, automatisch
                continue
            if not vorhandenImAhb[art]:            # AHB führt das Segment gar nicht
                entferneIds.append(seg["id"])
            elif code not in vorhandenImAhb[art]:
                entferneIds.append(seg["id"])
        if entferneIds:
            regeln["segments"] = [s for s in regeln["segments"] if s["id"] not in entferneIds]
            for kennung in entferneIds:
                vorhanden.pop(kennung, None)
                bericht["optionen_korrigiert"].append(
                    {"id": kennung, "vorher": "vorhanden", "nachher": "entfernt (Qualifier steht nicht im AHB dieser Prüf-ID)"})

    # 1c. Den AHB-Ausdruck an jedem Segment hinterlegen, das im AHB vorkommt. Er ist
    #     die Grundlage für das Fragezeichen-Symbol der Bedingungs-Hilfe im Formular.
    for kennung, info in soll.items():
        if kennung in vorhanden and info.get("ahbExpr") and vorhanden[kennung].get("ahbExpr") != info["ahbExpr"]:
            vorhanden[kennung]["ahbExpr"] = info["ahbExpr"]
            bericht.setdefault("ahbExpr", []).append(kennung)

    # 2. Fehlende Segmente ergänzen
    for kennung, info in soll.items():
        if kennung in vorhanden:
            continue
        neu = {"id": kennung, "name": info["name"], "status": status_aus_ausdruck(info["expr"])}
        if info.get("ahbExpr"):
            neu["ahbExpr"] = info["ahbExpr"]
        if "optionen" in info:
            neu["isSelect"] = True
            neu["options"] = [{"v": c, "t": f"{c} - {n}" if n else c} for c, n in info["optionen"]]
        if info["expr"]:
            neu["rule"] = f"AHB: {info['expr']}"
        regeln["segments"].append(neu)
        vorhanden[kennung] = neu
        bericht["ergaenzt"].append(kennung)

    # 3. Abhängigkeiten eintragen — nur, wenn der Code im Zielfeld auch wählbar ist.
    #    Sonst entstünde eine Regel, die das Feld dauerhaft verbirgt (etwa wenn eine
    #    Bedingung den Transaktionsgrund meint, das Formularfeld aber die Ergänzung führt).
    def zielfeld(regel: dict) -> str | None:
        if regel["seg"] != "STS":
            kandidat = f"{regel['seg']}_{regel['qualifier']}"
            # Nur Felder, die es im Formular auch gibt — sonst wäre die Bedingung
            # nie erfüllbar und das Segment dauerhaft ausgeblendet.
            return kandidat if kandidat in vorhanden else None
        for kandidat in ("STS_7", "STS_7_grund", "STS_7_befristet"):
            segment = vorhanden.get(kandidat)
            if segment and any(o["v"] == regel["code"] for o in segment.get("options", [])):
                return kandidat
        return None

    for kennung, info in soll.items():
        if kennung not in vorhanden or not info.get("schalter"):
            continue
        regel = info["schalter"][0]
        feld = zielfeld(regel)
        if feld is None:
            continue
        eintrag = {
            "feld": feld,
            "code": regel["code"],
            "negiert": regel["art"] == "code_fehlt",
            "bedingung": regel["nr"],
        }
        if vorhanden[kennung].get("abhaengig") != eintrag:
            vorhanden[kennung]["abhaengig"] = eintrag
            bericht["abhaengig"].append(kennung)

    # 4. Alternativpaare: hängt von zwei Lokationsangaben derselben Segmentgruppe genau
    #    eine an einem Code (LOC+Z22 ⇐ ZAP), gilt für die andere die Umkehrung. Ohne
    #    diesen Schritt böte das Formular beide gleichzeitig an.
    for praefix in ("LOC_", "DTM_", "RFF_"):
        gruppe = [s for s in regeln["segments"] if s["id"].startswith(praefix)]
        mit = [s for s in gruppe if (s.get("abhaengig") or {}).get("feld") in ("STS_7", "STS_7_grund")]
        ohne = [s for s in gruppe if not s.get("abhaengig")]
        if len(gruppe) == 2 and len(mit) == 1 and len(ohne) == 1 and not mit[0]["abhaengig"]["negiert"]:
            gegen = dict(mit[0]["abhaengig"])
            gegen["negiert"] = True
            gegen["abgeleitet"] = True
            ohne[0]["abhaengig"] = gegen
            bericht["abhaengig"].append(ohne[0]["id"] + " (abgeleitet)")

    if not (bericht["optionen_korrigiert"] or bericht["ergaenzt"] or bericht["abhaengig"]
            or bericht.get("ahbExpr")):
        return bericht

    text = datei.read_text(encoding="utf-8")
    kopf = text.split("const ahbRules")[0]
    pruefi = regeln["pruefidentifikator"]
    datei.write_text(kopf + formatiere(regeln, pruefi), encoding="utf-8")
    return bericht


if __name__ == "__main__":
    gesamt = {"dateien": 0, "optionen": 0, "ergaenzt": 0, "abhaengig": 0, "fehler": []}
    protokoll = []
    for _, rel in ORDNER:
        ordner = GENERATOR / rel
        meta = lade_formmeta(ordner)
        prozess = lade_prozessmeta(ordner)
        for datei in sorted((ordner / "pruef-ids").glob("*.js")):
            if not re.fullmatch(r"\d+", datei.stem):
                continue
            eintrag = meta.get(datei.stem)
            if not eintrag:
                continue
            vorgabe = (prozess.get(datei.stem) or {}).get("transaktionsgrund")
            bericht = bearbeite(datei, soll_segmente(eintrag["instanzen"], vorgabe), eintrag["instanzen"])
            bericht["ordner"] = rel
            if bericht.get("fehler"):
                gesamt["fehler"].append(f"{rel}/{datei.name}: {bericht['fehler']}")
                continue
            if (bericht["optionen_korrigiert"] or bericht["ergaenzt"] or bericht["abhaengig"]
                    or bericht.get("ahbExpr")):
                gesamt["dateien"] += 1
                gesamt["ahbExpr"] = gesamt.get("ahbExpr", 0) + len(bericht.get("ahbExpr", []))
                gesamt["optionen"] += len(bericht["optionen_korrigiert"])
                gesamt["ergaenzt"] += len(bericht["ergaenzt"])
                gesamt["abhaengig"] += len(bericht["abhaengig"])
                protokoll.append(bericht)
    Path("protokoll_utilmd.json").write_text(json.dumps(protokoll, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: v for k, v in gesamt.items() if k != "fehler"}, ensure_ascii=False))
    for f in gesamt["fehler"][:10]:
        print("FEHLER:", f)
