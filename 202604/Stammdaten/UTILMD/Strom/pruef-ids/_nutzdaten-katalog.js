// _nutzdaten-katalog.js - Zentraler Katalog der geänderten Stammdaten je Objektart (Strom).
// Schlüssel = STS+7-Transaktionsgrund der Stammdatenänderung (Objektart), Wert = SG8/SG10-Nutzdaten.
// Der Generator wendet diesen Katalog auf alle Stammdatenänderungs-ANFRAGEN (art "anfrage") an,
// sofern die PID-Regel nicht selbst ein rule.nutzdaten trägt. Aufbau je Gruppe:
//   { seq: "<DE1229 Objektcode>", merkmale: [ { cci: "<DE7037 Merkmal>",
//       cav: [ { code: "<DE7111>", wert?: "<DE7110-Wert>" } ] } ] }
// Emission: SG8 SEQ+<seq> -> je Merkmal SG10 CCI+++<cci> -> je Wert CAV+<code>[:::<wert>].
// Repräsentative, AHB-verankerte Kern-Merkmale je Objekt (erweiterbar).
const MSB_ID = "9911000000456";   // Beispiel-MP-ID des zugeordneten Messstellenbetreibers
const nutzdatenKatalog = {
    // NeLo (ZX8): zugeordneter MSB + Profilschar (synthetisches Lastprofil)
    "ZX8": [ { seq: "Z51", merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] },   // Zugeordneter MSB
        { cci: "Z12", cav: [ { code: "E01" } ] }                  // Profilschar: synthetisches Lastprofil
    ] } ],
    // MaLo (ZX6): zugeordneter MSB + Spannungsebene + messtechnische Ausstattung
    "ZX6": [ { seq: "Z01", merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] },   // Zugeordneter MSB
        { cci: "E03", cav: [ { code: "E03" } ] },                 // Spannungsebene: Höchstspannung
        { cci: "Z83", cav: [ { code: "Z52" } ] }                  // Messtechnische Ausstattung: iMS
    ] } ],
    // MeLo (ZX7): zugeordneter MSB
    "ZX7": [ { seq: "Z18", merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ],
    // Technische Ressource (ZY0): Empfänger der Daten = Kunde
    "ZY0": [ { seq: "Z52", merkmale: [
        { cci: "Z89", cav: [ { code: "Z10" } ] }
    ] } ],
    // Steuerbare Ressource (ZX9): Art der technischen Ressource = Wallbox
    "ZX9": [ { seq: "Z62", merkmale: [
        { cci: "ZH2", cav: [ { code: "ZE6" } ] }
    ] } ],
    // --- Geschäftsdatenanfrage (9.5): "Antwort auf GDA" liefert die angefragten Stammdaten zurück.
    //     SG8 SEQ (Informative Daten) + PIA+5 OBIS-Kennzahl (Zählwerk) + SG10 CCI/CAV (zugeordneter MSB).
    // ZY7 = verbrauchende MaLo, ZY6 = erzeugende MaLo, ZY4 = an MSB, ZY5 = Strom an Gas.
    "ZY7": [ { seq: "ZD5", pia: { obis: "1-1:1.8.0", art: "SRW" }, merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ],
    "ZY6": [ { seq: "ZD5", pia: { obis: "1-1:2.8.0", art: "SRW" }, merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ],
    "ZY4": [ { seq: "ZD5", merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ],
    "ZY5": [ { seq: "ZD5", merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ],
    // 9.3.8 Daten auf individuelle Bestellung (ZY9): Messstellenbetriebs-Datengruppe + OBIS-Position.
    "ZY9": [ { seq: "Z76", pia: { obis: "1-1:1.8.0", art: "SRW" }, merkmale: [
        { cci: "ZB3", cav: [ { code: "Z91", wert: MSB_ID } ] }
    ] } ]
};
if (typeof module !== 'undefined') module.exports = nutzdatenKatalog;
