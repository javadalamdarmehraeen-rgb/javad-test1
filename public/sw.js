const CACHE = "ttt-v11.36.0";
const PRECACHE = ["/", "/login", "/favicon.png", "/logo.png", "/vendor/leaflet.js", "/vendor/leaflet.css"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE).catch(function () {}); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("message", function (e) {
  if (e.data === "skipWaiting") self.skipWaiting();
  if (e.data === "purgeOldCaches") e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}));
});
self.addEventListener("push", function (e) {
  var data={};try{data=e.data?e.data.json():{};}catch(x){data={body:e.data?e.data.text():"پیام جدید"};}
  e.waitUntil(self.registration.showNotification(data.title||"پیام جدید CRM",{body:data.body||"",icon:"/logo.png",badge:"/favicon.png",tag:data.tag||"crm-message",renotify:true,vibrate:[220,100,220,100,320],requireInteraction:true,data:{url:data.url||"/panel#tab-notifications"}}));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();var url=(e.notification.data&&e.notification.data.url)||"/panel#tab-notifications";e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(function(list){for(var i=0;i<list.length;i++){if("focus" in list[i]){list[i].navigate(url);return list[i].focus();}}return clients.openWindow?clients.openWindow(url):null;}));
});
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.pathname.indexOf("/api/") === 0) return;
  var fresh=/\.(?:js|css)$/.test(u.pathname)||e.request.mode==="navigate";
  var request=fresh?new Request(e.request,{cache:"no-store"}):e.request;
  e.respondWith(fetch(request).then(function (res) {
    if (res.ok && (u.pathname.indexOf("/vendor/") === 0 || /\.(png|css|js)$/.test(u.pathname))) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  }).catch(function () { return caches.match(e.request); }));
});
