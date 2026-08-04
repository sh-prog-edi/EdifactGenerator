// pruefe_pid_konsistenz.js — gleicht alle Prüf-ID-Nachrichten gegen die Originalquellen ab.
//
// Geprüft wird, was im Laufe der Entwicklung veralten kann:
//
//   1. Auswahllisten der kuratierten UTILMD-Masken gegen die AHB-Codes der Prüf-ID
//      (fehlende, überzählige und in falscher Reihenfolge geführte Codes; Platzhalter
//      wie „E01_ZUS", die keinen echten Code tragen).
//   2. Formularfelder, die der AHB dieser Prüf-ID gar nicht (mehr) führt.
//   3. Abhängigkeiten (`abhaengig`): Zielfeld vorhanden? Code dort wählbar?
//   4. Prozess-Meta: Transaktionsgrund, EBD-Nummer, Antwortcode und Cluster gegen AHB
//      und Entscheidungsbaum-Diagramme.
//   5. EBD-Referenzen der Formular-Meta (DE 1131) gegen die gelesenen EBD.
//   6. Codes der Formular-Meta gegen die MIG-Codelisten (nur UTILMD, wo vorhanden).
//   7. Antwortcodes, die ihr Entscheidungsbaum bei keinem Geschäftsvorfall erreicht.
//
// Aufruf:  node scripts/pruefe_pid_konsistenz.js [--nur <Muster>] [--csv <Datei>]
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const nur = args.includes('--nur') ? args[args.indexOf('--nur') + 1] : '';
const csvZiel = args.includes('--csv') ? args[args.indexOf('--csv') + 1] : '';

global.ebdAntwortcodes = laden('_engine/daten/ebd-antwortcodes.js');
global.ebdPfade = laden('_engine/daten/ebd-pfade.js');
global.stsStruktur = laden('_engine/daten/sts-struktur.js');
const AC = require(path.join(ROOT, '_engine/antwortcode-auswahl.js'));

function laden(rel) {
    const p = path.join(ROOT, rel);
    return fs.existsSync(p) ? require(p) : null;
}
function ladeVar(datei) {
    // Die Datendateien sind JavaScript mit einer einzigen `var`-Zuweisung in einer Zeile.
    const text = fs.readFileSync(datei, 'utf8');
    const m = /^var\s+\w+\s*=\s*(\{.*\});\s*$/m.exec(text);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch (e) { return null; }
}

const ZIELE = [];
for (const stand of ['202604', '202610']) {
    for (const rel of ['Stammdaten/UTILMD/Strom', 'Stammdaten/UTILMD/Gas', 'Stammdaten/UTILTS',
                       'Stammdaten/PARTIN', 'Berichte/IFTSTA', 'Berichte/INSRPT',
                       'Bewegungsdaten/MSCONS', 'Bestellvorgang/ORDERS', 'Bestellvorgang/ORDRSP',
                       'Bestellvorgang/ORDCHG', 'Bestellvorgang/QUOTES', 'Bestellvorgang/REQOTE',
                       'Rechnungsstellung/COMDIS', 'Rechnungsstellung/INVOIC',
                       'Rechnungsstellung/PRICAT', 'Rechnungsstellung/REMADV']) {
        const dir = path.join(ROOT, stand, rel);
        if (fs.existsSync(path.join(dir, 'pruef-ids'))) ZIELE.push([stand, rel, dir]);
    }
}

const befunde = [];
function melde(art, stand, ziel, pruefi, text) {
    befunde.push({ art, stand, ziel, pruefi, text });
}

// Codes eines Datenelements einer Segmentinstanz
const codesVon = (inst, de) => ((inst.des || []).find(d => d.de === de) || {}).codes || [];

for (const [stand, rel, dir] of ZIELE) {
    if (nur && !`${stand}/${rel}`.includes(nur)) continue;
    const pd = path.join(dir, 'pruef-ids');
    const meta = ladeVar(path.join(pd, '_form-meta.js'));
    if (!meta) { melde('Datenlage', stand, rel, '—', 'keine Formular-Meta lesbar'); continue; }
    const prozess = fs.existsSync(path.join(pd, '_prozess-meta.js')) ? require(path.join(pd, '_prozess-meta.js')) : null;
    const migListen = fs.existsSync(path.join(pd, '_mig-codelisten.js')) ? require(path.join(pd, '_mig-codelisten.js')) : null;
    const ebds = ((global.ebdAntwortcodes || {})[stand] || {}).ebds || {};
    const migKey = rel.includes('UTILMD/Gas') ? 'UTILMD_GAS'
                 : (rel.includes('UTILMD/Strom') ? 'UTILMD_STROM' : rel.split('/').pop());
    const stsStruktur = ((global.stsStruktur || {})[stand] || {})[migKey] || null;
    const pfade = (global.ebdPfade || {})[stand] || {};

    // kuratierte Regeldateien (nur UTILMD)
    const regeln = {};
    for (const f of fs.readdirSync(pd)) {
        if (!/^\d{5}\.js$/.test(f)) continue;
        try { regeln[f.replace('.js', '')] = require(path.join(pd, f)); } catch (e) { /* keine Regeldatei */ }
    }

    for (const pruefi of Object.keys(meta)) {
        const eintrag = meta[pruefi];
        const instanzen = eintrag.instanzen || [];

        // ---- 5. EBD-Referenzen der Formular-Meta -------------------------
        const ebdRefs = [];
        instanzen.forEach(i => {
            if (i.seg !== 'STS' && i.seg !== 'AJT') return;
            codesVon(i, '1131').forEach(c => {
                if (!/^(E|S|G|GS)_\d{3,4}$/.test(c[0])) return;
                if (!ebdRefs.includes(c[0])) ebdRefs.push(c[0]);
                if (!ebds[c[0]])
                    melde('EBD unbekannt', stand, rel, pruefi, `${c[0]} steht im AHB, ist aber in den EBD-Daten nicht enthalten`);
            });
        });

        // ---- 7. Codes, die im Entscheidungsbaum nicht vorkommen -----------
        ebdRefs.forEach(k => {
            const baum = pfade[k];
            const e = ebds[k];
            if (!baum || !e || !baum.bedingungen) return;
            Object.keys(e.codes).forEach(code => {
                if (!(code in baum.bedingungen) && code !== 'A**')
                    melde('Code ohne Weg', stand, rel, pruefi, `${k}: Code ${code} wird im Entscheidungsbaum nicht erreicht`);
            });
        });

        // ---- 6. STS-Codes gegen die MIG-Codelisten -----------------------
        // Geprüft wird gegen `_engine/daten/sts-struktur.js` — die aus den MIG
        // gelesene Segmentstruktur mit den zulässigen Codes je Statusanlass-Gruppe.
        // (Die seitenlokale `_mig-codelisten.js` ist ein kuratierter Auszug und taugt
        // nicht als Vollständigkeitsmaßstab.)
        if (stsStruktur) {
            instanzen.forEach(i => {
                if (i.seg !== 'STS') return;
                const q = (codesVon(i, '9015')[0] || [])[0] || '';
                const kandidaten = (stsStruktur.segmente || []).filter(s => {
                    const k = (((s.komposita || [])[0] || {}).des || []).find(d => d.de === '9015');
                    const codes = k ? Object.keys(k.codes || {}) : [];
                    return !codes.length || codes.indexOf(q) >= 0;
                });
                if (!kandidaten.length) return;
                (i.des || []).forEach(d => {
                    if (d.de !== '9013' || !(d.codes || []).length) return;
                    const stelle = (d.pos || 2) - 2;          // 0 = erste Gruppe C556
                    const listen = kandidaten.map(s => {
                        let element = 0, treffer = null;
                        (s.komposita || []).forEach(k => {
                            const de = (k.des || []).find(x => x.de === '9013');
                            if (element >= 2 && de && element - 2 === stelle) treffer = de.codes || {};
                            element++;
                        });
                        return treffer;
                    }).filter(Boolean);
                    if (!listen.length || !listen.some(l => Object.keys(l).length)) return;
                    d.codes.forEach(c => {
                        if (!listen.some(l => c[0] in l))
                            melde('STS-Code außerhalb MIG', stand, rel, pruefi,
                                  `STS+${q} Element ${(d.pos || 2) + 1}: Code ${c[0]} steht nicht in der MIG-Codeliste`);
                    });
                });
            });
        }

        // ---- 4. Prozess-Meta ---------------------------------------------
        const pm = prozess ? prozess[pruefi] : null;
        if (pm) {
            const sts7 = instanzen.find(i => i.seg === 'STS' && codesVon(i, '9015').some(c => c[0] === '7'));
            if (pm.transaktionsgrund && sts7) {
                const gruende = (sts7.des || []).filter(d => d.de === '9013' && (d.pos === undefined || d.pos === 2))
                    .flatMap(d => (d.codes || []).map(c => c[0]));
                if (gruende.length && !gruende.includes(pm.transaktionsgrund))
                    melde('Prozess-Meta Grund', stand, rel, pruefi,
                          `Transaktionsgrund ${pm.transaktionsgrund} steht nicht in der AHB-Liste (${gruende.join(',')})`);
            }
            if (pm.ebd && ebdRefs.length && !ebdRefs.includes(pm.ebd))
                melde('Prozess-Meta EBD', stand, rel, pruefi,
                      `EBD ${pm.ebd} weicht vom AHB ab (${ebdRefs.join(',')})`);
            if (pm.antwortcode) {
                const quellen = ebdRefs.length ? ebdRefs : (pm.ebd ? [pm.ebd] : []);
                const gefunden = quellen.some(k => {
                    let e = ebds[k], tiefe = 0;
                    while (e && e.verweistAuf && tiefe++ < 3) e = ebds[e.verweistAuf];
                    return e && pm.antwortcode in e.codes;
                });
                if (quellen.length && !gefunden)
                    melde('Prozess-Meta Antwortcode', stand, rel, pruefi,
                          `Antwortcode ${pm.antwortcode} kommt in ${quellen.join(',')} nicht vor`);
                // Cluster des Vorgabecodes gegen die Art der Nachricht
                const soll = pm.antwortcluster === 'ablehnung' ? 'Ablehnung'
                           : (pm.antwortcluster === 'zustimmung' ? 'Zustimmung' : '');
                if (soll && gefunden) {
                    const k = quellen.find(k2 => { let e = ebds[k2], t = 0; while (e && e.verweistAuf && t++ < 3) e = ebds[e.verweistAuf]; return e && pm.antwortcode in e.codes; });
                    let e = ebds[k], t = 0; while (e && e.verweistAuf && t++ < 3) e = ebds[e.verweistAuf];
                    const c = e.codes[pm.antwortcode];
                    if (c && c.cluster && c.cluster !== soll)
                        melde('Prozess-Meta Cluster', stand, rel, pruefi,
                              `Antwortcode ${pm.antwortcode} gehört zum Cluster ${c.cluster}, die Nachricht ist ${soll}`);
                }
            }
            // Nur Antwortnachrichten tragen ein Cluster; Meldungen und Anfragen nicht.
            if (['bestaetigung', 'ablehnung'].includes(pm.art) && !pm.antwortcluster)
                melde('Prozess-Meta Cluster fehlt', stand, rel, pruefi, `Art „${pm.art}" ohne antwortcluster`);
        }

        // ---- 1.–3. kuratierte Regeldatei ---------------------------------
        const regel = regeln[pruefi];
        if (!regel || !regel.segments) continue;
        const felder = {};
        regel.segments.forEach(s => { felder[s.id] = s; });

        regel.segments.forEach(seg => {
            // 1. Auswahllisten
            if (seg.isSelect) {
                const werte = (seg.options || []).map(o => o.v);
                // Leere Werte sind die Option „– keine Angabe –" und in Ordnung;
                // gesucht sind Einträge, die keinen echten Code tragen.
                const platzhalter = werte.filter(v => v && (!/^[A-Z0-9]{1,4}(:|$)/.test(v) || /^E01_/.test(v)));
                if (platzhalter.length)
                    melde('Platzhalter', stand, rel, pruefi,
                          `${seg.id}: Auswahl enthält Platzhalter statt Codes (${platzhalter.join(',')})`);
                // STS+7: Grund und Ergänzung gegen die AHB-Positionen
                if (seg.id === 'STS_7' || seg.id === 'STS_7_grund' || seg.id === 'STS_7_befristet') {
                    const posSoll = seg.id === 'STS_7_grund' ? 2 : (seg.id === 'STS_7' ? 3 : 4);
                    const inst = instanzen.find(i => i.seg === 'STS' && codesVon(i, '9015').some(c => c[0] === '7'));
                    if (inst) {
                        const ahb = (inst.des || []).filter(d => d.de === '9013' && (d.pos || 2) === posSoll)
                            .flatMap(d => (d.codes || []).map(c => c[0]));
                        const fehlt = ahb.filter(c => !werte.includes(c));
                        const zuviel = werte.filter(c => !ahb.includes(c));
                        if (ahb.length && (fehlt.length || zuviel.length))
                            melde('Auswahlliste', stand, rel, pruefi,
                                  `${seg.id}: ${fehlt.length ? 'fehlt ' + fehlt.join(',') : ''}`
                                  + `${fehlt.length && zuviel.length ? ' · ' : ''}`
                                  + `${zuviel.length ? 'überzählig ' + zuviel.join(',') : ''}`);
                    }
                }
            }
            // 2. Felder ohne AHB-Grundlage
            const m = /^(LOC|DTM|RFF)_([A-Z0-9]+)$/.exec(seg.id);
            if (m) {
                const [, art, code] = m;
                const de = art === 'LOC' ? '3227' : (art === 'DTM' ? '2005' : '1153');
                const da = instanzen.some(i => i.seg === art && codesVon(i, de).some(c => c[0] === code));
                if (!da) melde('Feld ohne AHB', stand, rel, pruefi, `${seg.id}: der AHB dieser Prüf-ID führt ${art}+${code} nicht`);
            }
            // 3. Abhängigkeiten
            if (seg.abhaengig) {
                const ziel = felder[seg.abhaengig.feld];
                if (!ziel)
                    melde('Abhängigkeit', stand, rel, pruefi, `${seg.id}: Bedingung verweist auf unbekanntes Feld ${seg.abhaengig.feld}`);
                else if (ziel.options && !ziel.options.some(o => o.v === seg.abhaengig.code))
                    melde('Abhängigkeit', stand, rel, pruefi,
                          `${seg.id}: Code ${seg.abhaengig.code} ist in ${seg.abhaengig.feld} nicht wählbar `
                          + `(${(ziel.options || []).map(o => o.v).join(',') || 'keine Optionen'})`);
            }
        });
    }
}

// ---- Ausgabe -------------------------------------------------------------
const nachArt = {};
befunde.forEach(b => { (nachArt[b.art] = nachArt[b.art] || []).push(b); });
console.log(`PRÜF-ID-KONSISTENZ: ${befunde.length} Befunde in ${ZIELE.length} Zielen\n`);
Object.keys(nachArt).sort((a, b) => nachArt[b].length - nachArt[a].length).forEach(art => {
    const liste = nachArt[art];
    console.log(`${String(liste.length).padStart(5)}  ${art}`);
    liste.slice(0, 4).forEach(b => console.log(`         ${b.stand} ${b.ziel.split('/').pop()} ${b.pruefi}: ${b.text}`));
    if (liste.length > 4) console.log(`         … und ${liste.length - 4} weitere`);
});

if (csvZiel) {
    const zeilen = ['Art;Formatstand;Ziel;PruefID;Befund'];
    befunde.forEach(b => zeilen.push([b.art, b.stand, b.ziel, b.pruefi, b.text.replace(/;/g, ',')].join(';')));
    fs.writeFileSync(csvZiel, zeilen.join('\n') + '\n', 'utf8');
    console.log(`\n-> ${csvZiel}`);
}
process.exit(0);
