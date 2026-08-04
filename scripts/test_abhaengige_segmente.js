// Prüft die AHB-Abhängigkeit zwischen Transaktionsgrundergänzung und Lokationsangabe
// am Beispiel UTILMD Strom 55001 (Anmeldung verbrauchende Marktlokation):
//
//   SG5 LOC+Z16 (Marktlokation)          Muss [2061] ∧ [67]
//   SG5 LOC+Z22 (Ruhende Marktlokation)  Muss [2061] ∧ [96]
//   [96] Wenn SG4 STS+7++xxx+ZAP (Transaktionsgrundergänzung ruhende Marktlokation)
//        vorhanden
//
// Erwartung: Mit ZW4 ist LOC+Z16 zu füllen und LOC+Z22 ausgeblendet, mit ZAP umgekehrt.
// In der erzeugten Nachricht darf jeweils nur die zutreffende Lokation stehen.
const { chromium } = require('playwright');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let ok = 0, gesamt = 0;

  for (const stand of ['202604', '202610']) {
    const page = await browser.newPage();
    page.on('pageerror', e => fehler.push(`${stand}: JS-Fehler ${e.message}`));
    await page.goto(`file://${ROOT}/${stand}/Stammdaten/UTILMD/Strom/index.html`, { waitUntil: 'load' });

    for (const [ergaenzung, erwartet, verboten] of [['ZW4', 'LOC+Z16', 'LOC+Z22'], ['ZAP', 'LOC+Z22', 'LOC+Z16']]) {
      gesamt++;
      const ergebnis = await page.evaluate(([code]) => {
        document.getElementById('prufId').value = '55001';
        renderForm();
        const sts = document.getElementById('STS_7');
        if (!sts) return { fehler: 'Feld STS_7 fehlt' };
        if (!Array.from(sts.options).some(o => o.value === code)) {
          return { fehler: `Code ${code} steht im Auswahlfeld nicht zur Verfügung (Optionen: ${Array.from(sts.options).map(o => o.value).join(',')})` };
        }
        sts.value = code;
        aktualisiereAbhaengigkeiten();
        const sichtbar = id => {
          const el = document.getElementById(id);
          const block = el && el.closest('.form-group');
          return !!block && block.style.display !== 'none';
        };
        // beide Lokationsfelder befüllen — nur das zutreffende darf in der Nachricht landen
        ['LOC_Z16', 'LOC_Z22'].forEach(id => { const el = document.getElementById(id); if (el) el.value = '51238696781'; });
        document.querySelectorAll('#dynamicForm input[id^="DTM_"]').forEach(el => { if (!el.readOnly) el.value = '01.10.2026'; });
        generateEdifact();
        return {
          z16Sichtbar: sichtbar('LOC_Z16'), z22Sichtbar: sichtbar('LOC_Z22'),
          nachricht: document.getElementById('edifactOutput').value
        };
      }, [ergaenzung]);

      if (ergebnis.fehler) { fehler.push(`${stand} ${ergaenzung}: ${ergebnis.fehler}`); continue; }

      const sichtbarOk = ergaenzung === 'ZW4'
        ? (ergebnis.z16Sichtbar && !ergebnis.z22Sichtbar)
        : (ergebnis.z22Sichtbar && !ergebnis.z16Sichtbar);
      const nachrichtOk = ergebnis.nachricht.includes(erwartet) && !ergebnis.nachricht.includes(verboten);

      if (sichtbarOk && nachrichtOk) { ok++; }
      else {
        fehler.push(`${stand} ${ergaenzung}: sichtbar Z16=${ergebnis.z16Sichtbar} Z22=${ergebnis.z22Sichtbar}; `
          + `Nachricht enthält ${erwartet}=${ergebnis.nachricht.includes(erwartet)} ${verboten}=${ergebnis.nachricht.includes(verboten)}`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log(`\nABHÄNGIGE SEGMENTE (55001 STS+7 -> SG5 LOC): ${ok}/${gesamt}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
