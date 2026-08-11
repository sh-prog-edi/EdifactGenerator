# Prüfnachweis — Gegenprobe an echten Marktnachrichten

Dieser Vermerk hält fest, **gegen welche realen Prüf-Identifikatoren** der
Generator/Validator an echten, im Markt gelaufenen Nachrichten gegengeprüft
wurde — als dauerhafter Nachweis der Abdeckung. Die Nachrichten selbst und etwaige
Erwartungsdateien werden **bewusst nicht** im Repository hinterlegt:

- Sie enthalten (auch anonymisiert) potenziell noch echte Zählerstände oder
  Rechnungsdaten.
- Ihre Relevanz ist durch die wiederkehrenden Formatumstellungen zeitlich
  begrenzt; ein eingecheckter Bestand veraltet planbar.

Die Referenz-Testsuite (`npm run referenz`) läuft daher weiterhin nur lokal gegen
den Ordner `referenznachrichten/` (bzw. `EDIGEN_REFERENZEN`); Beschaffung und
Ablage: `docs/REFERENZNACHRICHTEN.md`. Methodik der Zerlegung/Bewertung:
Protokoll Abschnitte 49–52, Auswertung in `docs/REFERENZ_BEFUNDE_20260811.md`.

## Lauf vom 11.08.2026

Korpus: 23 anonymisierte Übertragungsdateien aus Lieferantensicht, sämtlich
Formatstand **202604**. Nach Zerlegung in Einzelnachrichten (je UNH) und
UTILMD-Vorgänge (je RFF+Z13): **1491 Einheiten, alle fehlerfrei** (0
Fehler-Befunde; 92 informative Hinweise). Die dabei aufgedeckten
Validator-Präzisierungen sind in den Protokoll-Abschnitten 50–52 umgesetzt.

### Geprüfte Prüf-IDs

| Typ | Sparte | Prüf-ID | Anwendungsfall (Kurz) | geprüfte Nachrichten | Ergebnis |
|---|---|---|---|---|---|
| UTILMD | Strom | 55001 | Anmeldung verbrauchende MaLo | 1 | fehlerfrei |
| UTILMD | Strom | 55002 | Bestätigung Anmeldung verb. MaLo | 1 | fehlerfrei |
| UTILMD | Strom | 55010 | Anfrage Beendigung der Zuordnung | 1 | fehlerfrei |
| UTILMD | Strom | 55036 | Existierende Zuordnung | 1 | fehlerfrei |
| UTILMD | Strom | 55037 | Beendigung der Zuordnung | 1 | fehlerfrei |
| UTILMD | Strom | 55126 | Abrechnungsdaten BK-Abr. verb. MaLo | 1 | fehlerfrei |
| UTILMD | Strom | 55218 | Abrechnungsdaten NNA | 1 | fehlerfrei |
| UTILMD | Strom | 55220 | Rückmeldung/Anfrage Abr.-Daten NNA | 1 | fehlerfrei |
| UTILMD | Strom | 55650 | Änderung Daten der MaLo | 1 | fehlerfrei |
| UTILMD | Strom | 55653 | Änderung Daten der MeLo | 1 | fehlerfrei |
| UTILMD | Gas | 44001 | Anmeldung Netznutzung | 1 | fehlerfrei |
| UTILMD | Gas | 44016 | Kündigung beim alten Lieferanten | 1 | fehlerfrei |
| UTILMD | Gas | 44017 | Bestätigung Kündigung | 1 | fehlerfrei |
| MSCONS | — | 13002 | Zählerstand (Gas) | 1 | fehlerfrei |
| MSCONS | — | 13010 | Normiertes Profil | 1 | fehlerfrei |
| MSCONS | — | 13017 | Zählerstand (Strom) | 1143 | fehlerfrei |
| MSCONS | — | 13019 | Energiemenge (Strom) | 1 | fehlerfrei |
| INVOIC | — | 31001 | Abschlagsrechnung | 75 | fehlerfrei |
| INVOIC | — | 31004 | Stornorechnung | 1 | fehlerfrei |
| INVOIC | — | 31005 | Rechnung | 1 | fehlerfrei |
| INVOIC | — | 31006 | Selbst ausgestellte Rechnung | 13 | fehlerfrei |
| REMADV | — | 33001 | Zahlungsavis/Bestätigung | 2 | fehlerfrei |
| APERAK | — | (ohne Prüf-ID) | Anwendungsfehler-/Empfangsquittung | 239 | fehlerfrei |
| CONTRL | — | (ohne Prüf-ID) | Syntax-Empfangsbestätigung | 1 | fehlerfrei |

Die Zahl der geprüften Nachrichten ist die je Prüf-ID/Typ zerlegte Einheitenzahl
im Korpus (Sammeldateien mit vielen gleichartigen Nachrichten schlagen
entsprechend hoch zu Buche). APERAK und CONTRL tragen keinen Prüf-Identifikator
(RFF+Z13); sie werden über die UNH-Kennung erkannt.

## Fortschreibung

Kommt weiteres reales Material hinzu (andere Prüf-IDs, weitere Sparten, neue
Formatstände, die dokumentierten blinden Flecken NB↔MSB / MSB↔MSB / NB↔ÜNB), wird
dieser Vermerk um eine datierte Zeile/Tabelle ergänzt — wieder ausschließlich als
Nachweis „welche Prüf-ID wurde real gegengeprüft", ohne Nachrichteninhalt.
