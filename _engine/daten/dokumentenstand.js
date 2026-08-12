// dokumentenstand.js — Stand der verarbeiteten BDEW-Dokumente (AHB/MIG) je
// Formatstand und Liste der eingearbeiteten Änderungen (Änd-IDs).
//
// Nachweis-Schicht für die Einstiegsseite: Sie macht sichtbar, auf welcher
// Dokumentversion die Prüfgrundlage des Generators beruht und welche einzelnen
// Fehlerkorrekturen (Änd-IDs der BDEW-Änderungshistorie) eingearbeitet wurden.
// Aufgeführt sind ALLE verarbeiteten Nachrichtentypen beider Formatstände.
// Quellen der Versionsangaben: docs/QUELLEN_MANIFEST.json (Feld „zuordnung" für
// die AHB-Version je Typ) sowie — für den kommenden Formatstand 202610 — die
// konsolidierten Fassungen des edi_energy-Spiegels (Hochfrequenz), aus dem die
// MIG-Versionen und Standdaten übernommen sind (z. B. MIG MSCONS 2.5). Die
// kuratierten UTILMD-Fassungen der Fehlerkorrektur 06.08.2026 bleiben erhalten.
// Die Originaldokumente selbst liegen nicht im Repository (siehe README/Lizenz).
//
// Pflege: bei jeder übernommenen Dokumentfassung/Fehlerkorrektur hier fortführen
// (Version bzw. `stand` der Dokumente und einen Eintrag unter `aenderungen`).
// `hoechsteMakoFileId`: höchste bekannte Download-ID der BDEW-MAKO-Plattform aus
// dem Quellen-Manifest — Bezugswert für die Aktualitätsprüfung (Schalter auf der
// Einstiegsseite).
var EdiDokumentenstand = {
  aktualisiert: "2026-08-12",
  hoechsteMakoFileId: 12277,
  staende: {
    "202604": {
      bezeichnung: "Formatstand 202604 — gültig bis 30.09.2026",
      dokumente: [
        { art: "AHB", typ: "UTILMD Strom", version: "S2.1", stand: "29.06.2026" },
        { art: "MIG", typ: "UTILMD Strom", version: "S2.1", stand: "02.03.2026" },
        { art: "AHB", typ: "UTILMD Gas", version: "G1.1", stand: "27.03.2026" },
        { art: "MIG", typ: "UTILMD Gas", version: "G1.1", stand: "11.12.2025" },
        { art: "AHB", typ: "APERAK", version: "1.0", stand: "30.09.2025" },
        { art: "MIG", typ: "APERAK", version: "2.1i", stand: "06.06.2025" },
        { art: "AHB", typ: "COMDIS", version: "1.0h", stand: "01.04.2026" },
        { art: "MIG", typ: "COMDIS", version: "1.0g", stand: "01.04.2026" },
        { art: "AHB", typ: "CONTRL", version: "1.0", stand: "11.12.2025" },
        { art: "MIG", typ: "CONTRL", version: "2.0b", stand: "11.12.2025" },
        { art: "AHB", typ: "IFTSTA", version: "2.0h", stand: "23.06.2025" },
        { art: "MIG", typ: "IFTSTA", version: "2.0g", stand: "01.10.2025" },
        { art: "AHB", typ: "INSRPT", version: "1.1g", stand: "11.12.2025" },
        { art: "MIG", typ: "INSRPT", version: "1.1a", stand: "26.07.2024" },
        { art: "AHB", typ: "INVOIC", version: "1.0a", stand: "01.04.2026" },
        { art: "MIG", typ: "INVOIC", version: "2.8e", stand: "01.10.2025" },
        { art: "AHB", typ: "MSCONS", version: "3.1g", stand: "02.03.2026" },
        { art: "MIG", typ: "MSCONS", version: "2.4c", stand: "26.07.2024" },
        { art: "AHB", typ: "ORDCHG", version: "1.0a", stand: "06.06.2025" },
        { art: "MIG", typ: "ORDCHG", version: "1.1", stand: "26.07.2024" },
        { art: "AHB", typ: "ORDERS", version: "1.1a", stand: "01.04.2026" },
        { art: "MIG", typ: "ORDERS", version: "1.4b", stand: "01.10.2025" },
        { art: "AHB", typ: "ORDRSP", version: "1.1a", stand: "27.03.2026" },
        { art: "MIG", typ: "ORDRSP", version: "1.4b", stand: "01.04.2026" },
        { art: "AHB", typ: "PARTIN", version: "1.0f", stand: "02.03.2026" },
        { art: "MIG", typ: "PARTIN", version: "1.0f", stand: "01.04.2026" },
        { art: "AHB", typ: "PRICAT", version: "2.0f", stand: "11.12.2025" },
        { art: "MIG", typ: "PRICAT", version: "2.0e", stand: "30.09.2025" },
        { art: "AHB", typ: "QUOTES", version: "1.1", stand: "01.10.2025" },
        { art: "MIG", typ: "QUOTES", version: "1.3b", stand: "30.01.2026" },
        { art: "AHB", typ: "REMADV", version: "1.0a", stand: "01.04.2026" },
        { art: "MIG", typ: "REMADV", version: "2.9e", stand: "01.04.2026" },
        { art: "AHB", typ: "REQOTE", version: "1.1", stand: "01.10.2025" },
        { art: "MIG", typ: "REQOTE", version: "1.3c", stand: "01.10.2025" },
        { art: "AHB", typ: "UTILTS", version: "1.0", stand: "27.03.2026" },
        { art: "MIG", typ: "UTILTS", version: "1.1e", stand: "13.12.2024" },
      ],
    },
    "202610": {
      bezeichnung: "Formatstand 202610 — gültig ab 01.10.2026",
      dokumente: [
        { art: "AHB", typ: "UTILMD Strom", version: "2.2", stand: "06.08.2026" },
        { art: "MIG", typ: "UTILMD Strom", version: "S2.2", stand: "06.08.2026" },
        { art: "AHB", typ: "UTILMD Gas", version: "1.2", stand: "06.08.2026" },
        { art: "MIG", typ: "UTILMD Gas", version: "G1.2", stand: "06.08.2026" },
        { art: "AHB", typ: "APERAK", version: "1.1", stand: "01.10.2026" },
        { art: "MIG", typ: "APERAK", version: "2.2", stand: "01.10.2026" },
        { art: "AHB", typ: "COMDIS", version: "1.0h", stand: "01.04.2026" },
        { art: "MIG", typ: "COMDIS", version: "1.0g", stand: "01.04.2026" },
        { art: "AHB", typ: "CONTRL", version: "1.0", stand: "11.12.2025" },
        { art: "MIG", typ: "CONTRL", version: "2.0b", stand: "11.12.2025" },
        { art: "AHB", typ: "IFTSTA", version: "2.1", stand: "01.10.2026" },
        { art: "MIG", typ: "IFTSTA", version: "2.1", stand: "01.10.2026" },
        { art: "AHB", typ: "INSRPT", version: "1.1g", stand: "11.12.2025" },
        { art: "MIG", typ: "INSRPT", version: "1.1a", stand: "26.07.2024" },
        { art: "AHB", typ: "INVOIC", version: "1.0b", stand: "01.10.2026" },
        { art: "MIG", typ: "INVOIC", version: "2.8e", stand: "01.10.2025" },
        { art: "AHB", typ: "MSCONS", version: "3.2", stand: "01.10.2026" },
        { art: "MIG", typ: "MSCONS", version: "2.5", stand: "01.10.2026" },
        { art: "AHB", typ: "ORDCHG", version: "1.1", stand: "01.10.2026" },
        { art: "MIG", typ: "ORDCHG", version: "1.2", stand: "01.10.2026" },
        { art: "AHB", typ: "ORDERS", version: "1.1b", stand: "01.10.2026" },
        { art: "MIG", typ: "ORDERS", version: "1.4c", stand: "01.10.2026" },
        { art: "AHB", typ: "ORDRSP", version: "1.1b", stand: "01.10.2026" },
        { art: "MIG", typ: "ORDRSP", version: "1.4c", stand: "01.10.2026" },
        { art: "AHB", typ: "PARTIN", version: "1.1", stand: "01.10.2026" },
        { art: "MIG", typ: "PARTIN", version: "1.1", stand: "01.10.2026" },
        { art: "AHB", typ: "PRICAT", version: "2.1", stand: "01.10.2026" },
        { art: "MIG", typ: "PRICAT", version: "2.1", stand: "01.10.2026" },
        { art: "AHB", typ: "QUOTES", version: "1.1a", stand: "01.10.2026" },
        { art: "MIG", typ: "QUOTES", version: "1.3c", stand: "01.10.2026" },
        { art: "AHB", typ: "REMADV", version: "1.0a", stand: "01.04.2026" },
        { art: "MIG", typ: "REMADV", version: "2.9e", stand: "01.04.2026" },
        { art: "AHB", typ: "REQOTE", version: "1.2", stand: "01.10.2026" },
        { art: "MIG", typ: "REQOTE", version: "1.3c", stand: "01.10.2025" },
        { art: "AHB", typ: "UTILTS", version: "1.1", stand: "01.10.2026" },
        { art: "MIG", typ: "UTILTS", version: "1.1e", stand: "06.06.2025" },
      ],
    },
  },
  // Einzelne Änderungen der BDEW-Änderungshistorie (Status-Spalte trägt das Datum).
  // eingearbeitet=true: in der Prüfgrundlage umgesetzt; false + hinweis: bewertet,
  // aber ohne Datenänderung am AHB-getriebenen Generator (MIG-intern/redaktionell).
  aenderungen: [
    { id: "27512", stand: "202610", dok: "UTILMD AHB Gas 1.2", datum: "06.08.2026", eingearbeitet: true,
      kurz: "DTM Kündigungstermin des Vertrags (DE2380), Ablehnung Kündigung 44018/44041: Bedingung auf „X ([UB2] ∧ [209]) ⊻ [44]“ erweitert (neu [44]: Wenn DE2379 Code 106)." },
    { id: "26312", stand: "202610", dok: "UTILMD MIG Strom S2.2", datum: "06.08.2026", eingearbeitet: false,
      kurz: "RFF Referenz auf Objektcode (Lokationsbündel): BDEW-Status R→D. MIG-intern — AHB unverändert, kein Prüfgrundlagen-Einfluss." },
    { id: "27508", stand: "202610", dok: "UTILMD MIG Strom S2.2", datum: "06.08.2026", eingearbeitet: false,
      kurz: "PIA OBIS-Kennzahl der Netzlokation: BDEW-Status R→D. MIG-intern." },
    { id: "27509", stand: "202610", dok: "UTILMD MIG Strom S2.2", datum: "06.08.2026", eingearbeitet: false,
      kurz: "SG10 Zugeordnete Definition (Steuerbare Ressource): BDEW-Status R→D. MIG-intern." },
    { id: "27513", stand: "202610", dok: "UTILMD MIG Strom S2.2", datum: "06.08.2026", eingearbeitet: false,
      kurz: "PIA OBIS Tranche, 3. DE-Gruppe DE7140: Format „C N“→„N“, „Nicht benutzt“. Unterhalb der Modellierungstiefe (generischer PIA-7140-Eintrag)." },
    { id: "27524", stand: "202610", dok: "UTILMD MIG Strom S2.2", datum: "06.08.2026", eingearbeitet: false,
      kurz: "CCI Vergütungsverpflichtung EEG/KWKG: Beschreibung um Hinweis (Zeitscheiben/Schätzung) ergänzt. Redaktionell." },
  ],
};
if (typeof module !== "undefined") module.exports = EdiDokumentenstand;
