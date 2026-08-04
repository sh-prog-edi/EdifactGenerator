# Übergabe / Arbeitsstand

> **Seit 04.08.2026 ist das Projekt ein Git-Repository** (Phase 0 der Neustrukturierung,
> siehe `NEUSTRUKTURIERUNG_PLAN_20260804.md` und Protokoll Abschnitt 35). Quelle der
> Wahrheit ist das Repo (GitHub); der Einstieg in eine neue Sitzung ist `git log`,
> `CHANGELOG.md` und dieses Dokument — nicht mehr ein Übergabe-ZIP. Regression:
> `npm install` einmalig, dann `npm run regression` (voll) bzw. `npm run smoke`.

Stand: 03.08.2026 · Projekt: **EdifactGenerator** · Auftraggeber: Steffen Haense

Dieses Dokument fasst zusammen, was ein neuer Chat wissen muss, um ohne Rückfragen
weiterarbeiten zu können. Die fachliche Chronik steht in
[`Pruefid-Abgleich_20260728.md`](Pruefid-Abgleich_20260728.md) (23 Abschnitte), der
Umsetzungsstand in [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md), das Gesamtbild in der
[README](../README.md).

---

## 1. Was das Projekt ist

Ein **browserbasiertes Werkzeug ohne Bauwerkzeug** (reines HTML/JS/CSS, per `file://`
lauffähig) zum Erzeugen und Validieren von EDIFACT-Testnachrichten des deutschen
Energiemarkts (BDEW-MaKo). Abgedeckt sind **18 Nachrichtentypen in zwei Formatständen**:

| Formatstand | Gültigkeit |
|---|---|
| `202604` | 01.04.–30.09.2026 |
| `202610` | ab 01.10.2026 |

Alle Prüfgrundlagen (AHB-Struktur je Prüf-ID, MIG-Feldformate, EBD-Antwortcodes und
Prüfschritte, Codelisten, Allgemeine Festlegungen) sind **maschinell aus den
Originaldokumenten** gelesen; kostenpflichtige XML-/JSON-Fassungen werden nicht verwendet.

## 2. Verbindliche Konventionen des Auftraggebers

Diese Punkte sind ausdrücklich vorgegeben und gelten fort:

- **Kommunikation vollständig auf Deutsch**, einschließlich der internen Überlegungen.
- **Web-Inhalte ausschließlich über WebFetch/WebSearch** abrufen — niemals über curl, wget
  oder HTTP-Bibliotheken.
- **ZIP-Name mit dem Erstellungstag**: `EdiGen_JJJJMMTT.zip`.
- **Zeitstempel aller Ordner und Dateien** im ZIP auf den **Erstellungszeitpunkt** setzen
  (`find … -exec touch {} +` unmittelbar vor dem Packen).
- **Das ZIP ist immer GitHub-fertig**: mit `LICENSE` (MIT), `.gitignore` und einer README
  auf dem aktuellen Projektstand. Es gibt nur noch *ein* Paket, kein separates
  „GitHub-ZIP".
- **Jedes ZIP enthält eine aktualisierte `README.md`.** Vor dem Packen wird sie auf den
  Stand der Auslieferung gebracht: Änderungshistorie um den aktuellen Auftrag ergänzt,
  Umsetzungsstand, Ordnerbaum und Regressionsaufrufe nachgezogen. Ein Paket ohne
  nachgeführte README gilt als unvollständig.
- **Zu jeder Auslieferung gehört `docs/UEBERGABE.md`** — im Paket *und* zusätzlich als
  eigene Datei neben dem ZIP, damit sie ohne Entpacken lesbar ist. Sie wird bei jeder
  Auslieferung mitgepflegt (zuletzt erledigte Arbeiten, Regressionsstand, offene Punkte).
  Der Dateiname bleibt ohne Umlaut, damit er auf allen Systemen unverändert ankommt.
- **README-Änderungshistorie bei jeder Änderung pflegen**, Arbeitsprotokoll in `docs/`
  fortschreiben (neuer nummerierter Abschnitt je Auftrag, mit Befund, Quellenlage,
  Umsetzung, Nachweis).
- Kostenpflichtige BDEW-Fassungen bleiben außen vor.

## 3. Aufbau in Kurzform

```
_engine/            zentrale Engine — einmal gepflegt, gilt für alle Formatstände
  ahb-form-engine.js    Formular + Nachricht aus der Formular-Meta (17 Nachrichtentypen)
  generator.js          kuratierte UTILMD-Masken (Strom/Gas, geführte Standardprozesse)
  ahb-validator.js      Parser und Prüfung, über import-pruefung.js von beiden genutzt
  antwortcode-auswahl.js  EBD-Antwortcodes nach Cluster und Prüfschritten
  folgenachrichten.js   Folgeschritte des Geschäftsprozesses vorbefüllen
  kalender.js           Kalenderblatt der Datumsfelder (selbst positioniert)
  layout.js             Spaltenhöhe an den sichtbaren Bildschirm binden
  nachricht-speichern.js  Übertragungsdatei (Name und Inhalt) nach den Allg. Festlegungen
  umbau.js              Produktivnachricht -> Testnachricht (Seite umbau.html an der Wurzel)
  daten/                MIG-Formate, STS-Struktur, EBD-Codes und -Pfade, Codelisten …
<Formatstand>/<Thema>/<Typ>/     je Nachrichtentyp eine Seite + pruef-ids/_form-meta.js
scripts/            Regression (Node) und Hilfsskripte
werkzeuge/          Extraktion aus den BDEW-Dokumenten (Python) — siehe werkzeuge/LIESMICH.md
docs/               Arbeitsprotokoll, Statusdokumente, Prüflisten, diese Übergabe
```

**Wissensdatenbank.** Die Originaldokumente (Spiegel `mirror/edi_energy_de/<FV>`,
`regelwerk/` mit EBD 4.2/4.3, Allgemeine Festlegungen, Codelisten, GPKE,
Anwendungsübersicht) liegen in einem getrennten Bestand `Wissensdatenbank/`, der **nicht**
Teil des Repositorys ist — die BDEW-Dokumente dürfen dort nicht hinein. Sie ist die
Grundlage für jeden Lauf der Werkzeuge; ihr Doku-Teil wird nach größeren Arbeitsschritten
mit dem Stand aus `docs/` nachgezogen (zuletzt am 02.08.2026).

**Zwei Wege zum Formular** (bewusst, siehe offener Punkt F): Die vier kuratierten
UTILMD-Masken führen eigene Segmentlisten je Prüf-ID, alle übrigen Seiten arbeiten allein
mit `_form-meta.js`. `scripts/pruefe_pid_konsistenz.js` hält beide gegen dieselben Quellen.

## 4. Regression — vor jeder Auslieferung

```bash
export EDIGEN_TARGET=202604/Stammdaten/UTILMD/Strom   # je Ziel wiederholen
node _engine/tests/domsim.js
node _engine/tests/selfvalidate.js
node _engine/tests/golden.js            # --update nur bei GEWOLLTER Änderung
node scripts/pruefe_pid_konsistenz.js
node scripts/test_utilmd_seiten.js
node scripts/test_engine_pages.js
node scripts/test_folgenachrichten.js
node scripts/test_vorgangsnummer.js
node scripts/test_layout_kalender.js    # läuft rund 4 Minuten
node scripts/test_nachricht_speichern.js  # läuft rund 2 Minuten
node scripts/test_umbau.js              # Produktivnachricht -> Testnachricht
node scripts/test_validator_komponenten.js  # Komponentenlage, Segmentzähler
```

Erwarteter Stand am 02.08.2026:

| Prüfung | Ergebnis |
|---|---|
| UTILMD-Seiten | 553/553 |
| Engine-Seiten | 416/416 |
| Prüf-ID-Konsistenz | 0 Befunde in 32 Zielen |
| Vorgangsnummern | 1.140, alle mit `EDIGEN{` |
| Folgenachrichten | 80/80 (`scripts/test_folgenachrichten.js`, inkl. Kündigungsbrücke und Bestätigungs-Anker) |
| Umbau zu Testnachricht | 45/45 (`scripts/test_umbau.js`, inkl. Fremdtyp, Vorgangsauswahl und Validator-Gegenprobe) |
| Validator-Komponenten | 20/20 (`scripts/test_validator_komponenten.js`, NAD-Aufbau je Qualifier, DE-Wiederholungen, Segmentzähler) |
| Zeitscheiben | 12/12 |
| Layout und Kalender | 60 Höhenmessungen, 120 Kalenderöffnungen, keine Beanstandung |
| Nachricht speichern | 42 Dateien über 40 Generatorseiten, Validator und Folgenachricht |
| Golden | alle vier Ziele unverändert |
| Selbstvalidierung | Strom 202604: 506, Gas 202610: 177 (bekannte Muss-Segmente, Punkt D) |
| Antwortketten | 31/35 (vier bedingte Muss-Hinweise, vorbestehend) |

Die vier Golden-Ziele sind `2026{04,10}/Stammdaten/UTILMD/{Strom,Gas}`.

## 5. Zuletzt erledigt (diese Sitzung)

1. **Qualifierabhängige NAD-Aufbauprüfung** (03.08.2026): Neues Werkzeug
   `lies_nad_aufbau.py` liest die NAD-Segmentlayouts der vier UTILMD-MIG →
   `_engine/daten/nad-aufbau.js` (Strom 44, Gas 14 Qualifier). Der Validator prüft
   je NAD: benutzte/nicht benutzte Gruppen (C082/C058/C080/C059 …), Wiederholungszahl
   und Muss-Erstwiederholung — Name in falscher Gruppe oder Adresse am NAD+MS wird
   beanstandet, korrekt belegte NADs bleiben grün. Test 20/20.
   → Protokoll Abschnitt 34.
2. **Validator: leere Erstwiederholung, DE-Wiederholungen, Segmentzähler**
   (03.08.2026): Fall `NAD+Z63++:LADEN !++…` (55013) — der Wert steht in der
   2. DE3124-Wiederholung von C058, die laut AF 2.17/6.10 vorgesehen ist; der
   formale Mangel ist die leere 1. Wiederholung (MIG: Muss, sobald C058 genutzt
   wird). Auf Entscheidung des Auftraggebers als Fehler (rot) gemeldet, quellenbelegt
   (Tabelle `WIEDERHOLUNGS_DE`); zuvor war der Wert für alle Prüfungen unsichtbar
   und das Segment grün. Lücken nach belegter 1. Wiederholung (Straße C059,
   `Weg::3Lusan`) bleiben laut AF 2.17 unbeanstandet. Ergebnisliste mit
   Segmentzähler ab UNH = 1 (CONTRL-Referenz UCS DE0096), UNA/UNB/UNZ ohne Nummer.
   Selbstvalidierung unverändert. Test `scripts/test_validator_komponenten.js`
   10/10. → Protokoll Abschnitte 32 und 33.
3. **Umbau Produktivnachricht → Testnachricht** (`umbau.html` + `_engine/umbau.js`,
   03.08.2026): Import wie im Validator, Segmente als editierbare Felder (zunächst ohne
   Vorbelegung), Schaltfläche „Umbau zu Testnachricht" setzt Testkennzeichen (UNB
   DE0035), aktuellen Zeitpunkt (UNB S004, DTM+137), neue Referenzen (UNB/UNH/BGM/UNT/
   UNZ), Vorgangsnummer `EDIGEN{<DAR>` und die erste Zeitscheibe je Vorgang auf den
   Folgetag 00:00; alles bleibt editierbar, Speichern marktkonform. Arbeitet generisch —
   auch fremde Typen/unbekannte Prüf-IDs (Auftraggeber-Entscheidung, wechselnde
   Prüf-ID-Bestände). Einstieg auf der Startseite. Vorgangszeilen (SG4 IDE) und
   Prüf-ID-Feld (RFF+Z13) gelb hervorgehoben; bei mehreren Vorgängen wählt eine
   **vorbelegte Checkbox je Vorgang** (ab-/anwählbar, Teilmengen möglich, Knöpfe für
   alle Haken), welche Vorgänge in die Testnachricht wandern — UNT-/UNZ-Zähler werden
   an den verkürzten Umfang angepasst. Test `scripts/test_umbau.js` 45/45; Gegenprobe:
   umgebaute Golden-55016 validiert fehlerfrei. → Protokoll Abschnitte 27–30.
4. **Prozessketten über Use-Case-Grenzen** (GPKE Teil 2): Die Bestätigung der Kündigung
   (55017, Gas 44017) bietet jetzt die Anmeldung des Lieferbeginns an (55001/55077,
   Gas 44001; LFN wird Absender, DTM+93 übernommen, NB bleibt offen — die 55017 führt
   laut AHB keine LOC, die MaLo ist aus ihr nicht übernehmbar). Die Bestätigung der
   Anmeldung (55002/55078) hat eine eigene Kette mit den nachgelagerten Use-Cases:
   Abrechnungsdaten NNA/BKA (55218, 55126, 55672) und Stammdatenänderungen des NB
   (55175, 55225, 55615–55620, 55691), mit MaLo/Lokationsbündel und
   Verwendungszeitraum Z49/Z53 ab Lieferbeginn. Kündigung selbst und Ablehnungen lösen
   nichts aus. Werkzeug: `baue_prozessketten.py`, GPKE_FOLGEN mit Auslösern
   „start"/„bestaetigung"; Test von 38 auf 80 Prüfungen. → Protokoll Abschnitt 26.
5. **README-Lizenzteil**: Abhängigkeit des Projekts von den frei zugänglichen
   BDEW-DOCX-Lesefassungen beschrieben; kostenpflichtige XML-Fassungen nur nach Prüfung
   gegen die MIT-Lizenz. → Protokoll Abschnitt 25.
6. **Wissensdatenbank 02.08.2026** (12 Teile) eingespielt und auf Vollständigkeit
   geprüft: Regelwerk komplett (Anwendungsübersichten 3.3/4.0, EBD 4.2/4.3, GPKE 1–4,
   Allg. Festlegungen, 10 Codelisten), Spiegel FV2604 mit 28 AHB-/25 MIG-DOCX,
   `fv2610-migs/` mit 11 MIGs. FV2610-AHB- und EBD-DOCX waren nie Teil der Pakete —
   Reproduktionsweg: Sparse-Checkout `edi_energy_mirror` (Protokoll Abschnitt 7).

Davor (gleicher Tag): Vorgangsnummer `EDIGEN{<DAR>` (Abschnitt 22), Extraktionswerkzeuge
im Repository, Nachricht speichern nach Allg. Festlegungen 2.12 (Abschnitt 24),
Bildschirmaufteilung und Kalender (Abschnitt 23).

## 6. Offene Punkte

Ausführlich in [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md); die wichtigsten:

- **A — externe Validierungs-Absicherung.** Generator und Validator teilen dieselbe
  Prüfgrundlage; ein Abgleich gegen echte Marktnachrichten oder einen fremden Validator
  steht aus und wäre der wirksamste nächste Schritt.
- **B — Interchange-Ebene.** Eine Nachricht je Datei; reale Übertragungsdateien bündeln
  mehrere `UNH…UNT` in einem `UNB`.
- **C — Nutzdatentiefe.** Die Merkmalsmatrix deckt die geführten Anwendungsfälle ab, nicht
  den vollständigen optionalen Attributkatalog.
- **D — Muss-Segmente optionaler Untergruppen** (Ursache der Zahlen in der
  Selbstvalidierung und der vier Antwortketten-Hinweise).
- **E — E_0406/E_0407** ohne Baumstruktur (ebdamame bleibt bei der Konvertierung stehen);
  die Codes liegen vollständig vor.
- **F — kuratierte Masken und Engine zusammenführen.**

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

## 8. Auslieferung

Vor jedem Packen abzuarbeiten:

1. **Regression** fahren (Abschnitt 4) — Golden-Abweichungen erst lesen, dann bewusst
   aktualisieren.
2. **`README.md` nachziehen**: Änderungshistorie um den erledigten Auftrag ergänzen,
   Umsetzungsstand, Ordnerbaum und Regressionsaufrufe prüfen.
3. **Arbeitsprotokoll** `docs/Pruefid-Abgleich_20260728.md` um einen nummerierten
   Abschnitt ergänzen (Befund, Quellenlage, Umsetzung, Nachweis).
4. **Diese Übergabe** aktualisieren: zuletzt erledigte Arbeiten, Regressionsstand,
   gegebenenfalls offene Punkte und Fallstricke.
5. Packen und **beides ausliefern** — das ZIP und `docs/UEBERGABE.md` als eigene Datei.

```bash
cd <Arbeitsordner>/edigen
find EdifactGenerator -exec touch {} +          # Zeitstempel = Erstellungszeitpunkt
zip -qr EdiGen_$(date -u +%Y%m%d).zip EdifactGenerator \
    -x '*/node_modules/*' '*/.git/*' '*/__pycache__/*'
cp EdifactGenerator/docs/UEBERGABE.md .         # geht zusätzlich einzeln mit
```

Das Paket enthält rund 946 Dateien (etwa 2,6 MB) und ist unmittelbar als GitHub-Repository
verwendbar: `README.md`, `LICENSE` (MIT, mit Abschnitten zu den BDEW-Dokumenten und zur
KI-Erzeugung), `.gitignore`, `docs/`, `scripts/`, `werkzeuge/`, `_engine/` und die beiden
Formatstände.
