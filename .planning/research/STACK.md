# Stack Research

**Domain:** High-End Creative Director / Visual Strategist Portfolio (Astro + GSAP + Lenis)
**Researched:** 2026-10-06
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | ^5.x (latest) | Static Site Generator & Island Architecture | Zero JS by default, instant page load, first-class SEO, flexible component model, ideal for editorial portfolios with heavy media/motion. |
| Lenis (`lenis`) | ^1.1.x | Smooth Scrolling Engine | Lightweight (3KB), modern, butter-smooth inertial scroll, native integration with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. |
| GSAP (`gsap`) | ^3.12.x | High-Performance Kinetic Animation | Industry gold-standard for complex timeline animations, ScrollTrigger scroll scrubbing, pinning, split-text kinematics, and physics/gravity microinteractions. |
| Vanilla CSS / CSS Modules | Standard CSS3 | Design System & Styling | High agency control, zero framework overhead, CSS custom properties for dynamic theming and gravitational coordinate updates, perfect responsive typography using `clamp()`. |
| TypeScript | ^5.x | Type safety & Component Props | Ensures robust structured data handling for clients, awards, and manifesto content. |

### Supporting Libraries & Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@studio-freight/lenis` / `lenis` | ^1.1.x | Smooth Scroll | Initialized in global client script with `requestAnimationFrame` loop. |
| `gsap/ScrollTrigger` | ^3.12.x | Scroll-linked animation & pinning | Used on section reveals, horizontal ticker for clients, manifesto line highlights, and award showcase. |
| Canvas / WebGL (Vanilla) | Native | Subtle Gravitational Particle / Ambient Dust Field | Optional ambient background layer to reinforce the "gravity" theme without dragging FPS down. |

### Development & Build Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vite (built-in Astro) | Ultra-fast HMR and bundling | Native ESM, lightning-fast development cycle. |
| Sharp | Image optimization | Built into Astro for converting assets to WebP/AVIF with responsive `srcset`. |
| ESLint & Prettier | Code quality & formatting | Clean, maintainable code base. |
