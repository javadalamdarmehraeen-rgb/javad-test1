// سرور سبک Node.js برای Render — ورود جدا، gzip، health، ژئوکد، محدودیت نرخ
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const PORT = process.env.PORT || 10000;
const RUNTIME_DATA_DIR = process.env.CRM_DATA_DIR || (fs.existsSync("/var/data") ? "/var/data" : __dirname);
try { fs.mkdirSync(RUNTIME_DATA_DIR, { recursive: true }); } catch (e) {}
const SERVER_DATA_PATH = path.join(RUNTIME_DATA_DIR, "user-data.json");
const USER_BULK_PATH = path.join(RUNTIME_DATA_DIR, "user-bulk-data.json");
const LEGACY_DATA_PATH = path.join(__dirname, "server-db.json");
const ROOT_USER_DATA_PATH = path.join(__dirname, "user-data.json");
const ROOT_BULK_DATA_PATH = path.join(__dirname, "user-bulk-data.json");
if (!fs.existsSync(SERVER_DATA_PATH) && fs.existsSync(ROOT_USER_DATA_PATH) && ROOT_USER_DATA_PATH !== SERVER_DATA_PATH) {
  try { fs.copyFileSync(ROOT_USER_DATA_PATH, SERVER_DATA_PATH); } catch (e) {}
}
if (!fs.existsSync(USER_BULK_PATH) && fs.existsSync(ROOT_BULK_DATA_PATH) && ROOT_BULK_DATA_PATH !== USER_BULK_PATH) {
  try { fs.copyFileSync(ROOT_BULK_DATA_PATH, USER_BULK_PATH); } catch (e) {}
}
if (!fs.existsSync(SERVER_DATA_PATH) && fs.existsSync(LEGACY_DATA_PATH)) {
  try { fs.copyFileSync(LEGACY_DATA_PATH, SERVER_DATA_PATH); } catch (e) {}
}
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".csv": "text/csv; charset=utf-8",
  ".geojson": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2"
};

const loginHits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = loginHits.get(ip) || { n: 0, t: now };
  if (now - rec.t > 10 * 60 * 1000) { rec.n = 0; rec.t = now; }
  rec.n += 1;
  loginHits.set(ip, rec);
  return rec.n > 30;
}
function trustedWriteRequest(req) {
  const site = String(req.headers["sec-fetch-site"] || "");
  const origin = String(req.headers.origin || "");
  const host = String(req.headers.host || "");
  if (site && !["same-origin", "same-site", "none"].includes(site)) return false;
  if (origin) { try { if (new URL(origin).host !== host) return false; } catch (e) { return false; } }
  return String(req.headers["x-crm-request"] || "") === "1";
}
function sanitizeJsonValue(value, depth = 0) {
  if (depth > 40) throw new Error("JSON nesting too deep");
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") return value.slice(0, 2 * 1024 * 1024).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  if (Array.isArray(value)) return value.map((v) => sanitizeJsonValue(v, depth + 1));
  if (typeof value === "object") {
    const out = Object.create(null);
    Object.keys(value).forEach((k) => {
      if (k === "__proto__" || k === "prototype" || k === "constructor") return;
      out[k.slice(0, 256)] = sanitizeJsonValue(value[k], depth + 1);
    });
    return out;
  }
  return null;
}
function writeJsonAtomic(filePath, data) {
  const temp = filePath + ".tmp-" + process.pid;
  fs.writeFileSync(temp, JSON.stringify(data), { encoding: "utf8", mode: 0o600 });
  fs.renameSync(temp, filePath);
  try { fs.chmodSync(filePath, 0o600); } catch (e) {}
}
function readJsonSafe(filePath) {
  try { return sanitizeJsonValue(JSON.parse(fs.readFileSync(filePath, "utf8"))); } catch (e) { return null; }
}

function send(req, res, status, content, contentType, extra) {
  const headers = Object.assign({
    "Content-Type": contentType || "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https:; font-src 'self' data:; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests",
    "Permissions-Policy": "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), serial=(), hid=(), bluetooth=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=(), autoplay=(), encrypted-media=(), picture-in-picture=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-DNS-Prefetch-Control": "off",
    "Origin-Agent-Cluster": "?1"
  }, extra || {});
  const accept = String(req.headers["accept-encoding"] || "");
  const compressible = /text|javascript|json|svg|csv/.test(contentType || "");
  if (compressible && accept.includes("gzip") && Buffer.byteLength(content) > 512) {
    const gz = zlib.gzipSync(content);
    headers["Content-Encoding"] = "gzip";
    headers["Vary"] = "Accept-Encoding";
    res.writeHead(status, headers);
    return res.end(gz);
  }
  res.writeHead(status, headers);
  res.end(content);
}

function sendFile(req, res, filePath, maxAge) {
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const extra = {
      "Cache-Control": maxAge ? ("public, max-age=" + maxAge) : "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": maxAge ? "" : "no-cache",
      "Expires": maxAge ? undefined : "0",
      "CDN-Cache-Control": maxAge ? ("public, max-age=" + maxAge) : "no-store",
      "Surrogate-Control": maxAge ? ("max-age=" + maxAge) : "no-store"
    };
    Object.keys(extra).forEach((k) => { if (extra[k] === undefined || extra[k] === "") delete extra[k]; });
    send(req, res, 200, buf, type, extra);
  });
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || ("localhost:" + PORT);
  const parsed = new URL(req.url, "http://" + host);
  const pathname = parsed.pathname;
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0").toString().split(",")[0].trim();

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Allow": "GET, POST, HEAD, OPTIONS", "Cache-Control": "no-store" });
    return res.end();
  }
  if (req.method === "POST" && pathname.startsWith("/api/") && !trustedWriteRequest(req)) {
    return send(req, res, 403, JSON.stringify({ status: "error", message: "untrusted write request" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
  }

  if (pathname === "/ping" || pathname === "/api/health" || pathname === "/api/ping" || pathname === "/healthz") {
    return send(req, res, 200, JSON.stringify({
      ok: true, status: "healthy", message: "OK",
      service: "namayandeelmi-javad-crm",
      version: "11.34.0",
      timestamp: new Date().toISOString()
    }), "application/json; charset=utf-8");
  }

  if ((pathname === "/api/geocode" || pathname === "/api/reverse") && req.method === "GET") {
    if (rateLimited(ip + ":geo")) {
      return send(req, res, 429, JSON.stringify({ status: "error", message: "too many requests" }), "application/json; charset=utf-8");
    }
    const q = parsed.searchParams.get("q") || "";
    const lat = parsed.searchParams.get("lat") || "";
    const lng = parsed.searchParams.get("lng") || parsed.searchParams.get("lon") || "";
    const limit = parsed.searchParams.get("limit") || "5";
    const target = pathname === "/api/reverse"
      ? "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lng) + "&zoom=18&addressdetails=1"
      : "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(q) + "&limit=" + encodeURIComponent(limit) + "&addressdetails=1&countrycodes=ir";
    fetch(target, {
      headers: { "Accept-Language": "fa,en", "User-Agent": "namayandeelmi-javad-crm/11.3" }
    }).then(async (up) => {
      const text = await up.text();
      send(req, res, up.ok ? 200 : up.status, text, "application/json; charset=utf-8", { "Cache-Control": "public, max-age=120" });
    }).catch((err) => {
      send(req, res, 502, JSON.stringify({ status: "error", message: String(err.message || err) }), "application/json; charset=utf-8");
    });
    return;
  }

  if (pathname === "/api/backup/email" && req.method === "POST") {
    const apiKey = process.env.RESEND_API_KEY || "";
    const from = process.env.BACKUP_FROM_EMAIL || "";
    if (!apiKey || !from) return send(req, res, 503, JSON.stringify({ status: "not_configured", message: "RESEND_API_KEY و BACKUP_FROM_EMAIL در Render تنظیم نشده‌اند" }), "application/json; charset=utf-8");
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 8 * 1024 * 1024) req.destroy(); });
    req.on("end", async () => {
      try {
        const data = sanitizeJsonValue(JSON.parse(body)), to = String(data.to || "").trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) throw new Error("ایمیل مقصد معتبر نیست");
        const backup = JSON.stringify(data.state || {}, null, 2);
        const up = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject: "پشتیبان خودکار CRM — " + new Date().toLocaleDateString("fa-IR"), html: "<p dir='rtl'>نسخه پشتیبان خودکار سامانه پیوست است.</p>", attachments: [{ filename: "crm-backup-latest.json", content: Buffer.from(backup).toString("base64") }] }) });
        const text = await up.text();
        if (!up.ok) return send(req, res, up.status, text, "application/json; charset=utf-8");
        return send(req, res, 200, JSON.stringify({ status: "sent" }), "application/json; charset=utf-8");
      } catch (err) { return send(req, res, 400, JSON.stringify({ status: "error", message: err.message }), "application/json; charset=utf-8"); }
    });
    return;
  }

  if (pathname === "/api/bulk" && req.method === "GET") {
    if (!fs.existsSync(USER_BULK_PATH)) return send(req, res, 200, JSON.stringify({ status: "empty" }), "application/json; charset=utf-8");
    const data = readJsonSafe(USER_BULK_PATH);
    if (!data) return send(req, res, 503, JSON.stringify({ status: "error", message: "bulk data unavailable" }), "application/json; charset=utf-8");
    return send(req, res, 200, JSON.stringify({ status: "success", data }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
  }

  if (pathname === "/api/bulk" && req.method === "POST") {
    if (rateLimited(ip + ":bulk")) return send(req, res, 429, JSON.stringify({ status: "error", message: "too many requests" }), "application/json; charset=utf-8");
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 64 * 1024 * 1024) req.destroy(); });
    req.on("end", () => {
      try { const data = sanitizeJsonValue(JSON.parse(body)); writeJsonAtomic(USER_BULK_PATH, data); send(req, res, 200, JSON.stringify({ status: "success" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" }); }
      catch (err) { send(req, res, 400, JSON.stringify({ status: "error", message: err.message }), "application/json; charset=utf-8"); }
    });
    return;
  }

  if (pathname === "/api/state" && req.method === "GET") {
    if (fs.existsSync(SERVER_DATA_PATH)) {
      const data = readJsonSafe(SERVER_DATA_PATH);
      if (!data) return send(req, res, 503, JSON.stringify({ status: "error", message: "state data unavailable" }), "application/json; charset=utf-8");
      return send(req, res, 200, JSON.stringify({ status: "success", data }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
    }
    return send(req, res, 200, JSON.stringify({ status: "empty" }), "application/json; charset=utf-8");
  }

  if (pathname === "/api/state" && req.method === "POST") {
    if (rateLimited(ip + ":state")) {
      return send(req, res, 429, JSON.stringify({ status: "error", message: "too many requests" }), "application/json; charset=utf-8");
    }
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 8 * 1024 * 1024) req.destroy(); });
    req.on("end", () => {
      try {
        const data = sanitizeJsonValue(JSON.parse(body));
        writeJsonAtomic(SERVER_DATA_PATH, data);
        send(req, res, 200, JSON.stringify({ status: "success" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
      } catch (err) {
        send(req, res, 400, JSON.stringify({ status: "error", message: err.message }), "application/json; charset=utf-8");
      }
    });
    return;
  }

  if (pathname === "/api/backup" && req.method === "GET") {
    if (!fs.existsSync(SERVER_DATA_PATH)) {
      return send(req, res, 404, JSON.stringify({ status: "error" }), "application/json; charset=utf-8");
    }
    res.writeHead(200, {
      "Content-Disposition": "attachment; filename=\"crm-backup-latest.json\"",
      "Content-Type": "application/json; charset=utf-8"
    });
    return fs.createReadStream(SERVER_DATA_PATH).pipe(res);
  }

  // ورود سبک — اولین صفحه برنامه
  if (pathname === "/login" || pathname === "/login/") {
    return sendFile(req, res, path.join(PUBLIC_DIR, "login.html"), 0);
  }

  // پنل اصلی بعد از ورود
  if (pathname === "/" || pathname === "/panel" || pathname === "/panel/" || pathname === "/admin") {
    return sendFile(req, res, path.join(PUBLIC_DIR, "index.html"), 0);
  }

  let rel = pathname.replace(/^\/+/, "");
  if (!rel || rel.indexOf("..") !== -1) {
    return sendFile(req, res, path.join(PUBLIC_DIR, "login.html"), 0);
  }
  const filePath = path.join(PUBLIC_DIR, rel);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  const ext = path.extname(filePath).toLowerCase();
  const longCache = [".png", ".jpg", ".jpeg", ".css", ".js", ".woff2"].indexOf(ext) !== -1 && rel.indexOf("vendor/") === 0;
  const assetCache = [".png", ".jpg", ".jpeg", ".ico"].indexOf(ext) !== -1 ? 86400 : (rel.indexOf("vendor/") === 0 ? 604800 : 0);
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return sendFile(req, res, path.join(PUBLIC_DIR, "login.html"), 0);
    }
    sendFile(req, res, filePath, assetCache);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("CRM v11.34.0 listening on 0.0.0.0:" + PORT);
});
