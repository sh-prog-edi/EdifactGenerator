"""Vergleicht die Ausgabe des Roh-tc-Lesers mit der kohlrahbi-Referenz."""
import sys, json, glob, re, collections
sys.path.insert(0,'werkzeuge')
import nested_ahb_reader as N

def norm(s): return re.sub(r'\s+','',(s or ''))

def vergleiche(docx_pfad, kohl_glob):
    res=N.read_document(docx_pfad)
    koh={}
    for p in glob.glob(kohl_glob):
        d=json.load(open(p)); koh[d['meta']['pruefidentifikator']]=d
    gem=sorted(set(res)&set(koh))
    perfekt=0; probleme=[]
    for pid in gem:
        a=res[pid]['lines']; b=koh[pid]['lines']
        if len(a)!=len(b): probleme.append((pid,'Zeilen',len(a),len(b))); continue
        bad=[i for i,(x,y) in enumerate(zip(a,b))
             if (x['segment_code'] or '')!=(y['segment_code'] or '') or (x['data_element'] or '')!=(y['data_element'] or '')
             or (x['segment_group_key'] or '')!=(y['segment_group_key'] or '') or norm(x['ahb_expression'])!=norm(y['ahb_expression'])
             or {norm(x['value_pool_entry']),norm(x['name'])}!={norm(y['value_pool_entry']),norm(y['name'])}]
        if bad: probleme.append((pid,'Felder',len(bad),bad[:4]))
        else: perfekt+=1
    return res, koh, gem, perfekt, probleme

if __name__=='__main__':
    res,koh,gem,perfekt,probleme=vergleiche(sys.argv[1], sys.argv[2])
    print(f"nested={len(res)} kohlrahbi={len(koh)} gemeinsam={len(gem)} fehlend={sorted(set(koh)-set(res))}")
    print(f"fachlich deckungsgleich: {perfekt}/{len(gem)}")
    for p in probleme[:25]: print("  ",p)
