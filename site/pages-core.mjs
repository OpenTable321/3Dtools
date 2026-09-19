// Core site pages: home, tools index, formats, mesh/print tool hubs, legal, 404.
export const CORE_PAGES = [

// ---------------- home ----------------
{
  path: '/',
  title: '3DTools — Free Local 3D Model Viewer, Converter & Mesh Repair',
  description: 'View, convert, repair and analyze STL, OBJ, GLB, PLY and 3MF models entirely in your browser. No uploads, no accounts — every operation runs locally on your device.',
  h1: '3D model tools that never see your files',
  intro: `<p>3DTools is a browser-based toolbox for triangle meshes: a fast WebGL viewer, format converters, mesh repair and editing, and 3D-printing analysis. Everything runs <strong>locally in your browser</strong> — there is no server, no upload and no account. Your models never leave your device.</p>`,
  cta: { href: '/app.html', label: 'Open 3DTools Studio' },
  ctaNote: 'No sign-up. Drop in a file and start working.',
  sections: [
    { id: 'tools', h2: 'What you can do', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">View</span><h3>View any major format</h3><p>STL, OBJ, GLB/GLTF, PLY and 3MF — with wireframe, x-ray, normal and vertex inspection modes, measurement and cross-sections.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>Convert between formats</h3><p>Eight well-defined conversion paths between the five supported formats, processed locally with real error messages.</p></a>
  <a class="card" href="/mesh-tools.html"><span class="tag">Repair</span><h3>Repair and edit meshes</h3><p>Weld duplicate vertices, fix winding and inside-out meshes, remove degenerate faces, decimate, hollow, cut and split.</p></a>
  <a class="card" href="/3d-printing-tools.html"><span class="tag">Print</span><h3>Prepare for 3D printing</h3><p>Manifold and watertight checks, overhang detection, wall thickness estimation, printability report and orientation tools.</p></a>
</div>` },
    { id: 'how', h2: 'How it works', html: `
<p>3DTools is a static website. The entire application — parsers for every format, mesh algorithms and the WebGL renderer — is plain JavaScript that your browser downloads once. Files you open are read with the browser's File API and parsed in memory; heavy operations run in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Workers</a> so the interface never freezes. When you convert a model, the result is assembled in memory and handed to your browser's download manager. At no point does any model data travel over the network.</p>
<div class="callout"><strong>No fake buttons.</strong> Every tool on this site is a real implementation with documented limitations — where an operation is approximate (e.g., wall-thickness estimation), the interface says so.</div>` },
    { id: 'who', h2: 'Who it is for', html: `
<p><strong>3D printing users</strong> check printability, repair downloaded models and convert between STL, OBJ and 3MF. <strong>Developers</strong> inspect glTF assets and verify mesh data. <strong>Designers</strong> quickly preview files without installing a full CAD suite. If you need full CAD (parametric solids, booleans on NURBS, assemblies with constraints), 3DTools is not that — it is a mesh toolbox, and it does not pretend otherwise.</p>` },
  ],
  faq: [
    ['Is 3DTools really free?', 'Yes. There is no account system, no paid tier and no file limit enforced by a server — because there is no server.'],
    ['Where are my files processed?', 'Entirely on your device, in your browser. The site is static hosting; nothing you open is transmitted anywhere.'],
    ['Which formats are supported?', 'STL (binary + ASCII), OBJ, PLY (binary + ASCII, incl. point clouds), GLB and GLTF 2.0, and 3MF (core spec). See the <a href="/formats.html">formats page</a> for details and limitations.'],
    ['Does it work offline?', 'Once the page has loaded, yes — no network requests are made during model processing.'],
    ['What are the hardware requirements?', 'Any machine with a WebGL-capable browser. Large meshes are handled in a worker thread; very large files are limited by your device\u2019s memory.'],
  ],
  related: [
    ['/viewer/stl-viewer.html', 'STL Viewer', 'Inspect STL files with wireframe, x-ray and section views.'],
    ['/mesh-tools.html', 'Mesh Tools', 'Repair, decimate, hollow, cut and merge meshes.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Manifold, overhang and printability analysis.'],
    ['/formats.html', 'Supported Formats', 'What each format contains and what 3DTools does with it.'],
  ],
  ru: {
    title: '3DTools — бесплатный просмотр, конвертация и ремонт 3D-моделей локально',
    description: 'Просматривайте, конвертируйте, ремонтируйте и анализируйте модели STL, OBJ, GLB, PLY и 3MF прямо в браузере. Без загрузок и аккаунтов — всё выполняется локально на вашем устройстве.',
    h1: 'Инструменты для 3D-моделей, которые не видят ваши файлы',
    intro: `<p>3DTools — браузерный набор инструментов для треугольных мешей: быстрый WebGL-просмотр, конвертеры форматов, ремонт и редактирование мешей, анализ для 3D-печати. Всё работает <strong>локально в вашем браузере</strong> — нет сервера, загрузок и аккаунтов. Ваши модели не покидают устройство.</p>`,
    cta: { href: '/app.html', label: 'Открыть студию 3DTools' },
    ctaNote: 'Без регистрации. Перетащите файл и начинайте работать.',
    sections: [
      { id: 'tools', h2: 'Что можно делать', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр основных форматов</h3><p>STL, OBJ, GLB/GLTF, PLY и 3MF — с режимами каркаса, рентгена, нормалей и вершин, измерениями и сечениями.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Конвертация</span><h3>Конвертация между форматами</h3><p>Восемь чётко определённых путей конвертации между пятью поддерживаемыми форматами, локально и с понятными ошибками.</p></a>
  <a class="card" href="/mesh-tools.html"><span class="tag">Ремонт</span><h3>Ремонт и правка мешей</h3><p>Сварка дублей вершин, исправление обхода и вывернутых мешей, удаление вырожденных граней, децимация, полости, резка и разделение.</p></a>
  <a class="card" href="/3d-printing-tools.html"><span class="tag">Печать</span><h3>Подготовка к 3D-печати</h3><p>Проверки замкнутости и водонепроницаемости, поиск нависаний, оценка толщины стенок, отчёт о пригодности к печати и ориентация.</p></a>
</div>` },
      { id: 'how', h2: 'Как это работает', html: `
<p>3DTools — статический сайт. Всё приложение — парсеры всех форматов, алгоритмы мешей и WebGL-рендерер — это обычный JavaScript, который браузер загружает один раз. Открываемые файлы читаются через File API и парсятся в памяти; тяжёлые операции выполняются в <a href="https://developer.mozilla.org/ru/docs/Web/API/Web_Workers_API">Web Workers</a>, поэтому интерфейс не зависает. При конвертации результат собирается в памяти и передаётся менеджеру загрузок браузера. Данные модели никогда не передаются по сети.</p>
<div class="callout"><strong>Никаких фальшивых кнопок.</strong> Каждый инструмент на сайте — реальная реализация с задокументированными ограничениями: где операция приближённая (например, оценка толщины стенок), интерфейс прямо об этом говорит.</div>` },
      { id: 'who', h2: 'Для кого это', html: `
<p><strong>Пользователи 3D-печати</strong> проверяют пригодность к печати, ремонтируют скачанные модели и конвертируют между STL, OBJ и 3MF. <strong>Разработчики</strong> инспектируют glTF-ассеты и проверяют данные мешей. <strong>Дизайнеры</strong> быстро просматривают файлы без установки полноценного CAD. Если нужен полный CAD (параметрические тела, булевы операции на NURBS, сборки с ограничениями) — 3DTools не про это: это набор инструментов для мешей, и он не претендует на большее.</p>` },
    ],
    faq: [
      ['3DTools действительно бесплатный?', 'Да. Нет системы аккаунтов, платных тарифов и серверных ограничений на файлы — потому что нет и сервера.'],
      ['Где обрабатываются мои файлы?', 'Полностью на вашем устройстве, в браузере. Сайт — статический хостинг; ничто из открытого никуда не передаётся.'],
      ['Какие форматы поддерживаются?', 'STL (бинарный + ASCII), OBJ, PLY (бинарный + ASCII, включая облака точек), GLB и GLTF 2.0, а также 3MF (базовая спецификация). Подробности и ограничения — на <a href="/formats.html">странице форматов</a>.'],
      ['Работает ли офлайн?', 'После загрузки страницы — да: при обработке моделей сетевых запросов не выполняется.'],
      ['Какие требования к железу?', 'Любая машина с браузером, поддерживающим WebGL. Большие меши обрабатываются в worker-потоке; очень большие файлы ограничены памятью устройства.'],
    ],
    related: [
      ['/viewer/stl-viewer.html', 'Просмотр STL', 'Инспектируйте STL-файлы с каркасом, рентгеном и сечениями.'],
      ['/mesh-tools.html', 'Инструменты меша', 'Ремонт, децимация, полости, резка и объединение мешей.'],
      ['/3d-printing-tools.html', 'Инструменты 3D-печати', 'Анализ замкнутости, нависаний и пригодности к печати.'],
      ['/formats.html', 'Поддерживаемые форматы', 'Что содержит каждый формат и что с ним делает 3DTools.'],
    ],
  },
},

// ---------------- tools index ----------------
{
  path: '/tools.html',
  title: 'All 3D Tools — Viewers, Converters, Mesh & Printing Tools | 3DTools',
  description: 'Complete list of 3DTools: format viewers, converters, mesh repair and editing tools, and 3D-printing analysis — all free, local and browser-based.',
  h1: 'All tools',
  intro: `<p>Every tool below is a real, working implementation running locally in your browser. The studio on the right side panel organizes them into View, Transform, Repair, Edit, Analyze and Convert.</p>`,
  cta: { href: '/app.html', label: 'Open the Studio' },
  sections: [
    { id: 'viewers', h2: 'Viewers', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Viewer</span><h3>STL Viewer</h3><p>Binary and ASCII STL, with manifold check and repair pipeline.</p></a>
  <a class="card" href="/viewer/obj-viewer.html"><span class="tag">Viewer</span><h3>OBJ Viewer</h3><p>Objects, groups, normals and UVs, multi-object tabs.</p></a>
  <a class="card" href="/viewer/glb-gltf-viewer.html"><span class="tag">Viewer</span><h3>GLB/GLTF Viewer</h3><p>glTF 2.0 assets with node transforms applied.</p></a>
  <a class="card" href="/viewer/ply-viewer.html"><span class="tag">Viewer</span><h3>PLY Viewer</h3><p>ASCII/binary PLY incl. vertex colors and point clouds.</p></a>
  <a class="card" href="/viewer/3mf-viewer.html"><span class="tag">Viewer</span><h3>3MF Viewer</h3><p>Unpack and inspect 3MF print projects with build transforms.</p></a>
  <a class="card" href="/viewer/multi-model-viewer.html"><span class="tag">Viewer</span><h3>Multi-Model Viewer</h3><p>Load many models side by side, compare, merge or split.</p></a>
  <a class="card" href="/viewer/inspection-views.html"><span class="tag">Viewer</span><h3>Wireframe / X-Ray / Normals / Vertices</h3><p>Inspection display modes for every format.</p></a>
</div>` },
    { id: 'converters', h2: 'Converters', html: `
<div class="card-grid">
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>STL \u2192 OBJ</h3><p>Weld triangle soup into a real indexed mesh.</p></a>
  <a class="card" href="/convert/obj-to-stl.html"><span class="tag">Convert</span><h3>OBJ \u2192 STL</h3><p>Flatten OBJ objects into printable STL.</p></a>
  <a class="card" href="/convert/stl-to-3mf.html"><span class="tag">Convert</span><h3>STL \u2192 3MF</h3><p>Wrap triangles in a modern 3MF package.</p></a>
  <a class="card" href="/convert/obj-to-glb.html"><span class="tag">Convert</span><h3>OBJ \u2192 GLB</h3><p>Produce single-file glTF web assets.</p></a>
  <a class="card" href="/convert/glb-to-obj.html"><span class="tag">Convert</span><h3>GLB \u2192 OBJ</h3><p>Extract editable geometry from glTF.</p></a>
  <a class="card" href="/convert/gltf-to-glb.html"><span class="tag">Convert</span><h3>GLTF \u2192 GLB</h3><p>Pack multi-file glTF into one .glb.</p></a>
  <a class="card" href="/convert/ply-to-obj.html"><span class="tag">Convert</span><h3>PLY \u2192 OBJ</h3><p>Turn scans into OBJ meshes.</p></a>
  <a class="card" href="/convert/3mf-to-stl.html"><span class="tag">Convert</span><h3>3MF \u2192 STL</h3><p>Unpack print projects for legacy slicers.</p></a>
</div>` },
    { id: 'mesh', h2: 'Mesh tools', html: `
<p>Scale, rotate, mirror, center and align; repair (weld, dedupe faces, fix winding); recalculate or flip normals; simplify/decimate with quadric error metrics; merge and separate objects; delete selected faces or vertices; hollow shells; add base plates; cut and split by plane. See the <a href="/mesh-tools.html">mesh tools page</a> for details and limitations of each operation.</p>` },
    { id: 'print', h2: '3D printing tools', html: `
<p>Printability check, manifold/watertight check, wall thickness (approximate), overhang detection, mesh statistics, bounding box, volume, surface area, orientation, cross sections, distance/angle measurement and viewport screenshots. See the <a href="/3d-printing-tools.html">3D printing tools page</a>.</p>` },
  ],
  faq: [
    ['Do I need to install anything?', 'No. The studio is a web page; all computation happens in your browser.'],
    ['Can I use several tools in a row?', 'Yes — the studio is a pipeline: load a file, repair it, decimate it, then convert and download. Each operation works on the current mesh.'],
    ['Which tools run in a worker?', 'All heavy operations (repair, decimation, hollowing, cutting, analysis) run in a Web Worker with a progress bar so the UI stays responsive.'],
  ],
  related: [
    ['/app.html', 'Open Studio', 'The full toolbox in one viewport.'],
    ['/formats.html', 'Supported Formats', 'Capabilities per format.'],
    ['/mesh-tools.html', 'Mesh Tools', 'Repair and editing details.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Analysis details.'],
  ],
  ru: {
    title: 'Все 3D-инструменты — просмотр, конвертеры, меш и печать | 3DTools',
    description: 'Полный список 3DTools: просмотр форматов, конвертеры, ремонт и редактирование мешей, анализ для 3D-печати — всё бесплатно, локально и в браузере.',
    h1: 'Все инструменты',
    intro: `<p>Каждый инструмент ниже — реальная рабочая реализация, выполняющаяся локально в вашем браузере. В студии они сгруппированы на боковой панели: Вид, Преобразование, Ремонт, Правка, Анализ и Конвертация.</p>`,
    cta: { href: '/app.html', label: 'Открыть студию' },
    sections: [
      { id: 'viewers', h2: 'Просмотр', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр STL</h3><p>Бинарный и ASCII STL, проверка замкнутости и конвейер ремонта.</p></a>
  <a class="card" href="/viewer/obj-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр OBJ</h3><p>Объекты, группы, нормали и UV, вкладки для нескольких объектов.</p></a>
  <a class="card" href="/viewer/glb-gltf-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр GLB/GLTF</h3><p>Ассеты glTF 2.0 с применёнными трансформациями узлов.</p></a>
  <a class="card" href="/viewer/ply-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр PLY</h3><p>ASCII/бинарный PLY, включая цвета вершин и облака точек.</p></a>
  <a class="card" href="/viewer/3mf-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр 3MF</h3><p>Распаковка и инспекция проектов 3MF с трансформациями сборки.</p></a>
  <a class="card" href="/viewer/multi-model-viewer.html"><span class="tag">Просмотр</span><h3>Мульти-просмотр</h3><p>Загрузка нескольких моделей рядом, сравнение, объединение или разделение.</p></a>
  <a class="card" href="/viewer/inspection-views.html"><span class="tag">Просмотр</span><h3>Каркас / Рентген / Нормали / Вершины</h3><p>Режимы инспекции для каждого формата.</p></a>
</div>` },
      { id: 'converters', h2: 'Конвертеры', html: `
<div class="card-grid">
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Конвертер</span><h3>STL \u2192 OBJ</h3><p>Сварка набора треугольников в настоящий индексированный меш.</p></a>
  <a class="card" href="/convert/obj-to-stl.html"><span class="tag">Конвертер</span><h3>OBJ \u2192 STL</h3><p>Сведение объектов OBJ в печатный STL.</p></a>
  <a class="card" href="/convert/stl-to-3mf.html"><span class="tag">Конвертер</span><h3>STL \u2192 3MF</h3><p>Упаковка треугольников в современный контейнер 3MF.</p></a>
  <a class="card" href="/convert/obj-to-glb.html"><span class="tag">Конвертер</span><h3>OBJ \u2192 GLB</h3><p>Создание однофайловых glTF-ассетов для веба.</p></a>
  <a class="card" href="/convert/glb-to-obj.html"><span class="tag">Конвертер</span><h3>GLB \u2192 OBJ</h3><p>Извлечение редактируемой геометрии из glTF.</p></a>
  <a class="card" href="/convert/gltf-to-glb.html"><span class="tag">Конвертер</span><h3>GLTF \u2192 GLB</h3><p>Упаковка многофайлового glTF в один .glb.</p></a>
  <a class="card" href="/convert/ply-to-obj.html"><span class="tag">Конвертер</span><h3>PLY \u2192 OBJ</h3><p>Превращение сканов в OBJ-меши.</p></a>
  <a class="card" href="/convert/3mf-to-stl.html"><span class="tag">Конвертер</span><h3>3MF \u2192 STL</h3><p>Распаковка проектов печати для старых слайсеров.</p></a>
</div>` },
      { id: 'mesh', h2: 'Инструменты меша', html: `
<p>Масштаб, поворот, отражение, центрирование и выравнивание; ремонт (сварка, удаление дублей граней, исправление обхода); пересчёт или инвертирование нормалей; упрощение/децимация с квадратичной метрикой ошибок; объединение и разделение объектов; удаление выделенных граней или вершин; создание полостей; добавление оснований; резка и разделение плоскостью. Подробности и ограничения каждой операции — на <a href="/mesh-tools.html">странице инструментов меша</a>.</p>` },
      { id: 'print', h2: 'Инструменты 3D-печати', html: `
<p>Проверка пригодности к печати, проверка замкнутости/водонепроницаемости, толщина стенок (приближённо), поиск нависаний, статистика меша, габаритный бокс, объём, площадь поверхности, ориентация, поперечные сечения, измерение расстояний/углов и скриншоты вьюпорта. См. <a href="/3d-printing-tools.html">страницу инструментов 3D-печати</a>.</p>` },
    ],
    faq: [
      ['Нужно ли что-то устанавливать?', 'Нет. Студия — это веб-страница; все вычисления выполняются в вашем браузере.'],
      ['Можно ли использовать несколько инструментов подряд?', 'Да — студия работает как конвейер: загрузите файл, отремонтируйте, упростите, затем конвертируйте и скачайте. Каждая операция применяется к текущему мешу.'],
      ['Какие инструменты работают в worker?', 'Все тяжёлые операции (ремонт, децимация, полости, резка, анализ) выполняются в Web Worker с индикатором прогресса, поэтому интерфейс остаётся отзывчивым.'],
    ],
    related: [
      ['/app.html', 'Открыть студию', 'Весь набор инструментов в одном вьюпорте.'],
      ['/formats.html', 'Поддерживаемые форматы', 'Возможности каждого формата.'],
      ['/mesh-tools.html', 'Инструменты меша', 'Подробности ремонта и редактирования.'],
      ['/3d-printing-tools.html', 'Инструменты 3D-печати', 'Подробности анализа.'],
    ],
  },
},

// ---------------- formats ----------------
{
  path: '/formats.html',
  title: 'Supported 3D File Formats — STL, OBJ, GLB/GLTF, PLY, 3MF | 3DTools',
  description: 'What 3DTools reads and writes: STL, OBJ, PLY, glTF 2.0 (GLB/GLTF) and 3MF — capabilities, variants and honest limitations of each format.',
  h1: 'Supported formats',
  intro: `<p>3DTools deliberately supports a small set of formats — deeply and honestly — instead of claiming to read everything. Below is exactly what is parsed, what is written, and what each format can and cannot contain.</p>`,
  cta: { href: '/app.html', label: 'Try it with your file' },
  sections: [
    { id: 'table', h2: 'Overview', html: `
<table class="data">
<tr><th>Format</th><th>Read</th><th>Write</th><th>Variants</th><th>Objects</th><th>Normals/UVs</th></tr>
<tr><td><a href="/viewer/stl-viewer.html">STL</a></td><td>Yes</td><td>Binary + ASCII</td><td>Binary, ASCII</td><td>Single solid</td><td>Normals only</td></tr>
<tr><td><a href="/viewer/obj-viewer.html">OBJ</a></td><td>Yes</td><td>Yes</td><td>Text</td><td>o/g groups</td><td>Both</td></tr>
<tr><td><a href="/viewer/ply-viewer.html">PLY</a></td><td>Yes</td><td>Binary + ASCII</td><td>ASCII, binary LE/BE</td><td>Single mesh</td><td>Both + colors</td></tr>
<tr><td><a href="/viewer/glb-gltf-viewer.html">GLB/GLTF</a></td><td>Yes</td><td>Both</td><td>glTF 2.0</td><td>Multiple</td><td>Both</td></tr>
<tr><td><a href="/viewer/3mf-viewer.html">3MF</a></td><td>Yes</td><td>Yes</td><td>Core spec</td><td>Multiple + transforms</td><td>Triangles only</td></tr>
</table>` },
    { id: 'stl', h2: 'STL', html: `
<p>The 3D-printing classic: a list of triangles with per-face normals, nothing else. No units, no colors, no object names. Binary STL packs each triangle into exactly 50 bytes; ASCII STL writes the same data as text and is roughly five times larger. 3DTools auto-detects the variant, tolerates truncated files by clipping to the triangles actually present, and recomputes ASCII normals (which are notoriously unreliable) from the geometry.</p>` },
    { id: 'obj', h2: 'OBJ', html: `
<p>Wavefront OBJ is a simple, human-readable text format for polygon meshes. Faces may reference vertices, texture coordinates and normals independently (including negative indices), and files can contain multiple objects and material groups. 3DTools triangulates n-gons, creates a separate model per object/material group and preserves normals and UVs. Material libraries (.mtl) are not required for viewing and are not written on export.</p>` },
    { id: 'ply', h2: 'PLY', html: `<p>Stanford PLY describes vertices and faces with a flexible, header-declared property schema — which is why it is the standard for 3D-scanner output. 3DTools reads all three encodings (ASCII, binary little-endian, binary big-endian) with any standard scalar type, handles list properties for faces, preserves vertex colors and renders face-less files (point clouds) as points.</p>` },
    { id: 'gltf', h2: 'GLB / GLTF', html: `<p>glTF 2.0 is the “JPEG of 3D”: a runtime format for the web. A .glb file packs JSON and binary into one chunked container; a .gltf file is JSON plus external .bin buffers. 3DTools parses both, applies node transforms (translation/rotation/scale/matrix), reads POSITION, NORMAL, TEXCOORD_0, COLOR_0 and index accessors with all standard component types, and rejects Draco/meshopt-compressed assets with a clear error. Exports are spec-compliant glTF 2.0 with correct buffer alignment.</p>` },
    { id: '3mf', h2: '3MF', html: `<p>3MF is a ZIP (OPC) package with an XML mesh model, designed by the 3MF Consortium to fix STL: explicit units, multiple named objects, build transforms and extension points. 3DTools reads and writes the core specification (objects, components, build items, transforms), unpacking containers locally with the browser's decompression API.</p>` },
    { id: 'not', h2: 'What is deliberately not supported', html: `
<ul>
<li><strong>F3D, STEP, IGES, 3DS, FBX, X3D, DAE, USDZ:</strong> these are CAD or scene-graph formats outside the scope of a mesh toolbox. 3DTools does not claim CAD support.</li>
<li><strong>Draco / meshopt compressed glTF:</strong> rejected with an explanatory error rather than a blank screen.</li>
<li><strong>Textures and PBR materials:</strong> geometry-focused pipeline; materials are kept as names only where the format supports it.</li>
</ul>` },
  ],
  faq: [
    ['Can you add format X?', 'Formats are added only when they can be implemented fully client-side and fit the mesh pipeline. The <a href="/contact.html">contact page</a> lists how to suggest one.'],
    ['Why no STEP support?', 'STEP is a CAD (BREP) format requiring a full geometry kernel; converting it honestly means embedding megabytes of WASM CAD code. Rather than fake it, 3DTools stays a mesh toolbox.'],
    ['Which format should I use for 3D printing?', '3MF if your slicer supports it (units, multiple objects), otherwise STL. OBJ works too but adds nothing for printing.'],
  ],
  related: [
    ['/tools.html', 'All Tools', 'Browse every viewer and converter.'],
    ['/viewer/stl-viewer.html', 'STL Viewer', 'Start with the most common format.'],
    ['/convert/gltf-to-glb.html', 'GLTF to GLB', 'Popular glTF packing tool.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Analysis for printed parts.'],
  ],
  ru: {
    title: 'Поддерживаемые форматы 3D-файлов — STL, OBJ, GLB/GLTF, PLY, 3MF | 3DTools',
    description: 'Что 3DTools читает и пишет: STL, OBJ, PLY, glTF 2.0 (GLB/GLTF) и 3MF — возможности, варианты и честные ограничения каждого формата.',
    h1: 'Поддерживаемые форматы',
    intro: `<p>3DTools сознательно поддерживает небольшой набор форматов — глубоко и честно — вместо заявлений о чтении всего подряд. Ниже точно указано, что парсится, что записывается и что каждый формат может и не может содержать.</p>`,
    cta: { href: '/app.html', label: 'Попробовать с вашим файлом' },
    sections: [
      { id: 'table', h2: 'Обзор', html: `
<table class="data">
<tr><th>Формат</th><th>Чтение</th><th>Запись</th><th>Варианты</th><th>Объекты</th><th>Нормали/UV</th></tr>
<tr><td><a href="/viewer/stl-viewer.html">STL</a></td><td>Да</td><td>Бинарный + ASCII</td><td>Бинарный, ASCII</td><td>Одно тело</td><td>Только нормали</td></tr>
<tr><td><a href="/viewer/obj-viewer.html">OBJ</a></td><td>Да</td><td>Да</td><td>Текст</td><td>Группы o/g</td><td>Оба</td></tr>
<tr><td><a href="/viewer/ply-viewer.html">PLY</a></td><td>Да</td><td>Бинарный + ASCII</td><td>ASCII, binary LE/BE</td><td>Один меш</td><td>Оба + цвета</td></tr>
<tr><td><a href="/viewer/glb-gltf-viewer.html">GLB/GLTF</a></td><td>Да</td><td>Оба</td><td>glTF 2.0</td><td>Несколько</td><td>Оба</td></tr>
<tr><td><a href="/viewer/3mf-viewer.html">3MF</a></td><td>Да</td><td>Да</td><td>Базовая спецификация</td><td>Несколько + трансформации</td><td>Только треугольники</td></tr>
</table>` },
      { id: 'stl', h2: 'STL', html: `
<p>Классика 3D-печати: список треугольников с нормалями граней — и больше ничего. Ни единиц, ни цветов, ни имён объектов. Бинарный STL упаковывает каждый треугольник ровно в 50 байт; ASCII STL записывает те же данные текстом и примерно в пять раз больше. 3DTools автоматически определяет вариант, терпимо относится к обрезанным файлам (обрезает до реально присутствующих треугольников) и пересчитывает ASCII-нормали (которые печально ненадёжны) из геометрии.</p>` },
      { id: 'obj', h2: 'OBJ', html: `
<p>Wavefront OBJ — простой человекочитаемый текстовый формат для полигональных мешей. Грани могут независимо ссылаться на вершины, текстурные координаты и нормали (включая отрицательные индексы), а файлы могут содержать несколько объектов и групп материалов. 3DTools триангулирует n-угольники, создаёт отдельную модель для каждого объекта/группы материалов и сохраняет нормали и UV. Библиотеки материалов (.mtl) для просмотра не требуются и при экспорте не записываются.</p>` },
      { id: 'ply', h2: 'PLY', html: `<p>Stanford PLY описывает вершины и грани гибкой схемой свойств, объявленной в заголовке — поэтому это стандарт для вывода 3D-сканеров. 3DTools читает все три кодировки (ASCII, binary little-endian, binary big-endian) с любым стандартным скалярным типом, обрабатывает списочные свойства граней, сохраняет цвета вершин и отображает файлы без граней (облака точек) как точки.</p>` },
      { id: 'gltf', h2: 'GLB / GLTF', html: `<p>glTF 2.0 — «JPEG для 3D»: рантайм-формат для веба. Файл .glb упаковывает JSON и бинарные данные в один чанковый контейнер; файл .gltf — это JSON плюс внешние .bin-буферы. 3DTools парсит оба, применяет трансформации узлов (translation/rotation/scale/matrix), читает аксессоры POSITION, NORMAL, TEXCOORD_0, COLOR_0 и индексы со всеми стандартными типами компонентов и отклоняет Draco/meshopt-сжатые ассеты с понятной ошибкой. Экспорт — соответствующий спецификации glTF 2.0 с корректным выравниванием буферов.</p>` },
      { id: '3mf', h2: '3MF', html: `<p>3MF — это ZIP-пакет (OPC) с XML-моделью меша, разработанный консорциумом 3MF для исправления недостатков STL: явные единицы, несколько именованных объектов, трансформации сборки и точки расширения. 3DTools читает и пишет базовую спецификацию (объекты, компоненты, элементы сборки, трансформации), распаковывая контейнеры локально через API декомпрессии браузера.</p>` },
      { id: 'not', h2: 'Что сознательно не поддерживается', html: `
<ul>
<li><strong>F3D, STEP, IGES, 3DS, FBX, X3D, DAE, USDZ:</strong> это CAD-форматы или форматы графов сцен вне области инструментов для мешей. 3DTools не заявляет поддержку CAD.</li>
<li><strong>glTF со сжатием Draco / meshopt:</strong> отклоняется с поясняющей ошибкой вместо пустого экрана.</li>
<li><strong>Текстуры и PBR-материалы:</strong> конвейер ориентирован на геометрию; материалы сохраняются только как имена там, где формат это поддерживает.</li>
</ul>` },
    ],
    faq: [
      ['Можете добавить формат X?', 'Форматы добавляются только если их можно полностью реализовать на стороне клиента и они вписываются в конвейер мешей. На <a href="/contact.html">странице контактов</a> указано, как предложить формат.'],
      ['Почему нет поддержки STEP?', 'STEP — CAD-формат (BREP), требующий полноценного геометрического ядра; честная конвертация означает встраивание мегабайт WASM-кода CAD. Вместо имитации 3DTools остаётся набором инструментов для мешей.'],
      ['Какой формат использовать для 3D-печати?', '3MF, если ваш слайсер его поддерживает (единицы, несколько объектов), иначе STL. OBJ тоже работает, но ничего не добавляет для печати.'],
    ],
    related: [
      ['/tools.html', 'Все инструменты', 'Все средства просмотра и конвертации.'],
      ['/viewer/stl-viewer.html', 'Просмотр STL', 'Начните с самого распространённого формата.'],
      ['/convert/gltf-to-glb.html', 'GLTF в GLB', 'Популярный инструмент упаковки glTF.'],
      ['/3d-printing-tools.html', 'Инструменты 3D-печати', 'Анализ для печатаемых деталей.'],
    ],
  },
},

// ---------------- mesh tools hub ----------------
{
  path: '/mesh-tools.html',
  title: 'Free Mesh Repair & Editing Tools — Local, Browser-Based | 3DTools',
  description: 'Repair, weld, decimate, hollow, cut, split, merge and transform 3D meshes in your browser. Honest descriptions of what each mesh operation does and its limits.',
  h1: 'Mesh repair & editing tools',
  intro: `<p>A complete set of mesh operations for fixing broken downloads, preparing prints and optimizing assets — all running locally in a Web Worker. Each tool below describes exactly what it does, and where an operation is approximate, it says so.</p>`,
  cta: { href: '/app.html?tool=repair', label: 'Open Mesh Tools' },
  sections: [
    { id: 'transform', h2: 'Transform tools', html: `
<ul>
<li><strong>Scale</strong> — uniform or per-axis, applied to vertices (and normals stay correct for uniform scale).</li>
<li><strong>Rotate</strong> — 90° shortcuts around X/Y/Z or arbitrary angles around any axis.</li>
<li><strong>Mirror</strong> — reflect across a plane perpendicular to X, Y or Z; triangle winding is flipped so the mesh stays valid.</li>
<li><strong>Center / Align</strong> — center the bounding box on the origin, drop the model so its lowest point sits at z=0 (ground), or both.</li>
</ul>` },
    { id: 'repair', h2: 'Repair tools', html: `
<ul>
<li><strong>Repair Mesh</strong> — one pipeline: weld duplicate vertices (spatial-hash with adjustable tolerance), remove degenerate and duplicate faces, make triangle winding globally consistent per component, flip inside-out closed meshes, recompute normals.</li>
<li><strong>Remove Duplicate Vertices</strong> — tolerance-based weld; STL-style triangle soups become real indexed meshes.</li>
<li><strong>Remove Duplicate Faces</strong> — drops triangles with identical vertex sets (either winding).</li>
<li><strong>Recalculate Normals</strong> — smooth vertex normals from face geometry; <strong>Flip Normals</strong> reverses winding and normals together.</li>
</ul>
<div class="callout">Limitations: repair fixes topology (duplicates, winding, orientation) and small gaps via vertex welding. It does not do hole-filling of large missing patches or remeshing.</div>` },
    { id: 'edit', h2: 'Editing tools', html: `
<ul>
<li><strong>Simplify / Decimate</strong> — quadric error-metric edge collapse (Garland–Heckbert) with border preservation; you choose the percentage of triangles to keep. UVs are dropped.</li>
<li><strong>Merge Objects</strong> — combine all loaded models into one mesh (also across formats).</li>
<li><strong>Separate Objects</strong> — split a mesh into connected components (by shared vertices).</li>
<li><strong>Delete Faces / Delete Vertices</strong> — Ctrl+Click faces or vertices to select, then delete; the mesh is re-indexed automatically.</li>
<li><strong>Hollow Model</strong> — builds an inward-offset inner shell (offset along vertex normals) merged with the outer surface. Approximation: concave regions thinner than twice the wall can self-intersect; run repair afterwards.</li>
<li><strong>Add Base</strong> — appends a rectangular base plate under the model footprint with configurable thickness and margin.</li>
<li><strong>Cut Model</strong> — keep one side of an axis-aligned plane, with optional planar cap (the cross-section polygon is triangulated with ear clipping, so the result stays watertight).</li>
<li><strong>Split Model</strong> — cut into two independent models (above/below the plane), each capped and downloadable separately.</li>
</ul>` },
    { id: 'why', h2: 'Why repair matters', html: `<p>Slicers and simulation tools need watertight, consistently wound meshes. Files from scans, downloads or careless exporters commonly contain duplicate vertices (every triangle isolated — the STL norm), zero-area triangles, flipped patches and double faces. The manifold check in the Analyze tab reports boundary and non-manifold edges; the repair pipeline fixes the mechanical problems. It will not invent missing geometry — large holes need a modeling tool.</p>` },
  ],
  faq: [
    ['Is decimation lossy?', 'Yes — reducing triangles always changes geometry. Quadric decimation minimizes surface error, and the progress/status shows the exact result. Keep a copy of the original.'],
    ['Why did hollow create weird geometry?', 'Naive inward offsetting self-intersects where the model is thinner than about twice the wall thickness or in sharp concavities. It works best on chunky, convex shapes; run Repair afterwards and inspect in X-Ray mode.'],
    ['How do I delete part of a model?', 'Select the Edit tab, choose Faces or Vertices selection mode, Ctrl+Click in the viewport to select, then Delete Selected.'],
    ['Can I undo an operation?', 'There is no undo stack — keep the original file and re-load it if an operation goes wrong.'],
  ],
  related: [
    ['/3d-printing-tools.html', '3D Printing Tools', 'Check the result for printability.'],
    ['/convert/stl-to-obj.html', 'STL to OBJ', 'Welds STL soups while converting.'],
    ['/viewer/inspection-views.html', 'Inspection Views', 'X-ray and wireframe for checking repairs.'],
    ['/app.html', 'Open Studio', 'All tools in one place.'],
  ],
  ru: {
    title: 'Бесплатные инструменты ремонта и правки мешей — локально, в браузере | 3DTools',
    description: 'Ремонт, сварка, децимация, полости, резка, разделение, объединение и трансформация 3D-мешей в браузере. Честные описания того, что делает каждая операция, и её ограничений.',
    h1: 'Инструменты ремонта и правки мешей',
    intro: `<p>Полный набор операций над мешами для исправления битых загрузок, подготовки к печати и оптимизации ассетов — всё выполняется локально в Web Worker. Каждый инструмент ниже описывает точно, что он делает, и где операция приближённая — об этом сказано прямо.</p>`,
    cta: { href: '/app.html?tool=repair', label: 'Открыть инструменты меша' },
    sections: [
      { id: 'transform', h2: 'Инструменты трансформации', html: `
<ul>
<li><strong>Масштаб</strong> — общий или по осям, применяется к вершинам (нормали остаются корректными при общем масштабе).</li>
<li><strong>Поворот</strong> — быстрые 90° вокруг X/Y/Z или произвольные углы вокруг любой оси.</li>
<li><strong>Зеркало</strong> — отражение через плоскость, перпендикулярную X, Y или Z; обход треугольников инвертируется, чтобы меш оставался валидным.</li>
<li><strong>Центрирование / выравнивание</strong> — центрирование габаритного бокса в начале координат, опускание модели так, чтобы нижняя точка была на z=0 (пол), или оба действия.</li>
</ul>` },
      { id: 'repair', h2: 'Инструменты ремонта', html: `
<ul>
<li><strong>Ремонт меша</strong> — один конвейер: сварка дублей вершин (пространственный хеш с настраиваемым допуском), удаление вырожденных и повторяющихся граней, глобально согласованный обход треугольников по компонентам, разворот вывернутых замкнутых мешей, пересчёт нормалей.</li>
<li><strong>Удалить дубли вершин</strong> — сварка по допуску; STL-подобные наборы треугольников становятся настоящими индексированными мешами.</li>
<li><strong>Удалить дубли граней</strong> — удаляет треугольники с идентичными наборами вершин (любого обхода).</li>
<li><strong>Пересчитать нормали</strong> — сглаженные нормали вершин из геометрии граней; <strong>Инвертировать нормали</strong> разворачивает обход и нормали вместе.</li>
</ul>
<div class="callout">Ограничения: ремонт исправляет топологию (дубли, обход, ориентацию) и мелкие зазоры через сварку вершин. Он не заполняет большие отсутствующие участки и не делает ремешинг.</div>` },
      { id: 'edit', h2: 'Инструменты редактирования', html: `
<ul>
<li><strong>Упрощение / децимация</strong> — коллапс рёбер по квадратичной метрике ошибок (Гарланд–Хекберт) с сохранением границ; вы выбираете процент оставляемых треугольников. UV отбрасываются.</li>
<li><strong>Объединить объекты</strong> — объединение всех загруженных моделей в один меш (в том числе между форматами).</li>
<li><strong>Разделить объекты</strong> — разбиение меша на связные компоненты (по общим вершинам).</li>
<li><strong>Удалить грани / вершины</strong> — Ctrl+клик по граням или вершинам для выделения, затем удаление; меш переиндексируется автоматически.</li>
<li><strong>Полая модель</strong> — строит внутреннюю оболочку со смещением внутрь (по нормалям вершин), объединённую с внешней поверхностью. Приближение: вогнутые области тоньше двойной толщины стенки могут самопересекаться; после этого запустите ремонт.</li>
<li><strong>Добавить основание</strong> — добавляет прямоугольную пластину под контуром модели с настраиваемой толщиной и отступом.</li>
<li><strong>Резка модели</strong> — оставляет одну сторону осевой плоскости с опциональной крышкой (полигон сечения триангулируется методом отсечения ушей, поэтому результат остаётся замкнутым).</li>
<li><strong>Разделение модели</strong> — резка на две независимые модели (выше/ниже плоскости), каждая с крышкой и скачивается отдельно.</li>
</ul>` },
      { id: 'why', h2: 'Зачем нужен ремонт', html: `<p>Слайсерам и инструментам симуляции нужны замкнутые меши с согласованным обходом. Файлы из сканов, загрузок или небрежных экспортеров часто содержат дубли вершин (каждый треугольник изолирован — норма для STL), треугольники нулевой площади, перевёрнутые участки и двойные грани. Проверка замкнутости на вкладке «Анализ» показывает граничные и немногообразные рёбра; конвейер ремонта исправляет механические проблемы. Он не дорисует отсутствующую геометрию — для больших дыр нужен инструмент моделирования.</p>` },
    ],
    faq: [
      ['Децимация — это с потерями?', 'Да — уменьшение числа треугольников всегда меняет геометрию. Квадратичная децимация минимизирует ошибку поверхности, а статус показывает точный результат. Сохраните копию оригинала.'],
      ['Почему полость создала странную геометрию?', 'Наивное смещение внутрь самопересекается там, где модель тоньше примерно двойной толщины стенки или в острых вогнутостях. Лучше всего работает на массивных выпуклых формах; после этого запустите «Ремонт» и проверьте в режиме «Рентген».'],
      ['Как удалить часть модели?', 'Откройте вкладку «Правка», выберите режим выделения «Грани» или «Вершины», Ctrl+клик во вьюпорте для выделения, затем «Удалить выделенное».'],
      ['Можно ли отменить операцию?', 'Стека отмены нет — сохраните исходный файл и загрузите его заново, если операция пошла не так.'],
    ],
    related: [
      ['/3d-printing-tools.html', 'Инструменты 3D-печати', 'Проверьте результат на пригодность к печати.'],
      ['/convert/stl-to-obj.html', 'STL в OBJ', 'Сваривает STL-наборы при конвертации.'],
      ['/viewer/inspection-views.html', 'Режимы инспекции', 'Рентген и каркас для проверки ремонта.'],
      ['/app.html', 'Открыть студию', 'Все инструменты в одном месте.'],
    ],
  },
},

// ---------------- 3d printing hub ----------------
{
  path: '/3d-printing-tools.html',
  title: '3D Printing Analysis Tools — Printability, Manifold, Overhangs | 3DTools',
  description: 'Free local 3D-printing checks: watertight/manifold verification, overhang detection, wall thickness estimation, volume, printability report, orientation and cross sections.',
  h1: '3D printing tools',
  intro: `<p>Check whether a model will actually print — before you waste filament. These analysis tools run locally on the mesh: watertightness, overhangs, wall thickness, size vs. printer volume, and a combined printability report.</p>`,
  cta: { href: '/app.html?tool=printability', label: 'Run a Printability Check' },
  sections: [
    { id: 'checks', h2: 'The checks', html: `
<ul>
<li><strong>Printability Check</strong> — one report combining all checks below with issues, warnings and notes.</li>
<li><strong>Manifold Check</strong> — exact topology test: counts boundary edges (holes), non-manifold edges and non-manifold vertices. A watertight mesh has zero of each.</li>
<li><strong>Overhang Detection</strong> — flags faces whose normal points within a threshold angle of straight down (default 45°), reports their area as a percentage, and highlights them in red in the viewport.</li>
<li><strong>Wall Thickness Check</strong> — estimates local thickness by casting inward rays from surface samples (approximation — see below).</li>
<li><strong>Mesh Statistics</strong> — vertices, triangles, bounding box, indexed/soup status.</li>
<li><strong>Bounding Box / Volume / Surface Area</strong> — exact geometric quantities (volume via the divergence theorem, assumes watertight).</li>
</ul>` },
    { id: 'prep', h2: 'Preparation tools', html: `
<ul>
<li><strong>Model Orientation</strong> — drop to ground, or auto-orient by rotating the dominant face normal downward (approximation), then align to the plate.</li>
<li><strong>Cross Section</strong> — slide a cutting plane along any axis and inspect the contour — the classic way to spot hidden holes and inverted geometry.</li>
<li><strong>Measure Distance / Angle</strong> — click points on the surface to measure between them.</li>
<li><strong>Model Screenshot</strong> — capture the viewport as PNG for documentation.</li>
<li><strong>Center + Ground</strong> and the rest of the <a href="/mesh-tools.html">mesh repair tools</a> prepare geometry for slicing.</li>
</ul>` },
    { id: 'accuracy', h2: 'Accuracy and limitations', html: `<p>Manifold checks, overhang angles, volume and area are exact computations on the triangle data. <strong>Wall thickness is an approximation</strong>: it samples surface points and casts rays inward along the normal, reporting the distance to the first surface hit. On concave shapes it can locally over- or under-estimate, and it knows nothing about your printer's nozzle: pair its output with judgment. The default printer volume used for size checks (220×220×250 mm) is a common consumer printer; your machine may differ.</p>` },
    { id: 'workflow', h2: 'A sane pre-print workflow', html: `
<ol>
<li>Load the model and drop it to the ground.</li>
<li>Run the Printability Check — fix any issues with <a href="/mesh-tools.html">repair tools</a>.</li>
<li>Check overhangs and decide on supports or reorientation.</li>
<li>Export STL or 3MF and slice as usual.</li>
</ol>` },
  ],
  faq: [
    ['What does “not watertight” mean?', 'The mesh surface has holes (boundary edges) or topology errors (non-manifold edges), so the slicer cannot reliably tell inside from outside — prints may fail or come out solid/empty incorrectly.'],
    ['Is the overhang threshold 45° always right?', '45° is a common rule of thumb for FDM without supports. Adjust the angle in the tool; materials and printers vary.'],
    ['How accurate is the volume calculation?', 'Exact for a watertight mesh (divergence-theorem sum over triangles). If the mesh has holes the number is not meaningful.'],
    ['Does it check my specific printer volume?', 'The default check uses 220×220×250 mm. The check reports dimensions so you can compare against your own build volume.'],
  ],
  related: [
    ['/mesh-tools.html', 'Mesh Tools', 'Fix what the checks find.'],
    ['/convert/stl-to-3mf.html', 'STL to 3MF', 'Export for modern slicers.'],
    ['/viewer/inspection-views.html', 'Inspection Views', 'X-ray view for internal geometry.'],
    ['/app.html', 'Open Studio', 'Run the checks on your model.'],
  ],
  ru: {
    title: 'Инструменты анализа для 3D-печати — пригодность, замкнутость, нависания | 3DTools',
    description: 'Бесплатные локальные проверки для 3D-печати: замкнутость/водонепроницаемость, поиск нависаний, оценка толщины стенок, объём, отчёт о пригодности, ориентация и сечения.',
    h1: 'Инструменты 3D-печати',
    intro: `<p>Проверьте, будет ли модель реально печататься — до того, как потратите филамент. Эти инструменты анализа работают локально с мешем: водонепроницаемость, нависания, толщина стенок, размер относительно объёма принтера и сводный отчёт о пригодности к печати.</p>`,
    cta: { href: '/app.html?tool=printability', label: 'Запустить проверку пригодности' },
    sections: [
      { id: 'checks', h2: 'Проверки', html: `
<ul>
<li><strong>Проверка пригодности к печати</strong> — один отчёт, объединяющий все проверки ниже с проблемами, предупреждениями и заметками.</li>
<li><strong>Проверка замкнутости</strong> — точный топологический тест: считает граничные рёбра (дыры), немногообразные рёбра и немногообразные вершины. У водонепроницаемого меша все значения равны нулю.</li>
<li><strong>Поиск нависаний</strong> — отмечает грани, чья нормаль смотрит вниз в пределах порогового угла (по умолчанию 45°), показывает их площадь в процентах и подсвечивает красным во вьюпорте.</li>
<li><strong>Проверка толщины стенок</strong> — оценивает локальную толщину, пуская лучи внутрь из точек поверхности (приближение — см. ниже).</li>
<li><strong>Статистика меша</strong> — вершины, треугольники, габаритный бокс, статус индексированности.</li>
<li><strong>Габаритный бокс / объём / площадь</strong> — точные геометрические величины (объём через теорему о дивергенции, предполагает замкнутость).</li>
</ul>` },
      { id: 'prep', h2: 'Инструменты подготовки', html: `
<ul>
<li><strong>Ориентация модели</strong> — опускание на пол или авто-ориентация поворотом доминирующей нормали грани вниз (приближение), затем выравнивание на столе.</li>
<li><strong>Поперечное сечение</strong> — двигает секущую плоскость вдоль любой оси и показывает контур — классический способ найти скрытые дыры и перевёрнутую геометрию.</li>
<li><strong>Измерение расстояния / угла</strong> — кликайте точки на поверхности для измерения между ними.</li>
<li><strong>Скриншот модели</strong> — сохранение вьюпорта как PNG для документации.</li>
<li><strong>Центр + пол</strong> и остальные <a href="/mesh-tools.html">инструменты ремонта меша</a> готовят геометрию к слайсингу.</li>
</ul>` },
      { id: 'accuracy', h2: 'Точность и ограничения', html: `<p>Проверки замкнутости, углы нависаний, объём и площадь — точные вычисления по данным треугольников. <strong>Толщина стенок — приближение</strong>: она сэмплирует точки поверхности и пускает лучи внутрь по нормали, сообщая расстояние до первого пересечения с поверхностью. На вогнутых формах может локально завышать или занижать, и она ничего не знает о сопле вашего принтера: сочетайте её вывод со здравым смыслом. Стандартный объём принтера для проверки размера (220×220×250 мм) — типичный потребительский принтер; у вашей машины может быть иначе.</p>` },
      { id: 'workflow', h2: 'Разумный процесс перед печатью', html: `
<ol>
<li>Загрузите модель и опустите её на пол.</li>
<li>Запустите проверку пригодности — исправьте проблемы <a href="/mesh-tools.html">инструментами ремонта</a>.</li>
<li>Проверьте нависания и решите вопрос с поддержками или переориентацией.</li>
<li>Экспортируйте STL или 3MF и слайсите как обычно.</li>
</ol>` },
    ],
    faq: [
      ['Что значит «не водонепроницаемый»?', 'На поверхности меша есть дыры (граничные рёбра) или топологические ошибки (немногообразные рёбра), поэтому слайсер не может надёжно отличить внутреннее от внешнего — печать может не удаться или дать неверный результат.'],
      ['Порог нависаний 45° — всегда верно?', '45° — распространённое эмпирическое правило для FDM без поддержек. Настройте угол в инструменте; материалы и принтеры различаются.'],
      ['Насколько точен расчёт объёма?', 'Точен для замкнутого меша (сумма по треугольникам через теорему о дивергенции). Если в меша есть дыры, число бессмысленно.'],
      ['Проверяется ли объём моего принтера?', 'По умолчанию используется 220×220×250 мм. Проверка показывает размеры, чтобы вы могли сравнить со своим объёмом печати.'],
    ],
    related: [
      ['/mesh-tools.html', 'Инструменты меша', 'Исправьте то, что нашли проверки.'],
      ['/convert/stl-to-3mf.html', 'STL в 3MF', 'Экспорт для современных слайсеров.'],
      ['/viewer/inspection-views.html', 'Режимы инспекции', 'Рентген для внутренней геометрии.'],
      ['/app.html', 'Открыть студию', 'Запустите проверки на своей модели.'],
    ],
  },
},

// ---------------- about ----------------
{
  path: '/about.html',
  title: 'About 3DTools — Local-First 3D Model Toolbox',
  description: '3DTools is a free, local-first toolbox for viewing, converting, repairing and analyzing 3D meshes. Learn how it works and what it deliberately is not.',
  h1: 'About 3DTools',
  intro: `<p>3DTools is a browser-based toolbox for triangle-mesh models. It exists because most “free online 3D tools” are upload pipelines wrapped in ads: your model goes to a server, waits in a queue, and comes back. 3DTools is the opposite — a static page where <strong>all computation happens on your device</strong>.</p>`,
  sections: [
    { id: 'principles', h2: 'Principles', html: `
<ul>
<li><strong>Local by architecture, not by promise.</strong> There is no upload endpoint in the code. Model processing uses the File API, typed arrays, Web Workers and WebGL.</li>
<li><strong>Real functionality only.</strong> Every button does something. Approximate operations (e.g., wall thickness, hollowing) are labeled as approximations with their limitations documented.</li>
<li><strong>Deep support for few formats</strong> over shallow support for many. Five formats, honestly implemented, with clear errors for unsupported files.</li>
<li><strong>No dark patterns.</strong> Ads are visually separated from functional controls, nothing auto-downloads, nothing pops up over the 3D viewport.</li>
</ul>` },
    { id: 'stack', h2: 'Under the hood', html: `
<p>The mesh core (parsers, exporters, geometry operations, analysis) is dependency-free JavaScript operating on typed arrays — the same code runs in the browser and in Node.js, where the automated test suite exercises it. Rendering uses <a href="https://threejs.org">Three.js</a> (WebGL). Heavy operations run in a Web Worker so the UI stays interactive. 3MF containers are unpacked with the browser's native decompression. No WASM is required for the supported feature set; where a task needs it in the future it will be bundled locally, not fetched from a CDN at runtime.</p>` },
    { id: 'scope', h2: 'What it is not', html: `<p>3DTools is not CAD software. It does not edit parametric solids, run boolean operations on NURBS, manage assemblies with constraints, or slice models into G-code. If you need those, use a real CAD or slicer application — this toolbox covers the mesh-level work around them.</p>` },
  ],
  faq: [
    ['Who makes 3DTools?', 'An independent developer. See the <a href="/contact.html">contact page</a>.'],
    ['How is it funded?', 'Plain, clearly-labeled display advertising that never mimics functional controls. No data sales — there is no data to sell.'],
    ['Can I self-host it?', 'Yes — it is a static site: any static file host serves it as-is.'],
  ],
  related: [['/privacy.html', 'Privacy Policy', 'What (little) data exists.'], ['/formats.html', 'Formats', 'Supported formats and limits.'], ['/tools.html', 'All Tools', 'Browse the toolbox.'], ['/app.html', 'Open Studio', 'Try it now.']],
  ru: {
    title: 'О 3DTools — локальный набор инструментов для 3D-моделей',
    description: '3DTools — бесплатный локальный набор инструментов для просмотра, конвертации, ремонта и анализа 3D-мешей. Узнайте, как он работает и чем сознательно не является.',
    h1: 'О 3DTools',
    intro: `<p>3DTools — браузерный набор инструментов для моделей из треугольных мешей. Он существует потому, что большинство «бесплатных онлайн-инструментов для 3D» — это конвейеры загрузки, обёрнутые в рекламу: ваша модель уходит на сервер, ждёт в очереди и возвращается. 3DTools — противоположность: статическая страница, где <strong>все вычисления выполняются на вашем устройстве</strong>.</p>`,
    sections: [
      { id: 'principles', h2: 'Принципы', html: `
<ul>
<li><strong>Локальность по архитектуре, а не по обещанию.</strong> В коде нет эндпоинта загрузки. Обработка моделей использует File API, типизированные массивы, Web Workers и WebGL.</li>
<li><strong>Только реальная функциональность.</strong> Каждая кнопка что-то делает. Приближённые операции (например, толщина стенок, полости) помечены как приближения с задокументированными ограничениями.</li>
<li><strong>Глубокая поддержка немногих форматов</strong> вместо поверхностной поддержки многих. Пять форматов, честно реализованных, с понятными ошибками для неподдерживаемых файлов.</li>
<li><strong>Никаких тёмных паттернов.</strong> Реклама визуально отделена от функциональных элементов, ничего не скачивается автоматически, ничего не всплывает поверх 3D-вьюпорта.</li>
</ul>` },
      { id: 'stack', h2: 'Под капотом', html: `
<p>Ядро мешей (парсеры, экспортеры, геометрические операции, анализ) — JavaScript без зависимостей, работающий с типизированными массивами: тот же код выполняется в браузере и в Node.js, где его проверяет автоматический набор тестов. Рендеринг — <a href="https://threejs.org">Three.js</a> (WebGL). Тяжёлые операции выполняются в Web Worker, поэтому интерфейс остаётся интерактивным. Контейнеры 3MF распаковываются нативной декомпрессией браузера. WASM для поддерживаемого набора функций не требуется; если задача потребует его в будущем, он будет поставляться локально, а не загружаться с CDN во время работы.</p>` },
      { id: 'scope', h2: 'Чем это не является', html: `<p>3DTools — не CAD-система. Он не редактирует параметрические тела, не выполняет булевы операции на NURBS, не управляет сборками с ограничениями и не слайсит модели в G-код. Если нужно это — используйте настоящий CAD или слайсер; этот набор инструментов покрывает работу с мешами вокруг них.</p>` },
    ],
    faq: [
      ['Кто делает 3DTools?', 'Независимый разработчик. См. <a href="/contact.html">страницу контактов</a>.'],
      ['Как это финансируется?', 'Обычная, чётко обозначенная медийная реклама, которая никогда не имитирует функциональные элементы. Никакой продажи данных — данных для продажи нет.'],
      ['Можно ли разместить у себя?', 'Да — это статический сайт: любой статический хостинг отдаст его как есть.'],
    ],
    related: [['/privacy.html', 'Политика конфиденциальности', 'Какие (немногие) данные существуют.'], ['/formats.html', 'Форматы', 'Поддерживаемые форматы и ограничения.'], ['/tools.html', 'Все инструменты', 'Обзор набора инструментов.'], ['/app.html', 'Открыть студию', 'Попробуйте прямо сейчас.']],
  },
},

// ---------------- contact ----------------
{
  path: '/contact.html',
  title: 'Contact 3DTools',
  description: 'Report bugs, suggest formats or features, or ask about 3DTools — a local-first 3D mesh toolbox.',
  h1: 'Contact',
  intro: `<p>Found a bug, a file that should parse but does not, or a format you need? Get in touch.</p>`,
  sections: [
    { id: 'how', h2: 'How to reach us', html: `
<p>Email: <strong>nnuubbiikk@gmail.com</strong></p>
<p>To keep this site free of trackers, there is no contact form — just plain email. Please include:</p>
<ul>
<li>For bugs: what you did, what you expected, and what happened (the exact status-bar error message helps enormously).</li>
<li>For file problems: the format and, if possible, the file — or just its header (first few lines / bytes as text).</li>
<li>For format requests: a link to the format specification and an example file.</li>
</ul>` },
    { id: 'bugs', h2: 'Before you write', html: `<p>Many load failures are unsupported files, not bugs: Draco-compressed glTF, CAD formats (STEP, IGES, FBX) and password-protected archives are outside scope and produce a clear error message. Check the <a href="/formats.html">formats page</a> first.</p>` },
  ],
  faq: [
    ['Do you accept feature requests?', 'Yes, if they fit the local-first, mesh-toolbox scope.'],
    ['Do you offer API access?', 'No. There is no backend to expose — that is the point.'],
  ],
  related: [['/about.html', 'About', 'How 3DTools works.'], ['/formats.html', 'Formats', 'What is supported.'], ['/tools.html', 'All Tools', 'The toolbox.'], ['/privacy.html', 'Privacy', 'Data policy.']],
  ru: {
    title: 'Контакты 3DTools',
    description: 'Сообщите об ошибке, предложите формат или функцию, или задайте вопрос о 3DTools — локальном наборе инструментов для 3D-мешей.',
    h1: 'Контакты',
    intro: `<p>Нашли ошибку, файл, который должен парситься, но не парсится, или нужный формат? Свяжитесь с нами.</p>`,
    sections: [
      { id: 'how', h2: 'Как связаться', html: `
<p>Email: <strong>nnuubbiikk@gmail.com</strong></p>
<p>Чтобы сайт оставался без трекеров, формы обратной связи нет — только обычная почта. Пожалуйста, укажите:</p>
<ul>
<li>Для ошибок: что вы делали, что ожидали и что произошло (точное сообщение об ошибке из строки состояния очень помогает).</li>
<li>Для проблем с файлами: формат и, если возможно, сам файл — или хотя бы его заголовок (первые несколько строк / байт текстом).</li>
<li>Для запросов форматов: ссылку на спецификацию формата и пример файла.</li>
</ul>` },
      { id: 'bugs', h2: 'Прежде чем писать', html: `<p>Многие ошибки загрузки — это неподдерживаемые файлы, а не баги: glTF со сжатием Draco, CAD-форматы (STEP, IGES, FBX) и архивы с паролем вне области и выдают понятное сообщение об ошибке. Сначала проверьте <a href="/formats.html">страницу форматов</a>.</p>` },
    ],
    faq: [
      ['Принимаете ли вы предложения функций?', 'Да, если они вписываются в локальную концепцию инструментов для мешей.'],
      ['Есть ли доступ по API?', 'Нет. Нет бэкенда, который можно было бы открыть — в этом и суть.'],
    ],
    related: [['/about.html', 'О сайте', 'Как работает 3DTools.'], ['/formats.html', 'Форматы', 'Что поддерживается.'], ['/tools.html', 'Все инструменты', 'Набор инструментов.'], ['/privacy.html', 'Конфиденциальность', 'Политика данных.']],
  },
},

// ---------------- privacy ----------------
{
  path: '/privacy.html',
  title: 'Privacy Policy — 3DTools',
  description: '3DTools privacy policy: model files are processed locally and never uploaded. Plain-language summary of what data does and does not exist.',
  h1: 'Privacy policy',
  intro: `<p><strong>Short version: your 3D models never leave your device, because there is no server to send them to.</strong> 3DTools is a set of static pages; opening, converting, repairing and analyzing models happens entirely in your browser.</p>`,
  sections: [
    { id: 'files', h2: 'Your files', html: `<p>Files you open are read into browser memory (File API) and processed locally. They are not uploaded, not stored, and not accessible to the site operator. Closing the tab discards everything. Downloads you create are generated in memory and saved by your browser directly.</p>` },
    { id: 'data', h2: 'Data we collect', html: `<ul>
<li><strong>None by ourselves.</strong> The site has no analytics of its own, no cookies for functionality, and no accounts.</li>
<li><strong>Advertising:</strong> the site displays ads from third-party networks. Those networks may set cookies and process data (IP address, browser headers) to display and measure ads, as described in their own privacy policies. Ads are loaded only as clearly-marked ad placements, never attached to upload/download/convert controls.</li>
<li><strong>Standard web-server logs</strong> maintained by the static host (page requests, IP addresses) for security and abuse prevention, retained per the host's policy.</li>
</ul>` },
    { id: 'rights', h2: 'Your choices', html: `<p>You can block third-party ad cookies via your browser settings without affecting any tool functionality. For questions, use the <a href="/contact.html">contact page</a>.</p>` },
  ],
  faq: [
    ['Does 3DTools upload my models?', 'No. There is no upload code — parsing, conversion and analysis all run in your browser.'],
    ['Does the site use cookies?', 'Only third-party ad networks may set cookies; the site itself sets none.'],
  ],
  related: [['/terms.html', 'Terms of Use', 'Usage terms.'], ['/disclaimer.html', 'Disclaimer', 'Accuracy and responsibility.'], ['/about.html', 'About', 'How the site works.'], ['/contact.html', 'Contact', 'Ask questions.']],
  ru: {
    title: 'Политика конфиденциальности — 3DTools',
    description: 'Политика конфиденциальности 3DTools: файлы моделей обрабатываются локально и никогда не загружаются. Простое описание того, какие данные есть и каких нет.',
    h1: 'Политика конфиденциальности',
    intro: `<p><strong>Коротко: ваши 3D-модели никогда не покидают устройство, потому что нет сервера, куда их отправить.</strong> 3DTools — набор статических страниц; открытие, конвертация, ремонт и анализ моделей происходит полностью в вашем браузере.</p>`,
    sections: [
      { id: 'files', h2: 'Ваши файлы', html: `<p>Открываемые файлы читаются в память браузера (File API) и обрабатываются локально. Они не загружаются, не хранятся и недоступны оператору сайта. Закрытие вкладки удаляет всё. Создаваемые вами загрузки генерируются в памяти и сохраняются браузером напрямую.</p>` },
      { id: 'data', h2: 'Какие данные мы собираем', html: `<ul>
<li><strong>Сами — никакие.</strong> У сайта нет собственной аналитики, функциональных cookie и аккаунтов.</li>
<li><strong>Реклама:</strong> сайт показывает рекламу сторонних сетей. Эти сети могут устанавливать cookie и обрабатывать данные (IP-адрес, заголовки браузера) для показа и измерения рекламы, как описано в их собственных политиках конфиденциальности. Реклама загружается только как чётко обозначенные рекламные места и никогда не привязана к элементам загрузки/скачивания/конвертации.</li>
<li><strong>Стандартные логи веб-сервера</strong> статического хостинга (запросы страниц, IP-адреса) для безопасности и предотвращения злоупотреблений, хранятся согласно политике хостинга.</li>
</ul>` },
      { id: 'rights', h2: 'Ваш выбор', html: `<p>Вы можете заблокировать сторонние рекламные cookie в настройках браузера — это не влияет на работу инструментов. По вопросам используйте <a href="/contact.html">страницу контактов</a>.</p>` },
    ],
    faq: [
      ['3DTools загружает мои модели?', 'Нет. Кода загрузки нет — парсинг, конвертация и анализ выполняются в вашем браузере.'],
      ['Использует ли сайт cookie?', 'Только сторонние рекламные сети могут устанавливать cookie; сам сайт не устанавливает ни одного.'],
    ],
    related: [['/terms.html', 'Условия использования', 'Условия использования.'], ['/disclaimer.html', 'Отказ от ответственности', 'Точность и ответственность.'], ['/about.html', 'О сайте', 'Как работает сайт.'], ['/contact.html', 'Контакты', 'Задайте вопросы.']],
  },
},

// ---------------- terms ----------------
{
  path: '/terms.html',
  title: 'Terms of Use — 3DTools',
  description: 'Terms for using 3DTools, a free browser-based 3D mesh toolbox that processes all data locally.',
  h1: 'Terms of use',
  intro: `<p>By using 3DTools you agree to these terms. They are intentionally short.</p>`,
  sections: [
    { id: 'terms', h2: 'The terms', html: `<ul>
<li><strong>Service.</strong> 3DTools provides browser-based tools for 3D mesh files, free of charge, “as is”, without warranty of any kind.</li>
<li><strong>Your files.</strong> All processing happens on your device. You are responsible for the files you open and the results you download; keep your own backups.</li>
<li><strong>Responsibility.</strong> Mesh operations (repair, decimation, hollowing, cutting) modify geometry, sometimes lossily. Verify results before using them for manufacturing, engineering or other consequential purposes.</li>
<li><strong>Acceptable use.</strong> Do not attempt to disrupt the service or abuse advertising. You may use the tools for personal and commercial work on models you have the right to process.</li>
<li><strong>Changes.</strong> These terms may change; the current version is always on this page.</li>
</ul>` },
  ],
  faq: [
    ['Is commercial use allowed?', 'Yes — using the tools on your own models, including for paid work, is fine.'],
    ['Is there a warranty?', 'No. The tools are provided as-is; see also the <a href="/disclaimer.html">disclaimer</a>.'],
  ],
  related: [['/privacy.html', 'Privacy', 'Data policy.'], ['/disclaimer.html', 'Disclaimer', 'Scope of accuracy.'], ['/contact.html', 'Contact', 'Questions.'], ['/about.html', 'About', 'About the project.']],
  ru: {
    title: 'Условия использования — 3DTools',
    description: 'Условия использования 3DTools — бесплатного браузерного набора инструментов для 3D-мешей, обрабатывающего все данные локально.',
    h1: 'Условия использования',
    intro: `<p>Используя 3DTools, вы соглашаетесь с этими условиями. Они намеренно короткие.</p>`,
    sections: [
      { id: 'terms', h2: 'Условия', html: `<ul>
<li><strong>Сервис.</strong> 3DTools предоставляет браузерные инструменты для файлов 3D-мешей бесплатно, «как есть», без каких-либо гарантий.</li>
<li><strong>Ваши файлы.</strong> Вся обработка происходит на вашем устройстве. Вы отвечаете за файлы, которые открываете, и за результаты, которые скачиваете; храните собственные резервные копии.</li>
<li><strong>Ответственность.</strong> Операции с мешами (ремонт, децимация, полости, резка) изменяют геометрию, иногда с потерями. Проверяйте результаты перед использованием для производства, инженерии или других ответственных целей.</li>
<li><strong>Допустимое использование.</strong> Не пытайтесь нарушить работу сервиса или злоупотреблять рекламой. Инструменты можно использовать для личной и коммерческой работы с моделями, которые вы имеете право обрабатывать.</li>
<li><strong>Изменения.</strong> Эти условия могут меняться; актуальная версия всегда на этой странице.</li>
</ul>` },
    ],
    faq: [
      ['Разрешено ли коммерческое использование?', 'Да — использование инструментов на собственных моделях, включая платную работу, разрешено.'],
      ['Есть ли гарантия?', 'Нет. Инструменты предоставляются как есть; см. также <a href="/disclaimer.html">отказ от ответственности</a>.'],
    ],
    related: [['/privacy.html', 'Конфиденциальность', 'Политика данных.'], ['/disclaimer.html', 'Отказ от ответственности', 'Границы точности.'], ['/contact.html', 'Контакты', 'Вопросы.'], ['/about.html', 'О сайте', 'О проекте.']],
  },
},

// ---------------- disclaimer ----------------
{
  path: '/disclaimer.html',
  title: 'Disclaimer — Accuracy and Limitations of 3DTools',
  description: 'Honest limitations of 3DTools: which mesh operations are exact, which are approximations, and why you should verify results before manufacturing.',
  h1: 'Disclaimer',
  intro: `<p>3DTools performs real mesh computations, but every tool has limits. This page states them plainly so you can judge the results.</p>`,
  sections: [
    { id: 'exact', h2: 'What is exact', html: `<ul>
<li>Format parsing and conversion of mesh geometry (vertices, triangles, normals, UVs where the target format supports them).</li>
<li>Volume and surface area (exact for watertight meshes), bounding boxes, triangle/vertex counts.</li>
<li>Manifold/watertight topology checks (boundary, non-manifold edges and vertices).</li>
<li>Overhang angle classification per face.</li>
</ul>` },
    { id: 'approx', h2: 'What is approximate', html: `<ul>
<li><strong>Wall thickness</strong> — ray-sampling estimation; can locally over/under-estimate on concave geometry.</li>
<li><strong>Hollow shell</strong> — inward normal offset; self-intersects where the model is thinner than ~2× the wall.</li>
<li><strong>Auto-orientation</strong> — rotates the dominant face-normal direction down; not a stability-optimized packing.</li>
<li><strong>Add Base</strong> — a rectangular plate under the footprint, not a conformal raft.</li>
<li><strong>Decimation</strong> — lossy by definition; quadric error is minimized, not eliminated.</li>
</ul>` },
    { id: 'responsibility', h2: 'Your responsibility', html: `<p>Verify results (manifold check, visual inspection, cross sections) before printing, machining or shipping anything based on them. 3DTools is not certified engineering software. Nothing here is professional advice.</p>` },
  ],
  faq: [
    ['Can I trust the printability check?', 'It checks the listed geometric criteria exactly and flags approximations as such — but no software guarantees a successful print.'],
    ['Is converted geometry identical?', 'Geometry yes; attributes that the target format cannot represent (colors in STL, materials everywhere) cannot survive conversion.'],
  ],
  related: [['/3d-printing-tools.html', '3D Printing Tools', 'What the checks compute.'], ['/mesh-tools.html', 'Mesh Tools', 'Operation details.'], ['/terms.html', 'Terms', 'Usage terms.'], ['/contact.html', 'Contact', 'Report a problem.']],
  ru: {
    title: 'Отказ от ответственности — точность и ограничения 3DTools',
    description: 'Честные ограничения 3DTools: какие операции с мешами точные, какие приближённые и почему результаты стоит проверять перед производством.',
    h1: 'Отказ от ответственности',
    intro: `<p>3DTools выполняет настоящие вычисления с мешами, но у каждого инструмента есть пределы. Эта страница прямо их описывает, чтобы вы могли оценивать результаты.</p>`,
    sections: [
      { id: 'exact', h2: 'Что точно', html: `<ul>
<li>Парсинг и конвертация геометрии мешей (вершины, треугольники, нормали, UV там, где целевой формат их поддерживает).</li>
<li>Объём и площадь поверхности (точно для замкнутых мешей), габаритные боксы, количество треугольников/вершин.</li>
<li>Топологические проверки замкнутости/водонепроницаемости (граничные, немногообразные рёбра и вершины).</li>
<li>Классификация углов нависания по граням.</li>
</ul>` },
      { id: 'approx', h2: 'Что приближённо', html: `<ul>
<li><strong>Толщина стенок</strong> — оценка сэмплированием лучей; может локально завышать/занижать на вогнутой геометрии.</li>
<li><strong>Полая оболочка</strong> — смещение внутрь по нормалям; самопересекается там, где модель тоньше ~2× стенки.</li>
<li><strong>Авто-ориентация</strong> — поворачивает доминирующее направление нормали грани вниз; не оптимизированная по устойчивости укладка.</li>
<li><strong>Добавить основание</strong> — прямоугольная пластина под контуром, а не конформный рафт.</li>
<li><strong>Децимация</strong> — по определению с потерями; квадратичная ошибка минимизируется, но не устраняется.</li>
</ul>` },
      { id: 'responsibility', h2: 'Ваша ответственность', html: `<p>Проверяйте результаты (проверка замкнутости, визуальный осмотр, сечения) перед печатью, обработкой или отправкой чего-либо на их основе. 3DTools — не сертифицированное инженерное ПО. Ничто здесь не является профессиональной консультацией.</p>` },
    ],
    faq: [
      ['Можно ли доверять проверке пригодности?', 'Она точно проверяет перечисленные геометрические критерии и помечает приближения как таковые — но никакое ПО не гарантирует успешную печать.'],
      ['Идентична ли конвертированная геометрия?', 'Геометрия — да; атрибуты, которые целевой формат не может представить (цвета в STL, материалы везде), конвертацию не переживают.'],
    ],
    related: [['/3d-printing-tools.html', 'Инструменты 3D-печати', 'Что вычисляют проверки.'], ['/mesh-tools.html', 'Инструменты меша', 'Подробности операций.'], ['/terms.html', 'Условия', 'Условия использования.'], ['/contact.html', 'Контакты', 'Сообщить о проблеме.']],
  },
},

// ---------------- 404 ----------------
{
  path: '/404.html',
  title: 'Page Not Found — 3DTools',
  description: 'The page you requested does not exist. Browse the 3DTools viewers, converters and mesh tools instead.',
  h1: '404 — page not found',
  intro: `<p>The page you are looking for does not exist (or never did). Nothing was uploaded in the making of this error.</p>`,
  cta: { href: '/app.html', label: 'Open the Studio instead' },
  sections: [
    { id: 'popular', h2: 'Popular pages', html: `
<div class="card-grid">
  <a class="card" href="/"><span class="tag">Start</span><h3>Home</h3><p>Overview of the toolbox.</p></a>
  <a class="card" href="/tools.html"><span class="tag">Browse</span><h3>All Tools</h3><p>Every viewer and converter.</p></a>
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Viewer</span><h3>STL Viewer</h3><p>The most used tool.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>STL to OBJ</h3><p>Popular converter.</p></a>
</div>` },
  ],
  faq: [],
  related: [],
  ru: {
    title: 'Страница не найдена — 3DTools',
    description: 'Запрошенная страница не существует. Посмотрите средства просмотра, конвертеры и инструменты мешей 3DTools.',
    h1: '404 — страница не найдена',
    intro: `<p>Страница, которую вы ищете, не существует (или никогда не существовала). При создании этой ошибки ничего не было загружено.</p>`,
    cta: { href: '/app.html', label: 'Открыть студию вместо этого' },
    sections: [
      { id: 'popular', h2: 'Популярные страницы', html: `
<div class="card-grid">
  <a class="card" href="/"><span class="tag">Старт</span><h3>Главная</h3><p>Обзор набора инструментов.</p></a>
  <a class="card" href="/tools.html"><span class="tag">Обзор</span><h3>Все инструменты</h3><p>Каждое средство просмотра и конвертер.</p></a>
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Просмотр</span><h3>Просмотр STL</h3><p>Самый используемый инструмент.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Конвертер</span><h3>STL в OBJ</h3><p>Популярный конвертер.</p></a>
</div>` },
    ],
    faq: [],
    related: [],
  },
},
];
