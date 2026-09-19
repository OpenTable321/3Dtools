// Static site generator. Run: node site/build-site.mjs
// Produces all marketing/SEO pages as plain HTML (no server, no build framework).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE_URL } from './pages-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function esc(s) {
  return String(s).replace(/\u0026/g, '\u0026amp;').replace(/</g, '\u0026lt;').replace(/>/g, '\u0026gt;');
}

function header(path) {
  const links = [
    ['/', 'Home'],
    ['/tools.html', 'All Tools'],
    ['/formats.html', 'Formats'],
    ['/viewer/stl-viewer.html', 'Viewers'],
    ['/mesh-tools.html', 'Mesh Tools'],
    ['/3d-printing-tools.html', '3D Printing'],
    ['/about.html', 'About'],
  ];
  return `<header class="site-header">
  <div class="inner">
    <a class="logo" href="/"><span class="cube"></span>3DTools</a>
    <nav class="main-nav" aria-label="Main navigation">
      ${links.map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
    </nav>
    <button class="lang-toggle" type="button" aria-label="Переключить на русский">RU</button>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="inner">
    <div>
      <h4>3DTools</h4>
      <p style="color:var(--text-dim);font-size:.85rem;margin:0">Free browser-based 3D model tools. All processing happens locally on your device — no uploads, no accounts, no tracking of your files.</p>
    </div>
    <div>
      <h4>Viewers</h4>
      <ul>
        <li><a href="/viewer/stl-viewer.html">STL Viewer</a></li>
        <li><a href="/viewer/obj-viewer.html">OBJ Viewer</a></li>
        <li><a href="/viewer/glb-gltf-viewer.html">GLB/GLTF Viewer</a></li>
        <li><a href="/viewer/ply-viewer.html">PLY Viewer</a></li>
        <li><a href="/viewer/3mf-viewer.html">3MF Viewer</a></li>
        <li><a href="/viewer/multi-model-viewer.html">Multi-Model Viewer</a></li>
      </ul>
    </div>
    <div>
      <h4>Converters</h4>
      <ul>
        <li><a href="/convert/stl-to-obj.html">STL to OBJ</a></li>
        <li><a href="/convert/obj-to-stl.html">OBJ to STL</a></li>
        <li><a href="/convert/stl-to-3mf.html">STL to 3MF</a></li>
        <li><a href="/convert/obj-to-glb.html">OBJ to GLB</a></li>
        <li><a href="/convert/glb-to-obj.html">GLB to OBJ</a></li>
        <li><a href="/convert/gltf-to-glb.html">GLTF to GLB</a></li>
        <li><a href="/convert/ply-to-obj.html">PLY to OBJ</a></li>
        <li><a href="/convert/3mf-to-stl.html">3MF to STL</a></li>
      </ul>
    </div>
    <div>
      <h4>Toolbox</h4>
      <ul>
        <li><a href="/mesh-tools.html">Mesh Repair & Editing</a></li>
        <li><a href="/3d-printing-tools.html">3D Printing Tools</a></li>
        <li><a href="/app.html">Open Studio</a></li>
      </ul>
    </div>
    <div>
      <h4>Site</h4>
      <ul>
        <li><a href="/about.html">About</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/privacy.html">Privacy Policy</a></li>
        <li><a href="/terms.html">Terms of Use</a></li>
        <li><a href="/disclaimer.html">Disclaimer</a></li>
        <li><a href="/sitemap.xml">Sitemap</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-note wrap">\u0026copy; ${new Date().getFullYear()} 3DTools. 3DTools processes models locally in your browser and never receives your files.</div>
</footer>`;
}

function breadcrumbs(crumbs) {
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs.map(([href, label]) => ` \u0026rsaquo; <a href="${href}">${label}</a>`).join('')}</nav>`;
}

function jsonLd(page) {
  const blocks = [];
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.jsonLdName || page.title,
    url: SITE_URL + page.path,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any (modern browser)',
    browserRequirements: 'Requires WebGL',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: page.description,
  };
  blocks.push(app);
  if (page.crumbs) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        ...page.crumbs.map(([href, label], i) => ({ '@type': 'ListItem', position: i + 2, name: label, item: SITE_URL + href }))],
    });
  }
  if (page.faq && page.faq.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }
  return blocks.map(b => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

function render(page) {
  const crumbs = page.crumbs ? breadcrumbs(page.crumbs) : '';
  const heroCta = page.cta
    ? `<div class="wrap" style="padding-top:1.2rem"><a class="btn primary" href="${page.cta.href}">${esc(page.cta.label)}</a> <span style="color:var(--text-dim);font-size:.9rem;margin-left:.6rem">${esc(page.ctaNote || 'Runs locally in your browser — your file never leaves your device.')}</span></div>`
    : '';
  const sections = (page.sections || [])
    .map(s => `<section class="content-block"><div class="wrap"><h2 id="${s.id || ''}">${s.h2}</h2>${s.html}</div></section>`)
    .join('\n');
  const faq = page.faq && page.faq.length
    ? `<section class="content-block"><div class="wrap"><h2 id="faq">Frequently Asked Questions</h2><div class="faq">${page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n')}</div></div></section>`
    : '';
  const related = page.related && page.related.length
    ? `<section class="content-block"><div class="wrap"><h2 id="related">Related Tools</h2><div class="card-grid">${page.related.map(([href, name, desc]) => `<a class="card" href="${href}"><span class="tag">${href.startsWith('/viewer') ? 'Viewer' : href.startsWith('/convert') ? 'Converter' : 'Tool'}</span><h3>${esc(name)}</h3><p>${esc(desc)}</p></a>`).join('')}</div></div></section>`
    : '';
  const ads = `<div class="wrap"><div class="ad-slot" aria-label="Advertisement"></div></div>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${page.path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="3DTools">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${SITE_URL}${page.path}">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234f7cff' d='M12 2 3 7v10l9 5 9-5V7z'/%3E%3C/svg%3E">
${jsonLd(page)}
</head>
<body>
${header(page.path)}
${crumbs}
<div class="page-hero"><div class="wrap">
<h1>${page.h1}</h1>
${page.intro || ''}
${heroCta}
</div></div>
${sections}
${ads}
${faq}
${related}
${footer()}
<script src="/assets/js/i18n.js" defer></script>
</body>
</html>
`;
}

let count = 0;
for (const page of PAGES) {
  const rel = page.path === '/' ? 'index.html' : page.path.replace(/^\//, '');
  const out = join(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(page));
  count++;
  console.log('wrote', page.path);
}

// robots.txt
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

// sitemap.xml (app.html is hand-written, not in PAGES)
const urls = [...PAGES.filter(p => p.path !== '/404.html'), { path: '/app.html' }];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.path === '/' ? '1.0' : p.path === '/app.html' ? '0.9' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log('wrote robots.txt, sitemap.xml');
console.log(`\nDone: ${count} pages.`);
