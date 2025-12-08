// auth.js
// Lógica de Autenticação (Login/Logout e Listener Principal)

// Nota: A variável global 'firebase' é fornecida pelo script tag CDN no index.html.
import { auth } from './firebase-config.js'; 
import { navigateTo } from './router.js'; 
import { renderView } from './ui.js';

let currentUser = null;

// Funções de Ação do Utilizador (Listeners para o DOM)
document.getElementById('btn-logout').addEventListener('click', () => {
    logout();
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = 'A tentar entrar...';

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            messageEl.textContent = 'Login bem-sucedido!';
        })
        .catch(error => {
            messageEl.textContent = `Erro de Login: ${error.message}`;
        });
});

document.getElementById('login-google').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => {
            document.getElementById('auth-message').textContent = `Erro no Login Google: ${error.message}`;
        });
});

// --- NOVO: Função de Inicialização (Chamada pelo main.js) ---
export function initAuth() {
    // onAuthStateChanged: O Listener principal que decide a rota
    auth.onAuthStateChanged((user) => {
        // 1. Mostra o contentor principal (escondido pelo CSS)
        document.getElementById('app-container').classList.add('visible'); 
        
        currentUser = user;

        const appContent = document.getElementById('app-content');
        const bottomNav = document.getElementById('bottom-nav-bar');

        if (user) {
            // Logado: Mostra a UI principal
            appContent.style.display = 'block';
            bottomNav.style.display = 'flex';
            
            // Redireciona para a rota principal se estiver na rota de login
            if (window.location.hash === '#login' || window.location.hash === '') {
                navigateTo('#recipes');
            } else {
                // Caso contrário, tenta carregar a rota atual
                navigateTo(window.location.hash);
            }
        } else {
            // Não Logado: Mostra o ecrã de Login
            appContent.style.display = 'none';
            bottomNav.style.display = 'none';
            navigateTo('#login');
        }
    });
}

// --- Funções Exportadas ---
export function logout() {
    return auth.signOut();
}

export function getCurrentUser() {
    return currentUser;
}
