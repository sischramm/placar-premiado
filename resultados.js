// =================================================
// RESULTADOS OFICIAIS
// =================================================



// ======================================================
// ABRE A CENTRAL DE RESULTADOS
// ======================================================

function abrirResultados(){

    const aba =
        document.getElementById("abaResultados");

    if(!aba) return;

    aba.innerHTML = `

    <div class="resultado-container">

        <div class="resultado-topo">

            <h2>⚽ Central de Resultados</h2>

            <p>
                Administração Oficial da Copa do Mundo FIFA 2026
            </p>

        </div>

        <div class="resultado-dashboard">

            <div class="dash-card">

                <span>⚽ Jogos</span>

                <strong id="dashJogos">0</strong>

            </div>

            <div class="dash-card">

                <span>✅ Finalizados</span>

                <strong id="dashFinalizados">0</strong>

            </div>

            <div class="dash-card">

                <span>⏳ Pendentes</span>

                <strong id="dashPendentes">0</strong>

            </div>

            <div class="dash-card">

                <span>🏆 Fase</span>

                <strong id="dashFase">Fase de Grupos</strong>

            </div>

        </div>

        <div class="resultado-filtros">

            <label for="filtroFase">

                Fase

            </label>

            <select
                id="filtroFase"
                onchange="carregarResultadosNovo()">

                <option value="GRUPOS">
                    ⚽ Fase de Grupos
                </option>

                <option value="SEG">
                    🏆 16 Avos
                </option>

                <option value="OIT">
                    🏆 Oitavas
                </option>

                <option value="QUA">
                    🏆 Quartas
                </option>

                <option value="SEM">
                    🏆 Semifinal
                </option>

                <option value="TER">
                    🥉 3º Lugar
                </option>

                <option value="FIN">
                    🏆 Final
                </option>

            </select>

        </div>

        <div id="gradeResultados">

        </div>

    </div>

    `;

    carregarResultadosNovo();

}

// ======================================================
// RETORNA A URL DA BANDEIRA
// ======================================================

function obterBandeira(pais){

    if(!window.FLAGS)
        return "";

    if(!pais)
        return "";

    const codigo =
        window.FLAGS[String(pais).trim()];

    if(!codigo)
        return "";

    return `https://flagcdn.com/w80/${codigo}.png`;

}

// ======================================================
// FORMATA DATA E HORA
// ======================================================

function formatarDataHora(jogo){

    // ==========================
    // FIREBASE (FASE DE GRUPOS)
    // ==========================

    if(jogo.dataHora){

        const d = new Date(
            jogo.dataHora.replace(" ","T")
        );

        return{

            data:d.toLocaleDateString(
                "pt-BR"
            ),

            hora:d.toLocaleTimeString(
                "pt-BR",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            )

        };

    }

    // ==========================
    // MATA-MATA
    // ==========================

    if(jogo.data && jogo.hora){

        return{

            data:jogo.data,

            hora:jogo.hora

        };

    }

    // ==========================
    // PADRÃO
    // ==========================

    return{

        data:"",

        hora:""

    };

}

// ======================================================
// CARREGA JOGOS DA FASE DE GRUPOS
// ======================================================

async function carregarJogosGrupo(){

    try{

        const snap =
            await getDocs(
                collection(
                    db,
                    "jogos"
                )
            );

        const jogos =
            snap.docs
                .map(doc=>({

                    origem:"GRUPOS",

                    id:doc.id,

                    ...doc.data()

                }))
                .sort((a,b)=>{

                    const da =
                        new Date(
                            a.dataHora.replace(" ","T")
                        );

                    const dbb =
                        new Date(
                            b.dataHora.replace(" ","T")
                        );

                    return da-dbb;

                });

        return jogos;

    }catch(erro){

        console.error(
            "Erro ao carregar jogos da fase de grupos:",
            erro
        );

        return [];

    }

}

// ======================================================
// CARREGA JOGOS DO MATA-MATA
// ======================================================

async function carregarJogosMata(fase){

    try{

        const confrontos =
            JOGOS_MATA[fase] || [];

        const ref =
            window.doc(
                window.dbMata,
                "resultados",
                fase
            );

        const snap =
            await window.getDoc(ref);

        const dados =
            snap.exists()
            ? snap.data().resultados || {}
            : {};

        return confrontos.map(jogo=>{

            const salvo =
                dados[jogo.jogo] || {};

            return{

                origem:"MATA",

                id:String(jogo.jogo),

                jogo:jogo.jogo,

                fase:jogo.fase,

                grupo:jogo.fase,

                ordem:jogo.ordem,

                timeA:
                    salvo.timeA ??
                    jogo.timeA,

                nomeA:
                    salvo.nomeA ??
                    jogo.nomeA,

                timeB:
                    salvo.timeB ??
                    jogo.timeB,

                nomeB:
                    salvo.nomeB ??
                    jogo.nomeB,

                data:jogo.data,

                hora:jogo.hora,

                vencedor:
                    salvo.vencedor ?? null,

                forma:
                    salvo.forma ?? "N",

                atualizadoEm:
                    salvo.atualizadoEm ?? null

            };

        });

    }catch(erro){

        console.error(
            "Erro ao carregar mata:",
            erro
        );

        return [];

    }

}

// ======================================================
// ATUALIZA DASHBOARD
// ======================================================

// ======================================================
// ATUALIZA DASHBOARD
// ======================================================

function atualizarDashboard(jogos,fase){

    const total = jogos.length;

    const finalizados = jogos.filter(j=>{

        if(fase=="GRUPOS"){

            return (

                j.placarRealA !== null &&
                j.placarRealA !== undefined &&

                j.placarRealB !== null &&
                j.placarRealB !== undefined

            );

        }

        return j.vencedor != null;

    }).length;

    const pendentes =
        total-finalizados;

    document.getElementById(
        "dashJogos"
    ).innerHTML = total;

    document.getElementById(
        "dashFinalizados"
    ).innerHTML = finalizados;

    document.getElementById(
        "dashPendentes"
    ).innerHTML = pendentes;

    const nomes = {

        GRUPOS:"Fase de Grupos",

        SEG:"16 Avos",

        OIT:"Oitavas",

        QUA:"Quartas",

        SEM:"Semifinal",

        L3:"3º Lugar",

        FIN:"Final"

    };

    document.getElementById(
        "dashFase"
    ).innerHTML =
        nomes[fase] || fase;

}

// ======================================================
// ESCOLHAS DO ADMINISTRADOR
// ======================================================

const escolhasResultado = {};

// ======================================================
// SELECIONA O VENCEDOR (ADMIN)
// ======================================================

function selecionarVencedorResultado(jogo,lado){

    document
        .querySelectorAll(`#resultado${jogo} .time`)
        .forEach(e=>e.classList.remove("selecionado"));

    document
        .getElementById("R"+lado+jogo)
        ?.classList.add("selecionado");

    document
        .getElementById("formasR"+jogo)
        .style.display="flex";

    escolhasResultado[jogo] ??= {};

    escolhasResultado[jogo].lado = lado;

}

// ======================================================
// SELECIONA A FORMA
// ======================================================

function selecionarFormaResultado(jogo,forma){

    escolhasResultado[jogo] ??= {};

    escolhasResultado[jogo].forma = forma;

    document
        .querySelectorAll(`#formasR${jogo} button`)
        .forEach(btn=>btn.classList.remove("formaSelecionada"));

    event.target.classList.add("formaSelecionada");

}

// ======================================================
// CRIA CARD DE RESULTADO
// ======================================================

function criarCardResultado(jogo){

    const dt = formatarDataHora(jogo);

    const nomeA = jogo.nomeA || jogo.timeA;

    const nomeB = jogo.nomeB || jogo.timeB;

    const bandeiraA = obterBandeira(jogo.timeA);

    const bandeiraB = obterBandeira(jogo.timeB);

    const titulo =
        jogo.origem=="MATA"
            ? formatarFase(jogo.fase)
            : "Grupo " + jogo.grupo;

    const tipoSelecionado =
        jogo.forma || "N";

    const div =
        document.createElement("div");

    div.className="cardResultadoNovo";

    div.id="resultado"+jogo.id;

    // ==================================================
    // FASE DE GRUPOS
    // ==================================================

    if(jogo.origem=="GRUPOS"){

        div.innerHTML=`

        <div class="cabResultado">

            <span>🏆 ${titulo}</span>

            <span>

                📅 ${dt.data}<br>
                🕒 ${dt.hora}

            </span>

        </div>

        <div class="linhaTime">

            <div class="timeInfo">

                ${
                    bandeiraA
                    ?
                    `<img class="bandeiraResultado"
                    src="${bandeiraA}">`
                    :
                    ""
                }

                <span>${nomeA}</span>

            </div>

            <input
                class="placarInput"
                id="realA_${jogo.id}"
                type="number"
                min="0"
                value="${jogo.placarRealA ?? ""}">

        </div>

        <div class="xResultado">

            ×

        </div>

        <div class="linhaTime">

            <div class="timeInfo">

                ${
                    bandeiraB
                    ?
                    `<img class="bandeiraResultado"
                    src="${bandeiraB}">`
                    :
                    ""
                }

                <span>${nomeB}</span>

            </div>

            <input
                class="placarInput"
                id="realB_${jogo.id}"
                type="number"
                min="0"
                value="${jogo.placarRealB ?? ""}">

        </div>

        <button
            class="btnSalvarNovo"
            onclick="salvarResultadoNovo('${jogo.id}','GRUPOS')">

            💾 Salvar

        </button>

        `;

        return div;

    }

    // ==================================================
    // MATA-MATA
    // ==================================================

    div.innerHTML=`

        <div class="cabResultado">

            <span>🏆 ${titulo}</span>

            <span>

                📅 ${dt.data}<br>
                🕒 ${dt.hora}

            </span>

        </div>

        <div class="times">

            <div
                class="time"
                id="RA${jogo.id}"
                onclick="selecionarVencedorResultado('${jogo.id}','A')">

                <img
                    class="flag"
                    src="https://flagcdn.com/w80/${FLAGS[jogo.timeA] || "un"}.png">

                <span>${nomeA}</span>

            </div>

            <div class="vs">

                X

            </div>

            <div
                class="time"
                id="RB${jogo.id}"
                onclick="selecionarVencedorResultado('${jogo.id}','B')">

                <img
                    class="flag"
                    src="https://flagcdn.com/w80/${FLAGS[jogo.timeB] || "un"}.png">

                <span>${nomeB}</span>

            </div>

        </div>

        <div
            class="formas"
            id="formasR${jogo.id}"
            style="display:none;">

            <button
                class="${tipoSelecionado=="N"?"formaSelecionada":""}"
                onclick="selecionarFormaResultado('${jogo.id}','N')">

                Tempo Normal

            </button>

            <button
                class="${tipoSelecionado=="P"?"formaSelecionada":""}"
                onclick="selecionarFormaResultado('${jogo.id}','P')">

                Prorrogação

            </button>

            <button
                class="${tipoSelecionado=="PE"?"formaSelecionada":""}"
                onclick="selecionarFormaResultado('${jogo.id}','PE')">

                Pênaltis

            </button>

        </div>

        <button
            class="btnSalvarNovo"
            onclick="salvarResultadoNovo('${jogo.id}','MATA')">

            💾 Salvar

        </button>

    `;

    return div;

}

// ======================================================
// FORMATA FASE
// ======================================================

function formatarFase(fase){

    const fases = {

        SEG:"16 Avos",

        OIT:"Oitavas",

        QUA:"Quartas",

        SEM:"Semifinal",

        TER:"3º Lugar",

        FIN:"Final"

    };

    return fases[fase] || fase;

}

// ======================================================
// TIPO DO RESULTADO
// ======================================================

const TIPO_RESULTADO = {};

function selecionarTipoResultado(id,tipo,botao){

    TIPO_RESULTADO[id]=tipo;

    const botoes =
        document.querySelectorAll(
            `[data-jogo="${id}"]`
        );

    botoes.forEach(btn=>
        btn.classList.remove("ativo")
    );

    botao.classList.add("ativo");

}

// ======================================================
// CARREGA RESULTADOS
// ======================================================

async function carregarResultadosNovo(){

    const faseSelecionada =
        document.getElementById("filtroFase")?.value || "GRUPOS";

    let jogos = [];

    if(faseSelecionada=="GRUPOS"){

        jogos =
            await carregarJogosGrupo();

    }else{

        jogos =
            await carregarJogosMata(
                faseSelecionada
            );

    }

    atualizarDashboard(
        jogos,
        faseSelecionada
    );

    const grade =
        document.getElementById(
            "gradeResultados"
        );

    if(!grade) return;

    grade.innerHTML="";

    jogos.forEach(jogo=>{

        grade.appendChild(
            criarCardResultado(jogo)
        );

    });

    // =====================================
    // RESTAURA O MATA-MATA JÁ SALVO
    // =====================================

    if(faseSelecionada!="GRUPOS"){

        jogos.forEach(jogo=>{

            if(!jogo.vencedor) return;

            escolhasResultado[jogo.id] = {

                lado:
                    jogo.vencedor.time == jogo.timeA
                        ? "A"
                        : "B",

                forma:
                    jogo.forma || "N"

            };

            selecionarVencedorResultado(

                jogo.id,

                escolhasResultado[jogo.id].lado

            );

            selecionarFormaResultado(

                jogo.id,

                escolhasResultado[jogo.id].forma

            );

        });

    }

}

// ======================================================
// SALVAR RESULTADO
// ======================================================

async function salvarResultadoNovo(id,origem){

    try{

        const placarA =
            parseInt(
                document.getElementById(
                    `realA_${id}`
                ).value
            );

        const placarB =
            parseInt(
                document.getElementById(
                    `realB_${id}`
                ).value
            );

        if(

            isNaN(placarA) ||

            isNaN(placarB)

        ){

            alert(
                "Informe os dois placares."
            );

            return;

        }

        // =====================================
        // FASE DE GRUPOS
        // =====================================

        if(origem=="GRUPOS"){

            await updateDoc(

                doc(
                    db,
                    "jogos",
                    id
                ),

                {

                    placarRealA:placarA,

                    placarRealB:placarB,

                    atualizadoEm:
                        serverTimestamp()

                }

            );

        }


// =====================================
// MATA-MATA
// =====================================

else{

    const fase =
        document.getElementById("filtroFase").value;

    const confronto =
        JOGOS_MATA[fase]
            .find(j => j.jogo == Number(id));

    if(!confronto){

        alert("Confronto não encontrado.");

        return;

    }

    const escolha =
        escolhasResultado[id];

    if(!escolha){

        alert("Selecione o vencedor.");

        return;

    }

    const vencedor =

        escolha.lado=="A"

        ?{

            time:confronto.timeA,

            nome:confronto.nomeA

        }

        :{

            time:confronto.timeB,

            nome:confronto.nomeB

        };

const perdedor =

    escolha.lado=="A"

    ?{

        time:confronto.timeB,

        nome:confronto.nomeB

    }

    :{

        time:confronto.timeA,

        nome:confronto.nomeA

    };


    const ref =
        window.doc(
            window.dbMata,
            "resultados",
            fase
        );

    const snap =
        await window.getDoc(ref);

    let resultados = {};

    if(snap.exists()){

        resultados =
            snap.data().resultados || {};

    }

    resultados[id]={

        vencedor,

        forma:
            escolha.forma || "N",

        atualizadoEm:
            new Date().toISOString()

    };

    await window.setDoc(

        ref,

        {

            fase,

            resultados,

            atualizadoEm:
                window.serverTimestamp()

        },

        {

            merge:true

        }

    );

    // ===========================
    // AVANÇA O VENCEDOR
    // ===========================

    await atualizarProximoConfronto(

        Number(id),

        vencedor

    );

await atualizarTerceiroLugar(

    Number(id),

    perdedor

);

}

const botao =
    document.querySelector(
        `button[onclick="salvarResultadoNovo('${id}','${origem}')"]`
    );

if(botao){

    botao.innerHTML =
        "✅ Salvo";

    botao.style.background =
        "#0A8F3C";

}

carregarResultadosNovo();

}catch(erro){

    console.error(erro);

    alert(
        "Erro ao salvar resultado."
    );

}

}

// ======================================================
// SELECIONA VENCEDOR
// ======================================================

function selecionarVencedorResultado(jogo,lado){

    document
        .querySelectorAll(`#resultado${jogo} .time`)
        .forEach(e=>e.classList.remove("selecionado"));

    document
        .getElementById("R"+lado+jogo)
        ?.classList.add("selecionado");

    document
        .getElementById("formasR"+jogo)
        .style.display="flex";

    escolhasResultado[jogo] ??={};

    escolhasResultado[jogo].lado = lado;

}

// ======================================================
// SELECIONA FORMA
// ======================================================

function selecionarFormaResultado(jogo,forma){

    escolhasResultado[jogo] ??={};

    escolhasResultado[jogo].forma = forma;

    document
        .querySelectorAll(`#formasR${jogo} button`)
        .forEach(btn=>btn.classList.remove("formaSelecionada"));

    let indice = 0;

    if(forma=="N") indice = 0;
    if(forma=="P") indice = 1;
    if(forma=="PE") indice = 2;

    document
        .querySelectorAll(`#formasR${jogo} button`)[indice]
        ?.classList.add("formaSelecionada");

}        
