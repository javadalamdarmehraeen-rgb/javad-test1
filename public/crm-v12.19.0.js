/* ============================================================================
   crm-v12.19.0.js — لایهٔ پایانیِ نسخهٔ 12.19.0 (نوبت ۱۴۳)
   ----------------------------------------------------------------------------
   این فایل «آخرین» اسکریپتِ برنامه است (پس از crm-bundle.js) و فقط هفت کارِ
   درخواست‌شدهٔ کاربر را انجام می‌دهد؛ هیچ بخشِ دیگری از برنامه بازنویسی نشده:

   ۱) ساعت و تاریخِ روز در بالای صفحه، با فاصلهٔ کم از هم (دو برچسبِ جدا).
   ۲) نسخهٔ برنامه بالای کادرِ آبی‌رنگِ وضعیت (هدر مرتب: ساعت ← نسخه ← کادرِ آبی).
   ۳) «قفلِ چیدمان»: جای فیلدها فقط با CSS order ثابت می‌شود و پس از هر تغییرِ
      DOM (پاک‌کردن فرم، اجرای موتورِ ورود، pullِ همگام، رندرِ دوباره) دوباره
      همان شمارهٔ ترتیبِ ذخیره‌شده برقرار می‌شود. هیچ جابه‌جاییِ DOM انجام
      نمی‌شود، پس فیلدها دیگر لحظه‌ای زیرِ کادرها نمی‌پرند.
   ۴) تنظیماتِ تبِ «ستون‌ها و کالاها» واقعاً اعمال می‌شوند: شمارهٔ ترتیب،
      عرض، ارتفاع، فاصلهٔ پیش/پس (میلی‌متر)، شمارهٔ سطر، جای فیلد
      (روبرو/زیرِ هم)، ستارهٔ الزام، نمایش در فرم و «وابسته به فیلد».
   ۵) برداشتنِ تیکِ «افزودن لحظه‌ای گزینه» = حذفِ واقعیِ دکمهٔ افزودنِ لحظه‌ای
      برای همان فیلد (هم پنهان‌سازی، هم بستنِ کلیک در فازِ capture).
   ۶) خروجیِ اکسلِ هر تب = «همهٔ» اطلاعاتِ همان تب (ستون‌های ثابت + همهٔ
      فیلدهای سفارشی + هر کلیدِ دیگری که روی رکورد ذخیره شده است).
   ۷) ساعت و برچسب‌ها عرضِ ثابت دارند تا تپشِ ثانیه‌شمار اندازهٔ فیلدها و
      چیدمانِ صفحه را تغییر ندهد (ریشهٔ «پرشِ صفحات»).
   ============================================================================ */
(function () {
  "use strict";
  if (window.__CRM_V12190) return;
  window.__CRM_V12190 = true;

  var VER = String(window.CRM_APP_VERSION || "12.19.0");

  /* تب‌هایی که طراحِ فیلد دارند (همان چهار تبِ تبِ «ستون‌ها و کالاها») */
  var TAB_KEY = {
    "tab-pharmacies": "pharmacy",
    "tab-doctors": "doctor",
    "tab-orders": "order",
    "tab-columns-products": "products"
  };
  var TABS = Object.keys(TAB_KEY);

  function $(id) { try { return document.getElementById(id); } catch (e) { return null; } }
  function num(v, d) { var n = Number(v); return isFinite(n) ? n : d; }
  function toast(msg) { try { if (typeof window.v20Toast === "function") window.v20Toast(msg); } catch (e) {} }

  /* رقم‌های فارسی/عربی → لاتین (یک‌دستی با «قانونِ رقمِ لاتینِ» ۱۲.۱۸) */
  function fa2la(s) {
    return String(s == null ? "" : s)
      .replace(/[\u06F0-\u06F9]/g, function (d) { return String.fromCharCode(d.charCodeAt(0) - 1728); })
      .replace(/[\u0660-\u0669]/g, function (d) { return String.fromCharCode(d.charCodeAt(0) - 1584); });
  }

  /* ══ ۱ و ۲) ساعت + تاریخ در بالای صفحه؛ نسخهٔ برنامه بالای کادرِ آبی ══════════ */
  function ensureHeaderChrome() {
    try {
      var actions = document.querySelector(".app-header .header-actions");
      if (!actions) return;

      /* ستونِ «نسخه ← کادرِ آبی» */
      var stack = $("crmHeaderStack");
      if (!stack) {
        stack = document.createElement("div");
        stack.id = "crmHeaderStack";
        stack.className = "crm-header-stack";
        actions.insertBefore(stack, actions.firstChild);
      }
      var badge = $("crmBuildBadge");
      if (badge && badge.parentNode !== stack) stack.appendChild(badge);
      var pill = actions.querySelector(".header-user-pill");
      if (pill && pill.parentNode !== stack) stack.appendChild(pill);
      try { badge && badge.setAttribute("title", "نسخهٔ برنامه " + VER + " — آخرین ZIP هر بار از پورت ۸۰۰۰ هاستِ پیش‌نمایش"); } catch (eT) {}

      /* ساعت و تاریخ (دو برچسبِ جدا با فاصلهٔ کم) */
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
        actions.insertBefore(clock, stack);
      }
    } catch (e) {}
  }

  function tickClock() {
    try {
      var t = $("crmClockTime"), d = $("crmClockDate");
      if (!t || !d) { ensureHeaderChrome(); return; }
      var now = new Date();
      var time = fa2la(now.toLocaleTimeString("en-GB", { hour12: false }));
      var date;
      try {
        date = fa2la(now.toLocaleDateString("fa-IR", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        }));
      } catch (eD) { date = fa2la(now.toLocaleDateString("en-GB")); }
      /* فقط وقتی متن عوض شده بنویس — نوشتنِ بی‌اثر، ناظرهایِ چیدمان را بیدار می‌کند */
      if (t.textContent !== time) t.textContent = time;
      if (d.textContent !== date) d.textContent = date;
    } catch (e) {}
  }

  /* ══ ۳ و ۴) قفلِ چیدمان + اعمالِ واقعیِ تنظیماتِ طراح ════════════════════════ */
  var bucketSeq = 0;
  function bucketId(node) {
    if (!node.__v12190b) node.__v12190b = "b" + (++bucketSeq);
    return node.__v12190b;
  }

  function fieldRankMap(tabId) {
    var list = [];
    try { list = (typeof window.getUnifiedFieldList === "function") ? (window.getUnifiedFieldList(tabId) || []) : []; } catch (e) { return null; }
    if (!list.length) return null;
    var arr = list.filter(function (f) { return f && f.id && f.kind !== "ordercol"; });
    arr.sort(function (a, b) {
      var ao = num(a.order, 999), bo = num(b.order, 999);
      if (ao !== bo) return ao - bo;
      return String(a.id).localeCompare(String(b.id));
    });
    var rank = {}, byId = {};
    arr.forEach(function (f, i) { rank[String(f.id)] = i + 1; byId[String(f.id)] = f; });
    return { rank: rank, byId: byId, list: arr };
  }

  function groupOfField(pane, f) {
    var el = null;
    try { el = document.getElementById(f.id); } catch (e) {}
    if (!el && pane && pane.querySelector) {
      try { el = pane.querySelector('[data-custom-field-id="' + String(f.id).replace(/"/g, "") + '"]'); } catch (e2) {}
    }
    if (!el || !el.closest) return null;
    return el.closest(".form-group");
  }

  function setStyle(node, prop, val, prio) {
    try {
      var cur = node.style.getPropertyValue(prop) || "";
      if (cur === String(val == null ? "" : val)) return 0;
      if (val === "" || val == null) node.style.removeProperty(prop);
      else node.style.setProperty(prop, String(val), prio || "");
      return 1;
    } catch (e) { return 0; }
  }

  /* «وابسته به فیلد»: تا وقتی فیلدِ مرجع خالی است، این فیلد نشان داده نمی‌شود */
  function applyDepends(pane, info, writes) {
    info.list.forEach(function (f) {
      var dep = String(f.dependsOn || "").trim();
      var g = f.__v12190g || groupOfField(pane, f);
      if (!g) return;
      if (!dep) { writes.n += setStyle(g, "display", g.getAttribute("data-col-hidden") === "1" ? "none" : ""); return; }
      var host = null;
      try { host = document.getElementById(dep); } catch (e) {}
      if (!host && pane.querySelector) { try { host = pane.querySelector('[data-custom-field-id="' + dep.replace(/"/g, "") + '"]'); } catch (e2) {} }
      var on = !!(host && String(host.value || "").trim() !== "");
      writes.n += setStyle(g, "display", on ? "" : "none", "important");
    });
  }

  /* بستنِ «افزودن لحظه‌ای» برای فیلدهایی که تیکشان برداشته شده */
  function sweepInstantAdd(info, writes) {
    info.list.forEach(function (f) {
      if (f.allowAddOption !== false) return;
      var g = f.__v12190g;
      if (!g || !g.querySelectorAll) return;
      Array.prototype.forEach.call(g.querySelectorAll(".btn-instant-add, .v20-addopt"), function (b) {
        if (b.dataset.v12190off === "1") return;
        b.dataset.v12190off = "1";
        try { b.hidden = true; b.style.setProperty("display", "none", "important"); } catch (e) {}
        writes.n += 1;
      });
    });
  }

  function lockTab(tabId) {
    var pane = $(tabId);
    if (!pane) return 0;
    var info = fieldRankMap(tabId);
    if (!info) return 0;
    var writes = { n: 0 };

    /* الف) نشاندنِ تنظیماتِ طراح روی هر فیلد (عرض/ارتفاع/جای فیلد/فاصله‌ها/الزام/نمایش) */
    var items = [];
    info.list.forEach(function (f) {
      var g = groupOfField(pane, f);
      if (!g) return;
      f.__v12190g = g;
      items.push({ f: f, g: g });
      try { if (typeof window.paintFieldBox === "function") window.paintFieldBox(g, f); } catch (e) {}
      try { if (typeof window.paintRequiredStar === "function") window.paintRequiredStar(g, f); } catch (e2) {}
    });

    /* ب) قفلِ جای فیلدها: فقط CSS order — بدونِ هیچ جابه‌جاییِ DOM */
    var buckets = {};
    items.forEach(function (it) {
      var p = it.g.parentNode;
      if (!p) return;
      var k = bucketId(p);
      if (!buckets[k]) buckets[k] = { p: p, items: [] };
      buckets[k].items.push(it);
    });

    var anyRowNo = items.some(function (it) { return num(it.f.rowNo, 0) > 0; });

    Object.keys(buckets).forEach(function (k) {
      var b = buckets[k];
      b.items.sort(function (a, c) { return info.rank[String(a.f.id)] - info.rank[String(c.f.id)]; });

      b.items.forEach(function (it, i) {
        writes.n += setStyle(it.g, "order", i + 1, "important");
      });

      /* ج) «شمارهٔ سطر»: فیلدهای هم‌شماره در یک سطر می‌مانند */
      var isGrid = !!(b.p.classList && b.p.classList.contains("form-grid"));
      if (isGrid) {
        var row = 0, maxRow = 0;
        b.items.forEach(function (it) {
          var under = (it.f.place === "under");
          var rn = num(it.f.rowNo, 0);
          if (under) row = Math.max(row, maxRow) + 1;
          else if (rn > 0) row = rn;
          else row = (row || 0) + 1;
          if (row > maxRow) maxRow = row;
          writes.n += setStyle(it.g, "grid-row", anyRowNo ? row : "", "important");
        });
        /* «جای فیلد در صفحه»: زیرِ هم = تمامِ عرضِ سطر */
        b.items.forEach(function (it) {
          if (it.f.place === "under") writes.n += setStyle(it.g, "grid-column", "1 / -1", "important");
        });
      }
    });

    applyDepends(pane, info, writes);
    sweepInstantAdd(info, writes);
    return writes.n;
  }

  function lockAllTabs() {
    var n = 0;
    TABS.forEach(function (t) { try { n += lockTab(t); } catch (e) {} });
    return n;
  }

  /* ══ ۵) کلیکِ «افزودن لحظه‌ای» برای فیلدِ بدونِ تیک = بسته ═══════════════════ */
  function allowAddOptionFor(fieldId) {
    if (!fieldId) return true;
    for (var i = 0; i < TABS.length; i++) {
      var info = fieldRankMap(TABS[i]);
      if (!info) continue;
      var f = info.byId[String(fieldId)];
      if (f) return f.allowAddOption !== false;
    }
    return true;
  }

  function fieldIdOfInput(inp) {
    if (!inp) return "";
    try {
      return String(inp.getAttribute && inp.getAttribute("data-custom-field-id") ? inp.getAttribute("data-custom-field-id") : (inp.id || ""));
    } catch (e) { return ""; }
  }

  /* ══ ۶) خروجیِ اکسل: همهٔ اطلاعاتِ همان تب ══════════════════════════════════ */
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

  function buildFullExport(entity) {
    var cfg = EXPORT_BASE[entity];
    var S = window.state || {};
    var recs = S[cfg.arr] || [];
    var headers = cfg.cols.map(function (c) { return c[1]; });
    var taken = {};
    cfg.cols.forEach(function (c) { taken[c[0]] = 1; });

    /* الف) همهٔ فیلدهای سفارشیِ همان تب (با ترتیبِ شمارهٔ ترتیبِ لیست) */
    var customs = [];
    try {
      var info = fieldRankMap(cfg.tab);
      if (info) {
        customs = info.list.filter(function (f) { return !f.builtin; });
      }
    } catch (e) {}
    if (!customs.length) customs = (((S.customFields || {})[entity]) || []).slice();
    customs.sort(function (a, b) { return num(a.listOrder, num(a.order, 999)) - num(b.listOrder, num(b.order, 999)); });
    customs.forEach(function (f) {
      if (!f || !f.id || taken[f.id]) return;
      taken[f.id] = 1;
      taken["cf:" + (f.label || f.id)] = 1; /* جلوگیری از ستونِ تکراری با کلیدِ customFields */
      headers.push(f.label || f.id);
    });

    /* ب) هر کلیدِ دیگری که روی رکوردها ذخیره شده (چیزی از قلم نیفتد) */
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

    /* ج) ردیف‌ها */
    var rows = recs.map(function (r) {
      var out = [];
      cfg.cols.forEach(function (c) { out.push(cellText(r ? r[c[0]] : "")); });
      customs.forEach(function (f) {
        var v = "";
        if (r && r.customFields) v = (r.customFields[f.label] != null) ? r.customFields[f.label] : (r.customFields[f.id] != null ? r.customFields[f.id] : "");
        if ((v === "" || v == null) && typeof window.builtinFieldValue === "function") {
          try { v = window.builtinFieldValue(entity, f.id, r) || ""; } catch (e) {}
        }
        out.push(cellText(v === "—" ? "" : v));
      });
      extra.forEach(function (k) {
        var v = "";
        if (k.indexOf("cf:") === 0) v = (r && r.customFields) ? r.customFields[k.slice(3)] : "";
        else v = r ? r[k] : "";
        out.push(cellText(v));
      });
      return out;
    });

    return { file: cfg.file, headers: headers, rows: rows, count: recs.length };
  }

  /* ══ راه‌اندازی ═══════════════════════════════════════════════════════════ */
  function boot() {
    ensureHeaderChrome();
    tickClock();

    /* ثانیه‌شمار: هر ثانیه، فقط نوشتنِ متفاوت (عرضِ ثابت = بدونِ پرشِ چیدمان) */
    setInterval(tickClock, 1000);

    /* قفلِ چیدمان: نخستین اعمال، سپس نگهبانِ سبک */
    lockAllTabs();
    setInterval(function () {
      try { if (document.hidden) return; } catch (e) {}
      try { lockAllTabs(); } catch (e) {}
    }, 1200);

    /* پس از هر تغییرِ DOM در فرم‌ها (پاک‌کردن، اجرای موتور، pullِ همگام، رندرِ دوباره) */
    try {
      if (window.MutationObserver) {
        var pending = 0;
        var mo = new MutationObserver(function () {
          if (pending) return;
          pending = setTimeout(function () { pending = 0; try { lockAllTabs(); } catch (e) {} }, 180);
        });
        TABS.forEach(function (t) {
          var pane = $(t);
          if (pane) { try { mo.observe(pane, { childList: true, subtree: true }); } catch (e) {} }
        });
      }
    } catch (eMO) {}

    /* کلیکِ «افزودن لحظه‌ای» روی فیلدِ بدونِ تیک → بسته (فازِ capture، پیش ازِ همه) */
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
          toast("«افزودن لحظه‌ای گزینه» برای این فیلد در تبِ ستون‌ها و کالاها خاموش است.");
        }
      }, true);
    } catch (eIA) {}

    /* خروجیِ اکسلِ کامل — روی window در فازِ capture تا پیش ازِ لایهٔ ۱۲.۱۸ اجرا شود */
    try {
      window.addEventListener("click", function (e) {
        var t = e.target;
        var btn = t && t.closest ? t.closest("#btnExportPharmaciesCSV,#btnExportDoctorsCSV,#btnExportOrdersCSV") : null;
        if (!btn || !EXPORT_BTN[btn.id]) return;
        try { e.preventDefault(); e.stopImmediatePropagation(); } catch (e2) {}
        var entity = EXPORT_BTN[btn.id];
        var out = buildFullExport(entity);
        if (typeof window.downloadCSVFile === "function") {
          window.downloadCSVFile(out.file, out.headers, out.rows);
        }
        toast("خروجی کاملِ تب: " + out.count + " سطر × " + out.headers.length + " ستون (همهٔ اطلاعاتِ تب).");
      }, true);
    } catch (eEX) {}

    /* پس از کلیکِ «پاک‌کردن» و «اجرای موتور» هم چیدمان فوراً برگردد */
    try {
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (!t.closest("#crmEngineRunBtn,[data-crm-engine-run],#v60ClearPh,#v60ClearDoc,#v60ClearOrd,.btn-clear-form,[id^='v60Clear']")) return;
        setTimeout(function () { try { lockAllTabs(); } catch (e) {} }, 120);
        setTimeout(function () { try { lockAllTabs(); } catch (e) {} }, 700);
      }, true);
    } catch (eRS) {}
  }

  window.v1219Api = {
    VERSION: VER,
    lockAllTabs: lockAllTabs,
    lockTab: lockTab,
    buildFullExport: buildFullExport,
    allowAddOptionFor: allowAddOptionFor,
    ensureHeaderChrome: ensureHeaderChrome,
    tickClock: tickClock
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 250); });
  else setTimeout(boot, 250);
})();
