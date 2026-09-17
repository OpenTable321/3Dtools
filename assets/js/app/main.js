// 3DTools Studio — main app wiring.
// All model processing is local: parsing in this thread (fast typed-array code),
// heavy mesh operations in the meshops web worker.
import * as THREE from 'three';
import { Viewer } from './viewer.js';
import { MeshOpsClient } from './rpc.js';
import { Mesh, serializeMesh, deserializeMesh, cloneMesh, mergeMeshes, meshBounds, triangleCount, computeVertexNormals, rotateMesh, alignToGround } from '../lib/mesh.js';
import { parseSTL } from '../lib/io/stl.js';
import { parseOBJ } from '../lib/io/obj.js';
import { parsePLY } from '../lib/io/ply.js';
import { parseGLB, parseGLTF, exportGLB, exportGLTFJSON } from '../lib/io/gltf.js';
import { parse3MF, export3MF } from '../lib/io/threemf.js';
import { exportSTLBinary, exportSTLAscii } from '../lib/io/stl.js';
import { exportOBJ } from '../lib/io/obj.js';
import { exportPLY } from '../lib/io/ply.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const viewer = new Viewer($('#canvasWrap'));
viewer.setLabelLayer($('#labelLayer'));
const ops = new MeshOpsClient('/assets/js/app/workers/meshops.worker.js');

// ---------- state ----------
const state = {
  models: new Map(), // id -> { name, mesh, format, visible }
  activeId: null,
  nextId: 1,
  selection: new Map(), // id -> Set(faceIndex|vertexIndex)
  selMode: 'face',
  measureMode: null,
  measurePoints: [],
};

// ---------- status ----------
let statusTimer = null;
function setStatus(msg, sticky = false) {
  $('#statusMsg').textContent = msg;
  clearTimeout(statusTimer);
  if (!sticky) statusTimer = setTimeout(() => { $('#statusMsg').textContent = 'Ready.'; }, 6000);
}
function setProgress(p) {
  const bar = $('#progressBar');
  if (p === null || p >= 1) {
    bar.classList.remove('active');
    $('#progressFill').style.width = '0%';
  } else {
    bar.classList.add('active');
    $('#progressFill').style.width = Math.round(p * 100) + '%';
  }
}
const progress = (p) => setProgress(p);

// ---------- loading ----------
const FORMAT_BY_EXT = {
  stl: 'stl', obj: 'obj', ply: 'ply', glb: 'glb', gltf: 'gltf', '3mf': '3mf', bin: 'gltf-bin',
};

async function loadFiles(fileList) {
  const files = [...fileList];
  const binFiles = [];
  for (const f of files) {
    if (f.name.toLowerCase().endsWith('.bin')) binFiles.push({ name: f.name, data: await f.arrayBuffer() });
  }
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.bin')) continue;
    const ext = file.name.split('.').pop().toLowerCase();
    const format = FORMAT_BY_EXT[ext];
    if (!format) {
      setStatus(`Unsupported file type: ${file.name}`, true);
      continue;
    }
    try {
      setStatus(`Loading ${file.name}…`, true);
      const buffer = await file.arrayBuffer();
      const meshes = await parseBuffer(buffer, format, file.name, binFiles);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      meshes.forEach((m, i) => {
        const label = meshes.length > 1 ? `${baseName}:${m.name || (i + 1)}` : baseName;
        addModel(m, label, format);
      });
      setStatus(`Loaded ${file.name} — ${meshes.length} object(s), ${triangleCount(meshes[0]).toLocaleString()}+ triangles.`);
    } catch (err) {
      console.error(err);
      setStatus(`Error loading ${file.name}: ${err.message}`, true);
    }
  }
  refreshTabs();
  viewer.frameAll();
}

async function parseBuffer(buffer, format, fileName, binFiles = []) {
  switch (format) {
    case 'stl': return [parseSTL(buffer, fileName)];
    case 'obj': return parseOBJ(new TextDecoder().decode(buffer), fileName.replace(/\.[^.]+$/, ''));
    case 'ply': return parsePLY(buffer, fileName.replace(/\.[^.]+$/, ''));
    case 'glb': return parseGLB(buffer, fileName.replace(/\.[^.]+$/, ''));
    case 'gltf': return parseGLTF(new TextDecoder().decode(buffer), binFiles, fileName.replace(/\.[^.]+$/, ''));
    case '3mf': return await parse3MF(buffer, fileName.replace(/\.[^.]+$/, ''));
    default: throw new Error(`Unknown format: ${format}`);
  }
}

function addModel(mesh, name, format) {
  if (!mesh.normals) computeVertexNormals(mesh);
  const id = state.nextId++;
  state.models.set(id, { name, mesh, format, visible: true });
  state.selection.set(id, new Set());
  state.activeId = id;
  viewer.setMesh(id, mesh);
  $('#emptyState').style.display = 'none';
}

function refreshTabs() {
  const tabs = $('#modelTabs');
  tabs.innerHTML = '';
  for (const [id, m] of state.models) {
    const el = document.createElement('button');
    el.className = 'model-tab' + (id === state.activeId ? ' active' : '');
    el.textContent = m.name;
    el.title = `${m.format.toUpperCase()} — ${triangleCount(m.mesh).toLocaleString()} triangles`;
    el.onclick = () => { state.activeId = id; refreshTabs(); };
    el.oncontextmenu = (e) => {
      e.preventDefault();
      removeModel(id);
    };
    tabs.appendChild(el);
  }
  updateStats();
}

function removeModel(id) {
  state.models.delete(id);
  state.selection.delete(id);
  viewer.removeModel(id);
  if (state.activeId === id) state.activeId = state.models.keys().next().value || null;
  refreshTabs();
  if (state.models.size === 0) $('#emptyState').style.display = 'flex';
}

function activeModel() {
  return state.models.get(state.activeId);
}

function activeMesh() {
  const m = activeModel();
  return m ? m.mesh : null;
}

function replaceActiveMesh(mesh, keepSelection = false) {
  const m = activeModel();
  if (!m) return;
  m.mesh = mesh;
  viewer.setMesh(state.activeId, mesh);
  if (!keepSelection) { state.selection.set(state.activeId, new Set()); viewer.highlightFaces(viewer.models.get(state.activeId), []); }
  refreshTabs();
}

function updateStats() {
  const m = activeModel();
  if (!m) { $('#statusStats').textContent = ''; return; }
  $('#statusStats').textContent = `${m.format.toUpperCase()} · ${m.mesh.positions.length / 3 | 0} verts · ${triangleCount(m.mesh).toLocaleString()} tris`;
}

// ---------- worker op runner ----------
async function runOp(op, payload, label) {
  const m = activeModel();
  if (!m) { setStatus('Load a model first.', true); throw new Error('no model'); }
  setStatus(label + '…', true);
  setProgress(0);
  try {
    const result = await ops.run(op, payload, progress);
    setProgress(null);
    return result;
  } catch (err) {
    setProgress(null);
    setStatus(`${label} failed: ${err.message}`, true);
    throw err;
  }
}

const meshPayload = (mesh) => serializeMesh(mesh);

// ---------- file input & drag/drop ----------
$('#btnOpen').onclick = () => $('#fileInput').click();
$('#fileInput').onchange = (e) => { loadFiles(e.target.files); e.target.value = ''; };
const wrap = $('#canvasWrap');
['dragenter', 'dragover'].forEach(ev => wrap.addEventListener(ev, (e) => { e.preventDefault(); wrap.classList.add('dragging'); }));
['dragleave', 'drop'].forEach(ev => wrap.addEventListener(ev, (e) => { e.preventDefault(); wrap.classList.remove('dragging'); }));
wrap.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) loadFiles(e.dataTransfer.files); });
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => e.preventDefault());

$('#btnClear').onclick = () => {
  viewer.clear();
  state.models.clear();
  state.selection.clear();
  state.activeId = null;
  refreshTabs();
  $('#emptyState').style.display = 'flex';
};

$('#btnFrame').onclick = () => viewer.frameAll();
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === 'f' || e.key === 'F') viewer.frameAll();
});

// ---------- sample model ----------
$('#btnSample').onclick = () => {
  const mesh = makeSampleModel();
  addModel(mesh, 'sample-knot', 'generated');
  refreshTabs();
  viewer.frameAll();
  setStatus('Loaded built-in sample model (parametric torus knot, generated locally).');
};

function makeSampleModel() {
  // torus knot: p=2, q=3, R=20, r=6, tube=2 — real geometry, generated on the fly
  const P = 2, Q = 3, R = 22, r = 8, tube = 3;
  const SEG = 200, TSEG = 24;
  const positions = [];
  const indices = [];
  function knotPoint(t) {
    const cu = Math.cos(Q * t), su = Math.sin(Q * t);
    const qu = Q * t, Rr = R + r * cu;
    return [Rr * Math.cos(qu), Rr * Math.sin(qu), r * su];
  }
  for (let i = 0; i < SEG; i++) {
    const t = (i / SEG) * Math.PI * 2;
    const t2 = ((i + 1) / SEG) * Math.PI * 2;
    const p = knotPoint(t);
    // frame
    const pNext = knotPoint(t2);
    let tx = pNext[0] - p[0], ty = pNext[1] - p[1], tz = pNext[2] - p[2];
    const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
    // normal ~ derivative direction approximations
    let nx = p[0] * -Math.sin(Q * t) * Q - r * Math.sin(Q * t) * 0.5, ny = p[1] * Math.cos(Q * t) * Q, nz = 0;
    let nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    // binormal
    let bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
    const bl = Math.hypot(bx, by, bz) || 1; bx /= bl; by /= bl; bz /= bl;
    for (let j = 0; j < TSEG; j++) {
      const a = (j / TSEG) * Math.PI * 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      positions.push(
        p[0] + (nx * ca + bx * sa) * tube,
        p[1] + (ny * ca + by * sa) * tube,
        p[2] + (nz * ca + bz * sa) * tube,
      );
    }
  }
  for (let i = 0; i < SEG; i++) {
    for (let j = 0; j < TSEG; j++) {
      const a = i * TSEG + j;
      const b = i * TSEG + (j + 1) % TSEG;
      const c = ((i + 1) % SEG) * TSEG + (j + 1) % TSEG;
      const d = ((i + 1) % SEG) * TSEG + j;
      indices.push(a, b, c, a, c, d);
    }
  }
  const mesh = new Mesh({ name: 'torus-knot', positions: new Float32Array(positions), indices: new Uint32Array(indices) });
  computeVertexNormals(mesh);
  return mesh;
}

// ---------- panel tabs ----------
$$('.panel-tab').forEach(tab => {
  tab.onclick = () => selectTab(tab.dataset.tab);
});
function selectTab(name) {
  $$('.panel-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.tab-pane').forEach(p => p.hidden = p.dataset.pane !== name);
}

// ---------- view controls ----------
$('#displayMode').onchange = (e) => viewer.setDisplayMode(e.target.value);
$('#chkWireOverlay').onchange = (e) => viewer.setWireframe(e.target.checked);
$('#chkVertices').onchange = (e) => viewer.setVertices(e.target.checked);
$('#chkGrid').onchange = (e) => viewer.setGrid(e.target.checked);
$('#chkBBox').onchange = (e) => viewer.showBoundingBox(e.target.checked);
$$('[data-view]').forEach(b => b.onclick = () => viewer.setView(b.dataset.view));
$('#btnScreenshot').onclick = () => {
  const url = viewer.screenshot();
  const a = document.createElement('a');
  a.href = url;
  a.download = '3dtools-screenshot.png';
  a.click();
  setStatus('Screenshot saved.');
};

// ---------- transform ----------
$('#btnScaleUniform').onclick = () => applyTransform({ scale: [f('#scaleFactor'), f('#scaleFactor'), f('#scaleFactor')] }, 'Scaled');
$('#btnScaleAxis').onclick = () => applyTransform({ scale: [f('#scaleX'), f('#scaleY'), f('#scaleZ')] }, 'Scaled');
$$('[data-rot]').forEach(b => b.onclick = () => applyTransform({ rotate: [{ axis: b.dataset.rot, radians: Math.PI / 2 }] }, 'Rotated'));
$('#btnRotate').onclick = () => applyTransform({ rotate: [{ axis: $('#rotAxis').value, radians: f('#rotDeg') * Math.PI / 180 }] }, 'Rotated');
$$('[data-mirror]').forEach(b => b.onclick = () => applyTransform({ mirror: b.dataset.mirror }, 'Mirrored'));
$('#btnCenter').onclick = () => applyTransform({ center: true }, 'Centered');
$('#btnCenterGround').onclick = () => applyTransform({ center: true, dropToGround: true }, 'Centered');
$('#btnAlignGround').onclick = () => applyTransform({ alignGround: true }, 'Aligned');

function f(sel) { return parseFloat($(sel).value) || 0; }

async function applyTransform(t, label) {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  try {
    const result = await runOp('transform', { mesh: meshPayload(activeMesh()), ...t }, label);
    replaceActiveMesh(deserializeMesh(result));
    setStatus(label + '.');
  } catch (e) { /* status already set */ }
  viewer.frameAll();
}

// ---------- repair ----------
$('#btnRepair').onclick = () => opReplacesMesh('repair', { tolerance: f('#repairTol') }, 'Repairing mesh');
$('#btnWeld').onclick = () => opReplacesMesh('weld', { tolerance: f('#weldTol') }, 'Removing duplicate vertices');
$('#btnDupFaces').onclick = () => opReplacesMesh('removeDuplicateFaces', {}, 'Removing duplicate faces');
$('#btnNormals').onclick = () => opReplacesMesh('normals', {}, 'Recalculating normals');
$('#btnFlipNormals').onclick = () => opReplacesMesh('flipNormals', {}, 'Flipping normals');

async function opReplacesMesh(op, extra, label) {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  try {
    const result = await runOp(op, { mesh: meshPayload(activeMesh()), ...extra }, label);
    replaceActiveMesh(deserializeMesh(result));
    setStatus(label + ' — done.');
  } catch (e) { /* status set */ }
}

// ---------- edit ----------
$('#simplifyRange').oninput = (e) => $('#simplifyVal').textContent = e.target.value + '%';
$('#btnSimplify').onclick = () => {
  const ratio = parseInt($('#simplifyRange').value, 10) / 100;
  opReplacesMesh('decimate', { ratio }, `Decimating to ${Math.round(ratio * 100)}%`);
};

$('#btnHollow').onclick = () => opReplacesMesh('hollow', { thickness: f('#hollowThickness') }, 'Hollowing model');
$('#btnBase').onclick = () => opReplacesMesh('addBase', { thickness: f('#baseThickness'), margin: f('#baseMargin') }, 'Adding base');

function cutPlaneFromUI() {
  const axis = $('#cutAxis').value;
  const b = meshBounds(activeMesh());
  const pct = parseInt($('#cutPos').value, 10) / 100;
  const v = b.min[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] + (b.max[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] - b.min[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]) * pct;
  $('#cutVal').textContent = pct * 100 + '%';
  return { axis, value: v };
}
$('#btnCutAbove').onclick = () => opReplacesMesh('cut', { plane: cutPlaneFromUI(), side: 'above', cap: $('#cutCap').checked }, 'Cutting (keeping above plane)');
$('#btnCutBelow').onclick = () => opReplacesMesh('cut', { plane: cutPlaneFromUI(), side: 'below', cap: $('#cutCap').checked }, 'Cutting (keeping below plane)');
$('#btnSplit').onclick = async () => {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  try {
    const result = await runOp('splitPlane', { mesh: meshPayload(activeMesh()), plane: cutPlaneFromUI() }, 'Splitting by plane');
    const [top, bottom] = result.map(deserializeMesh);
    const m = activeModel();
    removeModel(state.activeId);
    addModel(computeNormalsIfMissing(top), top.name, m.format);
    addModel(computeNormalsIfMissing(bottom), bottom.name, m.format);
    refreshTabs();
    viewer.frameAll();
    setStatus('Split into two models (see model tabs; right-click a tab to remove it).');
  } catch (e) { /* status set */ }
};

function computeNormalsIfMissing(mesh) {
  if (!mesh.normals) computeVertexNormals(mesh);
  return mesh;
}

$('#btnSeparate').onclick = async () => {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  try {
    const parts = await runOp('separate', { mesh: meshPayload(activeMesh()) }, 'Separating objects');
    if (parts.length <= 1) {
      setStatus('Mesh is a single connected object — nothing to separate.');
      return;
    }
    const m = activeModel();
    removeModel(state.activeId);
    parts.map(deserializeMesh).forEach((p, i) => addModel(computeNormalsIfMissing(p), `${m.name}_part${i + 1}`, m.format));
    refreshTabs();
    viewer.frameAll();
    setStatus(`Separated into ${parts.length} objects.`);
  } catch (e) { /* status set */ }
};

$('#btnMerge').onclick = async () => {
  if (state.models.size < 2) return setStatus('Load at least two models to merge.', true);
  try {
    const meshes = [...state.models.values()].map(m => m.mesh);
    const result = await runOp('merge', { meshes: meshes.map(serializeMesh) }, 'Merging models');
    const fmt = activeModel().format;
    viewer.clear();
    state.models.clear();
    state.selection.clear();
    addModel(deserializeMesh(result), 'merged', fmt);
    refreshTabs();
    viewer.frameAll();
    setStatus('Merged all models into one.');
  } catch (e) { /* status set */ }
};

// selection
$$('input[name="selMode"]').forEach(r => r.onchange = () => state.selMode = r.value);
$('#btnSelClear').onclick = () => {
  for (const [id] of state.models) {
    state.selection.set(id, new Set());
    const e = viewer.models.get(id);
    if (e) viewer.highlightFaces(e, []);
  }
};
$('#btnDeleteFaces').onclick = () => deleteSelection('deleteFaces', 'faces');
$('#btnDeleteVerts').onclick = () => deleteSelection('deleteVertices', 'vertices');

async function deleteSelection(op, what) {
  const sel = state.selection.get(state.activeId);
  if (!sel || sel.size === 0) return setStatus(`Ctrl+Click ${what} in the viewport to select them first.`, true);
  const ids = op === 'deleteFaces' ? [...sel] : [...sel];
  try {
    const result = await runOp(op, { mesh: meshPayload(activeMesh()), [op === 'deleteFaces' ? 'faces' : 'vertices']: ids }, `Deleting ${what}`);
    replaceActiveMesh(deserializeMesh(result));
    setStatus(`Deleted ${ids.length} ${what}.`);
  } catch (e) { /* status set */ }
}

// ---------- analyze ----------
const resultsEl = $('#analyzeResults');
function showResults(title, rows) {
  resultsEl.innerHTML = '';
  const h = document.createElement('h4');
  h.textContent = title;
  resultsEl.appendChild(h);
  const t = document.createElement('table');
  for (const [k, v, cls] of rows) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td'); td1.textContent = k;
    const td2 = document.createElement('td'); td2.innerHTML = v;
    if (cls) td2.className = cls;
    tr.append(td1, td2);
    t.appendChild(tr);
  }
  resultsEl.appendChild(t);
}

function fmtNum(n, digits = 2) {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return n.toFixed(digits);
}

$('#btnStats').onclick = async () => {
  if (!activeMesh()) return;
  const s = await runOp('analyze', { mesh: meshPayload(activeMesh()) }, 'Computing statistics');
  showResults('Mesh Statistics', [
    ['Vertices', s.vertices.toLocaleString()],
    ['Triangles', s.triangles.toLocaleString()],
    ['Size X', fmtNum(s.bounds.size[0]) + ' units'],
    ['Size Y', fmtNum(s.bounds.size[1]) + ' units'],
    ['Size Z', fmtNum(s.bounds.size[2]) + ' units'],
    ['Indexed', s.indexed ? 'yes' : 'no (triangle soup)'],
    ['Normals', s.hasNormals ? 'present' : 'missing'],
    ['UVs', s.hasUVs ? 'present' : 'missing'],
  ]);
  viewer.showBoundingBox(true);
  $('#chkBBox').checked = true;
  setStatus('Statistics computed. Bounding box shown in viewport.');
};

$('#btnVolume').onclick = async () => {
  if (!activeMesh()) return;
  const r = await runOp('volumeArea', { mesh: meshPayload(activeMesh()) }, 'Computing volume & area');
  const unit = 'units³';
  showResults('Volume & Surface Area', [
    ['Volume', fmtNum(r.volume) + ' ' + unit],
    ['Surface area', fmtNum(r.area) + ' units²'],
    ['Volume (if mm)', fmtNum(r.volume / 1000) + ' cm³'],
    ['Note', 'Volume assumes a watertight mesh'],
  ]);
};

$('#btnManifold').onclick = async () => {
  if (!activeMesh()) return;
  const r = await runOp('manifold', { mesh: meshPayload(activeMesh()) }, 'Checking manifold');
  showResults('Manifold Check', [
    ['Watertight', r.watertight ? 'yes' : 'no', r.watertight ? 'ok' : 'err'],
    ['Boundary edges', String(r.boundaryEdges), r.boundaryEdges === 0 ? 'ok' : 'err'],
    ['Non-manifold edges', String(r.nonManifoldEdges), r.nonManifoldEdges === 0 ? 'ok' : 'err'],
    ['Non-manifold vertices', String(r.nonManifoldVertices), r.nonManifoldVertices === 0 ? 'ok' : 'warn'],
  ]);
  setStatus(r.watertight ? 'Mesh is watertight/manifold.' : 'Mesh is NOT watertight — see details.', true);
};

$('#btnOverhang').onclick = async () => {
  if (!activeMesh()) return;
  const deg = parseFloat($('#overhangDeg').value) || 45;
  const r = await runOp('overhang', { mesh: meshPayload(activeMesh()), thresholdDeg: deg }, 'Detecting overhangs');
  const entry = viewer.models.get(state.activeId);
  const flagged = [];
  for (let i = 0; i < r.flagged.length; i++) if (r.flagged[i]) flagged.push(i);
  viewer.highlightFaces(entry, flagged);
  showResults('Overhang Detection', [
    ['Threshold', `> ${deg}° from vertical`],
    ['Overhanging faces', r.overhangFaces.toLocaleString(), r.overhangFaces > 0 ? 'warn' : 'ok'],
    ['Overhanging area', fmtNum(r.overhangArea) + ' units²', r.overhangPercent > 0 ? 'warn' : 'ok'],
    ['Total area', fmtNum(r.totalArea) + ' units²'],
    ['Overhang %', fmtNum(r.overhangPercent, 1) + '%', r.overhangPercent > 5 ? 'warn' : 'ok'],
  ]);
  setStatus(`Overhang analysis done — ${r.overhangPercent.toFixed(1)}% of surface flagged (highlighted red).`, true);
};

$('#btnWall').onclick = async () => {
  if (!activeMesh()) return;
  const r = await runOp('wallThickness', { mesh: meshPayload(activeMesh()), samples: 600 }, 'Checking wall thickness (ray sampling)');
  const thin = r.samples.filter(s => s.thickness < 1).length;
  showResults('Wall Thickness (approximate)', [
    ['Method', 'inward ray sampling (approximation)'],
    ['Samples', String(r.samples.length)],
    ['Minimum', fmtNum(r.min) + ' units', r.min < 1 ? 'err' : 'ok'],
    ['Average', fmtNum(r.avg) + ' units'],
    ['Maximum', fmtNum(r.max) + ' units'],
    ['Thin spots (< 1 unit)', String(thin), thin > 0 ? 'warn' : 'ok'],
  ]);
  setStatus('Wall thickness check done (approximate — see limitations).', true);
};

$('#btnPrintability').onclick = async () => {
  if (!activeMesh()) return;
  const r = await runOp('printability', { mesh: meshPayload(activeMesh()) }, 'Running printability check');
  const rows = [];
  for (const i of r.issues) rows.push(['Issue', escapeHtml(i), 'err']);
  for (const w of r.warnings) rows.push(['Warning', escapeHtml(w), 'warn']);
  for (const n of r.info) rows.push(['Info', escapeHtml(n), 'ok']);
  rows.push(['Triangles', r.stats.triangles.toLocaleString()]);
  rows.push(['Volume', fmtNum(r.stats.volume) + ' units³']);
  showResults('Printability Check', rows);
  setStatus(r.issues.length ? `${r.issues.length} issue(s) found — see results.` : 'Printability check passed.', true);
};

function escapeHtml(s) {
  const AMP = '\u0026', LT = '\u003c', GT = '\u003e';
  return String(s).split(AMP).join(AMP + 'amp;').split(LT).join(AMP + 'lt;').split(GT).join(AMP + 'gt;');
}

// orientation
$('#btnOrient').onclick = () => {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  const mesh = activeMesh();
  if ($('#chkAutoOrient').checked) autoOrientFlat(mesh);
  alignToGround(mesh);
  viewer.setMesh(state.activeId, mesh);
  setStatus($('#chkAutoOrient').checked
    ? 'Auto-oriented: largest face normal aimed down (approximation), then dropped to ground.'
    : 'Model dropped to ground (z=0).');
};

function autoOrientFlat(mesh) {
  // dominant direction = quantized face normal with the largest total area
  const p = mesh.positions;
  const idx = mesh.indices;
  const fc = triangleCount(mesh);
  const buckets = new Map();
  const step = Math.PI / 18; // 10 degrees
  for (let t = 0; t < fc; t++) {
    let ia, ib, ic;
    if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
    else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const vx = p[ic] - p[ia], vy = p[ic + 1] - p[ia + 1], vz = p[ic + 2] - p[ia + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    if (l === 0) continue;
    nx /= l; ny /= l; nz /= l;
    const area = l / 2;
    const q = [nx, ny, nz].map(v => Math.round(v / step));
    const key = q.join(',');
    buckets.set(key, (buckets.get(key) || 0) + area);
  }
  let best = null, bestArea = -1;
  for (const [key, area] of buckets) {
    if (area > bestArea) { bestArea = area; best = key.split(',').map(Number); }
  }
  if (!best) return;
  let [nx, ny, nz] = best.map(v => v * step);
  const nl = Math.hypot(nx, ny, nz) || 1;
  nx /= nl; ny /= nl; nz /= nl;
  // rotate so this normal points down (-Z)
  const target = [0, 0, -1];
  rotateOnto(mesh, [nx, ny, nz], target);
}

function rotateOnto(mesh, from, to) {
  // Rodrigues rotation from -> to
  let [fx, fy, fz] = from;
  let [tx, ty, tz] = to;
  let cx = fy * tz - fz * ty, cy = fz * tx - fx * tz, cz = fx * ty - fy * tx;
  const cl = Math.hypot(cx, cy, cz);
  const dot = fx * tx + fy * ty + fz * tz;
  if (cl < 1e-9) {
    if (dot > 0) return; // already aligned
    // 180° around any perpendicular axis
    cx = 1; cy = 0; cz = 0;
    const angle = Math.PI;
    rotateMesh(mesh, 'x', angle);
    return;
  }
  const angle = Math.atan2(cl, dot);
  // rotation axis (cx,cy,cz) normalized
  cx /= cl; cy /= cl; cz /= cl;
  // build rotation matrix and apply manually (mesh.js rotateMesh only does axis-aligned)
  applyAxisAngle(mesh, [cx, cy, cz], angle);
}

function applyAxisAngle(mesh, axis, angle) {
  const [ax, ay, az] = axis;
  const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
  const m00 = t * ax * ax + c, m01 = t * ax * ay - s * az, m02 = t * ax * az + s * ay;
  const m10 = t * ax * ay + s * az, m11 = t * ay * ay + c, m12 = t * ay * az - s * ax;
  const m20 = t * ax * az - s * ay, m21 = t * ay * az + s * ax, m22 = t * az * az + c;
  const p = mesh.positions;
  for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    p[i] = m00 * x + m01 * y + m02 * z;
    p[i + 1] = m10 * x + m11 * y + m12 * z;
    p[i + 2] = m20 * x + m21 * y + m22 * z;
  }
  computeVertexNormals(mesh);
}

// cross section
$('#slicePos').oninput = (e) => $('#sliceVal').textContent = e.target.value + '%';
$('#btnSlice').onclick = async () => {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  const axis = $('#sliceAxis').value;
  const b = meshBounds(activeMesh());
  const ai = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  const pct = parseInt($('#slicePos').value, 10) / 100;
  const value = b.min[ai] + (b.max[ai] - b.min[ai]) * pct;
  const r = await runOp('slice', { mesh: meshPayload(activeMesh()), plane: { axis, value } }, 'Computing cross section');
  viewer.showCrossSection(r.polylines, { axis, value });
  const totalLen = r.polylines.reduce((s, pl) => s + pl.length, 0);
  setStatus(`Cross section: ${r.polylines.length} contour(s), ${totalLen.toLocaleString()} points (shown in red).`, true);
};
$('#btnSliceClear').onclick = () => viewer.clearCrossSection();

// measure
$('#btnMeasureDist').onclick = () => {
  state.measureMode = 'distance';
  state.measurePoints = [];
  viewer.clearHelpers();
  setStatus('Measure distance: click two points on the model.', true);
};
$('#btnMeasureAngle').onclick = () => {
  state.measureMode = 'angle';
  state.measurePoints = [];
  viewer.clearHelpers();
  setStatus('Measure angle: click three points (vertex B is the angle corner).', true);
};
$('#btnMeasureClear').onclick = () => {
  state.measureMode = null;
  state.measurePoints = [];
  viewer.clearHelpers();
};

// ---------- viewport picking ----------
let downPos = null;
viewer.renderer.domElement.addEventListener('pointerdown', (e) => { downPos = [e.clientX, e.clientY]; });
viewer.renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downPos) return;
  const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
  downPos = null;
  if (moved > 4) return; // was a drag/orbit
  if (e.button !== 0) return;

  if (state.measureMode) return handleMeasureClick(e);
  if (e.ctrlKey || e.metaKey) return handleSelectionClick(e);
});

function handleMeasureClick(e) {
  const hit = viewer.pick(e, false);
  if (!hit || hit.type !== 'face') return;
  const pt = hit.hit.point.clone();
  state.measurePoints.push(pt);
  viewer.addMarker(pt);
  const pts = state.measurePoints;
  if (state.measureMode === 'distance' && pts.length === 2) {
    const d = pts[0].distanceTo(pts[1]);
    viewer.addLine(pts[0], pts[1]);
    viewer.addLabel(pts[0].clone().add(pts[1]).multiplyScalar(0.5), fmtNum(d) + ' units');
    state.measurePoints = [];
  } else if (state.measureMode === 'angle' && pts.length === 3) {
    const [a, b, c] = pts;
    const v1 = a.clone().sub(b).normalize();
    const v2 = c.clone().sub(b).normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180 / Math.PI;
    viewer.addLine(a, b, 0xff5e7a);
    viewer.addLine(b, c, 0xff5e7a);
    viewer.addLabel(b, angle.toFixed(1) + '°');
    state.measurePoints = [];
  }
}

function handleSelectionClick(e) {
  const pickVertices = state.selMode === 'vertex';
  const hit = viewer.pick(e, pickVertices);
  if (!hit) return;
  const id = [...viewer.models.entries()].find(([, entry]) => entry === hit.entry)?.[0];
  if (id === undefined) return;
  const sel = state.selection.get(id);
  let index;
  if (hit.type === 'vertex') {
    index = hit.hit.index;
    const p = hit.entry.meshData.positions;
    const pt = new THREE.Vector3(p[index * 3], p[index * 3 + 1], p[index * 3 + 2]);
    // visual marker
    viewer.addMarker(pt, 0xff3355);
  } else {
    index = hit.hit.faceIndex;
  }
  if (sel.has(index)) sel.delete(index);
  else sel.add(index);
  if (state.selMode === 'face') {
    viewer.highlightFaces(hit.entry, [...sel]);
  }
  setStatus(`Selection: ${sel.size} ${state.selMode}(s).`, true);
}

// ---------- export ----------
const EXPORT_NOTES = {
  stl: 'Binary STL. Single solid, no colors/UVs. Best for 3D printing and CAD interchange. Units are assumed to be millimeters.',
  'stl-ascii': 'ASCII (text) STL. Same geometry as binary STL but ~5× larger. Some legacy tools require it.',
  obj: 'Wavefront OBJ. Supports multiple objects, normals and UVs. Materials (MTL) are not exported.',
  ply: 'Binary PLY. Single mesh with normals/UVs if present.',
  'ply-ascii': 'ASCII PLY. Text format, larger files.',
  glb: 'glTF 2.0 binary. Modern web standard; supports multiple meshes, normals, UVs.',
  gltf: 'glTF 2.0 JSON with base64-embedded buffer. Human-readable glTF.',
  '3mf': '3MF. Modern 3D-printing format; multiple objects, XML+ZIP package, units in millimeters.',
};
$('#exportFormat').onchange = (e) => { $('#exportNotes').textContent = EXPORT_NOTES[e.target.value] || ''; };
$('#exportNotes').textContent = EXPORT_NOTES.stl;

$('#btnDownload').onclick = async () => {
  if (!activeMesh()) return setStatus('Load a model first.', true);
  const format = $('#exportFormat').value;
  const useAll = $('#chkExportAll').checked && state.models.size > 1;
  const meshes = useAll ? [...state.models.values()].map(m => m.mesh) : [activeMesh()];
  const baseName = useAll ? '3dtools-models' : activeModel().name.replace(/[^\w\-]+/g, '_');
  try {
    setStatus('Converting…', true);
    setProgress(0);
    await new Promise(r => setTimeout(r, 20)); // let the UI paint
    let blob, filename;
    if (format === 'stl') { blob = new Blob([exportSTLBinary(pickOne(meshes, useAll))], { type: 'model/stl' }); filename = baseName + '.stl'; }
    else if (format === 'stl-ascii') { blob = new Blob([exportSTLAscii(pickOne(meshes, useAll))], { type: 'text/plain' }); filename = baseName + '.stl'; }
    else if (format === 'obj') { blob = new Blob([exportOBJ(meshes)], { type: 'text/plain' }); filename = baseName + '.obj'; }
    else if (format === 'ply') { blob = new Blob([exportPLY(pickOne(meshes, useAll))], { type: 'application/octet-stream' }); filename = baseName + '.ply'; }
    else if (format === 'ply-ascii') { blob = new Blob([exportPLY(pickOne(meshes, useAll), { binary: false })], { type: 'text/plain' }); filename = baseName + '.ply'; }
    else if (format === 'glb') { blob = new Blob([exportGLB(meshes)], { type: 'model/gltf-binary' }); filename = baseName + '.glb'; }
    else if (format === 'gltf') { blob = new Blob([exportGLTFJSON(meshes)], { type: 'model/gltf+json' }); filename = baseName + '.gltf'; }
    else if (format === '3mf') { blob = new Blob([await export3MF(meshes)], { type: 'model/3mf' }); filename = baseName + '.3mf'; }
    setProgress(null);
    downloadBlob(blob, filename);
    setStatus(`Converted and downloaded ${filename} (${(blob.size / 1024).toFixed(1)} KB). No data left your device.`);
  } catch (err) {
    setProgress(null);
    setStatus('Conversion failed: ' + err.message, true);
  }
};

function pickOne(meshes, multi) {
  return multi ? mergeMeshes(meshes) : meshes[0];
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

// ---------- deep-link ?tool= ----------
(function initFromQuery() {
  const params = new URLSearchParams(location.search);
  const tool = (params.get('tool') || '').toLowerCase();
  if (!tool) return;
  const map = [
    [/viewer|wireframe|x-?ray|normal|vertex/, 'view'],
    [/scale|rotate|mirror|center|align/, 'transform'],
    [/repair|dedup|duplicate|normals/, 'repair'],
    [/simplify|decimate|hollow|base|cut|split|separate|merge|delete/, 'edit'],
    [/print|manifold|wall|overhang|volume|statistic|orient|section|measure|check/, 'analyze'],
    [/to-|convert|export/, 'export'],
  ];
  for (const [re, tab] of map) {
    if (re.test(tool)) { selectTab(tab); return; }
  }
})();

selectTab('view');
setStatus('Ready — open a file or load the sample model.');
