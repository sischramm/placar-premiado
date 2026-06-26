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

    const fecha = new Date(FASES[fase].fecha);

    const restante = fecha - agora;

    const cronometro = document.getElementById("cronometroMata")
                    || document.querySelector(".cronometro");

    if(!cronometro) return;

    if(restante <= 0){

        cronometro.innerHTML = `
            🔒 <strong>Palpites Encerrados</strong>
            <br>
            <small>Horário de Brasília</small>
        `;

        return;

    }

    const dias = Math.floor(restante / 86400000);

    const horas = Math.floor((restante % 86400000) / 3600000);

    const minutos = Math.floor((restante % 3600000) / 60000);

    const segundos = Math.floor((restante % 60000) / 1000);

    cronometro.innerHTML = `
        ⏳ Encerramento em
        <br>
        <strong>${dias}d ${horas}h ${minutos}m ${segundos}s</strong>
        <br>
        <small>Horário de Brasília</small>
    `;

}

window.FASES = FASES;
window.faseAberta = faseAberta;
window.atualizarCronometro = atualizarCronometro;
