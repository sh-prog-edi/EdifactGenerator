// test_contrl_codelisten.js — Regression für _engine/daten/uci-fehlercodes.js.
//
// Die Datei enthielt bis zum 13.08.2026 eine von Hand kuratierte Teilliste von
// 12 „gängigen" DE0085-Codes. Eine real erhaltene negative CONTRL mit Code 26
// („Duplikat gefunden") lief deshalb ohne Klartext durch, und zwei Texte waren
// sachlich falsch (Code 28 stand als „Ungültige Segmentreihenfolge", der MIG
// sagt „Referenzen stimmen nicht überein"). Die Datei wird jetzt maschinell aus
// dem MIG CONTRL erzeugt (werkzeuge/lies_contrl_fehlercodes.py).
//
// Dieser Test sichert die Zusagen der Datenschicht ab — nicht die Extraktion
// selbst (die braucht das Originaldokument, das nicht im Repository liegt).
// Aufruf: node scripts/test_contrl_codelisten.js
const C = require("../_engine/daten/uci-fehlercodes.js");

let fails = 0;
const ok = (b, t) => { console.log((b ? "  OK  " : " FAIL ") + t); if (!b) fails++; };

// ---- Struktur --------------------------------------------------------------
ok(typeof C.contrlCodelisten === "object" && C.contrlCodelisten,
  "contrlCodelisten vorhanden");
["UCI", "UCM", "UCS", "UCD"].forEach(seg => {
  const de85 = (C.contrlCodelisten[seg] || {})["0085"];
  ok(Array.isArray(de85) && de85.length > 0,
    `${seg} führt eine eigene DE0085-Codeliste (${(de85 || []).length} Codes)`);
});
ok(((C.contrlCodelisten.UCI || {})["0083"] || []).length >= 2,
  "UCI führt zusätzlich die DE0083-Aktionscodes (4 = abgelehnt, 7 = bestätigt)");

// ---- Der gemeldete Fall: Code 26 ------------------------------------------
ok(C.contrlFehlertext("26", "UCI") === "Duplikat gefunden",
  'Code 26 löst auf "Duplikat gefunden" auf (fehlte in der kuratierten Liste ganz)');
const e26uci = C.contrlFehlereintrag("26", "UCI");
const e26ucm = C.contrlFehlereintrag("26", "UCM");
ok(/Duplikat einer[^.]*Übertragungsdatei/i.test(e26uci.erlaeuterung),
  "Code 26 im UCI meint ein Duplikat der ÜBERTRAGUNGSDATEI");
ok(/Duplikat einer Nachricht/i.test(e26ucm.erlaeuterung),
  "Code 26 im UCM meint ein Duplikat der NACHRICHT — segmentgenau unterschieden");
ok(e26uci.erlaeuterung !== e26ucm.erlaeuterung,
  "die Erläuterungen je Ebene sind tatsächlich verschieden");

// ---- Sachlich korrigierte Texte -------------------------------------------
ok(/Referenzen stimmen nicht überein/i.test(C.contrlFehlertext("28", "UCI")),
  'Code 28 lautet laut MIG "Referenzen stimmen nicht überein" (vorher falsch: "Ungültige Segmentreihenfolge")');
ok(/tatsächliche Empfänger/i.test(C.contrlFehlertext("7", "UCI")),
  'Code 7 lautet laut MIG "Empfänger … ist nicht der tatsächliche Empfänger" (vorher unscharf: "Ungültiger Absender/Empfänger")');

// ---- Vollständigkeit gegenüber der alten kuratierten Liste ----------------
// Bis auf Code 18 (im MIG CONTRL nicht geführt) muss jeder frühere Code weiter
// auflösbar sein — sonst wäre die maschinelle Liste eine Verschlechterung.
["2", "7", "12", "13", "16", "21", "22", "28", "35", "39", "40"].forEach(code => {
  ok(!!C.contrlFehlertext(code, "UCI") || !!C.contrlFehlertext(code, "UCS") ||
     !!C.contrlFehlertext(code, "UCD"),
    `früherer Code ${code} weiterhin auflösbar`);
});
ok(C.contrlFehlereintrag("18", "UCI").quelle === null,
  "Code 18 wird als NICHT in der MIG geführt gemeldet (quelle === null), statt still leer zu bleiben");
ok(C.contrlFehlereintrag("999", "UCI").quelle === null,
  "unbekannter Code liefert quelle === null (aufrufende Seite kann das kenntlich machen)");

// ---- Rückwärtskompatibilität der flachen API ------------------------------
ok(Array.isArray(C.uciFehlercodes0085) && C.uciFehlercodes0085.length >= 20,
  `uciFehlercodes0085 bleibt als flache Vereinigung erhalten (${C.uciFehlercodes0085.length} Codes, vorher 12)`);
const [v, t] = C.uciFehlercodes0085[0];
ok(typeof v === "string" && typeof t === "string" && v.length > 0 && t.length > 0,
  "flache Liste bleibt per [code, text] destrukturierbar (CONTRL-Generator, Dropdown)");
const codes = C.uciFehlercodes0085.map(x => Number(x[0]));
ok(codes.every((n, i) => i === 0 || n > codes[i - 1]),
  "flache Liste ist numerisch sortiert und dublettenfrei");

// ---- Fallback: Code nur auf einer Ebene bekannt ---------------------------
// 32 („Tiefere Ebene leer") gibt es nur im UCI. Die Abfrage auf UCD darf nicht
// leer laufen, sondern über die Vereinigung antworten (quelle dann "").
const e32 = C.contrlFehlereintrag("32", "UCD");
ok(e32.text.length > 0 && e32.quelle === "",
  'Code nur einer Ebene fällt auf die Vereinigung zurück (quelle === "")');

console.log(`\n${fails === 0 ? "ALLE TESTS OK" : fails + " FEHLER"}`);
process.exit(fails ? 1 : 0);
