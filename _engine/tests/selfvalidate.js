// selfvalidate.js - Selbstvalidierung: erzeugt jede PID und validiert sie mit der Engine.
// Erwartet werden nur die dokumentierten "Fehler" bei leeren Muss-Datumsfeldern und den
// Entweder-Oder-LOC-Bedingungen. Aufruf: node _engine/tests/selfvalidate.js
const { ladeGenerator, standardZiel } = require('./harness');

const { engineDir, dataDir } = standardZiel();
const G = ladeGenerator(engineDir, dataDir);

let gesamt = 0;
for (const pid of G.pids) {
    const msg = G.generiere(pid);
    const r = G.validiere(msg, pid);
    const f = r.findings.filter(x => x.level === 'FEHLER');
    if (f.length > 0) {
        gesamt += f.length;
        console.log(`${pid}: ${f.length} Fehler`);
        f.forEach(x => console.log('    ' + x.seg + ': ' + x.msg.slice(0, 55)));
    } else {
        console.log(pid + ': OK');
    }
}
console.log('\nGesamt Fehler über alle PIDs:', gesamt);
