// =======================================
// RESULTADOS OFICIAIS
// Grupo Shark - Copa 2026
// Versão 2
// =======================================

function imagemBandeira(sigla){

    if(!window.FLAGS) return "";

    const codigo = window.FLAGS[sigla];

    if(!codigo) return "";

    return `https://flagcdn.com/w80/${codigo}.png`;

}
