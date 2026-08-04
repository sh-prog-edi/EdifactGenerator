// 44022.js  (UTILMD Gas, GeLi Gas) - Anfrage nach Stornierung
// Segmentregeln für Prüf-ID 44022 (AHB Gas G1.1, Fehlerkorrektur 29.06.2026).
// Korrigiert nach AHB-Abgleich: LOC+172 existiert im AHB nicht; der Anwendungsfall
// referenziert den zu stornierenden Vorgang über SG6 RFF+TN/RFF+ACW und trägt den
// Transaktionsgrund in SG4 STS+7 (E05 Stornierung). BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44022 = {
    pruefidentifikator: "44022",
    bezeichnung: "Anfrage nach Stornierung",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01/E02/E35 je Ursprungsprozess)", status: "Muss-bedingt", bedingungen: ["500"], rule: "Muss [500]" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "SG2 NAD+MS: MP-ID Absender (Qualifikator 9/332)", status: "Muss" },
        { id: "NAD_MR", name: "SG2 NAD+MR: MP-ID Empfänger (Qualifikator 9/332)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort", status: "Muss-bedingt", bedingungen: ["249"], rule: "Muss [249]" },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "RFF_Z13", name: "SG6 RFF+Z13: Prüfidentifikator (44022)", status: "Muss" },
        { id: "RFF_ACW", name: "SG6 RFF+ACW: Referenznummer der vorangegangenen Nachricht", status: "Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E05", t: "E05 - Stornierung" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44022;
