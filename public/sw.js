/* Cache the public site shell. Does not store waitlist emails or private notes. */
var CACHE = "noo-site-shell-v2";
var ASSETS = [
  "/",
  "/log",
  "/sources",
  "/corrections",
  "/check",
  "/manifest.webmanifest",
  "/assets/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE; }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(function (res) {
      return res;
    }).catch(function () {
      return caches.match(event.request);
    })
  );
});
