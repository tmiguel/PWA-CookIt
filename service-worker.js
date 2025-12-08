// service-worker.js
// PWA Service Worker (Estratégia: Cache-First para App Shell)

const CACHE_NAME = 'chef-movel-v1';

// Lista de ficheiros estáticos que compõem o App Shell (a UI)
// O Chrome DevTools ou uma ferramenta de build ajudaria, mas fazemos manualmente aqui.
const urlsToCache = [
    '/', // O root
    '/index.html',
    '/app.js',
    '/firebase-config.js',
    '/manifest.json',
    // Assets (Ícones)
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    // O Framework CSS (Pico CSS CDN)
    'https://cdn.jsdelivr.net/npm/@picocss/pico@1.5.10/css/pico.min.css',
    // Os SDKs do Firebase (Os caminhos devem corresponder exatamente aos usados no index.html)
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

// 1. Evento 'install': Cachear o App Shell
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalação e Caching do App Shell.');
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
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Se o recurso estiver no cache, devolve-o
            if (response) {
                return response;
            }
            // Se não estiver no cache, busca na rede
            return fetch(event.request).catch(() => {
                // Se a rede falhar e o recurso não estiver cacheado (ex: dados Firestore), falha.
                // O Firebase Firestore SDK trata os dados offline automaticamente (persistency).
                // Para este App Shell, não precisamos de uma página de fallback de "Offline"
                // porque o index.html e a UI devem ser sempre servidos pelo cache.
            });
        })
    );
});
