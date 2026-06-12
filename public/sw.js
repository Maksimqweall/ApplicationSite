const CACHE_NAME = 'fittrack-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@600;700;800&display=swap'
];

// Установка: кэшируем основные файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэширование ресурсов...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Активация: удаляем старые версии кэша, если мы обновили приложение
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
    })
  );
});

// Перехват запросов (Стратегия: Stale-While-Revalidate для статики)
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к API (базе данных) и Google авторизации
  if (event.request.url.includes('/api/') || event.request.url.includes('google')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Возвращаем из кэша, если есть. Иначе идем в интернет.
      return cachedResponse || fetch(event.request);
    })
  );
});