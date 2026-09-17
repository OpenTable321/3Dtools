// Quadric edge-collapse decimation (Garland & Heckbert).
// Runs in a worker for large meshes. Preserves borders (collapses along them).
import { Mesh, triangleCount } from '../mesh.js';

class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

export function decimate(mesh, targetRatio, onProgress) {
  // targetRatio: fraction of original triangles to keep (0 < r <= 1)
  const idx = mesh.indices;
  if (!idx) throw new Error('Decimation requires an indexed mesh.');
  const p = mesh.positions;
  const vc = p.length / 3;
  let fc = idx.length / 3;
  const targetFaces = Math.max(4, Math.floor(fc * Math.max(0.01, Math.min(1, targetRatio))));

  // positions as arrays for mutation
  const pos = Float64Array.from(p);

  // vertex quadrics: 4x4 symmetric, stored as 10 floats
  const Q = new Float64Array(vc * 10);
  const faces = [];
  for (let t = 0; t < fc; t++) faces.push([idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]]);

  function planeOf(a, b, c) {
    const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
    const bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2];
    const cx = pos[c * 3], cy = pos[c * 3 + 1], cz = pos[c * 3 + 2];
    let nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
    let ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
    let nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    const l = Math.hypot(nx, ny, nz);
    if (l === 0) return null;
    nx /= l; ny /= l; nz /= l;
    const d = -(nx * ax + ny * ay + nz * az);
    return [nx, ny, nz, d];
  }

  function accumulate(v, plane) {
    const [a, b, c, d] = plane;
    const o = v * 10;
    Q[o] += a * a; Q[o + 1] += a * b; Q[o + 2] += a * c; Q[o + 3] += a * d;
    Q[o + 4] += b * b; Q[o + 5] += b * c; Q[o + 6] += b * d;
    Q[o + 7] += c * c; Q[o + 8] += c * d;
    Q[o + 9] += d * d;
  }

  // build quadrics and vertex-face adjacency
  const vFaces = new Map(); // vertex -> Set(face index)
  for (let t = 0; t < fc; t++) {
    const f = faces[t];
    const plane = planeOf(f[0], f[1], f[2]);
    if (plane) {
      for (const v of f) accumulate(v, plane);
    }
    for (const v of f) {
      if (!vFaces.has(v)) vFaces.set(v, new Set());
      vFaces.get(v).add(t);
    }
  }

  // boundary edges (edges used by exactly one face)
  const edgeCount = new Map();
  for (let t = 0; t < fc; t++) {
    const f = faces[t];
    for (let k = 0; k < 3; k++) {
      const a = Math.min(f[k], f[(k + 1) % 3]), b = Math.max(f[k], f[(k + 1) % 3]);
      const key = a * 4294967296 + b; // safe for < 65536 verts; use string fallback otherwise
      const k2 = vc > 65535 ? `${a}_${b}` : key;
      edgeCount.set(k2, (edgeCount.get(k2) || 0) + 1);
    }
  }
  const boundaryVertex = new Uint8Array(vc);
  for (let t = 0; t < fc; t++) {
    const f = faces[t];
    for (let k = 0; k < 3; k++) {
      const a = Math.min(f[k], f[(k + 1) % 3]), b = Math.max(f[k], f[(k + 1) % 3]);
      const k2 = vc > 65535 ? `${a}_${b}` : a * 4294967296 + b;
      if (edgeCount.get(k2) === 1) { boundaryVertex[f[k]] = 1; boundaryVertex[f[(k + 1) % 3]] = 1; }
    }
  }

  const deadFace = new Uint8Array(fc);
  const deadVertex = new Uint8Array(vc);
  const version = new Uint32Array(vc);
  const aliveFaces = () => { let n = 0; for (let t = 0; t < fc; t++) if (!deadFace[t]) n++; return n; };

  // edge heap
  const heap = new MinHeap();
  const edgeSeen = new Set();
  function edgeError(v1, v2) {
    // optimal position from combined quadric
    const q = new Float64Array(10);
    for (let i = 0; i < 10; i++) q[i] = Q[v1 * 10 + i] + Q[v2 * 10 + i];
    // solve normal equations for [x,y,z] with A = [[q0,q1,q2],[q1,q4,q5],[q2,q5,q7]], b = -[q3,q6,q8]
    const A = [[q[0], q[1], q[2]], [q[1], q[4], q[5]], [q[2], q[5], q[7]]];
    const b = [-q[3], -q[6], -q[8]];
    const sol = solve3(A, b);
    let x, y, z;
    if (sol) {
      [x, y, z] = sol;
    } else {
      x = (pos[v1 * 3] + pos[v2 * 3]) / 2;
      y = (pos[v1 * 3 + 1] + pos[v2 * 3 + 1]) / 2;
      z = (pos[v1 * 3 + 2] + pos[v2 * 3 + 2]) / 2;
    }
    if (boundaryVertex[v1] && boundaryVertex[v2]) {
      // both on border: keep the edge (don't move border geometry)
      return null;
    }
    if (boundaryVertex[v1] || boundaryVertex[v2]) {
      // one on border: snap to the border vertex
      const bv = boundaryVertex[v1] ? v1 : v2;
      x = pos[bv * 3]; y = pos[bv * 3 + 1]; z = pos[bv * 3 + 2];
    }
    // clamp movement to avoid crazy jumps
    const dx = x - pos[v1 * 3], dy = y - pos[v1 * 3 + 1], dz = z - pos[v1 * 3 + 2];
    const maxMove = Math.hypot(dx, dy, dz);
    const e1 = Math.hypot(pos[v2 * 3] - pos[v1 * 3], pos[v2 * 3 + 1] - pos[v1 * 3 + 1], pos[v2 * 3 + 2] - pos[v1 * 3 + 2]);
    if (maxMove > 4 * (e1 + 1e-9)) return null;
    const err = quadricError(q, x, y, z);
    return { err, x, y, z };
  }

  function quadricError(q, x, y, z) {
    const v = [x, y, z, 1];
    // q as 4x4 symmetric
    const M = [
      [q[0], q[1], q[2], q[3]],
      [q[1], q[4], q[5], q[6]],
      [q[2], q[5], q[7], q[8]],
      [q[3], q[6], q[8], q[9]],
    ];
    let e = 0;
    for (let i = 0; i < 4; i++) {
      let s = 0;
      for (let j = 0; j < 4; j++) s += M[i][j] * v[j];
      e += s * v[i];
    }
    return e;
  }

  function pushEdge(v1, v2) {
    const a = Math.min(v1, v2), b = Math.max(v1, v2);
    const key = `${a}_${b}`;
    if (edgeSeen.has(key)) return;
    edgeSeen.add(key);
    const r = edgeError(a, b);
    if (r) heap.push([r.err, a, b, r.x, r.y, r.z, version[a], version[b]]);
  }

  for (let t = 0; t < fc; t++) {
    const f = faces[t];
    pushEdge(f[0], f[1]);
    pushEdge(f[1], f[2]);
    pushEdge(f[2], f[0]);
  }

  let faceBudget = aliveFaces();
  let collapses = 0;
  const totalWork = faceBudget - targetFaces;

  while (faceBudget > targetFaces && heap.size > 0) {
    const [err, v1, v2, x, y, z, ver1, ver2] = heap.pop();
    if (deadVertex[v1] || deadVertex[v2]) continue;
    // lazy re-evaluation: if either vertex moved since this entry was created,
    // recompute the error/position and re-insert instead of collapsing blindly
    if (ver1 !== version[v1] || ver2 !== version[v2]) {
      const key = `${Math.min(v1, v2)}_${Math.max(v1, v2)}`;
      edgeSeen.delete(key);
      pushEdge(v1, v2);
      continue;
    }
    // link condition (approximate): shared neighbors must be exactly 2 (or fewer for borders)
    const n1 = vFaces.get(v1), n2 = vFaces.get(v2);
    if (!n1 || !n2) continue;
    let shared = 0;
    // count faces adjacent to both (each shared face contributes 2 shared neighbor pairs)
    for (const t of n1) {
      if (!deadFace[t] && n2.has(t)) shared++;
    }
    if (shared > 2) continue;

    // perform collapse v2 -> v1 at (x, y, z)
    pos[v1 * 3] = x; pos[v1 * 3 + 1] = y; pos[v1 * 3 + 2] = z;
    for (let i = 0; i < 10; i++) Q[v1 * 10 + i] += Q[v2 * 10 + i];
    deadVertex[v2] = 1;
    version[v1]++;
    const toProcess = new Set();
    for (const t of [...n1, ...n2]) {
      if (deadFace[t]) continue;
      const f = faces[t];
      if (f.includes(v2)) {
        // replace v2 with v1; drop degenerate faces
        const nf = f.map(v => v === v2 ? v1 : v);
        if (nf[0] === nf[1] || nf[1] === nf[2] || nf[0] === nf[2]) {
          deadFace[t] = 1;
          faceBudget--;
        } else {
          faces[t] = nf;
          vFaces.get(v1).add(t);
        }
      }
      for (const v of faces[t]) toProcess.add(v);
    }
    for (const t of [...n2]) vFaces.get(v2).delete(t);
    // merge adjacency into v1
    for (const t of [...n2]) {
      if (!deadFace[t] && !vFaces.get(v1).has(t)) vFaces.get(v1).add(t);
    }
    // recompute edges around v1
    for (const v of toProcess) {
      if (v === v1 || deadVertex[v]) continue;
      const key1 = `${Math.min(v, v1)}_${Math.max(v, v1)}`;
      edgeSeen.delete(key1);
      pushEdge(v, v1);
    }
    collapses++;
    if (onProgress && (collapses & 255) === 0) {
      onProgress(Math.min(1, (totalWork - (faceBudget - targetFaces)) / Math.max(1, totalWork)));
    }
  }

  // rebuild mesh
  const remap = new Int32Array(vc).fill(-1);
  let nv = 0;
  for (let v = 0; v < vc; v++) if (!deadVertex[v]) remap[v] = nv++;
  const positions = new Float32Array(nv * 3);
  for (let v = 0; v < vc; v++) {
    if (remap[v] < 0) continue;
    positions[remap[v] * 3] = pos[v * 3];
    positions[remap[v] * 3 + 1] = pos[v * 3 + 1];
    positions[remap[v] * 3 + 2] = pos[v * 3 + 2];
  }
  const indicesArr = [];
  for (let t = 0; t < fc; t++) {
    if (deadFace[t]) continue;
    const f = faces[t];
    indicesArr.push(remap[f[0]], remap[f[1]], remap[f[2]]);
  }
  onProgress && onProgress(1);
  return new Mesh({
    name: mesh.name,
    positions,
    indices: new Uint32Array(indicesArr),
    materialName: mesh.materialName,
  });
}

function solve3(A, b) {
  // Gaussian elimination with partial pivoting; returns null if singular
  const M = [A[0].slice(), A[1].slice(), A[2].slice()];
  const v = b.slice();
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    [v[col], v[piv]] = [v[piv], v[col]];
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c < 3; c++) M[r][c] -= f * M[col][c];
      v[r] -= f * v[col];
    }
  }
  return [v[0] / M[0][0], v[1] / M[1][1], v[2] / M[2][2]];
}
