// Viewer and converter landing pages.
export const SITE_URL = 'https://3dtools.example';

const REL_CONVERT = [
  ['/convert/stl-to-obj.html', 'STL to OBJ Converter', 'Turn a triangle-only STL into an OBJ with vertices, normals and groups.'],
  ['/convert/obj-to-stl.html', 'OBJ to STL Converter', 'Prepare OBJ models for 3D printing by converting to watertight-ready STL.'],
  ['/convert/stl-to-3mf.html', 'STL to 3MF Converter', 'Wrap STL geometry in the modern 3MF printing package.'],
  ['/convert/glb-to-obj.html', 'GLB to OBJ Converter', 'Extract editable OBJ geometry from binary glTF assets.'],
];
const REL_VIEWER = [
  ['/viewer/stl-viewer.html', 'STL Viewer', 'Inspect binary and ASCII STL files with wireframe, x-ray and section views.'],
  ['/viewer/obj-viewer.html', 'OBJ Viewer', 'View OBJ files with per-object tabs and normal inspection.'],
  ['/viewer/glb-gltf-viewer.html', 'GLB/GLTF Viewer', 'Load glTF 2.0 assets and inspect every mesh locally.'],
  ['/viewer/ply-viewer.html', 'PLY Viewer', 'View ASCII and binary PLY meshes, including point clouds.'],
];

function viewerPage({ path, slug, name, formats, intro, more, faq }) {
  return {
    path,
    title: `${name} — Free Online ${name} (No Upload) | 3DTools`,
    description: `Free browser-based ${name}. Open ${formats} files instantly, inspect geometry, measure and convert — files are processed locally and never uploaded.`,
    h1: name,
    intro: `<p>${intro}</p><p>Everything runs locally in your browser using WebGL. Your file is never uploaded to a server, and the viewer works with files of many megabytes. If a file cannot be parsed, you get a clear error message instead of a silently blank screen.</p>`,
    cta: { href: `/app.html?tool=${slug}-viewer`, label: `Open the ${name}` },
    crumbs: [['/', 'Home'], ['/tools.html', 'Tools'], [path, name]],
    jsonLdName: `${name} — 3DTools`,
    sections: [
      { id: 'how', h2: `How to view a ${formats.split(' ')[0]} file`, html: `
<ol>
<li>Click <strong>Open the ${name}</strong> above (or open the <a href="/app.html">3DTools Studio</a>).</li>
<li>Drag and drop your file onto the viewport, or click <strong>Open File(s)</strong>.</li>
<li>Orbit with the left mouse button, zoom with the wheel, pan with the right button.</li>
<li>Switch display modes (solid, wireframe, x-ray, normals, vertices) in the <strong>View</strong> tab.</li>
<li>Measure, slice or analyze the model in the <strong>Analyze</strong> tab — or convert it to another format in the <strong>Convert</strong> tab.</li>
</ol>
<p>${more}</p>` },
      { id: 'formats', h2: 'What is supported', html: `
<table class="data">
<tr><th>Feature</th><th>Support</th></tr>
<tr><td>Binary and ASCII variants</td><td>${formats.includes(',') ? 'Both' : 'Yes'}</td></tr>
<tr><td>Solid rendering</td><td>Yes (WebGL, hardware-accelerated)</td></tr>
<tr><td>Wireframe / X-ray / normals / vertices</td><td>Yes</td></tr>
<tr><td>Multiple objects in one file</td><td>Yes — each becomes a separate model tab</td></tr>
<tr><td>Textures and materials</td><td>Geometry is shown; textures are not rendered (color-only materials ignored)</td></tr>
<tr><td>Draco / meshopt compression</td><td>Not supported (rejected with a clear error)</td></tr>
<tr><td>File size</td><td>Limited by your device memory; heavy processing runs in a Web Worker</td></tr>
</table>` },
      { id: 'privacy', h2: 'Privacy by architecture', html: `
<p>This viewer has no upload endpoint at all. The file is read with the browser's <code>FileReader</code> API, parsed in JavaScript and rendered with WebGL — all on your machine. It also works offline once loaded. See the <a href="/privacy.html">privacy policy</a> for details.</p>` },
    ],
    faq,
    related: [...REL_VIEWER, ...REL_CONVERT].filter(r => r[0] !== path).slice(0, 4),
  };
}

export const VIEWER_PAGES = [
  viewerPage({
    path: '/viewer/stl-viewer.html', slug: 'stl', name: 'STL Viewer',
    formats: 'STL',
    intro: 'Open and inspect STL files — the most common format for 3D printing — directly in your browser. Binary and ASCII STL are both detected automatically, and the triangle count, bounding box and manifold status of your model are one click away.',
    more: 'STL stores raw triangles with no colors, units or object names, which makes it easy to parse but hard to organize. The viewer shows you exactly what is in the file: every triangle, vertex and normal. Common STL problems (non-watertight meshes, duplicate faces, flipped normals) can be checked in the Analyze tab and fixed in the Repair tab.',
    faq: [
      ['Is this STL viewer really free?', 'Yes — no account, no watermark, no upload. The viewer is a static web page; your STL file is parsed by JavaScript in your browser.'],
      ['Does it upload my STL file anywhere?', 'No. There is no server component. The page works from a static web host and processes files locally with the File API and WebGL.'],
      ['What is the difference between binary and ASCII STL?', 'Binary STL packs each triangle into 50 bytes and is compact; ASCII STL is human-readable text and roughly 5 times larger. The viewer auto-detects both.'],
      ['My STL shows as inside-out — can I fix that?', 'Yes. Use Repair \u2192 Repair Mesh, which fixes triangle winding and flips inside-out meshes, then re-check with the manifold check.'],
    ],
  }),
  viewerPage({
    path: '/viewer/obj-viewer.html', slug: 'obj', name: 'OBJ Viewer',
    formats: 'OBJ',
    intro: 'View Wavefront OBJ files in your browser. OBJ is the classic interchange format for polygon modeling: it supports multiple named objects, groups, materials references, normals and texture coordinates.',
    more: 'When you load an OBJ file, each object or material group becomes a separate model tab, so you can toggle, transform or export them individually. Polygons with more than three vertices (quads, n-gons) are triangulated on load. Material definitions (.mtl files) are not required for viewing — the geometry renders with a neutral studio material.',
    faq: [
      ['Do I need the .mtl file to view an OBJ?', 'No. The viewer only needs the .obj file. Materials are not rendered; geometry, normals and UVs are.'],
      ['Does it support quads and n-gons?', 'OBJ faces with more than three vertices are automatically fan-triangulated so they render correctly.'],
      ['Can I view several objects in one OBJ?', 'Yes. Every <code>o</code>/<code>g</code> object becomes its own tab in the viewer; you can hide, transform or export them separately.'],
      ['Can I convert the OBJ to STL for printing?', 'Yes — open the Convert tab and choose STL. For best results run the manifold check first.'],
    ],
  }),
  viewerPage({
    path: '/viewer/glb-gltf-viewer.html', slug: 'glb', name: 'GLB / GLTF Viewer',
    formats: 'GLB and GLTF',
    intro: 'Inspect glTF 2.0 assets — the standard 3D format of the web — locally in your browser. GLB (binary glTF) and .gltf JSON files are supported, including multiple meshes, node transforms and both index formats.',
    more: 'The viewer applies each node\u2019s translation, rotation, scale and matrix transforms so models appear assembled as authored. For .gltf files that reference an external .bin buffer, select both files together in the file picker. Note that Draco- or meshopt-compressed assets are rejected with a clear message instead of failing silently, and textures are not rendered (geometry only).',
    faq: [
      ['What is the difference between GLB and glTF?', 'They contain the same data. A .gltf file is a JSON file plus separate binary buffers (and textures); a .glb file packs the JSON and binary data into a single file.'],
      ['Why does my .gltf file fail to load?', 'Most .gltf files reference an external <code>.bin</code> buffer. Select the .gltf and the .bin file together (Ctrl/Cmd-click or multi-select), or use a .glb, which is self-contained.'],
      ['Are textures and PBR materials displayed?', 'No. 3DTools focuses on mesh geometry — vertices, triangles and structure. Materials are preserved in name only when converting between GLB and GLTF.'],
      ['Does it support Draco compression?', 'No. Files that require the Draco or meshopt extensions are detected and rejected with an explanatory error. Re-export the asset without compression.'],
    ],
  }),
  viewerPage({
    path: '/viewer/ply-viewer.html', slug: 'ply', name: 'PLY Viewer',
    formats: 'PLY',
    intro: 'View Stanford PLY meshes in the browser. PLY comes in ASCII, binary little-endian and binary big-endian variants, and is popular in 3D scanning because it stores colors and can hold point clouds without faces.',
    more: 'The viewer auto-detects the encoding from the header. Scanned meshes with vertex colors keep their colors in the viewport. PLY files that contain only vertices (point clouds, no face list) are displayed as points rather than a surface.',
    faq: [
      ['Can it display point clouds?', 'Yes. A PLY file with vertices but no faces is rendered as points in the viewport.'],
      ['Are vertex colors supported?', 'Yes — red/green/blue vertex properties are read and displayed on the mesh.'],
      ['Which PLY encodings work?', 'ASCII, binary little-endian and binary big-endian, all auto-detected from the header.'],
      ['Can I convert a scanned PLY to STL?', 'Yes, but only if the file contains faces. A raw point cloud has no surface to print — mesh it first (e.g., with a reconstruction tool), then convert.'],
    ],
  }),
  viewerPage({
    path: '/viewer/3mf-viewer.html', slug: '3mf', name: '3MF Viewer',
    formats: '3MF',
    intro: 'Open 3MF (3D Manufacturing Format) project files in your browser. 3MF is the modern replacement for STL in 3D printing: a ZIP package containing XML mesh data with units, object names and build transforms.',
    more: 'The viewer unpacks the 3MF container in the browser, parses the 3D model XML, applies build-item transforms and shows each object as a separate tab. Because 3MF defines units explicitly (the model unit is read from the file), measurements and printability checks are more meaningful than with unit-less STL.',
    faq: [
      ['What is a 3MF file?', 'A ZIP-based package standardized by the 3MF Consortium. It stores meshes in XML with millimeter units by default, supports multiple objects, transforms and metadata — solving STL\u2019s biggest weaknesses.'],
      ['Do you support 3MF production extensions?', 'The core spec is supported: objects, components, build items and transforms. Extensions like slices or materials are ignored if present; files that require unsupported extensions still show their base geometry.'],
      ['Can I convert 3MF back to STL?', 'Yes — the Convert tab exports STL (binary or ASCII), OBJ, PLY and glTF.'],
      ['Is my 3MF file uploaded?', 'No. The ZIP container is unpacked locally with the browser\u2019s DecompressionStream API.'],
    ],
  }),
  viewerPage({
    path: '/viewer/multi-model-viewer.html', slug: 'multi-model', name: 'Multi-Model Viewer',
    formats: 'STL, OBJ, GLB, PLY and 3MF',
    intro: 'Load several 3D models at once and inspect them side by side in one viewport. Drop in a mix of STL, OBJ, GLB, PLY and 3MF files — or a single file that contains multiple objects — and each one becomes a tab you can toggle and edit independently.',
    more: 'Multi-model viewing is useful for comparing revisions, checking how parts fit together, or organizing a multi-part print. Every loaded model can be transformed, analyzed and exported individually, or merged into a single mesh with one click.',
    faq: [
      ['How many models can I load?', 'There is no fixed limit — it depends on your device memory. Each model is a GPU buffer; typical workstations handle dozens of medium meshes.'],
      ['Can I load different formats together?', 'Yes. Mix STL, OBJ, GLB, PLY and 3MF freely; each file is parsed by its own loader.'],
      ['Can I combine the models into one file?', 'Yes. Merge All Loaded Models produces a single mesh you can export in any supported format.'],
      ['Can I hide one model temporarily?', 'Yes — models have visibility toggles, and right-clicking a tab removes a model from the scene.'],
    ],
  }),
  viewerPage({
    path: '/viewer/inspection-views.html', slug: 'inspection', name: 'Wireframe, X-Ray & Normal Viewer',
    formats: 'any supported',
    intro: 'Beyond plain solid shading, the 3DTools viewport offers the inspection modes mesh work actually needs: wireframe, wireframe overlay, x-ray transparency, color-coded normals and vertex display — for every supported format.',
    more: 'Wireframe mode reveals triangle density and topology problems such as long thin triangles; the solid/wireframe toggle overlays the mesh edges on the shaded surface. X-Ray mode makes the model translucent so internal geometry, shells and internal overhangs become visible. Normal mode colors the surface by the direction it faces (a quick check for flipped normals — they render in the opposite rainbow direction), and vertex mode shows the raw point set. Cross-section slicing and measurement tools round out inspection.',
    faq: [
      ['What is the x-ray view for?', 'It renders the surface translucently so you can see internal structure — hollow shells, inner walls, or whether two parts intersect.'],
      ['How do I check for flipped normals?', 'Switch to the Normals display mode: correctly outward-facing surfaces show a consistent rainbow gradient; inverted patches look reversed.'],
      ['Can I see the wireframe and the shaded surface together?', 'Yes — enable “Wireframe overlay” in the View tab to draw edges on top of the shaded model.'],
      ['Do inspection modes work on all formats?', 'Yes — every mode (solid, wireframe, x-ray, normals, vertices) works on every mesh loaded into the studio.'],
    ],
  }),
];

function convertPage({ path, slug, from, to, fromDesc, toDesc, why, notes, faq }) {
  return {
    path,
    title: `${from} to ${to} Converter — Free & Local | 3DTools`,
    description: `Convert ${from} to ${to} online for free. Files are converted locally in your browser — no upload, no queue, no email. Works with large files and shows real errors.`,
    h1: `${from} to ${to} Converter`,
    intro: `<p>Convert ${from} files to ${to} directly in your browser. There is no server-side conversion: your file is parsed, rebuilt in the target format and downloaded — all on your device, so even confidential models stay private and there is no file-size quota.</p>`,
    cta: { href: `/app.html?tool=${slug}`, label: `Convert ${from} to ${to}` },
    crumbs: [['/', 'Home'], ['/tools.html', 'Tools'], [path, `${from} \u2192 ${to}`]],
    jsonLdName: `${from} to ${to} Converter — 3DTools`,
    sections: [
      { id: 'how', h2: 'How to convert', html: `
<ol>
<li>Open the studio with the button above.</li>
<li>Drop in your <strong>${from}</strong> file (or several files at once).</li>
<li>Open the <strong>Convert</strong> tab, pick <strong>${to}</strong> and click <strong>Convert & Download</strong>.</li>
<li>The converted file downloads immediately.</li>
</ol>
<p>${why}</p>` },
      { id: 'formats', h2: 'About these formats', html: `
<table class="data">
<tr><th></th><th>${from}</th><th>${to}</th></tr>
<tr><td>Type</td><td>${fromDesc.type}</td><td>${toDesc.type}</td></tr>
<tr><td>Typical use</td><td>${fromDesc.use}</td><td>${toDesc.use}</td></tr>
<tr><td>Multiple objects</td><td>${fromDesc.objects}</td><td>${toDesc.objects}</td></tr>
<tr><td>Normals & UVs</td><td>${fromDesc.attributes}</td><td>${toDesc.attributes}</td></tr>
<tr><td>Units</td><td>${fromDesc.units}</td><td>${toDesc.units}</td></tr>
</table>
${notes}` },
      { id: 'limits', h2: 'Limitations', html: `
<ul>
<li>Geometry (vertices, triangles, normals${toDesc.uvs ? ', UVs' : ''}) is converted. Materials, textures and animations are not part of the mesh-only pipeline${toDesc.matNote ? '' : ' and are not carried over'}.</li>
<li>${fromDesc.limit}</li>
<li>Very large models are processed in a background worker, but browser memory is the practical limit.</li>
</ul>` },
    ],
    faq,
    related: [...REL_CONVERT, ...REL_VIEWER].filter(r => r[0] !== path).slice(0, 4),
  };
}

const STL_D = { type: 'Triangle soup (binary or ASCII)', use: '3D printing, CAD interchange', objects: 'No — one unnamed solid', attributes: 'Per-face normals only', units: 'None defined (usually mm)', limit: 'STL has no units; the converter assumes millimeters as 3D printers do.' };
const OBJ_D = { type: 'Text-based polygon list', use: 'General 3D / DCC tools', objects: 'Yes — o/g groups become objects', attributes: 'Vertex normals and UVs', units: 'None defined', limit: 'OBJ material libraries (.mtl) and textures are not written by this converter.' };
const GLB_D = { type: 'Binary glTF 2.0 container', use: 'Web, AR/VR, runtime engines', objects: 'Yes — multiple meshes and nodes', attributes: 'Normals and UVs', units: 'Meters (per glTF spec)', limit: 'glTF stores units in meters; models converted to glTF keep their numeric coordinates (a 20mm part becomes 20 glTF units — scale in the target tool if needed).' };
const MF_D = { type: 'ZIP + XML package (OPC)', use: 'Modern 3D printing', objects: 'Yes — multiple objects with transforms', attributes: 'Triangles only (vertices + indices)', units: 'Explicit (mm by default)', limit: '3MF core-spec geometry is written; production extensions (slices, colors, materials) are not generated.' };
const PLY_D = { type: 'ASCII or binary polygon/point format', use: '3D scanning, research', objects: 'One mesh per file', attributes: 'Normals, UVs, vertex colors', units: 'None defined', limit: 'PLY conversion targets single meshes; multiple loaded models are merged.' };

export const CONVERT_PAGES = [
  convertPage({
    path: '/convert/stl-to-obj.html', slug: 'stl-to-obj', from: 'STL', to: 'OBJ',
    fromDesc: STL_D, toDesc: OBJ_D,
    why: 'Converting STL to OBJ welds the triangle soup into shared vertices, which most modeling tools prefer, and lets you continue editing in tools like Blender, Maya or 3ds Max.',
    notes: '<p>On load, identical vertex positions in the STL are welded so the OBJ gets a real vertex table. Normals are recomputed smoothly where the surface allows.</p>',
    faq: [
      ['Is the STL to OBJ conversion free?', 'Yes, completely — and there is no upload: the conversion happens in your browser\u2019s JavaScript engine.'],
      ['Will the OBJ be watertight?', 'It inherits whatever topology the STL had. If the STL was watertight, the OBJ will be too. Run the manifold check before converting if you are unsure.'],
      ['Does the OBJ keep colors?', 'STL files do not contain colors, so no color data can exist in the converted OBJ.'],
    ],
  }),
  convertPage({
    path: '/convert/obj-to-stl.html', slug: 'obj-to-stl', from: 'OBJ', to: 'STL',
    fromDesc: OBJ_D, toDesc: STL_D,
    why: 'Slicing software for 3D printing consumes STL (and 3MF). This converter flattens OBJ objects and groups into a single binary STL ready for the slicer, with correct triangle winding.',
    notes: '<p>Choose binary STL (default) for small files, or ASCII STL if some legacy tool requires text. Multiple OBJ objects are merged into one solid; use “include all loaded models” to merge several files too.</p>',
    faq: [
      ['Can it convert multiple OBJ objects into one STL?', 'Yes. OBJ objects and material groups are merged into a single solid — STL supports only one unnamed solid per file.'],
      ['Will normals and UVs survive?', 'No — the STL format has no UVs, and normals are stored per triangle. The geometry itself is preserved exactly.'],
      ['Should I repair the mesh first?', 'If the OBJ has holes or flipped faces, repair it in the Repair tab first — STL converters cannot fix topology, they only translate it.'],
    ],
  }),
  convertPage({
    path: '/convert/stl-to-3mf.html', slug: 'stl-to-3mf', from: 'STL', to: '3MF',
    fromDesc: STL_D, toDesc: MF_D,
    why: '3MF packages the same triangles with explicit millimeter units, a proper name, and a modern container — most slicers (PrusaSlicer, Bambu Studio, Cura) accept it and treat it as a first-class format.',
    notes: '<p>The output is a spec-compliant OPC package: <code>[Content_Types].xml</code>, package relationships and the core 3D model part. Multiple loaded models become multiple objects inside one 3MF.</p>',
    faq: [
      ['Why convert STL to 3MF at all?', '3MF declares units, holds multiple named objects, compresses better and is less ambiguous than STL — the 3MF Consortium (Microsoft, HP, Ultimaker, Prusa and others) designed it as STL\u2019s replacement.'],
      ['Does the 3MF keep triangle count?', 'Yes, geometry is stored as an indexed mesh — identical triangles, usually a smaller file than STL.'],
      ['Is the 3MF valid for slicers?', 'The core spec is implemented; slicers generally accept core-spec files. Special extensions (colors, per-object settings) are not generated.'],
    ],
  }),
  convertPage({
    path: '/convert/obj-to-glb.html', slug: 'obj-to-glb', from: 'OBJ', to: 'GLB',
    fromDesc: OBJ_D, toDesc: GLB_D,
    why: 'GLB is the single-file binary glTF used across the web — three.js, Babylon.js, model viewers and AR frameworks all load it natively. Converting OBJ to GLB gives you a compact, indexed, runtime-ready asset.',
    notes: '<p>Each OBJ object becomes a glTF mesh/node. Vertex normals and UVs are carried over; 32-bit indices are used automatically when a mesh exceeds 65,536 vertices.</p>',
    faq: [
      ['Does the GLB include textures from the .mtl file?', 'No — this is a geometry converter. UV coordinates are preserved so you can re-apply materials in any glTF editor.'],
      ['Is the GLB spec-compliant?', 'Yes: glTF 2.0 with a JSON chunk, binary buffer, accessors with min/max, and index buffers, generated with correct 4-byte alignment and padding.'],
      ['Can I convert back?', 'Yes — load the GLB and export OBJ (or STL, PLY, 3MF) from the same studio.'],
    ],
  }),
  convertPage({
    path: '/convert/glb-to-obj.html', slug: 'glb-to-obj', from: 'GLB', to: 'OBJ',
    fromDesc: GLB_D, toDesc: OBJ_D,
    why: 'Extract editable OBJ geometry from binary glTF assets. Node transforms (translation/rotation/scale/matrix) are applied during conversion, so the OBJ matches the assembled glTF scene, not the raw node-local coordinates.',
    notes: '<p>Each glTF mesh becomes an OBJ object with its name preserved. UVs and normals are exported when present. .gltf files with external .bin buffers work too — select both files together.</p>',
    faq: [
      ['Are glTF node transforms applied?', 'Yes — translation, rotation, scale and full matrices are baked into the exported vertices.'],
      ['What about textures and materials?', 'Material names are carried into OBJ <code>usemtl</code> references, but texture data is not extracted.'],
      ['Does it work with .gltf files too?', 'Yes — including .gltf with external .bin buffers when you select the files together, and base64-embedded buffers.'],
    ],
  }),
  convertPage({
    path: '/convert/gltf-to-glb.html', slug: 'gltf-to-glb', from: 'GLTF', to: 'GLB',
    fromDesc: { ...GLB_D, type: 'JSON + external/embedded buffers' }, toDesc: GLB_D,
    why: 'Packaging a multi-file .gltf (JSON + .bin + textures) into a single self-contained .glb makes assets dramatically easier to distribute, attach and load.',
    notes: '<p>Select the .gltf and its .bin file(s) together in the file picker. The JSON is re-serialized with a single binary chunk; base64 data-URI buffers are repacked into binary too.</p>',
    faq: [
      ['How do I convert a .gltf with an external .bin?', 'Select both files (the .gltf and the .bin) at once when opening, then export GLB.'],
      ['Are Draco-compressed files supported?', 'No — Draco requires its own decoder and is rejected with a clear error. Export the asset without compression first.'],
      ['Is data lost in GLTF to GLB conversion?', 'The geometry, accessors and node structure are preserved. This tool focuses on meshes; exotic extensions may be dropped.'],
    ],
  }),
  convertPage({
    path: '/convert/ply-to-obj.html', slug: 'ply-to-obj', from: 'PLY', to: 'OBJ',
    fromDesc: PLY_D, toDesc: OBJ_D,
    why: 'Turn scanned PLY meshes into OBJ files that every DCC tool opens. Vertex colors and normals from the scan are preserved in the OBJ where present.',
    notes: '<p>Binary and ASCII PLY are auto-detected, including big-endian files. Polygons with more than three vertices are fan-triangulated. Point clouds (PLY without faces) cannot become OBJ meshes — there is no surface to write.</p>',
    faq: [
      ['Does it keep vertex colors?', 'OBJ supports vertex colors only as a non-standard extension, so colors are not written. Convert to PLY or GLB if you need them.'],
      ['My PLY is a point cloud — why no OBJ?', 'An OBJ file describes faces; a point cloud has none. Mesh the point cloud first (e.g., Poisson reconstruction), then convert.'],
      ['Which PLY dialects are supported?', 'ASCII, binary little-endian and binary big-endian, with any of the standard property types (char/short/int/float/double and their unsigned variants).'],
    ],
  }),
  convertPage({
    path: '/convert/3mf-to-stl.html', slug: '3mf-to-stl', from: '3MF', to: 'STL',
    fromDesc: MF_D, toDesc: STL_D,
    why: 'Older slicers and CAM packages only read STL. This converter unpacks the 3MF package, applies build-item transforms and writes a single binary or ASCII STL.',
    notes: '<p>Every build item is included, with its transform baked in. If the 3MF contains several objects they are merged into the STL (STL holds one solid). Need separate files? Convert each object individually from the model tabs.</p>',
    faq: [
      ['Are 3MF build transforms applied?', 'Yes — the transform matrix of every build item (and nested component) is applied to the vertices.'],
      ['Which 3MF variants are supported?', 'Core-spec packages: objects, components, build items, transforms. Files using vendor extensions still convert if they contain base mesh data.'],
      ['Will the STL be watertight?', 'If the 3MF mesh is watertight, yes. Run the manifold check on the result if it matters.'],
    ],
  }),
];
