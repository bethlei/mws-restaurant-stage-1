const staticCacheName = 'restaurant-reviews-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/restaurant.html',
          '/css/styles.css',
          '/data/restaurants.json',
          '/js/dbhelper.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/sw.js',
          // cache images
          ...[...Array(10)].map((_, index) => `/img/banners/${index + 1}_1x.jpg`),
          ...[...Array(10)].map((_, index) => `/img/banners/${index + 1}_2x.jpg`),
          ...[...Array(10)].map((_, index) => `/img/tiles/${index + 1}_1x.jpg`),
          ...[...Array(10)].map((_, index) => `/img/tiles/${index + 1}_2x.jpg`)
        ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
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
            return cacheName.startsWith('restaurant-') && cacheName !== staticCacheName;
          }).map((cacheName) => caches.delete(cacheName))
        )
      })
  );
});