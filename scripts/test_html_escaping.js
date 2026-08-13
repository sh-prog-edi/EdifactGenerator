// test_html_escaping.js — HTML-Escaping von Nachrichteninhalten in validator.html
// und umbau.html.
//
// Anlass (Sicherheitsaudit, Protokoll Abschnitt 70): Validator und Umbau lesen
// bewusst auch NICHT vertrauenswürdige Dateien ein (Marktpartner-Nachrichten,
// die zur Prüfung eingefügt/importiert werden). Mehrere Anzeigepfade bauten die
// Erkennungs-/Meldungsboxen per innerHTML aus rohem Nachrichteninhalt zusammen
// (UNH-Nachrichtentyp/-Kennung, RFF+Z13-Prüf-ID, BGM-Dokumentennummer, das
// unvollständige Rest-Segment am Dateiende) — OHNE HTML-Escaping. Eine
// präparierte Nachricht (z. B. "UNH+1+<img src=x onerror=…>:D:…") führte damit
// zur Ausführung von Skript-Code im Kontext der Seite (DOM-XSS), sobald die
// Nachricht validiert bzw. eingelesen wurde. Geschlossen mit einer zentralen
// esc()-Funktion an jeder Einfügestelle; hier vier unabhängige Auslösewege
// gegen die Regression abgesichert.
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const RAHMEN = (unhTyp, bgm, restNachDemBgm) =>
  "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260813:0800+1++++++1'" +
  `UNH+1+${unhTyp}:D:11A:UN:S2.1'BGM+E01+${bgm}'` + (restNachDemBgm || "UNT+2+1'UNZ+1+1'");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let dialogAusgeloest = 0;
  page.on('dialog', async d => { dialogAusgeloest++; await d.dismiss(); });

  let geprueft = 0, ok = 0;
  const fehler = [];
  const pruefe = (name, gut) => { geprueft++; if (gut) ok++; else fehler.push(name); };

  // ---- validator.html: Einzelansicht — UNH-Nachrichtentyp unbekannt -------
  await page.goto(`file://${ROOT}/validator.html`);
  await page.fill('#eingabe', RAHMEN('<img src=x onerror=alert(1)>', '1'));
  await page.click("button.go[onclick='starte()']");
  await page.waitForTimeout(600);
  let html = await page.evaluate(() => document.getElementById('erkennung').innerHTML);
  pruefe('validator.html Einzelansicht: UNH-Typ mit Skript-Nutzlast bleibt Text (kein <img> im DOM)',
    !html.includes('<img') && html.includes('&lt;img'));

  // ---- validator.html: unvollständiges Segment am Dateiende --------------
  await page.reload();
  await page.fill('#eingabe',
    "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260813:0800+1++++++1'" +
    "UNH+1+UTILMD:D:11A:UN:S2.1'BGM+E01+1'<img src=x onerror=alert(2)>");
  await page.click("button.go[onclick='starte()']");
  await page.waitForTimeout(600);
  html = await page.evaluate(() => document.getElementById('globalMeldungen').innerHTML);
  pruefe('validator.html Einzelansicht: unvollständiges Restsegment bleibt Text (kein <img> im DOM)',
    !html.includes('<img'));

  // ---- validator.html: Mehrfachansicht — BGM-Dokumentennummer ------------
  await page.reload();
  await page.fill('#eingabe',
    "UNA:+.? 'UNB+UNOC:3+9900000000001:500+9900000000002:500+260813:0800+1++++++1'" +
    "UNH+1+INVOIC:D:07B:UN:2.1i'BGM+380+<img src=x onerror=alert(3)>'UNT+2+1'" +
    "UNH+2+INVOIC:D:07B:UN:2.1i'BGM+380+2'UNT+2+2'UNZ+2+1'");
  await page.click("button.go[onclick='starte()']");
  await page.waitForTimeout(600);
  const imgImBody = await page.evaluate(() => document.body.querySelectorAll('img[src="x"]').length);
  pruefe('validator.html Mehrfachansicht: BGM-Dokumentennummer mit Skript-Nutzlast bleibt Text',
    imgImBody === 0);

  // ---- umbau.html: UNH-Nachrichtentyp -------------------------------------
  await page.goto(`file://${ROOT}/umbau.html`);
  await page.fill('#eingabe', RAHMEN('<img src=x onerror=alert(4)>', '1'));
  await page.click("button.go[onclick='einlesen()']");
  await page.waitForTimeout(600);
  html = await page.evaluate(() => document.getElementById('erkennung').innerHTML);
  pruefe('umbau.html: UNH-Typ mit Skript-Nutzlast bleibt Text (kein <img> im DOM)',
    !html.includes('<img') && html.includes('&lt;img'));

  pruefe('kein dialog()-Aufruf (alert/confirm/prompt) über alle vier Auslösewege ausgelöst',
    dialogAusgeloest === 0);

  await browser.close();
  console.log(`\nHTML-ESCAPING: ${ok}/${geprueft}`);
  fehler.forEach(f => console.log(' -', f));
  process.exit(fehler.length ? 1 : 0);
})();
