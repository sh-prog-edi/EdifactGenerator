// _engine/import-pruefung.js
// -------------------------------------------------------------------------
// Importprüfung der Generator-Masken auf Basis des universellen Validators.
//
// Bis zur Konsolidierung hatten die UTILMD-Masken eine eigene Prüflogik
// (`_engine/validator.js`) neben `_engine/ahb-validator.js`. Dieselbe Fachregel
// musste damit zweimal gepflegt werden — mit den bekannten Folgen: die erwartete
// UNH-Kennung war hart verdrahtet, die Sparte für die Zeitzonenprüfung ebenso, und
// Änderungen am AHB-Verständnis kamen nur an einer Stelle an.
//
// Diese Datei ist der schlanke Ersatz: Sie erkennt Nachrichtentyp, Formatstand,
// Sparte und Prüf-ID über die Validator-Registry, lädt die zugehörige Formular-Meta
// nach und prüft mit `AhbValidator`. Damit prüft jede Maske jede Nachricht gegen
// deren eigenes AHB/MIG — auch wenn sie zu einem anderen Formatstand gehört; die
// Herkunft wird ausgewiesen.
//
// Erwartete Elemente auf der Seite (Konvention der Generator-Masken):
//   #importInput, #validationSummary, #coloredOutput, #validationResults
// -------------------------------------------------------------------------
(function (global) {
  "use strict";

  const $ = id => document.getElementById(id);
  const skriptCache = {};
  const metaCache = {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Pfad zur Projektwurzel aus der Seitenlage ableiten (die Masken liegen je nach
  // Nachrichtentyp unterschiedlich tief).
  function wurzel() {
    const teile = (global.location ? global.location.pathname : "").split("/");
    const idx = teile.lastIndexOf("EdifactGenerator");
    if (idx < 0) return "";
    return new Array(teile.length - idx - 2).fill("..").join("/") + "/";
  }

  function ladeSkript(pfad) {
    if (!skriptCache[pfad]) skriptCache[pfad] = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = pfad;
      s.onload = () => res();
      s.onerror = () => rej(new Error("Prüfgrundlage nicht ladbar: " + pfad));
      document.body.appendChild(s);
    });
    return skriptCache[pfad];
  }

  // Die Meta-Dateien belegen alle dieselbe globale Variable (formMeta, msconsFormMeta …).
  // Nach dem Laden wird deshalb eine Momentaufnahme gesichert.
  async function ladeMeta(eintrag) {
    const key = eintrag.metaPfad;
    if (!metaCache[key]) {
      const eigene = global[eintrag.metaVar];
      await ladeSkript(wurzel() + eintrag.metaPfad);
      metaCache[key] = global[eintrag.metaVar] || eigene || {};
    }
    return metaCache[key];
  }

  function registry() { return global.validatorRegistry || []; }

  // „zustimmung"/„ablehnung" aus _prozess-meta.js in die EBD-Schreibweise übersetzen
  function clusterVon(pruefi) {
    // `prozessMeta` ist auf den Seiten teils als const deklariert und liegt dann
    // nicht am window-Objekt — deshalb zusätzlich über den Bezeichner prüfen.
    const pm = global.prozessMeta || (typeof prozessMeta !== "undefined" ? prozessMeta : null);
    const m = pruefi && pm ? pm[pruefi] : null;
    if (!m || !m.antwortcluster) return "";
    return m.antwortcluster === "ablehnung" ? "Ablehnung"
         : (m.antwortcluster === "zustimmung" ? "Zustimmung" : "");
  }

  async function pruefe(rohtext) {
    const parsed = AhbValidator.parse(rohtext);
    const det = AhbValidator.erkenne(parsed, registry());
    if (det.fehler) return { parsed, det, fehler: det.fehler };

    const eintrag = det.eintrag;
    let meta = null, ladefehler = null;
    try {
      const alle = await ladeMeta(eintrag);
      meta = det.pruefi ? (alle[det.pruefi] || null) : null;
    } catch (e) { ladefehler = e.message; }

    const migKey = eintrag.format === "UTILMD"
      ? (eintrag.sparte === "Gas" ? "UTILMD_GAS" : "UTILMD_STROM") : eintrag.format;
    const ctx = {
      meta, pruefi: det.pruefi, stand: eintrag.stand, format: eintrag.format,
      unhSoll: eintrag.unh,
      migFormat: ((global.migFormate || {})[eintrag.stand] || {})[migKey] || { felder: {}, maxWdh: {} },
      // Aufbau des STS-Segments (Wiederholungen der Gruppe C556) laut MIG
      stsStruktur: ((global.stsStruktur || {})[eintrag.stand] || {})[migKey] || null,
      ebd: ((global.ebdAntwortcodes || {})[eintrag.stand] || {}).ebds || {},
      codelisten: global.codelisten || {},
      afRegeln: global.afRegeln || null,
      gs1Pruefziffer: global.gs1Pruefziffer,
      condTree: global.EdiCondTree || {},
      bedingungen: global.EdiBedingungen || {},
      // Cluster der Nachricht (Bestätigung/Ablehnung) für den Abgleich der
      // EBD-Antwortcodes; steht in der Prozess-Meta der Generatorseite.
      cluster: clusterVon(det.pruefi),
    };
    const res = AhbValidator.validiere(parsed, ctx);

    // Gehört die Nachricht zu dieser Seite? Die Prüfung erfolgt in jedem Fall gegen
    // das AHB der Nachricht — die Angabe dient der Einordnung.
    const eigeneKennung = (typeof formatConfig !== "undefined" && formatConfig.unhKennung) || "";
    const fremd = eigeneKennung && eintrag.unh !== eigeneKennung ? eintrag : null;

    return { parsed, det, eintrag, meta, res, fremd, ladefehler };
  }

  // ---- Darstellung --------------------------------------------------------
  function zeigeErgebnis(ergebnis) {
    const summary = $("validationSummary"), colored = $("coloredOutput"), results = $("validationResults");
    if (!summary) return;

    if (ergebnis.fehler) {
      summary.innerHTML = `<div class="v-head">${esc(ergebnis.fehler)}</div>`;
      if (colored) colored.innerHTML = "";
      if (results) results.innerHTML = "";
      return;
    }

    const { det, eintrag, res, fremd, parsed, meta, ladefehler } = ergebnis;
    const z = res.zusammenfassung;
    const bm = (res.bedingteMuss || []).length;

    let kopf = z.fehler
      ? `<div class="v-head">${z.fehler} Fehler · ${z.hinweise} Hinweise`
        + (bm ? ` · ${bm} bedingte Muss offen` : "") + `</div>`
      : `<div class="v-ok">✓ Keine Fehler gegen AHB, MIG und Allgemeine Festlegungen`
        + (bm ? ` · ${bm} bedingte Muss offen` : "") + `</div>`;

    kopf += `<div class="hint">Geprüft als <strong>${esc(eintrag.format)}`
      + `${eintrag.sparte ? " " + esc(eintrag.sparte) : ""}</strong>, Formatstand `
      + `<strong>${esc(eintrag.stand)}</strong> (${esc(det.kennung)})`
      + (det.pruefi ? ` · Prüf-ID ${esc(det.pruefi)}` : " · ohne Prüf-ID (RFF+Z13 fehlt)")
      + (meta && meta.beschreibung ? ` – ${esc(meta.beschreibung)}` : "")
      + `</div>`;

    if (fremd)
      kopf += `<div class="hint">Die Nachricht gehört nicht zu dieser Maske `
        + `(${esc((typeof formatConfig !== "undefined" && formatConfig.unhKennung) || "")}) — `
        + `geprüft wurde trotzdem gegen ihr eigenes AHB. `
        + `<a href="${esc(wurzel() + fremd.seite)}" target="_blank" rel="noopener">zuständige Maske öffnen</a></div>`;
    if (ladefehler)
      kopf += `<div class="hint">${esc(ladefehler)} — nur Rahmen- und Syntaxprüfung.</div>`;

    summary.innerHTML = kopf;

    // Farbige Nachricht: fehlerhafte Segmente rot
    if (colored) {
      let html = "";
      if (parsed.una) html += `<span class="seg-ok">${esc(parsed.una)}</span>\n`;
      (res.zeilen || []).forEach(zeile => {
        const cls = zeile.meldungen.length ? "seg-err" : "seg-ok";
        html += `<span class="${cls}">${esc(zeile.raw)}</span>\n`;
      });
      colored.innerHTML = '<div class="co-title">Nachricht (fehlerhafte Segmente rot markiert):</div>'
        + '<pre class="co-body">' + html + "</pre>";
    }

    // Befundtabelle
    if (results) {
      const zeilen = [];
      (res.global.meldungen || []).forEach(m => zeilen.push(["FEHLER", "—", m]));
      (res.fehlendeMuss || []).forEach(m => zeilen.push(["FEHLER", "AHB", "Fehlendes Muss-Segment: " + m]));
      (res.zeilen || []).forEach(zeile => {
        zeile.meldungen.forEach(m => zeilen.push(["FEHLER", zeile.tag, m]));
        zeile.hinweise.forEach(m => zeilen.push(["HINWEIS", zeile.tag, m]));
      });
      (res.bedingteMuss || []).forEach(m => zeilen.push(["HINWEIS", "AHB",
        "Bedingtes Muss (nur unter Bedingung Pflicht): " + m]));
      (res.global.hinweise || []).forEach(m => zeilen.push(["HINWEIS", "—", m]));

      if (!zeilen.length) { results.innerHTML = ""; return; }
      let html = '<table class="v-table"><thead><tr><th>Schwere</th><th>Segment</th><th>Befund</th></tr></thead><tbody>';
      zeilen.forEach(([art, tag, text]) => {
        html += `<tr class="${art === "FEHLER" ? "v-err" : "v-info"}">`
          + `<td>${art}</td><td>${esc(tag)}</td><td>${esc(text)}</td></tr>`;
      });
      results.innerHTML = html + "</tbody></table>";
    }
  }

  // Einstiegspunkt der Masken (ersetzt die frühere runValidation-Logik)
  async function pruefeUndZeige(rohtext) {
    const summary = $("validationSummary");
    if (!rohtext || !rohtext.trim()) {
      if (summary) summary.innerHTML = '<div class="hint">Bitte zuerst eine EDIFACT-Nachricht einfügen oder laden.</div>';
      if ($("coloredOutput")) $("coloredOutput").innerHTML = "";
      if ($("validationResults")) $("validationResults").innerHTML = "";
      return null;
    }
    if (summary) summary.innerHTML = '<div class="hint">Prüfgrundlage wird geladen …</div>';
    let ergebnis;
    try { ergebnis = await pruefe(rohtext); }
    catch (e) {
      if (summary) summary.innerHTML = `<div class="v-head">Prüfung nicht möglich: ${esc(e.message)}</div>`;
      return null;
    }
    zeigeErgebnis(ergebnis);
    return ergebnis;
  }

  global.EdiImportPruefung = { pruefe, zeigeErgebnis, pruefeUndZeige };
})(typeof window !== "undefined" ? window : this);
