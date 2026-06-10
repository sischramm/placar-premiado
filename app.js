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

  document.getElementById("nome").focus();

}
