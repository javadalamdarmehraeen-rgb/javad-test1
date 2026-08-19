import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const appSource = fs.readFileSync(new URL('../public/crm-app.js', import.meta.url), 'utf8');
const v9Source = fs.readFileSync(new URL('../public/crm-features-v9.js', import.meta.url), 'utf8');
const v20Source = fs.readFileSync(new URL('../public/crm-features-v20.js', import.meta.url), 'utf8');

function merger() {
  const a = appSource.indexOf('window.mergeStateWithoutLoss');
  const b = appSource.indexOf('\nfunction saveState', a);
  assert.ok(a >= 0 && b > a, 'mergeStateWithoutLoss must exist');
  const ctx = { window: {}, JSON };
  vm.createContext(ctx);
  vm.runInContext(appSource.slice(a, b), ctx);
  return ctx.window.mergeStateWithoutLoss;
}

test('new code cannot delete unrelated existing records or current layout', () => {
  const merge = merger();
  const current = {
    users: [{ id: 'u-faezeh', fullName: 'خانم فائزه مغانی' }],
    pharmacies: [{ id: 'ph-old', name: 'داروخانه قدیمی' }],
    doctors: [{ id: 'doc-old', name: 'پزشک قدیمی' }],
    products: [{ id: 'prod-old', name: 'کالای قدیمی' }],
    formFieldMeta: { order: { pharmacyName: { order: 7 } } },
    customFields: { pharmacy: [{ id: 'cf-old', label: 'کد قدیمی' }] }
  };
  const incoming = {
    users: [{ id: 'u-new', fullName: 'کاربر جدید' }],
    pharmacies: [], doctors: [], products: [],
    formFieldMeta: { order: { pharmacyName: { order: 1 }, city: { order: 2 } } },
    customFields: { pharmacy: [{ id: 'cf-new', label: 'فیلد جدید' }] }
  };
  const out = merge(structuredClone(current), incoming);
  assert.equal(out.users.length, 2);
  assert.equal(out.pharmacies[0].name, 'داروخانه قدیمی');
  assert.equal(out.doctors[0].name, 'پزشک قدیمی');
  assert.equal(out.products[0].name, 'کالای قدیمی');
  assert.equal(out.formFieldMeta.order.pharmacyName.order, 7, 'current manager layout must win');
  assert.deepEqual(out.customFields.pharmacy.map(x => x.id).sort(), ['cf-new', 'cf-old']);
});

test('11.20.3 baseline recovery restores layout and missing data together', () => {
  const a = appSource.indexOf('function loadState()');
  const b = appSource.indexOf('\nwindow.mergeStateWithoutLoss', a);
  const current = { _allSnapshotsMergedV11204: true, settings: { tag: 'broken' }, formFieldMeta: { bad: 1 }, users: [], pharmacies: [], doctors: [], products: [] };
  const baseline = { _lastSavedAt: 100, settings: { tag: '11.20.3' }, formFieldMeta: { good: 1 }, users: [{ id: 'f', fullName: 'خانم فائزه مغانی' }], pharmacies: [{ id: 'p' }], doctors: [{ id: 'd' }], products: [{ id: 'x' }] };
  const store = { CRM_APP_STATE_V2: JSON.stringify(current), CRM_APP_STATE_ROLLING_BACKUP: JSON.stringify(baseline) };
  const localStorage = { getItem: k => store[k] || null, setItem: (k,v) => { store[k] = v; }, key: i => Object.keys(store)[i], get length() { return Object.keys(store).length; } };
  const ctx = { window: {}, localStorage, console, JSON, Date, DEFAULT_INITIAL_DATA: {}, state: null };
  vm.createContext(ctx);
  vm.runInContext('const STORAGE_KEY="CRM_APP_STATE_V2";', ctx);
  vm.runInContext(appSource.slice(a,b).replace(/applyGeneralSettingsToUI\(\);/, ';'), ctx);
  vm.runInContext('loadState()', ctx);
  const out = JSON.parse(store.CRM_APP_STATE_V2);
  assert.equal(out.settings.tag, '11.20.3');
  assert.equal(out.formFieldMeta.good, 1);
  assert.equal(out.users[0].fullName, 'خانم فائزه مغانی');
  assert.equal(out.pharmacies.length, 1);
  assert.equal(out.doctors.length, 1);
  assert.equal(out.products.length, 1);
});

test('active order collector never converts blank quantity to one', () => {
  assert.doesNotMatch(v9Source, /count:\s*parseInt\(countEl[^\n]+\|\|\s*1/);
  assert.match(v9Source, /if \(qty <= 0\) continue/);
});

test('startup cannot auto-add mirrored fields or mutate structure', () => {
  const initStart = v20Source.indexOf('function init()');
  const initBody = v20Source.slice(initStart, v20Source.indexOf('if (document.readyState', initStart));
  assert.doesNotMatch(initBody, /mirrorPharmacyFieldsToOrder\(true\)/);
});

test('Snapp numeric parser and exact-row signatures prevent strange/double totals', () => {
  function extract(name) {
    const start = v20Source.indexOf(`function ${name}(`);
    assert.ok(start >= 0);
    const brace = v20Source.indexOf('{', start); let depth=0, end=brace;
    for (; end<v20Source.length; end++) { if (v20Source[end]==='{') depth++; else if (v20Source[end]==='}' && --depth===0) { end++; break; } }
    return v20Source.slice(start,end);
  }
  const ctx={ result:null, enDigits:v=>String(v).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)) };
  vm.createContext(ctx);
  vm.runInContext(`${extract('snappNumber')}; result=snappNumber`,ctx); const num=ctx.result;
  assert.equal(num('۱٬۲۳۴ ریال'),1234); assert.equal(num(''),0); assert.equal(num('0'),0);
  vm.runInContext(`${extract('rowSignature')}; result=rowSignature`,ctx); const sig=ctx.result;
  assert.equal(sig([' ۱۴۰۵/۰۱/۰۱ ',' علی  ','1,000']),sig(['۱۴۰۵/۰۱/۰۱','علی','1,000']));
});

test('Snapp and distributor imports keep exact-row dedupe guards', () => {
  assert.match(v20Source, /function rowSignature/);
  assert.match(v20Source, /D\.rows=D\.rows\.filter/);
  assert.match(v20Source, /seen\[rowSignature\(r\)\]/);
  assert.match(v20Source, /d\.pharmacyRows=d\.pharmacyRows\.concat\(fresh\)/);
  assert.match(v20Source, /d\.inventoryRows=data/);
  assert.match(v20Source, /<Worksheet ss:Name=/, 'multi-sheet Excel exporter must remain');
  assert.match(v20Source, /function bindProductCrudV20/);
  assert.match(v20Source, /window\.deleteProductCatalogItem=function/);
  assert.match(v20Source, /tab-distributor-database/);
  assert.match(v20Source, /\.data-table th,.data-table td/);
});
