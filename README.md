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
- **Ablehnungs-Abgleich** (`ablehnung-abgleich.html`): die eigene Nachricht und die
  Ablehnung des Marktpartners nebeneinander — links die Nachricht als Segmentbaum,
  in der Mitte die gelesene Antwort, rechts die Auswertung. Bei einer **negativen
  CONTRL** wird der Zeiger (UCS DE0096 / UCD DE0098/DE0104) auf das genaue Segment,
  Datenelement und Zeichen zurückgerechnet, bei einer **negativen APERAK** die
  Ortsangabe (SG5 FTX+Z02) im Rohtext wiedergefunden; der eigene Validator läuft als
  unabhängige Gegenprobe an derselben Stelle. Fehlercodes stammen aus MIG CONTRL,
  AHB CONTRL und AHB APERAK. **Zuerst** wird geprüft, ob die Antwort überhaupt zur
  eingefügten Datei gehört (Datenaustauschreferenz UCI DE0020 bzw. RFF+ACE) — passt
  sie nicht, wird nur das gemeldet.
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
Playwright. Die Playwright-Version ist in der `package.json` **fest gepinnt** (passend
zum mitgelieferten Browser) — deshalb `npm install` ohne Paketnamen:
`npm install && npx playwright install chromium`.

Die Extraktionswerkzeuge unter `werkzeuge/` (Python) werden nur gebraucht, wenn die
Datenbasis aus einer neuen Fassung der BDEW-Dokumente neu erzeugt werden soll — siehe
[`werkzeuge/LIESMICH.md`](werkzeuge/LIESMICH.md). Die Dokumente selbst sind nicht Teil
dieses Repositorys.

## Umsetzungsstand

**Stand: 13.08.2026 – Beta-Version - 1. Testphase**

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

Die Regression läuft grün (siehe [Regression](#regression-versionsfähig)): 42 Läufe —
`domsim` = alle Prüf-IDs erzeugen fehlerfrei, `golden` = alle vier Ziele zeichengenau
gegen den eingefrorenen Snapshot unverändert, `pruefe_pid_konsistenz.js` = 0 Befunde im
Abgleich gegen AHB, MIG, EBD und Prozess-Meta.

Seit Anfang August sind hinzugekommen: die **Feldauswahl-Datenschicht** (die kuratierten
Regeln liegen je Ziel in einer `_regeln.js` statt in Einzeldateien), die **Prüfung
gegen echte, anonymisierte Marktnachrichten** (`npm run referenz`, die Nachrichten selbst
bleiben lokal — siehe `docs/REFERENZNACHRICHTEN.md`), die maschinell gelesenen
**Fehlercodes der Servicenachrichten** (MIG CONTRL, AHB CONTRL, AHB APERAK) und der
**Ablehnungs-Abgleich**.

> Bekannte Validator-Limitierung (dokumentiert): Muss-Segmente optionaler Untergruppen werden
> nur innerhalb tatsächlich verwendeter Gruppen geprüft (keine Ketten-Aktivierung). Offene
> Punkte in `docs/OFFENE_ASPEKTE.md`, die Arbeitschronik in
> `docs/Pruefid-Abgleich_20260728.md` und `docs/AHB-Abgleich_202607.md`.
> Wer neu einsteigt, beginnt mit `docs/UEBERGABE.md`: Aufbau, Regressionsstand, offene
> Punkte und die Fallstricke der bisherigen Arbeit auf wenigen Seiten.
> Der letzte Code-Audit (Bugs und sicherheitsrelevante Lücken) steht in
> `docs/SICHERHEITSAUDIT_20260813.md`.

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
├── ablehnung-abgleich.html        Eigene Nachricht gegen die Ablehnung (neg. CONTRL / APERAK)
├── _engine/                       ZENTRALE Engine (formatübergreifend, einmal gepflegt)
│   ├── ahb-form-engine.js         Formular-Engine: Formular + EDIFACT-Nachricht aus Formular-Meta
│   ├── ahb-validator.js           Parser + Validierung (AHB / MIG / EBD / Codelisten / AF)
│   ├── umbau.js                   Zerlegen/Serialisieren, Nachrichten- und Vorgangsgrenzen
│   ├── import-pruefung.js         Gemeinsame Importprüfung für Masken und Validator
│   ├── utilmd-maske.js            Kuratierte UTILMD-Masken: Feldauswahl-Sicht auf die Engine
│   ├── antwortcode-auswahl.js     EBD-Antwortcodes: Cluster- und Prüfschritt-gerechte Auswahl
│   ├── folgenachrichten.js        Folgeschritte des Geschäftsprozesses vorbefüllen
│   ├── bedingung-hilfe.js         Fragezeichen-Symbol mit Klartext zu jeder AHB-Bedingung
│   ├── _segment-struktur.js       Strukturprofile je Segment (Elemente/Komponenten)
│   ├── stand.js                   Formatstand aus URL-Parameter bzw. Kalender-Zuständigkeit
│   ├── version.js                 Versions-/Standanzeige im Seitenkopf
│   ├── kapitel-sort.js            Kapitelreihenfolge des AHB für Auswahllisten
│   ├── edigen.css / theme.js      Gemeinsames Design, globales Theme (hell/dunkel)
│   ├── kalender.js                Kalenderblatt der Datumsfelder (selbst positioniert)
│   ├── layout.js                  Spaltenhöhe an den sichtbaren Bildschirm binden
│   ├── nachricht-speichern.js     Übertragungsdatei nach den Allgemeinen Festlegungen 2.12
│   ├── daten/                     Formatübergreifende Datenbasis:
│   │   ├── validator-registry.js  Registry (Typ/Formatstand/Prüf-ID → Meta-Pfad + Seite)
│   │   ├── mig-formate.js         Feldformate je Segment + Datenelement
│   │   ├── sts-struktur.js        Aufbau des STS-Segments je Nachricht (Gruppen C601/C555/C556)
│   │   ├── nad-aufbau.js          Qualifierabhängiger NAD-Aufbau laut MIG-Segmentlayout
│   │   ├── codelisten.js          Codelisten
│   │   ├── ebd-antwortcodes.js    EBD-Antwortcodes mit Cluster (EBD 4.2/4.3)
│   │   ├── ebd-pfade.js           Prüfschritte der Entscheidungsbäume und zwingende Antworten
│   │   ├── prozessketten.js       Geschäftsprozesse für die Folgenachrichten
│   │   ├── af-regeln.js           Allgemeine Festlegungen (GLN-Prüfziffer, UNB↔NAD, Zählungen)
│   │   ├── ahb-ergaenzungen.js    Regeln aus dem AHB-Fließtext, die nicht in der Tabelle stehen
│   │   ├── bedingung-eval.js      Auswertbare Form der AHB-Bedingungen (ohne JS-Interpreter)
│   │   ├── uci-fehlercodes.js     CONTRL-Codelisten DE0083/DE0085 je Segment (MIG CONTRL)
│   │   ├── contrl-ahb.js          AHB CONTRL: Zulässigkeit je Anwendungsfall, Status, Coderegeln
│   │   ├── aperak-ahb.js          AHB APERAK: Fehlercodes SG4 ERC, Pflicht-Ortsangaben, Bedingungen
│   │   ├── dokumentenstand.js     Fassung und Gültigkeit der zugrunde liegenden BDEW-Dokumente
│   │   ├── antwort-mappings.js    Kuratierte Antwort-Zuordnungen
│   │   └── antwort-mappings-generiert.js   Aus der Anwendungsübersicht generierte Zuordnungen
│   └── tests/                     Versionsfähige Regression (harness, domsim, selfvalidate, golden)
├── scripts/                       Regression (Node) und Hilfsskripte
├── werkzeuge/                     Extraktion aus den BDEW-Dokumenten (Python, siehe werkzeuge/LIESMICH.md)
├── docs/                          Dokumentation (Übersicht in docs/README.md)
├── .github/workflows/             CI (ci.yml) und Veröffentlichung (release.yml)
├── <Thema>/<Typ>[/Sparte]/        GENERATOR-SEITEN — je Nachrichtentyp genau EINE Seite;
│   ├── index.html                 der Formatstand kommt als URL-Parameter (?stand=JJJJMM,
│   └── vollformular.html          Auflösung in _engine/stand.js). Nur UTILMD Strom und Gas
│                                  führen zusätzlich ein Vollformular (alle AHB-Felder ohne
│                                  kuratierte Feldauswahl). Themen: Berichte (IFTSTA,
│                                  INSRPT), Bestellvorgang (ORDCHG, ORDERS, ORDRSP, QUOTES,
│                                  REQOTE), Bewegungsdaten (MSCONS), Rechnungsstellung (COMDIS,
│                                  INVOIC, PRICAT, REMADV), Servicenachrichten (APERAK, CONTRL),
│                                  Stammdaten (PARTIN, UTILMD Strom + Gas, UTILTS)
├── 202604/                        DATEN des Formatstands 202604 (gültig 01.04.–30.09.2026)
└── 202610/                        DATEN des Formatstands 202610 (gültig ab 01.10.2026)
    └── <Thema>/<Typ>[/Sparte]/
        ├── pruef-ids/             Formatspezifische Daten:
        │   ├── _format.js             Nachrichtentyp, UNH-Kennung, Codevergabestellen
        │   ├── _form-meta.js          AHB-Struktur je Prüf-ID (Prüfgrundlage für alles)
        │   ├── _bedingungen.js        AHB-Bedingungen mit Klartext und auswertbarer Logik
        │   ├── _prozess-meta.js       nur UTILMD: Vorbelegung je Prüf-ID (Grund, EBD, Antwortcode)
        │   └── _regeln.js             nur UTILMD: Feldauswahl-Daten der kuratierten Maske
        └── golden/                Golden-Master-Snapshot der erzeugten Nachrichten
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
`Stammdaten/UTILMD/Strom/index.html?stand=202610`, oder den `validator.html` zum
Prüfen/Beantworten vorhandener Nachrichten. Ohne `?stand=…` gilt die Kalender-Zuständigkeit
der Formatstände (202604 bis 30.09.2026, 202610 ab 01.10.2026). Die Seiten laden die Engine
relativ aus `_engine/` und ihre formatspezifischen Daten aus dem Datenordner des gewählten
Stands.

## Regression (versionsfähig)

Die Engine bleibt zentral, jede Version prüft sich mit ihren eigenen Daten. Der
Regressionstreiber `scripts/regression_alle.js` fährt alles am Stück — alle vier
Golden-Ziele plus sämtliche Testskripte:

```bash
npm install            # einmalig: Playwright (Version passend zum Browser gepinnt)
npm run smoke          # Node-Kern ohne Browser (< 1 Minute)
npm run regression     # volle Regression: 42 Läufe, rund 11 Minuten
npm run golden:update  # Golden-Snapshots NEU einfrieren — nur bei GEWOLLTER Änderung
npm run paket          # Paketprüfung: nichts im Repo, was nicht hineingehört
npm run referenz       # echte (lokale) Referenznachrichten prüfen, siehe docs/REFERENZNACHRICHTEN.md
```

Einzelläufe wie bisher:

```bash
# Ziel wählen (Standard: 202610 UTILMD Strom)
export EDIGEN_TARGET=202604/Stammdaten/UTILMD/Strom

# Je Ziel (vier Ziele: 202604/202610 x UTILMD Strom/Gas)
node _engine/tests/domsim.js           # Generator-Regression (UNT-Zähler, Testflag) aller PIDs
node _engine/tests/selfvalidate.js     # Selbstvalidierung (nur leere Muss-Platzhalterfelder erwartet)
node _engine/tests/golden.js           # Golden-Master: erzeugte Nachrichten zeichengenau vs. Snapshot
node _engine/tests/golden.js --update  # Snapshot nach GEWOLLTER Änderung neu einfrieren

# Node-Tests ohne Browser (laufen im smoke mit)
node scripts/pruefe_paket.js           # keine Originaldokumente/Referenznachrichten im Paket
node scripts/pruefe_pid_konsistenz.js  # alle Prüf-IDs gegen AHB, MIG, EBD und Prozess-Meta
node scripts/test_bedingung_hart.js    # harte vs. bedingte Muss-Klassifikation
node scripts/test_muss_validierung.js  # fehlendes Muss -> Fehler, bedingtes Muss -> Warnung
node scripts/test_sts_aufbau.js        # STS-Segment: jeder Code an seiner Stelle laut MIG
node scripts/test_de_muss_praesenz.js  # Muss-Datenelemente innerhalb vorhandener Segmente
node scripts/test_edi_zerlegung.js     # beide Leser zerlegen zeichengleich; Nachricht ohne UNT
node scripts/test_contrl_codelisten.js # CONTRL-Codelisten DE0083/DE0085 gegen das MIG
node scripts/test_contrl_ahb.js        # AHB CONTRL: Zulässigkeit je Anwendungsfall
node scripts/test_aperak_ahb.js        # AHB APERAK: Fehlercodes und Pflicht-Ortsangaben

# Browser-Tests (Playwright)
node scripts/test_utilmd_seiten.js     # kuratierte UTILMD-Masken
node scripts/test_engine_pages.js      # alle Generator-Seiten laden und erzeugen fehlerfrei
node scripts/test_html_escaping.js     # keine unmaskierten Fremdwerte in der Ausgabe
node scripts/test_edi_escaping.js      # Release-Zeichen in freien Eingabefeldern
node scripts/test_folgenachrichten.js  # Folgeschritte über Use-Case-Grenzen
node scripts/test_vorgangsnummer.js    # Vorgangsnummer (SG4 IDE): einheitlicher Namensaufbau
node scripts/test_abhaengige_segmente.js  # Segmente, die einander bedingen
node scripts/test_antwortcodes.js      # Antwortcode-Auswahl je Prüfschritt
node scripts/test_antwortketten.js     # Antwortnachricht aus importierter Nachricht
node scripts/test_bedingung_hilfe.js   # Klartext zu jeder angezeigten AHB-Bedingung
node scripts/test_ebd_abhaengigkeiten.js  # Antwortcodes: nur, was der Entscheidungsbaum erreicht
node scripts/test_version_zustaendigkeit.js  # Kalender-Zuständigkeit der Formatstände
node scripts/test_zeitscheiben.js      # Verwendungszeiträume (SG6 RFF + DTM+Z25/Z26)
node scripts/test_layout_kalender.js   # Eingabemaske und Kalender bleiben im Fenster sichtbar
node scripts/test_nachricht_speichern.js  # Übertragungsdatei: Name und Inhalt marktkonform
node scripts/test_umbau.js             # Produktivnachricht -> Testnachricht (umbau.html)
node scripts/test_umbau_pidzerlegung.js   # Vorgangsauswahl bei mehreren Prüf-IDs je Nachricht
node scripts/test_validator_komponenten.js  # Komponentenlage und Segmentzähler im Validator
node scripts/test_validator_mehrfach.js   # mehrere Nachrichten in einer Übertragungsdatei
node scripts/test_ablehnung_abgleich.js   # neg. CONTRL / APERAK gegen die eigene Nachricht
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
gebaut, dann die zukünftige; gibt es zum Formatwechsel keine neue Version, werden die Daten der
bisherigen in beide Formatstand-Datenordner übernommen und in beiden Auswahlpfaden registriert
(die Seite selbst existiert seit Phase 3 nur einmal). Kostenpflichtige
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
