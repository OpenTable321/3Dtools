// 3DTools — client-side i18n (EN default, RU dictionary).
// Text nodes are matched by exact trimmed English string and swapped.
// Dynamic strings go through window.__t(s).
(function () {
  'use strict';

  var RU = {
    // site chrome (header nav, footer)
    'Home': 'Главная',
    'All Tools': 'Все инструменты',
    'Formats': 'Форматы',
    'Viewers': 'Просмотр',
    'Mesh Tools': 'Инструменты меша',
    '3D Printing': '3D-печать',
    'About': 'О сайте',
    'Contact': 'Контакты',
    'Contact 3DTools': 'Контакты 3DTools',
    'Privacy Policy': 'Политика конфиденциальности',
    'Terms of Use': 'Условия использования',
    'Disclaimer': 'Отказ от ответственности',
    'Sitemap': 'Карта сайта',
    'Converters': 'Конвертеры',
    'Toolbox': 'Инструменты',
    'Site': 'Сайт',
    'STL Viewer': 'Просмотр STL',
    'OBJ Viewer': 'Просмотр OBJ',
    'GLB/GLTF Viewer': 'Просмотр GLB/GLTF',
    'PLY Viewer': 'Просмотр PLY',
    '3MF Viewer': 'Просмотр 3MF',
    'Multi-Model Viewer': 'Мульти-просмотр моделей',
    'STL to OBJ': 'STL в OBJ',
    'OBJ to STL': 'OBJ в STL',
    'STL to 3MF': 'STL в 3MF',
    'OBJ to GLB': 'OBJ в GLB',
    'GLB to OBJ': 'GLB в OBJ',
    'GLTF to GLB': 'GLTF в GLB',
    'PLY to OBJ': 'PLY в OBJ',
    '3MF to STL': '3MF в STL',
    'Mesh Repair & Editing': 'Ремонт и правка меша',
    'Open Studio': 'Открыть студию',
    'Mesh Repair & Editing Tools': 'Инструменты ремонта и правки меша',
    'Related Tools': 'Похожие инструменты',
    'Overhang Detection': 'Поиск нависаний',
    'Wall Thickness (approximate)': 'Толщина стенок (приближение)',
    ' — done.': ' — готово.',
    'Frequently Asked Questions': 'Часто задаваемые вопросы',
    'Runs locally in your browser — your file never leaves your device.': 'Работает локально в вашем браузере — файл не покидает ваше устройство.',

    // app toolbar
    'Open File(s)': 'Открыть файл(ы)',
    'Fit': 'Вписать',
    'Zoom to fit (F)': 'Вписать в экран (F)',
    'Clear All': 'Очистить всё',

    // panel tabs
    'View': 'Вид',
    'Transform': 'Преобразование',
    'Repair': 'Ремонт',
    'Edit': 'Правка',
    'Analyze': 'Анализ',
    'Convert': 'Конвертация',

    // view pane
    'Display': 'Отображение',
    'Solid': 'Сплошной',
    'Wireframe only': 'Только каркас',
    'X-Ray (transparent)': 'Рентген (прозрачность)',
    'Normals (color-coded)': 'Нормали (цветокод)',
    'Vertices': 'Вершины',
    'Wireframe overlay': 'Каркас поверх',
    'Show vertices': 'Показывать вершины',
    'Grid': 'Сетка',
    'Camera': 'Камера',
    'Front': 'Спереди',
    'Back': 'Сзади',
    'Top': 'Сверху',
    'Bottom': 'Снизу',
    'Right': 'Справа',
    'Left': 'Слева',
    'Iso': 'Изометрия',
    'Bounding box': 'Габаритный бокс',
    'Screenshot': 'Скриншот',
    'Captures the current viewport as a PNG image, locally.': 'Сохраняет текущую область просмотра как PNG-изображение, локально.',
    'Save Viewport PNG': 'Сохранить PNG области просмотра',

    // transform pane
    'Scale': 'Масштаб',
    'Factor': 'Коэффициент',
    'Apply Uniform': 'Применить общий',
    'Apply Per-Axis': 'Применить по осям',
    'Rotate': 'Поворот',
    'Custom': 'Свой угол',
    'Mirror': 'Зеркало',
    'Mirror X': 'Зеркало X',
    'Mirror Y': 'Зеркало Y',
    'Mirror Z': 'Зеркало Z',
    'Position': 'Положение',
    'Center on Origin': 'Центрировать в начале координат',
    'Center + Ground': 'Центр + пол',
    'Drop to Ground': 'Опустить на пол',

    // repair pane
    'Repair Mesh': 'Ремонт меша',
    'Welds duplicate vertices, removes degenerate and duplicate faces, fixes triangle winding and inside-out orientation, recomputes normals.': 'Сваривает дубли вершин, удаляет вырожденные и повторяющиеся грани, исправляет обход треугольников и вывернутость, пересчитывает нормали.',
    'Weld tol.': 'Допуск сварки',
    'Individual Operations': 'Отдельные операции',
    'Tolerance': 'Допуск',
    'Remove Duplicate Vertices': 'Удалить дубли вершин',
    'Remove Duplicate Faces': 'Удалить дубли граней',
    'Recalculate Normals (smooth)': 'Пересчитать нормали (сглаженные)',
    'Flip Normals / Winding': 'Инвертировать нормали / обход',

    // edit pane
    'Simplify / Decimate': 'Упрощение / децимация',
    'Quadric edge-collapse decimation. Reduces triangle count while preserving shape. UVs are dropped.': 'Децимация методом квадратичной метрики. Уменьшает число треугольников, сохраняя форму. UV отбрасываются.',
    'Decimate': 'Упростить',
    'Hollow Model': 'Полая модель',
    'Creates an inner shell offset inward by the wall thickness and merges it with the outer surface. Approximation: concave areas thinner than 2× thickness can self-intersect.': 'Создаёт внутреннюю оболочку со смещением внутрь на толщину стенки и объединяет её с внешней поверхностью. Приближение: вогнутые участки тоньше 2× толщины могут самопересекаться.',
    'Hollow': 'Сделать полой',
    'Wall (mm)': 'Стенка (мм)',
    'Add Base': 'Добавить основание',
    'Adds a rectangular base plate under the model footprint.': 'Добавляет прямоугольную пластину-основание под моделью.',
    'Thickness': 'Толщина',
    'Margin': 'Отступ',
    'Cut / Split': 'Резка / разделение',
    'Cap cut surface': 'Закрыть срез',
    'Keep Above Plane': 'Оставить выше плоскости',
    'Keep Below Plane': 'Оставить ниже плоскости',
    'Split Into Two Models': 'Разделить на две модели',
    'Objects': 'Объекты',
    'Separate Objects (by connectivity)': 'Разделить объекты (по связности)',
    'Merge All Loaded Models': 'Объединить все модели',
    'Delete Selection': 'Удаление выделения',
    'Ctrl+Click faces or vertices in the viewport to select them (highlighted red), then delete.': 'Ctrl+клик по граням или вершинам в области просмотра выделяет их (красным), затем удалите.',
    'Faces': 'Грани',
    'Clear Selection': 'Сбросить выделение',
    'Delete Selected Faces': 'Удалить выделенные грани',
    'Delete Selected Vertices': 'Удалить выделенные вершины',

    // analyze pane
    'Mesh Analysis': 'Анализ меша',
    'Mesh Statistics': 'Статистика меша',
    'Volume & Surface Area': 'Объём и площадь поверхности',
    'Manifold Check': 'Проверка замкнутости',
    'Printability Check': 'Проверка пригодности к печати',
    'Overhang angle': 'Угол нависания',
    'Detect Overhangs': 'Найти нависания',
    'Wall Thickness Check': 'Проверка толщины стенок',
    'Auto-orient (lay flattest side down)': 'Авто-ориентация (самая плоская сторона вниз)',
    'Apply Orientation': 'Применить ориентацию',
    'Cross Section': 'Поперечное сечение',
    'Slice': 'Срез',
    'Clear': 'Очистить',
    'Measure': 'Измерение',
    'Measure Distance': 'Измерить расстояние',
    'Measure Angle': 'Измерить угол',
    'Click points on the model surface. Distance needs 2 points, angle needs 3.': 'Кликайте точки на поверхности модели. Расстоянию нужно 2 точки, углу — 3.',

    // export pane
    'Convert & Download': 'Конвертировать и скачать',
    'Converts the active model (or all models, for multi-object formats) and downloads the result. Processing happens locally in your browser.': 'Конвертирует активную модель (или все модели для мульти-объектных форматов) и скачивает результат. Обработка выполняется локально в вашем браузере.',
    'STL (binary)': 'STL (бинарный)',
    'PLY (binary)': 'PLY (бинарный)',
    'GLTF (embedded)': 'GLTF (встроенный)',
    'Include all loaded models': 'Включить все загруженные модели',
    'Binary STL. Single solid, no colors/UVs. Best for 3D printing and CAD interchange. Units are assumed to be millimeters.': 'Бинарный STL. Одно тело, без цветов и UV. Лучший выбор для 3D-печати и CAD-обмена. Единицы предполагаются миллиметрами.',
    'ASCII (text) STL. Same geometry as binary STL but ~5× larger. Some legacy tools require it.': 'ASCII (текстовый) STL. Та же геометрия, но примерно в 5 раз больше. Нужен некоторым старым программам.',
    'Wavefront OBJ. Supports multiple objects, normals and UVs. Materials (MTL) are not exported.': 'Wavefront OBJ. Поддерживает несколько объектов, нормали и UV. Материалы (MTL) не экспортируются.',
    'Binary PLY. Single mesh with normals/UVs if present.': 'Бинарный PLY. Один меш с нормалями/UV, если есть.',
    'ASCII PLY. Text format, larger files.': 'ASCII PLY. Текстовый формат, файлы больше.',
    'glTF 2.0 binary. Modern web standard; supports multiple meshes, normals, UVs.': 'glTF 2.0 бинарный. Современный веб-стандарт; поддерживает несколько мешей, нормали, UV.',
    'glTF 2.0 JSON with base64-embedded buffer. Human-readable glTF.': 'glTF 2.0 JSON со встроенным base64-буфером. Читаемый glTF.',
    '3MF. Modern 3D-printing format; multiple objects, XML+ZIP package, units in millimeters.': '3MF. Современный формат 3D-печати; несколько объектов, пакет XML+ZIP, единицы — миллиметры.',

    // empty state / statusbar
    'No model loaded': 'Модель не загружена',
    'Drop STL / OBJ / PLY / GLB / 3MF files here, or click': 'Перетащите файлы STL / OBJ / PLY / GLB / 3MF сюда или нажмите',
    'Everything is processed locally — nothing is uploaded.': 'Всё обрабатывается локально — ничего не загружается на сервер.',
    'Load Sample Model': 'Загрузить пример модели',
    'Drop files to load': 'Отпустите файлы для загрузки',
    'Ready.': 'Готово.',

    // status messages (main.js)
    'Load a model first.': 'Сначала загрузите модель.',
    'Screenshot saved.': 'Скриншот сохранён.',
    'Converting…': 'Конвертация…',
    'Conversion failed: ': 'Не удалось конвертировать: ',
    'Loaded built-in sample model (parametric torus knot, generated locally).': 'Загружен встроенный пример модели (параметрический торический узел, сгенерирован локально).',
    'Merged all models into one.': 'Все модели объединены в одну.',
    'Load at least two models to merge.': 'Для объединения загрузите минимум две модели.',
    'Split into two models (see model tabs; right-click a tab to remove it).': 'Разделено на две модели (см. вкладки моделей; правый клик по вкладке удаляет её).',
    'Mesh is a single connected object — nothing to separate.': 'Меш — один связный объект, разделять нечего.',
    'Statistics computed. Bounding box shown in viewport.': 'Статистика посчитана. Габаритный бокс показан во вьюпорте.',
    'Mesh is watertight/manifold.': 'Меш замкнут (watertight/manifold).',
    'Mesh is NOT watertight — see details.': 'Меш НЕ замкнут — подробности в результатах.',
    'Wall thickness check done (approximate — see limitations).': 'Проверка толщины стенок завершена (приближение — см. ограничения).',
    'Printability check passed.': 'Проверка пригодности к печати пройдена.',
    'Measure distance: click two points on the model.': 'Измерение расстояния: кликните две точки на модели.',
    'Measure angle: click three points (vertex B is the angle corner).': 'Измерение угла: кликните три точки (вершина B — угол).',
    'Auto-oriented: largest face normal aimed down (approximation), then dropped to ground.': 'Авто-ориентация: нормаль наибольшей грани направлена вниз (приближение), затем опускание на пол.',
    'Model dropped to ground (z=0).': 'Модель опущена на пол (z=0).',
    ' failed: ': ' не удалось: ',

    // op labels (main.js runOp / opReplacesMesh)
    'Repairing mesh': 'Ремонт меша',
    'Removing duplicate vertices': 'Удаление дублей вершин',
    'Removing duplicate faces': 'Удаление дублей граней',
    'Recalculating normals': 'Пересчёт нормалей',
    'Flipping normals': 'Инвертирование нормалей',
    'Hollowing model': 'Создание полости',
    'Adding base': 'Добавление основания',
    'Cutting (keeping above plane)': 'Резка (оставляем выше плоскости)',
    'Cutting (keeping below plane)': 'Резка (оставляем ниже плоскости)',
    'Splitting by plane': 'Разделение плоскостью',
    'Separating objects': 'Разделение объектов',
    'Merging models': 'Объединение моделей',
    'Deleting faces': 'Удаление граней',
    'Deleting vertices': 'Удаление вершин',
    'Computing statistics': 'Расчёт статистики',
    'Computing volume & area': 'Расчёт объёма и площади',
    'Checking manifold': 'Проверка замкнутости',
    'Detecting overhangs': 'Поиск нависаний',
    'Checking wall thickness (ray sampling)': 'Проверка толщины стенок (лучи)',
    'Running printability check': 'Проверка пригодности к печати',
    'Computing cross section': 'Расчёт поперечного сечения',
    'Scaled': 'Масштаб изменён',
    'Rotated': 'Поворот выполнен',
    'Mirrored': 'Отражение выполнено',
    'Centered': 'Центрировано',
    'Aligned': 'Выровнено',

    // analyze result rows
    'Volume': 'Объём',
    'Surface area': 'Площадь поверхности',
    'Volume (if mm)': 'Объём (если мм)',
    'Note': 'Примечание',
    'Volume assumes a watertight mesh': 'Объём предполагает замкнутый меш',
    'Watertight': 'Замкнутость',
    'yes': 'да',
    'no': 'нет',
    'no (triangle soup)': 'нет (набор треугольников)',
    'present': 'есть',
    'missing': 'нет',
    'Indexed': 'Индексированный',
    'Normals': 'Нормали',
    'UVs': 'UV',
    'Size X': 'Размер X',
    'Size Y': 'Размер Y',
    'Size Z': 'Размер Z',
    'units': 'ед.',
    'units²': 'ед.²',
    'units³': 'ед.³',
    'cm³': 'см³',
    'Boundary edges': 'Граничные рёбра',
    'Non-manifold edges': 'Немногообразные рёбра',
    'Non-manifold vertices': 'Немногообразные вершины',
    'Threshold': 'Порог',
    'Overhanging faces': 'Нависающие грани',
    'Overhanging area': 'Площадь нависаний',
    'Total area': 'Общая площадь',
    'Overhang %': 'Нависание, %',
    'Method': 'Метод',
    'inward ray sampling (approximation)': 'лучи внутрь (приближение)',
    'Samples': 'Замеры',
    'Minimum': 'Минимум',
    'Average': 'Среднее',
    'Maximum': 'Максимум',
    'Thin spots (< 1 unit)': 'Тонкие места (< 1 ед.)',
    'Issue': 'Проблема',
    'Warning': 'Предупреждение',
    'Info': 'Инфо',
    'Triangles': 'Треугольники',
  };

  var origText = new WeakMap();
  var origTitle = new WeakMap();

  function detectLang() {
    try {
      var saved = localStorage.getItem('lang');
      if (saved === 'ru' || saved === 'en') return saved;
    } catch (e) { /* no storage */ }
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('ru') === 0 ? 'ru' : 'en';
  }

  var lang = detectLang();

  window.__t = function (s) {
    if (lang !== 'ru' || typeof s !== 'string') return s;
    var v = RU[s];
    return v !== undefined ? v : s;
  };
  window.__lang = function () { return lang; };

  function walkText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue || !n.nodeValue.trim()) return;
      var key = n.nodeValue.trim();
      if (lang === 'ru') {
        var v = RU[key];
        if (v !== undefined) {
          if (!origText.has(n)) origText.set(n, n.nodeValue);
          n.nodeValue = v;
        }
      } else if (origText.has(n)) {
        n.nodeValue = origText.get(n);
      }
    });
  }

  function walkAttrs(root) {
    root.querySelectorAll('[title]').forEach(function (el) {
      if (lang === 'ru') {
        var v = RU[el.getAttribute('title')];
        if (v !== undefined) {
          if (!origTitle.has(el)) origTitle.set(el, el.getAttribute('title'));
          el.setAttribute('title', v);
        }
      } else if (origTitle.has(el)) {
        el.setAttribute('title', origTitle.get(el));
      }
    });
  }

  function apply() {
    document.documentElement.lang = lang;
    walkText(document.body || document.documentElement);
    walkAttrs(document.body || document.documentElement);
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.textContent = lang === 'ru' ? 'EN' : 'RU';
      b.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
    });
  }

  window.__setLang = function (l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) { /* no storage */ }
    apply();
  };

  function init() {
    apply();
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        window.__setLang(lang === 'ru' ? 'en' : 'ru');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
