// Quick IO round-trip smoke test. Run: node tests/smoke-io.mjs
import { Mesh, meshBounds, computeVertexNormals } from '../assets/js/lib/mesh.js';
import { exportSTLBinary, exportSTLAscii, parseSTL } from '../assets/js/lib/io/stl.js';
import { exportOBJ, parseOBJ } from '../assets/js/lib/io/obj.js';
import { exportPLY, parsePLY } from '../assets/js/lib/io/ply.js';
import { exportGLB, parseGLB } from '../assets/js/lib/io/gltf.js';
import { export3MF, parse3MF } from '../assets/js/lib/io/threemf.js';

function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; }
  else console.log('ok:', msg);
}

function cubeMesh(size = 2) {
  const s = size / 2;
  const positions = new Float32Array([
    -s, -s, -s, s, -s, -s, s, s, -s, -s, s, -s,
    -s, -s, s, s, -s, s, s, s, s, -s, s, s,
  ]);
  const quads = [
    [0, 3, 2, 1], [4, 5, 6, 7], // z-
    [0, 1, 5, 4], [2, 3, 7, 6],
    [0, 4, 7, 3], [1, 2, 6, 5],
  ];
  const indices = [];
  for (const [a, b, c, d] of quads) {
    indices.push(a, b, c, a, c, d);
  }
  const m = new Mesh({ name: 'cube', positions, indices: new Uint32Array(indices) });
  computeVertexNormals(m);
  return m;
}

const cube = cubeMesh();

// STL binary
const stlBuf = exportSTLBinary(cube);
assert(stlBuf.byteLength === 84 + 12 * 50, 'STL binary size');
const stlBack = parseSTL(stlBuf, 'cube');
assert(stlBack.faceCount === 12, `STL binary parse faceCount (got ${stlBack.faceCount})`);
assert(Math.abs(meshBounds(stlBack).size[0] - 2) < 1e-5, 'STL binary bounds');

// STL ascii
const stlAscii = exportSTLAscii(cube);
const stlBack2 = parseSTL(new TextEncoder().encode(stlAscii).buffer, 'cube');
assert(stlBack2.faceCount === 12, `STL ascii parse faceCount (got ${stlBack2.faceCount})`);

// OBJ
const objText = exportOBJ(cube);
const objMeshes = parseOBJ(objText, 'cube');
assert(objMeshes.length === 1 && objMeshes[0].faceCount === 12, 'OBJ round trip');
const objBack = exportOBJ(objMeshes);
assert(objBack.includes('f '), 'OBJ export has faces');

// PLY binary
const plyBuf = exportPLY(cube);
const plyMeshes = parsePLY(plyBuf, 'cube');
assert(plyMeshes.length === 1 && plyMeshes[0].faceCount === 12, 'PLY binary round trip');
// PLY ascii
const plyAscii = exportPLY(cube, { binary: false });
const plyMeshes2 = parsePLY(new TextEncoder().encode(plyAscii).buffer, 'cube');
assert(plyMeshes2.length === 1 && plyMeshes2[0].faceCount === 12, 'PLY ascii round trip');

// GLB
const glbBuf = exportGLB(cube);
const glbMeshes = parseGLB(glbBuf, 'cube');
assert(glbMeshes.length === 1 && glbMeshes[0].faceCount === 12, 'GLB round trip');
assert(Math.abs(meshBounds(glbMeshes[0]).size[1] - 2) < 1e-5, 'GLB bounds');

// 3MF
const mfBuf = await export3MF(cube);
const mfMeshes = await parse3MF(mfBuf, 'cube');
assert(mfMeshes.length === 1 && mfMeshes[0].faceCount === 12, '3MF round trip');

// multi-object OBJ
const objMulti = exportOBJ([cube, cube]);
const multiMeshes = parseOBJ(objMulti, 'multi');
assert(multiMeshes.length === 2, `OBJ multi-object parse (got ${multiMeshes.length})`);

console.log(process.exitCode ? 'SMOKE TEST FAILED' : 'SMOKE TEST PASSED');
