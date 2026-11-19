// Страница работает без сети: index.html хранится в кэше телефона. При открытии с сетью кэш обновляется.
// Сборка: 2026-11-19T08:03:57.512Z
const КЭШ = 'zhurnal-@@SBORKA@@', ФАЙЛЫ = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(КЭШ).then((c) => c.addAll(ФАЙЛЫ)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((к) => Promise.all(к.filter((x) => x !== КЭШ).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
// Только свои файлы (GET с этого же адреса). Запросы в DaData идут мимо.
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const к = r.clone(); caches.open(КЭШ).then((c) => c.put(e.request, к)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
});
