# Browser-Prüfung – Validierungsfunktion

Stand: 02.08.2026 · manuelle Prüfliste, ergänzend zur automatischen Regression
(`scripts/`, `_engine/tests/`).

Diese Checkliste prüft den **Import- und Validierungsteil** des Tools (der Generator-Teil
wurde in `PRUEFUNG_KAP_8.2.md` bereits abgedeckt). Zu öffnen ist `validator.html` (universeller Validator) oder eine Generatorseite mit dem
Reiter **„Nachricht importieren & validieren"**. `file://` genügt, ein lokaler Webserver
(`python3 -m http.server`) tut es ebenso.

Für jeden Testfall: die angegebene Nachricht in das Importfeld einfügen (oder per Drag &
Drop ablegen) und **„Validieren"** klicken. Erwartet werden die genannten Befunde.
Die Nachrichten sind einzeilig – Zeilenumbrüche beim Kopieren sind unkritisch, der Parser
kommt mit und ohne zurecht.

---

## 0. Grundfunktionen

- [ ] Umschalter „generieren" ↔ „importieren & validieren" funktioniert
- [ ] Text ins Feld einfügen und „Validieren" zeigt Ergebnis
- [ ] Drag & Drop einer **Datei** (.txt) in die Ablagezone lädt und validiert
- [ ] Drag & Drop von **markiertem Text** in die Zone übernimmt und validiert
- [ ] Beim Drüberziehen erscheint das Overlay („Datei oder Text hier ablegen")
- [ ] „Leeren" setzt Feld und Ergebnis zurück

---

## 1. Vollständig korrekte Nachricht

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR001++++++1'UNH+DAR001+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR001'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DAR001'UNZ+1+DAR001'
```

- [ ] Ergebnis: **grüner Haken „Keine Struktur-/Formatfehler gefunden (Prüf-ID 55016)"**
- [ ] Farbige Darstellung: **alle Segmente grün**
- [ ] Zusammenfassung nennt Prüf-ID 55016

---

## 2. Sommer-/Winterzeit-Fehler (DTM)

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR002++++++1'UNH+DAR002+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR002'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202608012300?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DAR002'UNZ+1+DAR002'
```

- [ ] **1 Fehler** bei `DTM+93`: Zeitstempel „202608012300+00" passt nicht zur Sommer-/Winterzeit
- [ ] Nur das `DTM+93`-Segment ist rot, `DTM+137` bleibt grün

---

## 3. Leeres Segment

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR003++++++1'UNH+DAR003+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR003''DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+12+DAR003'UNZ+1+DAR003'
```

- [ ] **1 Fehler**: „1 leeres Segment gefunden (zwei aufeinanderfolgende Segmenttrenner '')"
- [ ] (Hinweis: nach `BGM+E35+DAR003` stehen zwei Apostrophe)

---

## 4. STS – AHB-Kontextfehler (ZW1)

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR004++++++1'UNH+DAR004+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR004'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW1'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DAR004'UNZ+1+DAR004'
```

- [ ] **1 Fehler** bei `STS`: „Transaktionsgrundergänzung ZW1 ist im MIG gültig, aber für Prüf-ID 55016 nicht zugelassen. Erlaubt: ZW4, ZW3, ZW5."
- [ ] Zeigt den Unterschied MIG-gültig vs. AHB-Kontext (ZW1 ist kein Tippfehler, nur hier verboten)

---

## 5. UNB-/NAD-Fehler (mehrere gleichzeitig)

```
UNB+UNOC:3+9900259000002:14+9900000000002:500+260716:161547+DAR005++++++1'UNH+DAR005+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR005'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::9'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DAR005'UNZ+1+DAR005'
```

- [ ] **3 Fehler**:
  - `UNB`: Absender-Qualifier 14 statt 500 (BDEW)
  - `UNB`: Uhrzeit „161547" ist nicht HHMM (6 statt 4 Stellen)
  - `NAD+MS`: Codevergabestelle 9 statt 293 (BDEW)

---

## 6. RFF / LOC / IDE – falsche Qualifier

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR006++++++1'UNH+DAR006+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR006'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+99+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z99+50052281648'RFF+XX9:55016'UNT+11+DAR006'UNZ+1+DAR006'
```

- [ ] **3 Fehler**: `IDE` Qualifier 99, `LOC` Qualifier Z99, `RFF` Qualifier XX9 – jeweils „unbekannt für UTILMD"
- [ ] Zusätzlich 1 Warnung, dass keine gültige Prüf-ID-Referenz (RFF+Z13) gefunden wurde (Folge des RFF-Tippfehlers)

---

## 7. UNT-Segmentzähler falsch

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR007++++++1'UNH+DAR007+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR007'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+99+DAR007'UNZ+1+DAR007'
```

- [ ] **1 Fehler** bei `UNT`: „Segmentzähler = 99, korrekt wären 11 (UNH…UNT einschließlich)"

---

## 8. Produktpaket-Codes falsch (SEQ / PIA / CCI / CAV)

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:0934+DAR009++++++1'UNH+DAR009+UTILMD:D:11A:UN:S2.2'BGM+E01+DAR009'DTM+137:202607170734?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+92:202608312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55001'RFF+Z60:1'SEQ+Z99+1'PIA+5+9991000002008:Z88'CCI+Z98'CAV+ZZ9:::123'UNT+16+DAR009'UNZ+1+DAR009'
```

- [ ] **4 Fehler**: `SEQ` Handlung Z99, `PIA` Typ Z88, `CCI` Klassentyp Z98, `CAV` Merkmalswert-Code ZZ9 – jeweils „unbekannt für UTILMD"
- [ ] Prüf-ID 55001 wird erkannt

---

## 9. QTY – falscher Mengenqualifier

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:0934+DAR010++++++1'UNH+DAR010+UTILMD:D:11A:UN:S2.2'BGM+E35+DAR010'DTM+137:202607170734?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'QTY+Z99:abc:XYZ'UNT+12+DAR010'UNZ+1+DAR010'
```

- [ ] **1 Fehler** bei `QTY`: unbekannter Mengenqualifier Z99
- [ ] **2 Warnungen** bei `QTY`: Menge „abc" ist kein Zahlenwert; Einheit „XYZ" nicht hinterlegt

---

## 10. Anderer Nachrichtentyp (MSCONS) – nur Rahmenprüfung

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DAR008++++++1'UNH+DAR008+MSCONS:D:04B:UN:2.4c'BGM+7+DAR008'UNT+3+DAR008'UNZ+1+DAR008'
```

- [ ] **0 Fehler** – der Umschlag (UNB/UNH/UNT/UNZ) wird geprüft, aber MSCONS-Code-Validierung ist (noch) nicht hinterlegt
- [ ] Zusammenfassung zeigt Nachrichtentyp MSCONS
- [ ] Beleg dafür, dass die Registry nachrichtenübergreifend trägt (keine Falschmeldungen bei fremdem Typ)

---

## 11. Segmentaufbau – verrutschte Trennzeichen

Diese Prüfung erkennt einen falschen Segmentaufbau, wenn durch ein **fehlendes oder
zusätzliches Trennzeichen** ein Wert im falschen Datenelement landet – selbst wenn der
Wert an sich gültig ist. Ein oder zwei Folgefehler (z. B. am UNT-Zähler oder beim
Wert im verrutschten Feld) sind dabei normal und gewollt.

### 11a. CCI – ein „+" fehlt (das Ausgangsbeispiel)

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:0934+DARS01++++++1'UNH+DARS01+UTILMD:D:11A:UN:S2.2'BGM+E01+DARS01'DTM+137:202607170734?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+92:202608312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55001'RFF+Z60:1'SEQ+ZH0+1'CCI+Z65++Z01'UNT+16+DARS01'UNZ+1+DARS01'
```

- [ ] Aufbaufehler bei `CCI`: „Datenelement 4 muss belegt sein" **und** „Datenelement 3 muss leer sein, enthält aber Z01"
- [ ] Der Hinweis nennt die erwartete Form `CCI+Z65+++<Relevanz>` (drei „+")
- [ ] `CCI+Z65++Z01` ist rot markiert
- [ ] (Folgefehler am UNT-Zähler ist normal – durch das fehlende Feld stimmt die Segmentstruktur nicht mehr)

Zur Gegenprobe die **korrekte** Form – muss fehlerfrei sein (beachte: hier `UNT+14`, da
ein Datenelement weniger als im Fehlerfall):

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:0934+DARS01++++++1'UNH+DARS01+UTILMD:D:11A:UN:S2.2'BGM+E01+DARS01'DTM+137:202607170734?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+92:202608312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55001'RFF+Z60:1'SEQ+ZH0+1'CCI+Z65+++Z01'UNT+14+DARS01'UNZ+1+DARS01'
```

- [ ] **0 Fehler** – keine Aufbaufehler, `CCI+Z65+++Z01` ist grün

### 11b. CAV – ein „:" fehlt

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:0934+DARS02++++++1'UNH+DARS02+UTILMD:D:11A:UN:S2.2'BGM+E01+DARS02'DTM+137:202607170734?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+92:202608312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55001'RFF+Z60:1'SEQ+Z79+1'CAV+ZH9::9991000002107'UNT+16+DARS02'UNZ+1+DARS02'
```

- [ ] Aufbaufehler bei `CAV`: „Komponente 4 muss belegt sein" **und** „Komponente 3 muss leer sein, enthält aber 9991000002107"
- [ ] Der Hinweis nennt die erwartete Form `CAV+<Code>:::<Wert>` (drei „:")

### 11c. STS – ein „+" fehlt

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DARS03++++++1'UNH+DARS03+UTILMD:D:11A:UN:S2.2'BGM+E35+DARS03'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7+E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DARS03'UNZ+1+DARS03'
```

- [ ] Aufbaufehler bei `STS`: „Datenelement 2 muss leer sein, enthält aber E03" (E2/C555 bleibt bei STS+7 leer)
- [ ] (Folgefehler „unbekannter Transaktionsgrund ZW4" ist normal – durch das fehlende Feld rutscht ZW4 in das Grund-Element)

### 11d. NAD – ein „:" fehlt

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DARS04++++++1'UNH+DARS04+UTILMD:D:11A:UN:S2.2'BGM+E35+DARS04'DTM+137:202607161547?+00:303'NAD+MS+9900259000002:293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW4'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DARS04'UNZ+1+DARS04'
```

- [ ] Aufbaufehler bei `NAD+MS`: „Komponente 3 muss belegt sein" **und** „Komponente 2 muss leer sein, enthält aber 293"
- [ ] Der Hinweis nennt die erwartete Form `NAD+<Rolle>+<MP-ID>::<Stelle>` (Komp. 2 bleibt leer)

---

## 12. Zuordnungsmeldungen Kap. 8.11 (55036 / 55037 / 55038)

Diese Prüf-IDs sind reine **Meldungen** (NB an LF) – sie tragen **kein** STS+E01
(Antwortstatus), sondern nur STS+7 mit dem Transaktionsgrund. 55036 meldet eine
existierende Zuordnung (BGM E01, Grund Z26), 55037 die Beendigung (BGM E02, Grund
ZC8/ZD9/ZG6 + Ergänzung ZW3/ZW4), 55038 die Aufhebung einer zukünftigen Zuordnung
(BGM E02, Grund ZG5/ZG9/ZH0/ZH1 + Ergänzung ZW3/ZW4).

### 12a. Gültige Meldung 55037

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:1233+DAR037++++++1'UNH+DAR037+UTILMD:D:11A:UN:S2.2'BGM+E02+DAR037'DTM+137:202607171033?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202612302300?+00:303'STS+7++ZC8+ZW4'LOC+Z16+50052281648'RFF+Z13:55037'UNT+11+DAR037'UNZ+1+DAR037'
```

- [ ] **0 Fehler** – Prüf-ID 55037 wird erkannt, alle Segmente grün
- [ ] Es wird **kein** STS+E01 verlangt (Meldung, keine Antwortnachricht)

### 12b. Ungültiger Transaktionsgrund

Dieselbe Nachricht, aber `STS+7++ZC8+ZW4` durch `STS+7++E99+ZW4` ersetzt:

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:1233+DAR037++++++1'UNH+DAR037+UTILMD:D:11A:UN:S2.2'BGM+E02+DAR037'DTM+137:202607171033?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202612302300?+00:303'STS+7++E99+ZW4'LOC+Z16+50052281648'RFF+Z13:55037'UNT+11+DAR037'UNZ+1+DAR037'
```

- [ ] **1 Fehler** bei `STS+7`: unbekannter Transaktionsgrund „E99"
- [ ] **1 Warnung** bei `STS+7`: Grund „E99" weicht vom erwarteten „ZC8" der Prüf-ID 55037 ab

---

## 13. AHB-Bedingungen (Segmentabhängigkeiten)

Diese Prüfung wertet die AHB-Bedingungsverweise (die „[NNN]") aus. Die Nummernkreise
bestimmen die Behandlung: Voraussetzungen [1]–[499] und Wiederholbarkeiten [2000]–[2499]
werden hart geprüft, Hinweise [500]–[899] nur informativ. Für die LOC-Segmente hängt die
Pflicht vom STS-Transaktionsgrund-Ergänzungscode ab: ZW3/ZW4 → Marktlokation (LOC+Z16),
ZW5 → Tranche (LOC+Z21).

### 13a. Verbrauchende Marktlokation (ZW4) ohne LOC+Z16

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:1233+DARB0++++++1'UNH+DARB0+UTILMD:D:11A:UN:S2.2'BGM+E01+DARB0'DTM+137:202607171033?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+92:202609302200?+00:303'STS+7++E03+ZW4'RFF+Z13:55001'UNT+10+DARB0'UNZ+1+DARB0'
```

- [ ] **Fehler [480]** bei `LOC`: Bei verbrauchender Marktlokation (ZW4) ist LOC+Z16 anzugeben
- [ ] Ergänzt man `LOC+Z16+50052281648'` (und passt UNT auf 11 an), verschwindet der Fehler

### 13b. Tranche (ZW5) mit falschem LOC+Z16 statt LOC+Z21

```
UNB+UNOC:3+9900259000002:500+9900000000002:500+260716:1747+DARB1++++++1'UNH+DARB1+UTILMD:D:11A:UN:S2.2'BGM+E35+DARB1'DTM+137:202607161547?+00:303'NAD+MS+9900259000002::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202607312200?+00:303'STS+7++E03+ZW5'LOC+Z16+50052281648'RFF+Z13:55016'UNT+11+DARB1'UNZ+1+DARB1'
```

- [ ] **Fehler [481]** bei `LOC`: Bei Tranche (ZW5) ist LOC+Z21 (Tranche) anzugeben – nicht LOC+Z16
- [ ] Zeigt: Der Validator prüft nicht nur, *ob* eine Lokation da ist, sondern ob die *richtige* zum STS-Code passt

### 13c. Zuordnungsmeldung 8.11 – Entweder-Oder [348]

Für 55036/55037/55038 gilt das Entweder-Oder [348]: LOC+Z16 ODER LOC+Z21 muss vorhanden sein.

```
UNB+UNOC:3+9900000000001:500+9900000000002:500+260717:1233+DARB2++++++1'UNH+DARB2+UTILMD:D:11A:UN:S2.2'BGM+E02+DARB2'DTM+137:202607171033?+00:303'NAD+MS+9900000000001::293'NAD+MR+9900000000002::293'IDE+24+VG100'DTM+93:202612302300?+00:303'STS+7++ZC8+ZW4'RFF+Z13:55037'UNT+10+DARB2'UNZ+1+DARB2'
```

- [ ] **Fehler [348]** bei `LOC`: Es muss mindestens eines vorhanden sein: LOC+Z16 ODER LOC+Z21
- [ ] Mit `LOC+Z16+50052281648'` (UNT auf 11) wird es gültig; mit `LOC+Z21+TR-001'` ebenfalls

---

## 14. UNA-Verhalten

- [ ] Testfall 1 **mit** vorangestelltem `UNA:+.? '` → gleiches Ergebnis (grün)
- [ ] Testfall 1 **ohne** UNA → Hinweis „Kein UNA-Segment vorhanden – es gelten die Standard-Trennzeichen", weiterhin grün
- [ ] Nachricht mit Zeilenumbrüchen zwischen den Segmenten → wird korrekt geparst (keine Fehlalarme wegen Umbrüchen)

---

## Bewertung

Wenn die Testfälle 1–14 die erwarteten Befunde liefern und die Farbmarkierung (grün =
fehlerfrei, rot = fehlerhaft) stimmt, gilt die Validierungsfunktion für UTILMD Strom als
browser-geprüft.

Falls ein echtes Beispiel aus deinem Bestand abweicht: Nachricht (ohne echte Personen-/
Vertragsdaten) und beobachteten vs. erwarteten Befund notieren – dann grenze ich es gegen
MIG/AHB ein.
