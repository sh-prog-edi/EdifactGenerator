// End-to-End-Test der Folgenachrichten: aus einer im Generator erzeugten Anmeldung
// 55001 werden die Nachrichten des Use-Cases „Lieferbeginn" angeboten; die Bestätigung
// 55002 wird geöffnet und geprüft, ob die Übernahme stimmt:
//   - Absender und Empfänger sind getauscht,
//   - die Marktlokation ist übernommen,
//   - die Vorgangsnummer der Anmeldung steht als Referenz RFF+TN,
//   - die Bestätigung trägt eine eigene, andere Vorgangsnummer,
//   - Dokumentennummer und Erstellungsdatum sind NICHT übernommen.
const { chromium } = require('playwright');

const ROOT = require('path').join(__dirname, '..');
const MALO = '51238696781';

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, ok = 0;

  for (const stand of ['202604', '202610']) {
    const page = await browser.newPage();
    page.on('pageerror', e => fehler.push(`${stand}: JS-Fehler ${e.message}`));
    await page.goto(`file://${ROOT}/Stammdaten/UTILMD/Strom/index.html?stand=${stand}`, { waitUntil: 'load' });

    const quelle = await page.evaluate(async ([malo]) => {
      document.getElementById('prufId').value = '55001';
      renderForm();
      document.querySelectorAll('#dynamicForm input[id^="DTM_"]').forEach(el => { if (!el.readOnly) el.value = '01.10.2026'; });
      const loc = document.getElementById('LOC_Z16'); if (loc) loc.value = malo;
      generateEdifact();
      await new Promise(r => setTimeout(r, 80));
      const bereich = document.getElementById('folgeNachrichten');
      const links = Array.from(bereich ? bereich.querySelectorAll('.edi-fn-link') : [])
        .map(a => ({ text: a.textContent, href: a.getAttribute('href') }));
      const nachricht = document.getElementById('edifactOutput').value;
      const ide = (/IDE\+24\+([^']+)'/.exec(nachricht) || [])[1] || '';
      const bgm = (/BGM\+[^+]+\+([^'+]+)/.exec(nachricht) || [])[1] || '';
      return { links, ide, bgm, nachricht };
    }, [MALO]);

    geprueft++;
    if (quelle.links.length >= 8) ok++;
    else fehler.push(`${stand}: nur ${quelle.links.length} Folgenachrichten angeboten (erwartet: mindestens 8)`);

    // Die Stammdatenänderungen des Netzbetreibers an den Lieferanten gehören laut
    // GPKE zum Lieferbeginn und müssen mit angeboten werden.
    const STAMMDATEN = ['55615', '55616', '55617', '55618', '55619', '55620', '55691', '55175', '55225'];
    for (const pid of STAMMDATEN) {
      geprueft++;
      if (quelle.links.some(l => l.text.startsWith(pid))) ok++;
      else fehler.push(`${stand}: Stammdatenänderung ${pid} wird nicht angeboten`);
    }

    // Rollenzuordnung: Nachrichten an den alten Lieferanten kennen dessen MP-ID
    // nicht — der Empfänger muss leer bleiben und als offen gekennzeichnet sein.
    const rollen = await page.evaluate(([n]) => {
      const e = EdiFolgenachrichten.baueEintraege(
        EdiStand.aktiv(), '55001', n);
      return e.eintraege.map(x => ({
        pid: x.pid, an: x.anRolle, von: x.vonRolle,
        abs: x.absender, emp: x.empfaenger, offen: x.offen,
      }));
    }, [quelle.nachricht]);
    const rolleFuer = p => rollen.find(r => r.pid === p) || {};
    const rollenPruefungen = [
      ['55002 an LFN mit bekannter MP-ID', rolleFuer('55002').emp === '9900000000001' && rolleFuer('55002').abs === '9900000000002'],
      ['55010 an LFA ohne MP-ID', rolleFuer('55010').an === 'LFA' && rolleFuer('55010').emp === '' && (rolleFuer('55010').offen || []).indexOf('empfaenger') >= 0],
      ['55011 vom LFA ohne Absender', rolleFuer('55011').abs === '' && rolleFuer('55011').emp === '9900000000002'],
      ['55038 an LFZ ohne MP-ID', rolleFuer('55038').emp === ''],
      ['55616 an LF = LFN aufgelöst', rolleFuer('55616').emp === '9900000000001'],
      ['55616 vom NB als Absender', rolleFuer('55616').abs === '9900000000002'],
    ];
    for (const [name, gut] of rollenPruefungen) {
      geprueft++;
      if (gut) ok++; else fehler.push(`${stand}: Rollenzuordnung – ${name}`);
    }

    for (const pid of ['55002', '55003', '55616']) {
      const treffer = quelle.links.find(l => l.text.startsWith(pid));
      geprueft++;
      if (!treffer) { fehler.push(`${stand}: ${pid} wird nicht angeboten`); continue; }

      const zielSeite = new URL(treffer.href, `file://${ROOT}/Stammdaten/UTILMD/Strom/`).href;
      const zp = await browser.newPage();
      const zFehler = [];
      zp.on('pageerror', e => zFehler.push(e.message));
      await zp.goto(zielSeite, { waitUntil: 'load' });
      await zp.waitForTimeout(400);

      const ergebnis = await zp.evaluate(async () => {
        // Vorbelegte Werte festhalten, bevor die restlichen Pflichtfelder gefüllt werden
        const vorbelegt = {};
        document.querySelectorAll('#kopfFelder input, #posListe input').forEach(el => {
          if (el.value) vorbelegt[el.id] = el.value;
        });
        // Angaben, die aus der Quellnachricht nicht ableitbar sind, übernimmt sonst der
        // Anwender — für den Testlauf werden sie generisch gefüllt.
        document.querySelectorAll('#kopfFelder input, #posListe input').forEach(el => {
          if (el.value || el.readOnly) return;
          const ph = el.placeholder || '';
          el.value = /TT\.MM\.JJJJ HH:MM/.test(ph) ? '01.10.2026 00:00'
                   : /TT\.MM\.JJJJ/.test(ph) ? '01.10.2026'
                   : /ZZRB/.test(ph) ? '30TM' : '51238696781';
        });
        document.querySelectorAll('#kopfFelder select, #posListe select').forEach(el => {
          if (el.value || el.multiple) return;
          const opt = Array.from(el.options).find(o => o.value);
          if (opt) el.value = opt.value;
        });
        document.querySelectorAll('#kopfFelder select[multiple], #posListe select[multiple]').forEach(el => {
          if (Array.from(el.selectedOptions).length) return;
          if (el.options.length) el.options[0].selected = true;
        });
        if (typeof erzeuge === 'function') erzeuge();
        else {
          const btn = Array.from(document.querySelectorAll('button')).find(b => /erzeug/i.test(b.textContent));
          if (btn) btn.click();
        }
        await new Promise(r => setTimeout(r, 120));
        return {
          absender: (document.getElementById('absender') || {}).value || '',
          empfaenger: (document.getElementById('empfaenger') || {}).value || '',
          nachricht: (document.getElementById('ediOut') || {}).value || '',
          vorbelegt,
        };
      });

      const n = ergebnis.nachricht;
      const zielIde = (/IDE\+24\+([^']+)'/.exec(n) || [])[1] || '';
      // Die Ablehnung 55003 führt laut AHB kein LOC-Segment — sie verweist über
      // RFF+TN auf den Vorgang. Die Marktlokation wird dort also zu Recht nicht erwartet.
      const erwarteLoc = ergebnis.nachricht.includes('LOC+Z16') || pid !== '55003';
      // Die Stammdatenänderung 55616 führt laut AHB kein RFF+TN — sie ist keine
      // Antwort auf einen Vorgang, sondern eine eigenständige Mitteilung.
      const erwarteRff = pid !== '55616';
      const pruefungen = [
        ['Absender/Empfänger gemäß Rolle', ergebnis.absender === '9900000000002' && ergebnis.empfaenger === '9900000000001'],
        ['Marktlokation übernommen', !erwarteLoc || n.includes(`LOC+Z16+${MALO}`)],
        ['Vorgangsnummer als RFF+TN übernommen', erwarteRff ? n.includes(`RFF+TN:${quelle.ide}`) : !n.includes('RFF+TN')],
        ['eigene neue Vorgangsnummer', !!zielIde && zielIde !== quelle.ide],
        ['Dokumentennummer nicht übernommen', !n.includes(`+${quelle.bgm}'`) || quelle.bgm === ''],
        ['keine JS-Fehler auf der Zielseite', zFehler.length === 0],
      ];
      const schlecht = pruefungen.filter(p => !p[1]).map(p => p[0]);
      if (schlecht.length) fehler.push(`${stand} ${pid}: ${schlecht.join(', ')}`);
      else ok++;

      // Bestätigungs-Anker (GPKE „Nachbedingung im Erfolgsfall"): Aus der soeben
      // erzeugten Bestätigung 55002 müssen die nachgelagerten Use-Cases angeboten
      // werden — Abrechnungsdaten (55218/55126) und die Stammdatenänderungen des NB.
      if (pid === '55002' && n) {
        const anker = await zp.evaluate(([nachricht]) => {
          const stand2 = EdiFolgenachrichten.standAusPfad();
          const e = EdiFolgenachrichten.baueEintraege(stand2, '55002', nachricht);
          const pk = window.prozessketten[stand2];
          return {
            eintraege: e ? e.eintraege.map(x => ({
              pid: x.pid, abs: x.absender, emp: x.empfaenger,
              uebernommen: x.uebernommen,
              zeiten: (x.zeitscheiben || []).map(z => z.code),
            })) : [],
            ablehnungOhneKette: !EdiFolgenachrichten.schritteFuer(stand2, '55003'),
          };
        }, [n]);
        const ankerFuer = p => anker.eintraege.find(x => x.pid === p);
        for (const zielPid of ['55218', '55126', '55175', '55615', '55616', '55617', '55618', '55620']) {
          geprueft++;
          if (ankerFuer(zielPid)) ok++;
          else fehler.push(`${stand}: 55002 bietet ${zielPid} nicht an`);
        }
        const abr = ankerFuer('55218') || {};
        const ankerPruefungen = [
          ['55218 vom NB an den LFN', abr.abs === '9900000000002' && abr.emp === '9900000000001'],
          ['55218 übernimmt Felder der Bestätigung', (abr.uebernommen || 0) >= 1],
          ['55218 mit Verwendungszeitraum ab Lieferbeginn', (abr.zeiten || []).indexOf('Z49') >= 0],
          ['Ablehnung 55003 löst keine Folge-Use-Cases aus', anker.ablehnungOhneKette],
        ];
        for (const [name, gut] of ankerPruefungen) {
          geprueft++;
          if (gut) ok++; else fehler.push(`${stand}: Bestätigungs-Anker – ${name}`);
        }
      }
      await zp.close();
    }

    // Kündigungsbrücke (GPKE Teil 2, UC „Kündigung", Weitere Anforderungen): Aus der
    // Bestätigung der Kündigung 55017 muss die Anmeldung 55001/55077 angeboten werden —
    // mit dem LFN (Empfänger der 55017) als Absender und dem NB als offenem Empfänger.
    const kuendigung = await page.evaluate(async () => {
      document.getElementById('prufId').value = '55017';
      renderForm();
      document.querySelectorAll('#dynamicForm input[id^="DTM_"]').forEach(el => { if (!el.readOnly) el.value = '15.09.2026'; });
      generateEdifact();
      await new Promise(r => setTimeout(r, 80));
      const n = document.getElementById('edifactOutput').value;
      const stand2 = EdiFolgenachrichten.standAusPfad();
      const e = EdiFolgenachrichten.baueEintraege(stand2, '55017', n);
      const pk = window.prozessketten[stand2];
      const ohne = p => !((pk[p] || {}).schritte || []).some(s => s.pid === '55001');
      return {
        nachricht: n,
        eintraege: e ? e.eintraege.map(x => ({
          pid: x.pid, abs: x.absender, emp: x.empfaenger, offen: x.offen,
          uebernommen: x.uebernommen, herkunft: x.herkunft,
        })) : [],
        kuendigungOhneBruecke: ohne('55016'),
        ablehnungOhneBruecke: ohne('55018'),
        gasBruecke: ((pk['44017'] || {}).schritte || []).some(s => s.pid === '44001'),
      };
    });
    const brueckeFuer = p => kuendigung.eintraege.find(x => x.pid === p) || {};
    const b55001 = brueckeFuer('55001');
    const brueckenPruefungen = [
      ['55001 wird aus der 55017 angeboten', !!b55001.pid],
      ['55077 wird aus der 55017 angeboten', !!brueckeFuer('55077').pid],
      ['55001 mit GPKE-Beleg', /GPKE/.test(b55001.herkunft || '')],
      ['55001: LFN (Empfänger der 55017) wird Absender', b55001.abs === '9900000000002'],
      ['55001: Netzbetreiber unbekannt, Empfänger offen', b55001.emp === '' && (b55001.offen || []).indexOf('empfaenger') >= 0],
      ['55001 übernimmt das Vertragsende (DTM+93)', (b55001.uebernommen || 0) >= 1 && kuendigung.nachricht.includes('DTM+93')],
      ['keine Brücke aus der Kündigung selbst (55016)', kuendigung.kuendigungOhneBruecke],
      ['keine Brücke aus der Ablehnung (55018)', kuendigung.ablehnungOhneBruecke],
      ['Gas: 44017 bietet die Anmeldung 44001 an', kuendigung.gasBruecke],
    ];
    for (const [name, gut] of brueckenPruefungen) {
      geprueft++;
      if (gut) ok++; else fehler.push(`${stand}: Kündigungsbrücke – ${name}`);
    }
    await page.close();
  }

  await browser.close();
  console.log(`\nFOLGENACHRICHTEN: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
