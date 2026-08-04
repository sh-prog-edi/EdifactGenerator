// _regeln.js — Regel-/Feldauswahl-Daten je Prüf-ID (202610/Stammdaten/UTILMD/Gas).
// GENERIERT durch scripts/baue_pid_regeln.js aus den früheren Einzeldateien
// <PID>.js (Phase 2, Feldauswahl-Umbau — Protokoll Abschnitt 39). Ersetzt die
// Einzeldateien und die _pid-registry.js. Reine Datendatei: Änderungen hier
// direkt vornehmen (bzw. künftig über den Engine-Weg), keine Globale je PID mehr.
const ahbRulesByPrufId = {
 "44001": {
  "pruefidentifikator": "44001",
  "bezeichnung": "Anmeldung durch LF (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung (STS+Z17)."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [328] ∧ [583] Soll [333] ∧ [165] ∧ [2061] ∧ ([583] ∨ [584])",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVC",
    "name": "SG6 RFF+AVC: Kundennummer beim Lieferanten",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "RFF_Z01",
    "name": "SG6 RFF+Z01: Kundennummer beim Altlieferant",
    "status": "Soll",
    "ahbExpr": "Soll [165]",
    "rule": "AHB: Soll [165]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44002": {
  "pruefidentifikator": "44002",
  "bezeichnung": "Anmeldung – Bestätigung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung (STS+Z17)."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [527]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18] Soll [28] ∧ [29]",
    "rule": "AHB: Muss [18] Soll [28] ∧ [29]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28] ∧ [64]",
    "rule": "AHB: Muss [28] ∧ [64]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
    "status": "Muss",
    "rule": "AHB: Muss"
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
    "ahbExpr": "Muss [230]",
    "rule": "AHB: Muss [230]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Muss",
    "ahbExpr": "Codes: Z22 [504]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_AVC",
    "name": "SG6 RFF+AVC: Kundennummer beim Lieferanten",
    "status": "Soll",
    "ahbExpr": "Soll [147]",
    "rule": "AHB: Soll [147]"
   }
  ]
 },
 "44003": {
  "pruefidentifikator": "44003",
  "bezeichnung": "Anmeldung – Ablehnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583] ∧ [362]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
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
    "ahbExpr": "Muss [36]",
    "rule": "AHB: Muss [36]"
   },
   {
    "id": "DTM_Z08",
    "name": "SG4 DTM+Z08: Datum für nächste Bearbeitung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [36]",
    "rule": "AHB: Muss [36]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44004": {
  "pruefidentifikator": "44004",
  "bezeichnung": "Abmeldung durch LF (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "ahbExpr": "Muss [11]"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "AHB: Muss [7] ∧ [577]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: Z41 [510], ZZD [511]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44005": {
  "pruefidentifikator": "44005",
  "bezeichnung": "Abmeldung – Bestätigung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "ahbExpr": "Muss [11]"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [7] ∧ [577]",
    "rule": "AHB: Muss [7] ∧ [577]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [29]",
    "rule": "AHB: Soll [29]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: ZZD [511]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44006": {
  "pruefidentifikator": "44006",
  "bezeichnung": "Abmeldung – Ablehnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: ZZD [511]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44007": {
  "pruefidentifikator": "44007",
  "bezeichnung": "Abmeldung durch NB an LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [29]",
    "rule": "AHB: Soll [29]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44008": {
  "pruefidentifikator": "44008",
  "bezeichnung": "Abmeldung NB – Bestätigung (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [33]",
    "rule": "AHB: Soll [33]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44009": {
  "pruefidentifikator": "44009",
  "bezeichnung": "Abmeldung NB – Ablehnung (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44010": {
  "pruefidentifikator": "44010",
  "bezeichnung": "Abmeldeanfrage (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061] ∧ [644]",
    "rule": "AHB: Muss [2061] ∧ [644]"
   }
  ]
 },
 "44011": {
  "pruefidentifikator": "44011",
  "bezeichnung": "Abmeldeanfrage – Bestätigung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44012": {
  "pruefidentifikator": "44012",
  "bezeichnung": "Abmeldeanfrage – Ablehnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
      "v": "ZD2",
      "t": "ZD2 - Lieferbeginn und Abmeldung aus der Ersatzversorgung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44013": {
  "pruefidentifikator": "44013",
  "bezeichnung": "Anmeldung Grund-/Ersatzversorgung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung (STS+Z17)."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [527]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18] Soll [28] ∧ [29]",
    "rule": "AHB: Muss [18] Soll [28] ∧ [29]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28] ∧ [64]",
    "rule": "AHB: Muss [28] ∧ [64]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: E06 [502], ZZD [505]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Muss"
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
    "ahbExpr": "Muss [230]",
    "rule": "AHB: Muss [230]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Muss",
    "ahbExpr": "Codes: Z22 [504]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44014": {
  "pruefidentifikator": "44014",
  "bezeichnung": "Grund-/Ersatzversorgung – Bestätigung (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum (bei befristeter Anmeldung)",
    "status": "Bedingt",
    "ahbExpr": "Muss [10]",
    "rule": "[10] Muss bei befristeter Anmeldung (STS+Z17)."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [527]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18] Soll [28] ∧ [29]",
    "rule": "AHB: Muss [18] Soll [28] ∧ [29]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28] ∧ [64]",
    "rule": "AHB: Muss [28] ∧ [64]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: E06 [502], ZZD [505]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
    "status": "Muss",
    "rule": "AHB: Muss"
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
    "ahbExpr": "Muss [230]",
    "rule": "AHB: Muss [230]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Muss",
    "ahbExpr": "Codes: Z22 [504]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44015": {
  "pruefidentifikator": "44015",
  "bezeichnung": "Grund-/Ersatzversorgung – Ablehnung (LF an NB)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061] · Codes: E06 [502], ZZD [505]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44016": {
  "pruefidentifikator": "44016",
  "bezeichnung": "Kündigung zwischen Lieferanten (LFN an LFA)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Bedingt",
    "ahbExpr": "Muss [12]",
    "rule": "Entweder DTM+93 oder DTM+471 (nächstmöglicher Termin)."
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum nächstmöglichen Termin",
    "status": "Bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "[13] i. V. m. Antwortstatus; Entweder DTM+93 oder DTM+471."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [328] ∧ [583] Soll [333] ∧ [165] ∧ [2061] ∧ ([583] ∨ [584])",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z01",
    "name": "SG6 RFF+Z01: Kundennummer beim Altlieferant",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44017": {
  "pruefidentifikator": "44017",
  "bezeichnung": "Kündigung – Bestätigung (LFA an LFN)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Bedingt",
    "ahbExpr": "Muss [12] ∧ [13]",
    "rule": "Entweder DTM+93 oder DTM+471 (nächstmöglicher Termin)."
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum nächstmöglichen Termin",
    "status": "Bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "[13] i. V. m. Antwortstatus; Entweder DTM+93 oder DTM+471."
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z01",
    "name": "SG6 RFF+Z01: Kundennummer beim Altlieferant",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44018": {
  "pruefidentifikator": "44018",
  "bezeichnung": "Kündigung – Ablehnung (LFA an LFN)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [361] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "DTM_Z05",
    "name": "SG4 DTM+Z05: Datum des bereits bestätigten Vertragsendes",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [15] Soll [17] ∧ [16]",
    "rule": "AHB: Muss [15] Soll [17] ∧ [16]"
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
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E03",
      "t": "E03 - Wechsel"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44019": {
  "pruefidentifikator": "44019",
  "bezeichnung": "Bestandsliste zugeordnete",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [14]",
    "rule": "AHB: Soll [14]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18] Soll [28] ∧ [29]",
    "rule": "AHB: Muss [18] Soll [28] ∧ [29]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28] ∧ [64]",
    "rule": "AHB: Muss [28] ∧ [64]"
   }
  ]
 },
 "44020": {
  "pruefidentifikator": "44020",
  "bezeichnung": "Änderungsmeldung zur Bestandsliste",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZD0",
      "t": "ZD0 - Fehlerkorrektur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44021": {
  "pruefidentifikator": "44021",
  "bezeichnung": "Antwort auf Änderungsmeldung zur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
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
    "ahbExpr": "Soll [336]",
    "rule": "AHB: Soll [336]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [336]",
    "rule": "AHB: Soll [336]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Soll",
    "ahbExpr": "Soll [336]",
    "rule": "AHB: Soll [336]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [336]",
    "rule": "AHB: Soll [336]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZD0",
      "t": "ZD0 - Fehlerkorrektur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44022": {
  "pruefidentifikator": "44022",
  "bezeichnung": "Anfrage nach Stornierung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 je Ursprungsprozess)",
    "status": "Muss-bedingt",
    "bedingungen": [
     "500"
    ],
    "rule": "Muss [500]"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "SG2 NAD+MS: MP-ID Absender (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "SG2 NAD+MR: MP-ID Empfänger (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort",
    "status": "Muss-bedingt",
    "bedingungen": [
     "249"
    ],
    "rule": "Muss [249]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "RFF_Z13",
    "name": "SG6 RFF+Z13: Prüfidentifikator (44022)",
    "status": "Muss"
   },
   {
    "id": "RFF_ACW",
    "name": "SG6 RFF+ACW: Referenznummer der vorangegangenen Nachricht",
    "status": "Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44023": {
  "pruefidentifikator": "44023",
  "bezeichnung": "Bestätigung Anfrage Stornierung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 je Ursprungsprozess)",
    "status": "Muss-bedingt",
    "bedingungen": [
     "500"
    ],
    "rule": "Muss [500]"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "SG2 NAD+MS: MP-ID Absender (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "SG2 NAD+MR: MP-ID Empfänger (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort",
    "status": "Muss-bedingt",
    "bedingungen": [
     "249"
    ],
    "rule": "Muss [249]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "RFF_Z13",
    "name": "SG6 RFF+Z13: Prüfidentifikator (44023)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Transaktions-Referenznummer (zu stornierender Vorgang)",
    "status": "Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44024": {
  "pruefidentifikator": "44024",
  "bezeichnung": "Ablehnung Anfrage Stornierung",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (E01/E02/E35 je Ursprungsprozess)",
    "status": "Muss-bedingt",
    "bedingungen": [
     "500"
    ],
    "rule": "Muss [500]"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "SG2 NAD+MS: MP-ID Absender (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "SG2 NAD+MR: MP-ID Empfänger (Qualifikator 9/332)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort",
    "status": "Muss-bedingt",
    "bedingungen": [
     "249"
    ],
    "rule": "Muss [249]"
   },
   {
    "id": "FTX",
    "name": "SG4 FTX+ACB: Bemerkung (Hinweistext)",
    "status": "Kann"
   },
   {
    "id": "RFF_Z13",
    "name": "SG6 RFF+Z13: Prüfidentifikator (44024)",
    "status": "Muss"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Transaktions-Referenznummer (zu stornierender Vorgang)",
    "status": "Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "E05",
      "t": "E05 - Stornierung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44035": {
  "pruefidentifikator": "44035",
  "bezeichnung": "Antwort auf die Geschäftsdatenanfrage (durch LF)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (Z14 Geschäftsdaten)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [527]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z40",
      "t": "Z40 - Geschäftsdatenanfrage"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Muss",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Muss",
    "ahbExpr": "Codes: Z22 [504]",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
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
 "44036": {
  "pruefidentifikator": "44036",
  "bezeichnung": "Informationsmeldung bestehende Zuordnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z26",
      "t": "Z26 - Information über existierende Zuordnung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44037": {
  "pruefidentifikator": "44037",
  "bezeichnung": "Informationsmeldung Beendigung Zuordnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Termin der Zuordnung/Beendigung",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [29]",
    "rule": "AHB: Soll [29]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZC8",
      "t": "ZC8 - Beendigung der Zuordnung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44038": {
  "pruefidentifikator": "44038",
  "bezeichnung": "Informationsmeldung Aufhebung Zuordnung (NB an LF)",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokations-ID/Zählpunkt)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [2061] ∧ [583]",
    "bedingungen": [
     "2061",
     "2284",
     "138"
    ],
    "rule": "Meldepunkt (Marktlokation) je Vorgang genau einmal; [138] Entweder-Oder LOC+172."
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [507]",
    "rule": "AHB: Muss [507]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Soll",
    "ahbExpr": "Soll [29]",
    "rule": "AHB: Soll [29]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZH1",
      "t": "ZH1 - Aufhebung einer zukünftigen Zuordnung wegen Stilllegung"
     },
     {
      "v": "ZG9",
      "t": "ZG9 - Aufhebung einer zukünftigen Zuordnung wegen Auszug des Kunden"
     },
     {
      "v": "ZH0",
      "t": "ZH0 - Aufhebung einer zukünftigen Zuordnung wegen Anmeldung eines anderen Lieferanten zu einem früheren Termin"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44039": {
  "pruefidentifikator": "44039",
  "bezeichnung": "Kündigung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [77] ∧ [2061] ∧ [584]"
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
    "name": "SG4 DTM+471: Ende zum (nächstmöglichem Termin)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "AHB: Muss [18]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44040": {
  "pruefidentifikator": "44040",
  "bezeichnung": "Bestätigung Kündigung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
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
    "ahbExpr": "Muss [12] ∧ [13]",
    "rule": "AHB: Muss [12] ∧ [13]"
   },
   {
    "id": "DTM_471",
    "name": "SG4 DTM+471: Ende zum (nächstmöglichem Termin)",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [18]",
    "rule": "AHB: Muss [18]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44041": {
  "pruefidentifikator": "44041",
  "bezeichnung": "Ablehnung Kündigung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
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
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44042": {
  "pruefidentifikator": "44042",
  "bezeichnung": "Anmeldung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [77] ∧ [78] ∧ [2061] ∧ [584]"
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
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44043": {
  "pruefidentifikator": "44043",
  "bezeichnung": "Bestätigung Anmeldung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44044": {
  "pruefidentifikator": "44044",
  "bezeichnung": "Ablehnung Anmeldung MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44051": {
  "pruefidentifikator": "44051",
  "bezeichnung": "Ende MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
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
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44052": {
  "pruefidentifikator": "44052",
  "bezeichnung": "Bestätigung Ende MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
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
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44053": {
  "pruefidentifikator": "44053",
  "bezeichnung": "Ablehnung Ende MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44060": {
  "pruefidentifikator": "44060",
  "bezeichnung": "Antwort auf die Geschäftsdatenanfrage (durch MSB)",
  "segments": [
   {
    "id": "UNH",
    "name": "UNH: Nachrichten-Kopfsegment",
    "status": "Muss"
   },
   {
    "id": "BGM",
    "name": "BGM: Beginn der Nachricht (Z14 Geschäftsdaten)",
    "status": "Muss"
   },
   {
    "id": "DTM_137",
    "name": "DTM+137: Dokumenten-/Nachrichtendatum",
    "status": "Muss"
   },
   {
    "id": "NAD_MS",
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z40",
      "t": "Z40 - Geschäftsdatenanfrage"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_AAV",
    "name": "SG6 RFF+AAV: Referenz auf eine vorangegangene Anfrage",
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
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44101": {
  "pruefidentifikator": "44101",
  "bezeichnung": "Stammdaten zur Messlokation",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [508]",
    "rule": "AHB: Muss [508]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [14]",
    "rule": "AHB: Soll [14]"
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
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE5",
      "t": "ZE5 - Initialmeldung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44102": {
  "pruefidentifikator": "44102",
  "bezeichnung": "Aktualisierte Stammdaten zur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9] ∧ [508]",
    "rule": "AHB: Muss [9] ∧ [508]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [9] ∧ [14]",
    "rule": "AHB: Soll [9] ∧ [14]"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9]",
    "rule": "AHB: Muss [9]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z15",
      "t": "Z15 - Zusätzlicher Datensatz"
     },
     {
      "v": "ZE3",
      "t": "ZE3 - Stammdatenänderung"
     },
     {
      "v": "ZE4",
      "t": "ZE4 - Weggefallene Markt- bzw. Messlokation"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44103": {
  "pruefidentifikator": "44103",
  "bezeichnung": "Stammdaten zur verbrauchenden",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [508]",
    "rule": "AHB: Muss [508]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [14]",
    "rule": "AHB: Soll [14]"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
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
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [28] ∧ [64]",
    "rule": "AHB: Muss [28] ∧ [64]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE5",
      "t": "ZE5 - Initialmeldung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44104": {
  "pruefidentifikator": "44104",
  "bezeichnung": "Aktualisierte Stammdaten zur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9] ∧ [508]",
    "rule": "AHB: Muss [9] ∧ [508]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Soll",
    "ahbExpr": "Soll [9] ∧ [14]",
    "rule": "AHB: Soll [9] ∧ [14]"
   },
   {
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9]",
    "rule": "AHB: Muss [9]"
   },
   {
    "id": "DTM_158",
    "name": "SG4 DTM+158: Bilanzierungsbeginn",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9]",
    "rule": "AHB: Muss [9]"
   },
   {
    "id": "DTM_159",
    "name": "SG4 DTM+159: Bilanzierungsende",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [9] ∧ [28] ∧ [64]",
    "rule": "AHB: Muss [9] ∧ [28] ∧ [64]"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z15",
      "t": "Z15 - Zusätzlicher Datensatz"
     },
     {
      "v": "ZE3",
      "t": "ZE3 - Stammdatenänderung"
     },
     {
      "v": "ZE4",
      "t": "ZE4 - Weggefallene Markt- bzw. Messlokation"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44105": {
  "pruefidentifikator": "44105",
  "bezeichnung": "Ablehnung auf Stammdaten zur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [583]"
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
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z15",
      "t": "Z15 - Zusätzlicher Datensatz"
     },
     {
      "v": "ZE3",
      "t": "ZE3 - Stammdatenänderung"
     },
     {
      "v": "ZE4",
      "t": "ZE4 - Weggefallene Markt- bzw. Messlokation"
     },
     {
      "v": "ZE5",
      "t": "ZE5 - Initialmeldung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44109": {
  "pruefidentifikator": "44109",
  "bezeichnung": "Nicht bila.rel Änderung vom LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE6",
      "t": "ZE6 - Nicht bila.rel. Änderung vom LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [92] · Muss [636]",
    "rule": "AHB: Soll [92]"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
    "status": "Soll",
    "ahbExpr": "Soll [92]",
    "rule": "AHB: Soll [92]"
   },
   {
    "id": "RFF_AVC",
    "name": "SG6 RFF+AVC: Kundennummer beim Lieferanten",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44111": {
  "pruefidentifikator": "44111",
  "bezeichnung": "Antwort auf Änderung vom LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE6",
      "t": "ZE6 - Nicht bila.rel. Änderung vom LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44112": {
  "pruefidentifikator": "44112",
  "bezeichnung": "Nicht bila.rel. Änderung vom NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss ([32] ∧ [2061] ∧ [651]) ⊻ ([200] ∧ [601])"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE7",
      "t": "ZE7 - Nicht bila.rel. Änderung vom NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [25] ∧ [92] · Muss [636]",
    "rule": "AHB: Soll [25] ∧ [92]"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Soll",
    "ahbExpr": "Soll [92]",
    "rule": "AHB: Soll [92]"
   },
   {
    "id": "DTM_Z09",
    "name": "SG4 DTM+Z09: Nächste Netznutzungsabrechnung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [24] ∧ [230]",
    "rule": "AHB: Muss [24] ∧ [230]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Soll",
    "ahbExpr": "Soll [92] · Codes: Z22 [504]",
    "rule": "AHB: Soll [92]"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
 "44113": {
  "pruefidentifikator": "44113",
  "bezeichnung": "Nicht bila.rel. Änderung vom NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE7",
      "t": "ZE7 - Nicht bila.rel. Änderung vom NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Soll",
    "ahbExpr": "Soll [92]",
    "rule": "AHB: Soll [92]"
   }
  ]
 },
 "44115": {
  "pruefidentifikator": "44115",
  "bezeichnung": "Antwort auf Änderung vom NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE7",
      "t": "ZE7 - Nicht bila.rel. Änderung vom NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44116": {
  "pruefidentifikator": "44116",
  "bezeichnung": "Gas Prüf-ID 44116",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE8",
      "t": "ZE8 - Änderung vom MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44117": {
  "pruefidentifikator": "44117",
  "bezeichnung": "Gas Prüf-ID 44117",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE8",
      "t": "ZE8 - Änderung vom MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44119": {
  "pruefidentifikator": "44119",
  "bezeichnung": "Antwort auf Änderung vom MSB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE8",
      "t": "ZE8 - Änderung vom MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44120": {
  "pruefidentifikator": "44120",
  "bezeichnung": "Bila.rel. Änderung vom LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE9",
      "t": "ZE9 - Bila.rel. Änderung vom LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44121": {
  "pruefidentifikator": "44121",
  "bezeichnung": "Antwort auf Änderung vom LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZE9",
      "t": "ZE9 - Bila.rel. Änderung vom LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44123": {
  "pruefidentifikator": "44123",
  "bezeichnung": "Bila.rel. Änderung vom NB mit",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF0",
      "t": "ZF0 - Bila.rel. Änderung vom NB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44124": {
  "pruefidentifikator": "44124",
  "bezeichnung": "Antwort auf Änderung vom NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF0",
      "t": "ZF0 - Bila.rel. Änderung vom NB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44137": {
  "pruefidentifikator": "44137",
  "bezeichnung": "Nicht bila. rel. Anfrage an LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF3",
      "t": "ZF3 - Nicht bila.rel. Anfrage an LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Kann",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
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
 "44138": {
  "pruefidentifikator": "44138",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF3",
      "t": "ZF3 - Nicht bila.rel. Anfrage an LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [202] ∧ [336] · Muss [636]",
    "rule": "AHB: Soll [202] ∧ [336]"
   },
   {
    "id": "DTM_Z20",
    "name": "SG4 DTM+Z20: Abrechnungsintervall des LF",
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
 "44139": {
  "pruefidentifikator": "44139",
  "bezeichnung": "Nicht bila.rel. Anfrage an NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF4",
      "t": "ZF4 - Nicht bila.rel. Anfrage an NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Kann",
    "ahbExpr": "Muss [636]",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_Z09",
    "name": "SG4 DTM+Z09: Nächste Netznutzungsabrechnung",
    "status": "Kann",
    "rule": "AHB: Kann"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Kann",
    "ahbExpr": "Codes: Z22 [504]",
    "rule": "AHB: Kann"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
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
 "44140": {
  "pruefidentifikator": "44140",
  "bezeichnung": "Nicht bila.rel. Anfrage an NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF4",
      "t": "ZF4 - Nicht bila.rel. Anfrage an NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Kann",
    "rule": "AHB: Kann"
   }
  ]
 },
 "44142": {
  "pruefidentifikator": "44142",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF4",
      "t": "ZF4 - Nicht bila.rel. Anfrage an NB"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z18",
    "name": "SG6 RFF+Z18: Referenz auf die ID der Marktlokation für Termine der Marktlokation",
    "status": "Soll",
    "ahbExpr": "Soll [202] ∧ [336] · Muss [636]",
    "rule": "AHB: Soll [202] ∧ [336]"
   },
   {
    "id": "DTM_Z21",
    "name": "SG4 DTM+Z21: Termin der Netznutzungsabrechnung",
    "status": "Soll",
    "ahbExpr": "Soll [202] ∧ [336]",
    "rule": "AHB: Soll [202] ∧ [336]"
   },
   {
    "id": "DTM_Z09",
    "name": "SG4 DTM+Z09: Nächste Netznutzungsabrechnung",
    "status": "Muss-bedingt",
    "ahbExpr": "Muss [24] ∧ [230]",
    "rule": "AHB: Muss [24] ∧ [230]"
   },
   {
    "id": "DTM_Z22",
    "name": "SG4 DTM+Z22: Netznutzungsabrechnungsintervall des NB",
    "status": "Soll",
    "ahbExpr": "Soll [202] ∧ [336] · Codes: Z22 [504]",
    "rule": "AHB: Soll [202] ∧ [336]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID der Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Soll",
    "ahbExpr": "Soll [336] ∧ [202]",
    "rule": "AHB: Soll [336] ∧ [202]"
   },
   {
    "id": "RFF_Z10",
    "name": "SG6 RFF+Z10: Referenz auf die OBIS-Kennzahl der Marktlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44143": {
  "pruefidentifikator": "44143",
  "bezeichnung": "Anfrage an MSB mit Abhängigkeiten",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44145": {
  "pruefidentifikator": "44145",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44146": {
  "pruefidentifikator": "44146",
  "bezeichnung": "Ablehnung der Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44147": {
  "pruefidentifikator": "44147",
  "bezeichnung": "Anfrage an MSB mit Abhängigkeiten",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44148": {
  "pruefidentifikator": "44148",
  "bezeichnung": "Anfrage an MSB mit Abhängigkeiten",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44149": {
  "pruefidentifikator": "44149",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF5",
      "t": "ZF5 - Anfrage an MSB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44150": {
  "pruefidentifikator": "44150",
  "bezeichnung": "Bila. rel. Anfrage an LF",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF6",
      "t": "ZF6 - Bila.rel. Anfrage an LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44151": {
  "pruefidentifikator": "44151",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF6",
      "t": "ZF6 - Bila.rel. Anfrage an LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44152": {
  "pruefidentifikator": "44152",
  "bezeichnung": "Ablehnung der Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF6",
      "t": "ZF6 - Bila.rel. Anfrage an LF"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44156": {
  "pruefidentifikator": "44156",
  "bezeichnung": "Bila.rel. Anfrage an NB mit",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF8",
      "t": "ZF8 - Bila.rel. Anfrage an NB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44157": {
  "pruefidentifikator": "44157",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZF8",
      "t": "ZF8 - Bila.rel. Anfrage an NB mit Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44159": {
  "pruefidentifikator": "44159",
  "bezeichnung": "Änderung vom MSB ohne",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG7",
      "t": "ZG7 - Änderung vom MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44160": {
  "pruefidentifikator": "44160",
  "bezeichnung": "Änderung vom MSB ohne",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG7",
      "t": "ZG7 - Änderung vom MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44161": {
  "pruefidentifikator": "44161",
  "bezeichnung": "Antwort auf Änderung",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG7",
      "t": "ZG7 - Änderung vom MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44162": {
  "pruefidentifikator": "44162",
  "bezeichnung": "Anfrage an MSB ohne Abhängigkeiten",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44163": {
  "pruefidentifikator": "44163",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44164": {
  "pruefidentifikator": "44164",
  "bezeichnung": "Ablehnung Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44165": {
  "pruefidentifikator": "44165",
  "bezeichnung": "Nicht bila. rel Anfrage an MSB ohne",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44166": {
  "pruefidentifikator": "44166",
  "bezeichnung": "Nicht bila. rel Anfrage an MSB ohne",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_157",
    "name": "SG4 DTM+157: Änderung zum, Gültigkeit, Beginndatum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44167": {
  "pruefidentifikator": "44167",
  "bezeichnung": "Antwort auf Anfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZG8",
      "t": "ZG8 - Anfrage an MSB ohne Abhängigkeiten"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44168": {
  "pruefidentifikator": "44168",
  "bezeichnung": "Verpflichtungsanfrage / Aufforderung",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061]"
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
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44169": {
  "pruefidentifikator": "44169",
  "bezeichnung": "Bestätigung Verpflichtungsanfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
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
    "id": "DTM_76",
    "name": "SG4 DTM+76: Datum zum geplanten Leistungsbeginn",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   },
   {
    "id": "RFF_Z19",
    "name": "SG6 RFF+Z19: Referenz auf die ID einer Messlokation",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "DTM_752",
    "name": "SG4 DTM+752: Turnusablesung des NB",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "RFF_MG",
    "name": "SG6 RFF+MG: Referenz auf die Gerätenummer",
    "status": "Muss",
    "rule": "AHB: Muss"
   }
  ]
 },
 "44170": {
  "pruefidentifikator": "44170",
  "bezeichnung": "Ablehnung Verpflichtungsanfrage",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
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
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44175": {
  "pruefidentifikator": "44175",
  "bezeichnung": "Änderung der Marktlokationsstruktur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [590]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZI9",
      "t": "ZI9 - Änderung der komplexen Marktlokationsstruktur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44176": {
  "pruefidentifikator": "44176",
  "bezeichnung": "Antwort auf Änderung der",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [590]"
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZI9",
      "t": "ZI9 - Änderung der komplexen Marktlokationsstruktur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44180": {
  "pruefidentifikator": "44180",
  "bezeichnung": "Anfrage der Marktlokationsstruktur",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [590]"
   },
   {
    "id": "DTM_92",
    "name": "SG4 DTM+92: Beginn zum",
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZJ1",
      "t": "ZJ1 - Anfrage der komplexen Marktlokationsstruktur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44181": {
  "pruefidentifikator": "44181",
  "bezeichnung": "Antwort auf Anfrage der",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [590]"
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
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZJ1",
      "t": "ZJ1 - Anfrage der komplexen Marktlokationsstruktur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44182": {
  "pruefidentifikator": "44182",
  "bezeichnung": "Ablehnung der Anfrage der",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "STS_E01",
    "name": "SG4 STS+E01: Status der Antwort (Antwortcode + EBD)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [590]"
   },
   {
    "id": "RFF_TN",
    "name": "SG6 RFF+TN: Referenz Vorgangsnummer aus Anfragenachricht",
    "status": "Muss",
    "rule": "Zuordnung der Vorgangsnummer aus der Anfrage."
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "ZJ1",
      "t": "ZJ1 - Anfrage der komplexen Marktlokationsstruktur"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 },
 "44183": {
  "pruefidentifikator": "44183",
  "bezeichnung": "Ende MSB von NB",
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
    "name": "NAD+MS: MP-ID Absender (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "NAD_MR",
    "name": "NAD+MR: MP-ID Empfänger (Codevergabestelle 9/293)",
    "status": "Muss"
   },
   {
    "id": "IDE",
    "name": "SG4 IDE+24: Vorgangsnummer (Transaktion)",
    "status": "Muss"
   },
   {
    "id": "LOC_172",
    "name": "SG5 LOC+172: Meldepunkt (Marktlokation/Zählpunkt)",
    "status": "Muss",
    "ahbExpr": "Muss [2061] ∧ [584]"
   },
   {
    "id": "DTM_93",
    "name": "SG4 DTM+93: Ende zum",
    "status": "Muss",
    "rule": "AHB: Muss"
   },
   {
    "id": "STS_7_grund",
    "name": "SG4 STS+7: Transaktionsgrund",
    "status": "Muss-bedingt",
    "isSelect": true,
    "options": [
     {
      "v": "Z33",
      "t": "Z33 - Auszug wegen Stilllegung"
     }
    ],
    "ahbExpr": "Muss [2061]",
    "rule": "AHB: Muss [2061]"
   }
  ]
 }
};
if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;
