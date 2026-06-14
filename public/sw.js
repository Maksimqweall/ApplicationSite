const CACHE_NAME = 'fittrack-cache-v15';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@600;700;800&display=swap'
];

// УСТАНОВКА: Скачиваем новые файлы и убиваем режим ожидания
self.addEventListener('install', (event) => {
  self.skipWaiting(); // <--- ВОТ ЭТА КОМАНДА ВЫГОНЯЕТ СТАРЫЙ КЭШ СРАЗУ
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэширование ресурсов...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// АКТИВАЦИЯ: Удаляем старый мусор и мгновенно захватываем вкладки
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Удаление старого кэша:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim()) // <--- МГНОВЕННО ПРИМЕНЯЕМ К ТЕКУЩЕЙ СТРАНИЦЕ
  );
});

// ПЕРЕХВАТ ЗАПРОСОВ (Остается без изменений)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.includes('google')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});