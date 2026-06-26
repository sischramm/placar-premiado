// ==========================================
// CONTROLE DAS FASES DO MATA-MATA
// ==========================================

const FASES_MATA = {

SEG:{

nome:"Segunda Rodada",

abre:new Date("2026-06-26T08:00:00"),

fecha:new Date("2026-06-28T15:30:00")

},

OIT:{

nome:"Oitavas de Final",

abre:new Date("2026-07-03T12:00:00"),

fecha:new Date("2026-07-04T13:00:00") // depois ajustamos

},

QUA:{

nome:"Quartas de Final",

abre:new Date("2026-07-08T12:00:00"),

fecha:new Date("2026-07-09T16:00:00")

},

SEM:{

nome:"Semifinais",

abre:new Date("2026-07-13T12:00:00"),

fecha:new Date("2026-07-14T16:00:00")

},

L3:{

nome:"Disputa 3º Lugar",

abre:new Date("2026-07-17T08:00:00"),

fecha:new Date("2026-07-18T17:00:00")

},

FIN:{

nome:"Final",

abre:new Date("2026-07-18T08:00:00"),

fecha:new Date("2026-07-19T15:30:00")

}

};

function faseAberta(fase){

const agora=new Date();

return agora>=FASES_MATA[fase].abre &&
       agora<=FASES_MATA[fase].fecha;

}

function obterFaseAtual(){

const agora=new Date();

for(const fase in FASES_MATA){

if(

agora>=FASES_MATA[fase].abre &&

agora<=FASES_MATA[fase].fecha

){

return fase;

}

}

return null;

}

window.FASES_MATA=FASES_MATA;

window.faseAberta=faseAberta;

window.obterFaseAtual=obterFaseAtual;
