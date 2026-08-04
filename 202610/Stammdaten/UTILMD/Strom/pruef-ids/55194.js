// 55194.js - Antwort auf Geschäftsdatenanfrage (Strom an Gas, NB an MSB)
// Segmentregeln für Prüf-ID 55194 (AHB Strom V2.2, 29.06.2026, Kap. 9.5 Geschäftsdatenanfrage).
// "Antwort auf GDA": BGM E44 (Informationsmeldung), STS+7++ZY5, Referenz auf die Anfrage via RFF+AAV.
// Details in _prozess-meta.js. Struktureller Kern (Nutzdatenmatrix je Objektart = Vertiefung).
const ahbRules55194 = {
    pruefidentifikator: "55194",
    bezeichnung: "Antwort auf Geschäftsdatenanfrage (Strom an Gas, NB an MSB)",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (E44 Informationsmeldung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "RFF_AAV", name: "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)", status: "Muss", rule: "Referenz auf die ursprüngliche Geschäftsdatenanfrage." },
        { id: "STS_7_grund", name: "SG4 STS+7: Transaktionsgrund", status: "Muss", isSelect: true, options: [{ v: "ZY5", t: "ZY5 - Antwort auf GDA (Strom an Gas)" }], rule: "AHB: Muss" },
        { id: "RFF_Z19", name: "SG6 RFF+Z19: Referenz auf die ID einer Messlokation", status: "Muss", rule: "AHB: Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55194;
