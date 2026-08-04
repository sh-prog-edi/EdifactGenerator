// 44015.js  (UTILMD Gas, GeLi Gas) - Grund-/Ersatzversorgung – Ablehnung (LF an NB)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44015 = {
    pruefidentifikator: "44015",
    bezeichnung: "Grund-/Ersatzversorgung – Ablehnung (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [2061] ∧ [583]", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E06", t: "E06 - Ersatzbelieferung" }, { v: "Z02", t: "Z02 - Kündigung Lieferantenrahmenvertra g" }, { v: "Z36", t: "Z36 - EoG aus Ein-/Auszug (Umzug)" }, { v: "Z37", t: "Z37 - EoG wegen Einzug in Neuanlage" }, { v: "Z39", t: "Z39 - EoG aus vorübergehendem Anschluss" }, { v: "ZC6", t: "ZC6 - EoG aus Bilanzkreisschließung" }, { v: "ZC7", t: "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtigun g" }, { v: "ZT6", t: "ZT6 - EoG wegen Kündigung durch LF" }, { v: "ZT7", t: "ZT7 - EoG wegen Kündigung durch Kunde/LFN" }], ahbExpr: "Muss [2061] · Codes: E06 [502]", rule: "AHB: Muss [2061]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44015;
