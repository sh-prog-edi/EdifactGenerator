// generator.js - TEIL 1: Zeittabellen und Berechnungs-Engine

let currentDAR = "";
let currentTimestamp = "";

// Ausstellende Codevergabestelle je MP-ID (UNB DE0007 + NAD DE3055), je Sparte:
//   Strom: "99.." -> BDEW (UNB 500, NAD 293); "4.." -> GS1 (UNB 14, NAD 9)
//   Gas:   "98.." -> DVGW (UNB 500, NAD 332); "4.." -> GS1 (UNB 14, NAD 9)
// Die Präfix-Regeln liefert die Format-/Sparten-Konfiguration (_format.js -> codevergabe);
// Fallback = Strom. (Quelle: MIG-Beispiele NAD+MS+9900259000002::293' bzw. ...::332'.)
// ---------------------------------------------------------------------------
// Antwortcodes der Entscheidungsbaum-Diagramme (EBD)
// ---------------------------------------------------------------------------
// Welche EBD für eine Antwortnachricht gelten, steht im AHB (STS+E01 DE1131) und
// in _prozess-meta.js. Welche Codes ein EBD kennt und ob sie zum Cluster
// „Zustimmung" oder „Ablehnung" gehören, steht in den Entscheidungsbaum-Diagrammen
// (_engine/daten/ebd-antwortcodes.js, maschinell aus dem BDEW-Dokument gelesen).
// Die Maske bietet daraus die passenden Codes zur Auswahl an: eine Bestätigung
// zeigt die Zustimmungs-, eine Ablehnung die Ablehnungscodes.
// EBD-Schlüssel einer Prüf-ID: bevorzugt aus der AHB-Struktur (STS+E01 DE1131),
// sonst aus _prozess-meta.js.
function ebdSchluessel(prufId, meta) {
    const aus = [];
    const fm = (typeof formMeta !== 'undefined' && formMeta[prufId]) ? formMeta[prufId] : null;
    if (fm) {
        (fm.instanzen || []).forEach(i => {
            if (i.seg !== 'STS') return;
            const kat = (i.des.find(d => d.de === '9015') || { codes: [] }).codes.map(c => c[0]);
            if (!kat.includes('E01')) return;
            (i.des.find(d => d.de === '1131') || { codes: [] }).codes.forEach(c => {
                if (aus.indexOf(c[0]) < 0) aus.push(c[0]);
            });
        });
    }
    if (!aus.length && meta && meta.ebd) aus.push(meta.ebd);
    return aus;
}

// Auswahlliste der Antwortcodes: { optionen: [{v,t}], vorgabe, hinweis }.
// Die Auswahl selbst steht in `_engine/antwortcode-auswahl.js` — dieselbe Logik nutzt
// die zentrale Formular-Engine für Vollformulare und die übrigen Nachrichtentypen.
function antwortcodeAuswahl(prufId, meta) {
    const leer = { optionen: [], vorgabe: '', hinweis: '' };
    if (!meta || meta.art === 'anfrage') return leer;
    // In der Testumgebung liegt die Bibliothek am window-Objekt der Sandbox.
    const A = (typeof EdiAntwortcodes !== 'undefined') ? EdiAntwortcodes
            : ((typeof window !== 'undefined' && window.EdiAntwortcodes) || null);
    if (!A) return leer;
    const cluster = meta.antwortcluster === 'ablehnung' ? 'Ablehnung'
                  : (meta.antwortcluster === 'zustimmung' ? 'Zustimmung' : '');
    const stand = (typeof formatConfig !== 'undefined' && formatConfig.stand) || '';
    return A.auswahl(ebdSchluessel(prufId, meta), cluster, meta.antwortcode, stand, ebdKontext());
}

// Merkmale des Geschäftsvorfalls, nach denen die Entscheidungsbäume verzweigen.
// Bisher ausgewertet: die Art der Lokation aus der Transaktionsgrundergänzung
// (STS+7, 2. Gruppe C556). Beispiel: Wer ZW4 „Verbrauchende Marktlokation" meldet,
// erreicht in E_0614 die Codes A12/A17 nicht — sie liegen hinter dem Nein-Zweig
// des ersten Prüfschritts.
// Zuordnung der Transaktionsgrundergänzung zu den Merkmalen, nach denen die
// Entscheidungsbäume fragen (ZAP = ruhende Marktlokation, ZW0–ZW2 = Geschäftsvorfall
// 1–3 der Zuordnung, ZW6/ZW7 = pauschale bzw. gemessene Marktlokation).
const ERGAENZUNG_MERKMAL = {
    ZW3: { lokationsart: 'erzeugend' },   ZW4: { lokationsart: 'verbrauchend' },
    ZW5: { lokationsart: 'tranche' },     ZAP: { lokationsart: 'ruhend' },
    ZW0: { geschaeftsvorfall: '1' },      ZW1: { geschaeftsvorfall: '2' },
    ZW2: { geschaeftsvorfall: '3' },
    ZW6: { messtechnik: 'pauschal' },     ZW7: { messtechnik: 'gemessen' },
};
function ebdKontext() {
    const feld = document.getElementById('STS_7');
    return Object.assign({}, (feld && ERGAENZUNG_MERKMAL[feld.value]) || {});
}

// Die Auswahl der Antwortcodes hängt am Geschäftsvorfall: Wird die Lokationsart
// gewechselt, ändert sich, welche Codes der Entscheidungsbaum erreichen kann.
// Deshalb wird die Liste vor jeder Erzeugung nachgeführt.
let letzterEbdKontext = null;
function aktualisiereAntwortcodeAuswahl(prufId) {
    const feld = document.getElementById('STS_E01');
    if (!feld || !feld.options) return;
    const kennung = JSON.stringify(ebdKontext());
    if (kennung === letzterEbdKontext) return;
    letzterEbdKontext = kennung;
    const m = (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null;
    const auswahl = antwortcodeAuswahl(prufId, m);
    if (!auswahl.optionen.length) return;
    const alt = feld.value;
    feld.innerHTML = auswahl.optionen
        .map(o => `<option value="${o.v}"${o.v === auswahl.vorgabe ? ' selected' : ''}>${o.t}</option>`).join('');
    if (alt && auswahl.optionen.some(o => o.v === alt)) feld.value = alt;
    const hinweis = feld.parentNode ? feld.parentNode.querySelector('.hint') : null;
    if (hinweis && auswahl.hinweis) hinweis.textContent = auswahl.hinweis;
}

function codevergabeStelle(mpId) {
    const id = String(mpId || "").trim();
    const regeln = (typeof formatConfig !== 'undefined' && Array.isArray(formatConfig.codevergabe))
        ? formatConfig.codevergabe
        : [ { prefix: "99", unb: "500", nad: "293", name: "BDEW" },
            { prefix: "4",  unb: "14",  nad: "9",   name: "GS1" } ];
    for (const r of regeln) if (id.startsWith(r.prefix)) return r;
    return regeln[0]; // konservativer Standard = Haupt-Vergabestelle der Sparte
}

// --- Phase 2: Kopplung der kuratierten Maske an die AHB-Meta (formMeta) ---
// Die Formular-Meta ist die maschinell extrahierte Prüfgrundlage. Die Maske erzeugt
// Segmente nur noch, wenn der AHB der Prüf-ID sie führt, und übernimmt Qualifier und
// Codes von dort (Entscheidungsliste Phase 2, Muster E1–E9). Ist keine Meta geladen,
// greift die Kopplung nicht ein — dann gilt das bisherige Verhalten.
function metaInstanzen(prufId) {
    if (typeof formMeta === 'undefined' || !formMeta[prufId]) return null;
    return formMeta[prufId].instanzen || null;
}
function metaDeCodes(inst, de) {
    const codes = [];
    (inst.des || []).forEach(d => {
        if (d.de === de) (d.codes || []).forEach(c => codes.push(Array.isArray(c) ? c[0] : c));
    });
    return codes;
}
// Instanzen eines Segments dieser Prüf-ID, optional gefiltert auf einen Code in einem DE.
function metaSegment(prufId, seg, de, code) {
    const inst = metaInstanzen(prufId);
    if (!inst) return null;
    let treffer = inst.filter(i => i.seg === seg);
    if (de && code) treffer = treffer.filter(i => metaDeCodes(i, de).indexOf(code) >= 0);
    return treffer;
}
// Führt der AHB der Prüf-ID das Segment (ggf. mit Code im DE)?
function ahbFuehrt(prufId, seg, de, code) {
    const t = metaSegment(prufId, seg, de, code);
    return t === null ? true : t.length > 0;
}

// Datumsformat-Helfer: intern rechnen die Umrechnungsfunktionen mit JJJJ-MM-TT,
// im Formular wird aber TT.MM.JJJJ angezeigt/eingegeben.
function isoZuDe(iso) {
    if (!iso) return "";
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}
function deZuIso(de) {
    if (!de) return "";
    const s = String(de).trim();
    let m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);       // TT.MM.JJJJ
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);             // bereits ISO
    if (m) return s;
    return "";                                           // unvollständig -> als leer behandeln
}

// Kalender-Button neben den DTM-Textfeldern. Geöffnet wird das gemeinsame Kalenderblatt
// aus `_engine/kalender.js` — es positioniert sich am rechten Rand des Eingabefeldes und
// klappt je nach Bildschirmhälfte nach unten oder oben auf, bleibt also stets vollständig
// sichtbar. Fehlt die Datei (unerwartet), bleibt das versteckte native Datumsfeld als
// Rückfallweg; die Texteingabe im deutschen Format funktioniert ohnehin immer.
function oeffneKalender(feldId) {
    const text = document.getElementById(feldId);
    if (!text) return;
    if (typeof EdiKalender === 'function') { EdiKalender(feldId, 'date'); return; }
    const cal = document.getElementById(feldId + '__cal');
    if (!cal) return;
    const iso = deZuIso(text.value);
    if (iso) cal.value = iso;
    if (typeof cal.showPicker === 'function') {
        try { cal.showPicker(); return; } catch (e) { /* Fallback unten */ }
    }
    cal.focus();
    cal.click();
}

// Übernimmt die Kalenderauswahl (ISO) ins deutsche Textfeld und aktualisiert die Ausgabe.
function uebernehmeKalender(feldId) {
    const text = document.getElementById(feldId);
    const cal = document.getElementById(feldId + '__cal');
    if (!text || !cal || !cal.value) return;
    text.value = isoZuDe(cal.value);
    generateEdifact();
}

// Integrierte gesetzliche MESZ-Tabelle laut BDEW-Vorgabe
const meszTable = {
    2000: { start: "2000-03-26", end: "2000-10-29" },
    2001: { start: "2001-03-25", end: "2001-10-28" },
    2002: { start: "2002-03-31", end: "2002-10-27" },
    2003: { start: "2003-03-30", end: "2003-10-26" },
    2004: { start: "2004-03-28", end: "2004-10-31" },
    2005: { start: "2005-03-27", end: "2005-10-30" },
    2006: { start: "2006-03-26", end: "2006-10-29" },
    2007: { start: "2007-03-25", end: "2007-10-28" },
    2008: { start: "2008-03-30", end: "2008-10-26" },
    2009: { start: "2009-03-29", end: "2009-10-25" },
    2010: { start: "2010-03-28", end: "2010-10-31" },
    2011: { start: "2011-03-27", end: "2011-10-30" },
    2012: { start: "2012-03-25", end: "2012-10-28" },
    2013: { start: "2013-03-31", end: "2013-10-27" },
    2014: { start: "2014-03-30", end: "2014-10-26" },
    2015: { start: "2015-03-29", end: "2015-10-25" },
    2016: { start: "2016-03-27", end: "2016-10-30" },
    2017: { start: "2017-03-26", end: "2017-10-29" },
    2018: { start: "2018-03-25", end: "2018-10-28" },
    2019: { start: "2019-03-31", end: "2019-10-27" },
    2020: { start: "2020-03-29", end: "2020-10-25" },
    2021: { start: "2021-03-28", end: "2021-10-31" },
    2022: { start: "2022-03-27", end: "2022-10-30" },
    2023: { start: "2023-03-26", end: "2023-10-29" },
    2024: { start: "2024-03-31", end: "2024-10-27" },
    2025: { start: "2025-03-30", end: "2025-10-26" },
    2026: { start: "2026-03-29", end: "2026-10-25" },
    2027: { start: "2027-03-28", end: "2027-10-31" },
    2028: { start: "2028-03-26", end: "2028-10-29" },
    2029: { start: "2029-03-25", end: "2029-10-28" },
    2030: { start: "2030-03-31", end: "2030-10-27" },
    2031: { start: "2031-03-30", end: "2031-10-26" },
    2032: { start: "2032-03-28", end: "2032-10-31" }
};

// Prüft präzise anhand der Tabelle, ob ein konkreter Zeitpunkt in die MESZ fällt
function isMESZ(year, month, day, hour) {
    const rule = meszTable[year];
    if (!rule) return false;

    const currentDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`);
    const startUTC = new Date(rule.start + "T01:00:00Z");
    const endUTC = new Date(rule.end + "T01:00:00Z");

    return currentDate >= startUTC && currentDate < endUTC;
}

// Vorbelegung der Transaktionsgrundergänzung (STS+7, 2. Gruppe C556). Der Regelfall
// der Marktkommunikation ist die verbrauchende Marktlokation (ZW4); nennt der
// Anwendungsfall ausdrücklich eine Erzeugung oder eine Tranche, gilt ZW3 bzw. ZW5.
function bevorzugteStsErgaenzung(codes, beschreibung) {
    const text = String(beschreibung || '').toLowerCase();
    const reihenfolge = /erzeug|erz\.|einspeis|eeg|kwk/.test(text) ? ['ZW3', 'ZW4', 'ZW5']
        : (/tranche/.test(text) ? ['ZW5', 'ZW4', 'ZW3'] : ['ZW4', 'ZW3', 'ZW5']);
    return reihenfolge.find(c => codes.indexOf(c) >= 0) || codes[0] || '';
}

// Zeigt unter jedem Datumsfeld die Zeitangabe, die in der Nachricht landet.
// EDIFACT führt Termine in UTC (Format 303: CCYYMMDDHHMM+00). Ein Termin
// „zum 01.09.2026" ist das Tagesende des 31.08.2026: 202608312200+00, weil im
// Sommer MESZ (UTC+2) gilt. Beim Gas beginnt der Tag um 06:00 deutscher Zeit.
// Ohne diesen Hinweis wirkt die erzeugte Zeile wie ein anderer Tag als die Eingabe.
function zeigeZeitangaben(sparte) {
    document.querySelectorAll('.dtm-utc').forEach(ziel => {
        const feld = document.getElementById(ziel.id.replace(/__utc$/, ''));
        const iso = feld ? deZuIso(feld.value) : '';
        if (!iso) { ziel.textContent = ''; return; }
        // DTM+137 (Nachrichtendatum) trägt den Zeitpunkt der Erstellung, nicht das
        // Tagesende — dafür gilt dieselbe Umrechnung wie bei der Erzeugung.
        if (/^DTM_137/.test(ziel.id)) {
            const jetzt = new Date();
            const pz = n => String(n).padStart(2, '0');
            ziel.textContent = `EDIFACT: ${getLiveMessageUtcString(iso)}:303 · Nachrichtendatum, `
                + `Uhrzeit der Erstellung (${pz(jetzt.getHours())}:${pz(jetzt.getMinutes())} deutscher Zeit)`;
            return;
        }
        const utc = convertToMaKoUtcString(iso, sparte);
        const [jahr, monat, tag] = iso.split('-').map(Number);
        const stunde = (sparte === 'GAS') ? 6 : 0;
        const zone = isMESZ(jahr, monat, tag, stunde) ? 'MESZ' : 'MEZ';
        const p = n => String(n).padStart(2, '0');
        let lesart = `${p(tag)}.${p(monat)}.${jahr} ${p(stunde)}:00 ${zone}`;
        if (stunde === 0) {
            const vortag = new Date(Date.UTC(jahr, monat - 1, tag - 1));
            lesart += ` = Tagesende ${p(vortag.getUTCDate())}.${p(vortag.getUTCMonth() + 1)}.${vortag.getUTCFullYear()} 24:00`;
        } else {
            lesart += ' (Beginn des Gastages)';
        }
        ziel.textContent = `EDIFACT: ${utc}:303 · ${lesart}`;
    });
}

// Wandelt prozessuale Datumsangaben (00:00 Uhr Strom / 06:00 Uhr Gas deutsche Zeit) um
function convertToMaKoUtcString(dateString, sparte) {
    if (!dateString) return "";
    
    const parts = dateString.split('-');
    const year = parseInt(parts[0]), month = parseInt(parts[1]), day = parseInt(parts[2]);
    let targetHour = (sparte === 'STROM') ? 0 : 6;

    const checkSommerzeit = isMESZ(year, month, day, targetHour);
    const offset = checkSommerzeit ? 2 : 1;

    let utcHour = targetHour - offset;
    let utcDay = day, utcMonth = month, utcYear = year;

    if (utcHour < 0) {
        utcHour = 24 + utcHour;
        const prevDayObj = new Date(Date.UTC(year, month - 1, day - 1));
        utcDay = prevDayObj.getUTCDate();
        utcMonth = prevDayObj.getUTCMonth() + 1;
        utcYear = prevDayObj.getUTCFullYear();
    }

    const pad = num => String(num).padStart(2, '0');
    return `${utcYear}${pad(utcMonth)}${pad(utcDay)}${pad(utcHour)}00?+00`;
}

// Wandelt das Erstellungsdatum (Live-Uhrzeit deines Systems) präzise um
function getLiveMessageUtcString(dateString) {
    if (!dateString) return "";
    
    const now = new Date();
    const parts = dateString.split('-');
    const year = parseInt(parts[0]), month = parseInt(parts[1]), day = parseInt(parts[2]);
    
    const localHour = now.getHours();
    const localMinute = now.getMinutes();

    const checkSommerzeit = isMESZ(year, month, day, localHour);
    const offset = checkSommerzeit ? 2 : 1;

    let utcHour = localHour - offset;
    let utcDay = day, utcMonth = month, utcYear = year;

    if (utcHour < 0) {
        utcHour = 24 + utcHour;
        const prevDayObj = new Date(Date.UTC(year, month - 1, day - 1));
        utcDay = prevDayObj.getUTCDate();
        utcMonth = prevDayObj.getUTCMonth() + 1;
        utcYear = prevDayObj.getUTCFullYear();
    }

    const pad = num => String(num).padStart(2, '0');
    return `${utcYear}${pad(utcMonth)}${pad(utcDay)}${pad(utcHour)}${pad(localMinute)}?+00`;
}
// Berechnet die Datenaustauschreferenz: vergangene Zeit seit 01.01.2000 00:00:00 Uhr (UTC)
// bis zum Aufrufzeitpunkt, in Millisekunden, als Dezimalzahl ohne Tausendertrennzeichen
// und ohne Nachkommastellen. Wird bei jeder Auswahl einer Prüf-ID neu berechnet und für
// UNB, UNH, BGM, UNT und UNZ verwendet sowie als Vorbelegung für IDE (nach dem
// Vorgangs-Präfix, siehe VORGANG_PRAEFIX).
//
// Namensaufbau der Vorgangsnummer (SG4 IDE DE7402, an..35): <Präfix><DAR>, bei mehreren
// Vorgängen je Nachricht zusätzlich "-<lfd. Nr.>". Derselbe Aufbau gilt in der zentralen
// Engine (_engine/ahb-form-engine.js) — beide Stellen hält scripts/test_vorgangsnummer.js
// zusammen. Das Präfix macht die Nummer in Testsystemen als EdifactGenerator-Vorgang
// erkennbar; die DAR macht sie eindeutig.
const VORGANG_PRAEFIX = "EDIGEN{";
function vorgangsNummer(dar, lfd) {
    const n = Number(lfd) || 1;
    return `${VORGANG_PRAEFIX}${dar}${n > 1 ? "-" + String(n).padStart(2, "0") : ""}`;
}
function calcDatenaustauschreferenz() {
    const referenceEpoch = Date.UTC(2000, 0, 1, 0, 0, 0, 0);
    return Date.now() - referenceEpoch;
}

// generator.js - TEIL 2: Formularsteuerung und EDIFACT-Generierung

// Die PID→Regeldatei-Zuordnung (ahbRulesByPrufId) und die Format-Konfiguration
// (formatConfig) liefert die DATENSCHICHT je Format/Sparte (_pid-registry.js, _format.js),
// nicht die Engine. So trägt die zentrale Engine formatübergreifend (Strom, Gas, …).
// Fallback-Konfiguration, falls _format.js (unerwartet) nicht geladen wurde: Strom-Defaults.
const FORMAT_DEFAULT = { sparte: 'STROM', unhKennung: 'UTILMD:D:11A:UN:S2.2' };
function fmt() {
    return (typeof formatConfig !== 'undefined') ? formatConfig : FORMAT_DEFAULT;
}

// Ist der Code eine Transaktionsgrundergänzung (2. Wiederholung der Gruppe C556 im
// STS+7)? Maßgeblich ist die aus dem MIG gelesene Segmentstruktur
// (_engine/daten/sts-struktur.js); ohne sie greift ersatzweise das Codemuster.
function istStsErgaenzung(code) {
    if (!code) return false;
    const struktur = (typeof stsStruktur !== 'undefined') ? stsStruktur : null;
    if (struktur) {
        const schluessel = (fmt().sparte === 'GAS') ? 'UTILMD_GAS' : 'UTILMD_STROM';
        for (const stand of Object.keys(struktur)) {
            const nachricht = struktur[stand][schluessel];
            if (!nachricht) continue;
            for (const segment of nachricht.segmente || []) {
                const mit9013 = [];
                (segment.komposita || []).forEach((k, i) => {
                    const de = (k.des || []).find(d => d.de === '9013');
                    if (i >= 2 && de) mit9013.push(de.codes || {});
                });
                if (mit9013.length < 2) continue;         // Segment ohne Ergänzung
                if (code in (mit9013[0] || {})) return false;   // steht als Grund im MIG
                if (code in (mit9013[1] || {})) return true;    // steht als Ergänzung im MIG
            }
        }
    }
    return /^(ZW\d|ZX[01]|ZAP|ZZ[BC])$/.test(code);
}

function renderForm() {
    const prufId = document.getElementById('prufId').value;
    const container = document.getElementById('dynamicForm');
    container.innerHTML = '';

    letzterEbdKontext = null;      // Formular wird neu gebaut: Auswahl neu bewerten
    const currentRules = ahbRulesByPrufId[prufId];
    if (!currentRules) {
        container.innerHTML = `<div class="error-box" style="display:block;">Keine Regeldatei für Prüf-ID ${prufId} gefunden (erwartet: src/pruef-ids/${prufId}.js).</div>`;
        return;
    }

    // Datenaustauschreferenz wird bei jeder Auswahl der Prüf-ID neu berechnet und
    // durchgängig für UNB/UNH/BGM/UNT/UNZ sowie als Präfix-Vorbelegung für IDE verwendet.
    currentDAR = String(calcDatenaustauschreferenz());
    // Vorgangsnummer (SG4 IDE DE7402): einheitlicher Namensaufbau in allen Masken und
    // in der zentralen Engine — siehe VORGANG_PRAEFIX weiter oben.

    const defaults = {
        docNum: currentDAR,
        // MP-IDs (NAD DE3039): 13-stellige Marktpartner-IDs. Vorbelegung je Sparte aus
        // formatConfig (Strom 99..-BDEW, Gas 98..-DVGW); Fallback = BDEW-Strom.
        absender: (typeof formatConfig !== 'undefined' && formatConfig.defaultAbsender) || "9900000000001",
        empfanger: (typeof formatConfig !== 'undefined' && formatConfig.defaultEmpfanger) || "9900000000002",
        vorgang: vorgangsNummer(currentDAR, 1),
        refVorgang: "REF" + Math.floor(100000 + Math.random() * 900000),
        malo: "50052281648", qty: "3500", ftx: "AHB-konforme Marktnachricht"
    };
    // MP-ID-Vorbelegung an die Codevergabestellen des AHB koppeln (Muster E6):
    // Erlaubt der AHB der Prüf-ID für Absender/Empfänger die Vergabestelle der
    // Sparten-Vorgabe nicht (z. B. Modell 2: nur 9 = GS1), wird eine Beispiel-GLN
    // vorbelegt (gültige GS1-Prüfziffer), statt eine unzulässige 293/332 zu erzeugen.
    [['MS', 'absender', '4012345000009'], ['MR', 'empfanger', '4012345000016']].forEach(([rolle, feld, gln]) => {
        const inst = metaSegment(prufId, 'NAD', '3035', rolle);
        if (!inst || !inst.length) return;
        const codes = metaDeCodes(inst[0], '3055');
        if (!codes.length) return;
        if (codes.indexOf(codevergabeStelle(defaults[feld]).nad) < 0 && codes.indexOf('9') >= 0)
            defaults[feld] = gln;
    });

    const todayStr = new Date().toISOString().split('T')[0];

    currentRules.segments.forEach(seg => {
        const status = seg.status;

        const div = document.createElement('div');
        div.className = `form-group status-${status}`;
        // Der AHB-Ausdruck des Segments (Bedingung der Segmentgruppe, des Segments und
        // der Codewerte) wird als eigener Bereich ausgegeben. Daran hängt die
        // Bedingungs-Hilfe ihr Fragezeichen-Symbol; ein Klick zeigt die Logik-Symbole
        // und den Klartext jeder referenzierten Bedingung.
        let ausdruck = seg.ahbExpr || '';
        // Zusätzlich am Segment vermerkte Bedingungsnummern anhängen, soweit sie im
        // AHB-Ausdruck nicht ohnehin vorkommen — sonst bliebe ihr Klartext unerreichbar.
        (seg.bedingungen || []).forEach(nr => {
            if (ausdruck.indexOf('[' + nr + ']') < 0) ausdruck += (ausdruck ? ' ' : '') + '[' + nr + ']';
        });
        const exprHtml = ausdruck ? ` <span class="expr">${ausdruck}</span>` : '';
        let html = `<label for="${seg.id}">${seg.name}${exprHtml}</label>`;

        if (seg.id.startsWith('DTM_')) {
            // Datumseingabe im deutschen Format TT.MM.JJJJ (statt nativem type=date,
            // dessen Anzeige vom Browser-Gebietsschema abhängt). Intern wird beim
            // Auslesen nach JJJJ-MM-TT normalisiert.
            // Zusätzlich ein kleiner Kalender-Button, der das gemeinsame Kalenderblatt
            // öffnet; der ausgewählte Wert wird ins deutsche Format übernommen. Das
            // native Datumsfeld dahinter bleibt als Rückfallweg bestehen.
            let defaultDate = (seg.id === 'DTM_137') ? isoZuDe(todayStr) : "";
            html += `<span class="dtm-feld">`
                  + `<input type="text" id="${seg.id}" value="${defaultDate}" `
                  + `placeholder="TT.MM.JJJJ" pattern="\\d{2}\\.\\d{2}\\.\\d{4}" `
                  + `inputmode="numeric" oninput="generateEdifact()">`
                  + `<button type="button" class="dtm-kalender-btn" title="Kalender öffnen" `
                  + `onclick="oeffneKalender('${seg.id}')">📅</button>`
                  + `<input type="date" id="${seg.id}__cal" class="dtm-kalender-input" `
                  + `onchange="uebernehmeKalender('${seg.id}')">`
                  + `</span>`
                  // Zeitangabe der Nachricht mitschreiben: EDIFACT führt Termine in UTC.
                  // Ein Termin „zum 01.09.2026" ist das Tagesende des 31.08.2026 — in der
                  // Nachricht steht 202608312200+00 (MESZ). Bei Gas beginnt der Tag um 06:00.
                  + `<div class="hint dtm-utc" id="${seg.id}__utc"></div>`;
        } else if (seg.id === 'STS_E01' && antwortcodeAuswahl(prufId, (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null).optionen.length) {
            // Antwortcode: Auswahl aller Codes der EBD dieser Prüf-ID, gefiltert nach dem
            // Cluster der Nachricht und nach den Prüfschritten des Entscheidungsbaums.
            // Sie hat Vorrang vor einer kuratierten Optionsliste in der Regeldatei —
            // vier Prüf-IDs führten dort noch Platzhalter („Zustimmung"/„Ablehnung").
            const auswahl = antwortcodeAuswahl(prufId, (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null);
            html += `<select id="${seg.id}" onchange="generateEdifact()">`;
            auswahl.optionen.forEach(o => {
                html += `<option value="${o.v}"${o.v === auswahl.vorgabe ? ' selected' : ''}>${o.t}</option>`;
            });
            html += `</select>`;
            if (auswahl.hinweis) html += `<div class="hint">${auswahl.hinweis}</div>`;
        } else if (seg.isSelect) {
            // Zulässige Optionen sind bereits in der jeweiligen Prüf-ID-Datei auf den
            // korrekten Cluster (Zustimmung bei 55017 / Ablehnung bei 55018) eingeschränkt.
            html += `<select id="${seg.id}" onchange="generateEdifact()">`;
            // Die Ergänzung für das Lieferende (3. C556 des STS+7) gilt nur bei einer
            // befristeten Anmeldung — AHB „Soll [9P0..1]". Deshalb ohne Angabe als Vorgabe.
            if (seg.id === 'STS_7_befristet') html += `<option value="">– keine Angabe –</option>`;
            // Transaktionsgrundergänzung: Regelfall ist die verbrauchende Marktlokation
            // (ZW4); nennt der Anwendungsfall eine Erzeugung oder Tranche, gilt ZW3/ZW5.
            const vorwahl = seg.id === 'STS_7'
                ? bevorzugteStsErgaenzung(seg.options.map(o => o.v), (currentRules && currentRules.bezeichnung) || '')
                : '';
            seg.options.forEach(o => {
                html += `<option value="${o.v}"${o.v === vorwahl ? ' selected' : ''}>${o.t}</option>`;
            });
            html += `</select>`;
        } else if (seg.id === 'STS_E01') {
            // Antwortcode: Auswahl aller Codes der EBD dieser Prüf-ID, gefiltert nach dem
            // Cluster der Nachricht (Bestätigung -> Zustimmung, Ablehnung -> Ablehnung).
            // Quelle sind die Entscheidungsbaum-Diagramme (ebd-antwortcodes.js); welche
            // EBD gelten, sagt der AHB (STS+E01 DE1131) bzw. _prozess-meta.js.
            const m = (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null;
            const auswahl = antwortcodeAuswahl(prufId, m);
            if (auswahl.optionen.length) {
                html += `<select id="${seg.id}" onchange="generateEdifact()">`;
                auswahl.optionen.forEach(o => {
                    const sel = o.v === auswahl.vorgabe ? ' selected' : '';
                    html += `<option value="${o.v}"${sel}>${o.t}</option>`;
                });
                html += `</select>`;
                if (auswahl.hinweis)
                    html += `<div class="hint">${auswahl.hinweis}</div>`;
            } else {
                const info = m && m.antwortcode ? `${m.antwortcode} (${m.ebd})` : 'automatisch';
                html += `<input type="text" id="${seg.id}" value="${info}" readonly style="background-color:var(--readonly-bg); color:var(--readonly-text);">`;
            }
        } else if (seg.id === 'SG6_RFF_Z60') {
            html += `<input type="text" id="${seg.id}" value="" placeholder="Produktpaket-ID (optional)..." oninput="generateEdifact()">`;
        } else if (seg.id === 'FTX') {
            html += `<input type="text" id="${seg.id}" value="" placeholder="Freitext / Bemerkung (optional)..." oninput="generateEdifact()">`;
        } else if (seg.id === 'SG9_QTY') {
            html += `<input type="number" id="${seg.id}" value="${defaults.qty}" oninput="generateEdifact()">`;
        } else if (seg.id === 'RFF_TN') {
            html += `<input type="text" id="${seg.id}" value="${defaults.refVorgang}" placeholder="Vorgangsnummer aus Anfrage..." oninput="generateEdifact()">`;
        } else if (seg.id === 'SG8_SEQ' || seg.id === 'UNH') {
            html += `<input type="text" id="${seg.id}" value="${seg.id === 'UNH' ? 'Referenz: ' + currentDAR + ' | ' + fmt().unhKennung : 'Automatischer SG8-Trigger (SEQ+Z01)'}" readonly style="background-color:var(--readonly-bg); color:var(--readonly-text);">`;
        } else {
            let val = "";
            if (seg.id === 'BGM') val = defaults.docNum;
            else if (seg.id === 'NAD_MS') val = defaults.absender;
            else if (seg.id === 'NAD_MR') val = defaults.empfanger;
            else if (seg.id === 'IDE') val = defaults.vorgang;
            // LOC_Z16 (Marktlokation) / LOC_Z21 (Tranche) werden bewusst NICHT vorbelegt.
            let platzhalter = '';
            if (seg.id === 'LOC_Z16') platzhalter = ' placeholder="ID der Marktlokation (11-stellig)..."';
            else if (seg.id === 'LOC_Z21') platzhalter = ' placeholder="ID der Tranche..."';
            html += `<input type="text" id="${seg.id}" value="${val}"${platzhalter} oninput="generateEdifact()">`;
        }

        if (seg.rule) html += `<div class="hint">Regelhinweis: ${seg.rule}</div>`;
        // Segmente, die laut AHB an einen Codewert eines anderen Feldes gebunden sind
        // (z. B. SG5 LOC+Z22 „Ruhende Marktlokation" ⇐ STS+7 mit ZAP), tragen ihre
        // Bedingung am Formularblock; sichtbar sind sie nur, solange sie zutrifft.
        if (seg.abhaengig) {
            const a = seg.abhaengig;
            if (div.dataset) {
                div.dataset.abhaengigFeld = a.feld;
                div.dataset.abhaengigCode = a.code;
                div.dataset.abhaengigNegiert = a.negiert ? "1" : "0";
            }
            html += `<div class="hint">Gilt, wenn ${a.feld} den Code <code>${a.code}</code> `
                 + `${a.negiert ? "nicht enthält" : "enthält"} (Bedingung [${a.bedingung}]).</div>`;
        }
        div.innerHTML = html;
        container.appendChild(div);
    });

    // Das Auswahlfeld "Transaktionsgrund" (SG4 STS+7, 1. C556) wird mit dem für diesen
    // Prozess hinterlegten Grund vorbelegt, sofern der AHB ihn zulässt. Ohne diese
    // Vorbelegung stünde dort der erste Code der Liste und die Nachricht trüge einen
    // anderen Transaktionsgrund als der Anwendungsfall vorsieht.
    (function vorbelegeTransaktionsgrund() {
        const feld = document.getElementById('STS_7_grund');
        const m = (typeof prozessMeta !== 'undefined') ? prozessMeta[prufId] : null;
        if (!feld || !m || !m.transaktionsgrund) return;
        if (Array.from(feld.options || []).some(o => o.value === m.transaktionsgrund))
            feld.value = m.transaktionsgrund;
    })();

    // Produktpaket-Block (SG8/SG10) nur für die Anmeldung verbrauchende MaLo (55001).
    // Wird als eigener, dynamisch wachsender Container unterhalb der Standardfelder gezeigt.
    if (prufId === '55001' && typeof renderProduktpaket === 'function') {
        const ppWrap = document.createElement('div');
        ppWrap.id = 'produktpaketContainer';
        container.appendChild(ppWrap);
        if (typeof initProduktpaketState === 'function' && !produktpaketState) initProduktpaketState();
        renderProduktpaket(ppWrap);
    }

    const now = new Date();
    const pad = num => String(num).padStart(2, '0');
    // UNB DE0019 (Uhrzeit der Erstellung) = nur HHMM (der Tag steht bereits im Datum DE0017).
    // MIG-Beispiel: UNB+...+211224:1815+...  ->  1815 = HHMM ohne Tag.
    currentTimestamp = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;

    aktualisiereAbhaengigkeiten();
    generateEdifact();
}

// Blendet Formularblöcke ein und aus, deren AHB-Bedingung sich auf die Auswahl in
// einem anderen Feld bezieht. Beispiel Prüf-ID 55001: STS+7 mit ZAP
// (Transaktionsgrundergänzung „ruhende Marktlokation") verlangt SG5 LOC+Z22 und
// schließt SG5 LOC+Z16 aus — und umgekehrt.
function abhaengigkeitErfuellt(feld, code, negiert) {
    const el = document.getElementById(feld);
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
            block.dataset.abhaengigNegiert === "1"
        );
        block.style.display = aktiv ? '' : 'none';
        block.dataset.abhaengigAktiv = aktiv ? '1' : '0';
    });
}

function generateEdifact() {
    const prufId = document.getElementById('prufId').value;
    // Ohne Regeldatei kennt die Maske weder Segmente noch Feldwerte; sie erzeugte sonst
    // eine Nachricht aus reinen Platzhaltern ("ABSENDER", "VORGANG" …), die wie eine
    // gültige Testnachricht aussieht. Deshalb hier abbrechen — renderForm hat den
    // Grund bereits im Formularbereich ausgewiesen.
    if (typeof ahbRulesByPrufId === 'undefined' || !ahbRulesByPrufId[prufId]) {
        const aus = document.getElementById('edifactOutput');
        if (aus) aus.value = '';
        const box = document.getElementById('errorBox');
        if (box) {
            box.innerHTML = `Für Prüf-ID ${prufId} liegt in diesem Formatstand keine Regeldatei vor — `
                          + `es wird keine Nachricht erzeugt.`;
            box.style.display = 'block';
        }
        return;
    }
    // Prozess-Metadaten (BGM-Code, Transaktionsgrund, EBD-Referenz, Antwortcode) je PID.
    // Fallback auf die Kündigung, falls (unerwartet) kein Eintrag existiert.
    const meta = (typeof prozessMeta !== 'undefined' && prozessMeta[prufId])
                 ? prozessMeta[prufId]
                 : { bgm: "E35", art: "anfrage", transaktionsgrund: "E03", ebd: null, antwortcode: null };
    // Dieses Projekt bezieht sich durchgängig auf UTILMD STROM (kein Gas-Anwendungsfall
    // vorgesehen). Ein UI-Auswahlfeld dafür gibt es aktuell nicht - daher fest gesetzt.
    const sparte = fmt().sparte;
    const istAnfrage = meta.art === 'anfrage';
    const errors = [], hinweise = [];
    // Bedingte Formularblöcke vor jeder Erzeugung nachführen, damit Auswahl und
    // sichtbare Felder zusammenpassen.
    if (typeof aktualisiereAbhaengigkeiten === 'function') aktualisiereAbhaengigkeiten();
    // Ein Segment, dessen AHB-Bedingung nicht erfüllt ist, gehört nicht in die
    // Nachricht — auch dann nicht, wenn im ausgeblendeten Feld noch ein Wert steht.
    const istAktiv = seg => {
        if (!seg || !seg.abhaengig) return true;
        return abhaengigkeitErfuellt(seg.abhaengig.feld, seg.abhaengig.code, !!seg.abhaengig.negiert);
    };
    aktualisiereAntwortcodeAuswahl(prufId);
    const getVal = id => document.getElementById(id) ? document.getElementById(id).value : '';
    // Datumsfelder werden im Formular als TT.MM.JJJJ geführt -> für die interne
    // UTC-Umrechnung nach JJJJ-MM-TT normalisieren.
    const getDate = id => deZuIso(getVal(id));
    zeigeZeitangaben(sparte);
    
    const absender = getVal('NAD_MS') || 'ABSENDER', empfanger = getVal('NAD_MR') || 'EMPFANGER';
    const docNum = getVal('BGM') || 'DOC-NUM';
    // Führt eine Prüf-ID kein eigenes IDE-Feld, wird die Vorgangsnummer nach demselben
    // Namensaufbau gebildet wie die Vorbelegung (siehe vorgangsNummer) — nie als
    // Platzhaltertext, der später in einer Testnachricht landen könnte.
    const vorgang = getVal('IDE') || vorgangsNummer(currentDAR, 1),
          refVorgang = getVal('RFF_TN') || 'REF-VORGANG';
    
    const rawDate137 = getDate('DTM_137'), rawDate93 = getDate('DTM_93'), rawDateZ05 = getDate('DTM_Z05'), rawDate471 = getDate('DTM_471'), rawDateZ10 = getDate('DTM_Z10');
    const rawDate92 = getDate('DTM_92');
    // Verwendungszeitraum der Abrechnungsdaten (Z25 = Daten ab, Z26 = Daten bis).
    const rawDateZ25 = getDate('DTM_Z25'), rawDateZ26 = getDate('DTM_Z26');
    const sts7 = getVal('STS_7'), stsE01 = getVal('STS_E01'), ftxText = getVal('FTX'), malo = getVal('LOC_Z16'), qty = getVal('SG9_QTY');

    // --- Prozess-spezifische Regelprüfungen ---
    // Sie gelten nur, wo der AHB der Prüf-ID die betroffenen Felder überhaupt führt.
    // Ohne diese Bindung schlugen sie auch in Prüf-IDs an, die die Felder gar nicht
    // kennen (etwa die Lokationsregel [348] in den reinen Antwortnachrichten).
    const feldDa = id => !!document.getElementById(id);
    // Kündigung 8.1: Entweder DTM+93 (Ende zum) oder DTM+471 (nächstmöglicher Termin).
    if ((prufId === '55016' || prufId === '55017') && feldDa('DTM_93') && feldDa('DTM_471')
        && !rawDate93 && !rawDate471) {
        errors.push("<b>Regel verletzt:</b> Entweder DTM+93 oder DTM+471 muss befüllt sein.");
    }
    // An-/Abmeldung (8.2/8.9/8.6): DTM+92 (Beginn zum) ist Muss in der Anfrage.
    if (meta.kapitel && ['8.2','8.9','8.6'].includes(meta.kapitel) && istAnfrage && feldDa('DTM_92') && !rawDate92) {
        errors.push("<b>Regel verletzt:</b> In diesem Anwendungsfall ist DTM+92 (Beginn zum) anzugeben.");
    }
    // Bei verbrauchender/erzeugender Marktlokation (ZW4/ZW3) muss eine Lokation angegeben
    // sein - entweder die Marktlokation (LOC+Z16) ODER die Tranche (LOC+Z21), Bedingung [348].
    if ((sts7 === 'ZW4' || sts7 === 'ZW3') && (feldDa('LOC_Z16') || feldDa('LOC_Z21'))
        && !malo && !getVal('LOC_Z21')) {
        errors.push("<b>Regel verletzt [348]:</b> Es muss die Marktlokation (LOC+Z16) oder die Tranche (LOC+Z21) angegeben werden.");
    }

    // Muss-Segmente, deren Bedingung erfüllt ist, die aber keinen Wert tragen: harter Fehler.
    const regelnFuerPruefung = (typeof ahbRulesByPrufId !== 'undefined') ? ahbRulesByPrufId[prufId] : null;
    if (regelnFuerPruefung) {
        regelnFuerPruefung.segments.forEach(s => {
            if (!/^(LOC|RFF|DTM)_/.test(s.id)) return;
            if (!s.abhaengig || !istAktiv(s)) return;
            if (!/^Muss/.test(s.status || '')) return;
            if (!getVal(s.id)) errors.push(`<b>Pflichtangabe fehlt:</b> ${s.name} (Bedingung [${s.abhaengig.bedingung}] ist erfüllt).`);
        });
    }

    const errBox = document.getElementById('errorBox');
    errBox.style.display = (errors.length + hinweise.length) > 0 ? 'block' : 'none';
    errBox.innerHTML = errors.join('<br>')
        + (errors.length && hinweise.length ? '<br>' : '')
        + hinweise.map(h => `<span class="hint">Hinweis: ${h}</span>`).join('<br>');

    const now = new Date();
    const shortYear = String(now.getUTCFullYear()).substring(2, 4);
    const pad = num => String(num).padStart(2, '0');
    const unbDate = `${shortYear}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}`;

    let segments = [];
    segments.push("UNA:+.? '");
    // UNB DE0007 (Partner-ID-Qualifier) je Aussteller: 500=BDEW (99...), 14=GS1 (4...).
    const absQ = codevergabeStelle(absender), empQ = codevergabeStelle(empfanger);
    // UNB DE0020=Datenaustauschreferenz, DE0026=Anwendungsreferenz (bei UTILMD leer),
    // DE0035=Test-Kennzeichen. "1" kennzeichnet eine Testnachricht (Kernzweck dieses Tools).
    // Reihenfolge: ...+<DAR>+<AnwRef>+<Empf.Ref>+<Verarb.Prio>+<Bestaetigung>+<Kennung>+<Testkz>
    segments.push(`UNB+UNOC:3+${absender}:${absQ.unb}+${empfanger}:${empQ.unb}+${unbDate}:${currentTimestamp}+${currentDAR}++++++1'`);
    segments.push(`UNH+${currentDAR}+${fmt().unhKennung}'`);
    // BGM DE1001 je Prozess: E01=Anmeldung, E02=Abmeldung, E35=Kündigung. Führt der
    // AHB der Prüf-ID einen anderen Dokumentennamen (Muster E7 — 55074: Z14,
    // 44019: E06), gilt der AHB vor der Prozess-Meta.
    const bgmInst = metaSegment(prufId, 'BGM');
    const bgmCodes = (bgmInst && bgmInst.length) ? metaDeCodes(bgmInst[0], '1001') : [];
    const bgmCode = (bgmCodes.length && bgmCodes.indexOf(meta.bgm) < 0) ? bgmCodes[0] : meta.bgm;
    segments.push(`BGM+${bgmCode}+${docNum}'`);
    
    if (rawDate137) segments.push(`DTM+137:${getLiveMessageUtcString(rawDate137)}:303'`);
    
    // NAD DE3039 = MP-ID, dann C082: DE3042 (leer) + DE3055 (Codevergabestelle).
    // Struktur laut MIG-Beispiel: NAD+MS+9900259000002::293'  (also "<ID>::<Stelle>").
    segments.push(`NAD+MS+${absender}::${absQ.nad}'`, `NAD+MR+${empfanger}::${empQ.nad}'`, `IDE+24+${vorgang}'`);
    
    // DTM-Terminfelder (prozessual, deutsche Zeit -> UTC via Faustregel):
    if (rawDate92) segments.push(`DTM+92:${convertToMaKoUtcString(rawDate92, sparte)}:303'`);   // Beginn zum
    if (rawDate93) segments.push(`DTM+93:${convertToMaKoUtcString(rawDate93, sparte)}:303'`);   // Ende zum / Vertragsende
    if (rawDateZ05) segments.push(`DTM+Z05:${convertToMaKoUtcString(rawDateZ05, sparte)}:303'`);
    if (rawDate471) segments.push(`DTM+471:${convertToMaKoUtcString(rawDate471, sparte)}:303'`);
    if (rawDateZ10) segments.push(`DTM+Z10:${convertToMaKoUtcString(rawDateZ10, sparte)}:303'`);
    // (Verwendungszeitraum DTM+Z25/Z26 wird weiter unten als eigene SG6-Gruppe
    //  RFF+Z49/Z53 + DTM emittiert - siehe Nutzdaten-Block.)

    // STS+7: Aufbau laut MIG   STS+7++<Grund>+<Ergänzung>+<Ergänzung befristetes Lieferende>
    // Alle drei stehen im DE 9013 dreier Wiederholungen der Gruppe C556:
    //   - Grund (1. C556):     Feld STS_7_grund, sonst der Grund aus prozessMeta
    //   - Ergänzung (2. C556): Feld STS_7 (ZW3 „Erzeugende MaLo", ZAP „ruhende MaLo" …)
    //   - Lieferende (3. C556): Feld STS_7_befristet, nur bei befristeter Anmeldung
    // MIG-Beispiel: STS+7++E01+ZW4+E03'
    const sts7grund = getVal('STS_7_grund'), sts7befristet = getVal('STS_7_befristet');
    let stsGrund = sts7grund || meta.transaktionsgrund;
    let stsErgaenzung = "";
    // Ob ein Code Grund oder Ergänzung ist, sagt das MIG (sts-struktur.js) — nicht die
    // Gestalt des Codes: ZX6 „Änderung Daten der MaLo" ist ein Grund, ZX0 „Fall 3" eine
    // Ergänzung. Ohne geladene Struktur gilt ersatzweise das alte Codemuster.
    if (sts7 && istStsErgaenzung(sts7)) stsErgaenzung = sts7;
    else if (!sts7grund && sts7) stsGrund = sts7;                       // STS_7 trägt den Grund (z. B. Z26)
    // STS+7 nur, wenn ein Transaktionsgrund existiert. MaBiS-/Listennachrichten (Kap. 13, BGM Z05/Z07/…)
    // tragen keinen Transaktionsgrund und dürfen daher kein leeres STS+7 erzeugen.
    // Zusätzlich (Muster E8): nur, wenn der AHB der Prüf-ID das STS+7 überhaupt führt
    // (55074/44019 führen gar kein STS, 55224 nur den Antwortstatus STS+E01).
    if (stsGrund && ahbFuehrt(prufId, 'STS', '9015', '7')) {
        const stsTeile = [stsGrund, stsErgaenzung, sts7befristet];
        while (stsTeile.length && !stsTeile[stsTeile.length - 1]) stsTeile.pop();
        segments.push(`STS+7++${stsTeile.join("+")}'`);
    }
    // STS+E01 (Status der Antwort) nur bei Antwortnachrichten (Bestätigung/Ablehnung).
    // DE1131 = EBD-Nummer (Pflicht, BDEW-Status R). Antwortcode = cluster-korrekter Vertreter
    // aus dem jeweiligen EBD (Zustimmung bei Bestätigung, Ablehnung bei Ablehnung).
    // Nutzt dieser Prozess Verwendungszeiträume (Abrechnungsdaten ZX2/ZX3/ZX4, Stammdaten-
    // änderung ZX5-ZY2/ZAM)? Dann trägt die Antwort in STS+E01 zusätzlich die Zeitraum-ID (DE9012).
    // Maßgeblich ist der AHB der Prüf-ID: Führt sie das Feld für die Qualität des
    // Verwendungszeitraums (aus SG6 RFF DE1153 übernommen), nutzt der Prozess
    // Verwendungszeiträume — unabhängig vom Transaktionsgrund. Die Grundliste bleibt
    // als Rückfall für Regeldateien ohne dieses Feld.
    const vzFeld = (regelnFuerPruefung && (regelnFuerPruefung.segments || []).find(s => s.id === 'RFF_VZ_QUALITAET')) || null;
    const vzCodes = vzFeld ? (vzFeld.options || []).map(o => o.v).filter(Boolean) : [];
    const nutztVerwendungszeitraum = !!vzFeld || /^(ZX[2-9]|ZY[0-2]|ZAM)$/.test(stsGrund || '');
    const zeitraumId = '1';
    // Qualität des Verwendungszeitraums: Führt der AHB dieser Prüf-ID „Gültige Daten"
    // (Z49) — der Fall der Datenübermittlung —, bleibt Z49 die Vorgabe. Die Qualitäten
    // der Datenclearing-Rückmeldungen (Z47/Z48/Z54/Z55) kennt nur der Absender; ohne
    // Auswahl entsteht dort weder ein Zeitraum-Segment noch ein Verweis darauf.
    //   - Datenübermittlung (Z49 „Gültige Daten" vorhanden): Vorgabe Z49 wie bisher.
    //   - Datenclearing-Rückmeldungen (Z47 „Im System vorhandene Daten", Z54 „… keine
    //     Daten vorhanden", Z48 „Erwartete Daten", Z55 „Keine Daten erwartet"): Vorgabe
    //     ist die erste im AHB geführte Qualität; welche fachlich zutrifft, weiß nur der
    //     Absender — deshalb der Hinweis und die Auswahl im Formular.
    const vzGewaehlt = getVal('RFF_VZ_QUALITAET');
    const vzQualitaet = vzGewaehlt
        || (!vzCodes.length || vzCodes.indexOf('Z49') >= 0 ? 'Z49' : vzCodes[0]);
    // Führt der AHB der Prüf-ID den Verwendungszeitraum (vzFeld), gehört die SG6-Gruppe
    // in jede Nachricht dieses Prozesses — auch in die Rückmeldungen des Datenclearings,
    // die sich in STS+E01 auf ihre Zeitraum-ID beziehen ([22]).
    const erzeugtZeitraum = nutztVerwendungszeitraum && !!vzQualitaet
        && (!!vzFeld || rawDateZ25 || rawDateZ26 || meta.art === 'anfrage');
    if (erzeugtZeitraum && !vzGewaehlt && vzCodes.length && vzCodes.indexOf('Z49') < 0)
        hinweise.push('Verwendungszeitraum: Vorgabe ' + vzQualitaet + ' — zutreffende Qualität wählen ('
            + vzCodes.join(' / ') + ').');
    if (!istAnfrage && meta.antwortcode) {
        // DE1131 (EBD-Referenz) ist optional: einige Prozesse (z. B. Gas 7.2) tragen STS+E01
        // ohne EBD-Nummer. Dann nur Antwortcode, sonst Antwortcode:EBD. Bei Verwendungszeitraum-
        // Prozessen folgt als Element 4 die Zeitraum-ID (DE9012), auf die sich die Antwort bezieht.
        // Gewählter Antwortcode aus dem Auswahlfeld („A51:E_0623"), sonst der in
        // _prozess-meta.js hinterlegte cluster-repräsentative Vertreter.
        const gewaehlt = (stsE01 || '').split(':');
        // Codes der Entscheidungsbäume sind A01…A99/A**, die der Codelisten-Kapitel
        // (S_xxxx) tragen die Antwortcodes der Servicenachrichten (E14, Z12, ZE1 …).
        const code = gewaehlt[0] && /^[A-Z]{1,2}[0-9*]{1,2}$/.test(gewaehlt[0]) ? gewaehlt[0] : meta.antwortcode;
        const ebdNr = gewaehlt[1] || meta.ebd;
        // Aufbau der Gruppe C556: DE9013 (Antwortcode) : DE1131 (EBD-Nr.) : DE3055 (nicht
        // benutzt) : DE9012 (Zeitraum-ID). Die Zeitraum-ID ist also das vierte Unterelement
        // derselben Gruppe, kein eigenes Datenelement — MIG-Beispiel: STS+E01++A01:E_0004::2'
        const c556 = [code, ebdNr || '', '', erzeugtZeitraum ? zeitraumId : ''];
        while (c556.length && !c556[c556.length - 1]) c556.pop();
        segments.push(`STS+E01++${c556.join(':')}'`);
    }
    // FTX aus der Meta (Muster E1/E2): Der Qualifier (DE4451) kommt aus dem AHB der
    // Prüf-ID (Bemerkung = ACB, nicht der frühere Platzhalter ABO); führt der AHB
    // gar kein FTX, entsteht auch keines. Ohne geladene Meta bleibt das alte Verhalten.
    const ftxInst = metaSegment(prufId, 'FTX');
    const ftxQualifier = (ftxInst && ftxInst.length && metaDeCodes(ftxInst[0], '4451')[0]) || null;
    if (ftxText) segments.push(`FTX+${ftxQualifier || 'ACB'}+++${ftxText}'`);
    // Ablehnungsbegründung: Bei Ablehnungen (insb. Antwortcode "Sonstiges" wie A99/E14) verlangt der
    // AHB ([23]) eine Begründung im Freitext — als Beispieltext vorbelegt, sofern die
    // Ablehnung keinen eigenen Bemerkungstext trägt und der AHB das FTX führt.
    else if (meta.art === 'ablehnung' && (ftxInst === null || ftxQualifier))
        segments.push(`FTX+${ftxQualifier || 'ABO'}+++Ablehnung - Begruendung (Beispiel)'`);
    // LOC-Segmente generisch aus den Regeln dieser PID erzeugen (Strom: LOC+Z16/Z21;
    // Gas: LOC+172 Meldepunkt). Nach der ID (DE3225) sind DE1131/DE3055 "Nicht benutzt".
    const aktRules = (typeof ahbRulesByPrufId !== 'undefined') ? ahbRulesByPrufId[prufId] : null;
    if (aktRules) {
        aktRules.segments.filter(s => /^LOC_/.test(s.id)).forEach(s => {
            const qual = s.id.substring(4);              // "Z16" / "Z21" / "172" / "Z22"
            const v = getVal(s.id);
            if (!v) return;
            if (!istAktiv(s)) {   // durch AHB-Bedingung ausgeschlossen
                hinweise.push(`LOC+${qual} wurde nicht übernommen: zulässig nur, wenn `
                    + `${s.abhaengig.feld} den Code ${s.abhaengig.code} `
                    + `${s.abhaengig.negiert ? 'nicht enthält' : 'enthält'} (Bedingung [${s.abhaengig.bedingung}]).`);
                return;
            }
            segments.push(`LOC+${qual}+${v}'`);
        });
    }
    
    segments.push(`RFF+Z13:${prufId}'`);
    // RFF+TN (Referenz-Vorgangsnummer aus der Anfrage) nur in ANTWORTnachrichten
    // (Bestätigung/Ablehnung), NICHT in Meldungen oder Anfragen.
    const istAntwort = meta.art === 'bestaetigung' || meta.art === 'ablehnung';
    if (istAntwort && refVorgang) segments.push(`RFF+TN:${refVorgang}'`);
    // Generische RFF-Referenzfelder aus den PID-Regeln (z. B. RFF+AAV "Nummer der Anfrage" bei der
    // GDA-Antwort 9.5, RFF+Z43 "Referenznummer der Bestellung" bei 9.3.8). RFF+TN (Antwort-
    // Vorgangsnummer) und RFF+Z13 (Prüfidentifikator) werden oben gesondert gesetzt.
    if (aktRules) {
        aktRules.segments.filter(s => /^RFF_/.test(s.id) && !['RFF_TN','RFF_Z13'].includes(s.id)).forEach(s => {
            if (!istAktiv(s)) return;   // durch AHB-Bedingung ausgeschlossen
            const qual = s.id.substring(4);
            const v = getVal(s.id);
            // Referenzen, die der AHB nur als Kann/Soll führt, gehören nur dann in die
            // Nachricht, wenn sie auch befüllt sind. Muss-Referenzen erhalten weiterhin
            // einen Platzhalter, damit die Nachricht strukturell vollständig bleibt.
            if (!v && (s.status || '') !== 'Muss') return;
            segments.push(`RFF+${qual}:${v || 'REF-' + qual}'`);
        });
    }

    // --- Nutzdaten: Verwendungszeitraum der Daten (SG6 RFF+Z49/Z53 + DTM+Z25/Z26) ---
    // AHB-konforme Struktur der Abrechnungs- und Stammdatenänderungsprozesse: Die Daten gelten
    // für einen Verwendungszeitraum, der über eine eigene SG6-Gruppe getragen wird:
    //   RFF+<Qualität>::<Zeitraum-ID>   Qualität = Z49 (Gültige Daten) / Z53 (Keine Daten),
    //                                    Zeitraum-ID in DE1156 (3. Komponente).
    //   DTM+Z25:<ab>:303   Verwendung der Daten ab
    //   DTM+Z26:<bis>:303  Verwendung der Daten bis
    // Die zugehörige Antwort referenziert die Zeitraum-ID in STS+E01 (DE9012, oben gesetzt).
    // Mehrere Zeitscheiben: Praxis der Stammdatenübermittlung nach einem Lieferbeginn
    // ist die Aufteilung in „Keine Daten" (Z53) bis zum Lieferbeginn und „Gültige Daten"
    // (Z49) ab dem Lieferbeginn. Der AHB führt die Zeitraum-ID fortlaufend ([126]); ein
    // „bis" ist nur für Zeiträume nötig, zu denen ein späterer existiert ([471]).
    // Die zweite Zeitscheibe wird nur ausgegeben, wenn ihre Felder gefüllt sind.
    if (erzeugtZeitraum) {
        const qualitaet = vzQualitaet;
        segments.push(`RFF+${qualitaet}::${zeitraumId}'`);
        if (rawDateZ25) segments.push(`DTM+Z25:${convertToMaKoUtcString(rawDateZ25, sparte)}:303'`);
        if (rawDateZ26) segments.push(`DTM+Z26:${convertToMaKoUtcString(rawDateZ26, sparte)}:303'`);
        const rawDateZ25_2 = getDate('DTM_Z25_2'), rawDateZ26_2 = getDate('DTM_Z26_2');
        if (rawDateZ25_2 || rawDateZ26_2) {
            const qualitaet2 = getVal('RFF_VZ_QUALITAET_2') || (qualitaet === 'Z49' ? 'Z53' : 'Z49');
            segments.push(`RFF+${qualitaet2}::${Number(zeitraumId) + 1}'`);
            if (rawDateZ25_2) segments.push(`DTM+Z25:${convertToMaKoUtcString(rawDateZ25_2, sparte)}:303'`);
            if (rawDateZ26_2) segments.push(`DTM+Z26:${convertToMaKoUtcString(rawDateZ26_2, sparte)}:303'`);
        }
    }

    // --- Nutzdaten: geänderte/abgefragte Stammdaten je Objektart (SG8 SEQ + SG10 CCI/CAV) ---
    // Datengetrieben aus der PID-Regel (gleiche Konvention wie der Produktpaket-Block):
    //   rule.nutzdaten = [{ seq: "Z51",                         // SG8 SEQ+<DE1229 Objektcode>
    //                       merkmale: [{ cci: "ZB3",            // SG10 CCI+<DE7037 Merkmal>
    //                         cav: [{ code: "Z91", wert: "…" }, // SG10 CAV+<DE7111/7110>:::<Wert>
    //                               { code: "Z39" }] }] }]
    // SG8 SEQ eröffnet die Objekt-Datengruppe; je Merkmal ein CCI, je Merkmalswert ein CAV
    // (Wert im 4. Composite-Element, analog CAV+ZH9:::<Wert> im Produktpaket).
    // Nutzdatengruppen: entweder explizit in der PID-Regel (rule.nutzdaten) oder - für Stammdaten-
    // änderungs-ANFRAGEN - aus dem zentralen Objekt-Katalog (nutzdatenKatalog[Transaktionsgrund]).
    let nutzGruppen = (aktRules && Array.isArray(aktRules.nutzdaten)) ? aktRules.nutzdaten : null;
    if (!nutzGruppen && meta.art === 'anfrage' && typeof nutzdatenKatalog !== 'undefined') {
        // Die Objektart des Prozesses steht in den Prozess-Metadaten; sie bestimmt den
        // Nutzdaten-Block. Erst wenn dort nichts hinterlegt ist, entscheidet die
        // Auswahl im Formular (STS+7). Andernfalls verlöre eine geänderte Auswahl in
        // der Transaktionsgrundergänzung den kompletten SG8/SG10-Block.
        nutzGruppen = nutzdatenKatalog[meta.transaktionsgrund] || nutzdatenKatalog[stsGrund] || null;
    }
    // Kopplung an die Meta (Muster E3): nur Objektgruppen, Merkmale und Werte erzeugen,
    // die der AHB der Prüf-ID führt — der generische Katalog gilt sonst pauschal und
    // erzeugte Segmente ohne AHB-Grundlage (z. B. 55063 ohne jegliche Objektdaten).
    if (nutzGruppen && metaInstanzen(prufId)) {
        nutzGruppen = nutzGruppen
            .filter(g => ahbFuehrt(prufId, 'SEQ', '1229', g.seq))
            .map(g => Object.assign({}, g, { merkmale: (g.merkmale || [])
                .filter(m => ahbFuehrt(prufId, 'CCI', '7037', m.cci))
                .map(m => Object.assign({}, m, { cav: (m.cav || [])
                    .filter(v => ahbFuehrt(prufId, 'CAV', '7111', v.code)) })) }));
        if (!nutzGruppen.length) nutzGruppen = null;
    }
    if (nutzGruppen) {
        nutzGruppen.forEach(gruppe => {
            segments.push(`SEQ+${gruppe.seq}'`);
            // SG8 PIA+5 mit OBIS-Kennzahl (DE7140) + Artangabe (DE7143). Der interne Doppelpunkt der
            // OBIS-Kennzahl (z. B. 1-1:1.8.0) wird als Release-Zeichen-Escape ?: kodiert, damit er
            // nicht als Komponententrenner gilt (PIA+5+1-1?:1.8.0:SRW).
            if (gruppe.pia) {
                const obis = String(gruppe.pia.obis || '').replace(/:/g, '?:');
                segments.push(`PIA+5+${obis}${gruppe.pia.art ? ':' + gruppe.pia.art : ''}'`);
            }
            (gruppe.merkmale || []).forEach(m => {
                // CCI-Merkmalform: Klassentyp (DE7059) leer, Merkmal (DE7037) in Element 3 -> CCI+++<Merkmal>.
                segments.push(`CCI+++${m.cci || ''}'`);
                (m.cav || []).forEach(v => {
                    // CAV C889: DE7111 (Code) : DE1131 : DE3055 : DE7110.
                    // Regelfall: Wert im DE7110 (4. Komponente) -> CAV+<Code>:::<Wert>
                    // (identisch zum Produktpaket CAV+ZH9:::<Wert>).
                    // Zugeordnete-Marktpartner-CAV (Muster E4, quellengeprüft am AHB
                    // S2.1, SG10 CAV Messstellenbetreiber): DE1131 = MP-ID (frei),
                    // DE7110 = Art-Code (Z39 grundzuständig / Z40 wettbewerblich /
                    // Z41 Auffang-MSB) -> CAV+<Code>:<MP-ID>::<Art>.
                    const cavInst = (metaSegment(prufId, 'CAV', '7111', v.code) || [])[0];
                    const codes7110 = cavInst ? metaDeCodes(cavInst, '7110') : [];
                    const frei1131 = cavInst && (cavInst.des || []).some(d => d.de === '1131' && !(d.codes || []).length);
                    if (v.wert !== undefined && frei1131 && codes7110.length)
                        segments.push(`CAV+${v.code}:${v.wert}::${codes7110[0]}'`);
                    else segments.push(v.wert !== undefined ? `CAV+${v.code}:::${v.wert}'` : `CAV+${v.code}'`);
                });
            });
        });
    }

    // Produktpaket-Block (SG8 SEQ+Z79/PIA/CCI/CAV, SG8 SEQ+ZH0, SG10 CCI+Z65)
    // nur für die Anmeldung verbrauchende MaLo (55001). SG6 RFF+Z60 (informativ zur
    // Umsetzung geplantes Produktpaket) trägt die 1. Produktpaket-ID.
    if (prufId === '55001' && typeof buildProduktpaketSegments === 'function') {
        const ppState = (typeof produktpaketState !== 'undefined') ? produktpaketState : null;
        if (ppState && ppState.pakete && ppState.pakete.length > 0) {
            segments.push(`RFF+Z60:${ppState.pakete[0].paketId}'`);
        }
        buildProduktpaketSegments().forEach(s => segments.push(s));
    }
    
    // SG8/SG9 (Daten der Marktlokation / Vorjahresverbrauch): nur Kündigungs-Bestätigung 55017 bei ZW4.
    if (prufId === '55017' && sts7 === 'ZW4') {
        segments.push("SEQ+Z01'");
        if (qty) segments.push(`QTY+Z09:${qty}:KWH'`);
    }
    
    // UNT DE0074 = Anzahl aller Segmente von UNH bis UNT EINSCHLIESSLICH.
    // "segments" enthält hier UNA + UNB (2 Hüllsegmente, zählen nicht), aber noch nicht UNT selbst.
    // Daher: length - 2 (UNA/UNB raus) + 1 (UNT rein) = length - 1.
    segments.push(`UNT+${segments.length - 1}+${currentDAR}'`, `UNZ+1+${currentDAR}'`); 

    document.getElementById('edifactOutput').value = segments.join(document.getElementById('lineBreaks').checked ? "\n" : "");
    // Folgenachrichten des Geschäftsprozesses anbieten (vorbefüllt aus dieser Nachricht).
    // Bei Regelverstößen wird nichts angeboten — die Quellnachricht wäre nicht belastbar.
    if (typeof EdiFolgenachrichten !== 'undefined') {
        if (errors.length) {
            const fn = document.getElementById('folgeNachrichten'); if (fn) fn.style.display = 'none';
        } else {
            EdiFolgenachrichten.zeigeAutomatisch(prufId, document.getElementById('edifactOutput').value, 'edifactOutput');
        }
    }
}

// Erzeugte Nachricht als marktkonforme Übertragungsdatei sichern. Dateiname und Inhalt
// bildet `_engine/nachricht-speichern.js` nach den Allgemeinen Festlegungen (Abschnitt
// 2.12) — dieselbe Funktion nutzen alle Generatorseiten und der Validator. Die Angaben
// stammen aus der Nachricht selbst; die Zeilenumbrüche des Editors entfallen dort, ein
// Umschalten des Schalters und ein erneutes Erzeugen sind daher nicht mehr nötig.
function downloadEdifact() {
    if (typeof EdiSpeichern === 'undefined') return;
    EdiSpeichern.speichere('edifactOutput', 'speicherHinweis');
}

// Robuster Start: window.onload feuert nicht zuverlässig, wenn ein vorher geladenes
// Skript eine Ausnahme wirft oder die Seite schon fertig geladen ist (z. B. beim
// direkten Öffnen per file://). Daher DOMContentLoaded nutzen und zusätzlich einen
// Fallback, falls das Event bereits durch ist. Außerdem prüfen wir, ob die
// Prüf-ID-Regeldateien tatsächlich geladen wurden, und zeigen sonst eine sichtbare
// Meldung statt eines leeren Formulars.
function startGenerator() {
    if (typeof prozessMeta === 'undefined'
        || typeof ahbRulesByPrufId === 'undefined') {
        const box = document.getElementById('errorBox');
        if (box) {
            box.style.display = 'block';
            box.innerHTML = '<b>Ladefehler:</b> Die Regeldateien unter '
                + '<code>src/pruef-ids/*.js</code> wurden nicht gefunden. '
                + 'Bitte die Seite über einen lokalen Webserver öffnen '
                + '(z. B. VS-Code-Erweiterung „Live Server") und sicherstellen, '
                + 'dass die Ordnerstruktur erhalten bleibt.';
        }
        return;
    }
    renderForm();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGenerator);
} else {
    // DOM ist bereits geladen -> direkt starten
    startGenerator();
}