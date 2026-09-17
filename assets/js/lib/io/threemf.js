// 3MF (3D Manufacturing Format) parser + exporter.
// 3MF is a ZIP (OPC) package containing 3D/3dmodel.model XML.
import { Mesh } from '../mesh.js';
import { unzip, zip } from '../zip.js';

// --- minimal XML parser (elements + attributes + text), enough for 3MF ---
export function parseXML(text) {
  let i = 0;
  const doc = { tag: '#document', attrs: {}, children: [], parent: null, text: '' };
  let cur = doc;
  const s = text;
  while (i < s.length) {
    const lt = s.indexOf('<', i);
    if (lt === -1) break;
    if (s.startsWith('<!--', lt)) { const end = s.indexOf('-->', lt); i = end === -1 ? s.length : end + 3; continue; }
    if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
      const end = s.indexOf('>', lt);
      i = end === -1 ? s.length : end + 1;
      continue;
    }
    if (s.startsWith('</', lt)) {
      const end = s.indexOf('>', lt);
      if (cur.parent) cur = cur.parent;
      i = end === -1 ? s.length : end + 1;
      continue;
    }
    // start tag
    let j = lt + 1;
    let name = '';
    while (j < s.length && !/[\s/>]/.test(s[j])) name += s[j++];
    const el = { tag: name, attrs: {}, children: [], parent: cur, text: '' };
    let selfClosing = false;
    while (j < s.length && s[j] !== '>') {
      while (j < s.length && /\s/.test(s[j])) j++;
      if (s[j] === '>' || s[j] === '/') {
        if (s[j] === '/') { selfClosing = true; j++; }
        break;
      }
      let an = '';
      while (j < s.length && !/[\s=/>]/.test(s[j])) an += s[j++];
      while (j < s.length && /\s/.test(s[j])) j++;
      let av = '';
      if (s[j] === '=') {
        j++;
        while (j < s.length && /\s/.test(s[j])) j++;
        const q = s[j]; j++;
        while (j < s.length && s[j] !== q) av += s[j++];
        j++;
      }
      el.attrs[an] = decodeEntities(av);
    }
    if (s[j] === '>') j++;
    cur.children.push(el);
    if (!selfClosing) {
      const nextLt = s.indexOf('<', j);
      el.text = nextLt === -1 ? s.slice(j) : s.slice(j, nextLt);
      cur = el;
    }
    i = j;
  }
  return doc;
}

function decodeEntities(s) {
  const AMP = '\u0026';
  return String(s)
    .replace(/\u0026#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/\u0026lt;/g, '<')
    .replace(/\u0026gt;/g, '>')
    .replace(/\u0026quot;/g, '"')
    .replace(/\u0026apos;/g, "'")
    .replace(/\u0026amp;/g, AMP);
}
function encodeEntities(s) {
  const AMP = '\u0026';
  return String(s)
    .replace(/\u0026/g, AMP + 'amp;')
    .replace(/</g, AMP + 'lt;')
    .replace(/>/g, AMP + 'gt;')
    .replace(/"/g, AMP + 'quot;');
}

function childElements(el, tag) { return el.children.filter(c => c.tag === tag); }

export async function parse3MF(buffer, name = 'model') {
  const files = await unzip(new Uint8Array(buffer));
  let modelPath = null;
  for (const [path, data] of files) {
    if (/\.model$/i.test(path)) { modelPath = path; break; }
  }
  if (!modelPath) throw new Error('No 3D model part found inside the 3MF package.');
  const xml = new TextDecoder().decode(files.get(modelPath));
  const doc = parseXML(xml);
  const modelEl = findFirst(doc, 'model');
  if (!modelEl) throw new Error('3MF model XML is missing the <model> element.');
  const unit = (modelEl.attrs.unit || 'millimeter').toLowerCase();

  // resources: objects
  const objects = new Map();
  const resources = findFirst(modelEl, 'resources');
  if (resources) {
    for (const obj of childElements(resources, 'object')) {
      objects.set(obj.attrs.id, obj);
    }
  }

  const meshes = [];
  const build = findFirst(modelEl, 'build');

  function addMeshFromObject(objEl, matrix, label) {
    const meshEl = findFirst(objEl, 'mesh');
    if (meshEl) {
      const vertsEl = findFirst(meshEl, 'vertices');
      const trisEl = findFirst(meshEl, 'triangles');
      const verts = [];
      if (vertsEl) {
        for (const v of childElements(vertsEl, 'vertex')) {
          verts.push([parseFloat(v.attrs.x || 0), parseFloat(v.attrs.y || 0), parseFloat(v.attrs.z || 0)]);
        }
      }
      const tris = [];
      if (trisEl) {
        for (const t of childElements(trisEl, 'triangle')) {
          tris.push([+t.attrs.v1, +t.attrs.v2, +t.attrs.v3]);
        }
      }
      if (verts.length === 0 || tris.length === 0) return;
      const positions = new Float32Array(verts.length * 3);
      verts.forEach((v, i) => positions.set(v, i * 3));
      const indices = new Uint32Array(tris.length * 3);
      tris.forEach((t, i) => indices.set(t, i * 3));
      const mesh = new Mesh({ name: label || `object_${objEl.attrs.id}`, positions, indices });
      if (matrix) applyTransform(mesh, matrix);
      meshes.push(mesh);
    }
    // components: references to other objects with transforms
    const compsEl = findFirst(objEl, 'components');
    if (compsEl) {
      for (const c of childElements(compsEl, 'component')) {
        const ref = objects.get(c.attrs.objectid);
        if (ref) {
          const cm = c.attrs.transform ? parseTransform(c.attrs.transform) : null;
          addMeshFromObject(ref, cm ? combineMatrices(matrix, cm) : matrix, label);
        }
      }
    }
  }

  if (build) {
    for (const item of childElements(build, 'item')) {
      const obj = objects.get(item.attrs.objectid);
      if (!obj) continue;
      const m = item.attrs.transform ? parseTransform(item.attrs.transform) : null;
      addMeshFromObject(obj, m, obj.attrs.name || null);
    }
  } else {
    // no build section: take all model objects
    for (const [id, obj] of objects) {
      if ((obj.attrs.type || 'model') === 'model') addMeshFromObject(obj, null, obj.attrs.name || null);
    }
  }

  if (meshes.length === 0) throw new Error('No mesh geometry found in 3MF file.');
  return meshes;
}

function findFirst(el, tag) {
  if (el.tag === tag) return el;
  for (const c of el.children) {
    const r = findFirst(c, tag);
    if (r) return r;
  }
  return null;
}

// 3MF transform: 4 rows x 3 cols, row-major: "m00 m01 m02 m10 m11 m12 m20 m21 m22 m30 m31 m32"
// last row is translation. Returns column-major 4x4 for our applyMatrix.
function parseTransform(str) {
  const v = str.trim().split(/\s+/).map(Number);
  if (v.length !== 12 || v.some(n => !Number.isFinite(n))) throw new Error('Invalid 3MF transform attribute.');
  return v;
}

// Compose so the result applies `second` first, then `first`.
function combineMatrices(first, second) {
  const a = first, b = second;
  const out = new Array(12);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      out[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
    }
  }
  for (let c = 0; c < 3; c++) {
    out[9 + c] = a[c * 3] * b[9] + a[c * 3 + 1] * b[10] + a[c * 3 + 2] * b[11] + a[9 + c];
  }
  return out;
}

function applyTransform(mesh, t) {
  const p = mesh.positions;
  for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    p[i] = t[0] * x + t[1] * y + t[2] * z + t[9];
    p[i + 1] = t[3] * x + t[4] * y + t[5] * z + t[10];
    p[i + 2] = t[6] * x + t[7] * y + t[8] * z + t[11];
  }
}

// ---------------- 3MF exporter ----------------

export function export3MF(meshes) {
  const list = (Array.isArray(meshes) ? meshes : [meshes]).filter(m => m.positions && m.positions.length > 0);
  if (list.length === 0) throw new Error('Nothing to export.');
  const meshXml = list.map((m, i) => {
    const p = m.positions;
    const idx = m.indices;
    const vc = p.length / 3;
    const triCount = idx ? idx.length / 3 : vc / 3;
    let verts = '';
    for (let v = 0; v < vc; v++) {
      verts += `<vertex x="${num(p[v * 3])}" y="${num(p[v * 3 + 1])}" z="${num(p[v * 3 + 2])}"/>`;
    }
    let tris = '';
    for (let t = 0; t < triCount; t++) {
      const a = idx ? idx[t * 3] : t * 3;
      const b = idx ? idx[t * 3 + 1] : t * 3 + 1;
      const c = idx ? idx[t * 3 + 2] : t * 3 + 2;
      tris += `<triangle v1="${a}" v2="${b}" v3="${c}"/>`;
    }
    const nm = encodeEntities(m.name || `object_${i + 1}`);
    return `<object id="${i + 1}" type="model" name="${nm}"><mesh><vertices>${verts}</vertices><triangles>${tris}</triangles></mesh></object>`;
  }).join('');
  const items = list.map((_, i) => `<item objectid="${i + 1}"/>`).join('');
  const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
<metadata name="Application">3DTools</metadata>
<resources>${meshXml}</resources>
<build>${items}</build>
</model>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>`;
  const encoder = new TextEncoder();
  const files = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rels) },
    { name: '3D/3dmodel.model', data: encoder.encode(modelXml) },
  ];
  return zip(files).buffer;
}

function num(v) {
  return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(6)));
}
