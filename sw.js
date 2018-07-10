const staticCacheName = 'restaurant-reviews-v2'
const contentImgsCache = 'restaurant-content-imgs'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        return cache.addAll([
          '/manifest.json',
          '/index.html',
          '/restaurant.html',
          '/css/styles.css',
          'js/idb.js',
          '/js/dbhelper.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/sw.js',
          '/img/noimage.gif'
        ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(serveImage(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        Promise.all(
          cacheNames.filter((cacheName) => {
            return cacheName.startsWith('restaurant-') && cacheName !== staticCacheName && cacheName !== contentImgsCache;
          }).map((cacheName) => caches.delete(cacheName))
        )
      })
  );
});

function serveImage(request) {
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  if (storageUrl.includes('/undefined_')) {
    return caches.match('/img/noimage.gif');
  }

  return caches.open(contentImgsCache).then((cache) => {
    return cache.match(storageUrl).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      })
    });
  });
}