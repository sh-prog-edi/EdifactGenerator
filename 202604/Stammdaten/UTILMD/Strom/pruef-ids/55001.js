// 55001.js - Anmeldung verbrauchende MaLo (LF an NB)
// Segmentregeln für Prüf-ID 55001 (AHB Strom S2.1, konsolidierte Lesefassung Stand 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
// Der Produktpaket-Block (SG8 SEQ+Z79/PIA/CCI/CAV, SG8 SEQ+ZH0, SG10 CCI+Z65) wird
// separat über _produktpaket.js + _produkte-55001.js gerendert und in generateEdifact()
// nach den SG6-RFF-Segmenten eingefügt.
const ahbRules55001 = {
    pruefidentifikator: "55001",
    bezeichnung: "Anmeldung verbrauchende MaLo (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Bedingt", ahbExpr: "Muss [10]", rule: "[10] Muss bei befristeter Anmeldung." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZAP", t: "ZAP - ruhende Marktlokation" }] },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [67]", bedingungen: ["2061", "480"], abhaengig: {"feld": "STS_7", "code": "ZAP", "negiert": true, "bedingung": "96"}, rule: "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }], rule: "AHB: Muss" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [96]", abhaengig: {"feld": "STS_7", "code": "ZAP", "negiert": false, "bedingung": "96"}, rule: "AHB: Muss [2061] ∧ [96]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55001;
