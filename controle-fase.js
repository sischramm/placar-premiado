// ==========================================
// CONTROLE DAS FASES
// ==========================================

const FASES = {

    SEG: {

        nome: "Segunda Rodada",

        abre: "2026-06-26T08:00:00-03:00",

        fecha: "2026-06-28T15:30:00-03:00"

    },

    OIT: {

        nome: "Oitavas de Final",

        abre: "2026-07-03T12:00:00-03:00",

        fecha: "2026-07-04T13:00:00-03:00"

    },

    QUA: {

        nome: "Quartas de Final",

        abre: "2026-07-08T12:00:00-03:00",

        fecha: "2026-07-09T16:00:00-03:00"

    }

};

// Verifica se a fase está aberta

function faseAberta(fase){

    const agora = new Date();

    const abre = new Date(FASES[fase].abre);

    const fecha = new Date(FASES[fase].fecha);

    return agora >= abre && agora <= fecha;

}

// ======================================
// Atualiza o cronômetro
// ======================================

function atualizarCronometro(fase){

    const agora = new Date();

    const cronometro =
        document.getElementById("cronometroMata")
        || document.querySelector(".cronometro");

    if(!cronometro) return;

    // Próximo jogo ainda aberto
    const proximo = JOGOS_MATA[fase]
        .filter(j => new Date(j.fecha) > agora)
        .sort((a,b)=>new Date(a.fecha)-new Date(b.fecha))[0];

    if(!proximo){

        cronometro.innerHTML = `
            <div style="font-size:22px;font-weight:bold;">
                🔒 Palpites Encerrados
            </div>

            <div style="margin-top:8px;">
                Todos os palpites desta fase já foram encerrados.
            </div>
        `;

        return;

    }

    const fecha = new Date(proximo.fecha);

    const restante = fecha - agora;

    const dias = Math.floor(restante / 86400000);
    const horas = Math.floor((restante % 86400000) / 3600000);
    const minutos = Math.floor((restante % 3600000) / 60000);
    const segundos = Math.floor((restante % 60000) / 1000);

    // Jogos que fecham exatamente no mesmo horário
    const qtdMesmoHorario =
        JOGOS_MATA[fase].filter(j => j.fecha === proximo.fecha).length;

    const dataFechamento = fecha.toLocaleDateString("pt-BR");

    const horaFechamento = fecha.toLocaleTimeString("pt-BR",{
        hour:"2-digit",
        minute:"2-digit"
    });

    let mensagem = "";

 if(qtdMesmoHorario > 1){

    mensagem = `
        <div style="font-size:16px;color:#FFD447;font-weight:700;">
            ⏳ Encerramento dos palpites
        </div>

        <div style="font-size:22px;font-weight:700;margin:8px 0 5px;">
            ${proximo.nomeA} × ${proximo.nomeB}
        </div>

        <div style="font-size:28px;font-weight:800;margin:8px 0;color:#fff;">
            ${dias}d ${horas}h ${minutos}m ${segundos}s
        </div>

        <div style="font-size:14px;line-height:1.5;opacity:.95;">
            <strong>${qtdMesmoHorario} jogos</strong> encerram os palpites em
            <br>
            <strong>${dataFechamento} às ${horaFechamento}</strong>
            <br>
            <small>Horário de Brasília</small>
        </div>
    `;

}else{

    mensagem = `
        <div style="font-size:16px;color:#FFD447;font-weight:700;">
            ⏳ Próximo fechamento
        </div>

        <div style="font-size:22px;font-weight:700;margin:8px 0 5px;">
            ${proximo.nomeA} × ${proximo.nomeB}
        </div>

        <div style="font-size:28px;font-weight:800;margin:8px 0;color:#fff;">
            ${dias}d ${horas}h ${minutos}m ${segundos}s
        </div>

        <div style="font-size:14px;line-height:1.5;opacity:.95;">
            Palpites encerram em
            <br>
            <strong>${dataFechamento} às ${horaFechamento}</strong>
            <br>
            <small>Horário de Brasília</small>
        </div>
    `;

}

    cronometro.innerHTML = mensagem;

}

window.FASES = FASES;
window.faseAberta = faseAberta;
window.atualizarCronometro = atualizarCronometro;
