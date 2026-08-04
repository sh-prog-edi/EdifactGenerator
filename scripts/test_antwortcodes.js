// Prüft die Antwortcodes der Entscheidungsbaum-Diagramme (EBD):
//   1. Antwortnachrichten bieten die Codes ihrer EBD zur Auswahl an,
//   2. die Auswahl ist clusterrein (Bestätigung -> Zustimmung, Ablehnung -> Ablehnung),
//   3. der gewählte Code landet mit seiner EBD-Nummer in STS+E01,
//   4. ein Code des falschen Clusters wird vom Validator beanstandet,
//   5. jede EBD-Nummer, die der AHB für eine Antwort führt, ist in den EBD-Daten
//      vorhanden (Deckungsprüfung über alle Prüf-IDs beider Formatstände).
const { chromium } = require('playwright');
const fs = require('fs');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';
const ebdAlle = require(`${ROOT}/_engine/daten/ebd-antwortcodes.js`);

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, ok = 0;

  for (const stand of ['202604', '202610']) {
    const ebds = ebdAlle[stand].ebds;
    const page = await browser.newPage();
    page.on('pageerror', e => fehler.push(`${stand}: JS-Fehler ${e.message}`));
    await page.goto(`file://${ROOT}/${stand}/Stammdaten/UTILMD/Strom/index.html`, { waitUntil: 'load' });

    // Antwort-Prüf-IDs aus der Prozess-Meta der Seite
    const antworten = await page.evaluate(() => Object.keys(prozessMeta)
      .filter(p => ['bestaetigung', 'ablehnung'].includes((prozessMeta[p] || {}).art))
      .map(p => ({ pid: p, art: prozessMeta[p].art, cluster: prozessMeta[p].antwortcluster })));

    geprueft++;
    if (antworten.length > 20) ok++;
    else fehler.push(`${stand}: nur ${antworten.length} Antwortnachrichten gefunden`);

    let mitAuswahl = 0;
    const clusterfehler = [], sternVorgabe = [];
    for (const a of antworten) {
      const r = await page.evaluate((pid) => {
        document.getElementById('prufId').value = pid;
        renderForm();
        const sel = document.getElementById('STS_E01');
        if (!sel || sel.tagName !== 'SELECT') return { auswahl: false };
        generateEdifact();
        const n = document.getElementById('edifactOutput').value;
        return {
          auswahl: true,
          optionen: Array.from(sel.options).map(o => o.value),
          gewaehlt: sel.value,
          sts: (n.match(/STS\+E01\+\+([^'+]+)/) || [])[1] || '',
        };
      }, a.pid);
      if (!r.auswahl) continue;
      mitAuswahl++;

      const sollCluster = a.cluster === 'ablehnung' ? 'Ablehnung'
                        : (a.cluster === 'zustimmung' ? 'Zustimmung' : '');
      for (const wert of r.optionen) {
        // Einzelne Prüf-IDs führen ein eigenes, kuratiertes Auswahlfeld (etwa die
        // Kündigungsbestätigung 55017 mit E01_ZUS/E01_ABL) — das bleibt unberührt.
        if (!/^[A-Z]{1,2}[\d*]{2}:/.test(wert)) continue;
        const [code, ebd] = wert.split(':');
        const eintrag = ((ebds[ebd] || {}).codes || {})[code];
        if (!eintrag) { clusterfehler.push(`${a.pid}: ${wert} nicht im EBD`); continue; }
        if (sollCluster && eintrag.cluster && eintrag.cluster !== sollCluster)
          clusterfehler.push(`${a.pid}: ${code} ist ${eintrag.cluster}, erwartet ${sollCluster}`);
      }
      if (r.gewaehlt.startsWith('A**') && r.optionen.some(o => !o.startsWith('A**')))
        sternVorgabe.push(a.pid);
      // Der gewählte Code muss in der Nachricht stehen. Verglichen werden Antwortcode
      // (DE9013) und EBD-Nummer (DE1131); dahinter kann in derselben Gruppe C556 die
      // Zeitraum-ID (DE9012) folgen — STS+E01++A01:E_0410::1'.
      const stsCodeEbd = r.sts.split(':').slice(0, 2).join(':');
      if (r.sts && r.gewaehlt && /^[A-Z]{1,2}[\d*]{2}:/.test(r.gewaehlt) && stsCodeEbd !== r.gewaehlt)
        clusterfehler.push(`${a.pid}: STS+E01 trägt ${r.sts}, gewählt war ${r.gewaehlt}`);
    }

    geprueft++;
    if (mitAuswahl >= antworten.length * 0.8) ok++;
    else fehler.push(`${stand}: nur ${mitAuswahl} von ${antworten.length} Antwortmasken mit Code-Auswahl`);

    geprueft++;
    if (!clusterfehler.length) ok++;
    else fehler.push(`${stand}: ${clusterfehler.length} Cluster-/Codefehler, z. B. ${clusterfehler.slice(0, 3).join(' · ')}`);

    geprueft++;
    if (!sternVorgabe.length) ok++;
    else fehler.push(`${stand}: „A**" als Vorgabe bei ${sternVorgabe.slice(0, 5).join(', ')}`);

    // 4. Falscher Cluster wird beanstandet: Bestätigung 55002 mit Ablehnungscode
    const gegenprobe = await page.evaluate(async () => {
      document.getElementById('prufId').value = '55002';
      renderForm();
      const sel = document.getElementById('STS_E01');
      generateEdifact();
      let msg = document.getElementById('edifactOutput').value;
      // Ablehnungscode desselben EBD einsetzen
      msg = msg.replace(/STS\+E01\+\+A\d{2}:(E_\d{4})/, 'STS+E01++A50:$1');
      document.getElementById('importInput').value = msg;
      await runValidation();
      return Array.from(document.querySelectorAll('#validationResults tr'))
        .map(tr => Array.from(tr.cells).map(c => c.textContent).join(' | '))
        .filter(x => /Cluster/.test(x));
    });
    geprueft++;
    if (gegenprobe.length) ok++;
    else fehler.push(`${stand}: Ablehnungscode in einer Bestätigung wird nicht beanstandet`);

    // 5. Deckung: alle EBD-Nummern der AHB-Meta sind in den EBD-Daten vorhanden
    const meta = (() => {
      const t = fs.readFileSync(`${ROOT}/${stand}/Stammdaten/UTILMD/Strom/pruef-ids/_form-meta.js`, 'utf8');
      return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
    })();
    const gefordert = new Set();
    Object.values(meta).forEach(m => (m.instanzen || []).forEach(i => {
      if (i.seg !== 'STS') return;
      (i.des.find(d => d.de === '1131') || { codes: [] }).codes.forEach(c => gefordert.add(c[0]));
    }));
    const fehlen = [...gefordert].filter(k => !ebds[k]);
    geprueft++;
    if (!fehlen.length) ok++;
    else fehler.push(`${stand}: ${fehlen.length} im AHB referenzierte EBD fehlen in den Daten: ${fehlen.slice(0, 8).join(', ')}`);

    await page.close();
  }

  await browser.close();
  console.log(`\nANTWORTCODES: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
