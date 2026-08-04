// nachricht-speichern.js - erzeugte Nachricht als marktkonforme Übertragungsdatei sichern.
//
// Grundlage: Allgemeine Festlegungen zu den EDIFACT- und XML-Nachrichten, Abschnitt 2.12
// „Namenskonvention für Übertragungsdateien" (Fassung 6.1c für den Formatstand 202604,
// 6.1d für 202610 — beide wortgleich):
//
//     Nachrichtentyp_Anwendungsreferenz_von_an_yyyymmdd_DAR.txt
//
//   Nachrichtentyp        EDIFACT-Name des Nachrichtentyps    UNH DE0065
//   Anwendungsreferenz    VL, TL, (EM)                        UNB DE0026
//   von                   Absender-Kennung (MP-ID)            UNB DE0004
//   an                    Empfänger-Kennung (MP-ID)           UNB DE0010
//   yyyymmdd              Datumsstempel bei Erzeugung der Datei, in UTC
//   DAR                   Datenaustauschreferenz              UNB DE0020
//
// „Alle sechs Bestandteile sind MUSS-Angaben. Als Trennzeichen dient der Unterstrich."
// Führt eine Nachricht keine Anwendungsreferenz — bei UTILMD ist das der Regelfall —,
// bleibt der Platz leer und es stehen zwei Unterstriche nebeneinander; genau so zeigt es
// das Beispiel des Dokuments: UTILMD__9900123400007_4012345393651_20070131_A177.txt
//
// Alle Angaben werden aus der erzeugten Nachricht selbst gelesen, nicht aus
// Formularfeldern. Deshalb gilt dieselbe Funktion für jeden Nachrichtentyp, für
// Antwort- und Folgenachrichten und für eine im Validator eingelesene Datei.
(function (global) {
  "use strict";
  var doc = global.document;

  // ---- EDIFACT zerlegen ---------------------------------------------------
  // Trennzeichen laut UNA bzw. Standardvorgabe; '?' stellt das folgende Zeichen frei.
  function segmente(text) {
    var roh = String(text || "").replace(/\r?\n/g, "");
    var una = /^UNA(.{6})/.exec(roh);
    var komponente = ":", element = "+", frei = "?", ende = "'";
    if (una) {
      komponente = una[1][0]; element = una[1][1]; frei = una[1][3]; ende = una[1][5];
      roh = roh.slice(9);
    }
    var esc = function (z) { return z.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    var teiler = function (t) { return new RegExp("(?<!" + esc(frei) + ")" + esc(t)); };
    return roh.split(new RegExp("(?<!" + esc(frei) + ")" + esc(ende))).map(function (s) {
      s = s.trim();
      if (!s) return null;
      var el = s.split(new RegExp(teiler(element).source, "g"))
        .map(function (e) { return e.split(new RegExp(teiler(komponente).source, "g")); });
      return { tag: (el.shift() || [""])[0], elemente: el };
    }).filter(Boolean);
  }

  function wert(seg, elIdx, kompIdx) {
    if (!seg) return "";
    var el = seg.elemente[elIdx];
    if (!el) return "";
    var v = el[kompIdx || 0];
    return (v === undefined ? "" : String(v)).replace(/\?(.)/g, "$1").trim();
  }

  // Nur Zeichen, die in einem Dateinamen unbedenklich sind. MP-IDs und
  // Datenaustauschreferenzen sind ohnehin alphanumerisch; die Bereinigung fängt
  // ungewöhnliche Eingaben ab, damit der Speichern-Vorgang nicht scheitert.
  function sauber(s) { return String(s || "").replace(/[^A-Za-z0-9.\-]/g, ""); }

  function pad(n) { return String(n).padStart(2, "0"); }

  // ---- Dateiname ----------------------------------------------------------
  function dateiname(text, jetzt) {
    var segs = segmente(text);
    var unb = segs.find(function (s) { return s.tag === "UNB"; });
    var unh = segs.find(function (s) { return s.tag === "UNH"; });

    var typ = sauber(wert(unh, 1, 0)) || "EDIFACT";
    var anwendungsreferenz = sauber(wert(unb, 6, 0));   // DE0026 — meist leer
    var von = sauber(wert(unb, 1, 0)) || "ABSENDER";
    var an = sauber(wert(unb, 2, 0)) || "EMPFAENGER";
    var dar = sauber(wert(unb, 4, 0)) || "0";

    // „Datumsstempel bei Erzeugung der Datei in UTC" — also der Zeitpunkt des Speicherns,
    // nicht das Nachrichtendatum aus UNB DE0017.
    var d = jetzt || new Date();
    var stempel = "" + d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());

    return [typ, anwendungsreferenz, von, an, stempel, dar].join("_") + ".txt";
  }

  // ---- Inhalt -------------------------------------------------------------
  // In der Übertragungsdatei stehen die Segmente ohne Zeilenumbrüche hintereinander; die
  // Umbrüche im Ausgabefeld sind reine Lesehilfe (Schalter „Zeilenumbrüche im Editor").
  function inhalt(text) { return String(text || "").replace(/\r?\n/g, ""); }

  // UNB DE0001 führt den Zeichensatz, in der Marktkommunikation UNOC (ISO 8859-1).
  // Eine als UTF-8 geschriebene Datei läge damit neben der eigenen Vereinbarung: Umlaute
  // in Freitexten (FTX) kämen beim Empfänger falsch an. Deshalb wird zeichenweise nach
  // Latin-1 gewandelt. Typografische Zeichen, die eine Tastatur leicht einstreut, werden
  // vorher auf ihre ASCII-Entsprechung gebracht; alles darüber hinaus wird zu einem
  // Bindestrich — nie zu „?", denn das ist in EDIFACT das Freistellungszeichen.
  var ERSATZ = { "–": "-", "—": "-", "‘": "'", "’": "'",
                 "‚": "'", "“": "\"", "”": "\"", "„": "\"",
                 "…": "...", " ": " ", "−": "-", "˝": "\"" };
  function alsLatin1(text) {
    var aus = [];
    for (var i = 0; i < text.length; i++) {
      var z = text[i];
      if (ERSATZ[z]) { for (var k = 0; k < ERSATZ[z].length; k++) aus.push(ERSATZ[z].charCodeAt(k)); continue; }
      var c = text.charCodeAt(i);
      aus.push(c <= 0xFF ? c : 0x2D);   // 0x2D = '-'
    }
    return new Uint8Array(aus);
  }

  // ---- Speichern ----------------------------------------------------------
  // `quelle` ist die Element-ID des Ausgabefeldes oder unmittelbar der Nachrichtentext.
  function speichere(quelle, meldung) {
    var text = "";
    if (typeof quelle === "string" && doc && doc.getElementById(quelle)) {
      var el = doc.getElementById(quelle);
      text = ("value" in el) ? el.value : el.textContent;
    } else {
      text = String(quelle || "");
    }
    text = inhalt(text);
    var hinweisEl = meldung && doc ? doc.getElementById(meldung) : null;
    if (!text.trim()) {
      // Ohne erzeugte Nachricht gibt es nichts zu sichern. Der Hinweis erscheint neben der
      // Schaltfläche; nur wenn die Seite kein Meldungsfeld führt, tritt der Dialog ein.
      var text0 = "Es liegt keine Nachricht zum Speichern vor — bitte zuerst erzeugen.";
      if (hinweisEl) {
        hinweisEl.textContent = text0;
        hinweisEl.style.display = "inline-block";
      } else if (global.alert) {
        global.alert(text0);
      }
      return false;
    }
    var name = dateiname(text);
    var blob = new Blob([alsLatin1(text)], { type: "text/plain;charset=ISO-8859-1" });
    var url = global.URL.createObjectURL(blob);
    var a = doc.createElement("a");
    a.href = url; a.download = name;
    doc.body.appendChild(a); a.click(); a.remove();
    // Der Objekt-URL darf erst nach dem Klick freigegeben werden.
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
    if (hinweisEl) {
      hinweisEl.textContent = "Gespeichert: " + name;
      hinweisEl.style.display = "inline-block";
    }
    return name;
  }

  var api = {
    dateiname: dateiname,
    inhalt: inhalt,
    alsLatin1: alsLatin1,
    speichere: speichere,
    segmente: segmente
  };
  global.EdiSpeichern = api;
  // Unter Node (Regression) ist `this` in einem Modul nicht der globale Bereich —
  // deshalb zusätzlich als Modul ausgeben, damit `require()` die Funktionen liefert.
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis
   : (typeof window !== "undefined" ? window : this));
