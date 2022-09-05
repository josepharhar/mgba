const cacheName = 'v1';

self.addEventListener('fetch', async event => {
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse)
    return cachedResponse;
  const responseFromNetwork = await fetch(event.request);
  const cache = await caches.open(cacheName);
  await cache.put(event.request, responseFromNetwork.clone());
  return responseFromNetwork;
});

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([
      // TODO find a good way to maintain this list.
      // maybe i could have cmake generate this as part of the build?
      // and make a new cache/version based on the commit hash?
      '/index.html',
      '/manifest.json',
      '/build/mgba.js',
      '/build/mgba.wasm',
      '/game.js',
      '/game.css',
      '/gamemenu.js',
      '/menu.js',
      '/pre.js',
      '/settings.js',
      '/style.css',
      '/touchcontrols.js',
      '/fileloader.js',
      '/icons/mgba.ico',
    ]);
  })());
});

// TODO find a way to fetch new stuff...?
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#deleting_old_caches

// TODO consider using navigation preload
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#service_worker_navigation_preload
