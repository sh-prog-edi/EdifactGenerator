// test_de_muss_praesenz.js
// Regressionstest der Muss-Präsenzprüfung auf DATENELEMENT-Ebene.
//
// Hintergrund: Der Validator prüfte bisher die Codes VORHANDENER Datenelemente
// und fehlende Muss-SEGMENTE, aber nie, ob ein als Muss geführtes DATENELEMENT
// einer genutzten Segmentinstanz auch belegt ist. Dadurch blieb z. B.
// „STS+7++ZC8'" grün, obwohl die Muss-Ergänzung (C556, 3. Gruppe: ZW3/ZW4) fehlt.
//
// Nachweis hier:
//   1. Kein Fehlalarm: Über ALLE Prüf-IDs aller Ziele erzeugt der Generator
//      gültige Golden-Nachrichten — keine davon darf einen „Pflichtangabe … fehlt"
//      auslösen (Schutz gegen zu strenge Regeln / Extraktions-Drift).
//   2. Wirksamkeit (generisch, alle betroffenen PIDs): Für jede STS+7-Instanz mit
//      einer als UNBEDINGTES Muss codierten Ergänzung (3. C556-Gruppe, DE9013 an
//      pos 3) wird diese aus der Golden-Nachricht entfernt — der Validator MUSS
//      dann genau dieses fehlende Pflicht-DE melden. Optionale Ergänzungen
//      (nur Soll/bedingte Codes, z. B. „S [9P0..1]") dürfen dagegen NICHT anschlagen.
//   3. Nutzerfall: „STS+7++ZC8'" (PID 55037) wird rot mit Ergänzungs-Hinweis.
//
// Aufruf: node scripts/test_de_muss_praesenz.js
const path = require('path');
const { ladeGenerator } = require('../_engine/tests/harness');

const ROOT = path.resolve(__dirname, '..');
const ZIELE = [
  '202604/Stammdaten/UTILMD/Strom',
  '202610/Stammdaten/UTILMD/Strom',
  '202604/Stammdaten/UTILMD/Gas',
  '202610/Stammdaten/UTILMD/Gas',
];

let fails = 0;
const ok = (b, t) => { if (!b) { console.log(' FAIL ' + t); fails++; } };
const unbedingt = e => /^[XxM]$/.test(String(e == null ? '' : e).trim());
const istPflichtFehler = f => f.level === 'FEHLER' && /Pflichtangabe DE\d+/.test(f.msg);

let pidsGesamt = 0, fehlalarme = 0, mutProben = 0, mutErkannt = 0, optProben = 0, optRuhig = 0;

for (const ziel of ZIELE) {
  const G = ladeGenerator(path.join(ROOT, '_engine'), path.join(ROOT, ziel),
                          { fixedNow: Date.UTC(2026, 9, 1, 8, 0, 0) });
  const formMeta = G.sandbox.formMeta || {};

  for (const pid of G.pids) {
    pidsGesamt++;
    const msg = G.generiere(pid);

    // (1) kein Fehlalarm an der validen Golden-Nachricht
    const v0 = G.validiere(msg, pid);
    const fa = v0.findings.filter(istPflichtFehler);
    if (fa.length) { fehlalarme += fa.length; ok(false, `${ziel} ${pid}: Fehlalarm — ${fa.map(x => x.msg).join(' | ')}`); }

    // STS+7-Instanz der Prüf-ID: Ergänzungspositionen (DE9013 an pos>=3) bewerten
    const meta = formMeta[pid];
    if (!meta || !meta.instanzen) continue;
    const inst = meta.instanzen.find(x => x.seg === 'STS'
      && (x.des || []).some(d => d.de === '9015' && (d.codes || []).some(c => c[0] === '7')));
    if (!inst) continue;
    const ergs = (inst.des || []).filter(d => d.de === '9013' && d.pos >= 3);
    if (!ergs.length) continue;

    // Golden-STS+7-Zeile in Elemente zerlegen. Achtung: elemente[0] ist das
    // Segment-Tag; die Instanz-`pos` zählt ab dem ersten Datenelement NACH dem
    // Tag (wie seg.elemente im Validator) → Zugriff über pos+1.
    const zeilen = msg.split(/\r?\n/);
    const idx = zeilen.findIndex(z => /^STS\+7\+/.test(z));
    if (idx < 0) continue;
    const elemente = zeilen[idx].replace(/'\s*$/, '').split('+');

    for (const erg of ergs) {
      const eidx = erg.pos + 1;                     // Tag-Versatz
      const belegt = (elemente[eidx] || '').split(':')[0].trim();
      if (!belegt) continue;                        // Position im Golden nicht belegt → nichts zu mutieren
      // Pflichtstatus wie im Validator: DE-Status UNBEDINGT (X/M ohne Bedingung)
      // UND — bei codiertem DE — mindestens ein unbedingter Muss-Code. Konditionale
      // DE-Marker („X [192]", „X [580]") sind bewusst KEIN harter Fehler.
      const codeListe = erg.codes || [];
      const mussCode = unbedingt(erg.expr)
        && (!codeListe.length || codeListe.some(c => unbedingt(c[2])));

      // Ergänzung aus der Zeile entfernen und neu validieren
      const mut = elemente.slice();
      mut[eidx] = '';
      while (mut.length && mut[mut.length - 1] === '') mut.pop();   // Leer-Endelemente kürzen
      const mutZeile = mut.join('+') + "'";
      const mutMsg = zeilen.map((z, k) => k === idx ? mutZeile : z).join('\n');
      const vm = G.validiere(mutMsg, pid);
      // positionsgenau am Namen erkennen (mehrere DE9013 je STS) — die Klammer
      // grenzt „Transaktionsgrund" von „Transaktionsgrundergänzung…" sauber ab.
      const trifft = vm.findings.some(f => istPflichtFehler(f) && f.seg === 'STS'
        && f.msg.includes('(' + erg.name + ')'));

      if (mussCode) {
        mutProben++;
        if (trifft) mutErkannt++;
        ok(trifft, `${ziel} ${pid}: entfernte Muss-Ergänzung (pos ${erg.pos}, „${erg.name}") wird NICHT gemeldet`);
      } else {
        optProben++;
        if (!trifft) optRuhig++;
        ok(!trifft, `${ziel} ${pid}: optionale Ergänzung (pos ${erg.pos}, „${erg.name}") fälschlich als Muss gemeldet`);
      }
    }
  }
}

// (3) Nutzerfall explizit
{
  const G = ladeGenerator(path.join(ROOT, '_engine'), path.join(ROOT, '202604/Stammdaten/UTILMD/Strom'),
                          { fixedNow: Date.UTC(2026, 9, 1, 8, 0, 0) });
  const msg = G.generiere('55037');
  const kaputt = msg.split(/\r?\n/).map(z => /^STS\+7\+/.test(z) ? "STS+7++ZC8'" : z).join('\n');
  const v = G.validiere(kaputt, '55037');
  const treffer = v.findings.filter(f => istPflichtFehler(f) && f.seg === 'STS' && /ergänzung/i.test(f.msg));
  ok(treffer.length === 1, `Nutzerfall STS+7++ZC8' (55037): genau ein Ergänzungs-Pflichtfehler erwartet, ist ${treffer.length}`);
  // Verfeinerung: die Meldung nennt die konkret zulässigen Codes (nicht nur „im AHB nachschauen").
  const msgTxt = (treffer[0] || {}).msg || '';
  ok(/zulässige Angabe/.test(msgTxt) && /ZW3/.test(msgTxt) && /ZW4/.test(msgTxt),
     `Nutzerfall 55037: Meldung soll die zulässigen Codes (ZW3/ZW4) nennen — ist: ${msgTxt}`);
}

// (4) Abhängigkeit im Klartext: eine an einen bedingten Code geknüpfte Ergänzung
//     wird mitsamt aufgelöster Bedingung („nur wenn [nnn] …") ausgewiesen.
{
  const G = ladeGenerator(path.join(ROOT, '_engine'), path.join(ROOT, '202604/Stammdaten/UTILMD/Strom'),
                          { fixedNow: Date.UTC(2026, 9, 1, 8, 0, 0) });
  const msg = G.generiere('55002');
  const kaputt = msg.split(/\r?\n/).map(z => /^STS\+7\+/.test(z) ? "STS+7++E01'" : z).join('\n');
  const v = G.validiere(kaputt, '55002');
  const erg = v.findings.find(f => istPflichtFehler(f) && f.seg === 'STS' && /ergänzung/i.test(f.msg));
  ok(!!erg && /nur wenn \[\d+\]/.test(erg.msg),
     `55002: bedingte Ergänzung (ZAP) soll mit aufgelöster Abhängigkeit erscheinen — ist: ${erg && erg.msg}`);
}

console.log(`\nGeprüft: ${pidsGesamt} Prüf-IDs · Fehlalarme: ${fehlalarme}`);
console.log(`STS-Ergänzung — Muss-Mutationen erkannt: ${mutErkannt}/${mutProben} · optionale korrekt ignoriert: ${optRuhig}/${optProben}`);
console.log(fails ? `\n${fails} Test(s) fehlgeschlagen.` : '\nAlle DE-Muss-Präsenztests OK.');
process.exit(fails ? 1 : 0);
