// 55075.js - Stammdaten aufgrund einer Änderung
// Segmentregeln für Prüf-ID 55075 (AHB Strom S2.1, Stand 29.06.2026, Kap. 11.3).
// BGM/STS/EBD liefert _prozess-meta.js. Struktureller Kern (Listen-/Zeitreihen-Nutzdaten = Vertiefung).
const ahbRules55075 = {
    pruefidentifikator: "55075",
    bezeichnung: "Stammdaten aufgrund einer Änderung",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "DTM_157", name: "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }, { v: "ZE3", t: "ZE3 - Stammdatenänderung" }], rule: "AHB: Muss" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Soll", ahbExpr: "Soll [166] ∧ [601]", rule: "AHB: Soll [166] ∧ [601]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss [601]", rule: "AHB: Muss [601]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID einer Marktlokation / Tranche", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z20", name: "SG6 RFF+Z20: Referenz auf die ID einer Tranche", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z14", name: "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AGK", name: "SG6 RFF+AGK: Konfigurations-ID", status: "Muss-bedingt", ahbExpr: "Muss [402] ∧ [420]", rule: "AHB: Muss [402] ∧ [420]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55075;
