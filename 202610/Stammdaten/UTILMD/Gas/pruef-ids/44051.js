// 44051.js  (UTILMD Gas) - Ende MSB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 6.4); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44051 = {
    pruefidentifikator: "44051",
    bezeichnung: "Ende MSB",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [584]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss-bedingt", ahbExpr: "Muss [7] ∧ [577]", rule: "AHB: Muss [7] ∧ [577]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [11]", rule: "AHB: Muss [11]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44051;
