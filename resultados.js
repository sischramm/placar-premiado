// ======================================
// CENTRAL DE RESULTADOS
// ======================================

function abrirResultados(){

    const aba = document.getElementById("abaResultados");

    aba.innerHTML = `

    <div class="resultado-container">

        <div class="resultado-topo">

            <h2>⚽ Central de Resultados</h2>

            <p>
                Administração Oficial da Copa do Mundo 2026
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
                <strong id="dashFase">Grupos</strong>
            </div>

        </div>

        <div class="resultado-filtros">

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

        <div id="gradeResultados"></div>

    </div>

    `;

    carregarResultadosNovo();

}

function obterBandeira(pais){

    if(!window.FLAGS) return "";

    const codigo = window.FLAGS[pais];

    if(!codigo) return "";

    return `https://flagcdn.com/w80/${codigo}.png`;

}

async function carregarResultadosNovo(){

        const faseSelecionada =
        document.getElementById("filtroFase")?.value || "GRUPOS";

    let jogos = [];

if(faseSelecionada=="GRUPOS"){

    const snap = await getDocs(
        collection(db,"jogos")
    );

    jogos = snap.docs
        .map(doc=>({

            id:doc.id,

            ...doc.data()

        }))
        .sort((a,b)=>
            new Date(a.dataHora.replace(" ","T"))-
            new Date(b.dataHora.replace(" ","T"))
        );

}else{

    jogos = JOGOS_MATA[faseSelecionada] || [];

}

    const jogos = snap.docs
        .map(doc=>({

            id:doc.id,

            ...doc.data()

        }))
        .sort((a,b)=>
            new Date(a.dataHora.replace(" ","T"))-
            new Date(b.dataHora.replace(" ","T"))
        );

    document.getElementById("dashJogos").innerHTML =
        jogos.length;

    document.getElementById("dashFinalizados").innerHTML =
        jogos.filter(j=>
            j.placarRealA!==null &&
            j.placarRealB!==null
        ).length;

    document.getElementById("dashPendentes").innerHTML =
        jogos.filter(j=>
            j.placarRealA===null ||
            j.placarRealB===null
        ).length;

    function formatarDataHora(dataHora){

        const d =
            new Date(dataHora.replace(" ","T"));

        return{

            data:d.toLocaleDateString("pt-BR"),

            hora:d.toLocaleTimeString(
                "pt-BR",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            )

        };

    }

    const grade =
        document.getElementById("gradeResultados");

    grade.innerHTML="";

    jogos.forEach(jogo=>{

        const dt =
            formatarDataHora(jogo.dataHora);

        const nomeA =
            jogo.nomeA || jogo.timeA;

        const nomeB =
            jogo.nomeB || jogo.timeB;

        const bandeiraA =
            obterBandeira(jogo.timeA);

        const bandeiraB =
            obterBandeira(jogo.timeB);

        const tituloFase =
            jogo.fase
            ? jogo.fase
            : "Grupo " + jogo.grupo;

        grade.innerHTML += `

<div class="cardResultadoNovo">

    <div class="cabResultado">

        <span>

            🏆 ${tituloFase}

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

    <button
        class="btnSalvarNovo"
        onclick="salvarResultado('${jogo.id}')"
    >

        💾 Salvar

    </button>

</div>

`;

    });

}
