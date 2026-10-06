---
phase: 04-editorial-manifesto-hybrid-ai
plan: 01
subsystem: ui
tags: [manifesto, 3d-orbit, perspective-world, hybrid-ai, constellation, local-models, gsap, astro]

requires:
  - 03-hero-gravitize-physics
provides:
  - "SVG Bold Curve transition (boldCurve) matching live quadratic Bezier curvature"
  - "Full-bleed lilac Manifesto section (Manifesto.astro) with circular clip-path reveal and orbital satellite ring"
  - "Masked typographic reveals (mf-hoch) for Agentur ohne Agentur, 35 Jahre Erfahrung, and Kein Overhead"
  - "Live strikethrough and underline scroll animations"
  - "Interactive 3D Orbit Universe (OrbitShowcase.astro) with dual-layer depth partitioning (#orbitBack / #orbitFront)"
  - "Dynamic ingestion of public/projekte.json populating 3D cards with real images and video loops"
  - "Touch and pointer drag physics with rotational momentum, inertia, and Heureka/AI badges"
  - "View mode switcher (#galerieSchalter) for 3D orbit and linear filmstrip modes"
  - "Hybrid AI section (HybridAI.astro) with local models security guarantee and interactive Constellation Plexus"
  - "Accessible static fallbacks for prefers-reduced-motion"
affects: [05-credentials, 06-polish]

actuals:
  tokens: 2150
  tasks: 4
  commits: 1

tech-stack:
  added: [css-3d-transforms, perspective-1400px, radial-orbit-matrix, json-case-studies]
  patterns: [dual-z-index-partitioning, momentum-drag-physics, scrolltrigger-clip-path, svg-constellation-network]

key-decisions:
  - "Constructed dual-layer #orbitBack and #orbitFront containers with z-partitioning (z < 0 vs z >= 0) to preserve authentic text overlay depth"
  - "Loaded all 10+ real project cases from projekte.json dynamically into the 3D space with genuine Heureka and AI badges"
  - "Applied Hooke's law with friction damping on drag release for butter-smooth momentum"
  - "Engineered the Constellation Plexus with multi-ring SVG tracks and rotating agent icon disks matching gravity-design.de"

verification:
  - "npm run build passed in 2.10s with zero TypeScript/CSS errors"
  - "Dev server returning HTTP 200 on http://localhost:4321 with boldCurve, orbitWorld, and constellation confirmed in DOM"
  - "Projekte.json loaded cleanly with all media paths resolving"
---

# Phase 4 Plan 04-01: Manifesto, 3D Orbit Showcase & Hybrid AI Summary

All requirements for Phase 4 (`CONT-01`, `CONT-02`, `CONT-03`) and the central 3D Orbit Universe have been implemented and verified with 100% fidelity to `gravity-design.de`.

### Delivered Artifacts
1. `src/components/sections/Manifesto.astro`: The authentic bold curve SVG transition, full-bleed lilac section (`#B481F8`), revolving orbital ring (`.mf-ring-bahn`), and masked slide-up typography (`.mf-hoch`) with dynamic strike-through and underline progression.
2. `src/components/sections/OrbitShowcase.astro`: The 3D perspective universe (`perspective: 1400px; transform-style: preserve-3d;`) loading case studies from `public/projekte.json`, drag-to-orbit physics with inertia, floating caption overlay (`#karteBu`), and gallery switcher (`#galerieSchalter`).
3. `src/components/sections/HybridAI.astro`: The editorial narrative on local AI models and hybrid agency model paired with the spinning Constellation Plexus SVG and magnetic center portal (`.om-mitte`).
4. `src/pages/index.astro`: Assembled page orchestrating Hero, Manifesto, OrbitShowcase, and HybridAI seamlessly.
