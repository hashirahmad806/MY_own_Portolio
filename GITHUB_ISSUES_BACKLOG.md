# GitHub Issues Backlog — Remaining Tasks for 100% Gravity Replica

This file catalogs all remaining implementation tasks and potential enhancements as ready-to-file GitHub Issues. You can easily copy and paste these into your GitHub repository issue tracker at [https://github.com/hashirahmad806/MY_own_Portolio/issues](https://github.com/hashirahmad806/MY_own_Portolio/issues) whenever you resume.

---

### Issue 1: [COMPLETED] Phase 5 — Bio, Client Marquee & Awards Vault (`SHOW-01`, `SHOW-02`, `SHOW-03`)
**Labels:** `completed`, `phase-5`

#### Description
Build the Bio and Credentials showcase to narrate Gorden Koschel's 35-year creative caliber and blue-chip track record.

#### Tasks
- [x] Create `src/components/sections/Bio.astro`:
  - **My Story**: '72 geboren als „irgendwas mit kreativ“... Mediengestalter, Diplom Grafik-Designer FH, Creative Director und Mitinhaber heureka GmbH (Top 50 PAGE-Agenturen).
  - **Client Roster**: Authentic client list with character scrub wave illumination (`.z.is-hot`) featuring Bosch, Vorwerk, Telefónica, HOCHTIEF, Gewobag, Hilti, thyssenkrupp, MLP, Giesecke+Devrient, BYK-Chemie, Fraport, Porsche.
  - **Hall of Awards**: Interactive award vault with circular SVG arrow links (`.om-verweis`) for Red Dot Best of the Best and Red Dot Grand Prix 2025 (with animated underline `.om-unterstrich`).
  - **Exhibition Image**: Mount `awards-ausstellung.jpg` with `--tempo: -0.08` parallax translation.
  - **Quote Callout**: „Möglich ist inzwischen fast alles. Interessant wird es bei der Auswahl.“ — Gorden Koschel.
  - **Invitation Transition**: Masked word slide-up transition (`#bioEinladung`): „Lust auf ein gemeinsames Projekt?“.
- [x] Connect with ScrollTrigger, IntersectionObserver, and mobile dynamic DOM consolidation (<=720px).

---

### Issue 2: Implement Phase 6 — Chemistry Meeting Magnetic CTA & Footer Polish (`POLISH-01`, `POLISH-02`, `POLISH-03`)
**Labels:** `enhancement`, `phase-6`, `priority: high`

#### Description
Deliver the high-converting close of the portfolio: the magnetic meeting trigger, Lenis back-to-top, and final legal/SEO footer.

#### Tasks
- [ ] Create `src/components/sections/ContactFooter.astro`:
  - **Meeting CTA**: "Lust auf ein gemeinsames Projekt? Let’s meet up!" linking to `mailto:losgehts@gravity-design.de?subject=Chemistry-Meeting`.
  - **Magnetic Contact Orb**: Proportional cursor attraction physics matching `.om-kontakt-kugel`.
  - **Back to Top**: Smooth Lenis scroll button utilizing `scrollTo(0)` with custom easing.
  - **Footer**: Brand statement, copyright, and subtle navigation anchors.
- [ ] Validate OpenGraph, Twitter Cards, and schema.org JSON-LD structured data.

---

### Issue 3: Stage SVG Orbital Telemetry Mirroring (`HERO-STAGE`)
**Labels:** `ui`, `motion`, `priority: medium`

#### Description
Mirror the exact 1920×1080 stage SVG coordinate calculation engine from Script 1 of gravity-design.de.

#### Tasks
- [ ] Integrate the parametric SVG coordinate displays (`#guide-small`, `#guide-ring`, `#coord-small`, `#coord-ring`) showing live numerical coordinates (`945, 592 a 0.4 1003, 575 a 1.5`) as an alternative/layered mode with the canvas engine.
- [ ] Verify exact scaling behaviour across ultra-wide and mobile viewports.

---

### Issue 4: Mobile Video Autoplay & Touch Performance QA (`PERF`)
**Labels:** `mobile`, `performance`, `qa`

#### Description
Ensure all video loops and touch interactions in the 3D Orbit carousel operate with 60fps fluidity on iOS Safari and Android Chrome.

#### Tasks
- [ ] Verify `playsinline`, `muted`, and low-power autoplay on mobile devices for the 14 project video loops in `/public/videos/`.
- [ ] Verify touch drag responsiveness on `#orbitFront` across mobile viewports.
- [ ] Run Lighthouse performance audit aiming for 95+ score.
