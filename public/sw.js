const CACHE_NAME = "chatkit-pwa-v1";
const PRECACHE_URLS = [
  "/",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
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
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          return caches.match("/");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return;
            }
            const copy = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, copy))
              .catch(() => undefined);
          })
          .catch(() => undefined);
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, copy))
            .catch(() => undefined);
          return response;
        })
        .catch(async () => {
          if (PRECACHE_URLS.includes(url.pathname)) {
            return caches.match(request);
          }
          return caches.match("/");
        });
    })
  );
});

