/**
 * motion.ts — Lenis + GSAP ScrollTrigger synchronized luxury motion bridge
 *
 * Configured identically to gravity-design.de:
 * - duration: 1.15 for butter-smooth luxury inertia
 * - smoothWheel: true
 * - syncTouch: false
 * - allowNestedScroll: true
 * - manual scroll restoration to prevent jumps on reload
 * - gsap ticker synchronized with 0 lag smoothing
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Initialize buttery-smooth luxury scrolling
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
  });

  (window as any).lenis = lenis;

  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

export function scrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number }
) {
  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(target as any, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.15,
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
