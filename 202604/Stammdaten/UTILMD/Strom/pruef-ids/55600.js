// 55600.js - Anmeldung neue verbrauchende MaLo (LF an NB)
// Segmentregeln für Prüf-ID 55600 (AHB Strom S2.1). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules55600 = {
    pruefidentifikator: "55600",
    bezeichnung: "Anmeldung neue verbrauchende MaLo (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Bedingt", ahbExpr: "Muss [10]", rule: "[10] Muss bei befristeter Anmeldung." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Soll [2061] ∧ [165]", bedingungen: ["2061", "480"], rule: "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E02", t: "E02 - Einzug in Neuanlage" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Kann", rule: "AHB: Kann" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Kann", rule: "AHB: Kann" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Kann", rule: "AHB: Kann" },
        { id: "STS_7_befristet", name: "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Codes: E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" }
    ],
    nutzdaten: [{"seq": "Z01", "merkmale": [{"cci": "ZB3", "cav": [{"code": "Z91", "wert": "9911000000456"}]}]}]
};

if (typeof module !== 'undefined') module.exports = ahbRules55600;
