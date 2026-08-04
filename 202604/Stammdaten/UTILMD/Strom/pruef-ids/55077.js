// 55077.js - Anmeldung erzeugende MaLo (LF an NB)
// Segmentregeln für Prüf-ID 55077 (AHB Strom S2.1). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55077 = {
    pruefidentifikator: "55077",
    bezeichnung: "Anmeldung erzeugende MaLo (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW0", t: "ZW0 - Geschäftsvorfall 1" }, { v: "ZW1", t: "ZW1 - Geschäftsvorfall 2" }, { v: "ZW2", t: "ZW2 - Geschäftsvorfall 3" }] },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ ([476] ⊻ [478])", bedingungen: ["2061", "479"], abhaengig: {"feld": "STS_7", "code": "ZW1", "negiert": true, "bedingung": "477"}, rule: "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [477]", abhaengig: {"feld": "STS_7", "code": "ZW1", "negiert": false, "bedingung": "477"}, rule: "AHB: Muss [2061] ∧ [477]" }
    ],
    nutzdaten: [{"seq": "Z01", "merkmale": [{"cci": "ZB3", "cav": [{"code": "Z91", "wert": "9911000000456"}]}]}]
};

if (typeof module !== 'undefined') module.exports = ahbRules55077;
