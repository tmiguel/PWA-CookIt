import { auth, googleProvider } from '../firebase.js';
import { 
    signInWithRedirect, 
    signOut, 
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function loginWithGoogle() {
    try {
        // Usa Redirect (Melhor para Telemóvel)
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Erro Login:", error);
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
