// APERAK_Anerkennungsmeldung.js - Anerkennungsmeldung
// Segmentregeln für Prüf-ID APERAK_Anerkennungsmeldung (APERAK AHB 1.0 (Stand 30.09.2025), Formatstand 202610).
// AUTOMATISCH aus dem AHB generiert (neues BDEW-Tabellenlayout); Quelle: AHB_APERAK_1.0_20251001_20260930_20250930_xoxx_11886.docx.
// Vollständige Segmentliste des Anwendungsfalls; Kuratierung (Formularauswahl,
// isSelect-Optionen, Prozess-Meta) kann wie bei UTILMD Strom nachgezogen werden.
const ahbRulesAPERAK_Anerkennungsmeldung = {
    pruefidentifikator: "APERAK_Anerkennungsmeldung",
    bezeichnung: "Anerkennungsmeldung",
    segments: [
        { id: "UNH", name: "UNH+D: Entwurfs-Version", status: "Muss" },
        { id: "BGM", name: "BGM+312: Anerkennungsmeldung", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/", status: "Muss" },
        { id: "UNT", name: "UNT: Nachrichten-Endesegment", status: "Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRulesAPERAK_Anerkennungsmeldung;
