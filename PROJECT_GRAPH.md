# 🕸️ گراف دانش پروژه «نماینده علمی» (PROJECT_GRAPH.md)

> این فایل **خودکار** ساخته می‌شود — با دستور `python update_project_graph.py`
> و در پایان هر تحویل، قبل از بازسازی chat.arena، تازه می‌شود (قانون ۶۶ AI_RULES).
> **قانون برای هوش مصنوعی: به‌جای خواندن کل سورس، اول این فایل را بخوان؛**
> جزئیات متن کامل فایل‌ها در بخش ۹ chat.arena است.

## الف) زنجیره لود اسکریپت‌ها (ترتیب اجرا در مرورگر)

1. `leaflet.js`
2. `crm-runtime.js`
3. `crm-hub.js`
4. `crm-data.js`
5. `crm-app.js`
6. `crm-bundle.js`

## ب) کارت فایل‌ها (نقش + توابع + نام‌های window که می‌سازد)

### `server.js` (50255 بایت)
- نقش: سرور سبک Node.js برای Render — ورود جدا، gzip، health، ژئوکد، محدودیت نرخ
- تعداد توابع داخلی: 57
- endpointهای سرور: `/api/backup`, `/api/backup/email`, `/api/backup/status`, `/api/bulk`, `/api/bulk`, `/api/cleanup`, `/api/feedback`, `/api/feedback`, `/api/push/public-key`, `/api/push/send`, `/api/push/subscribe`, `/api/runtime-config`, `/api/state`, `/api/state`

### `scripts/build-sw.mjs` (2656 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 2

### `scripts/build.js` (720 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 0

### `scripts/clean-extra-files.mjs` (7278 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 12

### `scripts/generate-assets.mjs` (11033 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 6

### `scripts/simplify-geojson.mjs` (2550 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 3

### `scripts/start.mjs` (1567 بایت)
- نقش: #!/usr/bin/env node
- تعداد توابع داخلی: 2

### `public/cloudflare-worker.js` (8066 بایت)
- نقش: **
- تعداد توابع داخلی: 8

### `public/crm-app.js` (194166 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 187
- نام‌های window که تعریف/بازنویسی می‌کند: `CRM_APP_VERSION`, `__CRM_GET_STATE`, `__CRM_HAD_SAVED_STATE`, `__CRM_STATE_BOUND`, `__CRM_SW_READY`, `_editingProductId`, `_editingRepHomeId`, `_lastSavedProductId`, `_lastSavedProductName`, `_navHamburgerBound`, `activeDateInputForPicker`, `applyAllFormLayouts`, `applyCustomFieldOrderInForm`, `applyV77ProductPricing`, `attachInstantAdd`, `attachJalaliPicker`, `buildDesignerWidget`, `cleanupOrphanCustomFields`, `crmAddMapTiles`, `crmPushStateToServer`, `getAllMenuSections`, `isSecureContext`, `paintV77ProductPricing`, `rememberPharmacyName`, `renderDoctorsList`, `renderExtraTabCustomFields`, `renderPharmaciesList`, `syncProductsEverywhere`, `v12OpsOnlyRestore`, `v12TahaName`, `v12TakeRegisteredOnly`, `validateRequiredFields`

### `public/crm-bundle.js` (1371458 بایت)
- نقش: * crm-bundle.js — فایل واحد برنامه (ادغام عینی لایه‌ها با همان ترتیب اجرای قبلی؛ نسخه از package.json) */
- تعداد توابع داخلی: 1383
- نام‌های window که تعریف/بازنویسی می‌کند: `CRMJalali`, `CRM_HUBS`, `CRM_HUB_DOMAINS`, `FA_FIELD_LABELS`, `IRAN_FACILITIES`, `IRAN_GEO_DATA`, `L`, `LIST_TARGETS_V1216`, `WIDGET_PALETTE`, `__CRM_APPLYING_SERVER`, `__CRM_BULK_PURGE`, `__CRM_BULK_READY`, `__CRM_GET_STATE`, `__CRM_HAD_SAVED_STATE`, `__CRM_LATIN_NUMBER_LAW`, `__CRM_LAYOUT_APPLYING`, `__CRM_MANAGER_LAYOUT_INTENT`, `__CRM_MANAGER_LAYOUT_TIMER`, `__CRM_ORIGIN_BOOTSTRAP_CHECKED`, `__CRM_SAFE_BROWSER_GUARDS`, `__CRM_SERVER_READY`, `__CRM_SKIP_V64_STRIP`, `__CRM_SNAP`, `__CRM_UNVEIL`, `__CRM_V78_EDIT_PID`, `__CRM_WD`, `__V40_REFADD`, `__V42CD`, `__V42CSS`, `__V62_ATTACH`, `__V64_OBS`, `__V67_SYNC`, `__V68_WATCH`, `__V69_SYNC`, `__V70_SOLO`, `__V71_CLAIMED`, `__V72_BOOT`, `__V73_BOOT`, `__V73_WATCH`, `__V79_BOOT`

### `public/crm-data.js` (57830 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 1
- نام‌های window که تعریف/بازنویسی می‌کند: `DOCTOR_SPECIALTIES`, `IRAN_GEO_DATA`

### `public/crm-hub.js` (7553 بایت)
- نقش: * v11.99.0: نت‌افراز مستقل و سریع — GET فقط origin؛ همگام پس‌زمینه بدون توقف UI */
- تعداد توابع داخلی: 20
- نام‌های window که تعریف/بازنویسی می‌کند: `CRM_HUB_DOMAINS`, `__CRM_ORIG_FETCH`, `__CRM_RUNTIME`, `crmHubList`, `fetch`, `v1213AltApi`, `v92HubFetch`, `v93HubFetch`, `v94StaticLocal`, `v95OriginOnly`, `v99FastLocal`, `v99Peers`

### `public/crm-jalali.js` (25683 بایت)
- نقش: تقویم شمسی واقعی + نشانگر میلادی JAN..DEC + تقویم کنار فیلد تاریخ + افزودن لحظه‌ای
- تعداد توابع داخلی: 38
- نام‌های window که تعریف/بازنویسی می‌کند: `CRMJalali`, `_jalaliBuildPatched`, `_jalaliLayoutPatched`, `_jalaliRenderPatched`, `_jalaliSw`, `activeDateInputForPicker`, `applyFullFormLayout`, `attachInstantAdd`, `attachJalaliPicker`, `buildDesignerWidget`, `refreshAllDateBadges`, `renderCustomFieldsInForm`, `renderJalaliCalendarDays`, `setupInstantAddAll`, `setupJalaliCalendarPicker`, `setupJalaliDateAutoSlash`, `switchTab`

### `public/crm-runtime.js` (228 بایت)
- نقش: * تنظیمات اجرای پویا — با env در Render یا build-static برای نت‌افراز پر می‌شود */
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `__CRM_RUNTIME`

### `public/iran-facilities.js` (11799 بایت)
- نقش: پایگاه مرجع مراکز درمان ایران — مراکز شاخص هر استان (نه تک‌تک داروخانه‌های کشور)
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `IRAN_FACILITIES`

### `public/leaflet.js` (147552 بایت)
- نقش: * @preserve
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `L`

### `public/sw-template.js` (15367 بایت)
- نقش: * ============================================================
- تعداد توابع داخلی: 10

### `public/sw.js` (5417 بایت)
- نقش: const BUILD = "12.17.1";
- تعداد توابع داخلی: 6

### `public/vendor/leaflet.js` (147552 بایت)
- نقش: * @preserve
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `L`

## ج) گراف بازنویسی نام‌های window (چه فایلی روی چه فایلی سوار می‌شود)

- `CRMJalali`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `CRM_HUB_DOMAINS`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `IRAN_FACILITIES`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/iran-facilities.js`
- `IRAN_GEO_DATA`: تعریف/بازنویسی به ترتیب لود → `public/crm-data.js` ← `public/crm-bundle.js`
- `L`: تعریف/بازنویسی به ترتیب لود → `public/leaflet.js` ← `public/crm-bundle.js` ← `public/vendor/leaflet.js`
- `__CRM_GET_STATE`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `__CRM_HAD_SAVED_STATE`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `__CRM_RUNTIME`: تعریف/بازنویسی به ترتیب لود → `public/crm-runtime.js` ← `public/crm-hub.js`
- `_editingProductId`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `_jalaliBuildPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliLayoutPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliRenderPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliSw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `activeDateInputForPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-jalali.js`
- `applyAllFormLayouts`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `applyCustomFieldOrderInForm`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `applyFullFormLayout`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `applyV77ProductPricing`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `attachInstantAdd`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-jalali.js`
- `attachJalaliPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-jalali.js`
- `buildDesignerWidget`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-jalali.js`
- `cleanupOrphanCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `crmPushStateToServer`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `fetch`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `getAllMenuSections`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `isSecureContext`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `paintV77ProductPricing`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `refreshAllDateBadges`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `rememberPharmacyName`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `renderCustomFieldsInForm`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `renderDoctorsList`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `renderExtraTabCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `renderJalaliCalendarDays`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `renderPharmaciesList`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `setupInstantAddAll`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `setupJalaliCalendarPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `setupJalaliDateAutoSlash`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `switchTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `syncProductsEverywhere`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `v12TahaName`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `v12TakeRegisteredOnly`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `v95OriginOnly`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `v99Peers`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `validateRequiredFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`

## د) گراف API (سرویس api ↔ مصرف‌کننده‌ها)

- `/api/backup` [GET] — مصرف‌کننده: —
- `/api/backup/email` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/backup/status` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/bulk` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/cleanup` [GET] — مصرف‌کننده: —
- `/api/feedback` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/geocode?q=` [؟] — مصرف‌کننده: `public/crm-app.js`
- `/api/health` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/health?_=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/health?__diag=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/health?__wd=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/public-key` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/send` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/subscribe` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/reverse?lat=` [؟] — مصرف‌کننده: `public/crm-app.js`, `public/crm-bundle.js`
- `/api/runtime-config` [GET] — مصرف‌کننده: —
- `/api/state` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v60=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v65=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v67=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v69=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v69boot=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v70=1` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v70boot=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v72boot=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v73boot=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v81boot=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?__v97=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v71=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v71p=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v73push=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v79=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v79p=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v80push=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/state?replace=1&__v81push=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/sync?target=pull&mode=replace` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/sync?target=render` [؟] — مصرف‌کننده: `public/crm-bundle.js`

## هـ) گراف حافظه مرورگر (کلید ↔ فایل‌های دست‌زننده)

- `CRM_APP_STATE_CORRUPT_ARCHIVE_` ← localStorage: `public/crm-app.js`
- `CRM_APP_STATE_V2` ← localStorage: `public/crm-bundle.js`
- `CRM_ASSET_BUILD` ← localStorage: `server.js`
- `CRM_CACHE_RESCUED_` ← sessionStorage: `server.js`
- `CRM_DIAG_LOG` ← localStorage: `public/crm-bundle.js`
- `CRM_LAST_GPS` ← localStorage: `public/crm-bundle.js`
- `CRM_LOGIN_EXP` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_LOGIN_OK` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_MANAGER_GRID_ORDER_V2` ← localStorage: `public/crm-bundle.js`
- `CRM_PENDING_SYNC` ← sessionStorage: `public/crm-bundle.js`
- `CRM_RESET_LOCK` ← sessionStorage: `server.js`
- `CRM_SOLO_CLAIM` ← localStorage: `public/crm-bundle.js`
- `CRM_SOLO_EPOCH` ← localStorage: `public/crm-bundle.js`
- `CRM_USERS_AUTH` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_V1217_CLEANUP` ← sessionStorage: `public/crm-bundle.js`
- `CRM_V39_ORDER_CANONICAL_RESET` ← localStorage: `public/crm-bundle.js`
- `CRM_V97_RELOADED` ← sessionStorage: `public/crm-bundle.js`
- `crmLoggedIn` ← sessionStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `crmUserId` ← sessionStorage: `public/crm-bundle.js`
- `crmUserName` ← sessionStorage: `public/crm-bundle.js`
- `crmUserRole` ← sessionStorage: `public/crm-bundle.js`
- `crmUsername` ← sessionStorage: `public/crm-bundle.js`
- `distPass_` ← sessionStorage: `public/crm-bundle.js`

## و) گراف تب‌ها (تب ↔ فایل‌هایی که با المان‌هایش کار می‌کنند)

### tab-activity-log «⏱️ فعالیت لحظه‌ای»
- `public/crm-app.js` → 2 شناسه (مثل: `btnRefreshActivity`, `tableActivityLogBody`)
- `public/crm-bundle.js` → 7 شناسه (مثل: `activityChartBox`, `btnRefreshActivity`, `map-activity-log`, `tableActivityLogBody`, `v76HeatAll`, `v76HeatRep`, `v76HeatStatus`)

### tab-backup «💾 پشتیبان‌گیری»
- `public/crm-app.js` → 14 شناسه (مثل: `autoBackupHandleStatus`, `btnCancelRestore`, `btnConfirmRestore`, `btnManualBackupNow`, `btnSelectAutoBackupFolder`, `chkAutoBackupEnabled`, `dropzoneRestore`, `fileInputRestore`)
- `public/crm-bundle.js` → 4 شناسه (مثل: `autoBackupHandleStatus`, `backupEmailInput`, `backupIntervalSelect`, `v87BackupStatus`)

### tab-changelog «»
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnDownloadUnappliedReport`, `btnRunDiagnosis`, `btnSendUnappliedReport`, `v41ChangeHost`, `v41DiagHost`, `v41ReportStatus`)

### tab-columns-products «🧱 ستون‌ها و کالاها»
- `public/crm-app.js` → 10 شناسه (مثل: `btnSaveProduct`, `formProduct`, `productCode`, `productConsumerPrice`, `productDistPrice`, `productName`, `productPrice`, `productSavedBanner`)
- `public/crm-bundle.js` → 11 شناسه (مثل: `btnSaveProduct`, `columnsDesignerHost`, `formProduct`, `productCode`, `productConsumerPrice`, `productDistPrice`, `productName`, `productPrice`)

### tab-custom-fields «➕ افزودن‌ها»
- `public/crm-app.js` → 9 شناسه (مثل: `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfOptionsWrapper`, `cfShowInForm`, `cfShowInList`, `cfTargetEntity`, `cfType`)
- `public/crm-bundle.js` → 12 شناسه (مثل: `addTabGrid`, `addTabPanel`, `btnSaveCustomField`, `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfSaveStatus`, `cfShowInForm`)

### tab-dashboard «📊 داشبورد»
- `public/crm-app.js` → 2 شناسه (مثل: `dashboardLaunchpadGrid`, `map-dashboard-overview`)
- `public/crm-bundle.js` → 11 شناسه (مثل: `btnAddDashWidget`, `dashboardChartsWidget`, `dashboardWidgetPicker`, `dashboardWidgetsHost`, `v84DashCharts`, `v84DashCity`, `v84DashDistrict`, `v84DashKpi`)

### tab-define-routes «🗺️ تعریف مسیر نمایندگان»
- `public/crm-bundle.js` → 7 شناسه (مثل: `btnSaveRepresentativeRoute`, `repRoutesOverview`, `representativeRoutesCard`, `routeManagerCity`, `routeManagerDistrict`, `routeManagerProvince`, `routeManagerRep`)

### tab-dist-targets «🎯 تارگت فروش هرپخش»
- `public/crm-bundle.js` → 3 شناسه (مثل: `v66DistTargetPlanner`, `v72DistBoxes`, `v72DistGrandBox`)

### tab-distributor-companies «🏢 اطلاعات شرکت‌ها»
- `public/crm-bundle.js` → 1 شناسه (مثل: `distributorCompanyGrid`)

### tab-distributor-database «🗄️ دیتابیس پخش‌ها»
- `public/crm-bundle.js` → 2 شناسه (مثل: `distributorDatabaseGrid`, `distributorRawViewer`)

### tab-distributor-invoice-status «🧾 وضعیت فاکتور پخش‌ها»
- `public/crm-bundle.js` → 12 شناسه (مثل: `invoiceStatusBody`, `invoiceStatusFrom`, `invoiceStatusModeFrom`, `invoiceStatusModeMonth`, `invoiceStatusModeTo`, `invoiceStatusModeYear`, `invoiceStatusMonth`, `invoiceStatusRep`)

### tab-distributor-sales «📦 اطلاعات فروش پخش‌ها»
- `public/crm-bundle.js` → 16 شناسه (مثل: `btnBuildDistributorReport`, `btnExportDistributorReport`, `distFilterDay`, `distFilterFrom`, `distFilterMonth`, `distFilterTo`, `distFilterYear`, `distModeDay`)

### tab-doctors «👨‍⚕️ پزشکان»
- `public/crm-app.js` → 29 شناسه (مثل: `btnDocMapSearch`, `btnDocPercentageNo`, `btnDocPercentageYes`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnExportDoctorsCSV`, `btnSaveDoctor`, `docFileDisplay`)
- `public/crm-bundle.js` → 16 شناسه (مثل: `btnDocMapSearch`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnSaveDoctor`, `cardDocList`, `docFileInput`, `doctorCity`, `doctorDistrict`)

### tab-install-app «📲 نصب اپ»
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnInstallAndroid`, `btnInstallIos`, `btnInstallWindows`)

### tab-leaves «📝 مرخصی‌ها»
- `public/crm-app.js` → 12 شناسه (مثل: `btnExportLeavesCSV`, `formLeaveRequest`, `leaveFromDate`, `leaveFromTime`, `leaveHoursGroup`, `leaveHoursInput`, `leaveReasonInput`, `leaveRepSelect`)
- `public/crm-bundle.js` → 1 شناسه (مثل: `formLeaveRequest`)

### tab-live-location «📍 موقعیت زنده»
- `public/crm-app.js` → 1 شناسه (مثل: `map-live-reps`)
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnFindLiveRep`, `btnRefreshLiveMap`, `btnSimulateLiveMovement`, `liveRepSearchSelect`, `tableLiveReps`, `tableLiveRepsBody`)

### tab-manual-design «🎨 طراحی دستی تب‌ها»
- `public/crm-bundle.js` → 15 شناسه (مثل: `btnManCopy`, `btnManOpenTab`, `btnManReset`, `btnManSave`, `manAddStatus`, `manBoxMaker`, `manCopyFrom`, `manCopyModeAll`)

### tab-messengers «💬 پیام‌رسان‌ها»
- `public/crm-bundle.js` → 1 شناسه (مثل: `messengerTogglesBox`)

### tab-monthly-reports «📈 گزارش ماهانه»
- `public/crm-app.js` → 2 شناسه (مثل: `btnExportMonthlyCSV`, `tableMonthlyReportsBody`)

### tab-my-visit «▶️ شروع/پایان ویزیت»
- `public/crm-bundle.js` → 5 شناسه (مثل: `btnEndVisit`, `btnStartVisit`, `map-my-visit`, `visitEndTimeBox`, `visitStatusBox`)

### tab-notifications «🔔 اعلان‌ها»
- `public/crm-app.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)
- `public/crm-bundle.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)

### tab-orders «📦 سفارشات»
- `public/crm-app.js` → 42 شناسه (مثل: `btnAddOrderItemRow`, `btnExportOrdersCSV`, `btnOrdPercentageNo`, `btnOrdPercentageYes`, `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `existingPharmacyAlertText`)
- `public/crm-bundle.js` → 26 شناسه (مثل: `btnOrdPercentageNo`, `btnOrdPercentageYes`, `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `cardOrdList`, `existingPharmacyAlertText`, `existingPharmacyTopAlert`)

### tab-overview-map «🗺️ نقشه جامع»
- `public/crm-app.js` → 4 شناسه (مثل: `btnFocusMapRegion`, `map-full-overview`, `mapFilterCity`, `mapFilterProvince`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnExportOverviewMapCSV`, `btnFocusMapRegion`, `cntOverviewDoctors`, `cntOverviewHospitals`, `cntOverviewPharmacies`, `mapFilterCity`, `mapFilterDistrict`, `mapFilterProvince`)

### tab-pharmacies «🏥 داروخانه‌ها»
- `public/crm-app.js` → 32 شناسه (مثل: `btnExportPharmaciesCSV`, `btnPhMapSearch`, `btnPhPercentageNo`, `btnPhPercentageYes`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `formPharmacy`)
- `public/crm-bundle.js` → 22 شناسه (مثل: `btnPhMapSearch`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `cardPhList`, `formPharmacy`, `phFileInput`, `phListCountBadge`)

### tab-product-pricing «💵 قیمت‌گذاری کالاها»
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnSaveProductPricing`, `v77CurrentPricesBody`, `v77NewPricesBody`)

### tab-rep-homes «🏠 منزل نمایندگان»
- `public/crm-app.js` → 3 شناسه (مثل: `repHomeAddressInput`, `repHomeSelect`, `tableRepHomesBody`)
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnRepHomeCurrentLocation`, `repHomeAddressInput`, `repHomeFloor`, `repHomePlate`, `repHomeSelect`, `tableRepHomesBody`)

### tab-rep-routes «🛣️ رصد تردد»
- `public/crm-app.js` → 1 شناسه (مثل: `tableRepRoutesBody`)
- `public/crm-bundle.js` → 4 شناسه (مثل: `btnRefreshRepRoutesMap`, `map-rep-routes-full`, `routeRepFilterSelect`, `tableRepRoutesBody`)

### tab-sales-targets «🎯 تارگت فروش نمایندگان»
- `public/crm-app.js` → 9 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtMonthSelect`, `tgtProductSelect`, `tgtRepSelect`)
- `public/crm-bundle.js` → 8 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtProductSelect`, `tgtSummaryBox`, `tgtYearInput`)

### tab-search-info «🔍 جستجوی اطلاعات»
- `public/crm-app.js` → 7 شناسه (مثل: `btnExportSearchInfoCSV`, `btnRunSearchInfo`, `map-search-info`, `searchInfoDocInput`, `searchInfoHospInput`, `searchInfoPhInput`, `tableSearchInfoBody`)

### tab-sms-center «📨 سامانه پیامکی»
- `public/crm-app.js` → 31 شناسه (مثل: `btnNavBalad`, `btnNavGoogle`, `btnNavNeshan`, `btnNavWaze`, `btnRowCopyText`, `btnRowDelete`, `btnRowEdit`, `diagnosticOfflineBanner`)
- `public/crm-bundle.js` → 11 شناسه (مثل: `btnRowCopyText`, `formLoginModal`, `jalaliCalendarPopup`, `jalaliDaysGrid`, `jalaliMonthSelect`, `jalaliNextMonth`, `jalaliPrevMonth`, `jalaliTodayBtn`)
- `public/crm-jalali.js` → 7 شناسه (مثل: `jalaliCalendarPopup`, `jalaliDaysGrid`, `jalaliMonthSelect`, `jalaliNextMonth`, `jalaliPrevMonth`, `jalaliTodayBtn`, `jalaliYearSelect`)

### tab-snapp-corporate «🚕 اسنپ سازمانی»
- `public/crm-bundle.js` → 29 شناسه (مثل: `btnBuildSnappReport`, `btnBuildSnappTopupReport`, `btnExportSnappTopups`, `btnExportSnappView`, `btnImportSnappTopups`, `btnImportSnappTrips`, `btnOpenSnappCorporate`, `snappDailyStatus`)

### tab-troubleshooting «🛠️ عیب‌یابی»
- `public/crm-app.js` → 1 شناسه (مثل: `diagnosticsStatusBox`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `diagnosticsOpsLog`, `diagnosticsStatusBox`, `diagnosticsVisual`)

### tab-users-permissions «👤 کاربران و دسترسی»
- `public/crm-app.js` → 16 شناسه (مثل: `btnExportUsersCSV`, `btnPermSelectAll`, `btnPermSelectNone`, `btnSaveUserInfo`, `btnToggleShowAllPasswords`, `formCreateUser`, `newFullName`, `newPassword`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnSaveUserInfo`, `formCreateUser`, `newFullName`, `newPassword`, `newPhone`, `newRole`, `newSimControl`, `newUsername`)

## ز) نام‌های تابع تکراری در چند فایل (نقاط حساس بازنویسی)

- `$` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `a` ← `server.js`, `public/crm-bundle.js`
- `add` ← `server.js`, `public/crm-bundle.js`, `public/crm-hub.js`
- `apply` ← `public/crm-app.js`, `public/crm-bundle.js`
- `badgeForInput` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `bindAllDateAndSimple` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `boot` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `bulkCount` ← `server.js`, `public/crm-bundle.js`
- `bulkSig` ← `server.js`, `public/crm-bundle.js`
- `bulkUnion` ← `server.js`, `public/crm-bundle.js`
- `d2g` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `d2j` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `div` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `doc` ← `public/crm-app.js`, `public/crm-bundle.js`
- `f` ← `server.js`, `public/crm-app.js`, `public/crm-bundle.js`
- `fieldKindOf` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `fields` ← `public/crm-app.js`, `public/crm-bundle.js`
- `fillYearMonthSelects` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `formatJalali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `g2d` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `gm` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `go` ← `public/crm-app.js`, `public/crm-bundle.js`
- `gregorianBadge` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `gregorianBadgeFromG` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `hdrs` ← `public/crm-bundle.js`, `public/crm-hub.js`
- `host` ← `public/crm-app.js`, `public/crm-bundle.js`
- `isLeap` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `isToday` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `j2d` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `jalCal` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `jalaliTodayStr` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `kind` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `knownList` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `lv` ← `public/crm-app.js`, `public/crm-bundle.js`
- `main` ← `scripts/build-sw.mjs`, `scripts/clean-extra-files.mjs`, `scripts/generate-assets.mjs`, `scripts/start.mjs`
- `monthLength` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `name` ← `public/crm-app.js`, `public/crm-bundle.js`
- `norm` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`
- `openPickerFor` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `p` ← `public/cloudflare-worker.js`, `public/crm-bundle.js`
- `pad` ← `server.js`, `public/crm-bundle.js`
- `pad2` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `paintBadge` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `parseJalali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `patchRenderCustom` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `ph` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-hub.js`
- `plate` ← `scripts/generate-assets.mjs`, `public/crm-bundle.js`
- `prod` ← `public/crm-app.js`, `public/crm-bundle.js`
- `put` ← `server.js`, `public/crm-bundle.js`
- `rec` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`
- `refresh` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `run` ← `scripts/start.mjs`, `public/crm-bundle.js`
- `setTxt` ← `public/crm-app.js`, `public/crm-bundle.js`
- `settle` ← `server.js`, `public/crm-bundle.js`
- `skipInstant` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `tehranParts` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `tgt` ← `public/crm-app.js`, `public/crm-bundle.js`
- `toEnDigits` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toFaNum` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toGregorian` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toJalaali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `todayJ` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `users` ← `public/crm-app.js`, `public/crm-bundle.js`
- `v` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `val` ← `public/crm-app.js`, `public/crm-bundle.js`
- `weekdayIran` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `wirePopupChrome` ← `public/crm-bundle.js`, `public/crm-jalali.js`

## ح) هشدارهای دائمی معماری

- `public/crm-app.js` دو نسل کد فرم دارد؛ هر تغییر رفتاری فرم باید در هر دو نسل + مسیر فعال v9 جفت شود.
- آخرین لایه (crm-features-v20.js) برنده نهایی بازنویسی‌هاست؛ اسکریپت‌های بعد از آن نباید بیایند مگر با افزودن به انتهای زنجیره.
- اسکلت Next.js در `src/` خفته است؛ ورودی اصلی `server.js` + `public/` است.

## ط) گراف عملیاتی انتشار و اسناد تحویل

- نسخه سورس package: `12.17.1`
- مخزن GitHub: `javadalamdarmehraeen-rgb/javad-test1`؛ شاخه اجباری جلسه Arena فعلی: `arena/01a058c2-javad-test1`؛ push/PR فقط از همین شاخه.
- Production فعال: `https://javad-test1.onrender.com` — نسخه سورس فعلی `12.12.0` است و تا push کاربر روی production همان آخرین دیپلوی قبلی می‌ماند.
- ترتیب خواندن چت بعدی: `PROJECT_GRAPH.md` → `GITHUB_REVIEW_HANDOFF.md` → `AI_ACCEPTANCE_CHECKLIST.md` → `AI_RULES.md` → `AI_PROJECT_CONTEXT.md` → `AI_ARCHITECTURE.md`.
- `GITHUB_REVIEW_HANDOFF.md` مرجع وضعیت commit/push/PR/GitLab/Render/production و دستورات بررسی است؛ قبل از ادعای deploy باید دوباره اندازه‌گیری شود.
- زنجیره انتشار: source test → commit → push Arena branch → PR main → checks → merge → GitLab mirror → Render deploy → production health.
- قانون نوبت ۶۱ (۹۱): در هر چت همه فایل‌های آرشیوی (graph/handoff/chat.arena/اسکریپت‌های مولد/checklist/rules/decision/tasks/context/architecture/handoff-prompt/changes/README/OFFICIAL_FILELIST) به‌روز شوند و ZIP کنار صفحه تحویل شود.
- قانون نوبت ۶۲ (۹۲): هر پرامپت بند‌به‌بند اجرا و راستی‌آزمایی شود؛ قبل از ZIP ورود خودکار به برنامه (سرور واقعی + app-smoke) اجباری است؛ پایان هر چت بلوک دستور git با شماره نسخه تحویل می‌شود.
- قانون نوبت ۱۲۸ (۹۴): برنامه با VPN روشن و خاموش بالا می‌آید؛ هر درخواست بین‌دامنه‌ای پس‌زمینه با تایم‌اوت ۶ ثانیه، بدون انتظار در بوت، با پیام غیرمسدودکننده برای نقشه/ژئوکد.
- قانون نوبت ۱۲۸ (۹۵): سه دامنه فعال (javad-test1.onrender.com + mehraeinpharma.ir + ndcohub.com) با همگام شناسه‌محور در گوشی و ویندوز؛ ndcohub.ir به‌خاطر گواهی نامعتبر خارج است.
- قانون نوبت ۱۲۸ (۹۶): سربرگ کنار لوگو دقیقاً سه خط با شماره نسخه لاتین و قفل MutationObserver.
- قانون نوبت ۸۶ (۹۳): ZIP تحویلی باید PKZIP ویندوز (create_system=0) باشد و از صفحه HTML پورت 8000 با attachment دانلود شود؛ پیش‌نمایش خام ZIP در Arena فرمت معتبر نیست.

## ی) گراف موتور نجات کش 11.38

- `server.js /api/health` → نسخه واقعی server با no-store و `X-CRM-Build`.
- `public/index.html` و `public/login.html` → مقایسه build محلی با health؛ mismatch → `/cache-reset`.
- `server.js /cache-reset` → `Clear-Site-Data: cache` + حذف CacheStorage/SW + redirect یکتا؛ LocalStorage/IndexedDB ممنوع از حذف.
- `public/sw.js` → purge install/activate + network-only HTML/JS/CSS + `CRM_BUILD_ACTIVE` broadcast.
- `public/crm-app.js` → دریافت `CRM_BUILD_ACTIVE` و cache-reset خودکار در mismatch.
