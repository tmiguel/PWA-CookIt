// router.js (Versão Final de Estabilidade)

import { getCurrentUser } from './auth.js'; 
import { renderView } from './ui.js';

// Mapeamento de rotas para IDs de views no index.html
const routes = {
    '#login': 'view-login',
    '#recipes': 'view-recipes',
    '#add': 'view-form',
    '#shoppinglist': 'view-shoppinglist',
    '#settings': 'view-settings'
};

// --- Funções de Navegação ---

export function navigateTo(hash) {
    if (window.location.hash !== hash) {
        window.location.hash = hash;
    }
    handleRoute();
}

// Handler principal de rotas
function handleRoute() {
    const hash = window.location.hash || '#recipes'; 
    const isAuthenticated = getCurrentUser() !== null;
    
    // 1. Rota de Acesso (Gatekeeper)
    if (!isAuthenticated && hash !== '#login') {
        return navigateTo('#login');
    }
    
    // 2. Redirecionamento de Login
    if (isAuthenticated && hash === '#login') {
        return navigateTo('#recipes');
    }

    // 3. Encontrar a view correta
    const routeKey = hash.split('/')[0]; 
    const viewId = routes[routeKey];
    
    if (viewId) {
        renderView(viewId, hash); 
        updateActiveLink(routeKey); 
    } else {
        renderView('view-recipes', '#recipes'); 
    }
}

// Aplica a classe 'active-link' ao link da navegação atual
function updateActiveLink(currentRoute) {
    const navLinks = document.querySelectorAll('#bottom-nav-bar a');
    
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        
        if (link.getAttribute('href') === currentRoute) {
            link.classList.add('active-link');
        }
    });
}

// Listener de hash
window.addEventListener('hashchange', handleRoute);
// Não há chamada inicial, o auth.js irá chamar o navigateTo na inicialização
