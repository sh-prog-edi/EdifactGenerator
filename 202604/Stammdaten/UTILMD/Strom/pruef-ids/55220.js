// 55220.js - Rückmeldung Netznutzungsabrechnung (LF an NB)
// Kern-Segmentregeln für Prüf-ID 55220 (AHB Strom S2.1, Abrechnungsdaten).
// BGM E03, Transaktionsgrund/EBD in _prozess-meta.js; SG8 SEQ+Z45/PIA/QTY erzeugt der Generator.
const ahbRules55220 = {
    pruefidentifikator: "55220",
    bezeichnung: "Rückmeldung Netznutzungsabrechnung (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Rückmeldung (EBD E_0610)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung", status: "Muss", rule: "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZX4", t: "ZX4 - Abrechnungsdaten NNA" }], rule: "AHB: Muss" },
        { id: "RFF_Z47", name: "SG6 RFF+Z47: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]", rule: "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [134] ⊻ [135]", rule: "AHB: Muss [131] ⊻ [134] ⊻ [135]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [472] ⊻ [473]", rule: "AHB: Muss [472] ⊻ [473]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z47", t: "Z47 – Im System vorhandene Daten" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z54", t: "Z54 – Im System keine Daten vorhanden" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z47", t: "Z47 – Im System vorhandene Daten" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z54", t: "Z54 – Im System keine Daten vorhanden" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z51", name: "SG6 RFF+Z51: Termine der Marktlokation", status: "Soll", ahbExpr: "Soll [8] · Codes: Z51 [2P0..n], Z52 [3P0..n]", rule: "AHB: Soll [8]" },
        { id: "DTM_Z21", name: "SG4 DTM+Z21: Termin der Netznutzungsabrechnung", status: "Soll", ahbExpr: "Soll [8]", rule: "AHB: Soll [8]" },
        { id: "DTM_Z09", name: "SG4 DTM+Z09: Nächste Netznutzungsabrechnung", status: "Soll", ahbExpr: "Soll [8]", rule: "AHB: Soll [8]" },
        { id: "DTM_Z22", name: "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB", status: "Soll", ahbExpr: "Soll [8]", rule: "AHB: Soll [8]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55220;
