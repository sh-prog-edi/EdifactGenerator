# Referenznachrichten — externe Validierungs-Absicherung (offener Punkt A)

Stand: 04.08.2026 · Werkzeug: `scripts/referenz_validierung.js` (`npm run referenz`)

Alle Prüfgrundlagen des EdifactGenerators sind maschinell aus den BDEW-Dokumenten
gelesen; die Selbstvalidierung prüft nur „Generator gegen eigene Extraktion".
Die wirksamste Gegenprobe sind **echte, im Markt gelaufene Nachrichten**: Befunde
an ihnen zeigen, ob die Extraktion, der Validator — oder die Nachricht — abweicht.
Die Referenz-Testsuite dafür ist gebaut und wartet auf Material.

## Was gebraucht wird (Beschaffung: Auftraggeber)

1. **Echte EDIFACT-Dateien** aus der Marktpartner-Kommunikation, als Roh-Text
   (`.txt`/`.edi`/`.edifact`, eine Übertragungsdatei je Datei, Zeilenumbrüche egal).
   - **Anonymisiert ist ausdrücklich in Ordnung** (Namen, Adressen, MaLo/MeLo,
     Zählernummern fiktiv): Geprüft wird die Struktur, nicht der Inhalt. Beim
     Ersetzen die Feldformate einhalten (MaLo 11-stellig numerisch, MeLo
     33-stellig, MP-ID 13-stellig mit plausiblem Präfix 99/98/4), keine Segmente
     löschen (UNT-Zähler!) und `RFF+Z13` unverändert lassen (Prüf-ID-Erkennung).
   - **Eine Teilmenge genügt** — es braucht NICHT je Prüf-ID eine Nachricht.
     Jede echte Nachricht eicht die gemeinsame Mechanik (Segmentaufbau,
     MIG-Formate, Rahmen, Codelisten); die PID-Vollständigkeit sichern weiter
     die Golden-Nachrichten. Aus **Lieferantensicht** zählen beide Richtungen:
     Gesendetes (An-/Abmeldung, Kündigung, LF-Stammdatenänderungen) UND
     Empfangenes (Antworten des NB, MSCONS, Netznutzungs-INVOIC/REMADV,
     APERAK/CONTRL). Die reine NB↔MSB-Kommunikation (Messstellenbetrieb,
     GDA Kap. 9.5) bleibt damit ein dokumentierter blinder Fleck — Material
     dazu ist willkommen, sobald verfügbar.
   - Bevorzugt **UTILMD Strom/Gas** (Kerngeschäft des Werkzeugs), gern beide
     Formatstände; dazu jede andere verfügbare Art.
   - Auch fachlich „langweilige" Bestätigungen sind wertvoll — sie decken die
     Antwortstrukturen ab.
2. Alternativ oder ergänzend: Zugang zu einem **Fremdvalidator** (kommerzieller
   MaKo-Prüfdienst o. Ä.) — dann werden dieselben Testnachrichten des Generators
   dort gegengeprüft und die Abweichungen verglichen.

## Vertraulichkeit — Ablage strikt außerhalb des Repositorys

Echte Nachrichten enthalten Marktpartner- und ggf. Endkundendaten. Sie gehören
**nie** ins Repository, in einen Chat oder in die CI:

- Standard-Ablage: `<Arbeitsordner>/referenznachrichten/` (Geschwisterordner des
  Repos, wie die Wissensdatenbank), Unterordner frei (z. B. je Absender/Monat).
- Abweichender Ort: Umgebungsvariable `EDIGEN_REFERENZEN` setzen.
- Sicherheitsnetz: `.gitignore` blockt `referenznachrichten/` und `referenz/`
  auch innerhalb des Repos.
- Die Suite läuft nur lokal; fehlt der Ordner, meldet sie das und endet grün —
  Regression und CI bleiben unabhängig davon.

## Verwendung

```bash
npm run referenz                       # Bericht je Nachricht + Zusammenfassung
node scripts/referenz_validierung.js --streng   # Exit 1 bei Befunden (für lokale Gates)
EDIGEN_REFERENZEN=/pfad node scripts/referenz_validierung.js
```

Die Suite erkennt je Datei Nachrichtentyp und Formatstand über die UNH-Kennung
(Validator-Registry) und die Prüf-ID über `RFF+Z13`, lädt die zugehörige
Prüfgrundlage und validiert mit demselben zentralen Validator wie Masken und
`validator.html`. Optional je Nachricht eine Erwartungsdatei
`<datei>.erwartung.json`:

```json
{ "pruefi": "55001", "fehlerfrei": true }
```

Abweichungen von der Erwartung zählen auch im informativen Modus als harte
Befunde.

## Arbeitsweise mit Befunden

Jeder Befund an einer echten Nachricht wird zuerst **fachlich bewertet** und im
Arbeitsprotokoll (`Pruefid-Abgleich_20260728.md`) festgehalten: Liegt die
Abweichung an der Extraktion (Prüfgrundlage nachziehen), am Validator (Prüfung
präzisieren) oder an der Nachricht selbst (dokumentieren)? Pauschales
Wegfiltern ist ausgeschlossen — genau diese Fälle sind der Zweck der Suite.
Aus stabilen, bewerteten Nachrichten entsteht mit `erwartung.json`-Dateien
schrittweise die dauerhafte Referenz-Testsuite.
