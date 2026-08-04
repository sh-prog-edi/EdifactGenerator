// 55237.js - Antwort Zuordnung ZP der NGZ zur NZR
// Segmentregeln für Prüf-ID 55237 (AHB Strom S2.1, Stand 29.06.2026, Kap. 13.16).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55237 = {
    pruefidentifikator: "55237",
    bezeichnung: "Antwort Zuordnung ZP der NGZ zur NZR",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)", status: "Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: ID des MaBiS-Zählpunkts", status: "Muss", ahbExpr: "Muss [2096] ∧ [594]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Soll", ahbExpr: "Soll [71]", rule: "AHB: Soll [71]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Soll", ahbExpr: "Soll [72]", rule: "AHB: Soll [72]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55237;
