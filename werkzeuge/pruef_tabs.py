import sys, json, glob, re
sys.path.insert(0,'werkzeuge'); import tabs_ahb_reader as T
def norm(s): return re.sub(r'\s+','',(s or ''))
def lauf(docxpfad, kohlglob, zeige=8):
    res=T.read_document(docxpfad)
    koh={}
    for p in glob.glob(kohlglob):
        d=json.load(open(p)); koh[d['meta']['pruefidentifikator']]=d
    gem=sorted(set(res)&set(koh)); perfekt=0; probleme=[]
    for pid in gem:
        a=res[pid]['lines']; b=koh[pid]['lines']
        if len(a)!=len(b): probleme.append((pid,'Zeilen',len(a),len(b))); continue
        bad=[i for i,(x,y) in enumerate(zip(a,b)) if (x['segment_code'] or '')!=(y['segment_code'] or '') or (x['data_element'] or '')!=(y['data_element'] or '') or norm(x['ahb_expression'])!=norm(y['ahb_expression']) or {norm(x['value_pool_entry']),norm(x['name'])}!={norm(y['value_pool_entry']),norm(y['name'])}]
        if bad: probleme.append((pid,'Felder',len(bad),bad[:3]))
        else: perfekt+=1
    print(f"{docxpfad.split('/')[-1][:40]}: eigen={len(res)} kohl={len(koh)} gemeinsam={len(gem)} deckungsgleich={perfekt}")
    for p in probleme[:zeige]: print("    ",p)
    return res,koh,probleme
if __name__=='__main__':
    lauf(sys.argv[1], sys.argv[2])
