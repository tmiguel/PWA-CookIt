import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { loginTemplate } from './templates/login.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

// Auth e Services
import { monitorAuthState, loginWithGoogle, logout, finishRedirectLogin } from './services/auth-service.js';
import * as TagService from './services/tags-service.js';
import * as UnitService from './services/units-service.js';
import * as AreaService from './services/areas-service.js';

document.addEventListener('DOMContentLoaded', () => {
    finishRedirectLogin();

    const loader = document.getElementById('app-loader');
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    // Timeout de segurança
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

    // --- MONITOR DE ESTADO ---
    monitorAuthState((user) => {
        if (loader) loader.classList.add('hidden');

        if (!user) {
            showLoginScreen();
        } else {
            // Renderizar Shell
            headerContainer.innerHTML = headerTemplate;
            navContainer.innerHTML = bottomNavTemplate;

            // --- LIGAR LOGOUT NO HEADER (NOVO) ---
            const btnHeaderLogout = document.getElementById('header-btn-logout');
            if (btnHeaderLogout) {
                btnHeaderLogout.onclick = () => {
                    if (confirm("Sair da aplicação?")) logout();
                };
            }

            // Iniciar App
            if (!mainContainer.innerHTML || mainContainer.innerHTML.includes('Entrar')) {
                setView(recipesTemplate);
            }
        }
    });

    // --- LÓGICA CRUD ---
    const setupGenericCrud = (service) => {
        document.getElementById('btn-back-settings').onclick = () => setView(settingsTemplate);
        
        const listEl = document.getElementById('list-container');
        const inputCode = document.getElementById('input-code');
        const inputName = document.getElementById('input-name');
        const btnAdd = document.getElementById('btn-add');
        const errorMsg = document.getElementById('error-msg');

        const render = async () => {
            listEl.innerHTML = '<li style="text-align:center; padding:10px;">A atualizar...</li>';
            try {
                const items = await service['get' + service.name]();
                listEl.innerHTML = items.length ? '' : '<li style="text-align:center; padding:20px;">Vazio.</li>';
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'manage-item';
                    li.innerHTML = `<div style="flex:1;"><strong style="color:var(--primary-color);">[${item.code}]</strong> ${item.name || ''}</div><button class="del-btn" style="color:red;border:none;background:none;">🗑️</button>`;
                    li.querySelector('.del-btn').onclick = async () => { if(confirm('Apagar?')) { await service['delete' + service.name.slice(0,-1)](item.id); render(); }};
                    listEl.appendChild(li);
                });
            } catch (e) { 
                listEl.innerHTML = `<li style="color:red; padding:15px;">Erro: ${e.message}</li>`; 
            }
        };

        btnAdd.onclick = async () => {
            errorMsg.style.display = 'none';
            btnAdd.disabled = true;
            try {
                await service['add' + service.name.slice(0,-1)](inputCode.value, inputName.value);
                inputCode.value = ''; inputName.value = ''; render();
            } catch (e) { errorMsg.innerText = e.message; errorMsg.style.display = 'block'; }
            finally { btnAdd.disabled = false; }
        };
        render();
    };

    const bindEvents = (tpl) => {
        const nav = (id, t) => { const el = document.getElementById(id); if(el) el.onclick = () => setView(t); };
        
        nav('nav-shopping', shoppingListTemplate);
        nav('nav-recipes', recipesTemplate);
        nav('nav-settings', settingsTemplate);

        if (tpl === settingsTemplate) {
            nav('btn-manage-tags', tagsTemplate);
            nav('btn-manage-units', unitsTemplate);
            nav('btn-manage-areas', areasTemplate);
            
            // Opcional: Mantemos o botão de logout nas definições também?
            const btnSettingsLogout = document.getElementById('btn-logout');
            if (btnSettingsLogout) btnSettingsLogout.onclick = () => { if(confirm("Sair?")) logout(); };
        }

        if (tpl === tagsTemplate) setupGenericCrud({ ...TagService, name: 'Tags' });
        if (tpl === unitsTemplate) setupGenericCrud({ ...UnitService, name: 'Units' });
        if (tpl === areasTemplate) setupGenericCrud({ ...AreaService, name: 'Areas' });
    };
});
