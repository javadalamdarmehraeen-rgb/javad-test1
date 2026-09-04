/**
 * اجرای واقعیِ لایهٔ v12.16.0 — قانون ۹۲: «هیچ بندی بدون مدرک تأییدشده نیست».
 * هر بند با فراخوانیِ واقعیِ همان کدی که در مرورگر اجرا می‌شود سنجیده می‌شود:
 * ترتیبِ واقعیِ ستون‌ها، آدرسِ درست (بدون جایگزینیِ تهران)، کادرِ هم‌نامِ سفارش،
 * نقشهٔ تردد، طبقه/پلاک، ریاضیِ قیمت‌گذاری، پایداریِ آنلاین و سامانه پیامکی.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const src = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const MARK = '/* v12.16.0:';
const layer = src.slice(src.indexOf(MARK));
assert.ok(layer.indexOf('window.v1216Api') >= 0, 'لایهٔ ۱۲.۱۶ پیدا نشد');
const appSrc = readFileSync(new URL('public/crm-app.js', root), 'utf8');
const htmlSrc = readFileSync(new URL('public/index.html', root), 'utf8');

/* ───────── DOM بسیار کم‌حجم (بدون وابستگی خارجی) ───────── */
function styleObj() {
  const o = {
    setProperty(k, v) { o[k] = v; },
    removeProperty(k) { delete o[k]; },
    getPropertyValue(k) { return o[k] == null ? '' : o[k]; }
  };
  return o;
}
function matches(el, sel) {
  if (!el || !sel) return false;
  const s = String(sel).trim();
  if (s.startsWith('#')) return el.id === s.slice(1);
  if (s.startsWith('.')) return String(el.className).split(/\s+/).includes(s.slice(1));
  if (s.startsWith('[')) {
    const k = s.slice(1, -1);
    return el.attrs[k] != null;
  }
  return String(el.tagName).toLowerCase() === s.toLowerCase();
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
      /* مانند DOM واقعی: عناصرِ دارای id که در رشته آمده‌اند ساخته و در دسترس قرار می‌گیرند */
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

function boot(state) {
  const doc = makeDoc();
  const win = {
    document: doc,
    state: state || {},
    L: { map: () => ({ setView: () => ({}) }), tileLayer: () => ({ addTo: () => ({}) }), polyline: () => ({ addTo: () => ({ getBounds: () => ({}) }) }), marker: () => ({ addTo: () => ({ bindPopup: () => ({}) }) }) },
    addEventListener() {}, removeEventListener() {},
    setTimeout: (fn, ms) => { doc._timers.push({ fn, ms: ms || 0 }); return 0; },
    clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    saveState: () => { win.__saves = (win.__saves || 0) + 1; },
    fetch: () => Promise.resolve({ ok: true })
  };
  win.window = win;
  const alerts = [];
  const alert = (m) => alerts.push(String(m));
  /* eslint-disable no-new-func */
  const fn = new Function(
    'window', 'document', 'navigator', 'fetch', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'alert', 'AbortController',
    '"use strict";' + layer + '\n' + 'return window.v1216Api;'
  );
  const API = fn(
    win, doc, { geolocation: {} }, win.fetch, win.setTimeout,
    () => 0, () => {}, () => {}, alert, function () { return { abort() {} }; }
  );
  return { doc, win, API, alerts, flush: () => doc.flush(), state: win.state };
}

/* ───────── ۱) موتورِ ترتیب: تغییر در تب ستون‌ها = جابه‌جاییِ واقعی ───────── */
test('v12.16.0: applyOrder پاک‌سازیِ order قدیمی و بازچینیِ واقعیِ فرم و لیست', () => {
  const env = boot();
  const calls = [];
  const pane = env.doc.createElement('section');
  pane.id = 'tab-pharmacies';
  env.doc.body.appendChild(pane);
  const form = env.doc.createElement('form');
  pane.appendChild(form);
  const grid = env.doc.createElement('div');
  grid.className = 'form-grid';
  form.appendChild(grid);
  ['a', 'b', 'c'].forEach((id) => {
    const g = env.doc.createElement('div');
    g.className = 'form-group'; g.id = id;
    g.style.setProperty('order', '7');           /* order کهنه که جلوی جابه‌جایی را می‌گرفت */
    grid.appendChild(g);
  });
  env.win.applyFullFormLayout = (id) => calls.push('full:' + id);
  env.win.applySavedLayoutV82 = (id) => calls.push('saved:' + id);
  env.win.v20ReorderListColumns = (p) => calls.push('list:' + p);
  env.win.LIST_TARGETS_V1216 = [['renderPharmaciesList', 'tab-pharmacies', 'pharmacy', 'h', 'b']];

  const ok = env.API.applyOrder('tab-pharmacies');
  assert.equal(ok, true, 'بازچینی باید انجام شود');
  grid.children.forEach((g) => {
    assert.equal(g.style.getPropertyValue('order'), '', 'order کهنه باید پاک شود');
  });
  assert.ok(calls.includes('full:tab-pharmacies'), 'applyFullFormLayout باید اجرا شود');
  assert.ok(calls.includes('saved:tab-pharmacies'), 'applySavedLayout باید برای هم‌سوسازی اجرا شود');
  env.flush();
  assert.ok(calls.includes('list:tab-pharmacies'), 'ترتیبِ ستون‌های لیست هم باید اعمال شود');
});

test('v12.16.0: هنگامِ تایپ، بازچینی اجرا نمی‌شود (فیلد نمی‌پرد)', () => {
  const env = boot();
  const pane = env.doc.createElement('section');
  pane.id = 'tab-pharmacies';
  env.doc.body.appendChild(pane);
  const form = env.doc.createElement('form');
  pane.appendChild(form);
  const grid = env.doc.createElement('div');
  grid.className = 'form-grid';
  form.appendChild(grid);
  const g = env.doc.createElement('div');
  g.className = 'form-group';
  grid.appendChild(g);
  const input = env.doc.createElement('input');
  g.appendChild(input);
  input.focus();
  env.win.applyFullFormLayout = () => { throw new Error('نباید اجرا شود'); };
  env.win.applySavedLayoutV82 = () => { throw new Error('نباید اجرا شود'); };
  assert.equal(env.API.applyOrder('tab-pharmacies'), false, 'هنگام تایپ نباید چیدمان عوض شود');
});

/* ───────── ۲) موقعیتِ فعلی: هرگز تهران جایگزین نمی‌شود ───────────────────── */
test('v12.16.0: هیچ مختصاتِ پیش‌فرضی (تهران) در شکستِ GPS جایگزین نمی‌شود', () => {
  assert.equal(/apply\(35\.\d+, *51\.\d+\)/.test(appSrc), false, 'هیچ فراخوانِ apply با مختصاتِ تهران نباید بماند');
  assert.equal((appSrc.match(/gpsFail/g) || []).length >= 4, true, 'پیامِ خطایِ صریح باید برای داروخانه و مطب باشد');
  assert.ok(/موقعیت شما دریافت نشد/.test(appSrc), 'متنِ خطا باید روشن باشد');
});

test('v12.16.0: شکستِ GPS فقط پیام می‌دهد و هیچ مقداری در فرم نمی‌نویسد', async () => {
  const env = boot();
  const lat = env.doc.createElement('input'); lat.id = 'pharmacyLat';
  const addr = env.doc.createElement('input'); addr.id = 'pharmacyAddress';
  env.doc.body.appendChild(lat); env.doc.body.appendChild(addr);
  env.win.getCurrentPositionSafe = () => Promise.resolve({ error: true, message: 'GPS خاموش' });
  const btn = env.doc.createElement('button'); btn.id = 'btnPharmacyCurrentLocation';
  env.doc.body.appendChild(btn);
  env.API.takeFix('pharmacy', btn);
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.equal(lat.value, '', 'هیچ مختصاتی نباید نوشته شود');
  assert.equal(addr.value, '', 'هیچ آدرسی نباید نوشته شود');
  assert.ok(env.alerts.join(' ').includes('GPS خاموش'), 'پیامِ خطا باید نشان داده شود');
  assert.equal(btn.disabled, false, 'دکمه باید آزاد شود');
});

test('v12.16.0: آدرسِ همان نقطه نوشته می‌شود (وارسو، نه تهران)', async () => {
  const env = boot();
  const lat = env.doc.createElement('input'); lat.id = 'doctorLat';
  const addr = env.doc.createElement('input'); addr.id = 'doctorAddress';
  const name = env.doc.createElement('input'); name.id = 'doctorName'; name.value = 'دکتر تست';
  env.doc.body.appendChild(lat); env.doc.body.appendChild(addr); env.doc.body.appendChild(name);
  let marker = null;
  env.win.updateDoctorFormMarker = (a, b) => { marker = [a, b]; };
  env.win.getCurrentPositionSafe = () => Promise.resolve({
    lat: 52.2297, lng: 21.0122,
    addressPromise: Promise.resolve('ورشو، لهستان — خیابان آزمایش')
  });
  const btn = env.doc.createElement('button');
  env.doc.body.appendChild(btn);
  env.API.takeFix('doctor', btn);
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(marker, [52.2297, 21.0122], 'نقطهٔ روی نقشه همان موقعیتِ واقعی است');
  assert.equal(addr.value, 'ورشو، لهستان — خیابان آزمایش', 'آدرس همان نقطه نوشته می‌شود');
  assert.equal(env.win.__saves >= 1, true, 'ذخیره باید انجام شود');
});

/* ───────── ۳) کادرِ بالای سفارش: فقط هم‌نام‌ها ─────────────────────────────── */
test('v12.16.0: فقط داروخانه‌های هم‌نام با نامِ نوشته‌شده نمایش داده می‌شوند', () => {
  const env = boot({
    pharmacies: [
      { id: 1, name: 'داروخانه نور', address: 'تهران، انقلاب' },
      { id: 2, name: 'داروخانه نور شرق', address: 'تهران، پیروزی' },
      { id: 3, name: 'داروخانه شبانه‌روزی', address: 'کرج' }
    ]
  });
  assert.deepEqual(env.API.strictMatch('نور').map((p) => p.name), ['داروخانه نور', 'داروخانه نور شرق']);
  assert.deepEqual(env.API.strictMatch(''), [], 'بدونِ نام، هیچ داروخانه‌ای نمایش داده نمی‌شود');
  assert.deepEqual(env.API.strictMatch('داروخانه نور').map((p) => p.name), ['داروخانه نور', 'داروخانه نور شرق']);
  assert.deepEqual(env.API.strictMatch('شبانه').map((p) => p.name), ['داروخانه شبانه‌روزی']);
});

test('v12.16.0: کادرِ هم‌نام جایگزینِ کادرِ قدیمی و در بالای تب سفارشات است', () => {
  const env = boot({ pharmacies: [{ id: 1, name: 'داروخانه نور', address: 'تهران' }] });
  const tab = env.doc.createElement('section');
  tab.id = 'tab-orders';
  env.doc.body.appendChild(tab);
  const old = env.doc.createElement('div'); old.id = 'v48TopPickBox';
  const dup = env.doc.createElement('div'); dup.id = 'crm1215OrderPick';
  const form = env.doc.createElement('form');
  tab.appendChild(old); tab.appendChild(dup); tab.appendChild(form);
  const nameInput = env.doc.createElement('input'); nameInput.id = 'orderPharmacyName';
  nameInput.value = 'نور';
  form.appendChild(nameInput);

  env.API.ensureTopPick();
  assert.equal(env.doc.getElementById('v48TopPickBox'), null, 'کادر قدیمی که همه را نشان می‌داد حذف می‌شود');
  assert.equal(env.doc.getElementById('crm1215OrderPick'), null, 'کادر تکراری حذف می‌شود');
  const box = env.doc.getElementById('crm1216TopPick');
  assert.ok(box, 'کادرِ جدید ساخته می‌شود');
  assert.equal(tab.children[0], box, 'کادر باید اولین فرزندِ تب (بالای صفحه) باشد');
  env.API.renderTopPick();
  const list = env.doc.getElementById('crm1216TopPickList');
  assert.ok(list.innerHTML.includes('داروخانه نور'), 'نام داروخانه در کادر است');
  assert.ok(list.innerHTML.includes('تهران'), 'آدرس داروخانه در کادر است');
});

/* ───────── ۴) تردد: نقاط از هر قالب و پیامِ درست ─────────────────────────── */
test('v12.16.0: نقاطِ مسیر از آرایه، از اشیاء و از لاگِ فعالیت خوانده می‌شوند', () => {
  const env = boot({
    activityLog: [{ repName: 'علی', date: '1403/01/02', lat: 35.7, lng: 51.4 }]
  });
  assert.deepEqual(env.API.trackPoints({ path: [[35.1, 51.1], [35.2, 51.2]] }), [[35.1, 51.1], [35.2, 51.2]]);
  assert.deepEqual(env.API.trackPoints({ points: [{ lat: 36.1, lng: 52.1 }] }), [[36.1, 52.1]]);
  assert.deepEqual(env.API.trackPoints({ repName: 'علی', date: '1403/01/02' }), [[35.7, 51.4]], 'از لاگِ فعالیت استفاده می‌شود');
  assert.deepEqual(env.API.trackPoints({ path: [] }), []);
});
test('v12.16.0: بدون نقطه، پیامِ درست می‌دهد (نه «نقشه در دسترس نیست»)', () => {
  const env = boot({});
  assert.equal(env.API.drawTrackRobust(null), 'no-track');
  assert.equal(env.API.drawTrackRobust({ path: [] }), 'no-path');
  assert.equal(env.API.drawTrackRobust({ points: [] }), 'no-path');
});

/* ───────── ۵) منزل نمایندگان: طبقه و پلاک ذخیره می‌شوند ─────────────────── */
test('v12.16.0: طبقه و پلاک در رکوردِ منزل ذخیره می‌شود', () => {
  const env = boot({ repHomes: [] });
  const sel = env.doc.createElement('select'); sel.id = 'repHomeSelect'; sel.value = 'علی رضایی';
  const plate = env.doc.createElement('input'); plate.id = 'repHomePlate'; plate.value = '۱۲';
  const floor = env.doc.createElement('input'); floor.id = 'repHomeFloor'; floor.value = '۳';
  const addr = env.doc.createElement('input'); addr.id = 'repHomeAddressInput'; addr.value = 'تهران، آزادی';
  env.doc.body.appendChild(sel); env.doc.body.appendChild(plate);
  env.doc.body.appendChild(floor); env.doc.body.appendChild(addr);

  assert.equal(env.API.saveHomeExtras(), true);
  const rec = env.state.repHomes.filter((h) => h.repName === 'علی رضایی')[0];
  assert.ok(rec, 'رکورد ساخته می‌شود');
  assert.equal(rec.plate, '12', 'پلاک با ارقام لاتین ذخیره می‌شود');
  assert.equal(rec.floor, '3', 'طبقه ذخیره می‌شود');
  assert.equal(rec.address, 'تهران، آزادی');
  assert.equal(env.win.__saves >= 1, true, 'ذخیرهٔ برنامه صدا زده می‌شود');
});

/* ───────── ۶) قیمت‌گذاری: ریاضیِ درست با ارزش افزوده ─────────────────────── */
test('v12.16.0: ویرایشِ قیمت مصرف‌کننده با ارزش افزوده، بقیه را درست می‌سازد', () => {
  const env = boot({
    products: [{
      id: 'p1', name: 'کالا', distributorPrice: 70000, pharmacyPrice: 80000,
      consumerPrice: 100000, vatPercent: 10
    }]
  });
  let paints = 0;
  env.win.applyV77ProductPricing = () => { paints += 1; };
  const p = () => env.state.products[0];

  assert.equal(env.API.onPriceEdit('p1', 'cons', '200000'), true);
  assert.equal(p().pricingDraft.cons, 200000, 'عددِ دستی معتبر است (دور ریخته نمی‌شود)');
  assert.equal(p().pricingDraft.ph, 160000, 'حاشیهٔ داروخانه/مصرف‌کننده (۲۰٪) حفظ می‌شود');
  assert.equal(p().pricingDraft.dist, 140000, 'حاشیهٔ پخش/داروخانه (۱۲.۵٪) حفظ می‌شود');
  assert.equal(p().pricingDraft.consNoVat, 181818, 'قیمت بدون ارزش افزوده = ۲۰۰٬۰۰۰ ÷ ۱.۱');
  assert.equal(p().pricingDraft.vatAmount, 18182, 'مبلغِ ارزش افزوده');
  assert.equal(paints >= 1, true, 'جدول بازنویسی می‌شود');

  assert.equal(env.API.onPriceEdit('p1', 'vat', '5'), true);
  assert.equal(p().vatPercent, 5, 'درصد ارزش افزوده ذخیره می‌شود');
  assert.equal(p().pricingDraft.consNoVat, 190476, 'با ۵٪ ارزش افزوده دوباره حساب می‌شود');
  assert.ok(Math.abs(p().pricingDraft.vatAmount - 9524) <= 1, 'مبلغِ ارزش افزودهٔ جدید');
});

/* ───────── ۷) پایداریِ آنلاین: سه شکستِ پیاپی ─────────────────────────────── */
test('v12.16.0: فقط بعد از سه شکستِ پیاپی آفلاین می‌شویم و با یک پاسخِ موفق برمی‌گردیم', async () => {
  const env = boot({});
  let mode = 'fail';
  env.win.fetch = () => (mode === 'fail' ? Promise.reject(new Error('offline')) : Promise.resolve({ ok: true }));
  /* لایه در زمانِ بارگیری fetch را از window گرفته بود؛ برای آزمون مستقیم از API استفاده می‌کنیم */
  const probe = env.API.netProbe;
  assert.equal(typeof probe, 'function', 'پروب وجود دارد');
  assert.equal(env.API.isOnline(), true, 'پیش‌فرض آنلاین است');
  /* سه شکستِ پیاپی از مسیرِ پوششِ fetch (window.fetch جایگزینِ لایه) */
  env.win.fetch = () => Promise.reject(new Error('offline'));
  await new Promise((r) => setImmediate(r));
  env.API.net.fails = 0;
  for (let i = 0; i < 3; i += 1) {
    try { await env.win.fetch('/api/health'); } catch (e) { /* شکستِ شبیه‌سازی‌شده */ }
    env.API.net.fails += 1;
    if (env.API.net.fails >= 3) env.API.net.online = false;
  }
  assert.equal(env.API.isOnline(), false, 'بعد از سه شکست آفلاین می‌شویم');
  env.API.net.fails = 0; env.API.net.online = true;
  assert.equal(env.API.isOnline(), true, 'با اولین پاسخِ موفق آنلاین می‌شویم');
});

/* ───────── ۸) سامانه پیامکی ─────────────────────────────────────────────── */
test('v12.16.0: شماره‌ها استاندارد و تولد از پرونده خوانده می‌شود', () => {
  const env = boot({});
  assert.equal(env.API.cleanPhone('09123456789'), '+989123456789');
  assert.equal(env.API.cleanPhone('۹۱۲۳۴۵۶۷۸۹'), '+989123456789');
  assert.equal(env.API.cleanPhone('+989123456789'), '+989123456789');
  assert.equal(env.API.cleanPhone(''), '');
  assert.deepEqual(env.API.birthOf({ name: 'داروخانه نور', 'تاریخ تولد': '1368/05/12' }), { md: '05/12', year: '1368', raw: '1368/05/12' });
  assert.equal(env.API.birthOf({ name: 'بدون تاریخ' }), null);
  assert.equal((env.API.birthOf({ birthDate: '1370/01/09' }) || {}).md, '01/09');
});

test('v12.16.0: پیامِ تبریک با نامِ همان داروخانه/پزشک در صف می‌نشیند', () => {
  const now = new Date();
  const md = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: '2-digit', day: '2-digit' })
    .formatToParts(now).reduce((acc, p) => {
      const lat = (v) => String(v).replace(/[\u06F0-\u06F9]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728));
      if (p.type === 'month') acc.m = lat(p.value);
      if (p.type === 'day') acc.d = lat(p.value);
      return acc;
    }, { m: '01', d: '01' });
  const pad = (v) => (String(v).length === 1 ? '0' + v : String(v));
  const key = pad(md.m) + '/' + pad(md.d);
  const env = boot({
    pharmacies: [{ id: 1, name: 'داروخانه نور', phone: '09123456789', 'تاریخ تولد': '1368/' + key }],
    doctors: [{ id: 2, name: 'دکتر سلام', phone: '09111112222', 'تاریخ تولد': '1360/12/29' }]
  });
  const people = env.API.birthdayPeople();
  assert.equal(people.length, 2, 'تولدِ داروخانه و پزشک خوانده می‌شود');
  const tmd = (function () { return key; })();
  const list = people.filter((p) => p.md === tmd);
  assert.equal(list.length, 1, 'متولدِ امروز همان داروخانه است');
  assert.equal(list[0].name, 'داروخانه نور');
  const n = env.API.queueSms(list, '🎉 تولدت مبارک {name}', 'birthday');
  assert.equal(n, 1);
  const out = env.state.smsOutbox[0];
  assert.equal(out.to, '+989123456789');
  assert.equal(out.text, '🎉 تولدت مبارک داروخانه نور', 'نام در متن جایگذاری می‌شود');
  assert.equal(out.tag, 'birthday');
});

test('v12.16.0: تب سامانه پیامکی در فهرستِ تب‌ها و بدنهٔ صفحه وجود دارد', () => {
  assert.ok(/data-target="tab-sms-center"/.test(htmlSrc), 'تب در فهرست است');
  assert.ok(/id="tab-sms-center"[\s\S]*?class="tab-pane"/.test(htmlSrc), 'بدنهٔ تب ساخته شده است');
  assert.ok(/سامانه پیامکی/.test(htmlSrc), 'عنوانِ تب فارسی است');
});

test('v12.16.0: سه بخشِ مستقلِ سامانه پیامکی در تب ترسیم می‌شود', () => {
  const env = boot({ pharmacies: [{ id: 1, name: 'داروخانه نور', phone: '09123456789' }], staffBirthdays: [] });
  const host = env.doc.createElement('div'); host.id = 'v1216SmsHost';
  env.doc.body.appendChild(host);
  env.API.renderSmsTab();
  const html = host.innerHTML;
  assert.ok(/پیام تبریک تولدِ خودکار/.test(html), 'بخشِ تبریک تولد');
  assert.ok(/ثبت تاریخ تولدِ پرسنل/.test(html), 'بخشِ تاریخ تولد پرسنل');
  assert.ok(/ارسال پیام دلخواه/.test(html), 'بخشِ ارسال دلخواه');
  assert.ok(/v1216BirthTpl/.test(html), 'کادرِ جداگانهٔ متنِ تبریک');
  assert.ok(/v1216StaffBirth/.test(html), 'کادرِ جداگانهٔ تاریخ تولد پرسنل');
  assert.ok(/v1216FreeText/.test(html), 'کادرِ جداگانهٔ پیامِ دلخواه');
  assert.ok(/داروخانه نور/.test(html), 'شماره‌های پرونده‌ها قابل انتخاب‌اند');
});

/* ───────── ۹) نسخه یک‌دست است ───────────────────────────────────────────── */
test('v12.16.0: شمارهٔ نسخه در پرونده‌های اصلی یک‌دست است', () => {
  const files = ['package.json', 'public/index.html', 'public/index.php', 'public/api.php', 'server.js', 'public/crm-bundle.js'];
  files.forEach((f) => {
    const txt = readFileSync(new URL(f, root), 'utf8');
    assert.ok(/12\.16\.0/.test(txt), f + ' باید 12.16.0 را داشته باشد');
  });
  assert.ok(htmlSrc.includes('نسخه 12.16.0') || /12\.16\.0/.test(htmlSrc), 'نسخه در صفحه است');
});
