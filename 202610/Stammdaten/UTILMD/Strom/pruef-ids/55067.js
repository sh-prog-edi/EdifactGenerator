// 55067.js - Bilanzkreiszuordnungsliste
// Segmentregeln für Prüf-ID 55067 (AHB Strom V2.2, 29.06.2026, Kap. 13.3).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55067 = {
    pruefidentifikator: "55067",
    bezeichnung: "Bilanzkreiszuordnungsliste",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage", status: "Muss", rule: "AHB: Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: MaBiS-Zählpunkt", status: "Muss-bedingt", ahbExpr: "Muss [2071] ∧ [2073]", rule: "AHB: Muss [2071] ∧ [2073]" },
        { id: "RFF_AVE", name: "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55067;
