// pruefe_paket.js — Paket-/Repo-Vollständigkeit als ausführbare Checks.
//
// Macht die bisher als Prosa gepflegten Auslieferungs-Konventionen maschinell prüfbar
// (Phase 1 der Neustrukturierung). Läuft lokal (npm run paket) und in der CI vor jedem
// Release. Exit-Code 0 nur, wenn alle Checks bestehen.
//
// Checks:
//   1. Keine BDEW-Originaldokumente im Repo (*.pdf, *.docx, *.xlsx dürfen nie
//      eingecheckt sein — Lizenzlage, siehe README „Lizenz, Quellen und Haftung").
//   2. Bedingungs-Hilfe überall: jede HTML-Seite, die _bedingungen.js lädt, lädt auch
//      bedingung-hilfe.js (Lehre aus dem Patch-Verlust vom 28.07.2026).
//   3. Golden-Snapshots vorhanden und nicht leer für alle vier UTILMD-Ziele.
//   4. Keine absoluten Container-Pfade (/mnt/user-data/…) in JS/Python (Lehre aus
//      Phase 0: solche Pfade machen die Regression in jeder neuen Umgebung rot).
//   5. Kernartefakte vorhanden: LICENSE, README.md, CHANGELOG.md, .gitignore,
//      docs/UEBERGABE.md, package.json.
//   6. Playwright exakt gepinnt (keine ^/~-Range — Browser-Build muss zur Version passen).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const wurzel = path.join(__dirname, '..');

let fehler = 0;
function pruefe(name, ok, detail) {
    console.log(`${ok ? 'OK    ' : 'FEHLER'}  ${name}${!ok && detail ? ' — ' + detail : ''}`);
    if (!ok) fehler++;
}

// Alle versionierten Dateien (Maßstab ist das Repo, nicht der Arbeitsordner).
const tracked = execSync('git ls-files', { cwd: wurzel, encoding: 'utf8' })
    .split('\n').filter(Boolean);

// 1. Keine BDEW-Originaldokumente.
const dokumente = tracked.filter(f => /\.(pdf|docx|xlsx)$/i.test(f));
pruefe('Keine BDEW-Originaldokumente (*.pdf/*.docx/*.xlsx) versioniert',
    dokumente.length === 0, dokumente.slice(0, 5).join(', '));

// 2. Bedingungs-Hilfe überall, wo Bedingungen geladen werden.
const htmlSeiten = tracked.filter(f => f.endsWith('.html'));
const ohneHilfe = htmlSeiten.filter(f => {
    const t = fs.readFileSync(path.join(wurzel, f), 'utf8');
    return t.includes('_bedingungen.js') && !t.includes('bedingung-hilfe.js');
});
pruefe(`Bedingungs-Hilfe in allen Seiten mit _bedingungen.js (${htmlSeiten.length} HTML geprüft)`,
    ohneHilfe.length === 0, ohneHilfe.join(', '));

// 3. Golden-Snapshots der vier UTILMD-Ziele.
const GOLDEN_ZIELE = [
    '202604/Stammdaten/UTILMD/Strom', '202604/Stammdaten/UTILMD/Gas',
    '202610/Stammdaten/UTILMD/Strom', '202610/Stammdaten/UTILMD/Gas',
];
for (const ziel of GOLDEN_ZIELE) {
    const p = path.join(wurzel, ziel, 'golden', 'messages.json');
    let anzahl = 0;
    try { anzahl = Object.keys(JSON.parse(fs.readFileSync(p, 'utf8'))).length; } catch (e) { /* fehlt */ }
    pruefe(`Golden-Snapshot ${ziel} (${anzahl} PIDs)`, anzahl > 0);
}

// 4. Keine absoluten Container-Pfade. (Dieses Skript selbst ist ausgenommen —
// es enthält den Suchbegriff zwangsläufig als Literal.)
const codeDateien = tracked.filter(f =>
    /\.(js|py)$/.test(f) && f !== 'scripts/pruefe_paket.js');
const mitAbsolut = codeDateien.filter(f =>
    fs.readFileSync(path.join(wurzel, f), 'utf8').includes('/mnt/user-data'));
pruefe(`Keine absoluten Container-Pfade in JS/Python (${codeDateien.length} Dateien geprüft)`,
    mitAbsolut.length === 0, mitAbsolut.join(', '));

// 5. Kernartefakte.
for (const f of ['LICENSE', 'README.md', 'CHANGELOG.md', '.gitignore', 'docs/UEBERGABE.md', 'package.json']) {
    pruefe(`Kernartefakt ${f}`, fs.existsSync(path.join(wurzel, f)));
}

// 6. Playwright exakt gepinnt.
const pkg = JSON.parse(fs.readFileSync(path.join(wurzel, 'package.json'), 'utf8'));
const pw = (pkg.devDependencies || {}).playwright || '';
pruefe(`Playwright exakt gepinnt (${pw})`, /^\d/.test(pw),
    'Version muss exakt sein (ohne ^/~), damit der Browser-Build passt');

console.log(fehler === 0 ? '\nPAKET-PRÜFUNG BESTANDEN.' : `\nPAKET-PRÜFUNG: ${fehler} Fehler.`);
process.exit(fehler === 0 ? 0 : 1);
