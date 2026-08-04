// 44041.js  (UTILMD Gas) - Ablehnung Kündigung MSB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 6.1); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44041 = {
    pruefidentifikator: "44041",
    bezeichnung: "Ablehnung Kündigung MSB",
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
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss-bedingt", ahbExpr: "Muss [16] ∧ [581]", rule: "AHB: Muss [16] ∧ [581]" },
        { id: "DTM_Z01", name: "SG4 DTM+Z01: Kündigungsfrist des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [16]", rule: "AHB: Muss [16]" },
        { id: "DTM_Z10", name: "SG4 DTM+Z10: Kündigungstermin des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [35]", rule: "AHB: Muss [35]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "ZR9", t: "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44041;
