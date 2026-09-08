/**
 * v12.19.0 — نوبت ۱۴۳
 *  ۱) ساعت و تاریخِ روز در بالای صفحه (دو برچسبِ جدا، فاصلهٔ کم) + نسخهٔ برنامه
 *     بالای کادرِ آبی‌رنگِ وضعیت.
 *  ۲) «قفلِ چیدمان»: جای فیلدها فقط با CSS order از شمارهٔ ترتیبِ ذخیره‌شده ساخته
 *     می‌شود (بدونِ جابه‌جاییِ DOM) و پس از هر به‌هم‌ریختگی دوباره برقرار می‌گردد.
 *  ۳) تنظیماتِ طراح (فاصلهٔ پیش/پس، شمارهٔ سطر، جای فیلد، ستاره، وابسته به فیلد)
 *     واقعاً روی گروهِ فیلد می‌نشینند.
 *  ۴) «افزودن لحظه‌ای گزینه» = خاموش → دکمه پنهان و کلیک بسته.
 *  ۵) خروجیِ اکسل = همهٔ اطلاعاتِ تب (ثابت + سفارشی + بقیهٔ کلیدهای رکورد).
 *  ۶) همگام‌سازیِ خودکار هر ۱۰ ثانیه.
 * قانون ۹۲: بندها با اجرایِ همانِ کدِ مرورگری سنجیده می‌شوند.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const layerSrc = readFileSync(new URL('public/crm-v12.19.0.js', root), 'utf8');
const indexSrc = readFileSync(new URL('public/index.html', root), 'utf8');
const cssSrc = readFileSync(new URL('public/style.css', root), 'utf8');
const bundle = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

/* ───────── استابِ سبکِ DOM ───────── */
function styleStub() {
  const m = new Map();
  const prio = new Map();
  return {
    _m: m,
    getPropertyValue: (p) => (m.has(p) ? m.get(p) : ''),
    setProperty(p, v, pr) { m.set(p, String(v)); prio.set(p, pr || ''); },
    removeProperty(p) { m.delete(p); prio.delete(p); },
    getPriority: (p) => prio.get(p) || ''
  };
}
function node(tag, opts) {
  opts = opts || {};
  const n = {
    tagName: (tag || 'div').toUpperCase(),
    id: opts.id || '',
    className: opts.className || '',
    textContent: opts.textContent || '',
    hidden: false,
    dataset: {},
    attrs: {},
    style: styleStub(),
    children: [],
    parentNode: null,
    _sel: opts.sel || {},
    appendChild(c) { c.parentNode = n; n.children.push(c); return c; },
    insertBefore(c, ref) {
      c.parentNode = n;
      const i = ref ? n.children.indexOf(ref) : -1;
      if (i < 0) n.children.push(c); else n.children.splice(i, 0, c);
      return c;
    },
    setAttribute(k, v) { n.attrs[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(n.attrs, k) ? n.attrs[k] : null; },
    removeAttribute(k) { delete n.attrs[k]; },
    closest(sel) {
      let cur = n;
      while (cur) {
        if (matches(cur, sel)) return cur;
        cur = cur.parentNode;
      }
      return null;
    },
    querySelector(sel) { return n.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const key = sel;
      if (n._sel[key]) return n._sel[key].slice();
      const out = [];
      (function walk(x) {
        x.children.forEach((c) => { if (matches(c, sel)) out.push(c); walk(c); });
      })(n);
      return out;
    }
  };
  n.classList = {
    _s: new Set(String(n.className).split(/\s+/).filter(Boolean)),
    contains(c) { return n.classList._s.has(c); },
    add(c) { n.classList._s.add(c); },
    remove(c) { n.classList._s.delete(c); },
    toggle(c, on) { if (on) n.classList._s.add(c); else n.classList._s.delete(c); }
  };
  return n;
}
function matchesOne(n, sel) {
  if (!n || !n.classList) return false;
  if (sel.charAt(0) === '.') return n.classList.contains(sel.slice(1));
  if (sel.charAt(0) === '#') return n.id === sel.slice(1);
  if (/^\[data-custom-field-id=/.test(sel)) {
    const want = sel.replace(/^\[data-custom-field-id=["']?/, '').replace(/["']?\]$/, '');
    return (n.getAttribute('data-custom-field-id') || '') === want;
  }
  return n.tagName === sel.toUpperCase();
}
function matches(n, sel) {
  if (!n) return false;
  return String(sel).split(',').some((part) => {
    const chain = part.trim().split(/\s+/).filter(Boolean);
    if (!chain.length) return false;
    if (!matchesOne(n, chain[chain.length - 1])) return false;
    let cur = n.parentNode;
    for (let i = chain.length - 2; i >= 0; i--) {
      let hit = false;
      while (cur) { if (matchesOne(cur, chain[i])) { hit = true; cur = cur.parentNode; break; } cur = cur.parentNode; }
      if (!hit) return false;
    }
    return true;
  });
}

function makeEnv(opts) {
  opts = opts || {};
  const byId = new Map();
  const doc = {
    readyState: 'complete',
    hidden: false,
    getElementById: (id) => {
      if (byId.has(id)) return byId.get(id);
      let found = null;
      (function walk(x) {
        if (found) return;
        (x.children || []).forEach((c) => {
          if (found) return;
          if (c.id === id) { found = c; return; }
          walk(c);
        });
      })(doc.documentElement);
      return found;
    },
    querySelector(sel) { return doc.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const out = [];
      (function walk(x) {
        (x.children || []).forEach((c) => { if (matches(c, sel)) out.push(c); walk(c); });
      })(doc.documentElement);
      return out;
    },
    addEventListener() {},
    createElement: (tag) => node(tag),
    documentElement: node('html')
  };
  doc.body = node('body');
  doc.documentElement.appendChild(doc.body);

  const listeners = { window: [], document: [] };
  const timers = [];
  const toasts = [];
  const win = {
    document: doc,
    CRM_APP_VERSION: '12.19.0',
    state: opts.state || { formFieldMeta: {}, customFields: {} },
    v20Toast: (m) => toasts.push(m),
    getUnifiedFieldList: opts.getUnifiedFieldList || (() => []),
    paintFieldBox: opts.paintFieldBox || (() => {}),
    paintRequiredStar: opts.paintRequiredStar || (() => {}),
    downloadCSVFile: opts.downloadCSVFile || (() => {}),
    MutationObserver: undefined,
    setTimeout: (fn) => { timers.push(fn); return timers.length; },
    setInterval: (fn) => { timers.push(fn); return timers.length; },
    addEventListener: (t, fn, cap) => listeners.window.push({ t, fn, cap })
  };
  doc.addEventListener = (t, fn, cap) => listeners.document.push({ t, fn, cap });
  win.window = win;

  const fn = new Function('window', 'document', 'setInterval', 'setTimeout',
    '"use strict";' + layerSrc + '\nreturn window.v1219Api;');
  const api = fn(win, doc, win.setInterval, win.setTimeout);
  return { api, win, doc, byId, listeners, timers, toasts, node };
}

function runBoot(env) {
  const queued = env.timers.slice();
  env.timers.length = 0;
  queued.forEach((fn) => { try { fn(); } catch (e) { /* boot هرگز نباید بشکند */ } });
}

/* ───────── ۱) بارگذاری و نسخه ───────── */
test('v12.19.0: لایهٔ پایانی پس از باندل بارگذاری می‌شود و نسخه در همهٔ سطوح یکی است', () => {
  const iBundle = indexSrc.indexOf('crm-bundle.js?v=12.19.0');
  const iLayer = indexSrc.indexOf('crm-v12.19.0.js?v=12.19.0');
  assert.ok(iBundle > 0 && iLayer > 0, 'هر دو اسکریپت در index.html');
  assert.ok(iLayer > iBundle, 'لایهٔ ۱۲.۱۹ پس از باندل = آخرین کدِ اجرایی');
  assert.equal(pkg.version, '12.19.0');
  assert.match(bundle, /نسخه‌ی جاری: 12\.19\.0/);
  assert.ok(cssSrc.includes('.crm-header-clock'), 'سبکِ ساعت');
  assert.ok(cssSrc.includes('.crm-header-stack'), 'ستونِ نسخه بالای کادرِ آبی');
  assert.ok(cssSrc.includes('grid-column: 1 / -1 !important'), '«زیرِ هم» در گرید');
});

test('v12.19.0: همگام‌سازیِ خودکار هر ۱۰ ثانیه (pull + pushِ بی‌صدا)', () => {
  assert.match(bundle, /setInterval\(tick, 10000\)/, 'بازهٔ ۱۰ ثانیه');
  const at = bundle.indexOf('setInterval(tick, 10000)');
  const from = bundle.lastIndexOf('function tick() {', at);
  assert.ok(from > 0 && from < at, 'همانِ tickِ مویرگ');
  const region = bundle.slice(from, at);
  assert.ok(region.includes('pullNow(false)'), 'کشیدنِ سبک');
  assert.ok(region.includes('pushNow(true, false, false)'), 'فرستادنِ بی‌صدا با auth=false (حذفِ رکوردِ دیگران ممنوع)');
  assert.match(bundle, /خودکار هر ۱۰ ثانیه/, 'ردیفِ عیب‌یابی هم خودکاربودن را می‌گوید');
});

/* ───────── ۲) هدر: ساعت + تاریخ + نسخه بالای کادرِ آبی ───────── */
test('v12.19.0: ساعت و تاریخ دو برچسبِ جدا در بالای صفحه و نسخه بالای کادرِ آبی', () => {
  const { api, doc, byId, node: mk } = makeEnv({});
  const header = mk('header', { className: 'app-header' });
  const actions = mk('div', { className: 'header-actions' });
  header.appendChild(actions);
  doc.body.appendChild(header);
  const logoText = mk('div', { className: 'logo-text' });
  const badge = mk('div', { id: 'crmBuildBadge', textContent: 'نسخه 12.19.0' });
  logoText.appendChild(badge);
  doc.body.appendChild(logoText);
  byId.set('crmBuildBadge', badge);
  const pill = mk('div', { className: 'header-user-pill' });
  actions.appendChild(pill);

  api.ensureHeaderChrome();

  const clock = byId.get('crmHeaderClock') || doc.getElementById('crmHeaderClock');
  assert.ok(clock, 'کادرِ ساعت ساخته شد');
  assert.equal(clock.parentNode, actions, 'ساعت در بالای صفحه (هدر)');
  assert.match(clock.innerHTML || '', /crm-clock-time/);
  assert.match(clock.innerHTML || '', /crm-clock-date/);
  assert.match(clock.innerHTML || '', /crm-clock-sep/, 'جداکنندهٔ میانِ ساعت و تاریخ');

  const stack = doc.getElementById('crmHeaderStack');
  assert.ok(stack, 'ستونِ نسخه + کادرِ آبی');
  assert.equal(stack.children[0], badge, 'نسخهٔ برنامه «بالای» کادرِ آبی');
  assert.equal(stack.children[1], pill, 'کادرِ آبی زیرِ نسخه');
  assert.equal(badge.parentNode, stack, 'نسخه از لوگو به هدر منتقل شد');
});

test('v12.19.0: ثانیه‌شمار فقط وقتی متن عوض شده می‌نویسد (ریشهٔ «پرشِ صفحات»)', () => {
  const { api, doc, byId, node: mk } = makeEnv({});
  const t = mk('span', { id: 'crmClockTime' });
  const d = mk('span', { id: 'crmClockDate' });
  byId.set('crmClockTime', t); byId.set('crmClockDate', d);
  doc.getElementById = (id) => byId.get(id) || null;

  api.tickClock();
  const first = t.textContent;
  assert.match(first, /^\d{2}:\d{2}:\d{2}$/, 'ساعت HH:MM:SS');
  assert.match(d.textContent, /\d/, 'تاریخِ روز نوشته شد');
  assert.equal(/[۰-۹]/.test(first + d.textContent), false, 'رقم‌ها لاتین (یک‌دست)');

  let writes = 0;
  const origSet = Object.getOwnPropertyDescriptor(t, 'textContent');
  Object.defineProperty(t, 'textContent', {
    get: () => first,
    set: () => { writes++; }
  });
  api.tickClock();
  api.tickClock();
  assert.equal(writes, 0, 'نوشتنِ بی‌اثر = صفر → ناظرِ چیدمان بیدار نمی‌شود');
  void origSet;
});

/* ───────── ۳) قفلِ چیدمان ───────── */
function layoutEnv() {
  const fields = [
    { id: 'pharmacyDate', builtin: true, label: 'تاریخ ثبت', order: 1, listOrder: 1, place: 'beside' },
    { id: 'pharmacyName', builtin: true, label: 'نام داروخانه', order: 2, listOrder: 2, place: 'beside', gapBeforeMm: 5 },
    { id: 'pharmacyAddress', builtin: true, label: 'آدرس', order: 3, listOrder: 3, place: 'under', rowNo: 3 },
    { id: 'cf-pharmacy-1', builtin: false, label: 'کد اقتصادی', order: 4, listOrder: 4, allowAddOption: false, dependsOn: 'pharmacyName' }
  ];
  const env = makeEnv({ getUnifiedFieldList: (tab) => (tab === 'tab-pharmacies' ? fields : []) });
  const { doc, byId, node: mk } = env;

  const pane = mk('section', { id: 'tab-pharmacies', className: 'tab-pane' });
  const grid = mk('div', { className: 'form-grid' });
  pane.appendChild(grid);
  doc.body.appendChild(pane);
  byId.set('tab-pharmacies', pane);

  const groups = {};
  fields.forEach((f) => {
    const g = mk('div', { className: 'form-group' });
    grid.appendChild(g);
    if (f.builtin) {
      const inp = mk('input', { id: f.id });
      g.appendChild(inp);
      byId.set(f.id, inp);
    } else {
      const inp = mk('input');
      inp.setAttribute('data-custom-field-id', f.id);
      g.appendChild(inp);
      const btn = mk('button', { className: 'btn-instant-add' });
      g.appendChild(btn);
      pane._sel['[data-custom-field-id="' + f.id + '"]'] = [inp];
      groups[f.id + ':btn'] = btn;
    }
    groups[f.id] = g;
  });
  return { env, pane, grid, groups, fields };
}

test('v12.19.0: قفلِ چیدمان — order از شمارهٔ ترتیب، بدونِ هیچ جابه‌جاییِ DOM', () => {
  const { env, grid, groups } = layoutEnv();
  const before = grid.children.slice();

  const writes = env.api.lockTab('tab-pharmacies');
  assert.ok(writes > 0, 'چیزی نوشته شد');
  assert.equal(groups['pharmacyDate'].style.getPropertyValue('order'), '1');
  assert.equal(groups['pharmacyName'].style.getPropertyValue('order'), '2');
  assert.equal(groups['pharmacyAddress'].style.getPropertyValue('order'), '3');
  assert.equal(groups['cf-pharmacy-1'].style.getPropertyValue('order'), '4');
  assert.deepEqual(grid.children, before, 'DOM هرگز جابه‌جا نمی‌شود (ریشهٔ پرشِ فیلدها)');

  // به‌هم‌ریختگیِ عمدی (مثلِ پاک‌کردنِ فرم یا اجرای موتور) → دوباره همان ترتیب
  groups['pharmacyDate'].style.setProperty('order', '9', 'important');
  groups['cf-pharmacy-1'].style.setProperty('order', '7', 'important');
  env.api.lockTab('tab-pharmacies');
  assert.equal(groups['pharmacyDate'].style.getPropertyValue('order'), '1', 'بازگشت به جایِ ذخیره‌شده');
  assert.equal(groups['cf-pharmacy-1'].style.getPropertyValue('order'), '4', 'فیلدِ سفارشی هم قفل است');
  assert.deepEqual(grid.children, before, 'همچنان بدونِ جابه‌جاییِ DOM');
});

test('v12.19.0: تنظیماتِ طراح روی فیلد می‌نشینند (زیرِ هم، فاصله، سطر، وابستگی)', () => {
  const { env, groups } = layoutEnv();
  env.api.lockTab('tab-pharmacies');
  const addr = groups['pharmacyAddress'];
  assert.equal(addr.style.getPropertyValue('grid-column'), '1 / -1', '«زیرِ هم» = تمامِ عرضِ سطر');
  assert.equal(addr.style.getPropertyValue('grid-row'), '3', 'شمارهٔ سطر');

  // «وابسته به فیلد»: تا نامِ داروخانه خالی است، فیلدِ وابسته نشان داده نمی‌شود
  const dep = groups['cf-pharmacy-1'];
  assert.equal(dep.style.getPropertyValue('display'), 'none', 'مرجع خالی → فیلدِ وابسته پنهان');
  const nameInput = env.doc.getElementById('pharmacyName');
  nameInput.value = 'داروخانهٔ نمونه';
  env.api.lockTab('tab-pharmacies');
  assert.equal(dep.style.getPropertyValue('display'), '', 'مرجع پر شد → فیلدِ وابسته نمایش داده می‌شود');
});

test('v12.19.0: برداشتنِ تیکِ «افزودن لحظه‌ای گزینه» دکمه را برمی‌دارد و کلیک را می‌بندد', () => {
  const { env, groups } = layoutEnv();
  const btn = groups['cf-pharmacy-1:btn'];
  assert.equal(btn.hidden, false, 'پیش ازِ لایه، دکمه دیده می‌شود');
  runBoot(env);
  assert.equal(btn.hidden, true, 'boot = قفلِ چیدمان: دکمه پنهان شد');
  btn.hidden = false; delete btn.dataset.v12190off;
  env.api.lockTab('tab-pharmacies');
  assert.equal(btn.hidden, true, 'دکمه پنهان شد');
  assert.equal(btn.dataset.v12190off, '1', 'برچسبِ «خاموش»');
  assert.equal(env.api.allowAddOptionFor('cf-pharmacy-1'), false);
  assert.equal(env.api.allowAddOptionFor('pharmacyName'), true);

  // بستنِ کلیک در فازِ capture
  const clickL = env.listeners.window.filter((l) => l.t === 'click' && l.cap === true);
  assert.ok(clickL.length >= 1, 'شنوندهٔ capture روی window');
  let stopped = false;
  const wrap = groups['cf-pharmacy-1'];
  const ev = {
    target: { closest: (sel) => (sel.includes('btn-instant-add') ? btn : null) },
    preventDefault() {},
    stopImmediatePropagation() { stopped = true; }
  };
  btn.closest = (sel) => (sel.includes('instant-add-row') || sel.includes('form-group') ? wrap : null);
  clickL.forEach((l) => l.fn(ev));
  assert.equal(stopped, true, 'کلیکِ افزودنِ لحظه‌ای بسته شد');
  assert.ok(env.toasts.some((m) => m.includes('افزودن لحظه‌ای')), 'راهنمای کاربر');
});

/* ───────── ۴) خروجیِ اکسلِ کامل ───────── */
test('v12.19.0: خروجیِ اکسلِ تب = همهٔ اطلاعاتِ تب (ثابت + سفارشی + بقیهٔ کلیدها)', () => {
  const state = {
    pharmacies: [{
      name: 'داروخانهٔ نمونه', phone: '02112345678', province: 'تهران', city: 'تهران',
      isPercentage: true, repName: 'جواد', manager: 'مسئول فنی',
      customFields: { 'کد اقتصادی': '123456789012' }
    }],
    formFieldMeta: {}, customFields: {}
  };
  const fields = [
    { id: 'name', builtin: true, label: 'نام داروخانه', order: 1, listOrder: 1 },
    { id: 'cf-pharmacy-1', builtin: false, label: 'کد اقتصادی', order: 2, listOrder: 2 }
  ];
  const env = makeEnv({ state, getUnifiedFieldList: (t) => (t === 'tab-pharmacies' ? fields : []) });
  const out = env.api.buildFullExport('pharmacy');

  assert.equal(out.count, 1);
  assert.ok(out.headers.includes('نام داروخانه'), 'ستونِ ثابت');
  assert.ok(out.headers.includes('کد اقتصادی'), 'فیلدِ سفارشیِ تب');
  assert.ok(out.headers.includes('manager'), 'کلیدِ دیگری که روی رکورد ذخیره شده از قلم نمی‌افتد');
  assert.ok(!out.headers.includes('customFields'), 'خودِ آبجکتِ customFields ستون نمی‌شود');

  const row = out.rows[0];
  assert.equal(row.length, out.headers.length, 'تعدادِ خانه‌ها = تعدادِ ستون‌ها');
  assert.equal(row[out.headers.indexOf('نام داروخانه')], 'داروخانهٔ نمونه');
  assert.equal(row[out.headers.indexOf('کد اقتصادی')], '123456789012');
  assert.equal(row[out.headers.indexOf('درصدی')], 'بله', 'بولی به بله/خیر');
  assert.equal(row[out.headers.indexOf('manager')], 'مسئول فنی');
});

test('v12.19.0: کلیکِ خروجی در فازِ capture روی window = پیش ازِ لایهٔ ۱۲.۱۸', () => {
  const state = { pharmacies: [{ name: 'الف', customFields: {} }], formFieldMeta: {}, customFields: {} };
  let downloaded = null;
  const env = makeEnv({
    state,
    getUnifiedFieldList: () => [],
    downloadCSVFile: (file, headers, rows) => { downloaded = { file, headers, rows }; }
  });
  runBoot(env);
  const cap = env.listeners.window.filter((l) => l.t === 'click' && l.cap === true);
  assert.ok(cap.length, 'شنوندهٔ capture ثبت شده');
  const btn = { id: 'btnExportPharmaciesCSV', closest: (s) => (s.includes('btnExportPharmaciesCSV') ? btn : null) };
  const ev = { target: { closest: (s) => (s.includes('btnExport') ? btn : null) }, preventDefault() {}, stopImmediatePropagation() {} };
  cap.forEach((l) => l.fn(ev));
  assert.ok(downloaded, 'خروجی تولید شد');
  assert.equal(downloaded.file, 'pharmacies-full-export.csv');
  assert.ok(downloaded.headers.length > 10, 'ستون‌های کامل');
});
