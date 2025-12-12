// 1. Importar Firebase (AGORA ATIVO)
import { db } from './firebase.js';

// 2. Importar Templates
import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';

// Sub-páginas
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

document.addEventListener('DOMContentLoaded', () => {
    // A. Esconder Loader
    const loader = document.getElementById('app-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 500);

    // B. Renderizar Base
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    // C. Função Navegar
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // D. Eventos e Lógica
    const bindEvents = (currentTemplate) => {
        
        // --- MENU PRINCIPAL ---
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);

        // --- PÁGINA CONFIGURAÇÕES ---
        if (currentTemplate === settingsTemplate) {
            const btnTags = document.getElementById('btn-manage-tags');
            const btnUnits = document.getElementById('btn-manage-units');
            const btnAreas = document.getElementById('btn-manage-areas');

            if (btnTags) btnTags.onclick = () => setView(tagsTemplate);
            if (btnUnits) btnUnits.onclick = () => setView(unitsTemplate);
            if (btnAreas) btnAreas.onclick = () => setView(areasTemplate);
        }

        // --- SUB-PÁGINA: TAGS (TESTE DE CONEXÃO) ---
        if (currentTemplate === tagsTemplate) {
            const container = document.getElementById('tags-container');
            const btnBack = document.getElementById('btn-back-settings-tags');
            
            // Teste Visual: Se 'db' existir, mostrar sucesso
            if (db) {
                container.innerHTML = `<p style="color:green; font-weight:bold;">🔥 Firestore Ligado!</p>`;
                console.log("Firestore Object:", db);
            } else {
                container.innerHTML = `<p style="color:red;">Erro na conexão.</p>`;
            }

            if (btnBack) btnBack.onclick = () => setView(settingsTemplate);
        }

        // --- OUTRAS SUB-PÁGINAS ---
        if (currentTemplate === unitsTemplate) {
            document.getElementById('btn-back-settings-units').onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === areasTemplate) {
            document.getElementById('btn-back-settings-areas').onclick = () => setView(settingsTemplate);
        }
    };

    // Iniciar na Configuração
    setView(settingsTemplate);
});
