// 44003.js  (UTILMD Gas, GeLi Gas) - Anmeldung – Ablehnung (NB an LF)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44003 = {
    pruefidentifikator: "44003",
    bezeichnung: "Anmeldung – Ablehnung (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [583] ∧ [362]", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_Z07", name: "SG4 DTM+Z07: Lieferbeginndatum in Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [36]", rule: "AHB: Muss [36]" },
        { id: "DTM_Z08", name: "SG4 DTM+Z08: Datum für nächste Bearbeitung", status: "Muss-bedingt", ahbExpr: "Muss [36]", rule: "AHB: Muss [36]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }, { v: "ZD2", t: "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44003;
