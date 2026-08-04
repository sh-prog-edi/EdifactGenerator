// 55553.js - Daten auf individuelle Bestellung (MSB an NB/LF/MSB)
// Segmentregeln für Prüf-ID 55553 (AHB Strom V2.2, 29.06.2026, Kap. 9.3.8).
// BGM E03/Z88, STS+7++ZY9 (Daten auf individuelle Bestellung); Bestellung referenziert über RFF+Z43.
// Details in _prozess-meta.js. Struktureller Kern (bestellbare Nutzdaten je Objektart = Vertiefung).
const ahbRules55553 = {
    pruefidentifikator: "55553",
    bezeichnung: "Daten auf individuelle Bestellung (MSB an NB/LF/MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "RFF_Z43", name: "SG6 RFF+Z43: Referenznummer des Vorgangs der individuellen Bestellung", status: "Muss", rule: "Referenz auf den bestellten Vorgang." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY9", t: "ZY9 - Daten auf individuelle Bestellung" }], rule: "AHB: Muss" },
        { id: "RFF_Z42", name: "SG6 RFF+Z42: Referenznummer der Nachricht der betroffenen Antwort auf Bestellung", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z49", name: "SG6 RFF+Z49: Verwendungszeitraum der Daten", status: "Muss-bedingt", ahbExpr: "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]", rule: "AHB: Muss [707] ∧ [534]" },
        { id: "DTM_Z25", name: "SG4 DTM+Z25: Verwendung der Daten ab", status: "Muss-bedingt", ahbExpr: "Muss [131] ⊻ [401]", rule: "AHB: Muss [131] ⊻ [401]" },
        { id: "DTM_Z26", name: "SG4 DTM+Z26: Verwendung der Daten bis", status: "Muss-bedingt", ahbExpr: "Muss [471]", rule: "AHB: Muss [471]" },
        { id: "RFF_VZ_QUALITAET", name: "SG6 RFF: Qualität Verwendungszeitraum 1", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]" },
        { id: "RFF_VZ_QUALITAET_2", name: "SG6 RFF: Qualität Verwendungszeitraum 2", status: "Kann", isSelect: true, options: [{ v: "", t: "– keine Angabe –" }, { v: "Z49", t: "Z49 – Gültige Daten" }, { v: "Z53", t: "Z53 – Keine Daten" }], rule: "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]" },
        { id: "DTM_Z25_2", name: "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]" },
        { id: "DTM_Z26_2", name: "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)", status: "Kann", isDate: true, rule: "AHB: zweiter Verwendungszeitraum [471]" },
        { id: "RFF_Z14", name: "SG6 RFF+Z14: Referenz auf die Gerätenummer", status: "Muss-bedingt", ahbExpr: "Muss [665]", rule: "AHB: Muss [665]" },
        { id: "RFF_AGK", name: "SG6 RFF+AGK: Konfigurations-ID", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55553;
