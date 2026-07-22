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

abrirAbaAuditoria("dados");

}

window.abrirAuditoria =
    abrirAuditoria;

// ======================================
// RESUMO
// ======================================

async function calcularPontuacaoParticipante(email){

    let jogosPontos = 0;
    let placaresExatos = 0;
    let vencedores = 0;

    // Jogos oficiais
    const jogosSnap = await getDocs(
        collection(db,"jogos")
    );

    const jogos = {};

    jogosSnap.forEach(docSnap=>{

        jogos[docSnap.data().id] = docSnap.data();

    });

    // Palpites do participante
    const palpitesSnap = await getDocs(
        query(
            collection(db,"palpites"),
            where("usuario","==",email)
        )
    );

    palpitesSnap.forEach(docSnap=>{

        const p = docSnap.data();
        const jogo = jogos[p.jogoId];

        if(!jogo) return;

        if(
            jogo.placarRealA == null ||
            jogo.placarRealB == null
        ) return;

        const pA = Number(p.placarA);
        const pB = Number(p.placarB);

        const rA = Number(jogo.placarRealA);
        const rB = Number(jogo.placarRealB);

        const resultadoPalpite = Math.sign(pA-pB);
        const resultadoReal = Math.sign(rA-rB);

        const saldoPalpite = Math.abs(pA-pB);
        const saldoReal = Math.abs(rA-rB);

        let pontos = 0;

        if(pA===rA && pB===rB){

            pontos = 10;
            placaresExatos++;
            vencedores++;

        }else if(resultadoReal===0 && resultadoPalpite===0){

            pontos = 5;
            vencedores++;

        }else if(
            resultadoPalpite===resultadoReal &&
            (pA===rA || pB===rB)
        ){

            pontos = 7;
            vencedores++;

        }else if(
            resultadoPalpite===resultadoReal &&
            saldoPalpite===saldoReal
        ){

            pontos = 5;
            vencedores++;

        }else if(resultadoPalpite===resultadoReal){

            pontos = 3;
            vencedores++;

        }

        jogosPontos += pontos;

    });

    // Mata
    let mata = 0;

    const fases = [
        "SEG",
        "OIT",
        "QUA",
        "SEM",
        "L3",
        "FIN"
    ];

    for(const fase of fases){

        const resultadoRef = await getDoc(
            doc(dbMata,"resultados",fase)
        );

        if(!resultadoRef.exists()) continue;

        const resultados =
            resultadoRef.data().resultados || {};

        const palpiteSnap = await getDocs(
            query(
                collection(dbMata,"palpites"),
                where("email","==",email),
                where("fase","==",fase)
            )
        );

        palpiteSnap.forEach(docSnap=>{

            const palpites =
                docSnap.data().palpites || {};

            Object.keys(palpites).forEach(id=>{

                const p = palpites[id];
                const r = resultados[id];

                if(!r) return;

                if(
                    p.vencedor ===
                    r.vencedor.time
                ){

                    mata += 10;

                    if(
                        p.forma === r.forma
                    ){

                        mata += 10;

                    }

                }

            });

        });

    }

    // Extras
    let extras = 0;

    const oficialRef =
        await getDoc(
            doc(db,"extras_resultado","oficial")
        );

    if(oficialRef.exists()){

        const oficial =
            oficialRef.data();

        const extraRef =
            await getDoc(
                doc(db,"extras",email)
            );

        if(extraRef.exists()){

            const e =
                extraRef.data();

            if(compararSelecao(e.campeao,oficial.campeao))
                extras += 20;

            if(compararSelecao(e.vice,oficial.vice))
                extras += 10;

            if(compararNome(e.artilheiro,oficial.artilheiro))
                extras += 15;

            if(Number(e.golsBrasil)===Number(oficial.golsBrasil))
                extras += 10;

            if(normalizarTexto(e.faseBrasil)===normalizarTexto(oficial.faseBrasil))
                extras += 10;

        }

    }

    return{

        jogos:jogosPontos,

        mata,

        extras,

        compensacao:40,

        total:
            jogosPontos +
            mata +
            extras +
            40,

        placaresExatos,

        vencedores

    };

}

async function carregarResumo(email){

    const r =
        await calcularPontuacaoParticipante(email);

    document.getElementById("resumoParticipante").innerHTML = `

    <div class="resumoCard">

        <div>⚽ Jogos <strong>${r.jogos} pts</strong></div>

        <div>🏆 Mata <strong>${r.mata} pts</strong></div>

        <div>⭐ Extras <strong>${r.extras} pts</strong></div>

        <div>🎁 Compensação <strong>40 pts</strong></div>

        <div>🎯 Placares Exatos <strong>${r.placaresExatos}</strong></div>

        <div>✅ Vencedores <strong>${r.vencedores}</strong></div>

        <hr>

        <div style="font-size:30px;font-weight:bold;">

            TOTAL: ${r.total} pts

        </div>

    </div>

    `;

}

// ======================================
// JOGOS
// ======================================
async function carregarJogos(email){

    const lista = document.getElementById("listaJogos");

    lista.innerHTML = "";

    const jogosSnap = await getDocs(
        collection(db,"jogos")
    );

    const palpitesSnap = await getDocs(
        query(
            collection(db,"palpites"),
            where("usuario","==",email)
        )
    );

    const jogos = {};

    jogosSnap.forEach(docSnap=>{

        jogos[docSnap.data().id] = docSnap.data();

    });

    let html = `

    <table class="tabelaAuditoria">

        <thead>

            <tr>

                <th>Jogo</th>
                <th>Palpite</th>
                <th>Resultado</th>
                <th>Critério</th>
                <th>Pontos</th>

            </tr>

        </thead>

        <tbody>

    `;

    let totalPontos = 0;
    let placaresExatos = 0;
    let vencedores = 0;
    let jogosAvaliados = 0;

    palpitesSnap.forEach(docSnap=>{

        const p = docSnap.data();
        const jogo = jogos[p.jogoId];

        if(!jogo) return;

        let criterio = "Aguardando";
        let pontos = 0;
        let classe = "cinza";

        let resultado = "- x -";

        if(
            jogo.placarRealA != null &&
            jogo.placarRealB != null
        ){

            jogosAvaliados++;

            resultado =
                `${jogo.placarRealA} x ${jogo.placarRealB}`;

            const pA = Number(p.placarA);
            const pB = Number(p.placarB);

            const rA = Number(jogo.placarRealA);
            const rB = Number(jogo.placarRealB);

            const resultadoPalpite = Math.sign(pA-pB);
            const resultadoReal = Math.sign(rA-rB);

            const saldoPalpite = Math.abs(pA-pB);
            const saldoReal = Math.abs(rA-rB);

            if(pA===rA && pB===rB){

                criterio = "🏆 Placar Exato";
                pontos = 10;
                classe = "verde";

                placaresExatos++;
                vencedores++;

            }

            else if(
                resultadoReal===0 &&
                resultadoPalpite===0
            ){

                criterio = "🤝 Empate";
                pontos = 5;
                classe = "azul";

                vencedores++;

            }

            else if(

                resultadoPalpite===resultadoReal &&
                (pA===rA || pB===rB)

            ){

                criterio = "🟢 Vencedor + Gols";
                pontos = 7;
                classe = "verde";

                vencedores++;

            }

            else if(

                resultadoPalpite===resultadoReal &&
                saldoPalpite===saldoReal

            ){

                criterio = "🟡 Saldo de Gols";
                pontos = 5;
                classe = "laranja";

                vencedores++;

            }

            else if(resultadoPalpite===resultadoReal){

                criterio = "✅ Vencedor";
                pontos = 3;
                classe = "amarelo";

                vencedores++;

            }

            else{

                criterio = "❌ Errou";
                pontos = 0;
                classe = "vermelho";

            }

        }

        totalPontos += pontos;

        html += `

        <tr>

            <td>

                ${jogo.timeA} x ${jogo.timeB}

            </td>

            <td>

                ${p.placarA} x ${p.placarB}

            </td>

            <td>

                ${resultado}

            </td>

            <td class="${classe}">

                ${criterio}

            </td>

            <td>

                <strong>${pontos}</strong>

            </td>

        </tr>

        `;

    });

    html += `

        </tbody>

    </table>

    <div class="resumoJogos">

        <div>⚽ Jogos Avaliados <strong>${jogosAvaliados}</strong></div>

        <div>🏆 Placares Exatos <strong>${placaresExatos}</strong></div>

        <div>✅ Vencedores <strong>${vencedores}</strong></div>

        <div>🎯 Pontos dos Jogos <strong>${totalPontos} pts</strong></div>

    </div>

    `;

    lista.innerHTML = html;

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

    palpite: palpite.golsBrasil,

    oficial: oficial.golsBrasil,

    pontos:
        Number(palpite.golsBrasil) === Number(oficial.golsBrasil)
        ? 10
        : Math.abs(
            Number(palpite.golsBrasil) -
            Number(oficial.golsBrasil)
          ) === 1
          ? 5
          : 0
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

                ${item.pontos > 0 ? "✔" : "❌"}
                ${item.pontos} pts

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


// ======================================
// ABAS
// ======================================

function abrirAbaAuditoria(nome){

    document.getElementById("abaDados").style.display = "none";
    document.getElementById("abaResumo").style.display = "none";
    document.getElementById("abaJogos").style.display = "none";
    document.getElementById("abaMata").style.display = "none";
    document.getElementById("abaExtras").style.display = "none";

    document.getElementById("btnDados").classList.remove("ativa");
    document.getElementById("btnResumo").classList.remove("ativa");
    document.getElementById("btnJogos").classList.remove("ativa");
    document.getElementById("btnMata").classList.remove("ativa");
    document.getElementById("btnExtras").classList.remove("ativa");

    switch(nome){

        case "dados":
            document.getElementById("abaDados").style.display = "block";
            document.getElementById("btnDados").classList.add("ativa");
            break;

        case "resumo":
            document.getElementById("abaResumo").style.display = "block";
            document.getElementById("btnResumo").classList.add("ativa");
            break;

        case "jogos":
            document.getElementById("abaJogos").style.display = "block";
            document.getElementById("btnJogos").classList.add("ativa");
            break;

        case "mata":
            document.getElementById("abaMata").style.display = "block";
            document.getElementById("btnMata").classList.add("ativa");
            break;

        case "extras":
            document.getElementById("abaExtras").style.display = "block";
            document.getElementById("btnExtras").classList.add("ativa");
            break;

    }

}

window.abrirAbaAuditoria = abrirAbaAuditoria;