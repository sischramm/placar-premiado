import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let indiceDataAtual = 0;
let datasJogos = [];
let todosJogos = [];

import { db } from "./firebase.js";

window.onload = function() {

  const home = document.getElementById("homeInicial");
  const login = document.getElementById("loginSistema");
  const topo = document.getElementById("topoSistema");
  const sistema = document.getElementById("sistemaCompleto");

  if(home) home.style.display = "flex";
  if(login) login.style.display = "none";
  if(topo) topo.style.display = "none";
  if(sistema) sistema.style.display = "none";

  const usuario =
JSON.parse(
  localStorage.getItem(
    "usuarioLogado"
  )
);

if(usuario){

  home.style.display = "none";

  login.style.display = "none";

  document.getElementById(
    "painel"
  ).style.display = "block";

  document.getElementById(
    "nomeUsuario"
  ).innerHTML =
    usuario.nome;

  document.getElementById(
    "pontosUsuario"
  ).innerHTML =
    usuario.pontos || 0;

  const btnImportar =
    document.getElementById(
      "btnImportarJogos"
    );

  if(btnImportar){

    if(
      usuario.email ===
      "simone.schramm@equagril.com.br"
    ){

      btnImportar.style.display =
        "inline-block";

    }else{

      btnImportar.style.display =
        "none";

    }

  }

}
  carregarJogos();

};

function abrirAba(nome){

  const abas = [
    "abaPalpites",
    "abaRanking",
    "abaClassificacao",
    "abaMata",
    "abaEmpresa",
    "abaEstatisticas",
    "abaPerfil",
    "abaExtras",
    "abaPremiacao",
    "abaRegulamento",
    "abaAdmin"
  ];

  abas.forEach(id => {

    const aba =
      document.getElementById(id);

    if(aba){
      aba.style.display = "none";
    }

  });

  if(nome === "palpites"){
    document.getElementById("abaPalpites").style.display = "block";
  }

  if(nome === "ranking"){
    document.getElementById("abaRanking").style.display = "block";
    carregarRanking();
  }

  if(nome === "classificacao"){
    document.getElementById("abaClassificacao").style.display = "block";
  }

  if(nome === "mata"){
    document.getElementById("abaMata").style.display = "block";
  }

  if(nome === "empresa"){
    document.getElementById("abaEmpresa").style.display = "block";
    carregarRankingEmpresas();
  }

  if(nome === "estatisticas"){
    document.getElementById("abaEstatisticas").style.display = "block";
  }

  if(nome === "perfil"){
    document.getElementById("abaPerfil").style.display = "block";
    carregarPerfil();
  }

  if(nome === "extras"){
    document.getElementById("abaExtras").style.display = "block";
  }

  if(nome === "premiacao"){
    document.getElementById("abaPremiacao").style.display = "block";
  }

  if(nome === "regulamento"){
    document.getElementById("abaRegulamento").style.display = "block";
  }

  if(nome === "admin"){
    document.getElementById("abaAdmin").style.display = "block";
    carregarAdminJogos();
  }

}

function sair(){

  localStorage.removeItem(
    "usuarioLogado"
  );

  location.reload();

}

function toggleSenha(id, botao){

  const campo =
  document.getElementById(id);

  if(campo.type === "password"){
    campo.type = "text";
    botao.innerHTML = "🙈";
  }else{
    campo.type = "password";
    botao.innerHTML = "👁";
  }
}

async function login(){

  const email =
    document.getElementById("loginEmail").value.trim();

  const senha =
    document.getElementById("loginSenha").value.trim();

  if(!email || !senha){

    alert("Informe e-mail e senha.");

    return;

  }

  try{

    const usuarios =
      await getDocs(
        collection(db,"usuarios")
      );

    let usuarioEncontrado = null;

    usuarios.forEach(doc => {

      const dados = doc.data();

      if(
        dados.email === email &&
        dados.senha === senha
      ){
        usuarioEncontrado = dados;
      }

    });

    if(!usuarioEncontrado){

      alert("Usuário ou senha inválidos.");

      return;

    }

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(usuarioEncontrado)
    );

    document.getElementById(
      "loginSistema"
    ).style.display = "none";

    document.getElementById(
      "homeInicial"
    ).style.display = "none";

    document.getElementById(
      "painel"
    ).style.display = "block";

    document.getElementById(
      "nomeUsuario"
    ).innerHTML =
      usuarioEncontrado.nome;

    document.getElementById(
      "pontosUsuario"
    ).innerHTML =
      usuarioEncontrado.pontos || 0;

    alert(
      "Bem-vindo " +
      usuarioEncontrado.nome
    );

  }catch(erro){

    console.error(erro);

    alert("Erro ao realizar login.");

  }

}

async function cadastrar(){

  const nome =
    document.getElementById("nome").value.trim();

  const empresa =
    document.getElementById("empresa").value;

  const filial =
    document.getElementById("filial").value;

  const email =
    document.getElementById("email").value.trim();

  const senha =
    document.getElementById("senha").value.trim();

  const termo =
    document.getElementById("termo").checked;

  if(!nome || !empresa || !filial || !email || !senha){

    alert("Preencha todos os campos.");

    return;

  }

  if(!termo){

    alert("Aceite o regulamento.");

    return;

  }

  try {

    await addDoc(
      collection(db, "usuarios"),
      {
        nome,
        empresa,
        filial,
        email,
        senha,
        pontos: 0,
        criadoEm: new Date()
      }
    );

    alert("Cadastro realizado com sucesso!");

const usuario = {
  nome,
  empresa,
  filial,
  email,
  pontos: 0
};

localStorage.setItem(
  "usuarioLogado",
  JSON.stringify(usuario)
);

document.getElementById(
  "loginSistema"
).style.display = "none";

document.getElementById(
  "homeInicial"
).style.display = "none";

document.getElementById(
  "painel"
).style.display = "block";

document.getElementById(
  "nomeUsuario"
).innerHTML = nome;

document.getElementById(
  "pontosUsuario"
).innerHTML = 0;

  } catch (erro) {

    console.error(erro);

    alert("Erro ao cadastrar.");

  }

}
   
function salvarExtras(){
  alert("Extras serão conectados ao Firebase");
}

function recalcularRanking(){
  alert("Admin");
}

function abrirLogin() {

  document.getElementById("homeInicial").style.display = "none";

  document.getElementById("loginSistema").style.display = "grid";

  document.getElementById("login").style.display = "block";

  document.getElementById("cadastro").style.display = "none";

}

function abrirCadastro() {

  document.getElementById("homeInicial").style.display = "none";

  document.getElementById("loginSistema").style.display = "grid";

  document.getElementById("login").style.display = "none";

  document.getElementById("cadastro").style.display = "block";

}

function voltarHome(){

  document.getElementById("homeInicial").style.display = "flex";

  document.getElementById("loginSistema").style.display = "none";

}
const empresas = {

  "Agricase": [
    "Amambai","Campo Mourão","Cornélio Procópio","Dourados",
    "Goioerê","Guaíra","Ivinhema","Jardim",
    "Londrina","Maracaju","Maringá","Naviraí",
    "Palotina","Paranavaí","Ponta Porã","Rio Brilhante",
    "Toledo","Ubiratã"
  ],

  "Agriparts": [
    "Sapezal","Sinop","Sorriso","Tangara da Serra"
  ],

  "Agrotrator": [
    "Matriz"
  ],

  "Disma": [
    "Adamantina","Andradina","Araçatuba","Barretos",
    "Cornélio Procópio","Jardim Alegre","Londrina",
    "Ourinhos","Penápolis","Presidente Prudente",
    "São Jose do Rio Preto","Taquarituba",
    "Tupã","Votuporanga"
  ],

  "Equagril": [
    "Amambai","Canoinhas","Cianorte","Curitiba",
    "Goioerê","Jardim","Mafra","Medianeira",
    "Naviraí","Palotina","Paranavai","Ponta Porã",
    "Rondon","São Mateus","São Paulo",
    "Ubiratã","Umuarama"
  ],

  "Grupo Shark": [
    "Holding"
  ],

  "Moreia": [
    "Matriz"
  ],

  "Nova Holanda": [
    "Araxá","Assis","Ituiutaba","Iturama",
    "Pouso Alegre","Uberaba","Uberlândia"
  ],

  "Shark Máquinas": [
    "Biguaçu","Campo Grande","Canoas","Cascavel",
    "Chapeco","Curitiba","Dourados","Londrina",
    "Marialva","Matriz","Passo Fundo",
    "Piracicaba","Ribeirão Preto","Santa Maria",
    "São José Do Rio Preto"
  ],

  "Shark Soluções Agrícolas": [
    "Cascavel","Guarapuava","Pato Branco","Xanxerê"
  ],

  "Shark Tratores": [
    "Avaré","Campo Grande","Chapadão do Sul",
    "Dourados","Eldorado","Itapetininga",
    "Itapeva","Itu","Maracaju","Mogi",
    "Naviraí","Nova Andradina","Pindamonhangaba",
    "Piracicaba","Ponta Porã",
    "São Gabriel do Oeste",
    "São Paulo","Três Lagoas"
  ],

  "SK": [
    "Belem","Campinas","Campo Grande",
    "Canoas","Caruaru","Contagem",
    "Cuiabá","Fortaleza","Goiânia",
    "Juiz de Fora","Londrina","Maceió",
    "Picos","Recife","Ribeirão Preto",
    "Rio de Janeiro","Rondonópolis",
    "Salvador","São Paulo",
    "Teresina","Uberlândia","Viana"
  ]

};

window.addEventListener("DOMContentLoaded", () => {

  const empresa =
    document.getElementById("empresa");

  if (!empresa) return;

  Object.keys(empresas)
    .sort()
    .forEach(nome => {

      const option =
        document.createElement("option");

      option.value = nome;
      option.textContent = nome;

      empresa.appendChild(option);

    });

});

function carregarFiliais() {

  const empresaSelecionada =
    document.getElementById("empresa").value;

  const filial =
    document.getElementById("filial");

  filial.innerHTML =
    '<option value="">Selecione a Filial</option>';

  if (!empresas[empresaSelecionada]) return;

  empresas[empresaSelecionada]
    .sort()
    .forEach(nome => {

      const option =
        document.createElement("option");

      option.value = nome;
      option.textContent = nome;

      filial.appendChild(option);

    });

}

window.abrirLogin = abrirLogin;
window.abrirCadastro = abrirCadastro;
window.voltarHome = voltarHome;
window.cadastrar = cadastrar;
window.login = login;
window.sair = sair;
window.toggleSenha = toggleSenha;
window.carregarFiliais = carregarFiliais;
window.abrirAba = abrirAba;

async function importarJogos(){

  const jogos = [
    {
id:1,fase:"Grupos",grupo:"A",timeA:"México",timeB:"África do Sul",dataHora:"2026-06-11 16:00:00"
},
{
id:2,fase:"Grupos",grupo:"A",timeA:"Coreia do Sul",timeB:"República Tcheca",dataHora:"2026-06-11 23:00:00"
},
{
id:3,fase:"Grupos",grupo:"A",timeA:"República Tcheca",timeB:"África do Sul",dataHora:"2026-06-18 13:00:00"
},
{
id:4,fase:"Grupos",grupo:"A",timeA:"México",timeB:"Coreia do Sul",dataHora:"2026-06-18 22:00:00"
},
{
id:5,fase:"Grupos",grupo:"A",timeA:"República Tcheca",timeB:"México",dataHora:"2026-06-24 22:00:00"
},
{
id:6,fase:"Grupos",grupo:"A",timeA:"África do Sul",timeB:"Coreia do Sul",dataHora:"2026-06-24 22:00:00"
},

{
id:7,fase:"Grupos",grupo:"B",timeA:"Canadá",timeB:"Bósnia",dataHora:"2026-06-12 16:00:00"
},
{
id:8,fase:"Grupos",grupo:"B",timeA:"Catar",timeB:"Suíça",dataHora:"2026-06-13 16:00:00"
},
{
id:9,fase:"Grupos",grupo:"B",timeA:"Suíça",timeB:"Bósnia",dataHora:"2026-06-18 16:00:00"
},
{
id:10,fase:"Grupos",grupo:"B",timeA:"Canadá",timeB:"Catar",dataHora:"2026-06-18 19:00:00"
},
{
id:11,fase:"Grupos",grupo:"B",timeA:"Suíça",timeB:"Canadá",dataHora:"2026-06-24 16:00:00"
},
{
id:12,fase:"Grupos",grupo:"B",timeA:"Bósnia",timeB:"Catar",dataHora:"2026-06-24 16:00:00"
},

{
id:13,fase:"Grupos",grupo:"C",timeA:"Brasil",timeB:"Marrocos",dataHora:"2026-06-13 19:00:00"
},
{
id:14,fase:"Grupos",grupo:"C",timeA:"Haiti",timeB:"Escócia",dataHora:"2026-06-13 22:00:00"
},
{
id:15,fase:"Grupos",grupo:"C",timeA:"Escócia",timeB:"Marrocos",dataHora:"2026-06-19 19:00:00"
},
{
id:16,fase:"Grupos",grupo:"C",timeA:"Brasil",timeB:"Haiti",dataHora:"2026-06-19 21:30:00"
},
{
id:17,fase:"Grupos",grupo:"C",timeA:"Escócia",timeB:"Brasil",dataHora:"2026-06-24 19:00:00"
},
{
id:18,fase:"Grupos",grupo:"C",timeA:"Marrocos",timeB:"Haiti",dataHora:"2026-06-24 19:00:00"
},
{
id:19,fase:"Grupos",grupo:"D",timeA:"EUA",timeB:"Paraguai",dataHora:"2026-06-12 22:00:00"
},
{
id:20,fase:"Grupos",grupo:"D",timeA:"Austrália",timeB:"Turquia",dataHora:"2026-06-14 01:00:00"
},
{
id:21,fase:"Grupos",grupo:"D",timeA:"EUA",timeB:"Austrália",dataHora:"2026-06-19 16:00:00"
},
{
id:22,fase:"Grupos",grupo:"D",timeA:"Turquia",timeB:"Paraguai",dataHora:"2026-06-20 00:00:00"
},
{
id:23,fase:"Grupos",grupo:"D",timeA:"Paraguai",timeB:"Austrália",dataHora:"2026-06-25 23:00:00"
},
{
id:24,fase:"Grupos",grupo:"D",timeA:"Turquia",timeB:"EUA",dataHora:"2026-06-25 23:00:00"
},

{
id:25,fase:"Grupos",grupo:"E",timeA:"Alemanha",timeB:"Curaçao",dataHora:"2026-06-14 14:00:00"
},
{
id:26,fase:"Grupos",grupo:"E",timeA:"Costa do Marfim",timeB:"Equador",dataHora:"2026-06-14 20:00:00"
},
{
id:27,fase:"Grupos",grupo:"E",timeA:"Alemanha",timeB:"Costa do Marfim",dataHora:"2026-06-20 17:00:00"
},
{
id:28,fase:"Grupos",grupo:"E",timeA:"Equador",timeB:"Curaçao",dataHora:"2026-06-20 21:00:00"
},
{
id:29,fase:"Grupos",grupo:"E",timeA:"Equador",timeB:"Alemanha",dataHora:"2026-06-25 17:00:00"
},
{
id:30,fase:"Grupos",grupo:"E",timeA:"Curaçao",timeB:"Costa do Marfim",dataHora:"2026-06-25 17:00:00"
},
{
id:31,fase:"Grupos",grupo:"F",timeA:"Holanda",timeB:"Japão",dataHora:"2026-06-14 14:00:00"
},
{
id:32,fase:"Grupos",grupo:"F",timeA:"Suécia",timeB:"Tunísia",dataHora:"2026-06-14 20:00:00"
},
{
id:33,fase:"Grupos",grupo:"F",timeA:"Holanda",timeB:"Suécia",dataHora:"2026-06-20 17:00:00"
},
{
id:34,fase:"Grupos",grupo:"F",timeA:"Tunísia",timeB:"Japão",dataHora:"2026-06-20 21:00:00"
},
{
id:35,fase:"Grupos",grupo:"F",timeA:"Tunísia",timeB:"Holanda",dataHora:"2026-06-25 20:00:00"
},
{
id:36,fase:"Grupos",grupo:"F",timeA:"Japão",timeB:"Suécia",dataHora:"2026-06-25 20:00:00"
},
{
id:37,fase:"Grupos",grupo:"G",timeA:"Bélgica",timeB:"Egito",dataHora:"2026-06-15 16:00:00"
},
{
id:38,fase:"Grupos",grupo:"G",timeA:"Irã",timeB:"Nova Zelândia",dataHora:"2026-06-15 22:00:00"
},
{
id:39,fase:"Grupos",grupo:"G",timeA:"Bélgica",timeB:"Irã",dataHora:"2026-06-21 16:00:00"
},
{
id:40,fase:"Grupos",grupo:"G",timeA:"Nova Zelândia",timeB:"Egito",dataHora:"2026-06-21 22:00:00"
},
{
id:41,fase:"Grupos",grupo:"G",timeA:"Egito",timeB:"Irã",dataHora:"2026-06-27 00:00:00"
},
{
id:42,fase:"Grupos",grupo:"G",timeA:"Nova Zelândia",timeB:"Bélgica",dataHora:"2026-06-27 00:00:00"
},
{
id:43,fase:"Grupos",grupo:"H",timeA:"Espanha",timeB:"Cabo Verde",dataHora:"2026-06-15 13:00:00"
},
{
id:44,fase:"Grupos",grupo:"H",timeA:"Arábia Saudita",timeB:"Uruguai",dataHora:"2026-06-15 19:00:00"
},
{
id:45,fase:"Grupos",grupo:"H",timeA:"Espanha",timeB:"Arábia Saudita",dataHora:"2026-06-21 13:00:00"
},
{
id:46,fase:"Grupos",grupo:"H",timeA:"Uruguai",timeB:"Cabo Verde",dataHora:"2026-06-21 19:00:00"
},
{
id:47,fase:"Grupos",grupo:"H",timeA:"Uruguai",timeB:"Espanha",dataHora:"2026-06-26 21:00:00"
},
{
id:48,fase:"Grupos",grupo:"H",timeA:"Cabo Verde",timeB:"Arábia Saudita",dataHora:"2026-06-26 21:00:00"
},
{
id:49,fase:"Grupos",grupo:"I",timeA:"França",timeB:"Senegal",dataHora:"2026-06-16 16:00:00"
},
{
id:50,fase:"Grupos",grupo:"I",timeA:"Iraque",timeB:"Noruega",dataHora:"2026-06-16 19:00:00"
},
{
id:51,fase:"Grupos",grupo:"I",timeA:"França",timeB:"Iraque",dataHora:"2026-06-22 18:00:00"
},
{
id:52,fase:"Grupos",grupo:"I",timeA:"Noruega",timeB:"Senegal",dataHora:"2026-06-22 21:00:00"
},
{
id:53,fase:"Grupos",grupo:"I",timeA:"Noruega",timeB:"França",dataHora:"2026-06-26 16:00:00"
},
{
id:54,fase:"Grupos",grupo:"I",timeA:"Senegal",timeB:"Iraque",dataHora:"2026-06-26 16:00:00"
},
{
id:55,fase:"Grupos",grupo:"J",timeA:"Argentina",timeB:"Argélia",dataHora:"2026-06-16 22:00:00"
},
{
id:56,fase:"Grupos",grupo:"J",timeA:"Áustria",timeB:"Jordânia",dataHora:"2026-06-17 01:00:00"
},
{
id:57,fase:"Grupos",grupo:"J",timeA:"Argentina",timeB:"Áustria",dataHora:"2026-06-22 14:00:00"
},
{
id:58,fase:"Grupos",grupo:"J",timeA:"Jordânia",timeB:"Argélia",dataHora:"2026-06-23 00:00:00"
},
{
id:59,fase:"Grupos",grupo:"J",timeA:"Jordânia",timeB:"Argentina",dataHora:"2026-06-27 23:00:00"
},
{
id:60,fase:"Grupos",grupo:"J",timeA:"Argélia",timeB:"Áustria",dataHora:"2026-06-27 23:00:00"
},
{
id:61,fase:"Grupos",grupo:"K",timeA:"Portugal",timeB:"RD Congo",dataHora:"2026-06-17 14:00:00"
},
{
id:62,fase:"Grupos",grupo:"K",timeA:"Uzbequistão",timeB:"Colômbia",dataHora:"2026-06-17 23:00:00"
},
{
id:63,fase:"Grupos",grupo:"K",timeA:"Portugal",timeB:"Uzbequistão",dataHora:"2026-06-23 14:00:00"
},
{
id:64,fase:"Grupos",grupo:"K",timeA:"Colômbia",timeB:"RD Congo",dataHora:"2026-06-23 23:00:00"
},
{
id:65,fase:"Grupos",grupo:"K",timeA:"Colômbia",timeB:"Portugal",dataHora:"2026-06-27 20:30:00"
},
{
id:66,fase:"Grupos",grupo:"K",timeA:"RD Congo",timeB:"Uzbequistão",dataHora:"2026-06-27 20:30:00"
},
{
id:67,fase:"Grupos",grupo:"L",timeA:"Inglaterra",timeB:"Croácia",dataHora:"2026-06-17 17:00:00"
},
{
id:68,fase:"Grupos",grupo:"L",timeA:"Gana",timeB:"Panamá",dataHora:"2026-06-17 20:00:00"
},
{
id:69,fase:"Grupos",grupo:"L",timeA:"Inglaterra",timeB:"Gana",dataHora:"2026-06-23 17:00:00"
},
{
id:70,fase:"Grupos",grupo:"L",timeA:"Panamá",timeB:"Croácia",dataHora:"2026-06-23 20:00:00"
},
{
id:71,fase:"Grupos",grupo:"L",timeA:"Panamá",timeB:"Inglaterra",dataHora:"2026-06-27 18:00:00"
},
{
id:72,fase:"Grupos",grupo:"L",timeA:"Croácia",timeB:"Gana",dataHora:"2026-06-27 18:00:00"
}
];    

  for(const jogo of jogos){

    await addDoc(
      collection(db,"jogos"),
      {
        ...jogo,
        placarRealA: null,
        placarRealB: null,
        encerrado: false
      }
    );

  }

  alert("72 jogos importados com sucesso!");

}

window.importarJogos = importarJogos;

async function carregarJogos(){

  const lista =
    document.getElementById(
      "listaJogos"
    );

  if(!lista) return;

  lista.innerHTML = "";

  const snapshot =
    await getDocs(
      collection(db,"jogos")
    );

  todosJogos =
    snapshot.docs
      .map(doc => doc.data())
      .sort((a,b) =>
        new Date(
          a.dataHora.replace(" ","T")
        ) -
        new Date(
          b.dataHora.replace(" ","T")
        )
      );

  datasJogos = [
    ...new Set(
      todosJogos.map(
        jogo =>
          jogo.dataHora.split(" ")[0]
      )
    )
  ];

  indiceDataAtual = 0;

  await renderizarDataAtual();

  await atualizarProgresso();

}

async function renderizarDataAtual(){

  const lista =
    document.getElementById(
      "listaJogos"
    );

  if(!lista) return;

  lista.innerHTML = "";

  const dataAtual =
    datasJogos[indiceDataAtual];

  lista.innerHTML += `

    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:25px;
      "
    >

      <button onclick="dataAnterior()">
        ⬅ Anterior
      </button>

      <h2
        style="
          color:#fff;
          margin:0;
          font-weight:900;
        "
      >
        🗓️ Jogos de ${dataAtual}
      </h2>

      ${
        indiceDataAtual ===
        datasJogos.length - 1

        ?

        `
        <button onclick="abrirAba('extras')">
          ⭐ Extras
        </button>
        `

        :

        `
        <button onclick="proximaData()">
          Próximo ➡
        </button>
        `
      }

    </div>

  <div
  style="
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between;
    gap:20px;
    width:100%;
  "
>

  `;

  const jogosDoDia =
    todosJogos.filter(
      jogo =>
        jogo.dataHora.split(" ")[0]
        === dataAtual
    );

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  for(const jogo of jogosDoDia){

    let placarSalvoA = "";
    let placarSalvoB = "";

    if(usuario){

      const palpiteRef =
        await getDoc(
          doc(
            db,
            "palpites",
            usuario.email + "_" + jogo.id
          )
        );

      if(palpiteRef.exists()){

        const palpite =
          palpiteRef.data();

        placarSalvoA =
          palpite.placarA;

        placarSalvoB =
          palpite.placarB;

      }

    }

    const agora = new Date();

    const dataJogo =
      new Date(
        jogo.dataHora.replace(
          " ",
          "T"
        )
      );

    const bloqueado =
      agora >= dataJogo;

    lista.innerHTML += `

 <div class="jogo">

        <h3>
          ${jogo.timeA} x ${jogo.timeB}
        </h3>

        <p>
          Grupo ${jogo.grupo}
        </p>

        <p>
          🕒 ${jogo.dataHora.split(" ")[1].substring(0,5)}
        </p>

        ${
          bloqueado
          ?
          `
          <p style="
            color:red;
            font-weight:bold;
          ">
            🔒 Palpites encerrados
          </p>
          `
          :
          ""
        }

        <div
          style="
            display:flex;
            justify-content:center;
            align-items:center;
            gap:15px;
            margin:25px 0;
          "
        >

          <input
            id="a_${jogo.id}"
            type="number"
            min="0"
            max="99"
            value="${placarSalvoA}"
            ${bloqueado ? "disabled" : ""}
            style="
              width:100px;
              height:50px;
              text-align:center;
              font-size:24px;
              font-weight:bold;
            "
          >

          <span
            style="
              font-size:36px;
              font-weight:900;
            "
          >
            X
          </span>

          <input
            id="b_${jogo.id}"
            type="number"
            min="0"
            max="99"
            value="${placarSalvoB}"
            ${bloqueado ? "disabled" : ""}
            style="
              width:100px;
              height:50px;
              text-align:center;
              font-size:24px;
              font-weight:bold;
            "
          >

        </div>

        ${
          bloqueado
          ?
          ""
          :
          `
          <button
            onclick="salvarPalpite(${jogo.id})"
          >
            💾 Salvar Palpite
          </button>
          `
        }

      </div>

    `;

  }

  lista.innerHTML += `
    </div>
  `;

}

function proximaData(){

  if(indiceDataAtual < datasJogos.length - 1){

    indiceDataAtual++;

    renderizarDataAtual();

  }

}

function dataAnterior(){

  if(indiceDataAtual > 0){

    indiceDataAtual--;

    renderizarDataAtual();

  }

}

window.proximaData = proximaData;
window.dataAnterior = dataAnterior;

async function atualizarProgresso(){

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!usuario){
    return;
  }

  const jogosSnap =
    await getDocs(
      collection(db,"jogos")
    );

  const totalJogos =
    jogosSnap.size;

  const palpitesSnap =
    await getDocs(
      collection(db,"palpites")
    );

  let realizados = 0;

  palpitesSnap.forEach(doc => {

    const palpite = doc.data();

    if(
      palpite.usuario &&
      palpite.usuario.toLowerCase() ===
      usuario.email.toLowerCase()
    ){
      realizados++;
    }

  });

  const pendentes =
    Math.max(
      totalJogos - realizados,
      0
    );

  const percentual =
    totalJogos > 0
      ? Math.round(
          (realizados / totalJogos) * 100
        )
      : 0;

  const elTotal =
    document.getElementById("totalJogos");

  const elRealizados =
    document.getElementById("realizados");

  const elPendentes =
    document.getElementById("pendentes");

  const elPercentual =
    document.getElementById("percentual");

  const elBarra =
    document.getElementById("barraProgresso");

  if(elTotal)
    elTotal.innerHTML =
      totalJogos + " jogos";

  if(elRealizados)
    elRealizados.innerHTML =
      realizados + " realizados";

  if(elPendentes)
    elPendentes.innerHTML =
      pendentes + " pendentes";

  if(elPercentual)
    elPercentual.innerHTML =
      percentual + "%";

  if(elBarra)
    elBarra.style.width =
      percentual + "%";

}

async function salvarPalpite(idJogo){

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  const placarA =
    Number(
      document.getElementById(
        `a_${idJogo}`
      ).value
    );

  const placarB =
    Number(
      document.getElementById(
        `b_${idJogo}`
      ).value
    );

  if(
  document.getElementById(`a_${idJogo}`).value === "" ||
  document.getElementById(`b_${idJogo}`).value === ""
){

  alert("Informe os dois placares.");

  return;

}

if(
  isNaN(placarA) ||
  isNaN(placarB)
){

  alert("Digite apenas números.");

  return;

}

if(
  placarA < 0 ||
  placarB < 0
){

  alert("Placar inválido.");

  return;

}

if(
  placarA > 99 ||
  placarB > 99
){

  alert("Máximo permitido: 99 gols.");

  return;

}

  try{

    const idPalpite =
  usuario.email + "_" + idJogo;

await setDoc(
  doc(
    db,
    "palpites",
    idPalpite
  ),
  {
    usuario: usuario.email,
    jogoId: idJogo,
    placarA,
    placarB,
    atualizadoEm: new Date()
  }
);

    alert("Palpite salvo/atualizado!");

    await atualizarProgresso();

  }catch(erro){

    console.error(erro);

    alert(
      "Erro ao salvar."
    );

  }

}

window.salvarPalpite =
  salvarPalpite;

window.abrirAba = abrirAba;
window.abrirLogin = abrirLogin;
window.abrirCadastro = abrirCadastro;
window.login = login;
window.cadastrar = cadastrar;
window.sair = sair;
window.carregarFiliais = carregarFiliais;
window.toggleSenha = toggleSenha;


async function carregarAdminJogos(){

  const div =
    document.getElementById(
      "adminJogos"
    );

  if(!div) return;

  const snapshot =
    await getDocs(
      collection(db,"jogos")
    );

  div.innerHTML = "";

  snapshot.forEach(docSnap => {

    const jogo =
      docSnap.data();

    div.innerHTML += `

      <div style="
        border:1px solid #ddd;
        padding:15px;
        margin-bottom:10px;
        border-radius:10px;
      ">

        <strong>
          ${jogo.timeA}
          x
          ${jogo.timeB}
        </strong>

        <br><br>

        <input
          id="realA_${jogo.id}"
          type="number"
          min="0"
          style="width:60px;"
        >

        X

        <input
          id="realB_${jogo.id}"
          type="number"
          min="0"
          style="width:60px;"
        >

        <button
          onclick="salvarResultado(${jogo.id})"
        >
          Salvar Resultado
        </button>

      </div>

    `;

  });

}

async function salvarResultado(idJogo){

  const placarRealA =
    Number(
      document.getElementById(
        `realA_${idJogo}`
      ).value
    );

  const placarRealB =
    Number(
      document.getElementById(
        `realB_${idJogo}`
      ).value
    );

  const jogos =
    await getDocs(
      collection(db,"jogos")
    );

  jogos.forEach(async docSnap => {

    const jogo =
      docSnap.data();

    if(jogo.id === idJogo){

      await setDoc(
        doc(
          db,
          "jogos",
          docSnap.id
        ),
        {
          ...jogo,
          placarRealA,
          placarRealB,
          encerrado:true
        }
      );

    }

  });

  alert(
    "Resultado salvo!"
  );

}

window.carregarAdminJogos =
  carregarAdminJogos;

window.salvarResultado =
  salvarResultado;

async function carregarRanking(){

  const top5 =
    document.getElementById(
      "rankingTop5"
    );

  const rankingCompleto =
    document.getElementById(
      "rankingCompleto"
    );

  if(!top5 || !rankingCompleto)
    return;

  const snapshot =
    await getDocs(
      collection(db,"usuarios")
    );

  let usuarios = [];

  snapshot.forEach(doc => {

    usuarios.push(
      doc.data()
    );

  });

  usuarios.sort(
    (a,b) =>
      (b.pontos || 0) -
      (a.pontos || 0)
  );

  let htmlTop5 = "";
  let htmlLista = "";

  usuarios.slice(0,5)
    .forEach((u,index) => {

      const medalhas = [
        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🏅"
      ];

      htmlTop5 += `

        <div class="ranking-top">

          <strong>
            ${medalhas[index]}
            ${index + 1}º Lugar
          </strong>

          <br>

          ${u.nome}

          <br>

          ${u.pontos || 0} pts

        </div>

      `;

    });

  usuarios.slice(5,20)
    .forEach((u,index) => {

      htmlLista += `

        <div class="ranking-item">

          ${index + 6}º

          -

          ${u.nome}

          <strong>
            (${u.pontos || 0} pts)
          </strong>

        </div>

      `;

    });

  top5.innerHTML =
    htmlTop5;

  rankingCompleto.innerHTML =
    htmlLista;

}

async function carregarRankingEmpresas(){

  const tabela =
    document.getElementById(
      "rankingEmpresaTabela"
    );

  if(!tabela) return;

  const snapshot =
    await getDocs(
      collection(db,"usuarios")
    );

  const empresas = {};

  snapshot.forEach(doc => {

    const u = doc.data();

    if(!u.empresa){
      return;
    }

    if(!empresas[u.empresa]){

      empresas[u.empresa] = 0;

    }

    empresas[u.empresa] +=
      Number(u.pontos || 0);

  });

  const ranking =
    Object.entries(empresas)
      .sort((a,b) => b[1] - a[1]);

  let html = "";

  if(ranking.length === 0){

    html = `
      <div class="ranking-item">
        Nenhuma empresa encontrada.
      </div>
    `;

  }else{

    ranking.forEach(
      (empresa,index) => {

        html += `

          <div class="ranking-item">

            ${index + 1}º

            -

            ${empresa[0]}

            <strong>
              (${empresa[1]} pts)
            </strong>

          </div>

        `;

      }
    );

  }

  tabela.innerHTML = html;

}

async function carregarPerfil(){

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      )
    );

  if(!usuario) return;

  const perfil =
    document.getElementById(
      "perfilDados"
    );

  perfil.innerHTML = `

    <div class="perfil-item">
      <strong>Nome:</strong>
      ${usuario.nome}
    </div>

    <div class="perfil-item">
      <strong>Empresa:</strong>
      ${usuario.empresa}
    </div>

    <div class="perfil-item">
      <strong>Filial:</strong>
      ${usuario.filial}
    </div>

    <div class="perfil-item">
      <strong>E-mail:</strong>
      ${usuario.email}
    </div>

    <div class="perfil-item">
      <strong>Pontos:</strong>
      ${usuario.pontos || 0}
    </div>

  `;

}
