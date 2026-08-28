/* v11.93.0: هاب پویا + timeout/retry برای اینترنت ایران — بدون آدرس ثابت اجباری */
(function () {
  "use strict";
  var ORIGIN = location.origin;
  var orig = (window.__CRM_ORIG_FETCH || window.fetch).bind(window);
  window.__CRM_ORIG_FETCH = orig;
  window.v92HubFetch = true;

  function runtime() {
    return window.__CRM_RUNTIME || {};
  }
  function envHubs() {
    var rt = runtime();
    var list = [];
    if (rt.baseUrl) list.push(String(rt.baseUrl));
    (rt.hubs || []).forEach(function (h) { if (h) list.push(String(h)); });
    return list;
  }
  function hubs() {
    var s = {}, o = [];
    function add(x) {
      try {
        var u = new URL(x, ORIGIN);
        if (location.protocol === "https:" && u.protocol === "http:") return;
        if (!s[u.origin]) { s[u.origin] = 1; o.push(u.origin); }
      } catch (e) {}
    }
    add(ORIGIN);
    envHubs().forEach(add);
    (window.CRM_HUBS || []).forEach(add);
    return o;
  }
  window.crmHubList = hubs;

  function fetchTimeout(url, opts, ms) {
    ms = ms || 12000;
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { try { if (ctrl) ctrl.abort(); } catch (e) {} }, ms);
    var o = Object.assign({}, opts || {});
    if (ctrl) o.signal = ctrl.signal;
    return orig(url, o).then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
  }
  function retry(fn, n) {
    return fn().catch(function (err) {
      if (n <= 0) throw err;
      return new Promise(function (res) {
        setTimeout(function () { res(retry(fn, n - 1)); }, 700);
      });
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

  function hubFetch(url, opts) {
    opts = opts || {};
    var path = pathOf(url);
    var method = String(opts.method || "GET").toUpperCase();
    var bases = hubs();
    function hdrs(extra) {
      return Object.assign({ "X-CRM-Request": "1" }, opts.headers || {}, extra || {});
    }
    function one(i) {
      if (i >= bases.length) return fetchTimeout(url, opts, 12000);
      var o = Object.assign({}, opts, { headers: hdrs() });
      if (bases[i] !== ORIGIN) o.mode = "cors";
      return retry(function () { return fetchTimeout(bases[i] + path, o, 12000); }, 2)
        .then(function (r) { return (r && r.ok) ? r : one(i + 1); })
        .catch(function () { return one(i + 1); });
    }
    if (method === "GET" || method === "HEAD") return one(0);
    if (hollowPost(opts)) return one(0);
    var posts = bases.map(function (base) {
      var o = Object.assign({}, opts, { headers: hdrs({ "X-CRM-Hub-Sync": "1" }) });
      if (base !== ORIGIN) o.mode = "cors";
      return retry(function () { return fetchTimeout(base + path, o, 15000); }, 1)
        .then(function (r) { return r; })
        .catch(function () { return null; });
    });
    return Promise.all(posts).then(function (rs) {
      var ok = null;
      rs.forEach(function (r) { if (!ok && r && r.ok) ok = r; });
      return ok || rs[0] || fetchTimeout(url, opts, 12000);
    });
  }

  window.fetch = function (url, opts) {
    if (isApi(url)) return hubFetch(url, opts);
    return orig(url, opts);
  };
  window.v92HubFetch = true;
  window.v93HubFetch = hubFetch;

  orig("/api/runtime-config", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
    if (!c || typeof c !== "object") return;
    window.__CRM_RUNTIME = Object.assign({}, runtime(), c);
    window.CRM_HUBS = hubs();
  }).catch(function () {});
})();
