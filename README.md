# نماینده علمی — طنین طب طاها

> # 🏷️ نسخه‌ی جاریِ این ریپو (GitHub main): **12.21.0**
>
> **تغییراتِ 12.21.0 (نوبت ۱۴۶) — شش شکایتِ کاربر، شش ریشه:** ۱) **تاریخِ شمسیِ بی‌ویرگول و بی‌پرش:** ریشهٔ «1,405» این بود که `installLatinNumberLaw` در باندل `Date.prototype.toLocaleDateString` را پچ می‌کند و جداکنندهٔ هزارگانِ فارسی (`٬`) را به `,` تبدیل می‌کند؛ حالا لایهٔ پایانی تاریخ را با `Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn").formatToParts()` «دست‌ساز» می‌سازد (نامِ ماه و روزِ هفته از جدولِ فارسی) و هر `٬`/`،`/`U+200E` را پاک می‌کند؛ کادرِ ساعت هم در CSS پهنایِ **ثابت** (`268px` دسکتاپ / `232px` موبایل) + `tabular-nums` دارد، پس تپشِ ثانیه نه تاریخ را تکان می‌دهد نه هدر را. **«طنین طب طاها» به هدر برگشت** (فقط ریزتر شد؛ `display:none` برداشته شد). ۲) **پایانِ «فیلدها هنوز زیرِ کادرها می‌روند»:** قفلِ ۱۲.۲۰ فقط DOM را مرتب می‌کرد، ولی `applySavedLayoutV82` روی هر گروه CSS `order` می‌گذارد و `order` بر ترتیبِ DOM غلبه می‌کند؛ حالا لایه پس از مرتب‌سازی، `order` را با `!important` روی **همهٔ** فرزندانِ گرید بازنویسی می‌کند **و** کلیدِ خودِ باندل (`CRM_MANAGER_GRID_ORDER_V2`) را با همان ترتیب و همان لنگرها پر می‌کند تا `restoreDomFieldOrder` با ما نجنگد. ۳) **بستنِ منویِ همبرگری با ✕:** ریشه `z-index` بود (هدر در صفحهٔ باریک `4600!important` و کشو `3000`)؛ کشو `4800` و پرده `4790` شد + یک بستنِ قطعی در JS (کلیکِ capture روی `#btnCloseSideMenu`/پرده و کلیدِ Escape). ۴) **«ارسال به رندر»:** پیامِ «sync-local-only» پاسخِ ساختگیِ shimِ `crm-hub.js` برای هر پاسخِ ناموفقِ `/api/sync` بود؛ حالا با `XMLHttpRequest` (بیرون از shim) کدِ **واقعیِ** HTTP گرفته و نمایش داده می‌شود و اگر relayِ هاست کار نکرد، داده **مستقیم از مرورگر** به هاب‌ها (`javad-test1.onrender.com` و …) POST می‌شود. ۵) **سرستون‌هایِ اکسل همه فارسی:** جدولِ برچسب‌ها (`dateAdded`→«تاریخ افزودن»، `fileName`→«نام فایل»، `managerPhone`→«تلفن مدیر»، `repId`→«شناسهٔ نماینده»، …) + ساختِ خودکارِ برچسب از تکه‌هایِ کلید (`orderManagerPhone`→«تلفن مدیر سفارش»)؛ غلطِ «همانه»→«همراه» اصلاح شد و کلیدِ بی‌برچسب در کنسول گزارش می‌شود. ۶) **طراحِ «ستون‌ها و کالاها» عددهایِ واقعیِ همان فیلد را نشان می‌دهد** (نه ۲۲۰ برایِ همه): عرض/ارتفاعِ اندازه‌گیری‌شده با `getBoundingClientRect`، فاصلهٔ میلی‌متریِ واقعیِ رویِ صفحه (`px×25.4/96`)، سطرِ واقعی از `grid-row`، و ترتیبِ واقعیِ فیلد در فرم و در لیست. (۱ تا ۴ نوبتِ ۱۴۵ — قفلِ لنگر، ایتم‌هایِ طراح، هدرِ فشرده، گاوصندوقِ تنظیمات — سرِ جایِ خودشان هستند.) تست: **۲۶۶/۲۶۶**.
>
> **تغییراتِ 12.19.0 (نوبت ۱۴۴) — «قفلِ چیدمان» + ساعت/تاریخ + خروجیِ کامل:** لایهٔ پایانیِ `public/crm-v12.19.0.js` (پس ازِ باندل). ۱) **ساعت و تاریخِ روز در بالای صفحه** — دو برچسبِ جدا با فاصلهٔ کم، رقمِ لاتین، و **عرضِ ثابت + `contain: layout style` + `tabular-nums`** تا تپشِ ثانیه‌شمار اندازهٔ فیلدها و چیدمانِ صفحه را عوض نکند (ریشهٔ «پرشِ صفحات» و «اندازهٔ فیلدها در تبِ داروخانه مدام عوض می‌شود»). ۲) **نسخهٔ برنامه بالای کادرِ آبی‌رنگِ وضعیت** (از کنارِ لوگو به `header-actions` منتقل شد). ۳) **قفلِ چیدمان:** جای فیلدها فقط با `CSS order` از «شمارهٔ ترتیبِ» ذخیره‌شده ساخته می‌شود و **هیچ جابه‌جاییِ DOM انجام نمی‌شود**؛ پس ازِ هر تغییرِ DOM، پس ازِ «پاک کردنِ» داروخانه/پزشک/سفارشات و «🧹 اجرای موتورِ ورود»، و هر ۱٫۲ ثانیه (فقط نوشتنِ متفاوت) همان ترتیب برقرار می‌گردد → فیلدها دیگر زیرِ کادرِ «آیا داروخانه درصدی است» یا «📍 لوکیشن و نقشه» نمی‌پرند. ۴) **تنظیماتِ تبِ «ستون‌ها و کالاها» واقعاً اعمال می‌شوند:** عرض، ارتفاع، فاصلهٔ پیش/پس (میلی‌متر)، شمارهٔ سطر، جای فیلد (روبرو/زیرِ هم)، ستارهٔ الزام، نمایش در فرم، «وابسته به فیلد». ۵) **برداشتنِ تیکِ «افزودن لحظه‌ای گزینه»** دکمهٔ افزودنِ لحظه‌ایِ همان فیلد را پنهان و کلیکش را می‌بندد. ۶) **خروجیِ اکسلِ هر تب = همهٔ اطلاعاتِ آن تب** (ستون‌های ثابت + همهٔ فیلدهای سفارشی + بقیهٔ کلیدهای رکورد). ۷) **همگام‌سازیِ چنددستگاهی خودکار هر ۱۰ ثانیه** (پیش از این ۲۰ ثانیه و فقط دریافت). تست: **۲۴۸/۲۴۸**.
>
> **به‌روزرسانی 2026-09-07 (نوبت ۱۴۰):** اگر در هر کجا (Render، نت‌افراز، ZIP روی دیسک) نسخه‌ای پایین‌تر از `12.18.5` می‌بینید، آن یک deployِ کهنه است؛ سورسِ درست همین ریپو است.
>
> **تغییراتِ 12.18.5 — همگام‌سازیِ مویرگیِ چنددستگاهی:** مشکلِ «در هر سیستمی که تغییر می‌دهم فقط همان‌جا اعمال می‌شود» ریشه‌اش این بود که موتورهایِ قدیمی (v70/v71/v73/v79) هر دستگاه را «مالکِ تنها» می‌کردند: مُهرِ `soloEpoch` + جایگزینیِ کلِ فایلِ سرور با کپیِ همانِ دستگاه (`replace=1`) + مسدودکردنِ pullهایِ دیگر. حالا: ۱) هر ذخیره با پروتکلِ `v12183` می‌رود و **سرور رکورد‌به‌رکورد ادغام می‌کند** (تازه‌ترِ `_updatedAt` برنده؛ افزودنی‌ها می‌مانند؛ حذف فقط با دیدِ به‌روزِ همان دستگاه اعمال می‌شود) — هیچ دستگاهی تغییراتِ بقیه را پاک نمی‌کند؛ ۲) هر ۲۰ ثانیه (و با فوکوس/Visible) یک متایِ ارزان چک می‌شود؛ اگر نسخهٔ سرور عوض شده باشد تغییراتِ بقیه **بدونِ رفرش و بدونِ پرشِ صفحه** رویِ همانِ تب اعمال می‌شود؛ ۳) replaceهایِ کهنه رویِ فایلِ اشتراکی به ادغامِ بی‌حذف تنزل می‌یابند؛ ۴) پیلِ کوچکِ پایینِ صفحه می‌گوید «🔗 همگام» یا صادقانه «🟡 حالتِ محلی» (وقتی دستگاه به APIِ اشتراکی نمی‌رسد — مثلاً کپیِ لوکال؛ برای یکپارچگی همه باید یکِ آدرسِ اصلی را باز کنند). عیب‌یابی هم ردیفِ «همگام‌سازیِ چنددستگاهی» + دکمهٔ «🔄 گرفتنِ تغییراتِ بقیه» گرفت. رویِ سرورِ Node و APIِ PHPِ نت‌افراز هر دو پیاده شد. ۲۳۱/۲۳۱ تست سبز (از جمله سرورِ واقعی با spawn و سناریوی دو-دستگاهی).
>
> **تغییراتِ 12.18.2 (نوبت ۱۳۹):**
> 1. **موتورِ ورود (پاک‌سازی از ریشه، سمتِ مرورگر):** `public/crm-entry-engine.js` — بلافاصله پس ازِ لاگینِ موفق (قبلِ ورودِ به برنامه) و هر وقت خواستید از تب «عیب‌یابی» با دکمهٔ «🧹 اجرایِ موتور»؛ سرویس‌ورکر + کلِ CacheStorage + کلیدهایِ کهنهٔ localStorage/sessionStorage + کشِ IndexedDBِ موقتِ همین دستگاه/مرورگر را جارو می‌کند و مُهرِ مهاجرت را برمی‌گرداند تا چیدمان و ترتیب از نو ساخته شوند. **هیچِ درخواستِ شبکه‌ای نمی‌فرستد → اطلاعاتِ رویِ سرور هرگز پاک نمی‌شود**؛ آفلاین که باشید فقط کش/SW پاک می‌شود تا صفِ تغییراتِ ثبت‌نشده نابود نشود. رویِ ویندوز و گوشی با یک کد کار می‌کند؛ ورود هیچ‌وقت پشتِ موتور قفل نمی‌ماند (سقف ۲٫۵ ثانیه).
> 2. **عیب‌یابی بدونِ خطاهایِ ساختگی:** پروب‌هایِ `/api/health` و `/api/state` از governorِ سقفِ درخواست بیرون رفتند (XHR خام با cache-bust) تا «budget-exhausted» دیگر خطایِ اتصال نسازد؛ «کش نیست» بلافاصله پس ازِ جارو با پیامِ آرامِ «نکته» (سطحِ info، نه ❌) نشان داده می‌شود؛ ردیفِ جدیدِ موتورِ ورود با دکمهٔ اجرایِ دستی اضافه شد.
> 3. **قانونِ «کلیهٔ فیلدها پیش ازِ کادرها»:** کادرهایِ طراحی‌شده (`.col-user-box`) و کارت‌هایِ ثابتِ داخلِ گرید (مثلِ «📍 لوکیشن و نقشه» که idهایِ `phFileInput`/`phMapSearchInput` آن در فهرستِ فیلدها راه می‌یافت) از رده‌بندیِ فیلدها خارج و به انتهایِ گرید میخکوب می‌شوند (CSS order بزرگ + جابه‌جاییِ DOM). علتِ ریشه‌ایِ «عددِ ترتیب اعمال نمی‌شود» همین بود: بچه‌هایِ غیر-form-group هیچ order نمی‌گرفتند و با پیش‌فرضِ ۰ از همه جلوتر می‌پریدند.
>
> **تغییراتِ 12.18.1:** ریشه‌پاک‌کنِ «دستی» — دکمهٔ **🧹 ریشه‌پاک‌کنیِ فوری** در تب دسترسی و پارامترِ `?purge=1`؛ هر وقت حس کردید اطلاعات کهنه لابه‌لای تازه شده، همین‌جا جارویِ کامل (کش مرورگر + سرویس‌ورکر + کلیدهایِ کهنه + فایل‌هایِ قدیمیِ سرور) را اجرا کنید. ۲۲۰/۲۲۰ تست سبز.
>
> **وضعیت انتشار (نوبت ۱۳۶/۱۳۷):** کامیت‌های `f81ac40`/`b1d4e2f`/نسخهٔ ۱۲.۱۸.۱ رویِ شاخهٔ PR #8 push شده‌اند. با یک کلیک «Merge pull request» در GitHub، Render و ndcohub خودکار به نسخهٔ جدید می‌رسند؛ برای `mehraeinpharma.ir` ZIPِ همین نسخه را در پنل آپلود کنید. تا قبلِ Merge، همه‌جا همان `12.16.0` اجرا می‌شود — همین علتِ «اعمال نشدنِ» همه‌چیز است.
>
> - تولید (Render): `https://javad-test1.onrender.com`
> - نت‌افراز: `https://mehraeinpharma.ir` + `https://ndcohub.com`
> - **بررسی نسخه:** بالا-راستِ برنامه یا `https://جایگاه/api/health` — عددِ `version` باید `12.18.5` باشد.
>
> **تغییراتِ 12.18.0:** ریشه‌پاک‌کنِ یک‌باره (سرویس‌ورکر + همه‌ی CacheStorage + کلیدهایِ کهنهٔ مرورگر + فایل‌ها/رکوردهایِ نمونهٔ کهنهٔ سرور)؛ خاموش‌کردنِ پرش‌هایِ صفحه (چیدمان فقط با تغییرِ واقعی، پایانِ جنگِ v68↔v73، بودجه‌بندیِ همگامِ ۱۵ ثانیه‌ای)؛ ترتیبِ تبِ ستون‌ها حالا ماندگار است و روی تبِ اصلی هم اعمال می‌شود؛ «نمایشِ تردد» مسیرِ مبدأ تا مقصد را روی نقشه رسم می‌کند (بدونِ پیغامِ خطا)؛ نوعِ فیلدِ «ساعت» با HH:MM؛ ماتریسِ ریزِ دسترسی با همهٔ تب‌ها و ستونِ جزئیات؛ آلارمِ ویزیت در مرکزِ اعلان‌ها برای کاربر+سرپرست+مدیر؛ و قانونِ یکتایِ ارقامِ لاتین در کلِ برنامه.
>
> **تغییراتِ 12.17.1:** دقیقاً مطابقِ جدولِ سومِ کاربر، رندکردنِ «قیمت مصرف‌کننده با ارزش‌افزوده» زنجیره را از انتها محاسبه می‌کند (6,300,000 ← 5,670,000 ← 4,536,000 ← 3,991,680) و همان عددِ رندشده در جدول می‌ماند.

**تغییراتِ 12.17.0:** حفظِ ترتیبِ ستون‌ها پس از بازگشایی (فرم + لیستِ تب اصلی)، «موقعیت فعلی من» بدون جایگزینیِ شهرِ قدیم + آدرسِ فارسیِ مرتب، کادرِ چسبانِ جایگذاریِ خودکار با فیلترِ زنده‌ی هم‌نام، «نمایش تردد» با نقشه‌ی واقعی، ذخیره‌ی واقعیِ طبقه/پلاکِ منزل، قیمت‌گذاری با نمایشِ درست و تاریخِ اعمالِ شمسیِ خودکار، فیلدِ «ساعت» (HH:MM)، ماتریسِ دسترسیِ ریز، آلارمِ ویزیت یک روز قبل، خروجیِ اکسلِ کاملِ فارسی، عدمِ مزاحمتِ تب‌های دیگر، ارسالِ خودکارِ پس از آفلاین و حذفِ فایل‌هایِ نسخه‌هایِ قدیمی.

> **راهنمای بررسی نسخه جاری:** قبل از هر بررسی GitHub، فایل [`GITHUB_REVIEW_HANDOFF.md`](./GITHUB_REVIEW_HANDOFF.md) و سپس [`PROJECT_GRAPH.md`](./PROJECT_GRAPH.md) را بخوانید. نسخه فعال سورس `12.18.5` است؛ ورودی runtime اصلی `server.js + public/` است و اسکلت Next.js پوشه `src/` مسیر production فعلی نیست.
>
> **وضعیت انتشار در 2026-08-31 (نوبت ۱۲۸):** سورس `12.16.0` — رفع سه نقص واقعی (نسخه نامتوازن، نبود `public/index.php`، انتظارات قدیمی تست‌ها)، سربرگ سه‌خطی کنار لوگو، کار کامل با VPN روشن یا خاموش، و همگام سه دامنه: `javad-test1.onrender.com` + `mehraeinpharma.ir` + `ndcohub.com`.

این مخزن شامل برنامه CRM/PWA نمایندگان علمی، مدیریت داروخانه/پزشک/سفارش، مسیرها، تارگت، اعلان، پخش و ابزارهای حفظ داده است.

## اسکلت تاریخی Next.js
Next.js 16 (App Router) + PostgreSQL (Drizzle ORM) + PWA در پوشه `src/` به‌عنوان اسکلت تاریخی وجود دارد، اما runtime فعلی برنامه Node خالص و فایل‌های `public/` است.
##  
|  |   |   |    |
| --- | --- | --- | --- |
|  | `admin` | `admin1234` | `09120000000` |
|   | `rep1` | `rep1234` | `09121111111` |
>    `ADMIN_PASSWORD`  `ADMIN_PHONE`       
> (       ).      «  »    .
##   (VS Code)
```bash
npm install
#  .env
# DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
npm run dev
```
    **  **   (   migration ).
##   Render + Neon
###   «Could not find a production build» 
  Render     :
```
==> Running 'npm start'
```
 **   `npm run build`  ** →   **Build Command**    .
`next start`              `.next`  .
###   ( )
Render →   → **Settings** →  **Build & Deploy**:
|  |   |
| --- | --- |
| Root Directory |  (     ) |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm run start` |
| Health Check Path | `/api/health` |
 **Environment** →  :
| Key | Value |
| --- | --- |
| `DATABASE_URL` |   Neon  `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `APP_SECRET` |     |
| `NODE_VERSION` | `20.18.0` |
| `NPM_CONFIG_PRODUCTION` | `false` |
  **Manual Deploy → Clear build cache & deploy**.
> : `--include=dev`    Render  `NODE_ENV=production`     
> `npm install`  toolchain (typescript  tailwind)      .
###   (   Build Command   )
 `npm start`    `scripts/start.mjs`   :   `.next`  
**       `next build` **    `PORT`   Render  .
       live  (    ).
###   Blueprint

 `render.yaml`           Render 
**New → Blueprint**          `DATABASE_URL`   .
###   
 `https://<your-app>.onrender.com/api/health`   :
- `{"ok":true,"db":true}` →   .
- `{"ok":false,"reason":"DATABASE_URL   "}` →     .
- `{"ok":false,"reason":"..."}` →     Neon (  `?sslmode=require`)   .
## 
-    / +                .
-       .
-    :         .
-    +   +   (`//`).
-         /       .
-       (  )      / .
-     «»  « »   « »  .
-          (  +  )       .
-         (     /).
-   (CSV   UTF-8  Excel)   .
-          .
-    .
##    APK  PWABuilder
     :
-  `prebuild`    build     `96…1024` 
   `maskable` (  ) `apple-touch-icon`    
     SVG .     PNG    
       Render   .
-      (`/icons/[file]`, `/screenshots/[file]`,
  `/apple-touch-icon.png`)          
       .
-       `<head>`     
   PWA    .
###   APK
1.    Render   (Build Command: `npm install --include=dev && npm run build`).
2.  [PWABuilder.com](https://www.pwabuilder.com)  ** **     ( `/login`).
3.  Retest    Action Items   .
4. `Package For Stores → Android`  `Download Test Package`  .
##       ()
** :**   `force-dynamic`          
  .    (   Render      )
       .
** :**
1. **   ** (`○ Prerendered`).        .
2. ** ** —  (v8)          .
3. **Cache-First  ** +     →      .
4. **   ** ( )     .
5. ** **  IndexedDB    +  .
6. ** ** ( )       .
7. **`/api/ping`**  ( )     +    .
##    ( )
    **     **.   
        **  (OTP)** :
1.   /   .
2.       **   **  .
3.           →    **    **.
4.        →   .
5.              .
6.     «»   ****  ( ).
###   
 «» →  « »:  SMS.ir    .
      : `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER`, `SMS_PATTERN`.
>           ** **   
>           .
##       
###   «    »

   HTML     **  (. )  **.
    React  HTML   JS     
        →  .
**:**  `scripts/build-sw.mjs`    build    
  `/_next/static`       .  ** 
 +  **    .
###  
 `/diagnostics` —   :      
        GPS   .
 «   »  « »  .
##    —  
  **  **   «»       :
|  |  |
|---|---|
| ` ` |     |
| ` ` |          |
| ` ` () |             |
| ` ` | :           |
   « »     .
##       
### ) Keep-Alive —    
         :
```
GET /ping        → 200 "OK"        (  ~ms)
GET /ping?json   → {"status":"OK","uptimeMs":...}
GET /api/ping    → 
HEAD /ping       → 200
```
** UptimeRobot:** New Monitor → HTTP(s) → URL: `https://<app>.onrender.com/ping`
→ Interval: ** **.      Render   .
### ) Retry  Exponential Backoff + Jitter
 `src/lib/retry.ts`:
| API |  |
|---|---|
| `withRetry(fn, opts)` |       |
| `withRetrySafe(fn, fallback)` |      |
| `fetchWithRetry(url, init)` |  HTTP  (  ) |
| `dbRetry(fn, label)` |      |
| `dbTransaction(fn)` |   BEGIN/COMMIT/ROLLBACK  retry |
**  (Full Jitter):** `s → s → s → s → s`   ** **
                .
**  :** `ECONNRESET`, `ETIMEDOUT`, `ECONNREFUSED`, `EAI_AGAIN`, `EPIPE` …
 PostgreSQL `08xxx` () `53xxx` () `57Pxx` () `40001/40P01` ()
 HTTP `5xx`, `429`, `408`   «endpoint is disabled»  Neon.
**   (  ):** `4xx`    `23505` `AbortError`.
### )   Neon
`src/db/index.ts`      :
```
 : postgresql://u:p@ep-cool-fire-123.eu-central-1.aws.neon.tech/neondb
 : postgresql://u:p@ep-cool-fire-123-pooler.eu-central-1.aws.neon.tech/neondb
        ?sslmode=require&connect_timeout=15&application_name=sabt-etelaat-kol
```
-    endpoint  **`-pooler`** (PgBouncer)
- **`connect_timeout=15`**     
- `statement_timeout`  `query_timeout`   
- `keepAlive`  `max=8`, `min=0`, `idleTimeout=30s`
-  `pool.on("error")`         
`GET /api/health`    :
`{"ok":true,"db":true,"latencyMs":8,"pooler":true,"connectTimeoutSec":15}`
##   «This page couldn't load»    
###  
   **-**         
           .

### ) HTML   
 `next.config.ts`   :
`Cache-Control: no-cache, no-store, must-revalidate, max-age=0` + `Pragma: no-cache` + `Expires: 0`
  `/_next/static/*`  `immutable`  (  ).
### )     
 `ConnectionStatus`:     
**«     —       »**
  « » «»  «».       .
   **  **   ( `navigator.onLine`     )
        .
### ) :  «-»
```js
if (req.mode === "navigate") {
         cache: "no-store"
      →     (   )
     →   (/panel  /)     
     →      
}
```
 RSC (  Next)          .
### )   +  
-     (  ).
-  /  **IndexedDB**    
  «          »   .
-  «N    »   **« »**   .
-    Background Sync        .
-  `/offline`   :        
  «   »     .
##       
> **  Laravel:**  `bot-generator-bale-telegram-laravel-10`  PHP/MySQL  
>   « »     .    PHP   
>        .    (Bot API / + )
>    TypeScript         .
###   —  `messengers`
|  |  |
|---|---|
| `platform` | telegram / bale / eitaa / whatsapp |
| `label` |     |
| `targetType` | group / channel / phone |
| `target` | chat_id      |
| `token` |     API |
| `provider` |   : whatsiplus / ultramsg / cloudapi / custom |
| `apiUrl` |    `{phone}`  `{text}`  `{token}` |
| `enabled` | /    |
| `lastStatus`, `lastOkAt`, `lastErrorAt` |        |
 `message_logs`     (/ +  )   .
###   (`src/lib/messaging.ts`)
```ts
formatOrderMessage(order)      //   
sendOne(target, text)          //     ( → )
dispatchText(text, orderId?)   //     
dispatchOrder(order)           //   
fetchUpdates(platform, token)  //   chat_id
```
###  
-    ** **    →  →   (Full Jitter)  .
-   `Promise.allSettled`    **     **.
-        ** Cloudflare**  .
-          ( whatsiplus)   ****  .
###   
|  |  |  |
|---|---|---|
| **** | @BotFather → `/newbot` | chat_id    `-100…` |
| **** | @BotFather   → `/newbot` | chat_id  |
| **** |   `eitaayar.ir` |    `@` |
| **** |  API  `whatsiplus.ir` ( UltraMsg / Cloud API) |   |
     **«   chat_id»**    :     
               .
##       
> ** :** `getLine1Number()`  MSISDN        
>       →  `null` .  iOS   API  .
>     .

###  API
|  |  |
|---|---|
| `POST /api/mobile/nonce` |  nonce  ( Replay) |
| `POST /api/mobile/login-with-phone` |     +  HMAC |
| `POST /api/auth/otp` |      |
### 
1. **HMAC-SHA256**  `nonce|timestamp|deviceId|phone|simFingerprint`  `MOBILE_APP_SECRET`
2. **nonce **     —    
3. ** **      
4. ICCID/IMSI      ** SHA-256** 
###   ()
```
200 TOKEN                    ←  
401 BAD_SIGNATURE            ←  
401 BAD_NONCE                ← Replay Attack
404 PHONE_NOT_REGISTERED     ←    
422 SIM_NUMBER_UNAVAILABLE   ←     →   
403 DEVICE_MISMATCH          ←    
403 SIM_CHANGED              ←    
403 PASSWORD_LOGIN_REQUIRED  ←       
```
###  
 `mobile/`  `App.tsx` `src/simAuth.ts` (React Native)   Flutter
       .  `MOBILE_APP_SECRET`  
Render    .
##        
### )      
 `targets`   `userId`, `period` ( ), `productKey`,
`quantity`, `priceDistributor`, `pricePharmacy`.
-  ** →   **:         /
           «    ».
- `GET /api/targets`   :     (  
  )      .
- **     **           
      .
-  « »       .
### )   
`GET /api/records/lookup?type=pharmacies|doctors&name=…&phone=…`
   ( «/»  / ) 
« »  «»    .      
                .
### )    
      :
-   «  »        
        .
-  **«   »**      
          .
##    : Render  NdcoHub.ir
          ****  :
|  |  |  |
|---|---|---|
| NdcoHub () | `https://ndcohub.ir` |    —     |
| Render (فعال) | `https://javad-test1.onrender.com` | نسخه 11.38.0 — تأیید 2026-08-21 |
| Render (قدیمی) | `https://namayandeelmi-javad.onrender.com` | دیگر مرجع نیست؛ 11.20.0 |
### )      
`src/lib/endpoints.ts` —          
      **     **.
      .
### )  
     :
- `uid` —   (UUID)       
- `updated_at` —     
- `origin` —        
**:**    (   )      `pull`  
  `push` .  : **Last-Write-Wins**   `updated_at`.
** :**      `sek.sync=on`   
           « »
 .  `updated_at < excluded.updated_at`      .

### )  
|  |  |
|---|---|
| `POST /api/sync/pull` |      (  HMAC) |
| `POST /api/sync/push` |      |
| `POST /api/sync/run` |  / (`x-sync-key`) |
| `GET /api/sync/status` |     |
 ** →   **:     /
 « » « »  «  ».
### )  
** Render:**
```
NODE_NAME=render
SYNC_SECRET=<     >
SYNC_PEERS=ndcohub|https://ndcohub.ir
SYNC_INTERVAL_MINUTES=5
NEXT_PUBLIC_ENDPOINTS=https://ndcohub.ir,https://namayandeelmi-javad.onrender.com
PUBLIC_BASE_URL=https://namayandeelmi-javad.onrender.com
```
** NdcoHub** ( `.env.ndcohub.example`   ):
```
NODE_NAME=ndcohub
SYNC_SECRET=< >
SYNC_PEERS=render|https://namayandeelmi-javad.onrender.com
NEXT_PUBLIC_ENDPOINTS=https://ndcohub.ir,https://namayandeelmi-javad.onrender.com
PUBLIC_BASE_URL=https://ndcohub.ir
```
### ) CI/CD    
- `.github/workflows/deploy.yml` —   **  GitLab**     
- `.gitlab-ci.yml` —    **  GitHub**
 : `GITLAB_REPO_URL`, `GITLAB_TOKEN`, `RENDER_DEPLOY_HOOK`,
`NDCOHUB_DEPLOY_HOOK`, `SYNC_SECRET`.
##       GitHub / GitLab
 `git status`    «nothing to commit»     
    (         ).
### :     
1.   ****  .
2.  ** →   ** .
3.  **«    (ZIP)»**  .
4.  ZIP         (  ).
5. :
```bash
git add -A
git status                       #       
git commit -m "  "
git push origin main
git push gitlab main             #   GitLab  
```
>   `node_modules` `.next`  `.env`  (    ).
>     `HOW-TO-UPDATE.md`   ZIP  .
 API: `GET /api/source` ( ) —  `GET /api/source?list=1`    .
##    
### )    /
       .   
( «»)          
   .
**:**        ****
          (   
    ).
### )    
 `/api/geocode`   (    CORS    ):
-       +  « » +  Enter
-         ( / + )
-     : `35.7219, 51.4089`
-  «    » ( )
-      (Photon  Nominatim)    

>  : `Number(null)`    ****   
>    «    »     
> .      .
##    +   
###  
         :
|  |  |
|---|---|
| `src/lib/geo.ts` |           +  `resolveArea`, `provinceOf`, `distanceKm` |
| `src/components/screens/MapExplorer.tsx` |     ///   |
| `src/app/panel/map`  `src/app/admin/map` |  «  » |
`fetchJson`  `fetchRows`   `src/lib/useLive.ts`    `MapBox`
  `MapArea`   (    ).
###    
**) `Custom Cache-Control headers detected for /_next/static`**
   `/_next/static`   ( Next.js   `immutable`  )
  `no-store`   `/:path((?!_next/).*)`     .
**) `Encountered unexpected file in NFT list`**
 `/api/source`  `fs`  `path`   import    
  Turbopack      .   
 **     **  .
: `npm run build`       .

نسخه جاری برنامه: **11.80.0** — ملاک فقط اطلاعات سرور؛ قفل داده نسخه‌های قبلی.

## 11.81.0
پاکسازی قطعی داده سیستم قبلی؛ ملاک فقط سرور نسل ۱۱.۸۱؛ مصرف‌کننده جدید = فعلی × افزایش.

## 11.82.0
اعمال قطعی شماره ترتیب و اندازه طراح ستون‌ها روی فرم/لیست واقعی.

## 11.83.0
توقف پرش تایپ در داروخانه/پزشک؛ کاشی نقشه از سرور؛ ورود پایدار موبایل ایران.

## 11.84.0
داشبورد تحلیلی زنده با فیلتر؛ بدون پرش تایپ؛ ترتیب سفارشات پایدار.

## 11.85.0
یک ستون عملیات مسیر؛ جستجو و همه جغرافیا؛ داشبورد خوانا.

## 11.94.0
هرگز داروخانه کاربر پاک نشود؛ مسیر قابل کلیک؛ نسخه یکسان موبایل/ویندوز.

## 11.95.0
نشان نسخه واحد کنار لوگو؛ نت‌افراز بدون کشیدن داده رندر؛ نام شرکت طنین طب طاها.

## 11.96.0
همگام نت‌افراز→رندر با /api/sync؛ نسل داده برای پذیرش رندر؛ بدون پاک کردن داروخانه.

## 11.97.0
نت‌افراز با نسخه جدید داده رندر را می‌گیرد تا اطلاعات قدیمی نماند.

## 11.98.0
رفع باز نشدن لینک‌ها: SW امن، نت‌افراز بدون ۵۰۰، نشان نسخه واحد.

## 11.99.0
نت‌افراز مستقل و سریع؛ فایل قدیمی نادیده؛ همگام پس‌زمینه.

## 12.00.0
رفع Forbidden نت‌افراز؛ نشان نسخه کنار لوگو با سرور یکی؛ نام شرکت طنین طب طاها.

## 12.09.0
بدون fetch به ndcohub خراب؛ کاشی OSM روی نت‌افراز؛ همگام اول از رندر.
