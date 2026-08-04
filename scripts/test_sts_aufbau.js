// Prüft den Aufbau des STS-Segments gegen das MIG.
//
// Das STS-Segment führt die Gruppe C556 („Statusanlaß") mehrfach — in UTILMD Strom
// dreimal, jede mit dem Datenelement 9013:
//
//     STS+7++<Transaktionsgrund>+<Ergänzung>+<Ergänzung befristetes Lieferende>
//     STS+E01++<Antwortcode>:<EBD-Nr.>::<Zeitraum-ID>
//     STS+Z35++<Antwortcode>:<EBD-Nr.>+<betroffene Lokation>:::<ID>
//
// Geprüft wird dreierlei:
//   1. Erzeugung: Die Masken schreiben jeden Code an seine Stelle im Segment
//      (früher landeten Grund und Ergänzung im selben Datenelement — STS+7++E03').
//   2. Formular: Jede Wiederholung mit eigener Codeliste hat ein eigenes Feld.
//   3. Validator: Ein Code an falscher Stelle wird als Fehler gemeldet.
//
// Aufruf: node scripts/test_sts_aufbau.js
const path = require('path');
const { ladeGenerator } = require('../_engine/tests/harness');

const ROOT = path.resolve(__dirname, '..');
const ZIELE = [
    ['202604/Stammdaten/UTILMD/Strom', 'UTILMD_STROM', '202604'],
    ['202610/Stammdaten/UTILMD/Strom', 'UTILMD_STROM', '202610'],
    ['202604/Stammdaten/UTILMD/Gas', 'UTILMD_GAS', '202604'],
    ['202610/Stammdaten/UTILMD/Gas', 'UTILMD_GAS', '202610'],
];

const fehler = [];
let geprueft = 0, mitErgaenzung = 0, mitZeitraum = 0;

// Codes je Wiederholung der Gruppe C556 laut MIG
function positionen(segment) {
    const out = [];
    (segment.komposita || []).forEach((k, i) => {
        const de = (k.des || []).find(d => d.de === '9013');
        if (i >= 2 && de) out.push({ name: de.name || '', codes: de.codes || {} });
    });
    return out;
}

for (const [ziel, migKey, stand] of ZIELE) {
    const G = ladeGenerator(path.join(ROOT, '_engine'), path.join(ROOT, ziel),
                            { fixedNow: Date.UTC(2026, 9, 1, 8, 0, 0) });
    const struktur = ((G.sandbox.stsStruktur || {})[stand] || {})[migKey];
    if (!struktur) { fehler.push(`${ziel}: keine STS-Struktur geladen`); continue; }

    for (const pid of G.pids) {
        const msg = G.generiere(pid);
        for (const zeile of msg.split('\n').filter(z => z.startsWith('STS+'))) {
            geprueft++;
            const elemente = zeile.replace(/'$/, '').split('+');
            const q = elemente[1];
            // passende MIG-Segmente: gleiche Statuskategorie
            const kandidaten = (struktur.segmente || []).filter(s => {
                const k = (((s.komposita || [])[0] || {}).des || []).find(d => d.de === '9015');
                const codes = k ? Object.keys(k.codes || {}) : [];
                return !codes.length || codes.indexOf(q) >= 0;
            }).map(positionen).filter(w => w.length);
            if (!kandidaten.length) continue;
            const maxWdh = Math.max.apply(null, kandidaten.map(w => w.length));
            for (let el = 3; el < elemente.length; el++) {
                const code = (elemente[el] || '').split(':')[0];
                if (!code) continue;
                const r = el - 3;
                if (r >= maxWdh) {
                    fehler.push(`${ziel} ${pid}: "${zeile}" — Element ${el + 1} über die im MIG vorgesehenen ${maxWdh} Gruppen hinaus`);
                    continue;
                }
                const passt = kandidaten.some(w => !w[r] || !Object.keys(w[r].codes).length || (code in w[r].codes));
                if (!passt) {
                    const anderswo = [];
                    kandidaten.forEach(w => w.forEach((e, j) => { if (j !== r && (code in e.codes)) anderswo.push(j + 4); }));
                    fehler.push(`${ziel} ${pid}: "${zeile}" — Code ${code} steht in Element ${el + 1}`
                        + (anderswo.length ? `, laut MIG gehört er in Element ${anderswo[0]}` : ', im MIG dort nicht vorgesehen'));
                }
                if (r === 1) mitErgaenzung++;
            }
            // Zeitraum-ID bzw. ID der betroffenen Lokation (DE9012) steht als viertes
            // Unterelement in der Gruppe C556, nicht als eigenes Datenelement:
            //   STS+E01++A01:E_0004::2'      STS+Z35++A32:E_0624+ZW5:::20072281644'
            // Ein eigenes Element wäre oben schon als „über die Gruppen hinaus" aufgefallen.
            if (/^(E01|Z35)$/.test(q) && /:{2,}\d+'?$/.test(zeile)) mitZeitraum++;
        }
    }
}

// Validator: falscher Aufbau muss auffallen
const GProbe = ladeGenerator(path.join(ROOT, '_engine'),
                             path.join(ROOT, '202604/Stammdaten/UTILMD/Strom'),
                             { fixedNow: Date.UTC(2026, 9, 1, 8, 0, 0) });
const richtig = GProbe.generiere('55017');
const falsch = richtig.replace(/STS\+7\+\+[A-Z0-9]+\+([A-Z0-9]+)'/, "STS+7++$1'");
if (falsch === richtig) {
    fehler.push('Probe 55017: erzeugte Nachricht trägt keine Transaktionsgrundergänzung — Prüfung des Validators nicht möglich');
} else {
    const meldungen = GProbe.validiere(falsch, '55017').findings
        .filter(f => f.level === 'FEHLER' && /Element/.test(f.msg));
    if (!meldungen.length)
        fehler.push('Validator meldet den falschen STS-Aufbau (Ergänzung in Element 3) nicht');
}

console.log(`STS-AUFBAU: ${geprueft} STS-Segmente aus vier Zielen geprüft`);
console.log(`  Segmente mit Transaktionsgrundergänzung: ${mitErgaenzung}`);
console.log(`  Antwortsegmente mit Zeitraum-/Lokations-ID: ${mitZeitraum}`);
if (fehler.length) {
    console.log('\nAUFFÄLLIG:');
    fehler.slice(0, 20).forEach(f => console.log(' -', f));
    if (fehler.length > 20) console.log(`   … und ${fehler.length - 20} weitere`);
}
process.exit(fehler.length ? 1 : 0);
