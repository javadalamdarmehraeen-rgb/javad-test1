# 🕸️ گراف دانش پروژه «نماینده علمی» (PROJECT_GRAPH.md)

> این فایل **خودکار** ساخته می‌شود — با دستور `python update_project_graph.py`
> و در پایان هر تحویل، قبل از بازسازی chat.arena، تازه می‌شود (قانون ۶۶ AI_RULES).
> **قانون برای هوش مصنوعی: به‌جای خواندن کل سورس، اول این فایل را بخوان؛**
> جزئیات متن کامل فایل‌ها در بخش ۹ chat.arena است.

## الف) زنجیره لود اسکریپت‌ها (ترتیب اجرا در مرورگر)

1. `vendor/leaflet.js`
2. `crm-data.js`
3. `crm-app.js`
4. `crm-bundle.js`

## ب) کارت فایل‌ها (نقش + توابع + نام‌های window که می‌سازد)

### `server.js` (24389 بایت)
- نقش: سرور سبک Node.js برای Render — ورود جدا، gzip، health، ژئوکد، محدودیت نرخ
- تعداد توابع داخلی: 15
- endpointهای سرور: `/api/backup`, `/api/backup/email`, `/api/bulk`, `/api/bulk`, `/api/feedback`, `/api/feedback`, `/api/push/public-key`, `/api/push/send`, `/api/push/subscribe`, `/api/state`, `/api/state`

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

### `public/crm-app.js` (177840 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 169
- نام‌های window که تعریف/بازنویسی می‌کند: `__CRM_HAD_SAVED_STATE`, `__CRM_SW_READY`, `_editingProductId`, `_editingRepHomeId`, `_lastSavedProductId`, `_lastSavedProductName`, `_navHamburgerBound`, `activeDateInputForPicker`, `applyAllFormLayouts`, `applyCustomFieldOrderInForm`, `attachInstantAdd`, `attachJalaliPicker`, `buildDesignerWidget`, `cleanupOrphanCustomFields`, `getAllMenuSections`, `rememberPharmacyName`, `renderExtraTabCustomFields`, `validateRequiredFields`

### `public/crm-bundle.js` (812845 بایت)
- نقش: * crm-bundle.js — فایل واحد برنامه (ادغام عینی لایه‌ها با همان ترتیب اجرای قبلی؛ نسخه از package.json) */
- تعداد توابع داخلی: 846
- نام‌های window که تعریف/بازنویسی می‌کند: `CRMJalali`, `FA_FIELD_LABELS`, `IRAN_FACILITIES`, `WIDGET_PALETTE`, `__CRM_BULK_READY`, `__CRM_HAD_SAVED_STATE`, `__CRM_LATIN_NUMBER_LAW`, `__CRM_MANAGER_LAYOUT_INTENT`, `__CRM_MANAGER_LAYOUT_TIMER`, `__CRM_ORIGIN_BOOTSTRAP_CHECKED`, `__CRM_RESCUING`, `__CRM_SAFE_BROWSER_GUARDS`, `__CRM_WD`, `__V40_REFADD`, `__V42CD`, `__V42CSS`, `__lastHealth`, `__v40LastPick`, `_actMap`, `_actMarks`, `_activeAddTab`, `_activeColTab`, `_activeManualTab`, `_colDelPatched`, `_colEditScroll`, `_editingBoxId`, `_editingColField`, `_editingProductId`, `_jalaliBuildPatched`, `_jalaliLayoutPatched`, `_jalaliRenderPatched`, `_jalaliSw`, `_layoutBusy`, `_manPick`, `_manSelected`, `_palDelegate`, `_v12OrderWrap`, `_v12Sw`, `_v13LayoutWrap`, `_v13OrderId`

### `public/crm-data.js` (63491 بایت)
- نقش: ============================================================================
- تعداد توابع داخلی: 1

### `public/sw-template.js` (13719 بایت)
- نقش: * ============================================================
- تعداد توابع داخلی: 10

### `public/sw.js` (3742 بایت)
- نقش: const BUILD = "11.44.0";
- تعداد توابع داخلی: 3

### `public/vendor/leaflet.js` (147552 بایت)
- نقش: * @preserve
- تعداد توابع داخلی: 0
- نام‌های window که تعریف/بازنویسی می‌کند: `L`

## ج) گراف بازنویسی نام‌های window (چه فایلی روی چه فایلی سوار می‌شود)

- `__CRM_HAD_SAVED_STATE`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `_editingProductId`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `activeDateInputForPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `applyAllFormLayouts`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `applyCustomFieldOrderInForm`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `attachInstantAdd`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `attachJalaliPicker`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `buildDesignerWidget`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `cleanupOrphanCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `getAllMenuSections`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `rememberPharmacyName`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `renderExtraTabCustomFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`
- `validateRequiredFields`: تعریف/بازنویسی به ترتیب لود → `public/crm-app.js` ← `public/crm-bundle.js`

## د) گراف API (سرویس api ↔ مصرف‌کننده‌ها)

- `/api/backup` [GET] — مصرف‌کننده: —
- `/api/backup/email` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/bulk` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/feedback` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/geocode?q=` [؟] — مصرف‌کننده: `public/crm-app.js`
- `/api/health` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/health?__diag=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/health?__wd=` [؟] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/public-key` [GET] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/send` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/push/subscribe` [POST] — مصرف‌کننده: `public/crm-bundle.js`
- `/api/reverse?lat=` [؟] — مصرف‌کننده: `public/crm-app.js`, `public/crm-bundle.js`
- `/api/state` [GET] — مصرف‌کننده: `public/crm-bundle.js`

## هـ) گراف حافظه مرورگر (کلید ↔ فایل‌های دست‌زننده)

- `CRM_APP_STATE_CORRUPT_ARCHIVE_` ← localStorage: `public/crm-app.js`
- `CRM_APP_STATE_V2` ← localStorage: `public/crm-bundle.js`
- `CRM_ASSET_BUILD` ← localStorage: `server.js`
- `CRM_CACHE_RESCUED_` ← sessionStorage: `server.js`
- `CRM_DIAG_LOG` ← localStorage: `public/crm-bundle.js`
- `CRM_LAST_GPS` ← localStorage: `public/crm-bundle.js`
- `CRM_USERS_AUTH` ← localStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `CRM_V39_ORDER_CANONICAL_RESET` ← localStorage: `public/crm-bundle.js`
- `crmLoggedIn` ← sessionStorage: `public/crm-app.js`, `public/crm-bundle.js`
- `crmOriginBootstrapDone` ← sessionStorage: `public/crm-bundle.js`
- `crmUserId` ← sessionStorage: `public/crm-bundle.js`
- `crmUserName` ← sessionStorage: `public/crm-bundle.js`
- `crmUserRole` ← sessionStorage: `public/crm-bundle.js`
- `crmUsername` ← sessionStorage: `public/crm-bundle.js`
- `distPass_` ← sessionStorage: `public/crm-bundle.js`

## و) گراف تب‌ها (تب ↔ فایل‌هایی که با المان‌هایش کار می‌کنند)

### tab-activity-log «⏱️ فعالیت لحظه‌ای»
- `public/crm-app.js` → 2 شناسه (مثل: `btnRefreshActivity`, `tableActivityLogBody`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `activityChartBox`, `map-activity-log`, `tableActivityLogBody`)

### tab-backup «💾 پشتیبان‌گیری»
- `public/crm-app.js` → 14 شناسه (مثل: `autoBackupHandleStatus`, `btnCancelRestore`, `btnConfirmRestore`, `btnManualBackupNow`, `btnSelectAutoBackupFolder`, `chkAutoBackupEnabled`, `dropzoneRestore`, `fileInputRestore`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `autoBackupHandleStatus`, `backupEmailInput`, `backupIntervalSelect`)

### tab-changelog «»
- `public/crm-bundle.js` → 6 شناسه (مثل: `btnDownloadUnappliedReport`, `btnRunDiagnosis`, `btnSendUnappliedReport`, `v41ChangeHost`, `v41DiagHost`, `v41ReportStatus`)

### tab-columns-products «🧱 ستون‌ها و کالاها»
- `public/crm-app.js` → 8 شناسه (مثل: `btnSaveProduct`, `formProduct`, `productDistPrice`, `productName`, `productPrice`, `productSavedBanner`, `productStock`, `tableProductsBody`)
- `public/crm-bundle.js` → 10 شناسه (مثل: `btnSaveProduct`, `columnsDesignerHost`, `formProduct`, `productCode`, `productDistPrice`, `productName`, `productPrice`, `productSavedBanner`)

### tab-custom-fields «➕ افزودن‌ها»
- `public/crm-app.js` → 9 شناسه (مثل: `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfOptionsWrapper`, `cfShowInForm`, `cfShowInList`, `cfTargetEntity`, `cfType`)
- `public/crm-bundle.js` → 12 شناسه (مثل: `addTabGrid`, `addTabPanel`, `btnSaveCustomField`, `cfAllowAddOption`, `cfLabel`, `cfOptions`, `cfSaveStatus`, `cfShowInForm`)

### tab-dashboard «📊 داشبورد»
- `public/crm-app.js` → 2 شناسه (مثل: `dashboardLaunchpadGrid`, `map-dashboard-overview`)
- `public/crm-bundle.js` → 4 شناسه (مثل: `btnAddDashWidget`, `dashboardChartsWidget`, `dashboardWidgetPicker`, `dashboardWidgetsHost`)

### tab-distributor-companies «🏢 اطلاعات شرکت‌ها»
- `public/crm-bundle.js` → 1 شناسه (مثل: `distributorCompanyGrid`)

### tab-distributor-database «🗄️ دیتابیس پخش‌ها»
- `public/crm-bundle.js` → 2 شناسه (مثل: `distributorDatabaseGrid`, `distributorRawViewer`)

### tab-distributor-invoice-status «🧾 وضعیت فاکتور پخش‌ها»
- `public/crm-bundle.js` → 12 شناسه (مثل: `invoiceStatusBody`, `invoiceStatusFrom`, `invoiceStatusModeFrom`, `invoiceStatusModeMonth`, `invoiceStatusModeTo`, `invoiceStatusModeYear`, `invoiceStatusMonth`, `invoiceStatusRep`)

### tab-distributor-sales «📦 اطلاعات فروش پخش‌ها»
- `public/crm-bundle.js` → 16 شناسه (مثل: `btnBuildDistributorReport`, `btnExportDistributorReport`, `distFilterDay`, `distFilterFrom`, `distFilterMonth`, `distFilterTo`, `distFilterYear`, `distModeDay`)

### tab-doctors «👨‍⚕️ پزشکان»
- `public/crm-app.js` → 27 شناسه (مثل: `btnDocMapSearch`, `btnDocPercentageNo`, `btnDocPercentageYes`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnExportDoctorsCSV`, `btnSaveDoctor`, `docFileDisplay`)
- `public/crm-bundle.js` → 12 شناسه (مثل: `btnDocMapSearch`, `btnDoctorCurrentLocation`, `btnDoctorGetAddressFromPoint`, `btnSaveDoctor`, `cardDocList`, `docFileInput`, `doctorEditId`, `doctorName`)

### tab-install-app «📲 نصب اپ»
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnInstallAndroid`, `btnInstallIos`, `btnInstallWindows`)

### tab-leaves «📝 مرخصی‌ها»
- `public/crm-app.js` → 12 شناسه (مثل: `btnExportLeavesCSV`, `formLeaveRequest`, `leaveFromDate`, `leaveFromTime`, `leaveHoursGroup`, `leaveHoursInput`, `leaveReasonInput`, `leaveRepSelect`)

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
- `public/crm-bundle.js` → 4 شناسه (مثل: `btnEndVisit`, `btnStartVisit`, `map-my-visit`, `visitStatusBox`)

### tab-notifications «🔔 اعلان‌ها»
- `public/crm-app.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)
- `public/crm-bundle.js` → 5 شناسه (مثل: `formSendMessage`, `msgBodyInput`, `msgRecipientSelect`, `msgTitleInput`, `tableNotificationsBody`)

### tab-orders «📦 سفارشات»
- `public/crm-app.js` → 31 شناسه (مثل: `btnAddOrderItemRow`, `btnExportOrdersCSV`, `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `existingPharmacyAlertText`, `existingPharmacyTopAlert`, `formOrder`)
- `public/crm-bundle.js` → 22 شناسه (مثل: `btnResetOrderForm`, `btnSaveOrder`, `btnTopAutoFillPharmacy`, `cardOrdList`, `existingPharmacyAlertText`, `existingPharmacyTopAlert`, `formOrder`, `ordListCountBadge`)

### tab-overview-map «🗺️ نقشه جامع»
- `public/crm-app.js` → 4 شناسه (مثل: `btnFocusMapRegion`, `map-full-overview`, `mapFilterCity`, `mapFilterProvince`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnExportOverviewMapCSV`, `btnFocusMapRegion`, `cntOverviewDoctors`, `cntOverviewHospitals`, `cntOverviewPharmacies`, `mapFilterCity`, `mapFilterDistrict`, `mapFilterProvince`)

### tab-pharmacies «🏥 داروخانه‌ها»
- `public/crm-app.js` → 32 شناسه (مثل: `btnExportPharmaciesCSV`, `btnPhMapSearch`, `btnPhPercentageNo`, `btnPhPercentageYes`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `formPharmacy`)
- `public/crm-bundle.js` → 22 شناسه (مثل: `btnPhMapSearch`, `btnPharmacyCurrentLocation`, `btnPharmacyGetAddressFromPoint`, `btnSavePharmacy`, `cardPhList`, `formPharmacy`, `phFileInput`, `phListCountBadge`)

### tab-rep-homes «🏠 منزل نمایندگان»
- `public/crm-app.js` → 3 شناسه (مثل: `repHomeAddressInput`, `repHomeSelect`, `tableRepHomesBody`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnRepHomeCurrentLocation`, `repHomeSelect`, `tableRepHomesBody`)

### tab-rep-routes «🛣️ رصد تردد»
- `public/crm-app.js` → 1 شناسه (مثل: `tableRepRoutesBody`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `btnRefreshRepRoutesMap`, `routeRepFilterSelect`, `tableRepRoutesBody`)

### tab-sales-targets «🎯 تارگت فروش»
- `public/crm-app.js` → 9 شناسه (مثل: `formSalesTarget`, `tableSalesTargetsBody`, `tgtCalcDistPrice`, `tgtCalcPhPrice`, `tgtCountInput`, `tgtMonthSelect`, `tgtProductSelect`, `tgtRepSelect`)
- `public/crm-bundle.js` → 14 شناسه (مثل: `btnSaveRepresentativeRoute`, `formSalesTarget`, `representativeRoutesCard`, `routeManagerCity`, `routeManagerDistrict`, `routeManagerProvince`, `routeManagerRep`, `tableSalesTargetsBody`)

### tab-search-info «🔍 جستجوی اطلاعات»
- `public/crm-app.js` → 38 شناسه (مثل: `btnExportSearchInfoCSV`, `btnNavBalad`, `btnNavGoogle`, `btnNavNeshan`, `btnNavWaze`, `btnRowCopyText`, `btnRowDelete`, `btnRowEdit`)
- `public/crm-bundle.js` → 10 شناسه (مثل: `btnRowCopyText`, `formLoginModal`, `jalaliCalendarPopup`, `jalaliDaysGrid`, `jalaliMonthSelect`, `jalaliNextMonth`, `jalaliPrevMonth`, `jalaliTodayBtn`)

### tab-snapp-corporate «🚕 اسنپ سازمانی»
- `public/crm-bundle.js` → 29 شناسه (مثل: `btnBuildSnappReport`, `btnBuildSnappTopupReport`, `btnExportSnappTopups`, `btnExportSnappView`, `btnImportSnappTopups`, `btnImportSnappTrips`, `btnOpenSnappCorporate`, `snappDailyStatus`)

### tab-troubleshooting «🛠️ عیب‌یابی»
- `public/crm-app.js` → 1 شناسه (مثل: `diagnosticsStatusBox`)
- `public/crm-bundle.js` → 3 شناسه (مثل: `diagnosticsOpsLog`, `diagnosticsStatusBox`, `diagnosticsVisual`)

### tab-users-permissions «👤 کاربران و دسترسی»
- `public/crm-app.js` → 16 شناسه (مثل: `btnExportUsersCSV`, `btnPermSelectAll`, `btnPermSelectNone`, `btnSaveUserInfo`, `btnToggleShowAllPasswords`, `formCreateUser`, `newFullName`, `newPassword`)
- `public/crm-bundle.js` → 9 شناسه (مثل: `btnSaveUserInfo`, `formCreateUser`, `newFullName`, `newPassword`, `newPhone`, `newRole`, `newSimControl`, `newUsername`)

## ز) نام‌های تابع تکراری در چند فایل (نقاط حساس بازنویسی)

- `apply` ← `public/crm-app.js`, `public/crm-bundle.js`
- `doc` ← `public/crm-app.js`, `public/crm-bundle.js`
- `fields` ← `public/crm-app.js`, `public/crm-bundle.js`
- `main` ← `scripts/build-sw.mjs`, `scripts/clean-extra-files.mjs`, `scripts/generate-assets.mjs`, `scripts/start.mjs`
- `name` ← `public/crm-app.js`, `public/crm-bundle.js`
- `norm` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`
- `p` ← `public/cloudflare-worker.js`, `public/crm-bundle.js`
- `ph` ← `public/crm-app.js`, `public/crm-bundle.js`
- `prod` ← `public/crm-app.js`, `public/crm-bundle.js`
- `rec` ← `scripts/clean-extra-files.mjs`, `public/crm-bundle.js`
- `tgt` ← `public/crm-app.js`, `public/crm-bundle.js`
- `users` ← `public/crm-app.js`, `public/crm-bundle.js`
- `val` ← `public/crm-app.js`, `public/crm-bundle.js`

## ح) هشدارهای دائمی معماری

- `public/crm-app.js` دو نسل کد فرم دارد؛ هر تغییر رفتاری فرم باید در هر دو نسل + مسیر فعال v9 جفت شود.
- آخرین لایه (crm-features-v20.js) برنده نهایی بازنویسی‌هاست؛ اسکریپت‌های بعد از آن نباید بیایند مگر با افزودن به انتهای زنجیره.
- اسکلت Next.js در `src/` خفته است؛ ورودی اصلی `server.js` + `public/` است.

## ط) گراف عملیاتی انتشار و اسناد تحویل

- نسخه سورس package: `11.44.0`
- مخزن GitHub: `javadalamdarmehraeen-rgb/javad-test1`؛ شاخه اجباری جلسه Arena فعلی: `arena/01a0262d-javad-test1`؛ push/PR فقط از همین شاخه.
- Production فعال: `https://javad-test1.onrender.com` — در 2026-08-21T21:24Z نسخه `11.38.0` را سرو کرد؛ سرویس قدیمی `namayandeelmi-javad.onrender.com` هنوز `11.20.0` است.
- ترتیب خواندن چت بعدی: `PROJECT_GRAPH.md` → `GITHUB_REVIEW_HANDOFF.md` → `AI_ACCEPTANCE_CHECKLIST.md` → `AI_RULES.md` → `AI_PROJECT_CONTEXT.md` → `AI_ARCHITECTURE.md`.
- `GITHUB_REVIEW_HANDOFF.md` مرجع وضعیت commit/push/PR/GitLab/Render/production و دستورات بررسی است؛ قبل از ادعای deploy باید دوباره اندازه‌گیری شود.
- زنجیره انتشار: source test → commit → push Arena branch → PR main → checks → merge → GitLab mirror → Render deploy → production health.
- قانون نوبت ۶۱ (۹۱): در هر چت همه فایل‌های آرشیوی (graph/handoff/chat.arena/اسکریپت‌های مولد/checklist/rules/decision/tasks/context/architecture/handoff-prompt/changes/README/OFFICIAL_FILELIST) به‌روز شوند و ZIP کنار صفحه تحویل شود.
- قانون نوبت ۶۲ (۹۲): هر پرامپت بند‌به‌بند اجرا و راستی‌آزمایی شود؛ قبل از ZIP ورود خودکار به برنامه (سرور واقعی + app-smoke) اجباری است؛ پایان هر چت بلوک دستور git با شماره نسخه تحویل می‌شود.

## ی) گراف موتور نجات کش 11.38

- `server.js /api/health` → نسخه واقعی server با no-store و `X-CRM-Build`.
- `public/index.html` و `public/login.html` → مقایسه build محلی با health؛ mismatch → `/cache-reset`.
- `server.js /cache-reset` → `Clear-Site-Data: cache` + حذف CacheStorage/SW + redirect یکتا؛ LocalStorage/IndexedDB ممنوع از حذف.
- `public/sw.js` → purge install/activate + network-only HTML/JS/CSS + `CRM_BUILD_ACTIVE` broadcast.
- `public/crm-app.js` → دریافت `CRM_BUILD_ACTIVE` و cache-reset خودکار در mismatch.
