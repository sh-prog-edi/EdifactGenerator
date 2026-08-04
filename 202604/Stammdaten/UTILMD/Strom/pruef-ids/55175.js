// 55175.js - Änderung Daten der Lokationsbündelstruktur (NB an LF)
// Segmentregeln für Prüf-ID 55175 (AHB Strom S2.1, Stand 29.06.2026, Stammdatenänderung).
// BGM/STS+7-Transaktionsgrund/EBD liefert _prozess-meta.js. Struktureller Kern:
// Rahmen + STS+7++<ZXn> + LOC (Objekt) . Die konkrete geänderte
// Stammdaten-Nutzdatenmatrix (SG8/SG10 CCI/CAV je Objektart) ist Vertiefungsschritt (siehe docs/STROM_STATUS.md).
const ahbRules55175 = {
    pruefidentifikator: "55175",
    bezeichnung: "Änderung Daten der Lokationsbündelstruktur (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: ID der Netzlokation", status: "Muss", ahbExpr: "Soll [46] ∧ [683]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY2", t: "ZY2 - Änderung der Lokationsbündelstruktur" }], rule: "AHB: Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2004]", rule: "AHB: Muss [2004]" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Soll", ahbExpr: "Soll [2015]", rule: "AHB: Soll [2015]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [684] ∧ [694] ∧ [698]", rule: "AHB: Soll [46] ∧ [684] ∧ [694] ∧ [698]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [685]", rule: "AHB: Soll [46] ∧ [685]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss ([399] ⊻ [202]) ∧ [687]", rule: "AHB: Muss ([399] ⊻ [202]) ∧ [687]" },
        { id: "RFF_Z49", name: "SG6 RFF+Z49: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]", rule: "AHB: Muss [707] ∧ [534]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [401]", rule: "AHB: Muss [131] ⊻ [401]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [471]", rule: "AHB: Muss [471]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z31", name: "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die ID der Netzlokation / Marktlokation / Messlokation / Technischen Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z33", name: "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur", status: "Muss-bedingt", ahbExpr: "Muss [2313]", rule: "AHB: Muss [2313]" },
        { id: "RFF_Z34", name: "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation", status: "Muss-bedingt", ahbExpr: "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])", rule: "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])" },
        { id: "RFF_Z16", name: "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [179] ∧ [291]", rule: "AHB: Muss [179] ∧ [291]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55175;
