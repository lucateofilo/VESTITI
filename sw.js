// Service worker: rende l'app utilizzabile anche offline.
const CACHE = 'armadio-v5';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-w.svg', 'icon-m.svg', 'icon-x.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Prima la rete (così gli aggiornamenti arrivano subito), poi la cache se offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
