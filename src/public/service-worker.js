const CACHE_NAME = 'storymap-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon.png',
    '/icons/icon-splash.png',
    '/pages/offline/index.html', // ✅ offline fallback
];

// Cache static files on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
    self.skipWaiting(); // ✅ immediately activate
});

// Clean old cache on activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) =>
                        key !== CACHE_NAME ? caches.delete(key) : null,
                    ),
                ),
            ),
    );
    self.clients.claim(); // ✅ control all clients
});

// Offline-first fetch with fallback to offline page
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            return (
                resp ||
                fetch(event.request).catch(() =>
                    caches.match('/pages/offline/index.html'),
                )
            );
        }),
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'StoryMapKita';
    const options = {
        body: data.options?.body || 'Notifikasi cerita baru!',
        icon: '/icons/icon.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Message handler (for test-push or other future events)
self.addEventListener('message', (event) => {
    if (event.data?.type === 'test-push') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
        });
    }
});
