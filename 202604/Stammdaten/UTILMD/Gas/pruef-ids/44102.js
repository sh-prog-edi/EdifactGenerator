// 44102.js  (UTILMD Gas) - Aktualisierte Stammdaten zur
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 7.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44102 = {
    pruefidentifikator: "44102",
    bezeichnung: "Aktualisierte Stammdaten zur",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [584]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss-bedingt", ahbExpr: "Muss [9] ∧ [508]", rule: "AHB: Muss [9] ∧ [508]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Soll", ahbExpr: "Soll [9] ∧ [14]", rule: "AHB: Soll [9] ∧ [14]" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss-bedingt", ahbExpr: "Muss [9]", rule: "AHB: Muss [9]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "Z15", t: "Z15 - Zusätzlicher Datensatz" }, { v: "ZE3", t: "ZE3 - Stammdatenänderung" }, { v: "ZE4", t: "ZE4 - Weggefallene Markt-bzw. Messlokation" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44102;
