const CACHE_NAME = 'mi-cache-v1';
const URLS_A_CACHEAR = [
    '/index.html',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png'
];


// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos cacheados');
                return cache.addAll(URLS_A_CACHEAR);
            })
    );
});

// Activación y limpieza de caches viejos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache antiguo eliminado:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estrategia cache-first en la gestión de fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Si el recurso está en la cache, lo devuelve
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Si no está en la cache, lo solicita a la red y lo cachea
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
    );
});
