import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db, dbMata } from "./firebase.js";

// ======================================
// FUNÇÕES AUXILIARES
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

    return normalizarTexto(a) === normalizarTexto(b);

}

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


// ======================================
// ABRIR AUDITORIA
// ======================================

async function abrirAuditoria(email){

    document.getElementById(
        "painelAuditoria"
    ).style.display = "block";

    const usuario =
        usuarios.find(
            u => u.email === email
        );

    if(!usuario) return;

    document.getElementById(
        "dadosParticipante"
    ).innerHTML = `

        <div class="cardInfo">

            <h2>${usuario.nome}</h2>

            <p><strong>Empresa:</strong> ${usuario.empresa}</p>

            <p><strong>Filial:</strong> ${usuario.filial}</p>

            <p><strong>E-mail:</strong> ${usuario.email}</p>

        </div>

    `;

    await carregarResumo(email);

    await carregarJogos(email);

    await carregarMata(email);

    await carregarExtras(email);

}

window.abrirAuditoria =
    abrirAuditoria;

// ======================================
// RESUMO
// ======================================

async function carregarResumo(email){

    let jogos = 0;
    let mata = 0;
    let extras = 0;

    // Jogos
    const usuarioRanking =
        usuarios.find(
            u => u.email === email
        );

    if(usuarioRanking){

        jogos =
            (usuarioRanking.pontos || 0)
            -
            (usuarioRanking.pontosExtras || 0);

    }

    // Mata
    const mataSnap =
        await getDocs(
            collection(
                dbMata,
                "palpites"
            )
        );

    mataSnap.forEach(docSnap=>{

        const dados =
            docSnap.data();

        if(
            dados.email !== email
        ) return;

        const palpites =
            dados.palpites || {};

        Object.values(palpites)
        .forEach(p=>{

            if(p.pontos){

                mata +=
                    Number(
                        p.pontos
                    );

            }

        });

    });

    extras =
        usuarioRanking?.pontosExtras || 0;

    const total =
        jogos +
        mata +
        extras +
        40;

    document.getElementById(
        "resumoParticipante"
    ).innerHTML = `

    <div class="resumoCard">

        <div>

            ⚽ Jogos

            <strong>

                ${jogos} pts

            </strong>

        </div>

        <div>

            🏆 Mata

            <strong>

                ${mata} pts

            </strong>

        </div>

        <div>

            ⭐ Extras

            <strong>

                ${extras} pts

            </strong>

        </div>

        <div>

            🎁 Compensação

            <strong>

                40 pts

            </strong>

        </div>

        <hr>

        <div
            style="
                font-size:28px;
                font-weight:bold;
            ">

            TOTAL

            ${total} pts

        </div>

    </div>

    `;

}

// ======================================
// JOGOS
// ======================================

async function carregarJogos(email){

    const lista =
        document.getElementById(
            "listaJogos"
        );

    lista.innerHTML = "";

    const jogosSnap =
        await getDocs(
            collection(
                db,
                "jogos"
            )
        );

    const palpitesSnap =
        await getDocs(
            query(
                collection(
                    db,
                    "palpites"
                ),
                where(
                    "usuario",
                    "==",
                    email
                )
            )
        );

    const jogos = {};

    jogosSnap.forEach(docSnap=>{

        jogos[docSnap.data().id] = docSnap.data();

    });

    palpitesSnap.forEach(docSnap=>{

        const p = docSnap.data();

        const jogo =
            jogos[p.jogoId];

        if(!jogo)
            return;

        let pontos = 0;

        let regra =
            "Sem Pontos";

        if(
            jogo.placarRealA == null ||
            jogo.placarRealB == null
        ){

            regra =
                "Aguardando Resultado";

        }else{

            const pA =
                Number(p.placarA);

            const pB =
                Number(p.placarB);

            const rA =
                Number(jogo.placarRealA);

            const rB =
                Number(jogo.placarRealB);

            const resultadoPalpite =
                Math.sign(
                    pA-pB
                );

            const resultadoReal =
                Math.sign(
                    rA-rB
                );

            const saldoPalpite =
                Math.abs(
                    pA-pB
                );

            const saldoReal =
                Math.abs(
                    rA-rB
                );

            if(
                pA===rA &&
                pB===rB
            ){

                pontos = 10;
                regra = "Placar Exato";

            }

            else if(
                resultadoReal===0 &&
                resultadoPalpite===0
            ){

                pontos = 5;
                regra = "Empate";

            }

            else if(

                resultadoPalpite===resultadoReal &&

                (
                    pA===rA ||
                    pB===rB
                )

            ){

                pontos = 7;
                regra = "Vencedor + Gols";

            }

            else if(

                resultadoPalpite===resultadoReal &&

                saldoPalpite===saldoReal

            ){

                pontos = 5;
                regra = "Saldo de Gols";

            }

            else if(

                resultadoPalpite===resultadoReal

            ){

                pontos = 3;
                regra = "Vencedor";

            }

        }

        lista.innerHTML += `

        <div class="cardAuditoriaJogo">

            <h3>

                ${jogo.timeA}

                ${jogo.placarRealA ?? "-"}

                x

                ${jogo.placarRealB ?? "-"}

                ${jogo.timeB}

            </h3>

            <p>

                <strong>Palpite:</strong>

                ${p.placarA}

                x

                ${p.placarB}

            </p>

            <p>

                <strong>Critério:</strong>

                ${regra}

            </p>

            <p>

                <strong>Pontos:</strong>

                ${pontos}

            </p>

        </div>

        `;

    });

}
// ======================================
// MATA-MATA
// ======================================

async function carregarMata(email){

    const lista =
        document.getElementById(
            "listaMata"
        );

    lista.innerHTML = "";

    const fases = [

        "SEG",
        "OIT",
        "QUA",
        "SEM",
        "L3",
        "FIN"

    ];

    for(const fase of fases){

        const palpiteRef =
            await getDocs(
                query(
                    collection(
                        dbMata,
                        "palpites"
                    ),
                    where(
                        "email",
                        "==",
                        email
                    ),
                    where(
                        "fase",
                        "==",
                        fase
                    )
                )
            );

        if(palpiteRef.empty)
            continue;

        const resultadoRef =
            await getDoc(
                doc(
                    dbMata,
                    "resultados",
                    fase
                )
            );

        const resultados =
            resultadoRef.exists()

            ?

            resultadoRef.data().resultados || {}

            :

            {};

        palpiteRef.forEach(docSnap=>{

            const dados =
                docSnap.data();

            const palpites =
                dados.palpites || {};

            Object.keys(palpites)
            .forEach(id=>{

                const p =
                    palpites[id];

                const r =
                    resultados[id];

                let pontos = 0;

                if(

                    r &&
                    r.vencedor &&
                    r.vencedor.time

                ){

                    if(

                        p.vencedor ===
                        r.vencedor.time

                    ){

                        pontos += 10;

                        if(

                            p.forma ===
                            r.forma

                        ){

                            pontos += 10;

                        }

                    }

                }

                lista.innerHTML += `

                <div class="cardAuditoriaJogo">

                    <h3>

                        ${fase}

                    </h3>

                    <p>

                        <strong>Palpite:</strong>

                        ${p.vencedor}

                    </p>

                    <p>

                        <strong>Forma:</strong>

                        ${p.forma}

                    </p>

                    <p>

                        <strong>Resultado:</strong>

                        ${

                            r

                            ?

                            r.vencedor.time

                            :

                            "-"

                        }

                    </p>

                    <p>

                        <strong>Forma Oficial:</strong>

                        ${

                            r

                            ?

                            r.forma

                            :

                            "-"

                        }

                    </p>

                    <p>

                        <strong>Pontos:</strong>

                        ${pontos}

                    </p>

                </div>

                `;

            });

        });

    }

}

// ======================================
// EXTRAS
// ======================================

async function carregarExtras(email){

    const div =
        document.getElementById(
            "listaExtras"
        );

    div.innerHTML = "";

    const oficialRef =
        await getDoc(
            doc(
                db,
                "extras_resultado",
                "oficial"
            )
        );

    if(!oficialRef.exists()){

        div.innerHTML = `
            <p>
                Resultado oficial ainda não cadastrado.
            </p>
        `;

        return;

    }

    const oficial =
        oficialRef.data();

    const usuarioRef =
        await getDoc(
            doc(
                db,
                "extras",
                email
            )
        );

    if(!usuarioRef.exists()){

        div.innerHTML = `
            <p>
                Participante não enviou palpites extras.
            </p>
        `;

        return;

    }

    const palpite =
        usuarioRef.data();

    const itens = [

        {

            titulo:"🏆 Campeão",

            palpite:palpite.campeao,

            oficial:oficial.campeao,

            pontos:20,

            ok:compararSelecao(
                palpite.campeao,
                oficial.campeao
            )

        },

        {

            titulo:"🥈 Vice",

            palpite:palpite.vice,

            oficial:oficial.vice,

            pontos:10,

            ok:compararSelecao(
                palpite.vice,
                oficial.vice
            )

        },

        {

            titulo:"👟 Artilheiro",

            palpite:palpite.artilheiro,

            oficial:oficial.artilheiro,

            pontos:15,

            ok:compararNome(
                palpite.artilheiro,
                oficial.artilheiro
            )

        },

        {

            titulo:"🇧🇷 Gols do Brasil",

            palpite:palpite.golsBrasil,

            oficial:oficial.golsBrasil,

            pontos:10,

            ok:Number(
                palpite.golsBrasil
            )===Number(
                oficial.golsBrasil
            )

        },

        {

            titulo:"🏆 Fase do Brasil",

            palpite:palpite.faseBrasil,

            oficial:oficial.faseBrasil,

            pontos:10,

            ok:normalizarTexto(
                palpite.faseBrasil
            )===normalizarTexto(
                oficial.faseBrasil
            )

        }

    ];

    let total = 0;

    itens.forEach(item=>{

        if(item.ok)
            total += item.pontos;

        div.innerHTML += `

        <div class="cardAuditoriaJogo">

            <h3>

                ${item.titulo}

            </h3>

            <p>

                <strong>Palpite:</strong>

                ${item.palpite}

            </p>

            <p>

                <strong>Oficial:</strong>

                ${item.oficial}

            </p>

            <p style="
                font-weight:bold;
                color:${item.ok?"green":"red"};
            ">

                ${item.ok?"✔":"❌"}

                ${item.ok?item.pontos:0} pts

            </p>

        </div>

        `;

    });

    div.innerHTML += `

        <div
            class="cardAuditoriaJogo"
            style="
                background:#111;
                color:#fff;
            "
        >

            <h2>

                ⭐ TOTAL EXTRAS

            </h2>

            <h1>

                ${total} pts

            </h1>

        </div>

    `;

}