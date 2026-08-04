// _mig-codelisten.js
// Zulässige Codewerte je NACHRICHTENTYP, Segment und Datenelement.
// Codelisten der Nachrichtenart (MIG); der zentrale Validator prüft damit
// Qualifier und Codewerte (siehe _engine/ahb-validator.js).
//
// Aufbau:
//   migCodelisten.gemeinsam        -> nachrichtenübergreifende Codes (UNB-Syntax etc.)
//   migCodelisten.<TYP>            -> je Nachrichtentyp (UTILMD, künftig MSCONS, INVOIC ...)
//       .dtmQualifier              -> erlaubte DTM-Qualifier (DE2005) dieses Typs
//       .dtmTerminQualifier        -> Teilmenge, für die die Sommer-/Winterzeit-Prüfung gilt
//       .segmente.<SEG>            -> segmentspezifische Codelisten (z. B. STS, BGM)
//
// WICHTIG: Nur im MIG belegte Codes aufnehmen. Fehlt eine Liste, wird das betroffene
// Datenelement (noch) nicht auf Codeebene geprüft - lieber Lücke als Falschmeldung.

// Hilfsfunktion: wandelt ein Array reiner Codes in ein {Code: ""}-Objekt (ohne Klartext).
// Für umfangreiche Qualifierlisten, bei denen die Einzelbedeutung (noch) nicht gepflegt ist.
function listeAusCodes(codes) {
    const o = {};
    codes.forEach(c => { o[c] = ""; });
    return o;
}

const migCodelisten = {

    // ==============================================================
    // Nachrichtenübergreifend (gilt für alle Nachrichtentypen)
    // Quelle: BDEW "Allgemeine Festlegungen zu den EDIFACT-Nachrichten"
    // ==============================================================
    gemeinsam: {
        unbSyntaxKennung: { "UNOC": "UN/ECE-Zeichensatz C" },
        unbSyntaxVersion: { "3": "Syntax-Versionsnummer 3" },
        unbTestKennzeichen: { "1": "Übertragungsdatei ist ein Test" }
    },

    // ==============================================================
    // UTILMD (Stammdaten / Geschäftsprozesse GPKE/GeLi)
    // ==============================================================
    UTILMD: {
        nachrichtentyp: "UTILMD",
        dtmQualifier: {
            "137": "Dokumenten-/Nachrichtendatum",
            "92":  "Beginn zum (Vertragsbeginn)",
            "93":  "Ende zum (Vertragsende)",
            "94":  "Vertragsende (befristet)",
            "157": "Beginn Lieferung",
            "158": "Ende Lieferung",
            "471": "Ende zum nächstmöglichen Termin",
            "Z05": "bestätigtes Kündigungsdatum",
            "Z06": "Datum",
            "Z07": "Lieferbeginndatum in Bearbeitung",
            "Z08": "Datum für nächste Bearbeitung"
        },
        dtmTerminQualifier: ["92", "93", "94", "157", "158", "471", "Z05", "Z06", "Z07", "Z08"],

        segmente: {
            BGM: {
                dokumentenname: {
                    de: "1001", name: "Dokumentenname",
                    zulaessig: {
                        "E01": "Anmeldungen",
                        "E02": "Abmeldungen",
                        "E03": "Änderungsmeldung",
                        "E35": "Kündigung",
                        "E40": "Bilanzkreiszuordnungsliste",
                        "E44": "Informationsmeldung (Antwort auf Geschäftsdatenanfrage)",
                        "Z05": "Clearingliste (MaBiS)",
                        "Z07": "Aktivierung/Deaktivierung MaBiS-Zählpunkt",
                        "Z17": "Zuordnungsermächtigung",
                        "Z18": "Profildefinition",
                        "Z37": "DZÜ-Liste",
                        "Z71": "Zuordnung ZP der NGZ zur NZR",
                        "Z88": "Anfrage Datenclearing",
                        "Z89": "Zuordnung zur Lokation"
                    }
                }
            },
            STS: {
                statuskategorie: {
                    de: "9015", name: "Statuskategorie",
                    zulaessig: {
                        "7":   "Transaktionsgrund",
                        "E01": "Status der Antwort",
                        "Z35": "Status der Antwort des dritten Marktpartners"
                    }
                },
                transaktionsgrund: {
                    de: "9013", name: "Transaktionsgrund",
                    zulaessig: {
                        "E01": "Ein-/Auszug (Umzug)",
                        "E02": "Einzug in Neuanlage",
                        "E03": "Wechsel",
                        "E05": "Stornierung",
                        "E06": "Ersatzbelieferung",
                        "Z02": "Kündigung Lieferantenrahmenvertrag",
                        "Z15": "Zusätzlicher Datensatz",
                        "Z26": "Information über existierende Zuordnung",
                        "Z33": "Auszug wegen Stilllegung",
                        "Z36": "EoG aus Ein-/Auszug (Umzug)",
                        "Z37": "EoG wegen Einzug in Neuanlage",
                        "Z39": "EoG aus vorübergehendem Anschluss",
                        "Z41": "Ende der ESV ohne Folgelieferung",
                        "ZC6": "EoG aus Bilanzkreisschließung",
                        "ZC7": "EoG aufgrund Erlöschen der Zuordnung",
                        "ZC8": "Beendigung der Zuordnung",
                        "ZD9": "Beendigung wegen Rückzuordnungsmeldung",
                        "ZE3": "Stammdatenänderung",
                        "ZG5": "Aufhebung einer zukünftigen Zuordnung",
                        "ZG6": "Beendigung der Zuordnung aufgrund EEG 2014",
                        "ZG9": "Aufhebung einer zukünftigen Zuordnung",
                        "ZH0": "Aufhebung einer zukünftigen Zuordnung",
                        "ZH1": "Aufhebung einer zukünftigen Zuordnung",
                        "ZH2": "Aufhebung einer zukünftigen Zuordnung",
                        "ZP3": "Stammdaten",
                        "ZP4": "Werte",
                        "ZQ7": "Abmeldung wg. fehlender Zuordnung",
                        "ZR9": "Kündigung aufgrund Vertrag mit Kunde",
                        "ZT0": "Abmeldung wegen fehlender Zuordnung",
                        "ZT4": "Ende wegen Kündigung durch LF",
                        "ZT5": "Ende wegen Kündigung durch Kunde/LFN",
                        "ZT6": "EoG wegen Kündigung durch LF",
                        "ZT7": "EoG wegen Kündigung durch Kunde/LFN",
                        "ZX2": "Abrechnungsdaten BK-Abrechnung",
                        "ZX3": "Abrechnungsdaten BK-Abrechnung",
                        "ZX4": "Abrechnungsdaten NNA",
                        "ZX5": "Änderung Blindabrechnungsdaten der NeLo",
                        "ZX6": "Änderung Daten der Marktlokation",
                        "ZX7": "Änderung Daten der Messlokation",
                        "ZX8": "Änderung Daten der Netzlokation",
                        "ZX9": "Änderung Daten der Steuerbaren Ressource",
                        "ZY0": "Änderung Daten der Technischen Ressource",
                        "ZY1": "Änderung Daten der Tranche",
                        "ZY2": "Änderung der Lokationsbündelstruktur",
                        "ZU1": "Änderung Messstellenbetriebsabrechnungsdaten",
                        "ZAM": "Stammdaten Bilanzkreistreue (BK-Treue)",
                        "ZZA": "Änderung Paket-ID der Marktlokation (NB-Wechsel)",
                        "ZY4": "Antwort auf GDA an MSB",
                        "ZY5": "Antwort auf GDA (Strom an Gas)",
                        "ZY6": "Antwort auf GDA erzeugende MaLo",
                        "ZY7": "Antwort auf GDA verbrauchende MaLo",
                        "ZY9": "Daten auf individuelle Bestellung"
                    }
                },
                transaktionsgrundergaenzung: {
                    de: "9013", name: "Transaktionsgrundergänzung",
                    zulaessig: {
                        "ZW0": "Geschäftsvorfall 1 (Anmeldung 100%)",
                        "ZW1": "Geschäftsvorfall 2 (Zuordnung zu bestehender Tranche 100%)",
                        "ZW2": "Geschäftsvorfall 3 (Zuordnung zu neu zu bildender Tranche)",
                        "ZW3": "Erzeugende Marktlokation",
                        "ZW4": "Verbrauchende Marktlokation",
                        "ZW5": "Tranche",
                        "ZW6": "Pauschale Marktlokation",
                        "ZW7": "Gemessene Marktlokation",
                        "ZW8": "Fall 1",
                        "ZW9": "Fall 2",
                        "ZX0": "Fall 3",
                        "ZX1": "Fall 4",
                        "ZAP": "ruhende Marktlokation",
                        "ZZB": "Stilllegung inkl. Stilllegung MaLo",
                        "ZZC": "Stilllegung exkl. Stilllegung MaLo"
                    }
                }
            },

            // --- RFF Referenz (DE1153 Qualifier) ---
            RFF: {
                qualifier: {
                    de: "1153", name: "Referenzqualifier",
                    zulaessig: {
                        "AAV": "Nummer der Anfrage",
                        "ACW": "Referenznummer einer vorangegangenen Nachricht",
                        "AGK": "Referenz",
                        "AUU": "Referenz auf eine Zeitreihe",
                        "AVC": "Referenz",
                        "AVE": "Meldepunkt",
                        "MG":  "Zählernummer",
                        "TN":  "Transaktions-Referenznummer",
                        "Z12": "Referenz auf ein Profil / Konfigurationsprodukt",
                        "Z13": "Prüfidentifikator",
                        "Z14": "Referenz",
                        "Z18": "Referenz",
                        "Z19": "Referenz",
                        "Z20": "Referenz",
                        "Z22": "Referenz",
                        "Z31": "Referenz",
                        "Z32": "Referenz",
                        "Z33": "Referenz",
                        "Z37": "Referenz",
                        "Z38": "Referenz",
                        "Z42": "Referenznummer der Nachricht der Marktlokation",
                        "Z43": "Referenznummer des Vorgangs der Marktlokation",
                        "Z46": "Referenz",
                        "Z47": "Verwendungszeitraum der Daten: Im System vorhandene Daten",
                        "Z49": "Verwendungszeitraum der Daten: Gültige Daten",
                        "Z50": "Referenz",
                        "Z53": "Verwendungszeitraum der Daten: Keine Daten",
                        "Z54": "Verwendungszeitraum der Daten: Erwartete Daten",
                        "Z55": "Verwendungszeitraum der Daten: Keine Daten erwartet",
                        "Z60": "Referenz auf ein geplantes Produktpaket"
                    }
                }
            },

            // --- LOC Ortsangabe (DE3227 Qualifier) ---
            LOC: {
                qualifier: {
                    de: "3227", name: "Ortsangabe-Qualifier",
                    zulaessig: {
                        "Z15": "ID des MaBiS-Zählpunkts",
                        "Z16": "ID der Marktlokation",
                        "Z17": "ID der Messlokation",
                        "Z18": "ID der Netzlokation",
                        "Z19": "ID der Steuerbaren Ressource",
                        "Z20": "ID der Technischen Ressource",
                        "Z21": "ID der Tranche",
                        "Z22": "ID der ruhenden Marktlokation"
                    }
                }
            },

            // --- IDE Vorgangs-Identifikation (DE7495 Qualifier) ---
            IDE: {
                qualifier: {
                    de: "7495", name: "Objekt-Qualifier",
                    zulaessig: {
                        "24":  "Transaktion (Vorgang)",
                        "Z01": "Liste"
                    }
                }
            },

            // --- SEQ Sequenz / Segmentgruppen-Trigger (DE1229 Handlung, Code) ---
            // 47 Qualifier laut MIG; steuert, welche Datengruppe folgt (u. a. Produktpaket Z79/ZH0).
            SEQ: {
                qualifier: {
                    de: "1229", name: "Handlung, Code",
                    zulaessig: listeAusCodes([
                        "Z01","Z02","Z03","Z04","Z05","Z06","Z08","Z13","Z14","Z15","Z16","Z17",
                        "Z18","Z19","Z20","Z21","Z22","Z23","Z24","Z25","Z27","Z29","Z30","Z31",
                        "Z32","Z33","Z38","Z40","Z45","Z47","Z48","Z49","Z51","Z52","Z57","Z58",
                        "Z60","Z61","Z62","Z71","Z72","Z75","Z76","Z78","Z79","ZH0","ZH6", "ZD5", "ZD6", "ZD7", "ZD9", "ZE0"
                    ])
                }
            },

            // --- PIA Produkt-Identifikation ---
            // Aufbau: PIA+<4347 Funktion>+<C212: 7140 Produkt-Code : 7143 Typ>
            PIA: {
                funktion: {
                    de: "4347", name: "Produkt-/Erzeugnisnummer-Qualifier",
                    zulaessig: {
                        "5":   "Produktidentifikation",
                        "Z02": "Gruppenartikel-ID / Artikel-ID"
                    }
                },
                artikeltyp: {
                    de: "7143", name: "Art der Produkt-/Leistungsnummer",
                    zulaessig: {
                        "Z11": "Produkt",
                        "Z09": "Artikel-ID",
                        "SRW": "Summe registrierte Wirkarbeit (OBIS)",
                        "SRB": "Summe registrierte Blindarbeit (OBIS)"
                    }
                }
            },

            // --- CCI Merkmal/Klasse (DE7059 Klassentyp, Code) ---
            CCI: {
                klassentyp: {
                    de: "7059", name: "Klassentyp, Code",
                    zulaessig: listeAusCodes([
                        "Z01","Z02","Z06","Z07","Z11","Z17","Z18","Z19","Z20","Z22","Z23","Z24",
                        "Z25","Z28","Z29","Z30","Z32","Z35","Z36","Z37","Z38","Z39","Z42","Z44",
                        "Z45","Z46","Z48","Z49","Z52","Z53","Z61","Z63","Z65","Z66","Z67","Z68",
                        "Z69","Z99"
                    ])
                }
                // Hinweis: DE7037 (Merkmal, Code) trägt teils freie Werte (z. B. EIC-Code des
                // Bilanzkreises) und wird daher nicht gegen eine feste Liste geprüft.
            },

            // --- CAV Merkmalswert (DE7111 Merkmalswert, Code) ---
            // Aufbau: CAV+<C889: 7111 Code : 7110 Wert : ... : Wert im 4. Element>
            CAV: {
                merkmalswert: {
                    de: "7111", name: "Merkmalswert, Code",
                    zulaessig: listeAusCodes([
                        "Z10","Z22","Z30","Z33","Z52","Z58","Z73","Z74","Z88","Z89","Z90","Z91",
                        "E01","E02","E03","E07",
                        "ZA7","ZB4","ZC9","ZD9","ZE4","ZE6","ZF0","ZF2","ZF5","ZG3","ZG8","ZH0","ZH7","ZH9","ZV4","ZW5"
                    ])
                }
                // Hinweis: DE7110 (Merkmalswert) ist ein freier Wert (Code der Produkteigenschaft,
                // Zahl, Text) und wird nicht gegen eine feste Liste geprüft.
            },

            // --- QTY Menge ---
            // Aufbau: QTY+<C186: 6063 Qualifier : 6060 Menge : 6411 Maßeinheit>
            QTY: {
                mengenqualifier: {
                    de: "6063", name: "Mengenqualifier",
                    zulaessig: {
                        "11":  "Veranschlagte Menge",
                        "31":  "Veranschlagte Jahresmenge Gesamt",
                        "79":  "Menge",
                        "265": "Veranschlagte Jahresmenge / Jahresverbrauchsprognose (TLP)",
                        "Z07": "Tatsächlich bilanzierte Energiemenge",
                        "Z08": "Angepasste elektrische Arbeit (VDN-Richtlinie)",
                        "Z09": "Vorjahresverbrauch",
                        "Z10": "Leistung der Marktlokation",
                        "Z11": "Menge",
                        "Z12": "Menge",
                        "Z13": "Menge",
                        "Z14": "Menge",
                        "Z15": "Menge",
                        "Z16": "Gemeinderabatt",
                        "Z17": "Menge",
                        "Z32": "Tatsächlich bilanzierte Ausfallarbeit",
                        "Z33": "Menge",
                        "Z34": "Zuschlag",
                        "Z35": "Menge",
                        "Z36": "Menge",
                        "Z38": "Anzahl der abzurechnenden Positionen",
                        "Z42": "Menge",
                        "Z43": "Menge",
                        "Z44": "Menge",
                        "Z45": "Menge"
                    }
                },
                masseinheit: {
                    de: "6411", name: "Maßeinheit, Code",
                    zulaessig: {
                        "KWH": "Kilowattstunde",
                        "H87": "Stück",
                        "P1":  "Prozent",
                        "Z16": "kWh/K (Kilowattstunde/Kelvin)",
                        "KW":  "Kilowatt",
                        "MW":  "Megawatt",
                        "MWH": "Megawattstunde"
                    }
                }
            }
        }
    }

    // Künftig: MSCONS: { ... }, INVOIC: { ... }, ORDERS: { ... }, ...
};

// Liefert die MIG-Codes für einen Nachrichtentyp inkl. gemeinsamer Ebene.
function migFuerNachricht(typ) {
    const t = migCodelisten[typ];
    if (!t) return null;
    return {
        nachrichtentyp: typ,
        gemeinsam: migCodelisten.gemeinsam,
        dtmQualifier: t.dtmQualifier || null,
        dtmTerminQualifier: t.dtmTerminQualifier || [],
        segmente: t.segmente || {}
    };
}

if (typeof module !== 'undefined') module.exports = { migCodelisten, migFuerNachricht };
