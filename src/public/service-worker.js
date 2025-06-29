const CACHE_NAME = 'storymap-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/icons/icon.png',
    '/icons/icon-splash.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => key !== CACHE_NAME && caches.delete(key)),
                ),
            ),
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Tangani hanya GET request
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    return caches.match('/offline.html');
                });
            }),
    );
});
