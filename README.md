# EdifactGenerator – Deutscher Energiemarkt (MaKo)

[![CI](https://github.com/sh-prog-edi/EdifactGenerator/actions/workflows/ci.yml/badge.svg)](https://github.com/sh-prog-edi/EdifactGenerator/actions/workflows/ci.yml)

Browserbasiertes Werkzeug zum **Erzeugen** und **Validieren** von EDIFACT-Test­nachrichten
für die Marktkommunikation im deutschen Energiemarkt (BDEW-Anwendungshandbücher). Reines
HTML/JS/CSS ohne Build-Tools und ohne Server – die Seiten laufen per lokalem Webserver oder
direkt per `file://`.

Alle Formulare und Prüfungen sind **maschinell aus den Original-Dokumenten** (AHB, MIG, EBD,
Codelisten, Allgemeine Festlegungen des BDEW-MaKo-Portals) extrahiert; nichts ist von Hand
nachgepflegt.

## Funktionsumfang

- **Generator** je Nachrichtentyp und Prüf-ID: Formular ausfüllen, gültige EDIFACT-Nachricht
  erzeugen (zentrale Engine `_engine/ahb-form-engine.js`). Vorbelegung wie im UTILMD-Vorbild:
  einheitliche 12-stellige Nachrichtenreferenz (UNB/UNH/UNT/UNZ), Tagesdatum, Kalender-Button
  an allen Datumsfeldern, MIG-Feldformat-Hinweise je Freitextfeld.
- **Universeller Validator** (`validator.html`): Nachricht per Drag-&-Drop/Einfügen importieren,
  automatische Erkennung (Typ / Formatstand / Prüf-ID über UNH + RFF+Z13) und Prüfung gegen
  AHB-Bedingungen, MIG-Feldformate, EBD-Antwortcodes, Codelisten und Allgemeine Festlegungen.
  Korrekte Segmente werden **dunkelgrün**, fehlerhafte **rot** dargestellt.
- **Antwortgenerierung**: aus einer importierten Nachricht die passende Antwortmaske
  vorbefüllen (z. B. UTILMD Prüf-ID# 55016 -> 55017) sowie generische Servicenachrichten
  (CONTRL-Empfangsbestätigung/-Syntaxfehler, APERAK-Ablehnung).
- **Umbau Produktivnachricht → Testnachricht** (`umbau.html`): vorhandene Nachricht per
  Drag & Drop oder Einfügen importieren; die Segmente der Nachricht erscheinen als
  editierbare Felder (zunächst ohne Vorbelegung). Die Schaltfläche „Umbau zu
  Testnachricht" überträgt die Werte und setzt dabei Test-Kennzeichen (UNB DE0035),
  aktuellen Erstellungszeitpunkt (UNB S004, DTM+137), neue Datenaustausch-,
  Nachrichten-, Dokumenten- und Vorgangsnummer (wie beim Erstellen einer Testnachricht)
  sowie die erste Zeitscheibe der Verwendungszeiträume je Vorgang auf das Ende des
  aktuellen Tages. Alles bleibt editierbar; gespeichert wird als marktkonforme
  Übertragungsdatei. Der Umbau arbeitet generisch — auch Nachrichten mit unbekannter
  Prüf-ID oder fremdem Typ werden umgebaut. Vorgangszeilen (SG4 IDE) und das
  Prüf-ID-Feld (RFF+Z13) sind gelb hervorgehoben; bei mehreren Vorgängen — auch zu
  unterschiedlichen Prüf-IDs — wählt eine **vorbelegte Checkbox je Vorgang**, welche
  Vorgänge in die Testnachricht wandern (beliebige Teilmengen, jederzeit umkehrbar),
  mit neu gezählten UNT-/UNZ-Zählern.
- **Folgenachrichten über Use-Case-Grenzen** (GPKE Teil 2): aus der Bestätigung der
  Kündigung (55017) in die Anmeldung des Lieferbeginns (55001/55077), aus der Bestätigung
  der Anmeldung (55002/55078) in die nachgelagerten Abrechnungsdaten (55218/55126) und
  Stammdatenänderungen des NB (55175, 55615–55620, 55691 …) — jeweils mit Übernahme der
  in der Quellnachricht vorhandenen Daten (Marktpartner nach Rolle, Marktlokation,
  Termine, Verwendungszeiträume ab Lieferbeginn).
- **Einheitliches Design** (`_engine/edigen.css`) mit global gespeicherter Hell-/Dunkel-Wahl
  (`_engine/theme.js`).

## Schnellstart

```bash
git clone https://github.com/sh-prog-edi/EdifactGenerator.git
cd EdifactGenerator
# Entweder direkt öffnen …
xdg-open index.html            # macOS: open index.html
# … oder über einen lokalen Webserver
python3 -m http.server 8000    # dann http://localhost:8000/
```

Kein Build, keine Abhängigkeiten zur Laufzeit. `index.html` führt über Formatstand, Thema
und Nachrichtentyp zum passenden Generator; `validator.html` prüft eine beliebige
Nachricht ohne Vorauswahl.

Die Skripte unter `scripts/` und `_engine/tests/` (Regression) benötigen Node.js und
Playwright: `npm install playwright && npx playwright install chromium`.

Die Extraktionswerkzeuge unter `werkzeuge/` (Python) werden nur gebraucht, wenn die
Datenbasis aus einer neuen Fassung der BDEW-Dokumente neu erzeugt werden soll — siehe
[`werkzeuge/LIESMICH.md`](werkzeuge/LIESMICH.md). Die Dokumente selbst sind nicht Teil
dieses Repositorys.

## Umsetzungsstand

**Stand: 03.08.2026 – Beta-Version - 1. Testphase**

Umgesetzt in **beiden Formatständen** `202604` (gültig 01.04.–30.09.2026) und `202610`
(gültig ab 01.10.2026), jeweils mit eigener Generator-Seite und Golden-Snapshot:

| Thema | Nachrichtentypen |
|-------|------------------|
| Berichte | IFTSTA, INSRPT |
| Bestellvorgang | ORDCHG, ORDERS, ORDRSP, QUOTES, REQOTE |
| Bewegungsdaten | MSCONS |
| Rechnungsstellung | COMDIS, INVOIC, PRICAT, REMADV |
| Servicenachrichten | APERAK, CONTRL |
| Stammdaten | PARTIN, UTILMD (Strom + Gas), UTILTS |

Das sind **18 Nachrichtentypen je Formatstand**, hinterlegt in **36 Formular-Metas mit
zusammen 975 Prüf-ID-Formularen** (davon UTILMD Strom 187/189, UTILMD Gas 88/89). Der
Validator deckt dieselben Formatstände über die zentrale Registry
(`_engine/daten/validator-registry.js`) ab. Alle Generatoren sind über die Startseite
(`index.html`, MANIFEST) erreichbar; kein Nachrichtentyp ist nur „geplant".

Die Regression läuft grün (siehe [Regression](#regression-versionsfähig)): `domsim` = alle
Prüf-IDs erzeugen fehlerfrei, `golden` = alle vier Ziele zeichengenau gegen den
eingefrorenen Snapshot unverändert, `pruefe_pid_konsistenz.js` = 0 Befunde im Abgleich
gegen AHB, MIG, EBD und Prozess-Meta.

> Bekannte Validator-Limitierung (dokumentiert): Muss-Segmente optionaler Untergruppen werden
> nur innerhalb tatsächlich verwendeter Gruppen geprüft (keine Ketten-Aktivierung). Offene
> Punkte in `docs/OFFENE_ASPEKTE.md`, die Arbeitschronik in
> `docs/Pruefid-Abgleich_20260728.md` und `docs/AHB-Abgleich_202607.md`.
> Wer neu einsteigt, beginnt mit `docs/UEBERGABE.md`: Aufbau, Regressionsstand, offene
> Punkte und die Fallstricke der bisherigen Arbeit auf wenigen Seiten.

### Änderungshistorie

Die vollständige Historie (jüngste zuerst) steht in [`CHANGELOG.md`](CHANGELOG.md)
und wird bei jeder Änderung am Projekt mitgepflegt.

## Ordnerstruktur

Angelehnt an das BDEW-Marktkommunikations-Portal, mit einer zentralen Engine und
formatspezifischen Daten je Regulierungsstand und Sparte:

```
EdifactGenerator/
├── index.html                     Startseite: Formatstand → Thema → Nachrichtentyp → Sparte
├── validator.html                 Universeller Import/Validator + Antwort-Panel
├── umbau.html                     Produktivnachricht -> Testnachricht (generischer Umbau)
├── _engine/                       ZENTRALE Engine (formatübergreifend, einmal gepflegt)
│   ├── ahb-form-engine.js         Formular-Engine: Formular + EDIFACT-Nachricht aus Formular-Meta
│   ├── ahb-validator.js           Parser + Validierung (AHB / MIG / EBD / Codelisten / AF)
│   ├── import-pruefung.js         Gemeinsame Importprüfung für Masken und Validator
│   ├── generator.js               Kuratierte UTILMD-Masken: Formularaufbau + Erzeugung
│   ├── antwortcode-auswahl.js     EBD-Antwortcodes: Cluster- und Prüfschritt-gerechte Auswahl
│   ├── folgenachrichten.js        Folgeschritte des Geschäftsprozesses vorbefüllen
│   ├── bedingung-hilfe.js         Fragezeichen-Symbol mit Klartext zu jeder AHB-Bedingung
│   ├── _segment-registry.js       Universelle Segment-/Rahmenregeln (UNB/UNH/UNT/UNZ, DTM …)
│   ├── _segment-struktur.js       Strukturprofile je Segment (Elemente/Komponenten)
│   ├── edigen.css / theme.js      Gemeinsames Design, globales Theme (hell/dunkel)
│   ├── kalender.js                Kalenderblatt der Datumsfelder (selbst positioniert)
│   ├── layout.js                  Spaltenhöhe an den sichtbaren Bildschirm binden
│   ├── nachricht-speichern.js     Übertragungsdatei nach den Allgemeinen Festlegungen 2.12
│   ├── daten/                     Formatübergreifende Datenbasis:
│   │   ├── validator-registry.js  Registry (Typ/Formatstand/Prüf-ID → Meta-Pfad + Seite)
│   │   ├── mig-formate.js         Feldformate je Segment + Datenelement
│   │   ├── sts-struktur.js        Aufbau des STS-Segments je Nachricht (Gruppen C601/C555/C556)
│   │   ├── codelisten.js          Codelisten
│   │   ├── ebd-antwortcodes.js    EBD-Antwortcodes mit Cluster (EBD 4.2/4.3)
│   │   ├── ebd-pfade.js           Prüfschritte der Entscheidungsbäume und zwingende Antworten
│   │   ├── prozessketten.js       Geschäftsprozesse für die Folgenachrichten
│   │   ├── af-regeln.js           Allgemeine Festlegungen (GLN-Prüfziffer, UNB↔NAD, Zählungen)
│   │   ├── antwort-mappings.js    Kuratierte Antwort-Zuordnungen
│   │   └── antwort-mappings-generiert.js   Aus der Anwendungsübersicht generierte Zuordnungen
│   └── tests/                     Versionsfähige Regression (harness, domsim, selfvalidate, golden)
├── scripts/                       Regression (Node) und Hilfsskripte
├── werkzeuge/                     Extraktion aus den BDEW-Dokumenten (Python, siehe werkzeuge/LIESMICH.md)
├── docs/                          Dokumentation (Übersicht in docs/README.md)
├── 202604/                        Formatstand JJJJMM (regulatorischer Stand 01.04.2026)
└── 202610/                        Formatstand JJJJMM (regulatorischer Stand 01.10.2026)
    ├── Berichte/                  IFTSTA, INSRPT
    ├── Bestellvorgang/            ORDCHG, ORDERS, ORDRSP, QUOTES, REQOTE
    ├── Bewegungsdaten/            MSCONS
    ├── Rechnungsstellung/         COMDIS, INVOIC, PRICAT, REMADV
    ├── Servicenachrichten/        APERAK, CONTRL
    └── Stammdaten/                PARTIN, UTILMD (Strom + Gas), UTILTS
        └── <Typ>/
            ├── index.html         Generator-Seite (lädt Engine + lokale Daten)
            ├── vollformular.html  Nur UTILMD: ungekürzte AHB-Struktur je Prüf-ID
            ├── pruef-ids/         Formatspezifische Daten:
            │   ├── _format.js         Nachrichtentyp, UNH-Kennung, Codevergabestellen
            │   ├── _form-meta.js      AHB-Struktur je Prüf-ID (Prüfgrundlage für alles)
            │   ├── _bedingungen.js    AHB-Bedingungen mit Klartext und auswertbarer Logik
            │   ├── _prozess-meta.js   nur UTILMD: Vorbelegung je Prüf-ID (Grund, EBD, Antwortcode)
            │   └── <PID>.js           nur UTILMD: kuratierte Segmentliste der Maske
            └── golden/            Golden-Master-Snapshot der erzeugten Nachrichten
```

Warum diese Trennung: **Formatanpassungen** (halbjährlich) betreffen fast nur *Daten*
(Segmentstrukturen, Bedingungen, Codes, PIDs) – die liegen pro Version/Sparte getrennt. Die
**Engine** (Parsing, Erzeugung, generische Prüfmechanik) ist formatübergreifend und wird einmal
zentral gepflegt. Sparte Strom/Gas ist getrennt, da MIG und AHB getrennt vorliegen und sich die
Bedingungen unterscheiden.

## Nutzung

Startseite `index.html` über einen lokalen Webserver öffnen (VS Code „Live Server" oder
`python3 -m http.server`), dann Formatstand → Thema → Nachrichtentyp → Sparte wählen und den
Generator öffnen. Alternativ direkt eine Generator-Seite laden, z. B.
`202610/Stammdaten/UTILMD/Strom/index.html`, oder den `validator.html` zum Prüfen/Beantworten
vorhandener Nachrichten. Die Seiten laden die Engine relativ aus `_engine/` und ihre
formatspezifischen Daten lokal.

## Regression (versionsfähig)

Die Engine bleibt zentral, jede Version prüft sich mit ihren eigenen Daten. Der
Regressionstreiber `scripts/regression_alle.js` fährt alles am Stück — alle vier
Golden-Ziele plus sämtliche Testskripte:

```bash
npm install            # einmalig: Playwright (Version passend zum Browser gepinnt)
npm run smoke          # Node-Kern ohne Browser (< 1 Minute)
npm run regression     # volle Regression inkl. Browser-Tests (~6 Minuten)
npm run golden:update  # Golden-Snapshots NEU einfrieren — nur bei GEWOLLTER Änderung
```

Einzelläufe wie bisher:

```bash
# Ziel wählen (Standard: 202610 UTILMD Strom)
export EDIGEN_TARGET=202604/Stammdaten/UTILMD/Strom

node _engine/tests/domsim.js           # Generator-Regression (UNT-Zähler, Testflag) aller PIDs
node _engine/tests/selfvalidate.js     # Selbstvalidierung (nur leere Muss-Platzhalterfelder erwartet)
node _engine/tests/golden.js           # Golden-Master: erzeugte Nachrichten zeichengenau vs. Snapshot
node _engine/tests/golden.js --update  # Snapshot nach GEWOLLTER Änderung neu einfrieren
node scripts/test_sts_aufbau.js        # STS-Segment: jeder Code an seiner Stelle laut MIG
node scripts/test_ebd_abhaengigkeiten.js  # Antwortcodes: nur, was der Entscheidungsbaum erreicht
node scripts/test_vorgangsnummer.js    # Vorgangsnummer (SG4 IDE): einheitlicher Namensaufbau
node scripts/test_layout_kalender.js   # Eingabemaske und Kalender bleiben im Fenster sichtbar
node scripts/test_nachricht_speichern.js  # Übertragungsdatei: Name und Inhalt marktkonform
node scripts/test_umbau.js             # Produktivnachricht -> Testnachricht (umbau.html)
node scripts/test_validator_komponenten.js  # Komponentenlage und Segmentzähler im Validator
node scripts/pruefe_pid_konsistenz.js  # alle Prüf-IDs gegen AHB, MIG, EBD und Prozess-Meta
```

**Golden-Master + ältere Versionen:** Jede Version hält einen eingefrorenen Snapshot ihrer
erzeugten Nachrichten (`.../golden/messages.json`, deterministisch über festes Datum +
`Math.random`). Ein Regressionslauf jagt alle Versionen gegen die aktuelle zentrale Engine –
ändert ein Engine-Fix versehentlich die Ausgabe einer (auch älteren) Version, schlägt der Test
sofort an. So bleibt die Engine wartbar, ohne alte Versionen unbemerkt zu verändern.

## Neuen Nachrichtentyp / neue Version ergänzen

1. Version-/Themenordner anlegen (bzw. Platzhalter füllen), Sparte Strom/Gas nach Bedarf.
2. Formatspezifische Daten unter `.../<Sparte>/pruef-ids/` ablegen; Bedingungen mit den Skripten
   unter `scripts/` aus dem jeweiligen AHB erzeugen (siehe `docs/BEDINGUNGEN_EXTRAKTION.md`).
3. Generator-Seite `index.html` mit relativen Engine-Pfaden anlegen.
4. Eintrag im `MANIFEST` der Startseite `index.html` ergänzen (`href` = Pfad zur Generator-Seite).
5. Golden-Snapshot erzeugen: `node _engine/tests/golden.js --update`.

**Arbeitskonventionen** (bitte beibehalten): Beim Anlegen einer neuen Generierungsmöglichkeit
wird im selben Schritt der MANIFEST-Eintrag der Startseite gepflegt – ohne ihn ist der Generator
über die Startseite nicht erreichbar. Es wird immer zuerst die aktuell gültige Formatversion
gebaut, dann die zukünftige; gibt es zum Formatwechsel keine neue Version, wird die bisherige in
beide Formatstand-Bäume übernommen und in beiden Auswahlpfaden registriert. Kostenpflichtige
XML-/JSON-Fassungen der BDEW-Dokumente werden nicht verwendet – nur die frei verfügbaren
Fassungen.

## Lizenz

Veröffentlicht unter der [MIT-Lizenz](LICENSE) – © 2026 Steffen Haense. Kurz gefasst: freie
Nutzung, Änderung und Weitergabe unter Beibehaltung des Copyright- und Lizenzhinweises; ohne
Gewährleistung.

### Inhalte des BDEW

Die Formulare, Bedingungen, Codelisten und Prüfregeln sind maschinell aus den
**Anwendungshandbüchern, Nachrichtenbeschreibungen, Entscheidungsbaum-Diagrammen und
Codelisten des BDEW** abgeleitet, die auf dem MaKo-Portal frei zugänglich sind
(informatorische Lesefassungen). Dabei werden auch Textbausteine übernommen —
Bedingungstexte, Codebezeichnungen und die Fragen der Entscheidungsbäume.

Diese Inhalte unterliegen den Rechten des BDEW und stehen **nicht** unter der MIT-Lizenz;
sie ist die Lizenz des Codes dieses Repositorys. Die Original-Dokumente selbst
(PDF/DOCX) sind nicht Teil des Repositorys, kostenpflichtige XML-/JSON-Fassungen werden
nicht verwendet. Wer das Repository nachnutzt oder weiterverbreitet, sollte die
Nutzungsbedingungen des BDEW für die jeweilige Fassung prüfen.

### Abhängigkeit von der Zugänglichkeit der BDEW-Dokumente

Dieses freie Projekt **steht und fällt mit der Zugänglichkeit der vom BDEW frei
bereitgestellten Dokumente** — in erster Linie der maschinell gut auswertbaren
**DOCX-Lesefassungen**, aus denen die gesamte Datenbasis (Formulare, Bedingungen,
Feldformate, Entscheidungsbäume, Codelisten) erzeugt wird. Sollten künftige Fassungen nur
noch als PDF erscheinen und diese für eine verlässliche maschinelle Extraktion zu schlecht
auslesbar sein, kann die Datenbasis für neue Formatstände **im schlechtesten Fall nicht
mehr nachgeführt werden**; der jeweils letzte erfolgreich extrahierte Stand bliebe dann
der Endstand des Projekts.

Die **kostenpflichtigen XML-/JSON-Fassungen** des BDEW sind kein selbstverständlicher
Ausweg: Vor einer etwaigen Nutzung wäre zu prüfen, ob deren Erwerbs- und
Nutzungsbedingungen mit der **MIT-Lizenz** dieses Repositorys vereinbar sind — also ob
aus einem kostenpflichtigen, lizenzrechtlich gebundenen Werk abgeleitete Daten überhaupt
frei nutzbar, veränderbar und weiterverbreitbar bereitgestellt werden dürften. Ist das
nicht der Fall, scheidet dieser Weg für das Projekt in seiner jetzigen, offenen Form aus.

### Erzeugung mit KI-Unterstützung

Code, Datenextraktion und Dokumentation dieses Projekts sind in Zusammenarbeit mit
**Claude (Anthropic)** entstanden: Die fachlichen Vorgaben, die Auswahl der Quellen, die
Prüfung der Ergebnisse und alle Entscheidungen liegen beim Autor, die Umsetzung
überwiegend beim Modell. Jede Änderung ist durch die Regression unter `scripts/` und
`_engine/tests/` abgesichert und in `docs/` protokolliert.

Der Hinweis erfolgt freiwillig, zur Einordnung der Herkunft: Die Transparenzpflichten des
EU-KI-Gesetzes (Art. 50, anwendbar ab 02.08.2026) gelten für Inhalte, die Menschen
unmittelbar wahrnehmen — Text, Bild, Ton, Video — sowie für Systeme, die mit Menschen
interagieren. Quellcode fällt nicht darunter, und die Art der Entstehung eines Programms
ist nicht kennzeichnungspflichtig. Zu beachten bleibt die andere Seite: Ein rein
maschinell erzeugter Output ist nach deutschem und europäischem Urheberrecht mangels
persönlicher geistiger Schöpfung nicht schutzfähig; Schutz kann nur entstehen, soweit
menschliche Auswahl, Anordnung und Bearbeitung prägend sind. Die MIT-Lizenz oben regelt
deshalb vor allem Haftungsausschluss und Nutzungserlaubnis — sie ist keine Zusicherung
darüber, welche Teile urheberrechtlich geschützt sind.

## Mitwirkung

Fehlermeldungen und Beiträge sind willkommen. Zwei Bitten:

1. **Nichts von Hand nachpflegen, was aus den Quellen kommt.** Formulare, Bedingungen und
   Codelisten entstehen aus den BDEW-Dokumenten über die Werkzeuge; Korrekturen gehören in
   die Extraktion, nicht in die erzeugten Dateien (Kopfzeile „Maschinell erzeugt").
2. **Regression mitlaufen lassen.** Vor einem Beitrag `_engine/tests/golden.js`,
   `scripts/pruefe_pid_konsistenz.js` und die betroffenen Testskripte ausführen; eine
   gewollte Änderung der Ausgabe wird mit `golden.js --update` bewusst neu eingefroren und
   in `docs/` begründet.
