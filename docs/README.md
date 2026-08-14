# Dokumentation

Stand: 13.08.2026

## Einstieg

| Datei | Inhalt |
|---|---|
| [`UEBERGABE.md`](UEBERGABE.md) | Übergabe an einen Folgechat: Konventionen, Aufbau, Regressionsstand, offene Punkte, Fallstricke. **Der erste Anlaufpunkt.** |
| [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md) | Was umgesetzt ist und was offen bleibt — der beste Einstieg nach der README. |
| [`Pruefid-Abgleich_20260728.md`](Pruefid-Abgleich_20260728.md) | Fortlaufendes Arbeitsprotokoll ab 28.07.2026: je Abschnitt Befund, Quellenlage, Umsetzung, Nachweis. Aktuell 79 Abschnitte. |
| [`AHB-Abgleich_202607.md`](AHB-Abgleich_202607.md) | Arbeitschronik des Ausbaus im Juli 2026 (historisch). |

## Umsetzungsstand je Sparte

| Datei | Inhalt |
|---|---|
| [`STROM_STATUS.md`](STROM_STATUS.md) | UTILMD Strom: umgesetzte Prozesse und Prüf-IDs je Kapitel. |
| [`GAS_STATUS.md`](GAS_STATUS.md) | UTILMD Gas: dasselbe für die Sparte Gas. |
| [`AENDERUNGSBEWERTUNG_202610.md`](AENDERUNGSBEWERTUNG_202610.md) | Was sich zum Formatstand 202610 gegenüber 202604 ändert und wie es umgesetzt wurde. |
| [`MAKO_ABGLEICH_20260805.md`](MAKO_ABGLEICH_20260805.md) | Abgleich des Umfangs gegen das MaKo-Portal (Nachrichtentypen, Prüf-IDs, Dokumentfassungen). |

## Datenbasis und Extraktion

| Datei | Inhalt |
|---|---|
| [`QUELLEN_MANIFEST.json`](QUELLEN_MANIFEST.json) | Maschinenlesbar: welche BDEW-Dokumente (Name, Version, Gültigkeit, fileId) der Datenbasis zugrunde liegen, je Formatstand und Nachrichtentyp. |
| [`BEDINGUNGEN_EXTRAKTION.md`](BEDINGUNGEN_EXTRAKTION.md) | Wie die AHB-Bedingungen (`[NNN]`) aus den Handbüchern in die Datendateien gelangen. |
| [`NEUSTRUKTURIERUNG_PLAN_20260804.md`](NEUSTRUKTURIERUNG_PLAN_20260804.md) | Umbauplan der Datenschicht (Phasen 1–4) und was davon umgesetzt ist. |
| [`ENTSCHEIDUNGSLISTE_PHASE2.md`](ENTSCHEIDUNGSLISTE_PHASE2.md) / [`.csv`](ENTSCHEIDUNGSLISTE_PHASE2.csv) | Einzelentscheidungen des Umbaus mit Begründung. |
| [`Pruefid-Abgleich_20260728.csv`](Pruefid-Abgleich_20260728.csv) | Tabellarische Fassung des Prüf-ID-Abgleichs. |
| [`Pruefid-Abgleich_20260728_Bedingungstexte.json`](Pruefid-Abgleich_20260728_Bedingungstexte.json), [`…_UTILMD-Details.json`](Pruefid-Abgleich_20260728_UTILMD-Details.json) | Rohdaten zum Protokoll. |

## Prüfung und Nachweis

| Datei | Inhalt |
|---|---|
| [`SICHERHEITSAUDIT_20260813.md`](SICHERHEITSAUDIT_20260813.md) | Code-Audit vom 13.08.2026: Bugs und sicherheitsrelevante Lücken, jeweils mit Nachstellung, Behebung und Regressionsnachweis. |
| [`REFERENZNACHRICHTEN.md`](REFERENZNACHRICHTEN.md) | Prüfung gegen echte, anonymisierte Marktnachrichten — Ablage, Aufruf, Grenzen. Die Nachrichten selbst bleiben ausdrücklich lokal. |
| [`REFERENZ_BEFUNDE_20260811.md`](REFERENZ_BEFUNDE_20260811.md) | Befunde aus dem Lauf gegen die Referenznachrichten und ihre Auflösung. |
| [`REFERENZ_PRUEFNACHWEIS.md`](REFERENZ_PRUEFNACHWEIS.md) | Nachweisführung: welche Nachricht welche Regel belegt. |
| [`PRUEFUNG_KAP_8.2.md`](PRUEFUNG_KAP_8.2.md) | Manuelle Prüfliste für den Generator am Beispiel der Anmeldung verbrauchende MaLo. |
| [`PRUEFUNG_VALIDIERUNG.md`](PRUEFUNG_VALIDIERUNG.md) | Manuelle Prüfliste für den Import- und Validierungsteil. |
| [`ISSUES_VORLAGEN.md`](ISSUES_VORLAGEN.md) | Vorlagen für Fehlermeldungen an das Projekt. |

Die automatische Regression steht in `../scripts/` und `../_engine/tests/`; die
Aufrufe sind in der [README](../README.md#regression-versionsfähig) beschrieben.

## Wie die Dokumente zusammenhängen

Die **Prüflisten** (`PRUEFUNG_*.md`) sind für die Bedienung am Bildschirm gedacht — sie
beschreiben, was ein Anwender sieht und erwarten darf. Die **Statusdokumente**
(`STROM_STATUS.md`, `GAS_STATUS.md`) ordnen Prüf-IDs den Geschäftsprozessen des AHB zu.
Das **Arbeitsprotokoll** hält jede fachliche Entscheidung mit ihrer Quelle fest: Wo eine
Nachricht heute anders aussieht als früher, steht dort, welche Stelle im MIG oder AHB den
Ausschlag gab. Das **Quellen-Manifest** sagt, welche Dokumentfassung das war — es ist die
Grundlage für den nächsten Formatstand-Wechsel.
