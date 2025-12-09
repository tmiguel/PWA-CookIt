// main.js
// Orquestrador da Aplicação (Entry Point)

import { initAuth } from './auth.js';
// Os módulos router, recipeService, etc., são importados apenas por estarem nas tags script no index.html
// ou pelos outros módulos (ex: ui.js importa recipeService.js).

document.addEventListener('DOMContentLoaded', () => {
    // Inicia o listener de autenticação, que irá desencadear a navegação/UI
    initAuth();
});
