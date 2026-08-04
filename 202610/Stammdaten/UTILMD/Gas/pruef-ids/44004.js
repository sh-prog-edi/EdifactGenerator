// 44004.js  (UTILMD Gas, GeLi Gas) - Abmeldung durch LF (LF an NB)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44004 = {
    pruefidentifikator: "44004",
    bezeichnung: "Abmeldung durch LF (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss", ahbExpr: "Muss [11]" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [583]", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss-bedingt", ahbExpr: "Muss [7] ∧ [577]", rule: "AHB: Muss [7] ∧ [577]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "Z41", t: "Z41 - Ende der ESV ohne Folgelieferung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }, { v: "ZT4", t: "ZT4 - Ende wegen Kündigung durch LF" }, { v: "ZT5", t: "ZT5 - Ende wegen Kündigung durch Kunde/LFN" }, { v: "ZZD", t: "ZZD - Übergangsversorgung" }], ahbExpr: "Muss [2061] · Codes: Z41 [510], ZZD [511]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44004;
