# Prüf-ID-Abgleich gegen die AHB — Protokoll

> Fortlaufendes Arbeitsprotokoll ab dem 28.07.2026. Jeder Abschnitt hält Befund,
> Quellenlage, Umsetzung und Nachweis fest. Letzter Abschnitt: 21 (02.08.2026).


**Stand:** 28.07.2026 · **Umfang:** alle Ordner mit Prüf-ID-Regeldateien, beide Formatstände
**Datenbasis:** `edi_energy_mirror`, FV2604 (71 DOCX) und FV2610 (57 DOCX)

---

## 1. Ergebnis in Zahlen

| | |
|---|---|
| geprüfte Prüf-IDs | **965** (202604: 487 · 202610: 478) |
| davon mit vollständiger AHB-Datenbasis | **965** (vorher 544) |
| Segmentinstanzen | 23.311 |
| Datenelemente | 55.929 |
| Codewerte (Value Pool) | 50.521 |
| Segmente mit maschinell geschalteter Bedingung | 215 |
| korrigierte Codelisten in UTILMD-Regeldateien | 52 |
| ergänzte, im AHB geführte Segmente | 2.497 |
| reparierte `_bedingungen.js` | 14 |

Die vollständige Liste aller Prüf-IDs mit Kennzahlen und Quelldatei steht in
`Pruefid-Abgleich_20260728.csv` (965 Zeilen, Semikolon-getrennt).

### Je Nachrichtentyp

| Nachrichtentyp | 202604 | 202610 |
|---|---:|---:|
| UTILMD Strom | 187 | 189 |
| UTILMD Gas | 88 | 89 |
| ORDERS | 46 | 44 |
| ORDRSP | 40 | 39 |
| IFTSTA | 35 | 32 |
| MSCONS | 25 | 25 |
| PARTIN | 14 | 14 |
| INVOIC | 11 | 11 |
| INSRPT | 8 | 8 |
| UTILTS | 8 | 8 |
| QUOTES / REQOTE | 5 / 5 | 5 / 5 |
| REMADV | 4 | 4 |
| ORDCHG / PRICAT | 3 / 3 | 3 / 3 |
| COMDIS | 2 | 2 |

APERAK und CONTRL führen keine Prüfidentifikatoren, sondern benannte Anwendungsfälle
(Anerkennungs-/Fehlermeldung, Empfangsbestätigung, Syntaxfehlermeldung). Sie waren damit
nicht Gegenstand dieses Abgleichs; ihre Dateien blieben unverändert.

---

## 2. Was den Abgleich überhaupt erst möglich gemacht hat

### 2.1 Die eigentliche Ursache der fehlenden Prüf-IDs

Die Übergabe vermutete eine „unregelmäßige Zell-Verschmelzung". Tatsächlich führen die
betroffenen DOCX **jede Tabellenzeile als eigene, in die Zelle eingebettete Tabelle**
(`w:tbl` innerhalb `w:tc`). `Table.row_cells()` von python-docx rekonstruiert nur das
Zellgitter und sieht deshalb leeren Text — kohlrahbi bricht mit *„The last paragraph
should start with 'Prüfidentifikator'"* ab und liefert 0 Prüf-IDs.

Dafür wurden zwei Leser gebaut, die dieselbe Datenstruktur erzeugen:

- `werkzeuge/nested_ahb_reader.py` — verschachteltes Layout, liest über Roh-XML.
  Die Prüf-ID-Spalten werden über die Gitterbreiten erkannt; die wenige Twips breiten
  Trennspalten zwischen ihnen werden verworfen.
- `werkzeuge/tabs_ahb_reader.py` — klassisches, tabulatorgetrenntes Layout. Auch hier
  über Roh-XML, weil `row.cells` bei verbundenen Zellen den Inhalt der Nachbarspalte
  liefert und dadurch ganze Segmentblöcke verfälscht.

### 2.2 Verifikation

Der AHB UTILMD Gas 1.1 liegt in **beiden** Layouts vor — einmal als Lesefassung
(tabulatorgetrennt, von kohlrahbi lesbar), einmal als Änderungsfassung (verschachtelt).
Diese Kreuzprobe ist der eigentliche Nachweis:

| Vergleich neuer Leser ↔ kohlrahbi | Zeilen |
|---|---:|
| in allen fachlichen Feldern deckungsgleich | 5.997 |
| Abweichung bei Segment, Datenelement oder Segmentgruppe | **0** |
| Abweichung beim AHB-Ausdruck | **0** |
| Code und Bezeichnung bei kohlrahbi vertauscht | 69 |
| Codewert bei kohlrahbi an der Umbruchstelle abgeschnitten | 8 |
| Bezeichnung bei kohlrahbi abgeschnitten | 3 |

Sämtliche Abweichungen gehen also zugunsten des neuen Lesers. Zwei Beispiele:

- UNH DE0057: kohlrahbi führt „S2.1" als *Bezeichnung* und den Bezeichnungstext als
  *Code*; richtig ist das Umgekehrte.
- SG10 CCI DE1131: kohlrahbi liefert `GABi-` statt `GABi-RLMNEV`, weil der Code im
  Dokument über einen Zeilenumbruch läuft. Solche Codes wären als Auswahlwerte im
  Generator schlicht falsch.

Zusätzlich liefert der neue Leser für AHB UTILMD Strom S2.1 exakt dieselben 187
Prüf-IDs wie kohlrahbi — bei einer Datei, die kohlrahbi über den anderen Layoutpfad liest.

### 2.3 Nebenbefund: die Lesefassung ist nicht immer die aktuellste

`AHB_UTILMD_S2.1` liegt als konsolidierte Lesefassung (`_ooox_`) auf dem Dokumentstand
**06.06.2025** vor, die maßgebliche Fassung vom **29.06.2026** ist eine Änderungsfassung
(`_xoxx_`) — und enthält **44 Prüf-IDs mehr**. Die Auswahl richtet sich deshalb jetzt
nach dem Dokumentstand im Dateinamen, nicht nach der Fassungsart. Prüf-IDs, die nur in
einer älteren Fassung geführt werden, werden in einem zweiten Durchgang ergänzt
(betraf 44137/44138 in FV2604 und 44170 in FV2610).

---

## 3. Fachliche Korrekturen im Generator

### 3.1 STS+7 — Transaktionsgrundergänzung (der gemeldete Bug)

In 30 Prüf-IDs stand die generische Platzhalterliste **ZW4/ZW3/ZW5**. Ersetzt durch die
im jeweiligen AHB tatsächlich zugelassenen Codes, unter anderem:

| Prüf-ID | vorher | laut AHB |
|---|---|---|
| 55001 | ZW4, ZW3, ZW5 | **ZW4, ZAP** |
| 55002 | ZW4, ZW3, ZW5 | ZW6, ZW7, ZAP |
| 55003 | ZW4, ZW3, ZW5 | ZW4 |
| 55004 / 55007 / 55010 | ZW4, ZW3, ZW5 | ZW3, ZW4, ZW5, ZAP |
| 55013 | ZW4, ZW3, ZW5 | ZW6, ZW7 |
| 55014 / 55015 | ZW4, ZW3, ZW5 | ZW4 |

Das deckt sich mit der in der Übergabe dokumentierten Korrektur — hier unabhängig aus
den AHB-Daten erneut hergeleitet.

**Der offene Punkt aus Abschnitt 0b der Übergabe ist damit geklärt.** Für die sechs
Ablehnungs- und Beendigungs-Prüf-IDs **55005, 55006, 55008, 55009, 55011, 55012** führt
der AHB im STS+7 *keine* Ergänzung, sondern ausschließlich Transaktionsgründe
(E01, Z33, Z41, ZG9, ZH1, ZH2, ZT4, ZT5, ZZD bzw. Z33, ZQ7, ZT0 bzw. E01, E03). Das
Ergänzungsfeld wurde dort deshalb **entfernt** und durch das Feld
„SG4 STS+7: Transaktionsgrund" mit den echten Codes ersetzt. Die Frage aus der Übergabe
— „Gehört dort die Ergänzung überhaupt hin, oder ist es das Transaktionsgrund-Feld?" —
beantwortet der AHB eindeutig zugunsten des Transaktionsgrunds.

### 3.2 Abhängige Segmente

Das in der Aufgabenstellung genannte Beispiel ist umgesetzt und durch einen eigenen
Test abgesichert (`scripts/test_abhaengige_segmente.js`, 4/4 in beiden Formatständen):

```
SG5 LOC+Z16 (Marktlokation)          Muss [2061] ∧ [67]
SG5 LOC+Z22 (Ruhende Marktlokation)  Muss [2061] ∧ [96]
[96] Wenn SG4 STS+7++xxx+ZAP (Transaktionsgrundergänzung ruhende Marktlokation) vorhanden
```

Wird im STS+7 **ZW4** gewählt, ist LOC+Z16 sichtbar und LOC+Z22 ausgeblendet; bei **ZAP**
umgekehrt. Ein ausgeblendetes Segment gelangt nicht in die Nachricht, auch wenn im Feld
noch ein Wert aus einer früheren Auswahl steht — der Generator weist darauf hin. Fehlt
umgekehrt in einem bedingten Muss-Segment die Angabe, obwohl seine Bedingung erfüllt ist,
meldet er einen harten Fehler.

**Bewusste Zurückhaltung:** Automatisch geschaltet wird nur, was eindeutig ist — eine
Bedingung, die einen Codewert *innerhalb* eines Segments benennt (Position 2, etwa
`STS+7++xxx+ZAP`), ohne ODER-Verknüpfung im Ausdruck und ohne konkurrierende zweite
Regel. Bewusst **nicht** ausgewertet werden:

- Aussagen über das bloße Vorhandensein eines Segments („Wenn SG7 STS+Z01 nicht
  vorhanden") — der Qualifier steht im Formular fest, unabhängig von der Nutzung;
- tiefere Wiederholungen wie `STS+7++xxx+xxx+E01/E03` (Transaktionsgrund befristete
  Anmeldung) — dort ließe sich E01 nicht vom gleichnamigen Haupt-Transaktionsgrund
  unterscheiden;
- Kardinalitätsregeln wie [2061] und alles, was auf Verkettungen über mehrere
  Segmentgruppen zielt (etwa [67] über SG8 SEQ+Z79 → CCI+Z66 → CAV+ZH9 → Codewert).

Diese Bedingungen bleiben als Hinweistext am Feld und in der Bedingungs-Hilfe sichtbar.
Ein zu Unrecht ausgeblendetes Pflichtsegment wäre schlimmer als keine Automatik. Von
2.148 grundsätzlich deutbaren Bedingungen sind deshalb nur **215** wirksam geschaltet.

### 3.3 Ergänzte Segmente

2.497 im AHB geführte, in den Regeldateien fehlende Segmente wurden ergänzt:
866 DTM-, 840 RFF-, 495 STS- und 296 LOC-Segmente. Bestehende Einträge behielten
Reihenfolge, Bezeichnung und Regelhinweis.

### 3.4 Bedingungs-Hilfe an jedem bedingten Feld

Das Fragezeichen-Symbol war bisher nur an der Kopfzeile der Segmentblöcke der
Engine-Seiten zu sehen. Es erscheint jetzt überall dort, wo der AHB eine Bedingung
führt:

- an der **Segmentgruppe** — ihr Ausdruck steht im AHB an der Gruppe, nicht am Segment
  (SG5 „Ruhende Marktlokation" = `Muss [2061] ∧ [96]`, das LOC selbst nur `Muss`).
  Ohne ihn blieb genau die unterscheidende Bedingung unsichtbar;
- am **Segment** selbst;
- an **jedem Datenelement** — in allen Feldarten: Auswahlliste, Mehrfachauswahl,
  fester Codewert, Datums-/Fristfeld und Freitextfeld;
- an **Bedingungen einzelner Codewerte**, die als `Codes: ZAP [96]` am zugehörigen
  Datenelement erscheinen;
- am **Format-Datenelement DE2379**, das nicht als Feld angeboten wird (das Format
  ergibt sich aus der Eingabe), dessen Bedingungen aber weiterhin gelten.

Auf den vier UTILMD-Seiten gab es zuvor **überhaupt kein** Hilfesymbol: Der Generator
gab keinen Bedingungsausdruck aus, an den sich die Hilfe hätte hängen können, und die
UTILMD-Bedingungsdateien stellten ihre Texte nicht unter `window.EdiBedingungen`
bereit — selbst mit Symbol wäre nur „Text noch nicht hinterlegt" erschienen. Beides ist
behoben; jedes Segment trägt jetzt seinen AHB-Ausdruck (`ahbExpr`, 593 Segmente).

Ergänzt wurden außerdem die Erklärungen für Verweise, die in keiner AHB-Bedingungsliste
stehen: die übergreifenden Zeitpunktbedingungen **[UB1]/[UB2]/[UB3]** (Allgemeine
Festlegungen Kap. 3.8 — Tagesgrenze Strom 00:00, Gas-Tag 06:00, spartenabhängig) und die
Paketangaben der Form **[1P0..1]**, die als Wiederholbarkeit innerhalb eines Pakets
erklärt werden. In 11 Bedingungsdateien wurden einzelne fehlende Texte aus der
AHB-Extraktion nachgetragen.

**Nachweis** (`scripts/test_bedingung_hilfe.js`, Vollauflauf mit `ALLE=1`):

| über alle 968 Prüf-IDs auf 32 Seiten | |
|---|---:|
| sichtbare Bedingungsausdrücke | 7.212 |
| davon mit Hilfesymbol | **7.212** |
| aufgelöste Verweise beim Anklicken | 13.123 |
| davon ohne Klartext | **0** |
| Bedingungen laut AHB | 8.723 |
| davon im Formular nicht erreichbar | **0** |

---

## 4. Gefundene Fehler, die nichts mit dem AHB zu tun hatten

1. **14 Bedingungsdateien mit ungültigem JavaScript.** In `_bedingungen.js` von IFTSTA,
   INVOIC, REMADV, COMDIS, ORDCHG, QUOTES und REQOTE (beide Formatstände) enthalten die
   Texte der Bedingungen [490] und [491] echte Zeilenumbrüche innerhalb eines
   String-Literals. Solche Dateien werden vom Browser gar nicht geladen — die
   Bedingungs-Hilfe war auf diesen 14 Seiten vollständig ohne Funktion. Repariert mit
   `werkzeuge/repariere_bedingungen.py`.

2. **Doppelte Deklaration `bedingungLogik`.** Die vier UTILMD-Bedingungsdateien
   deklarieren `const bedingungLogik`; der Validator lädt mehrere davon nacheinander in
   denselben Kontext, wodurch die zweite mit *„Identifier has already been declared"*
   abbrach. Auf `var` umgestellt.

3. **Bedingungs-Hilfe fehlte in den vier UTILMD-Seiten.** Die in der Übergabe
   (Abschnitt 0a) beschriebene Ergänzung war im gelieferten Paket nicht enthalten.
   Nachgeholt — der dortige Prüfbefehl liefert jetzt 36. Das Einbinden allein genügte
   allerdings nicht: siehe Abschnitt 3.4.

4. **RFF+ACW in REMADV 33001.** Die frühere Extraktion ordnete das Segment beiden
   Prüf-IDs zu. Im AHB ist die Spalte für 33001 (Bestätigung) leer; „Soll [510]" steht
   nur bei 33002 (Abweisung). Der Testfall `test_antwortketten.js` erwartete das alte,
   falsche Verhalten und wurde entsprechend korrigiert.

---

## 5. Prüfläufe

| Test | Ergebnis |
|---|---|
| `test_engine_pages.js` (alle Engine-Generatorseiten) | **416/416** |
| `test_utilmd_seiten.js` (neu: alle UTILMD-Prüf-IDs, beide Sparten und Stände) | **556/556** |
| `test_abhaengige_segmente.js` (neu: STS+7 → SG5 LOC bei 55001) | **4/4** |
| `test_muss_validierung.js` | alle OK |
| `test_bedingung_hart.js` | alle OK |
| `test_antwortketten.js` | 31/35 — unverändert gegenüber dem Ausgangspaket |
| `_engine/tests/golden.js` (alle vier Ziele) | OK — Snapshots bewusst aktualisiert, siehe unten |
| `_engine/tests/domsim.js` | alle OK |
| `test_bedingung_hilfe.js` (neu, `ALLE=1`: 968 Prüf-IDs) | 7.212/7.212 Ausdrücke mit Symbol, 0 Verweise ohne Klartext |
| Syntaxprüfung aller JavaScript-Dateien | ohne Befund |

**Golden-Snapshots.** Sie wurden nach Prüfung jeder einzelnen Änderungsart neu
eingefroren (83 von 189 Prüf-IDs in UTILMD Strom 202610 betroffen). Die Unterschiede
sind ausschließlich:

- korrigierte Transaktionsgrundergänzungen — `STS+7++E03+ZW4` wird zu `STS+7++E03+ZW6`,
  wo der AHB ZW4 gar nicht führt, und entfällt ganz bei den sechs Prüf-IDs ohne
  Ergänzung (Abschnitt 3.1);
- ergänzte Muss-Referenzen aus dem AHB (RFF+Z19, Z18, Z46, Z38, MG, Z20 …).

Drei Nebenwirkungen wurden dabei gefunden und behoben, bevor der Snapshot neu gesetzt
wurde: Kann-/Soll-Referenzen wurden mit Platzhalter emittiert statt nur bei Eingabe;
das neue Feld „Transaktionsgrund" überschrieb den im Prozess hinterlegten Grund
(Optionen sind jetzt so sortiert, dass er vorne steht); und Prüf-IDs, bei denen der
Transaktionsgrund selbst dem Muster der Ergänzungscodes folgt (ZX6 „Änderung Daten der
MaLo"), erzeugten `STS+7++ZX6+ZX6`.

`_engine/tests/selfvalidate.js` meldet 252 statt bisher 206 Befunde. Das ist die
erwartete Folge der vollständigeren Abbildung: Der Validator bemängelt in einer *leeren*
Testnachricht jetzt auch die neu ergänzten Muss-Segmente. Mit ausgefüllten Formularen
(`test_utilmd_seiten.js`) entstehen 556 von 556 Nachrichten fehlerfrei.

Die vier offenen Punkte in `test_antwortketten.js` bestanden bereits im Ausgangspaket
und betreffen bedingte CAV-Muss-Segmente (Bedingung [492], „wenn MP-ID in NAD+MR aus
Sparte Strom"), die der Validator nicht automatisch auflösen kann.

---

## 6. Was offen bleibt

1. **Die UTILMD-Seiten arbeiten weiterhin mit kuratierten Segmentlisten.** Ihre
   `pruef-ids/<PID>.js` führen ein Formularfeld je Segment, während die übrigen 30 Ordner
   über `ahb-form-engine.js` bereits **jedes einzelne Datenelement** anbieten. Die
   vollständige Datenelement-Ebene liegt für UTILMD als `_form-meta.js` bereit
   (11.224 Segmentinstanzen); die Umstellung der vier Seiten auf die zentrale Engine ist
   der nächste sinnvolle Schritt. Sie wurde hier bewusst nicht mitgemacht, weil die
   UTILMD-Seiten Sonderlogik tragen (Produktpaket-Block, Nutzdatenkatalog,
   Prozess-Meta/EBD-Antwortcodes), deren Umbau eigene Prüfläufe braucht.

2. **Bedingungen mit Verkettung über mehrere Segmentgruppen** (Abschnitt 3.2) sind
   maschinell nicht aufgelöst. Für die häufigsten Muster — etwa [67] über den
   Produktpaket-Block — wäre eine gezielte Regelbibliothek denkbar.

3. **APERAK und CONTRL** (benannte Anwendungsfälle statt Prüf-IDs) wurden nicht
   abgeglichen; ihre AHB-Tabellen tragen keine Prüfidentifikator-Zeile und brauchen
   einen eigenen Leseweg.

---

## 7. Reproduktion

```bash
export no_proxy="" NO_PROXY=""
git clone --filter=blob:none --sparse https://github.com/Hochfrequenz/edi_energy_mirror.git eem
cd eem && git sparse-checkout set edi_energy_de/FV2604 edi_energy_de/FV2610 && cd ..

python3 werkzeuge/extrahiere_alle.py          # AHB-Daten beider Formatstände -> ahbdaten/
python3 werkzeuge/baue_form_meta.py           # _form-meta.js je Generator-Ordner
python3 werkzeuge/aktualisiere_utilmd_regeln.py   # Abgleich der UTILMD-Regeldateien
python3 werkzeuge/repariere_bedingungen.py    # idempotent

node scripts/test_engine_pages.js
node scripts/test_utilmd_seiten.js
node scripts/test_abhaengige_segmente.js
```

Die Leser und Hilfsskripte liegen im Übergabepaket unter `werkzeuge/`; sie brauchen nur
`python-docx`. `kohlrahbi` wird für die Extraktion nicht mehr benötigt und dient nur noch
als Gegenprobe.

---

## 8. Folgenachrichten eines Geschäftsprozesses (29.07.2026)

Aus einer vorliegenden Nachricht lassen sich die weiteren Nachrichten ihres
Use-Cases als vorbefüllte Testnachrichten erzeugen. Der Bereich erscheint unter der
erzeugten Nachricht — im Generator, im Vollformular und im Validator.

**Datengrundlage** (`_engine/daten/prozessketten.js`, erzeugt mit
`werkzeuge/baue_prozessketten.py`): die Anwendungsübersicht der Prüfidentifikatoren
(Spalte „Reaktion auf Prüfidentifikator" und das gemeinsame Sequenzdiagramm) sowie
die im GPKE-Fließtext benannten Auslöser. Für Prüf-ID 55001 ergeben sich elf
Folgenachrichten: 55036, 55010, 55011, 55012, 55002, 55003, 55037, 55038 sowie die
nachgelagerten Abrechnungsdaten 55218, 55126 und 55672.

**Übernommen wird**, was die Quellnachricht hergibt: Absender und Empfänger werden
getauscht, Segmente mit gleichem Qualifier wertgleich übernommen (Marktlokation,
Termine, Transaktionsgrund), und die Vorgangsnummer der Quelle wird zur Referenz
RFF+TN — die Antwort erhält ihre eigene neue Vorgangsnummer. Nachrichten- und
Dokumentennummer sowie das Erstellungsdatum gehören zur neuen Nachricht und werden
bewusst nicht kopiert. Zeitpunkte werden dabei aus dem EDIFACT-Format
(CCYYMMDDHHMM+ZZ) ins Eingabeformat gewandelt.

Angaben, die der Netzbetreiber aus eigenen Systemen zieht (weitere Lokationen,
Bilanzierungsdaten, Verwendungszeiträume, Fristen), **bleiben leer** — sie sind aus
der Quellnachricht nicht ableitbar und werden nicht erfunden.

Insgesamt: 355 Ketten mit 2.179 Folgenachrichten (202604) und 342 Ketten mit 1.780
Folgenachrichten (202610).

### Drei Fehler, die dabei sichtbar wurden

1. **Die UTILMD-Vollformulare beruhten auf veralteten Daten.** Validator und
   `vollformular.html` lesen nicht `_form-meta.js`, sondern je Prüf-ID einzeln
   nachgeladene Dateien unter `pruef-ids/ahb-vollform/`. Diese stammten noch aus der
   früheren Extraktion: Für 55001 führten sie sechs Lokationsangaben
   (LOC+Z16/Z17/Z18/Z19/Z20/Z22), während der AHB in **beiden** Dokumentständen nur
   LOC+Z16 und LOC+Z22 kennt — die übrigen stammen aus Nachbarspalten anderer
   Prüf-IDs. Alle 553 Dateien wurden aus der geprüften Datenbasis neu erzeugt.

2. **Die Vollformularseiten waren funktionslos.** `ahbVollformMeta` wurde dort nie
   deklariert; der erste Zugriff brach mit „ahbVollformMeta is not defined" ab, das
   Formular blieb leer. Behoben in allen vier Seiten.

3. **Der Validator meldete Muss-Segmente, die der AHB nicht verlangt.** Er wertet
   den Ausdruck des Segments aus, die unterscheidende Bedingung steht aber an der
   Segmentgruppe. Bei Prüf-ID 55016 verlangte er dadurch LOC+Z21 (Tranche), obwohl
   dieses nur bei STS+7 mit ZW5 gilt. Er berücksichtigt jetzt die Schaltregeln und
   den Ausdruck der Segmentgruppe.

**Nachweis** (`scripts/test_folgenachrichten.js`, 6/6): Aus einer im Generator
erzeugten 55001 werden die Folgenachrichten angeboten; in der geöffneten Bestätigung
55002 sind Absender und Empfänger getauscht, die Marktlokation übernommen, die
Vorgangsnummer steht als RFF+TN, die Bestätigung trägt eine eigene Vorgangsnummer und
die Dokumentennummer der Quelle taucht nicht auf. Für die Ablehnung 55003 wird die
Marktlokation zu Recht **nicht** übernommen — der AHB führt dort kein LOC-Segment.

### Offen

Die UTILMD-Regeldateien enthalten vereinzelt Segmente, die der AHB für die jeweilige
Prüf-ID nicht führt (Altbestand, etwa LOC+Z16/LOC+Z21 in 55017). Der Abgleich ergänzt
bisher nur, entfernt nicht — ein Entfernen sollte einzeln geprüft werden.

## 9. Marktpartnerrollen und Stammdatenänderungen (29.07.2026)

Der Folgenachrichten-Mechanismus aus Abschnitt 8 ordnete Absender und Empfänger
pauschal über einen Richtungstausch zu. Das trägt für die unmittelbare Antwort, ist
aber falsch, sobald ein dritter Marktpartner beteiligt ist: In der Anmeldung 55001
stehen nur der neue Lieferant (NAD+MS) und der Netzbetreiber (NAD+MR) — der **alte**
Lieferant, an den 55010 und 55037 gehen, kommt darin nirgends vor. Der Tausch hätte
ihm die ID des neuen Lieferanten gegeben.

### Rollenmodell

Jeder Schritt einer Prozesskette führt jetzt die Rollenbezeichnungen seines
Sequenzdiagramms mit (`vonRolle` / `anRolle`), die Kette zusätzlich die Rollen der
Quellnachricht (`quelleVon` / `quelleAn`, aus der Anwendungsübersicht, Spalten
„Kommunikation von/an"). Daraus entsteht je Quellnachricht eine Rollenkarte
— `quelleVon` → NAD+MS, `quelleAn` → NAD+MR — und die Marktpartner der
Folgenachricht werden in vier Stufen aufgelöst, jede nur bei **Eindeutigkeit**:

| Stufe | Regel | Beispiel |
|---|---|---|
| exakt | gleiche Bezeichnung | 55002 `NB` → MP-ID des Netzbetreibers |
| Basis | gleiches Kürzel vor dem Klammerzusatz | `MSB (entspricht MSB am Objekt Marktlokation)` → `MSB` |
| Bezug | Bezeichnung verweist auf die Ursprungsnachricht | `Empfänger einer Stornierungsanfrage` → NAD+MR |
| verwandt | Sammelbegriff und Ausprägung | `LF` → `LFN`, wenn die Quelle nur einen LF führt |

Bleibt eine Rolle unauflösbar oder mehrdeutig — etwa `NB` in einem Diagramm, das
`NB (entspricht NBA)` und `NB (entspricht NBN)` unterscheidet —, **bleibt das Feld
leer**. Es wird orange umrandet und trägt den Hinweis „MP-ID ergänzen – aus der
Quellnachricht nicht ableitbar". Geraten wird nichts.

Über alle Ketten: 202604 — 2.209 Rollen exakt, 165 über die Basis, 110 über den
Bezug, 78 über die Verwandtschaft, 1.958 offen; 202610 — 1.944 / 186 / 20 / 78 /
1.494. Bei 579 (202604) bzw. 522 (202610) Folgenachrichten sind beide Marktpartner
bekannt, bei 1.404 bzw. 1.184 einer.

### Anzeige nach Empfänger gebündelt

Der Folgenachrichten-Bereich gruppiert die Nachrichten nach ihrem Empfänger, nicht
mehr als flache Liste. Gebündelt wird nach der **aufgelösten MP-ID**, denn dasselbe
Unternehmen tritt im Diagramm unter mehreren Bezeichnungen auf — die
Stammdatenänderungen adressieren den „LF", der hier der „LFN" ist. Für 55001:

| Empfänger | MP-ID | Nachrichten |
|---|---|---|
| LFN (neuer Lieferant), auch als LF geführt | aus NAD+MS | 55036, 55002, 55003, 55218, 55126, 55672, 55175, 55225, 55615–55620, 55691 |
| LFA (alter Lieferant) | zu ergänzen | 55010, 55037 |
| NB (Netzbetreiber) | aus NAD+MR | 55011, 55012 |
| LFZ (zukünftiger Lieferant) | zu ergänzen | 55038 |

### Stammdatenänderungen des Netzbetreibers

Das Sequenzdiagramm „Stammdatenänderung vom NB (verantwortlich) ausgehend" ist in
der Anwendungsübersicht nicht mit dem Lieferbeginn verknüpft; die GPKE stellt den
Bezug nur im Fließtext her. Es ist daher — wie zuvor schon die Abrechnungsdaten —
als benannter Nachfolge-Use-Case hinterlegt (`GPKE_FOLGEN` in
`werkzeuge/baue_prozessketten.py`), beschränkt auf Schritt 1 „Änderung vom NB an
LF". Damit bietet eine 55001 zusätzlich an: 55615 (NeLo), 55616 (MaLo), 55617 (TR),
55618 (SR), 55619 (Tranche), 55620 (MeLo), 55691 (Paket-ID der MaLo), 55175
(Lokationsbündelstruktur) und 55225 (Blindarbeits-Abrechnungsdaten NeLo). Die
Schritte 4 (NB → MSB) und 8 (NB → ÜNB) desselben Diagramms bleiben außen vor, weil
sie nicht an den Lieferanten gehen.

Wie viel dabei übernommen wird, hängt am Objekt der Änderung: 55616 (MaLo) und
55691 übernehmen die Marktlokation, 55175 zusätzlich die ruhende Marktlokation. Für
55615, 55617–55620 bleibt es bei den Marktpartnern — die 55001 führt weder
Netzlokation (LOC+Z18) noch Messlokation (LOC+Z17), Tranche (LOC+Z19) oder
Technische/Steuerbare Ressource (LOC+Z20). Der Bereich weist das mit „0 von n
Feldern übernommen" aus. Ein RFF+TN führen diese Nachrichten laut AHB nicht; sie
sind keine Antwort auf einen Vorgang.

**Nachweis** (`scripts/test_folgenachrichten.js`, 38/38, beide Formatstände): alle
neun Stammdatenänderungen werden angeboten; 55002 erhält NB als Absender und LFN als
Empfänger, 55010 bleibt ohne Empfänger und ist als offen gekennzeichnet, 55011
bleibt ohne Absender und trägt den NB als Empfänger, 55038 bleibt ohne Empfänger,
55616 löst „LF" korrekt zum LFN auf und übernimmt die Marktlokation.

## 10. Bedingungs-Hilfe in den AHB-Vollformularen (29.07.2026)

Beim Absprung von einer 55001 zur Bestätigung 55002 fehlten die Fragezeichen-Symbole.
Ursache: Die Prüfung aus Abschnitt „Bedingungs-Hilfe" (28.07.2026) deckte die
32 Generatorseiten ab — die **vier AHB-Vollformulare** aber nicht, und diese banden
weder `_engine/bedingung-hilfe.js` noch die Bedingungstexte `pruef-ids/_bedingungen.js`
ein. Da die Folgenachrichten für UTILMD genau auf diese Seiten verweisen, fiel es
erst jetzt auf.

Beide Skripte sind ergänzt (nach der Engine geladen, die Hilfe greift per
MutationObserver auch beim Nachladen einer Prüf-ID). `scripts/test_bedingung_hilfe.js`
prüft die Vollformulare jetzt mit; er wartet auf das Lazy-Loading der Struktur und
liest die Deckung auch aus `ahbVollformMeta`. Mit `SEITE=<Teilstring>` lässt sich ein
Lauf eingrenzen.

| Lauf | Seiten | Prüf-IDs | Ausdrücke | mit Symbol | Verweise ohne Klartext | AHB-Bedingungen nicht erreichbar |
|---|---|---|---|---|---|---|
| Stichprobe (Standard) | 36 | 106 | 1.504 | 1.504 | 0 | 0 |
| `ALLE=1 SEITE=vollformular` | 4 | 553 | 11.732 | 11.732 | 0 | 0 |

### Nebenbefund: leeres Bezeichnungsfeld im Vollformular

Das Auswahlfeld zeigte nur „55002 – " ohne Bezeichnung. `werkzeuge/baue_vollformulare.py`
übernahm vorhandene Bezeichnungen mit `alt_index.get(pruefi, beschreibung)` — der
Altbestand führte aber **alle** Prüf-IDs mit leerem Text, und der leere Wert gewinnt
gegen den Vorgabewert. Die Bezeichnungen kommen jetzt bevorzugt aus der
Anwendungsübersicht: Die AHB-Extraktion trägt Trennartefakte aus dem
DOCX-Zeilenumbruch (52 Fälle wie „Bestätigun g Anmeldung"), die Übersicht führt
denselben Text sauber als Zellwert. Alle 553 Prüf-IDs haben jetzt eine Bezeichnung.

## 11. Prüfgrundlage folgt der Nachrichtenversion (29.07.2026)

Eine Nachricht mit `UNH+…+UTILMD:D:11A:UN:S2.1` wurde mit der Meldung „Version
unerwartet … (erwartet UTILMD:D:11A:UN:S2.2)" quittiert — auch auf der Seite des
Formatstands 202604, die genau diese Fassung führt. Ursache: In
`_engine/validator.js` (Importprüfung der vier UTILMD-Masken) war die Sollkennung
fest als S2.2 verdrahtet. Auf den Gas-Seiten war sie doppelt falsch: Dort gilt
G1.1 bzw. G1.2.

### Zuständigkeit statt fester Version

Die Sollkennung kommt jetzt aus `formatConfig.unhKennung` — jede Maske kennt ihre
eigene Fassung (S2.1/S2.2 Strom, G1.1/G1.2 Gas). Trägt eine Nachricht eine andere
Kennung, greift die neue Funktion `pruefeZustaendigkeit()`:

- Sie sucht die zuständige Stelle in `validator-registry.js` — derselben Datenbasis,
  aus der auch der universelle Validator seine Zuordnung zieht.
- Sie meldet als **Fehler**, dass die Nachricht nicht gegen ihr AHB/MIG geprüft
  wurde, und benennt Formatstand und Sparte, die zuständig sind.
- Die AHB-/MIG-abhängigen Prüfungen entfallen: Segment-Werteprüfer, BGM-Codeliste,
  STS-Codes und die Muss-Prüfung der Prüf-ID. Es bleibt die Syntaxprüfung, die von
  AHB und MIG unabhängig ist.

Der letzte Punkt kam durch den neuen Test ans Licht: Eine Gas-Nachricht auf einer
Strom-Maske erzeugte zwei Scheinfehler, weil die Sommer-/Winterzeitprüfung den
Tageswechsel der Sparte der **Seite** annimmt (Strom 00:00, Gas 06:00) — der
Zeitstempel `202610010400+00` ist für Gas korrekt und für Strom falsch. Auch
`ctx.sparte` stand fest auf `STROM` und kommt jetzt aus `formatConfig`.

### Weg zur richtigen Prüfung

Die Maske zeigt statt der Ergebniszeile einen Verweis: „im universellen Validator
öffnen" übergibt die Nachricht per `#pruefe=<Nachricht>` an `validator.html`, das
Formatstand, Sparte und Prüf-ID aus der UNH-Kennung selbst bestimmt und sofort
prüft. Daneben steht der Link auf die zuständige Generator-Maske.

**Nachweis** (`scripts/test_version_zustaendigkeit.js`, 40/40): Für alle vier
UTILMD-Masken wird eine Nachricht erzeugt und geprüft, dass
(1) die zuständige Maske keine Versionsmeldung mehr abgibt und die Prüf-ID-Prüfung
läuft, (2) jede der drei fremden Masken den Zuständigkeitsbefund mit Verweis zeigt
und **keinen** weiteren Fehler aus falschem AHB, (3) der universelle Validator über
die Fragmentübergabe den richtigen Formatstand erkennt und das Ergebnis anzeigt.
Zusätzlich geprüft: eine MSCONS-Nachricht auf der UTILMD-Maske verweist auf die
MSCONS-Seite desselben Formatstands.

## 12. Verwendungszeitraum der Daten in zwei Zeitscheiben (29.07.2026)

Nach einem Lieferbeginn übermittelt der Netzbetreiber dem neuen Lieferanten die
Stammdaten mit dem Verwendungszeitraum, für den sie gelten. In der Praxis sind das
zwei Zeitscheiben: Für die Zeit bis zum Lieferbeginn liegen dem neuen Lieferanten
**keine** Daten zu (SG6 RFF+**Z53**), ab dem Lieferbeginn gelten die übermittelten
Daten (SG6 RFF+**Z49**).

### AHB-Befund

Der AHB trägt den Zeitraum als SG6-Gruppe `RFF+<Qualität>::<Zeitraum-ID>`, gefolgt von
`DTM+Z25` (Verwendung der Daten ab) und `DTM+Z26` (bis). Maßgeblich sind drei
Bedingungen:

| Bedingung | Inhalt | Folge für die Vorbelegung |
|---|---|---|
| [126] | Die Zeitraum-ID (DE1156) ergibt sich aus der Wiederholungshäufigkeit: erstes SG6 = „1", zweites = „2" … | fortlaufende IDs |
| [131] | Das `DTM+Z25` der Zeitraum-ID „1" muss der auf `DTM+137` folgende Tag 0:00 Uhr deutscher Zeit sein — oder früher | erste Scheibe beginnt am Folgetag |
| [471] | `DTM+Z26` ist Muss, sobald eine größere Zeitraum-ID existiert | letzte Scheibe bleibt offen |

Ergänzend [534]: „Aufgrund der Wiederholbarkeit des SG4 STS ist die Angabe von max.
acht Verwendungszeiträumen möglich."

### Wiederholbare Segmentgruppe in der Formular-Engine

Die Engine bildete jede Instanz genau einmal ab — zwei Zeitscheiben waren nicht
darstellbar. Sie erkennt die Gruppe jetzt am RFF mit den Codes Z49/Z53 samt der
unmittelbar folgenden DTM+Z25/Z26 und bietet „**+ weiterer Verwendungszeitraum**"
an. Wiederholungen tragen das Pfad-Suffix `w<Nr>`, werden beim Erzeugen direkt hinter
der ersten Gruppe ausgegeben und bekommen ihre Zeitraum-ID nach [126] vorbelegt.

Dabei fiel auf, dass die Engine das DE1156 gar nicht ausgab: Der RFF-Zweig kannte nur
DE1153 und DE1154. Die Zeitraum-ID steht als dritte Komponente der C506
(`RFF+Z49::1`) und wird jetzt erzeugt; der Validator-Decoder kennt sie ebenfalls.

### Ableitung aus der Quellnachricht

Aus einer 55001 entstehen für die zwölf Folgenachrichten mit Verwendungszeitraum
(55615–55620, 55691, 55175, 55225 sowie 55218/55126/55672) zwei Zeitscheiben:

| Zeitraum-ID | Qualität | ab | bis |
|---|---|---|---|
| 1 | Z53 – Keine Daten | Folgetag des Nachrichtendatums, 0:00 | Lieferbeginn (DTM+92 der 55001) |
| 2 | Z49 – Gültige Daten | Lieferbeginn | offen |

Liegt der Lieferbeginn nicht nach dem Folgetag, entfällt die erste Scheibe — dann
bleibt es bei „Gültige Daten" ab Lieferbeginn. Prüf-ID 55691 führt laut AHB kein
`DTM+Z26` und keine Zeitraum-ID; dort wird nur die offene Scheibe vorbelegt.
Der Folgenachrichten-Bereich weist die Zeitscheiben je Nachricht aus.

### Nebenbefund: Zeitzonenversatz bei übernommenen Zeitpunkten

Die Übernahme von Terminen rechnete den EDIFACT-Zeitstempel nicht in Ortszeit
zurück: Aus `DTM+92:202609302200+00` wurde die Formulareingabe „30.09.2026 22:00",
die die Engine als deutsche Ortszeit liest und erneut nach UTC rechnet — in der
Sommerzeit **zwei Stunden** daneben. Im UTC-Container fiel das nicht auf. Die
Umwandlung ist jetzt die exakte Umkehrung der Engine-Logik; der Testlauf arbeitet
deshalb in der Zeitzone Europe/Berlin.

### Kuratierte Maske

Auch die geführte UTILMD-Maske kannte nur einen Zeitraum mit fester Qualität Z49.
Sie bietet jetzt je Prüf-ID mit Verwendungszeitraum vier zusätzliche, optionale
Felder (Qualität je Zeitraum, `DTM_Z25_2`/`DTM_Z26_2`) und gibt die zweite Gruppe mit
fortlaufender Zeitraum-ID aus. Bleiben die Felder leer, ändert sich nichts —
Golden-Regression 189 PIDs unverändert.

**Nachweis** (`scripts/test_zeitscheiben.js`, 8/8, beide Formatstände, Zeitzone
Europe/Berlin): Aus einer 55001 erzeugt die Folgenachricht 55616 genau
`RFF+Z53::1` + `DTM+Z25` (Folgetag) + `DTM+Z26` (Lieferbeginn) und `RFF+Z49::2` +
`DTM+Z25` (Lieferbeginn) ohne Ende; der übernommene Lieferbeginn trägt denselben
UTC-Zeitstempel wie die Quelle; 55691 erhält nur die offene Scheibe; die kuratierte
Maske erzeugt aus ihren Feldern dieselbe Struktur.

## 13. Verwendungszeitraum über alle Nachrichten geprüft (29.07.2026)

Die Zeitscheibenlogik aus Abschnitt 12 war auf die Qualitäten Z49/Z53 zugeschnitten.
Der Abgleich über **alle 965 Prüf-IDs beider Formatstände** zeigt: Der AHB führt den
Verwendungszeitraum in 90 (202604) bzw. 92 (202610) Prüf-IDs — und mit sechs
Qualitätsangaben statt zwei.

| Qualität (SG6 RFF DE1153) | Bedeutung |
|---|---|
| Z49 | Gültige Daten |
| Z53 | Keine Daten |
| Z47 | Im System vorhandene Daten |
| Z54 | Im System keine Daten vorhanden |
| Z48 | Erwartete Daten |
| Z55 | Keine Daten erwartet |

Sie treten in drei Kombinationen auf:

| Familie | 202604 | 202610 | Prozesse |
|---|---|---|---|
| Z49/Z53 | 46 | 47 | Übermittlung von Daten (Stammdatenänderung, Abrechnungsdaten) |
| Z47/Z48/Z54/Z55 | 43 | 44 | Rückmeldungen und Anfragen des Datenclearings |
| Z48/Z55 | 1 | 1 | Rückmeldung auf Stammdaten Bilanzkreistreue (55671) |

Betroffen sind UTILMD Strom (89 bzw. 91 Prüf-IDs) und UTILTS (25001); UTILMD Gas und
alle übrigen Nachrichtentypen führen den Verwendungszeitraum nicht.

### Drei Lücken, jetzt geschlossen

1. **Die Formular-Engine erkannte nur Z49/Z53.** Für 43 bzw. 44 Prüf-IDs des
   Datenclearings war die Gruppe nicht wiederholbar. Sie erkennt jetzt alle sechs
   Qualitäten. Nachweis über alle betroffenen Prüf-IDs: 89/89 (202604) und 91/91
   (202610) im Vollformular, dazu UTILTS 25001 in beiden Ständen.

2. **Die kuratierte Maske ließ die SG6-Gruppe in 48 Prüf-IDs ganz weg.** Sie band die
   Ausgabe an eine feste Liste von Transaktionsgründen (ZX2–ZY2, ZAM) statt an den AHB
   der Prüf-ID. Rückmeldungen wie 55137 trugen dadurch in `STS+E01` einen Verweis auf
   die Zeitraum-ID ([22]), ohne dass die Nachricht den Zeitraum selbst führte.
   Maßgeblich ist jetzt, ob der AHB der Prüf-ID den Verwendungszeitraum kennt.
   Die Golden-Snapshots der Strom-Fassungen wurden dafür bewusst neu gesetzt: 47
   (202604) bzw. 48 (202610) Prüf-IDs tragen jetzt zusätzlich `RFF+Z47::1` bzw.
   `RFF+Z49::1`; Gas bleibt unverändert (88/89 PIDs).

3. **Die Qualitätsauswahl war fest auf Z49/Z53 verdrahtet.** Sie kommt jetzt je
   Prüf-ID aus der AHB-Datenbasis (`werkzeuge/ergaenze_zeitscheiben.py`), samt
   Klartext. Vorgabe bleibt Z49, wo der AHB „Gültige Daten" führt; in den
   Clearing-Familien wird die erste geführte Qualität vorgeschlagen und im Hinweis
   ausgewiesen, dass die zutreffende Qualität zu wählen ist — geraten wird nichts.

### Vorbelegung aus einer Quellnachricht

Die Zwei-Scheiben-Ableitung (Z53 bis zum Lieferbeginn, Z49 ab Lieferbeginn) gilt für
die Übermittlung von Daten. Führt die Zielnachricht die Clearing-Qualitäten, wird nur
der Zeitraum ab Lieferbeginn vorgeschlagen und **keine** Qualität gesetzt — welche
zutrifft, weiß allein der Absender. Die Prozessketten führen dafür je Schritt die im
Ziel-AHB vorhandenen Codes (`zeitraumCodes`).

**Nachweis** (`scripts/test_zeitscheiben.js`, 12/12): zusätzlich zu den Prüfungen aus
Abschnitt 12 die Abdeckung aller Prüf-IDs mit Verwendungszeitraum im Vollformular
sowie die Datenclearing-Rückmeldung 55137, die in der kuratierten Maske die vier
Qualitäten Z47/Z48/Z54/Z55 anbietet, `RFF+Z47::1` erzeugt und in `STS+E01` auf
Zeitraum 1 verweist.

## 14. Konsolidierung, Schritte 1 und 2 (30.07.2026)

Die Fehler der letzten Arbeitsschritte hatten dieselbe Ursache: Dieselbe Fachregel
stand an zwei Stellen, und die zweite wurde vergessen. Zwei Doppelungen sind jetzt
aufgelöst.

### Schritt 1: eine Datenhaltung der AHB-Struktur

Die UTILMD-Vollformulare und der Validator lasen die Segmentstruktur aus
`pruef-ids/ahb-vollform/<PID>.js` — einer zweiten, aus `_form-meta.js` abgeleiteten
Kopie. Genau diese Kopie war veraltet (55001 mit sechs statt zwei Lokationsangaben),
ohne dass es auffiel.

- Vollformular und Validator lesen jetzt `pruef-ids/_form-meta.js`, dieselbe Datei
  wie die kuratierte Maske und alle übrigen Nachrichtentypen.
- Die Validator-Registry kennt keinen Sonderweg mehr (`vollformBasis` entfällt);
  UTILMD unterscheidet sich nur noch darin, dass die Registry auf `vollformular.html`
  statt auf `index.html` zeigt.
- **553 Datendateien und 4 Index-Dateien entfallen**, dazu das Erzeugerskript
  `baue_vollformulare.py`. Das Paket schrumpft von 32 auf 24 MB.
- Die Bezeichnungen der Prüf-IDs kommen jetzt aus der Anwendungsübersicht statt aus
  der AHB-Extraktion (`werkzeuge/saeubere_beschreibungen.py`, 510 Einträge) — die
  Trennartefakte des DOCX-Zeilenumbruchs sind damit überall weg, nicht nur im
  Auswahlfeld des Vollformulars.

### Schritt 2: eine Prüflogik

Die vier UTILMD-Masken hatten mit `_engine/validator.js` eine eigene Importprüfung
neben dem universellen `_engine/ahb-validator.js`. Dort steckten die hart verdrahtete
UNH-Kennung und die fest auf Strom gestellte Sparte.

- Neu ist `_engine/import-pruefung.js`: Sie erkennt Typ, Formatstand, Sparte und
  Prüf-ID über die Validator-Registry, lädt die zugehörige Formular-Meta nach und
  prüft mit `AhbValidator`. Jede Maske prüft damit **jede** Nachricht gegen deren
  eigenes AHB/MIG — auch die eines anderen Formatstands; die Herkunft wird
  ausgewiesen und auf die zuständige Maske verlinkt.
- `_engine/validator.js` (548 Zeilen) und `_engine/_segment-registry.js` sind
  entfernt. Auch die Testinfrastruktur (`_engine/tests/harness.js`) prüft jetzt mit
  dem zentralen Validator.

### Was die Umstellung sichtbar gemacht hat

Die Masken erzeugten Segmente, die der zentrale Validator nicht kannte — vom
schwächeren Maskenvalidator waren sie nie beanstandet worden:

| Befund | Bewertung | Behandlung |
|---|---|---|
| `STS+7++ZX6+ZW4`: DE9012 „kein numerischer Wert" | Das MIG-Format gilt je Segment, DE9012 trägt aber je Statuskategorie Unterschiedliches (Zeitraum-ID bei STS+E01, Transaktionsgrundergänzung bei STS+7) | Zahlenprüfung auf STS+E01 begrenzt |
| `PIA` Artikelnummer nicht in der Codeliste | Die hinterlegte Liste ist ein Auszug (49 Nummern) | Hinweis statt Fehler |
| `RFF+Z60` „im AHB nicht vorgesehen" | Belegt in AHB-Kapitel 8.2 (Produktpakete); die Extraktion deckt nur die Prüf-ID-Tabellen ab | neue Schicht `_engine/daten/ahb-ergaenzungen.js` |

Die Ergänzungsschicht ist zugleich der erste Baustein von Schritt 3: Prozesswissen,
das nicht in den Prüf-ID-Tabellen steht, wird zu Daten mit Quellenangabe statt zu
Code in einer Sondermaske.

Ein weiterer Fund betraf die Folgenachrichten: `folgenachrichten.js` hatte einen
eigenen Parser und rechnete mit Segmentelementen **einschließlich** des Segment-Tags,
griff aber auf `AhbValidator.parse` zurück, wenn dieser verfügbar war — dort stehen
die Elemente **ohne** Tag. Auf den Maskenseiten war der Validator bisher nicht
geladen, deshalb fiel es nie auf; mit der Konsolidierung wären alle Feldübernahmen
stillschweigend leer geblieben. Die Struktur ist jetzt vereinheitlicht.

### Testlage

Golden-Regression 189 PIDs unverändert · Engine 416/416 · UTILMD-Seiten 556/556 ·
Folgenachrichten 38/38 · Zeitscheiben 12/12 · Version/Zuständigkeit 40/40 (neu
ausgerichtet: fremde Masken liefern jetzt dasselbe Ergebnis wie die zuständige) ·
Bedingungs-Hilfe lückenlos · domsim alle OK.

Die Selbstvalidierung meldet jetzt 475 statt 253 Befunde. Die Zahlen sind **nicht**
vergleichbar: Geprüft wird nun gegen AHB-Struktur, MIG-Feldformate, Codelisten und
Allgemeine Festlegungen statt gegen die schmalere Maskenlogik. Die Befunde betreffen
überwiegend Muss-Angaben, die die Testnachrichten nicht füllen (Termine, Objektdaten);
sie sind der Arbeitsvorrat für Schritt 3.

## 15. Schritt 3 und 4: Bestandsaufnahme und Plan (30.07.2026)

Die Schritte 1 und 2 sind umgesetzt. Für Schritt 3 — die kuratierte Maske als Sicht
auf die Engine — liegt jetzt die Zahlengrundlage vor; Schritt 4 hängt daran.

### Wie weit liegen kuratierte Liste und AHB-Meta auseinander?

Abgleich der Feld-IDs der kuratierten Regeldateien gegen die Segmentinstanzen der
Formular-Metas:

| Ordner | Prüf-IDs | in der Meta, nicht kuratiert | kuratiert, nicht in der Meta |
|---|---|---|---|
| 202604 UTILMD Strom | 187 | 3.778 | 337 |
| 202610 UTILMD Strom | 189 | 3.339 | 341 |
| 202604 UTILMD Gas | 88 | 1.434 | 121 |
| 202610 UTILMD Gas | 89 | 1.260 | 122 |

Die kuratierte Liste ist damit eine **Teilmenge mit Zusätzen** — kein Widerspruch zur
Meta:

- Was in der Meta steht und nicht kuratiert ist, sind einerseits Angaben, die die
  Maske automatisch erzeugt (CTA/COM, IDE+24, RFF+Z13 — je 85–189 Prüf-IDs),
  andererseits die Nutzdaten (CCI/CAV/SEQ/PIA), die die Maske über den
  Nutzdatenkatalog statt über Formularfelder abbildet.
- Was kuratiert ist und in der Meta fehlt, sind überwiegend Konventionen der Feld-IDs
  (`IDE` ohne Qualifier, `RFF_VZ_QUALITAET`) sowie ein kleiner Altbestand: LOC+Z16
  (15×) und LOC+Z21 (10×) in Prüf-IDs, die der AHB ohne diese Lokationen führt.

### Was Schritt 3 konkret bedeutet

1. **Feldauswahl statt Segmentliste.** Die kuratierte Datei je Prüf-ID wird zur Liste
   von Instanz-Adressen (Segment + Qualifier + Datenelement) auf der Meta, ergänzt um
   Reihenfolge und Beschriftung. Das Rendern und Erzeugen übernimmt die Engine.
2. **Prozesswissen als Datenschicht.** Vier Bausteine liegen bereits als eigene
   Dateien vor: `_prozess-meta.js` (EBD-Cluster, Transaktionsgründe),
   `_nutzdaten-katalog.js` (Objektdaten je Änderungsgrund), `_produkte-55001.js` und
   `_produktpaket.js` sowie — neu aus Schritt 2 — `_engine/daten/ahb-ergaenzungen.js`.
   Sie bleiben, verlieren aber ihre Verflechtung mit der Erzeugungslogik.
3. **`generator.js` entfällt** zugunsten der Engine plus einem schlanken Profil-Modul.

Der Preis ist eine vollständige Neubewertung der Golden-Snapshots: Alle 189 (Strom)
bzw. 89 (Gas) Nachrichten ändern sich mindestens in der Segmentreihenfolge. Das ist
machbar, verlangt aber einen eigenen Arbeitsblock mit fachlicher Durchsicht — nicht
nebenbei.

### Arbeitsvorrat, den die Konsolidierung sichtbar gemacht hat

Die Selbstvalidierung meldet 475 Befunde, davon 361 fehlende Muss-Segmente (die
Testnachrichten füllen die zugehörigen Felder nicht — erwartbar). Die übrigen 114
sind fachlich zu prüfen und gehören in Schritt 3:

| Art | Anzahl | Beispiel |
|---|---|---|
| Codewert außerhalb der AHB-Liste | ~60 | `CAV DE7110 "9911000000456": laut AHB zulässig sind Z39, Z40` |
| EBD-Nummer passt nicht zur Prüf-ID | ~14 | `STS DE1131 "E_0415": laut AHB zulässig ist E_0412` |
| Nutzdaten für Prüf-IDs, die sie nicht führen | ~30 | `Segment CCI ist im AHB der Prüf-ID 55110 nicht vorgesehen` |
| Codevergabestelle | 3 | `NAD DE3055 "293": laut AHB zulässig ist 9` |

Jeder dieser Befunde braucht eine Einzelentscheidung: Entweder die Maske erzeugt zu
viel, oder die Extraktion ist an der Stelle unvollständig (wie beim Produktpaket-Block
in Schritt 2 gezeigt).

### Schritt 4: Formatstände als Datenparameter

Erst nach Schritt 3 sinnvoll. Heute unterscheiden sich die Seitenbäume je Formatstand
nur in den Datendateien und der UNH-Kennung; die HTML-Seiten sind Kopien. Ist die
kuratierte Maske eine Sicht auf die Engine, bleibt je Nachrichtentyp genau eine Seite,
die den Formatstand über einen Parameter (`?stand=202610`) wählt. Der Aufwand liegt
dann fast vollständig in den Verweisen (Startseite, Registry, Prozessketten, Tests) —
mechanisch, aber breit.

## 16. Antwortcodes aus den Entscheidungsbaum-Diagrammen (30.07.2026)

Die Antwortcodes stammten bisher aus einem Textauszug-Extraktor
(`scripts/ebd_extractor.py`) mit Whitespace-Heuristiken. Ergebnis waren abgeschnittene
Hinweise („Der Empfänger übernimmt die Stammdaten. – hat."), unvollständige
Codelisten und Einträge für EBD, die es gar nicht gibt. In den Masken stand je
Prüf-ID **ein** fest hinterlegter Code — teils aus dem falschen Cluster.

### Werkzeug: ebdamame auf der DOCX-Fassung

Für EBD gibt es `ebdamame` — dieselbe Werkzeugfamilie wie kohlrahbi und migmose. Es
liest die **DOCX**-Fassung des Dokuments. Diese liegt im Spiegel des Projekts
(`eem/edi_energy_de/FV*/EBD_*.docx`); genutzt wird je Formatstand die Fassung mit dem
jüngsten Dokumentstand — dieselbe Regel wie bei den AHB:

| Formatstand | Datei | Dokumentstand |
|---|---|---|
| 202604 (gültig bis 30.09.2026) | `EBD_4.2_20260401_20260930_20260623_xoxx_12239.docx` | 23.06.2026 |
| 202610 (ab 01.10.2026) | `EBD_4.3_20261001_99991231_20261001_ooox_12141.docx` | 01.10.2026 |

`werkzeuge/ebd_docx_leser.py` wertet sie aus. Weil ebdamame das Dokument je
EBD-Schlüssel neu öffnet, läuft der Leser blockweise (`--von/--bis`) — sonst sprengen
350 Schlüssel den Arbeitsspeicher.

**Was ebdamame nicht abdeckt:** Das Dokument führt neben den Entscheidungsbäumen
reine Codelisten-Kapitel (S_xxxx, G_xxxx: Code / Nutzung / Name) mit den Antwortcodes
der Servicenachrichten — 105 bzw. 101 Kapitel. Sie sind keine Bäume und werden von
ebdamame nicht konvertiert. Dafür bleibt `werkzeuge/ebd_pdf_leser.py`, der die
PDF-Fassung über Wortkoordinaten liest; `werkzeuge/baue_ebd_daten.py` führt beide
Quellen zusammen (DOCX hat Vorrang).

Der Abgleich beider Quellen war zugleich die Qualitätsprobe: Bei den gemeinsamen EBD
stimmen 1.748 Cluster-Zuordnungen überein; in 19 Fällen und bei 7 EBD mit
abweichender Codemenge (etwa AA1/AA2/AA3 in E_0406, die im PDF-Satz nicht als Code
erkennbar sind) liegt ebdamame richtig — ein weiteres Argument für die DOCX als
Primärquelle.

Das **Cluster** steht im Dokument selbst: bei den Bäumen als „Cluster: Zustimmung"
bzw. „Cluster: Ablehnung" im Hinweistext, bei den Codelisten am Anfang des Namens
(„Zustimmung ohne Korrekturen", „Ablehnung (Doppelmeldung)"). Es muss nicht geraten
werden.

Ergebnis (`_engine/daten/ebd-antwortcodes.js`, 768 KB):

| Formatstand | EBD | Codes | mit Cluster | Verweise |
|---|---|---|---|---|
| 202604 | 357 | 2.194 | 1.452 | 9 |
| 202610 | 350 | 2.180 | 1.441 | 9 |

Die 9 Verweise sind EBD, die im Dokument auf ein anderes zeigen („Es ist das EBD
E_0527 zu nutzen."); sie werden beim Aufbau der Auswahl aufgelöst. EBD ohne
Entscheidungsbaum führt der Bestand nicht mehr — der frühere Textauszug-Extraktor
(`scripts/ebd_extractor.py`, entfernt) hatte dafür Codes erfunden.

### Auswahl in den Masken

Das Feld „Status der Antwort" (STS+E01) war ein schreibgeschütztes Textfeld mit dem
fest hinterlegten Code. Es ist jetzt ein **Auswahlfeld**:

- Welche EBD gelten, sagt der AHB der Prüf-ID (STS+E01 DE1131) — nicht mehr die
  Prozess-Meta. Damit verschwinden die Fälle, in denen die Nachricht auf ein EBD
  verwies, das der AHB dort nicht führt (12 Prüf-IDs).
- Angeboten werden die Codes dieser EBD, **gefiltert nach dem Cluster der Nachricht**:
  eine Bestätigung zeigt nur Zustimmungs-, eine Ablehnung nur Ablehnungscodes. Der
  Hinweis unter dem Feld nennt die EBD, das Cluster und die Zahl der ausgeblendeten
  Codes.
- Führt ein EBD keine Cluster (Qualitätsrückmeldungen), stehen alle Codes zur Wahl.
- „A**" („alle festgestellten Antworten") bleibt wählbar, ist aber nie Vorgabe.
- Prüf-IDs mit eigenem, kuratiertem Auswahlfeld (etwa 55017/55018 mit E01_ZUS/E01_ABL)
  bleiben unberührt.

Der Validator gleicht das Cluster jetzt ebenfalls ab: Ein Ablehnungscode in einer
Bestätigung wird als Fehler gemeldet, mit Angabe der zulässigen Codes.

### Was dabei korrigiert wurde

Die Golden-Snapshots aller vier Ziele wurden bewusst neu gesetzt:

| Änderung | Prüf-IDs | Beispiel |
|---|---|---|
| Code gehörte zum falschen Cluster | 10 (Strom) | 55064: `A01` ist in E_0009 **Ablehnung** → jetzt `A05` (Zustimmung) |
| EBD-Nummer laut AHB statt Prozess-Meta | 12 (Strom) | 55644: `E_0412` → `E_0415` |
| Gas-Antworten trugen Codes fremder Listen | 32 (Gas) | 44021: `A03` → `E15` (G_0002 kennt nur E15/ZE0) |

**Nachweis** (`scripts/test_antwortcodes.js`, 12/12): Für alle Antwort-Prüf-IDs beider
Formatstände wird geprüft, dass ein Auswahlfeld erscheint, jede Option im referenzierten
EBD existiert und clusterrein ist, der gewählte Code samt EBD-Nummer in STS+E01 landet,
„A**" nicht als Vorgabe dient, ein Ablehnungscode in einer Bestätigung beanstandet wird
und jede im AHB referenzierte EBD-Nummer in den Daten vorhanden ist.

Die Selbstvalidierung sinkt von 475 auf 463 Befunde; die Cluster-Prüfung meldet über
alle erzeugten Testnachrichten **keinen** Verstoß.

## 17. Bildschirmaufteilung der Generatorseiten (30.07.2026)

Die Ausgabespalte war zu schmal: EDIFACT-Segmente brachen mitten im Wert um, während
die Folgenachrichten-Spalte mehr Platz belegte als nötig.

**Maßstab ist jetzt die Nachricht selbst.** Ein Segment soll ohne Umbruch in eine
Zeile passen; Bezugsgröße sind die längsten regulären Segmente — der Nachrichtenkopf
UNB (79 Zeichen) und die Adress-Segmente wie NAD+Z04, deren Komponenten der MIG mit
je an..35 zulässt. Gewählt sind **112 Zeichen** (`width: 112ch` am Ausgabefeld,
Monospace 13 px ≈ 874 px). Freitexte (FTX) brechen am Zeilenende um
(`white-space: pre-wrap`), statt die Spalte zu sprengen.

| Bereich | vorher | jetzt |
|---|---|---|
| Ausgabefeld | flexibel, meist ~380 px | 112 Zeichen ≈ 874 px, Höhe 62 vh |
| Folgenachrichten | ~0,8 Anteil der Restbreite | feste Spalte 320 px |
| Formular | fest ≥ 500 px | flexibel ab 380 px |
| Seitenbreite (Engine-Seiten) | 1.280 px | 2.000 px |

Der Folgenachrichten-Block hängt sich als **dritte Spalte** in das Raster, wenn die
Seite eines führt — zuvor stand er auf den Engine-Seiten unter der Ausgabe und auf den
kuratierten Masken daneben. Reicht die Bildschirmbreite nicht (unter rund 1.660 px),
rutscht er unter die beiden Spalten und nutzt die volle Breite; unter 980 px wird die
Seite einspaltig. Innerhalb der schmalen Spalte steht die Prüf-ID mit Kurzbeschreibung
in der ersten Zeile, Richtung und Feldzahl darunter.

Geprüft bei 2.531, 1.920 und 1.600 px Fensterbreite auf kuratierter Maske,
Vollformular und Engine-Seite (MSCONS). Testlage unverändert: UTILMD-Seiten 556/556,
Engine 416/416, Folgenachrichten 38/38, Zeitscheiben 12/12, Antwortcodes 12/12,
Golden alle vier Ziele unverändert.

## 18. Aufbau des STS-Segments: Transaktionsgrund und Ergänzung (30.07.2026)

**Befund.** Die Eingabemaske zeigte im SG4 STS ein einziges Mehrfachauswahlfeld mit
dem Transaktionsgrund *und* den Ergänzungen (E03, ZW3, ZW4, ZW5); erzeugt wurde
`STS+7++E03'` — die Ergänzung fehlte in der Nachricht.

**Prüfung gegen MIG und AHB.** Das MIG UTILMD Strom (S2.1/S2.2) führt im Segment
„Transaktionsgrund / Ergänzung / Transaktionsgrund befristete Anmeldung" die Gruppe
**C556 dreimal**, jede mit dem Datenelement 9013:

| Element | Gruppe | Inhalt | MIG-Status |
|---|---|---|---|
| 1 | C601 | 9015 Statuskategorie = 7 | M |
| 2 | C555 | 4405 — nicht benutzt | N |
| 3 | C556 | 9013 **Transaktionsgrund** (E01, E03, ZX6 …, 56 Codes) | R |
| 4 | C556 | 9013 **Transaktionsgrundergänzung** (ZW0–ZX1, ZAP, ZZB, ZZC — 15 Codes) | D |
| 5 | C556 | 9013 **Ergänzung für Lieferende bei befristeter Anmeldung** (E01, E03) | D |

Beispiel des MIG: `STS+7++E01+ZW4+E03'`. Die AHB-Tabelle benennt alle drei Stellen als
„DE 9013" und listet ihre Codes hintereinander — deshalb legte die Extraktion sie in
einen Topf. Gleiches gilt für die Antwortsegmente:
`STS+E01++A01:E_0004::2'` (Zeitraum-ID als **viertes Unterelement** der Gruppe, DE 9012)
und `STS+Z35++A32:E_0624+ZW5:::20072281644'`. UTILMD **Gas** ist nicht betroffen: dort
trägt die Ergänzung eine eigene Statuskategorie (`STS+Z17++E01'`).

**Umsetzung.**

1. `werkzeuge/lies_sts_struktur.py` liest den Segmentaufbau aus den MIG-DOCX beider
   Formatstände (UTILMD Strom/Gas, UTILTS, IFTSTA, INSRPT, MSCONS) und schreibt
   `_engine/daten/sts-struktur.js` — je Segment die Reihenfolge der Gruppen mit ihren
   Datenelementen und zulässigen Codes.
2. `werkzeuge/teile_sts_positionen.py` versieht jedes Datenelement der STS-Instanzen in
   den Formular-Metas mit seiner Stelle (`pos`, `sub`, `migSt`) und zerlegt ein DE 9013
   mit Codes mehrerer Gruppen. Die Zuordnung folgt der AHB-Reihenfolge: Die Stelle
   wächst monoton, jeder Code landet in der ersten Gruppe ab der laufenden Stelle, die
   ihn im MIG führt. So bleibt „E06 … ZW6 ZW7 E01 E03" richtig getrennt.
   **975 STS-Instanzen** geprüft, **96 zerlegt** (47 bzw. 49 Prüf-IDs je Formatstand).
3. Die Engine (`_engine/ahb-form-engine.js`) rendert je Gruppe ein eigenes Auswahlfeld
   und setzt das Segment positionsgenau zusammen; die Mehrfachauswahl entfällt.
4. Die kuratierten UTILMD-Masken (`_engine/generator.js`) unterscheiden Grund und
   Ergänzung nicht mehr am Codemuster, sondern an der MIG-Codeliste, schreiben die
   Zeitraum-ID als Unterelement und kennen das neue Feld `STS_7_befristet`
   (`werkzeuge/aktualisiere_utilmd_regeln.py`, ergänzt in 55013/55014/55015/55600/55602
   je Formatstand).
5. Der Validator (`_engine/ahb-validator.js`) prüft jede Gruppe gegen den MIG-Aufbau:
   „Code ZW3 steht in Element 3, gehört laut MIG aber als Transaktionsgrundergänzung in
   Element 4." Der Decoder führt DE 9012 nun als viertes Unterelement der Gruppe.

**Fachliche Korrektur nebenbei.** In 55013/55014/55015 („Anmeldung / Zuordnung EoG",
Kap. 8.6) standen E01 und E03 als Transaktionsgrund zur Wahl, obwohl der AHB sie dort
nur mit Paketbedingung `[9P0..1]` als Ergänzung für das befristete Lieferende führt.
Die Grundliste ist jetzt E06/Z02/Z36/Z37/Z39/ZC6/ZC7/ZT6/ZT7/ZZD, Vorgabe E06
(Ersatzbelieferung) — auch in `_prozess-meta.js` nachgezogen.

**Wirkung auf die Ausgabe.** 47 (202604) bzw. 48 (202610) Golden-Nachrichten ändern
sich, davon 44 durch die Zeitraum-ID (`…A01:E_0410::1'` statt `…A01:E_0410+1'`) und
drei durch den korrigierten Transaktionsgrund. Snapshots bewusst neu gesetzt.

**Nachweis.** `scripts/test_sts_aufbau.js`: 748 STS-Segmente aus vier Zielen, 94 mit
Transaktionsgrundergänzung, 89 mit Zeitraum-/Lokations-ID, dazu die Gegenprobe, dass
der Validator einen Code an falscher Stelle meldet. Übrige Testlage grün: UTILMD-Seiten
556/556, Engine 416/416, Folgenachrichten 38/38, Zeitscheiben 12/12, Antwortcodes
12/12, Version/Zuständigkeit 40/40, Bedingungs-Hilfe lückenlos (1.504 Ausdrücke),
domsim alle vier Ziele OK, Golden nach Neusetzung unverändert.

## 19. Formular: Zeitangaben, Vorbelegungen, Antwortcodes, Ansprechpartner (30.07.2026)

Vier Punkte aus der Anwendung, in dieser Reihenfolge abgearbeitet.

### 19.1 Die Zeitangabe der Nachricht steht jetzt am Feld

Im SG4 DTM+471 („Ende zum nächstmöglichen Termin") wurde `01.09.2026 00:00` eingegeben
und `DTM+471:202608312200?+00:303'` erzeugt — auf den ersten Blick ein anderer Tag.
Beides ist derselbe Zeitpunkt: EDIFACT führt Termine in UTC, und im Sommer gilt MESZ
(UTC+2); der Beginn des 01.09. ist zugleich das Ende des 31.08.

Unter jedem Datumsfeld steht deshalb jetzt der Wert, der in die Nachricht geht:

    EDIFACT: 202608312200?+00:303 · 01.09.2026 00:00 MESZ = Tagesende 31.08.2026 24:00

Der Hinweis folgt der Eingabe live. Sonderfälle: Beim Gas weist er den Beginn des
Gastages (06:00 deutscher Zeit) aus, beim Nachrichtendatum DTM+137 die Uhrzeit der
Erstellung — dort gilt keine Tagesende-Regel. Umgesetzt in der zentralen Engine
(`aktualisiereZeitanzeige`) und in den kuratierten UTILMD-Masken (`zeigeZeitangaben`),
damit alle Nachrichtentypen dieselbe Anzeige haben.

### 19.2 Transaktionsgrundergänzung sinnvoll vorbelegt

Bisher stand in der Ergänzung der erste Code der AHB-Liste — meist ZW3 („Erzeugende
Marktlokation"), obwohl der Regelfall die verbrauchende Marktlokation ist. Vorbelegt
wird jetzt **ZW4**; nennt der Anwendungsfall ausdrücklich eine Erzeugung („erz. MaLo",
EEG, KWK) oder eine Tranche, gilt ZW3 bzw. ZW5. Grundlage ist die Bezeichnung der
Prüf-ID im AHB. 21 Testnachrichten je Formatstand tragen dadurch ZW4 statt ZW3;
die sechs erzeugenden Prüf-IDs (55080, 55605, 55672–55675) behalten ZW3.

### 19.3 Antwortcodes in allen Masken, nicht nur in den kuratierten

Die Auswahl der EBD-Antwortcodes gab es bisher nur in den kuratierten UTILMD-Masken.
Sie steht jetzt in `_engine/antwortcode-auswahl.js` und wird von beiden Seiten genutzt —
Vollformulare und alle übrigen Nachrichtentypen (IFTSTA, ORDRSP, INVOIC …) zeigen im
Feld „Code des Prüfschritts" dieselbe Liste.

Das Cluster ermittelt sich in drei Stufen:

1. **AHB-Bedingung am Datenelement** — `[360] Es sind nur Antwortcodes aus dem Cluster
   Zustimmung erlaubt` bzw. `[359] … Ablehnung`. Das ist die genaueste Quelle, weil sie
   je Segmentinstanz gilt.
2. **Prozess-Meta** der Seite (`antwortcluster`), dafür laden die Vollformulare nun
   `_prozess-meta.js` mit.
3. **Bezeichnung des Anwendungsfalls** („Bestätigung …", „Ablehnung …").

Beispiel 55017 (Bestätigung Kündigung): 5 Codes aus E_0614, Cluster Zustimmung,
12 Codes des anderen Clusters ausgeblendet — vorher ein freies Textfeld. Führt der AHB
mehrere EBD (55080: E_0622 und E_0623), zieht die EBD-Nummer im DE 1131 automatisch zum
gewählten Code nach.

### 19.4 Ansprechpartner (CTA/COM) nur noch auf Wunsch

`CTA+IC+:Ansprechpartner'` und `COM+mako@beispiel.de:EM'` standen in jeder erzeugten
Nachricht. Der AHB führt die Segmentgruppe aber überwiegend als **Kann** (UTILMD: SG3
„Kann"), in Testnachrichten ist sie Ballast. Das Formular hat jetzt zwei leere,
optionale Felder (Name → CTA, E-Mail → COM); ohne Eingabe entfallen beide Segmente.

Pflicht bleibt der Ansprechpartner dort, wo der AHB die Gruppe als „Muss" führt —
87 Prüf-IDs, darunter PARTIN (14), ORDERS/ORDRSP SG5, QUOTES/REQOTE, UTILTS 25001/25010,
IFTSTA 21037/21038. Dort entstehen weiterhin Beispielangaben, begleitet vom Hinweis
„Ansprechpartner (CTA/COM) ist in dieser Prüf-ID laut AHB anzugeben".

### 19.5 Nebenbefund: zweite Formular-Meta bei ORDERS

Bei der Arbeit an 19.4 fiel auf, dass die beiden ORDERS-Seiten nicht `_form-meta.js`
luden, sondern eine ältere `_orders-meta.js` — ohne Segmentgruppen-Ausdrücke (`sgExpr`),
ohne die Zeitscheiben-Ergänzungen und ohne die STS-Positionen aus Abschnitt 18. Die
Seiten nutzen jetzt die gemeinsame Datei (46 statt 44 Prüf-IDs im Formatstand 202604);
die veraltete Datei und die verwaiste `_mscons-meta.js` sind entfernt.

### Nachweis

Golden-Snapshots Strom bewusst neu gesetzt (21 Nachrichten je Stand, ZW4 statt ZW3);
Gas unverändert. Testlage: UTILMD-Seiten 556/556, Engine 416/416, STS-Aufbau grün,
Folgenachrichten 38/38, Zeitscheiben 12/12, Antwortcodes 12/12, Version/Zuständigkeit
40/40, abhängige Segmente 4/4, Muss-Validierung und harte Bedingungsprüfung OK,
Bedingungs-Hilfe lückenlos (1.514 Ausdrücke, 1.959 AHB-Bedingungen erreichbar),
domsim alle vier Ziele OK. Die Selbstvalidierung meldet für Strom 516 statt 494
Befunde: Mit ZW4 verlangt der AHB andere Segmentgruppen (Anschlussnehmer,
Hausverwalter, Gruppenzuordnung) als mit ZW3 — dieselbe bekannte Kategorie „Muss-Segment
in der Testnachricht nicht befüllt", kein neuer Fehlertyp.

## 20. Startseite, Statusfarben und Antwortcodes nach Entscheidungsbaum (30.07.2026)

### 20.1 Themenauswahl der Startseite

Das Auswahlfeld führte alle Verzeichniskategorien des BDEW — auch solche ohne
EDIFACT-Nachricht (Codelisten, API-Webdienste, Formatübergreifende Dokumente,
Redispatch, Regelungen zum Übertragungsweg). Sie sind jetzt ausgeblendet; maßgeblich
ist, ob das MANIFEST für das Thema Nachrichtentypen führt. Kommt später ein Generator
hinzu, erscheint das Thema von selbst wieder.

### 20.2 Statusfarben vollständig

Die kuratierten UTILMD-Masken kannten die CSS-Klassen `status-Muss`, `status-Bedingt`
und `status-Kann`. Die Regeldateien vergeben aber fünf Werte: neben diesen auch
**Muss-bedingt** (1.220 Segmente) und **Soll** (300). Beide blieben ungefärbt — darunter
SG5 LOC+Z16 „ID der Marktlokation", der auffälligste Fall. Sie sind jetzt wie „bedingt"
eingefärbt und tragen am Feld den Zusatz „(MUSS, bedingt)" bzw. „(SOLL)".

### 20.3 Antwortcodes folgen den Prüfschritten

**Befund.** In 55017 standen bei Ergänzung ZW4 („Verbrauchende Marktlokation") auch A12
und A17 zur Auswahl. Der Entscheidungsbaum E_0614 verzweigt aber schon im ersten
Schritt:

    Schritt 10: „Wurde im Geschäftsvorfall angegeben, dass es sich um eine
                 verbrauchende Marktlokation handelt?"
        ja   -> Schritt 20  -> A01, A03, A04, A05, A06, A08, A09, A99
        nein -> Schritt 500 -> A10, A12, A13 … A18

A12/A17 liegen also hinter dem Nein-Zweig und sind bei ZW4 unerreichbar.

**Datengrundlage.** `werkzeuge/ebd_docx_leser.py` liest jetzt zusätzlich die
Prüfschritte und verfolgt für jeden Antwortcode die Wege durch den Baum (Tiefensuche
mit Zyklusschutz — Schritte wie „Solange die Vollmacht nicht eingetroffen ist" verweisen
auf sich selbst). Ergebnis je EBD: `schritte {Nr: Frage}` und
`pfade {Code: [[[Nr, Antwort], …], …]}`. Ausgeliefert werden die 154 Bäume je
Formatstand, die ein AHB tatsächlich nennt (STS+E01/AJT DE 1131) —
`_engine/daten/ebd-pfade.js`, 402 KB; die Codeliste bleibt unverändert bei 769 KB.

**Auswertbare Fragen.** Von 415 verschiedenen Prüffragen lassen sich zehn aus dem
Formular beantworten. Sie stehen als kuratierte Tabelle in
`_engine/antwortcode-auswahl.js`:

| Frage | Merkmal | ja bei | nein bei |
|---|---|---|---|
| Handelt es sich bei der Marktlokation um eine verbrauchende Marktlokation? | Lokationsart | ZW4 | ZW3 |
| Wurde der Anwendungsfall für eine verbrauchende Marktlokation verwendet? | Lokationsart | ZW4 | ZW3 |
| … oder ruhende Marktlokation …? | Lokationsart | ZW4, ZAP | ZW3 |
| Wurde im Geschäftsvorfall angegeben, dass es sich um eine verbrauchende MaLo handelt? | Lokationsart | ZW4 | ZW3 |
| Handelt es sich um eine Tranche? | Lokationsart | ZW5 | ZW3, ZW4, ZAP |
| Handelt es sich um Geschäftsvorfall 1 / 2 / 3? | Geschäftsvorfall | ZW0 / ZW1 / ZW2 | die jeweils anderen |
| … messtechnische Einordnung „keine Messung" (pauschale Marktlokation)? | Messtechnik | ZW6 | ZW7 |

Bewusst zurückhaltend: Eine **Tranche** beantwortet die Frage nach der verbrauchenden
Marktlokation nicht (sie kann verbrauchend oder erzeugend sein) — dort wird nicht
gefiltert. Ebenso bleiben alle Fragen unbewertet, die nur der Absender beantworten kann
(Fristen, Vertragslage, Vollmacht, Systemstände, Regelzone). Und der Filter räumt die
Auswahl nie leer: Bliebe kein Code übrig, ist die Zuordnung nicht eindeutig — dann
bleiben alle wählbar, mit entsprechendem Hinweis.

**Wirkung.** 88 Konstellationen aus 267 Antwortnachrichten, 454 nicht erreichbare Codes.
Für 55017: ZW4 → A03/A09, ZW3 → A12/A17. Der Hinweis unter dem Feld nennt den Grund
(„2 Code(s) im Entscheidungsbaum für diesen Geschäftsvorfall nicht erreichbar —
Prüfschritt 10: …"). Die Liste wird nachgeführt, sobald die Ergänzung gewechselt wird —
in der kuratierten Maske wie im Vollformular.

**Nebenbefund.** Vier Prüf-IDs (55017/55018 je Formatstand) führten im Feld „Status der
Antwort" noch kuratierte Platzhalter („Zustimmung"/„Ablehnung") statt der EBD-Auswahl.
Die EBD-Auswahl hat jetzt Vorrang vor einer Optionsliste aus der Regeldatei.

**Nachweis.** `scripts/test_ebd_abhaengigkeiten.js`: 267 Antwortnachrichten, Gegenprobe
an E_0614 (beide Zweige vollständig getrennt, ohne Angabe der Lokationsart kein Filter),
dazu die Formularprüfung in kuratierter Maske und Vollformular. Übrige Testlage
unverändert grün: UTILMD-Seiten 556/556, Engine 416/416, Antwortcodes 12/12,
STS-Aufbau, Zeitscheiben 12/12, Folgenachrichten 38/38, Bedingungs-Hilfe lückenlos,
domsim alle vier Ziele OK, Golden alle vier Ziele unverändert.

## 21. Vollständiger Abgleich aller Prüf-ID-Nachrichten (30.07.2026)

Auftrag: alle Prüf-ID-Nachrichten „eingehend auf veraltete Logiken, Abhängigkeiten,
Auswahllisten" prüfen und korrigieren.

### 21.1 Das Prüfwerkzeug

`scripts/pruefe_pid_konsistenz.js` gleicht jede Prüf-ID gegen ihre Quellen ab:

| Prüfung | Grundlage |
|---|---|
| Auswahllisten der kuratierten Masken | AHB-Codes der Prüf-ID (`_form-meta.js`), je STS-Position getrennt |
| Formularfelder ohne AHB-Grundlage | Qualifier der LOC-/DTM-/RFF-Segmente im AHB |
| Abhängigkeiten (`abhaengig`) | Zielfeld vorhanden, Code dort wählbar |
| Prozess-Meta | Transaktionsgrund, EBD-Nummer, Antwortcode, Cluster gegen AHB und EBD |
| EBD-Referenzen (DE 1131) | gelesene Entscheidungsbaum-Diagramme |
| STS-Codes | MIG-Segmentstruktur (`_engine/daten/sts-struktur.js`) |
| Antwortcodes ohne Weg | Prüfschritte des Entscheidungsbaums |

Erster Lauf: **1.020 Befunde** in 32 Zielen. Nach der Bereinigung: **0**.

### 21.2 Was korrigiert wurde

**416 ungenutzte Regeldateien entfernt.** Außer den vier kuratierten UTILMD-Masken band
keine Generatorseite ihre `<PID>.js` mehr ein — seit der Konsolidierung arbeitet die
Engine mit `_form-meta.js`. Die Altdateien wichen an 403 Stellen vom AHB ab und wären
bei jeder AHB-Fassung weiter auseinandergelaufen. Paketgröße: 24 → 22 MB.

**90 Formularfelder ohne AHB-Grundlage entfernt** (`werkzeuge/aktualisiere_utilmd_regeln.py`,
neue Regel 1b-2): LOC+Z16/Z21 in reinen Antwortnachrichten, DTM+93/92/158/159/471 und
RFF+ACW dort, wo der AHB sie nicht führt — etwa RFF+ACW in der Bestätigung 55023, deren
AHB RFF+TN vorsieht, und umgekehrt RFF+TN in der Anfrage 44022.

**Vier Platzhalter-Auswahlfelder** („Zustimmung"/„Ablehnung" statt Codes in
55017/55018 je Formatstand) durch die EBD-Auswahl ersetzt.

**143 Angaben der Prozess-Meta korrigiert** (`werkzeuge/korrigiere_prozess_meta.py`):

* 11 Transaktionsgründe, die der AHB der Prüf-ID nicht führt (55686/55687: ZX6 → ZY1,
  Gas 44037: ZG9 → ZC8, 44101/44103: Z15 → ZE5),
* 54 EBD-Nummern, die vom AHB abwichen — meist das Diagramm des Gegenstücks
  (G_0011 statt G_0012, E_0412 statt E_0415),
* 78 Antwortcodes, die im zugehörigen Diagramm nicht vorkamen oder zum falschen Cluster
  gehörten (E14 → E11 in S_0054, A01 → A05 in E_0009). Wo ein Diagramm nur die
  Ablehnungen kennzeichnet, kommen für eine Bestätigung die Codes ohne Cluster infrage —
  das berücksichtigt die Korrektur.

**Drei hart kodierte Prozessregeln an die Feldexistenz gebunden.** Die Lokationsregel
[348] („Marktlokation oder Tranche angeben") schlug auch in Antwortnachrichten an, deren
AHB gar kein LOC führt; ebenso die Regeln zu DTM+92 und DTM+93/471.

**Ein Extraktionsfehler behoben:** In IFTSTA war „EBD Nr. E_0286" über zwei Zellen
getrennt und als Code „E_028" gelesen worden.

### 21.3 Entscheidungsbäume vollständig gelesen

Zwei Fehler in der EBD-Auswertung:

1. Ein Prüfschritt kann **beides** tragen — einen Antwortcode *und* einen Folgeschritt
   (E_0043 Schritt 11 antwortet A01/A04 und prüft in Schritt 12 weiter). Die Auswertung
   endete dort; alles dahinter (A02) galt als unerreichbar.
2. Ohne diese Abbruchbedingung wächst die Zahl der Wege exponentiell — ein Zwischenstand
   erzeugte eine 1,6 GB große Zwischendatei und lief in den Speicherfehler.

Gelöst durch eine **Dominator-Analyse** statt Wegaufzählung: Ein Schritt liegt auf jedem
Weg zu einem Code, wenn der Code nicht mehr erreichbar ist, sobald man diesen Schritt
ausspart; ist der Code dann nur über einen Zweig erreichbar, ist dessen Antwort zwingend.
Das ist linear im Graphen und konservativ — was nicht auf allen Wegen gilt, schränkt
nicht ein. Gespeichert wird je Code nur diese Bedingungsliste (`ebd-pfade.js`, 365 KB).

Zwei Kapitel (E_0406/E_0407) bringen die Konvertierung der aktuellen ebdamame-Fassung
zum Stillstand; die blockweise Extraktion fängt das mit einer Zeitgrenze ab und holt den
Block einzeln nach. Ihre Codes stammen aus der letzten vollständigen Auswertung
(`ahbdaten/ebd_nachtrag.json`) — die Codeliste bleibt damit vollständig (2.194 bzw.
2.180 Codes), nur die Baumstruktur fehlt für diese beiden.

### 21.4 Aufschlüsselung der Bäume als eigenes Paket

`werkzeuge/ebd_baum_bericht.py` erzeugt **je Kapitel eine eigene Datei** (Markdown und
JSON), gruppiert nach Präfix — auf Anregung, damit ein Vergleich zweier EBD-Fassungen
genau zeigt, welcher Baum sich geändert hat. Dazu je Gruppe eine Sammelfassung, eine
Übersicht und die maschinenlesbare Gesamtfassung:

| Formatstand | Kapitel | mit Baum | Prüfschritte | Antwortcodes |
|---|---:|---:|---:|---:|
| 202604 | 357 (E 254, G 70, S 31, GS 2) | 241 | 1.940 | 1.622 |
| 202610 | 350 (E 253, G 64, S 31, GS 2) | 238 | 1.913 | 1.597 |

Im Generator selbst bleibt es bei einer gebündelten Datei — 700 Einzeldateien über
`file://` nachzuladen wäre spürbar langsamer.

### Nachweis

`scripts/pruefe_pid_konsistenz.js`: 0 Befunde. Übrige Testlage grün: UTILMD-Seiten
556/556, Engine 416/416, EBD-Abhängigkeiten (267 Antwortnachrichten, 88 Konstellationen
mit Filterwirkung), STS-Aufbau, Antwortcodes 12/12, Zeitscheiben 12/12,
Folgenachrichten 38/38, Version/Zuständigkeit 40/40, abhängige Segmente 4/4,
Muss-Validierung und harte Bedingungsprüfung OK, Bedingungs-Hilfe lückenlos
(1.514 Ausdrücke), domsim alle vier Ziele OK, Golden alle vier Ziele unverändert.

---

## 22. Vorgangsnummer: einheitlicher Namensaufbau (02.08.2026)

**Anlass.** Die Vorgangsnummer (SG4 IDE DE7402) sollte statt `TEST{` das Präfix
`EDIGEN{` tragen. Der Hinweis aus der Praxis: In UTILMD 55016 (Kündigung, Anfrage) stand
der Namensaufbau, in der Antwortnachricht 55017 dagegen „nur die neu erzeugte DAR".

**Befund.** Die Vorbelegung war an zwei Stellen unterschiedlich gebaut:

| Weg | vorher | Wirkung |
|---|---|---|
| kuratierte UTILMD-Maske (`_engine/generator.js`) | `"TEST{" + DAR` | Präfix vorhanden — auch in 55017 |
| zentrale Engine (`_engine/ahb-form-engine.js`) | `` `${DAR}${Position}` `` | ohne Präfix, z. B. `84415680000001` |

Die Engine trägt das Vollformular beider UTILMD-Sparten und die übrigen
Nachrichtentypen. Wer 55017 dort öffnete, sah genau das beschriebene Bild: die
Datenaustauschreferenz mit angehängter Positionsnummer, ohne erkennbaren Namensaufbau.
Ein dritter Weg lieferte den Platzhaltertext `VORGANG` (siehe 22.2).

**Umsetzung.** Beide Wege bilden die Nummer jetzt gleich:

```
EDIGEN{<Datenaustauschreferenz>          1. Vorgang
EDIGEN{<Datenaustauschreferenz>-02       2. Vorgang derselben Nachricht
```

Die Ergänzung ab dem zweiten Vorgang hält die Nummern innerhalb einer Nachricht
eindeutig (SG4 IDE ist wiederholbar). DE7402 ist `an..35`; der längste Wert misst
23 Zeichen. Definiert ist der Aufbau je einmal in `generator.js` und in
`ahb-form-engine.js` — beide Dateien werden nie gemeinsam geladen, deshalb keine
gemeinsame Konstante; `scripts/test_vorgangsnummer.js` vergleicht die beiden Stellen
im Quelltext und schlägt bei Auseinanderlaufen an.

### 22.1 Drei Prüf-IDs, die es im Formatstand 202604 nicht gibt

Der neue Test meldete drei Nachrichten mit der Vorgangsnummer `VORGANG`:
Strom **55693**/**55694** (Kapitel 9.2.3) und Gas **44183**. Die Ursache liegt tiefer als
die Vorbelegung — diese Prüf-IDs führt der AHB erst **ab Formatstand 202610**:

| Prüf-ID | AHB 202604 (`_form-meta.js`) | AHB 202610 | Auswahl der kuratierten Maske 202604 |
|---|---|---|---|
| 55693, 55694 | nicht enthalten | enthalten, mit Regeldatei | angeboten |
| 44183 | nicht enthalten | enthalten, mit Regeldatei | angeboten |

Die Optionen und die zugehörigen Einträge der Prozess-Meta stammten aus dem 202610-Stand
und sind im 202604 entfernt. Die Prozessketten und die Validator-Registry führten sie
bereits korrekt nur unter 202610.

### 22.2 Keine Nachrichten aus Platzhaltern

Ohne Regeldatei wies die Maske zwar im Formularbereich auf die Lücke hin, erzeugte auf
Knopfdruck aber trotzdem eine Nachricht — aus Platzhaltertexten:

```
UNB+UNOC:3+ABSENDER:500+EMPFANGER:500+…
BGM+E03+DOC-NUM'
IDE+24+VORGANG'
```

Eine solche Datei sieht wie eine Testnachricht aus, ist aber keine. `generateEdifact()`
bricht jetzt mit einem Hinweis ab, wenn die Prüf-ID in diesem Formatstand keine
Regeldatei hat. Der verbliebene Fallback für Prüf-IDs ohne eigenes IDE-Feld bildet die
Nummer nach demselben Namensaufbau statt als Platzhaltertext.

### Nachweis

`scripts/test_vorgangsnummer.js`: **1.140 Vorgangsnummern** über alle Generatorseiten
beider Formatstände (kuratierte Masken und Engine-Seiten) tragen den Namensaufbau;
Quelltextabgleich beider Definitionsstellen; drei Vorgänge in einer Nachricht ergeben
`EDIGEN{<DAR>`, `…-02`, `…-03`.

Golden-Snapshots aller vier Ziele **bewusst neu gesetzt** — die einzige Abweichung war
je Nachricht die IDE-Zeile (`IDE+24+TEST{<DAR>` → `IDE+24+EDIGEN{<DAR>`), geprüft über
einen Zeilenvergleich vor dem Einfrieren. Übrige Testlage unverändert grün:
UTILMD-Seiten **553/553** (drei Prüf-IDs weniger, siehe 22.1), Engine 416/416,
`pruefe_pid_konsistenz.js` 0 Befunde in 32 Zielen, domsim alle vier Ziele OK,
Selbstvalidierung mit denselben Zahlen wie zuvor (Strom 202604: 506, Gas 202610: 177 —
die bekannten Muss-Segmente optionaler Untergruppen), Antwortcodes 12/12,
Folgenachrichten 38/38, Zeitscheiben 12/12, Version/Zuständigkeit 40/40,
Antwortketten 31/35 (unverändert; die vier Hinweise betreffen bedingte Muss-Segmente).

---

## 23. Bildschirmaufteilung und Kalender (02.08.2026)

**Anlass.** Zwei Beobachtungen aus der Bedienung an einem 24-Zoll-Monitor:

1. Die Bildlaufleiste der Eingabemaske war länger als das Fenster — das untere Ende mit
   dem Pfeil für schrittweises Scrollen wurde erst sichtbar, nachdem man die *ganze Seite*
   nach unten gescrollt hatte.
2. Der Kalender der Datumsfelder klappte teils aus dem Bildschirm heraus.

### 23.1 Höhe der Eingabemaske

Die Spalten waren mit `max-height: 85vh` begrenzt. `vh` misst die **Fensterhöhe**, nicht den
*verbleibenden* Platz: Die Spalte beginnt erst unterhalb von Brotkrumenpfad, Titel,
Beschreibung und Umschaltern — bei 1440 px Fensterhöhe rund 310 px tiefer. 85 vh entsprachen
dort 1.224 px, die Spalte endete also bei 1.534 px und damit knapp 100 px unterhalb des
Fensters.

`_engine/layout.js` rechnet die Höhe stattdessen aus dem sichtbaren Bereich:

```
Höhe = Fensterhöhe − Oberkante der Spalte im Fenster − Fußabstand − Inhalt unterhalb der Spalten
```

Nachgeführt wird bei Größenänderung, beim Bildlauf (die Spalten kleben oben, der sichtbare
Bereich wächst) und bei jeder Formularänderung (`MutationObserver`). Zwei Feinheiten:

* **Boxmodell.** `max-height` begrenzt bei `content-box` nur den Inhalt; Innenabstand und
  Rahmen kamen obendrauf — genau um diesen Betrag ragte die Spalte weiter heraus. Das
  Skript zieht sie ab.
* **Untereinander gestapelt.** Im schmalen Fenster stehen die Spalten untereinander und die
  Seite ist der Scrollbereich; eine Höhenbegrenzung ergäbe zwei ineinander liegende
  Bildlaufleisten. Erkannt wird das an der Spaltenbreite (nicht an einem Haltepunkt), die
  Begrenzung wird dann ausdrücklich mit `none` aufgehoben.

### 23.2 Kalenderblatt

Bisher öffneten beide Wege — kuratierte Maske (`oeffneKalender`) und Engine
(`EdiKalender`) — über `showPicker()` den **nativen** Datums-Picker an einem unsichtbaren
Feld. Dessen Platzierung bestimmt der Browser; steht das Feld weit unten, klappt er nach
unten aus dem Fenster. Position und Größe sind nicht beeinflussbar — die Anforderung war
so nicht erfüllbar.

`_engine/kalender.js` bringt deshalb ein eigenes Kalenderblatt mit, das sich selbst setzt:

| Regel | Umsetzung |
|---|---|
| Grundposition | rechtsbündig zum Datums-Eingabefeld (Anker ist die ganze Zeile aus Textfeld und Kalenderknopf) |
| Feld in oberer Bildschirmhälfte | Blatt **unterhalb** der Eingabezeile |
| Feld in unterer Bildschirmhälfte | Blatt **oberhalb** der Eingabezeile |
| Platz reicht nicht | Ausweichen in die andere Richtung, danach Klemmen an den Fensterrand |

Das Blatt hängt an `<body>` und liegt `fixed` — läge es im Fluss, würde die scrollende
Eingabemaske (`overflow: auto`) es abschneiden. Es trägt Monats- bzw. Jahresnavigation, bei
Zeitfeldern eine Uhrzeit (`datetime-local`), eine Monatsauswahl für `MM.JJJJ`-Felder und die
Schaltflächen Heute / Leeren / Schließen; Escape und ein Klick daneben schließen es. Die
Farben stammen aus den CSS-Variablen der Seite, es folgt also der Hell-/Dunkel-Wahl, und es
bringt seine Regeln selbst mit — die kuratierten Masken laden `edigen.css` nicht.

Wichtig für die Wirkung: Beim Übernehmen wird ein `input`-Ereignis ausgelöst. Die Formulare
hängen ihre Neuberechnung an `oninput` des Textfeldes; ein reines Setzen von `.value` hätte
die Nachricht unverändert gelassen. Damit entfällt zugleich die zweite Kalender-Umsetzung:
`oeffneKalender` in `generator.js` reicht nur noch an das gemeinsame Blatt weiter (das
versteckte native Feld bleibt als Rückfallweg stehen).

### Nachweis

`scripts/test_layout_kalender.js`: **60 Höhenmessungen** über 20 Generatorseiten in drei
Fenstergrößen (1440×900, 1920×1080, 2560×1290) — die Eingabemaske endet überall im Fenster,
außer bei untereinander stehenden Spalten. **120 Kalenderöffnungen**, keine ragt aus dem
Fenster; geprüft ist auch die Klapprichtung je Bildschirmhälfte. Übrige Testlage unverändert:
UTILMD-Seiten 553/553, Engine 416/416, Vorgangsnummern 1.140, Golden alle vier Ziele
unverändert.

---

## 24. Nachricht als Übertragungsdatei speichern (02.08.2026)

**Anlass.** In den kuratierten UTILMD-Masken gibt es die Schaltfläche „Als marktkonforme
Datei (.txt) speichern". In den Antwort- und Folgeformularen fehlte sie — und damit in
allen übrigen Nachrichtentypen, denn die Antwortmasken sind Engine-Seiten. Verlangt ist
die Möglichkeit für **jede** erzeugte Nachricht, gleich welchen Typs, und zusätzlich im
Validator.

### 24.1 Die Namenskonvention

Maßgeblich sind die **Allgemeinen Festlegungen zu den EDIFACT- und XML-Nachrichten**,
Abschnitt 2.12 „Namenskonvention für Übertragungsdateien" — Fassung 6.1c für den
Formatstand 202604, 6.1d für 202610, beide wortgleich:

```
Nachrichtentyp_Anwendungsreferenz_von_an_yyyymmdd_DAR.txt
```

| Bestandteil | Quelle |
|---|---|
| Nachrichtentyp | EDIFACT-Name des Nachrichtentyps, **UNH DE0065** |
| Anwendungsreferenz | VL, TL, (EM) aus **UNB DE0026** |
| von | Absender-Kennung (MP-ID), **UNB DE0004** |
| an | Empfänger-Kennung (MP-ID), **UNB DE0010** |
| yyyymmdd | Datumsstempel bei Erzeugung der Datei, in **UTC** |
| DAR | Datenaustauschreferenz, **UNB DE0020** |

„Alle sechs Bestandteile sind MUSS-Angaben. Als Trennzeichen dient der Unterstrich."
Führt eine Nachricht keine Anwendungsreferenz — bei UTILMD der Regelfall —, bleibt der
Platz leer und es stehen zwei Unterstriche nebeneinander. Das Dokument zeigt genau das:

```
UTILMD__9900123400007_4012345393651_20070131_A177.txt
MSCONS_TL_9900123400007_4012345393651_20070131_B31.txt
```

**Umsetzung.** `_engine/nachricht-speichern.js` liest alle Angaben **aus der Nachricht
selbst**, nicht aus Formularfeldern. Das ist der Kniff, der die Funktion überall gültig
macht: für jeden Nachrichtentyp, für Antwort- und Folgenachrichten und für eine im
Validator eingelesene Datei. Die bisherige Umsetzung in `generator.js` hatte „UTILMD" fest
verdrahtet und Absender/Empfänger aus den Feldern `NAD_MS`/`NAD_MR` gezogen; sie reicht die
Aufgabe jetzt an das gemeinsame Modul weiter.

### 24.2 Zwei Feinheiten am Dateiinhalt

* **Keine Zeilenumbrüche.** Im Ausgabefeld stehen die Segmente untereinander (Schalter
  „Zeilenumbrüche im Editor"); in der Übertragungsdatei laufen sie durch. Bisher wurde
  dafür der Schalter kurz umgelegt und die Nachricht neu erzeugt — das Modul entfernt die
  Umbrüche stattdessen beim Schreiben.
* **Zeichensatz ISO 8859-1.** UNB DE0001 führt in der Marktkommunikation **UNOC**, also
  ISO 8859-1. Geschrieben wurde bisher UTF-8: Ein „ü" in einem Freitext (FTX) verließ das
  Werkzeug als zwei Bytes und käme beim Empfänger falsch an. Das Modul wandelt deshalb
  zeichenweise nach Latin-1. Typografische Zeichen, die eine Tastatur leicht einstreut
  (Gedankenstrich, typografische Anführungszeichen, Auslassungspunkte), werden vorher auf
  ihre ASCII-Entsprechung gebracht; alles darüber hinaus wird zu einem Bindestrich — **nie**
  zu „?", denn das ist in EDIFACT das Freistellungszeichen und würde die Nachricht
  verfälschen.

### 24.3 Anwendungsreferenz an falscher Stelle im UNB

Beim Lesen von DE0026 fiel auf: Die Engine setzte die Anwendungsreferenz an die **zehnte**
Stelle des UNB. Der Aufbau lautet

```
UNB + S001 + S002 + S003 + S004 + 0020 + S005 + 0026 + 0029 + 0031 + S008 + 0035
```

— DE0026 ist also das **siebte** Datenelement, unmittelbar hinter Referenz/Passwort. Der
Fehler war unsichtbar, weil kein AHB beider Formatstände das Element führt (Prüfung über
alle 36 Formular-Metas: null Vorkommen) und die Ausgabe bei leerem Wert zeichengleich
bleibt — die Golden-Snapshots ändern sich durch die Korrektur nicht. Mit der ersten
AHB-Fassung, die DE0026 füllt, wäre er durchgeschlagen, und zwar doppelt: in der Nachricht
und im Dateinamen.

### Nachweis

`scripts/test_nachricht_speichern.js`:

* Namensbildung gegen **beide Beispiele des Dokuments**, zeichengenau.
* Zeilenumbrüche entfernt, „ü" als `0xFC`, kein „?" als Ersatzzeichen.
* **42 gespeicherte Nachrichten**: alle 40 Generatorseiten beider Formatstände (kuratierte
  Masken, Vollformulare, Engine-Seiten, APERAK und CONTRL), der Validator und der volle Weg
  über eine Folgenachricht (55016 erzeugen → Antwortmaske 55017 öffnen → Antwort erzeugen →
  speichern). Geprüft werden Dateiname gegen die Konvention, Übereinstimmung des
  Nachrichtentyps im Namen mit dem UNH der Datei und der Inhalt ohne Zeilenumbrüche.

Übrige Testlage unverändert grün: UTILMD-Seiten 553/553, Engine 416/416,
Prüf-ID-Konsistenz 0 Befunde in 32 Zielen, Golden alle vier Ziele unverändert.

---

## 25. README: Abhängigkeit von der Zugänglichkeit der BDEW-Dokumente (02.08.2026)

### Befund

Der Lizenzabschnitt der README beschrieb zwar, dass die BDEW-Inhalte nicht unter der
MIT-Lizenz stehen und keine kostenpflichtigen Fassungen verwendet werden — nicht aber die
daraus folgende **strukturelle Abhängigkeit des Projekts**: Die gesamte Datenbasis
entsteht maschinell aus den frei zugänglichen Lesefassungen, in erster Linie den
DOCX-Dokumenten. Entfallen diese oder erscheinen künftige Fassungen nur noch als für die
Extraktion unzureichend auslesbare PDF, lässt sich die Datenbasis nicht mehr nachführen.

### Quellenlage

Auftrag des Auftraggebers vom 02.08.2026. Sachlage aus dem Projekt selbst: alle
Extraktionswerkzeuge (`werkzeuge/`) lesen DOCX (AHB, MIG, EBD) bzw. PDF nur dort, wo der
Inhalt tabellarisch einfach ist (Codelisten der Servicenachrichten, `ebd_pdf_leser.py`);
die Wissensdatenbank führt die Lesefassungen des MaKo-Portals.

### Umsetzung

Neuer Unterabschnitt **„Abhängigkeit von der Zugänglichkeit der BDEW-Dokumente"** im
Lizenzteil der README (zwischen „Inhalte des BDEW" und „Erzeugung mit KI-Unterstützung"):

1. Das freie Projekt steht und fällt mit den frei bereitgestellten, gut auswertbaren
   DOCX-Lesefassungen; im schlechtesten Fall (nur noch schlecht auslesbare PDF) bleibt der
   letzte erfolgreich extrahierte Stand der Endstand.
2. Die kostenpflichtigen XML-/JSON-Fassungen sind kein selbstverständlicher Ausweg: vor
   einer Nutzung wäre die Vereinbarkeit ihrer Erwerbs- und Nutzungsbedingungen mit der
   MIT-Lizenz zu prüfen (freie Nutzung, Änderung, Weiterverbreitung abgeleiteter Daten);
   andernfalls scheidet dieser Weg für die jetzige, offene Form des Projekts aus.

Änderungshistorie der README um den Eintrag vom 02.08.2026 ergänzt.

### Nachweis

Reine Dokumentationsänderung; Code und Datenbasis unberührt, Regression unverändert
(Stichprobe nach Einspielen der Wissensdatenbank: `pruefe_pid_konsistenz.js` 0 Befunde in
32 Zielen, `golden.js` 187 Prüf-IDs unverändert).

---

## 26. Prozessketten über Use-Case-Grenzen: Kündigung → Lieferbeginn → Folge-Use-Cases (02.08.2026)

### Befund

Der Geschäftsprozess des Lieferantenwechsels war in den Folgenachrichten nur in
Bruchstücken abgebildet:

1. Die Kette der **Bestätigung der Kündigung** (55017) endete bei der Kündigung selbst —
   der fachlich nächste Schritt, die **Anmeldung** beim Netzbetreiber (Lieferbeginn),
   wurde nicht angeboten. Beim Gas ebenso (44017 ohne 44001).
2. Die nachgelagerten Use-Cases des Lieferbeginns (Abrechnungsdaten
   Netznutzungs-/Bilanzkreisabrechnung, Stammdatenänderungen des NB) hingen allein an den
   **Startschritten** (55001/55077); die **Bestätigung der Anmeldung** (55002/55078) — laut
   GPKE der eigentliche Auslöser — hatte gar keine Kette, weil `baue_prozessketten.py`
   Reaktionszeilen der Anwendungsübersicht grundsätzlich überging. Beim Gas bestand das
   Problem nicht, weil die Anwendungsübersicht die Bestätigung 44002 als eigenen
   Prozessschritt (nicht als Reaktion) führt.

### Quellenlage

- **GPKE Teil 2, UC „Kündigung"** (Abschnitt 1.2.1), Weitere Anforderungen: „Im Sinne
  eines reibungslosen Wechselprozesses … empfiehlt es sich, den Use-Case ‚Kündigung‘
  generell einem Use-Case ‚Lieferbeginn‘ vorzuschalten." Der UC „Lieferbeginn" nennt als
  Auslöser u. a. den Lieferantenwechsel — dessen erster Schritt die (bestätigte)
  Kündigung ist.
- **GPKE Teil 2, UC „Lieferbeginn"** (Abschnitt 2.1.1), Nachbedingung **im Erfolgsfall**:
  „Der NB führt die Use-Cases ‚Abrechnungsdaten Netznutzungsabrechnung‘ und
  ‚Abrechnungsdaten Bilanzkreisabrechnung‘ aus. … Der NB führt den Use-Case
  ‚Stammdatenänderung‘ (hier: SD ‚Stammdatenänderung vom NB (verantwortlich) ausgehend‘)
  durch." Der Erfolgsfall ist die bestätigte Anmeldung — Anker ist also die Bestätigung,
  nicht die Ablehnung.
- **Anwendungsübersicht 3.3/4.0**, Blatt „Prüf-ID Prozessschritt": Strom führt
  55002/55078 als „Reaktion auf" 55001/55077; 55017/55018 sind eigene Schritt-2-Zeilen
  des Sequenzdiagramms „Kündigung". Gas führt 44002 als eigenen Schritt 5.

### Umsetzung

`werkzeuge/baue_prozessketten.py` (Repo-Kopie identisch nachgezogen):

1. **GPKE_FOLGEN mit Auslöser-Angabe** je Folge-Eintrag: `"start"` (bisheriges
   Verhalten — alle Startschritte des auslösenden Diagramms) und/oder `"bestaetigung"`
   (Zeilen, deren Beschreibung mit „Bestätigung" beginnt, auch wenn sie als Reaktion
   geführt sind).
2. Neuer Eintrag **„Kündigung" → „Lieferbeginn"** mit Auslöser `("bestaetigung",)`:
   nur die Bestätigung (55017/44017) bietet die Anmeldung an, nicht die Kündigung selbst
   und nicht die Ablehnung (55018/44018).
3. Die drei bestehenden Lieferbeginn-Folgen zusätzlich mit Auslöser „bestaetigung":
   **Reaktionszeilen** mit passendem Auslöser erhalten eine eigene, reine GPKE-Kette
   (55002/55078); die Sequenzschritte des eigenen Diagramms bleiben den Startzeilen
   vorbehalten.

Ergebnis in `_engine/daten/prozessketten.js` (je Formatstand 202604/202610):
zwei neue Ketten (55002, 55078, je 12 Folgenachrichten mit Verwendungszeitraum
Z49/Z53), 55017 um 55001/55077 erweitert (Übernahme DTM+93; die 55017 führt laut AHB
keine LOC — die Marktlokation kann aus ihr nicht übernommen werden), 44017 um 44001
(Übernahme DTM+93, LOC+172, QTY, RFF+Z01). Bestehende Ketten nur mit erweiterten
Belegtexten; Golden-Snapshots unverändert.

### Nachweis

`scripts/test_folgenachrichten.js`, von 38 auf **80 Prüfungen** erweitert (beide
Formatstände):

* **Kündigungsbrücke**: 55001 und 55077 werden aus der erzeugten 55017 angeboten, mit
  GPKE-Beleg; der LFN (Empfänger der 55017) wird Absender, der NB bleibt als Empfänger
  offen; DTM+93 wird übernommen. Negativ: keine Brücke aus 55016 und 55018. Gas: 44017
  bietet 44001 an.
* **Bestätigungs-Anker**: die im Test über die Antwortmaske erzeugte 55002 bietet
  55218, 55126, 55175, 55615–55618 und 55620 an; die 55218 läuft vom NB an den LFN,
  übernimmt Felder der Bestätigung und trägt den Verwendungszeitraum Z49 ab
  Lieferbeginn. Negativ: die Ablehnung 55003 löst keine Folge-Use-Cases aus.

Gesamte Regression grün: domsim alle vier Ziele, Golden 187/88/189/89 PIDs unverändert,
Prüf-ID-Konsistenz 0 Befunde in 32 Zielen, UTILMD-Seiten 553/553, Engine-Seiten 416/416,
Vorgangsnummern 1.140, Zeitscheiben 12/12, Antwortketten 31/35 (wie erwartet,
vorbestehend), Layout/Kalender und Nachricht speichern ohne Beanstandung,
Selbstvalidierung mit den bekannten Zahlen (Punkt D).

---

## 27. Umbau Produktivnachricht → Testnachricht (03.08.2026)

### Befund

Aus der Praxis: Vorhandene produktive Nachrichten sollen als Testnachrichten
weiterverwendet werden. Dafür fehlte ein Werkzeug, das eine Nachricht importiert, ihre
Segmente bearbeitbar macht und die für eine Testnachricht nötigen Kennzeichen und
Nummern setzt, ohne die fachlichen Inhalte anzutasten.

### Quellenlage

- **UNB DE0035** Testkennzeichen „1" — dieselbe Belegung, die die Engine beim Erzeugen
  jeder Testnachricht schreibt (`_engine/ahb-form-engine.js`, UNB-Aufbau).
- **Allgemeine Festlegungen 2.12** (Namenskonvention der Übertragungsdatei) über das
  bestehende `_engine/nachricht-speichern.js`.
- **Referenz- und Vorgangsnummernvergabe** wie in der Engine: 12-stellige Referenz
  (Millisekunden seit 01.01.2000 UTC) für UNB DE0020 / UNH / UNT DE0062 / BGM DE1004 /
  UNZ DE0020; Vorgangsnummer `EDIGEN{<DAR>` mit `-02` … je weiterem Vorgang
  (Protokoll Abschnitt 22).
- **Bedingung [131]** (UTILMD): Beginn der ersten Zeitscheibe höchstens der auf das
  Nachrichtendatum folgende Tag, 00:00 gesetzlicher deutscher Zeit — Grundlage für die
  Belegung „Verwendung der Daten ab = Ende des aktuellen Tagesdatums".

### Umsetzung

Neue Seite **`umbau.html`** (Projektwurzel, Einstieg auf der Startseite neben dem
Validator), Logik in **`_engine/umbau.js`** (unter Node testbar):

1. **Import** wie im Validator: Drag & Drop einer TXT-Datei oder Einfügen des Inhalts;
   Erkennung von Typ/Formatstand/Prüf-ID über `AhbValidator.erkenne` wird angezeigt,
   ist aber keine Voraussetzung — der Umbau arbeitet generisch auf der Segmentstruktur
   (Auftraggeber-Entscheidung: auch künftig wegfallende oder neue Prüf-IDs sollen das
   Werkzeug nicht ausbremsen).
2. **Segment-Editor**: je Segment der Nachricht eine Zeile, je Datenelement/Komponente
   ein Eingabefeld — zunächst **ohne Vorbelegung**. Feld-Titel nennen Datenelement
   (über den invertierten DECODER des Validators) und BDEW-Feldformat (mig-formate.js).
3. **Schaltfläche „Umbau zu Testnachricht"** überträgt die Werte der Nachricht in die
   Felder und ersetzt: UNB DE0035 = 1; UNB S004 = jetzt (UTC, JJMMTT:HHMM); DTM+137 =
   jetzt im Qualifier-Format (303 = UTC+00, 203/102 lokal); DAR/Nachrichten-/
   Dokumentennummer neu und konsistent (bei mehreren UNH je Datei fortlaufend);
   IDE DE7402 = `EDIGEN{<DAR>`(-02 …); erstes DTM+Z25 **je Vorgang** (SG6 gehört zum
   Vorgang) = Folgetag 00:00 deutscher Zeit; UNT-Segmentanzahl und UNZ-Nachrichtenzahl
   neu gezählt. Ersetzte Felder sind markiert (Titel nennt den Grund), ein Bericht
   listet jede Ersetzung; **alle Werte bleiben editierbar**, Änderungen fließen live in
   die Ausgabe.
4. **Speichern** über die bestehende Speichern-Funktion (Name nach Allg. Festlegungen
   2.12, ISO 8859-1, ohne Zeilenumbrüche).

### Nachweis

`scripts/test_umbau.js`, **29 Prüfungen**: Felder nach dem Einlesen leer; alle
Ersetzungen (Testkennzeichen, Zeitpunkte, Referenzen, Vorgangsnummern -01/-02, erste
Zeitscheibe je Vorgang, spätere Scheiben unangetastet); bewusst falsche UNT-Anzahl der
Produktivnachricht wird korrigiert; Editierbarkeit (geänderte MaLo erscheint in der
Ausgabe); Dateiname nach 2.12; Fremdtyp (DELFOR, Format 203) wird generisch umgebaut;
keine JS-Fehler. Gegenprobe: eine „produktiv gemachte" Golden-55016 wird nach dem Umbau
vom Validator als 55016/202604 erkannt und validiert **fehlerfrei**. Übrige Regression
unverändert grün (Golden 187/88/189/89, Konsistenz 0 Befunde in 32 Zielen, Engine
416/416, UTILMD 553/553, Folgenachrichten 80/80, Nachricht speichern 42).

---

## 28. Umbau-Werkzeug: Vorgangs-Markierung und Einzelvorgang-Ausgabe (03.08.2026)

### Befund

In der Praxis übermittelt eine UTILMD-Nachricht oft mehrere Vorgänge (SG4 IDE), auch zu
unterschiedlichen Prüf-IDs. Im Umbau-Werkzeug waren die Vorgangsgrenzen optisch nicht
erkennbar, und die Testnachricht ließ sich nur für den gesamten Inhalt erzeugen — nicht
für einen einzelnen ausgewählten Vorgang.

### Quellenlage

- **UTILMD MIG/AHB**: SG4 IDE+24 eröffnet den Vorgang; RFF+Z13 (DE1154) trägt den
  Prüfidentifikator je Vorgang; die SG6-Verwendungszeiträume gehören zum Vorgang.
- **UNT DE0074**: Anzahl der Segmente der Nachricht einschließlich UNH und UNT;
  **UNZ DE0036**: Anzahl der Nachrichten der Übertragungsdatei — beide müssen bei einer
  verkürzten Ausgabe neu gezählt werden.

### Umsetzung

`umbau.html` und `_engine/umbau.js`:

1. **Gelbe Hervorhebung**: Zeilen mit Vorgangs-Segment (IDE+24) erhalten einen gelben
   Hintergrund mit Markierungsrand, das Prüf-ID-Feld (RFF+Z13, DE1154) denselben gelben
   Grund (helles und dunkles Design über eigene `--mark-*`-Variablen).
2. **`EdiUmbau.vorgaenge(segmente)`**: ermittelt je Vorgang den Segmentbereich innerhalb
   seiner Nachricht, die laufende Nummer und die Prüf-ID (erstes RFF+Z13 im Vorgang).
3. **Einzelvorgang-Ausgabe**: Bei mehr als einem Vorgang trägt jede Vorgangszeile die
   Auswahl „nur diesen Vorgang" (mit Nachrichts-Nummer bei mehreren UNH und Prüf-ID);
   über dem Editor steht „alle Vorgänge" (Standard). **`EdiUmbau.filterVorgang`**
   erzeugt eine Kopie aus UNB, UNH, Kopfteil (bis zum ersten IDE), dem gewählten
   Vorgang, UNT und UNZ — mit neu gezähltem **UNT DE0074** und **UNZ DE0036** (nur die
   Nachricht des Vorgangs bleibt übrig). Die Umschaltung wirkt live auf die Ausgabe;
   die Feldwerte bleiben vollständig erhalten, „alle Vorgänge" stellt die volle
   Ausgabe wieder her. Ein Hinweis über der Ausgabe benennt den verkürzten Umfang.

### Nachweis

`scripts/test_umbau.js`, von 29 auf **41 Prüfungen** erweitert: beide IDE-Zeilen gelb,
beide Prüf-ID-Felder markiert, Auswahl mit „alle" + zwei Vorgängen samt Prüf-ID-Angabe;
Einzelvorgang-Ausgabe enthält Kopfteil und nur den gewählten Vorgang (Vorgang 1 samt
seiner MaLo nicht enthalten), UNT neu gezählt (8), UNZ = 1; Rückschalten stellt die
volle Ausgabe (UNT 17) wieder her; Fremdtyp ohne Vorgänge zeigt keine Auswahl. Übrige
Regression unverändert grün (Golden, Konsistenz 0 Befunde, Folgenachrichten 80/80).

---

## 29. Umbau-Werkzeug: Vorgangsauswahl per Checkbox (03.08.2026)

### Befund

Die in Abschnitt 28 eingeführte Auswahl „nur diesen Vorgang" war als Auswahlpunkt
(Radio) umgesetzt: Einmal getroffen, ließ sie sich nur auf einen anderen Vorgang
umlenken, nicht wieder aufheben — bei drei und mehr Vorgängen bleibt ein versehentlicher
Klick so nicht folgenlos rückgängig zu machen. Wunsch des Auftraggebers: je Vorgang ein
Feld mit vorbelegtem Haken, ab- und wieder anwählbar.

### Umsetzung

`umbau.html` und `_engine/umbau.js`:

1. Jede Vorgangszeile trägt statt des Auswahlpunkts eine **vorbelegte Checkbox**
   („Vorgang verwenden", mit Prüf-ID und bei mehreren UNH der Nachrichtennummer).
   Angehakte Vorgänge wandern in die Testnachricht, abgewählte nicht; jede Wahl ist
   jederzeit umkehrbar. Damit sind auch **Teilmengen** möglich (2 von 3 Vorgängen) —
   „alle Vorgänge" ist schlicht der Ausgangszustand mit allen Haken.
2. Zwei Knöpfe **„alle Haken setzen" / „alle Haken entfernen"** für Nachrichten mit
   vielen Vorgängen; sind alle Haken entfernt, erscheint ein Hinweis („Kein Vorgang
   angehakt …") statt einer leeren Nachrichtenhülle.
3. **`EdiUmbau.filterVorgaenge(segmente, auswahl)`** löst `filterVorgang` ab: je
   Nachricht Kopfteil + gewählte Vorgänge; Nachrichten, deren Vorgänge sämtlich
   abgewählt sind, entfallen ganz. Segmentzähler UNT (DE0074) je Nachricht und
   Nachrichtenzähler UNZ (DE0036) werden an den verkürzten Umfang angepasst.

### Nachweis

`scripts/test_umbau.js`, von 41 auf **43 Prüfungen** erweitert: beide Checkboxen
vorbelegt; Abwahl von Vorgang 1 liefert nur Vorgang 2 (Umfangshinweis „1 von 2
Vorgängen", UNT 8, UNZ 1); Wieder-Anhaken stellt die volle Ausgabe her; „alle Haken
entfernen" zeigt den Hinweis und keine Ausgabe, „alle Haken setzen" die volle Ausgabe
(UNT 17). Node-Gegenprobe der Teilmengen-Logik: aus drei Vorgängen in Nachricht 1 die
Vorgänge 1+3 gewählt, Vorgang 2 und die komplette Nachricht 2 entfallen (UNT 8, UNZ 1);
alle gewählt = voller Umfang (UNT 11, UNZ 2). Übrige Regression unverändert grün.

---

## 30. Umbau-Werkzeug: Bedienleiste über dem Segment-Editor (03.08.2026)

### Befund

Optikwunsch des Auftraggebers: Die Haken-Schalter sollen die gelbe Markierungsfarbe der
Vorgangszeilen tragen; „Umbau zu Testnachricht" und die Legende „beim Umbau ersetztes
Feld …" standen zu weit unten (nach dem Editor).

### Umsetzung

`umbau.html`: Gemeinsame Bedienleiste über dem Segment-Editor — „Umbau zu
Testnachricht", daneben „angehakte Vorgänge:" mit den Schaltern „alle Haken setzen" /
„alle Haken entfernen" in der gelben Markierungsfarbe (`--mark-*`, neue Klasse
`.go.mark`), daneben die Legende. Die Erfolgsmeldung („n Felder ersetzt") und die
Auflistung der Ersetzungen bleiben unterhalb des Editors.

### Nachweis

`scripts/test_umbau.js` unverändert 43/43; Sichtprüfung per Bildschirmfoto
(Bedienleiste, gelbe Schalter, Legende oben; Bericht unten).

---

## 31. Umbau-Werkzeug: Uhrzeit-Komponente des UNB als ersetzt markieren (03.08.2026)

### Befund

Nach dem Umbau war im UNB-Segment nur das Datum (S004, DE0017) als ersetztes Feld
markiert — die ebenfalls ersetzte Uhrzeit (DE0019) nicht. Ursache: `baueUm()` setzte
beide Komponenten, meldete aber nur die erste an den Ersetzungsbericht, der die
Feld-Markierung steuert.

### Umsetzung

`_engine/umbau.js`: Beide S004-Komponenten werden einzeln gemeldet — „UNB DE0017
(Datum)" und „UNB DE0019 (Uhrzeit)" —, damit Markierung und Auflistung vollständig sind.

### Nachweis

`scripts/test_umbau.js` um zwei Prüfungen erweitert (Datum f_0_3_0 UND Uhrzeit f_0_3_1
als ersetzt markiert), jetzt 45/45. Auslieferung folgt mit dem nächsten Paket
(Absprache: für diese Kleinigkeit kein eigenes ZIP).

---

## 32. Validator: Werte an nicht vorgesehenen Komponenten und Segmentzähler (03.08.2026)

### Befund

Eine im Validator geprüfte 55013 meldete neun fehlende Muss-Segmente (LOC+Z18/Z19/Z20,
RFF+TN, QTY, NAD+Z67–Z70) — der eigentliche Fehler steckte aber im Segment

    NAD+Z63++:LADEN !++Weg::3Lusan+Gera++07555+DE'

und blieb unerkannt, das Segment grün. Analyse: Durch ein überzähliges „:" steht der
Wert „LADEN !" in der **zweiten** Komponente von C058 (Element 3), während das dort
benutzte DE3124 („Zusatzinformation zur Identifizierung", MIG M an..35, erste
Komponente) leer bleibt. Der Validator liest je Datenelement nur die dekodierte
Position (DECODER) — ein Wert an einer nicht dekodierten Komponente war für alle
Prüfungen (MIG-Format, AHB-Codes, Muss) unsichtbar. Die neun Muss-Meldungen selbst
waren AHB-konform (Nachbau mit vollständigen Muss-Segmenten: keine Falschmeldungen;
die AHB-Prüfung je Prüf-ID arbeitet korrekt — 55013 führt SG5 Z18/Z16/Z20/Z19/Z17,
SG6 Z13/TN, SG8/9 SEQ/QTY, SG12 Z65–Z70/Z63 sämtlich als Muss).

### Umsetzung

1. **`_engine/ahb-validator.js` — neue Prüfung `pruefeKomponenten`** (läuft in
   `pruefeMig` für jedes Segment): Ist die **erste** Komponente eines Elements eine
   bekannte DE-Position und **leer**, während eine spätere, **nicht dekodierte**
   Komponente einen Wert trägt, wird gemeldet: Wert, Komponente, Element und das leere
   führende DE („Trennzeichen ':' zu viel?"). Bekannte spätere Positionen bleiben
   unberührt (CTA DE3412, NAD DE3055, STS-C556-Wiederholungen, RFF/DTM/QTY-Aufbau) —
   auf allen erzeugten Nachrichten entstehen null neue Meldungen (Selbstvalidierung
   unverändert 506/176/465/177).
2. **`validator.html` — Segmentzähler** vor jedem Segment der Ergebnisliste, gezählt
   wie die Fehlerreferenz der CONTRL (UCS DE0096): ab **UNH = 1** je Nachricht,
   UNA/UNB/UNZ ohne Nummer. So ist die Segmentposition aus einer negativen CONTRL
   unmittelbar auffindbar. Fehlerhafte Segmente waren und sind rot eingefärbt — durch
   die neue Prüfung jetzt auch der NAD+Z63-Fall (zuvor grün, weil unerkannt).

### Nachweis

Neu `scripts/test_validator_komponenten.js`, **9/9**: kaputtes NAD+Z63 rot mit
präziser Meldung (Wert, Komponente 2 von Element 3, DE3124); keine Fehlalarme bei
CTA+IC+:Name und NAD+MS+id::293; Zähler UNH=1, NAD+Z63=24, UNT=25, UNB/UNZ ohne
Nummer; Golden-55016 validiert weiterhin fehlerfrei. Gesamte Regression grün
(Golden 4/4 unverändert, Konsistenz 0 Befunde, Muss-Validierung OK, Antwortketten
31/35 wie erwartet, UTILMD 553/553, Engine 416/416, Folgenachrichten 80/80,
Umbau 45/45, Nachricht speichern 42).

---

## 33. Richtigstellung zu Abschnitt 32: DE3124-Wiederholungen im NAD (03.08.2026)

### Befund

Der Auftraggeber widersprach der Einordnung aus Abschnitt 32 („Trennzeichen ':' zu
viel — dort ist kein Datenelement vorgesehen") — zu Recht. Abgleich der drei Quellen:

- **Allg. Festlegungen Kap. 2.17** („Darstellung von Adressen"): In C058 kann DE3124
  („Zusätzliche Angaben zur Adresse / Objekt") bis zu **5-mal wiederholt** werden —
  die zweite Komponente ist also eine **vorgesehene Position**. **Kap. 6.10**: Die
  Information wird über die Wiederholungen fortgeschrieben, beginnend mit der ersten;
  im AHB ist die Mehrfach-Aufführung nicht erkennbar.
- **MIG UTILMD Strom** (Segmentlayout Marktlokationsanschrift DP/Z59/Z60/Z63):
  C058 = D; DE3124 **1. Wiederholung = M**, 2. Wiederholung = D; C080/DE3036
  „Nicht benutzt".
- **AHB 55013**: DE3124 als Kann-Feld, ohne Aussage zu Wiederholungen.

Der verbleibende formale Mangel in `NAD+Z63++:LADEN !++…` ist demnach **nicht** eine
falsche Position, sondern die **leere 1. Wiederholung** (im MIG Muss, sobald C058
genutzt wird) bei belegter 2. — Entscheidung des Auftraggebers nach Vorlage der
Quellen: als **Fehler (rot)** einstufen, mit quellenbelegter Begründung.

### Umsetzung

`_engine/ahb-validator.js`: Neue Tabelle `WIEDERHOLUNGS_DE` (C058/DE3124,
C080/DE3036, C059/DE3042, FTX-C108/DE4440 — aus AF Kap. 2.17/6.10).
`pruefeKomponenten` meldet in diesen Gruppen jetzt korrekt: „Wert steht in
Wiederholung k, Wiederholung 1 ist leer — laut MIG ist die 1. Wiederholung Muss,
sobald die Gruppe genutzt wird (AF Kap. 2.17, 6.10)." Für Positionen außerhalb
bekannter Wiederholungsgruppen bleibt eine vorsichtigere Meldung („im hinterlegten
MIG-Auszug kein benutztes Datenelement beschrieben — Aufbau prüfen").
**Lücken nach belegter 1. Wiederholung bleiben unbeanstandet** — bei der Straße
(C059) sind sie laut AF 2.17 der Normalfall (feste Bedeutungen: 1/2 Straßenname,
3 Hausnummer, 4 Ortsteil), `Weg::3Lusan` ist also zulässig.

### Nachweis

`scripts/test_validator_komponenten.js`, jetzt **10/10**: Meldungstext quellenbelegt
(DE3124, Wiederholung 2 belegt / 1 leer, AF 2.17/6.10), `Weg::3Lusan` ohne
Beanstandung (genau eine Meldung am NAD+Z63), Fehlalarm-Schutz und Segmentzähler
unverändert. Gesamte Regression grün, Selbstvalidierung unverändert
(506/176/465/177), Golden 4/4 unverändert.

---

## 34. Qualifierabhängige NAD-Aufbauprüfung für alle NAD-Varianten (03.08.2026)

### Befund

Folgeauftrag aus Abschnitt 33: Die Belegung der NAD-Datenelementgruppen hängt am
Qualifier DE3035 — bei der Marktlokationsanschrift (DP/Z59/Z60/Z63) ist C058 benutzt
(DE3124, 1. Wiederholung Muss) und C080 „Nicht benutzt", bei den Kunden-/Beteiligten-
Segmenten (Z09/Z65 …, EO/DDO/VY …) genau umgekehrt; NAD+MS/MR führen nur C082. Die
pauschale MIG-Feldliste (`mig-formate.js`, ein Status je Segment+DE) kann das nicht
abbilden — ein Name in der falschen Gruppe (etwa C082 statt C080) blieb unbeanstandet.

### Quellenlage

MIG-Segmentlayouts UTILMD Strom/Gas, beide Formatstände (Spiegel FV2604 bzw.
`fv2610-migs/`): je NAD-Block die Qualifier-Codes (DE3035, Spalte
Anwendung/Bemerkung) und die Datenelementgruppen in Elementreihenfolge mit
BDEW-Status je Wiederholung. Allg. Festlegungen Kap. 2.17/6.10 (Wiederholungen,
Fortschreibung ab der 1.).

### Umsetzung

1. **Neues Werkzeug `werkzeuge/lies_nad_aufbau.py`**: extrahiert die NAD-Blöcke aus
   den vier MIG-DOCX (Qualifier-Erkennung gegen das Code-Universum der
   AHB-Formular-Metas; Gruppenmitglieder-Regel für C082/C058/C080/C059/C819) →
   **`_engine/daten/nad-aufbau.js`** (Strom 44, Gas 14 Qualifier je Formatstand).
2. **`_engine/ahb-validator.js` — `pruefeNadAufbau`** (in `pruefeMig`, ersetzt für
   NAD die generische Komponentenprüfung): je belegtem Element wird geprüft, ob die
   Gruppe bei diesem Qualifier benutzt ist („Nicht benutzt" → Fehler), ob die Zahl
   der Komponenten die MIG-Wiederholungen übersteigt, ob eine „N"-Position belegt
   ist und ob die Muss-Erstwiederholung einen Wert trägt, sobald die Gruppe genutzt
   wird (Meldung nennt den belegten Wert und AF 2.17/6.10).
3. `validator.html` bindet `nad-aufbau.js` ein und reicht den Aufbau je
   Formatstand/Sparte in den Prüfkontext (auch bei der Zweitstand-Wahl).

### Nachweis

`scripts/test_validator_komponenten.js`, von 10 auf **20 Prüfungen** erweitert:
korrekt belegte Kunden-/Beteiligten-NADs (Z65–Z70, Name in C080 mit
3036-Wiederholung) bleiben fehlerfrei; beanstandet werden Name in C082 statt C080
(Z65), Name in C080 bei der Marktlokationsanschrift (Z63), Ortsangabe am NAD+MS und
eine sechste 3124-Wiederholung (max 5); dazu unverändert die Fälle aus Abschnitt
32/33 (leere Erstwiederholung, C059-Lücke, Segmentzähler, Golden-55016 fehlerfrei).
Gesamte Regression grün, Selbstvalidierung und Golden unverändert.

## 35. Git-Fundament: Phase 0 der Neustrukturierung (04.08.2026)

**Auftrag.** Umsetzung von Phase 0 des Neustrukturierungs-Plans
(`NEUSTRUKTURIERUNG_PLAN_20260804.md`): Versionierung des Ist-Stands, Regressionstreiber,
Portabilität — ausdrücklich ohne fachliche Änderungen an Engine oder Datenschicht.

**Umsetzung.**

1. **Git-Repository** im Projektstamm; Initial-Commit ist der unveränderte Stand
   aus `EdiGen_20260803_7_1.zip`, getaggt als `v0.9.0-beta`. Damit ist jede weitere
   Änderung als Diff nachvollziehbar; die ZIP-Übergabe zwischen Chats entfällt nach
   dem Push zu GitHub.
2. **`package.json` + `scripts/regression_alle.js`**: ein Aufruf fährt die vier
   Golden-Ziele (domsim/golden/selfvalidate) und alle Testskripte; `--schnell` lässt
   die Browser-Tests aus, `--golden-update` friert Snapshots gewollt neu ein.
   Selbstvalidierung bleibt informativ (dokumentierte Befunde, offener Punkt D) und
   bricht die Regression nicht. Playwright exakt auf 1.56.1 gepinnt (Chromium 1194).
3. **Portabilität**: 11 Testskripte und 5 Python-Skripte trugen absolute
   Container-Pfade (`/mnt/user-data/working/…`) aus einer früheren Sitzung — Ursache
   dafür, dass die Browser-Regression in jeder neuen Umgebung zunächst rot war. Jetzt
   überall `__dirname`-/`__file__`-relativ; der Arbeitsordner der Extraktionsskripte
   (Geschwisterordner `regelwerk/`, `mirror/` …) ist per `EDIGEN_ARBEITSORDNER`
   übersteuerbar (Standard: zwei Ebenen über dem Repo, wie in `werkzeuge/LIESMICH.md`).
4. **Befund `test_antwortketten` (31/35)**: Vier Quellnachricht-Läufe (QUOTES 15001)
   scheiterten am strikten Badge-Vergleich `=== 'fehlerfrei'`, obwohl der Validator
   korrekt das Warn-Badge „fehlerfrei · 2 bedingte Muss offen" zeigt (CAV, Bedingung
   [492] „MP-ID in NAD+MR aus Sparte Strom" — aus der Nachricht nicht maschinell
   entscheidbar, darum bewusst Hinweis statt Fehler). Grün-Kriterium des Tests jetzt:
   Badge beginnt mit `fehlerfrei`. Keine Änderung an der Prüflogik.
5. **README aufgeteilt**: Änderungshistorie nach `CHANGELOG.md` (README 752 → ~300
   Zeilen), Regressionsabschnitt auf die npm-Aufrufe umgestellt.

**Nachweis.** Volle Regression grün: domsim/golden/selfvalidate über alle vier Ziele,
`pruefe_pid_konsistenz` 0 Befunde in 32 Zielen, alle 19 Testskripte OK (darunter
Antwortketten 35/35). Golden-Snapshots unverändert — der Nachweis, dass Phase 0
keine fachliche Ausgabe verändert hat.

## 36. CI und automatische Releases: Phase 1 der Neustrukturierung (04.08.2026)

**Auftrag.** Umsetzung von Phase 1 des Umbauplans: Konventionen als ausführbare Checks,
CI auf GitHub Actions, Releases aus Git-Tags, Übergabe verschlanken, offene Punkte als
Issues vorbereiten. Keine fachlichen Änderungen an Engine oder Datenschicht.

**Umsetzung.**

1. **`scripts/pruefe_paket.js`** (auch `npm run paket`, Teil jeder Regression):
   sechs Check-Gruppen — keine versionierten BDEW-Dokumente (*.pdf/*.docx/*.xlsx),
   Bedingungs-Hilfe in jeder Seite, die `_bedingungen.js` lädt (Lehre aus dem
   Patch-Verlust vom 28.07.), Golden-Snapshots aller vier Ziele vorhanden und gefüllt
   (187/88/189/89 PIDs), keine absoluten Container-Pfade (Lehre aus Phase 0),
   Kernartefakte vorhanden, Playwright exakt gepinnt.
2. **`.github/workflows/ci.yml`**: Smoke-Regression (Node-Kern, < 1 Minute) bei jedem
   Push und PR; volle Regression inkl. Chromium auf `main`, per workflow_dispatch und
   wöchentlich montags. Node 22, `npx playwright install --with-deps chromium`.
3. **`.github/workflows/release.yml`**: Ein Tag `vX.Y.Z` löst aus — Wächter
   (Paket-Prüfung + Smoke), dann `git archive` mit Präfix `EdifactGenerator/` als
   `EdiGen_JJJJMMTT.zip` (Datum = Commit-Datum des Tags) und `gh release create` mit
   automatischen Notizen. Das ZIP enthält exakt die versionierten Dateien — BDEW-
   Dokumente können konstruktionsbedingt nicht enthalten sein.
4. **`docs/UEBERGABE.md`** von 243 auf ~120 Zeilen: Arbeitsstand-Dokument mit
   Git-Konventionen; die ZIP-Konventionen (Namensschema, Zeitstempel, README-Pflicht)
   sind als „erfüllt der Release-Workflow" dokumentiert. Die Detailhistorie der
   letzten Sitzung steht unverändert in den Abschnitten 22–34 dieses Protokolls.
5. **`docs/ISSUES_VORLAGEN.md`**: die offenen Punkte A–F plus Phase 2/3 als sieben
   fertige Issue-Texte (Titel + Beschreibung + Label-Vorschlag) zum Einfügen auf GitHub.

**Nachweis.** Volle Regression grün (32 Läufe inkl. Paket-Prüfung), Golden unverändert.
Workflow-YAML syntaktisch validiert; der erste echte CI-Lauf erfolgt mit dem Push
dieses Stands, das erste automatische Release mit dem nächsten Tag.

## 37. Phase 2.1: Erhebung und Entscheidungsliste der fachlichen Befunde (04.08.2026)

**Auftrag.** Einstieg in Phase 2 des Umbauplans: die fachlichen Befunde der
Selbstvalidierung aktuell erheben (die „114" aus Abschnitt 15 stammten vom 30.07. und
umfassten nur ein Ziel) und als Entscheidungsliste für die Durchsicht des Auftraggebers
aufbereiten. Noch keine Korrekturen — erst entscheiden, dann umbauen.

**Umsetzung.** `scripts/analyse_selbstvalidierung.js` erzeugt und validiert alle PIDs
der vier Golden-Ziele und klassifiziert die FEHLER-Befunde: „muss_fehlt" (1.100,
informativ, offener Punkt D) wird ausgeklammert; übrig bleiben 224 Befunde
(184 „nicht vorgesehen", 40 „Codewert außerhalb AHB-Liste"). Je Befund wurden die
erzeugten Segmentzeilen und die AHB-Meta-Instanzen (Abschnitt, Status-Ausdruck,
Qualifier-Codes) als Beleg erhoben. Ergebnis: 9 Muster —

| Muster | Befunde | Kurzbeschreibung |
|---|---|---|
| E1 | 32 | FTX+ABO statt AHB-Qualifier ACB (Antwort-PIDs, beide Sparten) |
| E2 | 30 | FTX erzeugt, obwohl der AHB keines führt |
| E3 | 114 | Objektdaten-Block SEQ/CCI/CAV pauschal, ohne AHB-Grundlage je PID |
| E4 | 13 | CAV DE7110: MP-ID-Wert vs. Codeliste Z39/Z40/Z41 — nur am Original entscheidbar |
| E5 | 15 | CCI DE7037: Folge-CCI vs. ZB3/ZA9 — nur am Original entscheidbar |
| E6 | 8 | NAD DE3055: Codevergabestelle 293 statt 9 (bzw. 9/332) |
| E7 | 4 | BGM-Vorbelegung falsch (55074: Z14, 44019: E06) |
| E8 | 6 | STS+7 erzeugt, obwohl der AHB keines führt |
| E9 | 2 | SEQ+ZD5 statt ZF3/ZG0 (55194) |

**Einordnung.** E1–E3 und E7–E9 (188 Befunde) sind dieselbe Fehlerklasse wie die
ZW4/ZW3/ZW5-Platzhalter vom 28.07.: die kuratierte Maske erzeugt generisch statt
AHB-getrieben. Sie werden nicht einzeln geflickt, sondern durch die Phase-2-Kopplung
der Maske an die Meta strukturell beseitigt. E4/E5 (28) brauchen den Blick ins
Original-AHB (Wissensdatenbank in der Umsetzungssitzung); E6 (8) ist eine
Vorbelegungsfrage.

**Nachweis/Artefakte.** `docs/ENTSCHEIDUNGSLISTE_PHASE2.md` (Muster, Belege,
Empfehlungen, Entscheidungsfelder), `docs/ENTSCHEIDUNGSLISTE_PHASE2.csv` (224
Einzelbefunde). Generator, Validator und Golden unverändert — reine Analyse.

## 38. Phase 2.2: Kopplung der Maske an die Meta — 224 Befunde behoben (04.08.2026)

**Auftrag.** Umsetzung der freigegebenen Entscheidungsliste (Abschnitt 37, alle
Empfehlungen bestätigt).

**Quellen-Prüfung E4/E5** — erstmals direkt gegen die Wissensdatenbank in Google
Drive (Ordner „Meine Ablage → EdifactGenerator"): Das Original-AHB S2.1
(`AHB_UTILMD_S2.1_20260629…_12271.docx`, 4,5 MB) wurde vollständig heruntergeladen
und mit python-docx aufgeschlossen. Ergebnis Segmentlayout SG10 CAV
„Messstellenbetreiber": **DE7111 = Z91, DE1131 = MP-ID (frei), DE7110 = Z39/Z40/Z41**
(grundzuständiger/wettbewerblicher/Auffang-MSB). Z39/Z40/Z41 kommen im gesamten AHB
nirgends anders als CAV-DE7110-Codes vor. Damit war die **Meta korrekt** und die
Maske falsch: Sie schrieb die MP-ID in die 4. Komponente (DE7110) statt in DE1131
und ließ die MSB-Art weg. E5 analog: Die Meta führt je PID genau die CCI-Instanzen
des AHB (55616 z. B. Spannungsebene, 55615 nur Zugeordnete Marktpartner) — die
weiteren CCI der Maske waren pauschal erzeugt.

**Umsetzung** (zentral in `_engine/generator.js`, wirksam für alle vier kuratierten
Masken beider Sparten und Stände):

1. Neue Kopplungshelfer `metaInstanzen`/`metaSegment`/`metaDeCodes`/`ahbFuehrt` —
   ohne geladene Meta greift keine Kopplung (unverändertes Verhalten als Rückfall).
2. **E1/E2**: FTX-Qualifier aus der Meta (ACB), Ablehnungs-FTX nur, wenn der AHB der
   Prüf-ID ein FTX führt.
3. **E3/E9**: Objektdaten-Block (SEQ/CCI/CAV) wird gegen die Meta gefiltert — nur
   AHB-geführte SEQ-Objektcodes (DE1229), CCI-Merkmale (DE7037) und CAV-Codes
   (DE7111) je Prüf-ID. (Hinweis: Die inhaltliche Neubelegung der 55194-Objektdaten
   mit SEQ+ZF3/ZG0 samt Merkmalen bleibt dem Feldauswahl-Umbau vorbehalten; bis
   dahin entsteht dort kein falscher Block mehr.)
4. **E4**: Zugeordnete-Marktpartner-CAV komponentenrichtig:
   `CAV+Z91:<MP-ID>::Z39` — erkannt daran, dass die Meta-Instanz DE1131 frei führt
   und DE7110 eine Codeliste hat; Vorgabe der Art = erster AHB-Code (Z39).
5. **E6**: MP-ID-Vorbelegung je Prüf-ID an die zulässige Codevergabestelle gekoppelt;
   erlaubt der AHB die Sparten-Vorgabe nicht (Modell 2: nur 9), wird eine gültige
   Beispiel-GLN vorbelegt (4012345000009/4012345000016) — UNB-Qualifier (14) zieht
   über `codevergabeStelle` konsistent mit.
6. **E7/E8**: BGM-Dokumentenname aus der Meta, wenn die Prozess-Meta-Vorgabe dort
   nicht zulässig ist (55074: Z14, 44019: E06); STS+7 nur, wenn der AHB der Prüf-ID
   es führt (DE9015-Code 7).

**Nachweis.** `analyse_selbstvalidierung.js`: **224 → 0** fachliche Befunde;
informative Muss-Befunde 1.100 → 982. Golden-Neubewertung als eigener Prüfblock:
149 geänderte Nachrichten, Diff-Signaturen vollständig den Mustern E1–E9 zugeordnet
(u. a. `FTX+ABO→FTX+ACB`, `CAV+Z91:::MP → CAV+Z91:MP::Z39`, `BGM+E03→Z14/E06`,
`NAD+MR 990…::293 → GLN::9` inkl. UNB 500→14, entfallene Blöcke mit angepasstem
UNT-Zähler); keine unerwartete Signatur. Snapshots neu eingefroren; volle
Regression grün (32 Läufe).

## 39. Phase 2 (Fortsetzung): Regel-Datenschicht statt 553 Einzeldateien (04.08.2026)

**Auftrag.** Zweite Hälfte von Phase 2 (Feldauswahl-Umbau), erster Block: Die
kuratierten Regel-Einzeldateien werden zur Datenschicht — ohne jede fachliche
Änderung, beweisbar über unveränderte Golden-Snapshots.

**Bestandsaufnahme der Nutzungswege.** Die `<PID>.js` wurden geladen von den vier
UTILMD-Seiten (187/88/189/89 Script-Tags), dem Test-Harness (readdir-Muster
`NNNNN.js` + `_pid-registry.js`) und `pruefe_pid_konsistenz.js` (require je Datei);
`generator.js` und `test_bedingung_hilfe.js` nutzen nur die Registry-Globale
`ahbRulesByPrufId`. Die Servicenachrichten-Masken sind nicht betroffen. Alle
Regeldateien sind reine Daten (kein `function`/`=>` im Bestand).

**Umsetzung.**

1. `scripts/baue_pid_regeln.js`: Migration je Ziel — alle Einzeldateien laden,
   JSON-Roundtrip-Garantie je Regel (bricht ab, wäre eine Regel kein reines Datum),
   Ausgabe `pruef-ids/_regeln.js` (definiert `ahbRulesByPrufId` direkt); mit
   `--loeschen` Entfernen der Einzeldateien und der `_pid-registry.js`.
2. Verbraucher umgestellt: vier `index.html` (Script-Tags 219/116/221/117 → 32/28),
   Harness (lädt `_regeln.js`, `pids` aus deren Schlüsseln),
   `pruefe_pid_konsistenz.js` (require der Datendatei).
3. 553 Einzeldateien + 4 Registries entfernt (557 Löschungen).
4. `pruefe_paket.js` robust gegen den Umbau-Zwischenzustand (überspringt getrackte,
   aber gelöschte Dateien).

**Meta-Abgleich** (Vorarbeit für den Engine-Schritt): 93–99 % der Regel-Felder sind
über Segment-Tag + Qualifier einer Instanz der Formular-Meta zuordenbar — Strom
2672/2866 (202604) bzw. 2702/2900 (202610), Gas 1043/1048 bzw. 1045/1050. Der
nicht adressierbare Rest sind v. a. Konventions-IDs (`IDE`, `RFF_VZ_QUALITAET`,
`STS_7_grund` …), die der Engine-Schritt gesondert behandelt.

**Nachweis.** Golden-Regression **ohne** Snapshot-Update über alle vier Ziele grün
(187/88/189/89 PIDs unverändert) — die Umstellung ist rein strukturell. Volle
Regression grün (32 Läufe).

**Verbleibt aus Phase 2:** `generator.js` durch die Engine-Sicht ersetzen (kuratierte
Maske rendert/erzeugt über `ahb-form-engine` auf Basis von `_regeln.js` + Meta),
inkl. inhaltlicher Neubelegung der 55194-Objektdaten (SEQ+ZF3/ZG0); danach Phase 3.

## 40. Phase 2 abgeschlossen: Engine-Schritt — generator.js durch die Engine-Sicht ersetzt (04.08.2026)

**Auftrag.** Letzter Schritt des Feldauswahl-Umbaus (Abschnitt 39, „Verbleibt aus
Phase 2"): Die vier kuratierten UTILMD-Masken erzeugen ihre Nachricht über die
zentrale Engine; `_engine/generator.js` entfällt. Eingeschlossen: die inhaltliche
Neubelegung der 55194-Objektdaten (SEQ+ZF3/ZG0).

**Bauweise.** Die Maske ist jetzt eine **Sicht auf die Engine**:

1. Neues Profil-Modul `_engine/utilmd-maske.js` (ersetzt generator.js in den vier
   `index.html`): rendert die kuratierten Felder in der Reihenfolge und mit den
   Beschriftungen der Feldauswahl-Datenschicht (`pruef-ids/_regeln.js`), ordnet
   jedes Feld über sein ID-Muster einer Instanz der Formular-Meta zu
   (`DTM_92` → DTM mit DE2005=92, `LOC_Z16` → LOC mit DE3227=Z16,
   `STS_7_grund/STS_7/STS_7_befristet` → die C556-Wiederholungen des STS+7 usw.)
   und meldet die Zuordnung der Engine (`AhbFormEngine.setzeSicht`: Alias-Tabelle
   Instanzfeld → DOM-Feld). Werte ohne sichtbares Feld (Transaktionsgrund ohne
   eigenes Auswahlfeld, Zeitraum-IDs [126], mehrcodige Qualifier, EBD-Nummer zur
   Antwort, Nutzdaten-Objektwerte) liefert die Sicht als **stille Vorbelegungen**
   (versteckte Felder mit Alias).
2. Die **Erzeugung läuft ausschließlich über `AhbFormEngine.generate`** — Instanz
   für Instanz aus der Meta, in AHB-Reihenfolge, mit denselben Emittern wie im
   Vollformular. Ein Formularweg, ein Erzeugungsweg.
3. Engine-Erweiterungen dafür: **Testmodus** (fehlende Muss-Eingaben ⇒ Hinweis
   „Segment fehlt in der Testnachricht" statt Abbruch; Muss-Referenzen erhalten
   wie bisher REF-\<Qualifier\>-Platzhalter), **MaKo-Terminumrechnung** (reines
   Datum = Tagesbeginn deutscher Zeit, Strom 00:00 / Gas 06:00, MESZ-Tabelle aus
   generator.js übernommen; DTM+137 = Datum + Uhrzeit der Erstellung),
   **CAV-C889 vollständig** (DE1131, z. B. `CAV+Z91:<MP-ID>::Z39`, Muster E4),
   konfigurierbare DOM-IDs, Unterdrückungsliste (Objektgruppen SG8–SG12 ohne
   Datengrundlage entstehen wie bisher nicht) und ein Einspeisepunkt für den
   Produktpaket-Block der 55001.
4. Prozesskopplungen der alten Maske blieben erhalten, jetzt engine-gestützt:
   Antwortcode-Auswahl je EBD samt Nachführung bei geändertem Geschäftsvorfall
   (Code und EBD-Nummer als Paar im Optionswert — derselbe Code kann in mehreren
   EBD vorkommen, Beispiel 55608 A01: E_0603, nicht E_0606), MP-ID-Vorbelegung
   samt E6-GLN-Regel, harte Fachregeln (93/471, [348], Pflicht bei erfüllter
   Bedingung), Zeitscheiben-Logik (2. Zeitraum nur bei bewusster Eingabe,
   Qualität-Fallback Z49↔Z53).
5. **55194 neu belegt** (als Daten in `_regeln.js`, beide Strom-Stände):
   `nutzdaten` mit SEQ+ZF3 (Daten der Messlokation: RFF+Z19, CCI+ZB3,
   CAV+Z91:\<MP-ID\>::Z39, CAV+ZF0:\<MP-ID\>) und SEQ+ZG0 (Smartmeter-Gateway:
   CCI+Z75, CAV+Z30 Gerätenummer); dazu SEQ+Z01-Marker der 55017/55109 als
   `nutzdaten`-Eintrag statt Code.
6. Test-Harness: DOM-Schein gibt für nicht gerenderte Felder jetzt `null`
   (Voraussetzung der Engine-Automatik) und übernimmt value/Select-Vorauswahl aus
   dem gerenderten HTML.

**Golden-Neubewertung** (eigener Prüfblock, Diff je Prüf-ID, alt gegen neu):
375 der 553 Nachrichten zeichengleich, 26 nur in der Segmentreihenfolge geändert
(jetzt AHB-Reihenfolge der Meta, z. B. 55223 mit den zwei SG4-Vorgängen IDE+Z01 /
IDE+24 laut AHB). Die 152 inhaltlichen Änderungen wurden vollständig sechs
Mustern zugeordnet:

- **V1 — neue AHB-geführte Muss-Segmente**, die die alte Maske nicht kannte:
  IDE+Z01 (Listen-/Clearing-Vorgänge), RFF+TN/Z50/Z51/Z20-Platzhalter, AGR+9,
  IMD++Z36 (Gas), FTX+ABO (Gas-Kündigungsgrund), SEQ+Z22-Objektgruppen der
  Konfigurationsanfragen (55071/55072). Informative Muss-Befunde der
  Selbstvalidierung sinken dadurch von 982 auf 848.
- **V2 — entfallene Pauschal-Platzhalter** für Referenzen, die der AHB nur
  bedingt fordert („Muss [x]"/Soll, z. B. RFF+Z14/MG/Z18/Z37/Z38/AVE): ohne
  auswertbare Bedingung und ohne Eingabe entsteht kein Segment mehr (vorher
  pauschal REF-…; in den GDA-Antworten Kap. 9.5 standen diese SG8-Referenzen
  zudem ohne ihre SEQ-Gruppe — strukturell nicht AHB-konform).
- **V3 — komponentenrichtige Werte nach Meta**: CAV-Werte im DE1131, wo der AHB
  sie führt (55688: `CAV+Z91:9911…` statt `CAV+Z91:::9911…`); RFF+Z49/STS+E01
  ohne erfundene Zeitraum-ID, wo der AHB kein DE1156/DE9012 führt (55691/55692).
- **V4 — einheitliche Platzhalter** REF-\<Qualifier\> (statt REF-VORGANG/REF+Zufall
  in den Gas-Antworten ohne eigenes TN-Feld).
- **V5 — 55194-Neubelegung** (siehe oben; die SG12-Messlokationsadresse NAD+Z64
  bleibt bewusst außen vor — Adress-Beispieldaten wären reine Erfindung).
- **V6 — AHB-Segmentreihenfolge** in allen geänderten Nachrichten.

Snapshots danach bewusst neu eingefroren (`npm run golden:update`).

**Nachweis.** Volle Regression grün (32 Läufe) einschließlich aller
Playwright-Tests (Seiten, Folgenachrichten, Antwortketten, EBD-Abhängigkeiten,
Zeitscheiben, Vorgangsnummer, Speichern); `pruefe_pid_konsistenz.js` prüft
weiter die Feldauswahl-Datenschicht gegen die Meta (0 Befunde) — aus dem
früheren Abgleich zweier Erzeugungswege ist der Meta-Vollständigkeits-Check der
Sicht geworden.

**Bekannte Grenze** (Folgearbeit, nicht Teil dieses Schritts): In den
GDA-Antworten (Kap. 9.5, z. B. 55035/55095) führt der AHB einzelne
SG8-RFF-Instanzen mit mehreren Qualifiern und viele Objektgruppen; die Sicht
emittiert je Instanz genau ein Segment und lässt Objektgruppen ohne
Datengrundlage weg. Der Weg zu vollständigen GDA-Testnachrichten ist die
inhaltliche Neubelegung über `nutzdaten`-Daten je Prüf-ID — exemplarisch mit
55194 begonnen.

## 41. Phase 3: Formatstand als Parameter — ein Seitenbaum statt zwei Kopien (04.08.2026)

**Auftrag.** Phase 3 des Umbauplans („Schritt 4" der projekteigenen Konsolidierung):
Je Nachrichtentyp genau eine Generatorseite; der Formatstand wird Parameter, die
Datenordner bleiben je Stand getrennt.

**Bauweise.**

1. Neues Modul `_engine/stand.js` (`EdiStand`): löst den Formatstand aus dem
   URL-Parameter `?stand=JJJJMM` auf; ohne Parameter gilt die
   Kalender-Zuständigkeit (202604 bis 30.09.2026, 202610 ab 01.10.2026 — ein
   künftiger Stand ist ein neuer Tabelleneintrag plus Datenordner). Die Seiten
   melden ihre Lage (`EdiStand.seite('Stammdaten/UTILTS')`) und laden ihre
   Datendateien über `EdiStand.lade('pruef-ids/…')` — synchron per
   document.write, in Ladereihenfolge, ohne Bauwerkzeug, file://-tauglich.
2. Die 40 Seitenkopien der beiden Standbäume sind zu 20 Seiten im standlosen
   Baum `<Thema>/<Typ>[/Sparte]/` zusammengeführt (maschinell aus den Paaren,
   Basis jeweils der 202610-Stand). Standabhängige Beschriftungen (AHB-Version,
   Gültigkeitszeitraum, Kapitelnummern) stehen als Textvarianten in der Seite
   (`<span class="nur-202604">…</span>` / `nur-202610`; ein von `stand.js`
   geschriebenes Style-Tag zeigt genau die aktive Variante) bzw. als
   `data-stand-…-label`-Attribute; der Seitentitel läuft über
   `EdiStand.beschrifte`. Die Prüf-ID-Auswahl der kuratierten UTILMD-Masken
   führt die Obermenge beider Stände; Prüf-IDs ohne Felddaten des aktiven Stands
   entfernt die Maske beim Start (55693/55694 und 44183 erscheinen nur im
   202610-Stand). Der APERAK-Inline-Generator erhielt eine fachliche
   Stand-Weiche (AHB 1.0 führt SG2 RFF+TN als Pflicht, AHB 1.1 nur SG5 RFF+TN).
3. Verweise nachgezogen: Startseite (MANIFEST-Links `…?stand=…`, Vorauswahl nach
   Kalender-Zuständigkeit), `validator-registry.js` samt Generator
   (`baue_validator_registry.py` — dabei den veralteten ORDERS-Eintrag
   `_orders-meta.js`/`ordersMeta` auf die tatsächliche `_form-meta.js`/`formMeta`
   berichtigt), Folgenachrichten/Antwortcode-Auswahl/Engine lesen den Stand
   jetzt aus `EdiStand` bzw. `formatConfig` statt aus dem Seitenpfad.
4. Alle Playwright-Tests auf die Parameter-URLs umgestellt. Falle dabei:
   `fs.existsSync(pfad?stand=…)` ist immer falsch — zwei Tests (Vorgangsnummer,
   Layout/Kalender) liefen dadurch zunächst still mit 0 Prüfungen und wurden auf
   getrennte Dateipfad-/URL-Behandlung umgebaut (wieder 1.164 geprüfte
   Vorgangsnummern bzw. 60 Layout-Messungen/120 Kalenderöffnungen).

**Nachweis.** Golden-Snapshots aller vier Ziele unverändert (die Erzeugung liest
dieselben Datenordner); volle Regression grün (32 Läufe); Stichprobe im Browser:
dieselbe Seite liefert mit `?stand=202604` S2.1/187 Prüf-IDs und mit
`?stand=202610` S2.2/189 Prüf-IDs, ohne JS-Fehler. Der Bestand sinkt von 43 auf
23 HTML-Seiten; ein künftiger Formatstand (202704 …) ist ein Datenordner, ein
Registry-Lauf und ein `STAENDE`-Eintrag — keine Baumkopie.

## 42. Phase 4: Datenpipeline und Quellen-Manifest (04.08.2026)

**Auftrag.** Phase 4 des Umbauplans: den Extraktions-Workflow formalisieren
(Pipeline mit erzwungener Reihenfolge, Zeitscheiben-Schutz) und die Quellenlage
der BDEW-Dokumente maschinenlesbar machen.

**Umsetzung.**

1. **Nachbearbeitungsskripte auf die Feldauswahl-Datenschicht umgestellt** (die
   offene Vorbedingung aus Abschnitt 39/LIESMICH): `ergaenze_zeitscheiben.py`,
   `aktualisiere_utilmd_regeln.py` und `ergaenze_bedingungstexte.py` lesen und
   schreiben jetzt `pruef-ids/_regeln.js` statt der entfallenen Einzeldateien
   `<PID>.js`. Gemeinsames Modul `werkzeuge/regeln_io.py`: Serialisierung über
   Node im Format des Migrators (JSON.stringify …, 1) — Roundtrip über alle vier
   Ziele byte-identisch (Selbsttest im Modul). `ergaenze_zeitscheiben.py`
   entfernt bestehende Zeitscheiben-Felder nie mehr ersatzlos: Ohne Codes aus
   der AHB-Datenbasis bleibt der Eintrag unverändert (der erste Umbauversuch
   hätte bei unvollständiger Datenbasis Felder gestrippt — vom eigenen Testlauf
   aufgedeckt und behoben). Funktionsnachweise ohne Originaldokumente:
   `aktualisiere_utilmd_regeln.py` läuft auf dem Repo-Bestand mit 0 Befunden
   (idempotent), `ergaenze_zeitscheiben.py` erzeugt aus nachgestellten
   AHB-Daten exakt die bestehenden Felder (0 Änderungen).
2. **`werkzeuge/pipeline.py`** (4.1/4.4): fährt die dokumentierte Reihenfolge am
   Stück (extrahiere_alle → baue_form_meta → teile_sts_positionen →
   saeubere_beschreibungen → aktualisiere_utilmd_regeln → ergaenze_zeitscheiben
   → repariere_bedingungen → ergaenze_bedingungstexte → korrigiere_prozess_meta
   → baue_prozessketten), danach Registry-Neubau und Regression (Smoke, auf
   Wunsch voll). Optionen: `--ab <Schritt>`, `--nur-pruefen`,
   `--volle-regression`, `--ohne-regression`; Arbeitsordner über
   `EDIGEN_ARBEITSORDNER` (Standard: zwei Ebenen über dem Repo), Layout-Prüfung
   mit klarer Abbruchmeldung. **Zeitscheiben-Schutz:** Vor dem Lauf wird je
   UTILMD-Ziel festgehalten, welche Prüf-IDs Verwendungszeitraum-Felder führen
   (heute 89/0/91/0); schrumpft die Menge, bricht die Pipeline mit Befund ab —
   die bekannte baue_form_meta-Falle ist damit maschinell abgesichert. Die
   EBD-Kette bleibt bewusst außerhalb (blockweise Läufe mit Zeitgrenze).
3. **`docs/QUELLEN_MANIFEST.json`** (4.2): 86 Dokumente der Wissensdatenbank
   (Bestand Google Drive, 02.08.2026) mit Name, Art, Typ, Version, Gültigkeit,
   Standdatum, BDEW-MAKO-fileId und Ablage — Spiegel FV2604 (53 AHB/MIG-DOCX),
   die elf FV2610-MIGs und das Regelwerk (EBD 4.2/4.3, Allgemeine Festlegungen
   6.1c/6.1d, Anwendungsübersicht 3.3/4.0, zehn Codelisten, GPKE-Festlegungen).
   Dazu die **Zuordnung** je Formatstand+Nachrichtentyp (36 Einträge):
   AHB-Version, UNH-Kennung, Prüf-ID-Zahl, Datenordner. Die 202610-AHBs liegen
   nicht im Spiegel (Reproduktionsweg Abschnitt 7) — im Manifest vermerkt.
4. Punkt 4.3 des Plans (Wissensdatenbank strikt außerhalb des Repos) war bereits
   umgesetzt (`.gitignore`, `scripts/pruefe_paket.js`) und ist jetzt im
   Manifest-Hinweis dokumentiert.

**Nachweis.** `pipeline.py --nur-pruefen` grün (Zeitscheiben-Bestand + Smoke);
Roundtrip-Selbsttest `regeln_io.py` identisch auf allen vier Zielen;
Idempotenz-Läufe der umgestellten Skripte ohne Repo-Änderung; volle Regression
grün (32 Läufe). Ein Extraktionslauf mit echten Dokumenten braucht weiterhin die
Wissensdatenbank im Arbeitsordner — der nächste Formatstand-Wechsel ist damit:
Dokumente einspielen, `pipeline.py`, Golden lesen/aktualisieren, Manifest
nachführen.

## 43. Phase 5, Punkt A vorbereitet: Referenz-Testsuite für echte Nachrichten (04.08.2026)

**Auftrag.** Einstieg in Phase 5 (fachliche Punkte). Punkt A (externe
Validierungs-Absicherung) ist der wirksamste Schritt, braucht aber Material vom
Auftraggeber — vorbereitet ist jetzt alles, was ohne dieses Material geht.

**Umsetzung.** Neue Referenz-Testsuite `scripts/referenz_validierung.js`
(`npm run referenz`): liest echte EDIFACT-Dateien aus dem lokalen Referenzordner
(`<Arbeitsordner>/referenznachrichten/`, übersteuerbar per `EDIGEN_REFERENZEN`),
erkennt je Datei Nachrichtentyp/Formatstand über die UNH-Kennung
(Validator-Registry) und die Prüf-ID über RFF+Z13, validiert mit dem zentralen
Validator gegen die eigene Prüfgrundlage und berichtet je Nachricht samt
Zusammenfassung. Optionale Erwartungsdateien (`<datei>.erwartung.json`:
pruefi/fehlerfrei) machen bewertete Nachrichten zur dauerhaften Testsuite;
`--streng` liefert Exit 1 für lokale Gates. Der Test-Harness dient dabei als
reiner Validator-Lader für ALLE Nachrichtentypen (pids-Ermittlung verkraftet
jetzt Ziele ohne `_regeln.js`). Vertraulichkeit: Nachrichten bleiben strikt
lokal — `.gitignore` blockt `referenznachrichten/` und `referenz/`; fehlt der
Ordner, endet die Suite grün (CI unabhängig). Beschaffungs-Checkliste und
Arbeitsweise mit Befunden: `docs/REFERENZNACHRICHTEN.md` — gebraucht werden
echte Marktnachrichten (bevorzugt UTILMD, Breite vor Tiefe, eine je
Prozess/Prüf-ID) oder ersatzweise ein Fremdvalidator als Gegenprobe.

**Nachweis.** Probelauf mit nachgestellten Nachrichten: Erkennung (auch ohne
Zeilenumbrüche), Validierung (bekannter informativer Muss-Befund der 55001
korrekt gemeldet), Erwartungsabgleich und Nicht-EDIFACT-Abweisung wie erwartet;
ohne Referenzordner grüner Überspringen-Pfad. Volle Regression grün.

## 44. Maske: Prüf-ID-Suchfeld und umschaltbare Sortierung der Auswahlliste (04.08.2026)

**Auftrag.** Bedienkomfort der kuratierten UTILMD-Masken: die Liste „Anwendungsfall /
Prüfidentifikator" wahlweise nach Prüf-IDs sortieren und ein Eingabe-/Suchfeld für
die Prüf-ID der zu generierenden Nachricht.

**Umsetzung** (zentral in `_engine/utilmd-maske.js` — wirkt auf Strom und Gas in
beiden Formatständen, ohne Änderung der Seiten): Beim Start sammelt die Maske die
(stand-gefilterte) Auswahlliste samt Kapitelgruppen ein und setzt darüber eine
Werkzeugleiste. Das **Suchfeld** filtert live nach Prüf-ID-Anfang oder Stichwort
(Bezeichnung/Kapitel); der erste Treffer wird sofort ausgewählt und gerendert —
die exakte Prüf-ID eintippen genügt damit, um die Nachricht zu erzeugen. Ohne
Treffer zeigt die Liste einen Hinweis, das Formular bleibt stehen. Der
**Sortier-Umschalter** wechselt zwischen der Kapitel-Gruppierung des AHB und der
flachen, numerisch aufsteigenden Prüf-ID-Liste (mit Kapitelnummer in Klammern);
Auswahl und Filter bleiben beim Umschalten erhalten. Nebenbefund behoben: Die
standabhängigen Kapitel-Labels der optgroups (`data-stand-…-label`, Phase 3)
wurden auf den UTILMD-Seiten nie angewandt — die Maske ruft die Beschriftung
jetzt beim Start auf (202604 zeigt wieder Kapitel 9.2.1 statt 9.2.2).

**Nachweis.** Browsertest 202604/Strom: Umschalten 61 Kapitelgruppen ↔ 187 PIDs
aufsteigend; Suche „55194" → 1 Treffer, sofort erzeugt (RFF+Z13:55194); Stichwort
„kündigung" → 9 Treffer; kein Treffer → Hinweis, Formular unverändert; Filter
leeren → vollständige Liste. Keine JS-Fehler; volle Regression grün (32 Läufe).

## 45. Maske: optische Feldprüfung, MP-IDs ohne Vorbelegung, Speicherfreigabe (04.08.2026)

**Auftrag.** Eingabefelder der kuratierten UTILMD-Masken farblich prüfen (grün =
korrekt befüllt, rot = leer bei Pflicht oder Formatverstoß), NAD+MS/NAD+MR nicht
mehr mit Beispiel-MP-IDs vorbelegen (Test-Empfangssysteme prüfen auf angelegte
Marktpartnercodes; unbekannte Absender enden als negative CONTRL, Code 23, im
Dateneingang), Vorschau weiterhin immer sichtbar, Speichern erst freigeben, wenn
alle Muss-Angaben (ohne Abhängigkeit oder mit erfüllter Bedingung) korrekt sind.

**Umsetzung** (zentral in `_engine/utilmd-maske.js`):

1. **Ampel je Feld** nach jeder Eingabe: grün bei befülltem, formatgültigem Wert;
   rot bei leerer Pflichtangabe (Muss, oder Muss-bedingt mit erfüllter
   Abhängigkeit) oder Formatverstoß — mit Klartext am Feld (title). Geprüft wird
   gegen die MIG-Feldformate (`mig-formate.js`: Zeichenart, exakte/maximale
   Länge) plus Spezialformate: MP-ID 13-stellig numerisch, Marktlokations-ID
   11-stellig numerisch, Datum TT.MM.JJJJ mit Plausibilität. Optionale leere
   Felder bleiben neutral; die Vorbelegungen (BGM, IDE, DTM+137, STS-Auswahlen)
   stehen damit von Beginn an grün.
2. **MP-IDs sind Nutzereingabe**: keine Vorbelegung mehr; der Platzhalter nennt
   Rolle, Format und die sparten-/AHB-gerechte Beispiel-ID (E6-Logik) nur noch
   als Hinweis. Engine-Anpassung: Im Testmodus verhindert eine fehlende MP-ID
   die VORSCHAU nicht mehr (weiche Meldung; UNB/NAD zeigen die leeren Stellen).
3. **Speicherfreigabe**: „Als marktkonforme Datei speichern" ist deaktiviert
   (samt Begründung), solange rote Felder oder harte Fachregel-Fehler vorliegen;
   Folgenachrichten werden bei unvollständiger Quellnachricht nicht angeboten.
   Fehlende Pflichtangaben und Formatverstöße stehen gesammelt über der Vorschau.
4. Test-Harness und drei Browser-Tests setzen die Beispiel-MP-IDs jetzt aktiv
   (`EdiUtilmdMaske.mpVorschlaege()` bzw. Befüll-Heuristik) — die
   Golden-Snapshots bleiben dadurch unverändert.

**Nachweis.** Browsertest 55001/202604: MP-Felder leer → rot mit Platzhalter,
Vorschau vorhanden, Speichern gesperrt, Sammelmeldung; BGM/IDE grün; „31.13.2026"
→ rot „kein gültiges Datum"; MaLo „123" → rot „11-stellig numerisch"; nach
vollständiger Eingabe alle Felder grün und Speichern frei. Golden unverändert,
volle Regression grün (32 Läufe).

## 46. Versionsanzeige auf allen Seiten, Version 0.10.0-beta (04.08.2026)

**Auftrag.** Die Versionsnummer sichtbar machen — Entscheidung: auf ALLEN Seiten
(nicht nur der Startseite), weil Nutzer über direkte Links auf den
Generatorseiten landen und Rückfragen („mit welcher Version erzeugt?") sonst ins
Leere laufen.

**Umsetzung.** Neue zentrale Datei `_engine/version.js` (EINE Pflegestelle):
definiert `EDIGEN_VERSION` und blendet auf jeder Seite unten rechts ein dezentes
Badge ein — Version plus, wo das Formatstand-Modul geladen ist, der aktive
Stand („EdifactGenerator v0.10.0-beta · Formatstand 202604"). Eingebunden in
alle 23 Seiten (Startseite, Validator, Umbau, alle Generatorseiten) neben
theme.js. `scripts/pruefe_paket.js` wacht darüber, dass version.js und
package.json dieselbe Nummer führen. Version im Zuge dessen von 0.9.0-beta auf
**0.10.0-beta** angehoben (der Sprung fasst die heutige Serie zusammen:
Phasen 2–4 des Umbauplans, Phase-5-Einstieg, Suchfeld/Sortierung, Feld-Ampel
mit Speicherfreigabe). Der erste Release-Tag (`v0.10.0-beta`) ist Sache des
Auftraggebers — der Release-Workflow baut daraus das ZIP.

**Nachweis.** Badge auf Startseite/Maske/Validator korrekt (mit bzw. ohne
Formatstand), keine JS-Fehler; Paketprüfung mit neuem Versions-Check grün;
volle Regression grün (32 Läufe).

## 47. MaKo-Plattform angebunden: Dokument-Frühwarnung und Q&A-Quelle (05.08.2026)

**Auftrag.** Zugriffsprüfung auf bdew-mako.de ergab: Die Seiten (questions,
marketProcess) sind eine reine JavaScript-Anwendung, aber die dahinterliegende
API ist offen erreichbar. Umgesetzt wurden beide daraus abgeleiteten Ideen.

**Umsetzung.**

1. **`werkzeuge/mako_plattform.py`** (lokal, wie die übrigen Werkzeuge):
   `--dokumente` gleicht `docs/QUELLEN_MANIFEST.json` gegen `/api/documents` ab
   und meldet Fassungen oberhalb des Manifest-Bestands (Frühwarnung nächster
   Formatstand); `--fragen [--suche X]` sammelt die veröffentlichten Q&A des
   BDEW-Forums Datenformate als Tabelle. DevExtreme-Pagination (skip/take,
   sort nach fileId) im Werkzeug hinterlegt; Downloads bleiben bewusst der
   Hand-Weg (`/api/downloadFile/<fileId>`).
2. **Erstlauf** (Ergebnis in `docs/MAKO_ABGLEICH_20260805.md`): Manifest für
   202604/202610 aktuell; 15 Fassungen oberhalb — 12 Konsultationsfassungen
   des KÜNFTIGEN Formatstands (u. a. UTILMD Strom S2.3/AHB 2.3, Frist
   31.08.2026) und die drei UTILMD-Strom-Dateivarianten 12279/12280/12281,
   darunter die im Spiegel fehlenden 202610-AHB/MIG-Dateien. Q&A: ~85 Tickets
   gesichtet, elf unmittelbar projektrelevante Klarstellungen dokumentiert —
   darunter PRI-n..15-Längenzählung ohne Dezimaltrennzeichen, QTY-Nachkomma-
   stellen, die UTILMD-Pflicht der SG „Daten der Marktlokation" bei
   Keine-Daten-Zeiträumen (2025-00494, prüfrelevant für Validator/Punkt D),
   APERAK-Bündelung (Punkt B) und E_0406-Schritt-82/A90 (Punkt E); die
   DTM-303-Tickets bestätigen unsere MaKo-Zeitdarstellung.

**Nachweis.** API-Erkundung und Erstlauf über WebFetch (Chat-Konvention);
Werkzeug syntaxgeprüft — der erste lokale Lauf beim Auftraggeber validiert
Pagination und Ausgabe. Kein Eingriff in Prüfgrundlagen; die elf
Klarstellungen sind Arbeitsvorrat für die Punkte B/D/E und den Validator.

## 48. Umbau: Dokument- und Vorgangsauswahl für alle aggregierenden Nachrichtentypen (05.08.2026)

**Auftrag.** Die Anhak-Auswahl einzelner Vorgänge, die der Umbau bisher nur für
UTILMD (IDE+24) bot, soll überall dort verfügbar sein, wo eine Übertragungsdatei
mehrere fachliche Einheiten aggregiert — z. B. INVOIC-Sammelrechnungen (mehrere
UNH/UNT je UNB, Rechnungsnummer im BGM) oder MSCONS mit mehreren Lieferstellen.
Dazu war je Nachrichtentyp zu klären, welches Segment ein neues Teil-Dokument
eröffnet.

**Analyse — zwei Aggregationsebenen.** MaKo-Dateien aggregieren auf zwei Ebenen,
und beide brauchen eine eigene Auswahl:

1. **Mehrere Nachrichten je Übertragungsdatei** (mehrere UNH…UNT je UNB): der
   Normalfall der INVOIC-Sammelrechnung, syntaktisch aber bei jedem Typ möglich.
   Kennzeichen des Teil-Dokuments ist die Dokumentennummer im BGM (DE1004) —
   bei INVOIC die Rechnungsnummer.
2. **Mehrere Einheiten je Nachricht** (wiederholte Segmentgruppen unterhalb
   eines UNH). Der eröffnende Trigger je Typ (aus den MIG-/AHB-Strukturen der
   Meta-Dateien abgeleitet, Tabelle `VORGANG_TRIGGER` in `_engine/umbau.js`):
   UTILMD `IDE+24` (wie bisher; IDE+Z01-Übersichten lösen nicht aus), UTILTS
   `IDE`, ORDERS/ORDRSP/ORDCHG/QUOTES/REQOTE `LIN` (SG29-Vorgang), MSCONS `NAD`
   **nur im Positionsteil nach UNS** (SG5-Lieferstelle — die Kopf-NAD MS/MR
   zählen nicht), IFTSTA `CNI`/`EQD`, REMADV `DOC` (avisierte Rechnung,
   Nummer im DOC C503) und PRICAT `PGI` (Preisgruppe).
   **INVOIC erhält bewusst KEINEN inneren Trigger:** Rechnungspositionen (LIN)
   sind kein eigenständiges Dokument — eine Teilauswahl bräche die MOA-/TAX-
   Summen der Rechnung. Sammelrechnungen laufen über Ebene 1.

**Umsetzung.**

1. **`_engine/umbau.js`**: `vorgaenge()` generalisiert (Trigger je UNH-Typ aus
   `VORGANG_TRIGGER`, UNS-Grenze, Kennwert je Einheit — bei DOC die
   Rechnungsnummer); neu `nachrichten()` (UNH-Bereiche mit Typ, Referenz und
   BGM-Dokumentennummer); `filterVorgaenge(segmente, auswahl,
   gewaehlteNachrichten)` um die Nachrichtenauswahl erweitert. Je Nachricht
   bleiben Kopfteil (bis zum ersten Trigger) und **Schlussteil** (ab Ende des
   letzten Vorgangsbereichs — UNS+S/Summensegmente bei ORDERS/REMADV) erhalten;
   Nachrichten ohne Vorgangsbegriff werden als Ganzes über- oder abgewählt.
   UNT (DE0074) und UNZ (DE0036) zählen wie bisher neu.
2. **`umbau.html`**: Checkbox je Einheit an jeder Trigger-Zeile (Beschriftung
   nach Einheit: „Vorgang", „Rechnung RE-…", „Lieferstelle", „Preisgruppe";
   Prüf-ID, sofern im Bereich) und — bei Sammel-Dateien — Checkbox je
   NACHRICHT an der UNH-Zeile („Nachricht 2 verwenden (INVOIC — Dokument
   RE-1002)", mit der ursprünglichen Rechnungsnummer als Wiedererkennung).
   Umfangstext nennt beide Teilauswahlen; bei Typen mit Summensegmenten
   (MSCONS/REMADV/PRICAT) warnt ein Hinweis, dass MOA/CNT-Summen bei
   Teilauswahl nicht neu berechnet werden. Ohne jeden Haken entsteht wie
   bisher keine leere Hülle, sondern ein Hinweis.

**Nachweis.** Einheitentest (Node, synthetische Fixtures INVOIC-Sammel 3×UNH,
REMADV 3×DOC mit Summen-MOA, MSCONS 2 Lieferstellen mit Kopf-NAD-Abgrenzung,
UTILMD-Rückwärtskompatibilität samt Alt-Signatur) vollständig grün;
`scripts/test_umbau.js` um Sammel-INVOIC- und REMADV-Fälle erweitert
(45 → 56 Prüfungen, u. a. UNZ-Neuzählung nach Nachrichten-Abwahl und
Summenteil-Erhalt) — 56/56. Regression komplett grün (32 Läufe).

## 49. Referenz-Testsuite: Einheiten-Zerlegung und erste Auswertung an echten Nachrichten (11.08.2026)

**Auftrag.** Der Auftraggeber hat 18 anonymisierte, im Markt gelaufene
Übertragungsdateien bereitgestellt (Lieferantensicht, Strom/Gas, Formatstand
202604): UTILMD, MSCONS, APERAK, CONTRL. Damit wird die Referenz-Testsuite
(offener Punkt A) erstmals an echtem Material betrieben.

**Befund beim Erstlauf — Sammel-/Mehr-Vorgang-Dateien.** Die Suite validierte
bis dahin den gesamten Dateitext gegen die ERSTE Prüf-ID. Echte Dateien
aggregieren aber auf zwei Ebenen: mehrere Nachrichten je UNB (eine MSCONS-Datei
enthielt 1143 Nachrichten, eine APERAK-Datei 224) und mehrere Vorgänge mit je
eigener Prüf-ID je UTILMD-Nachricht. Ohne Zerlegung entstanden Scheinbefunde
(2286 „fehlende Muss-Segmente" allein aus der 1143er-Datei; fremde Segmente
eines zweiten Vorgangs als „nicht vorgesehen").

**Umsetzung (Suite).** `scripts/referenz_validierung.js` zerlegt jede Datei nun
mit derselben Engine-Mechanik wie das Umbau-Werkzeug (`EdiUmbau.zerlege`,
`nachrichten`, `vorgaenge`, `filterVorgaenge`, `serialisiere`) in einzeln
prüfbare Einheiten: je Nachricht (UNH…UNT, in eine Mini-Übertragung mit
korrekter Interchange-Referenz im UNZ verpackt) und bei mehreren Prüf-IDs je
Vorgang. Befunde werden je Datei gebündelt (gleiche Meldung mit Häufigkeit, statt
1143 Einzelzeilen). Ergebnis: 18/18 Dateien erkannt, 1384 Einheiten, 230
fehlerfrei; die beiden Sammeldateien lösen sich sauber auf (APERAK 224/224
fehlerfrei). Eine beim Umbau der Suite selbst eingebaute Fehlerquelle (UNZ trug
zunächst die Nachrichten- statt der Interchange-Referenz) wurde vor dem Abschluss
erkannt und behoben.

**Auswertung (fachlich).** Die Rest-Befunde gehen sämtlich auf drei
Validator-Präzisierungen zurück — keine Extraktionslücke, kein echter
Nachrichtenfehler. Details in `docs/REFERENZ_BEFUNDE_20260811.md`:

1. **Segment-Muss ohne Segmentgruppen-Begrenzung.** Trägt ein Segment
   `expr = "Muss"`, hängt die Einschränkung aber an der Segmentgruppe
   (`sgExpr`, z. B. `Soll […]` oder `Muss [Bedingung]`), stuft der Validator es
   sofort als hartes Muss ein und wertet die Gruppenbedingung nicht mehr aus.
   Belegt an LOC+Z21 (55036/55037, Entweder-oder mit LOC+Z16), RFF
   Verwendungszeitraum (55220, nur bei Datenclearing), MSCONS RFF+AGI/AGK/Z30
   (13019/13002/13017) u. a. Höchster Hebel; Korrektur bewegt Golden.
2. **DTM-Formatcodes 104/304 zu eng.** 304 ohne Sekunden (`\d{12}\+00` statt
   `\d{14}\+00`, Wert `20260810113506+00`), 104 mit Bindestrich statt zwei
   MMDD-Grenzen (`02010204`). Klar umrissene Korrektur.
3. **CAV-Aufbau-Hinweis** (55653, Einzelfall) — MIG-Auszug prüfen.

**Nachweis.** Referenzlauf lokal grün erkannt (18/18); Regression unverändert
grün (32 Läufe; die Suite selbst läuft nur lokal mit Referenzordner). Die drei
Validator-Korrekturen sind der nächste Arbeitsschritt (eigene Auslieferung mit
Golden-Diff-Sichtung), NICHT Teil dieses Commits — hier wird nur die Suite
ertüchtigt und der Befund dokumentiert. Nachrichten bleiben lokal.

## 50. Validator: Segment-Muss an der Segmentgruppen-Pflicht ausrichten (11.08.2026)

**Auftrag.** Ursache 1 aus der Referenz-Auswertung (Abschnitt 49): Der Validator
meldete Segmente als „fehlendes Muss", die der AHB im konkreten Anwendungsfall
gar nicht verlangt. Ursache war die Muss-Prüfung in `_engine/ahb-validator.js`:
Trägt ein Segment `expr = "Muss"`, wurde es sofort als hartes Pflicht-Segment
gewertet — die einschränkende Bedingung hängt aber häufig an der Segment**gruppe**
(`sgExpr`, z. B. `Soll […]` oder `Muss [Bedingung]`) und wurde nicht mehr
ausgewertet.

**Umsetzung.** Der „hart"-Zweig der Muss-Prüfung ist erweitert: Ein Segment ist
nur dann unbedingte Pflicht, wenn Segment (`expr`) UND Segmentgruppe (`sgExpr`)
unbedingt Muss sind (`grpKlasse === "hart"`). Andernfalls entscheidet die
konditionale Ebene — bevorzugt die Gruppenbedingung, sonst die Segmentbedingung:
erfüllt → hartes Muss („Bedingung erfüllt"), nicht erfüllt → Segment nicht
erforderlich, nicht maschinell entscheidbar → Warnung (`bedingteMuss`). Fehlt
eine `sgExpr` (Segmente auf Nachrichtenebene), bleibt es beim Segment-Status —
die bestehenden Verträge (`test_muss_validierung`, `test_bedingung_hart`) sind
damit unberührt.

**Wirkung (Referenzkorpus, 23 Dateien / 1491 Einheiten).** Fehler-Befunde
2310 → 5; fehlerfreie Einheiten 336 → 1487. Real gelaufene UTILMD/MSCONS/INVOIC/
REMADV/APERAK validieren nun bis auf die Rest-Ursachen 2/3 sauber. Die
informative Selbstvalidierung sank entsprechend (nur falsch-harte Meldungen
entfallen): 202604 Strom 280→135, Gas 154→103; 202610 Strom 259→135, Gas
155→104.

**Verbliebene Befunde (nächste Schritte).** Ursache 2 (DTM-Formatcodes 104/304
zu eng), Ursache 3 (CAV-Aufbau-Hinweis 55653) und eine Extraktionslücke (55218
CAV+Z22 ohne `sgExpr`) — siehe `docs/REFERENZ_BEFUNDE_20260811.md`.

**Nachweis.** Vertragstests grün; Golden unverändert (der Validator ändert keine
erzeugten Nachrichten, nur deren Bewertung); Regression komplett grün (32 Läufe).
Reduktion sind ausschließlich zuvor falsch-harte Muss-Meldungen in bedingten/
Soll-Gruppen — an echten Marktnachrichten und den Vertragstests gegengeprüft.

## 51. Validator: DTM-Formatcodes 104/304 und CAV-Gruppenpflicht aus dem CCI (11.08.2026)

**Auftrag.** Ursachen 2 und die Extraktionslücke aus der Referenz-Auswertung
(Abschnitt 49/50).

**Umsetzung.**

1. **DTM-Formatcodes 104/304** (`_engine/ahb-validator.js`, `DTM_FORMATE`):
   `304` war aus `303` übernommen (`\d{12}\+00`) und wies echte Zeitstempel mit
   Sekunden ab — jetzt `\d{12}(\d{2})?\+00` (CCYYMMDDHHMMSS+00, Sekunden optional).
   `104` verlangte einen Bindestrich (`\d{4}-\d{4}`), echte Werte für
   jahreszeitenabhängige Zeiträume sind zwei MMDD-Grenzen ohne Trenner
   (`02010204`) — jetzt `\d{4}-?\d{4}`. Kein Golden nutzt diese Codes (nur `:303`
   kommt erzeugt vor), die Änderung ist damit regressfrei.
2. **CAV-Gruppenpflicht aus dem CCI.** Ein CAV (Merkmalswert) gehört zum
   vorangehenden CCI (Merkmal) derselben Segmentgruppe; sein Pflichtstatus kann
   nie über dem des CCI liegen. Fehlte dem CAV in der Extraktion die Gruppenangabe
   (`sgExpr`), meldete der Validator nach Abschnitt 50 weiter ein hartes CAV-Muss,
   obwohl das zugehörige Merkmal nur bedingt/Soll ist (55218 CAV+Z22
   „Verbrauchsaufteilung temperaturabhängige Marktlokation": CCI „Soll [166]", CAV
   ohne `sgExpr`). Der Validator leitet die Gruppenangabe eines CAV jetzt aus dem
   letzten CCI desselben Blocks ab. Ein CAV wird dadurch nie HÄRTER als sein CCI —
   die Regel kann keine echten Pflichtbefunde unterdrücken.

**Wirkung.** Referenzkorpus (23 Dateien / 1491 Einheiten): Fehler-Befunde
5 → 1 (1490 fehlerfrei). Verbliebener Befund: ein CAV-Aufbau-Hinweis bei 55653
(Ursache 3, MIG-Auszug — Einzelfall). Informative Selbstvalidierung Strom
135 → 132 (die CAV-Erbregel), Gas unverändert 103/104.

**Nachweis.** Vertragstests (`test_muss_validierung`, `test_bedingung_hart`)
grün; Golden unverändert; Regression komplett grün (32 Läufe). Damit ist der
Referenzkorpus bis auf einen dokumentierten MIG-Einzelfall vollständig
fehlerfrei — die echten Marktnachrichten sind bereit, als Dauer-Referenz
(`erwartung.json`) verankert zu werden.

## 52. Validator: zweiter Merkmalswert (DE7110) im CAV-Composite (11.08.2026)

**Auftrag.** Letzter Rest-Befund der Referenz-Auswertung (Ursache 3): 55653
meldete an `CAV+:::6:1` „Wert '1' an Komponente 5, führendes DE7111 leer — im
MIG-Auszug kein benutztes Datenelement".

**Analyse.** Das CAV-Composite C889 trägt am Ende ZWEI Merkmalswerte DE7110
(Komponenten 4 und 5). Der Decoder (`_engine/ahb-validator.js`, ein DE je
Position) kannte nur den ersten (`"7110": [0,3]`). Ein Wert an der zweiten
7110-Komponente ist laut MIG regelkonform (zwei Merkmalswerte, z. B. „6" und
„1"), wurde aber als unbeschriebene Komponente gemeldet.

**Umsetzung.** Kleine, datengetriebene Whitelist `KOMP_ZUSATZ = { "CAV:0": [4] }`
für belegbare Composite-Wiederholungen, die der Ein-DE-je-Position-Decoder nicht
abbilden kann; `pruefeKomponenten` überspringt diese Positionen. Wirkt nur auf
die deklarierte Stelle (2. DE7110 im CAV) — keine echten Aufbaufehler werden
unterdrückt.

**Wirkung.** Referenzkorpus jetzt **0 Fehler-Befunde** (1491/1491 Einheiten
fehlerfrei; die 92 Hinweise bleiben informativ). Damit ist der gesamte
23-Dateien-Korpus echter Marktnachrichten (UTILMD/MSCONS/INVOIC/REMADV/APERAK/
CONTRL) vollständig sauber; über die Serie Abschnitt 50–52: Fehler-Befunde
2310 → 0.

**Nachweis.** Vertragstests grün; Golden unverändert; Regression komplett grün
(32 Läufe). Nächster Schritt: stabile Nachrichten als Dauer-Referenz mit
`<datei>.erwartung.json` (`fehlerfrei: true`) verankern.

## 53. Validator-Seite: Sammel-/Mehr-PID-Dateien je Nachricht prüfen (11.08.2026)

**Auftrag.** Auftraggeber-Befund: In einer INVOIC-Datei mit mehreren UNH und
UNTERSCHIEDLICHEN Prüf-IDs (z. B. 31006 gefolgt von 31005) meldete der
interaktive Validator (`validator.html`) die Segmente der Folgenachricht
fälschlich als Fehler — inklusive der PID-abhängigen Segmente.

**Ursache.** `validator.html` prüfte den GESAMTEN Dateitext gegen die ERSTE
erkannte Prüf-ID. Die in Abschnitt 49 gebaute Zerlegung je Nachricht/Vorgang war
bisher nur in der Referenz-Testsuite umgesetzt, nicht im interaktiven Validator.

**Umsetzung.** `validator.html` bindet nun `_engine/umbau.js` ein und zerlegt die
Eingabe mit derselben Mechanik wie die Referenzsuite in Einheiten — je Nachricht
(UNH…UNT) und, bei UTILMD mit mehreren Prüf-IDs, je Vorgang. `starte()` prüft:
eine Einheit → unveränderte Einzel-Ansicht (`starteEinzeln`); mehrere Einheiten →
je Einheit ein eigener Ergebnis-Block gegen ihre eigene Prüf-ID (`starteMehrfach`),
mit Gesamt-Ampel. Die Prüf-/Rendern-Logik wurde dazu in `pruefeEinText` (Erkennung
+ Validierung, kein DOM) und Hilfsfunktionen `segListeHtml`/`globalHtml`
zerlegt; die Einzel-Ansicht bleibt Byte-für-Byte wie zuvor (Original-Text, inkl.
Antwort-Panel). Bei Mehrfachdateien ist das Antwort-Panel ausgeblendet (Antworten
werden je Einzelnachricht erzeugt).

**Nachweis.** Neuer Regressionstest `scripts/test_validator_mehrfach.js`
(synthetische Daten, CI-tauglich): INVOIC-Sammel mit 31001+31006 → zwei Blöcke
je eigener Prüf-ID; UTILMD mit zwei Vorgängen 55001+55036 → zwei Blöcke;
Einzelnachricht → unveränderte Einzel-Ansicht; keine JS-Fehler. In der Regression
registriert (nun 33 Läufe, grün). Zusätzlich lokal an der realen INVOIC-Sammel
(15 Nachrichten, 31006/31005/31004) verifiziert: 15 Blöcke, alle fehlerfrei.

## 54. Prüf-ID-Zerlegung: alle Nachrichtentypen geprüft, INSRPT ergänzt (11.08.2026)

**Auftrag.** Systematische Prüfung, welche Nachrichtentypen — wie UTILMD und
INVOIC — aggregiert mehrere UNTERSCHIEDLICHE Prüf-IDs enthalten dürfen, und
Anpassung, wo nötig.

**Analyse (zwei Ebenen).**

1. **Mehrere UNH je Datei** (Sammel-Übertragung): typunabhängig möglich und
   bereits abgedeckt — `validator.html` und die Referenzsuite zerlegen jede
   Datei je UNH (`EdiUmbau.nachrichten`), jede Nachricht gegen ihre eigene
   Prüf-ID.
2. **Mehrere Prüf-IDs je UNH-Nachricht** (Vorgangsebene): nur dort möglich, wo
   der RFF+Z13 (Prüfidentifikator) in einer je Vorgang wiederholten Gruppe sitzt.
   Position des RFF+Z13 je Typ aus den Metas ermittelt:

   | RFF+Z13-Sitz | Typen | mehrere PID je UNH |
   |---|---|---|
   | SG6 unter IDE (Vorgang) | UTILMD, UTILTS | ja |
   | SG4 EQD / SG15 CNI (Vorgang) | IFTSTA | ja |
   | SG4 nach DOC (Vorgang) | INSRPT | ja |
   | SG1 / ohne SG (Kopf) | ORDERS-Familie, MSCONS, INVOIC, PRICAT, PARTIN, REMADV, COMDIS | nein (eine PID je UNH) |
   | kein RFF+Z13 | APERAK, CONTRL | — |

   Die MIG-`maxWdh` ist für diese Frage untauglich: Sie beschreibt die
   Ein-PID-AHB-Struktur (je Vorgang ein Segment, daher IDE=1 auch bei UTILMD),
   nicht die Aggregation mehrerer Vorgänge/Prüf-IDs in einer Nachricht.

**Umsetzung.** UTILMD, UTILTS und IFTSTA (EQD- und CNI-Variante) wurden bereits
korrekt in mehrere Prüf-ID-Vorgänge zerlegt. Einzige Lücke: **INSRPT** (RFF+Z13
je DOC-Vorgang) fehlte in `VORGANG_TRIGGER` — ergänzt um `INSRPT: { tags: ["DOC"] }`.
Die Kopf-Typen (SG1/ohne SG) brauchen keinen inneren Trigger: eine Prüf-ID je
UNH; mehrere Prüf-IDs entstehen ausschließlich über mehrere UNH.

**Nachweis.** Neuer Node-Regressionstest `scripts/test_umbau_pidzerlegung.js`
(synthetische Daten) sichert die gesamte Matrix: UTILMD/UTILTS/IFTSTA(EQD+CNI)/
INSRPT liefern je zwei Prüf-IDs aus zwei Vorgängen; INVOIC/MSCONS/ORDERS liefern
keine Vorgangs-PID (eine je UNH); mehrere UNH werden typunabhängig zerlegt. In
der Regression registriert (nun 34 Läufe, grün). Umbau-E2E (56/56) und der
Einheitentest unverändert grün.

## 55. Validator: konditionale Muss-Bedingungen tatsächlich auswerten (11.08.2026)

**Auftrag.** Auftraggeber-Befund: INVOIC 31004 zeigte „orange, fehlerfrei, 7
bedingte Muss" — ob die Abhängigkeiten nicht geprüft und aufgelöst werden können.

**Ursachen (drei).**

1. **Bedingungspfad falsch (validator.html).** `ladeBedingungen` baute den Pfad
   aus `seite` (Registry-URL mit `?stand=`-Parameter, ohne Stand-Verzeichnis) —
   das Stand-Verzeichnis fehlte, der Load schlug fehl, `EdiBedingungen` blieb
   leer, jede Bedingung galt als „nicht entscheidbar" (Warnung). Behoben: Pfad aus
   `metaPfad` ableiten (`…/<stand>/…/pruef-ids/_bedingungen.js`).
2. **Bedingungen im Prüfpfad nicht bereitgestellt (Harness/Referenzsuite).** Die
   per-Typ-Datei `_bedingungen.js` legt ihre Daten in eine typspezifische Variable
   und exportiert `EdiBedingungen` nur über `window`; im VM-Sandbox (kein window)
   kam nichts an. Behoben: Der Harness zieht die Bedingungen über `module.exports`
   der Datei nach (`sandbox.EdiBedingungen`).
3. **Gemischte Status-Ausdrücke (ahb-validator.js).** `bedingungErfuellt` verlangte
   „Muss [...]" bis Zeilenende und scheiterte an gemischten Ausdrücken wie
   „Muss [47] Soll [19] ∧ [1]". Behoben: nur der führende „Muss [...]"-Teil wird
   ausgewertet (Bedingungsausdrücke enthalten nur Zahlen/Klammern/∧∨⊻; der Lauf
   endet am nächsten Statuswort).

**Ergebnis (INVOIC 31004).** Von sieben bedingten Muss lösen sich drei
maschinell auf (DTM+Z42/Z43 über [55] „Wenn IMD++ABS"; DTM+203 über [47] „Wenn
IMD++Z43" — beide IMD-Qualifier stehen nicht in der Nachricht → nicht
erforderlich): 7 → 4. Die verbleibenden vier sind echte fachliche Abhängigkeiten,
die aus DIESER Nachricht nicht entscheidbar sind — Verweise auf die Ursprungs-/
Stornorechnung ([34] „Wenn in Ursprungsrechnung vorhanden", [1]) bzw. die
Empfängerrolle ([31] „MP-ID in NAD+MR in Rolle MGV") und ein Querbezug ohne
hinterlegten Check ([58]). Diese tragen jetzt ihren **Klartext** in der Warnung
(„… abhängig von: [31] Wenn MP-ID in NAD+MR in der Rolle MGV"), statt nur den
rohen Bedingungscode.

**Nachweis.** Vertragstests (`test_muss_validierung`, `test_bedingung_hart`)
grün; Referenzsuite weiter 1491/1491 fehlerfrei (0 Fehler; die Bedingungsauswertung
erzeugt keine neuen harten Befunde an echten Nachrichten); Regression komplett
grün (34 Läufe). Golden/Selbstvalidierung unverändert.

## 56. Validator: Rahmen mit Sprungnavigation zu Befunden (11.08.2026)

**Auftrag.** In der Mehr-PID-Ansicht eine Sprungnavigation zu den Rahmen mit
Fehlern bzw. Hinweisen (und zurück).

**Umsetzung.** Jeder Nachrichtenblock trägt nun einen statusabhängigen Akzent:
grün (fehlerfrei), amber (nur Hinweise/bedingte Muss), rot (Fehler). Über der
Ergebnisliste sitzt eine **sticky Navileiste** „N von M Nachrichten mit Befund
(Fehler/Hinweise)" mit „▲ zurück" / „nächster Befund ▼" und Positionsanzeige;
`springeBefund()` rollt zum jeweiligen Block (`scrollIntoView`, kurzer
Markierungsrahmen) und läuft zyklisch durch alle Blöcke mit Fehler oder Hinweis.
Rein visuell/navigatorisch; Prüf-Logik und Einzel-Ansicht unverändert.

**Nachweis.** `test_validator_mehrfach` und `test_engine_pages` grün, keine
JS-Fehler; Regression grün (34 Läufe).

## 57. Validator: Bezug auf die Ursprungs-/Bezugsnachricht bei offenen Bedingungen (11.08.2026)

**Auftrag.** Bei nicht maschinell auflösbaren Bedingungen, die auf eine andere
Nachricht verweisen (z. B. „Wenn in Ursprungsrechnung vorhanden", „Wenn MP-ID in
NAD+MR in der Rolle MGV"), soll der Hinweis die Bezugsnachricht benennen — DAR
bzw. Belegnummer und, falls vorhanden, das Erstellungsdatum.

**Umsetzung.** Der Validator reichert jede verbleibende bedingte-Muss-Warnung um
einen konkreten Bezug an (`konkreterBezug` in `_engine/ahb-validator.js`):

- Verweist die Bedingung auf eine Ursprungs-/Vorgänger-/Stornonachricht, werden
  die Referenzsegmente der Nachricht ausgewertet — `RFF+OI` (Ursprungsrechnung),
  `RFF+ACW` (vorherige Nachricht), `RFF+TN` (referenzierter Vorgang) — samt
  Belegdatum aus dem folgenden `DTM` (z. B. „→ Ursprungsrechnung
  MMM200001091370, Belegdatum 23.02.2026").
- Nennt die Bedingung ein Segment DIESER Nachricht (z. B. `NAD+MR`, `MOA+113`),
  wird dessen Wert bzw. Fehlen gezeigt („→ NAD+MR: 9904…"; „→ MOA+113 nicht in
  dieser Nachricht"), sodass der Prüfer die Bedingung selbst beurteilen kann.

**Ergebnis (INVOIC 31004).** Die vier verbleibenden bedingten Muss tragen jetzt
ihren Bezug: [34] → Ursprungsrechnung samt Belegdatum, [31] → die NAD+MR-MP-ID,
[58] → „MOA+113 nicht in dieser Nachricht".

**Nachweis.** Vertragstests grün; Referenzsuite weiter 1491/1491 fehlerfrei;
Regression komplett grün (34 Läufe). Rein informativ (Hinweistext); keine
Änderung an Fehler-/Golden-Bewertung.

## 58. Validator: Hinweis/Link zur Codenummern-Prüfung bei den Vergabestellen (11.08.2026)

**Auftrag.** Recherche ergab: Ein echter Codenummernabgleich (ist eine MP-ID real
vergeben, an wen, in welcher Rolle) braucht das Verzeichnis der Vergabestellen,
das bei BDEW (Strom) und DVGW (Gas) registrierungs-/vertragspflichtig und nicht
frei als Liste/API abrufbar ist. Der Auftraggeber hat keinen solchen Zugang;
gewünscht ist daher lediglich ein Hinweis mit Link zur manuellen Prüfung.

**Umsetzung (`validator.html`).** Das Ergebnis zeigt oben eine Info-Box, die die
Marktpartner-Codenummern aus UNB (Absender/Empfänger) und den NAD-Segmenten
sammelt und je Nummer die zuständige Vergabestelle samt Prüf-Link nennt. Die
Zuordnung folgt der in der Nachricht codierten Stelle — UNB-Kennung
(500 = BDEW/Strom, 502 = DVGW/Gas) bzw. NAD DE3055 (293 = BDEW, 332 = DVGW,
9 = GS1/GLN):

- BDEW (Strom): https://bdew-codes.de/Codenumbers/BDEWCodes
- DVGW (Gas): https://www.dvgw-sc.de/leistungen/it-dienstleistungen/datenaustausch-gas/marktkommunikation-gas
- GS1 (GLN): https://www.gs1-germany.de/…/global-location-number-gln/

Zusätzlich trägt der Seitenfuß dieselben Links als dauerhafte Referenz. Der
Hinweistext stellt klar: Der Validator prüft nur Format und Konsistenz der
MP-IDs, nicht deren tatsächliche Vergabe — die bestätigt nur die zuständige
Stelle. Rein informativ, keine Änderung an der Prüf-Logik.

**Nachweis.** `test_validator_mehrfach`, `test_engine_pages` grün, keine
JS-Fehler; Regression grün (34 Läufe).

## 59. Validator: universelles Suchfeld und durchgehend sichtbare Werkzeugleiste (11.08.2026)

**Auftrag.** Ein universelles Suchfeld für Text-Strings in der Nachricht (z. B.
RFF+Z13 oder eine hineinkopierte Melo), mit Fundstellen-Hervorhebung, Trefferzahl
und Sprung zwischen den Treffern; außerdem sollen die Schaltflächen der
Sprungnavigation nicht nur am Anfang der Nachricht erreichbar sein.

**Umsetzung (`validator.html`).**

- **Sticky Werkzeugleiste.** Die Navigation lag bisher in `#globalMeldungen`, das
  beim Scrollen mit aus dem Bild lief (das sticky-Element klebt nur innerhalb
  seines kurzen Elternelements). Neu ist eine eigene Leiste `#werkzeugLeiste`
  (`position:sticky`) als DIREKTES Kind des Ergebnis-Panels — ihr Klebebereich
  reicht damit über die ganze Segmentliste, die Leiste bleibt durchgehend oben
  sichtbar. Die Befund-Navigation ist in diese Leiste umgezogen.
- **Universelles Suchfeld.** Sucht live (auch mehrfach) im gesamten Segmentbereich
  über alle Nachrichtenblöcke: Jede Fundstelle wird hervorgehoben (`<mark>`), die
  Trefferzahl ausgegeben, und ◀/▶ (bzw. Enter/Shift+Enter) springen Treffer für
  Treffer mit Angabe der Fundstelle (Nachricht und Segmentnummer, z. B. „15
  Treffer — 1/15 · Nachricht 1/15 · …, Segment 11"). Umgesetzt über einen
  TreeWalker über die Textknoten der gerenderten Segmentliste; die Hervorhebungen
  werden bei jeder neuen Suche/Validierung sauber zurückgesetzt.

**Nachweis.** `test_validator_mehrfach`/`test_engine_pages` grün, keine JS-Fehler;
Probe an der 15er-INVOIC-Sammeldatei: „RFF+Z13" → 15 Treffer (je Nachricht Segment
11), Teilstring-Suche „50457" → 13 Treffer. Werkzeugleiste `position:sticky` als
Kind von `panelErgebnis`. Regression grün (34 Läufe).

## 60. Neue Fehlerkorrekturen 06.08.2026: UTILMD Gas AHB 1.2 & Strom MIG S2.2 (12.08.2026)

**Auftrag.** Neue konsolidierte Lesefassungen mit Fehlerkorrektionen (Stand
06.08.2026, Umsetzung 01.10.2026 = Formatstand 202610/FV2610) prüfen, die
Änderungshistorie zeigen und die Änderungen einarbeiten.

**Beschaffung.** WebFetch erreichte bei den großen PDFs die Änderungshistorie am
Dokumentende nicht (Gas-AHB S. 293, Strom-MIG S. 534–536 jenseits des
Extraktionslimits), die Word-Dateien kamen nur als Binärdaten, die XML-Fassungen
sind zugriffsbeschränkt. Über den **Hochfrequenz-Spiegel `edi_energy_mirror`**
(GitHub, per Klon) ließen sich die Word-Fassungen holen: `AHB_UTILMD_G1.2 …
20260806 … 12303.docx` und `MIG_UTILMD_S2.2 … 20260806 … 12306.docx`. Die
Änderungshistorie wurde mit `python-docx` extrahiert (Tabelle am Dokumentende;
Status-Spalte enthält das Änderungsdatum). Übersicht als HTML an den Auftraggeber
geliefert; die Dokumente selbst bleiben (wie stets) außerhalb des Repositorys.

**Änderungen mit Datum 06.08.2026.**

Gas AHB 1.2:
- **27512** — SG4 DTM Kündigungstermin des Vertrags, DE2380, Anwendungsfälle
  44018/44041 (Ablehnung Kündigung): Bedingung `X [UB2] ∧ [209]` →
  `X ([UB2] ∧ [209]) ⊻ [44]` (neu: [44] „Wenn im DE2379 der Code 106 vorhanden").
  Grund: bei Code 106 konnte kein Wert im DE2380 angegeben werden, die Bedingung
  fehlte.

Strom MIG S2.2:
- **26312 / 27508 / 27509** — RFF (Objektcode Lokationsbündel), PIA (OBIS
  Netzlokation), SG10 (Zugeordnete Definition Steuerbare Ressource): BDEW-Status
  R → D. MIG-interne Konsistenz — der AHB führt bereits Muss+Bedingung; der
  Generator validiert AHB-basiert, `st` wird im Validator nur für „N" (Nicht
  benutzt) ausgewertet. **Kein Generator-Datenänderungsbedarf.**
- **27513** — PIA OBIS-Kennzahl der Tranche, dritte DE-Gruppe DE7140: Format
  „C N" → „N", „leer" → „Nicht benutzt". Betrifft die 3. C212-Wiederholung —
  unterhalb der Modellierungstiefe des generischen `PIA 7140`-Eintrags in
  `mig-formate.js`. **Kein Generator-Datenänderungsbedarf.**
- **27524** — CCI Vergütungsverpflichtung EEG/KWKG: Beschreibungstext um einen
  Hinweis (Zeitscheiben/Schätzung) ergänzt. Rein redaktionell.

**Umsetzung.** Nur die AHB-relevante Änderung **27512** berührt die
Prüfgrundlage. Sie wurde präzise in `202610/Stammdaten/UTILMD/Gas/pruef-ids/_form-meta.js`
eingearbeitet (nur die zwei Instanzen 44018/44041 DTM Kündigungstermin DE2380:
neue `expr` und Bedingungstext um [44] ergänzt). Die MIG-Änderungen sind
MIG-intern bzw. redaktionell und ändern die AHB-getriebene Prüfung nicht; die
kanonische Vollübernahme erfolgt beim nächsten Pipeline-Lauf auf den neuen
FV2610-Dokumenten.

**Nachweis.** Zielgenaue Kontrolle (44018/44041 tragen die neue Bedingung);
Golden unverändert; Regression grün (34 Läufe).

## 61. Einstiegsseite: Stand der verarbeiteten Dokumente und Änd-ID-Liste (12.08.2026)

**Auftrag.** Auf der Startseite dauerhaft den Stand der verarbeiteten Dokumente
(AHB und MIG) zeigen und eine Liste der aufgenommenen bzw. eingearbeiteten
Änd-IDs verlinken.

**Umsetzung.** Neue Nachweis-Datenschicht `_engine/daten/dokumentenstand.js`
(`EdiDokumentenstand`): je Formatstand die AHB/MIG-Versionen (UTILMD Strom/Gas)
plus eine Liste der Änderungen (Änd-ID, Dokument, Datum, Kurztext, Flag
`eingearbeitet`). `index.html` rendert daraus unter „Stand der verarbeiteten
Dokumente (AHB / MIG)" zwei Karten (der kalendarisch aktive Formatstand ist
hervorgehoben) und eine aufklappbare Liste „Eingearbeitete Änderungen (Änd-IDs)"
mit Status-Badge (eingearbeitet/bewertet). Verweist auf
`docs/QUELLEN_MANIFEST.json` als vollständige Quellenliste; Originaldokumente
bleiben außerhalb des Repos.

Erstbefüllung mit den Fassungen 202604 (S2.1/G1.1) und 202610 (2.2/S2.2, 1.2/
G1.2, Stand 06.08.2026) sowie den sechs Änderungen aus Abschnitt 60 (27512
eingearbeitet; 26312/27508/27509/27513/27524 bewertet).

**Nachweis.** Startseite rendert ohne JS-Fehler (2 Karten, 6 Änderungen);
Regression grün (34 Läufe).

## 62. Validator: fehlendes Muss-Datenelement wird rot (STS-Ergänzung u. a.) (12.08.2026)

**Auftrag.** Eine alte Strom-Nachricht (S1.1a) wurde anhand der Validator-Hinweise
auf S2.1 umgebaut. Danach fiel auf: `STS+7++ZC8'` wurde **grün** gewertet, obwohl
dem Segment der Status-Zusatz (die Transaktionsgrundergänzung, C556 3. Gruppe)
fehlt — erwartet war ein **rotes** Feld mit Fehlerhinweis. Anschließend alle PID
auf vollständige und korrekte Syntaxprüfung kontrollieren.

**Ursache.** Der Validator prüfte je genutzter Segmentinstanz die **Codes
vorhandener** Datenelemente sowie fehlende Muss-**Segmente** — aber nie, ob ein als
Muss geführtes **Datenelement** einer vorhandenen Segmentinstanz auch belegt ist.
Ein leeres Pflicht-DE (z. B. die STS-Ergänzung) rutschte damit unbemerkt durch.

**Umsetzung.** In `_engine/ahb-validator.js` (Instanz-Schleife von
`validiereNachricht`) eine **Muss-Präsenzprüfung je Datenelement** ergänzt:
positionsgenau über `pos`/`sub` (nicht über die DE-Nummer, denn STS führt DE9013
mehrfach: Transaktionsgrund pos 2, Ergänzung pos 3, Ergänzung für befristetes
Lieferende pos 4). Maßgeblich ist der Pflichtstatus wie sonst auch:

* Das DE selbst muss **unbedingtes** „X"/„M" sein (bedingte Marker wie „X [192]",
  „X [580]" bleiben außen vor — ihre Bedingungen sind nicht durchgängig maschinell
  entscheidbar; ein harter Fehler wäre dort nicht belastbar).
* Bei **codierten** DE zählt zusätzlich der Code-Status: nur wenn mindestens ein
  Code unbedingtes Muss ist, ist das DE Pflicht. Sind alle Codes bedingt/Soll
  (z. B. die dritte STS+7-Ergänzung „für Lieferende bei befristeter Anmeldung":
  E01/E03 mit „S [9P0..1]"), bleibt das DE optional.
* **Freie** Wert-DE ohne Codeliste (Datum, Betrag, Vorgangsnummer …) sind bei
  unbedingtem „X" stets Pflicht.

Fehlt ein so bestimmtes Muss-DE, meldet der Validator es als harten Fehler
(„… Pflichtangabe DE9013 (Transaktionsgrundergänzung) fehlt …") → rotes Feld.

**Nachweis (alle PID).** Neuer Test `scripts/test_de_muss_praesenz.js` prüft über
**alle 553 Prüf-IDs** aller vier Ziele:

1. **Kein Fehlalarm** — jede vom Generator erzeugte Golden-Nachricht bleibt frei
   von „Pflichtangabe … fehlt" (0/553).
2. **Wirksamkeit** — für jede STS+7-Instanz mit unbedingter Muss-Ergänzung wird
   diese aus der Nachricht entfernt; der Validator meldet sie zuverlässig
   (76/76). Optionale/bedingte Ergänzungen bleiben korrekt stumm (18/18).
3. **Nutzerfall** — `STS+7++ZC8'` (PID 55037) ergibt genau einen Ergänzungs-
   Pflichtfehler.

Gegenprobe an 23 echten Marktnachrichten (1491 Einheiten): weiterhin 0 Fehler.
Golden- und Selbstvalidierung unverändert (132 dokumentierte Befunde, keiner davon
„Pflichtangabe"). Regression grün.

**Abgrenzung.** DE-Ebene meldet nur **unbedingte** Muss-Lücken hart. Bedingte
Muss-DE („X [nnn]") werden bewusst nicht als harter Fehler gewertet; die
konditionale Muss-Auswertung bleibt auf Segment-/Gruppenebene (Abschnitt 55).

## 63. Einstiegsseite: alle Nachrichtentypen im Dokumentenstand + Netzprüf-Schalter (12.08.2026)

**Auftrag.** (a) Die Stände **aller** verarbeiteten Dokumente **aller**
Nachrichtentypen in die Liste der Einstiegsseite aufnehmen (bisher nur UTILMD
Strom/Gas). (b) Einen Schalter einbauen, der aktiv im Netz auf neuere Dokumente
prüft.

**(a) Vollständiger Dokumentenstand.** `_engine/daten/dokumentenstand.js` neu aus
`docs/QUELLEN_MANIFEST.json` erzeugt: Basis ist das Feld `zuordnung` (führt für
beide Formatstände alle **18** verarbeiteten Nachrichtentypen mit AHB-Version),
angereichert um MIG-Version und Standdatum aus dem Feld `dokumente`. Ergebnis je
Formatstand: 202604 mit 36 Zeilen (18 Typen × AHB/MIG), 202610 mit 29 Zeilen
(AHB je Typ vollständig; MIG, soweit im Manifest hinterlegt). Die kuratierten
UTILMD-Fassungen der Fehlerkorrektur 06.08.2026 (Strom 2.2/S2.2, Gas 1.2/G1.2 —
Abschnitt 60/61) bleiben erhalten. Der Renderer der Einstiegsseite zeigt beide
Karten unverändert (aktiver Formatstand hervorgehoben), jetzt mit allen Typen;
die Änd-ID-Liste bleibt bestehen. Neu im Datensatz: `hoechsteMakoFileId` (höchste
bekannte Download-ID der MAKO-Plattform aus dem Manifest, aktuell 12277) als
Bezugswert für die Netzprüfung.

**(b) Netzprüf-Schalter.** Button „Auf neue BDEW-Dokumente prüfen" unter der
Dokumentenstand-Übersicht (`index.html`, `#doknetz`). Er fragt
`https://bdew-mako.de/api/documents` (DevExtreme-Paginierung `skip/take`) ab,
ermittelt die höchste `fileId` und vergleicht sie mit `hoechsteMakoFileId`:

* höhere `fileId` gefunden → Meldung „N neuere Dokument-Fassung(en)" samt der
  neuesten Titel (mit Fehlerkorrektur-Kennzeichen/Datum) und Hinweis auf den
  Detailabgleich `werkzeuge/mako_plattform.py --dokumente`;
* keine höhere `fileId` → „Prüfgrundlage ist aktuell";
* Abfrage nicht möglich (der Regelfall beim lokalen Aufruf über `file://`:
  CORS/Origin `null`, oder offline/Zeitüberschreitung) → **sichtbare
  Degradation** mit verarbeitetem Stand, dem verlässlichen lokalen Befehl und
  einem direkten Plattform-Link. AbortController mit 15 s Timeout,
  Seiten-Obergrenze gegen Endlospaginierung.

Bewusste Grenze: Eine vollautomatische Browser-Prüfung ist bei lokaler Nutzung
über `file://` durch die Sicherheitsrichtlinie des Browsers nicht garantiert; der
Schalter ist daher ehrlich degradierend gebaut und nennt stets den verlässlichen
Weg über das lokale Werkzeug. Über HTTP(S) mit erlaubtem CORS führt er den
tatsächlichen Abgleich aus.

**Nachweis.** Einstiegsseite lädt ohne Konsolenfehler; zwei Karten mit 36/29
Zeilen; Schalter vorhanden und nach Lauf wieder aktiv; Klick unter `file://`
liefert die erwartete Degradations-Meldung. Seiten-Smoke 416/416, Regression grün.

## 64. Verfeinerung: fehlendes Muss-DE mit Abhängigkeiten; Dokumentenstand einklappbar (12.08.2026)

**Auftrag.** (1) Die Meldung zum fehlenden Muss-Datenelement soll nicht nur „im
AHB nachschauen" sagen, sondern die erwartete Angabe samt evtl. Abhängigkeiten
konkret nennen. (2) Die Auflistung „Stand der verarbeiteten Dokumente" soll
einklappbar sein.

**(1) Konkrete Erwartung + Abhängigkeiten.** In `_engine/ahb-validator.js` die
Muss-DE-Meldung erweitert: statt des pauschalen AHB-Verweises nennt sie jetzt bei
codierten Datenelementen die **zulässigen Codes mit Klartext** (z. B. „zulässige
Angabe: ZW3 (Erzeugende Marktlokation); ZW4 (Verbrauchende Marktlokation)"),
und je Code die als `[nnn]` hinterlegte **Abhängigkeit** im Klartext
(„… ZAP (ruhende Marktlokation) — nur wenn [519] Hinweis: … ∧ [520] Hinweis: …").
Neue Helfer `bedingungsRefsText(expr, lokal)` (löst reine `[nnn]`-Referenzen auf;
Paket-/Wiederholungsangaben wie `[9P0..1]` bleiben außen vor) und
`lokaleBedingungen(text)` (liest prüf-ID-lokale Hinweise aus `inst.bedingungen`).
Bei freien Wert-DE nennt die Meldung Feldname und **MIG-Feldformat**. Verweist eine
Bedingung auf die Ursprungs-/Bezugsnachricht, wird deren Referenz über den
bestehenden `konkreterBezug` angehängt.

**(2) Einklappbare Übersicht.** Der Kartenblock der Dokumentstände steht in
`index.html` jetzt in einem `<details class="dokstaende">` (standardmäßig
zugeklappt), Summary „Verarbeitete Dokumente je Formatstand — N Einträge (AHB/MIG
aller Nachrichtentypen)". Die Änd-ID-Liste und der Netzprüf-Schalter bleiben
darunter sichtbar.

**Nachweis.** `scripts/test_de_muss_praesenz.js` um zwei Prüfungen erweitert:
Nutzerfall 55037 nennt die Codes ZW3/ZW4; PID 55002 weist die an ZAP geknüpfte
Bedingung als „nur wenn [nnn] …" aus. Test grün (0 Fehlalarme, 76/76, 18/18).
Einstiegsseite: Details zugeklappt vorbelegt, öffnet per Klick, 36/29 Zeilen,
0 Konsolenfehler. Seiten-Smoke 416/416, Schnell-Regression grün.

## 65. Dokumentenstand 202610: fehlende MIG-Versionen ergänzt („None" behoben) (12.08.2026)

**Frage.** Im kommenden Formatstand 202610 stand bei mehreren MIG (u. a. MSCONS)
„None". Beim BDEW liegen PDF und DOCX — ist das ein Problem, können die Dokumente
nicht verarbeitet werden?

**Bewertung.** „None" war ein reines **Label-/Datenproblem**, kein Verarbeitungs-
problem. Beim Katalogisieren der FV2610-MIG im Quellen-Manifest wurde nur die
Download-ID (`makoFileId`) erfasst, das Feld `version` blieb `null`; der
Übersichts-Generator hat dieses `null` zusätzlich fälschlich als Text „None"
ausgegeben. Die Dokumente selbst sind vorhanden und verarbeitbar — dieselben
DOCX/PDF-Wege wie bei der Fehlerkorrektur 06.08.2026 (Abschnitt 60: edi_energy-
Spiegel + python-docx bzw. PDF-Extraktion). Für die **Validierung** ist MSCONS
202610 bereits hinterlegt: `_engine/daten/mig-formate.js` führt 92 MSCONS-
Feldformate für den Formatstand 202610.

**Umsetzung.** Die maßgeblichen FV2610-MIG-Versionen aus dem konsolidierten
edi_energy-Spiegel übernommen (Dateinamen tragen die Version):

* MSCONS **MIG 2.5** (AHB 3.2), IFTSTA 2.1, APERAK 2.2, ORDCHG 1.2, ORDERS 1.4c,
  ORDRSP 1.4c, PARTIN 1.1, PRICAT 2.1, QUOTES 1.3c — jeweils gültig ab 01.10.2026.

Damit sind im Quellen-Manifest (`docs/QUELLEN_MANIFEST.json`, 11 Einträge
nachgetragen) und in `_engine/daten/dokumentenstand.js` keine „None"-Versionen
mehr vorhanden; die Einstiegsseite zeigt für beide Formatstände je 36 Zeilen mit
echten Versions- und Standangaben. Der Übersichts-Generator gibt leere Versionen
nicht mehr als „None" aus.

**Nachweis.** Paket-Prüfung bestanden, Schnell-Regression grün, Seiten-Smoke
416/416; Einstiegsseite ohne „None", 72 Einträge, 0 Konsolenfehler.

## 66. Änderungsbewertung 202610 über ALLE Nachrichtentypen (12.08.2026)

**Auftrag.** Die Änderungsbewertung 202604→202610 nicht nur für MSCONS, sondern für
alle Datenformate durchführen (Änderungshistorie aus den DOCX ziehen, gegen die
Prüfgrundlage abgleichen — wie bei UTILMD in Abschnitt 60).

**Vorgehen.** Aus dem edi_energy-Spiegel (Hochfrequenz) die konsolidierten
FV2610-DOCX aller 14 geänderten Formate (AHB und MIG) geholt und je Dokument die
Änderungshistorie extrahiert (`/tmp`-Pipeline mit python-docx; Tabellenerkennung
über den Spaltenkopf „Änd-ID/Grund/Status"). Die echten Änderungen (ohne reine
Versions-/Layoutzeilen) je Format thematisch klassifiziert und gegen die
Datenschichten des Repositorys geprüft.

**Kernbefund.** Die Prüfgrundlage für 202610 ist bereits durchgängig aus den neuen
Fassungen aufgebaut — belegt Schicht für Schicht:
* MIG-Feldebene (`mig-formate.js`): Quelle je Format = neue Datei-ID (MSCONS 12174
  = 2.5, APERAK 12152 = 2.2, …). Stichprobe verifiziert: das „Kontaktdaten-Konzept"
  entfernt CTA/COM in MSCONS/APERAK/PARTIN.
* Antwortcodes (`ebd-antwortcodes.js`): 202610 = EBD 4.3.
* UTILMD-AHB: Fassung S2.2/G1.2 plus Fehlerkorrektur 06.08.2026 (Abschnitt 60/61).
* Codelisten: standspezifisch (`konfigurationen_202610`).

Kein Nachtrag am Prüf-Code nötig. Systembedingt außerhalb des Validator-Modells
bleibt das per-Prüf-ID-AHB-Regelwerk der Nicht-UTILMD-Formate (dort wird über
MIG-Feldebene, Codelisten und EBD geprüft, nicht über per-PID-Regeln).

**Ergebnis.** Ausführlicher Bericht in `docs/AENDERUNGSBEWERTUNG_202610.md`
(Provenienz-Tabelle, Format-für-Format-Übersicht mit Änderungszahlen und
Kernthemen, Stichprobenverifikation, Abgrenzung, Fazit). Kein Code-/Datenänderung
an der Prüfgrundlage; reine Bewertung.

## 67. Einstiegsseite: PDF-Links zu den BDEW-Lesefassungen (12.08.2026)

**Auftrag.** Zu jedem Dokument der Formatstand-Liste einen Link auf die
konsolidierte Lesefassung (PDF) auf den BDEW-Seiten. Zuvor lizenzrechtlich bewerten.

**Lizenzbewertung (keine Rechtsberatung).** Verlinkt wird per Deep-Link auf die
plattformeigene Datei-URL des Rechteinhabers (`https://bdew-mako.de/api/downloadFile/
<fileId>`). Das ist etwas grundlegend anderes als das Kopieren/Spiegeln der
Dokumente (das im Projekt bewusst unterbleibt): Ein Hyperlink auf eine vom
Rechteinhaber selbst frei zugänglich bereitgestellte Datei verletzt nach
gefestigter Rechtsprechung (BGH „Paperboy") kein Urheberrecht — es wird nichts
vervielfältigt oder öffentlich zugänglich gemacht, sondern nur auf die Originalquelle
verwiesen. Die betreffenden EDI@Energy-Lesefassungen sind auf der MAKO-Plattform
öffentlich abrufbar (`isFree=true`; der Endpunkt liefert die PDF direkt ohne Login,
stichprobenhaft verifiziert). Umgesetzt wurde die vorsichtige Variante: reiner
Hyperlink (kein Framing/Embedding), `target="_blank" rel="noopener noreferrer"`,
klare Kennzeichnung „öffnet auf bdew-mako.de (BDEW)", keine Spiegelung im Repo.
Rest-/Randrisiken: die Plattform kann Datei-IDs/URLs ändern (dann Link ins Leere —
kein Rechtsproblem) und einzelne Dokumente könnten künftig hinter Login wandern; die
Nutzungsbedingungen des BDEW bleiben maßgeblich. Belastbare Aussage nur BDEW/Anwalt.

**Umsetzung.** In `_engine/daten/dokumentenstand.js` je Dokument das Feld `pdf` =
Datei-ID der konsolidierten Lesefassung (PDF, „oooo") ergänzt — aus dem
edi_energy-Spiegel für beide Formatstände (72/72 Zeilen abgedeckt). `index.html`
rendert die Versionsangabe als Link „<Version> ↗" auf
`https://bdew-mako.de/api/downloadFile/<pdf>` (neuer Tab, `noopener noreferrer`) und
weist unter der Liste auf die Herkunft (BDEW-MaKo-Plattform) hin.

**Nachtrag (12.08.2026).** Statt `target="_blank"` trägt jeder Link nun einen
festen Fensternamen `bdew-pdf-<fileId>`. Wiederholte Klicks auf DASSELBE Dokument
nutzen dadurch dasselbe Browserfenster/-Tab (bei Inline-Anzeige greift dann der
Browser-Cache, kein Neuladen); verschiedene Dokumente öffnen weiterhin eigene
Fenster. Ein prüfen „liegt lokal schon vor?" ist aus einer Browser-Seite nicht
möglich (Dateisystem-Sandbox) und ein eigener PDF-Cache bliebe bewusst außen vor
(Eigenständigkeit/Lizenz-Trennung). `rel="noopener noreferrer"` bleibt gesetzt.

**Nachweis.** 72/72 Links als korrekte BDEW-Deep-Links (HTTPS, target/rel gesetzt),
Einstiegsseite ohne Konsolenfehler; Ziel-URLs stichprobenhaft als echte PDF
verifiziert (u. a. MSCONS AHB 12172, UTILMD Strom AHB 10553). Seiten-Smoke 416/416,
Schnell-Regression grün.

## 68. PID 55658: nicht gemeldete Syntaxfehler — drei Validatorlücken geschlossen (12.08.2026)

**Meldung.** Ein Syntaxfehler in einer 55658-Nachricht wurde vom Validator nicht
angezeigt; Auftrag: den Fehler eigenständig finden.

**Vorgehen.** Da kein konkreter Fundort genannt war, wurde die 55658-Nachricht
systematisch gefuzzt: 15 typische Syntaxfehler (fehlender Terminator, `:` statt
`+`, leere Pflichtangaben, falsche Qualifier, Überlängen, doppelte Segmente,
UNB≠NAD, …) einzeln eingebaut und geprüft, welche der Validator NICHT meldet.
Vier rutschten durch — dahinter drei Ursachen:

**Lücke 1 — Muss-Datenelemente nur bei STS geprüft.** Die neue Muss-Präsenz-
prüfung (Abschnitt 62) war an die Positionsangaben `pos/sub` der Instanzdaten
gebunden — die nur die STS-Instanzen tragen. `IDE+24'` ohne Vorgangsnummer
(DE7402) oder `NAD+MS:9900…::293'` (Doppelpunkt statt Plus → MP-ID DE3039 nie
belegt) blieben grün — auch im Browser. Fix: Fallback über den zentralen DECODER
(`pos` bevorzugt, sonst DECODER-Position). Folgefix: die Instanzwahl bevorzugt
jetzt unter konfliktfreien Kandidaten die mit den meisten POSITIVEN Codetreffern
(`CCI+++ZB3` gehört zur Instanz mit ZB3 in der DE7037-Codeliste, nicht zur
Leistungskurven-Instanz, die mangels Werten bloß widerspruchsfrei war — belegt an
55639). Bewusst dokumentierte Ausnahmen (Masken lassen Anwenderwerte leer):
CCI+Z20/Z19 DE7037 (Bilanzierungsgebiet/-kreis), IMD+Z36 DE7009
(Identifikationslogik) — diese Meldungen sind KORREKT und im Test als
dokumentierte Befundfamilie geführt (Selbstvalidierung 132→136 bzw. 103/104→105/106).

**Lücke 2 — af-Regeln und Codelisten im Test-Harness still abgeschaltet.**
`af-regeln.js`/`codelisten.js` binden mit `const` — im Browser teilen spätere
`<script>`-Blöcke die globale lexikalische Umgebung, im VM-Kontext des Harness
hängen `const`-Bindungen aber NICHT am Sandbox-Objekt. Folge: MP-ID-, NAD≠UNB-
und Codelistenprüfungen liefen im Harness und in der Referenz-Suite nie (im
Browser-Validator dagegen schon). Fix: Harness hebt die Bindungen explizit ans
Sandbox-Objekt. Sichtbare Wirkung in der Referenz-Suite: die INVOIC-Fehlhinweise
„Artikelnummer nicht in den hinterlegten Codelisten" (~88 Stück) verschwinden —
die Artikelnummer 9990001000748 steht in der jetzt wirklich geladenen Liste;
neu erscheint ein fachlich korrekter OBIS-Hinweis (MSCONS, 7-0:54.0.22
„ggf. gerätespezifisch zulässig"). Hinweise gesamt: 92 → 4.

**Lücke 3 — Wiederholungen nicht geprüft.** Ein doppeltes BGM (o. ä. auf
Nachrichtenebene) blieb unbeanstandet. Fix: Instanzen ohne Segmentgruppe, die
laut MIG-Segmentlage nur 1× vorkommen (maxWdh = 1), melden Mehrfachvorkommen
als Fehler.

**Folgefunde an den eigenen Erzeugern.** Mit den aktiven Prüfungen fielen drei
ECHTE Lücken der eigenen Nachrichtenerzeuger auf (Antwortketten-E2E):
* Die Formular-Engine erzeugte NAD+MS/MR nur mit MP-ID — wo der AHB zusätzlich
  Name/Anschrift als unbedingtes Muss führt (INVOIC/REMADV: DE3036, DE3164 …),
  entstehen jetzt Beispielangaben (wie beim Ansprechpartner CTA), Aufbau wie in
  echten Marktnachrichten: `NAD+MS+<MP-ID>::<3055>++Testfirma:::::Z02+…+DE`.
* LIN ohne Artikel-Identifikation — wo DE7143 unbedingtes Muss ist
  (INVOIC/QUOTES, Code Z01), wird die C212 mit Formularwert bzw. gültiger
  BDEW-Artikelnummer (9990001000053) erzeugt.
* Die APERAK-Seite schrieb `+00` in DTM-Werten UNMASKIERT (ohne `?`-Escape) —
  das Plus zerriss das Segment (DE2379 rutschte ins falsche Element). Behoben
  (`?+00`); die zentrale Engine escapt korrekt über `edi()`.

**Verlässlichkeitsgrenze der Extraktion (Kunden-NAD).** Der Komponententest
deckte auf, dass der DECODER-Fallback zu weit griff: Im Kunden-NAD (Z65–Z70)
markiert die AHB-Extraktion die Adress-DE (Straße/Ort/Land) flach mit „X" bzw.
„M", obwohl die eigentliche Blockbedingung nur am Geschwister-DE PLZ erhalten
blieb („M [268] S [166]") — Name ohne Anschrift ist dort zulässig. Der Fallback
wertet freie Wert-DE deshalb nur in den führenden Elementen (Qualifier +
Hauptwert: IDE DE7402, NAD DE3039, DTM C507 …) als Pflicht; positionsgenaue
Instanzangaben (STS-Pfad) und codierte DE bleiben unverändert scharf.

**Nachweis.** Fuzz-Matrix 55658: 15/15 Mutationen werden gemeldet (vorher 11/15).
`test_de_muss_praesenz.js` erweitert (DECODER-Fallback-Wirkung, dokumentierte
Befundfamilien als Allowlist): 553 Prüf-IDs, 0 Fehlalarme, 76/76, 18/18.
Referenz-Suite: 23/23 Dateien, 1491/1491 Einheiten, weiterhin 0 Fehler (nun mit
aktiven af-/Codelisten-Schichten). Antwortketten 35/35, Folgenachrichten 80/80, Validator-Komponenten 20/20.
Regression grün.

## 69. Nutzerauszug 55658: leeres NAD+Z46 — Fallback-Grenze um den Namen korrigiert (13.08.2026)

**Auftrag.** Analyse eines UTILMD-Auszugs (PID 55658, Verwendungszeiträume mit
RFF+Z47/DTM+Z25/Z26 und Kunden-Zuordnung NAD+Z46 → RFF+Z46), Fehler aufzeigen.

**Analyse.** Der Auszug ist bis auf EINE Stelle korrekt: BGM+Z88 ist für 55658
zulässig (E03/Z88), die Zeitraum-IDs stehen richtig in DE1156 (RFF+Z47::1/::2),
die Referenzen darauf richtig in DE1154 (RFF+Z46:1/:2), C080-Aufbau
(Duck:Donald::::Z01) und C059-Aufbau (Gänseweg::13:Badeteich — Hausnummer an
Komponente 3, Ortsteil an 4, AF 2.17) stimmen; ein offener zweiter Zeitraum
(nur DTM+Z25) ist zulässig. Der Fehler: das ZWEITE `NAD+Z46'` ist LEER — der
Name (C080/DE3036) ist laut AHB Muss; dem zweiten Verwendungszeitraum ist damit
kein Kunde zugeordnet.

**Befund am Validator.** Auch nach Abschnitt 68 blieb dieses leere NAD+Z46 grün:
die dort eingezogene Verlässlichkeitsgrenze des DECODER-Fallbacks (freie Wert-DE
nur bis Element 2) schloss den NAMEN (C080/DE3036, Element 3) mit aus, obwohl
nur die ANSCHRIFT-Elemente (ab C059) von der flachen X/M-Extraktion betroffen
sind. Grenze auf „bis einschließlich Element 3" korrigiert: `NAD+Z46'` meldet
jetzt „Pflichtangabe DE3036 (Name) fehlt"; Name-ohne-Anschrift (Z66–Z70) bleibt
korrekt unbeanstandet.

**Nachweis.** Nutzerauszug (in Golden-Träger rekonstruiert): genau 1 Fehler am
leeren NAD+Z46. Gegenproben: Kunden-NAD name-only weiter grün, Fuzz 15/15,
553 PIDs ohne Fehlalarm, Komponenten 20/20, Antwortketten 35/35, Referenz-Suite
23/23 (1491 Einheiten, 0 Fehler). Regression grün.

## 70. Sicherheits- und Vollständigkeitsaudit: Code, alle 553 PIDs (13.08.2026)

**Auftrag.** Für jede Prüf-ID: Code auf Bugs und mögliche Angriffs-Schwachstellen
prüfen; danach je Datensegment einer EDIFACT-Nachricht Abhängigkeiten, erlaubte
Zeichen, Syntax und fachliche Korrektheit eingehend prüfen.

**Befund 1 — DOM-XSS in Validator und Umbau (behoben).** `validator.html` und
`umbau.html` prüfen bewusst auch nicht vertrauenswürdige Dateien (Nachrichten von
Marktpartnern). Die Erkennungs-/Meldungsboxen bauten mehrere Anzeigepfade per
`innerHTML` direkt aus Nachrichteninhalt zusammen — UNH-Nachrichtentyp/-Kennung,
RFF+Z13-Prüf-ID, BGM-Dokumentennummer (Mehrfachansicht), das unvollständige
Rest-Segment am Dateiende — ohne HTML-Escaping. Eine präparierte Nachricht
(z. B. `UNH+1+<img src=x onerror=…>:D:…'`) führte damit beim Prüfen/Einlesen zu
Skriptausführung im Seitenkontext. Mit Playwright nachgestellt und bestätigt
(vier unabhängige Auslösewege, `alert()` wurde real ausgelöst). `_engine/
import-pruefung.js` (Importprüfung der 19 Generatorseiten) und `_engine/
folgenachrichten.js` escapen bereits durchgehend über eine eigene `esc()` —
betroffen waren ausschließlich die beiden allgemeinen Werkzeuge. Behoben mit
einer zentralen `esc()`-Funktion in `validator.html`/`umbau.html`, angewandt an
jeder Einfügestelle mit Nachrichteninhalt (Erkennung, globale Meldungen,
Segmentliste, Mehrfachansicht). Regressionstest `scripts/test_html_escaping.js`
(vier Auslösewege, 5/5).

**Befund 2 — fehlendes Release-Zeichen-Escaping bei RNG/MEA/PRI (behoben).**
Freie Eingabefelder ohne Codeliste werden vor der Ausgabe über `edi()`
release-zeichen-escaped, damit ein EDIFACT-Sonderzeichen im Feld die Nachricht
nicht syntaktisch zerstört. Bei RNG (DE6162/6152, Bereichsangabe — u. a. QUOTES/
PRICAT Mengenangaben) und MEA (DE6314, Maßwert) fehlte dieser Schritt; anders
als bei den strukturell gleichartigen QTY/MOA/PCD/TAX (dort fängt eine
vorgeschaltete `isNaN()`-Prüfung dasselbe Problem ab) gibt es dort keine
numerische Prüfung. Ein Apostroph im Feld (z. B. „123'999" als Tausendertrenner
getippt) brach das Segment mitten im Wert ab und zerlegte den Rest der
Nachricht in Fragmente. Mit Playwright an PID 15005 (QUOTES) nachgestellt:
`RNG+Z03+H87:123'999'` wurde zu zwei Fragmenten zerlegt. MEA wird nach
aktueller Prüf-ID-Datenlage von keiner der 553 Prüf-IDs erzeugt (toter Code,
kein akuter Auslöseweg) — für den Fall künftiger AHB-Erweiterung dennoch
korrigiert. PRI (DE5284/6411 Basis/Einheit) ergänzt aus demselben Grund
vorsorglich, da die Engine dort ohne Codeliste ebenfalls ein freies Feld
rendert. Regressionstest `scripts/test_edi_escaping.js` (Gegenprobe über
`AhbValidator.parse()`, release-zeichen-bewusst, 5/5).

**Befund 3 — doppeltes NAD+MS/NAD+MR wird nicht erkannt (behoben).** Die
bestehende Wiederholungsprüfung (Abschnitt 68) erfasst nur Instanzen OHNE
Segmentgruppe — Gruppeninstanzen bleiben bewusst außen vor, weil ihre
Wiederholung die Wiederholung eines Vorgangs sein kann. NAD+MS/NAD+MR
(Marktpartner-Identität Absender/Empfänger, Allg. Festlegungen Kap. 2.13)
sitzen aber vor jeder Vorgangsschleife und dürfen unabhängig von ihrer
SG-Zuordnung in der AHB-Extraktion nicht mehrfach vorkommen — ein Duplikat
blieb unbeanstandet, weil beide Vorkommen derselben AHB-Instanz zugeordnet
wurden. Mit einem Mutationslauf über alle 553 PIDs bestätigt (dupliziertes
gruppiertes Pflicht-Segment mit MIG-Wiederholung 1 — 553/553 nicht erkannt vor
der Korrektur). Behoben mit einer eigenen, engen Prüfung unabhängig von der
Instanz-Zuordnung (zählt NAD+MS/NAD+MR direkt je Nachricht); nach der Korrektur
553/553 erkannt.

**Übrige Prüfpunkte ohne Befund.** Code-Review von `ahb-validator.js`
(Parser, alle Regex auf ReDoS-Muster — durchweg mit fester Ober- oder
Ziffernbegrenzung, keine verschachtelten unbegrenzten Quantoren über
überlappenden Zeichenklassen), `ahb-form-engine.js`, `umbau.js`, `tests/
harness.js`: kein `eval`/`new Function` auf Nachrichteninhalt, kein
`document.write` mit nicht whitelist-geprüften Werten (`_engine/stand.js`
liest `?stand=` nur gegen eine feste Werteliste), keine Prototype-Pollution-
Muster (keine dynamische `obj[fremderSchlüssel]=…`-Zuweisung aus
Nachrichteninhalt). Antwort-Weiterleitung (`#antwort=<JSON>`, validator.html →
Generatorseiten) setzt Werte ausschließlich über `element.value=…`, nicht über
`innerHTML` — kein zusätzlicher Injektionsweg. Je-Segment-Prüfung (Zeichen-
/Format-Vorgaben, Abhängigkeiten, fachliche Korrektheit) über alle 553 PIDs:
Mutationssweep auf fehlende Muss-Segmente/-Datenelemente unverändert 0 falsche
Freigaben (Abschnitt 68/69 bereits geschlossen); Referenz-Suite an den 23
echten Marktnachrichten (1491 Einheiten) weiterhin 0 Fehler.

**Nachweis.** `scripts/test_html_escaping.js` 5/5, `scripts/
test_edi_escaping.js` 5/5, NAD+MS/MR-Mutationssweep 553/553 (vorher 0/553),
volle Regression grün (37 Läufe inkl. der beiden neuen Tests), Referenz-Suite
23/23 Dateien · 1491/1491 Einheiten · 0 Fehler-Befunde.

## 71. Ablehnungs-Abgleich: neg. CONTRL gegen abgelehnte Nachricht (13.08.2026)

**Auftrag.** "kannst du eine weitere Maske bauen, in der man auf der einen
Seite (links) eine abgelehnte Nachricht und auf der anderen Seite (rechts) die
neg. CONTRL oder neg APERAK anlegt und dann die Fehlermeldung aus der neg.
CONTRL / neg APERAK ausliest, in der abgelehnten Nachricht aufzeigt (quasi das
Segment und Datenelement...) und diesen 'Fehler' gleich mit auf die AHB/MIG
prüft (...) und sich damit die neg. Meldung bestätigt oder auch unberechtigt
ist?" — zunächst auf Machbarkeit geprüft (siehe Gesprächsverlauf), dann auf
ausdrücklichen Wunsch ("erst CONTRL, danach APERAK") in zwei Schritten
umgesetzt. Dieser Abschnitt deckt den ersten Schritt (CONTRL) ab; APERAK folgt
als eigenständige Erweiterung.

**Warum CONTRL zuerst gut automatisierbar ist.** Die CONTRL-Syntaxfehlermeldung
trägt einen vollständig strukturierten Fehlerzeiger: SG1 UCM (DE0062 = UNH-
Referenz der betroffenen Nachricht), SG2 UCS (DE0096 = Segmentposition,
1-basiert, Zählung beginnt bei jedem UNH neu bei 1 — exakt dieselbe Zählweise,
die der eigene Validator bereits für seine Segmentliste verwendet, siehe
Abschnitt-Vermerk in `test_validator_komponenten.js`), UCD (DE0098/DE0104 =
Datenelement-/Komponentenposition innerhalb des Segments). Bei der APERAK ist
der einzige dafür vorgesehene Platz (FTX+Z02, "Ortsangabe des AHB-Fehlers")
Freitext ohne feste Struktur — dort bleibt nur eine Vorgangs-Eingrenzung über
RFF+ACE/AGO/TN plus eine unterstützende, nicht abschließende Auswertung
möglich.

**Neue Seite `ablehnung-abgleich.html`.** Zwei Spalten: links die abgelehnte
Original-Nachricht (Import wie bei validator.html/umbau.html: Drag&Drop,
Dateiauswahl, Einfügen), rechts die erhaltene negative CONTRL. Beide Seiten
werden unabhängig mit dem bestehenden Validator-Kern geprüft (`AhbValidator`,
dieselbe Erkennungs-/Prüflogik wie `validator.html`). Aus der CONTRL werden UCI
(Datei-Ebene: DE0083 Annahme/Ablehnung, DE0085 Fehlercode), alle SG1 UCM-Blöcke
und ihre SG2 UCS/UCD-Einträge strukturiert ausgelesen. Für jeden UCS/UCD-Zeiger
wird die passende Original-Nachricht (per UNH-Referenz) sowie darin die
gezeigte Segmentposition und — über eine Umkehrung der bestehenden
`AhbValidator.DECODER`-Tabelle — die betroffene DE-Nummer ermittelt. Das
Ergebnis wird dem unabhängigen Validator-Befund an genau dieser Stelle
gegenübergestellt und in eine von vier Kategorien eingeordnet: Datenelement-
und Stichwort-Treffer ("bestätigt"), Segment-Treffer ohne exakte DE-Übereinstim-
mung ("bestätigt"), Befunde am Segment aber nicht an der genannten Position
("unklar, ungenaue Positionsangabe") sowie kein eigener Befund an der Stelle
("unklar, nicht nachvollziehbar"). Ein Klick auf "im Segmentbaum zeigen"
scrollt zur betroffenen Zeile in der linken Segmentliste und hebt sie kurz
hervor. Randfälle werden eigens behandelt: Ablehnung auf Datei-Ebene ohne UCM
(kein Segmentbezug möglich), UCM ohne UCS/UCD (nur Nachrichtenebene, alle
Befunde der Nachricht als Kandidatenliste), CONTRL-Referenz ohne Entsprechung
links ("nicht zugeordnet"), CONTRL bestätigt ohne Einwände sowie ein rechts
eingefügtes Dokument, das gar keine CONTRL ist.

**Segmentzählung: bewusst OHNE Vorgangs-Filterung.** `validator.html`s
`baueEinheiten()` zerlegt UTILMD-Nachrichten mit mehreren Vorgängen in
gefilterte, neu serialisierte Mini-Nachrichten je Vorgang — für die
AHB-Prüfung richtig, würde hier aber Segmente herausfiltern und die Zählung
gegenüber der realen CONTRL-Referenz (die immer die vollständig übertragene
Nachricht zählt) verschieben. Der Abgleich verwendet daher eine eigene
`zerlegeNachrichten()`, die ausschließlich nach UNH…UNT-Grenzen zerlegt, nie
nach Vorgang. Bekannte Einschränkung: bei UTILMD-Nachrichten mit mehreren
Prüf-IDs in einem UNH wird nur die zuerst erkannte Prüf-ID für Muss-/Code-
Prüfungen herangezogen; rein syntaktische Prüfungen (Format, Aufbau,
Wiederholung) bleiben davon unberührt.

**Datenpflege.** Die DE0085-Fehlercode-Liste (UNTDID 0085) war bisher eine
Konstante direkt im CONTRL-Generator; sie wurde nach `_engine/daten/
uci-fehlercodes.js` ausgelagert, damit beide Seiten dieselbe Quelle nutzen statt
einer zweiten, potenziell abweichenden Kopie zu pflegen.

**Verlinkung.** Von der Startseite (neue Kachel "Ablehnung abgleichen (neg.
CONTRL)") sowie vom CONTRL-Generator aus erreichbar.

**Nachweis.** Neuer Regressionstest `scripts/test_ablehnung_abgleich.js`
(16 Prüfungen): korrekte Segmentnummerierung/-markierung links, Fall
"Treffer bestätigt" (CONTRL-Zeiger auf NAD+Z63/DE3124, identischer Befund wie
in Abschnitt 68), Fall "nicht nachvollziehbar" (Zeiger auf unbeanstandetes
Segment), Fall "nicht zugeordnet" (falsche UNH-Referenz), Fall "kein
Segmentbezug" (Ablehnung auf Dateiebene ohne UCM), Fall "Empfang bestätigt"
(CONTRL ohne Einwände), Fall "kein CONTRL" (Fehlermeldung statt Absturz),
Hervorhebung per Klick, Leeren-Button, Datei-Import — alle 16/16 grün, keine
Konsolen-/Seitenfehler. Volle Regression grün (38 Läufe).

## 72. Ablehnungs-Abgleich: Nutzer-Feedback nach erster Erprobung (13.08.2026)

**Rückmeldung.** Nach der ersten Auslieferung (Abschnitt 71) drei konkrete
Punkte: (1) der separate Schalter "Nachricht prüfen" sei überflüssig, der
rechte Schalter solle "neg. CONTRL gegen Nachricht prüfen" heißen und den
kompletten Ablauf übernehmen; (2) das Ergebnisfenster zeige auch das
fehlerhafte Segment grün — ein roter Rahmen mit sprechender Zusatzangabe wäre
sinnvoller; (3) Machbarkeit einer einfachen Positionsprüfung statt vollem
AHB-Abgleich, am Beispiel einer MSCONS 13017 mit `PIA+5+:SRW'` (Kennzahlart
SRW = OBIS belegt, die Kennzahl selbst leer) — "hier fehlt die
OBIS-Kennzahl".

**1) Ein Prüfen-Schalter.** Der Schalter "Nachricht prüfen" (links) entfällt.
Der rechte Schalter heißt jetzt "neg. CONTRL gegen Nachricht prüfen" und ruft
`pruefeAlles()` auf (`pruefeLinks()` gefolgt von `pruefeRechts()`, das seinerseits
den Abgleich aktualisiert). Datei-Import auf beiden Seiten (Drag&Drop wie
Dateiauswahl) löst denselben kombinierten Ablauf aus, nicht mehr nur die
jeweils eigene Seite — ein Import allein reicht damit für ein vollständiges
Ergebnis, sofern die andere Seite bereits befüllt ist.

**2) Persistente Segmentmarkierung statt Kolorierung durch den Validator
allein.** Das von der CONTRL benannte Segment wird im linken Segmentbaum jetzt
unabhängig von seiner Grün/Rot-Einfärbung dauerhaft mit einem roten Rahmen
(`.seg.ziel-contrl`) markiert, sobald der Abgleich es einer CONTRL-Position
zuordnen konnte — sichtbar bleibt außerdem, ob der Validator selbst (grüner
oder roter Hintergrund) dort etwas findet. Zusätzlich wird direkt am Segment
eine sprechende Zusatzzeile (⚑) mit dem CONTRL-Fehlercode und der konkreten
Ursache eingefügt. Beide Marker werden bei jedem neuen Abgleich zuerst
zurückgesetzt, damit nichts von einer vorherigen CONTRL-Auswertung stehen
bleibt.

**3) Generische (AHB-unabhängige) Positionsprüfung als Rückfallebene.**
Machbarkeit bestätigt: Da der Abgleich die von UCS/UCD benannte Element-/
Komponentenposition bereits aus dem geparsten Original-Segment auflöst, lässt
sich dort unmittelbar prüfen, ob der Rohwert leer ist — unabhängig davon, ob
der AHB-Validator für genau diese Stelle eine eigene Geschäftsregel kennt.
Neue Funktion `generischeWertPruefung()`: liest den Rohwert an der Zielposition,
meldet eine Leerstelle und benennt bei einer erkennbar teilbelegten Gruppe
zusätzlich die anderen belegten Komponenten (z. B. "Komponente 1 ist leer,
obwohl … Komponente … belegt ist"). Fließt in die Einordnung ein: findet der
Validator dort nichts, aber die generische Prüfung eine Leerstelle, wird das
Ergebnis trotzdem als "bestätigt" geführt (mit dem Hinweis "unabhängig von
AHB-Geschäftsregeln"), statt als "nicht nachvollziehbar" zu erscheinen. Mit
COM+DE3148 (leer, DE3155 „EM" belegt) verifiziert — dafür existiert keine
eigene Validator-Regel; das Segment bleibt grün, wird aber trotzdem korrekt
als CONTRL-Ziel gerahmt und "bestätigt" eingeordnet.

**Zusätzlich: echte Validatorlücke geschlossen (PIA/LIN DE7140).** Das
Beispiel der Nutzerin/des Nutzers (`PIA+5+:SRW'`) erwies sich nicht nur als
Beleg für die generische Prüfung, sondern deckte eine reale Lücke im
Kernvalidator auf: `pruefeCodelisten()` prüfte DE7140 (Kennzahl/Artikelnummer)
bislang ausschließlich dann, wenn ein Wert vorhanden war (`if (v) { … }`) — war
DE7140 leer, während DE7143 (Kennzahlart, z. B. "SRW" = OBIS-Kennzahl, siehe
`ahb-form-engine.js`) belegt war, blieb das unbeanstandet, obwohl C212 eine
Wertepaar-Gruppe ist. Behoben mit einer eigenen Prüfung vor der bestehenden
Logik: `!v && liste` meldet "DE7140 fehlt, obwohl DE7143 … eine Kennzahlart
angibt", mit ausgeschriebenem Klartext für den Sonderfall SRW/OBIS. Damit
erkennt jetzt bereits der Kernvalidator (nicht erst die generische
Rückfallebene) das Beispiel aus der Rückmeldung.

**Nachweis.** Mit einer über den MSCONS-Generator erzeugten, danach an DE7140
manuell geleerten PID-13017-Nachricht und einer passenden neg. CONTRL end-to-
end verifiziert: Kernvalidator meldet "DE7140 fehlt …" eigenständig, der
Abgleich stuft die Stelle als "bestätigt" ein, das Segment ist im linken Baum
rot UND zusätzlich mit dem CONTRL-Rahmen markiert. Der COM-Fall (siehe oben)
belegt getrennt davon die rein generische Rückfallebene. Regressionstest
`scripts/test_ablehnung_abgleich.js` um 10 Prüfungen auf 26/26 erweitert
(Schalter-Entfernung/-Umbenennung, kombinierter Ablauf, persistente
Markierung, generischer Fall). Volle Regression grün (38 Läufe), Golden-
Snapshots und Selbstvalidierung unverändert (130/105/134/106 dokumentierte
Befunde wie vor dem Fix — keine neuen Fehlalarme durch die PIA/LIN-Änderung),
Referenz-Suite an den 23 echten Marktnachrichten weiterhin 23/23 · 1491/1491
Einheiten fehlerfrei (0 neue Befunde durch den PIA/LIN-Fix).

## 73. Ablehnungs-Abgleich: Segmentbaum ohne Flächenfarbe, exakte Fehlerposition markiert (13.08.2026)

**Rückmeldung.** Nach Abschnitt 72 weiteres Feedback: Grün- bzw. Rot-
Flächenfarbe je Segment im linken Baum sei für das Aufzeigen einer
Fehlerposition unzweckmäßig und unübersichtlich — komplett rot eingefärbte
Segmente mit zusätzlich roter Schrift seien ebenfalls nicht hilfreich.
Gewünscht: fehlerfreie Segmente „normal" je Farbschema, fehlerhaft erkannte
Segmente mit etwas dickerem rotem Rahmen statt Flächenfarbe, und im besten
Fall die exakte Fehlerposition innerhalb des Segments rot markiert (Beispiel
des Auftraggebers: eine neg. CONTRL mit `UCS+12'UCD+13+6:1'` verweist auf ein
Segment `Z02++++DE'` — markiert werden sollten genau die beiden `++` an der
leeren Stelle). Auftrag ausdrücklich auf die Punkte 1 (Rahmen statt Fläche), 2
(exakte Position im Abgleich-Kasten) und 4 (Doku/Tests) begrenzt; Punkt 3
(dieselbe Positionsmarkierung zusätzlich direkt im Segmentbaum, inkl.
Erweiterung von `AhbValidator.parse()` um Zeichen-Offsets) bewusst
zurückgestellt.

**Machbarkeit (vorab geprüft, siehe Rückmeldung an den Auftraggeber).**
`validator.html` verwendet dasselbe Grün-/Rot-Fill-Muster wie
`ablehnung-abgleich.html` — hier bewusst nicht mit angefasst, da nicht
Gegenstand des Auftrags. Es existierte bereits ein rahmenbasierter Marker
(`.seg.ziel-contrl`, 2px) für das von der CONTRL benannte Segment — Vorbild für
die neue einheitliche Rahmen-Optik. Für die exakte Position liegen Element-/
Komponentenindex (`el0`/`comp0`) im Abgleich-Kasten bereits aus dem CONTRL-
Zeiger vor (UCD DE0098/DE0104); es fehlte nur die Übersetzung in eine Zeichen-
Position im rohen Segmenttext.

**Umsetzung Punkt 1 (Segmentbaum-CSS).** `.seg.ok` und `.seg.rot` verlieren
ihre Flächenfarbe (`--ok-bg`/`--warn-bg`) und Textfarbe; Basis-`.seg` bekommt
stattdessen normale Text-/Hintergrundfarbe (`--text`/transparent) und eine von
2px auf 3px verbreiterte, standardmäßig transparente Rahmenbreite. `.seg.rot`
und `.seg.ziel-contrl` färben jetzt beide nur noch den Rahmen (`--warn`) statt
der Fläche — ein Segment kann beides gleichzeitig sein (eigener
Validator-Befund UND CONTRL-Ziel), das ergibt keinen Konflikt, da beide
denselben Rahmen setzen. Fehlermeldungen (`.seg .meld`) bleiben bewusst rot
(`--warn`, statt der bisherigen, auf Rot-Fill abgestimmten `--warn-text`) –
das ist die eigentliche Nutzinformation; Hinweise (`.seg .hin`) wechseln auf
neutrales Grau (`--muted`) statt der bisherigen Grün-/Rot-Vererbung. Die
Hervorhebungsregel `.seg.hervorgehoben` (Sprungziel "im Segmentbaum zeigen")
steht jetzt zuletzt in der Kaskade, damit sie auch auf einem bereits roten
Segment sichtbar bleibt (vorher gleiche Selektor-Spezifität wie
`.seg.ziel-contrl`, das als späterer Selektor im Stylesheet gewonnen hätte).

**Umsetzung Punkt 2 (exakte Position im Abgleich-Kasten).** Neue Funktion
`positionInSegment(raw, servicezeichen, el0, comp0, ganzesElement)`: läuft den
rohen (nicht entschärften) Segmenttext zeichenweise ab — dieselbe Trenner-/
Freistellungslogik wie `AhbValidator.parse()`, hier bewusst ein zweites Mal
lokal für diese eine Ansicht (siehe Hinweis zu Punkt 3 unten) — und liefert
Start-/Endposition des benannten Elements bzw. der benannten Komponente.
`ganzesElement=true` (wenn die CONTRL nur DE0098 ohne DE0104 nennt) markiert
das komplette Element statt nur dessen erste Komponente. Ist die getroffene
Stelle leer (der Regelfall bei einer fehlenden Pflichtangabe — auch im
Beispiel des Auftraggebers), erweitert `erweitereBeiLeer()` die Markierung um
je ein umschließendes Trennzeichen, damit überhaupt etwas sichtbar ist — genau
das vom Auftraggeber vorgeschlagene Verhalten. `zielsegmentHtml()` baut daraus
den Kasten mit `<mark class="fehlerpos">` um den Treffer; ist die Position
nicht auflösbar, Fallback auf den unveränderten Rohtext wie bisher.

**Nachweis.** Mit der bestehenden Fixtur aus Abschnitt 71/72 verifiziert:
Segment 24 (`NAD+Z63`) hat ein leeres DE3124 (Element 3, Komponente 1,
0-basiert `el0=2`, `comp0=0`) — `positionInSegment` liefert eine leere Spanne
zwischen dem zweiten `+` und dem folgenden `:`, nach Erweiterung wird exakt
`+:` markiert (Screenshot in Hell und Dunkel geprüft). Zusätzlicher Testfall
mit CONTRL-Zeiger ohne Komponentenangabe (`UCD+13+1'` statt `UCD+13+1:1'`)
bestätigt, dass dann das ganze Element (`:EM`, beide Komponenten von
`COM+:EM'`) markiert wird statt nur die erste Komponente. CSS-Regression prüft
zusätzlich per `getComputedStyle`, dass ein fehlerfreies Segment (UNH) ohne
farbigen Rahmen/Fläche bleibt und ein fehlerhaftes Segment (NAD+Z63) einen
3px breiten, farbigen Rahmen bei transparenter Fläche bekommt. Regressionstest
`scripts/test_ablehnung_abgleich.js` um 9 Prüfungen auf 34/34 erweitert
(CSS-Kontrast, `<mark>`-Position mit und ohne Erweiterung, ganzes Element).
Volle Regression grün (38 Läufe), Golden-Snapshots und Selbstvalidierung
unverändert (130/105/134/106 dokumentierte Befunde), Referenz-Suite weiterhin
23/23 · 1491/1491 Einheiten fehlerfrei — die Änderung betrifft ausschließlich
`ablehnung-abgleich.html` und ihren eigenen Test, keine Prüfgrundlage.

**Offen (Punkt 3, zurückgestellt).** Dieselbe zeichengenaue Markierung
zusätzlich direkt im Segmentbaum links: erfordert, den rohen Segmenttext dort
in einen referenzierbaren `<span>` einzuwickeln (kosmetisch neutral) sowie —
im Sinne der Konvention, keine Insellösung neben dem zentralen, bereits
sicherheitsgeprüften Parser zu bauen — die Zeichen-Offset-Logik aus
`positionInSegment()` in `AhbValidator.parse()` selbst zu heben, statt sie ein
zweites Mal nur für diese Seite zu pflegen.

## 74. CONTRL-Codelisten maschinell; Falschbefund „RFF+TN fehlt" an pos. APERAK (13.08.2026)

**Rückmeldung.** Zwei Punkte aus der Erprobung mit echten Marktnachrichten:
(1) Die CONTRL-Fehlercodes sollten aus AHB/MIG geholt und hinterlegt werden —
eine real erhaltene CONTRL mit DE0085 = 26 („Duplikat vorhanden") lief ohne
Klartext durch. (2) Bei genau dieser CONTRL auf eine **positive APERAK** meldete
der Abgleich „Fehlende Muss-Segmente laut AHB: RFF+TN…". Das ist sachlich falsch:
In der APERAK sind die Referenzsegmente RFF+ACE/AGO (bzw. RFF+AVE) maßgeblich,
ein RFF+TN ist dort nicht generell Pflicht — es liegt also gar kein Syntaxfehler
vor, den der Validator hätte melden dürfen.

### 74.1 Codelisten: von 12 kuratierten auf 22 maschinell gelesene Codes

**Befund.** `_engine/daten/uci-fehlercodes.js` enthielt eine von Hand gepflegte
Liste von 12 „gängigen" Codes — entgegen der Projektkonvention, Prüfgrundlagen
maschinell aus den Originaldokumenten zu lesen. Die Gegenprobe gegen den MIG
CONTRL zeigte nicht nur Lücken, sondern **inhaltliche Fehler**:

| Code | bisher (kuratiert) | MIG CONTRL (Original) |
|---|---|---|
| 28 | „Ungültige Segmentreihenfolge" | **„Referenzen stimmen nicht überein"** |
| 7 | „Ungültiger Absender/Empfänger" | „Empfänger der Übertragungsdatei ist nicht der tatsächliche Empfänger" |
| 26 | *fehlte ganz* | „Duplikat gefunden" |
| 15, 19, 20, 23, 25, 29, 32, 36, 37, 38 | *fehlten ganz* | — |

Der Fehler bei Code 28 wirkte doppelt: Die Stichwortzuordnung `CODE_STICHWORT`
im Ablehnungs-Abgleich suchte für 28 nach „nicht vorgesehen|Aufbau prüfen" —
Muster, die zu „Ungültige Segmentreihenfolge" passen, aber nicht zum tatsächlich
gemeinten UNB/UNZ-Referenzabgleich. Der Abgleich konnte einen echten Treffer
also gar nicht als solchen erkennen.

**Umsetzung.** Neues Werkzeug `werkzeuge/lies_contrl_fehlercodes.py` liest die
Codelisten aus der Segmentlayout-Tabelle des MIG CONTRL. Wesentlich dabei: Die
Liste ist **je Segment verschieden** — DE0085 führt im UCI (Übertragungsdatei),
UCM (Nachricht), UCS (Segment) und UCD (Datenelement) unterschiedliche Codes und
Erläuterungen. Code 26 meint im UCI ein Duplikat der ÜBERTRAGUNGSDATEI, im UCM
ein Duplikat der NACHRICHT. Ausgabe deshalb als `contrlCodelisten[segment][de]`
mit Eintragsformat `[code, Bezeichnung, Erläuterung]`, dazu `contrlFehlereintrag()`
für den segmentgenauen Nachschlag mit Rückfall auf die Vereinigung. Die flache
`uciFehlercodes0085` bleibt für den CONTRL-Generator (Dropdown) erhalten.
Ergebnis: UCI 13, UCM 9, UCS 6, UCD 10 Codes; Vereinigung 22 statt 12.

Der Ablehnungs-Abgleich schlägt jetzt je Ebene nach (UCI/UCM/UCS/UCD), zeigt die
MIG-Erläuterung unter dem Fehlercode und macht einen Code, den die MIG **gar
nicht führt**, ausdrücklich kenntlich („Code nicht in der MIG-Codeliste geführt —
bitte beim Absender klären") statt ihn wie bisher stumm leer zu lassen. Das ist
selbst ein Befund: Ein Marktpartner, der einen im deutschen Marktprozess nicht
vorgesehenen Code sendet, ist auffällig. `CODE_STICHWORT` wurde vollständig an
den echten MIG-Wortlaut angeglichen und um die neuen Codes ergänzt.

### 74.2 Der Falschbefund: fehlender Segmentgruppen-Status wurde als „Muss" gelesen

**Reproduktion.** Eine gültige positive APERAK (BGM+312, SG2 mit RFF+ACE, DTM+171
und RFF+AGO, ohne SG4/SG5) durch `besteVariante` → `fehlendeMuss: ["RFF+TN
(Referenznummer des Vorgangs)"]`. Befund bestätigt.

**Quellenlage.** Der AHB APERAK (Lesefassung 1.0, Ordner Wissensdatenbank) führt
die beiden Anwendungsfälle „Fehlermeldung" und „Anerkennungsmeldung" in
nebeneinanderliegenden Spalten. Für das dritte SG2-RFF (Zähler 00007, RFF+TN)
steht dort als Gruppenstatus **„Soll [16]"** mit `[16] Wenn der referenzierte
Nachrichtentyp IFTSTA ist …` — und die Spalte des einen Anwendungsfalls ist
überhaupt nicht belegt. RFF+TN ist dort also weder unbedingtes Muss noch
überhaupt in beiden Anwendungsfällen vorgesehen.

**Ursache im Code.** In den APERAK-/CONTRL-Formular-Metas ist `sgExpr` (der
AHB-Status der Segmentgruppe) bei **allen** Instanzen `null` — die Spaltenstruktur
des Servicenachrichten-AHB hat der Extraktor nicht getrennt. Der Validator las
das über den Rückfall

```js
const grpKlasse = sgExpr ? mussKlasse(sgExpr) : "hart";
```

als „Gruppe ist unbedingtes Muss". Der Rückfall war für Segmente auf
**Nachrichtenebene** gedacht (UNH/BGM/DTM — die haben gar keine Gruppe), griff
aber genauso für Segmente INNERHALB einer Segmentgruppe, deren Gruppenstatus
schlicht nicht extrahiert wurde. Aus „unbekannt" wurde damit „Pflicht".

**Umfang (Sweep über alle 36 Formular-Metas, Konvention „beispielhaft heißt alle
Prüf-IDs").** 22.463 Segmentinstanzen; 5.080 davon stehen in einer Segmentgruppe,
tragen hartes Muss und haben kein `sgExpr`. Diese 5.080 pauschal zu entschärfen
hätte echte Muss-Prüfungen blind gemacht. Die datengetriebene Unterscheidung
trennt sauber:

| | Varianten | Risiko-Instanzen | Bedeutung |
|---|---:|---:|---|
| A: **kein einziges** `sgExpr` trotz Segmentgruppen | **10** | 22 | Gruppenstatus für dieses Dokument nicht extrahiert → unbekannt |
| B: `sgExpr` teilweise vorhanden | 915 | 5.058 | Extraktion funktioniert; fehlendes `sgExpr` heißt „Gruppe ohne eigenen Status" → Rückfall korrekt |

Gruppe A sind **exakt** die Servicenachrichten APERAK und CONTRL in beiden
Formatständen — nichts sonst.

**Korrektur (auf Regelebene, nicht PID-spezifisch).** Der Validator ermittelt je
Prüfgrundlage einmal `gruppenStatusBekannt` (trägt irgendeine Instanz mit
Segmentgruppe ein `sgExpr`?). Ist er *nicht* bekannt, wird ein Segment innerhalb
einer Segmentgruppe nicht mehr als fehlendes unbedingtes Muss gemeldet, sondern
als bedingtes Muss mit sprechendem Text geführt: „Pflicht nicht entscheidbar: Der
AHB-Status der Segmentgruppe SG2 ist in der Prüfgrundlage nicht hinterlegt". Die
Regel greift nur beim UNBEDINGTEN Segment-Muss — trägt das Segment selbst eine
Bedingung („Muss [1]"), entscheidet weiterhin die Bedingungsauswertung, die kein
`sgExpr` braucht. Sie ist selbstheilend: Sobald die Servicenachrichten-Extraktion
nachgezogen ist, greift sie automatisch nicht mehr.

Zusätzlich zeigte die Seite `ablehnung-abgleich.html` bedingte Muss-Segmente
bisher **gar nicht** an (anders als `validator.html`) — der neue Hinweis wäre
unsichtbar geblieben. `globalHtml()` gibt sie jetzt als gelbe Box aus (klar von
Rot = echter Fehler unterschieden).

**Nachweis.** Vorher/Nachher-Sweep über **alle 925 Varianten** beider Formatstände
mit je einer Nachricht, die jede Segmentgruppe aktiviert (sonst greifen die
Gruppenregeln nicht — die erste Sweep-Fassung lief deshalb ins Leere und wurde
verworfen): **923 Varianten bit-identisch**, 2 verändert — die beiden
APERAK-Varianten 202604, dort je 9 → 2 harte Fehler, der Rest als Hinweis. CONTRL
und APERAK 202610 bleiben unverändert, weil dort alle `expr` leer sind und
ohnehin keine Muss-Prüfung stattfindet. Kernprüfungen unverändert grün
(`test_muss_validierung`, `test_bedingung_hart`, `test_abhaengige_segmente`,
`test_de_muss_praesenz` 76/76 · 18/18). Neue Regression
`scripts/test_contrl_codelisten.js` und Fall H in
`scripts/test_ablehnung_abgleich.js` decken den gemeldeten Fall end-to-end ab.

**Offen (Folgearbeit).** Die eigentliche Wurzel bleibt die Extraktion der
Servicenachrichten-AHB: Für APERAK/CONTRL fehlen Segmentgruppen-Status und die
Trennung der Anwendungsfall-Spalten (202604 APERAK: beide Varianten identisch
extrahiert; CONTRL beide Stände und APERAK 202610: `expr` durchgehend leer).
Solange das so ist, prüft der Validator diese vier Nachrichtentypen nur
strukturell, nicht gegen den AHB. Der Aufwand ist ein eigener Auftrag: Der
Servicenachrichten-AHB nutzt ein anderes Tabellenlayout als die bereits
unterstützten Formate, und die Formular-Metas dürfen laut Fallstrick-Liste nicht
über das Generator-Werkzeug neu erzeugt werden, sondern nur über ein
Nachbearbeitungsskript.

## 75. AHB CONTRL gelesen: Fehlercodes je Anwendungsfall, AHB-Status, Codregeln (13.08.2026)

**Auftrag.** Den AHB CONTRL lesen und analysieren, insbesondere die dort
aufgelisteten Fehlercodes für das Programm filtern.

**Warum der AHB zusätzlich zum MIG.** Abschnitt 74 hat die Codelisten aus dem
**MIG** gelesen — der sagt, WELCHE Codes es je Segment gibt. Der **AHB** trifft
drei weitere Aussagen, die im MIG nicht stehen:

1. **Zulässigkeit je Anwendungsfall.** Die tabellarische Darstellung führt drei
   Anwendungsfälle nebeneinander — „Empfangsbestätigung", „Syntaxfehlermeldung in
   der Übertragungsdatei", „Syntaxfehlermeldung in der Nachricht" — und markiert
   je Code mit „X", in welchem er verwendet werden darf.
2. **AHB-Status samt Bedingungen** je Segment, Segmentgruppe und Datenelement.
3. **Regeln im Fließtext** zu einzelnen Fehlercodes.

**Quellenlage / Lesbarkeit.** Die Strukturtabelle des AHB besteht aus
verschachtelten Tabellen innerhalb einer Rahmentabelle. `cell.text` von
python-docx liefert dort **leere Zellen**, weil verschachtelte Tabellen nicht
mitgelesen werden — ein erster Leseversuch ergab deshalb eine scheinbar leere
Tabelle. Das neue Werkzeug `werkzeuge/lies_contrl_ahb.py` steigt über
`zellinhalt()` rekursiv in die verschachtelten Tabellen ab.

Zwei Fallen beim Parsen, beide beim Prüfen aufgefallen und behoben:

- Ein Statusmuster `S.*` verschluckte die Bezeichnung „**S**yntax-Version oder
  -ebene nicht unterstützt" — dadurch fehlte **Code 2** in der UCI-Liste. Das
  Muster ist jetzt auf die tatsächlichen Statuswörter verankert (`STATUSFELD`).
- Verbundene Zellen liefert python-docx als Wiederholung desselben Textes; das
  Zusammenfassen ALLER Wiederholungen verschluckte jedoch „| Muss | Muss | Muss",
  also den Status je Anwendungsfall. Zusammengefasst werden jetzt nur
  Nicht-Statusfelder.

**Ergebnis 1 — der AHB bestätigt die MIG-Extraktion vollständig.** Beide Quellen
führen exakt dieselben DE0085-Codes: UCI 13, UCM 9, UCS 6, UCD 10; DE0083 UCI
4/7, UCM 4. Das ist eine unabhängige Gegenprobe zu Abschnitt 74 und wird in
`scripts/test_contrl_ahb.js` als harte Zusicherung geprüft — weichen die Quellen
künftig ab, ist eine der beiden Extraktionen defekt und muss auffallen.

**Ergebnis 2 — Zulässigkeit je Anwendungsfall (neu).**

| Ebene | Codes | zulässig in |
|---|---|---|
| UCI DE0083 | 7 | nur Empfangsbestätigung |
| UCI DE0083 | 4 | nur die beiden Syntaxfehlermeldungen |
| UCI DE0085 | 2, 7, 12, 13, 16, 20, 21, 23, 25, 26, 28, 29, 32 | nur Syntaxfehlermeldung in der **Übertragungsdatei** |
| SG1 UCM DE0085 | 12, 13, 16, 21, 22, 26, 28, 29, 39 | nur Syntaxfehlermeldung in der **Nachricht** |
| SG2 UCS DE0085 | 13, 15, 16, 22, 35, 36 | dito |
| SG2 UCD DE0085 | 12, 13, 16, 19, 21, 22, 37, 38, 39, 40 | dito |

**Ergebnis 3 — AHB-Status und Bedingungen (füllt die Lücke aus Abschnitt 74 für
CONTRL).** Gelesen wurden u. a. SG1 „Muss", **SG2 „Muss [9]"**, SG2 UCD
„Soll [6]", SG1 UCM DE0085 „S [2] ∨ [3]", SG1 UCM DE0098/DE0104 „S [8] ∧ [1]",
SG2 UCD DE0098 „M", UNH/UCI/UNT „Muss" in allen Anwendungsfällen — samt den
sieben Bedingungstexten ([9] = „Wenn SG1 UCM DE0013 nicht vorhanden."). Damit
liegt der Gruppenstatus, der den CONTRL-Formular-Metas fehlt, jetzt maschinell
gelesen vor. Das Übertragen in die Metas ist bewusst NICHT Teil dieses Auftrags
(Fallstrick-Liste: nur über ein Nachbearbeitungsskript) und bleibt als
Folgepunkt offen.

**Ergebnis 4 — Regel zu Fehlercode 26.** Der AHB verbietet ausdrücklich: „Muss
der Empfänger aufgrund eines von ihm verursachten Fehlers eine Übertragungsdatei
erneut in sein System einspielen oder erhält er aus diesem Grund eine an ihn
bereits gesandte Übertragungsdatei erneut, so hat er sicher zu stellen, dass in
solch einem Fall seine Systeme keine Syntaxfehlermeldung mit dem Fehlercode 26
(= Duplikat gefunden) versenden." Das betrifft unmittelbar die vom Auftraggeber
gemeldete CONTRL mit Code 26. Solche Fließtextaussagen werden maschinell je Code
gesammelt (`FEHLERCODE_SATZ`) und im Abgleich am Befund angezeigt.

**Nebenbefund (nicht umgesetzt, nur festgehalten).** Kapitel 2 des AHB
beschreibt die Syntaxprüfung normativ und bestätigt dabei genau die Regel, die in
Abschnitt 74.2 im Validator korrigiert wurde: „Falls der Status der Segmentgruppe
‚M' oder ‚R' ist, müssen auch diese Segmente vorhanden sein. Falls der Status der
Segmentgruppe ‚C' oder ‚D' oder ‚O' ist, müssen diese Segmente nur dann vorhanden
sein …". Der Pflichtstatus eines Segments hängt also auch nach AHB am Status
seiner Segmentgruppe — die Korrektur aus 74.2 ist damit unabhängig belegt.

**Umsetzung in der Anwendung.** `ablehnung-abgleich.html` lädt `contrl-ahb.js`
und zeigt am Befund (a) den AHB-Anwendungsfall des gemeldeten Codes, (b) einen
Warnhinweis, wenn der Code an dieser Ebene laut AHB **nicht vorgesehen** ist —
dann weicht der absendende Marktpartner vom AHB ab —, und (c) die
Fließtextregeln des AHB zum Code. Die Ebene wird aus dem Fehlerzeiger abgeleitet
(UCI → Datei-Ebene, UCM → Nachricht, UCS → Segment, UCD → Datenelement).

**Nachweis.** Neue Regression `scripts/test_contrl_ahb.js` (25 Prüfungen,
darunter der harte AHB-gegen-MIG-Abgleich je Ebene, die Anwendungsfall-Zuordnung
von DE0083 = 4/7, die Ebenenschärfe von Code 35 (UCS ja, UCD nein), Gruppenstatus
SG2 „Muss [9]" und die Code-26-Regel). Fall H in
`scripts/test_ablehnung_abgleich.js` um die Anzeige des AHB-Anwendungsfalls und
der Code-26-Regel erweitert. Volle Regression grün (40 Läufe).
