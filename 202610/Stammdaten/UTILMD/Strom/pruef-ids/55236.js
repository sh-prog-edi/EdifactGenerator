// 55236.js - Beendigung Zuordnung ZP der NGZ zur NZR
// Segmentregeln für Prüf-ID 55236 (AHB Strom V2.2, 29.06.2026, Kap. 13.16).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55236 = {
    pruefidentifikator: "55236",
    bezeichnung: "Beendigung Zuordnung ZP der NGZ zur NZR",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: ID des MaBiS-Zählpunkts", status: "Muss", ahbExpr: "Muss [2096] ∧ [594]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55236;
