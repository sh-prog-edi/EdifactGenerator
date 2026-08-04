// _engine/folgenachrichten.js
// -------------------------------------------------------------------------
// Aus einer vorliegenden Nachricht die Folgenachrichten ihres Geschäftsprozesses
// als vorbefüllte Testnachrichten anbieten.
//
// Beispiel Lieferbeginn (GPKE Teil 2): Zu einer Anmeldung 55001 gehören die
// Bestätigung 55002, die Ablehnung 55003, die Information über eine existierende
// Zuordnung 55036, die Nachrichten an den alten Lieferanten (55010/55037/55038)
// und die nachgelagerten Abrechnungsdaten (55218/55126).
//
// Übernommen wird, was die Quellnachricht hergibt:
//   - Absender und Empfänger werden getauscht (MS wird MR und umgekehrt),
//   - gleiche Segmente mit gleichem Qualifier werden wertgleich übernommen
//     (Marktlokation, Termine, Transaktionsgrund …),
//   - die Vorgangsnummer der Quelle (SG4 IDE) wird zur Referenz RFF+TN der Antwort,
//     während die Antwort ihre eigene neue Vorgangsnummer erhält.
// Nachrichten- und Dokumentennummer sowie das Erstellungsdatum werden bewusst NICHT
// übernommen — sie gehören zur neuen Nachricht.
//
// Felder, die sich aus der Quellnachricht nicht ableiten lassen, bleiben leer.
//
// Datengrundlage: _engine/daten/prozessketten.js (Anwendungsübersicht der
// Prüfidentifikatoren + GPKE-Auslöser + AHB-Datenbasis) und
// _engine/daten/validator-registry.js (Zielseite je Formatstand und Prüf-ID).
// -------------------------------------------------------------------------
(function (global) {
  "use strict";

  function ketten() { return global.prozessketten || null; }
  function registry() { return global.validatorRegistry || []; }

  // ---- Nachricht zerlegen (unabhängig vom Validator nutzbar) -------------
  // Segmentstruktur wie im zentralen Validator: `elemente` enthält die Datenelemente
  // OHNE den Segment-Tag (der steht in `tag`). Der eigene Weg unten liefert dieselbe
  // Form — sonst verschöben sich alle Positionsangaben um eins, je nachdem, ob der
  // Validator auf der Seite geladen ist.
  function zerlege(text) {
    if (!text) return null;
    if (global.AhbValidator && typeof global.AhbValidator.parse === "function") {
      try { return global.AhbValidator.parse(text); } catch (e) { /* eigener Weg unten */ }
    }
    const roh = String(text).replace(/\r?\n/g, "");
    const segmente = [];
    roh.split(/(?<!\?)'/).forEach(s => {
      s = s.trim();
      if (!s || s.startsWith("UNA")) return;
      const elemente = s.split(/(?<!\?)\+/).map(e => e.split(/(?<!\?):/));
      const tag = (elemente.shift() || [""])[0];
      segmente.push({ tag: tag, elemente: elemente });
    });
    return { segmente };
  }

  // Wert eines Datenelements: Segmente tragen ihre Elemente als Liste von
  // Komponenten; die Position des gesuchten DE wird über den Qualifier bestimmt.
  function segmentPasst(seg, adresse) {
    if (seg.tag !== adresse.seg) return false;
    if (!adresse.qual) return true;
    return seg.elemente.some(el => el.some(k => k === adresse.qual));
  }

  //: Position des Wert-Datenelements innerhalb des Segments, je Segmenttyp.
  const WERTPOSITION = {
    LOC: [1, 0], DTM: [0, 1], RFF: [0, 1], NAD: [1, 0], IDE: [1, 0],
    QTY: [0, 1], MOA: [0, 1], FTX: [3, 0], LIN: [0, 0], PIA: [1, 0],
  };

  // EDIFACT führt Zeitpunkte als CCYYMMDDHHMM+ZZ (Code 303) bzw. CCYYMMDD (102).
  // Die Formulare erwarten das deutsche Format; ohne Umwandlung bliebe der Wert
  // unbrauchbar und die erzeugte Nachricht ohne Datum.
  //
  // Zeitpunkte mit Uhrzeit stehen in UTC, die Formularfelder in gesetzlicher
  // deutscher Zeit: Die Engine liest die Eingabe als Ortszeit und rechnet beim
  // Erzeugen nach UTC (`new Date(J,M,T,h,m)` -> getUTC…). Hier ist die Umkehrung
  // nötig — ohne sie käme die übernommene Angabe um den Zonenversatz verschoben
  // zurück in die Nachricht (im Sommer zwei Stunden).
  function pad2(n) { return String(n).padStart(2, "0"); }

  function alsFormularDatum(roh) {
    let m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(roh);
    if (m) {
      const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
      return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} `
           + `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }
    m = /^(\d{4})(\d{2})(\d{2})$/.exec(roh);
    if (m) return `${m[3]}.${m[2]}.${m[1]}`;
    return roh;
  }

  function wertAus(seg, adresse) {
    const pos = WERTPOSITION[adresse.seg];
    if (!pos) return "";
    const el = seg.elemente[pos[0]];
    if (!el) return "";
    const roh = ((el[pos[1]] !== undefined ? el[pos[1]] : el[0]) || "").replace(/\?(.)/g, "$1").trim();
    if (adresse.seg === "DTM") return alsFormularDatum(roh);
    return roh;
  }

  function feldwerte(parsed, felder) {
    const ergebnis = [];
    (felder || []).forEach(f => {
      const quelle = f.quelle || {};
      const seg = (parsed.segmente || []).find(s => segmentPasst(s, quelle));
      if (!seg) return;
      const wert = wertAus(seg, quelle);
      if (!wert) return;
      const eintrag = { seg: f.seg, qualDe: f.qualDe, qual: f.qual, de: f.de, wert: String(wert) };
      // Ohne Bereichsangabe sucht die Engine in Kopf-, Positions- und Summenteil.
      if (f.bereich) eintrag.bereich = f.bereich;
      ergebnis.push(eintrag);
    });
    return ergebnis;
  }

  // ---- Marktpartnerrollen -------------------------------------------------
  // Die Quellnachricht kennt genau zwei Marktpartner: NAD+MS und NAD+MR. Welche
  // Rolle dahintersteht, sagt die Anwendungsübersicht über den Prozessschritt der
  // Quelle (kette.quelleVon / kette.quelleAn). Für jede Folgenachricht sind die
  // Rollen ihres eigenen Schritts hinterlegt; nur wenn eine Rolle in der Quelle
  // vorkommt, lässt sich die MP-ID übernehmen. Der alte Lieferant (LFA) etwa steht
  // in einer Anmeldung des neuen Lieferanten nirgends — sein Feld bleibt leer.
  const ROLLENNAME = {
    LF: "Lieferant", LFN: "neuer Lieferant", LFA: "alter Lieferant",
    LFZ: "zukünftiger Lieferant", NB: "Netzbetreiber", VNB: "Verteilnetzbetreiber",
    "ÜNB": "Übertragungsnetzbetreiber", MSB: "Messstellenbetreiber",
    BIKO: "Bilanzkoordinator", BKV: "Bilanzkreisverantwortlicher",
    NBA: "abgebender Netzbetreiber", NBN: "neuer Netzbetreiber",
    MSBA: "abgebender Messstellenbetreiber", MSBN: "neuer Messstellenbetreiber",
    ESA: "abgebender Energieserviceanbieter", ESN: "neuer Energieserviceanbieter",
    LFAA: "alter Lieferant", KUNDE: "Kunde",
  };

  // Basiskürzel einer Rollenbezeichnung: „NB (entspricht NBA)“ -> „NB“.
  function basis(rolle) {
    return String(rolle || "").replace(/\s*\(.*$/, "").trim();
  }

  function synonyme(rolle) {
    const b = basis(rolle);
    const tab = global.prozessRollen || {};
    return tab[b] || [b];
  }

  function rollenKarte(kette, mp) {
    const karte = {};
    // Sender und Empfänger der Quellnachricht: einige Sequenzdiagramme benennen die
    // Beteiligten nicht mit ihrer Marktrolle, sondern über den Bezug zur
    // Ursprungsnachricht („Sender einer Stornierungsanfrage“).
    karte.__ms = mp.absender;
    karte.__mr = mp.empfaenger;
    if (!kette) return karte;
    // Führt der Prozessschritt der Quelle beidseits dieselbe Bezeichnung, ist keine
    // eindeutige Zuordnung über die Rolle möglich — dann wird nichts hinterlegt.
    if (kette.quelleVon && kette.quelleVon === kette.quelleAn) return karte;
    if (kette.quelleVon) karte[kette.quelleVon] = mp.absender;
    if (kette.quelleAn) karte[kette.quelleAn] = mp.empfaenger;
    return karte;
  }

  // Auflösung in drei Stufen; jede greift nur bei Eindeutigkeit:
  //   1. gleiche Bezeichnung, 2. gleiches Basiskürzel, 3. verwandte Rolle (LF/LFN …).
  // Liefert { id, rolle, art } — id ist null, wenn die Rolle unbekannt oder
  // mehrdeutig ist; das Feld bleibt dann im Formular leer.
  function loeseRolle(karte, rolle) {
    const leer = { id: null, rolle: rolle || "", art: "offen" };
    if (!rolle) return leer;
    if (karte[rolle]) return { id: karte[rolle], rolle: rolle, art: "exakt" };

    // Bezug auf die Ursprungsnachricht statt auf eine Marktrolle
    if (/^Sender\b/i.test(rolle) && karte.__ms) return { id: karte.__ms, rolle: rolle, art: "bezug" };
    if (/^Empfänger\b/i.test(rolle) && karte.__mr) return { id: karte.__mr, rolle: rolle, art: "bezug" };

    const schluessel = Object.keys(karte).filter(k => k.slice(0, 2) !== "__" && karte[k]);
    const b = basis(rolle);
    let treffer = schluessel.filter(k => basis(k) === b);
    if (treffer.length === 1) return { id: karte[treffer[0]], rolle: rolle, art: "basis" };
    if (treffer.length > 1) return leer;    // mehrdeutig, etwa NBA und NBN

    const gruppe = synonyme(rolle);
    treffer = schluessel.filter(k => gruppe.indexOf(basis(k)) >= 0);
    if (treffer.length === 1) return { id: karte[treffer[0]], rolle: rolle, art: "verwandt" };
    return leer;
  }

  function rollenText(rolle) {
    const name = ROLLENNAME[basis(rolle)];
    return name && basis(rolle) === rolle ? `${rolle} (${name})` : (rolle || "unbekannt");
  }

  // ---- Verwendungszeitraum der Daten (SG6 RFF+Z49/Z53) --------------------
  // Praxis der Stammdatenübermittlung nach einem Lieferbeginn: Der Netzbetreiber
  // meldet zwei Zeitscheiben. Für die Zeit bis zum Lieferbeginn liegen dem neuen
  // Lieferanten keine Daten zu (RFF+Z53 „Keine Daten"), ab dem Lieferbeginn gelten
  // die übermittelten Daten (RFF+Z49 „Gültige Daten").
  //
  // Bedingung [131] begrenzt den Beginn der ersten Zeitscheibe auf den auf das
  // Nachrichtendatum folgenden Tag, 00:00 deutscher Zeit (oder früher); [471]
  // verlangt ein „bis" für jede Zeitscheibe, zu der eine spätere existiert — die
  // letzte bleibt offen. Beide Regeln werden hier eingehalten.
  function tagesbeginn(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function alsFeldwert(d) {
    return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} `
         + `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  // Lieferbeginn der Quellnachricht: DTM+92 (Beginn), ersatzweise DTM+93 (Ende).
  function lieferbeginn(parsed) {
    const seg = (parsed.segmente || []).find(s => segmentPasst(s, { seg: "DTM", qual: "92" }));
    if (!seg) return null;
    const roh = wertAus(seg, { seg: "DTM", qual: "92" });   // bereits Ortszeit-Format
    const m = /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/.exec(roh || "");
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
  }

  function zeitscheiben(parsed, jetzt) {
    const beginn = lieferbeginn(parsed);
    if (!beginn) return null;
    // Erste Zeitscheibe frühestens ab dem auf das Nachrichtendatum folgenden Tag
    const heute = tagesbeginn(jetzt || new Date());
    const abLuecke = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + 1);
    const scheiben = [];
    if (abLuecke < beginn)
      scheiben.push({ code: "Z53", id: 1, ab: alsFeldwert(abLuecke), bis: alsFeldwert(beginn),
                      bedeutung: "keine Daten bis zum Lieferbeginn" });
    scheiben.push({ code: "Z49", id: scheiben.length + 1, ab: alsFeldwert(beginn),
                    bedeutung: "gültige Daten ab Lieferbeginn" });
    return scheiben;
  }

  // Die Zwei-Scheiben-Belegung gilt für die Übermittlung von Daten (Z49/Z53). Die
  // Rückmeldungen des Datenclearings führen andere Qualitäten (Z47/Z48/Z54/Z55) —
  // welche davon zutrifft, weiß nur der Absender. Dort wird lediglich der Zeitraum
  // ab Lieferbeginn vorgeschlagen, ohne eine Qualität zu setzen.
  function scheibenFuer(codes, scheiben) {
    if (!scheiben) return null;
    const hat = c => (codes || []).indexOf(c) >= 0;
    if (hat("Z49") && hat("Z53")) return scheiben;
    if (hat("Z49")) return scheiben.filter(z => z.code === "Z49");
    return scheiben.filter(z => z.code === "Z49").map(z => Object.assign({}, z, { code: null,
      bedeutung: "Zeitraum ab Lieferbeginn – Qualität der Daten wählen" }));
  }

  function marktpartner(parsed) {
    const nad = (q) => {
      const s = (parsed.segmente || []).find(x => x.tag === "NAD" && x.elemente[0] && x.elemente[0][0] === q);
      return s ? (s.elemente[1] || [])[0] || "" : "";
    };
    return { absender: nad("MS"), empfaenger: nad("MR") };
  }

  // ---- Zielseite je Prüf-ID ----------------------------------------------
  function zielseite(stand, pruefi) {
    const treffer = registry().filter(e => e.stand === stand && (e.pruefis || []).indexOf(pruefi) >= 0);
    if (!treffer.length) return null;
    // Für UTILMD zeigt die Registry auf das Vollformular — dort stehen alle
    // Datenelemente zur Verfügung und die Vorbelegung wird ausgewertet.
    return treffer[0];
  }

  function basisPfad() {
    // Seitenangaben der Registry sind relativ zur Projektwurzel.
    const teile = (global.location ? global.location.pathname : "").split("/");
    const idx = teile.lastIndexOf("EdifactGenerator");
    if (idx < 0) return "";
    return new Array(teile.length - idx - 2).fill("..").join("/") || ".";
  }

  // ---- Aufbau -------------------------------------------------------------
  function schritteFuer(stand, pruefi) {
    const k = ketten();
    if (!k || !k[stand] || !k[stand][pruefi]) return null;
    return k[stand][pruefi];
  }

  function baueEintraege(stand, pruefi, nachricht) {
    const kette = schritteFuer(stand, pruefi);
    if (!kette) return null;
    const parsed = zerlege(nachricht);
    if (!parsed) return null;
    const mp = marktpartner(parsed);
    const basis = basisPfad();

    const karte = rollenKarte(kette, mp);
    const scheiben = zeitscheiben(parsed);

    const eintraege = [];
    kette.schritte.forEach(s => {
      const ziel = zielseite(stand, s.pid);
      if (!ziel) return;
      const felder = feldwerte(parsed, s.felder);

      // Rollenzuordnung; ohne hinterlegte Rollen greift die frühere Regel
      // (Antwort läuft in Gegenrichtung).
      let abs, emp;
      if (s.vonRolle || s.anRolle) {
        abs = loeseRolle(karte, s.vonRolle);
        emp = loeseRolle(karte, s.anRolle);
      } else {
        abs = { id: s.tauscheRichtung ? mp.empfaenger : mp.absender, rolle: s.von, exakt: true };
        emp = { id: s.tauscheRichtung ? mp.absender : mp.empfaenger, rolle: s.an, exakt: true };
      }

      const offen = [];
      if (!abs.id) offen.push("absender");
      if (!emp.id) offen.push("empfaenger");

      const payload = {
        pruefi: s.pid,
        absender: abs.id || "",
        empfaenger: emp.id || "",
        felder: felder,
        positionen: [],
      };
      if (offen.length) payload.offen = offen;
      // Verwendungszeitraum der Daten: nur für Zielnachrichten, die SG6 RFF+Z49/Z53
      // führen. Ohne DTM+Z26 ist nur ein (offener) Zeitraum darstellbar — dann wird
      // allein die gültige Zeitscheibe ab Lieferbeginn vorbelegt.
      let zeiten = null;
      if (s.zeitraum && scheiben) {
        zeiten = scheibenFuer(s.zeitraumCodes, scheiben) || [];
        // Ohne DTM+Z26 lässt sich nur ein offener Zeitraum abbilden
        if (s.zeitraumBis === false) zeiten = zeiten.slice(-1).map(z => { const k = Object.assign({}, z); delete k.bis; return k; });
        zeiten = zeiten.map((z, i) => Object.assign({}, z, { id: i + 1 }));
        if (zeiten.length) payload.zeitscheiben = zeiten;
        else zeiten = null;
      }

      eintraege.push({
        pid: s.pid, label: s.label, von: s.von, an: s.an, herkunft: s.herkunft,
        zeitscheiben: zeiten,
        vonRolle: abs.rolle || s.von, anRolle: emp.rolle || s.an,
        absender: abs.id || "", empfaenger: emp.id || "", offen: offen,
        uebernommen: felder.length, moeglich: (s.felder || []).length,
        href: `${basis}/${ziel.seite}#antwort=` + encodeURIComponent(JSON.stringify(payload)),
      });
    });
    return { kette: kette, eintraege: eintraege, rollen: karte };
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Folgenachrichten nach Empfänger bündeln — in der Reihenfolge ihres ersten
  // Auftretens im Sequenzdiagramm. Gebündelt wird nach der Marktpartner-ID, denn
  // dieselbe ID kann im Diagramm unter mehreren Rollenbezeichnungen auftreten
  // (die Stammdatenänderungen adressieren den „LF“, der hier der „LFN“ ist).
  // Ist keine ID bekannt, bündelt die Rollenbezeichnung.
  function nachRolle(eintraege) {
    const gruppen = [];
    const index = {};
    eintraege.forEach(e => {
      const schluessel = e.empfaenger ? `id:${e.empfaenger}` : `rolle:${e.anRolle || "?"}`;
      if (index[schluessel] === undefined) {
        index[schluessel] = gruppen.length;
        gruppen.push({ rolle: e.anRolle || "?", rollen: [], id: e.empfaenger, zeilen: [] });
      }
      const g = gruppen[index[schluessel]];
      if (e.anRolle && g.rollen.indexOf(e.anRolle) < 0) g.rollen.push(e.anRolle);
      g.zeilen.push(e);
    });
    return gruppen;
  }

  function html(stand, pruefi, nachricht) {
    const ergebnis = baueEintraege(stand, pruefi, nachricht);
    if (!ergebnis || !ergebnis.eintraege.length) {
      return `<div class="fix">Für Prüf-ID ${pruefi} ist kein Folgeprozess hinterlegt.</div>`;
    }
    const k = ergebnis.kette;
    let h = `<div class="edi-fn-kopf">Folgenachrichten zum Prozess „${esc(k.seq)}“ `
          + `<span class="edi-fn-quelle">(aus ${esc(pruefi)}`
          + (k.quelleVon ? `, ${esc(k.quelleVon)} → ${esc(k.quelleAn)}` : "")
          + `)</span></div>`;

    // Rollenspiegel: welche Marktpartner-ID die Quellnachricht welcher Rolle zuweist
    const bekannt = Object.keys(ergebnis.rollen || {})
      .filter(r => r.slice(0, 2) !== "__" && ergebnis.rollen[r]);
    if (bekannt.length) {
      h += `<div class="edi-fn-rollen">Aus der Quellnachricht bekannt: `
        + bekannt.map(r => `<span class="edi-fn-mp">${esc(rollenText(r))} = ${esc(ergebnis.rollen[r])}</span>`).join(" · ")
        + `</div>`;
    }

    nachRolle(ergebnis.eintraege).forEach(g => {
      const weitere = g.rollen.filter(r => r !== g.rolle);
      h += `<div class="edi-fn-gruppe">An ${esc(rollenText(g.rolle))}`
        + (weitere.length ? ` <span class="edi-fn-mp">im Diagramm auch als ${esc(weitere.join(", "))} geführt</span>` : "")
        + (g.id ? ` <span class="edi-fn-mp">MP-ID ${esc(g.id)}</span>`
                : ` <span class="edi-fn-offen">MP-ID im Formular zu ergänzen</span>`)
        + `</div>`;
      g.zeilen.forEach(e => {
        h += `<div class="edi-fn-zeile">`
          + `<a class="edi-fn-link" href="${esc(e.href)}" target="_blank" rel="noopener">${esc(e.pid)} – ${esc(e.label)}</a>`
          + `<span class="edi-fn-richtung">${esc(e.vonRolle)} → ${esc(e.anRolle)}`
          + (e.offen.length ? ` <span class="edi-fn-offen">(${e.offen.length === 2 ? "beide Marktpartner" : e.offen[0] === "absender" ? "Absender" : "Empfänger"} offen)</span>` : "")
          + `</span>`
          + `<span class="edi-fn-felder" title="${esc(e.herkunft)}">`
          + `${e.uebernommen} von ${e.moeglich} Feldern übernommen</span>`
          + (e.zeitscheiben && e.zeitscheiben.length
              ? `<span class="edi-fn-zeit">Verwendungszeitraum: `
                + e.zeitscheiben.map(z => `${z.code} ${esc(z.ab)}${z.bis ? " – " + esc(z.bis) : " (offen)"}`).join(" · ")
                + `</span>` : "")
          + `</div>`;
      });
    });

    h += `<div class="edi-fn-fuss">Übernommen werden die Marktpartner gemäß ihrer Rolle im `
      + `Prozessschritt, dazu Marktlokation, Termine und Transaktionsgrund sowie die `
      + `Vorgangsnummer als Referenz RFF+TN. Rollen, die die Quellnachricht nicht führt `
      + `(etwa der alte Lieferant), sowie sonstige nicht ableitbare Angaben bleiben leer.</div>`;
    return h;
  }

  function css() {
    if (document.getElementById("edi-fn-css")) return;
    const s = document.createElement("style");
    s.id = "edi-fn-css";
    s.textContent = [
      ".edi-fn-kopf{font-weight:700;color:var(--heading,#004b6c);margin:4px 0 8px;}",
      ".edi-fn-quelle{font-weight:400;color:var(--muted,#5f6b78);}",
      ".edi-fn-zeile{display:flex;flex-wrap:wrap;gap:2px 10px;align-items:baseline;padding:5px 0;",
      "border-bottom:1px solid var(--border,#e3e8ee);}",
      ".edi-fn-link{flex:1 1 100%;}",
      ".edi-fn-richtung,.edi-fn-felder{flex:0 1 auto;}",
      ".edi-fn-link{font-weight:600;text-decoration:none;color:var(--heading,#004b6c);}",
      ".edi-fn-link:hover{text-decoration:underline;}",
      ".edi-fn-richtung{font-size:12px;color:var(--muted,#5f6b78);}",
      ".edi-fn-felder{font-size:11.5px;color:var(--muted,#5f6b78);margin-left:auto;cursor:help;}",
      ".edi-fn-fuss{font-size:12px;color:var(--muted,#5f6b78);margin-top:8px;}",
      ".edi-fn-rollen{font-size:12px;color:var(--muted,#5f6b78);margin:0 0 8px;}",
      ".edi-fn-gruppe{font-weight:600;font-size:13px;color:var(--heading,#004b6c);",
      "margin:10px 0 2px;padding-top:6px;border-top:1px solid var(--border,#e3e8ee);}",
      ".edi-fn-mp{font-weight:400;font-size:12px;color:var(--muted,#5f6b78);}",
      ".edi-fn-offen{font-weight:400;font-size:12px;color:#b25c00;}",
      ".edi-fn-zeit{flex:1 1 100%;font-size:11.5px;color:var(--muted,#5f6b78);}",
    ].join("");
    document.head.appendChild(s);
  }

  function zeige(container, opts) {
    css();
    const el = typeof container === "string" ? document.getElementById(container) : container;
    if (!el) return;
    el.innerHTML = html(opts.stand, opts.pruefi, opts.nachricht);
    el.style.display = "";
  }

  // Formatstand der Seite: Stand-Modul (Phase 3, ?stand=…), sonst Seitenpfad.
  function standAusPfad() {
    if (global.EdiStand) return global.EdiStand.aktiv();
    const m = /\b(20\d{4})\b/.exec((global.location || {}).pathname || "");
    return m ? m[1] : null;
  }

  // Bequemer Aufruf aus den Generatorseiten: legt den Anzeigebereich unterhalb der
  // erzeugten Nachricht selbst an, sodass die Seiten nur das Skript einbinden müssen.
  function zeigeAutomatisch(pruefi, nachricht, nachElementId) {
    if (!pruefi || !nachricht) return;
    const stand = standAusPfad();
    if (!stand || !schritteFuer(stand, String(pruefi))) {
      const alt = document.getElementById("folgeNachrichten");
      if (alt) alt.style.display = "none";
      return;
    }
    let bereich = document.getElementById("folgeNachrichten");
    if (!bereich) {
      const anker = document.getElementById(nachElementId || "ediOut") || document.getElementById("edifactOutput");
      if (!anker || !anker.parentNode) return;
      bereich = document.createElement("div");
      bereich.id = "folgeNachrichten";
      bereich.className = "panel edi-fn-panel";
      // Als eigene, schmale Spalte neben Formular und Ausgabe einhängen, sofern die
      // Seite ein Spaltenraster führt; sonst direkt unter die erzeugte Nachricht.
      const spalten = anker.closest ? anker.closest(".container") : null;
      if (spalten) {
        spalten.appendChild(bereich);
      } else {
        const bezug = anker.closest ? (anker.closest(".panel") || anker) : anker;
        bezug.parentNode.insertBefore(bereich, bezug.nextSibling);
      }
    }
    zeige(bereich, { stand, pruefi: String(pruefi), nachricht });
  }

  global.EdiFolgenachrichten = {
    zeige, zeigeAutomatisch, html, baueEintraege, zerlege, schritteFuer, standAusPfad,
    loeseRolle, rollenKarte, rollenText,
  };
})(typeof window !== "undefined" ? window : this);
