// 44142.js  (UTILMD Gas) - Antwort auf Anfrage
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.12); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44142 = {
    pruefidentifikator: "44142",
    bezeichnung: "Antwort auf Anfrage",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZF4", t: "ZF4 - Nicht bila.rel. Anfrage an NB" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Soll", ahbExpr: "Soll [202] ∧ [336] · Muss [636]", rule: "AHB: Soll [202] ∧ [336]" },
        { id: "DTM_Z21", name: "SG4 DTM+Z21: Termin der Netznutzungsabrechnung", status: "Soll", ahbExpr: "Soll [202] ∧ [336]", rule: "AHB: Soll [202] ∧ [336]" },
        { id: "DTM_Z09", name: "SG4 DTM+Z09: Nächste Netznutzungsabrechnung", status: "Muss-bedingt", ahbExpr: "Muss [24] ∧ [230]", rule: "AHB: Muss [24] ∧ [230]" },
        { id: "DTM_Z22", name: "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB", status: "Soll", ahbExpr: "Soll [202] ∧ [336] · Codes: Z22 [504]", rule: "AHB: Soll [202] ∧ [336]" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID der Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_752", name: "SG4 DTM+752: Turnusablesung des NB", status: "Soll", ahbExpr: "Soll [336] ∧ [202]", rule: "AHB: Soll [336] ∧ [202]" },
        { id: "RFF_Z10", name: "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44142;
