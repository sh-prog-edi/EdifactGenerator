# Vereinheitlicht das Design aller Generator-Seiten (Vorbild UTILMD-Generator):
# gemeinsames Stylesheet _engine/edigen.css, globales Theme (_engine/theme.js),
# Top-Bar (Titel + Hell/Dunkel), zweispaltiges Layout (Formular links,
# EDIFACT-Ausgabe rechts).
import re
from pathlib import Path

ROOT = Path('/mnt/user-data/working/edigen/EdifactGenerator')

seiten = sorted(ROOT.glob('20*/*/*/index.html')) + sorted(ROOT.glob('20*/*/UTILMD/*/vollformular.html'))
assert len(seiten) == 36, len(seiten)

for p in seiten:
    rel = '../' * (len(p.relative_to(ROOT).parts) - 1)
    t = p.read_text(encoding='utf-8')
    orig = t

    # 1) Stylesheet: Inline-CSS durch gemeinsames Stylesheet ersetzen
    t = re.sub(r'<style>.*?</style>', f'<link rel="stylesheet" href="{rel}_engine/edigen.css">', t, count=1, flags=re.S)

    # 2) Kopf: theme-toggle in die Top-Bar neben den Titel
    m = re.search(
        r'<div class="wrap">\s*<div class="theme-toggle">\s*(?P<btn>.*?)\s*</div>\s*'
        r'(?P<crumbs><div class="crumbs">.*?</div>)\s*(?P<h1><h1>.*?</h1>)',
        t, re.S)
    assert m, p
    kopf = (f'<div class="wrap">\n  {m.group("crumbs")}\n  <div class="top-bar">\n'
            f'    {m.group("h1")}\n    <div class="theme-toggle">\n      {m.group("btn")}\n    </div>\n  </div>')
    t = t[:m.start()] + kopf + t[m.end():]

    # 3) Zweispaltiges Layout: Container nach dem Untertitel öffnen ...
    t = re.sub(r'(<p class="sub">.*?</p>)\s*\n', r'\1\n\n  <div class="container">\n  <div class="left-panel">\n',
               t, count=1, flags=re.S)
    # ... rechte Spalte ab dem Erzeugen-Panel ...
    t = re.sub(r'(\n\s*)(<div class="panel">\s*<h2>Nachricht erzeugen</h2>)',
               r'\1</div><!-- /left-panel -->\1<div class="right-panel">\1\2', t, count=1)
    # ... und vor dem Footer schließen
    t = re.sub(r'(\n\s*)(<footer)', r'\1</div><!-- /right-panel -->\1</div><!-- /container -->\1\2', t, count=1)

    # 4) Theme: lokale setTheme-Definition raus, globales theme.js rein
    t = re.sub(r"function setTheme\(t\)\{.*?\}\nsetTheme\('light'\);\n", '', t, count=1, flags=re.S)
    t = re.sub(r'(<script src=")', f'<script src="{rel}_engine/theme.js"></script>\n\\1', t, count=1)

    assert t != orig
    for muss in ('edigen.css', 'theme.js', 'top-bar', 'left-panel', 'right-panel', '/container'):
        assert muss in t, (p, muss)
    assert 'function setTheme' not in t, p
    p.write_text(t, encoding='utf-8')
    print('ok', p.relative_to(ROOT))
print(len(seiten), 'Seiten umgestellt')
