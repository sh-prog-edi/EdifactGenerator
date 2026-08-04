// _format.js - Format-Konfiguration UTILTS (Formatstand 202610), automatisch generiert.
const formatConfig = {
    format: "UTILTS",
    unhKennung: "UTILTS:D:18A:UN:1.1e",
    defaultAbsender: '9900000000001',
    defaultEmpfanger: '9900000000002',
    codevergabe: [
        { prefix: '99', unb: '500', nad: '293', name: 'BDEW' },
        { prefix: '4',  unb: '14',  nad: '9',   name: 'GS1' }
    ]
};
if (typeof module !== 'undefined') module.exports = formatConfig;
