"""
extract_bedingungen.py
-----------------------
Robuster Extraktor für die AHB-Bedingungen ("[NNN] <Text>") aus dem
Klartext-Dump des UTILMD-Strom-Anwendungshandbuchs.

Problem: Die Bedingungstexte stehen NICHT in einem separaten Definitionsteil,
sondern inline in einer rechten "Bedingungen"-Spalte, an vielen Stellen
wiederholt. Der PDF->Text-Export zerreißt lange Texte über eingerückte
Fortsetzungszeilen (inkl. Silbentrennung "Markt-\nlokation").

Strategie (selbstkorrigierend):
  1. Definitionsstart erkennen: "[NNN]" + Whitespace + echter Text-Anfang
     (Buchstabe/Umlaut/Klammer). Reine Referenzen in den linken Spalten sind
     von "[" oder Operatoren gefolgt und werden dadurch NICHT als Definition
     gewertet.
  2. Fortsetzungszeilen spaltentreu einsammeln: Zeilen, deren erstes
     Nicht-Leerzeichen NICHT links der Bedingungsspalte liegt, die nicht leer
     sind und die keine neue "[NNN]"-Zelle beginnen -> gehören zum Text.
     Silbentrennung am Zeilenende ("wort-") wird zusammengezogen.
  3. Mehrheitsentscheid: Dieselbe Bedingung taucht i.d.R. vielfach auf. Alle
     Rekonstruktionen je Nummer werden gesammelt, normalisiert und der
     häufigste (Modus) gewinnt. Fehlrekonstruktionen sind Minderheit.

Aufruf:
    python extract_bedingungen.py <ahb-textdatei> <ausgabe.json>
"""

import sys
import re
import json
from collections import defaultdict, Counter

# Start einer Definition: [NNN] (1-4 Ziffern, KEIN Buchstabensuffix wie 14P)
# gefolgt von >=1 Whitespace und einem echten Textanfang.
DEF_START = re.compile(r'\[(\d{1,4})\]\s+(?=[A-Za-zÄÖÜäöüß(])')
# Beginn irgendeiner Klammerzelle ([NNN] oder [NNNP]) am Zeilenanfang -> neue Zelle/Zeile
CELL_START = re.compile(r'^\s*\[\d{1,4}[A-Z]?\]')
# Seitenfuß/-kopf und Seitenumbruch -> Zelle endet hier.
FOOTER = re.compile(r'(Version:\s|Seite \d+ von|Anwendungshandbuch Strom|\x0c)')
# Bytefolge für "endet mit Trennstrich" (Buchstabe + Bindestrich am Textende)
HYPHEN_END = re.compile(r'[A-Za-zÄÖÜäöüß]-$')


def first_nonspace_col(line):
    m = re.search(r'\S', line)
    return m.start() if m else None


# Trennt Spalten an Läufen von >=3 Leerzeichen.
GUTTER = re.compile(r' {3,}')


def letzter_spalten_chunk(line):
    """Liefert (text, start_spalte) des rechtesten Spalten-Chunks einer Zeile,
    getrennt an Guttern (>=3 Leerzeichen). None, wenn die Zeile leer ist.
    Drift-tolerant: unabhängig von exakter Spaltenposition wird die rechteste
    Spalte (= Bedingungsspalte) genommen."""
    if not line.strip():
        return None, None
    # Position nach dem letzten Gutter
    last = None
    for m in GUTTER.finditer(line):
        last = m.end()
    if last is None:
        # kein Gutter -> ganze Zeile ist ein Chunk
        col = first_nonspace_col(line)
        return line.strip(), col
    return line[last:].strip(), last


def clean(text):
    # Verirrtes kombinierendes Trema (U+0308) entfernen (z. B. "Ü̈" -> "Ü");
    # die Datei nutzt bereits komponierte Umlaute, daher ist ein separates
    # U+0308 immer ein Artefakt.
    text = text.replace('̈', '')
    # Mehrfach-Whitespace zusammenziehen, Rand trimmen.
    return re.sub(r'\s+', ' ', text).strip()


def join_fragment(acc, frag):
    """Fügt ein Fortsetzungsfragment an, respektiert Silbentrennung.
    Heuristik: Bindestrich am Zeilenende + nächstes Fragment beginnt mit
    Großbuchstabe/Ziffer -> echtes Kompositum ("Marktlokations-ID"), Bindestrich
    BEHALTEN. Beginnt es klein -> weiche Silbentrennung ("Markt-\nlokation"),
    Bindestrich ENTFERNEN."""
    acc = acc.rstrip()
    frag = frag.strip()
    if not frag:
        return acc
    if HYPHEN_END.search(acc):
        if frag[0].isupper() or frag[0].isdigit():
            return acc + frag        # Kompositum: "...ions-" + "ID" -> "...ions-ID"
        return acc[:-1] + frag       # weiche Trennung: "Markt-" + "lokation" -> "Marktlokation"
    return acc + ' ' + frag


# Status-/Markierungsspalten, die kein Bedingungstext sind.
STATUS_START = re.compile(r'^(Muss|Kann|Soll)\b|^X\s')
# Wohlgeformtes Bracket-Token (zum Entfernen vor der Bleed-Prüfung).
BRACKET_TOKEN = re.compile(r'\[\d{1,4}[A-Z]?\]')
# Eingebetteter ZWEITER Definitionsstart mitten im Text -> horizontaler Nachbarspalten-
# Merge (zwei Definitionen nebeneinander verschmolzen). Ein In-Text-Verweis wie
# "[266] ∧ [479] an der" wird NICHT erfasst (Folgewort steht nicht in der Startwortliste).
EMBEDDED_DEF = re.compile(r'.\[\d{1,4}\]\s+(Wenn|Hinweis|Format|Es ist|Segment|Je |Einmal|Angabe|Zulässig|Nicht)')

# Systematische PDF-Wortnähte: Zwei sehr lange Fachwörter werden je nach
# Spaltenbreite an WECHSELNDER Stelle mit einem Leerzeichen (statt Trennstrich)
# umbrochen ("grundergän zung", "grunderg änzung", ...). Wir normalisieren jede
# interne Leerzeichen-Variante auf die kanonische Schreibweise.
NAHT_WOERTER = ['Transaktionsgrundergänzung', 'Lokationsbündelstruktur',
                'Wiederholungshäufigkeit', 'Verwendungszeitraum', 'Codeverwendung']
NAHT_PATTERNS = [(re.compile(r'\s*'.join(re.escape(ch) for ch in w)), w)
                 for w in NAHT_WOERTER]

# Manuelle, gegen den AHB-Rohtext verifizierte Overrides je Quelle. Werden extern per
# --overrides <datei.json> geladen (z. B. overrides_strom.json). Nummernbezogene
# Overrides sind FORMATSPEZIFISCH und dürfen nie quellenübergreifend angewandt werden.
MANUELLE_KORREKTUR = {}


def naht_reparieren(t):
    for pat, wort in NAHT_PATTERNS:
        t = pat.sub(wort, t)
    return t


WORT = re.compile(r'[A-Za-zÄÖÜäöüß]{7,}')


def baue_lexikon(lines):
    """Sammelt alle intakten langen Wörter (>=7 Zeichen) aus dem GESAMTEN AHB-Text.
    Ein irgendwo im Dokument intakt vorkommendes Wort dient als Beleg, um dieselbe
    Zeichenfolge an einer schmalen Fundstelle (mit Leerzeichen-Naht) wieder
    zusammenzusetzen - auch wenn jede Bedingungszelle das Wort umbricht."""
    lex = set()
    for line in lines:
        for m in WORT.finditer(line):
            lex.add(m.group(0).lower())
    return lex


def entseam(t, lexikon):
    """Repariert Leerzeichen-Nähte datengetrieben: Steht 'wortA wortB' und ist die
    Zusammensetzung 'wortAwortB' als intaktes Wort im Lexikon belegt (wortA aber
    NICHT als eigenständiges langes Wort), werden beide zusammengezogen. Iterativ,
    da ein Wort mehrfach zerbrochen sein kann."""
    for _ in range(4):
        neu = t
        for m in re.finditer(r'([A-Za-zÄÖÜäöüß]{5,}) ([a-zäöüß]{1,10})(?=\b)', t):
            a, b = m.group(1), m.group(2)
            merged = (a + b).lower()
            # Zusammenziehen, wenn die Fuge ein belegtes LANGES Wort (>=12 Zeichen)
            # ergibt. Echte Wortnähte betreffen lange Komposita; kurze zufällige
            # Verschmelzungen ("Basis"+"von") sind durch die Längenschwelle ausgeschlossen.
            if len(merged) >= 12 and merged in lexikon:
                neu = neu.replace(a + ' ' + b, a + b, 1)
        if neu == t:
            break
        t = neu
    return t


def hat_bleed(t):
    """Erkennt Kontamination aus Nachbarspalten: übrig gebliebene Bracket-Fragmente
    (z. B. '9]' oder '0])') nach Entfernen wohlgeformter [NNN]-Tokens, oder ein
    führender Operator/Klammer-Zu. Legitime In-Text-Verweise ('[266] ∧ [479]')
    bleiben erlaubt."""
    if re.match(r'^\s*[∧∨⊻)]', t):        # beginnt mit Operator/schließender Klammer
        return True
    rest = BRACKET_TOKEN.sub('', t)        # wohlgeformte Tokens raus
    if re.search(r'\d\]', rest):           # übrig: '9]' etc. -> Bracket-Fragment
        return True
    if re.search(r'(?<!\w)\]', rest):      # verwaiste schließende Klammer
        return True
    return False


def ist_gueltiger_text(t):
    """Filtert Status-/Markierungsspalten, Bleed, Nachbarspalten-Merges und
    Front-Trunkierungen heraus. In-Text-[NNN]-Verweise (typisch bei
    Wiederholbarkeiten) sind erlaubt."""
    if not t or len(t) < 4:
        return False
    if STATUS_START.match(t):
        return False
    if hat_bleed(t):
        return False
    if EMBEDDED_DEF.search(t):        # zweiter Definitionsstart -> Nachbarspalten-Merge
        return False
    if t[0].islower():               # beginnt klein -> Front-Trunkierung ("zung Fall 1)")
        return False
    if t[0] == '(':                  # beginnt mit '(' -> Front-Trunkierung (schließt vor '(' fehlt)
        return False
    return True


def extract(lines):
    """Liefert Liste von dicts: nummer, text, quellzeile, breite (längstes Fragment)."""
    candidates = []
    n = len(lines)
    i = 0
    while i < n:
        line = lines[i].rstrip('\n')
        for m in DEF_START.finditer(line):
            nummer = m.group(1)
            bracket_col = m.start()
            first_frag = line[m.end():]          # Text nach "[NNN] " (erstes Fragment)
            text = first_frag
            frag_laengen = [len(first_frag.strip())]
            # Fortsetzungszeilen GUTTER-BASIERT einsammeln: Die Bedingungsspalte ist die
            # rechteste Spalte, von den Status-/Ausdrucksspalten durch einen breiten
            # Leerraum (Gutter) getrennt. Wir nehmen den letzten durch >=3 Leerzeichen
            # abgetrennten Chunk der Zeile - drift-tolerant gegen ±2-Zeichen-Spaltendrift.
            j = i + 1
            while j < n:
                nxt = lines[j].rstrip('\n')
                if nxt.strip() == '':
                    break                      # Leerzeile -> Zelle endet
                if FOOTER.search(nxt):
                    break                      # Seitenfuß/-umbruch -> Zelle endet
                frag, frag_col = letzter_spalten_chunk(nxt)
                if frag is None:
                    break
                # Startet der rechteste Chunk deutlich LINKS der Bedingungsspalte, ist die
                # Bedingungsspalte in dieser Zeile leer -> Zelle endet.
                if frag_col < bracket_col - 12:
                    break
                # Beginnt der Chunk mit einem [NNN]-Token, ist es eine neue Zelle bzw. eine
                # eingerückte Ausdrucksspalte (bei zu engem Gutter) -> Zelle endet. Das
                # trunkiert selten Wiederholbarkeitstexte mit In-Text-Verweis am Zeilen-
                # anfang; dafür verhindert es das Überlaufen in Nachbarzeilen/EBD-Tabellen.
                if CELL_START.match(frag):
                    break
                frag_laengen.append(len(frag))
                text = join_fragment(text, frag)
                j += 1
            candidates.append({
                'nummer': nummer,
                'text': naht_reparieren(clean(text)),
                'zeile': i + 1,
                'breite': max(frag_laengen) if frag_laengen else 0,
            })
        i += 1
    return candidates


def qualitaet(t):
    """Qualitätsmerkmale eines Kandidatentexts (höher = besser)."""
    kein_bleed = 0 if hat_bleed(t) else 1
    klammern_ok = 1 if t.count('(') == t.count(')') else 0
    beginnt_gross = 1 if (t[:1].isupper() or t[:1] == '(') else 0  # echter Satzanfang
    return (kein_bleed, klammern_ok, beginnt_gross)


def prefix(text, k=3):
    """Erste k Tokens (space-getrennt) als Konsens-Signatur. k=3, damit eine
    kurze Trunkierung ("Es ist die") und die Vollform ("Es ist die Zeitraum-ID
    ...") dieselbe Signatur teilen und die Vollform per Länge gewinnt."""
    return ' '.join(text.split()[:k])


def klammern_ok(t):
    return t.count('(') == t.count(')')


def majority(candidates):
    """Je Nummer: KONSENS-PRÄFIX + LÄNGSTER SAUBERER Text.
    Der korrekte Text ist der längste saubere Kandidat, der mit dem häufigsten
    Wortanfang beginnt. So gewinnt weder eine kurze Trunkierung (häufig, aber
    unvollständig) noch ein Über-Merge (lang, aber mit abweichendem/seltenem
    Wortanfang, Selbstverweis oder Bleed)."""
    by_num = defaultdict(list)
    for c in candidates:
        by_num[c['nummer']].append(c)

    result = {}
    stats = {}
    for nummer, cands in by_num.items():
        selbstref = re.compile(r'\[%s\]' % re.escape(nummer))
        # 1) saubere Kandidaten: gültig (kein Bleed/Status), KEIN Selbstverweis
        #    (eine Definition zitiert nie ihre eigene Nummer -> sonst Spalten-Bleed).
        #    Klammer-Ausgeglichenheit ist KEIN harter Filter (manche AHB-Texte haben
        #    legitim unbalancierte Klammern), sondern nur weiche Präferenz.
        clean_c = [c for c in cands
                   if ist_gueltiger_text(c['text'])
                   and not selbstref.search(c['text'])]
        pool = clean_c if clean_c else cands
        # 2) Konsens-Präfix (häufigster 3-Token-Anfang, gewichtet nach Vorkommen).
        pref_freq = Counter(prefix(c['text']) for c in pool)
        konsens = pref_freq.most_common(1)[0][0]
        mit_konsens = [c for c in pool if prefix(c['text']) == konsens]
        # 3) längster Text mit Konsens-Präfix (vollständigste Rekonstruktion);
        #    Gleichstand über Klammer-Ausgeglichenheit, dann exakte Text-Häufigkeit.
        txt_freq = Counter(c['text'] for c in mit_konsens)
        best = max(mit_konsens, key=lambda c: (len(c['text']),
                                               klammern_ok(c['text']),
                                               txt_freq[c['text']]))
        result[nummer] = best['text']
        stats[nummer] = {
            'breite': best['breite'],
            'laenge': len(best['text']),
            'fundstellen': len(cands),
            'gueltige_fundstellen': len(clean_c),
            'konsens_praefix_anteil': pref_freq[konsens],
            'kein_bleed': 0 if hat_bleed(best['text']) else 1,
            'klammern_ok': 1 if klammern_ok(best['text']) else 0,
        }
    return result, stats


def art(nr):
    n = int(nr)
    if 1 <= n <= 499:
        return 'voraussetzung'
    if 500 <= n <= 899:
        return 'hinweis'
    if 901 <= n <= 999:
        return 'format'
    if 2000 <= n <= 2499:
        return 'wiederholbarkeit'
    return 'unbekannt'


def main():
    # Argumente parsen: zwei Positionals (src, out) + optional --overrides <datei>.
    global MANUELLE_KORREKTUR
    argv = sys.argv[1:]
    positional, overrides_file, i = [], None, 0
    while i < len(argv):
        a = argv[i]
        if a == '--overrides':
            overrides_file = argv[i + 1]; i += 2; continue
        if a.startswith('--overrides='):
            overrides_file = a.split('=', 1)[1]; i += 1; continue
        positional.append(a); i += 1
    if len(positional) != 2:
        print(__doc__)
        print("\nOptional: --overrides <datei.json>  (formatspezifische, verifizierte Overrides)")
        sys.exit(1)
    src, out = positional

    # Formatspezifische Overrides laden (nur wenn angegeben). Nummernbezogene Overrides
    # gelten NUR für ihre Quelle (z. B. Strom) und dürfen nicht auf andere Formate wirken.
    if overrides_file:
        MANUELLE_KORREKTUR = json.load(open(overrides_file, encoding='utf-8'))

    with open(src, encoding='utf-8') as f:
        lines = f.readlines()

    candidates = extract(lines)
    # Datengetriebene Naht-Reparatur: Lexikon aus allen Kandidaten bauen, dann jede
    # Kandidaten-Naht zusammenziehen (kollabiert Naht-/Nicht-Naht-Varianten VOR der Auswahl).
    lexikon = baue_lexikon(lines)
    for c in candidates:
        c['text'] = entseam(c['text'], lexikon)
    result, stats = majority(candidates)

    # Manuelle, gegen den Rohtext verifizierte Overrides einspielen.
    for nummer, text in MANUELLE_KORREKTUR.items():
        if nummer in result:
            result[nummer] = text
            stats[nummer]['override'] = True

    # Nach Nummer sortiert ausgeben
    ordered = {}
    for nummer in sorted(result, key=lambda x: int(x)):
        ordered[nummer] = {
            'text': result[nummer],
            'art': art(nummer),
            **stats[nummer],
        }

    with open(out, 'w', encoding='utf-8') as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)

    # Statistik nach Art
    per_art = Counter(art(nr) for nr in ordered)
    print(f"Kandidaten-Fundstellen gesamt: {len(candidates)}")
    print(f"Eindeutige Bedingungsnummern:  {len(ordered)}")
    print("Nach Art:")
    for a in ('voraussetzung', 'hinweis', 'format', 'wiederholbarkeit', 'unbekannt'):
        print(f"  {a:16s}: {per_art.get(a, 0)}")
    # Wieviele mit nur 1 Fundstelle (potenziell unsicher)?
    einzeln = [nr for nr in ordered if ordered[nr]['fundstellen'] == 1]
    unsauber = [nr for nr in ordered
                if not ordered[nr]['kein_bleed'] or not ordered[nr]['klammern_ok']]
    print(f"Nur 1 Fundstelle (unsicher):   {len(einzeln)}")
    print(f"Rest-unsauber (Bleed/Klammer): {len(unsauber)}")
    print(f"-> geschrieben nach {out}")


if __name__ == '__main__':
    main()
