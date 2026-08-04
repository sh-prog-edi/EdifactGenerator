// 44035.js  (UTILMD Gas) - Antwort auf die Geschäftsdatenanfrage (durch LF)
// Geschäftsdatenanfrage-Antwort (Informationsmeldung, BGM Z14, STS+7++Z40); kein STS+E01. Kap. 5.13.
const ahbRules44035 = {
    pruefidentifikator: "44035",
    bezeichnung: "Antwort auf die Geschäftsdatenanfrage (durch LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (Z14 Geschäftsdaten)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_172", name: "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)", status: "Muss", ahbExpr: "Muss [527]" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss-bedingt", isSelect: true, options: [{ v: "Z40", t: "Z40 - Geschäftsdatenanfrage" }], ahbExpr: "Muss [2061]", rule: "AHB: Muss [2061]" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z18", name: "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation", status: "Muss", ahbExpr: "Muss [636]", rule: "AHB: Muss" },
        { id: "DTM_155", name: "SG4 DTM+155: Start des Abrechnungsjahrs bei Marktlokationen mit Jahresleistungspreis", status: "Muss-bedingt", ahbExpr: "Muss [19]", rule: "AHB: Muss [19]" },
        { id: "DTM_Z21", name: "SG4 DTM+Z21: Termin der Netznutzungsabrechnung", status: "Muss", rule: "AHB: Muss" },
        { id: "DTM_Z22", name: "SG4 DTM+Z22: Netznutzungsabrechnungsi ntervall des NB", status: "Muss", ahbExpr: "Codes: Z22 [504]", rule: "AHB: Muss" },
        { id: "RFF_Z10", name: "SG6 RFF+Z10: Referenz auf die OBIS- Kennzahl der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_AVC", name: "SG6 RFF+AVC: Kundennummer beim Lieferanten", status: "Kann", rule: "AHB: Kann" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules44035;
