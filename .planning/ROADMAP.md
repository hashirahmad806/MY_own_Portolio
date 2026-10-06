# Roadmap: gravity — Gorden Koschel Portfolio

## Overview

A phased journey to build a world-class, luxury editorial portfolio for Gorden Koschel (*gravity*). Starting from solid Astro foundation and bespoke design tokens, integrating a jitter-free Lenis + GSAP motion engine, assembling the kinetic hero with celestial "gravitize" physics, delivering scrubbed editorial storytelling for the manifesto and AI workflow, constructing the blue-chip client and awards vault, and culminating with conversion optimization and launch validation.

## Phases

- [x] **Phase 1: Foundation & Design System** - Initialize Astro, bespoke CSS tokens, typography, and luxury grain overlay.
- [ ] **Phase 2: Motion Engine & Global Architecture** - Integrate Lenis smooth scrolling, GSAP ScrollTrigger RAF loop, and header navigation.
- [ ] **Phase 3: Hero & Gravitize Physics Interaction** - Build kinetic hero titles and the interactive "click to gravitize" coordinate physics simulation.
- [ ] **Phase 4: Editorial Manifesto & Hybrid AI Showcase** - Implement scroll-linked text scrubbing for the manifesto and agentic AI workflow section.
- [ ] **Phase 5: Bio, Client Marquee & Awards Vault** - Implement 35-year story, interactive blue-chip client velocity ticker, and award showcase.
- [ ] **Phase 6: Conversion, SEO & Launch Verification** - Connect Chemistry Meeting magnetic CTA, Lenis back-to-top, SEO metadata, and responsive QA.

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: Initialize Astro project, establish typography, color tokens, and ambient noise overlay.
**Depends on**: Nothing
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Astro runs in dev mode with zero build errors and strict TypeScript configuration.
  2. CSS variables provide cohesive tokens for deep obsidian dark mode, warm ivory text, and metallic accents.
  3. Google Fonts (Syne/Cinzel/Italiana or editorial serif + Inter/Plus Jakarta Sans) and responsive fluid typography scales load cleanly.
  4. Subtle procedural SVG noise overlay renders across viewport without obstructing layout interaction.
**Plans**: 1 plan

Plans:
- [x] 01-01: Initialize Astro project, configure styling architecture, design tokens, typography, and base layout.

---

### Phase 2: Motion Engine & Global Architecture
**Goal**: Wire Lenis smooth scrolling with GSAP ScrollTrigger via requestAnimationFrame and assemble header navigation.
**Depends on**: Phase 1
**Requirements**: MOTN-01, MOTN-02, MOTN-03, MOTN-04, HERO-01
**Success Criteria** (what must be TRUE):
  1. Lenis provides smooth inertial scrolling synced with GSAP ScrollTrigger without jitter or tearing.
  2. Custom magnetic cursor responds to cursor position and snaps to interactive targets.
  3. `prefers-reduced-motion` cleanly disables smooth inertia and heavy kinetic effects for accessibility.
  4. Luxury header renders brand statement `gravity — Gorden Koschel — strategy · concept · design` with navigation links.
**Plans**: 1 plan

Plans:
- [ ] 02-01: Implement Lenis smooth scroll provider, GSAP ticker synchronization, magnetic cursor, and header.

---

### Phase 3: Hero & Gravitize Physics Interaction
**Goal**: Build kinetic hero section and the interactive gravitational coordinate pull simulation.
**Depends on**: Phase 2
**Requirements**: HERO-02, HERO-03
**Success Criteria** (what must be TRUE):
  1. Hero displays `gorden koschel / visual strategist & creative visualizer` with staggered kinetic entrance animation.
  2. Coordinate module `945, 592 a 0.4 1003, 575 a 1.5 [gravıty]` is rendered with interactive canvas or physics elements.
  3. Clicking "click to gravitize" triggers a dynamic gravitational collapse/attraction particle effect that smoothly restores to equilibrium.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Build Hero section with kinetic typography and interactive "click to gravitize" physics simulation.

---

### Phase 4: Editorial Manifesto & Hybrid AI Showcase
**Goal**: Implement scroll-scrubbed manifesto text illumination and hybrid AI narrative.
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. Manifesto copy ("Agentur ohne Agentur. 35 Jahre Erfahrung...") illuminates line by line or word by word as the user scrolls.
  2. Hybrid AI ("Human experience. Artificial intelligence.") section clearly presents the modern agency model with local models and agile execution.
  3. Editorial pull-quotes ("Gute Ideen sind am Anfang oft fragil...") stand out with luxury typographic hierarchy.
**Plans**: 1 plan

Plans:
- [ ] 04-01: Build Manifesto with GSAP scroll-linked text illumination and Hybrid AI section.

---

### Phase 5: Bio, Client Marquee & Awards Vault
**Goal**: Showcase 35 years of creative track record, blue-chip client roster, and major awards.
**Depends on**: Phase 4
**Requirements**: SHOW-01, SHOW-02, SHOW-03
**Success Criteria** (what must be TRUE):
  1. Bio & Story section articulates Gorden Koschel's background and heureka GmbH Creative Director leadership.
  2. Blue-chip clients (Porsche, Bosch, Telefónica, Hilti, etc.) scroll smoothly in an interactive velocity ticker and grid.
  3. Awards section features Red Dot Grand Prix 2025, Best of the Best, ADC, and German Design Award Gold with interactive badges and links.
**Plans**: 1 plan

Plans:
- [ ] 05-01: Build Bio section, interactive client marquee, and prestige Awards vault.

---

### Phase 6: Conversion, SEO & Launch Verification
**Goal**: Implement Chemistry Meeting CTA, Lenis back-to-top, SEO schema, and verify responsive performance.
**Depends on**: Phase 5
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04
**Success Criteria** (what must be TRUE):
  1. Chemistry Meeting CTA ("Let’s meet up!") features a magnetic button linking to `mailto:losgehts@gravity-design.de?subject=Chemistry-Meeting`.
  2. "Back to top" button smoothly scrolls to the top of the page using Lenis.
  3. Full SEO metadata, OpenGraph tags, and JSON-LD structured data are validated.
  4. Production build (`npm run build`) completes with zero errors and responsive layout verified.
**Plans**: 1 plan

Plans:
- [ ] 06-01: Implement Chemistry Meeting CTA, back-to-top, SEO structured metadata, and perform end-to-end validation.
