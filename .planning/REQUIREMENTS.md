# Requirements: gravity — Gorden Koschel Portfolio

**Defined:** 2026-10-06
**Core Value:** Deliver an unforgettable, visually stunning, and butter-smooth digital experience that reflects Gorden Koschel's 35-year creative caliber and positions gravity as an elite, high-agency partner for forward-looking brands.

## v1 Requirements

Requirements for initial release. Each maps directly to roadmap phases.

### Foundation & Design System (FOUND)

- [x] **FOUND-01**: Astro project is initialized with clean directory structure, TypeScript, and zero runtime dependencies.
- [x] **FOUND-02**: Modern CSS design system is established with deep dark palette (`#080808`), ivory typography, metallic accents, and fluid scale tokens using `clamp()`.
- [x] **FOUND-03**: Tactile procedural grain/noise overlay is applied across the viewport to create luxury physical editorial feel.
- [x] **FOUND-04**: High-end typography is configured using modern editorial serif for titles and precision Swiss grotesk for body/metadata.

### Motion Engine & Smooth Scrolling (MOTN)

- [x] **MOTN-01**: Lenis smooth scroll engine is configured with buttery inertial physics and dynamic viewport height handling.
- [x] **MOTN-02**: GSAP and ScrollTrigger are initialized and synchronized directly into the Lenis `requestAnimationFrame` loop without jitter.
- [x] **MOTN-03**: Custom magnetic cursor and interactive hover physics are implemented for clickable elements.
- [x] **MOTN-04**: Full accessibility compliance with `prefers-reduced-motion` to smoothly disable inertia and heavy animations when requested.

### Hero & Gravitational Microinteraction (HERO)

- [x] **HERO-01**: Minimalist luxury header displays `gravity — Gorden Koschel — strategy · concept · design` with navigation anchors and contact link.
- [x] **HERO-02**: Hero displays bold kinetic typography title `gorden koschel / visual strategist & creative visualizer`.
- [x] **HERO-03**: Interactive gravitational coordinates module (`945, 592 a 0.4 1003, 575 a 1.5 [gravıty]`) renders with a working "click to gravitize" physics simulation that pulls and snaps elements.

### Manifesto & Hybrid AI (CONT)

- [x] **CONT-01**: Manifesto section ("AgenturohneAgentur. 35 Jahre Erfahrung. Kein Overhead.") features scroll-linked kinetic text illumination.
- [x] **CONT-02**: Agentive By Design / Hybrid AI section clearly articulates the Human Experience + Artificial Intelligence partnership with local models and fast iteration.
- [x] **CONT-03**: Quotes and key philosophies ("Gute Ideen sind am Anfang oft fragil...", "Möglich ist inzwischen fast alles...") are emphasized in editorial pull-quote callouts.

### Bio, Clients & Awards Showcase (SHOW)

- [x] **SHOW-01**: Bio / Story section narrates Gorden Koschel's 35-year journey from graphic designer to heureka GmbH CD/co-owner to *gravity*.
- [x] **SHOW-02**: Blue-chip client showcase (Porsche, Bosch, Telefónica, Hilti, etc.) renders with an interactive velocity marquee and responsive grid.
- [x] **SHOW-03**: Hall of Awards displays prestigious honours including Red Dot Grand Prix 2025, Red Dot Best of the Best, ADC 2023 & 2025, German Design Award Gold, and iF Design Award with interactive metadata.

### Conversion, SEO & Polish (POLISH)

- [x] **POLISH-01**: Prominent Chemistry Meeting Call to Action ("Let’s meet up!") with magnetic hover animation connects to `mailto:losgehts@gravity-design.de?subject=Chemistry-Meeting`.
- [x] **POLISH-02**: Smooth back-to-top button utilizes Lenis `lenis.scrollTo(0)` with custom easing.
- [x] **POLISH-03**: Comprehensive SEO meta tags, OpenGraph preview cards, Twitter cards, and JSON-LD Person/Organization structured data are fully configured.
- [x] **POLISH-04**: Production build succeeds with 0 errors and verified responsive layout across mobile, tablet, and desktop viewports.
