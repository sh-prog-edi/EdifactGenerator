// 55633.js - Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (MSB an NB)
// Segmentregeln für Prüf-ID 55633 (AHB Strom V2.2, 29.06.2026, Stammdatenänderung).
// BGM/STS+7-Transaktionsgrund/EBD liefert _prozess-meta.js. Struktureller Kern:
// Rahmen + STS+7++<ZXn> + LOC (Objekt) + STS+E01/EBD + RFF+TN. Die konkrete geänderte
// Stammdaten-Nutzdatenmatrix (SG8/SG10 CCI/CAV je Objektart) ist Vertiefungsschritt (siehe docs/STROM_STATUS.md).
const ahbRules55633 = {
    pruefidentifikator: "55633",
    bezeichnung: "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (MSB an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)", status: "Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: ID der Netzlokation", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZX8", t: "ZX8 - Änderung Daten der NeLo" }], rule: "AHB: Muss" },
        { id: "RFF_Z47", name: "SG6 RFF+Z47: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]", rule: "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [134] ⊻ [135]", rule: "AHB: Muss [131] ⊻ [134] ⊻ [135]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [472] ⊻ [473]", rule: "AHB: Muss [472] ⊻ [473]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z47", t: "Z47 – Im System vorhandene Daten" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z54", t: "Z54 – Im System keine Daten vorhanden" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z47", t: "Z47 – Im System vorhandene Daten" }, { v: "Z48", t: "Z48 – Erwartete Daten" }, { v: "Z54", t: "Z54 – Im System keine Daten vorhanden" }, { v: "Z55", t: "Z55 – Keine Daten erwartet" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55633;
