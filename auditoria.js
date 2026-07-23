import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db, dbMata } from "./firebase.js";

function normalizarTexto(texto){

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g,"")
        .replace(/\s+/g," ")
        .trim()
        .toUpperCase();

}

function compararNome(a,b){

    a = normalizarTexto(a);
    b = normalizarTexto(b);

    return (
        a === b ||
        a.includes(b) ||
        b.includes(a)
    );

}

function compararSelecao(a,b){

    return normalizarTexto(a) ===
           normalizarTexto(b);

}

const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if(!usuarioLogado){

    location.href = "index.html";

}

const administradores = [

    "simone.schramm@equagril.com.br",
    "gabriel.rodrigues@gruposhark.com.br"

];

if(

    !administradores.includes(
        usuarioLogado.email
    )

){

    document.body.innerHTML = `

        <div class="semPermissao">

            <h1>⛔ Acesso Negado</h1>

            <p>
                Área exclusiva da administração.
            </p>

        </div>

    `;

    throw new Error("Sem permissão");

}

let usuarios = [];

let participanteAtual = null;

async function carregarUsuarios(){

    const snap = await getDocs(
        collection(db,"usuarios")
    );

    usuarios = snap.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

window.addEventListener(

    "load",

    async()=>{

        await carregarUsuarios();

    }

);

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

    usuarios

    .filter(u=>

        (u.nome||"")
        .toUpperCase()
        .includes(texto)

        ||

        (u.email||"")
        .toUpperCase()
        .includes(texto)

        ||

        (u.empresa||"")
        .toUpperCase()
        .includes(texto)

        ||

        (u.filial||"")
        .toUpperCase()
        .includes(texto)

    )

    .forEach(u=>{

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

async function abrirAuditoria(email){

    participanteAtual = usuarios.find(
        u=>u.email===email
    );

    if(!participanteAtual)
        return;

    document.getElementById(
        "painelAuditoria"
    ).style.display = "block";

    document.getElementById(
        "dadosParticipante"
    ).innerHTML = `

        <div class="cardInfo">

            <h2>${participanteAtual.nome}</h2>

            <p><strong>Empresa:</strong> ${participanteAtual.empresa}</p>

            <p><strong>Filial:</strong> ${participanteAtual.filial}</p>

            <p><strong>E-mail:</strong> ${participanteAtual.email}</p>

        </div>

    `;

}

async function carregarResumo(){

    await window.atualizarRanking();

    const usuarios =
        window.getUsuariosRanking();

    const participante =
        usuarios.find(
            u => u.email === participanteAtual.email
        );

    if(!participante){

        document.getElementById(
            "resumoParticipante"
        ).innerHTML =
            "<p>Participante não encontrado.</p>";

        return;

    }

    document.getElementById(
        "resumoParticipante"
    ).innerHTML = `

        <div class="resumoCard">

            <div>⚽ Jogos <strong>${participante.pontos - (participante.pontosExtras || 0)} pts</strong></div>

            <div>⭐ Extras <strong>${participante.pontosExtras || 0} pts</strong></div>

            <div>🎁 Compensação <strong>40 pts</strong></div>

            <div>🎯 Placares Exatos <strong>${participante.placaresExatos || 0}</strong></div>

            <div>✅ Vencedores <strong>${participante.vencedoresAcertados || 0}</strong></div>

            <hr>

            <div style="font-size:30px;font-weight:bold;">

                TOTAL ${(participante.pontos || 0) + 40} pts

            </div>

        </div>

    `;

}

