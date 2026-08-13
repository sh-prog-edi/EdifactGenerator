// test_contrl_ahb.js — Regression für _engine/daten/contrl-ahb.js.
//
// Der MIG sagt, WELCHE Codes es je CONTRL-Segment gibt (uci-fehlercodes.js,
// Abschnitt 74). Der AHB sagt zusätzlich, in welchem ANWENDUNGSFALL sie
// verwendet werden dürfen, führt den AHB-Status samt Bedingungen je Segment/
// Segmentgruppe/Datenelement und trifft im Fließtext Aussagen zu einzelnen
// Codes (Abschnitt 75). Erzeugt von werkzeuge/lies_contrl_ahb.py.
//
// Dieser Test sichert die Datenschicht ab und stellt vor allem den Abgleich
// AHB gegen MIG sicher: Beide Quellen müssen dieselben Codes führen.
// Aufruf: node scripts/test_contrl_ahb.js
const A = require("../_engine/daten/contrl-ahb.js");
const MIG = require("../_engine/daten/uci-fehlercodes.js");

let fails = 0;
const ok = (b, t) => { console.log((b ? "  OK  " : " FAIL ") + t); if (!b) fails++; };

// ---- Anwendungsfälle -------------------------------------------------------
const af = A.contrlAhb.anwendungsfaelle;
ok(Array.isArray(af) && af.length === 3,
  `AHB führt drei Anwendungsfälle (${(af || []).length})`);
ok(af.some(n => /Empfangsbestätigung/.test(n)), "Anwendungsfall Empfangsbestätigung erkannt");
ok(af.some(n => /Übertragungsdatei/.test(n)), "Anwendungsfall Syntaxfehlermeldung Übertragungsdatei erkannt");
ok(af.some(n => /Nachricht$/.test(n)), "Anwendungsfall Syntaxfehlermeldung Nachricht erkannt");

// ---- Kernabgleich: AHB gegen MIG ------------------------------------------
// Wichtigste Zusage dieser Datenschicht. Weichen die Quellen ab, ist eine von
// beiden Extraktionen defekt — das muss auffallen, nicht stillschweigend
// unterschiedliche Listen erzeugen.
const paare = [["UCI", "UCI"], ["UCM", "SG1 UCM"], ["UCS", "SG2 UCS"], ["UCD", "SG2 UCD"]];
paare.forEach(([segMig, pfadAhb]) => {
  const m = ((MIG.contrlCodelisten[segMig] || {})["0085"] || []).map(x => x[0]).sort();
  const a = ((A.contrlAhb.codes[pfadAhb] || {})["0085"] || []).map(x => x[0]).sort();
  ok(m.length > 0 && a.length > 0 && JSON.stringify(m) === JSON.stringify(a),
    `${segMig} DE0085: AHB und MIG führen dieselben ${a.length} Codes` +
    (JSON.stringify(m) === JSON.stringify(a) ? "" : ` — MIG [${m}] vs AHB [${a}]`));
});

// ---- Zulässigkeit je Anwendungsfall ---------------------------------------
const nur = (code, pfad, de) => A.contrlAhbZulaessig(code, pfad, de).anwendungsfaelle;
ok(nur("7", "UCI", "0083").length === 1 && /Empfangsbestätigung/.test(nur("7", "UCI", "0083")[0]),
  "UCI DE0083 = 7 gilt laut AHB NUR für die Empfangsbestätigung");
ok(nur("4", "UCI", "0083").length === 2 && nur("4", "UCI", "0083").every(n => /Syntaxfehler/.test(n)),
  "UCI DE0083 = 4 gilt laut AHB NUR für die beiden Syntaxfehlermeldungen");
ok(nur("26", "UCI", "0085").length === 1 && /Übertragungsdatei/.test(nur("26", "UCI", "0085")[0]),
  "UCI DE0085 = 26 gehört zur Syntaxfehlermeldung in der ÜBERTRAGUNGSDATEI");
ok(nur("26", "SG1 UCM", "0085").length === 1 && /Nachricht$/.test(nur("26", "SG1 UCM", "0085")[0]),
  "UCM DE0085 = 26 gehört zur Syntaxfehlermeldung in der NACHRICHT");

// Ein Code der falschen Ebene muss als unbekannt gemeldet werden — daraus
// entsteht im Ablehnungs-Abgleich der Hinweis auf die AHB-Abweichung.
ok(A.contrlAhbZulaessig("2", "SG2 UCD", "0085").bekannt === false,
  "Code 2 (nur UCI) gilt auf UCD-Ebene als nicht vorgesehen");
ok(A.contrlAhbZulaessig("35", "SG2 UCS", "0085").bekannt === true,
  "Code 35 (Segmentwiederholungen) ist auf UCS-Ebene vorgesehen");
ok(A.contrlAhbZulaessig("35", "SG2 UCD", "0085").bekannt === false,
  "Code 35 ist auf UCD-Ebene NICHT vorgesehen (Segment- statt Datenelementebene)");

// ---- AHB-Status und Bedingungen -------------------------------------------
// Genau die Angaben, die den Formular-Metas der Servicenachrichten fehlen
// (Abschnitt 74) — hier aus dem AHB gelesen.
const st = A.contrlAhb.status;
ok(/^Muss \[9\]$/.test((st["SG2"] || [])[2] || ""),
  'Gruppenstatus SG2 ist "Muss [9]" (nicht unbedingtes Muss)');
ok(/^Soll \[6\]$/.test((st["SG2 UCD"] || [])[2] || ""),
  'SG2 UCD ist "Soll [6]"');
ok(((st["UNH"] || [])[0] || "") === "Muss" && ((st["UNH"] || [])[2] || "") === "Muss",
  "UNH ist in allen Anwendungsfällen Muss");
ok(/\[2\].*\[3\]/.test((st["SG1 UCM 0085"] || [])[2] || ""),
  "SG1 UCM DE0085 trägt den Bedingungsausdruck [2] ∨ [3]");

const bed = A.contrlAhb.bedingungen;
ok(Object.keys(bed).length >= 7, `Bedingungstexte gelesen (${Object.keys(bed).length})`);
ok(/UNH/.test(bed["2"] || ""), "[2] verweist auf einen Syntaxfehler in UNH");
ok(/DE0013 nicht vorhanden/.test(bed["9"] || ""),
  "[9] lautet „Wenn SG1 UCM DE0013 nicht vorhanden.“");

// ---- Fließtextregeln zu Codes ---------------------------------------------
// Der AHB verbietet ausdrücklich, Code 26 zu senden, wenn der Empfänger die
// Übertragungsdatei aus selbst verursachtem Grund erneut einspielt.
const h26 = (A.contrlAhb.hinweise || {})["26"] || [];
ok(h26.length > 0, "AHB-Fließtextregel zu Code 26 erfasst");
ok(h26.some(t => /keine Syntaxfehlermeldung mit dem Fehlercode 26/.test(t)),
  "Regel nennt das Verbot, Code 26 zu senden");
ok(h26.some(t => /von ihm verursachten Fehlers/.test(t)),
  "Regel nennt die Voraussetzung (vom Empfänger selbst verursacht)");

console.log(`\n${fails === 0 ? "ALLE TESTS OK" : fails + " FEHLER"}`);
process.exit(fails ? 1 : 0);
