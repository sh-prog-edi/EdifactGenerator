// 55080.js - Ablehnung Anmeldung erzeugende MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55080 (AHB Strom V2.2). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55080 = {
    pruefidentifikator: "55080",
    bezeichnung: "Ablehnung Anmeldung erzeugende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0622)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_Z07", name: "SG4 DTM+Z07: Lieferbeginndatum in Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [355]", rule: "AHB: Muss [355]" },
        { id: "DTM_Z08", name: "SG4 DTM+Z08: Datum für nächste Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [355]", rule: "AHB: Muss [355]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID einer Marktlokation / Tranche", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55080;
