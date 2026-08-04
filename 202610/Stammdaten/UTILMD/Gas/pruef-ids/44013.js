// 44013.js  (UTILMD Gas, GeLi Gas) - Anmeldung Grund-/Ersatzversorgung (NB an LF)
// Segmentregeln je Prüf-ID; BGM/STS/EBD-Details in _prozess-meta.js.
const ahbRules44013 = {
    pruefidentifikator: "44013",
    bezeichnung: "Anmeldung Grund-/Ersatzversorgung (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_92", name: "SG4 DTM+92: Beginn zum", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)", status: "Bedingt", ahbExpr: "Muss [10]", rule: "[10] Muss bei befristeter Anmeldung (STS+Z17)." },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)", status: "Muss-bedingt", ahbExpr: "Muss [527]", bedingungen: ["2061", "2284", "138"], rule: "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Kann" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss-bedingt", ahbExpr: "Muss [18] Soll [28] ∧ [29]", rule: "AHB: Muss [18] Soll [28] ∧ [29]" },
        { id: "DTM_159", name: "SG4 DTM+159: Bilanzierungsende", status: "Muss-bedingt", ahbExpr: "Muss [28] ∧ [64]", rule: "AHB: Muss [28] ∧ [64]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "E06", t: "E06 - Ersatzbelieferung" }, { v: "Z02", t: "Z02 - Kündigung Lieferantenrahmenvertrag" }, { v: "Z36", t: "Z36 - EoG aus Ein-/Auszug (Umzug)" }, { v: "Z37", t: "Z37 - EoG wegen Einzug in Neuanlage" }, { v: "Z39", t: "Z39 - EoG aus vorübergehendem Anschluss" }, { v: "ZC6", t: "ZC6 - EoG aus Bilanzkreisschließung" }, { v: "ZC7", t: "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtigung" }, { v: "ZT6", t: "ZT6 - EoG wegen Kündigung durch LF" }, { v: "ZT7", t: "ZT7 - EoG wegen Kündigung durch Kunde/LFN" }, { v: "ZZD", t: "ZZD - Übergangsversorgung" }], ahbExpr: "Muss [2061] · Codes: E06 [502], ZZD [505]", rule: "AHB: Muss [2061]" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Muss", ahbExpr: "Muss [636]", rule: "AHB: Muss" },
        { id: "DTM_Z21", name: "SG4 DTM+Z21: Termin der Netznutzungsabrechnung", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_Z09", name: "SG4 DTM+Z09: Nächste Netznutzungsabrechnung", status: "Muss-bedingt", ahbExpr: "Muss [230]", rule: "AHB: Muss [230]" },
        { id: "DTM_Z22", name: "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB", status: "Muss", ahbExpr: "Codes: Z22 [504]", rule: "AHB: Muss" },
        { id: "RFF_Z10", name: "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44013;
