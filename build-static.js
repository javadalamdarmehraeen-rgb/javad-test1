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

function copyFlat(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const from = path.join(dir, name);
      const stt = fs.statSync(from);
      if (stt.isDirectory()) {
        if (name === "data") continue;
        walk(from);
        continue;
      }
      if (/^crm-(netafraz|live)-(data|bulk)\.json$/.test(name) || name === "user-data.json") continue; /* crm-netafraz-data.json */
      const to = path.join(dest, name);
      if (!fs.existsSync(to)) fs.copyFileSync(from, to);
    }
  }
  walk(src);
}

if (!fs.existsSync(SRC)) {
  console.error("[خطا] پوشه public پیدا نشد.");
  process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
copyFlat(SRC, DEST);

(function patchFlat() {
  const man = path.join(DEST, "manifest.json");
  if (fs.existsSync(man)) {
    let t = fs.readFileSync(man, "utf8");
    t = t.replace(/\/icons\//g, "/");
    fs.writeFileSync(man, t, "utf8");
  }
  const lc = path.join(DEST, "leaflet.css");
  if (fs.existsSync(lc)) {
    let t = fs.readFileSync(lc, "utf8");
    t = t.replace(/url\(images\//g, "url(");
    fs.writeFileSync(lc, t, "utf8");
  }
})();

const DEFAULT_RENDER = "https://javad-test1.onrender.com";
/* v12.12: سه دامنه فعال — یک دامنه رندر + دو دامنه نت‌افراز */
const DEFAULT_HUBS = ["https://javad-test1.onrender.com", "https://mehraeinpharma.ir", "https://ndcohub.com"];
const base = String(process.env.BASE_URL || process.env.PUBLIC_BASE_URL || DEFAULT_RENDER).replace(/\/$/, "");
const extra = String(process.env.CRM_HUBS || "")
  .split(",")
  .map(function (s) { return s.trim(); })
  .filter(Boolean);
const hubs = [];
[base].concat(DEFAULT_HUBS, extra).forEach(function (h) {
  if (h && hubs.indexOf(h) < 0) hubs.push(h);
});

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
  "<IfModule mod_headers.c>",
  "SetEnvIf Origin \"^https://(javad-test1\\.onrender\\.com|mehraeinpharma\\.ir|ndcohub\\.com)$\" ALLOW_ORIGIN=$0",
  "Header always set Access-Control-Allow-Origin \"%{ALLOW_ORIGIN}e\" env=ALLOW_ORIGIN",
  "Header always set Access-Control-Allow-Methods \"GET, POST, HEAD, OPTIONS\"",
  "Header always set Access-Control-Allow-Headers \"Content-Type, X-CRM-Request, X-CRM-Replace, X-CRM-Sync, X-CRM-Hub-Sync, X-CRM-Build, Cache-Control\"",
  "Header always set Access-Control-Max-Age \"86400\"",
  "</IfModule>",
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  "RewriteBase /",
  "RewriteCond %{REQUEST_METHOD} OPTIONS",
  "RewriteRule ^api/ api.php?path=preflight [QSA,L]",
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
  "1. همه فایل‌های این پوشه را مستقیم در public_html بریزید (بدون زیرپوشه).",
  "2. ورود: /login.html    پنل: /index.html",
  "3. Node لازم نیست. api.php همان API است — برنامه بدون Render کار می‌کند.",
  "4. برای همگام‌سازی با Render هنگام ساخت:",
  "     set BASE_URL=https://javad-test1.onrender.com",
  "     set CRM_HUBS=https://mehraeinpharma.ir,https://ndcohub.com",
  "     npm run build-static",
  "5. در پنل نت‌افراز SSL رایگان (Let's Encrypt) را فعال کنید تا خطای گواهی و Service Worker رفع شود.",
  "6. PHP 7.4 یا بالاتر لازم است.",
  ""
].join("\n");
fs.writeFileSync(path.join(DEST, "README-NETAFRAZ.txt"), readme, "utf8");

/* path.join(DEST, "data") unused — flattened, no folders */
fs.writeFileSync(path.join(DEST, "KHANAN-APLOAD.txt"), [
  "static-build فقط فایل است (بدون پوشه). همه را در public_html بریزید.",
  "crm-live-data.json را آپلود نکنید؛ PHP می‌سازد و از رندر پر می‌کند اگر خالی باشد.",
  "SSL نت‌افراز را روشن کنید.",
  ""
].join("\n"), "utf8");
console.log("✅ خروجی استاتیک در static-build آماده است.");
console.log("   platform=static  baseUrl=" + (base || DEFAULT_RENDER));
console.log("   کل پوشه را در public_html آپلود کنید.");
