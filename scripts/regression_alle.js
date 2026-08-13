// regression_alle.js — Regressionstreiber über alle Ziele.
//
// Ersetzt die manuelle Aufruf-Liste (export EDIGEN_TARGET=… je Ziel) aus der Übergabe.
// Aufrufe:
//   node scripts/regression_alle.js              volle Regression (inkl. Playwright-Tests)
//   node scripts/regression_alle.js --schnell    nur Node-Kern (ohne Browser, < 1 Minute)
//   node scripts/regression_alle.js --golden-update   Golden-Snapshots NEU setzen (nur bei
//                                                     GEWOLLTER Änderung — mit Bedacht!)
// Exit-Code 0 nur, wenn alle harten Prüfungen bestehen. Die Selbstvalidierung ist
// informativ (dokumentierte Befunde, siehe docs/OFFENE_ASPEKTE.md Punkt D) und wird
// mit ihrer Fehlerzahl gemeldet, bricht die Regression aber nicht.
const { spawnSync } = require('child_process');
const path = require('path');
const wurzel = path.join(__dirname, '..');

const schnell = process.argv.includes('--schnell');
const goldenUpdate = process.argv.includes('--golden-update');

// Die vier Ziele mit Golden-Snapshot (kuratierte UTILMD-Masken).
const GOLDEN_ZIELE = [
    '202604/Stammdaten/UTILMD/Strom',
    '202604/Stammdaten/UTILMD/Gas',
    '202610/Stammdaten/UTILMD/Strom',
    '202610/Stammdaten/UTILMD/Gas',
];

// Globale Node-Tests ohne Browser.
const NODE_TESTS = [
    'scripts/pruefe_paket.js',
    'scripts/pruefe_pid_konsistenz.js',
    'scripts/test_bedingung_hart.js',
    'scripts/test_muss_validierung.js',
    'scripts/test_sts_aufbau.js',
    'scripts/test_de_muss_praesenz.js',
];

// Browser-Tests (Playwright; Reihenfolge wie in der Übergabe dokumentiert).
const BROWSER_TESTS = [
    'scripts/test_utilmd_seiten.js',
    'scripts/test_engine_pages.js',
    'scripts/test_html_escaping.js',
    'scripts/test_edi_escaping.js',
    'scripts/test_folgenachrichten.js',
    'scripts/test_vorgangsnummer.js',
    'scripts/test_abhaengige_segmente.js',
    'scripts/test_antwortcodes.js',
    'scripts/test_antwortketten.js',
    'scripts/test_bedingung_hilfe.js',
    'scripts/test_ebd_abhaengigkeiten.js',
    'scripts/test_version_zustaendigkeit.js',
    'scripts/test_zeitscheiben.js',
    'scripts/test_layout_kalender.js',        // läuft rund 4 Minuten
    'scripts/test_nachricht_speichern.js',    // läuft rund 2 Minuten
    'scripts/test_umbau.js',
    'scripts/test_umbau_pidzerlegung.js',
    'scripts/test_validator_komponenten.js',
    'scripts/test_validator_mehrfach.js',
    'scripts/test_ablehnung_abgleich.js',
];

let hart = 0, weich = 0;
const protokoll = [];

function lauf(name, skript, opts = {}) {
    const t0 = Date.now();
    const r = spawnSync('node', [skript, ...(opts.args || [])], {
        cwd: wurzel,
        env: { ...process.env, ...(opts.env || {}) },
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
    });
    const dauer = ((Date.now() - t0) / 1000).toFixed(1);
    const out = (r.stdout || '') + (r.stderr || '');
    let status;
    if (opts.informativ) {
        const m = /Gesamt Fehler über alle PIDs:\s*(\d+)/.exec(out);
        status = m ? `informativ (${m[1]} dokumentierte Befunde)` : 'informativ';
        weich += 0;
    } else if (r.status === 0) {
        status = 'OK';
    } else {
        status = `FEHLER (Exit ${r.status})`;
        hart++;
        // Bei Fehlern die letzten Zeilen der Ausgabe zeigen.
        console.log(`\n----- Ausgabe ${name} (Ende) -----`);
        console.log(out.split('\n').slice(-25).join('\n'));
        console.log('----------------------------------');
    }
    protokoll.push({ name, status, dauer });
    console.log(`${status.padEnd(38)} ${dauer.padStart(7)}s  ${name}`);
}

console.log(`Regression ${schnell ? '(schnell, ohne Browser)' : '(voll)'} — ${new Date().toISOString()}\n`);

// 1. Je Golden-Ziel: domsim, golden, selfvalidate.
for (const ziel of GOLDEN_ZIELE) {
    const env = { EDIGEN_TARGET: ziel };
    lauf(`domsim ${ziel}`, '_engine/tests/domsim.js', { env });
    lauf(`golden ${ziel}`, '_engine/tests/golden.js',
        { env, args: goldenUpdate ? ['--update'] : [] });
    lauf(`selfvalidate ${ziel}`, '_engine/tests/selfvalidate.js', { env, informativ: true });
}

// 2. Globale Node-Tests (pruefe_pid_konsistenz deckt alle 32 Ziele ab).
for (const t of NODE_TESTS) lauf(path.basename(t), t);

// 3. Browser-Tests.
if (!schnell) {
    for (const t of BROWSER_TESTS) lauf(path.basename(t), t);
} else {
    console.log('\n(Browser-Tests übersprungen — volle Regression: npm run regression)');
}

console.log('\n================ Zusammenfassung ================');
for (const p of protokoll) console.log(`${p.status.padEnd(38)} ${p.dauer.padStart(7)}s  ${p.name}`);
console.log(hart === 0
    ? `\nREGRESSION GRÜN (${protokoll.length} Läufe).`
    : `\nREGRESSION ROT: ${hart} harte(r) Fehler.`);
process.exit(hart === 0 ? 0 : 1);
