// 55238.js - Anmeldung in Modell 2
// Segmentregeln für Prüf-ID 55238 (AHB Strom V2.2, 29.06.2026, Kap. 11.1).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55238 = {
    pruefidentifikator: "55238",
    bezeichnung: "Anmeldung in Modell 2",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation", status: "Muss", rule: "AHB: Muss" }
    ],
    nutzdaten: [{"seq": "Z38", "merkmale": [{"cci": "ZB3", "cav": [{"code": "Z91", "wert": "9911000000456"}]}]}]
};

if (typeof module !== 'undefined') module.exports = ahbRules55238;
