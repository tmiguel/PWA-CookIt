import { headerTemplate } from './templates/header.js';
import { bottomNavTemplate } from './templates/bottom-nav.js';

function initApp() {
    console.log('CookIt: A iniciar...');

    // 1. Renderizar Header
    const headerEl = document.getElementById('header-container');
    if (headerEl) headerEl.innerHTML = headerTemplate;

    // 2. Renderizar Menu
    const navEl = document.getElementById('bottom-nav-container');
    if (navEl) navEl.innerHTML = bottomNavTemplate;
}

document.addEventListener('DOMContentLoaded', initApp);
