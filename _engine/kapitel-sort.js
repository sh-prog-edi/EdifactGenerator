// _engine/kapitel-sort.js
// -------------------------------------------------------------------------
// Sortiert die <optgroup>-Kapitel eines Prüf-ID-Auswahlfelds aufsteigend nach
// AHB-Kapitelnummer (hierarchisch-numerisch): 8.1 < 8.2 < … < 8.10 < 8.11 <
// 8.13 < 8.14 < … < 9.1.1. Ohne Kapitelnummer beschriftete Gruppen wandern ans
// Ende. Non-invasiv: laeuft einmalig nach dem Laden, aendert nur die Reihenfolge.
(function () {
  "use strict";
  function schluessel(label) {
    var m = String(label || "").match(/^(\d+(?:\.\d+)*)/);
    return m ? m[1].split(".").map(Number) : [Infinity];
  }
  function vergleich(a, b) {
    var n = Math.max(a.length, b.length);
    for (var i = 0; i < n; i++) { var x = a[i] || 0, y = b[i] || 0; if (x !== y) return x - y; }
    return 0;
  }
  function sortiere(sel) {
    var groups = Array.prototype.slice.call(sel.querySelectorAll("optgroup"));
    if (groups.length < 2) return;
    groups
      .map(function (g, i) { return { g: g, k: schluessel(g.label), i: i }; })
      .sort(function (a, b) { return vergleich(a.k, b.k) || (a.i - b.i); })
      .forEach(function (o) { sel.appendChild(o.g); }); // in sortierter Reihenfolge neu anhaengen
  }
  function run() {
    // Standard: das Prüf-ID-Feld der UTILMD-Masken; zusaetzlich jedes Select mit
    // kapitelnummerierten optgroups.
    var s = document.getElementById("prufId");
    if (s) sortiere(s);
    Array.prototype.forEach.call(document.querySelectorAll("select"), function (sel) {
      if (sel.id === "prufId") return;
      var og = sel.querySelector("optgroup");
      if (og && /^\d+(\.\d+)*\s/.test(og.label || "")) sortiere(sel);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
