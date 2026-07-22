// ======================================================
// RANKING DOS EXTRAS
// ======================================================

import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db } from "./firebase.js";


// ======================================
// NORMALIZA TEXTO
// ======================================

function normalizarTexto(texto){

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g,"")
        .replace(/\s+/g," ")
        .trim()
        .toUpperCase();

}


// ======================================
// COMPARA NOMES
// ======================================

function compararNome(a,b){

    a = normalizarTexto(a);
    b = normalizarTexto(b);

    return (
        a === b ||
        a.includes(b) ||
        b.includes(a)
    );

}


// ======================================
// COMPARA SELEÇÃO
// ======================================

function compararSelecao(a,b){

    return normalizarTexto(a) ===
           normalizarTexto(b);

}


// ======================================
// CALCULA PONTOS DOS EXTRAS
// ======================================

function calcularPontosExtras(palpite,oficial){

    let pontos = 0;

    const detalhe = {

        campeao:0,
        artilheiro:0,
        faseBrasil:0,
        golsBrasil:0

    };

    // Campeão
    if(
        compararSelecao(
            palpite.campeao,
            oficial.campeao
        )
    ){

        detalhe.campeao = 20;
        pontos += 20;

    }

    // Artilheiro
    if(
        compararNome(
            palpite.artilheiro,
            oficial.artilheiro
        )
    ){

        detalhe.artilheiro = 15;
        pontos += 15;

    }

    // Fase do Brasil
    if(
        compararSelecao(
            palpite.faseBrasil,
            oficial.faseBrasil
        )
    ){

        detalhe.faseBrasil = 10;
        pontos += 10;

    }

    // Gols do Brasil
    const golsPalpite =
        Number(palpite.golsBrasil);

    const golsOficial =
        Number(oficial.golsBrasil);

    const diferenca =
        Math.abs(
            golsPalpite - golsOficial
        );

    if(diferenca === 0){

        detalhe.golsBrasil = 10;
        pontos += 10;

    }else if(diferenca === 1){

        detalhe.golsBrasil = 5;
        pontos += 5;

    }

    return{

        pontos,

        detalhe

    };

}

// ======================================
// RECALCULA RANKING DOS EXTRAS
// ======================================

async function recalcularRankingExtras(){

    try{

        // ===========================
        // RESULTADO OFICIAL
        // ===========================

        const oficialSnap =
            await getDoc(
                doc(
                    db,
                    "extras_resultado",
                    "oficial"
                )
            );

        if(!oficialSnap.exists()){

            console.log(
                "Resultado oficial dos Extras não encontrado."
            );

            return;

        }

        const oficial =
            oficialSnap.data();

        // ===========================
        // TODOS OS PALPITES
        // ===========================

        const snap =
            await getDocs(
                collection(
                    db,
                    "extras"
                )
            );

        // ===========================
        // CALCULA PARTICIPANTE
        // ===========================

        for(const documento of snap.docs){

            const email =
                documento.id;

            const palpite =
                documento.data();

            const resultado =
                calcularPontosExtras(
                    palpite,
                    oficial
                );

            await setDoc(

                doc(
                    db,
                    "rankingExtras",
                    email
                ),

                {

                    email,

                    pontosExtras:
                        resultado.pontos,

                    extras:
                        resultado.detalhe,

                    atualizadoEm:
                        serverTimestamp()

                },

                {

                    merge:true

                }

            );

            console.log(

                email,

                resultado.pontos,

                resultado.detalhe

            );

        }

        console.log(
            "Ranking dos Extras atualizado."
        );

    }catch(erro){

        console.error(

            "Erro ao recalcular Extras:",

            erro

        );

    }

}

window.recalcularRankingExtras =
    recalcularRankingExtras;