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

// ======================================================
// RETORNA VENCEDOR E PERDEDOR
// ======================================================

function obterResultadoJogo(jogo, placarA, placarB, decisao){

    let vencedor = null;
    let perdedor = null;

    if(placarA > placarB){

        vencedor = {

            time:jogo.timeA,
            nome:jogo.nomeA

        };

        perdedor = {

            time:jogo.timeB,
            nome:jogo.nomeB

        };

    }

    else if(placarB > placarA){

        vencedor = {

            time:jogo.timeB,
            nome:jogo.nomeB

        };

        perdedor = {

            time:jogo.timeA,
            nome:jogo.nomeA

        };

    }

    else{

        // Empate
        // Decide pela escolha do administrador
        // (Prorrogação ou Pênaltis)

        const vencedorLado =
            TIPO_VENCEDOR[jogo.jogo] || "A";

        if(vencedorLado=="A"){

            vencedor={

                time:jogo.timeA,
                nome:jogo.nomeA

            };

            perdedor={

                time:jogo.timeB,
                nome:jogo.nomeB

            };

        }else{

            vencedor={

                time:jogo.timeB,
                nome:jogo.nomeB

            };

            perdedor={

                time:jogo.timeA,
                nome:jogo.nomeA

            };

        }

    }

    return{

        vencedor,

        perdedor,

        decisao

    };

}

// ======================================================
// AVANÇA O VENCEDOR PARA O PRÓXIMO CONFRONTO
// ======================================================

async function avancarVencedor(jogoAtual, vencedor){

    const mapa = MAPA_MATA[jogoAtual];

    if(!mapa) return;

    const faseDestino =
        mapa.proximo <= 96 ? "OIT" :
        mapa.proximo <=100 ? "QUA" :
        mapa.proximo <=102 ? "SEM" :
        "FIN";

    const ref = window.doc(
        window.dbMata,
        "resultados",
        faseDestino
    );

    const snap = await window.getDoc(ref);

    let dados = {};

    if(snap.exists()){

        dados = snap.data().resultados || {};

    }

    dados[mapa.proximo] ??= {};

    if(mapa.lado=="A"){

        dados[mapa.proximo].timeA = vencedor.time;
        dados[mapa.proximo].nomeA = vencedor.nome;

    }else{

        dados[mapa.proximo].timeB = vencedor.time;
        dados[mapa.proximo].nomeB = vencedor.nome;

    }

    await window.setDoc(

        ref,

        {

            fase:faseDestino,

            resultados:dados,

            atualizadoEm:window.serverTimestamp()

        },

        {

            merge:true

        }

    );

}
