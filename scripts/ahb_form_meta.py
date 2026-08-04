"""Generische AHB-Formular-Meta: je Prüf-ID die geordnete Liste aller Segmentinstanzen
mit Datenelementen, Codelisten und AHB-Ausdrücken. Grundlage für universelle
Generator-Formulare (ORDERS, ORDRSP, ...).

28.07.2026 (S. Haense): Der Ausdruck des Segmentgruppen-Status und die zugehörigen
Bedingungstexte werden mitgeführt (`sgExpr`, `bedingungen`). Ohne sie geht genau die
Information verloren, die eine Segmentgruppe von einer alternativen unterscheidet --
etwa SG5 "Marktlokation" (Muss [2061] wedge [67]) gegenüber SG5 "Ruhende Marktlokation"
(Muss [2061] wedge [96]). Erst damit kann das Formular abhängige Felder schalten.
"""
import glob
import json
import re
import sys

RAHMEN = {"UNB", "UNZ", "UNT"}  # werden automatisch erzeugt (UNH/UNS teilweise)


def sammle(json_dir):
    meta = {}
    for f in sorted(glob.glob(f"{json_dir}/*.json")):
        d = json.load(open(f))
        p = d["meta"]["pruefidentifikator"]
        instanzen = []
        cur = None
        section = None
        pending_expr = None
        pending_cond = None
        for z in d["lines"]:
            zt = z["zeilentyp"]
            if zt == "segmentname":
                s = (z.get("section_name") or "").replace("\n", " ").strip()
                if s and not s.startswith("EDIFACT Struktur"):
                    section = s
            elif zt == "segment_status" and z.get("segment_code"):
                if cur: instanzen.append(cur)
                cur = {"sg": z.get("segment_group_key"), "seg": z["segment_code"],
                       "expr": (z.get("ahb_expression") or "").strip(),
                       "section": section, "des": []}
                if pending_expr:
                    cur["sgExpr"] = pending_expr
                if pending_cond:
                    cur["bedingungen"] = pending_cond
                if (z.get("conditions") or "").strip():
                    cur["bedingungen"] = ((cur.get("bedingungen", "") + "\n" +
                                           z["conditions"]).strip())
                pending_expr = None
                pending_cond = None
            elif zt == "segment_status":
                e = (z.get("ahb_expression") or "").split("\t")[0].strip()
                if e:
                    pending_expr = e
                c = (z.get("conditions") or "").strip()
                if c:
                    pending_cond = c
            elif zt == "datenelement" and z.get("data_element"):
                seg = z.get("segment_code")
                if seg and (cur is None or seg != cur["seg"]):
                    # Verwaiste Datenzeile (Segmentstatus durch Tabellensplit verloren):
                    # neue Instanz aus den Zeilenangaben selbst eröffnen
                    if cur: instanzen.append(cur)
                    cur = {"sg": z.get("segment_group_key"), "seg": seg,
                           "expr": pending_expr or "", "section": section, "des": []}
                    if pending_cond:
                        cur["bedingungen"] = pending_cond
                    pending_expr = None
                    pending_cond = None
                if cur is None:
                    continue
                de = z["data_element"]
                v, n = z.get("value_pool_entry"), (z.get("name") or "").strip()
                expr = (z.get("ahb_expression") or "").strip()
                if (z.get("conditions") or "").strip() and z["conditions"] not in (cur.get("bedingungen") or ""):
                    cur["bedingungen"] = ((cur.get("bedingungen", "") + "\n" + z["conditions"]).strip())
                eintrag = next((e for e in cur["des"] if e["de"] == de), None)
                if eintrag is None:
                    eintrag = {"de": de, "name": n, "expr": expr, "codes": []}
                    cur["des"].append(eintrag)
                if v and re.match(r"^[A-Za-z0-9_.\-]{1,18}$", v):
                    if not any(c[0] == v for c in eintrag["codes"]):
                        eintrag["codes"].append([v, n, expr])
                elif v:
                    # Pseudo-Code (Namensfragment aus der Extraktion) -> als Name führen
                    if not eintrag["name"]:
                        eintrag["name"] = v
                    if not eintrag["expr"]:
                        eintrag["expr"] = expr
                else:
                    # Zeile ohne Code = Freitext-Charakteristik des DE
                    if not eintrag["name"]:
                        eintrag["name"] = n
                    if not eintrag["expr"]:
                        eintrag["expr"] = expr
        if cur: instanzen.append(cur)
        # LOC ohne DE3225: synthetisches ID-Feld ergänzen (eine Lokationsangabe ohne
        # Objekt-ID ist nicht generierbar; einzelne AHB-Spalten lassen die Zeile weg)
        for i in instanzen:
            if i["seg"] == "LOC" and not any(e["de"] == "3225" for e in i["des"]):
                i["des"].append({"de": "3225", "name": "Objekt-ID (Bezeichnung)", "expr": "X", "codes": []})
        for i in instanzen:
            if i["seg"] == "PRI" and not any(e["de"] == "5118" for e in i["des"]):
                i["des"].append({"de": "5118", "name": "Preis, Betrag", "expr": "X", "codes": []})
        # Rahmensegmente entfernen (werden vom Generator erzeugt)
        instanzen = [i for i in instanzen if i["seg"] not in RAHMEN]
        meta[p] = {"beschreibung": (d["meta"].get("beschreibung") or "").strip(),
                   "instanzen": instanzen}
    return meta


if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    meta = sammle(src)
    json.dump(meta, open(out, "w"), ensure_ascii=False, separators=(",", ":"))
    n_inst = sum(len(m["instanzen"]) for m in meta.values())
    print(f"{out}: {len(meta)} Prüfis, {n_inst} Segmentinstanzen")
