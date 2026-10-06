/**
 * motion.ts — Lenis + GSAP ScrollTrigger synchronized motion bridge
 *
 * Critical pattern: Lenis intercepts native scroll events and feeds virtual
 * scroll deltas into a custom RAF. GSAP ScrollTrigger must be driven by
 * this same RAF, not the native window scroll event, to avoid jitter.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Accessibility: Respect prefers-reduced-motion ───────────────────────────
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let lenis: Lenis | null = null;

if (!prefersReducedMotion) {
  // ─── Initialize Lenis with luxury inertia ────────────────────────────────
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
  });

  // ─── Critical sync: Lenis → GSAP ScrollTrigger ───────────────────────────
  // This is the ONLY correct way to avoid positional jitter.
  // lenis.on('scroll') fires AFTER Lenis applies its virtual delta,
  // so ScrollTrigger gets the already-smoothed value, not the raw event.
  lenis.on('scroll', ScrollTrigger.update);

  // ─── Feed Lenis into GSAP ticker (not window.requestAnimationFrame) ───────
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  // ─── Eliminate GSAP ticker lag compensation — prevents double-smoothing ──
  gsap.ticker.lagSmoothing(0);
} else {
  // Reduced motion: instant GSAP (no transitions), no Lenis
  gsap.globalTimeline.timeScale(100);
}

export default lenis;

/**
 * Utility: programmatically scroll to a target (used by back-to-top button)
 * Falls back to native scrollTo if Lenis is disabled.
 */
export function scrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number }
) {
  if (lenis) {
    lenis.scrollTo(target as any, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
