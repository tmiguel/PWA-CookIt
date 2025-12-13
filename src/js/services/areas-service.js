import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = 'areas';

// Validação agora aceita isFood
const validate = (code, name, isFood) => {
    const cleanCode = code ? code.trim() : '';
    const cleanName = name ? name.trim() : '';
    
    if (cleanCode.length === 0 || cleanCode.length > 5) throw new Error("Código obrigatório (máx 5 chars).");
    
    return { 
        code: cleanCode, 
        name: cleanName, 
        isFood: !!isFood, // Garante booleano (true/false)
        updatedAt: serverTimestamp() 
    };
};

export async function getAreas() {
    const q = query(collection(db, COLLECTION), orderBy("code", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addArea(code, name, isFood) {
    const data = validate(code, name, isFood);
    data.createdAt = serverTimestamp();
    
    const exists = await getDocs(query(collection(db, COLLECTION), where("code", "==", data.code)));
    if (!exists.empty) throw new Error(`O código "${data.code}" já existe.`);
    
    await addDoc(collection(db, COLLECTION), data);
}

export async function updateArea(id, code, name, isFood) {
    const data = validate(code, name, isFood);
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, data);
}

export async function deleteArea(id) { await deleteDoc(doc(db, COLLECTION, id)); }
