// _engine/ahb-validator.js
// ------------------------------------------------------------------
// Universeller EDIFACT-Nachrichten-Validator (zentral, formatübergreifend).
//
// Prüfgrundlagen (werden per konfiguriere() übergeben):
//   meta        Formular-Meta der erkannten Prüf-ID (AHB-Struktur, Codes, Muss/Kann)
//   migFormat   _engine/daten/mig-formate.js[stand][format]  (Feldformate/-Status)
//   ebd         _engine/daten/ebd-antwortcodes.js[stand].ebds (Antwortcodes)
//   codelisten  _engine/daten/codelisten.js                   (OBIS, Artikel, Länder …)
//   afRegeln    _engine/daten/af-regeln.js                    (Allg. Festlegungen)
//
// Ablauf: AhbValidator.parse(text) -> AhbValidator.erkenne(parsed, registry)
//         -> AhbValidator.validiere(parsed, kontext)
// Ergebnis je Segment: status 'ok' | 'fehler' (+ meldungen[], hinweise[]).
// ------------------------------------------------------------------
(function (global) {
  "use strict";

  // ---- EDIFACT-Parser ------------------------------------------------------
  // Standard-Servicezeichen (UNA:+.? ') gemäß Allgemeinen Festlegungen.
  function parse(text) {
    const fehler = [];
    let comp = ":", elem = "+", dez = ".", rel = "?", segTrenn = "'";
    let una = null;
    let t = String(text || "").replace(/^﻿/, "").trim();
    if (t.startsWith("UNA")) {
      una = t.slice(0, 9);
      comp = t[3]; elem = t[4]; dez = t[5]; rel = t[6]; segTrenn = t[8];
      t = t.slice(9);
    }
    // Segmente trennen (Release-Zeichen beachten), Zeilenumbrüche zwischen
    // Segmenten sind zulässig und werden entfernt.
    const rohSegmente = [];
    let cur = "";
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c === rel && i + 1 < t.length) { cur += c + t[i + 1]; i++; continue; }
      if (c === segTrenn) { rohSegmente.push(cur); cur = ""; continue; }
      if (c === "\n" || c === "\r") { if (cur.trim() === "") cur = ""; else cur += ""; continue; }
      cur += c;
    }
    if (cur.trim() !== "") fehler.push(`Unvollständiges Segment am Ende (fehlendes "${segTrenn}"): "${cur.slice(0, 40)}"`);

    const segmente = [];
    for (const roh of rohSegmente) {
      const s = roh.trim();
      if (!s) continue;
      // Elemente/Komponenten mit Release-Logik trennen
      const elemente = [];
      let e = [], c = "";
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === rel && i + 1 < s.length) { c += s[i + 1]; i++; continue; }
        if (ch === elem) { e.push(c); elemente.push(e); e = []; c = ""; continue; }
        if (ch === comp) { e.push(c); c = ""; continue; }
        c += ch;
      }
      e.push(c); elemente.push(e);
      const tag = (elemente.shift() || [""])[0];
      segmente.push({ raw: s + segTrenn, tag, elemente });
    }
    return { una, servicezeichen: { comp, elem, dez, rel, segTrenn }, segmente, fehler };
  }

  function wert(seg, el, co) {
    const e = seg.elemente[el];
    if (!e) return "";
    return (e[co] || "").trim();
  }

  // ---- Erkennung -----------------------------------------------------------
  function erkenne(parsed, registry) {
    const unh = parsed.segmente.find(s => s.tag === "UNH");
    if (!unh) return { fehler: "Kein UNH-Segment gefunden - keine EDIFACT-Nachricht?" };
    const s009 = unh.elemente[1] || [];
    const typ = (s009[0] || "").trim();
    const version = (s009[4] || "").trim();
    const kennung = [s009[0], s009[1], s009[2], s009[3], s009[4]].map(x => (x || "").trim()).join(":");
    // Prüf-ID: RFF+Z13 in der ersten Nachricht
    let pruefi = "";
    for (const s of parsed.segmente) {
      if (s.tag === "RFF" && wert(s, 0, 0) === "Z13") { pruefi = wert(s, 0, 1); break; }
    }
    let kandidaten = registry.filter(r => r.format === typ);
    if (!kandidaten.length) return { typ, version, kennung, pruefi, fehler: `Nachrichtentyp "${typ}" ist nicht im Generator hinterlegt.` };
    // 1) exakte UNH-Kennung, 2) Version (0057), 3) Prüf-ID-Liste
    let treffer = kandidaten.filter(r => r.unh === kennung);
    if (!treffer.length) treffer = kandidaten.filter(r => r.unh.split(":").pop() === version);
    if (pruefi) {
      const mitPruefi = (treffer.length ? treffer : kandidaten).filter(r => r.pruefis.includes(pruefi));
      if (mitPruefi.length) treffer = mitPruefi;
    }
    if (!treffer.length) treffer = kandidaten;
    // bei identischem AHB in beiden Ständen: 202604 zuerst
    treffer.sort((a, b) => a.stand.localeCompare(b.stand));
    return { typ, version, kennung, pruefi, eintrag: treffer[0], alleTreffer: treffer };
  }

  // Wiederholte Gruppendatenelemente je Segment-Element (Allg. Festlegungen
  // Kap. 2.17/6.10): dieselbe DE-Nummer wiederholt sich als Komponenten.
  const WIEDERHOLUNGS_DE = {
    "NAD:2": { de: "3124", gruppe: "C058", was: "Zusatzinformation zur Identifizierung" },
    "NAD:3": { de: "3036", gruppe: "C080", was: "Name des Beteiligten" },
    "NAD:4": { de: "3042", gruppe: "C059", was: "Straße/Postfach" },
    "FTX:3": { de: "4440", gruppe: "C108", was: "Freitext" },
  };

  // Zusätzliche belegbare Composite-Komponenten, die der Decoder (ein DE je
  // Position) nicht abbilden kann, weil sich ein DE im selben Composite
  // wiederholt: CAV C889 trägt am Ende ZWEI Merkmalswerte DE7110 (Komponenten 4
  // und 5). Der Decoder kennt nur die erste (7110 → [0,3]); ein Wert an der
  // zweiten (z. B. „CAV+:::6:1") ist laut MIG regelkonform und kein Aufbaufehler.
  const KOMP_ZUSATZ = { "CAV:0": [4] };   // Element 0, Komponente 4 (0-basiert) = 2. DE7110

  // ---- Decoder: Segment+DE -> Element/Komponente (BDEW-MIG-Layouts) --------
  const DECODER = {
    UNH: { "0062": [0, 0], "0065": [1, 0], "0052": [1, 1], "0054": [1, 2], "0051": [1, 3], "0057": [1, 4] },
    BGM: { "1001": [0, 0], "1004": [1, 0], "1225": [2, 0] },
    DTM: { "2005": [0, 0], "2380": [0, 1], "2379": [0, 2] },
    // C506: 1153 Qualifier, 1154 Referenz, 1156 Zeitraum-ID (Verwendungszeitraum
    // der Daten, RFF+Z49::1) — ohne den Eintrag bliebe die ID unauswertbar.
    RFF: { "1153": [0, 0], "1154": [0, 1], "1156": [0, 2] },
    NAD: { "3035": [0, 0], "3039": [1, 0], "3055": [1, 2], "3124": [2, 0], "3036": [3, 0],
           "3042": [4, 0], "3164": [5, 0], "3251": [7, 0], "3207": [8, 0] },
    LOC: { "3227": [0, 0], "3225": [1, 0] },
    CTA: { "3139": [0, 0], "3412": [1, 1] },
    COM: { "3148": [0, 0], "3155": [0, 1] },
    IMD: { "7077": [0, 0], "7081": [1, 0], "7009": [2, 0] },
    FTX: { "4451": [0, 0], "4453": [1, 0], "1131": [2, 0], "4440": [3, 0] },  // 4441 teilt C107 mit 1131
    LIN: { "1082": [0, 0], "1229": [1, 0], "7140": [2, 0], "7143": [2, 1] },
    PIA: { "4347": [0, 0], "7140": [1, 0], "7143": [1, 1] },
    QTY: { "6063": [0, 0], "6060": [0, 1], "6411": [0, 2] },
    // STS: C601 (9015) + C555 (4405) + C556 (9013:1131:3055:9012). Die Gruppe C556
    // wiederholt sich — die Wiederholungen ab Element 4 tragen erneut ein DE 9013
    // (UTILMD Strom: Transaktionsgrundergänzung, Ergänzung für befristetes
    // Lieferende). Der Decoder liefert die erste Wiederholung; die weiteren prüft
    // pruefeSts() gegen den MIG-Aufbau (_engine/daten/sts-struktur.js).
    STS: { "9015": [0, 0], "4405": [1, 0], "9013": [2, 0], "1131": [2, 1], "3055": [2, 2], "9012": [2, 3] },
    IDE: { "7495": [0, 0], "7402": [1, 0] },
    SEQ: { "1229": [0, 0], "1050": [1, 0] },
    CCI: { "7059": [0, 0], "7037": [2, 0] },  // 7036 teilt sich C240 mit 7037
    CAV: { "7111": [0, 0], "7110": [0, 3] },
    MOA: { "5025": [0, 0], "5004": [0, 1] },
    AGR: { "7431": [0, 0], "7433": [0, 0] },
    MEA: { "6311": [0, 0], "6313": [1, 0], "6411": [2, 0], "6314": [2, 1] },
    AJT: { "4465": [0, 0], "1082": [1, 0] },
    CUX: { "6347": [0, 0], "6345": [0, 1], "6343": [0, 2] },
    GIN: { "7405": [0, 0], "7402": [1, 0] },
    PRI: { "5125": [0, 0], "5118": [0, 1], "5387": [0, 3], "5284": [1, 0], "6411": [2, 0] },
    RNG: { "6167": [0, 0], "6411": [1, 0], "6162": [1, 1], "6152": [1, 2] },
    ALC: { "5463": [0, 0], "1230": [1, 0], "5189": [1, 1] },
    CNI: { "1490": [0, 0] },
    DLI: { "1073": [0, 0], "1082": [1, 0] },
    DOC: { "1001": [0, 0], "1004": [1, 0] },
    EFI: { "1508": [0, 0], "7008": [0, 1] },
    EQD: { "8053": [0, 0], "8260": [1, 0] },
    FII: { "3035": [0, 0], "3194": [1, 0], "3192": [1, 1], "3433": [2, 0], "3432": [2, 6] },
    GEI: { "9649": [0, 0], "7365": [1, 0] },
    GID: { "1496": [0, 0] },
    PCD: { "5245": [0, 0], "5482": [0, 1] },
    PGI: { "5379": [0, 0] },
    PYT: { "4279": [0, 0] },
    TAX: { "5283": [0, 0], "5153": [1, 0], "5278": [4, 3], "5305": [5, 0] },
    UNS: { "0081": [0, 0] },
    UNT: { "0074": [0, 0], "0062": [1, 0] },
    ERC: { "9321": [0, 0] },
    UCI: { "0020": [0, 0], "0083": [3, 0] },
    UCM: { "0062": [0, 0], "0083": [2, 0] },
  };

  // Qualifier-DE je Segment (zur Zuordnung Segment -> AHB-Instanz)
  const QUAL_DE = { DTM: "2005", NAD: "3035", LOC: "3227", RFF: "1153", STS: "9015",
    SEQ: "1229", CCI: "7059", CTA: "3139", QTY: "6063", MEA: "6311", MOA: "5025",
    PYT: "4279", PCD: "5245", ALC: "5463", IMD: "7081", GEI: "9649", DOC: "1001",
    AJT: "4465", CUX: "6347", PRI: "5125", GIN: "7405", RNG: "6167", CAV: "7111",
    FII: "3035", PGI: "5379", EQD: "8053", EFI: "7008", TAX: "5283", FTX: "4451",
    LIN: "1229", IDE: "7495", PIA: "4347", DLI: "1073", ERC: "9321", UNS: "0081" };

  const OBIS_RE = /^\d-(?:\d{1,2}|b):\d{1,3}\.(?:\d{1,3}|[a-z])\.(?:\d{1,3}|[a-z])$/;
  // Echte EDIFACT-Codewerte (Großbuchstaben/Ziffern); filtert Namensfragmente
  // aus der AHB-Extraktion ("Identifikation" u.ä.), die keine Codes sind.
  const ECHTER_CODE_RE = /^[A-Z0-9_.]{1,18}$/;  // ohne "-": Platzhalter wie "MP-ID" sind keine Codes
  function echteCodes(deE) {
    return (deE.codes || []).map(c => c[0]).filter(c => ECHTER_CODE_RE.test(c));
  }
  const ARTNR_RE = /^99[79]\d{10}$/;
  const ARTID_RE = /^\d-\d{2}-\d(?:-\d{3})?$/;

  function istMussExpr(expr) { return /^Muss\s*$/.test(expr || ""); }
  // Klassifikation eines AHB-Status-Ausdrucks bzgl. Muss-Pflicht:
  //   'hart'    = mindestens eine UNBEDINGTE "Muss"-Angabe  -> Segment ist Pflicht
  //   'bedingt' = nur konditionales Muss ("Muss [nn]")      -> Pflicht nur unter Bedingung
  //   null      = kein Muss (Soll/Kann/X/leer)
  // Der Status kann je Wiederholung mit "/" getrennt sein (z. B. "Muss / Muss",
  // "Muss / Soll [2] / Muss"). Beispiele: "Muss"->hart, "Muss [12]"->bedingt,
  // "Muss [31] ∧ [32]"->bedingt, "Muss / Muss"->hart.
  function mussKlasse(expr) {
    const teile = String(expr == null ? "" : expr).trim().split("/").map(s => s.trim());
    let hatMuss = false, hartesMuss = false;
    for (const t of teile) {
      if (/^Muss\b/.test(t)) { hatMuss = true; if (/^Muss\s*$/.test(t)) hartesMuss = true; }
    }
    return hatMuss ? (hartesMuss ? "hart" : "bedingt") : null;
  }

  function formatOk(fmt, v) {
    // "an..35", "an3", "n..17", "n1", "a3"
    const m = /^(an|a|n)(\.\.)?(\d+)$/.exec(fmt || "");
    if (!m) return { ok: true };
    const [, art, offen, lenS] = m;
    const max = Number(lenS);
    if (offen ? v.length > max : v.length !== max)
      return { ok: false, grund: `Länge ${v.length}, erlaubt ${offen ? "max. " : "genau "}${max} (${fmt})` };
    if (art === "n" && !/^-?\d+(\.\d+)?$/.test(v))
      return { ok: false, grund: `kein numerischer Wert im Format ${fmt} (Dezimaltrennzeichen ist der Punkt)` };
    if (art === "a" && /\d/.test(v))
      return { ok: false, grund: `nur Buchstaben erlaubt (${fmt})` };
    return { ok: true };
  }

  // 304: CCYYMMDDHHMMSS+00 (mit Sekunden) — an echten MSCONS-Zeitstempeln belegt;
  //      12-stellige Form (ohne Sekunden) bleibt zugelassen.
  // 104: zwei MMDD-Grenzen für jahreszeitenabhängige Zeiträume (z. B. „02010204");
  //      der optionale Bindestrich bleibt zugelassen (Abwärtskompatibilität).
  const DTM_FORMATE = { "303": /^\d{12}\+00$/, "304": /^\d{12}(\d{2})?\+00$/, "203": /^\d{12}$/,
                        "102": /^\d{8}$/, "610": /^\d{6}$/, "106": /^\d{4}$/,
                        "104": /^\d{4}-?\d{4}$/, "802": /^\d{1,2}$/, "602": /^\d{4}$/,
                        "501": /^\d{8}(\+00)?$/,
                        // Z01 = ZZRB (Kündigungsfrist, MIG UTILMD): Anzahl + Einheit T/W/M
                        // + Bezugszeitpunkt M/Q/H/J/T/R, z. B. 30TM
                        "Z01": /^\d{2}[TWM][MQHJTR]$/ };

  function obisBekannt(v, liste) {
    if (liste.includes(v)) return true;
    // Platzhaltertoleranz der Codeliste: b = Bilanzierungsgebiet, e/y = variable Stelle
    const varianten = [
      v.replace(/^(\d)-\d{1,2}:/, "$1-b:"),
      v.replace(/\.\d{1,3}$/, ".e"), v.replace(/\.\d{1,3}\./, ".y."),
      v.replace(/^(\d)-\d{1,2}:/, "$1-b:").replace(/\.\d{1,3}$/, ".e"),
    ];
    return varianten.some(x => liste.includes(x));
  }

  // ---- Kernvalidierung -----------------------------------------------------
  // kontext: { meta, pruefi, stand, format, unhSoll, migFormat, ebd, codelisten,
  //            afRegeln, gs1Pruefziffer }
  function validiere(parsed, ctx) {
    const zeilen = parsed.segmente.map((s, i) => ({
      index: i, raw: s.raw, tag: s.tag, meldungen: [], hinweise: [] }));
    const F = (i, txt) => zeilen[i].meldungen.push(txt);
    const H = (i, txt) => zeilen[i].hinweise.push(txt);
    const global_ = { meldungen: [], hinweise: [] };
    parsed.fehler.forEach(f => global_.meldungen.push(f));

    const segs = parsed.segmente;
    const cl = ctx.codelisten || {};
    const mig = ctx.migFormat || { felder: {}, maxWdh: {} };
    const af = ctx.afRegeln || null;

    // ---- Rahmen: UNA/UNB/UNZ ----------------------------------------------
    const iUNB = segs.findIndex(s => s.tag === "UNB");
    const iUNZ = segs.findIndex(s => s.tag === "UNZ");
    let unbRef = "", mpAbs = "", mpEmp = "";
    if (parsed.una && af && parsed.una !== af.zeichensatz.una)
      global_.hinweise.push(`UNA weicht vom Standard "${af.zeichensatz.una}" ab: "${parsed.una}"`);
    if (iUNB >= 0) {
      const unb = segs[iUNB];
      const syntax = wert(unb, 0, 0), sver = wert(unb, 0, 1);
      if (af && (syntax !== af.zeichensatz.syntaxKennung || sver !== af.zeichensatz.syntaxVersion))
        F(iUNB, `UNB DE0001/0002: erwartet ${af.zeichensatz.syntaxKennung}:${af.zeichensatz.syntaxVersion}, gefunden ${syntax}:${sver}`);
      mpAbs = wert(unb, 1, 0); mpEmp = wert(unb, 2, 0);
      for (const [wer, mp, el] of [["Absender", mpAbs, 1], ["Empfänger", mpEmp, 2]]) {
        if (!/^\d{13}$/.test(mp)) F(iUNB, `MP-ID ${wer} "${mp}": MP-IDs sind 13-stellig numerisch (Allg. Festlegungen Kap. 2.13).`);
        else if (mp.startsWith("4") && ctx.gs1Pruefziffer && ctx.gs1Pruefziffer(mp.slice(0, 12)) !== mp[12])
          F(iUNB, `MP-ID ${wer} "${mp}": GS1/GLN-Prüfziffer falsch (erwartet ${ctx.gs1Pruefziffer(mp.slice(0, 12))}).`);
        const q = wert(unb, el, 1);
        if (q && !["14", "500", "502"].includes(q)) H(iUNB, `UNB: unübliche Codevergabestelle "${q}" für ${wer} (14=GS1, 500=BDEW, 502=DVGW).`);
      }
      const dat = wert(unb, 3, 0), zeit = wert(unb, 3, 1);
      if (!/^\d{6}$/.test(dat) || !/^\d{4}$/.test(zeit)) F(iUNB, `UNB S004: Datum/Zeit erwartet als JJMMTT:HHMM, gefunden "${dat}:${zeit}"`);
      unbRef = wert(unb, 4, 0);
      if (!unbRef) F(iUNB, "UNB DE0020: Datenaustauschreferenz fehlt.");
    } else {
      global_.meldungen.push("Kein UNB-Segment (Nutzdaten-Kopf) gefunden.");
    }
    if (iUNZ >= 0) {
      const unz = segs[iUNZ];
      const anzahl = Number(wert(unz, 0, 0));
      const nachrichten = segs.filter(s => s.tag === "UNH").length;
      if (anzahl !== nachrichten) F(iUNZ, `UNZ DE0036: ${anzahl} gemeldet, aber ${nachrichten} Nachricht(en) (UNH) enthalten.`);
      if (unbRef && wert(unz, 1, 0) !== unbRef) F(iUNZ, `UNZ DE0020 "${wert(unz, 1, 0)}" ≠ UNB-Referenz "${unbRef}".`);
    } else if (iUNB >= 0) {
      global_.meldungen.push("Kein UNZ-Segment (Nutzdaten-Ende) gefunden.");
    }

    // ---- Nachrichten (UNH..UNT) -------------------------------------------
    const nachrichten = [];
    let start = -1;
    segs.forEach((s, i) => {
      if (s.tag === "UNH") start = i;
      if (s.tag === "UNT" && start >= 0) { nachrichten.push([start, i]); start = -1; }
    });
    if (start >= 0) { global_.meldungen.push("UNH ohne abschließendes UNT."); nachrichten.push([start, segs.length - 1]); }

    const fehlendeMuss = [];
    const bedingteMuss = [];
    for (const [a, b] of nachrichten) {
      validiereNachricht(a, b);
    }

    function deWert(seg, de) {
      const pos = (DECODER[seg.tag] || {})[de];
      if (!pos) return null;   // Position unbekannt -> nicht prüfbar
      return wert(seg, pos[0], pos[1]);
    }

    // Leere Erstwiederholung vor belegten Folgekomponenten. Mehrere
    // Datenelementgruppen führen dasselbe DE in Wiederholungen (Allg.
    // Festlegungen Kap. 2.17 und 6.10: C058 DE3124 bis 5-mal, C080 DE3036,
    // C059 DE3042 bis 4-mal, FTX C108 DE4440); im MIG trägt die 1. Wiederholung
    // den Status M, sobald die Gruppe genutzt wird, und laut Kap. 6.10 wird die
    // Information ab der 1. Wiederholung geführt. Ein Wert in einer späteren
    // Wiederholung bei LEERER erster (NAD+Z63++:LADEN — Zusatzinformation in
    // Wiederholung 2, Wiederholung 1 leer) verletzt genau das und wird als
    // Fehler gemeldet — die spätere Position selbst ist vorgesehen, gemeldet
    // wird die leere Muss-Erstwiederholung.
    //
    // Lücken NACH belegter 1. Wiederholung bleiben unbeanstandet — bei der
    // Straße (C059) sind sie der Normalfall, denn die Wiederholungen tragen dort
    // feste Bedeutungen (1/2 Straßenname, 3 Hausnummer, 4 Ortsteil; AF 2.17).
    // Bekannte eigenständige Folgepositionen (NAD DE3055, CTA DE3412,
    // STS-Gruppen …) bleiben ebenfalls unberührt.
    function pruefeKomponenten(i, seg) {
      const dec = DECODER[seg.tag];
      if (!dec) return;
      const posDe = {};
      for (const de of Object.keys(dec)) posDe[dec[de][0] + ":" + (dec[de][1] || 0)] = de;
      seg.elemente.forEach((el, e) => {
        const deErste = posDe[e + ":0"];
        if (!deErste) return;                          // erste Komponente hier unbekannt
        if (((el[0] || "") + "").replace(/\?(.)/g, "$1").trim()) return;   // belegt -> Aufbau in Ordnung
        const wdh = WIEDERHOLUNGS_DE[seg.tag + ":" + e];
        const zusatz = KOMP_ZUSATZ[seg.tag + ":" + e] || [];
        for (let k = 1; k < el.length; k++) {
          if (posDe[e + ":" + k]) continue;            // eigenständige bekannte Folgeposition
          if (zusatz.includes(k)) continue;            // bekannte Composite-Wiederholung (z. B. 2. DE7110 im CAV)
          const v = ((el[k] || "") + "").replace(/\?(.)/g, "$1").trim();
          if (!v) continue;
          if (wdh) {
            F(i, `${seg.tag} DE${wdh.de} (${wdh.was}): Wert "${v}" steht in Wiederholung ${k + 1}, `
               + `Wiederholung 1 ist leer — laut MIG ist die 1. Wiederholung Muss, sobald die Gruppe `
               + `${wdh.gruppe} genutzt wird; die Allg. Festlegungen (Kap. 2.17, 6.10) führen die `
               + `Information ab der 1. Wiederholung.`);
          } else {
            F(i, `${seg.tag}: Wert "${v}" steht an Komponente ${k + 1} von Element ${e + 1}, `
               + `während das führende DE${deErste} leer ist — im hinterlegten MIG-Auszug ist dort `
               + `kein benutztes Datenelement beschrieben; Aufbau prüfen.`);
          }
        }
      });
    }

    // Qualifierabhängiger NAD-Aufbau laut MIG-Segmentlayout (ctx.nadAufbau aus
    // _engine/daten/nad-aufbau.js): Die Belegung der Datenelementgruppen hängt am
    // Qualifier DE3035 — bei der Marktlokationsanschrift ist C058 benutzt und
    // C080 „Nicht benutzt", bei den Kunden-Segmenten umgekehrt. Geprüft wird je
    // belegtem Element: ist die Gruppe bei diesem Qualifier benutzt, bleibt die
    // Zahl der Wiederholungen im Rahmen, ist keine „N"-Position belegt, und trägt
    // die Muss-Erstwiederholung einen Wert, sobald die Gruppe genutzt wird
    // (Allg. Festlegungen Kap. 2.17/6.10). Liefert true, wenn der Qualifier
    // bekannt war — die generische Komponentenprüfung entfällt dann für das NAD.
    function pruefeNadAufbau(i, seg) {
      const aufbau = ctx.nadAufbau;
      if (!aufbau) return false;
      const q = deWert(seg, "3035");
      const regeln = q && aufbau[q];
      if (!regeln) return false;
      seg.elemente.forEach((el, e) => {
        if (e === 0) return;   // Qualifier selbst
        const werte = el.map(x => String(x == null ? "" : x).replace(/\?(.)/g, "$1").trim());
        if (!werte.some(Boolean)) return;
        const r = regeln[String(e)];
        const name = r ? (r.name || r.gruppe) : "";
        if (!r) {
          F(i, `NAD+${q}: Element ${e + 1} ist laut MIG bei diesem Qualifier nicht vorgesehen.`);
          return;
        }
        if (r.wdh.every(w => w.st === "N")) {
          F(i, `NAD+${q}: ${name} (${r.gruppe}) ist laut MIG bei diesem Qualifier nicht benutzt.`);
          return;
        }
        werte.forEach((v, k) => {
          if (!v) return;
          const w = r.wdh[k];
          if (!w) F(i, `NAD+${q}: ${name} — Komponente ${k + 1} übersteigt die im MIG vorgesehenen ${r.wdh.length} Angaben.`);
          else if (w.st === "N") F(i, `NAD+${q}: ${name} — DE${w.de} (Komponente ${k + 1}) ist laut MIG nicht benutzt.`);
        });
        const w0 = r.wdh[0];
        if (w0 && w0.st === "M" && !werte[0]) {
          const belegtAb = werte.findIndex(Boolean);
          F(i, `NAD+${q} DE${w0.de} (${name}): Wiederholung 1 ist leer, obwohl die Gruppe ${r.gruppe} `
             + `genutzt wird (belegt: "${werte[belegtAb]}" in Wiederholung ${belegtAb + 1}) — laut MIG `
             + `ist die 1. Wiederholung Muss; die Allg. Festlegungen (Kap. 2.17, 6.10) führen die `
             + `Information ab der 1. Wiederholung.`);
        }
      });
      return true;
    }

    function pruefeMig(i, seg) {
      const nadGeprueft = seg.tag === "NAD" && pruefeNadAufbau(i, seg);
      if (!nadGeprueft) pruefeKomponenten(i, seg);
      const dec = DECODER[seg.tag];
      if (!dec) return;
      for (const de of Object.keys(dec)) {
        const v = deWert(seg, de);
        if (!v) continue;
        const eintrag = mig.felder[`${seg.tag} ${de}`];
        if (!eintrag) continue;
        if (eintrag.st === "N") { F(i, `DE${de} "${v}": laut MIG "Nicht benutzt".`); continue; }
        // STS DE9012 trägt je Statuskategorie Unterschiedliches: in STS+E01 die
        // Zeitraum-ID, in STS+Z35 die ID der betroffenen Lokation. Das MIG-Feldformat
        // gilt je Segment, nicht je Kategorie — deshalb greift die Formatprüfung nur,
        // wo das Feld überhaupt vorgesehen ist.
        if (seg.tag === "STS" && de === "9012" && ["E01", "Z35"].indexOf(deWert(seg, "9015")) < 0) continue;
        const chk = formatOk(eintrag.fmt, v);
        if (!chk.ok) F(i, `DE${de} "${v}": ${chk.grund}.`);
      }
    }

    function pruefeCodelisten(i, seg) {
      const land = seg.tag === "NAD" ? deWert(seg, "3207") : "";
      if (land && cl.laendercodes && !(land in cl.laendercodes.codes))
        F(i, `NAD DE3207 "${land}": kein Code der Codeliste europäischer Ländercodes.`);
      if (seg.tag === "PIA" || seg.tag === "LIN") {
        const v = deWert(seg, "7140");
        if (v) {
          if (OBIS_RE.test(v)) {
            if (cl.obis && !obisBekannt(v, cl.obis.codes))
              H(i, `DE7140 "${v}": OBIS-Kennzahl nicht in der Codeliste 2.5c (ggf. gerätespezifisch zulässig).`);
          } else if (ARTNR_RE.test(v)) {
            const bekannt = (cl.artikelnummern && v in cl.artikelnummern.codes) ||
              (cl["konfigurationen_" + ctx.stand] && cl["konfigurationen_" + ctx.stand].codes.includes(v)) ||
              (cl.lokationsbuendel && cl.lokationsbuendel.codes.includes(v));
            // Die hinterlegte Codeliste ist ein Auszug; eine formal gültige Nummer wird
            // deshalb nicht als Fehler, sondern als Hinweis geführt.
            if (!bekannt) H(i, `DE7140 "${v}": nicht in den hinterlegten Codelisten `
              + `(Artikelnummern/Konfigurationen/Lokationsbündel) — Auszug, bitte fachlich prüfen.`);
          } else if (ARTID_RE.test(v)) {
            if (cl.artikelIds && !(v in cl.artikelIds.codes))
              F(i, `DE7140 "${v}": Artikel-ID nicht in der Codeliste der Artikelnummern und Artikel-ID 5.6.`);
          }
          const liste = deWert(seg, "7143");
          if (liste === "Z16" && cl.verwendungszwecke && !(v in cl.verwendungszwecke.codes))
            F(i, `DE7140 "${v}": kein Code der Codeliste der Verwendungszwecke (DE7143=Z16).`);
        }
      }
    }

    // STS: Sitzt jeder Code in der richtigen Wiederholung der Gruppe C556?
    // Das MIG führt für UTILMD Strom drei Wiederholungen mit DE 9013:
    //   STS+7++<Transaktionsgrund>+<Ergänzung>+<Ergänzung befristetes Lieferende>
    // Ein Code an falscher Stelle (etwa STS+7++ZW4') ist ein Aufbaufehler, den die
    // reine Codelistenprüfung nicht sieht, weil alle drei dasselbe DE benennen.
    function pruefeSts(i, seg) {
      const struktur = ctx.stsStruktur;
      if (!struktur || !struktur.segmente || !struktur.segmente.length) return;
      const q = deWert(seg, "9015");
      if (!q) return;
      // Wiederholungen der Gruppe C556 je MIG-Segment: [{codes:{...}, name}]
      const wiederholungen = seg => {
        const out = [];
        let element = 0;
        (seg.komposita || []).forEach(k => {
          const de9013 = (k.des || []).find(d => d.de === "9013");
          if (element >= 2 && de9013) out.push({ name: de9013.name || "", codes: de9013.codes || {} });
          element++;
        });
        return out;
      };
      const kandidaten = struktur.segmente.filter(s => {
        const k9015 = (((s.komposita || [])[0] || {}).des || []).find(d => d.de === "9015");
        const codes = k9015 ? Object.keys(k9015.codes || {}) : [];
        return !codes.length || codes.indexOf(q) >= 0;
      }).map(wiederholungen).filter(w => w.length);
      if (!kandidaten.length) return;
      const maxWdh = Math.max.apply(null, kandidaten.map(w => w.length));
      for (let el = 2; el < seg.elemente.length; el++) {
        const v = (seg.elemente[el][0] || "").trim();
        if (!v) continue;
        const r = el - 2;
        if (r >= maxWdh) {
          F(i, `STS+${q}: Element ${el + 1} ("${v}") — das MIG sieht hier nur ${maxWdh} Statusanlass-Gruppe(n) vor.`);
          continue;
        }
        // zulässig, wenn irgendein Kandidat den Code an dieser Wiederholung führt
        // oder dort gar keine Codeliste hat (freier Antwortcode des EBD)
        const passt = kandidaten.some(w => !w[r] || !Object.keys(w[r].codes).length || (v in w[r].codes));
        if (passt) continue;
        const richtig = [];
        kandidaten.forEach(w => w.forEach((eintrag, j) => {
          if (j !== r && (v in eintrag.codes)) richtig.push({ el: j + 3, name: eintrag.name });
        }));
        if (richtig.length)
          F(i, `STS+${q}: Code "${v}" steht in Element ${el + 1}, gehört laut MIG aber als `
             + `${richtig[0].name || "Statusanlass"} in Element ${richtig[0].el}.`);
        else
          F(i, `STS+${q}: Code "${v}" ist in Element ${el + 1} (${(kandidaten[0][r] || {}).name || "Statusanlass"}) nicht vorgesehen.`);
      }
    }

    function pruefeEbd(i, seg, inst) {
      // STS/AJT: Antwortcode gegen den im Segment referenzierten EBD (DE1131 E_xxxx)
      if (!ctx.ebd) return;
      const eRef = deWert(seg, "1131");
      if (!eRef || !/^E_\d{4}$/.test(eRef)) return;
      let e = ctx.ebd[eRef];
      if (e && e.alias) e = ctx.ebd[e.alias];
      if (!e || !Object.keys(e.codes).length) return;
      const antwort = seg.tag === "STS" ? deWert(seg, "9013") : deWert(seg, "4465");
      if (!antwort) return;
      if (!(antwort in e.codes) && !("A**" in e.codes)) {
        F(i, `Antwortcode "${antwort}" ist im EBD ${eRef} (${e.titel || ""}) nicht vorgesehen. Zulässig: ${Object.keys(e.codes).join(", ")}.`);
        return;
      }
      // Cluster abgleichen: Eine Bestätigung darf keinen Ablehnungscode tragen und
      // umgekehrt. Das Cluster steht im EBD am Code, die Art der Nachricht im AHB
      // bzw. in der Prozess-Meta (ctx.cluster: „Zustimmung" / „Ablehnung").
      const eintrag = e.codes[antwort];
      const clusterCode = eintrag && eintrag.cluster;
      if (ctx.cluster && clusterCode && clusterCode !== ctx.cluster) {
        const passend = Object.keys(e.codes).filter(c => (e.codes[c] || {}).cluster === ctx.cluster);
        F(i, `Antwortcode "${antwort}" gehört im EBD ${eRef} zum Cluster ${clusterCode}, `
           + `die Nachricht ist eine ${ctx.cluster === "Zustimmung" ? "Bestätigung" : "Ablehnung"}. `
           + `Zulässig: ${passend.join(", ") || "—"}.`);
      }
    }

    function validiereNachricht(a, b) {
      const unh = segs[a];
      const kennung = [0, 1, 2, 3, 4].map(k => wert(unh, 1, k)).join(":");
      if (ctx.unhSoll && kennung !== ctx.unhSoll)
        F(a, `UNH-Kennung "${kennung}" ≠ erwartet "${ctx.unhSoll}" (${ctx.format} ${ctx.stand}).`);
      // UNT-Kontrolle
      const unt = segs[b].tag === "UNT" ? segs[b] : null;
      if (unt) {
        const n = Number(wert(unt, 0, 0));
        if (n !== b - a + 1) F(b, `UNT DE0074: ${n} gemeldet, tatsächlich ${b - a + 1} Segmente (UNH bis UNT).`);
        if (wert(unt, 1, 0) !== wert(unh, 0, 0)) F(b, `UNT DE0062 "${wert(unt, 1, 0)}" ≠ UNH-Referenz "${wert(unh, 0, 0)}".`);
      }
      if (!ctx.meta || !ctx.meta.instanzen) {
        for (let i = a; i <= b; i++) { pruefeMig(i, segs[i]); pruefeCodelisten(i, segs[i]); }
        return;
      }

      const instanzen = ctx.meta.instanzen;
      const matchZahl = new Array(instanzen.length).fill(0);
      let cursor = 0;

      function qualWert(seg) {
        const de = QUAL_DE[seg.tag];
        return de ? deWert(seg, de) : null;
      }
      function konflikte(seg, inst) {
        // Anzahl der DE-Werte, die den Codelisten der Instanz widersprechen
        let n = 0;
        for (const deE of inst.des) {
          const codes = echteCodes(deE);
          if (!codes.length) continue;
          if (seg.tag === "RFF" && deE.de === "1154") continue;
          if (seg.tag === "STS" && deE.de === "9013") continue;
          const v = deWert(seg, deE.de);
          if (v && !codes.includes(v)) n++;
        }
        return n;
      }
      function instKandidaten(seg) {
        const q = qualWert(seg);
        const alle = [];
        instanzen.forEach((inst, idx) => {
          if (inst.seg !== seg.tag) return;
          const qde = QUAL_DE[seg.tag];
          if (qde && q) {
            const deE = inst.des.find(d => d.de === qde);
            const codes = deE ? echteCodes(deE) : [];
            if (codes.length && !codes.includes(q)) return;
          }
          alle.push(idx);
        });
        // konfliktfreie Instanzen bevorzugen (z.B. CCI ohne Qualifier: die
        // Instanz wählen, deren DE7037-Codeliste den Wert enthält). Unter den
        // konfliktfreien zusätzlich die mit den meisten POSITIVEN Codetreffern
        // voranstellen: „CCI+++ZB3" gehört zur Instanz, deren DE7037-Codeliste
        // ZB3 führt — nicht zu einer Instanz, die mangels belegter Werte bloß
        // keinen Widerspruch hat (belegt an UTILMD 55639, Leistungskurve Z53).
        const frei = alle.filter(idx => konflikte(seg, instanzen[idx]) === 0);
        const basis = frei.length ? frei : alle;
        const treffer = idx => {
          let n = 0;
          for (const deE of instanzen[idx].des) {
            const codes = echteCodes(deE);
            if (!codes.length) continue;
            const v = deWert(seg, deE.de);
            if (v && codes.includes(v)) n++;
          }
          return n;
        };
        const maxT = Math.max.apply(null, basis.map(treffer));
        return maxT > 0 ? basis.filter(idx => treffer(idx) === maxT) : basis;
      }

      // Belegte Zusatzsegmente aus den AHB-Kapiteln außerhalb der Prüf-ID-Tabelle
      function ergaenzung(seg) {
        const liste = ctx.ergaenzungen || global.ahbErgaenzungen || [];
        for (const gruppe of liste) {
          if (gruppe.pruefis && ctx.pruefi && gruppe.pruefis.indexOf(ctx.pruefi) < 0) continue;
          if (gruppe.formate && ctx.format && gruppe.formate.indexOf(ctx.format) < 0) continue;
          const treffer = (gruppe.segmente || []).find(s =>
            s.seg === seg.tag && (!s.qual || s.qual === qualWert(seg)));
          if (treffer) return { was: treffer.was, quelle: gruppe.quelle, gruppe: gruppe.name };
        }
        return null;
      }

      for (let i = a; i <= b; i++) {
        const seg = segs[i];
        if (seg.tag === "UNH" || seg.tag === "UNT") { pruefeMig(i, seg); continue; }
        const kand = instKandidaten(seg);
        if (!kand.length) {
          // Manche Datengruppen beschreibt der AHB in eigenen Kapiteln statt in der
          // Prüf-ID-Tabelle (Produktpaket-Block, Kapitel 8.2). Sie stehen in
          // _engine/daten/ahb-ergaenzungen.js und gelten als belegt.
          const erg = ergaenzung(seg);
          if (erg) {
            H(i, `${seg.tag}${qualWert(seg) ? "+" + qualWert(seg) : ""}: ${erg.was || "Zusatzangabe"} `
               + `— nicht in der Prüf-ID-Tabelle, belegt durch ${erg.quelle}.`);
            pruefeMig(i, seg);
            continue;
          }
          const gleicherTyp = instanzen.some(x => x.seg === seg.tag);
          F(i, gleicherTyp
            ? `${seg.tag}+${qualWert(seg) || ""}: Qualifier ist im AHB der Prüf-ID ${ctx.pruefi} nicht vorgesehen.`
            : `Segment ${seg.tag} ist im AHB der Prüf-ID ${ctx.pruefi} nicht vorgesehen.`);
          pruefeMig(i, seg);
          continue;
        }
        let idx = kand.find(k => k >= cursor);
        if (idx === undefined) idx = kand[0]; // Wiederholung (neuer Vorgang/Position)
        cursor = idx;
        matchZahl[idx]++;
        const inst = instanzen[idx];

        // Codeprüfung je Datenelement der Instanz
        for (const deE of inst.des) {
          const v = deWert(seg, deE.de);
          if (v === null || v === "") continue;
          const codes = echteCodes(deE);
          if (!codes.length) continue;
          if (seg.tag === "RFF" && deE.de === "1154" && qualWert(seg) === "Z13") {
            if (v !== ctx.pruefi) F(i, `RFF+Z13: Prüf-ID "${v}" ≠ erkannte Prüf-ID "${ctx.pruefi}".`);
            continue;
          }
          if (seg.tag === "STS" && deE.de === "9013") continue; // gegen EBD geprüft
          if (!codes.includes(v))
            F(i, `DE${deE.de} "${v}": laut AHB zulässig sind ${codes.slice(0, 12).join(", ")}${codes.length > 12 ? ", …" : ""}.`);
        }
        // Muss-Präsenzprüfung je Datenelement: ein im AHB unbedingt als „X"/„M"
        // geführtes Datenelement der genutzten Segmentinstanz muss belegt sein.
        // Positionsgenau über pos/sub geprüft, damit wiederholte DE-Nummern
        // getrennt betrachtet werden (STS C556: Transaktionsgrund pos 2 vs.
        // Transaktionsgrundergänzung pos 3 — beide DE9013). So fällt z. B.
        // „STS+7++ZC8'" auf, dem die Muss-Ergänzung (ZW3/ZW4) fehlt.
        //
        // Maßgeblich ist bei codierten Datenelementen NICHT der DE-Status allein
        // (er steht in der Extraktion oft pauschal auf „X"), sondern der Status
        // der Codes selbst: Nur wenn mindestens ein Code unbedingtes Muss ist, ist
        // das DE Pflicht. Sind alle Codes bedingt/Soll/Kann (z. B. die dritte
        // STS+7-Ergänzung „für Lieferende bei befristeter Anmeldung": E01/E03 mit
        // „S [9P0..1]"), bleibt das DE optional — sonst meldete der Validator ein
        // Muss, das der AHB gar nicht verlangt. Freie Wert-DE ohne Codeliste
        // (Datum, Betrag, Vorgangsnummer …) sind bei unbedingtem „X" stets Pflicht.
        // Bedingte DE-Marker („X [nnn]") bleiben außen vor — ihre Bedingungen sind
        // nicht durchgängig maschinell entscheidbar; die konditionale Muss-Prüfung
        // erfolgt auf Segment-/Gruppenebene weiter unten.
        // Position des DE: bevorzugt die Instanzangabe (pos/sub — nur STS trägt
        // sie), sonst der zentrale DECODER. Ohne den Fallback blieb die Prüfung
        // auf STS beschränkt: „IDE+24'" ohne Vorgangsnummer (DE7402) oder ein
        // NAD+MS ohne MP-ID (DE3039) rutschten grün durch (belegt an PID 55658).
        const deUnbedingt = e => /^[XxM]$/.test(String(e == null ? "" : e).trim());
        for (const deE of inst.des) {
          const posPaar = deE.pos != null ? [deE.pos, deE.sub || 0]
                                          : (DECODER[seg.tag] || {})[deE.de];
          if (!posPaar) continue;
          if (!deUnbedingt(deE.expr)) continue;
          const codeListe = deE.codes || [];
          if (codeListe.length && !codeListe.some(c => deUnbedingt(c[2]))) continue;
          // Verlässlichkeitsgrenze des Status bei freien Wert-DE über den
          // DECODER-Fallback: „X"/„M" der AHB-Extraktion heißt beim ADRESSBLOCK
          // des NAD (Straße/Ort/Land, Elemente ab C059) nur „verwendet" bzw.
          // „Muss, WENN der Block genutzt wird" — die eigentliche Blockbedingung
          // steht dort an einem Geschwister-DE (PLZ „M [268] S [166]") und ging
          // je DE verloren (belegt am Kunden-NAD Z66–Z70: Name ohne Anschrift ist
          // zulässig). Als Pflicht gewertet wird ein freies DE über den Fallback
          // deshalb bis einschließlich Element 4 (Qualifier, Hauptwert und der
          // NAME C080/DE3036 — ein leeres „NAD+Z46'" ist ein Fehler, belegt an
          // PID 55658), NICHT aber die dahinterliegenden Anschrift-Elemente.
          // Positionsgenaue Instanzangaben (pos, STS-Pfad) und codierte DE
          // bleiben unverändert scharf.
          if (!codeListe.length && deE.pos == null && posPaar[0] > 3) continue;
          const roh = wert(seg, posPaar[0], posPaar[1]).replace(/\?(.)/g, "$1").trim();
          if (roh) continue;
          const wo = deE.name ? ` (${deE.name})` : "";
          // Statt „im AHB nachschauen" die konkret erwartete Angabe nennen:
          // bei codierten DE die zulässigen Codes mit Klartext und — je Code —
          // die als [nnn] hinterlegte Abhängigkeit; bei freien Wert-DE Name und
          // MIG-Feldformat. Verweist eine Bedingung auf die Ursprungs-/Bezugs-
          // nachricht, wird deren Referenz (DAR/Datum) angehängt (konkreterBezug).
          let erwartet;
          const bedSammlung = [];
          const lokalBed = lokaleBedingungen(inst.bedingungen);
          if (codeListe.length) {
            const teile = codeListe.slice(0, 12).map(function (c) {
              const bedText = bedingungsRefsText(c[2], lokalBed);
              if (bedText) bedSammlung.push(bedText);
              return c[0] + (c[1] ? " (" + c[1] + ")" : "") + (bedText ? " — nur wenn " + bedText : "");
            });
            erwartet = "zulässige Angabe: " + teile.join("; ")
                     + (codeListe.length > 12 ? ", …" : "");
          } else {
            const feld = mig.felder[`${seg.tag} ${deE.de}`];
            const fmt = feld && feld.fmt ? ` (Format ${feld.fmt})` : "";
            erwartet = "erwartet: " + (deE.name || ("DE" + deE.de)) + fmt;
          }
          const bezug = konkreterBezug(bedSammlung.join(" "));
          F(i, `${seg.tag}${qualWert(seg) ? "+" + qualWert(seg) : ""}: Pflichtangabe DE${deE.de}${wo} fehlt `
             + `(Prüf-ID ${ctx.pruefi}) — ${erwartet}${bezug ? " → Bezug: " + bezug : ""}.`);
        }
        // DTM-Wertformat gegen Formatcode (2379)
        if (seg.tag === "DTM") {
          const fmt = deWert(seg, "2379"), v = deWert(seg, "2380");
          if (fmt && v && DTM_FORMATE[fmt] && !DTM_FORMATE[fmt].test(v))
            F(i, `DTM: Wert "${v}" passt nicht zum Formatcode ${fmt}${fmt === "303" ? " (CCYYMMDDHHMM+00, UTC)" : ""}.`);
          else if (fmt === "303" && v && !v.endsWith(af ? af.zeit.dtm303Suffix : "+00"))
            F(i, `DTM: Format 303 verlangt UTC-Angabe mit Suffix "+00".`);
        }
        // NAD MS/MR: Identität mit UNB (Allg. Festlegungen)
        if (seg.tag === "NAD" && af && af.mpid.unbNadIdentisch) {
          const q = qualWert(seg), id = deWert(seg, "3039");
          if (q === "MS" && mpAbs && id && id !== mpAbs) F(i, `NAD+MS "${id}" ≠ UNB-Absender "${mpAbs}" (Allg. Festlegungen Kap. 2.13).`);
          if (q === "MR" && mpEmp && id && id !== mpEmp) F(i, `NAD+MR "${id}" ≠ UNB-Empfänger "${mpEmp}" (Allg. Festlegungen Kap. 2.13).`);
        }
        pruefeMig(i, seg);
        pruefeCodelisten(i, seg);
        if (seg.tag === "STS") pruefeSts(i, seg);
        pruefeEbd(i, seg, inst);
      }

      // Wiederholungsprüfung auf Nachrichtenebene: eine Instanz OHNE Segmentgruppe
      // (BGM, DTM+137, RFF+Z13 …) darf laut MIG-Segmentlage (maxWdh = 1) nur einmal
      // vorkommen. Ein Duplikat (z. B. zweites BGM) blieb bisher unbeanstandet, weil
      // beide Vorkommen derselben Instanz zugeordnet wurden. Gruppen-Instanzen
      // bleiben außen vor — ihre Wiederholung ist die Wiederholung der Gruppe.
      instanzen.forEach((inst, idx) => {
        if (inst.sg || matchZahl[idx] <= 1) return;
        const wdh = (mig.maxWdh || {})[inst.seg];
        if (wdh !== 1) return;
        const qde = QUAL_DE[inst.seg];
        const deE = qde ? inst.des.find(d => d.de === qde) : null;
        const ec = deE ? echteCodes(deE) : [];
        const q = ec.length === 1 ? "+" + ec[0] : "";
        global_.meldungen.push(`${inst.seg}${q}: ${matchZahl[idx]}× in der Nachricht, `
          + `laut MIG ist an dieser Stelle nur 1 Wiederholung vorgesehen.`);
      });

      // NAD+MS/NAD+MR (Marktpartner-Identität Absender/Empfänger, Allg.
      // Festlegungen Kap. 2.13): genau EIN Auftreten je Nachricht — anders als
      // die übrigen NAD-Qualifier (Kunden-/Lieferstellenanschrift), die in
      // Mehr-Vorgangs-Nachrichten je Vorgang wiederkehren dürfen. Die
      // Wiederholungsprüfung oben lässt gruppierte Instanzen (inst.sg gesetzt)
      // deshalb bewusst außen vor — NAD+MS/MR sitzen aber vor jeder
      // Vorgangsschleife (SG2) und dürfen unabhängig von ihrer SG-Zuordnung in
      // der AHB-Extraktion nicht mehrfach vorkommen; ein Duplikat blieb bislang
      // unbeanstandet, weil beide Vorkommen derselben Instanz zugeordnet wurden.
      for (const q of ["MS", "MR"]) {
        let n = 0;
        for (let i = a; i <= b; i++) {
          if (segs[i].tag === "NAD" && deWert(segs[i], "3035") === q) n++;
        }
        if (n > 1) global_.meldungen.push(`NAD+${q}: ${n}× in der Nachricht — laut Allg. `
          + `Festlegungen (Kap. 2.13) ist je Nachricht nur ein NAD+${q} (Marktpartner-Identität) vorgesehen.`);
      }

      // Fehlende Muss-Instanzen: auf Nachrichtenebene (ohne SG) immer, innerhalb
      // von Gruppen nur in Blöcken (zusammenhängenden Gruppenläufen), die in der
      // Nachricht tatsächlich verwendet werden - optionale Zweige schlagen so
      // nicht an, fehlende Muss-Segmente aktiver Gruppen schon.
      const blockVon = new Array(instanzen.length).fill(-1);
      let blockId = -1, prevSg = "__";
      instanzen.forEach((inst, idx) => {
        if (inst.sg !== prevSg) { blockId++; prevSg = inst.sg; }
        blockVon[idx] = blockId;
      });
      const aktiveBloecke = new Set();
      instanzen.forEach((inst, idx) => { if (matchZahl[idx]) aktiveBloecke.add(blockVon[idx]); });
      // Hinweis: Kind-Gruppen optionaler Gruppen (z.B. SG41-PCD unter SG39-ALC)
      // werden nur geprüft, wenn in ihrem Block selbst Segmente vorliegen -
      // die AHB-Extraktion enthält keine Gruppenhierarchie/Gruppenstatus.
      const signatur = inst => {
        const qde = QUAL_DE[inst.seg];
        const deE = qde ? inst.des.find(d => d.de === qde) : null;
        return inst.seg + "|" + (deE ? echteCodes(deE).join(",") : "");
      };
      const bediente = new Set();
      instanzen.forEach((inst, idx) => { if (matchZahl[idx]) bediente.add(signatur(inst)); });

      // ---- ahbicht-gestützte Auswertung konditionaler Muss-Bedingungen ---------
      // Dreiwertige Logik: true (Bedingung erfüllt -> Pflicht), false (nicht
      // erforderlich), null (nicht maschinell entscheidbar -> Warnung).
      // Präsenz-Check nur bei BEKANNTER Qualifier-Position (QUAL_DE), sonst null
      // -> so entstehen keine falsch-positiven harten Fehler.
      function segCheck(chk) {
        const qd = QUAL_DE[chk.tag];
        if (!qd) return null;                    // Qualifier-Position unbekannt
        let vorhanden = false;
        for (let i = a; i <= b; i++) {
          const s = segs[i];
          if (s.tag === chk.tag && deWert(s, qd) === chk.qual) { vorhanden = true; break; }
        }
        return chk.neg ? !vorhanden : vorhanden;
      }
      function evalNode(node) {
        if (!node) return null;
        if (node.c !== undefined) {
          const bd = ctx.bedingungen && ctx.bedingungen[node.c];
          return bd && bd.check ? segCheck(bd.check) : null;
        }
        const vals = (node.nodes || []).map(evalNode);
        if (node.op === "and") return vals.some(v => v === false) ? false : (vals.some(v => v === null) ? null : true);
        if (node.op === "or")  return vals.some(v => v === true)  ? true  : (vals.some(v => v === null) ? null : false);
        if (node.op === "xor") return vals.some(v => v === null) ? null : (vals.filter(v => v === true).length === 1);
        return null;
      }
      // Bedingung eines (ggf. gemischten) Status-Ausdrucks auswerten: nur der
      // führende „Muss [...]"-Teil ist maßgeblich; ein nachfolgender Soll/Kann-Teil
      // (z. B. „Muss [47] Soll [19] ∧ [1]") wird abgeschnitten. Bedingungsausdrücke
      // enthalten nur Zahlen, Klammern und die Operatoren ∧ ∨ ⊻ — der Lauf endet am
      // ersten Buchstaben (nächstes Statuswort).
      function bedingungsAusdruck(expr) {
        const m = /^Muss\s+([\[\]\d\s∧∨⊻()]+)/.exec(expr || "");
        return m ? m[1].trim() : null;
      }
      function bedingungErfuellt(expr) {
        if (!ctx.condTree) return null;
        const a = bedingungsAusdruck(expr);
        return a ? evalNode(ctx.condTree[a]) : null;
      }
      // Klartext ausschließlich der als [nnn] referenzierten Bedingungen eines
      // (Code-)Ausdrucks — Paket-/Wiederholungsangaben wie [9P0..1] bleiben außen
      // vor (die eckige Klammer enthält dort keine reine Zahl). Für die Anzeige
      // fehlender Muss-Datenelemente samt ihrer Abhängigkeiten.
      function bedingungsRefsText(expr, lokal) {
        const m = String(expr == null ? "" : expr).match(/\[(\d+)\]/g);
        if (!m) return "";
        return m.map(function (b) {
          const n = b.slice(1, -1);
          const bd = ctx.bedingungen && ctx.bedingungen[n];
          const txt = (bd && bd.text) || (lokal && lokal[n]);
          return txt ? "[" + n + "] " + txt : "[" + n + "]";
        }).join(" ∧ ");
      }
      // Instanz-eigene Bedingungstexte („[519] Hinweis: …") aus dem Freitextfeld
      // inst.bedingungen als Nummernkarte lesen — sie ergänzen die globale
      // Bedingungsliste bei prüf-ID-lokalen Hinweisen.
      function lokaleBedingungen(text) {
        const karte = {};
        const re = /\[(\d+)\]\s*([\s\S]*?)(?=(?:\n\s*\n\s*\[\d+\])|(?:\n\s*\[\d+\])|$)/g;
        let t;
        while ((t = re.exec(String(text || "")))) karte[t[1]] = t[2].trim();
        return karte;
      }
      // Klartext der Bedingungen eines Ausdrucks (für die Warnung bei nicht
      // maschinell entscheidbaren Bedingungen — z. B. Verweise auf die
      // Ursprungs-/Stornorechnung, die aus dieser Nachricht nicht prüfbar sind).
      function bedingungsText(expr) {
        const roh = bedingungsAusdruck(expr) || String(expr || "");
        const nums = roh.match(/\d+/g) || [];
        return nums.map(function (n) {
          var bd = ctx.bedingungen && ctx.bedingungen[n];
          return bd && bd.text ? "[" + n + "] " + bd.text : "[" + n + "]";
        }).join("; ");
      }

      // Konkreter Bezug einer nicht auflösbaren Bedingung: Verweist sie auf eine
      // Ursprungs-/Vorgängernachricht, wird deren Referenz (RFF+OI/ACW/TN) samt
      // Belegdatum (folgendes DTM) ausgegeben — so hat der Prüfer die DAR und das
      // Erstellungsdatum der Bezugsnachricht direkt zur Hand. Nennt die Bedingung
      // ein Segment DIESER Nachricht (z. B. NAD+MR, MOA+113), wird dessen
      // Vorhandensein/Wert gezeigt.
      const BEZUG_RFF = { OI: "Ursprungsrechnung", ACW: "vorherige Nachricht", TN: "referenzierter Vorgang" };
      function bezugDatum(idx) {
        const d = segs[idx + 1];
        if (!d || d.tag !== "DTM") return "";
        const t = String((d.elemente[0] || [])[1] || "").replace(/\?(.)/g, "$1");
        const m = /^(\d{4})(\d{2})(\d{2})/.exec(t);
        return m ? m[3] + "." + m[2] + "." + m[1] : "";
      }
      function konkreterBezug(condText) {
        const teile = [];
        if (/Ursprung|Storno|zu stornierend|vorherig|vorangeg/i.test(condText || "")) {
          for (let i = a; i <= b; i++) {
            const s = segs[i];
            if (!s || s.tag !== "RFF") continue;
            const q = (s.elemente[0] || [])[0];
            if (!BEZUG_RFF[q]) continue;
            const wert = (s.elemente[0] || [])[1] || "";
            const dat = bezugDatum(i);
            teile.push(BEZUG_RFF[q] + " " + wert + (dat ? ", Belegdatum " + dat : ""));
          }
        }
        const ref = /\b([A-Z]{3})\+([A-Z0-9]{1,3})\b/.exec(condText || "");
        if (ref && QUAL_DE[ref[1]]) {
          const tag = ref[1], code = ref[2];
          let treffer = null;
          for (let j = a; j <= b; j++) {
            const sg = segs[j];
            if (sg && sg.tag === tag && deWert(sg, QUAL_DE[tag]) === code) { treffer = sg; break; }
          }
          if (treffer) {
            const id = tag === "NAD" ? ((treffer.elemente[1] || [])[0] || "") : "";
            teile.push(tag + "+" + code + (id ? ": " + id : " (vorhanden)"));
          } else {
            teile.push(tag + "+" + code + " nicht in dieser Nachricht");
          }
        }
        return teile.join("; ");
      }

      // Eine Segmentgruppe kann an einen Codewert einer anderen gebunden sein
      // (SG5 LOC+Z21 „Tranche" nur bei STS+7 mit ZW5). Ist dieser Code in der
      // Nachricht nicht gesetzt, ist das Segment nicht erforderlich — sonst meldete
      // der Validator ein Muss, das der AHB hier gar nicht verlangt.
      function schalterErfuellt(inst) {
        const regeln = inst.schalter || [];
        if (!regeln.length) return null;
        return regeln.every(r => {
          let da = false;
          for (let i = a; i <= b; i++) {
            const seg = parsed.segmente[i];
            if (!seg || seg.tag !== r.seg) continue;
            const treffer = (seg.elemente || []).some((el, k) => k > 0 && el.some(x => x === r.code));
            if (treffer) { da = true; break; }
          }
          return r.art === "code_fehlt" ? !da : da;
        });
      }

      // Ein CAV (Merkmalswert) gehört zum vorangehenden CCI (Merkmal) derselben
      // Segmentgruppe; sein Pflichtstatus kann nie über dem des CCI liegen. Fehlt
      // dem CAV in der Extraktion die Gruppenangabe (sgExpr), erbt es die des
      // zugehörigen CCI im selben Block — sonst meldet der Validator ein hartes
      // CAV-Muss, obwohl das zugehörige Merkmal nur bedingt/Soll ist (belegt an
      // UTILMD 55218 CAV+Z22 „Verbrauchsaufteilung temperaturabhängige
      // Marktlokation": CCI trägt „Soll [166]", das CAV hatte keine sgExpr).
      const effSgExpr = instanzen.map(i => i.sgExpr);
      const letztesCciSg = {};
      instanzen.forEach((inst, idx) => {
        const b = blockVon[idx];
        if (inst.seg === "CCI") letztesCciSg[b] = inst.sgExpr;
        else if (inst.seg === "CAV" && !inst.sgExpr && letztesCciSg[b] != null)
          effSgExpr[idx] = letztesCciSg[b];
      });

      instanzen.forEach((inst, idx) => {
        if (["UNH", "UNT", "UNB", "UNZ"].includes(inst.seg)) return;
        if (inst.sg && !aktiveBloecke.has(blockVon[idx])) return;
        if (inst.sg && bediente.has(signatur(inst)) && !matchZahl[idx]) return;
        if (schalterErfuellt(inst) === false) return;   // Bedingung trifft nicht zu
        const klasse = mussKlasse(inst.expr);
        if (klasse && !matchZahl[idx]) {
          const qde = QUAL_DE[inst.seg];
          const deE = qde ? inst.des.find(d => d.de === qde) : null;
          const ec = deE ? echteCodes(deE) : [];
          const q = ec.length === 1 ? "+" + ec[0] : "";
          const label = `${inst.seg}${q}${inst.section ? " (" + inst.section + ")" : ""}`;
          // Ein Segment ist nur dann UNBEDINGTE Pflicht, wenn sowohl das Segment
          // selbst („Muss") als auch seine Segmentgruppe („sgExpr") unbedingt Muss
          // sind. Trägt die Gruppe eine Bedingung (Muss [nn]) oder nur Soll/Kann,
          // richtet sich die Pflicht des Segments nach der Gruppe — sonst meldet
          // der Validator ein hartes Muss, das der AHB im konkreten Anwendungsfall
          // gar nicht verlangt (z. B. LOC+Z21 Tranche neben vorhandener LOC+Z16;
          // MSCONS RFF+AGI in einer Soll-Gruppe). Fehlt eine sgExpr (Segmente auf
          // Nachrichtenebene), bleibt es beim Segment-Status — Abwärtskompatibilität.
          const sgExpr = effSgExpr[idx];
          const grpKlasse = sgExpr ? mussKlasse(sgExpr) : "hart";
          if (klasse === "hart" && grpKlasse === "hart") { fehlendeMuss.push(label); return; }
          // Maßgeblichen Bedingungsausdruck bestimmen: die konditionale Ebene
          // (bevorzugt die Gruppe, sonst das Segment selbst) auswerten.
          const condExpr = grpKlasse === "bedingt" ? sgExpr
            : (klasse === "bedingt" ? inst.expr : sgExpr);
          const erg = bedingungErfuellt(condExpr) !== null
            ? bedingungErfuellt(condExpr)
            : bedingungErfuellt(klasse === "bedingt" ? inst.expr : sgExpr); // true/false/null
          if (erg === true) fehlendeMuss.push(`${label} — Bedingung erfüllt (${condExpr})`);
          else if (erg === false) { /* Bedingung trifft nicht zu: Segment nicht erforderlich */ }
          else {
            const txt = bedingungsText(condExpr);
            const bezug = konkreterBezug(txt);
            bedingteMuss.push(`${label} — bedingtes Muss${txt ? ", abhängig von: " + txt : ' (Gruppe „' + (sgExpr || inst.expr) + '")'}${bezug ? " → " + bezug : ""}`);
          }
        }
      });
    }

    // ---- Ergebnis ----------------------------------------------------------
    zeilen.forEach(z => { z.status = z.meldungen.length ? "fehler" : "ok"; });
    const fehlerSumme = zeilen.reduce((n, z) => n + z.meldungen.length, 0) +
      global_.meldungen.length + fehlendeMuss.length;
    return {
      zeilen, global: global_, fehlendeMuss, bedingteMuss,
      zusammenfassung: {
        segmente: zeilen.length,
        fehler: fehlerSumme,
        hinweise: zeilen.reduce((n, z) => n + z.hinweise.length, 0) + global_.hinweise.length,
        bedingteMuss: bedingteMuss.length,
        nachrichten: nachrichten.length,
      },
    };
  }

  // Beste Variante wählen (APERAK/CONTRL: kein RFF+Z13) - minimale Fehlerzahl
  function besteVariante(parsed, ctxBasis, metas) {
    let best = null;
    for (const [key, meta] of Object.entries(metas)) {
      const res = validiere(parsed, Object.assign({}, ctxBasis, { meta, pruefi: key }));
      if (!best || res.zusammenfassung.fehler < best.res.zusammenfassung.fehler)
        best = { key, meta, res };
    }
    return best;
  }

  const api = { parse, erkenne, validiere, besteVariante, DECODER, QUAL_DE, formatOk };
  global.AhbValidator = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
