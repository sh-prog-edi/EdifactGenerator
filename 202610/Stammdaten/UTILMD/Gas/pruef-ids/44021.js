// 44021.js  (UTILMD Gas) - Antwort auf Änderungsmeldung zur
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44021 = {
    pruefidentifikator: "44021",
    bezeichnung: "Antwort auf Änderungsmeldung zur",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [583]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Soll", ahbExpr: "Soll [336]", rule: "AHB: Soll [336]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Soll", ahbExpr: "Soll [336]", rule: "AHB: Soll [336]" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Soll", ahbExpr: "Soll [336]", rule: "AHB: Soll [336]" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Soll", ahbExpr: "Soll [336]", rule: "AHB: Soll [336]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZD0", t: "ZD0 - Fehlerkorrektur" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44021;
