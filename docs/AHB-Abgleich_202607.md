# AHB-Abgleich und Ausbau (22./23.07.2026)

> Historische Arbeitschronik. Sie beschreibt den Ausbau im Juli 2026, als nur der
> Formatstand 202610 existierte. Der fortgeschriebene Abgleich steht in
> `Pruefid-Abgleich_20260728.md`, der aktuelle Umsetzungsstand in `../README.md`.

Referenzen (BDEW-MAKO, frei verfügbare informatorische Lesefassungen für Formatstand 202610):
UTILMD Strom AHB 2.2 (Stand 29.06.2026, fileId 12273), UTILMD Gas AHB G1.2 (Stand 29.06.2026,
fileId 12264) sowie die 202610-AHBs aller übrigen Formate (fileIds siehe pruef-ids/_format.js
bzw. Dateikopf). Extraktion: neues BDEW-Tabellenlayout, Werkzeug `neues_layout_extractor.py`.

## 1. Validierung UTILMD Strom (189 Prüf-IDs)

Vollabgleich aller pruef-ids/*.js gegen AHB 2.2: Segment-/Qualifier-Existenz, Statusklassen,
Bedingungsnummern. 13 Befunde, alle korrigiert:

- 55007, 55008: `DTM_92` (Vertragsbeginn) entfernt - existiert im AHB für diese
  Abmelde-Anwendungsfälle nicht (nur DTM+93/+206).
- 55036, 55037, 55038, 55218, 55220: `FTX` entfernt - kein FTX im AHB dieser Prüf-IDs.
- 55077, 55078, 55601, 55603: `DTM_93` (Vertragsende) entfernt - existiert im AHB der
  Anmeldung erzeugender/neuer MaLo nicht (stattdessen ggf. DTM+Z07/Z08).
- 55071, 55072 (Aktivierung/Deaktivierung Zuordnungsermächtigung): komplett neu aufgebaut.
  Vorher fälschlich `LOC_Z15`; laut AHB identifiziert der Anwendungsfall über SG8 SEQ+Z22,
  SG10 CCI+Z20/Z19/15 (+CAV), SG12 NAD+VY; zusätzlich SG4 DTM+158/+159 (Bilanzierungs-
  beginn/-ende) und SG6 RFF+Z13 ergänzt.

Ergebnis nach Korrektur: 0 offene Befunde; alle 189 Dateien laden fehlerfrei (Node-Check).

## 2. Validierung UTILMD Gas (89 Prüf-IDs)

Gleicher Vollabgleich gegen AHB G1.2. 9 Befunde, alle korrigiert:

- 44010, 44011, 44012, 44036, 44037, 44038: `FTX` entfernt - kein FTX im AHB.
- 44022, 44023, 44024 (Anfrage/Bestätigung/Ablehnung Stornierung): komplett neu aufgebaut.
  Vorher fälschlich `LOC_172`; laut AHB läuft die Referenzierung über SG6 RFF+TN/+ACW,
  SG4 STS+7 (E05 Stornierung) und STS+E01 (Status der Antwort); FTX+ACB ist Kann.

Ergebnis nach Korrektur: 0 offene Befunde; alle 89 Dateien laden fehlerfrei.

## 3. Neu aufgebaute Formate (Formatstand 202610, automatisch generiert)

Je Format `pruef-ids/<pruefi>.js` (vollständige Segmentliste mit Status, Regeltext und
Bedingungsnummern aus dem AHB) plus `_format.js` (UNH-Kennung aus dem AHB abgeleitet):

- Berichte: IFTSTA 2.1 (32), INSRPT 1.1g (8)
- Bestellvorgang: ORDCHG 1.1 (3), ORDERS 1.1b (44), ORDRSP 1.1b (39), QUOTES 1.1a (5), REQOTE 1.2 (5)
- Bewegungsdaten: MSCONS 3.2 (25)
- Rechnungsstellung: COMDIS 1.0h (2), INVOIC 1.0b (11), PRICAT 2.1 (3), REMADV 1.0a (4)
- Servicenachrichten: APERAK 1.1 (2, ohne Prüf-IDs -> Schlüssel je Meldungsart),
  CONTRL 1.0 (3, dito)
- Stammdaten: PARTIN 1.1 (14), UTILTS 1.1 (8)

Gesamt: 208 neue Datendateien. Statusabbildung: Muss (unbedingt) -> "Muss";
Muss/X mit Bedingungen -> "Muss-bedingt" (+ rule/bedingungen); Soll -> "Bedingt";
Kann -> "Kann". Kuratierung (Formularauswahl, isSelect-Optionen, _prozess-meta,
index.html-Anbindung, golden-Tests) steht für diese Formate noch aus.

## Bekannte Grenzen

- APERAK: Statuszuordnung zu den zwei Meldungsspalten teils heuristisch (Tab-Layout der Quelle).
- Die generierten Dateien sind Rohdaten in Projektkonvention, kein Ersatz für die
  handkuratierte Tiefe der UTILMD-Strom/Gas-Umsetzung.

## 4. Neuer Formatstand 202604: UTILMD Strom S2.1 (23.07.2026)

Quelle: UTILMD AHB Strom 2.1, konsolidierte Lesefassung mit Fehlerkorrekturen Stand
29.06.2026 (gültig 29.06.-30.09.2026; docx fileId 12271, PDF fileId 12280).

- `202604/Stammdaten/UTILMD/Strom/` als Vollableitung aus dem validierten 202610-Stand:
  alle 187 S2.1-Prüf-IDs (55693/55694 existieren erst ab S2.2 und wurden entfernt,
  inkl. Registry- und index.html-Einträgen).
- `_format.js`: UNH-Kennung UTILMD:D:11A:UN:S2.1.
- `_bedingungen.js`: komplett neu für S2.1 erzeugt (638 Bedingungen) über
  scripts/extract_bedingungen.py (PDF-Klartext) + scripts/generate_bedingungen_js.py;
  344 Texte zusätzlich durch die saubereren docx-Tabellenzellen abgesichert (Overrides).
  Prüflogik-Overlay (19 Einträge) aus logik_strom.json übernommen.
- Validierung: alle 187 pruef-ids/*.js gegen das S2.1-AHB abgeglichen -
  0 Befunde (Segment-/Qualifier-Existenz), alle Dateien laden fehlerfrei,
  alle referenzierten Bedingungsnummern haben S2.1-Texte.
- golden/: S2.2-Snapshots entfernt; Golden-Master für S2.1 ist neu aufzuzeichnen.
- Hinweis: _prozess-meta.js, _mig-codelisten.js und Produktpaket-Daten wurden aus dem
  S2.2-Stand übernommen (Prozesse weitgehend identisch); eine gezielte S2.1-Verifikation
  dieser Metadaten steht aus.

## 5. Startseiten-Auswahl 202604 + UTILMD Gas G1.1 (23.07.2026)

- Start-`index.html`: MANIFEST um Formatstand **202604** ergänzt (steht als aktuell
  gültige Version an erster Stelle der Auswahl); Varianten Stammdaten -> UTILMD ->
  Strom (AHB S2.1) und Gas (AHB G1.1) verlinkt, übrige Themen als geplant.
- `202604/Stammdaten/UTILMD/Gas/`: Vollableitung aus dem validierten 202610-Gas-Stand.
  Quelle: UTILMD AHB Gas 1.1, konsolidierte Lesefassung Stand 27.03.2026 (docx 12123,
  PDF 12122). 44183 existiert erst ab G1.2 und wurde entfernt (inkl. Registry/index).
  UNH-Kennung UTILMD:D:11A:UN:G1.1. `_bedingungen.js` neu für G1.1 erzeugt
  (147 Bedingungen; PDF-Klartext + 92 docx-abgesicherte Overrides; Logik-Overlay 23).
  Validierung: 88/88 Dateien ohne Befund gegen das G1.1-AHB, alle Bedingungsnummern
  abgedeckt, Golden-Master zurückgesetzt.

## 6. CONTRL-Generator (23.07.2026)

- Neue Generator-Seite `202610/Servicenachrichten/CONTRL/index.html` für den Syntax- und
  Servicebericht (CONTRL:D:3:UN:2.0b, AHB 1.0). Drei Meldungsarten gemäß AHB-Spalten:
  Empfangsbestätigung (UCI 0083=7), Syntaxfehlermeldung Übertragungsdatei (UCI 0083=4 +
  DE0085/DE0013/DE0098) und Syntaxfehlermeldung in der Nachricht (SG1 UCM je Nachricht,
  optional SG2 UCS/UCD; mehrere Nachrichten pro CONTRL möglich).
- Datenbasis: die maschinell extrahierten AHB-Dateien unter pruef-ids/ (Segmentübersicht
  wird in der Seite datengetrieben angezeigt); Fehlercodes DE0085 als kuratierte
  UNTDID-Auswahl. MP-ID-Qualifier wie im Projekt üblich präfixbasiert (99->BDEW, 4->GS1).
- In der Start-index.html in beiden Formatständen als verfügbar registriert (AHB 1.0
  gilt seit 01.10.2025 durchgängig, daher eine gemeinsame Seite).
- Headless-Test (Chromium): alle drei Meldungsarten erzeugen syntaktisch korrekte
  Nachrichten (UNT-Zählung geprüft), keine JS-Fehler; Auswahlkette der Startseite
  bis zur CONTRL-Variante funktioniert.

## 7. APERAK-Generatoren (23.07.2026)

- `202604/Servicenachrichten/APERAK/` - AHB 1.0 (konsolidierte Lesefassung Stand
  30.09.2025, gültig 01.10.2025-30.09.2026), UNH APERAK:D:07B:UN:2.1i.
- `202610/Servicenachrichten/APERAK/` - AHB 1.1 (gültig ab 01.10.2026),
  UNH APERAK:D:07B:UN:2.2; pruef-ids mit dem verbesserten Extraktor neu erzeugt.
- Zwei Meldungsarten je Stand: Anerkennungsmeldung (BGM 312) und Anwendungsfehler-
  meldung (BGM 313) mit SG4 ERC (27 Fehlercodes Z10-Z44 datengetrieben aus dem AHB,
  inkl. Rekonstruktion der durch Seitenumbruch getrennten Codeliste), SG4 FTX+ABO,
  SG5 RFF+ACW/FTX+AAO/FTX+Z02/RFF+TN. Referenzblock SG2 RFF+ACE/DTM+171/RFF+AGO/RFF+TN.
- EDIFACT-Freistellung (? + : ') für Freitext-/Referenzfelder ergänzt - auch in der
  CONTRL-Seite nachgezogen.
- MANIFEST: APERAK in 202604 (AHB 1.0) und 202610 (AHB 1.1) als verfügbar registriert
  (gemäß Arbeitskonvention im README).
- Headless-Tests: beide Seiten, beide Meldungsarten, Startseiten-Auswahlketten und
  Escaping geprüft; keine JS-Fehler.

## 8. Versionsregel + CONTRL in beiden Formatständen (23.07.2026)

- Prüfung BDEW-MAKO: Für CONTRL existiert KEINE neue Version zum Formatwechsel
  01.10.2026 - AHB 1.0 (Stand 11.12.2025) und MIG 2.0b gelten mit offenem Ende weiter
  (nur eine folgenlose Konsultationsfassung 02/2025). 
- Konsequenz gemäß neuer Versionsregel (README): CONTRL-Generator physisch in BEIDE
  Ordnerbäume aufgenommen (202604/ und 202610/Servicenachrichten/CONTRL/), Breadcrumbs
  je Formatstand, MANIFEST verlinkt je Formatstand auf den eigenen Ordner.
- Versionsregel im README verankert: immer zuerst die aktuell gültige Formatversion
  bauen, danach die zukünftige; ohne Änderung zum Wechseldatum wird die gültige
  Version in beide Bäume/Auswahlpfade übernommen.

## 9. MSCONS-Generatoren (23.07.2026)

- Gemäß Versionsregel beide Stände gebaut: `202604/Bewegungsdaten/MSCONS/` mit
  AHB 3.1g (UNH MSCONS:D:04B:UN:2.4c, gültig bis 30.09.2026) und
  `202610/Bewegungsdaten/MSCONS/` mit AHB 3.2 (UNH ...:2.5, ab 01.10.2026).
- Je Stand: 25 Prüf-ID-Dateien (Neuextraktion mit aktuellem Extraktor), _pid-registry,
  _format.js und NEU `_mscons-meta.js` - je Prüf-ID maschinell extrahiert: BGM-Codes,
  Anwendungsreferenz (UNB 0026), LOC-Qualifier, Werttypen (QTY 6063), SG10-DTM-Qualifier,
  OBIS-Codelistenkennung. Die Generator-Seite passt Auswahllisten je Prüf-ID daran an.
- Nachrichtenaufbau: UNB(0026)/UNH/BGM(1225=9)/DTM+137/SG1 RFF (Z13, opt. AGI/Z30)/
  SG2 NAD+MS mit SG4 CTA/COM (AHB-Muss)/NAD+MR/UNS/SG5 NAD+DP/SG6 LOC/opt. SG7 RFF+MG/
  je Position SG9 LIN+PIA (OBIS mit ?:-Freistellung) und SG10 QTY + DTM 163/164/9.
  Mehrere Positionen je Nachricht möglich. SG10-STS (Plausibilisierung/Ersatzwert)
  bewusst noch nicht enthalten (im Seitenfuß dokumentiert).
- MANIFEST beide Stände registriert; Headless-Tests: beide Seiten (13002 komplett,
  13018-Metadaten geprüft), Startseiten-Ketten, keine JS-Fehler.

## 10. MSCONS vervollständigt (23.07.2026)

Vollausbau beider Stände (3.1g/3.2) in Breite und Tiefe, komplett datengetrieben
über `_mscons-meta.js` v2 (je Prüf-ID maschinell aus dem AHB):

- BGM DE1001 UND DE1225 (z. B. 13006 Storno -> Funktion 1 statt 9), UNB DE0026.
- SG1-RFF-Referenzen je Prüf-ID (AGI/Z30/... nur wo im AHB vorhanden, Z13 automatisch).
- SG6: LOC-Objekttypen je Prüf-ID (172 Meldepunkt, Z04/Z06 Profile, 237/107 EEG-ZR)
  PLUS SG6-DTM-Zeiträume auf Objektebene (163/164/492/293/157) mit AHB-Formaten.
- SG7-RFF (MG Gerätenummer, AGK Konfigurations-ID) nur wo vorhanden.
- Positionsteil abschaltbar (13006 Storno hat keinen); mehrere Positionen möglich.
- SG10 vollständig: Werttypen (QTY 6063) je Prüf-ID, DTM-Qualifier mit korrekten
  Formaten (303/102/610 - z. B. Leistungsperiode 306 als CCYYMMDD, Bilanzierungsmonat
  492 als CCYYMM), UND die STS-Statusgruppen mit vollständigen Codelisten
  (Z33 Plausibilisierung, Z32 Ersatzwertbildung, Z34 Korrekturgrund, Z40 Grund der
  Ersatzwertbildung, Z31 Gasqualität, 10 Zählzeit) als Mehrfachauswahl je Position
  (Ausgabe STS+q++c1+c2').
- Regelprüfungen: Messperiode [11] (163 UND 164), mind. eine Zeitangabe je Position,
  Formatvalidierung aller Zeitfelder, Pflichtfelder inkl. SG4 COM.
- Headless-Regression über Strukturvarianten (13002/13006/13010/13013/13017/13018)
  in beiden Ständen: fehlerfrei.

## 11. ORDERS komplett (23.07.2026)

- Gemäß Versionsregel beide Stände: `202604/Bestellvorgang/ORDERS/` mit AHB 1.1a
  (UNH ORDERS:D:09B:UN:1.4b, 46 Prüf-IDs) und `202610/.../ORDERS/` mit AHB 1.1b
  (UNH ...:1.4c, 44 Prüf-IDs; 17003/17011 entfallen ab 10/2026).
- NEU: universelle AHB-Formular-Engine. ORDERS ist strukturell heterogen (29
  Strukturcluster); statt kuratierter Einzelmasken erzeugt `_orders-meta.js` je
  Prüf-ID die geordnete Segmentliste des AHB (alle Instanzen mit DEs, Codelisten,
  Muss/Soll/Kann-Ausdrücken), aus der Formular UND Nachricht segmentgenau gebaut
  werden. Anwendungsfallnamen + Kommunikationsrichtung aus den Tabellenköpfen geerntet.
- Emitter für alle vorkommenden Segmenttypen: BGM, DTM (303/102/610), IMD (C272/C273),
  FTX (inkl. DE1131-EBD-Verweis), RFF (Z13 automatisch), NAD (MP-IDs + Endkunden-
  Anschrift), LOC, CTA/COM, LIN (mit DE1229-Aktionscode), PIA, QTY, CCI/CAV;
  UNS+S einmalig nach dem Positionsteil; Positionsteil (SG29-SG38) wiederholbar.
- Pflichtlogik: unbedingte Muss-Segmente erzwingen Auswahl/Eingabe (identifizierender
  Code-DE), bedingte Segmente sind optional; Fehlerliste statt stiller Auslassung.
- Vollregression: ALLE 46 (1.1a) und ALLE 44 (1.1b) Prüf-IDs headless generiert -
  jeweils 100 % fehlerfrei; Mehrfachpositionen und Startseiten-Ketten geprüft.

## 12. Zentrale AHB-Formular-Engine + UTILMD-Vollformular (23.07.2026)

- `_engine/ahb-form-engine.js`: die universelle Formular-Engine (zuvor inline in den
  ORDERS-Seiten) ist jetzt zentral und formatübergreifend. Erweiterungen: UNB-0026-
  Auswahl, STS vollständig (C601/9015 + C555/4405 + C556/9013 mit EBD-Nr. 1131 und
  Zeitraum-ID 9012), IDE mit automatischer Vorgangsnummer, Qualifier-only-RFF,
  synthetisches LOC-ID-Feld, QTY-Zahlenvalidierung, Regel [11] (163+164) generisch,
  UNS-Position automatisch (UNS+D vor bzw. UNS+S nach dem Positionsteil je AHB).
- MSCONS (beide Stände) und ORDERS (beide Stände) auf die zentrale Engine umgestellt;
  Formular-Meta einheitlich über scripts/ahb_form_meta.py. Vollregression:
  25+25+46+44 = 140/140 Prüf-IDs fehlerfrei.
- UTILMD Strom/Gas, beide Formatstände: NEU `vollformular.html` je Seite - die
  komplette AHB-Segmentstruktur jeder Prüf-ID als generierbares Formular
  (553 lazy geladene Meta-Dateien unter pruef-ids/ahb-vollform/), verlinkt aus der
  kuratierten Maske und zurück. Die kuratierte Maske bleibt der geführte Standardweg
  (Prozess-Meta, EBD-Antwortcodes, Produktpakete, Golden-Tests).
- Stichproben-Regression Vollformular (jede 8. Prüf-ID, alle 4 Varianten): 75/75
  nach Korrekturen fehlerfrei; keine JS-Fehler.

## 13. ORDRSP, ORDCHG, QUOTES, REQOTE komplett (23.07.2026)

Alle vier Typen über die zentrale AHB-Formular-Engine, je beide Formatstände
(Versionsregel: aktuell zuerst, dann zukünftig):

- ORDRSP: AHB 1.1a (202604, 40 Prüf-IDs, UNH ORDRSP:D:10A:UN:1.4b) und
  AHB 1.1b (202610, 39 Prüf-IDs, ...:1.4c).
- ORDCHG: AHB 1.0a (202604, 3 Prüf-IDs, ORDCHG:D:20B:UN:1.1) und AHB 1.1 (202610, 3, ...:1.2).
- QUOTES: AHB 1.1 (202604, 5, QUOTES:D:10A:UN:1.3b) und AHB 1.1a (202610, 5, ...:1.3c).
- REQOTE: AHB 1.1 (202604, 5, REQOTE:D:10A:UN:1.3c) und AHB 1.2 (202610, 5, ...:1.3c).

Engine-Erweiterungen dafür: Emitter für AJT (Ablehnungsgrund mit EBD-Codes), CUX
(Währung), GIN, PRI (Preisangabe mit Zahlvalidierung) und RNG (Bereichsangabe).
Korrekturen an der Meta-Extraktion: Pseudo-Codes (Namensfragmente wie "Preis, Betrag")
werden nicht mehr als Codewerte geführt, PRI ohne DE5118 erhält ein synthetisches
Preisfeld; ALLE Formular-Metas des Projekts (inkl. MSCONS, ORDERS, UTILMD-Vollformular)
wurden damit regeneriert. Drei durch docx-Zeilenumbrüche verstümmelte UNH-Kennungen
(ORDCH/QUOTE/REQOT) korrigiert.

Vollregression über alle zwölf Engine-Seiten: 245/245 Prüf-IDs fehlerfrei
(MSCONS 50, ORDERS 90, ORDRSP 79, ORDCHG 6, QUOTES 10, REQOTE 10);
Startseiten-Ketten aller acht neuen Einträge und UTILMD-Vollformular-Stichprobe geprüft.

## 14. Restformate komplett: IFTSTA, INSRPT, COMDIS, INVOIC, PRICAT, REMADV, PARTIN, UTILTS (23.07.2026)

Damit sind alle EDIFACT-Nachrichtentypen der MaKo im Generator abgebildet
(18 Auswahlpunkte je Formatstand). Je Format nach Versionsregel zuerst der aktuell
gültige, dann der zukünftige Stand; ohne neue Version zum 01.10.2026 derselbe Stand
in beiden Bäumen:

- IFTSTA (Berichte): AHB 2.0h (202604, 35 Prüf-IDs, IFTSTA:D:18A:UN:2.0g) und
  AHB 2.1 (202610, 32 Prüf-IDs, ...:2.1).
- INSRPT (Berichte): AHB 1.1g in BEIDEN Bäumen (8 Prüf-IDs, INSRPT:D:10A:UN:1.1a).
- COMDIS (Rechnungsstellung): AHB 1.0h in BEIDEN Bäumen (2, COMDIS:D:17A:UN:1.0g).
- INVOIC (Rechnungsstellung): AHB 1.0a (202604) und AHB 1.0b (202610), je 11 Prüf-IDs,
  INVOIC:D:06A:UN:2.8e.
- PRICAT (Rechnungsstellung): AHB 2.0f (202604) und AHB 2.1 (202610), je 3,
  PRICAT:D:20B:UN:2.0e bzw. ...:2.1.
- REMADV (Rechnungsstellung): AHB 1.0a in BEIDEN Bäumen (4, REMADV:D:05A:UN:2.9e).
- PARTIN (Stammdaten): AHB 1.0f (202604) und AHB 1.1 (202610), je 14,
  PARTIN:D:20B:UN:1.0f bzw. ...:1.1.
- UTILTS (Stammdaten): AHB 1.0 (202604) und AHB 1.1 (202610), je 8, UTILTS:D:18A:UN:1.1e.

Engine-Erweiterungen: 13 neue Emitter - ALC (Zu-/Abschlag, "ALC+A+:Z01"), CNI, DLI,
DOC, EFI ("EFI+:Z01"), EQD, FII (Bankverbindung inkl. zweizeiligem Kontoinhaber und
C088 "BIC::::::Bankname"), GEI, GID, PCD, PGI, PYT und TAX ("TAX+7+VAT+++:::19+S");
alle Komponentenstrukturen gegen die BDEW-MIGs (INVOIC 2.8e, REMADV 2.9e, PARTIN 1.0f,
IFTSTA 2.0g, INSRPT 1.1a, PRICAT 2.0e) und deren Beispielnachrichten verifiziert.
Neu außerdem: dreigeteilte Nachrichtenstruktur Kopf | Positionen | Summenteil - bei
INVOIC/REMADV wird der Summenteil nach UNS+S korrekt einmalig emittiert (SG50ff.);
DTM-Zeitzonenwerte werden jetzt EDIFACT-konform escaped ("...1030?+00:303"); die
Messperioden-Regel [11] greift nur noch bei getrennten Fest-Code-Segmenten DTM+163/164
(nicht bei 163-oder-164-Auswahl wie in der PRICAT-Preisstaffel).

Extraktor-Ausbau für zwei weitere docx-Dialekte: INVOIC 1.0a verteilt jedes AHB über
eine Kopftabelle plus Dutzende Fortsetzungstabellen (werden jetzt verkettet), IFTSTA
2.0h nutzt Tab-Zeilen mit umbrochenen Statusausdrücken. Neu behandelt: dreiteilige
linke Zellen (SGx/SEG/DE musterbasiert), einbuchstabige Statuskürzel M/S/K (PARTIN),
Statusausdrücke mit Klammern und "V"-Operator, Fragment-Zusammenführung umbrochener
Namen/Bedingungen, wiederholte Kopfzeilen bei Seitenumbrüchen sowie verwaiste
Datenzeilen nach Tabellensplits (fehlender Segmentstatus wird rekonstruiert - vorher
wanderten z.B. INVOIC-MOA-Beträge in das TAX-Segment). Ein dabei entdeckter Altfehler
im QUOTES-202610-Meta (PRI-Preisfeld hieß "M [21] ∧ [912]") wurde durch Neuextraktion
behoben. Prüfungs-Scan über alle 26 Formular-Metas: 0 Ausdrucks-Namens-Glitches.

Vollregression über alle 28 Engine-Seiten: 412/412 Prüf-IDs fehlerfrei, dazu
Smoke-Tests APERAK/CONTRL (4/4) und UTILMD-Vollformular-Stichprobe 40/40.
MANIFEST der Startseite um alle acht Formate in beiden Formatständen ergänzt.

## 15. Datengrundlage für den universellen Nachrichten-Validator (23.07.2026)

Vorbereitung des universellen Imports/Validators: alle Lücken der Prüfgrundlage
geschlossen und als maschinenlesbare Datendateien unter `_engine/daten/` integriert.

Neu heruntergeladen (BDEW-MAKO, freie Fassungen): die elf 202610-MIGs, die bisher
fehlten (APERAK 2.2, IFTSTA 2.1, MSCONS 2.5, ORDCHG 1.2, ORDERS 1.4c, ORDRSP 1.4c,
PARTIN 1.1, PRICAT 2.1, QUOTES 1.3c, UTILMD S2.2 und G1.2, je inkl. konsolidierter
Lesefassungen, soweit vorhanden), die EBD-Dokumente 4.2/4.3 (konsolidiert 23.06.2026),
die Allgemeinen Festlegungen 6.1c/6.1d sowie zehn Codelisten (Artikelnummern 5.6,
OBIS 2.5c, Konfigurationen 1.3c und 1.4, Lokationsbündelstrukturen 1.0,
Verwendungszwecke 1.0, Zeitreihentypen 1.1d, Temperaturanbieter 1.0i, europäische
Ländercodes 1.0, SLP TU München 1.1).

Daraus erzeugt (Skripte unter scripts/):

- `_engine/daten/mig-formate.js` (mig_formate_extractor.py): je Formatstand und
  Nachrichtentyp (inkl. UTILMD Strom/Gas getrennt) alle BDEW-Feldformate und -Status
  je Segment+DE (z.B. FII 3194 R an..35, TAX 5289 N) plus Segment-MaxWdh -
  36 Format/Stand-Kombinationen, rund 2.800 Feldeinträge, gegen die MIG-Beispiele
  stichprobengeprüft.
- `_engine/daten/codelisten.js` (codelisten_extractor.py): 49 Artikelnummern (999x),
  271 hierarchische Artikel-IDs mit Einheit und Verwendungs-Flags, 147 OBIS-Kennzahlen,
  213/230 Konfigurations-Codes (1.3c/1.4), 42 Lokationsbündel-Codes,
  19 Verwendungszwecke (ab 202610), 32 Zeitreihentypen, 6 Temperaturanbieter,
  44 Ländercodes sowie die SLP-Code-Regeln (NB-individuell: max. 3-stellig,
  nicht E/Z/Y beginnend).
- `_engine/daten/ebd-antwortcodes.js` (ebd_extractor.py): 290 (4.2) bzw. 291 (4.3)
  Entscheidungsbäume mit zusammen ~1.850 Antwortcodes samt Cluster-Hinweisen,
  inkl. Alias-EBDs ("Es ist das EBD E_xxxx zu nutzen") und Sonderformen
  (Sprünge "ja → 120 A13", Datenstatus-EBDs ohne ja/nein). Querprüfung: alle
  654 EBD-Referenzen aus den AHB-Formular-Metas (STS/RFF DE1131) sind aufgelöst.
- `_engine/daten/af-regeln.js`: Kernregeln der Allgemeinen Festlegungen als
  Konstanten (Zeichensatz UNOC:3, UNA-Servicezeichen, Dezimalpunkt, UTC/"+00",
  Tagesgrenze Strom 00:00 / Gas 06:00, MP-ID-Typen mit Codevergabe-Qualifiern,
  GS1-Mod10-Prüfziffer für GLN, Identität UNB 0004/0010 zu NAD+MS/MR).

Quelldokumente liegen unter regelwerk/ (ebd/, af/, codelisten/) bzw. fv2610-migs/
im Arbeitsbereich; die Datendateien sind eigenständig ladbar (node-geprüft).
Damit stehen für den Validator AHB (Formular-Metas), MIG (Feldformate),
EBD (Antwortcodes), Codelisten und Allgemeine Festlegungen bereit.

## 16. Universeller Nachrichten-Validator mit Import (23.07.2026)

Neu: `validator.html` (verlinkt auf der Startseite) - Import per Drag & Drop
(TXT-Datei) oder Copy & Paste. Nachrichtentyp, Formatversion/-stand und Prüf-ID
werden automatisch aus UNH (S009) und RFF+Z13 erkannt; die passende Prüfgrundlage
wird über `_engine/daten/validator-registry.js` (36 Einträge, ~980 Prüf-IDs)
dynamisch nachgeladen. Korrekte Segmente erscheinen dunkelgrün, fehlerhafte rot
mit Meldungen direkt am Segment.

Kern ist `_engine/ahb-validator.js` (zentral, formatübergreifend):

- EDIFACT-Parser mit UNA-/Release-Zeichen-Behandlung ("?+", "?:", "??").
- AHB-Prüfung je Prüf-ID (Formular-Metas): zulässige Segmente/Qualifier,
  Codelisten je Datenelement, fehlende Muss-Segmente (blockweise: optionale
  Gruppenzweige schlagen nicht an, struktur-identische Wiederholinstanzen werden
  zusammengefasst), RFF+Z13-Konsistenz; konfliktfreie Instanz-Zuordnung
  (z.B. CCI ohne Qualifier über die DE7037-Codeliste).
- MIG-Prüfung: Feldformate/-längen (an..35, n13, ...), "Nicht benutzt"-DEs,
  numerische Werte mit Dezimalpunkt.
- EBD-Prüfung: STS-/AJT-Antwortcodes gegen den im Segment referenzierten
  Entscheidungsbaum (DE1131 E_xxxx, inkl. Alias-Auflösung).
- Codelisten-Prüfung: Ländercodes (NAD 3207), Artikelnummern/Konfigurationen/
  Lokationsbündel (PIA/LIN 7140, 13-stellig), Artikel-IDs, Verwendungszwecke
  (DE7143=Z16), OBIS (als Hinweis, Platzhalter-tolerant).
- Allgemeine Festlegungen: UNOC:3, MP-ID 13-stellig + GS1/GLN-Prüfziffer,
  Identität UNB 0004/0010 zu NAD+MS/MR, DTM-Zeitzonen ("+00"), UNT-/UNZ-Zählung
  und Referenz-Konsistenz.
- Sonderfälle: APERAK/CONTRL ohne Prüf-ID über Beste-Varianten-Wahl; identische
  UNH-Kennung in beiden Ständen (z.B. REQOTE 1.1/1.2 mit MIG 1.3c) wird über
  Doppelvalidierung aufgelöst ("Stand-Wahl: beste Übereinstimmung"); UTILMD
  verweist zusätzlich auf die kuratierte Prozess-Validierung.

Dabei behobene Generator-/Datenfehler: DTM-Formatcode folgt jetzt dem AHB der
Prüf-ID (304, 602 CCYY, 802 Monat, 106 MMDD, 501 Bürozeiten statt pauschal 303),
NAD DE3055 wird AHB-bewusst gewählt (z.B. MSCONS Gas nur 9/332), PIA-Qualifier
aus dem AHB statt fest "5"; MIG-Formatkonflikte werden auf das großzügigste
Format zusammengeführt (LOC 3225 an..33); CONTRL-/APERAK-Extraktion liest jetzt
mehrzeilige Codelisten mit spaltenweiser Statuszuordnung (UCI 0083: 7 nur
Empfangsbestätigung) und pad-getrennte Statusspalten.

Regression: Roundtrip Generator→Validator 68/68 (28 Engine-Seiten je 2 Prüf-IDs,
UTILMD-Vollformular 8, vier Mutationstests rot wie erwartet), APERAK/CONTRL beide
Stände fehlerfrei validiert, Generator-Vollregression weiterhin 416/416.

## 17. Antwortnachrichten aus importierten Nachrichten (23.07.2026)

Der Validator kann jetzt Antworten anstoßen: Nach erfolgreicher Erkennung erscheint
Panel "4. Antwort erzeugen" mit einem Button je möglicher Antwort. Ein Klick öffnet
die Generator-Maske der Antwort-Prüf-ID im selben Formatstand mit allen aus der
Quellnachricht ableitbaren Feldern vorbelegt (Übergabe per URL-Fragment
#antwort=<JSON>; die zentrale Formular-Engine liest die Vorbelegung beim Rendern:
Prüf-ID-Wahl, Kopf-/Positions-/Summenfelder, Positionsanlage, Richtungstausch
Absender/Empfänger). Fachliche Entscheidungen bleiben bewusst Nutzereingabe.

Umgesetzte Ketten (kuratiert in `_engine/daten/antwort-mappings.js`):

- QUOTES → ORDERS: 15001→17001, 15002→17005, 15003→17007, 15004→17131,
  15005→17011 (alle Ziel-AHBs führen RFF+AAG). Vorbelegt: RFF+AAG =
  Angebotsnummer (BGM 1004 der QUOTES), RFF+ACW = UNH-Referenz, je
  Angebotsposition eine Bestellposition mit RFF+Z03 = LIN-Positionsnummer
  (und PIA 7140, wo das Ziel-AHB es führt), MS/MR getauscht.
- INVOIC → REMADV: wahlweise 33001 (Zahlungsavis/Bestätigung, BGM 481) oder
  33002 (Abweisung, BGM 239; Hinweis auf AJT-/EBD-Antwortcodewahl). Vorbelegt:
  SG5 DOC = Rechnungsart+Rechnungsnummer, MOA+9 = fälliger Betrag, MOA+12 =
  Überweisungsbetrag (Bestätigung: voller Betrag; Abweisung: 0), SG5 DTM+137 =
  Rechnungsdatum (UTC→Formularformat konvertiert), RFF+ACW = UNH-Referenz,
  Summen-MOA+12, MS/MR getauscht. Bei Prüfungsfehlern der importierten Nachricht
  weist das Panel auf die Abweisungsvariante hin.

Dabei aufgedeckt und behoben: Die 202604-Metas von QUOTES, REQOTE und ORDCHG
stammten noch aus einer frühen Extraktorversion und waren drastisch unvollständig
(QUOTES Ø 6 statt 31 Segmentinstanzen je Prüf-ID, ohne RFF+Z13!). Die drei Formate
wurden mit dem aktuellen Extraktor neu extrahiert; Formular-Metas und
Segmentregel-Dateien neu erzeugt (jetzt inkl. Anwendungsfall-Namen), Registry
aktualisiert. Die zuvor erzeugten 202604-QUOTES/REQOTE/ORDCHG-Nachrichten waren
entsprechend Skelette - jetzt AHB-vollständig.

Regression: Antwortketten-E2E 20/20 (QUOTES→ORDERS beide Stände mit Referenz-
und Richtungsprüfung; INVOIC→REMADV 33001 und 33002, Antworten validieren
fehlerfrei), Roundtrip 68/68, Generator-Vollregression 416/416. Das Muster ist
auf weitere Ketten übertragbar (REQOTE→QUOTES, ORDERS→ORDRSP, INVOIC→COMDIS);
je Kette genügt ein Eintrag in antwort-mappings.js.

## 18. Automatische Antwortgenerierung für alle Vorgänge (23.07.2026)

Ausbau in drei Stufen (Freigabe durch den Anwender):

**Stufe 1 - Servicenachrichten für jede Nachricht.** Der Validator bietet zu
jeder importierten Nachricht die generischen Antworten nach GPKE Teil 1 Kap. 4
an: CONTRL-Empfangsbestätigung (UCI 0083=7), CONTRL-Syntaxfehlermeldung
(UCI 0083=4) und APERAK-Ablehnung. Die vier Servicenachrichten-Seiten lesen
dafür jetzt eine `#antwort=`-Vorbelegung (Use-Case + Felder per Element-ID);
vorbelegt werden MP-IDs (getauscht), Datenaustauschreferenz, UNH-Referenz,
Dokumentennummer, Erstellungsdatum sowie RFF+TN (Vorgangsnummer aus IDE DE7402,
bei vorgangslosen Nachrichten die UNH-Referenz).

**Stufe 2 - Mapping-Generator aus der Anwendungsübersicht.**
`scripts/baue_antwort_mappings.py` erzeugt `_engine/daten/antwort-mappings-generiert.js`
aus den Anwendungsübersichten 3.3 (202604) und 4.0 (202610), Blatt "Prüf-ID
Prozessschritt": Jede Zeile mit konkreter Prüf-ID in der Spalte "Reaktion auf
Prüfidentifikator" ist eine Antwortnachricht (beleg: "explizit"). Zusätzlich
werden in Gruppen ohne explizite Zuordnung Antworten aus der Schrittabfolge der
Sequenzdiagramme abgeleitet (Schritt n mit Antwort-Beschreibung und gespiegelter
Kommunikationsrichtung antwortet auf Schritt n-1; beleg: "heuristik", im Panel
mit Hinweis). Die Referenz-Vorbelegung folgt dem ZG-Tupel (Blatt "Tupel-Übersicht"):
ZG-T1 SG6 RFF+TN je Vorgang (aus IDE DE7402), ZG-T2 SG6 RFF+AAV, ZG-T14 SG1
RFF+ON und ZG-T42 SG1 RFF+AGI (aus BGM DE1004), ZG-T43/T45 SG15 RFF+ACW (+ADY)
aus UNH-Referenz bzw. Dokumentennummer. Ergebnis: 152 Antwortziele / 166
Prüf-ID-Paare (86 explizit, 66 heuristisch) für UTILMD→UTILMD (121 Paare, Strom
und Gas), ORDERS→ORDRSP (35), ORDERS→MSCONS (4), ORDERS→UTILMD (1, Geschäfts-
datenanfrage), UTILMD→IFTSTA (3, Bearbeitungsstand 21047) und IFTSTA→IFTSTA
(2, AWH-Statusmeldung, nur 202610). Der Validator führt kuratierte und
generierte Mappings zusammen (Dubletten je Zielformat/Prüf-ID: kuratiert
gewinnt; `staende`-Filter je Formatstand).

**Stufe 3 - dokumentierte Ausschlüsse.** Nicht automatisch beantwortbar sind:
(a) API-Prozesse der Anwendungsübersicht (Übertragungsweg API statt AS4/EDIFACT);
(b) Nachrichten ohne vorgesehene Antwort (Informations-/Folgemeldungen, z. B.
MSCONS-Messwerte, IFTSTA-Statusketten ohne Rückmeldung, Kap.-5-Fälle ohne
Prozessschritt); (c) ZG-Tupel ohne EDIFACT-Referenzübersetzung (in GPKE/GeLi
keine; Hinweis-Protokoll des Generators listet Auslassungen, aktuell nur
Quell-Prüf-ID 44108, die nicht im Gas-AHB des Generators enthalten ist);
(d) Antworten mit eigenem Fachinhalt: vorbelegt werden Richtung, Prüf-ID und
Referenzen - Fachfelder (Stammdaten, Mengen, Antwortcodes) füllt der Anwender
bzw. die EBD-Codewahl im Formular.

Dabei aufgedeckt und behoben (durch die neuen E2E-Ketten):
- **DTM Kündigungsfrist (Z01/ZZRB):** UTILMD 55016-55018, 55039-55041 u. a.
  verlangen DE2379=Z01 im Format ZZRB (Anzahl + Einheit T/W/M + Bezugszeitpunkt
  M/Q/H/J/T/R, z. B. 30TM; MIG UTILMD SG4 DTM). Engine rendert jetzt ein
  ZZRB-Feld und emittiert Z01; Validator prüft das Format.
- **Datenaustauschreferenz zu lang:** alle Generatoren erzeugten 16-stellige
  DE0020 (Präfix+JJMMTThhmm+Zähler); EDIFACT erlaubt an..14. Jetzt
  Präfix+MMTThhmm+Zähler = 14 (Engine und Servicenachrichten-Seiten).
- **APERAK unvollständig gegen AHB:** SG5 RFF+Z08 (Netzbetreiber) fehlte auf
  den APERAK-Seiten, RFF+TN war nur optional. 202604 (AHB 2.1i): SG2 RFF+TN
  Pflicht; 202610 (AHB 2.2): RFF+TN nur in SG5. Beide Seiten ergänzt
  (Z08-Pflichtfeld, TN-Fallback SG5=SG2).

Regression: Antwortketten-E2E 35/35 (bisherige Ketten + UTILMD 55016→55017
beide Stände mit RFF+TN-Prüfung, ORDERS 17115→ORDRSP 19116 mit RFF+ON-Prüfung,
CONTRL-Empfangsbestätigung und APERAK-Ablehnung je erzeugt und fehlerfrei
validiert), Generator 416/416, Roundtrip 68/68.

## 19. Einheitliches Design + globale Hell/Dunkel-Einstellung (23.07.2026)

Alle 42 Seiten nutzen jetzt ein gemeinsames Design nach Vorbild des
UTILMD-Generators (`_engine/edigen.css`, umgestellt per
scripts/style_transform.py):

- **Layout:** Breadcrumb, Top-Bar (Titel + Hell/Dunkel-Umschalter, Trennlinie
  in der Leitfarbe), zweispaltig - Formular links, "Nachricht erzeugen" mit
  EDIFACT-Ausgabe rechts (dunkle Konsole mit grüner Schrift wie im
  UTILMD-Generator, sticky beim Scrollen).
- **Palette:** die UTILMD-Farbwelt (Petrol #004b6c bzw. #5fb8dd im Dunkelmodus)
  ersetzt das bisherige Blau der Engine-Seiten; Startseite und Validator
  beziehen die Basis-Palette ebenfalls aus edigen.css. Die Validator-Ampel
  bleibt unverändert: korrekte Segmente dunkelgrün, fehlerhafte rot (lokale
  Overrides mit [data-theme]-Selektoren, damit sie die Body-Ebene gewinnen).
- **AHB-Statusfarben:** Segmentblöcke der Formular-Engine tragen jetzt wie im
  UTILMD-Generator Muss (rot) / bedingt+Soll (orange) / Kann (grün) als
  linke Randmarkierung samt Einfärbung des Status im Blocktitel.
- **Globales Theme:** `_engine/theme.js` speichert die Wahl in localStorage
  ('edigenTheme') und wendet sie auf jeder Seite beim Laden an - die
  Einstellung gilt damit seitenübergreifend. Die UTILMD-Originalseiten wurden
  vom eigenen Speicher-Schlüssel auf das globale Theme umgestellt; alle
  lokalen setTheme-Definitionen entfielen.

Regression nach dem Umbau: Generator 416/416, Roundtrip 68/68,
Antwortketten 35/35; Sichtprüfung per Screenshot (hell/dunkel, Persistenz
über Seitenwechsel, Validator-Ergebnisansicht, UTILMD-Maske, Vollformular,
Servicenachrichten, Startseite).

## 20. Vorbelegung wie UTILMD + MIG-Formatangaben in den Formularen (23.07.2026)

**Referenzvergabe (alle Engine-Seiten, wie im UTILMD-Generator):** Je Formular
wird eine 12-stellige Nachrichtenreferenz vergeben (Millisekunden seit
01.01.2000 UTC, passt in an..14). Sie wird sichtbar vorbelegt in der
BGM-Dokumentennummer und je Position in der IDE-Vorgangsnummer
(Referenz + Positionszähler) und bei der Erzeugung einheitlich für
UNB-Datenaustauschreferenz, UNH-/UNT-Nachrichten-Referenznummer und UNZ
verwendet. DTM+137 (Nachrichtendatum) ist mit dem Tagesdatum im deutschen
Format vorbelegt.

**Kalenderfunktion:** Alle Datumsfelder (TT.MM.JJJJ, TT.MM.JJJJ HH:MM,
MM.JJJJ) haben den Kalender-Button des UTILMD-Generators (damals nativer Picker via
_engine/kalender.js, unsichtbares Trägerfeld); die direkte Texteingabe im
deutschen Format bleibt unverändert möglich. Auch das APERAK-Referenzdatum
(SG2 DTM+171) hat den Kalender.

**MIG-Formatangaben:** Freitextfelder zeigen unter der Eingabe das
BDEW-MIG-Feldformat als Hinweis ("MIG: an..35 · alphanumerisch, max. 35
Zeichen"; n = numerisch, a = alphabetisch, ohne '..' = feste Länge) und
begrenzen die Eingabe per maxlength. Datenquelle: _engine/daten/mig-formate.js
(auf allen Generatorseiten geladen; const→var für window-Zugriff).

Dabei behoben: Öffnet man auf derselben Generatorseite nacheinander zwei
Antwort-Links (nur das #antwort=-Fragment ändert sich, kein Reload), blieb
die alte Vorbelegung stehen - die Engine reagiert jetzt auf hashchange und
wendet die neue Vorbelegung an. Test-Harness an die neue UNH-Referenz
angepasst (UNH+<Referenz> statt UNH+1).

Regression: Generator 416/416, Roundtrip 68/68, Antwortketten 35/35;
Sichtprüfung: Vorbelegung, MIG-Hinweise, Kalender-Roundtrip
(01.08.2026 14:30), Referenzgleichheit UNB=UNH=BGM=UNT=UNZ.
