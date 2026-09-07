/**
 * v12.18.5 — «ستونِ پایدار» (نوبت ۱۴۲).
 * خواسته: فیلدِ کشوییِ اضافه‌شده درِ تبِ ستون‌ها و کالاها باید درِ فرمِ افزودنِ کالا بنشیند،
 * مقدارش ذخیره شود و باِ آمدنِ نسخهٔ تازه یاِ pullِ کهنه ازِ بین نرود. + پرشِ هدر.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const bundle = fs.readFileSync(path.join(ROOT, 'public/crm-bundle.js'), 'utf8');
const server = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
const php = fs.readFileSync(path.join(ROOT, 'public/api.php'), 'utf8');
const entry = fs.readFileSync(path.join(ROOT, 'public/crm-entry-engine.js'), 'utf8');

test('v12.18.5: لایهٔ «ستونِ پایدار» درِ انتهایِ باندل است و رَندرِ عمومی را پوشش می‌دهد', () => {
  assert.ok(bundle.includes('/*V12185-STABLE-START*/'), 'بلوکِ لایه');
  assert.ok(bundle.includes('/*V12185-STABLE-END*/'), 'پایانِ بلوک');
  const pos = bundle.indexOf('/*V12185-STABLE-START*/');
  assert.ok(pos > bundle.indexOf('/*V12184-FW-START*/'), 'پس ازِ فایروالِ ۱۲.۱۸.۴ (آخرینِ لایه)');
  assert.match(bundle, /renderAllCustomFieldsInFormsAndTables\s*=\s*wa/, 'رَندرِ عمومی wrap شد (حلقهٔ گمشدهٔ کالا وصل شد)');
  assert.match(bundle, /productCustomFieldsContainer/, 'میزبانِ فرمِ کالا');
  assert.match(bundle, /v12185-chip/, 'نمایشِ مقادیر درِ جدولِ کالا');
  assert.match(bundle, /editProductCatalogItem\s*=\s*we12185/, 'بازگردانیِ مقادیر درِ ویرایش');
  assert.ok(bundle.includes('v12185PinCss') && bundle.includes('min-width:104px') && bundle.includes('.v1215-net-badge'),
    'پینِ عرضِ نشانِ آنلاین/آفلاین (ضدِ لرزشِ هدر)');
  assert.match(bundle, /pane\.addEventListener\("submit"[\s\S]{0,120}formProduct[\s\S]{0,80}grab12185/, 'برداشتِ مقادیر درِ capture پیش ازِ موتورِ v20');
});

function evalMergeFns() {
  const grab = (name, from) => {
    const i = bundle.indexOf(from || ('function ' + name + '('));
    assert.ok(i >= 0, name + ' پیدا شد');
    let depth = 0, j = bundle.indexOf('{', i);
    for (let k = j; k < bundle.length; k++) {
      if (bundle[k] === '{') depth++;
      else if (bundle[k] === '}') { depth--; if (depth === 0) return bundle.slice(i, k + 1); }
    }
    throw new Error('unbalanced ' + name);
  };
  const src = ['idArray', 'kidOf', 'stampOf', 'mergePull', 'mergeObj12185', 'unionById12185'].map((n) => grab(n)).join('\n');
  const ctx = vm.createContext({ JSON, Object, Array, Date: 1 });
  vm.runInContext(src + '\nthis.mergePull = mergePull;', ctx);
  return ctx;
}
test('v12.18.5: mergePullِ تازه — فیلدهایِ سفارشی باِ pullِ کهنه نمی‌میرند، افزودنی می‌آید، scalarِ محلی می‌ماند', () => {
  const ctx = evalMergeFns();
  const local = {
    customFields: { products: [{ id: 'cf-a', label: 'شکل', options: ['قرص'] }, { id: 'cf-b', label: 'پایه' }] },
    settings: { companyName: 'مهرآیین', myNew: 1 },
    pharmacies: [{ id: 'p1', name: 'محلی‌ِ تازه', _updatedAt: Date.now() }]
  };
  const remote = {
    customFields: { products: [{ id: 'cf-a', label: 'شکل', options: ['قرص', 'کپسول'] }] },
    settings: { companyName: 'مهرآیین' },
    pharmacies: [{ id: 'p0', name: 'ازِ بقیه', _updatedAt: Date.now() - 5000 }]
  };
  const res = ctx.mergePull(local, remote, 0);
  const cfIds = local.customFields.products.map((f) => f.id);
  assert.ok(cfIds.includes('cf-b'), 'فیلدِ محلیِ تازه باِ pullِ کهنه حذف نشد');
  const cfA = local.customFields.products.filter((f) => f.id === 'cf-a')[0];
  assert.deepEqual(cfA.options, ['قرص', 'کپسول'], 'ویرایشِ remote رویِ همانِ رکورد اعمال شد (بازهٔ آبجکتی: remote-wins)');
  assert.equal(local.settings.myNew, 1, 'کلیدِ محلیِ فقط‌محلی حفظ شد');
  assert.ok(local.pharmacies.some((p) => p.id === 'p0'), 'افزودنیِ رکوردی می‌آید');
  assert.ok(res.touched > 0, 'شمارشگرِ تغییرات');
});

const PORT = 31285;
test('v12.18.5: سرورِ واقعی — ادغامِ بازگشتیِ customFields و محافظتِ تنظیمات ازِ حذف', async () => {
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'crm12185-'));
  const proc = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
    env: { ...process.env, PORT: String(PORT), CRM_DATA_DIR: dir, NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const t0 = Date.now();
  let up = false;
  while (Date.now() - t0 < 12000) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/api/health`); if (r.ok) { up = true; break; } } catch (e) { await new Promise((r2) => setTimeout(r2, 250)); }
  }
  assert.ok(up, 'سرورِ تست بالا آمد');
  try {
    const B = `http://127.0.0.1:${PORT}`;
    const post = async (payload, seen) => {
      const rr = await fetch(B + '/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CRM-Request': '1', 'X-CRM-Sync': 'v12183', 'X-CRM-Seen': seen || '' }, body: JSON.stringify(payload) });
      return { status: rr.status, json: await rr.json() };
    };
    const NOW = Date.now();
    let out = await post({ _dataGen: '11.81.0', customFields: { products: [{ id: 'cf-a', label: 'شکل دارویی' }] }, products: [{ id: 'x1', name: 'اسپیرو', _updatedAt: NOW }] }, '');
    const rev1 = out.json.rev;
    // دستگاهِ دوم (auth، دیدِ روز) فیلدِ خودش را اضافه می‌کند — فیلدِ اول باید زنده بماند
    out = await post({ _dataGen: '11.81.0', _seenAuth: rev1, customFields: { products: [{ id: 'cf-a', label: 'شکل دارویی' }, { id: 'cf-b', label: 'پایهٔ مصرف' }] }, products: [{ id: 'x1', name: 'اسپیرو', _updatedAt: NOW }, { id: 'x2', name: 'استامینوفن', _updatedAt: NOW + 5 }] }, rev1);
    let d = out.json.data;
    assert.equal((d.customFields.products || []).length, 2, 'اجتماعِ بازگشتیِ فیلدها');
    assert.ok((d.products || []).length === 2, 'رکوردها هم ادغام');
    // pushِ بدونِ کلیدِ customFields (دستگاهِ کهنه) — تنظیماتِ سرور نباید پاک شود
    out = await post({ _dataGen: '11.81.0', products: [{ id: 'x1', name: 'اسپیرو', _updatedAt: NOW }] }, '');
    d = out.json.data;
    assert.ok(d.customFields && (d.customFields.products || []).length === 2, 'تنظیماتِ غایب پاک نشد (محافظتِ v12.18.5)');
    assert.ok((d.products || []).some((p) => p.id === 'x2'), 'رکوردِ دستگاهِ دیگر هم نسوخت');
    // حذفِ رکورد باِ auth هنوز کار می‌کند (قانونِ ۱۲.۱۸.۳ حفظ شد)
    const rev2 = out.json.rev;
    out = await post({ _dataGen: '11.81.0', _seenAuth: rev2, customFields: { products: [{ id: 'cf-a', label: 'شکل دارویی' }, { id: 'cf-b', label: 'پایهٔ مصرف' }] }, products: [{ id: 'x1', name: 'اسپیرو', _updatedAt: NOW + 99 }] }, rev2);
    d = out.json.data;
    assert.ok(!(d.products || []).some((p) => p.id === 'x2'), 'حذفِ سانس‌کیت‌شده اعمال شد');
  } finally {
    proc.kill('SIGTERM');
  }
});

test('v12.18.5: آینهٔ PHP هم قانونِ بازگشتی/محافظت را دارد + موتورِ ورود آینهٔ state را می‌بخشد', () => {
  assert.match(php, /function merge_obj_12185/, 'ادغامِ بازگشتیِ PHP');
  assert.match(php, /merge_obj_12185\(\$a0, \$v\)/, 'آبجکتِ تنظیمی ازِ merge_obj عبور می‌کند');
  assert.match(php, /array_keys\(\$bk\) === range\(0, count\(\$bk\) - 1\)\)\) unset\(\$base\[\$k\]\)/, 'حذفِ غایب فقط برایِ آرایه‌هایِ لیستی (رکوردی)');
  assert.match(entry, /if \(STATE_MIRROR\.test\(k\)\) continue;/, 'آینهٔ state درِ جارویِ نسخه پاک نمی‌شود');
});
