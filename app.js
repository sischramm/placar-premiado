import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

}
  carregarJogos();

};

function abrirAba(nome){
  alert("Abrir aba: " + nome);
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

async function importarJogos(){

  const jogos = [

    {
      id:1,
      fase:"Grupos",
      grupo:"A",
      timeA:"México",
      timeB:"África do Sul",
      dataHora:"2026-06-11 16:00:00"
    },

    {
      id:2,
      fase:"Grupos",
      grupo:"A",
      timeA:"Coreia do Sul",
      timeB:"República Tcheca",
      dataHora:"2026-06-11 23:00:00"
    }

  ];

  for(const jogo of jogos){

    await addDoc(
      collection(db,"jogos"),
      {
        ...jogo,
        encerrado:false,
        placarRealA:null,
        placarRealB:null
      }
    );

  }

  alert("Jogos importados!");

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

  snapshot.forEach(doc => {

    const jogo = doc.data();

    lista.innerHTML += `
    
      <div
        style="
          border:1px solid #ddd;
          padding:15px;
          margin-bottom:15px;
          border-radius:10px;
          background:#fff;
          color:#000;
        "
      >

        <h3>
          ${jogo.timeA}
          X
          ${jogo.timeB}
        </h3>

        <div>
          Grupo:
          ${jogo.grupo}
        </div>

        <div>
          ${jogo.dataHora}
        </div>

        <br>

<input
  id="a_${jogo.id}"
  type="number"
  min="0"
  max="99"
  step="1"
  value="0"
  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
  style="width:70px;"
>

X

<input
  id="b_${jogo.id}"
  type="number"
  min="0"
  max="99"
  step="1"
  value="0"
  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
  style="width:70px;"
>

<br><br>

<button onclick="salvarPalpite(${jogo.id})">
  Salvar Palpite
</button>

      </div>

    `;

  });

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

    await addDoc(
      collection(db,"palpites"),
      {
        usuario: usuario.email,
        jogoId: idJogo,
        placarA,
        placarB,
        criadoEm: new Date()
      }
    );

    alert(
      "Palpite salvo!"
    );

  }catch(erro){

    console.error(erro);

    alert(
      "Erro ao salvar."
    );

  }

}

window.salvarPalpite =
  salvarPalpite;
