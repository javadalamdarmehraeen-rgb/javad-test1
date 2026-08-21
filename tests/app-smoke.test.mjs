import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';

const port = 10123;
let server;

test.before(async () => {
  server = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore','pipe','pipe'] });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('server startup timeout')), 10000);
    server.stdout.on('data', d => { if (String(d).includes('listening')) { clearTimeout(timer); resolve(); } });
    server.on('exit', code => { clearTimeout(timer); reject(new Error(`server exited ${code}`)); });
  });
});

test.after(() => { if (server && !server.killed) server.kill('SIGTERM'); try { rmSync('server-db.json', { force:true }); rmSync('user-data.json', { force:true }); rmSync('user-bulk-data.json', { force:true }); } catch {} });

test('automated app entry loads health, HTML, all scripts and critical UI', async () => {
  const base = `http://127.0.0.1:${port}`;
  const healthRes = await fetch(base + '/api/health');
  assert.equal(healthRes.status, 200);
  const health = await healthRes.json();
  assert.equal(health.ok, true);
  assert.match(health.version, /^\d+\.\d+\.\d+$/);

  const pageRes = await fetch(base + '/');
  assert.equal(pageRes.status, 200);
  assert.match(pageRes.headers.get('cache-control') || '', /no-store/);
  assert.match(pageRes.headers.get('content-security-policy') || '', /object-src 'none'/);
  assert.match(pageRes.headers.get('permissions-policy') || '', /camera=\(\).*microphone=\(\)/);
  assert.equal(pageRes.headers.get('access-control-allow-origin'), null);
  const html = await pageRes.text();
  for (const id of ['tab-dashboard','tab-orders','tab-snapp-corporate','tab-distributor-companies','tab-distributor-sales','tab-distributor-database','btnToggleSideMenu','snappTripModeYear','snappTopupModeYear','btnBuildDistributorReport','tab-distributor-invoice-status','invoiceStatusBody','invoiceStatusSearch','productCode','btnImportSnappTrips','btnImportSnappTopups']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing critical UI #${id}`);
  }
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js(?:\?[^"']*)?)["']/g)].map(m => m[1]);
  assert.ok(scripts.length >= 17, `expected complete script chain, got ${scripts.length}`);
  for (const src of scripts) {
    const res = await fetch(new URL(src, base + '/'));
    assert.equal(res.status, 200, `failed asset ${src}`);
    assert.ok((await res.text()).length > 20, `empty asset ${src}`);
  }
});

test('state API round-trip preserves unrelated sentinel data', async () => {
  const base = `http://127.0.0.1:${port}`;
  const sentinel = { _lastSavedAt: 42, users: [{ id:'sentinel-user', fullName:'اطلاعات قدیمی' }], formFieldMeta: { order: { sentinel: { order: 99 } } } };
  const rejected = await fetch(base + '/api/state', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(sentinel) });
  assert.equal(rejected.status, 403);
  const post = await fetch(base + '/api/state', { method:'POST', headers:{'content-type':'application/json','x-crm-request':'1'}, body:JSON.stringify(sentinel) });
  assert.equal(post.status, 200);
  const get = await fetch(base + '/api/state');
  const body = await get.json();
  assert.equal(body.data.users[0].id, 'sentinel-user');
  assert.equal(body.data.formFieldMeta.order.sentinel.order, 99);
});

test('bulk API round-trip preserves imported Excel vault for a new program link', async () => {
  const base = `http://127.0.0.1:${port}`;
  const bulk = { savedAt: 7, snapp: { rows:[['trip-sentinel']], topups:[], tripImports:[], topupImports:[] }, distributors: { daya: { pharmacyRows:[['invoice-sentinel']], pharmacyImports:[], inventoryRows:[] } } };
  const post = await fetch(base + '/api/bulk', { method:'POST', headers:{'content-type':'application/json','x-crm-request':'1'}, body:JSON.stringify(bulk) });
  assert.equal(post.status, 200);
  const get = await fetch(base + '/api/bulk');
  assert.equal(get.status, 200);
  const body = await get.json();
  assert.equal(body.data.snapp.rows[0][0], 'trip-sentinel');
  assert.equal(body.data.distributors.daya.pharmacyRows[0][0], 'invoice-sentinel');
});
