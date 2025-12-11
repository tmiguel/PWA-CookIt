// service-worker-register.js
// Registo do Service Worker (SW)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registar com o caminho da subpasta (relativo à raiz do domínio)
        navigator.serviceWorker.register('/PWA-CookIt/service-worker.js')
            .then(reg => {
                console.log('Service Worker registado com sucesso:', reg.scope);
            })
            .catch(err => {
                console.error('Falha no registo do Service Worker:', err);
            });
    });
}
