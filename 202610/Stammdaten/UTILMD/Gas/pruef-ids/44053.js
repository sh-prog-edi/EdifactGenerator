// 44053.js  (UTILMD Gas) - Ablehnung Ende MSB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 6.4); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44053 = {
    pruefidentifikator: "44053",
    bezeichnung: "Ablehnung Ende MSB",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061] ∧ [584]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44053;
