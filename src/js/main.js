import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { loginTemplate } from './templates/login.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

// Serviços
import { monitorAuthState, loginWithGoogle } from './services/auth-service.js';
import * as TagService from './services/tags-service.js';
import * as UnitService from './services/units-service.js';
import * as AreaService from './services/areas-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('app-loader');
    const appContainer = document.getElementById('app');
    
    // Containers Principais
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    // --- FUNÇÃO CENTRAL DE NAVEGAÇÃO ---
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // --- GESTÃO DE ESTADO (LOGIN vs APP) ---
    monitorAuthState((user) => {
        // Esconder loader assim que o Firebase responde
        if (loader) loader.classList.add('hidden');

        if (!user) {
            // A. UTILIZADOR NÃO LOGADO -> Mostrar Login
            headerContainer.innerHTML = '';
            navContainer.innerHTML = '';
            mainContainer.innerHTML = loginTemplate;
            
            const btnLogin = document.getElementById('btn-google-login');
            if (btnLogin) btnLogin.onclick = loginWithGoogle;

        } else {
            // B. UTILIZADOR LOGADO -> Mostrar App
            console.log("Logado como:", user.email);
            
            // Injetar Layout Fixo
            headerContainer.innerHTML = headerTemplate;
            navContainer.innerHTML = bottomNavTemplate;

            // Iniciar na Lista de Compras ou onde preferires
            setView(recipesTemplate); 
        }
    });

    // --- LÓGICA DA APLICAÇÃO (IGUAL AO ANTERIOR) ---
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
                console.error(e);
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
        
        // Menu Principal
        nav('nav-shopping', shoppingListTemplate);
        nav('nav-recipes', recipesTemplate);
        nav('nav-settings', settingsTemplate);

        // Sub-menus Configuração
        if (tpl === settingsTemplate) {
            nav('btn-manage-tags', tagsTemplate);
            nav('btn-manage-units', unitsTemplate);
            nav('btn-manage-areas', areasTemplate);
        }

        // Lógica CRUD
        if (tpl === tagsTemplate) setupGenericCrud({ ...TagService, name: 'Tags' });
        if (tpl === unitsTemplate) setupGenericCrud({ ...UnitService, name: 'Units' });
        if (tpl === areasTemplate) setupGenericCrud({ ...AreaService, name: 'Areas' });
    };
});
