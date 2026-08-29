<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
$login = __DIR__ . DIRECTORY_SEPARATOR . "login.html";
$panel = __DIR__ . DIRECTORY_SEPARATOR . "index.html";
if (is_file($login)) {
  header("Location: login.html", true, 302);
  exit;
}
if (is_file($panel)) {
  header("Location: index.html", true, 302);
  exit;
}
header("Content-Type: text/html; charset=utf-8");
echo "<!doctype html><html lang=fa dir=rtl><meta charset=utf-8>";
echo "<body style='font-family:Tahoma,Arial;text-align:center;padding:48px'>";
echo "<h2>فایل‌های برنامه روی هاست کامل نیستند</h2>";
echo "<p>محتوای پوشه static-build را مستقیم داخل public_html بریزید تا login.html و index.php کنار هم باشند.</p>";
echo "</body></html>";
