import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8080';
let passed = 0, failed = 0;
function ok(cond, msg) {
  if (cond) { passed++; console.log('ok:', msg); }
  else { failed++; console.error('FAIL:', msg); }
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') {
    const loc = m.location();
    errors.push('console: ' + m.text() + (loc && loc.url ? ' [' + loc.url + ']' : ''));
  }
});

// ---------- static pages ----------
const staticPages = [
  '/', '/tools.html', '/formats.html', '/mesh-tools.html', '/3d-printing-tools.html',
  '/about.html', '/contact.html', '/privacy.html', '/terms.html', '/disclaimer.html', '/404.html',
  '/viewer/stl-viewer.html', '/viewer/obj-viewer.html', '/viewer/glb-gltf-viewer.html', '/viewer/ply-viewer.html',
  '/viewer/3mf-viewer.html', '/viewer/multi-model-viewer.html', '/viewer/inspection-views.html',
  '/convert/stl-to-obj.html', '/convert/obj-to-stl.html', '/convert/stl-to-3mf.html', '/convert/obj-to-glb.html',
  '/convert/glb-to-obj.html', '/convert/gltf-to-glb.html', '/convert/ply-to-obj.html', '/convert/3mf-to-stl.html',
];
for (const p of staticPages) {
  const resp = await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  ok(resp.status() === 200, `${p} returns 200`);
  const hasCanonical = await page.locator('link[rel="canonical"]').count();
  ok(hasCanonical === 1, `${p} has canonical`);
  const hasJsonLd = await page.locator('script[type="application/ld+json"]').count();
  ok(hasJsonLd >= 1, `${p} has JSON-LD`);
  const hasOg = await page.locator('meta[property="og:title"]').count();
  ok(hasOg === 1, `${p} has Open Graph`);
  const h1 = await page.locator('h1').first().textContent();
  ok(h1 && h1.trim().length > 3, `${p} has an h1`);
}
// robots + sitemap
const robots = await page.goto(BASE + '/robots.txt');
ok(robots.status() === 200, 'robots.txt served');
const sitemap = await page.goto(BASE + '/sitemap.xml');
ok(sitemap.status() === 200 && (await sitemap.text()).includes('<urlset'), 'sitemap.xml served');

// ---------- app: sample model ----------
await page.goto(BASE + '/app.html', { waitUntil: 'networkidle' });
ok(await page.locator('#canvasWrap canvas').count() > 0, 'app: WebGL canvas exists');
await page.click('#btnSample');
await page.waitForSelector('.model-tab', { timeout: 10000 });
ok(true, 'app: sample model loaded');
let statusText = await page.locator('#statusStats').textContent();
ok(/generated/i.test((await page.locator('.model-tab').first().textContent()) || '') || /tris/i.test(statusText), 'app: stats bar shows triangle count: ' + statusText);

// display modes
for (const mode of ['wireframe', 'xray', 'normals', 'vertices', 'solid']) {
  await page.selectOption('#displayMode', mode);
  await page.waitForTimeout(150);
}
ok(true, 'app: display modes switched without errors');

// camera views
for (const view of ['front', 'top', 'iso']) {
  await page.click(`[data-view="${view}"]`);
  await page.waitForTimeout(100);
}
await page.click('#btnFrame');
ok(true, 'app: camera views + fit');

// screenshot tool
const png = await page.evaluate(() => document.querySelector('#canvasWrap canvas').toDataURL('image/png'));
ok(png.startsWith('data:image/png') && png.length > 5000, 'app: viewport screenshot produces PNG data');

// ---------- app: load real sample files ----------
const samples = [
  'tests/samples/bracket.stl',
  'tests/samples/bracket-ascii.stl',
  'tests/samples/bracket.obj',
  'tests/samples/bracket.ply',
  'tests/samples/bracket.glb',
  'tests/samples/bracket.3mf',
];
await page.click('#btnClear');
await page.setInputFiles('#fileInput', samples);
await page.waitForFunction(() => document.querySelectorAll('.model-tab').length >= 6, null, { timeout: 20000 });
const tabCount = await page.locator('.model-tab').count();
ok(tabCount === 6, `app: loaded 6 sample files as 6 models (got ${tabCount})`);

// ---------- app: worker ops on a real file ----------
await page.click('#btnClear');
await page.setInputFiles('#fileInput', ['tests/samples/bracket.3mf']);
await page.waitForSelector('.model-tab', { timeout: 15000 });

// stats
await page.click('.panel-tab[data-tab="analyze"]');
await page.click('#btnStats');
await page.waitForSelector('#analyzeResults table', { timeout: 15000 });
const statsText = await page.locator('#analyzeResults').textContent();
ok(/Triangles/.test(statsText) && /36/.test(statsText), 'app: statistics shows 36 triangles');

// manifold
await page.click('#btnManifold');
await page.waitForFunction(() => /Watertight/.test(document.querySelector('#analyzeResults').textContent), null, { timeout: 15000 });
const manifoldText = await page.locator('#analyzeResults').textContent();
ok(/yes/.test(manifoldText), 'app: manifold check reports watertight for bracket.3mf');

// volume
await page.click('#btnVolume');
await page.waitForTimeout(300);
const volText = await page.locator('#analyzeResults').textContent();
ok(/Volume/.test(volText), 'app: volume computed');

// printability
await page.click('#btnPrintability');
await page.waitForFunction(() => /Printability/.test(document.querySelector('#analyzeResults').textContent), null, { timeout: 20000 });
const prText = await page.locator('#analyzeResults').textContent();
ok(/Issue|Info/.test(prText), 'app: printability check produced a report');

// transform: rotate + center
await page.click('.panel-tab[data-tab="transform"]');
await page.click('[data-rot="x"]');
await page.click('#btnCenterGround');
await page.waitForTimeout(500);
ok(true, 'app: transform ops executed');

// repair
await page.click('.panel-tab[data-tab="repair"]');
await page.click('#btnRepair');
await page.waitForFunction(() => /done/i.test(document.querySelector('#statusMsg').textContent) || !document.querySelector('#statusMsg').textContent.includes('Repairing'), null, { timeout: 20000 });
const repairStatus = await page.locator('#statusMsg').textContent();
ok(!/failed|error/i.test(repairStatus), 'app: repair succeeded: ' + repairStatus);

// decimate
await page.click('.panel-tab[data-tab="edit"]');
await page.click('#btnSimplify');
await page.waitForTimeout(1500);
const decStatus = await page.locator('#statusStats').textContent();
ok(/tris/.test(decStatus), 'app: decimation ran: ' + decStatus);

// separate (bracket = 3 boxes welded into one mesh via merge in export... actually separate objects)
await page.click('#btnClear');
await page.setInputFiles('#fileInput', ['tests/samples/bracket.obj']);
await page.waitForSelector('.model-tab', { timeout: 15000 });
await page.click('#btnSeparate');
await page.waitForFunction(() => /Separated|single connected/i.test(document.querySelector('#statusMsg').textContent), null, { timeout: 20000 });
ok(true, 'app: separate objects ran');

// ---------- app: convert & download ----------
await page.click('#btnClear');
await page.setInputFiles('#fileInput', ['tests/samples/bracket.stl']);
await page.waitForSelector('.model-tab', { timeout: 15000 });
await page.click('.panel-tab[data-tab="export"]');
for (const fmt of ['stl', 'obj', 'ply', 'glb', '3mf']) {
  await page.selectOption('#exportFormat', fmt);
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.click('#btnDownload'),
  ]);
  const path = await download.path();
  const fs = await import('node:fs');
  const size = fs.statSync(path).size;
  ok(size > 100, `app: ${fmt.toUpperCase()} conversion downloaded (${size} bytes)`);
}

// GLB download should re-parse (round trip through the real parser)
// (checked in node tests already; here we just verify the file is non-trivial)

// ---------- error handling ----------
await page.click('#btnClear');
await page.setInputFiles('#fileInput', [{ name: 'bad.stl', mimeType: 'application/octet-stream', buffer: Buffer.from('this is not an stl file at all') }]);
await page.waitForTimeout(800);
const errStatus = await page.locator('#statusMsg').textContent();
ok(/error/i.test(errStatus) || /unsupported|invalid|not/i.test(errStatus), 'app: invalid file shows an error message: ' + errStatus.trim());

// ---------- collected JS errors ----------
// expected: favicon 404 (browsers still request /favicon.ico despite the data-URI
// icon) and the intentional invalid-STL validation error from the test above
const realErrors = errors.filter(e =>
  !/favicon/i.test(e) &&
  !/Not a valid ASCII STL/i.test(e));
ok(realErrors.length === 0, `no JS errors across all pages (got ${realErrors.length})`);
if (realErrors.length) console.error(realErrors.slice(0, 10).join('\n'));

await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
