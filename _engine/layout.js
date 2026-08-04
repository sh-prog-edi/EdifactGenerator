// layout.js - Spaltenhöhe an den sichtbaren Bildschirm binden.
//
// Die Eingabemaske (linke Spalte) scrollt in sich selbst. Ihre Höhe war bisher fest
// mit `max-height: 85vh` gesetzt — gemessen an der Fensterhöhe, nicht am *verbleibenden*
// Platz unterhalb von Kopfzeile, Titel und Umschaltern. Auf einem hohen Monitor lag das
// untere Ende der Bildlaufleiste damit unterhalb des Fensters: Erst die ganze Seite
// scrollen, dann erst war der untere Pfeil der Leiste erreichbar.
//
// Hier wird die Höhe stattdessen aus dem tatsächlich sichtbaren Bereich berechnet:
//
//     Höhe = Fensterhöhe − Oberkante der Spalte im Fenster − Fußabstand
//
// Damit endet die Spalte immer am unteren Fensterrand, ihre Bildlaufleiste ist
// vollständig sichtbar — auf einem 13-Zoll-Laptop wie auf einem 24-Zoll-Monitor.
// Neu berechnet wird bei Größenänderung, beim Scrollen (die Spalten kleben oben, beim
// Scrollen wächst der sichtbare Bereich) und wenn sich der Inhalt ändert.
//
// Stehen die Spalten untereinander (schmales Fenster), bleibt die Höhe unbegrenzt —
// dort ist die Seite selbst der Scrollbereich. Erkannt wird das an der Spaltenbreite,
// nicht an einem Haltepunkt, damit die Datei ohne Kenntnis der Seiten-Media-Queries
// überall gleich arbeitet.
(function (global) {
  "use strict";
  var doc = global.document;
  if (!doc) return;

  var FUSS = 14;        // Abstand zum unteren Fensterrand
  var MINDEST = 260;    // darunter wird die Maske unbrauchbar klein
  var geplant = false;

  function spalten() {
    return Array.prototype.slice.call(doc.querySelectorAll(".left-panel, .right-panel"));
  }

  // Untereinander gestapelt? Dann nimmt die Spalte (fast) die volle Containerbreite ein.
  function gestapelt(el) {
    var c = el.parentElement;
    if (!c) return false;
    return el.offsetWidth >= c.clientWidth - 4;
  }

  // Innenabstand und Rahmen, die bei `box-sizing: content-box` zur `max-height` hinzukommen.
  function aussenmass(el) {
    var s = global.getComputedStyle ? global.getComputedStyle(el) : null;
    if (!s || s.boxSizing === "border-box") return 0;
    var z = function (w) { var n = parseFloat(w); return isNaN(n) ? 0 : n; };
    return z(s.paddingTop) + z(s.paddingBottom) + z(s.borderTopWidth) + z(s.borderBottomWidth);
  }

  // Was unterhalb der Spalten noch auf der Seite steht (Fußzeile mit Quellenangabe o. Ä.).
  // Wird mit eingerechnet, damit die Seite als Ganzes ohne Bildlauf auskommt — sonst bliebe
  // ein Rest übrig, für den man doch wieder scrollen müsste. Gemessen wird an den Geschwistern
  // des Spaltencontainers, nicht an der Dokumenthöhe: Letztere ändert sich mit der Spaltenhöhe
  // und die Rechnung würde sich selbst hinterherlaufen.
  function ueberhang(el) {
    var c = el.parentElement;
    if (!c) return 0;
    var summe = 0;
    for (var g = c.nextElementSibling; g; g = g.nextElementSibling) {
      var r = g.getBoundingClientRect();
      if (!r.height) continue;
      var s = global.getComputedStyle ? global.getComputedStyle(g) : null;
      var oben = s ? parseFloat(s.marginTop) : 0;
      summe += r.height + (isNaN(oben) ? 0 : oben);
    }
    return summe;
  }

  function anpassen() {
    geplant = false;
    var hoeheFenster = global.innerHeight || doc.documentElement.clientHeight;
    spalten().forEach(function (el) {
      // Untereinander: Höhenbegrenzung ausdrücklich aufheben. Ein leerer Wert würde die
      // Regel aus dem Stilblatt (85vh) wieder greifen lassen — die Spalte bekäme eine
      // zweite Bildlaufleiste innerhalb der ohnehin scrollenden Seite.
      if (gestapelt(el)) { el.style.maxHeight = "none"; return; }
      // Oberkante im Fenster. Klebt die Spalte bereits oben (position: sticky), ist das
      // ihr Klebeabstand; sonst der Abstand unterhalb des Seitenkopfes.
      var oben = el.getBoundingClientRect().top;
      if (oben < 0) oben = 0;
      var hoehe = hoeheFenster - oben - FUSS - ueberhang(el);
      if (hoehe < MINDEST) hoehe = MINDEST;
      // `max-height` misst je nach Boxmodell nur den Inhalt. Ohne `border-box` kämen
      // Innenabstand und Rahmen obendrauf — die Spalte ragte genau um diesen Betrag
      // unter den Fensterrand, und das untere Ende der Bildlaufleiste bliebe verdeckt.
      el.style.maxHeight = Math.round(hoehe - aussenmass(el)) + "px";
    });
  }

  function planen() {
    if (geplant) return;
    geplant = true;
    (global.requestAnimationFrame || function (f) { global.setTimeout(f, 16); })(anpassen);
  }

  global.EdiLayout = { anpassen: anpassen, planen: planen };

  function start() {
    anpassen();
    global.addEventListener("resize", planen);
    global.addEventListener("scroll", planen, { passive: true });
    // Formularaufbau, ein- und ausgeklappte Blöcke, neue Vorgänge: Höhe nachführen.
    if (global.MutationObserver) {
      var beobachter = new MutationObserver(planen);
      spalten().forEach(function (el) {
        beobachter.observe(el, { childList: true, subtree: true });
      });
    }
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof window !== "undefined" ? window : this);
