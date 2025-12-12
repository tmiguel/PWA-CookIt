export const loginTemplate = `
<div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:20px; text-align:center;">
    <h1 style="color:var(--primary-color); font-size:2.5rem; margin-bottom:10px;">CookIt 🍳</h1>
    <p style="color:var(--text-light); margin-bottom:40px;">A tua cozinha, organizada.</p>
    
    <button id="btn-google-login" style="
        background-color: white; 
        color: #757575;
        border: 1px solid #ddd;
        padding: 12px 24px;
        border-radius: 24px;
        font-weight: bold;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        cursor: pointer;">
        
        <!-- Icon Google SVG Simples -->
        <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"></path>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.716H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"></path>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.448 2.797 1.237 3.935l2.727-2.224z" fill="#FBBC05"></path>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.272C4.672 5.14 6.656 3.58 9 3.58z" fill="#EA4335"></path>
        </svg>
        Entrar com Google
    </button>
</div>
`;
