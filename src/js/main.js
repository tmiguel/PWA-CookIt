// --- TESTE DE SEGURANÇA ---
// import { db } from './firebase.js'; // ❌ DESLIGADO TEMPORARIAMENTE

import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';

// import { tagsTemplate } from './templates/tags.js'; // ❌ DESLIGADO
// import { unitsTemplate } from './templates/units.js'; // ❌ DESLIGADO
// import { areasTemplate } from './templates/areas.js'; // ❌ DESLIGADO

document.addEventListener('DOMContentLoaded', () => {
    // Tentar esconder o loader
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');

    // Renderizar App
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        
        // Re-ligar eventos básicos
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);
    };

    setView(settingsTemplate);
});
