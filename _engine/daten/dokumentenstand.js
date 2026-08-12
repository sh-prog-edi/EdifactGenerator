// dokumentenstand.js — Stand der verarbeiteten BDEW-Dokumente (AHB/MIG) je
// Formatstand und Liste der eingearbeiteten Änderungen (Änd-IDs).
//
// Nachweis-Schicht für die Einstiegsseite: Sie macht sichtbar, auf welcher
// Dokumentversion die Prüfgrundlage des Generators beruht und welche einzelnen
// Fehlerkorrekturen (Änd-IDs der BDEW-Änderungshistorie) eingearbeitet wurden.
// Die Originaldokumente selbst liegen nicht im Repository (siehe README/Lizenz);
// die vollständige Quellenliste steht in docs/QUELLEN_MANIFEST.json.
//
// Pflege: bei jeder übernommenen Dokumentfassung/Fehlerkorrektur hier fortführen
// (Version bzw. `stand` der Dokumente und einen Eintrag unter `aenderungen`).
var EdiDokumentenstand = {
  aktualisiert: "2026-08-12",
  staende: {
    "202604": {
      bezeichnung: "Formatstand 202604 — gültig bis 30.09.2026",
      dokumente: [
        { art: "AHB", typ: "UTILMD Strom", version: "S2.1" },
        { art: "MIG", typ: "UTILMD Strom", version: "S2.1" },
        { art: "AHB", typ: "UTILMD Gas", version: "G1.1" },
        { art: "MIG", typ: "UTILMD Gas", version: "G1.1" },
      ],
    },
    "202610": {
      bezeichnung: "Formatstand 202610 — gültig ab 01.10.2026",
      dokumente: [
        { art: "AHB", typ: "UTILMD Strom", version: "2.2", stand: "06.08.2026" },
        { art: "MIG", typ: "UTILMD Strom", version: "S2.2", stand: "06.08.2026" },
        { art: "AHB", typ: "UTILMD Gas", version: "1.2", stand: "06.08.2026" },
        { art: "MIG", typ: "UTILMD Gas", version: "G1.2", stand: "06.08.2026" },
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
