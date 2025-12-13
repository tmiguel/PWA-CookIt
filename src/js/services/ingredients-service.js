import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = 'ingredients';

// Validação com Área obrigatória
const validate = (code, name, area) => {
    const cleanCode = code ? code.trim() : '';
    const cleanName = name ? name.trim() : '';
    
    if (cleanCode.length === 0 || cleanCode.length > 5) throw new Error("Código obrigatório (máx 5 chars).");
    if (!area) throw new Error("A Área é obrigatória.");

    return { 
        code: cleanCode, 
        name: cleanName, 
        area: area, // Novo campo
        createdAt: serverTimestamp() 
    };
};

export async function getIngredients() {
    // Ordenar por nome para facilitar leitura
    const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addIngredient(code, name, area) {
    const data = validate(code, name, area);
    
    // Verificar duplicados
    const exists = await getDocs(query(collection(db, COLLECTION), where("code", "==", data.code)));
    if (!exists.empty) throw new Error(`O código "${data.code}" já existe.`);
    
    await addDoc(collection(db, COLLECTION), data);
}

export async function deleteIngredient(id) {
    await deleteDoc(doc(db, COLLECTION, id));
}
