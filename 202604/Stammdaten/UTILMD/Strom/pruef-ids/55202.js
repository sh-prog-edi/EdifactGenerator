// 55202.js - Korrekturliste LF-AACL
// Segmentregeln für Prüf-ID 55202 (AHB Strom S2.1, Stand 29.06.2026, Kap. 13.11).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55202 = {
    pruefidentifikator: "55202",
    bezeichnung: "Korrekturliste LF-AACL",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: MaBiS-Zählpunkt", status: "Muss-bedingt", ahbExpr: "Muss [2207]", rule: "AHB: Muss [2207]" },
        { id: "RFF_AUU", name: "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe", status: "Muss", rule: "AHB: Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Soll", ahbExpr: "Soll [2061] ∧ [166]", rule: "AHB: Soll [2061] ∧ [166]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z20", name: "SG6 RFF+Z20: Referenz auf die ID der Tranche", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55202;
