"""
generate_bedingungen_js.py
--------------------------
Erzeugt src/pruef-ids/_bedingungen.js aus dem Extraktionsergebnis
(bedingungen_extrakt.json). Das JS ist datengetrieben: alle 614 AHB-
Bedingungstexte als Daten, die maschinell prüfbare Logik (STS-Abhängigkeit,
Gegensegment, Kardinalität) als Overlay je Nummer.

Aufruf: python generate_bedingungen_js.py <extrakt.json> <ausgabe.js>
"""

import sys
import json

# Prüflogik-Overlay: maschinell auswertbare Metadaten je Bedingung. Diese wurden
# einzeln gegen AHB/MIG verifiziert (STS+7-Ergänzung -> Pflicht-LOC, Entweder-Oder,
# Kardinalität). Der Text kommt aus der Extraktion; hier nur die Engine-Felder.
LOGIK = {}  # formatspezifisches Prüflogik-Overlay, extern via --logik <datei.json>

HEADER = '''// _bedingungen.js
// Zentrale, DATENGETRIEBENE Datenbank aller AHB-Bedingungen (die "[NNN]"-Verweise).
//
// Enthält alle {N} im {FORMAT} definierten Bedingungen als Text, plus
// - je Bedingung die aus dem Nummernkreis abgeleitete Art (Voraussetzung/Hinweis/
//   Format/Wiederholbarkeit), und
// - für maschinell prüfbare Bedingungen ein Prüflogik-Overlay (STS-Abhängigkeit,
//   Gegensegment bei Entweder-Oder, Kardinalität).
//
// Die Texte wurden mit scripts/extract_bedingungen.py aus dem AHB-Klartext extrahiert
// (spaltentreue, gutter-basierte Rekonstruktion der rechten Bedingungsspalte, Konsens
// über alle Fundstellen, datengetriebene Wortnaht-Reparatur). {N_OVERRIDE} schwer aus dem
// PDF rekonstruierbare Stellen sind handverifizierte Overrides (in extract_bedingungen.py
// dokumentiert). Diese Datei wird von scripts/generate_bedingungen_js.py erzeugt -
// NICHT von Hand editieren; stattdessen Extraktor/Generator anpassen und neu erzeugen.
//
// NUMMERNKREISE (Allgemeine Festlegungen, Kap. 6.4):
//   [1]   - [499]  Voraussetzungen    -> harte Prüfung
//   [500] - [899]  Hinweise           -> nur informativ
//   [901] - [999]  Formatbedingungen  -> Formatprüfung des Datenelements
//   [2000]- [2499] Wiederholbarkeiten -> Kardinalität
//
// OPERATOREN zwischen Bedingungen (Kap. 6.4.6): ∧ (UND), ∨ (ODER), ⊻ (XODER); runde
// Klammern gewichten. Ein Hinweis innerhalb einer Verknüpfung ist NIE Teil der
// einzuhaltenden Voraussetzung.
//
// Quelle: {FORMAT} + Allgemeine Festlegungen.

// Leitet die Bedingungsart aus dem Nummernkreis ab.
function bedingungsart(nr) {
    const n = parseInt(String(nr).replace(/\\D/g, ""), 10);
    if (/^UB\\d/.test(String(nr))) return "zeitpunkt";
    if (n >= 1 && n <= 499)     return "voraussetzung";   // harte Prüfung
    if (n >= 500 && n <= 899)   return "hinweis";         // nur informativ
    if (n >= 901 && n <= 999)   return "format";          // Formatprüfung
    if (n >= 2000 && n <= 2499) return "wiederholbarkeit"; // Kardinalität
    return "unbekannt";
}

// Prüflogik-Overlay: maschinell auswertbare Metadaten je Bedingung.
//   gegensegment  : Entweder-Oder - das Segment, dessen Fehlen die Bedingung auslöst.
//   wennStsErgaenzung : Bedingung greift nur bei dieser STS+7-Transaktionsgrundergänzung.
//   maxProVorgang : Wiederholbarkeit - erlaubte Höchstzahl je SG4 IDE.
const bedingungLogik = {LOGIK_JSON};

// Alle {N}-AHB-Bedingungstexte (extrahiert; Schlüssel = Bedingungsnummer als String).
const bedingungTexte = {
'''

FOOTER = '''};

// Zusammenführung: Text + abgeleitete Art + (falls vorhanden) Prüflogik-Overlay.
const ahbBedingungen = {};
for (const nr in bedingungTexte) {
    ahbBedingungen[nr] = Object.assign(
        { text: bedingungTexte[nr], art: bedingungsart(nr) },
        bedingungLogik[nr] || {}
    );
}

// Liefert Text zu einer Bedingungsnummer (für Meldungen).
function bedingungText(nr) {
    const b = ahbBedingungen[String(nr)];
    return b ? `[${nr}] ${b.text}` : `[${nr}]`;
}

// Ist die Bedingung eine harte (zu prüfende) Voraussetzung/Wiederholbarkeit/Format?
// Hinweise ([500]-[899]) sind NICHT hart und werden bei der Prüfung übersprungen.
function bedingungIstHart(nr) {
    const art = bedingungsart(nr);
    return art === "voraussetzung" || art === "wiederholbarkeit" || art === "format";
}

if (typeof module !== 'undefined')
    module.exports = { ahbBedingungen, bedingungTexte, bedingungLogik, bedingungText, bedingungsart, bedingungIstHart };
'''


def main():
    global LOGIK
    argv = sys.argv[1:]
    positional, i, fmt_label = [], 0, "UTILMD-AHB"
    while i < len(argv):
        a = argv[i]
        if a == '--logik':
            LOGIK = json.load(open(argv[i+1], encoding='utf-8')); i += 2; continue
        if a.startswith('--logik='):
            LOGIK = json.load(open(a.split('=',1)[1], encoding='utf-8')); i += 1; continue
        if a == '--format':
            fmt_label = argv[i+1]; i += 2; continue
        if a.startswith('--format='):
            fmt_label = a.split('=',1)[1]; i += 1; continue
        positional.append(a); i += 1
    src, out = positional[0], positional[1]
    data = json.load(open(src, encoding='utf-8'))
    nums = sorted(data, key=lambda x: int(x))

    logik_json = json.dumps(LOGIK, ensure_ascii=False, indent=4)
    # Einrückung des Overlays an JS anpassen (schließende Klammer auf Spalte 0 lassen).
    header = HEADER.replace('{LOGIK_JSON}', logik_json)
    header = header.replace('{N}', str(len(nums)))
    header = header.replace('{FORMAT}', fmt_label)
    header = header.replace('{N_OVERRIDE}', str(sum(1 for n in data.values() if n.get('override'))))

    lines = [header]
    for nr in nums:
        text = data[nr]['text']
        # JSON-escaping erzeugt einen gültigen JS-String-Literal (Anführungszeichen etc.).
        lines.append(f'    "{nr}": {json.dumps(text, ensure_ascii=False)},\n')
    lines.append(FOOTER)

    with open(out, 'w', encoding='utf-8') as f:
        f.write(''.join(lines))
    print(f"{len(nums)} Bedingungen -> {out}")


if __name__ == '__main__':
    main()
