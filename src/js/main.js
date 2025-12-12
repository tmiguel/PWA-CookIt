// 1. Importar Firebase para iniciar conexão
import { db } from './firebase.js';

// 2. Importar Templates
import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { addRecipeTemplate } from './templates/add-recipe.js';

// Novas páginas
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('app-loader');
    setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 500);

    // Renderizar Shell
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    // Função de Navegação
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // Binding de Eventos
    const bindEvents = (currentTemplate) => {
        // Menu Principal
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);

        // Página: Configurações (Navegação para sub-páginas)
        if (currentTemplate === settingsTemplate) {
            document.getElementById('btn-manage-tags').onclick = () => setView(tagsTemplate);
            document.getElementById('btn-manage-units').onclick = () => setView(unitsTemplate);
            document.getElementById('btn-manage-areas').onclick = () => setView(areasTemplate);
        }

        // Sub-páginas: Voltar para Configurações
        if (currentTemplate === tagsTemplate) {
            document.getElementById('btn-back-settings-tags').onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === unitsTemplate) {
            document.getElementById('btn-back-settings-units').onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === areasTemplate) {
            document.getElementById('btn-back-settings-areas').onclick = () => setView(settingsTemplate);
        }

        // Página: Receitas
        if (currentTemplate === recipesTemplate) {
            const btnNew = document.getElementById('btn-new-recipe');
            if (btnNew) btnNew.onclick = () => setView(addRecipeTemplate);
        }

        // Página: Add Receita
        if (currentTemplate === addRecipeTemplate) {
            const btnCancel = document.getElementById('btn-cancel-add');
            if (btnCancel) btnCancel.onclick = () => setView(recipesTemplate);
        }
    };

    // Iniciar na Configuração para validares a conexão
    setView(settingsTemplate);
});
