import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { db } from "./firebase.js";



// ======================================
// RESULTADO OFICIAL DOS EXTRAS
// ======================================

const REF_EXTRAS = doc(
    db,
    "extras_resultado",
    "oficial"
);


window.REF_EXTRAS = REF_EXTRAS;


// ======================================
// SALVAR RESULTADO OFICIAL DOS EXTRAS
// ======================================

async function salvarResultadoExtras(){

    const dados = {

        campeao:
            document.getElementById(
                "resCampeao"
            ).value,

        vice:
            document.getElementById(
                "resVice"
            ).value,

        artilheiro:
            document.getElementById(
                "resArtilheiro"
            ).value,

        golsBrasil:
            Number(
                document.getElementById(
                    "resGolsBrasil"
                ).value
            ),

        faseBrasil:
            document.getElementById(
                "resFaseBrasil"
            ).value

    };

    await setDoc(

        REF_EXTRAS,

        dados,

        {

            merge:true

        }

    );

    alert(
        "✅ Resultado oficial salvo!"
    );

}

window.salvarResultadoExtras =
    salvarResultadoExtras;