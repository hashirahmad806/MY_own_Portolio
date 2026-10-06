---
phase: 03-hero-gravitize-physics
plan: 01
subsystem: ui
tags: [hero, kinetic-typography, canvas, physics, gravitize, portrait, gsap]

requires:
  - 02-motion-engine-global-architecture
provides:
  - "Kinetic Hero section (Hero.astro) with bold display typography, role & claim lockup"
  - "High-end editorial presentation of portrait.jpg with 3D mouse tilt and ambient backlight"
  - "Core proof metric pills: 35 Jahre Erfahrung, 0 Kein Overhead, 2025 Red Dot Grand Prix"
  - "GSAP staggered entrance timeline with ScrollTrigger parallax scrub"
  - "Interactive Gravitize coordinate module (GravitizeInteractive.astro) displaying authentic coordinates"
  - "Hardware-accelerated HTML5 Canvas Newtonian gravitational collapse simulation with damped spring rebound"
  - "Accessible static fallback for prefers-reduced-motion"
affects: [04-manifesto, 05-credentials, 06-polish]

actuals:
  tokens: 1850
  tasks: 3
  commits: 1

tech-stack:
  added: [html5-canvas, newtonian-gravitation, damped-spring-physics]
  patterns: [canvas-dpr-scaling, gsap-timeline-entrance, mouse-parallax-tilt, magnetic-wrapper-cta]

key-decisions:
  - "Implemented pure TypeScript HTML5 Canvas for the Gravitize particle simulation, eliminating heavy external physics library dependencies"
  - "Newtonian inverse-square force (F ∝ 1/(r + 30)) with angular tangential impulse creates cinematic whirlpool vortex into the singularity"
  - "Hooke's law with damping (springK: 0.045, damping: 0.88) provides fluid rebound without particle oscillation blowup"
  - "Integrated 3D perspective mouse tilt on the portrait card using pointer: fine media query for tactile responsiveness"

verification:
  - "npm run build passed in 1.15s with zero TypeScript/CSS errors"
  - "Dev server returning HTTP 200 on http://localhost:4321 with all hero and canvas elements confirmed in DOM"
  - "Reduced motion accessibility verified with instant static reveal"
---

# Phase 3 Plan 03-01: Hero & Gravitize Physics Interaction Summary

All Hero and Gravitize requirements (`HERO-02`, `HERO-03`) have been implemented and verified.

### Delivered Artifacts
1. `src/components/sections/Hero.astro`: Marquee section featuring fluid clamp headline `gorden koschel`, role `visual strategist & creative visualizer`, claim `strategy · concept · design`, portrait card with duotone depth and 3D tilt, and three proof stat cards.
2. `src/components/sections/GravitizeInteractive.astro`: Coordinate module (`945, 592 a 0.4 1003, 575 a 1.5 [gravıty]`) and 60fps HTML5 Canvas physics engine with singularity collapse, shockwave flare, damped harmonic rebound, and live HUD status readout.
3. `src/pages/index.astro`: Assembled page mounting `<Hero />` with integrated `<GravitizeInteractive />` alongside anchor targets for `#manifesto` and `#bio`.
