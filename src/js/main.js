// import { db } from './firebase.js'; // ❌ DESLIGADO (Causa do erro)

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
    // 1. Esconder Loader (Manual)
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');

    // 2. Renderizar Base
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    // 3. Função Navegar
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // 4. Ligar Botões
    const bindEvents = (currentTemplate) => {
        
        // Menu Rodapé
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);

        // Página Configurações
        if (currentTemplate === settingsTemplate) {
            const btnTags = document.getElementById('btn-manage-tags');
            const btnUnits = document.getElementById('btn-manage-units');
            const btnAreas = document.getElementById('btn-manage-areas');

            if (btnTags) btnTags.onclick = () => setView(tagsTemplate);
            if (btnUnits) btnUnits.onclick = () => setView(unitsTemplate);
            if (btnAreas) btnAreas.onclick = () => setView(areasTemplate);
        }

        // Botões "Voltar" das Sub-páginas
        if (currentTemplate === tagsTemplate) {
            const back = document.getElementById('btn-back-settings-tags');
            if (back) back.onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === unitsTemplate) {
            const back = document.getElementById('btn-back-settings-units');
            if (back) back.onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === areasTemplate) {
            const back = document.getElementById('btn-back-settings-areas');
            if (back) back.onclick = () => setView(settingsTemplate);
        }
    };

    // Iniciar na Configuração
    setView(settingsTemplate);
});
