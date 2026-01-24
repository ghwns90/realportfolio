// 캐시 이름
const CACHE_NAME = 'portfolio-cache-v1';

// 설치 시 캐싱할 파일
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

// 요청 가로채기 (오프라인에서도 작동하게 하려면 필요)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});