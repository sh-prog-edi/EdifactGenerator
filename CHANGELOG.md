# Änderungshistorie (jüngste zuerst)

Diese Historie wird bei jeder Änderung am Projekt mitgepflegt. Der jeweils aktuelle
Umsetzungsstand steht in der [README](README.md), die ausführliche Arbeitschronik in
`docs/Pruefid-Abgleich_20260728.md`.


- **11.08.2026** – **Prüfnachweis der Gegenprobe an echten Nachrichten.** Neuer
  Vermerk `docs/REFERENZ_PRUEFNACHWEIS.md` hält dauerhaft fest, gegen welche
  realen Prüf-IDs (23 Marktnachrichten-Dateien, Formatstand 202604, 1491
  Einheiten, alle fehlerfrei) gegengeprüft wurde. Die Nachrichten und
  Erwartungsdateien selbst bleiben bewusst NICHT im Repo (echte Zähler-/
  Rechnungsdaten möglich; zeitlich begrenzte Formatrelevanz) — nur der
  PID-Abdeckungsnachweis wird versioniert.
- **12.08.2026** – **Änderungsbewertung 202610 über alle Nachrichtentypen.**
  Übergang 202604→202610 für alle 14 geänderten Formate (AHB/MIG) bewertet:
  Änderungshistorien aus den edi_energy-DOCX extrahiert und gegen die
  Prüfgrundlage abgeglichen. Ergebnis: die Prüfgrundlage 202610 ist bereits
  durchgängig aus den neuen Fassungen gebaut (MIG-Felder je Format aus neuer
  Datei-ID, EBD 4.3, UTILMD S2.2/G1.2, standspezifische Codelisten) — kein
  Nachtrag am Prüf-Code nötig. Bericht: `docs/AENDERUNGSBEWERTUNG_202610.md`.
  → Protokoll Abschnitt 66.
- **12.08.2026** – **Dokumentenstand 202610: fehlende MIG-Versionen ergänzt
  („None" behoben).** Die FV2610-MIG waren im Quellen-Manifest nur per
  Download-ID erfasst (`version: null`), der Übersichts-Generator gab das als
  „None" aus — ein Label-Problem, kein Verarbeitungsproblem (MSCONS 202610 ist in
  `mig-formate.js` mit 92 Feldern hinterlegt). Die maßgeblichen Versionen aus dem
  konsolidierten edi_energy-Spiegel nachgetragen: u. a. **MSCONS MIG 2.5**,
  IFTSTA 2.1, APERAK 2.2, ORDCHG 1.2, ORDERS/ORDRSP 1.4c, PARTIN 1.1, PRICAT 2.1,
  QUOTES 1.3c (gültig ab 01.10.2026). Manifest und `dokumentenstand.js` enthalten
  keine „None"-Versionen mehr. → Protokoll Abschnitt 65.
- **12.08.2026** – **Verfeinerung: fehlendes Muss-DE mit Abhängigkeiten;
  Dokumentenstand einklappbar.** Die Meldung zum fehlenden Muss-Datenelement
  nennt jetzt konkret die zulässigen Codes mit Klartext und je Code die
  aufgelöste `[nnn]`-Abhängigkeit („… ZAP (ruhende Marktlokation) — nur wenn
  [519] … ∧ [520] …") bzw. bei freien Wert-DE das MIG-Feldformat — statt nur auf
  den AHB zu verweisen. Die Übersicht „Stand der verarbeiteten Dokumente" ist nun
  einklappbar (`<details>`, standardmäßig zugeklappt). → Protokoll Abschnitt 64.
- **12.08.2026** – **Einstiegsseite: vollständiger Dokumentenstand + Netzprüf-
  Schalter.** Die Übersicht „Stand der verarbeiteten Dokumente" listet jetzt
  **alle 18 Nachrichtentypen** beider Formatstände (AHB/MIG mit Version und
  Standdatum), erzeugt aus `docs/QUELLEN_MANIFEST.json` (Feld `zuordnung` +
  `dokumente`); die kuratierten UTILMD-Fassungen der Fehlerkorrektur 06.08.2026
  bleiben erhalten. Neuer Schalter „Auf neue BDEW-Dokumente prüfen" fragt
  `bdew-mako.de/api/documents` ab und vergleicht die höchste `fileId` mit der
  verarbeiteten (`hoechsteMakoFileId` = 12277); bei lokalem `file://`-Aufruf
  degradiert er sichtbar (CORS) und nennt den lokalen Weg
  `werkzeuge/mako_plattform.py --dokumente`. → Protokoll Abschnitt 63.
- **12.08.2026** – **Validator: fehlendes Muss-Datenelement wird rot.** Bisher
  prüfte der Validator nur Codes vorhandener DE und fehlende Muss-Segmente, nicht
  aber, ob ein als Muss geführtes Datenelement einer genutzten Segmentinstanz
  belegt ist. Dadurch blieb z. B. `STS+7++ZC8'` grün, obwohl die Muss-Ergänzung
  (Transaktionsgrundergänzung, C556 3. Gruppe) fehlte. Neu: positionsgenaue
  Muss-Präsenzprüfung je DE (`pos`/`sub`), maßgeblich sind unbedingtes DE-„X"/„M"
  und — bei codierten DE — mindestens ein unbedingter Muss-Code; bedingte Marker
  („X [nnn]", optionale Codes wie „S [9P0..1]") lösen bewusst keinen harten
  Fehler aus. Nachweis über alle 553 Prüf-IDs (`scripts/test_de_muss_praesenz.js`):
  0 Fehlalarme, 76/76 entfernte Muss-Ergänzungen erkannt, 18/18 optionale still;
  23 echte Nachrichten weiterhin fehlerfrei. → Protokoll Abschnitt 62.
- **12.08.2026** – **Einstiegsseite: Stand der verarbeiteten Dokumente + Änd-ID-
  Liste.** Die Startseite zeigt jetzt je Formatstand die verarbeiteten AHB/MIG-
  Versionen (UTILMD Strom/Gas; aktiver Formatstand hervorgehoben) und eine
  aufklappbare Liste der eingearbeiteten bzw. bewerteten Änderungen (Änd-IDs mit
  Status). Neue Datenschicht `_engine/daten/dokumentenstand.js`. → Protokoll
  Abschnitt 61.
- **12.08.2026** – **Fehlerkorrektur 06.08.2026 eingearbeitet (UTILMD Gas AHB 1.2 /
  Strom MIG S2.2, Formatstand 202610).** Neue konsolidierte Lesefassungen über den
  Hochfrequenz-Spiegel edi_energy_mirror geholt, Änderungshistorie extrahiert und
  bewertet. Generator-relevant war die AHB-Änderung **27512** (Gas): Bedingung der
  DTM Kündigungstermin DE2380 in den Ablehnungen 44018/44041 auf
  `X ([UB2] ∧ [209]) ⊻ [44]` erweitert (neue Bedingung [44] „Wenn DE2379 Code 106").
  Die Strom-MIG-Änderungen (BDEW-Status R→D, DE7140-Format, Beschreibung) sind
  MIG-intern/redaktionell und ändern die AHB-getriebene Prüfung nicht. Regression
  grün. → Protokoll Abschnitt 60.
- **11.08.2026** – **Validator: universelles Suchfeld + durchgehend sichtbare
  Werkzeugleiste.** Neues Suchfeld findet beliebige Text-Strings in der Nachricht
  (z. B. RFF+Z13 oder eine Melo) über alle Nachrichtenblöcke, hebt jede Fundstelle
  hervor, zählt die Treffer und springt mit ◀/▶ (bzw. Enter) Treffer für Treffer
  samt Fundstelle (Nachricht/Segment). Such- und Befund-Navigation sitzen jetzt in
  einer sticky Werkzeugleiste, die beim Scrollen oben bleibt (vorher lief die
  Navigation aus dem Bild). → Protokoll Abschnitt 59.
- **11.08.2026** – **Validator: Hinweis/Link zur Codenummern-Prüfung bei den
  Vergabestellen.** Das Ergebnis listet die Marktpartner-Codenummern aus UNB und
  NAD mit der zuständigen Vergabestelle (BDEW/Strom bei DE3055=293 bzw. UNB=500,
  DVGW/Gas bei 332/502, GS1 bei 9) und je einem Prüf-Link; der Seitenfuß führt die
  Links dauerhaft. Klarstellung: Der Validator prüft nur Format/Konsistenz, nicht
  die tatsächliche Vergabe. → Protokoll Abschnitt 58.
- **11.08.2026** – **Validator: Bezug auf die Ursprungs-/Bezugsnachricht bei
  offenen Bedingungen.** Nicht maschinell auflösbare bedingte Muss, die auf eine
  andere Nachricht verweisen, nennen jetzt die Bezugsnachricht: RFF+OI/ACW/TN
  (Ursprungsrechnung/vorherige Nachricht/Vorgang) samt Belegdatum aus dem
  folgenden DTM (z. B. „→ Ursprungsrechnung MMM… , Belegdatum 23.02.2026").
  Nennt die Bedingung ein Segment dieser Nachricht (NAD+MR, MOA+113), wird dessen
  Wert bzw. Fehlen gezeigt. → Protokoll Abschnitt 57.
- **11.08.2026** – **Validator: konditionale Muss-Bedingungen werden jetzt
  ausgewertet + Sprungnavigation.** Drei Ursachen behoben, warum bedingte Muss
  nie aufgelöst wurden: (1) `validator.html` baute den Bedingungspfad ohne
  Stand-Verzeichnis (aus `seite` statt `metaPfad`); (2) der Harness/die
  Referenzsuite bekamen die Bedingungen nicht in den VM-Kontext (jetzt via
  module.exports); (3) gemischte „Muss […] Soll […]"-Ausdrücke wurden nicht
  geparst. INVOIC 31004: 7 → 4 bedingte Muss (drei über IMD-Präsenz maschinell
  aufgelöst); die verbleibenden echten Abhängigkeiten (Ursprungs-/Stornorechnung,
  Rolle MGV) tragen nun ihren Klartext. Zusätzlich: In der Mehr-PID-Ansicht führt
  eine sticky Navileiste per „nächster/voriger Befund" zu den Rahmen mit Fehlern/
  Hinweisen (grün/amber/rot). Referenzsuite weiter 1491/1491 fehlerfrei,
  Regression grün. → Protokoll Abschnitte 55–56.
- **11.08.2026** – **Validator: Rahmen je Nachricht/Prüf-ID in der Mehrfach-
  Ansicht.** Bei Sammel-/Mehr-PID-Dateien wird jeder Nachrichten-/Vorgangs-
  abschnitt optisch in einen eigenen Kasten (`.msgblock`) gefasst — mit
  statusabhängigem Akzentbalken (grün = fehlerfrei, orange = Fehler) und
  Kopfzeile (Nachricht k/N · Dokumentnummer — Typ · Prüf-ID · Status). Ersetzt
  die bisherigen Trennlinien; erleichtert die Zuordnung in großen Dateien.
- **11.08.2026** – **Prüf-ID-Zerlegung für alle Nachrichtentypen geprüft; INSRPT
  ergänzt.** Systematisch bestimmt, welche Typen mehrere unterschiedliche
  Prüf-IDs je UNH-Nachricht führen können (RFF+Z13 in einer je Vorgang
  wiederholten Gruppe): UTILMD/UTILTS (SG6/IDE), IFTSTA (SG4 EQD / SG15 CNI) und
  INSRPT (SG4/DOC). Die Kopf-Typen (ORDERS-Familie, MSCONS, INVOIC, PRICAT,
  PARTIN, REMADV, COMDIS) tragen eine Prüf-ID je UNH — mehrere nur über mehrere
  UNH (typunabhängig zerlegt). Fehlend war nur INSRPT: `VORGANG_TRIGGER` um DOC
  ergänzt. Neuer Matrixtest `scripts/test_umbau_pidzerlegung.js` (Regression nun
  34 Läufe). → Protokoll Abschnitt 54.
- **11.08.2026** – **Validator-Seite prüft Sammel-/Mehr-PID-Dateien je
  Nachricht.** `validator.html` zerlegt eine Übertragungsdatei jetzt wie die
  Referenzsuite in Einheiten (je UNH-Nachricht, bei UTILMD je Vorgang) und
  prüft jede gegen IHRE eigene Prüf-ID — statt die ganze Datei gegen die erste.
  Behebt Falschmeldungen bei INVOIC-Dateien mit mehreren Prüf-IDs (z. B. 31006
  gefolgt von 31005). Mehrere Nachrichten werden als eigene Ergebnis-Blöcke mit
  Gesamt-Ampel dargestellt; die Einzel-Ansicht bleibt unverändert. Neuer Test
  `scripts/test_validator_mehrfach.js` (Regression nun 33 Läufe). → Protokoll
  Abschnitt 53.
- **11.08.2026** – **Validator: zweiter Merkmalswert (DE7110) im CAV-Composite.**
  Das CAV-Composite C889 trägt am Ende zwei Merkmalswerte DE7110; der Decoder
  kannte nur den ersten, sodass ein belegter zweiter Wert (z. B. `CAV+:::6:1`)
  fälschlich als unbeschriebene Komponente gemeldet wurde. Kleine Whitelist für
  belegbare Composite-Wiederholungen behebt das. Damit validiert der gesamte
  Referenzkorpus (23 echte Marktnachrichten-Dateien, 1491 Einheiten) **0 Fehler-
  Befunde** — über die Serie 2310 → 0. Regression grün. → Protokoll Abschnitt 52.
- **11.08.2026** – **Validator: DTM-Formatcodes 104/304 und CAV-Gruppenpflicht
  aus dem CCI.** `304` lässt Sekunden zu (echte MSCONS-Zeitstempel), `104`
  akzeptiert zwei MMDD-Grenzen ohne Bindestrich (jahreszeitenabhängige
  Zeiträume); kein Golden nutzt diese Codes, daher regressfrei. Zudem leitet
  der Validator die Gruppenpflicht eines CAV aus dem vorangehenden CCI ab (ein
  Merkmalswert ist nie pflichtiger als sein Merkmal) — behebt die
  Extraktionslücke bei 55218 CAV+Z22 reproduzierbar. Referenzkorpus: Fehler-
  Befunde 5 → 1 (1490/1491 Einheiten fehlerfrei; Rest ein MIG-Einzelfall bei
  55653). Regression grün. → Protokoll Abschnitt 51.
- **11.08.2026** – **Validator: Segment-Muss an der Segmentgruppen-Pflicht
  ausgerichtet.** Der universelle Validator meldete Segmente als „fehlendes Muss",
  die der AHB im konkreten Anwendungsfall nicht verlangt: Ein Segment mit
  `expr = "Muss"` wurde als harte Pflicht gewertet, obwohl die Einschränkung an
  der Segmentgruppe (`sgExpr`, z. B. `Soll […]`/`Muss [Bedingung]`) hängt. Jetzt
  ist ein Segment nur unbedingte Pflicht, wenn Segment UND Gruppe unbedingt Muss
  sind; sonst entscheidet die Gruppenbedingung (erfüllt → hart, nicht erfüllt →
  entfällt, unentscheidbar → Warnung). Wirkung am Referenzkorpus (23 echte
  Dateien): Fehler-Befunde 2310 → 5, fehlerfreie Einheiten 336 → 1487 von 1491;
  informative Selbstvalidierung 280/154/259/155 → 135/103/135/104. Golden
  unverändert, Regression grün, Vertragstests grün. Offen bleiben DTM-Formatcodes
  104/304 und ein CAV-Einzelfall. → Protokoll Abschnitt 50.
- **11.08.2026** – **Referenz-Testsuite: Einheiten-Zerlegung und erste Auswertung
  an echten Nachrichten.** `npm run referenz` zerlegt jede Übertragungsdatei mit
  der Umbau-Engine (`EdiUmbau`) in einzeln prüfbare Einheiten — je Nachricht
  (UNH…UNT) und, bei UTILMD mit mehreren Prüf-IDs, je Vorgang — und bündelt
  Befunde je Datei. Damit lösen sich Sammel-Übertragungen sauber auf (eine
  APERAK-Datei mit 224 Nachrichten validiert vollständig fehlerfrei; eine
  MSCONS-Datei mit 1143 Nachrichten statt 2286 Scheinbefunden). Erstlauf an 18
  anonymisierten Marktnachrichten (Lieferantensicht, 202604): 18/18 erkannt, 1384
  Einheiten, 230 fehlerfrei. Alle Rest-Befunde sind Validator-Präzisierungen
  (Segment-Muss ohne Segmentgruppen-Begrenzung; DTM-Formatcodes 104/304 zu eng) —
  keine Extraktionslücke, kein Nachrichtenfehler; Auswertung in
  `docs/REFERENZ_BEFUNDE_20260811.md`, die Korrekturen folgen als eigener Schritt.
  → Protokoll Abschnitt 49.
- **05.08.2026** – **Umbau: Dokument- und Vorgangsauswahl für alle aggregierenden
  Nachrichtentypen.** Die Anhak-Auswahl des Umbau-Werkzeugs (bisher nur UTILMD,
  IDE+24) deckt jetzt beide Aggregationsebenen ab: je **Nachricht** bei
  Sammel-Dateien (mehrere UNH je UNB, z. B. INVOIC-Sammelrechnung — Checkbox an
  der UNH-Zeile mit Typ und Rechnungsnummer aus dem BGM) und je **Einheit**
  innerhalb einer Nachricht gemäß Trigger-Tabelle (UTILMD/UTILTS IDE, ORDERS-
  Familie LIN, MSCONS NAD-Lieferstelle nach UNS, IFTSTA CNI/EQD, REMADV
  DOC-Rechnung, PRICAT PGI-Preisgruppe). INVOIC bewusst ohne inneren Trigger
  (Positionsauswahl bräche die Rechnungssummen). Kopf- und Summenteil bleiben
  erhalten, UNT/UNZ zählen neu; bei Typen mit Summensegmenten warnt die Ausgabe
  vor nicht neu berechneten MOA/CNT. `scripts/test_umbau.js` 45 → 56 Prüfungen.
  → Protokoll Abschnitt 48.
- **05.08.2026** – **MaKo-Plattform angebunden: Dokument-Frühwarnung und
  Q&A-Quelle.** Neues Werkzeug `werkzeuge/mako_plattform.py` (lokal):
  `--dokumente` gleicht das Quellen-Manifest gegen bdew-mako.de/api/documents ab
  (Frühwarnung neuer Fassungen), `--fragen` sammelt die Q&A des BDEW-Forums
  Datenformate. Erstlauf in `docs/MAKO_ABGLEICH_20260805.md`: Manifest für
  202604/202610 aktuell; 12 Konsultationsfassungen des künftigen Formatstands
  (u. a. UTILMD S2.3) und die fehlenden 202610-UTILMD-Spiegeldateien
  identifiziert (fileIds 12279/12281); elf projektrelevante Q&A-Klarstellungen
  als Arbeitsvorrat für Validator und Punkte B/D/E. → Protokoll Abschnitt 47.
- **04.08.2026** – **Version 0.10.0-beta; Versionsanzeige auf allen Seiten.** Neue
  zentrale Pflegestelle `_engine/version.js`: Alle 23 Seiten zeigen unten rechts ein
  dezentes Badge mit Version und (wo vorhanden) aktivem Formatstand. Die
  Paketprüfung wacht über die Übereinstimmung mit package.json. Die Version springt
  auf 0.10.0-beta (Zusammenfassung der heutigen Serie: Phasen 2–4, Phase-5-Einstieg,
  Suchfeld/Sortierung, Feld-Ampel mit Speicherfreigabe); der Release-Tag
  `v0.10.0-beta` löst den Release-Workflow aus. → Protokoll Abschnitt 46.
- **04.08.2026** – **Maske: optische Feldprüfung, MP-IDs ohne Vorbelegung,
  Speicherfreigabe.** Eingabefelder der kuratierten UTILMD-Masken zeigen ihren
  Zustand farblich: grün = befüllt und formatgültig (MIG-Feldformate plus MP-ID
  13-stellig, Marktlokation 11-stellig, Datum TT.MM.JJJJ), rot = Pflichtangabe leer
  (Muss bzw. Muss mit erfüllter Bedingung) oder Formatverstoß — mit Klartext am
  Feld. NAD+MS/NAD+MR sind nicht mehr vorbelegt (Test-Empfangssysteme prüfen auf
  angelegte Marktpartnercodes — negative CONTRL Code 23 bei unbekannten Absendern);
  der Platzhalter nennt das Beispiel nur noch als Hinweis. Die Vorschau entsteht
  weiterhin immer; **Speichern ist erst freigegeben**, wenn keine roten Felder und
  keine Fachregel-Fehler vorliegen (Knopf deaktiviert samt Begründung, keine
  Folgenachrichten aus unvollständigen Quellen). Golden unverändert (Harness/Tests
  setzen die Beispiel-IDs aktiv). → Protokoll Abschnitt 45.
- **04.08.2026** – **Maske: Prüf-ID-Suchfeld und umschaltbare Sortierung.** Die
  kuratierten UTILMD-Masken erhalten über der Auswahlliste ein Suchfeld (Live-Filter
  nach Prüf-ID-Anfang oder Stichwort; der erste Treffer wird sofort gerendert — die
  exakte Prüf-ID eintippen genügt) und einen Umschalter zwischen Kapitel-Gruppierung
  und flacher, numerisch sortierter Prüf-ID-Liste. Zentral im Profil-Modul
  (`_engine/utilmd-maske.js`), wirkt auf Strom/Gas in beiden Formatständen. Nebenbei
  behoben: die standabhängigen Kapitel-Labels der Auswahlgruppen (Phase 3) werden
  jetzt tatsächlich angewandt. → Protokoll Abschnitt 44.
- **04.08.2026** – **Phase 5, Punkt A vorbereitet: Referenz-Testsuite für echte
  Marktnachrichten.** Neue Suite `scripts/referenz_validierung.js` (`npm run referenz`):
  liest echte EDIFACT-Dateien aus dem lokalen Referenzordner (strikt außerhalb des
  Repos; `EDIGEN_REFERENZEN`), erkennt Nachrichtentyp/Formatstand über die
  UNH-Kennung und die Prüf-ID über RFF+Z13, validiert mit dem zentralen Validator
  und berichtet je Nachricht; optionale `erwartung.json` macht bewertete Nachrichten
  zur dauerhaften Testsuite (`--streng` als lokales Gate). Ohne Referenzordner endet
  die Suite grün — CI unabhängig. Beschaffungs-Checkliste (was der Auftraggeber
  liefern muss): `docs/REFERENZNACHRICHTEN.md`. → Protokoll Abschnitt 43.
- **04.08.2026** – **Phase 4: Datenpipeline und Quellen-Manifest.** Neuer Treiber
  `werkzeuge/pipeline.py` fährt den Extraktionslauf am Stück in erzwungener
  Reihenfolge (extrahiere_alle → baue_form_meta → Nachbearbeitungen →
  baue_prozessketten → Registry → Regression) — mit **Zeitscheiben-Schutz**: Vor dem
  Lauf wird je UTILMD-Ziel festgehalten, welche Prüf-IDs Verwendungszeitraum-Felder
  führen; schrumpft die Menge, bricht die Pipeline ab (die bekannte
  baue_form_meta-Falle ist damit maschinell abgesichert). Die Nachbearbeitungsskripte
  `aktualisiere_utilmd_regeln.py`, `ergaenze_zeitscheiben.py` und
  `ergaenze_bedingungstexte.py` sind auf die Feldauswahl-Datenschicht
  (`pruef-ids/_regeln.js`) umgestellt — Lese-/Schreibzugriff über das neue
  `werkzeuge/regeln_io.py` (Node-Serialisierung im Migrator-Format, Roundtrip
  byte-identisch). Neu: `docs/QUELLEN_MANIFEST.json` — 86 BDEW-Dokumente der
  Wissensdatenbank (Name, Version, Gültigkeit, MAKO-fileId, Ablage) plus Zuordnung
  je Formatstand+Nachrichtentyp (AHB-Version, UNH-Kennung, Datenordner). Volle
  Regression grün (32 Läufe). → Protokoll Abschnitt 42.
- **04.08.2026** – **Phase 3: Formatstand als Parameter — ein Seitenbaum statt zwei
  Kopien.** Je Nachrichtentyp gibt es nur noch EINE Generatorseite
  (`<Thema>/<Typ>[/Sparte]/index.html`, 43 → 23 HTML); der Formatstand kommt als
  URL-Parameter `?stand=JJJJMM` (neues Modul `_engine/stand.js`, ohne Parameter gilt
  die Kalender-Zuständigkeit: 202604 bis 30.09.2026, 202610 ab 01.10.2026). Die
  Datenordner bleiben je Stand getrennt; die Seiten laden ihre Daten über
  `EdiStand.lade` (synchron, file://-tauglich, kein Bauwerkzeug). Standabhängige
  Beschriftungen als Textvarianten (`nur-202604`/`nur-202610`), Prüf-ID-Auswahl der
  UTILMD-Masken dynamisch auf den geladenen Stand gefiltert, APERAK mit fachlicher
  Stand-Weiche (SG2-/SG5-RFF+TN). Verweise nachgezogen (Startseite,
  `validator-registry.js` samt Generator — dabei dessen veralteten ORDERS-Eintrag
  `_orders-meta.js` berichtigt —, Folgenachrichten/Antwortcodes/Engine lesen den
  Stand aus `EdiStand`/`formatConfig` statt aus dem Pfad). Alle Browser-Tests auf
  Parameter-URLs umgestellt (inkl. Reparatur zweier dadurch still leerlaufender
  Tests). Golden unverändert, volle Regression grün (32 Läufe). Ein künftiger
  Formatstand ist ein Datenordner + Registry-Lauf + `STAENDE`-Eintrag — keine
  Baumkopie. → Protokoll Abschnitt 41.
- **04.08.2026** – **Phase 2 abgeschlossen (Engine-Schritt): ein Erzeugungsweg für alle
  Masken.** `_engine/generator.js` (der eigene Erzeugungsweg der vier kuratierten
  UTILMD-Masken, 1.037 Zeilen) ist entfernt. Die Masken sind jetzt eine **Sicht auf die
  zentrale Engine**: Das neue Profil-Modul `_engine/utilmd-maske.js` rendert die
  kuratierten Felder aus der Feldauswahl-Datenschicht (`pruef-ids/_regeln.js`), ordnet
  jedes Feld einer Instanz der Formular-Meta zu und meldet die Zuordnung der Engine
  (`AhbFormEngine.setzeSicht`); die Nachricht erzeugt ausschließlich
  `_engine/ahb-form-engine.js` — derselbe Weg wie im Vollformular. Die Engine kennt
  dafür einen Testmodus (fehlende Muss-Eingaben ⇒ Hinweis statt Abbruch, Muss-Referenzen
  mit REF-Platzhalter), die MaKo-Terminumrechnung (Strom 00:00 / Gas 06:00 deutscher
  Zeit, MESZ-Tabelle) und das vollständige CAV-C889 (DE1131). Die 55194-Objektdaten sind
  inhaltlich neu belegt (SEQ+ZF3/ZG0 samt Merkmalen, als Daten in `_regeln.js`).
  **Golden-Neubewertung als eigener Prüfblock:** je Ziel Diff je Prüf-ID erzeugt und den
  Mustern zugeordnet (V1 neue AHB-geführte Muss-Segmente, V2 entfallene
  Pauschal-Platzhalter bedingter Referenzen, V3 komponentenrichtige CAV/RFF/STS-Werte,
  V4 einheitliche REF-\<Qualifier\>-Platzhalter, V5 55194-Neubelegung, V6
  AHB-Segmentreihenfolge); Snapshots danach bewusst neu eingefroren
  (375/553 Nachrichten zeichengleich, 26 nur umsortiert, 152 inhaltlich begründet
  geändert). Informative Selbstvalidierungs-Befunde:
  982 → 848. Volle Regression grün (32 Läufe). → Protokoll Abschnitt 40.
- **04.08.2026** – **Phase 2 (Fortsetzung): Regel-Datenschicht statt 553 Einzeldateien.**
  Die handgepflegten `pruef-ids/<PID>.js` der vier kuratierten UTILMD-Masken (553
  Dateien) und die vier `_pid-registry.js` sind durch je EINE generierte Datendatei
  `pruef-ids/_regeln.js` ersetzt (Migration: `scripts/baue_pid_regeln.js`, mit
  JSON-Roundtrip-Garantie — die Regeln sind reine Daten, kein Code mehr). Seiten,
  Test-Harness und `pruefe_pid_konsistenz.js` laden die Datenschicht; die
  UTILMD-Seiten schrumpfen von bis zu 221 auf 32 Script-Tags.
  **Äquivalenznachweis: alle vier Golden-Snapshots blieben OHNE Update unverändert**
  — die Umstellung ist nachweislich rein strukturell. Meta-Abgleich als Vorarbeit für
  den Engine-Schritt: 93–99 % der Regel-Felder sind einer Meta-Instanz zuordenbar
  (Strom 2672/2866 bzw. 2702/2900, Gas 1043/1048 bzw. 1045/1050).
  `pruefe_paket.js` überspringt jetzt gelöschte, noch nicht committete Dateien.
  Verbleibt aus Phase 2: `generator.js` durch Engine-Sicht ersetzen (inkl.
  55194-Objektdaten ZF3/ZG0). → Protokoll Abschnitt 39.
- **04.08.2026** – **Phase 2.2: Maske an die AHB-Meta gekoppelt — alle 224 fachlichen
  Befunde behoben.** Nach Freigabe der Entscheidungsliste erzeugt die kuratierte Maske
  die betroffenen Segmente jetzt datengetrieben aus der Formular-Meta: FTX mit dem
  AHB-Qualifier (ACB) und nur, wo der AHB es führt (E1/E2); Objektdaten-Blöcke
  SEQ/CCI/CAV nur mit AHB-geführten Qualifiern je Prüf-ID (E3/E9); BGM-Dokumentenname
  und STS+7 nach AHB (E7/E8); MP-ID-Vorbelegung folgt der zulässigen Codevergabestelle
  (Modell 2: GS1-Beispiel-GLN statt 293, E6). Die Quellen-Prüfung am Original-AHB S2.1
  (Wissensdatenbank in Google Drive) entschied E4/E5: Die Meta war korrekt, die Maske
  belegte falsch — das Zugeordnete-Marktpartner-CAV heißt jetzt
  `CAV+Z91:<MP-ID>::Z39` (MP-ID in DE1131, MSB-Art in DE7110). Nachmessung: 224 → 0;
  informative Muss-Befunde 1.100 → 982. Golden-Neubewertung: 149 Nachrichten gewollt
  geändert, jede Diff-Signatur einem beschlossenen Muster zugeordnet (keine
  unerwarteten Abweichungen), Snapshots neu eingefroren. Volle Regression grün
  (32 Läufe). → Protokoll Abschnitt 38.
- **04.08.2026** – **Phase 2.1: Entscheidungsliste der fachlichen Befunde.** Neues
  Analysewerkzeug `scripts/analyse_selbstvalidierung.js` erhebt die Selbstvalidierungs-
  Befunde aller vier Golden-Ziele vollständig und klassifiziert sie: 1.100 informative
  „Muss nicht befüllt" (offener Punkt D, erwartbar) und **224 fachlich zu prüfende**
  Befunde, gebündelt in 9 Muster (E1–E9) — von falschen Platzhalter-Qualifiern
  (FTX ABO→ACB) über pauschal erzeugte Objektdaten-Blöcke ohne AHB-Grundlage bis zu
  zwei Mustern, die nur am Original-AHB entscheidbar sind (E4/E5). Ergebnis als
  `docs/ENTSCHEIDUNGSLISTE_PHASE2.md` (je Muster: Befund, Quellenlage, Empfehlung,
  Entscheidungsfeld) und `.csv` (alle 224 Einzelbefunde) — zur fachlichen Durchsicht
  durch den Auftraggeber vor dem Phase-2-Umbau. → Protokoll Abschnitt 37.
- **04.08.2026** – **CI und automatische Releases (Phase 1 der Neustrukturierung).**
  Die Auslieferungs-Konventionen sind jetzt Code statt Prosa: `scripts/pruefe_paket.js`
  prüft maschinell, dass keine BDEW-Originaldokumente versioniert sind, jede Seite mit
  `_bedingungen.js` auch die Bedingungs-Hilfe lädt, alle vier Golden-Snapshots vorhanden
  sind, keine absoluten Container-Pfade zurückkehren und Playwright exakt gepinnt bleibt
  (`npm run paket`; auch Teil der Regression). GitHub Actions: `ci.yml` fährt die
  Smoke-Regression bei jedem Push/PR und die volle Browser-Suite auf `main`, per Hand
  und wöchentlich; `release.yml` baut aus einem Git-Tag `vX.Y.Z` automatisch das
  Auslieferungs-ZIP (`EdiGen_JJJJMMTT.zip` per `git archive`, nach Paket-Prüfung und
  Smoke als Wächter) und hängt es an das GitHub-Release — die manuellen ZIP-Konventionen
  entfallen. `docs/UEBERGABE.md` ist zum kompakten Arbeitsstand-Dokument umgebaut
  (Git-Workflow statt ZIP-Staffellauf); die offenen Punkte A–F liegen als fertige
  GitHub-Issue-Texte in `docs/ISSUES_VORLAGEN.md`. README mit CI-Badge.
  → Protokoll Abschnitt 36.
- **04.08.2026** – **Git-Fundament (Phase 0 der Neustrukturierung).** Das Projekt ist
  jetzt ein Git-Repository (Ausgangs-Tag `v0.9.0-beta` = unveränderter Stand 03.08.2026);
  GitHub wird die Quelle der Wahrheit, der ZIP-Staffellauf zwischen Chats endet. Neu:
  `package.json` (`npm run smoke` / `npm run regression` / `npm run golden:update`) und der
  Regressionstreiber `scripts/regression_alle.js`, der alle vier Golden-Ziele und sämtliche
  Testskripte am Stück fährt (ersetzt die manuelle `EDIGEN_TARGET`-Aufrufliste). Playwright
  ist exakt gepinnt (1.56.1, passend zu Chromium-Build 1194). Portabilität: In 11 Test-
  skripten und 5 Python-Skripten waren absolute Container-Pfade (`/mnt/user-data/working/…`)
  verdrahtet — jetzt überall relativ zum Skriptort, Arbeitsordner der Extraktion per
  `EDIGEN_ARBEITSORDNER` übersteuerbar. `test_antwortketten`: Grün-Kriterium liest jetzt
  „keine Fehler" statt exakt `fehlerfrei` — das Warn-Badge „fehlerfrei · N bedingte Muss
  offen" (ausdrücklich „bitte fachlich prüfen"-Hinweise, z. B. [492]) ist kein Fehler;
  vorher scheiterten 4 von 35 Kettenläufen daran. Die Änderungshistorie ist aus der README
  in dieses `CHANGELOG.md` ausgelagert. Volle Regression grün (35 Läufe).
  → Protokoll Abschnitt 35.
- **03.08.2026** – **Qualifierabhängige NAD-Aufbauprüfung für alle NAD-Varianten.**
  Konsequenz aus der DE3124-Richtigstellung: Die Belegung der NAD-Gruppen hängt am
  Qualifier (Marktlokationsanschrift: C058 benutzt, C080 „Nicht benutzt" — Kunden-
  Segmente umgekehrt; MS/MR nur C082). Neues Werkzeug `werkzeuge/lies_nad_aufbau.py`
  extrahiert die Segmentlayouts der vier UTILMD-MIG (Strom 44, Gas 14 Qualifier je
  Formatstand) nach `_engine/daten/nad-aufbau.js`; der Validator prüft damit je
  NAD-Segment: benutzte/nicht benutzte Gruppen, Wiederholungszahl (etwa max 5×3124)
  und die Muss-Erstwiederholung — quellenbelegt (MIG + AF 2.17/6.10). Ein Name in
  der falschen Gruppe (C082 statt C080) oder eine Adresse am NAD+MS wird jetzt
  beanstandet; korrekt belegte NADs aller Qualifier bleiben grün. Test auf
  20 Prüfungen erweitert; Selbstvalidierung und Golden unverändert.
  → Protokoll Abschnitt 34.
- **03.08.2026** – **Richtigstellung: DE3124-Wiederholungen im NAD (C058).** Einwand des
  Auftraggebers, bestätigt durch die Quellen: Laut Allg. Festlegungen Kap. 2.17/6.10
  darf DE3124 in C058 bis zu 5-mal wiederholt werden — die zweite Komponente in
  `NAD+Z63++:LADEN !++…` ist eine vorgesehene Position, die frühere Meldung („dort ist
  kein Datenelement vorgesehen") war falsch. Der formale Mangel ist die **leere
  1. Wiederholung** (laut MIG Muss, sobald C058 genutzt wird) bei belegter zweiter —
  auf Entscheidung des Auftraggebers weiterhin als Fehler (rot) eingestuft, jetzt mit
  quellenbelegter Meldung (MIG + AF 2.17/6.10). Neue Tabelle `WIEDERHOLUNGS_DE`
  (C058/3124, C080/3036, C059/3042, FTX/4440); Lücken nach belegter 1. Wiederholung
  bleiben unbeanstandet — bei der Straße (C059: `Weg::3Lusan`) sind sie laut AF 2.17
  der Normalfall. Test auf 10 Prüfungen erweitert. → Protokoll Abschnitt 33.
- **03.08.2026** – **Validator: Werte an nicht vorgesehenen Komponenten + Segmentzähler.**
  Anlass war eine geprüfte 55013: Der Validator meldete korrekt die fehlenden
  Muss-Segmente, übersah aber den eigentlichen Fehler — in
  `NAD+Z63++:LADEN !++…` steht der Wert durch ein überzähliges „:" in der zweiten
  Komponente von C058, während das benutzte DE3124 leer bleibt; Werte an nicht
  dekodierten Komponenten waren für alle Prüfungen unsichtbar (Segment blieb grün).
  Neue Prüfung `pruefeKomponenten` in `_engine/ahb-validator.js`: erste Komponente
  eines Elements bekannt und leer + Wert an späterer, nicht vorgesehener Komponente →
  Fehler mit Wert, Position und leerem DE — das Segment wird rot. Keine Fehlalarme bei
  bekannten späteren Positionen (CTA DE3412, NAD DE3055, STS-Gruppen); Selbstvalidierung
  aller erzeugten Nachrichten unverändert. Zusätzlich zeigt die Ergebnisliste jetzt
  einen **Segmentzähler** je Segment (ab UNH = 1 wie die CONTRL-Referenz UCS DE0096;
  UNA/UNB/UNZ ohne Nummer) — Fehlerpositionen aus negativen CONTRLs sind damit direkt
  auffindbar. Neuer Test `scripts/test_validator_komponenten.js` (9 Prüfungen).
  → Protokoll Abschnitt 32.
- **03.08.2026** – **Umbau-Werkzeug: auch die Uhrzeit im UNB als ersetzt markiert.**
  Nach dem Umbau war im UNB-S004 nur das Datum (DE0017) als ersetztes Feld markiert,
  die ebenso ersetzte Uhrzeit (DE0019) nicht — beide Komponenten werden jetzt einzeln
  an den Ersetzungsbericht gemeldet, der Markierung und Auflistung steuert. Test um
  zwei Prüfungen erweitert (45/45). → Protokoll Abschnitt 31.
- **03.08.2026** – **Umbau-Werkzeug: Bedienleiste über dem Segment-Editor.** Die
  Schalter „alle Haken setzen"/„alle Haken entfernen" tragen jetzt dieselbe gelbe
  Markierungsfarbe wie die Vorgangszeilen; „Umbau zu Testnachricht" steht daneben in
  einer gemeinsamen Leiste **über** dem Editor, ebenso die Legende „beim Umbau
  ersetztes Feld …". Die Erfolgsmeldung („n Felder ersetzt") und die Auflistung der
  Ersetzungen bleiben unterhalb des Editors. → Protokoll Abschnitt 30.
- **03.08.2026** – **Umbau-Werkzeug: Vorgangsauswahl per Checkbox statt Auswahlpunkt.**
  Die Auswahl „nur diesen Vorgang" (Radio) ließ sich nicht wieder abwählen — nur auf
  einen anderen Vorgang umlenken. Jetzt trägt jede Vorgangszeile eine **vorbelegte
  Checkbox**: Abwahl und Wieder-Anwahl einzelner Vorgänge sind jederzeit möglich, auch
  **Teilmengen** (etwa 2 von 3 Vorgängen) — versehentliche Klicks sind damit umkehrbar.
  Zwei Knöpfe setzen bzw. entfernen alle Haken auf einmal; ohne einen einzigen Haken
  erscheint ein Hinweis statt einer leeren Nachrichtenhülle. Nachrichten einer
  Übertragungsdatei, deren Vorgänge sämtlich abgewählt sind, entfallen ganz; UNT-/
  UNZ-Zähler werden weiterhin an den verkürzten Umfang angepasst
  (`EdiUmbau.filterVorgaenge` löst `filterVorgang` ab). Test auf 43 Prüfungen
  erweitert. → Protokoll Abschnitt 29.
- **03.08.2026** – **Umbau-Werkzeug: Vorgangs-Markierung und Einzelvorgang-Ausgabe.**
  Eine Nachricht kann mehrere Vorgänge tragen, auch zu unterschiedlichen Prüf-IDs.
  Im Segment-Editor sind deshalb alle Zeilen mit Vorgangs-Segment (SG4 IDE) **gelb
  hinterlegt**, ebenso das **Prüf-ID-Feld** des Vorgangs (RFF+Z13, DE1154). Bei mehr als
  einem Vorgang bietet jede Vorgangszeile die Auswahl **„nur diesen Vorgang"**
  (mit Nachrichts- und Prüf-ID-Angabe): Die Testnachricht enthält dann den Kopfteil und
  genau den gewählten Vorgang; der **Segmentzähler im UNT** (DE0074) und der
  **Nachrichtenzähler im UNZ** (DE0036) werden an den verkürzten Umfang angepasst
  (`EdiUmbau.vorgaenge`/`filterVorgang`). Die Umschaltung wirkt live, „alle Vorgänge"
  stellt die volle Ausgabe wieder her. Test `scripts/test_umbau.js` auf 41 Prüfungen
  erweitert. → Protokoll Abschnitt 28.
- **03.08.2026** – **Umbau Produktivnachricht → Testnachricht** (`umbau.html`, Logik in
  `_engine/umbau.js`). Import wie im Validator (Drag & Drop / Einfügen); die Segmente der
  importierten Nachricht werden als editierbare Felder gelistet — zunächst ohne
  Vorbelegung. Erst die Schaltfläche **„Umbau zu Testnachricht"** überträgt die Werte und
  ersetzt dabei: Test-Kennzeichen UNB DE0035 = 1; UNB S004 und DTM+137 = aktueller
  Zeitpunkt; Datenaustauschreferenz, Nachrichten- und Dokumentennummer (UNB, UNH, BGM,
  UNT, UNZ) neu als 12-stellige Referenz wie in der Engine; Vorgangsnummer
  `EDIGEN{<DAR>` (je Vorgang `-02` …); erste Zeitscheibe der Verwendungszeiträume je
  Vorgang (DTM+Z25) auf das Ende des aktuellen Tages (Folgetag 00:00 deutscher Zeit,
  Regel wie Bedingung [131]); UNT-/UNZ-Zähler neu gezählt. Ersetzte Felder sind markiert,
  alle Werte bleiben editierbar; Speichern als marktkonforme Datei
  (`_engine/nachricht-speichern.js`). Der Umbau arbeitet **generisch auf der
  Segmentstruktur** — auch Nachrichten mit unbekannter Prüf-ID oder fremdem
  Nachrichtentyp werden umgebaut (Vorgangsnummer/Zeitscheiben nur, wo vorhanden), damit
  das Werkzeug wechselnde Prüf-ID-Bestände übersteht. Mehrere Nachrichten je
  Übertragungsdatei werden unterstützt (fortlaufende Referenzen je UNH). Startseite um
  den Einstieg ergänzt; neuer Test `scripts/test_umbau.js` (29 Prüfungen), Gegenprobe:
  eine umgebaute Golden-55016 validiert fehlerfrei. → Protokoll Abschnitt 27.
- **02.08.2026** – **Prozessketten über Use-Case-Grenzen: Kündigung → Lieferbeginn →
  Folge-Use-Cases.** Zwei neue Absprünge nach GPKE Teil 2: (1) Die **Bestätigung der
  Kündigung** (55017, Gas 44017) bietet jetzt die **Anmeldung** des Lieferbeginns
  (55001/55077, Gas 44001) an — der LFN (Empfänger der Bestätigung) wird Absender, das
  Vertragsende (DTM+93) wird übernommen, der Netzbetreiber bleibt bewusst offen (UC
  „Kündigung", Weitere Anforderungen: Kündigung ist dem Lieferbeginn vorzuschalten).
  (2) Die **Bestätigung der Anmeldung** (55002/55078) erhält eine eigene Kette mit den
  nachgelagerten Use-Cases — Abrechnungsdaten Netznutzungs- und Bilanzkreisabrechnung
  (55218, 55126, 55672) und die Stammdatenänderungen des NB (55175, 55225, 55615–55620,
  55691) — samt Marktlokation, Lokationsbündel und Verwendungszeitraum ab Lieferbeginn
  (UC „Lieferbeginn", **Nachbedingung im Erfolgsfall**). Die Kündigung selbst (55016)
  und Ablehnungen (55018, 55003) lösen keine Folge-Use-Cases aus. Umgesetzt im
  Werkzeug `werkzeuge/baue_prozessketten.py` (GPKE-Folgen mit Auslöser „start" /
  „bestaetigung"), Daten neu erzeugt (`_engine/daten/prozessketten.js`, 357/344 Ketten),
  Test `scripts/test_folgenachrichten.js` von 38 auf 80 Prüfungen erweitert.
  → Protokoll Abschnitt 26.
- **02.08.2026** – **Lizenzabschnitt: Abhängigkeit von der Zugänglichkeit der
  BDEW-Dokumente.** Neuer Hinweis unter [Lizenz](#lizenz): Das Projekt steht und fällt
  mit den frei zugänglichen BDEW-Lesefassungen (vor allem den auswertbaren DOCX); sind
  künftige Fassungen nur noch als schlecht auslesbare PDF verfügbar, kann die Datenbasis
  im schlechtesten Fall nicht mehr nachgeführt werden. Die kostenpflichtigen
  XML-/JSON-Fassungen wären zuvor auf Vereinbarkeit ihrer Nutzungsbedingungen mit der
  MIT-Lizenz zu prüfen und scheiden andernfalls aus.
- **02.08.2026** – **Nachricht speichern auf allen Seiten.** Die erzeugte Nachricht ließ
  sich bisher nur in den kuratierten UTILMD-Masken als Datei sichern; in den übrigen
  17 Nachrichtentypen, in den Antwort- und Folgeformularen und im Validator fehlte die
  Möglichkeit. `_engine/nachricht-speichern.js` stellt sie jetzt überall bereit und bildet
  den Dateinamen nach den **Allgemeinen Festlegungen, Abschnitt 2.12**:
  `Nachrichtentyp_Anwendungsreferenz_von_an_yyyymmdd_DAR.txt`. Alle Angaben werden aus der
  Nachricht selbst gelesen (UNH DE0065, UNB DE0026/DE0004/DE0010/DE0020) — deshalb gilt
  dieselbe Funktion für jeden Typ, für Antwortnachrichten und für eine im Validator
  eingelesene Datei. Die Datei trägt die Segmente ohne Zeilenumbrüche und ist nach
  **ISO 8859-1** kodiert, passend zum Zeichensatz UNOC aus UNB DE0001; zuvor wurde UTF-8
  geschrieben, womit Umlaute in Freitexten beim Empfänger falsch angekommen wären.
  Mitbehoben: Die **Anwendungsreferenz (UNB DE0026)** stand in der Engine an zehnter statt
  an siebter Stelle des UNB — solange kein AHB das Element führt, war die Ausgabe
  zeichengleich, mit der ersten Fassung, die es füllt, wäre der Fehler durchgeschlagen.
  Nachweis: `scripts/test_nachricht_speichern.js` (Namensbildung gegen beide Beispiele des
  Dokuments, 42 gespeicherte Nachrichten über alle 40 Generatorseiten, den Validator und
  den Weg über eine Folgenachricht).

- **02.08.2026** – **Extraktionswerkzeuge im Repository.** Der Ordner `werkzeuge/`
  (22 Python-Skripte) liegt jetzt im Paket — README und Arbeitsprotokoll verwiesen an
  vielen Stellen darauf, ohne dass er beilag. Damit ist der Weg vom BDEW-Dokument zur
  Datendatei durchgängig nachvollziehbar und mit einer neuen Dokumentfassung
  wiederholbar: AHB-Leser für beide Tabellenlayouts, Bedingungsauswertung, STS-Struktur
  aus dem MIG, Prozessketten und der EBD-Leser samt Aufschlüsselung der
  Entscheidungsbäume. `werkzeuge/LIESMICH.md` beschreibt Voraussetzungen, Arbeitsordner,
  Reihenfolge und die Fallstricke (insbesondere: `baue_form_meta.py` überschreibt alle
  Formular-Metas). Die BDEW-Dokumente selbst bleiben außen vor.

- **02.08.2026** – **Bildschirmaufteilung und Kalender.** Die Eingabemaske endet jetzt am
  unteren Fensterrand statt bei starren `85vh`: `_engine/layout.js` rechnet ihre Höhe aus
  dem tatsächlich sichtbaren Bereich (Fensterhöhe abzüglich Seitenkopf und Fußzeile) und
  führt sie bei Größenänderung, Bildlauf und Formularaufbau nach. Damit ist die
  Bildlaufleiste samt unterem Pfeil vollständig sichtbar — auf einem 13-Zoll-Laptop wie
  auf einem 24-Zoll-Monitor; stehen die Spalten untereinander, bleibt die Seite selbst der
  Scrollbereich. Der Datumskalender ist kein nativer Browser-Picker mehr, sondern ein
  eigenes Blatt (`_engine/kalender.js`): rechtsbündig zum Datumsfeld, unterhalb der
  Eingabezeile in der oberen Bildschirmhälfte, oberhalb in der unteren, in beiden
  Richtungen an den Fensterrand geklemmt. Er trägt Monats- und Jahresnavigation, bei
  Zeitfeldern eine Uhrzeit und die Schaltflächen Heute/Leeren/Schließen, folgt der
  Hell-/Dunkel-Wahl und ersetzt zugleich die zweite Kalender-Umsetzung in der kuratierten
  Maske. Nachweis: `scripts/test_layout_kalender.js` (60 Höhenmessungen in drei
  Fenstergrößen, 120 Kalenderöffnungen über 20 Generatorseiten, Klapprichtung je
  Bildschirmhälfte).

- **02.08.2026** – **Vorgangsnummer mit einheitlichem Namensaufbau.** Die Vorgangsnummer
  (SG4 IDE DE7402) lautet jetzt durchgängig `EDIGEN{<Datenaustauschreferenz>` — vorher
  trug nur die kuratierte UTILMD-Maske ein Präfix (`TEST{`), während die zentrale Engine
  die Referenz mit angehängter Positionsnummer vorbelegte. Damit tragen Anfrage und
  Antwortnachricht denselben, als EdifactGenerator-Vorgang erkennbaren Aufbau; bei
  mehreren Vorgängen je Nachricht zählt ein Zusatz `-02`, `-03` … durch. Der neue Test
  `scripts/test_vorgangsnummer.js` prüft 1.140 Vorgangsnummern über alle Generatorseiten
  beider Formatstände und hält die beiden Definitionsstellen (`_engine/generator.js`,
  `_engine/ahb-form-engine.js`) zusammen. Dabei aufgefallen und mitbehoben:
  - **Drei Prüf-IDs aus dem Formatstand 202604 entfernt** (Strom 55693/55694, Gas 44183):
    Sie standen in der Auswahl der kuratierten Masken und in der Prozess-Meta, obwohl der
    AHB sie erst ab 202610 führt. Ohne Regeldatei erzeugte die Maske eine Nachricht aus
    reinen Platzhaltern (`ABSENDER`, `DOC-NUM`, `VORGANG`).
  - **Keine Platzhalter-Nachrichten mehr:** Fehlt die Regeldatei einer Prüf-ID, bricht
    `generateEdifact()` mit einem Hinweis ab, statt eine unbrauchbare Nachricht
    auszugeben, die wie eine gültige Testnachricht aussieht.

- **02.08.2026** – **Vollständiger Abgleich aller Prüf-ID-Nachrichten.** Ein neues
  Werkzeug (`scripts/pruefe_pid_konsistenz.js`) prüft jede Prüf-ID gegen ihre Quellen:
  Auswahllisten und Formularfelder gegen den AHB, Abhängigkeiten auf erreichbare Codes,
  Prozess-Meta (Transaktionsgrund, EBD-Nummer, Antwortcode, Cluster) gegen AHB und
  Entscheidungsbäume, STS-Codes gegen die MIG-Struktur, EBD-Referenzen gegen die
  gelesenen Diagramme. Der erste Lauf meldete **1.020 Befunde**, nach der Bereinigung
  sind es **null**:
  - **416 ungenutzte Regeldateien entfernt.** Außerhalb der vier kuratierten
    UTILMD-Masken band keine Seite ihre `<PID>.js` mehr ein — die Engine arbeitet seit
    der Konsolidierung mit `_form-meta.js`. Die Altdateien wichen inzwischen an 403
    Stellen vom AHB ab; das Paket schrumpft von 24 auf 22 MB.
  - **90 Formularfelder ohne AHB-Grundlage entfernt** (LOC+Z16/Z21, DTM+93, RFF+ACW …
    in Prüf-IDs, deren AHB diese Segmente nicht führt), 4 Platzhalter-Auswahlfelder
    („Zustimmung"/„Ablehnung") durch die EBD-Auswahl ersetzt.
  - **143 Angaben der Prozess-Meta korrigiert** (`werkzeuge/korrigiere_prozess_meta.py`):
    11 Transaktionsgründe, 54 EBD-Nummern und 78 Antwortcodes, die im jeweiligen
    Entscheidungsbaum nicht vorkamen oder zum falschen Cluster gehörten.
  - **Drei hart kodierte Prozessregeln an die Feldexistenz gebunden** — die
    Lokationsregel [348] schlug auch in Antwortnachrichten an, die gar kein LOC führen.
  - **Ein Extraktionsfehler behoben:** „EBD Nr. E_0286" war in IFTSTA als Code „E_028"
    gelesen worden.
  - **Entscheidungsbäume vollständig gelesen:** Ein Prüfschritt kann einen Antwortcode
    *und* einen Folgeschritt tragen (E_0043 Schritt 11) — bisher endete die Auswertung
    dort, wodurch Codes dahinter unerreichbar schienen. Statt aller Wege speichert der
    Leser jetzt je Code die zwingenden Antworten, ermittelt über eine
    Dominator-Analyse (linear statt kombinatorisch; ein Zwischenstand mit vollständiger
    Wegaufzählung erzeugte 1,6 GB).

  Beigelegt ist ein eigenes Paket mit dem EBD-Leser und der aufgeschlüsselten
  Baumstruktur: je Kapitel eine Datei (357 bzw. 350, gruppiert nach E/S/G/GS), dazu
  Übersicht, Sammelfassungen und die maschinenlesbare Gesamtfassung.

- **30.07.2026** – **Antwortcodes folgen den Prüfschritten des Entscheidungsbaums.**
  Drei Punkte:
  1. **Startseite aufgeräumt.** Das Themenfeld führt nur noch Themen mit
     Nachrichtentypen. Die reinen Verzeichniskategorien des BDEW (Codelisten,
     API-Webdienste, Formatübergreifende Dokumente, Redispatch, Regelungen zum
     Übertragungsweg) enthalten keine EDIFACT-Nachricht und sind daher nicht mehr
     wählbar — sie erscheinen automatisch wieder, sobald ein Generator dazukommt.
  2. **Alle Formularblöcke tragen ihre Statusfarbe.** „Muss-bedingt" und „Soll" hatten
     keine CSS-Regel und blieben ungefärbt — betroffen war unter anderem SG5 LOC+Z16
     („ID der Marktlokation"). Beide sind jetzt wie „bedingt" gekennzeichnet, mit
     Zusatz „(MUSS, bedingt)" bzw. „(SOLL)" am Feld.
  3. **Antwortcodes nach dem Entscheidungsbaum gefiltert.** Bisher wurden alle Codes des
     EBD zum passenden Cluster angeboten. Ein EBD führt aber über Prüfschritte zu seinen
     Codes, und manche Schritte fragen nach etwas, das in der Nachricht bereits steht.
     In E_0614 (Kündigung Vertrag prüfen) fragt Schritt 10 „Wurde im Geschäftsvorfall
     angegeben, dass es sich um eine verbrauchende Marktlokation handelt?" — nur der
     Nein-Zweig führt zu A12/A17. Wer im STS+7 die Ergänzung ZW4 meldet, bekommt sie
     jetzt nicht mehr angeboten (55017: A03/A09 statt A03/A09/A12/A17), beim Wechsel auf
     ZW3 dreht sich die Liste um. Die Prüfschritte und die Wege zu jedem Code stehen in
     `_engine/daten/ebd-pfade.js` (154 Entscheidungsbäume je Formatstand, gelesen mit
     ebdamame); welche Fragen sich aus dem Formular beantworten lassen, regelt eine
     kuratierte Tabelle in `_engine/antwortcode-auswahl.js` — Lokationsart
     (verbrauchend/erzeugend/Tranche/ruhend), Geschäftsvorfall 1–3 und die pauschale
     Marktlokation. Alle übrigen Fragen (Fristen, Vertragslage, Vollmacht, Systemstände
     des Empfängers) kann nur der Absender beantworten; sie bleiben unbewertet und ihre
     Codes wählbar. Der Filter räumt die Auswahl nie leer: Bliebe nichts übrig, bleiben
     alle Codes stehen. Wirkung: 88 Konstellationen, 454 nicht erreichbare Codes.
     Nachweis: `scripts/test_ebd_abhaengigkeiten.js` (267 Antwortnachrichten).
     Nebenbei: Vier Prüf-IDs (55017/55018 und ihre 202610-Zwillinge) führten im Feld
     „Status der Antwort" noch die Platzhalter „Zustimmung"/„Ablehnung" — sie zeigen
     jetzt ebenfalls die EBD-Auswahl.

- **30.07.2026** – **Formular: Zeitangaben, Vorbelegungen, Antwortcodes, Ansprechpartner.**
  Vier Verbesserungen aus der Anwendung:
  1. **Zeitangabe sichtbar.** Unter jedem Datumsfeld steht jetzt der Wert, der in die
     Nachricht geht, samt Lesart: `EDIFACT: 202608312200?+00:303 · 01.09.2026 00:00 MESZ
     = Tagesende 31.08.2026 24:00`. EDIFACT führt Termine in UTC, ein Termin „zum
     01.09." ist das Tagesende des Vortages — ohne den Hinweis wirkte die erzeugte
     Zeile wie ein anderer Tag als die Eingabe. Beim Gas wird der Beginn des Gastages
     (06:00) ausgewiesen, beim Nachrichtendatum die Uhrzeit der Erstellung.
  2. **Transaktionsgrundergänzung sinnvoll vorbelegt.** Regelfall ist die verbrauchende
     Marktlokation (ZW4); nennt der Anwendungsfall eine Erzeugung oder eine Tranche,
     gilt ZW3 bzw. ZW5. Bisher stand dort der erste Code der AHB-Liste.
  3. **Antwortcodes auch in den Vollformularen und allen übrigen Nachrichtentypen.**
     Das Feld „Code des Prüfschritts" (STS+E01/Z35) ist jetzt überall ein Auswahlfeld
     aus dem im AHB genannten EBD, gefiltert nach Cluster — die Bedingung am
     Datenelement sagt, welches gilt ([360] Zustimmung, [359] Ablehnung), ersatzweise
     die Prozess-Meta oder die Bezeichnung des Anwendungsfalls. Die EBD-Nummer (DE1131)
     zieht bei mehreren zulässigen EBD automatisch nach. Die Auswahl steht jetzt in
     `_engine/antwortcode-auswahl.js` — dieselbe Logik für kuratierte Masken und Engine.
  4. **Ansprechpartner (CTA/COM) nicht mehr vorbelegt.** Der AHB führt die
     Segmentgruppe überwiegend als „Kann"; ohne Eingabe entfallen die Segmente. Neu
     sind zwei optionale Felder (Name, E-Mail). Wo der AHB die Gruppe als „Muss" führt
     (87 Prüf-IDs, u. a. PARTIN, ORDERS/ORDRSP SG5, QUOTES/REQOTE), entstehen weiterhin
     Beispielangaben — mit Hinweis.

  Nebenbei bereinigt: Die ORDERS-Seiten luden noch eine zweite, veraltete Formular-Meta
  (`_orders-meta.js` ohne Segmentgruppen-Ausdrücke); sie nutzen jetzt wie alle anderen
  `_form-meta.js`. Die verwaiste `_mscons-meta.js` ist entfernt. Golden-Snapshots Strom
  bewusst neu gesetzt (21 Nachrichten mit ZW4 statt ZW3).

- **30.07.2026** – **Aufbau des STS-Segments (Transaktionsgrund und Ergänzung).** Das
  STS-Segment führt die Gruppe C556 („Statusanlaß") mehrfach — in UTILMD Strom dreimal,
  jede mit dem Datenelement 9013:
  `STS+7++<Transaktionsgrund>+<Ergänzung>+<Ergänzung für Lieferende bei befristeter
  Anmeldung>` (MIG-Beispiel `STS+7++E01+ZW4+E03'`). Weil die AHB-Tabelle alle drei
  „DE 9013" nennt, lagen ihre Codes bisher in einem einzigen Mehrfachauswahlfeld und der
  Generator schrieb nur den ersten Wert — aus E03 + ZW4 wurde `STS+7++E03'` ohne
  Ergänzung. Neu gelesen wird der Segmentaufbau jetzt direkt aus den MIG
  (`werkzeuge/lies_sts_struktur.py` → `_engine/daten/sts-struktur.js`); jedes
  Datenelement der Formular-Meta trägt seine Stelle im Segment
  (`werkzeuge/teile_sts_positionen.py`, 96 Instanzen zerlegt). Formular, Generator und
  Validator arbeiten damit positionsgenau:
  - eigenes Auswahlfeld je Wiederholung (Transaktionsgrund, Ergänzung, Ergänzung für
    befristetes Lieferende) statt einer vermengten Mehrfachauswahl;
  - die Zeitraum-ID (DE 9012) steht als viertes Unterelement derselben Gruppe:
    `STS+E01++A01:E_0004::2'` statt bisher `…+2'`; ebenso die ID der betroffenen
    Lokation in `STS+Z35++A32:E_0624+ZW5:::20072281644'`;
  - die kuratierten UTILMD-Masken unterscheiden Grund und Ergänzung nicht mehr am
    Codemuster, sondern an der MIG-Codeliste (ZX6 „Änderung Daten der MaLo" ist ein
    Grund, ZX0 „Fall 3" eine Ergänzung) und bieten für 55013/55014/55015/55600/55602 das
    neue Feld „Ergänzung für Lieferende bei befristeter Anmeldung" an;
  - der Validator meldet einen Code an falscher Stelle als Fehler („Code ZW3 steht in
    Element 3, gehört laut MIG aber als Transaktionsgrundergänzung in Element 4").
  Fachlich korrigiert: In 55013/55014/55015 waren E01/E03 als Transaktionsgrund
  gelistet, obwohl der AHB sie dort nur als Ergänzung für das befristete Lieferende
  führt; Vorgabe ist jetzt E06 (Ersatzbelieferung). Golden-Snapshots Strom bewusst neu
  gesetzt (47 bzw. 48 Nachrichten). Nachweis: `scripts/test_sts_aufbau.js`
  (748 STS-Segmente, 94 mit Ergänzung, 89 mit Zeitraum-/Lokations-ID).

- **30.07.2026** – **Bildschirmaufteilung.** Das Ausgabefeld ist jetzt 112 Zeichen breit
  (Maßstab: längste reguläre Segmente wie UNB und Adress-NAD) — ein Segment je Zeile,
  nur Freitexte brechen um. Die Folgenachrichten stehen in einer festen, schmalen
  Spalte (320 px) mit Prüf-ID und Kurzbeschreibung; sie hängt sich als dritte Spalte
  ins Raster und rutscht erst unter rund 1.660 px Fensterbreite darunter. Die
  Engine-Seiten nutzen bis 2.000 px Seitenbreite.

- **30.07.2026** – **Antwortcodes aus den Entscheidungsbaum-Diagrammen.** Grundlage ist
  jetzt das Hochfrequenz-Werkzeug **ebdamame** auf der DOCX-Fassung des EBD-Dokuments
  (`werkzeuge/ebd_docx_leser.py`, Spiegel `eem/edi_energy_de`, je Formatstand die
  Fassung mit dem jüngsten Dokumentstand: EBD 4.2 vom 23.06.2026 und EBD 4.3 vom
  01.10.2026). Die reinen Codelisten-Kapitel (S_/G_-Schlüssel mit den Antwortcodes der
  Servicenachrichten), die ebdamame nicht konvertiert, liefert `ebd_pdf_leser.py` aus
  der PDF-Fassung; beide Quellen werden zusammengeführt. Zusammen: 357 bzw. 350 EBD mit
  2.194 bzw. 2.180 Codes, davon rund 1.450 mit Cluster. Das Feld „Status der Antwort" ist jetzt ein Auswahlfeld: Die
  gültigen EBD kommen aus dem AHB (STS+E01 DE1131), die Codes aus dem EBD — gefiltert
  nach Cluster, also Zustimmungscodes in Bestätigungen und Ablehnungscodes in
  Ablehnungen. Der Validator beanstandet Codes des falschen Clusters. Korrigiert:
  10 Prüf-IDs trugen einen Code des falschen Clusters (55064: A01 ist in E_0009
  Ablehnung), 12 verwiesen auf ein EBD, das der AHB nicht führt, und 32 Gas-Antworten
  trugen Codes fremder Listen. Golden-Snapshots bewusst neu gesetzt. Nachweis:
  `scripts/test_antwortcodes.js` 12/12.

- **30.07.2026** – **Konsolidierung: eine Datenhaltung, eine Prüflogik.** Die zweite
  Kopie der AHB-Struktur (`pruef-ids/ahb-vollform/`, 553 Dateien) ist abgeschafft —
  Vollformular und Validator lesen `pruef-ids/_form-meta.js` wie alle anderen
  Nachrichtentypen; das Paket schrumpft von 32 auf 24 MB. Die eigene Importprüfung der
  UTILMD-Masken (`_engine/validator.js`, 548 Zeilen) ist durch
  `_engine/import-pruefung.js` ersetzt, die den zentralen `ahb-validator.js` nutzt:
  Jede Maske prüft jede Nachricht gegen deren eigenes AHB/MIG und weist die Herkunft
  aus. Dabei behoben: kontextabhängiges Feldformat für STS DE9012, Artikelnummern-
  Codeliste als Auszug gekennzeichnet, neue Schicht `daten/ahb-ergaenzungen.js` für
  Segmente aus AHB-Kapiteln außerhalb der Prüf-ID-Tabellen (Produktpaket-Block), und
  ein Parser-Unterschied in `folgenachrichten.js`, der alle Feldübernahmen hätte leer
  laufen lassen. Prüf-ID-Bezeichnungen kommen projektweit aus der Anwendungsübersicht.
  Testlage unverändert grün; Selbstvalidierung jetzt 475 Befunde (andere, strengere
  Grundlage — nicht mit den früheren 253 vergleichbar).

- **29.07.2026** – **Verwendungszeitraum über alle Nachrichten abgeglichen.** Der AHB
  führt ihn in 90 (202604) bzw. 92 (202610) Prüf-IDs — UTILMD Strom und UTILTS — mit
  sechs Qualitäten: Z49/Z53 (gültige/keine Daten) bei der Datenübermittlung sowie
  Z47/Z54 (im System vorhanden/nicht vorhanden) und Z48/Z55 (erwartet/nicht erwartet)
  bei den Rückmeldungen des Datenclearings. Die Engine erkannte nur Z49/Z53 und konnte
  die Gruppe für 43 bzw. 44 Prüf-IDs nicht wiederholen; die kuratierte Maske ließ die
  SG6-Gruppe in 48 Prüf-IDs ganz weg, weil sie an eine feste Liste von
  Transaktionsgründen gebunden war statt an den AHB der Prüf-ID — Rückmeldungen
  verwiesen in STS+E01 auf eine Zeitraum-ID, die die Nachricht nicht führte. Beides ist
  behoben, die Qualitätsauswahl kommt je Prüf-ID aus der AHB-Datenbasis. Golden-
  Snapshots Strom bewusst neu gesetzt (47 bzw. 48 Prüf-IDs mit zusätzlichem
  RFF+Z47::1/RFF+Z49::1), Gas unverändert. Nachweis: `scripts/test_zeitscheiben.js`
  12/12 inklusive Abdeckung aller betroffenen Prüf-IDs.

- **29.07.2026** – **Verwendungszeitraum der Daten in zwei Zeitscheiben.** Nach einem
  Lieferbeginn meldet der Netzbetreiber die Stammdaten mit zwei Zeiträumen: bis zum
  Lieferbeginn „Keine Daten" (SG6 RFF+Z53), ab dem Lieferbeginn „Gültige Daten"
  (RFF+Z49). Die Formular-Engine kann die SG6-Gruppe jetzt wiederholen
  („+ weiterer Verwendungszeitraum") und vergibt die Zeitraum-ID nach Bedingung [126];
  die Folgenachrichten einer 55001 belegen beide Scheiben aus DTM+137 und DTM+92 vor
  ([131] Beginn frühestens am Folgetag, [471] letzte Scheibe ohne Ende). Dabei behoben:
  die Engine gab das DE1156 nie aus (`RFF+Z49::1`), und übernommene Zeitpunkte wurden
  nicht in Ortszeit zurückgerechnet — in der Sommerzeit zwei Stunden Versatz. Die
  kuratierte Maske bietet die zweite Zeitscheibe über eigene Felder an. Nachweis:
  `scripts/test_zeitscheiben.js` 8/8 (Zeitzone Europe/Berlin), Golden 189 unverändert.

- **29.07.2026** – **Prüfgrundlage folgt der Nachrichtenversion.** Die Importprüfung der
  UTILMD-Masken hatte die erwartete UNH-Kennung fest als `UTILMD:D:11A:UN:S2.2`
  verdrahtet: Eine S2.1-Nachricht wurde auch auf der 202604-Seite als „Version
  unerwartet" gemeldet, auf den Gas-Seiten galt ohnehin G1.1/G1.2. Die Sollkennung
  kommt jetzt aus `formatConfig.unhKennung`, ebenso die Sparte für die
  Sommer-/Winterzeitprüfung. Trägt eine Nachricht eine fremde Kennung, benennt die
  Maske die zuständige Stelle aus der Validator-Registry, unterlässt alle AHB-/MIG-
  abhängigen Prüfungen (nur noch Syntax) und bietet die Übergabe an den universellen
  Validator an (`validator.html#pruefe=…`), der Formatstand, Sparte und Prüf-ID aus
  der UNH-Kennung selbst bestimmt. Nachweis: `scripts/test_version_zustaendigkeit.js`
  40/40.

- **29.07.2026** – **Bedingungs-Hilfe auch in den AHB-Vollformularen.** Die vier
  `vollformular.html` banden weder `bedingung-hilfe.js` noch die Bedingungstexte ein —
  dort fehlten die Fragezeichen-Symbole, was beim Absprung aus einer Folgenachricht
  auffiel. Beide Skripte sind ergänzt, `scripts/test_bedingung_hilfe.js` prüft die
  Vollformulare jetzt mit (Vollnachweis über alle 553 Prüf-IDs: 11.732 Ausdrücke,
  alle mit Symbol, kein Verweis ohne Klartext). Nebenbefund behoben: Das Auswahlfeld
  zeigte nur die Nummer ohne Bezeichnung; die Bezeichnungen kommen jetzt aus der
  Anwendungsübersicht statt aus der AHB-Extraktion, deren Texte Trennartefakte aus
  dem DOCX-Zeilenumbruch tragen („Bestätigun g Anmeldung", 52 Fälle).

- **29.07.2026** – **Marktpartnerrollen und Stammdatenänderungen.** Die
  Folgenachrichten ordnen Absender und Empfänger jetzt über die Rolle im
  Prozessschritt zu statt über einen pauschalen Richtungstausch. Jede Kette führt die
  Rollen der Quellnachricht (`quelleVon`/`quelleAn`), jeder Schritt seine eigenen; die
  Auflösung erfolgt in vier Stufen (gleiche Bezeichnung · gleiches Basiskürzel · Bezug
  auf die Ursprungsnachricht · verwandte Rolle wie LF/LFN) und nur bei Eindeutigkeit.
  Rollen, die die Quellnachricht nicht führt — etwa der alte Lieferant bei einer
  Anmeldung des neuen —, bleiben leer, orange markiert und mit Hinweistext; geraten
  wird nichts. Der Bereich bündelt die Nachrichten nach Empfänger. Neu angeboten
  werden die Stammdatenänderungen des Netzbetreibers an den Lieferanten: 55615 (NeLo),
  55616 (MaLo), 55617 (TR), 55618 (SR), 55619 (Tranche), 55620 (MeLo), 55691
  (Paket-ID), 55175 (Lokationsbündelstruktur) und 55225 (Blindarbeits-Abrechnungsdaten)
  — für 55001 damit 20 Folgenachrichten. Nachweis: `scripts/test_folgenachrichten.js`
  38/38.

- **29.07.2026** – **Folgenachrichten eines Geschäftsprozesses.** Aus einer vorliegenden
  Nachricht lassen sich die weiteren Nachrichten ihres Use-Cases als vorbefüllte
  Testnachrichten erzeugen — im Generator, im Vollformular und im Validator. Für 55001
  sind das elf Nachrichten des Use-Cases „Lieferbeginn" (55002/55003, 55036, 55010–55012,
  55037/55038) samt der nachgelagerten Abrechnungsdaten 55218/55126/55672. Übernommen
  werden getauschte Marktpartner, Marktlokation, Termine und Transaktionsgrund; die
  Vorgangsnummer der Quelle wird zur Referenz RFF+TN, die Antwort erhält eine eigene.
  Nicht ableitbare Angaben bleiben leer. Grundlage: `_engine/daten/prozessketten.js`
  (697 Ketten, 3.959 Folgenachrichten). Dabei behoben: die UTILMD-Vollformulare beruhten
  auf veralteten Extraktionsdaten (553 Dateien neu erzeugt), die Vollformularseiten
  brachen mit „ahbVollformMeta is not defined" ab, und der Validator verlangte
  Muss-Segmente, deren Bedingung an der Segmentgruppe hängt (jetzt berücksichtigt).

- **28.07.2026** – **Bedingungs-Hilfe vollständig.** Das Fragezeichen-Symbol erscheint
  jetzt an jedem Feld, für das der AHB eine Bedingung führt: an der Segmentgruppe
  (deren Ausdruck bisher gar nicht angezeigt wurde), am Segment, an jedem Datenelement
  in allen Feldarten, an Bedingungen einzelner Codewerte und am Format-Datenelement
  DE2379. Auf den vier UTILMD-Seiten gab es zuvor kein einziges Symbol — der Generator
  gab keinen Ausdruck aus und die dortigen Bedingungsdateien stellten ihre Texte nicht
  unter `window.EdiBedingungen` bereit. Neu erklärt werden außerdem die übergreifenden
  Zeitpunktbedingungen [UB1]/[UB2]/[UB3] und die Paketangaben [1P0..1]. Nachweis über
  alle 968 Prüf-IDs: 7.212 Ausdrücke, alle mit Symbol; 13.123 Verweise aufgelöst, keiner
  ohne Klartext; 0 AHB-Bedingungen unerreichbar (`scripts/test_bedingung_hilfe.js`).

- **28.07.2026** – **Vollständiger AHB-Abgleich aller 965 Prüf-IDs beider Formatstände.**
  Zwei eigene AHB-Leser (`nested`/`tabs`) erschließen jetzt auch die DOCX mit
  verschachtelten Tabellen, an denen kohlrahbi scheitert — die Datenbasis deckt alle
  Nachrichtentypen ab (vorher 544 von 965 Prüf-IDs). Je Prüf-ID sind sämtliche
  Datenelemente mit Muss/Kann/X-Status, Bedingungsausdrücken und Codewerten in
  `pruef-ids/_form-meta.js` hinterlegt (23.311 Segmentinstanzen, 55.929 Datenelemente,
  50.521 Codewerte). Neu: Segmentgruppen tragen ihren eigenen Bedingungsausdruck
  (`sgExpr`), und eindeutig auswertbare Bedingungen schalten abhängige Felder im
  Formular (`schalter` bzw. `abhaengig`) — etwa SG5 LOC+Z16 gegenüber LOC+Z22 je
  nach Transaktionsgrundergänzung ZW4/ZAP in Prüf-ID 55001. Der Generator übernimmt
  ausgeschlossene Segmente nicht mehr in die Nachricht und meldet fehlende
  Pflichtangaben bedingter Segmente als Fehler. Korrigiert außerdem: 52 Codelisten in
  den UTILMD-Regeldateien (u. a. die Platzhalterliste ZW4/ZW3/ZW5 im STS+7),
  2.497 im AHB geführte, bisher fehlende Segmente ergänzt, 14 `_bedingungen.js` mit
  ungültigem JavaScript repariert (unmaskierte Zeilenumbrüche — die Bedingungs-Hilfe
  war auf diesen Seiten ohne Funktion), Bedingungs-Hilfe jetzt in allen 36
  Generator-Seiten eingebunden. Protokoll: `docs/Pruefid-Abgleich_20260728.md` und
  `docs/Pruefid-Abgleich_20260728.csv`.
- **28.07.2026** – Hochfrequenz-Toolchain für die neuen edi_energy-Formatversionen nutzbar
  gemacht: **migmose** (MIG-Reader) und **kohlrahbi** (AHB-Scraper) lesen die neue
  Dateibenennung und bevorzugen die frei lesbare konsolidierte Fassung (`_ooox_`). Beide
  Formatstände komplett extrahiert (FV2604: 349 Prüf-IDs / 11 Typen; FV2610: 195 Prüf-IDs) als
  Segment-Muss/Kann/Soll-Rohdaten für die laufende Neu-Validierung. Patches, Daten und
  Statusbericht liegen außerhalb des Repos im Übergabepaket. Offener Punkt: einige neue DOCX
  (u. a. UTILMD Gas 1.2 in FV2610) nutzen eine unregelmäßige Zell-Verschmelzung im Tabellenkopf,
  an der python-docx' Grid-Rekonstruktion scheitert – die Prüf-IDs sind vorhanden, brauchen aber
  einen Roh-XML-Zellenleser (siehe `Übergabe.md`).
- **28.07.2026** – Startseite: „gültig bis"-Hinweis aus der Formatversions-Auswahl entfernt.
- **~26.07.2026** – Bedingungs-Hilfe: pro AHB ausgelagerte Bedingungstexte (`_bedingungen.js`),
  Hilfesymbol (Fragezeichen im Kreis) mit Symbolerklärung (∧/∨/⊻) und referenzierten
  Bedingungstexten in Generator- und Validator-Masken; ahbicht-gestützte harte „Muss [nn]"-Prüfung.
- **~26.07.2026** – UTILMD-Prüf-ID-Auswahl nach AHB-Kapitel aufsteigend sortiert (`kapitel-sort.js`).
- **~25.07.2026** – Validator-Fix: fehlende MUSS-Angaben werden nicht mehr als korrekt gewertet.
- **~24.07.2026** – GitHub-Pages-Fix (`.nojekyll`), README + MIT-Lizenz.
