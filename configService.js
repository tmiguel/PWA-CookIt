// configService.js
// Lógica de CRUD para Configurações (Tags, Unidades)

import { db } from './firebase-config.js'; 
import { getCurrentUser } from './auth.js';

const settingsSubView = document.getElementById('settings-sub-view');

// -----------------------------------------------------------
// FUNÇÃO GENÉRICA DE RENDERIZAÇÃO DE CONFIGURAÇÃO (CRUD)
// Exportada para ser chamada pelo ui.js
// -----------------------------------------------------------

export function renderConfigCRUD(collectionName) {
    const user = getCurrentUser();
    if (!user) {
        settingsSubView.innerHTML = '<p>Erro: Faça login para aceder às configurações.</p>';
        return;
    }

    // 1. Renderiza o formulário de adição
    settingsSubView.innerHTML = `
        <h3>Gestão de ${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}</h3>
        <form id="config-form">
            <label for="config-name">Nome da ${collectionName.slice(0, -1)}</label>
            <input type="text" id="config-name" required>
            <button type="submit" class="primary">Adicionar ${collectionName.slice(0, -1)}</button>
        </form>
        <hr>
        <h4>${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} Existentes</h4>
        <div id="config-list">
            <p aria-busy="true">A carregar...</p>
        </div>
    `;

    // 2. Adiciona o listener de submissão do formulário
    document.getElementById('config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddConfig(collectionName);
    });

    // 3. Inicia o listener de leitura (READ)
    fetchAndRenderConfigs(collectionName);
}

// -----------------------------------------------------------
// FUNÇÃO READ (ES Module)
// -----------------------------------------------------------

function fetchAndRenderConfigs(collectionName) {
    const configList = document.getElementById('config-list');
    
    // Escuta a coleção (tags ou units)
    db.collection(collectionName) 
        .onSnapshot((snapshot) => {
            configList.innerHTML = '';
            if (snapshot.empty) {
                configList.innerHTML = `<p>Nenhum(a) ${collectionName.slice(0, -1)} adicionado(a) ainda.</p>`;
                return;
            }

            let html = '<ul>';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const id = doc.id;
                html += `
                    <li style="display: flex; justify-content: space-between; align-items: center;">
                        ${data.name}
                        <button onclick="this.dispatchEvent(new CustomEvent('delete-config', { bubbles: true, detail: { id: '${id}', collection: '${collectionName}' } }))"
                                class="contrast outline" style="margin-left: 1rem; padding: 0.2rem 0.5rem;">
                            X
                        </button>
                    </li>
                `;
            });
            html += '</ul>';
            configList.innerHTML = html;
        });
}

// -----------------------------------------------------------
// FUNÇÃO CREATE (ES Module)
// -----------------------------------------------------------

function handleAddConfig(collectionName) {
    const user = getCurrentUser();
    const nameInput = document.getElementById('config-name');
    const name = nameInput.value.trim();

    if (!name) return;

    db.collection(collectionName).add({
        name: name,
        userId: user.uid, // Mantemos o ID do utilizador que criou
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        nameInput.value = ''; // Limpa o input
    })
    .catch(error => {
        alert(`Erro ao adicionar ${collectionName.slice(0, -1)}: ${error.message}`);
    });
}

// -----------------------------------------------------------
// FUNÇÃO DELETE (ES Module)
// -----------------------------------------------------------

document.body.addEventListener('delete-config', (e) => {
    const { id, collection } = e.detail;
    if (confirm(`Tem certeza que deseja eliminar este(a) ${collection.slice(0, -1)}?`)) {
        db.collection(collection).doc(id).delete()
            .catch(error => {
                alert(`Erro ao eliminar: ${error.message}`);
            });
    }
});
