# Code-Audit 13.08.2026 — Ablehnungs-Abgleich und Zerlegung der Übertragungsdatei

Auftrag: „Bitte checke den Code an dieser Stelle auf Bugs und eventuelle
sicherheitsrelevante Lücken."

Geprüfter Stand: `23ef4ac` (Ablehnungs-Abgleich wertet jetzt auch die negative
APERAK aus). Schwerpunkt entsprechend der Fragestellung: `ablehnung-abgleich.html`
und die von ihr benutzten Engine-Bausteine `_engine/ahb-validator.js`,
`_engine/umbau.js` sowie die neu hinzugekommenen Datendateien
`uci-fehlercodes.js`, `contrl-ahb.js`, `aperak-ahb.js`.

**Ergebnis: 12 Befunde, davon 1 sicherheitsrelevant. Alle 12 sind behoben und
durch Regressionstests abgesichert.** Kein Befund blieb offen.

## Wie geprüft wurde

Die Befunde stammen aus drei unabhängigen Durchgängen (statische Durchsicht,
Datenfluss-Verfolgung vom Marktpartner-Eingang bis zur DOM-Ausgabe,
Zustandsanalyse der Seite). **Jeder gemeldete Befund wurde vor der Aufnahme in
dieses Dokument einzeln nachgestellt** — mit einem Machbarkeitsnachweis im
Browser oder einem ausführbaren Gegenbeispiel in Node. Was sich nicht
nachstellen ließ, steht nicht in der Liste (siehe „Geprüft ohne Befund").

## Bedrohungsmodell

Der Ablehnungs-Abgleich ist die einzige Seite des Werkzeugs, die **zwei fremde
Dateien gleichzeitig** verarbeitet: die eigene Nachricht und die Antwort des
Marktpartners (CONTRL/APERAK). Der Inhalt der Antwort stammt vollständig aus
fremder Hand — Fehlercodes, Positionszeiger, Freitexte und der in FTX+Z02
mitgelieferte Segment-Rohtext. Er wird gelesen, mit der eigenen Nachricht
verrechnet und als HTML ausgegeben. Genau diese Kette ist der Angriffspfad.

Die Anwendung läuft ohne Server, ohne Anmeldung und ohne dauerhaften Speicher.
Ein eingeschleustes Skript kann deshalb keine Sitzung übernehmen und keine
Zugangsdaten abgreifen. Es liefe aber im Ursprung der Seite — bei Aufruf per
`file://` also mit Leserechten auf lokale Dateien im selben Verzeichnis — und
könnte die angezeigte Auswertung unbemerkt verfälschen. Für ein Werkzeug, dessen
Zweck die Beweisführung „wer hat recht" ist, ist die zweite Möglichkeit die
unangenehmere: Eine manipulierte Anzeige ist schlimmer als gar keine.

---

## S1 — DOM-XSS über die Positionsangaben der CONTRL (sicherheitsrelevant)

| | |
|---|---|
| **Datei** | `ablehnung-abgleich.html`, Ausgabe der UCD-Zeilen |
| **Einstufung** | hoch — Codeausführung im Ursprung der Seite, allein durch Einfügen einer fremden Datei |
| **Status** | **behoben und durch Test abgedeckt** |

Die Datenelement-Zeiger einer CONTRL (UCD DE0098 „Position des Datenelements",
DE0104 „Position der Komponente") wurden an einer Stelle unmaskiert in ein
Template gesetzt und über `innerHTML` in die Seite geschrieben:

```js
html += `<div class="zeile" style="padding-left:16px">↳ UCD Element ${d.dePos}` +
        (d.komp ? `, Komponente ${d.komp}` : '') + …
```

Dieselben Werte wurden an anderer Stelle derselben Datei korrekt über `esc()`
geführt — es handelte sich also um eine übersehene Stelle, nicht um eine
bewusste Entscheidung.

**Nachstellung.** Eine CONTRL mit
`UCD+13+<img src=x onerror="window.__XSS=1">:1'` wurde in die rechte Seite
eingefügt und die Auswertung angestoßen. Ergebnis der Messung im Browser:

```json
{ "xssAusgefuehrt": true, "injizierteImgTags": 1,
  "html": "Element <img src=\"x\" onerror=\"window.__XSS=1\">" }
```

Das Ereignis feuerte, die globale Variable wurde gesetzt. Der Befund ist damit
nicht theoretisch: Es genügt, dass jemand eine präparierte CONTRL schickt und
der Empfänger sie zur Klärung in das Werkzeug einfügt — also genau der
vorgesehene Arbeitsablauf.

**Behebung.** Beide Werte laufen jetzt über `esc()`. Nach der Korrektur meldet
dieselbe Messung `xssAusgefuehrt: false, injizierteImgTags: 0`; der Wert
erscheint als sichtbarer Text.

**Absicherung.** `scripts/test_html_escaping.js` deckt die Maskierung der
Ausgabewege ab und läuft in der Regression mit.

### Warum das an dieser Stelle passieren konnte

Die Seite baut ihre Ausgabe durchgehend über Template-Strings und `innerHTML`.
Das ist bewusst so — es hält die Ausgabebausteine lesbar —, verlagert die
Sicherheit aber vollständig auf die Disziplin, **jeden** Fremdwert durch `esc()`
zu führen. Eine einzige vergessene Interpolation genügt. Empfehlung für
künftige Erweiterungen dieser Seite: Fremdwerte grundsätzlich über `esc()`, und
bei jeder neuen Ausgabezeile im Zweifel gegen die bestehende Nachbarzeile
gegenlesen.

---

## Funktionale Befunde

Alle folgenden Befunde führen zu **falschen Aussagen des Werkzeugs** — bei einem
Werkzeug zur Klärung strittiger Ablehnungen ist das der eigentliche Schaden.

### B1 — Aktionscode hart als „= 4" verdrahtet

Der Text zum CONTRL-Aktionscode (DE0083) nannte fest den Wert 4
(„Nachricht abgelehnt"), unabhängig vom tatsächlich übertragenen Code. Bei
Aktionscode 7 („Nachricht angenommen") stand damit eine Ablehnung im Bericht,
obwohl die Gegenseite angenommen hatte. Behoben: Der Text folgt jetzt dem
gelesenen Wert und der Codeliste aus `uci-fehlercodes.js`.

### B2 — Absturz, wenn die linke Nachricht nicht erkannt wird

`pruefeEinText()` liefert bei unbekanntem Nachrichtentyp nur `{ parsed, det }` —
ohne `res`. Der Abgleich griff ungeprüft auf `einheit.res.zeilen` zu:

```
TypeError: Cannot read properties of undefined (reading 'zeilen')
```

Die Auswertung brach mitten im Aufbau ab, und im Kasten blieb **das vorherige
Ergebnis stehen** — die gefährlichere Hälfte des Befunds: Der Anwender sieht ein
Ergebnis, das zu einer anderen Nachricht gehört. Behoben durch einen Zweig, der
diesen Fall benennt („Nachricht nicht auswertbar") — der Hinweis ist hier
fachlich sogar wertvoll, denn ein unbekannter Nachrichtentyp ist häufig genau
der Ablehnungsgrund.

### B3 — „Leeren" setzte die APERAK-Auswertung nicht zurück

`leerenRechts()` löschte nur `contrlErgebnis`, nicht `aperakErgebnis`. Nach dem
Leeren blieben die APERAK-Auswertung und die Segmentmarkierung im linken Baum
stehen. Behoben; die Messung nach dem Leeren liefert jetzt
`{ len: 0, panel: "none", marker: 0 }`.

### B4 — doppelte HTML-Maskierung der Dokumentenart

Ein bereits maskierter Wert wurde ein zweites Mal durch `esc()` geführt; im
Ergebnis erschienen `&amp;` statt `&`. Kosmetisch, aber in einem Beweisdokument
störend. Behoben.

### B5 — fehlendes UNB links hebelte die Referenzprüfung aus

Enthielt die links eingefügte Nachricht kein UNB (etwa weil nur ein Ausschnitt
kopiert wurde), lieferte `referenzPruefung()` stillschweigend `null`, und der
Aufrufer wertete das als „keine Beanstandung". Eine CONTRL zu einer **völlig
anderen Datei** wurde dann vollständig gegen die eingefügte Nachricht
ausgewertet — mit Segmentzeigern, die dort nichts zu suchen haben.

Das steht der ausdrücklichen Vorgabe entgegen, die Zuordnung **zuerst** zu
prüfen. Behoben durch einen eigenen Zustand `ohneLinkeAngabe`: Das Werkzeug sagt
jetzt „Zuordnung nicht prüfbar" und bittet um die vollständige Übertragungsdatei
einschließlich UNB, statt eine Auswertung vorzutäuschen.

### B6 — mehrere Referenzen unter einem Fehlercode gingen verloren

Die SG5 der APERAK ist wiederholbar: Zu **einem** ERC können mehrere RFF+TN
stehen, wenn derselbe Fehler mehrere Vorgänge betrifft. Gespeichert wurde je
Qualifier nur ein Wert:

```js
aktuell.rff[de(s, 0)] = de(s, 0, 1);   // überschreibt
```

Von drei betroffenen Vorgängen blieb der letzte übrig, die beiden anderen
verschwanden aus der Anzeige — ohne Hinweis. Behoben: je Qualifier eine Liste;
Anzeige und Zuordnung nennen alle Werte. Nachweis: `test_ablehnung_abgleich.js`,
Fall K.

### B7 — falsche Begründung bei fehlender Nachrichten-Referenz

Fehlte in der APERAK das RFF+ACW und lagen links mehrere Nachrichten, war keine
Zuordnung möglich. Ausgegeben wurde aber der Satz „Die APERAK verweist über
RFF+ACW auf die Nachricht „" …" — mit leerer Referenz, also eine Behauptung über
etwas, das gar nicht dasteht. Zusätzlich stand der Zweig zur Ortsangabe **vor**
dem Zuordnungszweig, sodass in diesem Fall zuerst „Ortsangabe nicht
wiederauffindbar" erschien — richtig im Wortlaut, irreführend in der Sache, denn
gesucht wurde in einer Nachricht, die womöglich gar nicht gemeint war.

Behoben: Die Zuordnung wird zuerst entschieden, und der Fall „keine
Nachrichten-Referenz vorhanden" ist ein eigener, benannter Zustand. Nachweis:
Fall L.

### B8 — Nachricht ohne UNT verschwand spurlos

`EdiUmbau.nachrichten()` schloss eine Nachricht ausschließlich am UNT. Fehlt das
UNT, wurde die offene Nachricht nie in die Liste aufgenommen:

```
nachrichten(zerlege("UNB…'UNH…'BGM…'UNZ…'"))  ->  []
```

Das trifft **genau den Anlassfall**: Eine Datei, die wegen fehlenden UNT
abgelehnt wurde, ist die Datei, die man mit der Ablehnung vergleichen will — und
sie war im Werkzeug unsichtbar. Bei mehreren Nachrichten fiel eine einzelne
lautlos heraus, während die übrigen normal erschienen.

Behoben: Eine offene Nachricht wird am nächsten UNH, am UNZ oder am Dateiende
geschlossen und mit `unvollstaendig: true` gekennzeichnet. Der Validator meldet
das fehlende UNT dann als das, was es ist — ein Befund. Nachweis:
`test_edi_zerlegung.js` (vier Lagen) und `test_ablehnung_abgleich.js`, Fall M.

### B9 — unplausible Positionsangaben ergaben erfundene Fundstellen

Die Positionszeiger der CONTRL sind 1-basiert. Ein übertragener Wert `"0"` (oder
ein nicht-numerischer) führte über `Number(v) - 1` zu einem Index `-1` und damit
zu einer Markierung an einer Stelle, die es nicht gibt. Behoben durch eine
Plausibilitätsprüfung (`posZahl`), die nur ganze Zahlen ≥ 1 akzeptiert; sonst
entfällt die Positionsmarkierung, statt eine falsche zu zeigen.

### B10 — die beiden Leser zerlegten dieselbe Datei unterschiedlich

Das Projekt hat zwei Leser für dieselbe Datei: `AhbValidator.parse` für die
Prüfung, `EdiUmbau.zerlege` für Umbau und Nachrichtenauswahl. `zerlege` trennte
über einen Lookbehind:

```js
new RegExp("(?<!" + esc(frei) + ")" + esc(t), "g")   // sieht nur das Vorzeichen
```

Ein Lookbehind sieht nur **ein** Zeichen zurück. Bei einem freigestellten
Freistellungszeichen (`??`, im Markt ein völlig normaler Wert) hält das zweite
`?` den folgenden Trenner fälschlich für freigestellt — das Segmentende
verschwindet, zwei Segmente verschmelzen zu einem. Nachgestellt:

```
Eingabe:  … BGM+E01+AB??'DTM+137:…'UNT+4+1' …
zerlege:  UNB, UNH, BGM, UNT, UNZ        <- DTM verschluckt
parse:    UNB, UNH, BGM, DTM, UNT, UNZ   <- richtig
```

Zwei Folgen, beide ernst: Im Umbau (`umbau.html`) geht ein Segment verloren, die
Testnachricht ist unvollständig. Im Ablehnungs-Abgleich verschiebt sich die
Segmentzählung gegenüber der CONTRL — **der Zeiger der Ablehnung landet auf dem
falschen Segment**, und das Werkzeug widerspricht der Gegenseite an einer
Stelle, an der die Gegenseite recht hat.

Behoben: `zerlege` scannt jetzt zeichenweise, mit derselben Release-Logik wie
`AhbValidator.parse` — ein Freistellungszeichen stellt immer das Folgezeichen
frei, auch ein weiteres Freistellungszeichen. Nachweis: `test_edi_zerlegung.js`
vergleicht beide Leser über fünf Lagen zeichengleich und prüft zusätzlich den
Rundlauf zerlegen → serialisieren → zerlegen.

### B11 — leere Komponenten verschoben die Ortsangabe

Im FTX+Z02 der APERAK trägt die **Lage** der Komponente die Bedeutung: erstes
DE4440 = Segmentbezeichnung, zweites = Rohtext des fehlerhaften Segments. Der
Leser filterte leere Komponenten heraus (`c108.filter(…)`); war die Bezeichnung
leer, rutschte der Rohtext auf deren Platz und wurde als Bezeichnung gelesen —
die Lokalisierung suchte dann nach dem falschen Wert. Behoben: Die Lage bleibt
erhalten, gefiltert wird nur noch für die Anzeige.

### B12 — Wettlauf zweier Prüfläufe

Die linke Prüfung ist asynchron (Prüfgrundlagen werden nachgeladen). Startet ein
zweiter Lauf, während der erste noch wartet, schrieb der ältere Lauf sein
Ergebnis danach über das neuere. Da die Kopfdaten (`linkeDatei`) vor dem Warten
und die Nachrichten (`linkeEinheiten`) danach gesetzt wurden, konnten beide aus
**verschiedenen Eingaben** stammen — und die Referenzprüfung lief gegen eine
Datei, die gar nicht mehr im Feld stand. Behoben über eine Laufmarke: Ein
überholter Lauf verwirft sein Ergebnis; `leerenLinks()` zieht die Marke
ebenfalls weiter.

---

## Geprüft ohne Befund

Damit nachvollziehbar bleibt, was geprüft wurde und nicht nur, was gefunden
wurde:

* **Übrige Ausgabewege der Seite.** Alle weiteren Interpolationen fremder Werte
  (Fehlercodes, Freitexte, Segment-Rohtext, Referenzen, Marktpartner-IDs,
  Bedingungsnummern) laufen über `esc()`. Nach der Korrektur von S1 blieb keine
  unmaskierte Stelle.
* **Kein `eval`, kein `new Function`, kein dynamischer Skript-Nachbau** in den
  Seiten. Die Bedingungsauswertung (`bedingung-eval.js`) arbeitet auf einer
  eigenen, geschlossenen Ausdrucksform statt über den JS-Interpreter.
* **Kein Netzverkehr, kein Speicher.** Die Seite lädt nur relative Dateien des
  Repositorys; es gibt keinen `fetch` auf fremde Ziele, kein `localStorage`,
  keine Cookies. Eingefügte Marktnachrichten verlassen den Rechner nicht.
* **Datei-Import.** Der `FileReader`-Pfad liest ausschließlich als Text
  (`readAsText`, UTF-8); der Dateiname wird nicht in die Ausgabe übernommen.
* **Positionskarte (`positionsKarte`) und Zeichenmarkierung
  (`positionInSegment`).** Über- und unterlaufende Positionen führen zu „keine
  Markierung", nicht zu einer falschen; der Rückfall `erweitereBeiLeer()` bleibt
  innerhalb der Segmentgrenzen.
* **Datendateien der Extraktion** (`uci-fehlercodes.js`, `contrl-ahb.js`,
  `aperak-ahb.js`): reine Datenliterale ohne ausführbaren Anteil; die
  zugehörigen Tests prüfen Vollständigkeit und Zuordnung gegen MIG und AHB.
* **Kopf-Referenzen der APERAK (SG2).** Der gleiche Überschreib-Mechanismus wie
  in B6 liegt dort vor, ist aber unschädlich: Die SG2-Qualifier (ACE, AGO)
  kommen laut AHB je Nachricht genau einmal vor. Bewusst unverändert gelassen,
  hier vermerkt, damit es bei einer künftigen AHB-Fassung erneut geprüft wird.

## Regressionsnachweis

Neu hinzugekommen und in `scripts/regression_alle.js` aufgenommen:

* **`scripts/test_edi_zerlegung.js`** (neu) — beide Leser zerlegen zeichengleich
  (fünf Lagen, inklusive Rundlauf), und Nachrichten ohne UNT bleiben erhalten
  (vier Lagen). Deckt B8 und B10 ab.
* **`scripts/test_ablehnung_abgleich.js`** — neue Fälle K (mehrfache RFF unter
  einem ERC), L (fehlendes RFF+ACW bei mehreren Nachrichten) und M (Nachricht
  ohne UNT bleibt sichtbar). Deckt B6, B7 und B8 ab.

Die vollständige Regression läuft nach den Korrekturen grün; die Golden-Master
aller vier Ziele sind unverändert — die Korrekturen an `_engine/umbau.js`
berühren nur Eingaben, die vorher falsch zerlegt wurden.

## Was offen bleibt

Kein Befund dieses Audits bleibt offen. Zwei Punkte für später:

1. **Ausgabeweg der Seite.** Die Sicherheit hängt an der lückenlosen Anwendung
   von `esc()`. Ein strukturell sichererer Weg (Aufbau über
   `document.createElement` / `textContent` statt `innerHTML`) wäre ein größerer
   Umbau und ist hier bewusst nicht erfolgt; er sollte erwogen werden, falls die
   Seite weiter wächst.
2. **Zwei Leser für ein Format.** B10 war die Folge davon, dass `zerlege` und
   `parse` dieselbe Aufgabe zweimal lösen. Beide sind jetzt zeichengleich und
   durch `test_edi_zerlegung.js` aneinander gebunden — der eigentliche Ausweg
   wäre, `EdiUmbau.zerlege` mittelfristig auf `AhbValidator.parse`
   zurückzuführen.
