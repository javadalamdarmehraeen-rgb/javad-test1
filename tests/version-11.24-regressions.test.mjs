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
const app = read('../public/crm-app.js');
const v19 = read('../public/crm-features-v19.js');
const sw = read('../public/sw.js');
const server = read('../server.js');
const gitignore = read('../.gitignore');

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
  assert.match(v20,/pinned=id===\"tab-distributor-invoice-status\"/);
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
  assert.match(v20,/function privacyList/);assert.match(v20,/function bindPrivacyRenderers/);
  for(const pair of [['activityLog','activity_all_reps'],['leaves','hr_all_leaves'],['repRoutes','fld_all_routes'],['repHomes','fld_all_homes'],['salesTargets','target_all_reps']]) assert.ok(v20.includes(`\"${pair[0]}\",\"${pair[1]}\"`),`missing privacy wrapper ${pair}`);
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
  for(const id of ['newActivityProvince','newActivityCity','newActivityDistricts']) assert.ok(html.includes(`id="${id}"`),`missing activity route ${id}`);
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

test('new build clears only old asset caches before revealing app and prevents manager-screen flash', () => {
  assert.match(html,/var BUILD="11\.33\.0",key="CRM_ASSET_BUILD"/);
  assert.match(html,/document\.documentElement\.classList\.add\("crm-booting"\)/);
  assert.match(html,/caches\.keys\(\).*caches\.delete/);
  assert.match(html,/navigator\.serviceWorker\.getRegistrations\(\).*unregister/);
  assert.match(html,/location\.replace\(u\.toString\(\)\)/);
  assert.match(v20,/document\.documentElement\.classList\.remove\("crm-booting"\)/);
  assert.match(server,/no-store, no-cache, must-revalidate, max-age=0/);
  assert.match(server,/CDN-Cache-Control/);
  assert.match(sw,/cache:"no-store"/);
  assert.match(sw,/purgeOldCaches/);
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
  assert.match(app,/register\('\/sw\.js\?v=11\.33\.0', \{ scope: '\/', updateViaCache: 'none' \}\)/);
  assert.match(app,/navigator\.serviceWorker\.ready/);
  assert.match(app,/postMessage\('skipWaiting'\)/);
  assert.match(sw,/self\.clients\.claim\(\)/);
  assert.match(sw,/e\.data === "skipWaiting"/);
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
