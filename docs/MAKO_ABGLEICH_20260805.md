# MaKo-Plattform: Erstlauf Dokument-Abgleich und Q&A-Auswertung (05.08.2026)

Werkzeug: `werkzeuge/mako_plattform.py` (lokal; API-Erkundung siehe Protokoll
Abschnitt 47). Dieser Erstlauf wurde über den Chat-Weg (WebFetch) erhoben.

## 1. Dokument-Abgleich gegen QUELLEN_MANIFEST.json (Stand 02.08.2026)

**Fazit: Für die produktiven Formatstände 202604/202610 ist das Manifest aktuell.**
15 Fassungen liegen oberhalb des Manifest-Bestands (fileId > 12277):

**Konsultationsfassungen** (validFrom 31.07.2026, Kommentierungsfrist 31.08.2026,
NICHT normativ — Vorschau auf den künftigen Formatstand):
UTILMD Strom MIG S2.3 (12299) / AHB 2.3 (12298), QUOTES MIG 1.4 (12297) /
AHB 1.2 (12296), ORDRSP AHB 1.1c (12295), ORDERS AHB 1.1c (12294),
IFTSTA MIG 2.1a (12293) / AHB 2.1a (12292), CONTRL MIG 2.0c (12291) /
AHB 1.0a (12290), APERAK MIG 2.2a (12289) / AHB 1.1a (12288).

**UTILMD-Strom-Dateivarianten** (Redaktionsstand 29.06.2026): AHB S2.2 (12279),
AHB S2.1 (12280), MIG S2.2 (12281) — 12279/12281 sind die 202610-Fassungen,
die im Wissensdatenbank-Spiegel bislang fehlten (Manifest-Hinweis
„Reproduktionsweg Abschnitt 7"); Kandidaten für die Ablage im Spiegel.

## 2. Q&A des BDEW-Forums Datenformate — projektrelevante Klarstellungen

Rund 85 veröffentlichte Tickets gesichtet (Archiv größer). Unmittelbar
relevant für Prüfgrundlagen/Validator:

| Ticket | Betrifft | Klarstellung |
|---|---|---|
| 2026-00164 | PRI n..15 | Dezimaltrennzeichen zählt bei Längenprüfung NICHT mit (ISO 9735) |
| 2026-00148 | QTY | bis zu drei Nachkommastellen zulässig, sofern AHB nichts einschränkt |
| 2025-00494 | UTILMD Strom | SG „Daten der Marktlokation" auch bei reinen „Keine-Daten"-Zeiträumen genau einmal Pflicht |
| 2026-00167 | INVOIC | QTY=0 bei Artikel 1-10-4: beide Varianten zulässig — nicht ablehnen |
| 2026-00061 | INVOIC MOA | negative Anpassungsbeträge nicht vorgesehen |
| 2026-00052 | INVOIC/SOR | mind. eine Artikel-ID mit X-Kennzeichnung nötig |
| 2025-00014 | APERAK | mehrere APERAK je Übertragungsdatei zulässig (Anerkennungsmeldungen, seit 06.06.2025) — Bezug offener Punkt B (Interchange-Ebene) |
| 2026-00037 | E_0406 | Abschlussrechnung ohne Abmeldung: Schritt 82, Code A90 — Bezug offener Punkt E |
| 2026-00159 | EBD 4.2 | Kündigung vor Belieferungsbeginn: Antwortcode A06 |
| 2026-00208 | EBD 4.3 | bewusst KEINE Fristablehnung bei E01/E03/Z33 (Ende MSB) |
| 2022-01524 / 2021-01220 | DTM 303 | UTC-Zeitpunkt exakt, keine Tagesende-Uminterpretation — bestätigt unsere MaKo-Zeitdarstellung |

Vollständige Sichtung je Bedarf: `python3 werkzeuge/mako_plattform.py --fragen
[--suche UTILMD]`.

## 3. API-Wissen (für das Werkzeug dokumentiert)

`/api/questions`, `/api/documents`, `/api/topicGroups` offen erreichbar;
DevExtreme-Pagination `?skip=N&take=M`, bei documents zusätzlich
`sort=[{"selector":"fileId","desc":true}]` (URL-kodiert); `totalCount` bei
questions -1 (Gesamtzahl unbekannt); `?topicGroupId`/`searchTerm` werden
ignoriert. Downloads: `/api/downloadFile/<fileId>` (bewusst von Hand).
