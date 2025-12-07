// app.js
// Lógica da Aplicação Principal

// Funções de Navegação (Mostrar/Ocultar Views)
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
    // Lógica para limpar formulário ou carregar dados, se edição
}

function mostrarListaCompras() {
    esconderTodasViews();
    views.compras.style.display = 'block';
    // Lógica para carregar/calcular lista de compras
}

// Inicializa a aplicação mostrando a lista
document.addEventListener('DOMContentLoaded', () => {
    mostrarLista();
    // Inicia o teste de conexão do Firestore
    testarConexaoFirestore();
});


// Lógica de Teste de Conexão com Firestore (Tarefa 2)
function testarConexaoFirestore() {
    const statusElement = document.getElementById('status-conexao');
    statusElement.textContent = "A tentar ler dados de teste...";
    
    // Tentativa de ler a coleção de receitas
    db.collection("receitas").limit(1).get()
    .then(snapshot => {
        if (snapshot.empty) {
            statusElement.textContent = "✅ Conexão ao Firestore OK. A coleção de 'receitas' está vazia.";
            statusElement.setAttribute('aria-busy', 'false');
        } else {
            statusElement.textContent = "✅ Conexão ao Firestore OK. Receitas encontradas.";
            statusElement.setAttribute('aria-busy', 'false');
        }
    })
    .catch(error => {
        console.error("Erro ao conectar/ler Firestore: ", error);
        statusElement.textContent = `❌ ERRO DE CONEXÃO: ${error.message}. Verifique as chaves em firebase-config.js e as regras de segurança.`;
        statusElement.setAttribute('aria-busy', 'false');
        statusElement.style.color = 'red';
    });
}
// app.js (Adicionar A PARTIR DAQUI)

let recipeToEditId = null; // Variável para armazenar o ID da receita em edição

// --- 3.1: Read (Leitura e Real-time Rendering) ---
const recipesListElement = document.getElementById('lista-receitas');

function fetchAndRenderRecipes() {
    // onSnapshot: Escuta em tempo real a coleção 'receitas'
    db.collection("receitas").onSnapshot((snapshot) => {
        recipesListElement.innerHTML = ''; // Limpa a lista existente

        if (snapshot.empty) {
            recipesListElement.innerHTML = '<p>Ainda não há receitas. Adicione a primeira!</p>';
            return;
        }

        // Para cada documento no snapshot, cria o elemento no DOM
        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            
            const article = document.createElement('article');
            article.className = 'recipe-card';
            article.innerHTML = `
                <header>
                    <h5>${data.titulo}</h5>
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
        ingredientes: ingredientes, // Armazenado como string multi-linha
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
                // A lista é atualizada automaticamente devido ao onSnapshot!
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

    // Altera o texto do botão para indicar o modo de edição
    document.getElementById('btn-salvar-receita').textContent = 'Salvar Edição';

    // Navega para o formulário
    mostrarFormulario();
}


// --- AJUSTE NA CHAMADA INICIAL (Adicionar fetch) ---

// Modificar a função inicial no app.js para incluir a leitura
document.addEventListener('DOMContentLoaded', () => {
    // Inicialmente mostra a lista (esta linha já existia)
    mostrarLista(); 
    
    // Apenas testar a conexão e depois começar a escutar as receitas
    testarConexaoFirestore();
    fetchAndRenderRecipes(); // Inicia a escuta em tempo real!
});
