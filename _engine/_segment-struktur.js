// _segment-struktur.js
// Strukturprofile je Segment: erwartete Anordnung der Datenelemente und Composite-
// Komponenten. Damit lässt sich der korrekte Segmentaufbau prüfen - z. B. ob ein Wert
// im richtigen Datenelement steht und nicht durch ein fehlendes/zusätzliches Trennzeichen
// verrutscht ist ("CCI+Z65+++Z01" korrekt vs. "CCI+Z65++Z01" falsch).
//
// Prüfansatz (bewusst tolerant, um Fehlalarme zu vermeiden):
//   - Für Segmente mit fester Struktur wird geprüft, in welchen Element-/Komponenten-
//     Positionen ein Wert stehen MUSS bzw. NICHT stehen darf.
//   - "belegt": Positionen (1-basiert), die einen Wert tragen müssen.
//   - "leer":   Positionen, die leer sein müssen (im MIG "nicht benutzt" / Strukturlücke).
//   - Bei kontextabhängigen Segmenten (z. B. CCI je nach Klassentyp) werden mehrere
//     Varianten angeboten; die passende wird über einen "wenn"-Diskriminator gewählt.
//
// Positionsangaben beziehen sich auf:
//   element[n]      = n-tes Datenelement (durch '+' getrennt), element[0] ist der Tag
//   comps[n][k]     = k-te Komponente (durch ':' getrennt) im n-ten Element
//
// Quelle: UTILMD-Strom-MIG (S2.2). Nur gesicherte Strukturen aufnehmen.

const segmentStruktur = {

    // CCI: Aufbau hängt vom Klassentyp (Element 1) ab.
    //   CCI+Z66'            -> nur Element 1 (Produkteigenschaft)
    //   CCI+Z65+++Z01'      -> E1=Z65, E2 leer, E3 leer, E4=Relevanz (DE4051)
    //   CCI+++E13'          -> E1 leer, E2 leer, E3=Merkmal (C240/7037)
    CCI: {
        varianten: [
            {
                wenn: seg => (seg.elements[1] || "") === "Z65",
                name: "CCI+Z65 (Umsetzungsgradvorgabe)",
                // E1 belegt, E2 leer, E3 leer, E4 belegt (Relevanz-Code)
                belegt: [1, 4], leer: [2, 3],
                hinweis: "Erwartet: CCI+Z65+++<Relevanz>  (drei '+' vor dem Wert)"
            },
            {
                wenn: seg => (seg.elements[1] || "") === "Z66",
                name: "CCI+Z66 (Produkteigenschaft)",
                belegt: [1], leer: [2, 3],
                hinweis: "Erwartet: CCI+Z66  (nur ein Datenelement)"
            },
            {
                // Merkmal-Form: Klassentyp leer, Merkmal in Element 3 (C240)
                wenn: seg => !(seg.elements[1] || ""),
                name: "CCI+++<Merkmal> (Merkmalsbeschreibung)",
                belegt: [3], leer: [1, 2],
                hinweis: "Erwartet: CCI+++<Merkmal>  (Merkmal im dritten Datenelement)"
            }
        ]
    },

    // CAV: ein Composite C889 mit 7111:1131:3055:7110.
    //   CAV+ZH9:::9991000002107'  -> Komp.1=Code, Komp.2 leer, Komp.3 leer, Komp.4=Wert
    //   CAV+Z30'                  -> nur Komp.1 (reiner Code ohne Wert) ist ebenfalls zulässig
    CAV: {
        varianten: [
            {
                wenn: seg => ((seg.comps[1] || []).length > 1),
                name: "CAV mit Wert",
                // Komponenten im Element 1: 1 belegt, 2+3 leer, 4 belegt
                compBelegt: { 1: [1, 4] }, compLeer: { 1: [2, 3] },
                hinweis: "Erwartet: CAV+<Code>:::<Wert>  (drei ':' vor dem Wert)"
            },
            {
                wenn: seg => ((seg.comps[1] || []).length <= 1),
                name: "CAV nur Code",
                compBelegt: { 1: [1] }, compLeer: {},
                hinweis: "Erwartet: CAV+<Code>"
            }
        ]
    },

    // STS: STS+<9015 Kategorie>+<4405>+<C556>[+<C556>[+<C556>]]  - das C555 (Element 2)
    // ist bei UTILMD nicht belegt; die Gruppe C556 (9013:1131:3055:9012) wiederholt sich:
    //   STS+7++E01+ZW4+E03'          E3=Grund, E4=Ergänzung, E5=Ergänzung Lieferende
    //   STS+E01++A01:E_0004::2'      E3=Antwortcode:EBD-Nr.::Zeitraum-ID
    //   STS+Z35++A32:E_0624+ZW5:::20072281644'   E4=betroffene Lokation:::ID
    STS: {
        varianten: [
            {
                wenn: seg => (seg.elements[1] || "") === "7",
                name: "STS+7 (Transaktionsgrund)",
                belegt: [1, 3], leer: [2],
                hinweis: "Erwartet: STS+7++<Grund>[+<Ergänzung>[+<Ergänzung Lieferende>]]  (E2 bleibt leer)"
            },
            {
                wenn: seg => /^(E01|Z35)$/.test(seg.elements[1] || ""),
                name: "STS+E01/Z35 (Antwortstatus)",
                belegt: [1, 3], leer: [2],
                hinweis: "Erwartet: STS+<Kategorie>++<Antwortcode>:<EBD-Nr.>[::<Zeitraum-ID>]  (E2 bleibt leer)"
            }
        ]
    },

    // SEQ: SEQ+<1229 Handlung>+<C286: 1050 ID>  - Element 1 muss belegt sein.
    SEQ: {
        varianten: [
            {
                wenn: () => true,
                name: "SEQ",
                belegt: [1], leer: [],
                hinweis: "Erwartet: SEQ+<Handlung>[+<ID>]"
            }
        ]
    },

    // NAD (Marktpartner): NAD+<3035 Funktion>+<C082: 3039 MP-ID :: 3055 Stelle>
    //   NAD+MS+9900259000002::293'  -> E1=Funktion, E2 = Komp.1 ID, Komp.2 leer, Komp.3 Stelle
    NAD: {
        varianten: [
            {
                wenn: seg => /^(MS|MR)$/.test(seg.elements[1] || ""),
                name: "NAD Marktpartner",
                belegt: [1], leer: [],
                compBelegt: { 2: [1, 3] }, compLeer: { 2: [2] },
                hinweis: "Erwartet: NAD+<Rolle>+<MP-ID>::<Stelle>  (Komp.2 bleibt leer)"
            }
        ]
    },

    // PIA: PIA+<4347 Funktion>+<C212: 7140 Produkt-Code : 7143 Typ>
    //   PIA+5+9991000002008:Z11'  -> E1=Funktion, E2 = Komp.1 Code, Komp.2 Typ
    PIA: {
        varianten: [
            {
                wenn: () => true,
                name: "PIA",
                belegt: [1], leer: [],
                compBelegt: { 2: [1] },
                hinweis: "Erwartet: PIA+<Funktion>+<Produkt-Code>:<Typ>"
            }
        ]
    }
};

if (typeof module !== 'undefined') module.exports = segmentStruktur;
