const BUILD = "12.05.0";
const CACHE = "crm-static-v" + BUILD;

async function purgeEveryCache() {
  const keys = await caches.keys();
  await Promise.all(keys.map(function (key) { return caches.delete(key); }));
}

async function announceBuild() {
  const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  list.forEach(function (client) { client.postMessage({ type: "CRM_BUILD_ACTIVE", build: BUILD }); });
}

self.addEventListener("install", function (event) {
  event.waitUntil(purgeEveryCache().then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(purgeEveryCache().then(function () { return self.clients.claim(); }).then(announceBuild));
});

self.addEventListener("message", function (event) {
  if (event.data === "skipWaiting") self.skipWaiting();
  if (event.data === "purgeOldCaches" || (event.data && event.data.type === "CRM_FORCE_REFRESH")) {
    event.waitUntil(purgeEveryCache().then(announceBuild));
  }
});

self.addEventListener("push", function (event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { body: event.data ? event.data.text() : "پیام جدید" }; }
  event.waitUntil(self.registration.showNotification(data.title || "پیام جدید CRM", {
    body: data.body || "", icon: "/logo.png", badge: "/favicon.png",
    tag: data.tag || "crm-message", renotify: true,
    vibrate: [220, 100, 220, 100, 320], requireInteraction: true,
    data: { url: data.url || "/panel#tab-notifications" }
  }));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/panel#tab-notifications";
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (let i = 0; i < list.length; i++) {
      if ("focus" in list[i]) { list[i].navigate(url); return list[i].focus(); }
    }
    return clients.openWindow ? clients.openWindow(url) : null;
  }));
});

function fetchWithTimeout(req, ms) {
  const ac = typeof AbortController !== "undefined" ? new AbortController() : null;
  const to = setTimeout(function () { try { if (ac) ac.abort(); } catch (e) {} }, ms || 8000);
  const opts = ac ? { signal: ac.signal } : {};
  return fetch(req, opts).then(function (r) { clearTimeout(to); return r; }, function (err) { clearTimeout(to); throw err; });
}

function fallbackResponse(request) {
  if (request && request.mode === "navigate") {
    return new Response("<!doctype html><meta charset='utf-8'><title>اتصال لازم است</title><body dir='rtl' style='font-family:Tahoma;text-align:center;padding:40px'><h2>اتصال ضعیف است. دوباره تلاش کنید.</h2><p><a href='/?nosw=1'>باز کردن بدون کش</a></p><button onclick='location.reload()'>تلاش دوباره</button></body>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }
  return new Response("نسخه تازه در دسترس نیست", { status: 503, headers: { "Cache-Control": "no-store" } });
}

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET") return;
  if (request.mode === "navigate") return;
  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  const isApi = url.pathname.indexOf("/api/") === 0;
  const mustBeFresh = request.mode === "navigate" || /\.(?:html|js|css|json|webmanifest)$/.test(url.pathname) || url.pathname === "/sw.js";

  function asResponse(r) {
    if (r && typeof r.status === "number") return r;
    return fallbackResponse(request);
  }

  if (isApi || mustBeFresh) {
    event.respondWith(Promise.resolve().then(function () {
      var fresh = request;
      try {
        fresh = isApi ? new Request(request, { cache: "no-store" }) : new Request(request, { cache: "reload" });
      } catch (eReq) { fresh = request; }
      var ms = request.mode === "navigate" ? 25000 : (isApi ? 12000 : 8000);
      return fetchWithTimeout(fresh, ms);
    }).then(function (response) {
      if (response && response.ok && !isApi) {
        try {
          const copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
        } catch (ePut) {}
      }
      return asResponse(response);
    }).catch(function () {
      return caches.match(request).then(function (hit) {
        return asResponse(hit);
      }).catch(function () { return fallbackResponse(request); });
    }));
    return;
  }

  event.respondWith(Promise.resolve().then(function () {
    var req = request;
    try { req = new Request(request, { cache: "no-cache" }); } catch (e2) { req = request; }
    return fetchWithTimeout(req, 8000);
  }).then(function (response) {
    if (response && response.ok && /\.(?:png|jpg|jpeg|ico|woff2)$/.test(url.pathname)) {
      try {
        const copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
      } catch (ePut2) {}
    }
    return asResponse(response);
  }).catch(function () {
    return caches.match(request).then(function (hit) {
      return asResponse(hit);
    }).catch(function () { return fallbackResponse(request); });
  }));
});
