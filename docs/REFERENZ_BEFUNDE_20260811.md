# Referenz-Testsuite — erste Auswertung an echten Nachrichten (11.08.2026)

Grundlage: 23 anonymisierte, im Markt gelaufene Übertragungsdateien
(Lieferantensicht, Strom/Gas, Formatstand 202604): UTILMD, MSCONS, INVOIC,
REMADV, APERAK, CONTRL — bereitgestellt vom Auftraggeber in zwei Chargen.
Werkzeug: `scripts/referenz_validierung.js` (`npm run referenz`) nach dem Umbau
auf Einheiten-Zerlegung (Protokoll Abschnitt 49). Die Nachrichten selbst bleiben
lokal (`referenznachrichten/`), nie im Repo/Chat/CI.

## Lauf-Ergebnis

23/23 Dateien erkannt (Typ, Formatstand, Prüf-ID über RFF+Z13). Nach Zerlegung
in Einzelnachrichten (je UNH) und — bei UTILMD mit mehreren Prüf-IDs — in
Einzelvorgänge: **1491 Einheiten**, davon **336 fehlerfrei**. Fünf Dateien sind
Sammel-Übertragungen (APERAK 224 bzw. 15 Nachrichten, INVOIC 75 bzw. 15
Nachrichten, MSCONS-Lastgang 1143 Nachrichten) — alle lösen sich sauber auf.

Fehlerfrei bestätigt (Dateien): CONTRL, beide APERAK-Sammeldateien, beide
REMADV (33001; auch die große mit ~127 DOC-Positionen und UNT+370), eine
INVOIC-Sammeldatei (75 Nachrichten), UTILMD Strom 55001 (3 Hinweise), 55126,
55010, UTILMD Gas 44001, 44017.

**INVOIC und REMADV validieren als Ganzes korrekt.** Die REMADV-Dateien mit
vielen DOC-Positionen (avisierte Rechnungen) und die INVOIC-Sammelrechnungen
(mehrere UNH je UNB) laufen ohne Fehler durch — die Zerlegung je Nachricht und
die Summensegment-Behandlung stimmen. Nur EINE von 15 INVOIC-Nachrichten einer
Datei fällt auf (Storno-/Gutschriftskopf BGM+Z25, PID 31004): gemeldet werden
NAD+ZSH (Netzbetreiberkontonummer), MOA+113 (Vorausbezahlter Betrag) und
MOA+Z01 (Gemeinderabatt) — allesamt Ursache 1 (Segment-Muss, Gruppe bedingt).
Randnotiz: Der Abschnittsname zu NAD+ZSH trägt in der Extraktion ein
versprengtes Leerzeichen („Netzbetreiberkontonumme r") — kosmetische
Bereinigung der Meta, kein Validierungsfehler.

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

1. **Validator Ursache 1 — ERLEDIGT (11.08.2026, Protokoll Abschnitt 50).**
   Segment-Muss wird jetzt durch die Segmentgruppen-Pflicht begrenzt: hart nur,
   wenn Segment UND Gruppe (`sgExpr`) unbedingt Muss sind; sonst greift die
   Gruppenbedingung. Wirkung am Referenzkorpus: Fehler-Befunde 2310 → 5,
   fehlerfreie Einheiten 336 → 1487 (von 1491). Informative Selbstvalidierung
   sank 280/154/259/155 → 135/103/135/104; Golden unverändert, Regression grün
   (32 Läufe), Vertragstests (`test_muss_validierung`, `test_bedingung_hart`)
   unverändert grün.
2. **Validator Ursache 2 — ERLEDIGT (11.08.2026, Protokoll Abschnitt 51).**
   DTM-Formatcodes korrigiert: `304` lässt Sekunden zu (`\d{12}(\d{2})?\+00`),
   `104` akzeptiert zwei MMDD-Grenzen mit optionalem Bindestrich (`\d{4}-?\d{4}`).
   Kein Golden nutzt diese Codes (nur `:303`), daher regressfrei.
3. **Extraktionslücke 55218 CAV+Z22 — ERLEDIGT (11.08.2026, Abschnitt 51).** Das
   zugehörige CCI trägt „Soll [166]", dem CAV fehlte die `sgExpr`. Der Validator
   leitet die Gruppenpflicht eines CAV nun vom vorangehenden CCI derselben Gruppe
   ab (ein Merkmalswert kann nie pflichtiger sein als sein Merkmal) — reproduzierbar,
   ohne Eingriff in die generierten Metas.
4. **Ursache 3 — ERLEDIGT (11.08.2026, Abschnitt 52).** CAV-Composite C889 trägt
   zwei Merkmalswerte DE7110; der Decoder kannte nur den ersten. Whitelist für die
   zweite 7110-Komponente ergänzt (`CAV+:::6:1` ist regelkonform).
5. Erneuter Referenzlauf zeigt jetzt 1491/1491 Einheiten fehlerfrei; stabil
   fehlerfreie Nachrichten mit `<datei>.erwartung.json` (`fehlerfrei: true`) zur
   Dauer-Referenz erheben.

## Ergebnis: Korpus vollständig fehlerfrei

Nach den Korrekturen der Abschnitte 50–52 validieren **alle 1491 Einheiten** des
23-Dateien-Korpus **fehlerfrei** (0 Fehler-Befunde; 92 informative Hinweise
bleiben). Über die Serie: Fehler-Befunde **2310 → 0**.

Keiner der Befunde wird pauschal weggefiltert — die Korrekturen präzisieren den
Validator, die Referenznachrichten werden anschließend als Regressionsanker
gesetzt.
