// Regression: Vorgangsnummer (SG4 IDE DE7402) — einheitlicher Namensaufbau.
//
// Anforderung: JEDE erzeugte Nachricht — Anfrage wie Antwort, kuratierte Maske wie
// zentrale Engine — trägt die Vorgangsnummer als <Präfix><Datenaustauschreferenz>,
// bei mehreren Vorgängen je Nachricht zusätzlich "-<lfd. Nr.>".
//
// Geprüft wird dreifach:
//   1. Quelltext: kuratierte Maske (_engine/utilmd-maske.js) und Engine
//      (_engine/ahb-form-engine.js) führen dasselbe Präfix — sie definieren es je
//      eigenständig, weil sie nie gemeinsam auf einer Seite geladen werden.
//   2. Erzeugte Nachricht: über alle Generatorseiten beider Formatstände beginnt
//      jedes IDE-Segment mit dem Präfix.
//   3. Mehrere Vorgänge: die Vorbelegung nummeriert ab dem zweiten Vorgang durch
//      und bleibt eindeutig.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRAEFIX = 'EDIGEN{';

// Alle Seiten, die eine Nachricht mit SG4 IDE erzeugen können.
const ENGINE_SEITEN = [];
for (const stand of ['202604', '202610']) {
  ENGINE_SEITEN.push(
    `${stand}/Stammdaten/UTILMD/Strom/vollformular.html`,
    `${stand}/Stammdaten/UTILMD/Gas/vollformular.html`,
    `${stand}/Bewegungsdaten/MSCONS/index.html`,
    `${stand}/Bestellvorgang/ORDERS/index.html`,
    `${stand}/Bestellvorgang/ORDRSP/index.html`,
    `${stand}/Rechnungsstellung/INVOIC/index.html`,
    `${stand}/Berichte/IFTSTA/index.html`,
    `${stand}/Stammdaten/UTILTS/index.html`,
  );
}
const KURIERTE_SEITEN = [];
for (const stand of ['202604', '202610']) {
  KURIERTE_SEITEN.push(
    `${stand}/Stammdaten/UTILMD/Strom/index.html`,
    `${stand}/Stammdaten/UTILMD/Gas/index.html`,
  );
}

const fehler = [];
let gepruefte = 0;

// ---- 1. Quelltextabgleich ------------------------------------------------
function praefixAus(datei) {
  const t = fs.readFileSync(path.join(ROOT, datei), 'utf8');
  const m = /VORGANG_PRAEFIX\s*=\s*"([^"]*)"/.exec(t);
  return m ? m[1] : null;
}
for (const datei of ['_engine/utilmd-maske.js', '_engine/ahb-form-engine.js']) {
  const p = praefixAus(datei);
  if (p === null) fehler.push(`${datei}: VORGANG_PRAEFIX nicht gefunden`);
  else if (p !== PRAEFIX) fehler.push(`${datei}: Präfix "${p}" statt "${PRAEFIX}"`);
}

// Befüllung wie in test_engine_pages.js — ohne gültige Werte erzeugt die Engine nichts.
async function befuelle(page) {
  await page.evaluate(() => {
    const wert = (ph, label) => {
      const p = (ph || '') + ' ' + (label || '');
      if (/MM\.JJJJ/.test(p) && !/TT/.test(p)) return '06.2026';
      if (/TT\.MM\.JJJJ HH:MM/.test(p)) return '15.06.2026 10:30';
      if (/TT\.MM\.JJJJ/.test(p)) return '15.06.2026';
      if (/HH:MM-HH:MM/.test(ph || '')) return '08:00-17:00';
      if (/ZZRB/.test(ph || '')) return '30TM';
      if (/^ *JJJJ *$/.test(ph || '')) return '2026';
      if (/^ *MM *$/.test(ph || '')) return '06';
      if (/IBAN/i.test(p)) return 'DE89370400440532013000';
      if (/BIC/i.test(p)) return 'MARKDEF1100';
      if (/E-Mail|Mail/i.test(p)) return 'mako@beispiel.de';
      if (/Prozent|rate/i.test(p)) return '19';
      if (/Betrag|Preis|Menge|satz/i.test(p)) return '100.00';
      if (/nummer|Referenz|ID\b|Id\b/i.test(p)) return 'REF001';
      return 'Testwert';
    };
    document.querySelectorAll('#kopfFelder input, #posListe input').forEach(el => {
      if (!el.value) {
        const lab = el.closest('.field');
        el.value = wert(el.placeholder, lab ? lab.textContent : '');
      }
    });
    document.querySelectorAll('#kopfFelder select, #posListe select').forEach(el => {
      if (el.multiple) { if (el.options.length) el.options[0].selected = true; }
      else { const o = Array.from(el.options).find(x => x.value); if (o) el.value = o.value; }
    });
  });
}

function pruefeIde(quelle, edi) {
  const ides = edi.match(/IDE\+[^']*'/g) || [];
  ides.forEach(seg => {
    gepruefte++;
    const nr = seg.replace(/^IDE\+[^+]*\+/, '').replace(/'$/, '');
    if (!nr.startsWith(PRAEFIX))
      fehler.push(`${quelle}: Vorgangsnummer "${nr}" ohne Präfix "${PRAEFIX}"`);
  });
  return ides.length;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => fehler.push(`JS-Fehler: ${e.message}`));

  // ---- 2a. Engine-Seiten -------------------------------------------------
  for (const rel of ENGINE_SEITEN) {
    const datei = path.join(ROOT, rel);
    if (!fs.existsSync(datei)) continue;
    await page.goto('file://' + datei);
    const pruefis = await page.evaluate(() =>
      Array.from(document.getElementById('pruefi').options).map(o => o.value));
    let mitIde = 0;
    for (const p of pruefis) {
      await page.selectOption('#pruefi', p);
      await page.evaluate(() => onPruefi());
      await befuelle(page);
      await page.evaluate(() => erzeuge());
      const edi = await page.evaluate(() => document.getElementById('ediOut').value);
      mitIde += pruefeIde(`${rel} ${p}`, edi);
    }
    console.log(`${rel}: ${pruefis.length} Prüf-IDs, ${mitIde} IDE-Segmente`);
  }

  // ---- 2b. Kuratierte Masken --------------------------------------------
  for (const rel of KURIERTE_SEITEN) {
    const datei = path.join(ROOT, rel);
    if (!fs.existsSync(datei)) continue;
    await page.goto('file://' + datei);
    const pruefis = await page.evaluate(() =>
      Array.from(document.getElementById('prufId').options).map(o => o.value).filter(Boolean));
    let mitIde = 0;
    for (const p of pruefis) {
      await page.selectOption('#prufId', p);
      await page.evaluate(() => generateEdifact());
      const edi = await page.evaluate(() => document.getElementById('edifactOutput').value);
      mitIde += pruefeIde(`${rel} ${p}`, edi);
    }
    console.log(`${rel}: ${pruefis.length} Prüf-IDs, ${mitIde} IDE-Segmente`);
  }

  // ---- 3. Mehrere Vorgänge je Nachricht ----------------------------------
  const vf = path.join(ROOT, '202604/Stammdaten/UTILMD/Strom/vollformular.html');
  if (fs.existsSync(vf)) {
    await page.goto('file://' + vf);
    await page.selectOption('#pruefi', '55017');
    await page.evaluate(() => onPruefi());
    await page.evaluate(() => { AhbFormEngine.addPos(); AhbFormEngine.addPos(); });
    const nummern = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#posListe input'))
        .map(e => e.value).filter(v => /^EDIGEN\{/.test(v)));
    if (nummern.length !== 3)
      fehler.push(`Mehrere Vorgänge: ${nummern.length} Vorgangsnummern statt 3`);
    if (new Set(nummern).size !== nummern.length)
      fehler.push(`Mehrere Vorgänge: Vorgangsnummern nicht eindeutig (${nummern.join(', ')})`);
    if (nummern[1] && !/-02$/.test(nummern[1]))
      fehler.push(`Mehrere Vorgänge: zweiter Vorgang ohne "-02" (${nummern[1]})`);
    console.log(`Mehrere Vorgänge: ${nummern.join(', ')}`);
  }

  await browser.close();
  console.log(`\nGeprüfte Vorgangsnummern: ${gepruefte}`);
  if (fehler.length) {
    console.log('\nFEHLER:');
    fehler.slice(0, 40).forEach(f => console.log(' -', f));
    process.exit(1);
  }
  console.log('Alle Vorgangsnummern tragen den Namensaufbau ' + PRAEFIX + '<DAR>.');
})();
