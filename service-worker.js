'use-sctict';

const CACHE_NAME = 'brinquedo-app-estatico';

const FILES_TO_CACHE = [
    'css/bootstrap.min.css',
    'css/styles.css',
    'icons/favicon.ico',
    'icons/152.png',
    'imgs/logo.png',
    'imgs/bg001.jpg',
    'imgs/bg002.jpg',
    'imgs/cat_icon.jpg',
    'imgs/offline.png',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'offline.html'
];

// Instalação do Service Worker
self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Instalando...');

    // Precisa ser assíncrono
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Cacheando arquivos app-shell');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Ativando...');

    // Precisa ser assíncrono
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removendo cache antigo', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    self.clients.claim();
});

// Responder página offline do app
self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);

    if (evt.request.mode !== 'navigate') {
        // Não é uma navegação, não faz nada
        return;
    }

    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
});