// test_edi_escaping.js — Release-Zeichen-Escaping freier Eingabefelder im Generator.
//
// Anlass (Sicherheitsaudit, Protokoll Abschnitt 70): Freie Eingabefelder ohne
// Codeliste werden vor der Ausgabe in aller Regel über die interne edi()-
// Funktion release-zeichen-escaped (?, +, :, ' werden zu ??, ?+, ?:, ?'), damit
// ein im Feld getippter EDIFACT-Sonderzeichen die Nachricht nicht syntaktisch
// zerstört. Bei RNG (DE6162/6152, "Bereichsangabe" — z. B. Mengenangaben in
// QUOTES/PRICAT) und MEA (DE6314, Maßwert) fehlte dieser Schritt: Ein
// Apostroph im Feld (z. B. "123'999" als Tausendertrennzeichen getippt) brach
// das Segment mitten im Wert ab und zerlegte den Rest der Nachricht in
// Fragmente — anders als bei den strukturell gleichartigen QTY/MOA/PRI/PCD/TAX
// (dort verhindert eine vorgeschaltete isNaN()-Prüfung dasselbe Problem, da
// ein Apostroph keine gültige Zahl ergibt). Geschlossen mit edi() an RNG, MEA
// und den PRI-Zusatzfeldern (Basis/Einheit, ebenfalls ohne Codeliste möglich).
//
// Test: PID 15005 (QUOTES) mit einem Apostroph im RNG-Feld erzeugen — die
// Ausgabe muss weiterhin exakt 34 Segmente (UNA bis UNZ, wie ohne Manipulation)
// enthalten, und die RNG-Zeile muss den Apostroph escaped (?') tragen.
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.join(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR', e.message));

  let geprueft = 0, ok = 0;
  const fehler = [];
  const pruefe = (name, gut) => { geprueft++; if (gut) ok++; else fehler.push(name); };

  await page.goto(`file://${ROOT}/Bestellvorgang/QUOTES/index.html`);
  // ahb-validator.js liegt auf dieser Seite nicht standardmäßig — für die
  // Gegenprobe (release-zeichen-bewusstes Parsen) gezielt nachladen.
  await page.addScriptTag({ path: path.join(ROOT, '_engine', 'ahb-validator.js') });
  await page.selectOption('#pruefi', '15005');
  await page.waitForTimeout(300);
  await page.fill('#absender', '9900000000001');
  await page.fill('#empfaenger', '9900000000002');

  // Alle Pflichtfelder generisch befüllen (Datumsfelder mit gültigem Datum,
  // Preisfelder numerisch, alles andere mit einem harmlosen Testwert).
  await page.evaluate(() => {
    document.querySelectorAll('.field').forEach(div => {
      const inp = div.querySelector('input');
      if (!inp || inp.value || inp.id.endsWith('_kal')) return;
      const txt = (div.querySelector('label') || {}).textContent || '';
      let v;
      if (/TT\.MM\.JJJJ/.test(inp.placeholder || '')) v = '01.10.2026 08:00';
      else if (/Preis|DE5118|DE5004|DE6060|DE5482/.test(txt)) v = '12.5';
      else v = 'TESTWERT1';
      inp.value = v;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // RNG-Felder (Mengenangabe, freier Wert ohne Codeliste) mit einem Apostroph
  // befüllen — im Alltag z. B. als Tausendertrennzeichen getippt.
  const rngIds = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.field').forEach(div => {
      const label = div.querySelector('label'); const input = div.querySelector('input');
      if (label && input && /Mengenangabe/.test(label.textContent)) out.push(input.id);
    });
    return out;
  });
  pruefe('PID 15005: RNG-Mengenangabe-Felder gefunden', rngIds.length > 0);
  for (const id of rngIds) await page.fill('#' + id, "123'999");

  await page.evaluate(() => erzeuge());
  await page.waitForTimeout(300);
  const state = await page.evaluate(() => ({
    errHtml: document.getElementById('errorBox').innerHTML,
    ediOut: document.getElementById('ediOut').value,
  }));
  pruefe('Nachricht ohne Fehlermeldung erzeugt', !state.errHtml);

  const rngZeilen = state.ediOut.split('\n').filter(l => l.includes('RNG'));
  pruefe('RNG-Zeile enthält den Apostroph escaped (?\') statt eines rohen Segmentendes',
    rngZeilen.length > 0 && rngZeilen.every(l => l.includes("123?'999")));
  // Ohne Escaping zerlegt der rohe Apostroph "123'999'" in zwei Fragmente;
  // korrekt escaped kommt "'999" ausschließlich als "?'999" vor (nie roh).
  pruefe('kein unescaped Segmentende mitten im Mengenwert in der gesamten Nachricht',
    !/[^?]'999/.test(state.ediOut));
  // Gegenprobe mit dem eigenen Parser (release-zeichen-bewusst, im Unterschied
  // zu einem naiven String-Split): UNT DE0074 muss weiterhin mit der Anzahl der
  // tatsächlich geparsten Segmente (UNH bis UNT) übereinstimmen — bei einer
  // durch den rohen Apostroph zerlegten Nachricht klaffen beide auseinander.
  const parseErgebnis = await page.evaluate((text) => {
    const p = AhbValidator.parse(text);
    const iUNH = p.segmente.findIndex(s => s.tag === 'UNH');
    const iUNT = p.segmente.findIndex(s => s.tag === 'UNT');
    const unt = iUNT >= 0 ? Number((p.segmente[iUNT].elemente[0] || [])[0]) : null;
    return { anzahl: iUNT - iUNH + 1, unt, parserFehler: p.fehler };
  }, state.ediOut);
  pruefe('UNT DE0074 stimmt mit der vom Parser gezählten Segmentzahl überein (Nachricht nicht zerlegt)',
    parseErgebnis.unt === parseErgebnis.anzahl && parseErgebnis.parserFehler.length === 0);

  await browser.close();
  console.log(`\nEDI-ESCAPING: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
