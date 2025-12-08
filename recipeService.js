// recipeService.js
// Lógica de CRUD de Receitas e Lista de Compras

import { db } from './firebase-config.js';
import { navigateTo } from './router.js';
import { getCurrentUser } from './auth.js';

// Variáveis Globais para CRUD e Lista de Compras
let recipeToEditId = null; 
let allRecipesData = [];

const recipesListElement = document.getElementById('lista-receitas');
const recipeForm = document.getElementById('recipe-form');
const shoppingListContent = document.getElementById('lista-compras-conteudo');


// --- FUNÇÕES DE SETUP/INICIALIZAÇÃO ---

// Teste de Conexão (Movido para cá)
export function testConnection() {
    const statusElement = document.getElementById('status-conexao');
    statusElement.textContent = "A tentar ler dados de teste...";
    
    // Apenas lemos a coleção de receitas, que é global
    db.collection("receitas").limit(1).get()
    .then(() => {
        statusElement.textContent = "✅ Conexão ao Firestore OK.";
        statusElement.setAttribute('aria-busy', 'false');
    })
    .catch(error => {
        statusElement.textContent = `❌ ERRO: ${error.message}`;
        statusElement.setAttribute('aria-busy', 'false');
        statusElement.style.color = 'red';
    });
}
testConnection(); // Executa o teste assim que o módulo é carregado


// --- TAREFA 3: CRUD DE RECEITAS ---

// Read (Leitura e Real-time Rendering)
export function fetchAndRenderRecipes() {
    // 1. onSnapshot: Escuta em tempo real a coleção 'receitas'
    db.collection("receitas").onSnapshot((snapshot) => {
        recipesListElement.innerHTML = ''; 
        allRecipesData = []; 

        if (snapshot.empty) {
            recipesListElement.innerHTML = '<p>Ainda não há receitas. Adicione a primeira!</p>';
            return;
        }

        // 2. Renderização
        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            
            allRecipesData.push({ id, ...data }); 
            const isSelectedForShopping = localStorage.getItem(id) === 'true';

            const article = document.createElement('article');
            article.className = 'recipe-card';
            article.innerHTML = `
                <header>
                    <input type="checkbox" id="check-${id}" data-recipe-id="${id}" onchange="this.dispatchEvent(new CustomEvent('toggle-shopping', { bubbles: true, detail: { id: '${id}' } }))" 
                           ${isSelectedForShopping ? 'checked' : ''}>
                    <label for="check-${id}" style="cursor: pointer;">
                        <h5>${data.titulo}</h5>
                    </label>
                </header>
                <p>Ingredientes: ${data.ingredientes.split('\n').slice(0, 3).join(', ')}...</p>
                <footer>
                    <button class="secondary" onclick="this.dispatchEvent(new CustomEvent('load-edit', { bubbles: true, detail: { id: '${id}' } }))">Editar</button>
                    <button class="contrast" onclick="this.dispatchEvent(new CustomEvent('delete-recipe', { bubbles: true, detail: { id: '${id}' } }))">Eliminar</button>
                </footer>
            `;
            recipesListElement.appendChild(article);
        });
    }, (error) => {
        console.error("Erro ao escutar receitas (onSnapshot): ", error);
        recipesListElement.innerHTML = `<p style="color: red;">Erro ao carregar receitas: ${error.message}</p>`;
    });
}

// Create / Update (Submissão do Formulário)
recipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});

function handleFormSubmit() {
    const user = getCurrentUser();
    if (!user) return alert("Erro: Utilizador não autenticado."); // Checagem de segurança
    
    const titulo = document.getElementById('titulo').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim();
    const passos = document.getElementById('passos').value.trim();
    
    if (!titulo || !ingredientes) {
        alert('O título e os ingredientes são obrigatórios!');
        return;
    }

    const recipeData = {
        titulo: titulo,
        ingredientes: ingredientes, 
        passos: passos,
        // Mantém a 'criada por' mesmo que os dados sejam partilhados
        userId: user.uid, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (recipeToEditId) {
        // Update (Atualização)
        db.collection("receitas").doc(recipeToEditId).update(recipeData)
            .then(() => {
                alert("Receita atualizada com sucesso!");
                resetFormAndNavigate();
            });
    } else {
        // Create (Criação)
        db.collection("receitas").add(recipeData)
            .then(() => {
                alert("Receita adicionada com sucesso!");
                resetFormAndNavigate();
            });
    }
}

function resetFormAndNavigate() {
    recipeForm.reset();
    recipeToEditId = null; 
    navigateTo('#recipes');
}


// Delete (Eliminação)
document.body.addEventListener('delete-recipe', function(e) {
    const id = e.detail.id;
    if (confirm("Tem certeza que deseja eliminar esta receita?")) {
        db.collection("receitas").doc(id).delete()
            .then(() => {
                localStorage.removeItem(id); // Remove a flag de lista de compras
            });
    }
});


// Load para Edição (Update)
document.body.addEventListener('load-edit', function(e) {
    const id = e.detail.id;
    const recipe = allRecipesData.find(r => r.id === id);
    if (!recipe) return alert("Receita não encontrada para edição.");
    
    recipeToEditId = id; 
    
    document.getElementById('titulo').value = recipe.titulo;
    document.getElementById('ingredientes').value = recipe.ingredientes;
    document.getElementById('passos').value = recipe.passos;

    navigateTo('#add');
});


// --- TAREFA 4: LÓGICA DA LISTA DE COMPRAS ---

// Persistência de Seleção de Receita
document.body.addEventListener('toggle-shopping', function(e) {
    const id = e.detail.id;
    const isChecked = document.getElementById(`check-${id}`).checked;
    
    if (isChecked) {
        localStorage.setItem(id, 'true');
    } else {
        localStorage.removeItem(id);
    }
});

// Agregação e Renderização da Lista de Compras (Exportado para o ui.js)
export function gerarListaCompras() {
    const aggregatedIngredients = {};

    // 1. Encontrar IDs de receitas selecionadas
    const selectedRecipeIds = Object.keys(localStorage).filter(key => 
        (localStorage.getItem(key) === 'true') && (key.length < 30)
    );

    if (selectedRecipeIds.length === 0) {
        shoppingListContent.innerHTML = '<p>Nenhuma receita selecionada para a lista de compras.</p>';
        return;
    }

    // 2. Iterar e agregar ingredientes
    const selectedRecipes = allRecipesData.filter(recipe => selectedRecipeIds.includes(recipe.id));

    selectedRecipes.forEach(recipe => {
        const ingredients = recipe.ingredientes.split('\n').map(item => item.trim()).filter(item => item.length > 0);
        ingredients.forEach(ingredient => {
            const key = ingredient.toLowerCase();
            if (!aggregatedIngredients[key]) {
                aggregatedIngredients[key] = { name: ingredient };
            }
        });
    });

    // 3. Renderizar a lista na UI
    let html = '<ul>';
    Object.values(aggregatedIngredients).forEach(item => {
        const isBought = localStorage.getItem(`bought_${item.name}`) === 'true';
        const checked = isBought ? 'checked' : '';
        const style = isBought ? 'text-decoration: line-through; color: var(--pico-muted-color);' : '';
        
        html += `
            <li style="${style}">
                <input type="checkbox" id="item-${item.name.replace(/\s/g, '-')}" ${checked} onchange="this.dispatchEvent(new CustomEvent('toggle-bought', { bubbles: true, detail: { name: '${item.name}' } }))">
                <label for="item-${item.name.replace(/\s/g, '-')}" style="cursor: pointer;">${item.name}</label>
            </li>
        `;
    });
    html += '</ul>';
    html += '<button class="contrast" onclick="this.dispatchEvent(new CustomEvent(\'clear-bought\', { bubbles: true }))">Limpar Itens Comprados</button>';

    shoppingListContent.innerHTML = html;
}

// Lógica de Marcar Comprado (Estado Local)
document.body.addEventListener('toggle-bought', function(e) {
    const ingredientName = e.detail.name;
    const key = `bought_${ingredientName}`;
    const isBought = localStorage.getItem(key) === 'true';

    if (isBought) {
        localStorage.removeItem(key); 
    } else {
        localStorage.setItem(key, 'true'); 
    }
    gerarListaCompras();
});

// Lógica de Limpar Itens Comprados
document.body.addEventListener('clear-bought', function() {
    if (confirm("Deseja realmente limpar todos os itens marcados como comprados da lista?")) {
        const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('bought_'));
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        gerarListaCompras();
        alert("Itens comprados removidos da lista!");
    }
});
