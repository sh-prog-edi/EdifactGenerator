// Regression: Bildschirmaufteilung und Kalender-Popup.
//
// Zwei Zusagen an die Bedienung werden hier festgenagelt:
//
//  1. Die Eingabemaske endet am unteren Fensterrand — ihre Bildlaufleiste ist damit
//     vollständig sichtbar, ohne dass man erst die ganze Seite scrollen muss. Geprüft
//     in mehreren Fenstergrößen vom 13-Zoll-Laptop bis zum 24-Zoll-Monitor.
//  2. Das Kalenderblatt liegt immer vollständig im Fenster: rechtsbündig zum Datumsfeld,
//     unterhalb der Eingabezeile in der oberen Bildschirmhälfte, oberhalb in der unteren.
//
// Stehen die Spalten untereinander (schmales Fenster), ist die Seite selbst der
// Scrollbereich — dann darf die Spalte länger als das Fenster sein.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const GROESSEN = [
  { name: '13 Zoll (1440×900)', width: 1440, height: 900 },
  { name: '24 Zoll (1920×1080)', width: 1920, height: 1080 },
  { name: '24 Zoll (2560×1290)', width: 2560, height: 1290 },
];
const SEITEN = [];
for (const stand of ['202604', '202610']) {
  SEITEN.push(
    [`Stammdaten/UTILMD/Strom/index.html?stand=${stand}`, '#prufId'],
    [`Stammdaten/UTILMD/Gas/index.html?stand=${stand}`, '#prufId'],
    [`Stammdaten/UTILMD/Strom/vollformular.html?stand=${stand}`, '#pruefi'],
    [`Stammdaten/UTILMD/Gas/vollformular.html?stand=${stand}`, '#pruefi'],
    [`Bewegungsdaten/MSCONS/index.html?stand=${stand}`, '#pruefi'],
    [`Bestellvorgang/ORDERS/index.html?stand=${stand}`, '#pruefi'],
    [`Rechnungsstellung/INVOIC/index.html?stand=${stand}`, '#pruefi'],
    [`Berichte/IFTSTA/index.html?stand=${stand}`, '#pruefi'],
    [`Stammdaten/PARTIN/index.html?stand=${stand}`, '#pruefi'],
    [`Stammdaten/UTILTS/index.html?stand=${stand}`, '#pruefi'],
  );
}

const fehler = [];
let layoutGeprueft = 0, kalenderGeprueft = 0, monatsblatt = 0;

async function waehle(page, sel, wert) {
  await page.selectOption(sel, wert);
  if (sel === '#pruefi') await page.evaluate(() => onPruefi());
  await page.waitForTimeout(220);
}

(async () => {
  const browser = await chromium.launch();

  // ---- 1. Spaltenhöhe --------------------------------------------------
  for (const g of GROESSEN) {
    const page = await browser.newPage({ viewport: { width: g.width, height: g.height } });
    page.on('pageerror', e => fehler.push(`JS-Fehler (${g.name}): ${e.message}`));
    for (const [rel, sel] of SEITEN) {
      // Seit Phase 3 tragen die Seiten-URLs den Formatstand als Parameter —
      // für die Existenzprüfung zählt nur der Dateipfad.
      const [reinerPfad, abfrage] = rel.split('?');
      const datei = path.join(ROOT, reinerPfad);
      if (!fs.existsSync(datei)) continue;
      await page.goto('file://' + datei + (abfrage ? '?' + abfrage : ''));
      await page.waitForTimeout(250);
      const opts = await page.$$eval(sel, s => s[0] ? Array.from(s[0].options).map(o => o.value).filter(Boolean) : []);
      if (!opts.length) continue;
      await waehle(page, sel, opts[0]);
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => {
        const p = document.querySelector('.left-panel');
        if (!p) return null;
        const r = p.getBoundingClientRect();
        return { unten: r.bottom, fenster: window.innerHeight,
                 gestapelt: p.offsetWidth >= p.parentElement.clientWidth - 4 };
      });
      if (!m) continue;
      layoutGeprueft++;
      // Untereinander gestapelt scrollt die Seite selbst — dann ist Überlänge richtig.
      if (!m.gestapelt && m.unten > m.fenster + 1)
        fehler.push(`${g.name} ${rel}: Eingabemaske endet bei ${Math.round(m.unten)} px, `
                  + `Fenster ist ${m.fenster} px hoch — Bildlaufleiste nicht vollständig sichtbar.`);
    }
    await page.close();
  }

  // ---- 2. Kalenderblatt ------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => fehler.push(`JS-Fehler (Kalender): ${e.message}`));
  for (const [rel, sel] of SEITEN) {
    // Seit Phase 3 tragen die Seiten-URLs den Formatstand als Parameter —
    // für die Existenzprüfung zählt nur der Dateipfad.
    const [reinerPfad, abfrage] = rel.split('?');
    const datei = path.join(ROOT, reinerPfad);
    if (!fs.existsSync(datei)) continue;
    await page.goto('file://' + datei + (abfrage ? '?' + abfrage : ''));
    await page.waitForTimeout(250);
    const opts = await page.$$eval(sel, s => s[0] ? Array.from(s[0].options).map(o => o.value).filter(Boolean) : []);
    if (!opts.length) continue;
    for (const idx of [0, Math.floor(opts.length / 2), opts.length - 1]) {
      if (!opts[idx]) continue;
      await waehle(page, sel, opts[idx]);
      const knoepfe = await page.$$('.dtm-kalender-btn');
      // Je Prüf-ID zwei Lagen prüfen: Feld oben im sichtbaren Bereich und ganz unten.
      for (const lage of ['oben', 'unten']) {
        const k = knoepfe[lage === 'oben' ? 0 : knoepfe.length - 1];
        if (!k) continue;
        await page.evaluate(l => {
          const p = document.querySelector('.left-panel');
          if (p) p.scrollTop = l === 'oben' ? 0 : p.scrollHeight;
        }, lage);
        await page.waitForTimeout(80);
        try { await k.click({ timeout: 1500 }); } catch (e) { continue; }
        await page.waitForTimeout(120);
        const m = await page.evaluate(() => {
          const kal = document.querySelector('.edi-kal');
          if (!kal) return null;
          const r = kal.getBoundingClientRect();
          const a = document.querySelector('.edi-kal-anker-test');
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right,
                   fh: window.innerHeight, fb: window.innerWidth,
                   monat: !!kal.querySelector('.edi-kal-raster.monate') };
        });
        if (!m) continue;
        kalenderGeprueft++;
        if (m.monat) monatsblatt++;
        if (m.top < -0.5 || m.bottom > m.fh + 0.5 || m.left < -0.5 || m.right > m.fb + 0.5)
          fehler.push(`${rel} ${opts[idx]} (${lage}): Kalender ragt aus dem Fenster `
                    + `(oben ${Math.round(m.top)}, unten ${Math.round(m.bottom)}, Fenster ${m.fh}).`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(60);
      }
    }
    process.stdout.write('.');
  }

  // ---- 3. Klapprichtung nach Bildschirmhälfte ---------------------------
  // Ein Feld wird gezielt in die obere und in die untere Bildschirmhälfte gebracht;
  // das Blatt muss jeweils in die andere Richtung aufklappen.
  await page.goto('file://' + path.join(ROOT, 'Stammdaten/UTILMD/Strom/index.html?stand=202604'));
  await page.selectOption('#prufId', '55001');
  await page.waitForTimeout(400);
  for (const lage of ['oben', 'unten']) {
    const richtung = await page.evaluate(async l => {
      const btn = document.querySelectorAll('.dtm-kalender-btn');
      const b = btn[btn.length - 1];
      const p = document.querySelector('.left-panel');
      p.scrollTop = l === 'oben' ? 0 : p.scrollHeight;
      await new Promise(r => setTimeout(r, 120));
      b.click();
      await new Promise(r => setTimeout(r, 150));
      const kal = document.querySelector('.edi-kal');
      const feld = b.closest('.dtm-feld').getBoundingClientRect();
      const k = kal.getBoundingClientRect();
      return { obereHaelfte: (feld.top + feld.height / 2) < window.innerHeight / 2,
               klapptNachUnten: k.top >= feld.bottom - 1 };
    }, lage);
    if (richtung.obereHaelfte !== richtung.klapptNachUnten)
      fehler.push(`Klapprichtung (${lage}): Feld in ${richtung.obereHaelfte ? 'oberer' : 'unterer'} `
                + `Bildschirmhälfte, Kalender klappt nach ${richtung.klapptNachUnten ? 'unten' : 'oben'}.`);
    await page.keyboard.press('Escape');
  }

  await browser.close();
  console.log(`\nSpaltenhöhe: ${layoutGeprueft} Messungen · Kalender: ${kalenderGeprueft} Öffnungen `
            + `(davon ${monatsblatt} Monatsauswahl)`);
  if (fehler.length) {
    console.log('\nFEHLER:');
    fehler.slice(0, 30).forEach(f => console.log(' -', f));
    process.exit(1);
  }
  console.log('Eingabemaske und Kalender bleiben in jeder geprüften Fenstergröße vollständig sichtbar.');
})();
