// 55038.js - Meldung über Aufhebung einer zukünftigen Zuordnung (NB an LF)
// Segmentregeln für Prüf-ID 55038 (AHB Strom, Kap. 8.11, Version 2.2, 29.06.2026).
// Reine Meldung (keine EBD-Antwort). BGM E02, Transaktionsgrund ZG5/ZG9/ZH0/ZH1, Ergänzung ZW3/ZW4.
// Anwendungsfall Aufhebung: sowohl DTM+92 (Beginn) als auch DTM+93 (Ende) sind Muss.
const ahbRules55038 = {
    pruefidentifikator: "55038",
    bezeichnung: "Meldung über Aufhebung einer zukünftigen Zuordnung (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Datum Beginn der aufzuhebenden Zuordnung", status: "Muss", ahbExpr: "Muss [507]", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZG5", t: "ZG5 - Aufhebung einer zukünftigen Zuordnung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung" }, { v: "ZH0", t: "ZH0 - Aufhebung einer zukünftigen Zuordnung" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung" }], ahbExpr: "Codes: ZG5 [1P0..1], ZG9 [18P0..1], ZH0 [1P0..1], ZH1 [1P0..1]" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }], ahbExpr: "Codes: ZG5 [1P0..1], ZG9 [18P0..1], ZH0 [1P0..1], ZH1 [1P0..1]" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061] ∧ [348]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [347]", rule: "AHB: Muss [2061] ∧ [347]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55038;
