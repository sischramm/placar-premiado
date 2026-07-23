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

    await carregarResumo();

    await carregarJogos();

    await carregarMata();

    await carregarExtras();

    abrirAbaAuditoria("dados");


}

window.abrirAuditoria = abrirAuditoria;

// ======================================
// RESUMO
// ======================================

async function carregarResumo(){

    const jogosSnap = await getDocs(
        collection(db,"jogos")
    );

    const palpitesSnap = await getDocs(

        query(

            collection(
                db,
                "palpites"
            ),

            where(
                "usuario",
                "==",
                participanteAtual.email
            )

        )

    );

    const jogos = {};

    jogosSnap.forEach(docSnap=>{

        const jogo =
            docSnap.data();

        jogos[jogo.id] = jogo;

    });

    let pontosJogos = 0;
    let pontosMata = 0;
    let pontosExtras = 0;

    let placaresExatos = 0;
    let vencedores = 0;
    let acertouCampeao = 0;

    palpitesSnap.forEach(docSnap=>{

        const p = docSnap.data();

        const jogo =
            jogos[p.jogoId];

        if(!jogo)
            return;

        // Os quatro primeiros jogos foram compensados
if(Number(p.jogoId) <= 4){
    return;
}

        if(
            jogo.placarRealA == null ||
            jogo.placarRealB == null
        ){
            return;
        }

        const pA =
            Number(p.placarA);

        const pB =
            Number(p.placarB);

        const rA =
            Number(jogo.placarRealA);

        const rB =
            Number(jogo.placarRealB);

        const resultadoPalpite =
            Math.sign(pA-pB);

        const resultadoReal =
            Math.sign(rA-rB);

        const saldoPalpite =
            Math.abs(pA-pB);

        const saldoReal =
            Math.abs(rA-rB);

        if(
            pA===rA &&
            pB===rB
        ){

            pontosJogos += 10;

            placaresExatos++;

            vencedores++;

        }

        else if(

            resultadoReal===0 &&
            resultadoPalpite===0

        ){

            pontosJogos += 5;

            vencedores++;

        }

        else if(

            resultadoPalpite===resultadoReal &&

            (
                pA===rA ||
                pB===rB
            )

        ){

            pontosJogos += 7;

            vencedores++;

        }

        else if(

            resultadoPalpite===resultadoReal &&

            saldoPalpite===saldoReal

        ){

            pontosJogos += 5;

            vencedores++;

        }

        else if(

            resultadoPalpite===resultadoReal

        ){

            pontosJogos += 3;

            vencedores++;

        }

    });

    const fases = [

        "SEG",
        "OIT",
        "QUA",
        "SEM",
        "L3",
        "FIN"

    ];

    for(const fase of fases){

        const palpitesSnap = await getDocs(

            query(

                collection(
                    dbMata,
                    "palpites"
                ),

                where(
                    "email",
                    "==",
                    participanteAtual.email
                ),

                where(
                    "fase",
                    "==",
                    fase
                )

            )

        );

        if(palpitesSnap.empty)
            continue;

        const resultadoRef = await getDoc(

            doc(
                dbMata,
                "resultados",
                fase
            )

        );

        if(!resultadoRef.exists())
            continue;

        const resultados =
            resultadoRef.data().resultados || {};

        palpitesSnap.forEach(docSnap=>{

            const palpites =
                docSnap.data().palpites || {};

            Object.keys(palpites).forEach(id=>{

                const p =
                    palpites[id];

                const r =
                    resultados[id];

                if(
                    !r ||
                    !r.vencedor ||
                    !r.vencedor.time
                ){
                    return;
                }

                if(
                    p.vencedor ===
                    r.vencedor.time
                ){

                    pontosMata += 10;

                    vencedores++;

                    if(
                        p.forma ===
                        r.forma
                    ){

                        pontosMata += 10;

                    }

                }

            });

        });

    }

    const oficialRef = await getDoc(

        doc(
            db,
            "extras_resultado",
            "oficial"
        )

    );

    if(oficialRef.exists()){

        const usuarioRef = await getDoc(

            doc(
                db,
                "extras",
                participanteAtual.email
            )

        );

        if(usuarioRef.exists()){

            const oficial =
                oficialRef.data();

            const palpite =
                usuarioRef.data();

            // Campeão
            if(
                compararSelecao(
                    palpite.campeao,
                    oficial.campeao
                )
            ){

                pontosExtras += 20;
                acertouCampeao++;

            }

            // Vice
            if(
                compararSelecao(
                    palpite.vice,
                    oficial.vice
                )
            ){

                pontosExtras += 10;

            }

            // Artilheiro
            if(
                compararNome(
                    palpite.artilheiro,
                    oficial.artilheiro
                )
            ){

                pontosExtras += 15;

            }

            // Gols do Brasil
            
const diferenca = Math.abs(
    Number(palpite.golsBrasil) -
    Number(oficial.golsBrasil)
);

if(diferenca === 0){

    pontosExtras += 10;

}else if(diferenca === 1){

    pontosExtras += 5;

}
            // Fase do Brasil
            if(

                normalizarTexto(
                    palpite.faseBrasil
                ) ===

                normalizarTexto(
                    oficial.faseBrasil
                )

            ){

                pontosExtras += 10;

            }

        }

    }

    const compensacao = 40;

    const total =
        pontosJogos +
        pontosMata +
        pontosExtras +
        compensacao;

    document.getElementById(
        "resumoParticipante"
    ).innerHTML = `

        <div class="resumoCard">

            <div>

                ⚽ Jogos

                <strong>

                    ${pontosJogos} pts

                </strong>

            </div>

            <div>

                🏆 Mata-mata

                <strong>

                    ${pontosMata} pts

                </strong>

            </div>

            <div>

                ⭐ Extras

                <strong>

                    ${pontosExtras} pts

                </strong>

            </div>

            <div>

                🎁 Compensação

                <strong>

                    ${compensacao} pts

                </strong>

            </div>

            <hr>

            <div>

                🎯 Placares Exatos

                <strong>

                    ${placaresExatos}

                </strong>

            </div>

            <div>

                ✅ Vencedores

                <strong>

                    ${vencedores}

                </strong>

            </div>

            <div>

                👑 Campeão

                <strong>

                    ${acertouCampeao}

                </strong>

            </div>

            <hr>

            <div
                style="
                    font-size:30px;
                    font-weight:bold;
                    text-align:center;
                "
            >

                TOTAL: ${total} pts

            </div>

        </div>

    `;

}




// ======================================
// JOGOS
// ======================================
async function carregarJogos(){

    const lista =
        document.getElementById(
            "listaJogos"
        );

    lista.innerHTML = "";

    const jogosSnap =
        await getDocs(
            collection(db,"jogos")
        );

    const palpitesSnap =
        await getDocs(

            query(

                collection(db,"palpites"),

                where(
                    "usuario",
                    "==",
                    participanteAtual.email
                )

            )

        );

    const jogos = {};

    jogosSnap.forEach(docSnap=>{

        const jogo =
            docSnap.data();

        jogos[jogo.id] = jogo;

    });

    let totalPontos = 0;

    let jogosAvaliados = 0;

    let placaresExatos = 0;

    let vencedores = 0;

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

    palpitesSnap.forEach(docSnap=>{

    const p =
        docSnap.data();

    const jogo =
        jogos[p.jogoId];

    if(!jogo)
        return;

    // Os 4 primeiros jogos foram compensados com +40 pontos
    if(Number(p.jogoId) <= 4){
        return;
    }

    let criterio = "Aguardando";

    let pontos = 0;

        if(
            jogo.placarRealA != null &&
            jogo.placarRealB != null
        ){

            jogosAvaliados++;

            const pA = Number(p.placarA);
            const pB = Number(p.placarB);

            const rA = Number(jogo.placarRealA);
            const rB = Number(jogo.placarRealB);

            const resultadoPalpite =
                Math.sign(pA - pB);

            const resultadoReal =
                Math.sign(rA - rB);

            const saldoPalpite =
                Math.abs(pA - pB);

            const saldoReal =
                Math.abs(rA - rB);

            if(
                pA === rA &&
                pB === rB
            ){

                criterio = "🏆 Placar Exato";
                pontos = 10;

                placaresExatos++;
                vencedores++;

            }

            else if(

                resultadoReal === 0 &&
                resultadoPalpite === 0

            ){

                criterio = "🤝 Empate";
                pontos = 5;

                vencedores++;

            }

            else if(

                resultadoPalpite === resultadoReal &&

                (
                    pA === rA ||
                    pB === rB
                )

            ){

                criterio = "🟢 Vencedor + Gols";
                pontos = 7;

                vencedores++;

            }

            else if(

                resultadoPalpite === resultadoReal &&

                saldoPalpite === saldoReal

            ){

                criterio = "🟡 Saldo de Gols";
                pontos = 5;

                vencedores++;

            }

            else if(

                resultadoPalpite === resultadoReal

            ){

                criterio = "✅ Vencedor";
                pontos = 3;

                vencedores++;

            }

            else{

                criterio = "❌ Errou";

            }

            totalPontos += pontos;

        }


        html += `

            <tr>

                <td>

                    ${jogo.timeA} x ${jogo.timeB}

                </td>

                <td>

                    ${p.placarA} x ${p.placarB}

                </td>

                <td>

                    ${
                        jogo.placarRealA == null
                        ?
                        "- x -"
                        :
                        `${jogo.placarRealA} x ${jogo.placarRealB}`
                    }

                </td>

                <td>

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

            <div>

                ⚽ Jogos Avaliados

                <strong>${jogosAvaliados}</strong>

            </div>

            <div>

                🏆 Placares Exatos

                <strong>${placaresExatos}</strong>

            </div>

            <div>

                ✅ Vencedores

                <strong>${vencedores}</strong>

            </div>

            <div>

                🎯 Pontos dos Jogos

                <strong>${totalPontos} pts</strong>

            </div>

        </div>

    `;

    lista.innerHTML = html;

}
// ======================================
// MATA-MATA
// ======================================

async function carregarMata(){

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

        const palpitesSnap =
            await getDocs(

                query(

                    collection(
                        dbMata,
                        "palpites"
                    ),

                    where(
                        "email",
                        "==",
                        participanteAtual.email
                    ),

                    where(
                        "fase",
                        "==",
                        fase
                    )

                )

            );

        if(palpitesSnap.empty)
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

        palpitesSnap.forEach(docSnap=>{

            const dados =
                docSnap.data();

            const palpites =
                dados.palpites || {};

            Object.keys(palpites).forEach(id=>{

                const p =
                    palpites[id];

                const r =
                    resultados[id];

                let pontos = 0;

                let criterio =
                    "Aguardando";

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

                        criterio =
                            "Acertou vencedor";

                        if(

                            p.forma ===
                            r.forma

                        ){

                            pontos += 10;

                            criterio =
                                "Vencedor + Forma";

                        }

                    }

                    else{

                        criterio =
                            "Errou";

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

                            <strong>Critério:</strong>

                            ${criterio}

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

async function carregarExtras(){

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

                Resultado oficial ainda
                não cadastrado.

            </p>

        `;

        return;

    }

    const usuarioRef =
        await getDoc(

            doc(
                db,
                "extras",
                participanteAtual.email
            )

        );

    if(!usuarioRef.exists()){

        div.innerHTML = `

            <p>

                Participante não enviou
                palpites extras.

            </p>

        `;

        return;

    }

    const oficial =
        oficialRef.data();

    const palpite =
        usuarioRef.data();

    const itens = [

        {

            titulo:"🏆 Campeão",

            palpite:palpite.campeao,

            oficial:oficial.campeao,

            pontos:

                compararSelecao(
                    palpite.campeao,
                    oficial.campeao
                )

                ?

                20

                :

                0

        },

        {

            titulo:"🥈 Vice",

            palpite:palpite.vice,

            oficial:oficial.vice,

            pontos:

                compararSelecao(
                    palpite.vice,
                    oficial.vice
                )

                ?

                10

                :

                0

        },

        {

            titulo:"👟 Artilheiro",

            palpite:palpite.artilheiro,

            oficial:oficial.artilheiro,

            pontos:

                compararNome(
                    palpite.artilheiro,
                    oficial.artilheiro
                )

                ?

                15

                :

                0

        },

       {

    titulo:"🇧🇷 Gols do Brasil",

    palpite: palpite.golsBrasil,

    oficial: oficial.golsBrasil,

    pontos:(()=>{

        const diferenca = Math.abs(

            Number(palpite.golsBrasil) -

            Number(oficial.golsBrasil)

        );

        if(diferenca === 0)
            return 10;

        if(diferenca === 1)
            return 5;

        return 0;

    })()

},

        {

            titulo:"🇧🇷 Fase do Brasil",

            palpite:palpite.faseBrasil,

            oficial:oficial.faseBrasil,

            pontos:

                normalizarTexto(
                    palpite.faseBrasil
                )

                ===

                normalizarTexto(
                    oficial.faseBrasil
                )

                ?

                10

                :

                0

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

                    ${item.palpite || "-"}

                </p>

                <p>

                    <strong>Oficial:</strong>

                    ${item.oficial || "-"}

                </p>

                <p>

                    <strong>Pontos:</strong>

                    ${item.pontos}

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

                TOTAL EXTRAS

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

    const abas = {

        dados: document.getElementById("abaDados"),

        resumo: document.getElementById("abaResumo"),

        jogos: document.getElementById("abaJogos"),

        mata: document.getElementById("abaMata"),

        extras: document.getElementById("abaExtras")

    };

    const botoes = {

        dados: document.getElementById("btnDados"),

        resumo: document.getElementById("btnResumo"),

        jogos: document.getElementById("btnJogos"),

        mata: document.getElementById("btnMata"),

        extras: document.getElementById("btnExtras")

    };

    Object.values(abas).forEach(aba=>{

        if(aba)
            aba.style.display = "none";

    });

    Object.values(botoes).forEach(botao=>{

        if(botao)
            botao.classList.remove("ativa");

    });

    if(abas[nome])
        abas[nome].style.display = "block";

    if(botoes[nome])
        botoes[nome].classList.add("ativa");

}

window.abrirAbaAuditoria = abrirAbaAuditoria;