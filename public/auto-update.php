<?php
/**
 * خودبروزرسانیِ نت‌افراز — نسخهٔ 12.24.0
 * -------------------------------------------------------------------------
 * یک‌بار این ZIP را دستی در public_html آپلود کنید؛ از این پس برای هر نسخهٔ
 * تازه فقط کافی است در مرورگر باز کنید:  auto-update.php?go=1
 * این اسکریپت آخرین Release از GitHub عمومی را می‌گیرد و روی همین هاست
 * باز می‌کند — بدونِ دست‌زدن به داده‌ها (crm-live-data.json، گاوصندوقِ تنظیمات،
 * آپلودها و خودِ همین فایل).
 */
error_reporting(E_ALL);
ini_set("display_errors", "1");
header("Content-Type: text/html; charset=utf-8");

define("REPO", "javadalamdarmehraeen-rgb/javad-test1");
define("API_LATEST", "https://api.github.com/repos/" . REPO . "/releases/latest");
/* منبعِ پایدار: ZIPِ آخرین نسخه روی شاخهٔ جلسه (raw) — fallback: release */
define("RAW_LATEST", "https://raw.githubusercontent.com/" . REPO . "/arena/01a080f0-javad-test1/release/namayandeelmi-latest.zip");

$protect = array(
  "crm-live-data.json", "crm-live-bulk.json", "crm-settings-vault.json", "settings-vault.json",
  "auto-update.php", ".user.ini", ".htaccess", "api-config.json"
);
$protectDirs = array("uploads");

function h($s) { return htmlspecialchars($s, ENT_QUOTES, "UTF-8"); }

if (!isset($_GET["go"])) {
  echo "<!DOCTYPE html><html lang='fa' dir='rtl'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
  <title>خودبروزرسانی CRM</title><style>body{font-family:Tahoma,Segoe UI,sans-serif;background:#f0fdfa;color:#134e4a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(13,148,136,.15);padding:28px 32px;max-width:560px}
  h1{font-size:19px;margin:0 0 10px} p{line-height:1.9;font-size:13px}
  a.btn{display:inline-block;background:#0d9488;color:#fff;text-decoration:none;border-radius:10px;padding:10px 22px;font-weight:bold}
  code{background:#ccfbf1;border-radius:6px;padding:1px 6px}</style></head><body><div class='card'>
  <h1>🔄 خودبروزرسانیِ نمایندهٔ علمی — طنین طب طاها</h1>
  <p>آخرین نسخهٔ منتشرشده روی GitHub را دانلود و روی همین هاست نصب می‌کند.<br>
  داده‌های شما (<code>crm-live-data.json</code>، گاوصندوقِ تنظیمات، آپلودها) دست‌نخورده می‌مانند.</p>
  <a class='btn' href='auto-update.php?go=1'>▶️ بروزرسانی به آخرین نسخه</a>
  </div></body></html>";
  exit;
}

echo "<!DOCTYPE html><html lang='fa' dir='rtl'><head><meta charset='utf-8'><title>در حال بروزرسانی…</title>
<style>body{font-family:Tahoma,monospace;background:#0f172a;color:#a7f3d0;padding:20px;line-height:1.8}pre{white-space:pre-wrap}</style></head><body><pre>";

function logline($s) { echo h($s) . "\n"; @ob_flush(); @flush(); }

/* ۱) دانلود از منبعِ پایدار (raw) یا release */
$ctx = stream_context_create(array("http" => array(
  "header" => "User-Agent: crm-autoupdate\r\n",
  "timeout" => 60
)));
$tmp = tempnam(sys_get_temp_dir(), "crmzip");
$zipData = @file_get_contents(RAW_LATEST, false, $ctx);
if ($zipData !== false && strlen($zipData) > 100000) {
  logline("📦 دانلود از منبعِ پایدار: " . strlen($zipData) . " بایت");
} else {
  $zipData = null;
  $meta = @file_get_contents(API_LATEST, false, $ctx);
  if ($meta === false) { logline("❌ دسترسی به GitHub ممکن نشد (allow_url_fopen یا شبکه)."); echo "</pre></body></html>"; exit; }
  $j = json_decode($meta, true);
  $asset = null;
  if ($j && !empty($j["assets"])) foreach ($j["assets"] as $a) {
    if (strpos($a["name"], "namayandeelmi-") === 0 && substr($a["name"], -4) === ".zip") { $asset = $a; break; }
  }
  if (!$asset) { logline("❌ فایل ZIP در هیچ منبعی پیدا نشد."); echo "</pre></body></html>"; exit; }
  logline("📦 نسخه هدف از release: " . ($j["tag_name"] ?? "?") . " — " . $asset["name"]);
  $zipData = @file_get_contents($asset["browser_download_url"], false, $ctx);
}
if ($zipData === false || $zipData === null) { logline("❌ دانلود ZIP ناموفق بود."); echo "</pre></body></html>"; exit; }
file_put_contents($tmp, $zipData);
logline("⬇️ دانلود شد: " . strlen($zipData) . " بایت");

/* ۳) باز کردن و استخراج */
if (!class_exists("ZipArchive")) { logline("❌ ZipArchive روی هاست فعال نیست — با پشتیبانی نت‌افراز فعالش کنید."); echo "</pre></body></html>"; exit; }
$zip = new ZipArchive();
if ($zip->open($tmp) !== true) { logline("❌ ZIP خراب است."); echo "</pre></body></html>"; exit; }

$root = __DIR__;
$updated = 0; $skipped = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {
  $name = $zip->getNameIndex($i);
  if (substr($name, -1) === "/") continue;
  $rel = $name;
  if (strpos($rel, "public/") === 0) $rel = substr($rel, 7);       /* ZIP شامل public/ است */
  if (strpos($rel, "static-build/") === 0) continue;              /* نیاز نیست */
  if (strpos($rel, "../") !== false) continue;                    /* ایمنی */
  $base = basename($rel);
  if (in_array($base, $protect, true)) { $skipped++; continue; }
  foreach ($protectDirs as $pd) { if (strpos($rel, $pd . "/") === 0) { $skipped++; continue 2; } }
  $dest = $root . "/" . $rel;
  $dir = dirname($dest);
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $stream = $zip->getStream($name);
  if ($stream === false) continue;
  $out = fopen($dest, "wb");
  if ($out === false) { fclose($stream); continue; }
  stream_copy_to_stream($stream, $out);
  fclose($out); fclose($stream);
  $updated++;
}
$zip->close();
@unlink($tmp);
logline("✅ " . $updated . " فایل بروزرسانی شد، " . $skipped . " فایلِ داده/حساس دست‌نخورده ماند.");
logline("🎉 تمام! صفحهٔ CRM را با Ctrl+F5 تازه کنید. کشِ سرویس‌ورکر هم با نسخهٔ تازه خودکار عوض می‌شود.");
echo "</pre></body></html>";
