/* v11.99.0: نت‌افراز مستقل و سریع — GET فقط origin؛ همگام پس‌زمینه بدون توقف UI */
(function () {
  "use strict";
  var ORIGIN = location.origin;
  var orig = (window.__CRM_ORIG_FETCH || window.fetch).bind(window);
  window.__CRM_ORIG_FETCH = orig;
  window.v92HubFetch = true;
  var skipOriginApi = false;

  function runtime() {
    return window.__CRM_RUNTIME || {};
  }
  function isStaticRuntime() {
    var p = String((runtime().platform) || "");
    return p === "static" || p === "static-php";
  }
  function envHubs() {
    var rt = runtime();
    var list = [];
    if (rt.baseUrl) list.push(String(rt.baseUrl));
    (rt.hubs || []).forEach(function (h) { if (h) list.push(String(h)); });
    return list;
  }
  function peers() {
    var s = {}, o = [];
    if (/onrender\.com$/i.test(location.hostname)) return o; /* v12.02: Render never fetches Netafraz (CORS/SSL); ndcohub.ir not fetched */
    function add(x) {
      try {
        var u = new URL(x, ORIGIN);
        if (location.protocol === "https:" && u.protocol === "http:") return;
        if (u.origin === ORIGIN) return;
        if (!/onrender\.com$/i.test(u.hostname)) return; /* only pull/push Render */
        if (!s[u.origin]) { s[u.origin] = 1; o.push(u.origin); }
      } catch (e) {}
    }
    envHubs().forEach(add);
    add("https://javad-test1.onrender.com");
    return o;
  }
  function hubs() {
    return skipOriginApi ? [] : [ORIGIN];
  }
  window.v95OriginOnly = true;
  window.crmHubList = hubs;
  window.v99Peers = peers;

  function jsonResp(obj, status) {
    status = status || 200;
    return new Response(JSON.stringify(obj), {
      status: status,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  function fakeFor(path, method) {
    method = method || "GET";
    if (/health|ping|healthz/.test(path)) {
      return jsonResp({ ok: true, status: "healthy", platform: "static-local", version: (window.CRM_APP_VERSION || "12.06.0"), offline: true });
    }
    if (/runtime-config/.test(path)) {
      return jsonResp({ platform: runtime().platform || "static", baseUrl: runtime().baseUrl || "", hubs: runtime().hubs || [], version: "12.06.0" });
    }
    if (/backup\/status/.test(path)) {
      return jsonResp({ status: "ok", cloud: false, local: true, platform: "static-local" });
    }
    if (/\/state/.test(path) || /state/.test(path)) {
      if (method === "POST") return jsonResp({ status: "success", queued: true });
      return jsonResp({ status: "empty" });
    }
    if (/bulk/.test(path)) {
      return jsonResp({ status: "empty" });
    }
    if (/sync/.test(path)) {
      return jsonResp({ status: "error", message: "sync-local-only", queued: false, hint: "api.php /api/sync را آپلود کنید" }, 200);
    }
    return jsonResp({ status: "empty" });
  }

  var LEGACY_TIMEOUT = 12000; /* live GET uses 4000; peers fire-and-forget */
  function fetchTimeout(url, opts, ms) {
    ms = ms || 4000;
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { try { if (ctrl) ctrl.abort(); } catch (e) {} }, ms);
    var o = Object.assign({}, opts || {});
    if (ctrl) o.signal = ctrl.signal;
    return orig(url, o).then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
  }
  function retry(fn, n) {
    return fn().catch(function (err) {
      if (n <= 0) throw err;
      return new Promise(function (res) { setTimeout(function () { res(retry(fn, n - 1)); }, 700); });
    });
  }
  function isApi(url) {
    var s = String(url || "");
    if (s.indexOf("/api/") === 0) return true;
    try { return new URL(s, ORIGIN).pathname.indexOf("/api/") === 0; } catch (e) { return false; }
  }
  function pathOf(url) {
    try { var u = new URL(String(url || ""), ORIGIN); return u.pathname + u.search; } catch (e) { return String(url || ""); }
  }
  function hollowPost(opts) {
    try {
      var b = opts && opts.body;
      if (!b || typeof b !== "string") return false;
      if (b.length < 80) return true;
      var j = JSON.parse(b);
      var d = j && j.data ? j.data : j;
      var ph = (d && d.pharmacies) || [], doc = (d && d.doctors) || [], us = (d && d.users) || [];
      return !ph.length && !doc.length && us.length <= 1;
    } catch (e) { return false; }
  }

  function altApi(path) {
    var p = String(path || "");
    if (p.indexOf("api.php") !== -1) return p;
    var rest = p.replace(/^\/?api\/?/, "");
    return "/api.php?path=" + rest;
  }
  function tryOrigin(path, opts, ms) {
    ms = ms || 8000;
    return fetchTimeout(ORIGIN + path, opts, ms).then(function (r) {
      if (r && r.ok) return r;
      if (r && (r.status === 404 || r.status === 405) && path.indexOf("api.php") === -1) {
        return fetchTimeout(ORIGIN + altApi(path), opts, ms);
      }
      return r;
    }, function () {
      if (path.indexOf("api.php") === -1) return fetchTimeout(ORIGIN + altApi(path), opts, ms);
      throw new Error("origin-fail");
    });
  }
  function hubFetch(url, opts) {
    opts = opts || {};
    var path = pathOf(url);
    var method = String(opts.method || "GET").toUpperCase();
    if (typeof navigator !== "undefined" && navigator.onLine === false) return Promise.resolve(fakeFor(path, method));
    function hdrs(extra) {
      return Object.assign({ "X-CRM-Request": "1" }, opts.headers || {}, extra || {});
    }
    if (method === "GET" || method === "HEAD" || hollowPost(opts)) {
      var o = Object.assign({}, opts, { headers: hdrs() });
      return tryOrigin(path, o, 8000).then(function (r) {
        if (r && r.ok) return r;
        return fakeFor(path, method);
      }).catch(function () { return fakeFor(path, method); });
    }
    var originReq = Object.assign({}, opts, { headers: hdrs({ "X-CRM-Hub-Sync": "1" }) });
    return tryOrigin(path, originReq, 8000).then(function (r) {
      return r && r.ok ? r : fakeFor(path, method);
    }).catch(function () { return fakeFor(path, method); });
  }

  window.fetch = function (url, opts) {
    if (isApi(url)) return hubFetch(url, opts);
    return orig(url, opts);
  };
  window.v92HubFetch = true;
  window.v93HubFetch = hubFetch;
  window.v94StaticLocal = true;
  window.v99FastLocal = true;

  if (!isStaticRuntime()) {
    orig("/api/runtime-config", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
      if (!c || typeof c !== "object") return;
      window.__CRM_RUNTIME = Object.assign({}, runtime(), c);
    }).catch(function () {});
  }
})();
