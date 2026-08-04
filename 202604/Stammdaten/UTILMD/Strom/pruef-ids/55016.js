// 55016.js - Kündigung (LFN an LFA)
// Segmentregeln exakt für diese Prüf-ID (Anfragenachricht, initiiert den Vorgang).
// Enthält nur Segmente, die für 55016 tatsächlich relevant sind (kein "X" mehr nötig).
const ahbRules55016 = {
    pruefidentifikator: "55016",
    bezeichnung: "Kündigung (LFN an LFA)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E35 Kündigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende", status: "Bedingt", ahbExpr: "Muss [12]", rule: "[12] Muss, wenn DTM+471 fehlt." },
        { id: "DTM_471", name: "SG4 DTM+471: Ende zum nächstmöglichen Termin", status: "Bedingt", ahbExpr: "Muss [18]", rule: "[18] Muss, wenn DTM+93 fehlt." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }] },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ ([479] ⊻ [480])", bedingungen: ["2061", "479", "480"], abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": true, "bedingung": "481"}, rule: "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation." },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: ID der Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [481]", bedingungen: ["2061", "481"], abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": false, "bedingung": "481"}, rule: "Muss bei Tranche (STS-Ergänzung ZW5)." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55016;
