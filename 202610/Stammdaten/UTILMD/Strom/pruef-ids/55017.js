// 55017.js - Bestätigung Kündigung (LFA an LFN)
// Segmentregeln exakt für diese Prüf-ID (Antwortnachricht, Zustimmungsfall).
const ahbRules55017 = {
    pruefidentifikator: "55017",
    bezeichnung: "Bestätigung Kündigung (LFA an LFN)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E35 Kündigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_93", name: "SG4 DTM+93: Datum Vertragsende", status: "Bedingt", ahbExpr: "Muss [12] ∧ [357] ∧ [704]", rule: "[12] Muss, wenn DTM+471 fehlt." },
        { id: "DTM_471", name: "SG4 DTM+471: Ende zum nächstmöglichen Termin", status: "Bedingt", ahbExpr: "Muss [18] ∧ [513] ∧ [704]", rule: "[18] Muss, wenn DTM+93 fehlt." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW3", t: "ZW3 - Erzeugende Marktlokation" }, { v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZW5", t: "ZW5 - Tranche" }] },
        { id: "STS_E01", name: "SG4 STS+E01: Status der Antwort", status: "Muss" },
        { id: "RFF_TN", name: "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht", status: "Muss", rule: "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage." },
        { id: "FTX", name: "SG4 FTX+ACB: Bemerkung (Hinweistext)", status: "Bedingt", rule: "[83] Muss bei Antwortstatus mit Klärungsbedarf." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "E03", t: "E03 - Wechsel" }], rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55017;
