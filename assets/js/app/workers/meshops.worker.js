// Mesh operations worker. All heavy processing runs here off the main thread.
import { deserializeMesh, serializeMesh } from '../../lib/mesh.js';
import * as MeshLib from '../../lib/mesh.js';
import * as Repair from '../../lib/ops/repair.js';
import * as Analyze from '../../lib/ops/analyze.js';
import { decimate } from '../../lib/ops/decimate.js';
import * as Geometry from '../../lib/ops/geometry.js';
import { sliceMesh } from '../../lib/ops/slice.js';

self.onmessage = async (e) => {
  const { id, op, payload } = e.data;
  const progress = (p) => self.postMessage({ id, progress: p });
  try {
    const result = await handle(op, payload, progress);
    const transfer = [];
    collectTransferables(result, transfer);
    self.postMessage({ id, ok: true, result }, transfer);
  } catch (err) {
    self.postMessage({ id, ok: false, error: err && err.message ? err.message : String(err) });
  }
};

function collectTransferables(obj, out) {
  if (!obj) return;
  if (obj.buffer instanceof ArrayBuffer && !obj.resizable) { out.push(obj.buffer); return; }
  if (Array.isArray(obj)) { for (const v of obj) collectTransferables(v, out); return; }
  if (typeof obj === 'object') { for (const k of Object.keys(obj)) collectTransferables(obj[k], out); }
}

async function handle(op, p, progress) {
  switch (op) {
    case 'transform': {
      const mesh = deserializeMesh(p.mesh);
      if (p.scale) MeshLib.scaleMesh(mesh, p.scale[0], p.scale[1], p.scale[2]);
      if (p.rotate) for (const r of p.rotate) MeshLib.rotateMesh(mesh, r.axis, r.radians);
      if (p.mirror) MeshLib.mirrorMesh(mesh, p.mirror);
      if (p.center) MeshLib.centerMesh(mesh, !!p.dropToGround);
      else if (p.alignGround) MeshLib.alignToGround(mesh);
      return serializeMesh(mesh);
    }
    case 'repair': {
      const mesh = deserializeMesh(p.mesh);
      const out = Repair.repairMesh(mesh, p.tolerance, progress);
      return serializeMesh(out);
    }
    case 'weld': {
      const mesh = deserializeMesh(p.mesh);
      const out = Repair.weldVertices(mesh, p.tolerance, progress);
      return serializeMesh(out);
    }
    case 'removeDuplicateFaces': {
      const mesh = deserializeMesh(p.mesh);
      return serializeMesh(Repair.removeDuplicateFaces(MeshLib.removeDegenerate(mesh)));
    }
    case 'normals': {
      const mesh = deserializeMesh(p.mesh);
      MeshLib.computeVertexNormals(mesh);
      return serializeMesh(mesh);
    }
    case 'flipNormals': {
      const mesh = deserializeMesh(p.mesh);
      if (mesh.normals) for (let i = 0; i < mesh.normals.length; i++) mesh.normals[i] = -mesh.normals[i];
      return serializeMesh(MeshLib.flipWinding(mesh));
    }
    case 'decimate': {
      const mesh = deserializeMesh(p.mesh);
      const out = decimate(mesh, p.ratio, progress);
      return serializeMesh(out);
    }
    case 'merge': {
      const meshes = p.meshes.map(deserializeMesh);
      return serializeMesh(MeshLib.mergeMeshes(meshes));
    }
    case 'separate': {
      const mesh = deserializeMesh(p.mesh);
      const parts = MeshLib.splitComponents(mesh, progress);
      return parts.map(serializeMesh);
    }
    case 'deleteFaces': {
      const mesh = deserializeMesh(p.mesh);
      const remove = new Set(p.faces);
      const out = MeshLib.filterFaces(mesh, t => !remove.has(t));
      return serializeMesh(out);
    }
    case 'deleteVertices': {
      const mesh = deserializeMesh(p.mesh);
      const remove = new Set(p.vertices);
      return serializeMesh(MeshLib.removeVertices(mesh, remove));
    }
    case 'hollow': {
      const mesh = deserializeMesh(p.mesh);
      return serializeMesh(Geometry.hollowMesh(mesh, p.thickness, progress));
    }
    case 'addBase': {
      const mesh = deserializeMesh(p.mesh);
      return serializeMesh(Geometry.addBase(mesh, p));
    }
    case 'cut': {
      const mesh = deserializeMesh(p.mesh);
      return serializeMesh(Geometry.cutMesh(mesh, p.plane, p.side, p.cap !== false, progress));
    }
    case 'splitPlane': {
      const mesh = deserializeMesh(p.mesh);
      const [a, b] = Geometry.splitByPlane(mesh, p.plane, progress);
      return [serializeMesh(a), serializeMesh(b)];
    }
    case 'analyze': {
      const mesh = deserializeMesh(p.mesh);
      return Analyze.meshStatistics(mesh);
    }
    case 'manifold': {
      const mesh = deserializeMesh(p.mesh);
      return Analyze.manifoldCheck(mesh);
    }
    case 'volumeArea': {
      const mesh = deserializeMesh(p.mesh);
      return { volume: Analyze.volume(mesh), area: Analyze.surfaceArea(mesh) };
    }
    case 'overhang': {
      const mesh = deserializeMesh(p.mesh);
      return Analyze.overhangAnalysis(mesh, p.thresholdDeg);
    }
    case 'wallThickness': {
      const mesh = deserializeMesh(p.mesh);
      return Analyze.wallThickness(mesh, p.samples || 600, progress);
    }
    case 'printability': {
      const mesh = deserializeMesh(p.mesh);
      return Analyze.printabilityCheck(mesh, p);
    }
    case 'slice': {
      const mesh = deserializeMesh(p.mesh);
      return { polylines: sliceMesh(mesh, p.plane, progress) };
    }
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}
