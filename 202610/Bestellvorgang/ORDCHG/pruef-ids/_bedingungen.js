// _bedingungen.js (ORDCHG) - AHB-Bedingungen, extrahiert mit kohlrahbi (Hochfrequenz).
// Offizieller conditions-Scraper, Quelle FV2604.
var ordchgBedingungen = {
  "1": { text: "MP-ID nur aus Sparte Strom", art: "voraussetzung" },
  "2": { text: "Wenn BGM+Z51 (Sperrung) vorhanden", art: "voraussetzung" },
  "3": { text: "Wenn BGM+Z52 (Entsperrung) vorhanden", art: "voraussetzung" },
  "4": { text: "wenn im DE3155 in demselben COM der Code EM vorhanden ist", art: "voraussetzung" },
  "5": { text: "wenn im DE3155 in demselben COM der Code TE / FX / AJ / AL vorhanden ist", art: "voraussetzung" },
  "490": { text: "wenn Wert in diesem DE, an der Stelle CCYYMMDDHHMM ein Zeitpunkt aus dem angegeben Zeitraum der Tabelle Kapitel 3.5 „Übersicht gesetzliche deutsche Sommerzeit (MESZ)“ der Spalten:\n›\t„Sommerzeit (MESZ) von“ Darstellung in UTC und\n›\t„Sommerzeit (MESZ) bis“ Darstellung in UTC ist.", art: "voraussetzung" },
  "491": { text: "wenn Wert in diesem DE, an der Stelle CCYYMMDDHHMM ein Zeitpunkt aus dem angegeben Zeitraum der Tabelle Kapitel 3.6 „Übersicht gesetzliche deutsche Zeit (MEZ)“ der Spalten: \n›\t„Winterzeit (MEZ) von“ Darstellung in UTC und\n›\t„Winterzeit (MEZ) bis“ Darstellung in UTC ist.", art: "voraussetzung" },
  "492": { text: "wenn MP-ID in NAD+MR aus Sparte Strom", art: "voraussetzung" },
  "493": { text: "wenn MP-ID in NAD+MR aus Sparte Gas", art: "voraussetzung" },
  "494": { text: "Das hier genannte Datum muss der Zeitpunkt sein, zu dem das Dokument erstellt wurde, oder ein Zeitpunkt, der davor liegt.", art: "voraussetzung" },
  "500": { text: "Hinweis: Dokumentennummer aus BGM DE1004 der ORDERS", art: "hinweis" },
  "501": { text: "Hinweis: Wert aus BGM+Z33 DE1004 der IFTSTA mit der die Information über den Entsperrauftrag übermittelt wurde", art: "hinweis" },
  "502": { text: "Hinweis: Vorgangsnummer aus CNI DE1490 der IFTSTA mit BGM+Z33 mit der die Information über den Entsperrauftrag übermittelt wurde", art: "hinweis" },
  "503": { text: "Hinweis: Es darf nur eine Information im DE3148 übermittelt werden", art: "hinweis" },
  "931": { text: "Format: ZZZ = +00", art: "format" },
  "932": { text: "Format: HHMM = 2200", art: "format" },
  "933": { text: "Format: HHMM = 2300", art: "format" },
  "934": { text: "Format: HHMM = 0400", art: "format" },
  "935": { text: "Format: HHMM = 0500", art: "format" },
  "939": { text: "Format: Die Zeichenkette muss die Zeichen @ und . enthalten", art: "format" },
  "940": { text: "Format: Die Zeichenkette muss mit dem Zeichen + beginnen und danach dürfen nur noch Ziffern folgen", art: "format" },
};
if (typeof window!=='undefined') window.EdiBedingungen = Object.assign(window.EdiBedingungen||{}, ordchgBedingungen);
if (typeof module!=='undefined') module.exports = ordchgBedingungen;
