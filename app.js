import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
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
    // COLE AQUI OS 72 JOGOS
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

  for (const documento of snapshot.docs) {

    const jogo = documento.data();

    const usuario =
  JSON.parse(
    localStorage.getItem(
      "usuarioLogado"
    )
  );

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

    const agora =
      new Date();

    const dataJogo =
      new Date(
        jogo.dataHora
          .replace(" ","T")
      );

    const bloqueado =
      agora >= dataJogo;

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
          value="${placarSalvoA}"
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
          value="${placarSalvoB}"
          oninput="this.value=this.value.replace(/[^0-9]/g,'')"
          style="width:70px;"
        >

        <br><br>

        ${bloqueado
        ? `
        <button disabled>
          Encerrado
        </button>
        `
        : `
        <button onclick="salvarPalpite(${jogo.id})">
          Salvar Palpite
        </button>
        `
        }

      </div>

    `;

  }

  await atualizarProgresso();

}

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
