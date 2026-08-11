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
const EdiUmbau = require(path.join(ROOT, '_engine/umbau.js'));

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

// ---- Zerlegung einer Übertragungsdatei in einzeln prüfbare Einheiten -------
// Echte Übertragungsdateien aggregieren zwei Ebenen (siehe Umbau, Protokoll 48):
//   1. mehrere Nachrichten je UNB (Sammel-Datei, z. B. 1143 MSCONS in einer Datei)
//   2. mehrere Vorgänge je UTILMD-Nachricht mit je EIGENER Prüf-ID (RFF+Z13)
// Ohne Zerlegung prüft die Suite den ganzen Dateitext gegen die ERSTE Prüf-ID —
// das erzeugt Scheinbefunde (fremde Segmente „nicht vorgesehen", Muss-Segmente
// je Wiederholung mehrfach gezählt). Hier wird die Datei mit derselben
// Engine-Mechanik wie das Umbau-Werkzeug in Einheiten zerlegt und jede Einheit
// einzeln erkannt und validiert.
function einheiten(text) {
    const segmente = EdiUmbau.zerlege(text);
    const nachr = EdiUmbau.nachrichten(segmente);
    if (nachr.length === 0) return [{ text, herkunft: '' }];
    const unb = segmente.find(s => s.tag === 'UNB') || { tag: 'UNB', elemente: [] };
    const origUnz = segmente.find(s => s.tag === 'UNZ');
    // Datenaustauschreferenz (UNB DE0020): sie steht im UNZ-Trailer, NICHT die
    // Nachrichtenreferenz (UNH DE0062). Beim Zerlegen die Interchange-Referenz
    // beibehalten, sonst meldet der Validator UNZ≠UNB fälschlich.
    const interchangeRef = (unb.elemente[4] || [])[0]
        || (origUnz && (origUnz.elemente[1] || [])[0]) || '1';
    const liste = [];
    nachr.forEach((n, idx) => {
        // Mini-Übertragung: UNB + genau diese Nachricht (UNH…UNT) + UNZ (1 Nachricht).
        const mini = [unb].concat(segmente.slice(n.von, n.bis),
            [{ tag: 'UNZ', elemente: [['1'], [interchangeRef]] }]);
        const vg = EdiUmbau.vorgaenge(mini);
        const pruefis = [...new Set(vg.map(v => v.pruefi).filter(Boolean))];
        const mehrfach = nachr.length > 1 ? ` [Nachricht ${idx + 1}/${nachr.length}` +
            (n.bgm ? `, ${n.bgm}` : '') + ']' : '';
        if (pruefis.length >= 2) {
            // UTILMD mit mehreren Vorgängen unterschiedlicher Prüf-ID: je Vorgang isolieren.
            vg.forEach(v => liste.push({
                text: EdiUmbau.serialisiere(EdiUmbau.filterVorgaenge(mini, [v], null)),
                herkunft: `${mehrfach ? mehrfach.slice(0, -1) + ', ' : ' ['}Vorgang ${v.nr}${v.pruefi ? ' PID ' + v.pruefi : ''}]`,
            }));
        } else {
            liste.push({ text: EdiUmbau.serialisiere(mini), herkunft: mehrfach });
        }
    });
    return liste;
}

// ---- Lauf ------------------------------------------------------------------
const dateien = sammle(ORDNER);
if (!dateien.length) {
    console.log(`Referenzordner ${ORDNER} enthält keine Nachrichten (.txt/.edi/.edifact).`);
    console.log('Beschaffung und Ablage: docs/REFERENZNACHRICHTEN.md');
    process.exit(0);
}

let hart = 0, befundSumme = 0, hinweisSumme = 0;
let dateienErkannt = 0, einheitenGesamt = 0, einheitenErkannt = 0, einheitenSauber = 0;
console.log(`Referenz-Testsuite: ${dateien.length} Datei(en) aus ${ORDNER}\n`);

for (const datei of dateien) {
    const rel = path.relative(ORDNER, datei);
    const text = fs.readFileSync(datei, 'utf8');
    let teile;
    try {
        teile = einheiten(text);
    } catch (fehler) {
        console.log(`✗ ${rel}: Zerlegung abgebrochen — ${fehler.message}`);
        hart++;
        continue;
    }

    // Befunde über alle Einheiten der Datei bündeln: gleiche Meldung wird
    // zusammengefasst gezählt (eine Sammel-Datei mit 1143 gleichartigen
    // Nachrichten ergibt EINEN Befund mit Häufigkeit, nicht 1143 Zeilen).
    const gebuendelt = new Map();   // msg -> { seg, anzahl, level }
    let einheitenDerDatei = 0, erkannteEinheiten = 0, fehlerEinheiten = 0;
    let letztesZiel = null, letztePruefi = null;
    const nichtErkannt = new Set();

    for (const teil of teile) {
        einheitenDerDatei++;
        einheitenGesamt++;
        const e = erkenne(teil.text);
        if (e.fehler) { nichtErkannt.add(e.fehler); continue; }
        erkannteEinheiten++;
        einheitenErkannt++;
        letztesZiel = e.ziel; letztePruefi = e.pruefi;
        let ergebnis;
        try {
            ergebnis = validatorFuer(e.ziel).validiere(teil.text, e.pruefi);
        } catch (fehler) {
            gebuendelt.set('Validierung abgebrochen: ' + fehler.message,
                { seg: '—', anzahl: (gebuendelt.get('Validierung abgebrochen: ' + fehler.message)?.anzahl || 0) + 1, level: 'FEHLER' });
            continue;
        }
        const fehlerListe = ergebnis.findings.filter(f => f.level === 'FEHLER');
        if (fehlerListe.length) fehlerEinheiten++; else einheitenSauber++;
        ergebnis.findings.forEach(f => {
            const vorhanden = gebuendelt.get(f.msg) || { seg: f.seg, anzahl: 0, level: f.level };
            vorhanden.anzahl++;
            gebuendelt.set(f.msg, vorhanden);
        });
    }

    if (erkannteEinheiten > 0) dateienErkannt++;
    const fehlerBefunde = [...gebuendelt.values()].filter(f => f.level === 'FEHLER');
    const hinweisBefunde = [...gebuendelt.values()].filter(f => f.level !== 'FEHLER');
    befundSumme += fehlerBefunde.reduce((s, f) => s + f.anzahl, 0);
    hinweisSumme += hinweisBefunde.reduce((s, f) => s + f.anzahl, 0);

    const kopf = letztesZiel
        ? `${letztesZiel.format}${letztesZiel.sparte ? ' ' + letztesZiel.sparte : ''} ${letztesZiel.stand}`
        : '(nicht erkannt)';
    const umfang = einheitenDerDatei > 1 ? ` · ${einheitenDerDatei} Einheiten` : '';
    const marke = nichtErkannt.size ? '✗' : (fehlerBefunde.length ? '!' : '✓');
    console.log(`${marke} ${rel}: ${kopf}${umfang} — ` +
        `${fehlerBefunde.length} Fehlerart(en), ${hinweisBefunde.length} Hinweisart(en)` +
        (fehlerEinheiten ? `, ${fehlerEinheiten}/${erkannteEinheiten} Einheiten mit Fehler` : ''));
    if (nichtErkannt.size) { [...nichtErkannt].forEach(m => console.log(`     ✗ nicht erkannt: ${m}`)); hart += nichtErkannt.size; }
    fehlerBefunde.sort((a, b) => b.anzahl - a.anzahl).slice(0, 8).forEach(f =>
        console.log(`     [${f.seg}] ${[...gebuendelt.entries()].find(([, v]) => v === f)[0]}` +
            (f.anzahl > 1 ? `  (${f.anzahl}×)` : '')));
    if (fehlerBefunde.length > 8) console.log(`     … ${fehlerBefunde.length - 8} weitere Fehlerart(en)`);

    // Erwartungsdatei abgleichen (falls vorhanden) — bezieht sich auf die
    // (erste) erkannte Prüf-ID der Datei.
    const erwartungsDatei = datei + '.erwartung.json';
    if (fs.existsSync(erwartungsDatei)) {
        const erwartung = JSON.parse(fs.readFileSync(erwartungsDatei, 'utf8'));
        if (erwartung.pruefi && erwartung.pruefi !== letztePruefi) {
            console.log(`   ✗ Erwartung verletzt: Prüf-ID ${letztePruefi} statt ${erwartung.pruefi}`);
            hart++;
        }
        if (erwartung.fehlerfrei === true && fehlerBefunde.length) {
            console.log(`   ✗ Erwartung verletzt: Nachricht sollte fehlerfrei validieren`);
            hart++;
        }
    }
}

console.log(`\nZusammenfassung: ${dateienErkannt}/${dateien.length} Dateien erkannt · ` +
    `${einheitenErkannt}/${einheitenGesamt} Einheiten erkannt (${einheitenSauber} fehlerfrei) · ` +
    `${befundSumme} Fehler-Befunde · ${hinweisSumme} Hinweise · ${hart} harte Abweichungen`);
console.log('Befunde an echten Nachrichten zuerst FACHLICH bewerten (Extraktion? Validator? ' +
    'Nachricht?) und im Protokoll festhalten — nicht pauschal wegfiltern.');
process.exit(streng && (hart || befundSumme) ? 1 : 0);
