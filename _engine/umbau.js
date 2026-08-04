// umbau.js - Produktivnachricht zu Testnachricht umbauen.
//
// Grundlage der Ersetzungen (Schaltfläche „Umbau zu Testnachricht"):
//   - UNB DE0035 Testkennzeichen "1" — die Nachricht ist als Test-File gekennzeichnet.
//   - UNB S004 (DE0017/DE0019) und DTM+137 erhalten den aktuellen Zeitpunkt
//     (UNB: JJMMTT:HHMM in UTC; DTM+137 im Qualifier-Format, Standard 303 = UTC+00) —
//     dieselbe Belegung wie beim Erzeugen einer Testnachricht in der Engine.
//   - Datenaustauschreferenz, Nachrichten- und Dokumentennummer (UNB DE0020,
//     UNH/UNT DE0062, BGM DE1004, UNZ DE0020) werden wie beim Erstellen einer
//     Testnachricht neu vergeben: eine 12-stellige Referenz (Millisekunden seit
//     01.01.2000 UTC, _engine/ahb-form-engine.js); bei mehreren Nachrichten je
//     Übertragungsdatei zählt die Referenz je UNH um eins weiter.
//   - Vorgangsnummer (SG4 IDE DE7402): EDIGEN{<DAR>, ab dem zweiten Vorgang je
//     Nachricht mit "-02", "-03" … — identisch zur Engine und zu den kuratierten
//     Masken (scripts/test_vorgangsnummer.js).
//   - Erste Zeitscheibe der Verwendungszeiträume („Verwendung der Daten ab",
//     erstes DTM+Z25 je Vorgang — die SG6 gehört zum Vorgang; ohne IDE je
//     Nachricht): Ende des aktuellen Tagesdatums, also der Folgetag 00:00
//     deutscher Zeit — dieselbe Regel wie Bedingung [131] (Beginn der ersten
//     Zeitscheibe höchstens der auf das Nachrichtendatum folgende Tag, 00:00
//     gesetzlicher deutscher Zeit).
//   - UNT DE0074 (Segmentanzahl) und UNZ DE0036 (Nachrichtenzahl) werden neu
//     gezählt — die Werte der Produktivnachricht könnten falsch übernommen sein.
//
// Alle übrigen Werte bleiben unverändert; jedes Feld ist nach dem Umbau weiter
// editierbar. Der Umbau arbeitet generisch auf der Segmentstruktur und setzt
// keinen erkannten Nachrichtentyp voraus — auch Nachrichten mit unbekannter
// Prüf-ID oder fremdem Typ werden umgebaut (IDE und Zeitscheiben nur, wo
// vorhanden). Damit bleibt das Werkzeug nutzbar, wenn Prüf-IDs künftig
// wegfallen oder hinzukommen.
(function (global) {
  "use strict";

  // ---- EDIFACT zerlegen und zusammensetzen --------------------------------
  // Zerlegung wie in _engine/nachricht-speichern.js (UNA-bewusst); die Werte werden
  // hier zusätzlich ENTSCHÄRFT (Freistellungszeichen aufgelöst), damit die
  // Eingabefelder den reinen Wert zeigen. Beim Serialisieren wird neu freigestellt.
  function zerlege(text) {
    var roh = String(text || "").replace(/\r?\n/g, "");
    var una = /^UNA(.{6})/.exec(roh);
    var komponente = ":", element = "+", frei = "?", ende = "'";
    if (una) {
      komponente = una[1][0]; element = una[1][1]; frei = una[1][3]; ende = una[1][5];
      roh = roh.slice(9);
    }
    var esc = function (z) { return z.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    var vor = function (t) { return new RegExp("(?<!" + esc(frei) + ")" + esc(t), "g"); };
    var freiWeg = new RegExp(esc(frei) + "(.)", "g");
    return roh.split(vor(ende)).map(function (s) {
      s = s.trim();
      if (!s) return null;
      var el = s.split(vor(element)).map(function (e) {
        return e.split(vor(komponente)).map(function (k) { return k.replace(freiWeg, "$1"); });
      });
      return { tag: (el.shift() || [""])[0], elemente: el };
    }).filter(Boolean);
  }

  // Freistellung nach UNA-Standardvorgabe (UNA:+.? ') — die Engine erzeugt
  // ausschließlich diese Trennzeichen, deshalb wird auch hier auf sie normiert.
  function stelleFrei(wert) {
    return String(wert == null ? "" : wert).replace(/([?'+:])/g, "?$1");
  }

  function serialisiere(segmente) {
    var zeilen = ["UNA:+.? '"];
    segmente.forEach(function (seg) {
      var elemente = seg.elemente.map(function (el) {
        return el.map(stelleFrei).join(":").replace(/:+$/, "");
      });
      // Leere Elemente am Ende entfallen — wie in erzeugten Nachrichten üblich.
      while (elemente.length && elemente[elemente.length - 1] === "") elemente.pop();
      zeilen.push([seg.tag].concat(elemente).join("+") + "'");
    });
    return zeilen.join("\n");
  }

  // ---- Referenzen wie beim Erstellen einer Testnachricht ------------------
  function pad(n) { return String(n).padStart(2, "0"); }

  // 12-stellige Nachrichtenreferenz: Millisekunden seit 01.01.2000 (UTC) —
  // identisch zu nachrichtRef() in _engine/ahb-form-engine.js.
  function neueReferenz(jetzt) {
    return String((jetzt || new Date()).getTime() - Date.UTC(2000, 0, 1));
  }

  var VORGANG_PRAEFIX = "EDIGEN{";
  function vorgangsNummer(dar, lfd) {
    var n = Number(lfd) || 1;
    return VORGANG_PRAEFIX + dar + (n > 1 ? "-" + pad(n) : "");
  }

  // Aktueller Zeitpunkt in den Formaten der Nachricht.
  function unbDatum(d) { return String(d.getUTCFullYear()).slice(2) + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()); }
  function unbZeit(d) { return pad(d.getUTCHours()) + pad(d.getUTCMinutes()); }
  function dtmWert(d, code) {
    if (code === "102") return "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    if (code === "203") return "" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes());
    // Standard der Marktkommunikation: 303 = CCYYMMDDHHMM+ZZ, Zeitangabe in UTC.
    return "" + d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate())
         + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "+00";
  }

  // „Verwendung der Daten ab" zum Ende des aktuellen Tagesdatums: der Folgetag
  // 00:00 in gesetzlicher deutscher Zeit — die Engine liest lokale Zeit und
  // rechnet beim Erzeugen nach UTC; hier geschieht dasselbe direkt.
  function tagesende(jetzt) {
    var d = jetzt || new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0);
  }

  function setze(seg, elIdx, kompIdx, wert) {
    while (seg.elemente.length <= elIdx) seg.elemente.push([]);
    var el = seg.elemente[elIdx];
    while (el.length <= kompIdx) el.push("");
    el[kompIdx] = String(wert);
  }

  // ---- Umbau --------------------------------------------------------------
  // Verändert die übergebene Segmentstruktur und liefert einen Bericht der
  // Ersetzungen: [{seg: <Index>, el, komp, feld, wert, grund}].
  function baueUm(segmente, jetzt) {
    var d = jetzt || new Date();
    var basis = Number(neueReferenz(d));
    var bericht = [];
    var merk = function (i, el, komp, feld, wert, grund) {
      bericht.push({ seg: i, el: el, komp: komp, feld: feld, wert: String(wert), grund: grund });
    };

    // Nachrichtenweise Zustände
    var refIndex = -1;          // wievielte UNH-Nachricht (0-basiert)
    var dar = "";               // Referenz der laufenden Nachricht
    var interchangeRef = String(basis);
    var vorgang = 0;            // IDE-Zähler je Nachricht
    var zeitscheibeGesetzt = false;   // erstes DTM+Z25 je Nachricht
    var unhIndex = -1;          // Segmentindex der laufenden UNH (für UNT-Zählung)

    segmente.forEach(function (seg, i) {
      var q = (seg.elemente[0] || [])[0] || "";

      if (seg.tag === "UNB") {
        // S004 besteht aus zwei Komponenten — beide werden ersetzt und deshalb
        // auch beide gemeldet (der Bericht steuert die Feld-Markierung).
        setze(seg, 3, 0, unbDatum(d)); setze(seg, 3, 1, unbZeit(d));
        merk(i, 3, 0, "UNB DE0017 (Datum)", unbDatum(d), "Erstellungszeitpunkt der Testnachricht");
        merk(i, 3, 1, "UNB DE0019 (Uhrzeit)", unbZeit(d), "Erstellungszeitpunkt der Testnachricht");
        setze(seg, 4, 0, interchangeRef);
        merk(i, 4, 0, "UNB DE0020", interchangeRef, "neue Datenaustauschreferenz");
        setze(seg, 10, 0, "1");
        merk(i, 10, 0, "UNB DE0035", "1", "Test-Kennzeichen");
        return;
      }
      if (seg.tag === "UNH") {
        refIndex += 1;
        dar = refIndex === 0 ? interchangeRef : String(basis + refIndex);
        vorgang = 0; zeitscheibeGesetzt = false; unhIndex = i;
        setze(seg, 0, 0, dar);
        merk(i, 0, 0, "UNH DE0062", dar, "neue Nachrichtennummer");
        return;
      }
      if (seg.tag === "BGM") {
        setze(seg, 1, 0, dar || interchangeRef);
        merk(i, 1, 0, "BGM DE1004", dar || interchangeRef, "neue Dokumentennummer");
        return;
      }
      if (seg.tag === "DTM" && q === "137") {
        var code137 = (seg.elemente[0] || [])[2] || "303";
        setze(seg, 0, 1, dtmWert(d, code137));
        merk(i, 0, 1, "DTM+137", dtmWert(d, code137), "Erstellungszeitpunkt der Testnachricht");
        return;
      }
      if (seg.tag === "DTM" && q === "Z25" && !zeitscheibeGesetzt) {
        zeitscheibeGesetzt = true;
        var codeZ25 = (seg.elemente[0] || [])[2] || "303";
        var wert = dtmWert(tagesende(d), codeZ25);
        setze(seg, 0, 1, wert);
        merk(i, 0, 1, "DTM+Z25", wert, "erste Zeitscheibe: Verwendung der Daten ab Ende des aktuellen Tages");
        return;
      }
      if (seg.tag === "IDE" && q === "24") {
        vorgang += 1;
        zeitscheibeGesetzt = false;   // Zeitscheiben (SG6) gelten je Vorgang
        var nr = vorgangsNummer(dar || interchangeRef, vorgang);
        setze(seg, 1, 0, nr);
        merk(i, 1, 0, "IDE DE7402", nr, "neue Vorgangsnummer");
        return;
      }
      if (seg.tag === "UNT") {
        var anzahl = unhIndex >= 0 ? (i - unhIndex + 1) : Number((seg.elemente[0] || [])[0] || 0);
        setze(seg, 0, 0, String(anzahl));
        setze(seg, 1, 0, dar || interchangeRef);
        merk(i, 1, 0, "UNT DE0062", dar || interchangeRef, "neue Nachrichtennummer");
        return;
      }
      if (seg.tag === "UNZ") {
        setze(seg, 0, 0, String(refIndex + 1));
        setze(seg, 1, 0, interchangeRef);
        merk(i, 1, 0, "UNZ DE0020", interchangeRef, "neue Datenaustauschreferenz");
        return;
      }
    });
    return bericht;
  }

  // ---- Vorgänge (SG4 IDE+24) ---------------------------------------------
  // Eine Nachricht kann mehrere Vorgänge tragen, auch zu unterschiedlichen
  // Prüf-IDs (RFF+Z13 steht je Vorgang). vorgaenge() liefert je Vorgang den
  // Segmentbereich [von..bis) innerhalb seiner Nachricht sowie die Prüf-ID,
  // soweit der Vorgang eine führt.
  function vorgaenge(segmente) {
    var liste = [];
    var nachricht = -1;
    var offen = null;
    var schliesse = function (bis) {
      if (offen) { offen.bis = bis; liste.push(offen); offen = null; }
    };
    segmente.forEach(function (seg, i) {
      var q = (seg.elemente[0] || [])[0] || "";
      if (seg.tag === "UNH") { schliesse(i); nachricht += 1; return; }
      if (seg.tag === "UNT" || seg.tag === "UNZ") { schliesse(i); return; }
      if (seg.tag === "IDE" && q === "24") {
        schliesse(i);
        offen = { von: i, bis: -1, nachricht: nachricht, nr: liste.filter(function (v) { return v.nachricht === nachricht; }).length + 1, pruefi: "" };
        return;
      }
      if (offen && seg.tag === "RFF" && q === "Z13" && !offen.pruefi)
        offen.pruefi = (seg.elemente[0] || [])[1] || "";
    });
    schliesse(segmente.length);
    return liste;
  }

  // Testnachricht für AUSGEWÄHLTE Vorgänge: liefert eine (tiefe) Kopie der
  // Segmentliste, die je Nachricht den Kopfteil (UNH bis zum ersten IDE) und genau
  // die gewählten Vorgänge enthält. Nachrichten, deren Vorgänge sämtlich abgewählt
  // sind, entfallen ganz. Der Segmentzähler im UNT (DE0074) und der
  // Nachrichtenzähler im UNZ (DE0036) werden an den verkürzten Umfang angepasst.
  //
  // `auswahl` ist die Liste der zu behaltenden Vorgänge aus vorgaenge(); die
  // Auswahl aller Vorgänge liefert die Nachricht unverändert (bis auf die neu
  // gezählten UNT/UNZ-Werte, die dann dem vollen Umfang entsprechen).
  function filterVorgaenge(segmente, auswahl) {
    // Je Nachricht: Segmentindex des ersten IDE (Ende des Kopfteils) und die
    // behaltenen Vorgangsbereiche.
    var ersterIdeJeNachricht = {};
    vorgaenge(segmente).forEach(function (v) {
      if (!(v.nachricht in ersterIdeJeNachricht) || v.von < ersterIdeJeNachricht[v.nachricht])
        ersterIdeJeNachricht[v.nachricht] = v.von;
    });
    var behalteBereiche = {};   // nachricht -> [[von,bis], …]
    var behalteNachricht = {};  // nachricht -> true
    (auswahl || []).forEach(function (v) {
      (behalteBereiche[v.nachricht] = behalteBereiche[v.nachricht] || []).push([v.von, v.bis]);
      behalteNachricht[v.nachricht] = true;
    });

    var kopie = [];
    var uebernehmen = function (seg) {
      kopie.push({ tag: seg.tag, elemente: seg.elemente.map(function (el) { return el.slice(); }) });
    };
    var nachricht = -1, unhIdxKopie = -1;
    segmente.forEach(function (seg, i) {
      if (seg.tag === "UNB" || seg.tag === "UNZ") { uebernehmen(seg); return; }
      if (seg.tag === "UNH") {
        nachricht += 1;
        if (behalteNachricht[nachricht]) { uebernehmen(seg); unhIdxKopie = kopie.length - 1; }
        return;
      }
      if (!behalteNachricht[nachricht]) return;
      if (seg.tag === "UNT") {
        uebernehmen(seg);
        // Segmentzähler DE0074: UNH bis UNT einschließlich, im verkürzten Umfang
        kopie[kopie.length - 1].elemente[0] = [String(kopie.length - unhIdxKopie)];
        return;
      }
      var kopfteil = i < ersterIdeJeNachricht[nachricht];
      var vorgangsteil = (behalteBereiche[nachricht] || []).some(function (b) { return i >= b[0] && i < b[1]; });
      if (kopfteil || vorgangsteil) uebernehmen(seg);
    });
    // Nachrichtenzähler im UNZ (DE0036): nur Nachrichten mit gewählten Vorgängen bleiben
    kopie.forEach(function (seg) {
      if (seg.tag === "UNZ") seg.elemente[0] = [String(kopie.filter(function (s) { return s.tag === "UNH"; }).length)];
    });
    return kopie;
  }

  var api = {
    zerlege: zerlege,
    serialisiere: serialisiere,
    stelleFrei: stelleFrei,
    baueUm: baueUm,
    neueReferenz: neueReferenz,
    vorgangsNummer: vorgangsNummer,
    tagesende: tagesende,
    dtmWert: dtmWert,
    vorgaenge: vorgaenge,
    filterVorgaenge: filterVorgaenge,
  };
  global.EdiUmbau = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis
   : (typeof window !== "undefined" ? window : this));
