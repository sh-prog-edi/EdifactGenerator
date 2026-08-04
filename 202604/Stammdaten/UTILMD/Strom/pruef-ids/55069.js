// 55069.js - Clearingliste DZR
// Segmentregeln für Prüf-ID 55069 (AHB Strom S2.1, Stand 29.06.2026, Kap. 13.4).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55069 = {
    pruefidentifikator: "55069",
    bezeichnung: "Clearingliste DZR",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage", status: "Muss", rule: "AHB: Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: MaBiS-Zählpunkt", status: "Muss-bedingt", ahbExpr: "Muss [2075]", rule: "AHB: Muss [2075]" },
        { id: "RFF_AUU", name: "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AVE", name: "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_163", name: "SG4 DTM+163: Beginn Messperiode", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_164", name: "SG4 DTM+164: Ende Messperiode", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55069;
