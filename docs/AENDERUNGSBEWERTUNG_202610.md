# Änderungsbewertung Formatstand 202610 (gültig ab 01.10.2026)

Bewertung des Übergangs **202604 → 202610** über alle verarbeiteten Nachrichten-
typen: Welche Änderungen bringen die neuen BDEW-Fassungen (AHB/MIG), und sind sie
in der Prüfgrundlage des Generators abgebildet? Erhebung: Änderungshistorien aus
den konsolidierten DOCX des edi_energy-Spiegels (Hochfrequenz), abgeglichen gegen
die Datenschichten dieses Repositorys. Stand der Auswertung: 12.08.2026.

## Kernbefund

Die **Prüfgrundlage für 202610 ist bereits durchgängig aus den neuen Dokument-
fassungen aufgebaut** — die Auswertung bestätigt das Schicht für Schicht:

- **MIG-Feldebene** (`_engine/daten/mig-formate.js`): je Format aus der neuen
  MIG-Fassung extrahiert (Quelle = neue Datei-ID, s. Tabelle unten).
- **Antwortcodes/EBD** (`_engine/daten/ebd-antwortcodes.js`): 202610 = **EBD 4.3**
  (Datei 12141); 202604 = EBD 4.2.
- **UTILMD-AHB** (`202610/.../_form-meta.js`): Fassung **S2.2 / G1.2**; die
  Fehlerkorrektur 06.08.2026 ist zusätzlich eingearbeitet (Protokoll Abschnitt 60/61).
- **Codelisten** (`_engine/daten/codelisten.js`): standspezifisch geführt
  (`konfigurationen_202610` u. a.).

Es besteht **kein Nachtrag am Prüf-Code**: Alle prüfgrundlagen-relevanten
Änderungen (Feldformate, Feldstatus, Antwortcodes, Codelisten) sind über die
Neu-Extraktion bereits enthalten. Die Bewertung unten weist das je Format nach und
grenzt ab, was systembedingt außerhalb des Validator-Modells liegt.

## Provenienz der MIG-Prüfgrundlage 202610 (Beleg der Neu-Extraktion)

| Format | Quelle (202610) |
|---|---|
| APERAK | `MIG_APERAK_12152_12152.docx` |
| COMDIS | `MIG_COMDIS_1.0g_20260401_99991231_20260401_ooox_11925.docx` |
| CONTRL | `MIG_CONTRL_2.0b_20221001_99991231_20251211_oxox_12006.docx` |
| IFTSTA | `MIG_IFTSTA_12167_12167.docx` |
| INSRPT | `MIG_INSRPT_1.1a_20230330_99991231_20240726_oxox_9355.docx` |
| INVOIC | `MIG_INVOIC_2.8e_20251001_99991231_20251001_ooox_11591.docx` |
| MSCONS | `MIG_MSCONS_12174_12174.docx` |
| ORDCHG | `MIG_ORDCHG_12183_12183.docx` |
| ORDERS | `MIG_ORDERS_12188_12188.docx` |
| ORDRSP | `MIG_ORDRSP_12195_12195.docx` |
| PARTIN | `MIG_PARTIN_12201_12201.docx` |
| PRICAT | `MIG_PRICAT_12207_12207.docx` |
| QUOTES | `MIG_QUOTES_12213_12213.docx` |
| REMADV | `MIG_REMADV_2.9e_20260401_99991231_20260401_ooox_11954.docx` |
| REQOTE | `MIG_REQOTE_1.3c_20251001_99991231_20251001_ooox_11625.docx` |
| UTILMD_GAS | `MIG_UTILMDG_12277_12277.docx` |
| UTILMD_STROM | `MIG_UTILMDS_12270_12270.docx` |
| UTILTS | `MIG_UTILTS_1.1e_20250606_99991231_20241213_xoxx_11171.docx` |

Die Datei-IDs entsprechen den neuen Fassungen (z. B. MSCONS `12174` = MIG 2.5,
APERAK `12152` = MIG 2.2). Unveränderte Formate (CONTRL, COMDIS, INSRPT, INVOIC-MIG,
REMADV, REQOTE-MIG, UTILTS-MIG) behalten korrekt ihre bisherige Quelle.

## Bewertungsrahmen: was der Validator je Nachrichtentyp abbildet

- **UTILMD (Strom/Gas)** — vollständige AHB-Prüfgrundlage je Prüf-ID
  (`_form-meta.js`, `_bedingungen.js`, `_regeln.js`) plus MIG-Feldebene,
  Codelisten, EBD, STS-Struktur. AHB-Regeländerungen wirken hier unmittelbar.
- **Alle übrigen Formate** — Validierung über die **MIG-Feldebene**
  (Format/Status je Datenelement, „N" = nicht benutzt wird als Fehler gemeldet),
  **Codelisten** und **EBD-Antwortcodes**. Es gibt hier bewusst **kein per-PID-
  AHB-Regelwerk**; AHB-reine Regeländerungen (Bedingungen, Muss/Kann je
  Anwendungsfall, PID-Zu-/Abgänge) sind daher informativ, nicht kodiert.

## Format-für-Format

Spalte „echte Änderungen" = Einträge der Änderungshistorie ohne reine Versions-/
Layoutzeilen. „Kernthemen" fasst die Änderungsgründe zusammen.

| Format | AHB (alt→neu) | MIG (alt→neu) | echte Änd. AHB/MIG | Kernthemen | Prüfgrundlage 202610 |
|---|---|---|---|---|---|
| UTILMD Strom | S2.1→S2.2 | S2.1→S2.2 | 218/40 | Bedingung/Status, PID hinzugefügt/entfernt, Codeliste/Antwortcod | AHB S2.2/G1.2 + MIG neu; Fehlerkorr. 06.08 (Abschn. 60) |
| UTILMD Gas | G1.1→G1.2 | G1.1→G1.2 | 7/5 | Bedingung/Status, Kontaktdaten-Konzept, WiM Gas 2.0, Codeliste/A | AHB S2.2/G1.2 + MIG neu; Fehlerkorr. 06.08 (Abschn. 60) |
| MSCONS | 3.1g→3.2 | 2.4c→2.5 | 9/1 | Bedingung/Status, LFW24-Einführung, Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| APERAK | 1.0→1.1 | 2.1i→2.2 | 15/1 | PID hinzugefügt/entfernt, Kontaktdaten-Konzept, Bedingung/Status | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| IFTSTA | 2.0h→2.1 | 2.0g→2.1 | 16/4 | Codeliste/Antwortcode, WiM Gas 2.0, PID hinzugefügt/entfernt, Ko | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| INVOIC | 1.0a→1.0b | 2.8e (unverändert) | 8/0 | Bedingung/Status | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| ORDERS | 1.1a→1.1b | 1.4b→1.4c | 14/14 | WiM Gas 2.0, Bedingung/Status, PID hinzugefügt/entfernt, Kontakt | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| ORDRSP | 1.1a→1.1b | 1.4b→1.4c | 11/5 | WiM Gas 2.0, Kontaktdaten-Konzept, Bedingung/Status, PID hinzuge | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| ORDCHG | 1.0a→1.1 | 1.1→1.2 | 2/1 | Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| PARTIN | 1.0f→1.1 | 1.0f→1.1 | 9/1 | Bedingung/Status, Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| PRICAT | 2.0f→2.1 | 2.0e→2.1 | 14/3 | Bedingung/Status, Codeliste/Antwortcode, Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| QUOTES | 1.1→1.1a | 1.3b→1.3c | 4/2 | Kontaktdaten-Konzept, Bedingung/Status, PID hinzugefügt/entfernt | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| REQOTE | 1.1→1.2 | 1.3c (unverändert) | 2/0 | Bedingung/Status, Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
| UTILTS | 1.0→1.1 | 1.1e (unverändert) | 19/0 | Bedingung/Status, Codeliste/Antwortcode, Kontaktdaten-Konzept | MIG neu extrahiert; AHB-Regeln außerhalb Modell |
## Kernthemen des Formatstands 202610

Über fast alle Formate ziehen sich dieselben fachlichen Vorhaben:

- **Kontaktdaten-Konzept** („Nutzung der Kontaktdaten"): In den Absender-Gruppen
  entfallen die Kontaktsegmente (CTA/COM) bzw. wechseln auf „nicht vorhanden".
  Betrifft MSCONS, APERAK, IFTSTA, ORDCHG, PARTIN, PRICAT, QUOTES, REQOTE, ORDRSP.
- **WiM Gas 2.0**: Einführung der Marktprozesse im Wechsel-Messstellenbetrieb Gas —
  neue/angepasste Codelisten und Anwendungsfälle (ORDERS, ORDRSP, IFTSTA, UTILMD).
- **LFW24 (Lieferantenwechsel 24 h)**: Einführungsszenario mit Anpassungen an
  BGM/RFF/Antwortkategorien (MSCONS, ORDERS, ORDRSP).
- **GWA/Smartmeter-Gerätewechsel**: automatisierter Gerätewechsel/Geräteübernahme
  (QUOTES, ORDRSP, PRICAT).
- **PID-Zu-/Abgänge**: einzelne Prüfidentifikatoren entfallen oder kommen hinzu
  (z. B. IFTSTA 21015/21024/21026; diverse in UTILMD).

## Verifikation (Stichproben)

1. **Kontaktdaten-Konzept ist abgebildet.** Feldvergleich `mig-formate.js`
   202604→202610: bei MSCONS, APERAK und PARTIN sind die CTA/COM-Felder der
   Absender-Gruppe entfernt (z. B. MSCONS `CTA 3139`/`COM 3148` von belegt → nicht
   mehr im Layout). Die MIG-Änderung ist damit in der Prüfgrundlage wirksam.
2. **Antwortcodes aktuell.** `ebd-antwortcodes.js` 202610 = EBD 4.3 (Datei 12141),
   350 EBD; 202604 = EBD 4.2. Änderungen an Antwortcode-Bäumen (ORDRSP-AJT, APERAK,
   WiM-Gas-Codelisten) sind über die EBD-4.3-Extraktion enthalten.
3. **UTILMD auf S2.2/G1.2.** `202610/.../_form-meta.js` führt durchgängig die
   Prüf-ID-Version S2.2; die Fehlerkorrektur 06.08.2026 ist zusätzlich eingearbeitet
   (Änd-ID 27512 u. a., Protokoll Abschnitt 60/61).

## UTILMD im Detail

UTILMD trägt die mit Abstand größten Änderungsmengen (Strom-AHB 218, -MIG 40;
Gas-AHB 7, -MIG 5 echte Einträge). Da für UTILMD das vollständige per-Prüf-ID-
Regelwerk generiert wird, sind diese Änderungen bereits über die S2.2/G1.2-Fassung
in `_form-meta.js`/`_bedingungen.js`/`_regeln.js` enthalten. Die separat gemeldete
Fehlerkorrektur 06.08.2026 (Abschnitt 60) sitzt fachlich obenauf. Eine zeilenweise
Wiedergabe der 218 Strom-Einträge ist hier nicht sinnvoll; maßgeblich ist, dass die
Prüfgrundlage auf der Zielfassung steht.

## Abgrenzung: was außerhalb des Validator-Modells liegt

Für die Nicht-UTILMD-Formate bildet der Validator **kein per-Prüf-ID-AHB-Regelwerk**
ab. AHB-reine Änderungen — z. B. neue/entfallene Bedingungen, geänderte Muss/Kann-
Status je Anwendungsfall, PID-Zu-/Abgänge — sind daher **informativ**, aber nicht als
harte Prüfregel kodiert. Geprüft werden diese Formate über die MIG-Feldebene
(Format/Status, „N" = nicht benutzt), die Codelisten und die EBD-Antwortcodes — und
diese drei Schichten sind für 202610 auf den neuen Fassungen. Wer künftig auch die
AHB-Regelwerke dieser Formate maschinell prüfen möchte, müsste den UTILMD-Weg
(Extraktion nach `_form-meta.js`) auf sie ausdehnen — ein eigenes, größeres Vorhaben.

## Fazit

Für den Formatstand 202610 ist **kein Nachtrag an der Prüfgrundlage erforderlich**:
Die MIG-Feldebene, die EBD-Antwortcodes (4.3), die UTILMD-AHB-Fassung (S2.2/G1.2) und
die Codelisten sind bereits aus den neuen BDEW-Dokumenten aufgebaut; die stichproben-
weise Verifikation bestätigt das. Offen bleibt lediglich das grundsätzlich außerhalb
des Modells liegende per-PID-AHB-Regelwerk der Nicht-UTILMD-Formate — bewusst, nicht
versehentlich. Die „None"-Lücke in der Übersicht war ein Label-Problem und ist behoben
(Abschnitt 65).

---
*Erhebung über den edi_energy-Spiegel (Hochfrequenz); Originaldokumente liegen nicht
im Repository. Zahlen „echte Änderungen" ohne reine Versions-/Layoutzeilen.*
