// domsim.js - Generator-Regression: erzeugt alle PIDs des Ziels und prüft
// UNT-Segmentzähler und Testflag. Aufruf: node _engine/tests/domsim.js
const { ladeGenerator, standardZiel } = require('./harness');

const { engineDir, dataDir } = standardZiel();
const G = ladeGenerator(engineDir, dataDir);

let allOk = true;
for (const pid of G.pids) {
    const out = G.generiere(pid).split('\n');
    const bgm = out.find(s => s.startsWith('BGM+'));
    const sts7 = out.find(s => s.startsWith('STS+7'));
    const stsE01 = out.find(s => s.startsWith('STS+E01'));
    const unt = out.find(s => s.startsWith('UNT+'));
    const unhIdx = out.findIndex(s => s.startsWith('UNH+'));
    const untIdx = out.findIndex(s => s.startsWith('UNT+'));
    const untOk = unt && parseInt(unt.split('+')[1]) === (untIdx - unhIdx + 1);
    const testflag = out.find(s => s.startsWith('UNB+')).endsWith("++++++1'");
    console.log(`${pid}: ${bgm} | ${sts7} | ${stsE01 || '(keine STS+E01)'} | ${unt} UNTok=${untOk} Testflag=${testflag}`);
    if (!untOk || !testflag) allOk = false;
}
console.log('\nGesamt:', allOk ? 'ALLE OK' : 'FEHLER');
process.exit(allOk ? 0 : 1);
