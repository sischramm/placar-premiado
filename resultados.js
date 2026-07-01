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

            const resultado =
                dados[jogo.jogo] || {};

            // ==========================
            // Mantém o tipo selecionado
            // ==========================

            if(resultado.decisao){

                TIPO_RESULTADO[String(jogo.jogo)] =
                    resultado.decisao;

            }

            return{

                origem:"MATA",

                id:String(jogo.jogo),

                jogo:jogo.jogo,

                fase:jogo.fase,

                grupo:jogo.fase,

                timeA:jogo.timeA,

                nomeA:jogo.nomeA,

                timeB:jogo.timeB,

                nomeB:jogo.nomeB,

                data:jogo.data,

                hora:jogo.hora,

                placarRealA:
                    resultado.placarRealA ?? null,

                placarRealB:
                    resultado.placarRealB ?? null,

                decisao:
                    resultado.decisao ?? "TN"

            };

        });

    }catch(erro){

        console.error(
            "Erro ao carregar Mata-Mata:",
            erro
        );

        return [];

    }

}

// ======================================================
// ATUALIZA DASHBOARD
// ======================================================

function atualizarDashboard(jogos,fase){

    const total =
        jogos.length;

    const finalizados =
        jogos.filter(j=>

            j.placarRealA !== null &&
            j.placarRealA !== undefined &&

            j.placarRealB !== null &&
            j.placarRealB !== undefined

        ).length;

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

        TER:"3º Lugar",

        FIN:"Final"

    };

    document.getElementById(
        "dashFase"
    ).innerHTML =
        nomes[fase] || fase;

}

// ======================================================
// CRIA CARD DE RESULTADO
// ======================================================

function criarCardResultado(jogo){

    const dt =
        formatarDataHora(jogo);

    const nomeA =
        jogo.nomeA || jogo.timeA;

    const nomeB =
        jogo.nomeB || jogo.timeB;

    const bandeiraA =
        obterBandeira(jogo.timeA);

    const bandeiraB =
        obterBandeira(jogo.timeB);

    const titulo =

        jogo.fase &&
        jogo.origem=="MATA"

        ? formatarFase(jogo.fase)

        : "Grupo " + jogo.grupo;

    const tipoSelecionado =
        jogo.decisao || "TN";

    const div =
        document.createElement("div");

    div.className =
        "cardResultadoNovo";

    div.innerHTML = `

        <div class="cabResultado">

            <span>

                🏆 ${titulo}

            </span>

            <span>

                📅 ${dt.data}

                <br>

                🕒 ${dt.hora}

            </span>

        </div>

        <div class="linhaTime">

            <div class="timeInfo">

                ${
                    bandeiraA
                    ?
                    `<img
                        class="bandeiraResultado"
                        src="${bandeiraA}"
                        alt="${nomeA}"
                    >`
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
                value="${jogo.placarRealA ?? ""}"
            >

        </div>

        <div class="xResultado">

            ×

        </div>

        <div class="linhaTime">

            <div class="timeInfo">

                ${
                    bandeiraB
                    ?
                    `<img
                        class="bandeiraResultado"
                        src="${bandeiraB}"
                        alt="${nomeB}"
                    >`
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
                value="${jogo.placarRealB ?? ""}"
            >

        </div>

        ${
            jogo.origem=="MATA"

            ?

            `

            <div class="tipoResultado">

                <button
                    class="btnTipo ${tipoSelecionado=="TN" ? "ativo" : ""}"
                    data-jogo="${jogo.id}"
                    data-tipo="TN"
                    onclick="selecionarTipoResultado('${jogo.id}','TN',this)"
                >
                    Tempo Normal
                </button>

                <button
                    class="btnTipo ${tipoSelecionado=="PR" ? "ativo" : ""}"
                    data-jogo="${jogo.id}"
                    data-tipo="PR"
                    onclick="selecionarTipoResultado('${jogo.id}','PR',this)"
                >
                    Prorrogação
                </button>

                <button
                    class="btnTipo ${tipoSelecionado=="PE" ? "ativo" : ""}"
                    data-jogo="${jogo.id}"
                    data-tipo="PE"
                    onclick="selecionarTipoResultado('${jogo.id}','PE',this)"
                >
                    Pênaltis
                </button>

            </div>

            `

            :

            ""

        }

        <button
            class="btnSalvarNovo"
            onclick="salvarResultadoNovo('${jogo.id}','${jogo.origem}')"
        >

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

            criarCardResultado(
                jogo
            )

        );

    });

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
        escolhas[id];

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
            escolha.forma || "N"

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

    await avancarVencedor(

        Number(id),

        vencedor

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

// utilitários
