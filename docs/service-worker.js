const CACHE_NAME = 'storymap-cache-v2';
const urlsToCache = [
<<<<<<< HEAD
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon.png',
    '/icons/icon-splash.png',
=======
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.png',
  '/icons/icon-splash.png',
>>>>>>> update-notif-2
];

// Precache static resources (application shell)
self.addEventListener('install', (event) => {
<<<<<<< HEAD
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
    self.skipWaiting();
=======
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
  self.skipWaiting();
});

self.addEventListener('push', (event) => {
  console.log('📩 Push event received');

  async function chainPromise() {
    try {
      const data = await event.data.json();
      console.log('📦 Payload received from push:', data); // ✅ log it here

      await self.registration.showNotification(data.title, {
        body: data.options?.body || 'No body provided',
      });
    } catch (e) {
      console.error('❌ Failed to parse push payload:', e);
      await self.registration.showNotification('Fallback Title', {
        body: 'Could not parse push data',
      });
    }
  }

  event.waitUntil(chainPromise());
>>>>>>> update-notif-2
});

// Cleanup old caches
self.addEventListener('activate', (event) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> update-notif-2
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
<<<<<<< HEAD
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
=======
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

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }

        // If no open tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }),
  );
>>>>>>> update-notif-2
});
