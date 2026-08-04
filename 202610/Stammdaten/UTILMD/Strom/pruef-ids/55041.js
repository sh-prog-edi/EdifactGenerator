// 55041.js - Ablehnung Kündigung des Messstellenbetriebs (MSBA an MSBN)
// Segmentregeln für Prüf-ID 55041 (AHB Strom V2.2, 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55041 = {
    pruefidentifikator: "55041",
    bezeichnung: "Ablehnung Kündigung des Messstellenbetriebs (MSBA an MSBN)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E35 Kündigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss [253] ∧ [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss-bedingt", ahbExpr: "Muss [16] ∧ [581]", rule: "AHB: Muss [16] ∧ [581]" },
        { id: "DTM_Z01", name: "SG4 DTM+Z01: Kündigungsfrist des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [16]", rule: "AHB: Muss [16]" },
        { id: "DTM_Z10", name: "SG4 DTM+Z10: Kündigungstermin des Vertrags", status: "Muss-bedingt", ahbExpr: "Muss [35]", rule: "AHB: Muss [35]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "ZR9", t: "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55041;
