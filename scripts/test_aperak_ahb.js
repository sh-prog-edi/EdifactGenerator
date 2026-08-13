// test_aperak_ahb.js — Regression für _engine/daten/aperak-ahb.js.
//
// Die negative APERAK meldet Verarbeitbarkeitsfehler über SG4 ERC DE9321 und
// beschreibt den Fehlerort als Freitext. Erzeugt von werkzeuge/lies_aperak_ahb.py
// aus dem AHB APERAK (Protokoll Abschnitt 78).
// Aufruf: node scripts/test_aperak_ahb.js
const A = require("../_engine/daten/aperak-ahb.js");

let fails = 0;
const ok = (b, t) => { console.log((b ? "  OK  " : " FAIL ") + t); if (!b) fails++; };

// ---- Codeliste -------------------------------------------------------------
const codes = A.aperakAhb.fehlercodes || [];
ok(codes.length >= 25, `ERC-Codeliste gelesen (${codes.length} Codes)`);
ok(codes.every(c => /^Z\d{2}$/.test(c[0])), "alle Codes im Format Z<nn>");
ok(codes.every(c => c[1] && c[1].length > 3), "zu jedem Code eine Bezeichnung");

// Reihenfolge/Dublettenfreiheit
const ids = codes.map(c => c[0]);
ok(new Set(ids).size === ids.length, "Codeliste ist dublettenfrei");

// ---- Stichproben gegen den AHB-Wortlaut -----------------------------------
ok(A.aperakFehlertext("Z10") === "ID unbekannt", 'Z10 = "ID unbekannt"');
ok(/Erforderliche Angabe für diesen Anwendungsfall fehlt/.test(A.aperakFehlertext("Z29")),
  "Z29 nennt die fehlende Pflichtangabe");
ok(/Format nicht eingehalten/.test(A.aperakFehlertext("Z35")), "Z35 = Format nicht eingehalten");
ok(A.aperakFehlertext("Z99") === "", "unbekannter Code liefert leeren Text");

// Beim ersten Extraktionslauf gingen diese drei Texte kaputt: Z14 verlor seine
// Fortsetzung an die dazwischenliegende Bedingungsspalte, Z40 brach mitten im
// Wort um, Z41 zog Strukturzeilen der Tabelle nach. Deshalb explizit geprüft.
ok(A.aperakFehlertext("Z14") === "Objekt im IT-System nicht gefunden",
  'Z14 vollständig ("… nicht gefunden", trotz eingeschobener Bedingungsspalte)');
ok(/Segmentgruppenwiederholbarkeit/.test(A.aperakFehlertext("Z40")),
  "Z40 ohne Umbruchartefakt im Wort");
ok(A.aperakFehlertext("Z41") === "Zeitangabe unplausibel",
  "Z41 ohne nachgezogene Strukturzeilen");

// ---- Codes mit Pflicht-Ortsangabe -----------------------------------------
// Der AHB nennt genau sieben Codes, bei denen FTX+Z02 anzugeben ist.
const erwartet = ["Z21", "Z29", "Z35", "Z38", "Z39", "Z40", "Z41"];
const ort = A.aperakAhb.mitOrtsangabe || [];
ok(ort.length === 7, `sieben Codes mit Pflicht-Ortsangabe (${ort.length})`);
erwartet.forEach(c => ok(A.aperakBrauchtOrtsangabe(c), `${c} verlangt eine Ortsangabe`));
ok(!A.aperakBrauchtOrtsangabe("Z10"),
  "Z10 (ID unbekannt) verlangt KEINE Ortsangabe — betrifft den Vorgang als Ganzes");
ok(!A.aperakBrauchtOrtsangabe("Z31"), "Z31 verlangt keine Ortsangabe");

// ---- Bedingungen -----------------------------------------------------------
const bed = A.aperakAhb.bedingungen || {};
ok(Object.keys(bed).length > 5, `Bedingungstexte gelesen (${Object.keys(bed).length})`);

console.log(`\n${fails === 0 ? "ALLE TESTS OK" : fails + " FEHLER"}`);
process.exit(fails ? 1 : 0);
