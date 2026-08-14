// test_edi_zerlegung.js — Zerlegung der Übertragungsdatei: beide Leser gleich.
//
// Anlass (Sicherheitsaudit 13.08.2026, Protokoll Abschnitt 79, Befunde B10/B8):
//
// 1) Das Projekt hat ZWEI Leser für dieselbe Datei: `AhbValidator.parse` für die
//    Prüfung und `EdiUmbau.zerlege` für Umbau und Nachrichtenauswahl. `zerlege`
//    trennte über ein Lookbehind `(?<!?)'` — sah also nur das VORZEICHEN eines
//    Trenners an. Bei einem freigestellten Freistellungszeichen ("??") hält das
//    zweite `?` dann fälschlich den folgenden Trenner für freigestellt: Das
//    Segmentende verschwindet, zwei Segmente verschmelzen. Folgen: im Umbau geht
//    ein Segment verloren, im Ablehnungs-Abgleich verschiebt sich die
//    Segmentzählung gegenüber der CONTRL (UCS DE0096) — der Zeiger einer
//    Ablehnung landet dann auf dem falschen Segment. Behoben durch zeichenweises
//    Scannen, identisch zur Logik in `AhbValidator.parse`.
//
// 2) `EdiUmbau.nachrichten` schloss eine Nachricht nur am UNT. Fehlt das UNT —
//    also genau in der kaputten Datei, um die es bei einer Ablehnung geht —,
//    verschwand die Nachricht spurlos aus jeder Auswahl. Sie wird jetzt am
//    nächsten UNH, am UNZ oder am Dateiende geschlossen und als
//    `unvollstaendig` gekennzeichnet.
//
// Aufruf: node scripts/test_edi_zerlegung.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const V = require(path.join(ROOT, '_engine/ahb-validator.js'));
const U = new Function('window', 'document',
  fs.readFileSync(path.join(ROOT, '_engine/umbau.js'), 'utf8') + '\n;return EdiUmbau;')({}, {});

let fails = 0;
const ok = (b, t) => { console.log((b ? '  OK  ' : ' FAIL ') + t); if (!b) fails++; };

// ---- 1. Beide Leser zerlegen zeichengleich --------------------------------
const FAELLE = [
  ['freigestelltes Freistellungszeichen vor Segmentende',
    "UNA:+.? 'UNB+UNOC:3+A+B+260813:1200+REF'UNH+1+UTILMD:D:11A:UN:S1'" +
    "BGM+E01+AB??'DTM+137:202608131200:203'UNT+4+1'UNZ+1+REF'"],
  ['freigestellte Trenner in Elementen und Komponenten',
    "UNA:+.? 'UNB+UNOC:3+A+B+260813:1200+REF'UNH+1+UTILMD:D:11A:UN:S1'" +
    "BGM+E01+A?+B'FTX+Z02+++A?:B?'C'UNT+4+1'UNZ+1+REF'"],
  ['ohne UNA-Segment (Standardtrennzeichen)',
    "UNB+UNOC:3+A+B+260813:1200+REF'UNH+1+UTILMD:D:11A:UN:S1'" +
    "BGM+E01+ohne UNA??'DTM+137:1:203'UNT+4+1'UNZ+1+REF'"],
  ['mehrere Freistellungspaare hintereinander',
    "UNA:+.? 'UNB+UNOC:3+A+B+260813:1200+REF'UNH+1+UTILMD:D:11A:UN:S1'" +
    "BGM+E01+????'DTM+137:1:203'UNT+4+1'UNZ+1+REF'"],
  ['unveränderte Normalnachricht (Rückwärtskompatibilität)',
    "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260803:0800+DAR1++++++1'" +
    "UNH+MSG1+UTILMD:D:11A:UN:S2.1'BGM+E01+DOK1'DTM+137:202608030800?+00:303'" +
    "NAD+MS+9900000000001::293'UNT+5+MSG1'UNZ+1+DAR1'"],
];

for (const [name, text] of FAELLE) {
  const a = U.zerlege(text).map(s => s.tag + '|' + JSON.stringify(s.elemente));
  const b = V.parse(text).segmente.map(s => s.tag + '|' + JSON.stringify(s.elemente));
  ok(JSON.stringify(a) === JSON.stringify(b),
    `zerlege == parse: ${name}` + (JSON.stringify(a) === JSON.stringify(b) ? ''
      : `\n         umbau: ${JSON.stringify(a)}\n         valid: ${JSON.stringify(b)}`));
}

// Der ursprüngliche Befund noch einmal ausdrücklich: das DTM darf nicht fehlen.
const tags = U.zerlege(FAELLE[0][1]).map(s => s.tag);
ok(tags.join(',') === 'UNB,UNH,BGM,DTM,UNT,UNZ',
  `kein Segment verschluckt nach "??" (ist ${tags.join(',')})`);

// Serialisieren bleibt verlustfrei: zerlegen -> serialisieren -> zerlegen.
for (const [name, text] of FAELLE) {
  const einmal = U.zerlege(text);
  const zweimal = U.zerlege(U.serialisiere(einmal));
  ok(JSON.stringify(einmal) === JSON.stringify(zweimal),
    `Rundlauf zerlege->serialisiere->zerlege stabil: ${name}`);
}

// ---- 2. Nachricht ohne UNT verschwindet nicht -----------------------------
const n = t => U.nachrichten(U.zerlege(t));

const ZWEI_OK = "UNB+U+A+B+1:1+R'UNH+1+X:D:1:UN:S'BGM+E01+D1'UNT+3+1'" +
  "UNH+2+X:D:1:UN:S'BGM+E01+D2'UNT+3+2'UNZ+2+R'";
const ZWEITE_OHNE_UNT = "UNB+U+A+B+1:1+R'UNH+1+X:D:1:UN:S'BGM+E01+D1'UNT+3+1'" +
  "UNH+2+X:D:1:UN:S'BGM+E01+D2'UNZ+2+R'";
const ERSTE_OHNE_UNT = "UNB+U+A+B+1:1+R'UNH+1+X:D:1:UN:S'BGM+E01+D1'" +
  "UNH+2+X:D:1:UN:S'BGM+E01+D2'UNT+3+2'UNZ+2+R'";
const ABGESCHNITTEN = "UNB+U+A+B+1:1+R'UNH+1+X:D:1:UN:S'BGM+E01+D1'";

const a1 = n(ZWEI_OK);
ok(a1.length === 2 && !a1.some(x => x.unvollstaendig),
  'vollständige Datei: zwei Nachrichten, keine als unvollständig gemeldet');

const a2 = n(ZWEITE_OHNE_UNT);
ok(a2.length === 2 && a2[1].unvollstaendig === true && a2[1].bgm === 'D2',
  'letzte Nachricht ohne UNT bleibt erhalten und ist als unvollständig markiert');

const a3 = n(ERSTE_OHNE_UNT);
ok(a3.length === 2 && a3[0].unvollstaendig === true && a3[1].unvollstaendig === undefined,
  'erste Nachricht ohne UNT bleibt erhalten, die zweite bleibt vollständig');
ok(a3[0].bis === a3[1].von,
  'Bereichsgrenzen bleiben lückenlos (kein Segment fällt zwischen die Nachrichten)');

const a4 = n(ABGESCHNITTEN);
ok(a4.length === 1 && a4[0].unvollstaendig === true && a4[0].bis === U.zerlege(ABGESCHNITTEN).length,
  'abgeschnittene Datei ohne UNT und UNZ: Nachricht reicht bis zum Dateiende');

ok(n("UNB+U+A+B+1:1+R'UNZ+0+R'").length === 0,
  'Datei ohne jede Nachricht liefert weiterhin eine leere Liste');

console.log(`\n${fails === 0 ? 'ALLE TESTS OK' : fails + ' FEHLER'}`);
process.exit(fails ? 1 : 0);
