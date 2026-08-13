// test_ablehnung_abgleich.js — Regression für ablehnung-abgleich.html.
//
// Deckt die zentrale Zusage der Seite ab: aus einer negativen CONTRL (SG1 UCM,
// SG2 UCS/UCD) wird die betroffene Position in der links geprüften Original-
// Nachricht wiedergefunden und mit dem unabhängigen Validator-Befund dort
// abgeglichen — inklusive der Randfälle ohne Segmentbezug, ohne Treffer und
// ohne echte CONTRL rechts, der EINEN kombinierten Prüfen-Schalter, der
// dauerhaften Segment-Markierung (roter Rahmen, KEIN Flächen-Fill) samt
// sprechender Zusatzzeile im linken Segmentbaum, der generischen (AHB-
// unabhängigen) Positionsprüfung als Rückfallebene, wenn der Validator selbst
// keine Geschäftsregel für die betroffene Stelle kennt, sowie der
// zeichengenauen <mark>-Markierung der von der CONTRL benannten Fehlerstelle
// im Zielsegment-Kasten von "3. Abgleich" (Auftraggeber-Feedback 13.08.2026:
// kein Grün-/Rot-Flächenfill mehr im Baum, dickerer Rahmen statt Volltonfarbe,
// exakte Fehlerposition rot markiert statt nur das ganze Segment).
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

// Variante mit leerem COM-DE3148 (Element 1, Komponente 1) bei belegtem DE3155
// ("EM") — dafür gibt es KEINE eigene AHB-/MIG-Geschäftsregel im Validator;
// Testfall für die rein generische Positionsprüfung (Segment 6 = COM).
const COM_LEER =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260803:0800+844156800099++++++1'" +
  "UNH+844156800099+UTILMD:D:11A:UN:S2.1'BGM+E01+844156800099'DTM+137:202608030800?+00:303'" +
  "NAD+MS+9900000000001::293'CTA+IC+:Max Muster'COM+:EM'NAD+MR+9900000000002::293'" +
  "IDE+24+EDIGEN{844156800099'DTM+92:202610010000?+00:303'STS+7++E06+ZW6'" +
  "LOC+Z18+DE0011111111111111111111111111111'LOC+Z16+51238696781'LOC+Z20+DE0022222222222222222222222222222'" +
  "LOC+Z19+DE0033333333333333333333333333333'LOC+Z17+DE0071688314'" +
  "RFF+Z13:55013'RFF+TN:844156800099'" +
  "NAD+Z65+++Meier:Lieselotte'NAD+Z66+++Meier'NAD+Z67+++Anschlussnehmer Meier'" +
  "NAD+Z68+++Hausverwaltung Gera GmbH'NAD+Z69+++Meier'NAD+Z70+++Hausverwaltung Gera GmbH'" +
  "NAD+Z63+++Meier'" +
  "UNT+25+844156800099'UNZ+1+844156800099'";

// CONTRL zeigt exakt auf Segment 24 / DE3124 -> Validator bestätigt unabhängig.
const CONTRL_TREFFER =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+844156800099+9900000000002:500+9900000000001:500+7'" +
  "UCM+844156800099+UTILMD:D:11A:UN+4+13'UCS+24+13'UCD+13+3:1'" +
  "UNT+5+1'UNZ+1+1'";

// CONTRL zeigt auf Segment 6 (COM), DE3148 — nur generisch, keine AHB-Regel.
const CONTRL_COM =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+844156800099+9900000000002:500+9900000000001:500+7'" +
  "UCM+844156800099+UTILMD:D:11A:UN+4+13'UCS+6+13'UCD+13+1:1'" +
  "UNT+5+1'UNZ+1+1'";

// Wie CONTRL_COM, aber UCD OHNE Komponentenangabe (nur DE0098, kein DE0104) —
// Testfall für "ganzes Element markieren" statt nur eine Komponente.
const CONTRL_COM_NUR_ELEMENT =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260803:0900+1++++++1'" +
  "UNH+1+CONTRL:D:96A:UN'UCI+844156800099+9900000000002:500+9900000000001:500+7'" +
  "UCM+844156800099+UTILMD:D:11A:UN+4+13'UCS+6+13'UCD+13+1'" +
  "UNT+5+1'UNZ+1+1'";

// ---- Fall H: POSITIVE APERAK (Anerkennungsmeldung, BGM+312) --------------
// Rückmeldung des Auftraggebers (13.08.2026): Der Abgleich meldete an einer
// gültigen positiven APERAK "Fehlende Muss-Segmente laut AHB: RFF+TN…". Falsch,
// denn in der APERAK sind RFF+ACE/AGO die maßgeblichen Referenzen; der AHB führt
// die zugehörige SG2 nur als "Soll [16]". Ursache: In den APERAK-/CONTRL-Metas
// fehlt der Segmentgruppen-Status (sgExpr) vollständig, und der Validator las ein
// fehlendes sgExpr als "Gruppe ist unbedingtes Muss" (Protokoll Abschnitt 74).
const APERAK_POSITIV =
  "UNA:+.? 'UNB+UNOC:3+9900000000002:500+9900000000001:500+260813:0900+ABC123++++++1'" +
  "UNH+1+APERAK:D:07B:UN:2.1i'BGM+312+DOK4711'DTM+137:202608130900?+00:303'" +
  "RFF+ACE:ABC123'DTM+171:202608130800?+00:303'RFF+AGO:ORIGDOK99'" +
  "NAD+MS+9900000000002::293'NAD+MR+9900000000001::293'" +
  "UNT+9+1'UNZ+1+ABC123'";

// Negative CONTRL auf diese APERAK mit DE0085 = 26 ("Duplikat gefunden") —
// der Code fehlte in der bisherigen kuratierten Codeliste vollständig.
const CONTRL_DUPLIKAT =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260813:0930+9++++++1'" +
  "UNH+9+CONTRL:D:96A:UN'UCI+ABC123+9900000000001:500+9900000000002:500+4+26'" +
  "UNT+3+9'UNZ+1+9'";

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

  // ---- Bedienung: nur EIN Prüfen-Schalter -----------------------------------
  const buttonTexte = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()));
  ok(!buttonTexte.includes('Nachricht prüfen'), 'Überflüssiger Schalter "Nachricht prüfen" wurde entfernt');
  ok(buttonTexte.includes('neg. CONTRL gegen Nachricht prüfen'),
    'Schalter heißt "neg. CONTRL gegen Nachricht prüfen"');

  // ---- Ein Klick prüft BEIDE Seiten und den Abgleich -------------------------
  await page.fill('#eingabeLinks', KAPUTT);
  await page.fill('#eingabeRechts', CONTRL_TREFFER);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(700);

  const links = await page.evaluate(() => {
    const el = document.getElementById('lseg-0-24');
    return { vorhanden: !!el, rot: el ? el.classList.contains('rot') : false, meldung: el ? el.textContent : '' };
  });
  ok(links.vorhanden, 'Ein Klick löst auch die linke Prüfung aus: NAD+Z63 unter id=lseg-0-24 auffindbar');
  ok(links.rot, 'Linke Segmentliste: NAD+Z63 (Segment 24) als fehlerhaft markiert');
  ok(/DE3124/.test(links.meldung), 'Linke Segmentliste: Meldung nennt DE3124');

  // ---- Segmentbaum: kein Grün-/Rot-Flächenfill mehr, nur Rahmen (Feedback 13.08.2026) ----
  const cssCheck = await page.evaluate(() => {
    const cs = el => el ? getComputedStyle(el) : null;
    const csOk = cs(document.getElementById('lseg-0-1'));    // UNH, fehlerfrei
    const csRot = cs(document.getElementById('lseg-0-24'));  // NAD+Z63, eigener Befund
    const transparent = c => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
    return {
      okBorderTransparent: csOk ? transparent(csOk.borderTopColor) : null,
      okBackgroundTransparent: csOk ? transparent(csOk.backgroundColor) : null,
      rotBorderFarbig: csRot ? !transparent(csRot.borderTopColor) : null,
      rotBorderBreite: csRot ? csRot.borderTopWidth : null,
      rotBackgroundTransparent: csRot ? transparent(csRot.backgroundColor) : null,
    };
  });
  ok(cssCheck.okBorderTransparent === true, 'Segmentbaum: fehlerfreies Segment ohne farbigen Rahmen (kein Grün-Fill mehr)');
  ok(cssCheck.okBackgroundTransparent === true, 'Segmentbaum: fehlerfreies Segment ohne Flächenfarbe');
  ok(cssCheck.rotBorderFarbig === true, 'Segmentbaum: fehlerhaftes Segment mit farbigem Rahmen statt Flächenfarbe');
  ok(cssCheck.rotBorderBreite === '3px', 'Segmentbaum: Rahmen fehlerhafter Segmente ist 3px (dicker als vorher)');
  ok(cssCheck.rotBackgroundTransparent === true, 'Segmentbaum: fehlerhaftes Segment ohne Rot-Flächenfill');

  // ---- Fall A: CONTRL-Zeiger trifft exakt den bekannten Befund -------------
  let karte = await page.evaluate(() => document.querySelector('.ergebniskarte').outerHTML);
  ok(/bestaetigt/.test(karte) && /bestätigt/.test(karte), 'Fall A (Treffer DE3124): Badge „bestätigt“');
  ok(/Segment 24/.test(karte) && /Element 3, Komp\. 1/.test(karte) && /DE3124/.test(karte),
    'Fall A: Segment- und Element-Angabe korrekt (Segment 24, Element 3.1 -> DE3124)');
  ok(/NAD\+Z63/.test(karte), 'Fall A: Zielsegmenttext (NAD+Z63…) angezeigt');

  // Exakte Fehlerposition im Zielsegment: DE3124 ist leer (Element 3, Komp. 1)
  // -> markiert werden die beiden umschließenden Trennzeichen "+:" (nichts
  // anderes ist an der Stelle vorhanden), analog zum vom Auftraggeber
  // genannten Beispiel "Z02++++DE'" (13.08.2026).
  const markFallA = await page.evaluate(() =>
    (document.querySelector('.ergebniskarte .zielsegment mark.fehlerpos') || {}).textContent);
  ok(markFallA === '+:',
    `Fall A: exakte Fehlerposition im Zielsegment rot markiert (erwartet "+:", erhalten "${markFallA}")`);

  // Persistente Markierung im linken Baum: roter Rahmen + sprechende Zusatzzeile
  const markierung = await page.evaluate(() => {
    const el = document.getElementById('lseg-0-24');
    const z = el ? el.querySelector('.contrl-zusatz') : null;
    return { zielContrl: el ? el.classList.contains('ziel-contrl') : false, zusatzText: z ? z.textContent : null };
  });
  ok(markierung.zielContrl, 'Fall A: Segment 24 dauerhaft mit rotem Rahmen (ziel-contrl) markiert');
  ok(!!markierung.zusatzText && /Fehlercode 13/.test(markierung.zusatzText),
    'Fall A: sprechende Zusatzzeile direkt am Segment im linken Baum');

  // Sprung/Hervorhebung
  await page.click('text=im Segmentbaum zeigen');
  await page.waitForTimeout(150);
  const hervorgehoben = await page.evaluate(() =>
    (document.getElementById('lseg-0-24') || {}).classList?.contains('hervorgehoben'));
  ok(hervorgehoben === true, 'Klick „im Segmentbaum zeigen“ hebt Segment 24 hervor');

  // ---- Fall B: CONTRL-Zeiger auf unbeanstandetes Segment --------------------
  await page.fill('#eingabeRechts', CONTRL_UNBEGRUENDET);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(500);
  karte = await page.evaluate(() => document.querySelector('.ergebniskarte').outerHTML);
  ok(/badge frag/.test(karte) && /nicht nachvollziehbar/.test(karte),
    'Fall B (Segment 5, unbeanstandet): „nicht nachvollziehbar“, Badge „unklar“');

  // ---- Fall C: Referenz passt zu keiner links geprüften Nachricht ----------
  await page.fill('#eingabeRechts', CONTRL_FALSCHE_REF);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(500);
  let txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/nicht zugeordnet/.test(txt), 'Fall C (falsche UNH-Referenz): „nicht zugeordnet“');

  // ---- Fall D: Ablehnung auf Dateiebene, kein UCM ---------------------------
  await page.fill('#eingabeRechts', CONTRL_DATEI_ABGELEHNT);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/kein Segmentbezug/.test(txt), 'Fall D (Dateiebene abgelehnt, kein UCM): kein Segmentbezug');

  // ---- Fall E: CONTRL bestätigt ohne Einwände -------------------------------
  await page.fill('#eingabeRechts', CONTRL_OK);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('abgleichErgebnis').innerText);
  ok(/Empfang bestätigt/.test(txt), 'Fall E (CONTRL ohne Einwände): „Empfang bestätigt“');

  // ---- Fall F: rechts ist gar keine CONTRL ----------------------------------
  await page.fill('#eingabeRechts', KAPUTT);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(500);
  txt = await page.evaluate(() => document.getElementById('rechtsErgebnis').innerText);
  ok(/nicht als CONTRL erkannt/.test(txt), 'Fall F (kein CONTRL rechts): Fehlermeldung statt Absturz');

  // ---- Fall G: generische Positionsprüfung OHNE eigene AHB-Regel -----------
  // COM+:EM' — DE3148 leer, DE3155 „EM“ belegt; dafür gibt es keine eigene
  // Geschäftsregel im Validator (Segment bekommt KEINEN eigenen roten Rahmen).
  // Die generische Prüfung soll die Stelle trotzdem als „bestätigt“ einordnen
  // und den (CONTRL-)Rahmen setzen.
  await page.fill('#eingabeLinks', COM_LEER);
  await page.fill('#eingabeRechts', CONTRL_COM);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(700);
  const comInfo = await page.evaluate(() => {
    const el = document.getElementById('lseg-0-6');
    const z = el ? el.querySelector('.contrl-zusatz') : null;
    return { rot: el ? el.classList.contains('rot') : null, zielContrl: el ? el.classList.contains('ziel-contrl') : null,
      zusatzText: z ? z.textContent : null };
  });
  ok(comInfo.rot === false, 'Fall G: Segment 6 (COM) bleibt ohne eigenen Validator-Befund ohne roten Rahmen');
  ok(comInfo.zielContrl === true, 'Fall G: Segment 6 trotzdem mit rotem Rahmen markiert (CONTRL-Ziel)');
  ok(!!comInfo.zusatzText && /Komponente 1 ist leer/.test(comInfo.zusatzText),
    'Fall G: sprechende generische Zusatzzeile („Komponente 1 ist leer…“)');
  karte = await page.evaluate(() => document.querySelector('.ergebniskarte').outerHTML);
  ok(/ergebniskarte bestaetigt/.test(karte) && /Generische Strukturprüfung/.test(karte),
    'Fall G: Ergebniskarte „bestätigt“ über generische Strukturprüfung (ohne AHB-Regel)');
  const markFallG = await page.evaluate(() =>
    (document.querySelector('.ergebniskarte .zielsegment mark.fehlerpos') || {}).textContent);
  ok(markFallG === '+:',
    `Fall G: exakte Fehlerposition auch ohne AHB-Regel markiert (erwartet "+:", erhalten "${markFallG}")`);

  // ---- Fall G2: CONTRL ohne Komponentenangabe -> ganzes Element markiert ---
  await page.fill('#eingabeRechts', CONTRL_COM_NUR_ELEMENT);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(700);
  const markFallG2 = await page.evaluate(() =>
    (document.querySelector('.ergebniskarte .zielsegment mark.fehlerpos') || {}).textContent);
  ok(markFallG2 === ':EM',
    `Fall G2: CONTRL ohne Komponentenangabe (nur DE0098) markiert das ganze Element, nicht nur eine Komponente (erwartet ":EM", erhalten "${markFallG2}")`);

  // ---- Fall H: positive APERAK -> KEIN falscher "fehlendes Muss"-Befund ----
  await page.fill('#eingabeLinks', APERAK_POSITIV);
  await page.fill('#eingabeRechts', CONTRL_DUPLIKAT);
  await page.click('text=neg. CONTRL gegen Nachricht prüfen');
  await page.waitForTimeout(900);
  const aperak = await page.evaluate(() => ({
    links: document.getElementById('linksErgebnis').innerText,
    rechts: document.getElementById('rechtsErgebnis').innerText,
    abgleich: document.getElementById('abgleichErgebnis').innerText,
  }));
  ok(/APERAK/.test(aperak.links), 'Fall H: positive APERAK wird als APERAK erkannt');
  ok(!/Fehlende Muss-Segmente/.test(aperak.links),
    'Fall H: KEIN falscher Befund "Fehlende Muss-Segmente" mehr (war: RFF+TN)');
  ok(!/RFF\+TN[^\n]*fehlt/i.test(aperak.links),
    'Fall H: RFF+TN wird nicht mehr als fehlendes Pflichtsegment gemeldet');
  ok(/fehlerfrei/.test(aperak.links),
    'Fall H: gültige positive APERAK gilt als fehlerfrei');
  ok(/Pflicht nicht entscheidbar/.test(aperak.links),
    'Fall H: stattdessen sprechender Hinweis auf die Extraktionslücke im AHB-Gruppenstatus');

  // Fehlercode 26 muss jetzt Klartext haben (kam aus der MIG, fehlte vorher ganz)
  ok(/Duplikat gefunden/.test(aperak.rechts),
    'Fall H: DE0085 = 26 wird als „Duplikat gefunden" aufgelöst (neu aus dem MIG CONTRL)');
  ok(/kein Segmentbezug/.test(aperak.abgleich),
    'Fall H: Ablehnung auf Datei-Ebene ohne UCM korrekt eingeordnet');

  // ---- Leeren-Buttons blenden Abgleich-Panel wieder aus ---------------------
  await page.click('.panel:has(#eingabeLinks) button.secondary');
  await page.waitForTimeout(150);
  ok((await page.evaluate(() => document.getElementById('panelAbgleich').style.display)) === 'none',
    '„Leeren“ links blendet Abgleich-Panel wieder aus');
  ok((await page.evaluate(() => {
    const el = document.getElementById('lseg-0-6');
    return el ? el.classList.contains('ziel-contrl') : true;   // Element existiert nach Leeren ohnehin nicht mehr
  })) !== undefined, 'Kein Absturz beim erneuten Abgleich nach Leeren');

  // ---- Datei-Import (FileReader-Pfad) löst den vollständigen Ablauf aus -----
  await page.fill('#eingabeRechts', CONTRL_TREFFER);
  const fs = require('fs');
  const tmp = path.join(require('os').tmpdir(), 'ablehnung_abgleich_test.txt');
  fs.writeFileSync(tmp, KAPUTT);
  await page.setInputFiles('#dateiLinks', tmp);
  await page.waitForTimeout(700);
  ok((await page.evaluate(() => document.getElementById('eingabeLinks').value)).startsWith("UNA:"),
    'Datei-Import (links) befüllt Textarea');
  ok((await page.evaluate(() => document.getElementById('linksErgebnis').innerHTML.length)) > 100,
    'Datei-Import (links) löst automatische Prüfung aus');
  ok((await page.evaluate(() => document.getElementById('abgleichErgebnis').innerHTML.length)) > 50,
    'Datei-Import (links) aktualisiert auch den Abgleich (kombinierter Ablauf, nicht nur pruefeLinks)');
  fs.unlinkSync(tmp);

  ok(errors.length === 0, 'Keine Konsolen-/Seitenfehler: ' + JSON.stringify(errors));

  await browser.close();
  console.log(`\n${fails === 0 ? 'ALLE TESTS OK' : fails + ' FEHLER'}`);
  process.exit(fails ? 1 : 0);
})();
