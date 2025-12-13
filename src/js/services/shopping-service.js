import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, orderBy, limit, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION = 'shopping_lists';

// 1. Criar uma Nova Lista
export async function createList(name) {
    if (!name.trim()) throw new Error("A lista precisa de um nome.");
    
    // Antes de criar, podíamos fechar outras abertas, mas por agora permitimos múltiplas
    await addDoc(collection(db, COLLECTION), {
        name: name.trim(),
        status: 'open', // 'open' ou 'closed'
        createdAt: serverTimestamp(),
        totalItems: 0 // Contador para mostrar no tile
    });
}

// 2. Obter a Lista Ativa (A que está 'open')
// Vamos assumir que mostramos a mais recente aberta como destaque
export async function getActiveList() {
    const q = query(
        collection(db, COLLECTION), 
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// 3. Obter Histórico (Listas fechadas ou todas as outras)
// Trazemos as últimas 'limitCount'
export async function getHistoryLists(limitCount = 5) {
    // Para simplificar, trazemos todas ordenadas por data, exceto a ativa (filtramos no JS ou fazemos query complexa)
    // Aqui trazemos as mais recentes.
    const q = query(
        collection(db, COLLECTION), 
        orderBy("createdAt", "desc"),
        limit(limitCount + 1) // +1 para compensar a ativa se vier misturada
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
