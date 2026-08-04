// 55203.js - Aktivierung ZP monatliche AAÜZ
// Segmentregeln für Prüf-ID 55203 (AHB Strom S2.1, Stand 29.06.2026, Kap. 13.12).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55203 = {
    pruefidentifikator: "55203",
    bezeichnung: "Aktivierung ZP monatliche AAÜZ",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: ID des MaBiS-Zählpunkts", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55203;
