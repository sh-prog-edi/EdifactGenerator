// 55036.js - Meldung über existierende Zuordnung (NB an LF)
// Segmentregeln für Prüf-ID 55036 (AHB Strom, Kap. 8.11, Version 2.2, 29.06.2026).
// Reine Meldung (keine EBD-Antwort). BGM E01, Transaktionsgrund Z26.
const ahbRules55036 = {
    pruefidentifikator: "55036",
    bezeichnung: "Meldung über existierende Zuordnung (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [348]", bedingungen: ["2061", "348"], rule: "Muss, wenn keine Tranche (LOC+Z21) angegeben ist (Entweder-Oder mit LOC+Z21)." },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: ID der Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [347]", bedingungen: ["2061", "348"], rule: "Muss, wenn keine Marktlokation (LOC+Z16) angegeben ist (Entweder-Oder mit LOC+Z16)." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "Z26", t: "Z26 - Information über existierende Zuordnung" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55036;
