// test_validator_mehrfach.js — validator.html mit Übertragungsdateien, die MEHRERE
// Nachrichten je UNB enthalten (Sammel-/Mehr-PID-Dateien, z. B. INVOIC mit 31001
// gefolgt von 31006, oder UTILMD mit mehreren Vorgängen unterschiedlicher Prüf-ID).
//
// Regressionsschutz gegen den Fehler, dass der Validator die GANZE Datei gegen die
// ERSTE Prüf-ID prüfte und dadurch die Segmente der Folgenachricht fälschlich als
// Fehler meldete. Erwartung: je Nachricht/Vorgang ein eigener Ergebnis-Block, jeder
// gegen seine eigene Prüf-ID. Ausschließlich synthetische Daten (keine echten
// Nachrichten) — läuft damit auch in der CI.
const { chromium } = require('playwright');
const ROOT = require('path').join(__dirname, '..');

// Zwei INVOIC-Nachrichten in einer Datei mit UNTERSCHIEDLICHEN Prüf-IDs.
const INVOIC_SAMMEL =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260801:0800+SREF01'" +
  "UNH+M1+INVOIC:D:06A:UN:2.8e'BGM+380+RE-0001+9'DTM+137:202608010800?+00:303'" +
  "RFF+Z13:31001'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'" +
  "UNS+S'MOA+77:10.00'UNT+9+M1'" +
  "UNH+M2+INVOIC:D:06A:UN:2.8e'BGM+380+RE-0002+9'DTM+137:202608010800?+00:303'" +
  "RFF+Z13:31006'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'" +
  "UNS+S'MOA+77:20.00'UNT+9+M2'" +
  "UNZ+2+SREF01'";

// Eine UTILMD-Nachricht mit ZWEI Vorgängen unterschiedlicher Prüf-ID (IDE+24).
const UTILMD_ZWEI_VORGAENGE =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260801:0800+SREF02'" +
  "UNH+U1+UTILMD:D:11A:UN:S2.1'BGM+E01+DOC-1'DTM+137:202608010800?+00:303'" +
  "NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'" +
  "IDE+24+VG0001'DTM+92:202608022200?+00:303'STS+7++E01+ZW4'LOC+Z16+50807812992'RFF+Z13:55001'" +
  "IDE+24+VG0002'STS+7++Z26'LOC+Z16+50807812992'RFF+Z13:55036'" +
  "UNT+13+U1'UNZ+1+SREF02'";

// Eine EINZELne Nachricht: Einzel-Ansicht muss unverändert bleiben.
const EINZEL =
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260801:0800+SREF03'" +
  "UNH+E1+INVOIC:D:06A:UN:2.8e'BGM+380+RE-0003+9'DTM+137:202608010800?+00:303'" +
  "RFF+Z13:31001'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'" +
  "UNS+S'MOA+77:30.00'UNT+9+E1'UNZ+1+SREF03'";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jsFehler = [];
  page.on('pageerror', e => jsFehler.push(e.message));
  await page.goto('file://' + ROOT + '/validator.html', { waitUntil: 'load' });

  let fails = 0;
  const pruefe = (b, t) => { console.log((b ? '  OK  ' : ' FAIL ') + t); if (!b) fails++; };

  const lauf = async (text) => page.evaluate(async (t) => {
    document.getElementById('eingabe').value = t;
    await starte();
    return {
      erk: document.getElementById('erkennung').textContent,
      ampel: document.getElementById('ampel').textContent,
      bloecke: document.querySelectorAll('#segmentListe h3').length,
      html: document.getElementById('segmentListe').innerHTML,
      antwort: document.getElementById('panelAntwort').style.display !== 'none',
    };
  }, text);

  // 1) INVOIC-Sammel: zwei Nachrichten, zwei Prüf-IDs, zwei Blöcke.
  const r1 = await lauf(INVOIC_SAMMEL);
  pruefe(/2 Nachrichten/.test(r1.erk), 'INVOIC-Sammel: zwei Nachrichten erkannt');
  pruefe(r1.bloecke === 2, 'INVOIC-Sammel: zwei Ergebnis-Blöcke (ist ' + r1.bloecke + ')');
  pruefe(/Prüf-ID 31001/.test(r1.html) && /Prüf-ID 31006/.test(r1.html),
    'INVOIC-Sammel: beide Prüf-IDs (31001, 31006) als eigene Blöcke');
  pruefe(!r1.antwort, 'INVOIC-Sammel: Antwort-Panel ausgeblendet');

  // 2) UTILMD mit zwei Vorgängen: je Vorgang ein Block gegen seine Prüf-ID.
  const r2 = await lauf(UTILMD_ZWEI_VORGAENGE);
  pruefe(r2.bloecke === 2, 'UTILMD zwei Vorgänge: zwei Blöcke (ist ' + r2.bloecke + ')');
  pruefe(/Prüf-ID 55001/.test(r2.html) && /Prüf-ID 55036/.test(r2.html),
    'UTILMD zwei Vorgänge: beide Prüf-IDs (55001, 55036) je eigener Block');

  // 3) Einzelnachricht: keine Mehrfach-Blöcke, Einzel-Ansicht mit Ampel.
  const r3 = await lauf(EINZEL);
  pruefe(r3.bloecke === 0, 'Einzelnachricht: keine Mehrfach-Blöcke (Einzel-Ansicht)');
  pruefe(/Prüf-ID/.test(r3.erk) && /31001/.test(r3.erk), 'Einzelnachricht: Prüf-ID 31001 in der Erkennung');
  pruefe(r3.ampel.length > 0, 'Einzelnachricht: Ampel gesetzt (ist "' + r3.ampel + '")');

  pruefe(jsFehler.length === 0, 'keine JS-Fehler (' + jsFehler.join(' | ') + ')');

  await browser.close();
  console.log('\nVALIDATOR-MEHRFACH: ' + (fails ? fails + ' FAIL' : 'alle OK'));
  process.exit(fails ? 1 : 0);
})();
