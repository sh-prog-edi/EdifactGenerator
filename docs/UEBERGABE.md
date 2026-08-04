# Arbeitsstand / Übergabe

Stand: 04.08.2026 · Projekt: **EdifactGenerator** · Auftraggeber: Steffen Haense

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
Antwort- und Folgenachrichten, Umbau Produktivnachricht → Testnachricht. Alle
Prüfgrundlagen sind **maschinell aus den frei verfügbaren Originaldokumenten** gelesen;
kostenpflichtige XML-/JSON-Fassungen werden nicht verwendet.

## 2. Verbindliche Konventionen des Auftraggebers

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

## 3. Aufbau in Kurzform

```
_engine/            zentrale Engine + daten/ (Prüfgrundlagen) + tests/ (Golden, domsim, selfvalidate)
<Formatstand>/<Thema>/<Typ>/   je Nachrichtentyp eine Seite + pruef-ids/_form-meta.js
scripts/            Regression (Node/Playwright), Paket-Prüfung, Hilfsskripte
werkzeuge/          Extraktion aus den BDEW-Dokumenten (Python) — werkzeuge/LIESMICH.md
docs/               Arbeitsprotokoll, Statusdokumente, offene Punkte, Umbauplan, dieses Dokument
.github/workflows/  CI (Smoke je Push, volle Regression auf main/wöchentlich) und Release (Tag → ZIP)
```

Die **Wissensdatenbank** (Originaldokumente, Spiegel `mirror/…`, `regelwerk/`) liegt
außerhalb des Repositorys; die Extraktionsskripte erwarten sie im Arbeitsordner oberhalb
des Repos (übersteuerbar per `EDIGEN_ARBEITSORDNER`). Zur Vollständigkeit und zum
Reproduktionsweg der FV2610-Quellen: Protokoll Abschnitt 7.

**Zwei Wege zum Formular** (bewusst, offener Punkt F): Die vier kuratierten UTILMD-Masken
führen eigene Segmentlisten je Prüf-ID, alle übrigen Seiten arbeiten allein mit
`_form-meta.js`. Die Zusammenführung ist Phase 2 des Umbauplans.

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

## 6. Offene Punkte

Fachlich: [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md) (A–F), als GitHub-Issues vorbereitet
in [`ISSUES_VORLAGEN.md`](ISSUES_VORLAGEN.md) — der wirksamste nächste fachliche Schritt
ist **A (externe Validierungs-Absicherung)**, dafür werden echte Beispielnachrichten
oder ein Fremdvalidator gebraucht (Beschaffung: Auftraggeber). Strukturell: Phasen 2–5
des [Umbauplans](NEUSTRUKTURIERUNG_PLAN_20260804.md); als Nächstes **Phase 2**
(ein Formularweg — kuratierte Maske als Sicht auf die Engine, 553 `<PID>.js` und
`generator.js` entfallen, 114 fachliche Befunde als Entscheidungsliste).

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
