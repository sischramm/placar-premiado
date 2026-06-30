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

        <div id="gradeResultados"></div>

    </div>

    `;

    carregarResultadosNovo();

}

async function carregarResultadosNovo(){

    const snap = await getDocs(
        collection(db,"jogos")
    );

    const jogos = snap.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

    document.getElementById("dashJogos").innerHTML =
        jogos.length;

    document.getElementById("dashFinalizados").innerHTML =
        jogos.filter(j=>j.placarRealA!==undefined).length;

    document.getElementById("dashPendentes").innerHTML =
        jogos.filter(j=>j.placarRealA===undefined).length;

    const grade =
        document.getElementById("gradeResultados");

    grade.innerHTML="";

    jogos.forEach(jogo=>{

        grade.innerHTML += `

<div class="cardResultadoNovo">

    <div class="cabResultado">

        <span>
            🏆 ${jogo.grupo}
        </span>

        <span>
            🕒 ${jogo.dataHora}
        </span>

    </div>

    <div class="pais">

        ${jogo.timeA}

    </div>

    <div class="placarNovo">

        <input
            id="realA_${jogo.id}"
            type="number"
            value="${jogo.placarRealA ?? ""}"
        >

        <span>X</span>

        <input
            id="realB_${jogo.id}"
            type="number"
            value="${jogo.placarRealB ?? ""}"
        >

    </div>

    <div class="pais">

        ${jogo.timeB}

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
