// ===============================================
// JOGOS DO MATA-MATA
// COPA DO MUNDO 2026
// Jogos 73 até 96
// ===============================================

const JOGOS_MATA = {

SEG:[

{
jogo:73,
fase:"SEG",
ordem:1,
data:"28/06/2026",
hora:"16:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-28T15:00:00-03:00",
timeA:"RSA",
nomeA:"África do Sul",
timeB:"CAN",
nomeB:"Canadá"
},

{
jogo:74,
fase:"SEG",
ordem:2,
data:"29/06/2026",
hora:"14:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"BRA",
nomeA:"Brasil",
timeB:"JPN",
nomeB:"Japão"
},

{
jogo:75,
fase:"SEG",
ordem:3,
data:"29/06/2026",
hora:"17:30",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"GER",
nomeA:"Alemanha",
timeB:"PAR",
nomeB:"Paraguai"
},

{
jogo:76,
fase:"SEG",
ordem:4,
data:"29/06/2026",
hora:"22:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"NED",
nomeA:"Países Baixos",
timeB:"MAR",
nomeB:"Marrocos"
},

{
jogo:77,
fase:"SEG",
ordem:5,
data:"30/06/2026",
hora:"14:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"CIV",
nomeA:"Costa do Marfim",
timeB:"NOR",
nomeB:"Noruega"
},

{
jogo:78,
fase:"SEG",
ordem:6,
data:"30/06/2026",
hora:"18:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"FRA",
nomeA:"França",
timeB:"SWE",
nomeB:"Suécia"
},

{
jogo:79,
fase:"SEG",
ordem:7,
data:"30/06/2026",
hora:"22:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"MEX",
nomeA:"México",
timeB:"ECU",
nomeB:"Equador"
},

{
jogo:80,
fase:"SEG",
ordem:8,
data:"01/07/2026",
hora:"13:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"ENG",
nomeA:"Inglaterra",
timeB:"COD",
nomeB:"RD Congo"
},

{
jogo:81,
fase:"SEG",
ordem:9,
data:"01/07/2026",
hora:"17:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"BEL",
nomeA:"Bélgica",
timeB:"SEN",
nomeB:"Senegal"
},

{
jogo:82,
fase:"SEG",
ordem:10,
data:"01/07/2026",
hora:"21:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"USA",
nomeA:"Estados Unidos",
timeB:"BIH",
nomeB:"Bósnia e Herzegovina"
},

{
jogo:83,
fase:"SEG",
ordem:11,
data:"02/07/2026",
hora:"16:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"ESP",
nomeA:"Espanha",
timeB:"AUT",
nomeB:"Áustria"
},

{
jogo:84,
fase:"SEG",
ordem:12,
data:"02/07/2026",
hora:"20:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"POR",
nomeA:"Portugal",
timeB:"CRO",
nomeB:"Croácia"
},

{
jogo:85,
fase:"SEG",
ordem:13,
data:"03/07/2026",
hora:"00:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"SUI",
nomeA:"Suíça",
timeB:"ALG",
nomeB:"Argélia"
},

{
jogo:86,
fase:"SEG",
ordem:14,
data:"03/07/2026",
hora:"15:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"AUS",
nomeA:"Austrália",
timeB:"EGY",
nomeB:"Egito"
},

{
jogo:87,
fase:"SEG",
ordem:15,
data:"03/07/2026",
hora:"19:00",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"ARG",
nomeA:"Argentina",
timeB:"CPV",
nomeB:"Cabo Verde"
},

{
jogo:88,
fase:"SEG",
ordem:16,
data:"03/07/2026",
hora:"22:30",
abre:"2026-06-26T08:00:00-03:00",
fecha:"2026-06-29T12:00:00-03:00",
timeA:"COL",
nomeA:"Colômbia",
timeB:"GHA",
nomeB:"Gana"
}

],

OIT:[],

QUA:[],

SEM:[],

L3:[],

FIN:[]

};

window.JOGOS_MATA=JOGOS_MATA;

// ======================================
// RETORNA A FASE ABERTA
// ======================================

function obterFaseAtual(){

    const agora = new Date();

    if(
        agora >= new Date("2026-06-26T08:00:00") &&
        agora <= new Date("2026-06-28T15:30:00")
    ){
        return "SEG";
    }

    if(
        agora >= new Date("2026-07-03T12:00:00") &&
        agora <= new Date("2026-07-04T13:00:00")
    ){
        return "OIT";
    }

    if(
        agora >= new Date("2026-07-08T12:00:00") &&
        agora <= new Date("2026-07-09T16:00:00")
    ){
        return "QUA";
    }

    if(
        agora >= new Date("2026-07-13T12:00:00") &&
        agora <= new Date("2026-07-14T16:00:00")
    ){
        return "SEM";
    }

    if(
        agora >= new Date("2026-07-17T08:00:00") &&
        agora <= new Date("2026-07-18T17:00:00")
    ){
        return "L3";
    }

    if(
        agora >= new Date("2026-07-18T08:00:00") &&
        agora <= new Date("2026-07-19T16:00:00")
    ){
        return "FIN";
    }

    return null;

}

window.obterFaseAtual = obterFaseAtual;
