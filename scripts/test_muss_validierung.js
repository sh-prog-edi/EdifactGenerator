// test_muss_validierung.js
// Regressionstest fuer die Muss-Klassifikation des universellen Validators.
// Nachweis: fehlendes UNBEDINGTES Muss -> harter Fehler (fehlendeMuss);
//           fehlendes KONDITIONALES  Muss -> Warnung  (bedingteMuss);
//           vorhandenes Segment -> keine Meldung.
// Aufruf: node scripts/test_muss_validierung.js
const V = require("../_engine/ahb-validator.js");

let fails = 0;
const ok = (b, t) => { console.log((b ? "  OK  " : " FAIL ") + t); if (!b) fails++; };

// Synthetisches Meta: drei Pflicht-/Nicht-Pflicht-Segmente auf Nachrichtenebene.
const meta = { instanzen: [
  { sg: null, seg: "BGM", expr: "Muss",        section: "Beginn der Nachricht", des: [] },
  { sg: null, seg: "DTM", expr: "Muss [137]",  section: "Nachrichtendatum",     des: [] },
  { sg: null, seg: "RFF", expr: "Kann [12]",   section: "Referenz",             des: [] },
]};
const ctx = { meta, pruefi: "TEST" };

function baue(segmente) {
  return [
    "UNB+UNOC:3+9900000000001:500+9900000000002:500+261001:0800+REF++++++1'",
    "UNH+REF+ORDERS:D:09B:UN:1.4c'",
    ...segmente,
    "UNT+" + (segmente.length + 2) + "+REF'",
    "UNZ+1+REF'",
  ].join("\n");
}
const run = txt => V.validiere(V.parse(txt), ctx);

// 1) Alles vorhanden -> weder fehlendeMuss noch bedingteMuss
let r = run(baue(["BGM+E01+REF'", "DTM+137:202610010600?+00:303'"]));
ok(r.fehlendeMuss.length === 0, "vollstaendig: keine fehlenden Muss-Segmente (ist " + JSON.stringify(r.fehlendeMuss) + ")");
ok(r.bedingteMuss.length === 0, "vollstaendig: keine bedingten Muss-Warnungen (ist " + JSON.stringify(r.bedingteMuss) + ")");

// 2) BGM (unbedingtes Muss) fehlt -> harter Fehler
r = run(baue(["DTM+137:202610010600?+00:303'"]));
ok(r.fehlendeMuss.some(x => x.startsWith("BGM")), "BGM fehlt -> als harter Muss-Fehler gemeldet (ist " + JSON.stringify(r.fehlendeMuss) + ")");

// 3) DTM (konditionales Muss [137]) fehlt -> Warnung, KEIN harter Fehler
r = run(baue(["BGM+E01+REF'"]));
ok(r.bedingteMuss.some(x => x.startsWith("DTM")), "DTM fehlt -> als bedingtes Muss gewarnt (ist " + JSON.stringify(r.bedingteMuss) + ")");
ok(!r.fehlendeMuss.some(x => x.startsWith("DTM")), "DTM fehlt -> NICHT als harter Fehler (korrekt: nur Warnung)");

// 4) Kann-Segment fehlt -> gar keine Meldung
r = run(baue(["BGM+E01+REF'", "DTM+137:202610010600?+00:303'"]));
ok(!r.fehlendeMuss.some(x => x.startsWith("RFF")) && !r.bedingteMuss.some(x => x.startsWith("RFF")),
   "RFF (Kann) fehlt -> keine Muss-Meldung");

// 5) Gegenprobe zur ALTEN Logik: frueher wurde 'Muss [137]' voellig ignoriert.
//    Jetzt erscheint es mindestens als Warnung (Regression gegen das Durchrutschen).
r = run(baue(["BGM+E01+REF'"]));
ok((r.fehlendeMuss.length + r.bedingteMuss.length) > 0,
   "fehlendes konditionales Muss rutscht NICHT mehr unbemerkt durch");

console.log(fails ? ("\n" + fails + " Test(s) fehlgeschlagen.") : "\nAlle Muss-Validierungstests OK.");
process.exit(fails ? 1 : 0);
