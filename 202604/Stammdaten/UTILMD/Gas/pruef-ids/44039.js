// 44039.js  (UTILMD Gas) - Kündigung MSB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 6.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44039 = {
    pruefidentifikator: "44039",
    bezeichnung: "Kündigung MSB",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [77] ∧ [2061] ∧ [584]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [12]", rule: "AHB: Muss [12]" },
        { id: "DTM_471", name: "SG4 DTM+471: Ende zum (nächstmöglichem Termin)", status: "Muss-bedingt", ahbExpr: "Muss [18]", rule: "AHB: Muss [18]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "ZR9", t: "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44039;
