import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = 'products';

// Agora aceitamos e guardamos isFood
const validate = (code, name, area, isFood) => {
    const cleanCode = code ? code.trim() : '';
    const cleanName = name ? name.trim() : '';
    
    if (cleanCode.length === 0 || cleanCode.length > 5) throw new Error("Código obrigatório (máx 5 chars).");
    if (!area) throw new Error("A Área é obrigatória.");

    return { 
        code: cleanCode, 
        name: cleanName, 
        area: area,
        isFood: !!isFood, // Herdado da área
        updatedAt: serverTimestamp() 
    };
};

export async function getProducts() {
    const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addProduct(code, name, area, isFood) {
    // Adicionamos createdAt aqui
    const data = validate(code, name, area, isFood);
    data.createdAt = serverTimestamp();
    
    const exists = await getDocs(query(collection(db, COLLECTION), where("code", "==", data.code)));
    if (!exists.empty) throw new Error(`O código "${data.code}" já existe.`);
    
    await addDoc(collection(db, COLLECTION), data);
}

export async function updateProduct(id, code, name, area, isFood) {
    const data = validate(code, name, area, isFood);
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, data);
}

export async function deleteProduct(id) {
    await deleteDoc(doc(db, COLLECTION, id));
}
