// 55043.js - Bestätigung Anmeldung des Messstellenbetriebs (NB an MSB)
// Segmentregeln für Prüf-ID 55043 (AHB Strom V2.2, 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55043 = {
    pruefidentifikator: "55043",
    bezeichnung: "Bestätigung Anmeldung des Messstellenbetriebs (NB an MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01 Anmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss [675]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "DTM_76", name: "SG4 DTM+76: Datum zum geplanten Leistungsbeginn", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }, { v: "ZJ4", t: "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau" }], rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Bedingt", ahbExpr: "[670]", rule: "AHB: [670]" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [671]", rule: "AHB: Muss [671]" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Soll", ahbExpr: "Soll [2003]", rule: "AHB: Soll [2003]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [672] ∧ [694] ∧ [698]", rule: "AHB: Soll [46] ∧ [672] ∧ [694] ∧ [698]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [673]", rule: "AHB: Soll [46] ∧ [673]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Soll", ahbExpr: "Soll [166] ∧ [674]", rule: "AHB: Soll [166] ∧ [674]" },
        { id: "RFF_Z50", name: "SG6 RFF+Z50: Termine der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_752", name: "SG4 DTM+752: Turnusablesung des MSB", status: "Muss-bedingt", ahbExpr: "Muss [78] ∧ [234] ∧ [618]", rule: "AHB: Muss [78] ∧ [234] ∧ [618]" },
        { id: "RFF_Z31", name: "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Netzlokation", status: "Soll", ahbExpr: "Soll [166] ∧ [700]", rule: "AHB: Soll [166] ∧ [700]" },
        { id: "RFF_Z33", name: "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur", status: "Muss-bedingt", ahbExpr: "Muss [2312]", rule: "AHB: Muss [2312]" },
        { id: "RFF_Z34", name: "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation", status: "Muss-bedingt", ahbExpr: "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])", rule: "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])" },
        { id: "RFF_Z16", name: "SG6 RFF+Z16: Referenz auf die Marktlokation der Tranche", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z20", name: "SG6 RFF+Z20: Referenz auf die der Technischen Ressource zugeordneten Tranche", status: "Soll", ahbExpr: "Soll [166] ∧ [447] ∧ [701]", rule: "AHB: Soll [166] ∧ [447] ∧ [701]" },
        { id: "RFF_Z37", name: "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z14", name: "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AGK", name: "SG6 RFF+AGK: Konfigurations-ID", status: "Muss-bedingt", ahbExpr: "Muss [402] ∧ [420]", rule: "AHB: Muss [402] ∧ [420]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55043;
