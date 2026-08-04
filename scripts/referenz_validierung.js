// referenz_validierung.js — Referenz-Testsuite mit ECHTEN Beispielnachrichten
// (offener Punkt A, Umbauplan Phase 5): Jede Datei aus dem lokalen
// Referenzordner wird erkannt (Nachrichtentyp/Formatstand über die UNH-Kennung,
// Prüf-ID über RFF+Z13) und mit dem zentralen Validator gegen die eigene
// Prüfgrundlage geprüft. Befunde an echten, im Markt gelaufenen Nachrichten
// zeigen Lücken der Extraktion oder des Validators — die wirksamste Gegenprobe,
// die das Projekt ohne Fremdvalidator bekommen kann.
//
// Die Nachrichten selbst bleiben LOKAL (Vertraulichkeit): Standard-Ablage ist
// <Arbeitsordner>/referenznachrichten/ (zwei Ebenen über dem Repository),
// übersteuerbar per Umgebungsvariable EDIGEN_REFERENZEN. Ein Repo-Ordner
// referenznachrichten/ wäre durch .gitignore geschützt, gehört dort aber nicht
// hin. Details und Beschaffung: docs/REFERENZNACHRICHTEN.md.
//
// Aufruf:
//   node scripts/referenz_validierung.js             informativ (Exit 0, wie selfvalidate)
//   node scripts/referenz_validierung.js --streng    Exit 1 bei Fehlern/Erkennungslücken
//
// Optional je Nachricht <datei>.erwartung.json:
//   { "pruefi": "55001", "fehlerfrei": true }
// Dann prüft die Suite die Erkennung gegen die Erwartung und zählt Abweichungen
// auch im informativen Modus als harte Befunde.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORDNER = process.env.EDIGEN_REFERENZEN
    ? path.resolve(process.env.EDIGEN_REFERENZEN)
    : path.join(ROOT, '..', '..', 'referenznachrichten');
const streng = process.argv.includes('--streng');

const registry = require(path.join(ROOT, '_engine/daten/validator-registry.js'));
const { ladeGenerator } = require(path.join(ROOT, '_engine/tests/harness.js'));

if (!fs.existsSync(ORDNER)) {
    console.log(`Referenzordner nicht vorhanden: ${ORDNER}`);
    console.log('Suite übersprungen — Beschaffung und Ablage: docs/REFERENZNACHRICHTEN.md');
    process.exit(0);
}

// ---- Nachrichten einsammeln (rekursiv, .txt/.edi/.edifact) -----------------
function sammle(ordner) {
    const dateien = [];
    for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
        const voll = path.join(ordner, eintrag.name);
        if (eintrag.isDirectory()) dateien.push(...sammle(voll));
        else if (/\.(txt|edi|edifact)$/i.test(eintrag.name)) dateien.push(voll);
    }
    return dateien.sort();
}

// ---- Erkennung: UNH-Kennung -> Registry-Ziel, RFF+Z13 -> Prüf-ID -----------
function segmente(text) {
    // UNA auswerten (Trennzeichen), sonst Standard; Freigabezeichen beachten.
    let trenner = "'", freigabe = '?';
    const una = /^UNA(.{6})/.exec(text.replace(/^﻿/, ''));
    if (una) { freigabe = una[1][3]; trenner = una[1][5] === ' ' ? "'" : una[1][5]; }
    const liste = [];
    let aktuell = '';
    for (let i = 0; i < text.length; i++) {
        const z = text[i];
        if (z === freigabe && i + 1 < text.length) { aktuell += z + text[i + 1]; i++; continue; }
        if (z === trenner) { liste.push(aktuell.trim()); aktuell = ''; continue; }
        aktuell += z;
    }
    if (aktuell.trim()) liste.push(aktuell.trim());
    return liste.filter(Boolean);
}

function erkenne(text) {
    const seg = segmente(text);
    const unh = seg.find(s => /^UNH\+/.test(s.replace(/\r|\n/g, '')));
    if (!unh) return { fehler: 'kein UNH-Segment gefunden' };
    const kennung = (unh.split('+')[2] || '').split(':').slice(0, 5).join(':');
    const ziele = registry.filter(r => r.unh === kennung);
    if (!ziele.length) return { fehler: `UNH-Kennung nicht registriert: ${kennung}` };
    const z13 = seg.find(s => /^RFF\+Z13:/.test(s.replace(/\r|\n/g, '')));
    const pruefi = z13 ? z13.split(':')[1] : null;
    const ziel = (pruefi && ziele.find(r => r.pruefis.includes(pruefi))) || ziele[0];
    return { ziel, pruefi, kennung };
}

// ---- Validator je Ziel (einmal laden, wiederverwenden) ---------------------
const lader = {};
function validatorFuer(ziel) {
    const dataDir = path.join(ROOT, path.dirname(ziel.metaPfad), '..');
    if (!lader[dataDir])
        lader[dataDir] = ladeGenerator(path.join(ROOT, '_engine'), dataDir);
    return lader[dataDir];
}

// ---- Lauf ------------------------------------------------------------------
const dateien = sammle(ORDNER);
if (!dateien.length) {
    console.log(`Referenzordner ${ORDNER} enthält keine Nachrichten (.txt/.edi/.edifact).`);
    console.log('Beschaffung und Ablage: docs/REFERENZNACHRICHTEN.md');
    process.exit(0);
}

let hart = 0, befundSumme = 0, hinweisSumme = 0, erkannt = 0;
console.log(`Referenz-Testsuite: ${dateien.length} Nachricht(en) aus ${ORDNER}\n`);

for (const datei of dateien) {
    const rel = path.relative(ORDNER, datei);
    const text = fs.readFileSync(datei, 'utf8');
    const e = erkenne(text);
    if (e.fehler) {
        console.log(`✗ ${rel}: nicht erkannt — ${e.fehler}`);
        hart++;
        continue;
    }
    erkannt++;
    let ergebnis;
    try {
        ergebnis = validatorFuer(e.ziel).validiere(text, e.pruefi);
    } catch (fehler) {
        console.log(`✗ ${rel}: Validierung abgebrochen — ${fehler.message}`);
        hart++;
        continue;
    }
    const fehlerListe = ergebnis.findings.filter(f => f.level === 'FEHLER');
    const hinweise = ergebnis.findings.length - fehlerListe.length;
    befundSumme += fehlerListe.length;
    hinweisSumme += hinweise;
    const kopf = `${e.ziel.format}${e.ziel.sparte ? ' ' + e.ziel.sparte : ''} ${e.ziel.stand}` +
        (e.pruefi ? ` PID ${e.pruefi}` : ' (ohne RFF+Z13)');
    console.log(`${fehlerListe.length ? '!' : '✓'} ${rel}: ${kopf} — ` +
        `${fehlerListe.length} Fehler, ${hinweise} Hinweise`);
    fehlerListe.slice(0, 5).forEach(f => console.log(`     [${f.seg}] ${f.msg}`));
    if (fehlerListe.length > 5) console.log(`     … ${fehlerListe.length - 5} weitere`);

    // Erwartungsdatei abgleichen (falls vorhanden)
    const erwartungsDatei = datei + '.erwartung.json';
    if (fs.existsSync(erwartungsDatei)) {
        const erwartung = JSON.parse(fs.readFileSync(erwartungsDatei, 'utf8'));
        if (erwartung.pruefi && erwartung.pruefi !== e.pruefi) {
            console.log(`   ✗ Erwartung verletzt: Prüf-ID ${e.pruefi} statt ${erwartung.pruefi}`);
            hart++;
        }
        if (erwartung.fehlerfrei === true && fehlerListe.length) {
            console.log(`   ✗ Erwartung verletzt: Nachricht sollte fehlerfrei validieren`);
            hart++;
        }
    }
}

console.log(`\nZusammenfassung: ${erkannt}/${dateien.length} erkannt · ` +
    `${befundSumme} Fehler-Befunde · ${hinweisSumme} Hinweise · ${hart} harte Abweichungen`);
console.log('Befunde an echten Nachrichten zuerst FACHLICH bewerten (Extraktion? Validator? ' +
    'Nachricht?) und im Protokoll festhalten — nicht pauschal wegfiltern.');
process.exit(streng && (hart || befundSumme) ? 1 : 0);
