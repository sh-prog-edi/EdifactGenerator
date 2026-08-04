# Dokumentation

Stand: 02.08.2026

| Datei | Inhalt |
|---|---|
| [`UEBERGABE.md`](UEBERGABE.md) | Übergabe an einen Folgechat: Konventionen, Aufbau, Regressionsstand, offene Punkte, Fallstricke. |
| [`OFFENE_ASPEKTE.md`](OFFENE_ASPEKTE.md) | Was umgesetzt ist und was offen bleibt — der beste Einstieg nach der README. |
| [`Pruefid-Abgleich_20260728.md`](Pruefid-Abgleich_20260728.md) | Fortlaufendes Arbeitsprotokoll ab 28.07.2026: je Abschnitt Befund, Quellenlage, Umsetzung, Nachweis. Aktuell 24 Abschnitte. |
| [`AHB-Abgleich_202607.md`](AHB-Abgleich_202607.md) | Arbeitschronik des Ausbaus im Juli 2026 (historisch). |
| [`STROM_STATUS.md`](STROM_STATUS.md) | UTILMD Strom: umgesetzte Prozesse und Prüf-IDs je Kapitel. |
| [`GAS_STATUS.md`](GAS_STATUS.md) | UTILMD Gas: dasselbe für die Sparte Gas. |
| [`BEDINGUNGEN_EXTRAKTION.md`](BEDINGUNGEN_EXTRAKTION.md) | Wie die AHB-Bedingungen (`[NNN]`) aus den Handbüchern in die Datendateien gelangen. |
| [`PRUEFUNG_KAP_8.2.md`](PRUEFUNG_KAP_8.2.md) | Manuelle Prüfliste für den Generator am Beispiel der Anmeldung verbrauchende MaLo. |
| [`PRUEFUNG_VALIDIERUNG.md`](PRUEFUNG_VALIDIERUNG.md) | Manuelle Prüfliste für den Import- und Validierungsteil. |

Die automatische Regression steht in `../scripts/` und `../_engine/tests/`; die
Aufrufe sind in der [README](../README.md#regression-versionsfähig) beschrieben.

## Wie die Dokumente zusammenhängen

Die **Prüflisten** (`PRUEFUNG_*.md`) sind für die Bedienung am Bildschirm gedacht — sie
beschreiben, was ein Anwender sieht und erwarten darf. Die **Statusdokumente**
(`STROM_STATUS.md`, `GAS_STATUS.md`) ordnen Prüf-IDs den Geschäftsprozessen des AHB zu.
Das **Arbeitsprotokoll** hält jede fachliche Entscheidung mit ihrer Quelle fest: Wo eine
Nachricht heute anders aussieht als früher, steht dort, welche Stelle im MIG oder AHB den
Ausschlag gab.
