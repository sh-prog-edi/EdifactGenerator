// _bedingungen.js (CONTRL) - AHB-Bedingungen via kohlrahbi-Parser (an unser docx-Layout adaptiert).
// parse_conditions_from_string (kohlrahbi/Hochfrequenz), Quelle AHB_CONTRL_1.0_20251001_99991231_20251001_ooox_11580.docx.
var contrlBedingungen = {
  "1": { text: "Datenelements / Datenelementgruppe", art: "voraussetzung" },
  "2": { text: "Wenn Syntaxfehler in UNH vorhanden.", art: "voraussetzung" },
  "3": { text: "codiert UNH Nachrichten- X Kopfsegment UNT Nachrichten- X Endesegment", art: "voraussetzung" },
  "5": { text: "Wenn Fehler auf Segment(gruppen)ebene vorhanden.", art: "voraussetzung" },
  "6": { text: "Wenn Fehler auf Datenelement-, Gruppendatenelement- oder Datengruppenebene vorhanden.", art: "voraussetzung" },
  "8": { text: "Wenn SG1 UCM DE0013 vorhanden.", art: "voraussetzung" },
  "9": { text: "Wenn SG1 UCM DE0013 nicht vorhanden.", art: "voraussetzung" },
};
if (typeof window!=='undefined') window.EdiBedingungen = Object.assign(window.EdiBedingungen||{}, contrlBedingungen);
if (typeof module!=='undefined') module.exports = contrlBedingungen;
