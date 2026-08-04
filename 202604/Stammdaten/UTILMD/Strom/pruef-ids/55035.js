// 55035.js - Antwort auf Geschäftsdatenanfrage verbrauchende MaLo (NB an LF)
// Segmentregeln für Prüf-ID 55035 (AHB Strom S2.1, Stand 29.06.2026, Kap. 9.5 Geschäftsdatenanfrage).
// "Antwort auf GDA": BGM E44 (Informationsmeldung), STS+7++ZY7, Referenz auf die Anfrage via RFF+AAV.
// Details in _prozess-meta.js. Struktureller Kern (Nutzdatenmatrix je Objektart = Vertiefung).
const ahbRules55035 = {
    pruefidentifikator: "55035",
    bezeichnung: "Antwort auf Geschäftsdatenanfrage verbrauchende MaLo (NB an LF)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E44 Informationsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "LOC_Z16", name: "SG5 LOC+Z16: ID der Marktlokation (Objekt der Anfrage)", status: "Muss", ahbExpr: "Muss [2061]" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)", status: "Muss", rule: "Referenz auf die ursprüngliche Geschäftsdatenanfrage." },
        { id: "STS_7", name: "SG4 STS+7: Transaktionsgrundergänzung", status: "Muss", isSelect: true, options: [{ v: "ZW4", t: "ZW4 - Verbrauchende Marktlokation" }, { v: "ZAP", t: "ZAP - ruhende Marktlokation" }], rule: "AHB: Muss" },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY7", t: "ZY7 - Antwort auf GDA verbrauchende MaLo" }], rule: "AHB: Muss" },
        { id: "LOC_Z18", name: "SG5 LOC+Z18: Netzlokation", status: "Soll", ahbExpr: "Soll [46] ∧ [688]", rule: "AHB: Soll [46] ∧ [688]" },
        { id: "LOC_Z22", name: "SG5 LOC+Z22: Ruhende Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [2015] ∧ [96]", abhaengig: {"feld": "STS_7", "code": "ZAP", "negiert": false, "bedingung": "96"}, rule: "AHB: Muss [2015] ∧ [96]" },
        { id: "LOC_Z20", name: "SG5 LOC+Z20: Technische Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [689] ∧ [694]", rule: "AHB: Soll [46] ∧ [689] ∧ [694]" },
        { id: "LOC_Z19", name: "SG5 LOC+Z19: Steuerbare Ressource", status: "Soll", ahbExpr: "Soll [46] ∧ [690]", rule: "AHB: Soll [46] ∧ [690]" },
        { id: "LOC_Z17", name: "SG5 LOC+Z17: Messlokation", status: "Soll", ahbExpr: "Soll [165]", rule: "AHB: Soll [165]" },
        { id: "RFF_Z31", name: "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z32", name: "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation", status: "Soll", ahbExpr: "Soll [166] ∧ [700]", rule: "AHB: Soll [166] ∧ [700]" },
        { id: "RFF_Z33", name: "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur", status: "Muss-bedingt", ahbExpr: "Muss [2313]", rule: "AHB: Muss [2313]" },
        { id: "RFF_Z34", name: "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation", status: "Muss-bedingt", ahbExpr: "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])", rule: "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])" },
        { id: "RFF_Z16", name: "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation", status: "Muss-bedingt", ahbExpr: "Muss [179] ∧ [291]", rule: "AHB: Muss [179] ∧ [291]" },
        { id: "RFF_Z10", name: "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z37", name: "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z38", name: "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" },
        { id: "RFF_Z14", name: "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway", status: "Soll", ahbExpr: "Soll [166] ∧ [215]", rule: "AHB: Soll [166] ∧ [215]" },
        { id: "RFF_MG", name: "SG6 RFF+MG: Referenz auf die Gerätenummer", status: "Muss-bedingt", ahbExpr: "Muss [665] · Codes: MG [441]", rule: "AHB: Muss [665]" },
        { id: "RFF_AGK", name: "SG6 RFF+AGK: Konfigurations-ID", status: "Muss-bedingt", ahbExpr: "Muss [402] ∧ [420]", rule: "AHB: Muss [402] ∧ [420]" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55035;
