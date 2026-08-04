// _format.js - Format-/Sparten-Konfiguration für die zentrale Engine (Gas).
// Gas-Marktpartner-IDs: vom DVGW vergeben beginnen mit 98 (Codevergabestelle 332),
// von GS1 vergeben mit 4 (Codevergabestelle 9). Gilt für UNB (DE0007) und NAD (DE3055).
const formatConfig = {
    sparte: 'GAS',
    unhKennung: 'UTILMD:D:11A:UN:G1.1',
    // Marktpartner-ID-Vorbelegung (13-stellig, DVGW 98..).
    defaultAbsender: '9800000000001',
    defaultEmpfanger: '9800000000002',
    // Codevergabestelle je MP-ID-Präfix: UNB DE0007 + NAD DE3055.
    //   98.. -> DVGW (NAD 332), 4.. -> GS1 (NAD 9). UNB DE0007: 500 (dt. MP-ID) bzw. 14 (GS1).
    codevergabe: [
        { prefix: '98', unb: '500', nad: '332', name: 'DVGW' },
        { prefix: '4',  unb: '14',  nad: '9',   name: 'GS1' }
    ]
};
if (typeof module !== 'undefined') module.exports = formatConfig;
