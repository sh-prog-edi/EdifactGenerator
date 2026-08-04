// 44001.js  (UTILMD Gas, GeLi Gas) - Anmeldung durch LF (LF an NB)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44001 = {
    pruefidentifikator: "44001",
    bezeichnung: "Anmeldung durch LF (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)", status: "Bedingt", ahbExpr: "Muss [10]", rule: "[10] Muss bei befristeter Anmeldung (STS+Z17)." },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [328] ∧ [583] Soll [333] ∧ [165] ∧ [2061] ∧ ([583] ∨ [584])", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }, { v: "ZD2", t: "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Muss", ahbExpr: "Muss [636]", rule: "AHB: Muss" },
        { id: "DTM_Z20", name: "SG4 DTM+Z20: Abrechnungsintervall des LF", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AVC", name: "SG6 RFF+AVC: Kundennummer beim Lieferanten", status: "Kann", rule: "AHB: Kann" },
        { id: "RFF_Z01", name: "SG6 RFF+Z01: Kundennummer beim Altlieferant", status: "Soll", ahbExpr: "Soll [165]", rule: "AHB: Soll [165]" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Kann", rule: "AHB: Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44001;
