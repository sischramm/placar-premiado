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

// ======================================================
// OBTÉM A FASE DO PRÓXIMO JOGO
// ======================================================

function obterFaseDestino(numeroJogo){

    if(numeroJogo >= 89 && numeroJogo <= 96)
        return "OIT";

    if(numeroJogo >= 97 && numeroJogo <= 100)
        return "QUA";

    if(numeroJogo >= 101 && numeroJogo <= 102)
        return "SEM";

    if(numeroJogo == 103)
        return "L3";

    if(numeroJogo == 104)
        return "FIN";

    return null;

}

// ======================================================
// ATUALIZA O PRÓXIMO CONFRONTO
// ======================================================

async function atualizarProximoConfronto(jogoAtual,vencedor){

    const mapa = MAPA_MATA[jogoAtual];

    if(!mapa) return;

    const faseDestino =
        obterFaseDestino(
            mapa.proximo
        );

    if(!faseDestino) return;

    const ref =
        window.doc(
            window.dbMata,
            "resultados",
            faseDestino
        );

    const snap =
        await window.getDoc(ref);

    let dados = {};

    if(snap.exists()){

        dados =
            snap.data().resultados || {};

    }

    dados[mapa.proximo] ??= {};

    if(mapa.lado=="A"){

        dados[mapa.proximo].timeA =
            vencedor.time;

        dados[mapa.proximo].nomeA =
            vencedor.nome;

    }else{

        dados[mapa.proximo].timeB =
            vencedor.time;

        dados[mapa.proximo].nomeB =
            vencedor.nome;

    }

    await window.setDoc(

        ref,

        {

            fase:faseDestino,

            resultados:dados,

            atualizadoEm:
                window.serverTimestamp()

        },

        {

            merge:true

        }

    );

// Atualiza as telas automaticamente
    await atualizarMataAutomatico();

}


// ======================================================
// ATUALIZA A TELA APÓS AVANÇAR
// ======================================================

async function atualizarMataAutomatico(){

    // Se estiver na Central de Resultados
    if(typeof carregarResultadosNovo=="function"){

        await carregarResultadosNovo();

    }

    // Se estiver na tela do Mata-Mata
    if(typeof carregarFase=="function"){

        carregarFase(faseAtual);

    }

    // Atualiza Ranking
    if(typeof carregarRanking=="function"){

        carregarRanking();

    }

    // Atualiza Estatísticas
    if(typeof carregarEstatisticas=="function"){

        carregarEstatisticas();

    }

}


// ======================================================
// AVANÇA O PERDEDOR PARA O 3º LUGAR
// ======================================================

async function atualizarTerceiroLugar(jogoAtual,perdedor){

    const mapa = MAPA_TERCEIRO[jogoAtual];

    if(!mapa) return;

    const ref = window.doc(

        window.dbMata,

        "resultados",

        "L3"

    );

    const snap = await window.getDoc(ref);

    let dados = {};

    if(snap.exists()){

        dados = snap.data().resultados || {};

    }

    dados[103] ??= {};

    if(mapa.lado=="A"){

        dados[103].timeA = perdedor.time;

        dados[103].nomeA = perdedor.nome;

    }else{

        dados[103].timeB = perdedor.time;

        dados[103].nomeB = perdedor.nome;

    }

    await window.setDoc(

        ref,

        {

            fase:"L3",

            resultados:dados,

            atualizadoEm:
                window.serverTimestamp()

        },

        {

            merge:true

        }

    );

}


// ======================================================
// RECALCULA O RANKING DE UMA FASE
// 10 pontos vencedor
// +10 pontos forma
// ======================================================

async function recalcularRankingFase(fase){

    try{

        // =============================
        // RESULTADOS DA FASE
        // =============================

        const refResultados =
            window.doc(
                window.dbMata,
                "resultados",
                fase
            );

        const snapResultados =
            await window.getDoc(refResultados);

        if(!snapResultados.exists()) return;

        const resultados =
            snapResultados.data().resultados || {};

        // =============================
        // PALPITES
        // =============================

        const snapPalpites =
            await window.getDocs(
                window.collection(
                    window.dbMata,
                    "palpites"
                )
            );

        for(const documento of snapPalpites.docs){

            const dados =
                documento.data();

            if(dados.fase!=fase)
                continue;

            let pontos=0;

            const palpites =
                dados.palpites || {};

            Object.keys(palpites).forEach(jogo=>{

                const resultado =
                    resultados[jogo];

                if(!resultado)
                    return;

                const palpite =
                    palpites[jogo];

                // ==========================
                // ACERTOU VENCEDOR
                // ==========================

                if(

                    palpite.vencedor ==
                    resultado.vencedor.time

                ){

                    pontos +=10;

                    // ======================
                    // ACERTOU A FORMA
                    // ======================

                    if(

                        palpite.forma ==
                        resultado.forma

                    ){

                        pontos +=10;

                    }

                }

            });

            await window.setDoc(

                window.doc(

                    window.dbMata,

                    "ranking",

                    dados.email

                ),

                {

                    email:dados.email,

                    nome:dados.nome,

                    empresa:dados.empresa,

                    fase,

                    pontos,

                    atualizadoEm:
                        window.serverTimestamp()

                },

                {

                    merge:true

                }

            );

        }

    }catch(erro){

        console.error(

            "Erro ranking:",

            erro

        );

    }

}
