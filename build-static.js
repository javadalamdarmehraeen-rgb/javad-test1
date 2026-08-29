#!/usr/bin/env node
/**
 * خروجی استاتیک نت‌افراز (بدون Node روی هاست)
 *   npm run build-static
 * کل static-build را در public_html آپلود کنید.
 * برنامه با api.php مستقل کار می‌کند. همگام با Render فقط اگر BASE_URL ست شود.
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
    if (name === "crm-netafraz-data.json" || name === "crm-netafraz-bulk.json") continue;
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

const DEFAULT_RENDER = "https://javad-test1.onrender.com";
const base = String(process.env.BASE_URL || process.env.PUBLIC_BASE_URL || DEFAULT_RENDER).replace(/\/$/, "");
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

function phpStr(s) { return "'" + String(s).replace(/\\\\/g, "\\\\").replace(/'/g, "\\'") + "'"; }
const apiCfg = "<?php\nreturn array(\n  'baseUrl' => " + phpStr(base) + ",\n  'hubs' => array(" + hubs.map(phpStr).join(", ") + "),\n);\n";
fs.writeFileSync(path.join(DEST, "api-config.php"), apiCfg, "utf8");
fs.writeFileSync(path.join(DEST, "api-config.json"), JSON.stringify({ baseUrl: base, hubs: hubs }, null, 2), "utf8");

const htaccess = [
  "DirectoryIndex index.php login.html index.html",
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  "RewriteBase /",
  "RewriteRule ^panel/?$ index.html [L,QSA]",
  "RewriteRule ^login/?$ login.html [L,QSA]",
  "RewriteRule ^api/?(.*)$ api.php?path=$1 [QSA,L]",
  "</IfModule>",
  ""
].join("\n");
fs.writeFileSync(path.join(DEST, ".htaccess"), htaccess, "utf8");

const readme = [
  "آپلود نت‌افراز",
  "==============",
  "1. تمام محتویات این پوشه را در public_html بریزید (leaflet.css، images، vendor، api.php، .htaccess).",
  "2. ورود: /login.html    پنل: /index.html",
  "3. Node لازم نیست. api.php همان API است — برنامه بدون Render کار می‌کند.",
  "4. برای همگام‌سازی با Render هنگام ساخت:",
  "     set BASE_URL=https://javad-test1.onrender.com",
  "     npm run build-static",
  "5. در پنل نت‌افراز SSL رایگان (Let's Encrypt) را فعال کنید تا خطای گواهی و Service Worker رفع شود.",
  "6. PHP 7.4 یا بالاتر لازم است.",
  ""
].join("\n");
fs.writeFileSync(path.join(DEST, "README-NETAFRAZ.txt"), readme, "utf8");

console.log("✅ خروجی استاتیک در static-build آماده است.");
console.log("   platform=static  baseUrl=" + (base || DEFAULT_RENDER));
console.log("   کل پوشه را در public_html آپلود کنید.");
