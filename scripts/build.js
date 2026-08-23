#!/usr/bin/env node
/* مهر نسخه یکسان روی ?v= همه اسکریپت‌ها/استایل‌ها از package.json — idempotent */
const fs = require("fs");
const path = require("path");
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
const version = pkg.version;
let changed = 0;
for (const f of ["public/index.html", "public/login.html"]) {
  const p = path.join(__dirname, "..", f);
  let s = fs.readFileSync(p, "utf8");
  const before = s;
  s = s.replace(/\?v=[\d.]+/g, "?v=" + version);
  if (s !== before) { fs.writeFileSync(p, s); changed++; }
}
console.log("✅ مهر نسخه " + version + " روی " + changed + " فایل HTML اعمال شد.");
