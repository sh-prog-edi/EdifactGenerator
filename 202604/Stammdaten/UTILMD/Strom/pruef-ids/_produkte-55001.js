// _produkte-55001.js
// Für Prüf-ID 55001 (Anmeldung verbrauchende MaLo) zulässige Produkt-Codes samt
// Produkteigenschaft-Codes. Quelle: EDI@Energy Codeliste der Konfigurationen,
// Kap. 6.1 'Anmeldung einer Zuordnung des LFN (UTILMD)' (KB-Dok. 11).
// Produkt-Codes im EDIFACT ohne Leerzeichen.
const produkte55001 = [
  {
    "code": "9991000002082",
    "name": "Bilanzkreis",
    "kategorie": "6.1.1 verpflichtend",
    "eigenschaften": [],
    "wertdetail": "Angabe Bilanzkreis (max Wdh1, an..17)",
    "maxWdh": "1"
  },
  {
    "code": "9991000002008",
    "name": "Messtechnische Einordnung der Marktlokation",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002107",
        "label": "iMS"
      },
      {
        "code": "9991000002115",
        "label": "kME/mME"
      },
      {
        "code": "9991000002123",
        "label": "keine Messung"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002727",
    "name": "Verbrauchsart",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002785",
        "label": "Kraft/Licht"
      },
      {
        "code": "9991000002793",
        "label": "Waerme/Kaelte"
      },
      {
        "code": "9991000002800",
        "label": "E-Mobilitaet"
      },
      {
        "code": "9991000002818",
        "label": "Strassenbeleuchtung"
      }
    ],
    "wertdetail": null,
    "maxWdh": "5"
  },
  {
    "code": "9991000002735",
    "name": "Waermenutzung",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002834",
        "label": "Speicherheizung"
      },
      {
        "code": "9991000002842",
        "label": "Waermepumpe unspezifiziert"
      },
      {
        "code": "9991000002850",
        "label": "Direktheizung"
      },
      {
        "code": "9991000002868",
        "label": "Waermepumpe (Waerme und Kaelte)"
      },
      {
        "code": "9991000002876",
        "label": "Waermepumpe (Kaelte)"
      },
      {
        "code": "9991000002884",
        "label": "Waermepumpe (Waerme)"
      }
    ],
    "wertdetail": null,
    "maxWdh": "5"
  },
  {
    "code": "9991000002743",
    "name": "Art der E-Mobilitaet",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002892",
        "label": "Wallbox"
      },
      {
        "code": "9991000002909",
        "label": "E-Mobilitaetsladesaeule"
      },
      {
        "code": "9991000002917",
        "label": "Ladepark"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002751",
    "name": "Steuerbare Ressource",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002925",
        "label": "Steuerbare Ressource vorhanden"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002777",
    "name": "Eigenschaft der Marktlokation",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [
      {
        "code": "9991000002941",
        "label": "Marktlokation stellt eine Kundenanlage dar"
      },
      {
        "code": "9991000003020",
        "label": "Marktlokation stellt keine Kundenanlage dar"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000003254",
    "name": "Jahresverbrauchsprognose maximaler Wert (MAX)",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [],
    "wertdetail": "Angabe maximale JVP (0 bis n, keine Nachkommast.)",
    "maxWdh": "1"
  },
  {
    "code": "9991000003262",
    "name": "Jahresverbrauchsprognose minimaler Wert (MIN)",
    "kategorie": "6.1.2 optional Voraussetzung",
    "eigenschaften": [],
    "wertdetail": "Angabe minimale JVP (0 bis n, keine Nachkommast.)",
    "maxWdh": "1"
  },
  {
    "code": "9991000003270",
    "name": "Ausschluss Messtechnische Einordnung",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003288",
        "label": "Ausschluss iMS"
      },
      {
        "code": "9991000003296",
        "label": "Ausschluss kME/mME"
      },
      {
        "code": "9991000003303",
        "label": "Ausschluss keine Messung"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000003311",
    "name": "Ausschluss Verbrauchsart",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003329",
        "label": "Ausschluss Kraft/Licht"
      },
      {
        "code": "9991000003337",
        "label": "Ausschluss Waerme/Kaelte"
      },
      {
        "code": "9991000003345",
        "label": "Ausschluss E-Mobilitaet"
      },
      {
        "code": "9991000003353",
        "label": "Ausschluss Strassenbeleuchtung"
      }
    ],
    "wertdetail": null,
    "maxWdh": "5"
  },
  {
    "code": "9991000003361",
    "name": "Ausschluss Waermenutzung",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003379",
        "label": "Ausschluss Speicherheizung"
      },
      {
        "code": "9991000003387",
        "label": "Ausschluss Waermepumpe unspezifiziert"
      },
      {
        "code": "9991000003395",
        "label": "Ausschluss Direktheizung"
      },
      {
        "code": "9991000003402",
        "label": "Ausschluss Waermepumpe (Waerme und Kaelte)"
      },
      {
        "code": "9991000003410",
        "label": "Ausschluss Waermepumpe (Kaelte)"
      },
      {
        "code": "9991000003428",
        "label": "Ausschluss Waermepumpe (Waerme)"
      }
    ],
    "wertdetail": null,
    "maxWdh": "5"
  },
  {
    "code": "9991000003436",
    "name": "Ausschluss Art der E-Mobilitaet",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003444",
        "label": "Ausschluss Wallbox"
      },
      {
        "code": "9991000003452",
        "label": "Ausschluss E-Mobilitaetsladesaeule"
      },
      {
        "code": "9991000003460",
        "label": "Ausschluss Ladepark"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000003478",
    "name": "Ausschluss Steuerbare Ressource",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003486",
        "label": "Ausschluss wenn Steuerbare Ressource vorhanden"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000003494",
    "name": "Ausschluss Eigenschaft der Marktlokation",
    "kategorie": "6.1.3 optional auszuschliessend",
    "eigenschaften": [
      {
        "code": "9991000003501",
        "label": "Ausschluss wenn Kundenanlage"
      },
      {
        "code": "9991000003519",
        "label": "Ausschluss wenn keine Kundenanlage"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002016",
    "name": "Netzentgelte aufgrund netzorientierter Steuerung",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002131",
        "label": "pauschale Netzentgeltreduzierung (Modul 1)"
      },
      {
        "code": "9991000002149",
        "label": "prozentuale Reduzierung Arbeitspreis (Modul 2)"
      },
      {
        "code": "9991000002157",
        "label": "Anreizmodul zeitvariables Netzentgelt (Modul 1 und 3)"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002024",
    "name": "Netzentgelte Preissystem",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002165",
        "label": "Jahresleistungspreissystem"
      },
      {
        "code": "9991000002173",
        "label": "Monatsleistungspreissystem"
      },
      {
        "code": "9991000002181",
        "label": "Grundpreis-/Arbeitspreissystem"
      },
      {
        "code": "9991000002199",
        "label": "Tagesleistungspreissystem"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002032",
    "name": "Konzessionsabgabe",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002959",
        "label": "Tarifkunden-KA"
      },
      {
        "code": "9991000002967",
        "label": "Sondervertragskunden-KA (KAV 2 Abs 3)"
      },
      {
        "code": "9991000002206",
        "label": "Schwachlastkonzessionsabgabe"
      },
      {
        "code": "9991000002975",
        "label": "KA-Befreiung"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002040",
    "name": "Netznutzung / Netznutzungsvertrag",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002222",
        "label": "Direkter Vertrag Kunde-NB"
      },
      {
        "code": "9991000002230",
        "label": "Vertrag Lieferant-NB"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002058",
    "name": "Netznutzung / Zahler der Netznutzung",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002248",
        "label": "Kunde"
      },
      {
        "code": "9991000002256",
        "label": "Lieferant"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002074",
    "name": "Prognosegrundlage",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002280",
        "label": "Prognose auf Basis von Profilen"
      },
      {
        "code": "9991000002298",
        "label": "Prognose auf Basis von Werten"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  },
  {
    "code": "9991000002397",
    "name": "Jahresverbrauchsprognose",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [],
    "wertdetail": "Angabe JVP (0 bis n, keine Nachkommast.)",
    "maxWdh": "1"
  },
  {
    "code": "9991000002769",
    "name": "Ruhende Marktlokation",
    "kategorie": "6.1.4 optional Erwartung/Aenderungswunsch",
    "eigenschaften": [
      {
        "code": "9991000002933",
        "label": "als ruhende MaLo zu KuA nach 20 Abs.1d EnWG (Bildung)"
      },
      {
        "code": "9991000003212",
        "label": "als ruhende MaLo zu KuA nach 10c EEG (Bildung)"
      },
      {
        "code": "9991000003204",
        "label": "als ruhende MaLo zu bestehender KuA (Integration)"
      }
    ],
    "wertdetail": null,
    "maxWdh": "1"
  }
];

if (typeof module !== 'undefined') module.exports = produkte55001;
