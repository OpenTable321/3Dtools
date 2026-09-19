// Viewer and converter landing pages.
export const SITE_URL = 'https://3dtools.example';

const REL_CONVERT = [
  ['/convert/stl-to-obj.html', 'STL to OBJ Converter', 'Turn a triangle-only STL into an OBJ with vertices, normals and groups.'],
  ['/convert/obj-to-stl.html', 'OBJ to STL Converter', 'Prepare OBJ models for 3D printing by converting to watertight-ready STL.'],
  ['/convert/stl-to-3mf.html', 'STL to 3MF Converter', 'Wrap STL geometry in the modern 3MF printing package.'],
  ['/convert/glb-to-obj.html', 'GLB to OBJ Converter', 'Extract editable OBJ geometry from binary glTF assets.'],
];
const REL_VIEWER = [
  ['/viewer/stl-viewer.html', 'STL Viewer', 'Inspect binary and ASCII STL files with wireframe, x-ray and section views.'],
  ['/viewer/obj-viewer.html', 'OBJ Viewer', 'View OBJ files with per-object tabs and normal inspection.'],
  ['/viewer/glb-gltf-viewer.html', 'GLB/GLTF Viewer', 'Load glTF 2.0 assets and inspect every mesh locally.'],
  ['/viewer/ply-viewer.html', 'PLY Viewer', 'View ASCII and binary PLY meshes, including point clouds.'],
];
const REL_CONVERT_RU = [
  ['/convert/stl-to-obj.html', 'Конвертер STL в OBJ', 'Превращает STL из треугольников в OBJ с вершинами, нормалями и группами.'],
  ['/convert/obj-to-stl.html', 'Конвертер OBJ в STL', 'Готовит модели OBJ к 3D-печати конвертацией в STL.'],
  ['/convert/stl-to-3mf.html', 'Конвертер STL в 3MF', 'Упаковывает геометрию STL в современный пакет 3MF.'],
  ['/convert/glb-to-obj.html', 'Конвертер GLB в OBJ', 'Извлекает редактируемую геометрию OBJ из бинарных glTF-ассетов.'],
];
const REL_VIEWER_RU = [
  ['/viewer/stl-viewer.html', 'Просмотр STL', 'Инспектируйте бинарный и ASCII STL с каркасом, рентгеном и сечениями.'],
  ['/viewer/obj-viewer.html', 'Просмотр OBJ', 'Просмотр OBJ с вкладками объектов и инспекцией нормалей.'],
  ['/viewer/glb-gltf-viewer.html', 'Просмотр GLB/GLTF', 'Загрузка ассетов glTF 2.0 и локальная инспекция мешей.'],
  ['/viewer/ply-viewer.html', 'Просмотр PLY', 'Просмотр ASCII и бинарных PLY, включая облака точек.'],
];

function viewerPage({ path, slug, name, formats, intro, more, faq, ru }) {
  return {
    path,
    title: `${name} — Free Online ${name} (No Upload) | 3DTools`,
    description: `Free browser-based ${name}. Open ${formats} files instantly, inspect geometry, measure and convert — files are processed locally and never uploaded.`,
    h1: name,
    intro: `<p>${intro}</p><p>Everything runs locally in your browser using WebGL. Your file is never uploaded to a server, and the viewer works with files of many megabytes. If a file cannot be parsed, you get a clear error message instead of a silently blank screen.</p>`,
    cta: { href: `/app.html?tool=${slug}-viewer`, label: `Open the ${name}` },
    crumbs: [['/', 'Home'], ['/tools.html', 'Tools'], [path, name]],
    jsonLdName: `${name} — 3DTools`,
    sections: [
      { id: 'how', h2: `How to view a ${formats.split(' ')[0]} file`, html: `
<ol>
<li>Click <strong>Open the ${name}</strong> above (or open the <a href="/app.html">3DTools Studio</a>).</li>
<li>Drag and drop your file onto the viewport, or click <strong>Open File(s)</strong>.</li>
<li>Orbit with the left mouse button, zoom with the wheel, pan with the right button.</li>
<li>Switch display modes (solid, wireframe, x-ray, normals, vertices) in the <strong>View</strong> tab.</li>
<li>Measure, slice or analyze the model in the <strong>Analyze</strong> tab — or convert it to another format in the <strong>Convert</strong> tab.</li>
</ol>
<p>${more}</p>` },
      { id: 'formats', h2: 'What is supported', html: `
<table class="data">
<tr><th>Feature</th><th>Support</th></tr>
<tr><td>Binary and ASCII variants</td><td>${formats.includes(',') ? 'Both' : 'Yes'}</td></tr>
<tr><td>Solid rendering</td><td>Yes (WebGL, hardware-accelerated)</td></tr>
<tr><td>Wireframe / X-ray / normals / vertices</td><td>Yes</td></tr>
<tr><td>Multiple objects in one file</td><td>Yes — each becomes a separate model tab</td></tr>
<tr><td>Textures and materials</td><td>Geometry is shown; textures are not rendered (color-only materials ignored)</td></tr>
<tr><td>Draco / meshopt compression</td><td>Not supported (rejected with a clear error)</td></tr>
<tr><td>File size</td><td>Limited by your device memory; heavy processing runs in a Web Worker</td></tr>
</table>` },
      { id: 'privacy', h2: 'Privacy by architecture', html: `
<p>This viewer has no upload endpoint at all. The file is read with the browser's <code>FileReader</code> API, parsed in JavaScript and rendered with WebGL — all on your machine. It also works offline once loaded. See the <a href="/privacy.html">privacy policy</a> for details.</p>` },
    ],
    faq,
    related: [...REL_VIEWER, ...REL_CONVERT].filter(r => r[0] !== path).slice(0, 4),
    ru: ru && {
      title: `${ru.name} — бесплатный онлайн-просмотр (без загрузки) | 3DTools`,
      description: `Бесплатный браузерный просмотр: ${ru.name}. Открывайте файлы ${formats} мгновенно, инспектируйте геометрию, измеряйте и конвертируйте — файлы обрабатываются локально и не загружаются.`,
      h1: ru.name,
      intro: `<p>${ru.intro}</p><p>Всё работает локально в вашем браузере через WebGL. Файл никогда не загружается на сервер, просмотр работает с файлами в десятки мегабайт. Если файл не парсится, вы получите понятное сообщение об ошибке вместо пустого экрана.</p>`,
      cta: { href: `/app.html?tool=${slug}-viewer`, label: `Открыть: ${ru.name}` },
      crumbs: [['/', 'Главная'], ['/tools.html', 'Инструменты'], [path, ru.name]],
      jsonLdName: `${ru.name} — 3DTools`,
      sections: [
        { id: 'how', h2: `Как просмотреть файл ${formats.split(' ')[0]}`, html: `
<ol>
<li>Нажмите <strong>Открыть: ${ru.name}</strong> выше (или откройте <a href="/app.html">студию 3DTools</a>).</li>
<li>Перетащите файл во вьюпорт или нажмите <strong>Открыть файл(ы)</strong>.</li>
<li>Вращайте левой кнопкой мыши, масштабируйте колесом, двигайте правой кнопкой.</li>
<li>Переключайте режимы отображения (сплошной, каркас, рентген, нормали, вершины) на вкладке <strong>Вид</strong>.</li>
<li>Измеряйте, режьте или анализируйте модель на вкладке <strong>Анализ</strong> — или конвертируйте на вкладке <strong>Конвертация</strong>.</li>
</ol>
<p>${ru.more}</p>` },
        { id: 'formats', h2: 'Что поддерживается', html: `
<table class="data">
<tr><th>Возможность</th><th>Поддержка</th></tr>
<tr><td>Бинарный и ASCII варианты</td><td>${formats.includes(',') ? 'Оба' : 'Да'}</td></tr>
<tr><td>Сплошной рендеринг</td><td>Да (WebGL, аппаратное ускорение)</td></tr>
<tr><td>Каркас / Рентген / нормали / вершины</td><td>Да</td></tr>
<tr><td>Несколько объектов в файле</td><td>Да — каждый становится отдельной вкладкой</td></tr>
<tr><td>Текстуры и материалы</td><td>Показывается геометрия; текстуры не рендерятся</td></tr>
<tr><td>Сжатие Draco / meshopt</td><td>Не поддерживается (отклоняется с понятной ошибкой)</td></tr>
<tr><td>Размер файла</td><td>Ограничен памятью устройства; тяжёлая обработка — в Web Worker</td></tr>
</table>` },
        { id: 'privacy', h2: 'Приватность по архитектуре', html: `
<p>У этого просмотра вообще нет эндпоинта загрузки. Файл читается через <code>FileReader</code> браузера, парсится в JavaScript и рендерится через WebGL — всё на вашей машине. После загрузки работает и офлайн. Подробности — в <a href="/privacy.html">политике конфиденциальности</a>.</p>` },
      ],
      faq: ru.faq,
      related: [...REL_VIEWER_RU, ...REL_CONVERT_RU].filter(r => r[0] !== path).slice(0, 4),
    },
  };
}

export const VIEWER_PAGES = [
  viewerPage({
    path: '/viewer/stl-viewer.html', slug: 'stl', name: 'STL Viewer',
    formats: 'STL',
    intro: 'Open and inspect STL files — the most common format for 3D printing — directly in your browser. Binary and ASCII STL are both detected automatically, and the triangle count, bounding box and manifold status of your model are one click away.',
    more: 'STL stores raw triangles with no colors, units or object names, which makes it easy to parse but hard to organize. The viewer shows you exactly what is in the file: every triangle, vertex and normal. Common STL problems (non-watertight meshes, duplicate faces, flipped normals) can be checked in the Analyze tab and fixed in the Repair tab.',
    faq: [
      ['Is this STL viewer really free?', 'Yes — no account, no watermark, no upload. The viewer is a static web page; your STL file is parsed by JavaScript in your browser.'],
      ['Does it upload my STL file anywhere?', 'No. There is no server component. The page works from a static web host and processes files locally with the File API and WebGL.'],
      ['What is the difference between binary and ASCII STL?', 'Binary STL packs each triangle into 50 bytes and is compact; ASCII STL is human-readable text and roughly 5 times larger. The viewer auto-detects both.'],
      ['My STL shows as inside-out — can I fix that?', 'Yes. Use Repair \u2192 Repair Mesh, which fixes triangle winding and flips inside-out meshes, then re-check with the manifold check.'],
    ],
    ru: {
      name: 'Просмотр STL',
      intro: 'Открывайте и инспектируйте STL-файлы — самый распространённый формат для 3D-печати — прямо в браузере. Бинарный и ASCII STL определяются автоматически, а число треугольников, габаритный бокс и статус замкнутости модели — в один клик.',
      more: 'STL хранит сырые треугольники без цветов, единиц и имён объектов — легко парсить, но сложно организовывать. Просмотр показывает точное содержимое файла: каждый треугольник, вершину и нормаль. Типичные проблемы STL (незамкнутые меши, дубли граней, перевёрнутые нормали) проверяются на вкладке «Анализ» и исправляются на вкладке «Ремонт».',
      faq: [
        ['Этот просмотр STL действительно бесплатный?', 'Да — без аккаунта, водяных знаков и загрузки. Это статическая веб-страница; ваш STL парсится JavaScript в браузере.'],
        ['Загружается ли мой STL куда-то?', 'Нет. Серверного компонента нет. Страница работает со статического хостинга и обрабатывает файлы локально через File API и WebGL.'],
        ['В чём разница между бинарным и ASCII STL?', 'Бинарный STL упаковывает каждый треугольник в 50 байт и компактен; ASCII STL — читаемый текст примерно в 5 раз больше. Оба определяются автоматически.'],
        ['Мой STL вывернут наизнанку — можно исправить?', 'Да. Используйте Ремонт → Ремонт меша: он исправляет обход треугольников и разворачивает вывернутые меши, затем перепроверьте замкнутость.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/obj-viewer.html', slug: 'obj', name: 'OBJ Viewer',
    formats: 'OBJ',
    intro: 'View Wavefront OBJ files in your browser. OBJ is the classic interchange format for polygon modeling: it supports multiple named objects, groups, materials references, normals and texture coordinates.',
    more: 'When you load an OBJ file, each object or material group becomes a separate model tab, so you can toggle, transform or export them individually. Polygons with more than three vertices (quads, n-gons) are triangulated on load. Material definitions (.mtl files) are not required for viewing — the geometry renders with a neutral studio material.',
    faq: [
      ['Do I need the .mtl file to view an OBJ?', 'No. The viewer only needs the .obj file. Materials are not rendered; geometry, normals and UVs are.'],
      ['Does it support quads and n-gons?', 'OBJ faces with more than three vertices are automatically fan-triangulated so they render correctly.'],
      ['Can I view several objects in one OBJ?', 'Yes. Every <code>o</code>/<code>g</code> object becomes its own tab in the viewer; you can hide, transform or export them separately.'],
      ['Can I convert the OBJ to STL for printing?', 'Yes — open the Convert tab and choose STL. For best results run the manifold check first.'],
    ],
    ru: {
      name: 'Просмотр OBJ',
      intro: 'Просматривайте файлы Wavefront OBJ в браузере. OBJ — классический формат обмена для полигонального моделирования: поддерживает несколько именованных объектов, группы, ссылки на материалы, нормали и текстурные координаты.',
      more: 'При загрузке OBJ каждый объект или группа материалов становится отдельной вкладкой модели — их можно переключать, трансформировать и экспортировать по отдельности. Полигоны с более чем тремя вершинами (квады, n-угольники) триангулируются при загрузке. Файлы материалов (.mtl) для просмотра не нужны — геометрия рендерится с нейтральным студийным материалом.',
      faq: [
        ['Нужен ли файл .mtl для просмотра OBJ?', 'Нет. Достаточно файла .obj. Материалы не рендерятся; геометрия, нормали и UV — да.'],
        ['Поддерживаются ли квады и n-угольники?', 'Грани OBJ с более чем тремя вершинами автоматически триангулируются веером и отображаются корректно.'],
        ['Можно ли просмотреть несколько объектов в одном OBJ?', 'Да. Каждый объект <code>o</code>/<code>g</code> получает свою вкладку; их можно скрывать, трансформировать или экспортировать отдельно.'],
        ['Можно ли конвертировать OBJ в STL для печати?', 'Да — откройте вкладку «Конвертация» и выберите STL. Для лучшего результата сначала запустите проверку замкнутости.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/glb-gltf-viewer.html', slug: 'glb', name: 'GLB / GLTF Viewer',
    formats: 'GLB and GLTF',
    intro: 'Inspect glTF 2.0 assets — the standard 3D format of the web — locally in your browser. GLB (binary glTF) and .gltf JSON files are supported, including multiple meshes, node transforms and both index formats.',
    more: 'The viewer applies each node\u2019s translation, rotation, scale and matrix transforms so models appear assembled as authored. For .gltf files that reference an external .bin buffer, select both files together in the file picker. Note that Draco- or meshopt-compressed assets are rejected with a clear message instead of failing silently, and textures are not rendered (geometry only).',
    faq: [
      ['What is the difference between GLB and glTF?', 'They contain the same data. A .gltf file is a JSON file plus separate binary buffers (and textures); a .glb file packs the JSON and binary data into a single file.'],
      ['Why does my .gltf file fail to load?', 'Most .gltf files reference an external <code>.bin</code> buffer. Select the .gltf and the .bin file together (Ctrl/Cmd-click or multi-select), or use a .glb, which is self-contained.'],
      ['Are textures and PBR materials displayed?', 'No. 3DTools focuses on mesh geometry — vertices, triangles and structure. Materials are preserved in name only when converting between GLB and GLTF.'],
      ['Does it support Draco compression?', 'No. Files that require the Draco or meshopt extensions are detected and rejected with an explanatory error. Re-export the asset without compression.'],
    ],
    ru: {
      name: 'Просмотр GLB / GLTF',
      intro: 'Инспектируйте ассеты glTF 2.0 — стандартный 3D-формат веба — локально в браузере. Поддерживаются GLB (бинарный glTF) и .gltf JSON, включая несколько мешей, трансформации узлов и оба формата индексов.',
      more: 'Просмотр применяет трансформации каждого узла (translation, rotation, scale, matrix), поэтому модели отображаются собранными, как задумано. Для .gltf со внешним .bin-буфером выберите оба файла вместе. Ассеты со сжатием Draco/meshopt отклоняются с понятным сообщением вместо тихого сбоя, текстуры не рендерятся (только геометрия).',
      faq: [
        ['В чём разница между GLB и glTF?', 'Данные одинаковые. Файл .gltf — это JSON плюс отдельные бинарные буферы (и текстуры); .glb упаковывает JSON и бинарные данные в один файл.'],
        ['Почему мой .gltf не загружается?', 'Большинство .gltf ссылаются на внешний буфер <code>.bin</code>. Выберите .gltf и .bin вместе (Ctrl/Cmd-клик или мультивыбор), либо используйте самодостаточный .glb.'],
        ['Отображаются ли текстуры и PBR-материалы?', 'Нет. 3DTools сфокусирован на геометрии мешей — вершины, треугольники, структура. Материалы сохраняются только по имени при конвертации между GLB и GLTF.'],
        ['Поддерживается ли сжатие Draco?', 'Нет. Файлы, требующие расширений Draco или meshopt, определяются и отклоняются с поясняющей ошибкой. Экспортируйте ассет без сжатия.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/ply-viewer.html', slug: 'ply', name: 'PLY Viewer',
    formats: 'PLY',
    intro: 'View Stanford PLY meshes in the browser. PLY comes in ASCII, binary little-endian and binary big-endian variants, and is popular in 3D scanning because it stores colors and can hold point clouds without faces.',
    more: 'The viewer auto-detects the encoding from the header. Scanned meshes with vertex colors keep their colors in the viewport. PLY files that contain only vertices (point clouds, no face list) are displayed as points rather than a surface.',
    faq: [
      ['Can it display point clouds?', 'Yes. A PLY file with vertices but no faces is rendered as points in the viewport.'],
      ['Are vertex colors supported?', 'Yes — red/green/blue vertex properties are read and displayed on the mesh.'],
      ['Which PLY encodings work?', 'ASCII, binary little-endian and binary big-endian, all auto-detected from the header.'],
      ['Can I convert a scanned PLY to STL?', 'Yes, but only if the file contains faces. A raw point cloud has no surface to print — mesh it first (e.g., with a reconstruction tool), then convert.'],
    ],
    ru: {
      name: 'Просмотр PLY',
      intro: 'Просматривайте меши Stanford PLY в браузере. PLY бывает в вариантах ASCII, binary little-endian и binary big-endian и популярен в 3D-сканировании, так как хранит цвета и может содержать облака точек без граней.',
      more: 'Кодировка определяется автоматически из заголовка. Сканированные меши с цветами вершин сохраняют цвета во вьюпорте. PLY-файлы только с вершинами (облака точек, без списка граней) отображаются как точки, а не поверхность.',
      faq: [
        ['Отображаются ли облака точек?', 'Да. PLY-файл с вершинами, но без граней рендерится как точки во вьюпорте.'],
        ['Поддерживаются ли цвета вершин?', 'Да — свойства red/green/blue читаются и отображаются на меша.'],
        ['Какие кодировки PLY работают?', 'ASCII, binary little-endian и binary big-endian — все определяются автоматически из заголовка.'],
        ['Можно ли конвертировать скан в STL?', 'Да, если в PLY есть грани. Облака точек не могут стать STL-мешами — у них нет поверхности.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/3mf-viewer.html', slug: '3mf', name: '3MF Viewer',
    formats: '3MF',
    intro: 'Open 3MF (3D Manufacturing Format) project files in your browser. 3MF is the modern replacement for STL in 3D printing: a ZIP package containing XML mesh data with units, object names and build transforms.',
    more: 'The viewer unpacks the 3MF container in the browser, parses the 3D model XML, applies build-item transforms and shows each object as a separate tab. Because 3MF defines units explicitly (the model unit is read from the file), measurements and printability checks are more meaningful than with unit-less STL.',
    faq: [
      ['What is a 3MF file?', 'A ZIP-based package standardized by the 3MF Consortium. It stores meshes in XML with millimeter units by default, supports multiple objects, transforms and metadata — solving STL\u2019s biggest weaknesses.'],
      ['Do you support 3MF production extensions?', 'The core spec is supported: objects, components, build items and transforms. Extensions like slices or materials are ignored if present; files that require unsupported extensions still show their base geometry.'],
      ['Can I convert 3MF back to STL?', 'Yes — the Convert tab exports STL (binary or ASCII), OBJ, PLY and glTF.'],
      ['Is my 3MF file uploaded?', 'No. The ZIP container is unpacked locally with the browser\u2019s DecompressionStream API.'],
    ],
    ru: {
      name: 'Просмотр 3MF',
      intro: 'Открывайте файлы проектов 3MF (3D Manufacturing Format) в браузере. 3MF — современная замена STL для 3D-печати: ZIP-пакет с XML-данными мешей, единицами, именами объектов и трансформациями сборки.',
      more: 'Просмотр распаковывает контейнер 3MF в браузере, парсит XML 3D-модели, применяет трансформации элементов сборки и показывает каждый объект отдельной вкладкой. Поскольку 3MF явно задаёт единицы (единица модели читается из файла), измерения и проверки пригодности к печати осмысленнее, чем с STL без единиц.',
      faq: [
        ['Что такое файл 3MF?', 'ZIP-пакет, стандартизированный консорциумом 3MF. Хранит меши в XML с миллиметровыми единицами по умолчанию, поддерживает несколько объектов, трансформации и метаданные — решая главные недостатки STL.'],
        ['Поддерживаются ли производственные расширения 3MF?', 'Поддерживается базовая спецификация: объекты, компоненты, элементы сборки и трансформации. Расширения вроде срезов или материалов игнорируются; файлы с неподдерживаемыми расширениями всё равно показывают базовую геометрию.'],
        ['Можно ли конвертировать 3MF обратно в STL?', 'Да — вкладка «Конвертация» экспортирует STL (бинарный или ASCII), OBJ, PLY и glTF.'],
        ['Загружается ли мой 3MF?', 'Нет. Контейнер ZIP распаковывается локально через DecompressionStream API браузера.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/multi-model-viewer.html', slug: 'multi-model', name: 'Multi-Model Viewer',
    formats: 'STL, OBJ, GLB, PLY and 3MF',
    intro: 'Load several 3D models at once and inspect them side by side in one viewport. Drop in a mix of STL, OBJ, GLB, PLY and 3MF files — or a single file that contains multiple objects — and each one becomes a tab you can toggle and edit independently.',
    more: 'Multi-model viewing is useful for comparing revisions, checking how parts fit together, or organizing a multi-part print. Every loaded model can be transformed, analyzed and exported individually, or merged into a single mesh with one click.',
    faq: [
      ['How many models can I load?', 'There is no fixed limit — it depends on your device memory. Each model is a GPU buffer; typical workstations handle dozens of medium meshes.'],
      ['Can I load different formats together?', 'Yes. Mix STL, OBJ, GLB, PLY and 3MF freely; each file is parsed by its own loader.'],
      ['Can I combine the models into one file?', 'Yes. Merge All Loaded Models produces a single mesh you can export in any supported format.'],
      ['Can I hide one model temporarily?', 'Yes — models have visibility toggles, and right-clicking a tab removes a model from the scene.'],
    ],
    ru: {
      name: 'Мульти-просмотр моделей',
      intro: 'Загружайте несколько 3D-моделей сразу и инспектируйте их рядом в одном вьюпорте. Перетащите смесь файлов STL, OBJ, GLB, PLY и 3MF — или один файл с несколькими объектами — и каждый станет вкладкой, которую можно переключать и редактировать независимо.',
      more: 'Мульти-просмотр полезен для сравнения ревизий, проверки стыковки деталей или организации многокомпонентной печати. Каждую загруженную модель можно трансформировать, анализировать и экспортировать по отдельности или объединить в один меш одним кликом.',
      faq: [
        ['Сколько моделей можно загрузить?', 'Жёсткого лимита нет — зависит от памяти устройства. Каждая модель — GPU-буфер; типичные рабочие станции справляются с десятками средних мешей.'],
        ['Можно ли загружать разные форматы вместе?', 'Да. Смешивайте STL, OBJ, GLB, PLY и 3MF свободно; каждый файл парсится своим загрузчиком.'],
        ['Можно ли объединить модели в один файл?', 'Да. «Объединить все загруженные модели» создаёт один меш, который можно экспортировать в любом поддерживаемом формате.'],
        ['Можно ли временно скрыть модель?', 'Да — у моделей есть переключатели видимости, а правый клик по вкладке удаляет модель из сцены.'],
      ],
    },
  }),
  viewerPage({
    path: '/viewer/inspection-views.html', slug: 'inspection', name: 'Wireframe, X-Ray & Normal Viewer',
    formats: 'any supported',
    intro: 'Beyond plain solid shading, the 3DTools viewport offers the inspection modes mesh work actually needs: wireframe, wireframe overlay, x-ray transparency, color-coded normals and vertex display — for every supported format.',
    more: 'Wireframe mode reveals triangle density and topology problems such as long thin triangles; the solid/wireframe toggle overlays the mesh edges on the shaded surface. X-Ray mode makes the model translucent so internal geometry, shells and internal overhangs become visible. Normal mode colors the surface by the direction it faces (a quick check for flipped normals — they render in the opposite rainbow direction), and vertex mode shows the raw point set. Cross-section slicing and measurement tools round out inspection.',
    faq: [
      ['What is the x-ray view for?', 'It renders the surface translucently so you can see internal structure — hollow shells, inner walls, or whether two parts intersect.'],
      ['How do I check for flipped normals?', 'Switch to the Normals display mode: correctly outward-facing surfaces show a consistent rainbow gradient; inverted patches look reversed.'],
      ['Can I see the wireframe and the shaded surface together?', 'Yes — enable “Wireframe overlay” in the View tab to draw edges on top of the shaded model.'],
      ['Do inspection modes work on all formats?', 'Yes — every mode (solid, wireframe, x-ray, normals, vertices) works on every mesh loaded into the studio.'],
    ],
    ru: {
      name: 'Просмотр: каркас, рентген и нормали',
      intro: 'Помимо обычного сплошного затенения вьюпорт 3DTools предлагает режимы инспекции, реально нужные для работы с мешами: каркас, каркас поверх, рентген-прозрачность, цветные нормали и отображение вершин — для каждого поддерживаемого формата.',
      more: 'Режим каркаса показывает плотность треугольников и проблемы топологии вроде длинных тонких треугольников; переключатель «каркас поверх» рисует рёбра поверх затенённой поверхности. Режим «Рентген» делает модель полупрозрачной — видны внутренняя геометрия, оболочки и внутренние нависания. Режим «Нормали» раскрашивает поверхность по направлению (быстрая проверка перевёрнутых нормалей — они рисуются в обратном направлении радуги), режим «Вершины» показывает сырой набор точек. Сечения и измерения дополняют инспекцию.',
      faq: [
        ['Для чего режим «Рентген»?', 'Он рендерит поверхность полупрозрачной — видна внутренняя структура: полые оболочки, внутренние стенки, пересечение деталей.'],
        ['Как проверить перевёрнутые нормали?', 'Переключитесь в режим «Нормали»: корректные наружные поверхности показывают равномерный радужный градиент; инвертированные участки выглядят перевёрнутыми.'],
        ['Можно ли видеть каркас и затенённую поверхность вместе?', 'Да — включите «Каркас поверх» на вкладке «Вид», чтобы рисовать рёбра поверх затенённой модели.'],
        ['Работают ли режимы инспекции со всеми форматами?', 'Да — каждый режим (сплошной, каркас, рентген, нормали, вершины) работает с любым мешем, загруженным в студию.'],
      ],
    },
  }),
];

function convertPage({ path, slug, from, to, fromDesc, toDesc, why, notes, faq, ru }) {
  return {
    path,
    title: `${from} to ${to} Converter — Free & Local | 3DTools`,
    description: `Convert ${from} to ${to} online for free. Files are converted locally in your browser — no upload, no queue, no email. Works with large files and shows real errors.`,
    h1: `${from} to ${to} Converter`,
    intro: `<p>Convert ${from} files to ${to} directly in your browser. There is no server-side conversion: your file is parsed, rebuilt in the target format and downloaded — all on your device, so even confidential models stay private and there is no file-size quota.</p>`,
    cta: { href: `/app.html?tool=${slug}`, label: `Convert ${from} to ${to}` },
    crumbs: [['/', 'Home'], ['/tools.html', 'Tools'], [path, `${from} \u2192 ${to}`]],
    jsonLdName: `${from} to ${to} Converter — 3DTools`,
    sections: [
      { id: 'how', h2: 'How to convert', html: `
<ol>
<li>Open the studio with the button above.</li>
<li>Drop in your <strong>${from}</strong> file (or several files at once).</li>
<li>Open the <strong>Convert</strong> tab, pick <strong>${to}</strong> and click <strong>Convert & Download</strong>.</li>
<li>The converted file downloads immediately.</li>
</ol>
<p>${why}</p>` },
      { id: 'formats', h2: 'About these formats', html: `
<table class="data">
<tr><th></th><th>${from}</th><th>${to}</th></tr>
<tr><td>Type</td><td>${fromDesc.type}</td><td>${toDesc.type}</td></tr>
<tr><td>Typical use</td><td>${fromDesc.use}</td><td>${toDesc.use}</td></tr>
<tr><td>Multiple objects</td><td>${fromDesc.objects}</td><td>${toDesc.objects}</td></tr>
<tr><td>Normals & UVs</td><td>${fromDesc.attributes}</td><td>${toDesc.attributes}</td></tr>
<tr><td>Units</td><td>${fromDesc.units}</td><td>${toDesc.units}</td></tr>
</table>
${notes}` },
      { id: 'limits', h2: 'Limitations', html: `
<ul>
<li>Geometry (vertices, triangles, normals${toDesc.uvs ? ', UVs' : ''}) is converted. Materials, textures and animations are not part of the mesh-only pipeline${toDesc.matNote ? '' : ' and are not carried over'}.</li>
<li>${fromDesc.limit}</li>
<li>Very large models are processed in a background worker, but browser memory is the practical limit.</li>
</ul>` },
    ],
    faq,
    related: [...REL_CONVERT, ...REL_VIEWER].filter(r => r[0] !== path).slice(0, 4),
    ru: ru && {
      title: `Конвертер ${from} в ${to} — бесплатно и локально | 3DTools`,
      description: `Конвертируйте ${from} в ${to} онлайн бесплатно. Файлы конвертируются локально в вашем браузере — без загрузки, очереди и почты. Работает с большими файлами и показывает реальные ошибки.`,
      h1: `Конвертер ${from} в ${to}`,
      intro: `<p>Конвертируйте файлы ${from} в ${to} прямо в браузере. Серверной конвертации нет: файл парсится, пересобирается в целевом формате и скачивается — всё на вашем устройстве, поэтому даже конфиденциальные модели остаются приватными и нет квоты на размер.</p>`,
      cta: { href: `/app.html?tool=${slug}`, label: `Конвертировать ${from} в ${to}` },
      crumbs: [['/', 'Главная'], ['/tools.html', 'Инструменты'], [path, `${from} \u2192 ${to}`]],
      jsonLdName: `Конвертер ${from} в ${to} — 3DTools`,
      sections: [
        { id: 'how', h2: 'Как конвертировать', html: `
<ol>
<li>Откройте студию кнопкой выше.</li>
<li>Перетащите файл <strong>${from}</strong> (или несколько файлов сразу).</li>
<li>Откройте вкладку <strong>Конвертация</strong>, выберите <strong>${to}</strong> и нажмите <strong>Конвертировать и скачать</strong>.</li>
<li>Конвертированный файл скачивается сразу.</li>
</ol>
<p>${ru.why}</p>` },
        { id: 'formats', h2: 'Об этих форматах', html: `
<table class="data">
<tr><th></th><th>${from}</th><th>${to}</th></tr>
<tr><td>Тип</td><td>${ru.fromDesc.type}</td><td>${ru.toDesc.type}</td></tr>
<tr><td>Типичное применение</td><td>${ru.fromDesc.use}</td><td>${ru.toDesc.use}</td></tr>
<tr><td>Несколько объектов</td><td>${ru.fromDesc.objects}</td><td>${ru.toDesc.objects}</td></tr>
<tr><td>Нормали и UV</td><td>${ru.fromDesc.attributes}</td><td>${ru.toDesc.attributes}</td></tr>
<tr><td>Единицы</td><td>${ru.fromDesc.units}</td><td>${ru.toDesc.units}</td></tr>
</table>
${ru.notes}` },
        { id: 'limits', h2: 'Ограничения', html: `
<ul>
<li>Конвертируется геометрия (вершины, треугольники, нормали${toDesc.uvs ? ', UV' : ''}). Материалы, текстуры и анимации не входят в конвейер мешей${toDesc.matNote ? '' : ' и не переносятся'}.</li>
<li>${ru.fromDesc.limit}</li>
<li>Очень большие модели обрабатываются в фоновом worker, но практический предел — память браузера.</li>
</ul>` },
      ],
      faq: ru.faq,
      related: [...REL_CONVERT_RU, ...REL_VIEWER_RU].filter(r => r[0] !== path).slice(0, 4),
    },
  };
}

const STL_D = { type: 'Triangle soup (binary or ASCII)', use: '3D printing, CAD interchange', objects: 'No — one unnamed solid', attributes: 'Per-face normals only', units: 'None defined (usually mm)', limit: 'STL has no units; the converter assumes millimeters as 3D printers do.' };
const OBJ_D = { type: 'Text-based polygon list', use: 'General 3D / DCC tools', objects: 'Yes — o/g groups become objects', attributes: 'Vertex normals and UVs', units: 'None defined', limit: 'OBJ material libraries (.mtl) and textures are not written by this converter.' };
const GLB_D = { type: 'Binary glTF 2.0 container', use: 'Web, AR/VR, runtime engines', objects: 'Yes — multiple meshes and nodes', attributes: 'Normals and UVs', units: 'Meters (per glTF spec)', limit: 'glTF stores units in meters; models converted to glTF keep their numeric coordinates (a 20mm part becomes 20 glTF units — scale in the target tool if needed).' };
const MF_D = { type: 'ZIP + XML package (OPC)', use: 'Modern 3D printing', objects: 'Yes — multiple objects with transforms', attributes: 'Triangles only (vertices + indices)', units: 'Explicit (mm by default)', limit: '3MF core-spec geometry is written; production extensions (slices, colors, materials) are not generated.' };
const PLY_D = { type: 'ASCII or binary polygon/point format', use: '3D scanning, research', objects: 'One mesh per file', attributes: 'Normals, UVs, vertex colors', units: 'None defined', limit: 'PLY conversion targets single meshes; multiple loaded models are merged.' };

const STL_D_RU = { type: 'Набор треугольников (бинарный или ASCII)', use: '3D-печать, обмен с CAD', objects: 'Нет — одно безымянное тело', attributes: 'Только нормали граней', units: 'Не заданы (обычно мм)', limit: 'В STL нет единиц; конвертер предполагает миллиметры, как 3D-принтеры.' };
const OBJ_D_RU = { type: 'Текстовый список полигонов', use: 'Общий 3D / DCC-инструменты', objects: 'Да — группы o/g становятся объектами', attributes: 'Нормали вершин и UV', units: 'Не заданы', limit: 'Библиотеки материалов OBJ (.mtl) и текстуры этим конвертером не записываются.' };
const GLB_D_RU = { type: 'Бинарный контейнер glTF 2.0', use: 'Веб, AR/VR, рантайм-движки', objects: 'Да — несколько мешей и узлов', attributes: 'Нормали и UV', units: 'Метры (по спецификации glTF)', limit: 'glTF хранит единицы в метрах; модели, конвертированные в glTF, сохраняют числовые координаты (деталь 20 мм станет 20 единицами glTF — при необходимости масштабируйте в целевом инструменте).' };
const MF_D_RU = { type: 'Пакет ZIP + XML (OPC)', use: 'Современная 3D-печать', objects: 'Да — несколько объектов с трансформациями', attributes: 'Только треугольники (вершины + индексы)', units: 'Явные (мм по умолчанию)', limit: 'Записывается геометрия базовой спецификации 3MF; производственные расширения (срезы, цвета, материалы) не генерируются.' };
const PLY_D_RU = { type: 'ASCII или бинарный формат полигонов/точек', use: '3D-сканирование, исследования', objects: 'Один меш на файл', attributes: 'Нормали, UV, цвета вершин', units: 'Не заданы', limit: 'Конвертация PLY рассчитана на одиночные меши; несколько загруженных моделей объединяются.' };

export const CONVERT_PAGES = [
  convertPage({
    path: '/convert/stl-to-obj.html', slug: 'stl-to-obj', from: 'STL', to: 'OBJ',
    fromDesc: STL_D, toDesc: OBJ_D,
    why: 'Converting STL to OBJ welds the triangle soup into shared vertices, which most modeling tools prefer, and lets you continue editing in tools like Blender, Maya or 3ds Max.',
    notes: '<p>On load, identical vertex positions in the STL are welded so the OBJ gets a real vertex table. Normals are recomputed smoothly where the surface allows.</p>',
    faq: [
      ['Is the STL to OBJ conversion free?', 'Yes, completely — and there is no upload: the conversion happens in your browser\u2019s JavaScript engine.'],
      ['Will the OBJ be watertight?', 'It inherits whatever topology the STL had. If the STL was watertight, the OBJ will be too. Run the manifold check before converting if you are unsure.'],
      ['Does the OBJ keep colors?', 'STL files do not contain colors, so no color data can exist in the converted OBJ.'],
    ],
    ru: {
      fromDesc: STL_D_RU, toDesc: OBJ_D_RU,
      why: 'Конвертация STL в OBJ сваривает набор треугольников в общие вершины — такой формат предпочитает большинство инструментов моделирования — и позволяет продолжить редактирование в Blender, Maya или 3ds Max.',
      notes: '<p>При загрузке одинаковые позиции вершин STL свариваются, поэтому OBJ получает настоящую таблицу вершин. Нормали пересчитываются сглаженно там, где позволяет поверхность.</p>',
      faq: [
        ['Конвертация STL в OBJ бесплатна?', 'Да, полностью — и без загрузки: конвертация происходит в JavaScript-движке вашего браузера.'],
        ['Будет ли OBJ водонепроницаемым?', 'Он наследует топологию исходного STL. Если STL был водонепроницаемым, OBJ тоже будет. Если сомневаетесь — запустите проверку замкнутости перед конвертацией.'],
        ['Сохранит ли OBJ цвета?', 'STL-файлы не содержат цветов, поэтому цветовых данных в конвертированном OBJ быть не может.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/obj-to-stl.html', slug: 'obj-to-stl', from: 'OBJ', to: 'STL',
    fromDesc: OBJ_D, toDesc: STL_D,
    why: 'Slicing software for 3D printing consumes STL (and 3MF). This converter flattens OBJ objects and groups into a single binary STL ready for the slicer, with correct triangle winding.',
    notes: '<p>Choose binary STL (default) for small files, or ASCII STL if some legacy tool requires text. Multiple OBJ objects are merged into one solid; use “include all loaded models” to merge several files too.</p>',
    faq: [
      ['Can it convert multiple OBJ objects into one STL?', 'Yes. OBJ objects and material groups are merged into a single solid — STL supports only one unnamed solid per file.'],
      ['Will normals and UVs survive?', 'No — the STL format has no UVs, and normals are stored per triangle. The geometry itself is preserved exactly.'],
      ['Should I repair the mesh first?', 'If the OBJ has holes or flipped faces, repair it in the Repair tab first — STL converters cannot fix topology, they only translate it.'],
    ],
    ru: {
      fromDesc: OBJ_D_RU, toDesc: STL_D_RU,
      why: 'Слайсеры для 3D-печати принимают STL (и 3MF). Этот конвертер сводит объекты и группы OBJ в один бинарный STL, готовый для слайсера, с корректным обходом треугольников.',
      notes: '<p>Выбирайте бинарный STL (по умолчанию) для небольших файлов или ASCII STL, если старый инструмент требует текст. Несколько объектов OBJ объединяются в одно тело; опция «включить все загруженные модели» объединяет и несколько файлов.</p>',
      faq: [
        ['Можно ли конвертировать несколько объектов OBJ в один STL?', 'Да. Объекты и группы материалов OBJ объединяются в одно тело — STL поддерживает только одно безымянное тело на файл.'],
        ['Сохранятся ли нормали и UV?', 'Нет — в формате STL нет UV, а нормали хранятся по треугольникам. Сама геометрия сохраняется точно.'],
        ['Стоит ли сначала отремонтировать меш?', 'Если в OBJ есть дыры или перевёрнутые грани, сначала отремонтируйте на вкладке «Ремонт» — конвертеры STL не исправляют топологию, а лишь переносят её.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/stl-to-3mf.html', slug: 'stl-to-3mf', from: 'STL', to: '3MF',
    fromDesc: STL_D, toDesc: MF_D,
    why: '3MF packages the same triangles with explicit millimeter units, a proper name, and a modern container — most slicers (PrusaSlicer, Bambu Studio, Cura) accept it and treat it as a first-class format.',
    notes: '<p>The output is a spec-compliant OPC package: <code>[Content_Types].xml</code>, package relationships and the core 3D model part. Multiple loaded models become multiple objects inside one 3MF.</p>',
    faq: [
      ['Why convert STL to 3MF at all?', '3MF declares units, holds multiple named objects, compresses better and is less ambiguous than STL — the 3MF Consortium (Microsoft, HP, Ultimaker, Prusa and others) designed it as STL\u2019s replacement.'],
      ['Does the 3MF keep triangle count?', 'Yes, geometry is stored as an indexed mesh — identical triangles, usually a smaller file than STL.'],
      ['Is the 3MF valid for slicers?', 'The core spec is implemented; slicers generally accept core-spec files. Special extensions (colors, per-object settings) are not generated.'],
    ],
    ru: {
      fromDesc: STL_D_RU, toDesc: MF_D_RU,
      why: '3MF упаковывает те же треугольники с явными миллиметровыми единицами, нормальным именем и современным контейнером — большинство слайсеров (PrusaSlicer, Bambu Studio, Cura) принимают его как полноценный формат.',
      notes: '<p>Результат — OPC-пакет по спецификации: <code>[Content_Types].xml</code>, связи пакета и основная часть 3D-модели. Несколько загруженных моделей становятся несколькими объектами внутри одного 3MF.</p>',
      faq: [
        ['Зачем вообще конвертировать STL в 3MF?', '3MF объявляет единицы, хранит несколько именованных объектов, лучше сжимается и менее двусмыслен, чем STL — консорциум 3MF (Microsoft, HP, Ultimaker, Prusa и др.) создавал его как замену STL.'],
        ['Сохраняет ли 3MF число треугольников?', 'Да, геометрия хранится как индексированный меш — идентичные треугольники, обычно файл меньше STL.'],
        ['Валиден ли 3MF для слайсеров?', 'Реализована базовая спецификация; слайсеры обычно принимают такие файлы. Специальные расширения (цвета, настройки объектов) не генерируются.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/obj-to-glb.html', slug: 'obj-to-glb', from: 'OBJ', to: 'GLB',
    fromDesc: OBJ_D, toDesc: GLB_D,
    why: 'GLB is the single-file binary glTF used across the web — three.js, Babylon.js, model viewers and AR frameworks all load it natively. Converting OBJ to GLB gives you a compact, indexed, runtime-ready asset.',
    notes: '<p>Each OBJ object becomes a glTF mesh/node. Vertex normals and UVs are carried over; 32-bit indices are used automatically when a mesh exceeds 65,536 vertices.</p>',
    faq: [
      ['Does the GLB include textures from the .mtl file?', 'No — this is a geometry converter. UV coordinates are preserved so you can re-apply materials in any glTF editor.'],
      ['Is the GLB spec-compliant?', 'Yes: glTF 2.0 with a JSON chunk, binary buffer, accessors with min/max, and index buffers, generated with correct 4-byte alignment and padding.'],
      ['Can I convert back?', 'Yes — load the GLB and export OBJ (or STL, PLY, 3MF) from the same studio.'],
    ],
    ru: {
      fromDesc: OBJ_D_RU, toDesc: GLB_D_RU,
      why: 'GLB — однофайловый бинарный glTF, используемый по всему вебу: three.js, Babylon.js, просмотрщики моделей и AR-фреймворки загружают его нативно. Конвертация OBJ в GLB даёт компактный индексированный ассет, готовый к рантайму.',
      notes: '<p>Каждый объект OBJ становится мешем/узлом glTF. Нормали вершин и UV переносятся; 32-битные индексы используются автоматически, когда меш превышает 65 536 вершин.</p>',
      faq: [
        ['Включает ли GLB текстуры из файла .mtl?', 'Нет — это конвертер геометрии. UV-координаты сохраняются, чтобы вы могли заново применить материалы в любом редакторе glTF.'],
        ['Соответствует ли GLB спецификации?', 'Да: glTF 2.0 с JSON-чанком, бинарным буфером, аксессорами с min/max и индексными буферами, с корректным 4-байтовым выравниванием и паддингом.'],
        ['Можно ли конвертировать обратно?', 'Да — загрузите GLB и экспортируйте OBJ (или STL, PLY, 3MF) в той же студии.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/glb-to-obj.html', slug: 'glb-to-obj', from: 'GLB', to: 'OBJ',
    fromDesc: GLB_D, toDesc: OBJ_D,
    why: 'Extract editable OBJ geometry from binary glTF assets. Node transforms (translation/rotation/scale/matrix) are applied during conversion, so the OBJ matches the assembled glTF scene, not the raw node-local coordinates.',
    notes: '<p>Each glTF mesh becomes an OBJ object with its name preserved. UVs and normals are exported when present. .gltf files with external .bin buffers work too — select both files together.</p>',
    faq: [
      ['Are glTF node transforms applied?', 'Yes — translation, rotation, scale and full matrices are baked into the exported vertices.'],
      ['What about textures and materials?', 'Material names are carried into OBJ <code>usemtl</code> references, but texture data is not extracted.'],
      ['Does it work with .gltf files too?', 'Yes — including .gltf with external .bin buffers when you select the files together, and base64-embedded buffers.'],
    ],
    ru: {
      fromDesc: GLB_D_RU, toDesc: OBJ_D_RU,
      why: 'Извлекайте редактируемую геометрию OBJ из бинарных glTF-ассетов. Трансформации узлов (translation/rotation/scale/matrix) применяются при конвертации, поэтому OBJ соответствует собранной сцене glTF, а не сырым локальным координатам узлов.',
      notes: '<p>Каждый меш glTF становится объектом OBJ с сохранением имени. UV и нормали экспортируются при наличии. Файлы .gltf с внешними .bin-буферами тоже работают — выберите оба файла вместе.</p>',
      faq: [
        ['Применяются ли трансформации узлов glTF?', 'Да — translation, rotation, scale и полные матрицы запекаются в экспортируемые вершины.'],
        ['А как же текстуры и материалы?', 'Имена материалов переносятся в ссылки OBJ <code>usemtl</code>, но данные текстур не извлекаются.'],
        ['Работает ли с файлами .gltf?', 'Да — включая .gltf с внешними .bin-буферами (выберите файлы вместе) и буферами в base64.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/gltf-to-glb.html', slug: 'gltf-to-glb', from: 'GLTF', to: 'GLB',
    fromDesc: { ...GLB_D, type: 'JSON + external/embedded buffers' }, toDesc: GLB_D,
    why: 'Packaging a multi-file .gltf (JSON + .bin + textures) into a single self-contained .glb makes assets dramatically easier to distribute, attach and load.',
    notes: '<p>Select the .gltf and its .bin file(s) together in the file picker. The JSON is re-serialized with a single binary chunk; base64 data-URI buffers are repacked into binary too.</p>',
    faq: [
      ['How do I convert a .gltf with an external .bin?', 'Select both files (the .gltf and the .bin) at once when opening, then export GLB.'],
      ['Are Draco-compressed files supported?', 'No — Draco requires its own decoder and is rejected with a clear error. Export the asset without compression first.'],
      ['Is data lost in GLTF to GLB conversion?', 'The geometry, accessors and node structure are preserved. This tool focuses on meshes; exotic extensions may be dropped.'],
    ],
    ru: {
      fromDesc: { ...GLB_D_RU, type: 'JSON + внешние/встроенные буферы' }, toDesc: GLB_D_RU,
      why: 'Упаковка многофайлового .gltf (JSON + .bin + текстуры) в один самодостаточный .glb делает ассеты значительно проще для распространения, прикрепления и загрузки.',
      notes: '<p>Выберите .gltf и его .bin-файл(ы) вместе в диалоге выбора. JSON пересериализуется с одним бинарным чанком; буферы в base64 data-URI тоже перепаковываются в бинарные.</p>',
      faq: [
        ['Как конвертировать .gltf с внешним .bin?', 'Выберите оба файла (.gltf и .bin) одновременно при открытии, затем экспортируйте GLB.'],
        ['Поддерживаются ли файлы со сжатием Draco?', 'Нет — Draco требует собственного декодера и отклоняется с понятной ошибкой. Сначала экспортируйте ассет без сжатия.'],
        ['Теряются ли данные при конвертации GLTF в GLB?', 'Геометрия, аксессоры и структура узлов сохраняются. Инструмент сфокусирован на мешах; экзотические расширения могут быть отброшены.'],
      ],
    },
  }),
  convertPage({
    path: '/convert/ply-to-obj.html', slug: 'ply-to-obj', from: 'PLY', to: 'OBJ',
    fromDesc: PLY_D, toDesc: OBJ_D,
    why: 'Turn scanned PLY meshes into OBJ files that every DCC tool opens. Vertex colors and normals from the scan are preserved in the OBJ where present.',
    notes: '<p>Binary and ASCII PLY are auto-detected, including big-endian files. Polygons with more than three vertices are fan-triangulated. Point clouds (PLY without faces) cannot become OBJ meshes — there is no surface to write.</p>',
    faq: [
      ['Does it keep vertex colors?', 'OBJ supports vertex colors only as a non-standard extension, so colors are not written. Convert to PLY or GLB if you need them.'],
      ['My PLY is a point cloud — why no OBJ?', 'An OBJ file describes faces; a point cloud has none. Mesh the point cloud first (e.g., Poisson reconstruction), then convert.'],
      ['Which PLY dialects are supported?', 'ASCII, binary little-endian and binary big-endian, with any of the standard property types (char/short/int/float/double and their unsigned variants).'],
    ],
    ru: {
      fromDesc: PLY_D_RU, toDesc: OBJ_D_RU,
      why: 'Превращайте сканированные PLY-меши в OBJ-файлы, которые открывает любой DCC-инструмент. Цвета вершин и нормали из скана сохраняются в OBJ при наличии.',
      notes: '<p>Бинарный и ASCII PLY определяются автоматически, включая big-endian файлы. Полигоны с более чем тремя вершинами триангулируются веером. Облака точек (PLY без граней) не могут стать OBJ-мешами — поверхности для записи нет.</p>',
      faq: [
        ['Сохраняются ли цвета вершин?', 'OBJ поддерживает цвета вершин только как нестандартное расширение, поэтому цвета не записываются. Конвертируйте в PLY или GLB, если они нужны.'],
        ['Мой PLY — облако точек, почему нет OBJ?', 'Файл OBJ описывает грани; у облака точек их нет. Сначала восстановите меш из облака (например, реконструкцией Пуассона), затем конвертируйте.'],
        ['Какие диалекты PLY поддерживаются?', 'ASCII, binary little-endian и binary big-endian с любыми стандартными типами свойств (char/short/int/float/double и их беззнаковые варианты).'],
      ],
    },
  }),
  convertPage({
    path: '/convert/3mf-to-stl.html', slug: '3mf-to-stl', from: '3MF', to: 'STL',
    fromDesc: MF_D, toDesc: STL_D,
    why: 'Older slicers and CAM packages only read STL. This converter unpacks the 3MF package, applies build-item transforms and writes a single binary or ASCII STL.',
    notes: '<p>Every build item is included, with its transform baked in. If the 3MF contains several objects they are merged into the STL (STL holds one solid). Need separate files? Convert each object individually from the model tabs.</p>',
    faq: [
      ['Are 3MF build transforms applied?', 'Yes — the transform matrix of every build item (and nested component) is applied to the vertices.'],
      ['Which 3MF variants are supported?', 'Core-spec packages: objects, components, build items, transforms. Files using vendor extensions still convert if they contain base mesh data.'],
      ['Will the STL be watertight?', 'If the 3MF mesh is watertight, yes. Run the manifold check on the result if it matters.'],
    ],
    ru: {
      fromDesc: MF_D_RU, toDesc: STL_D_RU,
      why: 'Старые слайсеры и CAM-пакеты читают только STL. Этот конвертер распаковывает пакет 3MF, применяет трансформации элементов сборки и записывает один бинарный или ASCII STL.',
      notes: '<p>Включается каждый элемент сборки с запечённой трансформацией. Если 3MF содержит несколько объектов, они объединяются в STL (STL хранит одно тело). Нужны отдельные файлы? Конвертируйте каждый объект по отдельности из вкладок моделей.</p>',
      faq: [
        ['Применяются ли трансформации сборки 3MF?', 'Да — матрица трансформации каждого элемента сборки (и вложенного компонента) применяется к вершинам.'],
        ['Какие варианты 3MF поддерживаются?', 'Пакеты базовой спецификации: объекты, компоненты, элементы сборки, трансформации. Файлы с вендорскими расширениями конвертируются, если содержат базовые данные меша.'],
        ['Будет ли STL водонепроницаемым?', 'Если меш 3MF водонепроницаем — да. Если это важно, запустите проверку замкнутости на результате.'],
      ],
    },
  }),
];
