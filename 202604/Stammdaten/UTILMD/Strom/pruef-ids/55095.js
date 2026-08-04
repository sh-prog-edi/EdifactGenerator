// 55095.js - Antwort auf Geschäftsdatenanfrage erzeugende MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55095 (AHB Strom S2.1, Stand 29.06.2026, Kap. 9.5 Geschäftsdatenanfrage).
// "Antwort auf GDA": BGM E44 (Informationsmeldung), STS+7++ZY6, Referenz auf die Anfrage via RFF+AAV.
// Details in _prozess-meta.js. Struktureller Kern (Nutzdatenmatrix je Objektart = Vertiefung).
const ahbRules55095 = {
    pruefidentifikator: "55095",
    bezeichnung: "Antwort auf Geschäftsdatenanfrage erzeugende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E44 Informationsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation (Objekt der Anfrage)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)", status: "Muss", rule: "Referenz auf die ursprüngliche Geschäftsdatenanfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY6", t: "ZY6 - Antwort auf GDA erzeugende MaLo" }], rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Soll", ahbExpr: "Soll [46] ∧ [688]", rule: "AHB: Soll [46] ∧ [688]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [689] ∧ [694] ∧ [698]", rule: "AHB: Soll [46] ∧ [689] ∧ [694] ∧ [698]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [690]", rule: "AHB: Soll [46] ∧ [690]" },
        { id: "LOC_Z21", name: "SG5 LOC+Z21: Tranche", status: "Soll", ahbExpr: "Soll [166]", rule: "AHB: Soll [166]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Muss-bedingt", ahbExpr: "Muss [527]", rule: "AHB: Muss [527]" },
        { id: "RFF_Z31", name: "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation", status: "Soll", ahbExpr: "Soll [166] ∧ [700]", rule: "AHB: Soll [166] ∧ [700]" },
        { id: "RFF_Z33", name: "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur", status: "Muss-bedingt", ahbExpr: "Muss [2313]", rule: "AHB: Muss [2313]" },
        { id: "RFF_Z34", name: "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation", status: "Muss-bedingt", ahbExpr: "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])", rule: "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])" },
        { id: "RFF_Z16", name: "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [179] ∧ [291]", rule: "AHB: Muss [179] ∧ [291]" },
        { id: "RFF_Z20", name: "SG6 RFF+Z20: Referenz auf die ID einer Tranche", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z37", name: "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z14", name: "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway", status: "Soll", ahbExpr: "Soll [166] ∧ [215]", rule: "AHB: Soll [166] ∧ [215]" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss-bedingt", ahbExpr: "Muss [665] · Codes: MG [441]", rule: "AHB: Muss [665]" },
        { id: "RFF_AGK", name: "SG6 RFF+AGK: Konfigurations-ID", status: "Muss-bedingt", ahbExpr: "Muss [402] ∧ [420]", rule: "AHB: Muss [402] ∧ [420]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55095;
