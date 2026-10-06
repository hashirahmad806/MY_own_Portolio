# Architecture Specification & ADR: 100% Exact Gravity Design System

**Target Reference:** https://gravity-design.de/  
**Objective:** Deliver a 100% pixel-perfect, animation-identical, asset-complete replica of the authentic Gravity Gorden Koschel portfolio within the Astro architecture.

---

## 1. Architectural Decisions (ADR)

### ADR-001: Font Typography — Authentic MG12 WOFF2 Fonts
- **Context:** The live site uses proprietary grotesque `MG12` (Regular, Medium, Bold) with custom optical kerning and tabular coordinates, rather than generic Google Fonts.
- **Decision:** Fetch and host `mg12-regular.woff2`, `mg12-medium.woff2`, and `mg12-bold.woff2` locally inside `public/fonts/` with `@font-face` declarations matching the exact letter-spacing tokens (`0.06em`, `0.14em`, `0.22em`).

### ADR-002: Hero Stage & Mathematical SVG Orbital Physics
- **Context:** The authentic site's hero is an interactive SVG coordinate simulation (`#svg`, `width="1920"`, `height="1080"`) with real-time parametric orbital calculations:
  - Concentric ellipses: `#guide-small`, `#guide-ring`
  - Focal points: `#focus-small`, `#focus-ring`
  - Live coordinate readouts: `#coord-small` (`coord-small-xy`, `coord-small-a`), `#coord-ring` (`coord-ring-xy`, `coord-ring-a`)
  - Kinetic mass elements: `#mass`, `#small`, `#ring`, `#attractor`
  - Interactive trigger: `#hint` ("click to gravitize") and brand text `#brandText` ("gravıty").
- **Decision:** Implement the exact SVG coordinate engine (`Script 1`) driven by the requestAnimationFrame loop, maintaining identical coordinate math ($x, y$ coordinates and angles $\alpha$).

### ADR-003: 3D Orbit Carousel & Perspective World
- **Context:** The central showcase is a full 3D interactive orbital space:
  - Dual z-index layers: `#orbitBack` (behind content) and `#orbitFront` (in front of content).
  - CSS 3D Transforms: `perspective: 1400px; transform-style: preserve-3d;`
  - Drag-to-orbit physics with momentum inertia, card tilting, and depth-shading (`.orbit-shade`).
  - Project cards featuring Heureka badges (`heureka-logo-white.svg`), AI badges (`ai-label-white.svg`), and slide/video layers.
  - View switcher: `#galerieSchalter` toggles between 3D spherical orbit and linear gallery mode (`.om-galerie`).
- **Decision:** Integrate the exact 3D orbit engine (`Script 24`) into modular Astro components, ensuring full touch and desktop fine-pointer drag physics.

### ADR-004: Manifest Section & Circular Clip-Path Reveal
- **Context:** The Manifest section (`.om-bold`) transitions through an SVG curved edge (`#boldCurvePath`) into a full-bleed lilac section (`var(--accent)`) with:
  - Dynamic expanding clip-path: `clip-path: circle(80vmax at 50% 50%)`
  - Rotating orbital ring and satellite dot: `.mf-ring-feld`, `.mf-ring-bahn`, `.mf-punkt`
  - Masked line reveals: `.mf-maske` with `.mf-hoch` slide-up text animation
  - Live strike-through on "Agentur ohne ~~Agentur~~."
- **Decision:** Replicate the exact DOM hierarchy, keyframe animations, and ScrollTrigger pinning for the Manifest.

### ADR-005: Interactive Constellation & Hybrid AI Plexus
- **Context:** The Hybrid AI section features a spinning interactive constellation SVG (`.om-constellation`) with rotating tracks (`.cn-track`), orbiting moons, pulsing plexus connection lines, and a central interactive portal button (`.om-mitte`).
- **Decision:** Port the exact SVG constellation markup and rotational ticker loops.

---

## 2. Domain Glossary

| Term | Live Site Class / ID | Description |
|------|----------------------|-------------|
| **Stage** | `#stage`, `.stage` | Fixed 1080p coordinate viewport holding the hero scene and SVG orbital engine. |
| **Lockup** | `#lockup`, `.om-lockup` | Typographic brand lockup: `gorden koschel / visual strategist & creative visualizer`. |
| **Claim** | `#claim`, `.om-claim` | Editorial claim `strategy · concept · design` positioned at `left: 1120px; top: 646px`. |
| **Orbit World** | `#orbitWorldBack`, `#orbitWorldFront` | 3D space with CSS perspective rendering the floating client work cards. |
| **Bold Curve** | `#boldCurve`, `#boldCurvePath` | Organic quadratic Bezier SVG curve transitioning from dark obsidian to lilac accent. |
| **Manifesto Ring** | `#mfRing`, `.mf-ring-feld` | Celestial orbital indicator with continuous circular satellite revolution. |
| **Constellation** | `.om-constellation` | Multi-tiered spinning plexus network illustrating client and AI agent nodes. |
| **Kontakt Kugel** | `#kontakt`, `.om-kontakt-kugel` | Magnetic fluid contact orb with interactive hover expansion. |
