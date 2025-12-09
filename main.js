// main.js
// Orquestrador da Aplicação (Entry Point ÚNICO)

// Importa todos os módulos de lógica. A ordem é importante para o setup.
import './firebase-config.js'; 
import './ui.js'; 
import './recipeService.js'; 
import './configService.js'; 
import './router.js'; 

import { initAuth } from './auth.js'; // auth.js tem a função de inicialização

document.addEventListener('DOMContentLoaded', () => {
    // Inicia o listener de autenticação, que irá desencadear a navegação/UI
    initAuth();
});
