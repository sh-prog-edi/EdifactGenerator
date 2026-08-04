// golden.js - Golden-Master-Regression je Version/Sparte.
//
// Erzeugt alle PIDs des Ziels und vergleicht die Ausgabe zeichengenau mit einem
// eingefrorenen Snapshot (<dataDir>/golden/messages.json). Ändert eine Engine-Anpassung
// versehentlich die Ausgabe einer (auch älteren) Version, schlägt dieser Test an.
// So bleibt die zentrale Engine wartbar, ohne alte Versionen unbemerkt zu verändern.
//
//   node _engine/tests/golden.js            -> prüft gegen den Snapshot
//   node _engine/tests/golden.js --update   -> schreibt/aktualisiert den Snapshot
const fs = require('fs');
const path = require('path');
const { ladeGenerator, standardZiel } = require('./harness');

const update = process.argv.includes('--update');
const { engineDir, dataDir } = standardZiel();
// Festes Datum (01.10.2026 08:00 UTC) + festes Math.random -> reproduzierbare Ausgabe.
const FIXED_NOW = Date.UTC(2026, 9, 1, 8, 0, 0);
const G = ladeGenerator(engineDir, dataDir, { fixedNow: FIXED_NOW });

const goldenDir = path.join(dataDir, 'golden');
const goldenFile = path.join(goldenDir, 'messages.json');

const aktuell = {};
for (const pid of G.pids) aktuell[pid] = G.generiere(pid);

if (update) {
    fs.mkdirSync(goldenDir, { recursive: true });
    fs.writeFileSync(goldenFile, JSON.stringify(aktuell, null, 2) + '\n', 'utf8');
    console.log(`Golden-Snapshot geschrieben: ${Object.keys(aktuell).length} PIDs -> ${path.relative(process.cwd(), goldenFile)}`);
    process.exit(0);
}

if (!fs.existsSync(goldenFile)) {
    console.error('Kein Golden-Snapshot vorhanden. Erst erzeugen mit:  node _engine/tests/golden.js --update');
    process.exit(2);
}

const golden = JSON.parse(fs.readFileSync(goldenFile, 'utf8'));
let abweichungen = 0;
const alle = new Set([...Object.keys(golden), ...Object.keys(aktuell)]);
for (const pid of [...alle].sort()) {
    if (!(pid in golden)) { console.log(`${pid}: NEU (nicht im Snapshot)`); abweichungen++; continue; }
    if (!(pid in aktuell)) { console.log(`${pid}: FEHLT (im Snapshot, nicht mehr erzeugt)`); abweichungen++; continue; }
    if (golden[pid] !== aktuell[pid]) {
        console.log(`${pid}: ABWEICHUNG`);
        abweichungen++;
    }
}
if (abweichungen === 0) console.log(`Golden-Regression OK: ${G.pids.length} PIDs unverändert.`);
else console.log(`\n${abweichungen} Abweichung(en). Bei gewollter Änderung Snapshot aktualisieren (--update).`);
process.exit(abweichungen === 0 ? 0 : 1);
