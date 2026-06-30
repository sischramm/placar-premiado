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

function carregarResultadosNovo(){

    document.getElementById("gradeResultados").innerHTML = `
        <h2 style="
            color:white;
            text-align:center;
            margin-top:50px;
        ">
            🚧 Nova Central de Resultados em construção...
        </h2>
    `;

}
