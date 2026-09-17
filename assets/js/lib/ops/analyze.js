// Mesh analysis: manifold check, volume, surface area, overhangs,
// wall thickness (ray sampling approximation), printability report.
import { triangleCount, meshBounds } from '../mesh.js';
import { signedVolume } from './repair.js';

export function manifoldCheck(mesh) {
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  if (fc === 0) return { watertight: false, boundaryEdges: 0, nonManifoldEdges: 0, nonManifoldVertices: 0, open: true };
  // edge usage counts
  const edgeMap = new Map();
  const addEdge = (a, b) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const c = edgeMap.get(key) || 0;
    edgeMap.set(key, c + 1);
  };
  if (idx) {
    for (let t = 0; t < idx.length; t += 3) {
      addEdge(idx[t], idx[t + 1]);
      addEdge(idx[t + 1], idx[t + 2]);
      addEdge(idx[t + 2], idx[t]);
    }
  } else {
    for (let v = 0; v < mesh.positions.length / 3; v += 3) {
      addEdge(v, v + 1); addEdge(v + 1, v + 2); addEdge(v + 2, v);
    }
  }
  let boundaryEdges = 0, nonManifoldEdges = 0;
  for (const count of edgeMap.values()) {
    if (count === 1) boundaryEdges++;
    else if (count > 2) nonManifoldEdges++;
  }
  // non-manifold vertices: edges around a vertex form more than one fan
  // (detected only for indexed meshes; approximation via vertex-edge count)
  let nonManifoldVertices = 0;
  if (idx) {
    nonManifoldVertices = countNonManifoldVertices(mesh, edgeMap);
  }
  return {
    watertight: boundaryEdges === 0 && nonManifoldEdges === 0,
    boundaryEdges,
    nonManifoldEdges,
    nonManifoldVertices,
  };
}

function countNonManifoldVertices(mesh, edgeMap) {
  const idx = mesh.indices;
  if (!idx) return 0;
  const fc = idx.length / 3;
  const vc = mesh.positions.length / 3;
  // build vertex -> incident halfedges
  const head = new Int32Array(vc).fill(-1);
  const next = new Int32Array(fc * 6);
  const heA = new Int32Array(fc * 6);
  const heB = new Int32Array(fc * 6);
  let hn = 0;
  const addHE = (a, b, f) => {
    heA[hn] = a; heB[hn] = b; next[hn] = head[a]; head[a] = hn;
    hn++;
  };
  for (let t = 0; t < fc; t++) {
    for (let k = 0; k < 3; k++) {
      addHE(idx[t * 3 + k], idx[t * 3 + (k + 1) % 3], t);
    }
  }
  let count = 0;
  for (let v = 0; v < vc; v++) {
    // walk fans: start from any unvisited halfedge at v, follow opposite halfedge at neighbor
    const visited = new Set();
    let fans = 0;
    for (let he = head[v]; he !== -1; he = next[he]) {
      if (visited.has(he)) continue;
      fans++;
      let cur = he;
      let guard = 0;
      do {
        visited.add(cur);
        // find opposite halfedge (b->a) at vertex b
        const a = heA[cur], b = heB[cur];
        let opp = -1;
        for (let h2 = head[b]; h2 !== -1; h2 = next[h2]) {
          if (heB[h2] === a) { opp = h2; break; }
        }
        if (opp === -1) break; // boundary fan
        // continue from next halfedge at a around the fan
        cur = opp;
        guard++;
      } while (cur !== he && !visited.has(cur) && guard < 10000);
      if (fans > 1) break;
    }
    if (fans > 1) count++;
  }
  return count;
}

export function surfaceArea(mesh) {
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  let area = 0;
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    area += Math.hypot(cx, cy, cz) / 2;
  }
  return area;
}

export function volume(mesh) {
  return Math.abs(signedVolume(mesh));
}

// Overhang analysis relative to build direction (+Z up).
// Faces whose normal points below the overhang threshold angle are flagged.
export function overhangAnalysis(mesh, thresholdDeg = 45) {
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  // A face is an overhang when its normal is within `thresholdDeg` of straight down.
  const cosThreshold = Math.cos(thresholdDeg * Math.PI / 180);
  let overhangArea = 0, totalArea = 0, overhangFaces = 0;
  const flagged = new Uint8Array(fc); // for visualization
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    const len = Math.hypot(cx, cy, cz);
    if (len === 0) continue;
    const area = len / 2;
    totalArea += area;
    const nz = cz / len;
    if (nz < -cosThreshold) {
      overhangArea += area;
      overhangFaces++;
      flagged[t] = 1;
    }
  }
  return {
    overhangFaces,
    overhangArea,
    totalArea,
    overhangPercent: totalArea > 0 ? (overhangArea / totalArea) * 100 : 0,
    flagged,
  };
}

// Approximate wall thickness via inward ray casting at surface sample points.
// For each sample: cast a ray along the inward normal, find the closest
// intersection distance. That distance approximates local thickness.
// This is an approximation: concave geometry and holes can locally over/under-estimate.
export function wallThickness(mesh, samples = 600, onProgress) {
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  if (fc === 0) return { min: 0, max: 0, avg: 0, samples: [] };
  // collect triangles
  const tris = new Float32Array(fc * 9);
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    tris.set(p.subarray(ia, ia + 3), t * 9);
    tris.set(p.subarray(ib, ib + 3), t * 9 + 3);
    tris.set(p.subarray(ic, ic + 3), t * 9 + 6);
  }
  const b = meshBounds(mesh);
  const maxDim = Math.max(b.size[0], b.size[1], b.size[2]) || 1;
  const nudge = maxDim * 1e-4;
  const minHit = nudge * 3; // ignore re-hits of the source face
  const results = [];
  const actualSamples = Math.min(samples, fc * 3);
  const step = Math.max(1, Math.floor(fc / actualSamples));
  for (let t = 0; t < fc; t += step) {
    // face centroid + inward normal
    const o = t * 9;
    const cx = (tris[o] + tris[o + 3] + tris[o + 6]) / 3;
    const cy = (tris[o + 1] + tris[o + 4] + tris[o + 7]) / 3;
    const cz = (tris[o + 2] + tris[o + 5] + tris[o + 8]) / 3;
    let nx = (tris[o + 4] - tris[o + 1]) * (tris[o + 8] - tris[o + 2]) - (tris[o + 5] - tris[o + 2]) * (tris[o + 7] - tris[o + 1]);
    let ny = (tris[o + 5] - tris[o + 2]) * (tris[o + 6] - tris[o]) - (tris[o + 3] - tris[o]) * (tris[o + 8] - tris[o + 2]);
    let nz = (tris[o + 3] - tris[o]) * (tris[o + 7] - tris[o + 1]) - (tris[o + 4] - tris[o + 1]) * (tris[o + 6] - tris[o]);
    const nl = Math.hypot(nx, ny, nz);
    if (nl === 0) continue;
    nx /= -nl; ny /= -nl; nz /= -nl; // inward
    // nudge start inside
    const sx = cx - nx * nudge, sy = cy - ny * nudge, sz = cz - nz * nudge;
    let best = Infinity;
    for (let u = 0; u < fc; u++) {
      const q = u * 9;
      const dist = rayTriangle(sx, sy, sz, nx, ny, nz, tris, q, maxDim);
      if (dist !== null && dist > minHit && dist < best) best = dist;
    }
    if (best !== Infinity && best < maxDim * 2) {
      results.push({ x: cx, y: cy, z: cz, thickness: best });
    }
    if (onProgress && (t % 500) === 0) onProgress(t / fc);
  }
  if (results.length === 0) return { min: 0, max: 0, avg: 0, samples: [] };
  let min = Infinity, max = 0, sum = 0;
  for (const r of results) {
    if (r.thickness < min) min = r.thickness;
    if (r.thickness > max) max = r.thickness;
    sum += r.thickness;
  }
  return { min, max, avg: sum / results.length, samples: results };
}

// Möller–Trumbore. Returns distance t or null.
function rayTriangle(ox, oy, oz, dx, dy, dz, tris, q) {
  const ax = tris[q], ay = tris[q + 1], az = tris[q + 2];
  const bx = tris[q + 3], by = tris[q + 4], bz = tris[q + 5];
  const cx = tris[q + 6], cy = tris[q + 7], cz = tris[q + 8];
  const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
  const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
  const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x;
  const det = e1x * px + e1y * py + e1z * pz;
  if (det > -1e-10 && det < 1e-10) return null;
  const inv = 1 / det;
  const tx = ox - ax, ty = oy - ay, tz = oz - az;
  const u = (tx * px + ty * py + tz * pz) * inv;
  if (u < -1e-9 || u > 1 + 1e-9) return null;
  const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
  const v = (dx * qx + dy * qy + dz * qz) * inv;
  if (v < -1e-9 || u + v > 1 + 1e-9) return null;
  const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
  if (t <= 1e-9) return null;
  return t;
}

export function meshStatistics(mesh) {
  const b = meshBounds(mesh);
  return {
    vertices: mesh.positions.length / 3,
    triangles: triangleCount(mesh),
    bounds: b,
    volume: volume(mesh),
    surfaceArea: surfaceArea(mesh),
    indexed: !!mesh.indices,
    hasNormals: !!mesh.normals,
    hasUVs: !!mesh.uvs,
  };
}

// Composite printability report.
export function printabilityCheck(mesh, opts = {}) {
  const bed = opts.bed || { x: 220, y: 220, z: 250 }; // mm, Ender-3 class default
  const thresholdDeg = opts.overhangThreshold || 45;
  const issues = [];
  const warnings = [];
  const info = [];
  const manifold = manifoldCheck(mesh);
  if (!manifold.watertight) {
    issues.push(`Mesh is not watertight: ${manifold.boundaryEdges} boundary edge(s), ${manifold.nonManifoldEdges} non-manifold edge(s). Slicers may refuse or misbehave.`);
  } else {
    info.push('Mesh is watertight (manifold).');
  }
  if (manifold.nonManifoldVertices > 0) {
    warnings.push(`${manifold.nonManifoldVertices} non-manifold vertex/vertices detected.`);
  }
  // degenerate faces
  let degenerate = 0;
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    if (cx * cx + cy * cy + cz * cz < 1e-24) degenerate++;
  }
  if (degenerate > 0) warnings.push(`${degenerate} degenerate (zero-area) triangle(s).`);
  // size
  const b = meshBounds(mesh);
  if (b.size[0] > bed.x || b.size[1] > bed.y || b.size[2] > bed.z) {
    issues.push(`Model (${b.size.map(v => v.toFixed(1)).join(' × ')} mm) exceeds default printer volume (${bed.x} × ${bed.y} × ${bed.z} mm).`);
  } else {
    info.push(`Model fits the default printer volume (${b.size.map(v => v.toFixed(1)).join(' × ')} mm).`);
  }
  if (b.size[0] < 0.1 || b.size[1] < 0.1 || b.size[2] < 0.1) {
    warnings.push('Model is extremely small (< 0.1 mm). Are the units correct?');
  }
  // overhangs
  const oh = overhangAnalysis(mesh, thresholdDeg);
  if (oh.overhangPercent > 0) {
    warnings.push(`${oh.overhangPercent.toFixed(1)}% of surface area is unsupported overhang (> ${thresholdDeg}° from vertical). Consider supports or reorientation.`);
  } else {
    info.push(`No significant overhangs beyond ${thresholdDeg}°.`);
  }
  // ground contact
  if (b.min[2] > 0.05 * Math.max(b.size[0], b.size[1], b.size[2]) && b.size[2] > 1) {
    warnings.push('Model floats above the build plate — nothing touches z = 0. Use Center + Align to Ground.');
  }
  return { issues, warnings, info, manifold, overhang: oh, stats: meshStatistics(mesh) };
}
