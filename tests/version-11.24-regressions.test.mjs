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
  for (const tab of ['داشبورد','داروخانه‌ها','پزشکان','سفارشات','فعالیت لحظه‌ای','نقشه جامع','موقعیت زنده','اسنپ سازمانی','اطلاعات شرکت‌ها','اطلاعات فروش پخش‌ها','وضعیت فاکتور پخش‌ها','دیتابیس پخش‌ها','جستجوی اطلاعات','رصد تردد','شروع/پایان ویزیت','منزل نمایندگان','مرخصی‌ها','اعلان‌ها','گزارش ماهانه','تارگت فروش','افزودن‌ها','ستون‌ها و کالاها','طراحی دستی تب‌ها','کاربران و دسترسی','پیام‌رسان‌ها','پشتیبان‌گیری','نصب اپ','عیب‌یابی']) assert.match(data,new RegExp(`"${tab}"\\s*:`));
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
  for (const id of ['tab-dashboard','tab-pharmacies','tab-doctors','tab-orders','tab-activity-log','tab-overview-map','tab-live-location','tab-snapp-corporate','tab-distributor-companies','tab-distributor-sales','tab-distributor-invoice-status','tab-distributor-database','tab-search-info','tab-rep-routes','tab-my-visit','tab-rep-homes','tab-leaves','tab-notifications','tab-monthly-reports','tab-sales-targets','tab-custom-fields','tab-columns-products','tab-manual-design','tab-users-permissions','tab-messengers','tab-backup','tab-install-app','tab-troubleshooting']) assert.ok(v20.includes(`"${id}"`),`permission map missing ${id}`);
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
  assert.match(v20,/function bootstrapEmptyOriginFromServer/);assert.match(v20,/window\.__CRM_HAD_SAVED_STATE!==false/);
  assert.match(v20,/fetch\("\/api\/state",\{cache:"no-store"\}\)/);assert.match(v20,/localStorage\.setItem\("CRM_APP_STATE_V2"/);
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
  assert.match(v20,/tab-sales-targets[\s\S]{0,180}setupRepresentativeRoutes\(\);pinRepresentativeRouteFieldsV37\(\);setupTargetPlannerV34\(\)/);
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
  assert.match(githubHandoff,/نسخه آماده سورس:[\s\S]*11\.49.0/);
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
  assert.match(server,/pathname === "\/cache-reset"/);assert.match(server,/"Clear-Site-Data": '\"cache\"'/);
  assert.match(server,/"X-CRM-Build": APP_VERSION/);assert.match(server,/const APP_VERSION = "11\.49.0"/);
  assert.match(html,/\/api\/health\?__crm_nocache=/);assert.match(html,/\/cache-reset\?to=/);assert.match(html,/d\.version!==BUILD/);
  assert.match(login,/CRM_CACHE_RESCUED_/);assert.match(login,/\/cache-reset\?to=/);
  assert.match(sw,/function purgeEveryCache/);assert.match(sw,/CRM_BUILD_ACTIVE/);assert.match(sw,/cache: "reload"/);
  assert.match(sw,/request\.mode === "navigate"/);assert.doesNotMatch(sw,/caches\.match\(request\)[\s\S]{0,80}navigate/);
  for(const source of [server,html,login,sw,app]) {
    assert.doesNotMatch(source,/localStorage\.clear\s*\(/);
    assert.doesNotMatch(source,/indexedDB\.deleteDatabase\s*\(/);
    assert.doesNotMatch(source,/removeItem\(["']CRM_APP_STATE_V2/);
  }
  assert.match(app,/CRM_BUILD_ACTIVE/);assert.match(app,/register\('\/sw\.js\?v=11\.49.0'/);
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
  assert.match(app,/register\('\/sw\.js\?v=11\.49.0', \{ scope: '\/', updateViaCache: 'none' \}\)/);
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

test('v11.49.0 safe cache-hardening', () => {
  const html = read('../public/index.html'); const app = read('../public/crm-app.js');
  assert.match(html,/http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/);
  assert.match(app,/CRM_APP_VERSION = "11.49.0"/);
  assert.match(app,/بارگذاری شد/);
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
