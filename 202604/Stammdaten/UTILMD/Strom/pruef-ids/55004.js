// 55004.js - Abmeldung verbrauchende MaLo (LF an NB)
// Segmentregeln für Prüf-ID 55004 (AHB Strom S2.1, konsolidierte Lesefassung Stand 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55004 = {
    pruefidentifikator: "55004",
    bezeichnung: "Abmeldung verbrauchende MaLo (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Vertragsbeginn", status: "Bedingt", ahbExpr: "Muss [7] ∧ [577]", rule: "[7] Bei bestimmten Transaktionsgründen." },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Muss", ahbExpr: "Muss [11]", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }, { v: "ZAP", t: "ZAP - ruhende Marktlokation" }], ahbExpr: "Codes: Z41 [510], ZZD [313], ZZD [686]" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ ([479] ⊻ [480])", bedingungen: ["2061", "479", "480"], rule: "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation." },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: ID der Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [481]", bedingungen: ["2061", "481"], abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": false, "bedingung": "481"}, rule: "Muss bei Tranche (STS-Ergänzung ZW5)." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "Z41", t: "Z41 - Ende der ESV ohne Folgelieferung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }, { v: "ZT4", t: "ZT4 - Ende wegen Kündigung durch LF" }, { v: "ZT5", t: "ZT5 - Ende wegen Kündigung durch Kunde/LFN" }, { v: "ZZD", t: "ZZD - Übergangsversorgung" }], ahbExpr: "Codes: Z41 [510], ZZD [313], ZZD [686]", rule: "AHB: Muss" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [96]", abhaengig: {"feld": "STS_7", "code": "ZAP", "negiert": false, "bedingung": "96"}, rule: "AHB: Muss [2061] ∧ [96]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55004;
