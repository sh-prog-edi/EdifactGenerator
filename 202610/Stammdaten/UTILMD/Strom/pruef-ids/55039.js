// 55039.js - Anfrage Kündigung des Messstellenbetriebs (MSBN an MSBA)
// Segmentregeln für Prüf-ID 55039 (AHB Strom V2.2, 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55039 = {
    pruefidentifikator: "55039",
    bezeichnung: "Anfrage Kündigung des Messstellenbetriebs (MSBN an MSBA)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E35 Kündigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss [77] ∧ [347] ∧ [2061] Kann [2061]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [12]", rule: "AHB: Muss [12]" },
        { id: "DTM_471", name: "SG4 DTM+471: Ende zum (nächstmöglichen Termin)", status: "Muss-bedingt", ahbExpr: "Muss [18]", rule: "AHB: Muss [18]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "ZR9", t: "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer" }], rule: "AHB: Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [77] ∧ [349] Kann", rule: "AHB: Muss [77] ∧ [349] Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55039;
