import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = 'areas';

const validate = (code, name) => {
    const cleanCode = code ? code.trim() : '';
    if (cleanCode.length === 0 || cleanCode.length > 5) throw new Error("Código obrigatório (máx 5 chars).");
    return { code: cleanCode, name: name ? name.trim() : '', createdAt: serverTimestamp() };
};

export async function getAreas() {
    const q = query(collection(db, COLLECTION), orderBy("code", "asc"));
    return (await getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addArea(code, name) {
    const data = validate(code, name);
    const exists = await getDocs(query(collection(db, COLLECTION), where("code", "==", data.code)));
    if (!exists.empty) throw new Error(`Código "${data.code}" já existe.`);
    await addDoc(collection(db, COLLECTION), data);
}

export async function deleteArea(id) { await deleteDoc(doc(db, COLLECTION, id)); }
