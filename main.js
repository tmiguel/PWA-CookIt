// main.js
// Orquestrador da Aplicação

import { initAuth } from './auth.js';
import './router.js'; // Apenas importa o router para que o listener seja registado
import './recipeService.js'; // Apenas importa o serviço para que o teste de conexão corra

// Inicia a aplicação após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicia o listener de autenticação, que é o gatilho para o resto da aplicação
    initAuth(); 
});
