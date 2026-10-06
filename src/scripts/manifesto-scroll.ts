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
  const mfEl = document.querySelector('.om-manifesto');
  const mfSchmal = window.matchMedia ? matchMedia('(max-width: 640px)') : null;
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

  function updateBoldMask(): void {
    if (!boldScroll || !boldSection) return;
    const rect = boldScroll.getBoundingClientRect();
    const vh = window.innerHeight;
    const reserve = rect.height - vh;
    const rawProgress = reserve > 0 ? clamp01(-rect.top / reserve) : (rect.top <= 0 ? 1 : 0);

    const progress = clamp01((rawProgress - MASK_START_AT) / (MASK_DONE_AT - MASK_START_AT));

    const ringStrecke = vh + MASK_START_AT * Math.max(0, reserve);
    const ringT = ringStrecke > 0 ? clamp01((vh - rect.top) / ringStrecke) : 1;
    const ringE = 1 - Math.pow(1 - ringT, 3);
    boldSection.style.setProperty('--ring-y', ((1 - ringE) * RING_WEG * vh).toFixed(1) + 'px');

    const ringU = clamp01(1 - progress / RING_SCHWUND);
    const punktU = clamp01(1 - Math.max(0, progress - RING_VERZUG) / RING_SCHWUND);
    const wachsen = RING_KLEIN + (1 - RING_KLEIN) * ringE;
    boldSection.style.setProperty('--ring-s', (Math.pow(ringU, 1.3) * wachsen).toFixed(4));
    boldSection.style.setProperty('--punkt-s', (Math.pow(punktU, 1.3) * wachsen).toFixed(4));

    const maxR = Math.hypot(window.innerWidth, vh) / 2 * 1.05;
    let r = maxR + (MASK_MIN_R - maxR) * progress;

    const col = collapseAmount(rawProgress);
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
      const rgb = accentRGB();
      let rr = rgb[0] + (255 - rgb[0]) * white;
      let gg = rgb[1] + (255 - rgb[1]) * white;
      let bb = rgb[2] + (255 - rgb[2]) * white;

      if (col > FLASH_PEAK) {
        const toFg = clamp01((col - FLASH_PEAK) / (EXPLODE_START - FLASH_PEAK));
        const fg = fgRGB();
        rr += (fg[0] - rr) * toFg;
        gg += (fg[1] - gg) * toFg;
        bb += (fg[2] - bb) * toFg;
      }
      boldSection.style.backgroundColor = `rgb(${Math.round(rr)},${Math.round(gg)},${Math.round(bb)})`;
      boldSection.classList.add('is-collapsing');
    } else if (boldSection.classList.contains('is-collapsing')) {
      boldSection.style.backgroundColor = '';
      boldSection.classList.remove('is-collapsing');
    }

    const clip = `circle(${Math.max(0, r)}px at 50% 50%)`;
    boldSection.style.clipPath = clip;

    // Theme color inversion triggers
    const secRect = boldSection.getBoundingClientRect();
    const curveRect = elCurve ? elCurve.getBoundingClientRect() : null;

    function punktAufFarbe(cx: number, cy: number): boolean {
      if (curveRect && cx > curveRect.left && cx < curveRect.right && cy > curveRect.top && cy < curveRect.bottom) return true;
      if (cy > secRect.top && cy < secRect.bottom) {
        const d = Math.hypot(cx - (secRect.left + secRect.width / 2), cy - (secRect.top + secRect.height / 2));
        if (d < r) return true;
      }
      return false;
    }

    function overAccent(rc: DOMRect | null): boolean {
      if (!rc || (!rc.width && !rc.height)) return false;
      return punktAufFarbe((rc.left + rc.right) / 2, (rc.top + rc.bottom) / 2);
    }

    const root = document.documentElement;
    root.classList.toggle('brand-on-accent', overAccent(elBrandMark ? elBrandMark.getBoundingClientRect() : null));
    root.classList.toggle('mass-on-accent', overAccent(elMassMark ? elMassMark.getBoundingClientRect() : null));
    root.classList.toggle('nav-on-accent', overAccent(elNav ? elNav.getBoundingClientRect() : null));

    // 3D Perspective Text Expansion
    const growT = clamp01((progress - TEXT_GROW_START) / (1 - TEXT_GROW_START));
    const eased = growT * growT * growT;
    const scaleVal = (1 + eased * TEXT_GROW_MAX).toFixed(3);
    const finalFadeT = clamp01((progress - TEXT_FINAL_FADE_START) / (1 - TEXT_FINAL_FADE_START));
    const textOpacity = 1 - finalFadeT;
    const textBlur = (eased * TEXT_BLUR_MAX).toFixed(2);

    for (let i = 0; i < mfRows.length; i++) {
      const row = mfRows[i];
      if (!row) continue;
      const d = (i - mfRowCenter) / mfRowCenter;
      const tilt = (d * TEXT_BULGE_DEG * eased).toFixed(2);
      const spread = (mfRowOffsets[i] * (parseFloat(scaleVal) - 1)).toFixed(1);
      row.style.transform = `translateY(${spread}px) scale(${scaleVal}) rotateX(${tilt}deg)`;
      row.style.opacity = String(textOpacity);
      row.style.filter = parseFloat(textBlur) > 0.05 ? `blur(${textBlur}px)` : 'none';
    }

    const mfAusloeser = (mfSchmal && mfSchmal.matches) ? 1.25 : 0.6;
    if (mfEl && rect.top < vh * mfAusloeser) mfEl.classList.add('is-auf');

    if (orbitHint) {
      const hintIn = clamp01((progress - HINT_FADE_START) / (1 - HINT_FADE_START));
      const hintOut = 1 - clamp01((col - 0.18) / 0.12);
      orbitHint.style.opacity = String(hintIn * hintOut);
    }
  }

  window.addEventListener('scroll', updateBoldMask, { passive: true });
  window.addEventListener('resize', updateBoldMask);
  updateBoldMask();

  // ── 5. Strikethrough & Underline Scrub ──
  const strich = document.querySelector('.mf-strike');
  const unter = document.querySelector('.om-bold-underline');
  function pruefenStrich(): void {
    if (!boldScroll) return;
    const rect = boldScroll.getBoundingClientRect();
    const reserve = rect.height - window.innerHeight;
    const p = reserve > 0 ? Math.max(0, Math.min(1, -rect.top / reserve)) : 0;
    if (strich) strich.classList.toggle('is-struck', p >= 0.008);
    if (unter) unter.classList.toggle('is-struck', p >= 0.038);
  }
  window.addEventListener('scroll', pruefenStrich, { passive: true });
  window.addEventListener('resize', pruefenStrich);
  pruefenStrich();

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

        if (dabei || Math.hypot(x, y) > 0.3) {
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
