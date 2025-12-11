// main.js
// Orquestrador da Aplicação (Entry Point ÚNICO)

// Importa todos os módulos de lógica. A ordem garante que as classes/funções existem antes de serem usadas.
import './firebase-config.js'; 
import './ui.js'; 
import './recipeService.js'; 
import './configService.js'; 
import './router.js'; 

import { initAuth } from './auth.js'; // Importa a função de inicialização do Auth

document.addEventListener('DOMContentLoaded', () => {
    // Inicia o listener de autenticação, que irá desencadear a navegação/UI
    initAuth();
});
