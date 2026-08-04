// 55605.js - Ablehnung Anmeldung neue erz. MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55605 (AHB Strom S2.1). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55605 = {
    pruefidentifikator: "55605",
    bezeichnung: "Ablehnung Anmeldung neue erz. MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0608)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [43]", bedingungen: ["2061", "479"], rule: "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)." },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E02", t: "E02 - Einzug in Neuanlage" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55605;
