// 55022.js - Anfrage nach Stornierung (Beteiligte aus Ursprungsnachricht)
// Segmentregeln für Prüf-ID 55022 (AHB Strom S2.1, Stand 29.06.2026, Kap. 9.6 Stornierungsmeldung).
// BGM E01/E02/E35 (Kategorie der Ursprungsmeldung), STS+7++E05 (Stornierung); Referenz via RFF+ACW.
// Details in _prozess-meta.js.
const ahbRules55022 = {
    pruefidentifikator: "55022",
    bezeichnung: "Anfrage nach Stornierung (Beteiligte aus Ursprungsnachricht)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01/E02/E35 - Kategorie der zu stornierenden Meldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "RFF_ACW", name: "SG6 RFF+ACW: Referenznummer der zu stornierenden Ursprungsnachricht", status: "Muss", rule: "Referenz auf die vorangegangene (zu stornierende) Meldung." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E05", t: "E05 - Stornierung" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55022;
