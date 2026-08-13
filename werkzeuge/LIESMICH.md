# Extraktionswerkzeuge

Stand: 02.08.2026

Diese Python-Skripte erzeugen die Datenbasis des EdifactGenerators **maschinell aus den
Originaldokumenten** des BDEW (AHB, MIG, EBD, Codelisten, Allgemeine Festlegungen,
Anwendungsübersicht). Sie laufen nicht im Browser und werden für die Benutzung des
Generators nicht gebraucht — sie liegen hier, damit jede Angabe im Werkzeug bis zu ihrer
Quelle nachvollziehbar bleibt und eine neue Dokumentfassung ohne Handarbeit einfließen kann.

## Voraussetzungen

* Python 3.11
* `python-docx`, `pdfplumber`, `ebdamame`, `kohlrahbi` (nur für den Abgleich)
* Die BDEW-Dokumente im Spiegel `eem/edi_energy_de/<FV>/` bzw. in der Wissensdatenbank.
  **Die Dokumente selbst gehören nicht in dieses Repository** (siehe `.gitignore`) — sie
  sind beim BDEW zu beziehen.

## Arbeitsordner

Die Skripte erwarten **den Ordner oberhalb des Repositorys** als Arbeitsverzeichnis und
sprechen von dort aus mehrere Geschwisterordner an:

```
<Arbeitsordner>/
├── eem/edi_energy_de/<FV>/     Spiegel der Originaldokumente (DOCX/PDF)
├── ahbdaten/                   Zwischenergebnisse der Extraktion (JSON)
└── edigen/EdifactGenerator/    dieses Repository
    └── werkzeuge/              diese Skripte
```

Aufruf also z. B. `python3 edigen/EdifactGenerator/werkzeuge/extrahiere_alle.py`
bzw. — wie in der Chronik notiert — `python3 werkzeuge/…` aus einem Ordner, in dem
`werkzeuge/` verlinkt ist.

## Reihenfolge — als Pipeline (Umbauplan Phase 4)

Der komplette Extraktionslauf fährt über **`werkzeuge/pipeline.py`** am Stück und in
erzwungener Reihenfolge; dahinter läuft der Registry-Neubau und die Regression:

```bash
python3 werkzeuge/pipeline.py                    # kompletter Lauf + Smoke
python3 werkzeuge/pipeline.py --volle-regression # … mit voller Regression
python3 werkzeuge/pipeline.py --ab ergaenze_zeitscheiben   # Teil-Lauf ab Schritt
python3 werkzeuge/pipeline.py --nur-pruefen      # nur Zeitscheiben-Bestand + Smoke
```

Die Einzelschritte in Pipeline-Reihenfolge (weiterhin auch einzeln lauffähig):

```bash
python3 werkzeuge/extrahiere_alle.py            # AHB beider Formatstände -> ahbdaten/
python3 werkzeuge/baue_form_meta.py             # _form-meta.js je Generator-Ordner   (!)
python3 werkzeuge/teile_sts_positionen.py       # STS-Datenelemente auf ihre Position
python3 werkzeuge/saeubere_beschreibungen.py    # Bezeichnungen aus der Anwendungsübersicht
python3 werkzeuge/aktualisiere_utilmd_regeln.py # Feldauswahl (_regeln.js) gegen AHB
python3 werkzeuge/ergaenze_zeitscheiben.py      # Verwendungszeiträume in _regeln.js
python3 werkzeuge/repariere_bedingungen.py      # idempotent
python3 werkzeuge/ergaenze_bedingungstexte.py
python3 werkzeuge/korrigiere_prozess_meta.py    # Prozess-Meta gegen AHB und EBD
python3 werkzeuge/baue_prozessketten.py         # Folgenachrichten
python3 scripts/baue_validator_registry.py      # Registry folgt der neuen Meta
```

> **(!) `baue_form_meta.py` überschreibt alle 36 `_form-meta.js`.** Es hat einmal die
> Zeitscheiben-Ergänzungen in 31 Prüf-IDs gelöscht. Strukturelle Nachbesserungen deshalb
> immer als eigenes Nachbearbeitungsskript fahren (Vorbild: `teile_sts_positionen.py`),
> nie in den Generator einbauen. Die Pipeline sichert das zusätzlich ab: Sie hält vor
> dem Lauf fest, welche Prüf-IDs Zeitscheiben-Felder führen, und bricht ab, wenn die
> Menge danach geschrumpft ist. Nach jedem Lauf die Regression fahren.

## Entscheidungsbaum-Diagramme (EBD)

```bash
# blockweise lesen — ebdamame öffnet das Dokument je Schlüssel neu
python3 werkzeuge/ebd_docx_leser.py --stand 202604 --von 0 --bis 25 --ziel teil_0.json
python3 werkzeuge/fuege_ebd_teile.py            # Teilergebnisse zusammenführen
python3 werkzeuge/baue_ebd_daten.py             # -> ebd-antwortcodes.js + ebd-pfade.js
python3 werkzeuge/ebd_baum_bericht.py           # lesbare Aufschlüsselung je Kapitel
```

Zwei Eigenheiten sind hier wichtig:

* **Zeitgrenze je Block.** E_0406 und E_0407 bringen die Konvertierung der aktuellen
  ebdamame-Fassung zum Stillstand; ohne Grenze läuft der Lauf fest. Ihre Antwortcodes
  stammen deshalb aus der letzten vollständigen Auswertung (`ahbdaten/ebd_nachtrag.json`),
  eine Baumstruktur liegt für sie nicht vor.
* **Zwingende Antworten statt aller Wege.** Je Antwortcode wird nicht jeder Pfad
  gespeichert — deren Zahl wächst exponentiell (ein erster Versuch erzeugte 1,6 GB) —,
  sondern die Schnittmenge aller Wege, ermittelt über eine **Dominator-Analyse**: Ein
  Schritt liegt auf jedem Weg zu einem Code, wenn der Code unerreichbar wird, sobald man
  den Schritt ausspart. Linear statt kombinatorisch und bewusst konservativ.

## Die Skripte im Einzelnen

### AHB lesen

| Datei | Aufgabe |
|---|---|
| `extrahiere_alle.py` | Klammer: bestimmt je AHB-DOCX das Tabellenlayout und ruft den passenden Leser. |
| `tabs_ahb_reader.py` | Klassisches Layout mit tabulatorgetrennten Spalten. |
| `nested_ahb_reader.py` | Verschachtelte Tabellen (ab FV2604/FV2610), liest über das Roh-XML. |
| `verifikation.py`, `vergleich.py`, `pruef_tabs.py` | Abgleich der eigenen Leser gegen die kohlrahbi-Referenz, mit Klassifikation jeder Abweichung. |

### Generator-Daten erzeugen

| Datei | Aufgabe |
|---|---|
| `baue_form_meta.py` | Formular-Meta je Generator-Ordner (siehe Warnung oben). |
| `saeubere_beschreibungen.py` | Bezeichnungen je Prüf-ID aus der Anwendungsübersicht, ohne Trennartefakte. |
| `teile_sts_positionen.py` | Ordnet die Datenelemente der STS-Segmente ihrer Position zu (C556 mehrfach). |
| `lies_sts_struktur.py` | Liest den Aufbau des STS-Segments aus den MIG-DOCX → `sts-struktur.js`. |
| `lies_nad_aufbau.py` | Liest den qualifierabhängigen NAD-Aufbau (benutzte Gruppen, Wiederholungen je DE3035-Qualifier) aus den MIG-Segmentlayouts → `nad-aufbau.js`. |
| `lies_contrl_fehlercodes.py` | Liest die CONTRL-Codelisten DE0083/DE0085 **je Segment** (UCI/UCM/UCS/UCD) aus dem MIG CONTRL → `uci-fehlercodes.js`. Ersetzt die frühere handgepflegte Teilliste (Protokoll Abschnitt 74). |
| `lies_contrl_ahb.py` | Liest die tabellarische Darstellung des AHB CONTRL → `contrl-ahb.js`: Zulässigkeit der Codes **je Anwendungsfall**, AHB-Status samt Bedingungen je Segment/Segmentgruppe/DE und die Fließtextregeln zu einzelnen Fehlercodes (Protokoll Abschnitt 75). |
| `ergaenze_zeitscheiben.py` | Verwendungszeitraum (SG6 RFF + DTM+Z25/Z26) in den UTILMD-Regeldateien. |
| `aktualisiere_utilmd_regeln.py` | Gleicht die kuratierten UTILMD-Regeldateien gegen den AHB ab. |
| `korrigiere_prozess_meta.py` | Prozess-Meta (Transaktionsgrund, EBD-Nummer, Antwortcode) gegen AHB und EBD. |
| `baue_prozessketten.py` | Folgenachrichten je Prüf-ID samt übernehmbarer Felder. |

### Bedingungen

| Datei | Aufgabe |
|---|---|
| `bedingungen.py` | Wertet AHB-Bedingungen so weit aus, dass Formularblöcke geschaltet werden können. |
| `repariere_bedingungen.py` | Behebt unmaskierte Zeilenumbrüche in `_bedingungen.js` (Sommer-/Winterzeit-Tabellen). |
| `ergaenze_bedingungstexte.py` | Sorgt dafür, dass zu jedem angezeigten Verweis `[nn]` auch der Klartext vorliegt. |

### Entscheidungsbäume

| Datei | Aufgabe |
|---|---|
| `ebd_docx_leser.py` | EBD aus der DOCX über **ebdamame**: Antwortcodes mit Hinweistext und Cluster, Prüfschritte, Verzweigungen, zwingende Antworten je Code. |
| `ebd_pdf_leser.py` | Ergänzt die Kapitel, die ebdamame nicht konvertiert — die reinen Codelisten der Servicenachrichten. |
| `fuege_ebd_teile.py` | Führt die Teilergebnisse der blockweisen Extraktion zusammen. |
| `baue_ebd_daten.py` | Erzeugt `_engine/daten/ebd-antwortcodes.js` und `ebd-pfade.js`. |
| `ebd_baum_bericht.py` | Lesbare Aufschlüsselung: je Kapitel eine Datei (Markdown und JSON), Sammelfassungen je Gruppe, Übersicht, Gesamtfassung. |

## Nach jedem Lauf

Die Regression fahren — sie deckt genau die Fehler auf, die eine Neuextraktion einschleppt:

```bash
node scripts/pruefe_pid_konsistenz.js
node _engine/tests/golden.js            # Abweichungen zuerst lesen, dann ggf. --update
node scripts/test_utilmd_seiten.js
node scripts/test_engine_pages.js
```

## Feldauswahl-Datenschicht (seit 04.08.2026)

Die kuratierten Regel-Einzeldateien `pruef-ids/<PID>.js` und die `_pid-registry.js`
existieren nicht mehr — die Regeln liegen je Ziel in `pruef-ids/_regeln.js`
(Datendatei, `ahbRulesByPrufId`). Die Nachbearbeitungsskripte
(`aktualisiere_utilmd_regeln.py`, `ergaenze_zeitscheiben.py`,
`ergaenze_bedingungstexte.py`) sind auf die Datendatei umgestellt; gelesen und
geschrieben wird über **`werkzeuge/regeln_io.py`** — es serialisiert über Node im
Format des Migrators (`scripts/baue_pid_regeln.js`), damit kein Format-Rauschen
in die Git-Historie gerät (Selbsttest: `python3 werkzeuge/regeln_io.py <Repo>`).

## Quellen-Manifest

Welche BDEW-Dokumente der Datenbasis zugrunde liegen (Name, Version, Gültigkeit,
BDEW-MAKO-fileId, Ablage in der Wissensdatenbank), steht maschinenlesbar in
**`docs/QUELLEN_MANIFEST.json`** — samt Zuordnung Formatstand+Nachrichtentyp →
AHB-Version/UNH-Kennung/Datenordner. Grundlage für den nächsten
Formatstand-Wechsel; bei neuen Dokumentfassungen mitpflegen.

