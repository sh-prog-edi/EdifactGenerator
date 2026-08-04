// analyse_selbstvalidierung.js — Phase 2.1: vollständige Befundliste der
// Selbstvalidierung über alle vier Golden-Ziele, klassifiziert.
//
// Klassen:
//   muss_fehlt        Muss-Segment/Feld in der Testnachricht nicht befüllt —
//                     erwartbar (offener Punkt D), NICHT Teil der Entscheidungsliste.
//   codewert          Wert außerhalb der AHB-Codeliste („laut AHB zulässig sind …").
//   nicht_vorgesehen  Segment/Qualifier, das der AHB der Prüf-ID nicht führt.
//   sonstig           alles Übrige.
//
// Ausgabe: JSON nach stdout (eine Zeile je Befund) für die Weiterverarbeitung.
// Aufruf: node scripts/analyse_selbstvalidierung.js > /tmp/befunde.jsonl
const path = require('path');
process.env.EDIGEN_TARGET = process.env.EDIGEN_TARGET || '';

const ZIELE = [
    '202604/Stammdaten/UTILMD/Strom',
    '202604/Stammdaten/UTILMD/Gas',
    '202610/Stammdaten/UTILMD/Strom',
    '202610/Stammdaten/UTILMD/Gas',
];

const { ladeGenerator } = require('../_engine/tests/harness');
const wurzel = path.join(__dirname, '..');

function klassifiziere(msg) {
    if (/nicht befüllt|Muss-Segment/i.test(msg)) return 'muss_fehlt';
    if (/laut AHB zulässig/i.test(msg)) return 'codewert';
    if (/nicht vorgesehen/i.test(msg)) return 'nicht_vorgesehen';
    return 'sonstig';
}

const zaehler = {};
for (const ziel of ZIELE) {
    const engineDir = path.join(wurzel, '_engine');
    const dataDir = path.join(wurzel, ziel);
    const G = ladeGenerator(engineDir, dataDir);
    for (const pid of G.pids) {
        const nachricht = G.generiere(pid);
        const r = G.validiere(nachricht, pid);
        for (const f of r.findings.filter(x => x.level === 'FEHLER')) {
            const art = klassifiziere(f.msg);
            zaehler[art] = (zaehler[art] || 0) + 1;
            if (art === 'muss_fehlt') continue;   // erwartbar, nicht Teil der Liste
            console.log(JSON.stringify({
                ziel, pid, seg: f.seg, art, msg: f.msg,
            }));
        }
    }
}
console.error('Verteilung:', JSON.stringify(zaehler));
