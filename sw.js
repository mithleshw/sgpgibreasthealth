/* Pink Wave 2026 — offline service worker
   Bump CACHE whenever you change any file, otherwise phones keep the old copy. */
const CACHE = "pinkwave-v12";

const ASSETS = [
  "./", "./index.html", "./content.js?v=12", "./app.js?v=12",
  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./img/step1.webp","./img/step2.webp","./img/step3.webp","./img/step4.webp",
  "./img/step5.webp","./img/step6.webp","./img/pads.webp","./img/overlap.webp",
  "./img/proc1.webp","./img/proc2.webp","./img/proc3.webp",
  "./img/step1.jpg","./img/step2.jpg","./img/step3.jpg","./img/step4.jpg",
  "./img/step5.jpg","./img/step6.jpg","./img/pads.jpg","./img/overlap.jpg",
  "./img/proc1.jpg","./img/proc2.jpg","./img/proc3.jpg",
  "./img/logo.png","./img/logo@2x.png",
  "./img/art1.webp","./img/art2.webp","./img/art3.webp","./img/art4.webp",
  "./img/art1.jpg","./img/art2.jpg","./img/art3.jpg","./img/art4.jpg",
  "./img/cert.webp","./img/cert.jpg"
];
/* The two PDFs are deliberately NOT pre-cached — together they are 3 MB and
   would blow the install budget on a slow connection. They are cached only
   once someone actually downloads one. */

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;      /* never touch YouTube / analytics */

  /* cache-first: this app is static and must work with no signal */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => {
      /* Only fall back to the app shell for PAGE loads. Returning index.html
         for a failed image or PDF request would hand HTML to an <img> tag. */
      if (req.mode === "navigate") return caches.match("./index.html");
      return Response.error();
    }))
  );
});
