// Core mesh data structure shared by all parsers, exporters, ops and workers.
// Plain typed arrays only — no Three.js dependency, runs in Node and the browser.

export class Mesh {
  constructor(opts = {}) {
    this.name = opts.name || 'model';
    this.positions = opts.positions || new Float32Array(0); // xyz per vertex
    this.normals = opts.normals || null;                     // xyz per vertex (optional)
    this.uvs = opts.uvs || null;                             // uv per vertex (optional)
    this.colors = opts.colors || null;                       // rgb per vertex (optional)
    this.indices = opts.indices || null;                     // triangle indices or null (non-indexed)
    this.materialName = opts.materialName || null;
  }

  get vertexCount() { return this.positions.length / 3; }
  get faceCount() {
    return this.indices ? this.indices.length / 3 : this.positions.length / 9;
  }
  get indexed() { return !!this.indices; }
}

export function triangleCount(mesh) {
  return mesh.indices ? mesh.indices.length / 3 : mesh.positions.length / 9;
}

// Iterate triangles as triples of vertex indices (into mesh.positions).
export function makeTriangleIterator(mesh) {
  const idx = mesh.indices;
  const triCount = triangleCount(mesh);
  return function (t) {
    if (t < 0 || t >= triCount) return null;
    if (idx) return [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]];
    const o = t * 3;
    return [o, o + 1, o + 2];
  };
}

export function bounds(positions) {
  const n = positions.length / 3;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      const v = positions[i * 3 + a];
      if (v < min[a]) min[a] = v;
      if (v > max[a]) max[a] = v;
    }
  }
  if (n === 0) return { min: [0, 0, 0], max: [0, 0, 0], center: [0, 0, 0], size: [0, 0, 0] };
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  return { min, max, center, size };
}

export function meshBounds(mesh) { return bounds(mesh.positions); }

const _tn = new Float32Array(3);

export function faceNormal(mesh, t, out) {
  out = out || _tn;
  const idx = mesh.indices;
  let ia, ib, ic;
  if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
  else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
  const p = mesh.positions;
  const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
  const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;
  const l = Math.hypot(nx, ny, nz);
  if (l > 0) { nx /= l; ny /= l; nz /= l; }
  out[0] = nx; out[1] = ny; out[2] = nz;
  return out;
}

// Compute smooth vertex normals. Works for indexed and non-indexed meshes
// (non-indexed meshes get their face normal, i.e. flat shading).
export function computeVertexNormals(mesh) {
  const p = mesh.positions;
  const vc = p.length / 3;
  const normals = new Float32Array(vc * 3);
  const idx = mesh.indices;
  if (idx) {
    for (let t = 0; t < idx.length / 3; t++) {
      const n = faceNormal(mesh, t);
      for (let k = 0; k < 3; k++) {
        const vi = idx[t * 3 + k] * 3;
        normals[vi] += n[0]; normals[vi + 1] += n[1]; normals[vi + 2] += n[2];
      }
    }
    for (let i = 0; i < vc; i++) {
      const o = i * 3;
      const l = Math.hypot(normals[o], normals[o + 1], normals[o + 2]);
      if (l > 0) { normals[o] /= l; normals[o + 1] /= l; normals[o + 2] /= l; }
    }
  } else {
    for (let t = 0; t < p.length / 9; t++) {
      const n = faceNormal(mesh, t);
      for (let k = 0; k < 3; k++) {
        const o = t * 9 + k * 3;
        normals[o] = n[0]; normals[o + 1] = n[1]; normals[o + 2] = n[2];
      }
    }
  }
  mesh.normals = normals;
  return mesh;
}

export function cloneMesh(mesh) {
  return new Mesh({
    name: mesh.name,
    positions: mesh.positions.slice(),
    normals: mesh.normals ? mesh.normals.slice() : null,
    uvs: mesh.uvs ? mesh.uvs.slice() : null,
    colors: mesh.colors ? mesh.colors.slice() : null,
    indices: mesh.indices ? mesh.indices.slice() : null,
    materialName: mesh.materialName,
  });
}

// ---------- transforms ----------

export function translateMesh(mesh, dx, dy, dz) {
  const p = mesh.positions;
  for (let i = 0; i < p.length; i += 3) { p[i] += dx; p[i + 1] += dy; p[i + 2] += dz; }
  return mesh;
}

export function scaleMesh(mesh, sx, sy, sz) {
  const p = mesh.positions;
  for (let i = 0; i < p.length; i += 3) { p[i] *= sx; p[i + 1] *= sy; p[i + 2] *= sz; }
  return mesh;
}

const AXIS_VEC = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };

export function rotateMesh(mesh, axis, radians) {
  const av = AXIS_VEC[axis] || axis;
  const [ax, ay, az] = av;
  const c = Math.cos(radians), s = Math.sin(radians), t = 1 - c;
  const m00 = t * ax * ax + c, m01 = t * ax * ay - s * az, m02 = t * ax * az + s * ay;
  const m10 = t * ax * ay + s * az, m11 = t * ay * ay + c, m12 = t * ay * az - s * ax;
  const m20 = t * ax * az - s * ay, m21 = t * ay * az + s * ax, m22 = t * az * az + c;
  const p = mesh.positions;
  for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    p[i] = m00 * x + m01 * y + m02 * z;
    p[i + 1] = m10 * x + m11 * y + m12 * z;
    p[i + 2] = m20 * x + m21 * y + m22 * z;
  }
  // normals transform by the same rotation (valid for orthonormal matrices)
  const nr = mesh.normals;
  if (nr) {
    for (let i = 0; i < nr.length; i += 3) {
      const x = nr[i], y = nr[i + 1], z = nr[i + 2];
      nr[i] = m00 * x + m01 * y + m02 * z;
      nr[i + 1] = m10 * x + m11 * y + m12 * z;
      nr[i + 2] = m20 * x + m21 * y + m22 * z;
    }
  }
  return mesh;
}

// Mirror across a plane perpendicular to the given axis; flips triangle winding.
export function mirrorMesh(mesh, axis) {
  const p = mesh.positions;
  const ai = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  for (let i = 0; i < p.length; i += 3) p[i + ai] = -p[i + ai];
  const nr = mesh.normals;
  if (nr) for (let i = 0; i < nr.length; i += 3) nr[i + ai] = -nr[i + ai];
  flipWinding(mesh);
  return mesh;
}

export function flipWinding(mesh) {
  const idx = mesh.indices;
  if (idx) {
    for (let i = 0; i < idx.length; i += 3) {
      const tmp = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = tmp;
    }
  } else {
    const p = mesh.positions;
    const nr = mesh.normals;
    const uv = mesh.uvs;
    for (let t = 0; t < p.length / 9; t++) {
      const o = t * 9;
      for (let a = 0; a < 3; a++) {
        const va = p[o + 3 + a]; p[o + 3 + a] = p[o + 6 + a]; p[o + 6 + a] = va;
        if (nr) { const na = nr[o + 3 + a]; nr[o + 3 + a] = nr[o + 6 + a]; nr[o + 6 + a] = na; }
      }
      if (uv) {
        const u = t * 6;
        for (let a = 0; a < 2; a++) {
          const va = uv[u + 2 + a]; uv[u + 2 + a] = uv[u + 4 + a]; uv[u + 4 + a] = va;
        }
      }
    }
  }
  return mesh;
}

// Center the bounding box on the origin (optionally also drop to ground).
export function centerMesh(mesh, dropToGround = false) {
  const b = meshBounds(mesh);
  const dz = dropToGround ? -b.min[2] : -b.center[2];
  translateMesh(mesh, -b.center[0], -b.center[1], dz);
  return mesh;
}

// Snap the lowest point of the mesh to z = 0.
export function alignToGround(mesh) {
  const b = meshBounds(mesh);
  translateMesh(mesh, 0, 0, -b.min[2]);
  return mesh;
}

// ---------- combining / filtering ----------

export function mergeMeshes(meshes) {
  const named = meshes.filter(m => m && m.positions.length > 0);
  if (named.length === 0) return new Mesh();
  const anyIndexed = named.every(m => m.indices);
  let vTotal = 0, iTotal = 0, hasNormals = true, hasUvs = true;
  for (const m of named) {
    vTotal += m.positions.length / 3;
    iTotal += m.indices ? m.indices.length : m.positions.length / 3;
    if (!m.normals) hasNormals = false;
    if (!m.uvs) hasUvs = false;
  }
  const positions = new Float32Array(vTotal * 3);
  const normals = hasNormals ? new Float32Array(vTotal * 3) : null;
  const uvs = hasUvs ? new Float32Array(vTotal * 2) : null;
  const indices = anyIndexed ? new Uint32Array(iTotal) : null;
  let vo = 0, io = 0;
  for (const m of named) {
    positions.set(m.positions, vo * 3);
    if (normals && m.normals) normals.set(m.normals, vo * 3);
    if (uvs && m.uvs) uvs.set(m.uvs, vo * 2);
    if (indices) {
      const mi = m.indices;
      for (let i = 0; i < mi.length; i++) indices[io + i] = mi[i] + vo;
      io += m.indices.length;
    }
    vo += m.positions.length / 3;
  }
  const out = new Mesh({ name: named[0].name, positions, normals, uvs, indices });
  if (!hasNormals) out.normals = null;
  if (!hasUvs) out.uvs = null;
  return out;
}

// Build a vertex -> face adjacency list. Returns array of arrays of face indices.
export function vertexToFaces(mesh) {
  const vc = mesh.positions.length / 3;
  const fc = triangleCount(mesh);
  const idx = mesh.indices;
  const map = new Array(vc);
  for (let i = 0; i < vc; i++) map[i] = [];
  for (let t = 0; t < fc; t++) {
    if (idx) {
      map[idx[t * 3]].push(t);
      map[idx[t * 3 + 1]].push(t);
      map[idx[t * 3 + 2]].push(t);
    } else {
      map[t * 3].push(t); map[t * 3 + 1].push(t); map[t * 3 + 2].push(t);
    }
  }
  return map;
}

// Split into connected components by shared vertices (exact vertex indices).
// Returns array of Mesh. Non-indexed meshes are welded by exact position first.
export function splitComponents(mesh, onProgress) {
  let src = mesh;
  if (!mesh.indices) src = weldExact(mesh);
  const idx = src.indices;
  const vc = src.positions.length / 3;
  const fc = idx.length / 3;
  // vertex -> incident faces, built in O(fc)
  const v2fHead = new Int32Array(vc).fill(-1);
  const v2fNext = new Int32Array(fc * 3);
  for (let t = 0; t < fc; t++) {
    for (let k = 0; k < 3; k++) {
      const v = idx[t * 3 + k];
      v2fNext[t * 3 + k] = v2fHead[v];
      v2fHead[v] = t;
    }
  }
  const comp = new Int32Array(vc).fill(-1);
  const stack = [];
  let nComp = 0;
  for (let v0 = 0; v0 < vc; v0++) {
    if (comp[v0] !== -1) continue;
    stack.length = 0; stack.push(v0); comp[v0] = nComp;
    while (stack.length) {
      const u = stack.pop();
      // walk all faces incident to u
      for (let f = v2fHead[u]; f !== -1;) {
        for (let k = 0; k < 3; k++) {
          const w = idx[f * 3 + k];
          if (comp[w] === -1) { comp[w] = nComp; stack.push(w); }
        }
        // advance: find which slot of face f referenced u
        let slot = 0;
        while (idx[f * 3 + slot] !== u) slot++;
        f = v2fNext[f * 3 + slot];
      }
    }
    nComp++;
    if (onProgress && (v0 & 8191) === 0) onProgress(v0 / vc);
  }
  const counts = new Int32Array(nComp);
  for (let v = 0; v < vc; v++) counts[comp[v]]++;
  const remap = new Int32Array(vc).fill(-1);
  const out = [];
  for (let c = 0; c < nComp; c++) {
    const nv = counts[c];
    const positions = new Float32Array(nv * 3);
    const normals = src.normals ? new Float32Array(nv * 3) : null;
    const uvs = src.uvs ? new Float32Array(nv * 2) : null;
    const faces = [];
    let next = 0;
    for (let v = 0; v < vc; v++) {
      if (comp[v] !== c) continue;
      remap[v] = next;
      positions.set(src.positions.subarray(v * 3, v * 3 + 3), next * 3);
      if (normals) normals.set(src.normals.subarray(v * 3, v * 3 + 3), next * 3);
      if (uvs) uvs.set(src.uvs.subarray(v * 2, v * 2 + 2), next * 2);
      next++;
    }
    for (let t = 0; t < fc; t++) {
      if (comp[idx[t * 3]] === c) faces.push(remap[idx[t * 3]], remap[idx[t * 3 + 1]], remap[idx[t * 3 + 2]]);
    }
    out.push(new Mesh({
      name: nComp > 1 ? `${src.name}_part${c + 1}` : src.name,
      positions, normals, uvs,
      indices: new Uint32Array(faces),
    }));
  }
  return out;
}

// Weld vertices with identical positions (exact). Non-indexed -> indexed.
export function weldExact(mesh) {
  const p = mesh.positions;
  const vc = p.length / 3;
  const map = new Map();
  const remap = new Int32Array(vc);
  const newPositions = [];
  for (let v = 0; v < vc; v++) {
    const key = p[v * 3] + ',' + p[v * 3 + 1] + ',' + p[v * 3 + 2];
    let id = map.get(key);
    if (id === undefined) {
      id = newPositions.length / 3;
      map.set(key, id);
      newPositions.push(p[v * 3], p[v * 3 + 1], p[v * 3 + 2]);
    }
    remap[v] = id;
  }
  const positions = new Float32Array(newPositions);
  let normals = null, uvs = null;
  if (mesh.normals) {
    normals = new Float32Array(positions.length);
    const cnt = new Float32Array(positions.length / 3);
    for (let v = 0; v < vc; v++) {
      const r = remap[v];
      for (let a = 0; a < 3; a++) {
        normals[r * 3 + a] += mesh.normals[v * 3 + a] / 1;
      }
      cnt[r]++;
    }
    for (let r = 0; r < cnt.length; r++) {
      if (cnt[r] > 1) for (let a = 0; a < 3; a++) normals[r * 3 + a] /= cnt[r];
    }
  }
  if (mesh.uvs) {
    uvs = new Float32Array((positions.length / 3) * 2);
    const seen = new Uint8Array(positions.length / 3);
    for (let v = 0; v < vc; v++) {
      const r = remap[v];
      if (!seen[r]) { uvs[r * 2] = mesh.uvs[v * 2]; uvs[r * 2 + 1] = mesh.uvs[v * 2 + 1]; seen[r] = 1; }
    }
  }
  const fc = mesh.indices ? mesh.indices.length / 3 : vc / 3;
  const indices = new Uint32Array(fc * 3);
  for (let t = 0; t < fc; t++) {
    if (mesh.indices) {
      indices[t * 3] = remap[mesh.indices[t * 3]];
      indices[t * 3 + 1] = remap[mesh.indices[t * 3 + 1]];
      indices[t * 3 + 2] = remap[mesh.indices[t * 3 + 2]];
    } else {
      indices[t * 3] = remap[t * 3];
      indices[t * 3 + 1] = remap[t * 3 + 1];
      indices[t * 3 + 2] = remap[t * 3 + 2];
    }
  }
  return new Mesh({ name: mesh.name, positions, normals, uvs, indices, materialName: mesh.materialName });
}

// Remove triangles by predicate. Keeps mesh non-indexed/indexed as-is.
export function filterFaces(mesh, keepFn) {
  const fc = triangleCount(mesh);
  const idx = mesh.indices;
  const keepIdx = [];
  let keptTris = [];
  for (let t = 0; t < fc; t++) {
    if (!keepFn(t)) continue;
    if (idx) keepIdx.push(idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]);
    else keptTris.push(t);
  }
  if (idx) {
    return new Mesh({
      name: mesh.name, positions: mesh.positions, normals: mesh.normals,
      uvs: mesh.uvs, colors: mesh.colors, indices: new Uint32Array(keepIdx),
      materialName: mesh.materialName,
    });
  }
  const tris = keptTris;
  const positions = new Float32Array(tris.length * 9);
  const normals = mesh.normals ? new Float32Array(tris.length * 9) : null;
  const uvs = mesh.uvs ? new Float32Array(tris.length * 6) : null;
  tris.forEach((t, i) => {
    positions.set(mesh.positions.subarray(t * 9, t * 9 + 9), i * 9);
    if (normals) normals.set(mesh.normals.subarray(t * 9, t * 9 + 9), i * 9);
    if (uvs) uvs.set(mesh.uvs.subarray(t * 6, t * 6 + 6), i * 2 * 3);
  });
  return new Mesh({ name: mesh.name, positions, normals, uvs, materialName: mesh.materialName });
}

// Remove selected vertices (and their faces), re-indexing.
export function removeVertices(mesh, removeSet) {
  const vc = mesh.positions.length / 3;
  const remap = new Int32Array(vc).fill(-1);
  let next = 0;
  for (let v = 0; v < vc; v++) if (!removeSet.has(v)) remap[v] = next++;
  const positions = new Float32Array(next * 3);
  const normals = mesh.normals ? new Float32Array(next * 3) : null;
  const uvs = mesh.uvs ? new Float32Array(next * 2) : null;
  for (let v = 0; v < vc; v++) {
    const r = remap[v]; if (r < 0) continue;
    positions.set(mesh.positions.subarray(v * 3, v * 3 + 3), r * 3);
    if (normals) normals.set(mesh.normals.subarray(v * 3, v * 3 + 3), r * 3);
    if (uvs) uvs.set(mesh.uvs.subarray(v * 2, v * 2 + 2), r * 2);
  }
  let indices = null;
  if (!mesh.indices) {
    // For triangle soups, deleting vertices is ambiguous — weld to indexed first.
    const tmp = new Mesh({ name: mesh.name, positions, normals, uvs, indices: null, materialName: mesh.materialName });
    return removeVertices(weldExact(tmp), removeSet);
  }
  const out = [];
  for (let t = 0; t < mesh.indices.length; t += 3) {
    const a = remap[mesh.indices[t]], b = remap[mesh.indices[t + 1]], c = remap[mesh.indices[t + 2]];
    if (a >= 0 && b >= 0 && c >= 0) out.push(a, b, c);
  }
  indices = new Uint32Array(out);
  return new Mesh({ name: mesh.name, positions, normals, uvs, indices, materialName: mesh.materialName });
}

// Drop zero-area and topologically degenerate triangles.
export function removeDegenerate(mesh) {
  const idx = mesh.indices;
  if (!idx) return mesh;
  const out = [];
  const p = mesh.positions;
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    if (a === b || b === c || a === c) continue;
    const ux = p[b * 3] - p[a * 3], uy = p[b * 3 + 1] - p[a * 3 + 1], uz = p[b * 3 + 2] - p[a * 3 + 2];
    const vx = p[c * 3] - p[a * 3], vy = p[c * 3 + 1] - p[a * 3 + 1], vz = p[c * 3 + 2] - p[a * 3 + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * nx + ny * ny + nz * nz === 0) continue;
    out.push(a, b, c);
  }
  mesh.indices = new Uint32Array(out);
  return mesh;
}

// Serialize for postMessage (typed arrays -> share the buffers directly).
export function serializeMesh(mesh) {
  return {
    name: mesh.name,
    positions: mesh.positions,
    normals: mesh.normals,
    uvs: mesh.uvs,
    colors: mesh.colors,
    indices: mesh.indices,
    materialName: mesh.materialName,
  };
}

export function deserializeMesh(data) {
  return new Mesh(data);
}

export function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(2) + ' MB';
}
