import { db } from '../firebase.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'tags';

// Validação e Criação do Modelo
const validateAndCreateTag = (code, name) => {
    // 1. Limpeza (Trim garante que "   " vira "")
    const cleanCode = code ? code.trim() : '';
    const cleanName = name ? name.trim() : '';

    // 2. Validações de Regra de Negócio
    // Se o user digitou só espaços, cleanCode.length será 0 -> Erro.
    if (cleanCode.length === 0) throw new Error("O Código é obrigatório e não pode ser apenas espaços.");
    if (cleanCode.length > 5) throw new Error("O Código tem de ter no máximo 5 caracteres.");
    
    // NOTA: O Nome deixou de ser obrigatório.

    // 3. Retorna o Objeto JSON Estrito
    return {
        code: cleanCode,
        name: cleanName, // Pode ir vazio
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
};

// --- FUNÇÕES PÚBLICAS ---

// 1. Ler todas (Ordenadas por Código)
export async function getTags() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("code", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 2. Adicionar (Com verificação de duplicado)
export async function addTag(code, name) {
    const newTag = validateAndCreateTag(code, name);

    // Valida Unicidade do Código
    const q = query(collection(db, COLLECTION_NAME), where("code", "==", newTag.code));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error(`O código "${newTag.code}" já existe.`);
    }

    await addDoc(collection(db, COLLECTION_NAME), newTag);
}

// 3. Apagar
export async function deleteTag(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
