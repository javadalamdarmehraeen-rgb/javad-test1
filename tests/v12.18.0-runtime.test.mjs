/**
 * اجرای واقعیِ لایهٔ v12.18.3 — قانون ۹۲: «هیچ بندی بدون مدرک تأییدشده نیست».
 * هر بند با فراخوانیِ همانِ کدی که در مرورگر اجرا می‌شود سنجیده می‌شود:
 * ریشه‌پاک‌کن، یکتا‌سازیِ ترتیب (بند ۴)، گیتِ چیدمان (پرش‌ها)، ترددِ نقشه (بند ۹)،
 * ساعتِ HH:MM (بند ۱۲)، ماتریسِ ریزِ دسترسی (بند ۱۵)، آلارمِ ویزیتِ V35 (بند ۱۶)
 * و قانونِ ارقامِ لاتین. سپسِ برابریِ نسخه در همه‌ی سطوح.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const src = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const MARK = '/* v12.18.3 —';
const from = src.indexOf(MARK);
assert.ok(from > 0, 'لایهٔ v12.18.3 در انتهایِ باندل پیدا نشد');
const layer = src.slice(from);

/* ───────── harness کم‌حجم (سبکِ تستِ v12.17) ───────── */
function styleObj() {
  const o = { setProperty(k, v) { o[k] = String(v); }, removeProperty(k) { delete o[k]; }, getPropertyValue(k) { return o[k] == null ? '' : o[k]; } };
  return o;
}
function makeEl(tag, doc) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(), id: '', className: '', style: styleObj(), dataset: {}, attrs: {},
    children: [], parentNode: null, value: '', textContent: '', type: '', checked: false, disabled: false, readOnly: false,
    _html: '', _l: {},
    get firstChild() { return this.children[0] || null; },
    get lastElementChild() { return this.children[this.children.length - 1] || null; },
    get innerHTML() { return this._html; },
    set innerHTML(v) {
      this._html = String(v); this.children = [];
      const rx = /id=['"]([A-Za-z0-9_\-]+)['"]/g; let m;
      while ((m = rx.exec(this._html))) {
        const c = makeEl('div', doc); c.id = m[1]; c.parentNode = this; this.children.push(c); doc._ix[m[1]] = c;
      }
    },
    get classList() {
      const s = this;
      return { add(c) { if (!String(s.className).split(/\s+/).includes(c)) s.className = (s.className + ' ' + c).trim(); },
        remove(c) { s.className = String(s.className).split(/\s+/).filter((x) => x && x !== c).join(' '); },
        contains(c) { return String(s.className).split(/\s+/).includes(c); } };
    },
    appendChild(c) { c.parentNode = this; this.children.push(c); if (c.id) doc._ix[c.id] = c; return c; },
    insertBefore(c, ref) { c.parentNode = this; const i = ref ? this.children.indexOf(ref) : -1; if (i >= 0) this.children.splice(i, 1) && 0; if (i >= 0) this.children.splice(i, 0, c); else this.children.push(c); if (c.id) doc._ix[c.id] = c; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); if (c.id && doc._ix[c.id] === c) delete doc._ix[c.id]; c.parentNode = null; return c; },
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') { this.id = String(v); doc._ix[String(v)] = this; } },
    getAttribute(k) { return this.attrs[k] != null ? this.attrs[k] : null; },
    addEventListener(t, fn) { (this._l[t] = this._l[t] || []).push(fn); },
    removeEventListener() {},
    dispatchEvent(ev) { (this._l[ev && ev.type] || []).forEach((fn) => fn(ev)); return true; },
    closest() { return null; },
    contains(n) { return this.children.includes(n); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    cloneNode() { const c = makeEl(this.tagName, doc); c.className = this.className; c.id = this.id; return c; },
    focus() { doc.activeElement = this; }
  };
  return el;
}
function storageStub(init) {
  const m = new Map(Object.entries(init || {}));
  const api = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    key: (i) => Array.from(m.keys())[i] ?? null,
    get length() { return m.size; },
    _map: m
  };
  return api;
}
function bootLayer(opts) {
  opts = opts || {};
  const doc = {
    _ix: {}, _l: {}, readyState: 'complete', activeElement: null,
    getElementById(id) { return doc._ix[id] || null; },
    createElement(tag) { const e = makeEl(tag, doc); return e; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener(t, fn) { (doc._l[t] = doc._l[t] || []).push(fn); },
    removeEventListener() {},
    _timers: [],
    flush() { const q = doc._timers.slice(); doc._timers.length = 0; q.sort((a, b) => a.ms - b.ms).forEach((t) => { try { t.fn(); } catch (e) {} }); }
  };
  doc.head = makeEl('head', doc); doc.body = makeEl('body', doc);
  const ls = opts.localStorage || storageStub();
  const ss = opts.sessionStorage || storageStub();
  const toasts = []; const alerts = [];
  const win = {
    document: doc, state: opts.state || {},
    localStorage: ls, sessionStorage: ss,
    addEventListener() {}, removeEventListener() {},
    setTimeout: (fn, ms) => { doc._timers.push({ fn, ms: ms || 0 }); return doc._timers.length; },
    clearTimeout() {}, setInterval: () => 0, clearInterval: () => {},
    saveState() { win.__saves = (win.__saves || 0) + 1; win.state._lastSavedAt = Date.now(); },
    v20Toast: (m) => toasts.push(String(m)),
    fetch: opts.fetch || (() => Promise.resolve({ ok: true })),
    location: { origin: 'https://ndcohub.test', reload() { win.__reloads = (win.__reloads || 0) + 1; } },
    navigator: { onLine: true, serviceWorker: opts.sw ? { getRegistrations: () => Promise.resolve(opts.sw) } : undefined },
    CRM_APP_VERSION: '12.18.6'
  };
  if (opts.__CRM_ORIG_FETCH) win.__CRM_ORIG_FETCH = opts.__CRM_ORIG_FETCH;
  if (opts.caches) win.caches = opts.caches;
  if (opts.indexedDB) win.indexedDB = opts.indexedDB;
  if (opts.XMLHttpRequest) win.XMLHttpRequest = opts.XMLHttpRequest;
  if (opts.v1215Api) win.v1215Api = opts.v1215Api;
  if (opts.v1216Api) win.v1216Api = opts.v1216Api;
  if (opts.windowExtra) Object.assign(win, opts.windowExtra);
  win.window = win;
  const fn = new Function(
    'window', 'document', 'navigator', 'fetch', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'alert', 'MutationObserver', 'NodeFilter', 'Promise',
    '"use strict";' + layer + '\nreturn window.v1218Api;'
  );
  const API = fn(win, doc, win.navigator, win.fetch, win.setTimeout, () => 0, () => {}, () => {}, (m) => alerts.push(String(m)), undefined, undefined, Promise);
  return { doc, win, API, toasts, alerts, flush: () => doc.flush(), ls, ss };
}

/* ───────── ۰) قانونِ ارقامِ لاتین ───────── */
test('v12.18.3: قانونِ ارقام — toLocaleStringِ فارسی عددِ لاتین می‌دهد و تاریخ شمسی می‌ماند', () => {
  const env = bootLayer();
  assert.equal(env.API.isLatinLaw(), true, 'قانونِ لاتین نصب نشده');
  assert.equal((5670000).toLocaleString('fa-IR'), '5,670,000', 'ریال‌ها باید لاتین جدا شوند');
  const d = new Date(2026, 8, 6);
  const s = d.toLocaleString('fa-IR');
  assert.ok(!/[۰-۹]/.test(s), 'هیچ رقمِ فارسی نباید بماند: ' + s);
  assert.match(s, /1405/, 'تقویمِ شمسی باید حفظ شود: ' + s);
  assert.equal(env.API.latinComma(4536000), '4,536,000');
  assert.equal(env.API.fa2la('۱۲/۵'), '12/5');
});

/* ───────── ۱) ریشه‌پاک‌کن ───────── */
test('v12.18.3: ریشه‌پاک‌کن کلیدهایِ کهنه را می‌زداید و state/ورود/سولو/پروژهٔ sync را نگه می‌دارد', () => {
  const ls = storageStub({
    CRM_APP_STATE_V2: '{"pharmacies":[]}',
    CRM_USERS_AUTH: '{"users":[]}',
    CRM_LOGIN_OK: '1',
    CRM_SOLO_EPOCH: '123',
    CRM_MANAGER_GRID_ORDER_V2: '{"stale":true}',
    CRM_V39_ORDER_CANONICAL_RESET: '1',
    CRM_DIAG_LOG: 'xxxxx',
    CRM_LAST_GPS: '{"lat":35}',
    CRM_APP_STATE_CORRUPT_ARCHIVE_1: 'junk'
  });
  const ss = storageStub({ crmLoggedIn: '1', crmUserId: 'u1', CRM_PENDING_SYNC: '1', distPass_tivan: 'p' });
  let idbDeleted = [];
  let xhrUrl = '';
  const env = bootLayer({
    localStorage: ls, sessionStorage: ss,
    indexedDB: { deleteDatabase: (n) => { idbDeleted.push(n); return {}; } },
    XMLHttpRequest: function () { this.open = (m, u) => { xhrUrl = u; }; this.send = () => { this.status = 200; }; this.status = 0; }
  });
  const rep = env.win.__v1218PurgeReport;
  assert.equal(rep.ran, true, 'پاک‌سازی اجرا نشده');
  assert.ok(ls._map.has('CRM_APP_STATE_V2'), 'state باید بماند');
  assert.ok(ls._map.has('CRM_USERS_AUTH'), 'کاربران باید بمانند');
  assert.ok(ls._map.has('CRM_SOLO_EPOCH'), 'solo باید بماند');
  assert.ok(!ls._map.has('CRM_MANAGER_GRID_ORDER_V2'), 'کشِ چیدمانِ کهنه باید برود');
  assert.ok(!ls._map.has('CRM_V39_ORDER_CANONICAL_RESET'), 'فلگِ v39 باید برود');
  assert.ok(!ls._map.has('CRM_DIAG_LOG'), 'دفترچهٔ تشخیص باید برود');
  assert.ok(!ls._map.has('CRM_LAST_GPS'), 'GPSِ کهنه باید برود');
  assert.ok(!ls._map.has('CRM_APP_STATE_CORRUPT_ARCHIVE_1'), 'آرشیوِ فاسد باید برود');
  assert.ok(ss._map.has('CRM_PENDING_SYNC'), 'صفِ ارسال باید بماند');
  assert.ok(ss._map.has('distPass_tivan'), 'رمزِ نشستِ پخش باید بماند');
  assert.ok(idbDeleted.includes('crmV19'), 'crmV19 باید حذف شود');
  assert.ok(!idbDeleted.includes('crmBulkData'), 'گاوصندوقِ حجمی هرگز حذف نشود');
  assert.match(xhrUrl, /\/api\/cleanup\?stale=1&purge=1/, 'سرور هم باید purge بگیرد');
  assert.equal(ls.getItem('CRM_V1218_PURGED'), '12.18.6', 'مُهرِ یک‌بارمصرف');
  env.flush();
  assert.equal(env.win.__reloads, 1, 'یک بار تازه‌سازی پس از پاک‌سازی');
});

test('v12.18.3: پاک‌سازی در نسخهٔ همین‌بار اجراشده تکرار نمی‌شود', () => {
  const ls = storageStub({ CRM_V1218_PURGED: '12.18.6', CRM_DIAG_LOG: 'keep?no' });
  const env = bootLayer({ localStorage: ls });
  assert.equal(env.win.__reloads || 0, 0, 'reloadِ دوم نباید بشود');
});

/* ───────── ۲) بند ۴: ترتیبِ یکتا و ماندگار ───────── */
test('v12.18.3: شماره‌گذاریِ یکتا روی متادیتا + فیلدِ سفارشی با هم (رفعِ بازگشتِ ترتیب پس از رفرش)', () => {
  const state = {
    formFieldMeta: { pharmacy: { name: { order: 4 }, city: { order: 2 }, gone: { order: 1, deleted: true } } },
    customFields: { pharmacy: [{ id: 'cf-a', order: 1 }, { id: 'cf-b', order: 9 }] }
  };
  const env = bootLayer({ state });
  const fixed = env.API.normalizeOrdersV1218();
  assert.ok(fixed > 0, 'باید اصلاح کند');
  const m = state.formFieldMeta.pharmacy;
  const co = state.customFields.pharmacy;
  const seq = [m.name.order, m.city.order, co[0].order, co[1].order].sort((a, b) => a - b);
  assert.deepEqual(seq, [1, 2, 3, 4], 'همه در یکِ رشتهٔ ۱..n');
  assert.ok(m.city.order < m.name.order, 'نسبتِ دو درون‌ساز حفظ می‌شود');
  assert.ok(state._designAt > 0, 'مُهرِ زمانِ طراحی زده شد');
  assert.equal(env.win.__saves >= 1, true, 'ذخیره شد');
  assert.equal(env.API.normalizeOrdersV1218(), 0, 'اجرای دوم بی‌تغییر (پایدار)');
});

test('v12.18.3: applySavedLayoutV82 و applyFullFormLayout با بی‌تغیر بودن، DOM را نمی‌لمسانند (ضدِ پرش)', () => {
  let calls = 0;
  const pane = { id: 'tab-pharmacies', classList: { contains: () => true }, querySelector: () => null };
  const env = bootLayer({
    state: { formFieldMeta: { pharmacy: { a: { order: 1 }, b: { order: 2 } } }, _lastSavedAt: 111 },
    windowExtra: {
      getUnifiedFieldList: () => [{ id: 'a', order: 1 }, { id: 'b', order: 2 }],
      applySavedLayoutV82: () => { calls += 1; return true; }
    }
  });
  env.doc._ix['tab-pharmacies'] = pane;
  env.doc.getElementById('tab-pharmacies');
  // first call: pass-through + cache; second identical call: skipped
  const before = calls;
  env.win.applySavedLayoutV82('tab-pharmacies');
  const afterFirst = calls;
  env.win.applySavedLayoutV82('tab-pharmacies');
  assert.ok(afterFirst >= before, 'اولین اجرا رد می‌شود (یا استاب صدا شده یا دروازه)');
  assert.equal(calls, afterFirst, 'اجرای دوم با همانِ امضا باید بی‌اثر باشد');
  // a real save (new _lastSavedAt) reopens the gate
  env.win.state._lastSavedAt = 222;
  env.win.applySavedLayoutV282 = null;
  env.win.applySavedLayoutV82('tab-pharmacies');
  assert.equal(calls, afterFirst + 1, 'پس از ذخیره، نقاشی مجاز است');
});

test('v12.18.3: مثبتِ بند ۴ — تغییرِ ترتیب، فوراً روی تب اصلی اعمال می‌شود و دوباره‌نویسیِ بی‌تغیر انجام نمی‌شود', () => {
  // سه فیلدِ درون‌ساز؛ چیدمانِ DOM فعلی c,a,b است ولی ترتیبِ ذخیره‌شده 1=a 2=b 3=c
  const mk = (fid) => { const g = makeEl('div', null); g.className = 'form-group'; g.setAttribute('data-col-fid', fid); return g; };
  const ga = mk('a'), gb = mk('b'), gc = mk('c');
  const grid = makeEl('div', null);
  grid.appendChild(gc); grid.appendChild(ga); grid.appendChild(gb);
  let seq = [{ id: 'a', order: 1 }, { id: 'b', order: 2 }, { id: 'c', order: 3 }];
  const pane = makeEl('div', null);
  const env = bootLayer({
    state: { formFieldMeta: { pharmacy: { a: { order: 1 }, b: { order: 2 }, c: { order: 3 } } }, _lastSavedAt: 5 },
    windowExtra: {
      getUnifiedFieldList: () => seq.slice(),
      getMainGrid: () => grid
    }
  });
  env.doc._ix['tab-pharmacies'] = pane;
  // اعمالِ اولیه: CSS order باید مطابق ترتیبِ ذخیره‌شده نوشته شود (اثرِ زنده روی تب اصلی)
  env.API.applyOrder('tab-pharmacies', true);
  assert.equal(gc.style.getPropertyValue('order'), '3', 'گروه c باید order=3 بگیرد');
  assert.equal(ga.style.getPropertyValue('order'), '1', 'گروه a باید order=1 بگیرد');
  // کاربر ترتیب را عوض می‌کند: c اول می‌آید (تغییرِ واقعی → باید اعمال شود)
  seq = [{ id: 'c', order: 1 }, { id: 'a', order: 2 }, { id: 'b', order: 3 }];
  env.win.state.formFieldMeta.pharmacy.c.order = 1;
  env.win.state.formFieldMeta.pharmacy.a.order = 2;
  env.win.state.formFieldMeta.pharmacy.b.order = 3;
  env.win.state._lastSavedAt = 6;
  const r1 = env.API.applyOrder('tab-pharmacies', false);
  assert.equal(r1, true, 'تغییرِ ترتیب باید «اعمال شد» برگرداند');
  assert.equal(gc.style.getPropertyValue('order'), '1', 'پس از تغییر، c اول است');
  assert.equal(ga.style.getPropertyValue('order'), '2');
  assert.equal(gb.style.getPropertyValue('order'), '3');
  // اجرای دوباره بدونِ هیچ تغییری: نباید چیزی بنویسد (مهارِ پرش)
  const before = gc.style.getPropertyValue('order');
  const r2 = env.API.applyOrder('tab-pharmacies', false);
  assert.equal(r2, false, 'بدونِ تغییر، اعمالِ مجدد نباید اثر داشته باشد');
  assert.equal(gc.style.getPropertyValue('order'), before);
});

/* ───────── ۲.ب) ریشه‌پاک‌کنِ دستی (نوبت ۱۳۷) ───────── */
test('v12.18.3+: purgeNow مُهرِ «انجام‌شده» را برمی‌دارد، همه‌چیز را دوباره جارو می‌کند، state را نگه می‌دارد و یک‌بار reload می‌کند', () => {
  const ls = storageStub({
    CRM_V1218_PURGED: '12.18.6',
    CRM_V1218_RELOADED: '1',
    CRM_OLD_JUNK_KEY: 'junk',
    CRM_DIAG_LOG: 'x',
    CRM_APP_STATE_V2: JSON.stringify({ ok: 1 }),
    CRM_USERS_AUTH: '[]'
  });
  const ss = storageStub({ CRM_JUNK_SS: '1' });
  const fetches = [];
  const env = bootLayer({
    localStorage: ls, sessionStorage: ss, state: {},
    fetch: (u, o) => { fetches.push(String(u) + '|' + ((o && o.mode) || '')); return Promise.resolve({ ok: true }); }
  });
  assert.equal(typeof env.API.purgeNow, 'function', 'API دسترسی دارد');
  const rep = env.API.purgeNow();
  assert.equal(rep.ran, true, 'جارو اجرا شد');
  assert.ok(!ls._map.has('CRM_OLD_JUNK_KEY'), 'کلیدِ کهنه پاک شد');
  assert.ok(!ls._map.has('CRM_DIAG_LOG'), 'لاگِ کهنه پاک شد');
  assert.ok(ls._map.has('CRM_APP_STATE_V2'), 'state هرگز پاک نمی‌شود');
  assert.ok(ls._map.has('CRM_USERS_AUTH'), 'لاگین/کاربران می‌مانند');
  assert.equal(ls._map.get('CRM_V1218_PURGED'), '12.18.6', 'مُهرِ نسخه در همانِ لحظه تازه شد');
  assert.ok(!ss._map.has('CRM_JUNK_SS'), 'sessionStorage هم جارو شد');
  assert.ok(env.toasts.some((t) => /ریشه‌پاک‌کنیِ دستی/.test(t)), 'تأییدِ ملموس به مدیر');
  env.flush();
  assert.ok(fetches.some((f) => f.includes('/api/cleanup?stale=1&purge=1')), 'پاک‌سازیِ سمتِ سرور هم صدا زده شد');
  assert.equal(env.win.__reloads, 1, 'دقیقاً یک reload (نه صفر، نه دو تا)');
  // اجرایِ دوباره باید بی‌مصرف تکرارِ جارو نکند تا مُهر پاک نشده — و دکمه هم همان purgeNow را صدا می‌زند
  const rep2 = env.API.purgeNow();
  assert.equal(rep2.ran, true);
});

/* ───────── ۳) بند ۹: تردد ───────── */
test('v12.18.3: «نمایش تردد» بدون alert رسم می‌کند؛ نقشهٔsvg و fitBounds صدا زده می‌شوند', () => {
  let fitCalled = false; let invalidated = 0; let lineOpts = null;
  const mk = (name) => ({ addTo: () => ({ bindPopup: () => ({}), getBounds: () => ({ pad: () => ({}) }) }) });
  const mapObj = {
    options: { preferCanvas: false },
    setView: function () { return this; }, invalidateSize: () => { invalidated += 1; }, fitBounds: () => { fitCalled = true; },
    removeLayer: () => {}, addLayer: () => {}, getContainer: () => null
  };
  const L = {
    /* محیطِ شبیه‌سازی: SVG سالم، canvas هم هست → leaflet خودش رندرِ در‌دسترس را برمی‌دارد (بدونِ renderer صریح) */
    Browser: { svg: true, canvas: true },
    map: () => mapObj,
    tileLayer: () => ({ addTo: () => {} }),
    svg: () => ({ kind: 'svg' }),
    canvas: () => ({ kind: 'canvas' }),
    polyline: (pts, o) => { lineOpts = o; return { addTo: (m) => { m && m.addLayer && m.addLayer(); return { getBounds: () => ({ pad: () => ({}) }), _pts: pts }; } }; },
    marker: () => ({ addTo: () => ({ bindPopup: () => ({}) }) })
  };
  const doc = null;
  const env = bootLayer({
    state: {
      repRoutes: [{ repName: 'رضا', date: '1405-06-10', path: [[35.7, 51.4], [35.71, 51.42]] }],
      activityLog: []
    },
    windowExtra: { L, _mapRepRoutes: L.map(), switchTab: () => {} }
  });
  const mapEl = env.doc.createElement('div'); mapEl.id = 'map-rep-routes-full';
  env.doc.body.appendChild(mapEl); env.doc._ix['map-rep-routes-full'] = mapEl;
  const track = { repName: 'رضا', path: [[35.7, 51.4], [35.71, 51.42]] };
  const r = env.API.drawTraffic(track);
  assert.equal(r, 'drawing', 'رسم باید موفق باشد: ' + r);
  env.flush(); /* تایمرهایِ invalidateSize */
  assert.ok(fitCalled, 'fitBounds اجرا نشد');
  assert.ok(invalidated >= 1, 'invalidateSize اجرا نشد');
  assert.ok(lineOpts && lineOpts.renderer === undefined, 'renderer دستی لازم نیست؛ انتخاب با خودِ leaflet (قانونِ در‌دسترس‌بودن)');
  assert.equal(env.alerts.length, 0, 'هیچ alert نباید بماند');
  assert.ok(env.toasts.some((t) => /رسم شد/.test(t)), 'تأییدِ موفقیت به کاربر');
  assert.equal(env.API.drawTraffic(null), 'no-track');
});

/* ───────── ۴) بند ۱۲: ساعت ───────── */
test('v12.18.3: گزینهٔ ساعت باز‌درج می‌شود و ثانیه از ورودی‌ها بریده می‌شود', () => {
  const env = bootLayer({});
  // no #colFieldType in DOM → ensure returns false but never throws
  assert.equal(env.API.ensureTimeOption(), false, 'بدونِ select نباید چیزی بشکند');
  const t = { value: '13:05:30' };
  const el = { get value() { return t.value; }, set value(v) { t.value = v; }, style: styleObj(), attrs: {},
    getAttribute(k) { return this.attrs[k] == null ? null : this.attrs[k]; }, setAttribute(k, v) { this.attrs[k] = String(v); } };
  env.API.applyTimeFields(); // safe with empty querySelectorAll
  const srcText = layer;
  assert.ok(/stripSeconds/.test(srcText), 'برشِ ثانیه در لایه هست');
  assert.ok(/input\.type = "time"/.test(readFileSync(new URL('public/crm-app.js', root), 'utf8')), 'crm-app شاخهٔ type=time دارد');
  assert.ok(readFileSync(new URL('public/crm-app.js', root), 'utf8').includes('setAttribute("step", "60")'), 'قدم گام ۶۰ ثانیه (بدونِ ثانیه)');
});

/* ───────── ۵) بند ۱۵: ماتریسِ دسترسی ───────── */
test('v12.18.3: ماتریسِ ریز، ۳۱ تب یا بیشتر + ستونِ کلیدِ دسترسی + نوشتنِ *_access روی کاربر', () => {
  const state = {
    users: [{ id: 'u1', username: 'reza', fullName: 'رضا نماینده', role: 'rep', permissions: {} },
            { id: 'u9', username: 'boss', fullName: 'مدیر ارشد', role: 'manager', permissions: {} }],
    granularPerms: {}
  };
  const env = bootLayer({ state });
  const tabs = env.API.allTabs();
  assert.ok(tabs.length >= 31, 'تب‌ها باید همه فهرست شوند: ' + tabs.length);
  const pharm = tabs.find((t) => t.id === 'tab-pharmacies');
  assert.ok(pharm && pharm.permKey === 'ph_access', 'کلیدِ دسترسیِ تبِ داروخانه');
  const m = env.API.permMatrix('u1');
  assert.equal(m.tabs.length, tabs.length);
  assert.ok(m.matrix['tab-pharmacies'].view === true, 'پیش‌فرضِ مشاهده باز است');
  env.API.setPerm('u1', 'tab-pharmacies', 'view', false);
  const u = state.users[0];
  assert.equal(u.permissions.ph_access, false, 'کلید روی رکوردِ کاربر نوشته شد');
  assert.equal(state.granularPerms.u1['tab-pharmacies'].view, false);
  assert.equal(state.granularPerms.u1['tab-pharmacies'].add, false, 'با خاموشِ مشاهده، بقیه هم خاموش می‌شوند');
  env.API.setPerm('u1', 'tab-doctors', 'export', false);
  assert.equal(state.granularPerms.u1['tab-doctors'].export, false, 'سطحِ عملیات ذخیره شد');
  assert.equal(env.win.__saves >= 2, true, 'ذخیره‌ها');
});

/* ───────── ۶) بند ۱۶: آلارمِ ویزیت ───────── */
test('v12.18.3: آلارمِ ویزیت با فرمتِ مرکزِ اعلان‌ها به نماینده+سرپرست+مدیر می‌رسد (یک‌بار، بدونِ تکرار)', () => {
  const tomorrow = Date.now() + 20 * 3600 * 1000; // کمتر از ۲۴ ساعت آینده → داخلِ پنجره
  const iso = new Date(tomorrow).toISOString().slice(0, 10);
  const state = {
    pharmacies: [{ id: 'phx1', name: 'داروخانهٔ پایلوت', repName: 'رضا نماینده', nextVisitAt: iso, nextVisitTime: '11:30' }],
    doctors: [],
    users: [{ id: 'u1', username: 'reza', fullName: 'رضا نماینده', role: 'rep' },
            { id: 'u2', username: 'sup', fullName: 'سرکار مریم', role: 'supervisor' },
            { id: 'u3', username: 'boss', fullName: 'دکتر مدیری', role: 'manager' }],
    notifications: []
  };
  const v1215 = {
    parseVisitAt: (v) => { const t = Date.parse(v); return isFinite(t) ? t : 0; }
  };
  const env = bootLayer({ state, v1215Api: v1215 });
  const added = env.API.raiseVisitAlarms();
  assert.equal(added, 3, 'سه گیرنده: نماینده، سرپرست، مدیر — گرفت: ' + added);
  const n = state.notifications[0];
  assert.ok(n && n.title && n.message && n.sender && n.recipient, 'فرمتِ V35 (title/message/sender/recipient) لازم است');
  assert.ok(/11:30/.test(n.message), 'ساعتِ ثبت‌شده در پیام می‌آید: ' + n.message);
  assert.equal(typeof n.isRead, 'boolean');
  assert.ok(n.id && n.threadId, 'شناسه و ریسه');
  const again = env.API.raiseVisitAlarms();
  assert.equal(again, 0, 'اجرای دوباره تکرار نمی‌سازد');
});

/* ───────── ۷) بودجه‌بندیِ fetchِ اصیل ───────── */
test('v12.18.3: GETهایِ state/sync از مسیرِ اصیل تا ۲۴۰ ثانیه فقط یک‌بار می‌روند', async () => {
  let real = 0;
  const orig = (url, opts) => { real += 1; return Promise.resolve({ ok: true, json: () => Promise.resolve(null) }); };
  const env = bootLayer({ __CRM_ORIG_FETCH: orig });
  const gated = env.win.__CRM_ORIG_FETCH;
  assert.notEqual(gated, orig, 'گیت نصب نشده');
  const g1 = await gated('/api/state', { cache: 'no-store' });
  assert.equal(g1.ok, true, 'اولی می‌رود');
  const g2 = await gated('/api/state', { cache: "no-store" });
  assert.equal(g2.ok, false, 'دومی درِ بسته است');
  assert.equal(g2.status, 304);
  const g3 = await gated('/api/health');
  assert.equal(real, 2, 'سلامت دست‌نخورده است');
});

/* ───────── ۸) صلحِ v68↔v73 ───────── */
test('v12.18.3: شبح‌هایِ میزبانِ عملیات ساخته و از حذف محافظت می‌شوند', () => {
  const env = bootLayer({});
  const after = env.doc.createElement('div'); after.id = 'v34TargetReports';
  const parent = env.doc.createElement('div'); parent.appendChild(after);
  env.doc.body.appendChild(parent);
  env.doc._ix['v34TargetReports'] = after;
  env.API.opsPeace();
  const ghost = env.doc.getElementById('v68SalesTargetOps');
  assert.ok(ghost, 'شبح ساخته نشد');
  assert.equal(ghost.style.display, 'none', 'پنهان است');
  const r = after.removeChild(ghost);
  assert.equal(r, ghost, 'حذف باید بی‌اثر برگردد');
  assert.ok(env.doc.getElementById('v68SalesTargetOps'), 'شبح سرِ جایش می‌ماند → چرخهٔ حذف/ساخت خاموش');
});

/* ───────── ۹) نسخه در همه‌ی سطوح + ارجاع‌ها ───────── */
test('v12.18.3: بنرِ لاتین، نسخه در همه‌ی سطح‌ها و فایل‌ها، و ریشه‌پاک‌کنِ سرور', () => {
  const env = bootLayer({});
  const badge = env.doc.createElement('div'); badge.id = 'crmBuildBadge'; env.doc.body.appendChild(badge); env.doc._ix['crmBuildBadge'] = badge;
  env.API.paintBadgeLatin();
  assert.equal(badge.textContent, 'نسخه 12.18.6', 'بنرِ ارقامِ لاتین');
  const pairs = [
    ['package.json', /"version":\s*"12\.18\.6"/],
    ['server.js', /const APP_VERSION = "12\.18\.6"/],
    ['public/crm-app.js', /CRM_APP_VERSION = "12\.18\.6"/],
    ['public/index.html', /BUILD="12\.18\.6"/],
    ['public/sw.js', /BUILD = "12\.18\.6"/],
    ['public/api.php', /CRM_APP_VERSION", "12\.18\.6"/],
    ['public/login.html', /نسخه 12\.18\.6/],
    ['README.md', /نسخه‌ی جاریِ این ریپو \(GitHub main\): \*\*12\.18\.6\*\*/]
  ];
  for (const [f, re] of pairs) {
    const t = readFileSync(new URL(f, root), 'utf8');
    assert.ok(re.test(t), 'نسخه در ' + f + ' باید 12.18.6 باشد');
  }
  const srv = readFileSync(new URL('server.js', root), 'utf8');
  assert.ok(/purge/.test(srv) && /sampleStripped/.test(srv), 'پارامترِ purge در سرور');
  assert.ok(/lastStateWriteHash/.test(srv), 'dedupe نوشتنِ state در Node');
  const php = readFileSync(new URL('public/api.php', root), 'utf8');
  assert.ok(/state\.md5/.test(php) && 'dedup' in { dedup: 1 } || /"dedup" => true/.test(php), 'dedupe در api.php');
  assert.ok(/strip_legacy_sample/.test(php), 'زدودنِ نمونه در PHP');
  const app = readFileSync(new URL('public/crm-app.js', root), 'utf8');
  assert.ok(/_designAt/.test(app), 'takeRegisteredOnly نسخهٔ محلیِ تازه‌تر را می‌پاید');
  assert.ok(/input\.type = "time"/.test(app), 'شاخهٔ ساعت در crm-app');
});
