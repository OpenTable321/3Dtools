# 3DTools

Free, local-first 3D model toolbox: viewer, converter, repair and analysis tools for
STL, OBJ, PLY, GLB/GLTF and 3MF meshes. Static site, no backend — every operation
runs in the visitor's browser.

## Run locally

```bash
npm install          # dev-only: playwright for browser tests
npx http-server -p 8080 -c-1
# open http://127.0.0.1:8080
```

## Test

```bash
npm test                 # core library: IO round-trips + mesh operations
npm run samples          # regenerate tests/samples/* with the real exporters
npm run test:browser     # full Playwright suite (uses system Edge via channel msedge)
```

The browser test expects the dev server on `http://127.0.0.1:8080`.

## Structure

- `assets/js/lib/` — mesh core (no dependencies): `mesh.js`, IO in `io/`,
  operations in `ops/` (repair, decimate, analyze, geometry, slice)
- `assets/js/app/` — studio UI: `main.js` (wiring), `viewer.js` (Three.js scene),
  `rpc.js` + `workers/meshops.worker.js` (off-thread processing)
- `assets/vendor/` — vendored Three.js and OrbitControls (no CDN at runtime)
- `site/` — static site generator for the 26 marketing/SEO pages
- `app.html` — the studio itself
- `tests/` — Node test suites + sample files

Regenerate the marketing pages after editing `site/`:

```bash
npm run build:site
```

## Conventions

- No fake features: every tool is implemented; approximate operations state their
  limitations in the UI (see `disclaimer.html`).
- No runtime CDN dependencies: Three.js is vendored locally.
- Ads go only in clearly-marked `.ad-slot` containers, never near functional controls.
