// 55672.js - Bilanzkreisabrechnung erzeugende MaLo (NB an LF)
// Kern-Segmentregeln für Prüf-ID 55672 (AHB Strom S2.1, Abrechnungsdaten).
// BGM E03, Transaktionsgrund/EBD in _prozess-meta.js; SG8 SEQ+Z45/PIA/QTY erzeugt der Generator.
const ahbRules55672 = {
    pruefidentifikator: "55672",
    bezeichnung: "Bilanzkreisabrechnung erzeugende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]", abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": true, "bedingung": "481"} },
        { id: "DTM_Z25", name: "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)", status: "Muss", ahbExpr: "Muss ([131] ∧ [146]) ⊻ ([132] ∧ [145]) ⊻ [401]" },
        { id: "DTM_Z26", name: "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)", status: "Muss", ahbExpr: "Muss [471]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }], ahbExpr: "Codes: ZAO [715]", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZX2", t: "ZX2 - Abrechnungsdaten BK-Abrechnung erzeugender Malo" }, { v: "ZAO", t: "ZAO - Korrektur Abrechnungsdaten BK-Abrechnung erzeugender MaLo" }], ahbExpr: "Codes: ZAO [715]", rule: "AHB: Muss" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [481]", abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": false, "bedingung": "481"}, rule: "AHB: Muss [2061] ∧ [481]" },
        { id: "RFF_Z49", name: "SG6 RFF+Z49: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]", rule: "AHB: Muss [707] ∧ [534]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55672;
