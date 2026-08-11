// test_umbau_pidzerlegung.js — Absicherung der Prüf-ID-Zerlegung je Nachrichtentyp.
//
// Frage: Welche Nachrichtentypen können in EINER UNH-Nachricht mehrere
// UNTERSCHIEDLICHE Prüf-IDs (RFF+Z13) aggregieren? Nur dort, wo der RFF+Z13 in
// einer je Vorgang wiederholten Gruppe sitzt: UTILMD/UTILTS (SG6 unter IDE),
// IFTSTA (SG4 EQD bzw. SG15 CNI) und INSRPT (SG4 nach DOC). Bei den übrigen Typen
// steht der RFF+Z13 im Nachrichtenkopf (SG1/ohne SG) — je UNH genau eine Prüf-ID;
// mehrere Prüf-IDs kommen nur über MEHRERE UNH je Datei vor (typunabhängig über
// EdiUmbau.nachrichten zerlegt). Dieser Test hält beide Fälle fest.
const U = require('../_engine/umbau.js');

let fails = 0;
const ok = (b, t) => { console.log((b ? '  OK  ' : ' FAIL ') + t); if (!b) fails++; };
const Q = "'";  // Segmentende
function bau(segs){ return "UNA:+.? " + Q + segs.join(Q) + Q; }
function pids(text){ return [...new Set(U.vorgaenge(U.zerlege(text)).map(v => v.pruefi).filter(Boolean))]; }
function nachrichten(text){ return U.nachrichten(U.zerlege(text)).length; }

const UNB = "UNB+UNOC:3+9900000000001:500+9900000000002:500+260801:0800+R1";
const UNZ = "UNZ+1+R1";

// ---- Typen mit Prüf-ID JE VORGANG (mehrere PID je UNH möglich) --------------

// UTILMD: zwei IDE+24-Vorgänge mit unterschiedlichen Prüf-IDs
ok(JSON.stringify(pids(bau([UNB,
  "UNH+M+UTILMD:D:11A:UN:S2.1", "BGM+E01+D", "NAD+MS+9900000000001::293",
  "IDE+24+V1", "RFF+Z13:55001", "IDE+24+V2", "RFF+Z13:55036", "UNT+8+M", UNZ]))) === '["55001","55036"]',
  'UTILMD: zwei Vorgänge -> zwei Prüf-IDs (55001, 55036)');

// UTILTS: zwei IDE-Vorgänge (SG5 IDE, SG6 RFF+Z13)
ok(JSON.stringify(pids(bau([UNB,
  "UNH+M+UTILTS:D:11A:UN:1.1c", "BGM+Z36+D", "NAD+MS+9900000000001::293",
  "IDE+24+V1", "RFF+Z13:25001", "SEQ+Z36", "IDE+24+V2", "RFF+Z13:25002", "UNT+9+M", UNZ]))) === '["25001","25002"]',
  'UTILTS: zwei Vorgänge -> zwei Prüf-IDs (25001, 25002)');

// IFTSTA (EQD-Variante): SG4 EQD, RFF+Z13 im selben Vorgang
ok(JSON.stringify(pids(bau([UNB,
  "UNH+M+IFTSTA:D:07B:UN:2.0e", "BGM+Z03+D", "NAD+MR+9900000000002::293",
  "EQD+Z01", "RFF+Z13:21000", "EQD+Z01", "RFF+Z13:21001", "UNT+8+M", UNZ]))) === '["21000","21001"]',
  'IFTSTA (EQD): zwei Vorgänge -> zwei Prüf-IDs (21000, 21001)');

// IFTSTA (CNI-Variante): SG14 CNI, SG15 STS+RFF+Z13
ok(JSON.stringify(pids(bau([UNB,
  "UNH+M+IFTSTA:D:07B:UN:2.0e", "BGM+Z09+D", "NAD+MR+9900000000002::293",
  "CNI+1", "STS+Z10", "RFF+Z13:21007", "CNI+2", "STS+Z10", "RFF+Z13:21008", "UNT+9+M", UNZ]))) === '["21007","21008"]',
  'IFTSTA (CNI): zwei Vorgänge -> zwei Prüf-IDs (21007, 21008)');

// INSRPT: SG3 DOC, SG4 RFF+Z13 (früher nicht abgedeckt -> Trigger DOC ergänzt)
ok(JSON.stringify(pids(bau([UNB,
  "UNH+M+INSRPT:D:04B:UN:2.0a", "BGM+4+D", "NAD+MR+9900000000002::293",
  "DOC+21", "RFF+Z13:23001", "NAD+MS+9900000000001::293",
  "DOC+21", "RFF+Z13:23002", "NAD+MS+9900000000001::293", "UNT+9+M", UNZ]))) === '["23001","23002"]',
  'INSRPT: zwei Vorgänge -> zwei Prüf-IDs (23001, 23002)');

// ---- Typen mit Prüf-ID im KOPF (nur eine PID je UNH) ------------------------
// Mehrere Prüf-IDs entstehen hier nur über MEHRERE UNH je Datei; innerhalb einer
// Nachricht liefert vorgaenge() KEINE eigenständigen Prüf-IDs.

// INVOIC: RFF+Z13 im Kopf (SG1) — bewusst kein innerer Trigger
ok(pids(bau([UNB, "UNH+M+INVOIC:D:06A:UN:2.8e", "BGM+380+RE", "RFF+Z13:31001",
  "LIN+1", "LIN+2", "UNS+S", "MOA+77:1", "UNT+9+M", UNZ])).length === 0,
  'INVOIC: eine Prüf-ID je UNH (kein innerer Vorgangs-PID)');

// MSCONS: RFF+Z13 im Kopf (SG1); NAD-Vorgänge tragen keine eigene Prüf-ID
ok(pids(bau([UNB, "UNH+M+MSCONS:D:04B:UN:2.4c", "BGM+7+D", "RFF+Z13:13019",
  "NAD+MS+9900000000001::293", "UNS+D", "NAD+DP", "LOC+172+X", "NAD+DP", "LOC+172+Y",
  "UNT+11+M", UNZ])).length === 0,
  'MSCONS: eine Prüf-ID je UNH (NAD-Vorgänge ohne eigene Prüf-ID)');

// ORDERS: RFF+Z13 im Kopf (SG1)
ok(pids(bau([UNB, "UNH+M+ORDERS:D:11A:UN:1.1e", "BGM+220+D", "RFF+Z13:17001",
  "LIN+1", "LIN+2", "UNT+7+M", UNZ])).length === 0,
  'ORDERS: eine Prüf-ID je UNH (LIN-Positionen ohne eigene Prüf-ID)');

// ---- Mehrere UNH je Datei: typunabhängig zerlegt ---------------------------
const zweiInvoic = bau([UNB,
  "UNH+M1+INVOIC:D:06A:UN:2.8e", "BGM+380+RE1", "RFF+Z13:31001", "UNT+4+M1",
  "UNH+M2+INVOIC:D:06A:UN:2.8e", "BGM+380+RE2", "RFF+Z13:31006", "UNT+4+M2", "UNZ+2+R1"]);
ok(nachrichten(zweiInvoic) === 2, 'INVOIC: zwei UNH -> zwei Nachrichten (typunabhängige Zerlegung)');

console.log('\nPID-ZERLEGUNG: ' + (fails ? fails + ' FAIL' : 'alle OK'));
process.exit(fails ? 1 : 0);
