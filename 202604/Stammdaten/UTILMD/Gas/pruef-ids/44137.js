// 44137.js  (UTILMD Gas) - Nicht bila. rel. Anfrage an LF
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.12); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44137 = {
    pruefidentifikator: "44137",
    bezeichnung: "Nicht bila. rel. Anfrage an LF",
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
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZF3", t: "ZF3 - Nicht bila.rel. Anfrage an LF" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Kann", ahbExpr: "Muss [636]", rule: "AHB: Kann" },
        { id: "DTM_Z20", name: "SG4 DTM+Z20: Abrechnungsintervall des LF", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AVC", name: "SG6 RFF+AVC: Kundennummer beim Lieferanten", status: "Kann", rule: "AHB: Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44137;
