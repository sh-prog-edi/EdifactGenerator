// Prüft, dass jede Nachricht gegen ihr eigenes AHB/MIG geprüft wird — unabhängig
// davon, welche Maske geöffnet ist. Seit der Konsolidierung nutzen Masken und
// universeller Validator dieselbe Logik (_engine/import-pruefung.js):
//   1. zuständige Maske  -> Formatstand, Sparte und Prüf-ID werden erkannt,
//   2. fremde Maske      -> erkennt dieselbe Herkunft, weist auf die zuständige
//                           Maske hin und liefert dieselben Befunde (gleiche
//                           Prüfgrundlage, kein Ergebnisunterschied),
//   3. universeller Validator -> wählt den Formatstand anhand der UNH-Kennung.
const { chromium } = require('playwright');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';
const MASKEN = [
  { stand: '202604', sparte: 'Strom', unh: 'UTILMD:D:11A:UN:S2.1', pid: '55001' },
  { stand: '202610', sparte: 'Strom', unh: 'UTILMD:D:11A:UN:S2.2', pid: '55001' },
  { stand: '202604', sparte: 'Gas', unh: 'UTILMD:D:11A:UN:G1.1', pid: '44001' },
  { stand: '202610', sparte: 'Gas', unh: 'UTILMD:D:11A:UN:G1.2', pid: '44001' },
];

const seiteVon = m => `${m.stand}/Stammdaten/UTILMD/${m.sparte}/index.html`;

async function erzeuge(browser, m) {
  const p = await browser.newPage();
  await p.goto(`file://${ROOT}/${seiteVon(m)}`, { waitUntil: 'load' });
  const text = await p.evaluate((pid) => {
    document.getElementById('prufId').value = pid; renderForm();
    document.querySelectorAll('#dynamicForm input[id^="DTM_"]').forEach(el => { if (!el.readOnly) el.value = '01.10.2026'; });
    ['LOC_Z16', 'LOC_Z13'].forEach(id => { const el = document.getElementById(id); if (el) el.value = '51238696781'; });
    generateEdifact();
    return document.getElementById('edifactOutput').value;
  }, m.pid);
  await p.close();
  return text;
}

async function validiereAuf(browser, seite, text) {
  const p = await browser.newPage();
  const js = [];
  p.on('pageerror', e => js.push(e.message));
  await p.goto(`file://${ROOT}/${seite}`, { waitUntil: 'load' });
  const r = await p.evaluate(async (t) => {
    document.getElementById('importInput').value = t;
    await runValidation();
    const zeilen = Array.from(document.querySelectorAll('#validationResults tr'))
      .map(tr => Array.from(tr.cells).map(c => c.textContent).join(' | '));
    return {
      summary: document.getElementById('validationSummary').textContent.replace(/\s+/g, ' '),
      fehler: zeilen.filter(x => /^FEHLER/.test(x)),
      hinweise: zeilen.filter(x => /^HINWEIS/.test(x)),
      link: !!document.querySelector('#validationSummary a'),
    };
  }, text);
  await p.close();
  return { ...r, js };
}

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, ok = 0;

  const nachrichten = {};
  for (const m of MASKEN) nachrichten[m.stand + m.sparte] = await erzeuge(browser, m);

  for (const m of MASKEN) {
    const text = nachrichten[m.stand + m.sparte];
    geprueft++;
    if (new RegExp(`UNH\\+[^+]+\\+${m.unh.replace(/\./g, '\\.')}`).test(text)) ok++;
    else fehler.push(`${m.stand} ${m.sparte}: erzeugte Nachricht trägt nicht ${m.unh}`);

    // 1. zuständige Maske: Herkunft und Prüf-ID erkannt, keine Fehler
    const eigen = await validiereAuf(browser, seiteVon(m), text);
    geprueft++;
    const erkannt = eigen.summary.includes(m.stand) && eigen.summary.includes(m.unh)
      && eigen.summary.includes(`Prüf-ID ${m.pid}`);
    if (erkannt && !eigen.js.length) ok++;
    else fehler.push(`${m.stand} ${m.sparte} (zuständig): Herkunft/Prüf-ID nicht erkannt — ${eigen.summary.slice(0, 120)}`
      + (eigen.js.length ? ` | JS ${eigen.js[0]}` : ''));
    // Befunde über nicht gefüllte Formularfelder sind hier erwartbar (der Test füllt
    // nur Termin und Marktlokation). Fehler an der Prüfgrundlage selbst — unbekannte
    // Segmente, falsche Version — dürfen nicht auftreten.
    geprueft++;
    const grundlage = eigen.fehler.filter(x => /nicht vorgesehen|Version|Nicht benutzt/.test(x));
    if (!grundlage.length) ok++;
    else fehler.push(`${m.stand} ${m.sparte} (zuständig): ${grundlage.length} Befund(e) zur Prüfgrundlage, z. B. ${grundlage[0].slice(0, 110)}`);

    // 2. fremde Masken: dieselbe Prüfgrundlage, dasselbe Ergebnis, Verweis vorhanden
    for (const f of MASKEN) {
      if (f.stand === m.stand && f.sparte === m.sparte) continue;
      const res = await validiereAuf(browser, seiteVon(f), text);
      geprueft++;
      const gleicheHerkunft = res.summary.includes(m.stand) && res.summary.includes(m.unh);
      if (gleicheHerkunft && res.link && !res.js.length) ok++;
      else fehler.push(`${m.stand} ${m.sparte} auf ${f.stand} ${f.sparte}: Herkunft/Verweis fehlt — ${res.summary.slice(0, 120)}`
        + (res.js.length ? ` | JS ${res.js[0]}` : ''));
      geprueft++;
      if (res.fehler.join('|') === eigen.fehler.join('|')) ok++;
      else fehler.push(`${m.stand} ${m.sparte} auf ${f.stand} ${f.sparte}: abweichendes Ergebnis `
        + `(${res.fehler.length} statt ${eigen.fehler.length} Fehler)`);
    }

    // 3. universeller Validator über die Fragmentübergabe
    const v = await browser.newPage();
    const vjs = [];
    v.on('pageerror', e => vjs.push(e.message));
    await v.goto(`file://${ROOT}/validator.html#pruefe=` + encodeURIComponent(text), { waitUntil: 'load' });
    await v.waitForTimeout(1200);
    const erkennung = await v.evaluate(() => ({
      text: document.getElementById('erkennung').textContent.replace(/\s+/g, ' '),
      ergebnis: document.getElementById('panelErgebnis').style.display !== 'none',
    }));
    await v.close();
    geprueft++;
    if (erkennung.text.includes(m.unh) && erkennung.text.includes(m.stand) && erkennung.ergebnis && !vjs.length) ok++;
    else fehler.push(`${m.stand} ${m.sparte}: universeller Validator erkennt nicht ${m.unh}/${m.stand} `
      + `(${erkennung.text.slice(0, 120)}${vjs.length ? ' JS-Fehler ' + vjs[0] : ''})`);
  }

  await browser.close();
  console.log(`\nVERSION/ZUSTÄNDIGKEIT: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
