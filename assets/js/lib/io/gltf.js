// GLB/GLTF parser and GLB exporter. Supports the glTF 2.0 subset needed for
// triangle meshes: POSITION/NORMAL/TEXCOORD_0/indices, interleaved optional,
// indexed/non-indexed primitives, multiple meshes/nodes with transforms.
// Draco/meshopt-compressed files are detected and rejected with a clear error.
import { Mesh } from '../mesh.js';

const COMP = {
  5120: { size: 1, arr: Int8Array },
  5121: { size: 1, arr: Uint8Array },
  5122: { size: 2, arr: Int16Array },
  5123: { size: 2, arr: Uint16Array },
  5125: { size: 4, arr: Uint32Array },
  5126: { size: 4, arr: Float32Array },
};
const VEC_N = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

export function parseGLB(buffer, name = 'model') {
  const dv = new DataView(buffer);
  if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('Not a valid GLB file (bad magic).');
  const version = dv.getUint32(4, true);
  if (version !== 2) throw new Error(`Unsupported GLB container version ${version}.`);
  let json = null;
  let bin = null;
  let off = 12;
  while (off + 8 <= buffer.byteLength) {
    const len = dv.getUint32(off, true);
    const type = dv.getUint32(off + 4, true);
    const data = new Uint8Array(buffer, off + 8, len);
    if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(data));
    else if (type === 0x004e4942) bin = data.slice(); // own copy: .buffer must be exactly the chunk
    off += 8 + len + ((len % 4) ? (4 - (len % 4)) : 0);
  }
  if (!json) throw new Error('GLB file has no JSON chunk.');
  return loadGLTF(json, bin ? [bin.buffer] : [], name);
}

export function parseGLTF(text, externalFiles, name = 'model') {
  const json = typeof text === 'string' ? JSON.parse(text) : text;
  return loadGLTF(json, externalFiles || [], name);
}

function resolveBuffers(json, externalFiles) {
  const buffers = [];
  for (const b of json.buffers || []) {
    if (b.uri) {
      if (b.uri.startsWith('data:')) {
        const b64 = b.uri.split(',')[1];
        buffers.push(base64Decode(b64).buffer);
      } else {
        const f = externalFiles.find(f => f.name === b.uri || f.name.endsWith('/' + b.uri) || b.uri.endsWith('/' + f.name));
        if (!f) throw new Error(`glTF references external file "${b.uri}" that was not provided. Select the .gltf file together with its .bin file and textures.`);
        buffers.push(f.data);
      }
    } else {
      buffers.push(externalFiles[0] || null); // GLB binary chunk
    }
  }
  return buffers;
}

export function base64Decode(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function loadGLTF(json, externalFiles, name) {
  if (json.asset && json.asset.version && parseFloat(json.asset.version) >= 2.5) {
    // still fine for basic meshes; glTF 2.x is broadly compatible
  }
  const buffers = resolveBuffers(json, externalFiles);
  const bufferViews = json.bufferViews || [];
  const accessors = json.accessors || [];

  checkExtensions(json);

  function readAccessor(ai) {
    const acc = accessors[ai];
    const comp = COMP[acc.componentType];
    if (!comp) throw new Error(`Unsupported glTF componentType ${acc.componentType}.`);
    const n = VEC_N[acc.type];
    const view = bufferViews[acc.bufferView];
    const count = acc.count;
    // bufferView stride of 0 or missing -> tightly packed
    const stride = (view && view.byteStride && view.byteStride > comp.size * n) ? view.byteStride : comp.size * n;
    const byteOffset = (acc.byteOffset || 0) + ((view && view.byteOffset) || 0);
    const srcBuffer = buffers[view.buffer];
    const out = new comp.arr(count * n);
    const src = new comp.arr(srcBuffer, byteOffset, Math.floor((srcBuffer.byteLength - byteOffset) / comp.size));
    if (stride === comp.size * n) {
      out.set(src.subarray(0, count * n));
    } else {
      for (let i = 0; i < count; i++) {
        for (let k = 0; k < n; k++) out[i * n + k] = src[(i * stride) / comp.size + k];
      }
    }
    return { array: out, n, count };
  }

  const meshes = [];
  const nodes = json.nodes || [];

  function applyNodeTransform(mesh, node) {
    if (node.matrix) {
      applyMatrix(mesh, node.matrix);
    } else {
      if (node.scale) {
        const s = node.scale;
        for (let i = 0; i < mesh.positions.length; i += 3) {
          mesh.positions[i] *= s[0]; mesh.positions[i + 1] *= s[1]; mesh.positions[i + 2] *= s[2];
        }
      }
      if (node.rotation) applyQuaternion(mesh, node.rotation);
      if (node.translation) {
        const t = node.translation;
        for (let i = 0; i < mesh.positions.length; i += 3) {
          mesh.positions[i] += t[0]; mesh.positions[i + 1] += t[1]; mesh.positions[i + 2] += t[2];
        }
      }
    }
  }

  const visited = new Set();
  function walkNode(nodeIndex, parentPath) {
    if (visited.has(nodeIndex)) return;
    visited.add(nodeIndex);
    const node = nodes[nodeIndex];
    if (node.mesh !== undefined && json.meshes && json.meshes[node.mesh]) {
      const m = json.meshes[node.mesh];
      m.primitives.forEach((prim, pi) => {
        if (prim.mode !== undefined && prim.mode !== 4) return; // triangles only
        if (prim.extensions) return; // e.g. KHR_draco_mesh_compression
        const pos = readAccessor(prim.attributes.POSITION);
        const mesh = new Mesh({
          name: m.name || node.name || `${name}_${meshes.length}`,
          positions: new Float32Array(pos.array),
        });
        if (prim.attributes.NORMAL !== undefined) {
          const nrm = readAccessor(prim.attributes.NORMAL);
          mesh.normals = new Float32Array(nrm.array);
        }
        if (prim.attributes.TEXCOORD_0 !== undefined) {
          const uv = readAccessor(prim.attributes.TEXCOORD_0);
          mesh.uvs = new Float32Array(uv.array);
        }
        if (prim.attributes.COLOR_0 !== undefined) {
          try {
            const col = readAccessor(prim.attributes.COLOR_0);
            mesh.colors = new Float32Array(col.array);
            // normalize uint8/uint16 colors
            if (col.array instanceof Uint8Array || col.array instanceof Uint16Array) {
              const max = col.array instanceof Uint8Array ? 255 : 65535;
              for (let i = 0; i < mesh.colors.length; i++) mesh.colors[i] /= max;
            }
          } catch (e) { /* color accessor problems are non-fatal */ }
        }
        if (prim.indices !== undefined) {
          const ind = readAccessor(prim.indices);
          mesh.indices = new Uint32Array(ind.array);
        }
        if (prim.material !== undefined && json.materials && json.materials[prim.material]) {
          mesh.materialName = json.materials[prim.material].name || null;
        }
        applyNodeTransform(mesh, node);
        meshes.push(mesh);
      });
    }
    for (const c of node.children || []) walkNode(c);
  }

  if (json.scenes && json.scenes.length) {
    const scene = json.scenes[json.scene || 0];
    for (const n of scene.nodes || []) walkNode(n);
  } else {
    for (let i = 0; i < nodes.length; i++) walkNode(i);
  }

  if (meshes.length === 0) {
    throw new Error('No triangle meshes found in GLTF/GLB file (points, lines, or compressed primitives are not supported).');
  }
  return meshes;
}

function checkExtensions(json) {
  const exts = json.extensionsRequired || [];
  const unsupported = exts.filter(e => !['KHR_materials_unlit'].includes(e));
  if (unsupported.length) {
    if (unsupported.includes('KHR_draco_mesh_compression')) {
      throw new Error('This file uses Draco compression, which is not supported. Re-export without Draco compression.');
    }
    throw new Error(`Unsupported required glTF extension(s): ${unsupported.join(', ')}.`);
  }
}

function applyMatrix(mesh, m) {
  const p = mesh.positions;
  const nr = mesh.normals;
  // upper 3x3 for normals (no inverse-transpose; fine for rigid/axis-aligned scale)
  for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    p[i] = m[0] * x + m[4] * y + m[8] * z + m[12];
    p[i + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    p[i + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
  }
  if (nr) {
    for (let i = 0; i < nr.length; i += 3) {
      const x = nr[i], y = nr[i + 1], z = nr[i + 2];
      nr[i] = m[0] * x + m[4] * y + m[8] * z;
      nr[i + 1] = m[1] * x + m[5] * y + m[9] * z;
      nr[i + 2] = m[2] * x + m[6] * y + m[10] * z;
    }
  }
}

function applyQuaternion(mesh, q) {
  const [x, y, z, w] = q;
  const m = [
    1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w),
    2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w),
    2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y),
  ];
  // column-major like glTF matrix
  const mat = [m[0], m[3], m[6], 0, m[1], m[4], m[7], 0, m[2], m[5], m[8], 0, 0, 0, 0, 1];
  applyMatrix(mesh, mat);
}

// ---------------- GLB exporter ----------------

export function exportGLB(meshes, opts = {}) {
  const list = (Array.isArray(meshes) ? meshes : [meshes]).filter(m => m.positions && m.positions.length > 0);
  if (list.length === 0) throw new Error('Nothing to export.');
  const binParts = [];
  let binLength = 0;
  const json = {
    asset: { version: '2.0', generator: '3DTools' },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    accessors: [],
    bufferViews: [],
    buffers: [{ byteLength: 0 }],
  };
  const rootNodes = [];

  function addBufferView(arr, target) {
    const aligned = new Uint8Array(Math.ceil(arr.byteLength / 4) * 4);
    aligned.set(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength));
    binParts.push(aligned);
    const view = { buffer: 0, byteOffset: binLength, byteLength: arr.byteLength };
    if (target) view.target = target;
    json.bufferViews.push(view);
    binLength += aligned.byteLength;
    return json.bufferViews.length - 1;
  }

  function addAccessor(viewIdx, arr, n, count, type, minMax) {
    const acc = { bufferView: viewIdx, componentType: compTypeOf(arr), count, type };
    if (minMax) { acc.min = minMax.min; acc.max = minMax.max; }
    json.accessors.push(acc);
    return json.accessors.length - 1;
  }

  function compTypeOf(arr) {
    if (arr instanceof Float32Array) return 5126;
    if (arr instanceof Uint32Array) return 5125;
    if (arr instanceof Uint16Array) return 5123;
    if (arr instanceof Uint8Array) return 5121;
    throw new Error('Unsupported accessor array type.');
  }

  list.forEach((mesh, mi) => {
    const posView = addBufferView(mesh.positions, 34962);
    const b = boundsOf(mesh.positions);
    const posAcc = addAccessor(posView, mesh.positions, 3, mesh.positions.length / 3, 'VEC3', { min: b.min, max: b.max });
    let nrmAcc = null, uvAcc = null;
    if (mesh.normals) {
      const v = addBufferView(mesh.normals, 34962);
      nrmAcc = addAccessor(v, mesh.normals, 3, mesh.normals.length / 3, 'VEC3');
    }
    if (mesh.uvs) {
      const v = addBufferView(mesh.uvs, 34962);
      uvAcc = addAccessor(v, mesh.uvs, 2, mesh.uvs.length / 2, 'VEC2');
    }
    const attributes = { POSITION: posAcc };
    if (nrmAcc !== null) attributes.NORMAL = nrmAcc;
    if (uvAcc !== null) attributes.TEXCOORD_0 = uvAcc;

    let indices = mesh.indices;
    let primIndices = undefined;
    if (indices && indices.length > 0) {
      const use32 = indices.length / 3 > 65535 || mesh.positions.length / 3 > 65536;
      const arr = use32 ? indices : new Uint16Array(indices);
      const v = addBufferView(arr, 34963);
      primIndices = addAccessor(v, arr, 1, arr.length, 'SCALAR');
    }

    const meshDef = {
      name: sanitize(mesh.name) || `mesh_${mi}`,
      primitives: [{ attributes, indices: primIndices, mode: 4 }],
    };
    json.meshes.push(meshDef);
    const nodeDef = { mesh: json.meshes.length - 1, name: meshDef.name };
    json.nodes.push(nodeDef);
    rootNodes.push(json.nodes.length - 1);
  });

  json.scenes[0].nodes = rootNodes;
  json.buffers[0].byteLength = binLength;

  // pad final
  const bin = new Uint8Array(binLength);
  let p = 0;
  for (const part of binParts) { bin.set(part, p); p += part.byteLength; }

  const jsonStr = JSON.stringify(json);
  const jsonBytes = new TextEncoder().encode(jsonStr);
  const jsonPadded = new Uint8Array(Math.ceil(jsonBytes.length / 4) * 4);
  jsonPadded.set(jsonBytes);
  // glTF requires space (0x20) padding in JSON chunk
  for (let i = jsonBytes.length; i < jsonPadded.length; i++) jsonPadded[i] = 0x20;

  const total = 12 + 8 + jsonPadded.byteLength + (bin.byteLength ? 8 + bin.byteLength : 0);
  const out = new ArrayBuffer(total);
  const dv = new DataView(out);
  dv.setUint32(0, 0x46546c67, true);
  dv.setUint32(4, 2, true);
  dv.setUint32(8, total, true);
  dv.setUint32(12, jsonPadded.byteLength, true);
  dv.setUint32(16, 0x4e4f534a, true);
  new Uint8Array(out, 20, jsonPadded.byteLength).set(jsonPadded);
  if (bin.byteLength) {
    const o = 20 + jsonPadded.byteLength;
    dv.setUint32(o, bin.byteLength, true);
    dv.setUint32(o + 4, 0x004e4942, true);
    new Uint8Array(out, o + 8, bin.byteLength).set(bin);
  }
  return out;
}

export function exportGLTFJSON(meshes) {
  // .gltf with embedded base64 buffer
  const glb = exportGLB(meshes);
  // reuse the builder by re-parsing: simpler to rebuild JSON directly
  const dv = new DataView(glb);
  const jsonLen = dv.getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(glb, 20, jsonLen)));
  const binStart = 20 + jsonLen;
  const binLen = dv.getUint32(binStart, true);
  const bin = new Uint8Array(glb, binStart + 8, binLen);
  let b64 = '';
  const chunk = 0x8000;
  for (let i = 0; i < bin.length; i += chunk) {
    b64 += String.fromCharCode.apply(null, bin.subarray(i, i + chunk));
  }
  json.buffers = [{ byteLength: bin.length, uri: 'data:application/octet-stream;base64,' + btoa(b64) }];
  return JSON.stringify(json, null, 1);
}

function boundsOf(p) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < p.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      if (p[i + a] < min[a]) min[a] = p[i + a];
      if (p[i + a] > max[a]) max[a] = p[i + a];
    }
  }
  return { min, max };
}

function sanitize(s) {
  return String(s || '').replace(/[^\w\-\. ]/g, '_');
}
