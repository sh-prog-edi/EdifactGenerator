// ahb-ergaenzungen.js
// -------------------------------------------------------------------------
// Segmente, die der AHB außerhalb der Prüf-ID-Tabellen vorsieht.
//
// Die Formular-Metas werden aus den Prüf-ID-Tabellen des AHB erzeugt. Einige
// Datengruppen beschreibt der AHB jedoch in eigenen Kapiteln und verweist in der
// Tabelle nur darauf — der Produktpaket-Block etwa (UTILMD AHB Strom, Kapitel 8.2).
// Solche Segmente fehlen der maschinellen Struktur und würden vom Validator als
// „im AHB nicht vorgesehen" gemeldet, obwohl sie belegt sind.
//
// Diese Datei führt sie als eigene Schicht mit Quellenangabe. Der Validator meldet
// sie dann als Hinweis statt als Fehler — sichtbar, aber nicht als Regelverstoß.
// Ergänzungen gehören hierher und NICHT in die generierten Metas: Die werden bei
// jeder neuen Formatfassung neu erzeugt.
// -------------------------------------------------------------------------
var ahbErgaenzungen = [
  {
    name: "Produktpaket-Block",
    quelle: "UTILMD AHB Strom, Kapitel 8.2 (Produkt-/Produktpaketdaten)",
    // gilt für die Anmeldung der verbrauchenden Marktlokation
    pruefis: ["55001"],
    formate: ["UTILMD"],
    segmente: [
      { seg: "RFF", qual: "Z60", was: "informativ zur Umsetzung geplantes Produktpaket" },
      { seg: "SEQ", qual: "Z79", was: "Produktpaket" },
      { seg: "SEQ", qual: "ZH0", was: "Produktpaket-Priorisierung" },
      { seg: "SEQ", qual: "Z99", was: "Produktdaten" },
      { seg: "PIA", was: "Produkt-/Artikelnummer des Pakets" },
      { seg: "CCI", qual: "Z65", was: "Priorisierung des Produktpakets" },
      { seg: "CCI", qual: "Z98", was: "Produktmerkmal" },
      { seg: "CAV", was: "Merkmalswert des Produktpakets" },
    ],
  },
];

if (typeof module !== "undefined") module.exports = ahbErgaenzungen;
