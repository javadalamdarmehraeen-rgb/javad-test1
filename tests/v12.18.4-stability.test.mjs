/**
 * v12.18.4 — دیوارِ آتشِ چیدمانی (نوبت ۱۴۱).
 * خواسته: «مدام برنامه آنلاین/آفلاین می‌شود و هربار جای فیلدها عوض می‌شود.»
 * ریشه: موتورهایِ قدیمیِ v60/v65/v67/v69/v7x رویِ رویدادهایِ online/offline و اینتروال‌ها،
 * با fetch کلِ state را ازِ سرور کشیده و «جایگزینِ کامل» می‌کنند (applyRemote) — چیدمان هم بازمی‌گردد.
 * رفع: لایهٔ انتهاییِ fetch، هر GET/POSTِ قدیمی به /api/state را بی‌ضرر می‌کند؛ مویرگِ v12183
 * ازِ XHR خام کار می‌کند و اصلاً ازِ این در رد نمی‌شود.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const bundle = fs.readFileSync(path.join(ROOT, 'public/crm-bundle.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');

test('v12.18.4: فایروال درِ انتهایِ باندل است و پس ازِ همهٔ نسلهایِ قدیمیِ pusher می‌آید', () => {
  assert.ok(bundle.includes('/*V12184-FW-START*/'), 'بلوکِ فایروال');
  assert.ok(bundle.includes('/*V12184-FW-END*/'), 'پایانِ بلوک');
  const fwPos = bundle.indexOf('/*V12184-FW-START*/');
  let m; let last = -1;
  const re = /window\.crmPushStateToServer\s*=\s*function/g;
  while ((m = re.exec(bundle))) last = m.index;
  assert.ok(last > 0 && fwPos > last, 'فایروالِ آخر ازِ همهٔ بازنویسی‌هایِ crmPushStateToServer');
  const after = bundle.slice(bundle.indexOf('/*V12184-FW-END*/'));
  assert.ok(!/window\.fetch\s*=/.test(after.replace(/window\.fetch\._v12184/g, '')), 'پس ازِ فایروال fetchِ دیگری نصب نمی‌شود');
  assert.match(bundle, /_v12184/);
  assert.match(bundle, /__CRM12184_FW_OFF/);
  assert.match(html, /BUILD="12\.23\.0"/, 'BUILD در index.html');
  assert.match(html, /crm-bundle\.js\?v=12\.23\.0/, 'کش‌بستِ تازه');
});

test('v12.18.4: رفتارِ فایروال — GETِ کهنه=skip، POSTِ کهنه=موفقِ جعلی، دامنهٔ دیگر هم، بقیهٔ مسیرها آزاد', async () => {
  const s0 = bundle.indexOf('/*V12184-FW-START*/');
  const s1 = bundle.indexOf('/*V12184-FW-END*/') + '/*V12184-FW-END*/'.length;
  const src = bundle.slice(s0, s1);
  const passed = [];
  const orig = (u) => { passed.push(String((u && u.url) || u)); return Promise.resolve('PASSED'); };
  const win = { fetch: orig };
  const ctx = vm.createContext({ window: win, Promise, console, JSON });
  vm.runInContext(src, ctx);
  const f = win.fetch;
  assert.ok(f._v12184 === 1, 'فایروال نصب شد');
  const r1 = await f('/api/state?__v69=' + Date.now());
  const j1 = await r1.json();
  assert.equal(j1.status, 'skip', 'پولِ کهنه = skip');
  const r2 = await f('/api/state', { method: 'POST', body: '{}' });
  const j2 = await r2.json();
  assert.equal(j2.status, 'success');
  assert.equal(j2.merged, true, 'پاسخِ j.data ندارد → هیچِ applyRemote‌ای اجرا نمی‌شود');
  const r3 = await f('https://mehraeinpharma.ir/api/state?x=1');
  const j3 = await r3.json();
  assert.equal(j3.status, 'skip', 'میرورِ دامنهٔ دیگر هم خنثی');
  const r4 = await f('/api/health');
  assert.equal(r4, 'PASSED', 'سلامت/لایگین/چت آزادند');
  const r5 = await f('/api/state-meta-ish');
  assert.equal(r5, 'PASSED', 'شبهِ‌نام‌هایِ دیگر درگیرِ گیتِ /api/state نمی‌شوند (regex فقطِ خودِ مسیر)');
  assert.equal(passed.length, 2, 'دو درخواستِ state اصلاً به شبکه نرفتند');
  // double-install بی‌ضرر
  vm.runInContext(src, ctx);
  assert.equal(win.fetch, f, 'نصبِ دوباره همانِ wrapper را نگه می‌دارد');
});

test('v12.18.4: مویرگ ازِ fetch رد نمی‌شود — لولهٔ XHRِ مستقل، پس فایروالِ تازه آن را نمی‌بندد', () => {
  const tailPos = bundle.indexOf('window.v12183Sync = {');
  assert.ok(tailPos > 0, 'لایهٔ مویرگ هست');
  const i0 = bundle.indexOf('function rawXhr');
  assert.ok(i0 > 0 && i0 < tailPos, 'rawXhr پیش ازِ لایه تعریف شده');
  assert.match(bundle.slice(i0, i0 + 1500), /new XMLHttpRequest\(/, 'rawXhr با XHR خام');
  const seg = bundle.slice(bundle.indexOf('function rawXhr'), bundle.indexOf('function hash12183'));
  assert.ok(seg.length > 100, 'بدنهٔ rawXhr پیدا شد');
  assert.ok(!/window\.fetch\(|[^.]\bfetch\(\s*["'`]\/api\/state/.test(seg), 'درِ مسیرِ stateِ مویرگ fetch وجود ندارد');
});
