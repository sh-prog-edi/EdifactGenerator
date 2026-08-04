// _pid-registry.js - Zuordnung Prüf-ID -> Regelobjekt (Strom). Wird von der Engine
// (generator.js) genutzt. Muss NACH den einzelnen PID-Regeldateien geladen werden.
const ahbRulesByPrufId = {
    "55001": ahbRules55001, "55002": ahbRules55002, "55003": ahbRules55003,
    "55004": ahbRules55004, "55005": ahbRules55005, "55006": ahbRules55006,
    "55007": ahbRules55007, "55008": ahbRules55008, "55009": ahbRules55009,
    "55010": ahbRules55010, "55011": ahbRules55011, "55012": ahbRules55012,
    "55013": ahbRules55013, "55014": ahbRules55014, "55015": ahbRules55015,
    "55016": ahbRules55016, "55017": ahbRules55017, "55018": ahbRules55018,
    "55036": ahbRules55036, "55037": ahbRules55037, "55038": ahbRules55038,
    "55077": ahbRules55077, "55078": ahbRules55078, "55080": ahbRules55080,
    "55600": ahbRules55600, "55602": ahbRules55602, "55604": ahbRules55604,
    "55601": ahbRules55601, "55603": ahbRules55603, "55605": ahbRules55605,
    "55607": ahbRules55607, "55608": ahbRules55608, "55609": ahbRules55609,
    "55218": ahbRules55218, "55220": ahbRules55220,
    "55613": ahbRules55613, "55614": ahbRules55614, "55126": ahbRules55126, "55156": ahbRules55156,
    "55674": ahbRules55674, "55675": ahbRules55675, "55672": ahbRules55672, "55673": ahbRules55673,
    // 9.1 Stammdatenänderung NB
    "55615": ahbRules55615, "55621": ahbRules55621, "55627": ahbRules55627, "55633": ahbRules55633, "55688": ahbRules55688, "55689": ahbRules55689, "55616": ahbRules55616, "55622": ahbRules55622, "55628": ahbRules55628, "55634": ahbRules55634, "55691": ahbRules55691, "55692": ahbRules55692, "55619": ahbRules55619, "55625": ahbRules55625, "55617": ahbRules55617, "55623": ahbRules55623, "55629": ahbRules55629, "55635": ahbRules55635, "55618": ahbRules55618, "55624": ahbRules55624, "55630": ahbRules55630, "55636": ahbRules55636, "55620": ahbRules55620, "55626": ahbRules55626, "55632": ahbRules55632, "55638": ahbRules55638, "55225": ahbRules55225, "55227": ahbRules55227, "55175": ahbRules55175, "55180": ahbRules55180, "55173": ahbRules55173, "55177": ahbRules55177, "55690": ahbRules55690,
    // 9.2 Stammdatenänderung LF
    "55109": ahbRules55109, "55137": ahbRules55137, "55110": ahbRules55110, "55136": ahbRules55136, "55230": ahbRules55230, "55232": ahbRules55232, "55693": ahbRules55693, "55694": ahbRules55694,
    // 9.3 Stammdatenänderung MSB
    "55684": ahbRules55684, "55685": ahbRules55685, "55686": ahbRules55686, "55687": ahbRules55687, "55639": ahbRules55639, "55644": ahbRules55644, "55649": ahbRules55649, "55654": ahbRules55654, "55659": ahbRules55659, "55664": ahbRules55664, "55640": ahbRules55640, "55645": ahbRules55645, "55650": ahbRules55650, "55655": ahbRules55655, "55660": ahbRules55660, "55665": ahbRules55665, "55642": ahbRules55642, "55647": ahbRules55647, "55652": ahbRules55652, "55657": ahbRules55657, "55662": ahbRules55662, "55667": ahbRules55667, "55641": ahbRules55641, "55646": ahbRules55646, "55651": ahbRules55651, "55656": ahbRules55656, "55661": ahbRules55661, "55666": ahbRules55666, "55643": ahbRules55643, "55648": ahbRules55648, "55653": ahbRules55653, "55658": ahbRules55658, "55663": ahbRules55663, "55669": ahbRules55669, "55557": ahbRules55557, "55559": ahbRules55559,
    // 9.4 Bilanzkreistreue
    "55670": ahbRules55670, "55671": ahbRules55671,
    // 9.5 Geschäftsdatenanfrage (Antwort auf GDA)
    "55035": ahbRules55035, "55095": ahbRules55095, "55060": ahbRules55060, "55194": ahbRules55194,
    // 9.3.8 Daten auf individuelle Bestellung
    "55553": ahbRules55553, "55555": ahbRules55555,
    // 9.6 Stornierungsmeldung
    "55022": ahbRules55022, "55023": ahbRules55023, "55024": ahbRules55024,
    // Kapitel 10 Messstellenbetrieb
    "55039": ahbRules55039, "55040": ahbRules55040, "55041": ahbRules55041, "55042": ahbRules55042, "55043": ahbRules55043, "55044": ahbRules55044, "55168": ahbRules55168, "55169": ahbRules55169, "55170": ahbRules55170, "55051": ahbRules55051, "55052": ahbRules55052, "55053": ahbRules55053,
    // Kapitel 11 + 13 + 55611 (restliche Strom-Fälle)
    "55238": ahbRules55238, "55239": ahbRules55239, "55240": ahbRules55240, "55241": ahbRules55241, "55242": ahbRules55242, "55243": ahbRules55243, "55074": ahbRules55074, "55075": ahbRules55075, "55076": ahbRules55076, "55611": ahbRules55611, "55062": ahbRules55062, "55063": ahbRules55063, "55064": ahbRules55064, "55065": ahbRules55065, "55066": ahbRules55066, "55067": ahbRules55067, "55069": ahbRules55069, "55070": ahbRules55070, "55071": ahbRules55071, "55072": ahbRules55072, "55073": ahbRules55073, "55195": ahbRules55195, "55196": ahbRules55196, "55223": ahbRules55223, "55224": ahbRules55224, "55197": ahbRules55197, "55198": ahbRules55198, "55199": ahbRules55199, "55200": ahbRules55200, "55201": ahbRules55201, "55202": ahbRules55202, "55203": ahbRules55203, "55204": ahbRules55204, "55205": ahbRules55205, "55206": ahbRules55206, "55207": ahbRules55207, "55208": ahbRules55208, "55209": ahbRules55209, "55210": ahbRules55210, "55211": ahbRules55211, "55212": ahbRules55212, "55213": ahbRules55213, "55214": ahbRules55214, "55235": ahbRules55235, "55236": ahbRules55236, "55237": ahbRules55237
};
if (typeof module !== 'undefined') module.exports = ahbRulesByPrufId;
