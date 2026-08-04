// _engine/ahb-form-engine.js
// ------------------------------------------------------------------
// Universelle AHB-Formular-Engine (zentral, formatübergreifend).
//
// Grundlage ist die "Formular-Meta" je Prüf-ID (erzeugt mit
// scripts/ahb_form_meta.py aus der AHB-Extraktion): die geordnete Liste aller
// Segmentinstanzen mit Datenelementen, Codelisten und Muss/Soll/Kann-Ausdrücken.
// Daraus werden Formular UND EDIFACT-Nachricht segmentgenau erzeugt.
//
// Verwendung (Seiten-Glue):
//   AhbFormEngine.konfiguriere({ formatConfig, darPrefix: "ORD",
//                                posSgRegex: /^SG(29|30|34|38)$/ });
//   AhbFormEngine.renderFor(pruefi, meta);     // baut #kopfFelder/#posListe auf
//   AhbFormEngine.generate(pruefi, meta);      // erzeugt Nachricht nach #ediOut
//
// Erwartete DOM-IDs: kopfFelder, posListe, panelPositionen, ediOut, errorBox,
// okBox, absender, empfaenger, kontaktMail. (Konvention aller Generator-Seiten.)
//
// Emitter decken die in den MaKo-AHBs vorkommenden Segmenttypen ab; unbekannte
// Typen werden als Hinweis gemeldet statt still verschluckt.
// ------------------------------------------------------------------
(function (global) {
  "use strict";

  const $ = id => document.getElementById(id);
  let CFG = { formatConfig: null, darPrefix: "EDI", posSgRegex: /^SG(29|30|34|38)$/ };
  let posCount = 0;
  let aktuelleMeta = null;
  let aktuellePruefi = null;
  let aktuelleRef = "";   // Nachrichtenreferenz (UNB/UNH/BGM/IDE/UNT/UNZ), je Formular neu

  // ---- Kuratierte Sicht (Feldauswahl-Umbau, Phase 2) ----------------------
  // Die kuratierten Masken rendern ihr Formular selbst (schlankes Profil-Modul,
  // _engine/utilmd-maske.js) und melden der Engine nur die Zuordnung ihrer
  // Feld-IDs auf die Instanzfelder der Formular-Meta. Die ERZEUGUNG läuft dann
  // ausschließlich hier — ein Erzeugungsweg für Vollformular und Maske.
  //   setzeSicht({
  //     alias:        { "<pfad>_<k>": "<DOM-Feld-ID>", … },
  //     posAktiv:     true,        // genau eine Position (SG4-Vorgang) emittieren
  //     zeitraumWdh:  () => [...], // weitere Verwendungszeitraum-Wiederholungen ("2", …)
  //     zusatzSegmente: (inst, pfad, ctx) => {…}, // z. B. Produktpaket nach einer Instanz
  //   })
  // setzeSicht(null) schaltet zurück auf das Vollformular-Verhalten.
  let SICHT = null;
  function setzeSicht(s) { SICHT = s || null; }
  // DOM-ID eines Instanzfeldes: im Sicht-Modus die gemeldete Feld-ID, sonst f_<pfad>_<k>.
  function feldId(pfad, k) {
    if (SICHT && SICHT.alias) {
      const a = SICHT.alias[`${pfad}_${k}`];
      if (a !== undefined) return a;
    }
    return `f_${pfad}_${k}`;
  }
  // Konfigurierbare DOM-IDs: die Generatorseiten nutzen die Engine-Konvention
  // (kopfFelder, ediOut, …), die kuratierten Masken ihre gewachsenen IDs
  // (dynamicForm, edifactOutput, NAD_MS als globales Absenderfeld, …).
  function EL(name) { return $(((CFG.ids || {})[name]) || name); }

  // Referenzvergabe wie im UTILMD-Generator: Millisekunden seit 01.01.2000 (UTC),
  // 12-stellig, passt in DE0020/DE0062 (an..14).
  function nachrichtRef() { return String(Date.now() - Date.UTC(2000, 0, 1)); }

  // Vorgangsnummer (SG4 IDE DE7402, an..35): <Präfix><DAR>, bei mehreren Vorgängen je
  // Nachricht zusätzlich "-<lfd. Nr.>". Derselbe Aufbau gilt in den kuratierten
  // UTILMD-Masken (_engine/generator.js); scripts/test_vorgangsnummer.js hält beide
  // Stellen zusammen. So trägt jede erzeugte Nachricht — Anfrage wie Antwort — denselben,
  // als EdifactGenerator-Vorgang erkennbaren Namensaufbau.
  const VORGANG_PRAEFIX = "EDIGEN{";
  function vorgangsNummer(dar, lfd) {
    const n = Number(lfd) || 1;
    return `${VORGANG_PRAEFIX}${dar}${n > 1 ? "-" + String(n).padStart(2, "0") : ""}`;
  }
  function heuteDeutsch(ph) {
    const d = new Date(); const p = n => String(n).padStart(2, "0");
    const datum = `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
    return /HH:MM/.test(ph || "") ? `${datum} ${p(d.getHours())}:${p(d.getMinutes())}` : datum;
  }

  // ---- MaKo-Terminumrechnung (deutsche Prozesszeit -> UTC) -----------------
  // Prozessuale Termine der Marktkommunikation meinen den Tagesbeginn deutscher
  // Zeit (Strom 00:00, Gas 06:00). EDIFACT führt sie in UTC (Format 303):
  // „zum 01.09.2026" ist das Tagesende des 31.08. -> 202608312200+00 (MESZ).
  // Gesetzliche MESZ-Tabelle laut BDEW-Vorgabe (identisch zur bisherigen Maske).
  const MESZ_TABELLE = {
    2000: ["2000-03-26", "2000-10-29"], 2001: ["2001-03-25", "2001-10-28"],
    2002: ["2002-03-31", "2002-10-27"], 2003: ["2003-03-30", "2003-10-26"],
    2004: ["2004-03-28", "2004-10-31"], 2005: ["2005-03-27", "2005-10-30"],
    2006: ["2006-03-26", "2006-10-29"], 2007: ["2007-03-25", "2007-10-28"],
    2008: ["2008-03-30", "2008-10-26"], 2009: ["2009-03-29", "2009-10-25"],
    2010: ["2010-03-28", "2010-10-31"], 2011: ["2011-03-27", "2011-10-30"],
    2012: ["2012-03-25", "2012-10-28"], 2013: ["2013-03-31", "2013-10-27"],
    2014: ["2014-03-30", "2014-10-26"], 2015: ["2015-03-29", "2015-10-25"],
    2016: ["2016-03-27", "2016-10-30"], 2017: ["2017-03-26", "2017-10-29"],
    2018: ["2018-03-25", "2018-10-28"], 2019: ["2019-03-31", "2019-10-27"],
    2020: ["2020-03-29", "2020-10-25"], 2021: ["2021-03-28", "2021-10-31"],
    2022: ["2022-03-27", "2022-10-30"], 2023: ["2023-03-26", "2023-10-29"],
    2024: ["2024-03-31", "2024-10-27"], 2025: ["2025-03-30", "2025-10-26"],
    2026: ["2026-03-29", "2026-10-25"], 2027: ["2027-03-28", "2027-10-31"],
    2028: ["2028-03-26", "2028-10-29"], 2029: ["2029-03-25", "2029-10-28"],
    2030: ["2030-03-31", "2030-10-27"], 2031: ["2031-03-30", "2031-10-26"],
    2032: ["2032-03-28", "2032-10-31"],
  };
  function istMESZ(jahr, monat, tag, stunde) {
    const regel = MESZ_TABELLE[jahr];
    if (!regel) return false;
    const p = n => String(n).padStart(2, "0");
    const t = new Date(`${jahr}-${p(monat)}-${p(tag)}T${p(stunde)}:00:00Z`);
    return t >= new Date(regel[0] + "T01:00:00Z") && t < new Date(regel[1] + "T01:00:00Z");
  }
  // TT.MM.JJJJ (deutscher Prozess-Tagesbeginn) -> "CCYYMMDDHHMM+00".
  function makoUtc(tag, monat, jahr, sparte) {
    const zielStunde = (String(sparte).toUpperCase() === "GAS") ? 6 : 0;
    const versatz = istMESZ(jahr, monat, tag, zielStunde) ? 2 : 1;
    let h = zielStunde - versatz, d = tag, m = monat, j = jahr;
    if (h < 0) {
      h += 24;
      const vortag = new Date(Date.UTC(jahr, monat - 1, tag - 1));
      d = vortag.getUTCDate(); m = vortag.getUTCMonth() + 1; j = vortag.getUTCFullYear();
    }
    const p = n => String(n).padStart(2, "0");
    return `${j}${p(m)}${p(d)}${p(h)}00+00`;
  }

  // ---- MIG-Feldformate (Länge/Zeichenart) für Feld-Hinweise ---------------
  let MIG_CACHE;   // undefined = noch nicht ermittelt, null = nicht verfügbar
  function migFelder() {
    if (MIG_CACHE !== undefined) return MIG_CACHE;
    MIG_CACHE = null;
    try {
      const alle = global.migFormate;
      if (alle) {
        // Formatstand: aus der Format-Konfiguration bzw. dem Stand-Modul (Phase 3:
        // eine Seite je Typ, Stand als Parameter); Rückfall auf den Seitenpfad.
        const pfadStand = ((global.location || {}).pathname || "").match(/\b(20\d{4})\b/);
        const stand = (CFG.formatConfig || {}).stand
          || (global.EdiStand && global.EdiStand.aktiv())
          || (pfadStand && pfadStand[1]);
        let fmt = ((CFG.formatConfig || {}).unhKennung || "").split(":")[0];
        if (fmt === "UTILMD")
          fmt = /\/Gas\//.test((global.location || {}).pathname || "") ? "UTILMD_GAS" : "UTILMD_STROM";
        const s = stand && alle[stand];
        if (s && s[fmt] && s[fmt].felder) MIG_CACHE = s[fmt].felder;
      }
    } catch (e) { /* ohne MIG-Daten keine Hinweise */ }
    return MIG_CACHE;
  }
  function migInfo(seg, de) {
    const felder = migFelder();
    const f = felder && felder[`${seg} ${de}`];
    const m = f && f.fmt && /^(an|a|n)(\.\.)?(\d+)$/.exec(f.fmt);
    if (!m) return null;
    const art = { a: "alphabetisch", an: "alphanumerisch", n: "numerisch" }[m[1]];
    return { fmt: f.fmt, laenge: Number(m[3]), variabel: !!m[2],
             text: `${f.fmt} · ${art}, ${m[2] ? "max." : "genau"} ${m[3]} Zeichen` };
  }

  function edi(s) {
    return String(s).replace(/\?/g, "??").replace(/\+/g, "?+").replace(/:/g, "?:").replace(/'/g, "?'");
  }
  function codevergabe(mpId) {
    for (const c of ((CFG.formatConfig || {}).codevergabe || [])) {
      if (String(mpId).startsWith(c.prefix)) return c;
    }
    return { unb: "500", nad: "293", name: "BDEW" };
  }
  function istMuss(expr) { return /^Muss\s*$/.test(expr || ""); }

  function teile(meta) {
    // kopf | pos (wiederholbar) | schluss (Summenteil nach UNS, z.B. INVOIC/REMADV)
    const raw = meta.instanzen || [];
    const hatUNS = raw.some(i => i.seg === "UNS");
    const unsIdx = raw.findIndex(i => i.seg === "UNS");
    const posIdxRaw = raw.findIndex(i => CFG.posSgRegex.test(i.sg || ""));
    const ohneUNS = a => a.filter(i => i.seg !== "UNS");
    if (posIdxRaw < 0) {
      if (unsIdx >= 0 && unsIdx < raw.length - 1)
        return { kopf: raw.slice(0, unsIdx), pos: [], schluss: raw.slice(unsIdx + 1), hatUNS };
      return { kopf: ohneUNS(raw), pos: [], schluss: [], hatUNS };
    }
    if (unsIdx > posIdxRaw)
      return { kopf: ohneUNS(raw.slice(0, posIdxRaw)), pos: raw.slice(posIdxRaw, unsIdx),
               schluss: raw.slice(unsIdx + 1), hatUNS };
    return { kopf: ohneUNS(raw.slice(0, posIdxRaw)), pos: ohneUNS(raw.slice(posIdxRaw)),
             schluss: [], hatUNS };
  }

  // ---- Formular ----------------------------------------------------------
  const DATUM_DE = new Set(["2380"]);

  // Vorbelegung der Transaktionsgrundergänzung (2. Gruppe C556 im STS+7).
  // Der Regelfall der Marktkommunikation ist die verbrauchende Marktlokation (ZW4);
  // nennt der Anwendungsfall ausdrücklich eine Erzeugung oder eine Tranche, gilt
  // ZW3 bzw. ZW5. Ist keiner davon zulässig, bleibt der erste Code des AHB.
  function bevorzugteErgaenzung(codes, beschreibung) {
    const text = String(beschreibung !== undefined ? beschreibung
      : ((aktuelleMeta && aktuelleMeta.beschreibung) || "")).toLowerCase();
    const reihenfolge = /erzeug|erz\.|einspeis|eeg|kwk/.test(text) ? ["ZW3", "ZW4", "ZW5"]
      : (/tranche/.test(text) ? ["ZW5", "ZW4", "ZW3"] : ["ZW4", "ZW3", "ZW5"]);
    const treffer = reihenfolge.find(c => codes.indexOf(c) >= 0);
    return treffer || codes[0] || "";
  }

  // Auswahlfeld der EBD-Antwortcodes für ein STS-Statussegment. Liefert "" (kein
  // eigenes Feld), wenn die Prüf-ID kein EBD nennt oder die Codes nicht vorliegen —
  // dann bleibt es beim freien Eingabefeld.
  function antwortcodeFeld(id, inst, deE, pflicht) {
    const AC = global.EdiAntwortcodes || (typeof EdiAntwortcodes !== "undefined" ? EdiAntwortcodes : null);
    if (!AC) return "";
    const ebds = (inst.des.find(d => d.de === "1131") || { codes: [] }).codes.map(c => c[0])
      .filter(c => /^(E|S|G|GS)_\d{3,4}$/.test(c));
    if (!ebds.length) return "";
    // Cluster: bevorzugt aus der AHB-Bedingung am Datenelement, ersatzweise aus der
    // Prozess-Meta der Seite (Bestätigung/Ablehnung).
    let cluster = AC.clusterAusBedingungen(deE.expr, inst.bedingungen || "");
    if (!cluster) {
      const pmm = global.prozessMeta || (typeof prozessMeta !== "undefined" ? prozessMeta : null);
      const m = pmm && aktuellePruefi ? pmm[aktuellePruefi] : null;
      cluster = m && m.antwortcluster === "ablehnung" ? "Ablehnung"
              : (m && m.antwortcluster === "zustimmung" ? "Zustimmung" : "");
    }
    if (!cluster) {
      // Letzter Rückgriff: die Bezeichnung des Anwendungsfalls im AHB. Sie benennt die
      // Art der Antwort („Bestätigung Kündigung", „Ablehnung Anmeldung erz. MaLo").
      const b = String((aktuelleMeta && aktuelleMeta.beschreibung) || "").toLowerCase();
      if (/ablehnung|abweisung|zurückweis/.test(b)) cluster = "Ablehnung";
      else if (/bestätigung|zustimmung|positive/.test(b)) cluster = "Zustimmung";
    }
    const pm = global.prozessMeta || (typeof prozessMeta !== "undefined" ? prozessMeta : null);
    const vorgabeCode = (pm && aktuellePruefi && pm[aktuellePruefi] || {}).antwortcode || "";
    const a = AC.auswahl(ebds, cluster, vorgabeCode, "", ebdKontext());
    if (!a.optionen.length) return "";
    const opts = (pflicht ? "" : `<option value="">– keine Angabe –</option>`) +
      a.optionen.map(o => `<option value="${o.code}" data-ebd="${o.ebd}"${o.v === a.vorgabe ? " selected" : ""}>${o.t}</option>`).join("");
    return `<div class="field"><label>DE${deE.de}: ${deE.name || "Antwortcode"}${bedingungsSpan(deE)}</label>`
         + `<select id="${id}">${opts}</select><div class="mighint">${a.hinweis}</div></div>`;
  }

  function feldHtml(pfad, inst, deE) {
    const id = `f_${pfad}`;
    const codes = deE.codes || [];
    const ersterCodierter = inst.des.find(d => (d.codes || []).length > 0);
    const pflicht = istMuss(inst.expr) && (ersterCodierter === deE || !(deE.expr || "").trim() ||
                    codes.some(c => (c[2] || "").trim() === "X"));
    // Wiederholte Gruppe C556 des STS-Segments (Transaktionsgrundergänzung und
    // Ergänzung für befristetes Lieferende): eigenes Auswahlfeld je Wiederholung,
    // denn jede trägt genau einen Code. Ihr MIG-Status ist „D" (bedingt), deshalb
    // ist „keine Angabe" wählbar — vorausgewählt bleibt der erste Code des AHB,
    // weil die Ergänzung in diesen Prüf-IDs zur Meldung gehört.
    // Antwortcode des Entscheidungsbaums (STS+E01/Z35, DE 9013 „Code des Prüfschritts"):
    // Der AHB führt hier keine Codeliste, sondern verweist über DE 1131 auf das EBD.
    // Die wählbaren Codes stehen im EBD selbst — gefiltert nach dem Cluster, das die
    // AHB-Bedingung nennt ([360] Zustimmung / [359] Ablehnung).
    if (inst.seg === "STS" && deE.de === "9013" && !codes.length) {
        const feld = antwortcodeFeld(id, inst, deE, pflicht);
        if (feld) return feld;
    }
    if (inst.seg === "STS" && deE.de === "9013" && (deE.pos || 0) >= 3 && codes.length) {
      const bedingt = !/^[MR]$/.test(deE.migSt || "") && !pflicht;
      const vorgabe = bevorzugteErgaenzung(codes.map(c => c[0]));
      const opts = (bedingt ? `<option value="">– keine Angabe –</option>` : "") +
        codes.map(([c, n]) => `<option value="${c}"${c === vorgabe ? " selected" : ""}>${c}${n ? " – " + n.slice(0, 60) : ""}</option>`).join("");
      return `<div class="field"><label>DE${deE.de}: ${deE.name || ""} (Element ${(deE.pos || 0) + 1})${bedingungsSpan(deE)}</label><select id="${id}">${opts}</select></div>`;
    }
    if (codes.length > 1) {
      const opts = (pflicht ? "" : `<option value="">– keine Angabe –</option>`) +
        codes.map(([c, n]) => `<option value="${c}">${c}${n ? " – " + n.slice(0, 60) : ""}</option>`).join("");
      return `<div class="field"><label>DE${deE.de}: ${deE.name || ""}${bedingungsSpan(deE)}</label><select id="${id}">${opts}</select></div>`;
    }
    if (codes.length === 1) {
      return `<div class="fix">DE${deE.de} fest: <code>${codes[0][0]}</code> ${codes[0][1] ? "– " + codes[0][1].slice(0, 60) : ""}${bedingungsSpan(deE)}</div>`;
    }
    if (DATUM_DE.has(deE.de)) {
      const fmt = (inst.des.find(x => x.de === "2379") || { codes: [] }).codes.map(c => c[0]);
      // Z01 = ZZRB (Kündigungsfrist, MIG UTILMD): ZZ Anzahl, R Einheit (T/W/M),
      // B Bezugszeitpunkt (M/Q/H/J/T/R), z. B. 30TM = 30 Tage zum Monatsende.
      if (fmt.includes("Z01") && !fmt.some(c => /^\d/.test(c)))
        return `<div class="field"><label>${deE.name || "Frist"}${pflicht ? "" : " (optional)"}${bedingungsSpan(deE)}</label><input id="${id}" placeholder="ZZRB, z. B. 30TM"></div>`;
      const hatZeit = fmt.includes("303") || fmt.includes("304") || fmt.includes("203") || !fmt.length;
      const ph = fmt.includes("610") ? "MM.JJJJ"
        : (fmt.includes("102") && !hatZeit ? "TT.MM.JJJJ"
        : (fmt.includes("501") && !hatZeit ? "HH:MM-HH:MM"
        : (fmt.includes("602") && !hatZeit && !fmt.includes("106") && !fmt.includes("802") ? "JJJJ"
        : (fmt.includes("802") && !hatZeit && !fmt.includes("106") ? "MM"
        : (fmt.includes("106") && !hatZeit ? "TT.MM.JJJJ" : "TT.MM.JJJJ HH:MM")))));
      // Kalenderfunktion wie im UTILMD-Generator, als Alternative zur Texteingabe im
      // deutschen Format. Geöffnet wird das gemeinsame Kalenderblatt (_engine/kalender.js);
      // das native Feld bleibt als Rückfallweg und als Träger des erwarteten Typs stehen.
      const kalTyp = ph === "TT.MM.JJJJ HH:MM" ? "datetime-local"
        : ph === "TT.MM.JJJJ" ? "date" : ph === "MM.JJJJ" ? "month" : null;
      const eingabe = kalTyp
        ? `<div class="dtm-feld"><input id="${id}" placeholder="${ph}">` +
          `<button type="button" class="dtm-kalender-btn" title="Kalender öffnen" ` +
          `onclick="EdiKalender('${id}','${kalTyp}')">&#128197;</button>` +
          `<input type="${kalTyp}" class="dtm-kalender-input" id="${id}_kal" tabindex="-1"></div>`
        : `<input id="${id}" placeholder="${ph}">`;
      // Zeitangabe der Nachricht mitschreiben: EDIFACT führt Datum und Uhrzeit in UTC
      // (Format 303: CCYYMMDDHHMM+00). Ein Termin „zum 01.09.2026" ist damit das
      // Tagesende des 31.08.2026 — in der Nachricht steht 202608312200+00 (MESZ).
      // Ohne diesen Hinweis wirkt die Ausgabe wie ein anderer Tag als die Eingabe.
      return `<div class="field"><label>${deE.name || "Datum/Zeit"}${pflicht ? "" : " (optional)"}${bedingungsSpan(deE)}</label>${eingabe}`
           + `<div class="mighint dtm-utc" id="${id}_utc"></div></div>`;
    }
    // Freitextfeld: MIG-Feldformat (Zeichenart + Länge) als Hinweis + maxlength
    const mig = migInfo(inst.seg, deE.de);
    const maxAttr = mig ? ` maxlength="${mig.laenge}"` : "";
    const hinweis = mig ? `<div class="mighint">MIG: ${mig.text}</div>` : "";
    return `<div class="field"><label>DE${deE.de}: ${deE.name || ""}${pflicht ? "" : " (optional)"}${bedingungsSpan(deE)}</label><input id="${id}"${maxAttr}>${hinweis}</div>`;
  }

  // ---- Bedingungsausdrücke sichtbar machen -------------------------------
  // Die Bedingungs-Hilfe (bedingung-hilfe.js) hängt ihr Fragezeichen-Symbol an jedes
  // Element mit der Klasse "expr" und liest dessen Text als AHB-Ausdruck. Damit die
  // Hilfe überall dort erscheint, wo der AHB eine Bedingung führt, wird der Ausdruck
  // je Datenelement — einschließlich der an einzelnen Codewerten hängenden
  // Bedingungen — mit ausgegeben.
  function hatBedingung(ausdruck) {
    return /\[[0-9UP]/.test(ausdruck || "") || /[∧∨⊻⊕]/.test(ausdruck || "");
  }

  function bedingungsSpan(deE) {
    const teile = [];
    if (hatBedingung(deE.expr)) teile.push(deE.expr.trim());
    // Bedingungen, die nur an einzelnen Codewerten hängen, ergänzen
    const ausCodes = [];
    (deE.codes || []).forEach(c => {
      const ausdruck = (c[2] || "").trim();
      if (!hatBedingung(ausdruck)) return;
      const nummern = ausdruck.match(/\[[^\]]+\]/g) || [];
      nummern.forEach(n => { if (!teile.join(" ").includes(n) && !ausCodes.includes(`${c[0]} ${n}`)) ausCodes.push(`${c[0]} ${n}`); });
    });
    if (ausCodes.length) teile.push("Codes: " + ausCodes.join(", "));
    if (!teile.length) return "";
    return ` <span class="expr">${teile.join(" · ")}</span>`;
  }

  function instanzHtml(pfad, inst) {
    const seg = inst.seg;
    if (seg === "UNH" || seg === "UNS") return "";
    if (seg === "UNB") {
      // Nur die Anwendungsreferenz (DE0026) ist variabel; Rest wird automatisch erzeugt.
      const d26 = inst.des.find(d => d.de === "0026");
      if (d26 && (d26.codes || []).length > 1) {
        const opts = d26.codes.map(([c, n]) => `<option value="${c}">${c}${n ? " – " + n.slice(0, 50) : ""}</option>`).join("");
        return `<div class="segblock"><h3>UNB <span class="expr">Nutzdaten-Kopf</span></h3>
          <div class="field"><label>DE0026: Anwendungsreferenz</label><select id="f_${pfad}_unb26">${opts}</select></div></div>`;
      }
      return "";
    }
    if (seg === "NAD") {
      const q = ((inst.des.find(d => d.de === "3035") || {}).codes || [])[0];
      if (q && (q[0] === "MS" || q[0] === "MR"))
        return `<div class="fix">NAD+${q[0]} – ${q[0] === "MS" ? "Absender" : "Empfänger"} (globales Feld)</div>`;
    }
    if (seg === "CTA" || seg === "COM") return "";
    if (seg === "RFF") {
      const q = ((inst.des.find(d => d.de === "1153") || {}).codes || [])[0];
      if (q && q[0] === "Z13")
        return `<div class="fix">${inst.sg || ""} RFF+Z13 – Prüfidentifikator (automatisch)</div>`;
    }
    // Der Bedingungsausdruck der Segmentgruppe steht im AHB an der Gruppe, nicht am
    // Segment (SG5 „Ruhende Marktlokation" = Muss [2061] ∧ [96], das LOC selbst nur
    // „Muss"). Ohne ihn bliebe genau die Bedingung unsichtbar, die den Anwendungsfall
    // unterscheidet — deshalb wird er vorangestellt.
    const gruppenAusdruck = (inst.sgExpr && inst.sgExpr !== inst.expr && hatBedingung(inst.sgExpr))
      ? `${inst.sg || "Segmentgruppe"}: ${inst.sgExpr} · ` : "";
    const kopfzeile = `${inst.sg ? inst.sg + " " : ""}${seg} <span class="expr">${gruppenAusdruck}${inst.expr || ""}${inst.section ? " · " + inst.section : ""}</span>`;
    let inner = "";
    const uebersprungen = [];
    inst.des.forEach((deE, k) => {
      // DE2379 (Datums-/Zeitformat) wird nicht als Feld angeboten, sondern aus der
      // Eingabe abgeleitet. Seine Bedingungen gelten trotzdem und dürfen nicht
      // verlorengehen — sie werden unten am Segment ausgewiesen.
      if (deE.de === "2379") { uebersprungen.push(deE); return; }
      inner += feldHtml(`${pfad}_${k}`, inst, deE);
    });
    const restBedingungen = uebersprungen
      .map(deE => bedingungsSpan(deE).replace(/<\/?span[^>]*>/g, "").trim())
      .filter(Boolean);
    if (restBedingungen.length)
      inner += `<div class="fix">Format (DE2379): <span class="expr">${restBedingungen.join(" · ")}</span></div>`;
    // Statusfarbe wie im UTILMD-Generator: Muss (rot) / bedingt+Soll (orange) / Kann (grün)
    const expr = (inst.expr || "").trim();
    const status = expr === "Muss" ? " status-Muss"
      : (/^(Muss|Soll)/.test(expr) ? " status-Bedingt" : (/^Kann/.test(expr) ? " status-Kann" : ""));
    // Bedingte Segmentgruppen tragen ihre Schaltregel am Block; die Anzeige wird
    // von aktualisiereAbhaengigkeiten() gesteuert.
    const schalterAttr = (inst.schalter && inst.schalter.length)
      ? ` data-instanz="${pfad}" data-schalter='${JSON.stringify(inst.schalter).replace(/'/g, "&#39;")}'` : "";
    const schalterHinweis = (inst.schalter && inst.schalter.length)
      ? `<div class="hint">Gilt, ${inst.schalter.map(s => `wenn ${s.sg ? s.sg + " " : ""}${s.seg}+${s.qualifier} den Code <code>${s.code}</code> ${s.art === "code_fehlt" ? "nicht enthält" : "enthält"} [${s.nr}]`).join(" und ")}.</div>`
      : "";
    return `<div class="segblock${status}"${schalterAttr}><h3>${kopfzeile}</h3>${schalterHinweis}${inner || '<div class="fix">keine variablen Angaben</div>'}</div>`;
  }

  // ---- Verwendungszeitraum der Daten (SG6, wiederholbar) ------------------
  // Der AHB führt SG6 RFF+Z49/Z53 („Gültige Daten" / „Keine Daten") als Paket
  // [1P0..n]: je Zeitraum eine Wiederholung mit fortlaufender Zeitraum-ID im DE1156
  // (Bedingung [126]: erstes SG6 = „1", zweites = „2" …), dazu DTM+Z25 (Verwendung
  // der Daten ab) und DTM+Z26 (bis). Bedingung [471] verlangt das „bis" für jeden
  // Zeitraum, zu dem ein späterer existiert — der letzte bleibt offen.
  // Die Meta bildet jede Instanz genau einmal ab; weitere Zeiträume entstehen als
  // Duplikat des Blocks mit dem Pfad-Suffix „w<Nr>".
  // Qualitätsangaben des Verwendungszeitraums (DE1153): Übermittlung von Daten
  // führt Z49 „Gültige Daten" / Z53 „Keine Daten"; die Rückmeldungen des
  // Datenclearings führen Z47 „Im System vorhandene Daten", Z54 „Im System keine
  // Daten vorhanden", Z48 „Erwartete Daten" und Z55 „Keine Daten erwartet".
  const ZEITRAUM_CODES = ["Z47", "Z48", "Z49", "Z53", "Z54", "Z55"];

  function zeitraumGruppe(pos) {
    const start = pos.findIndex(i => i.seg === "RFF" &&
      ((i.des.find(d => d.de === "1153") || {}).codes || []).some(c => ZEITRAUM_CODES.indexOf(c[0]) >= 0));
    if (start < 0) return null;
    let ende = start;
    for (let j = start + 1; j < pos.length; j++) {
      const codes = pos[j].seg === "DTM"
        ? ((pos[j].des.find(d => d.de === "2005") || {}).codes || []).map(c => c[0]) : [];
      if (!codes.some(c => c === "Z25" || c === "Z26")) break;
      ende = j;
    }
    return { von: start, bis: ende };
  }

  // Feld-Index eines Datenelements innerhalb einer Instanz
  function deIndex(inst, de) { return inst.des.findIndex(d => d.de === de); }

  // Zeitraum-ID (DE1156) laut [126] fortlaufend setzen
  function setzeZeitraumId(pfad, inst, nr) {
    const k = deIndex(inst, "1156");
    const el = k >= 0 ? $(`f_${pfad}_${k}`) : null;
    if (el && !el.value) el.value = String(nr);
  }

  function zeitraumBloecke(i) {
    const wrap = $(`zrWdh${i}`);
    return wrap ? Array.from(wrap.children).map(el => el.dataset.wdh).filter(Boolean) : [];
  }

  function addZeitraum(i) {
    const meta = aktuelleMeta;
    if (!meta) return null;
    const { pos } = teile(meta);
    const zg = zeitraumGruppe(pos);
    const wrap = $(`zrWdh${i}`);
    if (!zg || !wrap) return null;
    const nr = zeitraumBloecke(i).reduce((m, w) => Math.max(m, Number(w)), 1) + 1;
    const div = document.createElement('div');
    div.className = 'zrblock'; div.id = `zr${i}_${nr}`; div.dataset.wdh = String(nr);
    let h = `<h3>Verwendungszeitraum ${nr}</h3>`;
    for (let j = zg.von; j <= zg.bis; j++) h += instanzHtml(`p${i}w${nr}_${j}`, pos[j]);
    h += `<button class="addrow" onclick="AhbFormEngine.removeZeitraum(${i},${nr})">– Zeitraum entfernen</button>`;
    div.innerHTML = h;
    wrap.appendChild(div);
    setzeZeitraumId(`p${i}w${nr}_${zg.von}`, pos[zg.von], nr);
    return nr;
  }
  function removeZeitraum(i, nr) { const el = $(`zr${i}_${nr}`); if (el) el.remove(); }

  function addPos() {
    const meta = aktuelleMeta;
    if (!meta) return;
    const { pos } = teile(meta);
    if (!pos.length) return;
    posCount++;
    const i = posCount;
    const zg = zeitraumGruppe(pos);
    const div = document.createElement('div');
    div.className = 'posblock'; div.id = `pos${i}`;
    let inner = `<h3>Position ${i}</h3>`;
    pos.forEach((inst, j) => {
      inner += instanzHtml(`p${i}_${j}`, inst);
      if (zg && j === zg.bis)
        inner += `<div id="zrWdh${i}"></div>`
          + `<button class="addrow" onclick="AhbFormEngine.addZeitraum(${i})">+ weiterer Verwendungszeitraum</button>`;
    });
    inner += `<button class="addrow" onclick="AhbFormEngine.removePos(${i})">– Position entfernen</button>`;
    div.innerHTML = inner;
    $('posListe').appendChild(div);
    // Vorgangsnummer (IDE DE7402) je Position vorbelegen (wie UTILMD)
    pos.forEach((inst, j) => {
      if (inst.seg !== "IDE") return;
      const k = inst.des.findIndex(d => d.de === "7402");
      const el = k >= 0 ? $(`f_p${i}_${j}_${k}`) : null;
      if (el && !el.value) el.value = vorgangsNummer(aktuelleRef || nachrichtRef(), i);
    });
    if (zg) setzeZeitraumId(`p${i}_${zg.von}`, pos[zg.von], 1);
  }
  function removePos(i) { const el = $(`pos${i}`); if (el) el.remove(); }

  // Standard-Vorbelegung wie im UTILMD-Generator: Nachrichtenreferenz für
  // BGM-Dokumentennummer (UNH/UNT/UNB/UNZ nutzen dieselbe Referenz bei der
  // Erzeugung), DTM+137 mit dem Tagesdatum im deutschen Format.
  function vorbelegeStandards(meta) {
    aktuelleRef = nachrichtRef();
    const { kopf } = teile(meta);
    kopf.forEach((inst, j) => {
      if (inst.seg === "BGM") {
        const k = inst.des.findIndex(d => d.de === "1004");
        const el = k >= 0 ? $(`f_k_${j}_${k}`) : null;
        if (el && !el.value) el.value = aktuelleRef;
      }
      if (inst.seg === "DTM") {
        const q = ((inst.des.find(d => d.de === "2005") || {}).codes || []);
        if (q.length === 1 && q[0][0] === "137") {
          const k = inst.des.findIndex(d => d.de === "2380");
          const el = k >= 0 ? $(`f_k_${j}_${k}`) : null;
          if (el && !el.value) el.value = heuteDeutsch(el.placeholder);
        }
      }
    });
  }

  // ---- Vorbelegung über URL-Fragment (#antwort=<JSON>) --------------------
  // Der Nachrichten-Validator öffnet Generatorseiten mit vorbefüllten Feldern
  // (Antwort auf eine importierte Nachricht). Format siehe antwort-mappings.js.
  let VORB;           // undefined = noch nicht gelesen, false = keine, sonst Objekt
  let vorbAngewendet = false;
  function leseVorbelegung() {
    try {
      const h = (global.location && global.location.hash) || "";
      const m = /[#&]antwort=([^&]+)/.exec(h);
      return m ? JSON.parse(decodeURIComponent(m[1])) : false;
    } catch (e) { return false; }
  }
  // Wird dieselbe Generatorseite mit neuem #antwort=-Fragment geöffnet (kein
  // Reload bei reiner Hash-Navigation), Vorbelegung zurücksetzen und neu anwenden.
  if (typeof global.addEventListener === "function")
    global.addEventListener("hashchange", function () {
      VORB = undefined; vorbAngewendet = false;
      const sel = $('pruefi');
      if (sel && typeof sel.onchange === "function") sel.onchange();
    });
  function instPasst(inst, f) {
    if (inst.seg !== f.seg) return false;
    if (f.qual && f.qualDe) {
      const deE = inst.des.find(d => d.de === f.qualDe);
      const codes = deE ? (deE.codes || []).map(c => c[0]) : [];
      if (!codes.includes(f.qual)) return false;
    }
    return inst.des.some(d => d.de === f.de);
  }
  function setzeFeld(pfad, inst, f) {
    // Dieselbe Datenelementnummer kann mehrfach vorkommen (STS: DE 9013 je
    // Wiederholung der Gruppe C556). Vorrang hat der Eintrag, dessen Codeliste den
    // zu setzenden Wert führt — sonst landete die Ergänzung ZW4 im Transaktionsgrund.
    const treffer = [];
    inst.des.forEach((d, i) => { if (d.de === f.de) treffer.push(i); });
    if (!treffer.length) return false;
    const k = treffer.find(i => (inst.des[i].codes || []).some(c => c[0] === f.wert));
    return setzeFeldAn(pfad, inst, f, typeof k === "number" ? k : treffer[0]);
  }
  function setzeFeldAn(pfad, inst, f, k) {
    const el = $(feldId(pfad, k));
    if (!el) return false;
    if (el.multiple) {
      let ok = false;
      Array.from(el.options).forEach(o => { if (o.value === f.wert) { o.selected = true; ok = true; } });
      return ok;
    }
    if (el.tagName === "SELECT" && !Array.from(el.options).some(o => o.value === f.wert)) return false;
    el.value = f.wert;
    return true;
  }
  function wendeVorbelegungAn(meta) {
    const v = VORB;
    if (!v || vorbAngewendet) return;
    vorbAngewendet = true;
    if (v.absender && $('absender')) $('absender').value = v.absender;
    if (v.empfaenger && $('empfaenger')) $('empfaenger').value = v.empfaenger;
    // Marktpartner, deren Rolle die Quellnachricht nicht führt (etwa der alte
    // Lieferant bei einer Anmeldung des neuen), bleiben leer und werden als
    // Ergänzungsbedarf gekennzeichnet — geraten wird hier nichts.
    (v.offen || []).forEach(id => {
      const el = $(id);
      if (!el) return;
      el.value = "";
      el.placeholder = "MP-ID ergänzen – aus der Quellnachricht nicht ableitbar";
      if (el.classList) el.classList.add("mp-offen");
    });
    const { kopf, pos, schluss } = teile(meta);
    // Ohne Bereichsangabe wird auch der Positionsteil durchsucht: Bei UTILMD liegen
    // die fachlichen Angaben (Vorgang, Lokation, Termine) in SG4 und höher, also im
    // Positionsteil — eine feste Zuordnung auf "kopf" ginge dort ins Leere.
    const bloecke = [["k", kopf], ["s", schluss]];
    if (pos.length) {
      if (!posCount) addPos();
      bloecke.push(["p1", pos]);
    }
    for (const f of (v.felder || [])) {
      let gesetzt = false;
      for (const [prefix, liste] of bloecke) {
        if (f.bereich === "kopf" && prefix !== "k") continue;
        if (f.bereich === "schluss" && prefix !== "s") continue;
        if (f.bereich === "pos" && prefix !== "p1") continue;
        liste.forEach((inst, j) => {
          if (gesetzt && !f.alle) return;
          if (instPasst(inst, f) && setzeFeld(`${prefix}_${j}`, inst, f)) gesetzt = true;
        });
        if (gesetzt && !f.alle) break;
      }
    }
    // Verwendungszeiträume (SG6): je Zeitscheibe eine Wiederholung mit Code
    // (Z49 gültige Daten / Z53 keine Daten), Zeitraum-ID, „ab" und optional „bis".
    const zg = pos.length ? zeitraumGruppe(pos) : null;
    if (zg && (v.zeitscheiben || []).length) {
      v.zeitscheiben.forEach((z, idx) => {
        const nr = idx === 0 ? 1 : addZeitraum(1);
        if (!nr) return;
        const pfad = idx === 0 ? `p1_${zg.von}` : `p1w${nr}_${zg.von}`;
        const rff = pos[zg.von];
        const kCode = deIndex(rff, "1153"), kId = deIndex(rff, "1156");
        const elCode = kCode >= 0 ? $(`f_${pfad}_${kCode}`) : null;
        if (elCode && z.code) {
          if (elCode.multiple) Array.from(elCode.options).forEach(o => { if (o.value === z.code) o.selected = true; });
          else if (Array.from(elCode.options || []).some(o => o.value === z.code)) elCode.value = z.code;
        }
        const elId = kId >= 0 ? $(`f_${pfad}_${kId}`) : null;
        if (elId) elId.value = String(z.id || nr);
        for (let x = zg.von + 1; x <= zg.bis; x++) {
          const q = ((pos[x].des.find(d => d.de === "2005") || {}).codes || []).map(c => c[0]);
          const wert = q.includes("Z25") ? z.ab : (q.includes("Z26") ? z.bis : null);
          const k = deIndex(pos[x], "2380");
          const el = k >= 0 ? $(`f_${idx === 0 ? `p1_${x}` : `p1w${nr}_${x}`}_${k}`) : null;
          if (el && wert) el.value = wert;
        }
      });
    }

    const positionen = v.positionen || [];
    for (let i = 0; i < positionen.length; i++) {
      while (posCount < i + 1) addPos();
      for (const f of positionen[i]) {
        let gesetzt = false;
        pos.forEach((inst, j) => {
          if (gesetzt) return;
          if (instPasst(inst, f) && setzeFeld(`p${i + 1}_${j}`, inst, f)) gesetzt = true;
        });
      }
    }
  }

  function renderFor(pruefi, meta) {
    if (VORB === undefined) VORB = leseVorbelegung();
    // Vorbelegung verlangt eine andere Prüf-ID: Auswahl umstellen und die
    // Seiten-Logik (onchange) erneut rendern lassen
    if (VORB && !vorbAngewendet && VORB.pruefi && pruefi !== VORB.pruefi) {
      const sel = $('pruefi');
      if (sel && Array.from(sel.options).some(o => o.value === VORB.pruefi)) {
        sel.value = VORB.pruefi;
        if (typeof sel.onchange === "function") { sel.onchange(); return; }
      }
    }
    aktuellePruefi = pruefi; aktuelleMeta = meta;
    const { kopf, pos, schluss } = teile(meta);
    let html = "";
    kopf.forEach((inst, j) => { html += instanzHtml(`k_${j}`, inst); });
    if (schluss.length) {
      html += `<div class="fix" style="margin-top:10px"><strong>Summenteil (nach UNS)</strong></div>`;
      schluss.forEach((inst, j) => { html += instanzHtml(`s_${j}`, inst); });
    }
    $('kopfFelder').innerHTML = html;
    $('panelPositionen').style.display = pos.length ? '' : 'none';
    $('posListe').innerHTML = ''; posCount = 0;
    vorbelegeStandards(meta);   // Referenz + DTM+137 vorbelegen (vor addPos: gleiche Referenz)
    if (pos.length) addPos();
    // Abhängige Segmentgruppen sofort auswerten und bei jeder Eingabe nachführen
    ["kopfFelder", "posListe"].forEach(id => {
      const wurzel = $(id);
      if (!wurzel || wurzel.dataset.abhaengigkeitAktiv) return;
      wurzel.dataset.abhaengigkeitAktiv = "1";
      wurzel.addEventListener("change", aktualisiereAbhaengigkeiten);
      wurzel.addEventListener("input", aktualisiereAbhaengigkeiten);
    });
    aktualisiereAbhaengigkeiten();
    ["kopfFelder", "posListe"].forEach(id => {
      const wurzel = $(id);
      if (!wurzel || wurzel.dataset.zeitanzeigeAktiv) return;
      wurzel.dataset.zeitanzeigeAktiv = "1";
      wurzel.addEventListener("input", aktualisiereZeitanzeige);
      wurzel.addEventListener("change", aktualisiereZeitanzeige);
      wurzel.addEventListener("change", synchronisiereEbd);
      wurzel.addEventListener("change", () => aktualisiereAntwortcodes());
    });
    aktualisiereZeitanzeige();
    // Die Antwortcode-Listen entstehen erst, wenn das Formular im Dokument steht:
    // Welche Codes ein Entscheidungsbaum erreichen kann, hängt an den Feldwerten
    // (etwa der Transaktionsgrundergänzung), die beim Aufbau des HTML noch fehlen.
    letzterKontext = "";
    aktualisiereAntwortcodes(true);
    synchronisiereEbd();
    if (VORB && !vorbAngewendet && (!VORB.pruefi || VORB.pruefi === pruefi))
      wendeVorbelegungAn(meta);
  }

  // Merkmale des Geschäftsvorfalls, die die Entscheidungsbäume abfragen. Bisher
  // ausgewertet: die Art der Lokation aus der Transaktionsgrundergänzung (STS+7,
  // 2. Gruppe C556) bzw. aus der betroffenen Lokation im STS+Z35.
  // ZAP = ruhende Marktlokation, ZW0–ZW2 = Geschäftsvorfall 1–3 der Zuordnung,
  // ZW6/ZW7 = pauschale bzw. gemessene Marktlokation.
  const ERGAENZUNG_MERKMAL = {
    ZW3: { lokationsart: "erzeugend" },   ZW4: { lokationsart: "verbrauchend" },
    ZW5: { lokationsart: "tranche" },     ZAP: { lokationsart: "ruhend" },
    ZW0: { geschaeftsvorfall: "1" },      ZW1: { geschaeftsvorfall: "2" },
    ZW2: { geschaeftsvorfall: "3" },
    ZW6: { messtechnik: "pauschal" },     ZW7: { messtechnik: "gemessen" },
  };
  function ebdKontext() {
    const meta = aktuelleMeta;
    const kontext = {};
    if (!meta) return kontext;
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      if (inst.seg !== "STS") return;
      inst.des.forEach((deE, k) => {
        if (deE.de !== "9013" || (deE.pos || 0) < 3) return;
        const v = deWertIdx(inst, pfad, k);
        const merkmale = ERGAENZUNG_MERKMAL[Array.isArray(v) ? v[0] : v];
        if (merkmale) Object.keys(merkmale).forEach(m => { if (!kontext[m]) kontext[m] = merkmale[m]; });
      });
    });
    return kontext;
  }

  // Antwortcode-Auswahlfelder nachführen: Welche Codes ein Entscheidungsbaum
  // überhaupt erreichen kann, hängt vom Geschäftsvorfall ab (etwa der gemeldeten
  // Lokationsart). Ändert sich dort etwas, wird die Liste neu aufgebaut.
  let letzterKontext = "";
  function aktualisiereAntwortcodes(erzwingen) {
    const meta = aktuelleMeta;
    if (!meta || SICHT) return;   // kuratierte Sicht: das Profil-Modul führt die Auswahl nach
    const kontext = ebdKontext();
    const kennung = JSON.stringify(kontext);
    if (!erzwingen && kennung === letzterKontext) return;
    letzterKontext = kennung;
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      if (inst.seg !== "STS") return;
      inst.des.forEach((deE, k) => {
        if (deE.de !== "9013" || (deE.codes || []).length) return;
        const el = $(`f_${pfad}_${k}`);
        if (!el || !el.options) return;
        const alt = el.value;
        // feldHtml bildet die Feld-Kennung als `f_<pfad>_<index>` — beim Neuaufbau
        // muss sie erhalten bleiben, sonst findet die Erzeugung das Feld nicht mehr.
        const html = antwortcodeFeld(`f_${pfad}_${k}`, inst, deE, false);
        if (!html) return;
        const behaelter = el.parentNode;                       // das umgebende .field
        if (!behaelter || !behaelter.parentNode) return;
        behaelter.outerHTML = html;
        const neu = $(`f_${pfad}_${k}`);
        if (neu && alt && Array.from(neu.options || []).some(o => o.value === alt)) neu.value = alt;
      });
    });
    synchronisiereEbd();
  }

  // Führt der AHB einer Prüf-ID mehrere EBD (DE 1131), gehört zum gewählten
  // Antwortcode genau eines davon — die EBD-Nummer wird deshalb nachgezogen.
  function synchronisiereEbd() {
    const meta = aktuelleMeta;
    if (!meta || SICHT) return;   // kuratierte Sicht: EBD-Nummer kommt aus deren Auswahlfeld
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      if (inst.seg !== "STS") return;
      const k9013 = inst.des.findIndex(d => d.de === "9013" && !(d.codes || []).length);
      const k1131 = inst.des.findIndex(d => d.de === "1131");
      if (k9013 < 0 || k1131 < 0) return;
      const quelle = $(`f_${pfad}_${k9013}`), ziel = $(`f_${pfad}_${k1131}`);
      if (!quelle || !ziel || !quelle.selectedOptions || !ziel.options) return;
      const opt = quelle.selectedOptions[0];
      const ebd = opt && opt.getAttribute ? opt.getAttribute("data-ebd") : "";
      if (ebd && Array.from(ziel.options).some(o => o.value === ebd)) ziel.value = ebd;
    });
  }

  // ---- Zeitangabe der Nachricht unter jedem Datumsfeld --------------------
  // EDIFACT führt Zeitpunkte in UTC (Format 303: CCYYMMDDHHMM+00). Ein Termin
  // „zum 01.09.2026" ist das Tagesende des 31.08.2026; in der Nachricht steht
  // 202608312200+00, weil im Sommer MESZ (UTC+2) gilt. Der Hinweis zeigt genau
  // den Wert, der erzeugt wird, samt Lesart in deutscher Zeit.
  const ZEITZONE_KURZ = { 60: "MEZ", 120: "MESZ" };
  function zeitHinweis(roh, wert303, code) {
    if (!wert303) return "";
    // Wert genau so zeigen, wie er in der Nachricht steht — einschließlich der
    // EDIFACT-Maskierung des Pluszeichens (?+00).
    const teileWert = `${edi(wert303)}:${code}`;
    const m = String(roh).match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
    if (!m || !/^\d{12}\+00$/.test(wert303)) return `EDIFACT: ${teileWert}`;
    // Reines Datum im MaKo-Modus: Der Termin meint den Tagesbeginn deutscher Zeit
    // (Strom 00:00 / Gas 06:00) — Lesart und Zone folgen der MESZ-Tabelle, nicht
    // der Zeitzone des Rechners.
    if (CFG.makoDatum && !m[4]) {
      const stunde = (String((CFG.formatConfig || {}).sparte).toUpperCase() === "GAS") ? 6 : 0;
      const zoneM = istMESZ(Number(m[3]), Number(m[2]), Number(m[1]), stunde) ? "MESZ" : "MEZ";
      const p = n => String(n).padStart(2, "0");
      let lesartM = `${m[1]}.${m[2]}.${m[3]} ${p(stunde)}:00 ${zoneM}`;
      if (stunde === 0) {
        const vortag = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]) - 1));
        lesartM += ` = Tagesende ${p(vortag.getUTCDate())}.${p(vortag.getUTCMonth() + 1)}.${vortag.getUTCFullYear()} 24:00`;
      } else {
        lesartM += " (Beginn des Gastages)";
      }
      return `EDIFACT: ${teileWert} · ${lesartM}`;
    }
    const std = Number(m[4] || 0), min = Number(m[5] || 0);
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), std, min);
    const versatz = -d.getTimezoneOffset();
    const zone = ZEITZONE_KURZ[versatz] || `UTC${versatz >= 0 ? "+" : "-"}${Math.abs(versatz) / 60}`;
    // 00:00 eines Tages ist zugleich das Ende des Vortages — so liest es der AHB
    // bei „Ende zum" / „Beginn zum".
    let lesart = `${m[1]}.${m[2]}.${m[3]} ${String(std).padStart(2, "0")}:${String(min).padStart(2, "0")} ${zone}`;
    if (std === 0 && min === 0) {
      const vortag = new Date(d.getTime() - 86400000);
      const p = n => String(n).padStart(2, "0");
      lesart += ` = Tagesende ${p(vortag.getDate())}.${p(vortag.getMonth() + 1)}.${vortag.getFullYear()} 24:00`;
    }
    return `EDIFACT: ${teileWert} · ${lesart}`;
  }
  function aktualisiereZeitanzeige() {
    const meta = aktuelleMeta;
    if (!meta) return;
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      inst.des.forEach((deE, k) => {
        if (deE.de !== "2380") return;
        const ziel = $(feldId(pfad, k) + "_utc");
        if (!ziel) return;
        const roh = wert(pfad, k);
        if (!roh || Array.isArray(roh)) { ziel.textContent = ""; return; }
        const w = datumNach(inst, pfad, k, [], "");
        ziel.textContent = w ? zeitHinweis(roh, w[0], w[1]) : "";
      });
    });
  }

  // ---- Erzeugung ---------------------------------------------------------
  function wert(pfad, k) {
    const el = $(feldId(pfad, k));
    if (!el) return "";
    if (el.multiple) return Array.from(el.selectedOptions).map(o => o.value);
    return el.value.trim();
  }
  function deWert(inst, pfad, deNr) {
    const k = inst.des.findIndex(d => d.de === deNr);
    if (k < 0) return "";
    return deWertIdx(inst, pfad, k);
  }
  // Wert eines bestimmten Eintrags der Datenelementliste. Nötig, wo dieselbe
  // Datenelementnummer mehrfach vorkommt — im STS-Segment trägt jede Wiederholung
  // der Gruppe C556 erneut das DE 9013 (Transaktionsgrund, Ergänzung, …).
  function deWertIdx(inst, pfad, k) {
    const deE = inst.des[k];
    if (!deE) return "";
    const el = $(feldId(pfad, k));
    if (el) return wert(pfad, k);
    if ((deE.codes || []).length === 1) return deE.codes[0][0];
    return "";
  }
  // ---- Abhängige Segmente (AHB-Bedingungen) ------------------------------
  // Eine Segmentgruppe kann an einen Codewert einer anderen Segmentgruppe gebunden
  // sein. Beispiel UTILMD Strom 55001:
  //     SG5 LOC+Z16 (Marktlokation)          Muss [2061] ∧ [67]
  //     SG5 LOC+Z22 (Ruhende Marktlokation)  Muss [2061] ∧ [96]
  //     [96] Wenn SG4 STS+7++xxx+ZAP (Transaktionsgrundergänzung ruhende
  //          Marktlokation) vorhanden
  // Wird im STS+7 die Ergänzung ZAP gewählt, ist folglich LOC+Z22 zu füllen und
  // LOC+Z16 entfällt — und umgekehrt. Die auswertbaren Bedingungen stehen als
  // `schalter` an der Segmentinstanz (erzeugt von scripts/ahb_form_meta.py).

  function alleInstanzPfade(meta) {
    const { kopf, pos, schluss } = teile(meta);
    const paare = [];
    kopf.forEach((inst, j) => paare.push([inst, `k_${j}`]));
    schluss.forEach((inst, j) => paare.push([inst, `s_${j}`]));
    if (pos.length) {
      if (SICHT && SICHT.posAktiv) {
        // Kuratierte Sicht: genau eine Position (ein Vorgang), ohne posListe-DOM.
        pos.forEach((inst, j) => paare.push([inst, `p1_${j}`]));
      } else {
        Array.from((EL('posListe') || { children: [] }).children).forEach(div => {
          const i = div.id.replace('pos', '');
          pos.forEach((inst, j) => paare.push([inst, `p${i}_${j}`]));
        });
      }
    }
    return paare;
  }

  function codeIstGewaehlt(regel, meta) {
    let gefunden = false;
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      if (inst.seg !== regel.seg) return;
      if (regel.sg && (inst.sg || "") !== regel.sg) return;
      (inst.des || []).forEach((deE, k) => {
        const w = wert(pfad, k);
        const werte = Array.isArray(w) ? w : (w ? [w] : []);
        // fest vorgegebene Einzelcodes zählen ebenfalls als gewählt
        if (!werte.length && (deE.codes || []).length === 1) werte.push(deE.codes[0][0]);
        if (werte.some(v => String(v).split(":")[0] === regel.code)) gefunden = true;
      });
    });
    return gefunden;
  }

  function schalterErfuellt(inst, meta) {
    const regeln = inst.schalter || [];
    if (!regeln.length) return true;
    return regeln.every(regel => {
      const da = codeIstGewaehlt(regel, meta);
      return regel.art === "code_fehlt" ? !da : da;
    });
  }

  function aktualisiereAbhaengigkeiten() {
    const meta = aktuelleMeta;
    if (!meta || SICHT) return;   // kuratierte Sicht: das Profil-Modul schaltet seine Blöcke selbst
    alleInstanzPfade(meta).forEach(([inst, pfad]) => {
      if (!inst.schalter || !inst.schalter.length) return;
      const block = document.querySelector(`[data-instanz="${pfad}"]`);
      if (!block) return;
      const aktiv = schalterErfuellt(inst, meta);
      block.style.display = aktiv ? "" : "none";
      block.dataset.aktiv = aktiv ? "1" : "0";
    });
  }

  function datumNach(inst, pfad, kIdx, errors, kontext) {
    const roh = wert(pfad, kIdx);
    if (!roh || Array.isArray(roh)) return null;
    const fmt = ((inst.des.find(x => x.de === "2379") || { codes: [] }).codes).map(c => c[0]);
    const pad = n => String(n).padStart(2, '0');
    // Z01 = ZZRB (Kündigungsfrist): 2-stellige Anzahl + Einheit (T/W/M) + Bezug (M/Q/H/J/T/R)
    if (fmt.includes("Z01")) {
      const z = roh.toUpperCase().match(/^(\d{1,2})([TWM])([MQHJTR])$/);
      if (z) return [`${z[1].padStart(2, "0")}${z[2]}${z[3]}`, "Z01"];
      if (!fmt.some(c => /^\d/.test(c))) {
        errors.push(`${kontext}: Frist im Format ZZRB angeben (z. B. 30TM = 30 Tage zum Monatsende).`);
        return null;
      }
    }
    // Zeitpunkt-mit-Zeitzone: Codes 303 und 304 sind wertgleich (CCYYMMDDHHMM+00);
    // der im AHB der Prüf-ID vorgegebene Code wird verwendet.
    const zeitCode = fmt.includes("303") || !fmt.length ? "303" : (fmt.includes("304") ? "304" : "303");
    let m = roh.match(/^(\d{2})\.(\d{4})$/);
    if (m && fmt.includes("610")) return [`${m[2]}${m[1]}`, "610"];
    m = roh.match(/^(\d{2}):?(\d{2})\s*[-–]\s*(\d{2}):?(\d{2})$/);
    if (m && fmt.includes("501")) return [`${m[1]}${m[2]}${m[3]}${m[4]}+00`, "501"];
    m = roh.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
    if (m) {
      const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]));
      const v = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
      if (fmt.includes("303") || fmt.includes("304") || !fmt.length) return [`${v}+00`, zeitCode];
      if (fmt.includes("203")) return [v, "203"];
      if (fmt.includes("501")) return [`${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}2359+00`, "501"];
      if (fmt.includes("102")) return [`${m[3]}${m[2]}${m[1]}`, "102"];
      if (fmt.includes("106")) return [`${m[2]}${m[1]}`, "106"];   // MMDD
      if (fmt.includes("802")) return [m[2], "802"];               // Monat
      if (fmt.includes("602")) return [m[3], "602"];               // CCYY
      return [`${v}+00`, zeitCode];
    }
    m = roh.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (m) {
      if (fmt.includes("102")) return [`${m[3]}${m[2]}${m[1]}`, "102"];
      // Reines Datum als prozessualer Termin (kuratierte Masken, CFG.makoDatum):
      // Tagesbeginn deutscher Zeit (Strom 00:00 / Gas 06:00) in UTC umgerechnet.
      // Ausnahme DTM+137 (Nachrichtendatum): Datum + Uhrzeit der Erstellung.
      if (CFG.makoDatum && (fmt.includes("303") || fmt.includes("304") || !fmt.length)) {
        const ist137 = ((inst.des.find(x => x.de === "2005") || { codes: [] }).codes || [])
          .some(c => c[0] === "137");
        if (ist137) {
          const jetzt = new Date(); const p = n => String(n).padStart(2, "0");
          const tag = Number(m[1]), monat = Number(m[2]), jahr = Number(m[3]);
          const versatz = istMESZ(jahr, monat, tag, jetzt.getHours()) ? 2 : 1;
          let h = jetzt.getHours() - versatz, d = tag, mo = monat, j2 = jahr;
          if (h < 0) {
            h += 24;
            const vortag = new Date(Date.UTC(jahr, monat - 1, tag - 1));
            d = vortag.getUTCDate(); mo = vortag.getUTCMonth() + 1; j2 = vortag.getUTCFullYear();
          }
          return [`${j2}${p(mo)}${p(d)}${p(h)}${p(jetzt.getMinutes())}+00`, zeitCode];
        }
        return [makoUtc(Number(m[1]), Number(m[2]), Number(m[3]), (CFG.formatConfig || {}).sparte), zeitCode];
      }
      if (fmt.includes("303") || fmt.includes("304") || !fmt.length)
        return [`${m[3]}${m[2]}${m[1]}0000+00`, zeitCode];
      if (fmt.includes("203")) return [`${m[3]}${m[2]}${m[1]}0000`, "203"];
      if (fmt.includes("106")) return [`${m[2]}${m[1]}`, "106"];   // MMDD
      if (fmt.includes("802")) return [m[2], "802"];               // Monat
      if (fmt.includes("602")) return [m[3], "602"];               // CCYY
      return [`${m[3]}${m[2]}${m[1]}0000+00`, zeitCode];
    }
    m = roh.match(/^(\d{4})$/);
    if (m && fmt.includes("602")) return [m[1], "602"];
    m = roh.match(/^(\d{1,2})$/);
    if (m && fmt.includes("802")) return [m[1].padStart(2, "0"), "802"];
    errors.push(`${kontext}: Datumsformat nicht erkannt.`);
    return null;
  }

  // Gehört der Ansprechpartner in diese Nachricht? Eingetragene Angaben zählen immer;
  // ohne Eingabe nur dort, wo der AHB die Segmentgruppe als „Muss" führt.
  function kontaktErzeugen(inst, ctx) {
    if (ctx.mail || ctx.kontaktName) return true;
    const pflicht = ctx.kontaktPflichtSg && ctx.kontaktPflichtSg.indexOf(inst.sg || "") >= 0;
    if (pflicht && !ctx.kontaktHinweis) {
      ctx.kontaktHinweis = true;
      ctx.warn.push("Ansprechpartner (CTA/COM) ist in dieser Prüf-ID laut AHB anzugeben — "
                  + "ohne Eingabe stehen Beispielangaben in der Nachricht.");
    }
    return pflicht;
  }

  function emittiere(inst, pfad, ctx) {
    const { seg } = inst;
    const g = de => deWert(inst, pfad, de);
    // Testmodus (kuratierte Masken): fehlende Eingaben verhindern die Testnachricht
    // nicht — das betroffene Segment entfällt mit Hinweis (bisheriges Maskenverhalten;
    // die Selbstvalidierung weist die fehlenden Muss-Segmente aus, offener Punkt D).
    const out = ctx.seg;
    const errors = CFG.testmodus
      ? { push: m => ctx.warn.push(m + " — Segment fehlt in der Testnachricht.") }
      : ctx.errors;
    // Eine an eine Bedingung geknüpfte Segmentgruppe wird nur erzeugt, wenn die
    // Bedingung erfüllt ist. Enthält sie trotzdem Eingaben, ist das ein Fehler:
    // die Kombination wäre nach AHB unzulässig.
    if (inst.schalter && inst.schalter.length && !schalterErfuellt(inst, ctx.meta || aktuelleMeta)) {
      const befuellt = (inst.des || []).some((_, k) => {
        const w = wert(pfad, k);
        return Array.isArray(w) ? w.length > 0 : !!w;
      });
      if (befuellt) {
        const r = inst.schalter[0];
        // Kein harter Fehler: das Feld ist ausgeblendet, der Wert stammt aus einer
        // früheren Auswahl. Er wird verworfen, damit keine nach AHB unzulässige
        // Kombination in die Nachricht gelangt — der Hinweis macht das sichtbar.
        ctx.warn.push(
          `${inst.sg ? inst.sg + " " : ""}${seg}${inst.section ? " (" + inst.section + ")" : ""} wurde nicht übernommen: ` +
          `zulässig nur, wenn ${r.sg ? r.sg + " " : ""}${r.seg}+${r.qualifier} den Code ${r.code} ` +
          `${r.art === "code_fehlt" ? "nicht enthält" : "enthält"} (Bedingung [${r.nr}]).`
        );
      }
      return;
    }
    const pflicht = istMuss(inst.expr);
    switch (seg) {
      case "UNH": return;
      case "UNB": {
        const el = $(`f_${pfad}_unb26`);
        if (el) ctx.unb0026 = el.value;
        else {
          const d26 = inst.des.find(d => d.de === "0026");
          if (d26 && (d26.codes || []).length === 1) ctx.unb0026 = d26.codes[0][0];
        }
        return;
      }
      case "UNS": return; // einmalig nach Positionsteil (UNS+S) bzw. Formatlogik der Seite
      case "BGM": {
        const c = g("1001"), doc = g("1004") || "DOC-1", f1225 = g("1225");
        if (!c) { if (pflicht) errors.push("BGM: Nachrichtenart (DE1001) wählen."); return; }
        out.push(`BGM+${c}+${edi(doc)}${f1225 ? "+" + f1225 : ""}'`); return;
      }
      case "DTM": {
        const q = g("2005");
        const kIdx = inst.des.findIndex(d => d.de === "2380");
        const w = kIdx >= 0 ? datumNach(inst, pfad, kIdx, errors, `DTM+${q}`) : null;
        if (!w) {
          if (q === "137") {
            const now = new Date(); const pad = n => String(n).padStart(2, '0');
            out.push(`DTM+137:${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}?+00:303'`);
          } else if (pflicht) errors.push(`DTM+${q} (${inst.section || ""}): Datum erforderlich.`);
          return;
        }
        out.push(`DTM+${q}:${edi(w[0])}:${w[1]}'`);
        if (q === "163") ctx.hat163 = true;
        if (q === "164") ctx.hat164 = true;
        return;
      }
      case "IMD": {
        const c72 = g("7081"), c73 = g("7009");
        if (!c72 && !c73) { if (pflicht) errors.push(`IMD (${inst.section || ""}): Code wählen.`); return; }
        out.push(`IMD++${c72 || ""}${c73 ? "+" + c73 : ""}'`); return;
      }
      case "FTX": {
        const q = g("4451"), txt = g("4440"), c1131 = g("1131");
        if (!q) { if (pflicht) errors.push("FTX: Qualifier (DE4451) wählen."); return; }
        if (!txt && !c1131 && !pflicht) return;
        out.push(`FTX+${q}++${c1131 ? edi(c1131) : ""}+${edi(txt || "Text")}'`); return;
      }
      case "RFF": {
        const q = g("1153");
        if (!q) return;
        if (q === "Z13") { out.push(`RFF+Z13:${ctx.pruefi}'`); return; }
        const hat1154 = inst.des.some(d => d.de === "1154");
        const ref = hat1154 ? g("1154") : "";
        // DE1156 (Zeitraum-ID) steht als dritte Komponente der C506: RFF+Z49::1'
        // (Verwendungszeitraum der Daten, Bedingung [126]).
        const hat1156 = inst.des.some(d => d.de === "1156");
        const zeitraum = hat1156 ? g("1156") : "";
        if (hat1156) {
          if (!zeitraum && pflicht) {
            // Testmodus: Muss-Referenz ohne Eingabe wie bisher als Platzhalter.
            if (CFG.testmodus && hat1154) { out.push(`RFF+${q}:${ref ? edi(ref) : "REF-" + q}'`); return; }
            errors.push(`RFF+${q} (${inst.section || ""}): Zeitraum-ID (DE1156) angeben.`);
            return;
          }
          if (!zeitraum && !ref) return;
          out.push(`RFF+${q}:${ref ? edi(ref) : ""}:${edi(zeitraum)}'`);
          return;
        }
        if (!ref) {
          if (!hat1154) { out.push(`RFF+${q}'`); return; }  // Qualifier-only-RFF laut AHB
          // Testmodus: Muss-Referenzen erhalten wie bisher einen Platzhalter, damit
          // die Testnachricht strukturell vollständig bleibt (REF-<Qualifier>).
          if (pflicht && CFG.testmodus) { out.push(`RFF+${q}:REF-${q}'`); return; }
          if (pflicht) errors.push(`RFF+${q}: Referenz (DE1154) angeben.`);
          return;
        }
        out.push(`RFF+${q}:${edi(ref)}'`); return;
      }
      case "NAD": {
        const q = g("3035");
        // Codevergabestelle (DE3055): Vorgabe aus MP-ID-Präfix, aber nur wenn der
        // AHB der Prüf-ID diesen Code zulässt (z.B. MSCONS Gas: nur 9/332)
        const nad3055 = vorgabe => {
          const codes = ((inst.des.find(d => d.de === "3055") || {}).codes || [])
            .map(c => c[0]).filter(c => /^[0-9]{1,3}$/.test(c));
          if (!codes.length || codes.includes(vorgabe)) return vorgabe;
          return codes[0];
        };
        if (q === "MS") { out.push(`NAD+MS+${ctx.abs}::${nad3055(ctx.absQ.nad)}'`); return; }
        if (q === "MR") { out.push(`NAD+MR+${ctx.emp}::${nad3055(ctx.empQ.nad)}'`); return; }
        const id = g("3039");
        const name = g("3036"), strasse = g("3042"), ort = g("3164"), plz = g("3251"), land = g("3207"), zusatz = g("3124");
        if (!q) { if (pflicht) errors.push(`NAD (${inst.section || ""}): Qualifier wählen.`); return; }
        if (!id && !name && !pflicht) return;
        if (!id && !name && CFG.testmodus) {
          // Kuratierte Masken: Ohne MP-ID/Namen entstünde ein leeres Adresssegment
          // (DE3039 bzw. C080 sind dort Muss) - Hinweis statt Skelett.
          errors.push(`NAD+${q} (${inst.section || ""}): MP-ID bzw. Name angeben.`);
          return;
        }
        let s = `NAD+${q}`;
        if (id) s += `+${edi(id)}::${nad3055(codevergabe(id).nad)}`;
        else if (zusatz || name || strasse || ort || plz || land) s += "+";
        if (zusatz || name || strasse || ort || plz || land) {
          s += `+${edi(zusatz || "")}+${edi(name || "")}+${edi(strasse || "")}+${edi(ort || "")}++${edi(plz || "")}+${edi(land || "")}`;
        }
        out.push(s + "'"); return;
      }
      case "LOC": {
        const q = g("3227"), id = g("3225");
        if (!q) return;
        if (!id) { if (pflicht) errors.push(`LOC+${q}: Objekt-ID (DE3225) angeben.`); return; }
        out.push(`LOC+${q}+${edi(id)}'`); return;
      }
      // Ansprechpartner (CTA/COM): In Testnachrichten ist er meist überflüssig, und der
      // AHB führt die Gruppe überwiegend als „Kann". Ohne Eingabe bleibt sie deshalb
      // weg. Nur wo der AHB sie als „Muss" führt (etwa SG7 der UTILMD-Vorgänge oder
      // SG5/SG14 im Bestellvorgang), entstehen Beispielangaben — sonst wäre die
      // Nachricht unvollständig; ein Hinweis weist darauf hin.
      case "CTA": {
        if (!kontaktErzeugen(inst, ctx)) return;
        out.push(`CTA+IC+:${edi(ctx.kontaktName || "Ansprechpartner")}'`); return;
      }
      case "COM": {
        if (!kontaktErzeugen(inst, ctx)) return;
        out.push(`COM+${edi(ctx.mail || "mako@beispiel.de")}:EM'`); return;
      }
      case "LIN": {
        ctx.lin++;
        const aktion = g("1229");
        out.push(`LIN+${ctx.lin}${aktion ? "+" + aktion : ""}'`); return;
      }
      case "PIA": {
        const obis = g("7140"), liste = g("7143") || "SRW";
        const q4347 = g("4347") || "5";
        if (!obis) { if (pflicht) errors.push("PIA: OBIS/Produkt (DE7140) angeben."); return; }
        out.push(`PIA+${q4347}+${edi(obis)}:${liste}'`); return;
      }
      case "QTY": {
        const q = g("6063"), w = g("6060"), e = g("6411");
        if (!w) { if (pflicht) errors.push("QTY: Menge (DE6060) angeben."); return; }
        const zahl = String(w).replace(",", ".");
        if (isNaN(Number(zahl))) { errors.push("QTY: Menge (DE6060) muss eine Zahl sein."); return; }
        out.push(`QTY+${q || "220"}:${zahl}${e ? ":" + e : ""}'`); return;
      }
      // STS: Aufbau laut MIG   STS + C601 + C555 + C556 [+ C556 [+ C556]]
      //                              9015    4405    9013:1131:3055:9012
      // Die Gruppe C556 wiederholt sich. UTILMD Strom führt sie im Segment
      // „Transaktionsgrund / Ergänzung / Transaktionsgrund befristete Anmeldung"
      // dreimal — alle drei mit DE 9013 (MIG-Beispiel: STS+7++E01+ZW4+E03').
      // Die Formular-Meta trägt deshalb je Datenelement seine Stelle im Segment
      // (`pos` = Datenelement, `sub` = Stelle innerhalb der Gruppe), gesetzt von
      // werkzeuge/teile_sts_positionen.py aus dem MIG. Fehlt die Angabe (ältere
      // Meta), gilt die Standardbelegung eines einfachen STS.
      case "STS": {
        const STELLE = { "9015": [0, 0], "4405": [1, 0], "9013": [2, 0], "1131": [2, 1], "3055": [2, 2], "9012": [2, 3] };
        const elemente = [];
        const setze = (p, s, v) => {
          while (elemente.length <= p) elemente.push([]);
          const gruppe = elemente[p];
          while (gruppe.length <= s) gruppe.push("");
          gruppe[s] = v;
        };
        let hat9013 = false, hat4405 = false;
        inst.des.forEach((deE, k) => {
          const stelle = (typeof deE.pos === "number") ? [deE.pos, deE.sub || 0] : STELLE[deE.de];
          if (!stelle) return;
          let v = deWertIdx(inst, pfad, k);
          if (Array.isArray(v)) v = v.filter(Boolean)[0] || "";     // Altbestand: Mehrfachauswahl
          if (!v) return;
          setze(stelle[0], stelle[1], edi(String(v)));
          if (deE.de === "9013") hat9013 = true;
          if (deE.de === "4405") hat4405 = true;
        });
        if (!elemente.length || !elemente[0] || !elemente[0][0]) return;   // ohne Statuskategorie kein Segment
        if (!hat9013 && !hat4405) {
          if (pflicht && inst.des.some(d => d.de === "9013")) errors.push(`STS+${elemente[0][0]} (${inst.section || ""}): Grund (DE9013) wählen.`);
          else if (pflicht) errors.push(`STS+${elemente[0][0]} (${inst.section || ""}): Status (DE4405) wählen.`);
          return;
        }
        const teileEl = elemente.map(gruppe => (gruppe || []).map(x => x || "").join(":").replace(/:+$/, ""));
        while (teileEl.length && teileEl[teileEl.length - 1] === "") teileEl.pop();
        out.push(`STS+${teileEl.join("+")}'`); return;
      }
      case "IDE": {
        const q = g("7495") || "24";
        let nr = g("7402");
        // Ohne Eingabe wird die Nummer nach demselben Namensaufbau gebildet wie die
        // Vorbelegung des Formulars (siehe vorgangsNummer) — sonst trüge eine Nachricht,
        // deren IDE nicht im Positionsteil vorbelegt wurde, einen abweichenden Aufbau.
        if (!nr) { ctx.vorgang = (ctx.vorgang || 0) + 1; nr = vorgangsNummer(ctx.dar || nachrichtRef(), ctx.vorgang); }
        out.push(`IDE+${q}+${edi(nr)}'`); return;
      }
      case "SEQ": {
        const c = g("1229"), nr = g("1050");
        if (!c && !pflicht) return;
        out.push(`SEQ+${c || ""}${nr ? "+" + edi(nr) : ""}'`); return;
      }
      case "CCI": {
        const q = g("7059"), c = g("7037"), frei = g("7036");
        if (!q && !c) return;
        const auspraegung = c ? c : (frei ? edi(frei) : "");
        out.push(auspraegung ? `CCI+${q || ""}++${auspraegung}'` : `CCI+${q}'`); return;
      }
      case "CAV": {
        // C889: DE7111 (Code) : DE1131 : DE3055 : DE7110. Regelfall ist der Wert im
        // DE7110 (CAV+ZH9:::<Wert>); die Zugeordnete-Marktpartner-CAV führen die
        // MP-ID frei im DE1131 und die Art im DE7110 (CAV+Z91:<MP-ID>::Z39 —
        // quellengeprüft am AHB S2.1, Entscheidungsliste Phase 2, Muster E4).
        const c = g("7111"), id1131 = g("1131"), z = g("7110");
        if (!c) return;
        const komp = [c, id1131 || "", "", z || ""].map(x => edi(String(x)));
        while (komp.length && !komp[komp.length - 1]) komp.pop();
        out.push(`CAV+${komp.join(":")}'`); return;
      }
      case "MOA": {
        const q = g("5025"), betrag = g("5004");
        if (!betrag) { if (pflicht) errors.push("MOA: Betrag (DE5004) angeben."); return; }
        out.push(`MOA+${q || "9"}:${String(betrag).replace(",", ".")}'`); return;
      }
      case "AGR": {
        const c = g("7431") || g("7433");
        if (!c) { if (pflicht) errors.push("AGR: Code wählen."); return; }
        out.push(`AGR+${c}'`); return;
      }
      case "MEA": {
        const q = g("6311"), attr = g("6313"), einheit = g("6411"), w = g("6314");
        if (!w && !pflicht) return;
        out.push(`MEA+${q || "AAE"}+${attr || ""}+${einheit || ""}:${w || ""}'`); return;
      }
      case "AJT": {
        // Ablehnungsgrund (ORDRSP): DE4465 Grund-Code, DE1082 Positionsbezug/EBD-Code
        const grund = g("4465"), pos1082 = g("1082");
        if (!grund && !pos1082) { if (pflicht) errors.push("AJT: Ablehnungsgrund wählen."); return; }
        out.push(`AJT+${grund || pos1082}${grund && pos1082 ? "+" + edi(pos1082) : ""}'`); return;
      }
      case "CUX": {
        // Währungsangabe: C504 = 6347:6345:6343
        const q = g("6347") || "2", waehrung = g("6345") || "EUR", art = g("6343");
        out.push(`CUX+${q}:${waehrung}${art ? ":" + art : ""}'`); return;
      }
      case "GIN": {
        const q = g("7405"), nr = g("7402");
        if (!nr) { if (pflicht) errors.push("GIN: Identifikationsnummer (DE7402) angeben."); return; }
        out.push(`GIN+${q || "BN"}+${edi(nr)}'`); return;
      }
      case "PRI": {
        // Preisangabe: C509 = 5125:5118:5375?:5387 + 5284(Basis) + 6411
        const q = g("5125") || "CAL", betrag = g("5118"), art = g("5387"), basis = g("5284"), einheit = g("6411");
        if (!betrag) { if (pflicht) errors.push("PRI: Preis (DE5118) angeben."); return; }
        const zahl = String(betrag).replace(",", ".");
        if (isNaN(Number(zahl))) { errors.push("PRI: Preis (DE5118) muss eine Zahl sein."); return; }
        out.push(`PRI+${q}:${zahl}${art ? "::" + art : ""}${basis || einheit ? "+" + (basis || "") : ""}${einheit ? "+" + einheit : ""}'`); return;
      }
      case "RNG": {
        // Bereichsangabe: 6167 + C280 = 6411:6162:6152
        const q = g("6167"), einheit = g("6411"), von = g("6162"), bis = g("6152");
        if (!q) return;
        if (!von && !bis) { if (pflicht) errors.push(`RNG+${q}: Bereichswerte angeben.`); return; }
        out.push(`RNG+${q}+${einheit || ""}:${von || ""}${bis ? ":" + bis : ""}'`); return;
      }
      case "ALC": {
        // Zu-/Abschlag (INVOIC SG39): 5463 + C552 (1230 unbenutzt, 5189) -> "ALC+A+:Z01"
        const q = g("5463"), art = g("5189");
        if (!q) { if (pflicht) errors.push("ALC: Zu-/Abschlag (DE5463) wählen."); return; }
        out.push(`ALC+${q}${art ? "+:" + art : ""}'`); return;
      }
      case "CNI": {
        // Sendungsinformation (IFTSTA): 1490 = Vorgangsnummer -> "CNI+1"
        let nr = g("1490");
        if (!nr) { ctx.cni = (ctx.cni || 0) + 1; nr = String(ctx.cni); }
        out.push(`CNI+${edi(nr)}'`); return;
      }
      case "DLI": {
        // Dokumentenzeile (REMADV): 1073 + 1082 -> "DLI+1+13"
        const c = g("1073") || "1";
        let nr = g("1082");
        if (!nr) { ctx.dli = (ctx.dli || 0) + 1; nr = String(ctx.dli); }
        out.push(`DLI+${c}+${edi(nr)}'`); return;
      }
      case "DOC": {
        // Dokumentangaben (INSRPT/REMADV): C002=1001 + C503=1004 -> "DOC+21+Nr"
        const c = g("1001"), nr = g("1004");
        if (!c) { if (pflicht) errors.push("DOC: Dokumentenname (DE1001) wählen."); return; }
        if (!nr) { if (pflicht) errors.push(`DOC+${c}: Dokumentennummer (DE1004) angeben.`); return; }
        out.push(`DOC+${c}+${edi(nr)}'`); return;
      }
      case "EFI": {
        // Datei-Identifikation (IFTSTA): C077 (1508 unbenutzt, 7008) -> "EFI+:Z01"
        const c = g("7008");
        if (!c) { if (pflicht) errors.push("EFI: Kennzeichnung (DE7008) wählen."); return; }
        out.push(`EFI+:${c}'`); return;
      }
      case "EQD": {
        // Equipment (IFTSTA): 8053 + C237=8260 (Vorgangsnummer) -> "EQD+Z01+1"
        const q = g("8053") || "Z01";
        let nr = g("8260");
        if (!nr) nr = String(ctx.cni || 1);
        out.push(`EQD+${q}+${edi(nr)}'`); return;
      }
      case "FII": {
        // Bankverbindung (PARTIN): 3035 + C078(3194:3192[:3192]) + C088(3433::::::3432)
        // Beispiel MIG: FII+BK+DE..0:Kontoinhaber+BIC::::::Bankname
        const q = g("3035") || "BK", iban = g("3194"), bic = g("3433"), bank = g("3432");
        const i92 = inst.des.map((d, i) => d.de === "3192" ? i : -1).filter(i => i >= 0);
        const inhaber = i92.length ? wert(pfad, i92[0]) : "";
        const inhaber2 = i92.length > 1 ? wert(pfad, i92[1]) : "";
        if (!iban) { if (pflicht) errors.push("FII: IBAN (DE3194) angeben."); return; }
        let s = `FII+${q}+${edi(iban)}${inhaber ? ":" + edi(inhaber) : ""}${inhaber2 ? ":" + edi(inhaber2) : ""}`;
        if (bic || bank) s += `+${edi(bic || "")}${bank ? "::::::" + edi(bank) : ""}`;
        out.push(s + "'"); return;
      }
      case "GEI": {
        // Verarbeitungsinformation (INVOIC): 9649 + C012=7365 -> "GEI+Z01+Z01"
        const q = g("9649") || "Z01", c = g("7365");
        if (!c && pflicht && inst.des.some(d => d.de === "7365")) {
          errors.push(`GEI+${q}: Verarbeitungsindikator (DE7365) wählen.`); return;
        }
        out.push(`GEI+${q}${c ? "+" + c : ""}'`); return;
      }
      case "GID": {
        // Sendungsposition (IFTSTA): 1496 -> "GID+1"
        let nr = g("1496");
        if (!nr) { ctx.gid = (ctx.gid || 0) + 1; nr = String(ctx.gid); }
        out.push(`GID+${edi(nr)}'`); return;
      }
      case "PCD": {
        // Prozentangabe (INVOIC SG41): C501 = 5245:5482 -> "PCD+3:10"
        const q = g("5245") || "3", w = g("5482");
        if (!w) { if (pflicht) errors.push("PCD: Prozentsatz (DE5482) angeben."); return; }
        const zahl = String(w).replace(",", ".");
        if (isNaN(Number(zahl))) { errors.push("PCD: Prozentsatz (DE5482) muss eine Zahl sein."); return; }
        out.push(`PCD+${q}:${zahl}'`); return;
      }
      case "PGI": {
        // Produktgruppe (PRICAT): 5379 -> "PGI+9"
        const c = g("5379");
        if (!c) { if (pflicht) errors.push("PGI: Produktgruppen-Art (DE5379) wählen."); return; }
        out.push(`PGI+${c}'`); return;
      }
      case "PYT": {
        // Zahlungsbedingungen (INVOIC): 4279 -> "PYT+3"
        out.push(`PYT+${g("4279") || "3"}'`); return;
      }
      case "TAX": {
        // Steuerangaben (INVOIC): 5283 + C241=5153 + C533/5286 unbenutzt +
        // C243 (5278 als 4. Komponente) + 5305 -> "TAX+7+VAT+++:::19+S"
        const f = g("5283") || "7", art = g("5153") || "VAT", satz = g("5278"), kat = g("5305");
        if (!kat && pflicht && inst.des.some(d => d.de === "5305")) {
          errors.push("TAX: Steuerkategorie (DE5305) wählen."); return;
        }
        let satzTeil = "";
        if (satz) {
          const zahl = String(satz).replace(",", ".");
          if (isNaN(Number(zahl))) { errors.push("TAX: Steuersatz (DE5278) muss eine Zahl sein."); return; }
          satzTeil = `:::${zahl}`;
        }
        let s = `TAX+${f}+${art}+++${satzTeil}${kat ? "+" + kat : ""}`;
        s = s.replace(/\++$/, "");  // leere Endelemente kürzen
        out.push(s + "'"); return;
      }
      default:
        ctx.warn.push(`${seg} (${inst.section || ""}) wird von der Engine noch nicht emittiert.`);
    }
  }

  function generate(pruefi, meta) {
    const errors = [], warn = [];
    const abs = (EL('absender') || { value: "" }).value.trim(), emp = (EL('empfaenger') || { value: "" }).value.trim();
    const mailEl = EL('kontaktMail'), nameEl = EL('kontaktName');
    const mail = mailEl ? mailEl.value.trim() : "";
    const kontaktName = nameEl ? nameEl.value.trim() : "";
    // Kuratierte Masken (Testmodus): Die Vorschau entsteht auch ohne MP-IDs —
    // die Speicherfreigabe der Maske sperrt, solange Pflichtangaben fehlen.
    if (!abs || !emp) (CFG.testmodus ? warn : errors).push("MP-ID Absender und Empfänger sind Pflicht.");
    // Der Ansprechpartner ist in den meisten Prüf-IDs eine Kann-Angabe (SG3 „Kann").
    // Pflicht ist er nur in den Gruppen, die der AHB als „Muss" führt — welche das
    // sind, steht am CTA-Segment der jeweiligen Segmentgruppe.
    const kontaktPflichtSg = (meta.instanzen || [])
      .filter(i => i.seg === "CTA" && /^Muss/.test(i.sgExpr || ""))
      .map(i => i.sg || "");
    if (kontaktName && !mail && (meta.instanzen || []).some(i => i.seg === "COM"))
      errors.push("Zum Ansprechpartner gehört laut AHB eine Kommunikationsverbindung (COM) — E-Mail angeben.");

    const now = new Date(); const pad = n => String(n).padStart(2, '0');
    const unbDate = `${String(now.getUTCFullYear()).slice(2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}`;
    const unbTime = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;
    // Referenzvergabe wie UTILMD: eine 12-stellige Nachrichtenreferenz für
    // UNB-DAR, UNH, UNT und UNZ (DE0020/DE0062 an..14); vorbelegt auch in BGM/IDE.
    const dar = aktuelleRef || nachrichtRef();

    const ctx = { seg: [], errors, warn, pruefi, abs, emp, mail, meta, kontaktName, kontaktPflichtSg, dar,
                  absQ: codevergabe(abs), empQ: codevergabe(emp), lin: 0, unb0026: "" };
    const { kopf, pos, schluss, hatUNS } = teile(meta);
    // UNB-Instanz zuerst auswerten (Anwendungsreferenz), dann Rahmen aufbauen
    kopf.filter(i => i.seg === "UNB").forEach((inst) => emittiere(inst, `k_${kopf.indexOf(inst)}`, ctx));
    ctx.seg.push("UNA:+.? '");
    // UNB-Aufbau: S001+S002+S003+S004+0020+S005+0026+0029+0031+S008+0035 — die
    // Anwendungsreferenz (DE0026, „VL"/„TL") steht als SIEBTES Datenelement, unmittelbar
    // hinter Referenz/Passwort. Sie stand hier an zehnter Stelle; solange kein AHB das
    // Element führt, blieb der Fehler unsichtbar (die Ausgabe ist bei leerem Wert
    // zeichengleich), er hätte aber mit der ersten Fassung durchgeschlagen, die es füllt.
    // Die Anwendungsreferenz geht zudem in den Dateinamen der Übertragungsdatei ein
    // (Allgemeine Festlegungen 2.12, siehe _engine/nachricht-speichern.js).
    ctx.seg.push(`UNB+UNOC:3+${abs}:${ctx.absQ.unb}+${emp}:${ctx.empQ.unb}+${unbDate}:${unbTime}+${dar}++${ctx.unb0026 || ""}++++1'`);
    ctx.seg.push(`UNH+${dar}+${CFG.formatConfig.unhKennung}'`);

    // MSCONS-artige Nachrichten: UNS+D trennt Kopf- und Positionsteil VOR den Positionen,
    // ORDERS-artige: UNS+S nach dem Positionsteil. Entscheidung über die UNS-Position im AHB:
    const unsIdx = (meta.instanzen || []).findIndex(i => i.seg === "UNS");
    const posIdx = (meta.instanzen || []).findIndex(i => CFG.posSgRegex.test(i.sg || ""));
    const unsVorPositionen = unsIdx >= 0 && posIdx >= 0 && unsIdx < posIdx;

    const nachInstanz = (SICHT && typeof SICHT.zusatzSegmente === "function") ? SICHT.zusatzSegmente : null;
    // Instanzen, die die Sicht selbst bedient oder bewusst nicht erzeugt
    // (Objektgruppen ohne Datengrundlage), werden übersprungen.
    const uebersprungen = pfad => SICHT && SICHT.unterdrueckt && SICHT.unterdrueckt.has(pfad);
    kopf.forEach((inst, j) => {
      if (inst.seg === "UNB") return;
      if (!uebersprungen(`k_${j}`)) emittiere(inst, `k_${j}`, ctx);
      if (nachInstanz) nachInstanz(inst, `k_${j}`, ctx);
    });
    if (hatUNS && unsVorPositionen) ctx.seg.push("UNS+D'");
    if (pos.length) {
      // Kuratierte Sicht: genau eine Position (ein Vorgang), ohne posListe-DOM.
      const bloecke = (SICHT && SICHT.posAktiv)
        ? ["1"]
        : Array.from((EL('posListe') || { children: [] }).children).map(div => div.id.replace('pos', ''));
      if (!bloecke.length) errors.push("Mindestens eine Position angeben.");
      const zg = zeitraumGruppe(pos);
      const wdhListe = i => (SICHT && SICHT.posAktiv)
        ? ((typeof SICHT.zeitraumWdh === "function" ? SICHT.zeitraumWdh() : []) || [])
        : zeitraumBloecke(i);
      bloecke.forEach(i => {
        ctx.hat163 = ctx.hat164 = false;
        pos.forEach((inst, j) => {
          if (!uebersprungen(`p${i}_${j}`)) emittiere(inst, `p${i}_${j}`, ctx);
          // Weitere Verwendungszeiträume unmittelbar nach dem ersten ausgeben —
          // die Zeiträume stehen im AHB als aufeinanderfolgende SG6-Wiederholungen.
          if (zg && j === zg.bis)
            wdhListe(i).forEach(nr => {
              for (let x = zg.von; x <= zg.bis; x++) emittiere(pos[x], `p${i}w${nr}_${x}`, ctx);
            });
          if (nachInstanz) nachInstanz(inst, `p${i}_${j}`, ctx);
        });
        // Regel [11]: Messperiode nur mit Beginn UND Ende
        // nur wenn 163/164 als getrennte Fest-Code-Segmente vorliegen (MSCONS),
        // nicht bei Auswahl 163 ODER 164 in einem DTM (z.B. PRICAT Preisstaffel)
        // Segmente, die durch eine AHB-Bedingung derzeit ausgeschlossen sind, zählen
        // nicht als "angeboten" — sonst verlangte die Paarregel ein Ende, das die
        // Bedingungslage gerade verbietet.
        const aktivesDtm = code => pos.some(x =>
          x.seg === "DTM" &&
          x.des.some(d => (d.codes || []).length === 1 && d.codes[0][0] === code) &&
          schalterErfuellt(x, meta));
        const bietet163 = aktivesDtm("163");
        const bietet164 = aktivesDtm("164");
        if (bietet163 && bietet164 && (ctx.hat163 !== ctx.hat164))
          errors.push(`Position ${i}: Messperiode erfordert Beginn (DTM+163) UND Ende (DTM+164).`);
      });
    }
    if (hatUNS && !unsVorPositionen) ctx.seg.push("UNS+S'");
    schluss.forEach((inst, j) => emittiere(inst, `s_${j}`, ctx));

    const errBox = EL('errorBox');
    const meldungen = errors.concat(warn.map(w => "Hinweis: " + w));
    if (errBox) {
      errBox.style.display = meldungen.length ? 'block' : 'none';
      errBox.innerHTML = meldungen.join('<br>');
    }
    const okBox = EL('okBox'), ediOut = EL('ediOut');
    if (errors.length) {
      if (okBox) okBox.style.display = 'none';
      if (ediOut) ediOut.value = '';
      const fn = document.getElementById('folgeNachrichten'); if (fn) fn.style.display = 'none';
      return false;
    }

    const unhIndex = ctx.seg.findIndex(s => s.startsWith('UNH'));
    ctx.seg.push(`UNT+${ctx.seg.length - unhIndex + 1}+${dar}'`);
    ctx.seg.push(`UNZ+1+${dar}'`);
    if (ediOut) ediOut.value = ctx.seg.join("\n");
    // Folgenachrichten des Geschäftsprozesses anbieten (vorbefüllt aus dieser Nachricht)
    if (global.EdiFolgenachrichten && ediOut)
      global.EdiFolgenachrichten.zeigeAutomatisch(pruefi, ediOut.value, ((CFG.ids || {}).ediOut) || 'ediOut');
    if (okBox) okBox.style.display = 'inline-block';
    return true;
  }

  ENGINE_EXPORT: {
    global.AhbFormEngine = {
      konfiguriere: c => { CFG = Object.assign(CFG, c); },
      renderFor, generate, addPos, removePos,
      addZeitraum, removeZeitraum,
      edi, codevergabe,
      // Schnittstelle der kuratierten Sicht (Feldauswahl-Umbau, Phase 2):
      setzeSicht, teile, ebdKontext, bevorzugteErgaenzung,
      aktualisiereZeitanzeige, zeitraumGruppe,
      neueReferenz: () => { aktuelleRef = nachrichtRef(); return aktuelleRef; },
      setzeKontext: (pruefi, meta) => { aktuellePruefi = pruefi; aktuelleMeta = meta; },
    };
  }
})(typeof window !== "undefined" ? window : this);
