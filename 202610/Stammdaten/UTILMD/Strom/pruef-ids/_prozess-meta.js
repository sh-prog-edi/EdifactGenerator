// _prozess-meta.js
// Zentrale, gegen den AHB Strom (Version 2.2, 29.06.2026) verifizierte Metadaten je Prüf-ID.
// Diese Tabelle steuert die datengetriebene EDIFACT-Erzeugung in generator.js.
//
// Felder je PID:
//   kapitel        AHB-Fundstelle
//   rolle          Kommunikationsrichtung (informativ, wird als Hinweis angezeigt)
//   bgm            BGM DE1001 (E01=Anmeldung, E02=Abmeldung, E35=Kündigung)
//   art            "anfrage" | "bestaetigung" | "ablehnung"  (steuert STS+E01 / RFF+TN / EBD)
//   transaktionsgrund   STS+7 DE9013 (1. Statusanlass, z. B. E01/E03) oder null
//   ebd            EBD-Nummer für STS+E01 DE1131 (nur bei Antwortnachrichten) oder null
//   antwortcluster "zustimmung" | "ablehnung" | null  (bestimmt Beispiel-Antwortcode)
//   antwortcode    konkreter Beispiel-Antwortcode aus dem passenden Cluster des jeweiligen EBD
//
// WICHTIG: Die Antwortcodes sind BEISPIELE aus dem jeweils zutreffenden Cluster des EBD.
// Der reale Code hängt vom Prüfergebnis ab; hier wird ein cluster-korrekter Vertreter gesetzt.

const prozessMeta = {
    // --- 8.1 Kündigung zwischen Lieferanten (EBD E_0614) ---
    "55016": { kapitel: "8.1", rolle: "LFN an LFA", bgm: "E35", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55017": { kapitel: "8.1", rolle: "LFA an LFN", bgm: "E35", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0614", antwortcluster: "zustimmung", antwortcode: "A03" },
    "55018": { kapitel: "8.1", rolle: "LFA an LFN", bgm: "E35", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "E_0614", antwortcluster: "ablehnung", antwortcode: "A06" },

    // --- 8.2 Anmeldung einer verbrauchenden Marktlokation (EBD E_0622/E_0623) ---
    // BGM E01 (Anmeldungen). Transaktionsgrund E01 (Ein-/Auszug) oder E03 (Wechsel); Ergänzung ZW4.
    "55001": { kapitel: "8.2", rolle: "LF an NB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55002": { kapitel: "8.2", rolle: "NB an LF", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0623", antwortcluster: "zustimmung", antwortcode: "A51" },
    "55003": { kapitel: "8.2", rolle: "NB an LF", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "E_0622", antwortcluster: "ablehnung", antwortcode: "A07" },

    // --- 8.9 Abmeldung durch den LF an NB (EBD E_0607) ---
    // BGM E02 (Abmeldungen). Transaktionsgrund E01 (Ein-/Auszug/Umzug) - laut AHB-Tabelle;
    // Z33 (Auszug wegen Stilllegung) ist zulässige Alternative. Ergänzung ZW3/ZW4/ZW5.
    // (Korrektur: zuvor fälschlich E03 (Wechsel) - E03 gehört zur ANMELDUNG, nicht zur Abmeldung.)
    "55004": { kapitel: "8.9", rolle: "LF an NB", bgm: "E02", art: "anfrage",
               transaktionsgrund: "E01", ebd: null, antwortcluster: null, antwortcode: null },
    "55005": { kapitel: "8.9", rolle: "NB an LF", bgm: "E02", art: "bestaetigung",
               transaktionsgrund: "E01", ebd: "E_0607", antwortcluster: "zustimmung", antwortcode: "A11" },
    "55006": { kapitel: "8.9", rolle: "NB an LF", bgm: "E02", art: "ablehnung",
               transaktionsgrund: "E01", ebd: "E_0607", antwortcluster: "ablehnung", antwortcode: "A01" },

    // --- 8.10 Abmeldung durch den NB an LF (EBD E_0609) ---
    // NB meldet die Marktlokation beim LF ab. BGM E02. Transaktionsgrund Z33 (Auszug wegen
    // Stilllegung), Ergänzung ZW3/ZW4/ZW5. 55007 = NB an LF (Abmeldung/Beendigung der Zuordnung),
    // 55008/55009 = LF an NB (Bestätigung/Ablehnung).
    // (Korrektur: zuvor fälschlich als 8.9-Fortsetzung mit Grund E03 und getauschten Rollen.)
    "55007": { kapitel: "8.10", rolle: "NB an LF", bgm: "E02", art: "anfrage",
               transaktionsgrund: "Z33", ebd: null, antwortcluster: null, antwortcode: null },
    "55008": { kapitel: "8.10", rolle: "LF an NB", bgm: "E02", art: "bestaetigung",
               transaktionsgrund: "Z33", ebd: "E_0609", antwortcluster: "zustimmung", antwortcode: "A10" },
    "55009": { kapitel: "8.10", rolle: "LF an NB", bgm: "E02", art: "ablehnung",
               transaktionsgrund: "Z33", ebd: "E_0609", antwortcluster: "ablehnung", antwortcode: "A01" },

    // --- 8.8 Anfrage zur Beendigung der Zuordnung (EBD E_0624) ---
    // BGM E02. Transaktionsgrund E01 (Ein-/Auszug) / E03 (Wechsel).
    "55010": { kapitel: "8.8", rolle: "LFA an LFN", bgm: "E02", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55011": { kapitel: "8.8", rolle: "LFN an LFA", bgm: "E02", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0624", antwortcluster: "zustimmung", antwortcode: "A31" },
    "55012": { kapitel: "8.8", rolle: "LFN an LFA", bgm: "E02", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "E_0624", antwortcluster: "ablehnung", antwortcode: "A43" },

    // --- 8.6 Anmeldung zur Grund-/Ersatzversorgung von NB / EoG (EBD E_0615) ---
    // BGM E01. 55013 = Anmeldung/Zuordnung EoG (NB an LF), 55014/55015 = Antwort (LF an NB).
    // Transaktionsgrund E06 (Ersatzbelieferung): Der AHB führt im STS+7 dieser Prüf-IDs als
    // Grund E06/Z02/Z36/Z37/Z39/ZC6/ZC7/ZT6/ZT7/ZZD; E01 und E03 stehen dort in der dritten
    // Statusanlass-Gruppe (Ergänzung für Lieferende bei befristeter Anmeldung, Feld STS_7_befristet).
    "55013": { kapitel: "8.6", rolle: "NB an LF", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E06", ebd: null, antwortcluster: null, antwortcode: null },
    "55014": { kapitel: "8.6", rolle: "LF an NB", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E06", ebd: "E_0615", antwortcluster: "zustimmung", antwortcode: "A09" },
    "55015": { kapitel: "8.6", rolle: "LF an NB", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E06", ebd: "E_0615", antwortcluster: "ablehnung", antwortcode: "A02" },

    // --- 8.11 Meldung über Zuordnung / Beendigung / Aufhebung (NB an LF) ---
    // Reine Meldungen (keine EBD-Antwort). 55036 = existierende Zuordnung (BGM E01, Grund Z26);
    // 55037 = Beendigung der Zuordnung (BGM E02, Grund ZC8/ZD9/ZG6 + Ergänzung ZW3/ZW4);
    // 55038 = Aufhebung einer zukünftigen Zuordnung (BGM E02, Grund ZG5/ZG9/ZH0/ZH1 + Ergänzung ZW3/ZW4).
    "55036": { kapitel: "8.11", rolle: "NB an LF", bgm: "E01", art: "meldung",
               transaktionsgrund: "Z26", ebd: null, antwortcluster: null, antwortcode: null },
    "55037": { kapitel: "8.11", rolle: "NB an LF", bgm: "E02", art: "meldung",
               transaktionsgrund: "ZC8", ebd: null, antwortcluster: null, antwortcode: null },
    "55038": { kapitel: "8.11", rolle: "NB an LF", bgm: "E02", art: "meldung",
               transaktionsgrund: "ZG5", ebd: null, antwortcluster: null, antwortcode: null },

    // --- 8.3 Anmeldung zu einer erzeugenden Marktlokation (EBD E_0623/E_0622) ---
    // Wie 8.2, aber erzeugende MaLo (STS-Ergänzung ZW3 / Geschäftsvorfall ZW0-2). Grund E03 (Wechsel).
    "55077": { kapitel: "8.3", rolle: "LF an NB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55078": { kapitel: "8.3", rolle: "NB an LF", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0623", antwortcluster: "zustimmung", antwortcode: "A51" },
    "55080": { kapitel: "8.3", rolle: "NB an LF", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "E_0622", antwortcluster: "ablehnung", antwortcode: "A07" },

    // --- 8.4 Anmeldung einer neuen verbrauchenden Marktlokation (EBD E_0608) ---
    // Neuanlage: Grund E02 (Einzug in Neuanlage), Ergänzung ZW4 (verbrauchende MaLo).
    "55600": { kapitel: "8.4", rolle: "LF an NB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E02", ebd: null, antwortcluster: null, antwortcode: null },
    "55602": { kapitel: "8.4", rolle: "NB an LF", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E02", ebd: "E_0608", antwortcluster: "zustimmung", antwortcode: "A09" },
    "55604": { kapitel: "8.4", rolle: "NB an LF", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E02", ebd: "E_0608", antwortcluster: "ablehnung", antwortcode: "A01" },

    // --- 8.5 Anmeldung zu einer neuen erzeugenden Marktlokation (EBD E_0608) ---
    // Neuanlage: Grund E02, erzeugende MaLo (Ergänzung ZW3 / Geschäftsvorfall ZW0/ZW2).
    "55601": { kapitel: "8.5", rolle: "LF an NB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E02", ebd: null, antwortcluster: null, antwortcode: null },
    "55603": { kapitel: "8.5", rolle: "NB an LF", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E02", ebd: "E_0608", antwortcluster: "zustimmung", antwortcode: "A09" },
    "55605": { kapitel: "8.5", rolle: "NB an LF", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E02", ebd: "E_0608", antwortcluster: "ablehnung", antwortcode: "A01" },

    // --- 8.7 Ankündigung Zuordnung des LF zur erzeugenden MaLo bzw. Tranche (EBD E_0603) ---
    // 55607 = Ankündigung (NB an LF), BGM Z89 (Zuordnung zur Lokation, Aktion Ankündigung);
    // 55608/55609 = Antwort (LF an NB), BGM E01. Grund E03 (Wechsel), Ergänzung ZW8-ZX1 (Fall 1-4).
    // EBD je Fall: ZW8->E_0603, ZW9->E_0604, ZX1->E_0606; hier Repräsentant Fall 1 (E_0603).
    "55607": { kapitel: "8.7", rolle: "NB an LF", bgm: "Z89", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55608": { kapitel: "8.7", rolle: "LF an NB", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0603", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55609": { kapitel: "8.7", rolle: "LF an NB", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "E_0603", antwortcluster: "ablehnung", antwortcode: "A99" },

    // --- 8.12 Abrechnungsdaten Netznutzungsabrechnung (EBD E_0610) ---
    // BGM E03 (Änderungsmeldung), Transaktionsgrund ZX4 (Abrechnungsdaten NNA). Kern-Datenblock
    // (SG8 SEQ+Z45 / PIA+5 OBIS / SG9 QTY) erzeugt der Generator. Antwortcode repräsentativ.
    "55218": { kapitel: "8.12", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX4", ebd: null, antwortcluster: null, antwortcode: null },
    "55220": { kapitel: "8.12", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX4", ebd: "E_0610", antwortcluster: "zustimmung", antwortcode: "A01" },

    // --- 8.13 Abrechnungsdaten Bilanzkreisabrechnung verbrauchende MaLo (EBD E_0611) ---
    // Transaktionsgrund ZX3. Zwei Kommunikationspaare: NB<->ÜNB (55613/55614), NB<->LF (55126/55156).
    "55613": { kapitel: "8.13", rolle: "NB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX3", ebd: null, antwortcluster: null, antwortcode: null },
    "55614": { kapitel: "8.13", rolle: "ÜNB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX3", ebd: "E_0612", antwortcluster: "zustimmung", antwortcode: "A05" },
    "55126": { kapitel: "8.13", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX3", ebd: null, antwortcluster: null, antwortcode: null },
    "55156": { kapitel: "8.13", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX3", ebd: "E_0611", antwortcluster: "zustimmung", antwortcode: "A01" },

    // --- 8.14 Abrechnungsdaten Bilanzkreisabrechnung erzeugende MaLo (EBD E_0611) ---
    // Transaktionsgrund ZX2. Paare: NB<->ÜNB (55674/55675), NB<->LF (55672/55673).
    "55674": { kapitel: "8.14", rolle: "NB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX2", ebd: null, antwortcluster: null, antwortcode: null },
    "55675": { kapitel: "8.14", rolle: "ÜNB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX2", ebd: "E_0612", antwortcluster: "zustimmung", antwortcode: "A05" },
    "55672": { kapitel: "8.14", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX2", ebd: null, antwortcluster: null, antwortcode: null },
    "55673": { kapitel: "8.14", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX2", ebd: "E_0611", antwortcluster: "zustimmung", antwortcode: "A01" },

    // === 9.1 Stammdatenänderung verantwortlich NB (Netzlokation/Marktlokation/Tranche/
    //     Technische+Steuerbare Ressource/Messlokation/Blindabrechnung/Lokationsbündel) ===
    // Änderung=anfrage (BGM E03, STS+7++ZXn), Rückmeldung=bestaetigung (STS+E01 + EBD E_0408 LF->NB /
    //     E_0409 MSB->NB / E_0572 an ÜNB). Antwortcode A01 = cluster-repräsentativer Vertreter.
    "55615": { kapitel: "9.1.1", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX8", ebd: null, antwortcluster: null, antwortcode: null },
    "55621": { kapitel: "9.1.1", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX8", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55627": { kapitel: "9.1.1", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX8", ebd: null, antwortcluster: null, antwortcode: null },
    "55633": { kapitel: "9.1.1", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX8", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55688": { kapitel: "9.1.2", rolle: "NB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55689": { kapitel: "9.1.2", rolle: "ÜNB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0572", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55616": { kapitel: "9.1.3", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55622": { kapitel: "9.1.3", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55628": { kapitel: "9.1.3", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55634": { kapitel: "9.1.3", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55691": { kapitel: "9.1.4", rolle: "NBA an NBN", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZZA", ebd: null, antwortcluster: null, antwortcode: null },
    "55692": { kapitel: "9.1.4", rolle: "NBN an NBA", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZZA", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55619": { kapitel: "9.1.5", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY1", ebd: null, antwortcluster: null, antwortcode: null },
    "55625": { kapitel: "9.1.5", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY1", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55617": { kapitel: "9.1.6", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY0", ebd: null, antwortcluster: null, antwortcode: null },
    "55623": { kapitel: "9.1.6", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY0", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55629": { kapitel: "9.1.6", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY0", ebd: null, antwortcluster: null, antwortcode: null },
    "55635": { kapitel: "9.1.6", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY0", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55618": { kapitel: "9.1.7", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX9", ebd: null, antwortcluster: null, antwortcode: null },
    "55624": { kapitel: "9.1.7", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX9", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55630": { kapitel: "9.1.7", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX9", ebd: null, antwortcluster: null, antwortcode: null },
    "55636": { kapitel: "9.1.7", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX9", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55620": { kapitel: "9.1.8", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX7", ebd: null, antwortcluster: null, antwortcode: null },
    "55626": { kapitel: "9.1.8", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX7", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55632": { kapitel: "9.1.8", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX7", ebd: null, antwortcluster: null, antwortcode: null },
    "55638": { kapitel: "9.1.8", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX7", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55225": { kapitel: "9.1.9", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX5", ebd: null, antwortcluster: null, antwortcode: null },
    "55227": { kapitel: "9.1.9", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX5", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55175": { kapitel: "9.1.10", rolle: "NB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY2", ebd: null, antwortcluster: null, antwortcode: null },
    "55180": { kapitel: "9.1.10", rolle: "LF an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY2", ebd: "E_0408", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55173": { kapitel: "9.1.10", rolle: "NB an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY2", ebd: null, antwortcluster: null, antwortcode: null },
    "55177": { kapitel: "9.1.10", rolle: "MSB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY2", ebd: "E_0409", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55690": { kapitel: "9.1.10", rolle: "NBA an NBN", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY2", ebd: null, antwortcluster: null, antwortcode: null },

    // === 9.2 Stammdatenänderung verantwortlich LF (MaLo/Blindabrechnung/TR) ===
    // EBD E_0410 (Änderung vom LF prüfen, NB->LF) bzw. E_0578 (MSB->LF).
    "55109": { kapitel: "9.2.1", rolle: "LF an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55137": { kapitel: "9.2.1", rolle: "NB an LF", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0410", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55110": { kapitel: "9.2.1", rolle: "LF an MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55136": { kapitel: "9.2.1", rolle: "MSB an LF", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0578", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55230": { kapitel: "9.2.2", rolle: "LF an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX5", ebd: null, antwortcluster: null, antwortcode: null },
    "55232": { kapitel: "9.2.2", rolle: "NB an LF", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX5", ebd: "E_0410", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55693": { kapitel: "9.2.3", rolle: "LF an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY0", ebd: null, antwortcluster: null, antwortcode: null },
    "55694": { kapitel: "9.2.3", rolle: "NB an LF", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY0", ebd: "E_0410", antwortcluster: "zustimmung", antwortcode: "A01" },

    // === 9.3 Stammdatenänderung verantwortlich MSB (NeLo/MaLo/Tranche/SR/MeLo/MSB-Abr.) ===
    // EBD E_0412 (NB prüft), E_0415 (LF prüft), E_0583 (weiterer MSB prüft), E_0639 (an ÜNB).
    // 9.3.8 "Daten auf individuelle Bestellung" (67 heterogene PIDs, GDA-nah) bewusst separat.
    "55684": { kapitel: "9.3.1", rolle: "MSB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55685": { kapitel: "9.3.1", rolle: "ÜNB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0639", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55686": { kapitel: "9.3.1", rolle: "MSB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY1", ebd: null, antwortcluster: null, antwortcode: null },
    "55687": { kapitel: "9.3.1", rolle: "ÜNB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY1", ebd: "E_0639", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55639": { kapitel: "9.3.2", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX8", ebd: null, antwortcluster: null, antwortcode: null },
    "55644": { kapitel: "9.3.2", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX8", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55649": { kapitel: "9.3.2", rolle: "MSB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX8", ebd: null, antwortcluster: null, antwortcode: null },
    "55654": { kapitel: "9.3.2", rolle: "LF an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX8", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55659": { kapitel: "9.3.2", rolle: "MSB an weiteren MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX8", ebd: null, antwortcluster: null, antwortcode: null },
    "55664": { kapitel: "9.3.2", rolle: "weiterer MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX8", ebd: "E_0583", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55640": { kapitel: "9.3.3", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55645": { kapitel: "9.3.3", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55650": { kapitel: "9.3.3", rolle: "MSB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55655": { kapitel: "9.3.3", rolle: "LF an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55660": { kapitel: "9.3.3", rolle: "MSB an weiteren MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX6", ebd: null, antwortcluster: null, antwortcode: null },
    "55665": { kapitel: "9.3.3", rolle: "weiterer MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX6", ebd: "E_0583", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55642": { kapitel: "9.3.4", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY1", ebd: null, antwortcluster: null, antwortcode: null },
    "55647": { kapitel: "9.3.4", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY1", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55652": { kapitel: "9.3.4", rolle: "MSB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY1", ebd: null, antwortcluster: null, antwortcode: null },
    "55657": { kapitel: "9.3.4", rolle: "LF an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY1", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55662": { kapitel: "9.3.4", rolle: "MSB an weiteren MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY1", ebd: null, antwortcluster: null, antwortcode: null },
    "55667": { kapitel: "9.3.4", rolle: "weiterer MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY1", ebd: "E_0583", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55641": { kapitel: "9.3.5", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX9", ebd: null, antwortcluster: null, antwortcode: null },
    "55646": { kapitel: "9.3.5", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX9", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55651": { kapitel: "9.3.5", rolle: "MSB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX9", ebd: null, antwortcluster: null, antwortcode: null },
    "55656": { kapitel: "9.3.5", rolle: "LF an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX9", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55661": { kapitel: "9.3.5", rolle: "MSB an weiteren MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX9", ebd: null, antwortcluster: null, antwortcode: null },
    "55666": { kapitel: "9.3.5", rolle: "weiterer MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX9", ebd: "E_0583", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55643": { kapitel: "9.3.6", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX7", ebd: null, antwortcluster: null, antwortcode: null },
    "55648": { kapitel: "9.3.6", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX7", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55653": { kapitel: "9.3.6", rolle: "MSB an LF", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX7", ebd: null, antwortcluster: null, antwortcode: null },
    "55658": { kapitel: "9.3.6", rolle: "LF an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX7", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55663": { kapitel: "9.3.6", rolle: "MSB an weiteren MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZX7", ebd: null, antwortcluster: null, antwortcode: null },
    "55669": { kapitel: "9.3.6", rolle: "weiterer MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZX7", ebd: "E_0583", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55557": { kapitel: "9.3.7", rolle: "MSB an NB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZU1", ebd: null, antwortcluster: null, antwortcode: null },
    "55559": { kapitel: "9.3.7", rolle: "NB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZU1", ebd: "E_0415", antwortcluster: "zustimmung", antwortcode: "A01" },

    // === 9.4 Bilanzkreistreue (Stammdaten BK-Treue, NB<->ÜNB) ===
    // BGM E03, STS+7++ZAM + Ergänzung ZW3/ZW4/ZW5; Antwort EBD E_0574.
    "55670": { kapitel: "9.4", rolle: "NB an ÜNB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZAM", ebd: null, antwortcluster: null, antwortcode: null },
    "55671": { kapitel: "9.4", rolle: "ÜNB an NB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZAM", ebd: "E_0574", antwortcluster: "zustimmung", antwortcode: "A03" },

    // === 9.5 Geschäftsdatenanfrage - "Antwort auf GDA" (Informationsmeldung E44) ===
    // STS+7++ZY7 (verb. MaLo) / ZY6 (erz. MaLo) / ZY4 (an MSB) / ZY5 (Strom an Gas); kein STS+E01,
    // Referenz auf die Anfrage via RFF+AAV. art="anfrage" (Infomeldung ohne Zustimmung/Ablehnung).
    "55035": { kapitel: "9.5", rolle: "NB an LF", bgm: "E44", art: "anfrage",
               transaktionsgrund: "ZY7", ebd: null, antwortcluster: null, antwortcode: null },
    "55095": { kapitel: "9.5", rolle: "NB an LF", bgm: "E44", art: "anfrage",
               transaktionsgrund: "ZY6", ebd: null, antwortcluster: null, antwortcode: null },
    "55060": { kapitel: "9.5", rolle: "NB an MSB", bgm: "E44", art: "anfrage",
               transaktionsgrund: "ZY4", ebd: null, antwortcluster: null, antwortcode: null },
    "55194": { kapitel: "9.5", rolle: "NB an MSB", bgm: "E44", art: "anfrage",
               transaktionsgrund: "ZY5", ebd: null, antwortcluster: null, antwortcode: null },

    // === 9.3.8 Daten auf individuelle Bestellung (MSB<->NB/LF/MSB) ===
    // BGM E03/Z88, STS+7++ZY9; Bestellung via RFF+Z43. Antwort-EBD je Empfänger: E_0412 (NB) /
    // E_0415 (LF) / E_0583 (weiterer MSB); hier E_0412 als repräsentativer Vertreter.
    "55553": { kapitel: "9.3.8", rolle: "MSB an NB/LF/MSB", bgm: "E03", art: "anfrage",
               transaktionsgrund: "ZY9", ebd: null, antwortcluster: null, antwortcode: null },
    "55555": { kapitel: "9.3.8", rolle: "NB/LF/MSB an MSB", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "ZY9", ebd: "E_0412", antwortcluster: "zustimmung", antwortcode: "A01" },

    // === 9.6 Stornierungsmeldung (Anfrage/Bestätigung/Ablehnung) ===
    // BGM E01/E02/E35 (Kategorie der Ursprungsmeldung; hier E01 repräsentativ), STS+7++E05.
    // Antwort-Codeliste S_0086 (Bestätigung) / S_0087 (Ablehnung); Referenz via RFF+ACW.
    "55022": { kapitel: "9.6", rolle: "Beteiligte aus Ursprungsnachricht", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E05", ebd: null, antwortcluster: null, antwortcode: null },
    "55023": { kapitel: "9.6", rolle: "zurück an den Absender", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E05", ebd: "S_0086", antwortcluster: "zustimmung", antwortcode: "E15" },
    "55024": { kapitel: "9.6", rolle: "zurück an den Absender", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E05", ebd: "S_0087", antwortcluster: "ablehnung", antwortcode: "E14" },

    // === Kapitel 10 Messstellenbetrieb (WiM Strom): Kündigung/Anmeldung/Verpflichtung/Beendigung ===
    // Je Anfrage/Bestätigung/Ablehnung. Antwort-Codelisten S_00xx (Bestätigung/Ablehnung je Prozess).
    "55039": { kapitel: "10.1", rolle: "MSBN an MSBA", bgm: "E35", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55040": { kapitel: "10.1", rolle: "MSBA an MSBN", bgm: "E35", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "S_0090", antwortcluster: "zustimmung", antwortcode: "E15" },
    "55041": { kapitel: "10.1", rolle: "MSBA an MSBN", bgm: "E35", art: "ablehnung",
               transaktionsgrund: "E03", ebd: "S_0054", antwortcluster: "ablehnung", antwortcode: "E11" },
    "55042": { kapitel: "10.2", rolle: "MSB an NB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E01", ebd: null, antwortcluster: null, antwortcode: null },
    "55043": { kapitel: "10.2", rolle: "NB an MSB", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E01", ebd: "S_0055", antwortcluster: "zustimmung", antwortcode: "E15" },
    "55044": { kapitel: "10.2", rolle: "NB an MSB", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E01", ebd: "S_0056", antwortcluster: "ablehnung", antwortcode: "E11" },
    "55168": { kapitel: "10.3", rolle: "NB an gMSB", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E01", ebd: null, antwortcluster: null, antwortcode: null },
    "55169": { kapitel: "10.3", rolle: "gMSB an NB", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E01", ebd: "S_0063", antwortcluster: "zustimmung", antwortcode: "E15" },
    "55170": { kapitel: "10.3", rolle: "gMSB an NB", bgm: "E01", art: "ablehnung",
               transaktionsgrund: "E01", ebd: "S_0064", antwortcluster: "ablehnung", antwortcode: "E17" },
    "55051": { kapitel: "10.4", rolle: "MSB an NB", bgm: "E02", art: "anfrage",
               transaktionsgrund: "E01", ebd: null, antwortcluster: null, antwortcode: null },
    "55052": { kapitel: "10.4", rolle: "NB an MSB", bgm: "E02", art: "bestaetigung",
               transaktionsgrund: "E01", ebd: "S_0059", antwortcluster: "zustimmung", antwortcode: "E15" },
    "55053": { kapitel: "10.4", rolle: "NB an MSB", bgm: "E02", art: "ablehnung",
               transaktionsgrund: "E01", ebd: "S_0060", antwortcluster: "ablehnung", antwortcode: "E17" },

    // === Restliche Strom-Fälle: Kapitel 11 (Modell 2) + Kapitel 13 (MaBiS-Anwendungsübersichten) + 55611 ===
    // MaBiS-Listen/Aktivierungen tragen keinen STS+7-Transaktionsgrund (grund=null -> Generator lässt STS+7 weg).
    // BGM je Prozess (Z05 Clearingliste / Z07 Akt/Deakt MaBiS-ZP / Z17 / Z18 / Z37 DZÜ / Z71 / E40 / E44).
    "55238": { kapitel: "11.1", rolle: "", bgm: "E01", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55239": { kapitel: "11.1", rolle: "", bgm: "E01", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0510", antwortcluster: "zustimmung", antwortcode: "A02" },
    "55240": { kapitel: "11.2", rolle: "", bgm: "E44", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55241": { kapitel: "11.2", rolle: "", bgm: "E44", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0511", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55242": { kapitel: "11.3", rolle: "", bgm: "E02", art: "anfrage",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55243": { kapitel: "11.3", rolle: "", bgm: "E02", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: "E_0512", antwortcluster: "zustimmung", antwortcode: "A01" },
    "55074": { kapitel: "11.3", rolle: "", bgm: "E03", art: "meldung",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55075": { kapitel: "11.3", rolle: "", bgm: "E03", art: "meldung",
               transaktionsgrund: "E03", ebd: null, antwortcluster: null, antwortcode: null },
    "55076": { kapitel: "11.3", rolle: "", bgm: "E03", art: "bestaetigung",
               transaktionsgrund: "E03", ebd: null, antwortcluster: "zustimmung", antwortcode: "E15" },
    "55611": { kapitel: "8.11", rolle: "", bgm: "E02", art: "meldung",
               transaktionsgrund: "ZC8", ebd: null, antwortcluster: null, antwortcode: null },
    "55062": { kapitel: "13.1", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55063": { kapitel: "13.1", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55064": { kapitel: "13.1", rolle: "", bgm: "Z07", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0009", antwortcluster: "zustimmung", antwortcode: "A05" },
    "55065": { kapitel: "13.2", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55066": { kapitel: "13.2", rolle: "", bgm: "Z05", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0004", antwortcluster: "zustimmung", antwortcode: "A03" },
    "55067": { kapitel: "13.3", rolle: "", bgm: "E40", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55069": { kapitel: "13.4", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55070": { kapitel: "13.4", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55071": { kapitel: "13.5", rolle: "", bgm: "Z17", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55072": { kapitel: "13.5", rolle: "", bgm: "Z17", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55073": { kapitel: "13.6", rolle: "", bgm: "Z18", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55195": { kapitel: "13.7", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55196": { kapitel: "13.7", rolle: "", bgm: "Z05", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0017", antwortcluster: "zustimmung", antwortcode: "A04" },
    "55223": { kapitel: "13.8", rolle: "", bgm: "Z37", art: "meldung",
               transaktionsgrund: "ZP3", ebd: null, antwortcluster: null, antwortcode: null },
    "55224": { kapitel: "13.8", rolle: "", bgm: "Z37", art: "bestaetigung",
               transaktionsgrund: "ZP3", ebd: "E_0070", antwortcluster: "zustimmung", antwortcode: "A02" },
    "55197": { kapitel: "13.9", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55198": { kapitel: "13.9", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55199": { kapitel: "13.10", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55200": { kapitel: "13.10", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55201": { kapitel: "13.11", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55202": { kapitel: "13.11", rolle: "", bgm: "Z05", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55203": { kapitel: "13.12", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55204": { kapitel: "13.12", rolle: "", bgm: "Z07", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0071", antwortcluster: "zustimmung", antwortcode: "A13" },
    "55205": { kapitel: "13.12", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55206": { kapitel: "13.13", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55207": { kapitel: "13.13", rolle: "", bgm: "Z07", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0072", antwortcluster: "zustimmung", antwortcode: "A07" },
    "55208": { kapitel: "13.13", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55209": { kapitel: "13.14", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55210": { kapitel: "13.14", rolle: "", bgm: "Z07", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0078", antwortcluster: "zustimmung", antwortcode: "A13" },
    "55211": { kapitel: "13.14", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55212": { kapitel: "13.15", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55213": { kapitel: "13.15", rolle: "", bgm: "Z07", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0079", antwortcluster: "zustimmung", antwortcode: "A07" },
    "55214": { kapitel: "13.15", rolle: "", bgm: "Z07", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55235": { kapitel: "13.16", rolle: "", bgm: "Z71", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55236": { kapitel: "13.16", rolle: "", bgm: "Z71", art: "meldung",
               transaktionsgrund: null, ebd: null, antwortcluster: null, antwortcode: null },
    "55237": { kapitel: "13.16", rolle: "", bgm: "Z71", art: "bestaetigung",
               transaktionsgrund: null, ebd: "E_0102", antwortcluster: "zustimmung", antwortcode: "A06" }
};

if (typeof module !== 'undefined') module.exports = prozessMeta;
