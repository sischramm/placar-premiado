// =====================================================
// SALVAR PALPITES MATA-MATA
// Firebase Novo
// Uma leitura + uma gravação por fase
// =====================================================

const PALPITES_MATA = {};

async function carregarPalpitesMata(email, fase) {

    const id = `${email}_${fase}`;

    try {

        const ref = window.doc(window.dbMata, "palpites", id);

        const snap = await window.getDoc(ref);

        if (snap.exists()) {

            PALPITES_MATA[fase] = snap.data().palpites || {};

            restaurarTela(fase);

        } else {

            PALPITES_MATA[fase] = {};

        }

    } catch (e) {

        console.error(e);

    }

}

async function salvarPalpiteMata(jogo){

const usuario = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if(!usuario){

    alert("Faça login novamente.");

    return;

}

const email = usuario.email;

    const fase = faseAtual;

    PALPITES_MATA[fase] ??= {};

    const escolha = escolhas[jogo];

    if (!escolha) {

        alert("Escolha um vencedor.");

        return;

    }

    const dadosJogo = JOGOS_MATA[fase]
        .find(j => j.jogo == jogo);

    const vencedor = escolha.lado == "A"
        ? dadosJogo.timeA
        : dadosJogo.timeB;

    PALPITES_MATA[fase][jogo] = {

        vencedor,

        forma: escolha.forma || "N"

    };

    const id = `${email}_${fase}`;

    await window.setDoc(

        window.doc(window.dbMata, "palpites", id),

        {

            email,

            fase,

            palpites: PALPITES_MATA[fase],

            atualizadoEm: window.serverTimestamp()

        }

    );

    const btn = document
        .querySelector(`#card${jogo} .salvar`);

    btn.innerHTML = "✅ Palpite Salvo";

}

function restaurarTela(fase) {

    const dados = PALPITES_MATA[fase];

    if (!dados) return;

    Object.keys(dados).forEach(numero => {

        const palpite = dados[numero];

        const jogo = JOGOS_MATA[fase]
            .find(j => j.jogo == Number(numero));

        if (!jogo) return;

        let lado = "";

        if (palpite.vencedor === jogo.timeA)
            lado = "A";

        if (palpite.vencedor === jogo.timeB)
            lado = "B";

        if (!lado) return;

        // ==========================
        // Mantém escolhas em memória
        // ==========================

        escolhas[numero] = {

            lado,
            forma: palpite.forma

        };

        // ==========================
        // Marca o vencedor
        // ==========================

        document
            .getElementById(lado + numero)
            ?.classList
            .add("selecionado");

        // ==========================
        // Exibe os botões
        // ==========================

        document
            .getElementById("formas" + numero)
            .style.display = "flex";

        // ==========================
        // Marca a forma
        // ==========================

        const botoes = document.querySelectorAll(
            `#formas${numero} button`
        );

        botoes.forEach(btn =>
            btn.classList.remove("formaSelecionada")
        );

        if (palpite.forma === "N")
            botoes[0]?.classList.add("formaSelecionada");

        if (palpite.forma === "P")
            botoes[1]?.classList.add("formaSelecionada");

        if (palpite.forma === "PE")
            botoes[2]?.classList.add("formaSelecionada");

        // ==========================
        // Botão salvo
        // ==========================

        const btnSalvar = document.querySelector(
            `#card${numero} .salvar`
        );

        if (btnSalvar)
            btnSalvar.innerHTML = "✅ Palpite Salvo";

    });

}

window.salvarPalpiteMata = salvarPalpiteMata;
window.carregarPalpitesMata = carregarPalpitesMata;
