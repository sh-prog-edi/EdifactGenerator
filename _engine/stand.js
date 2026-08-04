// _engine/stand.js
// ------------------------------------------------------------------
// Formatstand als Parameter (Phase 3 der Neustrukturierung).
//
// Je Nachrichtentyp gibt es genau EINE Generatorseite; welcher Formatstand
// gilt, entscheidet der URL-Parameter ?stand=JJJJMM. Ohne Parameter gilt die
// Kalender-Zuständigkeit der BDEW-Formatstände (202604 bis 30.09.2026,
// 202610 ab 01.10.2026). Die Datenordner bleiben je Stand getrennt
// (<Wurzel>/<Stand>/<Thema>/<Typ>/pruef-ids/…) — diese Datei löst die Pfade
// auf und lädt die Datendateien der Seite über document.write (synchron, in
// Ladereihenfolge, ohne Bauwerkzeug, file://-tauglich).
//
// Verwendung im Seitenkopf (VOR den Datenladezeilen):
//   <script src="../../_engine/stand.js"></script>
//   <script>EdiStand.seite('Stammdaten/UTILTS');</script>
//   <script>EdiStand.lade('pruef-ids/_format.js');</script>  … je Datendatei
//
// Standabhängige Beschriftungen (Titel, Brotkrume, Untertitel, Quellenangabe)
// liefert EdiStand.beschrifte({'202604': {…}, '202610': {…}}) am Seitenende.
// ------------------------------------------------------------------
(function (global) {
    "use strict";

    // Bekannte Formatstände mit Geltungsbeginn (ein künftiger Stand ist ein
    // neuer Eintrag hier plus ein Datenordner — keine Baumkopie mehr).
    var STAENDE = [
        { stand: "202604", ab: "2026-04-01" },
        { stand: "202610", ab: "2026-10-01" },
    ];

    var erzwungen = null;   // für Tests: EdiStand.setze('202604')

    function aktiv() {
        if (erzwungen) return erzwungen;
        try {
            var m = /[?&]stand=(\d{6})/.exec((global.location && global.location.search) || "");
            if (m && STAENDE.some(function (s) { return s.stand === m[1]; })) return m[1];
        } catch (e) { /* ohne location gilt die Kalender-Zuständigkeit */ }
        // Kalender-Zuständigkeit: der jüngste Stand, dessen Geltungsbeginn
        // erreicht ist; vor dem ersten Geltungsbeginn der älteste.
        var heute = new Date();
        var p = function (n) { return String(n).padStart(2, "0"); };
        var iso = heute.getFullYear() + "-" + p(heute.getMonth() + 1) + "-" + p(heute.getDate());
        var z = STAENDE[0].stand;
        STAENDE.forEach(function (s) { if (iso >= s.ab) z = s.stand; });
        return z;
    }

    var SEITE = { pfad: "", wurzel: "." };

    // Lage der Seite unterhalb der Projektwurzel, z. B. 'Stammdaten/UTILMD/Strom'.
    function seite(pfad) {
        SEITE.pfad = pfad;
        SEITE.wurzel = pfad.split("/").map(function () { return ".."; }).join("/") || ".";
    }

    // Pfad einer Datendatei des aktiven Formatstands (relativ zur Seite).
    function datenPfad(rel) {
        return SEITE.wurzel + "/" + aktiv() + "/" + SEITE.pfad + "/" + rel;
    }

    // Datendatei des aktiven Stands synchron laden (in Script-Reihenfolge).
    function lade(rel) {
        document.write('<script src="' + datenPfad(rel) + '"><\/script>');
    }

    // Interner Link auf eine Schwesterseite unter Beibehaltung des Stands.
    function link(datei) {
        return datei + "?stand=" + aktiv();
    }

    // Standabhängige Beschriftungen setzen. Erwartete Schlüssel je Stand:
    //   titel  -> document.title
    //   krume  -> Element #standKrume (Brotkrume)
    //   h1     -> Element #standH1 (Seitenüberschrift)
    //   sub    -> Element #standSub (Untertitel)
    //   quelle -> Element #standQuelle (Quellenangabe im Fuß)
    // Zusätzlich erhalten Elemente mit data-stand-<stand>-label ihr
    // standspezifisches label-Attribut (z. B. optgroup-Kapitelnummern).
    function beschrifte(texte) {
        var t = texte[aktiv()] || {};
        if (t.titel) document.title = t.titel;
        [["krume", "standKrume"], ["h1", "standH1"], ["sub", "standSub"], ["quelle", "standQuelle"]]
            .forEach(function (paar) {
                var el = document.getElementById(paar[1]);
                if (el && t[paar[0]] !== undefined) el.innerHTML = t[paar[0]];
            });
        if (typeof document.querySelectorAll === "function") {
            var attr = "data-stand-" + aktiv() + "-label";
            document.querySelectorAll("[" + attr + "]").forEach(function (el) {
                el.setAttribute("label", el.getAttribute(attr));
            });
        }
    }

    global.EdiStand = {
        aktiv: aktiv, seite: seite, lade: lade, link: link,
        datenPfad: datenPfad, beschrifte: beschrifte,
        setze: function (s) { erzwungen = s || null; },
        staende: function () { return STAENDE.map(function (s) { return s.stand; }); },
    };

    // Standabhängige Textvarianten: Elemente mit der Klasse nur-<Stand> sind nur
    // im jeweiligen Formatstand sichtbar. Das Style-Tag wird beim Laden dieser
    // Datei geschrieben (synchron, vor dem Seiteninhalt).
    try {
        if (typeof document !== "undefined" && typeof document.write === "function"
            && document.readyState === "loading") {
            var regeln = STAENDE.map(function (s) { return ".nur-" + s.stand + "{display:none}"; }).join("");
            document.write("<style>" + regeln + " .nur-" + aktiv() + "{display:inline}</style>");
        }
    } catch (e) { /* ohne document (Test-Harness) keine Anzeige-Steuerung nötig */ }
})(typeof window !== "undefined" ? window : this);
