# GITHUB_REVIEW_HANDOFF — تحویل مویرگی برای بررسی GitHub و هوش مصنوعی بعدی

**تاریخ این تحویل:** 2026-08-22 / 31 مرداد 1405 (به‌روزرسانی نوبت ۶۱)
**نسخه آماده سورس:** `11.38.0`
**نسخه chat.arena پس از بازسازی این نوبت:** `1.56`
**شاخه اجباری این جلسه:** `arena/01a0262d-javad-test1` (نوبت‌های ۵۹–۶۰ روی `arena/01a006e4-namayandeelmi-javad` در مخزن قبلی بودند)
**مخزن:** `javadalamdarmehraeen-rgb/javad-test1`
**Production فعال (اعلام کاربر نوبت ۶۱):** `https://javad-test1.onrender.com`
**سرویس قدیمی (دیگر مرجع):** `https://namayandeelmi-javad.onrender.com` — هنوز `11.20.0`

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

نکته تحویل ZIP (بازتأیید نوبت ۶۱): پنل پیش‌نمایش Arena محتوای ZIP را قابل دانلود
نشان نمی‌دهد (گزارش کاربر، مثل نوبت ۴۶). کانال تحویل قطعی همان قانون ۶۴ است:
سرور دانلود زنده پورت 8000 (`download_server.py` خارج از Git) که فایل را با
`Content-Disposition: attachment` سرو می‌کند؛ لینک مستقیم: `…:8000/zip`.

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
