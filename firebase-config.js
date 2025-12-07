// firebase-config.js
// Configuração e Inicialização do Firebase

// CHAVES REAIS DO PROJETO 'cookit-83f40'
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

// Obtém a referência do Firestore
const db = app.firestore();

console.log("Firebase e Firestore inicializados para o projeto: cookit-83f40");
