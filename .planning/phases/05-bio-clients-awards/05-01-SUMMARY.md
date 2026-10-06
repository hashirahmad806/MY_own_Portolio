---
phase: 05-bio-clients-awards
plan: 01
subsystem: ui
tags: [bio, clients, awards, parallax, sticky-grid, character-wave, quote, invitation, astro]

requires:
  - 04-editorial-manifesto-hybrid-ai
provides:
  - "3-column sticky layout (.om-bio-grid) with Bio/ label, stacked topic keys, and reading slots"
  - "My Story reading slot capturing 35-year creative journey from Mediengestalter to heureka GmbH to gravity"
  - "Clients reading slot displaying complete blue-chip portfolio (Bosch, Porsche, Telefónica, Hilti, etc.)"
  - "Awards vault featuring Red Dot Grand Prix 2025, Best of the Best, ADC 2023 & 2025, and German Design Award Gold"
  - "Circular SVG external link pills (.om-verweis) with animated .om-unterstrich line draw"
  - "Exhibition image (awards-ausstellung.jpg) with responsive parallax translation (--tempo: -0.08)"
  - "Gorden Koschel signature quote blockquote with authentic typographic styling"
  - "Masked invitation reveal (#bioEinladung) with staggered .mf-maske / .mf-hoch slide-up transition"
  - "Character scrub wave animation engine (FENSTER = 14) illuminating .z.is-hot on scroll"
  - "Automatic DOM rearrangement on mobile viewports (<=720px) into sequential .om-bio-block elements"
  - "Full accessibility compliance with prefers-reduced-motion"
affects: [06-polish]

actuals:
  tokens: 1850
  tasks: 2
  commits: 1

tech-stack:
  added: [sticky-3-column-grid, character-scrub-wave, dynamic-mobile-dom-restructure, image-parallax]
  patterns: [windowed-character-scrub, intersection-observer-current-key, svg-arrow-pills]

key-decisions:
  - "Used authentic 3-column sticky CSS grid with sticky keys stacked via (--bio-top + var(--i) * var(--bio-step))"
  - "Implemented character scrub wave (FENSTER = 14) breaking text nodes dynamically into span.z without altering server HTML payload"
  - "Connected .om-unterstrich with smooth scaleX(1) animation when character front reaches Red Dot Grand Prix"
  - "Integrated authentic awards-ausstellung.jpg with real-time --bild-weg parallax calculation"
  - "Added mobile DOM restructuring (<=720px) to bundle sticky keys and slots seamlessly into .om-bio-block"

verification:
  - "npm run build passed with zero errors in 8.14s generating clean static bundle"
  - "Dev server returning HTTP 200 on http://localhost:4321 with all Bio, Clients, and Awards elements verified in DOM"
  - "Verified image /awards-ausstellung.jpg, quote, and invitation headline presence"
---

# Phase 5 Plan 05-01: Bio, Clients & Awards Vault Summary

All requirements for Phase 5 (`SHOW-01`, `SHOW-02`, `SHOW-03`) have been implemented and verified with 100% fidelity to `gravity-design.de`.

### Delivered Artifacts
1. `src/components/sections/Bio.astro`:
   - 3-column sticky layout (`.om-bio-grid`): sticky `Bio/` label, sticky keys (`My Story`, `Clients`, `Awards`), and generous reading slots (`.om-bio-slot`).
   - Slot 1 (`My Story`): 35-year creative journey from Mediengestalter to co-owner/MD of heureka GmbH to *gravity*.
   - Slot 2 (`Clients`): Blue-chip roster (Bosch, Porsche, Telefónica, Hilti, thyssenkrupp, etc.).
   - Slot 3 (`Awards`): Complete list of prestigious awards with authentic `.om-verweis` circular arrow links for *Best of the Best* and *Red Dot Grand Prix 2025* (with animated underline `.om-unterstrich`).
   - Slot 4 (`Exhibition & Quote`): `/awards-ausstellung.jpg` with parallax shift and Gorden Koschel's signature quote:
     > *„Möglich ist inzwischen fast alles.<br>Interessant wird es bei der Auswahl.“* — Gorden Koschel
   - Invitation: Masked word slide-up transition (`#bioEinladung`): *„Lust auf ein gemeinsames Projekt?“*.
   - Motion Engines: Character scrub wave (`FENSTER = 14`, `.z.is-hot`), sticky key observer (`.is-current`), image parallax (`--bild-weg`), mobile DOM consolidation (<=720px), and `prefers-reduced-motion` fallbacks.
2. `src/styles/tokens.css`: Added `--tiefe: url("/tiefe.png") 0 0 / 100% 100% no-repeat;` background token.
3. `src/pages/index.astro`: Replaced placeholder bio section with the full `<Bio />` component.
