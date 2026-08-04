// antwortcode-auswahl.js — Antwortcodes der Entscheidungsbaum-Diagramme (EBD)
// als Auswahlliste, gefiltert nach Cluster.
//
// Grundlage ist `_engine/daten/ebd-antwortcodes.js` (maschinell mit ebdamame aus der
// DOCX-Fassung des BDEW-Dokuments gelesen). Welche EBD für eine Prüf-ID gelten, sagt
// der AHB im STS+E01 DE1131; ob eine Bestätigung oder eine Ablehnung vorliegt, sagen
// die AHB-Bedingungen am Antwortcode:
//
//     [359] Es sind nur Antwortcodes aus dem Cluster Ablehnung erlaubt
//     [360] Es sind nur Antwortcodes aus dem Cluster Zustimmung erlaubt
//
// Diese Datei wird von der zentralen Formular-Engine (`ahb-form-engine.js`) und den
// kuratierten UTILMD-Masken (`utilmd-maske.js`) gemeinsam genutzt — die Codeauswahl ist
// damit an einer Stelle geregelt.
(function (global) {
    "use strict";

    function ebdDaten(stand) {
        const alle = global.ebdAntwortcodes || (typeof ebdAntwortcodes !== 'undefined' ? ebdAntwortcodes : {});
        const gewaehlt = stand || standAusPfad();
        if (gewaehlt && alle[gewaehlt]) return alle[gewaehlt].ebds || {};
        const erste = Object.values(alle)[0] || {};
        return erste.ebds || {};
    }

    function standAusPfad() {
        // Formatstand der Seite: Stand-Modul (Phase 3, ?stand=…), sonst Seitenpfad.
        if (global.EdiStand) return global.EdiStand.aktiv();
        const pfad = (global.location && global.location.pathname) || "";
        const m = /\b(20\d{4})\b/.exec(pfad);
        return m ? m[1] : "";
    }

    // Cluster aus den AHB-Bedingungen: Der Ausdruck am Datenelement nennt die
    // Bedingungsnummer, der Bedingungstext das Cluster.
    function clusterAusBedingungen(ausdruck, bedingungstext) {
        const nummern = String(ausdruck || "").match(/\[(\d{1,4})\]/g) || [];
        const text = String(bedingungstext || "");
        for (const n of nummern) {
            const re = new RegExp("\\" + n + "[^\\[]{0,120}?Cluster\\s+(Zustimmung|Ablehnung)", "i");
            const t = re.exec(text);
            if (t) return t[1][0].toUpperCase() + t[1].slice(1).toLowerCase();
        }
        return "";
    }

    // ---- Abhängigkeiten der Antwortcodes vom Geschäftsvorfall ---------------
    // Ein Entscheidungsbaum führt über Prüfschritte zu seinen Antwortcodes. Manche
    // dieser Schritte fragen nach etwas, das in der Nachricht selbst steht — dann ist
    // schon vor der Auswahl klar, welche Codes überhaupt erreichbar sind. Beispiel
    // E_0614 (Kündigung Vertrag prüfen):
    //
    //     Schritt 10: „Wurde im Geschäftsvorfall angegeben, dass es sich um eine
    //                  verbrauchende Marktlokation handelt?"
    //         ja   -> Schritt 20  (führt zu A01, A03 … A09)
    //         nein -> Schritt 500 (führt zu A10, A12, A17, A18)
    //
    // Wer im STS+7 die Ergänzung ZW4 („Verbrauchende Marktlokation") meldet, kann
    // A12/A17 also nicht erhalten. Die Wege je Code stehen in
    // `_engine/daten/ebd-pfade.js` (aus den EBD gelesen), die folgenden Muster
    // übersetzen die Fragen in Merkmale des Formulars.
    //
    // Grundsatz: Im Zweifel wird nicht gefiltert. Ausgewertet werden nur die Fragen
    // dieser Tabelle — sie stellen ausdrücklich fest, was im Geschäftsvorfall gemeldet
    // wurde, und lassen sich deshalb aus dem Formular beantworten. Alle übrigen Fragen
    // (Fristen, Vertragslage, Vollmacht, Systemstände des Empfängers) kann nur der
    // Absender beantworten; sie bleiben unbewertet, ihre Codes wählbar.
    //
    // Je Eintrag: `wahr` / `falsch` = Merkmalswerte, bei denen die Frage mit ja bzw.
    // nein zu beantworten ist. Werte, die in keiner der beiden Listen stehen, führen
    // bewusst zu „nicht bewertbar" — eine Tranche etwa kann verbrauchend oder
    // erzeugend sein, deshalb beantwortet sie die Frage nach der verbrauchenden
    // Marktlokation nicht.
    const FRAGEN = [
        { frage: "handelt es sich bei der marktlokation um eine verbrauchende marktlokation?",
          merkmal: "lokationsart", wahr: ["verbrauchend"], falsch: ["erzeugend"] },
        { frage: "wurde der anwendungsfall für eine verbrauchende marktlokation verwendet?",
          merkmal: "lokationsart", wahr: ["verbrauchend"], falsch: ["erzeugend"] },
        { frage: "wurde im geschäftsvorfall angegeben, dass es sich um eine verbrauchende marktlokation handelt?",
          merkmal: "lokationsart", wahr: ["verbrauchend"], falsch: ["erzeugend"] },
        { frage: "wurde der anwendungsfall für eine verbrauchende marktlokation oder ruhende marktlokation verwendet?",
          merkmal: "lokationsart", wahr: ["verbrauchend", "ruhend"], falsch: ["erzeugend"] },
        { frage: "wurde im geschäftsvorfall angegeben, dass es sich um eine verbrauchende marktlokation oder ruhende marktlokation handelt?",
          merkmal: "lokationsart", wahr: ["verbrauchend", "ruhend"], falsch: ["erzeugend"] },
        { frage: "handelt es sich um eine tranche?",
          merkmal: "lokationsart", wahr: ["tranche"], falsch: ["verbrauchend", "erzeugend", "ruhend"] },
        { frage: "handelt es sich um geschäftsvorfall 1?",
          merkmal: "geschaeftsvorfall", wahr: ["1"], falsch: ["2", "3"] },
        { frage: "handelt es sich um geschäftsvorfall 2?",
          merkmal: "geschaeftsvorfall", wahr: ["2"], falsch: ["1", "3"] },
        { frage: "handelt es sich um geschäftsvorfall 3?",
          merkmal: "geschaeftsvorfall", wahr: ["3"], falsch: ["1", "2"] },
        { frage: 'handelt es sich um eine marktlokation mit der messtechnischen einordnung "keine messung" (pauschale marktlokation)?',
          merkmal: "messtechnik", wahr: ["pauschal"], falsch: ["gemessen"] },
    ];

    // Fragen der EBD sind im Dokument teils getrennt („messtech-nischen") und mit
    // typografischen Anführungszeichen gesetzt — für den Vergleich normalisiert.
    function normFrage(text) {
        return String(text || "").toLowerCase()
            .replace(/[„“”‚‘’]/g, '"')
            .replace(/\s+/g, " ")
            .replace(/([a-zäöüß])-\s+([a-zäöüß])/g, "$1$2")
            .replace(/\s+([?.,;:])/g, "$1")
            .trim();
    }

    const FRAGE_INDEX = {};
    FRAGEN.forEach(f => { FRAGE_INDEX[normFrage(f.frage)] = f; });

    // Welche Antwort erwartet der aktuelle Geschäftsvorfall auf diese Frage?
    // Ergebnis: true / false / null (nicht bewertbar).
    function erwarteteAntwort(frage, kontext) {
        const eintrag = FRAGE_INDEX[normFrage(frage)];
        if (!eintrag) return null;
        const ist = kontext && kontext[eintrag.merkmal];
        if (!ist) return null;                           // Merkmal im Formular nicht bestimmt
        if (eintrag.wahr.indexOf(ist) >= 0) return true;
        if (eintrag.falsch.indexOf(ist) >= 0) return false;
        return null;                                     // Wert sagt zu dieser Frage nichts
    }

    // Ist der Code mit dem Geschäftsvorfall vereinbar? `bedingungen` enthält je Code
    // die Antworten, die auf JEDEM Weg des Entscheidungsbaums zu ihm gegeben werden.
    // Widerspricht eine davon dem Formular, ist der Code nicht erreichbar. Codes ohne
    // Bedingungen (mehrere Wege mit unterschiedlichen Antworten) bleiben wählbar.
    function codeErreichbar(eintrag, code, kontext) {
        const bed = eintrag && eintrag.bedingungen && eintrag.bedingungen[code];
        if (!bed || !bed.length || !eintrag.schritte) return true;
        return bed.every(([nr, antwort]) => {
            const erwartet = erwarteteAntwort(eintrag.schritte[nr], kontext);
            return erwartet === null || erwartet === !!antwort;
        });
    }

    // Begründung für einen ausgeblendeten Code (für den Hinweis im Formular).
    function grund(eintrag, code, kontext) {
        const bed = (eintrag && eintrag.bedingungen && eintrag.bedingungen[code]) || [];
        for (const [nr, antwort] of bed) {
            const frage = eintrag.schritte[nr];
            const erwartet = erwarteteAntwort(frage, kontext);
            if (erwartet !== null && erwartet !== !!antwort) return `Prüfschritt ${nr}: ${frage}`;
        }
        return "";
    }

    function pfadDaten(stand) {
        const alle = global.ebdPfade || (typeof ebdPfade !== 'undefined' ? ebdPfade : null);
        if (!alle) return null;
        const gewaehlt = stand || standAusPfad();
        return (gewaehlt && alle[gewaehlt]) || Object.values(alle)[0] || null;
    }

    // Auswahlliste zu einer Menge von EBD-Schlüsseln.
    //   schluessel  ["E_0614"] — die im AHB genannten EBD (DE1131)
    //   cluster     "Zustimmung" | "Ablehnung" | "" (keine Einschränkung)
    //   vorgabeCode bevorzugter Code (aus der Prozess-Meta), optional
    // Ergebnis: { optionen: [{v, t, ebd, code}], vorgabe, hinweis }
    //   kontext     Merkmale des Geschäftsvorfalls, z. B. { lokationsart: "verbrauchend" }
    function auswahl(schluessel, cluster, vorgabeCode, stand, kontext) {
        const leer = { optionen: [], vorgabe: "", hinweis: "" };
        const daten = ebdDaten(stand);
        const pfade = pfadDaten(stand);
        const keys = (schluessel || []).filter(Boolean);
        if (!keys.length || !Object.keys(daten).length) return leer;

        const optionen = [];
        let ausserhalb = 0, unerreichbar = 0, beispiel = "";
        keys.forEach(k => {
            // Verweis-EBD auflösen („Es ist das EBD E_0527 zu nutzen.")
            let e = daten[k], gefolgt = k, tiefe = 0;
            while (e && e.verweistAuf && tiefe++ < 3) { gefolgt = e.verweistAuf; e = daten[gefolgt]; }
            if (!e) return;
            const baum = pfade ? pfade[gefolgt] : null;
            Object.keys(e.codes).sort().forEach(code => {
                const c = e.codes[code];
                if (cluster && c.cluster && c.cluster !== cluster) { ausserhalb++; return; }
                const text = (c.text || c.cluster || "").replace(/\s+/g, " ").trim();
                // Prüfschritte des Entscheidungsbaums: Codes, die der Baum bei diesem
                // Geschäftsvorfall nicht erreichen kann, gehören nicht zur Auswahl.
                const erreichbar = !baum || codeErreichbar(baum, code, kontext);
                if (!erreichbar) {
                    unerreichbar++;
                    if (!beispiel) beispiel = grund(baum, code, kontext);
                }
                optionen.push({
                    v: `${code}:${gefolgt}`, code: code, ebd: gefolgt, erreichbar: erreichbar,
                    t: `${code} – ${text.slice(0, 90) || cluster || "ohne Hinweis"}`
                       + (keys.length > 1 ? ` (${gefolgt})` : ""),
                });
            });
        });
        if (!optionen.length) return leer;
        // Der Filter darf die Auswahl nicht leerräumen: Bliebe nichts übrig, ist die
        // Zuordnung offenbar nicht eindeutig — dann bleiben alle Codes wählbar.
        const erreichbare = optionen.filter(o => o.erreichbar);
        let filterHinweis = "";
        if (unerreichbar && erreichbare.length) {
            optionen.length = 0;
            erreichbare.forEach(o => optionen.push(o));
            filterHinweis = ` · ${unerreichbar} Code(s) im Entscheidungsbaum für diesen `
                          + `Geschäftsvorfall nicht erreichbar${beispiel ? " — " + beispiel : ""}`;
        } else if (unerreichbar) {
            filterHinweis = " · Prüfschritte des Entscheidungsbaums nicht eindeutig — alle Codes wählbar";
        }
        // „A**" steht im EBD für „alle festgestellten Antworten" und taugt nicht als
        // Vorgabe; es bleibt wählbar, rutscht aber ans Ende der Liste.
        optionen.sort((a, b) => (a.code === "A**" ? 1 : 0) - (b.code === "A**" ? 1 : 0));
        const vorgabe = optionen.find(o => o.code === vorgabeCode)
                     || optionen.find(o => o.code !== "A**") || optionen[0];
        const hinweis = `Antwortcodes aus ${keys.join(", ")}`
            + (cluster ? `, Cluster ${cluster}` : "")
            + (ausserhalb ? ` (${ausserhalb} Code(s) des anderen Clusters ausgeblendet)` : "")
            + filterHinweis;
        return { optionen: optionen, vorgabe: vorgabe.v, hinweis: hinweis };
    }

    const api = { ebdDaten, auswahl, clusterAusBedingungen, standAusPfad, codeErreichbar, erwarteteAntwort };
    global.EdiAntwortcodes = api;
    // Auch am echten globalen Objekt hinterlegen: In der Testumgebung (VM-Sandbox des
    // Harness) ist `window` ein eigenes Objekt, und Skripte sehen dort nur, was im
    // globalen Scope steht.
    if (typeof globalThis !== 'undefined' && globalThis !== global) globalThis.EdiAntwortcodes = api;
    if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
