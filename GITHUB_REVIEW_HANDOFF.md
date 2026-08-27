# GITHUB_REVIEW_HANDOFF — تحویل مویرگی برای بررسی GitHub و هوش مصنوعی بعدی

**تاریخ این تحویل:** 2026-08-27 / ۵ شهریور 1405 (به‌روزرسانی نوبت ۹۵)
**نسخه آماده سورس:** `11.84.0` (فایل واحد crm-bundle + آینه crm-features-v20)
**نسخه chat.arena پس از بازسازی این نوبت:** `1.85`
**شاخه اجباری این جلسه:** `arena/01a03a45-javad-test1`
**مخزن:** `javadalamdarmehraeen-rgb/javad-test1`
**Production فعال:** `https://javad-test1.onrender.com` — 11.38.0 سرو می‌کند؛ با push نسخه 11.38.1 توسط کاربر، Render دیپلوی می‌کند
**سرویس قدیمی (دیگر مرجع):** `https://namayandeelmi-javad.onrender.com` — هنوز `11.20.0`؛ از نوبت ۶۴ هیچ ردی از آن در کد/کانفیگ برنامه نیست

---

## 0) وضعیت نوبت ۶۱ — انتشار تأییدشده ✅

```text
Source tested:             yes — 58/58 تست، syntax همه JS، build، diff-check
Local commit:              f541301 (تنها commit این clone؛ تاریخ مخزن squashed است)
GitHub branch pushed:      yes — arena/01a0262d-javad-test1 → origin (2026-08-21)
Pull Request:              لازم نبود — نوک شاخه == نوک main (سورس از قبل merged بود)؛ GitHub: «No commits between»
Main merged:               بله — main خودش f541301 یعنی سورس کامل 11.38.0 است
GitHub checks:             pass — «Build & Mirror & Deploy» روی f541301 تکمیل موفق (build+test)
GitLab mirrored:           unknown — لاگ خام روی Azure Blob از sandbox در دسترس نیست
Render deployed:           yes — javad-test1.onrender.com
Production health version: 11.38.0 — دو اندازه‌گیری مستقل 2026-08-21T21:24:15Z
Browser cache rescue:      verified — /panel → /login?build=11.38.0&__crm_reload=... (redirect زنده)
```

نکته کلیدی مجوزها: push شاخه وقتی رد می‌شود که کامیت‌های آن حاوی تغییر
`.github/workflows/*` باشند (پیام «refusing to allow a GitHub App … without workflows
permission»). push کامیت بدون تغییر workflow موفق است. `gh api` REST همچنان برای
بیشتر endpointها 403 می‌دهد؛ خواندن مخزن و actions runs مجاز است.

نکته تحویل ZIP (بازتأیید نوبت ۸۶): پنل پیش‌نمایش Arena محتوای ZIP را سفید/باینری
یا «فرمت دیگر» نشان می‌دهد (نوبت‌های ۳/۴۶/۸۶). کانال تحویل قطعی قانون ۶۴+۹۳ است:
سرور دانلود زنده پورت 8000 صفحه فارسی + ZIP استاندارد ویندوز (PKZIP، create_system=0)
با `Content-Disposition: attachment`؛ لینک مستقیم: `…:8000/zip` یا
`…:8000/namayandeelmi-v11.66.0.zip`.

وضعیت نوبت ۶۲: قانون ۹۲ (اجرای جزبه‌جز + ورود خودکار به برنامه قبل از ZIP +
بلوک دستور پایان چت) ثبت شد؛ هر ۲۱ بند پرامپت بلند کاربر در 11.23.0–11.38.0
راستی‌آزمایی و در AI_ACCEPTANCE_CHECKLIST ثبت شد؛ هیچ تغییر کدی لازم نبود و
نسخه برنامه 11.38.0 ماند.

---

## 1) حقیقت تاریخی نوبت‌های ۵۹–۶۰ (پیش از انتشار؛ برای درک خطاها نگه داشته شد)

1. سورس نسخه `11.38.0` در workspace کامل، تست‌شده و commit شده بود.
2. زنجیره commit محلی آن جلسه (مخزن قبلی):
   - `4984d17` — Prepare tested GitHub deploy and GitLab mirror workflow
   - `1d4f37f` — Record cache rescue validation and blocked publish status
   - `2c4fe0b` — Release 11.38.0 with automatic cache rescue and CRM fixes
3. در آن جلسه push شاخه Arena رد شد:
   ```text
   refusing to allow a GitHub App to create or update workflow
   .github/workflows/deploy.yml without workflows permission
   ```
4. ساخت ref با `gh api` هم رد شد: `Resource not accessible by integration (HTTP 403)`.
5. هیچ remote به نام `gitlab` در sandbox وجود ندارد. GitLab فقط از workflow و secrets زیر قابل mirror است:
   - `GITLAB_REPO_URL`
   - `GITLAB_TOKEN`
6. production آن زمان (سرویس قدیمی namayandeelmi-javad) هنوز `11.20.0` بود.
7. در نوبت ۶۱ این وضعیت‌ها دوباره اندازه‌گیری و رفع شدند: push موفق، main از قبل
   حامل 11.38.0 بود و production فعال کاربر (`javad-test1.onrender.com`) نسخه
   `11.38.0` را سرو کرد. تنها حلقه باز: تأیید مستقل GitLab mirror.

---

## 2) اولین کار هوش مصنوعی بعدی

به ترتیب و بدون تغییر شاخه:

1. `PROJECT_GRAPH.md` را بخوان.
2. همین فایل را بخوان.
3. `AI_ACCEPTANCE_CHECKLIST.md` بخش نوبت 59 را بخوان.
4. وضعیت اتصال را بررسی کن:
   ```bash
   gh auth status
   git branch --show-current
   git status --short
   git ls-remote --heads origin
   ```
5. اگر GitHub reconnect شده بود، فقط شاخه اجباری همان جلسه را push کن (در نوبت ۶۱: `arena/01a0262d-javad-test1`):
   ```bash
   git push -u origin arena/01a0262d-javad-test1
   ```
6. Pull Request از همین شاخه به `main` بساز؛ شاخه دیگری نساز.
7. تست‌ها و checkهای PR را بررسی کن.
8. بعد از merge، workflow، GitLab mirror، Render deploy و production health را جداگانه تأیید کن.
9. تا `/api/health` نسخه `11.38.0` را نشان نداده، به کاربر نگو انتشار موفق بوده است.

### عنوان پیشنهادی Pull Request

```text
Release 11.38.0: automatic cache rescue, data preservation and CRM fixes
```

### متن پیشنهادی Pull Request

```text
- Add server-truth automatic cache rescue without clearing CRM data
- Force network-fresh HTML/JS/CSS and purge stale service workers
- Preserve localStorage, IndexedDB, custom fields and layout metadata
- Fix order pharmacy picker/reset/layout regressions
- Pin representative route fields and Persian builtin labels
- Enforce active-user/self-only activity and representative-home privacy
- Add hourly leave from/to fields and plain notification recipient select
- Add 58 regression tests and browser-like runtime validation
```

---

## 3) علت اصلی اینکه کاربر تغییرات را نمی‌دید

مشکل فقط cache نبود. دو لایه هم‌زمان وجود داشت:

1. تغییرات نسخه‌های 11.35 تا 11.38 در sandbox/ZIP بودند و ابتدا commit/push نشده بودند.
2. Render از `main` قدیمی استفاده می‌کند و production هنوز `11.20.0` است.

پس حتی بهترین پاک‌سازی cache نمی‌تواند کدی را که هنوز deploy نشده دریافت کند. ترتیب صحیح:

```text
local tested source
→ commit
→ push Arena branch
→ Pull Request
→ merge main
→ CI
→ GitLab mirror (اگر secrets موجود باشد)
→ Render deploy
→ production /api/health = 11.38.0
→ browser cache rescue
```

---

## 4) موتور پاک‌سازی خودکار کش نسخه 11.38.0

### 4.1 سرور — `server.js`

- مرجع نسخه:
  ```js
  const APP_VERSION = "11.38.0";
  ```
- `sendFile()` روی HTML این هدرها را می‌فرستد:
  ```http
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  CDN-Cache-Control: no-store
  Surrogate-Control: no-store
  Clear-Site-Data: "cache"
  X-CRM-Build: 11.38.0
  ```
- `sw.js` با `no-store` و `Service-Worker-Allowed: /` ارسال می‌شود.
- `/api/health` با `no-store` و `X-CRM-Build` نسخه واقعی سرور را می‌دهد.
- endpoint جدید:
  ```text
  GET /cache-reset?to=/panel
  ```
- کارهای `/cache-reset`:
  1. مقدار build را ثبت می‌کند.
  2. فقط CacheStorage را حذف می‌کند.
  3. Service Workerهای قدیمی را unregister می‌کند.
  4. با `__crm_build` و `__crm_reload=timestamp` به مقصد برمی‌گردد.
- این endpoint هرگز `localStorage.clear()`، حذف `CRM_APP_STATE_V2` یا حذف IndexedDB ندارد.

### 4.2 گیت قبل از نمایش — `public/index.html`

- build محلی `11.38.0` است.
- اگر build ذخیره‌شده متفاوت باشد، به `/cache-reset` می‌رود.
- حتی اگر HTML قدیمی و LocalStorage قدیمی با هم برابر باشند، درخواست زیر نسخه واقعی سرور را می‌خواند:
  ```js
  fetch("/api/health?__crm_nocache=" + Date.now(), { cache: "no-store" })
  ```
- اختلاف نسخه server و HTML دوباره `/cache-reset` را فعال می‌کند.
- `crm-booting` مانع flash صفحه مدیر پیش از permission engine است.

### 4.3 صفحه ورود — `public/login.html`

- همان server-health comparison و cache-reset را اجرا می‌کند.
- login دیگر نباید یک جزیره cache‌شده جدا از panel باشد.

### 4.4 Service Worker — `public/sw.js`

- install:
  - حذف تمام cacheها
  - `skipWaiting`
- activate:
  - حذف تمام cacheها
  - `clients.claim`
  - broadcast پیام:
    ```js
    { type: "CRM_BUILD_ACTIVE", build: "11.38.0" }
    ```
- navigation، HTML، JS، CSS، JSON و manifest:
  - فقط network fresh با `reload/no-store`
  - هیچ fallback به کد قدیمی ندارد
- فقط image/font می‌تواند cache fallback داشته باشد.
- در نبود اینترنت، به‌جای نسخه stale صفحه «اینترنت را وصل کنید / تلاش دوباره» می‌دهد.
- push notification و notificationclick نسخه 11.35 حفظ شده‌اند.

### 4.5 شنونده build — `public/crm-app.js`

- `CRM_BUILD_ACTIVE` را می‌شنود.
- در mismatch، خودکار `/cache-reset` را باز می‌کند.
- registration:
  ```js
  /sw.js?v=11.38.0
  updateViaCache: "none"
  ```

### 4.6 اثبات حفظ داده

Runtime اختصاصی cache rescue با sentinel نتیجه داد:

```json
{
  "sentinel":"KEEP-ME",
  "custom":1,
  "meta":1,
  "other":"KEEP-TOO",
  "cacheDeletes":2,
  "unregisters":2,
  "build":"11.38.0",
  "errors":[]
}
```

---

## 5) موتورهای پایداری داده

### 5.1 state اصلی

- کلید مرورگر: `CRM_APP_STATE_V2`
- state موجود authoritative است.
- backup قدیمی خودکار merge نمی‌شود.
- آرایه خالی حذف عمدی مدیر است و نباید با نمونه‌ها پر شود.
- server GET فقط برای origin کاملاً خالی bootstrap می‌شود.

### 5.2 داده حجیم Excel

- IndexedDB:
  - DB: `crmBulkData`
  - store: `kv`
  - key: `bulk-v1`
- mirror server:
  - `GET /api/bulk`
  - `POST /api/bulk`
  - runtime file: `user-bulk-data.json`
- این فایل و فایل‌های state/push نباید وارد Git یا ZIP شوند.

### 5.3 مسیر دیسک Render

- mount لازم: `/var/data`
- env لازم:
  ```text
  CRM_DATA_DIR=/var/data
  ```
- بدون Persistent Disk، داده سروری بعد redeploy ممکن است از بین برود.

### 5.4 فایل‌های ممنوع Git/ZIP

```text
.env واقعی
server-db.json
user-data.json
user-bulk-data.json
push-subscriptions.json
push-vapid.json
node_modules
*.zip
```

---

## 6) اصلاحات نهایی CRM در 11.36 و 11.37

### سفارشات

- `groupAnchor()` برای گروه بدون input به id خود گروه fallback می‌کند.
- `orderCustomFieldsContainer` دیگر هنگام reset به ابتدای فرم نمی‌پرد.
- reset سفارش snapshot موقت DOM sequence و layout metadata دارد.
- reset فقط مقدارها را پاک می‌کند؛ چیدمان/اندازه/ترتیب را تغییر نمی‌دهد.
- `bindOrderPharmacyCardV37` capture/delegated است؛ کارت‌های dynamic همیشه کلیک‌پذیرند.
- انتخاب کارت داروخانه matchedId، نام، استان، شهر، منطقه و آدرس را جایگذاری می‌کند.
- duplicate notice با hidden/aria-hidden/display none important به شکل idempotent پنهان می‌ماند.

### مسیر نمایندگان و تارگت

- `setupRepresentativeRoutes()` در init، tab activation و reliable boot اجرا می‌شود.
- `pinRepresentativeRouteFieldsV37()` مانع مخفی‌شدن کنترل‌های system-owned توسط metadata stale می‌شود.
- کنترل‌ها:
  - routeManagerRep
  - routeManagerProvince
  - routeManagerCity
  - routeManagerDistrict
  - btnSaveRepresentativeRoute
- target planner ماتریس ثابت کالا، نماینده/سال/ماه و قیمت‌های پخش/داروخانه دارد.

### label فارسی

- v11 label مستقیم form-group را حتی بدون `for` می‌خواند.
- `installPersianBuiltinLabelGuardV37()` label فنی builtin مانند `leaveRepSelect` را در خروجی unified field list با فارسی DOM/registry جایگزین می‌کند.
- metadata واقعی مدیر برای این اصلاح پاک نمی‌شود.

### کاربران حذف‌شده

- حذف کاربر tombstone با id/username/fullName ثبت می‌کند.
- tombstone در boot روی users/auth/reps/selectors اعمال می‌شود.
- fresh install دیگر کاربران نمونه نماینده را نمی‌سازد.
- نمونه‌های قدیمی شناخته‌شده u-2/Taheri و u-3/nila یک‌بار به tombstone مهاجرت می‌شوند.
- تاریخچه canonical حذف نمی‌شود؛ فقط از projection دیداری خارج می‌شود.

### فعالیت لحظه‌ای

- `renderActivityLogV36()` فقط کاربر فعال را نشان می‌دهد.
- مدیر: فعالیت کاربران فعال.
- هر nonmanager: فقط فعالیت خودش، حتی با permission قدیمی all-reps.
- activity map نیز همان visible projection را می‌گیرد.

### منزل نمایندگان

- `visibleRepHomesV37()` و `renderRepHomesV37()`:
  - مدیر: همه منزل‌های کاربران فعال
  - نماینده: فقط منزل خودش
- `paintRepHomesMapV37()` layerهای غیرمجاز را پاک و فقط markerهای visible را رسم می‌کند.
- رکورد جدید `repId` دارد.

### مرخصی

- دو فیلد مستقل:
  - `leaveFromTime`
  - `leaveToTime`
- schema جدید `fromTime/toTime` را ذخیره می‌کند.
- `leaveHoursInput` legacy hidden برای سازگاری باقی مانده است.

### اعلان و کشویی

- `msgRecipientSelect` plain select و `data-nocombo=1` است.
- گیرنده تایپی/free-add حذف شده است.
- فقط کاربران فعال در options هستند.
- caret تمام crm-comboها capture/delegated و دارای z-index/pointer target قطعی است.

---

## 7) Web Push و اعلان

- server helperها:
  - `getVapidKeys`
  - `encryptWebPush`
  - `vapidAuthorization`
  - `sendWebPush`
- endpointها:
  - `/api/push/public-key`
  - `/api/push/subscribe`
  - `/api/push/send`
- subscription/VAPID روی runtime disk نگهداری می‌شوند.
- Service Worker push/click حفظ شده است.
- صدا را وب‌اپ نمی‌تواند اجبار کند؛ OS/browser تصمیم می‌گیرد.

---

## 8) Workflow GitHub/GitLab/Render

فایل `.github/workflows/deploy.yml` آماده است و باید با GitHub connection دارای Workflow permission push شود.

### Build job

```text
npm ci
node --check public/*.js + server.js
npm test
npm run build
```

### GitLab mirror job

بعد از build و push main:

```text
git push gitlab --all --force
git push gitlab --tags --force
```

فقط وقتی secrets معتبر باشند.

### Deploy job

از secrets زیر استفاده می‌کند:

- `RENDER_DEPLOY_HOOK`
- `NDCOHUB_DEPLOY_HOOK`
- `SYNC_SECRET`

هیچ secret را در chat یا فایل commit نکن.

---

## 9) تست‌های اجباری

آخرین نتیجه: `58/58` موفق (شامل تست مستقل صحت handoff و وضعیت انتشار).

قبل از هر ZIP/merge:

```bash
npm test
for f in server.js public/*.js; do node --check "$f"; done
npm run build
git diff --check
```

HTTP:

```bash
curl /api/health
curl -I /panel
curl -I /sw.js
curl /cache-reset?to=/panel
```

باید دیده شود:

```text
version 11.38.0
X-CRM-Build: 11.38.0
Clear-Site-Data: "cache" روی HTML/cache-reset
Cache-Control: no-store
```

بعد از merge/deploy، production را مستقل بررسی کن:

```text
https://javad-test1.onrender.com/api/health?nocache=TIMESTAMP      ← production فعال (نوبت ۶۱)
https://namayandeelmi-javad.onrender.com/api/health?nocache=...    ← سرویس قدیمی (دیگر مرجع نیست)
```

---

## 10) ترتیب لود و نقاط حساس

ترتیب script را تغییر نده:

1. leaflet
2. crm-data
3. crm-app
4. v9
5. iran-facilities
6. v10
7. v11
8. v12
9. v13
10. jalali
11. v14
12. v15
13. v16
14. v17
15. v18
16. v19
17. v20

- v20 برنده نهایی overrideهاست.
- crm-app دو نسل فرم دارد.
- تغییر بزرگ جدید فقط در final layer انجام شود مگر علت دقیق نیاز به فایل پایه داشته باشد.
- `CRM_MANAGER_GRID_ORDER_V2` فقط snapshot صریح مدیر است.
- startup/observer حق capture خودکار layout ندارد.

---

## 11) فایل‌هایی که هوش مصنوعی بعدی باید به‌ترتیب بخواند

1. `PROJECT_GRAPH.md`
2. `GITHUB_REVIEW_HANDOFF.md`
3. `AI_ACCEPTANCE_CHECKLIST.md`
4. `AI_RULES.md`
5. `AI_PROJECT_CONTEXT.md`
6. `AI_ARCHITECTURE.md`
7. `AI_DECISION_LOG.md`
8. `AI_TASKS.md`
9. `ARENA_HANDOFF_PROMPT.md`
10. `CHANGES_V11.md`
11. `chat.arena` فقط برای متن کامل و سورس embedشده

---

## 12) خروجی مورد انتظار از هوش مصنوعی بعدی

گزارش را با این وضعیت‌های جدا بده:

```text
Source tested: yes/no
Local commit: hash
GitHub branch pushed: yes/no
Pull Request: URL یا blocked reason
Main merged: yes/no
GitHub checks: pass/fail/pending
GitLab mirrored: yes/no/secret missing
Render deployed: yes/no/pending
Production health version: exact version
Browser cache rescue: verified/pending user
```

نباید «همه‌چیز اوکی است» گفته شود مگر همه خطوط بالا وضعیت واقعی و قابل‌سنجش داشته باشند.

## تشخیص نوبت ۶۳ — «تغییرات اعمال نمی‌شود» = باز کردن سرویس قدیمی (2026-08-22T20:05Z)
- اندازه‌گیری هم‌زمان: `javad-test1.onrender.com` = **11.38.0** (همه تغییرات زنده)؛ `namayandeelmi-javad.onrender.com` = **11.20.0** (هیچ‌کدام از تغییرات 11.21+ آنجا نیست).
- کاربر دو سرویس Render موازی با ظاهر یکسان دارد؛ ورود از بوکمارک/آیکون PWA نصب‌شده قدیمی، سرویس قدیمی را باز می‌کند.
- نشان نسخه در هدر برنامه: `#v20VersionBadge` (عنوان «نسخه دقیق برنامه نصب‌شده»)؛ روی موبایل <=768px پنهان است — چک با `/api/health`.
- راهنمای کاربر: استفاده از دامنه جدید + یک‌بار `/cache-reset?to=/panel` + حذف PWA نصب‌شده قدیمی و نصب مجدد از دامنه جدید + تصمیم درباره سرویس قدیمی (suspend یا اتصال به مخزن javad-test1/main در Render Settings→Repository).
- GitLab فقط mirror است و در مسیر deploy سرویس javad-test1 نیست؛ Neon/PostgreSQL در runtime فعلی CRM استفاده نمی‌شود (فایل + مرورگر) — اسکلت Next.js خفته است.
- دسترسی من: جلسه GitHub بعد از merge بسته است (ولی GitHub سالم است — سرویس جدید از همان می‌خواند)؛ داشبورد Render/Neon بدون اکانت کاربر در دسترس نیست.

## نوبت ۶۴ — تبدیل دامنه قدیمی به javad-test1.onrender.com و ارتقا به 11.38.1 (2026-08-22)
- کاربر تصریح کرد: از `javad-test1.onrender.com` استفاده می‌کند، نشان نسخه 11.38.0 می‌بیند ولی «تغییرات را نمی‌بیند»؛ دستور داد هر رد دامنه قدیمی که در برنامه ثبت شده و خلل می‌کند را تبدیل کنم.
- ردهای تبدیل‌شده (10 فایل): `.github/workflows/deploy.yml` (sync)، `.github/workflows/keep_alive.yml` (بیدارباش سرویس فعال — قبلاً سرویس قدیمی را بیدار نگه می‌داشت!)، `.gitlab-ci.yml`، `render.yaml` (PUBLIC_BASE_URL/ENDPOINTS)، `mobile/src/simAuth.ts` (API_BASE)، `public/crm-data.js` (apiEndpointUrl)، `public/crm-app.js` (متن عیب‌یابی)، `src/lib/endpoints.ts`، `src/lib/sync-config.ts`، `src/proxy.ts`.
- صفر رد `namayandeelmi-javad.onrender.com` در کد/کانفیگ باقی ماند (فقط اسناد تاریخی).
- بررسی خلل واقعی: تمام فراخوانی‌های `/api/state` نسبی‌اند و چک same-origin سرور هاست درخواست را می‌سنجد؛ `apiEndpointUrl` فقط نمایشی/فال‌بک بود؛ خلل اصلی عملیاتی، keep_alive بود که سرویس فعال را خواب می‌گذاشت.
- ارتقای واقعی کد انجام شد → نسخه `11.38.1`: package.json/server.js/sw.js/index.html/login.html/crm-app.js (?v= و BUILD) + انتظارات تست نسخه.
- اثبات زنده کد 11.38 روی سرویس فعال (برای اطمینان کاربر): `/api/push/public-key` کلید برمی‌گرداند (فقط 11.35+)، `/cache-reset?to=/panel` صفحه نوسازی می‌دهد (فقط 11.38+)، نشان نسخه هدر 11.38.0 است.
- وضعیت انتشار: source tested 11.38.1 (58/58)؛ push از این جلسه ممکن نیست (بسته بعد از merge)؛ کاربر با بلوک دستور پایان چت push می‌کند → Render دیپلوی 11.38.1 → health باید 11.38.1 شود.

## نوبت ۶۵ — نسخه 11.39.0: ترتیب کانونی سفارشات، داینامیک شدن لینک/مخزن و کارایی (2026-08-22)
- کاربر پرامپت بلند را با ۵ بند جدید فرستاد؛ بندهای تکراری نوبت ۶۲ دوباره راستی‌آزمایی شدند (بدون تغییر).
- سفارشات: ترتیب کانونی جدید «تاریخ → نام داروخانه → استان → شهر → منطقه → …» در index.html اعمال و مهاجرت یک‌باره v39OrdersCanonicalReset ترتیب ذخیره‌شده به‌هم‌ریخته مدیر را با ترتیب کانونی جایگزین می‌کند (درخواست صریح مدیر؛ قانون ۲۷ حفظ شد — فقط همین یک‌بار و فقط فرم سفارشات).
- داینامیک شدن لینک/مخزن: apiEndpointUrl حالا از location.origin ساخته می‌شود (هر لینک Render جدید خودکار کار می‌کند)؛ متن عیب‌یابی هاست فعال را از location.host می‌گیرد؛ API_BASE موبایل با override ریپو/لینک فعال (globalThis.__CRM_API_BASE__) و fallback سرویس فعال.
- کارایی: علت اصلی «۱۰ دقیقه لود» خواب سرویس رایگان Render بود؛ اصلاح نوبت ۶۴ keep-alive را به سرویس فعال برد. کل دارایی‌ها ~۴.۱MB خام / ~۱MB gzip است و اسکریپت‌ها انتهای body اند؛ بعد از بیداری سرور، لود ثانیه‌ای است. برای اطمینان دائم UptimeRobot روی لینک فعال توصیه شد.
- اعداد انگلیسی: installLatinNumberLaw (v20) فعال است و تست دارد؛ تارگت به تفکیک کالا: ماتریس v34 (تعریف تارگت کالاها) موجود است — هر دو با سند کد تأیید شدند.
- نسخه 11.39.0: شش فایل نسخه + انتظارات تست همگام؛ تست جدید رگرسیون ترتیب/مهاجرت/داینامیک اضافه شد؛ 59/59 موفق؛ app-smoke سرور واقعی 4/4.
- پاسخ به «چرا هر نسخه تنظیمات عوض می‌شود»: قوانین ۸۷/۸۸/۲۷ مانع تغییر خودکار چیدمان/داده‌اند؛ تغییر این نوبت فقط با درخواست صریح خود کاربر و یک‌بار انجام شد.

## نوبت ۶۶ — بازخوانی همان پرامپت بلند؛ اندازه‌گیری production = 11.38.1 (2026-08-22T21:37Z)
- کاربر همان پرامپت نوبت ۶۵ را دوباره فرستاد؛ بند‌به‌بند با ۱۰ نشانگر کد + 59/59 تست دوباره تأیید شد؛ شکافی نبود.
- اندازه‌گیری زنده: production فعال `javad-test1.onrender.com` = **11.38.1** → یعنی push کاربر برای نوبت ۶۴ موفق و دیپلوی شده؛ ولی **11.39.0 هنوز push نشده** و فقط در ZIP تحویلی است — علت ندیدن ۵ بند جدید همین است.
- گام بعدی قطعی: کاربر فایل‌های ZIP 11.39.0 را روی مخزن محلی خود کپی و با بلوک دستور پایان چت push کند؛ صحت: health باید 11.39.0 شود و فرم سفارشات با «تاریخ سفارش» در ابتدا باز شود (مهاجرت یک‌بار اجرا می‌شود).

## نوبت ۶۷ — نسخه 11.40.0: ریشه‌یابی واقعی گزارش‌های کاربر (2026-08-22)
- کاربر تصریح کرد فقط مخزن جدید javad-test1 ملاک است؛ چهار گزارش زنده ریشه‌یابی شد:
  ۱) «جواد علمدار/نیلا محرمی در همه تب‌ها»: داده اولیه crm-data هنوز نمونه‌ها را دارد و مهاجرت tombstone فقط تطابق دقیق id/username/fullName می‌شمرد — بکاپ قدیمی با شناسه متفاوت ماندگار می‌شد. اصلاح: enforceRemovedIdentitiesV40 در هر boot با فهرست دائمی حذف‌شدگان (نام/username/id) + dropRemovedUserRowsV40 در تمام renderers لیستی (leaves/routes/homes/targets/monthly) — تاریخچه canonical دست‌نخورده، فقط دیدار نیست.
  ۲) گیرندگان اعلان: ساده و بدون نقش بود. اصلاح: مدیر همه کاربران فعال؛ غیرمدیر فقط مدیر/سرپرست/کارشناس فروش (نماینده‌های دیگر حذف).
  ۳) کلیک داروخانه «قفل»: تنها مسیر click-capture بدون بازخورد بود. اصلاح: سه مسیر click+mousedown+pointerdown با dedupe و toast موفق/خطا.
  ۴) افزودن گزینه در فیلدهای مرجع: هیچ محافظی وجود نداشت (علی‌رغم ادعای سند قدیمی). اصلاح: installReferenceInstantAddGuardV40 — دکمه افزودن برای نماینده/سال/ماه/استان/شهر/منطقه/داروخانه برای غیرمدیر مسدود و پنهان.
- کادر «تعریف مسیرهای نمایندگان» (بالای تارگت، چند استان/شهر/منطقه + ذخیره) از 11.34 موجود و تست‌سنجی شد؛ فیلدهای مسیر از فرم کاربران حذف شده‌اند.
- نسخه 11.40.0؛ تست رگرسیون جدید (هشت ادعا) پاس؛ مجموع 60/60 لازم است؛ سپس ZIP/سرور دانلود/بلوک دستور پایان چت.

## نوبت ۶۸ — بازخوانی پرامپت نوبت ۶۷؛ production = 11.39.0 (2026-08-22T22:07Z)
- همان پرامپت نوبت ۶۷ دوباره ارسال شد؛ چهار اصلاح در کد محلی 11.40.0 (کامیت 7c90647) با grep تازه تأیید شد؛ 60/60 تست.
- اندازه‌گیری زنده: production فعال = **11.39.0** → push کاربر برای 11.39.0 موفق و دیپلوی شده؛ **11.40.0 هنوز push نشده** — علت ندیدن چهار اصلاح جدید همین است.
- کادر «تعریف مسیرهای نمایندگان» از 11.34 در production فعلی هم هست (بالای تب تارگت، فقط مدیر).
- گام قطعی: Extract کردن ZIP 11.40.0 روی مخزن محلی + بلوک دستور پایان چت؛ صحت: health=11.40.0 و با اولین ورود حذف جواد/نیلا از همه تب‌ها اجرا می‌شود.

## نوبت ۶۹ — «برنامه شده 20»: تشخیص = لینک قدیمی؛ لینک اصلی سالم 11.40.0 (2026-08-23T06:25Z)
- اندازه‌گیری هم‌زمان دو سرویس: `javad-test1.onrender.com` = **11.40.0** (push کاربر رسیده و دیپلوی شده ✅)؛ `namayandeelmi-javad.onrender.com` = **11.20.0** — هر جا «نسخه 20» دیده می‌شود، سرویس قدیمی/لینک قدیمی/PWA نصب‌شده قدیمی یا سرویس Render جدید متصل به مخزن قدیمی است، نه برنامه اصلی.
- درخواست «برگردان به اولین نسخه 38 و اعمال تغییرات»: نیاز به تغییر نبود — 11.40.0 همان 11.38 + تمام تغییرات بعدی است؛ عدد نسخه ساختگی تغییر نمی‌کند (قوانین ۸۹/۹۱) و بازگشت واقعی به 11.38.0 یعنی حذف رفع‌ها.
- ری‌استارت جلسه sandbox کامیت‌های محلی را ریست کرد ولی درخت کار سالم بود؛ همه‌چیز در یک کامیت نوبت ۶۹ بازثبت و ZIP 11.40.0 بازسازی شد.
- راهنمای کاربر: فقط از لینک javad-test1.onrender.com استفاده شود؛ اگر سرویس/لینک جدید Render ساخته می‌شود، باید به مخزن GitHub javad-test1 (main) متصل شود یا محتوای آخرین ZIP در مخزن جدید push شود.

## نوبت ۷۰ — «تنظیمات/داده‌ها شده نسخه 20»: تشخیص = داده نمونه کارخانه در مبدأ جدید (2026-08-23)
- مرجع واقعی پیدا شد: لینک جدید جادی‌test1 روی هر مرورگر از صفر شروع می‌کند (localStorage per-origin) و چون سرور جدید هم ابتدا خالی بود، برنامه با DEFAULT_INITIAL_DATA نمونه بالا آمد — «نام کالاهای قدیمی» همان نمونه‌های کارخانه‌ای crm-data است، نه داده کاربر.
- اندازه‌گیری: سرور قدیمی /api/state = {"status":"empty"} → داده واقعی کاربر فقط در localStorage مرورگر/دستگاه قبلی (لینک قدیمی) و فایل‌های پشتیبان دستی/خودکار/ایمیلی است.
- سرور جدید /api/state = نمونه‌ها + کاربر واقعی «خانم فائزه مغانی» — کاربر واقعی پس از restore با قانون preserve-first/union حفظ می‌شود.
- راه‌کار (بدون تغییر کد، نسخه 11.40.0 ثابت): در همان مرورگر قبلی → لینک قدیمی → ورود مدیر → تب پشتیبان‌گیری → دریافت فایل پشتیبان JSON → در لینک جدید → تب پشتیبان‌گیری → بازیابی همان فایل؛ سپس حذف دستی ردیف‌های نمونه باقی‌مانده. جایگزین‌ها: پوشه پشتیبان خودکار ویندوز (File System Access) و ایمیل‌های پشتیبان.
- درس دائمی: پیش از هر جابه‌جایی لینک/مخزن، اول فایل پشتیبان گرفته شود؛ خود برنامه این را در راهنما هشدار دهد (پیشنهاد ثبت شد).

## نوبت ۷۱ — تحویل ZIP اولین نسخه 38 (11.38.0) به درخواست کاربر (2026-08-23)
- `namayandeelmi-v11.38.0.zip` از کامیت دقیق تاریخی f541301 (کامیت تک‌سطحی 11.38.0) ساخته و از داخل تأیید شد: package/sw/server هر سه 11.38.0 و chat.arena 1.55.
- سرور دانلود پورت 8000 حالا هر دو ZIP را می‌دهد: /zip38 (11.38.0) و /zip (11.40.0) با هشدار تفاوت‌ها.
- هشدار ثبت شد: اگر هدف بازگشت داده‌هاست، نسخه قدیمی‌تر کمکی نمی‌کند؛ مسیر درست بکاپ از لینک قدیمی → بازیابی در لینک جدید است (نوبت ۷۰). دیپلوی 11.38.0 روی main یعنی حذف اصلاحات 11.39/11.40.

## نوبت ۷۲ — داده واقعی کاربر روی سرور جدید پیداست + عقب‌نشینی امن از حذف نام‌محور (2026-08-23)
- خواندن کامل /api/state سرویس جدید: کاتالوگ واقعی کاربر موجود و سالم است — «امگا 3، امگا 5، امگا 3.5، امگا مولتی، امگا وومن، امگا من، کپسول ملاتونین» با شناسه‌های prod-1787… (ساخته‌شده 2026-08-21، همان دوران 11.38) + کاربر واقعی فائزه مغانی + globalFieldOptions + تنظیمات. داده گم نشده؛ مرورگر فعلی state نمونه دارد و برنامه (قانون «state موجود authoritative») آن را خودکار جایگزین نمی‌کند.
- راه بازیابی در هر مرورگر: باز کردن `https://javad-test1.onrender.com/api/state` → ذخیره صفحه به‌صورت فایل JSON → تب پشتیبان‌گیری → بازیابی از همان فایل. مرورگر کاری قبلی (در صورت وجود) همچنان غنی‌ترین state را دارد (بکاپ از همان بهتر است).
- اصلاح امنیتی v11.40.1: حذف هویت‌ها فقط با تطابق دقیق id+username نمونه قدیمی (u-2/Taheri، u-3/nila) انجام می‌شود؛ فهرست نام‌ها همیشه خالی است تا هیچ شخص واقعی (از جمله کاربری به نام جواد علمدار) هرگز حذف/پنهان نشود. ردیف‌های نمونه باقی‌مانده را مدیر دستی حذف می‌کند.
- نسخه 11.40.1؛ تست v11.40 با معنای امن پاس؛ مجموع 60/60.

## نوبت ۷۴ — نسخه 11.42.0: اعمال اولین گزارش کاربر از /api/feedback (2026-08-23)
- گزارش کاربر خوانده شد (۱۹ بند)؛ ۷ بند واقعاً اعمال و تست شد: پلاک/طبقه/نوع داروخانه (فرم+ذخیره+ویرایش+ریست)، تایید بله/خیر + جلوگیری ثبت تکراری، خالی‌شدن خودکار فرم داروخانه/پزشک هنگام خروج + کلید پاک کردن بالای صفحه، مقدار درست شماره همراه مسئول در لیست، قانون نقش (سرپرست/کارشناس فروش در سلبکتورهای نماینده مثل مدیر)، فیلترهای فروش پخش در یک سطر، رفع پرش تب اعلان (data-nocombo).
- بقیه ۱۲ بند در تب «تغییرات در نسخه جدید» با وضعیت صف باقی است؛ چرخه: کاربر تیک می‌زند → /api/feedback → نوبت بعد اعمال می‌شود.

---

## 8) وضعیت نوبت ۸۰ — نسخه 11.61.0: بستن حلقه‌های خودتغذی MutationObserver ✅

```text
Source tested:             yes — 62/62 رگرسیون (+تست جدید guards v11.61.0)، 16/16 حفظ وضعیت، 4/4 ورود خودکار سرور واقعی = 82/82
UI runtime verified:       yes — server.js واقعی + اجرای UI با JSDOM؛ قبل از وصله ~2هزار جهش DOM/ثانیه در تب سفارشات؛ بعد از وصله جهش بیکار = ۰
Combo/fields verified:     yes — انتخاب استان/شهر، فیلتر تایپی، تایپ فارسی، بسته‌شدن لیست، پایداری ۳ثانیه‌ای، پیام اعتبارسنجی فارسی
Changed files:             public/crm-bundle.js (5 وصله)، public/crm-features-v20.js (4 وصله آینه)، 7 فایل نسخه (11.61.0)، tests/version-11.24-regressions.test.mjs
Version files:             package.json / server.js APP_VERSION / public/sw.js BUILD / index.html BUILD + ?v=×5 / login.html / crm-app.js ×3
Behavior preserved:        قفل طوسی v11.49 فیلدهای توصیفی سفارشات، زنجیره استان→شهر→منطقه v20، ترتیب کانونی v39، محافظ مرجع v40 — بدون تغییر
Preview:                   پیش‌نمایش زنده v11.61.0 روی پورت 8001؛ سرور دانلود ZIP پورت 8000 (/zip) طبق قانون ۶۴
Pending:                   push کاربر (بلوک پاورشیل پایان چت) → دیپلوی Render → health=11.61.0
```

علت ریشه‌ای: سه ناظر MutationObserver (مرتب‌سازی ستون لیست سفارشات، قفل موقعیت فرم سفارش، و بازنویسی‌های بدون idempotent ترتیب فیلدها) روی DOM می‌نوشتند و جهش خودشان را دوباره scene می‌خواندند — خودتغذی چندهزار جهش‌درثانیه که ورود/انتخاب کشویی/ثبات چیدمان سه تب را مختل می‌کرد. شواهد کامل در AI_ACCEPTANCE_CHECKLIST نوبت ۸۰ و CHANGES_V11 ثبت شد.

## 9) وضعیت نوبت ۸۱ — نسخه 11.62.0 ✅

```text
Source tested:             yes — 63/63 رگرسیون (+تست v11.62.0)، 16/16 حفظ وضعیت، 4/4 ورود خودکار = 83/83
UI runtime verified:       yes — نام‌ها INPUT بدون list/combo؛ کادر درصد فقط بله/خیر؛ پلاک/طبقه بعد از آدرس؛ instant-add سفارشات/کالا = ۰
Changed files:             public/index.html، public/crm-bundle.js (+لایه v62)، ۷ فایل نسخه، tests
Pending:                   push کاربر → دیپلوی → health=11.62.0
```

## 10) وضعیت نوبت ۸۲ — نسخه 11.66.0 ✅
Source 84/84؛ نام‌ها ساده؛ instant-add متنی صفر؛ گرید پزشک ۳ستونه؛ سفارشات لیست داروخانه‌های ثبت‌شده روی فوکوس.

## نوبت ۹۲ — نسخه 11.72.0

- بوت سرور‌اول: GET `/api/state?__v72boot=` و `adoptServerExact` بدون ادغام؛ سپس `paintListsNow`.
- فلش تعداد کالا/جایزه/تارگت حذف؛ wheel و ArrowUp/Down مسدود.
- ویرایش/حذف پایدار با capture + stopImmediatePropagation روی سه تب تارگت/مسیر/پخش.
- حذف کادر «نمایش تارگت‌های ثبت‌شده»؛ عملیات روبروی هر سطر.
- تارگت هر پخش در کادر جدا + جمع تارگت + ستون محقق‌شده/مانده از pharmacyRows.

## نوبت ۹۳ — نسخه 11.73.0

- علت دادهٔ سیستم‌های دیگر در باز شدن: دو شیء state جدا (`let state` در crm-app و `window.state`) + پرده ۸۰۰ms قبل از adopt سرور.
- اصلاح: `bindLiveWindowState` getter/setter که همان شیء زنده را mutate می‌کند؛ پرده تا `__CRM_UNVEIL` بعد از adopt (ایمنی ۵ثانیه).
- adoptExact درجا + persist روی CRM_APP_STATE_V2 یعنی دادهٔ سیستم‌های دیگر از ریشه پاک می‌شود.
- نقاشان v68/v69 کارت «نمایش تارگت‌های ثبت‌شده» را می‌ساختند و hideOldOps پنهان می‌کرد → دکمه‌ها ناپدید. v73 آن میزبان‌ها را حذف و عملیات را روی سطر اصلی نگه می‌دارد.
- ذخیره تارگت پخش: match با monthName یا `ماه/سال`، به‌روزرسانی id موجود، پاک tombstone هنگام ورود دوباره، replace=1.

## نوبت ۹۴ — نسخه 11.74.0

- تب اطلاعات فروش پخش‌ها: مشاطب مانند دایا/شفاآراد.
- ستون ۱۱ فروش تعدادی، ستون ۱۲ تعداد جایزه، ستون ۱۰ تعداد داروخانه.
- ریال فروش = تعداد × قیمت پخش/داروخانه برنامه.
- تطبیق کد: 1001→186101 … 1007→186107 (`MASHATEB_CODE_MAP` / `mashatebDbCode`).

## نوبت ۹۵ — نسخه 11.75.0

- طراح ستون‌ها: ترتیب فرم/لیست، عرض، ارتفاع، فاصله میلی‌متری، شماره سطر و جای فیلد زنده اعمال می‌شود.
- Autofill and passwords روی استان/شهر/منطقه حذف؛ interval پرش شهر قطع شد.
- دیتابیس پخش: ویرایش و حذف روبروی داروخانه و موجودی.
- تاریخ داروخانه مشاطب از ستون ۳.
- نام داروخانه/پزشک بدون زیرمجموعه؛ تکراری نام+مکان مسدود.


## نوبت ۹۶ — نسخه 11.76.0
- قفل آرشیو فایل‌های تب دیتابیس پخش و اسنپ: merge سمت سرور، عدم ذخیره خالی، حذف فقط با دستور مدیر
- استان/شهر/منطقه: data-nocombo + select بومی تا کادر Autofill and passwords ظاهر نشود
- فیلد نام داروخانه بدون زیرمجموعه (قطع hookPharmacyNameField)
- هیت‌مپ فعالیت لحظه‌ای برای همه نمایندگان و به‌تفکیک نماینده


## نوبت ۹۷ — نسخه 11.77.0
- تب قیمت‌گذاری کالاها با کادر قیمت فعلی و قیمت جدید، درصد افزایش، برگشت قیمت پخش/داروخانه و اعمال روی تاریخ شمسی با اسلش خودکار
