// ======================================================
// MAPA DE AVANÇO DO MATA-MATA
// ======================================================

const MAPA_MATA = {

    // ===========================
    // 16 AVOS -> OITAVAS
    // ===========================

    73:{proximo:81,lado:"A"},
    74:{proximo:81,lado:"B"},

    75:{proximo:82,lado:"A"},
    76:{proximo:82,lado:"B"},

    77:{proximo:83,lado:"A"},
    78:{proximo:83,lado:"B"},

    79:{proximo:84,lado:"A"},
    80:{proximo:84,lado:"B"},

    // ===========================
    // OITAVAS -> QUARTAS
    // ===========================

    81:{proximo:89,lado:"A"},
    82:{proximo:89,lado:"B"},

    83:{proximo:90,lado:"A"},
    84:{proximo:90,lado:"B"},

    // ===========================
    // QUARTAS -> SEMI
    // ===========================

    89:{proximo:93,lado:"A"},
    90:{proximo:93,lado:"B"},

    // ===========================
    // SEMI -> FINAL
    // ===========================

    93:{proximo:96,lado:"A"}

};
