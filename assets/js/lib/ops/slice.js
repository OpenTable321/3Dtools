// Plane cross-sections and polygon triangulation (ear clipping).
// Slice plane is axis-aligned: { axis: 'x'|'y'|'z', value: number }.

// Returns array of polylines; each polyline is an array of [x,y,z].
export function sliceMesh(mesh, plane, onProgress) {
  const { axis, value } = plane;
  const ai = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = mesh.indices ? idx.length / 3 : p.length / 9;
  const segments = [];
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const v = [
      [p[ia], p[ia + 1], p[ia + 2]],
      [p[ib], p[ib + 1], p[ib + 2]],
      [p[ic], p[ic + 1], p[ic + 2]],
    ];
    const d = [v[0][ai] - value, v[1][ai] - value, v[2][ai] - value];
    // find the two edges crossing the plane
    const crossings = [];
    for (let e = 0; e < 3; e++) {
      const a = e, b = (e + 1) % 3;
      if ((d[a] > 0 && d[b] <= 0) || (d[a] <= 0 && d[b] > 0)) {
        const f = d[a] / (d[a] - d[b]);
        crossings.push([
          v[a][0] + (v[b][0] - v[a][0]) * f,
          v[a][1] + (v[b][1] - v[a][1]) * f,
          v[a][2] + (v[b][2] - v[a][2]) * f,
        ]);
      }
    }
    if (crossings.length === 2) segments.push([crossings[0], crossings[1]]);
    if (onProgress && (t & 16383) === 0) onProgress(t / fc);
  }
  // chain segments into polylines
  return chainSegments(segments);
}

function chainSegments(segments) {
  let scale = 0;
  for (const s of segments) for (const pt of s) scale = Math.max(scale, Math.abs(pt[0]), Math.abs(pt[1]), Math.abs(pt[2]));
  const eps = Math.max(1e-12, scale * 1e-6);
  const key = pt => `${Math.round(pt[0] / eps)},${Math.round(pt[1] / eps)},${Math.round(pt[2] / eps)}`;
  const starts = new Map();
  const used = new Uint8Array(segments.length);
  segments.forEach((s, i) => {
    const k = key(s[0]);
    if (!starts.has(k)) starts.set(k, []);
    starts.get(k).push(i);
  });
  const polylines = [];
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const line = [segments[i][0], segments[i][1]];
    // extend forward
    for (;;) {
      const k = key(line[line.length - 1]);
      const cands = starts.get(k) || [];
      let found = -1;
      for (const c of cands) if (!used[c]) { found = c; break; }
      if (found === -1) break;
      used[found] = 1;
      const s = segments[found];
      line.push(s[0][0] === line[line.length - 1][0] && s[0][1] === line[line.length - 1][1] && s[0][2] === line[line.length - 1][2] ? s[1] : s[1]);
    }
    polylines.push(line);
  }
  return polylines;
}

// Ear-clipping triangulation of a simple polygon (2D points as [x,y] pairs).
// Returns triangles as index triples into the input array.
export function earcut(points) {
  const n = points.length;
  if (n < 3) return [];
  const indices = points.map((_, i) => i);
  // drop collinear duplicates
  const area = polygonArea(points);
  if (Math.abs(area) < 1e-18) return [];
  const ccw = area > 0;
  const triangles = [];
  let guard = 0;
  while (indices.length > 3 && guard++ < n * n) {
    let earFound = false;
    for (let i = 0; i < indices.length; i++) {
      const a = indices[(i + indices.length - 1) % indices.length];
      const b = indices[i];
      const c = indices[(i + 1) % indices.length];
      const cross = cross2(points[a], points[b], points[c]);
      if (ccw ? cross <= 1e-14 : cross >= -1e-14) continue; // reflex vertex
      // check no other point inside triangle abc
      let contains = false;
      for (const j of indices) {
        if (j === a || j === b || j === c) continue;
        if (pointInTriangle(points[j], points[a], points[b], points[c])) { contains = true; break; }
      }
      if (contains) continue;
      triangles.push([a, b, c]);
      indices.splice(i, 1);
      earFound = true;
      break;
    }
    if (!earFound) break; // degenerate polygon; bail with what we have
  }
  if (indices.length === 3) triangles.push([indices[0], indices[1], indices[2]]);
  return triangles;
}

function polygonArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
  }
  return a / 2;
}

function cross2(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function pointInTriangle(p, a, b, c) {
  const d1 = cross2(a, b, p), d2 = cross2(b, c, p), d3 = cross2(c, a, p);
  const hasNeg = d1 < -1e-14 || d2 < -1e-14 || d3 < -1e-14;
  const hasPos = d1 > 1e-14 || d2 > 1e-14 || d3 > 1e-14;
  return !(hasNeg && hasPos);
}
