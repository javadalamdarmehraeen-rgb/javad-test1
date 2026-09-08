/* ============================================================================
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

  var VER = String(window.CRM_APP_VERSION || "12.20.0");

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
    return moves;
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

  function tickClock() {
    try {
      var t = $("crmClockTime"), d = $("crmClockDate");
      if (!t || !d) { buildTopBar(); return; }
      var now = new Date();
      var time = fa2la(now.toLocaleTimeString("en-GB", { hour12: false }));
      var date;
      try {
        date = fa2la(now.toLocaleDateString("fa-IR", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        }));
      } catch (eD) { date = fa2la(now.toLocaleDateString("en-GB")); }
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
  var EXPORT_BASE = {
    pharmacy: {
      file: "pharmacies-full-export.csv", arr: "pharmacies", tab: "tab-pharmacies",
      cols: [["name", "نام داروخانه"], ["phone", "تلفن"], ["mobile", "همانه"], ["province", "استان"], ["city", "شهر"], ["district", "منطقه"], ["address", "آدرس"], ["plate", "پلاک"], ["floor", "طبقه"], ["type", "نوع"], ["specialty", "تخصص"], ["repName", "نماینده علمی"], ["isPercentage", "درصدی"], ["createdAt", "تاریخ ثبت"]]
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
    extra.forEach(function (k) { headers.push(k.indexOf("cf:") === 0 ? k.slice(3) : k); });

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
    buildTopBar: buildTopBar,
    tickClock: tickClock,
    vaultSnapshot: vaultSnapshot,
    mergeVault: mergeVault,
    saveVault: saveVault,
    restoreVault: restoreVault,
    buildFullExport: buildFullExport,
    allowAddOptionFor: allowAddOptionFor
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 220); });
  else setTimeout(boot, 220);
})();
