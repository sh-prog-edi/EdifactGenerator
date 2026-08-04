// _bedingungen.js (APERAK) - AHB-Bedingungen via kohlrahbi-Parser (an unser docx-Layout adaptiert).
// parse_conditions_from_string (kohlrahbi/Hochfrequenz), Quelle AHB_APERAK_1.0_20251001_20260930_20251001_ooox_11567.docx.
var aperakBedingungen = {
  "1": { text: "Wenn SG3 CTA+IC vorhanden.", art: "voraussetzung", check: {"tag": "CTA", "qual": "IC", "neg": false} },
  "2": { text: "Wenn fehlerhafter Inhalt vorhanden.", art: "voraussetzung" },
  "3": { text: "Wenn für weitere Fehlerangabe benötigt.", art: "voraussetzung" },
  "4": { text: "Wenn in dieser SG4, RFF+TN nicht vorhanden.", art: "voraussetzung" },
  "5": { text: "Wenn SG4 ERC+Z29 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z29", "neg": false} },
  "6": { text: "Wenn Fehler innerhalb der Vorgangsebene von IFTSTA, INSRPT, UTILMD oder UTILTS vorhanden.", art: "voraussetzung" },
  "7": { text: "Wenn SG4 ERC+Z21 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z21", "neg": false} },
  "8": { text: "Wenn SG4 ERC+Z16", art: "voraussetzung" },
  "9": { text: "Wenn SG4 ERC+Z35 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z35", "neg": false} },
  "10": { text: "Wenn SG4 ERC+Z38 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z38", "neg": false} },
  "11": { text: "Wenn SG4 ERC+Z39 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z39", "neg": false} },
  "12": { text: "Wenn SG4 ERC+Z41 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z41", "neg": false} },
  "13": { text: "Wenn SG4 ERC+Z40 vorhanden.", art: "voraussetzung", check: {"tag": "ERC", "qual": "Z40", "neg": false} },
  "14": { text: "Wenn im DE3155 in demselben COM der Code EM vorhanden ist", art: "voraussetzung" },
  "15": { text: "Wenn im DE3155 in demselben COM der Code TE / FX / AJ / AL vorhanden ist", art: "voraussetzung" },
  "16": { text: "Wenn der referenzierte Nachrichtentyp IFTSTA, INSRPT, UTILMD oder UTILTS ist.", art: "voraussetzung" },
  "494": { text: "Das hier genannte Datum muss der Zeitpunkt sein, zu dem das Dokument erstellt wurde, oder ein Zeitpunkt, der davor liegt", art: "voraussetzung" },
  "500": { text: "angegebenen Zeitintervall / Zeitpunkt dem durch das Zuordnungs-Tupel identifizierten Objekt nicht zugeordnet Z27 Vorkomma-Stellenzahl X", art: "hinweis" },
  "501": { text: "nicht eindeutig Z16 Objekt nicht mehr im X Netzgebiet Z29 Erforderliche Angabe für X diesen Anwendungsfall fehlt Z31 Geschäftsvorfall wird X vom Empfänger zurückgewiesen Z34 Zeitintervall negativ oder X Null Z35 Format nicht eingehalten X Z37 Geschäftsvorfall darf X vom Sender nicht gesendet werden Z38 Anzahl der übermittelten X Codes überschreitet Paketdefinition Z39 Code nicht aus X erlaubtem Wertebereich Z40 Segment- bzw. X Segmentgruppenwiederh olbarkeit überschritten Z41 Zeitangabe unplausibel X", art: "hinweis" },
  "502": { text: "Hinweis: Es darf nur eine Information im DE3148 übermittelt werden", art: "hinweis" },
  "901": { text: "und", art: "format" },
  "906": { text: "Format: max. 3 Nachkommastellen Die Nachricht enthält: QTY+220:23.8976‘", art: "format" },
  "931": { text: "Format: ZZZ = +00", art: "format" },
  "939": { text: "Format: Die Zeichenkette muss die Zeichen @ und . enthalten", art: "format" },
  "940": { text: "Format: Die Zeichenkette muss mit dem Zeichen + beginnen und danach dürfen nur noch Ziffern folgen", art: "format" },
  "999": { text: ". Weitere Details zur Formatdefinition sind dem entsprechenden Kapitel der Allgemeinen Festlegungen zu entnehmen. Beispiel: Im QTY-Segment des Anwendungsfalls ist für das DE6060 folgendes angegeben: X", art: "format" },
};
if (typeof window!=='undefined') window.EdiBedingungen = Object.assign(window.EdiBedingungen||{}, aperakBedingungen);
if (typeof module!=='undefined') module.exports = aperakBedingungen;
