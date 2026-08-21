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
