import { auth, googleProvider } from '../firebase.js';
import { 
    signInWithRedirect, 
    signOut, 
    onAuthStateChanged,
    getRedirectResult // <--- NOVO
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function loginWithGoogle() {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        alert("Erro ao iniciar: " + error.message);
    }
}

export async function logout() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error("Erro Logout:", error);
    }
}

export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

// --- NOVA FUNÇÃO PARA DEBUG ---
// Verifica se acabámos de voltar do Google e se houve erro
export async function checkRedirectError() {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            // Sucesso! O user voltou do Google.
            // Não precisamos fazer nada, o monitorAuthState vai apanhar.
        }
    } catch (error) {
        // AQUI ESTÁ O ERRO SILENCIOSO
        alert("ERRO AO VOLTAR DO GOOGLE:\n" + error.message);
    }
}
