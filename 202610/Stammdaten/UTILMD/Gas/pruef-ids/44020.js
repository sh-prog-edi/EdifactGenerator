// 44020.js  (UTILMD Gas) - Änderungsmeldung zur Bestandsliste
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44020 = {
    pruefidentifikator: "44020",
    bezeichnung: "Änderungsmeldung zur Bestandsliste",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [583]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Kann", rule: "AHB: Kann" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Kann", rule: "AHB: Kann" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Kann", rule: "AHB: Kann" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Kann", rule: "AHB: Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZD0", t: "ZD0 - Fehlerkorrektur" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44020;
