// _engine/version.js
// ------------------------------------------------------------------
// Versionsnummer des EdifactGenerators — EINE Pflegestelle für alle Seiten.
// scripts/pruefe_paket.js wacht darüber, dass sie mit package.json
// übereinstimmt. Ein Release entsteht über den passenden Git-Tag
// (v<Version>), der Release-Workflow baut daraus das ZIP.
//
// Jede Seite, die diese Datei lädt, zeigt unten rechts ein dezentes
// Versions-Badge; auf Seiten mit Formatstand-Modul (EdiStand) steht der
// aktive Stand daneben.
// ------------------------------------------------------------------
var EDIGEN_VERSION = "0.10.0-beta";

(function (global) {
    "use strict";
    function zeige() {
        try {
            if (typeof document === "undefined" || typeof document.createElement !== "function"
                || !document.body || document.getElementById("edigenVersion")) return;
            var stand = (global.EdiStand && global.EdiStand.aktiv) ? global.EdiStand.aktiv() : "";
            var el = document.createElement("div");
            el.id = "edigenVersion";
            el.textContent = "EdifactGenerator v" + EDIGEN_VERSION + (stand ? " · Formatstand " + stand : "");
            el.style.cssText = "position:fixed; right:10px; bottom:6px; z-index:40;"
                + "font-size:11px; color:var(--hint, var(--muted, #8a97a1)); opacity:.85;"
                + "pointer-events:none; font-family:'Segoe UI',Arial,sans-serif;";
            document.body.appendChild(el);
        } catch (e) { /* Anzeige ist rein informativ */ }
    }
    if (typeof document !== "undefined" && document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", zeige);
    } else {
        zeige();
    }
})(typeof window !== "undefined" ? window : this);
