import { auth, googleProvider } from '../firebase.js';
import { 
    signInWithRedirect, 
    signOut, 
    onAuthStateChanged,
    getRedirectResult // <--- Importante
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Iniciar Login
export async function loginWithGoogle() {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Erro no redirect:", error);
        alert("Erro: " + error.message);
    }
}

// Finalizar Login (Processar regresso)
export async function finishRedirectLogin() {
    try {
        // O Firebase verifica se viemos do Google agora
        await getRedirectResult(auth);
    } catch (error) {
        console.error("Erro ao voltar do Google:", error);
        alert("Falha na autenticação: " + error.message);
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
