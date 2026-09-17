// Three.js scene: rendering, display modes, selection picking, measurement,
// cross-section overlay, screenshot. Camera orbit via vendored OrbitControls.
import * as THREE from 'three';
import { OrbitControls } from '/assets/vendor/OrbitControls.js';
import { triangleCount, meshBounds } from '../lib/mesh.js';

export class Viewer {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x14171c);

    this.camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.01, 100000);
    this.camera.position.set(60, 50, 80);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x333944, 0.9);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(1, 2, 1.5);
    this.scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dir2.position.set(-1.5, 0.5, -1);
    this.scene.add(dir2);

    this.grid = new THREE.GridHelper(200, 20, 0x3a4048, 0x23272e);
    this.scene.add(this.grid);
    const axes = new THREE.AxesHelper(20);
    axes.position.y = 0.01;
    this.scene.add(axes);

    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);
    this.helperRoot = new THREE.Group();
    this.scene.add(this.helperRoot);

    this.models = new Map(); // id -> {meshObj, threeMesh, wireMesh, pointsObj, meshData, visible}
    this.displayMode = 'solid';
    this.showWireframe = false;
    this.showVertices = false;

    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(container);

    this.animate();
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  setMesh(id, meshData, opts = {}) {
    let entry = this.models.get(id);
    const geometry = this.buildGeometry(meshData);
    if (!entry) {
      entry = { meshData };
      entry.material = new THREE.MeshStandardMaterial({ color: 0x9aa7ff, metalness: 0.1, roughness: 0.65, side: THREE.DoubleSide });
      entry.threeMesh = new THREE.Mesh(geometry, entry.material);
      entry.wireMesh = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35 }));
      entry.pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xffd54f, size: 2.5 }));
      entry.highlight = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff3355, transparent: true, opacity: 0.85, depthTest: false }));
      entry.highlight.visible = false;
      this.modelRoot.add(entry.threeMesh);
      this.modelRoot.add(entry.wireMesh);
      this.modelRoot.add(entry.pointsObj);
      this.scene.add(entry.highlight);
      this.models.set(id, entry);
    } else {
      entry.meshData = meshData;
      entry.threeMesh.geometry.dispose();
      entry.threeMesh.geometry = geometry;
      entry.wireMesh.geometry.dispose();
      entry.wireMesh.geometry = new THREE.WireframeGeometry(geometry);
      entry.pointsObj.geometry.dispose();
      entry.pointsObj.geometry = geometry;
      entry.highlight.geometry.dispose();
      entry.highlight.geometry = geometry;
    }
    entry.visible = opts.visible !== false;
    entry.threeMesh.visible = entry.visible;
    entry.wireMesh.visible = entry.visible && this.showWireframe;
    entry.pointsObj.visible = entry.visible && this.showVertices;
    this.applyDisplayMode(entry);
    return entry;
  }

  buildGeometry(mesh) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(mesh.positions, 3));
    if (mesh.normals) geometry.setAttribute('normal', new THREE.BufferAttribute(mesh.normals, 3));
    if (mesh.uvs) geometry.setAttribute('uv', new THREE.BufferAttribute(mesh.uvs, 2));
    if (mesh.colors) geometry.setAttribute('color', new THREE.BufferAttribute(mesh.colors, 3));
    if (mesh.indices && mesh.indices.length > 0) geometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1));
    if (!mesh.normals) geometry.computeVertexNormals();
    return geometry;
  }

  setVisible(id, visible) {
    const e = this.models.get(id);
    if (!e) return;
    e.visible = visible;
    e.threeMesh.visible = visible;
    e.wireMesh.visible = visible && this.showWireframe;
    e.pointsObj.visible = visible && this.showVertices;
    e.highlight.visible = false;
  }

  removeModel(id) {
    const e = this.models.get(id);
    if (!e) return;
    this.modelRoot.remove(e.threeMesh, e.wireMesh, e.pointsObj);
    this.scene.remove(e.highlight);
    this.models.delete(id);
  }

  clear() {
    for (const id of [...this.models.keys()]) this.removeModel(id);
  }

  setDisplayMode(mode) {
    this.displayMode = mode;
    for (const e of this.models.values()) this.applyDisplayMode(e);
  }

  applyDisplayMode(entry) {
    const m = entry.threeMesh;
    entry.wireMesh.visible = entry.visible && (this.showWireframe || this.displayMode === 'wireframe');
    entry.pointsObj.visible = entry.visible && this.showVertices;
    switch (this.displayMode) {
      case 'solid':
        m.material = entry.material;
        entry.material.opacity = 1; entry.material.transparent = false;
        m.visible = entry.visible;
        break;
      case 'wireframe':
        m.visible = false;
        break;
      case 'xray':
        m.material = entry.material;
        entry.material.transparent = true;
        entry.material.opacity = 0.25;
        entry.material.depthWrite = false;
        m.visible = entry.visible;
        break;
      case 'normals': {
        if (!entry.normalMat) entry.normalMat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        m.material = entry.normalMat;
        m.visible = entry.visible;
        break;
      }
      case 'vertices':
        m.visible = false;
        entry.pointsObj.visible = entry.visible;
        entry.wireMesh.visible = entry.visible;
        break;
    }
  }

  setWireframe(on) { this.showWireframe = on; for (const e of this.models.values()) this.applyDisplayMode(e); }
  setVertices(on) { this.showVertices = on; for (const e of this.models.values()) this.applyDisplayMode(e); }

  frameAll() {
    const box = new THREE.Box3();
    let has = false;
    for (const e of this.models.values()) {
      if (!e.visible) continue;
      e.threeMesh.geometry.computeBoundingBox();
      box.union(e.threeMesh.geometry.boundingBox);
      has = true;
    }
    if (!has) {
      this.camera.position.set(60, 50, 80);
      this.controls.target.set(0, 0, 0);
      return;
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const dist = maxDim * 2.2;
    const dir = new THREE.Vector3(1, 0.7, 1).normalize();
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.near = maxDim / 1000;
    this.camera.far = maxDim * 100;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.update();
  }

  setView(axis) {
    const box = new THREE.Box3();
    let has = false;
    for (const e of this.models.values()) {
      e.threeMesh.geometry.computeBoundingBox();
      box.union(e.threeMesh.geometry.boundingBox);
      has = true;
    }
    const center = has ? box.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    const size = has ? box.getSize(new THREE.Vector3()) : new THREE.Vector3(10, 10, 10);
    const d = Math.max(size.x, size.y, size.z) * 2.2 || 20;
    const pos = {
      front: [0, 0, 1], back: [0, 0, -1], top: [0, 1, 0], bottom: [0, -1, 0],
      right: [1, 0, 0], left: [-1, 0, 0], iso: [1, 0.7, 1],
    }[axis].map(v => v * d);
    this.camera.position.set(center.x + pos[0], center.y + pos[1], center.z + pos[2]);
    this.controls.target.copy(center);
    this.controls.update();
  }

  // --- picking ---
  pick(ev, pickVertices = false) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 5;
    raycaster.setFromCamera(ndc, this.camera);
    const targets = [];
    for (const e of this.models.values()) {
      if (!e.visible) continue;
      if (pickVertices && e.pointsObj.visible) targets.push({ obj: e.pointsObj, entry: e });
      if (e.threeMesh.visible) targets.push({ obj: e.threeMesh, entry: e });
    }
    if (pickVertices) {
      let best = null;
      for (const t of targets.filter(t => t.obj.type === 'Points')) {
        const hits = raycaster.intersectObject(t.obj, false);
        for (const h of hits) {
          if (!best || h.distance < best.hit.distance) best = { hit: h, entry: t.entry, type: 'vertex' };
        }
      }
      if (best) return best;
    }
    for (const t of targets) {
      const hits = raycaster.intersectObject(t.obj, false);
      if (hits.length > 0) {
        return { hit: hits[0], entry: t.entry, type: 'face' };
      }
    }
    return null;
  }

  // --- selection highlight (faces) ---
  highlightFaces(entry, faceIndices) {
    if (!faceIndices || faceIndices.length === 0) {
      entry.highlight.visible = false;
      return;
    }
    // build a geometry of only the selected faces
    const src = entry.meshData;
    const idx = src.indices;
    const set = new Set(faceIndices);
    const positions = [];
    const fc = triangleCount(src);
    for (let t = 0; t < fc; t++) {
      if (!set.has(t)) continue;
      let ia, ib, ic;
      if (idx) { ia = idx[t * 3] * 3; ib = idx[t * 3 + 1] * 3; ic = idx[t * 3 + 2] * 3; }
      else { ia = t * 9; ib = ia + 3; ic = ia + 6; }
      positions.push(src.positions[ia], src.positions[ia + 1], src.positions[ia + 2]);
      positions.push(src.positions[ib], src.positions[ib + 1], src.positions[ib + 2]);
      positions.push(src.positions[ic], src.positions[ic + 1], src.positions[ic + 2]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    entry.highlight.geometry.dispose();
    entry.highlight.geometry = g;
    entry.highlight.visible = true;
  }

  // --- measurement helpers ---
  clearHelpers() {
    while (this.helperRoot.children.length) {
      const c = this.helperRoot.children.pop();
      c.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    }
    if (this.labelLayer) this.labelLayer.innerHTML = '';
  }

  addMarker(point, color = 0xffd54f) {
    const g = new THREE.SphereGeometry(Math.max(this.sceneScale() * 0.004, 0.001), 12, 8);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color }));
    m.position.copy(point);
    this.helperRoot.add(m);
    return m;
  }

  addLine(a, b, color = 0x00e5ff) {
    const g = new THREE.BufferGeometry().setFromPoints([a, b]);
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color, depthTest: false }));
    this.helperRoot.add(l);
    return l;
  }

  addLabel(screenPos, text) {
    if (!this.labelLayer) return;
    const el = document.createElement('div');
    el.className = 'measure-label';
    el.textContent = text;
    this.labelLayer.appendChild(el);
    const v = new THREE.Vector3(screenPos.x, screenPos.y, screenPos.z).project(this.camera);
    const rect = this.container.getBoundingClientRect();
    el.style.left = ((v.x + 1) / 2 * rect.width) + 'px';
    el.style.top = ((-v.y + 1) / 2 * rect.height) + 'px';
    return el;
  }

  setLabelLayer(el) { this.labelLayer = el; }

  sceneScale() {
    const box = new THREE.Box3();
    let has = false;
    for (const e of this.models.values()) {
      e.threeMesh.geometry.computeBoundingBox();
      box.union(e.threeMesh.geometry.boundingBox);
      has = true;
    }
    if (!has) return 10;
    return box.getSize(new THREE.Vector3()).length();
  }

  showBoundingBox(on) {
    if (this.bboxHelper) {
      this.bboxHelper.visible = on;
      return;
    }
    const box = new THREE.Box3();
    let has = false;
    for (const e of this.models.values()) {
      e.threeMesh.geometry.computeBoundingBox();
      box.union(e.threeMesh.geometry.boundingBox);
      has = true;
    }
    if (!has) return;
    this.bboxHelper = new THREE.Box3Helper(box, 0xffd54f);
    this.scene.add(this.bboxHelper);
  }

  // cross-section overlay from slice polylines + translucent plane
  showCrossSection(polylines, plane) {
    this.clearCrossSection();
    if (!polylines || polylines.length === 0) return;
    const points = [];
    for (const pl of polylines) {
      for (let i = 0; i < pl.length - 1; i++) {
        points.push(new THREE.Vector3(pl[i][0], pl[i][1], pl[i][2]), new THREE.Vector3(pl[i + 1][0], pl[i + 1][1], pl[i + 1][2]));
      }
    }
    const g = new THREE.BufferGeometry().setFromPoints(points);
    this.crossSectionLines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xff5e7a, depthTest: false }));
    this.helperRoot.add(this.crossSectionLines);
  }

  clearCrossSection() {
    if (this.crossSectionLines) {
      this.helperRoot.remove(this.crossSectionLines);
      this.crossSectionLines.geometry.dispose();
      this.crossSectionLines = null;
    }
  }

  screenshot() {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  setGrid(on) { this.grid.visible = on; }
}
