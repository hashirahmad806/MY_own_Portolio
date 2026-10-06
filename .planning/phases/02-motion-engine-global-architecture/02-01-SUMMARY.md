---
phase: 02-motion-engine-global-architecture
plan: 01
subsystem: motion
tags: [lenis, gsap, scrolltrigger, custom-cursor, magnetic, header, navigation]

requires:
  - 01-foundation-design-system
provides:
  - "Synchronized Lenis 1.1 + GSAP ScrollTrigger RAF motion bridge (motion.ts)"
  - "GSAP ticker integration with lagSmoothing(0) preventing jitter"
  - "prefers-reduced-motion graceful fallback disabling inertia and acceleration"
  - "Dual-layer magnetic cursor with GSAP quickTo hardware-accelerated tracking"
  - "MagneticWrapper.astro utility applying proportional pull physics on interactive elements"
  - "Editorial Header.astro with brand lockup, anchor links (#manifesto, #bio), and magnetic contact link"
  - "Full integration into Layout.astro"
affects: [03-hero, 04-manifesto, 05-credentials, 06-polish]

actuals:
  tokens: 1420
  tasks: 3
  commits: 1

tech-stack:
  added: [lenis, gsap, gsap-scrolltrigger]
  patterns: [raf-synchronization, gsap-quickto, magnetic-physics, astro-client-modules]

key-decisions:
  - "lenis.on('scroll', ScrollTrigger.update) ensures GSAP receives smoothed virtual scroll values rather than raw events"
  - "gsap.ticker.add drives Lenis.raf directly, avoiding multiple concurrent animation frames"
  - "gsap.ticker.lagSmoothing(0) eliminates double-smoothing stutter"
  - "gsap.quickTo provides 60fps+ cursor tracking without instantiating new tweens per frame"
  - "Automatic fallback hides custom cursor on touch/coarse devices via CSS media query (pointer: coarse)"

verification:
  - "npm run build passed in 1.81s with static page generation and zero errors"
  - "Dev server active on http://localhost:4321 with HTTP 200 response"
  - "Cursor and magnetic physics verified on desktop pointers"
---

# Phase 2 Plan 02-01: Motion Engine & Global Architecture Summary

All motion infrastructure and global navigation requirements (`MOTN-01`, `MOTN-02`, `MOTN-03`, `MOTN-04`, `HERO-01`) have been implemented and verified.

### Delivered Artifacts
1. `src/scripts/motion.ts`: Synchronized Lenis + GSAP ScrollTrigger requestAnimationFrame engine with `lagSmoothing(0)`, reduced-motion detection, and `scrollTo()` helper.
2. `src/components/ui/CustomCursor.astro`: Hardware-accelerated dual-layer cursor (inner accent dot + outer smooth-delayed ring) driven by `gsap.quickTo`.
3. `src/components/ui/MagneticWrapper.astro`: Reusable container providing proportional magnetic pull on hover with elastic return physics.
4. `src/components/sections/Header.astro`: Luxury editorial header with `gravity — Gorden Koschel` brand lockup, `#manifesto`, `#bio`, and magnetic `#contact` anchor.
5. `src/layouts/Layout.astro`: Updated to mount `CustomCursor`, `Header`, and load the motion engine bundle.
6. `src/pages/index.astro`: Section anchors and generous scroll height for verifying Lenis momentum and ScrollTrigger state changes.
