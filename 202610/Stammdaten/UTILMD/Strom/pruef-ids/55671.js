// 55671.js - Rückmeldung/Anfrage Stammdaten Bilanzkreistreue (ÜNB an NB)
// Segmentregeln für Prüf-ID 55671 (AHB Strom V2.2, 29.06.2026, Kap. 9.4 Bilanzkreistreue).
// Antwort auf 55670: STS+E01 + EBD E_0574; Details in _prozess-meta.js.
const ahbRules55671 = {
    pruefidentifikator: "55671",
    bezeichnung: "Rückmeldung/Anfrage Stammdaten Bilanzkreistreue (ÜNB an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD E_0574)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]", abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": true, "bedingung": "481"} },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZAM", t: "ZAM - Stammdaten BK-Treue" }], rule: "AHB: Muss" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [481] ∧ [2001]", abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": false, "bedingung": "481"}, rule: "AHB: Muss [481] ∧ [2001]" },
        { id: "RFF_Z48", name: "SG6 RFF+Z48: Verwendungszeitraum der Daten", status: "Soll", ahbExpr: "Soll [8] ∧ [707]", rule: "AHB: Soll [8] ∧ [707]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [134]", rule: "AHB: Muss [131] ⊻ [134]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [472]", rule: "AHB: Muss [472]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z20", name: "SG6 RFF+Z20: Referenz auf die ID der Tranche", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55671;
