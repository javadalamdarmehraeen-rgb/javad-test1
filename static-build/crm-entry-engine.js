/* ============================================================================
   crm-entry-engine.js — «موتورِ ورود» (نسخه 12.18.6 — نوبت ۱۳۹)
   درخواستِ کاربر: «وقتی دکمهٔ ورود به برنامه زده شد، تمامِ اطلاعاتِ قدیمیِ
   دستگاه پاک شود، بعد تغییراتِ تازه اعمال شود، بعد واردِ صفحهٔ اصلی شو؛
   دستی‌اش هم در تب عیب‌یابی باشد؛ اما اطلاعاتِ ثبت‌شده رویِ سرور هرگز پاک نشود.
   ──────────────────────────────────────────────────────────────────────────
   قانون‌هایِ ایمنی:
   • هیچِ درخواستِ شبکه‌ای با متدِ نوشتن/حذف فرستاده نمی‌شود — این موتورِ سمتِ
     مرورگر است؛ سرور دست‌نخورده (پاک‌سازیِ فایل‌هایِ کهنهٔ سرور کارِ لایهٔ
     v12.18 است که خودش با فهرستِ مجاز و بدونِ لمسِ دادهٔ زنده انجامش می‌دهد).
   • همیشه: سرویس‌ورکرها unregister، همه‌ی CacheStorage حذف (کشِ HTTP = ریشهٔ
     پرش‌ها و نسخهٔ کهنه).
   • فقط وقتی آنلاینیم (یا صفِ ارسالِ باز و حالتِ solo نداریم): جارویِ
     localStorage/sessionStorage با فهرستِ امانت + حذفِ IndexedDBِ موقتِ crmV19 +
     پاک‌کردنِ مُهرِ stateِ محلی تا برنامه دادهٔ تازه را از سرور بگیرد.
     آفلاین + تغییرِ ثبت‌نشده یا دستگاهِ solo = حالتِ light (فقط کش/SW).
   • مُهرِ CRM_V1218_PURGED پاک می‌شود تا لایهٔ ۱۲.۱۸ در اولین بوتِ بعدی،
     مهاجرت‌ها/یکتاسازیِ ترتیب/اعمالِ چیدمان را دوباره اجرا کند.
   • رویِ ویندوز و گوشی یکسان کار می‌کند (Chrome/Edge/Firefox؛ iOS Safari هم
     کش/SW را پاک می‌کند و storage در همانِ origin است).
   ============================================================================ */
(function () {
  "use strict";
  if (window.crmEntryEngine) return;

  var VER = "12.23.0";
  var KEEP_LS = /^(CRM_USERS_AUTH|CRM_LOGIN_OK|CRM_LOGIN_EXP|CRM_REMEMBER|crmRemember|CRM_SOLO_|CRM_BULK|CRM_RUNTIME|CRM_INSTALL|CRM_PWA|crmPwa|crmTheme|CRM_THEME|distPass_|CRM_PENDING_SYNC|CRM_ENTRY_1218_|CRM_V1218_)/i;
  var KEEP_SS = /^(crm[A-Z]|distPass_|CRM_PENDING_SYNC|CRM_SOLO_|CRM_V1218_|CRM_ENTRY_1218_)/;
  var STATE_MIRROR = /^(CRM_APP_STATE_V2|CRM_APP_STATE)$/;

  function st(kind) { try { return window[kind] || null; } catch (e) { return null; } }

  function sweep(store, keepRe, mode, rep) {
    if (!store || typeof store.key !== "function") return;
    var doomed = [];
    try {
      for (var i = 0; i < store.length; i++) {
        var k = store.key(i);
        if (!k) continue;
        if (keepRe.test(k)) continue;
        if (STATE_MIRROR.test(k)) continue; /* v12.18.5 قانونِ «تنظیماتِ کاربر نمی‌میرد»: آینهٔ state هرگز درِ جارویِ نسخه پاک نمی‌شود — فیلدها/تنظیماتِ محلیِ ثبت‌نشده نباید باِ آمدنِ نسخهٔ تازه بپرند */
        if (mode === "light" && !STATE_MIRROR.test(k)) { /* light: کلیدهای state هم بمانند */ doomed.push(k); continue; }
        doomed.push(k);
      }
    } catch (e) { return; }
    if (mode === "light") { rep.ls = 0; rep.ss = 0; return; }
    doomed.forEach(function (k) { try { store.removeItem(k); if (rep && "length" in store) rep[store === st("localStorage") ? "ls" : "ss"]++; } catch (e) {} });
  }

  function run(opts) {
    opts = opts || {};
    var rep = { mode: "full", from: String(opts.from || "manual"), sw: 0, caches: 0, ls: 0, ss: 0, idb: 0, server: "untouched", ts: Date.now(), ver: VER };
    var online = true;
    try { online = !(window.navigator && window.navigator.onLine === false); } catch (e) {}
    var solo = false, pending = false;
    try { solo = !!(st("localStorage") && st("localStorage").getItem("CRM_SOLO_OWNER")); } catch (e) {}
    try {
      var p = st("localStorage") && st("localStorage").getItem("CRM_PENDING_SYNC");
      pending = !!(p && String(p).length > 8 && String(p) !== "[]" && String(p) !== "{}");
    } catch (e) {}
    if (!online && (solo || pending)) rep.mode = "light";

    var jobs = [];
    /* ۱) سرویس‌ورکرها */
    try {
      if (window.navigator && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        jobs.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
          (regs || []).forEach(function (r) { try { r.unregister(); rep.sw++; } catch (e) {} });
        }).catch(function () {}));
      }
    } catch (e) {}
    /* ۲) همه‌ی CacheStorage */
    try {
      if (window.caches && caches.keys) {
        jobs.push(caches.keys().then(function (ks) {
          (ks || []).forEach(function (k) { try { caches.delete(k); rep.caches++; } catch (e) {} });
        }).catch(function () {}));
      }
    } catch (e) {}

    if (rep.mode === "full") {
      /* ۳) IndexedDB موقت (گاوصندوقِ حجمی crmBulkData هرگز پاک نمی‌شود) */
      try {
        if (window.indexedDB && indexedDB.deleteDatabase) { indexedDB.deleteDatabase("crmV19"); rep.idb = 1; }
      } catch (e) {}
      /* ۴) جارویِ حافظه‌ها با فهرستِ امانت (stateِ محلی می‌رود تا از سرورِ تازه بیاید) */
      sweep(st("localStorage"), KEEP_LS, "full", rep);
      sweep(st("sessionStorage"), KEEP_SS, "full", rep);
      /* ۵) مُهرِ نسخهٔ ریشه‌پاک‌کن را خالی کن تا لایهٔ ۱۲.۱۸ مهاجرت/چیدمان را دوباره بزند */
      try { if (st("localStorage")) st("localStorage").setItem("CRM_V1218_PURGED", ""); } catch (e) {}
    }

    try { if (st("sessionStorage")) st("sessionStorage").setItem("CRM_ENTRY_1218_RUN", String(rep.ts)); } catch (e) {}
    try { if (st("localStorage")) st("localStorage").setItem("CRM_ENTRY_1218_LAST", JSON.stringify(rep)); } catch (e) {}

    var done = Promise.all(jobs).catch(function () {});
    var cap = new Promise(function (res) { try { setTimeout(res, 1500); } catch (e) { res(); } });
    return Promise.race([done, cap]).then(function () {
      try {
        if (typeof window.v20Toast === "function") {
          window.v20Toast(rep.mode === "full"
            ? "🧹 موتورِ ورود: " + (rep.sw + rep.caches + rep.ls + rep.ss + rep.idb) + " موردِ کهنه پاک شد — داده‌ی سرور دست‌نخورده"
            : "🛡 موتورِ ورود (حالتِ ایمنِ آفلاین): فقط کش و سرویس‌ورکر پاک شد؛ تغییراتِ ثبت‌نشدهٔ شما سالم ماند");
        }
      } catch (e) {}
      return rep;
    });
  }

  window.crmEntryEngine = {
    run: run,
    VERSION: VER,
    keepLS: function () { return KEEP_LS.source; }
  };

  /* دکمهٔ «🧹 اجرای موتور» در تب عیب‌یابی (و هر جایِ دیگرِ صفحه با همین id) */
  try {
    document.addEventListener("click", function (eE) {
      var b = eE && eE.target && eE.target.closest && eE.target.closest("#crmEngineRunBtn,[data-crm-engine-run]");
      if (!b) return;
      try { b.disabled = true; b.textContent = "⏳ در حالِ جارو…"; } catch (eB) {}
      run({ from: "diag" }).then(function (rep) {
        try { if (typeof window.v20Toast === "function") window.v20Toast("✅ موتور اجرا شد (حالت " + (rep && rep.mode || "full") + ") — صفحه تازه می‌شود"); } catch (eT) {}
        setTimeout(function () { try { window.location.reload(); } catch (eR) {} }, 700);
      });
    }, true);
  } catch (eD) {}
})();
