// ============================================================
// v20 (نسخه 11.16.0) — لایه آخر؛ فقط افزودنی/بازنویسی امن، بدون حذف اسکلت
// ۱) در دسترس بودن state برای عیب‌یابی
// ۲) تکراری‌گیر دقیق: اطلاعات کاملاً یکسان ⇒ قفل کامل (فقط ویرایش) — نزدیک ⇒ تأیید/انصراف
// ۳) مدیر پیشرفته کشویی‌ها در تب افزودن‌ها: زیرمجموعه‌ها زیر هم + ویرایش/حذف هرکدام
//    + جستجوی لحظه‌ای + نام فارسی + اعمال فوری افزودن/حذف فیلد کشویی
// ۴) زنجیره طوسی فیلدها (غیرفعال تا پر شدن والد) + تنظیم توسط مدیر + کلید کلی
// ۵) قفل طوسی فرم سفارش تا انتخاب/جایگذاری داروخانه (فقط بخش کالا فعال می‌ماند)
// ۶) افزودن لحظه‌ای نام داروخانه در فرم داروخانه = ذخیره خودکار رکورد
// ۷) همگام‌سازی خودکار فیلدهای افزوده/حذف‌شده داروخانه ↔ سفارشات
// ۸) رفع نقص ورود فیلد جدید به باکس کالا + اعمال اندازه و شماره ترتیب
// ۹) اعمال قطعی «شماره ترتیب لیست» روی جدول‌ها (ردیف=ستون ۱، نام نماینده=ستون ۲)
// ۱۰) دکمه «تغییر رمز» بالای همه صفحه‌ها برای هر کاربر (ثبت در سیستم ورود)
// ۱۱) سطوح دسترسی آماده: نماینده علمی / کارشناس فروش / سرپرست
// ۱۲) حذف فلش‌های بالا/پایین اعداد تعداد کالا و جایزه در سفارش
// ============================================================
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // نرمال‌سازی برای مقایسه دقیق (ارقام فارسی/عربی، یکسان‌سازی حروف، حذف فاصله و خط‌تیره)
  function norm(v) {
    var FA = "۰۱۲۳۴۵۶۷۸۹", AR = "٠١٢٣٤٥٦٧٨٩";
    return String(v == null ? "" : v)
      .replace(/[۰-۹]/g, function (c) { return String(FA.indexOf(c)); })
      .replace(/[٠-٩]/g, function (c) { return String(AR.indexOf(c)); })
      .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ")
      .replace(/[\s\-ـ]+/g, "").trim().toLowerCase();
  }
  function st() { return window.state || null; }
  function save() { try { if (typeof saveState === "function") saveState(); } catch (e) {} }
  window.__CRM_BULK_READY = !window.indexedDB;
  function log(m) { try { console.log("[v20]", m); } catch (e) {} }

  /* ---------- ۱) state برای عیب‌یابی ---------- */
  try {
    Object.defineProperty(window, "state", {
      configurable: true,
      get: function () {
        try { return (typeof state !== "undefined") ? state : undefined; } catch (e) { return undefined; }
      }
    });
  } catch (e) {}

  /* ---------- ۱۲+۴+۵) استایل‌های تزریقی ---------- */
  (function injectCss() {
    var css =
      "#orderItemsContainer input[type=number]::-webkit-outer-spin-button," +
      "#orderItemsContainer input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}" +
      "#orderItemsContainer input[type=number]{-moz-appearance:textfield;appearance:textfield;}" +
      ".v20-grey,.v20-grey:disabled{background:#e5e7eb!important;color:#6b7280!important;" +
      "cursor:not-allowed!important;opacity:.85!important;border-color:#d1d5db!important;}" +
      ".crm-combo.v20-locked{pointer-events:none;}" +
      ".v20-grey-zone{background:#e5e7eb!important;border:1px solid #cbd5e1!important;border-radius:10px!important;padding:8px!important;box-sizing:border-box!important}.v20-grey-zone .form-label{color:#6b7280!important}.v20-grey-zone input,.v20-grey-zone select,.v20-grey-zone .crm-combo{background:#e5e7eb!important;color:#6b7280!important;}" +
      "#addTabPanel>.v20-addmgr{grid-column:1/-1!important;width:100%!important;display:block!important;}" +
      "#addTabPanel>.add-panel-head,#addTabPanel>.add-sel-card,#addTabPanel>p.col-help{display:none!important;}" +
      ".v20-cards{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))!important;gap:12px;align-items:start;width:100%;}" +
      ".v20-combo-card{min-width:0!important;width:auto!important;margin:0!important;}" +
      "@media(max-width:620px){.v20-cards{grid-template-columns:1fr!important;}}" +
      ".v20-local-match{position:absolute!important;top:calc(100% + 6px);right:0;z-index:80;margin:0!important;min-width:min(560px,90vw);max-width:90vw;width:max-content!important;box-sizing:border-box;box-shadow:0 5px 18px rgba(15,23,42,.16);flex-wrap:wrap;}" +
      ".v20-visit-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:12px 0;}" +
      ".v20-metric{background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:12px;text-align:center}.v20-metric b{display:block;font-size:1.2rem;color:#0f766e;margin-top:4px;}" +
      ".v20-version{background:#312e81;color:#fff;border-radius:999px;padding:5px 10px;font-weight:800;white-space:nowrap;}" +
      "#v20ChpassFab{background:#0d9488;color:#fff;border:none;border-radius:10px;padding:8px 14px;" +
      "font-weight:700;cursor:pointer;font-family:inherit;font-size:.85rem;margin:0 6px;vertical-align:middle;}" +
      "#v20ChpassFab:hover{background:#0f766e;}" +
      ".v20-toast{position:fixed;bottom:24px;right:24px;background:#065f46;color:#fff;padding:12px 20px;" +
      "border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.3);z-index:1400;font-weight:700;direction:rtl;}" +
      ".v20-modal{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:1300;display:flex;" +
      "align-items:center;justify-content:center;}" +
      ".v20-modal-card{background:#fff;border-radius:14px;padding:22px;min-width:300px;max-width:92vw;" +
      "box-shadow:0 10px 40px rgba(0,0,0,.35);direction:rtl;}" +
      ".v20-modal-card input{width:100%;margin:6px 0;padding:9px;border:1px solid #cbd5e1;border-radius:8px;box-sizing:border-box;}" +
      ".v20-opt-row{display:flex;align-items:center;gap:6px;padding:5px 8px;border:1px solid #e2e8f0;" +
      "border-radius:8px;margin-top:5px;background:#fff;}" +
      ".v20-opt-row span{flex:1;}" +
      ".v20-opt-row button{border:1px solid #cbd5e1;background:#f8fafc;border-radius:7px;cursor:pointer;padding:2px 8px;}" +
      ".v20-combo-card{border:1px solid #dbe2ea;border-radius:12px;padding:12px;background:#fbfdff;}" +
      ".v20-combo-card h5{margin:0 0 8px;color:#0f172a;}" +
      ".v20-card-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;}" +
      ".v20-card-tools input[type=text]{flex:1;min-width:140px;padding:8px;border:1px solid #cbd5e1;border-radius:8px;}" +
      ".v20-mini{font-size:.78rem;color:#64748b;}" +
      ".v20-tabbar{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;}" +
      ".v20-tabbar button{border:1px solid #cbd5e1;background:#fff;border-radius:9px;padding:7px 14px;cursor:pointer;font-family:inherit;}" +
      ".v20-tabbar button.v20-on{background:#0d9488;color:#fff;border-color:#0d9488;}" +
      "button[id*='Export'],button[id*='Excel'],.btn-excel{background:#15803d!important;border-color:#15803d!important;color:#fff!important;}" +
      "button.btn-danger,button[id*='Delete'],button[class*='-del']{background:#dc2626!important;border-color:#dc2626!important;color:#fff!important;}" +
      "#tab-snapp-corporate .data-table{min-width:900px}#tab-snapp-corporate .card{overflow:visible}" +
      ".v20-share-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:7px}.v20-share-item{display:grid;grid-template-columns:22px 1fr 58px;align-items:center;gap:6px;background:#f8fafc;border:1px solid #e2e8f0;padding:7px;border-radius:8px}.v20-share-order{width:55px;padding:4px}" +
      "#tab-snapp-corporate .form-grid,#tab-search-info .form-grid,#tab-rep-homes .form-grid,#tab-leaves .form-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))!important;gap:14px!important;align-items:start}#tab-snapp-corporate .form-group,#tab-search-info .form-group,#tab-rep-homes .form-group,#tab-leaves .form-group{width:auto!important;max-width:100%!important;min-width:0!important}" +
      "#formCustomField #cfTargetEntity{display:none!important}#formCustomField #cfTargetEntity~*{display:none!important}#formCustomField .form-group:has(#cfTargetEntity){display:none!important}" +
      ".tab-pane .form-grid>.form-group{align-self:start!important;transform:none!important;transition:none!important}.tab-pane .crm-combo,.tab-pane .crm-combo-input{transform:none!important;transition:none!important}" +
      "#formOrder>.form-grid>.form-group:not(.full-width),#formPharmacy>.form-grid>.form-group:not(.full-width),#formDoctor>.form-grid>.form-group:not(.full-width){align-self:start!important}" +
      ".data-table{border-collapse:collapse!important}.data-table th,.data-table td{border:1px solid #94a3b8!important;padding:7px!important}" +
      "#tab-distributor-sales #distributorActionGrid,#tab-distributor-database #distributorDatabaseGrid{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))!important;gap:10px!important}#tab-distributor-sales #distributorFilterGrid{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:10px!important}#tab-distributor-sales .v20-combo-card{padding:10px!important}#tab-distributor-sales .v20-card-tools .btn{padding:7px 9px!important;font-size:.78rem!important}" +
      "@media(max-width:768px){html,body{max-width:100%!important;overflow-x:hidden!important}.app-nav{display:none!important}.btn-menu-hamburger{display:flex!important;visibility:visible!important}.header-container{padding:7px 9px!important;gap:6px!important;flex-wrap:nowrap!important}.logo-area{min-width:0!important;flex:1!important}.logo-icon{width:38px!important;height:38px!important;min-width:38px!important}.logo-text{min-width:0!important}.logo-text h1{font-size:.82rem!important;white-space:normal!important;line-height:1.35!important}.logo-text p{font-size:.65rem!important}.header-actions{gap:4px!important;flex:0 0 auto!important}.header-user-pill,.btn-header-icon,#v20VersionBadge,#v20ChpassFab{display:none!important}.btn-header-logout{padding:7px!important;font-size:.72rem!important}.main-content,.app-main,.container{width:100%!important;max-width:100%!important;padding:8px!important;margin:0!important;box-sizing:border-box!important}.tab-pane,.card{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}.card{padding:10px!important;margin:8px 0!important;border-radius:10px!important}.card-header{gap:8px!important;align-items:flex-start!important;flex-direction:column!important}.card-title{font-size:.95rem!important}.form-grid,.form-grid.form-grid-sized{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important;width:100%!important}.form-grid>.form-group,.form-grid.form-grid-sized>.form-group,.form-group,.full-width,.col-place-beside,.col-place-under{grid-column:1!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;box-sizing:border-box!important}.form-input,.form-select,textarea,.crm-combo,.crm-combo-input,.jalali-input-wrapper{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}.btn,.card-header button,.card-header label.btn{max-width:100%!important;white-space:normal!important;min-height:40px!important}.table-responsive{display:block!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}.data-table{width:max-content!important;min-width:700px!important}.order-item-row{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:7px!important}.order-item-row>*{width:100%!important;max-width:100%!important}.map-container,.map-container-large{width:100%!important;height:340px!important;max-width:100%!important}.side-menu-drawer{width:min(88vw,340px)!important;max-width:88vw!important}.modal-content,.modal-card,.v20-modal-card{width:94vw!important;max-width:94vw!important;max-height:90vh!important;overflow:auto!important}.v20-visit-metrics,.stats-grid,.v20-cards{grid-template-columns:minmax(0,1fr)!important}#v20SnappActionBar{position:static!important;display:grid!important;grid-template-columns:1fr!important}#v20SnappActionBar .btn{width:100%!important;max-width:100%!important}.jalali-calendar-popup{max-width:calc(100vw - 16px)!important;left:8px!important;right:8px!important}.ph-pick-overlay,.v20-local-match{position:fixed!important;left:8px!important;right:8px!important;top:auto!important;bottom:8px!important;width:auto!important;max-width:none!important}.manual-design-canvas,.man-canvas{max-width:100%!important;overflow:auto!important}}";
    var tag = document.createElement("style");
    tag.id = "v20Style";
    tag.textContent = css;
    (document.head || document.documentElement).appendChild(tag);
  })();

  /* ---------- ۲) تکراری‌گیر دقیق ---------- */
  function dupPairs(isDoc) {
    return isDoc
      ? [["name", "doctorName"], ["phone", "doctorPhone"], ["specialty", "doctorSpecialty"],
         ["province", "doctorProvince"], ["city", "doctorCity"], ["district", "doctorDistrict"], ["address", "doctorAddress"]]
      : [["name", "pharmacyName"], ["phone", "pharmacyPhone"], ["manager", "pharmacyManager"],
         ["province", "pharmacyProvince"], ["city", "pharmacyCity"], ["district", "pharmacyDistrict"], ["address", "pharmacyAddress"]];
  }
  function gvById(id) { var e = $(id); return e ? String(e.value || "") : ""; }
  function v20SigOf(kind) {
    var isDoc = kind === "doctor";
    var parts = dupPairs(isDoc).map(function (p) { return norm(gvById(p[1])); });
    return kind + "|" + parts.join("|");
  }
  window.v20DupGate = function (kind) {
    try {
      var isDoc = kind === "doctor";
      var S = st(); if (!S) return true;
      var list = isDoc ? (S.doctors || []) : (S.pharmacies || []);
      var pairs = dupPairs(isDoc);
      var draft = {};
      pairs.forEach(function (p) { draft[p[0]] = norm(gvById(p[1])); });
      // رکوردی که همین الان در حال ویرایشش هستیم از بررسی تکراری خارج می‌شود
      var editEl = $(isDoc ? "doctorEditId" : "pharmacyEditId");
      var editingId = editEl ? String(editEl.value || "") : "";
      var title = isDoc ? "پزشک/مطب" : "داروخانه";
      var listFa = isDoc ? "پزشکان" : "داروخانه‌ها";
      var exact = null, partial = false;
      list.forEach(function (r) {
        if (editingId && String(r.id) === editingId) return;
        var allSame = true, anyVal = false;
        pairs.forEach(function (p) {
          var a = draft[p[0]];
          var b = norm(r[p[0]] == null ? "" : r[p[0]]);
          if (a) anyVal = true;
          if (a !== b) allSame = false;
        });
        if (allSame && anyVal && draft.name) exact = r;
        if (draft.name && norm(r.name) === draft.name) partial = true;
        if (draft.phone && norm(r.phone || "") === draft.phone) partial = true;
      });
      if (exact) {
        var sig = v20SigOf(kind);
        if (window._v20AutoSaveSig === sig && (Date.now() - (window._v20AutoSaveT || 0)) < 120000) {
          alert("✔ این " + title + " همین چند لحظه پیش با موفقیت ثبت شد؛ نیازی به ثبت دوباره نیست.");
          return false;
        }
        alert("⛔ این " + title + " قبلاً با دقیقاً همین اطلاعات ثبت شده است" +
          (exact.repName ? " (توسط «" + exact.repName + "»)" : "") +
          ".\n\nثبت مجدد مجاز نیست؛ برای تغییر، از لیست «" + listFa + "» دکمه ✏️ ویرایش همان رکورد را بزنید.");
        return false;
      }
      if (partial) {
        return window.confirm("هشدار: " + title + (isDoc ? "ی" : "‌ای") + " با این نام یا تلفن قبلاً ثبت شده است.\n\nتأیید/بله = با این حال ذخیره شود  |  انصراف/خیر = ذخیره نشود");
      }
      return true;
    } catch (e) {
      return true;
    }
  };

  /* ---------- ۳) مدیر کشویی‌های افزودن‌ها ---------- */
  var V20_PANES = [
    ["tab-pharmacies", "🏥 داروخانه‌ها"],
    ["tab-doctors", "👨‍⚕️ پزشکان"],
    ["tab-orders", "📦 سفارشات"],
    ["tab-snapp-corporate", "🚕 اسنپ سازمانی"],
    ["tab-columns-products", "💊 کالاها"],
    ["tab-users-permissions", "👤 کاربران"]
  ];
  var v20AddPane = "tab-pharmacies";

  var V20_FA_IDS = {
    pharmacyName: "نام داروخانه", pharmacyProvince: "استان", pharmacyCity: "شهر", pharmacyDistrict: "منطقه",
    pharmacyType: "نوع داروخانه", pharmacyCategory: "نوع داروخانه", pharmacyIsPercentage: "وضعیت درصدی داروخانه", pharmacyPhone: "تلفن داروخانه",
    pharmacyAddress: "آدرس دقیق داروخانه", pharmacyManager: "نام مسئول داروخانه",
    doctorName: "نام پزشک", doctorSpecialty: "تخصص پزشک", doctorProvince: "استان", doctorCity: "شهر", doctorDistrict: "منطقه",
    doctorPhone: "تلفن پزشک", doctorAddress: "آدرس دقیق مطب", doctorIsPercentage: "وضعیت درصدی پزشک",
    orderPharmacyName: "نام داروخانه", orderProvince: "استان", orderCity: "شهر", orderDistrict: "منطقه",
    orderRepName: "نام نماینده", orderStatus: "وضعیت سفارش", orderDate: "تاریخ سفارش",
    cfTargetEntity: "تب مربوطه", cfType: "نوع فیلد"
  };
  function faLabel(el, pane) {
    var lab = (pane && el.id) ? pane.querySelector('label[for="' + el.id + '"]') : null;
    var t = lab ? lab.textContent : "";
    if (!t) {
      var g = el.closest ? el.closest(".form-group") : null;
      var l2 = g ? g.querySelector(".form-label, label") : null;
      if (l2) t = l2.textContent;
    }
    if (!t && el.getAttribute) t = el.getAttribute("placeholder") || "";
    t = String(t || "").replace(/\*/g, "").replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
    // اگر برچسب خالی یا انگلیسی بود، از واژه‌نامه فارسی استفاده شود
    if (!t || /^[A-Za-z0-9_\-\s]+$/.test(t)) t = V20_FA_IDS[el.id] || t;
    return t || "";
  }
  function isDatePartField(id, label) {
    if (/year|month|jyear|jmonth|روز/i.test(String(id))) return true;
    if (/^(سال|ماه|روز)$/.test(String(label))) return true;
    return false;
  }

  function collectCombos(paneId) {
    var pane = $(paneId);
    if (!pane) return [];
    var out = [], seen = {};
    // فقط شناسه‌های متعلق به همان تب؛ فیلد کپی‌شده از تب دیگر هرگز وارد این فهرست نشود.
    function belongs(el) {
      var id = String(el.id || ""), S = st() || {}, key = paneId === "tab-pharmacies" ? "pharmacy" : paneId === "tab-doctors" ? "doctor" : paneId === "tab-orders" ? "order" : paneId === "tab-snapp-corporate" ? "snapp" : paneId === "tab-columns-products" ? "products" : "users";
      var custom = ((S.customFields || {})[key] || []).some(function (f) { return f && f.id === id; });
      if (custom) return true;
      if (key === "pharmacy") return /^pharmacy/.test(id);
      if (key === "doctor") return /^(doctor|doc)/.test(id);
      if (key === "order") return /^(order|ordm-)/.test(id);
      if (key === "snapp") return /^snapp/.test(id);
      if (key === "products") return /^(product|prod)/.test(id);
      return /^user/.test(id);
    }
    function skipped(el) {
      return !belongs(el) || el.closest("#columnsDesignerHost") || el.closest("#jalaliCalendarPopup") ||
        el.closest(".modal-overlay") || el.closest("#addTabGrid") || el.closest("#addTabPanel") ||
        el.closest("#v20PresetBar");
    }
    Array.prototype.forEach.call(pane.querySelectorAll("select[id]"), function (sel) {
      if (!sel.id || seen[sel.id] || skipped(sel)) return;
      if (sel.id.indexOf("jalali") === 0 || sel.id.indexOf("v20") === 0) return;
      var lab = faLabel(sel, pane);
      // برای کشویی‌های کمبووشده، برچسب از ورودی دیداری خوانده شود
      if (!lab) {
        var combo = sel.closest(".crm-combo");
        var vis = combo ? combo.querySelector(".crm-combo-input") : null;
        if (vis) lab = faLabel(vis, pane);
      }
      if (isDatePartField(sel.id, lab)) return; // سال/ماه تاریخ شمسی در این بخش نیاید (مثل بقیه کشویی‌ها)
      seen[sel.id] = true;
      var opts = [];
      Array.prototype.forEach.call(sel.options, function (o, i) {
        var v = String(o.value == null ? "" : o.value);
        var t = String(o.textContent || "");
        if (i === 0 && !v) return; // جای‌نگهدار «انتخاب کنید...»
        opts.push({ v: v, t: t });
      });
      out.push({ el: sel, id: sel.id, label: lab, opts: opts });
    });
    // ورودی‌های متصل به datalist (کشویی تایپ‌شونده)
    Array.prototype.forEach.call(pane.querySelectorAll("input[list][id]"), function (inp) {
      if (seen[inp.id] || skipped(inp)) return;
      if (inp.id.indexOf("v20") === 0) return;
      var lab2 = faLabel(inp, pane);
      if (isDatePartField(inp.id, lab2)) return;
      var dl = $(inp.getAttribute("list"));
      if (!dl) return;
      seen[inp.id] = true;
      var opts = [];
      Array.prototype.forEach.call(dl.options, function (o) {
        var v = String(o.value || o.textContent || "");
        if (v) opts.push({ v: v, t: v });
      });
      out.push({ el: inp, id: inp.id, label: lab2, opts: opts, datalist: dl });
    });
    return out;
  }

  function persistAdd(storeId, val) {
    var S = st(); if (!S) return;
    S.selectExtraOptions = S.selectExtraOptions || {};
    S.selectExtraOptions[storeId] = S.selectExtraOptions[storeId] || [];
    if (S.selectExtraOptions[storeId].indexOf(val) === -1) { S.selectExtraOptions[storeId].push(val); save(); }
  }
  function persistRemove(storeId, val) {
    var S = st(); if (!S) return;
    var arr = (S.selectExtraOptions || {})[storeId];
    if (arr) { var i = arr.indexOf(val); if (i >= 0) arr.splice(i, 1); }
    S.v20HiddenOptions = S.v20HiddenOptions || {};
    S.v20HiddenOptions[storeId] = S.v20HiddenOptions[storeId] || [];
    if (S.v20HiddenOptions[storeId].indexOf(val) === -1) S.v20HiddenOptions[storeId].push(val);
    save();
  }
  function persistRename(storeId, oldV, newV) {
    var S = st(); if (!S) return;
    var arr = (S.selectExtraOptions || {})[storeId];
    if (arr && arr.indexOf(oldV) >= 0) { arr[arr.indexOf(oldV)] = newV; }
    else {
      S.v20Renames = S.v20Renames || {};
      S.v20Renames[storeId] = S.v20Renames[storeId] || {};
      S.v20Renames[storeId][oldV] = newV;
    }
    save();
  }

  function optionRowsHtml(entry) {
    var h = "";
    entry.opts.forEach(function (o) {
      h += "<div class='v20-opt-row' data-v='" + esc(o.v) + "'>" +
        "<span>" + esc(o.t || o.v) + "</span>" +
        "<button type='button' class='v20-opt-pick' data-store='" + esc(entry.id) + "' data-v='" + esc(o.v) + "' title='انتخاب و نمایش زیرمجموعه'>✅ انتخاب</button>" +
        "<button type='button' class='v20-opt-edit' data-store='" + esc(entry.id) + "' data-v='" + esc(o.v) + "' title='ویرایش'>✏️</button>" +
        "<button type='button' class='v20-opt-del' data-store='" + esc(entry.id) + "' data-v='" + esc(o.v) + "' title='حذف'>🗑️</button>" +
        "</div>";
    });
    return h || "<div class='v20-mini'>گزینه‌ای ثبت نشده است.</div>";
  }

  function greyParentOptions(entry, paneId) {
    var pane = $(paneId); if (!pane) return "";
    var h = "<option value=''>— بدون زنجیره —</option>";
    Array.prototype.forEach.call(pane.querySelectorAll("select[id], input[id]"), function (el) {
      if (!el.id || el.id === entry.id) return;
      if (el.closest("#addTabPanel") || el.closest("#columnsDesignerHost") || el.closest(".modal-overlay")) return;
      if (el.id.indexOf("v20") === 0) return;
      var lab = faLabel(el, pane) || el.id;
      var cur = (st() && st().v20GreyMap && st().v20GreyMap[entry.id]) || "";
      h += "<option value='" + esc(el.id) + "'" + (cur === el.id ? " selected" : "") + ">" + esc(lab) + "</option>";
    });
    return h;
  }

  function v20PaneEntity(){return v20AddPane==="tab-pharmacies"?"pharmacy":v20AddPane==="tab-doctors"?"doctor":v20AddPane==="tab-orders"?"order":v20AddPane==="tab-columns-products"?"products":v20AddPane==="tab-snapp-corporate"?"snapp":"users";}
  function syncActiveAddEntity(){var sel=$("cfTargetEntity");if(sel){sel.value=v20PaneEntity();var g=sel.closest(".form-group");if(g)g.style.display="none";}}
  window.v20RenderComboManager = function () {
    syncActiveAddEntity();
    var host = $("addTabPanel");
    if (!host || !document.getElementById("tab-custom-fields")) return;
    var entries = collectCombos(v20AddPane);
    var S = st() || {};
    var greyOn = !(S.settings && S.settings.v20GreyOn === false);
    var lockOn = !(S.settings && S.settings.v20OrderLock === false);
    var tabs = "";
    V20_PANES.forEach(function (p) {
      tabs += "<button type='button' class='" + (p[0] === v20AddPane ? "v20-on" : "") + "' data-pane='" + p[0] + "'>" + p[1] + "</button>";
    });
    var h = "<div class='v20-addmgr' style='border-top:2px solid #e2e8f0;padding-top:10px;'>" +
      "<h4 style='margin:8px 0;color:#0f172a;'>🎛️ مدیر کشویی‌ها (نسخه ۱۱.۲۱.۳) — هر فیلد، زیرمجموعه‌هایش دقیقاً زیر همان فیلد است</h4>" +
      "<div class='v20-tabbar'>" + tabs + "</div>" +
      "<div class='v20-card-tools' style='margin-bottom:4px'>" +
      "<label class='v20-mini'><input type='checkbox' id='v20GreyOnChk'" + (greyOn ? " checked" : "") + "> حالت طوسی زنجیره‌ای فعال باشد</label>" +
      "<label class='v20-mini'><input type='checkbox' id='v20OrderLockChk'" + (lockOn ? " checked" : "") + "> قفل طوسی فرم سفارش تا انتخاب داروخانه فعال باشد</label>" +
      "</div>";
    h += "<div class='v20-cards'>";
    if (!entries.length) h += "<div class='v20-mini'>در این تب فیلد کشویی پیدا نشد.</div>";
    entries.forEach(function (en) {
      var parentSel = en.el.tagName === "SELECT" ? greyParentOptions(en, v20AddPane) : "";
      h += "<div class='v20-combo-card' data-store='" + esc(en.id) + "'>" +
        "<h5>🔽 " + esc(en.label || V20_FA_IDS[en.id] || "فیلد کشویی") + "</h5>" +
        "<div class='v20-card-tools'>" +
        "<input type='text' class='v20-search' placeholder='🔍 جستجوی لحظه‌ای در زیرمجموعه‌ها...'>" +
        "<input type='text' class='v20-newopt' placeholder='گزینه جدید...' style='flex:.8'>" +
        "<button type='button' class='v20-addopt' data-store='" + esc(en.id) + "' style='padding:7px 12px;border:1px solid #0d9488;background:#0d9488;color:#fff;border-radius:8px;cursor:pointer;'>➕ افزودن</button>" +
        (parentSel ? "<label class='v20-mini'>طوسی تا انتخاب: <select class='v20-grey-sel' data-store='" + esc(en.id) + "'>" + parentSel + "</select></label>" : "") +
        "</div>" +
        "<div class='v20-opts' data-store='" + esc(en.id) + "'>" + optionRowsHtml(en) + "</div>" +
        "</div>";
    });
    h += "</div>"; // پایان .v20-cards
    h += "</div>"; // پایان .v20-addmgr
    var old = host.querySelector(".v20-addmgr");
    if (old) old.parentNode.removeChild(old);
    var div = document.createElement("div");
    div.innerHTML = h;
    // مدیر جدید همیشه ابتدای تب دیده شود؛ کاربر مجبور به اسکرول زیر پنل قدیمی نباشد.
    host.insertBefore(div.firstChild, host.firstChild);
    bindManager(host);
    v20RenderEntityManager();
  };

  function bindManager(host) {
    Array.prototype.forEach.call(host.querySelectorAll(".v20-tabbar button"), function (b) {
      b.addEventListener("click", function () { v20AddPane = b.getAttribute("data-pane"); window.v20RenderComboManager(); });
    });
    var g1 = host.querySelector("#v20GreyOnChk");
    if (g1) g1.addEventListener("change", function () { var S = st(); if (!S) return; S.settings = S.settings || {}; S.settings.v20GreyOn = g1.checked; save(); v20ApplyGreyChains(); v20ApplyOrderLock(); });
    var g2 = host.querySelector("#v20OrderLockChk");
    if (g2) g2.addEventListener("change", function () { var S = st(); if (!S) return; S.settings = S.settings || {}; S.settings.v20OrderLock = g2.checked; save(); v20ApplyOrderLock(); });

    Array.prototype.forEach.call(host.querySelectorAll(".v20-card-tools .v20-search"), function (inp) {
      inp.addEventListener("input", function () {
        var card = inp.closest(".v20-combo-card");
        var q = norm(inp.value);
        Array.prototype.forEach.call(card.querySelectorAll(".v20-opt-row"), function (row) {
          row.style.display = (!q || norm(row.getAttribute("data-v")).indexOf(q) >= 0) ? "" : "none";
        });
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".v20-addopt"), function (b) {
      b.addEventListener("click", function () {
        var card = b.closest(".v20-combo-card");
        var inp = card.querySelector(".v20-newopt");
        var val = String(inp.value || "").trim();
        if (!val) { alert("متن گزینه جدید را بنویسید."); return; }
        var id = b.getAttribute("data-store");
        var el = $(id);
        if (el && el.tagName === "SELECT") {
          var o = document.createElement("option"); o.value = val; o.textContent = val; el.appendChild(o);
        } else if (el && el.getAttribute("list") && $(el.getAttribute("list"))) {
          var o2 = document.createElement("option"); o2.value = val; $(el.getAttribute("list")).appendChild(o2);
        }
        persistAdd(id, val);
        log("گزینه اضافه شد: " + id + " ← " + val);
        window.v20RenderComboManager();
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".v20-opt-pick"),function(b){b.addEventListener("click",function(){var el=$(b.getAttribute("data-store"));if(!el)return;el.value=b.getAttribute("data-v");try{el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));}catch(e){}setTimeout(window.v20RenderComboManager,120);});});
    Array.prototype.forEach.call(host.querySelectorAll(".v20-opt-edit"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-store"), oldV = b.getAttribute("data-v");
        var nw = prompt("ویرایش زیرمجموعه:\n«" + oldV + "» به:", oldV);
        if (nw === null) return;
        nw = String(nw).trim();
        if (!nw || nw === oldV) return;
        var el = $(id);
        if (el && el.tagName === "SELECT") {
          Array.prototype.forEach.call(el.options, function (o) { if (String(o.value) === oldV) { o.value = nw; o.textContent = nw; } });
        }
        persistRename(id, oldV, nw);
        window.v20RenderComboManager();
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".v20-opt-del"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-store"), v = b.getAttribute("data-v");
        if (!window.confirm("زیرمجموعه «" + v + "» حذف شود؟")) return;
        var el = $(id);
        if (el && el.tagName === "SELECT") {
          Array.prototype.slice.call(el.options).forEach(function (o) { if (String(o.value) === v) el.removeChild(o); });
        } else if (el && el.getAttribute("list") && $(el.getAttribute("list"))) {
          var dl = $(el.getAttribute("list"));
          Array.prototype.slice.call(dl.options).forEach(function (o) { if (String(o.value) === v) dl.removeChild(o); });
        }
        persistRemove(id, v);
        window.v20RenderComboManager();
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".v20-grey-sel"), function (sel) {
      sel.addEventListener("change", function () {
        var S = st(); if (!S) return;
        S.v20GreyMap = S.v20GreyMap || {};
        var id = sel.getAttribute("data-store");
        if (sel.value) S.v20GreyMap[id] = sel.value; else delete S.v20GreyMap[id];
        save();
        v20ApplyGreyChains();
      });
    });
  }

  /* ---------- ۴) موتور زنجیره طوسی ---------- */
  function setFieldGrey(el, grey) {
    var y = window.scrollY;
    try {
      el.disabled = !!grey;
      el.classList.toggle("v20-grey", !!grey);
      var combo = el.closest ? el.closest(".crm-combo") : null;
      if (combo) {
        combo.classList.toggle("v20-locked", !!grey);
        var inp = combo.querySelector(".crm-combo-input");
        if (inp) { inp.disabled = !!grey; inp.classList.toggle("v20-grey", !!grey); }
      }
      var fg = el.closest ? el.closest(".form-group") : null;
      if (fg) fg.classList.toggle("v20-grey-zone", !!grey);
    } catch (e) {}
    if (window.scrollY !== y) window.scrollTo(0, y);
  }
  function seedGreyDefaults() {
    var S = st(); if (!S || S._v20GreySeeded) return;
    S.v20GreyMap = S.v20GreyMap || {};
    [["pharmacyCity", "pharmacyProvince"], ["pharmacyDistrict", "pharmacyCity"],
     ["doctorCity", "doctorProvince"], ["doctorDistrict", "doctorCity"],
     ["orderCity", "orderProvince"], ["orderDistrict", "orderCity"]].forEach(function (p) {
      if (!(p[0] in S.v20GreyMap)) S.v20GreyMap[p[0]] = p[1];
    });
    S._v20GreySeeded = true;
    save();
  }
  function v20ApplyGreyChains() {
    var S = st(); if (!S) return;
    var on = !(S.settings && S.settings.v20GreyOn === false);
    var y = window.scrollY;
    Object.keys(S.v20GreyMap || {}).forEach(function (id) {
      var el = $(id); if (!el) return;
      // قفل سفارشات مالک فیلدهای سفارش است
      if (id.indexOf("order") === 0 && !(S.settings && S.settings.v20OrderLock === false)) return;
      var pEl = $(S.v20GreyMap[id]);
      var locked = on && pEl && !String(pEl.value || "").trim();
      setFieldGrey(el, locked);
    });
    if (window.scrollY !== y) window.scrollTo(0, y);
  }
  window.v20ApplyGreyChains = v20ApplyGreyChains;

  /* ---------- ۵) قفل طوسی فرم سفارش ---------- */
  var ORDER_DESCRIPTORS = ["orderProvince", "orderCity", "orderDistrict", "orderAddress", "orderRepName"];
  var ORDER_PRODUCT_SCOPE = "#orderItemsContainer, #orderProductCatalogBar, #orderProductCatalogList, #orderTotalsArea";
  function orderMatched() { return !!(($("orderPharmacyMatchedId") || {}).value); }
  function v20ApplyOrderLock() {
    var pane = $("tab-orders"); if (!pane) return;
    var S = st(); if (!S) return;
    var on = !(S.settings && S.settings.v20OrderLock === false);
    var inputs = pane.querySelectorAll("input, select, textarea");
    var y = window.scrollY;
    if (!on) {
      Array.prototype.forEach.call(inputs, function (el) { setFieldGrey(el, false); });
      return;
    }
    var locked = !orderMatched();
    Array.prototype.forEach.call(inputs, function (el) {
      if (!el.id || el.type === "hidden") return;
      // نام داروخانه، تاریخ سفارش و همه فیلدهای بخش کالا: همیشه فعال و عادی
      if (el.id === "orderPharmacyName" || el.id === "orderDate") { setFieldGrey(el, false); return; }
      if (el.closest && el.closest(ORDER_PRODUCT_SCOPE)) { setFieldGrey(el, false); return; }
      // فیلدهای توصیفی داروخانه: طوسی (اطلاعات سر جای خودش می‌نشیند)
      if (ORDER_DESCRIPTORS.indexOf(el.id) >= 0) { setFieldGrey(el, true); return; }
      // بقیه فیلدها: تا انتخاب/جایگذاری داروخانه طوسی‌اند
      setFieldGrey(el, locked);
    });
    if (window.scrollY !== y) window.scrollTo(0, y);
  }
  window.v20ApplyOrderLock = v20ApplyOrderLock;

  /* ---------- ۶) افزودن لحظه‌ای نام = ذخیره خودکار (بدون تکرار کاذب) ---------- */
  function v20Toast(msg) {
    try {
      var d = document.createElement("div");
      d.className = "v20-toast";
      d.textContent = msg;
      document.body.appendChild(d);
      setTimeout(function () { try { d.parentNode.removeChild(d); } catch (e) {} }, 3200);
    } catch (e) {}
  }
  function bindInstantAddSave() {
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      var t = String(b.textContent || "").trim();
      if (t.indexOf("➕ افزودن") !== 0) return;
      var pane = b.closest("#tab-pharmacies, #tab-doctors");
      if (!pane) return;
      var isDoc = pane.id === "tab-doctors";
      setTimeout(function () {
        var nameInp = $(isDoc ? "doctorName" : "pharmacyName");
        var val = nameInp ? String(nameInp.value || "").trim() : "";
        if (!val) return;
        var kind = isDoc ? "doctor" : "pharmacy";
        var sig = v20SigOf(kind);
        // اگر همین رکورد لحظاتی پیش با همین امضا ذخیره شد، دوباره ذخیره نکن
        if (window._v20AutoSaveSig === sig && (Date.now() - (window._v20AutoSaveT || 0)) < 120000) {
          v20Toast("این رکورد همین الان ذخیره شده؛ دوباره ثبت نمی‌شود.");
          return;
        }
        var S = st();
        var before = S ? (isDoc ? (S.doctors || []).length : (S.pharmacies || []).length) : 0;
        window._v20AutoSaveSig = sig;
        window._v20AutoSaveT = Date.now();
        var saveBtn = $(isDoc ? "btnSaveDoctor" : "btnSavePharmacy");
        if (saveBtn) {
          log("افزودن لحظه‌ای ⇒ ذخیره خودکار رکورد");
          saveBtn.click();
          setTimeout(function () {
            var S2 = st();
            var after = S2 ? (isDoc ? (S2.doctors || []).length : (S2.pharmacies || []).length) : 0;
            if (after > before) v20Toast("✅ «" + val + "» ثبت شد.");
          }, 240);
        }
      }, 90);
    }, true);
  }

  /* ---------- ۷) همگام‌سازی فیلدهای داروخانه ↔ سفارشات ---------- */
  function mirrorPharmacyFieldsToOrder(boot) {
    var S = st(); if (!S) return;
    S.customFields = S.customFields || {};
    var ph = S.customFields.pharmacy || [];
    S.customFields.order = S.customFields.order || [];
    var or = S.customFields.order;
    var moved = 0;
    ph.forEach(function (f) {
      if (!f || !f.id) return;
      var mirrorId = "ordm-" + f.id;
      var exists = or.some(function (g) { return g && (g.id === mirrorId || g.label === f.label); });
      if (!exists) {
        var clone = {};
        Object.keys(f).forEach(function (k) { clone[k] = f[k]; });
        clone.id = mirrorId;
        or.push(clone);
        moved++;
      }
    });
    if (moved) {
      save();
      log("همگام فیلد داروخانه→سفارش: " + moved + " فیلد");
      try { if (typeof window.applyFullFormLayout === "function") window.applyFullFormLayout("tab-orders"); } catch (e) {}
      try { if (typeof window.renderExtraTabCustomFields === "function") window.renderExtraTabCustomFields("order"); } catch (e) {}
    }
    if (boot) S._v20MirrorBoot = true;
  }
  function mergeSameNameFieldInfo(){var S=st(),key=v20PaneEntity(),arr=((S.customFields||{})[key]||[]),fresh=arr[arr.length-1];if(!fresh||!fresh.label)return;Object.keys(S.customFields||{}).forEach(function(k){((S.customFields[k])||[]).forEach(function(f){if(!f||f===fresh||norm(f.label)!==norm(fresh.label))return;fresh.options=Array.from(new Set((fresh.options||[]).concat(f.options||[])));if(!fresh.dependsOn&&f.dependsOn)fresh.dependsOn=f.dependsOn;if(!fresh.type&&f.type)fresh.type=f.type;});});save();}
  function bindMirror() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.id === "btnSaveCustomField") {
        setTimeout(function () {
          try {
            syncActiveAddEntity(); mergeSameNameFieldInfo();
            var ent = ($("cfTargetEntity") || {}).value;
            if (ent === "pharmacy") mirrorPharmacyFieldsToOrder(false);
            if (ent === "products") renderProductExtras();
          } catch (err) {}
        }, 150);
      }
    });
    // حذف فیلد داروخانه ⇒ حذف آینه‌ای از سفارش
    var od = window.deleteCustomField;
    if (typeof od === "function") {
      window.deleteCustomField = function (entity, fieldId) {
        var S = st();
        var label = "";
        if (S && S.customFields && S.customFields[entity]) {
          (S.customFields[entity] || []).forEach(function (f) { if (f && f.id === fieldId) label = f.label || ""; });
        }
        var r = od.apply(this, arguments);
        try {
          if (entity === "pharmacy" && S) {
            var or = (S.customFields && S.customFields.order) || [];
            var target = null;
            or.forEach(function (g) {
              if (!g) return;
              if (g.id === "ordm-" + fieldId || (label && g.label === label)) target = g.id;
            });
            if (target) od.call(this, "order", target);
            setTimeout(function () {
              try { if (typeof window.applyFullFormLayout === "function") window.applyFullFormLayout("tab-orders"); } catch (e) {}
            }, 80);
          }
        } catch (e2) {}
        return r;
      };
    }
  }

  /* ---------- ۸) رفع نقص فیلدهای باکس کالا ---------- */
  function renderProductExtras() {
    var anchor = $("productName");
    if (!anchor) return;
    var S = st(); if (!S) return;
    var grid = anchor.closest(".form-grid") || anchor.parentElement;
    if (!grid) return;
    var old = $("v20ProductExtrasHost");
    if (old) old.parentNode.removeChild(old);
    var fields = (S.customFields && (S.customFields.products || S.customFields.product)) || [];
    fields = fields.filter(function (f) { return f && !f.deleted && f.showInForm !== false; });
    fields.sort(function (a, b) { return (Number(a.order) || 999) - (Number(b.order) || 999); });
    if (!fields.length) return;
    var host = document.createElement("div");
    host.id = "v20ProductExtrasHost";
    host.style.display = "contents";
    fields.forEach(function (f) {
      var g = document.createElement("div");
      g.className = "form-group";
      var w = parseInt(f.size, 10) || 220;
      var inner;
      if (f.type === "select") {
        inner = "<select class='form-select' id='v20pf_" + esc(f.id) + "' style='width:100%;max-width:" + w + "px'>" +
          "<option value=''>انتخاب کنید...</option>" +
          String(f.options || "").split(/[,،]/).map(function (s) { return s.trim(); }).filter(Boolean)
            .map(function (s) { return "<option value='" + esc(s) + "'>" + esc(s) + "</option>"; }).join("") +
          "</select>";
      } else {
        inner = "<input type='text' class='form-input' id='v20pf_" + esc(f.id) + "' style='width:100%;max-width:" + w + "px" +
          (f.height ? ";height:" + parseInt(f.height, 10) + "px" : "") + "' placeholder='" + esc(f.label) + "...'>";
      }
      g.innerHTML = "<label class='form-label' for='v20pf_" + esc(f.id) + "'>" + esc(f.label) + "</label>" + inner;
      host.appendChild(g);
    });
    grid.appendChild(host);
    log("فیلدهای سفارشی کالا رسم شد: " + fields.length);
  }
  window.v20RenderProductExtras = renderProductExtras;

  /* ---------- ۹) اعمال ترتیب ستون‌های لیست ---------- */
  var LIST_TARGETS = [
    ["renderPharmaciesList", "tab-pharmacies", "pharmacy"],
    ["renderDoctorsList", "tab-doctors", "doctor"],
    ["renderOrdersList", "tab-orders", "order"]
  ];
  function thText(th) { return String(th.textContent || "").replace(/\s+/g, " ").replace(/[*]/g, "").trim(); }
  function v20ReorderListColumns(paneId, key) {
    try {
      if (typeof window.getUnifiedFieldList !== "function") return;
      var pane = $(paneId); if (!pane) return;
      var table = pane.querySelector("table"); if (!table) return;
      var headRow = table.querySelector("thead tr"); if (!headRow) return;
      var ths = Array.prototype.slice.call(headRow.children);
      if (ths.length < 3) return;
      var fields = (window.getUnifiedFieldList(key) || []).filter(function (f) {
        return f && !f.deleted && f.showInList !== false;
      }).sort(function (a, b) {
        return (Number(a.listOrder) || Number(a.order) || 999) - (Number(b.listOrder) || Number(b.order) || 999);
      });
      var mapLabel = {};
      ths.forEach(function (th, i) { mapLabel[i] = thText(th); });
      var matched = 0;
      var newOrder = new Array(ths.length).fill(-1);
      var taken = {};
      newOrder[0] = 0; taken[0] = true; // ستون اول: ردیف واقعی
      // ستون دوم: نام نماینده
      for (var r = 1; r < ths.length; r++) {
        if (/نماینده/.test(mapLabel[r])) { newOrder[1] = r; taken[r] = true; break; }
      }
      // آخرین ستون اگر عملیات/خالی است در آخر بماند
      var lastIdx = ths.length - 1;
      var keepLast = (!mapLabel[lastIdx] || /عملیات|ویرایش|حذف/.test(mapLabel[lastIdx]));
      if (keepLast) { taken[lastIdx] = true; }
      var desiredMvids = fields.map(function (f) { return String(f.label || "").replace(/\s+/g, " ").replace(/[*]/g, "").trim(); });
      var fillPos = 1;
      if (newOrder[1] !== -1) fillPos = 2;
      desiredMvids.forEach(function (lab) {
        if (!lab) return;
        for (var i = 1; i < ths.length; i++) {
          if (taken[i]) continue;
          if (mapLabel[i] === lab) {
            while (fillPos <= lastIdx && newOrder[fillPos] !== -1 && taken[newOrder[fillPos]]) fillPos++;
            while (fillPos <= lastIdx && newOrder[fillPos] !== -1) fillPos++;
            if (keepLast && fillPos >= lastIdx) return;
            if (fillPos >= ths.length) return;
            newOrder[fillPos] = i; taken[i] = true; matched++; fillPos++;
            break;
          }
        }
      });
      if (matched < 2) return; // اطمینان نداریم — دست نزن
      var rest = [];
      for (var k = 1; k < ths.length; k++) if (!taken[k]) rest.push(k);
      var pos = 1;
      var finalOrder = [];
      for (var p = 0; p < ths.length; p++) finalOrder.push(-1);
      finalOrder[0] = 0;
      if (keepLast) finalOrder[lastIdx] = lastIdx;
      if (newOrder[1] !== -1) finalOrder[1] = newOrder[1];
      for (var q = 0; q < ths.length; q++) if (newOrder[q] !== -1 && q !== 0 && !(q === 1)) finalOrder[q] = newOrder[q];
      rest.forEach(function (idx) {
        while (pos < ths.length && finalOrder[pos] !== -1) pos++;
        if (pos < ths.length) finalOrder[pos] = idx;
      });
      for (var fix = 0; fix < ths.length; fix++) if (finalOrder[fix] === -1) { finalOrder[fix] = fix; }
      function reorderRow(row) {
        var cells = Array.prototype.slice.call(row.children);
        if (cells.length !== finalOrder.length) return;
        var copy = cells.slice();
        finalOrder.forEach(function (srcIdx, i) { row.appendChild(copy[srcIdx]); });
      }
      reorderRow(headRow);
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), reorderRow);
      log("ترتیب ستون لیست اعمال شد: " + paneId);
    } catch (e) {}
  }
  function wrapListRenderers() {
    LIST_TARGETS.forEach(function (t) {
      var orig = window[t[0]];
      if (typeof orig !== "function" || orig._v20wrapped) return;
      var wrapped = function () {
        var r = orig.apply(this, arguments);
        var pane = t[1], key = t[2];
        setTimeout(function () { v20ReorderListColumns(pane, key); }, 0);
        return r;
      };
      wrapped._v20wrapped = true;
      window[t[0]] = wrapped;
    });
  }

  /* ---------- ۱۰) دکمه تغییر رمز (کنار دکمه خروج، نه روی آن) ---------- */
  function persistPass(username, newPass) {
    try {
      var map = JSON.parse(localStorage.getItem("CRM_USERS_AUTH") || "{}");
      if (!map[username]) map[username] = {};
      map[username].password = newPass;
      localStorage.setItem("CRM_USERS_AUTH", JSON.stringify(map));
    } catch (e) {}
  }
  function bindChpassFab() {
    if ($("v20ChpassFab")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "v20ChpassFab";
    b.textContent = "🔑 تغییر رمز";
    b.addEventListener("click", function () {
      var who = sessionStorage.getItem("crmUsername") || "";
      var S = st();
      var u = S ? (S.users || []).filter(function (x) { return x.username === who; })[0] : null;
      var modal = document.createElement("div");
      modal.className = "v20-modal";
      modal.innerHTML =
        "<div class='v20-modal-card'>" +
        "<h4 style='margin:0 0 8px'>🔑 تغییر رمز عبور «" + esc(sessionStorage.getItem("crmUserName") || who) + "»</h4>" +
        "<input type='password' id='v20p1' placeholder='رمز فعلی'>" +
        "<input type='password' id='v20p2' placeholder='رمز جدید'>" +
        "<input type='password' id='v20p3' placeholder='تکرار رمز جدید'>" +
        "<div style='display:flex;gap:8px;justify-content:flex-end;margin-top:10px'>" +
        "<button type='button' id='v20pOk' style='background:#0d9488;color:#fff;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;font-weight:700;'>ثبت رمز جدید</button>" +
        "<button type='button' id='v20pNo' style='background:#e2e8f0;border:none;border-radius:8px;padding:8px 18px;cursor:pointer;'>انصراف</button>" +
        "</div></div>";
      document.body.appendChild(modal);
      modal.querySelector("#v20pNo").addEventListener("click", function () { modal.parentNode.removeChild(modal); });
      modal.querySelector("#v20pOk").addEventListener("click", function () {
        var p1 = modal.querySelector("#v20p1").value;
        var p2 = String(modal.querySelector("#v20p2").value || "").trim();
        var p3 = String(modal.querySelector("#v20p3").value || "").trim();
        var map = {};
        try { map = JSON.parse(localStorage.getItem("CRM_USERS_AUTH") || "{}"); } catch (e) {}
        var cur = u ? u.password : (map[who] ? map[who].password : null);
        if (cur != null && p1 !== cur) { alert("رمز فعلی نادرست است."); return; }
        if (!p2) { alert("رمز جدید خالی است."); return; }
        if (p2 !== p3) { alert("دو رمز جدید یکسان نیستند."); return; }
        if (u) { u.password = p2; }
        persistPass(who, p2);
        save();
        modal.parentNode.removeChild(modal);
        alert("✅ رمز شما تغییر کرد و در سیستم ورود هم ثبت شد. از ورود بعدی همان رمز جدید معتبر است.");
      });
    });
    // میزبانی درون هدر، درست قبل از دکمه «خروج» — اگر هدر پیدا نشد، پایینِ هدر شناور می‌شود
    var logout = $("btnLogoutSystem");
    if (logout && logout.parentNode) {
      logout.parentNode.insertBefore(b, logout);
    } else {
      b.style.position = "fixed";
      b.style.top = "64px";
      b.style.left = "8px";
      b.style.zIndex = "1100";
      document.body.appendChild(b);
    }
    v20RefreshFab();
  }
  function v20RefreshFab() {
    var b = $("v20ChpassFab"); if (!b) return;
    b.style.display = sessionStorage.getItem("crmLoggedIn") === "1" ? "inline-block" : "none";
  }

  /* ---------- ۱۱) سطوح دسترسی آماده ---------- */
  var ROLE_PRESETS = [
    {
      id: "rep", label: "نماینده علمی",
      on: ["dash_login", "dash_stats", "ph_access", "ph_create", "ph_list", "ph_view_loc", "ph_create_loc",
        "ph_percentage", "ph_send_mgr", "doc_access", "doc_create", "doc_list", "doc_view_loc", "doc_create_loc",
        "doc_upload", "doc_send_mgr", "ord_access", "ord_create", "ord_list", "ord_view_detail", "ord_items",
        "ord_send", "fld_visit", "fld_start_stop", "fld_pause", "fld_home_loc", "hr_leave_req", "rep_monthly",
        "sys_install", "usr_chpass"]
    },
    {
      id: "sales", label: "کارشناس فروش",
      on: ["dash_login", "dash_stats", "dash_activity", "dash_all_reps", "dash_export",
        "ph_access", "ph_create", "ph_list", "ph_all_reps", "ph_view_loc", "ph_create_loc", "ph_percentage",
        "ph_send_mgr", "ph_excel", "doc_access", "doc_create", "doc_list", "doc_all_reps", "doc_view_loc",
        "doc_create_loc", "doc_upload", "doc_print", "doc_send_mgr", "doc_excel", "ord_access", "ord_create",
        "ord_list", "ord_all_reps", "ord_view_detail", "ord_items", "ord_send", "ord_excel",
        "fld_visit", "fld_start_stop", "fld_pause", "fld_home_loc", "hr_leave_req",
        "rep_monthly", "rep_all_reports", "rep_item_sales", "rep_excel", "sys_targets", "sys_notify",
        "sys_install", "usr_chpass"]
    },
    {
      id: "supervisor", label: "سرپرست",
      on: "ALL_EXCEPT",
      off: ["sys_users", "sys_manual_design", "sys_copy_tabs", "sys_restore", "ord_formula"]
    }
  ];
  function renderPresetBar() {
    var pane = $("tab-users-permissions");
    if (!pane || $("v20PresetBar")) return;
    var S = st(); if (!S) return;
    var card = pane.querySelector(".card") || pane;
    var bar = document.createElement("div");
    bar.id = "v20PresetBar";
    bar.style.cssText = "border:1px solid #c7d2fe;background:#eef2ff;border-radius:12px;padding:12px;margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;";
    var opts = ROLE_PRESETS.map(function (p) { return "<option value='" + p.id + "'>" + p.label + "</option>"; }).join("");
    var users = (S.users || []).map(function (u) { return "<option value='" + esc(u.id) + "'>" + esc(u.fullName || u.username) + " (" + esc(u.username) + ")</option>"; }).join("");
    bar.innerHTML =
      "<strong>🎚️ سطوح دسترسی آماده:</strong>" +
      "<select id='v20PresetSel' class='form-select' style='min-width:150px'>" + opts + "</select>" +
      "<select id='v20PresetUser' class='form-select' style='min-width:190px'>" + users + "</select>" +
      "<button type='button' id='v20PresetApply' style='background:#4f46e5;color:#fff;border:none;border-radius:9px;padding:8px 16px;cursor:pointer;font-weight:700;'>اعمال سطح روی کاربر</button>" +
      "<span class='v20-mini'>با این کار همه تیک‌های دسترسی کاربر یکجا بر اساس سطح انتخابی تنظیم می‌شود؛ بعداً هم می‌توانید تیک‌ها را دستی عوض کنید.</span>";
    card.insertBefore(bar, card.firstChild);
    bar.querySelector("#v20PresetApply").addEventListener("click", function () {
      var pid = bar.querySelector("#v20PresetSel").value;
      var uid = bar.querySelector("#v20PresetUser").value;
      var S2 = st(); if (!S2) return;
      var u = (S2.users || []).filter(function (x) { return String(x.id) === String(uid); })[0];
      var preset = ROLE_PRESETS.filter(function (p) { return p.id === pid; })[0];
      if (!u || !preset) return;
      if (u.username === "admin") { alert("سطح مدیر اصلی (admin) قابل تغییر نیست."); return; }
      if (typeof getDefaultPermissionsObject !== "function") { alert("موتور دسترسی‌ها در دسترس نیست."); return; }
      var perms;
      if (preset.on === "ALL_EXCEPT") {
        perms = getDefaultPermissionsObject(true);
        (preset.off || []).forEach(function (k) { perms[k] = false; });
      } else {
        perms = getDefaultPermissionsObject(false);
        preset.on.forEach(function (k) { perms[k] = true; });
      }
      u.permissions = perms;
      u.role = preset.label;
      u.preset = preset.label;
      save();
      if (typeof renderUserCardsList === "function") { try { renderUserCardsList(); } catch (e) {} }
      alert("✅ سطح «" + preset.label + "» روی «" + (u.fullName || u.username) + "» اعمال شد.");
    });
  }

  /* ---------- ۷-ب) همگام‌سازی «جای فیلدها» داروخانه → سفارشات ---------- */
  var ORDER_TO_PH_CORE = { PharmacyName: "Name" };
  function mirrorPharmacyOrderToOrders() {
    // از نسخه ۱۱.۱۷ جای فیلدها فقط از تنظیم ذخیره‌شده مدیر خوانده می‌شود.
    // جابه‌جایی خودکار DOM در هر بار اجرای نسخه، کد/جای فیلدها را به‌هم می‌زد.
    return;
    try {
      var ph = $("tab-pharmacies"), od = $("tab-orders");
      if (!ph || !od) return;
      var seq = [];
      Array.prototype.forEach.call(ph.querySelectorAll("[id^='pharmacy']"), function (el) {
        var core = el.id.substring("pharmacy".length);
        if (core && seq.indexOf(core) < 0) seq.push(core);
      });
      if (!seq.length) return;
      var groups = [];
      Array.prototype.forEach.call(od.querySelectorAll(".form-group"), function (g) {
        var el = g.querySelector("[id^='order']");
        if (el) groups.push({ g: g, core: el.id.substring("order".length), orig: groups.length });
      });
      if (!groups.length) return;
      var parent = groups[0].g.parentNode;
      var sorted = groups.slice().sort(function (a, b) {
        var ca = ORDER_TO_PH_CORE[a.core] || a.core;
        var cb = ORDER_TO_PH_CORE[b.core] || b.core;
        var ia = seq.indexOf(ca), ib = seq.indexOf(cb);
        if (ia < 0 && ib < 0) return Math.min(a.orig, b.orig) - Math.max(a.orig, b.orig);
        if (ia < 0) return 1;
        if (ib < 0) return -1;
        return ia - ib;
      });
      sorted.forEach(function (it) { parent.appendChild(it.g); });
    } catch (e) {}
  }
  function wrapFormLayoutMirror() {
    var of = window.applyFullFormLayout;
    if (typeof of !== "function" || of._v20mirror) return;
    var w = function (tabId) {
      var r = of.apply(this, arguments);
      if (tabId === "tab-pharmacies" || tabId === "pharmacy") setTimeout(mirrorPharmacyOrderToOrders, 60);
      return r;
    };
    w._v20mirror = true;
    window.applyFullFormLayout = w;
  }


  /* ---------- ۱۲) تثبیت شناسه‌ها + مدیر نام داروخانه/پزشک و وابستگی‌ها ---------- */
  function v20EntityRows(kind, query) {
    var S = st() || {}, q = norm(query), list = kind === "pharmacy" ? (S.pharmacies || []) : (S.doctors || []);
    if (q.length < 2) return "<div class='v20-mini'>برای جلوگیری از کشیده‌شدن صفحه، حداقل ۲ حرف از نام یا اطلاعات را جستجو کنید.</div>";
    var hits = list.slice().reverse().filter(function (r) {
      return norm([r.name, r.province, r.city, r.district, r.address, r.phone, r.specialty].join(" ")).indexOf(q) >= 0;
    }).slice(0, 50);
    if (!hits.length) return "<div class='v20-mini'>نتیجه‌ای پیدا نشد.</div>";
    return hits.map(function (r) {
      var sub = [r.province, r.city, r.district, r.address, r.phone, r.specialty].filter(Boolean).join("، ");
      return "<div class='v20-opt-row' data-entity='" + kind + "' data-id='" + esc(r.id) + "'>" +
        "<span><strong>" + esc(r.name || "بدون نام") + "</strong><small style='display:block;color:#64748b'>" + esc(sub || "بدون اطلاعات تکمیلی") + "</small></span>" +
        "<button type='button' class='v20-ent-edit' title='ویرایش نام و همه وابستگی‌ها'>✏️</button>" +
        "<button type='button' class='v20-ent-del' title='حذف رکورد و وابستگی‌ها'>🗑️</button></div>";
    }).join("");
  }
  function v20EntityRecordsHtml(kind) {
    var title = kind === "pharmacy" ? "جستجو و مدیریت نام داروخانه" : "جستجو و مدیریت نام پزشک";
    return "<div class='v20-combo-card v20-entity-card'><h5>🗂️ " + title + "</h5>" +
      "<div class='v20-mini'>هیچ فهرست بلندبالایی بارگذاری نمی‌شود؛ فقط نتیجه جستجو، حداکثر ۵۰ مورد، نمایش داده می‌شود.</div>" +
      "<div class='v20-card-tools'><input class='v20-ent-search' placeholder='🔍 حداقل ۲ حرف جستجو کنید...'></div>" +
      "<div class='v20-entity-rows'>" + v20EntityRows(kind, "") + "</div></div>";
  }
  function v20RenderEntityManager() {
    var mgr = document.querySelector("#addTabPanel .v20-addmgr");
    if (!mgr) return;
    var old = mgr.querySelector(".v20-entity-grid"); if (old) old.remove();
    if (v20AddPane !== "tab-pharmacies" && v20AddPane !== "tab-doctors") return;
    var grid = document.createElement("div"); grid.className = "v20-cards v20-entity-grid"; grid.style.marginTop = "14px";
    grid.innerHTML = v20EntityRecordsHtml(v20AddPane === "tab-pharmacies" ? "pharmacy" : "doctor");
    mgr.appendChild(grid);
    var search = grid.querySelector(".v20-ent-search");
    if (search) search.addEventListener("input", function () {
      var rows = grid.querySelector(".v20-entity-rows");
      if (rows) rows.innerHTML = v20EntityRows(v20AddPane === "tab-pharmacies" ? "pharmacy" : "doctor", search.value);
    });
    grid.addEventListener("click", function (e) {
      var row = e.target.closest && e.target.closest(".v20-opt-row"); if (!row) return;
      var kind = row.getAttribute("data-entity"), id = row.getAttribute("data-id"), S = st();
      var arr = kind === "pharmacy" ? S.pharmacies : S.doctors;
      var rec = (arr || []).filter(function (x) { return String(x.id) === String(id); })[0]; if (!rec) return;
      if (e.target.closest(".v20-ent-edit")) {
        var nn = prompt("نام جدید را وارد کنید؛ همه اطلاعات وابسته هم اصلاح می‌شود:", rec.name || "");
        if (nn == null || !String(nn).trim()) return; nn = String(nn).trim(); var oldName = rec.name;
        rec.name = nn;
        if (kind === "pharmacy") (S.orders || []).forEach(function (o) { if (String(o.pharmacyId || "") === String(id) || o.pharmacyName === oldName) { o.pharmacyName = nn; o.pharmacyId = id; } });
        [S.visits || [], S.activityLog || [], S.repRoutes || []].forEach(function (a) { a.forEach(function (x) { if (x.doctorName === oldName) x.doctorName = nn; if (x.pharmacyName === oldName) x.pharmacyName = nn; }); });
        save(); window.v20RenderComboManager(); v20Toast("✅ نام و همه ارجاع‌های وابسته ویرایش شد.");
      }
      if (e.target.closest(".v20-ent-del")) {
        var deps = kind === "pharmacy" ? (S.orders || []).filter(function (o) { return String(o.pharmacyId || "") === String(id) || o.pharmacyName === rec.name; }).length :
          (S.visits || []).filter(function (v) { return String(v.doctorId || "") === String(id) || v.doctorName === rec.name; }).length;
        if (!confirm("«" + rec.name + "» و " + deps + " رکورد وابسته حذف شود؟ این کار قابل بازگشت نیست.")) return;
        if (kind === "pharmacy") { S.pharmacies = arr.filter(function (x) { return x.id !== id; }); S.orders = (S.orders || []).filter(function (o) { return !(String(o.pharmacyId || "") === String(id) || o.pharmacyName === rec.name); }); }
        else { S.doctors = arr.filter(function (x) { return x.id !== id; }); S.visits = (S.visits || []).filter(function (v) { return !(String(v.doctorId || "") === String(id) || v.doctorName === rec.name); }); }
        save(); window.v20RenderComboManager(); v20Toast("✅ رکورد و اطلاعات وابسته حذف شد.");
      }
    });
  }

  /* ---------- ۱۳) پیام هم‌نام کنار همان فیلد + جایگذاری دقیق ---------- */
  function v20SetValue(id, value) {
    var el = $(id); if (!el) return;
    el.disabled = false; el.value = value == null ? "" : value;
    try { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {}
    var combo = el.closest && el.closest(".crm-combo"); var vis = combo && combo.querySelector(".crm-combo-input"); if (vis) vis.value = el.options && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : el.value;
  }
  function v20PlaceMatchNearInput() {
    var inp = $("orderPharmacyName"), box = $("existingPharmacyTopAlert"); if (!inp || !box) return;
    var group = inp.closest(".form-group") || inp.parentNode;
    if (group) group.style.position = "relative";
    if (group && box.parentNode !== group) group.appendChild(box);
    box.classList.add("v20-local-match"); box.style.width = "";
  }
  function v20FillOrderPharmacy() {
    var S = st(), mid = ($("orderPharmacyMatchedId") || {}).value, name = String(($("orderPharmacyName") || {}).value || "").trim();
    var rec = ((S && S.pharmacies) || []).filter(function (p) { return String(p.id) === String(mid) || p.name === name; })[0];
    if (!rec) { v20Toast("داروخانه انتخاب‌شده پیدا نشد."); return; }
    v20SetValue("orderPharmacyName", rec.name); v20SetValue("orderPharmacyMatchedId", rec.id);
    v20SetValue("orderProvince", rec.province); try { if (typeof populateCities === "function") populateCities(rec.province, $("orderCity"), rec.city); } catch (e) {}
    v20SetValue("orderCity", rec.city); try { if (typeof populateDistricts === "function") populateDistricts(rec.province, rec.city, $("orderDistrict"), rec.district); } catch (e2) {}
    v20SetValue("orderDistrict", rec.district); v20SetValue("orderAddress", rec.address);
    var phFields = (S.customFields && S.customFields.pharmacy) || [], orFields = (S.customFields && S.customFields.order) || [];
    phFields.forEach(function (f) { var of = orFields.filter(function (x) { return x.id === "ordm-" + f.id || x.label === f.label; })[0]; if (of) v20SetValue(of.id, (rec.customFields || {})[f.label]); });
    v20ApplyOrderLock();var alertBox=$("existingPharmacyTopAlert"),pickBox=$("orderPharmacyPickBox");if(alertBox)alertBox.style.display="none";if(pickBox){pickBox.hidden=true;pickBox.style.display="none";pickBox.innerHTML="";}v20Toast("✅ همه اطلاعات داروخانه دقیقاً در فیلدهای متناظر جایگذاری شد.");
  }
  function bindOrderLocalMatch() {
    v20PlaceMatchNearInput();
    var btn = $("btnTopAutoFillPharmacy"); if (btn) btn.addEventListener("click", function (e) { e.preventDefault(); e.stopImmediatePropagation(); v20FillOrderPharmacy(); }, true);
    var inp = $("orderPharmacyName"); if (inp) inp.addEventListener("input", function () { setTimeout(v20PlaceMatchNearInput, 0); });
  }

  /* ---------- ۱۴) نسخه دقیق در هدر مدیر ---------- */
  function v20IsManager() {
    var logged = sessionStorage.getItem("crmLoggedIn") === "1", user = sessionStorage.getItem("crmUsername") || "", role = sessionStorage.getItem("crmUserRole") || "";
    return !logged || user === "admin" || /مدیر|سرپرست|admin/i.test(role);
  }
  function renderVersionBadge() {
    var b = $("v20VersionBadge"), actions = document.querySelector(".header-actions"); if (!actions) return;
    if (!b) { b = document.createElement("span"); b.id = "v20VersionBadge"; b.className = "v20-version"; b.textContent = "نسخه ۱۱.۲۱.۳"; b.title = "نسخه دقیق برنامه نصب‌شده"; actions.insertBefore(b, actions.firstChild); }
    b.style.display = v20IsManager() ? "inline-block" : "none";
  }

  /* ---------- ۱۵) متن ارسالی پویا، مطابق همه ستون‌های واقعی لیست ---------- */
  var SHARE_CORE = {
    pharmacy: [["name","نام داروخانه","name"],["repName","نام نماینده","repName"],["dateAdded","تاریخ ثبت","dateAdded"],["province","استان","province"],["city","شهر","city"],["district","منطقه","district"],["address","آدرس دقیق","address"],["phone","شماره تماس","phone"],["manager","مسئول داروخانه","manager"],["isPercentage","وضعیت درصدی","isPercentage"],["lat","عرض جغرافیایی","lat"],["lng","طول جغرافیایی","lng"]],
    doctor: [["name","نام پزشک","name"],["repName","نام نماینده","repName"],["dateAdded","تاریخ ثبت","dateAdded"],["specialty","تخصص","specialty"],["province","استان","province"],["city","شهر","city"],["district","منطقه","district"],["address","آدرس دقیق","address"],["phone","شماره تماس","phone"],["isPercentage","وضعیت درصدی","isPercentage"],["lat","عرض جغرافیایی","lat"],["lng","طول جغرافیایی","lng"]],
    order: [["pharmacyName","نام داروخانه","pharmacyName"],["repName","نام نماینده","repName"],["orderManager","نام مسئول سفارش","__manager"],["orderManagerPhone","شماره همراه مسئول سفارش","__managerPhone"],["orderDate","تاریخ","orderDate"],["province","استان","province"],["city","شهر","city"],["district","منطقه","district"],["address","آدرس","address"],["status","وضعیت","status"],["notes","توضیحات","notes"],["items","اقلام","items"],["totalAmount","مبلغ کل","totalAmount"]]
  };
  function dynamicShareFields(kind) {
    var S = st() || {}, out = [], seen = {};
    function add(id, label, getter) { if (!id || seen[id]) return; seen[id] = true; out.push({ id:id, label:label || id, get:getter }); }
    (SHARE_CORE[kind] || []).forEach(function (x) { add(x[0], x[1], function (r) {
      if (x[2] === "__manager" || x[2] === "__managerPhone") {
        var ph = ((st().pharmacies || []).filter(function (p) { return (r.pharmacyId && p.id === r.pharmacyId) || p.name === r.pharmacyName; })[0]) || {};
        return x[2] === "__manager" ? (r.orderManager || r.manager || ph.manager) : (r.orderManagerPhone || r.managerPhone || ph.managerPhone);
      }
      return r[x[2]];
    }); });
    // همه فیلدهای واقعی صفحه، حتی اگر در لیست اصلی مخفی باشند.
    try {
      var tab = kind === "pharmacy" ? "tab-pharmacies" : kind === "doctor" ? "tab-doctors" : "tab-orders";
      if (typeof window.getUnifiedFieldList === "function") (window.getUnifiedFieldList(tab) || []).forEach(function (f) {
        if (!f || !f.id || f.deleted || f.kind === "box" || f.kind === "widget" || f.kind === "ordercol") return;
        add(f.id, f.label || f.id, function (r) {
          if (r.customFields && Object.prototype.hasOwnProperty.call(r.customFields, f.label)) return r.customFields[f.label];
          return typeof window.builtinFieldValue === "function" ? window.builtinFieldValue(kind, f.id, r) : r[f.id];
        });
      });
      if (typeof window.extraListColumns === "function") (window.extraListColumns(kind) || []).forEach(function (c) {
        add(c.id, c.label || c.title, function (r) { return typeof window.builtinFieldValue === "function" ? window.builtinFieldValue(kind, c.id, r) : r[c.id]; });
      });
    } catch (e) {}
    (((S.customFields || {})[kind] || [])).filter(function (f) { return f && !f.deleted && f.showInList !== false; }).forEach(function (f) {
      add(f.id, f.label, function (r) { return (r.customFields || {})[f.label]; });
    });
    return out;
  }
  function shareSettings() { var S = st(); S.settings = S.settings || {}; S.settings.v20ShareFields = S.settings.v20ShareFields || {}; return S.settings.v20ShareFields; }
  function shareOrderSettings() { var S=st();S.settings=S.settings||{};S.settings.v20ShareOrder=S.settings.v20ShareOrder||{};return S.settings.v20ShareOrder; }
  function orderedShareFields(kind, fields) { var map=shareOrderSettings()[kind]||{};return fields.slice().sort(function(a,b){var aa=Number(map[a.id]),bb=Number(map[b.id]);if(!aa)aa=fields.indexOf(a)+1;if(!bb)bb=fields.indexOf(b)+1;return aa-bb;}); }
  function selectedShareIds(kind, fields) {
    var cfg = shareSettings();
    return Object.prototype.hasOwnProperty.call(cfg, kind) ? cfg[kind] : fields.map(function (f) { return f.id; });
  }
  function cleanItemsForShare(rec) {
    var items = (rec.items || []).filter(function (i) { return Number(i.count) > 0; });
    // پاکسازی امن رکوردهای ساخته‌شده با باگ قدیمی «خالی = ۱»؛ الگوی آن چند عدد ۱ کنار یک تعداد واقعی بود.
    if (!rec.quantityValidated) {
      var ones = items.filter(function (i) { return Number(i.count) === 1; });
      var real = items.filter(function (i) { return Number(i.count) > 1; });
      if (ones.length >= 2 && real.length >= 1) items = real;
    }
    return items;
  }
  function shareValue(rec, kind, f) {
    var v = f.get(rec);
    if (kind === "order" && f.id === "items") v = cleanItemsForShare(rec).map(function (i) { return (i.name || "کالا") + " = تعداد کالا: " + Number(i.count) + " / تعداد جایزه: " + Number(i.giftCount || 0); }).join("، ");
    if (kind === "order" && f.id === "orderDate") { var dm=normSnappDate(v).match(/^(\d{4})\/(\d{2})\/(\d{2})$/); if(dm)v=dm[3]+"/"+dm[2]+"/"+dm[1]; }
    if (kind === "order" && f.id === "totalAmount") {
      var clean = cleanItemsForShare(rec);
      if (!rec.quantityValidated) v = clean.reduce(function (sum, i) { return sum + (typeof calcOrderRowTotal === "function" ? calcOrderRowTotal(i.count, i.giftCount || 0, i.price || 0) : Number(i.count) * Number(i.price || 0)); }, 0);
      v = Number(v || 0).toLocaleString("fa-IR") + " ریال";
    }
    if (typeof v === "boolean") v = v ? "بله" : "خیر";
    if (v && typeof v === "object") v = JSON.stringify(v);
    return v == null || v === "" ? "—" : v;
  }
  function orderFixedBlock(rec){var items=cleanItemsForShare(rec),noVat=0,lines=["اقلام:"];items.forEach(function(i){var row=typeof calcOrderRowTotal==="function"?calcOrderRowTotal(i.count,i.giftCount||0,i.price||0):(Number(i.count)||0)*(Number(i.price)||0);noVat+=row;lines.push((i.name||"کالا")+" = تعداد کالا: "+Number(i.count||0).toLocaleString("fa-IR")+" / تعداد جایزه: "+(Number(i.giftCount||0)>0?Number(i.giftCount).toLocaleString("fa-IR"):"")+" / جمع مبلغ: "+Number(row||0).toLocaleString("fa-IR")+" ریال");});var vat=0;try{vat=Number(getOrderFormula().vat)||0;}catch(e){}var withVat=noVat+Math.round(noVat*vat/100);lines.push("مبلغ کل بدون ارزش افزوده: "+noVat.toLocaleString("fa-IR")+" ریال");lines.push("مبلغ کل با ارزش افزوده: "+withVat.toLocaleString("fa-IR")+" ریال");return lines.join("\n");}
  function buildLockedShare(rec, kind) {
    var fields = dynamicShareFields(kind), enabled = selectedShareIds(kind, fields);
    fields = orderedShareFields(kind, fields).filter(function(f){return enabled.indexOf(f.id)>=0;});
    if(kind!=="order")return fields.map(function(f){return f.label+": "+shareValue(rec,kind,f);}).join("\n");
    var out=[],inserted=false;fields.forEach(function(f){if(f.id==="items"||f.id==="totalAmount"||/total.*vat/i.test(f.id))return;out.push(f.label+": "+shareValue(rec,kind,f));if(f.id==="status"){out.push(orderFixedBlock(rec));inserted=true;}});if(!inserted)out.push(orderFixedBlock(rec));return out.join("\n\n");
  }
  function renderShareManager() {
    var host = $("messengerTogglesBox"); if (!host) return;
    var old = $("v20ShareManager"); if (old) old.remove();
    var box = document.createElement("div"); box.id = "v20ShareManager"; box.style.cssText = "margin-top:16px;border-top:2px solid #cbd5e1;padding-top:12px";
    box.innerHTML = "<h4>🔒 تعیین اطلاعات مجاز برای ارسال (فقط مدیر)</h4>" + ["pharmacy","doctor","order"].map(function (kind) {
      var title = kind === "pharmacy" ? "داروخانه" : kind === "doctor" ? "پزشک" : "سفارش", fields = dynamicShareFields(kind), on = selectedShareIds(kind, fields), om=shareOrderSettings()[kind]||{};
      fields=orderedShareFields(kind,fields);
      return "<fieldset style='margin:8px 0;padding:10px;border:1px solid #cbd5e1;border-radius:10px'><legend>" + title + " — همه فیلدهای صفحه</legend><div class='v20-share-grid'>" + fields.map(function (f,i) { return "<label class='v20-share-item'><input type='checkbox' data-kind='" + kind + "' data-field='" + esc(f.id) + "' " + (on.indexOf(f.id) >= 0 ? "checked" : "") + "><span>" + esc(f.label) + "</span><input type='number' min='1' class='v20-share-order' data-kind='"+kind+"' data-field='"+esc(f.id)+"' value='"+(Number(om[f.id])||i+1)+"' title='ترتیب ارسال'></label>"; }).join("") + "</div></fieldset>";
    }).join("") + "<div class='v20-mini'>حذف/افزودن ستون در لیست اصلی، این بخش را هم خودکار به‌روز می‌کند. تیک برداشته‌شده قطعاً از متن ارسال حذف می‌شود.</div>";
    host.appendChild(box);
    box.addEventListener("change", function () { var cfg = shareSettings(),ord=shareOrderSettings(); ["pharmacy","doctor","order"].forEach(function (k) { cfg[k] = Array.prototype.map.call(box.querySelectorAll("input[type=checkbox][data-kind='" + k + "']:checked"), function (i) { return i.getAttribute("data-field"); });ord[k]=ord[k]||{};Array.prototype.forEach.call(box.querySelectorAll(".v20-share-order[data-kind='"+k+"']"),function(i){ord[k][i.getAttribute("data-field")]=parseInt(i.value,10)||999;}); }); save(); v20Toast("✅ فیلدها و ترتیب ارسال ذخیره شد.");setTimeout(renderShareManager,80); });
  }
  function wrapShareModal() {
    var old = window.openRowDetailsModal; if (typeof old !== "function" || old._v20share) return;
    var w = function (rec, kind) {
      var r = old.apply(this, arguments), text = buildLockedShare(rec, kind), detail=$("rowDetailsContentBox");if(detail)detail.innerHTML=text.split("\n").map(function(line){var p=line.indexOf(":");return"<div style='padding:5px 0;border-bottom:1px solid #e2e8f0'><strong>"+esc(p>=0?line.slice(0,p+1):"")+"</strong> "+esc(p>=0?line.slice(p+1).trim():line)+"</div>";}).join("");var map = {btnShareBale:"https://ble.ir/share?text=",btnShareEitaa:"https://eitaa.com/share/url?url=&text=",btnShareTelegram:"https://t.me/share/url?url=&text=",btnShareSoroush:"https://splus.ir/share?text=",btnShareWhatsApp:"https://api.whatsapp.com/send?text="};
      Object.keys(map).forEach(function (id) { var b=$(id); if(b)b.onclick=function(){window.open(map[id]+encodeURIComponent(text),"_blank");}; });
      var cp=$("btnRowCopyText"); if(cp)cp.onclick=function(){navigator.clipboard.writeText(text).then(function(){v20Toast("متن دقیقاً طبق تیک‌های مدیر کپی شد.");});}; return r;
    };
    w._v20share = true; window.openRowDetailsModal = w;
  }

  /* ---------- ۱۶) GPS واقعی، کارت آمار، سابقه و جستجو/اکسل رصد ---------- */
  var v20Watch = null, v20VisitTimer = null;
  function hav(a,b){if(!a||!b)return 0;var R=6371000,p=Math.PI/180,d1=(b.lat-a.lat)*p,d2=(b.lng-a.lng)*p,x=Math.sin(d1/2)*Math.sin(d1/2)+Math.cos(a.lat*p)*Math.cos(b.lat*p)*Math.sin(d2/2)*Math.sin(d2/2);return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
  function visitDate(){return new Date().toLocaleDateString("fa-IR",{timeZone:"Asia/Tehran"});}
  function ensureVisitCards(){var stBox=$("visitStatusBox");if(!stBox)return null;var h=$("v20VisitMetrics");if(!h){h=document.createElement("div");h.id="v20VisitMetrics";h.className="v20-visit-metrics";stBox.parentNode.insertBefore(h,stBox.nextSibling);}return h;}
  function refreshVisitCards(){var S=st(),v=S&&S.v20ActiveVisit,h=ensureVisitCards();if(!h)return;var dur=v?Math.max(0,Math.floor((Date.now()-v.startedAt)/1000)):0;h.innerHTML=[["مسافت طی‌شده",Math.round(v?v.distance:0)+" متر"],["مدت توقف",Math.round((v?v.stopMs:0)/60000)+" دقیقه"],["نقاط ثبت‌شده",v?(v.points||[]).length:0],["ساعت شروع",v?v.startTime:"—"]].map(function(x){return "<div class='v20-metric'>"+x[0]+"<b>"+x[1]+"</b></div>";}).join("");var sb=$("visitStatusBox");if(sb&&v)sb.textContent="GPS متصل است — مدت فعالیت: "+Math.floor(dur/60)+" دقیقه و "+(dur%60)+" ثانیه";}
  function startV20Visit(){var S=st();if(S.v20ActiveVisit){v20Toast("یک ویزیت هم‌اکنون فعال است.");return;}if(!navigator.geolocation){alert("این دستگاه GPS یا دسترسی موقعیت مکانی ندارد.");return;}var rep=sessionStorage.getItem("crmUserName")||"نماینده";S.v20ActiveVisit={id:"route-"+Date.now(),repName:rep,date:visitDate(),startedAt:Date.now(),startTime:new Date().toLocaleTimeString("fa-IR"),points:[],distance:0,stopMs:0,lastMoveAt:Date.now()};save();
    v20Watch=navigator.geolocation.watchPosition(function(pos){var V=st().v20ActiveVisit;if(!V)return;var p={lat:pos.coords.latitude,lng:pos.coords.longitude,t:Date.now(),acc:pos.coords.accuracy};var prev=V.points[V.points.length-1],d=hav(prev,p);if(d>=3){V.distance+=d;V.lastMoveAt=p.t;}else if(prev){V.stopMs+=Math.max(0,p.t-prev.t);}V.points.push(p);save(false);refreshVisitCards();},function(err){alert(err.code===1?"برای شروع ویزیت، اجازه موقعیت مکانی (GPS) را در مرورگر فعال کنید.":"اتصال GPS برقرار نشد؛ دوباره تلاش کنید.");},{enableHighAccuracy:true,maximumAge:0,timeout:15000});
    clearInterval(v20VisitTimer);v20VisitTimer=setInterval(refreshVisitCards,1000);refreshVisitCards();v20Toast("✅ GPS متصل شد و ثبت مسیر آغاز شد.");}
  function stopV20Visit(){var S=st(),V=S&&S.v20ActiveVisit;if(!V){v20Toast("ویزیت فعالی وجود ندارد.");return;}if(v20Watch!=null)navigator.geolocation.clearWatch(v20Watch);v20Watch=null;clearInterval(v20VisitTimer);V.endTime=new Date().toLocaleTimeString("fa-IR");V.endedAt=Date.now();V.durationMs=V.endedAt-V.startedAt;V.status="پایان‌یافته";V.path=(V.points||[]).map(function(p){return[p.lat,p.lng];});V.visited=(V.points||[]).length;V.pending=0;V.lastStop=V.points.length?"آخرین نقطه GPS":"بدون نقطه";S.repRoutes=S.repRoutes||[];S.repRoutes.unshift(V);S.visitTracks=S.visitTracks||[];S.visitTracks.unshift(V);S.v20ActiveVisit=null;save();refreshVisitCards();renderV20Routes();v20Toast("✅ همه فعالیت‌ها با تاریخ در رصد تردد ذخیره شد.");}
  function bindV20Visit(){var b1=$("btnStartVisit"),b2=$("btnEndVisit");if(b1){var n1=b1.cloneNode(true);b1.parentNode.replaceChild(n1,b1);n1.addEventListener("click",startV20Visit);}if(b2){var n2=b2.cloneNode(true);b2.parentNode.replaceChild(n2,b2);n2.addEventListener("click",stopV20Visit);}refreshVisitCards();}
  function ensureRouteTools(){var body=$("tableRepRoutesBody");if(!body)return;var table=body.closest("table"),wrap=table&&table.parentNode;if(!wrap||$("v20RouteTools"))return;var d=document.createElement("div");d.id="v20RouteTools";d.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;align-items:center";d.innerHTML="<input id='v20RouteSearch' class='form-input' style='max-width:360px' placeholder='🔍 جستجوی لحظه‌ای نماینده، تاریخ یا وضعیت...'><button type='button' id='v20RouteRefresh' class='btn btn-outline btn-sm'>🔄 بروزرسانی نقشه تردد</button><button type='button' id='v20RouteAll' class='btn btn-outline btn-sm'>👥 همه نمایندگان</button><button type='button' id='v20RouteClear' class='btn btn-outline btn-sm'>✖ پاک‌کردن جستجو</button><button type='button' id='v20RouteExcel' class='btn btn-primary btn-excel'>📊 خروجی اکسل</button>";wrap.insertBefore(d,table);$("v20RouteSearch").addEventListener("input",renderV20Routes);$("v20RouteExcel").addEventListener("click",exportV20Routes);$("v20RouteRefresh").addEventListener("click",function(){var b=$("btnRefreshRepRoutesMap");if(b)b.click();setTimeout(renderV20Routes,80);});$("v20RouteAll").addEventListener("click",function(){var s=$("routeRepFilterSelect");if(s)s.value="";var b=$("btnRefreshRepRoutesMap");if(b)b.click();setTimeout(renderV20Routes,80);});$("v20RouteClear").addEventListener("click",function(){$("v20RouteSearch").value="";renderV20Routes();});}
  function renderV20Routes(){ensureRouteTools();var body=$("tableRepRoutesBody");if(!body)return;var q=String(($("v20RouteSearch")||{}).value||"").toLowerCase(),rep=String(($("routeRepFilterSelect")||{}).value||"");var rows=((st()&&st().repRoutes)||[]).slice().sort(function(a,b){return Number(b.endedAt||b.startedAt||0)-Number(a.endedAt||a.startedAt||0);}).filter(function(r){return(!rep||r.repName===rep)&&(!q||[r.repName,r.date,r.status,r.startTime,r.endTime].join(" ").toLowerCase().indexOf(q)>=0);});var table=body.closest("table"),head=table&&table.querySelector("thead tr");if(head)head.innerHTML="<th>ردیف</th><th>نام نماینده</th><th>تاریخ</th><th>شروع</th><th>پایان</th><th>مسافت (متر)</th><th>توقف (دقیقه)</th><th>نقاط</th><th>وضعیت</th>";body.innerHTML=rows.map(function(r,i){return"<tr><td>"+(i+1)+"</td><td><strong>"+esc(r.repName||"—")+"</strong></td><td>"+esc(r.date||"—")+"</td><td>"+esc(r.startTime||"—")+"</td><td>"+esc(r.endTime||"—")+"</td><td>"+Math.round(r.distance||0)+"</td><td>"+Math.round((r.stopMs||0)/60000)+"</td><td>"+((r.points||[]).length||r.visited||0)+"</td><td>"+esc(r.status||"—")+"</td></tr>";}).join("");}
  function exportV20Routes(){var rows=((st()&&st().repRoutes)||[]).slice().sort(function(a,b){return Number(b.endedAt||0)-Number(a.endedAt||0);}).map(function(r,i){return[i+1,r.repName||"—",r.date||"—",r.startTime||"—",r.endTime||"—",Math.round(r.distance||0),Math.round((r.stopMs||0)/60000),(r.points||[]).length,r.status||"—"];});window.downloadCSVFile("rep-routes.xls",["ردیف","نام نماینده","تاریخ","ساعت شروع","ساعت پایان","مسافت (متر)","توقف (دقیقه)","نقاط","وضعیت"],rows);}

  /* ---------- ۱۷) آدرس ریز تا کوچه/پلاک ---------- */
  window.reverseGeocodeCoordinates = async function(lat,lng){try{var res=await fetch("/api/reverse?lat="+encodeURIComponent(lat)+"&lng="+encodeURIComponent(lng)+"&zoom=18");var d=await res.json();if(d&&d.display_name){var a=d.address||{},parts=[a.house_number,a.road||a.pedestrian||a.footway,a.neighbourhood||a.quarter,a.suburb,a.city_district,a.city||a.town||a.village,a.state].filter(Boolean);var precise=parts.join("، ");return precise&&precise.length>=d.display_name.length*.45?precise:d.display_name;}}catch(e){}return"موقعیت "+Number(lat).toFixed(6)+"، "+Number(lng).toFixed(6);};

  /* ---------- ۱۸) همه لیست‌های قدیمی هم تازه‌ترین در بالا ---------- */
  function wrapNewestTables(){["renderActivityLogTable","renderRepRoutesTable","renderRepHomesTable","renderLeavesTable","renderMonthlyReportsTable","renderNotificationsTable","renderSalesTargetsTable","renderCustomFieldsTable"].forEach(function(n){var old=window[n];if(typeof old!=="function"||old._v20newest)return;var w=function(){var r=old.apply(this,arguments);setTimeout(function(){var map={renderActivityLogTable:"tableActivityLogBody",renderRepRoutesTable:"tableRepRoutesBody",renderRepHomesTable:"tableRepHomesBody",renderLeavesTable:"tableLeavesBody",renderMonthlyReportsTable:"tableMonthlyReportsBody",renderNotificationsTable:"tableNotificationsBody",renderSalesTargetsTable:"tableSalesTargetsBody",renderCustomFieldsTable:"tableCustomFieldsBody"},tb=$(map[n]);if(tb){var rows=Array.prototype.slice.call(tb.children).reverse();rows.forEach(function(x){tb.appendChild(x);});}},0);return r;};w._v20newest=true;window[n]=w;});}

  /* ---------- ۱۹) پاک‌سازی نام سفارش و ذخیره قطعی تنظیمات کالا ---------- */
  function clearOrderPharmacyDraft() {
    if (String(($("orderEditId") || {}).value || "")) return;
    v20SetValue("orderPharmacyName", ""); v20SetValue("orderPharmacyMatchedId", "");
    var box = $("existingPharmacyTopAlert"), picks = $("orderPharmacyPickBox");
    if (box) box.style.display = "none";
    if (picks) { picks.hidden = true; picks.innerHTML = ""; }
    v20ApplyOrderLock();
  }
  function bindOrderResetProof() {
    var btn = $("btnSaveOrder"), form = $("formOrder");
    if (btn) btn.addEventListener("click", function () {
      var S = st(), before = JSON.stringify((S.orders || []).map(function (o) { return [o.id,o.pharmacyName,o.totalAmount,(o.items||[]).length]; }));
      setTimeout(function () { var S2=st(), after=JSON.stringify((S2.orders||[]).map(function(o){return[o.id,o.pharmacyName,o.totalAmount,(o.items||[]).length];})); if(after!==before) clearOrderPharmacyDraft(); }, 350);
    }, true);
    if (form) form.addEventListener("reset", function () { setTimeout(clearOrderPharmacyDraft, 20); });
  }
  function productFieldRecord(id) {
    var S=st(); S.customFields=S.customFields||{}; S.customFields.products=S.customFields.products||[];
    var c=S.customFields.products.filter(function(f){return f&&f.id===id;})[0];
    if(c)return c;
    S.formFieldMeta=S.formFieldMeta||{};S.formFieldMeta.products=S.formFieldMeta.products||{};S.formFieldMeta.products[id]=S.formFieldMeta.products[id]||{};return S.formFieldMeta.products[id];
  }
  function applyProductSettings() {
    var S=st(); if(!S)return; var all={}, meta=((S.formFieldMeta||{}).products)||{};
    Object.keys(meta).forEach(function(id){all[id]=meta[id];});
    ((((S.customFields||{}).products)||[])).forEach(function(f){if(f&&f.id)all[f.id]=f;});
    Object.keys(all).forEach(function(id){var f=all[id]||{},el=$(id)||$("v20pf_"+id)||document.querySelector('[data-custom-field-id="'+id+'"]');if(!el)return;var g=el.closest(".form-group")||el;if(Number(f.order)>0)g.style.setProperty("order",String(Number(f.order)),"important");if(Number(f.size)>=60){el.style.setProperty("width",Number(f.size)+"px","important");el.style.setProperty("max-width","100%","important");}if(Number(f.height)>=24){el.style.setProperty("height",Number(f.height)+"px","important");el.style.setProperty("min-height",Number(f.height)+"px","important");}});
  }
  function bindProductPersistence() {
    document.addEventListener("change",function(e){var t=e.target, map={"v19-pf-ord":"order","v19-pf-lord":"listOrder","v19-pf-size":"size","v19-pf-h":"height"},key="";Object.keys(map).forEach(function(c){if(t.classList&&t.classList.contains(c))key=map[c];});if(!key)return;var id=t.getAttribute("data-fid"),n=parseInt(t.value,10);if(!id||!isFinite(n))return;productFieldRecord(id)[key]=n;save();applyProductSettings();v20Toast("✅ ترتیب و اندازه کالا ذخیره شد.");},true);
    document.addEventListener("click",function(e){if(e.target&&e.target.id==="btnAddProductField")setTimeout(function(){var S=st(),f=(((S.customFields||{}).products)||[]).slice(-1)[0];if(!f)return;var ids={order:"prodNewFieldOrder",listOrder:"prodNewFieldListOrder",size:"prodNewFieldSize",height:"prodNewFieldHeight"};Object.keys(ids).forEach(function(k){var n=parseInt((($(ids[k])||{}).value),10);if(isFinite(n)&&n>0)f[k]=n;});save();applyProductSettings();v20Toast("✅ فیلد کالا و همه تنظیماتش ذخیره شد.");},180);},true);
    var oldSave=window.saveState;if(typeof oldSave==="function"&&!oldSave._v20product){var w=function(){var r=oldSave.apply(this,arguments);setTimeout(applyProductSettings,20);return r;};w._v20product=true;window.saveState=w;}
  }

  /* ---------- ۲۰) اسنپ سازمانی: ورود امن فایل، گزارش و تجمیع ---------- */
  var SNAPP_COLS = [0,1,4,8,11,14,17,18,23], snappFilteredRows = [];
  function enDigits(v){var fa="۰۱۲۳۴۵۶۷۸۹",ar="٠١٢٣٤٥٦٧٨٩";return String(v==null?"":v).replace(/[۰-۹]/g,function(c){return fa.indexOf(c);}).replace(/[٠-٩]/g,function(c){return ar.indexOf(c);});}
  function faDate(d){try{var parts=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"Asia/Tehran"}).formatToParts(d),o={};parts.forEach(function(x){o[x.type]=enDigits(x.value);});return o.year+"/"+o.month.padStart(2,"0")+"/"+o.day.padStart(2,"0");}catch(e){return"";}}
  function normSnappDate(v){var raw=enDigits(v).trim();if(/^\d+(\.\d+)?$/.test(raw)&&Number(raw)>30000){var d=new Date(Date.UTC(1899,11,30)+Number(raw)*86400000);return faDate(d);}var m=raw.match(/(1[34]\d{2})[^0-9]?(\d{1,2})[^0-9]?(\d{1,2})/);if(m)return m[1]+"/"+m[2].padStart(2,"0")+"/"+m[3].padStart(2,"0");var g=raw.match(/(20\d{2})[^0-9]?(\d{1,2})[^0-9]?(\d{1,2})/);if(g)return faDate(new Date(Number(g[1]),Number(g[2])-1,Number(g[3])));return raw;}
  function snappNumber(v){var s=enDigits(v).replace(/[,٬،\sریالتومان]/g,"").replace(/[()]/g,function(x){return x==="("?"-":"";});var n=Number(s);return isFinite(n)?n:0;}
  function parseDelimited(text){text=String(text||"").replace(/^\uFEFF/,"");var first=(text.split(/\r?\n/)[0]||""),ds=[["\t",(first.match(/\t/g)||[]).length],[",",(first.match(/,/g)||[]).length],[";",(first.match(/;/g)||[]).length]],del=ds.sort(function(a,b){return b[1]-a[1];})[0][0],rows=[],row=[],cell="",q=false;for(var i=0;i<text.length;i++){var c=text[i];if(c==='"'){if(q&&text[i+1]==='"'){cell+='"';i++;}else q=!q;}else if(!q&&c===del){row.push(cell);cell="";}else if(!q&&(c==='\n'||c==='\r')){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(function(x){return String(x).trim();}))rows.push(row);row=[];cell="";}else cell+=c;}row.push(cell);if(row.some(function(x){return String(x).trim();}))rows.push(row);return rows;}
  function u16(a,p){return a[p]|(a[p+1]<<8);}function u32(a,p){return (u16(a,p)|(u16(a,p+2)<<16))>>>0;}
  async function unzipEntry(buf,name){var a=new Uint8Array(buf),e=-1;for(var i=a.length-22;i>=Math.max(0,a.length-65558);i--){if(u32(a,i)===0x06054b50){e=i;break;}}if(e<0)throw Error("ساختار ZIP اکسل پیدا نشد");var count=u16(a,e+10),pos=u32(a,e+16),dec=new TextDecoder("utf-8");for(var n=0;n<count;n++){if(u32(a,pos)!==0x02014b50)break;var method=u16(a,pos+10),size=u32(a,pos+20),nl=u16(a,pos+28),xl=u16(a,pos+30),cl=u16(a,pos+32),local=u32(a,pos+42),fn=dec.decode(a.slice(pos+46,pos+46+nl));if(fn===name){var lnl=u16(a,local+26),lxl=u16(a,local+28),data=a.slice(local+30+lnl+lxl,local+30+lnl+lxl+size);if(method===0)return dec.decode(data);if(method!==8||typeof DecompressionStream==="undefined")throw Error("مرورگر امکان بازکردن این فایل XLSX را ندارد");var stream=new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));return dec.decode(await new Response(stream).arrayBuffer());}pos+=46+nl+xl+cl;}return"";}
  async function parseXlsx(file){var buf=await file.arrayBuffer(),ssxml=await unzipEntry(buf,"xl/sharedStrings.xml"),sheet=await unzipEntry(buf,"xl/worksheets/sheet1.xml");if(!sheet)throw Error("برگه اول اکسل پیدا نشد");var xp=new DOMParser(),shared=[];if(ssxml){var sd=xp.parseFromString(ssxml,"text/xml");Array.prototype.forEach.call(sd.querySelectorAll("si"),function(si){shared.push(Array.prototype.map.call(si.querySelectorAll("t"),function(t){return t.textContent;}).join(""));});}var doc=xp.parseFromString(sheet,"text/xml"),out=[];Array.prototype.forEach.call(doc.querySelectorAll("sheetData row"),function(r){var row=[];Array.prototype.forEach.call(r.querySelectorAll("c"),function(c){var ref=c.getAttribute("r")||"A1",letters=(ref.match(/[A-Z]+/)||["A"])[0],idx=0;for(var j=0;j<letters.length;j++)idx=idx*26+letters.charCodeAt(j)-64;idx--;var type=c.getAttribute("t"),v=(c.querySelector("v")||{}).textContent||"";if(type==="s")v=shared[Number(v)]||"";else if(type==="inlineStr")v=Array.prototype.map.call(c.querySelectorAll("t"),function(t){return t.textContent;}).join("");row[idx]=v;});out.push(row.map(function(x){return x==null?"":x;}));});return out;}
  async function parseSnappFile(file){var ext=(file.name.split(".").pop()||"").toLowerCase();if(ext==="xlsx")return parseXlsx(file);var text=await file.text();if(ext==="xls"&&text.indexOf("<table")>=0){var doc=new DOMParser().parseFromString(text,"text/html");return Array.prototype.map.call(doc.querySelectorAll("tr"),function(tr){return Array.prototype.map.call(tr.querySelectorAll("th,td"),function(td){return td.textContent.trim();});});}return parseDelimited(text);}
  function snappStore(){var S=st();S.snappCorporate=S.snappCorporate||{};var D=S.snappCorporate;D.headers=D.headers||[];D.rows=D.rows||[];D.files=D.files||[];D.topupHeaders=D.topupHeaders||[];D.topups=D.topups||[];D.topupFiles=D.topupFiles||[];D.tripImports=D.tripImports||[];D.topupImports=D.topupImports||[];var oldCount=D.rows.length+D.topups.length,seen={};D.rows=D.rows.filter(function(r){var k=rowSignature(r);if(seen[k])return false;seen[k]=1;return true;});seen={};D.topups=D.topups.filter(function(r){var k=rowSignature(r);if(seen[k])return false;seen[k]=1;return true;});if(D.rows.length+D.topups.length<oldCount)setTimeout(function(){try{saveState(false);}catch(e){}},0);return D;}
  function snappIndexes(headers){function find(re,fb){for(var i=0;i<headers.length;i++)if(re.test(String(headers[i])))return i;return fb;}return{date:find(/تاریخ.*(سفر|درخواست|انجام)|تاریخ/,0),rep:find(/نماینده|مسافر|کارمند|درخواست.?کننده|نام و نام خانوادگی/,1),amount:find(/مبلغ.*(کل|پرداخت)|هزینه|کرایه|قیمت/,23)};}
  function normPerson(v){return norm(String(v||"").replace(/(^|[\s،,])(سرکار\s*خانم|جناب\s*آقای?|آقای?|اقای?|آقا|اقا|خانم)(?=\s|$)/g," "));}
  function personMatch(a,b){a=normPerson(a);b=normPerson(b);return !!a&&!!b&&(a===b||(a.length>=4&&b.indexOf(a)>=0)||(b.length>=4&&a.indexOf(b)>=0));}
  function splitSnappDateTime(v){var s=enDigits(v).trim(),m=s.match(/(1[34]\d{2}[\/\-]\d{1,2}[\/\-]\d{1,2})\s*(.*)/);return{date:m?normSnappDate(m[1]):normSnappDate(s),time:m?(m[2]||"—"):"—"};}
  function tripSchema(h){function ix(name,fb){for(var i=0;i<h.length;i++)if(norm(h[i])===norm(name))return i;return fb;}return{start:ix("تاریخ و ساعت شروع سفر",0),end:ix("تاریخ و ساعت پایان سفر",1),rep:ix("نام مسافر",2),origin:ix("مبدأ",3),dest:ix("مقصد",4),dest2:ix("مقصد دوم",5),service:ix("نوع سرویس",6),amount:ix("هزینه",7),city:ix("شهر",8)};}
  function findHeaderRow(rows,type){var best=0,score=-1;for(var i=0;i<Math.min(rows.length,25);i++){var r=rows[i]||[],txt=r.join(" "),non=r.filter(function(x){return String(x).trim();}).length,s=non+(type==="topup"&&/تاریخ/.test(txt)&&/افزایش.*موجودی/.test(txt)?100:0)+(type==="trip"&&/تاریخ|مبلغ|سفر|مسافر/.test(txt)?20:0);if(s>score){score=s;best=i;}}return best;}
  function repairSnappHeaders(D){if((!D.headers.length||D.headers.every(function(x,i){return !x||/^ستون\s*\d+/.test(String(x));}))&&D.rows.length){var hi=findHeaderRow(D.rows,"trip"),cand=D.rows[hi];if(cand&&cand.filter(Boolean).length>2){D.headers=cand.slice();D.rows.splice(hi,1);}}}
  function temporalMode(prefix){if($(prefix+"ModeMonth")&&$(prefix+"ModeMonth").checked)return"month";if($(prefix+"ModeYear")&&$(prefix+"ModeYear").checked)return"year";if(($(prefix+"ModeFrom")&&$(prefix+"ModeFrom").checked)||($(prefix+"ModeTo")&&$(prefix+"ModeTo").checked))return"range";return"all";}
  function snappFilters(){return{mode:temporalMode("snappTrip"),year:enDigits(($("snappFilterYear")||{}).value||""),month:enDigits(($("snappFilterMonth")||{}).value||""),rep:String(($("snappFilterRep")||{}).value||""),from:normSnappDate(($("snappFilterFrom")||{}).value||""),to:normSnappDate(($("snappFilterTo")||{}).value||"")};}
  function datePass(d,f){d=normSnappDate(d);if(f.mode==="year")return !f.year||d.slice(0,4)===f.year;if(f.mode==="month")return (!f.year||d.slice(0,4)===f.year)&&(!f.month||d.slice(5,7)===f.month);if(f.mode==="range")return(!f.from||d>=f.from)&&(!f.to||d<=f.to);return true;}
  function updateSnappLatestDates(D){var bar=$("snappLatestDatesBar");if(!bar)return;var ti=tripSchema(D.headers||[]),ui=topupIndexes(D.topupHeaders||[]),trip=(D.rows||[]).map(function(r){return splitSnappDateTime(r[ti.start]).date;}).filter(Boolean).sort().pop()||"—",top=(D.topups||[]).map(function(r){return splitSnappDateTime(r[ui.date]).date;}).filter(Boolean).sort().pop()||"—";bar.innerHTML="<span>📅 آخرین تاریخ فایل سفر: "+esc(trip)+"</span><span>💳 آخرین تاریخ فایل افزایش موجودی: "+esc(top)+"</span>";}
  function renderSnappCorporate(){var D=snappStore();repairSnappHeaders(D);var h=D.headers||[],idx=tripSchema(h),f=snappFilters(),repSel=$("snappFilterRep"),cur=repSel?repSel.value:"",users=((st().users)||[]).filter(function(u){return u&&u.fullName&&!/مدیر سیستم/.test(u.fullName)&&u.username!=="admin";});if(repSel){repSel.innerHTML="<option value=''>همه نمایندگان</option>"+users.map(function(u){return"<option value='"+esc(u.fullName)+"'>"+esc(u.fullName)+"</option>";}).join("");repSel.value=cur;}
    snappFilteredRows=(D.rows||[]).filter(function(r){var dt=splitSnappDateTime(r[idx.start]);return datePass(dt.date,f)&&(!f.rep||personMatch(r[idx.rep],f.rep));});var total=snappFilteredRows.reduce(function(sum,r){return sum+snappNumber(r[idx.amount]);},0),by={};snappFilteredRows.forEach(function(r){var raw=String(r[idx.rep]||"نامشخص"),matched=users.filter(function(u){return personMatch(u.fullName,raw);})[0],n=matched?matched.fullName:raw;by[n]=by[n]||{n:0,sum:0};by[n].n++;by[n].sum+=snappNumber(r[idx.amount]);});var cards=$("snappSummaryCards");if(cards)cards.innerHTML=[["تعداد سفر",snappFilteredRows.length.toLocaleString("fa-IR")],["جمع کل",total.toLocaleString("fa-IR")+" ریال"],["تعداد نمایندگان",Object.keys(by).length.toLocaleString("fa-IR")],["آخرین ورود",D.lastImport||"—"]].map(function(x){return"<div class='v20-metric'>"+x[0]+"<b>"+x[1]+"</b></div>";}).join("");var rb=$("snappRepSummaryBody");if(rb)rb.innerHTML=Object.keys(by).sort().map(function(n,i){return"<tr><td>"+(i+1)+"</td><td><strong>"+esc(n)+"</strong></td><td>"+by[n].n.toLocaleString("fa-IR")+"</td><td>"+by[n].sum.toLocaleString("fa-IR")+" ریال</td></tr>";}).join("")||"<tr><td colspan='4'>داده‌ای در این بازه نیست.</td></tr>";var heads=["تاریخ شروع سفر","ساعت شروع سفر","تاریخ پایان سفر","ساعت پایان سفر","نام مسافر","مبدأ","مقصد","مقصد دوم","نوع سرویس","هزینه","شهر"],hh=$("snappReportHead");if(hh)hh.innerHTML=heads.map(function(x){return"<th>"+x+"</th>";}).join("");var body=$("snappReportBody");if(body)body.innerHTML=snappFilteredRows.slice(0,2000).map(function(r){var stt=splitSnappDateTime(r[idx.start]),endt=splitSnappDateTime(r[idx.end]),vals=[stt.date,stt.time,endt.date,endt.time,r[idx.rep],r[idx.origin],r[idx.dest],r[idx.dest2],r[idx.service],r[idx.amount],r[idx.city]];return"<tr>"+vals.map(function(v){return"<td>"+esc(v||"")+"</td>";}).join("")+"</tr>";}).join("")||"<tr><td colspan='11'>فایلی وارد نشده یا نتیجه‌ای نیست.</td></tr>";var status=$("snappDailyStatus");if(status)status.textContent=D.rows.length?(D.rows.length.toLocaleString("fa-IR")+" ردیف سفر یکتا، دائمی و داخل پشتیبان ذخیره شده است."):"گزارشی وارد نشده است.";updateSnappLatestDates(D);renderSnappTopups();}
  function rowSignature(r){var a=(r||[]).map(function(x){return enDigits(String(x==null?"":x)).replace(/\s+/g," ").trim();});while(a.length&&a[a.length-1]==="")a.pop();return a.join("¦");}
  async function importSnappFiles(files){var D=snappStore(),all=[],names=[];for(var i=0;i<files.length;i++){try{var rows=await parseSnappFile(files[i]);if(rows.length){var hi=findHeaderRow(rows,"trip"),head=rows[hi]||[];if(!D.headers.length||D.headers.filter(Boolean).length<3)D.headers=head.slice();all=all.concat(rows.slice(hi+1));names.push(files[i].name);}}catch(e){alert("خطا در فایل «"+files[i].name+"»: "+e.message);}}var seen={},fresh=[];(D.rows||[]).forEach(function(r){seen[rowSignature(r)]=true;});all.forEach(function(r){while(r.length<24)r.push("");var k=rowSignature(r);if(!seen[k]&&r.some(function(x){return String(x).trim();})){seen[k]=true;fresh.push(r);}});if(fresh.length)D.tripImports.unshift({id:"trip-"+Date.now(),name:names.join(" + "),at:Date.now(),headers:D.headers.slice(),rows:fresh});D.rows=fresh.concat(D.rows||[]);D.files=(names.concat(D.files||[])).slice(0,200);D.lastImport=new Date().toLocaleString("fa-IR",{timeZone:"Asia/Tehran"});await saveBulkVault();save();renderSnappCorporate();v20Toast("✅ "+fresh.length.toLocaleString("fa-IR")+" ردیف جدید بالای آرشیو دائمی سفرها اضافه شد.");}
  function topupIndexes(h){var di=0,ai=1;h.forEach(function(x,i){if(/تاریخ/.test(String(x)))di=i;if(/بستانکار|افزایش.*موجودی|مبلغ.*شارژ/.test(String(x)))ai=i;});return{date:di,amount:ai};}
  function snappTopupFilters(){return{mode:temporalMode("snappTopup"),year:enDigits(($("snappTopupYear")||{}).value||""),month:enDigits(($("snappTopupMonth")||{}).value||""),from:normSnappDate(($("snappTopupFrom")||{}).value||""),to:normSnappDate(($("snappTopupTo")||{}).value||"")};}
  async function importSnappTopups(files){var D=snappStore(),all=[],names=[];for(var i=0;i<files.length;i++){try{var rows=await parseSnappFile(files[i]);if(rows.length){var hi=findHeaderRow(rows,"topup"),head=rows[hi]||[];if(!D.topupHeaders.length)D.topupHeaders=head.slice();all=all.concat(rows.slice(hi+1));names.push(files[i].name);}}catch(e){alert("خطا در گزارش افزایش موجودی «"+files[i].name+"»: "+e.message);}}var seen={},fresh=[],ti=topupIndexes(D.topupHeaders||[]);(D.topups||[]).forEach(function(r){seen[rowSignature(r)]=1;});all.forEach(function(r){var k=rowSignature(r);if(snappNumber(r[ti.amount])>0&&!seen[k]){seen[k]=1;fresh.push(r);}});if(fresh.length)D.topupImports.unshift({id:"top-"+Date.now(),name:names.join(" + "),at:Date.now(),headers:D.topupHeaders.slice(),rows:fresh});D.topups=fresh.concat(D.topups||[]);D.topupFiles=names.concat(D.topupFiles||[]).slice(0,200);D.lastTopupImport=new Date().toLocaleString("fa-IR",{timeZone:"Asia/Tehran"});await saveBulkVault();save();renderSnappCorporate();v20Toast("✅ "+fresh.length.toLocaleString("fa-IR")+" ردیف افزایش موجودی بالای آرشیو دائمی اضافه شد.");}
  function renderSnappTopups(){var D=snappStore(),h=D.topupHeaders||[],idx=topupIndexes(h),f=snappTopupFilters(),rows=(D.topups||[]).filter(function(r){return snappNumber(r[idx.amount])>0&&datePass(splitSnappDateTime(r[idx.date]).date,f);}),sum=rows.reduce(function(s,r){return s+snappNumber(r[idx.amount]);},0),cards=$("snappTopupSummaryCards");if(cards)cards.innerHTML=[["تعداد شارژ",rows.length.toLocaleString("fa-IR")],["جمع مبلغ شارژ",sum.toLocaleString("fa-IR")+" ریال"],["کل آرشیو",(D.topups||[]).length.toLocaleString("fa-IR")],["آخرین ورود",D.lastTopupImport||"—"]].map(function(x){return"<div class='v20-metric'>"+x[0]+"<b>"+x[1]+"</b></div>";}).join("");var head=$("snappTopupHead");if(head)head.innerHTML="<th>ردیف</th><th>تاریخ</th><th>ساعت</th><th>مبلغ شارژ</th>";var body=$("snappTopupBody");if(body)body.innerHTML=rows.slice(0,2000).map(function(r,i){var dt=splitSnappDateTime(r[idx.date]);return"<tr><td>"+(i+1)+"</td><td>"+esc(dt.date)+"</td><td>"+esc(dt.time)+"</td><td>"+snappNumber(r[idx.amount]).toLocaleString("fa-IR")+" ریال</td></tr>";}).join("")||"<tr><td colspan='4'>گزارش افزایش موجودی وارد نشده است.</td></tr>";window._v20TopupRows=rows;}
  function showSnappArchives(kind){var D=snappStore(),host=$("snappFileArchiveViewer"),imports=kind==="trip"?D.tripImports:D.topupImports,allRows=kind==="trip"?D.rows:D.topups,allHeaders=kind==="trip"?D.headers:D.topupHeaders;if(!host)return;function paint(title,headers,rows){host.hidden=false;host.innerHTML="<div class='card-header'><div class='card-title'>"+esc(title)+" — "+rows.length.toLocaleString("fa-IR")+" ردیف</div><button class='btn btn-outline arc-close'>بستن</button></div><div class='v20-card-tools'><button class='btn btn-outline arc-all'>همه دیتابیس</button>"+(imports||[]).map(function(x,i){return"<button class='btn btn-outline arc-one' data-i='"+i+"'>"+esc(x.name||("فایل "+(i+1)))+"</button>";}).join("")+"</div><div class='table-responsive'><table class='data-table'><thead><tr>"+(headers||[]).map(function(h){return"<th>"+esc(h)+"</th>";}).join("")+"</tr></thead><tbody>"+(rows||[]).slice(0,1000).map(function(r){return"<tr>"+r.map(function(v,i){var show=/تاریخ/.test(String((headers||[])[i]||""))?normSnappDate(v):v;return"<td>"+esc(show)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div>";host.querySelector('.arc-close').onclick=function(){host.hidden=true;};host.querySelector('.arc-all').onclick=function(){paint("همه دیتابیس "+(kind==="trip"?"سفر":"شارژ"),allHeaders,allRows);};Array.prototype.forEach.call(host.querySelectorAll('.arc-one'),function(b){b.onclick=function(){var x=imports[Number(b.dataset.i)];paint(x.name,x.headers,x.rows);};});host.scrollIntoView({behavior:"smooth"});}paint("همه دیتابیس "+(kind==="trip"?"سفر":"شارژ"),allHeaders,allRows);}
  function ensureSnappActionBar(){var pane=$("tab-snapp-corporate"),card=pane&&pane.querySelector(".card");if(!card)return;var bar=$("v20SnappActionBar");if(!bar){bar=document.createElement("div");bar.id="v20SnappActionBar";bar.style.cssText="display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#ecfeff;border:2px solid #0891b2;border-radius:12px;padding:12px;margin-bottom:14px;position:sticky;top:6px;z-index:50";card.insertBefore(bar,card.firstChild);}['btnBuildSnappReport','btnBuildSnappTopupReport'].forEach(function(id){var b=$(id);if(b&&b.parentNode!==bar){b.classList.add('btn-sm');b.style.cssText='width:auto!important;max-width:260px!important;display:inline-flex!important';bar.appendChild(b);}});if(!$("btnViewSnappTripFiles")){var vt=document.createElement("button");vt.id="btnViewSnappTripFiles";vt.className="btn btn-outline btn-sm";vt.textContent="👁 فایل‌های سفر";vt.onclick=function(){showSnappArchives("trip");};bar.appendChild(vt);}if(!$("btnViewSnappTopupFiles")){var vu=document.createElement("button");vu.id="btnViewSnappTopupFiles";vu.className="btn btn-outline btn-sm";vu.textContent="👁 فایل‌های شارژ";vu.onclick=function(){showSnappArchives("topup");};bar.appendChild(vu);}if(!$("snappLatestDatesBar")){var st=document.createElement("div");st.id="snappLatestDatesBar";st.style.cssText="width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;font-weight:800;color:#155e75";st.innerHTML="<span>آخرین تاریخ سفر: —</span><span>آخرین تاریخ افزایش موجودی: —</span>";bar.appendChild(st);}}
  function forceBlankSnappDates(){["snappFilterFrom","snappFilterTo","snappTopupFrom","snappTopupTo"].forEach(function(id){var e=$(id);if(!e||e.dataset.v20Blanked)return;e.dataset.v20Blanked="1";e.value="";e.addEventListener("input",function(){e.dataset.userTouched="1";});setTimeout(function(){if(e.dataset.userTouched!=="1")e.value="";},700);});}
  function bindSnappModes(){[["snappTrip","snappFilterYear","snappFilterMonth",renderSnappCorporate],["snappTopup","snappTopupYear","snappTopupMonth",renderSnappTopups]].forEach(function(cfg){var prefix=cfg[0],year=$(cfg[1]),month=$(cfg[2]),ids=[prefix+"ModeYear",prefix+"ModeMonth",prefix+"ModeFrom",prefix+"ModeTo"];function refreshMonth(){var off=!String((year||{}).value||"").trim();if(month){month.disabled=off;if(off)month.value="";month.classList.toggle("v20-grey",off);var mc=$(prefix+"ModeMonth");if(off&&mc)mc.checked=false;var g=month.closest(".form-group");if(g)g.classList.toggle("v20-grey-zone",off);}}ids.forEach(function(id){var c=$(id);if(!c||c.dataset.bound)return;c.dataset.bound="1";c.addEventListener("change",function(){var range=id===prefix+"ModeFrom"||id===prefix+"ModeTo";if(!c.checked){if(range){var a=$(prefix+"ModeFrom"),b=$(prefix+"ModeTo");if(a)a.checked=false;if(b)b.checked=false;}refreshMonth();cfg[3]();return;}if(range){ids.forEach(function(x){var e=$(x);if(e)e.checked=(x===prefix+"ModeFrom"||x===prefix+"ModeTo");});}else ids.forEach(function(x){var e=$(x);if(e&&x!==id)e.checked=false;});refreshMonth();cfg[3]();});});if(year&&!year.dataset.modeBound){year.dataset.modeBound="1";year.addEventListener("input",function(){refreshMonth();cfg[3]();});}refreshMonth();});}
  function setupSnappCorporate(){ensureSnappActionBar();forceBlankSnappDates();bindSnappModes();var open=$("btnOpenSnappCorporate"),inp=$("snappReportFiles"),top=$("snappTopupFiles"),exp=$("btnExportSnappView"),texp=$("btnExportSnappTopups"),build=$("btnBuildSnappReport");if(open&&!open.dataset.bound){open.dataset.bound="1";open.addEventListener("click",function(){window.open("https://corporate.snapp.taxi/auth/login","_blank","noopener");});}if(inp&&!inp.dataset.bound){inp.dataset.bound="1";inp.addEventListener("change",function(){if(inp.files&&inp.files.length)importSnappFiles(Array.prototype.slice.call(inp.files));inp.value="";});}if(top&&!top.dataset.bound){top.dataset.bound="1";top.addEventListener("change",function(){if(top.files&&top.files.length)importSnappTopups(Array.prototype.slice.call(top.files));top.value="";});}if(build&&!build.dataset.bound){build.dataset.bound="1";build.addEventListener("click",function(){renderSnappCorporate();var box=$("snappSummaryCards");if(box)box.scrollIntoView({behavior:"smooth",block:"center"});v20Toast(snappFilteredRows.length?"✅ گزارش نماینده تهیه شد: "+snappFilteredRows.length.toLocaleString("fa-IR")+" سفر":"⚠️ برای این فیلتر سفری پیدا نشد؛ نام نماینده یا تاریخ را بررسی کنید.");});}if(exp&&!exp.dataset.bound){exp.dataset.bound="1";exp.addEventListener("click",function(){var D=snappStore(),idx=tripSchema(D.headers||[]),heads=["تاریخ شروع سفر","ساعت شروع سفر","تاریخ پایان سفر","ساعت پایان سفر","نام مسافر","مبدأ","مقصد","مقصد دوم","نوع سرویس","هزینه","شهر"],rows=snappFilteredRows.map(function(r){var a=splitSnappDateTime(r[idx.start]),b=splitSnappDateTime(r[idx.end]);return[a.date,a.time,b.date,b.time,r[idx.rep],r[idx.origin],r[idx.dest],r[idx.dest2],r[idx.service],r[idx.amount],r[idx.city]];});window.downloadCSVFile("snapp-corporate-report.xls",heads,rows);});}if(texp&&!texp.dataset.bound){texp.dataset.bound="1";texp.addEventListener("click",function(){var D=snappStore(),idx=topupIndexes(D.topupHeaders||[]),rows=(window._v20TopupRows||[]).map(function(r,i){var d=splitSnappDateTime(r[idx.date]);return[i+1,d.date,d.time,snappNumber(r[idx.amount])];});window.downloadCSVFile("snapp-topup-report.xls",["ردیف","تاریخ","ساعت","مبلغ شارژ"],rows);});}var topBuild=$("btnBuildSnappTopupReport");if(topBuild&&!topBuild.dataset.bound){topBuild.dataset.bound="1";topBuild.addEventListener("click",function(){renderSnappTopups();var box=$("snappTopupSummaryCards");if(box)box.scrollIntoView({behavior:"smooth",block:"center"});v20Toast((window._v20TopupRows||[]).length?"✅ گزارش افزایش موجودی تهیه شد: "+(window._v20TopupRows||[]).length.toLocaleString("fa-IR")+" ردیف":"⚠️ برای این فیلتر مبلغ شارژی پیدا نشد.");});}["snappTopupYear","snappTopupMonth","snappTopupFrom","snappTopupTo"].forEach(function(id){var el=$(id);if(el&&!el.dataset.bound){if(/From|To/.test(id))el.value="";el.dataset.bound="1";el.addEventListener("input",renderSnappTopups);el.addEventListener("change",renderSnappTopups);}});["snappFilterYear","snappFilterMonth","snappFilterRep","snappFilterFrom","snappFilterTo"].forEach(function(id){var el=$(id);if(el&&!el.dataset.bound){if(/From|To/.test(id))el.value="";el.dataset.bound="1";el.addEventListener("input",renderSnappCorporate);el.addEventListener("change",renderSnappCorporate);}});renderSnappCorporate();}


  /* ---------- ۲۱) همه نمایندگان + آدرس متنی موقعیت زنده ---------- */
  async function updateRepTextAddress(r){if(!r||!r.lat||!r.lng)return;var key=Number(r.lat).toFixed(5)+","+Number(r.lng).toFixed(5);if(r._textAddressKey===key&&r.textAddress)return;try{r.textAddress=await window.reverseGeocodeCoordinates(r.lat,r.lng);r._textAddressKey=key;save();var cell=document.querySelector('[data-live-address="'+r.id+'"]');if(cell)cell.textContent=r.textAddress;}catch(e){}}
  function enhanceLiveLocation(){var sel=$("liveRepSearchSelect");if(sel&&sel.options.length){sel.options[0].textContent="همه نمایندگان";sel.options[0].value="";}var table=$("tableLiveReps"),hr=table&&table.querySelector("thead tr");if(hr&&!hr.querySelector(".v20-live-address-head")){var th=document.createElement("th");th.className="v20-live-address-head";th.textContent="آدرس متنی موقعیت فعلی";hr.insertBefore(th,hr.lastElementChild);}var body=$("tableLiveRepsBody"),reps=(st()&&st().reps)||[];if(body)Array.prototype.forEach.call(body.children,function(tr,i){var r=reps[i];if(!r)return;var old=tr.querySelector("[data-live-address]");if(!old){var td=document.createElement("td");td.setAttribute("data-live-address",r.id);td.textContent=r.textAddress||"در حال دریافت آدرس…";tr.insertBefore(td,tr.lastElementChild);}updateRepTextAddress(r);});}
  function bindLiveAll(){var btn=$("btnFindLiveRep");if(btn&&!btn.dataset.v20all){btn.dataset.v20all="1";btn.addEventListener("click",function(e){var sel=$("liveRepSearchSelect");if(sel&&sel.value)return;e.preventDefault();e.stopImmediatePropagation();if(typeof window.renderLiveLocationTab==="function")window.renderLiveLocationTab();setTimeout(function(){enhanceLiveLocation();try{var pts=((st()&&st().reps)||[]).filter(function(r){return r.lat&&r.lng;}).map(function(r){return[r.lat,r.lng];});if(typeof mapLiveReps!=="undefined"&&mapLiveReps&&pts.length)mapLiveReps.fitBounds(pts,{padding:[30,30]});}catch(x){}},80);},true);}var body=$("tableLiveRepsBody");if(body&&window.MutationObserver&&!body.dataset.v20addr){body.dataset.v20addr="1";var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(enhanceLiveLocation,40);}).observe(body,{childList:true,subtree:true});}enhanceLiveLocation();}

  function applySnappVisibility(){var manager=v20IsManager(),S=st(),name=sessionStorage.getItem("crmUserName")||"",u=S&&((S.users||[]).filter(function(x){return x.fullName===name||x.username===sessionStorage.getItem("crmUsername");})[0]),perms=(u&&u.permissions)||{};function toggle(id,allow){document.querySelectorAll('[data-target="'+id+'"],[data-side-target="'+id+'"]').forEach(function(b){b.style.display=allow?"":"none";});var pane=$(id);if(pane&&!allow)pane.style.display="none";}toggle("tab-snapp-corporate",manager||perms.sys_snapp_access===true);toggle("tab-distributor-companies",manager||perms.dist_companies_access===true);toggle("tab-distributor-sales",manager||perms.dist_sales_access===true);toggle("tab-distributor-database",manager||perms.dist_database_access===true);}

  /* ---------- ۲۲) تارگت کامل: تعداد، ریال پخش/داروخانه و جمع نمایندگان ---------- */
  function targetMoney(t){var p=((st().products||[]).filter(function(x){return x.name===t.productName||x.id===t.productId;})[0])||{},n=Number(t.targetCount||0),dp=Number(p.distributorPrice||p.distPrice||p.price||0),hp=Number(p.pharmacyPrice||p.price||0);return{count:n,distPrice:dp,phPrice:hp,distTotal:n*dp,phTotal:n*hp};}
  function renderTargetsV20(){var S=st(),body=$("tableSalesTargetsBody");if(!S||!body)return;var table=body.closest("table"),head=table&&table.querySelector("thead tr"),list=(S.salesTargets||[]).slice().reverse(),by={},grand={count:0,dist:0,ph:0};if(head)head.innerHTML="<th>ردیف</th><th>نام نماینده</th><th>کالا</th><th>تعداد کالا</th><th>ریال واحد پخش</th><th>ریال واحد داروخانه</th><th>جمع ریال پخش</th><th>جمع ریال داروخانه</th><th>ماه/سال</th><th>عملیات</th>";body.innerHTML=list.map(function(t,i){var m=targetMoney(t),n=t.repName||"نامشخص";by[n]=by[n]||{count:0,dist:0,ph:0};by[n].count+=m.count;by[n].dist+=m.distTotal;by[n].ph+=m.phTotal;grand.count+=m.count;grand.dist+=m.distTotal;grand.ph+=m.phTotal;return"<tr><td>"+(i+1)+"</td><td><strong>"+esc(n)+"</strong></td><td>"+esc(t.productName||"—")+"</td><td>"+m.count.toLocaleString("fa-IR")+"</td><td>"+m.distPrice.toLocaleString("fa-IR")+"</td><td>"+m.phPrice.toLocaleString("fa-IR")+"</td><td><strong>"+m.distTotal.toLocaleString("fa-IR")+"</strong></td><td><strong>"+m.phTotal.toLocaleString("fa-IR")+"</strong></td><td>"+esc(t.month||"—")+"</td><td><button type='button' class='btn btn-danger btn-sm v20-target-del' data-id='"+esc(t.id)+"'>🗑️ حذف</button></td></tr>";}).join("")||"<tr><td colspan='10'>تارگتی ثبت نشده است.</td></tr>";var box=$("tgtSummaryBox");if(box)box.innerHTML="<div class='v20-visit-metrics'><div class='v20-metric'>جمع تعداد همه نمایندگان<b>"+grand.count.toLocaleString("fa-IR")+"</b></div><div class='v20-metric'>جمع کل ریال پخش<b>"+grand.dist.toLocaleString("fa-IR")+"</b></div><div class='v20-metric'>جمع کل ریال داروخانه<b>"+grand.ph.toLocaleString("fa-IR")+"</b></div><div class='v20-metric'>تعداد نمایندگان<b>"+Object.keys(by).length.toLocaleString("fa-IR")+"</b></div></div><div class='table-responsive'><table class='data-table'><thead><tr><th>ردیف</th><th>نماینده</th><th>جمع تعداد</th><th>جمع ریال پخش</th><th>جمع ریال داروخانه</th></tr></thead><tbody>"+Object.keys(by).sort().map(function(n,i){return"<tr><td>"+(i+1)+"</td><td><strong>"+esc(n)+"</strong></td><td>"+by[n].count.toLocaleString("fa-IR")+"</td><td>"+by[n].dist.toLocaleString("fa-IR")+"</td><td>"+by[n].ph.toLocaleString("fa-IR")+"</td></tr>";}).join("")+"</tbody></table></div>";Array.prototype.forEach.call(body.querySelectorAll(".v20-target-del"),function(b){b.addEventListener("click",function(){if(!confirm("این تارگت حذف شود؟"))return;S.salesTargets=(S.salesTargets||[]).filter(function(t){return String(t.id)!==String(b.getAttribute("data-id"));});save();renderTargetsV20();});});}
  function bindTargetsV20(){var f=$("formSalesTarget");if(f&&!f.dataset.v20target){f.dataset.v20target="1";f.addEventListener("submit",function(){setTimeout(renderTargetsV20,180);});}renderTargetsV20();}

  /* ---------- ۲۳) ارسال واقعی پشتیبان به ایمیل از مسیر امن سرور ---------- */
  function bindEmailBackup(){var old=window.performAutoBackup;if(typeof old!=="function"||old._v20email)return;var w=function(){var args=arguments;return Promise.resolve(old.apply(this,args)).then(function(localOk){var S=st(),to=((S.settings||{}).backupEmail)||"";if(!to)return localOk;return fetch("/api/backup/email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:to,state:S})}).then(async function(r){var d={};try{d=await r.json();}catch(e){}if(!r.ok)throw new Error(d.message||("HTTP "+r.status));S.settings.lastBackupEmailSend=new Date().toLocaleString("fa-IR");var el=$("autoBackupHandleStatus");if(el)el.textContent="✅ پشتیبان فایل و ایمیل ارسال شد — "+S.settings.lastBackupEmailSend;return true;}).catch(function(e){var el=$("autoBackupHandleStatus");if(el)el.textContent="⚠️ فایل ذخیره شد، اما ایمیل ارسال نشد: "+e.message;return localOk;});});};w._v20email=true;window.performAutoBackup=w;}

  /* ---------- ۲۴) نمایش سه‌رقمی اعداد در خروجی‌های دیداری ---------- */
  function formatVisibleNumbers(root){if(!root||!document.createTreeWalker)return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],n;while(n=w.nextNode())nodes.push(n);nodes.forEach(function(t){var p=t.parentElement;if(!p||/^(SCRIPT|STYLE|INPUT|TEXTAREA|SELECT|OPTION)$/.test(p.tagName))return;var context=String(p.textContent||"");if(/تاریخ|سال|ماه|تلفن|همراه|مختصات|عرض جغرافیایی|طول جغرافیایی|کد|پلاک/.test(context))return;var old=t.nodeValue,nw=old.replace(/[0-9۰-۹]{4,}/g,function(x,off,all){if(all[off-1]==="/"||all[off+x.length]==="/"||all[off-1]==="."||all[off+x.length]===".")return x;var raw=enDigits(x);if(/^0\d{9,}$/.test(raw))return x;var v=Number(raw);return isFinite(v)?v.toLocaleString("fa-IR"):x;});if(nw!==old)t.nodeValue=nw;});}
  function bindNumberFormatting(){formatVisibleNumbers(document.body);if(window.MutationObserver){var timer;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){formatVisibleNumbers(document.body);},80);}).observe(document.body,{childList:true,subtree:true,characterData:true});}}

  /* ---------- ۲۵) ماندگاری نسخه‌ای: محلی + سرور، بدون جایگزینی با نمونه ---------- */
  function bindDurableServerState(){var old=window.saveState;if(typeof old!=="function"||old._v20durable)return;var timer;var w=function(){var r=old.apply(this,arguments);clearTimeout(timer);timer=setTimeout(function(){var S=st();if(!S)return;fetch("/api/state",{method:"POST",headers:{"Content-Type":"application/json"},body:(typeof serializeStateForLocalStorage==="function"?serializeStateForLocalStorage(S):JSON.stringify(S))}).catch(function(){});},1500);return r;};w._v20durable=true;window.saveState=w;/* عمداً GET/merge خودکار وجود ندارد؛ سرور حق بازنویسی state فعلی را ندارد. */}

  /* ---------- ۲۷) شرکت‌های پخش و گزارش تجمیعی فروش/موجودی ---------- */
  var DIST_DEFS=[["daya","دایا دارو"],["shafaarad","شفاآراد"],["tivan","تیوان"],["mashateb","مشاطب"]],DIST_HEADERS=["نام کالا","فروش تعدادی","فروش ریالی به قیمت پخش","فروش ریالی به قیمت داروخانه","تعداد جایزه","ریال جایزه","درصد جایزه به فروش","تعداد مرجوعی کالا","ریال مرجوعی کالا","درصد مرجوعی به فروش","تعداد مرجوعی جایزه","ریال مرجوعی جایزه","درصد مرجوعی به جایزه","تعداد داروخانه","تعداد فاکتور","درصد فروش به‌تفکیک کالا","موجودی تعدادی","موجودی ریالی به قیمت پخش","موجودی ریالی به قیمت داروخانه"],distReportCache={};
  function distStore(){var S=st();S.distributorCompanies=S.distributorCompanies||{};DIST_DEFS.forEach(function(x){var d=S.distributorCompanies[x[0]]||(S.distributorCompanies[x[0]]={});d.id=x[0];d.name=x[1];d.url=d.url||"";d.username=d.username||"";d.pharmacyHeaders=d.pharmacyHeaders||[];d.pharmacyRows=d.pharmacyRows||[];d.pharmacyImports=d.pharmacyImports||[];d.inventoryHeaders=d.inventoryHeaders||[];d.inventoryRows=d.inventoryRows||[];});return S.distributorCompanies;}
  function renderDistributorCompanies(){var host=$("distributorCompanyGrid");if(!host)return;var ds=distStore();host.innerHTML=DIST_DEFS.map(function(x){var d=ds[x[0]],pass=sessionStorage.getItem("distPass_"+x[0])||"";return"<div class='v20-combo-card' data-dist='"+x[0]+"'><h4>🏢 "+x[1]+"</h4><div class='form-group'><label class='form-label'>آدرس پنل پخش</label><input class='form-input dist-url' value='"+esc(d.url)+"' placeholder='https://...'></div><div class='form-group'><label class='form-label'>نام کاربری</label><input class='form-input dist-user' value='"+esc(d.username)+"'></div><div class='form-group'><label class='form-label'>رمز ورود (فقط نشست جاری)</label><input type='password' class='form-input dist-pass' value='"+esc(pass)+"' autocomplete='new-password'></div><div style='display:flex;gap:7px;flex-wrap:wrap;margin-top:8px'><button type='button' class='btn btn-primary dist-save'>💾 ثبت امن اطلاعات</button><button type='button' class='btn btn-outline dist-open'>🔐 بازکردن پنل</button></div></div>";}).join("");host.onclick=function(e){var card=e.target.closest&&e.target.closest("[data-dist]");if(!card)return;var id=card.dataset.dist,d=ds[id];if(e.target.closest(".dist-save")){d.url=card.querySelector(".dist-url").value.trim();d.username=card.querySelector(".dist-user").value.trim();sessionStorage.setItem("distPass_"+id,card.querySelector(".dist-pass").value);save();v20Toast("✅ اطلاعات "+d.name+" ذخیره شد؛ رمز فقط در این نشست است.");}if(e.target.closest(".dist-open")){if(!d.url){alert("ابتدا آدرس پنل این پخش را ثبت کنید.");return;}window.open(d.url,"_blank","noopener");}};}
  function distLastDate(rows,headers,id){var ix=id==="daya"?13:findDistIndex(headers,/تاریخ/,0),dates=(rows||[]).map(function(r){return normSnappDate(r[ix]);}).filter(function(x){return /^1[34]\d{2}\//.test(x);}).sort();return dates.pop()||"—";}
  function renderDistributorActions(){var host=$("distributorActionGrid");if(!host)return;var ds=distStore();host.innerHTML=DIST_DEFS.map(function(x){var d=ds[x[0]];return"<div class='v20-combo-card' data-dist='"+x[0]+"'><h4>📦 "+x[1]+"</h4><div class='v20-mini'>آخرین فایل داروخانه: <b>"+esc((distLastDate(d.pharmacyRows,d.pharmacyHeaders,d.id)!=="—"?distLastDate(d.pharmacyRows,d.pharmacyHeaders,d.id):(d.pharmacyImports&&d.pharmacyImports[0]&&d.pharmacyImports[0].at?faDate(new Date(d.pharmacyImports[0].at)):"—")))+"</b></div><div class='v20-mini'>آخرین فایل موجودی: <b>"+esc((distLastDate(d.inventoryRows,d.inventoryHeaders,d.id)!=="—"?distLastDate(d.inventoryRows,d.inventoryHeaders,d.id):(d.inventoryImport&&d.inventoryImport.at?faDate(new Date(d.inventoryImport.at)):"—")))+"</b></div><div class='v20-card-tools' style='margin-top:8px'><button class='btn btn-outline dist-login'>🔐 ورود اطلاعات / پنل</button><label class='btn btn-primary btn-excel'>📊 ورود فایل داروخانه<input type='file' class='dist-ph-file' accept='.xlsx,.xls,.csv' hidden></label><label class='btn btn-primary btn-excel'>📦 ورود فایل موجودی<input type='file' class='dist-inv-file' accept='.xlsx,.xls,.csv' hidden></label></div></div>";}).join("");host.onclick=function(e){var c=e.target.closest&&e.target.closest("[data-dist]");if(!c)return;var d=ds[c.dataset.dist];if(e.target.closest(".dist-login")){if(!d.url)return alert("آدرس پنل را در تب اطلاعات شرکت‌ها ثبت کنید.");window.open(d.url,"_blank","noopener");}if(e.target.closest(".dist-view-ph"))showDistributorRaw(d,"pharmacy");if(e.target.closest(".dist-view-inv"))showDistributorRaw(d,"inventory");};Array.prototype.forEach.call(host.querySelectorAll(".dist-ph-file,.dist-inv-file"),function(inp){inp.onchange=function(){var c=inp.closest("[data-dist]"),kind=inp.classList.contains("dist-ph-file")?"pharmacy":"inventory";if(inp.files[0])importDistributorFile(c.dataset.dist,kind,inp.files[0]);inp.value="";};});}
  function renderDistributorDatabase(){var host=$("distributorDatabaseGrid");if(!host)return;var ds=distStore();host.innerHTML=DIST_DEFS.map(function(x){var d=ds[x[0]];return"<div class='v20-combo-card' data-dist='"+x[0]+"'><h4>🗄️ "+x[1]+"</h4><div>آخرین تاریخ داروخانه: <strong>"+esc((distLastDate(d.pharmacyRows,d.pharmacyHeaders,d.id)!=="—"?distLastDate(d.pharmacyRows,d.pharmacyHeaders,d.id):(d.pharmacyImports&&d.pharmacyImports[0]&&d.pharmacyImports[0].at?faDate(new Date(d.pharmacyImports[0].at)):"—")))+"</strong></div><div>آخرین تاریخ موجودی: <strong>"+esc((distLastDate(d.inventoryRows,d.inventoryHeaders,d.id)!=="—"?distLastDate(d.inventoryRows,d.inventoryHeaders,d.id):(d.inventoryImport&&d.inventoryImport.at?faDate(new Date(d.inventoryImport.at)):"—")))+"</strong></div><div class='v20-mini'>"+(d.pharmacyRows||[]).length.toLocaleString("fa-IR")+" ردیف داروخانه / "+(d.inventoryRows||[]).length.toLocaleString("fa-IR")+" ردیف موجودی / "+(d.pharmacyImports||[]).length.toLocaleString("fa-IR")+" فایل آرشیوی</div><div class='v20-card-tools' style='margin-top:10px'><button class='btn btn-outline db-ph'>👁 دیتابیس داروخانه</button><button class='btn btn-outline db-inv'>👁 موجودی فعلی</button><button class='btn btn-outline db-files'>📁 ریز فایل‌های داروخانه</button></div></div>";}).join("");host.onclick=function(e){var c=e.target.closest&&e.target.closest("[data-dist]");if(!c)return;var d=ds[c.dataset.dist];if(e.target.closest(".db-ph")||e.target.closest(".db-files"))showDistributorRaw(d,"pharmacy");if(e.target.closest(".db-inv"))showDistributorRaw(d,"inventory");};}
  async function importDistributorFile(id,kind,file){var d=distStore()[id];try{var rows=await parseSnappFile(file),hi=findHeaderRow(rows,"trip"),headers=rows[hi]||[],data=rows.slice(hi+1).filter(function(r){return r.some(function(x){return String(x).trim();});});if(kind==="pharmacy"){var seen={};d.pharmacyRows.forEach(function(r){seen[rowSignature(r)]=1;});var fresh=data.filter(function(r){var k=rowSignature(r);if(seen[k])return false;seen[k]=1;return true;});d.pharmacyHeaders=headers.slice();d.pharmacyRows=d.pharmacyRows.concat(fresh);d.pharmacyImports.unshift({id:"imp-"+Date.now(),name:file.name,at:Date.now(),lastDate:distLastDate(fresh,headers,d.id),headers:headers.slice(),rows:fresh});v20Toast("✅ "+fresh.length.toLocaleString("fa-IR")+" ردیف جدید داروخانه به انتهای "+d.name+" اضافه شد.");}else{d.inventoryHeaders=headers.slice();d.inventoryRows=data;d.inventoryImport={name:file.name,at:Date.now(),lastDate:distLastDate(data,headers,d.id),headers:headers.slice(),rows:data};v20Toast("✅ موجودی "+d.name+" با "+data.length.toLocaleString("fa-IR")+" ردیف جایگزین شد.");}await saveBulkVault();save();renderDistributorActions();renderDistributorDatabase();renderDistributorReport();}catch(e){alert("خطا در فایل "+file.name+": "+e.message);}}
  function showDistributorRaw(d,kind){var host=$("distributorRawViewer");function paint(title,headers,rows){host.hidden=false;var archive=kind==="pharmacy"?(d.pharmacyImports||[]):[];host.innerHTML="<div class='card-header'><div class='card-title'>👁 "+esc(d.name+" — "+title)+" ("+rows.length.toLocaleString("fa-IR")+" ردیف)</div><button class='btn btn-outline raw-close'>بستن</button></div>"+(archive.length?"<div class='v20-card-tools'><button class='btn btn-outline raw-all'>همه دیتابیس</button>"+archive.map(function(x,i){return"<button class='btn btn-outline raw-batch' data-i='"+i+"'>"+esc(x.name+" — "+x.lastDate)+"</button>";}).join("")+"</div>":"")+"<div class='table-responsive'><table class='data-table'><thead><tr>"+(headers||[]).map(function(h){return"<th>"+esc(h)+"</th>";}).join("")+"</tr></thead><tbody>"+(rows||[]).slice(0,1000).map(function(r){return"<tr>"+r.map(function(v,i){var show=/تاریخ/.test(String((headers||[])[i]||""))?normSnappDate(v):v;return"<td>"+esc(show)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div>";host.querySelector('.raw-close').onclick=function(){host.hidden=true;};var all=host.querySelector('.raw-all');if(all)all.onclick=function(){paint("همه دیتابیس داروخانه",d.pharmacyHeaders,d.pharmacyRows);};Array.prototype.forEach.call(host.querySelectorAll('.raw-batch'),function(b){b.onclick=function(){var x=archive[Number(b.dataset.i)];paint("فایل "+x.name,x.headers||d.pharmacyHeaders,Array.isArray(x.rows)?x.rows:[]);};});host.scrollIntoView({behavior:"smooth"});}if(kind==="pharmacy")paint("همه دیتابیس داروخانه",d.pharmacyHeaders,d.pharmacyRows);else paint("موجودی فعلی — "+((d.inventoryImport||{}).name||""),d.inventoryHeaders,d.inventoryRows);}
  function findDistIndex(h,re,fb){for(var i=0;i<(h||[]).length;i++)if(re.test(String(h[i])))return i;return fb==null?-1:fb;}
  function distSchema(h,id){var x={date:findDistIndex(h,/تاریخ/,0),code:findDistIndex(h,/کد.*کالا|کد.*محصول/,-1),product:findDistIndex(h,/نام.*(کالا|محصول)|کالا|محصول/,1),qty:findDistIndex(h,/فروش.*تعداد|تعداد.*فروش/,2),dist:findDistIndex(h,/فروش.*ریال.*پخش|مبلغ.*پخش/,3),ph:findDistIndex(h,/فروش.*ریال.*داروخانه|مبلغ.*داروخانه/,4),giftQty:findDistIndex(h,/تعداد.*جایزه(?!.*مرجوع)/,5),giftRial:findDistIndex(h,/ریال.*جایزه(?!.*مرجوع)|مبلغ.*جایزه(?!.*مرجوع)/,6),retQty:findDistIndex(h,/تعداد.*مرجوع(?!.*جایزه)/,7),retRial:findDistIndex(h,/ریال.*مرجوع(?!.*جایزه)|مبلغ.*مرجوع(?!.*جایزه)/,8),retGiftQty:findDistIndex(h,/تعداد.*مرجوع.*جایزه/, -1),retGiftRial:findDistIndex(h,/ریال.*مرجوع.*جایزه|مبلغ.*مرجوع.*جایزه/,-1),pharmacy:findDistIndex(h,/نام.*داروخانه|داروخانه/,9),province:findDistIndex(h,/استان/,-1),city:findDistIndex(h,/شهر/,-1),district:findDistIndex(h,/منطقه/,-1),address:findDistIndex(h,/آدرس/,-1),invoice:findDistIndex(h,/شماره.*فاکتور|فاکتور/,10)};if(id==="daya"){x.date=13;x.invoice=12;x.code=15;x.qty=4;x.dist=3;x.ph=7;x.giftQty=2;}return x;}
  function invSchema(h,id){return{code:findDistIndex(h,/کد.*کالا|کد.*محصول/,-1),product:findDistIndex(h,/نام.*(کالا|محصول)|کالا|محصول/,0),qty:id==="daya"?2:findDistIndex(h,/موجودی.*تعداد|تعداد.*موجودی/,1),rial:findDistIndex(h,/موجودی.*ریال|ریال.*موجودی/,-1)};}
  function distFilter(){var mode=$("distModeDay").checked?"day":$("distModeMonth").checked?"month":$("distModeYear").checked?"year":($("distModeFrom").checked||$("distModeTo").checked)?"range":"all";return{mode:mode,year:enDigits($("distFilterYear").value),month:enDigits($("distFilterMonth").value),day:enDigits($("distFilterDay").value).padStart(2,"0"),from:normSnappDate($("distFilterFrom").value),to:normSnappDate($("distFilterTo").value)};}
  function distDatePass(v,f){var d=normSnappDate(v);if(f.mode==="year")return!f.year||d.slice(0,4)===f.year;if(f.mode==="month")return(!f.year||d.slice(0,4)===f.year)&&(!f.month||d.slice(5,7)===f.month);if(f.mode==="day")return(!f.year||d.slice(0,4)===f.year)&&(!f.month||d.slice(5,7)===f.month)&&(!f.day||d.slice(8,10)===f.day);if(f.mode==="range")return(!f.from||d>=f.from)&&(!f.to||d<=f.to);return true;}
  function canonicalProduct(raw,dbCode,distId){var name=String(raw||"").trim(),n=norm(name),code=String(dbCode==null?"":dbCode).replace(/\.0+$/,"").trim(),p=((st().products)||[]).filter(function(x){if(distId==="daya"&&code&&String(x.dayaDbCode||((x.code)?1111000+Number(x.code):""))===code)return true;var q=norm(x.name);return q===n||(q.length>=4&&n.indexOf(q)>=0)||(n.length>=4&&q.indexOf(n)>=0);})[0];if(p)return p.name;return distId==="daya"?null:(name||"نامشخص");}
  function productPrice(name,key){var p=((st().products)||[]).filter(function(x){return norm(x.name)===norm(name);})[0]||{};return Number(key==="dist"?(p.distributorPrice||p.distPrice||p.price||0):(p.pharmacyPrice||p.price||0));}
  function emptyMetric(){return{qty:0,dist:0,ph:0,giftQty:0,giftRial:0,retQty:0,retRial:0,retGiftQty:0,retGiftRial:0,pharmacies:{},invoices:{},invQty:0,invDist:0,invPh:0};}
  function distributorMetrics(d){var f=distFilter(),sc=distSchema(d.pharmacyHeaders,d.id),is=invSchema(d.inventoryHeaders,d.id),map={};(d.pharmacyRows||[]).forEach(function(r){if(!distDatePass(r[sc.date],f))return;var n=canonicalProduct(r[sc.product],sc.code>=0?r[sc.code]:"",d.id);if(!n)return;var m=map[n]||(map[n]=emptyMetric()),qty=snappNumber(r[sc.qty]),dq=productPrice(n,"dist"),pq=productPrice(n,"ph"),dist=sc.dist>=0?snappNumber(r[sc.dist]):0,ph=sc.ph>=0?snappNumber(r[sc.ph]):0,ret=snappNumber(r[sc.retQty]);m.qty+=qty;m.dist+=dist||qty*dq;m.ph+=ph||qty*pq||qty*dq;m.giftQty+=snappNumber(r[sc.giftQty]);m.giftRial+=snappNumber(r[sc.giftRial]);m.retQty+=ret;m.retRial+=snappNumber(r[sc.retRial]);m.retGiftQty+=snappNumber(r[sc.retGiftQty]);m.retGiftRial+=snappNumber(r[sc.retGiftRial]);var pk=[sc.pharmacy,sc.province,sc.city,sc.district,sc.address].map(function(i){return i>=0?norm(r[i]):"";}).join("|");if(pk.replace(/\|/g,"") )m.pharmacies[pk]=1;if(sc.invoice>=0&&r[sc.invoice]&&!(ret&&ret===qty))m.invoices[String(r[sc.invoice])]=1;});(d.inventoryRows||[]).forEach(function(r){var n=canonicalProduct(r[is.product],is.code>=0?r[is.code]:"",d.id);if(!n)return;var m=map[n]||(map[n]=emptyMetric()),q=snappNumber(r[is.qty]);m.invQty+=q;m.invDist+=q*productPrice(n,"dist");m.invPh+=q*productPrice(n,"ph");});((st().products)||[]).forEach(function(p){var n=p.name||"";if(n&&!map[n])map[n]=emptyMetric();});return map;}
  function mergeMetricMaps(target,src){Object.keys(src).forEach(function(n){var a=target[n]||(target[n]=emptyMetric()),b=src[n];["qty","dist","ph","giftQty","giftRial","retQty","retRial","retGiftQty","retGiftRial","invQty","invDist","invPh"].forEach(function(k){a[k]+=b[k]||0;});Object.assign(a.pharmacies,b.pharmacies);Object.assign(a.invoices,b.invoices);});return target;}

  function metricRows(map){var totalSales=Object.values(map).reduce(function(s,m){return s+m.qty;},0);return Object.keys(map).sort().map(function(n){var m=map[n],giftPct=m.qty?m.giftQty/m.qty*100:0,retPct=m.qty?m.retQty/m.qty*100:0,retGiftPct=m.giftQty?m.retGiftQty/m.giftQty*100:0,share=totalSales?m.qty/totalSales*100:0;return[n,m.qty,m.dist,m.ph,m.giftQty,m.giftRial,giftPct,m.retQty,m.retRial,retPct,m.retGiftQty,m.retGiftRial,retGiftPct,Object.keys(m.pharmacies).length,Object.keys(m.invoices).length,share,m.invQty,m.invDist,m.invPh];});}
  function totalMetricRow(rows){var t=["جمع کل"];for(var c=1;c<19;c++){if([6,9,12,15].indexOf(c)>=0){if(c===6){var a=rows.reduce(function(s,r){return s+Number(r[4]||0);},0),b=rows.reduce(function(s,r){return s+Number(r[1]||0);},0);t[c]=b?a/b*100:0;}else if(c===9){var a=rows.reduce(function(s,r){return s+Number(r[7]||0);},0),b=rows.reduce(function(s,r){return s+Number(r[1]||0);},0);t[c]=b?a/b*100:0;}else if(c===12){var a=rows.reduce(function(s,r){return s+Number(r[10]||0);},0),b=rows.reduce(function(s,r){return s+Number(r[4]||0);},0);t[c]=b?a/b*100:0;}else t[c]=rows.length?100:0;}else t[c]=rows.reduce(function(s,r){return s+Number(r[c]||0);},0);}return t;}
  function displayMetric(v,i){if(i===0)return esc(v);if([6,9,12,15].indexOf(i)>=0)return Number(v||0).toLocaleString("fa-IR",{maximumFractionDigits:2})+"٪";return Number(v||0).toLocaleString("fa-IR");}

  function reportTableHtml(title,rows){var all=rows.concat([totalMetricRow(rows)]);return"<div class='card'><div class='card-header'><div class='card-title'>"+esc(title)+"</div></div><div class='table-responsive'><table class='data-table'><thead><tr>"+DIST_HEADERS.map(function(h){return"<th>"+h+"</th>";}).join("")+"</tr></thead><tbody>"+all.map(function(r){return"<tr>"+r.map(function(v,i){return"<td>"+displayMetric(v,i)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div></div>";}
  function renderDistributorReport(){var ds=distStore(),all={};distReportCache={};DIST_DEFS.forEach(function(x){var map=distributorMetrics(ds[x[0]]);mergeMetricMaps(all,map);distReportCache[x[0]]=metricRows(map);});distReportCache.all=metricRows(all);var host=$("distributorReportTables");if(host)host.innerHTML=reportTableHtml("همه پخش‌ها",distReportCache.all)+DIST_DEFS.map(function(x){return reportTableHtml(x[1],distReportCache[x[0]]);}).join("");var s=$("distributorReportSummary"),tot=totalMetricRow(distReportCache.all);if(s)s.innerHTML=[["جمع فروش تعدادی",tot[1]],["جمع ریال پخش",tot[2]],["جمع ریال داروخانه",tot[3]],["موجودی تعدادی",tot[16]]].map(function(x){return"<div class='v20-metric'>"+x[0]+"<b>"+Number(x[1]||0).toLocaleString("fa-IR")+"</b></div>";}).join("");}
  function periodRows(){var f=distFilter();if(f.mode==="year")return[["سال",f.year]];if(f.mode==="month")return[["سال",f.year],["ماه",f.month]];if(f.mode==="day")return[["سال",f.year],["ماه",f.month],["روز",f.day]];if(f.mode==="range")return[["از تاریخ",f.from],["تا تاریخ",f.to]];return[["بازه","همه اطلاعات"]];}
  function xmlEsc(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function downloadDistributorWorkbook(){renderDistributorReport();var sheets=[["همه پخش‌ها",distReportCache.all]].concat(DIST_DEFS.map(function(x){return[x[1],distReportCache[x[0]]];})),xml='<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';sheets.forEach(function(sh){xml+='<Worksheet ss:Name="'+xmlEsc(sh[0])+'"><Table>';periodRows().forEach(function(r){xml+='<Row><Cell><Data ss:Type="String">'+xmlEsc(r[0])+'</Data></Cell><Cell><Data ss:Type="String">'+xmlEsc(r[1])+'</Data></Cell></Row>';});xml+='<Row>'+DIST_HEADERS.map(function(h){return'<Cell><Data ss:Type="String">'+xmlEsc(h)+'</Data></Cell>';}).join('')+'</Row>';sh[1].concat([totalMetricRow(sh[1])]).forEach(function(r){xml+='<Row>'+r.map(function(v,i){return'<Cell><Data ss:Type="'+(i?'Number':'String')+'">'+xmlEsc(v)+'</Data></Cell>';}).join('')+'</Row>';});xml+='</Table></Worksheet>';});xml+='</Workbook>';var blob=new Blob([xml],{type:'application/vnd.ms-excel'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='گزارش-فروش-پخش‌ها.xls';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);}
  function bindDistributorFilters(){var ids=["distModeYear","distModeMonth","distModeDay","distModeFrom","distModeTo"];ids.forEach(function(id){var c=$(id);if(!c||c.dataset.bound)return;c.dataset.bound="1";c.onchange=function(){var range=/From|To/.test(id);if(c.checked){ids.forEach(function(x){var e=$(x);if(e)e.checked=range?/From|To/.test(x):x===id;});}else if(range){$("distModeFrom").checked=$("distModeTo").checked=false;}refreshDistFilterLock();};});["distFilterYear","distFilterMonth"].forEach(function(id){var e=$(id);if(e)e.oninput=refreshDistFilterLock;});["distFilterFrom","distFilterTo"].forEach(function(id){var e=$(id);if(e&&typeof window.attachJalaliPicker==="function")window.attachJalaliPicker(e);});refreshDistFilterLock();}
  function refreshDistFilterLock(){var y=String(($("distFilterYear")||{}).value||"").trim(),m=$("distFilterMonth"),day=$("distFilterDay");if(m){m.disabled=!y;m.classList.toggle("v20-grey",!y);var mg=m.closest(".form-group");if(mg)mg.classList.toggle("v20-grey-zone",!y);if(!y){m.value="";$("distModeMonth").checked=false;}}var off=!y||!String((m||{}).value||"");if(day){day.disabled=off;day.classList.toggle("v20-grey",off);var dg=day.closest(".form-group");if(dg)dg.classList.toggle("v20-grey-zone",off);if(off){day.value="";$("distModeDay").checked=false;}}}
  function setupDistributorSales(){renderDistributorActions();bindDistributorFilters();var b=$("btnBuildDistributorReport"),e=$("btnExportDistributorReport");if(b&&!b.dataset.bound){b.dataset.bound="1";b.onclick=function(){renderDistributorReport();$("distributorReportSummary").scrollIntoView({behavior:"smooth"});};}if(e&&!e.dataset.bound){e.dataset.bound="1";e.onclick=downloadDistributorWorkbook;}renderDistributorReport();}

  /* ---------- ۲۸) CRUD قطعی کالا در آخرین لایه ---------- */
  var PRODUCT_CODE_SEED={"سافتژلامگا3":1001,"سافتژلامگا5":1002,"سافتژلامگا3,5":1003,"سافتژلامگامولتی(3,5,6,9)":1004,"سافتژلامگاوومن":1005,"سافتژلامگامن":1006,"کپسولملاتونین":1007};
  function ensureProductCodes(){var S=st(),changed=false;(S.products||[]).forEach(function(p){if(!p.code){var code=PRODUCT_CODE_SEED[norm(p.name)];if(code){p.code=code;changed=true;}}if(p.code&&!p.dayaDbCode){p.dayaDbCode=1111000+Number(p.code);changed=true;}});if(changed)save();}

  function resetProductV20(){window._editingProductId="";var f=$("formProduct");if(f)f.reset();var n=$("productName");if(n){n.value="";n.focus();}var b=$("productSavedBanner");if(b)b.hidden=true;}
  function saveProductV20(){var S=st(),name=String(($("productName")||{}).value||"").trim(),code=parseInt(($("productCode")||{}).value,10)||0;if(!code)return alert("کد کالا را وارد کنید.");if(!name)return alert("نام کالا را وارد کنید.");var id=window._editingProductId||"",idx=(S.products||[]).findIndex(function(p){return(id&&p.id===id)||(!id&&norm(p.name)===norm(name));}),rec=idx>=0?S.products[idx]:{id:"prod-"+Date.now()};rec.name=name;rec.code=code;rec.dayaDbCode=1111000+code;rec.distributorPrice=parseInt(($("productDistPrice")||{}).value,10)||0;rec.pharmacyPrice=parseInt(($("productPrice")||{}).value,10)||0;rec.stock=parseInt(($("productStock")||{}).value,10)||0;if(idx<0)S.products.push(rec);save();window._editingProductId="";try{if(typeof renderColumnsProductsTable==="function")renderColumnsProductsTable();}catch(e){}try{if(typeof mergeCatalogIntoOrderItems==="function")mergeCatalogIntoOrderItems();}catch(e){}v20Toast("✅ کالا «"+name+"» "+(idx<0?"اضافه":"ویرایش")+" شد.");resetProductV20();}
  function bindProductCrudV20(){var form=$("formProduct"),btn=$("btnSaveProduct");if(btn&&!btn.dataset.v20crud){btn.dataset.v20crud="1";btn.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();saveProductV20();},true);}if(form&&!form.dataset.v20crud){form.dataset.v20crud="1";form.addEventListener("submit",function(e){e.preventDefault();e.stopImmediatePropagation();saveProductV20();},true);}var pane=$("tab-columns-products"),head=pane&&pane.querySelector("#formProduct")&&pane.querySelector("#formProduct").closest(".card").querySelector(".card-header");if(head&&!$("v20NewProduct")){var n=document.createElement("button");n.id="v20NewProduct";n.type="button";n.className="btn btn-outline btn-sm";n.textContent="➕ کالای جدید";n.onclick=resetProductV20;head.appendChild(n);}window.editProductCatalogItem=function(id){var p=(st().products||[]).filter(function(x){return String(x.id)===String(id);})[0];if(!p)return;window._editingProductId=p.id;if($("productCode"))$("productCode").value=p.code||"";if($("productName"))$("productName").value=p.name||"";if($("productDistPrice"))$("productDistPrice").value=p.distributorPrice||p.price||"";if($("productPrice"))$("productPrice").value=p.pharmacyPrice||p.price||"";if($("productStock"))$("productStock").value=p.stock||"";$("productName").scrollIntoView({behavior:"smooth",block:"center"});};function patchCodes(){var body=$("tableProductsBody"),S=st();if(!body)return;Array.prototype.forEach.call(body.children,function(tr,i){if(tr.querySelector('.v20-product-code'))return;var td=document.createElement('td');td.className='v20-product-code';td.innerHTML='<strong>'+esc(((S.products||[])[i]||{}).code||'—')+'</strong>';tr.insertBefore(td,tr.children[1]||null);});}if(typeof window.renderColumnsProductsTable==='function'&&!window.renderColumnsProductsTable._v20code){var rr=window.renderColumnsProductsTable,w=function(){var x=rr.apply(this,arguments);patchCodes();return x;};w._v20code=true;window.renderColumnsProductsTable=w;}patchCodes();var old=window.deleteProductCatalogItem;window.deleteProductCatalogItem=function(id){var S=st(),p=(S.products||[]).filter(function(x){return String(x.id)===String(id);})[0];if(!p)return;if(!confirm("کالای «"+(p.name||"")+"» حذف شود؟"))return;S.products=(S.products||[]).filter(function(x){return String(x.id)!==String(id);});S.salesTargets=(S.salesTargets||[]).filter(function(t){return norm(t.productName)!==norm(p.name);});(S.orders||[]).forEach(function(o){o.items=(o.items||[]).filter(function(i){return norm(i.name)!==norm(p.name);});});Array.prototype.forEach.call(document.querySelectorAll('.order-item-row'),function(r){var n=r.querySelector('.order-item-name');if(n&&norm(n.value)===norm(p.name))r.remove();});save();try{if(typeof renderColumnsProductsTable==="function")renderColumnsProductsTable();}catch(e){}try{if(typeof mergeCatalogIntoOrderItems==="function")mergeCatalogIntoOrderItems();}catch(e){}v20Toast("✅ کالا حذف شد.");};}

  /* ---------- ۲۹) IndexedDB برای ماندگاری فایل‌های حجیم اکسل ---------- */
  function bulkDb(){return new Promise(function(res,rej){var q=indexedDB.open("crmBulkData",1);q.onupgradeneeded=function(){if(!q.result.objectStoreNames.contains("kv"))q.result.createObjectStore("kv");};q.onsuccess=function(){res(q.result);};q.onerror=function(){rej(q.error);};});}
  function bulkPut(key,val){return bulkDb().then(function(db){return new Promise(function(res,rej){var tx=db.transaction("kv","readwrite");tx.objectStore("kv").put(val,key);tx.oncomplete=function(){res();};tx.onerror=function(){rej(tx.error);};});});}
  function bulkGet(key){return bulkDb().then(function(db){return new Promise(function(res,rej){var q=db.transaction("kv","readonly").objectStore("kv").get(key);q.onsuccess=function(){res(q.result||null);};q.onerror=function(){rej(q.error);};});});}
  function captureBulkState(){var S=st(),sc=S.snappCorporate||{},dc=S.distributorCompanies||{},dist={};Object.keys(dc).forEach(function(id){var d=dc[id]||{};dist[id]={pharmacyRows:d.pharmacyRows||[],pharmacyImports:d.pharmacyImports||[],inventoryRows:d.inventoryRows||[]};});return{snapp:{rows:sc.rows||[],topups:sc.topups||[],tripImports:sc.tripImports||[],topupImports:sc.topupImports||[]},distributors:dist,savedAt:Date.now()};}
  function hasBulk(b){return b&&((b.snapp&&((b.snapp.rows||[]).length||(b.snapp.topups||[]).length))||Object.keys(b.distributors||{}).some(function(id){var d=b.distributors[id];return(d.pharmacyRows||[]).length||(d.inventoryRows||[]).length;}));}
  function applyBulkState(b){if(!hasBulk(b))return false;var S=st();S.snappCorporate=S.snappCorporate||{};["rows","topups","tripImports","topupImports"].forEach(function(k){if((b.snapp[k]||[]).length)S.snappCorporate[k]=b.snapp[k];});S.distributorCompanies=S.distributorCompanies||{};Object.keys(b.distributors||{}).forEach(function(id){var to=S.distributorCompanies[id]||(S.distributorCompanies[id]={id:id}),from=b.distributors[id];["pharmacyRows","pharmacyImports","inventoryRows"].forEach(function(k){if((from[k]||[]).length)to[k]=from[k];});});return true;}
  function saveBulkVault(){if(!window.indexedDB)return Promise.resolve(false);return bulkPut("bulk-v1",captureBulkState()).then(function(){return true;}).catch(function(){return false;});}
  function initBulkVault(){if(!window.indexedDB){window.__CRM_BULK_READY=true;return Promise.resolve(false);}var now=captureBulkState();if(hasBulk(now))return saveBulkVault().then(function(){window.__CRM_BULK_READY=true;return true;});return bulkGet("bulk-v1").then(function(b){if(applyBulkState(b)){try{saveState(false);}catch(e){}renderSnappCorporate();renderDistributorActions();renderDistributorDatabase();renderDistributorReport();v20Toast("✅ دیتابیس‌های اکسل از حافظه پایدار بازیابی شدند.");}window.__CRM_BULK_READY=true;return true;}).catch(function(){window.__CRM_BULK_READY=true;return false;});}

  /* ---------- هُوک رفتن به تب‌ها ---------- */
  var v20LastTab = (document.querySelector(".tab-pane.active") || {}).id || "";
  function onTabChanged(id) {
    if (v20LastTab === "tab-orders" && id !== "tab-orders") clearOrderPharmacyDraft();
    if (id === "tab-orders" && v20LastTab !== "tab-orders") clearOrderPharmacyDraft();
    v20LastTab = id;
    v20RefreshFab();
    renderVersionBadge();
    applySnappVisibility();
    v20ApplyGreyChains();
    if (id === "tab-orders") { v20ApplyOrderLock(); setTimeout(v20PlaceMatchNearInput, 60); }
    if (id === "tab-custom-fields") setTimeout(window.v20RenderComboManager, 60);
    if (id === "tab-columns-products") setTimeout(function(){ renderProductExtras(); applyProductSettings(); bindProductCrudV20(); }, 80);
    if (id === "tab-users-permissions") setTimeout(renderPresetBar, 60);
    if (id === "tab-messengers") setTimeout(renderShareManager, 60);
    if (id === "tab-snapp-corporate") setTimeout(setupSnappCorporate, 60);
    if (id === "tab-distributor-companies") setTimeout(renderDistributorCompanies, 60);
    if (id === "tab-distributor-sales") setTimeout(setupDistributorSales, 60);
    if (id === "tab-distributor-database") setTimeout(renderDistributorDatabase, 60);
    if (id === "tab-live-location") setTimeout(enhanceLiveLocation, 120);
    if (id === "tab-my-visit") setTimeout(refreshVisitCards, 60);
    if (id === "tab-rep-routes") setTimeout(renderV20Routes, 80);
    if (id === "tab-sales-targets") setTimeout(renderTargetsV20, 120);
  }
  function wrapSwitchTab() {
    var os = window.switchTab;
    if (typeof os !== "function" || os._v20wrapped) return;
    var w = function (id) {
      var r = os.apply(this, arguments);
      try { onTabChanged(id); } catch (e) {}
      return r;
    };
    w._v20wrapped = true;
    window.switchTab = w;
  }

  /* ---------- شنونده‌های زنده ---------- */
  function bindLive() {
    // بعد از جایگذاری خودکار داروخانه در سفارش، قفل/بازشدن فیلدها
    document.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("#tab-orders")) {
        setTimeout(v20ApplyOrderLock, 70);
      }
    });
    document.addEventListener("change", function () {
      setTimeout(v20ApplyGreyChains, 30);
      var pn = $("orderPharmacyName");
      if (document.activeElement === pn || (pn && !String(pn.value || "").trim())) setTimeout(v20ApplyOrderLock, 40);
    });
    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "orderPharmacyName" && !String(e.target.value || "").trim()) {
        setTimeout(v20ApplyOrderLock, 40);
      }
    });
    // اعمال فوری تغییرات کشویی‌ها در مدیر افزودن‌ها
    var pane = $("tab-custom-fields");
    if (pane && window.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        clearTimeout(t);
        t = setTimeout(function () {
          var host = $("addTabPanel");
          if (host && !host.querySelector(".v20-addmgr")) window.v20RenderComboManager();
        }, 300);
      }).observe(pane, { childList: true, subtree: true });
    }
    // رسم مجدد مدیر کشویی‌ها بعد از هر ذخیره وضعیت (بدون حلقه)
    var osv = window.saveState;
    if (typeof osv === "function") {
      window.saveState = function () {
        var r = osv.apply(this, arguments);
        try {
          var cf = $("tab-custom-fields");
          if (cf && cf.classList.contains("active") && !window._v20Rendering) {
            window._v20Rendering = true;
            setTimeout(function () { window._v20Rendering = false; window.v20RenderComboManager(); }, 350);
          }
        } catch (e) {}
        return r;
      };
    }
  }

  /* ---------- شروع ---------- */
  function init() {
    try { initBulkVault(); } catch (e) {}
    try { seedGreyDefaults(); } catch (e) {}
    try { wrapSwitchTab(); } catch (e) {}
    try { wrapListRenderers(); } catch (e) {}
    try { bindInstantAddSave(); } catch (e) {}
    try { bindMirror(); } catch (e) {}
    try { wrapFormLayoutMirror(); } catch (e) {}
    try { bindLive(); } catch (e) {}
    try { bindChpassFab(); } catch (e) {}
    try { bindOrderLocalMatch(); } catch (e) {}
    try { bindOrderResetProof(); } catch (e) {}
    try { ensureProductCodes(); bindProductPersistence(); applyProductSettings(); bindProductCrudV20(); } catch (e) {}
    try { renderVersionBadge(); } catch (e) {}
    try { wrapShareModal(); } catch (e) {}
    try { renderShareManager(); } catch (e) {}
    try { bindV20Visit(); } catch (e) {}
    try { bindLiveAll(); } catch (e) {}
    try { setupSnappCorporate(); applySnappVisibility(); } catch (e) {}
    try { renderDistributorCompanies(); setupDistributorSales(); renderDistributorDatabase(); } catch (e) {}
    try { bindEmailBackup(); } catch (e) {}
    try { bindTargetsV20(); } catch (e) {}
    try { bindNumberFormatting(); } catch (e) {}
    try { bindGlobalDateLaw(); } catch (e) {}
    try { bindDurableServerState(); } catch (e) {}
    try { wrapNewestTables(); } catch (e) {}
    // هیچ فیلد/کادر/کلیدی در شروع نسخه خودکار کم یا زیاد نشود؛ تغییر ساختار فقط با اقدام مدیر.
    // اعمال اولیه موتورها روی تب فعال
    setTimeout(function () {
      try {
        v20ApplyGreyChains();
        v20ApplyOrderLock();
        mirrorPharmacyOrderToOrders();
        var active = document.querySelector(".tab-pane.active");
        if (active) onTabChanged(active.id);
      } catch (e) {}
    }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 60); });
  else setTimeout(init, 60);
})();
