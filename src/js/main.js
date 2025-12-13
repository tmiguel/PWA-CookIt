import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { loginTemplate } from './templates/login.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';
import { ingredientsTemplate } from './templates/ingredients.js';

import { monitorAuthState, loginWithGoogle, logout, finishRedirectLogin } from './services/auth-service.js';
import * as TagService from './services/tags-service.js';
import * as UnitService from './services/units-service.js';
import * as AreaService from './services/areas-service.js';
import * as ShopService from './services/shopping-service.js';
import * as IngredientService from './services/ingredients-service.js';

document.addEventListener('DOMContentLoaded', () => {
    
    finishRedirectLogin();

    const loader = document.getElementById('app-loader');
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            if (!headerContainer.innerHTML) showLoginScreen(); 
        }
    }, 5000);

    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    const showLoginScreen = () => {
        if (loader) loader.classList.add('hidden');
        headerContainer.innerHTML = '';
        navContainer.innerHTML = '';
        mainContainer.innerHTML = loginTemplate;
        const btn = document.getElementById('btn-google-login');
        if (btn) btn.onclick = loginWithGoogle;
    };

    monitorAuthState((user) => {
        if (loader) loader.classList.add('hidden');

        if (!user) {
            showLoginScreen();
        } else {
            console.log("User:", user.email);
            headerContainer.innerHTML = headerTemplate;
            navContainer.innerHTML = bottomNavTemplate;

            if (!mainContainer.innerHTML || mainContainer.innerHTML.includes('Entrar')) {
                setView(shoppingListTemplate);
            }
        }
    });

    // --- LÓGICA DASHBOARD COMPRAS ---
    const setupShoppingList = async () => {
        const activeContainer = document.getElementById('active-list-container');
        const historyContainer = document.getElementById('history-list-container');
        const btnNew = document.getElementById('btn-new-list');

        const createTile = (list, isActive = false) => {
            let dateStr = "Recentemente";
            if (list.createdAt) dateStr = list.createdAt.toDate().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });

            const activeClass = isActive ? 'list-tile--active' : '';
            const statusIcon = isActive ? '🛒' : '🔒';
            const statusText = isActive ? 'A comprar...' : 'Fechada';

            return `
                <div class="list-tile ${activeClass}" onclick="alert('Abrir lista: ${list.name}')">
                    <div><h4>${list.name}</h4><span class="date">${dateStr}</span></div>
                    <div class="status"><span>${statusIcon}</span><span>${statusText}</span></div>
                </div>
            `;
        };

        try {
            const activeList = await ShopService.getActiveList();
            if (activeList) activeContainer.innerHTML = createTile(activeList, true);
            else activeContainer.innerHTML = `<div class="card" style="text-align:center; padding:20px; box-shadow:none; background:transparent; border:1px dashed var(--border-color);">Nenhuma lista ativa.</div>`;

            const historyLists = await ShopService.getHistoryLists(5);
            historyContainer.innerHTML = '';
            const filteredHistory = historyLists.filter(l => l.id !== (activeList?.id));

            if (filteredHistory.length === 0) historyContainer.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#666; font-size:0.9rem;">Sem histórico recente.</p>`;
            else filteredHistory.forEach(list => historyContainer.innerHTML += createTile(list, false));

        } catch (e) { console.error(e); }

        if (btnNew) {
            btnNew.onclick = async () => {
                const name = prompt("Nome da nova lista:");
                if (name) {
                    try { await ShopService.createList(name); setupShoppingList(); } 
                    catch (e) { alert("Erro: " + e.message); }
                }
            };
        }
    };

    // --- LÓGICA INGREDIENTES ---
    const setupIngredients = async () => {
        document.getElementById('btn-back-settings').onclick = () => setView(settingsTemplate);
        
        const listEl = document.getElementById('list-container');
        const inputCode = document.getElementById('input-code');
        const inputName = document.getElementById('input-name');
        const inputArea = document.getElementById('input-area-select');
        const btnAdd = document.getElementById('btn-add');
        const errorMsg = document.getElementById('error-msg');

        try {
            const areas = await AreaService.getAreas();
            inputArea.innerHTML = '<option value="">Escolher Área...</option>';
            areas.forEach(a => {
                inputArea.innerHTML += `<option value="${a.name}">${a.name}</option>`;
            });
        } catch (e) { inputArea.innerHTML = '<option value="">Erro áreas</option>'; }

        const render = async () => {
            listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#666;">A carregar...</li>';
            try {
                const items = await IngredientService.getIngredients();
                listEl.innerHTML = items.length ? '' : '<li style="text-align:center; padding:20px; color:#666;">Vazio.</li>';

                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'manage-item';
                    li.innerHTML = `
                        <div style="display:flex; align-items:center; flex:1;">
                            <span class="tag-code">${item.code}</span>
                            <div style="display:flex; flex-direction:column;">
                                <span style="font-weight:500; color:var(--text-color);">${item.name || ''}</span>
                                <span style="font-size:0.8rem; color:var(--text-muted);">📍 ${item.area}</span>
                            </div>
                        </div>
                        <button class="del-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    `;
                    li.querySelector('.del-btn').onclick = async () => { 
                        if(confirm(`Apagar "${item.name}"?`)) { 
                            await IngredientService.deleteIngredient(item.id); 
                            render(); 
                        }
                    };
                    listEl.appendChild(li);
                });
            } catch (e) { console.error(e); }
        };

        btnAdd.onclick = async () => {
            errorMsg.style.display = 'none';
            btnAdd.disabled = true;
            try {
                await IngredientService.addIngredient(inputCode.value, inputName.value, inputArea.value);
                inputCode.value = ''; inputName.value = ''; inputArea.value = ''; 
                render();
            } catch (e) { errorMsg.innerText = e.message; errorMsg.style.display = 'block'; }
            finally { btnAdd.disabled = false; }
        };
        render();
    };

    // --- LÓGICA CRUD GENÉRICO COM EDIÇÃO (Tags, Units, Areas) ---
    const setupGenericCrud = (service) => {
        document.getElementById('btn-back-settings').onclick = () => setView(settingsTemplate);
        
        const listEl = document.getElementById('list-container');
        const inputCode = document.getElementById('input-code');
        const inputName = document.getElementById('input-name');
        const btnAdd = document.getElementById('btn-add');
        const errorMsg = document.getElementById('error-msg');
        
        // Variável de estado para saber se estamos a editar
        let editingItemId = null;

        const render = async () => {
            listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#666;">A carregar...</li>';
            try {
                const items = await service['get' + service.name]();
                listEl.innerHTML = items.length ? '' : '<li style="text-align:center; padding:20px; color:#666;">Vazio.</li>';

                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'manage-item';
                    li.innerHTML = `
                        <div class="item-clickable" style="display:flex; align-items:center; flex:1; cursor:pointer;">
                            <span class="tag-code">${item.code}</span>
                            <span style="font-weight:500; color:var(--text-color);">${item.name || ''}</span>
                        </div>
                        <button class="del-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    `;
                    
                    // CLIQUE PARA EDITAR
                    li.querySelector('.item-clickable').onclick = () => {
                        inputCode.value = item.code;
                        inputName.value = item.name;
                        editingItemId = item.id;
                        btnAdd.innerText = "Atualizar";
                        btnAdd.style.borderColor = "var(--text-color)";
                        btnAdd.style.color = "var(--text-color)";
                        window.scrollTo(0,0);
                    };

                    li.querySelector('.del-btn').onclick = async (e) => { 
                        e.stopPropagation();
                        if(confirm(`Apagar "${item.code}"?`)) { 
                            await service['delete' + service.name.slice(0,-1)](item.id); 
                            render(); 
                        }
                    };
                    listEl.appendChild(li);
                });
            } catch (e) { console.error(e); }
        };

        btnAdd.onclick = async () => {
            errorMsg.style.display = 'none';
            btnAdd.disabled = true;
            btnAdd.innerText = 'A processar...';
            
            try {
                if (editingItemId) {
                    // MODO ATUALIZAR
                    await service['update' + service.name.slice(0,-1)](editingItemId, inputCode.value, inputName.value);
                    editingItemId = null; // Reset modo
                } else {
                    // MODO ADICIONAR
                    await service['add' + service.name.slice(0,-1)](inputCode.value, inputName.value);
                }
                
                // Reset UI
                inputCode.value = ''; 
                inputName.value = ''; 
                render();
            } catch (e) { 
                errorMsg.innerText = e.message; 
                errorMsg.style.display = 'block'; 
            } finally { 
                btnAdd.disabled = false; 
                btnAdd.innerText = `Adicionar ${service.name.slice(0,-1)}`;
                btnAdd.style.borderColor = "var(--primary-color)";
                btnAdd.style.color = "var(--primary-color)";
            }
        };
        render();
    };

    // --- BINDING DE EVENTOS ---
    const bindEvents = (tpl) => {
        const nav = (id, targetTpl) => { const el = document.getElementById(id); if(el) el.onclick = () => setView(targetTpl); };
        
        nav('nav-shopping', shoppingListTemplate);
        nav('nav-recipes', recipesTemplate);
        nav('nav-settings', settingsTemplate);

        if (tpl === shoppingListTemplate) setupShoppingList();

        if (tpl === settingsTemplate) {
            nav('btn-manage-tags', tagsTemplate);
            nav('btn-manage-units', unitsTemplate);
            nav('btn-manage-areas', areasTemplate);
            nav('btn-manage-ingredients', ingredientsTemplate);
            
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) btnLogout.onclick = () => { if(confirm("Querer realmente terminar a sessão?")) logout(); };
        }

        if (tpl === ingredientsTemplate) setupIngredients();
        if (tpl === tagsTemplate) setupGenericCrud({ ...TagService, name: 'Tags' });
        if (tpl === unitsTemplate) setupGenericCrud({ ...UnitService, name: 'Units' });
        if (tpl === areasTemplate) setupGenericCrud({ ...AreaService, name: 'Areas' });
    };
});
