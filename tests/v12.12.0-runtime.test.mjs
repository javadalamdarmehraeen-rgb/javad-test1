/**
 * اجرای واقعی لایه v12.16.0 در یک DOM最小 — قانون ۹۲:
 * «هیچ بندی بدون مدرک تأییدشده نیست». این فایل لایهٔ جدید را واقعاً اجرا می‌کند و
 * خروجیِ DOM، تایم‌اوتِ درخواست‌های بین‌دامنه‌ای و فهرستِ سه دامنه را بررسی می‌کند.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const BUNDLE = new URL('../public/crm-bundle.js', import.meta.url);
const src = readFileSync(BUNDLE, 'utf8');
const MARK = '/* v12.12.0:';
const END = '/* v12.13.0:';
const startIdx = src.indexOf(MARK);
const endIdx = src.indexOf(END);
const layer = src.slice(startIdx, endIdx > startIdx ? endIdx : undefined);
assert.ok(layer.length > 1000, 'لایه v12.12.0 در crm-bundle.js پیدا نشد');
assert.ok(layer.indexOf('window.v1212NoVpn') >= 0, 'نشانگر لایه ۱۲.۱۲ در برش نیست');

function makeDom(origin = 'https://ndcohub.com') {
  const u = new URL(origin);
  const els = {
    headerCompanyNameDisplay: { id: 'headerCompanyNameDisplay', textContent: '' },
    crmBuildBadge: { id: 'crmBuildBadge', textContent: 'نسخه قدیمی' },
    headerBrandLine: { id: 'headerBrandLine', textContent: '' },
    crmBuildHint: { id: 'crmBuildHint', textContent: '' },
    globalOnlineStatusBadge: { id: 'globalOnlineStatusBadge', textContent: '' }
  };
  const logoText = { className: 'logo-text' };
  const timers = [];
  const intervals = [];
  const calls = { cross: [], local: [] };
  const doc = {
    getElementById: (id) => els[id] || null,
    querySelector: (sel) => (sel === '.logo-text' ? logoText : null),
    addEventListener: () => {},
    hidden: false
  };
  const win = {
    CRM_APP_VERSION: '12.16.0',
    addEventListener: () => {},
    state: { pharmacies: [{ id: 'p1' }], doctors: [], orders: [], users: [], settings: { companyName: '' } }
  };
  const nav = { onLine: true };
  const loc = {
    origin: u.origin,
    href: u.href,
    protocol: u.protocol,
    hostname: u.hostname,
    host: u.host
  };
  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
  let observerOptions = null;
  function MutationObserver(cb) {
    this.observe = (node, opts) => { observerOptions = { node, opts }; };
  }
  function origFetch(url, opts) {
    calls.local.push({ url, opts });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ status: 'empty' }) });
  }
  function crossFetch(url, opts) {
    calls.cross.push({ url, opts });
    if (win.__hang === true) {
      /* هرگز پاسخ نمی‌دهد — دقیقاً شبیه سروری که بدون VPN در دسترس نیست */
      return new Promise((resolve, reject) => {
        if (opts && opts.signal) opts.signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    }
    return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 5));
  }
  const sandboxFetch = function (url, opts) {
    const str = String(url);
    let cross = false;
    try { cross = str.indexOf('http') === 0 && new URL(str).origin !== loc.origin; } catch (e) { cross = false; }
    return cross ? crossFetch(url, opts) : origFetch(url, opts);
  };
  const live = [];
  const setTimeoutFn = (fn, ms) => { const id = setTimeout(fn, ms); live.push({ id, kind: 'timeout' }); timers.push({ fn, ms }); return id; };
  const setIntervalFn = (fn, ms) => { const id = setInterval(fn, ms); live.push({ id, kind: 'interval' }); intervals.push({ fn, ms }); return id; };
  const clearTimeoutFn = (id) => clearTimeout(id);
  const runner = new Function(
    'window', 'document', 'location', 'navigator', 'localStorage',
    'setTimeout', 'setInterval', 'clearTimeout', 'MutationObserver', 'fetch',
    '"use strict";' + layer
  );
  win.fetch = sandboxFetch; /* مرورگر واقعی: fetch روی window است */
  runner(win, doc, loc, nav, localStorage, setTimeoutFn, setIntervalFn, clearTimeoutFn, MutationObserver, sandboxFetch);
  const cleanup = () => { live.forEach((t) => (t.kind === 'timeout' ? clearTimeout(t.id) : clearInterval(t.id))); };
  return { els, timers, intervals, calls, win, observerOptions, loc, nav, sandboxFetch, cleanup };
}

test('v12.16.0 runtime: header paints exactly the three requested lines', (t) => {
  const env = makeDom();
  t.after(() => env.cleanup());
  const els = env.els;
  assert.equal(els.headerCompanyNameDisplay.textContent, 'برنامه ویزیت و گزارشات (مهر آیین نیک دارو)');
  assert.equal(els.crmBuildBadge.textContent, 'نسخه 12.16.0');
  assert.equal(els.headerBrandLine.textContent, 'طنین طب طاها  TANIN TEB TAHA');
  /* ارقام لاتین — نه فارسی */
  assert.match(els.crmBuildBadge.textContent, /[0-9]/);
  assert.doesNotMatch(els.crmBuildBadge.textContent, /[۰-۹]/);
  assert.match(els.crmBuildHint.textContent, /نسخه 12\.16\.0/);
});

test('v12.16.0 runtime: header is protected by a MutationObserver (legacy painters cannot overwrite it)', (t) => {
  const env = makeDom();
  t.after(() => env.cleanup());
  const { observerOptions, els } = env;
  assert.ok(observerOptions, 'MutationObserver روی بلوک سربرگ نصب نشده');
  assert.ok(observerOptions.opts.childList && observerOptions.opts.subtree && observerOptions.opts.characterData);
});

test('v12.16.0 runtime: peer list is the three domains minus self', () => {
  for (const origin of ['https://ndcohub.com', 'https://mehraeinpharma.ir', 'https://javad-test1.onrender.com']) {
    const envP = makeDom(origin);
    const win = envP.win;
    envP.cleanup();
    assert.equal(typeof win.v1212Peers, 'function', 'تابع فهرست هم‌دامنه‌ها در دسترس نیست');
    const peers = win.v1212Peers();
    const self = new URL(origin).origin;
    assert.ok(!peers.includes(self), 'خودِ دامنه نباید هم‌دامنه باشد: ' + origin);
    for (const must of ['https://javad-test1.onrender.com', 'https://mehraeinpharma.ir', 'https://ndcohub.com']) {
      if (must === self) continue;
      assert.ok(peers.includes(must), `دامنه ${must} در همگام نیست (روی ${origin})`);
    }
    assert.ok(!peers.some((p) => /ndcohub\.ir$/.test(new URL(p).hostname)), 'دامنه قدیمی با گواهی خراب نباید همگام شود');
    assert.deepEqual(win.CRM_HUB_DOMAINS, ['https://javad-test1.onrender.com', 'https://mehraeinpharma.ir', 'https://ndcohub.com']);
  }
});

test('v12.16.0 runtime: cross-origin requests never block the app (timeout really fires)', async (t) => {
  const env = makeDom('https://ndcohub.com');
  t.after(() => env.cleanup());
  /* ۱) نشانگرهای لایه */
  assert.equal(env.win.v1212NoVpn, true);
  assert.equal(env.win.v1212Header, true);
  assert.equal(env.win.v1212ThreeHubs, true);

  /* ۲) درخواست بین‌دامنه‌ای از مسیر نرم می‌رود و AbortSignal می‌گیرد */
  const p = env.win.fetch('https://javad-test1.onrender.com/api/state', { cache: 'no-store' });
  await p.then(() => {}, () => {});
  assert.ok(env.calls.cross.length >= 1, 'درخواست بین‌دامنه‌ای به لایه نرم نرفت');
  assert.ok(env.calls.cross[0].opts.signal, 'هیچ AbortSignalای برای تایم‌اوت تنظیم نشد');
  assert.equal(env.calls.cross[0].opts.signal.aborted, false);

  /* ۳) درخواست هم‌دامنه‌ای به لایهٔ محلی می‌رود (مسیر بین‌دامنه‌ای نیست) */
  env.win.fetch('/api/state');
  assert.equal(env.calls.local.length, 1, 'درخواست محلی نباید وارد مسیر بین‌دامنه‌ای شود');

  /* ۴) اگر سرور مقصد پاسخ ندهد (VPN خاموش)، درخواست در همان تایم‌اوت کوتاه رد می‌شود */
  env.win.__hang = true;
  const startedAt = Date.now();
  await assert.rejects(env.win.v1212SoftFetch('https://javad-test1.onrender.com/api/state', {}, 120));
  assert.ok(Date.now() - startedAt < 2000, 'رد شدن درخواست بیش از حد طول کشید');

  /* ۵) با navigator.onLine === false حتی یک درخواست هم فرستاده نمی‌شود */
  env.nav.onLine = false;
  const before = env.calls.cross.length;
  await env.win.v1212SoftFetch('https://javad-test1.onrender.com/api/state', {}, 120).catch(() => {});
  assert.equal(env.calls.cross.length, before, 'در حالت آفلاین نباید درخواستی فرستاده شود');
});

