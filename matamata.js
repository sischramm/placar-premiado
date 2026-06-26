// =========================================
// MATA-MATA
// Renderização da tela
// =========================================

let faseAtual = "SEG";

function carregarFase(fase = "SEG") {

    faseAtual = fase;

    const container = document.getElementById("jogosContainer");

    container.innerHTML = "";

    const jogos = JOGOS_MATA[fase];

    jogos.forEach(jogo => {

        container.innerHTML += criarCard(jogo);

    });

}

function criarCard(j) {

    return `

<div class="cardJogo" id="card${j.jogo}">

    <div class="cabecalhoJogo">

        <span>${j.data}</span>

        <span>${j.hora}</span>

    </div>

    <div class="times">

        <div class="time"

            id="A${j.jogo}"

            onclick="selecionarTime(${j.jogo},'A')">

            <img

            src="assets/flags/${j.timeA ?? 'TBD'}.svg"

            class="flag">

            <span>${j.nomeA}</span>

        </div>

        <div class="vs">

            X

        </div>

        <div class="time"

            id="B${j.jogo}"

            onclick="selecionarTime(${j.jogo},'B')">

            <img

            src="assets/flags/${j.timeB ?? 'TBD'}.svg"

            class="flag">

            <span>${j.nomeB}</span>

        </div>

    </div>

    <div class="formas" id="formas${j.jogo}" style="display:none;">

        <button onclick="selecionarForma(${j.jogo},'N')">

            Tempo Normal
        </button>

        <button onclick="selecionarForma(${j.jogo},'P')">

            Prorrogação
        </button>

        <button onclick="selecionarForma(${j.jogo},'PE')">

            Pênaltis
        </button>

    </div>

    <button

        class="salvar"

        onclick="salvarPalpite(${j.jogo})">

        💾 Salvar Palpite

    </button>

</div>

`;

}

const escolhas = {};

function selecionarTime(jogo,lado){

    document
        .querySelectorAll(`#card${jogo} .time`)
        .forEach(e=>e.classList.remove("selecionado"));

    document
        .getElementById(lado+jogo)
        .classList
        .add("selecionado");

    document
        .getElementById("formas"+jogo)
        .style.display="flex";

    escolhas[jogo] ??={};

    escolhas[jogo].lado=lado;

}

function selecionarForma(jogo,forma){

    escolhas[jogo] ??={};

    escolhas[jogo].forma=forma;

}

window.carregarFase=carregarFase;
window.selecionarTime=selecionarTime;
window.selecionarForma=selecionarForma;

window.onload = () => {

    const fase = obterFaseAtual();

    if (!fase) {

        document.getElementById("jogosContainer").innerHTML = `

        <div class="semJogos">

            ⏳ Nenhuma fase aberta no momento.

        </div>

        `;

        return;

    }

    carregarFase(fase);

const usuario = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if(usuario){

    carregarPalpitesMata(
        usuario.email,
        fase
    );

}

};
