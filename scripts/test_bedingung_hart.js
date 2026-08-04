// test_bedingung_hart.js - ahbicht-gestützte harte Muss-Prüfung (Kleene-Logik).
const V=require("../_engine/ahb-validator.js");
let fails=0; const ok=(b,t)=>{console.log((b?"  OK  ":" FAIL ")+t); if(!b)fails++;};

const meta={ instanzen:[
  { sg:null, seg:"BGM", expr:"Muss", section:"Beginn", des:[] },
  { sg:null, seg:"DTM", expr:"Muss [900]", section:"Datum bedingt", des:[] },
]};
const ctx={ meta, pruefi:"TEST",
  condTree:{ "[900]": {c:"900"} },
  bedingungen:{ "900": {text:"Wenn RFF+ACW vorhanden", art:"voraussetzung", check:{tag:"RFF",qual:"ACW",neg:false}} }
};
const baue=segs=>["UNB+UNOC:3+9900000000001:500+9900000000002:500+261001:0800+REF++++++1'",
  "UNH+REF+ORDERS:D:09B:UN:1.4c'",...segs,"UNT+"+(segs.length+2)+"+REF'","UNZ+1+REF'"].join("\n");
const run=t=>V.validiere(V.parse(t),ctx);

// A) Bedingung [900] erfüllt (RFF+ACW vorhanden), DTM fehlt -> HART
let r=run(baue(["BGM+E01+REF'","RFF+ACW:123'"]));
ok(r.fehlendeMuss.some(x=>x.startsWith("DTM")&&/Bedingung erfüllt/.test(x)),
   "RFF+ACW vorhanden, DTM fehlt -> harter Fehler (Bedingung erfüllt): "+JSON.stringify(r.fehlendeMuss));

// B) Bedingung NICHT erfüllt (kein RFF+ACW), DTM fehlt -> KEINE Meldung
r=run(baue(["BGM+E01+REF'","RFF+ZZZ:1'"]));
ok(!r.fehlendeMuss.some(x=>x.startsWith("DTM")) && !r.bedingteMuss.some(x=>x.startsWith("DTM")),
   "RFF+ACW nicht vorhanden -> DTM nicht erforderlich, keine Meldung");

// C) Qualifier-Position unbekannt -> Warnung (nie falsch hart)
const ctx2=Object.assign({},ctx,{bedingungen:{"900":{text:"x",art:"voraussetzung",check:{tag:"ZZZ",qual:"Q1",neg:false}}}});
r=V.validiere(V.parse(baue(["BGM+E01+REF'"])),ctx2);
ok(r.bedingteMuss.some(x=>x.startsWith("DTM")) && !r.fehlendeMuss.some(x=>x.startsWith("DTM")),
   "unbekannter Qualifier -> Warnung, NICHT hart");

// D) ohne condTree/bedingungen -> altes Verhalten (Warnung)
r=V.validiere(V.parse(baue(["BGM+E01+REF'"])),{meta,pruefi:"TEST"});
ok(r.bedingteMuss.some(x=>x.startsWith("DTM")), "ohne Eval-Daten -> Warnung (Abwärtskompatibilität)");

console.log(fails?("\n"+fails+" Test(s) fehlgeschlagen."):"\nAlle Tests der harten Bedingungsprüfung OK.");
process.exit(fails?1:0);
