// firebase-config.js
// Configuração e Inicialização do Firebase (Versão Modular)

// ATENÇÃO: É necessário ter os SKDs de app, firestore e auth importados no index.html via script tags CDN!

const firebaseConfig = {
    apiKey: "AIzaSyAfjc7Z0U4w7HRJUJuYVpMnqhozcZMHgww",
    authDomain: "cookit-83f40.firebaseapp.com",
    projectId: "cookit-83f40",
    storageBucket: "cookit-83f40.firebasestorage.app",
    messagingSenderId: "620804753444",
    appId: "1:620804753444:web:15c1b12a9683cf117ff0b1",
    measurementId: "G-QE23KDSLS5"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);

// Obtém e EXPORTA as referências para uso em outros módulos
export const db = app.firestore();
export const auth = app.auth(); // NOVO: Exporta a instância de Auth

console.log("Firebase, Firestore e Auth inicializados e exportados.");

// Nota: O teste de conexão foi movido para o recipeService.js ou ui.js
