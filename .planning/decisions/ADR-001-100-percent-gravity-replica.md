# ADR-001: 100% Exact Gravity Design System Replication

**Status:** APPROVED  
**Date:** 2026-10-06  
**Deciders:** User & Antigravity (Pair Programming)  
**Target:** https://gravity-design.de/

---

## Context

The user explicitly requested a **100% exact, pixel-perfect, animation-identical replica** of `https://gravity-design.de/`:
- "I need completely 100% look like this design for my portfolio. And nothing change its animation, its completely UI design must look like this. And do not change anything."
- All authentic assets, typography, physics formulas, 3D orbit mechanics, and color palettes must be preserved with zero compromises or approximations.

---

## Decisions

### 1. Typography & Font System
- Host and declare the authentic **MG12** grotesque typeface family:
  - `fonts/mg12-regular.woff2` (400)
  - `fonts/mg12-medium.woff2` (500)
  - `fonts/mg12-bold.woff2` (700)
- Configure optical letter-spacing tokens: `--tracking-normal: 0.06em`, `--tracking-wide: 0.1em`, `--tracking-widest: 0.14em`, `--tracking-label: 0.22em`.

### 2. Assets & Case Studies
- 100% of case study data loaded via `public/projekte.json`.
- All 49 high-resolution WebP project images mirrored into `public/orbit-images-opt/`.
- All 14 video loops and high-definition posters mirrored into `public/videos/`.
- Brand and certification SVGs: `heureka-logo-white.svg`, `ai-label-white.svg`, `tiefe.png`, `portrait.jpg`, `awards-ausstellung.jpg`.

### 3. Stage & Mathematical SVG Orbital Physics
- Coordinate Stage: Fixed 1920×1080 viewBox preserving exact aspect scaling (`transform-origin: 0 0`).
- Parametric SVG orbital calculations with concentric ellipses (`#guide-small`, `#guide-ring`), focal markers (`#focus-small`, `#focus-ring`), live coordinate telemetry (`#coord-small`, `#coord-ring`), attractor point, and interactive gravitational trigger (`#hint`, `#brandText`).

### 4. 3D Perspective Orbit World
- Dual z-index layers (`#orbitWorldBack`, `#orbitWorldFront`) with `perspective: 1400px; transform-style: preserve-3d;`.
- Interactive drag-and-spin rotation with inertia, depth darkening (`.orbit-shade`), and dynamic luminance analysis (`auflMessen`) to invert badges over light backgrounds.
- Mode switcher (`#galerieSchalter`) enabling seamless toggle between 3D spherical orbit and linear filmstrip (`.om-galerie`).

### 5. Manifest & Hybrid AI Sections
- Manifest (`.om-bold`) using circular clip-path reveal (`clip-path: circle(80vmax at 50% 50%)`), quadratic Bezier transition curve (`#boldCurve`), and masked typography slide-ups (`.mf-hoch`).
- Constellation plexus (`.om-constellation`) featuring multi-ring orbital tracks, rotating agent icons, and magnetic interactive center portal (`.om-mitte`).
- Bio section with 35-year leadership story, clients velocity ticker, and Hall of Awards with Red Dot Grand Prix 2025.

---

## Consequences

- The portfolio achieves 100% fidelity with the award-winning live site.
- Clean modular Astro components guarantee high maintainability and instant performance.
- Zero dependency bloat: Native CSS3 3D transforms, SVG math, and hardware-accelerated RAF tickers.
