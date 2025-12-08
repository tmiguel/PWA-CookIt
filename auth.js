// auth.js
// Lógica de Autenticação (Login/Logout e Listener Principal)

// Importa as instâncias de Auth e Firestore (se necessário, mas Auth é o foco)
import { auth, db } from './firebase-config.js'; 
import { navigateTo, currentUserId } from './router.js'; 
import { hideSplashScreen, renderView } from './ui.js';

// Variável para armazenar o UID do utilizador logado
let currentUser = null;

// Função de Inicialização: O novo "Entry Point" da PWA
auth.onAuthStateChanged((user) => {
    // 1. Esconde a tela de carregamento (mostra o app-container)
    hideSplashScreen(); 
    
    // 2. Define o utilizador atual
    currentUser = user;

    if (user) {
        // Logado: Carrega a UI principal
        console.log("Utilizador logado:", user.uid);
        document.getElementById('app-content').style.display = 'block';
        document.getElementById('bottom-nav-bar').style.display = 'flex';
        
        // Se estiver em #login, redireciona para a rota inicial (#recipes)
        if (window.location.hash === '#login' || window.location.hash === '') {
            navigateTo('#recipes');
        } else {
            // Se já estiver numa rota, apenas a carrega
            navigateTo(window.location.hash);
        }
    } else {
        // Não Logado: Mostra o ecrã de Login
        console.log("Utilizador deslogado.");
        document.getElementById('app-content').style.display = 'none';
        document.getElementById('bottom-nav-bar').style.display = 'none';
        navigateTo('#login');
    }
});

// --- Funções de Ação do Utilizador ---

// Login Email/Password
export function loginWithEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// Login Google (Social)
export function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
}

// Logout
export function logout() {
    return auth.signOut();
}

// Exposição do estado de autenticação para outros módulos
export function getCurrentUser() {
    return currentUser;
      }
