# Browser-Prüfung – Kapitel 8.2 (Anmeldung verbrauchende MaLo)

Stand: 02.08.2026 · manuelle Prüfliste, ergänzend zur automatischen Regression
(`scripts/`, `_engine/tests/`).

Diese Checkliste führt durch die manuelle Prüfung der Prüf-IDs **55001 / 55002 / 55003**
im Browser. Zu öffnen ist `202604/Stammdaten/UTILMD/Strom/index.html` — entweder direkt per `file://` oder über einen lokalen
Webserver (`python3 -m http.server` im Projektordner). Beides funktioniert; die Seiten
laden ihre Daten ohne fetch().

Platzhalter in den Soll-Nachrichten:
- `<DAR>` = Datenaustauschreferenz (automatisch erzeugte Zahl; überall identisch je Nachricht)
- `<JETZT>` = aktueller UTC-Zeitstempel im DTM+137
- Produkt-Codes sind echte 13-stellige Codes (z. B. `9991000002008`), keine `<DAR>`

---

## 0. Startprüfung

- [ ] Seite lädt ohne Fehler (Browser-Konsole F12 → keine roten Meldungen)
- [ ] Dropdown „Anwendungsfall / Prüfidentifikator" zeigt alle 6 Gruppen (8.1, 8.2, 8.6, 8.8, 8.9)
- [ ] Auswahl **55001** zeigt unter den Standardfeldern den Block **„Produktpakete (SG8/SG10)"**

### Format-Korrekturen (aus Review) – gelten für alle PIDs
- [ ] **UNB-Uhrzeit** ohne Tag: `...+260716:1747+...` (Datum JJMMTT `:` Uhrzeit HHMM)
- [ ] **UNB-Qualifier** je MP-ID-Aussteller: `99…` → `:500` (BDEW), `4…` → `:14` (GS1)
- [ ] **NAD+MS/MR** mit Trenner `::` und Codevergabestelle: `99…` → `::293`, `4…` → `::9`
      (Beispiel: `NAD+MS+9900259000002::293'`)
- [ ] **Datumsfelder** im Format **TT.MM.JJJJ** (z. B. `01.09.2026`)
- [ ] **MaLo-Vorbelegung** beginnt mit **5** (`50052281648`)

---

## 1. PID 55001 – Anmeldung (Standard)

**Eingabe:** 55001 auswählen, Feld **DTM+92 (Beginn zum)** auf **01.09.2026** setzen.
Produktpaket unverändert lassen (1 Paket, 1 Produkt „Bilanzkreis").

**Erwartete Ausgabe (Referenz A):**
```
BGM+E01+<DAR>'
DTM+137:<JETZT>?+00:303'
...
IDE+24+EDIGEN{<DAR>'
DTM+92:202608312200?+00:303'
STS+7++E03+ZW4'
FTX+ACB+++AHB-konforme Marktnachricht'
LOC+Z16+50052281648'
RFF+Z13:55001'
RFF+Z60:1'
SEQ+Z79+1'
PIA+5+9991000002008:Z11'
SEQ+ZH0+1'
CCI+Z65+++Z01'
UNT+17+<DAR>'
```

Prüfpunkte:
- [ ] **BGM+E01** (Anmeldung), nicht E35
- [ ] **DTM+92** erscheint als `202608312200?+00` (01.09.2026 Strom = 31.08. 22:00 UTC, Sommerzeit)
- [ ] **STS+7++E03+ZW4** (Wechsel, verbrauchende MaLo)
- [ ] **RFF+Z60:1** (informativ geplantes Produktpaket = Paket-ID 1)
- [ ] Produktpaket-Kette: `SEQ+Z79+1` → `PIA+5+9991000002008:Z11` → `SEQ+ZH0+1` → `CCI+Z65+++Z01`
- [ ] Kein CCI+Z66/CAV (Bilanzkreis hat keine Produkteigenschaft) – korrekt
- [ ] **UNT+17** (Segmentzahl UNH…UNT)
- [ ] **UNB** endet auf `++++++1` (Testflag gesetzt)

---

## 2. PID 55001 – Produktpaket mit Eigenschaft + Wert

**Eingabe:** wie oben, dann im Produktpaket-Block:
1. Paket-ID auf **7** ändern, Umsetzungsgrad auf **Z02 (in Teilen)**
2. Zweimal „+ Produkt hinzufügen"
3. Produkt 2: Code **„Messtechnische Einordnung der Marktlokation"** wählen → Eigenschaft **iMS**
4. Produkt 3: Code **„Jahresverbrauchsprognose maximaler Wert (MAX)"** wählen → Wertedetail **5000**

**Erwartete Ausgabe (Referenz B) – Produktpaket-Teil:**
```
RFF+Z60:7'
SEQ+Z79+7'
PIA+5+9991000002008:Z11'
SEQ+Z79+7'
PIA+5+9991000002008:Z11'          (Messtechnische Einordnung)
CCI+Z66'
CAV+ZH9:::9991000002107'          (iMS)
SEQ+Z79+7'
PIA+5+9991000003254:Z11'          (JVP MAX)
CAV+ZV4:::5000'
SEQ+ZH0+7'
CCI+Z65+++Z02'
UNT+24+<DAR>'
```

Prüfpunkte:
- [ ] Für jedes Produkt eine eigene `SEQ+Z79+7`-Gruppe
- [ ] Produkt mit Eigenschaft erzeugt **CCI+Z66** + **CAV+ZH9:::9991000002107**
- [ ] Produkt mit Wertedetail erzeugt **CAV+ZV4:::5000**
- [ ] **SEQ+ZH0+7** und **CCI+Z65+++Z02** (Umsetzungsgrad „in Teilen")
- [ ] Produkt-Codes ohne Leerzeichen (13-stellig)
- [ ] **UNT+24**

> Hinweis: In der Referenz B ersetzt `<DAR>` versehentlich auch die 13-stelligen
> Produkt-Codes. Im Browser stehen dort die echten Codes wie oben gezeigt.

---

## 3. PID 55002 – Bestätigung Anmeldung

**Eingabe:** 55002 auswählen, DTM+92 auf **01.09.2026** setzen.

**Erwartete Ausgabe (Referenz C):**
```
BGM+E01+<DAR>'
...
DTM+92:202608312200?+00:303'
STS+7++E03+ZW4'
STS+E01++A51:E_0623'
...
RFF+Z13:55002'
RFF+TN:<Vorgangsnummer>'
UNT+14+<DAR>'
```

Prüfpunkte:
- [ ] **STS+E01++A51:E_0623** (Antwortcode A51 = Cluster Zustimmung, EBD E_0623 „Lieferbeginn prüfen")
- [ ] **RFF+TN** (Referenz auf Vorgangsnummer der Anfrage) ist vorhanden
- [ ] Kein Produktpaket-Block (nur 55001 hat ihn)
- [ ] **UNT+14**

---

## 4. PID 55003 – Ablehnung Anmeldung

**Eingabe:** 55003 auswählen (keine Terminfelder – 55003 hat kein DTM+92).

**Erwartete Ausgabe (Referenz D):**
```
BGM+E01+<DAR>'
...
IDE+24+EDIGEN{<DAR>'
STS+7++E03+ZW4'
STS+E01++A02:E_0622'
...
RFF+Z13:55003'
RFF+TN:<Vorgangsnummer>'
UNT+13+<DAR>'
```

Prüfpunkte:
- [ ] **KEIN DTM+92** (Ablehnung führt Beginn/Ende nicht als Muss; nur Bearbeitungsdaten laut AHB)
- [ ] **STS+E01++A02:E_0622** (A02 = Cluster Ablehnung, EBD E_0622 „Prüfen, ob Anmeldung direkt ablehnbar")
- [ ] **RFF+TN** vorhanden
- [ ] **UNT+13**

---

## 5. Regelprüfungen (Fehlerkasten)

- [ ] 55001 ohne DTM+92: roter Hinweis „In diesem Anwendungsfall ist DTM+92 (Beginn zum) anzugeben."
- [ ] STS+7 auf ZW4 und LOC+Z16 leeren: Hinweis „Bei einer verbrauchenden Marktlokation (ZW4) muss die ID (LOC+Z16) angegeben werden."
- [ ] Wechsel zwischen 55001/55002/55003 baut das Formular jeweils sauber neu auf

---

## 6. Offene Punkte / Bewusste Vereinfachungen (kein Fehler)

- Der **Antwortcode** (A51/A02 etc.) ist ein cluster-korrekter **Beispielvertreter** aus dem
  jeweiligen EBD; der real zu sendende Code hängt vom konkreten Prüfergebnis ab.
- **DTM+Z07/Z08** (Lieferbeginndatum/Datum für nächste Bearbeitung) der Ablehnung 55003
  sind noch nicht als Eingabefelder umgesetzt (nur bei Antwortcode A06 relevant).
- Weitere SG5-Objekte (Netzlokation, Technische/Steuerbare Ressource, Messlokation, ruhende
  MaLo) und SG8 „Daten der Netzlokation/Marktlokation" der Bestätigung sind noch nicht
  abgebildet – für den GPKE-Standardfall (Wechsel verbrauchende MaLo) nicht zwingend.

Wenn alle Haken bis Abschnitt 5 gesetzt sind, gilt Kapitel 8.2 als browser-geprüft und
wir können zur nächsten Prozessgruppe übergehen.
