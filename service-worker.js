/* CampusCalc — Production Service Worker */
"use strict";

const CACHE_NAME = "campuscalc-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle normal GET requests.
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {

        // Save successful files for offline use.
        if (
          response.ok &&
          new URL(request.url).origin === self.location.origin
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {

          // Return the cached version if available.
          if (cached) return cached;

          // If navigating offline, load CampusCalc.
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }

          return new Response("", {
            status: 503,
            statusText: "Offline"
          });
        })
      )
  );
});
