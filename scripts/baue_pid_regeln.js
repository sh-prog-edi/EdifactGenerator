// baue_pid_regeln.js — Phase 2 (Feldauswahl-Umbau): einmalige Migration der
// kuratierten Einzeldateien <PID>.js in EINE Datendatei je Ziel.
//
// Vorher: 553 handgepflegte pruef-ids/NNNNN.js + _pid-registry.js (Globale
//         ahbRules<PID> -> ahbRulesByPrufId).
// Nachher: pruef-ids/_regeln.js — reine Daten (JSON), definiert ahbRulesByPrufId
//          direkt. Die Regeln sind damit Datenschicht, kein Code mehr.
//
// Sicherung: Jede Regel wird per JSON-Roundtrip geprüft (Regeldateien sind reine
// Daten — enthielte eine Funktionen o. Ä., bricht die Migration ab). Nach der
// Migration MUSS die Golden-Regression OHNE Snapshot-Update grün sein — der
// Beweis, dass die Umstellung die erzeugten Nachrichten nicht verändert.
//
// Zusätzlich wird je Ziel der Meta-Abgleich gemessen: wie viele Regel-Felder
// lassen sich einer Instanz der Formular-Meta zuordnen (Vorarbeit für den
// nächsten Schritt: Feldauswahl als Sicht auf die Meta).
//
// Aufruf: node scripts/baue_pid_regeln.js [--loeschen]
//   ohne --loeschen: _regeln.js erzeugen/aktualisieren, Einzeldateien bleiben
//   mit --loeschen:  zusätzlich Einzeldateien + _pid-registry.js entfernen
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const wurzel = path.join(__dirname, '..');

const ZIELE = [
    '202604/Stammdaten/UTILMD/Strom',
    '202604/Stammdaten/UTILMD/Gas',
    '202610/Stammdaten/UTILMD/Strom',
    '202610/Stammdaten/UTILMD/Gas',
];
const loeschen = process.argv.includes('--loeschen');

function ladeVar(datei, varName) {
    const quelle = fs.readFileSync(datei, 'utf8');
    return (0, eval)(quelle + `\n${varName};`);
}

for (const ziel of ZIELE) {
    const pd = path.join(wurzel, ziel, 'pruef-ids');
    const dateien = fs.readdirSync(pd).filter(f => /^\d{5}\.js$/.test(f)).sort();
    if (!dateien.length) {
        console.log(`${ziel}: keine Einzeldateien mehr — Migration bereits erfolgt.`);
        continue;
    }
    const regeln = {};
    for (const f of dateien) {
        const regel = require(path.join(pd, f));
        // Reine-Daten-Garantie: JSON-Roundtrip muss verlustfrei sein.
        assert.deepStrictEqual(JSON.parse(JSON.stringify(regel)), regel,
            `${ziel}/${f}: Regel ist nicht rein JSON-serialisierbar`);
        regeln[f.replace('.js', '')] = regel;
    }

    // Meta-Abgleich (informativ): Felder, die sich einer Meta-Instanz zuordnen lassen.
    let felder = 0, adressiert = 0;
    const meta = ladeVar(path.join(pd, '_form-meta.js'), 'formMeta');
    for (const [pid, r] of Object.entries(regeln)) {
        const inst = ((meta[pid] || {}).instanzen) || [];
        for (const s of (r.segments || [])) {
            felder++;
            const tag = String(s.id || '').split('_')[0];
            const qual = String(s.id || '').split('_')[1] || null;
            const treffer = inst.filter(i => i.seg === tag).some(i => !qual
                || (i.des || []).some(d => (d.codes || []).some(c => (Array.isArray(c) ? c[0] : c) === qual)));
            if (treffer) adressiert++;
        }
    }

    const inhalt = `// _regeln.js — Regel-/Feldauswahl-Daten je Prüf-ID (${ziel}).
// GENERIERT durch scripts/baue_pid_regeln.js aus den früheren Einzeldateien
// <PID>.js (Phase 2, Feldauswahl-Umbau — Protokoll Abschnitt 39). Ersetzt die
// Einzeldateien und die _pid-registry.js. Reine Datendatei: Änderungen hier
// direkt vornehmen (bzw. künftig über den Engine-Weg), keine Globale je PID mehr.
const ahbRulesByPrufId = ${JSON.stringify(regeln, null, 1)};
if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;
`;
    fs.writeFileSync(path.join(pd, '_regeln.js'), inhalt);
    console.log(`${ziel}: ${dateien.length} Regeldateien -> _regeln.js `
        + `(${(inhalt.length / 1024).toFixed(0)} KB) · Meta-Abgleich: ${adressiert}/${felder} Felder adressierbar`);

    if (loeschen) {
        for (const f of dateien) fs.unlinkSync(path.join(pd, f));
        const reg = path.join(pd, '_pid-registry.js');
        if (fs.existsSync(reg)) fs.unlinkSync(reg);
        console.log(`${ziel}: ${dateien.length} Einzeldateien + _pid-registry.js entfernt.`);
    }
}
