// 44019.js  (UTILMD Gas) - Bestandsliste zugeordnete
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44019 = {
    pruefidentifikator: "44019",
    bezeichnung: "Bestandsliste zugeordnete",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [583]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Soll", ahbExpr: "Soll [14]", rule: "AHB: Soll [14]" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss-bedingt", ahbExpr: "Muss [18] Soll [28] ∧ [29]", rule: "AHB: Muss [18] Soll [28] ∧ [29]" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Muss-bedingt", ahbExpr: "Muss [28] ∧ [64]", rule: "AHB: Muss [28] ∧ [64]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44019;
