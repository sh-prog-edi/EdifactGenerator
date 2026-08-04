// _pid-registry.js - Zuordnung Prüf-ID -> Regelobjekt (Gas). NACH den PID-Dateien laden.
const ahbRulesByPrufId = {
    "44001": ahbRules44001,
    "44002": ahbRules44002,
    "44003": ahbRules44003,
    "44004": ahbRules44004,
    "44005": ahbRules44005,
    "44006": ahbRules44006,
    "44007": ahbRules44007,
    "44008": ahbRules44008,
    "44009": ahbRules44009,
    "44010": ahbRules44010,
    "44011": ahbRules44011,
    "44012": ahbRules44012,
    "44013": ahbRules44013,
    "44014": ahbRules44014,
    "44015": ahbRules44015,
    "44016": ahbRules44016,
    "44017": ahbRules44017,
    "44018": ahbRules44018,
    "44036": ahbRules44036,
    "44037": ahbRules44037,
    "44038": ahbRules44038,
    // Gas-Restfälle (5.1/5.2/5.10/5.12/5.13/5.14/6.x/7.x)
    "44019": ahbRules44019, "44020": ahbRules44020, "44021": ahbRules44021, "44022": ahbRules44022, "44023": ahbRules44023, "44024": ahbRules44024, "44035": ahbRules44035, "44060": ahbRules44060, "44039": ahbRules44039, "44040": ahbRules44040, "44041": ahbRules44041, "44042": ahbRules44042, "44043": ahbRules44043, "44044": ahbRules44044, "44168": ahbRules44168, "44169": ahbRules44169, "44170": ahbRules44170, "44051": ahbRules44051, "44052": ahbRules44052, "44053": ahbRules44053, "44183": ahbRules44183, "44101": ahbRules44101, "44102": ahbRules44102, "44103": ahbRules44103, "44104": ahbRules44104, "44105": ahbRules44105, "44109": ahbRules44109, "44111": ahbRules44111, "44112": ahbRules44112, "44113": ahbRules44113, "44115": ahbRules44115, "44116": ahbRules44116, "44117": ahbRules44117, "44119": ahbRules44119, "44120": ahbRules44120, "44121": ahbRules44121, "44123": ahbRules44123, "44124": ahbRules44124, "44159": ahbRules44159, "44160": ahbRules44160, "44161": ahbRules44161, "44175": ahbRules44175, "44176": ahbRules44176, "44137": ahbRules44137, "44138": ahbRules44138, "44139": ahbRules44139, "44140": ahbRules44140, "44142": ahbRules44142, "44143": ahbRules44143, "44145": ahbRules44145, "44146": ahbRules44146, "44147": ahbRules44147, "44148": ahbRules44148, "44149": ahbRules44149, "44150": ahbRules44150, "44151": ahbRules44151, "44152": ahbRules44152, "44156": ahbRules44156, "44157": ahbRules44157, "44162": ahbRules44162, "44163": ahbRules44163, "44164": ahbRules44164, "44165": ahbRules44165, "44166": ahbRules44166, "44167": ahbRules44167, "44180": ahbRules44180, "44181": ahbRules44181, "44182": ahbRules44182
};

if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;
