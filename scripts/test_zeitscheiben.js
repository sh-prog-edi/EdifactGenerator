// Prüft den Verwendungszeitraum der Daten (SG6 RFF+Z49/Z53 + DTM+Z25/Z26):
//   1. Aus einer 55001 abgeleitet entstehen zwei Zeitscheiben — „Keine Daten" (Z53)
//      vom Folgetag des Nachrichtendatums bis zum Lieferbeginn, „Gültige Daten" (Z49)
//      ab dem Lieferbeginn ohne Ende (AHB-Bedingungen [126], [131], [471]).
//   2. Die Zeitpunkte kommen zeitzonenrichtig zurück: der übernommene Lieferbeginn
//      trägt in der Folgenachricht denselben UTC-Zeitstempel wie in der Quelle.
//   3. Prüf-ID 55691 führt kein DTM+Z26 — dort bleibt es bei einer offenen Zeitscheibe.
//   4. Die kuratierte Maske erzeugt aus den Feldern des zweiten Zeitraums ebenfalls
//      zwei SG6-Gruppen mit fortlaufender Zeitraum-ID.
// Der Lauf nutzt die Zeitzone Europe/Berlin — die Umrechnung deutscher Ortszeit in UTC
// ist Teil der Prüfung.
const { chromium } = require('playwright');

const ROOT = require('path').join(__dirname, '..');
const MALO = '51238696781';

const fuelle = () => {
  const füll = wurzel => {
    if (!wurzel) return;
    wurzel.querySelectorAll('input').forEach(el => {
      if (el.value || el.readOnly || el.closest('.zrblock') || el.id.indexOf('_kal') > 0) return;
      const ph = el.placeholder || '';
      el.value = /TT\.MM\.JJJJ HH:MM/.test(ph) ? '01.10.2026 00:00'
               : /TT\.MM\.JJJJ/.test(ph) ? '01.10.2026'
               : /ZZRB/.test(ph) ? '30TM' : '51238696781';
    });
    wurzel.querySelectorAll('select').forEach(el => {
      if (el.closest('.zrblock')) return;
      if (el.multiple) { if (!el.selectedOptions.length && el.options.length) el.options[0].selected = true; return; }
      if (el.value) return;
      const o = Array.from(el.options).find(x => x.value); if (o) el.value = o.value;
    });
  };
  füll(document.getElementById('kopfFelder'));
  füll(document.getElementById('posListe'));
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ timezoneId: 'Europe/Berlin' });
  const fehler = [];
  let geprueft = 0, ok = 0;

  for (const stand of ['202604', '202610']) {
    const p = await ctx.newPage();
    p.on('pageerror', e => fehler.push(`${stand}: JS-Fehler ${e.message}`));
    await p.goto(`file://${ROOT}/${stand}/Stammdaten/UTILMD/Strom/index.html`, { waitUntil: 'load' });

    const quelle = await p.evaluate(async (malo) => {
      document.getElementById('prufId').value = '55001';
      renderForm();
      document.querySelectorAll('#dynamicForm input[id^="DTM_"]').forEach(el => { if (!el.readOnly) el.value = '01.10.2026'; });
      const loc = document.getElementById('LOC_Z16'); if (loc) loc.value = malo;
      generateEdifact();
      await new Promise(r => setTimeout(r, 200));
      const n = document.getElementById('edifactOutput').value;
      return {
        beginn: (/DTM\+92:([^:]+):/.exec(n) || [])[1] || '',
        links: Array.from(document.querySelectorAll('.edi-fn-link')).map(a => ({ t: a.textContent, h: a.href })),
        anzeige: Array.from(document.querySelectorAll('.edi-fn-zeit')).map(x => x.textContent),
      };
    }, MALO);

    geprueft++;
    if (quelle.anzeige.length >= 12) ok++;
    else fehler.push(`${stand}: Verwendungszeitraum nur bei ${quelle.anzeige.length} Folgenachrichten ausgewiesen (erwartet: 12)`);

    // --- 1./2. Vollformular: zwei Zeitscheiben, zeitzonenrichtig ---
    for (const [pid, erwarteZwei] of [['55616', true], ['55691', false]]) {
      const treffer = quelle.links.find(l => l.t.startsWith(pid));
      geprueft++;
      if (!treffer) { fehler.push(`${stand}: ${pid} wird nicht angeboten`); continue; }
      const z = await ctx.newPage();
      const zFehler = [];
      z.on('pageerror', e => zFehler.push(e.message));
      await z.goto(treffer.h, { waitUntil: 'load' });
      await z.waitForTimeout(700);
      const erg = await z.evaluate(fuellFn => {
        eval('(' + fuellFn + ')()');
        erzeuge();
        const n = document.getElementById('ediOut').value;
        return {
          rff: (n.match(/RFF\+Z(?:49|53)[^']*'/g) || []),
          dtm: (n.match(/DTM\+Z2[56]:[^']*'/g) || []),
          bloecke: document.querySelectorAll('.zrblock').length,
          fehler: document.getElementById('errorBox').textContent.slice(0, 120),
        };
      }, fuelle.toString());
      await z.close();

      const zwei = erg.rff.length === 2;
      const pruefungen = erwarteZwei
        ? [
            ['zwei Verwendungszeiträume', zwei],
            ['erster Zeitraum Z53 mit ID 1', erg.rff[0] === "RFF+Z53::1'"],
            ['zweiter Zeitraum Z49 mit ID 2', erg.rff[1] === "RFF+Z49::2'"],
            ['erste Scheibe endet zum Lieferbeginn', erg.dtm.some(d => d.startsWith('DTM+Z26:') && d.includes(quelle.beginn.replace('?+', '?+')))],
            ['zweite Scheibe beginnt zum Lieferbeginn', erg.dtm.filter(d => d.startsWith('DTM+Z25:')).length === 2
              && erg.dtm.filter(d => d.startsWith('DTM+Z25:')).pop().includes(quelle.beginn)],
            ['keine JS-Fehler', zFehler.length === 0],
          ]
        : [
            // 55691 führt laut AHB keine Zeitraum-ID (DE1156) — das RFF trägt nur den Qualifier.
            ['nur ein Verwendungszeitraum', erg.rff.length === 1 && erg.rff[0] === "RFF+Z49'"],
            ['Beginn ist der Lieferbeginn', erg.dtm.some(d => d.startsWith('DTM+Z25:') && d.includes(quelle.beginn))],
            ['keine JS-Fehler', zFehler.length === 0],
          ];
      const schlecht = pruefungen.filter(x => !x[1]).map(x => x[0]);
      if (schlecht.length) fehler.push(`${stand} ${pid}: ${schlecht.join(', ')} | RFF ${JSON.stringify(erg.rff)} DTM ${JSON.stringify(erg.dtm)} ${erg.fehler}`);
      else ok++;
    }

    // --- 4. kuratierte Maske: zweiter Zeitraum über eigene Felder ---
    geprueft++;
    const kur = await p.evaluate(() => {
      document.getElementById('prufId').value = '55616';
      renderForm();
      const setz = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; return !!el; };
      const da = setz('DTM_Z25', '30.07.2026') && setz('DTM_Z26', '01.10.2026')
              && setz('RFF_VZ_QUALITAET', 'Z53') && setz('DTM_Z25_2', '01.10.2026')
              && setz('RFF_VZ_QUALITAET_2', 'Z49');
      generateEdifact();
      const n = document.getElementById('edifactOutput').value;
      return { felderDa: da, rff: (n.match(/RFF\+Z(?:49|53)[^']*'/g) || []), dtm: (n.match(/DTM\+Z2[56]:[^']*'/g) || []) };
    });
    if (kur.felderDa && kur.rff.join('|') === "RFF+Z53::1'|RFF+Z49::2'" && kur.dtm.length === 3) ok++;
    else fehler.push(`${stand} kuratierte Maske 55616: ${kur.felderDa ? '' : 'Felder fehlen; '}RFF ${JSON.stringify(kur.rff)} DTM ${JSON.stringify(kur.dtm)}`);

    await p.close();
  }

  // --- 5. Abdeckung: jede Prüf-ID, die laut AHB einen Verwendungszeitraum führt,
  // muss ihn im Vollformular wiederholen können und die Zeitraum-ID ausgeben ---
  const fs = require('fs');
  const CODES = ['Z47', 'Z48', 'Z49', 'Z53', 'Z54', 'Z55'];
  for (const stand of ['202604', '202610']) {
    for (const sparte of ['Strom', 'Gas']) {
      const metaDatei = `${ROOT}/${stand}/Stammdaten/UTILMD/${sparte}/pruef-ids/_form-meta.js`;
      const roh = fs.readFileSync(metaDatei, 'utf8');
      const meta = JSON.parse(roh.slice(roh.indexOf('{'), roh.lastIndexOf('}') + 1));
      const betroffen = Object.keys(meta).filter(pid =>
        meta[pid].instanzen.some(i => i.seg === 'RFF' &&
          ((i.des.find(y => y.de === '1153') || {}).codes || []).some(c => CODES.includes(c[0]))));
      if (!betroffen.length) continue;
      const seite = await ctx.newPage();
      const sFehler = [];
      seite.on('pageerror', e => sFehler.push(e.message));
      await seite.goto(`file://${ROOT}/${stand}/Stammdaten/UTILMD/${sparte}/vollformular.html`, { waitUntil: 'load' });
      const schlecht = [];
      for (const pid of betroffen) {
        const r = await seite.evaluate(async (id) => {
          document.getElementById('pruefi').value = id;
          onPruefi();
          for (let i = 0; i < 60; i++) {
            if (formMeta[id] && document.querySelectorAll('#posListe .segblock').length) break;
            await new Promise(r => setTimeout(r, 50));
          }
          const knopf = Array.from(document.querySelectorAll('#posListe button'))
            .find(b => /weiterer Verwendungszeitraum/.test(b.textContent));
          if (!knopf) return false;
          const vorher = document.querySelectorAll('.zrblock').length;
          AhbFormEngine.addZeitraum(1);
          return document.querySelectorAll('.zrblock').length === vorher + 1;
        }, pid);
        if (!r) schlecht.push(pid);
      }
      await seite.close();
      geprueft++;
      if (!schlecht.length && !sFehler.length) ok++;
      else fehler.push(`${stand} ${sparte}: Verwendungszeitraum nicht wiederholbar bei ${schlecht.slice(0, 6).join(', ')}`
        + (sFehler.length ? ` | JS ${sFehler[0]}` : ''));
    }
  }

  // --- 6. Datenclearing-Familie: die kuratierte Maske bietet die Qualitäten des AHB
  // an und erzeugt den Verwendungszeitraum auch in den Rückmeldungen ---
  for (const stand of ['202604', '202610']) {
    const seite = await ctx.newPage();
    await seite.goto(`file://${ROOT}/${stand}/Stammdaten/UTILMD/Strom/index.html`, { waitUntil: 'load' });
    const r = await seite.evaluate(() => {
      document.getElementById('prufId').value = '55137';   // Rückmeldung/Anfrage Daten der MaLo
      renderForm();
      const sel = document.getElementById('RFF_VZ_QUALITAET');
      const codes = sel ? Array.from(sel.options).map(o => o.value).filter(Boolean) : [];
      generateEdifact();
      const n = document.getElementById('edifactOutput').value;
      return { codes, rff: (n.match(/RFF\+Z(?:4[789]|5[3-5])[^']*'/g) || []), sts: (n.match(/STS\+E01[^']*'/g) || []) };
    });
    await seite.close();
    geprueft++;
    const erwartet = ['Z47', 'Z48', 'Z54', 'Z55'];
    // Der Bezug auf den Verwendungszeitraum steht im STS+E01 als DE9012 — viertes
    // Unterelement der Gruppe C556, nicht als eigenes Datenelement:
    //   STS+E01++A01:E_0410::1'   (MIG UTILMD Strom, Segment „Status der Antwort")
    if (erwartet.every(c => r.codes.includes(c)) && r.rff.length === 1 && /::1'$/.test(r.rff[0])
        && r.sts.some(s => /::1'$/.test(s))) ok++;
    else fehler.push(`${stand} 55137: Qualitäten ${JSON.stringify(r.codes)} RFF ${JSON.stringify(r.rff)} STS ${JSON.stringify(r.sts)}`);
  }

  await browser.close();
  console.log(`\nZEITSCHEIBEN: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
