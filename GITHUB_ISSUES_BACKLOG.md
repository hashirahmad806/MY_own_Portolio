# GitHub Issues & Work Backlog — Hashir Ahmad Portfolio

This document catalogs all implemented milestones and upcoming work as ready-to-file GitHub Issues. You can easily reference or file these into your repository issue tracker at [https://github.com/hashirahmad806/MY_own_Portolio/issues](https://github.com/hashirahmad806/MY_own_Portolio/issues).

---

## 🏆 Completed Milestones & Issues (Session Archive)

### Issue 1: [RESOLVED] Phase 5 — Bio, Skills Roster & Awards Vault (`SHOW-01`, `SHOW-02`)
**Labels:** `completed`, `phase-5`, `ui`
- Created `src/components/sections/Bio.astro` with 3-column sticky responsive grid.
- Implemented authentic credentials, certifications, and Meta Certified Full-Stack Specialist track.
- Added sticky key indicators (`.is-current`), character scrub wave illumination, and quote callouts.

---

### Issue 2: [RESOLVED] Phase 6 — Chemistry Meeting Magnetic CTA & Footer Polish (`POLISH-01`, `POLISH-02`)
**Labels:** `completed`, `phase-6`, `cta`
- Created `src/components/sections/ContactFooter.astro` with interactive parabolic magnetic contact orb.
- Configured mailto trigger (`losgehts@gravity-design.de?subject=Chemistry-Meeting`), Lenis back-to-top button, and difference-blend fixed footer.
- Validated SEO meta tags, OpenGraph data, and legal impressum page.

---

### Issue 3: [RESOLVED] Real-Time GitHub Cockpit & Telemetry Engine (`GITHUB-01`, `GITHUB-02`)
**Labels:** `completed`, `feature`, `github-telemetry`
- Created `src/components/sections/GitHubActivity.astro` inside the Bio section.
- Added live REST telemetry indicator (`LIVE REST SYNC · API v3 · 24ms ping`), UTC sync clock, and one-click clone buttons.
- Built interactive 52-week contribution matrix with level intensity filtering and cell tooltips.
- Added multi-segment language radar (`JavaScript 33%`, `Jupyter 22%`, `TypeScript 11%`, `HTML 11%`, `Astro 8%`, `Python 15%`).
- Integrated dual-mode live telemetry: visual recent commit feed and interactive in-browser shell terminal (`help`, `status`, `repos`, `stack`, `whoami`, `clear`).

---

### Issue 4: [RESOLVED] Authentic Project Visuals & 16:9 Thumbnail Cards (`PROJECTS-01`, `PROJECTS-02`)
**Labels:** `completed`, `ui`, `assets`, `responsive`
- Replaced all legacy corporate German template imagery in `public/projekte.json` with Hashir Ahmad's actual projects.
- Captured real-world 1440×900 screenshots directly from live deployments:
  - **Web Project AI Assistant**: `public/projects/ai-assistant-01.webp` (`https://web-projectect-ai-assistant-x8xz.vercel.app/`)
  - **Triostepdekhyaber**: `public/projects/triostep-01.webp` (`https://triostepdkhyber.vercel.app/`)
  - **Dr. Muhammad Hassan BDS**: `public/projects/dr-hassan-01.webp` (`https://hassanbds.info`)
  - **QuickBlog**: `public/projects/quick-blogs-01.webp` (`https://quick-blogs-i4xh.vercel.app/`)
  - **MY_own_Portolio**: `public/projects/portfolio-01.webp` (`https://hashirahmad806.vercel.app/`)
- Generated domain-tailored, dark glassmorphism dashboard mockups for non-live repositories:
  - **Commit Roulette**: `public/projects/commit-roulette-01.webp`
  - **LinkedIn Outreach Automation**: `public/projects/linkedin-automation-01.webp`
  - **Plant Village Deep Learning**: `public/projects/plant-village-01.webp`
  - **Next Word Predictor (LSTM NLP)**: `public/projects/lstm-predictor-01.webp`
  - **LangChain Multi-Agent Orchestrator**: `public/projects/langchain-agent-01.webp`
- Added `.gh-repo-thumb` 16:9 preview cards with hover zoom (`scale(1.06)`), ambient glow overlays, and floating live badges in `GitHubActivity.astro`.
- Verified 1-column mobile responsiveness (`max-width: 600px`) and desktop layout (`1440×900`).
- Validated ultra-fast static builds with Bun (`bun run build` in 1.39s - 2.81s).

---

## 🚀 Upcoming Backlog Issues (Ready for Next Sessions)

### Issue 5: Stage SVG Orbital Parametric Telemetry Layer (`HERO-STAGE`)
**Labels:** `ui`, `motion`, `priority: medium`
#### Description
Integrate the 1920×1080 stage SVG coordinate calculation engine from Script 1 of gravity-design.de into `src/components/sections/Hero.astro`.
#### Tasks
- [ ] Connect parametric SVG coordinate displays (`#guide-small`, `#guide-ring`, `#coord-small`, `#coord-ring`) showing live numerical coordinates (`945, 592 a 0.4 1003, 575 a 1.5`).
- [ ] Implement responsive auto-scaling for mobile and ultra-wide displays.

---

### Issue 6: 3D Orbit Universe WebGL Custom Shader Enhancements (`ORBIT-SHADERS`)
**Labels:** `webgl`, `shaders`, `3d`
#### Description
Enhance `src/scripts/orbit-engine.js` shader passes for custom card reflection and lighting.
#### Tasks
- [ ] Tune fragment shaders to add subtle purple fringe lighting around active card boundaries.
- [ ] Implement smooth inertia damping on high-refresh (120Hz/144Hz) mobile displays.

---

### Issue 7: Automated End-to-End & Visual Regression Suite (`TESTING-01`)
**Labels:** `testing`, `ci-cd`, `quality`
#### Description
Add automated test coverage using Playwright with Bun test runner.
#### Tasks
- [ ] Add Playwright configuration verifying page load and section anchors (`#bio`, `#manifesto`, `#hybrid-ai`, `#contact`).
- [ ] Add visual regression snapshots for GitHub cockpit on mobile (390px) and desktop (1440px).

---

### Issue 8: CI/CD Pipeline & Vercel Production Deployment Auto-Hook (`DEVOPS-01`)
**Labels:** `devops`, `vercel`, `ci-cd`
#### Description
Connect GitHub Actions automated workflow for continuous deployment to Vercel with Bun caching.
#### Tasks
- [ ] Add `.github/workflows/deploy.yml` using `oven-sh/setup-bun@v2`.
- [ ] Run `bun run build` and auto-deploy to Vercel production preview.
