// antwort-mappings.js - Kuratierte Zuordnung: eingehende Nachricht -> mögliche
// Antwortnachrichten (vorbefülltes Generator-Formular). Belege je Zuordnung:
// die Ziel-Prüf-IDs führen RFF+AAG (Angebotsnummer) bzw. DOC/MOA/RFF+ACW.
//
// Feldadressierung Ziel: seg + optional qualDe/qual (Qualifier-DE und -Code der
// Ziel-Instanz) + de (zu setzendes DE). bereich: kopf | pos | schluss.
// Quelle: seg/qual/de wie im Validator-Decoder; unh:true = UNH-Referenz (0062);
// konv: 'datum303' wandelt CCYYMMDDHHMM+00 in das Formularformat TT.MM.JJJJ HH:MM.
var antwortMappings = [
  {
    quelleFormat: "QUOTES",
    ziele: [{
      label: "Bestellung (ORDERS) zum Angebot erzeugen",
      zielFormat: "ORDERS",
      // Angebots-Prüf-ID -> Bestell-Prüf-ID (AHB-Paare, je mit RFF+AAG belegt)
      pruefiMap: { "15001": "17001", "15002": "17005", "15003": "17007",
                   "15004": "17131", "15005": "17011" },
      tauscheRichtung: true,
      felder: [
        { seg: "RFF", qualDe: "1153", qual: "AAG", de: "1154", bereich: "kopf",
          quelle: { seg: "BGM", de: "1004" } },
        { seg: "RFF", qualDe: "1153", qual: "ACW", de: "1154", bereich: "kopf",
          quelle: { unh: true } },
      ],
      positionen: {
        quelleSeg: "LIN",
        felder: [
          { seg: "RFF", qualDe: "1153", qual: "Z03", de: "1154",
            quelle: { de: "1082" } },
          { seg: "PIA", de: "7140", quelle: { de: "7140" } },
        ],
      },
    }],
  },
  {
    quelleFormat: "INVOIC",
    ziele: [
      {
        label: "Zahlungsavis (REMADV 33001 – Bestätigung) erzeugen",
        zielFormat: "REMADV",
        pruefiFest: "33001",
        tauscheRichtung: true,
        felder: [
          { seg: "BGM", de: "1001", bereich: "kopf", wertFest: "481" },
          { seg: "MOA", qualDe: "5025", qual: "12", de: "5004", bereich: "schluss",
            quelle: { seg: "MOA", qual: "9", de: "5004" } },
        ],
        positionen: {
          einzeln: true,  // eine Position (SG5) je Quellrechnung
          felder: [
            { seg: "DOC", qualDe: "1001", de: "1001", quelle: { seg: "BGM", de: "1001" } },
            { seg: "DOC", de: "1004", quelle: { seg: "BGM", de: "1004" } },
            { seg: "MOA", qualDe: "5025", qual: "9", de: "5004",
              quelle: { seg: "MOA", qual: "9", de: "5004" } },
            { seg: "MOA", qualDe: "5025", qual: "12", de: "5004",
              quelle: { seg: "MOA", qual: "9", de: "5004" } },
            { seg: "DTM", qualDe: "2005", qual: "137", de: "2380",
              quelle: { seg: "DTM", qual: "137", de: "2380", konv: "datum303" } },
            { seg: "RFF", qualDe: "1153", qual: "ACW", de: "1154", quelle: { unh: true } },
          ],
        },
      },
      {
        label: "Abweisung (REMADV 33002) erzeugen",
        zielFormat: "REMADV",
        pruefiFest: "33002",
        tauscheRichtung: true,
        hinweis: "Antwortcode (AJT, EBD) im Formular wählen.",
        felder: [
          { seg: "BGM", de: "1001", bereich: "kopf", wertFest: "239" },
          { seg: "MOA", qualDe: "5025", qual: "12", de: "5004", bereich: "schluss",
            wertFest: "0" },
        ],
        positionen: {
          einzeln: true,
          felder: [
            { seg: "DOC", qualDe: "1001", de: "1001", quelle: { seg: "BGM", de: "1001" } },
            { seg: "DOC", de: "1004", quelle: { seg: "BGM", de: "1004" } },
            { seg: "MOA", qualDe: "5025", qual: "9", de: "5004",
              quelle: { seg: "MOA", qual: "9", de: "5004" } },
            { seg: "MOA", qualDe: "5025", qual: "12", de: "5004", wertFest: "0" },
            { seg: "DTM", qualDe: "2005", qual: "137", de: "2380",
              quelle: { seg: "DTM", qual: "137", de: "2380", konv: "datum303" } },
            { seg: "RFF", qualDe: "1153", qual: "ACW", de: "1154", quelle: { unh: true } },
          ],
        },
      },
    ],
  },
];
if (typeof module !== 'undefined') module.exports = antwortMappings;
