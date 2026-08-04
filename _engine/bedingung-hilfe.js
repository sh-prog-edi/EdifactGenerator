// _engine/bedingung-hilfe.js
// -------------------------------------------------------------------------
// Gemeinsames Hilfe-Element fuer AHB-Abhaengigkeitsbedingungen (Generator + Validator).
// Reichert jeden angezeigten Bedingungsausdruck (z. B. "Muss [185] ∧ [593]") um ein
// kleines Fragezeichen-Symbol an. Ein Klick zeigt in einem Popover:
//   - die Bedeutung der verwendeten Logik-Symbole (∧, ∨, ⊻ ...), und
//   - den Klartext jeder referenzierten Bedingung [nn] aus der ausgelagerten
//     Bedingungsdatei des jeweiligen AHB (window.EdiBedingungen: { "nn": {text, art} }).
//
// Non-invasiv: laeuft als Progressive Enhancement per MutationObserver, greift also
// nach jedem Neu-Rendern des Formulars, ohne die Engine zu aendern.
(function (global) {
  "use strict";

  var SYMBOLE = {
    "∧": "logisches UND – alle verknüpften Bedingungen müssen gemeinsam zutreffen",
    "∨": "logisches ODER – mindestens eine der verknüpften Bedingungen muss zutreffen",
    "⊻": "exklusives ODER (entweder/oder) – genau eine der Bedingungen trifft zu",
    "⊕": "exklusives ODER – genau eine der Bedingungen trifft zu"
  };
  var ART = { voraussetzung: "Voraussetzung", hinweis: "Hinweis", format: "Format",
              wiederholbarkeit: "Wiederholbarkeit", zeitpunkt: "Zeitpunkt", paket: "Paket",
              sonstige: "Bedingung" };

  // Übergreifende Bedingungen für Zeitpunktangaben (Allgemeine Festlegungen, Kap. 3.8).
  // Sie stehen in keiner der AHB-Bedingungslisten, werden aber in den Ausdrücken der
  // DTM-Segmente laufend referenziert.
  var UEBERGREIFEND = {
    UB1: { art: "zeitpunkt", text: "Prozessuale Zeitpunktangabe zum Beginn- bzw. Ende-Zeitpunkt eines Tages "
         + "nach gesetzlicher deutscher Zeit (Strom, 00:00 Uhr). In UTC bedeutet das an der Stelle HHMM "
         + "2200 während der Sommerzeit (MESZ) und 2300 während der Winterzeit (MEZ), jeweils mit ZZZ = +00." },
    UB2: { art: "zeitpunkt", text: "Prozessuale Zeitpunktangabe zum Beginn- bzw. Ende-Zeitpunkt des Gas-Tages "
         + "(06:00 Uhr nach gesetzlicher deutscher Zeit). In UTC bedeutet das an der Stelle HHMM 0400 während "
         + "der Sommerzeit (MESZ) und 0500 während der Winterzeit (MEZ), jeweils mit ZZZ = +00." },
    UB3: { art: "zeitpunkt", text: "Prozessuale Zeitpunktangabe, deren Tagesgrenze sich nach der Sparte des "
         + "Empfängers richtet: für Strom gilt der Tageswechsel um 00:00 Uhr, für Gas der Gas-Tag ab 06:00 Uhr "
         + "(gesetzliche deutsche Zeit), umgerechnet in UTC." }
  };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function bedingung(nr) {
    var s = String(nr);
    var b = (global.EdiBedingungen || {})[s];
    if (b) return b;
    if (UEBERGREIFEND[s]) return UEBERGREIFEND[s];
    // Paketangabe "<Paket>P<min>..<max>": Wiederholbarkeit innerhalb eines Pakets.
    var p = /^(\d+)P(\d+)\.\.(\d+|n)$/.exec(s);
    if (p) {
      return { art: "paket", text: "Paket " + p[1] + ": Diese Angabe ist innerhalb des Pakets "
        + (p[2] === p[3] ? "genau " + p[2] + "-mal" : p[2] + "- bis " + p[3] + "-mal")
        + " anzugeben. Welche Voraussetzungen für Paket " + p[1] + " gelten, führt der AHB in der "
        + "Pakettabelle zu Beginn des Dokuments." };
    }
    return null;
  }

  function analyse(expr) {
    var codes = [], seen = {};
    (expr.match(/\[([0-9]{1,4}|UB[0-9]+|[0-9]+P[0-9.]+)\]/g) || []).forEach(function (m) {
      var nr = m.replace(/[\[\]]/g, ""); if (!seen[nr]) { seen[nr] = 1; codes.push(nr); }
    });
    var syms = Object.keys(SYMBOLE).filter(function (s) { return expr.indexOf(s) >= 0; });
    return { codes: codes, syms: syms };
  }

  function popHtml(expr) {
    var a = analyse(expr), h = "";
    h += '<div class="edi-bh-head">Bedingungen &amp; Logik</div>';
    h += '<div class="edi-bh-expr">' + esc(expr) + "</div>";
    if (a.syms.length) {
      h += '<div class="edi-bh-sec">Logik-Symbole</div>';
      a.syms.forEach(function (s) {
        h += '<div class="edi-bh-row"><span class="edi-bh-sym">' + s + "</span><span>" + esc(SYMBOLE[s]) + "</span></div>";
      });
    }
    if (a.codes.length) {
      h += '<div class="edi-bh-sec">Referenzierte Bedingungen</div>';
      a.codes.forEach(function (nr) {
        var b = bedingung(nr);
        var art = b ? '<span class="edi-bh-art edi-bh-art-' + (b.art || "sonstige") + '">' + (ART[b.art] || "Bedingung") + "</span> " : "";
        var txt = b ? esc(b.text) : "<em>Text noch nicht hinterlegt</em>";
        h += '<div class="edi-bh-row"><span class="edi-bh-nr">[' + esc(nr) + "]</span><span>" + art + txt + "</span></div>";
      });
    }
    if (!a.syms.length && !a.codes.length) h += '<div class="edi-bh-row">Keine Bedingungen in diesem Ausdruck.</div>';
    return h;
  }

  // ---- Popover (eines, wiederverwendet) ---------------------------------
  var pop = null;
  function popEl() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "edi-bh-pop"; pop.style.display = "none";
    document.body.appendChild(pop);
    return pop;
  }
  function schliessen() { if (pop) pop.style.display = "none"; }
  function oeffnen(btn) {
    var p = popEl();
    p.innerHTML = popHtml(btn.getAttribute("data-expr") || "");
    p.style.display = "block";
    var r = btn.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 6;
    var left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - 360);
    p.style.top = top + "px"; p.style.left = Math.max(8, left) + "px";
  }

  // ---- Anreicherung -----------------------------------------------------
  function enhance(root) {
    root = root || document;
    var spans = root.querySelectorAll ? root.querySelectorAll(".expr:not([data-bh])") : [];
    Array.prototype.forEach.call(spans, function (sp) {
      var txt = sp.textContent || "";
      // Der Ausdruck kann mehrere mit " · " getrennte Teile tragen: Bedingung der
      // Segmentgruppe, Bedingung des Segments, Bedingungen einzelner Codewerte und
      // die Abschnittsbezeichnung. Übernommen werden alle Teile, die tatsächlich eine
      // Bedingung enthalten — die Bezeichnung bleibt außen vor.
      var regel = txt.split(" · ").filter(function (t) {
        return /\[[0-9UP]/.test(t) || /[∧∨⊻⊕]/.test(t);
      }).join(" · ").trim();
      if (!regel) { sp.setAttribute("data-bh", "0"); return; }
      sp.setAttribute("data-bh", "1");
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "edi-bh-btn"; btn.textContent = "?";
      btn.setAttribute("aria-label", "Bedingungen und Logik anzeigen");
      btn.title = "Bedingungen und Logik anzeigen";
      btn.setAttribute("data-expr", regel);
      sp.appendChild(document.createTextNode(" "));
      sp.appendChild(btn);
    });
  }

  function injectCss() {
    if (document.getElementById("edi-bh-css")) return;
    var s = document.createElement("style"); s.id = "edi-bh-css";
    s.textContent = [
      ".edi-bh-btn{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;",
      "margin-left:4px;padding:0;border:1px solid var(--border,#ccd3db);border-radius:50%;background:var(--panel,#fff);",
      "color:var(--heading,#004b6c);font-size:11px;font-weight:700;line-height:1;cursor:pointer;vertical-align:middle;}",
      ".edi-bh-btn:hover{background:var(--accent-bg,#e3eef4);}",
      ".edi-bh-pop{position:absolute;z-index:9999;max-width:360px;background:var(--panel,#fff);",
      "border:1px solid var(--border,#ccd3db);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.18);",
      "padding:10px 12px;font-size:12.5px;color:var(--text,#2a3138);line-height:1.45;}",
      ".edi-bh-head{font-weight:700;color:var(--heading,#004b6c);margin-bottom:6px;}",
      ".edi-bh-expr{font-family:'Courier New',monospace;background:var(--accent-bg,#e3eef4);",
      "color:var(--text,#2a3138);border-radius:4px;padding:3px 6px;margin-bottom:8px;word-break:break-word;}",
      ".edi-bh-sec{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#5f6b78);margin:8px 0 4px;}",
      ".edi-bh-row{display:flex;gap:8px;margin:4px 0;align-items:flex-start;}",
      ".edi-bh-sym{flex:0 0 20px;font-weight:700;text-align:center;color:var(--heading,#004b6c);}",
      ".edi-bh-nr{flex:0 0 42px;font-weight:700;color:var(--heading,#004b6c);}",
      ".edi-bh-art{display:inline-block;font-size:10px;font-weight:600;border-radius:10px;padding:0 6px;margin-right:2px;",
      "background:var(--accent-bg,#e3eef4);color:var(--heading,#004b6c);}",
      ".edi-bh-art-hinweis{background:#e6f5ea;color:#1a7f37;}",
      ".edi-bh-art-format{background:#fbeecb;color:#6a5100;}",
      ".edi-bh-art-wiederholbarkeit{background:#efe3f4;color:#6a2f8f;}"
    ].join("");
    document.head.appendChild(s);
  }

  function init() {
    injectCss();
    enhance(document);
    // Klick-Delegation
    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".edi-bh-btn") : null;
      if (b) { e.preventDefault(); oeffnen(b); return; }
      if (pop && !(e.target.closest && e.target.closest(".edi-bh-pop"))) schliessen();
    });
    window.addEventListener("resize", schliessen);
    window.addEventListener("scroll", schliessen, true);
    // Nach jedem Neu-Rendern des Formulars erneut anreichern
    if (global.MutationObserver) {
      var mo = new MutationObserver(function () { enhance(document); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.EdiBedingungHilfe = { enhance: enhance, SYMBOLE: SYMBOLE };
})(typeof window !== "undefined" ? window : this);
