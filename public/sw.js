const CACHE_NAME = "schildkroetenklasse-einmaleins-v5";
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");

function withBase(path = "") {
  if (!SCOPE_PATH) {
    return path ? `/${path}` : "/";
  }

  return path ? `${SCOPE_PATH}/${path}` : `${SCOPE_PATH}/`;
}

const APP_SHELL = [
  withBase(),
  withBase("index.html"),
  withBase("manifest.webmanifest"),
  withBase("icon.svg"),
  withBase("icon-192.png"),
  withBase("icon-512.png"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("/reward-state") || url.pathname.endsWith(".mp4")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseClone = networkResponse.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone)));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          return caches.match(withBase("index.html"));
        }

        return new Response("", { status: 504, statusText: "Offline" });
      })
  );
});
