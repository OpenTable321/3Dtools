// OBJ parser + exporter. Supports v/vn/vt, faces (triangulated), groups (g),
// usemtl (grouped into separate meshes), and comments. Ignores lines/curves/suppresses.
import { Mesh } from '../mesh.js';

export function parseOBJ(text, name = 'model') {
  const lines = text.split('\n');
  const positions = [];
  const normals = [];
  const uvs = [];
  const groups = []; // { material, faces: [[ [iv,it,in] x3 ]] }
  let current = newGroup(null, null);
  let hasNormals = false;
  let hasUVs = false;
  let lineNo = 0;
  let currentMaterial = null;

  function newGroup(objName, material) {
    const g = { objName, material, faces: [] };
    groups.push(g);
    return g;
  }

  for (const raw of lines) {
    lineNo++;
    const line = raw.trim();
    if (line.length === 0 || line[0] === '#') continue;
    const sp = line.indexOf(' ');
    const tag = sp === -1 ? line : line.slice(0, sp);
    const rest = sp === -1 ? '' : line.slice(sp + 1);

    if (tag === 'v') {
      const [x, y, z] = rest.trim().split(/\s+/).map(Number);
      if ([x, y, z].some(v => !Number.isFinite(v))) continue;
      positions.push(x, y, z);
    } else if (tag === 'vn') {
      const [x, y, z] = rest.trim().split(/\s+/).map(Number);
      normals.push(x, y, z);
    } else if (tag === 'vt') {
      const parts = rest.trim().split(/\s+/).map(Number);
      uvs.push(parts[0] || 0, parts[1] || 0);
    } else if (tag === 'f') {
      const verts = rest.trim().split(/\s+/);
      if (verts.length < 3) continue;
      const parsed = [];
      for (const vdef of verts) {
        // formats: v, v/vt, v//vn, v/vt/vn — indices are 1-based, negatives offset from end
        const parts = vdef.split('/');
        const vi = toIndex(parts[0], positions.length / 3);
        if (vi === null) { parsed.length = 0; break; }
        const ti = parts.length > 1 && parts[1] !== '' ? toIndex(parts[1], uvs.length / 2) : null;
        const ni = parts.length > 2 && parts[2] !== '' ? toIndex(parts[2], normals.length / 3) : null;
        if (ti !== null) hasUVs = true;
        if (ni !== null) hasNormals = true;
        parsed.push([vi, ti, ni]);
      }
      if (parsed.length === 0) continue;
      // fan triangulation of n-gons
      for (let i = 1; i < parsed.length - 1; i++) {
        current.faces.push([parsed[0], parsed[i], parsed[i + 1]]);
      }
    } else if (tag === 'g' || tag === 'o' || tag === 'usemtl') {
      if (tag === 'usemtl') {
        currentMaterial = rest.trim() || null;
        if (current.faces.length > 0) current = newGroup(null, currentMaterial);
        else current.material = currentMaterial;
      } else {
        current = newGroup(rest.trim() || null, currentMaterial);
      }
    }
  }

  function toIndex(s, count) {
    if (!s) return null;
    let n = parseInt(s, 10);
    if (!Number.isFinite(n)) return null;
    if (n > 0) return n - 1;
    if (n < 0) return count + n;
    return null;
  }

  const meshes = [];
  for (const g of groups) {
    if (g.faces.length === 0) continue;
    const vMap = new Map(); // "v/vt/vn" -> new index
    const gPositions = [];
    const gNormals = [];
    const gUVs = [];
    const indices = [];
    for (const face of g.faces) {
      const tri = [];
      for (const [vi, ti, ni] of face) {
        const key = `${vi}/${ti}/${ni}`;
        let id = vMap.get(key);
        if (id === undefined) {
          id = gPositions.length / 3;
          vMap.set(key, id);
          gPositions.push(positions[vi * 3], positions[vi * 3 + 1], positions[vi * 3 + 2]);
          if (hasNormals) {
            if (ni !== null && normals.length >= (ni + 1) * 3) {
              gNormals.push(normals[ni * 3], normals[ni * 3 + 1], normals[ni * 3 + 2]);
            } else {
              gNormals.push(0, 0, 0);
            }
          }
          if (hasUVs) {
            if (ti !== null && uvs.length >= (ti + 1) * 2) {
              gUVs.push(uvs[ti * 2], uvs[ti * 2 + 1]);
            } else {
              gUVs.push(0, 0);
            }
          }
        }
        tri.push(id);
      }
      indices.push(tri[0], tri[1], tri[2]);
    }
    const mesh = new Mesh({
      name: g.material || g.objName || name,
      positions: new Float32Array(gPositions),
      indices: new Uint32Array(indices),
    });
    if (hasNormals) mesh.normals = new Float32Array(gNormals);
    if (hasUVs) mesh.uvs = new Float32Array(gUVs);
    mesh.materialName = g.material;
    meshes.push(mesh);
  }
  if (meshes.length === 0) throw new Error('No faces found in OBJ file.');
  return meshes;
}

// Build a mesh list from an OBJ file; returns array (may be multiple objects).
export function parseOBJToMeshes(text, name) {
  return parseOBJ(text, name);
}

export function exportOBJ(meshes, opts = {}) {
  const list = Array.isArray(meshes) ? meshes : [meshes];
  const lines = [];
  lines.push('# Exported by 3DTools');
  let vOffset = 1;
  for (const mesh of list) {
    if (!mesh.positions || mesh.positions.length === 0) continue;
    lines.push(`o ${sanitizeName(mesh.name)}`);
    if (mesh.materialName) lines.push(`usemtl ${sanitizeName(mesh.materialName)}`);
    const p = mesh.positions;
    for (let i = 0; i < p.length; i += 3) {
      lines.push(`v ${fmt(p[i])} ${fmt(p[i + 1])} ${fmt(p[i + 2])}`);
    }
    const hasUV = !!mesh.uvs;
    const hasN = !!mesh.normals;
    if (hasUV) {
      const uv = mesh.uvs;
      for (let i = 0; i < uv.length; i += 2) {
        lines.push(`vt ${fmt(uv[i])} ${fmt(uv[i + 1])}`);
      }
    }
    if (hasN) {
      const n = mesh.normals;
      for (let i = 0; i < n.length; i += 3) {
        lines.push(`vn ${fmt(n[i])} ${fmt(n[i + 1])} ${fmt(n[i + 2])}`);
      }
    }
    const idx = mesh.indices;
    const vc = p.length / 3;
    const triCount = idx ? idx.length / 3 : vc / 3;
    for (let t = 0; t < triCount; t++) {
      const parts = [];
      for (let k = 0; k < 3; k++) {
        const vi = idx ? idx[t * 3 + k] : t * 3 + k;
        const o = vOffset + vi;
        if (hasUV && hasN) parts.push(`${o}/${o}/${o}`);
        else if (hasUV) parts.push(`${o}/${o}`);
        else if (hasN) parts.push(`${o}//${o}`);
        else parts.push(`${o}`);
      }
      lines.push('f ' + parts.join(' '));
    }
    vOffset += vc;
  }
  return lines.join('\n') + '\n';
}

function sanitizeName(s) {
  return String(s || 'model').replace(/\s+/g, '_');
}

function fmt(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}
