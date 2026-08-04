// 55015.js - Ablehnung EoG-Anmeldung (LF an NB)
// Segmentregeln für Prüf-ID 55015 (AHB Strom, Version 2.2, 29.06.2026).
// Muss-Segmente + wichtigste bedingte Segmente des Anwendungsfalls. Die BGM-/STS-/EBD-
// Details liefert _prozess-meta.js; hier stehen die Formularfelder.
const ahbRules55015 = {
    pruefidentifikator: "55015",
    bezeichnung: "Ablehnung EoG-Anmeldung (LF an NB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }], ahbExpr: "Codes: E06 [580], ZZD [681], E01 [9P0..1], E03 [9P0..1]" },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0615)", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Muss bei A99 Sonstiges)", status: "Bedingt", rule: "[48] Muss bei STS+E01++A99." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E06", t: "E06 - Ersatzbelieferung" }, { v: "Z02", t: "Z02 - Kündigung Lieferantenrahmenver trag" }, { v: "Z36", t: "Z36 - EoG aus Ein-/Auszug (Umzug)" }, { v: "Z37", t: "Z37 - EoG wegen Einzug in Neuanlage" }, { v: "Z39", t: "Z39 - EoG aus vorübergehendem Anschluss" }, { v: "ZC6", t: "ZC6 - EoG aus Bilanzkreisschließung" }, { v: "ZC7", t: "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtig ung" }, { v: "ZT6", t: "ZT6 - EoG wegen Kündigung durch LF" }, { v: "ZT7", t: "ZT7 - EoG wegen Kündigung durch Kunde/LFN" }, { v: "ZZD", t: "ZZD - Übergangsversorgung" }], ahbExpr: "Codes: E06 [580], ZZD [681], E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" },
        { id: "STS_7_befristet", name: "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung", status: "Muss", isSelect: true, options: [{ v: "E01", t: "E01 - Ein-/Auszug (Umzug)" }, { v: "E03", t: "E03 - Wechsel" }], ahbExpr: "Codes: E06 [580], ZZD [681], E01 [9P0..1], E03 [9P0..1]", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55015;
