// =====================================
// RESULTADOS OFICIAIS
// =====================================

async function abrirResultados(){

    const aba =
        document.getElementById("abaResultados");

    const html =
        await fetch("resultados.html");

    aba.innerHTML =
        await html.text();

    carregarResultadosNovo();

}
