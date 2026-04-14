// Minimal Service Worker to satisfy PWA criteria
const CACHE_NAME = 'fadhilah-berkah-cache-v1';
const OFFLINE_URL = '/';

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                OFFLINE_URL,
                '/manifest.json',
                '/favicon.ico',
                '/icons/icon-192x192.png'
            ]);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event (MANDATORY for PWA installation)
self.addEventListener('fetch', (event) => {
    // Only handle GET requests for caching
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If it's a valid response, return it
                if (response && response.status === 200) {
                    return response;
                }
                return response;
            })
            .catch(async () => {
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                // If it's a navigation request, return the offline root
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }

                // Return a generic error response for images/scripts instead of crashing
                return new Response('Network error occurred', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' },
                });
            })
    );
});
