// _engine/utilmd-maske.js
// ------------------------------------------------------------------
// Kuratierte UTILMD-Maske als SICHT auf die zentrale Formular-Engine.
//
// Ergebnis des Feldauswahl-Umbaus (Phase 2, Protokoll Abschnitte 38-40):
// Die Feldauswahl (WELCHE Felder die Maske zeigt, Reihenfolge, Beschriftung)
// kommt als reine Datenschicht aus pruef-ids/_regeln.js; die Prüfgrundlage
// (Segmentinstanzen, Codelisten, Bedingungen) ist die Formular-Meta
// (pruef-ids/_form-meta.js). Dieses Modul ordnet jedes kuratierte Feld einer
// Instanz der Meta zu und meldet die Zuordnung der Engine
// (AhbFormEngine.setzeSicht). Die ERZEUGUNG der Nachricht übernimmt
// ausschließlich die Engine (_engine/ahb-form-engine.js) - derselbe Weg wie im
// Vollformular. Den früheren eigenen Erzeugungsweg (generator.js) gibt es
// nicht mehr.
//
// Erwartete Seiten-Daten: formatConfig, formMeta, prozessMeta,
// ahbRulesByPrufId, optional nutzdatenKatalog und die Produktpaket-Module.
// Erwartete DOM-IDs: prufId, dynamicForm, edifactOutput, errorBox, lineBreaks.
// ------------------------------------------------------------------
(function (global) {
    "use strict";

    const $ = id => document.getElementById(id);

    // Vorgangsnummer (SG4 IDE DE7402, an..35): <Präfix><DAR>, bei mehreren Vorgängen
    // "-<lfd. Nr.>". Derselbe Aufbau gilt in der zentralen Engine -
    // scripts/test_vorgangsnummer.js hält beide Stellen zusammen.
    const VORGANG_PRAEFIX = "EDIGEN{";
    function vorgangsNummer(dar, lfd) {
        const n = Number(lfd) || 1;
        return `${VORGANG_PRAEFIX}${dar}${n > 1 ? "-" + String(n).padStart(2, "0") : ""}`;
    }

    const FORMAT_DEFAULT = { sparte: 'STROM', unhKennung: 'UTILMD:D:11A:UN:S2.2' };
    function fmt() { return (typeof formatConfig !== 'undefined') ? formatConfig : FORMAT_DEFAULT; }

    // Ausstellende Codevergabestelle je MP-ID (Regeln aus _format.js -> codevergabe).
    function codevergabeStelle(mpId) {
        const id = String(mpId || "").trim();
        const regeln = Array.isArray(fmt().codevergabe) ? fmt().codevergabe
            : [{ prefix: "99", unb: "500", nad: "293", name: "BDEW" },
               { prefix: "4", unb: "14", nad: "9", name: "GS1" }];
        for (const r of regeln) if (id.startsWith(r.prefix)) return r;
        return regeln[0];
    }

    function isoZuDe(iso) {
        const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return m ? `${m[3]}.${m[2]}.${m[1]}` : (iso || "");
    }

    // ---- Meta-Zugriff ------------------------------------------------------
    function metaVon(prufId) {
        return (typeof formMeta !== 'undefined' && formMeta[prufId]) ? formMeta[prufId] : null;
    }
    function deCodes(inst, de) {
        const alle = [];
        (inst.des || []).forEach(d => {
            if (d.de === de) (d.codes || []).forEach(c => alle.push(Array.isArray(c) ? c[0] : c));
        });
        return alle;
    }
    function hatCode(inst, de, code) { return deCodes(inst, de).indexOf(code) >= 0; }
    function deIdx(inst, de) { return (inst.des || []).findIndex(d => d.de === de); }

    // Qualitäten des Verwendungszeitraums (SG6 RFF DE1153) - wie in der Engine.
    const ZEITRAUM_CODES = ["Z47", "Z48", "Z49", "Z53", "Z54", "Z55"];

    // ---- Zustand des aktuellen Formulars -----------------------------------
    let Z = null;   // Zuordnung: { prufId, meta, kopf, pos, felder, stille, ebdJeCode, ... }

    // Instanzlisten mit Pfaden (kopf: k_<j>, eine Position: p1_<j>).
    function instanzPfade(meta) {
        const t = global.AhbFormEngine.teile(meta);
        const liste = [];
        t.kopf.forEach((inst, j) => liste.push({ inst, pfad: `k_${j}`, j, bereich: 'k' }));
        t.pos.forEach((inst, j) => liste.push({ inst, pfad: `p1_${j}`, j, bereich: 'p' }));
        t.schluss.forEach((inst, j) => liste.push({ inst, pfad: `s_${j}`, j, bereich: 's' }));
        return { liste, hatPos: t.pos.length > 0, pos: t.pos, kopf: t.kopf };
    }

    function sucheInstanz(liste, pred) { return liste.find(e => pred(e.inst)) || null; }

    // ---- Zuordnung Regel-Feld -> Meta-Instanzfeld --------------------------
    // Liefert je Regel einen Eintrag { regel, e (Instanz+Pfad), k (DE-Index), typ, … }
    // oder null (rein informative Felder wie UNH).
    function ordneRegelZu(regel, ip, prufId) {
        const id = regel.id;
        const L = ip.liste;
        let m;

        if (id === 'UNH') return { regel, typ: 'unh' };
        if (id === 'BGM') {
            const e = sucheInstanz(L, i => i.seg === 'BGM');
            return e ? { regel, e, k: deIdx(e.inst, '1004'), typ: 'text' } : null;
        }
        if (id === 'NAD_MS' || id === 'NAD_MR')
            return { regel, typ: 'mpid' };
        if (id === 'IDE') {
            // Das kuratierte Vorgangsfeld meint IDE+24 (Vorgangsnummer der Transaktion);
            // weitere IDE-Instanzen (z. B. IDE+Z01 der Listenübersicht) laufen automatisch.
            const e = sucheInstanz(L, i => i.seg === 'IDE' && hatCode(i, '7495', '24'))
                || sucheInstanz(L, i => i.seg === 'IDE');
            return e ? { regel, e, k: deIdx(e.inst, '7402'), typ: 'text' } : null;
        }
        if (id === 'FTX') {
            const e = sucheInstanz(L, i => i.seg === 'FTX');
            return e ? { regel, e, k: deIdx(e.inst, '4440'), typ: 'text' } : null;
        }
        if ((m = id.match(/^RFF_VZ_QUALITAET(_2)?$/))) {
            const e = sucheInstanz(L, i => i.seg === 'RFF'
                && deCodes(i, '1153').some(c => ZEITRAUM_CODES.indexOf(c) >= 0));
            return e ? { regel, e, k: deIdx(e.inst, '1153'), typ: 'select', wdh2: !!m[1] } : null;
        }
        if ((m = id.match(/^DTM_(.+?)(_2)?$/))) {
            const q = m[1];
            const e = sucheInstanz(L, i => i.seg === 'DTM' && hatCode(i, '2005', q));
            return e ? { regel, e, k: deIdx(e.inst, '2380'), typ: 'datum', wdh2: !!m[2], q,
                         stillQualifier: deCodes(e.inst, '2005').length > 1 ? { de: '2005', code: q } : null } : null;
        }
        if ((m = id.match(/^NAD_(.+)$/))) {
            const e = sucheInstanz(L, i => i.seg === 'NAD' && hatCode(i, '3035', m[1]));
            return e ? { regel, e, k: deIdx(e.inst, '3039'), typ: 'text' } : null;
        }
        if ((m = id.match(/^LOC_(.+)$/))) {
            const e = sucheInstanz(L, i => i.seg === 'LOC' && hatCode(i, '3227', m[1]));
            return e ? { regel, e, k: deIdx(e.inst, '3225'), typ: 'text', q: m[1],
                         stillQualifier: deCodes(e.inst, '3227').length > 1 ? { de: '3227', code: m[1] } : null } : null;
        }
        if (id === 'STS_E01') {
            const e = sucheInstanz(L, i => i.seg === 'STS' && hatCode(i, '9015', 'E01'));
            if (!e) return null;
            // Antwortcode = das DE9013 der Gruppe C556 (mit oder ohne AHB-Codeliste).
            const k = (e.inst.des || []).findIndex(d => d.de === '9013');
            return { regel, e, k, typ: 'antwort' };
        }
        if ((m = id.match(/^STS_7(_grund|_befristet)?$/))) {
            const e = sucheInstanz(L, i => i.seg === 'STS' && hatCode(i, '9015', '7'));
            if (!e) return null;
            // Stellen der wiederholten Gruppe C556 (DE9013): Grund / Ergänzung / befristet.
            const treffer = [];
            (e.inst.des || []).forEach((d, k) => { if (d.de === '9013') treffer.push(k); });
            if (!treffer.length) return null;
            let k;
            if (m[1] === '_grund') k = treffer[0];
            else if (m[1] === '_befristet') k = treffer[2] !== undefined ? treffer[2] : treffer[treffer.length - 1];
            else {
                // "STS_7" ist die Ergänzung (2. C556); führt der AHB nur eine C556,
                // trägt das Feld den Grund. Maßgeblich ist, wo die kuratierten
                // Optionscodes in der Meta stehen.
                const optCodes = (regel.options || []).map(o => o.v).filter(Boolean);
                k = treffer.find(kk => {
                    const codes = (e.inst.des[kk].codes || []).map(c => c[0]);
                    return optCodes.some(c => codes.indexOf(c) >= 0);
                });
                if (k === undefined) k = treffer[1] !== undefined ? treffer[1] : treffer[0];
            }
            return { regel, e, k, typ: 'select', sts7Art: m[1] || '' };
        }
        if ((m = id.match(/^RFF_(.+?)(_2)?$/))) {
            const e = sucheInstanz(L, i => i.seg === 'RFF' && hatCode(i, '1153', m[1]));
            if (!e) return null;
            // Verwendungszeitraum-Instanzen bedient das Qualitäts-Auswahlfeld
            // (RFF_VZ_QUALITAET) - eine zweite Regel darauf wäre doppelt.
            if (deCodes(e.inst, '1153').some(c => ZEITRAUM_CODES.indexOf(c) >= 0)) return null;
            const k = deIdx(e.inst, '1154');
            // Führt der AHB am Qualifier mehrere Codes (z. B. RFF Z31/Z39), trägt die
            // Feldauswahl den konkreten Qualifier als stillen Wert bei.
            return { regel, e, k, typ: 'text', wdh2: !!m[2], q: m[1],
                     stillQualifier: (k >= 0 && deCodes(e.inst, '1153').length > 1) ? { de: '1153', code: m[1] } : null };
        }
        if ((m = id.match(/^SEQ_(.+)$/))) {
            const e = sucheInstanz(L, i => i.seg === 'SEQ' && hatCode(i, '1229', m[1]));
            return e ? { regel, e, k: -1, typ: 'info' } : null;
        }
        if ((m = id.match(/^CCI_(.+)$/))) {
            const e = sucheInstanz(L, i => i.seg === 'CCI'
                && (hatCode(i, '7037', m[1]) || hatCode(i, '7059', m[1])));
            if (!e) return null;
            const k7037 = deIdx(e.inst, '7037');
            const mehrere = k7037 >= 0 && ((e.inst.des[k7037].codes || []).length > 1);
            return { regel, e, k: mehrere ? k7037 : -1, typ: mehrere ? 'select' : 'info' };
        }
        return null;
    }

    // ---- Formular-Aufbau ---------------------------------------------------
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // AHB-Ausdruck eines Feldes aus der Meta (Gruppe · Segment · Datenelement) -
    // daran hängt die Bedingungs-Hilfe ihr Fragezeichen-Symbol (.expr-Span).
    function exprText(eintrag) {
        if (!eintrag.e) return '';
        const inst = eintrag.e.inst;
        const teile = [];
        if (inst.sgExpr && inst.sgExpr !== inst.expr && /\[|[∧∨⊻⊕]/.test(inst.sgExpr))
            teile.push(`${inst.sg || 'SG'}: ${inst.sgExpr}`);
        if (inst.expr && inst.expr.trim() !== 'Muss') teile.push(inst.expr.trim());
        const deE = eintrag.k >= 0 ? inst.des[eintrag.k] : null;
        if (deE && deE.expr && /\[|[∧∨⊻⊕]/.test(deE.expr)) teile.push(deE.expr.trim());
        // Zusätzlich am Regel-Eintrag vermerkte Bedingungsnummern, deren Klartext
        // sonst unerreichbar bliebe.
        (eintrag.regel.bedingungen || []).forEach(nr => {
            if (teile.join(' ').indexOf('[' + nr + ']') < 0) teile.push('[' + nr + ']');
        });
        const ausdruck = eintrag.regel.ahbExpr && !teile.length ? eintrag.regel.ahbExpr : teile.join(' · ');
        return ausdruck ? ` <span class="expr">${esc(ausdruck)}</span>` : '';
    }

    function feldHtml(eintrag, domId, vorbelegung) {
        const r = eintrag.regel;
        let html = `<label for="${domId}">${esc(r.name)}${exprText(eintrag)}</label>`;
        if (eintrag.typ === 'datum') {
            html += `<span class="dtm-feld">`
                + `<input type="text" id="${domId}" value="${esc(vorbelegung || '')}" `
                + `placeholder="TT.MM.JJJJ" pattern="\\d{2}\\.\\d{2}\\.\\d{4}" `
                + `inputmode="numeric" oninput="generateEdifact()">`
                + `<button type="button" class="dtm-kalender-btn" title="Kalender öffnen" `
                + `onclick="EdiKalender('${domId}','date')">&#128197;</button>`
                + `</span>`
                + `<div class="hint dtm-utc" id="${domId}_utc"></div>`;
        } else if (eintrag.typ === 'select') {
            html += `<select id="${domId}" onchange="generateEdifact()">${eintrag.optHtml || ''}</select>`;
        } else if (eintrag.typ === 'antwort') {
            html += eintrag.antwortHtml;
        } else if (eintrag.typ === 'unh' || eintrag.typ === 'info') {
            html += `<input type="text" id="${domId}" value="${esc(vorbelegung || '')}" readonly `
                + `style="background-color:var(--readonly-bg); color:var(--readonly-text);">`;
        } else {
            let ph = '';
            if (r.id === 'LOC_Z16') ph = ' placeholder="ID der Marktlokation (11-stellig)..."';
            else if (r.id === 'LOC_Z21') ph = ' placeholder="ID der Tranche..."';
            else if (r.id === 'FTX') ph = ' placeholder="Freitext / Bemerkung (optional)..."';
            else if (r.id === 'RFF_TN') ph = ' placeholder="Vorgangsnummer aus Anfrage..."';
            else if (eintrag.typ === 'mpid') ph = ` placeholder="${esc(eintrag.platzhalter || 'MP-ID (13-stellig)...')}"`;
            html += `<input type="text" id="${domId}" value="${esc(vorbelegung || '')}"${ph} oninput="generateEdifact()">`;
        }
        if (r.rule) html += `<div class="hint">Regelhinweis: ${esc(r.rule)}</div>`;
        return html;
    }

    // Auswahlliste aus Meta-Codes eines Datenelements.
    function optionenAusMeta(inst, k, vorgabe, leerErlaubt) {
        const codes = (inst.des[k].codes || []);
        let html = leerErlaubt ? `<option value="">– keine Angabe –</option>` : '';
        codes.forEach(c => {
            const code = Array.isArray(c) ? c[0] : c;
            const name = Array.isArray(c) && c[1] ? ` - ${c[1].slice(0, 60)}` : '';
            html += `<option value="${esc(code)}"${code === vorgabe ? ' selected' : ''}>${esc(code + name)}</option>`;
        });
        return html;
    }

    // Optionsliste der Antwortcode-Auswahl: Code und zugehörige EBD-Nummer als Paar
    // im Optionswert - derselbe Code kann in mehreren EBD einer Prüf-ID vorkommen.
    function baueAntwortOptionen(a) {
        let html = '', vorgabeCode = '', vorgabePaar = '';
        const paare = [];
        a.optionen.forEach(o => {
            const code = o.code || String(o.v).split(':')[0];
            const ebd = o.ebd || String(o.v).split(':')[1] || '';
            const paar = ebd ? `${code}:${ebd}` : code;
            const gewaehlt = (o.v === a.vorgabe || code === a.vorgabe);
            if (gewaehlt) { vorgabeCode = code; vorgabePaar = paar; }
            paare.push(paar);
            html += `<option value="${esc(paar)}"${gewaehlt ? ' selected' : ''}>${esc(o.t)}</option>`;
        });
        return { html, vorgabeCode, vorgabePaar, paare };
    }

    // Antwortcode-Auswahl bei geändertem Geschäftsvorfall nachführen: Welche Codes
    // ein Entscheidungsbaum erreichen kann, hängt z. B. an der gemeldeten
    // Lokationsart (STS+7-Ergänzung). Der Kontext wird über die Engine gelesen
    // (die Sicht-Zuordnung muss dafür bereits gesetzt sein).
    function aktualisiereAntwortAuswahl() {
        const f = Z.felder.find(x => x.typ === 'antwort');
        if (!f) return;
        const kennung = JSON.stringify(global.AhbFormEngine.ebdKontext());
        if (kennung === Z.letzterEbdKontext) return;
        Z.letzterEbdKontext = kennung;
        const a = antwortAuswahl(Z.prufId, f.e);
        const sel = $(f.domId);
        if (!a || !sel) return;
        const alt = String(sel.value);
        const gebaut = baueAntwortOptionen(a);
        sel.innerHTML = gebaut.html;
        sel.value = gebaut.paare.indexOf(alt) >= 0 ? alt : gebaut.vorgabePaar;
    }

    // Antwortcode-Auswahl (EBD) - dieselbe Quelle wie Engine und Vollformular.
    function antwortAuswahl(prufId, e) {
        const A = global.EdiAntwortcodes || (typeof EdiAntwortcodes !== 'undefined' ? EdiAntwortcodes : null);
        const meta = (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null;
        if (!A || !meta || meta.art === 'anfrage') return null;
        let ebds = deCodes(e.inst, '1131').filter(c => /^(E|S|G|GS)_\d{3,4}$/.test(c));
        if (!ebds.length && meta.ebd) ebds = [meta.ebd];
        const cluster = meta.antwortcluster === 'ablehnung' ? 'Ablehnung'
            : (meta.antwortcluster === 'zustimmung' ? 'Zustimmung' : '');
        const stand = fmt().stand || '';
        const kontext = global.AhbFormEngine.ebdKontext();
        const a = A.auswahl(ebds, cluster, meta.antwortcode, stand, kontext);
        return (a && a.optionen.length) ? a : null;
    }

    // ---- stille Vorbelegungen (versteckte Felder) --------------------------
    // Werte, die die Maske nicht als Eingabefeld zeigt, aber laut AHB/Prozesswissen
    // in der Nachricht stehen (Transaktionsgrund ohne eigenes Feld, Zeitraum-IDs,
    // Nutzdaten-Objektwerte, EBD-Nummer der Antwort). Sie werden als versteckte
    // Eingaben gerendert und der Engine über die Alias-Zuordnung gemeldet.
    function stillHtml(domId, wert) {
        return `<input type="hidden" id="${domId}" value="${esc(wert)}">`;
    }

    // ---- Nutzdaten (SG8/SG10, Objektdaten) ---------------------------------
    // Datenquelle wie bisher: rule.nutzdaten der Prüf-ID, sonst - für Anfragen -
    // der zentrale Objekt-Katalog je Transaktionsgrund. Gefiltert wird gegen die
    // Meta (nur AHB-geführte Objektcodes/Merkmale/Werte, Muster E3).
    function nutzGruppenFuer(prufId, regeln, meta) {
        const pm = (typeof prozessMeta !== 'undefined' && prozessMeta[prufId]) ? prozessMeta[prufId] : {};
        let gruppen = Array.isArray(regeln.nutzdaten) ? regeln.nutzdaten : null;
        if (!gruppen && pm.art === 'anfrage' && typeof nutzdatenKatalog !== 'undefined')
            gruppen = nutzdatenKatalog[pm.transaktionsgrund] || null;
        return gruppen || null;
    }

    // ---- Formular rendern --------------------------------------------------
    function renderForm() {
        const sel = $('prufId'), container = $('dynamicForm');
        if (!sel || !container) return;   // Seite (noch) ohne Formular-Grundgerüst
        const prufId = sel.value;
        const regeln = (typeof ahbRulesByPrufId !== 'undefined') ? ahbRulesByPrufId[prufId] : null;
        const meta = metaVon(prufId);
        container.innerHTML = '';
        Z = null;
        if (!regeln || !meta) {
            container.innerHTML = `<div class="error-box" style="display:block;">Für Prüf-ID ${esc(prufId)} `
                + `liegen keine Felddaten (pruef-ids/_regeln.js) oder keine Prüfgrundlage `
                + `(pruef-ids/_form-meta.js) vor.</div>`;
            const aus = $('edifactOutput'); if (aus) aus.value = '';
            return;
        }

        const E = global.AhbFormEngine;
        E.konfiguriere({
            formatConfig: fmt(),
            darPrefix: "EDIGEN",
            posSgRegex: /^SG([4-9]|1[0-2])$/,
            testmodus: true,
            makoDatum: true,
            ids: { ediOut: 'edifactOutput', absender: 'NAD_MS', empfaenger: 'NAD_MR' },
        });
        E.setzeSicht(null);
        E.setzeKontext(prufId, meta);
        const dar = E.neueReferenz();
        const pm = (typeof prozessMeta !== 'undefined' && prozessMeta[prufId]) ? prozessMeta[prufId] : {};
        const ip = instanzPfade(meta);

        Z = {
            prufId, meta, ip, dar,
            felder: [],          // { regel, e, k, typ, domId, wdh2 }
            stille: [],          // { pfadKey, domId, wert }
            ebdJeCode: {},       // Antwortcode -> EBD-Nummer (für die EBD-Nachführung)
            wdh2Felder: [],      // DOM-IDs der Felder der 2. Zeitraum-Wiederholung
            benutztePfade: new Set(),   // Instanz-Pfade mit Feld oder Vorbelegung
            zusatzNachPfad: {},  // pfad -> Funktion(ctx) für Zusatzsegmente (Produktpaket)
        };

        // MP-ID-Vorbelegung je Sparte; an die Codevergabestellen des AHB gekoppelt
        // (Muster E6): Erlaubt der AHB die Sparten-Vorgabe nicht (nur 9 = GS1),
        // wird eine gültige Beispiel-GLN vorbelegt.
        const mpDefaults = {
            NAD_MS: fmt().defaultAbsender || "9900000000001",
            NAD_MR: fmt().defaultEmpfanger || "9900000000002",
        };
        [['MS', 'NAD_MS', '4012345000009'], ['MR', 'NAD_MR', '4012345000016']].forEach(([rolle, feld, gln]) => {
            const e = sucheInstanz(ip.liste, i => i.seg === 'NAD' && hatCode(i, '3035', rolle));
            if (!e) return;
            const codes = deCodes(e.inst, '3055');
            if (codes.length && codes.indexOf(codevergabeStelle(mpDefaults[feld]).nad) < 0 && codes.indexOf('9') >= 0)
                mpDefaults[feld] = gln;
        });
        Z.mpVorschlag = mpDefaults;   // Beispiel-IDs für Platzhalter und Test-Läufe

        const heute = isoZuDe(new Date().toISOString().split('T')[0]);

        let html = '';
        (regeln.segments || []).forEach((r, idx) => {
            const eintrag = ordneRegelZu(r, ip, prufId);
            if (!eintrag) return;   // Feld ohne Grundlage in der Meta - nicht anbieten
            const domId = r.id;
            eintrag.domId = domId;
            if (eintrag.typ === 'mpid')
                eintrag.platzhalter = `MP-ID ${r.id === 'NAD_MS' ? 'Absender' : 'Empfänger'}, `
                    + `13-stellig – z. B. ${mpDefaults[r.id]} ...`;

            // Vorbelegung und Optionslisten je Feldtyp
            let vorbelegung = '';
            if (r.id === 'UNH') vorbelegung = `Referenz: ${dar} | ${fmt().unhKennung}`;
            else if (r.id === 'BGM') vorbelegung = dar;
            // MP-IDs werden NICHT mehr vorbelegt: Test-Empfangssysteme prüfen auf
            // angelegte Marktpartnercodes (sonst negative CONTRL, Code 23) — hier
            // gehören die echten Test-MP-IDs hinein. Der Platzhalter zeigt das
            // sparten-/AHB-gerechte Beispiel (E6-Logik) nur noch als Hinweis.
            else if (r.id === 'IDE') vorbelegung = vorgangsNummer(dar, 1);
            else if (r.id === 'DTM_137') vorbelegung = heute;
            else if (r.id === 'RFF_TN') vorbelegung = 'REF' + Math.floor(100000 + Math.random() * 900000);
            else if (r.id === 'FTX' && pm.art === 'ablehnung') vorbelegung = 'Ablehnung - Begruendung (Beispiel)';
            else if (eintrag.typ === 'info') vorbelegung = `${r.name.split(':')[0]} (automatisch)`;

            if (eintrag.typ === 'select') {
                // Felder der 2. Zeitraum-Wiederholung sind stets optional - die
                // Wiederholung entsteht nur bei bewusster Eingabe.
                const leerErlaubt = eintrag.sts7Art === '_befristet' || eintrag.wdh2
                    || !/^Muss/.test(r.status || '');
                let vorgabe = '';
                if (eintrag.sts7Art === '_grund') vorgabe = pm.transaktionsgrund || '';
                else if (eintrag.sts7Art === '') {
                    const codes = (eintrag.e.inst.des[eintrag.k].codes || []).map(c => c[0]);
                    // Trägt das Feld den Grund (einzige C556), gilt der Prozess-Grund;
                    // sonst die bevorzugte Ergänzung (ZW4/ZW3/ZW5-Logik der Engine).
                    vorgabe = (pm.transaktionsgrund && codes.indexOf(pm.transaktionsgrund) >= 0)
                        ? pm.transaktionsgrund
                        : E.bevorzugteErgaenzung(codes, regeln.bezeichnung || '');
                } else if (eintrag.k >= 0 && eintrag.e.inst.des[eintrag.k].de === '1153' && !eintrag.wdh2) {
                    // Qualität des Verwendungszeitraums: Vorgabe Z49 („Gültige Daten"),
                    // sonst die erste im AHB geführte Qualität. Die 2. Wiederholung
                    // bleibt ohne Vorgabe — sie entsteht nur bei bewusster Eingabe.
                    const codes = (eintrag.e.inst.des[eintrag.k].codes || []).map(c => c[0]);
                    vorgabe = codes.indexOf('Z49') >= 0 ? 'Z49' : (codes[0] || '');
                }
                eintrag.optHtml = optionenAusMeta(eintrag.e.inst, eintrag.k,
                    eintrag.sts7Art === '_befristet' ? '' : vorgabe, leerErlaubt);
            }
            if (eintrag.typ === 'antwort') {
                const a = antwortAuswahl(prufId, eintrag.e);
                if (a) {
                    const gebaut = baueAntwortOptionen(a);
                    eintrag.vorgabeCode = gebaut.vorgabeCode;
                    eintrag.antwortHtml = `<select id="${domId}" onchange="generateEdifact()">${gebaut.html}</select>`
                        + (a.hinweis ? `<div class="hint">${esc(a.hinweis)}</div>` : '');
                } else {
                    const info = pm.antwortcode ? `${pm.antwortcode}${pm.ebd ? ' (' + pm.ebd + ')' : ''}` : 'automatisch';
                    eintrag.typ = 'info';
                    vorbelegung = info;
                }
            }

            const div = `<div class="form-group status-${esc(r.status || 'Kann')}"`
                + (r.abhaengig ? ` data-abhaengig-feld="${esc(r.abhaengig.feld)}"`
                    + ` data-abhaengig-code="${esc(r.abhaengig.code)}"`
                    + ` data-abhaengig-negiert="${r.abhaengig.negiert ? '1' : '0'}"` : '')
                + `>${feldHtml(eintrag, domId, vorbelegung)}`
                + (r.abhaengig ? `<div class="hint">Gilt, wenn ${esc(r.abhaengig.feld)} den Code `
                    + `<code>${esc(r.abhaengig.code)}</code> ${r.abhaengig.negiert ? 'nicht enthält' : 'enthält'}`
                    + ` (Bedingung [${esc(r.abhaengig.bedingung || '')}]).</div>` : '')
                + `</div>`;
            html += div;

            if (eintrag.wdh2) Z.wdh2Felder.push(domId);
            if (eintrag.e) Z.benutztePfade.add(eintrag.e.pfad);
            // Konkreten Qualifier still beitragen, wenn der AHB am Qualifier-DE
            // mehrere Codes führt (das Feld adressiert genau einen davon).
            if (eintrag.e && eintrag.stillQualifier) {
                const kQ = deIdx(eintrag.e.inst, eintrag.stillQualifier.de);
                if (kQ >= 0) {
                    const basis = eintrag.wdh2 ? `p1w2_${eintrag.e.j}` : eintrag.e.pfad;
                    const qId = `still_q_${domId}`;
                    Z.stille.push({ pfadKey: `${basis}_${kQ}`, domId: qId });
                    html += stillHtml(qId, eintrag.stillQualifier.code);
                }
            }
            Z.felder.push(eintrag);
        });

        // ---- stille Vorbelegungen ergänzen ---------------------------------
        html += baueStilleVorbelegungen(prufId, regeln, meta, ip, pm, dar);

        container.innerHTML = html;

        // Produktpaket-Block (SG8 SEQ+Z79/PIA/CCI/CAV …) nur für die Anmeldung
        // verbrauchende MaLo (55001) - eigener dynamischer Container wie bisher.
        if (prufId === '55001' && typeof renderProduktpaket === 'function') {
            const ppWrap = document.createElement('div');
            ppWrap.id = 'produktpaketContainer';
            container.appendChild(ppWrap);
            if (typeof initProduktpaketState === 'function' && !produktpaketState) initProduktpaketState();
            renderProduktpaket(ppWrap);
        }

        aktualisiereAbhaengigkeiten();
        generateEdifact();
    }

    // Stille Vorbelegungen als verstecktes HTML; registriert Alias-Ziele in Z.stille.
    function baueStilleVorbelegungen(prufId, regeln, meta, ip, pm, dar) {
        let html = '';
        let n = 0;
        const still = (e, k, wert) => {
            if (k < 0 || wert === undefined || wert === null || wert === '') return;
            const domId = `still_${prufId}_${n++}`;
            Z.stille.push({ pfadKey: `${e.pfad}_${k}`, domId });
            Z.benutztePfade.add(e.pfad);
            html += stillHtml(domId, wert);
        };

        // BGM-Dokumentenname (DE1001): AHB vor Prozess-Meta (Muster E7).
        const bgmE = sucheInstanz(ip.liste, i => i.seg === 'BGM');
        if (bgmE) {
            const codes = deCodes(bgmE.inst, '1001');
            if (codes.length > 1)
                still(bgmE, deIdx(bgmE.inst, '1001'), codes.indexOf(pm.bgm) >= 0 ? pm.bgm : codes[0]);
        }

        // Transaktionsgrund ohne eigenes Feld (STS+7, 1. C556 mehrcodiert).
        const stsE = sucheInstanz(ip.liste, i => i.seg === 'STS' && hatCode(i, '9015', '7'));
        if (stsE) {
            const hatGrundFeld = Z.felder.some(f => f.e === stsE && (f.sts7Art === '_grund'
                || (f.sts7Art === '' && (stsE.inst.des[f.k].codes || []).some(c => c[0] === pm.transaktionsgrund))));
            const treffer = [];
            (stsE.inst.des || []).forEach((d, k) => { if (d.de === '9013') treffer.push(k); });
            const kGrund = treffer[0];
            const belegt = Z.felder.some(f => f.e === stsE && f.k === kGrund);
            if (kGrund !== undefined && !belegt && !hatGrundFeld) {
                const codes = (stsE.inst.des[kGrund].codes || []).map(c => c[0]);
                if (codes.length > 1)
                    still(stsE, kGrund, codes.indexOf(pm.transaktionsgrund) >= 0 ? pm.transaktionsgrund : codes[0]);
            }
        }

        // Verwendungszeitraum: Zeitraum-IDs (DE1156) fortlaufend ([126]); die Antwort
        // referenziert die Zeitraum-ID in STS+E01 (DE9012). Ohne eigenes Auswahlfeld
        // entsteht die Gruppe nur, wo der AHB sie als Muss führt.
        const vzFeldDa = Z.felder.some(f => f.k >= 0 && f.e && f.e.inst.seg === 'RFF'
            && (f.e.inst.des[f.k] || {}).de === '1153' && !f.wdh2);
        const vzE = sucheInstanz(ip.liste, i => i.seg === 'RFF'
            && deCodes(i, '1153').some(c => ZEITRAUM_CODES.indexOf(c) >= 0)
            && (vzFeldDa || /^Muss\s*$/.test(i.expr || '')));
        if (vzE) {
            still(vzE, deIdx(vzE.inst, '1156'), '1');
            const stsAntwortE = sucheInstanz(ip.liste, i => i.seg === 'STS' && hatCode(i, '9015', 'E01'));
            if (stsAntwortE) still(stsAntwortE, deIdx(stsAntwortE.inst, '9012'), '1');
            // 2. Wiederholung: Zeitraum-ID 2 (nur wirksam, wenn deren Felder befüllt sind).
            const k1156 = deIdx(vzE.inst, '1156');
            if (k1156 >= 0) {
                const domId = `still_${prufId}_w2_1156`;
                Z.stille.push({ pfadKey: `p1w2_${vzE.j}_${k1156}`, domId });
                html += stillHtml(domId, '2');
            }
        }

        // Ablehnungsbegründung ohne eigenes FTX-Feld: Bei Ablehnungen verlangt der
        // AHB eine Begründung im Freitext ([23]) - Beispieltext, sofern der AHB der
        // Prüf-ID ein FTX führt (bisheriges Maskenverhalten).
        if (pm.art === 'ablehnung' && !Z.felder.some(f => f.regel.id === 'FTX')) {
            const ftxE = sucheInstanz(ip.liste, i => i.seg === 'FTX');
            if (ftxE) still(ftxE, deIdx(ftxE.inst, '4440'), 'Ablehnung - Begruendung (Beispiel)');
        }

        // Antwortcode und EBD-Nummer (DE9013/DE1131): Das Auswahlfeld trägt das Paar
        // "Code:EBD"; zwei stille Felder liefern die Einzelwerte an die Engine und
        // werden bei jeder Auswahländerung nachgeführt (siehe generateEdifact).
        const antwortFeld = Z.felder.find(f => f.typ === 'antwort');
        if (antwortFeld) {
            const codeId = `still_${prufId}_antwortcode`;
            Z.stille.push({ pfadKey: `${antwortFeld.e.pfad}_${antwortFeld.k}`, domId: codeId });
            Z.antwortCodeStillId = codeId;
            html += stillHtml(codeId, antwortFeld.vorgabeCode || pm.antwortcode || '');
            const k1131 = deIdx(antwortFeld.e.inst, '1131');
            if (k1131 >= 0 && (antwortFeld.e.inst.des[k1131].codes || []).length !== 1) {
                const domId = `still_${prufId}_ebd`;
                Z.stille.push({ pfadKey: `${antwortFeld.e.pfad}_${k1131}`, domId });
                Z.ebdStillId = domId;
                html += stillHtml(domId, pm.ebd || '');
            }
        } else if ((pm.art === 'bestaetigung' || pm.art === 'ablehnung') && pm.antwortcode) {
            // Antwortnachricht ohne Auswahlfeld: Antwortcode/EBD aus der Prozess-Meta.
            const stsAntw = sucheInstanz(ip.liste, i => i.seg === 'STS' && hatCode(i, '9015', 'E01'));
            if (stsAntw) {
                const k9013 = (stsAntw.inst.des || []).findIndex(d => d.de === '9013');
                still(stsAntw, k9013, pm.antwortcode);
                const k1131 = deIdx(stsAntw.inst, '1131');
                if (k1131 >= 0 && (stsAntw.inst.des[k1131].codes || []).length !== 1 && pm.ebd)
                    still(stsAntw, k1131, pm.ebd);
            }
        }

        // ---- Objektdaten (SG8/SG10): Vorbelegung aus Katalog/Regeln ---------
        // Nur Objektgruppen mit Datengrundlage werden erzeugt; alle übrigen
        // Instanzen der Segmentgruppen 8-12 ohne Feld und ohne Vorbelegung
        // unterdrückt die Sicht (bisheriges Maskenverhalten, Muster E3).
        const gruppen = nutzGruppenFuer(prufId, regeln, meta) || [];
        gruppen.forEach(g => {
            const seqE = sucheInstanz(ip.liste, i => i.seg === 'SEQ' && hatCode(i, '1229', g.seq));
            if (!seqE) return;   // Objektcode ohne AHB-Grundlage in dieser Prüf-ID
            Z.benutztePfade.add(seqE.pfad);
            // Instanzen der Objektgruppe: von SEQ bis zur nächsten SEQ-Instanz.
            const gr = gruppeVon(ip, seqE);
            (g.merkmale || []).forEach(mm => {
                // Zuerst in der Objektgruppe des SEQ suchen, sonst PID-weit (der
                // Katalog kennt die Gruppenzuordnung des jeweiligen AHB nicht).
                const cciE = gr.find(x => x.inst.seg === 'CCI' && hatCode(x.inst, '7037', mm.cci))
                    || sucheInstanz(ip.liste, i => i.seg === 'CCI' && hatCode(i, '7037', mm.cci));
                if (!cciE) return;
                Z.benutztePfade.add(cciE.pfad);
                if (deCodes(cciE.inst, '7037').length > 1)
                    still(cciE, deIdx(cciE.inst, '7037'), mm.cci);
                (mm.cav || []).forEach(v => {
                    const cavE = gr.find(x => x.inst.seg === 'CAV' && hatCode(x.inst, '7111', v.code))
                        || sucheInstanz(ip.liste, i => i.seg === 'CAV' && hatCode(i, '7111', v.code));
                    if (!cavE) return;
                    Z.benutztePfade.add(cavE.pfad);
                    if (deCodes(cavE.inst, '7111').length > 1)
                        still(cavE, deIdx(cavE.inst, '7111'), v.code);
                    if (v.wert === undefined) return;
                    // Zugeordnete-Marktpartner-CAV (Muster E4): MP-ID frei im DE1131,
                    // Art im DE7110 (erster AHB-Code) - sonst Wert im DE7110.
                    const k1131 = deIdx(cavE.inst, '1131');
                    const frei1131 = k1131 >= 0 && !(cavE.inst.des[k1131].codes || []).length;
                    const codes7110 = deCodes(cavE.inst, '7110');
                    const k7110 = deIdx(cavE.inst, '7110');
                    if (frei1131 && codes7110.length) {
                        still(cavE, k1131, v.wert);
                        still(cavE, k7110, codes7110[0]);
                    } else if (k7110 >= 0) {
                        still(cavE, k7110, v.wert);
                    } else if (frei1131) {
                        // Der AHB führt den Wert im DE1131 (z. B. MP-ID) - dorthin,
                        // nicht blind in die 4. Komponente (Korrektur nach Meta).
                        still(cavE, k1131, v.wert);
                    }
                });
            });
        });

        // Produktpaket (55001): Block nach dem SG6-Bereich einspeisen (RFF+Z60
        // informativ zur 1. Produktpaket-ID, dann die SG8/SG10-Segmente des Blocks).
        if (prufId === '55001' && typeof buildProduktpaketSegments === 'function') {
            const z13E = sucheInstanz(ip.liste, i => i.seg === 'RFF' && hatCode(i, '1153', 'Z13'));
            const letzte = ip.liste[ip.liste.length - 1];
            const rffZ60 = ctx => {
                const st = (typeof produktpaketState !== 'undefined') ? produktpaketState : null;
                if (st && st.pakete && st.pakete.length > 0)
                    ctx.seg.push(`RFF+Z60:${global.AhbFormEngine.edi(String(st.pakete[0].paketId))}'`);
            };
            const ppBlock = ctx => { buildProduktpaketSegments().forEach(s => ctx.seg.push(s)); };
            if (z13E) Z.zusatzNachPfad[z13E.pfad] = rffZ60;
            if (letzte) {
                const vorher = Z.zusatzNachPfad[letzte.pfad];
                Z.zusatzNachPfad[letzte.pfad] = ctx => { if (vorher) vorher(ctx); ppBlock(ctx); };
            }
        }

        return html;
    }

    // Instanzen der Objektgruppe eines SEQ (bis zur nächsten SEQ-Instanz).
    function gruppeVon(ip, seqE) {
        const alle = ip.liste;
        const start = alle.indexOf(seqE);
        const gr = [];
        for (let x = start + 1; x < alle.length; x++) {
            if (alle[x].inst.seg === 'SEQ') break;
            gr.push(alle[x]);
        }
        return gr;
    }

    // ---- Abhängige Formularblöcke (AHB-Bedingungen der Feldauswahl) --------
    function abhaengigkeitErfuellt(feld, code, negiert) {
        const el = $(feld);
        let werte = [];
        if (el) {
            werte = el.multiple
                ? Array.from(el.selectedOptions).map(o => o.value)
                : (el.value ? [el.value] : []);
        }
        const vorhanden = werte.some(v => String(v).split(':')[0] === code);
        return negiert ? !vorhanden : vorhanden;
    }
    function aktualisiereAbhaengigkeiten() {
        if (typeof document.querySelectorAll !== 'function') return;
        document.querySelectorAll('#dynamicForm [data-abhaengig-feld]').forEach(block => {
            const aktiv = abhaengigkeitErfuellt(
                block.dataset.abhaengigFeld,
                block.dataset.abhaengigCode,
                block.dataset.abhaengigNegiert === "1");
            block.style.display = aktiv ? '' : 'none';
            block.dataset.abhaengigAktiv = aktiv ? '1' : '0';
        });
    }
    function feldAktiv(f) {
        if (!f.regel.abhaengig) return true;
        const a = f.regel.abhaengig;
        return abhaengigkeitErfuellt(a.feld, a.code, !!a.negiert);
    }

    // ---- Erzeugung ---------------------------------------------------------
    function generateEdifact() {
        if (!Z) return;
        const E = global.AhbFormEngine;
        const prufId = Z.prufId;
        aktualisiereAbhaengigkeiten();

        const antwortFeld = Z.felder.find(f => f.typ === 'antwort');

        // Alias-Zuordnung aufbauen: sichtbare Felder (nur aktive) + stille Werte.
        const alias = {};
        Z.felder.forEach(f => {
            // Antwort-Auswahl liefert ihre Werte über die stillen Einzelfelder.
            if (!f.e || f.k < 0 || f.typ === 'info' || f.typ === 'unh' || f.typ === 'mpid' || f.typ === 'antwort') return;
            if (!feldAktiv(f)) return;   // AHB-Bedingung nicht erfüllt: Wert gehört nicht in die Nachricht
            const basisPfad = f.wdh2 ? `p1w2_${f.e.j}` : f.e.pfad;
            alias[`${basisPfad}_${f.k}`] = f.domId;
        });
        Z.stille.forEach(s => { alias[s.pfadKey] = s.domId; });

        // Instanzen der Objektgruppen (SG8-SG12) ohne Feld und ohne Vorbelegung
        // werden nicht emittiert (bisheriges Maskenverhalten).
        const unterdrueckt = new Set();
        Z.ip.liste.forEach(e => {
            if (!/^SG(8|9|1[0-2])$/.test(e.inst.sg || '')) return;
            const benutzt = Z.benutztePfade.has(e.pfad)
                || Object.keys(alias).some(k => k.startsWith(e.pfad + '_'));
            if (!benutzt) unterdrueckt.add(e.pfad);
        });
        // Produktpaket 55001: Die SG8/SG10-Objektgruppen kommen aus dem eigenen
        // Block; die Meta-Instanzen dazu werden nicht zusätzlich emittiert.
        if (prufId === '55001') Z.ip.liste.forEach(e => {
            if (/^SG(8|9|1[0-2])$/.test(e.inst.sg || '')) unterdrueckt.add(e.pfad);
        });

        E.setzeKontext(prufId, Z.meta);
        E.setzeSicht({
            alias,
            posAktiv: Z.ip.hatPos,
            unterdrueckt,
            zeitraumWdh: () => {
                const belegt = Z.wdh2Felder.some(id => { const el = $(id); return el && el.value; });
                return belegt ? ['2'] : [];
            },
            zusatzSegmente: (inst, pfad, ctx) => {
                const fn = Z.zusatzNachPfad[pfad];
                if (fn) fn(ctx);
            },
        });

        // 2. Verwendungszeitraum ohne gewählte Qualität: Es gilt das Gegenteil der
        // ersten (Praxis der Zeitscheiben: „Keine Daten" Z53 vor / „Gültige Daten"
        // Z49 ab dem Lieferbeginn - bisherige Vorgabe der Maske).
        const q2Feld = Z.felder.find(f => f.wdh2 && f.e && f.k >= 0 && (f.e.inst.des[f.k] || {}).de === '1153');
        if (q2Feld) {
            const el2 = $(q2Feld.domId);
            const w2aktiv = Z.wdh2Felder.some(id => { const e = $(id); return e && e.value; });
            if (el2 && !el2.value && w2aktiv) {
                const q1Feld = Z.felder.find(f => !f.wdh2 && f.e && f.k >= 0 && (f.e.inst.des[f.k] || {}).de === '1153');
                const v1 = (q1Feld && $(q1Feld.domId)) ? $(q1Feld.domId).value : '';
                el2.value = v1 === 'Z49' ? 'Z53' : 'Z49';
            }
        }

        // Antwortcode-Auswahl an den Geschäftsvorfall koppeln (liest die Feldwerte
        // über die soeben gesetzte Sicht-Zuordnung), danach Code/EBD nachführen.
        aktualisiereAntwortAuswahl();
        if (antwortFeld) {
            const sel2 = $(antwortFeld.domId);
            const teile2 = sel2 ? String(sel2.value).split(':') : [];
            const codeZiel2 = Z.antwortCodeStillId ? $(Z.antwortCodeStillId) : null;
            if (codeZiel2 && teile2[0]) codeZiel2.value = teile2[0];
            const ebdZiel2 = Z.ebdStillId ? $(Z.ebdStillId) : null;
            if (ebdZiel2 && teile2[1]) ebdZiel2.value = teile2[1];
        }

        const ok = E.generate(prufId, Z.meta);

        // Zusätzliche harte Fachregeln der Maske (unverändert aus der bisherigen
        // Prüf-Logik; sie warnen, die Testnachricht bleibt erzeugt):
        const fehler = [];
        const feldDa = id => Z.felder.some(f => f.domId === id);
        const wert = id => { const el = $(id); return el ? el.value.trim() : ''; };
        if ((prufId === '55016' || prufId === '55017') && feldDa('DTM_93') && feldDa('DTM_471')
            && !wert('DTM_93') && !wert('DTM_471'))
            fehler.push("<b>Regel verletzt:</b> Entweder DTM+93 oder DTM+471 muss befüllt sein.");
        const pm = (typeof prozessMeta !== 'undefined' && prozessMeta[prufId]) ? prozessMeta[prufId] : {};
        if (pm.kapitel && ['8.2', '8.9', '8.6'].includes(pm.kapitel) && pm.art === 'anfrage'
            && feldDa('DTM_92') && !wert('DTM_92'))
            fehler.push("<b>Regel verletzt:</b> In diesem Anwendungsfall ist DTM+92 (Beginn zum) anzugeben.");
        const sts7 = wert('STS_7');
        if ((sts7 === 'ZW4' || sts7 === 'ZW3') && (feldDa('LOC_Z16') || feldDa('LOC_Z21'))
            && !wert('LOC_Z16') && !wert('LOC_Z21'))
            fehler.push("<b>Regel verletzt [348]:</b> Es muss die Marktlokation (LOC+Z16) oder die Tranche (LOC+Z21) angegeben werden.");
        Z.felder.forEach(f => {
            if (!/^(LOC|RFF|DTM)_/.test(f.regel.id)) return;
            if (!f.regel.abhaengig || !feldAktiv(f)) return;
            if (!/^Muss/.test(f.regel.status || '')) return;
            if (!wert(f.domId))
                fehler.push(`<b>Pflichtangabe fehlt:</b> ${esc(f.regel.name)} (Bedingung [${esc(f.regel.abhaengig.bedingung || '')}] ist erfüllt).`);
        });
        // Optische Feldprüfung (Ampel) und Speicherfreigabe; fehlende Pflichtangaben
        // und Formatverstöße erscheinen zusätzlich als Meldung über der Vorschau.
        const bewertung = bewerteFelder(fehler);
        const meldungen = fehler.slice();
        if (bewertung.fehlend.length)
            meldungen.push('<b>Pflichtangaben fehlen:</b> ' + bewertung.fehlend.map(esc).join(' · '));
        bewertung.fehlerhaft.forEach(m => meldungen.push('<b>Format:</b> ' + esc(m)));
        if (meldungen.length) {
            const box = $('errorBox');
            if (box) {
                box.style.display = 'block';
                box.innerHTML = meldungen.join('<br>') + (box.innerHTML ? '<br>' + box.innerHTML : '');
            }
        }
        if (meldungen.length || !speicherFrei) {
            // Unvollständige Quellnachricht: keine Folgenachrichten anbieten.
            const fn = $('folgeNachrichten'); if (fn) fn.style.display = 'none';
        }

        // Zeilenumbrüche gemäß Editor-Schalter.
        const aus = $('edifactOutput');
        const lb = $('lineBreaks');
        if (aus && lb && !lb.checked) aus.value = aus.value.replace(/\n/g, '');
        // Zeitangaben unter den Datumsfeldern nachführen.
        E.aktualisiereZeitanzeige();
        return ok;
    }

    // ---- Optische Feldprüfung (Ampel) und Speicherfreigabe ------------------
    // Grün: befüllt und formatgültig. Rot: Pflichtangabe leer (Muss bzw. Muss mit
    // erfüllter Bedingung) oder Wert verletzt das Feldformat (MIG-Format bzw.
    // bekannte ID-Formate). Neutral: optionale Angabe ohne Wert. Die Vorschau
    // entsteht weiterhin immer; SPEICHERN ist erst freigegeben, wenn keine roten
    // Felder und keine harten Fachregel-Fehler vorliegen — Test-Empfangssysteme
    // quittieren unvollständige Nachrichten sonst mit negativer CONTRL (Code 23).
    let speicherFrei = false;

    function stileEinbinden() {
        if (typeof document.createElement !== 'function' || typeof document.head === 'undefined'
            || !document.head || $('utilmdAmpelStil')) return;
        const s = document.createElement('style');
        s.id = 'utilmdAmpelStil';
        s.textContent = '.feld-ok{background-color:rgba(92,184,92,.16) !important;}'
            + '.feld-fehler{background-color:rgba(217,83,79,.20) !important;}';
        document.head.appendChild(s);
    }

    // MIG-Feldformat (Zeichenart/Länge) eines Instanzfeldes, z. B. "an..35".
    function migFormat(seg, de) {
        const alle = (typeof migFormate !== 'undefined') ? migFormate : global.migFormate;
        if (!alle) return null;
        const stand = fmt().stand || (global.EdiStand && global.EdiStand.aktiv()) || '';
        const schluessel = (String(fmt().sparte).toUpperCase() === 'GAS') ? 'UTILMD_GAS' : 'UTILMD_STROM';
        const felder = ((alle[stand] || {})[schluessel] || {}).felder || {};
        const f = felder[`${seg} ${de}`];
        const m = f && f.fmt && /^(an|a|n)(\.\.)?(\d+)$/.exec(f.fmt);
        if (!m) return null;
        return { art: m[1], variabel: !!m[2], laenge: Number(m[3]), fmt: f.fmt };
    }

    // Formatprüfung eines befüllten Feldes; liefert null (gültig) oder die Meldung.
    function formatBefund(f, wert) {
        if (f.typ === 'mpid')
            return /^\d{13}$/.test(wert) ? null : 'MP-ID muss 13-stellig numerisch sein';
        if (f.typ === 'datum') {
            const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(wert);
            if (!m) return 'Datum im Format TT.MM.JJJJ angeben';
            const t = Number(m[1]), mo = Number(m[2]);
            return (t >= 1 && t <= 31 && mo >= 1 && mo <= 12) ? null : 'kein gültiges Datum';
        }
        if (f.regel && f.regel.id === 'LOC_Z16')
            return /^\d{11}$/.test(wert) ? null : 'Marktlokations-ID muss 11-stellig numerisch sein';
        if (f.typ === 'select' || f.typ === 'antwort') return null;
        if (f.e && f.k >= 0) {
            const mig = migFormat(f.e.inst.seg, (f.e.inst.des[f.k] || {}).de);
            if (mig) {
                if (mig.art === 'n' && !/^-?\d+([.,]\d+)?$/.test(wert))
                    return `nur numerische Angabe erlaubt (MIG: ${mig.fmt})`;
                if (wert.length > mig.laenge)
                    return `zu lang: ${wert.length} von max. ${mig.laenge} Zeichen (MIG: ${mig.fmt})`;
                if (!mig.variabel && wert.length !== mig.laenge)
                    return `Länge muss genau ${mig.laenge} Zeichen sein (MIG: ${mig.fmt})`;
            }
        }
        return null;
    }

    // Bewertet alle sichtbaren Felder, färbt sie und schaltet das Speichern.
    function bewerteFelder(fachFehler) {
        stileEinbinden();
        const fehlend = [], fehlerhaft = [];
        Z.felder.forEach(f => {
            const el = $(f.domId);
            if (!el || f.typ === 'info' || f.typ === 'unh' || !el.classList) return;
            el.classList.remove('feld-ok', 'feld-fehler');
            if ('title' in el) el.title = '';
            if (!feldAktiv(f)) return;                    // ausgeblendet: neutral
            const wert = String(el.value || '').trim();
            // Pflicht: Muss ohne Abhängigkeit, oder Muss(-bedingt) mit erfüllter Bedingung.
            const pflicht = f.typ === 'mpid' || (/^Muss/.test(f.regel.status || '')
                && (!f.regel.abhaengig || feldAktiv(f)) && (f.regel.status === 'Muss' || f.regel.abhaengig));
            if (!wert) {
                if (pflicht) {
                    el.classList.add('feld-fehler');
                    if ('title' in el) el.title = 'Pflichtangabe fehlt';
                    fehlend.push(f.regel ? f.regel.name : f.domId);
                }
                return;
            }
            const befund = formatBefund(f, wert);
            if (befund) {
                el.classList.add('feld-fehler');
                if ('title' in el) el.title = befund;
                fehlerhaft.push(`${f.regel ? f.regel.name : f.domId}: ${befund}`);
            } else {
                el.classList.add('feld-ok');
            }
        });
        speicherFrei = !fehlend.length && !fehlerhaft.length && !(fachFehler && fachFehler.length);
        const knopf = (typeof document.querySelector === 'function')
            ? document.querySelector('button[onclick^="downloadEdifact"]') : null;
        if (knopf) {
            knopf.disabled = !speicherFrei;
            knopf.title = speicherFrei ? ''
                : 'Speichern gesperrt: erst alle Pflichtangaben korrekt füllen (rote Felder).';
        }
        return { fehlend, fehlerhaft };
    }

    // Erzeugte Nachricht als marktkonforme Übertragungsdatei sichern
    // (_engine/nachricht-speichern.js, Allgemeine Festlegungen 2.12).
    // Gesperrt, solange Pflichtangaben fehlen oder Feldformate verletzt sind.
    function downloadEdifact() {
        if (!speicherFrei || typeof EdiSpeichern === 'undefined') return;
        EdiSpeichern.speichere('edifactOutput', 'speicherHinweis');
    }

    // Prüf-ID-Auswahl an den geladenen Formatstand koppeln: Die Seite führt die
    // Obermenge aller Stände; Prüf-IDs ohne Felddaten des aktiven Stands werden
    // entfernt, leer gewordene Kapitelgruppen ausgeblendet (Phase 3 - eine Seite,
    // Formatstand als Parameter).
    function filterePruefIdAuswahl() {
        const sel = $('prufId');
        if (!sel || typeof ahbRulesByPrufId === 'undefined') return;
        if (typeof sel.querySelectorAll !== 'function') return;   // Test-Harness ohne DOM-Baum
        sel.querySelectorAll('option').forEach(o => {
            if (o.value && !ahbRulesByPrufId[o.value]) o.remove();
        });
        sel.querySelectorAll('optgroup').forEach(g => {
            if (!g.querySelector('option')) g.remove();
        });
        if (sel.value && !ahbRulesByPrufId[sel.value]) {
            const erste = sel.querySelector('option[value]');
            if (erste) sel.value = erste.value;
        }
    }

    // ---- Prüf-ID-Auswahl: Suchfeld und umschaltbare Sortierung --------------
    // Die Auswahlliste ist nach AHB-Kapiteln gruppiert; auf Wunsch sortiert sie
    // numerisch nach Prüf-ID. Das Suchfeld filtert live nach Prüf-ID-Anfang oder
    // Stichwort (Bezeichnung/Kapitel) — der erste Treffer wird sofort gerendert.
    let AUSWAHL = null;          // [{ pid, text, gruppe }] in Kapitel-Reihenfolge
    let sortiertNachPid = false;

    function baueAuswahlWerkzeuge() {
        const sel = $('prufId');
        if (!sel || typeof sel.querySelectorAll !== 'function' || !sel.parentNode
            || typeof document.createElement !== 'function') return;   // Test-Harness ohne DOM-Baum
        if ($('prufIdSuche')) return;                                  // bereits gebaut
        AUSWAHL = [];
        Array.from(sel.children).forEach(kind => {
            if (kind.tagName === 'OPTGROUP') {
                const gruppe = kind.getAttribute('label') || '';
                kind.querySelectorAll('option').forEach(o => {
                    if (o.value) AUSWAHL.push({ pid: o.value, text: o.textContent, gruppe });
                });
            } else if (kind.tagName === 'OPTION' && kind.value) {
                AUSWAHL.push({ pid: kind.value, text: kind.textContent, gruppe: '' });
            }
        });
        const leiste = document.createElement('div');
        leiste.style.cssText = 'display:flex; gap:6px; margin-bottom:6px;';
        leiste.innerHTML =
            '<input type="text" id="prufIdSuche" placeholder="Prüf-ID oder Stichwort suchen …" '
            + 'autocomplete="off" style="flex:1 1 auto;">'
            + '<button type="button" id="prufIdSortierung" class="btn-secondary" '
            + 'title="Sortierung der Liste umschalten" style="flex:0 0 auto; white-space:nowrap;">'
            + 'Sortierung: Kapitel</button>';
        sel.parentNode.insertBefore(leiste, sel);
        $('prufIdSuche').addEventListener('input', aktualisiereAuswahlListe);
        $('prufIdSortierung').addEventListener('click', () => {
            sortiertNachPid = !sortiertNachPid;
            $('prufIdSortierung').textContent = 'Sortierung: ' + (sortiertNachPid ? 'Prüf-ID' : 'Kapitel');
            aktualisiereAuswahlListe();
        });
    }

    function aktualisiereAuswahlListe() {
        const sel = $('prufId');
        if (!sel || !AUSWAHL) return;
        const alt = sel.value;
        const filter = (($('prufIdSuche') || {}).value || '').trim().toLowerCase();
        const passt = e => !filter || e.pid.startsWith(filter)
            || e.text.toLowerCase().indexOf(filter) >= 0
            || e.gruppe.toLowerCase().indexOf(filter) >= 0;
        const treffer = AUSWAHL.filter(passt);
        let html = '';
        if (!treffer.length) {
            // Kein Treffer: Liste zeigt den Hinweis, das Formular bleibt unverändert.
            sel.innerHTML = '<option value="" disabled>– kein Treffer –</option>';
            return;
        }
        if (sortiertNachPid) {
            treffer.slice().sort((a, b) => a.pid.localeCompare(b.pid, 'de', { numeric: true }))
                .forEach(e => {
                    // Kapitelnummer (erstes Wort der Gruppe) als kompakte Einordnung anhängen.
                    const kapitel = (e.gruppe.split(' ')[0] || '').trim();
                    html += `<option value="${esc(e.pid)}">${esc(e.text)}${kapitel ? '  [' + esc(kapitel) + ']' : ''}</option>`;
                });
        } else {
            let offen = null;
            treffer.forEach(e => {
                if (e.gruppe !== offen) {
                    if (offen !== null) html += '</optgroup>';
                    if (e.gruppe) html += `<optgroup label="${esc(e.gruppe)}">`;
                    offen = e.gruppe;
                }
                html += `<option value="${esc(e.pid)}">${esc(e.text)}</option>`;
            });
            if (offen) html += '</optgroup>';
        }
        sel.innerHTML = html;
        sel.value = treffer.some(e => e.pid === alt) ? alt : treffer[0].pid;
        if (sel.value !== alt) renderForm();
    }

    // ---- Start -------------------------------------------------------------
    function startGenerator() {
        if (typeof formMeta === 'undefined' || typeof ahbRulesByPrufId === 'undefined') {
            const box = $('errorBox');
            if (box) {
                box.style.display = 'block';
                box.innerHTML = '<b>Ladefehler:</b> Die Daten unter <code>pruef-ids/</code> '
                    + '(_form-meta.js, _regeln.js) wurden nicht gefunden. Bitte die Seite mit '
                    + 'erhaltener Ordnerstruktur öffnen.';
            }
            return;
        }
        // Standabhängige Beschriftungen (z. B. Kapitelnummern der optgroups) vor dem
        // Einsammeln der Auswahlliste anwenden (Phase 3, data-stand-…-label).
        if (global.EdiStand && typeof global.EdiStand.beschrifte === 'function')
            global.EdiStand.beschrifte({});
        filterePruefIdAuswahl();
        baueAuswahlWerkzeuge();
        renderForm();
    }

    // Öffentliche Seiten-Schnittstelle (identisch zur bisherigen Maske).
    global.renderForm = renderForm;
    global.generateEdifact = generateEdifact;
    global.downloadEdifact = downloadEdifact;
    global.aktualisiereAbhaengigkeiten = aktualisiereAbhaengigkeiten;
    // Test-/Werkzeug-Schnittstelle: Beispiel-MP-IDs der aktuellen Prüf-ID
    // (sparten-/AHB-gerecht, E6-Logik) — genutzt vom Test-Harness, um wie bisher
    // vollständige Testnachrichten zu erzeugen (Golden-Regression).
    global.EdiUtilmdMaske = {
        mpVorschlaege: () => (Z && Z.mpVorschlag) ? Z.mpVorschlag : null,
        speicherFrei: () => speicherFrei,
    };

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startGenerator);
        } else {
            startGenerator();
        }
    }
})(typeof window !== "undefined" ? window : this);
