// Constructive geometry tools: hollow shell, base plate, plane cut (capped),
// split by plane. All approximate but real mesh operations with known limits.
import { Mesh, mergeMeshes, meshBounds, flipWinding, computeVertexNormals, triangleCount, translateMesh, cloneMesh } from '../mesh.js';
import { sliceMesh, earcut } from './slice.js';
import { weldVertices } from './repair.js';

// Create a hollow shell: duplicate the surface, offset inward along vertex
// normals by `thickness`, flip winding, and merge with the original.
// Limitations (disclosed in UI): self-intersections can occur on concave
// regions thinner than 2×thickness; the result may need repair afterwards.
export function hollowMesh(mesh, thickness, onProgress) {
  const p = mesh.positions;
  const n = mesh.normals || computeVertexNormals(cloneMesh(mesh)).normals;
  const vc = p.length / 3;
  const inner = new Float32Array(vc * 3);
  for (let v = 0; v < vc; v++) {
    inner[v * 3] = p[v * 3] - n[v * 3] * thickness;
    inner[v * 3 + 1] = p[v * 3 + 1] - n[v * 3 + 1] * thickness;
    inner[v * 3 + 2] = p[v * 3 + 2] - n[v * 3 + 2] * thickness;
    if (onProgress && (v & 8191) === 0) onProgress(v / vc);
  }
  const innerMesh = new Mesh({ name: mesh.name + '_inner', positions: inner, indices: mesh.indices ? mesh.indices.slice() : null, normals: null, uvs: null, materialName: mesh.materialName });
  // outer keeps its own copy of indices so the two shells are independent objects
  const outer = new Mesh({ name: mesh.name + '_outer', positions: p.slice(), indices: mesh.indices ? mesh.indices.slice() : null, normals: mesh.normals ? mesh.normals.slice() : null, uvs: mesh.uvs ? mesh.uvs.slice() : null, materialName: mesh.materialName });
  if (mesh.indices) {
    flipWinding(innerMesh);
  } else {
    // non-indexed: rebuild inner with reversed winding (swap 2nd/3rd vertex of each tri)
    const np = new Float32Array(inner.length);
    for (let t = 0; t < inner.length / 9; t++) {
      np.set(inner.subarray(t * 9, t * 9 + 3), t * 9);
      np.set(inner.subarray(t * 9 + 6, t * 9 + 9), t * 9 + 3);
      np.set(inner.subarray(t * 9 + 3, t * 9 + 6), t * 9 + 6);
    }
    innerMesh.positions = np;
  }
  return mergeMeshes([outer, innerMesh]);
}

// Rectangular base plate under the model footprint.
export function addBase(mesh, opts = {}) {
  const thickness = opts.thickness || 2;   // mm
  const margin = opts.margin || 2;          // mm
  const b = meshBounds(mesh);
  const x0 = b.min[0] - margin, y0 = b.min[1] - margin;
  const x1 = b.max[0] + margin, y1 = b.max[1] + margin;
  const z0 = b.min[2] - thickness, z1 = b.min[2];
  // 8 corners, CCW from bottom
  const positions = new Float32Array([
    x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0,
    x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1,
  ]);
  const quads = [
    [4, 5, 6, 7],   // top (+z)
    [1, 0, 3, 2],   // bottom
    [0, 4, 7, 3],   // -y... corrected below
    [1, 2, 6, 5],
    [3, 7, 6, 2],
    [0, 1, 5, 4],
  ];
  const indices = [];
  for (const [a, bb, c, d] of quads) indices.push(a, bb, c, a, c, d);
  const base = new Mesh({
    name: mesh.name + '_base',
    positions,
    indices: new Uint32Array(indices),
  });
  computeVertexNormals(base);
  return mergeMeshes([cloneMesh(mesh), base]);
}

// Cut the mesh with an axis-aligned plane, keeping one side.
// side: 'above' or 'below' (relative to axis value). Caps the cut with a
// planar triangulation of the cross-section polygon.
export function cutMesh(mesh, plane, side = 'above', cap = true, onProgress) {
  const ai = plane.axis === 'x' ? 0 : plane.axis === 'y' ? 1 : 2;
  const value = plane.value;
  const keepSign = side === 'above' ? 1 : -1; // keep d*keepSign >= 0
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);

  const vMap = new Map(); // quantized position -> vertex id
  const outPositions = [];
  const outIndices = [];
  function vid(x, y, z) {
    const key = `${x.toFixed(6)},${y.toFixed(6)},${z.toFixed(6)}`;
    let id = vMap.get(key);
    if (id === undefined) {
      id = outPositions.length / 3;
      outPositions.push(x, y, z);
      vMap.set(key, id);
    }
    return id;
  }

  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const tri = [[p[ia], p[ia + 1], p[ia + 2]], [p[ib], p[ib + 1], p[ib + 2]], [p[ic], p[ic + 1], p[ic + 2]]];
    const d = tri.map(v => (v[ai] - value) * keepSign);
    if (d[0] >= 0 && d[1] >= 0 && d[2] >= 0) {
      // fully kept
      const ids = tri.map(v => vid(v[0], v[1], v[2]));
      outIndices.push(ids[0], ids[1], ids[2]);
    } else if (d[0] < 0 && d[1] < 0 && d[2] < 0) {
      // fully dropped
    } else {
      // clipped: Sutherland-Hodgman against half-space d >= 0
      const poly = clipTriangleToHalfSpace(tri, ai, value, keepSign);
      if (poly.length < 3) continue;
      const ids = poly.map(v => vid(v[0], v[1], v[2]));
      for (let k = 1; k < ids.length - 1; k++) outIndices.push(ids[0], ids[k], ids[k + 1]);
    }
    if (onProgress && (t & 8191) === 0) onProgress(t / fc);
  }

  const out = new Mesh({ name: mesh.name, positions: new Float32Array(outPositions), indices: new Uint32Array(outIndices), materialName: mesh.materialName });

  if (cap) {
    // cross-section contour of the ORIGINAL mesh at the plane (the clipped
    // mesh has no edges crossing the plane — its contour lies on it)
    const polylines = sliceMesh(mesh, { axis: plane.axis, value });
    const closed = polylines.filter(pl => pl.length > 3);
    const capMeshes = [];
    for (const pl of closed) {
      // drop duplicated last point if same as first
      const pts = pl.slice();
      if (pts.length > 1) {
        const a = pts[0], b2 = pts[pts.length - 1];
        if (Math.abs(a[0] - b2[0]) < 1e-7 && Math.abs(a[1] - b2[1]) < 1e-7 && Math.abs(a[2] - b2[2]) < 1e-7) pts.pop();
      }
      if (pts.length < 3) continue;
      // project to 2D in the plane
      const [u, v] = plane.axis === 'x' ? [1, 2] : plane.axis === 'y' ? [0, 2] : [0, 1];
      const pts2 = pts.map(pt => [pt[u], pt[v]]);
      const tris = earcut(pts2);
      for (const [a, b2, c] of tris) {
        // winding: cap normal must point along the removed side
        const A = pts[a], B = pts[b2], C = pts[c];
        const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
        const vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const dir = ai === 0 ? nx : ai === 1 ? ny : nz;
        // the cap must face away from the kept material (toward -keepSign side)
        if (dir * keepSign < 0) outIndices.push(vid(A[0], A[1], A[2]), vid(B[0], B[1], B[2]), vid(C[0], C[1], C[2]));
        else outIndices.push(vid(A[0], A[1], A[2]), vid(C[0], C[1], C[2]), vid(B[0], B[1], B[2]));
      }
    }
    out.indices = new Uint32Array(outIndices);
    // weld cap boundary vertices to the cut surface boundary (their coordinates
    // agree analytically but may differ by float rounding)
    const b2 = meshBounds(out);
    const maxDim = Math.max(b2.size[0], b2.size[1], b2.size[2]) || 1;
    return weldVertices(out, maxDim * 1e-6);
  }
  computeVertexNormals(out);
  return out;
}

function clipTriangleToHalfSpace(tri, ai, value, keepSign) {
  let poly = tri.slice();
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i], nxt = poly[(i + 1) % poly.length];
    const dc = (cur[ai] - value) * keepSign;
    const dn = (nxt[ai] - value) * keepSign;
    if (dc >= 0) out.push(cur);
    if ((dc >= 0 && dn < 0) || (dc < 0 && dn >= 0)) {
      const f = dc / (dc - dn);
      out.push([
        cur[0] + (nxt[0] - cur[0]) * f,
        cur[1] + (nxt[1] - cur[1]) * f,
        cur[2] + (nxt[2] - cur[2]) * f,
      ]);
    }
  }
  return out;
}

// Split mesh by plane into two meshes (above and below).
export function splitByPlane(mesh, plane, onProgress) {
  const above = cutMesh(mesh, plane, 'above', true, onProgress ? p => onProgress(p * 0.5) : null);
  const below = cutMesh(mesh, plane, 'below', true, onProgress ? p => onProgress(0.5 + p * 0.5) : null);
  above.name = mesh.name + '_top';
  below.name = mesh.name + '_bottom';
  return [above, below];
}
