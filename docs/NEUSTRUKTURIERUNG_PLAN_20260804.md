# EdifactGenerator — Neustrukturierungs-Plan

Stand: 04.08.2026 · Basis: `EdiGen_20260803_7_1.zip` (Ist-Analyse in dieser Sitzung verifiziert)
· Ziel: **GitHub-Repo als Quelle der Wahrheit**, Ende des ZIP-Staffellaufs, Abschluss der
begonnenen Konsolidierung.

---

## 1. Ausgangslage (verifiziert am 04.08.2026)

Der Befund vorweg: **Ein Neuaufbau ist nicht nötig.** Der Kern ist bereits datengetrieben —
die Punkte aus der Retrospektive („kein PID-Wissen im Code, alles in Daten") sind zu großen
Teilen umgesetzt. Was fehlt, ist zweierlei: der **Arbeits-Workflow** (Git statt ZIP, Checks
als Code statt Prosa-Konventionen) und der **Abschluss der Konsolidierung**, die das Projekt
in `docs/Pruefid-Abgleich_20260728.md`, Abschnitt 15, selbst schon geplant hat.

**Zahlen zum Ist-Stand** (nachgemessen):

| Merkmal | Befund |
|---|---|
| Umfang | 23 MB · 737 JS · 43 HTML · 34 Python · 16 MD |
| Kern | `_engine/` (zentrale Engine) + `_engine/daten/` (13 Datenmodule) |
| Datenschicht | 36 generierte `_form-meta.js` (975 Prüf-IDs, 18 Typen, 2 Formatstände) |
| Extraktion | `werkzeuge/` (24 Python-Skripte) — reproduzierbar aus BDEW-Originalen |
| Altbestand | 4 kuratierte UTILMD-Masken mit **553 `<PID>.js`-Dateien** + `generator.js` |
| Duplikat | Seitenbäume `202604/` und `202610/` sind HTML-Kopien (nur Daten differieren) |
| Tests | Golden/domsim/selfvalidate + 16 Skripte — **hier grün nachvollzogen** (Golden 187 PIDs, PID-Konsistenz 0 Befunde in 32 Zielen) |
| Versionierung | **kein `.git`**, kein `package.json`, keine CI — Auslieferung als Hand-ZIP |
| Offene Punkte | dokumentiert als A–F in `docs/OFFENE_ASPEKTE.md` |

**Die drei strukturellen Restprobleme**, aus denen sich der Plan ableitet:

1. **Workflow:** ZIP-Übergaben zwischen Chats sind der teuerste und fehleranfälligste Teil
   (Patch-Verluste, Pfad-Reparaturen, Zeitstempel-Konventionen von Hand). → Phasen 0–1.
2. **Zwei Formularwege:** Die 4 kuratierten UTILMD-Masken führen eigene Segmentlisten neben
   der Formular-Meta — abgeglichen, aber doppelt (offener Punkt F, „Schritt 3"). → Phase 2.
3. **Formatstand-Duplikat:** Zwei kopierte Seitenbäume, die bei jeder HTML-Änderung doppelt
   gepflegt werden müssen („Schritt 4"). → Phase 3.

---

## 2. Zielbild

- **GitHub-Repo** (MIT, Lizenz + `.gitignore` liegen schon bereit) ist die einzige Quelle
  der Wahrheit. Jede Sitzung beginnt mit dem Repo-Stand, jede endet mit einem Commit —
  keine Übergabe-ZIPs mehr, keine `UEBERGABE.md`-Staffel zwischen Chats.
- **Ein Formularweg:** Die kuratierte Maske ist eine Sicht auf die Engine
  (Feldauswahl + Reihenfolge + Beschriftung als Daten), `generator.js` und die
  ~581 `<PID>.js` entfallen.
- **Ein Seitenbaum:** Formatstand ist Parameter (`?stand=202610`), nicht Ordnerkopie.
- **Konventionen als Code:** Regression, Paket-Vollständigkeit und README-Stand prüft die
  CI — nicht eine Prosa-Checkliste, die ein Folgechat lesen muss.
- **Auslieferungs-ZIP entsteht maschinell** aus einem Git-Tag (GitHub Release), solange du
  es zusätzlich zum Repo noch möchtest.

---

## 3. Phasenplan

Grundprinzip aller Phasen: **Nach jedem Schritt bleibt die Regression grün.** Kein Schritt
vermischt Workflow-Umbau mit fachlichen Änderungen.

### Phase 0 — Git-Fundament (1 Sitzung)

Der unveränderte Ist-Stand wird versioniert, *bevor* irgendetwas umgebaut wird.

| Schritt | Konkret |
|---|---|
| 0.1 | `git init` im Projektstamm, Initial-Commit des unveränderten Stands, Tag `v0.9.0-beta` (README nennt den Stand „Beta – 1. Testphase") |
| 0.2 | `package.json` anlegen: `npm run regression` fährt die komplette Ziel-Schleife (heute: manuell `EDIGEN_TARGET` je Ziel exportieren), `npm run smoke` eine schnelle Teilmenge ohne Playwright |
| 0.3 | Neues `scripts/regression_alle.js`: iteriert über alle 36 Ziele, fasst Ergebnisse zusammen — ersetzt die Aufruf-Liste aus `docs/UEBERGABE.md`, Abschnitt 4 |
| 0.4 | README (54 KB) aufteilen: Änderungshistorie → `CHANGELOG.md`; README behält Funktionsumfang, Schnellstart, Umsetzungsstand |
| 0.5 | Du legst das GitHub-Repo an (privat reicht zunächst) und pushst den Stand |

**Obsolet werden damit:** ZIP-Zeitstempel-Konvention (`touch`-Regel), das „Paket ohne
nachgeführte README gilt als unvollständig"-Prosa-Gebot (wird in Phase 1 ein CI-Check),
und `paket/` (leer — löschen).

**Prüfschritt:** Frischer Klon auf deinem Rechner → `npm run regression` → grün.

### Phase 1 — Auslieferung und Checks automatisieren (1 Sitzung)

| Schritt | Konkret |
|---|---|
| 1.1 | `scripts/pruefe_paket.js`: die gesammelten Konventionen als ausführbare Checks — Einbindungs-Vollständigkeit (Vorbild: die `bedingung-hilfe.js`-Lücke in 4 UTILMD-Seiten), README/CHANGELOG-Stand vs. letzter Commit, Golden-Snapshots vorhanden je Ziel |
| 1.2 | GitHub Actions CI: bei jedem Push `npm run smoke` + Konsistenzprüfungen; nächtlich oder je PR die volle Regression (Playwright-Tests inklusive, ~10 min) |
| 1.3 | Release-Workflow: Git-Tag `vX.Y.Z` → Action baut `EdiGen_JJJJMMTT.zip` automatisch und hängt es als GitHub-Release-Artefakt an — dein gewohntes ZIP, aber maschinell und immer vollständig |
| 1.4 | `docs/UEBERGABE.md` schrumpft zum „Arbeitsstand"-Dokument (offene Punkte, letzter Fokus); die Rolle „Chat-Übergabe" übernimmt das Repo selbst |
| 1.5 | Offene Punkte A–F zusätzlich als GitHub-Issues anlegen — dann ist der Arbeitsvorrat dort sichtbar, wo gearbeitet wird |

**Prüfschritt:** Ein Test-Tag erzeugt ein Release-ZIP, das entpackt die Regression besteht.

### Phase 2 — Konsolidierung „Schritt 3": ein Formularweg (2–4 Sitzungen)

Das ist der größte fachliche Block — er folgt dem projekteigenen Plan aus
`Pruefid-Abgleich_20260728.md`, Abschnitt 15, und gehört erst NACH Phase 0/1, damit jeder
Teilschritt ein Commit mit grüner CI ist.

| Schritt | Konkret |
|---|---|
| 2.1 | **Die 114 fachlichen Befunde** aus der Selbstvalidierung (Codewerte außerhalb der AHB-Liste ~60, EBD-Nummern ~14, Nutzdaten ohne AHB-Grundlage ~30, Codevergabestelle 3) als Entscheidungsliste (CSV oder Issues) abarbeiten — jede Zeile: Maske erzeugt zu viel ODER Extraktion unvollständig. **Deine fachliche Durchsicht ist hier der Engpass** — ich bereite je Befund Quelle + Vorschlag vor, du entscheidest im Block |
| 2.2 | Kuratierte `<PID>.js` → **Feldauswahl-Daten** (Instanz-Adressen auf der Meta: Segment + Qualifier + Datenelement, plus Reihenfolge/Beschriftung). Rendern und Erzeugen übernimmt `ahb-form-engine.js` (553 Dateien in 4 Ordnern) |
| 2.3 | Prozesswissen bleibt Datenschicht: `_prozess-meta.js`, `_nutzdaten-katalog.js`, `_produktpaket.js`, `ahb-ergaenzungen.js` — entkoppelt von der Erzeugungslogik |
| 2.4 | `generator.js` (56 KB) entfällt zugunsten Engine + schlankem Profil-Modul |
| 2.5 | **Golden-Neubewertung als eigener Arbeitsblock:** alle 189/89 (Strom/Gas) Nachrichten ändern sich mindestens in der Segmentreihenfolge — Diff je PID erzeugen, fachlich durchsehen (stichprobenweise du, systematisch ich gegen AHB), dann Snapshots neu setzen. Nicht nebenbei |

**Ergebnis:** 553 PID-Dateien und `generator.js` gelöscht, offener Punkt F geschlossen,
eine Prüfgrundlage, ein Formularweg. **Prüfschritt:** `pruefe_pid_konsistenz.js` wird
gegenstandslos (ein Weg statt Abgleich zweier Wege) und wird durch einen
Meta-Vollständigkeits-Check ersetzt; Selbstvalidierungs-Befunde sinken um die 114.

### Phase 3 — „Schritt 4": Formatstand als Parameter (1–2 Sitzungen)

Erst nach Phase 2 sinnvoll (so auch der projekteigene Plan).

| Schritt | Konkret |
|---|---|
| 3.1 | Je Nachrichtentyp genau eine Seite; Formatstand über `?stand=202604\|202610`, Datenordner bleiben je Stand getrennt |
| 3.2 | Verweise nachziehen: Startseite, `_pid-registry`, Prozessketten, Folgenachrichten, alle Tests — mechanisch, aber breit; ein Schritt je Nachrichtentyp, jeweils mit grüner Regression committen |
| 3.3 | Golden-Snapshots bleiben je Stand — die Nachrichten selbst ändern sich nicht |

**Ergebnis:** 43 → ~22 HTML-Seiten; ein künftiger Formatstand (202704 …) ist ein neuer
Datenordner plus ein Registry-Eintrag, keine Baumkopie. Die Versions-Zuständigkeitslogik
(`test_version_zustaendigkeit.js`) sichert den Umbau ab.

### Phase 4 — Wissensdatenbank und Datenpipeline (1–2 Sitzungen)

| Schritt | Konkret |
|---|---|
| 4.1 | Das Geschwisterordner-Layout der Werkzeuge (`eem/edi_energy_de/<FV>/`, `ahbdaten/`, Repo) formalisieren: ein `werkzeuge/pipeline.py`, das für einen Formatstand die dokumentierte Reihenfolge (extrahiere_alle → baue_form_meta → Nachbearbeitungen → baue_prozessketten) am Stück fährt und danach die Regression aufruft |
| 4.2 | Quellen-Manifest maschinenlesbar: je BDEW-Dokument Name, Version, Stand, Prüfdatum (die Info steckt heute verstreut in `docs/`) — Grundlage für den nächsten Formatstand-Wechsel |
| 4.3 | Wissensdatenbank bleibt strikt außerhalb des GitHub-Repos (Lizenzlage BDEW): eigener lokaler Ordner oder privates Zweit-Repo; `.gitignore` deckt das bereits ab |
| 4.4 | Absicherung gegen die bekannte Falle „`baue_form_meta.py` überschreibt Nachbearbeitungen": Pipeline erzwingt die Reihenfolge, ein Check vergleicht Zeitscheiben-Felder vor/nach |

### Phase 5 — Fachliche offene Punkte A–E (fortlaufend, priorisiert)

Empfohlene Reihenfolge nach Erkenntnisgewinn:

1. **A — Externe Referenzvalidierung** (wirksamster Schritt, so auch deine eigene Doku):
   echte Beispielnachrichten von Marktpartnern oder ein Fremdvalidator als Gegenprobe.
   Hier bist du am Zug (Beschaffung); ich baue daraus eine Referenz-Testsuite.
2. **B — Interchange-Ebene:** mehrere `UNH…UNT` je `UNB`, optional `UNG/UNE` — betrifft
   Generator, Validator, `nachricht-speichern.js` und Umbau-Werkzeug gemeinsam.
3. **D — Ketten-Aktivierung** der Muss-Segmente optionaler Untergruppen (reduziert die
   verbleibenden Selbstvalidierungs-Befunde von „mehrere hundert" auf echte Aussagen).
4. **E — E_0406/E_0407:** Prüfschritte nachziehen, sobald ebdamame die Fassung verarbeitet
   (oder Hand-Nachtrag nach dem Muster `ebd_nachtrag.json`).
5. **C — Nutzdatentiefe** über `_nutzdaten-katalog.js` ausbauen — nach Bedarf aus der
   Testpraxis, nicht auf Vorrat.

---

## 4. Künftiger Sitzungs-Workflow (ersetzt den ZIP-Staffellauf)

**Variante 1 — verbundener Projektordner (empfohlen):** Du verbindest den lokalen Klon des
Repos über die Desktop-App. Ich arbeite direkt darin, committe nach jedem grünen Schritt;
du pushst zu GitHub (oder die Aufgabe läuft gleich „auf deinem Computer", dann entfällt
auch das Herunterladen von Ergebnissen). Kein Upload, keine Übergabe-Datei — der
Einstieg jeder Sitzung ist `git log` + `docs/UEBERGABE.md` (Arbeitsstand).

**Variante 2 — Cloud-Sitzung ohne Ordner:** Du lädst nur noch *ein* aktuelles ZIP des
Klons hoch (inkl. `.git`), ich arbeite und committe darin und liefere den Stand als ZIP
zurück; du pushst. Das ist der Übergangsmodus — funktional wie bisher, aber mit
Git-Historie statt Datei-Schnappschüssen.

Push aus der Sitzung heraus ist bewusst nicht vorgesehen: Dafür müsstest du mir ein
GitHub-Token in den Chat geben — das gehört nicht in einen Chatverlauf. Der Push bleibt
dein Ein-Kommando-Schritt.

---

## 5. Was bewusst NICHT Teil des Plans ist

- **Kein Rewrite.** Engine, Datenschicht, Extraktion und Tests bleiben; der Plan baut um
  und ab, nicht neu.
- **Kein Wechsel der Datenquelle.** Die Entscheidung „nur frei verfügbare BDEW-Fassungen,
  maschinell extrahiert" steht und bleibt (Open-Source-Werkzeuge wie AHBicht/kohlrahbi
  weiter nur als Abgleich, wie bisher).
- **Kein Build-System.** „Reines HTML/JS ohne Build" ist ein Feature des Projekts —
  npm/Playwright bleiben reine Entwicklungs-/Testabhängigkeiten.

## 6. Nächster konkreter Schritt

Phase 0 passt in eine Sitzung: Ich lege Git-Struktur, `package.json`,
`regression_alle.js` und die README/CHANGELOG-Teilung im aktuellen Stand an, fahre die
volle Regression und liefere dir den push-fertigen Stand. Du brauchst dafür nur ein
leeres GitHub-Repo (Name z. B. `edifact-generator`) — die Klon-URL ersetzt dann auch den
`<repository-url>`-Platzhalter im README-Schnellstart.
