# Pitfalls & Mitigations Research

**Domain:** High-Performance Creative Portfolio with Lenis & GSAP in Astro
**Researched:** 2026-10-06
**Confidence:** HIGH

## Common Pitfalls & Anti-Patterns

### 1. Scroll Desync & Jitter Between Lenis and GSAP ScrollTrigger
- **Issue:** Lenis operates on a virtual scroll delta and interpolates scroll position inside a custom `requestAnimationFrame` loop. If GSAP ScrollTrigger listens directly to the native window scroll event simultaneously, parallax markers and pinning will jitter noticeably.
- **Mitigation:** Always link `lenis.on('scroll', ScrollTrigger.update)` and direct `gsap.ticker.add((time) => lenis.raf(time * 1000))` while disabling `lagSmoothing` (`gsap.ticker.lagSmoothing(0)`).

### 2. Hydration Bloat & Client JavaScript Overhead
- **Issue:** Frameworks like Next.js or heavy React trees load large runtime JS bundles that delay First Contentful Paint (FCP) and degrade Lighthouse performance scores.
- **Mitigation:** Use Astro's Zero-JS default. All markup is rendered to static HTML at build time. Client JS is strictly isolated to targeted scripts (`<script>` modules) for Lenis and GSAP, yielding 95-100 Lighthouse performance.

### 3. Layout Shifts (CLS) Due to Kinetic Animations
- **Issue:** Pinning sections or dynamically altering DOM element dimensions on scroll triggers layout recalculations, causing Cumulative Layout Shift (CLS).
- **Mitigation:** Use `transform` (GPU accelerated: `translate3d`, `scale`) and `opacity` exclusively for animations. Set explicit aspect ratios or minimum heights on pinning containers. Call `ScrollTrigger.refresh()` after fonts and images have finished loading.

### 4. Accessibility & Reduced Motion Disregard
- **Issue:** Users with vestibular disorders or motion sensitivity can experience nausea or disorientation from smooth inertia scrolling and kinetic typography.
- **Mitigation:** Implement `@media (prefers-reduced-motion: reduce)` queries. When active, disable Lenis inertial smoothing, revert to standard instant browser scrolling, and skip kinetic entrance stagger timelines.

### 5. Mobile Touch Lag & Viewport Address Bar Resizing
- **Issue:** On iOS Safari and Chrome Android, smooth scroll engines can fight native touch inertia or cause jumping when the mobile URL bar collapses.
- **Mitigation:** Configure Lenis `smoothWheel: true` while ensuring native touch scrolling remains fluid or configuring `touchMultiplier: 1.5-2` carefully, and using `100dvh` (dynamic viewport height) rather than `100vh`.
