import { auth, googleProvider } from '../firebase.js';
import { 
    signInWithRedirect, // Mudei de Popup para Redirect
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function loginWithGoogle() {
    try {
        // Redireciona a página inteira para o Google (melhor para Mobile/PWA)
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Erro Login:", error);
        alert("Erro ao iniciar sessão: " + error.message);
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

// Ouve as mudanças de estado (funciona igual com Popup ou Redirect)
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
