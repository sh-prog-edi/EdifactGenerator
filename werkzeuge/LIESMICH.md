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

## Reihenfolge

```bash
python3 werkzeuge/extrahiere_alle.py            # AHB beider Formatstände -> ahbdaten/
python3 werkzeuge/baue_form_meta.py             # _form-meta.js je Generator-Ordner   (!)
python3 werkzeuge/teile_sts_positionen.py       # STS-Datenelemente auf ihre Position
python3 werkzeuge/saeubere_beschreibungen.py    # Bezeichnungen aus der Anwendungsübersicht
python3 werkzeuge/ergaenze_zeitscheiben.py      # Verwendungszeiträume in UTILMD-Regeldateien
python3 werkzeuge/repariere_bedingungen.py      # idempotent
python3 werkzeuge/ergaenze_bedingungstexte.py
python3 werkzeuge/korrigiere_prozess_meta.py    # Prozess-Meta gegen AHB und EBD
python3 werkzeuge/baue_prozessketten.py         # Folgenachrichten
```

> **(!) `baue_form_meta.py` überschreibt alle 36 `_form-meta.js`.** Es hat einmal die
> Zeitscheiben-Ergänzungen in 31 Prüf-IDs gelöscht. Strukturelle Nachbesserungen deshalb
> immer als eigenes Nachbearbeitungsskript fahren (Vorbild: `teile_sts_positionen.py`),
> nie in den Generator einbauen. Nach jedem Lauf die Regression fahren.

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

## Hinweis nach dem Feldauswahl-Umbau (04.08.2026)

Die kuratierten Regel-Einzeldateien `pruef-ids/<PID>.js` und die `_pid-registry.js`
existieren nicht mehr — die Regeln liegen je Ziel in `pruef-ids/_regeln.js`
(Datendatei, `ahbRulesByPrufId`). Nachbearbeitungsskripte, die bisher die
Einzeldateien beschrieben (`aktualisiere_utilmd_regeln.py`, `ergaenze_zeitscheiben.py`,
`ergaenze_bedingungstexte.py`, `teile_sts_positionen.py`, `saeubere_beschreibungen.py`),
müssen vor dem nächsten Extraktionslauf auf die Datendatei umgestellt werden —
eingeplant für die Pipeline-Formalisierung (Umbauplan Phase 4).

