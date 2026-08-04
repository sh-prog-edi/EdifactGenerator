# UTILMD Gas – Umsetzungsstand

Stand: 02.08.2026 · Quellen: AHB UTILMD Gas G1.1 (Formatstand 202604) und G1.2 (202610),
dazu die zugehörigen MIG. Umgesetzt sind **88 Prüf-IDs im Formatstand 202604** und
**89 im Formatstand 202610** — jeweils der vollständige AHB.

Die Extraktion läuft heute maschinell über `werkzeuge/extrahiere_alle.py` (DOCX-Fassung);
die unten beschriebenen Textauszüge stammen aus der ersten Aufbauphase.

## Erledigt
- **Bedingungsdatenbank: alle 146 AHB-Gas-Bedingungen** extrahiert
  (`202610/Stammdaten/UTILMD/Gas/pruef-ids/_bedingungen.js`), Qualitäts-Gate 0 Fehler.
  Verteilung: 88 Voraussetzungen, 40 Hinweise, 11 Format, 7 Wiederholbarkeiten.
  1 handverifizierter Override ([505], `scripts/overrides_gas.json`).
- Extraktor/Generator sind jetzt formatspezifisch (`--overrides`, `--logik`, `--format`);
  Strom reproduziert unverändert (614).

## Prüflogik-Overlay Gas (erledigt)
- `scripts/logik_gas.json` (23 maschinell prüfbare Bedingungen), in `Gas/pruef-ids/_bedingungen.js`
  verdrahtet. Struktur formatgerecht für Gas:
  - **wennStsGrund** (5): Transaktionsgrund-abhängig, `STS+7++<Code>` mit Polarität
    (vorhanden/nicht vorhanden) – z. B. [9] ZE4, [78] E02, [7] ZG9/ZH1/ZH2.
  - **wennStsStatus** (10): Antwortstatus-abhängig, `STS+E01++<Code>` – z. B. [13] Z01, [15] Z34,
    [361] A03/A04, [367] A04.
  - **gegensegment** (1): Entweder-Oder [138] LOC+172 (Meldepunkt).
  - **kardinalitaet/bezug** (7): [2061] genau1 je SG4 IDE; [2119] je SG8 SEQ+Z13; [2284] je LOC+172;
    [2335] je SEQ+Z02; [2286]/[2287]/[2353] mind. einmal.
- Hinweis: Gas gatet über den Transaktionsgrund bzw. Antwortstatus (nicht über eine separate
  STS-Ergänzung wie Strom ZW3/ZW4). Der Validator konsumiert diese Felder zusammen mit den
  PID-Regeln (nächster Schritt) – die Engine wird dafür generisch um wennStsGrund/wennStsStatus
  erweitert.

## PID-Landschaft Gas
- **89 Prüfidentifikatoren (44001–44183)** – anderes Schema als Strom (dort 55xxx).
- Bereiche: GeLi Gas (Kap. 5), WiM (Kap. 6), Netzbetreiberwechsel (Kap. 7).
- Gleiches AHB-Tabellenformat wie Strom (Segmentzeilen mit Muss/X + Bedingungsspalten je PID),
  d. h. Nachrichtensyntax + Abhängigkeiten je PID sind analog zu Strom aufbaubar.

## Offen (nächster Schritt)
- Prozess-Meta + PID-Regeln je Gas-PID (BGM, STS+7-Transaktionsgründe, EBD, Antwortcodes,
  Muss-Segmente, zulässige Qualifier) – analog zu Strom.
- Umfang/Priorisierung der 89 PIDs ist mit dem Nutzer abzustimmen.

## Kern-PIDs GeLi Gas – UMGESETZT (21 PIDs)

Voll aufgebaut, gegen AHB/MIG verifiziert und getestet:

| Prozess (AHB-Kap.) | Gas-PIDs | BGM | Transaktionsgrund | EBD (Codeliste Gas) |
|---|---|---|---|---|
| 5.6 Anmeldung durch LF | 44001–44003 | E01 | E01 (Ein-/Auszug) | G_0011 |
| 5.5 Abmeldung durch LF | 44004–44006 | E02 | E01 | G_0007 |
| 5.4 Abmeldung NB an LF | 44007–44009 | E02 | Z33 (Auszug Stilllegung) | G_0067 |
| 5.7 Abmeldeanfrage | 44010–44012 | E02 | E01 | G_0009 |
| 5.9 Grund-/Ersatzversorgung | 44013–44015 | E01 | E06 (Ersatzbelieferung) | G_0013 |
| 5.3 Kündigung zwischen LF | 44016–44018 | E35 | E03 (Wechsel) | G_0006 / G_0005 |
| 5.8 Informationsmeldung Zuordnung | 44036–44038 | E44 | Z26 / ZG9 / ZH1 | (Meldung, keine Antwort) |

Aufgebaut je PID: BGM-Code, STS+7-Transaktionsgrund, STS+E01-Antwortcode + EBD-Referenz,
Muss-Segmente, Meldepunkt LOC+172, Bedingungen. Dateien in `Gas/pruef-ids/`:
`_format.js` (UNH-Kennung UTILMD:D:11A:UN:G1.2, sparte GAS), `_prozess-meta.js`,
`_pid-registry.js`, `_bedingungen.js` (146 + Overlay), 21 PID-Regeldateien. Generator-Seite
`Gas/index.html`, Landing-Manifest-Eintrag „UTILMD Gas (AHB G1.2)".

**Engine formatübergreifend gemacht:** `ahbRulesByPrufId`/`formatConfig` kommen jetzt aus der
Datenschicht (nicht der Engine); UNH-Kennung, Sparte und LOC-Qualifier sind parametrisiert;
der Validator konsumiert das Gas-Overlay generisch (`wennStsGrund`/`wennStsStatus`/
Entweder-Oder [138]) - Strom bleibt dabei bit-genau unverändert (Golden 21/21).

**Verifikation:** node --check über alle JS grün; Strom- UND Gas-Golden je 21/21 reproduzierbar;
Selbstvalidierung zeigt nur die erwarteten leeren Muss-Platzhalter; Headless-Chromium: beide
Generator-Seiten laden ohne Skriptfehler und erzeugen gültige Nachrichten.

### Hinweis zu Antwortcodes
Die konkreten STS+E01-Antwortcodes (A-/Z-Codes) stammen aus den Gas-EBD (Codelisten G_00xx),
die NICHT Teil der bereitgestellten MIG/AHB-PDFs sind. Die gesetzten Codes sind cluster-korrekte,
im AHB belegte Repräsentanten; die Nachrichten-STRUKTUR (BGM, Transaktionsgrund, EBD-Referenz,
Antwort ja/nein) ist gegen den AHB verifiziert. Bei Bedarf die Gas-EBD-Codelisten nachreichen,
dann setze ich die exakten Antwortcodes je Prüfschritt.

## Ausbaubar danach
Bestandslisten (44019–44021), Stornierung (44022–44024), Stammdaten-/Geschäftsdaten (5.10–5.14), WiM (Kap. 6), Netzbetreiberwechsel (Kap. 7).

## Reproduktion Gas-Bedingungen
```bash
pdftotext -layout UTILMD_AHB_Gas_1_2_*.pdf utilmd_ahb_gas.txt
python3 scripts/extract_bedingungen.py utilmd_ahb_gas.txt gas_bedingungen.json --overrides scripts/overrides_gas.json
python3 scripts/generate_bedingungen_js.py gas_bedingungen.json \
    202610/Stammdaten/UTILMD/Gas/pruef-ids/_bedingungen.js \
    --logik scripts/logik_gas.json --format "UTILMD-Gas-AHB (G1.2, Fehlerkorrektur 20260629)"
```

## Marktpartner-Codevergabe Gas (DVGW/GS1)
Gas-MP-IDs: DVGW-vergeben beginnen mit **98** (Codevergabestelle **332**), GS1-vergeben mit
**4** (Codevergabestelle **9**). Umgesetzt in `Gas/pruef-ids/_format.js` (`codevergabe`):
NAD+MS/MR DE3055 = 332 (DVGW) bzw. 9 (GS1); UNB DE0007 = 500 (dt. MP-ID) bzw. 14 (GS1);
Default-MP-IDs 98… Beispiel: `NAD+MS+9800000000001::332'`, `UNB …+9800000000001:500+…`.

## Vollständigkeit Prüf-IDs (neu): alle 89 AHB-Gas-PIDs umgesetzt
Abgleich gegen AHB Gas (alle Prüfidentifikator-Header), MIG und PID-Übersicht: der AHB Gas enthält
**89 Prüf-IDs**, die jetzt **vollständig** umgesetzt sind (zuvor 21 Kern-PIDs). Neu ergänzt (68 PIDs):

| Kap. | Prozess | Prüf-IDs | BGM | Grund | EBD |
|---|---|---|---|---|---|
| 5.1 | Bestandslisten | 44019–44021 | E03 | ZD0 | G_0002 |
| 5.2 | Stornierungsmeldung | 44022–44024 | E01 | E05 | G_0003 |
| 5.10 | Stammdatenänderung vom Verantwortlichen | 44109–44124, 44159–44161, 44175/44176 (+44116/44117) | E03 | ZE6–ZI9 | G_0016…G_0026 |
| 5.12 | Stammdatenanfrage vom Berechtigten | 44137–44167, 44180–44182 | E03 | ZF3–ZJ1 | G_0031…G_0047 |
| 5.13/5.14 | Geschäftsdatenanfrage (Antwort, LF/MSB) | 44035, 44060 | Z14 | Z40 | (Infomeldung) |
| 6.1 | Kündigung Messstellenbetrieb | 44039–44041 | E35 | E03 | G_0051 |
| 6.2 | Anmeldung Messstellenbetrieb | 44042–44044 | E01 | E01 | G_0053 |
| 6.3 | Verpflichtungsanfrage (NB an gMSB) | 44168–44170 | E01 | E01 | G_0070 |
| 6.4 | Beendigung Messstellenbetrieb | 44051–44053, 44183 | E02 | E01 | G_0057/G_0058 |
| 7.1 | Änderungsmeldung Messlokationen an MSB | 44101/44102 | Z22 | Z15 | (Meldung) |
| 7.2 | Änderungsmeldung Marktlokationen an LF | 44103–44105 | Z22 | Z15 | (STS+E01 ohne EBD) |

Struktureller Kern analog Strom: Rahmen + BGM je Prozess + STS+7++Grund + **LOC+172** (Meldepunkt) +
Antwort-PIDs mit STS+E01 (Antwortcode A03 Zustimmung / ZC5 Ablehnung + Gas-EBD G_xxxx) und RFF+TN. Die
GDA-Antwort (5.13/5.14) ist eine Informationsmeldung (BGM Z14, kein STS+E01). Die konkreten geänderten/
angefragten Stammdaten-Nutzdaten je Objektart sind – wie bei Strom – der nächste Vertiefungsschritt.

**Engine-Anpassung:** STS+E01 wird jetzt auch **ohne EBD-Nummer** (nur Antwortcode) emittiert – nötig für
Gas 7.2, wo die Antwort keinen G_-EBD trägt. Zusätzlich umgesetzt: 44116/44117 (im AHB-Header vorhanden,
in der PID-Übersichtsliste fehlend). Die Gas-Codevergabe (DVGW 98/332, GS1 4/9) bleibt in UNB/NAD aktiv.

Verifikation: Golden **Gas 89/89** und **Strom 189/189** unverändert, domsim beide ALLE OK, Selbst-
validierung nur erwartete Leerfeld-Findings (Gas hat keine Codeliste → keine Unbekannt-Prüfung),
Headless-Browser-Stichproben je Kapitel fehlerfrei, alle JS `node --check`-sauber.
