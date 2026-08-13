// _engine/daten/contrl-ahb.js
// ------------------------------------------------------------------
// AHB-Angaben zur CONTRL: Zulässigkeit der Codes JE ANWENDUNGSFALL sowie
// AHB-Status und Bedingungen je Segment/Datenelement.
//
// MASCHINELL ERZEUGT aus dem BDEW-AHB CONTRL durch
// werkzeuge/lies_contrl_ahb.py — nicht von Hand pflegen.
// Quelle: AHB_CONTRL_1.0_20251001_99991231_20251211_oxox_12004.docx
//
// Ergänzt _engine/daten/uci-fehlercodes.js (Codelisten aus dem MIG): Der MIG
// sagt, WELCHE Codes es je Segment gibt; der AHB sagt, in welchem
// ANWENDUNGSFALL sie verwendet werden dürfen. Beispiel UCI DE0083 — Code 7
// nur in der Empfangsbestätigung, Code 4 nur in den Fehlermeldungen.
// ------------------------------------------------------------------
var contrlAhb = {
  "anwendungsfaelle": ["Empfangsbestätigung", "Syntaxfehlermeldung in der Übertragungsdatei", "Syntaxfehlermeldung in der Nachricht"],
  // Codelisten je Segmentpfad und Datenelement:
  //   [code, Bezeichnung, [zulässig je Anwendungsfall …]]
  "codes": {
    "SG1 UCM": {
      "0013": [
        ["UNH", "Nachrichten-Kopfsegment", [false, false, true]],
        ["UNT", "Nachrichten-Endesegment", [false, false, true]]
      ],
      "0065": [
        ["APERAK", "Anwendungsfehler- und Bestätigungs-Nachricht", [false, false, true]],
        ["COMDIS", "Handelsunstimmigkeit", [false, false, true]],
        ["IFTSTA", "Multimodaler Statusbericht", [false, false, true]],
        ["INSRPT", "Prüfbericht", [false, false, true]],
        ["INVOIC", "Rechnung", [false, false, true]],
        ["MSCONS", "Bericht über den Verbrauch messbarer Dienstleistungen", [false, false, true]],
        ["ORDCHG", "Bestelländerung", [false, false, true]],
        ["ORDERS", "Bestellung", [false, false, true]],
        ["ORDRSP", "Bestellantwort", [false, false, true]],
        ["PARTIN", "Partnerstammdaten", [false, false, true]],
        ["PRICAT", "Preisliste/Katalog", [false, false, true]],
        ["QUOTES", "Angebot", [false, false, true]],
        ["REMADV", "Zahlungsavis", [false, false, true]],
        ["REQOTE", "Anfrage", [false, false, true]],
        ["UTILMD", "Netzanschluss-Stammdaten", [false, false, true]],
        ["UTILTS", "Netznutzungszeiten-Nachricht", [false, false, true]]
      ],
      "0083": [
        ["4", "Diese Ebene und alle tieferen Ebenen zurückgewiesen", [false, false, true]]
      ],
      "0085": [
        ["12", "Ungültiger Wert", [false, false, true]],
        ["13", "Fehlt", [false, false, true]],
        ["16", "Zu viele Bestandteile", [false, false, true]],
        ["21", "Ungültige(s) Zeichen", [false, false, true]],
        ["22", "Ungültige(s) Service-Zeichen", [false, false, true]],
        ["26", "Duplikat gefunden", [false, false, true]],
        ["28", "Referenzen stimmen nicht überein", [false, false, true]],
        ["29", "Kontrollzähler entspricht nicht der Anzahl empfangender Fälle", [false, false, true]],
        ["39", "Datenelement zu lang", [false, false, true]]
      ]
    },
    "SG2 UCD": {
      "0085": [
        ["12", "Ungültiger Wert", [false, false, true]],
        ["13", "Fehlt", [false, false, true]],
        ["16", "Zu viele Bestandteile", [false, false, true]],
        ["19", "Ungültige Dezimalbeschreibung", [false, false, true]],
        ["21", "Ungültige(s) Zeichen", [false, false, true]],
        ["22", "Ungültige(s) Service-Zeichen", [false, false, true]],
        ["37", "Ungültige Zeichenart", [false, false, true]],
        ["38", "Fehlende Ziffer vor dem Dezimalzeichen", [false, false, true]],
        ["39", "Datenelement zu lang", [false, false, true]],
        ["40", "Datenelement zu kurz", [false, false, true]]
      ]
    },
    "SG2 UCS": {
      "0085": [
        ["13", "Fehlt", [false, false, true]],
        ["15", "Nicht unterstützt an dieser Position", [false, false, true]],
        ["16", "Zu viele Bestandteile", [false, false, true]],
        ["22", "Ungültige(s) Service-Zeichen", [false, false, true]],
        ["35", "Zu viele Segment-Wiederholungen", [false, false, true]],
        ["36", "Zu viele Segmentgruppen-Wiederholungen", [false, false, true]]
      ]
    },
    "UCI": {
      "0007": [
        ["14", "GS1", [true, true, true]],
        ["500", "DE, BDEW (Bundesverband der Energie- und Wasserwirtschaft e.V.)", [true, true, true]],
        ["502", "DE, DVGW (Deutsche Vereinigung des Gas- und Wasserfaches e.V.)", [true, true, true]]
      ],
      "0013": [
        ["UNA", "Trennzeichenvorgabe", [false, true, false]],
        ["UNB", "Nutzdaten-Kopfsegment", [false, true, false]],
        ["UNZ", "Nutzdaten-Endesegment", [false, true, false]]
      ],
      "0083": [
        ["4", "Diese Ebene und alle tieferen Ebenen zurückgewiesen", [false, true, true]],
        ["7", "Übertragung bestätigt (keine Syntaxfehler)", [true, false, false]]
      ],
      "0085": [
        ["2", "Syntax-Version oder -ebene nicht unterstützt", [false, true, false]],
        ["7", "Empfänger der Übertragungsdatei ist nicht der tatsächliche Empfänger", [false, true, false]],
        ["12", "Ungültiger Wert", [false, true, false]],
        ["13", "Fehlt", [false, true, false]],
        ["16", "Zu viele Bestandteile", [false, true, false]],
        ["20", "Zeichen ungültig als Service-Zeichen", [false, true, false]],
        ["21", "Ungültige(s) Zeichen", [false, true, false]],
        ["23", "Unbekannter Absender der Übertragungsdatei", [false, true, false]],
        ["25", "Test-Kennzeichen nicht unterstützt", [false, true, false]],
        ["26", "Duplikat gefunden", [false, true, false]],
        ["28", "Referenzen stimmen nicht überein", [false, true, false]],
        ["29", "Kontrollzähler entspricht nicht der Anzahl empfangender Fälle", [false, true, false]],
        ["32", "Tiefere Ebene leer", [false, true, false]]
      ]
    },
    "UNH": {
      "0054": [
        ["3", "Dritte Ausgabe (CONTRL-Nachricht)", [true, true, true]]
      ],
      "0065": [
        ["CONTRL", "Syntax- und Servicebericht", [true, true, true]]
      ]
    }
  },
  // AHB-Status je Segment/DE UND Anwendungsfall (Muss/Soll/M/S/X,
  // ggf. mit Bedingung; leer = in diesem Anwendungsfall nicht verwendet).
  "status": {
    "SG1": ["", "", "Muss"],
    "SG1 UCM": ["", "", "Muss"],
    "SG1 UCM 0013": ["", "", "X [2] ∨ [3]"],
    "SG1 UCM 0051": ["", "", "X"],
    "SG1 UCM 0052": ["", "", "X"],
    "SG1 UCM 0054": ["", "", "X"],
    "SG1 UCM 0057": ["", "", "X"],
    "SG1 UCM 0062": ["", "", "X"],
    "SG1 UCM 0085": ["", "", "S [2] ∨ [3]"],
    "SG1 UCM 0098": ["", "", "S [8] ∧ [1]"],
    "SG1 UCM 0104": ["", "", "S [8] ∧ [1]"],
    "SG2": ["", "", "Muss [9]"],
    "SG2 UCD": ["", "", "Soll [6]"],
    "SG2 UCD 0098": ["", "", "M"],
    "SG2 UCD 0104": ["", "", "S [1]"],
    "SG2 UCS": ["", "", "Muss"],
    "SG2 UCS 0085": ["", "", "X [5]"],
    "SG2 UCS 0096": ["", "", "X"],
    "UCI": ["Muss", "Muss", "Muss"],
    "UCI 0004": ["X", "X", "X"],
    "UCI 0010": ["X", "X", "X"],
    "UCI 0020": ["X", "X", "X"],
    "UCI 0098": ["", "S [1]", ""],
    "UCI 0104": ["", "S [1]", ""],
    "UNH": ["Muss", "Muss", "Muss"],
    "UNH 0051": ["X", "X", "X"],
    "UNH 0052": ["X", "X", "X"],
    "UNH 0057": ["X", "X", "X"],
    "UNH 0062": ["X", "X", "X"],
    "UNT": ["Muss", "Muss", "Muss"],
    "UNT 0062": ["X", "X", "X"],
    "UNT 0074": ["X", "X", "X"]
  },
  // Aussagen des AHB-Fließtexts zu einzelnen Fehlercodes.
  "hinweise": {
    "26": ["Muss der Empfänger aufgrund eines von ihm verursachten Fehlers eine Übertragungsdatei erneut in sein System einspielen oder erhält er aus diesem Grund eine an ihn bereits gesandte Übertragungsdatei erneut, so hat er sicher zu stellen, dass in solch einem Fall seine Systeme keine Syntaxfehlermeldung mit dem Fehlercode 26 (= Duplikat gefunden) versenden."]
  },
  "bedingungen": {
    "1": "Wenn Angabe möglich.",
    "2": "Wenn Syntaxfehler in UNH vorhanden.",
    "3": "Wenn Syntaxfehler in UNT vorhanden.",
    "5": "Wenn Fehler auf Segment(gruppen)ebene vorhanden.",
    "6": "Wenn Fehler auf Datenelement-, Gruppendatenelement- oder Datengruppenebene vorhanden.",
    "8": "Wenn SG1 UCM DE0013 vorhanden.",
    "9": "Wenn SG1 UCM DE0013 nicht vorhanden."
  }
};

// Ist `code` an dieser Stelle laut AHB vorgesehen? Rückgabe:
//   { bekannt, anwendungsfaelle: [Namen], text }
// bekannt === false heißt: Der AHB führt den Code an dieser Ebene
// nicht — entweder falsche Ebene oder im Marktprozess nicht vorgesehen.
function contrlAhbZulaessig(code, segmentPfad, de) {
  var liste = ((contrlAhb.codes || {})[segmentPfad] || {})[de || "0085"] || [];
  for (var i = 0; i < liste.length; i++) {
    if (liste[i][0] !== String(code)) continue;
    var namen = [];
    (liste[i][2] || []).forEach(function (ja, k) {
      if (ja && contrlAhb.anwendungsfaelle[k]) namen.push(contrlAhb.anwendungsfaelle[k]);
    });
    return { bekannt: true, anwendungsfaelle: namen, text: liste[i][1] };
  }
  return { bekannt: false, anwendungsfaelle: [], text: "" };
}

if (typeof module !== "undefined")
  module.exports = { contrlAhb: contrlAhb, contrlAhbZulaessig: contrlAhbZulaessig };
