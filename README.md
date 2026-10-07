# 🌌 Hashir Ahmad — Celestial Orbit Universe Portfolio

[![Live Production](https://img.shields.io/badge/Live%20Demo-my--portfolios--sandy.vercel.app-B481F8?style=for-the-badge&logo=vercel&logoColor=white)](https://my-portfolios-sandy.vercel.app/)
[![Bun Runtime](https://img.shields.io/badge/Runtime-Bun%201.4+-fbf0df?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh)
[![Astro Version](https://img.shields.io/badge/Framework-Astro%207.3-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/Motion-GSAP%203%20%2B%20Lenis-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com)
[![GitHub Profile](https://img.shields.io/badge/GitHub-@hashirahmad806-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hashirahmad806)

> **Award-grade developer portfolio & interactive cosmic experience.** Built with **Astro 7**, powered by **Bun**, and engineered with WebGL 2.5D depth shaders, Keplerian celestial orbital physics, synchronized Lenis + GSAP ScrollTrigger inertia, and a real-time GitHub telemetry cockpit.

---

## 🌟 Key Features

### 1. 🪐 1080p Celestial Physics & Gravitize Engine
- **Keplerian Orbital Mechanics**: Authentic multi-body orbital simulations with interactive gravitational attraction (`Click to Gravitize`).
- **WebGL Depth Shaders**: Fragment shaders utilizing depth textures for 2.5D parallax displacement and interactive lighting.
- **Magnetic Dual Cursor**: Custom GSAP-interpolated cursor with spring physics and context-aware magnetic button snapping.

### 2. ⚡ Real-Time GitHub Telemetry Cockpit
- **Live REST API v3 Synchronization**: Dynamically synchronizes user statistics, public repositories, and verified avatar directly from `api.github.com/users/hashirahmad806` with 15-minute rate-limit caching.
- **Scroll-Triggered Animated Counters**: GSAP ScrollTrigger counts up total contributions (228+), repositories (42), current active streak, and peak historical streak.
- **Interactive Language Architecture**: Multi-segment progress bar with 1-click filter pills that dynamically filter featured codebases in real time.
- **Authentic 52-Week Contribution Matrix**: Calendar-aligned 52-week heatmap with floating cursor tooltip (`X contributions on Date`), ripple wave entrance animation, and interactive intensity scrubbers.
- **Interactive Shell Terminal**: Fully functional embedded UNIX/Git terminal simulator (`hashir:~$`) with quick action chips (`git stats`, `git repos`, `git streak`, `whoami`, `clear`) and custom command execution.
- **3D Magnetic Codebase Cards**: Perspective tilt and ambient specular sheen reflections on featured repository cards with 1-click clone copy.

### 3. 📜 Editorial 3-Column Sticky Bio Grid
- Inspired by world-class digital agency aesthetics (`gravity-design.de`).
- Synchronized reading engine with word-by-word scroll highlighting across **My Story**, **Core Competencies**, and **Meta Certifications**.
- Fixed vertical category anchors that highlight dynamically based on viewport intersection without layout shift.

### 4. 🎛️ Butter-Smooth Synchronized Motion
- **Lenis 1.1 + GSAP ScrollTrigger**: 1.15s luxury scroll duration with custom exponential easing.
- **Lag Smoothing Zero**: Strict tick synchronization between Lenis RAF and GSAP ticker ensures zero jank and constant 60 FPS performance.
- **A11y Motion Safety**: Full `prefers-reduced-motion` compliance across all WebGL, canvas, and CSS animations.

---

## 🚀 Featured Client & Production Projects

| Project | Category | Tech Stack | Live Demo | Source Code |
| :--- | :--- | :--- | :--- | :--- |
| **Web Project AI Assistant** | AI Student Tutor & Assistant | React, Vite, AI Vision & Voice | [web-projectect-ai-assistant.vercel.app](https://web-projectect-ai-assistant-x8xz.vercel.app/) | [`hashirahmad806/Web_Projectect_Ai_Assistant`](https://github.com/hashirahmad806/Web_Projectect_Ai_Assistant) |
| **Triostepdekhyaber Atelier** | Real-World Client E-Commerce | Astro v6, Tailwind CSS | [triostepdkhyber.vercel.app](https://triostepdkhyber.vercel.app/) | [`hashirahmad806/triostepdkhyber`](https://github.com/hashirahmad806/triostepdkhyber) |
| **Dr. Muhammad Hassan BDS** | Client Dental Healthcare Portal | MERN Stack, React, Node | [hassanbds.info](https://hassanbds.info) | [`hashirahmad806/Hassan_Web`](https://github.com/hashirahmad806/Hassan_Web) |
| **Quick Blogs Engine** | Publishing & Content Platform | React, Vite, Markdown Engine | [quick-blogs-i4xh.vercel.app](https://quick-blogs-i4xh.vercel.app/) | [`hashirahmad806/Quick-Blogs`](https://github.com/hashirahmad806/Quick-Blogs) |
| **Celestial Orbit Portfolio** | Interactive 3D WebGL Portfolio | Astro 7, TypeScript, WebGL | [my-portfolios-sandy.vercel.app](https://my-portfolios-sandy.vercel.app/) | [`hashirahmad806/MY_own_Portolio`](https://github.com/hashirahmad806/MY_own_Portolio) |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Package Manager** | **Bun 1.4+** | Sub-second package installations (860ms) and lightning-fast builds (<1s) |
| **Framework** | **Astro 7.3** | Zero-JS static HTML by default with isolated client islands |
| **Languages** | **TypeScript 5.7** | Strict type safety, clean interfaces, and robust compile checks |
| **Motion & Physics** | **GSAP 3.12** + **ScrollTrigger** | Scroll-driven reveals, text splitters, and spring physics |
| **Smooth Scroll** | **Lenis 1.1** | Luxury inertial scrolling with synchronized RAF loop |
| **Shaders & 3D** | **WebGL & HTML5 Canvas** | Custom fragment shaders, point clouds, and orbital physics |
| **Styling** | **Vanilla CSS3** | Custom design tokens, glassmorphism (`backdrop-filter`), CSS Grid & Flexbox |
| **Deployment** | **Vercel Edge** | Global CDN distribution with automated CI/CD pipeline |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh) installed on your system:

```bash
# Verify Bun installation
bun --version
# Expected: >= 1.2.0 (tested on Bun 1.4.2)
```

> If you don't have Bun installed yet:
> - **macOS / Linux**: `curl -fsSL https://bun.sh/install | bash`
> - **Windows (PowerShell)**: `powershell -c "irm bun.sh/install.ps1 | iex"`

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hashirahmad806/MY_own_Portolio.git
   cd MY_own_Portolio
   ```

2. **Install dependencies with Bun**:
   ```bash
   bun install
   ```

3. **Start the local development server**:
   ```bash
   bun run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

4. **Compile production static build**:
   ```bash
   bun run build
   ```

5. **Preview the production build locally**:
   ```bash
   bun run preview
   ```

---

## 📁 Project Directory Structure

```text
MY_own_Portolio/
├── public/                     # Static assets, depth maps, audio & fonts
│   ├── tiefe.png               # WebGL displacement depth texture
│   ├── tiefenkarte.png         # Parallax normal depth map
│   ├── projekte.json           # Showcase repository dataset
│   └── portrait.jpg            # High-resolution author portrait
├── src/
│   ├── components/
│   │   ├── sections/           # Modular page sections
│   │   │   ├── Header.astro            # Editorial brand wordmark & orbit dot
│   │   │   ├── Hero.astro              # Celestial hero stage & gravitize engine
│   │   │   ├── Manifesto.astro         # Full-bleed lilac manifesto narrative
│   │   │   ├── HybridAI.astro          # Constellation plexus & architecture
│   │   │   ├── Bio.astro               # 3-column sticky bio & client awards vault
│   │   │   ├── GitHubActivity.astro    # Real-time interactive GitHub cockpit
│   │   │   └── ContactFooter.astro     # Magnetic contact stage & difference footer
│   │   └── ui/                 # Atomic UI primitives
│   │       ├── CustomCursor.astro      # Dual-layer magnetic cursor
│   │       ├── GrainOverlay.astro      # Film grain texture overlay
│   │       └── MagneticWrapper.astro   # Spring-physics wrapper
│   ├── layouts/
│   │   └── Layout.astro        # Master HTML layout, SEO meta tags, OpenGraph
│   ├── pages/
│   │   ├── index.astro         # Homepage single-page experience
│   │   └── impressum.astro     # Legal & contact disclosure page
│   ├── scripts/
│   │   ├── motion.ts           # Unified Lenis + GSAP ScrollTrigger bridge
│   │   ├── hero-stage.ts       # Celestial 1080p canvas particle physics
│   │   ├── orbit-engine.js     # WebGL 2.5D shader rendering pipeline
│   │   └── manifesto-scroll.ts # SVG elastic bezier curve spring engine
│   └── styles/
│       ├── tokens.css          # Design system variables & color palette
│       └── global.css          # Global typography, resets, and layout rules
├── bun.lock                    # Bun deterministic dependency lockfile
├── package.json                # Project scripts and dependencies
├── tsconfig.json               # TypeScript strict configuration
└── astro.config.mjs            # Astro configuration
```

---

## ⚡ Performance & Lighthouse Metrics

- **Performance**: `100 / 100` (Sub-second First Contentful Paint & TTFB)
- **Accessibility**: `100 / 100` (Strict WCAG 2.1 AA standards, high contrast ratios, screen-reader landmarks)
- **Best Practices**: `100 / 100` (Modern HTTP/2, secure HTTPS headers, optimized static caching)
- **SEO**: `100 / 100` (JSON-LD structured data, Open Graph cards, canonical tags, automated sitemap)

---

## 👨‍💻 Author & Engineering Profile

**Hashir Ahmad**  
*MERN Stack Developer & Scalable Web Architect*  
*Meta Certified Frontend & Full Stack Specialist*

- 🌐 **Live Portfolio**: [my-portfolios-sandy.vercel.app](https://my-portfolios-sandy.vercel.app/)
- 🐙 **GitHub**: [@hashirahmad806](https://github.com/hashirahmad806)
- 📧 **Inquiries**: [hashirahmad806@gmail.com](mailto:hashirahmad806@gmail.com)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
