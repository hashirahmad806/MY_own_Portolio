# Architecture Research

**Domain:** High-End Creative Portfolio & Interactive Agency Showcase
**Researched:** 2026-10-06
**Confidence:** HIGH

## System Architecture

### Architectural Pattern: Astro Island + Global Motion Driver

Astro's island architecture allows static HTML to be delivered with zero JavaScript payload by default, while selective client scripts handle the smooth scroll lifecycle, GSAP animations, and interactive physics.

```
┌─────────────────────────────────────────────────────────────┐
│                       Astro Layout                          │
│  - SEO Meta / Social Cards / JSON-LD Schema                 │
│  - CSS Custom Properties & Design Tokens                    │
│  - Grain Texture Overlay & Gravitational Ambient Canvas     │
├─────────────────────────────────────────────────────────────┤
│                    Global Motion Runtime                    │
│  - Lenis Smooth Scroll Instance                             │
│  - GSAP ticker synchronized with Lenis RAF loop             │
│  - Custom Cursor & Magnetic Attraction System               │
├─────────────────────────────────────────────────────────────┤
│                    Section Components                       │
│  1. Header / Navigation & Audio/Mode Toggles                │
│  2. Hero ("gravity — Gorden Koschel")                       │
│  3. Interactive Coordinates & "Click to Gravitize" Physics │
│  4. Manifesto ("Agentur ohne Agentur / 35 Jahre Erfahrung") │
│  5. Hybrid AI & Agentic Workflow Showcase                   │
│  6. Bio / My Story (Heureka legacy & creative direction)    │
│  7. Client Marquee / Grid (Porsche, Bosch, Telefónica...)   │
│  8. Prestigious Awards Vault (Red Dot Grand Prix 2025, ADC) │
│  9. Chemistry Meeting Call To Action & Footer               │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.astro
│   │   ├── MagneticWrapper.astro
│   │   ├── GrainOverlay.astro
│   │   └── CustomCursor.astro
│   ├── sections/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── GravitizeInteractive.astro
│   │   ├── Manifesto.astro
│   │   ├── HybridAI.astro
│   │   ├── Bio.astro
│   │   ├── Clients.astro
│   │   ├── Awards.astro
│   │   └── ContactFooter.astro
│   └── motion/
│       └── MotionManager.astro (Lenis + GSAP RAF hookup)
├── data/
│   ├── clients.ts
│   ├── awards.ts
│   └── portfolioData.ts
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
├── styles/
│   ├── reset.css
│   ├── tokens.css
│   ├── typography.css
│   └── global.css
└── scripts/
    ├── lenis-init.ts
    ├── gsap-animations.ts
    └── gravity-interactive.ts
```

### Motion Integration Strategy

To eliminate jitter and desynchronization between smooth scroll (Lenis) and scroll triggers (GSAP ScrollTrigger):
```javascript
// Crucial synchronization pattern:
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```
