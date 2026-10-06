# Project Research Summary

**Project:** gravity — Gorden Koschel Creative Portfolio
**Domain:** Creative Director / Visual Strategist Interactive Portfolio
**Researched:** 2026-10-06
**Confidence:** HIGH

## Executive Summary

The project is an agency-grade, luxury editorial portfolio for **Gorden Koschel** (Visual Strategist & Creative Visualizer / *gravity*), translating 35 years of high-level creative direction and award-winning leadership (Red Dot Grand Prix 2025, German Design Award Gold, ADC) into a state-of-the-art interactive digital experience.

The user has explicitly specified:
- **Framework:** Astro (for superior performance, clean component architecture, and zero-JS baseline)
- **Scroll Engine:** Lenis (`lenis`) for fluid, cinematic inertial scrolling
- **Animation Engine:** GSAP (`gsap` + `ScrollTrigger`) for bespoke kinetic typography, scroll scrubbing, and gravitational microinteractions.
- **Aesthetic Direction:** Deep Dark Editorial & Gravitational (`#080808` obsidian theme, warm ivory typography, subtle metallic accents, noise grain texture, celestial coordinates physics).
- **Architecture:** Single-Page Long-Form Experience with modular Astro components and responsive layout.

## Key Findings

### Recommended Stack
- **Astro 5.x:** Core static generator, zero runtime overhead.
- **Lenis 1.1.x:** Smooth scroll engine synced via RAF.
- **GSAP 3.12.x:** ScrollTrigger, kinetic timelines, magnetic triggers.
- **Vanilla CSS3:** Custom properties design tokens, typography scale, responsive layout.

### Implementation Priorities
1. **Zero-Friction Motion Lifecycle:** Proper Lenis-GSAP synchronization without layout recalculations or memory leaks.
2. **Editorial Gravitas:** Rich, impactful presentation of the German copy from `PORTFOLIO.MD`, highlighting the "Agentur ohne Agentur" philosophy, hybrid AI collaboration, prestigious client list (Porsche, Bosch, Telefónica), and awards.
3. **Responsive & Accessible:** Flawless mobile rendering with `100dvh` units and `prefers-reduced-motion` fallbacks.
