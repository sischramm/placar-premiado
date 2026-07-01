// ======================================================
// MAPA DE AVANÇO DO MATA-MATA
// ======================================================

const MAPA_MATA = {

    // ===========================
    // SEG -> OIT
    // ===========================

    73:{proximo:89,lado:"A"},
    74:{proximo:89,lado:"B"},

    75:{proximo:90,lado:"A"},
    76:{proximo:90,lado:"B"},

    77:{proximo:91,lado:"A"},
    78:{proximo:91,lado:"B"},

    79:{proximo:92,lado:"A"},
    80:{proximo:92,lado:"B"},

    81:{proximo:93,lado:"A"},
    82:{proximo:93,lado:"B"},

    83:{proximo:94,lado:"A"},
    84:{proximo:94,lado:"B"},

    85:{proximo:95,lado:"A"},
    86:{proximo:95,lado:"B"},

    87:{proximo:96,lado:"A"},
    88:{proximo:96,lado:"B"},


    // ===========================
    // OIT -> QUA
    // ===========================

    89:{proximo:97,lado:"A"},
    90:{proximo:97,lado:"B"},

    91:{proximo:98,lado:"A"},
    92:{proximo:98,lado:"B"},

    93:{proximo:99,lado:"A"},
    94:{proximo:99,lado:"B"},

    95:{proximo:100,lado:"A"},
    96:{proximo:100,lado:"B"},


    // ===========================
    // QUA -> SEM
    // ===========================

    97:{proximo:101,lado:"A"},
    98:{proximo:101,lado:"B"},

    99:{proximo:102,lado:"A"},
    100:{proximo:102,lado:"B"},


    // ===========================
    // SEM -> FINAL
    // ===========================

    101:{proximo:104,lado:"A"},
    102:{proximo:104,lado:"B"}

};

// ======================================================
// MAPA DO 3º LUGAR
// Perdedor das semifinais
// ======================================================

const MAPA_TERCEIRO = {

    101:{
        proximo:103,
        lado:"A"
    },

    102:{
        proximo:103,
        lado:"B"
    }

};
