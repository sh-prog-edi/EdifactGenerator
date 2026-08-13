// _engine/daten/aperak-ahb.js
// ------------------------------------------------------------------
// Fehlercodes und Auswertungsregeln der APERAK (SG4 ERC DE9321) aus dem
// BDEW-AHB APERAK.
//
// MASCHINELL ERZEUGT durch werkzeuge/lies_aperak_ahb.py — nicht von Hand pflegen.
// Quelle: AHB_APERAK_1.0_20251001_20260930_20250930_xoxx_11886.docx
//
// Anders als die CONTRL kennt die APERAK keinen numerischen Segment-/DE-Zeiger.
// Der Fehlerort steht als Freitext im FTX+Z02 (Ortsangabe des AHB-Fehlers):
//   erstes DE4440  = Segmentbezeichnung laut Nachrichtenbeschreibung,
//   zweites DE4440 = das fehlerhafte Segment im Rohtext (ohne Endezeichen).
// Das zweite DE4440 ist damit unmittelbar in der Ursprungsnachricht auffindbar.
// ------------------------------------------------------------------
var aperakAhb = {
  // [code, Bezeichnung, Verwendungsmarke laut AHB]
  "fehlercodes": [
    ["Z10", "ID unbekannt", "X [500]"],
    ["Z14", "Objekt im IT-System nicht gefunden", "X [501]"],
    ["Z15", "Objekt im IT-System nicht eindeutig", "X [501]"],
    ["Z16", "Objekt nicht mehr im Netzgebiet", "X"],
    ["Z17", "Absender ist zum angegebenen Zeitintervall / Zeitpunkt dem Objekt nicht zugeordnet", "X [500]"],
    ["Z18", "Empfänger ist zum angegebenen Zeitintervall / Zeitpunkt dem Objekt nicht zugeordnet", "X [500]"],
    ["Z19", "Gerätenummer zum angegebenen Zeitintervall / Zeitpunkt an der Messlokation nicht bekannt", "X [500]"],
    ["Z20", "OBIS-Kennzahl zum angegebenen Zeitintervall / Zeitpunkt am Objekt nicht bekannt", "X [500]"],
    ["Z21", "Geschäftsvorfallinterne Referenzierung fehlerhaft", "X [500]"],
    ["Z24", "Zuordnungs-Tupel unbekannt", "X [500]"],
    ["Z25", "Absender ist zum angegebenen Zeitintervall / Zeitpunkt dem durch das Zuordnungs-Tupel identifizierten Objekt nicht zugeordnet", "X [500]"],
    ["Z26", "Empfänger ist zum angegebenen Zeitintervall / Zeitpunkt dem durch das Zuordnungs-Tupel identifizierten Objekt nicht zugeordnet", "X [500]"],
    ["Z27", "Vorkomma-Stellenzahl des Zählwertes ist zu lang", "X [500]"],
    ["Z29", "Erforderliche Angabe für diesen Anwendungsfall fehlt", "X"],
    ["Z30", "Zeitreihe unvollständig", "X [500]"],
    ["Z31", "Geschäftsvorfall wird vom Empfänger zurückgewiesen", "X"],
    ["Z33", "Referenziertes Geschäftsvorfall-Tupel nicht vorhanden", "X [500]"],
    ["Z34", "Zeitintervall negativ oder Null", "X"],
    ["Z35", "Format nicht eingehalten", "X"],
    ["Z37", "Geschäftsvorfall darf vom Sender nicht gesendet werden", "X"],
    ["Z38", "Anzahl der übermittelten Codes überschreitet Paketdefinition", "X"],
    ["Z39", "Code nicht aus erlaubtem Wertebereich", "X"],
    ["Z40", "Segment- bzw. Segmentgruppenwiederholbarkeit überschritten", "X"],
    ["Z41", "Zeitangabe unplausibel", "X"],
    ["Z42", "Konfigurations-ID zum angegebenen Zeitintervall / Zeitpunkt nicht bekannt", "X [500]"],
    ["Z43", "Geschäftsvorfall für Objekt mit der Eigenschaft nicht erlaubt", "X [500]"],
    ["Z44", "Eigenschaft des Objekts weicht von der im Geschäftsvorfall codierten Eigenschaft ab", "X [500]"]
  ],
  // Codes, bei denen der AHB eine Ortsangabe (FTX+Z02) verlangt.
  "mitOrtsangabe": ["Z21", "Z29", "Z35", "Z38", "Z39", "Z40", "Z41"],
  "bedingungen": {
    "1": "Muss.",
    "2": "Wenn fehlerhafter Inhalt vorhanden.",
    "3": "∧.",
    "4": "Wenn in dieser SG4, RFF+TN nicht vorhanden.",
    "5": "∨.",
    "6": "Wenn Fehler innerhalb der Vorgangsebene von IFTSTA, INSRPT, UTILMD oder UTILTS vorhanden.",
    "7": "∨.",
    "8": "Wenn SG4 ERC+Z16 vorhanden.",
    "9": "∨.",
    "10": "∨.",
    "11": "∨.",
    "12": "∨.",
    "13": ").",
    "14": ") ∨\tX ((.",
    "15": "))\t(.",
    "16": "Wenn der referenzierte Nachrichtentyp IFTSTA, INSRPT, UTILMD oder UTILTS ist.",
    "494": "X.",
    "500": "Z17\tAbsender ist zum\tX.",
    "501": "Hinweis: Für Initialprozesse.",
    "502": "∧.",
    "931": "Format: ZZZ = +00.",
    "939": "Format: Die Zeichenkette muss die Zeichen @ und . enthalten.",
    "940": "Format: Die Zeichenkette muss mit dem Zeichen + beginnen und danach dürfen nur noch Ziffern folgen."
  }
};

// Klartext zu einem ERC-Fehlercode; leer, wenn der AHB ihn nicht führt.
function aperakFehlertext(code) {
  var liste = (aperakAhb || {}).fehlercodes || [];
  for (var i = 0; i < liste.length; i++)
    if (liste[i][0] === String(code)) return liste[i][1];
  return "";
}

// Verlangt der AHB zu diesem Code eine Ortsangabe (FTX+Z02)?
function aperakBrauchtOrtsangabe(code) {
  return ((aperakAhb || {}).mitOrtsangabe || []).indexOf(String(code)) >= 0;
}

if (typeof module !== "undefined")
  module.exports = {
    aperakAhb: aperakAhb,
    aperakFehlertext: aperakFehlertext,
    aperakBrauchtOrtsangabe: aperakBrauchtOrtsangabe,
  };
