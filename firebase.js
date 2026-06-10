import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4PWHWsENLuUPnBVIzo8U8nkDXVA2fTqI",
  authDomain: "novo-placar-premiado.firebaseapp.com",
  projectId: "novo-placar-premiado",
  storageBucket: "novo-placar-premiado.firebasestorage.app",
  messagingSenderId: "597865499198",
  appId: "1:597865499198:web:fe2274064f70f681bd5f6f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
