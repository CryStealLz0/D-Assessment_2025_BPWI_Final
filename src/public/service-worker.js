const CACHE_NAME = 'storymap-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon.png',
    '/icons/icon-splash.png',
];

// Cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
    self.skipWaiting();
});

// Activate and clean old caches
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

// Intercept fetch for offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((resp) => resp || fetch(event.request)),
    );
});

// Handle push
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'StoryMapKita';
    const options = {
        body: data.options?.body || 'Notifikasi cerita baru!',
        icon: '/icons/icon.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle test message
self.addEventListener('message', (event) => {
    if (event.data?.type === 'test-push') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
        });
    }
});
