// 44112.js  (UTILMD Gas) - Nicht bila.rel. Änderung vom NB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 5.10); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44112 = {
    pruefidentifikator: "44112",
    bezeichnung: "Nicht bila.rel. Änderung vom NB",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss ([32] ∧ [2061] ∧ [651]) ⊻ ([200] ∧ [601])" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "ZE7", t: "ZE7 - Nicht bila.rel. Änderung vom NB" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Soll", ahbExpr: "Soll [25] ∧ [92] · Muss [636]", rule: "AHB: Soll [25] ∧ [92]" },
        { id: "DTM_Z21", name: "SG4 DTM+Z21: Termin der Netznutzungsabrechnung", status: "Soll", ahbExpr: "Soll [92]", rule: "AHB: Soll [92]" },
        { id: "DTM_Z09", name: "SG4 DTM+Z09: Nächste Netznutzungsabrechnung", status: "Muss-bedingt", ahbExpr: "Muss [24] ∧ [230]", rule: "AHB: Muss [24] ∧ [230]" },
        { id: "DTM_Z22", name: "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB", status: "Soll", ahbExpr: "Soll [92] · Codes: Z22 [504]", rule: "AHB: Soll [92]" },
        { id: "RFF_Z10", name: "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID der Messlokation", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44112;
