// Mesh operations test suite. Run: node tests/test-ops.mjs
import { Mesh, computeVertexNormals, weldExact, flipWinding, splitComponents, mergeMeshes, triangleCount, meshBounds, alignToGround, mirrorMesh } from '../assets/js/lib/mesh.js';
import { parseSTL, exportSTLBinary } from '../assets/js/lib/io/stl.js';
import { repairMesh, weldVertices, fixOrientation, removeDuplicateFaces, signedVolume } from '../assets/js/lib/ops/repair.js';
import { manifoldCheck, volume, surfaceArea, overhangAnalysis, wallThickness, meshStatistics, printabilityCheck } from '../assets/js/lib/ops/analyze.js';
import { decimate } from '../assets/js/lib/ops/decimate.js';
import { hollowMesh, addBase, cutMesh, splitByPlane } from '../assets/js/lib/ops/geometry.js';
import { sliceMesh, earcut } from '../assets/js/lib/ops/slice.js';

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; console.log('ok:', msg); }
  else { failed++; console.error('FAIL:', msg); }
}
function approx(a, b, eps = 1e-4) { return Math.abs(a - b) < eps; }

function cubeMesh(size = 2, offset = [0, 0, 0]) {
  const s = size / 2;
  const [ox, oy, oz] = offset;
  const positions = new Float32Array([
    ox - s, oy - s, oz - s, ox + s, oy - s, oz - s, ox + s, oy + s, oz - s, ox - s, oy + s, oz - s,
    ox - s, oy - s, oz + s, ox + s, oy - s, oz + s, ox + s, oy + s, oz + s, ox - s, oy + s, oz + s,
  ]);
  const quads = [
    [0, 3, 2, 1], [4, 5, 6, 7],
    [0, 1, 5, 4], [2, 3, 7, 6],
    [0, 4, 7, 3], [1, 2, 6, 5],
  ];
  const indices = [];
  for (const [a, b, c, d] of quads) indices.push(a, b, c, a, c, d);
  const m = new Mesh({ name: 'cube', positions, indices: new Uint32Array(indices) });
  computeVertexNormals(m);
  return m;
}

// ---- welding & manifold ----
const stlBuf = exportSTLBinary(cubeMesh(2));
const stlCube = parseSTL(stlBuf, 'cube');
assert(!stlCube.indices && stlCube.positions.length / 3 === 36, 'STL cube is non-indexed with 36 verts');
const welded = weldExact(stlCube);
assert(welded.positions.length / 3 === 8, `weldExact reduces to 8 verts (got ${welded.positions.length / 3})`);
let mc = manifoldCheck(welded);
assert(mc.watertight, 'welded cube is watertight');

// tolerance weld via STL soup
const tolWelded = weldVertices(stlCube, 0.001);
assert(tolWelded.positions.length / 3 === 8, 'tolerance weld also gives 8 verts');
assert(manifoldCheck(tolWelded).watertight, 'tolerance-welded cube is watertight');

// ---- volume / area ----
assert(approx(volume(welded), 8), `cube volume is 8 (got ${volume(welded)})`);
assert(approx(surfaceArea(welded), 24), `cube surface area is 24 (got ${surfaceArea(welded)})`);

// inside-out cube: flip winding -> negative volume -> fixOrientation restores
const flipped = weldExact(parseSTL(exportSTLBinary(cubeMesh(2)), 'f'));
flipWinding(flipped);
assert(signedVolume(flipped) < 0, 'flipped cube has negative signed volume');
fixOrientation(flipped);
assert(signedVolume(flipped) > 0, 'fixOrientation restores positive volume');

// ---- repair pipeline on a corrupted mesh ----
// duplicate faces + degenerate faces
const corrupt = weldExact(parseSTL(exportSTLBinary(cubeMesh(2)), 'c'));
const idxArr = Array.from(corrupt.indices);
idxArr.push(idxArr[0], idxArr[1], idxArr[2]); // duplicate face
idxArr.push(0, 0, 1); // degenerate face
corrupt.indices = new Uint32Array(idxArr);
assert(manifoldCheck(corrupt).nonManifoldEdges > 0, 'corrupted cube detected as non-manifold');
const repaired = repairMesh(corrupt, 0.0001);
assert(manifoldCheck(repaired).watertight, 'repairMesh makes corrupted cube watertight');
assert(approx(volume(repaired), 8), 'repaired cube volume still 8');

// ---- decimation ----
// use a sphere-ish mesh with many triangles
function sphereMesh(seg = 24) {
  const positions = [];
  const indices = [];
  for (let i = 0; i <= seg; i++) {
    const phi = (i / seg) * Math.PI;
    for (let j = 0; j < seg; j++) {
      const th = (j / seg) * Math.PI * 2;
      positions.push(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
    }
  }
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * seg + j, b = i * seg + (j + 1) % seg;
      const c = (i + 1) * seg + (j + 1) % seg, d = (i + 1) * seg + j;
      indices.push(a, b, c, a, c, d);
    }
  }
  const m = new Mesh({ name: 'sphere', positions: new Float32Array(positions), indices: new Uint32Array(indices) });
  computeVertexNormals(m);
  return m;
}
const sphere = sphereMesh(24);
const sphereVol = volume(sphere);
const decimated = decimate(sphere, 0.25);
assert(decimated.faceCount < sphere.faceCount * 0.4, `decimation reduces faces (${sphere.faceCount} -> ${decimated.faceCount})`);
assert(decimated.faceCount >= 4, 'decimated mesh still has faces');
const decVol = volume(decimated);
assert(Math.abs(decVol - sphereVol) / sphereVol < 0.15, `decimated sphere volume within 15% (${sphereVol.toFixed(3)} -> ${decVol.toFixed(3)})`);

// ---- components ----
const twoCubes = mergeMeshes([weldExact(parseSTL(exportSTLBinary(cubeMesh(2, [-5, 0, 0])), 'a')), weldExact(parseSTL(exportSTLBinary(cubeMesh(2, [5, 0, 0])), 'b'))]);
const parts = splitComponents(twoCubes);
assert(parts.length === 2, `two separate cubes split into 2 parts (got ${parts.length})`);
assert(approx(volume(parts[0]) + volume(parts[1]), 16), 'split parts preserve total volume');

// ---- cut ----
const cube = weldExact(parseSTL(exportSTLBinary(cubeMesh(2)), 'cube'));
const topHalf = cutMesh(cube, { axis: 'z', value: 0 }, 'above', true);
assert(approx(volume(topHalf), 4, 1e-3), `cut keeps half the volume (got ${volume(topHalf)})`);
assert(manifoldCheck(topHalf).watertight, 'capped cut is watertight');
const [above, below] = splitByPlane(cube, { axis: 'z', value: 0 });
assert(approx(volume(above), 4, 1e-3) && approx(volume(below), 4, 1e-3), 'splitByPlane gives two halves');
assert(manifoldCheck(above).watertight && manifoldCheck(below).watertight, 'both split halves are watertight');

// off-center cut (triangle clipping path)
const partial = cutMesh(cube, { axis: 'z', value: 0.5 }, 'below', true);
assert(approx(volume(partial), 6, 1e-3), `off-center cut volume (expected 6, got ${volume(partial)})`);
assert(manifoldCheck(partial).watertight, 'off-center capped cut is watertight');

// ---- hollow ----
const hollowed = hollowMesh(cube, 0.5);
assert(hollowed.faceCount === cube.faceCount * 2, 'hollow has two shells');
const innerVol = volume(hollowed);
assert(innerVol > 0 && innerVol < 8, `hollow shell encloses less than solid (got ${innerVol})`);
assert(manifoldCheck(hollowed).nonManifoldEdges === 0, 'hollow shells are edge-manifold');

// ---- base ----
const withBase = addBase(cube, { thickness: 1, margin: 1 });
assert(withBase.faceCount === 24, `base adds a box (24 tris total, got ${withBase.faceCount})`);
const bb = meshBounds(withBase);
assert(approx(bb.size[2], 3, 1e-3), 'base extends bounding box by thickness');

// ---- slicing ----
const polylines = sliceMesh(cube, { axis: 'z', value: 0 });
assert(polylines.length === 1, `cube mid-slice has 1 contour (got ${polylines.length})`);
assert(polylines[0].length >= 4, 'slice contour has >= 4 points');

// ---- earcut ----
const tri = earcut([[0, 0], [1, 0], [0, 1]]);
assert(tri.length === 1, 'earcut triangle');
const squareTris = earcut([[0, 0], [1, 0], [1, 1], [0, 1]]);
assert(squareTris.length === 2, `earcut square gives 2 triangles (got ${squareTris.length})`);
const concaveTris = earcut([[0, 0], [2, 0], [2, 2], [1, 1], [0, 2]]);
assert(concaveTris.length === 3, `earcut concave pentagon gives 3 triangles (got ${concaveTris.length})`);

// ---- overhang ----
const oh = overhangAnalysis(cube, 45);
assert(oh.overhangFaces === 2, `flat bottom cube flags exactly 2 bottom faces (got ${oh.overhangFaces})`);
assert(approx(oh.overhangArea, 4), `bottom face area is 4 (got ${oh.overhangArea})`);

// ---- wall thickness ----
const wt = wallThickness(cube, 100);
assert(wt.samples.length > 10, `wall thickness has samples (got ${wt.samples.length})`);
assert(approx(wt.avg, 2, 0.3), `cube wall thickness ~2 (got ${wt.avg})`);

// ---- statistics / printability ----
const stats = meshStatistics(cube);
assert(stats.triangles === 12 && stats.vertices === 8, 'statistics counts');
const cubeOnGround = alignToGround(cubeMesh(2));
const pr = printabilityCheck(cubeOnGround);
assert(pr.manifold.watertight, 'printability: cube is manifold');
assert(pr.issues.length === 0, `printability: cube has no issues (got ${JSON.stringify(pr.issues)})`);

// ---- transforms ----
const mirrored = mirrorMesh(cubeMesh(2), 'x');
assert(approx(volume(mirrored), 8), 'mirrored cube keeps volume');
assert(signedVolume(mirrored) > 0, 'mirror flips winding so volume stays positive');

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
