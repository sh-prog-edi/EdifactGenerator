// harness.js
// Versionsfähige Test-Harness: lädt die zentrale Engine (_engine/) zusammen mit den
// formatspezifischen Daten eines Ziels (Version/Thema/Nachrichtentyp/Sparte) in eine
// gemeinsame VM-Sandbox und stellt renderForm/generateEdifact sowie die Validierung
// über den zentralen AhbValidator bereit.
//
// So laufen dieselben Regressionen gegen JEDE Version - Grundlage der Golden-Regression:
// die Engine bleibt zentral, jede Version prüft sich mit ihren eigenen Daten.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Minimaler DOM-Shim (identisch zum bisherigen Testaufbau).
class El {
    constructor(t){ this.tagName=t; this._html=''; this.value=''; this.checked=false;
        this.style={}; this.classList={toggle(){},add(){},remove(){}}; this.children=[]; this.id='';
        this.dataset={}; }   // dataset: Träger der AHB-Abhängigkeiten am Formularblock
    set innerHTML(v){ this._html=v; this.children=[]; }
    get innerHTML(){ return this._html; }
    appendChild(c){ this.children.push(c); if(c.id) this._store[c.id]=c; this._html+=(c._html||''); return c; }
    setAttribute(){}
}

// Schreibt value-Attribute aus dem generierten dynamicForm-HTML in die Feld-Objekte zurück.
function applyValues(get){
    const html = get('dynamicForm').innerHTML;
    let m;
    const re = /id="([^"]+)"[^>]*value="([^"]*)"/g;
    while ((m = re.exec(html))) get(m[1]).value = m[2];
    // Auswahlfelder: die als selected markierte Option gewinnt, sonst die erste.
    const reSel = /<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g;
    while ((m = reSel.exec(html))) {
        const inhalt = m[2];
        const gewaehlt = /<option value="([^"]*)"[^>]*\bselected\b/.exec(inhalt);
        const erste = /<option value="([^"]*)"/.exec(inhalt);
        const wert = gewaehlt ? gewaehlt[1] : (erste ? erste[1] : '');
        get(m[1]).value = wert;
    }
}

// Macht die Sandbox reproduzierbar: festes "jetzt" und festes Math.random.
// Nötig für die Golden-Regression, da DAR/Zeitstempel/Referenzen sonst je Lauf variieren.
function macheDeterministisch(sandbox, fixedNow){
    const RealDate = Date;
    class MockDate extends RealDate {
        constructor(...args){ if (args.length === 0) super(fixedNow); else super(...args); }
        static now(){ return fixedNow; }
    }
    sandbox.Date = MockDate;
    sandbox.Math = new Proxy(Math, { get:(t,p)=> p === 'random' ? (()=>0.5) : t[p] });
}

// engineDir: Pfad zu _engine/; dataDir: Pfad zum Sparten-Ordner (mit pruef-ids/).
// opts.fixedNow (ms): setzt festes Datum + Math.random für reproduzierbare Ausgabe.
function ladeGenerator(engineDir, dataDir, opts = {}){
    const pd = path.join(dataDir, 'pruef-ids');
    // Ladereihenfolge wie in der Generator-index.html. Die Regeln je Prüf-ID liegen
    // seit dem Feldauswahl-Umbau (Phase 2) als EINE Datendatei _regeln.js vor —
    // sie ersetzt die früheren Einzeldateien <PID>.js und die _pid-registry.js.
    const dateien = [
        path.join(pd, '_format.js'),
        path.join(pd, '_prozess-meta.js'),
        path.join(pd, '_mig-codelisten.js'),
        path.join(engineDir, '_segment-struktur.js'),
        path.join(pd, '_bedingungen.js'),
        path.join(pd, '_produkte-55001.js'),
        path.join(pd, '_produktpaket.js'),
        path.join(pd, '_regeln.js'),         // Feldauswahl-Datenschicht (ahbRulesByPrufId)
        path.join(pd, '_nutzdaten-katalog.js'),  // Objekt-Nutzdaten-Katalog (falls vorhanden)
        path.join(pd, '_form-meta.js'),      // AHB-Struktur je Prüf-ID (Prüfgrundlage)
        // Antwortcode-Auswahl VOR der Maske laden (die Maske baut die Auswahl beim Rendern)
        path.join(engineDir, 'daten', 'mig-formate.js'),
        path.join(engineDir, 'daten', 'sts-struktur.js'),
        path.join(engineDir, 'daten', 'codelisten.js'),
        path.join(engineDir, 'daten', 'ebd-antwortcodes.js'),
        path.join(engineDir, 'daten', 'ebd-pfade.js'),
        path.join(engineDir, 'antwortcode-auswahl.js'),
        // Engine-Sicht der kuratierten Maske (Feldauswahl-Umbau, Phase 2):
        // zentrale Engine + Profil-Modul statt des früheren generator.js.
        path.join(engineDir, 'ahb-form-engine.js'),
        path.join(engineDir, 'utilmd-maske.js'),
        // Prüflogik: dieselbe wie in Masken und universellem Validator
        path.join(engineDir, 'daten', 'af-regeln.js'),
        path.join(engineDir, 'daten', 'ahb-ergaenzungen.js'),
        path.join(engineDir, 'daten', 'bedingung-eval.js'),
        path.join(engineDir, 'ahb-validator.js'),
    ].filter(fs.existsSync);

    const store = {};
    // Legt ein Element unabhängig vom gerenderten HTML an (Seiten-Grundgerüst,
    // Testzugriffe). Bestehende Elemente werden wiederverwendet.
    const get = id => { if(!store[id]){ const e=new El(id); e.id=id; e._store=store; store[id]=e; } return store[id]; };
    // getElementById der Sandbox: Ein Element existiert nur, wenn es angelegt wurde
    // oder seine ID im gerenderten HTML vorkommt — die Engine verlässt sich darauf,
    // dass nicht gerenderte Felder null liefern (Automatik-/Fallback-Werte).
    // Beim ersten Zugriff werden value-Attribut bzw. Select-Vorauswahl übernommen.
    const beiId = id => {
        if (store[id]) return store[id];
        let html = null;
        for (const key of Object.keys(store)) {
            const h = store[key] && store[key]._html;
            if (h && h.indexOf(`id="${id}"`) >= 0) { html = h; break; }
        }
        if (html === null) return null;
        const e = get(id);
        const kennung = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const m = new RegExp(`id="${kennung}"[^>]*\\bvalue="([^"]*)"`).exec(html);
        if (m) e.value = m[1];
        const s = new RegExp(`<select id="${kennung}"[^>]*>([\\s\\S]*?)</select>`).exec(html);
        if (s) {
            e.tagName = 'SELECT';
            const gewaehlt = /<option value="([^"]*)"[^>]*\bselected\b/.exec(s[1]);
            const erste = /<option value="([^"]*)"/.exec(s[1]);
            e.value = gewaehlt ? gewaehlt[1] : (erste ? erste[1] : '');
        }
        return e;
    };
    El.prototype._store = store;

    const sandbox = { console, store,
        document: { getElementById: beiId, createElement: t => { const e=new El(t); e._store=store; return e; },
                    // Der Shim hält keine Elementbäume vor; die Sichtbarkeitssteuerung
                    // der bedingten Blöcke ist im Test ohne Belang, die Emission prüft
                    // die Bedingung ohnehin eigenständig über die Feldwerte.
                    querySelectorAll: () => [], querySelector: () => null,
                    readyState:'complete', addEventListener:()=>{} },
        window:{}, Date, Math, String, Number, JSON, parseInt, parseFloat, isNaN, RegExp, Set, Array, Object };
    sandbox.global = sandbox;
    if (opts.fixedNow != null) macheDeterministisch(sandbox, opts.fixedNow);
    vm.createContext(sandbox);

    let combined='';
    for (const f of dateien) combined += '\n' + fs.readFileSync(f,'utf8') + '\n';
    vm.runInContext(combined, sandbox, { filename:'combined.js' });

    // Bedingungen bereitstellen: die per-Typ-Datei _bedingungen.js legt ihre Daten
    // in eine typspezifische Variable und exportiert EdiBedingungen nur über window.
    // Im VM-Sandbox (kein window) käme sonst nichts an, sodass jede konditionale
    // Muss-Bedingung als „nicht entscheidbar" (Warnung) behandelt würde. Über
    // module.exports der Datei die Bedingungen nachziehen.
    try {
      const bed = require(path.join(pd, '_bedingungen.js'));
      if (bed && typeof bed === 'object')
        sandbox.EdiBedingungen = Object.assign(sandbox.EdiBedingungen || {}, bed);
    } catch (e) { /* Typ ohne Bedingungsdatei */ }

    // Prüf-IDs der kuratierten Maske (nur UTILMD-Ziele führen _regeln.js; für
    // andere Ziele dient der Harness als reiner Validator-Lader, z. B. für die
    // Referenz-Testsuite scripts/referenz_validierung.js).
    const regelnDatei = path.join(pd, '_regeln.js');
    const pids = fs.existsSync(regelnDatei) ? Object.keys(require(regelnDatei)).sort() : [];

    // Erzeugt die Testnachricht einer PID (mit Zeilenumbrüchen).
    // Die Maskenfunktionen (renderForm/generateEdifact) bindet das Profil-Modul
    // an das window-Objekt der Sandbox (wie alle Bibliotheken der Engine).
    function generiere(pid){
        // Feldzustand vollständig zurücksetzen (der Browser baut das Formular je PID-Auswahl
        // neu auf; ohne Reset würden Feldwerte einer vorherigen PID durchlecken, z. B.
        // STS_7_grund einer Meldung in eine danach erzeugte Anmeldung).
        Object.keys(store).forEach(k => delete store[k]);
        store['lineBreaks'] = new El('input'); store['lineBreaks'].checked = true;
        get('prufId').value = pid;
        store['dynamicForm'] = new El('div'); store['dynamicForm'].id='dynamicForm'; store['dynamicForm']._store=store;
        get('edifactOutput'); get('errorBox');   // Seiten-Grundgerüst (Ausgabe/Fehlerbox)
        const w = sandbox.window || {};
        (w.renderForm || sandbox.renderForm)();
        applyValues(get);
        // MP-IDs sind im Formular nicht mehr vorbelegt (echte Test-MP-IDs sind
        // Nutzereingabe); für reproduzierbare Testnachrichten setzt der Harness
        // die sparten-/AHB-gerechten Beispiel-IDs der Maske (E6-Logik).
        const mp = w.EdiUtilmdMaske && w.EdiUtilmdMaske.mpVorschlaege && w.EdiUtilmdMaske.mpVorschlaege();
        if (mp) {
            if (beiId('NAD_MS') && !beiId('NAD_MS').value) beiId('NAD_MS').value = mp.NAD_MS;
            if (beiId('NAD_MR') && !beiId('NAD_MR').value) beiId('NAD_MR').value = mp.NAD_MR;
        }
        (w.generateEdifact || sandbox.generateEdifact)();
        return get('edifactOutput').value;
    }

    // Validierung mit dem zentralen Validator — derselbe Code, den Masken und
    // universeller Validator nutzen. Die Prüfgrundlage ist die Formular-Meta des
    // geladenen Ziels; Format/Sparte kommen aus dessen Pfad.
    // ahb-validator.js bindet sich an `window`; im Shim ist das sandbox.window.
    const V = sandbox.AhbValidator || (sandbox.window && sandbox.window.AhbValidator);
    const sparte = /\/Gas$/.test(dataDir) ? 'Gas' : (/\/Strom$/.test(dataDir) ? 'Strom' : '');
    const stand = (dataDir.match(/\b(20\d{4})\b/) || [])[1] || '';
    const format = (dataDir.match(/\/(UTILMD|MSCONS|ORDERS|ORDRSP|INVOIC|REMADV|PRICAT|COMDIS|IFTSTA|INSRPT|PARTIN|UTILTS|QUOTES|REQOTE|ORDCHG|APERAK|CONTRL)\b/) || [])[1] || '';
    const migKey = format === 'UTILMD' ? (sparte === 'Gas' ? 'UTILMD_GAS' : 'UTILMD_STROM') : format;
    function validiere(msg, pid) {
        const parsed = V.parse(msg);
        const metaAlle = sandbox.formMeta || sandbox.msconsFormMeta || sandbox.ordersMeta || {};
        const ctx = {
            meta: pid ? metaAlle[pid] : null, pruefi: pid, stand, format,
            migFormat: ((sandbox.migFormate || {})[stand] || {})[migKey] || { felder: {}, maxWdh: {} },
            stsStruktur: ((sandbox.stsStruktur || {})[stand] || {})[migKey] || null,
            ebd: ((sandbox.ebdAntwortcodes || {})[stand] || {}).ebds || {},
            codelisten: sandbox.codelisten || {}, afRegeln: sandbox.afRegeln || null,
            ergaenzungen: sandbox.ahbErgaenzungen || [],
            cluster: (() => {
                const m = (sandbox.prozessMeta || {})[pid];
                if (!m || !m.antwortcluster) return '';
                return m.antwortcluster === 'ablehnung' ? 'Ablehnung'
                     : (m.antwortcluster === 'zustimmung' ? 'Zustimmung' : '');
            })(),
            condTree: sandbox.EdiCondTree || {}, bedingungen: sandbox.EdiBedingungen || {},
        };
        const res = V.validiere(parsed, ctx);
        // einheitliche Befundliste (wie die frühere Schnittstelle)
        const findings = [];
        (res.global.meldungen || []).forEach(m => findings.push({ level: 'FEHLER', seg: '—', msg: m }));
        (res.fehlendeMuss || []).forEach(m => findings.push({ level: 'FEHLER', seg: 'AHB', msg: 'Fehlendes Muss-Segment: ' + m }));
        (res.zeilen || []).forEach(z => {
            z.meldungen.forEach(m => findings.push({ level: 'FEHLER', seg: z.tag, msg: m }));
            z.hinweise.forEach(m => findings.push({ level: 'HINWEIS', seg: z.tag, msg: m }));
        });
        (res.global.hinweise || []).forEach(m => findings.push({ level: 'HINWEIS', seg: '—', msg: m }));
        return { findings, res, parsed };
    }

    return { sandbox, get, store, pids, generiere, validiere };
}

// Standardziel: 202610 UTILMD Strom. Über die Umgebungsvariable EDIGEN_TARGET (Pfad zum
// Sparten-Ordner, absolut oder relativ zum Projekt-Root) auf ein anderes Format/Sparte
// umstellbar - z. B. "202610/Stammdaten/UTILMD/Gas". So laufen dieselben Tests je Version/Sparte.
function standardZiel(){
    const engineDir = path.resolve(__dirname, '..');
    const root = path.resolve(engineDir, '..');
    const ziel = process.env.EDIGEN_TARGET;
    const dataDir = ziel
        ? (path.isAbsolute(ziel) ? ziel : path.join(root, ziel))
        : path.join(root, '202610', 'Stammdaten', 'UTILMD', 'Strom');
    return { engineDir, dataDir };
}

module.exports = { ladeGenerator, standardZiel };
