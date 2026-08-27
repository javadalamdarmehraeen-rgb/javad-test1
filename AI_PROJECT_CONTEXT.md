# AI PROJECT CONTEXT
# Namayande Elmi

> This document is the persistent context for AI coding agents working on this project.
>
> IMPORTANT:
> This is an existing production project.
> It is NOT a new project.
>
> The AI agent MUST understand the existing architecture before modifying code.

---

# 1. PROJECT IDENTITY

Project name:

Namayande Elmi

Repository:

https://github.com/javadalamdarmehraeen-rgb/namayandeelmi-javad (مخزن نوبت‌های ۵۹–۶۰)

مخزن فعال از نوبت ۶۱:

https://github.com/javadalamdarmehraeen-rgb/javad-test1

Production فعال (اعلام کاربر، نوبت ۶۱):

https://javad-test1.onrender.com — نسخه 11.38.0 تأییدشده در 2026-08-21T21:24Z

سرویس قدیمی (دیگر مرجع نیست):

https://namayandeelmi-javad.onrender.com — هنوز 11.20.0

Current project version reported by package.json:

11.67.0

نوبت ۸۷ (2026-08-26): عرض/ارتفاع فیلد، ویرایش/حذف تارگت‌ها، همگام‌سازی زنده سرور.

Current project state:

Existing production application with a hybrid architecture.

---

# 2. CRITICAL WARNING

DO NOT assume this is a simple Next.js application.

The project contains multiple architectural layers that have evolved over time.

The current project includes:

- Node/server.js runtime
- Public HTML/JavaScript CRM application
- Next.js App Router
- Next.js API routes
- PostgreSQL
- Drizzle ORM
- PWA / Service Worker
- Mobile application
- Synchronization system
- Maps/GPS functionality
- Backup/restore functionality
- Messaging functionality
- Role and permission system

These layers may depend on each other.

DO NOT simplify or rewrite the architecture without explicit approval.

---

# 3. CURRENT RUNTIME

package.json currently defines:

npm start
    -> node server.js

Therefore the current Render runtime must NOT automatically be assumed to be:

next start

The repository also contains scripts/start.mjs and Next.js build/start infrastructure.

There is therefore an architectural/runtime distinction that must be preserved until fully verified.

DO NOT change package.json, server.js, render.yaml, or scripts/start.mjs merely to make the architecture look cleaner.

Before changing runtime behavior, trace the complete deployment path.

---

# 4. PRIMARY UI

The current root Next.js page does NOT directly implement the primary CRM interface.

src/app/page.tsx embeds:

/index.html

through an iframe.

Therefore the actual CRM interface is heavily dependent on:

public/index.html

and its JavaScript dependencies.

IMPORTANT:

Do NOT assume that modifying React components automatically modifies the primary CRM interface.

Always determine which UI layer owns the requested feature.

---

# 5. PUBLIC CRM APPLICATION

public/index.html is a critical active file.

It contains the primary CRM interface and loads the following JavaScript files.

Important load order includes:

- crm-data.js
- crm-app.js
- crm-features-v9.js
- iran-facilities.js
- crm-features-v10.js
- crm-features-v11.js
- crm-features-v12.js
- crm-features-v13.js
- crm-jalali.js
- crm-features-v14.js
- crm-features-v15.js
- crm-features-v16.js
- crm-features-v17.js
- crm-features-v18.js

IMPORTANT:

crm-features-v9.js through crm-features-v18.js are currently loaded by public/index.html.

Therefore they MUST NOT be treated as unused files without verifying their dependencies.

Do NOT delete them.

---

# 6. LEGACY FILES

The repository contains historical CRM JavaScript versions.

Older versions such as v1-v8 appear in the project's historical/extra-file management context.

However:

v9-v18 are currently part of the official loaded CRM application.

Therefore:

v1-v8:
    Historical/legacy status requires care.

v9-v18:
    Currently active/official according to public/index.html and the project file structure.

Never delete versioned CRM files simply because they look old.

---

# 7. NEXT.JS LAYER

The project contains a substantial Next.js App Router implementation.

Important areas include:

src/app
src/components
src/db
src/lib

src/app contains areas including:

- admin
- login
- panel
- diagnostics
- install
- offline
- API routes
- map-related functionality
- screenshots
- icons

The Next.js layer must be treated as a real part of the application.

However, it must not be assumed to be the only frontend layer.

---

# 8. COMPONENT ARCHITECTURE

The project contains React components including concepts such as:

- SessionProvider
- Shell
- MapBox
- RecordScreen
- NotificationBell
- ServiceWorker
- ConnectionStatus
- FileUploader

It also contains screen-level components including:

- HomeScreen
- MapExplorer
- ReportScreen
- TargetPanel
- NotificationScreen
- OptionsScreen

Before modifying a component, determine whether the requested behavior is actually used by the production UI.

---

# 9. API ARCHITECTURE

The project contains a substantial Next.js API layer.

Important API areas include:

/api/auth
/api/backup
/api/mobile
/api/records
/api/sync
/api/trips
/api/map
/api/tiles
/api/attachments
/api/messengers
/api/activity
/api/targets
/api/users
/api/settings
/api/options
/api/notifications

Important authentication endpoints include concepts such as:

/api/auth/login
/api/auth/logout
/api/auth/me
/api/auth/otp
/api/auth/forgot
/api/auth/check-username

Important synchronization endpoints include:

/api/sync/pull
/api/sync/push
/api/sync/run
/api/sync/status

Important mobile endpoints include:

/api/mobile/login-with-phone
/api/mobile/nonce

Do not change an API without inspecting all known callers and consumers.

---

# 10. SERVER.JS API

server.js also exposes application endpoints.

Known endpoints include:

/api/state
/api/backup
/api/health

The /api/state mechanism interacts with server-db.json.

This means the project contains both:

1. Legacy/server state storage mechanisms
2. Modern PostgreSQL/Drizzle database mechanisms

Do not assume that server-db.json is unused without tracing its consumers.

---

# 11. DATABASE

The modern database layer uses:

PostgreSQL
+
Drizzle ORM

The main schema is:

src/db/schema.ts

Database configuration is provided through Drizzle configuration.

The DB layer includes retry and transaction-related logic.

Do not bypass the existing DB abstraction without understanding why it exists.

---

# 12. IMPORTANT DATABASE ENTITIES

The current source indicates entities including:

- users
- roles
- settings
- options
- pharmacies
- doctors
- orders
- homes
- leaves
- trips
- tripPoints
- messengers
- notifications
- activityLogs
- attachments

There may be additional entities.

Do not assume this list is exhaustive.

When changing database structures, inspect:

- schema
- migrations
- queries
- API consumers
- backup/restore
- synchronization logic

---

# 13. AUTHENTICATION

The project contains a modern authentication API layer.

Known concepts include:

- login
- logout
- current session
- OTP
- forgot/reset functionality
- username checking

The public CRM UI also uses sessionStorage-based login state.

Therefore authentication exists across multiple architectural layers.

Do NOT replace authentication with a new system without explicit approval.

---

# 14. AUTHORIZATION

The project contains:

- users
- roles
- permissions
- role-related API functionality

The application has a significant permission system.

The exact final permission matrix is:

UNKNOWN / REQUIRES VERIFICATION

Do not invent or simplify permission behavior.

Before changing authorization:

1. Inspect role definitions.
2. Inspect permission checks.
3. Inspect API authorization.
4. Inspect frontend permission handling.
5. Inspect administrator functionality.

---

# 15. SYNCHRONIZATION

Synchronization is a major architectural feature.

Known environment/configuration concepts include:

- NODE_NAME
- SYNC_SECRET
- SYNC_PEERS
- SYNC_INTERVAL_MINUTES
- NEXT_PUBLIC_ENDPOINTS
- PUBLIC_BASE_URL
- MOBILE_APP_SECRET

Known synchronization endpoints include:

/api/sync/pull
/api/sync/push
/api/sync/run
/api/sync/status

There are also deployment/automation scripts that interact with synchronization endpoints.

IMPORTANT:

Synchronization must be treated as production-critical functionality.

Do not modify database schemas, IDs, timestamps, record structures, or APIs without analyzing synchronization implications.

---

# 16. PWA / OFFLINE

The project contains PWA/offline functionality.

Relevant concepts/files include:

- manifest.json
- manifest.webmanifest
- service worker
- service worker template
- offline session
- ServiceWorker React component
- diagnostics for offline/cache/queue state

Do not remove or replace Service Worker functionality without understanding:

- cache behavior
- offline behavior
- queued operations
- authentication/session behavior
- deployment behavior

---

# 17. MAP / GEOLOCATION

The application contains map/GPS functionality.

Relevant technologies/files include:

- Leaflet
- map components
- GeoJSON data
- map/tile API functionality
- location/trip related data

Relevant concepts include:

- Iran provinces
- facilities
- map explorer
- trips
- trip points
- live location

Do not replace the mapping system simply because another library may appear easier.

---

# 18. MOBILE APPLICATION

The repository contains a mobile application layer.

Important area:

mobile/

There are mobile authentication concepts including phone login and OTP/nonce-related functionality.

Do not remove or restructure mobile code without checking mobile API dependencies.

---

# 19. MESSAGING

The project contains messaging functionality.

Relevant concepts include:

- messengers
- messenger settings
- message logs
- notifications
- record sending

There is also Telegram/messaging-related functionality.

IMPORTANT:

Never expose, hard-code, or regenerate real production tokens or API secrets.

---

# 20. BACKUP / RESTORE

The project contains backup and restore functionality.

Backup/restore interacts with multiple application entities.

Because the database contains many interconnected entities, backup/restore must be treated as a critical subsystem.

Do not change entity names or schema relationships without checking backup/restore compatibility.

---

# 21. DEPLOYMENT

Production deployment uses Render.

The repository contains:

render.yaml

and deployment-related scripts/workflows.

Do not modify deployment configuration unless the requested task explicitly concerns deployment.

Before changing deployment:

1. Inspect build command.
2. Inspect start command.
3. Inspect environment variables.
4. Inspect health checks.
5. Inspect sync behavior.
6. Inspect current production behavior.

---

# 22. IMPORTANT ARCHITECTURAL CONTRADICTION

There is an apparent distinction between:

package.json:
    start -> node server.js

and:

scripts/start.mjs:
    Next.js start logic

and Render configuration:

    build -> npm run build
    start -> npm run start

This must NOT automatically be classified as a bug.

It is a historical/architectural fact that requires verification.

Do not "fix" this without tracing the production execution path first.

---

# 23. SOURCE OF TRUTH RULE

When sources disagree, use this priority:

1. Actual production behavior
2. Current source code used by production
3. Database/schema and migrations
4. API consumers and dependencies
5. Deployment configuration
6. Documentation
7. Historical comments

Do not blindly trust README files.

Do not blindly trust old documentation.

Do not blindly trust assumptions about which files are active.

Verify before modifying.

---

# 24. CODE CHANGE RULE

The project already contains working functionality.

The default strategy is:

SMALLEST SAFE CHANGE.

Do NOT:

- rewrite working modules
- refactor unrelated code
- replace architecture
- rename files unnecessarily
- delete old-looking files
- replace APIs unnecessarily
- replace libraries unnecessarily
- redesign database structures unnecessarily

Every change must be directly connected to the requested task.

---

# 25. DEPENDENCY RULE

Before changing any important file:

1. Read the file.
2. Search for its imports/usages.
3. Determine whether it is loaded dynamically.
4. Determine whether production uses it.
5. Determine whether another subsystem depends on it.
6. Check whether backup/sync/mobile/PWA depend on it.

Only then modify it.

---

# 26. DO NOT DELETE

Do not delete any of the following without explicit approval:

- server.js
- public/index.html
- crm-app.js
- crm-data.js
- crm-features-v9.js
- crm-features-v10.js
- crm-features-v11.js
- crm-features-v12.js
- crm-features-v13.js
- crm-features-v14.js
- crm-features-v15.js
- crm-features-v16.js
- crm-features-v17.js
- crm-features-v18.js
- src/db/*
- src/app/api/*
- mobile/*
- sync-related code
- service-worker code
- backup/restore code

---

# 27. SECURITY RULE

Never place real secrets in source code.

Potential sensitive values include:

- database URLs
- passwords
- API keys
- Telegram tokens
- sync secrets
- mobile secrets
- authentication secrets
- deployment credentials

If an existing repository contains a value that appears to be a real secret:

DO NOT publish it elsewhere.

DO NOT copy it into documentation.

Recommend rotation/revocation when appropriate.

---

# 28. CHANGE VERIFICATION

After modifying code:

1. Inspect git diff.
2. Verify only intended files changed.
3. Run relevant tests.
4. Run build/lint/type checks where applicable.
5. Verify API compatibility.
6. Verify database compatibility.
7. Verify sync compatibility if relevant.
8. Verify production UI path if relevant.

Never claim success without verification.

---

# 29. GIT SAFETY

Do not:

- reset the repository
- force push
- rewrite history
- delete branches
- revert unrelated commits
- overwrite production code

unless explicitly requested.

Before significant changes, inspect:

git status
git diff
git log

Prefer a separate branch for changes.

---

# 30. HISTORICAL CONTEXT

This project has evolved through multiple versions and multiple architectural layers.

Some implementation decisions were made during previous AI-assisted development sessions.

The complete historical reasoning from those conversations is not yet fully recovered.

Therefore:

UNKNOWN:
    Historical reasons behind some architectural decisions.

UNKNOWN:
    Why certain duplicate/parallel mechanisms were retained.

UNKNOWN:
    Which previous approaches were tried and rejected.

These items must NOT be invented.

They will be added to this document after the historical conversation is recovered or reconstructed.

---

# 31. CURRENT AUDIT STATUS

CONFIRMED FROM SOURCE:

- Hybrid architecture exists.
- server.js exists and is the current package start target.
- public/index.html is a critical active UI entry.
- crm-features-v9 through v18 are loaded.
- Next.js App Router exists.
- Next.js API routes exist.
- PostgreSQL/Drizzle exists.
- Mobile layer exists.
- PWA/offline layer exists.
- Sync layer exists.
- Map/GPS layer exists.
- Backup/restore exists.
- Messaging exists.

REQUIRES FURTHER VERIFICATION:

- Exact production runtime path on Render.
- Exact relationship between server.js APIs and Next.js APIs.
- Exact migration path from legacy state to PostgreSQL.
- Complete permission matrix.
- Complete synchronization conflict strategy.
- Historical reasons for architecture decisions.
- Which modules are still actively used by all production workflows.

---

# 32. CURRENT DEVELOPMENT RULE

The next AI agent must NOT start coding immediately.

First perform a READ-ONLY audit.

The agent must report:

1. Current runtime path
2. Current UI path
3. Backend/API path
4. Database path
5. Authentication path
6. Authorization path
7. Sync path
8. PWA/offline path
9. Mobile path
10. Map/GPS path
11. Backup/restore path
12. Messaging path
13. Relevant files for the requested task
14. Potential side effects
15. Any uncertainty

Then WAIT for approval before making changes.

---

---

# CURRENT DELIVERY STATE (2026-08-16)

App version 11.16.2 (user-verification fix pack on v20: grid combo cards,
uniform grey engine + combo lock, always-active order product section,
field-order mirror pharmacy→orders, header-docked change-password button,
duplicate false-positive fix with autosave signature suppression).
GitHub remote was found replaced by a single manual commit "پروژه اولیه"
(11.15.3); one-time repair script PUSH_FRESH_GITHUB.bat delivered
(unrelated-histories merge, his files win). GitLab token page disabled on
his account → token-free SSH method documented (RAHNAMA_GITLAB.txt);
SYNC_ALL skips gitlab gracefully. New last layer remains
crm-features-v20.js; knowledge graph PROJECT_GRAPH.md is read-first
(rule #66). Permanent rules: #62-#68.

# END OF AI PROJECT CONTEXT
## افزونه وضعیت نسخه ۱۱.۱۷.۰ (2026-08-17)
آخرین نسخه فعال 11.17.0 است. لایه نهایی v20 اکنون تثبیت جای فیلد، جایگذاری محلی سفارش، مدیریت وابسته نام‌ها، قفل محتوای پیام‌رسان، GPS/رصد تردد کامل، نسخه هدر و آدرس دقیق را پوشش می‌دهد. CI گیت‌هاب با معماری Node صفر-وابستگی هماهنگ شد.

## افزونه وضعیت نسخه ۱۱.۱۷.۱ (2026-08-17)
نسخه فعال 11.17.1 است. quantityValidated مرز داده سفارش جدید است؛ اقلام qty<=0 ذخیره نمی‌شوند. اشتراک پویا از ستون‌های فعلی ساخته می‌شود. مدیر نام‌های بزرگ فقط با جستجو کار می‌کند. v20 مالک نهایی نمایش افزودن‌ها، پاکسازی سفارش، نسخه فقط مدیر و اعمال تنظیمات کالا است.

## افزونه وضعیت نسخه ۱۱.۱۸.۰ (2026-08-17)
نسخه فعال 11.18.0 است. تب tab-snapp-corporate فقط مدیر/دسترسی صریح، بدون credential، گزارش‌ها را از CSV/XLSX وارد و در state.snappCorporate نگه می‌دارد. CAPTCHA هرگز خودکار حل نمی‌شود. موقعیت زنده اکنون حالت همه نمایندگان و textAddress کش‌شده دارد.

## افزونه وضعیت نسخه ۱۱.۱۹.۰ (2026-08-17)
نسخه فعال 11.19.0 است. اسنپ دو آرشیو rows/topups دارد که فقط prepend+dedupe می‌شوند و حذف UI ندارند؛ backup کل state را می‌گیرد. پیام‌رسان همه unified fields را با v20ShareOrder مرتب می‌کند. تارگت مالی از قیمت‌های product مشتق می‌شود.

## افزونه وضعیت نسخه ۱۱.۲۰.۰ (2026-08-17)
نسخه فعال 11.20.0 است. schema سفر و شارژ اسنپ صریح است؛ نمایندگان از users غیرمدیر می‌آیند. email backup endpoint به Resend متصل است ولی بدون env عمداً 503 می‌دهد. جزئیات سفارش و share متن یک منبع دارند.
## افزونه وضعیت نسخه ۱۱.۲۰.۱
نسخه فعال 11.20.1 است. orderFixedBlock مستقل از share selection است. فیلترهای تاریخ اسنپ خالی‌اند و topup amount باید >0 باشد. formatVisibleNumbers اعداد دیداری غیرشناسه‌ای را گروه‌بندی می‌کند.
## افزونه وضعیت نسخه ۱۱.۲۰.۲
نسخه فعال 11.20.2 است. loadState غنی‌ترین کاندیدای سالم را انتخاب می‌کند و هیچ sample data به state موجود تزریق نمی‌کند. rolling backup محلی و server state sync فعال‌اند. کلیدهای اسنپ در v20SnappActionBar منتقل می‌شوند.
## افزونه وضعیت نسخه ۱۱.۲۰.۳
نسخه فعال 11.20.3 است. بازیابی record arrays و custom fields از همه snapshotها union است؛ layout object کامل‌تر حفظ می‌شود. mergeStateWithoutLoss برای remote نیز استفاده می‌شود.
## افزونه وضعیت نسخه ۱۱.۲۰.۴
نسخه فعال 11.20.4 است. mobile CSS در v20 زیر 768px hamburger-only است. Snapp mode checkboxها year/month/range انحصاری‌اند. historical recovery فقط یک‌بار اجرا و layout جاری حفظ می‌شود.
## افزونه وضعیت نسخه ۱۱.۲۰.۵
نسخه فعال 11.20.5 است. settings/layout از آخرین pre-11.20.4 snapshot یک‌بار restore و داده آن re-merge می‌شود. سپس markerها هر تغییر خودکار آتی را منع می‌کنند.
## افزونه وضعیت نسخه ۱۱.۲۱.۰
نسخه فعال 11.21.0 است. npm test شامل ۸ تست Node و در CI gate است. دو تب distributor اضافه شده؛ state.distributorCompanies pharmacyRows را append/dedupe و inventoryRows را replace می‌کند. گزارش‌ها ۱۵ metric و Excel پنج worksheet دارند.
## افزونه وضعیت نسخه ۱۱.۲۱.۱
نسخه فعال 11.21.1 است. tab-distributor-database مالک viewerهاست. Daya explicit schema: date13, invoice12, qty4, dist3, ph7, gift2 (zero-based), inventory qty2. Report has 19 columns. Product CRUD final override is v20.
## افزونه وضعیت نسخه ۱۱.۲۱.۲
نسخه فعال 11.21.2 است. Excel bulk data در IndexedDB crmBulkData/kv:bulk-v1 است؛ local/server state سبک است. Products دارای code و dayaDbCode=1111000+code هستند. Daya code column index15 canonical source است.
## افزونه وضعیت نسخه ۱۱.۲۱.۳
نسخه فعال 11.21.3 است. CRM_APP_STATE_V2 تنها مرجع خودکار است. backup/history/remote هیچ‌گاه خودکار merge یا restore نمی‌شوند. Server sync فقط POST metadata است. IndexedDB bulk current جداگانه hydrate می‌شود.
## افزونه وضعیت نسخه ۱۱.۲۱.۴
نسخه فعال 11.21.4 است. Snapp import از button IDs و robust input onchange استفاده می‌کند. distLastDate آخرین سطر معتبر و Daya column14 است. distributorFilterGrid در desktop 5 columns است.
## افزونه وضعیت نسخه ۱۱.۲۱.۵
نسخه فعال 11.21.5 است. reliableFeatureBoot و synchronous handlers race قبل loadState را رفع می‌کنند. raw DB viewers contenteditable و saveBulkVault-backed هستند. DOM runtime test با jsdom اتصال import handlers و distributor render را تأیید کرد.
## افزونه وضعیت نسخه ۱۱.۲۱.۶
نسخه فعال 11.21.6 است. normalizeStoredRow migration برای legacy Snapp rows اجباری است و قبل rowSignature/header/date اجرا می‌شود. DOM test با object/cells rows صفر runtime error داد.
## افزونه وضعیت نسخه ۱۱.۲۱.۷
نسخه فعال 11.21.7 است. تاریخ پخش فقط slashOnlyPersianDate است و Excel serial را تبدیل نمی‌کند. distributorFilterGrid در desktop >=769 flex nowrap است.
## افزونه وضعیت نسخه ۱۱.۲۱.۸
نسخه فعال 11.21.8 است. Daya exact zero-based map: qty4 gift3 ret7 retGift6 customer21 invoice12 date13 code15 inventoryQty2. All Daya rials derive master prices. metricRows carries global unique set counts for totals.
## افزونه وضعیت نسخه ۱۱.۲۱.۹
نسخه فعال 11.21.9 است. alignDistributorHeaders fixes Daya inventory one-cell header offset without shifting data. Obsolete local backups are removed/no-op. metricRows follows state.products order and workbook mirrors it.
## افزونه وضعیت نسخه ۱۱.۲۲.۰
نسخه فعال 11.22.0 است. Daya inventory exact headers: موجودی, نام کالا, کد کالا. User sample order maps qty2/product6/code7. Generic کالا regex no longer matches کالای در راه first.
## افزونه وضعیت نسخه ۱۱.۲۲.۱
نسخه فعال 11.22.1 است. Global DOM numbers are Latin. Excel has bordered styles, Number grouping and PercentText. All data headers sticky. Address textareas guarded; GPS no fake fallback. List order uses getUnifiedFieldList(paneId).
## افزونه وضعیت نسخه ۱۱.۲۲.۲
نسخه فعال 11.22.2 است. Address ordering is country-first with postcode label. CRM_DOM_FIELD_ORDER_LOCK_V1 preserves actual core form order. Shafaarad exact zero-based map: date6 invoice5 qty7 ret9 customer3; inventory derived qty index9 = index5+index7.
## افزونه وضعیت نسخه ۱۱.۲۲.۳
نسخه فعال 11.22.3 است. Shafa code mapping is code-first including 1005→1391911006 and 1006→1391911005. Table headers gray/black. Excel totals red. Fixed grid/list observers defend against late legacy mutations.
## افزونه وضعیت نسخه ۱۱.۲۳.۰
نسخه فعال 11.23.0 است. Runtime server snapshot path is gitignored user-data.json. Permission templates live settings.permissionLevelTemplates. User edit is update with userEditId. safeOrderFields controls atomic form/list order.
## افزونه وضعیت نسخه ۱۱.۲۴.۰
نسخه فعال 11.24.0 است. قالب‌بندی عدد incremental است و رندر تنظیمات کالا از saveهای عمومی/GPS جدا شد. ثبت کاربر نمای فعال را فوری refresh می‌کند. سرستون UI/Excel آبی آسمانی با متن مشکی است؛ spacer فریز مخفی است. SpreadsheetML Default بدون border است. GPS بهترین نقطه را تا 30 ثانیه با هدف <=10m انتخاب می‌کند و اجزای ریز آدرس را نگه می‌دارد.
## افزونه وضعیت نسخه ۱۱.۲۴.۱
نسخه فعال 11.24.1 است. Shafa map اصلاحی: 1001→1391911001، 1002→1391911002، 1003→1391911003، 1004→1391911004، 1005→1391911006، 1006→1391911005، 1007→1391902006. ensureProductCodes مقادیر قدیمی را جایگزین می‌کند. Daya/Shafa unknown rows حذف می‌شوند. badge نسخه از query فایل v20 خوانده می‌شود.
## قانون تحویل نوبت ۴۴
در پایان هر چت، فایل ZIP کامل آخرین نسخه باید با present_file کنار صفحه نمایش داده شود و دستورات آماده PowerShell نیز در پاسخ نوشته شود.
## افزونه وضعیت نسخه ۱۱.۲۵.۰
نسخه فعال 11.25.0 است. تب tab-distributor-invoice-status سفارش‌ها را با گروه فاکتورهای pharmacyRows چهار پخش تطبیق می‌دهد. شرط‌ها: نام fuzzy token/substring، استان، شهر، منطقه و invoice day در order day ±3. جزئیات بر اساس canonical product، qty و gift را تجمیع می‌کند. نتیجه پایه در invoiceStatusBaseCache نگه داشته می‌شود و فیلترهای نماینده/سال/ماه/بازه/search روی cache کار می‌کنند.
## افزونه وضعیت نسخه ۱۱.۲۶.۰
نسخه فعال 11.26.0 است. `settings.globalFieldOptions` منبع واحد گزینه‌های semantic label است و hidden optionها مانع بازگشت حذف‌ها می‌شوند. DOM/customFields هم‌نام با add/edit/delete یکپارچه می‌شوند. قفل DOM تمام `.tab-pane .form-grid`ها را پوشش می‌دهد. invoice-status display برگشت‌پذیر و permission آن backward-compatible است. SW از `/sw.js?v=11.26.0` با updateViaCache none، ready، skipWaiting و claim فعال می‌شود.
## افزونه وضعیت نسخه ۱۱.۲۷.۰
نسخه فعال 11.27.0 است. `applyFullFormLayout` از زمان parse نهایی با `__CRM_MANAGER_LAYOUT_INTENT` مهار می‌شود و فقط کنترل‌های مدیر آن را برای 800ms مجاز می‌کنند. `CRM_MANAGER_GRID_ORDER_V2` فقط با اقدام مدیر ذخیره می‌شود؛ capture startup/observer/beforeunload حذف است. مجوز invoice-status یک‌بار برای کاربران موجود true می‌شود. نمای نهایی PERMISSION_GROUPS دقیقاً 28 نام تب دارد. bindUserCrudV27/saveUserV27 مسیر نهایی ذخیره و ویرایش کاربر است. preset bar idempotent و gray labels ثابت هستند.
## افزونه وضعیت نسخه ۱۱.۲۸.۰
نسخه فعال 11.28.0 است. Login اکنون crmUserId/name/username/role را ذخیره می‌کند؛ v20CurrentUser ابتدا ID را حل می‌کند. TAB_PERMISSION_MAP همه 28 تب و FEATURE_PERMISSION_MAP کنترل‌های اصلی را پوشش می‌دهد؛ applyCentralPermissions برنده نهایی و observer-backed است. legacy CRM_DOM_FIELD_ORDER_LOCK_V1 دیگر خوانده نمی‌شود و سه layout entry point فقط با manager intent اجرا می‌شوند. Overlayها z-index 10040 دارند. GPS target 10m، timeout 15s و addressPromise موازی دارد.
## افزونه وضعیت نسخه ۱۱.۲۹.۰
نسخه فعال 11.29.0 است. v11 دیگر tab-distributor-invoice-status را hide نمی‌کند؛ central engine تنها مرجع و invoiceStatusPermissionV1129 مهاجرت تازه است. installLatinNumberLaw در مسیر synchronous اجرا می‌شود و Number/Date locale output را English-digit می‌کند. formatVisibleNumbers اکنون OPTION، placeholder و title را نیز پوشش می‌دهد. jalaliMonthName در periodRows نام ماه فارسی را برای Excel برمی‌گرداند.
## افزونه وضعیت نسخه ۱۱.۳۰.۰
نسخه فعال 11.30.0 است. invoice tab pinned است؛ deny فقط card را با notice جایگزین می‌کند و V1130 migration دارد. Mobile CSS تا 950px و landscape دو ستونه است. route URLها: nshn.ir/maps destination lat,lng؛ Balad directions destination lng,lat؛ Google dir؛ Waze navigate. v9 privacy با repId/repName و explicit all-reps است. origin خالی از `/api/state` bootstrap می‌شود و existing local هرگز overwrite نمی‌شود. bulk data با `/api/bulk` و user-bulk-data.json روی CRM_DATA_DIR یا /var/data mirror می‌شود.
## افزونه وضعیت نسخه ۱۱.۳۱.۰
نسخه فعال 11.31.0 است. Head boot با CRM_ASSET_BUILD قبل از render cache storage و SW قدیمی را پاک و یک‌بار query reload می‌کند، بدون دست‌زدن به CRM data. crm-booting تا applyCentralPermissions مانع admin flash است. Server/SW no-store assets دارند. Mobile order row چهارستونه و delete 40px، clear max130px، hamburger 44px است. Android intents package-specific هستند. syncRepsFromUsers کاربران را مرجع roster می‌کند؛ syncRepresentativeSelectors privacy-aware است. User fields activityProvince/city/districts/routeLabel اضافه شده‌اند.
## افزونه وضعیت نسخه ۱۱.۳۲.۰
نسخه فعال 11.32.0 است. Server headers شامل CSP، Permissions-Policy، HSTS، nosniff، COOP/CORP و no wildcard CORS است. POST API به trustedWriteRequest و X-CRM-Request نیاز دارد. sanitizeJsonValue/writeJsonAtomic/readJsonSafe از pollution/corruption محافظت می‌کنند و files mode0600 هستند. installSafeBrowserGuards پروتکل، upload type/32MB، executable/drop/opener و text controls را محدود می‌کند. Excel generic export formula-safe و distributor URL HTTPS-only است. Security status card در troubleshooting وجود دارد.
## افزونه وضعیت نسخه ۱۱.۳۳.۰
نسخه فعال 11.33.0 است. order-item-name readonly و بدون list است. bindOrderItemRuntime input delegation جمع‌ها را فوراً محاسبه و applyOrderItemRoleControls total را visible و edit/delete را manager-only می‌کند. bindPrivacyRenderers آرایه‌های activityLog/leaves/repRoutes/repHomes/salesTargets و monthly reps/visits/orders را موقتاً owner-filter می‌کند؛ v20 routes/targets نیز privacyList دارند.
## افزونه وضعیت نسخه ۱۱.۳۴.۰
نسخه فعال 11.34.0 است. representativeRoutesCard در بالای sales-targets، multi selects استاندارد و save arrays دارد. Route fields از users form حذف ولی schema user حفظ شده. setupTargetPlannerV34 فرم قدیمی را مخفی، rows ثابت products را با qty×master prices رسم و records دوره‌ای ذخیره می‌کند. renderTargetReportsV34 all-product aggregate + per-rep cards دارد. Leave malformed form تعمیر، rep home edit/delete اضافه، comboAllowsAdd مرجع‌ها را منع و bindPlacedPharmacyNoticeGuard پیام قدیمی را پس از fill پنهان نگه می‌دارد.
## افزونه وضعیت نسخه ۱۱.۳۵.۰
نسخه فعال 11.35.0 است. AI_ACCEPTANCE_CHECKLIST برای درخواست چندبخشی اجباری است. Runtime JSDOM نشان داد MENU_SECTIONS_LIST فاقد invoice بود؛ اکنون 28 tab canonical دارد. Notification V35 recipient permission، thread reply/history و Web Push VAPID/aes128gcm دارد. Server paths push-subscriptions.json/push-vapid.json روی runtime disk هستند. SW push/showNotification/click دارد. bindPlacedPharmacyNoticeGuard idempotent شد. v35-fixed-rep select تک‌گزینه disabled و ساده است.

## افزونه وضعیت نسخه ۱۱.۳۶.۰
نسخه فعال 11.36.0 است. فرم سفارش reset-safe است: sequence همه form-groupها با fallback به id خود group و تنظیمات order موقتاً snapshot/restore می‌شوند؛ custom host دیگر به ابتدا نمی‌پرد. Duplicate notice پس از fill با hidden/aria/display-important و observer idempotent مخفی می‌ماند. setupRepresentativeRoutes در boot/tab/reliable اجرا می‌شود. Builtin technical labels با label مستقیم فارسی جایگزین می‌شوند. renderActivityLogV36 فقط کاربران فعال و برای نماینده فقط self را نمایش می‌دهد، بدون حذف تاریخچه canonical.

## افزونه وضعیت نسخه ۱۱.۳۷.۰
نسخه فعال 11.37.0 است. پیش از تغییر backup خصوصی state/bulk ثبت شد. Existing CRM_APP_STATE_V2 بدون پاک‌سازی authoritative است؛ فقط fresh origin از business sample users/data خالی می‌شود. User delete tombstone durable دارد و دو identity نمونه قدیمی u-2/Taheri و u-3/nila یک‌بار به tombstone مهاجرت می‌شوند. Order pharmacy cards delegated-select هستند. Route controls manager-pinned، builtin labels Persian-projected، rep homes table+map strict active/self privacy، leave fromTime/toTime مستقل، notification recipient plain select و combo caret delegated است.

## افزونه وضعیت نسخه ۱۱.۳۸.۰
نسخه فعال 11.38.0 است. `/cache-reset` با Clear-Site-Data cache، حذف CacheStorage/SW و unique redirect معادل hard reload خودکار است و هیچ CRM data/storage را حذف نمی‌کند. Index/login نسخه server health را no-store مقایسه می‌کنند. SW کد و navigation را network-only تازه می‌گیرد، cacheها را در install/activate purge و CRM_BUILD_ACTIVE broadcast می‌کند. نسخه آنلاین فقط پس از merge/deploy واقعاً تغییر می‌کند.

## وضعیت انتشار 11.38.0 در پایان نوبت ۵۹
Commit محلی `2c4fe0b` روی شاخه ثابت Arena ساخته شد. Push شاخه به GitHub به‌علت فقدان Workflows permission رد شد؛ Create Ref API نیز با `Resource not accessible by integration (403)` رد شد. فقط remote origin وجود دارد و GitLab remote موجود نیست. تا reconnect GitHub و سپس push/PR/merge، production همچنان نسخه قبلی است؛ هیچ ادعای deploy نباید شود.

## نقطه شروع چت بعدی — نوبت ۶۰
مرجع عملیاتی جدید `GITHUB_REVIEW_HANDOFF.md` است. هوش مصنوعی بعدی باید اول PROJECT_GRAPH و سپس این فایل را بخواند. آخرین commit محلی پیش از مستندسازی `4984d17` است؛ GitHub remote فقط main دارد، push/PR هنوز به‌علت permission انجام نشده، GitLab remote نیست و production در آخرین بررسی 11.20.0 است. نسخه سورس 11.38.0 و 57 تست موفق‌اند. نخستین اقدام پس از reconnect GitHub باید push همان شاخه ثابت، PR به main، check/merge و سپس production health باشد.

## نقطه شروع چت بعدی — نوبت ۶۱ (2026-08-22)
انتشار `11.38.0` تأییدشده است: مخزن فعال `javadalamdarmehraeen-rgb/javad-test1`، شاخه جلسه `arena/01a0262d-javad-test1` push شد، main خودش `f541301` یعنی سورس کامل 11.38.0 است (PR لازم نبود؛ صفر تفاوت)، workflow checks موفق‌اند و production فعال کاربر `https://javad-test1.onrender.com` دو بار مستقل نسخه `11.38.0` را سرو کرد؛ `/panel` redirect زنده `/login?build=11.38.0&__crm_reload=...` را نشان داد که اثبات عملی موتور cache rescue است. سرویس قدیمی `namayandeelmi-javad.onrender.com` هنوز `11.20.0` است و مرجع نیست. ممیزی ۲۰ چت اخیر (نوبت ۴۱–۶۰) با ۲۲ نشانگر کد + ۵۸/۵۸ تست نشان داد هیچ پرامپت معلق کدی نمانده؛ نسخه برنامه بدون تغییر واقعی bump نمی‌شود. قانون دائمی ۹۱: در هر چت همه ۱۵ فایل آرشیوی به‌روز شوند و ZIP کنار صفحه بیاید. تنها حلقه باز: تأیید مستقل GitLab mirror.

## نقطه شروع چت بعدی — نوبت ۶۲ (2026-08-22)
قانون ۹۲ فعال است: هر پرامپت بند‌به‌بند اجرا و راستی‌آزمایی می‌شود و قبل از ZIP، ورود خودکار به برنامه (سرور واقعی + app-smoke) اجباری است؛ پایان هر چت بلوک دستور git با شماره نسخه تحویل می‌شود. راستی‌آزمایی نوبت ۶۲ نشان داد همه بندهای پرامپت بلند کاربر (اعلان/پاسخ/Push/سفارشات/فعالیت/منزل/مرخصی/فلش‌ها/labelها) در 11.23.0–11.38.0 حاضرند؛ نسخه برنامه 11.38.0 ماند. تولید فعال همان javad-test1.onrender.com است. شواهد خط‌به‌خط در AI_ACCEPTANCE_CHECKLIST نوبت ۶۲.

## نقطه شروع چت بعدی — نوبت ۶۴ (2026-08-22)
نسخه سورس 11.38.1: تمام ردهای دامنه قدیمی در کد/کانفیگ (۱۰ فایل، از جمله keep_alive، deploy sync، .gitlab-ci، render.yaml، موبایل، crm-data/crm-app) به https://javad-test1.onrender.com تبدیل شد و صفر رد باقی ماند. سرویس قدیمی فقط در اسناد تاریخی هست. production فعلی 11.38.0 است و با push کاربر 11.38.1 دیپلوی می‌شود. جلسه GitHub بعد از merge بسته است؛ تحویل با ZIP + بلوک دستور پایان چت است. اثبات زنده کد 11.38 روی سرویس: /api/push/public-key و /cache-reset فعال‌اند.

## نقطه شروع چت بعدی — نوبت ۶۵ (2026-08-22)
نسخه سورس 11.39.0: فرم سفارشات با ترتیب کانونی «تاریخ → داروخانه → استان → شهر → منطقه» و مهاجرت یک‌باره v39OrdersCanonicalReset؛ apiEndpointUrl/متن عیب‌یابی/API_BASE موبایل داینامیک (location-origin + override)؛ keep-alive روی سرویس فعال؛ حجم دارایی‌ها 327KB gzip؛ تارگت per-product و قانون اعداد لاتین با سند کد تأیید. 59/59 تست + app-smoke 4/4. تا push کاربر production عقب‌تر است؛ health ملاک است.

## نقطه شروع چت بعدی — نوبت ۶۷ (2026-08-22)
نسخه 11.40.0: حذف دائمی هویت‌های مدیریت‌حذف‌شده از همه لیست‌ها، گیرندگان اعلان نقش‌آگاه، کلیک سه‌مسیره داروخانه با بازخورد، محافظ افزودن فیلدهای مرجع برای غیرمدیر. 60/60 تست + app-smoke 4/4. production تا push کاربر 11.38.1 است. تشخیص‌ها و شواهد در GITHUB_REVIEW_HANDOFF نوبت ۶۷.


نسخه جاری برنامه: 11.68.0 (نوبت ۸۸). ویرایش/حذف پایدار تارگت‌ها؛ فاصله میلی‌متری و شماره سطر فیلد در طراح ستون‌ها.

## 11.69.0 / نوبت ۸۹
سرور منبع حقیقت است؛ حذف با _deletedIds روی ادغام اعمال می‌شود؛ رکوردهای هم‌نام ادغام می‌شوند؛ poll سبک ۲۵ثانیه؛ ویرایش/حذف تارگت و فاصله/سطر زنده.

## 11.70.0 / نوبت ۹۰
حلقه cache-reset قطع شد. سرور فقط اطلاعات همین دستگاه را نگه می‌دارد (_soloOnly / replace).

## 11.71.0 / نوبت ۹۱
اسکریپت یک‌بار؛ ۴۰۴ بدون login.html؛ سرور فقط داده همین دستگاه.

## 11.72.0 / نوبت ۹۲
نسخه جاری برنامه: 11.72.0. بوت سرور‌اول، حذف فلش تعداد، عملیات تارگت روی هر سطر، تارگت پخش با محقق‌شده/مانده.

## 11.73.0 / نوبت ۹۳
نسخه جاری برنامه: 11.73.0. یک state زنده، پرده تا adopt سرور، عملیات تارگت پایدار، ذخیره تارگت پخش با تطبیق ماه.

## 11.74.0 / نوبت ۹۴
نسخه جاری برنامه: 11.74.0. گزارش فروش مشاطب با ستون‌های ۱۱/۱۲/۱۰ و کدهای ۱۸۶۱۰۱ تا ۱۸۶۱۰۷.

## 11.75.0 / نوبت ۹۵
نسخه جاری برنامه: 11.75.0. طراح ستون‌ها زنده، جغرافیا بدون Autofill، دیتابیس پخش با ویرایش/حذف، تاریخ مشاطب ستون ۳.

## 11.80.0
ملاک فقط سرور؛ قفل ورود داده نسخه قبلی؛ مصرف‌کننده جدید = فعلی × (۱+افزایش).

## 11.81.0
پاکسازی قطعی داده سیستم قبلی؛ ملاک فقط سرور نسل ۱۱.۸۱؛ مصرف‌کننده جدید = فعلی × افزایش.

## 11.82.0
اعمال قطعی شماره ترتیب و اندازه طراح ستون‌ها روی فرم/لیست واقعی.

## 11.83.0
توقف پرش تایپ در داروخانه/پزشک؛ کاشی نقشه از سرور؛ ورود پایدار موبایل ایران.
