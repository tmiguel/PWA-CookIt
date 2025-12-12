import { db } from './firebase.js';

// Templates
import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';

// Sub-páginas
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

// SERVIÇOS (Importar a lógica de dados)
import { getTags, addTag, deleteTag } from './services/tags-service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('app-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 500);

    // Render Base
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    if (headerContainer) headerContainer.innerHTML = headerTemplate;
    if (navContainer) navContainer.innerHTML = bottomNavTemplate;

    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    const bindEvents = (currentTemplate) => {
        // --- MENU GLOBAL ---
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);

        // --- CONFIGURAÇÃO ---
        if (currentTemplate === settingsTemplate) {
            document.getElementById('btn-manage-tags').onclick = () => setView(tagsTemplate);
            document.getElementById('btn-manage-units').onclick = () => setView(unitsTemplate);
            document.getElementById('btn-manage-areas').onclick = () => setView(areasTemplate);
        }

        // --- SUB-PÁGINA: TAGS (LÓGICA CRUD) ---
        if (currentTemplate === tagsTemplate) {
            // 1. Voltar
            document.getElementById('btn-back-settings-tags').onclick = () => setView(settingsTemplate);

            const listEl = document.getElementById('tags-list');
            const inputEl = document.getElementById('input-new-tag');
            const addBtn = document.getElementById('btn-add-tag');

            // 2. Função para desenhar a lista
            const renderTags = async () => {
                listEl.innerHTML = '<li style="text-align:center; padding:10px;">A atualizar...</li>';
                const tags = await getTags();
                
                listEl.innerHTML = ''; // Limpar
                
                if (tags.length === 0) {
                    listEl.innerHTML = '<li style="text-align:center; padding:20px;">Sem tags ainda.</li>';
                    return;
                }

                tags.forEach(tag => {
                    const li = document.createElement('li');
                    li.className = 'manage-item'; // Classe CSS que já criámos antes
                    li.innerHTML = `
                        <span class="manage-item-text">${tag.name}</span>
                        <button class="btn-delete" style="color:red; border:none; background:none; font-size:1.2rem;">🗑️</button>
                    `;
                    
                    // Botão Apagar
                    li.querySelector('.btn-delete').onclick = async () => {
                        if(confirm(`Apagar "${tag.name}"?`)) {
                            await deleteTag(tag.id);
                            renderTags(); // Recarregar lista
                        }
                    };
                    listEl.appendChild(li);
                });
            };

            // 3. Adicionar Tag
            addBtn.onclick = async () => {
                const val = inputEl.value.trim();
                if (val) {
                    await addTag(val);
                    inputEl.value = ''; // Limpar input
                    renderTags(); // Recarregar lista
                }
            };

            // Carregar dados iniciais
            renderTags();
        }

        // --- OUTRAS PÁGINAS (Vazias por enquanto) ---
        if (currentTemplate === unitsTemplate) {
            document.getElementById('btn-back-settings-units').onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === areasTemplate) {
            document.getElementById('btn-back-settings-areas').onclick = () => setView(settingsTemplate);
        }
    };

    // Iniciar
    setView(settingsTemplate);
});
