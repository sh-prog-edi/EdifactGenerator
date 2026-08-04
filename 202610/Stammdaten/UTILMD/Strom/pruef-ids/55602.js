// 55602.js - Bestätigung Anmeldung neue verb. MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55602 (AHB Strom V2.2). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55602 = {
    pruefidentifikator: "55602",
    bezeichnung: "Bestätigung Anmeldung neue verb. MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Bedingt", ahbExpr: "Muss [10]", rule: "[10] Muss bei befristeter Anmeldung." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW6", t: "ZW6 - Pauschale Marktlokation" }, { v: "ZW7", t: "ZW7 - Gemessene Marktlokation" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0608)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061]", bedingungen: ["2061", "480"], rule: "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)." },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E02", t: "E02 - Einzug in Neuanlage" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Soll", ahbExpr: "Soll [46] ∧ [688]", rule: "AHB: Soll [46] ∧ [688]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [689] ∧ [694]", rule: "AHB: Soll [46] ∧ [689] ∧ [694]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [690]", rule: "AHB: Soll [46] ∧ [690]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss [483] ∧ [623]", rule: "AHB: Muss [483] ∧ [623]" },
        { id: "RFF_Z60", name: "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die ID der Netzlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID der Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_befristet", name: "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55602;
