/**
 * v12.18.3 — موتورِ ورود + عیب‌یابیِ بی‌بودجه + میخکوب‌کردنِ کادرها (نوبت ۱۳۹)
 * قانون ۹۲: هر بند با اجرایِ همانِ کدِ مرورگری سنجیده می‌شود.
 *  ۱) crm-entry-engine.js در محیطِ استاب: تمام‌جرّا (حالتِ full)، حالتِ ایمنِ آفلاین (light)،
 *     و «هیچِ درخواستِ نوشتنِ شبکه‌ای» — یعنی دادهٔ سرور هرگز پاک نمی‌شود.
 *  ۲) صفحهٔ ورود: اسکریپتِ موتور بارگذاری می‌شود و «ورود به برنامه» اول موتور را اجرا
 *     می‌کند و بعد واردِ برنامه می‌شود (با سقفِ ۲٫۵ ثانیه).
 *  ۳) عیب‌یابی: پروبِ health/state با XHR خام (عبور از سقفِ بودجه → بودجه‌ی «budget-exhausted» حذف)،
 *     پیامِ آرامِ «کش نیست» پس از پاک‌سازی، ردیفِ موتور با دکمهٔ «🧹 اجرایِ موتور».
 *  ۴) قانونِ «فیلد پیش از کادر»: کادرهایِ طراح (col-user-box) و کارت‌هایِ ثابت (📍 لوکیشن)
 *     از شمارشِ فیلدها بیرون و به انتهایِ گرید میخکوب می‌شوند — CSS order 9500+ و جابه‌جاییِ DOM.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const bundle = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const engineSrc = readFileSync(new URL('public/crm-entry-engine.js', root), 'utf8');
const loginSrc = readFileSync(new URL('public/login.html', root), 'utf8');
const indexSrc = readFileSync(new URL('public/index.html', root), 'utf8');

/* ───────── ۱) موتورِ ورود ───────── */
function elStub() {
  const m = new Map();
  return {
    get length() { return m.size; },
    key: (i) => Array.from(m.keys())[i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    _m: m
  };
}
function evalEngine(env) {
  const netCalls = { fetch: 0, xhr: 0 };
  function fakeWindow(extra) {
    const w = {
      document: env.doc, navigator: env.navigator,
      localStorage: env.ls, sessionStorage: env.ss,
      caches: env.caches, indexedDB: env.indexedDB,
      setTimeout: (fn) => { env.timers.push(fn); return 1; },
      clearTimeout: () => {}, addEventListener: () => {},
      location: { reload() { env.reloads = (env.reloads || 0) + 1; } },
      ...extra
    };
    w.window = w;
    return w;
  }
  const win = fakeWindow({});
  function XHR() { netCalls.xhr++; this.open = () => {}; this.send = () => {}; }
  const fn = new Function('window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'caches', 'indexedDB', 'XMLHttpRequest', 'fetch', 'setTimeout', '"use strict";' + engineSrc + '\nreturn window.crmEntryEngine;');
  const eng = fn(win, env.doc, env.navigator, env.ls, env.ss, env.caches, env.indexedDB, XHR,
    () => { netCalls.fetch++; return Promise.resolve({ ok: true }); }, win.setTimeout);
  return { eng, netCalls, win };
}
function baseEnv(opts) {
  opts = opts || {};
  const ls = elStub(); const ss = elStub();
  (opts.lsInit || [['CRM_OLD_JUNK', '1'], ['CRM_DIAG_LOG', '[]'], ['CRM_APP_STATE_V2', '{"a":1}'], ['CRM_USERS_AUTH', '[]'], ['CRM_V1218_PURGED', '12.18.4']]).forEach(([k, v]) => ls.setItem(k, v));
  if (opts.extraLs) opts.extraLs.forEach(([k, v]) => ls.setItem(k, v));
  const deletedCaches = [];
  const idbDeleted = [];
  return {
    doc: { addEventListener(t, fn) { (this._l = this._l || {})[t] = (this._l[t] || []).concat(fn); } },
    navigator: { onLine: opts.online !== false, serviceWorker: { getRegistrations: () => Promise.resolve([{ unregister() { (opts.swUnregistered = opts.swUnregistered || []); opts.swUnregistered.push(1); } }]) } },
    ls, ss,
    caches: { keys: () => Promise.resolve(['crm-cache-v1']), delete: (k) => { deletedCaches.push(k); return Promise.resolve(true); } },
    indexedDB: { deleteDatabase: (n) => { idbDeleted.push(n); } },
    timers: [], deletedCaches, idbDeleted, opts
  };
}

test('v12.18.3: موتورِ ورود در حالتِ عادی — کش/SW/stateِ محلی جارو می‌شود، امانت‌ها می‌مانند، مُهرِ v12.18 خالی می‌شود', async () => {
  const env = baseEnv({});
  const { eng, netCalls } = evalEngine(env);
  assert.equal(typeof eng.run, 'function', 'API موتور');
  const rep = await eng.run({ from: 'login' });
  assert.equal(rep.mode, 'full');
  assert.ok(!env.ls._m.has('CRM_OLD_JUNK'), 'کلیدِ کهنه پاک شد');
  assert.ok(!env.ls._m.has('CRM_APP_STATE_V2'), 'آینهٔ stateِ محلی پاک شد تا دادهٔ تازه از سرور بیاید');
  assert.ok(env.ls._m.has('CRM_USERS_AUTH'), 'لاگین/کاربران امانت است');
  assert.equal(env.ls._m.get('CRM_V1218_PURGED'), '', 'مُهرِ ریشه‌پاک‌کن خالی شد = مهاجرت/چیدمان دوباره اجرا می‌شود');
  assert.equal(env.deletedCaches.length, 1, 'CacheStorage حذف شد');
  assert.deepEqual(env.idbDeleted, ['crmV19'], 'IndexedDB موقت؛ گاوصندوقِ حجمی دست‌نخورده');
  assert.equal(netCalls.fetch, 0, 'موتور هرگز fetch نمی‌کند');
  assert.equal(netCalls.xhr, 0, 'موتور هرگز XHR نمی‌فرستد → هیچ نوشتن/حذفی روی سرور');
  assert.equal(rep.server, 'untouched');
});

test('v12.18.3: موتور در حالتِ آفلاین با تغییرِ ثبت‌نشده = light — حافظه‌ها دست‌نخورده، فقط کش/SW', async () => {
  const env = baseEnv({ online: false, extraLs: [['CRM_PENDING_SYNC', '[{"k":1}]'], ['CRM_SOLO_OWNER', '1']] });
  const { eng } = evalEngine(env);
  const rep = await eng.run({ from: 'login' });
  assert.equal(rep.mode, 'light', 'آفلاین + صف/سولو → جارویِ حافظه ممنوع');
  assert.ok(env.ls._m.has('CRM_APP_STATE_V2'), 'state محلیِ دارایِ تغییراتِ نابود نمی‌شود');
  assert.ok(env.ls._m.has('CRM_OLD_JUNK'), 'در light چیزی جارو نمی‌شود');
  assert.equal(env.deletedCaches.length, 1, 'با این حال کش پاک شد');
});

test('v12.18.3: صفحهٔ ورود — موتور بارگذاری و پیش ازِ ورود اجرا می‌شود (سقفِ ۲٫۵ ثانیه، بدونِ بلوکه‌شدنِ لاگین)', () => {
  const iEng = loginSrc.indexOf('crm-entry-engine.js');
  const iHook = loginSrc.indexOf('crmEntryEngine.run({ from: "login" })');
  const iNav = loginSrc.indexOf('__enterDone = true');
  assert.ok(iEng > 0 && iHook > 0 && iNav > 0, 'هر سه بخش در login.html هست');
  assert.ok(iEng < iHook, 'اسکریپت قبل از هندلر بارگذاری می‌شود');
  assert.ok(loginSrc.includes('setTimeout(__enter, 2500)'), 'سقفِ زمان برای ورود');
  assert.ok(loginSrc.includes('} catch (eEng) { __enter(); }'), 'خرابیِ موتور هرگز ورود را نمی‌بندد');
  assert.ok(indexSrc.includes('crm-entry-engine.js?v='), 'ایندکس هم موتور را بارگذاری می‌کند (دکمهٔ عیب‌یابی)');
});

/* ───────── ۳) عیب‌یابی ───────── */
test('v12.18.3: عیب‌یابی از پروبِ خامِ XHR استفاده می‌کند (پایانِ «budget-exhausted»)، کشِ پس ازِ جارو = نکته، ردیفِ موتور با دکمه', () => {
  assert.ok(bundle.includes('diagXhr("/api/health")') && bundle.includes('diagXhr("/api/state")'), 'پروب‌ها روی XHR خام');
  const from = bundle.lastIndexOf('v19DiagBody');
  const to = bundle.indexOf('var finished = false;', from);
  const diagRegion = bundle.slice(from, to);
  assert.ok(!/fetch\("\/api\/health"\)/.test(diagRegion), 'fetchِ بودجه‌بندی‌شده در عیب‌یابِ v19 نمانده');
  assert.ok(diagRegion.includes('function diagXhr(url)'), 'هلپر داخلِ همانِ تابع است');
  assert.ok(bundle.includes("ℹ️ نکته"), 'سطحِ info با آیکونِ آرام رندر می‌شود (کش نیست ≠ مشکل)');
  assert.ok(bundle.includes('CRM_ENTRY_1218_RUN'), 'عیب‌یاب می‌داند کشِ خالی پس از جارو طبیعی است');
  assert.ok(bundle.includes("id='crmEngineRunBtn'"), 'دکمهٔ اجرایِ موتور در تب عیب‌یابی');
  assert.ok(engineSrc.includes('crmEngineRunBtn,[data-crm-engine-run]'), 'هندلرِ دکمه داخلِ خودِ موتور است ( delegation )');
});

/* ───────── ۴) کادرها پس ازِ فیلدها ───────── */
test('v12.18.3: قانونِ «فیلدها پیش از کادرها» — کادرِ طراح و کارتِ لوکیشن از رده‌بندیِ فیلد بیرون، به انتهای گرید میخکوب', () => {
  const MARK = '/* v12.18.3 —';
  const from = bundle.indexOf(MARK);
  assert.ok(from > 0, 'لایه پیدا شد');
  const layer = bundle.slice(from);

  const sty = () => { const o = { _v: {}, setProperty(k, v) { o._v[k] = String(v); }, removeProperty(k) { delete o._v[k]; }, getPropertyValue(k) { return o._v[k] == null ? '' : o._v[k]; } }; return o; };
  const mkEl = (cls, fid, isCard) => ({
    nodeType: 1, className: cls, style: sty(), _attrs: {},
    classList: { contains: (c) => String(cls).split(/\s+/).includes(c) },
    getAttribute(k) { return this._attrs[k] != null ? this._attrs[k] : null; },
    setAttribute(k, v) { this._attrs[k] = String(v); },
    querySelector(sel) { if (isCard && /col-user-box-title|geo-suggest-wrap|map-container|#phFileInput/.test(sel)) return { id: 'phFileInput', getAttribute: () => null }; return null; },
    closest() { return null; }
  });
  const locCard = mkEl('form-group full-width', '', true);
  const fA = mkEl('form-group', 'a'); fA.setAttribute('data-col-fid', 'a');
  const userBox = mkEl('col-user-box');
  const fB = mkEl('form-group', 'b'); fB.setAttribute('data-col-fid', 'b');

  const grid = {
    children: [locCard, fA, userBox, fB],
    appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); },
    querySelector() { return null; }
  };
  grid.children.forEach((c) => { c.parentNode = grid; });

  const pane = { querySelector: (sel) => (sel === 'form' ? null : null) };
  const doc = { getElementById: (id) => (id === 'tab-pharmacies' ? pane : null) };
  const win = {
    document: doc,
    state: { formFieldMeta: { pharmacy: { a: { order: 2 }, b: { order: 1 } } }, _lastSavedAt: 1, _designAt: 1 },
    location: { origin: 'https://t.test', search: '', reload() {} },
    localStorage: null, sessionStorage: null,
    navigator: { onLine: true },
    getMainGrid: () => grid,
    getUnifiedFieldList: () => [{ id: 'a', order: 2 }, { id: 'b', order: 1 }],
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    CRM_APP_VERSION: '12.18.4'
  };
  win.window = win;
  const fn = new Function('window', 'document', 'navigator', 'fetch', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'alert', 'MutationObserver', 'Promise',
    '"use strict";' + layer + '\nreturn window.v1218Api;');
  const API = fn(win, doc, win.navigator, () => Promise.resolve({ ok: true }), win.setTimeout, win.setInterval, win.clearTimeout, win.clearInterval, () => {}, undefined, Promise);
  assert.ok(API && typeof API.pinBoxes === 'function', 'API لایه با pinBoxes');

  API.applyOrder('tab-pharmacies', true);
  // فیلدها رتبهٔ ۱/۲ گرفتند؛ کارتِ لوکیشن و کادرِ طراح بیرون از رده‌بندی، در انتهای گرید
  assert.equal(fB.style.getPropertyValue('order'), '1', 'فیلد b اول');
  assert.equal(fA.style.getPropertyValue('order'), '2', 'فیلد a دوم');
  assert.equal(locCard.style.getPropertyValue('order'), '100000', 'کارت لوکیشن = میخکوبِ ثابت، نه رقابتِ فیلدی');
  assert.equal(userBox.style.getPropertyValue('order'), '100000', 'کادرِ طراح میخکوب شد');
  assert.equal(grid.children[grid.children.length - 1], userBox, 'کادرِ طراح فیزیکی به آخرِ گرید رفت');
  assert.ok(grid.children.indexOf(locCard) > grid.children.indexOf(fA) && grid.children.indexOf(locCard) > grid.children.indexOf(fB), 'کارت لوکیشن پس ازِ همهٔ فیلدها');
  // ایدمپوتنت: اجرایِ دوباره نباید چیزی جابه‌جا کند (ضدِ پرش)
  const snapshot = grid.children.slice();
  const n = API.pinBoxes('tab-pharmacies');
  assert.equal(n, 0, 'اجرایِ دوم بی‌اثر: ' + n);
  assert.deepEqual(grid.children, snapshot);
});

test('v12.18.3: برابریِ نسخهٔ 12.18.4 در همهٔ سطوح + بنرِ README', () => {
  const VER = '12.18.4';
  const files = ['package.json', 'public/index.html', 'public/login.html', 'public/index.php', 'public/api.php', 'server.js', 'public/crm-app.js', 'public/crm-hub.js', 'public/sw.js', 'public/sw-template.js', 'public/crm-entry-engine.js'];
  files.forEach((f) => {
    const t = readFileSync(new URL(f, root), 'utf8');
    assert.ok(t.includes(VER), f + ' باید ' + VER + ' را داشته باشد');
  });
  const readme = readFileSync(new URL('README.md', root), 'utf8');
  assert.ok(readme.includes(VER), 'بنرِ README');
  assert.ok(!/12\.18\.0(?!-runtime)/.test(readFileSync(new URL('package.json', root), 'utf8')), 'package.json نسخهٔ کهنه ندارد');
});
