// Generate sample 3D files with the real exporters for browser tests.
// Run: node tests/make-samples.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Mesh, computeVertexNormals } from '../assets/js/lib/mesh.js';
import { exportSTLBinary, exportSTLAscii } from '../assets/js/lib/io/stl.js';
import { exportOBJ } from '../assets/js/lib/io/obj.js';
import { exportPLY } from '../assets/js/lib/io/ply.js';
import { exportGLB } from '../assets/js/lib/io/gltf.js';
import { export3MF } from '../assets/js/lib/io/threemf.js';

const dir = fileURLToPath(new URL('.', import.meta.url));
mkdirSync(`${dir}samples`, { recursive: true });

// a chunky "bracket" shape: box + boss, so tools have something real to chew on
function buildPart() {
  const positions = [];
  const indices = [];
  function addBox(x0, y0, z0, x1, y1, z1) {
    const b = positions.length / 3;
    positions.push(
      x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0,
      x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1,
    );
    const quads = [[4, 5, 6, 7], [1, 0, 3, 2], [0, 1, 5, 4], [2, 3, 7, 6], [0, 4, 7, 3], [1, 2, 6, 5]];
    for (const [a, bb, c, d] of quads) indices.push(b + a, b + bb, b + c, b + a, b + c, b + d);
  }
  addBox(0, 0, 0, 40, 30, 6);        // plate
  addBox(5, 5, 6, 12, 25, 26);       // wall
  addBox(18, 8, 6, 35, 15, 14);      // boss
  const mesh = new Mesh({ name: 'bracket', positions: new Float32Array(positions), indices: new Uint32Array(indices) });
  computeVertexNormals(mesh);
  return mesh;
}

const part = buildPart();
writeFileSync(`${dir}samples/bracket.stl`, Buffer.from(exportSTLBinary(part)));
writeFileSync(`${dir}samples/bracket-ascii.stl`, Buffer.from(exportSTLAscii(part), 'utf-8'));
writeFileSync(`${dir}samples/bracket.obj`, Buffer.from(exportOBJ(part), 'utf-8'));
writeFileSync(`${dir}samples/bracket.ply`, Buffer.from(exportPLY(part)));
writeFileSync(`${dir}samples/bracket.glb`, Buffer.from(exportGLB(part)));
writeFileSync(`${dir}samples/bracket.3mf`, Buffer.from(await export3MF(part)));
console.log('samples written to tests/samples/ (bracket: 36 triangles, 3 boxes)');
