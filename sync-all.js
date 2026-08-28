#!/usr/bin/env node
/**
 * همگام‌سازی یک‌دستوری GitHub + GitLab
 *   node sync-all.js "توضیح تغییرات"
 *   npm run sync -- "توضیح تغییرات"
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
process.chdir(ROOT);

function run(args, opts) {
  const r = spawnSync("git", args, Object.assign({ stdio: "inherit", encoding: "utf8" }, opts || {}));
  return r.status == null ? 1 : r.status;
}
function hasGit() {
  return fs.existsSync(path.join(ROOT, ".git"));
}
function hasRemote(name) {
  const r = spawnSync("git", ["remote", "get-url", name], { encoding: "utf8" });
  return r.status === 0;
}

if (!hasGit()) {
  console.error("[خطا] پوشه .git اینجا نیست.");
  process.exit(1);
}

const message = process.argv.slice(2).join(" ").trim() || ("update " + new Date().toISOString().slice(0, 16));
console.log("🔄 همگام‌سازی: " + message);

console.log("\n--- 1) pull از GitHub ---");
if (run(["pull", "origin", "main", "--no-rebase"]) !== 0) {
  console.error("[توقف] pull از GitHub خطا داد.");
  process.exit(1);
}

if (hasRemote("gitlab")) {
  console.log("\n--- 1b) pull از GitLab ---");
  if (run(["pull", "gitlab", "main", "--no-rebase"]) !== 0) {
    console.error("[توقف] pull از GitLab خطا داد.");
    process.exit(1);
  }
} else {
  console.log("[i] ریموت gitlab تنظیم نشده؛ فقط GitHub. راهنما: RAHNAMA_GITLAB.txt");
}

console.log("\n--- 2) ثبت تغییرات ---");
run(["add", "-A"]);
const c = spawnSync("git", ["commit", "-m", message], { encoding: "utf8" });
if (c.status !== 0) console.log("[i] تغییر جدیدی برای ثبت نبود؛ ادامه می‌دهیم...");
else process.stdout.write(c.stdout || "");

console.log("\n--- 3) push به GitHub ---"); // git push origin main
if (run(["push", "origin", "main"]) !== 0) {
  console.error("[خطا] push به GitHub رد شد.");
  process.exit(1);
}

if (hasRemote("gitlab")) {
  console.log("\n--- 4) push به GitLab ---"); // git push gitlab main
  if (run(["push", "gitlab", "main"]) !== 0) {
    console.warn("[هشدار] push به GitLab رد شد: git push gitlab main");
  }
}

console.log("\n✅ همگام‌سازی کامل شد.");
run(["status", "-sb"]);
