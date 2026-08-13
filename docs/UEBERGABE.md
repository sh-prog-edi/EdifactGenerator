# Arbeitsstand / Übergabe

Stand: 13.08.2026 (Phasen 2–4 abgeschlossen; zuletzt: Sicherheitsaudit Abschnitt 70,
Ablehnungs-Abgleich CONTRL-Modus Abschnitte 71–76, zuletzt CONTRL-Prüfgrundlage aus
MIG und AHB gelesen, Referenzprüfung ergänzt) ·
Projekt: **EdifactGenerator** · Auftraggeber: Steffen Haense

**Quelle der Wahrheit ist das Git-Repository**
(<https://github.com/sh-prog-edi/EdifactGenerator>). Der Einstieg in eine neue Sitzung:
`git log --oneline -15`, dann [`CHANGELOG.md`](../CHANGELOG.md), dann dieses Dokument.
Die fachliche Chronik steht in [`Pruefid-Abgleich_20260728.md`](Pruefid-Abgleich_20260728.md)
(nummerierte Abschnitte je Auftrag), die offenen Punkte in
[`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md), der Umbauplan in
[`NEUSTRUKTURIERUNG_PLAN_20260804.md`](NEUSTRUKTURIERUNG_PLAN_20260804.md).

---

## 1. Was das Projekt ist

Ein **browserbasiertes Werkzeug ohne Bauwerkzeug** (reines HTML/JS/CSS, per `file://`
lauffähig) zum Erzeugen und Validieren von EDIFACT-Testnachrichten des deutschen
Energiemarkts (BDEW-MaKo): 18 Nachrichtentypen in zwei Formatständen (`202604` bis
30.09.2026, `202610` ab 01.10.2026), 975 Prüf-ID-Formulare, universeller Validator,
Antwort- und Folgenachrichten, Umbau Produktivnachricht → Testnachricht, sowie ein
Ablehnungs-Abgleich (abgelehnte Nachricht gegen negative CONTRL, `ablehnung-
abgleich.html`, Abschnitte 71–76). Alle Prüfgrundlagen sind **maschinell aus den frei
verfügbaren Originaldokumenten** gelesen; kostenpflichtige XML-/JSON-Fassungen werden
nicht verwendet.

## 2. Verbindliche Konventionen des Auftraggebers

- **„Beispielhaft" heißt „alle Prüf-IDs" (13.08.2026, wichtig).** Wenn eine Anfrage
  Formulierungen wie „z. B.", „beispielhaft", „etc." oder „usw." verwendet — meist an
  einer EINEN konkreten Nachricht/PID/Segment aufgehängt —, bezieht sich der Auftrag
  IMMER auf ALLE betroffenen Prüf-IDs, nicht nur auf das genannte Beispiel. Eine
  gemeldete Syntaxprüfungslücke an einem Segment (z. B. „PIA+5+:SRW fehlt die
  OBIS-Kennzahl") ist als Auftrag zu lesen: das zugrundeliegende Muster über ALLE
  Nachrichten/Segmente/Prüf-IDs suchen und dort ebenfalls beheben — nicht nur den
  geschilderten Einzelfall patchen. Ziel: kein Flickenteppich, keine Insellösungen.
  Vorgehen bei einem gemeldeten Einzelfund: (1) Ursache im Code lokalisieren (meist
  eine zu enge Bedingung wie „nur prüfen, wenn Wert vorhanden"), (2) die Korrektur auf
  Ebene der zugrundeliegenden Regel/Funktion ansetzen (nicht PID-spezifisch), (3) mit
  einem Mutations-/Sweep-Lauf über alle Prüf-IDs bzw. der Referenz-Suite bestätigen,
  dass die Korrektur nicht nur den gemeldeten Fall, sondern das ganze Muster abdeckt
  (Vorbild: NAD+MS/MR-Duplikatprüfung und PIA/LIN-DE7140-Fix, Abschnitte 70/72 —
  beide mit 553/553-Sweep bzw. 23/23-Dateien-Referenzlauf nachgewiesen).
- **Kommunikation vollständig auf Deutsch**, einschließlich der internen Überlegungen.
- **Web-Inhalte ausschließlich über WebFetch/WebSearch** abrufen — niemals über curl,
  wget oder HTTP-Bibliotheken.
- **Arbeitsprotokoll fortschreiben**: je Auftrag ein neuer nummerierter Abschnitt in
  `docs/Pruefid-Abgleich_20260728.md` (Befund, Quellenlage, Umsetzung, Nachweis) und
  ein Eintrag in `CHANGELOG.md`.
- **Kostenpflichtige BDEW-Fassungen bleiben außen vor**; Originaldokumente
  (PDF/DOCX/XLSX) gehören nie ins Repository — maschinell erzwungen durch `.gitignore`
  und `scripts/pruefe_paket.js`.
- **Jede Auslieferung ist ein Commit** mit nachgeführter Doku (CHANGELOG, Protokoll,
  dieses Dokument). Ein Release entsteht über einen Git-Tag — die früheren
  ZIP-Konventionen (Namensschema `EdiGen_JJJJMMTT.zip`, Zeitstempel, README-Pflicht,
  GitHub-Fertigkeit) erfüllt jetzt der Release-Workflow automatisch.
- **Echte, anonymisierte Marktnachrichten bleiben strikt lokal**: Ordner
  `/home/claude/referenznachrichten/` (bzw. `EDIGEN_REFERENZEN`) — niemals ins
  Repository committen. Gegenprobe für Validator-Änderungen:
  `EDIGEN_REFERENZEN=/home/claude/referenznachrichten node scripts/referenz_validierung.js --streng`
  (Stand 13.08.2026: 23/23 Dateien, 1491/1491 Einheiten fehlerfrei).

## 3. Aufbau in Kurzform

```
_engine/            zentrale Engine + daten/ (Prüfgrundlagen) + tests/ (Golden, domsim, selfvalidate)
<Thema>/<Typ>[/Sparte]/        je Nachrichtentyp EINE Seite; Formatstand als Parameter
                               (?stand=JJJJMM, Auflösung in _engine/stand.js)
<Formatstand>/<Thema>/<Typ>/   DATEN je Stand: pruef-ids/ (Prüfgrundlagen) + golden/
scripts/            Regression (Node/Playwright), Paket-Prüfung, Hilfsskripte
werkzeuge/          Extraktion aus den BDEW-Dokumenten (Python) — werkzeuge/LIESMICH.md
docs/               Arbeitsprotokoll, Statusdokumente, offene Punkte, Umbauplan, dieses Dokument
.github/workflows/  CI (Smoke je Push, volle Regression auf main/wöchentlich) und Release (Tag → ZIP)
```

Die **Wissensdatenbank** (Originaldokumente, Spiegel `mirror/…`, `regelwerk/`) liegt
außerhalb des Repositorys — **chatübergreifend erreichbar in Google Drive**:
Ordner „Meine Ablage → EdifactGenerator" (Unterordner `Wissensdatenbank/` mit
Inhaltsverzeichnis `Wissensdatenbank_20260802_INHALT.md`, daneben `toolbox/` mit den
modifizierten Hochfrequenz-Werkzeugen und `VERSIONEN.txt` der Basisversionen). Zugriff
per Google-Drive-Connector; große DOCX per `download_file_content` vollständig laden
(der Lese-Weg liefert bei sehr großen Dateien nur einen Ausschnitt). Für lokale
Extraktionsläufe erwarten die Skripte den Bestand im Arbeitsordner oberhalb des Repos
(übersteuerbar per `EDIGEN_ARBEITSORDNER`). Reproduktionsweg der FV2610-Quellen:
Protokoll Abschnitt 7.

**Ein Formularweg** (offener Punkt F, aufgelöst): Die vier kuratierten
UTILMD-Masken sind seit dem Engine-Schritt eine **Sicht auf die zentrale Engine**
(`_engine/utilmd-maske.js`): Die Feldauswahl (welche Felder, Reihenfolge,
Beschriftung) kommt als Datenschicht aus `pruef-ids/_regeln.js`, die Prüfgrundlage
aus `pruef-ids/_form-meta.js`; erzeugt wird ausschließlich über
`AhbFormEngine.generate` — derselbe Weg wie in den Vollformularen. Den früheren
eigenen Erzeugungsweg (`generator.js`) gibt es nicht mehr (Abschnitt 40).

## 4. Regression

```bash
npm install            # einmalig (Playwright 1.56.1, exakt gepinnt)
npm run smoke          # Node-Kern ohne Browser (< 1 Minute)
npm run regression     # volle Regression inkl. Browser-Tests (~6–8 Minuten)
npm run paket          # nur die Paket-/Repo-Prüfung
npm run golden:update  # Golden-Snapshots NEU einfrieren — nur bei GEWOLLTER Änderung
```

Die vier Golden-Ziele sind `2026{04,10}/Stammdaten/UTILMD/{Strom,Gas}`. Die CI fährt
Smoke bei jedem Push/PR und die volle Suite auf `main`, per Hand (workflow_dispatch)
und wöchentlich. Die Selbstvalidierung ist informativ (dokumentierte Befunde, offener
Punkt D) und bricht die Regression nicht.

## 5. Auslieferung

1. Regression grün (`npm run regression`); Golden-Abweichungen erst lesen, dann bewusst
   aktualisieren.
2. Doku nachziehen: `CHANGELOG.md`, Protokoll-Abschnitt, dieses Dokument.
3. Committen (aussagekräftige Nachricht, Deutsch) und pushen.
4. Für ein Release: `git tag -a vX.Y.Z -m "…" && git push origin vX.Y.Z` — der
   Release-Workflow prüft (Paket + Smoke), baut `EdiGen_JJJJMMTT.zip` per `git archive`
   und hängt es an das GitHub-Release.

**Sitzungen ohne Push-Zugriff (Cloud-Sandbox ohne GitHub-Token):** Kann eine Sitzung
nicht direkt auf `origin` pushen, ist die Auslieferung ein Git-Bundle statt eines
direkten Pushs: `git bundle create <pfad>.bundle <letzter-bekannter-commit>..HEAD`,
per Datei-Zustellung an den Auftraggeber übergeben. Einspielen beim Auftraggeber:
`git pull <bundle>.bundle HEAD && git push`. Commit-Nachrichten dieser Sitzungen tragen
zusätzlich die Trailer `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` und
`Claude-Session: <Sitzungs-URL>`.

## 6. Offene Punkte

**Nächster geplanter Schritt: Ablehnungs-Abgleich, APERAK-Modus.** Die neue Seite
`ablehnung-abgleich.html` (Abschnitte 71–73) gleicht eine abgelehnte Nachricht gegen
eine negative CONTRL ab (strukturierter Fehlerzeiger SG1 UCM/SG2 UCS/UCD, Segment-/
DE-Position wird im linken Segmentbaum markiert und gegen den unabhängigen Validator-
Befund geprüft — inklusive einer generischen, AHB-unabhängigen Positionsprüfung als
Rückfallebene). Auf ausdrücklichen Wunsch des Auftraggebers („erst CONTRL, danach
APERAK") ist der APERAK-Modus bewusst noch NICHT umgesetzt: die negative APERAK hat
keinen strukturierten Fehlerzeiger (nur Freitext in FTX+Z02), die Fehlerlokalisierung
müsste über RFF+ACE/AGO/TN (Vorgangs-Eingrenzung) plus Auswertung der Segmente im
eingegrenzten Abschnitt gegen Verwendbarkeit (Kommunikationsrichtung, Quelle:
`_engine/daten/prozessketten.js` → `quelleVon`/`quelleAn` je Prüf-ID) und fachliche
Korrektheit (Codelisten) laufen — nur unterstützend, nie abschließend bestätigend wie
bei CONTRL. Bei Bedarf im Gesprächsverlauf der letzten Sitzung nachlesen (RFF-Feld-
Semantik dort bereits geklärt) oder Protokoll-Abschnitt 71 (Machbarkeitsteil).

**Wichtigster fachlicher Folgepunkt: AHB-Extraktion der Servicenachrichten
(Abschnitte 74/75).** Für APERAK und CONTRL ist die Prüfgrundlage unvollständig: Der
Segmentgruppen-Status (`sgExpr`) fehlt in allen Varianten beider Formatstände, die
Anwendungsfall-Spalten des AHB sind nicht getrennt (202604 APERAK: beide Varianten
identisch extrahiert; CONTRL beide Stände und APERAK 202610: `expr` durchgehend
leer). Der Validator prüft diese vier Nachrichtentypen deshalb nur strukturell,
nicht gegen den AHB — sichtbar als Hinweis „Pflicht nicht entscheidbar: Der
AHB-Status der Segmentgruppe … ist in der Prüfgrundlage nicht hinterlegt". Das ist
bewusst so gebaut (statt falscher harter Fehler, siehe 74.2) und verschwindet von
selbst, sobald die Extraktion nachgezogen ist. Zu beachten: Der
Servicenachrichten-AHB nutzt ein anderes Tabellenlayout als die übrigen Formate,
und Formular-Metas dürfen nach der Fallstrick-Liste (Abschnitt 7) nur über ein
**Nachbearbeitungsskript** geändert werden, nie über den Generator.
Für **CONTRL** ist die Vorarbeit inzwischen erledigt: `werkzeuge/lies_contrl_ahb.py`
liest den AHB-Status samt Bedingungen je Segment/Segmentgruppe/DE (u. a. SG2
„Muss [9]", SG2 UCD „Soll [6]") nach `_engine/daten/contrl-ahb.js` (Abschnitt 75).
Es fehlt nur noch das Nachbearbeitungsskript, das diese Werte als `sgExpr`/`expr`
in die CONTRL-Formular-Metas überträgt. Für APERAK steht die AHB-Auswertung noch aus.

**Ablehnungs-Abgleich, kleiner technischer Folgepunkt (Abschnitt 73):** Die
zeichengenaue Markierung der Fehlerposition (bisher nur im Kasten
"3. Abgleich") zusätzlich direkt im linken Segmentbaum — auf ausdrücklichen
Wunsch des Auftraggebers zurückgestellt, da dafür zuerst die Zeichen-Offset-
Logik aus `positionInSegment()` (`ablehnung-abgleich.html`) in den zentralen
Parser `AhbValidator.parse()` gehoben werden sollte, statt sie ein zweites Mal
nur für diese eine Seite zu pflegen.

Fachlich: [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md) (A–E; F ist mit dem Engine-Schritt
geschlossen), als GitHub-Issues vorbereitet in [`ISSUES_VORLAGEN.md`](ISSUES_VORLAGEN.md)
— der wirksamste nächste fachliche Schritt ist **A (externe Validierungs-Absicherung)**:
Die Referenz-Testsuite dafür steht bereit (`npm run referenz`, Abschnitt 43); es fehlen
die echten Beispielnachrichten oder ein Fremdvalidator (Beschaffung: Auftraggeber,
Checkliste in [`REFERENZNACHRICHTEN.md`](REFERENZNACHRICHTEN.md)). Strukturell: **Phasen 2–4 sind abgeschlossen** (Abschnitte 37–42:
Befunde behoben, Regel-Datenschicht, Engine-Schritt samt 55194-Neubelegung und
Golden-Neubewertung, Formatstand als Parameter, Datenpipeline
`werkzeuge/pipeline.py` samt Zeitscheiben-Schutz und Quellen-Manifest
`docs/QUELLEN_MANIFEST.json`). Es verbleiben die fachlichen Punkte A–E
([Umbauplan](NEUSTRUKTURIERUNG_PLAN_20260804.md), Phase 5). Fachliche Folgearbeit aus
Abschnitt 40: vollständige GDA-Testnachrichten (Kap. 9.5) über
`nutzdaten`-Neubelegung je Prüf-ID — exemplarisch mit 55194 begonnen.

## 7. Fallstricke aus der bisherigen Arbeit

- **Formular-Metas nicht neu generieren.** `baue_form_meta.py` hat einmal alle 36
  `_form-meta.js` überschrieben und Zeitscheiben-Ergänzungen in 31 Prüf-IDs gelöscht.
  Strukturänderungen als **Nachbearbeitungsskript** fahren, nie im Generator-Werkzeug.
- **Golden-Snapshots vor `--update` inhaltlich prüfen** (Zeilenvergleich alt/neu), sonst
  friert man einen Fehler ein.
- **Bibliotheken binden im Test-Harness an `window`**, nicht an den globalen Bereich —
  `EdiAntwortcodes` und Verwandte deshalb doppelt binden.
- **Feld-IDs in der Engine tragen das Präfix `f_`** (`f_${pfad}_${k}`); ohne das Präfix
  greifen die Aktualisierungen nicht mehr.
- **`re.sub` in Python** interpretiert `\n` in Ersetzungstexten als Rückverweis — Ersatz
  als Lambda übergeben.
- **EBD lesen** ist teuer: blockweise mit Zeitgrenze je Block, sonst läuft die
  Konvertierung fest.
- **Keine absoluten Pfade in Skripten** — immer relativ zum Skriptort (`__dirname`,
  `Path(__file__)`); `scripts/pruefe_paket.js` wacht darüber.
