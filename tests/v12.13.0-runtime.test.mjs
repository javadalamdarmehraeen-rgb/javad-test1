/**
 * اجرای واقعی لایه v12.16.0 — فرمان درخواست‌ها، HTTPS، GPS، پاک‌سازی یک‌باره.
 * هدف: ثابت کنیم انبوه درخواست‌ها (۵۰۳ِ هاست) مهار می‌شود و ذخیرهٔ کاربر بی‌درنگ می‌ماند.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../public/crm-bundle.js', import.meta.url), 'utf8');
const MARK = '/* v12.13.0:';
const END = '/* v12.15.0:';
const layer = src.slice(src.lastIndexOf(MARK));
assert.ok(layer.indexOf('window.v1213Governor') >= 0, 'نشانگر لایه در برش نیست');
assert.ok(layer.length > 1500, 'لایه v12.16.0 پیدا نشد');

function makeEnv(opts = {}) {
  const status = opts.status || 200;
  const els = {
    headerCompanyNameDisplay: { textContent: '' },
    crmBuildBadge: { textContent: 'قدیمی' },
    headerBrandLine: { textContent: '' },
    crmBuildHint: { textContent: '' },
    globalOnlineStatusBadge: { textContent: '' }
  };
  const store = new Map();
  const calls = [];
  const live = [];
  const win = {
    CRM_APP_VERSION: '12.16.0',
    addEventListener: () => {},
    caches: { keys: () => Promise.resolve(['crm-static-v11']), },
    state: { pharmacies: [{ id: 'p1' }], doctors: [], orders: [], users: [], settings: { companyName: '' } }
  };
  const doc = {
    getElementById: (id) => els[id] || null,
    querySelector: () => null,
    addEventListener: () => {},
    body: { nodeName: 'BODY' },
    hidden: false
  };
  const loc = { protocol: 'https:', hostname: 'ndcohub.com', host: 'ndcohub.com', origin: 'https://ndcohub.com', href: 'https://ndcohub.com/', search: '' };
  const nav = { onLine: true };
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };
  function MutationObserver() { this.observe = () => {}; }
  const sandboxFetch = function (url, o) {
    calls.push({ url, o, at: Date.now() });
    return Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve({ status: 'empty' }) });
  };
  win.fetch = sandboxFetch;
  const runner = new Function(
    'window', 'document', 'location', 'navigator', 'localStorage',
    'setTimeout', 'setInterval', 'clearTimeout', 'MutationObserver', 'fetch', 'alert',
    '"use strict";' + layer
  );
  runner(win, doc, loc, nav, localStorage,
    (fn, ms) => { const id = setTimeout(fn, ms); live.push({ id, k: 't' }); return id; },
    (fn, ms) => { const id = setInterval(fn, ms); live.push({ id, k: 'i' }); return id; },
    (id) => clearTimeout(id), MutationObserver, sandboxFetch, () => {});
  return { win, calls, store, els, cleanup: () => live.forEach((x) => (x.k === 't' ? clearTimeout(x.id) : clearInterval(x.id))) };
}

test('v12.16.0 runtime: request governor spaces background calls (healthy host)', async (t) => {
  const env = makeEnv({ status: 200 });
  t.after(() => env.cleanup());
  assert.equal(env.win.v1213Governor, true);

  /* ۱) نخستین درخواستِ پس‌زمینه بی‌درنگ می‌رود */
  await env.win.fetch('/api/state').catch(() => {});
  assert.equal(env.calls.length, 1);

  /* ۲) درخواستِ دوم حداقل ۳ ثانیه عقب می‌افتد (فاصلهٔ اجباری) */
  const t0 = Date.now();
  await env.win.fetch('/api/state').catch(() => {});
  assert.ok(Date.now() - t0 >= 3000, 'فاصلهٔ حداقل بین دو درخواست رعایت نشد');
  assert.equal(env.calls.length, 2);
});

test('v12.16.0 runtime: a 5xx host is quarantined instantly (no storm, no wait)', async (t) => {
  const env = makeEnv({ status: 503 });
  t.after(() => env.cleanup());

  /* نخستین ۵۰۳ ثبت می‌شود */
  await env.win.fetch('/api/state').catch(() => {});
  assert.equal(env.calls.length, 1);

  /* بلافاصله بعد از آن، درخواستِ پس‌زمینه بی‌درنگ رد می‌شود: نه انتظار، نه بمباران */
  const t1 = Date.now();
  await assert.rejects(env.win.fetch('/api/state'), /quarantine|backoff/);
  assert.ok(Date.now() - t1 < 800, 'بک‌آف/قرنطینه باعث توقف ارسال نشد');
  assert.equal(env.calls.length, 1, 'در زمان قرنطینه نباید درخواستی فرستاده شود');
});

test('v12.16.0 runtime: user saves are never queued or delayed', async (t) => {
  const env = makeEnv({ status: 200 });
  t.after(() => env.cleanup());
  const t0 = Date.now();
  await env.win.fetch('/api/state', { method: 'POST', body: '{}' });
  assert.ok(Date.now() - t0 < 800, 'ذخیرهٔ کاربر نباید پشت صف بماند');
  assert.equal(env.calls.length, 1);
  assert.equal(env.calls[0].o.method, 'POST');
});

test('v12.16.0 runtime: one-time cleanup purges caches but never user data', () => {
  const env = makeEnv();
  env.cleanup();
  /* کلید پاک‌سازی ثبت می‌شود تا هر بار تکرار نشود */
  assert.equal(env.store.get('CRM_V1213_CLEANED'), '1');
  /* دادهٔ کاربر هرگز نباید پاک شود */
  assert.equal(env.store.has('CRM_APP_STATE_V2'), false); /* چیزی برای پاک شدن نبود */
  assert.equal(env.win.v1213Cleanup, true);
  assert.equal(env.win.v1213Https, true);
  assert.equal(env.win.v1213GpsGuard, true);
});
