// 55611.js - Beendigung der Zuordnung
// Segmentregeln für Prüf-ID 55611 (AHB Strom V2.2, 29.06.2026, Kap. 8.11).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55611 = {
    pruefidentifikator: "55611",
    bezeichnung: "Beendigung der Zuordnung",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061] ∧ [349]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss-bedingt", ahbExpr: "Muss [475] ∧ [507]", rule: "AHB: Muss [475] ∧ [507]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [474]", rule: "AHB: Muss [474]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZC8", t: "ZC8 - Beendigung der Zuordnung" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }], rule: "AHB: Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [347]", rule: "AHB: Muss [2061] ∧ [347]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55611;
