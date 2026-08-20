import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const v9 = read('../public/crm-features-v9.js');
const v11 = read('../public/crm-features-v11.js');
const v20 = read('../public/crm-features-v20.js');
const html = read('../public/index.html');
const data = read('../public/crm-data.js');

function extract(name) {
  const start=v20.indexOf(`function ${name}(`), brace=v20.indexOf('{',start);let depth=0,end=brace;
  for(;end<v20.length;end++){if(v20[end]==='{')depth++;else if(v20[end]==='}'&&--depth===0){end++;break;}}
  return v20.slice(start,end);
}

test('all on-screen and Excel headers follow the sky-blue/black global rule', () => {
  assert.match(v20, /background:#87CEEB!important;color:#000!important/);
  assert.match(v20, /\.tbl-freeze-head th\{background:#87CEEB!important;color:#000!important\}/);
  assert.match(v11, /background:#87CEEB;color:#000;font-weight:bold/);
  assert.match(v20, /ss:Color=\"#000000\"\/><Interior ss:Color=\"#87CEEB\"/);
});

test('header-to-data spacer rows are hidden and table spacing is zero', () => {
  assert.match(v20, /border-collapse:collapse!important;border-spacing:0!important/);
  assert.match(v20, /\.tbl-freeze-xbar,\.tbl-x-row\{display:none!important\}/);
});

test('Excel default blank cells have no border while populated styles remain bordered', () => {
  assert.match(v20, /<Style ss:ID=\"Default\" ss:Name=\"Normal\"><\/Style>/);
  assert.match(v20, /<Style ss:ID=\"Text\">'\+border/);
  assert.doesNotMatch(v20, /ss:Name=\"Normal\">'\+border/);
  assert.match(v11, /var filled = c !== null/);
  assert.match(v11, /filled \? ' style=\"border:1px solid #000\"' : ''/);
  assert.doesNotMatch(v11, /return '<td style=\"border:1px solid #000\">'/);
});

test('number formatting is incremental and does not rescan the entire body per mutation', () => {
  const start=v20.indexOf('function bindNumberFormatting()');
  const end=v20.indexOf('/* ---------- ۲۵)', start);
  const fn=v20.slice(start,end);
  assert.match(fn, /rec\.addedNodes/);
  assert.match(fn, /pending\.splice\(0,80\)/);
  assert.doesNotMatch(fn, /characterData:true/);
  assert.equal((fn.match(/formatVisibleNumbers\(document\.body\)/g)||[]).length, 1);
  assert.doesNotMatch(v20, /_v20product/);
});

test('user saves refresh the active view immediately without coupling GPS saves to global rendering', () => {
  assert.match(v20, /function bindInstantUiRefresh/);
  assert.match(v20, /Date\.now\(\)-lastUserAction<1200/);
  assert.match(v20, /timer=setTimeout\(refreshActiveView,0\)/);
  assert.match(v20, /bindDurableServerState\(\); bindInstantUiRefresh\(\)/);
});

test('corrected Shafaarad map, Daya unknown suppression and dynamic version badge are permanent', () => {
  assert.match(v20, /SHAFA_CODE_MAP=\{1001:1391911001,1002:1391911002,1003:1391911003,1004:1391911004,1005:1391911006,1006:1391911005,1007:1391902006\}/);
  assert.match(v20, /n===norm\("نامشخص"\)\)\)return null/);
  assert.match(v20, /if\(norm\(n\)===norm\("نامشخص"\)\)delete map\[n\]/);
  assert.match(v20, /function runtimeVersion\(\)/);
  assert.match(v20, /b\.textContent = "نسخه " \+ runtimeVersion\(\)/);
  assert.doesNotMatch(v20, /b\.textContent = "نسخه ۱۱\.۲۳\.۰"/);
});

test('invoice-status tab, filters, columns, details and permissions are complete', () => {
  for (const id of ['tab-distributor-invoice-status','invoiceStatusRep','invoiceStatusYear','invoiceStatusMonth','invoiceStatusFrom','invoiceStatusTo','invoiceStatusSearch','invoiceStatusBody']) assert.match(html,new RegExp(`id=["']${id}["']`));
  for (const title of ['نام نماینده علمی','نام داروخانه','نام پخش','تاریخ سفارش','تاریخ فاکتور','اختلاف تاریخ فاکتور (روز)','مشاهده جزئیات','نام ویزیتور']) assert.ok(html.includes(title),`missing ${title}`);
  for (const key of ['dist_invoice_status_access','dist_invoice_status_filters','dist_invoice_status_search','dist_invoice_status_match','dist_invoice_status_date_window','dist_invoice_status_details']) assert.ok(data.includes(key),`missing permission ${key}`);
  assert.match(v20,/for\(var n=day-3;n<=day\+3;n\+\+\)/);
  assert.match(v20,/function invoiceStatusDetailRows/);
  assert.match(v20,/invoiceStatusBaseCache\|\|\(invoiceStatusBaseCache=buildInvoiceStatusMatches\(\)\)/);
  assert.match(v20,/تعداد کالای فاکتور شده/);
  assert.match(v20,/toggle\("tab-distributor-invoice-status",manager\|\|perms\.dist_invoice_status_access===true\)/);
});

test('invoice-status fuzzy name, location and ±3-day matching work on representative fixtures', () => {
  const dates={result:null,enDigits:v=>String(v),normSnappDate:v=>String(v),slashOnlyPersianDate:v=>String(v),window:{CRMJalali:{toGregorian:(y,m,d)=>({gy:y,gm:m,gd:d})}},Date};vm.createContext(dates);vm.runInContext(`${extract('invoiceStatusDate')};${extract('invoiceStatusDay')};result={invoiceStatusDate,invoiceStatusDay}`,dates);assert.equal(dates.result.invoiceStatusDate('08/05/1405'),'1405/05/08');assert.equal(dates.result.invoiceStatusDay('1405/05/08')-dates.result.invoiceStatusDay('1405/05/05'),3);
  const ctx={result:null,norm:v=>String(v||'').replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/‌/g,' ').replace(/[\s\-ـ]+/g,'').trim().toLowerCase(),normalizeStoredRow:r=>r,st:()=>({orders:[]})};
  vm.createContext(ctx);vm.runInContext(`${extract('invoiceStatusNameMatch')};${extract('invoiceStatusPlaceMatch')};result={invoiceStatusNameMatch,invoiceStatusPlaceMatch}`,ctx);
  assert.equal(ctx.result.invoiceStatusNameMatch('داروخانه دکتر عقبایی','عقبایی نژاد'),true);
  assert.equal(ctx.result.invoiceStatusNameMatch('داروخانه عقبایی','داروخانه محمدی'),false);
  assert.equal(ctx.result.invoiceStatusPlaceMatch('تهران','',['استان تهران','شهر تهران','منطقه 6']),true);
  assert.equal(ctx.result.invoiceStatusPlaceMatch('کرج','تهران',['تهران']),false);

  const order={id:'o1',pharmacyName:'عقبایی',province:'تهران',city:'تهران',district:'منطقه 6',orderDate:'1405/05/05',repName:'جواد',items:[]};
  const good={day:103,date:'1405/05/08',pharmacy:'عقبایی نژاد',province:'تهران',city:'تهران',district:'منطقه 6',distName:'دایا دارو',visitor:'ویزیتور الف',rows:[[]]};
  const bad={...good,day:104,date:'1405/05/09'};
  const c2={result:null,st:()=>({orders:[order]}),invoiceStatusDate:v=>v,invoiceStatusDay:()=>100,buildInvoiceStatusGroups:()=>({103:[good],104:[bad]}),invoiceStatusNameMatch:(a,b)=>b.includes(a),invoiceStatusPlaceMatch:(a,b)=>a===b,invoiceStatusDetailRows:()=>[]};vm.createContext(c2);vm.runInContext(`${extract('buildInvoiceStatusMatches')};result=buildInvoiceStatusMatches()`,c2);
  assert.equal(c2.result.length,1);assert.equal(c2.result[0].diff,3);assert.equal(c2.result[0].dist,'دایا دارو');
});

test('invoice detail comparison reports ordered, gifted, invoiced and signed differences', () => {
  const ctx={result:null,norm:v=>String(v||'').replace(/\s+/g,''),snappNumber:v=>Number(v)||0,findKnownCodeInRow:()=>'',canonicalProduct:raw=>raw};vm.createContext(ctx);
  vm.runInContext(`${extract('invoiceStatusDetailRows')};result=invoiceStatusDetailRows({items:[{name:'امگا 3',count:10,giftCount:2}]},{distId:'other',schema:{code:-1,product:0,qty:1,giftQty:2},rows:[['امگا 3',8,1]]})`,ctx);
  assert.equal(ctx.result[0].orderQty,10);assert.equal(ctx.result[0].invoiceQty,8);assert.equal(ctx.result[0].qtyDiff,-2);assert.equal(ctx.result[0].giftDiff,-1);
});

test('GPS quality rule remains stable and full address parts stay Iran-first without postcode', () => {
  assert.match(v9, /samples>=2&&cur\.accuracy<=10/);
  assert.match(v9, /},30000\)/);
  assert.match(v9, /enableHighAccuracy:true,timeout:30000,maximumAge:0/);
  assert.match(v9, /addr\.country \|\| \"ایران\"/);
  assert.match(v9, /addr\.building \|\| addr\.amenity \|\| addr\.shop/);
  assert.doesNotMatch(v9, /addr\.postcode/);
  assert.match(v20, /a\.building\|\|a\.amenity\|\|a\.shop/);
});
