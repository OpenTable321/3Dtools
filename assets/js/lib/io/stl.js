// STL parser + exporter (binary and ASCII). Pure typed-array code, runs anywhere.
import { Mesh } from '../mesh.js';

export function detectSTLType(buffer) {
  if (buffer.byteLength < 84) return 'ascii';
  const dv = new DataView(buffer);
  const triCount = dv.getUint32(80, true);
  const exact = 84 + triCount * 50;
  if (exact === buffer.byteLength) return 'binary';
  // some exporters append padding; a plausible count with enough bytes is still binary
  if (triCount > 0 && exact <= buffer.byteLength && exact > buffer.byteLength - 1000) return 'binary';
  const head = new Uint8Array(buffer, 0, Math.min(1024, buffer.byteLength));
  let text = '';
  for (let i = 0; i < head.length; i++) text += String.fromCharCode(head[i]);
  if (/facet\s+normal/i.test(text)) return 'ascii';
  if (/^\s*solid/i.test(text) && !/\u0000/.test(text.slice(0, 80))) return 'ascii';
  return triCount > 0 && exact <= buffer.byteLength ? 'binary' : 'ascii';
}

export function parseSTL(buffer, name = 'model') {
  const type = detectSTLType(buffer);
  if (type === 'ascii') return parseAsciiSTL(buffer, name);
  return parseBinarySTL(buffer, name);
}

function parseBinarySTL(buffer, name) {
  const dv = new DataView(buffer);
  const triCount = dv.getUint32(80, true);
  const expected = 84 + triCount * 50;
  if (expected > buffer.byteLength) {
    // tolerate truncated files by clipping to what's present
    const possible = Math.floor((buffer.byteLength - 84) / 50);
    if (possible < triCount) {
      if (possible === 0) throw new Error('STL file is truncated or not a valid binary STL.');
    }
  }
  const n = Math.min(triCount, Math.floor((buffer.byteLength - 84) / 50));
  const positions = new Float32Array(n * 9);
  const normals = new Float32Array(n * 9);
  let o = 0;
  for (let t = 0; t < n; t++) {
    const base = 84 + t * 50;
    const nx = dv.getFloat32(base, true);
    const ny = dv.getFloat32(base + 4, true);
    const nz = dv.getFloat32(base + 8, true);
    for (let k = 0; k < 3; k++) {
      positions[o] = dv.getFloat32(base + 12 + k * 12, true);
      positions[o + 1] = dv.getFloat32(base + 12 + k * 12 + 4, true);
      positions[o + 2] = dv.getFloat32(base + 12 + k * 12 + 8, true);
      normals[o] = nx; normals[o + 1] = ny; normals[o + 2] = nz;
      o += 3;
    }
  }
  return new Mesh({ name, positions, normals, indices: null });
}

function parseAsciiSTL(buffer, name) {
  const decoder = new TextDecoder();
  const text = decoder.decode(buffer);
  if (!/facet\s+normal/i.test(text)) throw new Error('Not a valid ASCII STL file (no "facet normal" entries found).');
  const nums = [];
  const re = /vertex\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    nums.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  if (nums.length < 9 || (nums.length / 9) % 1 !== 0) {
    // drop trailing partial triangle
    while (nums.length % 9 !== 0) nums.pop();
  }
  if (nums.length === 0) throw new Error('No triangles found in ASCII STL.');
  const positions = Float32Array.from(nums);
  const triCount = positions.length / 9;
  const normals = new Float32Array(positions.length);
  // recompute flat normals (ASCII normals are frequently garbage)
  const mesh = new Mesh({ name, positions, indices: null });
  for (let t = 0; t < triCount; t++) {
    const a = t * 9, b = a + 3, c = a + 6;
    const p = positions;
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
    const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    for (let k = 0; k < 3; k++) {
      normals[a + k * 3] = nx; normals[a + k * 3 + 1] = ny; normals[a + k * 3 + 2] = nz;
    }
  }
  mesh.normals = normals;
  return mesh;
}

export function exportSTLBinary(mesh) {
  const triCount = mesh.indices ? mesh.indices.length / 3 : mesh.positions.length / 9;
  if (triCount > 4294967295) throw new Error('Too many triangles for STL.');
  const buf = new ArrayBuffer(84 + triCount * 50);
  const dv = new DataView(buf);
  const header = '3dtools-export';
  for (let i = 0; i < Math.min(80, header.length); i++) dv.setUint8(i, header.charCodeAt(i));
  dv.setUint32(80, triCount, true);
  const p = mesh.positions;
  const idx = mesh.indices;
  let o = 84;
  for (let t = 0; t < triCount; t++) {
    const ia = idx ? idx[t * 3] * 3 : t * 9;
    const ib = idx ? idx[t * 3 + 1] * 3 : t * 9 + 3;
    const ic = idx ? idx[t * 3 + 2] * 3 : t * 9 + 6;
    // face normal
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 0;
    if (l > 0) { nx /= l; ny /= l; nz /= l; }
    dv.setFloat32(o, nx, true); dv.setFloat32(o + 4, ny, true); dv.setFloat32(o + 8, nz, true);
    for (let k = 0; k < 3; k++) {
      const src = k === 0 ? ia : k === 1 ? ib : ic;
      dv.setFloat32(o + 12 + k * 12, p[src], true);
      dv.setFloat32(o + 12 + k * 12 + 4, p[src + 1], true);
      dv.setFloat32(o + 12 + k * 12 + 8, p[src + 2], true);
    }
    dv.setUint16(o + 48, 0, true);
    o += 50;
  }
  return buf;
}

export function exportSTLAscii(mesh) {
  const triCount = mesh.indices ? mesh.indices.length / 3 : mesh.positions.length / 9;
  const p = mesh.positions;
  const idx = mesh.indices;
  const lines = ['solid model'];
  for (let t = 0; t < triCount; t++) {
    const ia = idx ? idx[t * 3] * 3 : t * 9;
    const ib = idx ? idx[t * 3 + 1] * 3 : t * 9 + 3;
    const ic = idx ? idx[t * 3 + 2] * 3 : t * 9 + 6;
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 0;
    if (l > 0) { nx /= l; ny /= l; nz /= l; }
    lines.push(`  facet normal ${nx.toFixed(6)} ${ny.toFixed(6)} ${nz.toFixed(6)}`);
    lines.push('    outer loop');
    for (const o of [ia, ib, ic]) {
      lines.push(`      vertex ${p[o].toFixed(6)} ${p[o + 1].toFixed(6)} ${p[o + 2].toFixed(6)}`);
    }
    lines.push('    endloop');
    lines.push('  endfacet');
  }
  lines.push('endsolid model');
  return lines.join('\n') + '\n';
}
