# UTILMD Strom – Umsetzungsstand

Stand: 02.08.2026 · Quellen: AHB UTILMD Strom S2.1 (Formatstand 202604, gültig bis
30.09.2026) und S2.2 (202610, ab 01.10.2026), dazu die zugehörigen MIG.

Umgesetzt sind **187 Prüf-IDs im Formatstand 202604** und **189 im Formatstand 202610**
— jeweils der vollständige AHB. Die folgende Übersicht führt die Prozesse; sie gilt für
beide Stände, die Prüf-ID-Nummern sind identisch (202610 führt zwei Prozesse mehr).

## Umgesetzte Prüf-IDs

GPKE-Kernprozesse:

| Prozess (AHB-Kap.) | Prüf-IDs | BGM | Grund | EBD |
|---|---|---|---|---|
| 8.1 Kündigung zwischen Lieferanten | 55016–55018 | E35 | E03 | E_0614 |
| 8.2 Anmeldung verbrauchende MaLo | 55001–55003 | E01 | E03 | E_0623/E_0622 |
| **8.3 Anmeldung erzeugende MaLo** | **55077/55078/55080** | E01 | E03 | E_0623/E_0622 |
| **8.4 Anmeldung neue verbrauchende MaLo** | **55600/55602/55604** | E01 | E02 | E_0608 |
| **8.5 Anmeldung neue erzeugende MaLo** | **55601/55603/55605** | E01 | E02 | E_0608 |
| **8.7 Ankündigung Zuordnung (erz. MaLo/Tranche)** | **55607/55608/55609** | Z89/E01 | E03 | E_0603 |
| 8.6 Grund-/Ersatzversorgung | 55013–55015 | E01 | E03 | E_0615 |
| 8.8 Beendigung Zuordnung | 55010–55012 | E02 | E03 | E_0624 |
| 8.9 Abmeldung durch den LF an NB | 55004–55006 | E02 | E01 | E_0607 |
| 8.10 Abmeldung durch den NB an LF | 55007–55009 | E02 | Z33 | E_0609 |
| 8.11 Meldung Zuordnung | 55036–55038 | E01/E02 | Z26/ZC8/ZG5 | (Meldung) |
| **8.12–8.14 Abrechnungsdaten** | **55218/55220, 55126/55156, 55613/55614, 55672–55675** | E03 | ZX4/ZX3/ZX2 | E_0610/E_0611 |
| **9.1 Stammdatenänderung verantw. NB** | **33 PIDs (55615–55638, 55688–55692, 55690, 55225/55227, 55173–55180)** | E03/Z88 | ZX5–ZY2, ZZA | E_0408/E_0409/E_0572 |
| **9.2 Stammdatenänderung verantw. LF** | **55109/55137/55110/55136, 55230/55232, 55693/55694** | E03/Z88 | ZX6/ZX5/ZY0 | E_0410/E_0578 |
| **9.3 Stammdatenänderung verantw. MSB** | **36 PIDs (55639–55669, 55684–55687, 55557/55559)** | E03/Z88 | ZX6–ZY1, ZU1 | E_0412/E_0415/E_0583/E_0639 |
| **9.4 Bilanzkreistreue** | **55670/55671** | E03 | ZAM (+ZW3/ZW4/ZW5) | E_0574 |
| **9.5 Geschäftsdatenanfrage (Antwort auf GDA)** | **55035/55095/55060/55194** | E44 | ZY7/ZY6/ZY4/ZY5 | (Infomeldung, RFF+AAV) |
| **9.3.8 Daten auf individuelle Bestellung** | **55553/55555** | E03/Z88 | ZY9 | E_0412/E_0415/E_0583 |
| **9.6 Stornierungsmeldung** | **55022/55023/55024** | E01/E02/E35 | E05 | S_0086/S_0087 |
| **10.1 Kündigung Messstellenbetrieb** | **55039/55040/55041** | E35 | E03 | S_0090/S_0054 |
| **10.2 Anmeldung Messstellenbetrieb** | **55042/55043/55044** | E01 | E01 | S_0055/S_0056 |
| **10.3 Verpflichtungsanfrage (NB an gMSB)** | **55168/55169/55170** | E01 | E01 | S_0063/S_0064 |
| **10.4 Beendigung Messstellenbetrieb** | **55051/55052/55053** | E02 | E01 | S_0059/S_0060 |
| **11.1–11.3 Modell 2 (Anmeldung/Beendigung/Abmeldung)** | **55238–55243, 55074–55076** | E01/E44/E02/E03 | E03 | E_0510/E_0511/E_0512 |
| **13.1–13.16 MaBiS-Anwendungsübersichten** | **34 PIDs (55062–55073, 55195–55237, …)** | Z05/Z07/Z17/Z18/Z37/Z71/E40 | (meist ohne STS+7) | E_0004…E_0102 |
| **8.11 Beendigung Zuordnung (Nachtrag)** | **55611** | E02 | ZC8 | (Meldung) |

**Neu in diesem Schritt (fett):** 8.3/8.4/8.5 – Anmeldung erzeugende, neue verbrauchende und
neue erzeugende Marktlokation. STS+7-Ergänzung: erzeugende ZW3 bzw. Geschäftsvorfall ZW0/ZW1/ZW2,
verbrauchende ZW4; Grund E03 (Wechsel, 8.3) bzw. E02 (Einzug in Neuanlage, 8.4/8.5). LOC-Bedingung
[479] (erzeugende) bzw. [480] (verbrauchende). Antwortcodes für E_0608 sind cluster-repräsentative
Beispiele (A05 Zustimmung / A99 Ablehnung); für E_0623/E_0622 wie 8.2 verifiziert (A51/A02).

## Beim Ausbau gefundene und behobene Korrekturen
- **RFF_TN-Feld** fehlte in 8 Antwort-PIDs (55005/06/08/09/11/12/17/18) – ergänzt, konsistent zu
  55002/55003. Antwortnachrichten tragen jetzt durchgängig ein echtes RFF+TN-Referenzfeld.
- **RFF+TN nur in Antworten:** Der Generator emittierte RFF+TN auch in Meldungen (Platzhalter
  „REF-VORGANG"). Korrigiert – RFF+TN erscheint nur noch in Bestätigung/Ablehnung, nicht in
  Meldungen/Anfragen (betrifft Strom 55036–38 und Gas 44036–38).
- **Test-Harness Feld-Reset:** Die Regressions-Harness setzt den Feldzustand jetzt je PID zurück
  (wie der Browser das Formular neu aufbaut); zuvor konnten Feldwerte einer PID in die nächste
  lecken. Golden-Snapshots entsprechen damit exakt dem Browser-Verhalten.

## Korrektur Abmeldung (8.9/8.10)
Die Abmeldeprozesse trugen fälschlich den Transaktionsgrund **E03 (Wechsel)** - E03 gehört zur
ANMELDUNG, nicht zur Abmeldung. Korrigiert gegen die AHB-Tabellen:
- **8.9 Abmeldung durch LF an NB** (55004–55006): Grund **E01 (Ein-/Auszug/Umzug)**, Z33 zulässig.
- **8.10 Abmeldung durch NB an LF** (55007–55009): Grund **Z33 (Auszug wegen Stilllegung)**,
  EBD E_0609. Zuvor fälschlich als 8.9-Fortsetzung ("erzeugende MaLo") mit vertauschten
  Kommunikationsrichtungen gelabelt - jetzt 55007 = NB an LF (Abmeldung), 55008/55009 = LF an NB.

## Offen (Strom)
**Alle 189 Prüf-IDs des UTILMD AHB Strom sind umgesetzt (vollständig).** Ausbaubar: Vertiefung Abrechnungsdaten + Stammdatenänderung: geänderte Nutzdaten je Objektart
(SG8/SG10 CCI/CAV) — siehe Abschnitte unten.

## Neu: 8.7 Ankündigung Zuordnung (55607–55609)
NB kündigt dem LF die Zuordnung zur erzeugenden MaLo/Tranche an. Besonderheit: 55607 nutzt BGM+**Z89** (Zuordnung zur Lokation, Aktion Ankündigung) statt E01; 55608/55609 (Antwort, LF an NB) BGM E01. Grund E03, Ergänzung ZW8–ZX1 (Fall 1–4), EBD E_0603 (Fall 1; ZW9->E_0604, ZX1->E_0606). Antwortcodes A01 (Zustimmung) / A99 (Ablehnung) aus EBD E_0603.

## Neu: 8.12–8.14 Abrechnungsdaten (55218/55220, 55126/55156, 55613/55614, 55672–55675)
Der NB übermittelt dem LF (bzw. BKV) Abrechnungsdaten. BGM **E03** (Änderungsmeldung), Transaktions-
grund je Prozess: **ZX4** (Netznutzungsabrechnung, 55218/55220), **ZX3** (55126/55156, 55613/55614)
und **ZX2** (55672–55675). Antwort-PIDs (55220/55156/55614/55673/55675) tragen STS+E01 mit Antwort-
code A01 und EBD-Referenz **E_0610** (ZX4) bzw. **E_0611**. Neue Segmente: **SG6 DTM+Z25/Z26**
(Verwendungszeitraum „Daten ab/bis", nach MaKo-UTC umgerechnet), **SG8 SEQ+Z45** (Abrechnungsdaten-
Segmentgruppe) und **SG9 QTY+Z38:<Menge>:KWH** (abgerechnete Menge). Die Feld-ID der Menge folgt der
Validator-Konvention (`SG9_QTY_Z38` → Tag QTY, Qualifier Z38).

**Struktureller Kern (Vertiefungsschritt offen):** Ausmodelliert sind Nachrichtenrahmen, BGM/STS-
Logik, Verwendungszeitraum und die SEQ/QTY-Grundstruktur. Noch nicht ausmodelliert sind die
**OBIS-Kennzahl** (SG8 PIA+5, z. B. `1-1?:1.8.0` – benötigt einen Release-Zeichen-Escape für den
Doppelpunkt) und die volle **SG10-CCI/CAV-Codematrix** (Verbrauchsaufteilung, Netznutzungsvertrag,
Zahlweise). Diese Positionsdetails sind als nächster Ausbaustufe-Schritt vorgemerkt; der aktuelle
Stand ist validator-clean (Golden 43/43, Selbstvalidierung nur erwartete Leerfeld-Findings).

## Neu: 9.1–9.3 Stammdatenänderung (77 Prüf-IDs)
Universelle Änderungsmeldung der Stammdaten je Objektart, jeweils als Anfrage/Meldung-↔-Antwort-Bündel
(im AHB gepaarte Tabellenspalten). Verantwortlich für die Änderung ist je Kapitel ein anderer Marktpartner:
**9.1 NB**, **9.2 LF**, **9.3 MSB**. Gemeinsame Struktur pro Prüf-ID:

- **BGM E03** (Änderungsmeldung) bzw. **Z88** (Anfrage Datenclearing) — die „Rückmeldung/Anfrage"-Spalte
  des AHB ist doppelrollig: entweder Rückmeldung auf eine eingegangene Änderung (E03, [705]) oder
  initiierende Datenclearing-Anfrage (Z88, [706]). Beide Codes sind in der BGM-Codeliste zulässig.
- **STS+7++<ZXn>** Transaktionsgrund je Objektart: NeLo=ZX8, MaLo=ZX6, MeLo=ZX7, SR=ZX9, TR=ZY0,
  Tranche=ZY1, Lokationsbündel=ZY2, Blindabrechnung-NeLo=ZX5, Paket-ID-MaLo=ZZA, MSB-Abrechnung=ZU1.
- **SG5 LOC+<Qualifier>** mit der Objekt-ID: Z16 (MaLo), Z17 (MeLo), Z18 (NeLo), Z19 (SR), Z20 (TR),
  Z21 (Tranche).
- Antwort-PIDs (Rückmeldung): **STS+E01** mit Prüfschritt-Code + **EBD-Referenz** und **RFF+TN** auf die
  Vorgangsnummer der Anfrage. EBD je Verantwortlichkeit/Empfänger: 9.1 E_0408 (LF→NB) / E_0409 (MSB→NB) /
  E_0572 (an ÜNB); 9.2 E_0410 (NB→LF) / E_0578 (MSB→LF); 9.3 E_0412 (NB prüft) / E_0415 (LF prüft) /
  E_0583 (weiterer MSB prüft) / E_0639 (an ÜNB). Antwortcode A01 = cluster-repräsentativer Vertreter.

Abgedeckte Unterprozesse: 9.1.1–9.1.10 (NeLo, MaLo, MaLo-an-ÜNB, Paket-ID, Tranche, TR, SR, MeLo,
Blindabrechnung-NeLo, Lokationsbündel), 9.2.1–9.2.3 (MaLo, Blindabrechnung, TR), 9.3.1–9.3.7 (MaLo/
Tranche-an-ÜNB, NeLo, MaLo, Tranche, SR, MeLo, MSB-Abrechnungsdaten).

**Struktureller Kern (Vertiefungsschritt offen):** Ausmodelliert sind Nachrichtenrahmen, BGM/STS-Logik,
Objekt-LOC und die Antwort-EBD-Verknüpfung. Noch nicht ausmodelliert ist die konkrete geänderte
**Stammdaten-Nutzdatenmatrix** je Objektart (SG8 SEQ/CCI-CAV mit den tatsächlich geänderten Feldern,
Verwendungszeitraum-RFF+Z49/Z53, Qualitäts-Kennzeichen „Gültige/Erwartete/Informative Daten"). Diese
Nutzdaten sind der nächste Vertiefungsschritt.

**9.3.8 „Daten auf individuelle Bestellung"** (67 heterogene Prüf-IDs über alle Objektarten mit dutzenden
eigenen EBDs) ist bewusst NICHT Teil dieses Schritts — der Cluster ist eng mit der Geschäftsdatenanfrage
(9.5) verwandt und wird als eigener Schritt behandelt.

Verifikation: Golden 120/120 unverändert, domsim ALLE OK, Selbstvalidierung nur erwartete Leerfeld-
Findings (kein unbekannter Code), Headless-Browser-Stichproben je Kapitel fehlerfrei, alle 148 JS
`node --check`-sauber, Gas 21/21 unberührt.

## Neu: 9.4 Bilanzkreistreue (55670/55671)
Der NB meldet dem ÜNB die „Stammdaten Bilanzkreistreue" einer Marktlokation (55670), der ÜNB antwortet
mit der Rückmeldung (55671). BGM **E03**, Transaktionsgrund **STS+7++ZAM** (Stammdaten BK-Treue) mit
**Ergänzung ZW3** (Erzeugende MaLo) / ZW4 (Verbrauchende) / ZW5 (Tranche); SG5 **LOC+Z16** (Marktlokation).
Die Rückmeldung trägt **STS+E01** mit Prüfschritt-Code + EBD **E_0574** und **RFF+TN** auf die Vorgangs-
nummer der Meldung. Antwortcode A01 = cluster-repräsentativer Vertreter. Neuer Transaktionsgrund ZAM in
der MIG-Codeliste ergänzt. Verifikation: Golden 122/122, domsim OK, Selbstvalidierung nur erwartete
Leerfeld-Findings, Browser fehlerfrei.

## Neu: 9.5 Geschäftsdatenanfrage – „Antwort auf GDA" (55035/55095/55060/55194)
Das Kapitel modelliert die Antwortnachricht auf eine Geschäftsdatenanfrage (GDA): der Verantwortliche
liefert die angefragten Geschäftsdaten als **Informationsmeldung** zurück. BGM **E44**, Transaktionsgrund
je Zielobjekt/-richtung: **STS+7++ZY7** (verbrauchende MaLo, 55035), **ZY6** (erzeugende MaLo, 55095),
**ZY4** (an MSB, 55060), **ZY5** (Strom an Gas, 55194). Anders als bei Rückmeldungen trägt die GDA-Antwort
**kein STS+E01** (keine Zustimmung/Ablehnung, sondern reine Datenlieferung); die Referenz auf die
ursprüngliche Anfrage erfolgt über **SG6 RFF+AAV** („Nummer der Anfrage"). Dafür wurde ein RFF+AAV-Hook
im Generator und BGM E44 in der Codeliste ergänzt.

**Struktureller Kern (Vertiefung offen):** Ausmodelliert sind Rahmen, BGM E44, STS+7++ZYn, Objekt-LOC und
RFF+AAV. Die vollständige zurückgelieferte **Stammdaten-Nutzdatenmatrix** (alle SG5/SG8/SG10-Segmente je
Objektart) ist – wie bei Stammdatenänderung – der nächste Vertiefungsschritt. Die **Anfrage-Seite** der GDA
(die eigentliche Bestellung der Daten) entspricht dem Cluster **9.3.8 „Daten auf individuelle Bestellung"**
(67 heterogene PIDs) und bleibt bewusst ein eigener, noch offener Schritt.

## Neu: 9.3.8 Daten auf individuelle Bestellung (55553/55555)
Ergänzt die Anfrage-/Bestell-Seite zur Geschäftsdatenanfrage (9.5): Ein Marktpartner bestellt beim MSB
individuell Daten (55553, MSB an NB/LF/MSB), der Empfänger antwortet (55555). Anders als zunächst vermutet
hat der Cluster nur **zwei eigene Prüf-IDs** — die „67 PIDs" waren SG6-RFF-Referenzen auf die bestellbaren
Vorgänge, nicht eigene Nachrichten. BGM **E03** (bzw. **Z88** Anfrage Datenclearing, Doppelrolle),
Transaktionsgrund **STS+7++ZY9** (Daten auf individuelle Bestellung). Die Bestellung wird über
**SG6 RFF+Z43** (Referenznummer des Vorgangs) referenziert; die Rückmeldung trägt **STS+E01** mit EBD
**E_0412** (NB prüft) bzw. E_0415 (LF) / E_0583 (weiterer MSB) und **RFF+TN**.

Dafür wurde der RFF-Referenz-Hook im Generator **generalisiert**: beliebige `RFF_<Qualifier>`-Regelfelder
(z. B. RFF+AAV bei 9.5, RFF+Z43 bei 9.3.8) werden nun datengetrieben emittiert (RFF+TN/RFF+Z13 weiterhin
gesondert). Verifikation: Golden 128/128, domsim OK, Selbstvalidierung nur erwartete Leerfeld-Findings,
Browser fehlerfrei (inkl. GDA-Regression RFF+AAV).

## Neu: 9.6 Stornierungsmeldung (55022/55023/55024)
Storniert eine zuvor gesendete Meldung. Anfrage/Bestätigung/Ablehnung-Trio: **55022** (Anfrage nach
Stornierung, von den Beteiligten der Ursprungsnachricht), **55023** (Bestätigung), **55024** (Ablehnung).
Die **BGM** spiegelt die Kategorie der zu stornierenden Meldung — **E01** (Anmeldung), **E02** (Abmeldung)
oder **E35** (Kündigung); im Generator ist E01 als repräsentativer Vertreter gesetzt. Transaktionsgrund
**STS+7++E05** (Stornierung). Die Antwort trägt **STS+E01** mit Prüfschritt-Code und Codelisten-Referenz
**S_0086** (Bestätigung) bzw. **S_0087** (Ablehnung) — hier eine Codeliste statt eines E_0xxx-EBD — sowie
**RFF+TN**. Die zu stornierende Ursprungsnachricht wird über **SG6 RFF+ACW** referenziert.

Damit ist **GPKE-Kapitel 9 (Stammdatenänderung, Bilanzkreistreue, Geschäftsdatenanfrage, individuelle
Bestellung, Stornierung) vollständig** abgedeckt. Verifikation: Golden 131/131, domsim OK, Selbst-
validierung nur erwartete Leerfeld-Findings, Browser fehlerfrei, Gas 21/21 unberührt.

## Neu: Kapitel 10 Messstellenbetrieb (WiM Strom) – 12 Prüf-IDs
Die vier Prozesse des Messstellenbetriebs (Wechselprozesse im Messwesen), jeweils als Anfrage/
Bestätigung/Ablehnung-Trio:
- **10.1 Kündigung MSB** (55039/55040/55041): BGM **E35**, STS+7++**E03**; Antwort-Codelisten
  **S_0090** (Bestätigung Kündigung MSBS) / **S_0054** (Ablehnung Kündigung MSB).
- **10.2 Anmeldung MSB** (55042/55043/55044): BGM **E01**, STS+7++**E01**; **S_0055** / **S_0056**.
- **10.3 Verpflichtungsanfrage/Aufforderung NB an gMSB** (55168/55169/55170): BGM **E01**,
  STS+7++**E01**; **S_0063** / **S_0064**.
- **10.4 Beendigung MSB** (55051/55052/55053): BGM **E02**, STS+7++**E01**; **S_0059** / **S_0060**.

Gemeinsame Struktur: BGM je Prozesskategorie, STS+7 mit dem passenden Grund, SG5 **LOC+Z17**
(Messlokation; alternativ LOC+Z16 Marktlokation als Entweder-Oder), Antwort-PIDs mit **STS+E01**
(Prüfschritt-Code + S_00xx-Codeliste) und **RFF+TN**. Antwortcodes A01 (Zustimmung) / A99 (Ablehnung)
sind cluster-repräsentative Vertreter. Die Zähleinrichtungs-/Geräte-Nutzdaten (SG8 SEQ+Z03 /
CAV+Z30 u. a.) sind – wie bei den GPKE-Prozessen – der nächste Vertiefungsschritt.

Verifikation: Golden 143/143, domsim OK, Selbstvalidierung nur erwartete Leerfeld-Findings, Browser
fehlerfrei, Gas 21/21 unberührt. Damit sind GPKE-Kapitel 8–9 und WiM-Kapitel 10 abgedeckt.

## Neu: Restliche Strom-Fälle – Kapitel 11 (Modell 2) + Kapitel 13 (MaBiS) + Nachträge (46 Prüf-IDs)
Damit ist der **UTILMD AHB Strom vollständig** (189/189 Prüf-IDs).

**Kapitel 11 – Modell 2** (GPKE-artig, Anfrage/Antwort, LOC+Z16 Marktlokation): 11.1 Anmeldung
(55238/55239, BGM E01, EBD E_0510), 11.2 Beendigung der Zuordnung (55240/55241, BGM E44, E_0511),
11.3 Abmeldung (55242/55243, BGM E02, E_0512). Zusätzlich Stammdaten auf ORDERS / aufgrund Änderung /
Antwort (55074/55075/55076, BGM E03). Alle mit STS+7++E03.

**Kapitel 13 – MaBiS-Anwendungsübersichten** (34 PIDs): Aktivierungs-, Deaktivierungs-, Clearinglisten-
und Zuordnungsprozesse rund um den MaBiS-Zählpunkt. Charakteristisch: **BGM je Prozessart**
(Z07 Aktivierung/Deaktivierung MaBiS-ZP, Z05 Clearingliste, Z17 Zuordnungsermächtigung, Z18
Profildefinition, Z37 DZÜ-Liste, Z71 Zuordnung ZP der NGZ zur NZR, E40 Bilanzkreiszuordnungsliste) und
**kein STS+7-Transaktionsgrund** (Ausnahme DZÜ-Liste: ZP3). Der MaBiS-Zählpunkt wird über **SG5 LOC+Z15**
referenziert; Antwort-PIDs tragen STS+E01 mit prozess-spezifischer EBD (E_0004…E_0102) und RFF+TN.

Dafür ergänzt: BGM-Codes Z05/Z07/Z17/Z18/Z37/Z71/E40 in der Codeliste und eine **Generator-Anpassung**,
die STS+7 nur noch bei vorhandenem Transaktionsgrund emittiert (MaBiS-/Listennachrichten erzeugen so
kein leeres STS+7). Nachgetragen wurde außerdem **55611** (Beendigung der Zuordnung, 8.11) und **55066**
(Antwort Lieferantenclearingliste, im AHB-Header vorhanden, in der PID-Übersichtsliste fehlend).

Verifikation: Golden **189/189**, domsim OK, Selbstvalidierung nur erwartete Leerfeld-Findings (kein
unbekannter Code), Headless-Browser-Stichproben je Prozessart fehlerfrei, alle JS `node --check`-sauber,
Gas 21/21 unberührt.

## Neu: Nutzdaten-Vertiefung (SG6 Verwendungszeitraum + SG8/SG10 CCI/CAV)
Die bisher als „Struktur-Kern" belassenen Nutzdaten sind jetzt AHB-konform ausmodelliert – inkl. einer
grundlegenden **Korrektur**: Die frühere Abrechnungsdaten-Annahme (SG8 SEQ+Z45 / SG9 QTY+Z38 / OBIS
PIA+5) war **nicht** AHB-konform. Der AHB trägt die Abrechnungs- und Stammdatennutzdaten stattdessen
über zwei Mechanismen:

**1. Verwendungszeitraum der Daten (SG6 RFF+Z49/Z53 + DTM+Z25/Z26).** Die Daten gelten für einen
Zeitraum, der als eigene SG6-Gruppe getragen wird:
`RFF+<Qualität>::<Zeitraum-ID>` (Qualität Z49 „Gültige Daten" / Z53 „Keine Daten", Zeitraum-ID in
DE1156) gefolgt von `DTM+Z25:<ab>:303` und `DTM+Z26:<bis>:303`. Die zugehörige Antwortnachricht
referenziert die Zeitraum-ID in **STS+E01** als DE9012 (z. B. `STS+E01++A01:E_0610+1`). Aktiv für
Abrechnungsdaten (ZX2/ZX3/ZX4) und Stammdatenänderung (ZX5–ZY2, ZAM). Neue RFF-Qualifier Z47/Z49/Z53/
Z54/Z55 in der Codeliste.

**2. Geänderte Stammdaten je Objektart (SG8 SEQ + SG10 CCI/CAV).** Datengetrieben über `rule.nutzdaten`:
`SEQ+<Objektcode>` (NeLo Z51, MaLo Z01, MeLo Z18, …) eröffnet die Objekt-Datengruppe, je Merkmal ein
`CCI+++<Merkmal>` (Merkmal in DE7037) und je Merkmalswert ein `CAV+<Code>:::<Wert>` (Wert in DE7110,
identische Konvention wie der Produktpaket-Block). Repräsentativ ausmodelliert: der **zugeordnete
Marktpartner** (`CCI+++ZB3` / `CAV+Z91:::<MSB-MP-ID>`) für die NB→LF-Änderungen von NeLo (55615), MaLo
(55616) und MeLo (55620). Weitere Objekte/Merkmale sind über denselben `nutzdaten`-Block erweiterbar.

**3. Engine-Fundament: Release-Zeichen-Escape.** Der EDIFACT-Parser (`_engine/validator.js`,
`parseSegment`) respektiert das Release-Zeichen `?` jetzt auch bei der **Komponenten**-Zerlegung – OBIS-
artige Werte wie `1-1?:1.8.0` bleiben eine Komponente, während DTM-Werte (`…?+00`) unverändert bleiben.
Damit ist die früher blockierte OBIS-Trennung technisch gelöst und für künftige PIA/OBIS-Nutzdaten
nutzbar.

Verifikation: Golden Strom 189/189 und Gas 89/89 (Gas durch die Verwendungszeitraum-/Nutzdaten-Logik
unberührt, da Gas-Gründe die Auslöser nicht treffen), domsim beide ALLE OK, Selbstvalidierung ohne
unbekannte Codes/Aufbaufehler, Headless-Browser fehlerfrei, alle JS `node --check`-sauber.

## Nutzdaten-Vertiefung – vollständige Tiefe (Punkte 1–4)
Die zuvor als „Struktur-Kern" belassenen Nutzdaten sind jetzt durchgängig ausmodelliert:

**1a Stammdatenänderung-Merkmalsmatrix** – Zentraler `_nutzdaten-katalog.js` (je Transaktionsgrund →
Objektart) liefert die geänderten Stammdaten für alle ~28 Änderungs-Anfragen automatisch: SG8 SEQ+
<Objektcode> (NeLo Z51, MaLo Z01, MeLo Z18, TR Z52, SR Z62) + SG10 CCI+++<Merkmal>/CAV+<Code>[:::<Wert>].
Kern-Merkmale je Objekt: zugeordneter MSB (ZB3/Z91), Spannungsebene (E03), messtechnische Ausstattung
(Z83/Z52), Empfänger (Z89/Z10), TR-Art (ZH2/ZE6), Profilschar (Z12/E01).

**1b Abrechnungsdaten** – Klarstellung: Keine UTILMD-Abrechnungsnachricht (55218 …) trägt SG9-Mengen/
OBIS; die Messwerte laufen über MSCONS. Die vollständige UTILMD-Nutzlast ist der Verwendungszeitraum
(RFF+Z49/Z53 + DTM+Z25/Z26), bereits umgesetzt.

**1c GDA-Rückdaten** – Die „Antwort auf GDA" (55035/55095/55060/55194) liefert jetzt SG8 SEQ+ZD5 +
**PIA+5 mit OBIS-Kennzahl** (`PIA+5+1-1?:1.8.0:SRW` bzw. `2.8.0` für Erzeugung) + SG10 CCI/CAV.

**1d 9.3.8 / 1e MaBiS / 1f Modell 2 / 1g Anmeldung** – repräsentative, AHB-verankerte SG8/SG10-Nutzdaten
je Bereich (9.3.8: SEQ+Z76 + OBIS; MaBiS 55062/63: SEQ+Z01; Modell 2 55238/42: SEQ+Z38; Anmeldung
55077/55600/55601: SEQ+Z01). Insgesamt **42 Strom-PIDs** mit SG8/SG10-Nutzdaten.

**2 Echte EBD-Antwortcodes** – Aus `ebd_codelisten.txt` extrahiert und je EBD gesetzt: GPKE z. B. A03
(E_0614), A11 (E_0607 Abmeldung), A10 (E_0609), A31/A43 (E_0624), A09 (E_0615/E_0608), A51/A07 (E_0623/
E_0622), A02 (E_0510). WiM (S_-Codelisten): E15 (Zustimmung ohne Korrekturen) / E14 (Ablehnung Sonstiges).
Für die E_0408-Familie (Stammdatenänderung/Abrechnung/BK-Treue) ist **A01 = „Empfänger übernimmt die
Stammdaten"** – der bisherige Platzhalter war hier bereits korrekt.

**3 Bedingungslogik** – Der maschinen-prüfbare Overlay wurde von 6 auf **19 Bedingungen** erweitert
(STS-Ergänzung ZAP/ZW0–ZW8/ZX1, BGM-abhängig [301]/[315]); der Validator wertet jetzt auch `wennBgm`
aus. Freitext-Hinweise bleiben informativ.

**4 Optionale/bedingte Segmente** – Ablehnungen erzeugen jetzt automatisch die vom AHB ([48]) geforderte
**FTX+ABO-Begründung**; die FTX-Bemerkung (ACB) bleibt als optionales Feld verfügbar. Die restlichen
optionalen Segmente sind datengetrieben über `rule.segments` erweiterbar.

Verifikation: Golden Strom 189/189 und Gas 89/89, domsim beide ALLE OK, Selbstvalidierung ohne unbekannte
Codes/Aufbaufehler, Headless-Browser fehlerfrei über alle vertieften Bereiche, alle JS `node --check`-sauber.
