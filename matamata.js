const jogos = [

{

id:1,

data:"28/06",

hora:"15:30",

timeA:"Brasil",

bandeiraA:"🇧🇷",

timeB:"Uruguai",

bandeiraB:"🇺🇾"

},

{

id:2,

data:"28/06",

hora:"18:00",

timeA:"Argentina",

bandeiraA:"🇦🇷",

timeB:"México",

bandeiraB:"🇲🇽"

}

];

window.onload=()=>{

const div=document.getElementById("jogosContainer");

div.innerHTML="";

jogos.forEach(j=>{

div.innerHTML+=`

<div class="cardJogo">

<div class="data">

${j.data} • ${j.hora}

</div>

<div class="times">

<div class="time"

onclick="selecionar(${j.id},'A')">

<div class="flag">

${j.bandeiraA}

</div>

<div>

${j.timeA}

</div>

</div>

<div class="vs">

X

</div>

<div class="time"

onclick="selecionar(${j.id},'B')">

<div class="flag">

${j.bandeiraB}

</div>

<div>

${j.timeB}

</div>

</div>

</div>

<div
class="formas"
id="formas${j.id}"

style="display:none;">

<button>

Tempo Normal

</button>

<button>

Prorrogação

</button>

<button>

Pênaltis

</button>

</div>

<button class="salvar">

💾 Salvar Palpite

</button>

</div>

`;

});

}

function selecionar(id){

document
.getElementById("formas"+id)
.style.display="flex";

}

window.selecionar=selecionar;
