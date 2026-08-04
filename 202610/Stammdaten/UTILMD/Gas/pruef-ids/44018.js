// 44018.js  (UTILMD Gas, GeLi Gas) - Kündigung – Ablehnung (LFA an LFN)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44018 = {
    pruefidentifikator: "44018",
    bezeichnung: "Kündigung – Ablehnung (LFA an LFN)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [361] ∧ [583]", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_Z05", name: "SG4 DTM+Z05: Datum des bereits bestätigten Vertragsendes", status: "Muss-bedingt", ahbExpr: "Muss [15] Soll [17] ∧ [16]", rule: "AHB: Muss [15] Soll [17] ∧ [16]" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss-bedingt", ahbExpr: "Muss [16] ∧ [581]", rule: "AHB: Muss [16] ∧ [581]" },
        { id: "DTM_Z01", name: "SG4 DTM+Z01: Kündigungsfrist des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [16]", rule: "AHB: Muss [16]" },
        { id: "DTM_Z10", name: "SG4 DTM+Z10: Kündigungstermin des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [35]", rule: "AHB: Muss [35]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44018;
