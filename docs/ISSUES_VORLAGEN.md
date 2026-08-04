# GitHub-Issue-Vorlagen für die offenen Punkte

Stand: 04.08.2026 · Quelle: [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md) und
[`NEUSTRUKTURIERUNG_PLAN_20260804.md`](NEUSTRUKTURIERUNG_PLAN_20260804.md)

Die Texte sind zum direkten Einfügen auf GitHub gedacht (Repo → Issues → New issue:
erste Zeile als Titel, Rest als Beschreibung). Wer die GitHub-CLI nutzt, kann sie auch
per `gh issue create --title "…" --body "…"` anlegen. Empfohlene Labels in Klammern.

---

## Issue 1 (Label: fachlich, prio-hoch)

**Titel:** A — Externe Validierungs-Absicherung (echte Referenznachrichten / Fremdvalidator)

Generator und Validator teilen dieselbe Prüfgrundlage — „Validator-clean" belegt interne
Konsistenz, nicht die Konformität gegen eine externe Referenz. Wirksamster nächster
fachlicher Schritt: Abgleich mit echten Beispielnachrichten von Marktpartnern oder einem
fremden Validator. Sobald Referenznachrichten vorliegen, entsteht daraus eine
Referenz-Testsuite (anonymisierte Nachrichten + erwartete Befunde) neben der Regression.
Beschaffung der Nachrichten: Auftraggeber. Siehe `docs/OFFENE_ASPEKTE.md`, Punkt A.

## Issue 2 (Label: fachlich)

**Titel:** B — Interchange-Ebene: mehrere Nachrichten je Übertragungsdatei (UNB mit n×UNH, UNG/UNE)

Heute eine Nachricht je Datei. Reale Übertragungsdateien bündeln mehrere `UNH…UNT` in
einem `UNB`, teils mit `UNG/UNE`-Funktionsgruppen. Betrifft Generator, Validator,
`_engine/nachricht-speichern.js` und das Umbau-Werkzeug gemeinsam (Zähler, Referenzen,
Namenskonvention nach Allg. Festlegungen 2.12). Siehe `docs/OFFENE_ASPEKTE.md`, Punkt B.

## Issue 3 (Label: fachlich)

**Titel:** C — Nutzdatentiefe: vollständiger optionaler Attributkatalog (SG8 SEQ + SG10 CCI/CAV)

Die Merkmalsmatrix je Objektart deckt die geführten Anwendungsfälle ab, nicht den
vollständigen optionalen Attributkatalog des AHB. Ausbau bedarfsgetrieben aus der
Testpraxis über `_nutzdaten-katalog.js`, nicht auf Vorrat. Siehe
`docs/OFFENE_ASPEKTE.md`, Punkt C.

## Issue 4 (Label: fachlich)

**Titel:** D — Ketten-Aktivierung: Muss-Segmente optionaler Untergruppen prüfen

Der Validator prüft Muss-Segmente nur innerhalb tatsächlich verwendeter Segmentgruppen.
Die Selbstvalidierung weist deshalb je Ziel mehrere hundert informative Befunde aus
(Vollständigkeit der Beispieldaten, nicht Struktur), und Bedingungen wie [492] bleiben
als „bedingtes Muss offen" stehen. Ketten-Aktivierung reduziert das Rauschen auf echte
Aussagen. Siehe `docs/OFFENE_ASPEKTE.md`, Punkt D.

## Issue 5 (Label: fachlich, blockiert-extern)

**Titel:** E — E_0406/E_0407: Prüfschritte fehlen (ebdamame-Konvertierung bleibt stehen)

Die Antwortcodes beider Entscheidungsbäume liegen vollständig vor
(`ahbdaten/ebd_nachtrag.json`), die Prüfschritte nicht — dort greift der Codefilter nach
Geschäftsvorfall nicht. Lösungswege: neue ebdamame-Fassung abwarten oder Hand-Nachtrag
nach dem Muster des Nachtrags. Siehe `docs/OFFENE_ASPEKTE.md`, Punkt E.

## Issue 6 (Label: umbau, phase-2)

**Titel:** F/Phase 2 — Ein Formularweg: kuratierte UTILMD-Masken als Sicht auf die Engine

Die vier kuratierten UTILMD-Masken führen eigene Segmentlisten (553 `<PID>.js` +
`generator.js`), alle übrigen Seiten arbeiten allein mit `_form-meta.js`. Zusammenführung
nach dem projekteigenen Plan (Protokoll Abschnitt 15, Umbauplan Phase 2): 114 fachliche
Befunde als Entscheidungsliste abarbeiten, `<PID>.js` → Feldauswahl-Daten auf der Meta,
`generator.js` entfällt, Golden-Neubewertung als eigener Arbeitsblock mit fachlicher
Durchsicht. Siehe `docs/NEUSTRUKTURIERUNG_PLAN_20260804.md`, Phase 2.

## Issue 7 (Label: umbau, phase-3)

**Titel:** Phase 3 — Formatstand als Parameter: ein Seitenbaum statt Ordnerkopien

Die Seitenbäume `202604/` und `202610/` sind HTML-Kopien; nach Phase 2 wird der
Formatstand Seitenparameter (`?stand=…`), Datenordner bleiben je Stand. Ein künftiger
Formatstand ist dann ein Datenordner + Registry-Eintrag, keine Baumkopie. Siehe
`docs/NEUSTRUKTURIERUNG_PLAN_20260804.md`, Phase 3 (erst nach Phase 2 sinnvoll).
