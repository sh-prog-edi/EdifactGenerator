# Entscheidungsliste Phase 2.1 — fachliche Befunde der Selbstvalidierung

Stand: 04.08.2026 · Erhebung: `scripts/analyse_selbstvalidierung.js` über alle vier
Golden-Ziele (202604/202610 × Strom/Gas) · Rohdaten: `ENTSCHEIDUNGSLISTE_PHASE2.csv`

> **UMGESETZT am 04.08.2026** (Freigabe des Auftraggebers: alle Empfehlungen).
> Nachmessung: **224 → 0 fachliche Befunde**. Die Quellen-Prüfung E4/E5 am
> Original-AHB S2.1 (via Google Drive) ergab: Die Meta war korrekt — der Fehler lag
> in der Maske (MP-ID an der DE7110- statt DE1131-Position, fehlende MSB-Art; bzw.
> pauschal erzeugte CCI ohne AHB-Grundlage). Details: Protokoll Abschnitt 38.

**224 fachliche Befunde** (Abschnitt 15 nannte 114 — das war nur ein Ziel; jetzt sind
alle vier erhoben), gebündelt in **9 Muster E1–E9**. Nicht enthalten sind die 1.100
informativen „Muss-Segment nicht befüllt"-Befunde (offener Punkt D, erwartbar).

Jedes Muster endet mit einer **Empfehlung** und einer **Entscheidung** zum Ankreuzen.
Grundsatzfrage je Befund: *Erzeugt die Maske zu viel/Falsches* (→ Maske an die
AHB-Meta koppeln) *oder ist die Extraktion unvollständig* (→ Werkzeug nachbessern)?
Bei E4/E5 ist das ohne Blick ins Original-AHB nicht entscheidbar — dafür wird in der
Umsetzungssitzung die Wissensdatenbank gebraucht.

---

## E1 — FTX mit falschem Qualifier ABO statt ACB (32 Befunde, 16 PIDs)

**PIDs:** 44003, 44006, 44009, 44015, 44018, 44024, 55003, 55006, 55009, 55015, 55018,
55024, 55080, 55604, 55605, 55609 (Antwort-/Ablehnungs-PIDs, beide Stände, beide Sparten)

**Befund:** Die Maske erzeugt `FTX+ABO+++Ablehnung - Begruendung (Beispiel)`. Der AHB
führt für diese PIDs das FTX „Bemerkung" mit Qualifier **ACB** (DE4451), z. B. 55003:
`Muss [23]` — „Wenn in dieser SG4 das STS+E01++A05/A99 (Status der Antwort) vorhanden".
`ABO` existiert dort nicht.

**Einordnung:** Maske nutzt einen generischen Platzhalter-Qualifier — dieselbe
Fehlerklasse wie die ZW4/ZW3/ZW5-Listen vom 28.07.

**Empfehlung:** Qualifier datengetrieben aus der Meta setzen (ACB), Bedingung [23]
respektieren (FTX nur bei Ablehnungs-Antwortstatus vorbelegen).

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E2 — FTX erzeugt, obwohl der AHB keines führt (30 Befunde, 15 PIDs)

**PIDs:** 44012, 44041, 44044, 44053, 44105, 44146, 44152, 44164, 44170, 44182, 55012,
55041, 55044, 55053, 55170

**Befund:** Die Maske erzeugt das Ablehnungs-FTX auch bei PIDs, deren AHB gar kein
FTX-Segment führt (Meta: keine FTX-Instanz).

**Empfehlung:** FTX nur erzeugen, wenn die Meta der Prüf-ID es führt.

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E3 — Objektdaten-Block (SEQ/CCI/CAV) ohne AHB-Grundlage (114 Befunde, 28 PIDs)

**PIDs:** 55062, 55063, 55077, 55109, 55110, 55238, 55242, 55553, 55600, 55601,
55615–55693 (Stammdatenänderungs-, Produktpaket-, MaBiS- und Modell-2-PIDs, nur Strom)

**Befund:** Der generische Objektdaten-Block der kuratierten Maske (SEQ+Z01, CCI/CAV
mit Qualifiern Z91, E01, E03, Z52, ZE6, Z10 …) wird pauschal erzeugt. Je nach PID führt
der AHB dort andere Qualifier (z. B. 55077: nur Produktpaket CAV ZH9/ZV4) oder gar
keine Objektdaten (55063: weder SEQ noch CCI noch CAV).

**Einordnung:** Größte Gruppe; klassisches „Maske erzeugt zu viel". Die AHB-Meta kennt
je PID die zulässigen SEQ/CCI/CAV-Instanzen samt Qualifiern — die Kopplung ist also
datengetrieben machbar und ist zugleich der Kern des Phase-2-Umbaus (Feldauswahl statt
Segmentliste).

**Empfehlung:** Objektdaten-Block an die Meta koppeln: nur AHB-geführte
SEQ/CCI/CAV-Qualifier je PID erzeugen; PIDs ohne Objektdaten erzeugen keinen Block.

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E4 — CAV DE7110: MP-ID-Wert vs. Codeliste Z39/Z40/Z41 (13 Befunde, 7 PIDs) ⚠ Quellen-Prüfung nötig

**PIDs:** 55060, 55194, 55615, 55616, 55620, 55627, 55632

**Befund:** Die Maske erzeugt `CAV+Z91:::9911000000456` (MP-ID des
Messstellenbetreibers als Wert). Die Meta führt für dieses CAV („Messstellenbetreiber",
DE7111=Z91) in **DE7110 die Codes Z39/Z40/Z41** (bei 55194 zusätzlich Z19/Z20) — also
Codes statt eines freien MP-ID-Werts.

**Einordnung:** Nicht eindeutig ohne Original-AHB: Entweder gehört die MP-ID laut AHB
in ein anderes Element (dann erzeugt die Maske falsch), oder die Codeliste ist bei der
Extraktion aus einer Nachbarzeile in DE7110 gerutscht (dann ist die Meta falsch und
der Validator meldet zu Unrecht). Die Antwort steht im AHB-Segmentlayout des
CAV „Messstellenbetreiber".

**Empfehlung:** In der Umsetzungssitzung (mit Wissensdatenbank) die betroffene
AHB-Stelle nachschlagen und danach Maske ODER Extraktion korrigieren.

**Entscheidung:** ☐ Quellen-Prüfung so machen ☐ anders: ___________

## E5 — CCI DE7037: Folge-CCI-Codes vs. ZB3/ZA9 (15 Befunde, 6 PIDs) ⚠ Quellen-Prüfung nötig

**PIDs:** 55615, 55618, 55627, 55630, 55684, 55688

**Befund:** Die Maske erzeugt nach dem `CCI+++ZB3` (Zugeordnete Marktpartner) weitere
CCI mit DE7037 = Z12, ZH2, E03, Z83 …; die Meta führt für diese PIDs nur ZB3
(bei 55684 in 202604: ZA9).

**Einordnung:** Wie E4 — entweder erzeugt die Maske CCI-Zeilen, die der AHB dort nicht
vorsieht, oder die Meta hat die weiteren CCI-Instanzen bei der Extraktion nicht erfasst.

**Empfehlung:** Wie E4 — Quellen-Prüfung in der Umsetzungssitzung, danach Maske ODER
Extraktion korrigieren.

**Entscheidung:** ☐ Quellen-Prüfung so machen ☐ anders: ___________

## E6 — NAD DE3055: Codevergabestelle 293 statt 9 (8 Befunde, 4 PIDs)

**PIDs:** 55074, 55075, 55076 (Modell 2: zulässig nur 9), 55194 (zulässig 9, 332)

**Befund:** Die Maske belegt MP-IDs pauschal mit `…::293` (BDEW-Codevergabe). Der AHB
dieser PIDs erlaubt nur **9** (GS1/GLN) bzw. 9/332.

**Empfehlung:** Vorbelegung je PID an die AHB-Codeliste koppeln; bei Code 9 eine
GLN-Beispielnummer verwenden.

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E7 — BGM-Dokumentenname falsch vorbelegt (4 Befunde, 2 PIDs)

**PIDs:** 55074 (erzeugt E03, AHB: **Z14**), 44019 (erzeugt E03, AHB: **E06**)

**Empfehlung:** BGM-Vorbelegung aus der Meta ableiten (statt Prozess-Meta-Pauschale).

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E8 — STS+7 erzeugt, obwohl der AHB keines führt (6 Befunde, 3 PIDs)

**PIDs:** 55074, 44019 (AHB führt gar kein STS), 55224 (AHB führt nur STS+E01
Antwortstatus, die Maske erzeugt zusätzlich `STS+7++ZP3`)

**Empfehlung:** STS+7 nur erzeugen, wenn die Meta es führt.

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

## E9 — SEQ+ZD5 statt ZF3/ZG0 (2 Befunde, 1 PID)

**PID:** 55194 (Antwort auf Geschäftsdatenanfrage gMSB; AHB führt SEQ ZF3 „Daten der
Messlokation" und ZG0 „Smartmeter-Gateway")

**Empfehlung:** SEQ-Qualifier an die Meta koppeln.

**Entscheidung:** ☐ Empfehlung umsetzen ☐ anders: ___________

---

## Zusammenfassung der Empfehlungen

| Muster | Befunde | Charakter | Weg |
|---|---|---|---|
| E1, E2, E3, E7, E8, E9 | 188 | Maske erzeugt zu viel / Platzhalter | datengetrieben an Meta koppeln — Kern des Phase-2-Umbaus |
| E4, E5 | 28 | Maske ODER Extraktion — unklar | Quellen-Prüfung gegen Original-AHB (Wissensdatenbank nötig) |
| E6 | 8 | Vorbelegung | an AHB-Codeliste koppeln |

Die Kopplungs-Muster (E1–E3, E7–E9) sind kein Flickwerk je PID, sondern genau das
Prinzip von Phase 2.2: Die kuratierte Maske wird zur **Sicht auf die Meta** — dann
können solche Abweichungen konstruktionsbedingt nicht mehr entstehen. Die Golden-
Snapshots ändern sich dabei gewollt (Phase 2.5, eigener Prüfblock).

**Nächster Schritt nach deiner Durchsicht:** Entscheidungen eintragen (hier oder in der
CSV), dann Umsetzungssitzung mit Wissensdatenbank (für E4/E5) starten.
