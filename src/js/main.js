// 1. Importar Firebase
import { db } from './firebase.js';

// 2. Importar Templates (Apenas os que tens na pasta)
import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';

// Páginas de Configuração
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

document.addEventListener('DOMContentLoaded', () => {
    // A. Gerir Loader
    const loader = document.getElementById('app-loader');
    setTimeout(() => { 
        if (loader) loader.classList.add('hidden'); 
    }, 800);

    // B. Renderizar Estrutura Base
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    // C. Função de Navegação
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // D. Ligar os Eventos
    const bindEvents = (currentTemplate) => {
        
        // --- EVENTOS
