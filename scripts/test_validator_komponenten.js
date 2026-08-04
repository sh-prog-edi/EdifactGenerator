// Komponentenlage und Segmentzähler im Validator:
//   1. Ein Wert an einer nicht vorgesehenen Komponente (NAD+Z63++:LADEN — der Name
//      hängt hinter einem leeren DE3124 in der zweiten Komponente von C058) wird
//      als Fehler gemeldet und das Segment rot eingefärbt. Anlass war eine
//      geprüfte 55013, bei der der Validator statt dieses Aufbaufehlers nur die
//      (korrekt erkannten) fehlenden Muss-Segmente meldete — der eigentliche
//      Fehler blieb unsichtbar, das Segment grün.
//   2. Bekannte spätere Komponenten lösen KEINEN Fehlalarm aus
//      (CTA+IC+:Name — DE3412; NAD+MS+id::293 — DE3055).
//   3. Der Segmentzähler der Ergebnisliste zählt wie die CONTRL-Referenz
//      (UCS DE0096) ab UNH = 1; UNA/UNB/UNZ bleiben ohne Nummer.
//   4. Eine fehlerfrei erzeugte Nachricht (Golden 55016) bleibt fehlerfrei.
const { chromium } = require('playwright');

const ROOT = '/mnt/user-data/working/edigen/EdifactGenerator';

const KAPUTT =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260803:0800+844156800099++++++1'" +
  "UNH+844156800099+UTILMD:D:11A:UN:S2.1'BGM+E01+844156800099'DTM+137:202608030800?+00:303'" +
  "NAD+MS+9900000000001::293'CTA+IC+:Max Muster'COM+max?@test.de:EM'NAD+MR+9900000000002::293'" +
  "IDE+24+EDIGEN{844156800099'DTM+92:202610010000?+00:303'STS+7++E06+ZW6'" +
  "LOC+Z18+DE0011111111111111111111111111111'LOC+Z16+51238696781'LOC+Z20+DE0022222222222222222222222222222'" +
  "LOC+Z19+DE0033333333333333333333333333333'LOC+Z17+DE0071688314'" +
  "RFF+Z13:55013'RFF+TN:844156800099'" +
  // Kunden-/Beteiligten-NADs korrekt: Name in C080 (Element 3), ggf. zweite
  // Namenszeile als 3036-Wiederholung — C082/C058 bleiben bei diesen Qualifiern leer.
  "NAD+Z65+++Meier:Lieselotte'NAD+Z66+++Meier'NAD+Z67+++Anschlussnehmer Meier'" +
  "NAD+Z68+++Hausverwaltung Gera GmbH'NAD+Z69+++Meier'NAD+Z70+++Hausverwaltung Gera GmbH'" +
  "NAD+Z63++:LADEN !++Weg::3Lusan+Gera++07555+DE'" +
  "UNT+25+844156800099'UNZ+1+844156800099'";

// Aufbaufehler je Qualifier: Name in C082 statt C080 (Z65), Name in C080 bei der
// Marktlokationsanschrift (Z63, dort "Nicht benutzt"), Adresse am NAD+MS, mehr
// 3124-Wiederholungen als das MIG vorsieht.
const AUFBAU_FEHLER =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260803:0800+844156800101++++++1'" +
  "UNH+844156800101+UTILMD:D:11A:UN:S2.1'BGM+E01+844156800101'DTM+137:202608030800?+00:303'" +
  "NAD+MS+9900000000001::293+++++Gera'NAD+MR+9900000000002::293'" +
  "IDE+24+EDIGEN{844156800101'STS+7++E06+ZW6'LOC+Z16+51238696781'RFF+Z13:55013'" +
  "NAD+Z65+Meier'" +
  "NAD+Z63+++LADEN'" +
  "NAD+Z59++A:B:C:D:E:F+Weg'" +
  "UNT+12+844156800101'UNZ+1+844156800101'";

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, ok = 0;
  const pruefe = (name, gut) => { geprueft++; if (gut) ok++; else fehler.push(name); };

  const page = await browser.newPage();
  await page.goto(`file://${ROOT}/validator.html`, { waitUntil: 'load' });

  // ---- 1./2./3. fehlerhafte 55013 -----------------------------------------
  const erg = await page.evaluate(async ([t]) => {
    document.getElementById('eingabe').value = t;
    await starte(); await new Promise(r => setTimeout(r, 700));
    const zeilen = Array.from(document.querySelectorAll('#segmentListe .seg')).map(e => ({
      rot: e.classList.contains('rot'),
      nr: (e.querySelector('.segnr') || {}).textContent || '',
      text: e.textContent.replace(/\s+/g, ' '),
    }));
    return { ampel: document.getElementById('ampel').textContent, zeilen };
  }, [KAPUTT]);

  const nad = erg.zeilen.find(z => z.text.includes('NAD+Z63'));
  pruefe('NAD+Z63 mit leerer DE3124-Erstwiederholung wird rot eingefärbt', !!nad && nad.rot);
  pruefe('Meldung: quellenbelegt (MIG-Muss der 1. Wiederholung, AF 2.17/6.10)',
    !!nad && /LADEN !/.test(nad.text) && /DE3124/.test(nad.text) &&
    /Wiederholung 1 ist leer/.test(nad.text) && /2\.17, 6\.10/.test(nad.text));
  // Die Straße „Weg::3Lusan" (C059: Teil 2 leer, Hausnummer belegt) ist laut
  // AF 2.17 der Normalfall fester Wiederholungsbedeutungen — keine zweite Meldung.
  pruefe('C059-Lücke (Weg::3Lusan) bleibt unbeanstandet',
    !!nad && !/3042/.test(nad.text) && (nad.text.match(/✗/g) || []).length === 1);
  // Korrekt belegte Kunden-/Beteiligten-NADs (Name in C080, zweite Namenszeile
  // als 3036-Wiederholung) bleiben fehlerfrei.
  for (const q of ['Z65', 'Z66', 'Z67', 'Z68', 'Z69', 'Z70']) {
    geprueft++;
    const z = erg.zeilen.find(x => x.text.includes('NAD+' + q));
    if (z && !z.rot) ok++; else fehler.push(`korrektes NAD+${q} (Name in C080) fälschlich beanstandet`);
  }
  pruefe('CTA+IC+:Name bleibt ohne Fehlalarm (DE3412)',
    (erg.zeilen.find(z => z.text.includes('CTA+IC')) || {}).rot === false);
  pruefe('NAD+MS mit ::293 bleibt ohne Fehlalarm (DE3055)',
    (erg.zeilen.find(z => z.text.includes('NAD+MS')) || {}).rot === false);
  const nrVon = tag => (erg.zeilen.find(z => z.text.replace(/^\s*\d*\s*/, '').startsWith(tag)) || {}).nr;
  pruefe('Segmentzähler: UNH = 1', nrVon('UNH') === '1');
  pruefe('Segmentzähler: NAD+Z63 = 24', (erg.zeilen.find(z => z.text.includes('NAD+Z63')) || {}).nr === '24');
  pruefe('Segmentzähler: UNT = 25', nrVon('UNT') === '25');
  pruefe('UNB und UNZ ohne Nummer', nrVon('UNB') === '' && nrVon('UNZ') === '');

  // ---- 3b. Aufbaufehler je Qualifier (nad-aufbau.js) ----------------------
  const aufbau = await page.evaluate(async ([t]) => {
    document.getElementById('eingabe').value = t;
    await starte(); await new Promise(r => setTimeout(r, 700));
    return Array.from(document.querySelectorAll('#segmentListe .seg')).map(e => ({
      rot: e.classList.contains('rot'),
      text: e.textContent.replace(/\s+/g, ' '),
    }));
  }, [AUFBAU_FEHLER]);
  const zeileMit = s => aufbau.find(z => z.text.includes(s)) || {};
  pruefe('NAD+Z65: Name in C082 statt C080 wird beanstandet',
    zeileMit('NAD+Z65+Meier').rot && /C082.*nicht benutzt|Identifikation des Beteiligten.*nicht benutzt/.test(zeileMit('NAD+Z65+Meier').text));
  pruefe('NAD+Z63: Name in C080 wird beanstandet (dort „Nicht benutzt")',
    zeileMit('NAD+Z63+++LADEN').rot && /C080|Name des Beteiligten/.test(zeileMit('NAD+Z63+++LADEN').text));
  pruefe('NAD+MS: Ortsangabe ist bei MS nicht vorgesehen',
    zeileMit('NAD+MS').rot && /nicht vorgesehen/.test(zeileMit('NAD+MS').text));
  pruefe('NAD+Z59: sechste 3124-Wiederholung übersteigt das MIG (max 5)',
    zeileMit('NAD+Z59').rot && /übersteigt/.test(zeileMit('NAD+Z59').text));

  // ---- 4. Gegenprobe: fehlerfreie Golden-55016 bleibt fehlerfrei ----------
  const golden = require(`${ROOT}/202604/Stammdaten/UTILMD/Strom/golden/messages.json`);
  const gut = String(golden['55016'].nachricht || golden['55016']).replace(/\n/g, '');
  const erg2 = await page.evaluate(async ([t]) => {
    document.getElementById('eingabe').value = t;
    await starte(); await new Promise(r => setTimeout(r, 700));
    return {
      ampel: document.getElementById('ampel').textContent,
      rot: document.querySelectorAll('#segmentListe .seg.rot').length,
    };
  }, [gut]);
  pruefe('Golden-55016 weiterhin fehlerfrei', /fehlerfrei/.test(erg2.ampel) && erg2.rot === 0);

  await browser.close();
  console.log(`\nVALIDATOR-KOMPONENTEN: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
