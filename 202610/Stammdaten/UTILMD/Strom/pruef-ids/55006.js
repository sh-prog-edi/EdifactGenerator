// 55006.js - Ablehnung Abmeldung verbrauchende MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55006 (AHB Strom, Version 2.2, 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55006 = {
    pruefidentifikator: "55006",
    bezeichnung: "Ablehnung Abmeldung verbrauchende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0607)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "Z33", t: "Z33 - Auszug wegen Stilllegung" }, { v: "Z41", t: "Z41 - Ende der ESV ohne Folgelieferung" }, { v: "ZG9", t: "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden" }, { v: "ZH1", t: "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung" }, { v: "ZH2", t: "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis" }, { v: "ZT4", t: "ZT4 - Ende wegen Kündigung durch LF" }, { v: "ZT5", t: "ZT5 - Ende wegen Kündigung durch Kunde/LFN" }, { v: "ZZD", t: "ZZD - Übergangsversorgung" }], ahbExpr: "Codes: ZZD [686]", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55006;
