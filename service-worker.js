// service-worker.js
// PWA Service Worker (Estratégia: Cache-First para App Shell)

const CACHE_NAME = 'chef-movel-v2-cache'; // Versão de cache atualizada

// Lista de ficheiros estáticos que compõem o App Shell (a UI)
// TODOS OS CAMINHOS SÃO RELATIVOS À RAIZ DO HOSTING (Firebase)
const urlsToCache = [
    '/', // O root
    '/index.html',
    '/styles.css',
    '/main.js',
    '/auth.js',
    '/router.js',
    '/ui.js',
    '/recipeService.js',
    '/configService.js',
    '/firebase-config.js',
    '/manifest.json',
    '/service-worker-register.js',
    // Assets (Ícones)
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    // O Framework CSS (Pico CSS CDN) - URLs externas devem ser incluídas
    'https://cdn.jsdelivr.net/npm/@picocss/pico@1.5.10/css/pico.min.css',
    // Os SDKs do Firebase (URLs externas devem ser incluídas)
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js'
];

// 1. Evento 'install': Cachear o App Shell
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalação e Caching do App Shell.');
    // Pula o estado 'waiting' e ativa-se imediatamente
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Falha ao cachear URLs: ', error);
            })
    );
});

// 2. Evento 'activate': Limpar caches antigos
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativação e Limpeza de Cache Antigo.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Elimina qualquer cache que não seja a versão atual
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] A eliminar cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Evento 'fetch': Servir App Shell do Cache
self.addEventListener('fetch', (event) => {
    // 3.1. Estratégia Cache-First para o App Shell
    // Para URLs externas (como Firebase/CDN), a estratégia é simples: usar cache se estiver lá.
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                // Se o recurso estiver no cache, devolve-o, senão busca na rede.
                return response || fetch(event.request);
            })
        );
    } 
    // 3.2. Estratégia Cache-First para recursos internos (HTML/JS/CSS)
    else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
