// _produktpaket.js
// Produktpaket-Block (SG8 SEQ+Z79 / PIA / SG10 CCI/CAV, SG8 SEQ+ZH0, SG10 CCI+Z65)
// für die Anmeldung verbrauchende MaLo (PID 55001), AHB Strom Kap. 8.2.
//
// Segmentkette laut MIG (Beispiele):
//   SEQ+Z79+1'                       Bestandteil eines Produktpakets (DE1050 = Produktpaket-ID)
//   PIA+5+9991000002008:Z11'         Erforderliches Produkt (Produkt-Code + Z11)
//   CCI+Z66'                         Produkteigenschaft
//   CAV+ZH9:::9991000002107'         Code der Produkteigenschaft (im 4. Composite-Element)
//   CAV+ZV4:::4000'                  Wertedetails zum Produkt (freier Merkmalswert)
//   SEQ+ZH0+1'                       Priorisierung erforderliches Produktpaket (Referenz auf Paket-ID)
//   CCI+Z65+++Z01'                   Umsetzungsgradvorgabe (Z01 vollumfänglich / Z02 in Teilen)
//
// Datenmodell im Speicher (kein Browser-Storage): Array von Produktpaketen, jedes mit
// Paket-ID, Umsetzungsgrad und einer Liste erforderlicher Produkte (Code + Eigenschaft + Wert).

// Laufzeit-Zustand (nur im Arbeitsspeicher, wird bei jedem renderForm neu initialisiert
// falls noch nicht vorhanden).
let produktpaketState = null;

function initProduktpaketState() {
    produktpaketState = {
        pakete: [
            {
                paketId: "1",
                umsetzungsgrad: "Z01", // Z01 = vollumfänglich, Z02 = in Teilen
                produkte: [
                    // Vorbelegung: ein sinnvolles Pflichtprodukt (Bilanzkreis hat keine
                    // Eigenschaft, daher als Beispiel die Messtechnische Einordnung mit iMS).
                    { code: "9991000002008", eigenschaft: "", wert: "" }
                ]
            }
        ]
    };
}

// Liefert das Produktobjekt aus der Codeliste (produkte55001) zu einem Code.
function findeProdukt(code) {
    if (typeof produkte55001 === 'undefined') return null;
    return produkte55001.find(p => p.code === code) || null;
}

// Baut die UI für den Produktpaket-Block in den übergebenen Container.
function renderProduktpaket(container) {
    if (!produktpaketState) initProduktpaketState();
    if (typeof produkte55001 === 'undefined') {
        container.innerHTML = '<div class="hint">Produkt-Codeliste (_produkte-55001.js) nicht geladen.</div>';
        return;
    }

    let html = '<div class="produktpaket-block">';
    html += '<h3 style="margin:12px 0 6px; font-size:14px;">Produktpakete (SG8/SG10)</h3>';
    html += '<div class="hint" style="margin-bottom:8px;">Erforderliche Produkte je Produktpaket. '
          + 'Produkt-Codes und Eigenschaften stammen aus der Codeliste der Konfigurationen '
          + '(Kap. 6.1, nur für 55001 zulässige Codes).</div>';

    produktpaketState.pakete.forEach((paket, pi) => {
        html += `<div class="paket-card" style="border:1px solid var(--border,#ccc); border-radius:8px; padding:10px; margin-bottom:10px;">`;
        html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">`;
        html += `<b>Produktpaket ${pi + 1}</b>`;
        html += `<button type="button" onclick="entferneP aket(${pi})" style="font-size:12px;">Paket entfernen</button>`.replace('entferneP aket', 'entfernePaket');
        html += `</div>`;

        // Paket-ID (positive Ganzzahl)
        html += `<label style="font-size:12px;">Produktpaket-ID (> 0, ganzzahlig)</label>`;
        html += `<input type="number" min="1" step="1" value="${paket.paketId}" `
              + `onchange="setPaketId(${pi}, this.value)" style="margin-bottom:6px;">`;

        // Umsetzungsgrad (SG10 CCI+Z65)
        html += `<label style="font-size:12px;">Umsetzungsgradvorgabe (CCI+Z65)</label>`;
        html += `<select onchange="setUmsetzungsgrad(${pi}, this.value)" style="margin-bottom:6px;">`;
        html += `<option value="Z01"${paket.umsetzungsgrad === 'Z01' ? ' selected' : ''}>Z01 - vollumfänglich umzusetzen</option>`;
        html += `<option value="Z02"${paket.umsetzungsgrad === 'Z02' ? ' selected' : ''}>Z02 - kann in Teilen umgesetzt werden</option>`;
        html += `</select>`;

        // Produkte
        html += `<div style="margin-top:6px;"><b style="font-size:12px;">Erforderliche Produkte</b></div>`;
        paket.produkte.forEach((prod, xi) => {
            const pdef = findeProdukt(prod.code);
            html += `<div class="prod-row" style="border-top:1px dashed var(--border,#ddd); padding:6px 0;">`;
            // Produkt-Code-Auswahl
            html += `<label style="font-size:12px;">Produkt-Code (PIA+5)</label>`;
            html += `<select onchange="setProduktCode(${pi}, ${xi}, this.value)">`;
            produkte55001.forEach(p => {
                html += `<option value="${p.code}"${p.code === prod.code ? ' selected' : ''}>`
                      + `${p.code} - ${p.name}</option>`;
            });
            html += `</select>`;

            // Eigenschaft (CAV+ZH9) - nur wenn das Produkt Eigenschaften hat
            if (pdef && pdef.eigenschaften && pdef.eigenschaften.length > 0) {
                html += `<label style="font-size:12px;">Produkteigenschaft (CAV+ZH9)</label>`;
                html += `<select onchange="setProduktEigenschaft(${pi}, ${xi}, this.value)">`;
                pdef.eigenschaften.forEach(e => {
                    html += `<option value="${e.code}"${e.code === prod.eigenschaft ? ' selected' : ''}>`
                          + `${e.code} - ${e.label}</option>`;
                });
                html += `</select>`;
            }

            // Wertedetail (CAV+ZV4) - nur wenn das Produkt einen freien Wert erwartet
            if (pdef && pdef.wertdetail) {
                html += `<label style="font-size:12px;">Wertedetail (CAV+ZV4): ${pdef.wertdetail}</label>`;
                html += `<input type="text" value="${prod.wert || ''}" `
                      + `oninput="setProduktWert(${pi}, ${xi}, this.value)" placeholder="Merkmalswert...">`;
            }

            html += `<button type="button" onclick="entferneProdukt(${pi}, ${xi})" style="font-size:12px; margin-top:4px;">Produkt entfernen</button>`;
            html += `</div>`;
        });
        html += `<button type="button" onclick="fuegeProduktHinzu(${pi})" style="font-size:12px; margin-top:6px;">+ Produkt hinzufügen</button>`;
        html += `</div>`; // paket-card
    });

    html += `<button type="button" onclick="fuegePaketHinzu()" style="font-size:13px;">+ Produktpaket hinzufügen</button>`;
    html += '</div>';
    container.innerHTML = html;
}

// --- Zustandsänderungen (lösen jeweils Neu-Rendern + Neu-Generieren aus) ---
function setPaketId(pi, v)            { produktpaketState.pakete[pi].paketId = v; regenProduktpaket(); }
function setUmsetzungsgrad(pi, v)     { produktpaketState.pakete[pi].umsetzungsgrad = v; regenProduktpaket(); }
function setProduktCode(pi, xi, v)    {
    const prod = produktpaketState.pakete[pi].produkte[xi];
    prod.code = v; prod.eigenschaft = ""; prod.wert = "";  // Eigenschaft/Wert zurücksetzen
    const pdef = findeProdukt(v);
    if (pdef && pdef.eigenschaften && pdef.eigenschaften.length > 0) prod.eigenschaft = pdef.eigenschaften[0].code;
    regenProduktpaket(true);  // Struktur ändert sich -> UI neu bauen
}
function setProduktEigenschaft(pi, xi, v){ produktpaketState.pakete[pi].produkte[xi].eigenschaft = v; regenProduktpaket(); }
function setProduktWert(pi, xi, v)    { produktpaketState.pakete[pi].produkte[xi].wert = v; regenProduktpaket(); }
function fuegeProduktHinzu(pi)        {
    produktpaketState.pakete[pi].produkte.push({ code: produkte55001[0].code, eigenschaft: (produkte55001[0].eigenschaften[0]||{}).code||"", wert: "" });
    regenProduktpaket(true);
}
function entferneProdukt(pi, xi)      { produktpaketState.pakete[pi].produkte.splice(xi, 1); regenProduktpaket(true); }
function fuegePaketHinzu()            {
    const neueId = String(produktpaketState.pakete.length + 1);
    produktpaketState.pakete.push({ paketId: neueId, umsetzungsgrad: "Z01", produkte: [{ code: produkte55001[0].code, eigenschaft: (produkte55001[0].eigenschaften[0]||{}).code||"", wert: "" }] });
    regenProduktpaket(true);
}
function entfernePaket(pi)            { produktpaketState.pakete.splice(pi, 1); regenProduktpaket(true); }

// Nach einer Änderung: ggf. UI neu bauen und immer die EDIFACT-Ausgabe aktualisieren.
function regenProduktpaket(rebuildUi) {
    if (rebuildUi) {
        const c = document.getElementById('produktpaketContainer');
        if (c) renderProduktpaket(c);
    }
    if (typeof generateEdifact === 'function') generateEdifact();
}

// Baut die EDIFACT-Segmente des Produktpaket-Blocks (als Array von Segment-Strings).
function buildProduktpaketSegments() {
    const segs = [];
    if (!produktpaketState) return segs;
    // 1) Je Produktpaket die erforderlichen Produkte (SG8 SEQ+Z79 -> PIA/CCI/CAV)
    produktpaketState.pakete.forEach(paket => {
        paket.produkte.forEach(prod => {
            segs.push(`SEQ+Z79+${paket.paketId}'`);
            segs.push(`PIA+5+${prod.code}:Z11'`);
            const pdef = findeProdukt(prod.code);
            // CCI+Z66 + CAV+ZH9 nur wenn eine Produkteigenschaft existiert/gewählt ist
            if (pdef && pdef.eigenschaften && pdef.eigenschaften.length > 0 && prod.eigenschaft) {
                segs.push(`CCI+Z66'`);
                segs.push(`CAV+ZH9:::${prod.eigenschaft}'`);
            }
            // CAV+ZV4 (Wertedetail) nur wenn das Produkt einen freien Wert erwartet und einer gesetzt ist
            if (pdef && pdef.wertdetail && prod.wert) {
                segs.push(`CAV+ZV4:::${prod.wert}'`);
            }
        });
    });
    // 2) Je Produktpaket-ID genau einmal Priorisierung + Umsetzungsgrad (SG8 SEQ+ZH0 -> SG10 CCI+Z65)
    produktpaketState.pakete.forEach(paket => {
        segs.push(`SEQ+ZH0+${paket.paketId}'`);
        segs.push(`CCI+Z65+++${paket.umsetzungsgrad}'`);
    });
    return segs;
}

if (typeof module !== 'undefined') {
    module.exports = { buildProduktpaketSegments, renderProduktpaket, initProduktpaketState };
}
