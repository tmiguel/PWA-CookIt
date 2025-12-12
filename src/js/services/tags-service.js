import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'tags';

// 1. Ler todas as tags
export async function getTags() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    // Converte os dados do Firestore para uma lista simples
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 2. Adicionar uma tag
export async function addTag(name) {
    if (!name) return;
    await addDoc(collection(db, COLLECTION_NAME), { name });
}

// 3. Apagar uma tag
export async function deleteTag(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
