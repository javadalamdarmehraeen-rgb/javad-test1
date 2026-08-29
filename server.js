// سرور سبک Node.js برای Render — ورود جدا، gzip، health، ژئوکد، محدودیت نرخ
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const PORT = process.env.PORT || 10000;
const APP_VERSION = "12.01.0";
const RUNTIME_DATA_DIR = process.env.CRM_DATA_DIR || (fs.existsSync("/var/data") ? "/var/data" : __dirname);
try { fs.mkdirSync(RUNTIME_DATA_DIR, { recursive: true }); } catch (e) {}
const SERVER_DATA_PATH = path.join(RUNTIME_DATA_DIR, "user-data.json");
const USER_BULK_PATH = path.join(RUNTIME_DATA_DIR, "user-bulk-data.json");
const LEGACY_DATA_PATH = path.join(__dirname, "server-db.json");
const ROOT_USER_DATA_PATH = path.join(__dirname, "user-data.json");
const ROOT_BULK_DATA_PATH = path.join(__dirname, "user-bulk-data.json");
const PUSH_SUBSCRIPTIONS_PATH = path.join(RUNTIME_DATA_DIR, "push-subscriptions.json");
const VAPID_KEYS_PATH = path.join(RUNTIME_DATA_DIR, "push-vapid.json");
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
function stripPort(h) {
  return String(h || "").toLowerCase().split(":")[0].replace(/^www\./, "");
}
function envHubList() {
  const raw = [process.env.BASE_URL, process.env.PUBLIC_BASE_URL, process.env.CRM_HUBS].filter(Boolean).join(",");
  return raw.split(",").map(function (s) { return String(s).trim().replace(/\/$/, ""); }).filter(Boolean);
}
function envHubHosts() {
  return envHubList().map(function (u) {
    try { return stripPort(new URL(u).host); } catch (e) { return stripPort(u); }
  }).filter(Boolean);
}
function runtimeHubs() {
  const extra = envHubList();
  const defaults = ["https://javad-test1.onrender.com", "https://mehraeinpharma.ir"]; /* dead-cert hub omitted from default list — CORS host still allowed */
  const out = [];
  extra.concat(defaults).forEach(function (h) { if (h && out.indexOf(h) < 0) out.push(h); });
  return out;
}
const PLATFORM = String(process.env.PLATFORM || process.env.CRM_PLATFORM || "fullstack").toLowerCase();
function isCrmHubHost(host) {
  const h = stripPort(host);
  if (!h) return false;
  if (/^(localhost|127\.0\.0\.1)$/.test(h)) return true;
  if (h === "ndcohub.ir" || h === "mehraeinpharma.ir") return true;
  if (h === "javad-test1.onrender.com" || /\.onrender\.com$/.test(h)) return true;
  if (/arena\.site$|e2b\.app$|e2b\.dev$/.test(h)) return true;
  if (envHubHosts().indexOf(h) >= 0) return true;
  return false;
}
function originHostOf(req) {
  try { return stripPort(new URL(String(req.headers.origin || "")).host); } catch (e) { return ""; }
}
function corsHeaders(req) {
  const origin = String(req.headers.origin || "");
  const oh = originHostOf(req);
  if (origin && isCrmHubHost(oh)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CRM-Request, X-CRM-Replace, X-CRM-Sync, X-CRM-Hub-Sync, X-CRM-Build, Cache-Control",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };
  }
  return {};
}
function trustedWriteRequest(req) {
  const host = stripPort(req.headers.host);
  const origin = String(req.headers.origin || "");
  const oh = originHostOf(req);
  const preview = /arena\.site|e2b\.app|e2b\.dev|localhost|127\.0\.0\.1/.test(host) || process.env.E2B_SANDBOX === "true";
  if (preview && String(req.headers["x-crm-request"] || "") === "1") return true;
  if (isCrmHubHost(oh) || isCrmHubHost(host)) {
    return String(req.headers["x-crm-request"] || "") === "1";
  }
  const site = String(req.headers["sec-fetch-site"] || "");
  if (site && !["same-origin", "same-site", "none"].includes(site)) return false;
  if (origin) { try { if (stripPort(new URL(origin).host) !== host) return false; } catch (e) { return false; } }
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
function backupSlotStamp(d) {
  d = d || new Date();
  var m = Math.floor(d.getMinutes() / 15) * 15;
  function pad(n) { return String(n).padStart(2, "0"); }
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + pad(d.getHours()) + "-" + pad(m);
}
function snapshotCloudBackup(data) {
  try {
    const dir = path.join(RUNTIME_DATA_DIR, "backups");
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, "crm-" + backupSlotStamp() + ".json");
    writeJsonAtomic(dest, data);
    const files = fs.readdirSync(dir).filter(function (f) { return /^crm-\d{4}-\d{2}-\d{2}/.test(f) && /\.json$/.test(f); }).sort();
    while (files.length > 192) {
      try { fs.unlinkSync(path.join(dir, files.shift())); } catch (e0) {}
    }
  } catch (e) {}
}
function startQuarterHourBackup() {
  if (global.__CRM_QBACKUP) return;
  global.__CRM_QBACKUP = setInterval(function () {
    try {
      if (!fs.existsSync(SERVER_DATA_PATH)) return;
      var data = readJsonSafe(SERVER_DATA_PATH);
      if (data) snapshotCloudBackup(data);
    } catch (e1) {}
  }, 15 * 60 * 1000);
}
function readJsonSafe(filePath) {
  try { return sanitizeJsonValue(JSON.parse(fs.readFileSync(filePath, "utf8"))); } catch (e) { return null; }
}
const CRM_MERGE_ARRAYS = ["pharmacies","doctors","orders","products","users","reps","leaves","visits","repRoutes","repHomes","hospitals","notifications","salesTargets","distSalesTargets","activityLog"];
const LEGACY_SAMPLE_IDS = {"ph-1":1,"ph-2":1,"ph-3":1,"doc-1":1,"doc-2":1,"rep-1":1,"rep-2":1,"rep-3":1,"ord-1":1,"u-2":1,"u-3":1,"u-4":1,"prod-1":1,"prod-2":1,"act-1":1,"act-2":1,"act-3":1,"home-1":1,"home-2":1,"rt-1":1,"rt-2":1,"lv-1":1,"lv-2":1,"v-1":1,"v-2":1,"v-3":1,"h-1":1,"h-2":1,"h-3":1,"h-4":1,"not-1":1,"not-2":1,"tgt-1":1,"tgt-2":1};
const LEGACY_SAMPLE_NAMES = {"داروخانه دکتر عرفانی":1,"داروخانه شبانه‌روزی رازی":1,"داروخانه دکتر عقبایی":1,"دکتر کاوه سعیدی":1,"دکتر الناز تهرانی":1,"کپسول امپرازول ۲۰ میلی‌گرم":1,"آمپول نوروبیون ویتامین B کمپلکس":1,"داروخانه ۱۳ آبان":1,"داروخانه هلال احمر انقلاب":1,"داروخانه شبانه‌روزی امام رضا":1,"داروخانه شبانه‌روزی کاشانی":1,"داروخانه شبانه‌روزی ولیعصر تبریز":1,"داروخانه شبانه‌روزی گوهردشت":1};
function stripLegacySample(st) {
  if (!st || typeof st !== "object") return 0;
  let n = 0;
  CRM_MERGE_ARRAYS.forEach((k) => {
    if (!Array.isArray(st[k])) return;
    const next = st[k].filter((r) => {
      if (!r || typeof r !== "object") return false;
      const id = r.id != null ? String(r.id) : "";
      if (id && LEGACY_SAMPLE_IDS[id]) return false;
      const name = String(r.name || r.fullName || r.pharmacyName || "");
      if (name && LEGACY_SAMPLE_NAMES[name]) return false;
      return true;
    });
    n += st[k].length - next.length;
    st[k] = next;
  });
  return n;
}
function isV80Gen(st, syncHdr) {
  const g = String((st && (st._dataGen || st._schemaVersion)) || "");
  const s = String(syncHdr || "");
  return g === "11.81.0" || g.indexOf("11.81") === 0 || s === "v81" || s === "11.81.0" || s === "v80";
}
const LEGACY_WIPE_KEYS = ["pharmacies","doctors","orders","reps","visits","activityLog","repHomes","repRoutes","leaves","hospitals","notifications"];
function fenceOldSystem(st) {
  if (!st || typeof st !== "object") return st;
  stripLegacySample(st);
  if (!st._dataGen) {
    st._dataGen = "11.81.0";
    st._schemaVersion = "11.81.0";
  }
  return st;
}
function recStamp(r) {
  if (!r || typeof r !== "object") return 0;
  return Number(r._updatedAt || r.updatedAt || r._lastSavedAt || 0);
}
function normKeyPart(s) {
  return String(s || "").replace(/[\u200c\s]/g, "").toLowerCase();
}
function naturalRecordKey(kind, r) {
  if (!r || typeof r !== "object") return "";
  const n = normKeyPart;
  if (kind === "pharmacies") return r.name ? ("ph:" + n(r.name) + "|" + n(r.phone || r.managerPhone) + "|" + n(r.city || r.province)) : "";
  if (kind === "doctors") return r.name ? ("doc:" + n(r.name) + "|" + n(r.phone) + "|" + n(r.city || r.province)) : "";
  if (kind === "products") return r.name ? ("prod:" + n(r.name)) : "";
  if (kind === "users") return (r.username || r.id) ? ("user:" + n(r.username || r.id)) : "";
  if (kind === "reps") return (r.name || r.id) ? ("rep:" + n(r.name || r.id)) : "";
  if (kind === "salesTargets") return r.productName ? ("tgt:" + n(r.repName) + "|" + n(r.productName) + "|" + n(r.year) + "|" + n(r.monthName || r.month)) : "";
  if (kind === "distSalesTargets") return r.productName ? ("dtgt:" + n(r.distId) + "|" + n(r.productName) + "|" + n(r.year) + "|" + n(r.monthName || r.month)) : "";
  return "";
}
function mergeRecordArrays(a, b, kind, deleted) {
  const map = new Map();
  function put(r) {
    if (!r || typeof r !== "object") return;
    const id = r.id != null ? String(r.id) : "";
    if (id && deleted && deleted[id] && recStamp(r) <= Number(deleted[id])) return;
    const key = id || ("_anon_" + JSON.stringify(r).slice(0, 160));
    const prev = map.get(key);
    if (!prev || recStamp(r) >= recStamp(prev)) map.set(key, r);
  }
  (Array.isArray(a) ? a : []).forEach(put);
  (Array.isArray(b) ? b : []).forEach(put);
  const byNat = new Map();
  const out = [];
  map.forEach((r) => {
    const nk = naturalRecordKey(kind, r);
    if (!nk) { out.push(r); return; }
    const prev = byNat.get(nk);
    if (!prev || recStamp(r) >= recStamp(prev)) byNat.set(nk, r);
  });
  const seen = new Set();
  map.forEach((r) => {
    const nk = naturalRecordKey(kind, r);
    if (!nk) { return; }
    const winner = byNat.get(nk);
    if (!winner || seen.has(nk)) return;
    seen.add(nk);
    out.push(winner);
  });
  return out;
}
function mergeCrmState(serverData, incoming) {
  if (!serverData || typeof serverData !== "object") return incoming;
  if (!incoming || typeof incoming !== "object") return serverData;
  const deleted = Object.assign({}, serverData._deletedIds || {}, incoming._deletedIds || {});
  const out = Object.assign({}, serverData, incoming);
  CRM_MERGE_ARRAYS.forEach((k) => { out[k] = mergeRecordArrays(serverData[k], incoming[k], k, deleted); });
  out.settings = Object.assign({}, serverData.settings || {}, incoming.settings || {});
  const sm = serverData.formFieldMeta || {};
  const im = incoming.formFieldMeta || {};
  out.formFieldMeta = Object.assign({}, sm);
  Object.keys(im).forEach((ent) => {
    out.formFieldMeta[ent] = Object.assign({}, sm[ent] || {}, im[ent] || {});
    Object.keys(im[ent] || {}).forEach((fid) => {
      const L = (sm[ent] || {})[fid] || {};
      const R = im[ent][fid] || {};
      const lt = Number(L._updatedAt || 0);
      const rt = Number(R._updatedAt || 0);
      out.formFieldMeta[ent][fid] = rt >= lt ? Object.assign({}, L, R) : Object.assign({}, R, L);
    });
  });
  out.customFields = Object.assign({}, serverData.customFields || {});
  Object.keys(incoming.customFields || {}).forEach((k) => {
    out.customFields[k] = mergeRecordArrays(serverData.customFields && serverData.customFields[k], incoming.customFields[k], k, deleted);
  });
  out._deletedIds = deleted;
  const st = Number(serverData._lastSavedAt) || 0;
  const it = Number(incoming._lastSavedAt) || 0;
  out._lastSavedAt = Math.max(st, it, Date.now());
  out._unifiedAt = Date.now();
  out._stateRev = Math.max(Number(serverData._stateRev) || 0, Number(incoming._stateRev) || 0) + 1;
  return out;
}
function b64url(input) { return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"); }
function fromB64url(input) { const s=String(input||"").replace(/-/g,"+").replace(/_/g,"/");return Buffer.from(s+"=".repeat((4-s.length%4)%4),"base64"); }
function getVapidKeys() {
  let keys=readJsonSafe(VAPID_KEYS_PATH);if(keys&&keys.publicKey&&keys.privateKey)return keys;
  const ecdh=crypto.createECDH("prime256v1");ecdh.generateKeys();keys={publicKey:b64url(ecdh.getPublicKey()),privateKey:b64url(ecdh.getPrivateKey())};writeJsonAtomic(VAPID_KEYS_PATH,keys);return keys;
}
function hkdfExpand(prk, info, length) { let out=Buffer.alloc(0),prev=Buffer.alloc(0),i=1;while(out.length<length){prev=crypto.createHmac("sha256",prk).update(Buffer.concat([prev,Buffer.from(info),Buffer.from([i++])])).digest();out=Buffer.concat([out,prev]);}return out.subarray(0,length); }
function encryptWebPush(subscription, payload) {
  const clientPublic=fromB64url(subscription.keys&&subscription.keys.p256dh),auth=fromB64url(subscription.keys&&subscription.keys.auth);if(clientPublic.length!==65||!auth.length)throw new Error("invalid push keys");
  const server=crypto.createECDH("prime256v1");server.generateKeys();const serverPublic=server.getPublicKey(),secret=server.computeSecret(clientPublic),prkKey=crypto.createHmac("sha256",auth).update(secret).digest(),keyInfo=Buffer.concat([Buffer.from("WebPush: info\0"),clientPublic,serverPublic]),ikm=hkdfExpand(prkKey,keyInfo,32),salt=crypto.randomBytes(16),prk=crypto.createHmac("sha256",salt).update(ikm).digest(),cek=hkdfExpand(prk,Buffer.from("Content-Encoding: aes128gcm\0"),16),nonce=hkdfExpand(prk,Buffer.from("Content-Encoding: nonce\0"),12),record=Buffer.concat([Buffer.from(payload),Buffer.from([2])]),cipher=crypto.createCipheriv("aes-128-gcm",cek,nonce),encrypted=Buffer.concat([cipher.update(record),cipher.final(),cipher.getAuthTag()]),rs=Buffer.alloc(4);rs.writeUInt32BE(4096,0);return Buffer.concat([salt,rs,Buffer.from([serverPublic.length]),serverPublic,encrypted]);
}
function vapidAuthorization(endpoint) {
  const keys=getVapidKeys(),pub=fromB64url(keys.publicKey),priv=fromB64url(keys.privateKey),x=b64url(pub.subarray(1,33)),y=b64url(pub.subarray(33,65)),jwk={kty:"EC",crv:"P-256",x,y,d:b64url(priv)},key=crypto.createPrivateKey({key:jwk,format:"jwk"}),header=b64url(JSON.stringify({typ:"JWT",alg:"ES256"})),payload=b64url(JSON.stringify({aud:new URL(endpoint).origin,exp:Math.floor(Date.now()/1000)+12*3600,sub:process.env.VAPID_SUBJECT||"mailto:admin@example.com"})),unsigned=header+"."+payload,signature=crypto.sign("sha256",Buffer.from(unsigned),{key,dsaEncoding:"ieee-p1363"});return{value:"vapid t="+unsigned+"."+b64url(signature)+", k="+keys.publicKey,publicKey:keys.publicKey};
}
async function sendWebPush(subscription, message) { const body=encryptWebPush(subscription,JSON.stringify(message).slice(0,3500)),auth=vapidAuthorization(subscription.endpoint),response=await fetch(subscription.endpoint,{method:"POST",headers:{TTL:"86400",Urgency:"high","Content-Encoding":"aes128gcm","Content-Type":"application/octet-stream",Authorization:auth.value},body});return response.status; }

function isPreviewHost(req) {
  const host = String((req && req.headers && req.headers.host) || "").toLowerCase();
  return /arena\.site|e2b\.app|e2b\.dev|localhost|127\.0\.0\.1/.test(host) || process.env.E2B_SANDBOX === "true";
}
function send(req, res, status, content, contentType, extra) {
  const preview = isPreviewHost(req);
  const headers = Object.assign({
    "Content-Type": contentType || "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": preview ? "ALLOWALL" : "SAMEORIGIN",
    "Content-Security-Policy": preview
      ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: http://ndcohub.ir http://mehraeinpharma.ir https://ndcohub.ir https://mehraeinpharma.ir https://javad-test1.onrender.com; font-src 'self' data:; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors *; worker-src 'self' blob:; manifest-src 'self'"
      : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: http://ndcohub.ir http://mehraeinpharma.ir https://ndcohub.ir https://mehraeinpharma.ir https://javad-test1.onrender.com; font-src 'self' data:; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests",
    "Permissions-Policy": "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), serial=(), hid=(), bluetooth=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=(), autoplay=(), encrypted-media=(), picture-in-picture=()",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": preview ? "cross-origin" : "same-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-DNS-Prefetch-Control": "off",
    "Origin-Agent-Cluster": "?1"
  }, extra || {}, corsHeaders(req));
  if (!preview) headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  if (preview) delete headers["X-Frame-Options"];
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
      "Surrogate-Control": maxAge ? ("max-age=" + maxAge) : "no-store",
      "X-CRM-Build": APP_VERSION
    };
    /* v11.71: Clear-Site-Data روی هر HTML کش را خالی و صفحه را حلقه می‌کرد */
    if (path.basename(filePath) === "sw.js") {
      extra["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
      extra["Service-Worker-Allowed"] = "/";
    }
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
    res.writeHead(204, Object.assign({ "Allow": "GET, POST, HEAD, OPTIONS", "Cache-Control": "no-store" }, corsHeaders(req)));
    return res.end();
  }
  if (req.method === "POST" && pathname.startsWith("/api/") && !trustedWriteRequest(req)) {
    return send(req, res, 403, JSON.stringify({ status: "error", message: "untrusted write request" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
  }

  if (pathname === "/cache-reset" && req.method === "GET") {
    const requested = parsed.searchParams.get("to") || "/panel";
    const destination = /^\/(?:panel|login)(?:[/?#]|$)/.test(requested) ? requested : "/panel";
    const body = `<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>نوسازی برنامه</title><style>body{font-family:Tahoma,Arial;background:#f0fdfa;color:#134e4a;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}.box{background:#fff;padding:28px;border-radius:16px;box-shadow:0 12px 35px #0f766e22}.spin{font-size:38px}</style><div class="box"><div class="spin">⟳</div><h2>در حال دریافت نسخه جدید برنامه…</h2><p>اطلاعات و تنظیمات شما دست‌نخورده می‌ماند.</p></div><script>(async function(){var build=${JSON.stringify(APP_VERSION)},to=${JSON.stringify(destination)};try{if(sessionStorage.getItem("CRM_RESET_LOCK")==="1"){location.replace(to.split("?")[0]==="/cache-reset"?"/login":to);return;}sessionStorage.setItem("CRM_RESET_LOCK","1");localStorage.setItem("CRM_ASSET_BUILD",build);sessionStorage.setItem("CRM_CACHE_RESCUED_"+build,"1");}catch(e){}try{if("caches" in window){var keys=await caches.keys();await Promise.all(keys.map(function(k){return caches.delete(k);}));}}catch(e){}try{if("serviceWorker" in navigator){var regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(function(r){return r.unregister();}));}}catch(e){}var u=new URL(to,location.origin);if(u.pathname==="/cache-reset")u.pathname="/login";u.searchParams.set("__crm_build",build);location.replace(u.pathname+u.search+u.hash);})();</script></html>`;
    return send(req, res, 200, body, "text/html; charset=utf-8", {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Surrogate-Control": "no-store",
      "Clear-Site-Data": '"cache"',
      "X-CRM-Build": APP_VERSION
    });
  }

  if (pathname.indexOf("/api/tiles/") === 0 && req.method === "GET") {
    const m = pathname.match(/^\/api\/tiles\/(\d+)\/(\d+)\/(\d+)/);
    if (!m) return send(req, res, 400, "bad tile", "text/plain");
    const z = m[1], x = m[2], y = m[3];
    const sources = [
      "https://tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png",
      "https://a.tile.openstreetmap.de/" + z + "/" + x + "/" + y + ".png",
      "https://tile.openstreetmap.de/" + z + "/" + x + "/" + y + ".png"
    ];
    function trySrc(i) {
      if (i >= sources.length) { res.writeHead(204); return res.end(); }
      const ac = new AbortController();
      const to = setTimeout(function () { try { ac.abort(); } catch (e) {} }, 5000);
      fetch(sources[i], { signal: ac.signal, headers: { "User-Agent": "namayandeelmi-javad-crm/11.83 (tile-proxy)", "Accept": "image/png,image/*" } }).then(async function (up) {
        clearTimeout(to);
        if (!up.ok) return trySrc(i + 1);
        const buf = Buffer.from(await up.arrayBuffer());
        res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400", "X-CRM-Build": APP_VERSION });
        res.end(buf);
      }).catch(function () { clearTimeout(to); trySrc(i + 1); });
    }
    trySrc(0);
    return;
  }

  if (pathname === "/favicon.ico") {
    return sendFile(req, res, path.join(PUBLIC_DIR, "favicon.png"), 86400);
  }

  if (pathname === "/ping" || pathname === "/api/health" || pathname === "/api/ping" || pathname === "/healthz") {
    return send(req, res, 200, JSON.stringify({
      ok: true, status: "healthy", message: "OK",
      service: "namayandeelmi-javad-crm",
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      host: String(req.headers.host || ""),
      hubs: runtimeHubs(), platform: PLATFORM, baseUrl: process.env.BASE_URL || process.env.PUBLIC_BASE_URL || ""
    }), "application/json; charset=utf-8", { "Cache-Control": "no-store", "X-CRM-Build": APP_VERSION });
  }

  if (pathname === "/api/runtime-config" && req.method === "GET") {
    return send(req, res, 200, JSON.stringify({
      platform: PLATFORM,
      baseUrl: process.env.BASE_URL || process.env.PUBLIC_BASE_URL || "",
      hubs: runtimeHubs(),
      version: APP_VERSION
    }), "application/json; charset=utf-8", { "Cache-Control": "no-store", "X-CRM-Build": APP_VERSION });
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

  if (pathname === "/api/push/public-key" && req.method === "GET") {
    return send(req,res,200,JSON.stringify({status:"success",publicKey:getVapidKeys().publicKey}),"application/json; charset=utf-8",{"Cache-Control":"no-store"});
  }
  if (pathname === "/api/push/subscribe" && req.method === "POST") {
    let body="";req.on("data",c=>{body+=c;if(body.length>1024*1024)req.destroy();});req.on("end",()=>{try{const data=sanitizeJsonValue(JSON.parse(body)),sub=data.subscription;if(!sub||!/^https:\/\//.test(String(sub.endpoint||""))||!sub.keys)throw new Error("invalid subscription");let list=readJsonSafe(PUSH_SUBSCRIPTIONS_PATH)||[];list=list.filter(x=>x&&x.subscription&&x.subscription.endpoint!==sub.endpoint);list.push({userId:String(data.userId||""),username:String(data.username||""),name:String(data.name||""),subscription:sub,updatedAt:Date.now()});writeJsonAtomic(PUSH_SUBSCRIPTIONS_PATH,list.slice(-500));send(req,res,200,JSON.stringify({status:"success"}),"application/json; charset=utf-8",{"Cache-Control":"no-store"});}catch(e){send(req,res,400,JSON.stringify({status:"error",message:e.message}),"application/json; charset=utf-8");}});return;
  }
  if (pathname === "/api/push/send" && req.method === "POST") {
    let body="";req.on("data",c=>{body+=c;if(body.length>1024*1024)req.destroy();});req.on("end",async()=>{try{const data=sanitizeJsonValue(JSON.parse(body)),recipients=Array.isArray(data.recipients)?data.recipients.map(String):[String(data.recipient||"")],all=recipients.some(x=>/همه کاربران|all/i.test(x)),list=readJsonSafe(PUSH_SUBSCRIPTIONS_PATH)||[],targets=list.filter(x=>all||recipients.includes(String(x.userId))||recipients.includes(String(x.username))||recipients.includes(String(x.name))),message={title:String(data.title||"پیام جدید").slice(0,120),body:String(data.body||"").slice(0,1000),url:String(data.url||"/panel#tab-notifications"),tag:String(data.tag||("crm-"+Date.now()))},stale=[];let sent=0;for(const item of targets){try{const status=await sendWebPush(item.subscription,message);if(status>=200&&status<300)sent++;if(status===404||status===410)stale.push(item.subscription.endpoint);}catch(e){}}if(stale.length)writeJsonAtomic(PUSH_SUBSCRIPTIONS_PATH,list.filter(x=>!stale.includes(x.subscription.endpoint)));send(req,res,200,JSON.stringify({status:"success",sent,targets:targets.length}),"application/json; charset=utf-8",{"Cache-Control":"no-store"});}catch(e){send(req,res,400,JSON.stringify({status:"error",message:e.message}),"application/json; charset=utf-8");}});return;
  }

  if (pathname === "/api/feedback" && req.method === "POST") {
    let fbBody="";
    req.on("data", (c) => { fbBody += c; if (fbBody.length > 1024 * 1024) req.destroy(); });
    req.on("end", () => {
      try { writeJsonAtomic(path.join(RUNTIME_DATA_DIR, "feedback.json"), JSON.parse(fbBody)); send(req, res, 200, JSON.stringify({ status: "success", saved: true }), "application/json; charset=utf-8", { "Cache-Control": "no-store" }); }
      catch (e) { send(req, res, 400, JSON.stringify({ status: "error" }), "application/json; charset=utf-8"); }
    });
    return;
  }
  if (pathname === "/api/feedback" && req.method === "GET") {
    var fbf = path.join(RUNTIME_DATA_DIR, "feedback.json");
    if (fs.existsSync(fbf)) { send(req, res, 200, JSON.stringify(JSON.parse(fs.readFileSync(fbf, "utf8"))), "application/json; charset=utf-8", { "Cache-Control": "no-store" }); }
    else { send(req, res, 200, JSON.stringify({ status: "empty" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" }); }
    return;
  }
  if (pathname === "/api/bulk" && req.method === "GET") {
    if (!fs.existsSync(USER_BULK_PATH)) return send(req, res, 200, JSON.stringify({ status: "empty" }), "application/json; charset=utf-8");
    const data = readJsonSafe(USER_BULK_PATH);
    if (!data) return send(req, res, 503, JSON.stringify({ status: "error", message: "bulk data unavailable" }), "application/json; charset=utf-8");
    return send(req, res, 200, JSON.stringify({ status: "success", data }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
  }

  function bulkSig(r) { try { return (r && r.id) ? ("id:" + r.id) : JSON.stringify(r); } catch (e) { return String(r); } }
  function bulkUnion(a, b) {
    const seen = Object.create(null), out = [];
    function add(r) { if (r == null) return; const k = bulkSig(r); if (seen[k]) return; seen[k] = 1; out.push(r); }
    (Array.isArray(a) ? a : []).forEach(add); (Array.isArray(b) ? b : []).forEach(add);
    return out;
  }
  function bulkCount(b) {
    if (!b) return 0;
    let n = 0; const s = b.snapp || {};
    n += (s.rows || []).length + (s.topups || []).length + (s.tripImports || []).length + (s.topupImports || []).length;
    Object.keys(b.distributors || {}).forEach((id) => {
      const d = b.distributors[id] || {};
      n += (d.pharmacyRows || []).length + (d.pharmacyImports || []).length + (d.inventoryRows || []).length + (d.inventoryImports || []).length;
    });
    return n;
  }
  function mergeBulkVault(existing, incoming) {
    if (!incoming || typeof incoming !== "object") return existing;
    const purge = incoming._managerPurge;
    if (purge === true) return incoming;
    function purged(path) { return !!(purge && typeof purge === "object" && purge[path]); }
    if (!existing || typeof existing !== "object" || bulkCount(existing) === 0) return incoming;
    if (bulkCount(incoming) === 0 && !purge) return existing;
    const out = { snapp: Object.assign({}, existing.snapp || {}, incoming.snapp || {}), distributors: Object.assign({}, existing.distributors || {}), savedAt: Math.max(Number(existing.savedAt) || 0, Number(incoming.savedAt) || 0, Date.now()) };
    const es = existing.snapp || {}, ins = incoming.snapp || {};
    ["rows", "topups", "tripImports", "topupImports", "files", "topupFiles"].forEach((k) => {
      out.snapp[k] = purged("snapp." + k) ? (ins[k] || []) : bulkUnion(es[k], ins[k]);
    });
    ["headers", "topupHeaders"].forEach((k) => { if ((ins[k] || []).length) out.snapp[k] = ins[k]; else if ((es[k] || []).length) out.snapp[k] = es[k]; });
    const ids = new Set([...Object.keys(existing.distributors || {}), ...Object.keys(incoming.distributors || {})]);
    ids.forEach((id) => {
      const a = (existing.distributors || {})[id] || {}, b = (incoming.distributors || {})[id] || {};
      out.distributors[id] = Object.assign({}, a, b);
      ["pharmacyRows", "pharmacyImports", "inventoryRows", "inventoryImports"].forEach((k) => {
        out.distributors[id][k] = purged("distributors." + id + "." + k) ? (b[k] || []) : bulkUnion(a[k], b[k]);
      });
      ["pharmacyHeaders", "inventoryHeaders"].forEach((k) => { if ((b[k] || []).length) out.distributors[id][k] = b[k]; });
      if (purged("distributors." + id + ".inventoryImport")) out.distributors[id].inventoryImport = b.inventoryImport || null;
      else if (!out.distributors[id].inventoryImport && a.inventoryImport) out.distributors[id].inventoryImport = a.inventoryImport;
    });
    delete out._managerPurge;
    return out;
  }
  if (pathname === "/api/bulk" && req.method === "POST") {
    if (rateLimited(ip + ":bulk")) return send(req, res, 429, JSON.stringify({ status: "error", message: "too many requests" }), "application/json; charset=utf-8");
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 64 * 1024 * 1024) req.destroy(); });
    req.on("end", () => {
      try {
        const data = sanitizeJsonValue(JSON.parse(body));
        const existing = fs.existsSync(USER_BULK_PATH) ? readJsonSafe(USER_BULK_PATH) : null;
        const merged = mergeBulkVault(existing, data);
        writeJsonAtomic(USER_BULK_PATH, merged);
        send(req, res, 200, JSON.stringify({ status: "success", kept: bulkCount(merged) }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
      }
      catch (err) { send(req, res, 400, JSON.stringify({ status: "error", message: err.message }), "application/json; charset=utf-8"); }
    });
    return;
  }

  if (pathname === "/api/state" && req.method === "GET") {
    if (fs.existsSync(SERVER_DATA_PATH)) {
      const data = readJsonSafe(SERVER_DATA_PATH);
      if (!data) return send(req, res, 503, JSON.stringify({ status: "error", message: "state data unavailable" }), "application/json; charset=utf-8");
      const beforeGen = String(data._dataGen || "");
      const removed = stripLegacySample(data);
      fenceOldSystem(data);
      if (removed > 0 || beforeGen !== "11.81.0") {
        try { writeJsonAtomic(SERVER_DATA_PATH, data); } catch (e) {}
      }
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
        const existing = fs.existsSync(SERVER_DATA_PATH) ? readJsonSafe(SERVER_DATA_PATH) : null;
        const wantReplace = parsed.searchParams.get("replace") === "1" || String(req.headers["x-crm-replace"] || "") === "1" || data._soloReplace === true;
        const syncHdr = String(req.headers["x-crm-sync"] || "");
        if (!isV80Gen(data, syncHdr)) {
          const keep = existing || {};
          return send(req, res, 200, JSON.stringify({ status: "success", data: keep, ignored: true, reason: "legacy-locked" }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
        }
        stripLegacySample(data);
        fenceOldSystem(data);
        data._dataGen = "11.81.0";
        data._schemaVersion = "11.81.0";
        data._soloOnly = true;
        data._soloEpoch = Number(data._soloEpoch) || (existing && existing._soloEpoch) || Date.now();
        data._soloAt = Date.now();
        data._unifiedAt = Date.now();
        delete data._soloReplace;
        writeJsonAtomic(SERVER_DATA_PATH, data);
        snapshotCloudBackup(data);
        return send(req, res, 200, JSON.stringify({ status: "success", data: data, replaced: true }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
      } catch (err) {
        send(req, res, 400, JSON.stringify({ status: "error", message: err.message }), "application/json; charset=utf-8");
      }
    });
    return;
  }

  if (pathname === "/api/sync") {
    return send(req, res, 200, JSON.stringify({
      status: "ok",
      role: "render",
      message: "این سرور رندر است. همگام نت‌افراز→رندر با POST /api/state و هدر X-CRM-Sync: v81 انجام می‌شود.",
      version: APP_VERSION,
      sync: true
    }), "application/json; charset=utf-8", { "Cache-Control": "no-store", "X-CRM-Build": APP_VERSION });
  }

  if (pathname === "/api/backup/status" && req.method === "GET") {
    var bdir = path.join(RUNTIME_DATA_DIR, "backups");
    var snaps = [];
    try { snaps = fs.readdirSync(bdir).filter(function (f) { return /^crm-\d{4}-\d{2}-\d{2}\.json$/.test(f); }).sort(); } catch (e1) {}
    return send(req, res, 200, JSON.stringify({
      status: "ok",
      cloud: true,
      days: snaps.length,
      latest: snaps.length ? snaps[snaps.length - 1] : null,
      live: fs.existsSync(SERVER_DATA_PATH)
    }), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
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
  if (pathname === "/" || pathname === "/login" || pathname === "/login/" || pathname === "/admin") {
    return sendFile(req, res, path.join(PUBLIC_DIR, "login.html"), 0);
  }
  if (pathname === "/panel" || pathname === "/panel/") {
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

function listenOn(port) {
  const s = http.createServer(server.listeners("request")[0]);
  s.on("error", (err) => { console.warn("port", port, err.code || err.message); });
  s.listen(port, "0.0.0.0", () => { console.log("CRM v" + APP_VERSION + " listening on 0.0.0.0:" + port); });
  return s;
}
server.listen(PORT, "0.0.0.0", () => {
  console.log("CRM v" + APP_VERSION + " (" + PLATFORM + ") listening on 0.0.0.0:" + PORT);
  startQuarterHourBackup();
});
if (process.env.E2B_SANDBOX === "true") {
  [3000, 8080].forEach((p) => {
    if (Number(PORT) !== p) listenOn(p);
  });
}
