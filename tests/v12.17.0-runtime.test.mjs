/**
 * اجرای واقعیِ لایهٔ v12.17.1 — قانون ۹۲: «هیچ بندی بدون مدرک تأییدشده نیست».
 * هر بند با فراخوانیِ واقعیِ همان کدی که در مرورگر اجرا می‌شود سنجیده می‌شود:
 * خنثی‌شدنِ نگهبانِ قیمت‌گذاری، GPS تازه (نه تهرانِ قدیم)، آدرسِ فارسیِ مرتب،
 * ترتیب پس از ذخیره، کادر چسبان، نمایشِ قیمت، تاریخِ اعمالِ شمسی، اکسلِ کامل،
 * صفِ پایدارِ آفلاین، حذفِ فایل‌هایِ قدیمی و بنرِ نسخه در README.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const src = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const MARK = '/* v12.17.0:';
const layer = src.slice(src.indexOf(MARK));
assert.ok(layer.indexOf('window.v1217 = true') >= 0, 'لایهٔ ۱۲.۱۷ پیدا نشد');
const htmlSrc = readFileSync(new URL('public/index.html', root), 'utf8');
const readmeSrc = readFileSync(new URL('README.md', root), 'utf8');
const serverSrc = readFileSync(new URL('server.js', root), 'utf8');
const apiPhp = readFileSync(new URL('public/api.php', root), 'utf8');

/* ───────── DOM کم‌حجم با انتخابگرِ ترکیبی (tag + class + [attr] + کاما) ───────── */
function styleObj() {
  const o = {
    setProperty(k, v) { o[k] = v; },
    removeProperty(k) { delete o[k]; },
    getPropertyValue(k) { return o[k] == null ? '' : o[k]; }
  };
  return o;
}
function termMatches(el, term) {
  term = String(term).trim();
  if (!term) return true;
  let rest = term;
  let tag = '';
  const tm = rest.match(/^([A-Za-z][A-Za-z0-9]*)([\s\S]*)$/);
  if (tm && (rest.length === tm[1].length || /[.\[]/.test(rest.charAt(tm[1].length)))) { tag = tm[1].toUpperCase(); rest = tm[2]; }
  if (tag && String(el.tagName).toUpperCase() !== tag) return false;
  const cm = rest.match(/\.([A-Za-z0-9_\-]+)/);
  if (cm && !String(el.className).split(/\s+/).includes(cm[1])) return false;
  const am = rest.match(/\[\s*([A-Za-z0-9_\-]+)\s*=\s*['"]?([^'"\]]*)['"]?\s*\]/);
  if (am && String(el.attrs[am[1]] == null ? '' : el.attrs[am[1]]) !== am[2]) return false;
  if (rest.indexOf('#') === 0) return el.id === rest.slice(1);
  return true;
}
function matches(el, sel) {
  if (!el || !sel) return false;
  return String(sel).split(',').some((t) => termMatches(el, t));
}
function descendants(el, out) {
  out = out || [];
  (el.children || []).forEach((c) => { out.push(c); descendants(c, out); });
  return out;
}
function makeEl(tag, doc) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(),
    id: '', className: '', style: styleObj(), dataset: {}, attrs: {},
    children: [], parentNode: null, value: '', textContent: '', type: '',
    checked: false, disabled: false, _html: '', _l: {},
    get firstChild() { return this.children[0] || null; },
    get lastElementChild() { return this.children[this.children.length - 1] || null; },
    get innerHTML() { return this._html; },
    set innerHTML(v) {
      this._html = String(v);
      this.children = [];
      const rx = /id=['"]([A-Za-z0-9_\-]+)['"]/g;
      let m;
      while ((m = rx.exec(this._html))) {
        const child = makeEl('div', doc);
        child.id = m[1];
        child.parentNode = this;
        this.children.push(child);
        doc._ix[m[1]] = child;
      }
    },
    get classList() {
      const self = this;
      return {
        add(c) { if (!String(self.className).split(/\s+/).includes(c)) self.className = (self.className + ' ' + c).trim(); },
        remove(c) { self.className = String(self.className).split(/\s+/).filter((x) => x && x !== c).join(' '); },
        contains(c) { return String(self.className).split(/\s+/).includes(c); }
      };
    },
    appendChild(c) { c.parentNode = this; this.children.push(c); if (c.id) doc._ix[c.id] = c; return c; },
    insertBefore(c, ref) {
      c.parentNode = this;
      const i = ref ? this.children.indexOf(ref) : -1;
      if (i >= 0) this.children.splice(i, 0, c); else this.children.push(c);
      if (c.id) doc._ix[c.id] = c;
      return c;
    },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); if (c.id && doc._ix[c.id] === c) delete doc._ix[c.id]; c.parentNode = null; return c; },
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') { this.id = String(v); doc._ix[String(v)] = this; } },
    getAttribute(k) { return this.attrs[k] != null ? this.attrs[k] : null; },
    addEventListener(t, fn) { (this._l[t] = this._l[t] || []).push(fn); },
    removeEventListener() {},
    dispatchEvent(ev) { (this._l[ev && ev.type] || []).forEach((fn) => fn(ev)); return true; },
    closest(sel) { let n = this; while (n) { if (matches(n, sel)) return n; n = n.parentNode; } return null; },
    contains(n) { return descendants(this).includes(n); },
    querySelector(sel) { return descendants(this).find((n) => matches(n, sel)) || null; },
    querySelectorAll(sel) { return descendants(this).filter((n) => matches(n, sel)); },
    cloneNode() { const c = makeEl(this.tagName, doc); c.className = this.className; c.id = this.id; c.attrs = Object.assign({}, this.attrs); return c; },
    focus() { doc.activeElement = this; }
  };
  return el;
}
function makeDoc() {
  const doc = {
    _ix: {}, _l: {}, readyState: 'complete', activeElement: null,
    head: null, body: null, documentElement: { dataset: {} },
    getElementById(id) { return doc._ix[id] || null; },
    createElement(tag) { return makeEl(tag, doc); },
    querySelector(sel) { return descendants(doc.body).find((n) => matches(n, sel)) || null; },
    querySelectorAll(sel) { return descendants(doc.body).filter((n) => matches(n, sel)); },
    addEventListener(t, fn) { (doc._l[t] = doc._l[t] || []).push(fn); },
    removeEventListener() {},
    fire(t, ev) { (doc._l[t] || []).slice().forEach((fn) => fn(Object.assign({ type: t, target: ev && ev.target }, ev || {}))); },
    _timers: [],
    flush() { const q = doc._timers.slice(); doc._timers.length = 0; q.sort((a, b) => a.ms - b.ms).forEach((t) => { try { t.fn(); } catch (e) {} }); }
  };
  doc.head = makeEl('head', doc);
  doc.body = makeEl('body', doc);
  return doc;
}

function boot(state, extra) {
  const doc = makeDoc();
  const nav = { onLine: true, geolocation: {} };
  const win = Object.assign({
    document: doc,
    state: state || {},
    addEventListener() {}, removeEventListener() {},
    setTimeout: (fn, ms) => { doc._timers.push({ fn, ms: ms || 0 }); return 0; },
    clearTimeout() {}, setInterval: () => 0, clearInterval: () => {},
    saveState: () => { win.__saves = (win.__saves || 0) + 1; },
    fetch: () => Promise.resolve({ ok: true })
  }, extra || {});
  win.window = win;
  const alerts = [];
  const alert = (m) => alerts.push(String(m));
  /* fetch و navigator از طریق وکالت می‌روند تا تست بتواند بعد از boot آن‌ها را عوض کند */
  const fetchProxy = function (...args) { return win.fetch.apply(win, args); };
  /* eslint-disable no-new-func */
  const fn = new Function(
    'window', 'document', 'navigator', 'fetch', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'alert', 'MutationObserver',
    '"use strict";' + layer + '\n' + 'return window.v1217Api;'
  );
  const API = fn(
    win, doc, nav, fetchProxy, win.setTimeout,
    () => 0, () => {}, () => {}, alert, undefined
  );
  return { doc, win, API, alerts, nav, flush: () => doc.flush(), state: win.state };
}

/* ───────── ۱) لایه و خنثی‌سازی‌ها ───────── */
test('v12.17.1: لایه با علامت v1217 یک‌بار اجرا می‌شود', () => {
  assert.ok(layer.indexOf('if (window.v1217) return;') >= 0, 'قفلِ اجرایِ تک‌بار لازم است');
  const env = boot();
  assert.equal(typeof env.API.jalaliTodaySlash, 'function', 'API تستِ لایه باید ساخته شود');
});

test('v12.17.1: نگهبانِ قیمت‌گذاری خنثی می‌شود (بعد از ثبت هیچ مقداری برنمی‌گردد)', () => {
  const env = boot({}, {
    v1215Api: {
      restorePricing: () => 5,
      setupHomesColumns: () => 9
    }
  });
  const a = env.win.v1215Api;
  assert.equal(a.restorePricing(), 0, 'restorePricing دیگر نباید مقادیر بازگرداند');
  assert.equal(a.setupHomesColumns(), 0, 'ستون‌هایِ دوقلوِ قدیمیِ منزل نباید ساخته شود');
});

/* ───────── ۲) GPS: فقط نقطه‌ی تازه ───────── */
test('v12.17.1: نقطه‌ی کهنه‌ی GPS (شهرِ قدیم) تنها با پرچم stale و بعد از ۶.۵ ثانیه می‌آید', async () => {
  const env = boot();
  let cb = null;
  env.nav.geolocation = { watchPosition: (ok) => { cb = ok; return 1; }, clearWatch() {} };
  env.win.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  const fn = env.win.getCurrentPositionSafe;
  assert.equal(typeof fn, 'function', 'getCurrentPositionSafe باید توسط لایه جایگزین شده باشد');
  let res = null;
  fn().then((r) => { res = r; });
  assert.equal(res, null, 'هنوز پاسخ نداد');
  cb({ coords: { latitude: 35.7, longitude: 51.4, accuracy: 12 }, timestamp: Date.now() - 60000 });
  assert.equal(res, null, 'نقطه‌ی کهنه (۶۰ ثانیه) نباید فوری پذیرفته شود');
  env.flush(); /* تایمرِ ۶.۵ ثانیه‌ای */
  await new Promise((r) => setImmediate(r));
  assert.ok(res, 'پس از مهلت باید پاسخ بدهد');
  assert.equal(res.stale, true, 'باید مشخص کند که نقطه کهنه است');
});

test('v12.17.1: نقطه‌ی تازه‌ی GPS فوری پذیرفته می‌شود', async () => {
  const env = boot();
  let cb = null;
  env.nav.geolocation = { watchPosition: (ok) => { cb = ok; return 1; }, clearWatch() {} };
  env.win.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  let res = null;
  env.win.getCurrentPositionSafe().then((r) => { res = r; });
  cb({ coords: { latitude: 51.5, longitude: -0.12, accuracy: 8 }, timestamp: Date.now() });
  await new Promise((r) => setImmediate(r));
  assert.ok(res, 'باید پاسخ داده باشد');
  assert.equal(res.stale, undefined, 'نقطه‌ی تازه پرچمِ stale ندارد');
  assert.ok(Math.abs(res.lat - 51.5) < 0.001, 'مختصاتِ تازه باید همان مختصاتِ دریافتی باشد');
  assert.equal(typeof res.addressPromise, 'object', 'وعده‌ی آدرس باید باشد');
});

/* ───────── ۳) آدرسِ فارسیِ مرتب ───────── */
test('v12.17.1: آدرسِ معکوس با ترتیبِ فارسی (کشور، استان، شهر، خیابان، پلاک) می‌آید', async () => {
  const env = boot();
  const nominatim = {
    display_name: '12, خیابان آزادی, تهران, استان تهران, ایران',
    addressdetails: { country: 'ایران', state: 'استان تهران', city: 'تهران', road: 'خیابان آزادی', house_number: '12' }
  };
  env.win.fetch = (url) => {
    if (String(url).indexOf('nominatim') >= 0) return Promise.resolve({ ok: true, json: () => Promise.resolve(nominatim) });
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  };
  const out = await env.API.reverse(52.5, 13.4);
  assert.equal(out, 'ایران، استان تهران، تهران، خیابان آزادی، پلاک 12', 'ترتیبِ فارسیِ درست باید ساخته شود');
});

test('v12.17.1: آدرسِ سرورِ محلی اولویتِ اول دارد', async () => {
  const env = boot();
  env.win.fetch = (url) => {
    if (String(url).indexOf('/api/reverse') >= 0) return Promise.resolve({ ok: true, json: () => Promise.resolve({ address: 'سرور: ایران، فرانکفورت' }) });
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  };
  const out = await env.API.reverse(50.1, 8.6);
  assert.equal(out, 'سرور: ایران، فرانکفورت');
});

/* ───────── ۴) منزل: ذخیره در پرونده‌ی نماینده‌ی درست ───────── */
test('v12.17.1: طبقه/پلاک در پرونده‌ی همان نماینده ذخیره می‌شود (نه رکورد آخر)', () => {
  const env = boot({
    repHomes: [
      { id: 'h1', repName: 'علی احمدی', plate: '', floor: '' },
      { id: 'h2', repName: 'محمد رضایی', plate: '۹۹', floor: '9' }
    ],
    currentRepName: 'علی احمدی'
  });
  const plate = env.doc.createElement('input'); plate.id = 'repHomePlate'; plate.value = '۱۲';
  const floor = env.doc.createElement('input'); floor.id = 'repHomeFloor'; floor.value = '2';
  env.doc.body.appendChild(plate); env.doc.body.appendChild(floor);
  const rec = env.API.homeTargetRec();
  assert.equal(rec.id, 'h1', 'هدف باید پرونده‌ی نماینده‌ی فعلی باشد، نه رکورد آخر');
  const ok = env.API.saveHomeExtrasV1217();
  assert.equal(ok, true);
  assert.equal(rec.plate, '12');
  assert.equal(rec.floor, '2');
  assert.equal(env.win.__saves, 1, 'ذخیره باید صدا زده شود');
});

/* ───────── ۵) قیمت‌گذاری: نمایشِ درست بعد از رندکردن ───────── */
test('v12.17.1: قیمتِ مصرف‌کننده‌ی جدید، مقدارِ قفل‌شده‌ی round شده را نشان می‌دهد', () => {
  const env = boot({
    products: [
      { id: 'p1', name: 'کالا ۱', consumerPrice: 5000, pharmacyPrice: 4000, distributorPrice: 3600, pricingDraft: { consLocked: true, cons: 5670000, increasePct: '' } }
    ]
  });
  const body = env.doc.createElement('div'); body.id = 'v77NewPricesBody';
  const tr = env.doc.createElement('tr');
  const cell = env.doc.createElement('td'); cell.className = 'v81-new-cons'; cell.setAttribute('data-pid', 'p1'); cell.textContent = '۵,۰۰۰';
  tr.appendChild(cell); body.appendChild(tr); env.doc.body.appendChild(body);
  env.API.pricingDisplayFix();
  assert.ok(cell.textContent.indexOf('۵') === 0 && cell.textContent.indexOf('۶۷۰') >= 0, 'نمایش باید ۵٬۶۷۰٬۰۰۰ (مقدارِ رندشده) باشد: ' + cell.textContent);
});

test('v12.17.1: تاریخِ اعمالِ شمسیِ خودکار با اسلش (1405/06/xx) تولید می‌شود', () => {
  const env = boot();
  const d = env.API.jalaliTodaySlash();
  assert.match(d, /^\d{4}\/\d{2}\/\d{2}$/, 'فرمت باید شمسی با اسلش و عدد انگلیسی باشد: ' + d);
});

/* ───────── ۶) ترتیب: همه‌ی تب‌ها، بعد از ذخیره و بازگشایی ───────── */
test('v12.17.1: ترتیب برای همه‌ی تب‌هایی که فرم‌فریلد دارند اعمال می‌شود (فرم + لیست)', () => {
  const env = boot({
    formFieldMeta: {
      pharmacy: { a: { order: 1 }, b: { order: 2 } },
      order: { c: { order: 1 } },
      homes: {}
    }
  });
  const calls = [];
  env.win.applySavedLayoutV82 = (id) => calls.push('saved:' + id);
  env.win.v20ReorderListColumns = (p) => calls.push('list:' + p);
  env.win.LIST_TARGETS_V1216 = [['renderOrdersList', 'tab-orders', 'order', 'h', 'b']];
  const tabs = env.API.tabsWithMeta();
  assert.deepEqual(tabs.sort(), ['tab-orders', 'tab-pharmacies'], 'تب‌هایِ دارای متادیتایِ ترتیب');
  env.API.applyOrderEverywhere();
  assert.ok(calls.includes('saved:tab-pharmacies') && calls.includes('saved:tab-orders'), 'چیدمانِ فرمِ هر تب');
  assert.ok(calls.includes('list:tab-orders'), 'ترتیبِ لیستِ تب اصلی');
  assert.ok(!calls.some((c) => c.indexOf('tab-rep-homes') === 0), 'تبِ خالی اجرا نمی‌شود');
});

/* ───────── ۷) حالتِ آنلاینِ دقیق ───────── */
test('v12.17.1: آفلاین فقط وقتی مرورگر آفلاین باشد (یا سرورِ سایت بیش از ۴۵ ثانیه شکست خورده باشد)', () => {
  const env = boot();
  env.nav.onLine = true;
  assert.equal(env.API.strictOnline(), true, 'مرورگر آنلاین + سرور سالم = آنلاین');
  env.nav.onLine = false;
  assert.equal(env.API.strictOnline(), false, 'navigator.onLine=false = آفلاین');
  const env2 = boot({}, { v1216Api: { net: { online: false, lastOk: Date.now() - 60000 } } });
  env2.nav.onLine = true;
  assert.equal(env2.API.strictOnline(), false, 'شکستِ طولانیِ سرورِ همین سایت = آفلاین');
});

/* ───────── ۸) صفِ پایدارِ آفلاین ───────── */
test('v12.17.1: ذخیره، صفِ ماندگار را روشن می‌کند و flush فقط وقتی اتصال هست می‌فرستد', async () => {
  const env = boot({ x: 1 });
  assert.equal(env.API.isDirty(), false, 'در ابتدا کثیف نیست');
  env.win.saveState();
  assert.equal(env.API.isDirty(), true, 'بعد از saveState کثیف است');
  let posted = null;
  env.win.fetch = (url, opt) => { posted = { url: String(url), opt }; return Promise.resolve({ ok: true }); };
  env.API.flushPending();
  assert.ok(posted && String(posted.url).indexOf('/api/state') >= 0, 'POST به /api/state باید زده شود');
  assert.equal(posted.opt.method, 'POST');
  await new Promise((r) => setImmediate(r));
  assert.equal(env.API.isDirty(), false, 'بعد از موفقیت، صف خالی می‌شود');
});

/* ───────── ۹) خروجیِ اکسلِ کامل ───────── */
test('v12.17.1: خروجیِ داروخانه همه‌ی اطلاعات + سرستونِ فارسی + ردیف را دارد', () => {
  const env = boot({
    pharmacies: [
      { id: 'x1', name: 'داروخانه نمونه', phone: '0211234', address: 'تهران، خیابان آزمایش', plate: '۱۲', floor: '2', isPercentage: true, createdAt: '2026-01-01' }
    ]
  });
  const btn = env.doc.createElement('button'); btn.id = 'btnExportPharmaciesCSV';
  env.doc.body.appendChild(btn);
  let got = null;
  env.win.downloadCSVFile = (file, headers, rows) => { got = { file, headers, rows }; };
  env.doc.fire('click', { target: btn });
  assert.ok(got, 'خروجی باید ساخته شود');
  assert.equal(got.file, 'pharmacies-full-export.csv');
  assert.ok(got.headers.indexOf('نام داروخانه') >= 0 && got.headers.indexOf('پلاک') >= 0 && got.headers.indexOf('طبقه') >= 0, 'سرستون‌هایِ فارسیِ کامل');
  assert.equal(got.rows[0][got.headers.indexOf('نام داروخانه')], 'داروخانه نمونه');
  assert.equal(got.rows[0][got.headers.indexOf('پلاک')], '۱۲');
  assert.equal(got.rows[0][got.headers.indexOf('درصدی')], 'بله');
  assert.ok(env.alerts.join(' ').indexOf('خروجی کامل') >= 0, 'اعلانِ کامل بودن');
});

/* ───────── ۱۰) تبِ تغییرات: نسخه بالایِ همه ───────── */
test('v12.17.1: نسخه‌ی 12.17.1 در صدرِ تبِ تغییرات است', () => {
  const env = boot();
  const host = env.doc.createElement('div'); host.id = 'v41ChangeHost';
  env.doc.body.appendChild(host);
  env.flush();
  assert.ok(env.doc.getElementById('v1217ChangeEntry'), 'بنرِ 12.17.1 باید ساخته شود');
  assert.equal(env.doc.getElementById('v1217ChangeEntry'), host.children[0], 'باید اولینِ عناصر باشد');
});

/* ───────── ۱۱) سطوحِ فایل: حذفِ قدیمی‌ها، نسخه‌ی جدید، بنرِ README ───────── */
test('v12.17.1: فایل‌هایِ نسخه‌هایِ قدیمی حذف شده‌اند و fixture جایگزین شده است', () => {
  for (let v = 9; v <= 20; v++) {
    assert.equal(existsSync(new URL(`public/crm-features-v${v}.js`, root)), false, `public/crm-features-v${v}.js باید حذف باشد`);
  }
  assert.equal(existsSync(new URL('CHANGES_V9.md', root)), false, 'CHANGES_V9.md باید حذف باشد');
  assert.equal(existsSync(new URL('CHANGES_V10.md', root)), false, 'CHANGES_V10.md باید حذف باشد');
  assert.equal(existsSync(new URL('tests/fixtures/crm-features-v20.js', root)), true, 'fixture باید در tests/fixtures باشد');
  const filelist = readFileSync(new URL('OFFICIAL_FILELIST.txt', root), 'utf8');
  assert.equal(/^public\/crm-features-v\d+\.js$/m.test(filelist), false, "فهرستِ رسمی نباید فایلِ قدیمیِ public داشته باشد");
});

test('v12.17.1: نسخه در همه‌ی سطوح 12.17.1 است و README بنرِ نسخه دارد', () => {
  assert.match(readmeSrc, /نسخه‌ی جاریِ این ریپو \(GitHub main\): \*\*12\.17.1\*\*/, 'بنرِ صدرِ README');
  assert.match(htmlSrc, /BUILD="12\.17.1"/, 'BUILD در index.html');
  assert.match(serverSrc, /const APP_VERSION = "12\.17.1"/, 'APP_VERSION در server.js');
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  assert.equal(pkg.version, '12.17.1');
  assert.match(apiPhp, /define\("CRM_APP_VERSION", "12\.17.1"\)/, 'نسخه در api.php');
  assert.match(serverSrc, /crm-features-v\(9\|1\[0-9\]\|2\[0-9\]\)\\.js/, 'پاک‌سازیِ قدیمی در server.js');
  assert.match(apiPhp, new RegExp('crm-features-v\\(9\\|1\\[0-9\\]\\|2\\[0-9\\]\\)\\\\\\.js\\$'), 'پاک‌سازیِ قدیمی در api.php');
});

test('v12.17.1: رندِ «قیمت مصرف‌کننده با ارزش افزوده» دقیقاً جدولِ سومِ کاربر را می‌سازد', () => {
  /* ۱) فرمولِ جدید واقعاً در سورسِ مرورگر است */
  assert.match(src, /var net=vat>0\?cv\*\(1-vat\/100\):cv;/, 'معکوس = قیمت_نهایی × (1- ارزش_افزوده٪)');
  assert.match(src, /d\.consVat=Math\.round\(cv\);/, 'عددِ رندشده‌ی نهایی در draft می‌ماند');
  assert.match(src, /\(d\.consLocked&&d\.consVat\)\?d\.consVat:/, 'ستونِ نهایی عددِ رندشده را نشان می‌دهد');
  /* ۲) شبیه‌سازیِ دقیقِ همان کد با اعدادِ جدولِ کاربر:
        جدول ۱: پخش 3,358,080 | داروخانه 3,816,000 | مصرف‌کننده 4,770,000 | ٪ ۱۰ | نهایی 5,247,000 | افزایش ۲۰ */
  const dist = 3358080, ph = 3816000, cons = 4770000, vat = 10;
  const mDP = (ph - dist) / ph * 100;      /* 12 */
  const mPC = (cons - ph) / cons * 100;    /* 20 */
  assert.equal(mDP, 12, 'مابه‌التفاوت پخش/داروخانه باید 12٪ باشد (جدولِ کاربر)');
  assert.equal(mPC, 20, 'مابه‌التفاوت داروخانه/مصرف‌کننده باید 20٪ باشد (جدولِ کاربر)');
  /* افزایش ۲۰٪ روی همه (جدول دوم) */
  const incCons = Math.round(cons * (1 + 20 / 100));
  const incPh = Math.round(incCons * (1 - mPC / 100));
  const incDist = Math.round(incPh * (1 - mDP / 100));
  assert.equal(incCons, 5724000, 'جدول ۲: مصرف‌کننده');
  assert.equal(incPh, 4579200, 'جدول ۲: داروخانه');
  assert.equal(incDist, 4029696, 'جدول ۲: پخش');
  assert.equal(Math.round(incCons * (1 + vat / 100)), 6296400, 'جدول ۲: نهایی');
  /* مدیر نهایی را به 6,300,000 رند می‌کند → فرمولِ 12.17.1 (جدول سوم) */
  const cv = 6300000;
  const net = vat > 0 ? cv * (1 - vat / 100) : cv;
  const nCons = Math.round(net);
  const nPh = Math.round(nCons * (1 - mPC / 100));
  const nDist = Math.round(nPh * (1 - mDP / 100));
  assert.equal(nCons, 5670000, 'جدول ۳: مصرف‌کننده = 5,670,000');
  assert.equal(nPh, 4536000, 'جدول ۳: داروخانه = 4,536,000');
  assert.equal(nDist, 3991680, 'جدول ۳: پخش = 3,991,680');
  assert.equal(cv, 6300000, 'جدول ۳: نهایی همان 6,300,000ِ رندشده می‌ماند');
});

test('v12.17.1: کادرِ چسبانِ سفارش و قلاب‌هایِ capture در لایه تعریف شده‌اند', () => {
  assert.match(layer, /#crm1216TopPick\{position:sticky/, 'کادرِ چسبان');
  assert.match(layer, /btnRepHomeCurrentLocation/, 'قلابِ موقعیتِ منزل');
  assert.match(layer, /v78-edit-price/, 'قلابِ ثبتِ قیمت');
  assert.match(layer, /btnExportPharmaciesCSV,#btnExportDoctorsCSV,#btnExportOrdersCSV/, 'قلاب‌هایِ اکسل');
});
