// 55011.js - Bestätigung Beendigung der Zuordnung (LFN an LFA)
// Segmentregeln für Prüf-ID 55011 (AHB Strom, Version 2.2, 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55011 = {
    pruefidentifikator: "55011",
    bezeichnung: "Bestätigung Beendigung der Zuordnung (LFN an LFA)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende / Beendigung", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0624)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55011;
