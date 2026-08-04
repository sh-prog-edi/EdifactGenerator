// Prüft für alle Generatorseiten, dass die Bedingungs-Hilfe vollständig ist:
//   1. jeder angezeigte AHB-Ausdruck mit Bedingungsverweis trägt ein Fragezeichen-Symbol,
//   2. ein Klick darauf zeigt zu jedem Verweis [nn] einen Klartext — nie den Platzhalter
//      „Text noch nicht hinterlegt".
// Geprüft werden je Seite mehrere Prüf-IDs (erste, mittlere, letzte).
const { chromium } = require('playwright');

const ROOT = require('path').join(__dirname, '..');
const SEITEN = [];
for (const stand of ['202604', '202610']) {
  SEITEN.push(
    [`${stand}/Stammdaten/UTILMD/Strom/index.html`, 'prufId'],
    [`${stand}/Stammdaten/UTILMD/Gas/index.html`, 'prufId'],
    [`${stand}/Berichte/IFTSTA/index.html`, 'pruefi'],
    [`${stand}/Berichte/INSRPT/index.html`, 'pruefi'],
    [`${stand}/Rechnungsstellung/COMDIS/index.html`, 'pruefi'],
    [`${stand}/Rechnungsstellung/INVOIC/index.html`, 'pruefi'],
    [`${stand}/Rechnungsstellung/PRICAT/index.html`, 'pruefi'],
    [`${stand}/Rechnungsstellung/REMADV/index.html`, 'pruefi'],
    [`${stand}/Stammdaten/PARTIN/index.html`, 'pruefi'],
    [`${stand}/Stammdaten/UTILTS/index.html`, 'pruefi'],
    [`${stand}/Bestellvorgang/ORDERS/index.html`, 'pruefi'],
    [`${stand}/Bestellvorgang/ORDRSP/index.html`, 'pruefi'],
    [`${stand}/Bestellvorgang/ORDCHG/index.html`, 'pruefi'],
    [`${stand}/Bestellvorgang/QUOTES/index.html`, 'pruefi'],
    [`${stand}/Bestellvorgang/REQOTE/index.html`, 'pruefi'],
    [`${stand}/Bewegungsdaten/MSCONS/index.html`, 'pruefi'],
    // Die AHB-Vollformulare: Sie zeigen die ungekürzte Segmentstruktur und sind das
    // Ziel der Folgenachrichten-Verweise — die Hilfe muss auch dort greifen.
    [`${stand}/Stammdaten/UTILMD/Strom/vollformular.html`, 'pruefi'],
    [`${stand}/Stammdaten/UTILMD/Gas/vollformular.html`, 'pruefi'],
  );
}

// Mit SEITE=<Teilstring> lässt sich der Lauf auf einzelne Seiten eingrenzen,
// etwa SEITE=vollformular ALLE=1 für den Vollnachweis der AHB-Vollformulare.
const AUSWAHL = process.env.SEITE ? SEITEN.filter(s => s[0].includes(process.env.SEITE)) : SEITEN;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  let geprueft = 0, mitSymbol = 0, ausdruecke = 0, verweise = 0, ohneText = 0;
  let erwartet = 0, nichtErreichbar = 0;

  for (const [seite, selectId] of AUSWAHL) {
    const page = await browser.newPage();
    page.on('pageerror', e => fehler.push(`${seite}: JS-Fehler ${e.message}`));
    await page.goto(`file://${ROOT}/${seite}`, { waitUntil: 'load' });

    const alle = await page.$$eval(`#${selectId} option`, os => os.map(o => o.value).filter(Boolean));
    if (!alle.length) { fehler.push(`${seite}: keine Prüf-IDs im Auswahlfeld (#${selectId})`); await page.close(); continue; }
    // Standard: Stichprobe (erste, mittlere, letzte Prüf-ID). Mit ALLE=1 werden alle
    // Prüf-IDs der Seite geprüft — der vollständige Nachweis, dafür deutlich länger.
    const proben = process.env.ALLE === '1'
      ? alle
      : [...new Set([alle[0], alle[Math.floor(alle.length / 2)], alle[alle.length - 1]])];

    for (const pruefi of proben) {
      geprueft++;
      const ergebnis = await page.evaluate(async ([pid, selId]) => {
        const sel = document.getElementById(selId);
        sel.value = pid;
        if (typeof sel.onchange === 'function') sel.onchange();
        else if (typeof renderForm === 'function') renderForm();
        // Das Vollformular lädt die Struktur je Prüf-ID erst bei Bedarf nach; darauf
        // warten, danach den MutationObserver der Hilfe zum Zuge kommen lassen.
        for (let i = 0; i < 60; i++) {
          if (document.querySelectorAll('.expr').length) break;
          await new Promise(r => setTimeout(r, 50));
        }
        await new Promise(r => setTimeout(r, 60));   // MutationObserver der Hilfe abwarten

        const hatBedingung = t => /\[[0-9UP]/.test(t) || /[∧∨⊻⊕]/.test(t);
        const spans = Array.from(document.querySelectorAll('.expr'));
        const relevant = spans.filter(s => hatBedingung(s.textContent || ''));
        const mit = relevant.filter(s => s.querySelector('.edi-bh-btn'));
        const ohne = relevant.filter(s => !s.querySelector('.edi-bh-btn'))
          .map(s => (s.textContent || '').slice(0, 70));

        // Popover-Inhalt aller Symbole einsammeln
        let verweise = 0, fehlend = [];
        document.querySelectorAll('.edi-bh-btn').forEach(btn => {
          btn.click();
          const pop = document.querySelector('.edi-bh-pop');
          if (!pop) return;
          pop.querySelectorAll('.edi-bh-row').forEach(row => {
            const nr = row.querySelector('.edi-bh-nr');
            if (!nr) return;
            verweise++;
            if (/Text noch nicht hinterlegt/.test(row.textContent || '')) fehlend.push(nr.textContent);
          });
        });
        // Deckungsprüfung: welche Bedingungsverweise führt der AHB für diese Prüf-ID,
        // und welche davon sind im Formular tatsächlich erreichbar?
        const nummernAus = t => (String(t || '').match(/\[([0-9]{1,4}|UB[0-9]+|[0-9]+P[0-9.]+)\]/g) || []);
        const sichtbar = new Set();
        spans.forEach(sp => nummernAus(sp.textContent).forEach(n => sichtbar.add(n)));

        // Segmente, die die Engine bewusst nicht als Eingabeblock rendert
        const OHNE_BLOCK = ['UNH', 'UNS', 'UNB', 'CTA', 'COM'];
        const erwartet = new Set();
        // Die kuratierten UTILMD-Masken zeigen bewusst eine Auswahl der AHB-Struktur;
        // Erwartungsmaßstab ist dort die kuratierte Regel, sonst die Formular-Meta.
        // (Seit der Konsolidierung ist _form-meta.js auf beiden Seitenarten geladen.)
        const kuratiert = typeof ahbRulesByPrufId !== 'undefined' && ahbRulesByPrufId[pid];
        const meta = kuratiert ? null
                   : (typeof formMeta !== 'undefined' && formMeta[pid]) ? formMeta[pid]
                   : (typeof msconsFormMeta !== 'undefined' && msconsFormMeta[pid]) ? msconsFormMeta[pid]
                   : null;
        if (meta) {
          meta.instanzen.forEach(i => {
            if (OHNE_BLOCK.indexOf(i.seg) >= 0) return;
            const q3035 = (i.des.find(d => d.de === '3035') || {}).codes || [];
            if (i.seg === 'NAD' && q3035.length && (q3035[0][0] === 'MS' || q3035[0][0] === 'MR')) return;
            const q1153 = (i.des.find(d => d.de === '1153') || {}).codes || [];
            if (i.seg === 'RFF' && q1153.length && q1153[0][0] === 'Z13') return;
            nummernAus(i.expr).forEach(n => erwartet.add(n));
            nummernAus(i.sgExpr).forEach(n => erwartet.add(n));
            i.des.forEach(d => {
              nummernAus(d.expr).forEach(n => erwartet.add(n));
              (d.codes || []).forEach(c => nummernAus(c[2]).forEach(n => erwartet.add(n)));
            });
          });
        } else if (typeof ahbRulesByPrufId !== 'undefined' && ahbRulesByPrufId[pid]) {
          ahbRulesByPrufId[pid].segments.forEach(seg => {
            nummernAus(seg.ahbExpr).forEach(n => erwartet.add(n));
            (seg.bedingungen || []).forEach(nr => erwartet.add('[' + nr + ']'));
          });
        }
        const nichtErreichbar = Array.from(erwartet).filter(n => !sichtbar.has(n));

        return { ausdruecke: relevant.length, mitSymbol: mit.length, ohneSymbol: ohne, verweise, fehlend,
                 erwartet: erwartet.size, nichtErreichbar };
      }, [pruefi, selectId]);

      ausdruecke += ergebnis.ausdruecke;
      mitSymbol += ergebnis.mitSymbol;
      verweise += ergebnis.verweise;
      ohneText += ergebnis.fehlend.length;

      if (ergebnis.ausdruecke === 0 && ergebnis.erwartet > 0)
        fehler.push(`${seite} ${pruefi}: kein einziger Bedingungsausdruck sichtbar, obwohl der AHB ${ergebnis.erwartet} führt`);
      if (ergebnis.ohneSymbol.length)
        fehler.push(`${seite} ${pruefi}: ${ergebnis.ohneSymbol.length} Ausdruck/Ausdrücke ohne Symbol, z. B. "${ergebnis.ohneSymbol[0]}"`);
      if (ergebnis.fehlend.length)
        fehler.push(`${seite} ${pruefi}: ${ergebnis.fehlend.length} Verweis(e) ohne Klartext, z. B. ${ergebnis.fehlend.slice(0, 5).join(' ')}`);
      erwartet += ergebnis.erwartet;
      if (ergebnis.nichtErreichbar.length) {
        nichtErreichbar += ergebnis.nichtErreichbar.length;
        fehler.push(`${seite} ${pruefi}: ${ergebnis.nichtErreichbar.length} Bedingung(en) im AHB, aber nicht im Formular erreichbar: ${ergebnis.nichtErreichbar.slice(0, 6).join(' ')}`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log(`\nBEDINGUNGS-HILFE: ${geprueft} Prüf-IDs auf ${AUSWAHL.length} Seiten`);
  console.log(`  Bedingungsausdrücke sichtbar: ${ausdruecke}`);
  console.log(`  davon mit Hilfesymbol:        ${mitSymbol}`);
  console.log(`  aufgelöste Verweise:          ${verweise}  (ohne Klartext: ${ohneText})`);
  console.log(`  Bedingungen laut AHB:         ${erwartet}  (nicht erreichbar: ${nichtErreichbar})`);
  if (fehler.length) {
    console.log('\nAUFFÄLLIG:');
    fehler.slice(0, 20).forEach(f => console.log(' -', f));
    if (fehler.length > 20) console.log(`   … und ${fehler.length - 20} weitere`);
  }
  process.exit(fehler.length ? 1 : 0);
})();
