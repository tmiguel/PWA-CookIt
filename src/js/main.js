import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';
import { loginTemplate } from './templates/login.js';
import { shoppingListTemplate } from './templates/shopping-list.js';
import { recipesTemplate } from './templates/recipes.js';
import { settingsTemplate } from './templates/settings.js';
import { tagsTemplate } from './templates/tags.js';
import { unitsTemplate } from './templates/units.js';
import { areasTemplate } from './templates/areas.js';

// Auth Services
import { monitorAuthState, loginWithGoogle, logout, finishRedirectLogin } from './services/auth-service.js';

// CRUD Services
import * as TagService from './services/tags-service.js';
import * as UnitService from './services/units-service.js';
import * as AreaService from './services/areas-service.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Processar o regresso do Google (se viermos de um login)
    finishRedirectLogin();

    const loader = document.getElementById('app-loader');
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('bottom-nav-container');
    const mainContainer = document.getElementById('main-container');

    // Timeout de Segurança: Se o Firebase demorar mais de 5s, força o login
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            if (!headerContainer.innerHTML) showLoginScreen(); 
        }
    }, 5000);

    // Função para trocar o conteúdo do meio
    const setView = (template) => {
        if (mainContainer) mainContainer.innerHTML = template;
        bindEvents(template);
    };

    // Função para mostrar ecrã de login
    const showLoginScreen = () => {
        if (loader) loader.classList.add('hidden');
        headerContainer.innerHTML = '';
        navContainer.innerHTML = '';
        mainContainer.innerHTML = loginTemplate;
        
        const btn = document.getElementById('btn-google-login');
        if (btn) btn.onclick = loginWithGoogle;
    };

    // --- MONITOR DE ESTADO (Auth) ---
    monitorAuthState((user) => {
        if (loader) loader.classList.add('hidden');

        if (!user) {
            // Não logado -> Ecrã Login
            showLoginScreen();
        } else {
            // Logado -> App Shell
            console.log("User:", user.email);
            
            headerContainer.innerHTML = headerTemplate;
            navContainer.innerHTML = bottomNavTemplate;

            // Lógica do Botão Logout no Header
            const btnHeaderLogout = document.getElementById('header-btn-logout');
            if (btnHeaderLogout) {
                btnHeaderLogout.onclick = () => {
                    if (confirm("Terminar sessão?")) logout();
                };
            }

            // Se for o arranque inicial, vai para Receitas
            if (!mainContainer.innerHTML || mainContainer.innerHTML.includes('Entrar com Google')) {
                setView(recipesTemplate);
            }
        }
    });

    // --- LÓGICA GENÉRICA PARA TAGS/UNIDADES/ÁREAS ---
    const setupGenericCrud = (service) => {
        // Voltar para Settings
        document.getElementById('btn-back-settings').onclick = () => setView(settingsTemplate);
        
        const listEl = document.getElementById('list-container');
        const inputCode = document.getElementById('input-code');
        const inputName = document.getElementById('input-name');
        const btnAdd = document.getElementById('btn-add');
        const errorMsg = document.getElementById('error-msg');

        // Função de Renderizar Lista
        const render = async () => {
            listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#666;">A carregar...</li>';
            
            try {
                const items = await service['get' + service.name]();
                
                listEl.innerHTML = ''; // Limpar
                
                if (items.length === 0) {
                    listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#666;">Lista vazia.</li>';
                    return;
                }

                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'manage-item';
                    
                    // HTML Atualizado para o novo Design
                    li.innerHTML = `
                        <div style="display:flex; align-items:center;">
                            <span class="tag-code">${item.code}</span>
                            <span style="font-weight:500; color:var(--text-color);">${item.name || ''}</span>
                        </div>
                        <button class="del-btn" title="Apagar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    `;
                    
                    // Evento Apagar
                    li.querySelector('.del-btn').onclick = async () => { 
                        if(confirm(`Apagar "${item.code}"?`)) { 
                            await service['delete' + service.name.slice(0,-1)](item.id); 
                            render(); 
                        }
                    };
                    listEl.appendChild(li);
                });

            } catch (e) { 
                console.error(e);
                listEl.innerHTML = `<li style="color:var(--danger-color); padding:15px; text-align:center;">Erro: ${e.message}</li>`; 
            }
        };

        // Função Adicionar Novo
        btnAdd.onclick = async () => {
            errorMsg.style.display = 'none';
            btnAdd.disabled = true;
            btnAdd.innerText = 'A guardar...';
            
            try {
                await service['add' + service.name.slice(0,-1)](inputCode.value, inputName.value);
                
                // Sucesso
                inputCode.value = ''; 
                inputName.value = ''; 
                render();
            } catch (e) { 
                errorMsg.innerText = e.message; 
                errorMsg.style.display = 'block'; 
            } finally { 
                btnAdd.disabled = false; 
                btnAdd.innerText = `Adicionar ${service.name.slice(0,-1)}`; // Ex: Adicionar Tag
            }
        };

        // Carregar lista ao entrar
        render();
    };

    // --- GESTÃO DE EVENTOS E NAVEGAÇÃO ---
    const bindEvents = (tpl) => {
        // Helper para navegação simples
        const nav = (id, targetTpl) => { 
            const el = document.getElementById(id); 
            if(el) el.onclick = () => setView(targetTpl); 
        };
        
        // Menu Rodapé
        nav('nav-shopping', shoppingListTemplate);
        nav('nav-recipes', recipesTemplate);
        nav('nav-settings', settingsTemplate);

        // Menu Configurações
        if (tpl === settingsTemplate) {
            nav('btn-manage-tags', tagsTemplate);
            nav('btn-manage-units', unitsTemplate);
            nav('btn-manage-areas', areasTemplate);
            
            // Logout secundário (opcional, já temos no header)
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) btnLogout.onclick = () => { if(confirm("Sair?")) logout(); };
        }

        // Ligar lógica CRUD dependendo da página
        if (tpl === tagsTemplate) setupGenericCrud({ ...TagService, name: 'Tags' });
        if (tpl === unitsTemplate) setupGenericCrud({ ...UnitService, name: 'Units' });
        if (tpl === areasTemplate) setupGenericCrud({ ...AreaService, name: 'Areas' });
    };
});
