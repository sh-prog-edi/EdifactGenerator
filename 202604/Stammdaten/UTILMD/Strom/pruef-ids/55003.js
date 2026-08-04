// 55003.js - Ablehnung Anmeldung verbrauchende MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55003 (AHB Strom S2.1, konsolidierte Lesefassung Stand 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55003 = {
    pruefidentifikator: "55003",
    bezeichnung: "Ablehnung Anmeldung verbrauchende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0622)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Muss bei A99 Sonstiges)", status: "Bedingt", rule: "[48] Muss bei STS+E01++A99." },
        { id: "DTM_Z07", name: "SG4 DTM+Z07: Lieferbeginndatum in Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [358]", rule: "AHB: Muss [358]" },
        { id: "DTM_Z08", name: "SG4 DTM+Z08: Datum für nächste Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [358]", rule: "AHB: Muss [358]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55003;
