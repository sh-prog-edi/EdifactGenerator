// test_ablehnung_abgleich.js — Regression für ablehnung-abgleich.html.
//
// Deckt die zentrale Zusage der neuen Seite ab: aus einer negativen CONTRL
// (SG1 UCM, SG2 UCS/UCD) wird die betroffene Position in der links geprüften
// Original-Nachricht wiedergefunden und mit dem unabhängigen Validator-Befund
// dort abgeglichen — inklusive der Randfälle ohne Segmentbezug, ohne Treffer
// und ohne echte CONTRL rechts. Testnachricht/-defekt identisch zu
// test_validator_komponenten.js (NAD+Z63 mit leerer DE3124-Erstwiederholung),
// damit Segmentzähler und Fehlerbild bereits bekannt sind.
const { chromium } = require('playwright');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const KAPUTT =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260803:0800+844156800099++++++1'" +
  "UNH+844156800099+UTILMD:D:11A:UN:S2.1'BGM+E01+844156800099'DTM+137:202608030800?+00:303'" +
  "NAD+MS+9900000000001::293'CTA+IC+:Max Muster'COM+max?@test.de:EM'NAD+MR+9900000000002::293'" +
  "IDE+24+EDIGEN{844156800099'DTM+92:202610010000?+00:303'STS+7++E06+ZW6'" +
  "LOC+Z18+DE0011111111111111111111111111111'LOC+Z16+51238696781'LOC+Z20+DE0022222222222222222222222222222'" +
  "LOC+Z19+DE0033333333333333333333333333333'LOC+Z17+DE0071688314'" +
  "RFF+Z13:55013'RFF+TN:844156800099'" +
  "NAD+Z65+++Meier:Lieselotte'NAD+Z66+++Meier'NAD+Z67+++Anschlussnehmer Meier'" +
  "NAD+Z68+++Hausverwaltung Gera GmbH'NAD+Z69+++Meier'NAD+Z70+++Hausverwaltung Gera GmbH'" +
  "NAD+Z63++:LADEN !++Weg::3Lusan+Gera++07555+DE'" +
  "UNT+25+844156800099'UNZ+1+844156800099'";
// Segment 24 = NAD+Z63, DE3124 (Element 3, Komponente 1) — bekannter Befund.

// CONTRL zeigt exakt auf Segment 24 / DE3124 -> Validator bestätigt unabhängig.
const CONTRL_TREFFER =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+844156800099+9900000000002:500+9900000000001:500+7'" +
  "UCM+844156800099+UTILMD:D:11A:UN+4+13'UCS+24+13'UCD+13+3:1'" +
  "UNT+5+1'UNZ+1+1'";

// CONTRL zeigt auf ein unbeanstandetes Segment (5 = CTA) -> "nicht nachvollziehbar".
const CONTRL_UNBEGRUENDET =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+844156800099+9900000000002:500+9900000000001:500+7'" +
  "UCM+844156800099+UTILMD:D:11A:UN+4+13'UCS+5+13'" +
  "UNT+4+1'UNZ+1+1'";

// Falsche UNH-Referenz -> keine der links geprüften Nachrichten passt.
const CONTRL_FALSCHE_REF =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+999+9900000000002:500+9900000000001:500+7'" +
  "UCM+999999999999+UTILMD:D:11A:UN+4+13'UCS+24+13'UCD+13+3:1'" +
  "UNT+5+1'UNZ+1+1'";

// Ablehnung auf Dateiebene, kein UCM -> kein Segmentbezug möglich.
const CONTRL_DATEI_ABGELEHNT =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+999+9900000000002:500+9900000000001:500+4+21'" +
  "UNT+2+1'UNZ+1+1'";

// Empfangsbestätigung ohne Einwände.
const CONTRL_OK =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+999+9900000000002:500+9900000000001:500+7'" +
  "UNT+2+1'UNZ+1+1'";

let fails = 0;
const ok = (b, t) => { console.log((b ? '  OK  ' : ' FAIL ') + t); if (!b) fails++; };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file://' + path.join(ROOT, 'ablehnung-abgleich.html'));

  await page.fill('#eingabeLinks', KAPUTT);
  await page.click('text=Nachricht prüfen');
  await page.waitForTimeout(600);

  // ---- Linke Seite: Segmentliste korrekt nummeriert, Defekt erkannt --------
  const links = await page.evaluate(() => {
    const el = document.getElementById('lseg-0-24');
    return {
      vorhanden: !!el,
      rot: el ? el.classList.contains('rot') : false,
      meldung: el ? el.textContent : '',
    };
  });
  ok(links.vorhanden, 'Linke Segmentliste: NAD+Z63 unter id=lseg-0-24 auffindbar');
  ok(links.rot, 'Linke Segmentliste: NAD+Z63 (Segment 24) als fehlerhaft markiert');
  ok(/DE3124/.test(links.meldung), 'Linke Segmentliste: Meldung nennt DE3124');

  // ---- Fall A: CONTRL-Zeiger trifft exakt den bekannten Befund -------------
  await page.fill('#eingabeRechts', CONTRL_TREFFER);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  let karte = await page.evaluate(() => document.querySelector('.ergebniskarte').outerHTML);
  ok(/bestaetigt/.test(karte) && /bestätigt/.test(karte), 'Fall A (Treffer DE3124): Badge „bestätigt“');
  ok(/Segment 24/.test(karte) && /Element 3, Komp\. 1/.test(karte) && /DE3124/.test(karte),
    'Fall A: Segment- und Element-Angabe korrekt (Segment 24, Element 3.1 -> DE3124)');
  ok(/NAD\+Z63/.test(karte), 'Fall A: Zielsegmenttext (NAD+Z63…) angezeigt');

  // Sprung/Hervorhebung
  await page.click('text=im Segmentbaum zeigen');
  await page.waitForTimeout(150);
  const hervorgehoben = await page.evaluate(() =>
    (document.getElementById('lseg-0-24') || {}).classList?.contains('hervorgehoben'));
  ok(hervorgehoben === true, 'Klick „im Segmentbaum zeigen“ hebt Segment 24 hervor');

  // ---- Fall B: CONTRL-Zeiger auf unbeanstandetes Segment --------------------
  await page.fill('#eingabeRechts', CONTRL_UNBEGRUENDET);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  karte = await page.evaluate(() => document.querySelector('.ergebniskarte').outerHTML);
  ok(/badge frag/.test(karte) && /nicht nachvollziehbar/.test(karte),
    'Fall B (Segment 5, unbeanstandet): „nicht nachvollziehbar“, Badge „unklar“');

  // ---- Fall C: Referenz passt zu keiner links geprüften Nachricht ----------
  await page.fill('#eingabeRechts', CONTRL_FALSCHE_REF);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  let txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/nicht zugeordnet/.test(txt), 'Fall C (falsche UNH-Referenz): „nicht zugeordnet“');

  // ---- Fall D: Ablehnung auf Dateiebene, kein UCM ---------------------------
  await page.fill('#eingabeRechts', CONTRL_DATEI_ABGELEHNT);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/kein Segmentbezug/.test(txt), 'Fall D (Dateiebene abgelehnt, kein UCM): kein Segmentbezug');

  // ---- Fall E: CONTRL bestätigt ohne Einwände -------------------------------
  await page.fill('#eingabeRechts', CONTRL_OK);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/Empfang bestätigt/.test(txt), 'Fall E (CONTRL ohne Einwände): „Empfang bestätigt“');

  // ---- Fall F: rechts ist gar keine CONTRL ----------------------------------
  await page.fill('#eingabeRechts', KAPUTT);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('rechtsErgebnis').innerText);
  ok(/nicht als CONTRL erkannt/.test(txt), 'Fall F (kein CONTRL rechts): Fehlermeldung statt Absturz');

  // ---- Leeren-Buttons blenden Abgleich-Panel wieder aus ---------------------
  await page.fill('#eingabeRechts', CONTRL_TREFFER);
  await page.click('text=CONTRL auswerten');
  await page.waitForTimeout(400);
  await page.click('.panel:has(#eingabeLinks) button.secondary');
  await page.waitForTimeout(150);
  ok((await page.evaluate(() => document.getElementById('panelAbgleich').style.display)) === 'none',
    '„Leeren“ links blendet Abgleich-Panel wieder aus');

  // ---- Datei-Import (FileReader-Pfad) ---------------------------------------
  const fs = require('fs');
  const tmp = path.join(require('os').tmpdir(), 'ablehnung_abgleich_test.txt');
  fs.writeFileSync(tmp, KAPUTT);
  await page.setInputFiles('#dateiLinks', tmp);
  await page.waitForTimeout(500);
  ok((await page.evaluate(() => document.getElementById('eingabeLinks').value)).startsWith("UNA:"),
    'Datei-Import (links) befüllt Textarea');
  ok((await page.evaluate(() => document.getElementById('linksErgebnis').innerHTML.length)) > 100,
    'Datei-Import (links) löst automatische Prüfung aus');
  fs.unlinkSync(tmp);

  ok(errors.length === 0, 'Keine Konsolen-/Seitenfehler: ' + JSON.stringify(errors));

  await browser.close();
  console.log(`\n${fails === 0 ? 'ALLE TESTS OK' : fails + ' FEHLER'}`);
  process.exit(fails ? 1 : 0);
})();
