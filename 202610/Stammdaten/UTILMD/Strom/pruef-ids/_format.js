// _format.js - Format-/Sparten-Konfiguration für die zentrale Engine (Strom).
const formatConfig = {
    sparte: 'STROM',
    unhKennung: 'UTILMD:D:11A:UN:S2.2',
    // Marktpartner-ID-Vorbelegung (13-stellig, BDEW 99..).
    defaultAbsender: '9900000000001',
    defaultEmpfanger: '9900000000002',
    // Codevergabestelle je MP-ID-Präfix: UNB DE0007 + NAD DE3055.
    codevergabe: [
        { prefix: '99', unb: '500', nad: '293', name: 'BDEW' },
        { prefix: '4',  unb: '14',  nad: '9',   name: 'GS1' }
    ]
};
if (typeof module !== 'undefined') module.exports = formatConfig;
