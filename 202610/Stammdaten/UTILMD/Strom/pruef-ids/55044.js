// 55044.js - Ablehnung Anmeldung des Messstellenbetriebs (NB an MSB)
// Segmentregeln für Prüf-ID 55044 (AHB Strom V2.2, 29.06.2026, Kap. 10 Messstellenbetrieb / WiM).
// BGM/STS+7-Grund/EBD liefert _prozess-meta.js. Struktureller Kern (Zähleinrichtungs-/Geräte-Nutzdaten = Vertiefung).
const ahbRules55044 = {
    pruefidentifikator: "55044",
    bezeichnung: "Ablehnung Anmeldung des Messstellenbetriebs (NB an MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E01 Anmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)", status: "Muss" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)", status: "Muss", ahbExpr: "Muss [253] ∧ [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }, { v: "ZJ4", t: "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55044;
