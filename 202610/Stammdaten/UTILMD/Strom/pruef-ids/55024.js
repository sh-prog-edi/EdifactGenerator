// 55024.js - Ablehnung Anfrage Stornierung (zurück an den Absender)
// Segmentregeln für Prüf-ID 55024 (AHB Strom V2.2, 29.06.2026, Kap. 9.6 Stornierungsmeldung).
// BGM E01/E02/E35 (Kategorie der Ursprungsmeldung), STS+7++E05 (Stornierung); Referenz via RFF+ACW.
// Details in _prozess-meta.js.
const ahbRules55024 = {
    pruefidentifikator: "55024",
    bezeichnung: "Ablehnung Anfrage Stornierung (zurück an den Absender)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01/E02/E35 - Kategorie der zu stornierenden Meldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_0086/S_0087)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E05", t: "E05 - Stornierung" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55024;
