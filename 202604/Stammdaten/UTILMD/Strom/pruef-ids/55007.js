// 55007.js - Abmeldung durch NB an LF (Auszug wegen Stilllegung)
// Segmentregeln für Prüf-ID 55007 (AHB Strom S2.1, konsolidierte Lesefassung Stand 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55007 = {
    pruefidentifikator: "55007",
    bezeichnung: "Abmeldung durch NB an LF (Auszug wegen Stilllegung)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }, { v: "ZAP", t: "ZAP - ruhende Marktlokation" }] },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ ([479] ⊻ [480])", bedingungen: ["2061", "479", "480"], rule: "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation." },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: ID der Tranche", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [481]", bedingungen: ["2061", "481"], abhaengig: {"feld": "STS_7", "code": "ZW5", "negiert": false, "bedingung": "481"}, rule: "Muss bei Tranche (STS-Ergänzung ZW5)." },
        { id: "DTM_206", name: "SG4 DTM+206: Geräteausbaudatum", status: "Muss-bedingt", ahbExpr: "Muss [79] ∧ [313]", rule: "AHB: Muss [79] ∧ [313]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "ZQ7", t: "ZQ7 - Abmeldung wg. fehl. Zuordnungsermächtigung" }, { v: "ZT0", t: "ZT0 - Abmeldung wegen fehl. Zuordnungsermächtigung aufgrund Änderung ZRT" }], rule: "AHB: Muss" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [96]", abhaengig: {"feld": "STS_7", "code": "ZAP", "negiert": false, "bedingung": "96"}, rule: "AHB: Muss [2061] ∧ [96]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55007;
