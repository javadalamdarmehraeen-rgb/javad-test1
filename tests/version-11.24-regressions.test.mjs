import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const v9 = read('../public/crm-bundle.js');
const v11 = read('../public/crm-bundle.js');
const v20 = read('../public/crm-bundle.js');
const html = read('../public/index.html');
const data = read('../public/crm-data.js');
const app = read('../public/crm-app.js');
const v19 = read('../public/crm-bundle.js');
const sw = read('../public/sw.js');
const server = read('../server.js');
const gitignore = read('../.gitignore');
const acceptance = read('../AI_ACCEPTANCE_CHECKLIST.md');
const githubHandoff = read('../GITHUB_REVIEW_HANDOFF.md');
const projectGraph = read('../PROJECT_GRAPH.md');
const officialFiles = read('../OFFICIAL_FILELIST.txt');
const readme = read('../README.md');

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
  assert.match(v20,/toggle\("tab-distributor-invoice-status",true\)/);
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

test('same-label dropdown options use one global source for add, rename, delete and new fields', () => {
  for (const fn of ['globalFieldKey','globalOptionState','seedGlobalOptions','applyGlobalOptionKey','globalOptionChange','setupGlobalFieldOptions']) assert.match(v20,new RegExp(`function ${fn}\\(`));
  assert.match(v20,/settings\.globalFieldOptions/);
  assert.match(v20,/globalOptionChange\(storeId,"add"/);
  assert.match(v20,/globalOptionChange\(storeId,"delete"/);
  assert.match(v20,/globalOptionChange\(storeId,"rename"/);
  assert.match(v20,/globalCustomFields\(key\)\.forEach\(function\(f\)\{f\.options=/);
  assert.match(v20,/setupGlobalFieldOptions\(\)/);
  for (const key of ['sys_global_same_label_options','sys_global_option_add','sys_global_option_edit','sys_global_option_delete','sys_global_layout_lock','sys_auto_pwa_control']) assert.ok(data.includes(key),`missing permission ${key}`);
  const ctx={result:null,faLabel:()=>'',norm:v=>String(v||'').replace(/\s+/g,'')};vm.createContext(ctx);vm.runInContext(`${extract('globalFieldKey')};result=globalFieldKey`,ctx);
  assert.equal(ctx.result(null,'نام داروخانه'),'داروخانه');assert.equal(ctx.result(null,'نماینده علمی'),'نمایندهعلمی');assert.equal(ctx.result(null,'سال گزارش'),'سال');assert.equal(ctx.result(null,'ماه'),'ماه');
  const rec={values:[{value:'فروردین',text:'فروردین'}],hidden:[],initialized:true},fields=[{label:'ماه',options:[]},{label:'ماه',options:['قدیمی']}];
  const c2={result:null,globalOptionBusy:false,seedGlobalOptions:()=>rec,globalCustomFields:()=>fields,globalOptionElements:()=>[],norm:v=>String(v||'').replace(/\s+/g,''),mergeGlobalOption:(list,item)=>{if(!list.some(x=>x.value===item.value))list.push(item);}};vm.createContext(c2);vm.runInContext(`${extract('applyGlobalOptionKey')};applyGlobalOptionKey('ماه');result=globalCustomFields('ماه')`,c2);assert.deepEqual(JSON.parse(JSON.stringify(c2.result.map(x=>x.options))),[['فروردین'],['فروردین']]);
  let applied=0,saved=0;const c3={result:null,JSON,norm:v=>String(v||''),$:()=>({}),globalFieldKey:()=> 'ماه',seedGlobalOptions:()=>rec,applyGlobalOptionKey:()=>applied++,save:()=>saved++,mergeGlobalOption:(list,item)=>{if(!list.some(x=>x.value===item.value))list.push(item);}};vm.createContext(c3);vm.runInContext(`${extract('globalOptionChange')};globalOptionChange('month','add','','اردیبهشت');globalOptionChange('month','delete','فروردین','');result=true`,c3);assert.equal(rec.values.some(x=>x.value==='اردیبهشت'),true);assert.equal(rec.hidden.includes('فروردین'),true);assert.equal(applied,2);assert.equal(saved,2);
});

test('layout lock restores only explicit manager snapshots and startup cannot capture or destructively rearrange', () => {
  assert.match(v20,/document\.querySelectorAll\("\.tab-pane \.form-grid"\)/);
  assert.match(v20,/CRM_MANAGER_GRID_ORDER_V2/);
  assert.doesNotMatch(v20,/CRM_DOM_FIELD_ORDER_LOCK_V1/);
  assert.match(v20,/فقط اقدام صریح مدیر snapshot می‌سازد/);
  assert.match(v20,/function wrapAllLegacyLayouts/);
  assert.doesNotMatch(v20,/addEventListener\("beforeunload",captureDomFieldOrder/);
  const bind=v20.slice(v20.indexOf('function bindDomOrderLock'),v20.indexOf('function orderEntityKey'));
  assert.doesNotMatch(bind,/MutationObserver/);
  const mirror=v20.slice(v20.indexOf('function mirrorPharmacyFieldsToOrder'),v20.indexOf('function mergeSameNameFieldInfo'));
  assert.doesNotMatch(mirror,/applyFullFormLayout/);
  const wrapper=v20.slice(v20.indexOf('function wrapFormLayoutMirror'),v20.indexOf('/* ---------- ۱۲)'));
  assert.match(wrapper,/if\(!window\.__CRM_MANAGER_LAYOUT_INTENT\)/);
});

test('invoice tab visibility is reversible and current user resolves by persistent session id', () => {
  assert.match(v20,/if\(pane\)pane\.style\.display=allow\?"":"none"/);
  assert.match(v20,/function v20CurrentUser\(\)/);
  assert.match(v20,/crmUserId/);
  assert.match(v20,/invoiceAllowed=permissionAllowed\(perms,"dist_invoice_status_access",manager\)/);
  assert.doesNotMatch(v11,/hideTab\("tab-distributor-invoice-status", "dist_invoice_status_access"\)/);
  assert.match(v20,/function migrateInvoicePermissionOnce/);
  assert.match(v20,/invoiceStatusPermissionV1130/);
  assert.match(v20,/u\.permissions\.dist_invoice_status_access=true/);
  assert.match(v20,/var pinned=false,allow=permissionAllowed/); /* نوبت ۷۳: درخواست صریح کاربر — تب بی‌مجوز کاملاً مخفی */
  assert.match(v20,/invoiceStatusAccessNotice/);
});

test('permissions page uses exact real tab names without legacy version groups', () => {
  for (const tab of ['داشبورد','داروخانه‌ها','پزشکان','سفارشات','فعالیت لحظه‌ای','نقشه جامع','موقعیت زنده','اسنپ سازمانی','اطلاعات شرکت‌ها','اطلاعات فروش پخش‌ها','وضعیت فاکتور پخش‌ها','دیتابیس پخش‌ها','جستجوی اطلاعات','رصد تردد','شروع/پایان ویزیت','منزل نمایندگان','مرخصی‌ها','اعلان‌ها','گزارش ماهانه','تعریف مسیر نمایندگان','تارگت فروش نمایندگان','تارگت فروش هرپخش','افزودن‌ها','ستون‌ها و کالاها','قیمت‌گذاری کالاها','طراحی دستی تب‌ها','کاربران و دسترسی','پیام‌رسان‌ها','پشتیبان‌گیری','نصب اپ','عیب‌یابی']) assert.match(data,new RegExp(`"${tab}"\\s*:`));
  const finalView=data.slice(data.indexOf('// نمای نهایی و خلوت دسترسی‌ها'));
  assert.doesNotMatch(finalView,/ابزارهای مدیریت \(نسخه/);
});

test('final user editor always has save, exact roles and stable one-dropdown preset UI', () => {
  assert.match(v20,/function bindUserCrudV27/);assert.match(v20,/function saveUserV27/);
  assert.match(v20,/btn\.addEventListener\("click"[\s\S]*saveUserV27\(\)/);
  assert.match(v20,/💾 ذخیره اطلاعات کاربر/);
  assert.match(v20,/<option value='سرپرست'>سرپرست<\/option><option value='نماینده علمی'>نماینده علمی<\/option><option value='کارشناس فروش'>کارشناس فروش<\/option>/);
  assert.match(v20,/v20PresetSave/);assert.doesNotMatch(v20,/id=['"]v20PresetUser|id=['"]v20PresetApply/);
  assert.match(v20,/permissionLevelTemplates\[pid\]=checklistPermissions\(\)/);
  assert.match(v20,/#tab-users-permissions \.permission-tag-chk,#tab-users-permissions \.permission-tag-chk:hover\{transition:none!important;transform:none!important/);
  const state={users:[{id:'u1',fullName:'قدیم',username:'old',password:'1',permissions:{}}]},els={userEditId:{value:'u1'},newFullName:{value:'جدید'},newUsername:{value:'new'},newPassword:{value:'2'},newPhone:{value:'0912'},newRole:{value:'سرپرست'},newSimControl:{value:'بدون بررسی'},formCreateUser:{reset(){}},btnSaveUserInfo:{innerHTML:'',style:{}}};
  const ctx={state,result:null,st:()=>state,$:id=>els[id]||null,checklistPermissions:()=>({ph_access:true}),save:()=>{},syncUsersAuthV27:()=>{},syncRepsFromUsers:()=>{},applyCentralPermissions:()=>{},window:{renderUserCardsList:()=>{},updateNavBadges:()=>{}},v20Toast:()=>{},alert:()=>{}};vm.createContext(ctx);vm.runInContext(`${extract('saveUserV27')};saveUserV27();result=state.users`,ctx);assert.equal(ctx.result.length,1);assert.equal(ctx.result[0].fullName,'جدید');assert.equal(ctx.result[0].role,'سرپرست');assert.equal(ctx.result[0].permissions.ph_access,true);
});

test('central permission engine covers every tab, sub-controls and dynamically rendered nodes', () => {
  for (const id of ['tab-dashboard','tab-pharmacies','tab-doctors','tab-orders','tab-activity-log','tab-overview-map','tab-live-location','tab-snapp-corporate','tab-distributor-companies','tab-distributor-sales','tab-distributor-invoice-status','tab-distributor-database','tab-search-info','tab-rep-routes','tab-my-visit','tab-rep-homes','tab-leaves','tab-notifications','tab-monthly-reports','tab-sales-targets','tab-custom-fields','tab-columns-products','tab-product-pricing','tab-manual-design','tab-users-permissions','tab-messengers','tab-backup','tab-install-app','tab-troubleshooting']) assert.ok(v20.includes(`"${id}"`),`permission map missing ${id}`);
  assert.match(v20,/var FEATURE_PERMISSION_MAP=/);assert.match(v20,/function applyCentralPermissions/);assert.match(v20,/function bindCentralPermissions/);
  assert.match(v20,/window\.applyUserRolePermissions=applyCentralPermissions/);
  assert.match(v20,/new MutationObserver\(function\(records\)[\s\S]*applyCentralPermissions/);
  assert.match(v9,/sessionStorage\.setItem\("crmUserName"/);assert.match(v9,/sessionStorage\.setItem\("crmUsername"/);assert.match(v9,/sessionStorage\.setItem\("crmUserRole"/);
  const store={crmUserId:'u2',crmLoggedIn:'1'},ctx={result:null,sessionStorage:{getItem:k=>store[k]||''},st:()=>({users:[{id:'u1',role:'مدیر'},{id:'u2',role:'نماینده علمی',permissions:{ord_access:false}}]})};vm.createContext(ctx);vm.runInContext(`${extract('v20CurrentUser')};${extract('permissionAllowed')};result={user:v20CurrentUser(),deny:permissionAllowed({ord_access:false},'ord_access',false),manager:permissionAllowed({ord_access:false},'ord_access',true)}`,ctx);assert.equal(ctx.result.user.id,'u2');assert.equal(ctx.result.deny,false);assert.equal(ctx.result.manager,true);
});

test('dropdowns and information overlays always rise above following cards', () => {
  assert.match(v20,/\.tab-pane \.form-group:focus-within\{position:relative!important;z-index:10020!important\}/);
  assert.match(v20,/\.crm-combo-list,\.ph-pick-overlay,\.v20-local-match\{z-index:10040!important/);
  assert.match(v20,/\.tab-pane \.form-grid,\.tab-pane \.form-group,\.tab-pane \.card\{overflow:visible!important\}/);
});

test('gray dependency styling leaves labels unchanged and grays field plus checkbox only', () => {
  assert.match(v20,/\.v20-grey-zone \.form-label\{color:inherit!important;opacity:1!important\}/);
  assert.match(v20,/\.v20-grey-zone input\[type=checkbox\]\{opacity:\.5!important;accent-color:#94a3b8!important/);
  assert.match(v20,/\.v20-grey-zone input:not\(\[type=checkbox\]\),\.v20-grey-zone select/);
});

test('mobile portrait and landscape keep buttons and form/list switch inside viewport', () => {
  assert.match(v20,/@media\(max-width:950px\)/);
  assert.match(v20,/@media\(max-width:950px\) and \(orientation:landscape\)/);
  for(const id of ['btnShowPhForm','btnShowPhList','btnShowDocForm','btnShowDocList','btnShowOrdForm','btnShowOrdList']) assert.ok(v20.includes(`#${id}`),`mobile CSS missing ${id}`);
  assert.match(v20,/flex:1 1 calc\(50% - 6px\)!important/);
  assert.match(v20,/overflow-wrap:anywhere!important/);
});

test('order product names are fixed, totals update live and edit/delete are manager-only', () => {
  assert.match(app,/class=\"form-input order-item-name\" placeholder=\"نام ثابت کالا\"[\s\S]*readonly aria-readonly=\"true\"/);
  assert.doesNotMatch(app,/class=\"form-input order-item-name\" list=/);
  assert.match(app,/inp\.removeAttribute\(\"list\"\)/);assert.match(app,/inp\.readOnly = true/);
  assert.match(v20,/function bindOrderItemRuntime/);assert.match(v20,/\.order-item-count,\.order-item-gift,\.order-item-price/);
  assert.match(v20,/updateOrderTotalAmountDisplay/);assert.match(v20,/function applyOrderItemRoleControls/);
  assert.match(v20,/edit\.style\.setProperty\(\"display\",manager\?\"\":\"none\"/);
  assert.match(v20,/del\.style\.setProperty\(\"display\",manager\?\"\":\"none\"/);
  assert.match(v20,/total\.style\.setProperty\(\"visibility\",\"visible\",\"important\"\)/);
});

test('activity, leave, route, home, monthly and target renderers enforce representative ownership', () => {
  assert.match(v20,/function privacyList/);assert.match(v20,/function bindPrivacyRenderers/);assert.match(v20,/activeNames\[norm\(x\.fullName\)\]=1/);
  for(const pair of [['leaves','hr_all_leaves'],['repRoutes','fld_all_routes'],['repHomes','fld_all_homes'],['salesTargets','target_all_reps']]) assert.ok(v20.includes(`\"${pair[0]}\",\"${pair[1]}\"`),`missing privacy wrapper ${pair}`);
  assert.match(v20,/function visibleActivityRowsV36/);assert.match(v20,/function renderActivityLogV36/);
  assert.match(v20,/window\.renderActivityLogTable=renderActivityLogV36/);
  assert.match(v20,/if\(manager\)return rows\.slice\(\)/);
  assert.match(v20,/S\.activityLog=visibleActivityRowsV36\(\)/);
  assert.match(v20,/renderMonthlyReportsTable=function/);assert.match(v20,/privacyList\(reps,\"rep_all_reports\"\)/);
  assert.match(v20,/privacyList\(\(\(st\(\)&&st\(\)\.repRoutes\)\|\|\[\]\),\"fld_all_routes\"\)/);
  assert.match(v20,/privacyList\(\(S\.salesTargets\|\|\[\]\),\"target_all_reps\"\)/);
});

test('navigation links request real driving directions and universal installed-app opening', () => {
  assert.match(app,/https:\/\/nshn\.ir\/maps\?destination=\$\{lat\},\$\{lng\}&type=drive/);
  assert.match(app,/https:\/\/balad\.ir\/directions\/driving\?destination=\$\{lng\}%2C\$\{lat\}/);
  assert.match(app,/google\.com\/maps\/dir\/\?api=1&destination=\$\{lat\},\$\{lng\}.*dir_action=navigate/);
  assert.match(app,/waze\.com\/ul\?ll=\$\{lat\},\$\{lng\}&navigate=yes/);
  assert.match(app,/window\.location\.assign\(urls\[provider\]\)/);
  assert.match(app,/package=org\.rajman\.neshan\.traffic\.tehran\.navigator/);
  assert.match(app,/package=ir\.balad/);
  assert.doesNotMatch(app,/neshan\.org\/maps\/@/);
});

test('scientific representative data is strictly owner-scoped unless all-reps permission is true', () => {
  assert.match(v9,/function currentSessionUserV9/);assert.match(v9,/function ownedByCurrent/);assert.match(v9,/function canSeeAll/);
  assert.match(v9,/canSeeAll\("ph_all_reps"\)\?list:list\.filter\(ownedByCurrent\)/);
  assert.match(v9,/canSeeAll\("doc_all_reps"\)\?list:list\.filter\(ownedByCurrent\)/);
  assert.match(v9,/canSeeAll\("ord_all_reps"\)\?list:list\.filter\(ownedByCurrent\)/);
  assert.doesNotMatch(v9,/return !p\.repName \|\| p\.repName === currentRepName\(\)/);
  assert.match(v9,/repId: currentRepId\(\)/);assert.match(v9,/repId: userIdForRep/);
  assert.match(v20,/function syncRepsFromUsers/);assert.match(v20,/S\.users\|\|\[\]/);assert.match(v20,/S\.reps=reps/);
  assert.match(v20,/function syncRepresentativeSelectors/);assert.match(v20,/reps\.filter\(function\(r\)\{return u&&String\(r\.id\)===String\(u\.id\)/);
  for(const id of ['newActivityProvince','newActivityCity','newActivityDistricts']) assert.ok(!html.includes(`id="${id}"`),`legacy user-form route field remains ${id}`);
  for(const id of ['representativeRoutesCard','routeManagerRep','routeManagerProvince','routeManagerCity','routeManagerDistrict','btnSaveRepresentativeRoute']) assert.ok(html.includes(`id="${id}"`),`missing target route manager ${id}`);
  assert.match(app,/user\.activityRouteLabel/);
  assert.match(v20,/window\.deleteUserCard=function/);assert.match(v20,/syncRepsFromUsers\(\);syncRepresentativeSelectors\(\)/);
});

test('empty new origin safely bootstraps shared state and bulk data without overwriting existing local state', () => {
  assert.match(v20,/function bootstrapEmptyOriginFromServer/);assert.match(v20,/همیشه از سرور بکش و ادغام کن/);
  assert.match(v20,/__v65=/);assert.match(v20,/localStorage\.setItem\("CRM_APP_STATE_V2"/);
  assert.match(v20,/function bindOriginSaveGate/);assert.match(v20,/fetch\("\/api\/bulk"/);assert.match(v20,/fetchServerBulk/);
  assert.match(server,/USER_BULK_PATH/);assert.match(server,/pathname === "\/api\/bulk" && req\.method === "GET"/);assert.match(server,/64 \* 1024 \* 1024/);
  assert.match(gitignore,/user-bulk-data\.json/);
});

test('distributor Excel writes Persian month name while keeping all digits Latin', () => {
  const ctx={result:null,enDigits:v=>String(v),distFilter:()=>({mode:'month',year:'1405',month:'05'})};vm.createContext(ctx);vm.runInContext(`${extract('jalaliMonthName')};${extract('periodRows')};result=periodRows()`,ctx);assert.deepEqual(JSON.parse(JSON.stringify(ctx.result)),[['سال','1405'],['ماه','مرداد']]);
  assert.match(v20,/installLatinNumberLaw\(\);installSafeBrowserGuards\(\);bindOriginSaveGate\(\);bindManagerLayoutIntent/);
  assert.match(v20,/Date\.prototype\[name\]=function\(\)/);
});

test('target tab has multi-route manager and fixed product target planner with calculated reports', () => {
  for(const id of ['representativeRoutesCard','routeManagerRep','routeManagerProvince','routeManagerCity','routeManagerDistrict','btnSaveRepresentativeRoute']) assert.ok(html.includes(`id="${id}"`));
  for(const fn of ['setupRepresentativeRoutes','routeGeoValues','setupTargetPlannerV34','paintTargetPlanRows','renderTargetReportsV34','targetReportTable']) assert.match(v20,new RegExp(`function ${fn}\\(`));
  assert.match(v20,/bindTargetsV20\(\); setupRepresentativeRoutes\(\); setupTargetPlannerV34\(\)/);
  assert.match(v20,/tab-define-routes[\s\S]{0,320}setupRepresentativeRoutes\(/);
  assert.match(v20,/activityProvinces=routeSelected/);assert.match(v20,/activityCities=routeSelected/);assert.match(v20,/activityDistrictList=routeSelected/);
  assert.match(v20,/n\*dp/);assert.match(v20,/n\*hp/);assert.match(v20,/محقق‌شده/);assert.match(v20,/مانده تارگت/);
  assert.match(v20,/جمع همه تارگت نمایندگان به تفکیک کالا/);assert.match(v20,/تارگت‌های /);
  assert.match(v20,/v34TargetGrandDist/);assert.match(v20,/v34TargetGrandPh/);
});

test('order reset preserves field settings, placed notice stays hidden, and technical ids never become labels', () => {
  for(const fn of ['hidePlacedOrderNotices','captureOrderFormSequence','restoreOrderFormSequence','captureOrderLayoutSettings','restoreOrderLayoutSettings','bindOrderFormPositionLock']) assert.match(v20,new RegExp(`function ${fn}\\(`));
  assert.match(v20,/setTimeout\(hidePlacedOrderNotices,120\)/);
  assert.match(v20,/style\.getPropertyPriority\("display"\)!=="important"/);
  assert.match(v20,/reset\.addEventListener\("click",protectReset,true\)/);
  assert.match(v20,/restoreOrderLayoutSettings\(settings\);restoreDomFieldOrder\(\);restoreOrderFormSequence\(seq\)/);
  assert.match(v11,/var directLab/);assert.match(v11,/شناسه فنی هرگز نباید/);
  assert.match(v11,/leaveRepSelect: "نماینده علمی"/);
  assert.match(v11,/String\(meta\[b\.id\]\.label\)\.trim\(\) !== b\.id/);
});

test('v37 keeps existing data while fixing picker, homes, deletion, times, recipient and dropdown arrows', () => {
  assert.match(app,/if \(saved\)[\s\S]*state = JSON\.parse\(saved\)/);
  assert.match(app,/state\._freshInstallClean = true/);
  assert.match(app,/state\.users = \(state\.users \|\| \[\]\)\.filter/);
  for(const fn of ['enforceDeletedUserTombstonesV37','installPersianBuiltinLabelGuardV37','pinRepresentativeRouteFieldsV37','setupPlainRecipientV37','bindComboCaretFixV37','bindOrderPharmacyCardV37','visibleRepHomesV37','paintRepHomesMapV37','renderRepHomesV37']) assert.match(v20,new RegExp(`function ${fn}\\(`));
  assert.match(v20,/deletedUserTombstones/);assert.match(v20,/settings\.deletedUserTombstones\.push/);
  assert.match(v20,/id:"u-2",username:"Taheri",fullName:"جواد علمدار"/);assert.match(v20,/id:"u-3",username:"nila",fullName:"خانم نیلا محرمی"/);
  assert.match(v20,/#orderPharmacyPickBox \.ph-pick-card/);assert.match(v20,/selectOrderPharmacyCardV37\(card\)/);
  assert.match(v20,/window\.renderRepHomesTable=renderRepHomesV37/);assert.match(v20,/layer instanceof L\.TileLayer/);
  assert.match(html,/id="leaveFromTime"/);assert.match(html,/id="leaveToTime"/);assert.match(app,/fromTime,/);assert.match(app,/toTime,/);
  assert.match(html,/id="msgRecipientSelect"[^>]*data-nocombo="1"/);assert.doesNotMatch(html,/option value="جواد علمدار"/);
  assert.match(v20,/\.crm-combo-caret\{z-index:5!important;pointer-events:auto!important/);
  assert.match(v20,/e\.target\.closest\("\.crm-combo-caret"\)/);
});

test('leave markup, home edit/delete and protected reference fields follow final rules', () => {
  assert.doesNotMatch(html,/10px; border: 1px solid var\(--border-color\); margin-bottom: 1\.5rem;"&gt;/);
  assert.match(html,/id="formLeaveRequest"/);
  assert.match(app,/onclick="editRepHome\('\$\{hm\.id\}'\)"/);assert.match(app,/onclick="deleteRepHome\('\$\{hm\.id\}'\)"/);
  assert.match(app,/function editRepHome/);assert.match(app,/function deleteRepHome/);
  assert.match(v19,/Province\|City\|District\|Region\|Year\|Month\|Rep\|Representative\|PharmacyName/);
  assert.match(v19,/نماینده علمی\|سال\|ماه\|استان\|شهر\|منطقه\|نام داروخانه/);
  assert.match(v20,/function bindPlacedPharmacyNoticeGuard/);assert.match(v20,/dataset\.v20PlacedName/);
  assert.match(v20,/style\.setProperty\("display","none","important"\)/);
});

test('multi-part prompts require a real acceptance checklist before ZIP delivery', () => {
  assert.match(acceptance,/پیام کاربر به بندهای مستقل شکسته شود/);
  assert.match(acceptance,/توضیح متنی بدون تغییر کد «انجام‌شده» نیست/);
  assert.match(acceptance,/runtime check/);
  assert.match(acceptance,/نسخه 11\.35\.0/);
});

test('next-chat GitHub handoff records exact publish truth and engine map', () => {
  assert.match(githubHandoff,/نسخه آماده سورس:[\s\S]*11\.97.0/);
  assert.match(githubHandoff,/4984d17/);assert.match(githubHandoff,/Resource not accessible by integration/);
  assert.match(githubHandoff,/Production[\s\S]*11\.20\.0/);
  assert.match(githubHandoff,/موتور پاک‌سازی خودکار کش/);assert.match(githubHandoff,/موتورهای پایداری داده/);
  assert.match(githubHandoff,/Source tested: yes\/no/);assert.match(githubHandoff,/Production health version/);
  assert.match(projectGraph,/گراف عملیاتی انتشار و اسناد تحویل/);assert.match(projectGraph,/گراف موتور نجات کش 11\.38/);
  assert.match(officialFiles,/^GITHUB_REVIEW_HANDOFF\.md$/m);
  assert.match(readme,/GITHUB_REVIEW_HANDOFF\.md/);assert.match(readme,/runtime فعلی برنامه Node خالص/);
});

test('notifications enforce public-recipient permission, replies and persistent thread history', () => {
  for(const fn of ['syncNotificationRecipients','setupNotificationCenterV35','renderNotificationsV35','replyNotificationV35','showNotificationThreadV35','sendPushForNotification','enableDeviceNotifications']) assert.match(v20,new RegExp(`function ${fn}\\(`));
  assert.match(v20,/perms\.notify_all_users===true/);
  assert.match(v20,/threadId:parent\.threadId\|\|parent\.id/);
  assert.match(v20,/parentId:parent\.id/);
  assert.match(v20,/تاریخچه پیام/);
  assert.match(v20,/btnEnableDeviceNotifications/);
  assert.match(data,/notify_reply/);assert.match(data,/notify_device_push/);
});

test('Web Push works through persisted VAPID/subscriptions and service-worker background notifications', () => {
  for(const fn of ['getVapidKeys','encryptWebPush','vapidAuthorization','sendWebPush']) assert.match(server,new RegExp(`function ${fn}\\(`));
  assert.match(server,/\/api\/push\/public-key/);assert.match(server,/\/api\/push\/subscribe/);assert.match(server,/\/api\/push\/send/);
  assert.match(server,/Content-Encoding":"aes128gcm/);assert.match(server,/Urgency:"high"/);
  assert.match(sw,/addEventListener\("push"/);assert.match(sw,/showNotification/);assert.match(sw,/vibrate:\s*\[220,\s*100,\s*220,\s*100,\s*320\]/);assert.match(sw,/notificationclick/);
  assert.match(gitignore,/push-subscriptions\.json/);assert.match(gitignore,/push-vapid\.json/);
});

test('placed pharmacy notice guard is loop-safe and home representative stays reference-protected', () => {
  assert.match(v20,/getPropertyValue\("display"\)!=="none"/);
  assert.match(v20,/getPropertyPriority\("display"\)!=="important"/);
  assert.match(v20,/bindPlacedPharmacyNoticeGuard/);
  assert.match(v19,/PharmacyName/);assert.match(v19,/نماینده علمی/);
  assert.match(v20,/v35-fixed-rep/);assert.match(v20,/sel\.disabled=!allowAll/);
});

test('new build clears only old asset caches before revealing app and prevents manager-screen flash', () => {
  assert.match(html,/var BUILD="[\d.]+"[\s\S]*?key="CRM_ASSET_BUILD"/);
  assert.match(html,/document\.documentElement\.classList\.add\("crm-booting"\)/);
  assert.match(html,/\/cache-reset\?to=/);
  assert.match(server,/caches\.keys\(\)/);
  assert.match(server,/navigator\.serviceWorker\.getRegistrations\(\)/);
  assert.match(v20,/document\.documentElement\.classList\.remove\("crm-booting"\)/);
  assert.match(server,/no-store, no-cache, must-revalidate, max-age=0/);
  assert.match(server,/CDN-Cache-Control/);
  assert.match(sw,/cache: "no-store"/);
  assert.match(sw,/purgeOldCaches/);
});

test('v38 cache rescue automatically forces a fresh build without deleting CRM data', () => {
  const login = read('../public/login.html');
  assert.match(server,/pathname === "\/cache-reset"/);assert.match(server,/Clear-Site-Data/);
  assert.match(server,/"X-CRM-Build": APP_VERSION/);assert.match(server,/const APP_VERSION = "11\.97.0"/);
  assert.match(html,/\/api\/health\?__crm_nocache=/);assert.match(html,/\/cache-reset\?to=/);assert.match(html,/d\.version!==BUILD/);
  assert.match(login,/CRM_CACHE_RESCUED_/);assert.match(login,/\/cache-reset\?to=/);
  assert.match(sw,/function purgeEveryCache/);assert.match(sw,/CRM_BUILD_ACTIVE/);assert.match(sw,/cache: "reload"/);
  assert.match(sw,/request\.mode === "navigate"/);assert.doesNotMatch(sw,/caches\.match\(request\)[\s\S]{0,80}navigate/);
  for(const source of [server,html,login,sw,app]) {
    assert.doesNotMatch(source,/localStorage\.clear\s*\(/);
    assert.doesNotMatch(source,/indexedDB\.deleteDatabase\s*\(/);
    assert.doesNotMatch(source,/removeItem\(["']CRM_APP_STATE_V2/);
  }
  assert.match(app,/CRM_BUILD_ACTIVE/);assert.match(app,/register\('\/sw\.js\?v=11\.97.0'/);
});

test('security hardening blocks dangerous device APIs, cross-origin writes, executables and formula injection', () => {
  assert.match(server,/Content-Security-Policy/);assert.match(server,/object-src 'none'/);assert.match(server,/Permissions-Policy/);
  for(const denied of ['camera=()','microphone=()','usb=()','serial=()','hid=()','bluetooth=()','payment=()']) assert.ok(server.includes(denied),`missing ${denied}`);
  assert.doesNotMatch(server,/Access-Control-Allow-Origin.*\*/);
  assert.match(server,/function trustedWriteRequest/);assert.match(server,/x-crm-request/);assert.match(server,/untrusted write request/);
  assert.match(server,/function sanitizeJsonValue/);assert.match(server,/__proto__/);assert.match(server,/function writeJsonAtomic/);assert.match(server,/mode: 0o600/);
  assert.match(v20,/function installSafeBrowserGuards/);assert.match(v20,/exe\|msi\|apk\|bat\|cmd/);assert.match(v20,/32\*1024\*1024/);assert.match(v20,/javascript\|data\|file\|vbscript/);
  assert.match(v20,/noopener,noreferrer/);assert.match(v20,/function renderSecurityStatus/);
  assert.match(v11,/\^\[=\+@\]/);
});

test('PWA activation is automatic and diagnostics never request manual refresh', () => {
  assert.match(app,/register\('\/sw\.js\?v=11\.97.0', \{ scope: '\/', updateViaCache: 'none' \}\)/);
  assert.match(app,/navigator\.serviceWorker\.ready/);
  assert.match(app,/postMessage\('skipWaiting'\)/);
  assert.match(sw,/self\.clients\.claim\(\)/);
  assert.match(sw,/event\.data === "skipWaiting"/);
  assert.doesNotMatch(v19,/یک‌بار صفحه را تازه‌سازی کنید/);
  assert.match(v19,/نیازی به تازه‌سازی دستی نیست/);
});

test('GPS quality rule remains stable and full address parts stay Iran-first without postcode', () => {
  assert.match(v9, /if\(cur\.accuracy<=10\)finish\(cur\)/);
  assert.match(v9, /addressPromise=geoReverse/);
  assert.match(v9, /},15000\)/);
  assert.match(v9, /enableHighAccuracy:true,timeout:15000,maximumAge:0/);
  assert.match(v9, /addr\.country \|\| \"ایران\"/);
  assert.match(v9, /addr\.building \|\| addr\.amenity \|\| addr\.shop/);
  assert.doesNotMatch(v9, /addr\.postcode/);
  assert.match(v20, /a\.building\|\|a\.amenity\|\|a\.shop/);
});

test('v11.39 orders form canonical order (date first), one-time reset and dynamic endpoints', () => {
  const html = read('../public/index.html');
  const v20 = read('../public/crm-bundle.js');
  const data = read('../public/crm-data.js');
  const app = read('../public/crm-app.js');
  const form = html.slice(html.indexOf('id="formOrder"'), html.indexOf('</form>', html.indexOf('id="formOrder"')));
  const ids = [...form.matchAll(/id="(order[A-Za-z]+)"/g)].map(m => m[1]);
  const vis = ids.filter(i => !['orderEditId','orderPharmacyMatchedId','orderPharmacyPickBox'].includes(i));
  assert.ok(vis.indexOf('orderDate') === 0, 'orderDate must be first in orders form');
  assert.ok(vis.indexOf('orderPharmacyName') === 1 && vis.indexOf('orderProvince') === 2 && vis.indexOf('orderCity') === 3 && vis.indexOf('orderDistrict') === 4, 'date then pharmacy/province/city/district');
  assert.match(v20, /function v39OrdersCanonicalReset\(/);
  assert.match(v20, /CRM_V39_ORDER_CANONICAL_RESET/);
  assert.match(v20, /v39OrdersCanonicalReset\(\);/);
  assert.ok(data.includes('apiEndpointUrl: ((typeof location!=="undefined"&&location.origin)?location.origin:"")+"/api/state"'), 'dynamic apiEndpointUrl');
  assert.match(app, /location\.host \|\| "همین سرویس"/);
});

test('v11.40 removed identities, role-aware recipients, pharmacy pick feedback and reference instant-add guard', () => {
  const v20 = read('../public/crm-bundle.js');
  const html = read('../public/index.html');
  // A) permanently removed identities + projection in every list
  assert.match(v20, /function permanentlyRemovedNamesV40\(/);
  assert.match(v20, /نام واقعی افراد هرگز حذف نمی\u200cشود| فقط تطابق دقیق شناسه نمونه قدیمی /);
  assert.match(v20, /function enforceRemovedIdentitiesV40\(/);
  assert.match(v20, /function dropRemovedUserRowsV40\(/);
  
  assert.match(v20, /dropRemovedUserRowsV40\(privacyList\(reps,"rep_all_reports"\)\)/);
  assert.match(v20, /enforceRemovedIdentitiesV40\(\);/);
  // B) role-aware recipients: rep sees only manager/supervisor/sales-expert
  assert.match(v20, /users=users\.filter\(function\(x\)\{var role=String\(x\.role\|\|""\);return \/سرپرست\|کارشناس فروش\/\.test\(role\)\|\|\(\/\^مدیر\/\.test\(role\)&&!\/نماینده\/\.test\(role\)\);\}\)/);
  // C) pharmacy pick: mousedown+pointerdown+click with dedupe and feedback toasts
  assert.match(v20, /__v40LastPick/);
  assert.match(v20, /جایگذاری شد/); assert.match(v20, /پیدا نشد؛ نام را دستی تکمیل کنید/);
  // D) reference instant-add guard for rep/year/month/geo/pharmacy fields
  assert.match(v20, /function installReferenceInstantAddGuardV40\(/);
  assert.match(v20, /installReferenceInstantAddGuardV40\(\);/);
  assert.match(v20, /نماینده\|سال\|ماه\|استان\|شهر\|منطقه\|داروخانه/);
  // route manager box still present (turn-67 item 2)
  assert.match(v20, /representativeRoutesCard/); assert.match(v20, /btnSaveRepresentativeRoute/);
});
test('v11.42 user-report fixes: pharmacy fields, dup guard, role law, notifications plain', () => {
  const v20 = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const html = read('../public/index.html');
  assert.match(html,/id="pharmacyType"[\s\S]*?شبانه‌روزی[\s\S]*?نیمه‌وقت/);
  assert.match(html,/id="pharmacyPlate"/); assert.match(html,/id="pharmacyFloor"/);
  assert.match(html,/id="msgRecipientSelect" data-nocombo="1"/);
  assert.match(app,/managerPhone, phType, phPlate, phFloor/);
  assert.match(app,/\$\{ph\.managerPhone \|\| ph\.phone \|\| "-"\}/);
  assert.match(app,/شماره همراه مسئول سفارش/);
  assert.match(v20,/function v42ConfirmDupGuard\(/);
  assert.match(v20,/ثبت تکراری مجاز نیست/);
  assert.match(v20,/function v42ClearOnLeave\(/);
  assert.match(v20,/سرپرست\|کارشناس فروش\/\.test\(String\(u&&u\.role\|\|""\)\)\|\|perms\[keyById\[sel\.id\]\]===true/);
  assert.match(v20,/distributorFilterGrid\{display:flex/);
});

test('v11.43 changelog is a main tab + diagnosis engine + error collector', () => {
  const app = read('../public/crm-app.js'); const html = read('../public/index.html'); const v20 = read('../public/crm-bundle.js');
  assert.match(app,/tab-changelog/); assert.match(html,/id="tab-changelog"/);
  assert.match(html,/window\.__CRM_ERRS/); assert.match(v20,/function runApplyDiagnosisV43\(/);
});

test('v11.43.1 engine button feedback + permanent version watchdog', () => {
  const v20 = read('../public/crm-bundle.js');
  assert.match(v20,/btnD.disabled=true/);
  assert.match(v20,/موتور تشخیص تمام شد/);
  assert.match(v20,/function installVersionWatchdog\(/);
  assert.match(v20,/setInterval\(versionWatchdogTick,180000\)/);
  assert.match(v20,/visibilitychange/);
});

test('v11.61.0 safe cache-hardening', () => {
  const html = read('../public/index.html'); const app = read('../public/crm-app.js');
  assert.match(html,/http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/);
  assert.match(app,/CRM_APP_VERSION = "11.97.0"/);
  assert.match(app,/بارگذاری شد/);
});

test('layout refreshes preserve field DOM order unless manager explicitly edits the designer', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/Only an explicit interaction with the manager designer/);
  assert.match(b,/if \(window\.__CRM_MANAGER_LAYOUT_INTENT === true\)/);
});

test('v11.45 pharmacies/doctors/orders tab batch', () => {
  const html = read('../public/index.html'); const app = read('../public/crm-app.js'); const b = read('../public/crm-bundle.js');
  assert.match(html,/id="orderPriority"[\s\S]*?عادی[\s\S]*?فوری/);
  assert.match(html,/id="docPlate"/); assert.match(html,/id="docFloor"/);
  assert.match(app,/docPlate, docFloor/); assert.match(app,/priority/);
  assert.match(b,/ph.managerPhone \|\| ph.phone/);
  assert.match(b,/این پزشک قبلاً ثبت شده است/);
});

test('v11.46 batch: password toggle + visit end-time', () => {
  const html = read('../public/index.html'); const login = read('../public/login.html'); const b = read('../public/crm-bundle.js');
  assert.match(html,/visitEndTimeBox/);
  assert.match(html,/dblclick/);
  assert.match(login,/dblclick/);
  assert.match(b,/btnEndVisit/);
});

test('v11.47 rep home plate/floor', () => {
  const html = read('../public/index.html'); const b = read('../public/crm-bundle.js');
  assert.match(html,/id="repHomePlate"/); assert.match(html,/id="repHomeFloor"/);
  assert.match(b,/v46home/);
});

test('v11.48 top pick box with انتخاب buttons', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v48TopPickBox/);
  assert.match(b,/v48pick/);
  assert.match(b,/انتخاب — /);
});

test('v11.49 grey disabled order info fields', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v49GreyOrderFields/);
  assert.match(b,/orderPriority/);
  assert.match(b,/این فیلد با انتخاب داروخانه خودکار پر می‌شود/);
});

test('v11.50 activity auto refresh + statuses', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v50ActivityAutoRefresh/);
  assert.match(b,/setInterval\(v50ActivityAutoRefresh,30000\)/);
});

test('v11.51 route labels beside rep names', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v51RouteLabels/);
  assert.match(b,/representativeRoutes/);
});

test('v11.52 hospital search in search-info tab', () => {
  const app = read('../public/crm-app.js');
  assert.match(app,/جستجو در بیمارستان‌ها و درمانگاه‌ها/);
  assert.match(app,/entityType: "hospital"/);
  assert.match(app,/qHosp/);
});

test('v11.53 activity tab filters + map height', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v53ActivityFilters/);
  assert.match(b,/v53fRepOn/);
  assert.match(b,/v53fMonthOn/);
  assert.match(b,/v53MapFix/);
  assert.match(b,/minHeight="360px"/);
});

test('v11.54 overview map checkboxes + file imports', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v54OverviewBar/);
  assert.match(b,/ورودی فایل داروخانه‌ها/);
  assert.match(b,/ورودی فایل درمانگاه‌ها/);
  assert.match(b,/v54import/);
});

test('v11.55 routes stops/durations + date filters', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v55RoutesEnhance/);
  assert.match(b,/توقف‌ها و مدت هر توقف/);
  assert.match(b,/v55RouteFilters/);
  assert.match(b,/v55fMonthOn/);
});

test('v11.56 province/city filtered by user routes', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v56routeGeoFilter/);
  assert.match(b,/representativeRoutes/);
  assert.match(b,/populateProvinces/);
});

test('v11.57 offline sync engine + red unvisited markers', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v57OfflineSync/);
  assert.match(b,/window.addEventListener\("online"/);
  assert.match(b,/"#dc2626"/);
  assert.match(b,/🔴 /);
});

test('v11.58 snapp filter fields free of combo overlay', () => {
  const html = read('../public/index.html'); const b = read('../public/crm-bundle.js');
  assert.match(html,/id="snappFilterYear" data-nocombo="1"/);
  assert.match(html,/id="snappTopupMonth" data-nocombo="1"/);
  assert.match(b,/v58UnwrapSnappCombos/);
});

test('v11.59 cross-device sync + hide field + clear fix + same-name picks', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/v60CrossDeviceSync/);
  assert.match(b,/v60UnionById/);
  assert.match(b,/v60HideField/);
  assert.match(b,/v60RealClear/);
  assert.match(b,/داروخانه هم‌نام/);
});

test('v11.60 route labels read from user record + geo fallback', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b,/u\.activityProvinces&&u\.activityProvinces\.length/);
  assert.match(b,/v60RouteGeoFallback/);
  assert.match(b,/IRAN_GEO_DATA/);
});

test('v11.61.0 mutation-loop guards: idempotent reorder/restore, structural position-lock, quiet permissions', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b, /cells\[i\] !== cells\[finalOrder\[i\]\]/);
  assert.match(b, /currentIds\.every\(function\(id,ix\)\{return id===desiredIds\[ix\];\}\)/);
  assert.match(b, /setTimeout\(function\(\)\{busy=false;\},120\)/);
  assert.match(b, /closest\("\.crm-combo-list"\)/);
  assert.match(b, /el\.dataset\.v49grey/);
  const v20file = read('../public/crm-features-v20.js');
  assert.match(v20file, /cells\[i\] !== cells\[finalOrder\[i\]\]/);
  assert.match(v20file, /setTimeout\(function\(\)\{busy=false;\},120\)/);
});

test('v11.62.0 simple name fields + instant-add only on pharmacy/doctor tabs + plate/floor outside percent box', () => {
  const html = read('../public/index.html');
  const b = read('../public/crm-bundle.js');
  assert.match(html, /id="pharmacyName"[^>]*data-simple-name="1"/);
  assert.match(html, /id="doctorName"[^>]*data-simple-name="1"/);
  assert.match(html, /id="pharmacyPercentBox"/);
  assert.match(html, /id="doctorPercentBox"/);
  const phAddr = html.indexOf('id="pharmacyAddress"');
  const phPlate = html.indexOf('id="pharmacyPlate"');
  const phBox = html.indexOf('id="pharmacyPercentBox"');
  assert.ok(phAddr > 0 && phPlate > phAddr && phBox > phPlate, 'pharmacy plate/floor must sit after address and before percent box');
  const docAddr = html.indexOf('id="doctorAddress"');
  const docPlate = html.indexOf('id="docPlate"');
  const docBox = html.indexOf('id="doctorPercentBox"');
  assert.ok(docAddr > 0 && docPlate > docAddr && docBox > docPlate, 'doctor plate/floor must sit after address and before percent box');
  assert.doesNotMatch(html.slice(phBox, html.indexOf('id="phFileInput"')), /pharmacyPlate/);
  assert.match(b, /v11\.62\.0: افزودن لحظه‌ای فقط در تب داروخانه‌ها و پزشکان/);
  assert.match(b, /#tab-pharmacies, #tab-doctors/);
  assert.match(b, /function v62simpleNames/);
  assert.match(b, /function v62movePlateFloor/);
  assert.match(b, /data-simple-name/);
});

test('v11.63.0 simple names no subset + no text instant-add + doctor 3-col grid + order pharmacy list', () => {
  const html = read('../public/index.html');
  const css = read('../public/style.css');
  const b = read('../public/crm-bundle.js');
  assert.match(html, /id="pharmacyName"[^>]*data-simple-name="1"/);
  assert.match(html, /id="doctorName"[^>]*data-simple-name="1"/);
  assert.match(css, /#formDoctor > \.form-grid/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(b, /function v63simpleNames/);
  assert.match(b, /function v63unwrapInstant/);
  assert.match(b, /function v63doctorGrid/);
  assert.match(b, /function v63paintOrderPharmacies/);
  assert.match(b, /if \(inp\.tagName === "INPUT" \|\| inp\.tagName === "TEXTAREA"\) return true;/);
  assert.match(b, /window\.fillPharmacyFromRec = fillPharmacyFromRec/);
});

test('v11.64.0 lock layout + no name datalist + live order pharmacy search', () => {
  const b = read('../public/crm-bundle.js');
  assert.match(b, /function v64stripNameLists/);
  assert.match(b, /function v64paintOrderSearch/);
  assert.match(b, /existingPharmacyMatchList/);
  assert.match(b, /__CRM_MANAGER_LAYOUT_INTENT !== true/);
});

test('v11.65.0 unified server state + order has pharmacy fields', () => {
  const html = read('../public/index.html');
  const srv = read('../server.js');
  const b = read('../public/crm-bundle.js');
  assert.match(html, /id="orderPharmacyPhone"/);
  assert.match(html, /id="orderManager"/);
  assert.match(html, /id="orderManagerPhone"/);
  assert.match(html, /id="orderPlate"/);
  assert.match(html, /id="orderFloor"/);
  assert.match(html, /id="orderIsPercentage"/);
  assert.match(html, /id="orderLat"/);
  assert.match(srv, /function mergeCrmState/);
  assert.match(srv, /mergeRecordArrays/);
  assert.match(b, /همیشه از سرور بکش و ادغام کن/);
});

test('v11.67.0 define routes tab + checkbox geo + dist targets', () => {
  const html = read('../public/index.html');
  const b = read('../public/crm-bundle.js');
  const css = read('../public/style.css');
  assert.match(html, /data-target="tab-define-routes"/);
  assert.match(html, /data-target="tab-dist-targets"/);
  assert.match(html, /تارگت فروش نمایندگان/);
  assert.match(html, /id="routeManagerProvince"[^>]*route-check-box/);
  assert.match(html, /id="repRoutesOverview"/);
  assert.match(css, /\.route-check-box/);
  assert.match(b, /setupDistTargetPlanner/);
  assert.match(b, /renderRepRoutesOverview/);
  assert.match(b, /input\[type=checkbox\]:checked/);
});


test('v11.67.0 manager size + target row ops + live server merge', () => {
  const b = read('../public/crm-bundle.js');
  const srv = read('../server.js');
  assert.match(b, /v11\.67\.0/);
  assert.match(b, /function applyManagerSizes/);
  assert.match(b, /v67-edit-tgt/);
  assert.match(b, /v67-del-tgt/);
  assert.match(b, /v67-edit-dtgt/);
  assert.match(b, /v67-edit-route/);
  assert.match(b, /crmPushStateToServer/);
  assert.match(b, /crmStampChangedRecords/);
  assert.match(b, /__v67=/);
  assert.match(srv, /_deletedIds/);
  assert.doesNotMatch(b, /var w = size > 40 \? size : 260;/);
});


test('v11.72.0 durable target ops + mm gap + row number', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(b, /v11\.68\.0/);
  assert.match(b, /v68-edit-tgt/);
  assert.match(b, /v68-del-tgt/);
  assert.match(b, /v68-edit-dtgt/);
  assert.match(b, /v68-edit-route/);
  assert.match(b, /v68SalesTargetOps/);
  assert.match(b, /colGapBefore/);
  assert.match(b, /colGapAfter/);
  assert.match(b, /colRowNo/);
  assert.match(b, /gapBeforeMm/);
  assert.match(b, /فاصله نسبت به فیلد قبلی/);
  assert.match(b, /شماره سطر/);
  assert.match(css, /\.v68-form-row/);
});

test('v11.72.0 server-authoritative unify + durable delete + live mm/row', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(srv, /function naturalRecordKey/);
  assert.match(srv, /if \(id && deleted && deleted\[id\] && recStamp\(r\) <= Number\(deleted\[id\]\)\) return/);
  assert.match(b, /v11\.69\.0/);
  assert.match(b, /window.setupTargetPlannerV34=setupTargetPlannerV34/);
  assert.match(b, /window.renderTargetReportsV34=renderTargetReportsV34/);
  assert.match(b, /X-CRM-Sync":"v69"/);
  assert.match(b, /function tombstone/);
  assert.match(b, /function purgeDeleted/);
  assert.match(b, /v69UnifyOverlay/);
  assert.match(b, /v69-edit-tgt/);
  assert.match(b, /v69-del-tgt/);
  assert.match(b, /__v60=|__v67=/);
  assert.match(b, /ابتدا از لیست پایین، فیلد را با دکمه ویرایش انتخاب کنید/);
});

test('v11.72.0 solo device + no cache-reset loop', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const login = read('../public/login.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(srv, /x-crm-replace/);
  assert.match(srv, /_soloOnly/);
  assert.match(srv, /CRM_RESET_LOCK/);
  assert.match(b, /v11\.70\.0/);
  assert.match(b, /X-CRM-Replace/);
  assert.match(b, /CRM_SOLO_EPOCH/);
  assert.match(html, /حلقه cache-reset قطع شد/);
  assert.match(login, /v11.70 no auto go/);
  assert.match(b, /حلقه cache-reset قطع شد/);
});

test('v11.72.0 single script load + 404 not login + solo replace', () => {
  const html = read('../public/index.html');
  const srv = read('../server.js');
  const app = read('../public/crm-app.js');
  const b = read('../public/crm-bundle.js');
  assert.equal((html.match(/crm-data\.js\?v=/g)||[]).length, 1);
  assert.equal((html.match(/crm-app\.js\?v=/g)||[]).length, 1);
  assert.equal((html.match(/crm-bundle\.js\?v=/g)||[]).length, 1);
  assert.equal((html.match(/<\/html>/g)||[]).length, 1);
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(srv, /v11.71: Clear-Site-Data/);
  assert.match(b, /v11\.71\.0/);
  assert.match(b, /CRM_SOLO_CLAIM/);
  assert.match(b, /X-CRM-Replace/);
});

test('v11.72.0 server-first paint + no-spin qty + per-row ops + dist achieved/remain', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(app, /register\('\/sw\.js\?v=11\.97.0'/);
  assert.match(b, /v11\.72\.0/);
  assert.match(b, /__v72boot/);
  assert.match(b, /function adoptServerExact/);
  assert.match(b, /function bootServerFirst/);
  assert.match(b, /v72-edit-tgt/);
  assert.match(b, /v72-del-tgt/);
  assert.match(b, /v72-edit-dtgt/);
  assert.match(b, /v72-edit-route/);
  assert.match(b, /محقق شده/);
  assert.match(b, /مانده تارگت/);
  assert.match(b, /function distAchievedQty/);
  assert.match(b, /stopImmediatePropagation/);
  assert.match(html, /id="v72DistGrandBox"/);
  assert.match(html, /id="v72DistBoxes"/);
  assert.match(css, /qty-no-spin/);
  assert.match(css, /appearance: textfield/);
  assert.match(css, /#v68SalesTargetOps/);
  assert.match(css, /\.v67-ops-table/);
  assert.match(b, /نمایش تارگت‌های ثبت‌شده/);
  assert.match(app, /if \(targetId === "tab-pharmacies"\)/);
  assert.match(app, /renderPharmaciesList\(\)/);
});

test('v11.73.0 live state bind + delayed unveil + durable dist save + kill old ops hosts', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const sw = read('../public/sw.js');
  const login = read('../public/login.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(sw, /const BUILD = "11.97.0"/);
  assert.match(app, /function bindLiveWindowState/);
  assert.match(app, /window\.__CRM_GET_STATE/);
  assert.match(app, /window\.renderPharmaciesList/);
  assert.match(html, /var BUILD="11.97.0"/);
  assert.match(html, /window\.__CRM_UNVEIL/);
  assert.match(html, /if\(!window\.__CRM_UNVEILED\)window\.__CRM_UNVEIL\(\);},5000\)/);
  assert.doesNotMatch(html, /classList\.remove\("crm-booting"\);},800\)/);
  assert.match(login, /var BUILD="11.97.0"/);
  assert.match(b, /v11\.73\.0/);
  assert.match(b, /__v73boot/);
  assert.match(b, /function adoptExact/);
  assert.match(b, /function saveDistTargetsV73/);
  assert.match(b, /function matchDist/);
  assert.match(b, /function parsePeriod/);
  assert.match(b, /function killOldOpsHosts/);
  assert.match(b, /v73-edit-tgt/);
  assert.match(b, /v73-del-dtgt/);
  assert.match(b, /v73-edit-route/);
  assert.match(b, /X-CRM-Replace":"1"/);
  assert.match(b, /#v66SaveDistTargets/);
  assert.match(b, /_deletedNatKeys/);
  assert.match(b, /window\.paintV68TargetOps=function\(\)\{killOldOpsHosts\(\);paintV73All\(\);\}/);
});

test('v11.74.0 mashateb sales mapping like daya/shafaarad', () => {
  const b = read('../public/crm-bundle.js');
  const v20file = read('../public/crm-features-v20.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(b, /MASHATEB_CODE_MAP=\{1001:186101,1002:186102,1003:186103,1004:186104,1005:186105,1006:186106,1007:186107\}/);
  assert.match(v20file, /MASHATEB_CODE_MAP=\{1001:186101,1002:186102,1003:186103,1004:186104,1005:186105,1006:186106,1007:186107\}/);
  assert.match(b, /else if\(id==="mashateb"\)\{x\.date=2;x\.qty=10;x\.giftQty=11;x\.pharmacy=9;/);
  assert.match(b, /function distProductDbCode/);
  assert.match(b, /function isMappedDist/);
  assert.match(b, /mashatebDbCode/);
  assert.match(b, /distId==="mashateb"\?10/);
  const ctx={result:null, findDistIndex:(h,re,fb)=>fb==null?-1:fb};
  vm.createContext(ctx);
  vm.runInContext(`${extract('distSchema')};result=distSchema([],"mashateb")`, ctx);
  assert.equal(ctx.result.qty, 10);
  assert.equal(ctx.result.giftQty, 11);
  assert.equal(ctx.result.pharmacy, 9);
  assert.equal(ctx.result.date, 2);
  assert.equal(ctx.result.invoice, -1);
  assert.equal(ctx.result.retQty, -1);
});

test('v11.76.0 designer live apply + geo autofill off + mashateb col3 date + db edit/delete + name location dup', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const v20file = read('../public/crm-features-v20.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(b, /v11\.75\.0/);
  assert.match(b, /function applyDesignerNow/);
  assert.match(b, /function applyPaintedMeta/);
  assert.match(b, /data-lpignore/);
  assert.match(b, /db-ph-edit/);
  assert.match(b, /db-ph-del/);
  assert.match(b, /db-inv-edit/);
  assert.match(b, /db-inv-del/);
  assert.match(b, /id==="mashateb"\?2/);
  assert.match(v20file, /id==="mashateb"\?2/);
  assert.match(b, /function locationDup/);
  assert.match(html, /id="pharmacyProvince"[^>]*autocomplete="off"/);
  assert.match(html, /id="pharmacyCity"[^>]*autocomplete="off"/);
  assert.doesNotMatch(b, /setInterval\(v56routeGeoFilter,2500\)/);
});

test('v11.76.0 bulk archive lock + geo nocombo + pharmacy name no subsets + activity heatmap', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const v20file = read('../public/crm-features-v20.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(b, /v11\.76\.0/);
  assert.match(b, /function bulkUnion/);
  assert.match(b, /function bulkCount/);
  assert.match(b, /if\(!hasBulk\(data\)&&!data\._managerPurge\)/);
  assert.match(b, /window\.__CRM_BULK_READY=false/);
  assert.match(v20file, /function bulkUnion/);
  assert.match(srv, /function mergeBulkVault/);
  assert.match(srv, /if \(bulkCount\(incoming\) === 0 && !purge\) return existing/);
  assert.match(b, /Province\|City\|District\|Region/);
  assert.match(html, /id="pharmacyProvince"[^>]*data-nocombo="1"/);
  assert.match(html, /id="pharmacyCity"[^>]*data-nocombo="1"/);
  assert.match(html, /id="pharmacyDistrict"[^>]*data-nocombo="1"/);
  assert.match(html, /id="v76HeatBar"/);
  assert.match(html, /id="v76HeatRep"/);
  assert.match(b, /function hookPharmacyNameField\(\) \{\s*return;/);
  assert.match(b, /pharmacyNamePickBox/);
  assert.match(b, /function collectHeatPoints/);
  assert.match(b, /window.paintV76ActivityHeat/);
  assert.match(html, /name="crm-pharmacy-title"/);
  assert.match(b, /inventoryImports=d.inventoryImports\|\|\[\]/);
});

test('v11.77.0 product pricing tab current/new boxes + reverse calc + jalali apply date', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const data = read('../public/crm-data.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(app, /tab-product-pricing/);
  assert.match(html, /id="tab-product-pricing"/);
  assert.match(html, /id="v77CurrentPricesBody"/);
  assert.match(html, /id="v77NewPricesBody"/);
  assert.match(html, /قیمت‌های فعلی کالاها/);
  assert.match(html, /قیمت‌های جدید کالاها/);
  assert.match(html, /تاریخ اعمال قیمت‌ها/);
  assert.match(html, /درصد افزایش/);
  assert.match(data, /sys_product_pricing/);
  assert.match(data, /"قیمت‌گذاری کالاها"/);
  assert.match(b, /v11\.77\.0/);
  assert.match(b, /function v77FromCons|window.v77FromCons/);
  assert.match(b, /window.paintV77ProductPricing/);
  assert.match(b, /window.applyV77ProductPricing/);
  assert.match(b, /pricingDraft/);
  assert.match(b, /function fromCons/);
  assert.match(b, /function dateReached/);
  assert.match(b, /sys_product_pricing/);
  const ctx={result:null};
  vm.createContext(ctx);
  vm.runInContext(`function margin(from,to){from=Number(from)||0;to=Number(to)||0;if(!from)return 0;return (to-from)/from*100;}
    function fromCons(cons,mDistPh,mPhCons){cons=Number(cons)||0;mDistPh=Number(mDistPh)||0;mPhCons=Number(mPhCons)||0;var ph=cons/((1+mPhCons/100)||1);var dist=ph/((1+mDistPh/100)||1);return {dist:Math.round(dist),ph:Math.round(ph),cons:Math.round(cons)};}
    result={m:margin(40000,48000), back:fromCons(110000,20,10)};`, ctx);
  assert.equal(ctx.result.m, 20);
  assert.equal(ctx.result.back.cons, 110000);
  assert.equal(ctx.result.back.ph, 100000);
  assert.equal(ctx.result.back.dist, 83333);
});

test('v11.78.0 consumer price + legal margin + row edit VAT + live designer + instant apply', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(html, /id="productConsumerPrice"/);
  assert.match(html, /قیمت مصرف‌کننده \(ریال\)/);
  assert.match(app, /consumerPrice: consPrice \|\| phPrice/);
  assert.match(app, /window.syncProductsEverywhere/);
  assert.ok(b.includes("v11.78.0"));
  assert.match(b, /window.syncProductsEverywhere/);
  assert.match(b, /function applyDesignerV78/);
  assert.match(b, /function applyV78Layout/);
  assert.match(b, /function refreshLiveNow/);
  assert.match(b, /v78-edit-price/);
  assert.match(b, /tabId==="tab-orders"/);
  assert.match(b, /if\(!to\)return 0;return \(to-from\)\/to\*100/);
  assert.match(b, /var ph=cons\*\(1-mPhCons\/100\)/);
  const ctx={result:null};
  vm.createContext(ctx);
  vm.runInContext(`function margin(from,to){from=Number(from)||0;to=Number(to)||0;if(!to)return 0;return (to-from)/to*100;}
    function fromCons(cons,mDistPh,mPhCons){cons=Number(cons)||0;mDistPh=Number(mDistPh)||0;mPhCons=Number(mPhCons)||0;if(mPhCons>=100)mPhCons=99.99;if(mDistPh>=100)mDistPh=99.99;var ph=cons*(1-mPhCons/100);var dist=ph*(1-mDistPh/100);return {dist:Math.round(dist),ph:Math.round(ph),cons:Math.round(cons)};}
    result={m:Math.round(margin(3358080,3816000)*100)/100, back:fromCons(3816000,12,0)};`, ctx);
  assert.equal(ctx.result.m, 12);
  assert.equal(ctx.result.back.ph, 3816000);
  assert.equal(ctx.result.back.dist, 3358080);
});

test('v11.79.0 this-device-only restore + no duplicate product code column', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(app, /v20-product-code/);
  assert.ok(b.includes("v11.79.0"));
  assert.ok(b.includes("v11.79.0"));
  assert.match(b, /function restoreThisDevice/);
  assert.match(b, /function killDupCodeColumn/);
  assert.ok(b.includes("if(tr.children.length>=8)return"));
  assert.match(b, /rec.consumerPrice=parseInt/);
  assert.match(html, /id="productConsumerPrice"/);
});

test('v11.80.0 server-only lock + new consumer from current times increase', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const data = read('../public/crm-data.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.80.0"));
  assert.match(b, /function restoreThisDevice/);
  assert.match(b, /d\.cons=newCons/);
  assert.match(b, /legacy-locked/);
  assert.match(srv, /function stripLegacySample/);
  assert.match(srv, /reason: "legacy-locked"/);
  assert.match(html, /var BUILD="11.97.0"/);
  assert.match(data, /pharmacies: \[\]/);
  assert.ok(!data.includes("داروخانه دکتر عرفانی"));
  const ctx={result:null};
  vm.createContext(ctx);
  vm.runInContext(`function computeNew(cons,inc){cons=Number(cons)||0;inc=Number(inc)||0;return Math.round(cons*(1+inc/100));}
    result={a:computeNew(3816000,10), b:computeNew(3816000,0)};`, ctx);
  assert.equal(ctx.result.a, 4197600);
  assert.equal(ctx.result.b, 3816000);
});

test('v11.81.0 purge previous-system data + new consumer formula cell', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.81.0"));
  assert.match(b, /v81-new-cons/);
  assert.match(srv, /function fenceOldSystem/);
  assert.match(html, /_purgedLegacyAt/);
  assert.match(app, /_dataGen \|\| ""\) !== "11.81.0"/);
  const ctx={result:null};
  vm.createContext(ctx);
  vm.runInContext(`function newCons(cur,inc){return Math.round((Number(cur)||0)*(1+(Number(inc)||0)/100));}
    result={a:newCons(3816000,10), b:newCons(3816000,0), c:newCons(0,10)};`, ctx);
  assert.equal(ctx.result.a, 4197600);
  assert.equal(ctx.result.b, 3816000);
  assert.equal(ctx.result.c, 0);
});

test('v11.82.0 designer order applies to live form and list', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.82.0"));
  assert.match(b, /function applySavedLayout/);
  assert.match(b, /window.applySavedLayoutV82/);
  assert.match(b, /CRM_MANAGER_GRID_ORDER_V2/);
  assert.doesNotMatch(b, /ستون دوم: نام نماینده/);
});

test('v11.83.0 no jump typing + iran mobile tiles and login persist', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const sw = read('../public/sw.js');
  const login = read('../public/login.html');
  const html = read('../public/index.html');
  const official = read('../OFFICIAL_FILELIST.txt');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.83.0"));
  assert.match(b, /function typingInLiveForm/);
  assert.match(srv, /\/api\/tiles\//);
  assert.match(app, /\/api\/tiles\/\{z\}\/\{x\}\/\{y\}\.png/);
  assert.match(sw, /fetchWithTimeout/);
  assert.match(sw, /cache: "reload"/);
  assert.match(login, /CRM_LOGIN_OK/);
  assert.match(html, /CRM_LOGIN_OK/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.doesNotMatch(official, /download-v11\.68\.0\.html/);
});

test('v11.84.0 live dashboard filters + no form jump + stable order lock', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.84.0"));
  assert.match(html, /id="v84DashYear"/);
  assert.match(html, /id="v84DashProvince"/);
  assert.match(b, /window.paintV84Dashboard/);
  assert.ok(!html.includes('title="380,000,000 ریال"'));
  assert.match(b, /جابه‌جایی DOM ممنوع/);
});

test('v11.85.0 routes one ops column + geo search all + dashboard labels', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.85.0"));
  assert.match(html, /v85-geo-search/);
  assert.match(html, /data-for="routeManagerProvince"/);
  assert.match(b, /function dedupeRouteOps/);
  assert.match(b, /همه استان‌ها/);
  assert.match(b, /mNames\[i\]/);
  assert.doesNotMatch(b, /mNames\[i\]\.slice\(0,2\)/);
});

test('v11.86.0 never wipe user pharmacies + route click + same mobile version', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const login = read('../public/login.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.86.0"));
  assert.match(app, /recoverWipedUserData/);
  assert.doesNotMatch(srv, /LEGACY_WIPE_KEYS\.forEach/);
  assert.match(html, /crmBuildBadge/);
  assert.match(login, /crmBuildHint/);
  assert.match(b, /edit-route/);
});

test('v11.87.0 route no shake + share dedupe + login session + dist grand + leave time + cloud backup', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.87.0"));
  assert.match(b, /data-v87sig/);
  assert.match(b, /window.v87ShareDedupe/);
  assert.match(b, /window.paintChangelogV87/);
  assert.match(b, /CRM_LOGIN_OK/);
  assert.match(html, /v87BackupRecommend/);
  assert.match(html, /جمع تارگت همه پخش‌ها/);
  assert.match(html, /for="leaveFromTime">از ساعت/);
  assert.match(html, /class="form-input v87-time"/);
  assert.match(css, /v87-backup-card/);
  assert.match(srv, /function snapshotCloudBackup/);
  assert.match(srv, /\/api\/backup\/status/);
  assert.doesNotMatch(srv, /LEGACY_WIPE_KEYS\.forEach/);
});

test('v11.88.0 one route ops + login page required', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const login = read('../public/login.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.88.0"));
  assert.match(b, /window.v88OneColumnRouteOps/);
  assert.match(srv, /pathname === "\/" \|\| pathname === "\/login"/);
  assert.match(srv, /pathname === "\/panel" \|\| pathname === "\/panel\/"/);
  assert.doesNotMatch(login, /if \(crmLogged\(\)\) \{\s*location\.replace\("\/panel"\)/);
  assert.match(html, /if\(!crmLogged\(\)\)\{location\.replace\("\/login(?:\.html)?"\);return;\}/);
});

test('v11.89.0 sw same build + 15min backup + compact routes', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.89.0"));
  assert.match(app, /const build = CRM_APP_VERSION/);
  assert.match(srv, /15 \* 60 \* 1000/);
  assert.match(srv, /function startQuarterHourBackup/);
  assert.match(srv, /function backupSlotStamp/);
  assert.match(b, /window.v89OneColumnRouteOps/);
  assert.match(css, /#representativeRoutesGrid/);
  assert.match(html, /هر ۱۵ دقیقه/);
});

test('v11.90.0 mobile menu + specialty + own-data + routes + std buttons', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const data = read('../public/crm-data.js');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.90.0"));
  assert.match(b, /window.v90OwnOnly/);
  assert.match(b, /window.v90PaintRoutes/);
  assert.match(b, /window.v90StdButtons/);
  assert.match(b, /window.v90FillDoctorSpecialty/);
  assert.match(data, /DOCTOR_SPECIALTIES/);
  assert.match(data, /قلب و عروق/);
  assert.match(html, /<select id="doctorSpecialty"/);
  assert.match(css, /side-menu-drawer.active/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /\.app-nav/);
  assert.match(css, /btn-danger/);
});

test('v11.91.0 mobile pane visible + full specialty options + route pointerdown + compact dash', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const data = read('../public/crm-data.js');
  const css = read('../public/style.css');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.91.0"));
  assert.match(b, /window.v91ShowPane/);
  assert.match(b, /window.v91FillDoctorSpecialty/);
  assert.match(b, /pointerdown/);
  assert.match(b, /window.v91EditRoute/);
  assert.match(html, /<select id="doctorSpecialty"/);
  assert.match(html, /<option value="قلب و عروق">/);
  assert.match(html, /<option value="جراحی مغز و اعصاب">/);
  assert.match(data, /var DOCTOR_SPECIALTIES/);
  assert.match(css, /html.crm-booting body/);
  assert.match(css, /min-height: 40vh/);
  assert.match(html, /visibility:visible!important;opacity:1!important/);
});

test('v11.92.0 iranian hubs cors + favicon + file login/panel + hub fetch', () => {
  const b = read('../public/crm-bundle.js');
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const login = read('../public/login.html');
  const man = read('../public/manifest.json');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.92.0"));
  assert.match(srv, /function isCrmHubHost/);
  assert.match(srv, /ndcohub\.ir/);
  assert.match(srv, /mehraeinpharma\.ir/);
  assert.match(srv, /Access-Control-Allow-Origin/);
  assert.match(srv, /pathname === "\/favicon\.ico"/);
  assert.match(srv, /hubs:/);
  assert.match(html, /v92HubFetch/);
  assert.match(html, /location\.replace\("\/login\.html"\)/);
  assert.match(login, /location\.replace\("\/index\.html"\)/);
  assert.match(login, /mehraeinpharma\.ir/);
  assert.match(man, /login\.html\?source=pwa/);
});

test('v11.93.0 static netafraz + env hubs + sync-all + timeout hub', () => {
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const hub = read('../public/crm-hub.js');
  const rt = read('../public/crm-runtime.js');
  const pkg = read('../package.json');
  const env = read('../.env.example');
  const sync = read('../sync-all.js');
  const st = read('../build-static.js');
  const gitignore = read('../.gitignore');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(srv, /function runtimeHubs/);
  assert.match(srv, /\/api\/runtime-config/);
  assert.match(srv, /PLATFORM/);
  assert.match(html, /crm-hub\.js\?v=11\.97.0/);
  assert.match(html, /crm-runtime\.js\?v=11\.97.0/);
  assert.match(hub, /12000/);
  assert.match(hub, /function retry/);
  assert.match(rt, /__CRM_RUNTIME/);
  assert.match(pkg, /"sync": "node sync-all.js"/);
  assert.match(pkg, /"build-static": "node build-static.js"/);
  assert.doesNotMatch(pkg, /next build/);
  assert.match(env, /PLATFORM=fullstack/);
  assert.match(env, /BASE_URL=/);
  assert.match(env, /CRM_HUBS=/);
  assert.match(sync, /git push origin main/);
  assert.match(sync, /gitlab/);
  assert.match(st, /static-build/);
  assert.match(st, /platform: "static"/);
  assert.match(gitignore, /static-build/);
});

test('v11.94.0 netafraz php api independent + leaflet root + no api 404 fake', () => {
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const hub = read('../public/crm-hub.js');
  const php = read('../public/api.php');
  const ht = read('../public/.htaccess');
  const st = read('../build-static.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(html, /leaflet.css\?v=11\.97.0/);
  assert.match(html, /leaflet.js\?v=11\.97.0/);
  assert.match(hub, /v94StaticLocal/);
  assert.match(hub, /fakeFor/);
  assert.match(php, /crm-netafraz-data.json/);
  assert.match(php, /push_render/);
  assert.match(ht, /api\.php\?path=/);
  assert.match(st, /api-config.php/);
  assert.match(st, /RewriteRule \^api/);
});
test('v11.95.0 same version badge + origin-only hubs + taha company name', () => {
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const html = read('../public/index.html');
  const login = read('../public/login.html');
  const b = read('../public/crm-bundle.js');
  const hub = read('../public/crm-hub.js');
  const data = read('../public/crm-data.js');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.95.0"));
  assert.match(b, /window.v95OriginOnly/);
  assert.match(b, /window.v95SameBadge/);
  assert.doesNotMatch(b, /if \(badge\) badge\.textContent = "نسخه ۱۱\.۹۱\.۰"/);
  assert.match(hub, /v95OriginOnly/);
  assert.doesNotMatch(hub, /\(window\.CRM_HUBS \|\| \[\]\)\.forEach/);
  assert.match(data, /companyName: "طنین طب طاها"/);
  assert.match(html, /نسخه ۱۱\.۹۷\.۰/);
  assert.match(html, /id="headerCompanyNameDisplay">طنین طب طاها/);
  assert.match(login, /نسخه ۱۱\.۹۷\.۰/);
  assert.match(app, /v95CompanyName/);
});
test('v11.96.0 netafraz api/sync to render + gen stamp + no empty wipe', () => {
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const php = read('../public/api.php');
  const hub = read('../public/crm-hub.js');
  const b = read('../public/crm-bundle.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.match(srv, /pathname === "\/api\/sync"/);
  assert.match(php, /\$p === "sync"/);
  assert.match(php, /target=render|target === "render"/);
  assert.match(php, /X-CRM-Sync: v81/);
  assert.match(php, /function stamp_gen/);
  assert.match(php, /_dataGen"\] = "11.81.0"/);
  assert.match(php, /function hollow_state/);
  assert.match(php, /function push_render/);
  assert.match(php, /CRM_DEFAULT_RENDER/);
  assert.match(php, /curl_init/);
  assert.doesNotMatch(php, /LEGACY_WIPE_KEYS\.forEach/);
  assert.match(hub, /sync-local-only/);
  assert.ok(b.includes("v11.96.0"));
  assert.match(b, /window.v96NetafrazSync/);
  assert.match(b, /\/api\/sync\?target=render/);
  assert.match(html, /crm-app\.js\?v=11\.97.0/);
});
test('v11.97.0 netafraz adopts render data on new build without empty wipe', () => {
  const app = read('../public/crm-app.js');
  const srv = read('../server.js');
  const php = read('../public/api.php');
  const st = read('../build-static.js');
  const b = read('../public/crm-bundle.js');
  const html = read('../public/index.html');
  assert.match(app, /CRM_APP_VERSION = "11.97.0"/);
  assert.match(srv, /const APP_VERSION = "11.97.0"/);
  assert.ok(b.includes("v11.97.0"));
  assert.match(b, /window.v97CanonSync/);
  assert.match(b, /mode=replace/);
  assert.match(b, /CRM_CANON_BUILD/);
  assert.match(php, /mode === "replace"/);
  assert.match(php, /replaced from render/);
  assert.match(php, /function pull_render/);
  assert.match(php, /render_base\(true\)/);
  assert.doesNotMatch(php, /LEGACY_WIPE_KEYS\.forEach/);
  assert.match(st, /DEFAULT_RENDER/);
  assert.match(st, /javad-test1\.onrender\.com/);
  assert.match(st, /crm-netafraz-data\.json/);
  assert.match(html, /نسخه ۱۱\.۹۷\.۰/);
});

