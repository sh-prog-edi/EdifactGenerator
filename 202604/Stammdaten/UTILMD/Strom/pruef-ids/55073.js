// 55073.js - Übermittlung der Profildefinitionen (an LF/MSB)
// Segmentregeln für Prüf-ID 55073 (AHB Strom S2.1, Stand 29.06.2026, Kap. 13.6).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55073 = {
    pruefidentifikator: "55073",
    bezeichnung: "Übermittlung der Profildefinitionen (an LF/MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55073;
