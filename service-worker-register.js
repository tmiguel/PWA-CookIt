// service-worker-register.js
// Registo do Service Worker (SW)

// O registo é feito se a funcionalidade for suportada pelo browser
if ('serviceWorker' in navigator) {
    // Espera que a página termine de carregar antes de registar
    window.addEventListener('load', () => {
        // CORRIGIDO: Registar com o caminho relativo (./) para o ambiente Firebase Hosting (raiz)
        navigator.serviceWorker.register('./service-worker.js') 
            .then(reg => {
                console.log('Service Worker registado com sucesso:', reg.scope);
            })
            .catch(err => {
                console.error('Falha no registo do Service Worker:', err);
            });
    });
}
