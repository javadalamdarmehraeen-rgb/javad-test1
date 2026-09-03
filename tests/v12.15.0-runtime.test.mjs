/**
 * اجرای واقعیِ لایهٔ v12.15.0 — قانون ۹۲: «هیچ بندی بدون مدرک تأییدشده نیست».
 * برای اجرا یک DOMِ کم‌حجم (بدون وابستگی خارجی) ساخته شده است و منطقِ هر بند
 * واقعاً فراخوانی می‌شود: ترتیبِ پایدار، آدرسِ واقعی، آنلاینِ پایدار، جایگذاری،
 * تردد، منزل، پیام‌رسان، قیمت‌گذاری، نوع ساعت، دسترسیِ ریز، آلارمِ ویزیت، اکسل.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../public/crm-bundle.js', import.meta.url), 'utf8');
const MARK = '/* v12.15.0:';
const layer = src.slice(src.indexOf(MARK));
assert.ok(layer.indexOf('window.v1215') >= 0, 'لایهٔ ۱۲.۱۵ پیدا نشد');

/* ───────── DOM بسیار کم‌حجم ───────── */
let idSeq = 0;
function makeEl(tag, doc) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(),
    nodeName: String(tag || 'div').toUpperCase(),
    id: '',
    className: '',
    style: {},
    dataset: {},
    children: [],
    parentNode: null,
    attrs: {},
    textContent: '',
    value: '',
    type: '',
    checked: false,
    _html: '',
    _listeners: {},
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); this.children = parseInto(this, String(v), doc); },
    appendChild(c) { c.parentNode = this; this.children.push(c); if (c.id) doc._index[c.id] = c; return c; },
    insertBefore(c, ref) {
      c.parentNode = this;
      const i = ref ? this.children.indexOf(ref) : -1;
      if (i >= 0) this.children.splice(i, 0, c); else this.children.push(c);
      if (c.id) doc._index[c.id] = c;
      return c;
    },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') { this.id = String(v); doc._index[String(v)] = this; } },
    getAttribute(k) { return k === 'id' ? this.id : (this.attrs[k] != null ? this.attrs[k] : null); },
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
    dispatchEvent(ev) { (this._listeners[ev && ev.type] || []).forEach((fn) => fn(ev)); return true; },
    click() { this.dispatchEvent({ type: 'click', target: this }); },
    closest(sel) {
      let n = this;
      while (n) { if (matches(n, sel)) return n; n = n.parentNode; }
      return null;
    },
    querySelector(sel) { return allDescendants(this).find((n) => matches(n, sel)) || null; },
    querySelectorAll(sel) { return allDescendants(this).filter((n) => matches(n, sel)); },
    get cells() { return this.children.filter((c) => c.tagName === 'TD' || c.tagName === 'TH'); },
    get firstChild() { return this.children[0] || null; },
    scrollIntoView() {},
    focus() {},
    remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  };
  return el;
}
function parseInto(parent, html, doc) {
  /* فقط ساختارِ ساده را شبیه‌سازی می‌کند: div/span/td/th/tr/table و id/class را می‌فهمد */
  const out = [];
  const stack = [parent];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const close = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '';
    if (close) { if (stack.length > 1) stack.pop(); continue; }
    const el = makeEl(tag, doc);
    const cm = /class=['"]([^'"]*)['"]/.exec(attrs);
    if (cm) el.className = cm[1];
    const im = /id=['"]([^'"]*)['"]/.exec(attrs);
    if (im) { el.id = im[1]; doc._index[im[1]] = el; }
    const dm = /(?:^|\s)data-([a-z0-9-]+)=['"]([^'"]*)['"]/g;
    let d;
    while ((d = dm.exec(attrs))) {
      const key = d[1].replace(/-([a-z])/g, (_x, c) => c.toUpperCase());
      el.dataset[key] = d[2];
      el.attrs['data-' + d[1]] = d[2];
    }
    const tm = /type=['"]([^'"]*)['"]/.exec(attrs);
    if (tm) el.type = tm[1];
    const vm = /value=['"]([^'"]*)['"]/.exec(attrs);
    if (vm) el.value = vm[1];
    stack[stack.length - 1].appendChild(el);
    if (!/\/>$/.test(m[0]) && !/^(input|br|img|hr)$/.test(tag)) stack.push(el);
  }
  /* متنِ ساده را به عنوان textContent نگه می‌داریم */
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text && !parent.children.length) parent.textContent = text;
  return out;
}
function allDescendants(el) {
  const out = [];
  (function walk(n) { n.children.forEach((c) => { out.push(c); walk(c); }); })(el);
  return out;
}
function matches(el, sel) {
  return String(sel).split(',').map((s) => s.trim()).filter(Boolean).some((one) => {
    const parts = one.split(/\s+/);
    const last = parts[parts.length - 1];
    if (parts.length > 1) {
      /* زنجیرهٔ ساده: «table tbody tr» */
      const parents = parts.slice(0, -1);
      let n = el.parentNode, ok = true;
      for (let i = parents.length - 1; i >= 0; i -= 1) {
        let found = false;
        while (n) { if (matches(n, parents[i])) { found = true; break; } n = n.parentNode; }
        if (!found) { ok = false; break; }
      }
      if (!ok) return false;
    }
    if (last.startsWith('#')) return el.id === last.slice(1);
    if (last.startsWith('.')) return String(el.className).split(/\s+/).includes(last.slice(1));
    if (last.startsWith('[')) {
      const key = last.slice(1, -1);
      if (key.includes('=')) { const [k, v] = key.split('='); return el.attrs[k] === v.replace(/['"]/g, ''); }
      return el.attrs[key] != null || (key.startsWith('data-') && el.dataset[key.slice(5).replace(/-([a-z])/g, (_x, c) => c.toUpperCase())] != null);
    }
    const tag = last.toUpperCase();
    if (tag.includes('*')) {
      const pre = tag.split('*')[0];
      return el.tagName.startsWith(pre);
    }
    return el.tagName === tag;
  });
}

function makeDoc() {
  const doc = {
    _index: {},
    readyState: 'complete',
    hidden: false,
    body: null,
    getElementById(id) { return this._index[id] || null; },
    createElement(t) { return makeEl(t, this); },
    querySelector(sel) { return this.body ? this.body.querySelector(sel) : null; },
    querySelectorAll(sel) { return this.body ? this.body.querySelectorAll(sel) : []; },
    addEventListener() {},
    createEvent() { return { initEvent() {} }; }
  };
  doc.body = makeEl('body', doc);
  return doc;
}

/* ───────── محیط اجرا ───────── */
function run(opts = {}) {
  const doc = makeDoc();
  const store = new Map();
  const calls = [];
  const win = {};
  const state = opts.state || {};
  win.__CRM_GET_STATE = () => state;
  win.CRM_APP_VERSION = '12.15.0';
  win.state = state;
  win.addEventListener = () => {};
  win.saveState = () => { store.set('SAVED', (store.get('SAVED') || 0) + 1); };
  win.caches = { keys: () => Promise.resolve([]) };

  function buildTab(id) {
    const tab = doc.createElement('div');
    tab.id = id;
    doc.body.appendChild(tab);
    return tab;
  }
  const tabs = {};
  ['tab-orders', 'tab-product-pricing', 'tab-rep-homes', 'tab-rep-routes',
   'tab-messengers', 'tab-users-permissions', 'tab-pharmacies', 'tab-doctors'].forEach((id) => { tabs[id] = buildTab(id); });

  /* فرم سفارش */
  const phName = doc.createElement('input'); phName.id = 'orderPharmacyName';
  const phAddr = doc.createElement('input'); phAddr.id = 'orderAddress';
  const phLat = doc.createElement('input'); phLat.id = 'orderLat';
  tabs['tab-orders'].appendChild(phName);
  tabs['tab-orders'].appendChild(phAddr);
  tabs['tab-orders'].appendChild(phLat);
  for (const id of ['orderPharmacyPhone', 'orderCity', 'orderDistrict', 'orderFloor', 'orderPlate', 'orderLng', 'orderPharmacyMatchedId']) {
    const el = doc.createElement('input'); el.id = id; tabs['tab-orders'].appendChild(el);
  }

  /* تب قیمت‌گذاری */
  const vatInput = doc.createElement('input'); vatInput.id = 'priceConsumerVat'; vatInput.value = '125000';
  tabs['tab-product-pricing'].appendChild(vatInput);
  const saveBtn = doc.createElement('button'); saveBtn.id = 'btnSavePricing'; saveBtn.textContent = 'ثبت';
  tabs['tab-product-pricing'].appendChild(saveBtn);

  /* انتخابِ نوع فیلد */
  const typeSel = doc.createElement('select'); typeSel.id = 'colFieldType';
  ['text', 'number', 'date'].forEach((v) => {
    const o = doc.createElement('option'); o.value = v; o.textContent = v; typeSel.appendChild(o);
  });
  doc.body.appendChild(typeSel);

  /* ورودیِ زمانِ سفارشی */
  const timeInput = doc.createElement('input');
  timeInput.id = 'cfTime';
  timeInput.type = 'text';
  timeInput.setAttribute('data-custom-field-id', 'cf-time-1');
  timeInput.setAttribute('data-input-kind', 'time');
  doc.body.appendChild(timeInput);

  /* نشانِ وضعیت */
  const badge = doc.createElement('div'); badge.id = 'globalOnlineStatusBadge'; badge.textContent = '🔴 آفلاین — برنامه کامل کار می‌کند';
  doc.body.appendChild(badge);

  /* جدولِ رصد تردد */
  const table = doc.createElement('table');
  const tbody = doc.createElement('tbody');
  const tr = doc.createElement('tr');
  const td1 = doc.createElement('td'); td1.textContent = 'علی رضایی 1404/01/02';
  tr.appendChild(td1);
  tbody.appendChild(tr);
  table.appendChild(tbody);
  tabs['tab-rep-routes'].appendChild(table);

  /* نقشه و لایه (ساختگی) */
  const drawn = [];
  const fakeLayer = { addTo: (m) => { drawn.push('line'); return { getBounds: () => [[0, 0], [1, 1]] }; }, getBounds: () => [[0, 0], [1, 1]] };
  const fakeMarker = { addTo: () => ({ bindPopup: () => ({}) }) };
  const L = { polyline: () => fakeLayer, marker: () => fakeMarker };
  const map = { invalidateSize() {}, fitBounds() {}, removeLayer() {} };
  win._mapRepRoutes = map;
  win.L = L;

  const nav = { onLine: opts.onLine !== false };
  const loc = { protocol: 'https:', hostname: 'ndcohub.com', host: 'ndcohub.com', origin: 'https://ndcohub.com', href: 'https://ndcohub.com/', search: '' };
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
  function MutationObserver() { this.observe = () => {}; this.disconnect = () => {}; }

  const geoResponses = opts.geo || [];
  let geoIdx = 0;
  const fetchImpl = (url, o) => {
    calls.push({ url: String(url), o });
    if (opts.network === 'down') return Promise.reject(new TypeError('Failed to fetch'));
    if (/reverse|nominatim|photon/.test(String(url))) {
      const body = geoResponses[geoIdx] || (geoResponses.length ? null : null);
      geoIdx += 1;
      if (body === null || body === undefined) return Promise.resolve({ ok: false, status: 502, text: () => Promise.resolve('') });
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body) });
    }
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('{"ok":true}') });
  };
  win.fetch = fetchImpl;

  const runner = new Function(
    'window', 'document', 'location', 'navigator', 'localStorage', 'sessionStorage',
    'setTimeout', 'setInterval', 'clearTimeout', 'MutationObserver', 'fetch', 'alert',
    'performance', 'L', 'Event', 'requestIdleCallback',
    '"use strict";' + layer
  );
  const timers = [];
  runner(win, doc, loc, nav, localStorage, localStorage,
    (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; },
    () => 0,                                    /* setInterval در تست بی‌اثر است تا پروسه زنده نماند */
    (id) => clearTimeout(id),
    MutationObserver, fetchImpl, () => {},
    { now: () => Date.now() }, L, class Event { constructor(t) { this.type = t; } }, undefined);

  const cleanup = () => timers.forEach((id) => clearTimeout(id));
  return { win, doc, state, store, calls, tabs, badge, drawn, table, typeSel, timeInput,
    phName, phAddr, vatInput, saveBtn, api: win.v1215Api, cleanup, opts };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function withEnv(t, opts) { const env = run(opts); t.after(() => env.cleanup()); return env; }

/* ───────── ۱) ترتیبِ پایدار ───────── */
test('v12.15.0: field order is normalised to unique rows (no ties → survives refresh)', (t) => {
  const env = withEnv(t, {
    state: {
      formFieldMeta: {
        pharmacies: {
          a: { order: 3, listOrder: 2 },
          b: { order: 3, listOrder: 2 },
          c: { order: 1, listOrder: 5 }
        }
      },
      customFields: { pharmacies: [{ id: 'x', order: 2, listOrder: 9 }, { id: 'y', order: 2, listOrder: 4 }] }
    }
  });
  const fixed = env.api.normalizeOrders();
  const m = env.state.formFieldMeta.pharmacies;
  const orders = Object.keys(m).map((k) => m[k].order).sort((a, b) => a - b);
  const lists = Object.keys(m).map((k) => m[k].listOrder).sort((a, b) => a - b);
  assert.deepEqual(orders, [1, 2, 3], 'ترتیبِ فرم باید یکتا و پیوسته باشد');
  assert.deepEqual(lists, [1, 2, 3], 'ترتیبِ لیست باید یکتا و پیوسته باشد');
  assert.deepEqual(env.state.customFields.pharmacies.map((f) => f.order).sort((a, b) => a - b), [1, 2]);
  assert.ok(fixed > 0, 'باید تغییری اعمال شده باشد');
  assert.equal(env.store.get('SAVED'), 1, 'نرمال‌سازی باید ذخیره شود');
  /* دوباره اجرا کردن تغییری ایجاد نمی‌کند (پایدار) */
  assert.equal(env.api.normalizeOrders(), 0, 'اجرای دوباره نباید تغییری بدهد');
});

/* ───────── ۲) آدرس واقعی به‌جای مختصات ───────── */
test('v12.15.0: reverse geocode returns a real address and never raw coordinates', async (t) => {
  const good = JSON.stringify({ display_name: 'ایران، تهران، خیابان آزادی، پلاک ۱۲' });
  const env = withEnv(t, { geo: [good] });
  const addr = await env.api.reverseAddress(35.7012, 51.4021, 1);
  assert.equal(addr, 'ایران، تهران، خیابان آزادی، پلاک ۱۲');

  const env2 = withEnv(t, { network: 'down' });
  const empty = await env2.api.reverseAddress(35.7012, 51.4021, 1);
  assert.equal(empty, '', 'در صورت شکست نباید هیچ متنی (به‌ویژه مختصات) برگردد');
  assert.ok(!/^\s*موقعیت ثبت‌شده/.test(String(empty)));
  assert.ok(/آدرس/.test(env2.api.NO_ADDR), 'پیامِ جایگزین باید فارسی و راهنما باشد');
});

test('v12.15.0: photon answers are turned into the same Persian address line', (t) => {
  const env = withEnv(t, {});
  const out = env.api.normPhoton(JSON.stringify({
    features: [{ properties: { country: 'ایران', state: 'تهران', city: 'تهران', street: 'خیابان آزادی', housenumber: '۱۲' } }]
  }));
  assert.ok(out.includes('خیابان آزادی'));
  assert.ok(out.includes('پلاک: ۱۲'));
  assert.equal(env.api.normPhoton('not json'), null);
});

/* ───────── ۳ و ۱۱) آنلاین پایدار و صفِ ارسال ───────── */
test('v12.15.0: the offline badge is corrected while the connection is healthy', async (t) => {
  const env = withEnv(t, {});
  await env.win.fetch('/api/state').catch(() => {});
  env.api.fixBadge();
  assert.ok(!/آفلاین/.test(env.badge.textContent), 'با شبکهٔ سالم نباید آفلاین نشان داده شود: ' + env.badge.textContent);
});

test('v12.15.0: saves go to an outbox and are flushed when the connection returns', async (t) => {
  const env = withEnv(t, { network: 'down' });
  env.win.saveState();
  assert.equal(env.api.outbox().pending, true, 'ذخیره باید در صف برود');

  /* هنوز اینترنت قطع است: تلاش بی‌نتیجه می‌ماند و وضعیت در صف باقی می‌ماند */
  assert.equal(await env.api.flushOutbox(), false);
  assert.equal(env.api.outbox().pending, true, 'با قطعیِ اینترنت صف باید بماند');

  /* اینترنت وصل می‌شود: ارسالِ خودکار */
  env.opts.network = 'up';
  const flushed = await env.api.flushOutbox();
  assert.equal(flushed, true, 'با وصل‌شدنِ اینترنت باید خودکار فرستاده شود');
  assert.equal(env.api.outbox().pending, false);
  const last = env.calls[env.calls.length - 1];
  assert.equal(last.url, '/api/state');
  assert.equal(last.o.method, 'POST');
});

/* ───────── ۴ و ۵) جایگذاری خودکار با نام و آدرس ───────── */
test('v12.15.0: order pick box shows same-named pharmacies with their address and fills the form', (t) => {
  const env = withEnv(t, {
    state: {
      pharmacies: [
        { id: 'p1', name: 'داروخانه نیک', address: 'تهران، آزادی، پلاک ۱۲', city: 'تهران', lat: 35.7, lng: 51.4 },
        { id: 'p2', name: 'داروخانه نیکو', address: 'کرج، مهرشهر، پلاک ۴', city: 'کرج' },
        { id: 'p3', name: 'داروخانه سلامت', address: 'شیراز، زند' }
      ]
    }
  });
  const found = env.api.matchPharmacies('نیک');
  assert.equal(found.length, 2, 'فقط داروخانه‌های هم‌نام باید بیایند');
  assert.ok(found.every((p) => p.address), 'هر پیشنهاد باید آدرس داشته باشد');

  env.api.applyPharmacy(found[0]);
  assert.equal(env.phName.value, 'داروخانه نیک');
  assert.equal(env.phAddr.value, 'تهران، آزادی، پلاک ۱۲');
});

test('v12.15.0: the pick box is inserted at the very top of the orders tab', (t) => {
  const env = withEnv(t, { state: { pharmacies: [{ id: 'p1', name: 'داروخانه نیک', address: 'تهران' }] } });
  env.api.setupOrderPick();
  const tab = env.tabs['tab-orders'];
  const box = env.doc.getElementById('crm1215OrderPick');
  assert.ok(box, 'کادر باید ساخته شود');
  assert.equal(tab.children[0], box, 'کادر باید بالاتر از همه (بالای صفحه) باشد');
});

/* ───────── ۶) نمایش تردد ───────── */
test('v12.15.0: every traffic row gets a "نمایش تردد" button that draws origin → destination', async (t) => {
  const env = withEnv(t, {
    state: {
      visitTracks: [{ id: 't1', repName: 'علی رضایی', path: [[35.70, 51.40], [35.71, 51.42], [35.72, 51.45]] }]
    }
  });
  const track = env.api.findTrackForRow('علی رضایی 1404/01/02');
  assert.ok(track, 'ردیف باید به مسیر وصل شود');
  assert.equal(env.api.drawTrack(track), true, 'مسیر باید روی نقشه رسم شود');
  assert.equal(env.drawn.length, 1);

  const n = env.api.setupTrafficButtons();
  assert.equal(n, 1, 'برای هر سطر یک کلید ساخته می‌شود');
  await wait(60);
  const btn = env.table.querySelector('.crm1215-traffic-btn');
  assert.ok(btn, 'کلیدِ نمایش تردد باید ساخته شود');
  btn.click();          /* بدون پرتاب خطا و بدون نیاز به اینترنت */
});

/* ───────── ۷) طبقه و پلاک ───────── */
test('v12.15.0: homes list gains floor and plate columns', (t) => {
  const env = withEnv(t, { state: { repHomes: [{ name: 'خانه الف', floor: '۳', plate: '۱۲' }] } });
  const table = env.doc.createElement('table');
  const thead = env.doc.createElement('thead');
  const htr = env.doc.createElement('tr');
  const th = env.doc.createElement('th'); th.textContent = 'نام';
  htr.appendChild(th); thead.appendChild(htr);
  const tbody = env.doc.createElement('tbody');
  const tr = env.doc.createElement('tr');
  const td = env.doc.createElement('td'); td.textContent = 'خانه الف';
  tr.appendChild(td); tbody.appendChild(tr);
  table.appendChild(thead); table.appendChild(tbody);
  env.tabs['tab-rep-homes'].appendChild(table);

  const n = env.api.setupHomesColumns();
  assert.equal(n, 1);
  const heads = htr.children.map((c) => c.textContent);
  assert.ok(heads.includes('طبقه'), 'ستون طبقه باید اضافه شود');
  assert.ok(heads.includes('پلاک'), 'ستون پلاک باید اضافه شود');
  assert.deepEqual(tr.children.slice(-2).map((c) => c.textContent), ['۳', '۱۲']);
});

/* ───────── ۸) پیام‌رسان ───────── */
test('v12.15.0: messenger tokens, group names and destination numbers (multiple each)', (t) => {
  const env = withEnv(t, { state: {} });
  assert.equal(env.api.CHANNELS.length >= 4, true, 'چند پیام‌رسان ایرانی باید پشتیبانی شود');
  env.api.addTarget('bale', 'group', '@sales');
  env.api.addTarget('bale', 'group', '@tehran');
  env.api.addTarget('bale', 'phone', '09120000000');
  env.api.addTarget('bale', 'phone', '09350000000');
  env.state.messengers.channels.bale.token = 'TOKEN123';
  env.api.addTarget('eitaa', 'group', '@kerman');
  env.state.messengers.channels.eitaa.token = 'EITAA-TOKEN';

  const q = env.api.buildSendQueue('سلام');
  assert.equal(q.length, 5, 'هر گروه و هر شماره یک مقصد است');
  assert.equal(q.filter((x) => x.channel === 'bale').length, 4);
  assert.equal(q.filter((x) => x.kind === 'phone').length, 2);
  assert.ok(q.every((x) => x.token && x.to && x.text === 'سلام'));

  env.api.removeTarget('bale', 'group', '@tehran');
  assert.equal(env.api.buildSendQueue('x').filter((x) => x.channel === 'bale').length, 3);
});

/* ───────── ۹) قیمت‌گذاری ───────── */
test('v12.15.0: consumer price with VAT is restored after save (never reverts)', (t) => {
  const env = withEnv(t, {});
  const snap = env.api.snapshotPricing();
  assert.equal(snap.priceConsumerVat, '125000');
  env.vatInput.value = '99';
  const fixed = env.api.restorePricing(snap);
  assert.equal(fixed, 1);
  assert.equal(env.vatInput.value, '125000', 'مقدارِ ثبت‌شده باید بماند');
});

/* ───────── ۱۰) نوع فیلد ساعت ───────── */
test('v12.15.0: "ساعت" is an available field type and shows hour:minute only', (t) => {
  const env = withEnv(t, {});
  env.api.addTimeFieldType();
  const vals = env.typeSel.children.map((o) => o.value);
  assert.ok(vals.includes('time'), 'نوع ساعت باید در فهرست باشد');
  const n = env.api.applyTimeInputs();
  assert.equal(n, 1);
  assert.equal(env.timeInput.type, 'time');
  assert.equal(env.timeInput.getAttribute('step'), '60', 'ثانیه باید حذف شود');
  assert.equal(env.api.formatTime('09:05:33'), '09:05');
  assert.equal(env.api.formatTime('9:5'), '09:05');
});

/* ───────── ۱۳) دسترسیِ ریز ───────── */
test('v12.15.0: granular permissions are stored per tab and per action', (t) => {
  const env = withEnv(t, { state: { users: [{ id: 'u1', fullName: 'رضا' }], tabLabels: { 'tab-orders': 'سفارشات' } } });
  const m = env.api.permMatrix('u1');
  assert.ok(m.tabs.length >= 1);
  assert.deepEqual(m.actions.map((a) => a.id), ['view', 'add', 'edit', 'delete', 'export', 'approve']);
  assert.equal(m.matrix['tab-orders'].view, true, 'مشاهده پیش‌فرض است');
  env.api.setPerm('u1', 'tab-orders', 'edit', true);
  assert.equal(env.state.granularPerms.u1['tab-orders'].edit, true);
  env.api.setPerm('u1', 'tab-orders', 'delete', true);
  assert.equal(env.state.granularPerms.u1['tab-orders'].view, true, 'با هر دسترسی، مشاهده هم روشن می‌ماند');
  assert.equal(env.state.granularPerms.u1['tab-orders'].approve, false);
});

/* ───────── ۱۴) زمان ویزیت و آلارم ───────── */
test('v12.15.0: visit alarms are raised one day before for user, supervisor and manager', (t) => {
  const now = Date.now();
  const soon = new Date(now + 20 * 3600 * 1000);           /* ۲۰ ساعت دیگر */
  const late = new Date(now + 10 * 24 * 3600 * 1000);      /* دورتر از یک روز */
  const env = withEnv(t, {
    state: {
      currentUser: { id: 'u1' },
      pharmacies: [{ id: 'p1', name: 'داروخانه نیک', nextVisitAt: soon.toISOString() }],
      doctors: [{ id: 'd1', name: 'دکتر آزاد', nextVisitAt: late.toISOString() }]
    }
  });
  const due = env.api.dueVisits(now);
  assert.equal(due.length, 1, 'تنها موردِ داخلِ یک روز باید بیاید');
  assert.equal(due[0].name, 'داروخانه نیک');
  const added = env.api.raiseVisitAlarms();
  assert.equal(added, 3, 'برای کاربر و سرپرست و مدیر یک آلارم');
  assert.equal(env.state.notifications.length, 3);
  assert.ok(env.state.notifications.some((n) => n.to === 'u1'));
  assert.ok(env.state.notifications.some((n) => n.to === 'supervisor'));
  assert.ok(env.state.notifications.some((n) => n.to === 'manager'));
  assert.equal(env.api.raiseVisitAlarms(), 0, 'آلارم تکراری ساخته نمی‌شود');
});

/* ───────── ۱۶) خروجی اکسل ───────── */
test('v12.15.0: exports get Persian headers and a row number', (t) => {
  const env = withEnv(t, {});
  let captured = null;
  env.win.downloadCSVFile = function (name, headers, rows) { captured = { name, headers, rows }; return true; };
  env.api.setupExcelExport();
  env.win.downloadCSVFile('orders.csv', ['id', 'name', 'address'], [[1, 'نیک', 'تهران']]);
  assert.deepEqual(captured.headers, ['ردیف', 'شناسه', 'نام', 'آدرس']);
  assert.deepEqual(captured.rows[0][0], 1, 'شماره ردیف افزوده می‌شود');
  assert.equal(env.api.persianHeader('repName'), 'نام نماینده');
  assert.equal(env.api.persianHeader('داروخانه'), 'داروخانه');
});

test('v12.15.0: excel column order follows the sequence defined in the columns tab', (t) => {
  const env = withEnv(t, {
    state: {
      formFieldMeta: { pharmacies: { name: { listOrder: 2 }, address: { listOrder: 1 } } }
    }
  });
  const ordered = env.api.excelColumnOrder(['name', 'address']);
  assert.deepEqual(ordered, ['address', 'name']);
});

/* ───────── استاتیک ───────── */
test('v12.15.0: styling exists and the layer never blocks other tabs (idle scheduling)', (t) => {
  const css = readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.crm1215-pick/);
  assert.match(css, /\.crm1215-traffic-btn/);
  assert.match(css, /@media \(max-width: 720px\)/, 'نسخهٔ موبایل هم باید داشته باشد');
  assert.match(layer, /requestIdleCallback/, 'کارهای سنگین باید در idle انجام شوند');
  assert.match(layer, /now - t0 > 8/, 'پردازش باید تکه‌تکه باشد تا تب‌های دیگر قفل نشوند');
  assert.match(layer, /childList: true, subtree: true/);
});
