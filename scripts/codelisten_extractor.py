"""Extrahiert die EDI@Energy-Codelisten (PDF) in maschinenlesbare JS-Codetabellen
für den universellen Validator: _engine/daten/codelisten.js"""
import json
import os
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
# Arbeitsordner (Ordner oberhalb des Repositorys, siehe werkzeuge/LIESMICH.md),
# überschreibbar per Umgebungsvariable EDIGEN_ARBEITSORDNER.
BASIS = Path(os.environ.get("EDIGEN_ARBEITSORDNER", REPO.parent.parent))
CL = BASIS / "regelwerk/codelisten"
ZIEL = REPO / "_engine/daten"

def text(name):
    return (CL / name).read_text(encoding="utf-8")

def dreizehner(txt, praefix):
    """Alle 13-stelligen Codes (ggf. mit Einzel-Leerzeichen gruppiert) mit Präfix."""
    codes = set()
    for m in re.finditer(r"\d(?:\d| \d)*", txt):
        s = m.group().replace(" ", "")
        if len(s) == 13 and s.startswith(praefix):
            codes.add(s)
    return codes

ergebnis = {}

# --- Artikelnummern / Artikel-ID (INVOIC/PRICAT/ORDERS: PIA/LIN 7140) ---------
t = text("CL_Artikelnummern_5.6_11908.txt")
artikel = {}
for line in t.split("\n"):
    m = re.match(r"^(\S.{0,60}?)\s{2,}\d{1,3}\s+(99[79]\d{4}) (\d{5}) (\d)\b", line)
    if m:
        artikel.setdefault(m.group(2) + m.group(3) + m.group(4), m.group(1).strip())
for c in dreizehner(t, "999") | dreizehner(t, "997"):
    artikel.setdefault(c, "")
ergebnis["artikelnummern"] = {"quelle": "Codeliste der Artikelnummern und Artikel-ID 5.6 (kons. 30.09.2025)",
                              "codes": artikel}

# Hierarchische Artikel-IDs ("1-01-1-001 Bezeichnung ... Einheit ... X/--"-Tabellen)
artikel_ids = {}
for line in t.split("\n"):
    m = re.match(r"^\s{0,4}(\d-\d{2}-\d(?:-\d{3})?)\s{2,}(\S.*?)(?:\s{2,}(\S.*))?$", line)
    if not m:
        continue
    aid, name, rest = m.group(1), m.group(2).strip(), (m.group(3) or "")
    einheit = ""
    em = re.match(r"^(€/\S+|ct/\S+|%\S*)", rest.strip())
    if em:
        einheit = em.group(1)
    flags = re.findall(r"(?<![\w€/*()])(X|--)(?![\w€/*()])", rest)
    artikel_ids.setdefault(aid, {"name": name, "einheit": einheit, "flags": flags})
ergebnis["artikelIds"] = {"quelle": "Codeliste der Artikelnummern und Artikel-ID 5.6 (kons. 30.09.2025)",
                          "hinweis": "flags = Codeverwendung/Preisangabe je UTILMD, PRICAT, INVOIC (Spaltenreihenfolge)",
                          "codes": artikel_ids}

# --- OBIS-Kennzahlen (MSCONS/UTILMD/UTILTS: PIA 7140 / RFF) -------------------
t = text("CL_OBIS_2.5c_11918.txt")
obis = sorted(set(re.findall(r"\b\d-(?:\d{1,2}|b):\d{1,3}\.(?:\d{1,3}|[a-z])\.(?:\d{1,3}|[a-z])\b", t)))
ergebnis["obis"] = {"quelle": "Codeliste der OBIS-Kennzahlen und Medien 2.5c",
                    "hinweis": "Platzhalter: b=Bilanzierungsgebiet, e/y=variable Ziffer",
                    "codes": obis}

# --- Konfigurationen (UTILMD: Messprodukte, 9991xxxxxxxxx) --------------------
for name, datei, quelle in [("konfigurationen_202604", "CL_Konfigurationen_1.3c_12001.txt",
                             "Codeliste der Konfigurationen 1.3c (kons. 11.12.2025)"),
                            ("konfigurationen_202610", "CL_Konfigurationen_1.4_12158.txt",
                             "Codeliste der Konfigurationen 1.4")]:
    t = text(datei)
    ergebnis[name] = {"quelle": quelle, "codes": sorted(dreizehner(t, "9991"))}

# --- Lokationsbündelstrukturen (UTILMD: 9992xxxxxxxxx) ------------------------
t = text("CL_Lokationsbuendel_1.0_11418.txt")
ergebnis["lokationsbuendel"] = {"quelle": "Codeliste der Lokationsbündelstrukturen 1.0 (kons. 13.12.2024)",
                                "codes": sorted(dreizehner(t, "9992"))}

# --- Verwendungszwecke (ab 202610, ORDERS/UTILMD PIA DE7143 mit 1131=Z16) -----
t = text("CL_Verwendungszwecke_1.0_12253.txt")
vwz = {}
for line in t.split("\n"):
    m = re.match(r"^\s{1,8}(V\d{2})\s{2,}(\S.*?)(\s{2,}|$)", line)
    if m:
        vwz.setdefault(m.group(1), m.group(2).strip())
ergebnis["verwendungszwecke"] = {"quelle": "Codeliste der Verwendungszwecke 1.0 (kons. 29.06.2026, gültig ab 202610)",
                                 "codes": vwz}

# --- Zeitreihentypen (MSCONS RFF/IMD) -----------------------------------------
t = text("CL_Zeitreihentypen_1.1d_8854.txt")
zrt = sorted({m.group(1) for m in re.finditer(r"^\s{1,8}([A-Z]{3,4})\s{2,}\S", t, re.M)}
             - {"BDEW", "EDI", "OBIS"})
ergebnis["zeitreihentypen"] = {"quelle": "Codeliste der Zeitreihentypen 1.1d (kons. 16.07.2021)", "codes": zrt}

# --- Temperaturanbieter (UTILMD DE1131) ---------------------------------------
t = text("CL_Temperaturanbieter_1.0i_8735.txt")
temp = {}
for line in t.split("\n"):
    m = re.match(r"^\s{0,4}(ZT\d)\s{2,}(\S.*?)(\s{2,}|$)", line)
    if m:
        temp.setdefault(m.group(1), m.group(2).strip())
ergebnis["temperaturanbieter"] = {"quelle": "Codeliste der Temperaturanbieter 1.0i", "codes": temp}

# --- Europäische Ländercodes (NAD DE3207) -------------------------------------
t = text("CL_Laendercodes_1.0_8856.txt")
laender = {}
for line in t.split("\n"):
    m = re.match(r"^\s{1,8}([A-Z]{2})\s{2,}(\S.*?)(\s{2,}X?\s*)$", line)
    if m and m.group(1) not in ("ID",):
        laender.setdefault(m.group(1), m.group(2).strip())
ergebnis["laendercodes"] = {"quelle": "Codeliste der europäischen Ländercodes 1.0 (kons. 30.03.2023)",
                            "codes": laender}

# --- Standardlastprofile TU München: REGELN (Codes sind NB-individuell) -------
ergebnis["slpRegeln"] = {
    "quelle": "Codeliste der Standardlastprofile nach TU München-Verfahren 1.1 (kons. 22.05.2015)",
    "regeln": {"feld": "SG7 CAV DE7111", "codepflege": {"BDEW": "293", "NB-individuell": "89"},
               "nbCode": {"maxLaenge": 3, "verboteneAnfangszeichen": ["E", "Z", "Y"]}}}

js = ("// codelisten.js - EDI@Energy-Codelisten, maschinell extrahiert\n"
      "// (scripts/codelisten_extractor.py) - nicht von Hand pflegen.\n"
      "const codelisten = " + json.dumps(ergebnis, ensure_ascii=False, separators=(",", ":")) +
      ";\nif (typeof module !== 'undefined') module.exports = codelisten;\n")
ZIEL.mkdir(parents=True, exist_ok=True)
(ZIEL / "codelisten.js").write_text(js, encoding="utf-8")
for k, v in ergebnis.items():
    c = v.get("codes", v.get("regeln"))
    n = len(c) if hasattr(c, "__len__") else "-"
    print(f"{k}: {n}")
print("->", ZIEL / "codelisten.js", f"({len(js)//1024} KB)")
