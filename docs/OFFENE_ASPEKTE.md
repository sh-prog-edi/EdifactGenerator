# EdifactGenerator – offene Aspekte

Stand: 02.08.2026 · Bezug: beide Formatstände `202604` und `202610`

Dieser Merker hält fest, was **erledigt** ist und welche **Aspekte offen** bleiben. Die
Arbeitschronik steht in `Pruefid-Abgleich_20260728.md` (fortlaufend) und
`AHB-Abgleich_202607.md` (Juli 2026).

---

## Erledigt

- **Alle 18 Nachrichtentypen in beiden Formatständen**: UTILMD (Strom + Gas), MSCONS,
  ORDERS, ORDRSP, ORDCHG, QUOTES, REQOTE, INVOIC, REMADV, COMDIS, PRICAT, IFTSTA,
  INSRPT, PARTIN, UTILTS, APERAK, CONTRL — zusammen **975 Prüf-ID-Formulare** in
  36 Formular-Metas.
- **Zwei Formatstände parallel** (202604 bis 30.09.2026, 202610 ab 01.10.2026), jeder
  mit eigener Datengrundlage und eigenem Golden-Snapshot; die Engine bleibt zentral.
- **Zentrale Engine** für Formular, Erzeugung und Prüfung (`_engine/`): eine
  Datenhaltung (`_form-meta.js`), eine Prüflogik (`ahb-validator.js` über
  `import-pruefung.js`), ein Antwortcode-Modul (`antwortcode-auswahl.js`).
- **Prüfgrundlagen maschinell aus den Originaldokumenten**: AHB-Struktur je Prüf-ID,
  MIG-Feldformate und Segmentaufbau (u. a. `sts-struktur.js`), EBD mit Antwortcodes,
  Clustern und Prüfschritten, Codelisten, Allgemeine Festlegungen.
- **Bedingungslogik**: 638 (Strom 202604) bzw. 614 (202610) und 147/146 (Gas)
  AHB-Bedingungen mit Klartext; auswertbare Bedingungen schalten Formularblöcke,
  die übrigen erscheinen als Hilfetext am Fragezeichen-Symbol.
- **Antwortcodes nach Entscheidungsbaum**: Auswahl je EBD, gefiltert nach Cluster und
  nach den Prüfschritten, die der Geschäftsvorfall bereits beantwortet.
- **Folgenachrichten**: aus einer erzeugten Nachricht die nächsten Schritte des
  Geschäftsprozesses vorbefüllen (355 bzw. 342 Prozessketten).
- **Regression**: Golden-Master je Ziel, domsim, Selbstvalidierung, dazu 16 Testskripte
  unter `scripts/` — darunter der Vollabgleich `pruefe_pid_konsistenz.js` (0 Befunde).

---

## Offen

### A. Unabhängige Validierungs-Absicherung
Generator und Validator teilen dieselbe Prüfgrundlage. „Validator-clean" belegt damit
*interne* Konsistenz, nicht die Konformität gegen eine **externe Referenz**. Ein
Abgleich mit echten Beispielnachrichten oder einem fremden Validator (edi@energy,
Marktpartner-Software) bleibt der wirksamste nächste Schritt.

### B. Interchange-Ebene
Eine Nachricht je Datei. Reale Übertragungsdateien bündeln mehrere `UNH…UNT` in einem
`UNB`, teils mit `UNG/UNE`-Funktionsgruppen. Mehrere Vorgänge je Nachricht (SG4 IDE)
sind bereits möglich.

### C. Vollständige Nutzdatentiefe
Die Merkmalsmatrix je Objektart (SG8 SEQ + SG10 CCI/CAV) deckt die geführten
Anwendungsfälle ab, nicht den vollständigen optionalen Attributkatalog des AHB. Für
Testnachrichten ausreichend, für eine Vollabdeckung ausbaubar über
`_nutzdaten-katalog.js`.

### D. Muss-Segmente optionaler Untergruppen
Der Validator prüft Muss-Segmente nur innerhalb tatsächlich verwendeter
Segmentgruppen (keine Ketten-Aktivierung). Die Selbstvalidierung weist deshalb je Ziel
mehrere hundert Befunde der Art „Muss-Segment in der Testnachricht nicht befüllt" aus —
sie betreffen die Vollständigkeit der Beispieldaten, nicht die Struktur.

### E. Zwei Entscheidungsbäume ohne Baumstruktur
E_0406 und E_0407 bringen die Konvertierung der aktuellen ebdamame-Fassung zum
Stillstand. Ihre Antwortcodes liegen vollständig vor (aus der letzten gelungenen
Auswertung, `ahbdaten/ebd_nachtrag.json`), die Prüfschritte nicht — dort greift der
Codefilter nach Geschäftsvorfall nicht.

### F. Kuratierte Masken und Engine
Die vier UTILMD-Masken führen eigene Segmentlisten (`<PID>.js`), die übrigen
Nachrichtentypen arbeiten allein mit der Formular-Meta. Beide Wege sind abgeglichen
(`scripts/pruefe_pid_konsistenz.js`), aber es bleiben zwei Wege. Sie zusammenzuführen —
die kuratierte Maske als Sicht auf die Engine — steht als Schritt 3 der
Konsolidierung aus (siehe `Pruefid-Abgleich_20260728.md`, Abschnitt 15).
