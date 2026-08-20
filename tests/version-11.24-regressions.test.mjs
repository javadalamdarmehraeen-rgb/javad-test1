import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const v9 = read('../public/crm-features-v9.js');
const v11 = read('../public/crm-features-v11.js');
const v20 = read('../public/crm-features-v20.js');

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

test('GPS quality rule remains stable and full address parts stay Iran-first without postcode', () => {
  assert.match(v9, /samples>=2&&cur\.accuracy<=10/);
  assert.match(v9, /},30000\)/);
  assert.match(v9, /enableHighAccuracy:true,timeout:30000,maximumAge:0/);
  assert.match(v9, /addr\.country \|\| \"ایران\"/);
  assert.match(v9, /addr\.building \|\| addr\.amenity \|\| addr\.shop/);
  assert.doesNotMatch(v9, /addr\.postcode/);
  assert.match(v20, /a\.building\|\|a\.amenity\|\|a\.shop/);
});
