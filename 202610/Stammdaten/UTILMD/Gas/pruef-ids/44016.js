// 44016.js  (UTILMD Gas, GeLi Gas) - Kündigung zwischen Lieferanten (LFN an LFA)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44016 = {
    pruefidentifikator: "44016",
    bezeichnung: "Kündigung zwischen Lieferanten (LFN an LFA)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Bedingt", ahbExpr: "Muss [12]", rule: "Entweder DTM+93 oder DTM+471 (nächstmöglicher Termin)." },
        { id: "DTM_471", name: "SG4 DTM+471: Ende zum nächstmöglichen Termin", status: "Bedingt", ahbExpr: "Muss [18]", rule: "[13] i. V. m. Antwortstatus; Entweder DTM+93 oder DTM+471." },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [328] ∧ [583] Soll [333] ∧ [165] ∧ [2061] ∧ ([583] ∨ [584])", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z01", name: "SG6 RFF+Z01: Kundennummer beim Altlieferant", status: "Kann", rule: "AHB: Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44016;
