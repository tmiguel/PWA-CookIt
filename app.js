// app.js
// Lógica da Aplicação Principal (CRUD e Lista de Compras)

// Variáveis Globais
let recipeToEditId = null; // Armazena o ID da receita em edição
let allRecipesData = [];   // Armazena todos os dados das receitas do Firestore

// --- Funções de Navegação (Mostrar/Ocultar Views) ---
const views = {
    lista: document.getElementById('view-lista-receitas'),
    formulario: document.getElementById('view-formulario'),
    compras: document.getElementById('view-lista-compras')
};

function esconderTodasViews() {
    Object.values(views).forEach(view => {
        view.style.display = 'none';
    });
}

function mostrarLista() {
    esconderTodasViews();
    views.lista.style.display = 'block';
}

function mostrarFormulario() {
    esconderTodasViews();
    views.formulario.style.display = 'block';
    // O formulário é resetado após o salvamento/cancelamento
    document.getElementById('btn-salvar-receita').textContent = recipeToEditId ? 'Salvar Edição' : 'Salvar Receita';
}

function mostrarListaCompras() {
    esconderTodasViews();
    views.compras.style.display = 'block';
    gerarListaCompras(); // CHAMA A LÓGICA DE GERAÇÃO
}

// --- Lógica de Teste de Conexão com Firestore (Tarefa 2) ---
function testarConexaoFirestore() {
    const statusElement = document.getElementById('status-conexao');
    statusElement.textContent = "A tentar ler dados de teste...";
    
    db.collection("receitas").limit(1).get()
    .then(snapshot => {
        if (snapshot.empty) {
            statusElement.textContent = "✅ Conexão ao Firestore OK. A coleção de 'receitas' está vazia.";
        } else {
            statusElement.textContent = "✅ Conexão ao Firestore OK. Receitas encontradas.";
        }
        statusElement.setAttribute('aria-busy', 'false');
    })
    .catch(error => {
        console.error("Erro ao conectar/ler Firestore: ", error);
        statusElement.textContent = `❌ ERRO DE CONEXÃO: ${error.message}. Verifique as chaves em firebase-config.js e as regras de segurança.`;
        statusElement.setAttribute('aria-busy', 'false');
        statusElement.style.color = 'red';
    });
}


// --- 3.1: Read (Leitura e Real-time Rendering) ---
const recipesListElement = document.getElementById('lista-receitas');

function fetchAndRenderRecipes() {
    // onSnapshot: Escuta em tempo real a coleção 'receitas'
    db.collection("receitas").onSnapshot((snapshot) => {
        recipesListElement.innerHTML = ''; // Limpa a lista existente
        allRecipesData = []; // Zera a lista de dados antes de preencher

        if (snapshot.empty) {
            recipesListElement.innerHTML = '<p>Ainda não há receitas. Adicione a primeira!</p>';
            return;
        }

        // Para cada documento no snapshot, cria o elemento no DOM
        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            
            allRecipesData.push({ id, ...data }); // Adiciona dados à lista global
            
            // Verifica o estado de seleção da Lista de Compras (Tarefa 4)
            const isSelectedForShopping = localStorage.getItem(id) === 'true';

            const article = document.createElement('article');
            article.className = 'recipe-card';
            article.innerHTML = `
                <header>
                    <input type="checkbox" id="check-${id}" data-recipe-id="${id}" onchange="toggleRecipeForShopping('${id}')" 
                           ${isSelectedForShopping ? 'checked' : ''}>
                    <label for="check-${id}" style="cursor: pointer;">
                        <h5>${data.titulo}</h5>
                    </label>
                </header>
                <p>Ingredientes: ${data.ingredientes.split('\n').slice(0, 3).join(', ')}...</p>
                <footer>
                    <button class="secondary" onclick="loadRecipeForEdit('${id}', '${data.titulo.replace(/'/g, "\\'")}', '${data.ingredientes.replace(/'/g, "\\'")}', '${data.passos.replace(/'/g, "\\'")}')">Editar</button>
                    <button class="contrast" onclick="deleteRecipe('${id}')">Eliminar</button>
                </footer>
            `;
            recipesListElement.appendChild(article);
        });
    }, (error) => {
        console.error("Erro ao escutar receitas (onSnapshot): ", error);
        recipesListElement.innerHTML = `<p style="color: red;">Erro ao carregar receitas: ${error.message}</p>`;
    });
}

// --- 3.2: Create / 3.4: Update (Submissão do Formulário) ---
const recipeForm = document.getElementById('formulario-receita');

recipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});

function handleFormSubmit() {
    const titulo = document.getElementById('titulo').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim();
    const passos = document.getElementById('passos').value.trim();
    
    // Validação Mobile-First
    if (!titulo || !ingredientes) {
        alert('O título e os ingredientes são obrigatórios!');
        return;
    }

    const recipeData = {
        titulo: titulo,
        ingredientes: ingredientes, 
        passos: passos,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (recipeToEditId) {
        // Modo Update (Atualização)
        db.collection("receitas").doc(recipeToEditId).update(recipeData)
            .then(() => {
                alert("Receita atualizada com sucesso!");
                resetFormAndShowList();
            })
            .catch((error) => {
                alert("Erro ao atualizar receita: " + error.message);
                console.error("Erro no update: ", error);
            });
    } else {
        // Modo Create (Criação)
        db.collection("receitas").add(recipeData)
            .then(() => {
                alert("Receita adicionada com sucesso!");
                resetFormAndShowList();
            })
            .catch((error) => {
                alert("Erro ao adicionar receita: " + error.message);
                console.error("Erro no add: ", error);
            });
    }
}

function resetFormAndShowList() {
    recipeForm.reset();
    recipeToEditId = null; // Reseta o ID de edição
    mostrarLista();
}


// --- 3.3: Delete (Eliminação) ---
function deleteRecipe(id) {
    if (confirm("Tem certeza que deseja eliminar esta receita? Esta ação é irreversível.")) {
        db.collection("receitas").doc(id).delete()
            .then(() => {
                // Remove a flag de lista de compras para este ID
                localStorage.removeItem(id); 
                alert("Receita eliminada.");
            })
            .catch((error) => {
                alert("Erro ao eliminar receita: " + error.message);
                console.error("Erro no delete: ", error);
            });
    }
}


// --- 3.4: Update (Carregar dados para edição) ---
function loadRecipeForEdit(id, titulo, ingredientes, passos) {
    recipeToEditId = id; // Define o ID da receita que está a ser editada
    
    // Preenche o formulário com os dados atuais
    document.getElementById('titulo').value = titulo;
    document.getElementById('ingredientes').value = ingredientes;
    document.getElementById('passos').value = passos;

    // Navega para o formulário
    mostrarFormulario();
}


// --- 4.1: Persistência de Seleção de Receita (Lista de Compras) ---

function toggleRecipeForShopping(id) {
    const isChecked = document.getElementById(`check-${id}`).checked;
    
    if (isChecked) {
        // Marca a receita no localStorage
        localStorage.setItem(id, 'true');
    } else {
        // Desmarca a receita
        localStorage.removeItem(id);
    }
}


// --- 4.2: Lógica da Lista de Compras (Agregação e UI) ---

const shoppingListContent = document.getElementById('lista-compras-conteudo');

function gerarListaCompras() {
    const aggregatedIngredients = {};

    // 1. Encontrar IDs de receitas selecionadas
    // Filtra o localStorage para IDs de receitas marcadas
    const selectedRecipeIds = Object.keys(localStorage).filter(key => 
        (localStorage.getItem(key) === 'true') && (key.length < 30) // Heurística simples para evitar chaves "bought_"
    );

    if (selectedRecipeIds.length === 0) {
        shoppingListContent.innerHTML = '<p>Nenhuma receita selecionada para a lista de compras.</p>';
        return;
    }

    // 2. Iterar sobre as receitas selecionadas e agregar ingredientes
    const selectedRecipes = allRecipesData.filter(recipe => selectedRecipeIds.includes(recipe.id));

    selectedRecipes.forEach(recipe => {
        // Divide o texto em linhas, filtra linhas vazias e aparar espaços
        const ingredients = recipe.ingredientes.split('\n').map(item => item.trim()).filter(item => item.length > 0);
        
        ingredients.forEach(ingredient => {
            const key = ingredient.toLowerCase();
            // Apenas adiciona se o ingrediente não estiver na lista ainda
            if (!aggregatedIngredients[key]) {
                aggregatedIngredients[key] = { name: ingredient };
            }
        });
    });

    // 3. Renderizar a lista na UI
    let html = '<ul>';
    Object.values(aggregatedIngredients).forEach(item => {
        // Usa o localStorage para persistir o estado de 'comprado' (chaves prefixadas com 'bought_')
        const isBought = localStorage.getItem(`bought_${item.name}`) === 'true';
        const checked = isBought ? 'checked' : '';
        const style = isBought ? 'text-decoration: line-through; color: var(--pico-muted-color);' : '';
        
        html += `
            <li style="${style}">
                <input type="checkbox" id="item-${item.name.replace(/\s/g, '-')}" ${checked} onchange="toggleBoughtStatus('${item.name.replace(/'/g, "\\'")}')">
                <label for="item-${item.name.replace(/\s/g, '-')}" style="cursor: pointer;">${item.name}</label>
            </li>
        `;
    });
    html += '</ul>';
    html += '<button class="contrast" onclick="clearBoughtItems()">Limpar Itens Comprados</button>';

    shoppingListContent.innerHTML = html;
}

// 4. Lógica de Marcar Comprado (Estado Local)
function toggleBoughtStatus(ingredientName) {
    const key = `bought_${ingredientName}`;
    const isBought = localStorage.getItem(key) === 'true';

    if (isBought) {
        localStorage.removeItem(key); // Desmarca
    } else {
        localStorage.setItem(key, 'true'); // Marca
    }

    // Atualiza a UI da lista
    gerarListaCompras();
}

// 5. Lógica de Limpar Itens Comprados
function clearBoughtItems() {
    if (confirm("Deseja realmente limpar todos os itens marcados como comprados da lista?")) {
        const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('bought_'));
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Atualiza a UI
        gerarListaCompras();
        alert("Itens comprados removidos da lista!");
    }
}


// --- Inicialização da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicialmente mostra a lista
    mostrarLista(); 
    
    // Inicia o teste de conexão e a escuta em tempo real
    testarConexaoFirestore();
    fetchAndRenderRecipes(); 
});
