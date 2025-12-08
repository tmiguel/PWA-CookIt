// service-worker-register.js
// Registo do Service Worker (SW)

// --- Registo do Service Worker (Tarefa 6) ---
if ('serviceWorker' in navigator) {
    // Usamos 'load' para garantir que a página está totalmente carregada antes de registar o SW
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => {
                console.log('Service Worker registado com sucesso:', reg.scope);
            })
            .catch(err => {
                console.error('Falha no registo do Service Worker:', err);
            });
    });
}
