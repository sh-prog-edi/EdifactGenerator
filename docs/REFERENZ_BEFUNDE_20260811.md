# Referenz-Testsuite — erste Auswertung an echten Nachrichten (11.08.2026)

Grundlage: 18 anonymisierte, im Markt gelaufene Übertragungsdateien
(Lieferantensicht, Strom/Gas, Formatstand 202604), bereitgestellt vom
Auftraggeber. Werkzeug: `scripts/referenz_validierung.js` (`npm run referenz`)
nach dem Umbau auf Einheiten-Zerlegung (Protokoll Abschnitt 49). Die Nachrichten
selbst bleiben lokal (`referenznachrichten/`), nie im Repo/Chat/CI.

## Lauf-Ergebnis

18/18 Dateien erkannt (Typ, Formatstand, Prüf-ID über RFF+Z13). Nach Zerlegung
in Einzelnachrichten (je UNH) und — bei UTILMD mit mehreren Prüf-IDs — in
Einzelvorgänge: **1384 Einheiten**, davon **230 fehlerfrei**. Zwei Dateien sind
Sammel-Übertragungen (APERAK 224 Nachrichten → nach Korrektur vollständig
fehlerfrei; MSCONS-Lastgang 1143 Nachrichten).

Fehlerfrei bestätigt (Dateien): CONTRL, APERAK (Sammeldatei), UTILMD Strom 55001
(3 Hinweise), 55126, 55010, UTILMD Gas 44001, 44017.

## Kernbefund: alle Rest-Befunde sind Validator-Präzisierungen

Bemerkenswert: **keiner** der Rest-Befunde liegt an der Extraktion oder an den
Nachrichten selbst — alle gehen auf drei Validator-Ursachen zurück. Genau dafür
ist die Suite gebaut.

### Ursache 1 — Segment-Muss wird nicht durch die Segmentgruppen-Pflicht begrenzt

In der AHB-Extraktion trägt ein Segment oft `expr = "Muss"` (innerhalb der
Gruppe ist das Datenelement Pflicht), während die eigentliche Einschränkung an
der **Segmentgruppe** hängt (`sgExpr`, z. B. `Soll […]` oder `Muss [Bedingung]`).
Der Validator stuft das Segment über `mussKlasse(inst.expr)` sofort als „hartes
Muss" ein (ahb-validator.js, Block ab Zeile ~745) und wertet die
Gruppenbedingung dann nicht mehr aus. Folge: Segmente werden als „fehlendes
Muss" gemeldet, die der AHB im konkreten Anwendungsfall gar nicht verlangt.

Belege aus den Referenznachrichten:

| PID | gemeldet | expr (Segment) | sgExpr (Gruppe) | warum nicht erforderlich |
|---|---|---|---|---|
| 55036/55037 | LOC+Z21 (Tranche) | Muss | Muss [2061] ∧ [347] | [347]: nur wenn LOC+Z16 fehlt — Z16 ist vorhanden |
| 55220 | RFF Verwendungszeitraum | Muss | Muss [315] ∧ [707] … | [315]: nur bei BGM+Z88 (Datenclearing) — Nachricht ist BGM+E03 |
| 55220 | RFF Termine der Marktlokation | Muss | Soll [8] | Soll, nicht Muss |
| 55002 | LOC+Z19/Z20 (Steuerbare/Techn. Ressource) | Muss | bedingt | §14a-Ressourcen, hier nicht einschlägig |
| 55218 | CAV+Z22, QTY+Z33, CCI+Z44, CCI+Z38 | Muss | bedingt | Singulär genutzte Betriebsmittel / Temperatur — bedingt |
| 55653/55650 | CCI+Z38, CCI+Z39 | Muss | bedingt | Zählzeitregister/-definition — bedingt |
| 44016 (Gas) | NAD+Z09 (Kunde des LF) | Muss | bedingt | im Storno-/Antwortkontext nicht gefordert |
| 13019 (MSCONS) | RFF+AGI (Referenzangaben) | Muss | Soll [1] ∧ [68] Muss [35] ∧ ([38] ⊻ [113]) | Gruppe Soll bzw. an Bedingung geknüpft |
| 13019 | RFF+AGK (Konfigurations-ID) | Muss | Muss [35] ∧ [132] ∧ [138] | Bedingung nicht erfüllt |
| 13002 | RFF+AGI, RFF+Z30 | Muss | Soll […] | Soll, nicht Muss |
| 13017 | RFF+AGI, RFF+AGK | Muss | Soll […] / Muss [35] ∧ [132] | Soll bzw. bedingt |

Vorgeschlagene Korrektur: Wenn `mussKlasse(inst.expr)` „hart" ergibt, das Segment
aber zu einer Segmentgruppe mit konditionalem oder Soll-Status gehört
(`sgExpr`), muss die **Gruppenbedingung** vorgeschaltet ausgewertet werden
(`bedingungErfuellt(inst.sgExpr)` bzw. Soll ⇒ kein hartes Muss). Nur wenn die
Gruppe erforderlich ist, wird das harte Segment-Muss zum Pflichtbefund. Die
Bausteine dafür (`bedingungErfuellt`, `evalNode`, `segCheck`) sind vorhanden;
sie werden im „hart"-Zweig bisher übersprungen.

### Ursache 2 — DTM-Formatcodes 104 und 304 zu eng hinterlegt

`DTM_FORMATE` (ahb-validator.js Zeile ~214) modelliert zwei Codes falsch:

- **304**: hinterlegt `\d{12}\+00` (aus 303 übernommen), echte Werte tragen
  aber Sekunden: `20260810113506+00` = CCYYMMDDHHMMSS+00 (14 Stellen). MSCONS
  13010 nutzt das regulär.
- **104**: hinterlegt `\d{4}-\d{4}` (mit Bindestrich), echte Werte sind
  `02010204` bzw. `01020102` (8 Ziffern ohne Trenner — zwei MMDD-Grenzen für
  jahreszeitenabhängige Zeiträume). UTILMD 55218/55653 nutzen das regulär.

Vorgeschlagene Korrektur: `"304": /^\d{14}\+00$/` (Sekunden zulassen) und
`"104": /^\d{8}$/` (bzw. zwei MMDD-Paare) — an echten Werten gegenprüfen.

### Ursache 3 — CAV-Aufbau-Hinweis (Einzelfall)

55653: „CAV: Wert '1' an Komponente 5, während das führende DE7111 leer ist —
im MIG-Auszug kein benutztes Datenelement." Einzelbefund an einem speziellen
CAV; MIG-Auszug dieser Stelle prüfen. Niedrige Priorität.

## Arbeitsvorrat (Reihenfolge)

1. **Validator Ursache 1** — Segment-Muss durch Segmentgruppen-Pflicht begrenzen.
   Höchster Hebel (deckt fast alle Rest-Befunde). Bewegt Golden/Selbstvalidierung
   (heute 280/154/259/155 informative Befunde) — Golden-Diff sorgfältig sichten.
2. **Validator Ursache 2** — DTM 104/304 korrigieren. Kleiner, klar umrissen.
3. **Ursache 3** — CAV-MIG-Auszug 55653 prüfen.
4. Nach den Korrekturen erneuter Referenzlauf; stabil fehlerfreie Nachrichten mit
   `<datei>.erwartung.json` (`fehlerfrei: true`) zur Dauer-Referenz erheben.

Keiner der Befunde wird pauschal weggefiltert — die Korrekturen präzisieren den
Validator, die Referenznachrichten werden anschließend als Regressionsanker
gesetzt.
