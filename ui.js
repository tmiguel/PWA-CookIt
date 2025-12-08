// ui.js
// Lógica de Manipulação da Interface (DOM/Views)

import { fetchAndRenderRecipes, gerarListaCompras } from './recipeService.js';
import { currentUserId } from './router.js';

// Mapeamento das views HTML
const views = {
    'view-login': document.getElementById('view-login'),
    'view-recipes': document.getElementById('view-recipes'),
    'view-form': document.getElementById('view-form'),
    'view-shoppinglist': document.getElementById('view-shoppinglist'),
    'view-settings': document.getElementById('view-settings')
};

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
    const settingsSubView = document.getElementById('settings-sub-view');
    
    // Simplesmente injeta um título (a lógica de CRUD virá do configService)
    if (subRoute === 'tags') {
        settingsSubView.innerHTML = '<h3>Gestão de Tags</h3><p>CRUD de tags aqui.</p>';
    } else if (subRoute === 'units') {
        settingsSubView.innerHTML = '<h3>Gestão de Unidades</h3><p>CRUD de unidades aqui.</p>';
    } else {
         settingsSubView.innerHTML = '<p>Selecione uma opção de configuração.</p>';
    }
    }
