// _format.js - Format-Konfiguration INVOIC (Formatstand 202604), automatisch generiert.
const formatConfig = {
    format: "INVOIC",
    unhKennung: "INVOIC:D:06A:UN:2.8e",
    defaultAbsender: '9900000000001',
    defaultEmpfanger: '9900000000002',
    codevergabe: [
        { prefix: '99', unb: '500', nad: '293', name: 'BDEW' },
        { prefix: '4',  unb: '14',  nad: '9',   name: 'GS1' }
    ]
};
if (typeof module !== 'undefined') module.exports = formatConfig;
