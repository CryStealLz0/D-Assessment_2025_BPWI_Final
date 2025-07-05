const CACHE_NAME = 'storymap-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon.png',
    '/icons/icon-splash.png',
];

// Precache static resources (application shell)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
    self.skipWaiting();
});

// Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                }),
            ),
        ),
    );
    self.clients.claim();
});

self.addEventListener('push', (event) => {
    console.log('Service worker pushing...');

    async function chainPromise() {
        const data = await event.data.json();
        await self.registration.showNotification(data.title, {
            body: data.options.body,
        });
    }

    event.waitUntil(chainPromise());
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);

    // Strategy: Cache First for API images
    if (
        requestUrl.origin === 'https://story-api.dicoding.dev' &&
        requestUrl.pathname.startsWith('/images/')
    ) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request)
                    .then((response) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    })
                    .catch(() => {
                        // Optional fallback image
                        return caches.match('/icons/icon.png');
                    });
            }),
        );
        return;
    }

    // Strategy: Network First for all other requests
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cached) => {
                    return cached || caches.match('/index.html');
                });
            }),
    );
});
