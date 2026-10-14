/**
 * manifesto-scroll.ts
 *
 * Second Section Scroll Engine from gravity-design.de:
 * - GSAP elastic bezier curve spring bounce on #boldCurvePath
 * - Circular clip-path reveal and collapse explosion (circle(r at 50% 50%))
 * - 3D perspective row spreading, scaling and blur on .om-manifesto lines
 * - Dynamic color flash and theme inversions (.brand-on-accent, .mass-on-accent)
 * - Magnetic interactive cursor pull on revolving satellite dot in #mfRing
 * - Scroll-triggered strikethrough on "Agentur" and underline on "bold"
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initManifestoScroll(): void {
  if (typeof window === 'undefined') return;

  function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // ── 1. GSAP Curve Spring Bounce (#boldCurvePath) ──
  const path = document.getElementById('boldCurvePath');
  const curveEl = document.querySelector('.om-bold-curve');
  if (path && curveEl) {
    const VBH = 160;
    const state = { v: -140 };
    const renderCurve = () => {
      path.setAttribute('d', `M0,0 Q500,${state.v} 1000,0 L1000,${VBH} L0,${VBH} Z`);
    };
    renderCurve();

    gsap.timeline({
      scrollTrigger: {
        trigger: curveEl,
        start: 'top 85%',
        toggleActions: 'play reverse play reverse'
      },
      onUpdate: renderCurve
    })
      .to(state, { v: 0,   duration: 0.55, ease: 'none' })
      .to(state, { v: 22,  duration: 0.17, ease: 'none' })
      .to(state, { v: -12, duration: 0.16, ease: 'none' })
      .to(state, { v: 0,   duration: 0.12, ease: 'none' });
  }

  // ── 2. Manifesto Line Word-Mask Preparation ──
  const mfEl = document.querySelector<HTMLElement>('.om-manifesto');
  const mfSchmal = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 640px)') : null;
  if (mfEl) {
    let nr = 0;
    const spans = mfEl.querySelectorAll('.mf-line > span');
    spans.forEach((wort) => {
      if (wort.classList.contains('mf-anhang') || wort.querySelector('.mf-hoch')) return;
      const innen = document.createElement('span');
      innen.className = 'mf-hoch';
      while (wort.firstChild) innen.appendChild(wort.firstChild);
      wort.appendChild(innen);
      wort.classList.add('mf-maske');
      innen.style.transitionDelay = (nr++ * 0.075).toFixed(3) + 's';
    });
  }

  // ── 3. Row Perspective Alignment ──
  const mfRows = [
    document.querySelector('.mf-label'),
    ...Array.from(document.querySelectorAll('.om-manifesto > .mf-line'))
  ] as (HTMLElement | null)[];
  const mfRowCenter = (mfRows.length - 1) / 2;
  let mfRowOffsets = mfRows.map(() => 0);

  function remeasureRows(): void {
    const prevTransforms = mfRows.map((row) => row ? row.style.transform : null);
    mfRows.forEach((row) => { if (row) row.style.transform = 'none'; });
    const rects = mfRows.map((row) => row ? row.getBoundingClientRect() : null);
    let minTop = Infinity, maxBottom = -Infinity;
    rects.forEach((r) => {
      if (r) { minTop = Math.min(minTop, r.top); maxBottom = Math.max(maxBottom, r.bottom); }
    });
    const centerY = (minTop + maxBottom) / 2;
    mfRowOffsets = rects.map((r) => r ? ((r.top + r.bottom) / 2 - centerY) : 0);
    mfRows.forEach((row, i) => { if (row) row.style.transform = prevTransforms[i] || ''; });
  }
  remeasureRows();
  window.addEventListener('resize', remeasureRows);

  // ── 4. Circular Clip-Path & Perspective Zoom (updateBoldMask) ──
  const boldScroll = document.getElementById('boldScroll');
  const boldSection = document.getElementById('boldSection');
  const orbitHint = document.getElementById('orbitHint');
  const elCurve = document.querySelector('.om-bold-curve');
  const elBrandMark = document.getElementById('brand');
  const elMassMark = document.getElementById('mass');
  const elNav = document.getElementById('nav');

  const OHNE_KUGEL = window.innerWidth <= 640 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const MASK_MIN_R = OHNE_KUGEL ? 0 : 78;
  let MASK_START_AT = 0.152;
  let MASK_DONE_AT = 0.524;
  const COLLAPSE_START = 0.767;
  const FLASH_START = 0.52;
  const FLASH_PEAK = 0.72;
  const FLASH_GROW = 0.55;
  const EXPLODE_START = 0.80;
  const EXPLODE_OVERSHOOT = 1.7;

  const KEIN_KOLLAPS = OHNE_KUGEL;
  if (KEIN_KOLLAPS) {
    MASK_START_AT = 50 / 248;
    MASK_DONE_AT = 173 / 248;
  }

  function collapseAmount(rawProgress: number): number {
    if (KEIN_KOLLAPS) return 0;
    return clamp01((rawProgress - COLLAPSE_START) / (1 - COLLAPSE_START));
  }

  function accentRGB(): number[] {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    let hex = raw.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    return [180, 129, 248];
  }

  function fgRGB(): number[] {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim();
    let hex = raw.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    return [237, 235, 230];
  }

  const TEXT_GROW_START = 0.15;
  const HINT_FADE_START = 0.9;
  const TEXT_GROW_MAX = 11;
  const TEXT_BULGE_DEG = 24;
  const TEXT_FINAL_FADE_START = 0.94;
  const TEXT_BLUR_MAX = 10;
  const RING_WEG = -0.24;
  const RING_SCHWUND = 0.5;
  const RING_VERZUG = 0.10;
  const RING_KLEIN = 0.62;

  // Static theme colours: resolve once, never per scroll frame.
  const ACCENT_RGB = accentRGB();
  const FG_RGB = fgRGB();

  // Write caches — skip a style write when its value is unchanged so a still
  // frame performs zero style invalidation.
  const rowState = mfRows.map(() => ({ t: '', o: '' }));
  let lastRingY = '', lastRingS = '', lastPunktS = '', lastBg = '', lastClip = '', lastBlur = '';
  let lastHint = -1;
  let lastRawProgress = 0;
  let lastThemeBrand: boolean | null = null;
  let lastThemeMass: boolean | null = null;
  let lastThemeNav: boolean | null = null;

  function punktAufFarbe(cx: number, cy: number, secRect: DOMRect, curveRect: DOMRect | null, r: number): boolean {
    if (curveRect && cx > curveRect.left && cx < curveRect.right && cy > curveRect.top && cy < curveRect.bottom) return true;
    if (cy > secRect.top && cy < secRect.bottom) {
      const d = Math.hypot(cx - (secRect.left + secRect.width / 2), cy - (secRect.top + secRect.height / 2));
      if (d < r) return true;
    }
    return false;
  }

  function overAccent(rc: DOMRect | null, secRect: DOMRect, curveRect: DOMRect | null, r: number): boolean {
    if (!rc || (!rc.width && !rc.height)) return false;
    return punktAufFarbe((rc.left + rc.right) / 2, (rc.top + rc.bottom) / 2, secRect, curveRect, r);
  }

  function updateBoldMask(): void {
    if (!boldScroll || !boldSection) return;

    // ── Read phase: gather every layout value before writing any style, so a
    // single scroll frame costs one reflow instead of several forced ones. ──
    const rect = boldScroll.getBoundingClientRect();
    const vh = window.innerHeight;
    const secRect = boldSection.getBoundingClientRect();
    const curveRect = elCurve ? elCurve.getBoundingClientRect() : null;
    const brandRect = elBrandMark ? elBrandMark.getBoundingClientRect() : null;
    const massRect = elMassMark ? elMassMark.getBoundingClientRect() : null;
    const navRect = elNav ? elNav.getBoundingClientRect() : null;

    const reserve = rect.height - vh;
    const rawProgress = reserve > 0 ? clamp01(-rect.top / reserve) : (rect.top <= 0 ? 1 : 0);
    lastRawProgress = rawProgress;
    const progress = clamp01((rawProgress - MASK_START_AT) / (MASK_DONE_AT - MASK_START_AT));

    const ringStrecke = vh + MASK_START_AT * Math.max(0, reserve);
    const ringT = ringStrecke > 0 ? clamp01((vh - rect.top) / ringStrecke) : 1;
    const ringE = 1 - Math.pow(1 - ringT, 3);

    const ringU = clamp01(1 - progress / RING_SCHWUND);
    const punktU = clamp01(1 - Math.max(0, progress - RING_VERZUG) / RING_SCHWUND);
    const wachsen = RING_KLEIN + (1 - RING_KLEIN) * ringE;

    const maxR = Math.hypot(window.innerWidth, vh) / 2 * 1.05;
    let r = maxR + (MASK_MIN_R - maxR) * progress;

    const col = collapseAmount(rawProgress);
    let bg = '';
    if (col > 0) {
      if (col < FLASH_PEAK) {
        const up = clamp01((col - FLASH_START) / (FLASH_PEAK - FLASH_START));
        r = MASK_MIN_R * (1 + FLASH_GROW * Math.sin(up * Math.PI / 2));
      } else if (col < EXPLODE_START) {
        const down = clamp01((col - FLASH_PEAK) / (EXPLODE_START - FLASH_PEAK));
        r = MASK_MIN_R * (1 + FLASH_GROW) * Math.pow(1 - down, 2.6);
      } else {
        const out = clamp01((col - EXPLODE_START) / (1 - EXPLODE_START));
        r = maxR * EXPLODE_OVERSHOOT * (1 - Math.pow(1 - out, 3));
      }

      const white = clamp01((col - FLASH_START) / (FLASH_PEAK - FLASH_START));
      let rr = ACCENT_RGB[0] + (255 - ACCENT_RGB[0]) * white;
      let gg = ACCENT_RGB[1] + (255 - ACCENT_RGB[1]) * white;
      let bb = ACCENT_RGB[2] + (255 - ACCENT_RGB[2]) * white;

      if (col > FLASH_PEAK) {
        const toFg = clamp01((col - FLASH_PEAK) / (EXPLODE_START - FLASH_PEAK));
        rr += (FG_RGB[0] - rr) * toFg;
        gg += (FG_RGB[1] - gg) * toFg;
        bb += (FG_RGB[2] - bb) * toFg;
      }
      bg = `rgb(${Math.round(rr)},${Math.round(gg)},${Math.round(bb)})`;
    }

    // ── Derived values ──
    const growT = clamp01((progress - TEXT_GROW_START) / (1 - TEXT_GROW_START));
    const eased = growT * growT * growT;
    const scaleVal = 1 + eased * TEXT_GROW_MAX;
    const finalFadeT = clamp01((progress - TEXT_FINAL_FADE_START) / (1 - TEXT_FINAL_FADE_START));
    const textOpacity = 1 - finalFadeT;
    const textBlur = eased < 0.6 ? eased * TEXT_BLUR_MAX : 0;

    const hintIn = clamp01((progress - HINT_FADE_START) / (1 - HINT_FADE_START));
    const hintOut = 1 - clamp01((col - 0.18) / 0.12);
    const hintOpacity = hintIn * hintOut;

    const brandOn = overAccent(brandRect, secRect, curveRect, r);
    const massOn = overAccent(massRect, secRect, curveRect, r);
    const navOn = overAccent(navRect, secRect, curveRect, r);

    // ── Write phase: mutate only what actually changed. ──
    const ringY = ((1 - ringE) * RING_WEG * vh).toFixed(1) + 'px';
    if (ringY !== lastRingY) { boldSection.style.setProperty('--ring-y', ringY); lastRingY = ringY; }

    const ringS = (Math.pow(ringU, 1.3) * wachsen).toFixed(4);
    if (ringS !== lastRingS) { boldSection.style.setProperty('--ring-s', ringS); lastRingS = ringS; }

    const punktS = (Math.pow(punktU, 1.3) * wachsen).toFixed(4);
    if (punktS !== lastPunktS) { boldSection.style.setProperty('--punkt-s', punktS); lastPunktS = punktS; }

    const clip = `circle(${Math.max(0, r)}px at 50% 50%)`;
    if (clip !== lastClip) { boldSection.style.clipPath = clip; lastClip = clip; }

    if (col > 0) {
      if (bg !== lastBg) { boldSection.style.backgroundColor = bg; lastBg = bg; }
      if (!boldSection.classList.contains('is-collapsing')) boldSection.classList.add('is-collapsing');
    } else if (lastBg !== '' || boldSection.classList.contains('is-collapsing')) {
      boldSection.style.backgroundColor = '';
      lastBg = '';
      boldSection.classList.remove('is-collapsing');
    }

    // Theme colour inversion (only touched when the state actually flips).
    const root = document.documentElement;
    if (brandOn !== lastThemeBrand) { root.classList.toggle('brand-on-accent', brandOn); lastThemeBrand = brandOn; }
    if (massOn !== lastThemeMass) { root.classList.toggle('mass-on-accent', massOn); lastThemeMass = massOn; }
    if (navOn !== lastThemeNav) { root.classList.toggle('nav-on-accent', navOn); lastThemeNav = navOn; }

    // 3D Perspective Text Expansion
    const scaleStr = scaleVal.toFixed(3);
    const opacityStr = String(textOpacity);
    for (let i = 0; i < mfRows.length; i++) {
      const row = mfRows[i];
      if (!row) continue;
      const st = rowState[i];
      const d = mfRowCenter > 0 ? (i - mfRowCenter) / mfRowCenter : 0;
      const tilt = (d * TEXT_BULGE_DEG * eased).toFixed(2);
      const spread = (mfRowOffsets[i] * (scaleVal - 1)).toFixed(1);
      const t = `translateY(${spread}px) scale(${scaleStr}) rotateX(${tilt}deg)`;
      if (t !== st.t) { row.style.transform = t; st.t = t; }
      if (opacityStr !== st.o) { row.style.opacity = opacityStr; st.o = opacityStr; }
    }

    // A single blur pass over the whole stack is far cheaper than one
    // composited filter layer per animated row.
    if (mfEl) {
      const blur = textBlur > 0.05 ? `blur(${textBlur.toFixed(2)}px)` : '';
      if (blur !== lastBlur) { mfEl.style.filter = blur; lastBlur = blur; }
    }

    const mfAusloeser = (mfSchmal && mfSchmal.matches) ? 1.25 : 0.6;
    if (mfEl && rect.top < vh * mfAusloeser && !mfEl.classList.contains('is-auf')) {
      mfEl.classList.add('is-auf');
    }

    if (orbitHint) {
      if (hintOpacity !== lastHint) { orbitHint.style.opacity = String(hintOpacity); lastHint = hintOpacity; }
      const ready = hintOpacity > 0.5;
      if (ready !== document.body.classList.contains('is-orbit-bereit')) {
        document.body.classList.toggle('is-orbit-bereit', ready);
      }
    }
  }

  // ── 5. Strikethrough & Underline Scrub ──
  const strich = document.querySelector('.mf-strike');
  const unter = document.querySelector('.om-bold-underline');
  function pruefenStrich(): void {
    // Reuses the progress computed by updateBoldMask in the same frame instead
    // of measuring the section a second time.
    const p = lastRawProgress;
    if (strich) strich.classList.toggle('is-struck', p >= 0.008);
    if (unter) unter.classList.toggle('is-struck', p >= 0.038);
  }

  // ── Single frame-coalesced driver ──
  // Every scroll-driven update runs from one requestAnimationFrame tick. The
  // page previously ran the mask maths twice per frame (native scroll plus the
  // Lenis scroll stream) with interleaved reads and writes.
  let frameQueued = false;
  function queueFrame(): void {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(() => {
      frameQueued = false;
      updateBoldMask();
      pruefenStrich();
    });
  }

  window.addEventListener('scroll', queueFrame, { passive: true });
  window.addEventListener('resize', queueFrame);
  updateBoldMask();
  pruefenStrich();

  // Sync with the Lenis smooth virtual scroll stream (same coalesced frame).
  const hookLenis = () => {
    const l = (window as any).lenis;
    if (l) {
      l.on('scroll', queueFrame);
    } else {
      setTimeout(hookLenis, 50);
    }
  };
  hookLenis();

  // ── 6. Revolving Satellite Magnetic Cursor Attraction (#mfRing) ──
  const feld = document.getElementById('mfRing');
  if (feld) {
    const bahn = feld.querySelector('.mf-ring-bahn') as HTMLElement | null;
    const punkt = feld.querySelector('.mf-punkt') as HTMLElement | null;
    if (bahn && punkt && (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      const NAHE = 260;
      const KRAFT = 0.95;
      const MAX = 80;
      const HIN = 0.055;
      const ZURUECK = 0.018;

      let zeigerX = 0, zeigerY = 0, dabei = false, laeuft = false;
      let x = 0, y = 0;

      function winkel(): number {
        if (!bahn) return 0;
        const m = getComputedStyle(bahn).transform;
        if (!m || m === 'none') return 0;
        const t = m.slice(m.indexOf('(') + 1, -1).split(',');
        return Math.atan2(parseFloat(t[1]) || 0, parseFloat(t[0]) || 1);
      }

      function ziel(): [number, number] {
        const el = document.querySelector('.om-cursor-punkt');
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width) return [r.left + r.width / 2, r.top + r.height / 2];
        }
        return [zeigerX, zeigerY];
      }

      function bild(): void {
        if (!punkt) return;
        const w = winkel(), cos = Math.cos(w), sin = Math.sin(w);
        const r = punkt.getBoundingClientRect();
        const ruheX = r.left + r.width / 2 - (x * cos - y * sin);
        const ruheY = r.top + r.height / 2 - (x * sin + y * cos);

        let zielX = 0, zielY = 0;
        if (dabei && r.width > 0) {
          const z = ziel();
          const dx = z[0] - ruheX, dy = z[1] - ruheY;
          const d = Math.hypot(dx, dy);
          if (d > 0.5 && d < NAHE) {
            const weg = Math.min(d * KRAFT * (1 - d / NAHE), MAX);
            const sx = dx / d * weg, sy = dy / d * weg;
            zielX = sx * cos + sy * sin;
            zielY = -sx * sin + sy * cos;
          }
        }

        const traege = (zielX || zielY) ? HIN : ZURUECK;
        x += (zielX - x) * traege;
        y += (zielY - y) * traege;

        const stark = Math.min(1, Math.hypot(x, y) / (KRAFT * NAHE / 4));
        punkt.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(1 + stark * 0.12).toFixed(3)})`;

        // Park the loop once the pointer is away from the ring and the dot has
        // settled, so a per-frame layout read no longer runs while the cursor
        // sits anywhere else on the page.
        const zeigerNah = dabei && Math.hypot(zeigerX - ruheX, zeigerY - ruheY) < NAHE * 1.4;
        if (zeigerNah || Math.hypot(x, y) > 0.3) {
          requestAnimationFrame(bild);
        } else {
          x = 0; y = 0; punkt.style.transform = '';
          laeuft = false;
        }
      }

      function wecken(): void {
        if (laeuft) return;
        laeuft = true;
        requestAnimationFrame(bild);
      }

      window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        zeigerX = e.clientX; zeigerY = e.clientY;
        dabei = true;
        wecken();
      }, { passive: true });
      window.addEventListener('pointerleave', () => { dabei = false; }, { passive: true });
      window.addEventListener('blur', () => { dabei = false; });
    }
  }
}
