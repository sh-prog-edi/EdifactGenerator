// 44043.js  (UTILMD Gas) - Bestätigung Anmeldung MSB
// Segmentregeln je Prüf-ID (AHB Gas, Kap. 6.2); BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44043 = {
    pruefidentifikator: "44043",
    bezeichnung: "Bestätigung Anmeldung MSB",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zuordnung der Vorgangsnummer aus der Anfrage." },
        { id: "DTM_76", name: "SG4 DTM+76: Datum zum geplanten Leistungsbeginn", status: "Muss", rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E02", t: "E02 - Einzug in Neuanlage" }, { v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_752", name: "SG4 DTM+752: Turnusablesung des NB", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44043;
