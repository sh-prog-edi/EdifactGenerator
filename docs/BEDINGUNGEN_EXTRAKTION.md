# AHB-Bedingungsdatenbank – Extraktion

Stand: 02.08.2026 · beschreibt das Verfahren; die Zahlen unten beziehen sich auf den
Formatstand 202610 (UTILMD Strom). Aktuell hinterlegt sind:

| Ziel | Bedingungen |
|---|---:|
| UTILMD Strom 202604 | 638 |
| UTILMD Strom 202610 | 614 |
| UTILMD Gas 202604 | 147 |
| UTILMD Gas 202610 | 146 |

Die übrigen Nachrichtentypen führen ihre Bedingungen ebenso in
`<Stand>/<Thema>/<Typ>/pruef-ids/_bedingungen.js`.

Dieses Dokument beschreibt, wie die 614 AHB-Bedingungen (die `[NNN]`-Verweise) aus dem
UTILMD-Strom-Anwendungshandbuch in `<Stand>/Stammdaten/UTILMD/Strom/pruef-ids/_bedingungen.js` gelangt sind, damit
das Ergebnis nachvollziehbar und reproduzierbar ist.

## Ergebnis

614 eindeutige Bedingungen, Verteilung **exakt** wie im AHB erwartet:

| Nummernkreis | Art | Anzahl |
|---|---|---|
| [1]–[499] | Voraussetzungen (hart) | 394 |
| [500]–[899] | Hinweise (informativ) | 139 |
| [901]–[999] | Formatbedingungen | 21 |
| [2000]–[2499] | Wiederholbarkeiten (Kardinalität) | 60 |
| **Summe** | | **614** |

## Warum das schwierig war

Die Bedingungstexte stehen **nicht** in einem separaten Definitionsteil, sondern inline
in der rechten „Bedingungen"-Spalte an jeder Fundstelle wiederholt (~6.300 Roh-Fundstellen
für 614 Bedingungen). Der PDF→Text-Export zerreißt lange Texte über eingerückte
Fortsetzungszeilen, bricht Wörter ohne Trennstrich um und mischt bei engem Spaltenabstand
Inhalte der links liegenden Status-/Ausdrucksspalten ein. Eine naive Regex lieferte nur
413 von 614.

## Verfahren (`scripts/extract_bedingungen.py`)

1. **Definitionsstart erkennen:** `[NNN]` gefolgt von echtem Text. Reine Referenzen in den
   linken Spalten sind von `[` oder Operatoren gefolgt und fallen automatisch heraus.
2. **Gutter-basierte Fortsetzung:** Die Bedingungsspalte ist immer die rechteste Spalte,
   von den übrigen durch einen breiten Leerraum (Gutter, ≥3 Leerzeichen) getrennt. Je
   Folgezeile wird der letzte durch einen Gutter abgetrennte Chunk genommen – drift-tolerant
   gegen die ±2-Zeichen-Spaltendrift des PDF-Exports. Zellgrenze = Leerzeile.
3. **Silbentrennung:** Bindestrich am Zeilenende + Kleinbuchstabe = weiche Trennung (Strich
   entfernen: „Markt-/lokation" → „Marktlokation"); + Großbuchstabe/Ziffer = echtes
   Kompositum (Strich behalten: „Marktlokations-/ID" → „Marktlokations-ID").
4. **Konsens + längster sauberer Text:** Je Nummer wird unter allen Fundstellen der längste
   *saubere* Kandidat mit dem häufigsten Wortanfang gewählt. Damit gewinnt weder eine kurze
   Trunkierung (häufig, aber unvollständig) noch ein Über-Merge (lang, aber mit Bleed,
   Selbstverweis oder abweichendem Wortanfang).
5. **Filter gegen Kontamination:** Bleed (übrig gebliebene Bracket-Fragmente wie „9]"),
   Selbstverweis (eine Definition zitiert nie ihre eigene Nummer), horizontale
   Nachbarspalten-Merges (zweiter Definitionsstart im Text), Front-Trunkierungen
   (Kleinbuchstaben-Anfang) und Statusspalten (Muss/Kann/Soll/X).
6. **Datengetriebene Wortnaht-Reparatur:** Aus dem **gesamten** AHB-Text wird ein Lexikon
   aller intakten langen Wörter (≥7 Zeichen) gebaut. Steht in einem Text „wortA wortB" und
   ist die Zusammensetzung ein belegtes langes Wort (≥12 Zeichen), werden beide zusammen-
   gezogen („tagesparameterabhängig e" → „tagesparameterabhängige"). Kein Wörterbuch von
   Hand – selbstkorrigierend aus dem Dokument.

## Handverifizierte Overrides (23)

Für diese Bedingungen ist keine saubere automatische Rekonstruktion möglich (nur 1–2
Fundstellen mit zu engem Gutter, EBD-Tabellen-Verschachtelung oder „Doppel-x"-Rendering,
bei dem der Text über zwei Spaltenpositionen zerfällt). Jeder Text wurde Fragment für
Fragment aus der rechten Bedingungsspalte des Rohtexts gelesen und mit Zeilenangabe in
`scripts/extract_bedingungen.py` (`MANUELLE_KORREKTUR`) hinterlegt:

> 27, 44, 88, 92, 160, 182, 234, 242, 251, 271, 306, 327, 346, 371, 373, 531, 639, 681, 943, 2000, 2010, 2012, 2015

## Qualitäts-Gate (alle 0)

Bleed · Nachbarspalten-Merge · Selbstverweis · Front-Trunkierung · kombinierendes Trema ·
Wortnaht · unerwartete Kurztexte — **je 0** über alle 614.

## Reproduktion

```bash
# 1) Extraktion (Quelle: Wissensdatenbank utilmd_ahb_strom.txt)
python3 scripts/extract_bedingungen.py <kb>/utilmd_ahb_strom.txt bedingungen_extrakt.json
# 2) JS-Datenbank in den passenden Sparten-Ordner erzeugen
python3 scripts/generate_bedingungen_js.py bedingungen_extrakt.json \
    202610/Stammdaten/UTILMD/Strom/pruef-ids/_bedingungen.js
```

Für weitere Formate/Sparten denselben Ablauf mit dem jeweiligen AHB (z. B.
`utilmd_ahb_gas.txt`) und Zielordner ausführen; ggf. die Spaltengeometrie im Extraktor
an das jeweilige AHB-Layout anpassen.

`_bedingungen.js` ist **generiert** – nicht von Hand editieren, sondern Extraktor/Generator
anpassen und neu erzeugen.

## Prüflogik-Overlay (Engine)

Die Datenbank trägt zusätzlich zum Text die aus dem Nummernkreis abgeleitete `art` sowie
ein Prüflogik-Overlay für die bereits maschinell geprüften Bedingungen:
`gegensegment` ([348]/[349] Entweder-Oder), `wennStsErgaenzung` ([479]/[480]/[481]
STS-abhängig), `maxProVorgang` ([2061] Kardinalität). Das ist der Anknüpfungspunkt für den
nächsten Schritt (generische Prüf-Engine für die maschinell prüfbaren Muster).
