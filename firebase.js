import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {

  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ==============================================
// FIREBASE PRINCIPAL
// ==============================================

const firebasePrincipal = {

  apiKey: "AIzaSyC4PWHWsENLuUPnBVIzo8U8nkDXVA2fTqI",
  authDomain: "novo-placar-premiado.firebaseapp.com",
  projectId: "novo-placar-premiado",
  storageBucket: "novo-placar-premiado.firebasestorage.app",
  messagingSenderId: "597865499198",
  appId: "1:597865499198:web:fe2274064f70f681bd5f6f"

};


// ==============================================
// FIREBASE MATA-MATA
// ==============================================

const firebaseMata = {

  apiKey: "AIzaSyC92ucYcknsMjYknvXXVRxiVkHu2SmJrCU",
  authDomain: "placar-premiado-mata.firebaseapp.com",
  projectId: "placar-premiado-mata",
  storageBucket: "placar-premiado-mata.firebasestorage.app",
  messagingSenderId: "834430772323",
  appId: "1:834430772323:web:be92b48f7dd951f718c456"

};


// Apps

const appPrincipal = initializeApp(firebasePrincipal);

const appMata = initializeApp(firebaseMata,"mata");


// Databases

const db = getFirestore(appPrincipal);

const dbMata = getFirestore(appMata);


// Window

window.db = db;

window.dbMata = dbMata;

window.collection = collection;

window.doc = doc;

window.getDoc = getDoc;

window.getDocs = getDocs;

window.setDoc = setDoc;

window.addDoc = addDoc;

window.serverTimestamp = serverTimestamp;
