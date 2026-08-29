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

### `server.js` (43547 بایت)
- نقش: سرور سبک Node.js برای Render — ورود جدا، gzip، health، ژئوکد، محدودیت نرخ
- تعداد توابع داخلی: 46
- endpointهای سرور: `/api/backup`, `/api/backup/email`, `/api/backup/status`, `/api/bulk`, `/api/bulk`, `/api/feedback`, `/api/feedback`, `/api/push/public-key`, `/api/push/send`, `/api/push/subscribe`, `/api/runtime-config`, `/api/state`, `/api/state`

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

### `public/crm-app.js` (187876 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 182
- نام‌های window که تعریف/بازنویسی می‌کند: `CRM_APP_VERSION`, `__CRM_GET_STATE`, `__CRM_HAD_SAVED_STATE`, `__CRM_STATE_BOUND`, `__CRM_SW_READY`, `_editingProductId`, `_editingRepHomeId`, `_lastSavedProductId`, `_lastSavedProductName`, `_navHamburgerBound`, `activeDateInputForPicker`, `applyAllFormLayouts`, `applyCustomFieldOrderInForm`, `applyV77ProductPricing`, `attachInstantAdd`, `attachJalaliPicker`, `buildDesignerWidget`, `cleanupOrphanCustomFields`, `crmAddMapTiles`, `getAllMenuSections`, `paintV77ProductPricing`, `rememberPharmacyName`, `renderDoctorsList`, `renderExtraTabCustomFields`, `renderPharmaciesList`, `syncProductsEverywhere`, `v12TahaName`, `validateRequiredFields`

### `public/crm-bundle.js` (1195270 بایت)
- نقش: * crm-bundle.js — فایل واحد برنامه (ادغام عینی لایه‌ها با همان ترتیب اجرای قبلی؛ نسخه از package.json) */
- تعداد توابع داخلی: 1207
- نام‌های window که تعریف/بازنویسی می‌کند: `CRMJalali`, `CRM_HUBS`, `FA_FIELD_LABELS`, `IRAN_FACILITIES`, `WIDGET_PALETTE`, `__CRM_APPLYING_SERVER`, `__CRM_BULK_PURGE`, `__CRM_BULK_READY`, `__CRM_GET_STATE`, `__CRM_HAD_SAVED_STATE`, `__CRM_LATIN_NUMBER_LAW`, `__CRM_LAYOUT_APPLYING`, `__CRM_MANAGER_LAYOUT_INTENT`, `__CRM_MANAGER_LAYOUT_TIMER`, `__CRM_ORIGIN_BOOTSTRAP_CHECKED`, `__CRM_SAFE_BROWSER_GUARDS`, `__CRM_SERVER_READY`, `__CRM_SKIP_V64_STRIP`, `__CRM_SNAP`, `__CRM_UNVEIL`, `__CRM_V78_EDIT_PID`, `__CRM_WD`, `__V40_REFADD`, `__V42CD`, `__V42CSS`, `__V62_ATTACH`, `__V64_OBS`, `__V67_SYNC`, `__V68_WATCH`, `__V69_SYNC`, `__V70_SOLO`, `__V71_CLAIMED`, `__V72_BOOT`, `__V73_BOOT`, `__V73_WATCH`, `__V79_BOOT`, `__V80_BOOT`, `__V80_LOCK`, `__V81_BOOT`, `__V81_LOCK`

### `public/crm-data.js` (57776 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 1
- نام‌های window که تعریف/بازنویسی می‌کند: `DOCTOR_SPECIALTIES`

### `public/crm-features-v10.js` (13643 بایت)
- نقش: v10 — ورود جدا، ویجت داشبورد، تارگت، عیب‌یابی تصویری، افزودن لحظه‌ای، پنهان‌سازی دسترسی
- تعداد توابع داخلی: 22
- نام‌های window که تعریف/بازنویسی می‌کند: `__lastHealth`, `switchTab`

### `public/crm-features-v11.js` (112307 بایت)
- نقش: v11 — تغییر رمز، ردیف واقعی، اکسل خط‌کشی، ویزیت زنده، تارگت، ستون‌ها، دسترسی ریز
- تعداد توابع داخلی: 101
- نام‌های window که تعریف/بازنویسی می‌کند: `FA_FIELD_LABELS`, `_actMap`, `_actMarks`, `_activeColTab`, `_colDelPatched`, `_colEditScroll`, `_editingBoxId`, `_editingColField`, `_layoutBusy`, `_visitKeepAlive`, `addWidgetToActiveTab`, `applyAllFormLayouts`, `applyCustomFieldOrderInForm`, `applyFullFormLayout`, `applySelectExtraOptions`, `builtinFieldValue`, `changeUserPassword`, `cleanupOrphanCustomFields`, `deleteCustomField`, `downloadCSVFile`, `extraListColumns`, `getAllMenuSections`, `getMainGrid`, `getUnifiedFieldList`, `groupIsShared`, `isColShownInList`, `paintFieldBox`, `paintRequiredStar`, `refreshColumnsDesigner`, `renderAllSystemSelects`, `renderColBoxInfoTable`, `renderColBoxList`, `renderColBtnInfoTable`, `renderExtraTabCustomFields`, `renderUserCardsList`, `switchTab`, `validateRequiredFields`, `writeFieldSize`

### `public/crm-features-v12.js` (44613 بایت)
- نقش: v12 — نشستن فیلد روی تب اصلی، ویرایش کادر، کلیدهای اصلی در طراح، تب ساز مدیر
- تعداد توابع داخلی: 37
- نام‌های window که تعریف/بازنویسی می‌کند: `WIDGET_PALETTE`, `_activeColTab`, `_activeManualTab`, `_editingBoxId`, `_palDelegate`, `_v12OrderWrap`, `_v12Sw`, `addWidgetToActiveTab`, `applyCustomFieldOrderInForm`, `applyFullFormLayout`, `buildDesignerWidget`, `createUserTab`, `deleteUserTab`, `editUserTab`, `getAllMenuSections`, `iconFromTabLabel`, `placeFieldOnTab`, `refreshColumnsDesigner`, `refreshManualCanvas`, `renderColBoxList`, `switchTab`, `validateRequiredFields`

### `public/crm-features-v13.js` (32088 بایت)
- نقش: v13 — یک‌بار شدن امکانات آماده + تب طراحی دستی تب‌ها (درگ، اندازه، کپی چیدمان)
- تعداد توابع داخلی: 44
- نام‌های window که تعریف/بازنویسی می‌کند: `_activeManualTab`, `_v13LayoutWrap`, `_v13OrderId`, `_v13RenderWrap`, `_v13Sw`, `addWidgetToActiveTab`, `applyCustomFieldOrderInForm`, `applyFullFormLayout`, `copyPageToTab`, `dedupeTabWidgets`, `getAllMenuSections`, `getUnifiedFieldList`, `lockManualDesigner`, `placeFieldOnTab`, `refreshManualCanvas`, `renderCustomFieldsInForm`, `switchTab`

### `public/crm-features-v14.js` (34125 بایت)
- نقش: v14 — تب افزودن‌ها مثل ستون‌ها، گزینه کشویی با ویرایش/حذف، انتخاب داروخانه هم‌نام، فیلد کالا، ویرایش تب
- تعداد توابع داخلی: 42
- نام‌های window که تعریف/بازنویسی می‌کند: `_activeAddTab`, `_v14SavePatch`, `_v14Sw`, `applyFullFormLayout`, `applySelectExtraOptions`, `editUserTab`, `getAllMenuSections`, `iconFromTabLabel`, `refreshColumnsDesigner`, `setupAllFormSubmitHandlers`, `switchTab`

### `public/crm-features-v15.js` (23014 بایت)
- نقش: v15 — سایز واقعی فیلد، فریز سرستون+اسکرول افقی زیر آن، ذخیره افزودن، حفظ تنظیمات، طراح دستی بدون خراب کردن فرم/لیست
- تعداد توابع داخلی: 29
- نام‌های window که تعریف/بازنویسی می‌کند: `_manSelected`, `_v15Paint`, `_v15Sw`, `applyFullFormLayout`, `fieldKeyForTab`, `renderAddTabGrid`, `renderAddTabPanel`, `switchTab`, `writeFieldSize`

### `public/crm-features-v16.js` (32795 بایت)
- نقش: v16 — کشویی قابل تایپ/جستجو، افزودن شهر بعد از استان، نام داروخانه سراسری، فریز سرستون، قفل طراح دستی
- تعداد توابع داخلی: 48
- نام‌های window که تعریف/بازنویسی می‌کند: `_manPick`, `_manSelected`, `_v16Sw`, `_v16fly`, `_v16geoWrap`, `applyFieldPixelSize`, `attachInstantAdd`, `isKnownPharmacy`, `lockManualDesigner`, `populateCities`, `populateDistricts`, `populateProvinces`, `refreshFrozenTable`, `rememberPharmacyName`, `switchTab`

### `public/crm-features-v17.js` (19662 بایت)
- نقش: v17 — زیرهم، عرض در فرم ویرایش، اسکرول ویرایش، حذف بدون پنهان‌سازی بعدی،
- تعداد توابع داخلی: 31
- نام‌های window که تعریف/بازنویسی می‌کند: `_v17Sw`, `_v17delPh`, `_v17fly`, `attachInstantAdd`, `builtinFieldValue`, `deletePharmacy`, `lockManualDesigner`, `rememberPharmacyName`, `switchTab`

### `public/crm-features-v18.js` (33040 بایت)
- نقش: v18 — ستاره چسبیده، فونت نه عرض، ترتیب فرم/لیست جدا، ارتفاع واقعی،
- تعداد توابع داخلی: 35
- نام‌های window که تعریف/بازنویسی می‌کند: `_editingBoxId`, `_editingColField`, `_v18Confirm`, `_v18DefaultReq`, `_v18Sw`, `_v18Widget`, `applyAllFormLayouts`, `applyFullFormLayout`, `buildDesignerWidget`, `copyPageToTab`, `getUnifiedFieldList`, `lockManualDesigner`, `renderColBoxInfoTable`, `renderColBtnInfoTable`, `switchTab`, `validateRequiredFields`

### `public/crm-features-v19.js` (61295 بایت)
- نقش: v19 (11.15.0) — ستاره فقط تیک مدیر، کشویی‌های کنارهم + افزودن با تایپ،
- تعداد توابع داخلی: 65
- نام‌های window که تعریف/بازنویسی می‌کند: `_v18DefaultReq`, `_v19BackupLayoutGuard`, `_v19ComboHook`, `_v19Hist`, `_v19IcObs`, `_v19ProdTableWrap`, `_v19Sw`, `applyFullFormLayout`, `applySelectExtraOptions`, `extraListColumns`, `performAutoBackup`, `renderAllCustomFieldsInFormsAndTables`, `renderColumnsProductsTable`, `renderPharmaciesList`, `switchTab`, `testServerConnectivity`

### `public/crm-features-v20.js` (304871 بایت)
- نقش: ============================================================
- تعداد توابع داخلی: 346
- نام‌های window که تعریف/بازنویسی می‌کند: `__CRM_BULK_PURGE`, `__CRM_BULK_READY`, `__CRM_HAD_SAVED_STATE`, `__CRM_LATIN_NUMBER_LAW`, `__CRM_MANAGER_LAYOUT_INTENT`, `__CRM_MANAGER_LAYOUT_TIMER`, `__CRM_ORIGIN_BOOTSTRAP_CHECKED`, `__CRM_RESCUING`, `__CRM_SAFE_BROWSER_GUARDS`, `__CRM_WD`, `__V40_REFADD`, `__V42CD`, `__V42CSS`, `__v40LastPick`, `_editingProductId`, `_v20AutoSaveSig`, `_v20AutoSaveT`, `_v20Rendering`, `_v20TopupRows`, `applyFieldPermissions`, `applyFullFormLayout`, `applyUserRolePermissions`, `attachJalaliPicker`, `builtinFieldValue`, `createCustomMarker`, `deleteCustomField`, `deleteProductCatalogItem`, `deleteRepHome`, `deleteUserCard`, `editProductCatalogItem`, `editRepHome`, `editUserCard`, `extraListColumns`, `getUnifiedFieldList`, `open`, `openRowDetailsModal`, `performAutoBackup`, `renderActivityLogTable`, `renderActivityMapAndChart`, `renderAllCustomFieldsInFormsAndTables`

### `public/crm-features-v9.js` (72007 بایت)
- نقش: ===========================================================================
- تعداد توابع داخلی: 104
- نام‌های window که تعریف/بازنویسی می‌کند: `builtinFieldValue`, `downloadCSVFile`, `getOrderItemsFromUI`, `isColShownInList`, `renderDoctorsList`, `renderLiveLocationTab`, `renderOrdersList`, `renderPharmaciesList`, `setupLiveLocationTab`, `setupRepsTab`, `switchTab`, `validateRequiredFields`

### `public/crm-hub.js` (6268 بایت)
- نقش: * v11.99.0: نت‌افراز مستقل و سریع — GET فقط origin؛ همگام پس‌زمینه بدون توقف UI */
- تعداد توابع داخلی: 17
- نام‌های window که تعریف/بازنویسی می‌کند: `__CRM_ORIG_FETCH`, `__CRM_RUNTIME`, `crmHubList`, `fetch`, `v92HubFetch`, `v93HubFetch`, `v94StaticLocal`, `v95OriginOnly`, `v99FastLocal`, `v99Peers`

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

### `public/sw-template.js` (13719 بایت)
- نقش: * ============================================================
- تعداد توابع داخلی: 10

### `public/sw.js` (5417 بایت)
- نقش: const BUILD = "12.01.0";
- تعداد توابع داخلی: 6

### `public/vendor/leaflet.js` (147552 بایت)
- نقش: * @preserve
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `L`

## ج) گراف بازنویسی نام‌های window (چه فایلی روی چه فایلی سوار می‌شود)

- `CRMJalali`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `FA_FIELD_LABELS`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `IRAN_FACILITIES`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/iran-facilities.js`
- `L`: تعریف/بازنویسی به ترتیب لود → `public/leaflet.js` ← `public/vendor/leaflet.js`
- `WIDGET_PALETTE`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `__CRM_BULK_PURGE`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_BULK_READY`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_GET_STATE`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `__CRM_HAD_SAVED_STATE`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_LATIN_NUMBER_LAW`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_MANAGER_LAYOUT_INTENT`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_MANAGER_LAYOUT_TIMER`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_ORIGIN_BOOTSTRAP_CHECKED`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_RUNTIME`: تعریف/بازنویسی به ترتیب لود → `public/crm-runtime.js` ← `public/crm-hub.js`
- `__CRM_SAFE_BROWSER_GUARDS`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__CRM_WD`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__V40_REFADD`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__V42CD`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__V42CSS`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `__lastHealth`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v10.js`
- `__v40LastPick`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_actMap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `_actMarks`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `_activeAddTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v14.js`
- `_activeColTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js`
- `_activeManualTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js`
- `_colDelPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `_colEditScroll`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `_editingBoxId`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v18.js`
- `_editingColField`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v18.js`
- `_editingProductId`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_jalaliBuildPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliLayoutPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliRenderPatched`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_jalaliSw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `_layoutBusy`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `_manPick`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `_manSelected`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js` ← `public/crm-features-v16.js`
- `_palDelegate`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `_v12OrderWrap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `_v12Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `_v13LayoutWrap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js`
- `_v13OrderId`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js`
- `_v13RenderWrap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js`
- `_v13Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js`
- `_v14SavePatch`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v14.js`
- `_v14Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v14.js`
- `_v15Paint`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js`
- `_v15Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js`
- `_v16Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `_v16fly`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `_v16geoWrap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `_v17Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v17.js`
- `_v17delPh`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v17.js`
- `_v17fly`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v17.js`
- `_v18Confirm`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v18.js`
- `_v18DefaultReq`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v18.js` ← `public/crm-features-v19.js`
- `_v18Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v18.js`
- `_v18Widget`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v18.js`
- `_v19BackupLayoutGuard`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v19ComboHook`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v19Hist`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v19IcObs`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v19ProdTableWrap`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v19Sw`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `_v20AutoSaveSig`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_v20AutoSaveT`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_v20Rendering`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_v20TopupRows`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `_visitKeepAlive`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `activeDateInputForPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-jalali.js`
- `addWidgetToActiveTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js`
- `applyAllFormLayouts`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v18.js`
- `applyCustomFieldOrderInForm`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js`
- `applyFieldPermissions`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `applyFieldPixelSize`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `applyFullFormLayout`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js` ← `public/crm-features-v14.js` ← `public/crm-features-v15.js` ← `public/crm-features-v18.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js` ← `public/crm-jalali.js`
- `applySelectExtraOptions`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v14.js` ← `public/crm-features-v19.js`
- `applyUserRolePermissions`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `applyV77ProductPricing`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `attachInstantAdd`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v16.js` ← `public/crm-features-v17.js` ← `public/crm-jalali.js`
- `attachJalaliPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v20.js` ← `public/crm-jalali.js`
- `buildDesignerWidget`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v18.js` ← `public/crm-jalali.js`
- `builtinFieldValue`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v17.js` ← `public/crm-features-v20.js` ← `public/crm-features-v9.js`
- `changeUserPassword`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `cleanupOrphanCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `copyPageToTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js` ← `public/crm-features-v18.js`
- `createCustomMarker`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `createUserTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `dedupeTabWidgets`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js`
- `deleteCustomField`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v20.js`
- `deletePharmacy`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v17.js`
- `deleteProductCatalogItem`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `deleteRepHome`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `deleteUserCard`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `deleteUserTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js`
- `downloadCSVFile`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v9.js`
- `editProductCatalogItem`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `editRepHome`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `editUserCard`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `editUserTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v14.js`
- `extraListColumns`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js`
- `fetch`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `fieldKeyForTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js`
- `getAllMenuSections`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js` ← `public/crm-features-v14.js`
- `getMainGrid`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `getOrderItemsFromUI`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v9.js`
- `getUnifiedFieldList`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v13.js` ← `public/crm-features-v18.js` ← `public/crm-features-v20.js`
- `groupIsShared`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `iconFromTabLabel`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v14.js`
- `isColShownInList`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v9.js`
- `isKnownPharmacy`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `lockManualDesigner`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js` ← `public/crm-features-v16.js` ← `public/crm-features-v17.js` ← `public/crm-features-v18.js`
- `open`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `openRowDetailsModal`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `paintFieldBox`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `paintRequiredStar`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `paintV77ProductPricing`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `performAutoBackup`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js`
- `placeFieldOnTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js`
- `populateCities`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `populateDistricts`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `populateProvinces`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `refreshAllDateBadges`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `refreshColumnsDesigner`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v14.js`
- `refreshFrozenTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v16.js`
- `refreshManualCanvas`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js`
- `rememberPharmacyName`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v16.js` ← `public/crm-features-v17.js`
- `renderActivityLogTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderActivityMapAndChart`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderAddTabGrid`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js`
- `renderAddTabPanel`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v15.js`
- `renderAllCustomFieldsInFormsAndTables`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js`
- `renderAllSystemSelects`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js`
- `renderColBoxInfoTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v18.js`
- `renderColBoxList`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js`
- `renderColBtnInfoTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v18.js`
- `renderColumnsProductsTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js`
- `renderCustomFieldsInForm`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v13.js` ← `public/crm-jalali.js`
- `renderDoctorsList`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v9.js`
- `renderExtraTabCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v20.js`
- `renderJalaliCalendarDays`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `renderLeavesTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderLiveLocationTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js` ← `public/crm-features-v9.js`
- `renderMonthlyReportsTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderNotificationsTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderOrdersList`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v9.js`
- `renderPharmaciesList`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v19.js` ← `public/crm-features-v9.js`
- `renderRepHomesTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderRepRoutesTable`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `renderUserCardsList`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v20.js`
- `reverseGeocodeCoordinates`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `saveState`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `setupAllFormSubmitHandlers`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v14.js`
- `setupInstantAddAll`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `setupJalaliCalendarPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `setupJalaliDateAutoSlash`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-jalali.js`
- `setupLiveLocationTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v9.js`
- `setupRepsTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v9.js`
- `switchTab`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v10.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v13.js` ← `public/crm-features-v14.js` ← `public/crm-features-v15.js` ← `public/crm-features-v16.js` ← `public/crm-features-v17.js` ← `public/crm-features-v18.js` ← `public/crm-features-v19.js` ← `public/crm-features-v20.js` ← `public/crm-features-v9.js` ← `public/crm-jalali.js`
- `syncProductsEverywhere`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `testServerConnectivity`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v19.js`
- `updateNavBadges`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `updateOrderTotalAmountDisplay`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v12TahaName`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `v20ApplyGreyChains`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v20ApplyOrderLock`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v20DupGate`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v20RenderComboManager`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v20RenderProductExtras`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v20SetupSnappCorporate`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v20.js`
- `v95OriginOnly`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `v99Peers`: تعریف/بازنویسی به ترتیب لود → `public/crm-hub.js` ← `public/crm-bundle.js`
- `validateRequiredFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v12.js` ← `public/crm-features-v18.js` ← `public/crm-features-v9.js`
- `writeFieldSize`: تعریف/بازنویسی به ترتیب لود → `public/crm-bundle.js` ← `public/crm-features-v11.js` ← `public/crm-features-v15.js`

## د) گراف API (سرویس api ↔ مصرف‌کننده‌ها)

- `/api/backup` [GET] — مصرف‌کننده: —
- `/api/backup/email` [POST] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/backup/status` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/bulk` [GET] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/feedback` [GET] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/geocode?q=` [؟] — مصرف‌کننده: `public/crm-app.js`
- `/api/health` [؟] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v19.js`
- `/api/health?__diag=` [؟] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/health?__wd=` [؟] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/push/public-key` [GET] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/push/send` [POST] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/push/subscribe` [POST] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/reverse?lat=` [؟] — مصرف‌کننده: `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v20.js`
- `/api/runtime-config` [GET] — مصرف‌کننده: —
- `/api/state` [GET] — مصرف‌کننده: `public/crm-bundle.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`
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
- `CRM_APP_STATE_OLDFILE_ARCHIVE_` ← localStorage: `public/crm-app.js`
- `CRM_APP_STATE_V2` ← localStorage: `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`
- `CRM_ASSET_BUILD` ← localStorage: `server.js`
- `CRM_CACHE_RESCUED_` ← sessionStorage: `server.js`
- `CRM_DIAG_LOG` ← localStorage: `public/crm-bundle.js`, `public/crm-features-v11.js`
- `CRM_LAST_GPS` ← localStorage: `public/crm-bundle.js`, `public/crm-features-v11.js`
- `CRM_LOGIN_EXP` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_LOGIN_OK` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_MANAGER_GRID_ORDER_V2` ← localStorage: `public/crm-bundle.js`
- `CRM_RESET_LOCK` ← sessionStorage: `server.js`
- `CRM_SOLO_CLAIM` ← localStorage: `public/crm-bundle.js`
- `CRM_SOLO_EPOCH` ← localStorage: `public/crm-bundle.js`
- `CRM_USERS_AUTH` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v20.js`
- `CRM_V39_ORDER_CANONICAL_RESET` ← localStorage: `public/crm-bundle.js`, `public/crm-features-v20.js`
- `CRM_V97_RELOADED` ← sessionStorage: `public/crm-bundle.js`
- `crmLoggedIn` ← sessionStorage: `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`
- `crmOriginBootstrapDone` ← sessionStorage: `public/crm-features-v20.js`
- `crmUserId` ← sessionStorage: `public/crm-bundle.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`
- `crmUserName` ← sessionStorage: `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v11.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`
- `crmUserRole` ← sessionStorage: `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v11.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`
- `crmUsername` ← sessionStorage: `public/crm-bundle.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`
- `distPass_` ← sessionStorage: `public/crm-bundle.js`, `public/crm-features-v20.js`

## و) گراف تب‌ها (تب ↔ فایل‌هایی که با المان‌هایش کار می‌کنند)

### tab-activity-log «⏱️ فعالیت لحظه‌ای»
- `public/crm-app.js` → 2 شناسه (مثل: `btnRefreshActivity`, `tableActivityLogBody`)
- `public/crm-bundle.js` → 7 شناسه (مثل: `activityChartBox`, `btnRefreshActivity`, `map-activity-log`, `tableActivityLogBody`, `v76HeatAll`, `v76HeatRep`, `v76HeatStatus`)
- `public/crm-features-v11.js` → 2 شناسه (مثل: `activityChartBox`, `map-activity-log`)
- `public/crm-features-v20.js` → 1 شناسه (مثل: `tableActivityLogBody`)
- `public/crm-features-v9.js` → 1 شناسه (مثل: `activityChartBox`)

### tab-backup «💾 پشتیبان‌گیری»
- `public/crm-app.js` → 14 شناسه (مثل: `autoBackupHandleStatus`, `btnCancelRestore`, `btnConfirmRestore`, `btnManualBackupNow`, `btnSelectAutoBackupFolder`, `chkAutoBackupEnabled`, `dropzoneRestore`, `fileInputRestore`)
- `public/crm-bundle.js` → 4 شناسه (مثل: `autoBackupHandleStatus`, `backupEmailInput`, `backupIntervalSelect`, `v87BackupStatus`)
- `public/crm-features-v19.js` → 1 شناسه (مثل: `autoBackupHandleStatus`)
- `public/crm-features-v20.js` → 1 شناسه (مثل: `autoBackupHandleStatus`)
- `public/crm-features-v9.js` → 2 شناسه (مثل: `backupEmailInput`, `backupIntervalSelect`)

### tab-changelog «»
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnDownloadUnappliedReport`, `btnRunDiagnosis`, `btnSendUnappliedReport`, `v41ChangeHost`, `v41DiagHost`, `v41ReportStatus`)
- `public/crm-features-v20.js` → 6 شناسه (مثل: `btnDownloadUnappliedReport`, `btnRunDiagnosis`, `btnSendUnappliedReport`, `v41ChangeHost`, `v41DiagHost`, `v41ReportStatus`)

### tab-columns-products «🧱 ستون‌ها و کالاها»
- `public/crm-app.js` → 10 شناسه (مثل: `btnSaveProduct`, `formProduct`, `productCode`, `productConsumerPrice`, `productDistPrice`, `productName`, `productPrice`, `productSavedBanner`)
- `public/crm-bundle.js` → 11 شناسه (مثل: `btnSaveProduct`, `columnsDesignerHost`, `formProduct`, `productCode`, `productConsumerPrice`, `productDistPrice`, `productName`, `productPrice`)
- `public/crm-features-v11.js` → 1 شناسه (مثل: `columnsDesignerHost`)
- `public/crm-features-v12.js` → 1 شناسه (مثل: `columnsDesignerHost`)
- `public/crm-features-v14.js` → 2 شناسه (مثل: `btnSaveProduct`, `formProduct`)
- `public/crm-features-v16.js` → 1 شناسه (مثل: `columnsDesignerHost`)
- `public/crm-features-v18.js` → 1 شناسه (مثل: `columnsDesignerHost`)
- `public/crm-features-v19.js` → 3 شناسه (مثل: `columnsDesignerHost`, `formProduct`, `tableProductsBody`)
- `public/crm-features-v20.js` → 9 شناسه (مثل: `btnSaveProduct`, `formProduct`, `productCode`, `productDistPrice`, `productName`, `productPrice`, `productSavedBanner`, `productStock`)

### tab-custom-fields «➕ افزودن‌ها»
- `public/crm-app.js` → 9 شناسه (مثل: `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfOptionsWrapper`, `cfShowInForm`, `cfShowInList`, `cfTargetEntity`, `cfType`)
- `public/crm-bundle.js` → 12 شناسه (مثل: `addTabGrid`, `addTabPanel`, `btnSaveCustomField`, `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfSaveStatus`, `cfShowInForm`)
- `public/crm-features-v14.js` → 12 شناسه (مثل: `addTabGrid`, `addTabPanel`, `btnSaveCustomField`, `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfSaveStatus`, `cfShowInForm`)
- `public/crm-features-v15.js` → 10 شناسه (مثل: `btnSaveCustomField`, `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfSaveStatus`, `cfShowInForm`, `cfShowInList`, `cfTargetEntity`)
- `public/crm-features-v16.js` → 1 شناسه (مثل: `addTabPanel`)
- `public/crm-features-v20.js` → 2 شناسه (مثل: `addTabPanel`, `cfTargetEntity`)

### tab-dashboard «📊 داشبورد»
- `public/crm-app.js` → 2 شناسه (مثل: `dashboardLaunchpadGrid`, `map-dashboard-overview`)
- `public/crm-bundle.js` → 11 شناسه (مثل: `btnAddDashWidget`, `dashboardChartsWidget`, `dashboardWidgetPicker`, `dashboardWidgetsHost`, `v84DashCharts`, `v84DashCity`, `v84DashDistrict`, `v84DashKpi`)
- `public/crm-features-v10.js` → 4 شناسه (مثل: `btnAddDashWidget`, `dashboardChartsWidget`, `dashboardWidgetPicker`, `dashboardWidgetsHost`)
- `public/crm-features-v9.js` → 1 شناسه (مثل: `dashboardChartsWidget`)

### tab-define-routes «🗺️ تعریف مسیر نمایندگان»
- `public/crm-bundle.js` → 7 شناسه (مثل: `btnSaveRepresentativeRoute`, `repRoutesOverview`, `representativeRoutesCard`, `routeManagerCity`, `routeManagerDistrict`, `routeManagerProvince`, `routeManagerRep`)
- `public/crm-features-v20.js` → 6 شناسه (مثل: `btnSaveRepresentativeRoute`, `representativeRoutesCard`, `routeManagerCity`, `routeManagerDistrict`, `routeManagerProvince`, `routeManagerRep`)

### tab-dist-targets «🎯 تارگت فروش هرپخش»
- `public/crm-bundle.js` → 3 شناسه (مثل: `v66DistTargetPlanner`, `v72DistBoxes`, `v72DistGrandBox`)

### tab-distributor-companies «🏢 اطلاعات شرکت‌ها»
- `public/crm-bundle.js` → 1 شناسه (مثل: `distributorCompanyGrid`)
- `public/crm-features-v20.js` → 1 شناسه (مثل: `distributorCompanyGrid`)

### tab-distributor-database «🗄️ دیتابیس پخش‌ها»
- `public/crm-bundle.js` → 2 شناسه (مثل: `distributorDatabaseGrid`, `distributorRawViewer`)
- `public/crm-features-v20.js` → 2 شناسه (مثل: `distributorDatabaseGrid`, `distributorRawViewer`)

### tab-distributor-invoice-status «🧾 وضعیت فاکتور پخش‌ها»
- `public/crm-bundle.js` → 12 شناسه (مثل: `invoiceStatusBody`, `invoiceStatusFrom`, `invoiceStatusModeFrom`, `invoiceStatusModeMonth`, `invoiceStatusModeTo`, `invoiceStatusModeYear`, `invoiceStatusMonth`, `invoiceStatusRep`)
- `public/crm-features-v20.js` → 12 شناسه (مثل: `invoiceStatusBody`, `invoiceStatusFrom`, `invoiceStatusModeFrom`, `invoiceStatusModeMonth`, `invoiceStatusModeTo`, `invoiceStatusModeYear`, `invoiceStatusMonth`, `invoiceStatusRep`)

### tab-distributor-sales «📦 اطلاعات فروش پخش‌ها»
- `public/crm-bundle.js` → 16 شناسه (مثل: `btnBuildDistributorReport`, `btnExportDistributorReport`, `distFilterDay`, `distFilterFrom`, `distFilterMonth`, `distFilterTo`, `distFilterYear`, `distModeDay`)
- `public/crm-features-v20.js` → 16 شناسه (مثل: `btnBuildDistributorReport`, `btnExportDistributorReport`, `distFilterDay`, `distFilterFrom`, `distFilterMonth`, `distFilterTo`, `distFilterYear`, `distModeDay`)

### tab-doctors «👨‍⚕️ پزشکان»
- `public/crm-app.js` → 29 شناسه (مثل: `btnDocMapSearch`, `btnDocPercentageNo`, `btnDocPercentageYes`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnExportDoctorsCSV`, `btnSaveDoctor`, `docFileDisplay`)
- `public/crm-bundle.js` → 16 شناسه (مثل: `btnDocMapSearch`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnSaveDoctor`, `cardDocList`, `docFileInput`, `doctorCity`, `doctorDistrict`)
- `public/crm-features-v14.js` → 4 شناسه (مثل: `btnSaveDoctor`, `doctorEditId`, `doctorName`, `formDoctor`)
- `public/crm-features-v9.js` → 9 شناسه (مثل: `btnDocMapSearch`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `cardDocList`, `docFileInput`, `formDoctor`, `searchDoctorInput`, `tableDoctorsBody`)

### tab-install-app «📲 نصب اپ»
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnInstallAndroid`, `btnInstallIos`, `btnInstallWindows`)
- `public/crm-features-v9.js` → 3 شناسه (مثل: `btnInstallAndroid`, `btnInstallIos`, `btnInstallWindows`)

### tab-leaves «📝 مرخصی‌ها»
- `public/crm-app.js` → 12 شناسه (مثل: `btnExportLeavesCSV`, `formLeaveRequest`, `leaveFromDate`, `leaveFromTime`, `leaveHoursGroup`, `leaveHoursInput`, `leaveReasonInput`, `leaveRepSelect`)
- `public/crm-bundle.js` → 1 شناسه (مثل: `formLeaveRequest`)

### tab-live-location «📍 موقعیت زنده»
- `public/crm-app.js` → 1 شناسه (مثل: `map-live-reps`)
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnFindLiveRep`, `btnRefreshLiveMap`, `btnSimulateLiveMovement`, `liveRepSearchSelect`, `tableLiveReps`, `tableLiveRepsBody`)
- `public/crm-features-v20.js` → 4 شناسه (مثل: `btnFindLiveRep`, `liveRepSearchSelect`, `tableLiveReps`, `tableLiveRepsBody`)
- `public/crm-features-v9.js` → 5 شناسه (مثل: `btnFindLiveRep`, `btnRefreshLiveMap`, `btnSimulateLiveMovement`, `liveRepSearchSelect`, `tableLiveRepsBody`)

### tab-manual-design «🎨 طراحی دستی تب‌ها»
- `public/crm-bundle.js` → 15 شناسه (مثل: `btnManCopy`, `btnManOpenTab`, `btnManReset`, `btnManSave`, `manAddStatus`, `manBoxMaker`, `manCopyFrom`, `manCopyModeAll`)
- `public/crm-features-v12.js` → 1 شناسه (مثل: `manAddStatus`)
- `public/crm-features-v13.js` → 12 شناسه (مثل: `btnManCopy`, `btnManOpenTab`, `btnManReset`, `btnManSave`, `manAddStatus`, `manBoxMaker`, `manCopyFrom`, `manCopyTo`)
- `public/crm-features-v14.js` → 2 شناسه (مثل: `manCopyFrom`, `manCopyTo`)
- `public/crm-features-v15.js` → 1 شناسه (مثل: `manualDesignCanvas`)
- `public/crm-features-v16.js` → 1 شناسه (مثل: `manualDesignCanvas`)
- `public/crm-features-v17.js` → 1 شناسه (مثل: `manualDesignCanvas`)
- `public/crm-features-v18.js` → 6 شناسه (مثل: `manCopyFrom`, `manCopyModeAll`, `manCopyModePart`, `manCopyPickList`, `manCopyTo`, `manualDesignCanvas`)

### tab-messengers «💬 پیام‌رسان‌ها»
- `public/crm-bundle.js` → 1 شناسه (مثل: `messengerTogglesBox`)
- `public/crm-features-v20.js` → 1 شناسه (مثل: `messengerTogglesBox`)
- `public/crm-features-v9.js` → 1 شناسه (مثل: `messengerTogglesBox`)

### tab-monthly-reports «📈 گزارش ماهانه»
- `public/crm-app.js` → 2 شناسه (مثل: `btnExportMonthlyCSV`, `tableMonthlyReportsBody`)

### tab-my-visit «▶️ شروع/پایان ویزیت»
- `public/crm-bundle.js` → 5 شناسه (مثل: `btnEndVisit`, `btnStartVisit`, `map-my-visit`, `visitEndTimeBox`, `visitStatusBox`)
- `public/crm-features-v11.js` → 4 شناسه (مثل: `btnEndVisit`, `btnStartVisit`, `map-my-visit`, `visitStatusBox`)
- `public/crm-features-v20.js` → 3 شناسه (مثل: `btnEndVisit`, `btnStartVisit`, `visitStatusBox`)

### tab-notifications «🔔 اعلان‌ها»
- `public/crm-app.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)
- `public/crm-bundle.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)
- `public/crm-features-v20.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)

### tab-orders «📦 سفارشات»
- `public/crm-app.js` → 42 شناسه (مثل: `btnAddOrderItemRow`, `btnExportOrdersCSV`, `btnOrdPercentageNo`, `btnOrdPercentageYes`, `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `existingPharmacyAlertText`)
- `public/crm-bundle.js` → 26 شناسه (مثل: `btnOrdPercentageNo`, `btnOrdPercentageYes`, `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `cardOrdList`, `existingPharmacyAlertText`, `existingPharmacyTopAlert`)
- `public/crm-features-v11.js` → 1 شناسه (مثل: `orderItemsContainer`)
- `public/crm-features-v14.js` → 12 شناسه (مثل: `btnSaveOrder`, `existingPharmacyAlertText`, `existingPharmacyTopAlert`, `formOrder`, `orderAddress`, `orderCity`, `orderDistrict`, `orderEditId`)
- `public/crm-features-v15.js` → 3 شناسه (مثل: `orderPharmacyName`, `orderPharmacyPickBox`, `orderTotalAmountDisplay`)
- `public/crm-features-v17.js` → 9 شناسه (مثل: `existingPharmacyAlertText`, `existingPharmacyTopAlert`, `orderAddress`, `orderCity`, `orderDistrict`, `orderPharmacyMatchedId`, `orderPharmacyName`, `orderPharmacyPickBox`)
- `public/crm-features-v19.js` → 2 شناسه (مثل: `orderEditId`, `orderItemsContainer`)
- `public/crm-features-v20.js` → 13 شناسه (مثل: `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `existingPharmacyTopAlert`, `formOrder`, `orderCity`, `orderDistrict`, `orderEditId`)
- `public/crm-features-v9.js` → 7 شناسه (مثل: `cardOrdList`, `formOrder`, `ordListCountBadge`, `orderItemsContainer`, `searchOrderInput`, `tableOrdersBody`, `tableOrdersHeader`)

### tab-overview-map «🗺️ نقشه جامع»
- `public/crm-app.js` → 4 شناسه (مثل: `btnFocusMapRegion`, `map-full-overview`, `mapFilterCity`, `mapFilterProvince`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnExportOverviewMapCSV`, `btnFocusMapRegion`, `cntOverviewDoctors`, `cntOverviewHospitals`, `cntOverviewPharmacies`, `mapFilterCity`, `mapFilterDistrict`, `mapFilterProvince`)
- `public/crm-features-v11.js` → 5 شناسه (مثل: `btnFocusMapRegion`, `mapFilterCity`, `mapFilterDistrict`, `mapFilterProvince`, `overviewResultsTableWrap`)
- `public/crm-features-v9.js` → 8 شناسه (مثل: `btnExportOverviewMapCSV`, `btnFocusMapRegion`, `cntOverviewDoctors`, `cntOverviewHospitals`, `cntOverviewPharmacies`, `mapFilterCity`, `mapFilterDistrict`, `mapFilterProvince`)

### tab-pharmacies «🏥 داروخانه‌ها»
- `public/crm-app.js` → 32 شناسه (مثل: `btnExportPharmaciesCSV`, `btnPhMapSearch`, `btnPhPercentageNo`, `btnPhPercentageYes`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `formPharmacy`)
- `public/crm-bundle.js` → 22 شناسه (مثل: `btnPhMapSearch`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `cardPhList`, `formPharmacy`, `phFileInput`, `phListCountBadge`)
- `public/crm-features-v11.js` → 1 شناسه (مثل: `phMapSearchInput`)
- `public/crm-features-v14.js` → 4 شناسه (مثل: `btnSavePharmacy`, `formPharmacy`, `pharmacyEditId`, `pharmacyName`)
- `public/crm-features-v16.js` → 8 شناسه (مثل: `formPharmacy`, `pharmacyAddress`, `pharmacyCity`, `pharmacyDistrict`, `pharmacyEditId`, `pharmacyName`, `pharmacyPhone`, `pharmacyProvince`)
- `public/crm-features-v17.js` → 8 شناسه (مثل: `btnSavePharmacy`, `formPharmacy`, `pharmacyAddress`, `pharmacyCity`, `pharmacyDistrict`, `pharmacyName`, `pharmacyPhone`, `pharmacyProvince`)
- `public/crm-features-v20.js` → 8 شناسه (مثل: `pharmacyCity`, `pharmacyDistrict`, `pharmacyEditId`, `pharmacyManager`, `pharmacyManagerPhone`, `pharmacyName`, `pharmacyPhone`, `pharmacyProvince`)
- `public/crm-features-v9.js` → 11 شناسه (مثل: `btnPhMapSearch`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `cardPhList`, `formPharmacy`, `phFileInput`, `phListCountBadge`, `phTableCountBadge`)

### tab-product-pricing «💵 قیمت‌گذاری کالاها»
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnSaveProductPricing`, `v77CurrentPricesBody`, `v77NewPricesBody`)

### tab-rep-homes «🏠 منزل نمایندگان»
- `public/crm-app.js` → 3 شناسه (مثل: `repHomeAddressInput`, `repHomeSelect`, `tableRepHomesBody`)
- `public/crm-bundle.js` → 5 شناسه (مثل: `btnRepHomeCurrentLocation`, `repHomeFloor`, `repHomePlate`, `repHomeSelect`, `tableRepHomesBody`)
- `public/crm-features-v20.js` → 1 شناسه (مثل: `tableRepHomesBody`)
- `public/crm-features-v9.js` → 2 شناسه (مثل: `btnRepHomeCurrentLocation`, `repHomeSelect`)

### tab-rep-routes «🛣️ رصد تردد»
- `public/crm-app.js` → 1 شناسه (مثل: `tableRepRoutesBody`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnRefreshRepRoutesMap`, `routeRepFilterSelect`, `tableRepRoutesBody`)
- `public/crm-features-v20.js` → 3 شناسه (مثل: `btnRefreshRepRoutesMap`, `routeRepFilterSelect`, `tableRepRoutesBody`)
- `public/crm-features-v9.js` → 3 شناسه (مثل: `btnRefreshRepRoutesMap`, `routeRepFilterSelect`, `tableRepRoutesBody`)

### tab-sales-targets «🎯 تارگت فروش نمایندگان»
- `public/crm-app.js` → 9 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtMonthSelect`, `tgtProductSelect`, `tgtRepSelect`)
- `public/crm-bundle.js` → 8 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtProductSelect`, `tgtSummaryBox`, `tgtYearInput`)
- `public/crm-features-v10.js` → 6 شناسه (مثل: `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtProductSelect`, `tgtSummaryBox`, `tgtYearInput`)
- `public/crm-features-v20.js` → 3 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtSummaryBox`)

### tab-search-info «🔍 جستجوی اطلاعات»
- `public/crm-app.js` → 38 شناسه (مثل: `btnExportSearchInfoCSV`, `btnNavBalad`, `btnNavGoogle`, `btnNavNeshan`, `btnNavWaze`, `btnRowCopyText`, `btnRowDelete`, `btnRowEdit`)
- `public/crm-bundle.js` → 10 شناسه (مثل: `btnRowCopyText`, `formLoginModal`, `jalaliCalendarPopup`, `jalaliDaysGrid`, `jalaliMonthSelect`, `jalaliNextMonth`, `jalaliPrevMonth`, `jalaliTodayBtn`)
- `public/crm-features-v20.js` → 2 شناسه (مثل: `btnRowCopyText`, `rowDetailsContentBox`)
- `public/crm-features-v9.js` → 3 شناسه (مثل: `formLoginModal`, `jalaliCalendarPopup`, `jalaliTodayBtn`)
- `public/crm-jalali.js` → 7 شناسه (مثل: `jalaliCalendarPopup`, `jalaliDaysGrid`, `jalaliMonthSelect`, `jalaliNextMonth`, `jalaliPrevMonth`, `jalaliTodayBtn`, `jalaliYearSelect`)

### tab-snapp-corporate «🚕 اسنپ سازمانی»
- `public/crm-bundle.js` → 29 شناسه (مثل: `btnBuildSnappReport`, `btnBuildSnappTopupReport`, `btnExportSnappTopups`, `btnExportSnappView`, `btnImportSnappTopups`, `btnImportSnappTrips`, `btnOpenSnappCorporate`, `snappDailyStatus`)
- `public/crm-features-v20.js` → 29 شناسه (مثل: `btnBuildSnappReport`, `btnBuildSnappTopupReport`, `btnExportSnappTopups`, `btnExportSnappView`, `btnImportSnappTopups`, `btnImportSnappTrips`, `btnOpenSnappCorporate`, `snappDailyStatus`)

### tab-troubleshooting «🛠️ عیب‌یابی»
- `public/crm-app.js` → 1 شناسه (مثل: `diagnosticsStatusBox`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `diagnosticsOpsLog`, `diagnosticsStatusBox`, `diagnosticsVisual`)
- `public/crm-features-v10.js` → 2 شناسه (مثل: `diagnosticsStatusBox`, `diagnosticsVisual`)
- `public/crm-features-v11.js` → 1 شناسه (مثل: `diagnosticsOpsLog`)
- `public/crm-features-v19.js` → 2 شناسه (مثل: `diagnosticsStatusBox`, `diagnosticsVisual`)

### tab-users-permissions «👤 کاربران و دسترسی»
- `public/crm-app.js` → 16 شناسه (مثل: `btnExportUsersCSV`, `btnPermSelectAll`, `btnPermSelectNone`, `btnSaveUserInfo`, `btnToggleShowAllPasswords`, `formCreateUser`, `newFullName`, `newPassword`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnSaveUserInfo`, `formCreateUser`, `newFullName`, `newPassword`, `newPhone`, `newRole`, `newSimControl`, `newUsername`)
- `public/crm-features-v20.js` → 9 شناسه (مثل: `btnSaveUserInfo`, `formCreateUser`, `newFullName`, `newPassword`, `newPhone`, `newRole`, `newSimControl`, `newUsername`)

## ز) نام‌های تابع تکراری در چند فایل (نقاط حساس بازنویسی)

- `$` ← `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v13.js`, `public/crm-features-v14.js`, `public/crm-features-v15.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`, `public/crm-jalali.js`
- `GPS_SVG` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `abs` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `add` ← `server.js`, `public/crm-bundle.js`, `public/crm-features-v20.js`, `public/crm-hub.js`
- `addClearButtons` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `addExtraCity` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `addExtraDistrict` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `addOptionToField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `addTypedOptionToSelect` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `addWidgetToActiveTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `after` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `afterPick` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `afterSaveStayOnList` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `alignDistributorHeaders` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `allSections` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `appendExcelCols` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `apply` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v12.js`
- `applyBulkState` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyCentralPermissions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyDeps` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `applyDoctorLocation` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `applyFaLabelsLive` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `applyFieldPermissions` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `applyFont` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `applyFullFormLayout` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `applyGeoExtrasToData` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `applyGlobalFieldOptions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyGlobalOptionKey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyInspector` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `applyManualLayout` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `applyOrderItemLayout` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `applyOrderItemRoleControls` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyOverviewFilters` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `applyPermissionsToChecklist` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyPharmacyLocation` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `applyProductSettings` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyRoleDataFilter` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `applySavedToClone` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `applySessionUser` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `applySize` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `applySizeToInput` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `applySnappVisibility` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `applyTo` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `applyUserBoxes` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `arr` ← `public/crm-bundle.js`, `public/crm-features-v18.js`, `public/crm-features-v20.js`
- `attach` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v9.js`
- `attachHistoryDatalist` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `attemptLogin` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `backupUserStateOnce` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `badgeForInput` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `barHtml` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `base` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `belongs` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bind` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `bindAddFieldHard` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `bindAddressFieldGuard` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindAllDateAndSimple` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `bindAutocomplete` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `bindCentralPermissions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindChpassFab` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindComboCaretFixV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindDesignerClicks` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `bindDistributorFilters` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindDomOrderLock` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindDrag` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `bindDurableServerState` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindEmailBackup` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindFieldDependencies` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `bindFixedGridObserver` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindFlag` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `bindInstantAddSave` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindInstantSearch` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `bindInstantUiRefresh` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindListOrderObserver` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindLive` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindLiveAll` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindManager` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindManagerLayoutIntent` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindMirror` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindNumberFormatting` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOneSubmit` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `bindOrderFormPositionLock` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOrderItemRuntime` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOrderLocalMatch` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOrderPharmacyCardV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOrderResetProof` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindOriginSaveGate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindPair` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `bindPharmacyInstantButtons` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `bindPlacedPharmacyNoticeGuard` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindPrivacyRenderers` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindProductCrudV20` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindProductLabelFix` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindProductPersistence` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindResize` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `bindRoleTemplateSelect` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindSafeOrderControls` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindSnappImportButtons` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindSnappModes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindTargetsV20` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindToolbar` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `bindUserCrudV27` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bindV20Visit` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bkHasTarget` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `bkStatus` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `bkWriteJson` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `boot` ← `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v13.js`, `public/crm-features-v14.js`, `public/crm-features-v15.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`, `public/crm-features-v9.js`, `public/crm-jalali.js`
- `bootstrapEmptyOriginFromServer` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `box` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `buildInvoiceStatusGroups` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `buildInvoiceStatusMatches` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `buildLockedShare` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkCount` ← `server.js`, `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkDb` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkGet` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkPut` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkSig` ← `server.js`, `public/crm-bundle.js`, `public/crm-features-v20.js`
- `bulkUnion` ← `server.js`, `public/crm-bundle.js`, `public/crm-features-v20.js`
- `c` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v16.js`
- `calculateDayaAmounts` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `canSeeAll` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `canonicalProduct` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `captureBulkState` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `captureDomFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `captureOrderFormSequence` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `captureOrderLayoutSettings` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `cfCellHtml` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `cfHeaderHtml` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `checklistPermissions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `cid` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `cityNames` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `classifyBtn` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `cleanBtnText` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `cleanItemsForShare` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `cleanOrderItemsV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `clearOrderPharmacyDraft` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `collectCombos` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `collectCustom` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `collectDesignTargets` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `collectOrderItems` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `collectUnappliedV41` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `collectUserTabValues` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `comboAllowsAdd` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `connectBackupTarget` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `containerIdForKey` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `copyPageToTab` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `copySelected` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `cr` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `createFieldOnTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `cssEscape` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `cur` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `currentRepId` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `currentRepName` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `currentSessionUserV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `custom` ← `public/crm-bundle.js`, `public/crm-features-v15.js`, `public/crm-features-v20.js`
- `customListFields` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `customs` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v19.js`
- `d` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `d2g` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `d2j` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `datePass` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `days` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `debounce` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `dedupePharmacies` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `defaultPresetPermissions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `deleteAnyField` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `deleteCustomSelectField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `deleteOptionOfField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `deleteUserTabRecord` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `designIdOf` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `designableSections` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `destTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `detectScope` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `diagRow` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `disableNativeRequired` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `displayMetric` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distDatePass` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distFilter` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distLastDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distProductDbCode` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distSchema` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distStore` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `distributorMetrics` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `districtNames` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `div` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `doAddressSearch` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `doc` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v10.js`
- `docs` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `downloadDistributorWorkbook` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `downloadExcelBordered` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `drawVisitOnMaps` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `dropRemovedUserRowsV40` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `dup` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `dupPairs` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `dynamicShareFields` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `editCustomSelectField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `editId` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v20.js`
- `editOptionOfField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `emptyMetric` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enDigits` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enableDesignItem` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `enableDeviceNotifications` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enforceDeletedUserTombstonesV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enforceRemovedIdentitiesV40` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enhanceAllSelects` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `enhanceDesignerChrome` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `enhanceLiveLocation` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `enhanceOverviewSearch` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `enhanceSalesTargets` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `enhanceSelect` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `enhanceWidgetActions` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `ensure` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `ensureDesignId` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `ensureEditTabButton` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `ensureFieldHost` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `ensureInspectorBar` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `ensureLeafletMap` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `ensureManInspector` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `ensureMeta` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `ensureProductCodes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ensureRouteTools` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ensureSequentialOrders` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `ensureShafaInventoryDerived` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ensureSnappActionBar` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ensureState` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `ensureStateExtras` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `ensureUserTabPane` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `ensureVisitCards` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ent` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `errs` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `esc` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v13.js`, `public/crm-features-v14.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`
- `escHtml` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `excelColumnsFor` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `excelDistributorCell` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `exportOverviewResults` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `exportV20Routes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `extra` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `extraCells` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `extraCols` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `extraHead` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `faDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `faLabel` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `fac` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `fallbackDownload` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `featureCatalog` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `fetchJson` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `fetchServerBulk` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `fieldKeyForTab` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v13.js`, `public/crm-features-v14.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`
- `fieldKeyOfTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `fieldKindOf` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `fieldLabelOf` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `fields` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v20.js`
- `fill` ← `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v13.js`
- `fillAddressOnTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `fillCfTargets` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `fillCopySelects` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `fillDesignerForm` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `fillOrderFromPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `fillPharmacyFromRec` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `fillSel` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `fillYearMonthSelects` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `filterOpts` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `findCustomField` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `findCustomFieldById` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `findDistExact` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `findDistIndex` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `findFieldGroup` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `findHeaderRow` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `findKnownCodeInRow` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `findPharmacyRec` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `finish` ← `public/crm-bundle.js`, `public/crm-features-v19.js`, `public/crm-features-v9.js`
- `fixBackupPage` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `fixProductInfoLabels` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `fixRequiredDefaults` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `fldOpts` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `fm` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `focusOnMap` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `fontOpts` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `forceBlankSnappDates` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `forceListsVisible` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `formatJalali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `formatNominatim` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `formatVisibleNumbers` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `freezeAllTables` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `freezeKnownTables` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `g2d` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `geoReverse` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `geoSearch` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `geoStore` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `get` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `getBoxes` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `getCurrentPositionSafe` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `getFieldList` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `getMainGrid` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `getTabForm` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `getUnifiedFieldList` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `globalCustomFields` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `globalElementOptions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `globalFieldKey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `globalOptionChange` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `globalOptionElements` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `globalOptionState` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `gm` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `gregorianBadge` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `gregorianBadgeFromG` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `gregorianNow` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `gregorianNowTehran` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `gregorianToJalali` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `greyParentOptions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `gridLockKey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `groupAnchor` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `groupIsShared` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `guardOrderSaveVars` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `gvById` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `gy2` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `h` ← `public/crm-bundle.js`, `public/crm-features-v18.js`, `public/crm-features-v20.js`
- `hardenCustomFieldForm` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `hardenManualCanvas` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `hasBulk` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `hav` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `hdrs` ← `public/crm-bundle.js`, `public/crm-hub.js`
- `hidePlacedOrderNotices` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `hideTab` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `hist` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `hit` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `hits` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`
- `hook` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `hookComboInstantAdd` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `hookDesignerSizeDisplay` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `hookInstantHistory` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `hookPharmacyNameField` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `hookSwitchTab` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `hos` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `host` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v13.js`
- `iconifyButtons` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `id` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `idbGet` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `idbOpen` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `idbSet` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `importDistributorFile` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `importSnappFiles` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `importSnappTopups` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `inferredDisplaySize` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `init` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `initBulkVault` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `initRepHomesMap` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `initRepRoutesMap` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `initUserMap` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `injectCss` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `injectRestoreChips` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `inp` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `installFrozenTable` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `installLatinNumberLaw` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `installPersianBuiltinLabelGuardV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `installReferenceInstantAddGuardV40` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `installSafeBrowserGuards` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `installVersionWatchdog` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invSchema` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusDay` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusDetailRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusFilters` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusNameMatch` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `invoiceStatusPlaceMatch` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `isAdmin` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `isAdminLike` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `isDatePartField` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `isHostGroup` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `isKnownPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `isLeap` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `isMappedDist` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `isToday` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `isUserTab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `items` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `j2d` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `jalCal` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `jalaliMonthName` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `jalaliTodayStr` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `jm` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `keepAlive` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `keepLast` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `kind` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `knownList` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `lab` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`
- `label` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v14.js`, `public/crm-features-v15.js`
- `last` ← `public/crm-bundle.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`
- `lastKnownFix` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `latinizeDigits` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `lay` ← `public/crm-bundle.js`, `public/crm-features-v13.js`, `public/crm-features-v18.js`
- `layoutOf` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `listId` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `listLabelKey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `listOrderMap` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `liveSizeOf` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `loadUserTabRecord` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `loadedBuildVersion` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `locCell` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `lockableGrids` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `log` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `logActivity` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `logOp` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `logs` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `main` ← `scripts/build-sw.mjs`, `scripts/clean-extra-files.mjs`, `scripts/generate-assets.mjs`, `scripts/start.mjs`
- `mainFormGrid` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `manualBackupNow` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `matchGeo` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `matchedPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `mergeFacilitiesIntoSearch` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `mergeGlobalOption` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `mergeMetricMaps` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `mergeSameNameFieldInfo` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `meta` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v15.js`, `public/crm-features-v17.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`
- `metricRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `migrateInvoicePermissionOnce` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `migratePermissions` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `mirrorPharmacyFieldsToOrder` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `mirrorPharmacyOrderToOrders` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `mk` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `monthLength` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `mountCopyUi` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `mountGeoEditor` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `move` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `n` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `name` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v13.js`, `public/crm-features-v15.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`
- `nameNow` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `norm` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`, `public/crm-features-v16.js`, `public/crm-features-v20.js`
- `normName` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `normPerson` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `normSnappDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `normalizeDbCode` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `normalizeStoredRow` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `nudgeAnyField` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `numberTable` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `on` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `onTabChanged` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `once` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `opOpts` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `openAll` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `openManualCanvas` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `openPickerFor` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `optionList` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `optionRowsHtml` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `optionsStr` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v15.js`
- `opts` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v14.js`
- `or` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `orderEntityKey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `orderFixedBlock` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `orderMatched` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `orderedShareFields` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `overrideAutoBackup` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `overrideListRenderers` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `ownedByCurrent` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `owner` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `p` ← `public/cloudflare-worker.js`, `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v11.js`, `public/crm-features-v16.js`
- `pad2` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `pageSlice` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `paint` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `paintBadge` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `paintFieldBox` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `paintHydratedBulk` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `paintList` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `paintRepHomesMapV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `paintRequiredStar` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `paintRouteIcons` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `paintSavedSizes` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `paintScopeBadge` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `paintTargetPlanRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `paletteList` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `parseDelimited` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `parseJalali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `parseSnappFile` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `parseXlsx` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `patchExcel` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `patchExcelExports` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `patchRecordSaves` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `patchRenderCustom` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `patchUserCardsWithPasswordChange` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `periodRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `permanentlyRemovedNamesV40` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `permissionAllowed` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `permissionTemplate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `persistAdd` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `persistPass` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `persistRemove` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `persistRename` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `persistUsersToAuth` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `personMatch` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ph` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v10.js`, `public/crm-features-v20.js`, `public/crm-features-v9.js`, `public/crm-hub.js`
- `phFields` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `phId` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `pick` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `pinRepresentativeRouteFieldsV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `ping` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `preciseLocationInputs` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `prev` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `privacyList` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `prod` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v9.js`
- `productFieldRecord` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `productFieldsList` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `productPrice` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `protectReset` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `provinceNames` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `push` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v19.js`
- `pushField` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `pushKeyBytes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `pushPoint` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `put` ← `server.js`, `public/crm-bundle.js`
- `q` ← `public/crm-bundle.js`, `public/crm-features-v17.js`, `public/crm-features-v9.js`
- `query` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `ready` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `realRowLists` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `rebindExcelButtons` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `rec` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`, `public/crm-features-v12.js`, `public/crm-features-v14.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`, `public/crm-features-v20.js`
- `recalc` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `recs` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `refresh` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `refreshActiveView` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `refreshAllDateBadges` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `refreshBtn` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `refreshCombo` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `refreshDistFilterLock` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `refreshEntityLists` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `refreshExtraInfoTables` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `refreshFrozenTable` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `refreshInvoiceStatusLocks` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `refreshOrderPharmacyList` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `refreshVisitCards` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `reindexOrders` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `reliableFeatureBoot` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `reloadCities` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `reloadDists` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `reloadProv` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `rememberPharmacyName` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `renderActivityChartAndTable` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderActivityLogV36` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderActivityMapAndChart` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderAddTabGrid` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `renderAddTabPanel` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `renderChangeLogV41` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderColBoxList` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderColDesignerPanel` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderColFieldList` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderColTabGrid` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderDashWidgets` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `renderDiagOps` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `renderDiagnostics` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `renderDistributorActions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderDistributorCompanies` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderDistributorDatabase` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderDistributorReport` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderDoctorsListV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderInvoiceStatus` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderLiveLocationTabV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderManPalette` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `renderManualGrid` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `renderNotificationsV35` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderOrdersListV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderPager` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderPharmaciesListV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderPharmacyPicks` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `renderPresetBar` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderProdInfoPanel` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `renderProductExtras` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderRepHomesV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderRoutesTableV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderSecurityStatus` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderShareManager` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderSnappCorporate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderSnappTopups` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderSuggestBox` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `renderTargetReportsV34` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderTargetsV20` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderTgtSummary` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `renderUserTabList` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `renderV20Routes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderVersionBadge` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `renderWidgetPicker` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `reorderOneList` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `reorderRow` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `rep` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `repRouteLabel` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `repairSnappHeaders` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `replaceNode` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `replyNotificationV35` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `report` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `reportTableHtml` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `resetLayout` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `resetProductV20` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `resetUserTabForm` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `restoreBackupHandles` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `restoreConfiguredFieldVisibility` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `restoreDomFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `restoreFixedFilterGrids` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `restoreOrderFormSequence` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `restoreOrderLayoutSettings` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `restoreProtectedCards` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `rewireBackupButtons` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `routeFill` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `routeGeoValues` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `routeLabelFromUser` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `routeSelected` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `routes` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `rowSignature` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `rows` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `runApplyDiagnosisV43` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `runDetailedDiagnostics` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `runGetAddress` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `runMyLocation` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `runSearchAddress` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `runtimeVersion` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `safeAlert` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `safeOrderFields` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `sales` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `save` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `saveBulkVault` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `saveCf` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `saveCustomFieldNow` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `saveDesignerField` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `saveDoctorV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `saveLastFix` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `saveOrderV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `savePharmacyV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `saveProductV20` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `saveSoft` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `saveUserTabRecord` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `saveUserV27` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `saved` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `scanBuiltinFields` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `scrubDuplicateWidgetsInState` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `sec` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `secN` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `seedGlobalOptions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `seedGreyDefaults` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `seedRequiredMeta` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `selectManItem` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `selectOrderPharmacyCardV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `selectedShareIds` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `selectsOfTab` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `sendPushForNotification` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `sendUnappliedReportV41` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setAnyFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `setFieldGrey` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setListFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `setPermissionNodeVisible` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setTabCoords` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `setVal` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupBackupExtras` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupChangeLogTabV41` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupColumnsDesigner` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `setupDistributorSales` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupDynamicDateFields` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupGlobalFieldOptions` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupHomesUi` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupInstallLinks` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupInstantAdd` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `setupInstantAddAll` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `setupInvoiceStatus` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupLiveLocationV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupLoginGate` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupMessengersUi` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupNotificationCenterV35` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupOnTheFlyNameFields` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupOverviewMapV9` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupPharmacyPicker` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `setupPlainRecipientV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupProductExtras` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `setupRepresentativeRoutes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupRoutesUi` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupSingleSaveHandlers` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupSnappCorporate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupSplitFormList` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupTargetPlannerV34` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupTwoWayLocationSync` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `setupV37FinalGuards` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupV42Guards` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `setupVisitButtons` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `setupWidgetManager` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `shareOrderSettings` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `shareSettings` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `shareValue` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `show` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `showDistributorRaw` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `showInvoiceStatusDetails` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `showNotificationThreadV35` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `showPharmacyMatch` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `showSnappArchives` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `shownInList` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `shrinkPharmacyField` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `skipCombo` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `skipInstant` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `skipped` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `slashOnlyPersianDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `slotsFor` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `slugLabel` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `snappFilters` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `snappIndexes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `snappNumber` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `snappStore` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `snappTopupFilters` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `softenBrokenAbsLayouts` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `sortedFields` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `sortedListFields` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `splitSnappDateTime` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `src` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `srcFields` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `srcId` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `srcLay` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `st` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `stale` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `stampWidgetField` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `start` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `startV20Visit` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `startVisitTracking` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `stopV20Visit` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `stopVisitTracking` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `stripAllBlackStars` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `stripDefaultUserChrome` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `stripLabelStarText` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `sum` ← `public/crm-bundle.js`, `public/crm-features-v10.js`
- `syncActiveAddEntity` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncNotificationRecipients` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncPermissionMasters` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncPick` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `syncRepresentativeSelectors` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncRepsFromUsers` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncUsersAuthV27` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `syncW` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `syncWidths` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `syncX` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `tab` ← `public/crm-bundle.js`, `public/crm-features-v12.js`, `public/crm-features-v14.js`
- `tabKey` ← `public/crm-bundle.js`, `public/crm-features-v12.js`
- `tabLabelOfPane` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `take` ← `public/crm-bundle.js`, `public/crm-features-v13.js`, `public/crm-features-v18.js`
- `targetInp` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `targetMoney` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `targetPeriodMatch` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `targetPlanRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `targetReportTable` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `tdVis` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `tehranParts` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `temporalMode` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `tgt` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v9.js`
- `thText` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `thVis` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `tightenAddPanel` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `toEnDigits` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toFaNum` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toGregorian` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `toJalaali` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `todayJ` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `todayJalaliStr` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `toggleAddKind` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `toggleOpts` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `topupIndexes` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `totalMetricRow` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `tripSchema` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `tryInstall` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `type` ← `public/crm-bundle.js`, `public/crm-features-v14.js`, `public/crm-features-v15.js`
- `u` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `u16` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `undoOldFreeze` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `unifyButtons` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `unlockManualCanvas` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `unwrapPlainSelectV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `unzipEntry` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `up` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `updateGregorianBadges` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `updateRepTextAddress` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `updateSnappLatestDates` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `updateTargetPlanGrand` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `updateVisitUi` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `upgradeCopySelects` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `upgradeProdBarV19` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `upgradeProdFieldBar` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `user` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `userIdForRep` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `users` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v9.js`
- `ut` ← `public/crm-bundle.js`, `public/crm-features-v11.js`, `public/crm-features-v12.js`, `public/crm-features-v13.js`, `public/crm-features-v14.js`, `public/crm-features-v18.js`, `public/crm-features-v19.js`
- `v` ← `public/crm-bundle.js`, `public/crm-features-v12.js`, `public/crm-features-v16.js`, `public/crm-features-v17.js`, `public/crm-jalali.js`
- `v20ApplyGreyChains` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20ApplyOrderLock` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20CurrentUser` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20EntityRecordsHtml` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20EntityRows` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20FillOrderPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20IsManager` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20LastTab` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20PaneEntity` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20PlaceMatchNearInput` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20RefreshFab` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20RenderEntityManager` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20ReorderListColumns` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20SetValue` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20SigOf` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v20Toast` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v39OrdersCanonicalReset` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v42ClearButtons` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v42ClearOnLeave` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v42ConfirmDupGuard` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `v42Styles` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `val` ← `public/crm-app.js`, `public/crm-bundle.js`, `public/crm-features-v9.js`
- `versionWatchdogTick` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `visibleActivityRowsV36` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `visibleDoctors` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `visibleNotificationsV35` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `visibleOrders` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `visiblePharmacies` ← `public/crm-bundle.js`, `public/crm-features-v9.js`
- `visibleRepHomesV37` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `visitDate` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `w` ← `public/crm-bundle.js`, `public/crm-features-v18.js`, `public/crm-features-v20.js`
- `watchAddPanel` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `watchDesignerForChips` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `watchDesignerPanel` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `watchIcons` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `watchManual` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `watchManualCanvas` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `weekdayIran` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `wirePopupChrome` ← `public/crm-bundle.js`, `public/crm-jalali.js`
- `words` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapAllLegacyLayouts` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapApplyLayoutDedupe` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `wrapApplyOrderTabId` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `wrapAttachInstant` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `wrapConfirms` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `wrapCopy` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `wrapDocSave` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `wrapFormLayoutMirror` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapInstantAddPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `wrapListRenderers` ← `public/crm-bundle.js`, `public/crm-features-v19.js`, `public/crm-features-v20.js`
- `wrapListRenders` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `wrapListSort` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `wrapNewestTables` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapOrdSave` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `wrapPaintFieldBox` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `wrapPhSave` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `wrapPharmacySaveDup` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `wrapPharmacySaveRefresh` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `wrapPopulateGeo` ← `public/crm-bundle.js`, `public/crm-features-v16.js`
- `wrapProdSave` ← `public/crm-bundle.js`, `public/crm-features-v14.js`
- `wrapRememberPharmacy` ← `public/crm-bundle.js`, `public/crm-features-v17.js`
- `wrapRenderCustomFields` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `wrapShareModal` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapSwitchTab` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `wrapValidate` ← `public/crm-bundle.js`, `public/crm-features-v18.js`
- `wrapWidget` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `wrapped` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `writeFieldFlag` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `writeFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `writeFieldSize` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `writeItemBox` ← `public/crm-bundle.js`, `public/crm-features-v13.js`
- `writeListFieldOrder` ← `public/crm-bundle.js`, `public/crm-features-v11.js`
- `writeProdFieldFlag` ← `public/crm-bundle.js`, `public/crm-features-v19.js`
- `writeSafeOrder` ← `public/crm-bundle.js`, `public/crm-features-v20.js`
- `writeSizeFallback` ← `public/crm-bundle.js`, `public/crm-features-v15.js`
- `xmlEsc` ← `public/crm-bundle.js`, `public/crm-features-v20.js`

## ح) هشدارهای دائمی معماری

- `public/crm-app.js` دو نسل کد فرم دارد؛ هر تغییر رفتاری فرم باید در هر دو نسل + مسیر فعال v9 جفت شود.
- آخرین لایه (crm-features-v20.js) برنده نهایی بازنویسی‌هاست؛ اسکریپت‌های بعد از آن نباید بیایند مگر با افزودن به انتهای زنجیره.
- اسکلت Next.js در `src/` خفته است؛ ورودی اصلی `server.js` + `public/` است.

## ط) گراف عملیاتی انتشار و اسناد تحویل

- نسخه سورس package: `12.01.0`
- مخزن GitHub: `javadalamdarmehraeen-rgb/javad-test1`؛ شاخه اجباری جلسه Arena فعلی: `arena/01a03a45-javad-test1`؛ push/PR فقط از همین شاخه.
- Production فعال: `https://javad-test1.onrender.com` — نسخه سورس فعلی `11.66.0` است و تا push کاربر روی production همان آخرین دیپلوی قبلی می‌ماند.
- ترتیب خواندن چت بعدی: `PROJECT_GRAPH.md` → `GITHUB_REVIEW_HANDOFF.md` → `AI_ACCEPTANCE_CHECKLIST.md` → `AI_RULES.md` → `AI_PROJECT_CONTEXT.md` → `AI_ARCHITECTURE.md`.
- `GITHUB_REVIEW_HANDOFF.md` مرجع وضعیت commit/push/PR/GitLab/Render/production و دستورات بررسی است؛ قبل از ادعای deploy باید دوباره اندازه‌گیری شود.
- زنجیره انتشار: source test → commit → push Arena branch → PR main → checks → merge → GitLab mirror → Render deploy → production health.
- قانون نوبت ۶۱ (۹۱): در هر چت همه فایل‌های آرشیوی (graph/handoff/chat.arena/اسکریپت‌های مولد/checklist/rules/decision/tasks/context/architecture/handoff-prompt/changes/README/OFFICIAL_FILELIST) به‌روز شوند و ZIP کنار صفحه تحویل شود.
- قانون نوبت ۶۲ (۹۲): هر پرامپت بند‌به‌بند اجرا و راستی‌آزمایی شود؛ قبل از ZIP ورود خودکار به برنامه (سرور واقعی + app-smoke) اجباری است؛ پایان هر چت بلوک دستور git با شماره نسخه تحویل می‌شود.
- قانون نوبت ۸۶ (۹۳): ZIP تحویلی باید PKZIP ویندوز (create_system=0) باشد و از صفحه HTML پورت 8000 با attachment دانلود شود؛ پیش‌نمایش خام ZIP در Arena فرمت معتبر نیست.

## ی) گراف موتور نجات کش 11.38

- `server.js /api/health` → نسخه واقعی server با no-store و `X-CRM-Build`.
- `public/index.html` و `public/login.html` → مقایسه build محلی با health؛ mismatch → `/cache-reset`.
- `server.js /cache-reset` → `Clear-Site-Data: cache` + حذف CacheStorage/SW + redirect یکتا؛ LocalStorage/IndexedDB ممنوع از حذف.
- `public/sw.js` → purge install/activate + network-only HTML/JS/CSS + `CRM_BUILD_ACTIVE` broadcast.
- `public/crm-app.js` → دریافت `CRM_BUILD_ACTIVE` و cache-reset خودکار در mismatch.
