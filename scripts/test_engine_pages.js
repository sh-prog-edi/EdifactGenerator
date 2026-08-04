// Regression: alle Engine-Generatorseiten – jede Prüf-ID befüllen, generieren,
// Ausgabe prüfen (EDIFACT vorhanden, keine Fehlerbox, UNH-Kennung korrekt).
const { chromium } = require('playwright');
const path = require('path');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';
const SEITEN = [];
for (const stand of ['202604', '202610']) {
  SEITEN.push(
    `${stand}/Berichte/IFTSTA/index.html`,
    `${stand}/Berichte/INSRPT/index.html`,
    `${stand}/Rechnungsstellung/COMDIS/index.html`,
    `${stand}/Rechnungsstellung/INVOIC/index.html`,
    `${stand}/Rechnungsstellung/PRICAT/index.html`,
    `${stand}/Rechnungsstellung/REMADV/index.html`,
    `${stand}/Stammdaten/PARTIN/index.html`,
    `${stand}/Stammdaten/UTILTS/index.html`,
    `${stand}/Bestellvorgang/ORDERS/index.html`,
    `${stand}/Bestellvorgang/ORDRSP/index.html`,
    `${stand}/Bestellvorgang/ORDCHG/index.html`,
    `${stand}/Bestellvorgang/QUOTES/index.html`,
    `${stand}/Bestellvorgang/REQOTE/index.html`,
    `${stand}/Bewegungsdaten/MSCONS/index.html`,
  );
}
const SMOKE = [];
for (const stand of ['202604', '202610']) {
  SMOKE.push(
    [`${stand}/Servicenachrichten/APERAK/index.html`, 'generateAperak'],
    [`${stand}/Servicenachrichten/CONTRL/index.html`, 'generateContrl'],
  );
}

async function befuelle(page) {
  // Alle sichtbaren Eingaben mit plausiblen Werten füllen, Selects: erste echte Option
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
      if (el.multiple) {
        if (el.options.length) el.options[0].selected = true;
      } else {
        const o = Array.from(el.options).find(x => x.value);
        if (o) el.value = o.value;
      }
    });
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let gesamt = 0, ok = 0;
  const fehler = [];
  page.on('pageerror', e => fehler.push(`JS-Fehler: ${e.message}`));

  for (const rel of SEITEN) {
    const url = 'file://' + path.join(ROOT, rel);
    await page.goto(url);
    const pruefis = await page.evaluate(() =>
      Array.from(document.getElementById('pruefi').options).map(o => o.value));
    const kennung = await page.evaluate(() => formatConfig.unhKennung);
    let seiteOk = 0;
    for (const p of pruefis) {
      gesamt++;
      await page.selectOption('#pruefi', p);
      await page.evaluate(() => onPruefi());
      await befuelle(page);
      await page.evaluate(() => erzeuge());
      const res = await page.evaluate(() => ({
        edi: document.getElementById('ediOut').value,
        err: document.getElementById('errorBox').style.display === 'block'
          ? document.getElementById('errorBox').textContent : '',
      }));
      const zeilen = res.edi.split('\n').filter(Boolean);
      // UNH-Referenz ist jetzt die 12-stellige Nachrichtenreferenz (wie UTILMD)
      const hatUNH = zeilen.some(z => new RegExp('^UNH\\+\\d{1,14}\\+' + kennung.split(':')[0]).test(z));
      const hatUNT = zeilen.some(z => z.startsWith('UNT+'));
      const richtigeKennung = res.edi.includes(kennung);
      const hinweis = /Hinweis:.*wird von der Engine noch nicht emittiert/.test(res.err);
      const echteFehler = res.err && !(/^\s*(Hinweis:)/.test(res.err.trim())) &&
        res.err.split('Hinweis:')[0].trim() !== '';
      if (res.edi && hatUNH && hatUNT && richtigeKennung && !echteFehler && !hinweis) {
        ok++; seiteOk++;
      } else {
        fehler.push(`${rel} ${p}: edi=${res.edi ? 'ja' : 'NEIN'} kennung=${richtigeKennung} err=${res.err.slice(0, 160)}`);
      }
    }
    console.log(`${rel}: ${seiteOk}/${pruefis.length}`);
  }
  // Smoke-Tests: eigenständige Seiten (APERAK/CONTRL, keine Engine)
  for (const [rel, fn] of SMOKE) {
    await page.goto('file://' + path.join(ROOT, rel));
    await page.evaluate(() => {
      document.querySelectorAll('input').forEach(el => {
        if (el.value) return;
        const p = (el.placeholder || '') + ' ' + ((el.closest('.field') || {}).textContent || '');
        el.value = /TT\.MM\.JJJJ HH:MM/.test(p) ? '15.06.2026 10:30'
          : /TT\.MM\.JJJJ/.test(p) ? '15.06.2026'
          : /datum/i.test(p) ? '15.06.2026 10:30' : 'REF001';
      });
      document.querySelectorAll('select').forEach(el => {
        const o = Array.from(el.options).find(x => x.value); if (o) el.value = o.value;
      });
    });
    await page.evaluate(f => window[f](), fn);
    const edi = await page.evaluate(() => document.getElementById('ediOut').value);
    gesamt++;
    if (edi && edi.includes('UNH+')) { ok++; console.log(`${rel}: Smoke ok`); }
    else fehler.push(`${rel}: Smoke-Test ohne Ausgabe`);
  }

  console.log(`\nGESAMT: ${ok}/${gesamt}`);
  if (fehler.length) {
    console.log('\nFEHLER:');
    fehler.slice(0, 60).forEach(f => console.log(' -', f));
  }
  await browser.close();
  process.exit(fehler.length ? 1 : 0);
})();
