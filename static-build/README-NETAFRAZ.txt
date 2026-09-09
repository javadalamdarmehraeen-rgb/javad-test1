آپلود نت‌افراز
==============
1. همه فایل‌های این پوشه را مستقیم در public_html بریزید (بدون زیرپوشه).
2. ورود: /login.html    پنل: /index.html
3. Node لازم نیست. api.php همان API است — برنامه بدون Render کار می‌کند.
4. برای همگام‌سازی با Render هنگام ساخت:
     set BASE_URL=https://javad-test1.onrender.com
     set CRM_HUBS=https://mehraeinpharma.ir,https://ndcohub.com
     npm run build-static
5. در پنل نت‌افراز SSL رایگان (Let's Encrypt) را فعال کنید تا خطای گواهی و Service Worker رفع شود.
6. PHP 7.4 یا بالاتر لازم است.
