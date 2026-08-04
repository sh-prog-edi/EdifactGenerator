// APERAK_Fehlermeldung.js - Fehlermeldung
// Segmentregeln für Prüf-ID APERAK_Fehlermeldung (APERAK AHB 1.1, Formatstand 202610).
// AUTOMATISCH aus dem AHB generiert (neues BDEW-Tabellenlayout); Quelle: AHB_APERAK_12148.docx.
// Vollständige Segmentliste des Anwendungsfalls; Kuratierung (Formularauswahl,
// isSelect-Optionen, Prozess-Meta) kann wie bei UTILMD Strom nachgezogen werden.
const ahbRulesAPERAK_Fehlermeldung = {
    pruefidentifikator: "APERAK_Fehlermeldung",
    bezeichnung: "Fehlermeldung",
    segments: [
        { id: "UNH", name: "UNH+D: X", status: "Muss" },
        { id: "BGM", name: "BGM+312: Anerkennungsmeldung", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: X", status: "Muss" },
        { id: "RFF_ACE", name: "SG2 RFF+ACE: X", status: "Muss" },
        { id: "DTM_171", name: "SG2 DTM+171: X", status: "Muss" },
        { id: "NAD_MS", name: "SG3 NAD+MS: X", status: "Muss" },
        { id: "NAD_MR", name: "SG3 NAD+MR: X", status: "Muss" },
        { id: "ERC_Z10", name: "SG4 ERC+Z10: X [500]", status: "Muss" },
        { id: "FTX_ABO", name: "SG4 FTX+ABO: X", status: "Bedingt", rule: "Soll [2]", bedingungen: ["2"] },
        { id: "RFF_ACW", name: "SG5 RFF+ACW: X", status: "Muss" },
        { id: "RFF_AGO", name: "SG5 RFF+AGO: X", status: "Muss" },
        { id: "FTX_AAO", name: "SG5 FTX+AAO: X", status: "Bedingt", rule: "Soll [3] ∧ [4]", bedingungen: ["3", "4"] },
        { id: "FTX_Z02", name: "SG5 FTX+Z02: X", status: "Muss-bedingt", rule: "Muss [4] ∧ ([5] ∨ [9] ∨ [10] ∨ [11] ∨ [12] ∨ [13])", bedingungen: ["4", "5", "9", "10", "11", "12", "13"] },
        { id: "RFF_TN", name: "SG5 RFF+TN: X", status: "Muss" },
        { id: "FTX_AAO_2", name: "SG5 FTX+AAO: X", status: "Kann" },
        { id: "FTX_Z02_2", name: "SG5 FTX+Z02: X", status: "Muss-bedingt", rule: "Muss [5] ∨ [7] ∨ [9] ∨ [10] ∨ [11] ∨ [12] ∨ [13]", bedingungen: ["5", "7", "9", "10", "11", "12", "13"] },
        { id: "RFF_Z08", name: "SG5 RFF+Z08: X", status: "Muss" },
        { id: "UNT", name: "UNT: Nachrichten-Endesegment", status: "Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRulesAPERAK_Fehlermeldung;
