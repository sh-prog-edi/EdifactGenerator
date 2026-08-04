// 55037.js - Meldung über Beendigung der Zuordnung (NB an LF)
// Segmentregeln für Prüf-ID 55037 (AHB Strom, Kap. 8.11, Version 2.2, 29.06.2026).
// Reine Meldung (keine EBD-Antwort). BGM E02, Transaktionsgrund ZC8/ZD9/ZG6, Ergänzung ZW3/ZW4.
const ahbRules55037 = {
    pruefidentifikator: "55037",
    bezeichnung: "Meldung über Beendigung der Zuordnung (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende / Beendigung", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZC8", t: "ZC8 - Beendigung der Zuordnung" }, { v: "ZD9", t: "ZD9 - Beendigung wegen Rückzuordnungsmeldung" }, { v: "ZG6", t: "ZG6 - Beendigung aufgrund EEG 2014" }] },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }] },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [348]", bedingungen: ["2061", "348"], rule: "Muss, wenn keine Tranche (LOC+Z21) angegeben ist (Entweder-Oder mit LOC+Z21)." },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: ID der Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [347]", bedingungen: ["2061", "348"], rule: "Muss, wenn keine Marktlokation (LOC+Z16) angegeben ist (Entweder-Oder mit LOC+Z16)." }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55037;
