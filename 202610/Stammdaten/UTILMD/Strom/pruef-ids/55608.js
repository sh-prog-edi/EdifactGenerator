// 55608.js - Bestätigung Ankündigung Zuordnung (LF an NB)
// Segmentregeln für Prüf-ID 55608 (AHB Strom V2.2, Kap. 8.7). BGM/STS/EBD in _prozess-meta.js.
const ahbRules55608 = {
    pruefidentifikator: "55608",
    bezeichnung: "Bestätigung Ankündigung Zuordnung (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung (Fall)", status: "Muss", isSelect: true, options: [{ v: "ZW8", t: "ZW8 - Fall 1" }, { v: "ZW9", t: "ZW9 - Fall 2" }, { v: "ZX0", t: "ZX0 - Fall 3" }, { v: "ZX1", t: "ZX1 - Fall 4" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0603)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [10]", rule: "AHB: Muss [10]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55608;
