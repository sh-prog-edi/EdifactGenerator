// 55042.js - Anfrage Anmeldung des Messstellenbetriebs (MSB an NB)
// Segmentregeln für Prüf-ID 55042 (AHB Strom S2.1, Stand 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55042 = {
    pruefidentifikator: "55042",
    bezeichnung: "Anfrage Anmeldung des Messstellenbetriebs (MSB an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01 Anmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss ([77] ∧ [78]) ∧ [347] ∧ [2061] Kann [2061]" },
        { id: "DTM_76", name: "SG4 DTM+76: Datum zum geplanten Leistungsbeginn", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }, { v: "ZJ4", t: "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau" }], rule: "AHB: Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss ([77] ∧ [78]) ∧ [349] Kann", rule: "AHB: Muss ([77] ∧ [78]) ∧ [349] Kann" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Kann", rule: "AHB: Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55042;
