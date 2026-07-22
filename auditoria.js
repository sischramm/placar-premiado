import {
    collection,
    getDocs,
    query
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db, dbMata } from "./firebase.js";

// ======================================
// USUÁRIO LOGADO
// ======================================

const usuario = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if(!usuario){

    location.href = "index.html";

}

// ======================================
// PERMISSÃO
// ======================================

const administradores = [

    "simone.schramm@equagril.com.br",
    "gabriel.rodrigues@gruposhark.com.br"

];

if(
    !administradores.includes(
        usuario.email
    )
){

    document.body.innerHTML = `

        <div class="semPermissao">

            <h1>⛔ Acesso negado</h1>

            <p>
                Esta área é exclusiva da administração.
            </p>

        </div>

    `;

    throw new Error("Sem permissão");

}

// ======================================
// CACHE DOS USUÁRIOS
// ======================================

let usuarios = [];

async function carregarUsuarios(){

    const snap = await getDocs(
        collection(db,"usuarios")
    );

    usuarios = [];

    snap.forEach(docSnap=>{

        usuarios.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

}

window.addEventListener(

    "load",

    async()=>{

        await carregarUsuarios();

    }

);

// ======================================
// PESQUISA
// ======================================

const campoBusca =
    document.getElementById(
        "buscaParticipante"
    );

campoBusca.addEventListener(

    "input",

    pesquisarParticipante

);

function pesquisarParticipante(){

    const texto =
        campoBusca.value
            .trim()
            .toUpperCase();

    const lista =
        document.getElementById(
            "resultadoPesquisa"
        );

    lista.innerHTML = "";

    if(texto.length < 2)
        return;

    const encontrados =
        usuarios.filter(u=>{

            return (

                (u.nome || "")
                    .toUpperCase()
                    .includes(texto)

                ||

                (u.email || "")
                    .toUpperCase()
                    .includes(texto)

                ||

                (u.empresa || "")
                    .toUpperCase()
                    .includes(texto)

                ||

                (u.filial || "")
                    .toUpperCase()
                    .includes(texto)

            );

        });

    encontrados.forEach(u=>{

        lista.innerHTML += `

        <div
            class="linhaPesquisa"
            onclick="abrirAuditoria('${u.email}')"
        >

            <strong>${u.nome}</strong>

            <br>

            ${u.empresa}
            •
            ${u.filial}

        </div>

        `;

    });

}

