# AI_ACCEPTANCE_CHECKLIST — چک‌لیست اجباری تحویل واقعی

این فایل برای پرامپت‌های چندبخشی کاربر است و در هر نوبت باید قبل از تحویل به‌روز شود.

## قانون دائمی
1. پیام کاربر به بندهای مستقل شکسته شود.
2. برای هر بند، فایل/تابع/عنصر UI مربوط مشخص شود.
3. هر بند واقعاً در سورس اعمال شود؛ توضیح متنی بدون تغییر کد «انجام‌شده» نیست.
4. برای هر بند حداقل یک بررسی خودکار یا مشاهده runtime ثبت شود.
5. وضعیت هر بند فقط یکی از این سه مورد باشد: `تأییدشده`، `در انتظار تأیید کاربر`، `ناشناخته`.
6. تا وقتی تست، build، syntax، HTTP smoke و runtime check انجام نشده ZIP ساخته نشود.
7. قبل از chat.arena، PROJECT_GRAPH بازسازی شود و همه فایل‌های آرشیوی به‌روز شوند.

## نوبت ۵۶ — نسخه 11.35.0
- [x] گزینه اعلان عمومی فقط با مجوز `notify_all_users` — تأییدشده با تست منبع/DOM.
- [x] پاسخ به پیام و ثبت thread/parent/history — تأییدشده با تست ساختاری.
- [x] Web Push استاندارد، VAPID، subscribe/send و SW push/click — تأییدشده با API public-key و malformed-subscription test؛ تحویل واقعی به دستگاه در انتظار مجوز Notification و تأیید کاربر.
- [x] جلوگیری از افزودن نام داروخانه و پنهان‌ماندن پیام قبلی پس از جایگذاری — تأییدشده؛ حلقه MutationObserver نیز رفع شد.
- [x] حذف کاربران غیرفعال از فعالیت و owner-only برای نماینده — تأییدشده با privacy tests.
- [x] منزل نماینده: نام ثابت/self-only و بدون افزودن — تأییدشده با reference-field guard و selector sync.
- [x] ورود واقعی شبیه‌سازی‌شده با JSDOM و اجرای همه اسکریپت‌های مرورگر: ۲۸ تب، invoice tab فعال، target planner، order total=300، حذف اعلان عمومی برای کاربر، reply/history و صفر خطای runtime — تأییدشده.
- [x] علت واقعی flash/hide پیدا شد: `MENU_SECTIONS_LIST` فقط ۲۷ تب داشت و setupNavigationMenu تب invoice را از DOM حذف می‌کرد؛ تب به منبع اصلی منو اضافه شد — تأییدشده با runtime.
- [x] اجرای نهایی پیش از ZIP: `npm test` با ۵۴/۵۴ موفق، build موفق، syntax همه JSها موفق، health نسخه 11.35.0، HTTP 200 و Push public key موفق.
- [x] اجرای مجدد runtime پس از آخرین اصلاح: `{tabs:28, invoice:true, target:true, total:"300", publicRecipient:false, reply:true, errors:[]}` — تأییدشده.

## نوبت ۵۷ — نسخه 11.36.0
- [x] سفارشات: ترتیب و تنظیمات فیلدها پس از ورود، پرکردن خودکار و پاک‌کردن فرم ثابت بماند — تأییدشده؛ runtime قبل/بعد sequence یکسان و metadata یکسان بود.
- [x] سفارشات: پس از «پر کردن خودکار»، پیام «قبلاً ثبت شده» و کادر انتخاب قبلی کاملاً پنهان بماند — تأییدشده با hidden + display none/important در runtime و observer بدون خطا.
- [x] تارگت فروش: فیلدهای نماینده، استان، شهر، منطقه و ذخیره مسیر واقعاً راه‌اندازی و پر شوند — تأییدشده در runtime: ۳ گزینه نماینده، ۳۱ استان و وجود فیلد شهر/منطقه.
- [x] عنوان فیلدها: شناسه‌های فنی مانند `leaveRepSelect` در هیچ فهرست دیداری جای عنوان فارسی ظاهر نشوند — تأییدشده؛ metadata آزمایشی فنی به «نماینده علمی» تبدیل شد.
- [x] فعالیت لحظه‌ای: رکورد کاربران حذف‌شده نمایش داده نشود و نماینده فقط فعالیت خودش را ببیند — تأییدشده؛ مدیر فقط دو کاربر فعال و نماینده فقط رکورد خودش را دید.
- [x] آزمون نهایی: test، build، syntax، HTTP، runtime واقعی و ZIP نسخه جدید — تأییدشده: ۵۵/۵۵ تست، build موفق، syntax بیست فایل، health/HTML/assets/push موفق؛ ZIP نهایی پس از بازسازی آرشیو ساخته و جداگانه بررسی شد.

## نوبت ۵۸ — نسخه 11.37.0
- [x] حفاظت مقدماتی داده: پیش از تغییر کد، state/bulk خواندنی نسخه 11.36.0 و manifest هش در `.arena/runtime-backups` ثبت شد؛ هیچ runtime data file محلی برای بازنویسی وجود نداشت — تأییدشده.
- [x] حفظ تمام state، customFields، formFieldMeta، layout، users و داده‌های Excel در ارتقا — تأییدشده با sentinel عمیق، order/meta/leave قدیمی و ۵۶ تست round-trip؛ state موجود مسیر پاک‌سازی نصب تازه را اجرا نمی‌کند.
- [x] سفارشات: ترتیب مطابق تنظیم ذخیره‌شده مدیر ثابت بماند و پاک‌کردن فقط مقدارها را پاک کند — تأییدشده؛ قفل و reset تراکنشی نسخه قبل حفظ و sentinel metadata در runtime یکسان ماند.
- [x] سفارشات: انتخاب داروخانه از فهرست با یک کلیک واقعاً رکورد را انتخاب و جایگذاری کند؛ پیام قبلی پس از جایگذاری پنهان بماند — تأییدشده با کلیک واقعی روی `.ph-pick-card`، matchedId/address و notice hidden.
- [x] تارگت: کادر مسیر مدیر و همه فیلدهای نماینده/استان/شهر/منطقه حتی در برابر metadata قدیمی نمایان و فعال باشند — تأییدشده با metadata مخفی آزمایشی، ۴ فیلد visible، ۳ نماینده و ۳۱ استان.
- [x] عنوان‌ها: هیچ شناسه فنی builtin مانند `leaveRepSelect` در UI/طراح نمایش داده نشود — تأییدشده؛ wrapper نهایی عنوان «نماینده علمی» برگرداند.
- [x] کاربران حذف‌شده: در نصب تازه بازنگردند؛ حذف با tombstone پایدار شود و در selector/activity پنهان بمانند — تأییدشده؛ ghost موجود در state با tombstone از users/reps حذف و در اعلان/خانه دیده نشد؛ fresh install نمونه‌های قدیمی را نمی‌سازد و دو identity نمونه شناخته‌شده جواد/نیلا یک‌بار به tombstone مهاجرت می‌شوند.
- [x] منزل نمایندگان: مدیر همه منزل‌های کاربران فعال و نماینده فقط منزل خودش را در جدول و نقشه ببیند — تأییدشده در runtime مدیر/نماینده؛ لایه‌های غیرمجاز نقشه نیز پاک و فقط visible rows رسم می‌شوند.
- [x] مرخصی ساعتی: «از ساعت» و «تا ساعت» دو فیلد مستقل با حفظ سازگاری رکوردهای قبلی باشند — تأییدشده؛ 09:00 و 12:00 جدا ذخیره و رکورد قدیمی sentinel حفظ شد.
- [x] اعلان نماینده: گیرنده plain select بدون تایپ/افزودن گزینه باشد — تأییدشده؛ بدون `.crm-combo-input`، placeholder خالی و فقط کاربران فعال.
- [x] فلش تمام کشویی‌های قابل جستجو با کلیک مستقیم فهرست را باز/بسته کند — تأییدشده با کلیک واقعی caret و بازشدن list.
- [x] آزمون مدیر و نماینده، test/build/syntax/HTTP/runtime و ZIP نهایی — تأییدشده: runtime واقعی همه خروجی‌ها true و errors=[]، تست ۵۶/۵۶، build، syntax همه JS، diff check، health/assets/push نسخه 11.37.0؛ ZIP نهایی پاک‌سازی و از داخل بررسی شد.

## نوبت ۵۹ — نسخه 11.38.0
- [x] حفظ LocalStorage، IndexedDB، state و فایل‌های واقعی هنگام پاک‌سازی کش — تأییدشده؛ runtime sentinel شامل state/customFields/formFieldMeta و تنظیم دیگر بدون تغییر ماند.
- [x] موتور `/cache-reset`: هدر Clear-Site-Data فقط cache، حذف CacheStorage/SW و بارگذاری اجباری خودکار — تأییدشده با HTTP و runtime: ۲ cache و ۲ registration حذف شدند.
- [x] تشخیص نسخه واقعی سرور از `/api/health` حتی وقتی HTML و CRM_ASSET_BUILD قدیمی با هم برابرند — تأییدشده در index/login با cache:no-store و مقایسه version.
- [x] Service Worker شبکه‌اولِ اجباری، بدون fallback به HTML/JS/CSS قدیمی و با broadcast نسخه فعال — تأییدشده با تست ساختاری و syntax.
- [x] هدرهای HTML/SW/health شامل no-store و X-CRM-Build؛ HTML شامل Clear-Site-Data cache — تأییدشده با curl پاسخ واقعی 11.38.0.
- [x] تست ثابت کند هیچ `localStorage.clear`، حذف CRM_APP_STATE_V2 یا IndexedDB وجود ندارد — تأییدشده در ۵ منبع و runtime sentinel.
- [x] commit محلی روی شاخه ثابت Arena — تأییدشده: commit `2c4fe0b` ساخته شد.
- [ ] push واقعی GitHub و Pull Request به main — ناشناخته/مسدود: GitHub App هر دو push و Create Ref را به‌علت نداشتن Workflows/Refs permission با 403 رد کرد؛ اتصال GitHub در Arena باید دوباره برقرار شود.
- [ ] GitLab mirror — ناشناخته/مسدود: remote گیت‌لب در sandbox وجود ندارد و mirror فقط پس از push/merge main و وجود secrets workflow ممکن است.
- [x] تست/build/syntax/HTTP/runtime cache rescue و ZIP نسخه جدید — تأییدشده: ۵۷/۵۷، build، syntax، HTTP header/endpoint و runtime sentinel موفق؛ ZIP نهایی بررسی شد.

## نوبت ۶۰ — تحویل برای چت جدید و بررسی GitHub
- [x] وضعیت شاخه/commit/remotes از Git خوانده شد — تأییدشده: شاخه ثابت Arena، آخرین commit `4984d17`، remote فقط origin و remote head فقط main.
- [x] production دوباره مستقل بررسی شد — تأییدشده: `/api/health` هنوز نسخه `11.20.0` را گزارش می‌کند.
- [x] مشکل چت قبل مویرگی ثبت شد — تأییدشده: push و Create Ref با GitHub App به‌علت Workflows/Refs permission و 403 رد شده؛ GitLab remote موجود نیست.
- [x] فایل مستقل `GITHUB_REVIEW_HANDOFF.md` ساخته و به OFFICIAL_FILELIST اضافه شد — تأییدشده.
- [x] README به runtime واقعی و فایل handoff ارجاع مستقیم داد — تأییدشده.
- [x] بازسازی نهایی PROJECT_GRAPH و chat.arena 1.55، تست اسناد، commit محلی و ZIP — تأییدشده: graph دارای بخش انتشار/cache، chat شامل نوبت 60 و handoff کامل، تست 58/58، build/syntax/diff موفق و ZIP بررسی شد.

## نوبت ۶۱ — اندازه‌گیری مجدد، تأیید انتشار و همگام‌سازی کامل آرشیو
- [x] چهار سند شروع به‌ترتیب خوانده شد (graph → handoff → checklist → handoff-prompt) — تأییدشده.
- [x] وضعیت Git/auth/remote دوباره اندازه‌گیری شد — تأییدشده: tree clean، origin فقط main در `f541301`، GitHub App لاگین با API محدود (403 روی /user).
- [x] push شاخه Arena — تأییدشده: `arena/01a0262d-javad-test1` روی GitHub ساخته شد (کامیت بدون تغییر workflow رد نشد)؛ بند معلق نوبت ۵۹ همین‌جا حل شد.
- [x] Pull Request — تأییدشده به‌عنوان «لازم نبودن»: نوک شاخه == نوک main یعنی سورس 11.38.0 از قبل روی main بود؛ GitHub پیام «No commits between» داد.
- [x] GitHub checks — تأییدشده: Build & Mirror & Deploy روی `f541301` تکمیل‌شده با build/test موفق.
- [x] production health — تأییدشده: کاربر لینک فعال را `https://javad-test1.onrender.com` اعلام کرد؛ دو اندازه‌گیری مستقل `/api/health` نسخه `11.38.0` (2026-08-21T21:24:15Z).
- [x] موتور cache rescue زنده — تأییدشده: `/panel` به `/login?build=11.38.0&__crm_reload=...` redirect شد و صفحه ورود سالم بالا آمد.
- [x] ZIP نسخه — تأییدشده: `namayandeelmi-v11.38.0.zip` (۳۵۸ فایل) با package.json/sw.js/server.js هر سه 11.38.0 از داخل ZIP بررسی شد؛ پس از گزارش کاربر که پنل پیش‌نمایش ZIP را قابل دانلود نشان نمی‌دهد (مشکل شناخته‌شده نوبت ۴۶)، کانال تحویل قطعی طبق قانون ۶۴ راه افتاد: سرور دانلود زنده پورت 8000 با هدر attachment — تست واقعی 200/3,190,162 بایت/نسخه 11.38.0 موفق.
- [x] ممیزی پرامپت‌های ۲۰ چت اخیر (نوبت ۴۱–۶۰) — تأییدشده با ۲۲ نشانگر کد + ۵۸/۵۸ تست: همه در سورس 11.38.0 اعمال‌اند؛ هیچ پرامپت معلق کدی باقی نماند؛ نسخه برنامه بدون تغییر کد bump نشد.
- [x] به‌روزرساری همه ۱۵ فایل آرشیوی طبق قانون جدید ۹۱ (نوبت ۶۱) — تأییدشده: graph بازسازی، chat.arena 1.56، handoff/checklist/rules(+#91)/decision(+#۹۳)/tasks(+#۸۱،۸۲)/context/architecture/handoff-prompt/changes/README/filelist.
- [ ] GitLab mirror — ناشناخته: remote گیت‌لب و لاگ خام workflow از sandbox قابل دسترسی نیست.
