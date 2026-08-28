#!/usr/bin/env node
/**
 * خروجی استاتیک برای هاست اشتراکی نت‌افراز (بدون Node)
 *   npm run build-static
 * پوشه static-build را در public_html آپلود کنید.
 * API روی BASE_URL (معمولاً Render) می‌ماند.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "public");
const DEST = path.join(ROOT, "static-build");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(SRC)) {
  console.error("[خطا] پوشه public پیدا نشد.");
  process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
copyDir(SRC, DEST);

const base = String(process.env.BASE_URL || process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
const extra = String(process.env.CRM_HUBS || "")
  .split(",")
  .map(function (s) { return s.trim(); })
  .filter(Boolean);
const hubs = [];
if (base) hubs.push(base);
extra.forEach(function (h) { if (hubs.indexOf(h) < 0) hubs.push(h); });

/* platform: "static" */
const runtime =
  "window.__CRM_RUNTIME = {\n" +
  "  platform: \"static\",\n" +
  "  baseUrl: " + JSON.stringify(base) + ",\n" +
  "  hubs: " + JSON.stringify(hubs) + "\n" +
  "};\n";
fs.writeFileSync(path.join(DEST, "crm-runtime.js"), runtime, "utf8");

const htaccess = [
  "DirectoryIndex login.html index.html",
  "Options -Indexes",
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  "RewriteRule ^panel/?$ /index.html [L]",
  "RewriteRule ^login/?$ /login.html [L]",
  "</IfModule>",
  "<IfModule mod_headers.c>",
  "Header set Cache-Control \"no-cache, must-revalidate\"",
  "</IfModule>",
  ""
].join("\n");
fs.writeFileSync(path.join(DEST, ".htaccess"), htaccess, "utf8");

const readme =
  "آپلود نت‌افراز / هاست اشتراکی\n" +
  "==============================\n" +
  "1. تمام محتویات این پوشه را در public_html بریزید.\n" +
  "2. ورود: /login.html   پنل: /index.html\n" +
  "3. داده آنلاین از BASE_URL (Render) خوانده می‌شود. قبل از ساخت:\n" +
  "     set BASE_URL=https://javad-test1.onrender.com\n" +
  "     npm run build-static\n" +
  "4. Node روی این هاست لازم نیست.\n";
fs.writeFileSync(path.join(DEST, "README-NETAFRAZ.txt"), readme, "utf8");

console.log("✅ خروجی استاتیک در static-build آماده است.");
console.log("   platform=static  baseUrl=" + (base || "(خالی — فقط همین دامنه)"));
console.log("   فایل‌ها را در public_html هاست آپلود کنید.");
