// Mesh repair: tolerance-based vertex weld, duplicate face removal,
// consistent winding (orientation propagation), degenerate removal.
import { Mesh, faceNormal, triangleCount, flipWinding, removeDegenerate, weldExact, computeVertexNormals } from '../mesh.js';

// Weld vertices within a tolerance using a spatial hash grid.
// Returns a new indexed mesh. Tolerance is in model units (0 = exact weld).
export function weldVertices(mesh, tolerance = 0.0001, onProgress) {
  if (tolerance <= 0) return weldExact(mesh);
  const p = mesh.positions;
  const vc = p.length / 3;
  const inv = 1 / tolerance;
  const grid = new Map();
  const remap = new Int32Array(vc).fill(-1);
  const newPositions = [];
  for (let v = 0; v < vc; v++) {
    const x = p[v * 3], y = p[v * 3 + 1], z = p[v * 3 + 2];
    const gx = Math.floor(x * inv), gy = Math.floor(y * inv), gz = Math.floor(z * inv);
    let found = -1;
    // check 27 neighboring cells for an existing representative
    outer:
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const cell = grid.get(`${gx + dx},${gy + dy},${gz + dz}`);
          if (!cell) continue;
          for (const cand of cell) {
            const cx = newPositions[cand * 3], cy = newPositions[cand * 3 + 1], cz = newPositions[cand * 3 + 2];
            if (Math.abs(cx - x) <= tolerance && Math.abs(cy - y) <= tolerance && Math.abs(cz - z) <= tolerance) {
              found = cand;
              break outer;
            }
          }
        }
      }
    }
    if (found === -1) {
      found = newPositions.length / 3;
      newPositions.push(x, y, z);
      const key = `${gx},${gy},${gz}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(found);
    }
    remap[v] = found;
    if (onProgress && (v & 4095) === 0) onProgress(v / vc);
  }
  const positions = new Float32Array(newPositions);
  // weld normals/uvs by first-use
  let normals = null, uvs = null;
  if (mesh.normals) {
    normals = new Float32Array(positions.length);
    const cnt = new Float32Array(positions.length / 3);
    for (let v = 0; v < vc; v++) {
      const r = remap[v];
      if (cnt[r] === 0) {
        normals.set(mesh.normals.subarray(v * 3, v * 3 + 3), r * 3);
      }
      cnt[r]++;
    }
  }
  if (mesh.uvs) {
    uvs = new Float32Array((positions.length / 3) * 2);
    const seen = new Uint8Array(positions.length / 3);
    for (let v = 0; v < vc; v++) {
      const r = remap[v];
      if (!seen[r]) { uvs.set(mesh.uvs.subarray(v * 2, v * 2 + 2), r * 2); seen[r] = 1; }
    }
  }
  const fc = mesh.indices ? mesh.indices.length / 3 : vc / 3;
  const indicesArr = [];
  for (let t = 0; t < fc; t++) {
    let a, b, c;
    if (mesh.indices) {
      a = remap[mesh.indices[t * 3]]; b = remap[mesh.indices[t * 3 + 1]]; c = remap[mesh.indices[t * 3 + 2]];
    } else {
      a = remap[t * 3]; b = remap[t * 3 + 1]; c = remap[t * 3 + 2];
    }
    if (a === b || b === c || a === c) continue;
    indicesArr.push(a, b, c);
  }
  const out = new Mesh({ name: mesh.name, positions, normals, uvs, indices: new Uint32Array(indicesArr), materialName: mesh.materialName });
  return removeDuplicateFaces(removeDegenerate(out));
}

// Remove triangles with identical vertex sets (either winding).
export function removeDuplicateFaces(mesh) {
  const idx = mesh.indices;
  if (!idx) return mesh;
  const seen = new Set();
  const out = [];
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    const key = [a, b, c].sort((x, y) => x - y).join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a, b, c);
  }
  if (out.length === idx.length) return mesh;
  mesh.indices = new Uint32Array(out);
  return mesh;
}

// Make triangle winding globally consistent (mesh-wide, per component) and,
// when the component is closed, turn it inside-out if its volume is negative.
export function fixOrientation(mesh, onProgress) {
  const idx = mesh.indices;
  if (!idx) return mesh;
  const fc = idx.length / 3;
  // edge -> list of (face, slot) where slot is the directed edge start
  const edgeMap = new Map();
  for (let t = 0; t < fc; t++) {
    for (let k = 0; k < 3; k++) {
      const a = idx[t * 3 + k], b = idx[t * 3 + (k + 1) % 3];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (!edgeMap.has(key)) edgeMap.set(key, []);
      edgeMap.get(key).push(t);
    }
  }
  const visited = new Uint8Array(fc);
  const flipped = new Uint8Array(fc);
  const stack = [];
  for (let seed = 0; seed < fc; seed++) {
    if (visited[seed]) continue;
    stack.length = 0; stack.push(seed); visited[seed] = 1;
    while (stack.length) {
      const t = stack.pop();
      const a = [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]];
      for (let k = 0; k < 3; k++) {
        const v0 = a[k], v1 = a[(k + 1) % 3];
        const key = v0 < v1 ? `${v0}_${v1}` : `${v1}_${v0}`;
        for (const nb of edgeMap.get(key) || []) {
          if (nb === t) continue;
          if (visited[nb]) continue;
          // neighbor is consistently oriented if its directed edge is opposite
          const b = [idx[nb * 3], idx[nb * 3 + 1], idx[nb * 3 + 2]];
          let consistent = false;
          for (let j = 0; j < 3; j++) {
            if (b[j] === v0 && b[(j + 1) % 3] === v1) consistent = false; // same direction -> flip
            if (b[j] === v1 && b[(j + 1) % 3] === v0) consistent = true;
          }
          if (!consistent) {
            const tmp = idx[nb * 3 + 1]; idx[nb * 3 + 1] = idx[nb * 3 + 2]; idx[nb * 3 + 2] = tmp;
          }
          visited[nb] = 1;
          stack.push(nb);
        }
      }
      if (onProgress && (t & 8191) === 0) onProgress(t / fc);
    }
  }
  // if closed and inside-out (negative volume), flip everything
  let boundaryEdges = 0;
  for (const [, faces] of edgeMap) if (faces.length === 1) boundaryEdges++;
  if (boundaryEdges === 0) {
    const vol = signedVolume(mesh);
    if (vol < 0) flipWinding(mesh);
  }
  return mesh;
}

// Signed volume via divergence theorem (sum of tetrahedra to origin).
export function signedVolume(mesh) {
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  let vol = 0;
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const ax = p[ia], ay = p[ia + 1], az = p[ia + 2];
    const bx = p[ib], by = p[ib + 1], bz = p[ib + 2];
    const cx = p[ic], cy = p[ic + 1], cz = p[ic + 2];
    vol += (ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx));
  }
  return vol / 6;
}

// Full repair pipeline.
export function repairMesh(mesh, tolerance = 0.0001, onProgress) {
  let m = weldVertices(mesh, tolerance, p => onProgress && onProgress(p * 0.4));
  m = removeDuplicateFaces(removeDegenerate(m));
  fixOrientation(m, p => onProgress && onProgress(0.4 + p * 0.4));
  computeVertexNormals(m);
  onProgress && onProgress(1);
  return m;
}
