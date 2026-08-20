import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const appSource = fs.readFileSync(new URL('../public/crm-app.js', import.meta.url), 'utf8');
const v9Source = fs.readFileSync(new URL('../public/crm-features-v9.js', import.meta.url), 'utf8');
const v20Source = fs.readFileSync(new URL('../public/crm-features-v20.js', import.meta.url), 'utf8');
const serverSource = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
const gitignoreSource = fs.readFileSync(new URL('../.gitignore', import.meta.url), 'utf8');

function loadWithCurrent(current, backup) {
  const a = appSource.indexOf('function loadState()');
  const b = appSource.indexOf('\nfunction saveState', a);
  const store = { CRM_APP_STATE_V2: JSON.stringify(current), CRM_APP_STATE_ROLLING_BACKUP: JSON.stringify(backup) };
  const localStorage = { getItem: k => store[k] || null, setItem: (k,v) => { store[k] = v; }, key: i => Object.keys(store)[i], get length() { return Object.keys(store).length; } };
  const ctx = { window: {}, localStorage, console, JSON, Date, DEFAULT_INITIAL_DATA: { users:[{id:'sample'}] }, state: null };
  vm.createContext(ctx);
  vm.runInContext('const STORAGE_KEY="CRM_APP_STATE_V2";', ctx);
  const sa=appSource.indexOf('function serializeStateForLocalStorage'), sb=appSource.indexOf('\nfunction loadState',sa);
  vm.runInContext(appSource.slice(sa,sb),ctx);
  vm.runInContext(appSource.slice(a,b).replace(/applyGeneralSettingsToUI\(\);/, ';'), ctx);
  vm.runInContext('loadState()', ctx);
  return JSON.parse(store.CRM_APP_STATE_V2);
}

test('current state is authoritative and old backup cannot re-add deleted data', () => {
  const la=appSource.indexOf('function loadState()'),lb=appSource.indexOf('\nfunction saveState',la),loadBody=appSource.slice(la,lb);
  assert.doesNotMatch(loadBody,/CRM_APP_STATE_ROLLING_BACKUP|CRM_APP_STATE_BACKUP_LATEST|MERGED_RECOVERY/);
  const current = { settings:{tag:'current'}, users:[{id:'new'}], pharmacies:[], doctors:[], products:[], orders:[], formFieldMeta:{order:{field:{order:9}}} };
  const old = { settings:{tag:'old'}, users:[{id:'deleted-user'}], pharmacies:[{id:'deleted-ph'}], doctors:[{id:'deleted-doc'}], products:[{id:'deleted-product'}], formFieldMeta:{order:{field:{order:1}}} };
  const out=loadWithCurrent(current,old);
  assert.equal(out.settings.tag,'current');
  assert.deepEqual(out.users.map(x=>x.id),['new']);
  assert.equal(out.pharmacies.length,0);
  assert.equal(out.doctors.length,0);
  assert.equal(out.products.length,0);
  assert.equal(out.formFieldMeta.order.field.order,9);
  const sa=appSource.indexOf('function saveState'),sb=appSource.indexOf('\nfunction applyGeneralSettingsToUI',sa),saveBody=appSource.slice(sa,sb);
  assert.doesNotMatch(saveBody,/CRM_APP_STATE_ROLLING_BACKUP/);
  assert.match(appSource,/function cleanupObsoleteAutoBackups/);
});

test('existing empty arrays stay empty and sample defaults are never injected', () => {
  const out=loadWithCurrent({settings:{},users:[],pharmacies:[],doctors:[],products:[],orders:[]},{users:[{id:'old'}]});
  assert.deepEqual(out.users,[]);assert.deepEqual(out.pharmacies,[]);assert.deepEqual(out.products,[]);
  assert.equal(out._authoritativeState,true);
});

test('manager runtime data uses separate git-ignored user-data file', () => {
  assert.match(serverSource,/user-data\.json/);assert.match(serverSource,/LEGACY_DATA_PATH/);assert.match(gitignoreSource,/user-data\.json/);
});

test('active order collector never converts blank quantity to one', () => {
  assert.doesNotMatch(v9Source, /count:\s*parseInt\(countEl[^\n]+\|\|\s*1/);
  assert.match(v9Source, /if \(qty <= 0\) continue/);
  assert.match(v9Source, /maximumAge:0|maximumAge: 0/);
  assert.match(v9Source, /watchPosition/);
  assert.match(v9Source, /accuracy<=15/);
  assert.match(v9Source, /toFixed\(6\)/);
});

test('startup cannot auto-add mirrored fields, old backups, or remote state', () => {
  const initStart = v20Source.indexOf('function init()');
  const initBody = v20Source.slice(initStart, v20Source.indexOf('if (document.readyState', initStart));
  assert.doesNotMatch(initBody, /mirrorPharmacyFieldsToOrder\(true\)/);
  assert.doesNotMatch(initBody, /mergeStateWithoutLoss/);
  const d0=v20Source.indexOf('function bindDurableServerState'),d1=v20Source.indexOf('/* ---------- ۲۷)',d0),durable=v20Source.slice(d0,d1);
  assert.doesNotMatch(durable,/res&&res\.data|location\.reload|method:\s*["']GET/);
  assert.match(durable,/method:\s*["']POST/);
});

test('Persian address order starts with Iran and removes postal code', () => {
  const start=v9Source.indexOf('function formatNominatim('),brace=v9Source.indexOf('{',start);let depth=0,end=brace;for(;end<v9Source.length;end++){if(v9Source[end]==='{')depth++;else if(v9Source[end]==='}'&&--depth===0){end++;break;}}
  const ctx={result:null,Number};vm.createContext(ctx);vm.runInContext(`${v9Source.slice(start,end)};result=formatNominatim`,ctx);const out=ctx.result({address:{country:'ایران',state:'استان تهران',county:'شهرستان تهران',municipality:'بخش مرکزی',city:'تهران',city_district:'منطقه ۱۴',road:'دهم فروردین',house_number:'12',postcode:'17658-33316'}},35,51);assert.ok(out.startsWith('ایران، استان تهران'));assert.match(out,/پلاک: 12/);assert.doesNotMatch(out,/17658-33316|کد پستی/);
});

test('global numeric display converts Persian digits to Latin without changing passwords/codes', () => {
  const start=v20Source.indexOf('function latinizeDigits('),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}
  const ctx={result:null,enDigits:v=>String(v).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c))};vm.createContext(ctx);vm.runInContext(`${v20Source.slice(start,end)};result=latinizeDigits`,ctx);assert.equal(ctx.result('۱۴۰۵/۰۸/۱۹'),'1405/08/19');assert.equal(ctx.result('۱٬۲۳۴٫۵'),'1,234.5');
  assert.match(v20Source,/el\.type===\"password\"/);assert.match(v20Source,/data-no-number-group/);
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
  vm.runInContext(`${extract('normalizeStoredRow')};${extract('rowSignature')}; result=rowSignature`,ctx); const sig=ctx.result;
  assert.equal(sig([' ۱۴۰۵/۰۱/۰۱ ',' علی  ','1,000']),sig(['۱۴۰۵/۰۱/۰۱','علی','1,000']));
  assert.equal(sig({0:'1405/01/01',1:'علی',2:'1000'}),sig(['1405/01/01','علی','1000']));
  assert.doesNotThrow(()=>sig({cells:['1405/01/01','علی','1000']}));
});

test('large Excel rows are stripped from localStorage metadata and delegated to IndexedDB', () => {
  const a=appSource.indexOf('function serializeStateForLocalStorage'),b=appSource.indexOf('\nfunction loadState',a);
  const ctx={result:null,JSON};vm.createContext(ctx);vm.runInContext(`${appSource.slice(a,b)};result=serializeStateForLocalStorage`,ctx);
  const raw=ctx.result({snappCorporate:{rows:[[1]],topups:[[2]],headers:['x']},distributorCompanies:{daya:{id:'daya',pharmacyRows:[[3]],inventoryRows:[[4]],username:'u'}}});
  const out=JSON.parse(raw);assert.deepEqual(out.snappCorporate.rows,[]);assert.deepEqual(out.distributorCompanies.daya.pharmacyRows,[]);assert.equal(out.distributorCompanies.daya.username,'u');
  assert.match(v20Source,/function saveBulkVault/);assert.match(v20Source,/await saveBulkVault\(\)/);
});

test('distributor last date comes from the final non-empty row, not import time or max sort', () => {
  const start=v20Source.indexOf('function distLastDate('),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}
  const ds=v20Source.indexOf('function slashOnlyPersianDate('),db=v20Source.indexOf('{',ds);let dd=0,de=db;for(;de<v20Source.length;de++){if(v20Source[de]==='{')dd++;else if(v20Source[de]==='}'&&--dd===0){de++;break;}}
  const ctx={result:null,enDigits:v=>String(v).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)),findDistIndex:()=>0,normalizeStoredRow:r=>Array.isArray(r)?r:Object.values(r||{})};vm.createContext(ctx);vm.runInContext(`${v20Source.slice(ds,de)};${v20Source.slice(start,end)};result={date:slashOnlyPersianDate,last:distLastDate}`,ctx);
  assert.equal(ctx.result.date('14050819'),'1405/08/19');assert.equal(ctx.result.date('1405/08/19'),'1405/08/19');assert.equal(ctx.result.date('39694'),'39694');
  assert.equal(ctx.result.last([['1405/02/01'],['1405/01/01']],['تاریخ'],'other'),'1405/01/01');
  const daya=Array.from({length:14},()=>''),daya2=Array.from({length:14},()=> '');daya[13]='1405/03/01';daya2[13]='1405/02/20';assert.equal(ctx.result.last([daya,daya2],[],'daya'),'1405/02/20');
});

test('Daya inventory headers auto-align by one cell without shifting data', () => {
  const start=v20Source.indexOf('function alignDistributorHeaders('),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}
  const ctx={result:null,normalizeStoredRow:r=>Array.isArray(r)?r:Object.values(r||{})};vm.createContext(ctx);vm.runInContext(`${v20Source.slice(start,end)};result=alignDistributorHeaders`,ctx);
  assert.deepEqual(Array.from(ctx.result('daya','inventory',['','کد کالا','موجودی'],[['1112001','10']])),['کد کالا','موجودی']);
  assert.deepEqual(Array.from(ctx.result('daya','pharmacy',['','کد کالا'],[['1112001']])),['','کد کالا']);
});

test('Daya real inventory sample maps code, product and quantity to correct cells', () => {
  function extract(name){const start=v20Source.indexOf(`function ${name}(`),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}return v20Source.slice(start,end);}
  const ctx={result:null,norm:v=>String(v||'').replace(/\s+/g,'').toLowerCase()};vm.createContext(ctx);vm.runInContext(`${extract('findDistIndex')};${extract('findDistExact')};${extract('invSchema')};result=invSchema`,ctx);
  const headers=['کالای در راه','موجودی ریالی','موجودی','نام شعبه','شماره بچ','تاریخ انقضا','نام کالا','کد کالا','عنوان','ردیف'];
  const row=['0','34974720','6','تهران غرب','OM5-08404-007','20271106','امگا 5 سافت ژل','1112002','مهر آیین نو طعم','1'];
  const schema=ctx.result(headers,'daya');assert.equal(schema.qty,2);assert.equal(schema.product,6);assert.equal(schema.code,7);assert.equal(row[schema.qty],'6');assert.equal(row[schema.code],'1112002');
});

test('Shafaarad mappings and derived inventory column 10 are permanent', () => {
  function extract(name){const start=v20Source.indexOf(`function ${name}(`),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}return v20Source.slice(start,end);}
  const ctx={result:null,normalizeStoredRow:r=>Array.isArray(r)?r.slice():Object.values(r||{}),snappNumber:v=>Number(v)||0,findDistIndex:()=>-1,norm:v=>String(v||'').replace(/\s+/g,'')};vm.createContext(ctx);vm.runInContext(`${extract('ensureShafaInventoryDerived')};${extract('distSchema')};result={ensureShafaInventoryDerived,distSchema}`,ctx);
  const d={id:'shafaarad',inventoryHeaders:['نام مرکز','کالا','نام کالا','فروش عددی','فروش ریالی','موجودی عددی','موجودی ریالی','تعداد بین راهی','ریال بین راهی'],inventoryRows:[['مرکز','کد','کالا',0,0,12,0,5,0]]};ctx.result.ensureShafaInventoryDerived(d);assert.equal(d.inventoryHeaders[9],'جمع تعداد موجودی');assert.equal(d.inventoryRows[0][9],17);
  const s=ctx.result.distSchema([], 'shafaarad');assert.equal(s.date,6);assert.equal(s.invoice,5);assert.equal(s.qty,7);assert.equal(s.retQty,9);assert.equal(s.pharmacy,3);
  assert.match(v20Source,/1001:1391902001/);assert.match(v20Source,/1005:1391911006/);assert.match(v20Source,/1006:1391911005/);assert.match(v20Source,/shafaDbCode/);
  const c2={result:null,SHAFA_CODE_MAP:{1005:1391911006,1006:1391911005},st:()=>({products:[{code:1001,name:'سافت ژل امگا 3',shafaDbCode:1391902001},{code:1005,name:'سافت ژل امگا وومن',shafaDbCode:1391911006},{code:1006,name:'سافت ژل امگا من',shafaDbCode:1391911005}]}),norm:v=>String(v||'').replace(/\s+/g,'')};vm.createContext(c2);c2.enDigits=v=>String(v);vm.runInContext(`${extract('normalizeDbCode')};${extract('canonicalProduct')};result=canonicalProduct`,c2);assert.equal(c2.result('نام خام','1391911006','shafaarad'),'سافت ژل امگا وومن');assert.equal(c2.result('نام خام','1391911005','shafaarad'),'سافت ژل امگا من');assert.equal(c2.result('نام خام','1.391902001E9','shafaarad'),'سافت ژل امگا 3');
});

test('Daya calculations follow declared quantity, price, gift and return formulas', () => {
  const start=v20Source.indexOf('function calculateDayaAmounts('),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}
  const ctx={result:null};vm.createContext(ctx);vm.runInContext(`${v20Source.slice(start,end)};result=calculateDayaAmounts`,ctx);const x=ctx.result(100,20,10,2,500,700);
  assert.deepEqual(JSON.parse(JSON.stringify(x)),{dist:50000,ph:70000,giftRial:10000,retRial:5000,retGiftRial:1000,giftPct:20,retPct:10,retGiftPct:20});
  assert.match(v20Source,/x\.date=13;x\.invoice=12;x\.code=15;x\.qty=4;x\.giftQty=3;x\.retQty=7;x\.retGiftQty=6;x\.pharmacy=21/);
  assert.match(v20Source,/retGiftPct=m\.retQty\?m\.retGiftQty\/m\.retQty\*100/);
});

test('Daya total counts unique customers and invoices across all products', () => {
  function extract(name){const start=v20Source.indexOf(`function ${name}(`),brace=v20Source.indexOf('{',start);let depth=0,end=brace;for(;end<v20Source.length;end++){if(v20Source[end]==='{')depth++;else if(v20Source[end]==='}'&&--depth===0){end++;break;}}return v20Source.slice(start,end);}
  const ctx={result:null,Object,Number,st:()=>({products:[{name:'A'},{name:'B'}]}),norm:v=>String(v).toLowerCase()};vm.createContext(ctx);vm.runInContext(`${extract('metricRows')};${extract('totalMetricRow')};result={metricRows,totalMetricRow}`,ctx);
  const base=()=>({qty:10,dist:100,ph:120,giftQty:1,giftRial:10,retQty:2,retRial:20,retGiftQty:1,retGiftRial:10,pharmacies:{},invoices:{},invQty:3,invDist:30,invPh:36});
  const a=base(),b=base();a.pharmacies={p1:1,p2:1};b.pharmacies={p1:1,p3:1};a.invoices={f1:1,f2:1};b.invoices={f2:1,f3:1};const rows=ctx.result.metricRows({B:b,A:a}),total=ctx.result.totalMetricRow(rows);
  assert.deepEqual([rows[0][0],rows[1][0]],['A','B']);assert.equal(rows[0][13],2);assert.equal(rows[1][13],2);assert.equal(total[13],3);assert.equal(total[14],3);assert.equal(total[15],100);
});

test('Snapp and distributor imports keep exact-row dedupe guards', () => {
  assert.match(v20Source, /function rowSignature/);
  assert.match(v20Source, /D\.rows=D\.rows\.filter/);
  assert.match(v20Source, /seen\[rowSignature\(r\)\]/);
  assert.match(v20Source, /d\.pharmacyRows=d\.pharmacyRows\.concat\(fresh\)/);
  assert.match(v20Source, /function bindSnappImportButtons/);
  assert.match(v20Source, /try\{bindSnappImportButtons\(\);bindProductCrudV20\(\);bindSafeOrderControls\(\);\}/, 'critical buttons must bind synchronously');
  assert.match(v20Source, /contenteditable='true'/);
  assert.match(v20Source, /arc-save/);
  assert.match(v20Source, /raw-save/);
  assert.match(v20Source, /function reliableFeatureBoot/);
  assert.match(v20Source, /data-no-number-group/);
  assert.match(v20Source, /d\.inventoryRows=data/);
  assert.match(v20Source, /<Worksheet ss:Name=/, 'multi-sheet Excel exporter must remain');
  assert.match(v20Source, /NumberFormat ss:Format=\"#,##0\"/);
  assert.match(v20Source, /PercentText/);
  assert.match(v20Source, /#D1D5DB/);
  assert.match(v20Source, /TotalNumber/);
  assert.match(v20Source, /#DC2626/);
  assert.match(v20Source, /ss:Position=\"Top\"/);
  assert.match(v20Source, /\.data-table thead th\{position:sticky!important/);
  assert.match(v20Source, /function bindAddressFieldGuard/);
  assert.doesNotMatch(v9Source, /کد پستی:/);
  assert.doesNotMatch(v9Source, /String\(data\.display_name\)\.length > compact\.length/);
  assert.match(v20Source, /function bindDomOrderLock/);
  assert.match(v20Source, /CRM_DOM_FIELD_ORDER_LOCK_V1/);
  assert.match(v20Source, /getUnifiedFieldList\(paneId\)/);
  assert.match(v20Source, /tablePharmaciesHeader/);
  assert.match(v20Source, /function bindListOrderObserver/);
  assert.match(v20Source, /function bindSafeOrderControls/);
  assert.match(v20Source, /function safeOrderFields/);
  assert.doesNotMatch(v20Source.slice(v20Source.indexOf('function safeOrderFields'),v20Source.indexOf('function bindSafeOrderControls')),/applyFullFormLayout/);
  assert.match(v20Source, /v20PresetSave/);
  assert.doesNotMatch(v20Source, /v20PresetUser|v20PresetApply/);
  assert.match(v20Source, /permissionLevelTemplates/);
  assert.match(appSource, /userEditId/);
  assert.match(appSource, /btnSaveUserInfo/);
  assert.match(v20Source, /function bindProductCrudV20/);
  assert.match(v20Source, /productCode/);
  assert.match(v20Source, /dayaDbCode=1111000\+code/);
  assert.match(v20Source, /x\.code=15/);
  assert.match(v20Source, /window\.deleteProductCatalogItem=function/);
  assert.match(v20Source, /tab-distributor-database/);
  assert.match(v20Source, /function fixProductInfoLabels/);
  assert.match(v20Source, /distributorFilterGrid\{display:flex!important;flex-flow:row nowrap!important/);
  assert.match(v20Source, /rows\._uniquePharmacies/);
  assert.match(v20Source, /rows\._uniqueInvoices/);
  assert.match(v20Source, /order\[norm\(p\.name\)\]=i/);
  assert.match(v20Source, /function restoreFixedFilterGrids/);
  assert.match(v20Source, /distributorFilterGrid/);
  assert.match(v20Source, /\.data-table th,.data-table td/);
});
