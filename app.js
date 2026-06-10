window.onload = function() {

  const home = document.getElementById("homeInicial");
  const login = document.getElementById("loginSistema");
  const topo = document.getElementById("topoSistema");
  const sistema = document.getElementById("sistemaCompleto");

  if(home) home.style.display = "flex";
  if(login) login.style.display = "none";
  if(topo) topo.style.display = "none";
  if(sistema) sistema.style.display = "none";

};

function abrirAba(nome){
  alert("Abrir aba: " + nome);
}

function sair(){
  localStorage.clear();
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

function login(){
  alert("Login será conectado ao Firebase");
}

function cadastrar(){
  alert("Cadastro será conectado ao Firebase");
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

}

function abrirCadastro() {

  document.getElementById("homeInicial").style.display = "none";

  document.getElementById("loginSistema").style.display = "grid";

  setTimeout(() => {
    document.getElementById("nome").focus();
  }, 100);

}
