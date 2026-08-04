// antwort-mappings-generiert.js - AUTOMATISCH ERZEUGT (scripts/baue_antwort_mappings.py).
// Quelle: EDI@Energy 'Anwendungsübersicht der Prüfidentifikatoren', Blatt
// 'Prüf-ID Prozessschritt' (Spalte 'Reaktion auf Prüfidentifikator') und
// 'Tupel-Übersicht' (Referenz-Segmente). Stände:
//   202604: Anwendungsübersicht der Prüfidentifikatoren 3.3 (Formatstand 202604)
//   202610: Anwendungsübersicht der Prüfidentifikatoren 4.0 (Formatstand 202610)
// Feldadressierung wie antwort-mappings.js; zusätzlich staende (nur dort
// anbieten) und tupel (Beleg: ZG-Tupel der Anwendungsübersicht).
var antwortMappingsGeneriert = [
  {
    "quelleFormat": "IFTSTA",
    "ziele": [
      {
        "label": "Statusmeldung (IFTSTA 21011) erzeugen",
        "zielFormat": "IFTSTA",
        "pruefiMap": {
          "21009": "21011"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T45",
        "beleg": "explizit",
        "positionen": {
          "einzeln": true,
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "ACW",
              "de": "1154",
              "quelle": {
                "unh": true
              }
            },
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "ADY",
              "de": "1154",
              "quelle": {
                "seg": "BGM",
                "de": "1004"
              }
            }
          ]
        }
      },
      {
        "label": "Statusmeldung (IFTSTA 21012) erzeugen",
        "zielFormat": "IFTSTA",
        "pruefiMap": {
          "21010": "21012"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T45",
        "beleg": "explizit",
        "positionen": {
          "einzeln": true,
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "ACW",
              "de": "1154",
              "quelle": {
                "unh": true
              }
            },
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "ADY",
              "de": "1154",
              "quelle": {
                "seg": "BGM",
                "de": "1004"
              }
            }
          ]
        }
      }
    ]
  },
  {
    "quelleFormat": "ORDERS",
    "ziele": [
      {
        "label": "Zählerstand (Gas) (MSCONS 13002) erzeugen",
        "zielFormat": "MSCONS",
        "pruefiMap": {
          "17102": "13002"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T42",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "AGI",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Lastgang (Gas) (MSCONS 13008) erzeugen",
        "zielFormat": "MSCONS",
        "pruefiMap": {
          "17102": "13008"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T42",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "AGI",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Energiemenge (Gas) (MSCONS 13009) erzeugen",
        "zielFormat": "MSCONS",
        "pruefiMap": {
          "17102": "13009"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T42",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "AGI",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Marktlokationsscharfe bilanzierte Menge Strom/Gas (MMMA) (MSCONS 13014) erzeugen",
        "zielFormat": "MSCONS",
        "pruefiMap": {
          "17114": "13014"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604"
        ],
        "tupel": "ZG-T42",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "AGI",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Bestellung (ORDRSP 19001) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17001": "19001"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Bestellung (ORDRSP 19002) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17001": "19002"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Weiterverpflichtung (ORDRSP 19003) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17002": "19003"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Weiterverpflichtung (ORDRSP 19004) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17002": "19004"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Auftrag Änderung Technik (ORDRSP 19005) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17011": "19005"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Auftrag Änderung Technik (ORDRSP 19006) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17011": "19006"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Anforderung Werte (ORDRSP 19007) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17004": "19007"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Beendigung Rechnungsabwicklung MSB (ORDRSP 19009) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17006": "19009"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Beendigung Rechnungsabwicklung MSB (ORDRSP 19010) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17006": "19010"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung der Ab-/Bestellung von Werten (ORDRSP 19011) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17007": "19011",
          "17008": "19011"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung der Ab-/Bestellung von Werten (ORDRSP 19012) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17007": "19012",
          "17008": "19012"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Gerätewechselabsicht (ORDRSP 19015) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17009": "19015"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Gerätewechselabsicht (ORDRSP 19016) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17009": "19016"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung der Anfrage Stammdaten (ORDRSP 19101) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17101": "19101"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung der Anfrage Werte (ORDRSP 19102) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17102": "19102"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung der Anforderung Allokationsliste (ORDRSP 19110) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17110": "19110"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Reklamation (ORDRSP 19114) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17113": "19114"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung der Anforderung bilanzierte Menge (ORDRSP 19115) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17114": "19115"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Sperr-/Entsperrauftrag (ORDRSP 19116) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17115": "19116",
          "17117": "19116"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Sperr-/Entsperrauftrag (ORDRSP 19117) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17115": "19117",
          "17117": "19117"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bestätigung Anfrage Sperrung (ORDRSP 19118) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17116": "19118"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Anfrage Sperrung (ORDRSP 19119) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17116": "19119"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Änderung (ORDRSP 19120) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17121": "19120"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Änderung Prognosegrundlage (ORDRSP 19121) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17120": "19121"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Reklamation einer Definition (ORDRSP 19123) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17122": "19123"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Änderung Zählzeitdefinition (ORDRSP 19124) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17123": "19124"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Konfigurationsänderung (ORDRSP 19127) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17118": "19127"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Beendigung Konfiguration (ORDRSP 19131) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17129": "19131"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Mitteilung zur Bestellung Konfiguration (ORDRSP 19132) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17130": "19132"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Bearbeitungsstand Bestellung Änderung Abrechnungsdaten (ORDRSP 19133) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17133": "19133"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "explizit",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Ablehnung Ab-/Bestellung der Aggregationsebene (ORDRSP 19204) erzeugen",
        "zielFormat": "ORDRSP",
        "pruefiMap": {
          "17207": "19204"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T14",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "felder": [
          {
            "seg": "RFF",
            "qualDe": "1153",
            "qual": "ON",
            "de": "1154",
            "bereich": "kopf",
            "quelle": {
              "seg": "BGM",
              "de": "1004"
            }
          }
        ]
      },
      {
        "label": "Antwort auf die Geschäftsdatenanfrage (UTILMD 44035) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "17101": "44035"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T2",
        "beleg": "explizit",
        "positionen": {
          "einzeln": true,
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "AAV",
              "de": "1154",
              "quelle": {
                "seg": "BGM",
                "de": "1004"
              }
            }
          ]
        }
      }
    ]
  },
  {
    "quelleFormat": "UTILMD",
    "ziele": [
      {
        "label": "Bearbeitungsstandsmeldung (IFTSTA 21047) erzeugen",
        "zielFormat": "IFTSTA",
        "pruefiMap": {
          "55156": "21047",
          "55220": "21047",
          "55673": "21047"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T43",
        "beleg": "explizit",
        "positionen": {
          "einzeln": true,
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "ACW",
              "de": "1154",
              "quelle": {
                "unh": true
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Abmeldung (UTILMD 44005) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44004": "44005"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Abmeldung (UTILMD 44006) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44004": "44006"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Abmeldung vom NB (UTILMD 44008) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44007": "44008"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Abmeldung vom NB (UTILMD 44009) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44007": "44009"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Abmeldungsanfrage (UTILMD 44011) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44010": "44011"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Abmeldungsanfrage (UTILMD 44012) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44010": "44012"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung EoG Anmeldung (UTILMD 44014) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44013": "44014"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung EoG Anmeldung (UTILMD 44015) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44013": "44015"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Kündigung (UTILMD 44017) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44016": "44017"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Kündigung (UTILMD 44018) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44016": "44018"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Kündigung MSB (UTILMD 44040) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44039": "44040"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Kündigung MSB (UTILMD 44041) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44039": "44041"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Ende MSB (UTILMD 44052) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44051": "44052"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Ende MSB (UTILMD 44053) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44051": "44053"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung auf Stammdaten zur verbrauchenden Marktlokation (UTILMD 44105) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44104": "44105"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung vom LF (UTILMD 44111) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44109": "44111"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung vom NB (UTILMD 44115) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44112": "44115",
          "44113": "44115"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung vom MSB (UTILMD 44119) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44116": "44119",
          "44117": "44119"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung vom LF (UTILMD 44121) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44120": "44121"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung vom NB (UTILMD 44124) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44123": "44124"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44138) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44137": "44138"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44142) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44139": "44142",
          "44140": "44142"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44145) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44143": "44145"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung der Anfrage (UTILMD 44146) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44143": "44146"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44149) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44147": "44149",
          "44148": "44149"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44151) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44150": "44151"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung der Anfrage (UTILMD 44152) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44150": "44152"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44157) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44156": "44157"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung (UTILMD 44161) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44159": "44161",
          "44160": "44161"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44163) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44162": "44163"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anfrage (UTILMD 44164) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44162": "44164"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Anfrage (UTILMD 44167) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44165": "44167",
          "44166": "44167"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Verpflichtungsanfrage (UTILMD 44169) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44168": "44169"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Verpflichtungsanfrage (UTILMD 44170) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44168": "44170"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Änderung der \nMarktlokationsstruktur (UTILMD 44176) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44175": "44176"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung der Anfrage der \nMarktlokationsstruktur (UTILMD 44182) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "44180": "44182"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Anmeldung verb. MaLo (UTILMD 55002) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55001": "55002"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anmeldung verb. MaLo (UTILMD 55003) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55001": "55003"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Abmeldung (UTILMD 55005) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55004": "55005"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Abmeldung (UTILMD 55008) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55007": "55008"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Abmeldung (UTILMD 55009) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55007": "55009"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung EOG Anmeldung (UTILMD 55014) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55013": "55014"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehung EOG Anmeldung (UTILMD 55015) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55013": "55015"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Kündigung (UTILMD 55017) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55016": "55017"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Kündigung (UTILMD 55018) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55016": "55018"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Kündigung MSB (UTILMD 55040) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55039": "55040"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Kündigung MSB (UTILMD 55041) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55039": "55041"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Anmeldung MSB (UTILMD 55043) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55042": "55043"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anmeldung MSB (UTILMD 55044) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55042": "55044"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Ende MSB (UTILMD 55052) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55051": "55052"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Ende MSB (UTILMD 55053) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55051": "55053"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort (UTILMD 55064) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55062": "55064",
          "55063": "55064"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Anmeldung erz. MaLo (UTILMD 55078) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55077": "55078"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anmeldung erz. MaLo (UTILMD 55080) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55077": "55080"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55137) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55109": "55137"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Abr.-Daten BK-Abr. verb. MaLo (UTILMD 55156) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55126": "55156"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Verpflichtungsanfrage (UTILMD 55169) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55168": "55169"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Verpflichtungsanfrage (UTILMD 55170) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55168": "55170"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Lokationsbündelstruktur (UTILMD 55177) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55173": "55177"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Lokationsbündelstruktur (UTILMD 55180) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55175": "55180"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Bilanzierungsgebietsclearingliste (UTILMD 55196) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55195": "55196"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Aktivierung ZP (UTILMD 55204) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55203": "55204"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Deaktivierung ZP (UTILMD 55207) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55206": "55207"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Aktiveirung ZP (UTILMD 55210) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55209": "55210"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Deaktivierung ZP (UTILMD 55213) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55212": "55213"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Abr.-Daten NNA (UTILMD 55220) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55218": "55220"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Blindabr.-Daten der NeLo (UTILMD 55227) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55225": "55227"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Blindabr.-Daten der NeLo (UTILMD 55232) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55230": "55232"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort (UTILMD 55237) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55235": "55237",
          "55236": "55237"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Beendigung (UTILMD 55241) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55240": "55241"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Antwort auf Abmeldung (UTILMD 55243) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55242": "55243"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Anfrage Daten der individuellen Bestellung (UTILMD 55555) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55553": "55555"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage MSB-Abr.-Daten der MaLo (UTILMD 55559) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55557": "55559"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Anmeldung neuer verb. MaLo (UTILMD 55602) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55600": "55602"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Anmeldung neuer erz. MaLo (UTILMD 55603) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55601": "55603"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anmeldung neuer verb. MaLo (UTILMD 55604) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55600": "55604"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Anmeldung neuer erz. MaLo (UTILMD 55605) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55601": "55605"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Bestätigung Zuordnung des LF zur MaLo/ Tranche (UTILMD 55608) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55607": "55608"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Ablehnung Zuordnung des LF zur MaLo/ Tranche (UTILMD 55609) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55607": "55609"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "heuristik",
        "hinweis": "Zuordnung aus Prozessschritt-Abfolge abgeleitet.",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Abr.-Daten BK-Abr. verb. MaLo (UTILMD 55614) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55613": "55614"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten zur NeLo (UTILMD 55621) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55615": "55621"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55622) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55616": "55622"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der TR (UTILMD 55623) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55617": "55623"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der SR (UTILMD 55624) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55618": "55624"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der Tranche (UTILMD 55625) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55619": "55625"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MeLo (UTILMD 55626) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55620": "55626"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten zur NeLo (UTILMD 55633) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55627": "55633"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55634) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55628": "55634"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der TR (UTILMD 55635) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55629": "55635"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der SR (UTILMD 55636) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55630": "55636"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MeLo (UTILMD 55638) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55632": "55638"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der NeLo (UTILMD 55644) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55639": "55644"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55645) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55640": "55645"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der SR (UTILMD 55646) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55641": "55646"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der Tranche (UTILMD 55647) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55642": "55647"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MeLo (UTILMD 55648) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55643": "55648"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der NeLo (UTILMD 55654) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55649": "55654"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55655) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55650": "55655"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der SR (UTILMD 55656) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55651": "55656"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der Tranche (UTILMD 55657) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55652": "55657"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MeLo (UTILMD 55658) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55653": "55658"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der NeLo (UTILMD 55664) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55659": "55664"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55665) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55660": "55665"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der SR (UTILMD 55666) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55661": "55666"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der Tranche (UTILMD 55667) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55662": "55667"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MeLo (UTILMD 55669) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55663": "55669"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung auf Stammdaten BK-Treue (UTILMD 55671) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55670": "55671"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Abr.-Daten BK-Abr. erz. Malo (UTILMD 55673) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55672": "55673"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Abr.-Daten BK-Abr. erz. Malo (UTILMD 55675) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55674": "55675"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der MaLo (UTILMD 55685) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55684": "55685"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Daten der Tranche (UTILMD 55687) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55686": "55687"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/Anfrage Paket-ID der MaLo (UTILMD 55692) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55691": "55692"
        },
        "tauscheRichtung": true,
        "staende": [
          "202604",
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      },
      {
        "label": "Rückmeldung/ Anfrage Daten der TR (UTILMD 55694) erzeugen",
        "zielFormat": "UTILMD",
        "pruefiMap": {
          "55693": "55694"
        },
        "tauscheRichtung": true,
        "staende": [
          "202610"
        ],
        "tupel": "ZG-T1",
        "beleg": "explizit",
        "positionen": {
          "quelleSeg": "IDE",
          "felder": [
            {
              "seg": "RFF",
              "qualDe": "1153",
              "qual": "TN",
              "de": "1154",
              "quelle": {
                "de": "7402"
              }
            }
          ]
        }
      }
    ]
  }
];
if (typeof module !== 'undefined') module.exports = antwortMappingsGeneriert;
