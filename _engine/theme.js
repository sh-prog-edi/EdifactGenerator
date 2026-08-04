// theme.js - globale Hell-/Dunkel-Einstellung für alle EdifactGenerator-Seiten.
// Die Wahl wird in localStorage ('edigenTheme') gespeichert und gilt damit
// seitenübergreifend (gleiche file://- bzw. http-Origin). Buttons: die Seiten
// verwenden die IDs tL/tD oder themeLight/themeDark.
(function () {
  function lese() {
    try { return localStorage.getItem('edigenTheme') || 'light'; }
    catch (e) { return 'light'; }
  }
  function anwenden(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (document.body) document.body.setAttribute('data-theme', t);
    [['tL', 'light'], ['themeLight', 'light'], ['tD', 'dark'], ['themeDark', 'dark']]
      .forEach(function (p) {
        var b = document.getElementById(p[0]);
        if (b) b.classList.toggle('active', t === p[1]);
      });
  }
  window.setTheme = function (t) {
    try { localStorage.setItem('edigenTheme', t); } catch (e) { /* ohne Speicher */ }
    anwenden(t);
  };
  var start = lese();
  anwenden(start);
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function () { anwenden(lese()); });
})();
