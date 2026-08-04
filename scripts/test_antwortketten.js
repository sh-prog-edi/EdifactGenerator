// E2E: Antwortketten QUOTES->ORDERS und INVOIC->REMADV (33001/33002).
// Erzeugen -> validieren -> Antwort-Link -> Vorbelegung prüfen -> Antwort
// erzeugen -> Antwort validieren (muss fehlerfrei sein).
const { chromium } = require('playwright');
const path = require('path');

const ROOT = require('path').join(__dirname, '..');
const ebdDaten = require(path.join(ROOT, '_engine/daten/ebd-antwortcodes.js'));
function ebdCode(stand, e) {
  let x = ebdDaten[stand].ebds[e];
  if (x && x.alias) x = ebdDaten[stand].ebds[x.alias];
  const codes = x ? Object.keys(x.codes) : [];
  return codes.find(c => /^A\d\d$/.test(c)) || codes[0] || 'A01';
}
function fixeAntwortcodes(edi, stand) {
  return edi
    .replace(/(STS\+[^']*?\+)([A-Za-z0-9]*):(E_\d{4})/g, (m, pre, code, e) => pre + ebdCode(stand, e) + ':' + e)
    .replace(/AJT\+([A-Za-z0-9]+)\+(E_\d{4})/g, (m, code, e) => 'AJT+' + ebdCode(stand, e) + '+' + e);
}

async function befuelle(page) {
  await page.evaluate(() => {
    const wert = (ph, label) => {
      const p = (ph || '') + ' ' + (label || '');
      if (/MM\.JJJJ/.test(p) && !/TT/.test(p)) return '06.2026';
      if (/TT\.MM\.JJJJ HH:MM/.test(p)) return '15.06.2026 10:30';
      if (/TT\.MM\.JJJJ/.test(p)) return '15.06.2026';
      if (/DE3207/.test(p)) return 'DE';
      if (/DE9013|DE4465/.test(p)) return 'A01';
      if (/HH:MM-HH:MM/.test(ph || '')) return '08:00-17:00';
      if (/ZZRB/.test(ph || '')) return '30TM';
      if (/^ *JJJJ *$/.test(ph || '')) return '2026';
      if (/^ *MM *$/.test(ph || '')) return '06';
      if (/DE9012|DE1050|DE7110|DE1490|DE8260|DE1496|DE1082|DE7402|DE6162|DE6152|DE7036/.test(p)) return '1';
      if (/DE3225|Objekt-ID/.test(p)) return 'DE00014545768S0000000000000003054';
      if (/DE7140/.test(p)) return /OBIS/i.test(p) ? '1-1:1.9.0' : '9990001000053';
      if (/DE7111|DE7037|DE7081|DE7009/.test(p)) return 'Z01';
      if (/IBAN/i.test(p)) return 'DE89370400440532013000';
      if (/BIC/i.test(p)) return 'MARKDEF1100';
      if (/E-Mail|Mail/i.test(p)) return 'mako@beispiel.de';
      if (/Vorgangsnummer|Positionsnummer|Sendungsposition|Laufende Nummer|Anzahl/i.test(p)) return '1';
      if (/Prozent|rate\b/i.test(p)) return '19';
      if (/Betrag|Preis|Menge|satz/i.test(p)) return '100.00';
      if (/Postleitzahl|PLZ/i.test(p)) return '12345';
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
      if (el.multiple) { if (el.options.length) el.options[0].selected = true; }
      else if (!el.value) { const o = Array.from(el.options).find(x => x.value); if (o) el.value = o.value; }
    });
  });
}

(async () => {
  const browser = await chromium.launch();
  const gen = await browser.newPage();
  const val = await browser.newPage();
  const antwortSeite = await browser.newPage();
  await val.goto('file://' + path.join(ROOT, 'validator.html'));
  const fehler = [];
  antwortSeite.on('pageerror', e => fehler.push('Antwortseite-JS: ' + e.message));
  val.on('pageerror', e => fehler.push('Validator-JS: ' + e.message));
  let ok = 0, gesamt = 0;

  async function validiere(edi, label, sollGruen = true) {
    gesamt++;
    await val.evaluate(t => { document.getElementById('eingabe').value = t; }, edi);
    await val.evaluate(() => starte());
    await val.waitForSelector('#ampel .badge', { timeout: 15000 });
    const r = await val.evaluate(() => ({
      badge: document.querySelector('#ampel .badge').textContent,
      links: Array.from(document.querySelectorAll('#antwortListe a')).map(a => ({
        text: a.textContent.trim(), href: a.getAttribute('href') })),
      rot: Array.from(document.querySelectorAll('.seg.rot')).map(x => x.innerText.slice(0, 130)),
      global: document.getElementById('globalMeldungen').innerText,
    }));
    // Grün = keine Fehler. Das Warn-Badge „fehlerfrei · N bedingte Muss offen"
    // zählt als grün: bedingte Muss sind laut Validator ausdrücklich „bitte
    // fachlich prüfen"-Hinweise (nicht maschinell entscheidbare Bedingungen,
    // z. B. [492] „MP-ID aus Sparte Strom"), keine Fehler.
    const gruen = r.badge.startsWith('fehlerfrei');
    if (gruen === sollGruen) ok++;
    else {
      fehler.push(`${label}: ${sollGruen ? 'sollte grün' : 'sollte rot'} -> ${r.badge} | ${r.global.slice(0,150)}`);
      r.rot.slice(0, 6).forEach(x => fehler.push('   ROT ' + x.replace(/\n/g, ' § ')));
    }
    return r;
  }

  async function kette(quellSeite, quellPruefi, stand, linkWahl, checks, label) {
    // 1) Quellnachricht erzeugen
    await gen.goto('file://' + path.join(ROOT, quellSeite));
    await gen.selectOption('#pruefi', quellPruefi);
    await gen.evaluate(() => onPruefi());
    await gen.waitForFunction(() =>
      document.querySelectorAll('#kopfFelder input, #kopfFelder select').length > 0, null, { timeout: 15000 });
    await befuelle(gen);
    await gen.evaluate(() => erzeuge());
    let quelle = await gen.evaluate(() => document.getElementById('ediOut').value);
    quelle = fixeAntwortcodes(quelle, stand);
    if (!quelle) { gesamt++; fehler.push(`${label}: keine Quellnachricht`); return; }
    // 2) validieren -> Antwort-Link (linkWahl: Index oder RegExp auf den Linktext)
    const r = await validiere(quelle, `${label} (Quelle)`);
    if (!r.links.length) { gesamt++; fehler.push(`${label}: kein Antwort-Link im Panel`); return; }
    const link = (linkWahl instanceof RegExp)
      ? r.links.find(l => linkWahl.test(l.text))
      : (r.links[linkWahl] || r.links[0]);
    if (!link) { gesamt++; fehler.push(`${label}: Link ${linkWahl} nicht gefunden (${r.links.map(l=>l.text).join(' | ')})`); return; }
    // 3) Antwortseite mit Vorbelegung öffnen
    await antwortSeite.goto('file://' + path.join(ROOT, link.href.split('#')[0]) + '#' + link.href.split('#')[1]);
    await antwortSeite.waitForFunction(() =>
      document.querySelectorAll('#kopfFelder input, #kopfFelder select').length > 0, null, { timeout: 15000 });
    await antwortSeite.waitForTimeout(200);
    // Vorbelegungs-Checks: [wertErwartet, beschreibung]
    const werte = await antwortSeite.evaluate(() =>
      Array.from(document.querySelectorAll('#kopfFelder input, #posListe input, #kopfFelder select, #posListe select'))
        .map(el => el.value));
    for (const [erwartet, was] of checks) {
      gesamt++;
      if (werte.includes(erwartet)) ok++;
      else fehler.push(`${label}: Vorbelegung "${was}" (${erwartet}) nicht gefunden`);
    }
    // 4) Rest befüllen, Antwort erzeugen und validieren
    await befuelle(antwortSeite);
    await antwortSeite.evaluate(() => erzeuge());
    let antwort = await antwortSeite.evaluate(() => document.getElementById('ediOut').value);
    if (!antwort) {
      gesamt++;
      const err = await antwortSeite.evaluate(() => document.getElementById('errorBox').textContent);
      fehler.push(`${label}: Antwort nicht erzeugt: ${err.slice(0, 160)}`);
      return;
    }
    antwort = fixeAntwortcodes(antwort, stand);
    await validiere(antwort, `${label} (Antwort)`);
    return { quelle, antwort };
  }

  // --- QUOTES 15001 -> ORDERS 17001 (beide Stände) ---
  for (const stand of ['202604', '202610']) {
    const res = await kette(`Bestellvorgang/QUOTES/index.html?stand=${stand}`, '15001', stand, 0, [], `QUOTES->ORDERS ${stand}`);
    if (res) {
      // Referenzprüfung: ORDERS RFF+AAG == QUOTES BGM-Dokumentennummer, RFF+Z03 == LIN-Position
      const angebotsNr = /BGM\+310\+([^+']+)/.exec(res.quelle);
      gesamt++;
      if (angebotsNr && res.antwort.includes(`RFF+AAG:${angebotsNr[1]}`)) ok++;
      else fehler.push(`QUOTES->ORDERS ${stand}: RFF+AAG trägt nicht die Angebotsnummer (${angebotsNr && angebotsNr[1]})`);
      const linPos = /LIN\+([^+']+)/.exec(res.quelle);
      gesamt++;
      if (linPos && res.antwort.includes(`RFF+Z03:${linPos[1]}`)) ok++;
      else fehler.push(`QUOTES->ORDERS ${stand}: RFF+Z03 trägt nicht die Angebotsposition`);
      gesamt++;
      const unbQ = /UNB\+UNOC:3\+(\d+):[^+]+\+(\d+)/.exec(res.quelle);
      const unbA = /UNB\+UNOC:3\+(\d+):[^+]+\+(\d+)/.exec(res.antwort);
      if (unbQ && unbA && unbQ[1] === unbA[2] && unbQ[2] === unbA[1]) ok++;
      else fehler.push(`QUOTES->ORDERS ${stand}: MS/MR nicht getauscht`);
    }
  }

  // --- INVOIC 31001 -> REMADV 33001 (Bestätigung) und 33002 (Abweisung) ---
  for (const [idx, zielLabel] of [[0, 'REMADV 33001'], [1, 'REMADV 33002']]) {
    const res = await kette('Rechnungsstellung/INVOIC/index.html?stand=202604', '31001', '202604', idx, [], `INVOIC->${zielLabel}`);
    if (res) {
      const reNr = /BGM\+380\+([^+']+)/.exec(res.quelle);
      gesamt++;
      if (reNr && res.antwort.includes(`+${reNr[1]}'`)) ok++;
      else fehler.push(`INVOIC->${zielLabel}: Rechnungsnummer nicht im DOC übernommen`);
      const betrag = /MOA\+9:([\d.]+)/.exec(res.quelle);
      gesamt++;
      if (betrag && res.antwort.includes(`MOA+9:${betrag[1]}`)) ok++;
      else fehler.push(`INVOIC->${zielLabel}: fälliger Betrag nicht übernommen`);
      // SG5 RFF+ACW (Referenz auf die vorangegangene Nachricht) führt der AHB nur in
      // der Abweisung 33002 ("Soll [510]"); in der Bestätigung 33001 ist die Spalte
      // leer. Bis 28.07.2026 stand ACW irrtümlich in beiden Prüf-IDs, weil die
      // frühere Extraktion die Spalte falsch zugeordnet hatte.
      if (zielLabel === 'REMADV 33002') {
        gesamt++;
        if (res.antwort.includes(`RFF+ACW:`)) ok++;
        else fehler.push(`INVOIC->${zielLabel}: RFF+ACW fehlt`);
      } else {
        gesamt++;
        if (!res.antwort.includes(`RFF+ACW:`)) ok++;
        else fehler.push(`INVOIC->${zielLabel}: RFF+ACW steht in der Bestätigung, obwohl der AHB es dort nicht führt`);
      }
    }
  }

  // --- Generierte Mappings (Anwendungsübersicht): UTILMD Kündigung 55016 -> 55017 ---
  for (const stand of ['202604', '202610']) {
    const res = await kette(`Stammdaten/UTILMD/Strom/vollformular.html?stand=${stand}`, '55016', stand,
      /UTILMD 55017/, [], `UTILMD 55016->55017 ${stand}`);
    if (res) {
      const vg = /IDE\+24\+([^'+]+)/.exec(res.quelle);
      gesamt++;
      if (vg && res.antwort.includes(`RFF+TN:${vg[1]}`)) ok++;
      else fehler.push(`UTILMD 55016->55017 ${stand}: RFF+TN trägt nicht die Vorgangsnummer (${vg && vg[1]})`);
    }
  }
  // --- ORDERS Sperrauftrag 17115 -> ORDRSP 19116 (Heuristik-Mapping) ---
  {
    const res = await kette('Bestellvorgang/ORDERS/index.html?stand=202604', '17115', '202604',
      /ORDRSP 19116/, [], 'ORDERS 17115->ORDRSP 19116');
    if (res) {
      const nr = /BGM\+[^+']*\+([^+']+)/.exec(res.quelle);
      gesamt++;
      if (nr && res.antwort.includes(`RFF+ON:${nr[1]}`)) ok++;
      else fehler.push(`ORDERS 17115->ORDRSP 19116: RFF+ON trägt nicht die Bestellnummer (${nr && nr[1]})`);
    }
  }

  // --- Generische Servicenachrichten: CONTRL-Empfangsbestätigung + APERAK-Ablehnung ---
  async function serviceKette(quellSeite, quellPruefi, stand, linkRe, aktion, label) {
    await gen.goto('file://' + path.join(ROOT, quellSeite));
    await gen.selectOption('#pruefi', quellPruefi);
    await gen.evaluate(() => onPruefi());
    await gen.waitForFunction(() =>
      document.querySelectorAll('#kopfFelder input, #kopfFelder select').length > 0, null, { timeout: 15000 });
    await befuelle(gen);
    await gen.evaluate(() => erzeuge());
    const quelle = fixeAntwortcodes(await gen.evaluate(() => document.getElementById('ediOut').value), stand);
    const r = await validiere(quelle, `${label} (Quelle)`);
    const link = r.links.find(l => linkRe.test(l.text));
    gesamt++;
    if (!link) { fehler.push(`${label}: Service-Link fehlt (${r.links.map(l=>l.text).join(' | ')})`); return; }
    ok++;
    await antwortSeite.goto('file://' + path.join(ROOT, link.href.split('#')[0]) + '#' + link.href.split('#')[1]);
    await antwortSeite.waitForTimeout(300);
    await antwortSeite.evaluate(aktion);
    const antwort = await antwortSeite.evaluate(() => document.getElementById('ediOut').value);
    if (!antwort) {
      gesamt++;
      const err = await antwortSeite.evaluate(() => (document.getElementById('errorBox')||{}).textContent || '');
      fehler.push(`${label}: Servicenachricht nicht erzeugt: ${err.slice(0, 160)}`);
      return;
    }
    await validiere(antwort, `${label} (Antwort)`);
  }
  await serviceKette('Bestellvorgang/QUOTES/index.html?stand=202604', '15001', '202604',
    /CONTRL – Empfangsbestätigung/, () => generateContrl(), 'CONTRL-Empfangsbestätigung');
  await serviceKette('Bestellvorgang/QUOTES/index.html?stand=202604', '15001', '202604',
    /APERAK – Ablehnung/, () => {
      const s = document.getElementById('ercCode');
      if (!s.value) { const o = Array.from(s.options).find(x => x.value); if (o) s.value = o.value; }
      document.getElementById('refZ08').value = '9900000000001';
      generateAperak();
    }, 'APERAK-Ablehnung');

  console.log(`\nANTWORTKETTEN: ${ok}/${gesamt} wie erwartet`);
  fehler.slice(0, 40).forEach(f => console.log(' -', f));
  await browser.close();
  process.exit(fehler.length ? 1 : 0);
})();
