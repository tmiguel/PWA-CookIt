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


// --- RESTANTE DO CRUD E PWA VAI AQUI (Tarefas 3 a 6) ---
