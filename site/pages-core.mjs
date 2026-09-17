// Core site pages: home, tools index, formats, mesh/print tool hubs, legal, 404.
export const CORE_PAGES = [

// ---------------- home ----------------
{
  path: '/',
  title: '3DTools — Free Local 3D Model Viewer, Converter & Mesh Repair',
  description: 'View, convert, repair and analyze STL, OBJ, GLB, PLY and 3MF models entirely in your browser. No uploads, no accounts — every operation runs locally on your device.',
  h1: '3D model tools that never see your files',
  intro: `<p>3DTools is a browser-based toolbox for triangle meshes: a fast WebGL viewer, format converters, mesh repair and editing, and 3D-printing analysis. Everything runs <strong>locally in your browser</strong> — there is no server, no upload and no account. Your models never leave your device.</p>`,
  cta: { href: '/app.html', label: 'Open 3DTools Studio' },
  ctaNote: 'No sign-up. Drop in a file and start working.',
  sections: [
    { id: 'tools', h2: 'What you can do', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">View</span><h3>View any major format</h3><p>STL, OBJ, GLB/GLTF, PLY and 3MF — with wireframe, x-ray, normal and vertex inspection modes, measurement and cross-sections.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>Convert between formats</h3><p>Eight well-defined conversion paths between the five supported formats, processed locally with real error messages.</p></a>
  <a class="card" href="/mesh-tools.html"><span class="tag">Repair</span><h3>Repair and edit meshes</h3><p>Weld duplicate vertices, fix winding and inside-out meshes, remove degenerate faces, decimate, hollow, cut and split.</p></a>
  <a class="card" href="/3d-printing-tools.html"><span class="tag">Print</span><h3>Prepare for 3D printing</h3><p>Manifold and watertight checks, overhang detection, wall thickness estimation, printability report and orientation tools.</p></a>
</div>` },
    { id: 'how', h2: 'How it works', html: `
<p>3DTools is a static website. The entire application — parsers for every format, mesh algorithms and the WebGL renderer — is plain JavaScript that your browser downloads once. Files you open are read with the browser's File API and parsed in memory; heavy operations run in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Workers</a> so the interface never freezes. When you convert a model, the result is assembled in memory and handed to your browser's download manager. At no point does any model data travel over the network.</p>
<div class="callout"><strong>No fake buttons.</strong> Every tool on this site is a real implementation with documented limitations — where an operation is approximate (e.g., wall-thickness estimation), the interface says so.</div>` },
    { id: 'who', h2: 'Who it is for', html: `
<p><strong>3D printing users</strong> check printability, repair downloaded models and convert between STL, OBJ and 3MF. <strong>Developers</strong> inspect glTF assets and verify mesh data. <strong>Designers</strong> quickly preview files without installing a full CAD suite. If you need full CAD (parametric solids, booleans on NURBS, assemblies with constraints), 3DTools is not that — it is a mesh toolbox, and it does not pretend otherwise.</p>` },
  ],
  faq: [
    ['Is 3DTools really free?', 'Yes. There is no account system, no paid tier and no file limit enforced by a server — because there is no server.'],
    ['Where are my files processed?', 'Entirely on your device, in your browser. The site is static hosting; nothing you open is transmitted anywhere.'],
    ['Which formats are supported?', 'STL (binary + ASCII), OBJ, PLY (binary + ASCII, incl. point clouds), GLB and GLTF 2.0, and 3MF (core spec). See the <a href="/formats.html">formats page</a> for details and limitations.'],
    ['Does it work offline?', 'Once the page has loaded, yes — no network requests are made during model processing.'],
    ['What are the hardware requirements?', 'Any machine with a WebGL-capable browser. Large meshes are handled in a worker thread; very large files are limited by your device\u2019s memory.'],
  ],
  related: [
    ['/viewer/stl-viewer.html', 'STL Viewer', 'Inspect STL files with wireframe, x-ray and section views.'],
    ['/mesh-tools.html', 'Mesh Tools', 'Repair, decimate, hollow, cut and merge meshes.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Manifold, overhang and printability analysis.'],
    ['/formats.html', 'Supported Formats', 'What each format contains and what 3DTools does with it.'],
  ],
},

// ---------------- tools index ----------------
{
  path: '/tools.html',
  title: 'All 3D Tools — Viewers, Converters, Mesh & Printing Tools | 3DTools',
  description: 'Complete list of 3DTools: format viewers, converters, mesh repair and editing tools, and 3D-printing analysis — all free, local and browser-based.',
  h1: 'All tools',
  intro: `<p>Every tool below is a real, working implementation running locally in your browser. The studio on the right side panel organizes them into View, Transform, Repair, Edit, Analyze and Convert.</p>`,
  cta: { href: '/app.html', label: 'Open the Studio' },
  sections: [
    { id: 'viewers', h2: 'Viewers', html: `
<div class="card-grid">
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Viewer</span><h3>STL Viewer</h3><p>Binary and ASCII STL, with manifold check and repair pipeline.</p></a>
  <a class="card" href="/viewer/obj-viewer.html"><span class="tag">Viewer</span><h3>OBJ Viewer</h3><p>Objects, groups, normals and UVs, multi-object tabs.</p></a>
  <a class="card" href="/viewer/glb-gltf-viewer.html"><span class="tag">Viewer</span><h3>GLB/GLTF Viewer</h3><p>glTF 2.0 assets with node transforms applied.</p></a>
  <a class="card" href="/viewer/ply-viewer.html"><span class="tag">Viewer</span><h3>PLY Viewer</h3><p>ASCII/binary PLY incl. vertex colors and point clouds.</p></a>
  <a class="card" href="/viewer/3mf-viewer.html"><span class="tag">Viewer</span><h3>3MF Viewer</h3><p>Unpack and inspect 3MF print projects with build transforms.</p></a>
  <a class="card" href="/viewer/multi-model-viewer.html"><span class="tag">Viewer</span><h3>Multi-Model Viewer</h3><p>Load many models side by side, compare, merge or split.</p></a>
  <a class="card" href="/viewer/inspection-views.html"><span class="tag">Viewer</span><h3>Wireframe / X-Ray / Normals / Vertices</h3><p>Inspection display modes for every format.</p></a>
</div>` },
    { id: 'converters', h2: 'Converters', html: `
<div class="card-grid">
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>STL \u2192 OBJ</h3><p>Weld triangle soup into a real indexed mesh.</p></a>
  <a class="card" href="/convert/obj-to-stl.html"><span class="tag">Convert</span><h3>OBJ \u2192 STL</h3><p>Flatten OBJ objects into printable STL.</p></a>
  <a class="card" href="/convert/stl-to-3mf.html"><span class="tag">Convert</span><h3>STL \u2192 3MF</h3><p>Wrap triangles in a modern 3MF package.</p></a>
  <a class="card" href="/convert/obj-to-glb.html"><span class="tag">Convert</span><h3>OBJ \u2192 GLB</h3><p>Produce single-file glTF web assets.</p></a>
  <a class="card" href="/convert/glb-to-obj.html"><span class="tag">Convert</span><h3>GLB \u2192 OBJ</h3><p>Extract editable geometry from glTF.</p></a>
  <a class="card" href="/convert/gltf-to-glb.html"><span class="tag">Convert</span><h3>GLTF \u2192 GLB</h3><p>Pack multi-file glTF into one .glb.</p></a>
  <a class="card" href="/convert/ply-to-obj.html"><span class="tag">Convert</span><h3>PLY \u2192 OBJ</h3><p>Turn scans into OBJ meshes.</p></a>
  <a class="card" href="/convert/3mf-to-stl.html"><span class="tag">Convert</span><h3>3MF \u2192 STL</h3><p>Unpack print projects for legacy slicers.</p></a>
</div>` },
    { id: 'mesh', h2: 'Mesh tools', html: `
<p>Scale, rotate, mirror, center and align; repair (weld, dedupe faces, fix winding); recalculate or flip normals; simplify/decimate with quadric error metrics; merge and separate objects; delete selected faces or vertices; hollow shells; add base plates; cut and split by plane. See the <a href="/mesh-tools.html">mesh tools page</a> for details and limitations of each operation.</p>` },
    { id: 'print', h2: '3D printing tools', html: `
<p>Printability check, manifold/watertight check, wall thickness (approximate), overhang detection, mesh statistics, bounding box, volume, surface area, orientation, cross sections, distance/angle measurement and viewport screenshots. See the <a href="/3d-printing-tools.html">3D printing tools page</a>.</p>` },
  ],
  faq: [
    ['Do I need to install anything?', 'No. The studio is a web page; all computation happens in your browser.'],
    ['Can I use several tools in a row?', 'Yes — the studio is a pipeline: load a file, repair it, decimate it, then convert and download. Each operation works on the current mesh.'],
    ['Which tools run in a worker?', 'All heavy operations (repair, decimation, hollowing, cutting, analysis) run in a Web Worker with a progress bar so the UI stays responsive.'],
  ],
  related: [
    ['/app.html', 'Open Studio', 'The full toolbox in one viewport.'],
    ['/formats.html', 'Supported Formats', 'Capabilities per format.'],
    ['/mesh-tools.html', 'Mesh Tools', 'Repair and editing details.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Analysis details.'],
  ],
},

// ---------------- formats ----------------
{
  path: '/formats.html',
  title: 'Supported 3D File Formats — STL, OBJ, GLB/GLTF, PLY, 3MF | 3DTools',
  description: 'What 3DTools reads and writes: STL, OBJ, PLY, glTF 2.0 (GLB/GLTF) and 3MF — capabilities, variants and honest limitations of each format.',
  h1: 'Supported formats',
  intro: `<p>3DTools deliberately supports a small set of formats — deeply and honestly — instead of claiming to read everything. Below is exactly what is parsed, what is written, and what each format can and cannot contain.</p>`,
  cta: { href: '/app.html', label: 'Try it with your file' },
  sections: [
    { id: 'table', h2: 'Overview', html: `
<table class="data">
<tr><th>Format</th><th>Read</th><th>Write</th><th>Variants</th><th>Objects</th><th>Normals/UVs</th></tr>
<tr><td><a href="/viewer/stl-viewer.html">STL</a></td><td>Yes</td><td>Binary + ASCII</td><td>Binary, ASCII</td><td>Single solid</td><td>Normals only</td></tr>
<tr><td><a href="/viewer/obj-viewer.html">OBJ</a></td><td>Yes</td><td>Yes</td><td>Text</td><td>o/g groups</td><td>Both</td></tr>
<tr><td><a href="/viewer/ply-viewer.html">PLY</a></td><td>Yes</td><td>Binary + ASCII</td><td>ASCII, binary LE/BE</td><td>Single mesh</td><td>Both + colors</td></tr>
<tr><td><a href="/viewer/glb-gltf-viewer.html">GLB/GLTF</a></td><td>Yes</td><td>Both</td><td>glTF 2.0</td><td>Multiple</td><td>Both</td></tr>
<tr><td><a href="/viewer/3mf-viewer.html">3MF</a></td><td>Yes</td><td>Yes</td><td>Core spec</td><td>Multiple + transforms</td><td>Triangles only</td></tr>
</table>` },
    { id: 'stl', h2: 'STL', html: `
<p>The 3D-printing classic: a list of triangles with per-face normals, nothing else. No units, no colors, no object names. Binary STL packs each triangle into exactly 50 bytes; ASCII STL writes the same data as text and is roughly five times larger. 3DTools auto-detects the variant, tolerates truncated files by clipping to the triangles actually present, and recomputes ASCII normals (which are notoriously unreliable) from the geometry.</p>` },
    { id: 'obj', h2: 'OBJ', html: `
<p>Wavefront OBJ is a simple, human-readable text format for polygon meshes. Faces may reference vertices, texture coordinates and normals independently (including negative indices), and files can contain multiple objects and material groups. 3DTools triangulates n-gons, creates a separate model per object/material group and preserves normals and UVs. Material libraries (.mtl) are not required for viewing and are not written on export.</p>` },
    { id: 'ply', h2: 'PLY', html: `<p>Stanford PLY describes vertices and faces with a flexible, header-declared property schema — which is why it is the standard for 3D-scanner output. 3DTools reads all three encodings (ASCII, binary little-endian, binary big-endian) with any standard scalar type, handles list properties for faces, preserves vertex colors and renders face-less files (point clouds) as points.</p>` },
    { id: 'gltf', h2: 'GLB / GLTF', html: `<p>glTF 2.0 is the “JPEG of 3D”: a runtime format for the web. A .glb file packs JSON and binary into one chunked container; a .gltf file is JSON plus external .bin buffers. 3DTools parses both, applies node transforms (translation/rotation/scale/matrix), reads POSITION, NORMAL, TEXCOORD_0, COLOR_0 and index accessors with all standard component types, and rejects Draco/meshopt-compressed assets with a clear error. Exports are spec-compliant glTF 2.0 with correct buffer alignment.</p>` },
    { id: '3mf', h2: '3MF', html: `<p>3MF is a ZIP (OPC) package with an XML mesh model, designed by the 3MF Consortium to fix STL: explicit units, multiple named objects, build transforms and extension points. 3DTools reads and writes the core specification (objects, components, build items, transforms), unpacking containers locally with the browser's decompression API.</p>` },
    { id: 'not', h2: 'What is deliberately not supported', html: `
<ul>
<li><strong>F3D, STEP, IGES, 3DS, FBX, X3D, DAE, USDZ:</strong> these are CAD or scene-graph formats outside the scope of a mesh toolbox. 3DTools does not claim CAD support.</li>
<li><strong>Draco / meshopt compressed glTF:</strong> rejected with an explanatory error rather than a blank screen.</li>
<li><strong>Textures and PBR materials:</strong> geometry-focused pipeline; materials are kept as names only where the format supports it.</li>
</ul>` },
  ],
  faq: [
    ['Can you add format X?', 'Formats are added only when they can be implemented fully client-side and fit the mesh pipeline. The <a href="/contact.html">contact page</a> lists how to suggest one.'],
    ['Why no STEP support?', 'STEP is a CAD (BREP) format requiring a full geometry kernel; converting it honestly means embedding megabytes of WASM CAD code. Rather than fake it, 3DTools stays a mesh toolbox.'],
    ['Which format should I use for 3D printing?', '3MF if your slicer supports it (units, multiple objects), otherwise STL. OBJ works too but adds nothing for printing.'],
  ],
  related: [
    ['/tools.html', 'All Tools', 'Browse every viewer and converter.'],
    ['/viewer/stl-viewer.html', 'STL Viewer', 'Start with the most common format.'],
    ['/convert/gltf-to-glb.html', 'GLTF to GLB', 'Popular glTF packing tool.'],
    ['/3d-printing-tools.html', '3D Printing Tools', 'Analysis for printed parts.'],
  ],
},

// ---------------- mesh tools hub ----------------
{
  path: '/mesh-tools.html',
  title: 'Free Mesh Repair & Editing Tools — Local, Browser-Based | 3DTools',
  description: 'Repair, weld, decimate, hollow, cut, split, merge and transform 3D meshes in your browser. Honest descriptions of what each mesh operation does and its limits.',
  h1: 'Mesh repair & editing tools',
  intro: `<p>A complete set of mesh operations for fixing broken downloads, preparing prints and optimizing assets — all running locally in a Web Worker. Each tool below describes exactly what it does, and where an operation is approximate, it says so.</p>`,
  cta: { href: '/app.html?tool=repair', label: 'Open Mesh Tools' },
  sections: [
    { id: 'transform', h2: 'Transform tools', html: `
<ul>
<li><strong>Scale</strong> — uniform or per-axis, applied to vertices (and normals stay correct for uniform scale).</li>
<li><strong>Rotate</strong> — 90° shortcuts around X/Y/Z or arbitrary angles around any axis.</li>
<li><strong>Mirror</strong> — reflect across a plane perpendicular to X, Y or Z; triangle winding is flipped so the mesh stays valid.</li>
<li><strong>Center / Align</strong> — center the bounding box on the origin, drop the model so its lowest point sits at z=0 (ground), or both.</li>
</ul>` },
    { id: 'repair', h2: 'Repair tools', html: `
<ul>
<li><strong>Repair Mesh</strong> — one pipeline: weld duplicate vertices (spatial-hash with adjustable tolerance), remove degenerate and duplicate faces, make triangle winding globally consistent per component, flip inside-out closed meshes, recompute normals.</li>
<li><strong>Remove Duplicate Vertices</strong> — tolerance-based weld; STL-style triangle soups become real indexed meshes.</li>
<li><strong>Remove Duplicate Faces</strong> — drops triangles with identical vertex sets (either winding).</li>
<li><strong>Recalculate Normals</strong> — smooth vertex normals from face geometry; <strong>Flip Normals</strong> reverses winding and normals together.</li>
</ul>
<div class="callout">Limitations: repair fixes topology (duplicates, winding, orientation) and small gaps via vertex welding. It does not do hole-filling of large missing patches or remeshing.</div>` },
    { id: 'edit', h2: 'Editing tools', html: `
<ul>
<li><strong>Simplify / Decimate</strong> — quadric error-metric edge collapse (Garland–Heckbert) with border preservation; you choose the percentage of triangles to keep. UVs are dropped.</li>
<li><strong>Merge Objects</strong> — combine all loaded models into one mesh (also across formats).</li>
<li><strong>Separate Objects</strong> — split a mesh into connected components (by shared vertices).</li>
<li><strong>Delete Faces / Delete Vertices</strong> — Ctrl+Click faces or vertices to select, then delete; the mesh is re-indexed automatically.</li>
<li><strong>Hollow Model</strong> — builds an inward-offset inner shell (offset along vertex normals) merged with the outer surface. Approximation: concave regions thinner than twice the wall can self-intersect; run repair afterwards.</li>
<li><strong>Add Base</strong> — appends a rectangular base plate under the model footprint with configurable thickness and margin.</li>
<li><strong>Cut Model</strong> — keep one side of an axis-aligned plane, with optional planar cap (the cross-section polygon is triangulated with ear clipping, so the result stays watertight).</li>
<li><strong>Split Model</strong> — cut into two independent models (above/below the plane), each capped and downloadable separately.</li>
</ul>` },
    { id: 'why', h2: 'Why repair matters', html: `<p>Slicers and simulation tools need watertight, consistently wound meshes. Files from scans, downloads or careless exporters commonly contain duplicate vertices (every triangle isolated — the STL norm), zero-area triangles, flipped patches and double faces. The manifold check in the Analyze tab reports boundary and non-manifold edges; the repair pipeline fixes the mechanical problems. It will not invent missing geometry — large holes need a modeling tool.</p>` },
  ],
  faq: [
    ['Is decimation lossy?', 'Yes — reducing triangles always changes geometry. Quadric decimation minimizes surface error, and the progress/status shows the exact result. Keep a copy of the original.'],
    ['Why did hollow create weird geometry?', 'Naive inward offsetting self-intersects where the model is thinner than about twice the wall thickness or in sharp concavities. It works best on chunky, convex shapes; run Repair afterwards and inspect in X-Ray mode.'],
    ['How do I delete part of a model?', 'Select the Edit tab, choose Faces or Vertices selection mode, Ctrl+Click in the viewport to select, then Delete Selected.'],
    ['Can I undo an operation?', 'There is no undo stack — keep the original file and re-load it if an operation goes wrong.'],
  ],
  related: [
    ['/3d-printing-tools.html', '3D Printing Tools', 'Check the result for printability.'],
    ['/convert/stl-to-obj.html', 'STL to OBJ', 'Welds STL soups while converting.'],
    ['/viewer/inspection-views.html', 'Inspection Views', 'X-ray and wireframe for checking repairs.'],
    ['/app.html', 'Open Studio', 'All tools in one place.'],
  ],
},

// ---------------- 3d printing hub ----------------
{
  path: '/3d-printing-tools.html',
  title: '3D Printing Analysis Tools — Printability, Manifold, Overhangs | 3DTools',
  description: 'Free local 3D-printing checks: watertight/manifold verification, overhang detection, wall thickness estimation, volume, printability report, orientation and cross sections.',
  h1: '3D printing tools',
  intro: `<p>Check whether a model will actually print — before you waste filament. These analysis tools run locally on the mesh: watertightness, overhangs, wall thickness, size vs. printer volume, and a combined printability report.</p>`,
  cta: { href: '/app.html?tool=printability', label: 'Run a Printability Check' },
  sections: [
    { id: 'checks', h2: 'The checks', html: `
<ul>
<li><strong>Printability Check</strong> — one report combining all checks below with issues, warnings and notes.</li>
<li><strong>Manifold Check</strong> — exact topology test: counts boundary edges (holes), non-manifold edges and non-manifold vertices. A watertight mesh has zero of each.</li>
<li><strong>Overhang Detection</strong> — flags faces whose normal points within a threshold angle of straight down (default 45°), reports their area as a percentage, and highlights them in red in the viewport.</li>
<li><strong>Wall Thickness Check</strong> — estimates local thickness by casting inward rays from surface samples (approximation — see below).</li>
<li><strong>Mesh Statistics</strong> — vertices, triangles, bounding box, indexed/soup status.</li>
<li><strong>Bounding Box / Volume / Surface Area</strong> — exact geometric quantities (volume via the divergence theorem, assumes watertight).</li>
</ul>` },
    { id: 'prep', h2: 'Preparation tools', html: `
<ul>
<li><strong>Model Orientation</strong> — drop to ground, or auto-orient by rotating the dominant face normal downward (approximation), then align to the plate.</li>
<li><strong>Cross Section</strong> — slide a cutting plane along any axis and inspect the contour — the classic way to spot hidden holes and inverted geometry.</li>
<li><strong>Measure Distance / Angle</strong> — click points on the surface to measure between them.</li>
<li><strong>Model Screenshot</strong> — capture the viewport as PNG for documentation.</li>
<li><strong>Center + Ground</strong> and the rest of the <a href="/mesh-tools.html">mesh repair tools</a> prepare geometry for slicing.</li>
</ul>` },
    { id: 'accuracy', h2: 'Accuracy and limitations', html: `<p>Manifold checks, overhang angles, volume and area are exact computations on the triangle data. <strong>Wall thickness is an approximation</strong>: it samples surface points and casts rays inward along the normal, reporting the distance to the first surface hit. On concave shapes it can locally over- or under-estimate, and it knows nothing about your printer's nozzle: pair its output with judgment. The default printer volume used for size checks (220×220×250 mm) is a common consumer printer; your machine may differ.</p>` },
    { id: 'workflow', h2: 'A sane pre-print workflow', html: `
<ol>
<li>Load the model and drop it to the ground.</li>
<li>Run the Printability Check — fix any issues with <a href="/mesh-tools.html">repair tools</a>.</li>
<li>Check overhangs and decide on supports or reorientation.</li>
<li>Export STL or 3MF and slice as usual.</li>
</ol>` },
  ],
  faq: [
    ['What does “not watertight” mean?', 'The mesh surface has holes (boundary edges) or topology errors (non-manifold edges), so the slicer cannot reliably tell inside from outside — prints may fail or come out solid/empty incorrectly.'],
    ['Is the overhang threshold 45° always right?', '45° is a common rule of thumb for FDM without supports. Adjust the angle in the tool; materials and printers vary.'],
    ['How accurate is the volume calculation?', 'Exact for a watertight mesh (divergence-theorem sum over triangles). If the mesh has holes the number is not meaningful.'],
    ['Does it check my specific printer volume?', 'The default check uses 220×220×250 mm. The check reports dimensions so you can compare against your own build volume.'],
  ],
  related: [
    ['/mesh-tools.html', 'Mesh Tools', 'Fix what the checks find.'],
    ['/convert/stl-to-3mf.html', 'STL to 3MF', 'Export for modern slicers.'],
    ['/viewer/inspection-views.html', 'Inspection Views', 'X-ray view for internal geometry.'],
    ['/app.html', 'Open Studio', 'Run the checks on your model.'],
  ],
},

// ---------------- about ----------------
{
  path: '/about.html',
  title: 'About 3DTools — Local-First 3D Model Toolbox',
  description: '3DTools is a free, local-first toolbox for viewing, converting, repairing and analyzing 3D meshes. Learn how it works and what it deliberately is not.',
  h1: 'About 3DTools',
  intro: `<p>3DTools is a browser-based toolbox for triangle-mesh models. It exists because most “free online 3D tools” are upload pipelines wrapped in ads: your model goes to a server, waits in a queue, and comes back. 3DTools is the opposite — a static page where <strong>all computation happens on your device</strong>.</p>`,
  sections: [
    { id: 'principles', h2: 'Principles', html: `
<ul>
<li><strong>Local by architecture, not by promise.</strong> There is no upload endpoint in the code. Model processing uses the File API, typed arrays, Web Workers and WebGL.</li>
<li><strong>Real functionality only.</strong> Every button does something. Approximate operations (e.g., wall thickness, hollowing) are labeled as approximations with their limitations documented.</li>
<li><strong>Deep support for few formats</strong> over shallow support for many. Five formats, honestly implemented, with clear errors for unsupported files.</li>
<li><strong>No dark patterns.</strong> Ads are visually separated from functional controls, nothing auto-downloads, nothing pops up over the 3D viewport.</li>
</ul>` },
    { id: 'stack', h2: 'Under the hood', html: `
<p>The mesh core (parsers, exporters, geometry operations, analysis) is dependency-free JavaScript operating on typed arrays — the same code runs in the browser and in Node.js, where the automated test suite exercises it. Rendering uses <a href="https://threejs.org">Three.js</a> (WebGL). Heavy operations run in a Web Worker so the UI stays interactive. 3MF containers are unpacked with the browser's native decompression. No WASM is required for the supported feature set; where a task needs it in the future it will be bundled locally, not fetched from a CDN at runtime.</p>` },
    { id: 'scope', h2: 'What it is not', html: `<p>3DTools is not CAD software. It does not edit parametric solids, run boolean operations on NURBS, manage assemblies with constraints, or slice models into G-code. If you need those, use a real CAD or slicer application — this toolbox covers the mesh-level work around them.</p>` },
  ],
  faq: [
    ['Who makes 3DTools?', 'An independent developer. See the <a href="/contact.html">contact page</a>.'],
    ['How is it funded?', 'Plain, clearly-labeled display advertising that never mimics functional controls. No data sales — there is no data to sell.'],
    ['Can I self-host it?', 'Yes — it is a static site: any static file host serves it as-is.'],
  ],
  related: [['/privacy.html', 'Privacy Policy', 'What (little) data exists.'], ['/formats.html', 'Formats', 'Supported formats and limits.'], ['/tools.html', 'All Tools', 'Browse the toolbox.'], ['/app.html', 'Open Studio', 'Try it now.']],
},

// ---------------- contact ----------------
{
  path: '/contact.html',
  title: 'Contact 3DTools',
  description: 'Report bugs, suggest formats or features, or ask about 3DTools — a local-first 3D mesh toolbox.',
  h1: 'Contact',
  intro: `<p>Found a bug, a file that should parse but does not, or a format you need? Get in touch.</p>`,
  sections: [
    { id: 'how', h2: 'How to reach us', html: `
<p>Email: <strong>contact@3dtools.example</strong></p>
<p>To keep this site free of trackers, there is no contact form — just plain email. Please include:</p>
<ul>
<li>For bugs: what you did, what you expected, and what happened (the exact status-bar error message helps enormously).</li>
<li>For file problems: the format and, if possible, the file — or just its header (first few lines / bytes as text).</li>
<li>For format requests: a link to the format specification and an example file.</li>
</ul>` },
    { id: 'bugs', h2: 'Before you write', html: `<p>Many load failures are unsupported files, not bugs: Draco-compressed glTF, CAD formats (STEP, IGES, FBX) and password-protected archives are outside scope and produce a clear error message. Check the <a href="/formats.html">formats page</a> first.</p>` },
  ],
  faq: [
    ['Do you accept feature requests?', 'Yes, if they fit the local-first, mesh-toolbox scope.'],
    ['Do you offer API access?', 'No. There is no backend to expose — that is the point.'],
  ],
  related: [['/about.html', 'About', 'How 3DTools works.'], ['/formats.html', 'Formats', 'What is supported.'], ['/tools.html', 'All Tools', 'The toolbox.'], ['/privacy.html', 'Privacy', 'Data policy.']],
},

// ---------------- privacy ----------------
{
  path: '/privacy.html',
  title: 'Privacy Policy — 3DTools',
  description: '3DTools privacy policy: model files are processed locally and never uploaded. Plain-language summary of what data does and does not exist.',
  h1: 'Privacy policy',
  intro: `<p><strong>Short version: your 3D models never leave your device, because there is no server to send them to.</strong> 3DTools is a set of static pages; opening, converting, repairing and analyzing models happens entirely in your browser.</p>`,
  sections: [
    { id: 'files', h2: 'Your files', html: `<p>Files you open are read into browser memory (File API) and processed locally. They are not uploaded, not stored, and not accessible to the site operator. Closing the tab discards everything. Downloads you create are generated in memory and saved by your browser directly.</p>` },
    { id: 'data', h2: 'Data we collect', html: `<ul>
<li><strong>None by ourselves.</strong> The site has no analytics of its own, no cookies for functionality, and no accounts.</li>
<li><strong>Advertising:</strong> the site displays ads from third-party networks. Those networks may set cookies and process data (IP address, browser headers) to display and measure ads, as described in their own privacy policies. Ads are loaded only as clearly-marked ad placements, never attached to upload/download/convert controls.</li>
<li><strong>Standard web-server logs</strong> maintained by the static host (page requests, IP addresses) for security and abuse prevention, retained per the host's policy.</li>
</ul>` },
    { id: 'rights', h2: 'Your choices', html: `<p>You can block third-party ad cookies via your browser settings without affecting any tool functionality. For questions, use the <a href="/contact.html">contact page</a>.</p>` },
  ],
  faq: [
    ['Does 3DTools upload my models?', 'No. There is no upload code — parsing, conversion and analysis all run in your browser.'],
    ['Does the site use cookies?', 'Only third-party ad networks may set cookies; the site itself sets none.'],
  ],
  related: [['/terms.html', 'Terms of Use', 'Usage terms.'], ['/disclaimer.html', 'Disclaimer', 'Accuracy and responsibility.'], ['/about.html', 'About', 'How the site works.'], ['/contact.html', 'Contact', 'Ask questions.']],
},

// ---------------- terms ----------------
{
  path: '/terms.html',
  title: 'Terms of Use — 3DTools',
  description: 'Terms for using 3DTools, a free browser-based 3D mesh toolbox that processes all data locally.',
  h1: 'Terms of use',
  intro: `<p>By using 3DTools you agree to these terms. They are intentionally short.</p>`,
  sections: [
    { id: 'terms', h2: 'The terms', html: `<ul>
<li><strong>Service.</strong> 3DTools provides browser-based tools for 3D mesh files, free of charge, “as is”, without warranty of any kind.</li>
<li><strong>Your files.</strong> All processing happens on your device. You are responsible for the files you open and the results you download; keep your own backups.</li>
<li><strong>Responsibility.</strong> Mesh operations (repair, decimation, hollowing, cutting) modify geometry, sometimes lossily. Verify results before using them for manufacturing, engineering or other consequential purposes.</li>
<li><strong>Acceptable use.</strong> Do not attempt to disrupt the service or abuse advertising. You may use the tools for personal and commercial work on models you have the right to process.</li>
<li><strong>Changes.</strong> These terms may change; the current version is always on this page.</li>
</ul>` },
  ],
  faq: [
    ['Is commercial use allowed?', 'Yes — using the tools on your own models, including for paid work, is fine.'],
    ['Is there a warranty?', 'No. The tools are provided as-is; see also the <a href="/disclaimer.html">disclaimer</a>.'],
  ],
  related: [['/privacy.html', 'Privacy', 'Data policy.'], ['/disclaimer.html', 'Disclaimer', 'Scope of accuracy.'], ['/contact.html', 'Contact', 'Questions.'], ['/about.html', 'About', 'About the project.']],
},

// ---------------- disclaimer ----------------
{
  path: '/disclaimer.html',
  title: 'Disclaimer — Accuracy and Limitations of 3DTools',
  description: 'Honest limitations of 3DTools: which mesh operations are exact, which are approximations, and why you should verify results before manufacturing.',
  h1: 'Disclaimer',
  intro: `<p>3DTools performs real mesh computations, but every tool has limits. This page states them plainly so you can judge the results.</p>`,
  sections: [
    { id: 'exact', h2: 'What is exact', html: `<ul>
<li>Format parsing and conversion of mesh geometry (vertices, triangles, normals, UVs where the target format supports them).</li>
<li>Volume and surface area (exact for watertight meshes), bounding boxes, triangle/vertex counts.</li>
<li>Manifold/watertight topology checks (boundary, non-manifold edges and vertices).</li>
<li>Overhang angle classification per face.</li>
</ul>` },
    { id: 'approx', h2: 'What is approximate', html: `<ul>
<li><strong>Wall thickness</strong> — ray-sampling estimation; can locally over/under-estimate on concave geometry.</li>
<li><strong>Hollow shell</strong> — inward normal offset; self-intersects where the model is thinner than ~2× the wall.</li>
<li><strong>Auto-orientation</strong> — rotates the dominant face-normal direction down; not a stability-optimized packing.</li>
<li><strong>Add Base</strong> — a rectangular plate under the footprint, not a conformal raft.</li>
<li><strong>Decimation</strong> — lossy by definition; quadric error is minimized, not eliminated.</li>
</ul>` },
    { id: 'responsibility', h2: 'Your responsibility', html: `<p>Verify results (manifold check, visual inspection, cross sections) before printing, machining or shipping anything based on them. 3DTools is not certified engineering software. Nothing here is professional advice.</p>` },
  ],
  faq: [
    ['Can I trust the printability check?', 'It checks the listed geometric criteria exactly and flags approximations as such — but no software guarantees a successful print.'],
    ['Is converted geometry identical?', 'Geometry yes; attributes that the target format cannot represent (colors in STL, materials everywhere) cannot survive conversion.'],
  ],
  related: [['/3d-printing-tools.html', '3D Printing Tools', 'What the checks compute.'], ['/mesh-tools.html', 'Mesh Tools', 'Operation details.'], ['/terms.html', 'Terms', 'Usage terms.'], ['/contact.html', 'Contact', 'Report a problem.']],
},

// ---------------- 404 ----------------
{
  path: '/404.html',
  title: 'Page Not Found — 3DTools',
  description: 'The page you requested does not exist. Browse the 3DTools viewers, converters and mesh tools instead.',
  h1: '404 — page not found',
  intro: `<p>The page you are looking for does not exist (or never did). Nothing was uploaded in the making of this error.</p>`,
  cta: { href: '/app.html', label: 'Open the Studio instead' },
  sections: [
    { id: 'popular', h2: 'Popular pages', html: `
<div class="card-grid">
  <a class="card" href="/"><span class="tag">Start</span><h3>Home</h3><p>Overview of the toolbox.</p></a>
  <a class="card" href="/tools.html"><span class="tag">Browse</span><h3>All Tools</h3><p>Every viewer and converter.</p></a>
  <a class="card" href="/viewer/stl-viewer.html"><span class="tag">Viewer</span><h3>STL Viewer</h3><p>The most used tool.</p></a>
  <a class="card" href="/convert/stl-to-obj.html"><span class="tag">Convert</span><h3>STL to OBJ</h3><p>Popular converter.</p></a>
</div>` },
  ],
  faq: [],
  related: [],
},
];
