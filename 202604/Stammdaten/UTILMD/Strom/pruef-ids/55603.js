// 55603.js - Bestätigung Anmeldung neue erz. MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55603 (AHB Strom S2.1). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55603 = {
    pruefidentifikator: "55603",
    bezeichnung: "Bestätigung Anmeldung neue erz. MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW0", t: "ZW0 - Geschäftsvorfall 1" }, { v: "ZW2", t: "ZW2 - Geschäftsvorfall 3" }], ahbExpr: "Codes: ZW0 [560], ZW2 [561]" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0608)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061]", bedingungen: ["2061", "479"], rule: "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)." },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E02", t: "E02 - Einzug in Neuanlage" }], ahbExpr: "Codes: ZW0 [560], ZW2 [561]", rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Soll", ahbExpr: "Soll [46] ∧ [688]", rule: "AHB: Soll [46] ∧ [688]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [689] ∧ [694]", rule: "AHB: Soll [46] ∧ [689] ∧ [694]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [690]", rule: "AHB: Soll [46] ∧ [690]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [478]", abhaengig: {"feld": "STS_7", "code": "ZW2", "negiert": false, "bedingung": "478"}, rule: "AHB: Muss [478]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss [623]", rule: "AHB: Muss [623]" },
        { id: "RFF_Z60", name: "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die ID der Netzlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID der Messlokation", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55603;
