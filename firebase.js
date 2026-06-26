import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================
// FIREBASE PRINCIPAL (FASE DE GRUPOS)
// ======================================

const firebasePrincipal = {

    apiKey: "AIzaSyC4PWHWsENLuUPnBVIzo8U8nkDXVA2fTqI",
    authDomain: "novo-placar-premiado.firebaseapp.com",
    projectId: "novo-placar-premiado",
    storageBucket: "novo-placar-premiado.firebasestorage.app",
    messagingSenderId: "597865499198",
    appId: "1:597865499198:web:fe2274064f70f681bd5f6f"

};

// ======================================
// FIREBASE MATA-MATA
// ======================================

const firebaseMata = {

    apiKey: "AIzaSyC92ucYcknsMjYknvXXVRxiVkHu2SmJrCU",
    authDomain: "placar-premiado-mata.firebaseapp.com",
    projectId: "placar-premiado-mata",
    storageBucket: "placar-premiado-mata.firebasestorage.app",
    messagingSenderId: "834430772323",
    appId: "1:834430772323:web:be92b48f7dd951f718c456"

};

// ======================================
// Inicialização
// ======================================

const appPrincipal = initializeApp(firebasePrincipal);

const appMata = initializeApp(firebaseMata, "mata");

// ======================================
// Bancos
// ======================================

export const db = getFirestore(appPrincipal);

export const dbMata = getFirestore(appMata);

// ======================================
// Principal
// ======================================

window.db = db;

// ======================================
// Mata-Mata
// ======================================

window.dbMata = dbMata;

// ======================================
// Firestore
// ======================================

window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;

window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.serverTimestamp = serverTimestamp;
