// ==========================================
// CONTROLE DAS FASES
// Horário Oficial de Brasília
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

function faseAberta(fase){

    const agora = new Date();

    const abre = new Date(FASES[fase].abre);

    const fecha = new Date(FASES[fase].fecha);

    return agora >= abre && agora <= fecha;

}

window.FASES = FASES;

window.faseAberta = faseAberta;
