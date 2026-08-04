// 55071.js - Aktivierung Zuordnungsermächtigung
// Segmentregeln für Prüf-ID 55071 (AHB Strom S2.1, Stand 29.06.2026).
// Korrigiert nach AHB-Abgleich: LOC+Z15 existiert im AHB nicht; der Anwendungsfall
// identifiziert die Summenzeitreihe über SG8 SEQ+Z22 / SG10 CCI (Bilanzierungsgebiet,
// Bilanzkreis, Summenzeitreihentyp) und SG12 NAD+VY. BGM/STS/EBD liefert _prozess-meta.js.
const ahbRules55071 = {
    pruefidentifikator: "55071",
    bezeichnung: "Aktivierung Zuordnungsermächtigung",
    segments: [
        { id: "UNH", name: "UNH: Nachrichten-Kopfsegment", status: "Muss" },
        { id: "BGM", name: "BGM: Beginn der Nachricht (BGM+Z17 Zuordnungsermächtigung)", status: "Muss" },
        { id: "DTM_137", name: "DTM+137: Dokumenten-/Nachrichtendatum", status: "Muss" },
        { id: "NAD_MS", name: "NAD+MS: MP-ID Absender (Qualifikator 9/293)", status: "Muss" },
        { id: "NAD_MR", name: "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)", status: "Muss" },
        { id: "IDE", name: "SG4 IDE+24: Vorgangsnummer (Transaktion)", status: "Muss" },
        { id: "DTM_158", name: "SG4 DTM+158: Bilanzierungsbeginn", status: "Muss", rule: "[UB1] Zeitangabe in UTC." },
        { id: "RFF_Z13", name: "SG6 RFF+Z13: Prüfidentifikator (55071)", status: "Muss" },
        { id: "SEQ_Z22", name: "SG8 SEQ+Z22: Daten der Summenzeitreihe", status: "Muss" },
        { id: "CCI_Z20", name: "SG10 CCI+Z20: Bilanzierungsgebiet", status: "Muss" },
        { id: "CCI_Z19", name: "SG10 CCI+Z19: Bilanzkreis", status: "Muss" },
        { id: "CCI_15", name: "SG10 CCI+15+Z21: Struktur / Summenzeitreihentyp", status: "Muss" },
        { id: "NAD_VY", name: "SG12 NAD+VY: andere zugehörige Partei (MP-ID)", status: "Muss" }
    ]
};

if (typeof module !== 'undefined') module.exports = ahbRules55071;
