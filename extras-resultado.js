import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db } from "./firebase.js";



// ======================================
// RESULTADO OFICIAL DOS EXTRAS
// ======================================

const REF_EXTRAS = doc(
    db,
    "extras_resultado",
    "oficial"
);


window.REF_EXTRAS = REF_EXTRAS;


// ======================================
// SALVAR RESULTADO OFICIAL DOS EXTRAS
// ======================================

async function salvarResultadoExtras(){

    const dados = {

        campeao:
            document.getElementById(
                "resCampeao"
            ).value,

        vice:
            document.getElementById(
                "resVice"
            ).value,

        artilheiro:
            document.getElementById(
                "resArtilheiro"
            ).value,

        golsBrasil:
            Number(
                document.getElementById(
                    "resGolsBrasil"
                ).value
            ),

        faseBrasil:
            document.getElementById(
                "resFaseBrasil"
            ).value

    };

    await setDoc(

        REF_EXTRAS,

        dados,

        {

            merge:true

        }

    );

if(window.recalcularRankingExtras){

    await window.recalcularRankingExtras();

}

    alert(
        "✅ Resultado oficial salvo!"
    );

}

window.salvarResultadoExtras =
    salvarResultadoExtras;


// ======================================
// CARREGA LISTA DE SELEÇÕES
// ======================================

function carregarSelecoesExtras(){

    const paises=[

        "África do Sul",
        "Alemanha",
        "Arábia Saudita",
        "Argélia",
        "Argentina",
        "Austrália",
        "Áustria",
        "Bélgica",
        "Bósnia",
        "Brasil",
        "Cabo Verde",
        "Canadá",
        "Catar",
        "Colômbia",
        "Coreia do Sul",
        "Costa do Marfim",
        "Croácia",
        "Curaçao",
        "Egito",
        "Equador",
        "Escócia",
        "Espanha",
        "EUA",
        "França",
        "Gana",
        "Haiti",
        "Holanda",
        "Inglaterra",
        "Irã",
        "Iraque",
        "Japão",
        "Jordânia",
        "Marrocos",
        "México",
        "Noruega",
        "Nova Zelândia",
        "Panamá",
        "Paraguai",
        "Portugal",
        "RD Congo",
        "República Tcheca",
        "Senegal",
        "Suécia",
        "Suíça",
        "Tunísia",
        "Turquia",
        "Uruguai",
        "Uzbequistão"

    ];

    paises.sort(
        (a,b)=>a.localeCompare(b,"pt-BR")
    );

    const html =
        '<option value="">Selecione</option>' +

        paises.map(p=>

            `<option value="${p}">${p}</option>`

        ).join("");

    const campeao =
        document.getElementById("resCampeao");

    const vice =
        document.getElementById("resVice");

    if(campeao)
        campeao.innerHTML = html;

    if(vice)
        vice.innerHTML = html;

}

window.carregarSelecoesExtras =
    carregarSelecoesExtras;



// ======================================
// CARREGA RESULTADO OFICIAL
// ======================================

async function carregarResultadoExtras(){

    const snap =
        await getDoc(
            REF_EXTRAS
        );

    if(!snap.exists())
        return;

    const dados =
        snap.data();

    document.getElementById(
        "resCampeao"
    ).value =
        dados.campeao || "";

    document.getElementById(
        "resVice"
    ).value =
        dados.vice || "";

    document.getElementById(
        "resArtilheiro"
    ).value =
        dados.artilheiro || "";

    document.getElementById(
        "resGolsBrasil"
    ).value =
        dados.golsBrasil ?? "";

    document.getElementById(
        "resFaseBrasil"
    ).value =
        dados.faseBrasil || "";

}

window.carregarResultadoExtras =
    carregarResultadoExtras;

