// 55052.js - Bestätigung Beendigung des Messstellenbetriebs (NB an MSB)
// Segmentregeln für Prüf-ID 55052 (AHB Strom S2.1, Stand 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55052 = {
    pruefidentifikator: "55052",
    bezeichnung: "Bestätigung Beendigung des Messstellenbetriebs (NB an MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E02 Abmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss-bedingt", ahbExpr: "Muss [7] ∧ [577]", rule: "AHB: Muss [7] ∧ [577]" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum", status: "Muss-bedingt", ahbExpr: "Muss [11] ∧ [157] ∧ [313] Soll [326] ∧ [312]", abhaengig: {"feld": "STS_7", "code": "ZZB", "negiert": true, "bedingung": "157"}, rule: "AHB: Muss [11] ∧ [157] ∧ [313] Soll [326] ∧ [312]" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZZB", t: "ZZB - Stilllegung incl. Stilllegung MaLo" }, { v: "ZZC", t: "ZZC - Stilllegung excl. Stilllegung MaLo" }], ahbExpr: "Codes: ZZB [17P0..1], ZZC [17P0..1]", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }], ahbExpr: "Codes: ZZB [17P0..1], ZZC [17P0..1]", rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Soll", ahbExpr: "Soll [46] ∧ [653]", rule: "AHB: Soll [46] ∧ [653]" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Soll", ahbExpr: "Soll [166] ∧ [653]", rule: "AHB: Soll [166] ∧ [653]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46]", rule: "AHB: Soll [46]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46]", rule: "AHB: Soll [46]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Soll", ahbExpr: "Soll [166] ∧ [653]", rule: "AHB: Soll [166] ∧ [653]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55052;
