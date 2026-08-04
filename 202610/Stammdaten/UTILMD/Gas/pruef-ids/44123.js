// 44123.js  (UTILMD Gas) - Bila.rel. Änderung vom NB mit
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.10); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44123 = {
    pruefidentifikator: "44123",
    bezeichnung: "Bila.rel. Änderung vom NB mit",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZF0", t: "ZF0 - Bila.rel. Änderung vom NB mit Abhängigkeiten" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44123;
