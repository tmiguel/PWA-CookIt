import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfjc7Z0U4w7HRJUJuYVpMnqhozcZMHgww",
    authDomain: "cookit-83f40.firebaseapp.com",
    projectId: "cookit-83f40",
    storageBucket: "cookit-83f40.firebasestorage.app",
    messagingSenderId: "620804753444",
    appId: "1:620804753444:web:15c1b12a9683cf117ff0b1",
    measurementId: "G-QE23KDSLS5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("🔥 Firebase Firestore ligado!");
