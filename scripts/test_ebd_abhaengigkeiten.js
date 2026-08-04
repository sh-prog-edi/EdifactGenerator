// Prüft, dass die Auswahl der Antwortcodes den Prüfschritten der Entscheidungsbäume folgt.
//
// Ein EBD führt über Prüfschritte zu seinen Antwortcodes. Fragt ein Schritt nach etwas,
// das in der Nachricht steht, ist schon vor der Auswahl klar, welche Codes erreichbar
// sind. Beispiel E_0614 (Kündigung Vertrag prüfen):
//
//     Schritt 10: „Wurde im Geschäftsvorfall angegeben, dass es sich um eine
//                  verbrauchende Marktlokation handelt?"
//         ja   -> A01, A03 … A09        nein -> A10, A12, A17, A18
//
// Wer im STS+7 die Ergänzung ZW4 meldet, darf A12/A17 also nicht angeboten bekommen.
//
// Geprüft wird dreierlei:
//   1. Datenlage: Zu jedem im AHB genannten EBD liegen Prüfschritte und Wege vor.
//   2. Logik: Der Filter entfernt genau die Codes des jeweils anderen Zweigs und
//      räumt die Auswahl nie vollständig leer.
//   3. Formular: Kuratierte Maske und Vollformular zeigen die gefilterte Auswahl und
//      führen sie nach, wenn die Ergänzung gewechselt wird.
//
// Aufruf: node scripts/test_ebd_abhaengigkeiten.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
global.ebdAntwortcodes = require(path.join(ROOT, '_engine/daten/ebd-antwortcodes.js'));
global.ebdPfade = require(path.join(ROOT, '_engine/daten/ebd-pfade.js'));
const A = require(path.join(ROOT, '_engine/antwortcode-auswahl.js'));

const fehler = [];
let geprueft = 0, mitWirkung = 0, entfernt = 0;

// ---- 1. + 2. Datenlage und Logik ----------------------------------------
const KONTEXTE = [
    ['ZW4 verbrauchende MaLo', { lokationsart: 'verbrauchend' }],
    ['ZW3 erzeugende MaLo', { lokationsart: 'erzeugend' }],
    ['ZW5 Tranche', { lokationsart: 'tranche' }],
    ['ZAP ruhende MaLo', { lokationsart: 'ruhend' }],
    ['ZW0 Geschäftsvorfall 1', { geschaeftsvorfall: '1' }],
    ['ZW6 pauschale MaLo', { messtechnik: 'pauschal' }],
];

for (const stand of ['202604', '202610']) {
    for (const sparte of ['Strom', 'Gas']) {
        const basis = path.join(ROOT, stand, 'Stammdaten/UTILMD', sparte, 'pruef-ids');
        if (!fs.existsSync(basis)) continue;
        const prozess = require(path.join(basis, '_prozess-meta.js'));
        const quelle = fs.readFileSync(path.join(basis, '_form-meta.js'), 'utf8');
        const meta = (0, eval)(quelle + '\nformMeta;');

        for (const pid of Object.keys(meta)) {
            const m = prozess[pid];
            if (!m || m.art === 'anfrage') continue;
            const ebds = [];
            (meta[pid].instanzen || []).forEach(i => {
                if (i.seg !== 'STS') return;
                const kat = ((i.des.find(d => d.de === '9015') || {}).codes || []).map(c => c[0]);
                if (!kat.includes('E01')) return;
                ((i.des.find(d => d.de === '1131') || {}).codes || []).forEach(c => {
                    if (!ebds.includes(c[0])) ebds.push(c[0]);
                });
            });
            if (!ebds.length && m.ebd) ebds.push(m.ebd);
            if (!ebds.length) continue;
            geprueft++;
            const cluster = m.antwortcluster === 'ablehnung' ? 'Ablehnung'
                          : (m.antwortcluster === 'zustimmung' ? 'Zustimmung' : '');
            const ohne = A.auswahl(ebds, cluster, m.antwortcode, stand, {});
            if (!ohne.optionen.length) continue;
            for (const [name, kontext] of KONTEXTE) {
                const mit = A.auswahl(ebds, cluster, m.antwortcode, stand, kontext);
                if (!mit.optionen.length) {
                    fehler.push(`${stand} ${sparte} ${pid} (${name}): Auswahl leer — der Filter darf nie alle Codes entfernen`);
                    continue;
                }
                const zusatz = mit.optionen.filter(o => !ohne.optionen.some(x => x.v === o.v));
                if (zusatz.length)
                    fehler.push(`${stand} ${sparte} ${pid} (${name}): Filter fügt Codes hinzu (${zusatz.map(o => o.code).join(',')})`);
                const weg = ohne.optionen.length - mit.optionen.length;
                if (weg > 0) { mitWirkung++; entfernt += weg; }
            }
        }
    }
}

// Gegenprobe an einem bekannten Baum: E_0614 trennt sauber in zwei Zweige.
(function probeE0614() {
    const baum = (global.ebdPfade['202604'] || {})['E_0614'];
    if (!baum || !baum.bedingungen) { fehler.push('E_0614: keine Prüfschritte in ebd-pfade.js'); return; }
    const alleCodes = Object.keys(baum.bedingungen || {});
    const verbrauchend = alleCodes.filter(c => A.codeErreichbar(baum, c, { lokationsart: 'verbrauchend' }));
    const erzeugend = alleCodes.filter(c => A.codeErreichbar(baum, c, { lokationsart: 'erzeugend' }));
    ['A12', 'A17'].forEach(c => {
        if (verbrauchend.includes(c)) fehler.push(`E_0614: ${c} ist bei verbrauchender Marktlokation nicht erreichbar, wird aber angeboten`);
        if (!erzeugend.includes(c)) fehler.push(`E_0614: ${c} fehlt im Zweig ohne verbrauchende Marktlokation`);
    });
    ['A03', 'A09'].forEach(c => {
        if (!verbrauchend.includes(c)) fehler.push(`E_0614: ${c} fehlt im Zweig der verbrauchenden Marktlokation`);
        if (erzeugend.includes(c)) fehler.push(`E_0614: ${c} gehört nicht in den Zweig ohne verbrauchende Marktlokation`);
    });
    // Ohne Angabe bleibt alles wählbar
    const offen = alleCodes.filter(c => A.codeErreichbar(baum, c, {}));
    if (offen.length !== alleCodes.length)
        fehler.push('E_0614: ohne Angabe der Lokationsart darf nicht gefiltert werden');
})();

// ---- 3. Formular ---------------------------------------------------------
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('pageerror', e => fehler.push(`JS-Fehler: ${e.message}`));

    // Kuratierte Maske: Wechsel der Ergänzung ändert die Auswahl
    await page.goto(`file://${ROOT}/Stammdaten/UTILMD/Strom/index.html?stand=202604`, { waitUntil: 'load' });
    const kur = await page.evaluate(async () => {
        const aus = {};
        for (const erg of ['ZW4', 'ZW3']) {
            document.getElementById('prufId').value = '55017';
            renderForm();
            const f = document.getElementById('STS_7');
            if (!f || !Array.from(f.options).some(o => o.value === erg)) continue;
            f.value = erg;
            generateEdifact();
            await new Promise(r => setTimeout(r, 50));
            const sel = document.getElementById('STS_E01');
            aus[erg] = Array.from(sel.options).map(o => o.value.split(':')[0]).join(',');
        }
        return aus;
    });
    if (kur.ZW4 !== 'A03,A09') fehler.push(`kuratierte Maske 55017/ZW4: Auswahl "${kur.ZW4}" (erwartet A03,A09)`);
    if (kur.ZW3 !== 'A12,A17') fehler.push(`kuratierte Maske 55017/ZW3: Auswahl "${kur.ZW3}" (erwartet A12,A17)`);

    // Vollformular: dieselbe Auswahl, auch beim Wechsel im laufenden Formular
    await page.goto(`file://${ROOT}/Stammdaten/UTILMD/Strom/vollformular.html?stand=202604`, { waitUntil: 'load' });
    const voll = await page.evaluate(async () => {
        const sel = document.getElementById('pruefi');
        sel.value = '55017'; onPruefi();
        for (let i = 0; i < 80; i++) {
            if (document.querySelectorAll('.segblock').length) break;
            await new Promise(r => setTimeout(r, 50));
        }
        await new Promise(r => setTimeout(r, 120));
        const codes = () => Array.from(document.querySelectorAll('select'))
            .filter(x => Array.from(x.options).some(o => /^A\d\d$/.test(o.value)))
            .map(x => Array.from(x.options).map(o => o.value).filter(Boolean).join(','));
        const vorher = codes();
        const erg = Array.from(document.querySelectorAll('select'))
            .find(x => Array.from(x.options).map(o => o.value).join() === 'ZW3,ZW4,ZW5');
        if (!erg) return { vorher, nachher: ['(Ergänzungsfeld fehlt)'] };
        erg.value = 'ZW3';
        erg.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(r => setTimeout(r, 150));
        return { vorher, nachher: codes() };
    });
    if ((voll.vorher[0] || '') !== 'A03,A09') fehler.push(`Vollformular 55017 (ZW4): "${voll.vorher.join('|')}" (erwartet A03,A09)`);
    if ((voll.nachher[0] || '') !== 'A12,A17') fehler.push(`Vollformular 55017 nach Wechsel auf ZW3: "${voll.nachher.join('|')}" (erwartet A12,A17)`);

    await browser.close();

    console.log(`EBD-ABHÄNGIGKEITEN: ${geprueft} Antwortnachrichten geprüft`);
    console.log(`  Fälle mit Filterwirkung:   ${mitWirkung}`);
    console.log(`  ausgeblendete Codes:       ${entfernt}`);
    console.log(`  Auswahl der Prüf-ID 55017: ZW4 → ${kur.ZW4} · ZW3 → ${kur.ZW3}`);
    if (fehler.length) {
        console.log('\nAUFFÄLLIG:');
        fehler.slice(0, 15).forEach(f => console.log(' -', f));
        if (fehler.length > 15) console.log(`   … und ${fehler.length - 15} weitere`);
    }
    process.exit(fehler.length ? 1 : 0);
})();
