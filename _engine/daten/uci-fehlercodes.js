// _engine/daten/uci-fehlercodes.js
// ------------------------------------------------------------------
// Codelisten der CONTRL-Servicesegmente (UNTDID 0083 „Aktion, codiert" und
// 0085 „Syntax-Fehler, codiert").
//
// MASCHINELL ERZEUGT aus dem BDEW-MIG CONTRL durch
// werkzeuge/lies_contrl_fehlercodes.py — nicht von Hand pflegen.
// Quelle: MIG_CONTRL_2.0b_20221001_99991231_20251211_oxox_12006.docx
//
// Die Liste ist JE SEGMENT verschieden: DE0085 führt im UCI-Segment
// (Übertragungsdatei-Ebene) andere Codes und Erläuterungen als im UCM
// (Nachricht), UCS (Segment) oder UCD (Datenelement). Beispiel Code 26 —
// UCI: Duplikat einer früher empfangenen ÜBERTRAGUNGSDATEI; UCM: Duplikat
// einer NACHRICHT in der zugrundeliegenden Übertragungsdatei. Wer die
// Ebene kennt (CONTRL-Generator, Ablehnungs-Abgleich), schlägt deshalb
// segmentgenau über contrlCodelisten nach; uciFehlercodes0085 bleibt als
// Vereinigung für die einfache Textanzeige erhalten.
//
// Eintragsformat: [code, Bezeichnung, Erläuterung aus der MIG].
// ------------------------------------------------------------------
var contrlCodelisten = {
  "UCD": {
    "0085": [
      ["12", "Ungültiger Wert", "Mitteilung, dass der Wert eines einfachen Datenelements, einer Datenelementgruppe oder eines Gruppendatenelements nicht den entsprechenden Spezifikationen entspricht (z. B. Qualifier nicht aus erlaubtem Wertebereich oder ungültiges Datumsformat)."],
      ["13", "Fehlt", "Mitteilung, dass ein mit M oder R gekennzeichnetes Datenelement, eine Datenelementgruppe oder ein Gruppendatenelement fehlt."],
      ["16", "Zu viele Bestandteile", "Mitteilung, dass die identifizierte Datenelementgruppe zu viele Gruppendatenelemente enthält."],
      ["19", "Ungültige Dezimalbeschreibung", "Mitteilung, dass die im Datenelement verwendete Dezimalschreibung nicht mit derjenigen im UNA angezeigten übereinstimmt."],
      ["21", "Ungültige(s) Zeichen", "Mitteilung, dass ein oder mehrere in der Übertragungsdatei verwendete Zeichen nach der definierten Syntax-Ebene im Segment UNB ungültig sind. Das ungültige Zeichen ist Teil der Bezugsebene oder folgt unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["22", "Ungültige(s) Service-Zeichen", "Mitteilung, dass die in der Übertragungsdatei verwendeten Service-Zeichen nicht als Service-Zeichen gültig sind. Diese Zeichen werden entweder im UNA angezeigt oder nach der in UNB angezeigten Syntax-Kennung definiert oder in einer Datenaustauschvereinbarung definiert. Wenn dieser Code in den Segmenten UCS oder UCD verwendet wird, folgt das ungültige Zeichen unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["37", "Ungültige Zeichenart", "Mitteilung, dass ein oder mehrere numerische Zeichen in einem alphabetischen (Gruppen-) Datenelement oder ein oder mehrere alphabetische Zeichen in einem numerischen (Gruppen-)Datenelement verwendet wurden."],
      ["38", "Fehlende Ziffer vor dem Dezimalzeichen", "Mitteilung, dass vor einem Dezimalzeichen nicht eine oder mehrere Ziffern stehen."],
      ["39", "Datenelement zu lang", "Mitteilung, dass die Länge eines empfangenen Datenelements die maximale Länge nach der Datenelementbeschreibung überschreitet."],
      ["40", "Datenelement zu kurz", "Mitteilung, dass die Länge eines empfangenen Datenelements die Mindestlänge nach der Datenelementbeschreibung unterschreitet."]
    ]
  },
  "UCI": {
    "0083": [
      ["4", "Diese Ebene und alle tieferen Ebenen zurückgewiesen", ""],
      ["7", "Übertragung bestätigt (keine Syntaxfehler)", ""]
    ],
    "0085": [
      ["2" , "Syntax-Version oder -ebene nicht unterstützt", "Mitteilung, dass die Syntax-Version und/oder - ebene vom Empfänger nicht unterstützt wird."],
      ["7" , "Empfänger der Übertragungsdatei ist nicht der tatsächliche Empfänger", "Mitteilung, dass der Empfänger der Übertragungsdatei (S003) vom tatsächlichen Empfänger abweicht."],
      ["12", "Ungültiger Wert", "Mitteilung, dass der Wert eines einfachen Datenelements, einer Datenelementgruppe oder eines Gruppendatenelements nicht den entsprechenden Spezifikationen entspricht."],
      ["13", "Fehlt", "Mitteilung, dass ein mit M oder R gekennzeichnetes Service-oder Nutzdaten-Segment, Datenelement, eine Datenelementgruppe oder ein Gruppendatenelement fehlt."],
      ["16", "Zu viele Bestandteile", "Mitteilung, dass das identifizierte Segment zu viele Datenelemente oder die identifizierte Datenelementgruppe zu viele Gruppendatenelemente enthält."],
      ["20", "Zeichen ungültig als Service-Zeichen", "Mitteilung, dass ein im UNA angezeigtes Zeichen als Service-Zeichen ungültig ist."],
      ["21", "Ungültige(s) Zeichen", "Mitteilung, dass ein oder mehrere in der Übertragungsdatei verwendete Zeichen nach der definierten Syntax-Ebene im Segment UNB ungültig sind. Das ungültige Zeichen ist Teil der Bezugsebene oder folgt unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["23", "Unbekannter Absender der Übertragungsdatei", "Mitteilung, dass der Absender der Übertragungsdatei (S002) unbekannt ist (MP-ID bei Empfänger nicht bekannt)."],
      ["25", "Test-Kennzeichen nicht unterstützt", "Mitteilung, dass die Test-Verarbeitung für die angegebene Übertragungsdatei, Nachrichtengruppe oder Nachricht nicht durchgeführt werden konnte."],
      ["26", "Duplikat gefunden", "Mitteilung, dass ein mögliches Duplikat einer früher empfangenen Übertragungsdatei gefunden wurde. Die frühere Übertragung kann zurückgewiesen worden sein (Datenaustauschreferenz des Absenders bei Empfänger bereits bekannt)."],
      ["28", "Referenzen stimmen nicht überein", "Mitteilung, dass die Prüfreferenzen im Segment UNB nicht denen in den Segment UNZ entsprechen."],
      ["29", "Kontrollzähler entspricht nicht der Anzahl empfangender Fälle", "Mitteilung, dass die Anzahl der Nachrichten nicht der im Segment UNZ angegebenen Anzahl entspricht."],
      ["32", "Tiefere Ebene leer", "Mitteilung, dass die Übertragungsdatei keine Nachrichten enthielt."]
    ]
  },
  "UCM": {
    "0083": [
      ["4", "Diese Ebene und alle tieferen Ebenen zurückgewiesen", ""]
    ],
    "0085": [
      ["12", "Ungültiger Wert", "Mitteilung, dass der Wert eines einfachen Datenelements, einer Datenelementgruppe oder eines Gruppendatenelements nicht den entsprechenden Spezifikationen entspricht."],
      ["13", "Fehlt", "Mitteilung, dass ein Servicesegment, Datenelement, eine Datenelementgruppe oder ein Gruppendatenelement fehlt."],
      ["16", "Zu viele Bestandteile", "Mitteilung, dass das identifizierte Segment zu viele Datenelemente oder die identifizierte Datenelementgruppe zu viele Gruppendatenelemente enthält."],
      ["21", "Ungültige(s) Zeichen", "Mitteilung, dass ein oder mehrere in der Übertragungsdatei verwendete Zeichen nach der definierten Syntax-Ebene im Segment UNB ungültig sind. Das ungültige Zeichen ist Teil der Bezugsebene oder folgt unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["22", "Ungültige(s) Service-Zeichen", "Mitteilung, dass die in der Übertragungsdatei verwendeten Service-Zeichen nicht als Service-Zeichen gültig sind. Diese Zeichen werden entweder im UNA angezeigt oder nach der in UNB angezeigten Syntax-Kennung definiert oder in einer Datenaustauschvereinbarung definiert. Wenn dieser Code in den Segmenten UCS oder UCD verwendet wird, folgt das ungültige Zeichen unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["26", "Duplikat gefunden", "Mitteilung, dass ein Duplikat einer Nachricht in der zugrundeliegenden Übertragungsdatei gefunden wurde."],
      ["28", "Referenzen stimmen nicht überein", "Mitteilung, dass die Prüfreferenzen im Segment UNH nicht denen im Segment UNT entsprechen."],
      ["29", "Kontrollzähler entspricht nicht der Anzahl empfangender Fälle", "Mitteilung, dass die Anzahl der Segmente nicht der im Segmenten UNT angegebenen Anzahl entspricht."],
      ["39", "Datenelement zu lang", "Mitteilung, dass die Länge eines empfangenen Datenelements die maximale Länge nach der Datenelementbeschreibung überschreitet."]
    ]
  },
  "UCS": {
    "0085": [
      ["13", "Fehlt", "Mitteilung, dass ein mit M oder R gekennzeichnetes Nutzdaten-Segment fehlt."],
      ["15", "Nicht unterstützt an dieser Position", "Mitteilung, dass der Empfänger die Verwendung des Typs von Segment, an der identifizierten Position nicht unterstützt."],
      ["16", "Zu viele Bestandteile", "Mitteilung, dass das identifizierte Segment zu viele Datenelemente oder Datenelementgruppen enthält."],
      ["22", "Ungültige(s) Service-Zeichen", "Mitteilung, dass die in der Übertragungsdatei verwendeten Service-Zeichen nicht als Service-Zeichen gültig sind. Diese Zeichen werden entweder im UNA angezeigt oder nach der in UNB angezeigten Syntax-Kennung definiert oder in einer Datenaustauschvereinbarung definiert. Wenn dieser Code in den Segmenten UCS oder UCD verwendet wird, folgt das ungültige Zeichen unmittelbar dem identifizierten Teil der Übertragungsdatei."],
      ["35", "Zu viele Segment-Wiederholungen", "Mitteilung, dass ein Segment zu oft wiederholt wurde."],
      ["36", "Zu viele Segmentgruppen-Wiederholungen", "Mitteilung, dass eine Segmentgruppe zu oft wiederholt wurde. Bemerkung: SG2: Eine Gruppe von Segmenten, die als Antwort auf ein mit einem oder mehreren Fehlern behaftetes Segment gesendet wird und das ein Bestandteil der im Segment UCM in Segmentgruppe 1 identifizierten Nachricht war. Die SG2 ist anzugeben, wenn der Syntax-Fehler der entsprechenden Nachricht nicht in einem der Segmente UNH oder UNT enthalten war. Zu UCS: Ein Segment, das ein Segment in der Nachricht identifiziert, um anzuzeigen, dass dieses Segment einen Fehler enthält, und zur Identifizierung jedes Fehlers bezogen auf das gesamte Segment. DE0096: Die numerische Zählerposition eines bestimmten Segments innerhalb der empfangenen Nachricht. Die Zählung beginnt mit dem Segment UNH und schließt dieses mit ein. Die Zählung beginnt mit 1. Um ein fehlerhaftes Segment zu kennzeichnen, wird die entsprechende Zählerposition des Segmentes verwendet. Um ein fehlendes Segment zu melden, wird die Zählerposition des zuvor verarbeiteten Segments verwendet, auf dem das fehlende Segment hätte folgen müssen. Eine fehlende Segmentgruppe wird durch das fehlende erste Segment in der Gruppe gekennzeichnet. DE0085: Dieses Datenelement wird nur dann angegeben, wenn das UCD-Segment nicht angegeben werden kann. Es ist der Code zur Anzeige des aufgedeckten Syntax-Fehlers anzugeben. Beispiel: UCS+9+13'"]
    ]
  }
};

// Vereinigung aller DE0085-Codes (Reihenfolge: numerisch).
var uciFehlercodes0085 = [
  ["2" , "Syntax-Version oder -ebene nicht unterstützt", "Mitteilung, dass die Syntax-Version und/oder - ebene vom Empfänger nicht unterstützt wird."],
  ["7" , "Empfänger der Übertragungsdatei ist nicht der tatsächliche Empfänger", "Mitteilung, dass der Empfänger der Übertragungsdatei (S003) vom tatsächlichen Empfänger abweicht."],
  ["12", "Ungültiger Wert", "Mitteilung, dass der Wert eines einfachen Datenelements, einer Datenelementgruppe oder eines Gruppendatenelements nicht den entsprechenden Spezifikationen entspricht."],
  ["13", "Fehlt", "Mitteilung, dass ein mit M oder R gekennzeichnetes Service-oder Nutzdaten-Segment, Datenelement, eine Datenelementgruppe oder ein Gruppendatenelement fehlt."],
  ["15", "Nicht unterstützt an dieser Position", "Mitteilung, dass der Empfänger die Verwendung des Typs von Segment, an der identifizierten Position nicht unterstützt."],
  ["16", "Zu viele Bestandteile", "Mitteilung, dass das identifizierte Segment zu viele Datenelemente oder die identifizierte Datenelementgruppe zu viele Gruppendatenelemente enthält."],
  ["19", "Ungültige Dezimalbeschreibung", "Mitteilung, dass die im Datenelement verwendete Dezimalschreibung nicht mit derjenigen im UNA angezeigten übereinstimmt."],
  ["20", "Zeichen ungültig als Service-Zeichen", "Mitteilung, dass ein im UNA angezeigtes Zeichen als Service-Zeichen ungültig ist."],
  ["21", "Ungültige(s) Zeichen", "Mitteilung, dass ein oder mehrere in der Übertragungsdatei verwendete Zeichen nach der definierten Syntax-Ebene im Segment UNB ungültig sind. Das ungültige Zeichen ist Teil der Bezugsebene oder folgt unmittelbar dem identifizierten Teil der Übertragungsdatei."],
  ["22", "Ungültige(s) Service-Zeichen", "Mitteilung, dass die in der Übertragungsdatei verwendeten Service-Zeichen nicht als Service-Zeichen gültig sind. Diese Zeichen werden entweder im UNA angezeigt oder nach der in UNB angezeigten Syntax-Kennung definiert oder in einer Datenaustauschvereinbarung definiert. Wenn dieser Code in den Segmenten UCS oder UCD verwendet wird, folgt das ungültige Zeichen unmittelbar dem identifizierten Teil der Übertragungsdatei."],
  ["23", "Unbekannter Absender der Übertragungsdatei", "Mitteilung, dass der Absender der Übertragungsdatei (S002) unbekannt ist (MP-ID bei Empfänger nicht bekannt)."],
  ["25", "Test-Kennzeichen nicht unterstützt", "Mitteilung, dass die Test-Verarbeitung für die angegebene Übertragungsdatei, Nachrichtengruppe oder Nachricht nicht durchgeführt werden konnte."],
  ["26", "Duplikat gefunden", "Mitteilung, dass ein mögliches Duplikat einer früher empfangenen Übertragungsdatei gefunden wurde. Die frühere Übertragung kann zurückgewiesen worden sein (Datenaustauschreferenz des Absenders bei Empfänger bereits bekannt)."],
  ["28", "Referenzen stimmen nicht überein", "Mitteilung, dass die Prüfreferenzen im Segment UNB nicht denen in den Segment UNZ entsprechen."],
  ["29", "Kontrollzähler entspricht nicht der Anzahl empfangender Fälle", "Mitteilung, dass die Anzahl der Nachrichten nicht der im Segment UNZ angegebenen Anzahl entspricht."],
  ["32", "Tiefere Ebene leer", "Mitteilung, dass die Übertragungsdatei keine Nachrichten enthielt."],
  ["35", "Zu viele Segment-Wiederholungen", "Mitteilung, dass ein Segment zu oft wiederholt wurde."],
  ["36", "Zu viele Segmentgruppen-Wiederholungen", "Mitteilung, dass eine Segmentgruppe zu oft wiederholt wurde. Bemerkung: SG2: Eine Gruppe von Segmenten, die als Antwort auf ein mit einem oder mehreren Fehlern behaftetes Segment gesendet wird und das ein Bestandteil der im Segment UCM in Segmentgruppe 1 identifizierten Nachricht war. Die SG2 ist anzugeben, wenn der Syntax-Fehler der entsprechenden Nachricht nicht in einem der Segmente UNH oder UNT enthalten war. Zu UCS: Ein Segment, das ein Segment in der Nachricht identifiziert, um anzuzeigen, dass dieses Segment einen Fehler enthält, und zur Identifizierung jedes Fehlers bezogen auf das gesamte Segment. DE0096: Die numerische Zählerposition eines bestimmten Segments innerhalb der empfangenen Nachricht. Die Zählung beginnt mit dem Segment UNH und schließt dieses mit ein. Die Zählung beginnt mit 1. Um ein fehlerhaftes Segment zu kennzeichnen, wird die entsprechende Zählerposition des Segmentes verwendet. Um ein fehlendes Segment zu melden, wird die Zählerposition des zuvor verarbeiteten Segments verwendet, auf dem das fehlende Segment hätte folgen müssen. Eine fehlende Segmentgruppe wird durch das fehlende erste Segment in der Gruppe gekennzeichnet. DE0085: Dieses Datenelement wird nur dann angegeben, wenn das UCD-Segment nicht angegeben werden kann. Es ist der Code zur Anzeige des aufgedeckten Syntax-Fehlers anzugeben. Beispiel: UCS+9+13'"],
  ["37", "Ungültige Zeichenart", "Mitteilung, dass ein oder mehrere numerische Zeichen in einem alphabetischen (Gruppen-) Datenelement oder ein oder mehrere alphabetische Zeichen in einem numerischen (Gruppen-)Datenelement verwendet wurden."],
  ["38", "Fehlende Ziffer vor dem Dezimalzeichen", "Mitteilung, dass vor einem Dezimalzeichen nicht eine oder mehrere Ziffern stehen."],
  ["39", "Datenelement zu lang", "Mitteilung, dass die Länge eines empfangenen Datenelements die maximale Länge nach der Datenelementbeschreibung überschreitet."],
  ["40", "Datenelement zu kurz", "Mitteilung, dass die Länge eines empfangenen Datenelements die Mindestlänge nach der Datenelementbeschreibung unterschreitet."]
];

// Segmentgenauer Nachschlag mit Rückfall auf die Vereinigung.
// Rückgabe: { text, erlaeuterung, quelle } — quelle ist das Segment,
// aus dessen Codeliste der Text stammt, "" wenn der Code in der MIG
// gar nicht geführt wird (dann ist der Absender selbst auffällig).
function contrlFehlereintrag(code, segment, de) {
  var suche = function (liste) {
    for (var i = 0; i < (liste || []).length; i++)
      if (liste[i][0] === String(code)) return liste[i];
    return null;
  };
  var deKey = de || "0085";
  var eigen = suche(((contrlCodelisten || {})[segment || ""] || {})[deKey]);
  if (eigen)
    return { text: eigen[1], erlaeuterung: eigen[2] || "", quelle: segment };
  if (deKey === "0085") {
    var allg = suche(uciFehlercodes0085);
    if (allg)
      return { text: allg[1], erlaeuterung: allg[2] || "", quelle: "" };
  }
  return { text: "", erlaeuterung: "", quelle: null };
}

// Kurzform für die reine Textanzeige (bisherige Aufrufform).
function contrlFehlertext(code, segment, de) {
  return contrlFehlereintrag(code, segment, de).text;
}

if (typeof module !== "undefined")
  module.exports = {
    contrlCodelisten: contrlCodelisten,
    uciFehlercodes0085: uciFehlercodes0085,
    contrlFehlereintrag: contrlFehlereintrag,
    contrlFehlertext: contrlFehlertext,
  };
