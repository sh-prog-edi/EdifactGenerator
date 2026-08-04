// Regression: Speichern der erzeugten Nachricht als Übertragungsdatei.
//
// Zugesagt ist: **jede** erzeugte Nachricht lässt sich als marktkonforme .txt-Datei
// sichern — gleich welcher Nachrichtentyp, auch Antwort- und Folgenachrichten, und im
// Validator auch eine eingelesene Datei. Der Dateiname folgt den Allgemeinen
// Festlegungen, Abschnitt 2.12:
//
//     Nachrichtentyp_Anwendungsreferenz_von_an_yyyymmdd_DAR.txt
//
// Geprüft wird in vier Stufen:
//   1. Namensbildung gegen die beiden Beispiele des Dokuments (ohne Browser).
//   2. Jede Generatorseite und der Validator führen die Schaltfläche.
//   3. Der Download läuft und liefert Name und Inhalt wie erwartet (keine
//      Zeilenumbrüche, Zeichensatz ISO 8859-1 passend zu UNB DE0001 = UNOC).
//   4. Der Weg über eine Folgenachricht: Anfrage erzeugen, Antwortmaske öffnen,
//      Antwort erzeugen, speichern.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const fehler = [];

// ---- 1. Namensbildung ----------------------------------------------------
const Speichern = require(path.join(ROOT, '_engine/nachricht-speichern.js'));
const STICHTAG = new Date(Date.UTC(2007, 0, 31));
const BEISPIELE = [
  // Beide Beispiele stehen wörtlich in den Allgemeinen Festlegungen, Abschnitt 2.12.
  ["UNA:+.? 'UNB+UNOC:3+9900123400007:500+4012345393651:14+070131:1200+A177++++++1'"
   + "UNH+A177+UTILMD:D:11A:UN:S2.1'UNZ+1+A177'",
   'UTILMD__9900123400007_4012345393651_20070131_A177.txt'],
  ["UNB+UNOC:3+9900123400007:500+4012345393651:14+070131:1200+B31++TL+++++1'"
   + "UNH+B31+MSCONS:D:04B:UN:2.4c'UNZ+1+B31'",
   'MSCONS_TL_9900123400007_4012345393651_20070131_B31.txt'],
];
for (const [nachricht, soll] of BEISPIELE) {
  const ist = Speichern.dateiname(nachricht, STICHTAG);
  if (ist !== soll) fehler.push(`Namensbildung: "${ist}" statt "${soll}"`);
}
// Zeilenumbrüche des Editors gehören nicht in die Übertragungsdatei.
if (/\n/.test(Speichern.inhalt("UNB+…'\nUNH+…'"))) fehler.push('Inhalt: Zeilenumbrüche nicht entfernt');
// Umlaute müssen als Latin-1-Byte herauskommen, nicht als UTF-8-Paar.
const bytes = Speichern.alsLatin1('FTX+ABO+++Begründung');
if (bytes[Array.from('FTX+ABO+++Begr').length] !== 0xFC)
  fehler.push('Zeichensatz: "ü" nicht als ISO-8859-1 (0xFC) kodiert');
// Das Freistellungszeichen darf nie als Ersatzzeichen entstehen.
if (Array.from(Speichern.alsLatin1('Zeichen 中')).includes(0x3F))
  fehler.push('Zeichensatz: unbekanntes Zeichen wurde zu "?" (EDIFACT-Freistellungszeichen)');

const SEITEN = [];
for (const stand of ['202604', '202610']) {
  SEITEN.push(
    [`Stammdaten/UTILMD/Strom/index.html?stand=${stand}`, '#prufId', 'edifactOutput', 'generateEdifact'],
    [`Stammdaten/UTILMD/Gas/index.html?stand=${stand}`, '#prufId', 'edifactOutput', 'generateEdifact'],
    [`Stammdaten/UTILMD/Strom/vollformular.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Stammdaten/UTILMD/Gas/vollformular.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bewegungsdaten/MSCONS/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bestellvorgang/ORDERS/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bestellvorgang/ORDRSP/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bestellvorgang/ORDCHG/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bestellvorgang/QUOTES/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Bestellvorgang/REQOTE/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Rechnungsstellung/INVOIC/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Rechnungsstellung/REMADV/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Rechnungsstellung/COMDIS/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Rechnungsstellung/PRICAT/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Berichte/IFTSTA/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Berichte/INSRPT/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Stammdaten/PARTIN/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Stammdaten/UTILTS/index.html?stand=${stand}`, '#pruefi', 'ediOut', 'erzeuge'],
    [`Servicenachrichten/APERAK/index.html?stand=${stand}`, null, 'ediOut', 'generateAperak'],
    [`Servicenachrichten/CONTRL/index.html?stand=${stand}`, null, 'ediOut', 'generateContrl'],
  );
}

const MUSTER = /^[A-Z]+_[A-Z]*_\d{6,}_\d{6,}_\d{8}_[A-Za-z0-9]+\.txt$/;

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
    // APERAK und CONTRL sind eigenständige Seiten ohne die Feldbereiche der Engine —
    // dort werden alle Eingaben angesprochen.
    const bereiche = document.querySelectorAll('#kopfFelder input, #posListe input, .form-group input');
    const felder = bereiche.length ? bereiche : document.querySelectorAll('input');
    felder.forEach(el => {
      if (el.value || el.readOnly) return;
      if (['checkbox', 'radio', 'file', 'button', 'submit'].includes(el.type)) return;
      const lab = el.closest('.field') || el.closest('.form-group');
      el.value = wert(el.placeholder, lab ? lab.textContent : '');
    });
    const auswahl = document.querySelectorAll('#kopfFelder select, #posListe select');
    (auswahl.length ? auswahl : document.querySelectorAll('select')).forEach(el => {
      if (el.multiple) { if (el.options.length) el.options[0].selected = true; }
      else { const o = Array.from(el.options).find(x => x.value); if (o) el.value = o.value; }
    });
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => fehler.push(`JS-Fehler: ${e.message}`));
  let geprueft = 0;

  // ---- 2./3. Schaltfläche und Download je Seite --------------------------
  for (const [rel, sel, feld, fn] of SEITEN) {
    // Seit Phase 3 tragen die Seiten-URLs den Formatstand als Parameter —
    // für die Existenzprüfung zählt nur der Dateipfad.
    const [reinerPfad, abfrage] = rel.split('?');
    const datei = path.join(ROOT, reinerPfad);
    if (!fs.existsSync(datei)) { fehler.push(`${rel}: Seite fehlt`); continue; }
    await page.goto('file://' + datei + (abfrage ? '?' + abfrage : ''));
    await page.waitForTimeout(250);

    const knopf = await page.$('button:has-text("Als marktkonforme Datei")');
    if (!knopf) { fehler.push(`${rel}: keine Schaltfläche zum Speichern`); continue; }

    if (sel) {
      const opts = await page.$$eval(sel, s => s[0] ? Array.from(s[0].options).map(o => o.value).filter(Boolean) : []);
      if (!opts.length) { fehler.push(`${rel}: keine Prüf-ID wählbar`); continue; }
      await page.selectOption(sel, opts[0]);
      if (sel === '#pruefi') await page.evaluate(() => onPruefi());
      await page.waitForTimeout(200);
    }
    await befuelle(page);
    await page.evaluate(f => window[f](), fn);
    await page.waitForTimeout(250);

    const leer = await page.evaluate(id => !document.getElementById(id).value.trim(), feld);
    if (leer) { fehler.push(`${rel}: keine Nachricht erzeugt, Speichern nicht prüfbar`); continue; }

    let download;
    try {
      const warte = page.waitForEvent('download', { timeout: 8000 });
      await knopf.click();
      download = await warte;
    } catch (e) { fehler.push(`${rel}: kein Download ausgelöst`); continue; }

    geprueft++;
    const name = download.suggestedFilename();
    if (!MUSTER.test(name)) fehler.push(`${rel}: Dateiname "${name}" folgt nicht der Namenskonvention`);
    const typ = name.split('_')[0];
    const inhalt = fs.readFileSync(await download.path(), 'latin1');
    if (/\r?\n/.test(inhalt)) fehler.push(`${rel}: Übertragungsdatei enthält Zeilenumbrüche`);
    if (!inhalt.includes(`UNH+`)) fehler.push(`${rel}: Übertragungsdatei ohne UNH`);
    // Der Nachrichtentyp im Namen muss dem UNH der Datei entsprechen.
    const m = /UNH\+[^+]*\+([A-Z]+)/.exec(inhalt);
    if (m && m[1] !== typ) fehler.push(`${rel}: Name nennt ${typ}, die Nachricht ist ${m[1]}`);
  }

  // ---- Validator ---------------------------------------------------------
  await page.goto('file://' + path.join(ROOT, 'validator.html'));
  await page.waitForTimeout(250);
  await page.fill('#eingabe', BEISPIELE[0][0]);
  try {
    const warte = page.waitForEvent('download', { timeout: 8000 });
    await page.click('button:has-text("Als marktkonforme Datei")');
    const d = await warte;
    geprueft++;
    if (!/^UTILMD__9900123400007_4012345393651_\d{8}_A177\.txt$/.test(d.suggestedFilename()))
      fehler.push(`validator.html: Dateiname "${d.suggestedFilename()}" unerwartet`);
  } catch (e) { fehler.push('validator.html: kein Download ausgelöst'); }

  // ---- 4. Folgenachricht -------------------------------------------------
  await page.goto('file://' + path.join(ROOT, 'Stammdaten/UTILMD/Strom/index.html?stand=202604'));
  await page.selectOption('#prufId', '55016');
  await page.waitForTimeout(400);
  await page.fill('#LOC_Z16', '50052281648');
  await page.fill('#DTM_93', '01.09.2026');
  await page.evaluate(() => generateEdifact());
  await page.waitForTimeout(300);
  const link = await page.$('#folgeNachrichten a');
  if (!link) fehler.push('Folgenachricht: kein Verweis auf eine Antwortmaske angeboten');
  else {
    const [antwort] = await Promise.all([ctx.waitForEvent('page'), link.click()]);
    await antwort.waitForLoadState();
    await antwort.waitForTimeout(900);
    await befuelle(antwort);
    await antwort.evaluate(() => erzeuge());
    await antwort.waitForTimeout(300);
    try {
      const warte = antwort.waitForEvent('download', { timeout: 8000 });
      await antwort.click('button:has-text("Als marktkonforme Datei")');
      const d = await warte;
      geprueft++;
      if (!MUSTER.test(d.suggestedFilename()))
        fehler.push(`Folgenachricht: Dateiname "${d.suggestedFilename()}" folgt nicht der Namenskonvention`);
    } catch (e) { fehler.push('Folgenachricht: kein Download ausgelöst'); }
    await antwort.close();
  }

  await browser.close();
  console.log(`Gespeicherte Nachrichten geprüft: ${geprueft} (${SEITEN.length} Generatorseiten, Validator, Folgenachricht)`);
  if (fehler.length) {
    console.log('\nFEHLER:');
    fehler.slice(0, 30).forEach(f => console.log(' -', f));
    process.exit(1);
  }
  console.log('Jede erzeugte Nachricht lässt sich als marktkonforme Übertragungsdatei sichern.');
})();
