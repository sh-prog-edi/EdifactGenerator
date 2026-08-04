"""Extrahiert aus den BDEW-MIG-docx je (Segment, Datenelement) den BDEW-Status und
das Feldformat (an..35, n..17, ...) sowie je Segment die maximale Wiederholung.
Ergebnis: _engine/daten/mig-formate.js für den universellen Validator."""
import json
import re
import sys
from pathlib import Path

import docx

BASIS = Path("/mnt/user-data/working")
M604 = BASIS / "mirror/edi_energy_de/FV2604"
M610 = BASIS / "fv2610-migs"

# Format+Stand -> MIG-Quelldatei (bei validTo offen dieselbe Datei in beiden Ständen)
QUELLEN = {
    "202604": {
        "APERAK": M604 / "MIG_APERAK_2.1i_20250606_20260930_20250606_ooox_8671.docx",
        "CONTRL": M604 / "MIG_CONTRL_2.0b_20221001_99991231_20251211_oxox_12006.docx",
        "COMDIS": M604 / "MIG_COMDIS_1.0g_20260401_99991231_20260401_ooox_11925.docx",
        "IFTSTA": M604 / "MIG_IFTSTA_2.0g_20251001_20260930_20251001_ooox_11585.docx",
        "INSRPT": M604 / "MIG_INSRPT_1.1a_20230330_99991231_20240726_oxox_9355.docx",
        "INVOIC": M604 / "MIG_INVOIC_2.8e_20251001_99991231_20251001_ooox_11591.docx",
        "MSCONS": M604 / "MIG_MSCONS_2.4c_20240403_20260930_20240726_oxox_9650.docx",
        "ORDCHG": M604 / "MIG_ORDCHG_1.1_20231001_20260930_20240726_oxox_9701.docx",
        "ORDERS": M604 / "MIG_ORDERS_1.4b_20251001_20260930_20251001_ooox_11597.docx",
        "ORDRSP": M604 / "MIG_ORDRSP_1.4b_20260401_20260930_20260401_ooox_11940.docx",
        "PARTIN": M604 / "MIG_PARTIN_1.0f_20260401_20260930_20260401_ooox_11946.docx",
        "PRICAT": M604 / "MIG_PRICAT_2.0e_20251001_20260930_20250930_xoxx_11898.docx",
        "QUOTES": M604 / "MIG_QUOTES_1.3b_20260130_20260930_20260130_xoxx_12049.docx",
        "REMADV": M604 / "MIG_REMADV_2.9e_20260401_99991231_20260401_ooox_11954.docx",
        "REQOTE": M604 / "MIG_REQOTE_1.3c_20251001_99991231_20251001_ooox_11625.docx",
        "UTILMD_STROM": M604 / "MIG_UTILMD_S2.1_20260302_20260930_20260302_xoxx_12112.docx",
        "UTILMD_GAS": M604 / "MIG_UTILMD_G1.1_20260401_20260930_20251211_oxox_12022.docx",
        "UTILTS": M604 / "MIG_UTILTS_1.1e_20250606_99991231_20241213_xoxx_11171.docx",
    },
    "202610": {
        "APERAK": M610 / "MIG_APERAK_12152_12152.docx",
        "CONTRL": M604 / "MIG_CONTRL_2.0b_20221001_99991231_20251211_oxox_12006.docx",
        "COMDIS": M604 / "MIG_COMDIS_1.0g_20260401_99991231_20260401_ooox_11925.docx",
        "IFTSTA": M610 / "MIG_IFTSTA_12167_12167.docx",
        "INSRPT": M604 / "MIG_INSRPT_1.1a_20230330_99991231_20240726_oxox_9355.docx",
        "INVOIC": M604 / "MIG_INVOIC_2.8e_20251001_99991231_20251001_ooox_11591.docx",
        "MSCONS": M610 / "MIG_MSCONS_12174_12174.docx",
        "ORDCHG": M610 / "MIG_ORDCHG_12183_12183.docx",
        "ORDERS": M610 / "MIG_ORDERS_12188_12188.docx",
        "ORDRSP": M610 / "MIG_ORDRSP_12195_12195.docx",
        "PARTIN": M610 / "MIG_PARTIN_12201_12201.docx",
        "PRICAT": M610 / "MIG_PRICAT_12207_12207.docx",
        "QUOTES": M610 / "MIG_QUOTES_12213_12213.docx",
        "REMADV": M604 / "MIG_REMADV_2.9e_20260401_99991231_20260401_ooox_11954.docx",
        "REQOTE": M604 / "MIG_REQOTE_1.3c_20251001_99991231_20251001_ooox_11625.docx",
        "UTILMD_STROM": M610 / "MIG_UTILMDS_12270_12270.docx",
        "UTILMD_GAS": M610 / "MIG_UTILMDG_12277_12277.docx",
        "UTILTS": M604 / "MIG_UTILTS_1.1e_20250606_99991231_20241213_xoxx_11171.docx",
    },
}

SEG_RE = re.compile(r"^(UN[A-Z]|[A-Z]{3})$")
DE_RE = re.compile(r"^\d{4}$")
COMP_RE = re.compile(r"^[CS]\d{3}$")
FMT_RE = re.compile(r"^(an|a|n)(\.\.)?\d+$")
ST_RE = re.compile(r"^[MCRDNOX]$")
# Segmentzeile der Strukturtabelle: "0110\t00006" | "DOC" | "M\t1\tM\t1\t1"
ZAEHLER_RE = re.compile(r"^\d{4}(\s+0\d{4})?$")
WDH_RE = re.compile(r"^([MCRDNOX])\s+(\d+)\s+([MCRDNOX])\s+(\d+)\s+(\d+)$")


def dedup(cells):
    out = []
    for c in cells:
        c = c.strip()
        if not out or out[-1] != c:
            out.append(c)
    return out


def extrahiere(pfad):
    doc = docx.Document(str(pfad))
    formate = {}      # "SEG DE" -> {"st": ..., "fmt": ...}
    maxwdh = {}       # "SEG" -> max. Wiederholung (BDEW)
    cur_seg = None
    for t in doc.tables:
        for r in t.rows:
            cells = dedup(c.text.replace("\n", " ").replace("\t", " ") for c in r.cells)
            cells = [re.sub(r"\s+", " ", c).strip() for c in cells]
            cells = [c for c in cells if c != ""] or [""]
            c0 = cells[0]
            # Segment-Detailblock beginnt: Zelle nur mit Segmentcode
            if SEG_RE.match(c0) and len(cells) <= 2:
                cur_seg = c0
                continue
            # Strukturzeile: Zähler | SEG | 'M 1 M 1 1'
            if ZAEHLER_RE.match(c0) and len(cells) >= 3 and SEG_RE.match(cells[1]):
                m = WDH_RE.match(cells[2])
                if m:
                    seg = cells[1]
                    st_bdew, wdh_bdew = m.group(3), int(m.group(4))
                    if st_bdew != "N":
                        maxwdh[seg] = max(maxwdh.get(seg, 0), wdh_bdew)
                continue
            # DE-/Kompositzeile im Detailblock
            if cur_seg and (DE_RE.match(c0) or COMP_RE.match(c0)):
                if COMP_RE.match(c0):
                    continue  # Komposit-Kopfzeile: nur Komponenten prüfen
                sts = [c for c in cells[1:] if ST_RE.match(c)]
                fms = [c for c in cells[1:] if FMT_RE.match(c)]
                st_bdew = sts[-1] if sts else None
                if st_bdew == "N":
                    eintrag = {"st": "N"}
                else:
                    fmt = fms[-1] if fms else None
                    eintrag = {"st": st_bdew, "fmt": fmt}
                key = f"{cur_seg} {c0}"
                vorh = formate.get(key)
                if vorh:
                    # mehrere Vorkommen: großzügigste Variante bilden
                    if vorh.get("st") == "N" and eintrag.get("st") != "N":
                        formate[key] = eintrag
                    elif eintrag.get("fmt") and vorh.get("fmt") and eintrag["fmt"] != vorh["fmt"]:
                        def zerlege(f):
                            m2 = re.match(r"^(an|a|n)(\.\.)?(\d+)$", f)
                            return (m2.group(1), bool(m2.group(2)), int(m2.group(3)))
                        t1, o1, b1 = zerlege(vorh["fmt"])
                        t2, o2, b2 = zerlege(eintrag["fmt"])
                        typ = "an" if "an" in (t1, t2) or t1 != t2 else t1
                        # unterschiedliche Festlängen bzw. gemischt -> offenes Format
                        offen = o1 or o2 or (b1 != b2)
                        formate[key] = {"st": eintrag.get("st") or vorh.get("st"),
                                        "fmt": f"{typ}{'..' if offen else ''}{max(b1, b2)}"}
                else:
                    formate[key] = eintrag
    return formate, maxwdh


if __name__ == "__main__":
    ergebnis = {}
    for stand, quellen in QUELLEN.items():
        ergebnis[stand] = {}
        for fmt, pfad in quellen.items():
            if not pfad.exists():
                print(f"!! fehlt: {pfad}")
                continue
            formate, maxwdh = extrahiere(pfad)
            ergebnis[stand][fmt] = {"quelle": pfad.name, "felder": formate, "maxWdh": maxwdh}
            print(f"{stand} {fmt}: {len(formate)} Feldformate, {len(maxwdh)} Segmente ({pfad.name})")
    ziel = BASIS / "edigen/EdifactGenerator/_engine/daten"
    ziel.mkdir(parents=True, exist_ok=True)
    js = ("// mig-formate.js - BDEW-Feldformate/-Status je Segment+DE aus den MIGs.\n"
          "// Maschinell erzeugt mit scripts/mig_formate_extractor.py - nicht von Hand pflegen.\n"
          "var migFormate = " + json.dumps(ergebnis, ensure_ascii=False, separators=(",", ":")) +
          ";\nif (typeof module !== 'undefined') module.exports = migFormate;\n")
    (ziel / "mig-formate.js").write_text(js, encoding="utf-8")
    print("->", ziel / "mig-formate.js", f"({len(js)//1024} KB)")
