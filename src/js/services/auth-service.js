import { auth, googleProvider } from '../firebase.js';
import { 
    signInWithPopup, // <--- Voltamos ao Popup
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function loginWithGoogle() {
    try {
        // Usa Popup em vez de Redirect
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Erro Login:", error);
        alert("Erro no Login: " + error.message);
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
