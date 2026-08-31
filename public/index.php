<?php
/**
 * index.php — ورودی ریشه روی هاست نت‌افراز
 * جلوگیری از خطای ۴۰۳/Forbidden: وقتی DirectoryIndex به index.php می‌رسد،
 * همان index.html برنامه را تحویل می‌دهد (بدون redirect و بدون حلقه).
 * اگر index.html نبود، کاربر را به login.html می‌فرستد.
 */
$CRM_INDEX_BUILD = "12.13.0";
$target = __DIR__ . "/index.html";

if (is_file($target)) {
  header("Content-Type: text/html; charset=utf-8");
  header("Cache-Control: no-store");
  header("X-CRM-Build: " . $CRM_INDEX_BUILD);
  header("X-Content-Type-Options: nosniff");
  readfile($target);
  exit;
}

if (is_file(__DIR__ . "/login.html")) {
  header("Location: ./login.html", true, 302);
  exit;
}

http_response_code(200);
header("Content-Type: text/html; charset=utf-8");
header("Cache-Control: no-store");
echo "<!doctype html><html lang=\"fa\" dir=\"rtl\"><meta charset=\"utf-8\">"
   . "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
   . "<title>برنامه ویزیت و گزارشات</title>"
   . "<body style=\"font-family:Tahoma,Arial;text-align:center;padding:48px;background:#f0fdfa;color:#134e4a\">"
   . "<h2>فایل‌های برنامه هنوز آپلود نشده است.</h2>"
   . "<p>محتوای پوشه static-build را مستقیم در public_html بریزید (index.php، index.html، login.html، api.php).</p>"
   . "</body></html>";
