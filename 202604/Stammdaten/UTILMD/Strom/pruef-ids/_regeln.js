// _regeln.js — Regel-/Feldauswahl-Daten je Prüf-ID (202604/Stammdaten/UTILMD/Strom).
// GENERIERT durch scripts/baue_pid_regeln.js aus den früheren Einzeldateien
// <PID>.js (Phase 2, Feldauswahl-Umbau — Protokoll Abschnitt 39). Ersetzt die
// Einzeldateien und die _pid-registry.js. Reine Datendatei: Änderungen hier
// direkt vornehmen (bzw. künftig über den Engine-Weg), keine Globale je PID mehr.
const ahbRulesByPrufId = {
 "55001": {
  "pruefidentifikator": "55001",
  "bezeichnung": "Anmeldung verbrauchende MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [67]",
    "bedingungen": [
     "2061",
     "480"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": true,
     "bedingung": "96"
    },
    "rule": "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2061] ∧ [96]"
   }
  ]
 },
 "55002": {
  "pruefidentifikator": "55002",
  "bezeichnung": "Bestätigung Anmeldung verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "ahbExpr": "Muss [521]",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW6",
      "t": "ZW6 - Pauschale Marktlokation"
     },
     {
      "v": "ZW7",
      "t": "ZW7 - Gemessene Marktlokation"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: ZAP [519], ZAP [520]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0623)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061",
     "480"
    ],
    "rule": "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "ahbExpr": "Codes: ZAP [519], ZAP [520]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [96] ∧ [688] Soll [46] ∧ [688]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [96] ∧ [688] Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2003] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2003] ∧ [96]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([96] ⊻ [483]) ∧ [623]",
    "rule": "AHB: Muss ([96] ⊻ [483]) ∧ [623]"
   },
   {
    "id": "RFF_Z60",
    "name": "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55003": {
  "pruefidentifikator": "55003",
  "bezeichnung": "Ablehnung Anmeldung verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0622)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Muss bei A99 Sonstiges)",
    "status": "Bedingt",
    "rule": "[48] Muss bei STS+E01++A99."
   },
   {
    "id": "DTM_Z07",
    "name": "SG4 DTM+Z07: Lieferbeginndatum in Bearbeitung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [358]",
    "rule": "AHB: Muss [358]"
   },
   {
    "id": "DTM_Z08",
    "name": "SG4 DTM+Z08: Datum für nächste Bearbeitung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [358]",
    "rule": "AHB: Muss [358]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55004": {
  "pruefidentifikator": "55004",
  "bezeichnung": "Abmeldung verbrauchende MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn",
    "status": "Bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "[7] Bei bestimmten Transaktionsgründen."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Muss",
    "ahbExpr": "Muss [11]",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: Z41 [510], ZZD [313], ZZD [686]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([479] ⊻ [480])",
    "bedingungen": [
     "2061",
     "479",
     "480"
    ],
    "rule": "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "bedingungen": [
     "2061",
     "481"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "Muss bei Tranche (STS-Ergänzung ZW5)."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "Z41",
      "t": "Z41 - Ende der ESV ohne Folgelieferung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     },
     {
      "v": "ZT4",
      "t": "ZT4 - Ende wegen Kündigung durch LF"
     },
     {
      "v": "ZT5",
      "t": "ZT5 - Ende wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: Z41 [510], ZZD [313], ZZD [686]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2061] ∧ [96]"
   }
  ]
 },
 "55005": {
  "pruefidentifikator": "55005",
  "bezeichnung": "Bestätigung Abmeldung verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn",
    "status": "Bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "[7] Bei bestimmten Transaktionsgründen."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Muss",
    "ahbExpr": "Muss [11]",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0607)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "Z41",
      "t": "Z41 - Ende der ESV ohne Folgelieferung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     },
     {
      "v": "ZT4",
      "t": "ZT4 - Ende wegen Kündigung durch LF"
     },
     {
      "v": "ZT5",
      "t": "ZT5 - Ende wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: ZZD [313], ZZD [686]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55006": {
  "pruefidentifikator": "55006",
  "bezeichnung": "Ablehnung Abmeldung verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0607)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "Z41",
      "t": "Z41 - Ende der ESV ohne Folgelieferung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     },
     {
      "v": "ZT4",
      "t": "ZT4 - Ende wegen Kündigung durch LF"
     },
     {
      "v": "ZT5",
      "t": "ZT5 - Ende wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: ZZD [313], ZZD [686]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55007": {
  "pruefidentifikator": "55007",
  "bezeichnung": "Abmeldung durch NB an LF (Auszug wegen Stilllegung)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([479] ⊻ [480])",
    "bedingungen": [
     "2061",
     "479",
     "480"
    ],
    "rule": "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "bedingungen": [
     "2061",
     "481"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "Muss bei Tranche (STS-Ergänzung ZW5)."
   },
   {
    "id": "DTM_206",
    "name": "SG4 DTM+206: Geräteausbaudatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [79] ∧ [313]",
    "rule": "AHB: Muss [79] ∧ [313]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZQ7",
      "t": "ZQ7 - Abmeldung wg. fehl. Zuordnungsermächtigung"
     },
     {
      "v": "ZT0",
      "t": "ZT0 - Abmeldung wegen fehl. Zuordnungsermächtigung aufgrund Änderung ZRT"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2061] ∧ [96]"
   }
  ]
 },
 "55008": {
  "pruefidentifikator": "55008",
  "bezeichnung": "Bestätigung Abmeldung durch NB (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0609)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_206",
    "name": "SG4 DTM+206: Geräteausbaudatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [79] ∧ [313]",
    "rule": "AHB: Muss [79] ∧ [313]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZQ7",
      "t": "ZQ7 - Abmeldung wg. fehl. Zuordnungsermächtigung"
     },
     {
      "v": "ZT0",
      "t": "ZT0 - Abmeldung wegen fehl. Zuordnungsermächtigung aufgrund Änderung ZRT"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55009": {
  "pruefidentifikator": "55009",
  "bezeichnung": "Ablehnung Abmeldung durch NB (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0609)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZQ7",
      "t": "ZQ7 - Abmeldung wg. fehl. Zuordnungsermächtigung"
     },
     {
      "v": "ZT0",
      "t": "ZT0 - Abmeldung wegen fehl. Zuordnungsermächtigung aufgrund Änderung ZRT"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55010": {
  "pruefidentifikator": "55010",
  "bezeichnung": "Anfrage zur Beendigung der Zuordnung (LFA an LFN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende / Beendigung",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E01 [192]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([479] ⊻ [480])",
    "bedingungen": [
     "2061",
     "479",
     "480"
    ],
    "rule": "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "bedingungen": [
     "2061",
     "481"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "Muss bei Tranche (STS-Ergänzung ZW5)."
   },
   {
    "id": "DTM_154",
    "name": "SG4 DTM+154: ÜT der Lieferanmeldung des LFN",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "ahbExpr": "Codes: E01 [192]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2061] ∧ [96]"
   }
  ]
 },
 "55011": {
  "pruefidentifikator": "55011",
  "bezeichnung": "Bestätigung Beendigung der Zuordnung (LFN an LFA)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende / Beendigung",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0624)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55012": {
  "pruefidentifikator": "55012",
  "bezeichnung": "Ablehnung Beendigung der Zuordnung (LFN an LFA)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0624)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55013": {
  "pruefidentifikator": "55013",
  "bezeichnung": "Anmeldung / Zuordnung EoG (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW6",
      "t": "ZW6 - Pauschale Marktlokation"
     },
     {
      "v": "ZW7",
      "t": "ZW7 - Gemessene Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061"
    ],
    "rule": "Marktlokation ist anzugeben (genau einmal je Vorgang)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E06",
      "t": "E06 - Ersatzbelieferung"
     },
     {
      "v": "Z02",
      "t": "Z02 - Kündigung Lieferantenrahmenvertrag"
     },
     {
      "v": "Z36",
      "t": "Z36 - EoG aus Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z37",
      "t": "Z37 - EoG wegen Einzug in Neuanlage"
     },
     {
      "v": "Z39",
      "t": "Z39 - EoG aus vorübergehendem Anschluss"
     },
     {
      "v": "ZC6",
      "t": "ZC6 - EoG aus Bilanzkreisschließung"
     },
     {
      "v": "ZC7",
      "t": "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtigung"
     },
     {
      "v": "ZT6",
      "t": "ZT6 - EoG wegen Kündigung durch LF"
     },
     {
      "v": "ZT7",
      "t": "ZT7 - EoG wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [483] ∧ [623]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW7",
     "negiert": false,
     "bedingung": "483"
    },
    "rule": "AHB: Muss [483] ∧ [623]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_befristet",
    "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55014": {
  "pruefidentifikator": "55014",
  "bezeichnung": "Bestätigung EoG-Anmeldung (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0615)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E06",
      "t": "E06 - Ersatzbelieferung"
     },
     {
      "v": "Z02",
      "t": "Z02 - Kündigung Lieferantenrahmenvertrag"
     },
     {
      "v": "Z36",
      "t": "Z36 - EoG aus Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z37",
      "t": "Z37 - EoG wegen Einzug in Neuanlage"
     },
     {
      "v": "Z39",
      "t": "Z39 - EoG aus vorübergehendem Anschluss"
     },
     {
      "v": "ZC6",
      "t": "ZC6 - EoG aus Bilanzkreisschließung"
     },
     {
      "v": "ZC7",
      "t": "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtigung"
     },
     {
      "v": "ZT6",
      "t": "ZT6 - EoG wegen Kündigung durch LF"
     },
     {
      "v": "ZT7",
      "t": "ZT7 - EoG wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_befristet",
    "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55015": {
  "pruefidentifikator": "55015",
  "bezeichnung": "Ablehnung EoG-Anmeldung (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0615)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Muss bei A99 Sonstiges)",
    "status": "Bedingt",
    "rule": "[48] Muss bei STS+E01++A99."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E06",
      "t": "E06 - Ersatzbelieferung"
     },
     {
      "v": "Z02",
      "t": "Z02 - Kündigung Lieferantenrahmenvertrag"
     },
     {
      "v": "Z36",
      "t": "Z36 - EoG aus Ein-/Auszug (Umzug)"
     },
     {
      "v": "Z37",
      "t": "Z37 - EoG wegen Einzug in Neuanlage"
     },
     {
      "v": "Z39",
      "t": "Z39 - EoG aus vorübergehendem Anschluss"
     },
     {
      "v": "ZC6",
      "t": "ZC6 - EoG aus Bilanzkreisschließung"
     },
     {
      "v": "ZC7",
      "t": "ZC7 - EoG aufgrund Erlöschen der Zuordnungsermächtigung"
     },
     {
      "v": "ZT6",
      "t": "ZT6 - EoG wegen Kündigung durch LF"
     },
     {
      "v": "ZT7",
      "t": "ZT7 - EoG wegen Kündigung durch Kunde/LFN"
     },
     {
      "v": "ZZD",
      "t": "ZZD - Übergangsversorgung"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_befristet",
    "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Codes: E06 [580], ZZD [313], ZZD [681], E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55016": {
  "pruefidentifikator": "55016",
  "bezeichnung": "Kündigung (LFN an LFA)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende",
    "status": "Bedingt",
    "ahbExpr": "Muss [12]",
    "rule": "[12] Muss, wenn DTM+471 fehlt."
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum nächstmöglichen Termin",
    "status": "Bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "[18] Muss, wenn DTM+93 fehlt."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ]
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([479] ⊻ [480])",
    "bedingungen": [
     "2061",
     "479",
     "480"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    },
    "rule": "Muss bei erzeugender (ZW3) oder verbrauchender (ZW4) Marktlokation."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "bedingungen": [
     "2061",
     "481"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "Muss bei Tranche (STS-Ergänzung ZW5)."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55017": {
  "pruefidentifikator": "55017",
  "bezeichnung": "Bestätigung Kündigung (LFA an LFN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende",
    "status": "Bedingt",
    "ahbExpr": "Muss [12] ∧ [357] ∧ [704]",
    "rule": "[12] Muss, wenn DTM+471 fehlt."
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum nächstmöglichen Termin",
    "status": "Bedingt",
    "ahbExpr": "Muss [18] ∧ [513] ∧ [704]",
    "rule": "[18] Muss, wenn DTM+93 fehlt."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Bedingt",
    "rule": "[83] Muss bei Antwortstatus mit Klärungsbedarf."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55018": {
  "pruefidentifikator": "55018",
  "bezeichnung": "Ablehnung Kündigung (LFA an LFN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_Z05",
    "name": "SG4 DTM+Z05: Bestätigtes Kündigungsdatum",
    "status": "Bedingt",
    "ahbExpr": "Muss [351]",
    "rule": "[351] Muss, wenn Ablehnungs-Status vorliegt."
   },
   {
    "id": "DTM_Z10",
    "name": "SG4 DTM+Z10: Kündigungstermin des Vertrags",
    "status": "Bedingt",
    "ahbExpr": "Muss [35]",
    "rule": "[35] Bedingt laut Fristenprüfung."
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [352] ∧ (([85] ∧ [87]) ⊻ [27]) ∧ [581]",
    "rule": "AHB: Muss [352] ∧ (([85] ∧ [87]) ⊻ [27]) ∧ [581]"
   },
   {
    "id": "DTM_Z01",
    "name": "SG4 DTM+Z01: Kündigungsfrist des Vertrags",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [352]",
    "rule": "AHB: Muss [352]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55022": {
  "pruefidentifikator": "55022",
  "bezeichnung": "Anfrage nach Stornierung (Beteiligte aus Ursprungsnachricht)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 - Kategorie der zu stornierenden Meldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_ACW",
    "name": "SG6 RFF+ACW: Referenznummer der zu stornierenden Ursprungsnachricht",
    "status": "Muss",
    "rule": "Referenz auf die vorangegangene (zu stornierende) Meldung."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55023": {
  "pruefidentifikator": "55023",
  "bezeichnung": "Bestätigung Anfrage Stornierung (zurück an den Absender)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 - Kategorie der zu stornierenden Meldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_0086/S_0087)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55024": {
  "pruefidentifikator": "55024",
  "bezeichnung": "Ablehnung Anfrage Stornierung (zurück an den Absender)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 - Kategorie der zu stornierenden Meldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_0086/S_0087)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55035": {
  "pruefidentifikator": "55035",
  "bezeichnung": "Antwort auf Geschäftsdatenanfrage verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E44 Informationsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation (Objekt der Anfrage)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)",
    "status": "Muss",
    "rule": "Referenz auf die ursprüngliche Geschäftsdatenanfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZAP",
      "t": "ZAP - ruhende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY7",
      "t": "ZY7 - Antwort auf GDA verbrauchende MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2015] ∧ [96]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZAP",
     "negiert": false,
     "bedingung": "96"
    },
    "rule": "AHB: Muss [2015] ∧ [96]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [165]",
    "rule": "AHB: Soll [165]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2313]",
    "rule": "AHB: Muss [2313]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [215]",
    "rule": "AHB: Soll [166] ∧ [215]"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [665] · Codes: MG [441]",
    "rule": "AHB: Muss [665]"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55036": {
  "pruefidentifikator": "55036",
  "bezeichnung": "Meldung über existierende Zuordnung (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348]",
    "bedingungen": [
     "2061",
     "348"
    ],
    "rule": "Muss, wenn keine Tranche (LOC+Z21) angegeben ist (Entweder-Oder mit LOC+Z21)."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347]",
    "bedingungen": [
     "2061",
     "348"
    ],
    "rule": "Muss, wenn keine Marktlokation (LOC+Z16) angegeben ist (Entweder-Oder mit LOC+Z16)."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "Z26",
      "t": "Z26 - Information über existierende Zuordnung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55037": {
  "pruefidentifikator": "55037",
  "bezeichnung": "Meldung über Beendigung der Zuordnung (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende / Beendigung",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZC8",
      "t": "ZC8 - Beendigung der Zuordnung"
     },
     {
      "v": "ZD9",
      "t": "ZD9 - Beendigung wegen Rückzuordnungsmeldung"
     },
     {
      "v": "ZG6",
      "t": "ZG6 - Beendigung aufgrund EEG 2014"
     }
    ]
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348]",
    "bedingungen": [
     "2061",
     "348"
    ],
    "rule": "Muss, wenn keine Tranche (LOC+Z21) angegeben ist (Entweder-Oder mit LOC+Z21)."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347]",
    "bedingungen": [
     "2061",
     "348"
    ],
    "rule": "Muss, wenn keine Marktlokation (LOC+Z16) angegeben ist (Entweder-Oder mit LOC+Z16)."
   }
  ]
 },
 "55038": {
  "pruefidentifikator": "55038",
  "bezeichnung": "Meldung über Aufhebung einer zukünftigen Zuordnung (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Beginn der aufzuhebenden Zuordnung",
    "status": "Muss",
    "ahbExpr": "Muss [507]",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZG5",
      "t": "ZG5 - Aufhebung einer zukünftigen Zuordnung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung"
     },
     {
      "v": "ZH0",
      "t": "ZH0 - Aufhebung einer zukünftigen Zuordnung"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung"
     }
    ]
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [348]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347]",
    "rule": "AHB: Muss [2061] ∧ [347]"
   }
  ]
 },
 "55039": {
  "pruefidentifikator": "55039",
  "bezeichnung": "Anfrage Kündigung des Messstellenbetriebs (MSBN an MSBA)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [77] ∧ [347] ∧ [2061] Kann [2061]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [12]",
    "rule": "AHB: Muss [12]"
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum (nächstmöglichen Termin)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "AHB: Muss [18]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZR9",
      "t": "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [77] ∧ [349] Kann",
    "rule": "AHB: Muss [77] ∧ [349] Kann"
   }
  ]
 },
 "55040": {
  "pruefidentifikator": "55040",
  "bezeichnung": "Bestätigung Kündigung des Messstellenbetriebs (MSBA an MSBN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [12] ∧ [13]",
    "rule": "AHB: Muss [12] ∧ [13]"
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum (nächstmöglichen Termin)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "AHB: Muss [18]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZR9",
      "t": "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55041": {
  "pruefidentifikator": "55041",
  "bezeichnung": "Ablehnung Kündigung des Messstellenbetriebs (MSBA an MSBN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E35 Kündigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [253] ∧ [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [16] ∧ [581]",
    "rule": "AHB: Muss [16] ∧ [581]"
   },
   {
    "id": "DTM_Z01",
    "name": "SG4 DTM+Z01: Kündigungsfrist des Vertrags",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [16]",
    "rule": "AHB: Muss [16]"
   },
   {
    "id": "DTM_Z10",
    "name": "SG4 DTM+Z10: Kündigungstermin des Vertrags",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [35]",
    "rule": "AHB: Muss [35]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZR9",
      "t": "ZR9 - Kündigung aufgrund Vertrag mit Anschlussnehmer"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55042": {
  "pruefidentifikator": "55042",
  "bezeichnung": "Anfrage Anmeldung des Messstellenbetriebs (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss ([77] ∧ [78]) ∧ [347] ∧ [2061] Kann [2061]"
   },
   {
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZJ4",
      "t": "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([77] ∧ [78]) ∧ [349] Kann",
    "rule": "AHB: Muss ([77] ∧ [78]) ∧ [349] Kann"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "55043": {
  "pruefidentifikator": "55043",
  "bezeichnung": "Bestätigung Anmeldung des Messstellenbetriebs (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [675]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZJ4",
      "t": "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [670]",
    "rule": "AHB: Soll [46] ∧ [670]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [671]",
    "rule": "AHB: Muss [671]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2003]",
    "rule": "AHB: Soll [2003]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [672] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [672] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [673]",
    "rule": "AHB: Soll [46] ∧ [673]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [674]",
    "rule": "AHB: Soll [166] ∧ [674]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [86] ∧ [78] ∧ [271] ∧ [618]",
    "rule": "AHB: Muss [86] ∧ [78] ∧ [271] ∧ [618]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [668]",
    "rule": "AHB: Soll [166] ∧ [668]"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Messlokation zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [668]",
    "rule": "AHB: Muss [668]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55044": {
  "pruefidentifikator": "55044",
  "bezeichnung": "Ablehnung Anmeldung des Messstellenbetriebs (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [253] ∧ [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZJ4",
      "t": "ZJ4 - Übernahme aufgrund nicht erfolgtem iMS-Einbau"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55051": {
  "pruefidentifikator": "55051",
  "bezeichnung": "Anfrage Beendigung des Messstellenbetriebs (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E02 Abmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "AHB: Muss [7] ∧ [577]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [11]",
    "rule": "AHB: Muss [11]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55052": {
  "pruefidentifikator": "55052",
  "bezeichnung": "Bestätigung Beendigung des Messstellenbetriebs (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E02 Abmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "AHB: Muss [7] ∧ [577]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [11] ∧ [157] ∧ [313] Soll [326] ∧ [312]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZZB",
     "negiert": true,
     "bedingung": "157"
    },
    "rule": "AHB: Muss [11] ∧ [157] ∧ [313] Soll [326] ∧ [312]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZZB",
      "t": "ZZB - Stilllegung incl. Stilllegung MaLo"
     },
     {
      "v": "ZZC",
      "t": "ZZC - Stilllegung excl. Stilllegung MaLo"
     }
    ],
    "ahbExpr": "Codes: ZZB [17P0..1], ZZC [17P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     }
    ],
    "ahbExpr": "Codes: ZZB [17P0..1], ZZC [17P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [653]",
    "rule": "AHB: Soll [46] ∧ [653]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [653]",
    "rule": "AHB: Soll [166] ∧ [653]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46]",
    "rule": "AHB: Soll [46]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46]",
    "rule": "AHB: Soll [46]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [653]",
    "rule": "AHB: Soll [166] ∧ [653]"
   }
  ]
 },
 "55053": {
  "pruefidentifikator": "55053",
  "bezeichnung": "Ablehnung Beendigung des Messstellenbetriebs (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E02 Abmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZH2",
      "t": "ZH2 - Aufhebung einer zukünftigen Zuordnung wegen aufgehobenem Vertragsverhältnis"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55060": {
  "pruefidentifikator": "55060",
  "bezeichnung": "Antwort auf Geschäftsdatenanfrage (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E44 Informationsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation (Objekt der Anfrage)",
    "status": "Muss",
    "ahbExpr": "Muss [671]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)",
    "status": "Muss",
    "rule": "Referenz auf die ursprüngliche Geschäftsdatenanfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY4",
      "t": "ZY4 - Antwort auf GDA an MSB"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [670]",
    "rule": "AHB: Soll [46] ∧ [670]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [672] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [672] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [673]",
    "rule": "AHB: Soll [46] ∧ [673]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166]",
    "rule": "AHB: Soll [166]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [675]",
    "rule": "AHB: Muss [675]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die Marktlokation der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [215]",
    "rule": "AHB: Soll [166] ∧ [215]"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55062": {
  "pruefidentifikator": "55062",
  "bezeichnung": "Aktivierung eines MaBiS-Zählpunkts",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z01",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55063": {
  "pruefidentifikator": "55063",
  "bezeichnung": "Deaktivierung eines MaBiS-Zählpunkts",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z01",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55064": {
  "pruefidentifikator": "55064",
  "bezeichnung": "Antwort Aktivierung/Deaktivierung MaBiS-ZP",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Soll",
    "ahbExpr": "Soll [30]",
    "rule": "AHB: Soll [30]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [34]",
    "rule": "AHB: Soll [34]"
   }
  ]
 },
 "55065": {
  "pruefidentifikator": "55065",
  "bezeichnung": "Lieferantenclearingliste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2140]",
    "rule": "AHB: Muss [2140]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [14]",
    "rule": "AHB: Soll [14]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348]",
    "rule": "AHB: Muss [2061] ∧ [348]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [2061] ∧ [166]",
    "rule": "AHB: Soll [2061] ∧ [166]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z12",
    "name": "SG6 RFF+Z12: Versionsangabe des Profils",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55066": {
  "pruefidentifikator": "55066",
  "bezeichnung": "Antwort auf Lieferantenclearingliste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2140]",
    "rule": "AHB: Muss [2140]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Soll",
    "ahbExpr": "Soll [31]",
    "rule": "AHB: Soll [31]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [31]",
    "rule": "AHB: Soll [31]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348]",
    "rule": "AHB: Muss [2061] ∧ [348]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [2061] ∧ [166]",
    "rule": "AHB: Soll [2061] ∧ [166]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z12",
    "name": "SG6 RFF+Z12: Versionsangabe des Profils",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55067": {
  "pruefidentifikator": "55067",
  "bezeichnung": "Bilanzkreiszuordnungsliste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2071] ∧ [2073]",
    "rule": "AHB: Muss [2071] ∧ [2073]"
   },
   {
    "id": "RFF_AVE",
    "name": "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55069": {
  "pruefidentifikator": "55069",
  "bezeichnung": "Clearingliste DZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2075]",
    "rule": "AHB: Muss [2075]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVE",
    "name": "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_163",
    "name": "SG4 DTM+163: Beginn Messperiode",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_164",
    "name": "SG4 DTM+164: Ende Messperiode",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55070": {
  "pruefidentifikator": "55070",
  "bezeichnung": "Clearingliste BAS",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Soll",
    "ahbExpr": "Soll [2075]",
    "rule": "AHB: Soll [2075]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Zeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVE",
    "name": "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_163",
    "name": "SG4 DTM+163: Beginn Messperiode",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_164",
    "name": "SG4 DTM+164: Ende Messperiode",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55071": {
  "pruefidentifikator": "55071",
  "bezeichnung": "Aktivierung Zuordnungsermächtigung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (BGM+Z17 Zuordnungsermächtigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "RFF_Z13",
    "name": "SG6 RFF+Z13: Prüfidentifikator (55071)",
    "status": "Muss"
   },
   {
    "id": "SEQ_Z22",
    "name": "SG8 SEQ+Z22: Daten der Summenzeitreihe",
    "status": "Muss"
   },
   {
    "id": "CCI_Z20",
    "name": "SG10 CCI+Z20: Bilanzierungsgebiet",
    "status": "Muss"
   },
   {
    "id": "CCI_Z19",
    "name": "SG10 CCI+Z19: Bilanzkreis",
    "status": "Muss"
   },
   {
    "id": "CCI_15",
    "name": "SG10 CCI+15+Z21: Struktur / Summenzeitreihentyp",
    "status": "Muss"
   },
   {
    "id": "NAD_VY",
    "name": "SG12 NAD+VY: andere zugehörige Partei (MP-ID)",
    "status": "Muss"
   }
  ]
 },
 "55072": {
  "pruefidentifikator": "55072",
  "bezeichnung": "Deaktivierung Zuordnungsermächtigung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (BGM+Z17 Zuordnungsermächtigung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "RFF_Z13",
    "name": "SG6 RFF+Z13: Prüfidentifikator (55072)",
    "status": "Muss"
   },
   {
    "id": "SEQ_Z22",
    "name": "SG8 SEQ+Z22: Daten der Summenzeitreihe",
    "status": "Muss"
   },
   {
    "id": "CCI_Z20",
    "name": "SG10 CCI+Z20: Bilanzierungsgebiet",
    "status": "Muss"
   },
   {
    "id": "CCI_Z19",
    "name": "SG10 CCI+Z19: Bilanzkreis",
    "status": "Muss"
   },
   {
    "id": "CCI_15",
    "name": "SG10 CCI+15+Z21: Struktur / Summenzeitreihentyp",
    "status": "Muss"
   },
   {
    "id": "NAD_VY",
    "name": "SG12 NAD+VY: andere zugehörige Partei (MP-ID)",
    "status": "Muss"
   }
  ]
 },
 "55073": {
  "pruefidentifikator": "55073",
  "bezeichnung": "Übermittlung der Profildefinitionen (an LF/MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   }
  ]
 },
 "55074": {
  "pruefidentifikator": "55074",
  "bezeichnung": "Stammdaten auf eine ORDERS",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [601]",
    "rule": "AHB: Soll [166] ∧ [601]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [601]",
    "rule": "AHB: Muss [601]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55075": {
  "pruefidentifikator": "55075",
  "bezeichnung": "Stammdaten aufgrund einer Änderung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZE3",
      "t": "ZE3 - Stammdatenänderung"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [601]",
    "rule": "AHB: Soll [166] ∧ [601]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [601]",
    "rule": "AHB: Muss [601]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID einer Marktlokation / Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55076": {
  "pruefidentifikator": "55076",
  "bezeichnung": "Antwort auf Stammdatenänderung (ORDERS)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZE3",
      "t": "ZE3 - Stammdatenänderung"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [601]",
    "rule": "AHB: Soll [166] ∧ [601]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [601]",
    "rule": "AHB: Muss [601]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID einer Marktlokation / Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55077": {
  "pruefidentifikator": "55077",
  "bezeichnung": "Anmeldung erzeugende MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW0",
      "t": "ZW0 - Geschäftsvorfall 1"
     },
     {
      "v": "ZW1",
      "t": "ZW1 - Geschäftsvorfall 2"
     },
     {
      "v": "ZW2",
      "t": "ZW2 - Geschäftsvorfall 3"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([476] ⊻ [478])",
    "bedingungen": [
     "2061",
     "479"
    ],
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW1",
     "negiert": true,
     "bedingung": "477"
    },
    "rule": "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [477]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW1",
     "negiert": false,
     "bedingung": "477"
    },
    "rule": "AHB: Muss [2061] ∧ [477]"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z01",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55078": {
  "pruefidentifikator": "55078",
  "bezeichnung": "Bestätigung Anmeldung erzeugende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW0",
      "t": "ZW0 - Geschäftsvorfall 1"
     },
     {
      "v": "ZW1",
      "t": "ZW1 - Geschäftsvorfall 2"
     },
     {
      "v": "ZW2",
      "t": "ZW2 - Geschäftsvorfall 3"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0623)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061",
     "479"
    ],
    "rule": "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ ([477] ⊻ [478])",
    "rule": "AHB: Muss [2061] ∧ ([477] ⊻ [478])"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [623]",
    "rule": "AHB: Muss [623]"
   },
   {
    "id": "RFF_Z60",
    "name": "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55080": {
  "pruefidentifikator": "55080",
  "bezeichnung": "Ablehnung Anmeldung erzeugende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0622)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_Z07",
    "name": "SG4 DTM+Z07: Lieferbeginndatum in Bearbeitung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [355]",
    "rule": "AHB: Muss [355]"
   },
   {
    "id": "DTM_Z08",
    "name": "SG4 DTM+Z08: Datum für nächste Bearbeitung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [355]",
    "rule": "AHB: Muss [355]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID einer Marktlokation / Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55095": {
  "pruefidentifikator": "55095",
  "bezeichnung": "Antwort auf Geschäftsdatenanfrage erzeugende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E44 Informationsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation (Objekt der Anfrage)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)",
    "status": "Muss",
    "rule": "Referenz auf die ursprüngliche Geschäftsdatenanfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY6",
      "t": "ZY6 - Antwort auf GDA erzeugende MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166]",
    "rule": "AHB: Soll [166]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [527]",
    "rule": "AHB: Muss [527]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2313]",
    "rule": "AHB: Muss [2313]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [179]) ⊻ ([174] ∧ [175]))) ⊻ ([177] ∧ [178] ∧ [179])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [215]",
    "rule": "AHB: Soll [166] ∧ [215]"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [665] · Codes: MG [441]",
    "rule": "AHB: Muss [665]"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55109": {
  "pruefidentifikator": "55109",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVC",
    "name": "SG6 RFF+AVC: Kundennummer beim Lieferanten",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "55110": {
  "pruefidentifikator": "55110",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55126": {
  "pruefidentifikator": "55126",
  "bezeichnung": "Bilanzkreisabrechnung verbrauchende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)",
    "status": "Muss",
    "ahbExpr": "Muss ([131] ∧ [144]) ⊻ ([132] ∧ [143]) ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)",
    "status": "Muss",
    "ahbExpr": "Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX3",
      "t": "ZX3 - Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     },
     {
      "v": "ZAN",
      "t": "ZAN - Korrektur Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAN [715]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   }
  ]
 },
 "55136": {
  "pruefidentifikator": "55136",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55137": {
  "pruefidentifikator": "55137",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVC",
    "name": "SG6 RFF+AVC: Kundennummer beim Lieferanten",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "55156": {
  "pruefidentifikator": "55156",
  "bezeichnung": "Rückmeldung Bilanzkreisabrechnung verb. MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Rückmeldung (EBD E_0611)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX3",
      "t": "ZX3 - Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     },
     {
      "v": "ZAN",
      "t": "ZAN - Korrektur Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAN [719]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55168": {
  "pruefidentifikator": "55168",
  "bezeichnung": "Anfrage Verpflichtungsanfrage / Aufforderung (NB an gMSB) (NB an gMSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [675]"
   },
   {
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [670]",
    "rule": "AHB: Soll [46] ∧ [670]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [671]",
    "rule": "AHB: Muss [671]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2003]",
    "rule": "AHB: Soll [2003]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [672] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [672] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [673]",
    "rule": "AHB: Soll [46] ∧ [673]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [674]",
    "rule": "AHB: Soll [166] ∧ [674]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [86] ∧ [78] ∧ [271] ∧ [618]",
    "rule": "AHB: Muss [86] ∧ [78] ∧ [271] ∧ [618]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [668]",
    "rule": "AHB: Soll [166] ∧ [668]"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Messlokation zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [668]",
    "rule": "AHB: Muss [668]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55169": {
  "pruefidentifikator": "55169",
  "bezeichnung": "Bestätigung Verpflichtungsanfrage / Aufforderung (NB an gMSB) (gMSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [675]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [670]",
    "rule": "AHB: Soll [46] ∧ [670]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [671]",
    "rule": "AHB: Muss [671]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [672] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [672] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [673]",
    "rule": "AHB: Soll [46] ∧ [673]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [674]",
    "rule": "AHB: Soll [166] ∧ [674]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [86] ∧ [271]",
    "rule": "AHB: Muss [86] ∧ [271]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [668]",
    "rule": "AHB: Soll [166] ∧ [668]"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Messlokation zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [668]",
    "rule": "AHB: Muss [668]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z37",
    "name": "SG6 RFF+Z37: Referenz auf die ID der Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   }
  ]
 },
 "55170": {
  "pruefidentifikator": "55170",
  "bezeichnung": "Ablehnung Verpflichtungsanfrage / Aufforderung (NB an gMSB) (gMSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01 Anmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + Codeliste S_00xx)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation (alternativ LOC+Z16 Marktlokation)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55173": {
  "pruefidentifikator": "55173",
  "bezeichnung": "Änderung Daten der Lokationsbündelstruktur (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Soll [46] ∧ [677]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY2",
      "t": "ZY2 - Änderung der Lokationsbündelstruktur"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [678]",
    "rule": "AHB: Muss [678]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [679] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [679] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [680]",
    "rule": "AHB: Soll [46] ∧ [680]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([399] ⊻ [202]) ∧ [682]",
    "rule": "AHB: Muss ([399] ⊻ [202]) ∧ [682]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation / Marktlokation / Messlokation / Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   }
  ]
 },
 "55175": {
  "pruefidentifikator": "55175",
  "bezeichnung": "Änderung Daten der Lokationsbündelstruktur (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Soll [46] ∧ [683]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY2",
      "t": "ZY2 - Änderung der Lokationsbündelstruktur"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2004]",
    "rule": "AHB: Muss [2004]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [684] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [684] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [685]",
    "rule": "AHB: Soll [46] ∧ [685]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([399] ⊻ [202]) ∧ [687]",
    "rule": "AHB: Muss ([399] ⊻ [202]) ∧ [687]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation / Marktlokation / Messlokation / Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2313]",
    "rule": "AHB: Muss [2313]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   }
  ]
 },
 "55177": {
  "pruefidentifikator": "55177",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Lokationsbündelstruktur (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Soll [8]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY2",
      "t": "ZY2 - Änderung der Lokationsbündelstruktur"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation / Marktlokation / Messlokation / Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2312]",
    "rule": "AHB: Muss [2312]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   }
  ]
 },
 "55180": {
  "pruefidentifikator": "55180",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Lokationsbündelstruktur (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Soll [8]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY2",
      "t": "ZY2 - Änderung der Lokationsbündelstruktur"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation / Marktlokation / Messlokation / Technischen Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2313]",
    "rule": "AHB: Muss [2313]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die der Technischen Ressource zugeordneten Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [179] ∧ [291]",
    "rule": "AHB: Muss [179] ∧ [291]"
   }
  ]
 },
 "55194": {
  "pruefidentifikator": "55194",
  "bezeichnung": "Antwort auf Geschäftsdatenanfrage (Strom an Gas, NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E44 Informationsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Nummer der Anfrage (Referenz auf die GDA-Anfrage)",
    "status": "Muss",
    "rule": "Referenz auf die ursprüngliche Geschäftsdatenanfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY5",
      "t": "ZY5 - Antwort auf GDA (Strom an Gas)"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55195": {
  "pruefidentifikator": "55195",
  "bezeichnung": "Bilanzierungsgebietsclearingliste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [609]",
    "rule": "AHB: Muss [609]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [201] ∧ [609]",
    "rule": "AHB: Soll [201] ∧ [609]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [54] ∧ [166] ∧ [2061]",
    "rule": "AHB: Soll [54] ∧ [166] ∧ [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z12",
    "name": "SG6 RFF+Z12: Versionsangabe des Profils",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55196": {
  "pruefidentifikator": "55196",
  "bezeichnung": "Antwort auf Bilanzierungsgebietsclearingliste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28]",
    "rule": "AHB: Muss [28]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [147] ∧ [28]",
    "rule": "AHB: Soll [147] ∧ [28]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [54] ∧ [166] ∧ [2061]",
    "rule": "AHB: Soll [54] ∧ [166] ∧ [2061]"
   },
   {
    "id": "RFF_Z22",
    "name": "SG6 RFF+Z22: Referenz auf die Marktlokation / Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [29] ∧ [606]",
    "rule": "AHB: Muss [29] ∧ [606]"
   },
   {
    "id": "DTM_Z15",
    "name": "SG4 DTM+Z15: Bilanzierungsbeginn aus Daten der beteiligten Marktrolle",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z16",
    "name": "SG4 DTM+Z16: Bilanzierungsende aus Daten der beteiligten Marktrolle",
    "status": "Soll",
    "ahbExpr": "Soll [37]",
    "rule": "AHB: Soll [37]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID einer Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z12",
    "name": "SG6 RFF+Z12: Versionsangabe des Profils",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55197": {
  "pruefidentifikator": "55197",
  "bezeichnung": "Aktivierung ZP tägliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55198": {
  "pruefidentifikator": "55198",
  "bezeichnung": "Deaktivierung ZP tägliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55199": {
  "pruefidentifikator": "55199",
  "bezeichnung": "Aktivierung ZP LF-AASZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55200": {
  "pruefidentifikator": "55200",
  "bezeichnung": "Deaktivierung ZP LF-AASZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55201": {
  "pruefidentifikator": "55201",
  "bezeichnung": "Lieferantenausfallarbeitsclearingliste (LF-AACL)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2207]",
    "rule": "AHB: Muss [2207]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [2061] ∧ [166]",
    "rule": "AHB: Soll [2061] ∧ [166]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55202": {
  "pruefidentifikator": "55202",
  "bezeichnung": "Korrekturliste LF-AACL",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2207]",
    "rule": "AHB: Muss [2207]"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [2061] ∧ [166]",
    "rule": "AHB: Soll [2061] ∧ [166]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55203": {
  "pruefidentifikator": "55203",
  "bezeichnung": "Aktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55204": {
  "pruefidentifikator": "55204",
  "bezeichnung": "Antwort auf Aktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55205": {
  "pruefidentifikator": "55205",
  "bezeichnung": "Weiterleitung Aktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55206": {
  "pruefidentifikator": "55206",
  "bezeichnung": "Deaktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55207": {
  "pruefidentifikator": "55207",
  "bezeichnung": "Antwort auf Deaktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55208": {
  "pruefidentifikator": "55208",
  "bezeichnung": "Weiterleitung Deaktivierung ZP monatliche AAÜZ",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55209": {
  "pruefidentifikator": "55209",
  "bezeichnung": "Aktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55210": {
  "pruefidentifikator": "55210",
  "bezeichnung": "Antwort auf Aktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55211": {
  "pruefidentifikator": "55211",
  "bezeichnung": "Weiterleitung Aktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55212": {
  "pruefidentifikator": "55212",
  "bezeichnung": "Deaktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55213": {
  "pruefidentifikator": "55213",
  "bezeichnung": "Antwort auf Deaktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55214": {
  "pruefidentifikator": "55214",
  "bezeichnung": "Weiterleitung Deaktivierung ZP monatliche AAÜZ (Variante)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55218": {
  "pruefidentifikator": "55218",
  "bezeichnung": "Abrechnungsdaten Netznutzungsabrechnung (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)",
    "status": "Muss",
    "ahbExpr": "Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)",
    "status": "Muss",
    "ahbExpr": "Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX4",
      "t": "ZX4 - Abrechnungsdaten NNA"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2004]",
    "rule": "AHB: Muss [2004]"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z09",
    "name": "SG4 DTM+Z09: Nächste Netznutzungsabrechnung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [489] ∧ [531]",
    "rule": "AHB: Muss [489] ∧ [531]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55220": {
  "pruefidentifikator": "55220",
  "bezeichnung": "Rückmeldung Netznutzungsabrechnung (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Rückmeldung (EBD E_0610)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX4",
      "t": "ZX4 - Abrechnungsdaten NNA"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z51",
    "name": "SG6 RFF+Z51: Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8] · Codes: Z51 [2P0..n], Z52 [3P0..n]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_Z09",
    "name": "SG4 DTM+Z09: Nächste Netznutzungsabrechnung",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   }
  ]
 },
 "55223": {
  "pruefidentifikator": "55223",
  "bezeichnung": "DZÜ-Liste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZP3",
      "t": "ZP3 - Stammdaten"
     },
     {
      "v": "ZP4",
      "t": "ZP4 - Werte"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348] ∧ [659]",
    "rule": "AHB: Muss [2061] ∧ [348] ∧ [659]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347] ∧ [659]",
    "rule": "AHB: Muss [2061] ∧ [347] ∧ [659]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVE",
    "name": "SG6 RFF+AVE: Referenz auf die ID der Bilanzierungsgebietssummenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55224": {
  "pruefidentifikator": "55224",
  "bezeichnung": "Antwort auf DZÜ-Liste",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AUU",
    "name": "SG6 RFF+AUU: Versionsangabe der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [348] ∧ [659]",
    "rule": "AHB: Muss [2061] ∧ [348] ∧ [659]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347] ∧ [659]",
    "rule": "AHB: Muss [2061] ∧ [347] ∧ [659]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55225": {
  "pruefidentifikator": "55225",
  "bezeichnung": "Änderung Daten der Blindabrechnungsdaten der NeLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX5",
      "t": "ZX5 - Änderung Blindabrechnungsdaten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55227": {
  "pruefidentifikator": "55227",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Blindabrechnungsdaten der NeLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX5",
      "t": "ZX5 - Änderung Blindabrechnungsdaten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55230": {
  "pruefidentifikator": "55230",
  "bezeichnung": "Änderung Daten der Blindabrechnungsdaten der NeLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX5",
      "t": "ZX5 - Änderung Blindabrechnungsdaten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55232": {
  "pruefidentifikator": "55232",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Blindabrechnungsdaten der NeLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX5",
      "t": "ZX5 - Änderung Blindabrechnungsdaten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55235": {
  "pruefidentifikator": "55235",
  "bezeichnung": "Zuordnung ZP der NGZ zur NZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2096] ∧ [594]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVE",
    "name": "SG6 RFF+AVE: Referenz auf die ID der Summenzeitreihe",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55236": {
  "pruefidentifikator": "55236",
  "bezeichnung": "Beendigung Zuordnung ZP der NGZ zur NZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2096] ∧ [594]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55237": {
  "pruefidentifikator": "55237",
  "bezeichnung": "Antwort Zuordnung ZP der NGZ zur NZR",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: ID des MaBiS-Zählpunkts",
    "status": "Muss",
    "ahbExpr": "Muss [2096] ∧ [594]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Soll",
    "ahbExpr": "Soll [71]",
    "rule": "AHB: Soll [71]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [72]",
    "rule": "AHB: Soll [72]"
   }
  ]
 },
 "55238": {
  "pruefidentifikator": "55238",
  "bezeichnung": "Anmeldung in Modell 2",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z38",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55239": {
  "pruefidentifikator": "55239",
  "bezeichnung": "Antwort auf Anmeldung in Modell 2",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [56] ∧ [2061] ∧ [663]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56] ∧ [2061] ∧ [663]",
    "rule": "AHB: Muss [56] ∧ [2061] ∧ [663]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55240": {
  "pruefidentifikator": "55240",
  "bezeichnung": "Beendigung der Zuordnung (Modell 2)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZC8",
      "t": "ZC8 - Beendigung der Zuordnung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55241": {
  "pruefidentifikator": "55241",
  "bezeichnung": "Antwort auf Beendigung der Zuordnung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [56] ∧ [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     },
     {
      "v": "ZC8",
      "t": "ZC8 - Beendigung der Zuordnung"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55242": {
  "pruefidentifikator": "55242",
  "bezeichnung": "Abmeldung aus dem Modell 2",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z38",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55243": {
  "pruefidentifikator": "55243",
  "bezeichnung": "Antwort auf Abmeldung aus Modell 2",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [56] ∧ [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56]",
    "rule": "AHB: Muss [56]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z15",
    "name": "SG5 LOC+Z15: MaBiS-Zählpunkt",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [56] ∧ [2061]",
    "rule": "AHB: Muss [56] ∧ [2061]"
   }
  ]
 },
 "55553": {
  "pruefidentifikator": "55553",
  "bezeichnung": "Daten auf individuelle Bestellung (MSB an NB/LF/MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "RFF_Z43",
    "name": "SG6 RFF+Z43: Referenznummer des Vorgangs der individuellen Bestellung",
    "status": "Muss",
    "rule": "Referenz auf den bestellten Vorgang."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY9",
      "t": "ZY9 - Daten auf individuelle Bestellung"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z42",
    "name": "SG6 RFF+Z42: Referenznummer der Nachricht der betroffenen Antwort auf Bestellung",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf die Gerätenummer",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [665]",
    "rule": "AHB: Muss [665]"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55555": {
  "pruefidentifikator": "55555",
  "bezeichnung": "Anfrage/Rückmeldung Daten der individuellen Bestellung (NB/LF/MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "RFF_Z43",
    "name": "SG6 RFF+Z43: Referenznummer des Vorgangs der individuellen Bestellung",
    "status": "Muss",
    "rule": "Referenz auf den bestellten Vorgang."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY9",
      "t": "ZY9 - Daten auf individuelle Bestellung"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z42",
    "name": "SG6 RFF+Z42: Referenznummer der Nachricht der betroffenen Antwort auf Bestellung",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf die Gerätenummer",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [665]",
    "rule": "AHB: Muss [665]"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55557": {
  "pruefidentifikator": "55557",
  "bezeichnung": "Änderung Daten der Messstellenbetriebsabrechnungsdaten der MaLo (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZU1",
      "t": "ZU1 - Änderung von MSB Abrechnungsdaten"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55559": {
  "pruefidentifikator": "55559",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messstellenbetriebsabrechnungsdaten der MaLo (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZU1",
      "t": "ZU1 - Änderung von MSB Abrechnungsdaten"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55600": {
  "pruefidentifikator": "55600",
  "bezeichnung": "Anmeldung neue verbrauchende MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Soll [2061] ∧ [165]",
    "bedingungen": [
     "2061",
     "480"
    ],
    "rule": "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "STS_7_befristet",
    "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z01",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55601": {
  "pruefidentifikator": "55601",
  "bezeichnung": "Anmeldung neue erzeugende MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW0",
      "t": "ZW0 - Geschäftsvorfall 1"
     },
     {
      "v": "ZW2",
      "t": "ZW2 - Geschäftsvorfall 3"
     }
    ],
    "ahbExpr": "Codes: ZW0 [560], ZW2 [561]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Soll [2061] ∧ [165]",
    "bedingungen": [
     "2061",
     "479"
    ],
    "rule": "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "ahbExpr": "Codes: ZW0 [560], ZW2 [561]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ],
  "nutzdaten": [
   {
    "seq": "Z01",
    "merkmale": [
     {
      "cci": "ZB3",
      "cav": [
       {
        "code": "Z91",
        "wert": "9911000000456"
       }
      ]
     }
    ]
   }
  ]
 },
 "55602": {
  "pruefidentifikator": "55602",
  "bezeichnung": "Bestätigung Anmeldung neue verb. MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Datum Vertragsende (Ende zum)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW6",
      "t": "ZW6 - Pauschale Marktlokation"
     },
     {
      "v": "ZW7",
      "t": "ZW7 - Gemessene Marktlokation"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0608)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061",
     "480"
    ],
    "rule": "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [483] ∧ [623]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW7",
     "negiert": false,
     "bedingung": "483"
    },
    "rule": "AHB: Muss [483] ∧ [623]"
   },
   {
    "id": "RFF_Z60",
    "name": "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_befristet",
    "name": "SG4 STS+7: Ergänzung für Lieferende bei befristeter Anmeldung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E01",
      "t": "E01 - Ein-/Auszug (Umzug)"
     },
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Codes: E01 [9P0..1], E03 [9P0..1]",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55603": {
  "pruefidentifikator": "55603",
  "bezeichnung": "Bestätigung Anmeldung neue erz. MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW0",
      "t": "ZW0 - Geschäftsvorfall 1"
     },
     {
      "v": "ZW2",
      "t": "ZW2 - Geschäftsvorfall 3"
     }
    ],
    "ahbExpr": "Codes: ZW0 [560], ZW2 [561]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0608)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061",
     "479"
    ],
    "rule": "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "ahbExpr": "Codes: ZW0 [560], ZW2 [561]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [478]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW2",
     "negiert": false,
     "bedingung": "478"
    },
    "rule": "AHB: Muss [478]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [623]",
    "rule": "AHB: Muss [623]"
   },
   {
    "id": "RFF_Z60",
    "name": "SG6 RFF+Z60: Informativ zur Umsetzung geplantes Produktpaket",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55604": {
  "pruefidentifikator": "55604",
  "bezeichnung": "Ablehnung Anmeldung neue verb. MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0608)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Soll [2061] ∧ [165]",
    "bedingungen": [
     "2061",
     "480"
    ],
    "rule": "Muss bei verbrauchender Marktlokation (STS-Ergänzung ZW4)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55605": {
  "pruefidentifikator": "55605",
  "bezeichnung": "Ablehnung Anmeldung neue erz. MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0608)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [43]",
    "bedingungen": [
     "2061",
     "479"
    ],
    "rule": "Muss bei erzeugender Marktlokation (STS-Ergänzung ZW3)."
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E02",
      "t": "E02 - Einzug in Neuanlage"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55607": {
  "pruefidentifikator": "55607",
  "bezeichnung": "Ankündigung Zuordnung LF zur erz. MaLo/Tranche (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung (Fall)",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW8",
      "t": "ZW8 - Fall 1"
     },
     {
      "v": "ZW9",
      "t": "ZW9 - Fall 2"
     },
     {
      "v": "ZX0",
      "t": "ZX0 - Fall 3"
     },
     {
      "v": "ZX1",
      "t": "ZX1 - Fall 4"
     }
    ]
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der erzeugenden Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061]",
    "bedingungen": [
     "2061",
     "479"
    ],
    "rule": "Muss bei erzeugender Marktlokation; Entweder-Oder mit Tranche (LOC+Z21)."
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [487] Soll [2061] ∧ [166] ∧ [484]",
    "bedingungen": [
     "2061",
     "481"
    ],
    "rule": "Muss bei Tranche; Entweder-Oder mit erzeugender Marktlokation (LOC+Z16)."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "AHB: Muss [10]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [688]",
    "rule": "AHB: Soll [46] ∧ [688]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [689] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [689] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [690]",
    "rule": "AHB: Soll [46] ∧ [690]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [623]",
    "rule": "AHB: Muss [623]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55608": {
  "pruefidentifikator": "55608",
  "bezeichnung": "Bestätigung Ankündigung Zuordnung (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Datum Vertragsbeginn (Beginn zum)",
    "status": "Muss",
    "rule": "[UB1] Zeitangabe in UTC."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung (Fall)",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW8",
      "t": "ZW8 - Fall 1"
     },
     {
      "v": "ZW9",
      "t": "ZW9 - Fall 2"
     },
     {
      "v": "ZX0",
      "t": "ZX0 - Fall 3"
     },
     {
      "v": "ZX1",
      "t": "ZX1 - Fall 4"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Zustimmung, EBD E_0603)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "AHB: Muss [10]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55609": {
  "pruefidentifikator": "55609",
  "bezeichnung": "Ablehnung Ankündigung Zuordnung (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung (Fall)",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW8",
      "t": "ZW8 - Fall 1"
     },
     {
      "v": "ZW9",
      "t": "ZW9 - Fall 2"
     },
     {
      "v": "ZX0",
      "t": "ZX0 - Fall 3"
     },
     {
      "v": "ZX1",
      "t": "ZX1 - Fall 4"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Ablehnung, EBD E_0603)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "rule": "AHB: Muss"
   }
  ]
 },
 "55611": {
  "pruefidentifikator": "55611",
  "bezeichnung": "Beendigung der Zuordnung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [349]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [475] ∧ [507]",
    "rule": "AHB: Muss [475] ∧ [507]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [474]",
    "rule": "AHB: Muss [474]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZC8",
      "t": "ZC8 - Beendigung der Zuordnung"
     },
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [347]",
    "rule": "AHB: Muss [2061] ∧ [347]"
   }
  ]
 },
 "55613": {
  "pruefidentifikator": "55613",
  "bezeichnung": "Bilanzkreisabrechnung verbrauchende MaLo (NB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)",
    "status": "Muss",
    "ahbExpr": "Muss ([131] ∧ [144]) ⊻ ([132] ∧ [143]) ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)",
    "status": "Muss",
    "ahbExpr": "Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZZB",
      "t": "ZZB - Stilllegung incl. Stilllegung MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAN [715], ZZB [328], ZZB [578], ZZB [313]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX3",
      "t": "ZX3 - Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     },
     {
      "v": "ZAN",
      "t": "ZAN - Korrektur Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAN [715], ZZB [328], ZZB [578], ZZB [313]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   }
  ]
 },
 "55614": {
  "pruefidentifikator": "55614",
  "bezeichnung": "Rückmeldung Bilanzkreisabrechnung verb. MaLo (ÜNB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Rückmeldung (EBD E_0611)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX3",
      "t": "ZX3 - Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     },
     {
      "v": "ZAN",
      "t": "ZAN - Korrektur Abrechnungsdaten BK-Abrechnung verbrauchender MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55615": {
  "pruefidentifikator": "55615",
  "bezeichnung": "Änderung Daten der Netzlokation (NeLo) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55616": {
  "pruefidentifikator": "55616",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55617": {
  "pruefidentifikator": "55617",
  "bezeichnung": "Änderung Daten der Technische Ressource (TR) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: ID der Technischen Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY0",
      "t": "ZY0 - Änderung Daten der TR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die der Technischen Ressource zugeordneten Steuerbaren Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [699]",
    "rule": "AHB: Soll [166] ∧ [699]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   }
  ]
 },
 "55618": {
  "pruefidentifikator": "55618",
  "bezeichnung": "Änderung Daten der Steuerbare Ressource (SR) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55619": {
  "pruefidentifikator": "55619",
  "bezeichnung": "Änderung Daten der Tranche (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55620": {
  "pruefidentifikator": "55620",
  "bezeichnung": "Änderung Daten der Messlokation (MeLo) (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z05",
    "name": "SG6 RFF+Z05: Abrechnung des Messstellenbetriebs über NNE",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [508]",
    "rule": "AHB: Muss [508]"
   }
  ]
 },
 "55621": {
  "pruefidentifikator": "55621",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55622": {
  "pruefidentifikator": "55622",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55623": {
  "pruefidentifikator": "55623",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Technische Ressource (TR) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: ID der Technischen Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY0",
      "t": "ZY0 - Änderung Daten der TR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die der Technischen Ressource zugeordneten Steuerbaren Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   }
  ]
 },
 "55624": {
  "pruefidentifikator": "55624",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Steuerbare Ressource (SR) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55625": {
  "pruefidentifikator": "55625",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Tranche (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55626": {
  "pruefidentifikator": "55626",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messlokation (MeLo) (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z05",
    "name": "SG6 RFF+Z05: Abrechnung des Messstellenbetriebs über NNE",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   }
  ]
 },
 "55627": {
  "pruefidentifikator": "55627",
  "bezeichnung": "Änderung Daten der Netzlokation (NeLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55628": {
  "pruefidentifikator": "55628",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55629": {
  "pruefidentifikator": "55629",
  "bezeichnung": "Änderung Daten der Technische Ressource (TR) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: ID der Technischen Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY0",
      "t": "ZY0 - Änderung Daten der TR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die der Technischen Ressource zugeordneten Steuerbaren Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [699]",
    "rule": "AHB: Soll [166] ∧ [699]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [700]",
    "rule": "AHB: Soll [166] ∧ [700]"
   }
  ]
 },
 "55630": {
  "pruefidentifikator": "55630",
  "bezeichnung": "Änderung Daten der Steuerbare Ressource (SR) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55632": {
  "pruefidentifikator": "55632",
  "bezeichnung": "Änderung Daten der Messlokation (MeLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55633": {
  "pruefidentifikator": "55633",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55634": {
  "pruefidentifikator": "55634",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55635": {
  "pruefidentifikator": "55635",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Technische Ressource (TR) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: ID der Technischen Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY0",
      "t": "ZY0 - Änderung Daten der TR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die der Technischen Ressource zugeordneten Steuerbaren Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die der Technischen Ressource zugeordneten Netzlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8]",
    "rule": "AHB: Soll [8]"
   }
  ]
 },
 "55636": {
  "pruefidentifikator": "55636",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Steuerbare Ressource (SR) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55638": {
  "pruefidentifikator": "55638",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messlokation (MeLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55639": {
  "pruefidentifikator": "55639",
  "bezeichnung": "Änderung Daten der Netzlokation (NeLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55640": {
  "pruefidentifikator": "55640",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2004]",
    "rule": "AHB: Muss [2004]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55641": {
  "pruefidentifikator": "55641",
  "bezeichnung": "Änderung Daten der Steuerbare Ressource (SR) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55642": {
  "pruefidentifikator": "55642",
  "bezeichnung": "Änderung Daten der Tranche (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55643": {
  "pruefidentifikator": "55643",
  "bezeichnung": "Änderung Daten der Messlokation (MeLo) (MSB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55644": {
  "pruefidentifikator": "55644",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55645": {
  "pruefidentifikator": "55645",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z51",
    "name": "SG6 RFF+Z51: Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8] · Codes: Z51 [2P0..n], Z52 [3P0..n]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55646": {
  "pruefidentifikator": "55646",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Steuerbare Ressource (SR) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55647": {
  "pruefidentifikator": "55647",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Tranche (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55648": {
  "pruefidentifikator": "55648",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messlokation (MeLo) (NB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55649": {
  "pruefidentifikator": "55649",
  "bezeichnung": "Änderung Daten der Netzlokation (NeLo) (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55650": {
  "pruefidentifikator": "55650",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2004]",
    "rule": "AHB: Muss [2004]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55651": {
  "pruefidentifikator": "55651",
  "bezeichnung": "Änderung Daten der Steuerbare Ressource (SR) (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55652": {
  "pruefidentifikator": "55652",
  "bezeichnung": "Änderung Daten der Tranche (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55653": {
  "pruefidentifikator": "55653",
  "bezeichnung": "Änderung Daten der Messlokation (MeLo) (MSB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [215]",
    "rule": "AHB: Soll [166] ∧ [215]"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55654": {
  "pruefidentifikator": "55654",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55655": {
  "pruefidentifikator": "55655",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z51",
    "name": "SG6 RFF+Z51: Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8] · Codes: Z51 [2P0..n], Z52 [3P0..n]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55656": {
  "pruefidentifikator": "55656",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Steuerbare Ressource (SR) (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55657": {
  "pruefidentifikator": "55657",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Tranche (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55658": {
  "pruefidentifikator": "55658",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messlokation (MeLo) (LF an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Soll",
    "ahbExpr": "Soll [166] ∧ [215]",
    "rule": "AHB: Soll [166] ∧ [215]"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55659": {
  "pruefidentifikator": "55659",
  "bezeichnung": "Änderung Daten der Netzlokation (NeLo) (MSB an weiteren MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55660": {
  "pruefidentifikator": "55660",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) (MSB an weiteren MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z50",
    "name": "SG6 RFF+Z50: Termine der Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2004]",
    "rule": "AHB: Muss [2004]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55661": {
  "pruefidentifikator": "55661",
  "bezeichnung": "Änderung Daten der Steuerbare Ressource (SR) (MSB an weiteren MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55662": {
  "pruefidentifikator": "55662",
  "bezeichnung": "Änderung Daten der Tranche (MSB an weiteren MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55663": {
  "pruefidentifikator": "55663",
  "bezeichnung": "Änderung Daten der Messlokation (MeLo) (MSB an weiteren MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55664": {
  "pruefidentifikator": "55664",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Netzlokation (NeLo) (weiterer MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX8",
      "t": "ZX8 - Änderung Daten der NeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55665": {
  "pruefidentifikator": "55665",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) (weiterer MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z51",
    "name": "SG6 RFF+Z51: Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [8] · Codes: Z51 [2P0..n], Z52 [3P0..n]",
    "rule": "AHB: Soll [8]"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des MSB",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [562]",
    "rule": "AHB: Muss [562]"
   }
  ]
 },
 "55666": {
  "pruefidentifikator": "55666",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Steuerbare Ressource (SR) (weiterer MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: ID der Steuerbaren Ressource",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX9",
      "t": "ZX9 - Änderung Daten der SR"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55667": {
  "pruefidentifikator": "55667",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Tranche (weiterer MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55669": {
  "pruefidentifikator": "55669",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Messlokation (MeLo) (weiterer MSB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: ID der Messlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX7",
      "t": "ZX7 - Änderung Daten der MeLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z14",
    "name": "SG6 RFF+Z14: Referenz auf das Smartmeter-Gateway",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AGK",
    "name": "SG6 RFF+AGK: Konfigurations-ID",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [402] ∧ [420]",
    "rule": "AHB: Muss [402] ∧ [420]"
   },
   {
    "id": "RFF_Z46",
    "name": "SG6 RFF+Z46: Referenz auf Zeitraum.ID",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55670": {
  "pruefidentifikator": "55670",
  "bezeichnung": "Stammdaten Bilanzkreistreue (NB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     },
     {
      "v": "ZZB",
      "t": "ZZB - Stilllegung incl. Stilllegung MaLo"
     }
    ],
    "ahbExpr": "Codes: ZZB [328], ZZB [578], ZZB [313]"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZAM",
      "t": "ZAM - Stammdaten BK-Treue"
     }
    ],
    "ahbExpr": "Codes: ZZB [328], ZZB [578], ZZB [313]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [481] ∧ [718] ∧ [2001]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [481] ∧ [718] ∧ [2001]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55671": {
  "pruefidentifikator": "55671",
  "bezeichnung": "Rückmeldung/Anfrage Stammdaten Bilanzkreistreue (ÜNB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW4",
      "t": "ZW4 - Verbrauchende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ]
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD E_0574)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZAM",
      "t": "ZAM - Stammdaten BK-Treue"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [481] ∧ [2001]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [481] ∧ [2001]"
   },
   {
    "id": "RFF_Z48",
    "name": "SG6 RFF+Z48: Verwendungszeitraum der Daten",
    "status": "Soll",
    "ahbExpr": "Soll [8] ∧ [707]",
    "rule": "AHB: Soll [8] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134]",
    "rule": "AHB: Muss [131] ⊻ [134]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472]",
    "rule": "AHB: Muss [472]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55672": {
  "pruefidentifikator": "55672",
  "bezeichnung": "Bilanzkreisabrechnung erzeugende MaLo (NB an LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "DTM_Z25",
    "name": "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)",
    "status": "Muss",
    "ahbExpr": "Muss ([131] ∧ [146]) ⊻ ([132] ∧ [145]) ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)",
    "status": "Muss",
    "ahbExpr": "Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ],
    "ahbExpr": "Codes: ZAO [715]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX2",
      "t": "ZX2 - Abrechnungsdaten BK-Abrechnung erzeugender Malo"
     },
     {
      "v": "ZAO",
      "t": "ZAO - Korrektur Abrechnungsdaten BK-Abrechnung erzeugender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAO [715]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [2061] ∧ [481]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   }
  ]
 },
 "55673": {
  "pruefidentifikator": "55673",
  "bezeichnung": "Rückmeldung Bilanzkreisabrechnung erz. MaLo (LF an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Rückmeldung (EBD E_0611)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ],
    "ahbExpr": "Codes: ZAO [719]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX2",
      "t": "ZX2 - Abrechnungsdaten BK-Abrechnung erzeugender Malo"
     },
     {
      "v": "ZAO",
      "t": "ZAO - Korrektur Abrechnungsdaten BK-Abrechnung erzeugender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAO [719]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [2061] ∧ [481]"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55674": {
  "pruefidentifikator": "55674",
  "bezeichnung": "Bilanzkreisabrechnung erzeugende MaLo (NB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "DTM_Z25",
    "name": "SG6 DTM+Z25: Verwendung der Daten ab (Verwendungszeitraum-Beginn)",
    "status": "Muss",
    "ahbExpr": "Muss ([131] ∧ [146]) ⊻ ([132] ∧ [145]) ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG6 DTM+Z26: Verwendung der Daten bis (Verwendungszeitraum-Ende)",
    "status": "Muss",
    "ahbExpr": "Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     },
     {
      "v": "ZZB",
      "t": "ZZB - Stilllegung incl. Stilllegung MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAO [715], ZZB [328], ZZB [578], ZZB [313]",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX2",
      "t": "ZX2 - Abrechnungsdaten BK-Abrechnung erzeugender Malo"
     },
     {
      "v": "ZAO",
      "t": "ZAO - Korrektur Abrechnungsdaten BK-Abrechnung erzeugender MaLo"
     }
    ],
    "ahbExpr": "Codes: ZAO [715], ZZB [328], ZZB [578], ZZB [313]",
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [2061] ∧ [481]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   }
  ]
 },
 "55675": {
  "pruefidentifikator": "55675",
  "bezeichnung": "Rückmeldung Bilanzkreisabrechnung erz. MaLo (ÜNB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": true,
     "bedingung": "481"
    }
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Rückmeldung (EBD E_0611)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus der Meldung",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer (IDE+24) aus der Abrechnungsmeldung."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7",
    "name": "SG4 STS+7: Transaktionsgrundergänzung",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZW3",
      "t": "ZW3 - Erzeugende Marktlokation"
     },
     {
      "v": "ZW5",
      "t": "ZW5 - Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX2",
      "t": "ZX2 - Abrechnungsdaten BK-Abrechnung erzeugender Malo"
     },
     {
      "v": "ZAO",
      "t": "ZAO - Korrektur Abrechnungsdaten BK-Abrechnung erzeugender MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [481]",
    "abhaengig": {
     "feld": "STS_7",
     "code": "ZW5",
     "negiert": false,
     "bedingung": "481"
    },
    "rule": "AHB: Muss [2061] ∧ [481]"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55684": {
  "pruefidentifikator": "55684",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) an ÜNB (MSB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55685": {
  "pruefidentifikator": "55685",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) an ÜNB (ÜNB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55686": {
  "pruefidentifikator": "55686",
  "bezeichnung": "Änderung Daten der Tranche an ÜNB (MSB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55687": {
  "pruefidentifikator": "55687",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Tranche an ÜNB (ÜNB an MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: ID der Tranche",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY1",
      "t": "ZY1 - Änderung Daten der Tranche"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55688": {
  "pruefidentifikator": "55688",
  "bezeichnung": "Änderung Daten der Marktlokation (MaLo) an ÜNB (NB an ÜNB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55689": {
  "pruefidentifikator": "55689",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Marktlokation (MaLo) an ÜNB (ÜNB an NB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZX6",
      "t": "ZX6 - Änderung Daten der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707] · Codes: Z47 [5P0..n], Z48 [2P0..n], Z54 [4P0..n], Z55 [2P0..n]",
    "rule": "AHB: Muss [315] ∧ [707] Soll [8] ∧ [301] ∧ [707]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [134] ⊻ [135]",
    "rule": "AHB: Muss [131] ⊻ [134] ⊻ [135]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [472] ⊻ [473]",
    "rule": "AHB: Muss [472] ⊻ [473]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55690": {
  "pruefidentifikator": "55690",
  "bezeichnung": "Änderung Daten der Lokationsbündelstruktur (NBA an NBN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z18",
    "name": "SG5 LOC+Z18: ID der Netzlokation",
    "status": "Muss",
    "ahbExpr": "Soll [46] ∧ [683]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZY2",
      "t": "ZY2 - Änderung der Lokationsbündelstruktur"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: Marktlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [678]",
    "rule": "AHB: Muss [678]"
   },
   {
    "id": "LOC_Z22",
    "name": "SG5 LOC+Z22: Ruhende Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [2015]",
    "rule": "AHB: Soll [2015]"
   },
   {
    "id": "LOC_Z20",
    "name": "SG5 LOC+Z20: Technische Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [679] ∧ [694] ∧ [698]",
    "rule": "AHB: Soll [46] ∧ [679] ∧ [694] ∧ [698]"
   },
   {
    "id": "LOC_Z19",
    "name": "SG5 LOC+Z19: Steuerbare Ressource",
    "status": "Soll",
    "ahbExpr": "Soll [46] ∧ [680]",
    "rule": "AHB: Soll [46] ∧ [680]"
   },
   {
    "id": "LOC_Z21",
    "name": "SG5 LOC+Z21: Tranche",
    "status": "Soll",
    "ahbExpr": "Soll [166]",
    "rule": "AHB: Soll [166]"
   },
   {
    "id": "LOC_Z17",
    "name": "SG5 LOC+Z17: Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([399] ⊻ [202]) ∧ [682]",
    "rule": "AHB: Muss ([399] ⊻ [202]) ∧ [682]"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [707] ∧ [534] · Codes: Z49 [1P0..n], Z53 [1P0..n]",
    "rule": "AHB: Muss [707] ∧ [534]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [131] ⊻ [401]",
    "rule": "AHB: Muss [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [471]",
    "rule": "AHB: Muss [471]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   },
   {
    "id": "RFF_Z31",
    "name": "SG6 RFF+Z31: Referenz auf die Lokationsbündelstruktur",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z32",
    "name": "SG6 RFF+Z32: Referenz auf die ID der Netzlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z33",
    "name": "SG6 RFF+Z33: Referenz auf den Objektcode in der Lokationsbündelstruktur",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2313]",
    "rule": "AHB: Muss [2313]"
   },
   {
    "id": "RFF_Z34",
    "name": "SG6 RFF+Z34: Referenz auf die ID der vorgelagerten Netzlokation / Messlokation",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])",
    "rule": "AHB: Muss ([176] ∧ (([173] ∧ [160]) ⊻ ([174] ∧ [196]))) ⊻ ([177] ∧ [178] ∧ [229])"
   },
   {
    "id": "RFF_Z16",
    "name": "SG6 RFF+Z16: Referenz auf die Marktlokation der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z20",
    "name": "SG6 RFF+Z20: Referenz auf die ID der Tranche",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z38",
    "name": "SG6 RFF+Z38: Referenz auf die ID der Steuerbaren Ressource",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "55691": {
  "pruefidentifikator": "55691",
  "bezeichnung": "Änderung Daten der Paket-ID der Marktlokation (NB-Wechsel) (NBA an NBN)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZZA",
      "t": "ZZA - Änderung Paket-ID der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z49",
    "name": "SG6 RFF+Z49: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] · Codes: Z49 [1P0..n], Z53 [8P0..n]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [516]",
    "rule": "AHB: Muss [516]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z49",
      "t": "Z49 – Gültige Daten"
     },
     {
      "v": "Z53",
      "t": "Z53 – Keine Daten"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 },
 "55692": {
  "pruefidentifikator": "55692",
  "bezeichnung": "Rückmeldung/Anfrage Daten der Paket-ID der Marktlokation (NB-Wechsel) (NBN an NBA)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E03 Änderungsmeldung / Z88 Anfrage Datenclearing)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Qualifikator 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Prüfschritt-Code + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_Z16",
    "name": "SG5 LOC+Z16: ID der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zwingende Zuordnung der Vorgangsnummer (IDE+24) aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss",
    "isSelect": true,
    "options": [
     {
      "v": "ZZA",
      "t": "ZZA - Änderung Paket-ID der MaLo"
     }
    ],
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z47",
    "name": "SG6 RFF+Z47: Verwendungszeitraum der Daten",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [315] ∧ [2080] Soll [8] ∧ [301] ∧ [2080]] · Codes: Z47 [5P0..1], Z48 [2P0..1], Z54 [4P0..1], Z55 [2P0..1]",
    "rule": "AHB: Muss [315] ∧ [2080] Soll [8] ∧ [301] ∧ [2080]]"
   },
   {
    "id": "DTM_Z25",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [516]",
    "rule": "AHB: Muss [516]"
   },
   {
    "id": "RFF_VZ_QUALITAET",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 1",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: Verwendungszeitraum der Daten, Zeitraum-ID 1 [126]"
   },
   {
    "id": "RFF_VZ_QUALITAET_2",
    "name": "SG6 RFF: Qualität Verwendungszeitraum 2",
    "status": "Kann",
    "isSelect": true,
    "options": [
     {
      "v": "",
      "t": "– keine Angabe –"
     },
     {
      "v": "Z47",
      "t": "Z47 – Im System vorhandene Daten"
     },
     {
      "v": "Z48",
      "t": "Z48 – Erwartete Daten"
     },
     {
      "v": "Z54",
      "t": "Z54 – Im System keine Daten vorhanden"
     },
     {
      "v": "Z55",
      "t": "Z55 – Keine Daten erwartet"
     }
    ],
    "rule": "AHB: zweiter Verwendungszeitraum, Zeitraum-ID 2 [126]"
   },
   {
    "id": "DTM_Z25_2",
    "name": "SG4 DTM+Z25: Verwendung der Daten ab (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [131] ⊻ [401]"
   },
   {
    "id": "DTM_Z26_2",
    "name": "SG4 DTM+Z26: Verwendung der Daten bis (Zeitraum 2)",
    "status": "Kann",
    "isDate": true,
    "rule": "AHB: zweiter Verwendungszeitraum [471]"
   }
  ]
 }
};
if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;
