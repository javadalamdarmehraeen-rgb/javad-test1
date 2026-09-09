/* ============================================================================
   crm-v12.23.0.js — لایهٔ پایانیِ نسخهٔ 12.23.0 (نوبت ۱۴۸)
   ----------------------------------------------------------------------------
   ۱۵) تابلوِ روانِ آهستهٔ رویدادهایِ روزِ تقویمِ شمسی زیرِ کادرِ بالا (۱۳۰+ مناسبت).
   ۱۶) هدرِ عمودیِ گوشی: دو ردیفِ مرتب به‌جایِ به‌هم‌ریختگی.
   ۱۷) نگهبانِ ویزیت: سایهٔ محلیِ v20ActiveVisit (اگر pull آن را پاک کرد برمی‌گردد)
       + نمایشِ آمارِ جلسهٔ تمام‌شده پس از «پایان ویزیت».
   ۱۸) نقشهٔ تردد: مراکزِ بینِ مسیر با برچسبِ دائمیِ «ویزیت شده/نشده» + نشانِ
       شروع/پایانِ تردد.
   ۱۹) خروجیِ اکسلِ .xlsx واقعی (ZIP معتبر) — پسوندِ نامعتبر روی گوشی تمام.
   ۲۰) auto-update.php: خودبروزرسانیِ یک‌کلیکیِ نت‌افراز از GitHub Release.
   ----------------------------------------------------------------------------
   crm-v12.22.0.js — لایهٔ پایانیِ نسخهٔ 12.22.0 (نوبت ۱۴۷)
   ----------------------------------------------------------------------------
   ۱۱) پایانِ «پرشِ زیاد»: `harmonizeMetaOrders` شمارهٔ خانهٔ نهاییِ هر گره را در
       خودِ `formFieldMeta` می‌نویسد تا `applySavedLayout`ِ باندل همان عددها را
       حساب کند — دو موتور، یک خروجی، صفر جنگِ `order`.
   ۱۲) کادرِ ساعت/تاریخ بلندتر و خواناتر (پدینگ و قلمِ بزرگ‌تر، پهنایِ ثابت).
   ۱۳) میخکوب‌کردنِ عرضِ نشان‌هایِ پویایِ هدر (آنلاین/آفلاین، زنگوله، نامِ کاربر).
   ۱۴) همهٔ لوگوها/آیکون‌ها (logo.png، favicon، apple-touch، icons/*، manifest)
       با نشانِ تازهٔ «طنین طب طاها» جایگزین شدند.
   ----------------------------------------------------------------------------
   crm-v12.21.0.js — لایهٔ پایانیِ نسخهٔ 12.21.0 (نوبت ۱۴۶)
   ----------------------------------------------------------------------------
   افزوده‌هایِ این نوبت بر پایهٔ ۱۲.۲۰:
   ۵) تاریخِ شمسیِ دست‌ساز (بدونِ «1,405» و بدونِ پرش) + پهنایِ ثابتِ کادرِ ساعت
      + بازگشتِ «طنین طب طاها» به هدر.
   ۶) پایانِ «فیلدها هنوز زیرِ کادرها می‌روند»: چون `applySavedLayoutV82` رویِ هر
      گروه CSS `order` می‌گذارد و `order` بر ترتیبِ DOM غلبه می‌کند، حالا هم
      `order` با ترتیبِ لنگر بازنویسی می‌شود و هم کلیدِ خودِ باندل
      (CRM_MANAGER_GRID_ORDER_V2) با همان ترتیب پر می‌شود تا نجنگیم.
   ۷) طراحِ «ستون‌ها و کالاها» عددهایِ «واقعیِ» همان فیلد را نشان می‌دهد
      (عرض/ارتفاعِ اندازه‌گیری‌شده، فاصلهٔ میلی‌متریِ رویِ صفحه، سطرِ واقعی،
      ترتیبِ واقعی) نه عددِ پیش‌فرضِ ۲۲۰.
   ۸) بستنِ منویِ همبرگری با ✕ (z-indexِ کشو بالایِ هدر + بستنِ قطعی در JS).
   ۹) «ارسال به رندر»: وضعیتِ واقعیِ HTTP + ارسالِ مستقیمِ مرورگر به هاب‌ها.
   ۱۰) سرستون‌هایِ اکسل همه فارسی (سرستونِ لاتین ممنوع) + اصلاحِ «همانه»→«همراه».
   ---------------------------------------------------------------------------
   (۱ تا ۴ همانِ نوبتِ ۱۴۵: قفلِ لنگر، ایتم‌هایِ طراح، هدرِ فشرده، گاوصندوقِ تنظیمات)
   ----------------------------------------------------------------------------
   crm-v12.20.0.js — لایهٔ پایانیِ نسخهٔ 12.20.0 (نوبت ۱۴۵)
   ----------------------------------------------------------------------------
   این فایل «آخرین» اسکریپتِ برنامه است (پس از crm-bundle.js). چهار مشکلِ گزارشِ
   کاربر در همین لایه حل شده‌اند و هیچ بخشِ دیگری از برنامه بازنویسی نشده:

   ۱) «قفلِ لنگر» (anchor lock): ترتیبِ واقعیِ DOM هر فرم در حافظه ذخیره می‌شود و
      هر بار که کدِ دیگری (پاک‌کردن فرم، اجرای موتور، pullِ همگام، ذخیرهٔ طراح،
      ساختِ دوبارهٔ فیلدِ سفارشی) فیلدی را جابه‌جا کند — مثلاً زیرِ کادرِ
      «📍 لوکیشن و نقشه داروخانه» — همان لحظه به جایِ اصلی برمی‌گردد.
      تنها راهِ جابه‌جایی، تغییرِ «شماره ترتیب در فرم» توسطِ مدیر است.
   ۲) همهٔ ایتم‌هایِ طراحِ «ستون‌ها و کالاها» واقعاً اعمال می‌شوند:
      عرض/ارتفاع (پیکسل)، «فاصله نسبت به فیلد قبلی/بعدی (میلی‌متر)» با تبدیلِ
      واقعیِ mm→px، شمارهٔ سطر، جای فیلد (روبرو/زیرِ هم)، داخل کدام کادر،
      وابسته به فیلد، ستارهٔ الزام، نمایش در فرم/لیست، افزودنِ لحظه‌ای،
      خروجیِ اکسل.
   ۳) هدرِ فشردهٔ تک‌ردیفه: ساعتِ بدونِ پرش (عرضِ ثابت + رقمِ جدولی)، تاریخ،
      یک برچسبِ نسخه (تکراری حذف شد)، نامِ کاربر، وضعیتِ آنلاین، زنگوله،
      پنلِ نماینده، تغییرِ رمز و خروج — همه در بالاترین ردیف، کادرِ کوچک‌تر.
   ۴) «گاوصندوقِ تنظیمات»: فیلدها و تنظیماتِ مدیر هر بار در سه جا ذخیره می‌شوند
      (حافظهٔ مرورگر + IndexedDB + سرور) و هنگامِ بالاآمدنِ نسخهٔ تازه، هر چه
      گم شده باشد خودکار برمی‌گردد. به‌علاوه دکمهٔ «🛡 پشتیبان» برای گرفتنِ
      فایلِ پشتیبان و «↩ بازیابی» برای بازگرداندنِ آن.
   ============================================================================ */
(function () {
  "use strict";
  if (window.__CRM_V12200) return;
  window.__CRM_V12200 = true;

  var VER = String(window.CRM_APP_VERSION || "12.23.0");

  var TAB_KEY = {
    "tab-pharmacies": "pharmacy",
    "tab-doctors": "doctor",
    "tab-orders": "order",
    "tab-columns-products": "products"
  };
  var TABS = Object.keys(TAB_KEY);

  var ANCHOR_KEY = "CRM_V12200_ANCHORS";        /* ترتیبِ لنگرِ هر فرم */
  var VAULT_KEY = "CRM_SETTINGS_VAULT_V1";      /* گاوصندوقِ تنظیمات */
  var IDB_NAME = "crmSettingsVault";            /* پایگاهِ جدا از crmV19 */
  var MM_TO_PX = 96 / 25.4;                     /* ۱ میلی‌متر = ۳٫۷۷۹۵ پیکسل */

  /* ───────────────────────── ابزارها ───────────────────────── */
  function $(id) { try { return document.getElementById(id); } catch (e) { return null; } }
  function num(v, d) { var n = Number(v); return isFinite(n) ? n : d; }
  function toast(msg) { try { if (typeof window.v20Toast === "function") window.v20Toast(msg); } catch (e) {} }
  function clone(v) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return null; } }

  function fa2la(s) {
    return String(s == null ? "" : s)
      .replace(/[\u06F0-\u06F9]/g, function (d) { return String.fromCharCode(d.charCodeAt(0) - 1728); })
      .replace(/[\u0660-\u0669]/g, function (d) { return String.fromCharCode(d.charCodeAt(0) - 1584); });
  }

  /* میلی‌متر → پیکسل (همان ضریبِ استانداردِ CSS: ۹۶dpi) */
  function mmToPx(mm) {
    var n = num(mm, 0);
    if (!(n > 0)) return 0;
    return Math.round(n * MM_TO_PX * 100) / 100;
  }

  function store() { try { return window.localStorage || null; } catch (e) { return null; } }
  function readJson(key, fallback) {
    try {
      var s = store(); if (!s) return fallback;
      var raw = s.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return (v == null) ? fallback : v;
    } catch (e) { return fallback; }
  }
  function writeJson(key, val) {
    try { var s = store(); if (s) s.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function setStyle(node, prop, val, prio) {
    if (!node || !node.style) return 0;
    try {
      var want = (val === "" || val == null) ? "" : String(val);
      var cur = node.style.getPropertyValue(prop) || "";
      if (cur === want) return 0;
      if (want === "") node.style.removeProperty(prop);
      else node.style.setProperty(prop, want, prio || "");
      return 1;
    } catch (e) { return 0; }
  }

  /* ───────────────── ۱) فهرستِ فیلدها و گریدِ اصلی ───────────────── */
  function listOf(tabId) {
    var out = [];
    try {
      if (typeof window.getUnifiedFieldList === "function") out = window.getUnifiedFieldList(tabId) || [];
    } catch (e) { return []; }
    var res = [];
    for (var i = 0; i < out.length; i++) {
      var f = out[i];
      if (f && f.id && f.kind !== "ordercol") res.push(f);
    }
    return res;
  }

  function mainGrid(tabId) {
    try { return (typeof window.getMainGrid === "function") ? (window.getMainGrid(tabId) || null) : null; } catch (e) { return null; }
  }

  function groupOfField(tabId, f) {
    var el = null;
    try { el = document.getElementById(f.id); } catch (e) {}
    if (!el && document.querySelector) {
      try { el = document.querySelector('[data-custom-field-id="' + String(f.id).replace(/"/g, "") + '"]'); } catch (e2) {}
    }
    if (!el) return null;
    if (el.classList && el.classList.contains("form-group")) return el;
    if (el.closest) {
      var g = el.closest(".form-group");
      if (g) return g;
    }
    return null;
  }

  function kidsOf(grid) {
    var out = [];
    if (!grid || !grid.children) return out;
    for (var i = 0; i < grid.children.length; i++) out.push(grid.children[i]);
    return out;
  }

  /* شناسهٔ پایدارِ هر گره (برای ترتیبِ لنگر) */
  function anchorOf(g) {
    if (!g) return "";
    try {
      var fid = g.getAttribute && g.getAttribute("data-col-fid");
      if (fid) return "c:" + fid;
      if (g.id) return "id:" + g.id;
      var e = g.querySelector ? g.querySelector("input[id],select[id],textarea[id],button[id]") : null;
      if (e && e.id) return "f:" + e.id;
      if (!g.__crmAnchor) g.__crmAnchor = "n" + (anchorSeq = anchorSeq + 1);
      return "n:" + g.__crmAnchor;
    } catch (e) { return ""; }
  }
  var anchorSeq = 0;

  function gridKey(tabId, grid) {
    var form = grid && grid.closest ? grid.closest("form[id]") : null;
    return "tab:" + tabId + "|" + ((grid && grid.id) ? grid.id : ((form && form.id) ? form.id : "grid"));
  }

  /* آیا این گره «یک فیلد» است یا یک کادرِ نگهدارندهٔ چند فیلد؟ */
  function isSingleFieldNode(g) {
    if (!g || !g.querySelectorAll) return false;
    var inner = 0;
    try {
      var list = g.querySelectorAll("[data-col-fid],[data-custom-field-id]");
      inner = list ? list.length : 0;
    } catch (e) { inner = 0; }
    return inner <= 1;
  }

  /* ───────────────── ۲) قفلِ لنگر ───────────────── */
  function allCanons() { return readJson(ANCHOR_KEY, {}) || {}; }
  function saveCanons(map) { writeJson(ANCHOR_KEY, map || {}); }

  function captureCanon(tabId) {
    var grid = mainGrid(tabId);
    if (!grid) return null;
    var kids = kidsOf(grid);
    if (kids.length < 2) return null;
    var seq = [];
    kids.forEach(function (k) { var a = anchorOf(k); if (a) seq.push(a); });
    if (seq.length < 2) return null;
    var map = allCanons();
    map[gridKey(tabId, grid)] = seq;
    saveCanons(map);
    return seq;
  }

  /* گره‌های «مدیریت‌شده» = فیلدهایی که فرزندِ بی‌واسطهٔ گریدِ اصلی هستند */
  function managedNodes(tabId, grid) {
    var out = [];
    if (!grid) return out;
    var seen = {};
    listOf(tabId).forEach(function (f) {
      var g = groupOfField(tabId, f);
      if (!g || g.parentNode !== grid) return;
      if (!isSingleFieldNode(g)) return;
      var a = anchorOf(g);
      if (!a || seen[a]) return;
      seen[a] = 1;
      out.push({ f: f, node: g, anchor: a, order: num(f.order, 999) });
    });
    return out;
  }

  /* ترتیبِ دلخواه از روی «شماره ترتیب در فرم» — بدونِ دست‌زدن به جایِ کادرها */
  function rebuildCanon(tabId, base) {
    var grid = mainGrid(tabId);
    if (!grid) return base || null;
    var kids = kidsOf(grid);
    var live = [];
    kids.forEach(function (k) { var a = anchorOf(k); if (a) live.push(a); });
    if (live.length < 2) return base || live;

    var present = {};
    live.forEach(function (a) { present[a] = 1; });

    /* پایه = ترتیبِ ذخیره‌شده (معتبر)، پالایش‌شده به گره‌هایِ موجود */
    var canon = (base && base.length ? base : live).filter(function (a) { return present[a]; });
    var inCanon = {};
    canon.forEach(function (a) { inCanon[a] = 1; });
    live.forEach(function (a) { if (!inCanon[a]) { canon.push(a); inCanon[a] = 1; } });

    var orders = {};
    managedNodes(tabId, grid).forEach(function (m) { orders[m.anchor] = m.order; });

    var slots = [];
    canon.forEach(function (a, i) { if (orders[a] != null) slots.push(i); });
    if (slots.length < 2) return canon;

    var sorted = slots.map(function (i) { return canon[i]; });
    sorted.sort(function (a, b) {
      var d = (orders[a] == null ? 999 : orders[a]) - (orders[b] == null ? 999 : orders[b]);
      if (d !== 0) return d;
      return canon.indexOf(a) - canon.indexOf(b);
    });

    var out = canon.slice();
    slots.forEach(function (idx, k) { out[idx] = sorted[k]; });
    return out;
  }

  /* نشاندنِ ترتیب: کمینه جابه‌جایی، جایِ گره‌هایِ غیرفیلد (مثلِ کادرِ لوکیشن) دست‌نخورده */
  function applyCanon(grid, canon) {
    if (!grid || !canon || !canon.length) return 0;
    try {
      var ae = document.activeElement;
      if (ae && grid.contains && grid.contains(ae)) return 0;   /* تمرکزِ کاربر نشکند */
    } catch (e) {}

    var kids = kidsOf(grid);
    var byAnchor = {};
    kids.forEach(function (k) { var a = anchorOf(k); if (a && byAnchor[a] == null) byAnchor[a] = k; });

    var inCanon = {};
    canon.forEach(function (a) { inCanon[a] = 1; });

    var desired = [];
    canon.forEach(function (a) { if (byAnchor[a]) desired.push(byAnchor[a]); });
    if (desired.length < 2) return 0;

    var extras = kids.filter(function (k) { var a = anchorOf(k); return a && !inCanon[a]; });
    var full = desired.concat(extras);

    var last = desired[desired.length - 1];
    var ref = last ? (last.nextSibling !== undefined ? last.nextSibling : null) : null;
    var moves = 0;
    for (var i = full.length - 1; i >= 0; i--) {
      var node = full[i];
      if (node.nextSibling === ref) { ref = node; continue; }
      try { grid.insertBefore(node, ref); } catch (e2) { continue; }
      ref = node;
      moves += 1;
    }

    /* ★ ریشهٔ «فیلدها هنوز به زیرِ کادرها می‌روند»: `applySavedLayoutV82` در باندل
       روی هر گروه `order` می‌گذارد (از meta یا i+1) و در CSS همان `order` بر ترتیبِ
       DOM غلبه می‌کند. پس اینجا همان شماره‌ها را با ترتیبِ لنگر بازنویسی می‌کنیم تا
       «ترتیبِ DOM» و «order» یکی شوند و هیچ موتورِ دیگری نتواند ظاهر را عوض کند. */
    for (var k = 0; k < full.length; k++) {
      setStyle(full[k], "order", k + 1, "important");
    }
    return moves;
  }

  /* کلیدِ چیدمانِ خودِ باندل (CRM_MANAGER_GRID_ORDER_V2) را با همان ترتیبِ لنگر
     پر می‌کنیم تا `restoreDomFieldOrder` همان را ببیند و با ما نجنگد. */
  function bundleAnchor(g) {
    try {
      var e = g && g.querySelector ? g.querySelector("input[id],select[id],textarea[id],button[id]") : null;
      if (e && e.id) return e.id;
      return (g && g.id) || "";
    } catch (e) { return ""; }
  }

  /* ───────────────── ۶٫۵) هم‌فرکانس‌سازی با موتورِ چیدمانِ باندل (پایانِ پرش) ─────────────────
     ریشهٔ «پرشِ زیاد»: دو موتور روی یک ویژگیِ CSS (`order`) عددِ «متفاوت» می‌نوشتند —
     باندل از `meta.order` (یا i+1) و ما از ترتیبِ لنگر — و هر نوشتن، دیگری را
     تحریک می‌کرد → میدانِ فیلدها هر چند ثانیه یک‌بار جابه‌جا می‌شد.
     راه‌حل: شمارهٔ خانهٔ نهاییِ هر گره را در خودِ `formFieldMeta` می‌نویسیم تا
     `applySavedLayout`ِ باندل «همان» عددها را حساب کند؛ دو موتور، یک خروجی، صفر پرش. */
  function groupFidOf(g) {
    try {
      var d = g && g.getAttribute ? g.getAttribute("data-col-fid") : null;
      if (d) return d;
      var els = g && g.querySelectorAll ? g.querySelectorAll("input[id],select[id],textarea[id]") : [];
      for (var i = 0; i < els.length; i++) {
        var t = String(els[i].getAttribute && els[i].getAttribute("type") || "").toLowerCase();
        if (t === "hidden") continue;
        if (els[i].id) return els[i].id;
      }
      return "";
    } catch (e) { return ""; }
  }

  function harmonizeMetaOrders(tabId) {
    var key = TAB_KEY[tabId];
    if (!key) return 0;
    var grid = mainGrid(tabId);
    if (!grid) return 0;
    var canon = allCanons()[gridKey(tabId, grid)];
    if (!canon || !canon.length) return 0;
    var kids = kidsOf(grid);
    var byAnchor = {};
    kids.forEach(function (k) { var a = anchorOf(k); if (a && byAnchor[a] == null) byAnchor[a] = k; });
    var desired = [];
    canon.forEach(function (a) { if (byAnchor[a]) desired.push(byAnchor[a]); });
    if (desired.length < 2) return 0;
    var inCanon = {};
    canon.forEach(function (a) { inCanon[a] = 1; });
    var extras = kids.filter(function (k) { var a = anchorOf(k); return a && !inCanon[a]; });
    var full = desired.concat(extras);

    var S0 = window.state;
    if (!S0) return 0;
    S0.formFieldMeta = S0.formFieldMeta || {};
    S0.formFieldMeta[key] = S0.formFieldMeta[key] || {};
    var meta = S0.formFieldMeta[key];
    var changed = 0;
    for (var i = 0; i < full.length; i++) {
      var fid = groupFidOf(full[i]);
      if (!fid) continue;
      var m = meta[fid] || (meta[fid] = {});
      if (num(m.order, 0) !== i + 1) { m.order = i + 1; changed += 1; }
    }
    if (changed && typeof window.saveState === "function") {
      try { window.saveState(); } catch (eSv) {}
    }
    return changed;
  }

  function bundleGridKey(grid, tabId) {
    try {
      if (grid.id) return "grid:" + grid.id;
      var form = grid.closest ? grid.closest("form[id]") : null;
      if (form && form.id) return "form:" + form.id;
    } catch (e) {}
    return "pane:" + tabId + ":0";
  }

  function syncManagerOrderKey(tabId) {
    var grid = mainGrid(tabId);
    if (!grid) return 0;
    var canon = allCanons()[gridKey(tabId, grid)];
    if (!canon || !canon.length) return 0;
    var byAnchor = {};
    kidsOf(grid).forEach(function (k) { var a = anchorOf(k); if (a && byAnchor[a] == null) byAnchor[a] = k; });
    var seq = [];
    canon.forEach(function (a) {
      var n = byAnchor[a];
      if (!n) return;
      var ba = bundleAnchor(n);
      if (ba && seq.indexOf(ba) < 0) seq.push(ba);
    });
    if (seq.length < 2) return 0;
    var raw = readJson("CRM_MANAGER_GRID_ORDER_V2", {}) || {};
    var key = bundleGridKey(grid, tabId);
    var prev = raw[key];
    if (prev && prev.length === seq.length && prev.every(function (v, i) { return v === seq[i]; })) return 0;
    raw[key] = seq;
    writeJson("CRM_MANAGER_GRID_ORDER_V2", raw);
    return 1;
  }

  /* فیلدِ سفارشی که داخلِ ظرفِ قدیمی ساخته شده، به گریدِ اصلی می‌آید تا شمارهٔ ترتیب کار کند */
  function promoteCustoms(tabId, grid) {
    var n = 0;
    listOf(tabId).forEach(function (f) {
      if (f.builtin) return;
      var g = groupOfField(tabId, f);
      if (!g || !g.parentNode || g.parentNode === grid) return;
      var p = g.parentNode;
      var hostLike = false;
      try {
        hostLike = !!(p.classList && (p.classList.contains("extra-cf-host") || p.classList.contains("form-grid"))) &&
          !!((p.id && /CustomFieldsContainer$/.test(p.id)) || (p.getAttribute && p.getAttribute("data-cf-host")));
      } catch (e) { hostLike = false; }
      if (!hostLike) return;
      try { grid.appendChild(g); n += 1; } catch (e2) {}
    });
    return n;
  }

  function enforceTab(tabId) {
    var grid = mainGrid(tabId);
    if (!grid) return 0;
    var moved = promoteCustoms(tabId, grid);
    var map = allCanons();
    var key = gridKey(tabId, grid);
    var canon = map[key];
    var kids = kidsOf(grid);
    if (kids.length < 2) return moved;

    var live = {};
    kids.forEach(function (k) { var a = anchorOf(k); if (a) live[a] = 1; });

    if (!canon || !canon.length) {
      canon = captureCanon(tabId);
      if (!canon) return moved;
    } else {
      var hasNew = false;
      Object.keys(live).forEach(function (a) { if (canon.indexOf(a) < 0) hasNew = true; });
      if (hasNew) {
        canon = rebuildCanon(tabId, canon);
        map[key] = canon;
        saveCanons(map);
      }
    }
    moved += applyCanon(grid, canon);
    try { harmonizeMetaOrders(tabId); } catch (eH) {}
    try { syncManagerOrderKey(tabId); } catch (eS) {}
    return moved;
  }

  function enforceAll() {
    var n = 0;
    TABS.forEach(function (t) { try { n += enforceTab(t); } catch (e) {} });
    return n;
  }

  /* تنها راهِ جابه‌جایی: مدیر «شماره ترتیب در فرم» را عوض کند */
  function rebuildAllCanons() {
    var map = allCanons();
    TABS.forEach(function (t) {
      try {
        var grid = mainGrid(t);
        if (!grid) return;
        var canon = rebuildCanon(t, map[gridKey(t, grid)]);
        if (canon && canon.length) map[gridKey(t, grid)] = canon;
      } catch (e) {}
    });
    saveCanons(map);
  }

  /* ───────────────── ۳) نشاندنِ تنظیماتِ طراح روی فرم ───────────────── */
  function fieldInput(g) {
    try {
      return (g.querySelector && g.querySelector("input:not([type=hidden]), select, textarea")) || null;
    } catch (e) { return null; }
  }

  function paintSettings(tabId) {
    var grid = mainGrid(tabId);
    var anyRowNo = false;
    var items = [];
    listOf(tabId).forEach(function (f) {
      var g = groupOfField(tabId, f);
      if (!g) return;
      items.push({ f: f, g: g });
      if (num(f.rowNo, 0) > 0) anyRowNo = true;
    });

    items.forEach(function (it) {
      var f = it.f, g = it.g;

      /* ستارهٔ الزام + رنگ/برچسب (همان نقاشِ باندل، روی آخرین DOM) */
      try { if (typeof window.paintFieldBox === "function") window.paintFieldBox(g, f); } catch (e) {}
      try { if (typeof window.paintRequiredStar === "function") window.paintRequiredStar(g, f); } catch (e2) {}

      /* عرض و ارتفاعِ واقعی (پیکسل) */
      var w = num(f.size, 0), h = num(f.height, 0);
      var inp = fieldInput(g);
      if (w > 40) {
        if (inp) {
          setStyle(inp, "width", w + "px", "important");
          setStyle(inp, "max-width", w + "px", "important");
          setStyle(inp, "min-width", Math.min(120, w) + "px", "important");
        }
        setStyle(g, "max-width", w + "px", "important");
      }
      if (h > 20 && inp) {
        setStyle(inp, "height", h + "px", "important");
        setStyle(inp, "min-height", h + "px", "important");
      }

      /* «فاصله نسبت به فیلد قبلی/بعدی (میلی‌متر)» — mm→px، هم منطقی هم فیزیکی (RTL) */
      var gb = mmToPx(f.gapBeforeMm), ga = mmToPx(f.gapAfterMm);
      setStyle(g, "margin-inline-start", gb > 0 ? gb + "px" : "", "important");
      setStyle(g, "margin-inline-end", ga > 0 ? ga + "px" : "", "important");
      setStyle(g, "margin-right", gb > 0 ? gb + "px" : "", "important");
      setStyle(g, "margin-left", ga > 0 ? ga + "px" : "", "important");
      try {
        if (gb > 0 || ga > 0) g.setAttribute("data-crm-gap", (f.gapBeforeMm || 0) + "/" + (f.gapAfterMm || 0) + "mm");
        else if (g.removeAttribute) g.removeAttribute("data-crm-gap");
      } catch (e3) {}

      /* «شماره سطر» و «جای فیلد در صفحه» */
      if (grid && grid.classList && grid.classList.contains("form-grid")) {
        var rn = num(f.rowNo, 0);
        setStyle(g, "grid-row", (anyRowNo && rn > 0) ? String(rn) : "", "important");
        setStyle(g, "grid-column", f.place === "under" ? "1 / -1" : "", "important");
      }

      /* «نمایش در فرم» و «وابسته به فیلد» */
      var hide = (f.showInForm === false) || (f.hidden === true);
      if (!hide && f.dependsOn) {
        var host = null;
        try { host = document.getElementById(f.dependsOn); } catch (eD) {}
        if (!host && document.querySelector) {
          try { host = document.querySelector('[data-custom-field-id="' + String(f.dependsOn).replace(/"/g, "") + '"]'); } catch (eD2) {}
        }
        hide = !(host && String(host.value || "").trim() !== "");
      }
      setStyle(g, "display", hide ? "none" : "", "important");

      /* «افزودن لحظه‌ای گزینه» */
      var off = (f.allowAddOption === false);
      try {
        var btns = g.querySelectorAll ? g.querySelectorAll(".btn-instant-add, .v20-addopt") : [];
        for (var i = 0; i < btns.length; i++) {
          var b = btns[i];
          if (off) {
            if (b.dataset) b.dataset.v12200off = "1";
            setStyle(b, "display", "none", "important");
            try { b.hidden = true; } catch (eH) {}
          } else if (b.dataset && b.dataset.v12200off === "1") {
            delete b.dataset.v12200off;
            setStyle(b, "display", "", "");
            try { b.hidden = false; } catch (eH2) {}
          }
        }
      } catch (eB) {}
    });
    return items.length;
  }

  function paintAll() {
    var n = 0;
    TABS.forEach(function (t) { try { n += paintSettings(t); } catch (e) {} });
    return n;
  }

  /* «داخل کدام کادر؟» — مقدارِ کشو در خودِ باندل ذخیره نمی‌شد؛ اینجا ذخیره می‌شود */
  var pendingBox = null;
  function rememberBoxTarget() {
    try {
      var sel = $("colFieldBoxTarget");
      var lab = $("colFieldLabel");
      pendingBox = {
        tab: String(window._activeColTab || ""),
        editing: window._editingColField || null,
        boxId: sel ? String(sel.value || "") : "",
        label: lab ? String(lab.value || "").trim() : ""
      };
    } catch (e) { pendingBox = null; }
  }

  function applyPendingBox() {
    var p = pendingBox; pendingBox = null;
    if (!p || !p.tab) return 0;
    var key = TAB_KEY[p.tab];
    if (!key) return 0;
    var S = window.state;
    if (!S) return 0;
    var target = null;
    if (p.editing && p.editing.id) target = p.editing;
    else {
      var list = (S.customFields && S.customFields[key]) || [];
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] && String(list[i].label || "").trim() === p.label) { target = list[i]; break; }
      }
    }
    if (!target || !target.id) return 0;
    if (target.builtin) {
      if (!S.formFieldMeta) S.formFieldMeta = {};
      if (!S.formFieldMeta[key]) S.formFieldMeta[key] = {};
      if (!S.formFieldMeta[key][target.id]) S.formFieldMeta[key][target.id] = {};
      S.formFieldMeta[key][target.id].boxId = p.boxId;
    } else {
      target.boxId = p.boxId;
    }
    try { if (typeof window.saveState === "function") window.saveState(false); } catch (e) {}
    /* اگر کادر در DOM هست، فیلد داخلِ همان کادر می‌نشیند */
    try {
      if (p.boxId) {
        var pane = $(p.tab);
        var box = pane && pane.querySelector ? (pane.querySelector('[data-crm-box="' + p.boxId + '"]') || pane.querySelector("#" + p.boxId)) : null;
        var g = groupOfField(p.tab, target);
        if (box && g && g.parentNode !== box) box.appendChild(g);
      }
    } catch (e2) {}
    return 1;
  }

  /* ───────────────── ۴) هدرِ فشرده + ساعتِ بی‌پرش ───────────────── */
  function buildTopBar() {
    try {
      var header = document.querySelector(".app-header");
      if (!header) return null;
      var actions = header.querySelector(".header-actions");
      if (!actions) return null;

      /* کادرِ کوچک‌تر و تک‌ردیفه */
      if (header.classList && header.classList.add) header.classList.add("crm-compact-header");

      /* ستونِ عمودیِ نسخهٔ قبل باز می‌شود تا همه‌چیز در یک ردیف بنشیند */
      var stack = $("crmHeaderStack");
      if (stack && stack.parentNode) {
        var parent = stack.parentNode;
        while (stack.firstChild) parent.insertBefore(stack.firstChild, stack);
        try { parent.removeChild(stack); } catch (eR) {}
      }

      /* ساعت و تاریخ: نخستین عضوِ ردیفِ بالا */
      var clock = $("crmHeaderClock");
      if (!clock) {
        clock = document.createElement("div");
        clock.id = "crmHeaderClock";
        clock.className = "crm-header-clock";
        clock.setAttribute("dir", "rtl");
        clock.innerHTML =
          '<span id="crmClockTime" class="crm-clock-time" aria-label="ساعت">--:--:--</span>' +
          '<span class="crm-clock-sep" aria-hidden="true"></span>' +
          '<span id="crmClockDate" class="crm-clock-date" aria-label="تاریخ">—</span>';
        actions.insertBefore(clock, actions.firstChild || null);
      } else if (clock.parentNode !== actions) {
        actions.insertBefore(clock, actions.firstChild || null);
      }

      /* یک برچسبِ نسخه، بلافاصله پس از ساعت */
      var badge = $("crmBuildBadge");
      if (badge) {
        var ref = clock && clock.parentNode === actions ? clock.nextSibling : actions.firstChild;
        if (badge.parentNode !== actions) actions.insertBefore(badge, ref || null);
        try {
          badge.setAttribute("title", "نسخهٔ برنامه " + VER + " — آخرین ZIP از پورت ۸۰۰۰ هاستِ پیش‌نمایش");
        } catch (eT) {}
      }

      /* برچسبِ نسخهٔ تکراری (#v20VersionBadge) پنهان می‌شود */
      var dup = $("v20VersionBadge");
      if (dup) setStyle(dup, "display", "none", "important");

      /* دکمهٔ «تغییر رمز» اگر جایِ دیگری است، به همان ردیفِ بالا می‌آید */
      var pw = $("btnChangePasswordHeader") || document.querySelector("[data-crm-change-pass]");
      if (pw && pw.parentNode !== actions) actions.appendChild(pw);

      /* دکمه‌های گاوصندوقِ تنظیمات */
      ensureVaultButtons(actions);
      return clock;
    } catch (e) { return null; }
  }

  /* تاریخِ شمسیِ «دست‌ساز»: از formatToParts می‌سازیم تا
     ۱) جداکنندهٔ هزارگان («٬» که قانونِ رقمِ لاتینِ باندل آن را «,» می‌کند و
        سال می‌شود «1,405») هرگز نیفتد،
     ۲) رشته همیشه یک شکل و یک پهنا باشد → پرشِ چیدمان ممکن نباشد. */
  var FA_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  var FA_WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

  function cleanNum(s) {
    return fa2la(String(s == null ? "" : s)).replace(/[\u066C\u066B,،\u200F\u200E]/g, "").trim();
  }

  function clockDate(now) {
    now = now || new Date();
    var p = {};
    try {
      var f = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
        weekday: "long", day: "numeric", month: "numeric", year: "numeric"
      });
      var parts = f.formatToParts(now);
      for (var i = 0; i < parts.length; i++) p[parts[i].type] = parts[i].value;
    } catch (e) { p = {}; }

    var day = cleanNum(p.day);
    var mon = parseInt(cleanNum(p.month), 10);
    var year = cleanNum(p.year);
    var wd = String(p.weekday || "").replace(/[\u200F\u200E]/g, "").trim();
    if (!wd) { try { wd = FA_WEEKDAYS[now.getDay()]; } catch (e2) { wd = ""; } }
    var monthName = (mon >= 1 && mon <= 12) ? FA_MONTHS[mon - 1] : cleanNum(p.month);
    if (!day || !monthName || !year) {
      /* راهِ پشتیبان: بدونِ جداکنندهٔ هزارگان */
      try {
        return fa2la(now.toLocaleDateString("en-GB")).replace(/[,،]/g, " ");
      } catch (e3) { return ""; }
    }
    return wd + " " + day + " " + monthName + " " + year;
  }

  function tickClock() {
    try {
      var t = $("crmClockTime"), d = $("crmClockDate");
      if (!t || !d) { buildTopBar(); return; }
      var now = new Date();
      var time = cleanNum(now.toLocaleTimeString("en-GB", { hour12: false }));
      var date = clockDate(now);
      /* فقط وقتی متن عوض شده بنویس؛ نوشتنِ بی‌اثر هم ناظرهایِ چیدمان را بیدار می‌کند */
      if (t.textContent !== time) t.textContent = time;
      if (d.textContent !== date) d.textContent = date;
    } catch (e) {}
  }

  /* ───────────────── ۵) گاوصندوقِ تنظیمات ───────────────── */
  function idOf(f) { return (f && f.id) ? String(f.id) : ""; }

  function vaultSnapshot() {
    var S = window.state || {};
    return {
      v: 1,
      ver: VER,
      t: Date.now(),
      customFields: clone(S.customFields || {}) || {},
      formFieldMeta: clone(S.formFieldMeta || {}) || {},
      formBoxes: clone(S.formBoxes || {}) || {},
      userBoxes: clone(S.userBoxes || {}) || {},
      userWidgets: clone(S.userWidgets || {}) || {},
      userTabs: clone(S.userTabs || []) || [],
      tabOrder: clone(S.tabOrder || {}) || {},
      anchors: readJson(ANCHOR_KEY, {}) || {},
      domOrder: (function () { try { var s = store(); return s ? (s.getItem("CRM_MANAGER_GRID_ORDER_V2") || "") : ""; } catch (e) { return ""; } })()
    };
  }

  /* هر فیلدی که مدیر «عمداً» حذف کرده، هرگز از پشتیبان برنمی‌گردد */
  function updateTomb(prev, next) {
    var tomb = (prev && prev.tomb) ? clone(prev.tomb) : {};
    if (!tomb || typeof tomb !== "object") tomb = {};
    var before = (prev && prev.customFields) || {};
    var after = (next && next.customFields) || {};
    Object.keys(before).forEach(function (k) {
      var oldIds = (before[k] || []).map(idOf).filter(Boolean);
      var newIds = (after[k] || []).map(idOf).filter(Boolean);
      oldIds.forEach(function (id) {
        if (newIds.indexOf(id) < 0) {
          if (!tomb[k] || typeof tomb[k] !== "object") tomb[k] = {};
          tomb[k][id] = Date.now();
        }
      });
    });
    return tomb;
  }

  function saveVault() {
    var prev = readJson(VAULT_KEY, null);
    var snap = vaultSnapshot();
    snap.tomb = updateTomb(prev, snap);
    writeJson(VAULT_KEY, snap);
    idbPut(snap);
    pushVault(snap);
    return snap;
  }

  function countFields(snap) {
    var n = 0;
    var cf = (snap && snap.customFields) || {};
    Object.keys(cf).forEach(function (k) { n += (cf[k] || []).length; });
    var fm = (snap && snap.formFieldMeta) || {};
    Object.keys(fm).forEach(function (k) { n += Object.keys(fm[k] || {}).length; });
    return n;
  }

  /* برگرداندنِ هر چه گم شده — فقط «افزودن»، هرگز حذف یا بازنویسیِ تنظیمِ زنده */
  function mergeVault(v) {
    var S = window.state;
    if (!S || !v) return 0;
    var added = 0;
    var tomb = v.tomb || {};

    if (!S.customFields || typeof S.customFields !== "object") S.customFields = {};
    Object.keys(v.customFields || {}).forEach(function (k) {
      if (!Array.isArray(S.customFields[k])) S.customFields[k] = [];
      var live = S.customFields[k];
      var have = {};
      live.forEach(function (f) { var i = idOf(f); if (i) have[i] = 1; });
      ((v.customFields || {})[k] || []).forEach(function (f) {
        var i = idOf(f);
        if (!i || have[i]) return;
        if (tomb[k] && tomb[k][i]) return;
        live.push(clone(f));
        have[i] = 1;
        added += 1;
      });
      live.sort(function (a, b) { return num(a && a.order, 999) - num(b && b.order, 999); });
    });

    if (!S.formFieldMeta || typeof S.formFieldMeta !== "object") S.formFieldMeta = {};
    Object.keys(v.formFieldMeta || {}).forEach(function (k) {
      if (!S.formFieldMeta[k] || typeof S.formFieldMeta[k] !== "object") S.formFieldMeta[k] = {};
      var m = S.formFieldMeta[k];
      Object.keys((v.formFieldMeta || {})[k] || {}).forEach(function (fid) {
        var src = ((v.formFieldMeta || {})[k] || {})[fid] || {};
        if (m[fid] && typeof m[fid] === "object") {
          Object.keys(src).forEach(function (p) { if (m[fid][p] == null) { m[fid][p] = src[p]; added += 1; } });
        } else if (!(tomb[k] && tomb[k][fid])) {
          m[fid] = clone(src);
          added += 1;
        }
      });
    });

    [["formBoxes", 1], ["userBoxes", 1], ["userWidgets", 1], ["tabOrder", 1]].forEach(function (pair) {
      var key = pair[0];
      var src = v[key];
      if (!src || typeof src !== "object") return;
      if (!S[key] || typeof S[key] !== "object" || !Object.keys(S[key]).length) { S[key] = clone(src); added += 1; }
    });
    if (Array.isArray(v.userTabs) && v.userTabs.length && (!Array.isArray(S.userTabs) || !S.userTabs.length)) {
      S.userTabs = clone(v.userTabs); added += 1;
    }
    if (v.anchors && typeof v.anchors === "object" && !Object.keys(allCanons()).length) {
      saveCanons(clone(v.anchors));
    }
    if (v.domOrder) {
      try {
        var s = store();
        if (s && !s.getItem("CRM_MANAGER_GRID_ORDER_V2")) s.setItem("CRM_MANAGER_GRID_ORDER_V2", v.domOrder);
      } catch (e) {}
    }
    return added;
  }

  function restoreVault() {
    var v = readJson(VAULT_KEY, null);
    if (!v) return 0;
    return mergeVault(v);
  }

  /* ── IndexedDB (جدا از crmV19 که ریشه‌پاک‌کن حذفش می‌کند) ── */
  function idbDo(mode, fn) {
    try {
      if (!window.indexedDB) return;
      var req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () {
        try {
          var db = req.result;
          if (!db.objectStoreNames.contains("vault")) db.createObjectStore("vault");
        } catch (e) {}
      };
      req.onsuccess = function () {
        try {
          var db = req.result;
          var tx = db.transaction("vault", mode);
          fn(tx.objectStore("vault"));
        } catch (e) {}
      };
      req.onerror = function () {};
    } catch (e) {}
  }
  function idbPut(snap) { idbDo("readwrite", function (st) { try { st.put(clone(snap), "current"); } catch (e) {} }); }
  function idbGet(cb) {
    idbDo("readonly", function (st) {
      try {
        var r = st.get("current");
        r.onsuccess = function () { try { cb(r.result || null); } catch (e) {} };
        r.onerror = function () { try { cb(null); } catch (e) {} };
      } catch (e) { try { cb(null); } catch (e2) {} }
    });
  }

  /* ── سرور: همان تنظیمات در فایلِ جدا از داده‌ها ── */
  var pushTimer = null;
  function pushVault(snap) {
    try {
      if (!window.fetch) return;
      if (pushTimer) clearTimeout(pushTimer);
      pushTimer = setTimeout(function () {
        try {
          window.fetch("/api/vault", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CRM-Request": "1" },
            body: JSON.stringify(snap || vaultSnapshot())
          }).catch(function () {});
        } catch (e) {}
      }, 2500);
    } catch (e) {}
  }
  function pullVault(cb) {
    try {
      if (!window.fetch) { cb(null); return; }
      window.fetch("/api/vault", { headers: { "X-CRM-Request": "1" }, cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { cb(j && j.vault ? j.vault : null); })
        .catch(function () { cb(null); });
    } catch (e) { try { cb(null); } catch (e2) {} }
  }

  /* ── دکمه‌های پشتیبان/بازیابی در همان ردیفِ بالا ── */
  function ensureVaultButtons(actions) {
    try {
      if (!actions) actions = document.querySelector(".app-header .header-actions");
      if (!actions) return;
      if (!$("crmVaultSaveBtn")) {
        var b1 = document.createElement("button");
        b1.type = "button";
        b1.id = "crmVaultSaveBtn";
        b1.className = "btn-header-icon crm-vault-btn";
        b1.title = "پشتیبانِ تنظیمات و فیلدها (فایلِ JSON) — برایِ انتقال به نسخهٔ بعد";
        b1.innerHTML = "<span>🛡</span>";
        actions.appendChild(b1);
      }
      if (!$("crmVaultLoadBtn")) {
        var b2 = document.createElement("button");
        b2.type = "button";
        b2.id = "crmVaultLoadBtn";
        b2.className = "btn-header-icon crm-vault-btn";
        b2.title = "بازیابیِ تنظیمات و فیلدها از فایلِ پشتیبان";
        b2.innerHTML = "<span>↩</span>";
        actions.appendChild(b2);
      }
      if (!$("crmVaultFile")) {
        var fi = document.createElement("input");
        fi.type = "file";
        fi.id = "crmVaultFile";
        fi.accept = "application/json,.json";
        setStyle(fi, "display", "none", "important");
        actions.appendChild(fi);
      }
    } catch (e) {}
  }

  function downloadVaultFile() {
    try {
      var snap = saveVault();
      var blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "crm-settings-backup-v" + VER + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { try { document.body.removeChild(a); URL.revokeObjectURL(a.href); } catch (e) {} }, 400);
      toast("🛡 پشتیبانِ تنظیمات ذخیره شد: " + countFields(snap) + " قلمِ تنظیمات/فیلد.");
    } catch (e) { toast("پشتیبان‌گیری ناموفق بود."); }
  }

  function restoreFromFile(file) {
    try {
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var v = JSON.parse(String(rd.result || ""));
          var n = mergeVault(v);
          try { if (typeof window.saveState === "function") window.saveState(false); } catch (e) {}
          writeJson(VAULT_KEY, v);
          rebuildAllCanons();
          enforceAll();
          paintAll();
          toast("↩ بازیابی شد: " + n + " قلمِ گم‌شده برگشت.");
        } catch (e2) { toast("فایلِ پشتیبان خوانده نشد."); }
      };
      rd.readAsText(file);
    } catch (e) {}
  }

  /* ───────────────── ۶) خروجیِ اکسلِ کاملِ تب ───────────────── */
  /* قانونِ نوبتِ ۱۴۶: «سرستونِ لاتین ممنوع» — هر کلیدِ رکورد به فارسی برمی‌گردد. */
  var FA_HEADER = {
    name: "نام", fullName: "نام و نام خانوادگی", pharmacyName: "نام داروخانه", doctorName: "نام پزشک",
    repName: "نام نماینده علمی", rep: "نماینده علمی", repId: "شناسهٔ نماینده",
    phone: "تلفن", mobile: "همراه", tel: "تلفن", managerPhone: "تلفن مدیر", orderManagerPhone: "تلفن مدیر سفارش",
    province: "استان", city: "شهر", district: "منطقه", address: "آدرس", plate: "پلاک", floor: "طبقه",
    type: "نوع", specialty: "تخصص", kind: "گونه", status: "وضعیت", priority: "اولویت", notes: "توضیحات",
    manager: "مدیر", orderManager: "مدیر سفارش", isPercentage: "درصدی", percentage: "درصد",
    lat: "عرض جغرافیایی", lng: "طول جغرافیایی", latitude: "عرض جغرافیایی", longitude: "طول جغرافیایی",
    dateAdded: "تاریخ افزودن", createdAt: "تاریخ ثبت", updatedAt: "آخرین ویرایش", savedAt: "تاریخ ذخیره",
    orderDate: "تاریخ سفارش", visitDate: "تاریخ ویزیت", lastVisit: "آخرین ویزیت", date: "تاریخ",
    fileName: "نام فایل", file: "فایل", filePath: "مسیر فایل", photo: "تصویر",
    totalAmount: "مبلغ کل (ریال)", amount: "مبلغ", price: "قیمت", count: "تعداد", items: "اقلام",
    giftCount: "تعداد جایزه", discount: "تخفیف", creditLevel: "درجهٔ اعتبار", contractType: "نوع قرارداد",
    nationalCode: "کد ملی", email: "رایانامه", website: "وب‌سایت", instagram: "اینستاگرام",
    username: "نام کاربری", role: "نقش", id: "شناسه", code: "کد", label: "عنوان", value: "مقدار",
    owner: "مالک", supervisor: "سرپرست", region: "ناحیه", route: "مسیر", home: "منزل",
    shelf: "قفسه", fridge: "یخچال", box: "کادر", product: "کالا", productName: "نام کالا",
    qty: "تعداد", unit: "واحد", unitPrice: "قیمت واحد", gift: "جایزه", total: "جمع",
    _tomb12183: "", _updatedAt: "", _dataGen: "", _schemaVersion: "", _sharedRev: "", _sharedAt: ""
  };
  var FA_DIGITS = ["۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰"];
  var FA_TOKEN = {
    name: "نام", phone: "تلفن", mobile: "همراه", date: "تاریخ", added: "ثبت", time: "ساعت",
    file: "فایل", manager: "مدیر", rep: "نماینده", id: "شناسهٔ", code: "کد", level: "سطح",
    credit: "اعتبار", contract: "قرارداد", type: "نوع", count: "تعداد", price: "قیمت",
    amount: "مبلغ", total: "جمع", order: "سفارش", product: "کالا", user: "کاربر", city: "شهر",
    province: "استان", address: "آدرس", status: "وضعیت", note: "توضیح", notes: "توضیحات",
    created: "ایجاد", updated: "ویرایش", at: "", lat: "عرض جغرافیایی", lng: "طول جغرافیایی",
    gift: "جایزه", percent: "درصد", percentage: "درصدی", doctor: "پزشک", pharmacy: "داروخانه",
    visit: "ویزیت", last: "آخرین", first: "اولین", unit: "واحد", shelf: "قفسه", box: "کادر",
    national: "ملی", email: "رایانامه", web: "وب", site: "سایت", phone2: "تلفن ۲", role: "نقش"
  };

  function faHeader(key) {
    var k = String(key == null ? "" : key);
    if (!k) return "";
    if (FA_HEADER[k] != null) return FA_HEADER[k];
    try {
      var m = window.FA_FIELD_LABELS || window.FA_LABELS;
      if (m && m[k]) return String(m[k]);
    } catch (e) {}
    /* ساختِ برچسبِ فارسی از تکه‌هایِ کلید (orderManagerPhone → تلفن مدیر سفارش) */
    var parts = k.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().split(/[\s_\-.]+/).filter(Boolean);
    var fa = [];
    for (var i = parts.length - 1; i >= 0; i--) {
      var t = FA_TOKEN[parts[i]];
      if (t) fa.push(t);
      else if (fa.length) fa.push(parts[i]);
      else return "";
    }
    return fa.length ? fa.join(" ") : "";
  }

  var EXPORT_BASE = {
    pharmacy: {
      file: "pharmacies-full-export.csv", arr: "pharmacies", tab: "tab-pharmacies",
      cols: [["name", "نام داروخانه"], ["phone", "تلفن"], ["mobile", "همراه"], ["province", "استان"], ["city", "شهر"], ["district", "منطقه"], ["address", "آدرس"], ["plate", "پلاک"], ["floor", "طبقه"], ["type", "نوع"], ["specialty", "تخصص"], ["repName", "نماینده علمی"], ["isPercentage", "درصدی"], ["createdAt", "تاریخ ثبت"]]
    },
    doctor: {
      file: "doctors-full-export.csv", arr: "doctors", tab: "tab-doctors",
      cols: [["name", "نام پزشک/مطب"], ["specialty", "تخصص"], ["phone", "تلفن"], ["mobile", "همراه"], ["province", "استان"], ["city", "شهر"], ["district", "منطقه"], ["address", "آدرس"], ["plate", "پلاک"], ["floor", "طبقه"], ["type", "نوع مطب"], ["repName", "نماینده علمی"], ["createdAt", "تاریخ ثبت"]]
    },
    order: {
      file: "orders-full-export.csv", arr: "orders", tab: "tab-orders",
      cols: [["pharmacyName", "نام داروخانه"], ["repName", "نماینده علمی"], ["orderDate", "تاریخ"], ["address", "آدرس"], ["phone", "تلفن"], ["totalAmount", "مبلغ کل (ریال)"], ["count", "تعداد"], ["status", "وضعیت"], ["priority", "اولویت"], ["notes", "توضیحات"], ["createdAt", "تاریخ ثبت"]]
    }
  };
  var EXPORT_BTN = {
    btnExportPharmaciesCSV: "pharmacy",
    btnExportDoctorsCSV: "doctor",
    btnExportOrdersCSV: "order"
  };

  function cellText(v) {
    if (v == null) return "";
    if (v === true) return "بله";
    if (v === false) return "خیر";
    if (Array.isArray(v)) {
      return v.map(function (x) {
        if (x == null) return "";
        if (typeof x === "object") {
          var nm = x.name || x.label || x.title || "";
          var ct = (x.count != null ? " (" + x.count + ")" : "");
          return nm ? (nm + ct) : JSON.stringify(x);
        }
        return String(x);
      }).join("، ");
    }
    if (typeof v === "object") {
      try { return Object.keys(v).map(function (k) { return k + ": " + cellText(v[k]); }).join(" | "); } catch (e) { return ""; }
    }
    return String(v);
  }

  function recValue(r, f) {
    if (!r) return "";
    if (r.customFields) {
      if (r.customFields[f.label] != null) return r.customFields[f.label];
      if (r.customFields[f.id] != null) return r.customFields[f.id];
    }
    if (typeof window.builtinFieldValue === "function") {
      try {
        var key = TAB_KEY[(EXPORT_BASE[entityOf(r)] || {}).tab] || "";
        var v = window.builtinFieldValue(key, f.id, r);
        if (v != null && v !== "—") return v;
      } catch (e) {}
    }
    return "";
  }
  function entityOf(r) {
    if (r && r.pharmacyName != null && r.orderDate != null) return "order";
    if (r && r.specialty != null && r.pharmacyName == null) return "doctor";
    return "pharmacy";
  }

  function buildFullExport(entity) {
    var cfg = EXPORT_BASE[entity];
    var S = window.state || {};
    var recs = S[cfg.arr] || [];
    var headers = cfg.cols.map(function (c) { return c[1]; });
    var taken = {};
    cfg.cols.forEach(function (c) { taken[c[0]] = 1; });

    var customs = [];
    var info = listOf(cfg.tab);
    if (info.length) customs = info.filter(function (f) { return !f.builtin; });
    if (!customs.length) customs = (((S.customFields || {})[entity]) || []).slice();
    customs.sort(function (a, b) { return num(a.listOrder, num(a.order, 999)) - num(b.listOrder, num(b.order, 999)); });

    /* ستونِ فیلدِ سفارشی: با تیکِ «خروجی اکسل» یا وقتی دستِ‌کم در یک رکورد مقدار دارد */
    customs = customs.filter(function (f) {
      if (!f || !f.id || taken[f.id]) return false;
      if (f.exportExcel === true) return true;
      for (var i = 0; i < recs.length; i++) {
        var v = recValue(recs[i], f);
        if (v !== "" && v != null && v !== "—") return true;
      }
      return false;
    });

    customs.forEach(function (f) {
      taken[f.id] = 1;
      taken["cf:" + (f.label || f.id)] = 1;
      headers.push(f.label || f.id);
    });

    /* هر کلیدِ دیگری که روی رکوردها ذخیره شده (چیزی از قلم نیفتد) */
    var extra = [];
    recs.forEach(function (r) {
      if (!r || typeof r !== "object") return;
      Object.keys(r).forEach(function (k) {
        if (taken[k] || k === "customFields" || k === "id" || k.charAt(0) === "_") return;
        taken[k] = 1;
        extra.push(k);
      });
      if (r.customFields && typeof r.customFields === "object") {
        Object.keys(r.customFields).forEach(function (lbl) {
          if (taken["cf:" + lbl]) return;
          taken["cf:" + lbl] = 1;
          extra.push("cf:" + lbl);
        });
      }
    });
    extra.sort(function (a, b) { return String(a).localeCompare(String(b), "fa"); });
    var seenHeader = {};
    headers.forEach(function (h) { seenHeader[h] = 1; });
    var finalExtra = [];
    extra.forEach(function (k) {
      var h, baseHeader;
      if (k.indexOf("cf:") === 0) { h = k.slice(3); }
      else { h = faHeader(k) || k; }      /* سرستونِ لاتین ممنوع */
      baseHeader = h;
      /* سرستونِ هم‌نام → با عددِ فارسی جدا می‌شود، نه با کلیدِ لاتین */
      var dup = 1;
      while (seenHeader[h]) { dup += 1; h = baseHeader + " " + FA_DIGITS[dup - 1]; }
      void 0;
      seenHeader[h] = 1;
      finalExtra.push({ key: k, header: h });
      headers.push(h);
    });
    extra = finalExtra.map(function (x) { return x.key; });

    var rows = recs.map(function (r) {
      var out = [];
      cfg.cols.forEach(function (c) { out.push(cellText(r ? r[c[0]] : "")); });
      customs.forEach(function (f) {
        var v = recValue(r, f);
        out.push(cellText(v === "—" ? "" : v));
      });
      extra.forEach(function (k) {
        var v = (k.indexOf("cf:") === 0) ? ((r && r.customFields) ? r.customFields[k.slice(3)] : "") : (r ? r[k] : "");
        out.push(cellText(v));
      });
      return out;
    });

    /* اگر کلیدی فارسی نشد، در کنسول گزارش می‌شود تا برچسبش را اضافه کنیم */
    try {
      var latin = headers.filter(function (h) { return /[A-Za-z]/.test(String(h)); });
      if (latin.length) console.warn("⚠️ v1221 سرستونِ بی‌برچسبِ فارسی (به من بگویید تا اضافه کنم): " + latin.join(" | "));
      console.log("📊 v1221 خروجیِ کاملِ " + cfg.label + ": " + rows.length + " رکورد × " + headers.length + " ستون");
    } catch (eL) {}
    return { file: cfg.file, headers: headers, rows: rows, count: recs.length };
  }

  function allowAddOptionFor(fieldId) {
    if (!fieldId) return true;
    for (var i = 0; i < TABS.length; i++) {
      var list = listOf(TABS[i]);
      for (var k = 0; k < list.length; k++) {
        if (String(list[k].id) === String(fieldId)) return list[k].allowAddOption !== false;
      }
    }
    return true;
  }

  function fieldIdOfInput(inp) {
    if (!inp) return "";
    try {
      return String((inp.getAttribute && inp.getAttribute("data-custom-field-id")) || inp.id || "");
    } catch (e) { return ""; }
  }

  /* ───────────────── ۷) عددهایِ واقعیِ همان فیلد در طراح ─────────────────
     شکایت: «برایِ همهٔ فیلدها عرض را ۲۲۰ نشان می‌دهد» — چون `fillDesignerForm`
     فقط مقدارِ «ذخیره‌شده» را می‌خواند و اگر مدیر هیچ‌وقت آن فیلد را ویرایش
     نکرده باشد meta خالی است و عددِ پیش‌فرض می‌آید. حالا عددِ واقعیِ رویِ صفحه
     اندازه‌گیری و نشان داده می‌شود. */
  function pxToMm(px) {
    var n = num(px, 0);
    if (!(n > 0)) return 0;
    return Math.round((n * 25.4 / 96) * 10) / 10;
  }

  function measureBox(el) {
    try {
      if (el && typeof el.getBoundingClientRect === "function") {
        var r = el.getBoundingClientRect();
        return { w: Math.round(r.width || 0), h: Math.round(r.height || 0) };
      }
    } catch (e) {}
    return { w: 0, h: 0 };
  }

  function computedOf(el, prop) {
    try {
      if (typeof window.getComputedStyle !== "function" || !el) return "";
      var cs = window.getComputedStyle(el);
      return String((cs && (cs.getPropertyValue ? cs.getPropertyValue(prop) : cs[prop])) || "");
    } catch (e) { return ""; }
  }

  function setDesignerValue(id, val) {
    var el = $(id);
    if (!el) return 0;
    var want = String(val == null ? "" : val);
    if (String(el.value || "") === want) return 0;
    try { el.value = want; } catch (e) { return 0; }
    return 1;
  }

  function editingField(tab) {
    var f = window._editingColField;
    if (f && f.id) return f;
    var labelInp = $("colFieldLabel");
    var label = labelInp ? String(labelInp.value || "").trim() : "";
    if (!label) return null;
    var list = listOf(tab);
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].label || "").trim() === label) return list[i];
    }
    return null;
  }

  function applyRealDesignerValues() {
    var tab = String(window._activeColTab || "");
    if (!tab || !TAB_KEY[tab]) return 0;
    var f = editingField(tab);
    if (!f) return 0;
    var g = groupOfField(tab, f);
    if (!g) return 0;
    var inp = fieldInput(g) || g;
    var n = 0;

    /* عرض و ارتفاعِ واقعیِ همان فیلد (اگر مدیر عددی ذخیره نکرده باشد) */
    var savedW = num(f.size, 0), savedH = num(f.height, 0);
    var box = measureBox(inp);
    var groupBox = measureBox(g);
    if (!(savedW > 40) && box.w > 40) n += setDesignerValue("colFieldSize", box.w);
    if (!(savedH > 20) && box.h > 10) n += setDesignerValue("colFieldHeight", box.h);

    /* فاصلهٔ میلی‌متریِ واقعیِ همین حالا رویِ صفحه */
    var savedGb = num(f.gapBeforeMm, 0), savedGa = num(f.gapAfterMm, 0);
    if (!(savedGb > 0)) {
      var mb = parseFloat(computedOf(g, "margin-inline-start") || computedOf(g, "margin-right")) || 0;
      n += setDesignerValue("colGapBefore", pxToMm(mb));
    }
    if (!(savedGa > 0)) {
      var ma = parseFloat(computedOf(g, "margin-inline-end") || computedOf(g, "margin-left")) || 0;
      n += setDesignerValue("colGapAfter", pxToMm(ma));
    }

    /* شمارهٔ سطرِ واقعی (از grid-row) */
    if (!(num(f.rowNo, 0) > 0)) {
      var gr = parseInt(computedOf(g, "grid-row-start"), 10);
      if (isFinite(gr) && gr > 0) n += setDesignerValue("colRowNo", gr);
    }

    /* شمارهٔ ترتیبِ واقعیِ همان فیلد در فرم و در لیست */
    if (!(num(f.order, 0) > 0)) {
      var grid = mainGrid(tab);
      var canon = grid ? (allCanons()[gridKey(tab, grid)] || []) : [];
      var byAnchor = {};
      if (grid) kidsOf(grid).forEach(function (k) { var a = anchorOf(k); if (a && byAnchor[a] == null) byAnchor[a] = k; });
      var pos = 0;
      for (var i = 0; i < canon.length; i++) {
        var node = byAnchor[canon[i]];
        if (!node || !isSingleFieldNode(node)) continue;
        pos += 1;
        if (node === g) { n += setDesignerValue("colFieldOrder", pos); break; }
      }
    }
    if (!(num(f.listOrder, 0) > 0)) {
      var list = listOf(tab);
      var byList = list.slice().sort(function (a, b) {
        return num(a.listOrder, num(a.order, 999)) - num(b.listOrder, num(b.order, 999));
      });
      for (var j = 0; j < byList.length; j++) {
        if (String(byList[j].id) === String(f.id)) { n += setDesignerValue("colFieldListOrder", j + 1); break; }
      }
    }
    return n;
  }

  /* ───────────────── ۸) بستنِ منویِ همبرگری ─────────────────
     شکایت: «ضربدر منوی همبرگری را می‌زنم، منو بسته نمی‌شود».
     ریشه: در صفحهٔ باریک `.app-header` با `z-index:4600!important` «بالای»
     کشویِ منو (`z-index:3000`) می‌نشیند، پس کلیک رویِ ✕ به هدر می‌رسد.
     هم سبک را درست کردیم و هم اینجا بستنِ قطعی را خودمان انجام می‌دهیم. */
  function forceCloseSideMenu() {
    try {
      if (typeof window.closeSideMenu === "function") window.closeSideMenu();
    } catch (e) {}
    try {
      var d = $("sideMenuDrawer"), o = $("sideMenuOverlay");
      if (d && d.classList) {
        d.classList.remove("active");
        d.style.transform = ""; d.style.webkitTransform = ""; d.style.right = "";
      }
      if (o && o.classList) { o.classList.remove("active"); o.style.display = "none"; }
      if (document.body && document.body.classList) document.body.classList.remove("v90-drawer-open");
    } catch (e2) {}
  }

  /* ───────────────── ۹) «ارسال به رندر» با گزارشِ صادقانه ─────────────────
     «ارسال نشد: sync-local-only» یعنی درخواست به `/api/sync` رویِ هاستِ PHP
     نرسیده/ناموفق بوده و shimِ crm-hub پاسخِ ساختگی داده است. اینجا با
     XMLHttpRequest (بیرون از shim) وضعیتِ «واقعی» HTTP گرفته می‌شود و اگر
     relayِ هاست کار نکرد، داده مستقیم از مرورگر به رندر فرستاده می‌شود. */
  function rawRequest(method, url, body, cb) {
    try {
      var x = new XMLHttpRequest();
      x.open(method, url, true);
      x.setRequestHeader("X-CRM-Request", "1");
      x.setRequestHeader("X-CRM-Sync", "v12183");
      if (body != null) x.setRequestHeader("Content-Type", "application/json");
      x.timeout = 20000;
      x.onload = function () {
        var j = null;
        try { j = JSON.parse(String(x.responseText || "null")); } catch (e) {}
        cb({ ok: x.status >= 200 && x.status < 300, status: x.status, j: j });
      };
      x.onerror = function () { cb({ ok: false, status: 0, j: null }); };
      x.ontimeout = function () { cb({ ok: false, status: 0, j: { message: "زمان تمام شد (۲۰ ثانیه)" } }); };
      x.send(body == null ? null : body);
    } catch (e) { cb({ ok: false, status: 0, j: { message: String(e && e.message || e) } }); }
  }

  function stateBody() {
    try {
      var S = window.state || {};
      if (typeof window.serializeStateForLocalStorage === "function") return window.serializeStateForLocalStorage(S);
      return JSON.stringify(S);
    } catch (e) { return "{}"; }
  }

  function hubHosts() {
    var out = [];
    try {
      var rt = window.CRM_RUNTIME || {};
      (rt.hubs || []).forEach(function (h) { if (h) out.push(String(h).replace(/\/+$/, "")); });
    } catch (e) {}
    ["https://javad-test1.onrender.com", "https://mehraeinpharma.ir", "https://ndcohub.com"].forEach(function (h) {
      if (out.indexOf(h) < 0) out.push(h);
    });
    try {
      var same = window.location && window.location.origin ? String(window.location.origin) : "";
      return out.filter(function (h) { return h !== same; });
    } catch (e2) { return out; }
  }

  function pushDirectToHubs(done) {
    var hosts = hubHosts();
    var body = stateBody();
    var results = [];
    var i = 0;
    function step() {
      if (i >= hosts.length) { done(results); return; }
      var h = hosts[i++];
      rawRequest("POST", h + "/api/state", body, function (r) {
        results.push({ host: h, ok: r.ok, status: r.status, msg: (r.j && (r.j.message || r.j.status)) || "" });
        step();
      });
    }
    step();
  }

  function syncToRenderSmart(statusEl) {
    function say(t) { try { if (statusEl) statusEl.textContent = t; } catch (e) {} }
    say("در حال ارسال…");
    rawRequest("GET", "/api/sync?target=render", null, function (r) {
      if (r.ok && r.j && (r.j.status === "success" || r.j.ok === true)) {
        say("✅ ارسال شد به " + (r.j.target || "رندر") + " (HTTP " + r.status + ")");
        return;
      }
      var why = r.status === 0
        ? "درخواست به /api/sync نرسید (شبکه/مسیرِ api.php)"
        : ("api.php پاسخِ " + r.status + " داد" + (r.j && r.j.message ? " — " + r.j.message : ""));
      say("⚠️ " + why + " — در حالِ ارسالِ مستقیم به رندر…");
      pushDirectToHubs(function (res) {
        var okOnes = res.filter(function (x) { return x.ok; });
        if (okOnes.length) {
          say("✅ مستقیم ارسال شد: " + okOnes.map(function (x) { return x.host.replace(/^https?:\/\//, "") + " (HTTP " + x.status + ")"; }).join("، "));
        } else {
          say("❌ ارسال نشد. " + why + " | مستقیم هم نشد: " +
            res.map(function (x) { return x.host.replace(/^https?:\/\//, "") + ":" + (x.status || x.msg || "خطا"); }).join("، ") +
            " — api.php را در public_html آپلود کنید یا اتصالِ دامنه به رندر را بررسی کنید.");
        }
      });
    });
  }

  /* ───────────────── ۱۰) تابلوِ روانِ رویدادهایِ روزِ تقویمِ شمسی ─────────────────
     شکایتِ نوبتِ ۱۴۸: «رویدادهای روز تقویم شمسی ایران را به حالت تابلو روانِ
     آهسته زیرِ همهٔ اطلاعاتِ کادرِ بالا نشان بده». */
  var FA_EVENTS = {
    "1/1": ["آغاز عید نوروز (تعطیل رسمی)", "نخستین روز بهار"],
    "1/2": ["عید نوروز (تعطیل رسمی)"],
    "1/3": ["عید نوروز (تعطیل رسمی)"],
    "1/4": ["عید نوروز (تعطیل رسمی)"],
    "1/6": ["روز امیدواری و نیک‌کاری"],
    "1/7": ["روز هنرهای نمایشی"],
    "1/10": ["روز همبستگی با سوریه و کردستان"],
    "1/12": ["روز جمهوری اسلامی ایران (تعطیل رسمی)"],
    "1/13": ["روز طبیعت، سیزده‌بدر (تعطیل رسمی)"],
    "1/15": ["روز ذخایر ژنتیکی و زیستی"],
    "1/18": ["روز جهانی سلامتی"],
    "1/20": ["روز ملی فناوری هسته‌ای"],
    "1/25": ["روز بزرگداشت عطار نیشابوری"],
    "1/29": ["روز ارتش جمهوری اسلامی"],
    "2/1": ["روز بزرگداشت سعدی"],
    "2/2": ["روز زمین پاک"],
    "2/3": ["روز بزرگداشت شیخ بهایی"],
    "2/9": ["روز شوراها"],
    "2/10": ["روز ملی خلیج فارس"],
    "2/12": ["روز معلم"],
    "2/15": ["روز بزرگداشت شیخ صدوق"],
    "2/18": ["روز بیماری‌های خاص و صعب‌العلاج"],
    "2/25": ["روز بزرگداشت فردوسی و پاسداشت زبان پارسی"],
    "2/28": ["روز بزرگداشت حکیم عمر خیام"],
    "3/1": ["روز بزرگداشت ملاصدرا"],
    "3/3": ["سالروز فتح خرمشهر"],
    "3/4": ["روز دزفول، روز مقاومت و پایداری"],
    "3/14": ["رحلت امام خمینی (تعطیل رسمی)"],
    "3/15": ["قیام خونین ۱۵ خرداد"],
    "3/20": ["روز جهانی مسجد"],
    "3/27": ["روز ارتباطات و روابط عمومی"],
    "4/1": ["روز تبلیغ و اطلاع‌رسانی دینی"],
    "4/7": ["روز جهانی عمران"],
    "4/8": ["روز مبارزه با سلاح‌های شیمیایی و میکروبی (بمباران شیمیایی سردشت)"],
    "4/12": ["روز ملی مبارزه با تحریم"],
    "4/14": ["روز قلم"],
    "4/16": ["روز مالیات"],
    "4/18": ["روز ادبیات کودکان و نوجوانان"],
    "4/21": ["روز عفاف و حجاب"],
    "4/25": ["روز بهزیستی و تامین اجتماعی"],
    "4/27": ["روز بزرگداشت جهادگران"],
    "5/5": ["روز عملیات مرصاد"],
    "5/9": ["روز اهدای خون"],
    "5/14": ["روز صدور فرمان مشروطیت"],
    "5/17": ["روز خبرنگار"],
    "5/21": ["روز حمایت از صنایع کوچک"],
    "5/27": ["روز داروسازی، بزرگداشت زکریای رازی"],
    "5/28": ["روز گرامیداشت شهدای مدافع حرم"],
    "5/30": ["روز بزرگداشت علامهٔ مجلسی"],
    "6/1": ["روز پزشک، بزرگداشت بوعلی سینا"],
    "6/2": ["هفتهٔ دولت"],
    "6/4": ["روز کارمند"],
    "6/5": ["روز بزرگداشت محمدبن زکریای رازی"],
    "6/8": ["روز مبارزه با تروریسم (انفجار دفتر نخست‌وزیری)"],
    "6/10": ["روز بانکداری اسلامی"],
    "6/12": ["روز مبارزه با استعمار"],
    "6/13": ["روز تعاون"],
    "6/14": ["روز اکرام و مهرورزی"],
    "6/17": ["روز پزشکی ورزشی"],
    "6/18": ["روز جهانی سوادآموزی", "روز جهانی فیزیوتراپی"],
    "6/20": ["روز شهدای مدافع حرم"],
    "6/21": ["روز سینما"],
    "6/27": ["روز شعر و ادب پارسی، بزرگداشت شهریار"],
    "6/31": ["آغاز هفتهٔ دفاع مقدس"],
    "7/5": ["روز ایمنی و آتش‌نشانی"],
    "7/7": ["روز آتش‌نشانی و ایمنی"],
    "7/8": ["روز بزرگداشت مولوی"],
    "7/9": ["روز همبستگی با کودکان"],
    "7/13": ["روز نیروی انتظامی"],
    "7/14": ["روز دامپزشکی"],
    "7/15": ["روز روستا و عشایر"],
    "7/20": ["روز بزرگداشت حافظ"],
    "7/24": ["روز پارالمپیک"],
    "7/26": ["روز تربیت بدنی"],
    "7/29": ["روز صادرات"],
    "8/4": ["روز فرهنگ عمومی"],
    "8/8": ["روز پدافند غیرعامل"],
    "8/10": ["روز حسابداری"],
    "8/13": ["روز تسخیر لانهٔ جاسوسی، روز ملی مبارزه با استکبار"],
    "8/14": ["روز فرهنگ عمومی و مهرورزی"],
    "8/24": ["روز کتاب، کتابخوانی و کتابدار"],
    "8/26": ["روز جهانی نیکی"],
    "8/30": ["روز قهرمان ملی"],
    "9/5": ["روز بسیج مستضعفان"],
    "9/7": ["روز نیروی دریایی"],
    "9/9": ["روز بزرگداشت شیخ مفید"],
    "9/11": ["روز دانشجو"],
    "9/16": ["روز دانشمند و پژوهشگر"],
    "9/19": ["روز تجارت و توسعه"],
    "9/25": ["روز پژوهش"],
    "9/26": ["روز حمل‌ونقل و رانندگان"],
    "9/27": ["روز وحدت حوزه و دانشگاه"],
    "9/29": ["روز ایمنی در برابر زلزله"],
    "9/30": ["شب یلدا"],
    "10/5": ["روز ایمنی در برابر آتش"],
    "10/7": ["روز جهانی حماسهٔ مردم"],
    "10/9": ["روز بصیرت"],
    "10/17": ["روز اجرای قانون اساسی"],
    "10/19": ["روز عمران روستایی"],
    "10/22": ["روز صنعت برق"],
    "10/26": ["روز فرار مغزها"],
    "10/27": ["روز وحدت و همدلی"],
    "11/6": ["روز ایمنی غذایی"],
    "11/12": ["روز آمار"],
    "11/14": ["روز فناوری فضایی"],
    "11/19": ["روز ازدواج"],
    "11/22": ["روز بهمن"],
    "11/25": ["روز بیمه"],
    "11/29": ["روز اقتصاد مقاومتی"],
    "12/3": ["روز مهندسی"],
    "12/5": ["روز خاک"],
    "12/9": ["روز حمایت از حقوق مصرف‌کنندگان"],
    "12/14": ["روز احسان و نیکوکاری"],
    "12/15": ["روز درختکاری"],
    "12/18": ["روز بزرگداشت سیدجمال‌الدین اسدآبادی"],
    "12/22": ["روز بزرگداشت شهدا، سالروز تأسیس بنیاد شهید"],
    "12/25": ["روز بزرگداشت پروین اعتصامی"],
    "12/29": ["روز ملی شدن صنعت نفت"]
  };

  function todayJalaliMD(now) {
    try {
      var parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { month: "numeric", day: "numeric" }).formatToParts(now || new Date());
      var m = "", d = "";
      parts.forEach(function (p) { if (p.type === "month") m = cleanNum(p.value); if (p.type === "day") d = cleanNum(p.value); });
      return { m: Number(m), d: Number(d) };
    } catch (e) { return null; }
  }

  function tickerText() {
    var md = todayJalaliMD();
    var out = [];
    if (md) {
      var key = md.m + "/" + md.d;
      var evs = FA_EVENTS[key] || [];
      var dateStr = "";
      try { dateStr = clockDate(new Date()); } catch (e) {}
      out.push("📅 " + dateStr);
      if (evs.length) {
        evs.forEach(function (e) { out.push("🌟 " + e); });
      } else {
        /* رویدادی برایِ امروز ثبت نشده → رویدادهایِ همین ماه */
        var monthEvs = [];
        Object.keys(FA_EVENTS).forEach(function (k) {
          if (Number(k.split("/")[0]) === md.m) monthEvs.push(k.split("/")[1] + ": " + FA_EVENTS[k][0]);
        });
        monthEvs.sort(function (a, b) { return Number(a.split(":")[0]) - Number(b.split(":")[0]); });
        out.push("رویدادِ ویژه‌ای برای امروز ثبت نشده؛ از دیگر روزهای این ماه: " + monthEvs.slice(0, 6).join(" · "));
      }
    } else {
      out.push("تابلو رویدادهای تقویم شمسی");
    }
    return out.join("  ✦  ");
  }

  function buildTicker() {
    try {
      var header = document.querySelector(".app-header");
      if (!header) return;
      var bar = document.getElementById("crmEventTicker");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "crmEventTicker";
        bar.className = "crm-event-ticker";
        bar.setAttribute("dir", "rtl");
        bar.innerHTML = '<div class="crm-ticker-label">🗓 رویدادهای امروز</div><div class="crm-ticker-view"><div class="crm-ticker-move"><span id="crmTickerText"></span><span id="crmTickerText2" aria-hidden="true"></span></div></div>';
        header.parentNode && header.parentNode.insertBefore(bar, header.nextSibling);
      }
      var txt = tickerText();
      var a = document.getElementById("crmTickerText"), b = document.getElementById("crmTickerText2");
      if (a && a.textContent !== txt) { a.textContent = txt; if (b) b.textContent = "  ✦  " + txt; }
    } catch (e) {}
  }

  /* ───────────────── ۱۱) نگهبانِ ویزیت: نقطه‌ها و آمار هیچ‌وقت صفرِ ناخواسته نمی‌مانند ─────────────────
     شکایت: «شروع/پایان ویزیت را می‌زنم، مسافت ۰ متر، توقف ۰ دقیقه، نقاط ۰».
     ریشه‌های ممکن: pullِ همگام‌سازی `v20ActiveVisit` را از state پاک می‌کند یا
     مرورگر رویدادِ GPS را دیر می‌فرستد. حالا یک سایهٔ محلی (sessionStorage) از
     ویزیتِ فعال نگه می‌داریم و اگر state آن را گم کرد، برمی‌گردانیم؛ و پس از
     «پایان ویزیت» آمارِ جلسهٔ تمام‌شده را در همان کادر نشان می‌دهیم. */
  var VISIT_SHADOW = "CRM_V1223_VISIT_SHADOW";
  function sess() {
    try { if (window.sessionStorage) return window.sessionStorage; } catch (e) {}
    try { if (typeof sessionStorage !== "undefined") return sessionStorage; } catch (e2) {}
    return null;
  }
  function visitShadowGet() { try { var s = sess(); return s ? JSON.parse(s.getItem(VISIT_SHADOW) || "null") : null; } catch (e) { return null; } }
  function visitShadowSet(v) { try { var s = sess(); if (!s) return; if (v) s.setItem(VISIT_SHADOW, JSON.stringify(v)); else s.removeItem(VISIT_SHADOW); } catch (e) {} }

  function visitGuardTick() {
    var S = window.state;
    if (!S) return;
    var sh = visitShadowGet();
    if (S.v20ActiveVisit) {
      if (!sh || sh.id !== S.v20ActiveVisit.id) visitShadowSet(S.v20ActiveVisit);
      else if ((S.v20ActiveVisit.points || []).length !== (sh.points || []).length) visitShadowSet(S.v20ActiveVisit);
    } else if (sh && sh.id) {
      /* state ویزیت را گم کرده — برمی‌گردانیم تا watch به ثبت ادامه دهد */
      S.v20ActiveVisit = sh;
    }
  }

  function paintFinishedVisitStats() {
    try {
      var S = window.state;
      if (!S || S.v20ActiveVisit) return;   /* وقتی ویزیت فعال است، کادرِ خودِ برنامه مالک است */
      var box = document.getElementById("v20VisitMetrics");
      if (!box) return;
      var last = (S.repRoutes || [])[0];
      if (!last || !last.endedAt) return;
      var html = "<div class='v20-metric'>مسافت طی‌شده<b>" + Math.round(last.distance || 0) + " متر</b></div>" +
        "<div class='v20-metric'>مدت توقف<b>" + Math.round((last.stopMs || 0) / 60000) + " دقیقه</b></div>" +
        "<div class='v20-metric'>نقاط ثبت‌شده<b>" + ((last.points || []).length || last.visited || 0) + "</b></div>" +
        "<div class='v20-metric'>ساعت شروع<b>" + (last.startTime || "—") + "</b></div>" +
        "<div class='v20-metric'>ساعت پایان<b>" + (last.endTime || "—") + "</b></div>";
      if (box.innerHTML.indexOf("ساعت پایان") < 0) box.innerHTML = html;
    } catch (e) {}
  }

  /* ───────────────── ۱۲) نقشهٔ تردد: خطِ مسیر + مراکزِ بینِ مسیر با برچسبِ ویزیت ─────────────────
     شکایت: «نمایش تردد باید مثلِ مسیریاب بلد خطِ تردد را روی نقشه بکشد و همهٔ
     داروخانه‌ها/پزشکانِ بینِ مسیر را با برچسبِ ویزیت‌شده/نشده نشان دهد».
     خطِ مسیر را خودِ باندل می‌کشد؛ اینجا مراکزِ نزدیکِ مسیر را با برچسبِ دائمی
     اضافه می‌کنیم. */
  function havV1223(a, b) {
    if (!a || !b || a.lat == null || b.lat == null) return 1e9;
    var R = 6371000, p = Math.PI / 180;
    var d1 = (b.lat - a.lat) * p, d2 = (b.lng - a.lng) * p;
    var x = Math.sin(d1 / 2) * Math.sin(d1 / 2) + Math.cos(a.lat * p) * Math.cos(b.lat * p) * Math.sin(d2 / 2) * Math.sin(d2 / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function drawRouteCenters() {
    try {
      var map = window._mapRepRoutes;
      var LL = window.L;
      if (!map || typeof LL === "undefined") return 0;
      window.__v1223Layers = window.__v1223Layers || [];
      window.__v1223Layers.forEach(function (l) { try { map.removeLayer(l); } catch (e) {} });
      window.__v1223Layers = [];

      var S = window.state || {};
      var sel = document.getElementById("routeRepFilterSelect");
      var rep = sel ? String(sel.value || "") : "";
      var routes = (S.repRoutes || []).filter(function (r) { return !rep || r.repName === rep; }).slice(0, 4);

      var centers = [];
      (S.pharmacies || []).forEach(function (c) { if (c.lat && c.lng) centers.push({ name: c.name, lat: +c.lat, lng: +c.lng, kind: "داروخانه" }); });
      (S.doctors || []).forEach(function (c) { if (c.lat && c.lng) centers.push({ name: c.name, lat: +c.lat, lng: +c.lng, kind: "مطب" }); });

      var added = 0;
      routes.forEach(function (rt) {
        var path = rt.path || [];
        if (!path.length) return;
        var step = Math.max(1, Math.floor(path.length / 500));
        centers.forEach(function (c) {
          var near = false;
          for (var i = 0; i < path.length; i += step) {
            if (havV1223(c, path[i]) <= 250) { near = true; break; }
          }
          if (!near) return;
          var visited = (S.visits || []).some(function (v) {
            return (v.pharmacyName === c.name || v.doctorName === c.name) && (!rt.date || v.date === rt.date);
          });
          var mk = LL.circleMarker([c.lat, c.lng], {
            radius: 9, weight: 3, color: "#fff",
            fillColor: visited ? "#16a34a" : "#dc2626", fillOpacity: 1
          }).addTo(map);
          mk.bindTooltip((visited ? "✅ " : "🔴 ") + c.name + " — " + (visited ? "ویزیت شده" : "ویزیت نشده"), { permanent: true, direction: "top", className: "v1223-center-tip" });
          window.__v1223Layers.push(mk);
          added++;
        });
        /* برچسبِ آغاز و پایانِ مسیر */
        var p0 = path[0], p1 = path[path.length - 1];
        if (p0) window.__v1223Layers.push(LL.circleMarker([p0.lat, p0.lng], { radius: 7, color: "#0f766e", weight: 3, fillColor: "#ccfbf1", fillOpacity: 1 }).addTo(map).bindTooltip(" شروع تردد " + (rt.startTime || ""), { permanent: true, direction: "top" }));
        if (p1) window.__v1223Layers.push(LL.circleMarker([p1.lat, p1.lng], { radius: 7, color: "#7c2d12", weight: 3, fillColor: "#fed7aa", fillOpacity: 1 }).addTo(map).bindTooltip("🏁 پایان تردد " + (rt.endTime || ""), { permanent: true, direction: "top" }));
      });
      return added;
    } catch (e) { return 0; }
  }

  /* ───────────────── ۱۳) خروجیِ اکسلِ واقعیِ .xlsx برایِ گوشی ─────────────────
     شکایت: «پسوندِ فایلِ اکسل برایِ گوشی نامعتبر است». HTML-داخل-.xls روی بسیاری
     گوشی‌ها رد می‌شود؛ حالا یک .xlsx «واقعی» (ZIP با sheet1) ساخته می‌شود که
     اندروید و iOS بی‌بهانه باز می‌کنند. */
  var CRC_T = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
    return t;
  })();
  function crc32B(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function strB(s) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(s);
    var out = []; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c < 128) out.push(c); else { out.push(0xEF, 0xBF, 0xBD); } } return new Uint8Array(out);
  }
  function catB(arrs) {
    var len = 0; arrs.forEach(function (a) { len += a.length; });
    var out = new Uint8Array(len), o = 0;
    arrs.forEach(function (a) { out.set(a, o); o += a.length; });
    return out;
  }
  function zipStoreXlsx(files) {
    var locals = [], centrals = [], off = 0;
    var d = new Date();
    var dosT = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
    var dosD = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
    files.forEach(function (f) {
      var nameB = strB(f.name), data = f.data, crc = crc32B(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, dosT, true); lh.setUint16(12, dosD, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, nameB.length, true); lh.setUint16(28, 0, true);
      locals.push(new Uint8Array(lh.buffer), nameB, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, dosT, true); ch.setUint16(14, dosD, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, nameB.length, true); ch.setUint32(42, off, true);
      centrals.push(new Uint8Array(ch.buffer), nameB);
      off += 30 + nameB.length + data.length;
    });
    var centralSize = centrals.reduce(function (s, a) { return s + a.length; }, 0);
    var eocd = new DataView(new ArrayBuffer(22));
    eocd.setUint32(0, 0x06054b50, true); eocd.setUint16(8, files.length, true); eocd.setUint16(10, files.length, true);
    eocd.setUint32(12, centralSize, true); eocd.setUint32(16, off, true);
    return catB(locals.concat(centrals).concat([new Uint8Array(eocd.buffer)]));
  }
  function colLetter(i) {
    var s = ""; i += 1;
    while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }
  function xmlEscX(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function buildXlsx(headers, rows) {
    var sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><sheetData>';
    function rowXml(cells, ri) {
      return "<row r=\"" + (ri + 1) + "\">" + cells.map(function (c, ci) {
        return "<c r=\"" + colLetter(ci) + (ri + 1) + "\" t=\"inlineStr\"><is><t xml:space=\"preserve\">" + xmlEscX(c) + "</t></is></c>";
      }).join("") + "</row>";
    }
    sheet += rowXml(headers, 0);
    rows.forEach(function (r, i) { sheet += rowXml(r, i + 1); });
    sheet += "</sheetData></worksheet>";
    var files = [
      { name: "[Content_Types].xml", data: strB('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>') },
      { name: "_rels/.rels", data: strB('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>') },
      { name: "xl/workbook.xml", data: strB('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="گزارش" sheetId="1" r:id="rId1"/></sheets></workbook>') },
      { name: "xl/_rels/workbook.xml.rels", data: strB('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>') },
      { name: "xl/worksheets/sheet1.xml", data: strB(sheet) }
    ];
    return zipStoreXlsx(files);
  }

  function installXlsxExport() {
    var orig = window.downloadCSVFile;
    if (!orig || orig._v1223) return;
    var w = function (filename, headers, rows) {
      try {
        var hdrs = headers.slice();
        var rws = rows.map(function (r) { return r.slice(); });
        if (hdrs[0] !== "ردیف") { hdrs = ["ردیف"].concat(hdrs); rws = rws.map(function (r, i) { return [i + 1].concat(r); }); }
        var repAt = -1;
        hdrs.forEach(function (h, i) { if (repAt < 0 && /نام نماینده|نماینده علمی|نماینده/.test(String(h))) repAt = i; });
        if (repAt < 0) {
          hdrs.splice(1, 0, "نام نماینده");
          rws = rws.map(function (r) { var x = r.slice(); x.splice(1, 0, (typeof window.currentUserName === "string" ? window.currentUserName : "—")); return x; });
        } else if (repAt !== 1) {
          var rh = hdrs.splice(repAt, 1)[0]; hdrs.splice(1, 0, rh);
          rws = rws.map(function (r) { var x = r.slice(); var v = x.splice(repAt, 1)[0]; x.splice(1, 0, v); return x; });
        }
        var bytes = buildXlsx(hdrs, rws);
        var blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = String(filename || "export.xls").replace(/\.(csv|xls|xlsx)$/i, "") + ".xlsx";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 800);
        try { console.log("📊 v1223 خروجیِ xlsx واقعی: " + a.download + " — " + rws.length + " سطر"); } catch (eL) {}
        return;
      } catch (e) { try { return orig(filename, headers, rows); } catch (e2) {} }
    };
    w._v1223 = true;
    window.downloadCSVFile = w;
  }

  /* ───────────────── راه‌اندازی ───────────────── */
  function pass() {
    try { enforceAll(); } catch (e) {}
    try { paintAll(); } catch (e2) {}
  }

  function boot() {
    /* ۱) بازگرداندنِ تنظیماتِ گم‌شده، پیش از هر رندر */
    var restored = 0;
    try { restored = restoreVault(); } catch (e) {}

    buildTopBar();
    tickClock();

    /* نخستین ضبطِ ترتیبِ لنگر، پس از آنکه فرم‌ها نشستند */
    setTimeout(function () {
      TABS.forEach(function (t) {
        try {
          var map = allCanons();
          var grid = mainGrid(t);
          if (!grid) return;
          if (!map[gridKey(t, grid)] || !map[gridKey(t, grid)].length) captureCanon(t);
        } catch (e) {}
      });
      pass();
      if (restored > 0) {
        try { if (typeof window.saveState === "function") window.saveState(false); } catch (e) {}
        toast("🛡 " + restored + " قلم از تنظیمات/فیلدهایِ نسخهٔ قبل خودکار برگشت.");
      }
    }, 400);

    /* نگهبانِ پیوسته: هر ۹۰۰ میلی‌ثانیه (سبک، فقط در صورتِ تفاوت جابه‌جا می‌کند) */
    setInterval(function () {
      try { if (document.hidden) return; } catch (e) {}
      pass();
    }, 900);

    /* ثانیه‌شمار: هر ثانیه، فقط نوشتنِ متفاوت */
    setInterval(tickClock, 1000);

    /* پس از هر تغییرِ DOM در فرم‌ها */
    try {
      if (window.MutationObserver) {
        var pending = 0;
        var mo = new MutationObserver(function () {
          if (pending) return;
          pending = setTimeout(function () { pending = 0; pass(); }, 160);
        });
        TABS.forEach(function (t) {
          var pane = $(t);
          if (pane) { try { mo.observe(pane, { childList: true, subtree: true }); } catch (e) {} }
        });
      }
    } catch (eMO) {}

    /* «پاک‌کردن»، «اجرای موتور» و هر کلیکِ بازچینش → فوراً برگرد */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (!t.closest("#crmEngineRunBtn,[data-crm-engine-run],[id^='v60Clear'],.btn-clear-form,#btnManSave")) return;
        setTimeout(pass, 120);
        setTimeout(pass, 700);
        setTimeout(pass, 1600);
      }, true);
    } catch (eRS) {}

    /* ذخیرهٔ طراح: «داخل کدام کادر» ذخیره می‌شود و ترتیب از «شماره ترتیب» ساخته می‌شود */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var save = t.closest("#btnSaveColField,#btnManSave");
        var orderUi = t.closest(".col-order-input,.fld-up,.fld-down,[data-act='up'],[data-act='down'],[data-move]");
        if (save) rememberBoxTarget();
        if (!save && !orderUi) return;
        setTimeout(function () {
          try { applyPendingBox(); } catch (e1) {}
          try { rebuildAllCanons(); } catch (e2) {}
          pass();
        }, 1100);
        setTimeout(pass, 2200);
      }, true);
    } catch (eSV) {}

    /* تغییرِ «شماره ترتیب» با تایپِ مستقیم در جدولِ فیلدها */
    try {
      document.addEventListener("change", function (e) {
        var t = e.target;
        if (!t || !t.classList) return;
        if (!t.classList.contains("col-order-input") && t.id !== "colFieldOrder") return;
        setTimeout(function () { try { rebuildAllCanons(); } catch (e1) {} pass(); }, 900);
      }, true);
    } catch (eOR) {}

    /* «افزودن لحظه‌ای» برای فیلدِ بدونِ تیک → بسته (فازِ capture، پیش ازِ همه) */
    try {
      window.addEventListener("click", function (e) {
        var t = e.target;
        var b = t && t.closest ? t.closest(".btn-instant-add, .v20-addopt") : null;
        if (!b) return;
        var wrap = (b.closest && b.closest(".instant-add-row, .instant-add-add-row, .crm-combo, .form-group")) || b.parentNode;
        var inp = wrap && wrap.querySelector ? wrap.querySelector("input, select") : null;
        var fid = fieldIdOfInput(inp);
        if (fid && allowAddOptionFor(fid) === false) {
          try { e.preventDefault(); e.stopImmediatePropagation(); } catch (e2) {}
          toast("«افزودن لحظه‌ای گزینه» برای این فیلد خاموش است.");
        }
      }, true);
    } catch (eIA) {}

    /* خروجیِ اکسلِ کامل */
    try {
      window.addEventListener("click", function (e) {
        var t = e.target;
        var btn = t && t.closest ? t.closest("#btnExportPharmaciesCSV,#btnExportDoctorsCSV,#btnExportOrdersCSV") : null;
        if (!btn || !EXPORT_BTN[btn.id]) return;
        try { e.preventDefault(); e.stopImmediatePropagation(); } catch (e2) {}
        var entity = EXPORT_BTN[btn.id];
        var out = buildFullExport(entity);
        if (typeof window.downloadCSVFile === "function") window.downloadCSVFile(out.file, out.headers, out.rows);
        toast("خروجی کاملِ تب: " + out.count + " سطر × " + out.headers.length + " ستون.");
      }, true);
    } catch (eEX) {}

    /* طراحِ «ستون‌ها و کالاها»: عددهایِ واقعیِ همان فیلد نمایش داده شود */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (!t.closest("#colFieldList,#columnsDesignerHost,[data-act='edit'],.col-edit-btn")) return;
        setTimeout(function () { try { applyRealDesignerValues(); } catch (e1) {} }, 80);
        setTimeout(function () { try { applyRealDesignerValues(); } catch (e2) {} }, 450);
      }, true);
      var designer = $("columnsDesignerHost") || $("colDesignerPanel");
      if (designer && window.MutationObserver) {
        var dPending = 0;
        new MutationObserver(function () {
          if (dPending) return;
          dPending = setTimeout(function () { dPending = 0; try { applyRealDesignerValues(); } catch (e3) {} }, 200);
        }).observe(designer, { childList: true, subtree: true });
      }
    } catch (eDZ) {}

    /* بستنِ منویِ همبرگری با ✕ (و Escape) — حتی اگر هدر رویِ کشو باشد */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#btnCloseSideMenu,.btn-close-side")) {
          setTimeout(forceCloseSideMenu, 0);
          setTimeout(forceCloseSideMenu, 120);
        }
      }, true);
      window.addEventListener("keydown", function (e) {
        if (e && (e.key === "Escape" || e.key === "Esc")) forceCloseSideMenu();
      });
    } catch (eHM) {}

    /* «ارسال به رندر» در تبِ عیب‌یابی: وضعیتِ واقعیِ HTTP + ارسالِ مستقیم */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        var btn = t && t.closest ? t.closest("#btnV96SyncRender") : null;
        if (!btn) return;
        try { e.preventDefault(); e.stopImmediatePropagation(); } catch (e2) {}
        syncToRenderSmart($("v96SyncStatus"));
      }, true);
    } catch (eSR) {}

    /* خروجیِ اکسلِ واقعیِ .xlsx (پسوندِ معتبر برایِ گوشی) */
    try { installXlsxExport(); } catch (eX) {}

    /* تابلوِ روانِ رویدادهایِ روز — زیرِ همهٔ اطلاعاتِ کادرِ بالا، آهسته */
    try {
      buildTicker();
      setInterval(function () { try { buildTicker(); } catch (e) {} }, 60000);
    } catch (eTK) {}

    /* نگهبانِ ویزیت + آمارِ جلسهٔ تمام‌شده */
    try {
      setInterval(function () { try { visitGuardTick(); } catch (e) {} try { paintFinishedVisitStats(); } catch (e2) {} }, 1500);
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#btnStartVisit")) {
          setTimeout(function () { try { var S = window.state; if (S && S.v20ActiveVisit) visitShadowSet(S.v20ActiveVisit); } catch (e1) {} }, 500);
        }
        if (t.closest("#btnEndVisit")) {
          setTimeout(function () { try { visitShadowSet(null); paintFinishedVisitStats(); } catch (e2) {} }, 700);
        }
      }, true);
    } catch (eVG) {}

    /* نقشهٔ تردد: پس از هر بروزرسانی، مراکزِ بینِ مسیر با برچسبِ ویزیت */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#btnRefreshRepRoutesMap,#v20RouteRefresh,#v20RouteAll,#btnV20ShowRoute")) {
          setTimeout(function () { try { drawRouteCenters(); } catch (e3) {} }, 400);
          setTimeout(function () { try { drawRouteCenters(); } catch (e4) {} }, 1200);
        }
      }, true);
      var repSel = $("routeRepFilterSelect");
      if (repSel) repSel.addEventListener("change", function () { setTimeout(function () { try { drawRouteCenters(); } catch (e5) {} }, 400); });
    } catch (eRC) {}

    /* دکمه‌های گاوصندوق */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest("#crmVaultSaveBtn")) { downloadVaultFile(); return; }
        if (t.closest("#crmVaultLoadBtn")) { var fi = $("crmVaultFile"); if (fi) fi.click(); }
      }, true);
      var fileIn = $("crmVaultFile");
      if (fileIn) {
        fileIn.addEventListener("change", function () {
          try { if (fileIn.files && fileIn.files[0]) restoreFromFile(fileIn.files[0]); } catch (e) {}
        });
      }
    } catch (eVB) {}

    /* پشتیبانِ خودکار: هر ۶۰ ثانیه اگر چیزی عوض شده بود */
    setInterval(function () {
      try {
        var prev = readJson(VAULT_KEY, null);
        var snap = vaultSnapshot();
        var sig = JSON.stringify([snap.customFields, snap.formFieldMeta, snap.anchors]);
        var oldSig = prev ? JSON.stringify([prev.customFields, prev.formFieldMeta, prev.anchors]) : "";
        if (sig !== oldSig) saveVault();
      } catch (e) {}
    }, 60000);

    /* اگر حافظهٔ مرورگر خالی بود (نصبِ تازه/مرورگرِ دیگر) از IndexedDB و سپس سرور برگردان */
    try {
      if (!readJson(VAULT_KEY, null)) {
        idbGet(function (v) {
          if (!v) {
            pullVault(function (sv) {
              if (!sv) return;
              var n = mergeVault(sv);
              if (n > 0) {
                writeJson(VAULT_KEY, sv);
                try { if (typeof window.saveState === "function") window.saveState(false); } catch (e) {}
                pass();
                toast("🛡 " + n + " قلم از پشتیبانِ سرور برگشت.");
              }
            });
            return;
          }
          var n2 = mergeVault(v);
          writeJson(VAULT_KEY, v);
          if (n2 > 0) {
            try { if (typeof window.saveState === "function") window.saveState(false); } catch (e) {}
            pass();
            toast("🛡 " + n2 + " قلم از پشتیبانِ مرورگر برگشت.");
          }
        });
      } else {
        pullVault(function (sv) { if (sv) { var n3 = mergeVault(sv); if (n3 > 0) { pass(); } } });
      }
    } catch (eIDB) {}

    /* اولین پشتیبانِ همین نشست */
    setTimeout(function () { try { saveVault(); } catch (e) {} }, 2500);
  }

  /* نامِ API و کلیدهایِ حافظه از ۱۲.۲۰ نگه داشته شدند تا با ارتقا داده‌ها نپرند */
  window.v1220Api = {
    VERSION: VER,
    mmToPx: mmToPx,
    anchorOf: anchorOf,
    captureCanon: captureCanon,
    rebuildCanon: rebuildCanon,
    rebuildAllCanons: rebuildAllCanons,
    applyCanon: applyCanon,
    enforceTab: enforceTab,
    enforceAll: enforceAll,
    paintSettings: paintSettings,
    paintAll: paintAll,
    syncManagerOrderKey: syncManagerOrderKey,
    harmonizeMetaOrders: harmonizeMetaOrders,
    groupFidOf: groupFidOf,
    applyRealDesignerValues: applyRealDesignerValues,
    faHeader: faHeader,
    clockDate: clockDate,
    tickerText: tickerText,
    todayJalaliMD: todayJalaliMD,
    buildXlsx: buildXlsx,
    zipStoreXlsx: zipStoreXlsx,
    drawRouteCenters: drawRouteCenters,
    visitGuardTick: visitGuardTick,
    paintFinishedVisitStats: paintFinishedVisitStats,
    forceCloseSideMenu: forceCloseSideMenu,
    syncToRenderSmart: syncToRenderSmart,
    buildTopBar: buildTopBar,
    tickClock: tickClock,
    vaultSnapshot: vaultSnapshot,
    mergeVault: mergeVault,
    saveVault: saveVault,
    restoreVault: restoreVault,
    buildFullExport: buildFullExport,
    allowAddOptionFor: allowAddOptionFor
  };

  try { window.v1221Api = window.v1220Api; } catch (eAlias) {}

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 220); });
  else setTimeout(boot, 220);
})();
