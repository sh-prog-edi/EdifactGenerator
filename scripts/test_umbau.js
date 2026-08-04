// End-to-End-Test der Umbau-Seite (umbau.html): eine „Produktivnachricht" wird
// importiert und zur Testnachricht umgebaut. Geprüft wird:
//   - nach dem Einlesen sind alle Felder LEER (keine Vorbelegung vor dem Umbau),
//   - der Umbau setzt das Test-Kennzeichen (UNB DE0035 = 1),
//   - UNB S004 und DTM+137 tragen den aktuellen Zeitpunkt,
//   - DAR/Nachrichten-/Dokumentennummer (UNB, UNH, BGM, UNT, UNZ) sind neu und
//     konsistent, die Vorgangsnummer folgt EDIGEN{<DAR> (je Vorgang -02 …),
//   - die erste Zeitscheibe je Vorgang (DTM+Z25) beginnt am Folgetag 00:00,
//     spätere Zeitscheiben bleiben unangetastet,
//   - die Felder bleiben editierbar und eine Änderung fließt in die Ausgabe,
//   - der Dateiname der Speicherung folgt den Allgemeinen Festlegungen 2.12,
//   - auch eine Nachricht mit fremdem Typ/unbekannter Prüf-ID wird umgebaut.
const { chromium } = require('playwright');

const ROOT = require('path').join(__dirname, '..');

// „Produktivnachricht": UTILMD 55016-artig mit zwei Vorgängen und Zeitscheiben,
// ohne Test-Kennzeichen, mit produktiven Nummern und altem Datum.
const PROD =
  "UNA:+.? 'UNB+UNOC:3+9904712000002:500+9911223000009:500+250312:1004+PR2025031200'" +
  "UNH+PRD881+UTILMD:D:11A:UN:S2.1'BGM+E01+DOC-2025-4711'DTM+137:202503121004?+00:303'" +
  "IDE+24+VG-2025-000815'RFF+Z13:55016'LOC+Z16+51238696781'DTM+93:202512312300?+00:303'" +
  "RFF+Z49::1'DTM+Z25:202504010000?+00:303'DTM+Z26:202505010000?+00:303'" +
  "RFF+Z49::2'DTM+Z25:202505010000?+00:303'" +
  "IDE+24+VG-2025-000816'RFF+Z13:55017'LOC+Z16+51238696799'DTM+Z25:202504010000?+00:303'" +
  "UNT+18+PRD881'UNZ+1+PR2025031200'";   // UNT absichtlich falsch — der Umbau zählt neu

// Fremder Nachrichtentyp (nicht im Generator hinterlegt) — generischer Umbau.
const FREMD =
  "UNA:+.? 'UNB+UNOC:3+4012345678901:14+4098765432109:14+240101:0101+ALTREF9'" +
  "UNH+M0001+DELFOR:D:96A:UN'BGM+241+DOC77'DTM+137:202401010101:203'" +
  "NAD+MS+4012345678901::9'UNT+5+M0001'UNZ+1+ALTREF9'";

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, ok = 0;
  const pruefe = (name, gut) => { geprueft++; if (gut) ok++; else fehler.push(name); };

  const page = await browser.newPage();
  const jsFehler = [];
  page.on('pageerror', e => jsFehler.push(e.message));
  await page.goto(`file://${ROOT}/umbau.html`, { waitUntil: 'load' });

  // ---- 1. Einlesen: Felder vorhanden, aber leer ---------------------------
  const nachEinlesen = await page.evaluate(([text]) => {
    document.getElementById('eingabe').value = text;
    einlesen();
    // Nur die Wertfelder zählen — die Radio-Buttons der Vorgangsauswahl sind keine Segmentfelder.
    const inputs = Array.from(document.querySelectorAll('#segmentEditor input')).filter(i => i.type !== 'radio' && i.type !== 'checkbox');
    return {
      erkennung: document.getElementById('erkennung').textContent,
      segmentZeilen: document.querySelectorAll('#segmentEditor .segzeile').length,
      vorgangszeilen: document.querySelectorAll('#segmentEditor .segzeile.vorgang').length,
      pruefidFelder: document.querySelectorAll('#segmentEditor input.pruefid').length,
      radios: document.querySelectorAll('input[name="vorgangswahl"]').length,
      alleAngehakt: Array.from(document.querySelectorAll('input[name="vorgangswahl"]')).every(k => k.checked),
      radioTexte: Array.from(document.querySelectorAll('.vorgangswahl')).map(l => l.textContent),
      felder: inputs.length,
      leere: inputs.filter(i => i.value === '').length,
      ausgabeSichtbar: document.getElementById('panelAusgabe').style.display !== 'none',
    };
  }, [PROD]);
  pruefe('Erkennung nennt UTILMD und Prüf-ID 55016',
    /UTILMD/.test(nachEinlesen.erkennung) && /55016/.test(nachEinlesen.erkennung));
  pruefe('je Segment eine Zeile', nachEinlesen.segmentZeilen === 19);
  pruefe('beide Vorgangszeilen (IDE) gelb markiert', nachEinlesen.vorgangszeilen === 2);
  pruefe('beide Prüf-ID-Felder (RFF+Z13) markiert', nachEinlesen.pruefidFelder === 2);
  pruefe('je Vorgang eine vorbelegte Checkbox (2, beide angehakt)',
    nachEinlesen.radios === 2 && nachEinlesen.alleAngehakt);
  pruefe('Auswahl nennt die Prüf-IDs der Vorgänge',
    nachEinlesen.radioTexte.some(t => /55016/.test(t)) && nachEinlesen.radioTexte.some(t => /55017/.test(t)));
  pruefe('alle Felder zunächst ohne Vorbelegung',
    nachEinlesen.felder > 0 && nachEinlesen.leere === nachEinlesen.felder);
  pruefe('keine Ausgabe vor dem Umbau', !nachEinlesen.ausgabeSichtbar);

  // ---- 2. Umbau -----------------------------------------------------------
  const nachUmbau = await page.evaluate(() => {
    umbauen();
    const inputs = Array.from(document.querySelectorAll('#segmentEditor input')).filter(i => i.type !== 'radio' && i.type !== 'checkbox');
    return {
      gefuellt: inputs.filter(i => i.value !== '').length,
      ersetzt: inputs.filter(i => i.classList.contains('ersetzt')).map(i => ({ id: i.id, wert: i.value, titel: i.title })),
      readonlyFelder: inputs.filter(i => i.readOnly || i.disabled).length,
      ausgabe: document.getElementById('umbauOut').value,
      dateiname: EdiSpeichern.dateiname(document.getElementById('umbauOut').value),
    };
  });
  const aus = nachUmbau.ausgabe.replace(/\n/g, '');
  const seg = tag => (new RegExp("(?:^|')" + tag + "([^']*)'").exec(aus) || [])[1] || '';
  const unb = seg('UNB\\+'), unh = seg('UNH\\+'), bgm = seg('BGM\\+'),
        unt = seg('UNT\\+'), unz = seg('UNZ\\+');
  // UNB-Elemente: 0 S001, 1 S002, 2 S003, 3 S004 (Datum:Zeit), 4 DE0020 (DAR), … 10 DE0035
  const dar = (unb.split('+')[4] || '');

  const jetzt = new Date();
  const p2 = n => String(n).padStart(2, '0');
  const heuteUnb = String(jetzt.getUTCFullYear()).slice(2) + p2(jetzt.getUTCMonth() + 1) + p2(jetzt.getUTCDate());
  const heute137 = '' + jetzt.getUTCFullYear() + p2(jetzt.getUTCMonth() + 1) + p2(jetzt.getUTCDate());
  const morgen = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 1);
  const morgenZ25 = '' + morgen.getUTCFullYear() + p2(morgen.getUTCMonth() + 1) + p2(morgen.getUTCDate())
                  + p2(morgen.getUTCHours()) + p2(morgen.getUTCMinutes());

  pruefe('Test-Kennzeichen UNB DE0035 = 1', unb.split('+').length >= 11 && unb.split('+')[10] === '1');
  pruefe('UNB S004 = aktueller Tag (UTC)', unb.split('+')[3].startsWith(heuteUnb + ':'));
  pruefe('neue DAR 12-stellig', /^\d{12}$/.test(dar));
  pruefe('UNH-Nachrichtennummer = DAR', unh.startsWith(dar + '+'));
  pruefe('BGM-Dokumentennummer = DAR', bgm.split('+')[1] === dar);
  // Die „Produktivnachricht" trägt absichtlich eine falsche Segmentanzahl (UNT+17);
  // der Umbau zählt neu: UNH bis UNT einschließlich sind 17 Segmente.
  pruefe('UNT trägt DAR und neu gezählte Segmentanzahl 17', unt === '17+' + dar);
  pruefe('UNZ trägt DAR', unz === '1+' + dar);
  pruefe('DTM+137 = aktueller Zeitpunkt (UTC, 303)',
    new RegExp("DTM\\+137:" + heute137 + "\\d{4}\\?\\+00:303'").test(aus));
  pruefe('Vorgang 1: EDIGEN{DAR', aus.includes("IDE+24+EDIGEN{" + dar + "'"));
  pruefe('Vorgang 2: EDIGEN{DAR-02', aus.includes("IDE+24+EDIGEN{" + dar + "-02'"));
  pruefe('erste Zeitscheibe Vorgang 1 ab Folgetag 00:00',
    aus.includes("RFF+Z49::1'DTM+Z25:" + morgenZ25 + "?+00:303'"));
  pruefe('zweite Zeitscheibe bleibt unangetastet',
    aus.includes("RFF+Z49::2'DTM+Z25:202505010000?+00:303'"));
  pruefe('erste Zeitscheibe Vorgang 2 ebenfalls ab Folgetag',
    aus.includes("51238696799'DTM+Z25:" + morgenZ25 + "?+00:303'"));
  pruefe('Marktlokation unverändert übernommen', aus.includes("LOC+Z16+51238696781'"));
  pruefe('kein Feld schreibgeschützt', nachUmbau.readonlyFelder === 0);
  pruefe('Ersetzungen markiert (mindestens 10)', nachUmbau.ersetzt.length >= 10);
  // UNB S004 hat zwei Komponenten: Datum (f_0_3_0) UND Uhrzeit (f_0_3_1) müssen
  // beide als ersetzt markiert sein — die Uhrzeit fehlte anfangs in der Meldung.
  pruefe('UNB-Datum als ersetzt markiert', nachUmbau.ersetzt.some(e => e.id === 'f_0_3_0'));
  pruefe('UNB-Uhrzeit als ersetzt markiert', nachUmbau.ersetzt.some(e => e.id === 'f_0_3_1'));
  pruefe('Dateiname nach Allg. Festlegungen 2.12',
    nachUmbau.dateiname === `UTILMD__9904712000002_9911223000009_${heute137}_${dar}.txt`);

  // ---- 3. Editierbarkeit: Änderung fließt in die Ausgabe ------------------
  const nachEdit = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('#segmentEditor input')).filter(i => i.type !== 'radio' && i.type !== 'checkbox');
    const malo = inputs.find(i => i.value === '51238696781');
    malo.value = '98765432109';
    malo.dispatchEvent(new Event('input'));
    return document.getElementById('umbauOut').value.replace(/\n/g, '');
  });
  pruefe('geänderte MaLo steht in der Ausgabe', nachEdit.includes("LOC+Z16+98765432109'"));

  // ---- 3b. Abwahl: Vorgang 1 abhaken, nur Vorgang 2 ausgeben --------------
  const einzeln = await page.evaluate(() => {
    const kasten = document.querySelector('input[name="vorgangswahl"][value="0"]');
    kasten.checked = false;
    kasten.dispatchEvent(new Event('change'));
    return {
      umfang: document.getElementById('ausgabeUmfang').textContent,
      ausgabe: document.getElementById('umbauOut').value.replace(/\n/g, ''),
    };
  });
  pruefe('Abwahl: Hinweis auf verkürzten Umfang und Zähler',
    /1 von 2 Vorgängen/.test(einzeln.umfang) && /55017/.test(einzeln.umfang) && /UNZ/.test(einzeln.umfang));
  pruefe('Einzelvorgang: Vorgang 1 nicht enthalten',
    !einzeln.ausgabe.includes("IDE+24+EDIGEN{" + dar + "'") && !einzeln.ausgabe.includes('51238696781') &&
    !einzeln.ausgabe.includes('98765432109'));
  pruefe('Einzelvorgang: Vorgang 2 mit seiner Vorgangsnummer enthalten',
    einzeln.ausgabe.includes("IDE+24+EDIGEN{" + dar + "-02'") && einzeln.ausgabe.includes("LOC+Z16+51238696799'"));
  pruefe('Einzelvorgang: Kopfteil (BGM, DTM+137) bleibt erhalten',
    einzeln.ausgabe.includes('BGM+E01+' + dar) && /DTM\+137:/.test(einzeln.ausgabe));
  // Verkürzte Nachricht: UNH, BGM, DTM+137, IDE, RFF+Z13, LOC, DTM+Z25, UNT = 8 Segmente
  pruefe('Einzelvorgang: UNT-Segmentzähler neu (8)', einzeln.ausgabe.includes("UNT+8+" + dar + "'"));
  pruefe('Einzelvorgang: UNZ-Zähler 1', einzeln.ausgabe.includes("UNZ+1+" + dar + "'"));

  // Wieder anhaken: der versehentliche Klick ist rückgängig gemacht.
  const wiederAlle = await page.evaluate(() => {
    const kasten = document.querySelector('input[name="vorgangswahl"][value="0"]');
    kasten.checked = true;
    kasten.dispatchEvent(new Event('change'));
    return document.getElementById('umbauOut').value.replace(/\n/g, '');
  });
  pruefe('Wieder-Anhaken stellt die volle Ausgabe wieder her',
    wiederAlle.includes("IDE+24+EDIGEN{" + dar + "'") && wiederAlle.includes("IDE+24+EDIGEN{" + dar + "-02'") &&
    wiederAlle.includes("UNT+17+" + dar + "'"));

  // „Alle Haken entfernen": nichts gewählt -> Hinweis statt leerer Hülle;
  // „alle Haken setzen" stellt alles wieder her.
  const keiner = await page.evaluate(() => {
    alleVorgaenge(false);
    const hinweis = document.getElementById('ausgabeUmfang').textContent;
    const leer = document.getElementById('umbauOut').value;
    alleVorgaenge(true);
    return { hinweis, leer, danach: document.getElementById('umbauOut').value.replace(/\n/g, '') };
  });
  pruefe('ohne Haken: Hinweis und keine Ausgabe',
    /Kein Vorgang angehakt/.test(keiner.hinweis) && keiner.leer === '');
  pruefe('„alle Haken setzen" stellt die volle Ausgabe wieder her',
    keiner.danach.includes("UNT+17+" + dar + "'") && keiner.danach.includes("UNZ+1+" + dar + "'"));

  // ---- 4. Fremder Nachrichtentyp: generischer Umbau -----------------------
  const fremd = await page.evaluate(([text]) => {
    document.getElementById('eingabe').value = text;
    einlesen();
    const leer = Array.from(document.querySelectorAll('#segmentEditor input')).filter(i => i.type !== 'radio' && i.type !== 'checkbox').every(i => i.value === '');
    umbauen();
    return {
      leerVorher: leer,
      erkennung: document.getElementById('erkennung').textContent,
      ausgabe: document.getElementById('umbauOut').value.replace(/\n/g, ''),
    };
  }, [FREMD]);
  const funb = (/UNB\+([^']*)'/.exec(fremd.ausgabe) || [])[1] || '';
  const fdar = funb.split('+')[4] || '';
  pruefe('Fremdtyp: Hinweis auf generischen Umbau', /generisch/.test(fremd.erkennung));
  pruefe('Fremdtyp: Felder vor dem Umbau leer', fremd.leerVorher);
  pruefe('Fremdtyp: Test-Kennzeichen gesetzt', funb.split('+').length >= 11 && funb.split('+')[10] === '1');
  pruefe('Fremdtyp: neue DAR in UNB/UNH/UNT/UNZ',
    /^\d{12}$/.test(fdar) && fremd.ausgabe.includes('UNH+' + fdar + '+DELFOR') &&
    fremd.ausgabe.includes("UNT+5+" + fdar + "'") && fremd.ausgabe.includes("UNZ+1+" + fdar + "'"));
  pruefe('Fremdtyp: DTM+137 im Format 203 ersetzt',
    new RegExp("DTM\\+137:\\d{12}:203'").test(fremd.ausgabe));
  pruefe('Fremdtyp: NAD bleibt unangetastet', fremd.ausgabe.includes("NAD+MS+4012345678901::9'"));
  pruefe('Fremdtyp: ohne Vorgänge keine Vorgangsauswahl',
    (await page.evaluate(() => document.getElementById('vorgangsWahl').style.display)) === 'none');

  pruefe('keine JS-Fehler auf der Seite', jsFehler.length === 0);

  await browser.close();
  console.log(`\nUMBAU: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  if (jsFehler.length) jsFehler.forEach(f => console.log(' JS:', f));
  process.exit(fehler.length ? 1 : 0);
})();
