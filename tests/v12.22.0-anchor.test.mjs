/**
 * v12.22.0 — نوبت ۱۴۶ (بر پایهٔ ۱۴۵)
 *  ۵) تاریخِ شمسیِ بی‌پرش و بی‌ویرگول («1,405» ممنوع) + هدرِ فشرده با «طنین طب طاها»
 *  ۶) قفلِ order+DOM: هم ترتیبِ DOM و هم CSS `order` یکی می‌شوند + کلیدِ خودِ باندل
 *  ۷) طراح عددهایِ «واقعیِ» همان فیلد را نشان می‌دهد (نه ۲۲۰ برایِ همه)
 *  ۸) بستنِ منویِ همبرگری با ✕
 *  ۹) «ارسال به رندر» با وضعیتِ واقعیِ HTTP
 *  ۱۰) سرستون‌هایِ اکسل همه فارسی
 * ————— نوبت ۱۴۵ —————
 *  ۱) قفلِ لنگر: فیلدی که کدِ دیگر آن را به پایینِ کادرِ «📍 لوکیشن و نقشهٔ
 *     داروخانه» می‌برد، به جایِ اصلی برمی‌گردد؛ کادرِ لوکیشن تکان نمی‌خورد؛
 *     تنها «شماره ترتیب در فرم» جایِ فیلد را عوض می‌کند.
 *  ۲) ایتم‌هایِ طراح واقعاً اعمال می‌شوند — به‌ویژه «فاصله نسبت به فیلدِ
 *     قبلی/بعدی (میلی‌متر)» با تبدیلِ mm→px.
 *  ۳) هدرِ فشردهٔ تک‌ردیفه + ساعتِ بی‌پرش (عرضِ ثابت) + حذفِ نسخهٔ تکراری.
 *  ۴) گاوصندوقِ تنظیمات: فیلدهایِ گم‌شده برمی‌گردند، فیلدِ حذف‌شدهٔ عمدی نه.
 * قانون ۹۲: بندها با اجرایِ همانِ کدِ مرورگری سنجیده می‌شوند.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const layerSrc = readFileSync(new URL('public/crm-v12.22.0.js', root), 'utf8');
const indexSrc = readFileSync(new URL('public/index.html', root), 'utf8');
const cssSrc = readFileSync(new URL('public/style.css', root), 'utf8');
const bundle = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const serverSrc = readFileSync(new URL('server.js', root), 'utf8');
const phpSrc = readFileSync(new URL('public/api.php', root), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

/* ───────── استابِ DOM (کافی برایِ اجرایِ واقعیِ لایه) ───────── */
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

function matchesOne(n, sel) {
  if (!n || !n.classList) return false;
  sel = sel.trim();
  if (sel.charAt(0) === '.') return n.classList.contains(sel.slice(1));
  if (sel.charAt(0) === '#') return n.id === sel.slice(1);
  const attr = sel.match(/^\[([a-zA-Z-]+)(?:([~^$*|]?=)["']?([^\]"']*)["']?)?\]$/);
  if (attr) {
    const v = n.getAttribute(attr[1]);
    if (attr[2] == null) return v != null;
    return String(v == null ? '' : v) === attr[3];
  }
  const notHidden = sel.match(/^([a-zA-Z]+):not\(\[type=hidden\]\)$/);
  if (notHidden) {
    return n.tagName === notHidden[1].toUpperCase() && String(n.getAttribute('type') || '') !== 'hidden';
  }
  const combo = sel.match(/^([a-zA-Z]+)((?:[.#][\w-]+|\[[^\]]+\])*)$/);
  if (combo) {
    if (n.tagName !== combo[1].toUpperCase()) return false;
    if (!combo[2]) return true;
    const rest = combo[2].match(/[.#][\w-]+|\[[^\]]+\]/g) || [];
    return rest.every((s) => matchesOne(n, s));
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

function node(tag, opts) {
  opts = opts || {};
  const n = {
    tagName: (tag || 'div').toUpperCase(),
    id: opts.id || '',
    className: opts.className || '',
    textContent: opts.textContent || '',
    innerHTML: opts.innerHTML || '',
    hidden: false,
    dataset: {},
    attrs: {},
    style: styleStub(),
    children: [],
    parentNode: null,
    _sel: opts.sel || {},
    _rect: opts.rect || null,
    _computed: opts.computed || {},
    getBoundingClientRect() {
      return { width: (n._rect && n._rect.w) || 0, height: (n._rect && n._rect.h) || 0 };
    },
    get nextSibling() {
      if (!n.parentNode) return null;
      const s = n.parentNode.children;
      const i = s.indexOf(n);
      return i >= 0 && i + 1 < s.length ? s[i + 1] : null;
    },
    get firstChild() { return n.children[0] || null; },
    appendChild(c) {
      if (c.parentNode) c.parentNode.removeChild(c);
      c.parentNode = n; n.children.push(c); return c;
    },
    insertBefore(c, ref) {
      if (c.parentNode) c.parentNode.removeChild(c);
      c.parentNode = n;
      const i = ref ? n.children.indexOf(ref) : -1;
      if (i < 0) n.children.push(c); else n.children.splice(i, 0, c);
      return c;
    },
    removeChild(c) {
      const i = n.children.indexOf(c);
      if (i >= 0) { n.children.splice(i, 1); c.parentNode = null; }
      return c;
    },
    contains(o) {
      let cur = o;
      while (cur) { if (cur === n) return true; cur = cur.parentNode; }
      return false;
    },
    setAttribute(k, v) { n.attrs[k] = String(v); },
    getAttribute(k) {
      if (Object.prototype.hasOwnProperty.call(n.attrs, k)) return n.attrs[k];
      if (k === 'id') return n.id || null;
      if (k === 'class') return n.className || null;
      return null;
    },
    removeAttribute(k) { delete n.attrs[k]; },
    closest(sel) {
      let cur = n;
      while (cur) { if (matches(cur, sel)) return cur; cur = cur.parentNode; }
      return null;
    },
    querySelector(sel) { return n.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      if (n._sel[sel]) return n._sel[sel].slice();
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

/* یک گروهِ فیلد با ورودیِ شناسه‌دار، همان‌طور که برنامه می‌سازد */
function fieldGroup(mk, fid, label) {
  const g = mk('div', { className: 'form-group' });
  g.setAttribute('data-col-fid', fid);
  const lab = mk('label', { className: 'form-label', textContent: label || fid });
  const inp = mk('input', { id: fid });
  inp.setAttribute('data-custom-field-id', fid);
  g.appendChild(lab); g.appendChild(inp);
  g.input = inp;
  return g;
}

function makeEnv(opts) {
  opts = opts || {};
  const byId = new Map();
  const doc = {
    readyState: 'complete',
    hidden: false,
    activeElement: null,
    getElementById: (id) => {
      if (byId.has(id)) return byId.get(id);
      let found = null;
      (function walk(x) {
        if (found) return;
        (x.children || []).forEach((c) => { if (found) return; if (c.id === id) { found = c; return; } walk(c); });
      })(doc.documentElement);
      return found;
    },
    querySelector(sel) { return doc.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const out = [];
      (function walk(x) { (x.children || []).forEach((c) => { if (matches(c, sel)) out.push(c); walk(c); }); })(doc.documentElement);
      return out;
    },
    addEventListener() {},
    createElement: (tag) => node(tag),
    documentElement: node('html')
  };
  doc.body = node('body');
  doc.documentElement.appendChild(doc.body);

  const mem = new Map();
  const listeners = { window: [], document: [] };
  const timers = [];
  const toasts = [];
  const win = {
    document: doc,
    CRM_APP_VERSION: '12.22.0',
    getComputedStyle: (el) => ({
      getPropertyValue: (prop) => String((el && el._computed && el._computed[prop]) || '')
    }),
    state: opts.state || { formFieldMeta: {}, customFields: {} },
    v20Toast: (m) => toasts.push(m),
    saveState: opts.saveState || (() => {}),
    getUnifiedFieldList: opts.getUnifiedFieldList || (() => []),
    getMainGrid: opts.getMainGrid || (() => null),
    paintFieldBox: opts.paintFieldBox || (() => {}),
    paintRequiredStar: opts.paintRequiredStar || (() => {}),
    downloadCSVFile: opts.downloadCSVFile || (() => {}),
    MutationObserver: undefined,
    localStorage: {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: (k) => mem.delete(k),
      key: (i) => Array.from(mem.keys())[i],
      get length() { return mem.size; }
    },
    setTimeout: (fn) => { timers.push(fn); return timers.length; },
    setInterval: (fn) => { timers.push(fn); return timers.length; },
    clearTimeout: () => {},
    addEventListener: (t, fn, cap) => listeners.window.push({ t, fn, cap })
  };
  doc.addEventListener = (t, fn, cap) => listeners.document.push({ t, fn, cap });
  win.window = win;

  const fn = new Function('window', 'document', 'setInterval', 'setTimeout', 'clearTimeout',
    '"use strict";' + layerSrc + '\nreturn window.v1220Api;');
  const api = fn(win, doc, win.setInterval, win.setTimeout, win.clearTimeout);
  return { api, win, doc, byId, mem, listeners, timers, toasts, node: (t, o) => node(t, o), fieldGroup: (f, l) => fieldGroup(node, f, l) };
}

/* فرمِ داروخانه: سه فیلد + کادرِ لوکیشن (که «نباید» تکان بخورد) */
function pharmacyScene(opts) {
  opts = opts || {};
  const env = makeEnv(opts);
  const mk = env.node;
  const pane = mk('section', { id: 'tab-pharmacies', className: 'tab-pane' });
  const form = mk('form', { id: 'formPharmacy' });
  const grid = mk('div', { className: 'form-grid' });
  form.appendChild(grid);
  pane.appendChild(form);
  env.doc.body.appendChild(pane);

  const gA = env.fieldGroup('pharmacyName', 'نام داروخانه');
  const gB = env.fieldGroup('pharmacyPhone', 'تلفن');
  const locBox = mk('div', { id: 'phLocationBox', className: 'form-group full-width' });
  const innerLat = env.fieldGroup('pharmacyLat', 'عرض جغرافیایی');
  const innerLng = env.fieldGroup('pharmacyLng', 'طول جغرافیایی');
  locBox.appendChild(innerLat); locBox.appendChild(innerLng);
  const gC = env.fieldGroup('cf-pharmacy-1', 'فیلدِ مدیر');

  grid.appendChild(gA); grid.appendChild(gB); grid.appendChild(locBox); grid.appendChild(gC);

  const fields = opts.fields || [
    { id: 'pharmacyName', builtin: true, order: 1, kind: 'field' },
    { id: 'pharmacyPhone', builtin: true, order: 2, kind: 'field' },
    { id: 'cf-pharmacy-1', builtin: false, order: 3, kind: 'custom' }
  ];
  env.win.getUnifiedFieldList = (tab) => (tab === 'tab-pharmacies' ? fields : []);
  env.win.getMainGrid = (tab) => (tab === 'tab-pharmacies' ? grid : null);
  return Object.assign(env, { pane, form, grid, gA, gB, gC, locBox, fields });
}

const orderOf = (grid) => grid.children.map((c) => c.id || (c.getAttribute && c.getAttribute('data-col-fid')) || '?');

/* ───────── ۱) بارگذاری و نسخه ───────── */
test('v12.22.0: لایهٔ پایانی پس از باندل بارگذاری می‌شود و نسخه در همهٔ سطوح یکی است', () => {
  const iBundle = indexSrc.indexOf('crm-bundle.js?v=12.22.0');
  const iLayer = indexSrc.indexOf('crm-v12.22.0.js?v=12.22.0');
  assert.ok(iBundle > 0 && iLayer > 0, 'هر دو اسکریپت در index.html');
  assert.ok(iLayer > iBundle, 'لایهٔ ۱۲.۲۰ آخرین اسکریپت است');
  assert.equal(pkg.version, '12.22.0');
  assert.match(bundle, /نسخه‌ی جاری: 12\.22\.0/);
  assert.match(serverSrc, /const APP_VERSION = "12\.22\.0"/);
  assert.match(phpSrc, /define\("CRM_APP_VERSION", "12\.22\.0"\)/);
});

/* ───────── ۲) قفلِ لنگر ───────── */
test('v12.22.0: ترتیبِ لنگر ضبط می‌شود و کادرِ لوکیشن جزوِ فیلدهایِ جابه‌جاشدنی نیست', () => {
  const s = pharmacyScene();
  const canon = s.api.captureCanon('tab-pharmacies');
  assert.deepEqual(canon, ['c:pharmacyName', 'c:pharmacyPhone', 'id:phLocationBox', 'c:cf-pharmacy-1']);
  assert.equal(s.api.enforceTab('tab-pharmacies'), 0, 'چیدمانِ درست = هیچ جابه‌جایی');
  assert.deepEqual(orderOf(s.grid), ['pharmacyName', 'pharmacyPhone', 'phLocationBox', 'cf-pharmacy-1']);
});

test('v12.22.0: فیلدی که به پایینِ کادرِ لوکیشن پرتاب شود، به جایِ اصلی برمی‌گردد', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');

  /* همان کاری که باندل هنگامِ ویرایشِ فیلدِ سفارشی می‌کند: گروه را برمی‌دارد و
     نمونهٔ تازه را به «انتهای» گرید می‌چسباند (زیرِ کادرِ لوکیشن). */
  s.grid.removeChild(s.gB);
  const gB2 = s.fieldGroup('pharmacyPhone', 'تلفن');
  s.grid.appendChild(gB2);
  assert.deepEqual(orderOf(s.grid), ['pharmacyName', 'phLocationBox', 'cf-pharmacy-1', 'pharmacyPhone'], 'پیش از قفل: زیرِ کادرِ لوکیشن');

  const moved = s.api.enforceTab('tab-pharmacies');
  assert.ok(moved > 0, 'قفلِ لنگر جابه‌جا کرد');
  assert.deepEqual(orderOf(s.grid), ['pharmacyName', 'pharmacyPhone', 'phLocationBox', 'cf-pharmacy-1'], 'بازگشت به جایِ اصلی');
});

test('v12.22.0: ظرفِ فیلدهایِ سفارشی به انتهای گرید برود، ترتیبِ فرم نمی‌شکند', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');
  /* applyFullFormLayout با نیتِ مدیر: grid.appendChild(container) */
  const host = s.node('div', { id: 'pharmacyCustomFieldsContainer', className: 'form-group full-width form-grid extra-cf-host' });
  host.setAttribute('data-cf-host', 'pharmacy');
  s.grid.appendChild(host);
  s.api.enforceTab('tab-pharmacies');
  const names = orderOf(s.grid);
  assert.ok(names.indexOf('pharmacyName') < names.indexOf('phLocationBox'), 'فیلدها پیش از کادرِ لوکیشن می‌مانند');
  assert.equal(names[names.length - 1], 'pharmacyCustomFieldsContainer', 'ظرفِ خالی مزاحمِ ترتیبِ فیلدها نمی‌شود');
});

test('v12.22.0: تنها «شماره ترتیب در فرم» جایِ فیلد را عوض می‌کند، کادرِ لوکیشن سرِ جایش', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');

  /* مدیر شمارهٔ ترتیبِ فیلدِ سفارشی را ۱ می‌گذارد (بقیه ۵ و ۶) */
  s.fields[0].order = 5;
  s.fields[1].order = 6;
  s.fields[2].order = 1;
  const canon = s.api.rebuildCanon('tab-pharmacies', ['c:pharmacyName', 'c:pharmacyPhone', 'id:phLocationBox', 'c:cf-pharmacy-1']);
  assert.deepEqual(canon, ['c:cf-pharmacy-1', 'c:pharmacyName', 'id:phLocationBox', 'c:pharmacyPhone'],
    'فیلد به خانهٔ اول رفت و کادرِ لوکیشن در همان خانهٔ خودش ماند');

  s.api.rebuildAllCanons();          /* همان کاری که پس از ذخیرهٔ طراح می‌شود */
  s.api.enforceTab('tab-pharmacies');
  assert.deepEqual(orderOf(s.grid), ['cf-pharmacy-1', 'pharmacyName', 'phLocationBox', 'pharmacyPhone']);
});

test('v12.22.0: تنظیماتِ غیرِ ترتیب (عرض/فاصله/سطر) هیچ جابه‌جاییِ فیلد نمی‌سازند', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');
  const before = orderOf(s.grid).join('|');
  Object.assign(s.fields[2], { size: 320, height: 44, gapBeforeMm: 5, gapAfterMm: 2.5, rowNo: 4, place: 'under' });
  s.api.enforceTab('tab-pharmacies');
  s.api.paintSettings('tab-pharmacies');
  s.api.enforceTab('tab-pharmacies');
  assert.equal(orderOf(s.grid).join('|'), before, 'چیدمان بدونِ تغییر ماند');
});

/* ───────── ۳) ایتم‌هایِ طراح ───────── */
test('v12.22.0: «فاصله نسبت به فیلد قبلی/بعدی (میلی‌متر)» با تبدیلِ واقعی به پیکسل می‌نشیند', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');
  assert.equal(s.api.mmToPx(5), 18.9, '۵ میلی‌متر = ۱۸٫۹ پیکسل');
  assert.equal(s.api.mmToPx(25.4), 96, '۱ اینچ = ۹۶ پیکسل');
  assert.equal(s.api.mmToPx(0), 0);

  Object.assign(s.fields[2], { gapBeforeMm: 5, gapAfterMm: 2.5 });
  s.api.paintSettings('tab-pharmacies');

  const st = s.gC.style;
  assert.equal(st.getPropertyValue('margin-inline-start'), '18.9px');
  assert.equal(st.getPropertyValue('margin-inline-end'), '9.45px');
  assert.equal(st.getPropertyValue('margin-right'), '18.9px', 'RTL: فاصلهٔ پیش = راست');
  assert.equal(st.getPropertyValue('margin-left'), '9.45px', 'RTL: فاصلهٔ پس = چپ');
  assert.equal(st.getPriority('margin-inline-start'), 'important', 'رویِ سبک‌هایِ برنامه می‌نشیند');
  assert.equal(s.gC.getAttribute('data-crm-gap'), '5/2.5mm');
});

test('v12.22.0: عرض، ارتفاع، شمارهٔ سطر و «زیرِ هم» روی همان فیلد اعمال می‌شوند', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');
  Object.assign(s.fields[2], { size: 320, height: 44, rowNo: 4, place: 'under' });
  s.api.paintSettings('tab-pharmacies');

  const inp = s.gC.input;
  assert.equal(inp.style.getPropertyValue('width'), '320px');
  assert.equal(inp.style.getPropertyValue('max-width'), '320px');
  assert.equal(inp.style.getPropertyValue('height'), '44px');
  assert.equal(inp.style.getPropertyValue('min-height'), '44px');
  assert.equal(s.gC.style.getPropertyValue('max-width'), '320px');
  assert.equal(s.gC.style.getPropertyValue('grid-row'), '4', 'هم‌شماره‌ها در یک سطر');
  assert.equal(s.gC.style.getPropertyValue('grid-column'), '1 / -1', '«زیرِ هم» = تمامِ سطر');
});

test('v12.22.0: «نمایش در فرم»، «وابسته به فیلد» و «افزودن لحظه‌ای گزینه»', () => {
  const s = pharmacyScene();
  s.api.captureCanon('tab-pharmacies');
  const btn = s.node('button', { className: 'btn-instant-add' });
  s.gC.appendChild(btn);

  s.fields[2].allowAddOption = false;
  s.fields[1].showInForm = false;
  s.api.paintSettings('tab-pharmacies');
  assert.equal(s.gB.style.getPropertyValue('display'), 'none', 'فیلدِ بی‌تیکِ نمایش پنهان است');
  assert.equal(btn.style.getPropertyValue('display'), 'none', 'دکمهٔ افزودنِ لحظه‌ای برداشته شد');
  assert.equal(s.api.allowAddOptionFor('cf-pharmacy-1'), false);

  s.fields[1].showInForm = true;
  s.fields[2].allowAddOption = true;
  s.api.paintSettings('tab-pharmacies');
  assert.equal(btn.style.getPropertyValue('display'), '', 'با تیکِ دوباره، دکمه برمی‌گردد');
  assert.equal(s.api.allowAddOptionFor('cf-pharmacy-1'), true);

  /* وابسته به فیلد: تا مرجع خالی است، فیلد پنهان است */
  s.fields[2].dependsOn = 'pharmacyName';
  s.api.paintSettings('tab-pharmacies');
  assert.equal(s.gC.style.getPropertyValue('display'), 'none', 'مرجع خالی = پنهان');
  s.gA.input.value = 'داروخانهٔ نمونه';
  s.api.paintSettings('tab-pharmacies');
  assert.equal(s.gC.style.getPropertyValue('display'), '', 'مرجع پر = نمایان');
});

test('v12.22.0: «داخل کدام کادر؟» ذخیره می‌شود (پیش از این مقدارِ کشو دور ریخته می‌شد)', () => {
  assert.match(layerSrc, /colFieldBoxTarget/, 'کشویِ «داخل کدام کادر» خوانده می‌شود');
  assert.match(layerSrc, /boxId/, 'مقدار در تنظیماتِ فیلد ذخیره می‌شود');
});

/* ───────── ۴) هدرِ فشرده و ساعتِ بی‌پرش ───────── */
test('v12.22.0: هدرِ تک‌ردیفه، ساعت نخستین عضو، یک برچسبِ نسخه، دکمه‌هایِ پشتیبان', () => {
  const env = makeEnv({});
  const mk = env.node;
  const header = mk('header', { className: 'app-header' });
  const actions = mk('div', { className: 'header-actions' });
  header.appendChild(actions);
  env.doc.body.appendChild(header);
  const logoText = mk('div', { className: 'logo-text' });
  const badge = mk('div', { id: 'crmBuildBadge', textContent: 'نسخه 12.22.0' });
  logoText.appendChild(badge);
  env.doc.body.appendChild(logoText);
  env.byId.set('crmBuildBadge', badge);
  const dup = mk('span', { id: 'v20VersionBadge', textContent: 'نسخه 12.22.0' });
  actions.appendChild(dup);
  env.byId.set('v20VersionBadge', dup);
  const pill = mk('div', { className: 'header-user-pill' });
  actions.appendChild(pill);

  env.api.buildTopBar();

  assert.ok(header.classList.contains('crm-compact-header'), 'کادرِ کوچک‌تر');
  const clock = env.doc.getElementById('crmHeaderClock');
  assert.ok(clock, 'کادرِ ساعت ساخته شد');
  assert.equal(actions.children[0], clock, 'ساعت در بالاترین ردیف، نخستین عضو');
  assert.match(clock.innerHTML, /crm-clock-time/);
  assert.match(clock.innerHTML, /crm-clock-sep/);
  assert.match(clock.innerHTML, /crm-clock-date/);
  assert.equal(badge.parentNode, actions, 'برچسبِ نسخه در همان ردیف');
  assert.equal(dup.style.getPropertyValue('display'), 'none', 'نسخهٔ تکراری پنهان شد');
  assert.ok(env.doc.getElementById('crmVaultSaveBtn'), 'دکمهٔ 🛡 پشتیبان');
  assert.ok(env.doc.getElementById('crmVaultLoadBtn'), 'دکمهٔ ↩ بازیابی');
});

test('v12.22.0: ساعت عرضِ ثابت دارد و ثانیه‌شمار فقط هنگامِ تغییرِ متن می‌نویسد', () => {
  assert.match(cssSrc, /\.crm-clock-time \{[^}]*width: 64px/s, 'عرضِ ثابتِ ساعت');
  assert.match(cssSrc, /font-variant-numeric: tabular-nums/, 'رقمِ جدولی = بدونِ لرزشِ عرض');
  assert.match(cssSrc, /#v20VersionBadge \{ display: none !important; \}/, 'نسخهٔ تکراری در سبک هم بسته است');

  const env = makeEnv({});
  const mk = env.node;
  const t = mk('span', { id: 'crmClockTime' });
  const d = mk('span', { id: 'crmClockDate' });
  env.byId.set('crmClockTime', t); env.byId.set('crmClockDate', d);
  env.api.tickClock();
  const time = t.textContent;
  assert.match(time, /^\d{2}:\d{2}:\d{2}$/, 'ساعت با ثانیه');
  assert.notEqual(d.textContent, '—', 'تاریخِ روز پر شد');
  /* نوشتنِ دوبارهٔ همان متن = هیچ (ناظرهایِ چیدمان بیدار نمی‌شوند) */
  let writes = 0;
  const raw = Object.getOwnPropertyDescriptor(t, 'textContent');
  Object.defineProperty(t, 'textContent', {
    get: () => raw.get ? raw.get.call(t) : t._tc || '',
    set: (v) => { writes += 1; t._tc = v; },
    configurable: true
  });
  t.textContent = time;
  writes = 0;
  env.api.tickClock();
  assert.equal(writes, 0, 'متنِ یکسان بازنویسی نشد');
});

/* ───────── ۵) گاوصندوقِ تنظیمات ───────── */
test('v12.22.0: فیلدهایِ گم‌شده از پشتیبان برمی‌گردند، فیلدِ حذف‌شدهٔ عمدی نه', () => {
  const state = {
    customFields: {
      pharmacy: [{ id: 'cf-pharmacy-1', label: 'فیلدِ یک', order: 1, gapBeforeMm: 3 }]
    },
    formFieldMeta: { pharmacy: { pharmacyName: { label: 'نام داروخانه' } } }
  };
  const env = makeEnv({ state });
  /* پشتیبانِ کامل‌تر: دو فیلد + تنظیمِ فاصلهٔ میلی‌متری + کادر */
  const snap = env.api.vaultSnapshot();
  snap.customFields.pharmacy.push({ id: 'cf-pharmacy-2', label: 'فیلدِ دو', order: 2 });
  snap.customFields.pharmacy.push({ id: 'cf-pharmacy-9', label: 'فیلدِ حذف‌شده', order: 9 });
  snap.formFieldMeta.pharmacy.pharmacyName.gapBeforeMm = 4;
  snap.formFieldMeta.pharmacy.pharmacyPhone = { size: 260 };
  snap.tomb = { pharmacy: { 'cf-pharmacy-9': Date.now() } };
  env.mem.set('CRM_SETTINGS_VAULT_V1', JSON.stringify(snap));

  const added = env.api.restoreVault();
  assert.ok(added >= 2, 'دستِ‌کم دو قلم برگشت');
  const ids = state.customFields.pharmacy.map((f) => f.id);
  assert.ok(ids.includes('cf-pharmacy-2'), 'فیلدِ گم‌شده برگشت');
  assert.ok(!ids.includes('cf-pharmacy-9'), 'فیلدِ عمداً حذف‌شده برنگشت');
  assert.equal(state.formFieldMeta.pharmacy.pharmacyName.gapBeforeMm, 4, 'تنظیمِ میلی‌متری برگشت');
  assert.equal(state.formFieldMeta.pharmacy.pharmacyPhone.size, 260, 'تنظیمِ فیلدِ ثابت برگشت');
  assert.equal(state.customFields.pharmacy[0].gapBeforeMm, 3, 'تنظیمِ زندهٔ موجود بازنویسی نشد');
});

test('v12.22.0: حذفِ عمدیِ فیلد، سنگ‌قبر می‌گیرد تا پشتیبان زنده‌اش نکند', () => {
  const state = {
    customFields: { pharmacy: [{ id: 'cf-a', label: 'الف', order: 1 }, { id: 'cf-b', label: 'ب', order: 2 }] },
    formFieldMeta: {}
  };
  const env = makeEnv({ state });
  const first = env.api.saveVault();
  assert.equal(first.customFields.pharmacy.length, 2);

  /* مدیر فیلدِ «ب» را حذف می‌کند */
  state.customFields.pharmacy = [{ id: 'cf-a', label: 'الف', order: 1 }];
  const second = env.api.saveVault();
  assert.ok(second.tomb.pharmacy['cf-b'], 'سنگ‌قبرِ فیلدِ حذف‌شده');

  /* حالا فیلدها «گم» شوند (نصبِ نسخهٔ تازه) */
  state.customFields.pharmacy = [];
  env.api.restoreVault();
  assert.deepEqual(state.customFields.pharmacy.map((f) => f.id), ['cf-a'], 'فقط فیلدِ «الف» برگشت');
});

test('v12.22.0: ریشه‌پاک‌کنِ نسخهٔ تازه، گاوصندوق و ترتیبِ مدیر را جارو نمی‌کند', () => {
  const keep = bundle.match(/var KEEP_LS = \/\^?\(?([^\n]*?)\/i;/);
  assert.ok(keep, 'KEEP_LS پیدا شد');
  ['CRM_V12200_', 'CRM_SETTINGS_VAULT', 'CRM_MANAGER_GRID_ORDER', 'CRM_APP_STATE_V2'].forEach((k) => {
    assert.ok(keep[1].includes(k), k + ' در فهرستِ نگه‌داشتنی‌ها');
  });
  assert.ok(!/crmSettingsVault/.test(bundle.match(/deleteDatabase\("[^"]+"\)/g).join(',')), 'پایگاهِ گاوصندوق حذف نمی‌شود');
});

test('v12.22.0: گاوصندوق روی سرورِ Node و هاستِ PHP هم ذخیره می‌شود', () => {
  assert.match(serverSrc, /pathname === "\/api\/vault" && req\.method === "GET"/, 'GET /api/vault');
  assert.match(serverSrc, /pathname === "\/api\/vault" && req\.method === "POST"/, 'POST /api/vault');
  assert.match(serverSrc, /settings-vault\.json/, 'فایلِ جدا از داده‌ها');
  assert.match(phpSrc, /if \(\$p === "vault"\)/, 'مسیرِ vault در api.php');
  assert.match(phpSrc, /crm-settings-vault\.json/, 'فایلِ گاوصندوق روی نت‌افراز');
  /* purge دیگر دادهٔ زندهٔ کاربر را پاک نمی‌کند */
  assert.match(serverSrc, /crm-live-\(data\|bulk\)\\.json/, 'سپرِ فایلِ زنده');
  assert.match(serverSrc, /if \(hasRealData\) continue;/, 'فایلِ دارایِ داده جارو نمی‌شود');
});

/* ───────── ۶) خروجیِ اکسلِ کاملِ تب ───────── */
test('v12.22.0: خروجیِ اکسل همهٔ اطلاعاتِ تب را می‌دهد (ستونِ فیلدِ دارایِ مقدار هیچ‌وقت نمی‌افتد)', () => {
  const state = {
    customFields: { pharmacy: [{ id: 'cf-pharmacy-1', label: 'کد ملی', order: 1 }, { id: 'cf-pharmacy-2', label: 'ستاره', order: 2, exportExcel: true }] },
    pharmacies: [
      { name: 'داروخانهٔ الف', phone: '021', customFields: { 'کد ملی': '1234567890' }, extraKey: 'مقدار' },
      { name: 'داروخانهٔ ب', phone: '022' }
    ],
    formFieldMeta: {}
  };
  const env = makeEnv({ state });
  env.win.getUnifiedFieldList = () => [];
  const out = env.api.buildFullExport('pharmacy');

  assert.equal(out.count, 2);
  assert.ok(out.headers.includes('نام داروخانه'), 'ستون‌های ثابت');
  assert.ok(out.headers.includes('کد ملی'), 'فیلدِ سفارشیِ دارایِ مقدار');
  assert.ok(out.headers.includes('ستاره'), 'فیلدِ سفارشی با تیکِ خروجیِ اکسل');
  assert.ok(out.headers.includes('extraKey'), 'کلیدِ اضافیِ رکورد هم می‌آید');
  assert.equal(new Set(out.headers).size, out.headers.length, 'ستونِ تکراری ندارد');
  const row = out.rows[0];
  assert.equal(row.length, out.headers.length);
  assert.equal(row[out.headers.indexOf('کد ملی')], '1234567890');
  assert.equal(out.file, 'pharmacies-full-export.csv');
});

test('v12.22.0: همگام‌سازیِ خودکار هر ۱۰ ثانیه دست‌نخورده باقی است', () => {
  assert.match(bundle, /setInterval\(tick, 10000\)/);
  assert.match(bundle, /خودکار هر ۱۰ ثانیه/);
});

/* ════════════════ نوبت ۱۴۶ ════════════════ */

test('v12.22.0: تاریخِ شمسی بدونِ ویرگول و بدونِ پرش ساخته می‌شود', () => {
  const env = makeEnv();
  env.win.getUnifiedFieldList = () => [];
  const api = env.api;
  const a = api.clockDate(new Date(Date.UTC(2026, 8, 8, 6, 30, 0)));
  assert.ok(a && a.length > 5, 'تاریخ ساخته شد: ' + a);
  assert.ok(!/[,،٬]/.test(a), 'هیچ ویرگولی در تاریخ نیست: ' + a);
  assert.ok(!/[0-9]{1,3},[0-9]{3}/.test(a), 'جداکنندهٔ هزارگانِ لاتین («1,405») نیست: ' + a);
  assert.match(a, /^(شنبه|یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنجشنبه|جمعه) /);
  assert.match(a, /(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  assert.ok(/1405/.test(a), 'سالِ ۱۴۰۵ بی‌ویرگول: ' + a);

  /* پرش: ثانیهٔ بعد نباید رشتهٔ تاریخ را عوض کند */
  const b = api.clockDate(new Date(Date.UTC(2026, 8, 8, 6, 30, 1)));
  assert.equal(a, b, 'با گذشتِ یک ثانیه تاریخ عوض نمی‌شود');
  /* و عرضِ نوشته ثابت است (پس هدر تکان نمی‌خورد) */
  assert.equal(a.length, b.length);
});

test('v12.22.0: ساعتِ هدر فقط در صورتِ تغییر بازنویسی می‌شود', () => {
  const src = layerSrc;
  assert.match(src, /function clockDate\(/, 'تابعِ دست‌سازِ تاریخ وجود دارد');
  assert.ok(src.indexOf('toLocaleDateString') === src.lastIndexOf('toLocaleDateString'),
    'تاریخ با toLocaleDateString ساخته نمی‌شود (ریشهٔ ویرگول)');
  assert.match(src, /fa-IR-u-ca-persian-nu-latn/);
  assert.match(cssSrc, /\.crm-header-clock \{[\s\S]*?width: 268px/, 'پهنایِ ثابتِ کادرِ ساعت در CSS');
  assert.doesNotMatch(cssSrc, /#headerBrandLine\s*\{\s*display:\s*none/, '«طنین طب طاها» پنهان نشده');
  assert.match(cssSrc, /#headerBrandLine \{[\s\S]*?display: block/, '«طنین طب طاها» نمایش داده می‌شود');
});

test('v12.22.0: قفلِ order+DOM — CSS `order` هم با ترتیبِ لنگر بازنویسی می‌شود', () => {
  const sc = pharmacyScene();
  sc.api.rebuildAllCanons();
  sc.api.enforceTab('tab-pharmacies');
  const kids = sc.grid.children;
  assert.ok(kids.length >= 4);
  kids.forEach((k, i) => {
    assert.equal(k.style.getPropertyValue('order'), String(i + 1),
      'orderِ گرهٔ ' + i + ' برابرِ ترتیبِ DOM است');
    assert.equal(k.style.getPriority('order'), 'important', 'با اولویتِ important');
  });
  /* سناریویِ شکایت: باندل orderِ کهنه گذاشته باشد → قفلِ ما ظاهر را برمی‌گرداند */
  kids[0].style.setProperty('order', '9999', 'important');
  sc.api.enforceTab('tab-pharmacies');
  assert.equal(kids[0].style.getPropertyValue('order'), '1');
});

test('v12.22.0: کلیدِ چیدمانِ خودِ باندل با همان ترتیب پر می‌شود تا نجنگد', () => {
  const sc = pharmacyScene();
  sc.api.rebuildAllCanons();
  sc.api.enforceTab('tab-pharmacies');
  const raw = JSON.parse(sc.mem.get('CRM_MANAGER_GRID_ORDER_V2') || '{}');
  const key = 'form:formPharmacy';
  assert.ok(raw[key], 'کلیدِ form:formPharmacy نوشته شد');
  assert.deepEqual(raw[key], ['pharmacyName', 'pharmacyPhone', 'pharmacyLat', 'cf-pharmacy-1'].filter((a) => raw[key].includes(a)));
  /* لنگرها همان‌هایی هستند که باندل می‌شناسد (idِ نخستین ورودی) */
  raw[key].forEach((a) => assert.match(a, /^[A-Za-z0-9_-]+$/, 'لنگرِ معتبر: ' + a));
  /* ترتیبِ ذخیره‌شده با ترتیبِ واقعیِ DOM یکی است */
  const domSeq = sc.grid.children.map((g) => {
    const e = g.querySelector ? g.querySelector('input[id]') : null;
    return e ? e.id : '';
  }).filter(Boolean);
  assert.deepEqual(raw[key], domSeq.slice(0, raw[key].length));
});

test('v12.22.0: سرستون‌هایِ اکسل فارسی‌اند (dateAdded/fileName/managerPhone/repId)', () => {
  const env = makeEnv();
  env.win.getUnifiedFieldList = () => [];
  const api = env.api;
  assert.equal(api.faHeader('dateAdded'), 'تاریخ افزودن');
  assert.equal(api.faHeader('createdAt'), 'تاریخ ثبت', 'دو ستونِ تاریخ، دو برچسبِ فارسیِ جدا');
  assert.equal(api.faHeader('fileName'), 'نام فایل');
  assert.equal(api.faHeader('managerPhone'), 'تلفن مدیر');
  assert.equal(api.faHeader('repId'), 'شناسهٔ نماینده');
  assert.equal(api.faHeader('orderManagerPhone'), 'تلفن مدیر سفارش', 'ترکیبِ تکه‌ها');
  assert.equal(api.faHeader('name'), 'نام');

  env.win.state = {
    pharmacies: [{ name: 'داروخانهٔ نمونه', phone: '021', dateAdded: '1405/06/17', fileName: 'a.jpg', managerPhone: '0912', repId: 'R-7', creditLevel: 'A', contractType: 'سالیانه' }],
    customFields: { pharmacies: [] }, formFieldMeta: {}
  };
  const out = api.buildFullExport('pharmacy');
  const latin = out.headers.filter((h) => /[A-Za-z]/.test(String(h)));
  assert.deepEqual(latin, [], 'هیچ سرستونِ لاتینی در خروجی نیست: ' + JSON.stringify(out.headers));
  ['تاریخ ثبت', 'نام فایل', 'تلفن مدیر', 'شناسهٔ نماینده', 'درجهٔ اعتبار', 'نوع قرارداد']
    .forEach((h) => assert.ok(out.headers.includes(h), 'ستونِ ' + h + ' هست'));
  assert.ok(!out.headers.some((h) => /همانه/.test(h)), 'غلطِ «همانه» اصلاح شد');
});

test('v12.22.0: طراح عددهایِ «واقعیِ» همان فیلد را نشان می‌دهد، نه ۲۲۰ برایِ همه', () => {
  const sc = pharmacyScene();
  const inputs = {};
  ['colFieldSize', 'colFieldHeight', 'colGapBefore', 'colGapAfter', 'colRowNo', 'colFieldOrder', 'colFieldListOrder']
    .forEach((id) => { const n = sc.node('input', { id }); sc.doc.body.appendChild(n); inputs[id] = n; });

  /* اندازه‌هایِ واقعیِ رویِ صفحه برایِ دو فیلدِ متفاوت */
  sc.gA.input._rect = { w: 317, h: 44 };
  sc.gA._computed = { 'margin-inline-start': '0px', 'margin-inline-end': '24px', 'grid-row-start': '2' };
  sc.gB.input._rect = { w: 190, h: 38 };
  sc.gB._computed = { 'margin-inline-start': '12px', 'margin-inline-end': '0px', 'grid-row-start': '3' };

  sc.win._activeColTab = 'tab-pharmacies';
  sc.win._editingColField = { id: 'pharmacyName', label: 'نام داروخانه' };
  sc.api.rebuildAllCanons();
  assert.ok(sc.api.applyRealDesignerValues() > 0, 'مقادیر نوشته شد');
  assert.equal(inputs.colFieldSize.value, '317', 'عرضِ واقعیِ همین فیلد');
  assert.equal(inputs.colFieldHeight.value, '44', 'ارتفاعِ واقعی');
  assert.equal(inputs.colGapBefore.value, '0', 'فاصلهٔ قبل');
  assert.equal(inputs.colGapAfter.value, String(Math.round(24 * 25.4 / 96 * 10) / 10), 'فاصلهٔ بعد به میلی‌متر');
  assert.equal(inputs.colRowNo.value, '2', 'سطرِ واقعی');

  /* فیلدِ دوم → عددهایِ خودش، نه تکرارِ قبلی */
  sc.win._editingColField = { id: 'pharmacyPhone', label: 'تلفن' };
  sc.api.applyRealDesignerValues();
  assert.equal(inputs.colFieldSize.value, '190', 'برایِ فیلدِ دیگر عددِ دیگر است (نه ۲۲۰ برایِ همه)');
  assert.equal(inputs.colFieldHeight.value, '38');
  assert.equal(inputs.colRowNo.value, '3');
});

test('v12.22.0: منویِ همبرگری با ✕ بسته می‌شود و کشو بالایِ هدر است', () => {
  const env = makeEnv();
  env.win.getUnifiedFieldList = () => [];
  const drawer = env.node('div', { id: 'sideMenuDrawer', className: 'side-menu-drawer active' });
  drawer.classList.add('active');
  const overlay = env.node('div', { id: 'sideMenuOverlay', className: 'side-menu-overlay active' });
  overlay.classList.add('active');
  env.doc.body.appendChild(drawer); env.doc.body.appendChild(overlay);
  env.doc.body.classList = { remove(c) { drawer._removed = c; } };
  env.api.forceCloseSideMenu();
  assert.ok(!drawer.classList.contains('active'), 'کشو بسته شد');
  assert.ok(!overlay.classList.contains('active'), 'پرده بسته شد');
  /* ریشهٔ کلیک‌نشدنِ ✕: کشو باید بالایِ هدرِ ۴۶۰۰ باشد */
  assert.match(cssSrc, /\.side-menu-drawer \{ z-index: 4800 !important; \}/);
  assert.match(cssSrc, /\.side-menu-overlay \{ z-index: 4790 !important; \}/);
  const drawerZ = Number((cssSrc.match(/\.side-menu-drawer \{ z-index: (\d+)/) || [])[1]);
  assert.ok(drawerZ > 4600, 'کشو (' + drawerZ + ') بالایِ هدر (۴۶۰۰) است');
});

test('v12.22.0: «ارسال به رندر» از shim رد می‌شود و گزارشِ واقعیِ HTTP می‌دهد', () => {
  assert.match(layerSrc, /XMLHttpRequest/, 'درخواستِ خام، بیرون از shimِ crm-hub');
  assert.match(layerSrc, /syncToRenderSmart/, 'تابعِ هوشمندِ سینک');
  assert.match(layerSrc, /api\.php پاسخِ /, 'پیامِ خطایِ صادقانه با کدِ HTTP');
  assert.match(layerSrc, /#btnV96SyncRender/, 'رویِ همان دکمهٔ «ارسال به رندر» می‌نشیند');
  assert.match(layerSrc, /javad-test1\.onrender\.com/, 'ارسالِ مستقیم به رندر به‌عنوانِ راهِ دوم');
  /* پیامِ «sync-local-only» دیگر تنها پاسخِ ممکن نیست */
  assert.match(serverSrc, /\/api\/sync/, 'مسیرِ /api/sync رویِ سرورِ node وجود دارد');
});

test('v12.22.0: نسخه در همهٔ سطوح ۱۲.۲۱ است و لایه پس از باندل می‌آید', () => {
  assert.equal(pkg.version, '12.22.0');
  assert.match(indexSrc, /<script src="crm-v12\.22\.0\.js\?v=12\.22\.0"><\/script>/);
  const layerAt = indexSrc.indexOf('crm-v12.22.0.js');
  const bundleAt = indexSrc.indexOf('crm-bundle.js');
  assert.ok(bundleAt > 0 && layerAt > bundleAt, 'لایه پس از باندل');
  assert.match(bundle, /<li><b>12\.22\.0<\/b>/, 'بندِ تغییراتِ ۱۲.۲۱ در باندل');
  assert.match(layerSrc, /window\.v1221Api = window\.v1220Api/, 'نامِ APIِ تازه هم در دسترس است');
  assert.match(layerSrc, /CRM_V12200_ANCHORS/, 'کلیدِ حافظهٔ لنگرها عوض نشده تا داده نپرد');
});

/* ════════════════ نوبت ۱۴۷ (12.22.0) ════════════════ */

test('v12.22.0: هم‌فرکانس‌سازیِ متا — موتورِ باندل همان orderِ ما را حساب می‌کند (پایانِ پرش)', () => {
  let saves = 0;
  const sc = pharmacyScene({ saveState: () => { saves++; } });
  sc.api.rebuildAllCanons();
  sc.api.enforceTab('tab-pharmacies');

  const meta = sc.win.state.formFieldMeta.pharmacy || {};
  /* شمارهٔ خانهٔ نهاییِ هر گره در خودِ متا نوشته شد */
  assert.equal(meta.pharmacyName && meta.pharmacyName.order, 1);
  assert.equal(meta.pharmacyPhone && meta.pharmacyPhone.order, 2);
  assert.equal(meta.pharmacyLat && meta.pharmacyLat.order, 3, 'کادرِ لوکیشن هم شماره گرفت تا باندل جابه‌جایش نکند');
  assert.equal(meta['cf-pharmacy-1'] && meta['cf-pharmacy-1'].order, 4);
  assert.ok(saves >= 1, 'تغییرِ متا ذخیره شد (saveState)');

  /* شبیه‌سازیِ دقیقِ الگوریتمِ applySavedLayoutِ باندل */
  const kids = sc.grid.children.filter((g) => g.classList.contains('form-group'));
  const items = kids.map((g, i0) => {
    const fid = sc.api.groupFidOf(g);
    const m = meta[fid] || {};
    const ord = Number(m.order);
    return { g, order: (isFinite(ord) && ord >= 1) ? ord : 9999, i0 };
  });
  items.sort((a, b) => a.order - b.order);
  items.forEach((it, i) => {
    const vis = it.order < 9999 ? it.order : i + 1;
    assert.equal(it.g.style.getPropertyValue('order'), String(vis),
      'خروجیِ موتورِ باندل با خروجیِ لایه یکی است (گرهٔ ' + it.i0 + ')');
  });

  /* گذرِ دوم: هیچ تغییری (ثبات، بدونِ نوشتنِ مجدد) */
  const before = saves;
  const changed = sc.api.harmonizeMetaOrders('tab-pharmacies');
  assert.equal(changed, 0, 'گذرِ دوم چیزی عوض نمی‌کند → جنگِ موتورها تمام');
  assert.equal(saves, before);
});

test('v12.22.0: کادرِ ساعت/تاریخ بلندتر است و نشان‌های هدر میخکوب', () => {
  assert.match(cssSrc, /\.crm-header-clock \{[\s\S]*?width: 302px;[\s\S]*?padding: 0\.42rem 0\.85rem;/, 'کادرِ ساعت بلندتر با پدینگ');
  assert.match(cssSrc, /\.crm-header-clock \.crm-clock-time \{[\s\S]*?font-size: 1\.02rem;/, 'قلمِ ساعت بزرگ‌تر');
  assert.match(cssSrc, /\.crm-header-clock \.crm-clock-date \{[\s\S]*?font-size: 0\.8rem;/, 'قلمِ تاریخ بزرگ‌تر');
  assert.match(cssSrc, /#globalOnlineStatusBadge \{[\s\S]*?flex: 0 0 92px;/, 'نشانِ آنلاین میخکوب');
  assert.match(cssSrc, /#btnNotificationBellHeader \{[\s\S]*?flex: 0 0 36px;/, 'زنگوله میخکوب');
  /* پهنای بیرونی همچنان ثابت = بدون پرش */
  assert.match(cssSrc, /\.crm-header-clock \{[\s\S]*?max-width: 302px;/);
});

test('v12.22.0: همهٔ لوگوها و آیکون‌ها با نشانِ تازهٔ طنین طب طاها یکی شدند', () => {
  const logo = readFileSync(new URL('public/logo.png', root));
  assert.ok(logo.length > 50000, 'لوگوی تازه موجود است (' + logo.length + ' بایت)');
  ['favicon.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
   'logo-full.png', 'logo-mark.png', 'logo-mark.jpg', 'logo-original.jpg', 'tanin.jpg',
   'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-192.png', 'icons/maskable-512.png']
    .forEach((f) => {
      const b = readFileSync(new URL('public/' + f, root));
      assert.equal(b.length, logo.length, 'هم‌ارز با لوگوی تازه: ' + f);
      assert.ok(b.equals(logo), 'بایت‌به‌بایت همان نشان: ' + f);
    });
  assert.match(indexSrc, /<img src="logo\.png" alt="TENIN TEB TAHA" \/>/, 'هدر از logo.png استفاده می‌کند');
  assert.match(indexSrc, /rel="icon"[^>]*favicon\.png/, 'فاویکون وصل است');
  assert.match(indexSrc, /rel="manifest" href="manifest\.json"/, 'manifest وصل است');
  const mani = JSON.parse(readFileSync(new URL('public/manifest.json', root), 'utf8'));
  assert.ok(mani.icons.length >= 4, 'آیکون‌های manifest سرِ جایشان‌اند');
});
