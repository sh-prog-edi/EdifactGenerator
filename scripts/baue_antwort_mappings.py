# Erzeugt _engine/daten/antwort-mappings-generiert.js aus der EDI@Energy
# "Anwendungsübersicht der Prüfidentifikatoren" (Blatt "Prüf-ID Prozessschritt").
#
# Logik: Jede Zeile, deren Spalte "Reaktion auf Prüfidentifikator" eine konkrete
# Prüf-ID nennt, ist eine Antwortnachricht. Die Referenz-Vorbelegung ergibt sich
# aus dem ZG-Tupel (Spalte "Zuordnung zu einem Geschäftsvorfall", Definition im
# Blatt "Tupel-Übersicht"):
#   ZG-T1  SG6 RFF+TN   <- Vorgangsnummer (IDE DE7402) je Vorgang (UTILMD->UTILMD)
#   ZG-T2  SG6 RFF+AAV  <- Dokumentennummer der Anfrage (BGM DE1004, ORDERS->UTILMD)
#   ZG-T14 SG1 RFF+ON   <- Auftragsnummer der ORDERS (BGM DE1004, ORDERS->ORDRSP)
#   ZG-T42 SG1 RFF+AGI  <- Beantragungsnummer (BGM DE1004, ORDERS->MSCONS)
#   ZG-T43 SG15 RFF+ACW <- UNH-Referenz der Vorgängernachricht (->IFTSTA)
#   ZG-T45 SG15 RFF+ACW <- UNH-Referenz + RFF+ADY <- BGM DE1004 (IFTSTA->IFTSTA)
# Bereits kuratierte Paare (antwort-mappings.js) werden übersprungen.
import json
import os
import re
from collections import OrderedDict
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
# Arbeitsordner: der Ordner oberhalb des Repositorys (siehe werkzeuge/LIESMICH.md),
# überschreibbar per Umgebungsvariable EDIGEN_ARBEITSORDNER.
ARBEITSORDNER = Path(os.environ.get("EDIGEN_ARBEITSORDNER", ROOT.parent.parent))
REGELWERK = ARBEITSORDNER / "regelwerk"
QUELLEN = [
    ("202604", REGELWERK / "Anwendungsuebersicht_3.3_LF_12258.xlsx",
     "Anwendungsübersicht der Prüfidentifikatoren 3.3 (Formatstand 202604)"),
    ("202610", REGELWERK / "Anwendungsuebersicht_4.0_LF_12260.xlsx",
     "Anwendungsübersicht der Prüfidentifikatoren 4.0 (Formatstand 202610)"),
]
ZIEL = ROOT / "_engine/daten/antwort-mappings-generiert.js"

# ZG-Tupel -> Vorbelegungs-Rezept (Feldadressierung wie in antwort-mappings.js)
TUPEL = {
    "ZG-T1": {
        "positionen": {"quelleSeg": "IDE", "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "TN", "de": "1154",
             "quelle": {"de": "7402"}},
        ]},
    },
    "ZG-T2": {
        "positionen": {"einzeln": True, "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "AAV", "de": "1154",
             "quelle": {"seg": "BGM", "de": "1004"}},
        ]},
    },
    "ZG-T14": {
        "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "ON", "de": "1154",
             "bereich": "kopf", "quelle": {"seg": "BGM", "de": "1004"}},
        ],
    },
    "ZG-T42": {
        "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "AGI", "de": "1154",
             "bereich": "kopf", "quelle": {"seg": "BGM", "de": "1004"}},
        ],
    },
    "ZG-T43": {
        "positionen": {"einzeln": True, "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "ACW", "de": "1154",
             "quelle": {"unh": True}},
        ]},
    },
    "ZG-T45": {
        "positionen": {"einzeln": True, "felder": [
            {"seg": "RFF", "qualDe": "1153", "qual": "ACW", "de": "1154",
             "quelle": {"unh": True}},
            {"seg": "RFF", "qualDe": "1153", "qual": "ADY", "de": "1154",
             "quelle": {"seg": "BGM", "de": "1004"}},
        ]},
    },
}

# AHB-Spalte -> Format im validator-registry
AHB_FORMAT = {
    "UTILMD AHB Strom": "UTILMD", "UTILMD AHB Gas": "UTILMD",
    "ORDRSP AHB": "ORDRSP", "IFTSTA AHB": "IFTSTA", "MSCONS AHB": "MSCONS",
    "ORDERS AHB": "ORDERS", "REMADV AHB": "REMADV", "INVOIC AHB": "INVOIC",
    "UTILTS AHB": "UTILTS", "PARTIN AHB": "PARTIN", "INSRPT AHB": "INSRPT",
    "COMDIS AHB": "COMDIS", "PRICAT AHB": "PRICAT", "QUOTES AHB": "QUOTES",
    "REQOTE AHB": "REQOTE", "ORDCHG AHB": "ORDCHG",
}


def lade_registry():
    """pruefi -> format aus validator-registry.js (beide Stände identisch genug)."""
    txt = (ROOT / "_engine/daten/validator-registry.js").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\]);", txt, re.S)
    reg = json.loads(m.group(1))
    pruefi_format = {}
    format_pruefis = {}
    for e in reg:
        format_pruefis.setdefault((e["format"], e["stand"]), set()).update(e["pruefis"])
        for p in e["pruefis"]:
            pruefi_format[p] = e["format"]
    return pruefi_format, format_pruefis


def kuratierte_paare():
    """(zielFormat, zielPruefi)-Paare aus antwort-mappings.js (Dublettenschutz)."""
    txt = (ROOT / "_engine/daten/antwort-mappings.js").read_text(encoding="utf-8")
    paare = set()
    for m in re.finditer(r'"zielFormat":?\s*"?(\w+)"?', txt.replace("zielFormat:", '"zielFormat":')):
        pass  # Struktur ist JS, kein JSON - unten robust über Regex je Block
    # pruefiFest
    for fmt, pf in re.findall(r'zielFormat:\s*"(\w+)",\s*pruefiFest:\s*"(\d+)"', txt):
        paare.add((fmt, pf))
    # pruefiMap-Werte
    for fmt, mp in re.findall(r'zielFormat:\s*"(\w+)",[^{]*pruefiMap:\s*\{([^}]*)\}', txt, re.S):
        for ziel in re.findall(r':\s*"(\d{5})"', mp):
            paare.add((fmt, ziel))
    return paare


ANTWORT_RE = re.compile(r"^(Antwort|Bestätigung|Ablehnung|Zustimmung|Abweisung|Rückmeldung)", re.I)


def lies_paare(datei, stand, pruefi_format, format_pruefis, protokoll):
    """Antwortpaare aus einer Anwendungsübersicht.

    Ergebnis: (quelleFmt, zielFmt, quelle, ziel, zg, label, stand, beleg) mit
    beleg 'explizit' (Spalte 'Reaktion auf Prüfidentifikator' nennt die Quelle)
    oder 'heuristik' (aus der Prozessschritt-Abfolge des Sequenzdiagramms
    abgeleitet: Antwortzeile in Schritt n antwortet auf die Zeile in Schritt n-1
    mit vertauschter Kommunikationsrichtung; nur in Gruppen ohne explizite
    Zuordnung).
    """
    wb = openpyxl.load_workbook(datei, read_only=True, data_only=True)
    ws = wb["Prüf-ID Prozessschritt"]
    rows = list(ws.iter_rows(values_only=True))[1:]
    paare = []
    explizite_ziele = set()

    def ziel_ok(ahb, antwort, zg, quellen_txt):
        ziel_fmt = AHB_FORMAT.get(ahb)
        if ziel_fmt is None:
            protokoll.append(f"{stand}: AHB '{ahb}' unbekannt ({antwort})")
            return None
        if antwort not in format_pruefis.get((ziel_fmt, stand), set()):
            protokoll.append(f"{stand}: Ziel-Prüf-ID {antwort} ({ziel_fmt}) nicht im Generator")
            return None
        if zg not in TUPEL:
            protokoll.append(f"{stand}: Tupel '{zg}' ohne Übersetzung ({quellen_txt} -> {antwort})")
            return None
        return ziel_fmt

    # 1) Explizite Paare (Spalte 'Reaktion auf Prüfidentifikator')
    for r in rows:
        antwort = str(r[3] or "").strip()          # Prüfidentifikator (der Antwortzeile)
        quellen = re.findall(r"\b\d{5}\b", str(r[4] or ""))
        if not quellen or not re.fullmatch(r"\d{5}", antwort):
            continue
        zg = str(r[13] or "").strip()
        ziel_fmt = ziel_ok(str(r[1] or "").strip(), antwort, zg, ", ".join(quellen))
        if ziel_fmt is None:
            continue
        explizite_ziele.add(antwort)
        for q in quellen:
            q_fmt = pruefi_format.get(q)
            if q_fmt is None:
                protokoll.append(f"{stand}: Quell-Prüf-ID {q} nicht im Generator ({antwort})")
                continue
            paare.append((q_fmt, ziel_fmt, q, antwort, zg,
                          str(r[2] or "").strip(), stand, "explizit"))

    # 2) Heuristische Paare aus der Schrittabfolge (nur wo nichts Explizites existiert)
    gruppen = OrderedDict()
    for r in rows:
        pb, seq = str(r[5] or "").strip(), str(r[7] or "").strip()
        if pb and seq:
            gruppen.setdefault((pb, seq), []).append(r)
    for (pb, seq), grp in gruppen.items():
        if any(str(r[3] or "").strip() in explizite_ziele for r in grp):
            continue  # Gruppe hat explizite Zuordnungen - Heuristik überspringen
        for r in grp:
            antwort = str(r[3] or "").strip()
            beschr = str(r[2] or "").strip()
            aktion = str(r[9] or "").strip()
            zg = str(r[13] or "").strip()
            schritt = str(r[8] or "").strip()
            if not re.fullmatch(r"\d{5}", antwort) or not schritt.isdigit():
                continue
            if zg not in TUPEL:
                continue
            if not (aktion.startswith("Antwort") or ANTWORT_RE.match(beschr)):
                continue
            ziel_fmt = ziel_ok(str(r[1] or "").strip(), antwort, zg, "Schrittfolge")
            if ziel_fmt is None:
                continue
            von, an = str(r[10] or "").strip(), str(r[11] or "").strip()
            for r2 in grp:
                q = str(r2[3] or "").strip()
                s2 = str(r2[8] or "").strip()
                if not re.fullmatch(r"\d{5}", q) or not s2.isdigit():
                    continue
                if int(s2) != int(schritt) - 1:
                    continue
                if str(r2[10] or "").strip() != an or str(r2[11] or "").strip() != von:
                    continue  # Kommunikationsrichtung muss gespiegelt sein
                q_fmt = pruefi_format.get(q)
                if q_fmt is None:
                    protokoll.append(f"{stand}: Quell-Prüf-ID {q} nicht im Generator ({antwort}, Heuristik)")
                    continue
                paare.append((q_fmt, ziel_fmt, q, antwort, zg, beschr, stand, "heuristik"))
    return paare


def main():
    pruefi_format, format_pruefis = lade_registry()
    kuratiert = kuratierte_paare()
    protokoll = []
    alle = []
    for stand, datei, _ in QUELLEN:
        alle += lies_paare(datei, stand, pruefi_format, format_pruefis, protokoll)

    # Explizite Paare gewinnen: Heuristik-Paare mit gleichem Ziel entfernen
    explizit = {(z_fmt, a) for _, z_fmt, _, a, *_, beleg in alle if beleg == "explizit"}
    alle = [p for p in alle if p[-1] == "explizit" or (p[1], p[3]) not in explizit]

    # Gruppieren: (quelleFmt, zielFmt, zielPruefi, zg) -> {quellen:set, label, staende:set}
    gruppen = OrderedDict()
    for q_fmt, z_fmt, q, a, zg, beschr, stand, beleg in alle:
        if (z_fmt, a) in kuratiert:
            protokoll.append(f"übersprungen (kuratiert): {q} -> {a} ({z_fmt})")
            continue
        k = (q_fmt, z_fmt, a, zg)
        g = gruppen.setdefault(k, {"quellen": OrderedDict(), "label": beschr,
                                   "staende": set(), "beleg": beleg})
        g["quellen"][q] = None
        g["staende"].add(stand)
        if beleg == "explizit":
            g["beleg"] = "explizit"
        if beschr and len(beschr) > len(g["label"]):
            g["label"] = beschr

    # Nach Quellformat bündeln
    nach_quelle = OrderedDict()
    for (q_fmt, z_fmt, a, zg), g in sorted(gruppen.items(), key=lambda kv: (kv[0][0], kv[0][1], kv[0][2])):
        ziel = {
            "label": f"{g['label']} ({z_fmt} {a}) erzeugen",
            "zielFormat": z_fmt,
            "pruefiMap": {q: a for q in g["quellen"]},
            "tauscheRichtung": True,
            "staende": sorted(g["staende"]),
            "tupel": zg,
            "beleg": g["beleg"],
        }
        if g["beleg"] == "heuristik":
            ziel["hinweis"] = "Zuordnung aus Prozessschritt-Abfolge abgeleitet."
        rezept = TUPEL[zg]
        if "felder" in rezept:
            ziel["felder"] = rezept["felder"]
        if "positionen" in rezept:
            ziel["positionen"] = rezept["positionen"]
        nach_quelle.setdefault(q_fmt, []).append(ziel)

    daten = [{"quelleFormat": q, "ziele": z} for q, z in nach_quelle.items()]

    kopf = (
        "// antwort-mappings-generiert.js - AUTOMATISCH ERZEUGT (scripts/baue_antwort_mappings.py).\n"
        "// Quelle: EDI@Energy 'Anwendungsübersicht der Prüfidentifikatoren', Blatt\n"
        "// 'Prüf-ID Prozessschritt' (Spalte 'Reaktion auf Prüfidentifikator') und\n"
        "// 'Tupel-Übersicht' (Referenz-Segmente). Stände:\n"
    )
    for stand, _, name in QUELLEN:
        kopf += f"//   {stand}: {name}\n"
    kopf += (
        "// Feldadressierung wie antwort-mappings.js; zusätzlich staende (nur dort\n"
        "// anbieten) und tupel (Beleg: ZG-Tupel der Anwendungsübersicht).\n"
    )
    js = kopf + "var antwortMappingsGeneriert = " + json.dumps(daten, ensure_ascii=False, indent=2) + ";\n"
    js += "if (typeof module !== 'undefined') module.exports = antwortMappingsGeneriert;\n"
    ZIEL.write_text(js, encoding="utf-8")

    n_ziele = sum(len(d["ziele"]) for d in daten)
    n_paare = sum(len(z["pruefiMap"]) for d in daten for z in d["ziele"])
    print(f"{ZIEL.name}: {len(daten)} Quellformate, {n_ziele} Antwortziele, {n_paare} Prüf-ID-Paare")
    for d in daten:
        zg_stat = {}
        for z in d["ziele"]:
            zg_stat[z["tupel"]] = zg_stat.get(z["tupel"], 0) + len(z["pruefiMap"])
        print(f"  {d['quelleFormat']:8s} -> " + ", ".join(
            sorted({z['zielFormat'] for z in d['ziele']})) + f"  {zg_stat}")
    doppelt = [p for p in protokoll if p.startswith("übersprungen")]
    rest = [p for p in protokoll if not p.startswith("übersprungen")]
    if doppelt:
        print(f"kuratiert übersprungen: {len(doppelt)}")
    if rest:
        print("Hinweise:")
        seen = set()
        for p in rest:
            if p not in seen:
                seen.add(p)
                print("  -", p)


if __name__ == "__main__":
    main()
