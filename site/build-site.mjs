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

const NAV_LINKS = [
  ['/', 'Home', 'Главная'],
  ['/tools.html', 'All Tools', 'Все инструменты'],
  ['/formats.html', 'Formats', 'Форматы'],
  ['/viewer/stl-viewer.html', 'Viewers', 'Просмотр'],
  ['/mesh-tools.html', 'Mesh Tools', 'Инструменты меша'],
  ['/3d-printing-tools.html', '3D Printing', '3D-печать'],
  ['/about.html', 'About', 'О сайте'],
];

function header(path) {
  const isRu = path.startsWith('/ru/') || path === '/ru';
  const enPath = isRu ? (path.slice(3) || '/') : path;
  const links = NAV_LINKS.map(([href, en, ru]) => [isRu ? '/ru' + href : href, isRu ? ru : en]);
  const toggle = isRu
    ? `<a class="lang-toggle" href="${enPath}">EN</a>`
    : `<a class="lang-toggle" href="/ru${path === '/' ? '/' : path}">RU</a>`;
  return `<header class="site-header">
  <div class="inner">
    <a class="logo" href="${isRu ? '/ru/' : '/'}"><span class="cube"></span>3DTools</a>
    <nav class="main-nav" aria-label="Main navigation">
      ${links.map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
    </nav>
    ${toggle}
  </div>
</header>`;
}

function footer(isRu) {
  const L = isRu ? {
    tagline: 'Бесплатные браузерные инструменты для 3D-моделей. Вся обработка выполняется локально на вашем устройстве — без загрузок, аккаунтов и отслеживания файлов.',
    viewers: 'Просмотр', converters: 'Конвертеры', toolbox: 'Инструменты', site: 'Сайт',
    stl: 'Просмотр STL', obj: 'Просмотр OBJ', glb: 'Просмотр GLB/GLTF', ply: 'Просмотр PLY', mf: 'Просмотр 3MF', multi: 'Мульти-просмотр',
    c1: 'STL в OBJ', c2: 'OBJ в STL', c3: 'STL в 3MF', c4: 'OBJ в GLB', c5: 'GLB в OBJ', c6: 'GLTF в GLB', c7: 'PLY в OBJ', c8: '3MF в STL',
    mesh: 'Ремонт и правка меша', print: 'Инструменты 3D-печати', studio: 'Открыть студию',
    about: 'О сайте', contact: 'Контакты', privacy: 'Политика конфиденциальности', terms: 'Условия использования', disclaimer: 'Отказ от ответственности', sitemap: 'Карта сайта',
    note: '3DTools обрабатывает модели локально в вашем браузере и никогда не получает ваши файлы.',
    p: (h) => '/ru' + h,
  } : {
    tagline: 'Free browser-based 3D model tools. All processing happens locally on your device — no uploads, no accounts, no tracking of your files.',
    viewers: 'Viewers', converters: 'Converters', toolbox: 'Toolbox', site: 'Site',
    stl: 'STL Viewer', obj: 'OBJ Viewer', glb: 'GLB/GLTF Viewer', ply: 'PLY Viewer', mf: '3MF Viewer', multi: 'Multi-Model Viewer',
    c1: 'STL to OBJ', c2: 'OBJ to STL', c3: 'STL to 3MF', c4: 'OBJ to GLB', c5: 'GLB to OBJ', c6: 'GLTF to GLB', c7: 'PLY to OBJ', c8: '3MF to STL',
    mesh: 'Mesh Repair & Editing', print: '3D Printing Tools', studio: 'Open Studio',
    about: 'About', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Use', disclaimer: 'Disclaimer', sitemap: 'Sitemap',
    note: '3DTools processes models locally in your browser and never receives your files.',
    p: (h) => h,
  };
  return `<footer class="site-footer">
  <div class="inner">
    <div>
      <h4>3DTools</h4>
      <p style="color:var(--text-dim);font-size:.85rem;margin:0">${L.tagline}</p>
    </div>
    <div>
      <h4>${L.viewers}</h4>
      <ul>
        <li><a href="${L.p('/viewer/stl-viewer.html')}">${L.stl}</a></li>
        <li><a href="${L.p('/viewer/obj-viewer.html')}">${L.obj}</a></li>
        <li><a href="${L.p('/viewer/glb-gltf-viewer.html')}">${L.glb}</a></li>
        <li><a href="${L.p('/viewer/ply-viewer.html')}">${L.ply}</a></li>
        <li><a href="${L.p('/viewer/3mf-viewer.html')}">${L.mf}</a></li>
        <li><a href="${L.p('/viewer/multi-model-viewer.html')}">${L.multi}</a></li>
      </ul>
    </div>
    <div>
      <h4>${L.converters}</h4>
      <ul>
        <li><a href="${L.p('/convert/stl-to-obj.html')}">${L.c1}</a></li>
        <li><a href="${L.p('/convert/obj-to-stl.html')}">${L.c2}</a></li>
        <li><a href="${L.p('/convert/stl-to-3mf.html')}">${L.c3}</a></li>
        <li><a href="${L.p('/convert/obj-to-glb.html')}">${L.c4}</a></li>
        <li><a href="${L.p('/convert/glb-to-obj.html')}">${L.c5}</a></li>
        <li><a href="${L.p('/convert/gltf-to-glb.html')}">${L.c6}</a></li>
        <li><a href="${L.p('/convert/ply-to-obj.html')}">${L.c7}</a></li>
        <li><a href="${L.p('/convert/3mf-to-stl.html')}">${L.c8}</a></li>
      </ul>
    </div>
    <div>
      <h4>${L.toolbox}</h4>
      <ul>
        <li><a href="${L.p('/mesh-tools.html')}">${L.mesh}</a></li>
        <li><a href="${L.p('/3d-printing-tools.html')}">${L.print}</a></li>
        <li><a href="/app.html">${L.studio}</a></li>
      </ul>
    </div>
    <div>
      <h4>${L.site}</h4>
      <ul>
        <li><a href="${L.p('/about.html')}">${L.about}</a></li>
        <li><a href="${L.p('/contact.html')}">${L.contact}</a></li>
        <li><a href="${L.p('/privacy.html')}">${L.privacy}</a></li>
        <li><a href="${L.p('/terms.html')}">${L.terms}</a></li>
        <li><a href="${L.p('/disclaimer.html')}">${L.disclaimer}</a></li>
        <li><a href="/sitemap.xml">${L.sitemap}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-note wrap">\u0026copy; ${new Date().getFullYear()} 3DTools. ${L.note}</div>
</footer>`;
}

function breadcrumbs(crumbs, isRu) {
  const home = isRu ? 'Главная' : 'Home';
  const p = (h) => (isRu ? '/ru' + h : h);
  const rest = crumbs[0] && crumbs[0][0] === '/' ? crumbs.slice(1) : crumbs;
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="${p('/')}">${home}</a>${rest.map(([href, label]) => ` \u0026rsaquo; <a href="${p(href)}">${label}</a>`).join('')}</nav>`;
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
    const isRu = page.path.startsWith('/ru/') || page.path === '/ru';
    const pref = isRu ? '/ru' : '';
    const rest = page.crumbs[0] && page.crumbs[0][0] === '/' ? page.crumbs.slice(1) : page.crumbs;
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: SITE_URL + pref + '/' },
        ...rest.map(([href, label], i) => ({ '@type': 'ListItem', position: i + 2, name: label, item: SITE_URL + pref + href }))],
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
  const isRu = page.path.startsWith('/ru/') || page.path === '/ru';
  const enPath = isRu ? (page.path.slice(3) || '/') : page.path;
  const ruPath = '/ru' + (enPath === '/' ? '/' : enPath);
  const crumbs = page.crumbs ? breadcrumbs(page.crumbs, isRu) : '';
  const ctaNoteDefault = isRu
    ? 'Работает локально в вашем браузере — файл не покидает ваше устройство.'
    : 'Runs locally in your browser — your file never leaves your device.';
  const heroCta = page.cta
    ? `<div class="wrap" style="padding-top:1.2rem"><a class="btn primary" href="${page.cta.href}">${esc(page.cta.label)}</a> <span style="color:var(--text-dim);font-size:.9rem;margin-left:.6rem">${esc(page.ctaNote || ctaNoteDefault)}</span></div>`
    : '';
  const sections = (page.sections || [])
    .map(s => `<section class="content-block"><div class="wrap"><h2 id="${s.id || ''}">${s.h2}</h2>${s.html}</div></section>`)
    .join('\n');
  const faqTitle = isRu ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions';
  const faq = page.faq && page.faq.length
    ? `<section class="content-block"><div class="wrap"><h2 id="faq">${faqTitle}</h2><div class="faq">${page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n')}</div></div></section>`
    : '';
  const relTitle = isRu ? 'Похожие инструменты' : 'Related Tools';
  const tagOf = (href) => href.startsWith('/viewer') ? (isRu ? 'Просмотр' : 'Viewer') : href.startsWith('/convert') ? (isRu ? 'Конвертер' : 'Converter') : (isRu ? 'Инструмент' : 'Tool');
  const related = page.related && page.related.length
    ? `<section class="content-block"><div class="wrap"><h2 id="related">${relTitle}</h2><div class="card-grid">${page.related.map(([href, name, desc]) => `<a class="card" href="${isRu ? '/ru' + href : href}"><span class="tag">${tagOf(href)}</span><h3>${esc(name)}</h3><p>${esc(desc)}</p></a>`).join('')}</div></div></section>`
    : '';
  const ads = `<div class="wrap"><div class="ad-slot" aria-label="Advertisement"></div></div>`;
  return `<!DOCTYPE html>
<html lang="${isRu ? 'ru' : 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google-site-verification" content="_cO61RNkjtmNOgD7hPlizj7GaAOmBl3Q21VocD8n3ig">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${page.path}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}">
<link rel="alternate" hreflang="ru" href="${SITE_URL}${ruPath}">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}">
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
${footer(isRu)}
</body>
</html>
`;
}

let count = 0;
const written = [];
for (const page of PAGES) {
  const rel = page.path === '/' ? 'index.html' : page.path.replace(/^\//, '');
  const out = join(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(page));
  count++;
  written.push(page.path);
  console.log('wrote', page.path);

  if (page.ru) {
    const ruPage = { ...page, ...page.ru, path: '/ru' + (page.path === '/' ? '/' : page.path) };
    const ruRel = 'ru/' + rel;
    const ruOut = join(ROOT, ruRel);
    mkdirSync(dirname(ruOut), { recursive: true });
    writeFileSync(ruOut, render(ruPage));
    count++;
    written.push(ruPage.path);
    console.log('wrote', ruPage.path);
  }
}

// robots.txt
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

// sitemap.xml (app.html is hand-written, not in PAGES)
const urls = [...PAGES.filter(p => p.path !== '/404.html'), { path: '/app.html' }];
const allUrls = [...urls, ...urls.filter(p => PAGES.find(pg => pg.path === p.path && pg.ru)).map(p => ({ path: '/ru' + (p.path === '/' ? '/' : p.path) }))];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.path === '/' ? '1.0' : p.path === '/app.html' ? '0.9' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log('wrote robots.txt, sitemap.xml');
console.log(`\nDone: ${count} pages.`);
