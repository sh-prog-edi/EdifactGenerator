"""Erzeugt _engine/daten/validator-registry.js: je Formatstand+Nachrichtentyp die
UNH-Kennung, den Meta-Pfad (relativ zur Projektwurzel), den Meta-Variablennamen
und die Prüf-ID-Liste. Grundlage für die automatische Erkennung im Validator."""
import json
import re
from pathlib import Path

PROJEKT = Path("/mnt/user-data/working/edigen/EdifactGenerator")

# (stand, format, sparte, seiten-dir, metaDatei, metaVar, migKey)
SEITEN = []
for stand in ("202604", "202610"):
    SEITEN += [
        (stand, "IFTSTA", "", f"{stand}/Berichte/IFTSTA", "_form-meta.js", "formMeta", "IFTSTA"),
        (stand, "INSRPT", "", f"{stand}/Berichte/INSRPT", "_form-meta.js", "formMeta", "INSRPT"),
        (stand, "COMDIS", "", f"{stand}/Rechnungsstellung/COMDIS", "_form-meta.js", "formMeta", "COMDIS"),
        (stand, "INVOIC", "", f"{stand}/Rechnungsstellung/INVOIC", "_form-meta.js", "formMeta", "INVOIC"),
        (stand, "PRICAT", "", f"{stand}/Rechnungsstellung/PRICAT", "_form-meta.js", "formMeta", "PRICAT"),
        (stand, "REMADV", "", f"{stand}/Rechnungsstellung/REMADV", "_form-meta.js", "formMeta", "REMADV"),
        (stand, "PARTIN", "", f"{stand}/Stammdaten/PARTIN", "_form-meta.js", "formMeta", "PARTIN"),
        (stand, "UTILTS", "", f"{stand}/Stammdaten/UTILTS", "_form-meta.js", "formMeta", "UTILTS"),
        (stand, "ORDERS", "", f"{stand}/Bestellvorgang/ORDERS", "_orders-meta.js", "ordersMeta", "ORDERS"),
        (stand, "ORDRSP", "", f"{stand}/Bestellvorgang/ORDRSP", "_form-meta.js", "formMeta", "ORDRSP"),
        (stand, "ORDCHG", "", f"{stand}/Bestellvorgang/ORDCHG", "_form-meta.js", "formMeta", "ORDCHG"),
        (stand, "QUOTES", "", f"{stand}/Bestellvorgang/QUOTES", "_form-meta.js", "formMeta", "QUOTES"),
        (stand, "REQOTE", "", f"{stand}/Bestellvorgang/REQOTE", "_form-meta.js", "formMeta", "REQOTE"),
        (stand, "MSCONS", "", f"{stand}/Bewegungsdaten/MSCONS", "_form-meta.js", "msconsFormMeta", "MSCONS"),
        (stand, "APERAK", "", f"{stand}/Servicenachrichten/APERAK", "_form-meta.js", "formMeta", "APERAK"),
        (stand, "CONTRL", "", f"{stand}/Servicenachrichten/CONTRL", "_form-meta.js", "formMeta", "CONTRL"),
        (stand, "UTILMD", "Strom", f"{stand}/Stammdaten/UTILMD/Strom", "VOLLFORM", "formMeta", "UTILMD_STROM"),
        (stand, "UTILMD", "Gas", f"{stand}/Stammdaten/UTILMD/Gas", "VOLLFORM", "formMeta", "UTILMD_GAS"),
    ]

eintraege = []
for stand, fmt, sparte, seite, metadatei, metavar, migkey in SEITEN:
    vollform = metadatei == "VOLLFORM"
    if vollform:
        metadatei, metavar = "_form-meta.js", "formMeta"
    basis = PROJEKT / seite
    fmtjs = (basis / "pruef-ids/_format.js").read_text(encoding="utf-8")
    unh = re.search(r'unhKennung:\s*["\']([^"\']+)["\']', fmtjs).group(1)
    # Alle Nachrichtentypen lesen aus derselben Formular-Meta; UTILMD zeigt lediglich
    # auf das Vollformular statt auf die kuratierte Maske.
    mjs = (basis / "pruef-ids" / metadatei).read_text(encoding="utf-8")
    meta = json.loads(re.search(r"var \w+ = (\{.*?\});\n", mjs, re.S).group(1))
    ziel = "vollformular.html" if vollform else "index.html"
    eintrag = {"stand": stand, "format": fmt, "sparte": sparte, "unh": unh,
               "metaPfad": f"{seite}/pruef-ids/{metadatei}", "metaVar": metavar,
               "seite": f"{seite}/{ziel}", "pruefis": sorted(meta.keys())}
    eintraege.append(eintrag)
    print(f"{stand} {fmt}{('/' + sparte) if sparte else ''}: {len(eintrag['pruefis'])} Prüf-IDs, UNH {unh}")

js = ("// validator-registry.js - Register aller Prüfgrundlagen für den universellen\n"
      "// Nachrichten-Validator. Maschinell erzeugt (scripts/baue_validator_registry.py).\n"
      "var validatorRegistry = " + json.dumps(eintraege, ensure_ascii=False, separators=(",", ":")) +
      ";\nif (typeof module !== 'undefined') module.exports = validatorRegistry;\n")
(PROJEKT / "_engine/daten/validator-registry.js").write_text(js, encoding="utf-8")
print("->", PROJEKT / "_engine/daten/validator-registry.js", f"({len(js)//1024} KB)")
