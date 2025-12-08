// router.js
// Lógica de Rotas (Hash Router Simples)

import { getCurrentUser } from './auth.js'; 
import { renderView } from './ui.js';

// Onde as rotas (hashes) e as views (IDs) são mapeadas
const routes = {
    '#login': 'view-login',
    '#recipes': 'view-recipes',
    '#add': 'view-form',
    '#shoppinglist': 'view-shoppinglist',
    '#settings': 'view-settings'
    // Outras rotas como #settings/tags serão tratadas pela view-settings
};

// --- Funções de Navegação ---

export function navigateTo(hash) {
    if (window.location.hash !== hash) {
        window.location.hash = hash;
    }
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash || '#recipes'; 
    const isAuthenticated = getCurrentUser() !== null;
    
    // Rota de Acesso: Redirecionar para Login se não estiver autenticado e a rota for protegida
    if (!isAuthenticated && hash !== '#login') {
        return navigateTo('#login');
    }
    
    // Se estiver logado e na página de login, redireciona para recipes
    if (isAuthenticated && hash === '#login') {
        return navigateTo('#recipes');
    }

    // Encontra a view correspondente
    const viewId = routes[hash.split('/')[0]]; // Ignora sub-rotas como #settings/tags
    
    if (viewId) {
        renderView(viewId, hash); // Chama a função de UI para trocar a vista
    } else {
        // Rota não encontrada
        renderView('view-recipes', '#recipes'); 
    }
}

// Listener principal
window.addEventListener('hashchange', handleRoute);

// Exposição do ID de utilizador para serviços (embora os dados sejam partilhados, é boa prática)
export function currentUserId() {
    return getCurrentUser() ? getCurrentUser().uid : null;
}
