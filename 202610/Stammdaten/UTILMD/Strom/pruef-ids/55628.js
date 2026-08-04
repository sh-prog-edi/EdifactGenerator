// 55628.js - Änderung Daten der Marktlokation (MaLo) (NB an MSB)
// Segmentregeln für Prüf-ID 55628 (AHB Strom V2.2, 29.06.2026, Stammdatenänderung).
// BGM/STS+7-Transaktionsgrund/EBD liefert _prozess-meta.js. Struktureller Kern:
// Rahmen + STS+7++<ZXn> + LOC (Objekt) . Die konkrete geänderte
// Stammdaten-Nutzdatenmatrix (SG8/SG10 CCI/CAV je Objektart) ist Vertiefungsschritt (siehe docs/STROM_STATUS.md).
const ahbRules55628 = {
    pruefidentifikator: "55628",
    bezeichnung: "Änderung Daten der Marktlokation (MaLo) (NB an MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }], rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZX6", t: "ZX6 - Änderung Daten der MaLo" }], rule: "AHB: Muss" },
        { id: "RFF_Z49", name: "SG6 RFF+Z49: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]", rule: "AHB: Muss [707] ∧ [534]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [401]", rule: "AHB: Muss [131] ⊻ [401]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [471]", rule: "AHB: Muss [471]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z46", name: "SG6 RFF+Z46: Referenz auf Zeitraum. ID", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55628;
