// 55063.js - Deaktivierung eines MaBiS-Zählpunkts
// Segmentregeln für Prüf-ID 55063 (AHB Strom V2.2, 29.06.2026, Kap. 13.1).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55063 = {
    pruefidentifikator: "55063",
    bezeichnung: "Deaktivierung eines MaBiS-Zählpunkts",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z15", name: "SG5 LOC+Z15: ID des MaBiS-Zählpunkts", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Muss", rule: "AHB: Muss" }
    ],
    nutzdaten: [{"seq": "Z01", "merkmale": [{"cci": "ZB3", "cav": [{"code": "Z91", "wert": "9911000000456"}]}]}]
};

if (typeof module !== 'undefined') module.exports = ahbRules55063;
