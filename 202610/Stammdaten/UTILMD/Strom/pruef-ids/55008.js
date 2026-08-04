// 55008.js - Bestätigung Abmeldung durch NB (LF an NB)
// Segmentregeln für Prüf-ID 55008 (AHB Strom, Version 2.2, 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55008 = {
    pruefidentifikator: "55008",
    bezeichnung: "Bestätigung Abmeldung durch NB (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende (Ende zum)", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0609)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "DTM_206", name: "SG4 DTM+206: Geräteausbaudatum", status: "Muss-bedingt", ahbExpr: "Muss [79]", rule: "AHB: Muss [79]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "ZQ7", t: "ZQ7 - Abmeldung wg. fehl. Zuordnungsermächtig ung" }, { v: "ZT0", t: "ZT0 - Abmeldung wegen fehl. Zuordnungsermächtig ung aufgrund Änderung ZRT" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55008;
