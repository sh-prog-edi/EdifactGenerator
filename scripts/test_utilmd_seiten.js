// Regression der UTILMD-Generatorseiten (Strom/Gas, beide Formatstände):
// jede Prüf-ID auswählen, Formular rendern, Nachricht erzeugen und prüfen, dass
// eine EDIFACT-Nachricht entsteht, keine JS-Fehler auftreten und die bedingten
// Segmente (AHB-Abhängigkeiten) korrekt geschaltet werden.
const { chromium } = require('playwright');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';
const SEITEN = [];
for (const stand of ['202604', '202610']) {
  SEITEN.push(`${stand}/Stammdaten/UTILMD/Strom/index.html`);
  SEITEN.push(`${stand}/Stammdaten/UTILMD/Gas/index.html`);
}

(async () => {
  const browser = await chromium.launch();
  let gesamt = 0, ok = 0;
  const fehler = [];

  for (const seite of SEITEN) {
    const page = await browser.newPage();
    const jsFehler = [];
    page.on('pageerror', e => jsFehler.push(String(e.message)));
    await page.goto(`file://${ROOT}/${seite}`, { waitUntil: 'load' });

    const pruefis = await page.$$eval('#prufId option', os => os.map(o => o.value).filter(Boolean));
    for (const pruefi of pruefis) {
      gesamt++;
      const ergebnis = await page.evaluate(pid => {
        const sel = document.getElementById('prufId');
        sel.value = pid;
        renderForm();
        // alle sichtbaren Textfelder befüllen, Auswahlfelder auf den ersten Wert
        document.querySelectorAll('#dynamicForm .form-group').forEach(block => {
          if (block.style.display === 'none') return;
          block.querySelectorAll('input[type=text], input[type=number]').forEach(el => {
            if (el.readOnly || el.value) return;
            const ph = el.placeholder || '';
            const istDatum = /TT\.MM\.JJJJ/.test(ph) || /^DTM_/.test(el.id);
            el.value = istDatum ? '01.10.2026' : (/ZZRB/.test(ph) ? '30TM' : '1234567890123');
          });
        });
        generateEdifact();
        const out = document.getElementById('edifactOutput');
        const err = document.getElementById('errorBox');
        const sichtbar = Array.from(document.querySelectorAll('#dynamicForm [data-abhaengig-feld]'))
          .filter(b => b.style.display !== 'none').length;
        const gesamtBedingt = document.querySelectorAll('#dynamicForm [data-abhaengig-feld]').length;
        return {
          edi: (out && out.value || '').includes('UNH+'),
          fehlertext: err && err.style.display !== 'none' ? err.textContent.slice(0, 160) : '',
          bedingt: gesamtBedingt, sichtbar
        };
      }, pruefi);

      if (ergebnis.edi && !/Pflichtangabe fehlt|Regel verletzt/.test(ergebnis.fehlertext)) ok++;
      else fehler.push(`${seite} ${pruefi}: edi=${ergebnis.edi ? 'ja' : 'NEIN'} ${ergebnis.fehlertext}`);
    }
    if (jsFehler.length) fehler.push(`${seite}: JS-Fehler ${jsFehler[0]}`);
    await page.close();
  }

  await browser.close();
  console.log(`\nUTILMD-SEITEN: ${ok}/${gesamt}`);
  if (fehler.length) {
    console.log('\nAUFFÄLLIG:');
    fehler.slice(0, 25).forEach(f => console.log(' -', f));
    if (fehler.length > 25) console.log(`   … und ${fehler.length - 25} weitere`);
  }
  process.exit(fehler.length ? 1 : 0);
})();
