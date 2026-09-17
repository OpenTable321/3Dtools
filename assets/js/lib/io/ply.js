// PLY parser + exporter (ASCII + binary little/big endian).
import { Mesh } from '../mesh.js';

function parseHeader(text) {
  if (!/^ply/i.test(text.trim())) throw new Error('Not a valid PLY file (missing "ply" magic).');
  const lines = text.split(/\r?\n/);
  let format = null;
  const elements = [];
  let current = null;
  for (const line of lines) {
    if (line === 'end_header') break;
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'format') format = parts[1];
    else if (parts[0] === 'element') {
      current = { name: parts[1], count: parseInt(parts[2], 10), props: [] };
      elements.push(current);
    } else if (parts[0] === 'property' && current) {
      if (parts[1] === 'list') current.props.push({ list: true, countType: parts[2], type: parts[3], name: parts[4] });
      else current.props.push({ list: false, type: parts[1], name: parts[2] });
    }
  }
  if (!format) throw new Error('PLY header has no format line.');
  return { format, elements };
}

const TYPE_SIZES = { char: 1, int8: 1, uchar: 1, uint8: 1, short: 2, int16: 2, ushort: 2, uint16: 2, int: 4, int32: 4, uint: 4, uint32: 4, float: 4, float32: 4, double: 8, float64: 8 };
const isInt = t => !/^float|^double/i.test(t);

export function parsePLY(buffer, name = 'model') {
  const decoder = new TextDecoder('utf-8');
  const headBytes = new Uint8Array(buffer, 0, Math.min(65536, buffer.byteLength));
  const needle = 'end_header';
  let headerEnd = -1, dataOffset = -1;
  outer:
  for (let i = 0; i <= headBytes.length - needle.length; i++) {
    for (let k = 0; k < needle.length; k++) {
      if (headBytes[i + k] !== needle.charCodeAt(k)) continue outer;
    }
    headerEnd = i;
    // skip to just after the following newline
    let j = i + needle.length;
    while (j < headBytes.length && headBytes[j] !== 10) j++;
    dataOffset = j + 1;
    break;
  }
  if (headerEnd === -1) throw new Error('PLY header not found (missing end_header).');
  const headerText = decoder.decode(headBytes.subarray(0, headerEnd)).trimEnd();
  const { format, elements } = parseHeader(headerText);

  const meshes = [];
  if (format === 'ascii') {
    const bodyText = decoder.decode(new Uint8Array(buffer, dataOffset));
    const tokens = bodyText.split(/\s+/).filter(t => t.length > 0);
    let ti = 0;
    const readToken = () => tokens[ti++];
    for (const el of elements) {
      if (el.name === 'vertex') {
        const verts = readAsciiElement(el, readToken);
        meshes.push({ verts, faces: [] });
      } else if (el.name === 'face') {
        const target = meshes[meshes.length - 1] || { verts: null, faces: [] };
        for (let i = 0; i < el.count; i++) {
          const n = parseInt(readToken(), 10);
          const idx = [];
          for (let k = 0; k < n; k++) idx.push(parseInt(readToken(), 10));
          for (let k = 1; k < idx.length - 1; k++) target.faces.push([idx[0], idx[k], idx[k + 1]]);
        }
      } else {
        skipAsciiElement(el, readToken);
      }
    }
    return buildMeshes(meshes, name);
  }

  // binary
  const dv = new DataView(buffer);
  const le = format === 'binary_little_endian';
  let off = dataOffset;
  const readScalar = (type) => {
    const v = readScalarAt(dv, off, type, le);
    off += TYPE_SIZES[type] || 4;
    return v;
  };
  for (const el of elements) {
    if (el.name === 'vertex') {
      const verts = readBinaryElement(el, readScalar);
      meshes.push({ verts, faces: [] });
    } else if (el.name === 'face') {
      const target = meshes[meshes.length - 1] || { verts: null, faces: [] };
      for (let i = 0; i < el.count; i++) {
        for (const prop of el.props) {
          if (prop.list) {
            const n = readScalar(prop.countType);
            if (prop.name === 'vertex_indices') {
              const idx = [];
              for (let k = 0; k < n; k++) idx.push(readScalar(prop.type));
              for (let k = 1; k < idx.length - 1; k++) target.faces.push([idx[0], idx[k], idx[k + 1]]);
            } else {
              for (let k = 0; k < n; k++) readScalar(prop.type);
            }
          } else {
            readScalar(prop.type);
          }
        }
      }
    } else {
      skipBinaryElement(el, (n) => { off += n; });
    }
  }
  return buildMeshes(meshes, name);
}

function readScalarAt(dv, off, type, le) {
  switch (type) {
    case 'float': case 'float32': return dv.getFloat32(off, le);
    case 'double': case 'float64': return dv.getFloat64(off, le);
    case 'char': case 'int8': return dv.getInt8(off);
    case 'uchar': case 'uint8': return dv.getUint8(off);
    case 'short': case 'int16': return dv.getInt16(off, le);
    case 'ushort': case 'uint16': return dv.getUint16(off, le);
    case 'int': case 'int32': return dv.getInt32(off, le);
    case 'uint': case 'uint32': return dv.getUint32(off, le);
    default: throw new Error(`Unsupported PLY type: ${type}`);
  }
}

function readAsciiElement(el, readToken) {
  const rows = [];
  for (let i = 0; i < el.count; i++) {
    const row = {};
    for (const prop of el.props) {
      if (prop.list) {
        const n = parseInt(readToken(), 10);
        row[prop.name] = Array.from({ length: n }, () => parseFloat(readToken()));
      } else {
        row[prop.name] = isInt(prop.type) ? parseInt(readToken(), 10) : parseFloat(readToken());
      }
    }
    rows.push(row);
  }
  return rows;
}

function readBinaryElement(el, readScalar) {
  const rows = [];
  for (let i = 0; i < el.count; i++) {
    const row = {};
    for (const prop of el.props) {
      if (prop.list) {
        const n = readScalar(prop.countType);
        const vals = [];
        for (let k = 0; k < n; k++) vals.push(readScalar(prop.type));
        row[prop.name] = vals;
      } else {
        row[prop.name] = readScalar(prop.type);
      }
    }
    rows.push(row);
  }
  return rows;
}

function skipAsciiElement(el, readToken) {
  for (let i = 0; i < el.count; i++) {
    for (const prop of el.props) {
      if (prop.list) {
        const n = parseInt(readToken(), 10);
        for (let k = 0; k < n; k++) readToken();
      } else readToken();
    }
  }
}

function skipBinaryElement(el, advance) {
  const fixedSize = el.props.reduce((s, p) => s + (p.list ? 0 : TYPE_SIZES[p.type] || 4), 0);
  if (el.props.every(p => !p.list)) {
    advance(fixedSize * el.count);
  } else {
    throw new Error('Cannot skip binary list element outside vertex/face.');
  }
}

function buildMeshes(groups, name) {
  const out = [];
  for (const g of groups) {
    if (!g.verts || g.verts.length === 0) continue;
    const verts = g.verts;
    const hasN = verts.length > 0 && 'nx' in verts[0];
    const hasUV = verts.length > 0 && 's' in verts[0];
    const hasC = verts.length > 0 && 'red' in verts[0];
    const positions = new Float32Array(verts.length * 3);
    const normals = hasN ? new Float32Array(verts.length * 3) : null;
    const uvs = hasUV ? new Float32Array(verts.length * 2) : null;
    const colors = hasC ? new Float32Array(verts.length * 3) : null;
    verts.forEach((v, i) => {
      positions[i * 3] = v.x || 0; positions[i * 3 + 1] = v.y || 0; positions[i * 3 + 2] = v.z || 0;
      if (normals) { normals[i * 3] = v.nx || 0; normals[i * 3 + 1] = v.ny || 0; normals[i * 3 + 2] = v.nz || 0; }
      if (uvs) { uvs[i * 2] = v.s || 0; uvs[i * 2 + 1] = v.t || 0; }
      if (colors) {
        colors[i * 3] = (v.red || 0) / 255; colors[i * 3 + 1] = (v.green || 0) / 255; colors[i * 3 + 2] = (v.blue || 0) / 255;
      }
    });
    if (g.faces.length === 0) {
      // point cloud — emit as empty-index mesh so the viewer can show points
      out.push(new Mesh({ name, positions, normals, uvs, colors, indices: new Uint32Array(0) }));
      continue;
    }
    const indices = new Uint32Array(g.faces.length * 3);
    let bad = false;
    g.faces.forEach((f, i) => {
      for (let k = 0; k < 3; k++) {
        if (f[k] >= verts.length || f[k] < 0) bad = true;
        indices[i * 3 + k] = f[k];
      }
    });
    if (bad) throw new Error('PLY face references a vertex index out of range.');
    out.push(new Mesh({ name, positions, normals, uvs, colors, indices }));
  }
  if (out.length === 0) throw new Error('PLY file contains no vertex data.');
  return out;
}

export function exportPLY(mesh, opts = {}) {
  const binary = opts.binary !== false;
  const hasUV = !!mesh.uvs;
  const hasN = !!mesh.normals;
  const vc = mesh.positions.length / 3;
  const triCount = mesh.indices ? mesh.indices.length / 3 : vc / 3;
  const headerLines = [
    'ply',
    `format ${binary ? 'binary_little_endian' : 'ascii'} 1.0`,
    `comment Created by 3DTools`,
    `element vertex ${vc}`,
    'property float x',
    'property float y',
    'property float z',
  ];
  if (hasN) headerLines.push('property float nx', 'property float ny', 'property float nz');
  if (hasUV) headerLines.push('property float s', 'property float t');
  headerLines.push(`element face ${triCount}`, 'property list uchar int vertex_indices', 'end_header');
  const header = headerLines.join('\n') + '\n';

  if (!binary) {
    const lines = [header.slice(0, -1)];
    const p = mesh.positions;
    for (let i = 0; i < vc; i++) {
      let l = `${p[i * 3]} ${p[i * 3 + 1]} ${p[i * 3 + 2]}`;
      if (hasN) l += ` ${mesh.normals[i * 3]} ${mesh.normals[i * 3 + 1]} ${mesh.normals[i * 3 + 2]}`;
      if (hasUV) l += ` ${mesh.uvs[i * 2]} ${mesh.uvs[i * 2 + 1]}`;
      lines.push(l);
    }
    const idx = mesh.indices;
    for (let t = 0; t < triCount; t++) {
      const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
      lines.push(`3 ${a} ${b} ${c}`);
    }
    return lines.join('\n') + '\n';
  }

  const stride = 12 + (hasN ? 12 : 0) + (hasUV ? 8 : 0);
  const bodyLen = vc * stride + triCount * (1 + 12);
  const buf = new ArrayBuffer(header.length + bodyLen);
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  for (let i = 0; i < header.length; i++) u8[i] = header.charCodeAt(i);
  let o = header.length;
  const p = mesh.positions;
  for (let i = 0; i < vc; i++) {
    dv.setFloat32(o, p[i * 3], true); dv.setFloat32(o + 4, p[i * 3 + 1], true); dv.setFloat32(o + 8, p[i * 3 + 2], true);
    o += 12;
    if (hasN) {
      dv.setFloat32(o, mesh.normals[i * 3], true); dv.setFloat32(o + 4, mesh.normals[i * 3 + 1], true); dv.setFloat32(o + 8, mesh.normals[i * 3 + 2], true);
      o += 12;
    }
    if (hasUV) {
      dv.setFloat32(o, mesh.uvs[i * 2], true); dv.setFloat32(o + 4, mesh.uvs[i * 2 + 1], true);
      o += 8;
    }
  }
  const idx = mesh.indices;
  for (let t = 0; t < triCount; t++) {
    dv.setUint8(o, 3); o += 1;
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
    dv.setInt32(o, a, true); dv.setInt32(o + 4, b, true); dv.setInt32(o + 8, c, true);
    o += 12;
  }
  return buf;
}
