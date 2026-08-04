// kalender.js - Kalender-Popup für alle Datumsfelder, auf allen Seiten.
//
// EdiKalender(textFeldId, typ) öffnet ein eigenes Kalenderblatt neben dem Textfeld und
// schreibt die Auswahl im deutschen Format zurück. typ: 'date' | 'datetime-local' | 'month'.
// Die direkte Texteingabe (TT.MM.JJJJ [HH:MM] bzw. MM.JJJJ) bleibt unverändert möglich.
//
// Warum ein eigenes Kalenderblatt statt des nativen `showPicker()`?
// Der native Picker hängt am unsichtbaren Datumsfeld und wird vom Browser platziert —
// steht das Feld weit unten, klappt er nach unten aus dem Fenster heraus, und die
// unteren Zeilen sind nicht erreichbar. Position und Größe lassen sich dabei nicht
// beeinflussen. Das eigene Blatt wird deshalb selbst positioniert:
//
//   * rechtsbündig zum Datums-Eingabefeld,
//   * unterhalb der Eingabezeile, solange das Feld in der oberen Bildschirmhälfte liegt,
//   * oberhalb, sobald es in der unteren Hälfte liegt,
//   * und in beiden Richtungen an den Fensterrand geklemmt, damit es immer vollständig
//     sichtbar bleibt.
//
// Das Blatt hängt an <body> und liegt `fixed` — sonst würde die scrollende Eingabemaske
// (linke Spalte, overflow: auto) es abschneiden.
(function (global) {
  "use strict";
  var doc = global.document;
  if (!doc) return;

  var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni",
                "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var MONATE_KURZ = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
                     "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  var WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  var RAND = 8;          // Mindestabstand zum Fensterrand
  var ABSTAND = 6;       // Abstand zwischen Eingabezeile und Kalenderblatt

  var blatt = null;      // das eine Kalenderblatt des Dokuments
  var zustand = null;    // { feld, typ, jahr, monat, tag, stunde, minute, anker }

  // ---- Stilblatt einmalig einhängen ---------------------------------------
  // Die kuratierten UTILMD-Masken führen ihre Gestaltung inline und laden edigen.css
  // nicht; deshalb bringt der Kalender seine eigenen Regeln mit. Farben kommen aus den
  // CSS-Variablen der Seite, mit Rückfallwerten für Seiten ohne diese Variablen.
  function stil() {
    if (doc.getElementById("edi-kalender-stil")) return;
    var s = doc.createElement("style");
    s.id = "edi-kalender-stil";
    s.textContent = [
      ".edi-kal{position:fixed;z-index:9999;width:268px;box-sizing:border-box;padding:10px;",
      "  background:var(--panel,var(--panel-bg,#fff));color:var(--text,#1a1a1a);",
      "  border:1px solid var(--border,#c9d2dc);border-radius:8px;",
      "  box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:13px;line-height:1.4;",
      "  font-family:inherit;}",
      ".edi-kal-kopf{display:flex;align-items:center;gap:6px;margin-bottom:8px;}",
      ".edi-kal-titel{flex:1 1 auto;text-align:center;font-weight:700;font-size:13.5px;",
      "  color:var(--heading,#0b3d5c);}",
      ".edi-kal button{font-family:inherit;cursor:pointer;}",
      ".edi-kal-nav{flex:0 0 auto;width:26px;height:26px;padding:0;border-radius:5px;",
      "  border:1px solid var(--border,#c9d2dc);background:transparent;color:inherit;font-size:14px;}",
      ".edi-kal-nav:hover{background:var(--accent-bg,rgba(0,0,0,.06));}",
      ".edi-kal-raster{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}",
      ".edi-kal-raster.monate{grid-template-columns:repeat(3,1fr);gap:4px;}",
      ".edi-kal-wt{text-align:center;font-size:11px;font-weight:700;padding:3px 0;",
      "  color:var(--muted,#5b6b7c);text-transform:uppercase;}",
      ".edi-kal-tag{border:1px solid transparent;border-radius:5px;background:transparent;",
      "  color:inherit;padding:5px 0;font-size:12.5px;text-align:center;}",
      ".edi-kal-tag:hover{background:var(--accent-bg,rgba(0,0,0,.08));}",
      ".edi-kal-tag.fremd{color:var(--muted,#9aa7b4);opacity:.6;}",
      ".edi-kal-tag.heute{border-color:var(--heading,#0b3d5c);font-weight:700;}",
      ".edi-kal-tag.gewaehlt{background:var(--btn-primary-bg,#0b3d5c);",
      "  color:var(--btn-primary-text,#fff);font-weight:700;}",
      ".edi-kal-zeit{display:flex;align-items:center;gap:6px;margin-top:8px;",
      "  padding-top:8px;border-top:1px solid var(--border,#c9d2dc);}",
      ".edi-kal-zeit label{margin:0;font-size:11px;text-transform:uppercase;",
      "  letter-spacing:.03em;color:var(--muted,#5b6b7c);font-weight:700;}",
      ".edi-kal-zeit input{width:52px;padding:4px 6px;font-size:13px;text-align:center;",
      "  border:1px solid var(--border,#c9d2dc);border-radius:5px;",
      "  background:var(--panel,var(--panel-bg,#fff));color:inherit;font-family:inherit;}",
      ".edi-kal-fuss{display:flex;gap:6px;margin-top:8px;}",
      ".edi-kal-fuss button{flex:1 1 0;padding:5px 6px;font-size:12px;border-radius:5px;",
      "  border:1px solid var(--border,#c9d2dc);background:transparent;color:inherit;}",
      ".edi-kal-fuss button:hover{background:var(--accent-bg,rgba(0,0,0,.06));}"
    ].join("");
    doc.head.appendChild(s);
  }

  // ---- Hilfen --------------------------------------------------------------
  function p2(n) { return String(n).padStart(2, "0"); }
  function tageImMonat(j, m) { return new Date(j, m + 1, 0).getDate(); }
  // Wochentag des Monatsersten, Montag = 0 (deutsche Wochendarstellung).
  function ersterSpalte(j, m) { return (new Date(j, m, 1).getDay() + 6) % 7; }

  // Textwert des Feldes lesen: TT.MM.JJJJ [HH:MM] bzw. MM.JJJJ
  function ausText(wert, typ) {
    var v = (wert || "").trim(), m;
    if (typ === "month") {
      m = /^(\d{1,2})\.(\d{4})$/.exec(v);
      if (m) return { jahr: +m[2], monat: +m[1] - 1, tag: null, stunde: 0, minute: 0 };
    } else {
      m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:[\s,]+(\d{1,2}):(\d{2}))?$/.exec(v);
      if (m) return { jahr: +m[3], monat: +m[2] - 1, tag: +m[1],
                      stunde: m[4] ? +m[4] : 0, minute: m[5] ? +m[5] : 0 };
    }
    var h = new Date();
    return { jahr: h.getFullYear(), monat: h.getMonth(), tag: null, stunde: 0, minute: 0 };
  }

  // Auswahl ins Textfeld schreiben. Das `input`-Ereignis ist wichtig: Die Formulare
  // hängen ihre Neuberechnung an `oninput` des Textfeldes — ein reines Setzen von
  // `.value` löst das nicht aus, die Nachricht bliebe unverändert.
  function schreibe(feld, text) {
    feld.value = text;
    feld.dispatchEvent(new Event("input", { bubbles: true }));
    feld.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function uebernimm() {
    var z = zustand;
    if (!z || !z.feld) return;
    if (z.typ === "month") { schreibe(z.feld, p2(z.monat + 1) + "." + z.jahr); schliesse(); return; }
    if (z.tag == null) return;
    var d = p2(z.tag) + "." + p2(z.monat + 1) + "." + z.jahr;
    if (z.typ === "datetime-local") d += " " + p2(z.stunde) + ":" + p2(z.minute);
    schreibe(z.feld, d);
    schliesse();
  }

  // ---- Positionierung ------------------------------------------------------
  // Grundposition: rechter Rand des Datums-Eingabefeldes. Liegt das Feld in der oberen
  // Bildschirmhälfte, klappt das Blatt nach unten, sonst nach oben. Anschließend wird
  // in beide Richtungen an den Fensterrand geklemmt, damit nichts abgeschnitten wird.
  function positioniere() {
    if (!blatt || !zustand || !zustand.anker) return;
    var a = zustand.anker.getBoundingClientRect();
    var bh = blatt.offsetHeight, bb = blatt.offsetWidth;
    var fh = global.innerHeight || doc.documentElement.clientHeight;
    var fb = global.innerWidth || doc.documentElement.clientWidth;

    var mitteFeld = a.top + a.height / 2;
    var nachOben = mitteFeld > fh / 2;
    var oben = nachOben ? a.top - ABSTAND - bh : a.bottom + ABSTAND;

    // Reicht der Platz in der gewählten Richtung nicht, in die andere ausweichen …
    if (nachOben && oben < RAND && (a.bottom + ABSTAND + bh) <= fh - RAND) oben = a.bottom + ABSTAND;
    else if (!nachOben && oben + bh > fh - RAND && (a.top - ABSTAND - bh) >= RAND) oben = a.top - ABSTAND - bh;
    // … und in jedem Fall im Fenster halten.
    if (oben + bh > fh - RAND) oben = fh - RAND - bh;
    if (oben < RAND) oben = RAND;

    var links = a.right - bb;                       // rechtsbündig zum Eingabefeld
    if (links + bb > fb - RAND) links = fb - RAND - bb;
    if (links < RAND) links = RAND;

    blatt.style.top = Math.round(oben) + "px";
    blatt.style.left = Math.round(links) + "px";
  }

  // ---- Aufbau --------------------------------------------------------------
  function knopf(klasse, text, aktion) {
    var b = doc.createElement("button");
    b.type = "button"; b.className = klasse; b.innerHTML = text;
    b.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); aktion(); });
    return b;
  }

  function zeichne() {
    var z = zustand;
    blatt.innerHTML = "";

    var kopf = doc.createElement("div");
    kopf.className = "edi-kal-kopf";
    var monatsblatt = z.typ !== "month";
    kopf.appendChild(knopf("edi-kal-nav", "&#8249;", function () {
      if (monatsblatt) { z.monat--; if (z.monat < 0) { z.monat = 11; z.jahr--; } }
      else z.jahr--;
      zeichne();
    }));
    var titel = doc.createElement("div");
    titel.className = "edi-kal-titel";
    titel.textContent = monatsblatt ? MONATE[z.monat] + " " + z.jahr : String(z.jahr);
    kopf.appendChild(titel);
    kopf.appendChild(knopf("edi-kal-nav", "&#8250;", function () {
      if (monatsblatt) { z.monat++; if (z.monat > 11) { z.monat = 0; z.jahr++; } }
      else z.jahr++;
      zeichne();
    }));
    blatt.appendChild(kopf);

    var raster = doc.createElement("div");
    raster.className = "edi-kal-raster" + (monatsblatt ? "" : " monate");

    if (!monatsblatt) {
      MONATE_KURZ.forEach(function (name, i) {
        var b = knopf("edi-kal-tag", name, function () { z.monat = i; uebernimm(); });
        if (i === z.monat) b.classList.add("gewaehlt");
        raster.appendChild(b);
      });
    } else {
      WOCHENTAGE.forEach(function (w) {
        var d = doc.createElement("div"); d.className = "edi-kal-wt"; d.textContent = w;
        raster.appendChild(d);
      });
      var heute = new Date();
      var vorlauf = ersterSpalte(z.jahr, z.monat);
      var tageVor = tageImMonat(z.jahr, z.monat === 0 ? 11 : z.monat - 1);
      for (var v = vorlauf; v > 0; v--) {
        var bv = knopf("edi-kal-tag fremd", String(tageVor - v + 1), (function (tag) {
          return function () {
            z.monat--; if (z.monat < 0) { z.monat = 11; z.jahr--; }
            z.tag = tag; uebernimm();
          };
        })(tageVor - v + 1));
        raster.appendChild(bv);
      }
      var anzahl = tageImMonat(z.jahr, z.monat);
      for (var t = 1; t <= anzahl; t++) {
        var b = knopf("edi-kal-tag", String(t), (function (tag) {
          return function () { z.tag = tag; uebernimm(); };
        })(t));
        if (t === heute.getDate() && z.monat === heute.getMonth() && z.jahr === heute.getFullYear())
          b.classList.add("heute");
        if (t === z.tag) b.classList.add("gewaehlt");
        raster.appendChild(b);
      }
      var rest = (7 - ((vorlauf + anzahl) % 7)) % 7;
      for (var n = 1; n <= rest; n++) {
        var bn = knopf("edi-kal-tag fremd", String(n), (function (tag) {
          return function () {
            z.monat++; if (z.monat > 11) { z.monat = 0; z.jahr++; }
            z.tag = tag; uebernimm();
          };
        })(n));
        raster.appendChild(bn);
      }
    }
    blatt.appendChild(raster);

    if (z.typ === "datetime-local") {
      var zeit = doc.createElement("div");
      zeit.className = "edi-kal-zeit";
      var lab = doc.createElement("label"); lab.textContent = "Uhrzeit";
      var hh = doc.createElement("input"); hh.type = "text"; hh.inputMode = "numeric";
      hh.maxLength = 2; hh.value = p2(z.stunde);
      var trenn = doc.createElement("span"); trenn.textContent = ":";
      var mm = doc.createElement("input"); mm.type = "text"; mm.inputMode = "numeric";
      mm.maxLength = 2; mm.value = p2(z.minute);
      hh.addEventListener("input", function () {
        var w = parseInt(hh.value, 10); z.stunde = isNaN(w) ? 0 : Math.min(23, Math.max(0, w));
      });
      mm.addEventListener("input", function () {
        var w = parseInt(mm.value, 10); z.minute = isNaN(w) ? 0 : Math.min(59, Math.max(0, w));
      });
      zeit.appendChild(lab); zeit.appendChild(hh); zeit.appendChild(trenn); zeit.appendChild(mm);
      blatt.appendChild(zeit);
    }

    var fuss = doc.createElement("div");
    fuss.className = "edi-kal-fuss";
    fuss.appendChild(knopf("", "Heute", function () {
      var h = new Date();
      z.jahr = h.getFullYear(); z.monat = h.getMonth(); z.tag = h.getDate();
      uebernimm();
    }));
    fuss.appendChild(knopf("", "Leeren", function () {
      if (z.feld) schreibe(z.feld, "");
      schliesse();
    }));
    fuss.appendChild(knopf("", "Schließen", schliesse));
    blatt.appendChild(fuss);

    positioniere();
  }

  // ---- Öffnen und Schließen ------------------------------------------------
  function schliesse() {
    if (blatt) { blatt.remove(); blatt = null; }
    zustand = null;
    doc.removeEventListener("mousedown", aussenKlick, true);
    doc.removeEventListener("keydown", tastatur, true);
    global.removeEventListener("resize", positioniere);
    global.removeEventListener("scroll", positioniere, true);
  }

  function aussenKlick(e) {
    if (!blatt) return;
    if (blatt.contains(e.target)) return;
    if (zustand && zustand.anker && zustand.anker.contains(e.target)) return;
    schliesse();
  }

  function tastatur(e) { if (e.key === "Escape") schliesse(); }

  global.EdiKalender = function (id, typ) {
    var feld = doc.getElementById(id);
    if (!feld) return;
    // Zweiter Klick auf denselben Kalenderknopf schließt das Blatt wieder.
    if (blatt && zustand && zustand.feld === feld) { schliesse(); return; }
    schliesse();
    stil();

    var t = (typ === "datetime-local" || typ === "month") ? typ : "date";
    // Ohne ausdrückliche Angabe verrät der Platzhalter, was das Feld erwartet.
    if (!typ) {
      var ph = feld.getAttribute("placeholder") || "";
      if (/HH:MM/.test(ph) && /TT/.test(ph)) t = "datetime-local";
      else if (/^\s*MM\.JJJJ\s*$/.test(ph)) t = "month";
    }
    var w = ausText(feld.value, t);
    // Anker ist die ganze Eingabezeile (Textfeld + Kalenderknopf), damit sich das Blatt
    // am rechten Rand des Feldes ausrichtet und nicht am Textfeld allein.
    var anker = feld.closest(".dtm-feld") || feld.parentElement || feld;
    zustand = { feld: feld, typ: t, jahr: w.jahr, monat: w.monat, tag: w.tag,
                stunde: w.stunde, minute: w.minute, anker: anker };

    blatt = doc.createElement("div");
    blatt.className = "edi-kal";
    blatt.setAttribute("role", "dialog");
    blatt.setAttribute("aria-label", "Kalender");
    doc.body.appendChild(blatt);
    zeichne();

    doc.addEventListener("mousedown", aussenKlick, true);
    doc.addEventListener("keydown", tastatur, true);
    global.addEventListener("resize", positioniere);
    global.addEventListener("scroll", positioniere, true);
  };

  global.EdiKalender.schliesse = schliesse;
})(typeof window !== "undefined" ? window : this);
