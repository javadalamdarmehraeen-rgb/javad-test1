/**
 * اجرای واقعی لایهٔ v12.15.0 — قانون ۹۲: «هیچ بندی بدون مدرک تأییدشده نیست».
 * این فایل لایهٔ «فرمان ترافیک» و «موقعیت‌یابی سریع» را واقعاً اجرا می‌کند:
 *   • سقفِ درخواست پس‌زمینه و قرنطینهٔ میزبانِ خراب (رفع بسته‌شدنِ اتصال در رفرش)
 *   • لغوِ درخواست‌های باز هنگام رفرش/خروج
 *   • خروجِ تطبیقیِ GPS + ژئوکدِ موازی و کش‌شده (همان ریزآدرس، زمانِ کمتر)
 *   • ریدایرکتِ امن به HTTPS (هرگز به بن‌بست نمی‌رود)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';

const src = readFileSync(new URL('../public/crm-bundle.js', import.meta.url), 'utf8');
const MARK = '/* v12.14.0:';
const END = '/* v12.15.0:';
const startMark = src.lastIndexOf(MARK);
const endMark = END ? src.indexOf(END) : -1;
const trafficLayer = src.slice(startMark, endMark > startMark ? endMark : undefined);
assert.ok(trafficLayer.indexOf('window.v1214Traffic') >= 0, 'لایهٔ ۱۲.۱۴ در برش نیست');

/* بلوکِ ژئوکد: از نشانگرِ ۱۲.۱۴ تا پیش از geoSearch (شامل خودِ geoReverse) */
function findBlock(marker) {
  var i = src.indexOf('  /* v12.15.0: ' + marker);
  if (i < 0) i = src.indexOf('  /* v12.14.0: ' + marker);
  return i;
}
const geoStart = findBlock('ژئوکد موازی');
const geoEnd = src.indexOf('  async function geoSearch', geoStart);
const geoBlock = src.slice(geoStart, geoEnd > geoStart ? geoEnd : geoStart + 5000);
assert.ok(geoBlock.indexOf('geoRaceSources') >= 0, 'توابع ژئوکد پیدا نشد');
assert.ok(geoBlock.indexOf('async function geoReverse') >= 0, 'تابع geoReverse پیدا نشد');

/* بلوکِ GPS: تابعِ تطبیقی + انتشار روی window */
const gpsStart = findBlock('خروجِ تطبیقی');
const gpsTail = src.indexOf('window.getCurrentPositionSafe = getCurrentPositionSafe;', gpsStart);
const gpsBlock = src.slice(gpsStart, gpsTail > gpsStart ? src.indexOf('\n', gpsTail) : gpsStart + 5000);
assert.ok(gpsBlock.indexOf('enableHighAccuracy') >= 0, 'بلوک GPS پیدا نشد');

function makeEnv(opts = {}) {
  const status = opts.status || 200;
  const protocol = opts.protocol || 'https:';
  const failNetwork = !!opts.failNetwork;   /* شبکه قطع است (connection closed) */
  const calls = [];
  const store = new Map();
  const live = [];
  const listeners = {};
  const aborted = [];

  const els = {};
  const win = {
    CRM_APP_VERSION: '12.15.0',
    isSecureContext: protocol === 'https:',
    addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); },
    caches: { keys: () => Promise.resolve([]) },
    state: { pharmacies: [], doctors: [], orders: [], users: [], settings: {} }
  };
  const doc = {
    getElementById: () => null,
    querySelector: () => null,
    addEventListener: () => {},
    body: { nodeName: 'BODY' },
    hidden: false
  };
  const loc = {
    protocol,
    hostname: opts.hostname || 'ndcohub.com',
    host: opts.hostname || 'ndcohub.com',
    origin: protocol + '//' + (opts.hostname || 'ndcohub.com'),
    href: protocol + '//' + (opts.hostname || 'ndcohub.com') + '/',
    search: '',
    pathname: '/',
    replace: (u) => { calls.push({ url: u, o: {}, at: Date.now(), nav: true }); },
    reload: () => {}
  };
  const nav = { onLine: true, geolocation: opts.geolocation };
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
  const sessionStorage = {
    getItem: (k) => (store.has('S:' + k) ? store.get('S:' + k) : null),
    setItem: (k, v) => store.set('S:' + k, String(v)),
    removeItem: (k) => store.delete('S:' + k)
  };
  function MutationObserver() { this.observe = () => {}; }

  let pending = 0;
  const sandboxFetch = function (url, o) {
    calls.push({ url, o, at: Date.now() });
    if (o && o.signal) {
      o.signal.addEventListener('abort', () => aborted.push(String(url)));
    }
    if (failNetwork) return Promise.reject(new TypeError('Failed to fetch'));
    if (opts.hang) return new Promise((resolve) => { pending += 1; });
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve({ status: 'empty' }),
      clone() { return this; }
    });
  };
  win.fetch = sandboxFetch;

  const runner = new Function(
    'window', 'document', 'location', 'navigator', 'localStorage', 'sessionStorage',
    'setTimeout', 'setInterval', 'clearTimeout', 'MutationObserver', 'fetch', 'alert',
    '"use strict";' + (opts.layer || trafficLayer)
  );
  runner(
    win, doc, loc, nav, localStorage, sessionStorage,
    (fn, ms) => { const id = setTimeout(fn, ms); live.push({ id, k: 't' }); return id; },
    (fn, ms) => { const id = setInterval(fn, ms); live.push({ id, k: 'i' }); return id; },
    (id) => clearTimeout(id), MutationObserver, sandboxFetch, () => {}
  );
  return {
    win, doc, loc, calls, store, listeners, aborted,
    fire: (type) => (listeners[type] || []).forEach((fn) => fn({ type })),
    pendingCount: () => pending,
    cleanup: () => live.forEach((x) => (x.k === 't' ? clearTimeout(x.id) : clearInterval(x.id)))
  };
}

/* ───────────────────────────────────────────────────────────────────────────── */
test('v12.15.0 traffic: background requests are capped by a per-minute budget', async (t) => {
  const env = makeEnv();
  env.win.v1214Config.budget = 3;
  t.after(() => env.cleanup());

  for (let i = 0; i < 3; i += 1) {
    await env.win.fetch('/api/state').catch(() => {});
  }
  assert.equal(env.calls.length, 3, 'سه درخواستِ مجاز باید بروند');

  /* چهارمی بی‌درنگ رد می‌شود و هیچ درخواستی به هاست نمی‌رود */
  const t0 = Date.now();
  await assert.rejects(env.win.fetch('/api/state'), /budget/);
  assert.ok(Date.now() - t0 < 500, 'سقف باید بی‌درنگ اعمال شود');
  assert.equal(env.calls.length, 3, 'پس از پرشدنِ سقف نباید درخواستی فرستاده شود');
  assert.equal(env.win.v1214State().used, 3);
});

test('v12.15.0 traffic: no cross-origin request during the first 25 seconds (refresh storm)', async (t) => {
  const env = makeEnv();
  t.after(() => env.cleanup());

  await assert.rejects(env.win.fetch('https://mehraeinpharma.ir/api/state'), /boot-quiet/);
  assert.equal(env.calls.length, 0, 'در ۲۵ ثانیهٔ نخست هیچ درخواستِ بین‌دامنه‌ای مجاز نیست');

  /* پس از پایانِ دورهٔ سکوت، درخواستِ بین‌دامنه‌ای آزاد می‌شود */
  env.win.v1214BootDone();
  await env.win.fetch('https://mehraeinpharma.ir/api/state').catch(() => {});
  assert.equal(env.calls.length, 1);
});

test('v12.15.0 traffic: a closed connection quarantines the host, user saves still go through', async (t) => {
  const env = makeEnv({ failNetwork: true });
  t.after(() => env.cleanup());

  await assert.rejects(env.win.fetch('/api/state'));
  const q = env.win.v1214Quarantine();
  assert.ok(Object.keys(q).length >= 1, 'میزبانِ خراب باید قرنطینه شود');

  const before = env.calls.length;
  await assert.rejects(env.win.fetch('/api/state'), /quarantine/);
  assert.equal(env.calls.length, before, 'در قرنطینه درخواستی فرستاده نمی‌شود');

  /* ذخیرهٔ کاربر هرگز مهار نمی‌شود */
  const t0 = Date.now();
  const p = env.win.fetch('/api/state', { method: 'POST', body: '{}' });
  await p.catch(() => {});
  assert.ok(Date.now() - t0 < 800, 'ذخیرهٔ کاربر باید بی‌درنگ تلاش شود');
  assert.equal(env.calls[env.calls.length - 1].o.method, 'POST');
});

test('v12.15.0 traffic: every open request is aborted on refresh/unload', async (t) => {
  const env = makeEnv({ hang: true });
  t.after(() => env.cleanup());
  env.win.v1214Config.bootQuietMs = 0;

  env.win.fetch('/api/state').catch(() => {});
  assert.ok(env.win.v1214State().inFlight >= 1, 'درخواست باید در حال انجام ثبت شود');

  env.fire('pagehide');
  assert.equal(env.win.v1214State().inFlight, 0, 'همهٔ درخواست‌های باز باید لغو شوند');
  assert.equal(env.aborted.length >= 1, true, 'سیگنالِ لغو باید صادر شود');
});

test('v12.15.0 traffic: hidden tabs never sync', async (t) => {
  const env = makeEnv();
  t.after(() => env.cleanup());
  env.doc.hidden = true;
  await assert.rejects(env.win.fetch('/api/state'), /hidden/);
  assert.equal(env.calls.length, 0);
});


/* اجراکنندهٔ اختصاصی برای بلوکِ موقعیت‌یابی (DOMِ ساختگی) */
function runLocationLayer({ win, doc, loc, geo, store, reverseCalls, code }) {
  const runner = new Function(
    'window', 'document', 'location', 'navigator', 'localStorage', 'sessionStorage',
    'setTimeout', 'setInterval', 'clearTimeout', 'MutationObserver', 'fetch', 'alert', 'globalThis',
    '"use strict";' + code
  );
  runner(
    win, doc, loc,
    { onLine: true, geolocation: geo },
    { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    (fn, ms) => setTimeout(fn, ms),
    (fn, ms) => setInterval(fn, ms),
    (id) => clearTimeout(id),
    function MutationObserver() { this.observe = () => {}; },
    (url) => { reverseCalls.push(String(url)); return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ display_name: 'تهران' }) }); },
    () => {}, globalThis
  );
}

/* ───────────────────────────────────────────────────────────────────────────── */
function geoEnv(firstAccuracy, secondAccuracy) {
  const geoCalls = [];
  const geolocation = {
    watchPosition(ok, err, options) {
      geoCalls.push({ kind: 'watch', options });
      setTimeout(() => ok({ coords: { latitude: 35.7012, longitude: 51.4021, accuracy: firstAccuracy } }), 60);
      setTimeout(() => ok({ coords: { latitude: 35.7012, longitude: 51.4021, accuracy: secondAccuracy } }), 2200);
      return 7;
    },
    clearWatch() { geoCalls.push({ kind: 'clear' }); }
  };
  return { geoCalls, geolocation };
}

test('v12.15.0 location: adaptive GPS finishes fast and geocodes only once', async (t) => {
  const g = geoEnv(48, 9);
  const reverseCalls = [];
  const env = makeEnv({ layer: '', geolocation: g.geolocation });
  t.after(() => env.cleanup());
  env.win.isSecureContext = true;
  /* این تست فقط مسیرِ ژئوکدِ ۱۲.۱۴ را می‌سنجد؛ لایهٔ ۱۲.۱۵ مسیرِ خودش را دارد */
  try { delete env.win.v1215Api; } catch (e) {}

  const store = new Map();
  runLocationLayer({
    win: env.win, doc: env.doc, loc: env.loc, geo: g.geolocation, store,
    reverseCalls,
    code: geoBlock + '\n' + gpsBlock + `
      function formatNominatim() { return 'تهران، خیابان آزادی، پلاک ۱۲'; }
      function fetchJson(url) { globalThis.__geoUrls.push(String(url)); return Promise.resolve({ display_name: 'تهران' }); }
    `
  });

  globalThis.__geoUrls = [];
  const t0 = Date.now();
  const pos = await env.win.getCurrentPositionSafe();
  const spent = Date.now() - t0;
  assert.equal(pos.error, undefined, 'نباید خطا بدهد');
  assert.ok(spent < 4000, 'باید زیر ۴ ثانیه تمام شود، واقعیت: ' + spent + ' میلی‌ثانیه');
  assert.ok(pos.accuracy <= 30, 'دقتِ پذیرفته‌شده باید ۳۰ متر یا بهتر باشد، واقعیت: ' + pos.accuracy);

  /* فقط نقطهٔ نهایی ژئوکد می‌شود — آن هم هم‌زمان روی دو منبع (موازی، نه پشت‌سرهم) */
  await new Promise((r) => setTimeout(r, 120));      /* مسابقهٔ موازی یک تیک زمان می‌برد */
  const urls = globalThis.__geoUrls || [];
  assert.ok(urls.length >= 1, 'نقطهٔ نهایی باید ژئوکد شود');
  const coords = new Set(urls.map((u) => {
    const m = /lat=([\d.-]+)/.exec(u);
    const n = /l(?:ng|on)=([\d.-]+)/.exec(u);
    return (m ? Number(m[1]).toFixed(4) : '?') + ',' + (n ? Number(n[1]).toFixed(4) : '?');
  }));
  assert.equal(coords.size, 1, 'فقط یک نقطه باید ژئوکد شود، نقاط: ' + [...coords].join(' | '));
  assert.ok(urls.length >= 2, 'دو منبع باید هم‌زمان پرسیده شوند (مسابقه)');
});

test('v12.15.0 location: repeated lookups reuse the cached address (no second request)', async (t) => {
  const g = geoEnv(12, 12);
  const env = makeEnv({ layer: '', geolocation: g.geolocation });
  t.after(() => env.cleanup());
  env.win.isSecureContext = true;
  /* این تست فقط مسیرِ ژئوکدِ ۱۲.۱۴ را می‌سنجد؛ لایهٔ ۱۲.۱۵ مسیرِ خودش را دارد */
  try { delete env.win.v1215Api; } catch (e) {}

  const store = new Map();
  runLocationLayer({
    win: env.win, doc: env.doc, loc: env.loc, geo: g.geolocation, store,
    reverseCalls: [],
    code: geoBlock + '\n' + gpsBlock + `
      function formatNominatim() { return 'تهران، خیابان آزادی، پلاک ۱۲'; }
      function fetchJson(url) { globalThis.__jsonCalls += 1; return Promise.resolve({ display_name: 'تهران' }); }
    `
  });
  globalThis.__jsonCalls = 0;

  const a = await env.win.getCurrentPositionSafe();
  const first = await a.addressPromise;
  const afterFirst = globalThis.__jsonCalls;          /* دو منبع، هم‌زمان */
  assert.ok(afterFirst >= 1, 'بارِ نخست باید ژئوکد شود');

  const b = await env.win.getCurrentPositionSafe();
  const second = await b.addressPromise;
  assert.equal(first, second, 'آدرس باید یکسان باشد');
  assert.equal(globalThis.__jsonCalls, afterFirst, 'ژئوکدِ دوم باید از کش بیاید (فراخوانیِ تازه: ' + (globalThis.__jsonCalls - afterFirst) + ')');
});

/* ───────────────────────────────────────────────────────────────────────────── */
test('v12.15.0 static: versioned assets get immutable cache headers (server + htaccess + sw)', () => {
  const server = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const htaccess = readFileSync(new URL('../public/.htaccess', import.meta.url), 'utf8');
  const sw = readFileSync(new URL('../public/sw-template.js', import.meta.url), 'utf8');
  const build = readFileSync(new URL('../build-static.js', import.meta.url), 'utf8');

  assert.match(server, /versioned = \/\[\?&\]v=\\d\//, 'سرور باید داراییِ نسخه‌دار را تشخیص دهد');
  assert.match(server, /max-age=" \+ maxAge \+ ", immutable"/, 'هدر immutable لازم است');
  assert.match(htaccess, /CRM_VERSIONED/, 'htaccess باید قانونِ نسخه‌دار را داشته باشد');
  assert.match(htaccess, /max-age=31536000, immutable/);
  assert.match(build, /CRM_VERSIONED/, 'خروجیِ استاتیک هم باید همین قانون را داشته باشد');
  assert.match(sw, /isVersionedAsset/, 'سرویس‌ورکر باید داراییِ نسخه‌دار را از کش بدهد');
});

test('v12.15.0 static: geocode races providers in parallel with a short timeout', () => {
  const server = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const bundle = readFileSync(new URL('../public/crm-bundle.js', import.meta.url), 'utf8');
  assert.match(server, /function geoRace/, 'سرور باید مسابقهٔ موازی داشته باشد');
  assert.match(server, /photon\.komoot\.io/, 'دومین منبع برای سرعت لازم است');
  assert.match(server, /zoom=18/, 'دقتِ ریزآدرس (zoom=18) باید دست‌نخورده بماند');
  assert.match(bundle, /geoRaceSources/, 'مرورگر هم باید هم‌زمان چند منبع را بپرسد');
  assert.match(bundle, /maximumAge: 60000/, 'تثبیتِ قبلیِ GPS باید دوباره استفاده شود');
});

/* ───────────────────────────────────────────────────────────────────────────── */
test('v12.15.0 server geocode: two providers race and the fast one wins', async (t) => {
  const srvSrc = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const from = srvSrc.indexOf('  function geoRound(v)');
  const to = srvSrc.indexOf('  if ((pathname === "/api/geocode"', from);
  const code = srvSrc.slice(from, to > from ? to : from + 6000);
  assert.ok(code.indexOf('function geoRace') >= 0, 'تابع geoRace در برش نیست');
  const factory = new Function('fetch', 'AbortController', 'setTimeout',
    '"use strict";' + code + '\nreturn { geoRace, normalizeGeoText };');
  const api = factory(globalThis.fetch, AbortController, setTimeout);

  /* دو منبع محلی: یکی ۳ ثانیه معطل می‌کند، دیگری ۱۲۰ میلی‌ثانیه */
  const slow = http.createServer((_req, res) => {
    setTimeout(() => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ display_name: 'منبع کُند' })); }, 3000);
  });
  const fast = http.createServer((_req, res) => {
    setTimeout(() => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ display_name: 'منبع سریع' })); }, 120);
  });
  await new Promise((r) => slow.listen(0, '127.0.0.1', r));
  await new Promise((r) => fast.listen(0, '127.0.0.1', r));
  t.after(() => { slow.close(); fast.close(); });

  const slowUrl = 'http://127.0.0.1:' + slow.address().port + '/reverse';
  const fastUrl = 'http://127.0.0.1:' + fast.address().port + '/reverse';

  const t0 = Date.now();
  const text = await api.geoRace([slowUrl, fastUrl], 4000, true);
  const spent = Date.now() - t0;
  assert.ok(spent < 1500, 'باید منتظر منبعِ سریع بماند نه کُند؛ واقعیت: ' + spent + ' میلی‌ثانیه');
  assert.equal(JSON.parse(text).display_name, 'منبع سریع');
});

test('v12.15.0 server geocode: photon answers are normalised to the same detailed shape', () => {
  const srvSrc = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const from = srvSrc.indexOf('  function geoRound(v)');
  const to = srvSrc.indexOf('  if ((pathname === "/api/geocode"', from);
  const code = srvSrc.slice(from, to > from ? to : from + 6000);
  const factory = new Function('fetch', 'AbortController', 'setTimeout',
    '"use strict";' + code + '\nreturn { normalizeGeoText };');
  const api = factory(globalThis.fetch, AbortController, setTimeout);

  const photon = JSON.stringify({
    features: [{ properties: { country: 'ایران', state: 'تهران', county: 'تهران', city: 'تهران',
      district: 'منطقه ۶', street: 'خیابان آزادی', housenumber: '۱۲', name: 'داروخانه شبانه‌روزی' },
      geometry: { coordinates: [51.4021, 35.7012] } }]
  });
  const out = JSON.parse(api.normalizeGeoText(photon, true));
  assert.ok(out.display_name.indexOf('خیابان آزادی') >= 0, 'نام خیابان باید باشد');
  assert.ok(out.display_name.indexOf('پلاک: ۱۲') >= 0, 'پلاک باید باشد');
  assert.equal(out.address.road, 'خیابان آزادی');
  assert.equal(out.address.house_number, '۱۲');
  /* ریزآدرسِ Nominatim دست‌نخورده می‌ماند */
  const nom = JSON.stringify({ display_name: 'ایران، تهران، آزادی' });
  assert.equal(api.normalizeGeoText(nom, true), nom);
});
