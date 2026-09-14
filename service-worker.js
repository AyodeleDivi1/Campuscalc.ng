const CACHE_NAME = "campuscalc-v6";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./robots.txt",
  "./sitemap.xml",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cache files individually so one missing file
      // does not break the entire service worker.
      await Promise.allSettled(
        FILES_TO_CACHE.map(file =>
          cache.add(file).catch(() => null)
        )
      );
    })
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;

  // Always try the network first for pages.
  // This prevents the phone from being stuck
  // using an old cached index.html.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy).catch(() => {});
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cached => cached || caches.match("./index.html"));
        })
    );

    return;
  }

  // For other files, use cache first and network as fallback.
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(response => {
          if (
            response &&
            response.ok &&
            response.type === "basic"
          ) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy).catch(() => {});
            });
          }

          return response;
        })
        .catch(() => {
          return new Response("", {
            status: 503,
            statusText: "Offline"
          });
        });
    })
  );
});
