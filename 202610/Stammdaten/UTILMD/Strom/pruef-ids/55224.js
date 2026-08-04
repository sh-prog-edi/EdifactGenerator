// 55224.js - Antwort auf DZÜ-Liste
// Segmentregeln für Prüf-ID 55224 (AHB Strom V2.2, 29.06.2026, Kap. 13.8).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55224 = {
    pruefidentifikator: "55224",
    bezeichnung: "Antwort auf DZÜ-Liste",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: MaBiS-Zählpunkt", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AUU", name: "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe", status: "Muss", rule: "AHB: Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [348] ∧ [659]", rule: "AHB: Muss [2061] ∧ [348] ∧ [659]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [347] ∧ [659]", rule: "AHB: Muss [2061] ∧ [347] ∧ [659]" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55224;
