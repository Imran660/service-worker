const cacheName = "cache-v3";
const cacheFiles = ["index.js", "index.html"];

//install the service worker
self.addEventListener("install", (e) => {
  console.log("Service worker installed");

  //adding files into the cache storage
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("service worker: caching files");
        cache.addAll(cacheFiles);
      })
      .then(() => self.skipWaiting())
  );
});

//activate service worker
self.addEventListener("activate", (e) => {
  console.log("service worker activated");

  //Remove duplicated caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("clearing duplicated cache " + cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((response) => {
        if (response) {
          console.log("taking files from cache storage");
          return response;
        }
        return fetch(e.request).then((response) => {
          console.log("making new fetch " + response);
          //check if we get valid response
          if (!response || response.status != 200 || response.type != "basic") {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        });
      })
      .catch((e) => console.log("something went wrong with fetch event" + e))
  );
});
