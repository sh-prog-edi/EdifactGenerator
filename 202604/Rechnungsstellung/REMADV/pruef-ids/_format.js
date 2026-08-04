// _format.js - Format-Konfiguration REMADV (Formatstand 202604), automatisch generiert.
const formatConfig = {
    format: "REMADV",
    unhKennung: "REMADV:D:05A:UN:2.9e",
    defaultAbsender: '9900000000001',
    defaultEmpfanger: '9900000000002',
    codevergabe: [
        { prefix: '99', unb: '500', nad: '293', name: 'BDEW' },
        { prefix: '4',  unb: '14',  nad: '9',   name: 'GS1' }
    ]
};
if (typeof module !== 'undefined') module.exports = formatConfig;
