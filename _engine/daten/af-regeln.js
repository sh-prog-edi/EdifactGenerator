// af-regeln.js - Maschinell nutzbare Kernregeln aus den EDI@Energy
// "Allgemeine Festlegungen" 6.1c (Formatstand 202604) / 6.1d (202610).
// Quelle: regelwerk/af/AllgFestlegungen_6.1c_11916.pdf bzw. _6.1d_12145.pdf.
// Die Regeln sind in beiden Fassungen inhaltsgleich (Kapitelverweise 6.1c).
const afRegeln = {
  quelle: {
    "202604": "Allgemeine Festlegungen 6.1c (gültig 01.04.2026-30.09.2026)",
    "202610": "Allgemeine Festlegungen 6.1d (gültig ab 01.10.2026)"
  },
  zeichensatz: {
    // Kap. 4 (DE0001): Zeichensatz C (UNOC), UNB DE0001 = "UNOC:3"
    syntaxKennung: "UNOC", syntaxVersion: "3",
    // UNA-Servicezeichen der EDI@Energy-Nachrichten; Dezimaltrennzeichen ist
    // immer der Punkt (Kap. "Trennzeichen/Dezimalzeichen")
    una: "UNA:+.? '",
    trennzeichen: { komponente: ":", element: "+", dezimal: ".", release: "?", segment: "'" }
  },
  zeit: {
    // Kap. 3: alle Zeitangaben in UTC; DTM-Format 303 endet auf Zeitzone "+00"
    codierung: "UTC",
    dtm303Suffix: "+00",
    // Kap. 3.1: Tagesgrenze gesetzliche deutsche Zeit; Gastag beginnt 06:00
    tagesbeginn: { strom: "00:00", gas: "06:00" }
  },
  mpid: {
    // Kap. 2.13/2.14: zugelassene MP-ID-Typen je Sparte; Format 13-stellig numerisch
    laenge: 13, numerisch: true,
    typen: [
      { typ: "BDEW-Codenummer", sparte: "Strom", vergabe: "BDEW", nad3055: "293", unb0007: "500" },
      { typ: "DVGW-Codenummer", sparte: "Gas", vergabe: "DVGW", nad3055: "332", unb0007: "502" },
      { typ: "GLN", sparte: "Strom+Gas", vergabe: "GS1", nad3055: "9", unb0007: "14",
        pruefziffer: "gs1-mod10" }
    ],
    // Kap. 2.13: MP-ID in UNB (DE0004/0010) und NAD+MS/NAD+MR sind identisch
    unbNadIdentisch: true
  },
  uebertragungsdatei: {
    // UNB DE0026 Anwendungsreferenz (Sortenreinheit der Übertragungsdatei),
    // UNB DE0035 = 1 kennzeichnet Testdateien
    testkennzeichen: "1"
  }
};
// GS1-Mod10-Prüfziffer (GLN): Summe der Ziffern mit Gewichten 1/3 von links,
// Prüfziffer ergänzt auf das nächste Vielfache von 10.
function gs1Pruefziffer(zwoelf) {
  let s = 0;
  for (let i = 0; i < 12; i++) s += Number(zwoelf[i]) * (i % 2 ? 3 : 1);
  return String((10 - (s % 10)) % 10);
}
if (typeof module !== 'undefined') module.exports = { afRegeln, gs1Pruefziffer };
