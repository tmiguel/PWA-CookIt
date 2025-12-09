// ui.js
// Lógica de Manipulação da Interface (DOM/Views)

import { fetchAndRenderRecipes, gerarListaCompras } from './recipeService.js';
import { renderConfigCRUD } from './configService.js';

// Mapeamento das views HTML
const views = {
    'view-login': document.getElementById('view-login'),
    'view-recipes': document.getElementById('view-recipes'),
    'view-form': document.getElementById('view-form'),
    'view-shoppinglist': document.getElementById('view-shoppinglist'),
    'view-settings': document.getElementById('view-settings')
};

// --- NOVO: Funções de Controlo do Loader ---
const loadingOverlay = document.getElementById('loading-overlay');

export function showLoader(message = 'A processar...') {
    loadingOverlay.querySelector('p:first-child').textContent = message;
    loadingOverlay.style.display = 'flex';
}

export function hideLoader() {
    loadingOverlay.style.display = 'none';
}
// --- FIM: Funções de Controlo do Loader ---

// Função de troca de view
export function renderView(viewId, fullHash) {
    // 1. Oculta todas as views
    Object.values(views).forEach(view => {
        if(view) view.style.display = 'none';
    });

    // 2. Mostra a view correta
    const targetView = views[viewId];
    if (targetView) {
        targetView.style.display = 'block';
    } else {
        console.error(`View ${viewId} não encontrada.`);
        return;
    }

    // 3. Executa lógica específica da view
    if (viewId === 'view-recipes') {
        fetchAndRenderRecipes();
    } else if (viewId === 'view-shoppinglist') {
        gerarListaCompras();
    } else if (viewId === 'view-settings') {
        handleSettingsSubRoute(fullHash);
    }
}

// Manipulação de sub-rotas de Configurações (#settings/tags ou #settings/units)
function handleSettingsSubRoute(hash) {
    const subRoute = hash.split('/')[1] || 'tags'; // Padrão para #settings/tags
    
    if (subRoute === 'tags') {
        renderConfigCRUD('tags'); 
    } else if (subRoute === 'units') {
        renderConfigCRUD('units');
    } else {
         document.getElementById('settings-sub-view').innerHTML = '<p>Selecione uma opção de configuração.</p>';
    }
}
