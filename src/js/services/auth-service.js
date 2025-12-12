import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function loginWithGoogle() {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Erro Login:", error);
        alert("Erro ao entrar: " + error.message);
    }
}

export async function logout() {
    await signOut(auth);
    window.location.reload(); // Recarrega para limpar estado
}

// Observador: Avisa o main.js quando o estado muda (Logado vs Não Logado)
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
