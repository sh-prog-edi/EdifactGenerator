// 55617.js - Änderung Daten der Technische Ressource (TR) (NB an LF)
// Segmentregeln für Prüf-ID 55617 (AHB Strom S2.1, Stand 29.06.2026, Stammdatenänderung).
// BGM/STS+7-Transaktionsgrund/EBD liefert _prozess-meta.js. Struktureller Kern:
// Rahmen + STS+7++<ZXn> + LOC (Objekt) . Die konkrete geänderte
// Stammdaten-Nutzdatenmatrix (SG8/SG10 CCI/CAV je Objektart) ist Vertiefungsschritt (siehe docs/STROM_STATUS.md).
const ahbRules55617 = {
    pruefidentifikator: "55617",
    bezeichnung: "Änderung Daten der Technische Ressource (TR) (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: ID der Technischen Ressource", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY0", t: "ZY0 - Änderung Daten der TR" }], rule: "AHB: Muss" },
        { id: "RFF_Z49", name: "SG6 RFF+Z49: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]", rule: "AHB: Muss [707] ∧ [534]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [401]", rule: "AHB: Muss [131] ⊻ [401]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [471]", rule: "AHB: Muss [471]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die der Technischen Ressource zugeordneten Steuerbaren Ressource", status: "Soll", ahbExpr: "Soll [166] ∧ [699]", rule: "AHB: Soll [166] ∧ [699]" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation", status: "Soll", ahbExpr: "Soll [166] ∧ [700]", rule: "AHB: Soll [166] ∧ [700]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55617;
