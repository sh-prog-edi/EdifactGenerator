// 55018.js - Ablehnung Kündigung (LFA an LFN)
// Segmentregeln exakt für diese Prüf-ID (Antwortnachricht, Ablehnungsfall).
const ahbRules55018 = {
    pruefidentifikator: "55018",
    bezeichnung: "Ablehnung Kündigung (LFA an LFN)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E35 Kündigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_Z05", name: "SG4 DTM+Z05: Bestätigtes Kündigungsdatum", status: "Bedingt", ahbExpr: "Muss [351]", rule: "[351] Muss, wenn Ablehnungs-Status vorliegt." },
        { id: "DTM_Z10", name: "SG4 DTM+Z10: Kündigungstermin des Vertrags", status: "Bedingt", ahbExpr: "Muss [35]", rule: "[35] Bedingt laut Fristenprüfung." },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss-bedingt", ahbExpr: "Muss [352] ∧ (([85] ∧ [87]) ⊻ [27]) ∧ [581]", rule: "AHB: Muss [352] ∧ (([85] ∧ [87]) ⊻ [27]) ∧ [581]" },
        { id: "DTM_Z01", name: "SG4 DTM+Z01: Kündigungsfrist des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [352]", rule: "AHB: Muss [352]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55018;
