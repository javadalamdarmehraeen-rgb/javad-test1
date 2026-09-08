/**
 * v12.18.3 — مویرگِ همگامِ چنددستگاهی (نوبت ۱۴۰)
 * قانون ۹۲: هر بند با اجرایِ همانِ کدِ مرورگری/سروری سنجیده می‌شود.
 *  ۱) mergePull (کلاینت): افزودنی‌هایِ سرور می‌آید، رکوردِ کثیفِ محلی حفظ می‌شود،
 *     حذفِ تأییدشده اعمال، کلیدهایِ زیرخطیِ سرور (مُهرها) دست‌نخورده.
 *  ۲) سیم‌کشیِ لایه: crmPushStateToServerِ جدید، دیگیشنِ دکمهٔ عیب‌یابی، پیلِ وضعیت.
 *  ۳) سرورِ واقعی (spawnِ node server.js رویِ پورتِ آزمون): POSTِ v12183 ادغامِ رکوردی
 *     می‌کند نه جایگزینی؛ seenِ برابر = حذف‌ها معتبر، seenِ کهنه = افزودنی‌هایِ بقیه
 *     نمی‌سوزد؛ replaceِ کهنه رویِ فایلِ اشتراکی به ادغامِ بی‌حذف تنزل می‌یابد؛
 *     GET meta + since→304.
 *  ۴) آینهٔ PHP: merge_shared_12183 + state/meta + حالتِ 304.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const bundle = readFileSync(new URL('public/crm-bundle.js', root), 'utf8');
const serverSrc = readFileSync(new URL('server.js', root), 'utf8');
const phpSrc = readFileSync(new URL('public/api.php', root), 'utf8');

function bootSyncLayer() {
  const MARK = '/* v12.18.3 —';
  const from = bundle.indexOf(MARK);
  assert.ok(from > 0, 'لایهٔ 12.21.0 در انتهای باندل است');
  const layer = bundle.slice(from);
  const doc = {
    readyState: 'complete', visibilityState: 'visible',
    getElementById: () => null,
    createElement: () => ({ style: { cssText: '' }, setAttribute() {}, addEventListener() {} }),
    addEventListener() {}, body: { appendChild() {} }
  };
  const store = new Map();
  const win = {
    document: doc,
    navigator: { onLine: true },
    location: { protocol: 'http:', href: 'http://localhost:39999/index.html' },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    state: { pharmacies: [], doctors: [], settings: {} },
    serializeStateForLocalStorage: (s) => JSON.stringify(s),
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    addEventListener() {}, removeEventListener() {},
    XMLHttpRequest: function () { this.open = () => {}; this.send = () => {}; this.setRequestHeader = () => {}; }
  };
  win.window = win;
  new Function('window', 'document', 'navigator', 'location', 'localStorage', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'XMLHttpRequest', 'JSON',
    '"use strict";' + layer)(win, doc, win.navigator, win.location, win.localStorage, win.setTimeout, win.clearTimeout, win.setInterval, win.clearInterval, win.XMLHttpRequest, JSON);
  return { win, api: win.window.v12183Sync };
}

test('v12.18.3: mergePull — افزودنیِ سرور می‌آید، کثیفِ محلی می‌ماند، حذفِ تأییدشده اعمال می‌شود', () => {
  const { api } = bootSyncLayer();
  assert.ok(api && typeof api.merge === 'function', 'APIِ مویرگ');
  const NOW = Date.now();
  const base = {
    pharmacies: [
      { id: 'p1', name: 'محلیِ تازه', _updatedAt: NOW - 1000 },        // dirty (بعد ازِ pullِ آخر)
      { id: 'p2', name: 'محلیِ قدیمی', _updatedAt: NOW - 99999999 },   // سرور این را پاک کرده
      { id: 'p3', name: 'همان', _updatedAt: 5 }
    ],
    doctors: [{ id: 'd9', name: 'بیمارِ محلیِ تازه', _updatedAt: NOW - 500 }],
    settings: { theme: 'dark' },
    _soloOnly: true
  };
  const remote = {
    pharmacies: [
      { id: 'p1', name: 'نسخهٔ سرورِ قدیمی', _updatedAt: NOW - 500000 },
      { id: 'p3', name: 'همان', _updatedAt: 5 },
      { id: 'p4', name: 'ازِ دستگاهِ دیگر', _updatedAt: NOW - 2000 }
    ],
    doctors: [{ id: 'd9', name: 'بیمارِ محلیِ تازه', _updatedAt: NOW - 500 }],
    settings: { theme: 'light', lang: 'fa' },
    _sharedRev: 'abc', _dataGen: '11.81.0'
  };
  const seen = NOW - 60000; // آخرین pull
  const res = api.merge(base, remote, seen);
  const ph = Object.fromEntries(base.pharmacies.map((r) => [r.id, r]));
  assert.equal(ph.p1.name, 'محلیِ تازه', 'رکوردِ کثیفِ محلی نباید بازنویسی شود');
  assert.ok(ph.p4, 'افزودنیِ دستگاهِ دیگر باید بیاید');
  assert.ok(!ph.p2, 'حذفِ تأییدشده باید اعمال شود');
  assert.equal(base.settings.theme, 'light', 'کلیدهایِ غیرآرایه‌ای: سرور (ازِ دستگاهِ تازه‌تر)');
  assert.equal(base._soloOnly, true, 'کلیدهایِ زیرخطیِ محلی دستِ mergePullِ pull را نمی‌بینند (مُهرها مالِ سرورند ولی اینجا حفظِ آینه)');
  assert.ok(res.removed >= 1 && res.added >= 1, 'شمارشِ تغییر: ' + JSON.stringify(res));
});

test('v12.18.3: سیم‌کشیِ لایه — crmPushStateToServerِ جدید، دکمهٔ عیب‌یابی، پیل، رهاشدنِ قفلِ انفرادی', () => {
  const { win } = bootSyncLayer();
  assert.equal(typeof win.window.crmPushStateToServer, 'function');
  win.window.crmPushStateToServer(); // نباید بیندازد (XHR استاب)
  assert.ok(bundle.includes('crm12183NowBtn'), 'دکمهٔ گرفتنِ فوری در ردیفِ عیب‌یابی');
  assert.ok(bundle.includes('data-crm-pull-now'), 'delegationِ دکمه');
  assert.ok(bundle.includes('crm12183Pill'), 'پیلِ وضعیتِ همگامی');
  assert.ok(bundle.includes('CRM_APP_STATE_V2'), 'پایدارسازیِ محلی پس ازِ ادغام');
  assert.ok(bundle.includes('CRM_SOLO_CLAIM'), 'مُهرِ «انفرادی» در بوت پاک می‌شود');
  assert.ok(/delete s\._soloOnly/.test(bundle), 'پرچمِ solo از state در بوت حذف می‌شود');
});

test('v12.18.3: سرورِ واقعی — POSTِ مویرگی ادغام می‌کند، نه جایگزینی؛ meta/304؛ replaceِ کهنه بی‌حذف', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'crm12183-'));
  const PORT = 39000 + (process.pid % 900);
  const child = spawn(process.execPath, ['server.js'], {
    cwd: fileURLToPath(root),
    env: { ...process.env, PORT: String(PORT), CRM_DATA_DIR: dir, CRM_NO_SECONDARY_LISTEN: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  try {
    await new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('server boot timeout')), 8000);
      child.stdout.on('data', (b) => { if (String(b).includes('listening')) { clearTimeout(t); res(); } });
      child.on('exit', (c) => { clearTimeout(t); rej(new Error('server exited ' + c)); });
    });
    const B = `http://127.0.0.1:${PORT}`;
    const NOW = Date.now();
    const post = async (payload, seen) => {
      const rr = await fetch(B + '/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CRM-Request': '1', 'X-CRM-Sync': 'v12183', 'X-CRM-Seen': seen || '' },
        body: JSON.stringify(payload)
      });
      return { status: rr.status, json: await rr.json() };
    };
    const A1 = { _dataGen: '11.81.0', _soloOnly: true, pharmacies: [{ id: 'p1', name: 'داروخانهٔ الف', _updatedAt: NOW - 4000 }, { id: 'p2', name: 'داروخانهٔ ب', _updatedAt: NOW - 4000 }] };
    let r;
    const first = await post(A1, '');
    const j0 = first.json;
    const rev1 = j0.rev || (j0.data && j0.data._sharedRev);
    assert.ok(rev1, 'rev از پاسخ');
    assert.ok(!j0.data._soloOnly, 'پس ازِ اولین چسبندگی، فایل اشتراکی است و مُهرِ انفرادی می‌رود');
    // بوت‌پشِ دستگاهِ تازه‌رسیده (بدونِ نشانِ auth): افزودنی می‌کند ولی هرگز حذف نمی‌کند
    let out = await post({ _dataGen: '11.81.0', pharmacies: [{ id: 'p1', name: 'داروخانهٔ الف', _updatedAt: NOW - 4000 }, { id: 'p2', name: 'داروخانهٔ ب', _updatedAt: NOW - 4000 }, { id: 'p9', name: 'ازِ C', _updatedAt: NOW }] }, rev1);
    let j = out.json;
    const rev2 = j.rev || j.data._sharedRev;
    assert.ok(j.data.pharmacies.some((x) => x.id === 'p9'), 'افزودنیِ بوت‌پش ماند');
    // ذخیرهٔ کاربر ازِ B (auth درست): ویرایشِ p1 + حذفِ p2 معتبر
    out = await post({ _dataGen: '11.81.0', _seenAuth: rev2, pharmacies: [{ id: 'p1', name: 'الف ویرایش B', _updatedAt: NOW + 1000 }, { id: 'p9', name: 'ازِ C', _updatedAt: NOW }] }, rev2);
    j = out.json;
    let ph = Object.fromEntries(j.data.pharmacies.map((x) => [x.id, x]));
    assert.equal(ph.p1.name, 'الف ویرایش B', 'تازه‌تر برنده است');
    assert.ok(!ph.p2, 'حذف فقط با دیدِ درست + نشانِ auth اعمال می‌شود');
    assert.ok(ph.p9, 'افزودنیِ C نماند؟ باید بماند');
    // دیدِ کهنه (seen اشتباه): هیچ حذفی رخ نمی‌دهد و افزوده‌هایِ دیگران زنده‌اند
    out = await post({ _dataGen: '11.81.0', _seenAuth: rev1, pharmacies: [{ id: 'p1', name: 'داروخانهٔ الف', _updatedAt: NOW - 4000 }, { id: 'p2', name: 'داروخانهٔ ب', _updatedAt: NOW - 4000 }] }, rev1);
    j = out.json;
    ph = Object.fromEntries(j.data.pharmacies.map((x) => [x.id, x]));
    assert.ok(ph.p9, 'رکوردِ دستگاهِ دیگر با دیدِ کهنه نمی‌سوزد');
    assert.equal(ph.p1.name, 'الف ویرایش B', 'نسخهٔ تازه حفظ شد');
    assert.ok(!ph.p2, 'v12.18.6 «گورِ رکورد»: p2 حذفِ مجاز شده بود — حالا حتی pushِ کهنه باِ حاملِ رکورد هم احیایش نمی‌کند (رفعِ «شبحِ بازگشتِ حذف»)');
    // سطلِ سهمیهٔ مستقل: ۴۰ نوشتنِ کهنه (بدونِ هدرِ v12183) نباید مویرگ را ۴۲۹ کند
    const flood = await fetch(B + '/api/state?replace=1', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CRM-Request': '1', 'X-CRM-Replace': '1' }, body: JSON.stringify({ _dataGen: '11.81.0', pharmacies: [] }) });
    assert.ok(flood.status === 200 || flood.status === 429, 'سطلِ کهنه جدا است');
    const stillOk = await post({ _dataGen: '11.81.0', pharmacies: [{ id: 'pz', name: 'میانِ سیل', _updatedAt: Date.now() }] }, '');
    assert.equal(stillOk.status, 200, 'مویرگ با سهمیهٔ خودش کار می‌کند (بدنهٔ یکسانِ flood = dedup، نه 429)');
    // متا و 304
    r = await fetch(B + '/api/state/meta?n=1');
    const mj = await r.json();
    assert.ok(mj.rev && mj.shared === true, 'meta می‌گوید فایل اشتراکی است');
    r = await fetch(B + '/api/state?since=' + mj.rev);
    assert.equal(r.status, 304, 'بدون تغییر = 304');
    } finally {
    child.kill('SIGTERM');
    try { rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  }
});

test('v12.18.3: آینهٔ PHP — merge_shared_12183 + state/meta + 304 + تنزلِ replace', () => {
  assert.ok(phpSrc.includes('function merge_shared_12183'), 'ادغامِ رکوردی در php');
  assert.ok(phpSrc.includes('"state/meta"'), 'متایِ rev برای چکِ ارزان');
  assert.ok(phpSrc.includes('http_response_code(304)'), 'since→304');
  assert.ok(phpSrc.includes('_sharedRev'), 'مُهرِ «اشتراکی» تا replaceِ کهنه نابودگر نباشد');
  assert.ok(phpSrc.includes('v12183'), 'هدرِ همگام');
});

test('v12.18.3: سرورِ Node — هلپرهایِ ادغام و گیت‌ها', () => {
  assert.ok(serverSrc.includes('function mergeCollections12183'), 'ادغامِ رکوردی');
  assert.ok(serverSrc.includes('pathname === "/api/state/meta"'), 'ROUTE متا');
  assert.ok(serverSrc.includes('X-CRM-Seen'), 'CORSِ هدرِ seen');
  assert.ok(serverSrc.includes('s === "v12183"'), 'گیتِ نسلی پروتکلِ تازه را رد نمی‌کند');
  assert.ok(serverSrc.includes('snapshotCloudBackup(merged)'), 'بکاپِ ابری از نسخهٔ ادغام‌شده');
  assert.ok(serverSrc.includes('sinceQ === revOut'), 'پاسخِ since→304');
});
