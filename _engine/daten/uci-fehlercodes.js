// _engine/daten/uci-fehlercodes.js
// ------------------------------------------------------------------
// UNTDID 0085 - gaengige Syntax-Fehlercodes der MaKo-Praxis (CONTRL UCI/
// UCM/UCD DE0085). Bisher als Konstante im CONTRL-Generator gefuehrt
// (Servicenachrichten/CONTRL/index.html); ausgelagert, damit der
// Ablehnungs-Abgleich (ablehnung-abgleich.html) dieselbe Quelle nutzt statt
// einer zweiten, potenziell abweichenden Kopie.
// ------------------------------------------------------------------
var uciFehlercodes0085 = [
  ["2",  "Syntax-Version oder -ebene nicht unterstützt"],
  ["7",  "Ungültiger Absender/Empfänger"],
  ["12", "Ungültiger Wert"],
  ["13", "Fehlt (Segment/Datenelement fehlt)"],
  ["16", "Zu viele Bestandteile"],
  ["18", "Unspezifizierter Fehler"],
  ["21", "Ungültiges Zeichen"],
  ["22", "Ungültiges Dienstzeichen"],
  ["28", "Ungültige Segmentreihenfolge"],
  ["35", "Zu viele Segment-/Gruppenwiederholungen"],
  ["39", "Datenelement zu lang"],
  ["40", "Datenelement zu kurz"]
];
if (typeof module !== "undefined") module.exports = uciFehlercodes0085;
