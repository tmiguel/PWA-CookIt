import { db } from './firebase.js';
import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';
import { getTags, addTag, deleteTag } from './services/tags-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('app-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 500);

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
        const btnShopping = document.getElementById('nav-shopping');
        const btnRecipes = document.getElementById('nav-recipes');
        const btnSettings = document.getElementById('nav-settings');

        if (btnShopping) btnShopping.onclick = () => setView(shoppingListTemplate);
        if (btnRecipes) btnRecipes.onclick = () => setView(recipesTemplate);
        if (btnSettings) btnSettings.onclick = () => setView(settingsTemplate);

        if (currentTemplate === settingsTemplate) {
            const btnTags = document.getElementById('btn-manage-tags');
            const btnUnits = document.getElementById('btn-manage-units');
            const btnAreas = document.getElementById('btn-manage-areas');

            if (btnTags) btnTags.onclick = () => setView(tagsTemplate);
            if (btnUnits) btnUnits.onclick = () => setView(unitsTemplate);
            if (btnAreas) btnAreas.onclick = () => setView(areasTemplate);
        }

        if (currentTemplate === tagsTemplate) {
            document.getElementById('btn-back-settings-tags').onclick = () => setView(settingsTemplate);

            const listEl = document.getElementById('tags-list');
            const inputCode = document.getElementById('input-tag-code');
            const inputName = document.getElementById('input-tag-name');
            const addBtn = document.getElementById('btn-add-tag');
            const errorMsg = document.getElementById('tag-error-msg');

            const renderTags = async () => {
                listEl.innerHTML = '<li style="text-align:center; padding:10px;">A atualizar...</li>';
                try {
                    const tags = await getTags();
                    listEl.innerHTML = '';
                    if (tags.length === 0) {
                        listEl.innerHTML = '<li style="text-align:center; padding:20px;">Sem tags definidas.</li>';
                        return;
                    }
                    tags.forEach(tag => {
                        const li = document.createElement('li');
                        li.className = 'manage-item';
                        li.innerHTML = `
                            <div style="flex:1;">
                                <strong style="color:var(--primary-color); margin-right:8px;">[${tag.code}]</strong>
                                <span>${tag.name || ''}</span>
                            </div>
                            <button class="btn-delete" style="color:red; border:none; background:none; font-size:1.2rem;">🗑️</button>
                        `;
                        li.querySelector('.btn-delete').onclick = async () => {
                            if(confirm(`Apagar tag "[${tag.code}]"?`)) {
                                await deleteTag(tag.id);
                                renderTags();
                            }
                        };
                        listEl.appendChild(li);
                    });
                } catch (err) {
                    listEl.innerHTML = '<li style="color:red; text-align:center;">Erro ao carregar dados.</li>';
                }
            };

            addBtn.onclick = async () => {
                const code = inputCode.value;
                const name = inputName.value;
                errorMsg.style.display = 'none';
                errorMsg.innerText = '';
                addBtn.disabled = true;
                addBtn.innerText = '...';

                try {
                    await addTag(code, name);
                    inputCode.value = '';
                    inputName.value = '';
                    renderTags();
                } catch (error) {
                    errorMsg.innerText = error.message;
                    errorMsg.style.display = 'block';
                } finally {
                    addBtn.disabled = false;
                    addBtn.innerText = 'Adicionar Tag';
                }
            };

            renderTags();
        }

        if (currentTemplate === unitsTemplate) {
            document.getElementById('btn-back-settings-units').onclick = () => setView(settingsTemplate);
        }
        if (currentTemplate === areasTemplate) {
            document.getElementById('btn-back-settings-areas').onclick = () => setView(settingsTemplate);
        }
    };

    setView(settingsTemplate);
});
