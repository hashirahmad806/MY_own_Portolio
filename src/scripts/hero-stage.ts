/**
 * hero-stage.ts
 *
 * Master Celestial Hero Stage Physics & Docking Engine from gravity-design.de:
 * - 1920x1080 fixed coordinate stage with adaptive aspect ratio layout
 * - Keplerian / Newtonian orbital simulation (central gold mass + doughnut ring + satellite)
 * - Click to gravitize: interactive attractor pulling satellites into wide eccentric orbits
 * - Dynamic live telemetry HUD (coordinates and acceleration readouts)
 * - Central gold mass recoil physics opposite to satellite displacement
 * - Fluid scroll docking: SVG celestial logo animates into fixed header on scroll down
 * - Scroll-driven character scrub on editorial name and role
 */

export function initHeroStage(): void {
  if (typeof window === 'undefined') return;

  const SC = 0.86;
  const CX = 960;
  const CY = 536;
  const MARK_SCALE = 0.7;

  const massR   = 121.5 * SC;
  const smallR  = 48.7  * SC;
  const ringOut = 127.5 * SC;
  const ringIn  = 54    * SC;
  const ringR   = (ringOut + ringIn) / 2;
  const ringSW  = ringOut - ringIn;

  const smallD = 185.6 * SC;
  const smallA = Math.atan2(-111.5, 149);
  const ringD  = 264 * SC;
  const ringA  = Math.atan2(264, -1);

  const smallHome = { x: CX + smallD * Math.cos(smallA), y: CY + smallD * Math.sin(smallA) };
  const ringHome  = { x: CX + ringD  * Math.cos(ringA),  y: CY + ringD  * Math.sin(ringA)  };

  const stage = document.getElementById('stage');
  const scene = document.getElementById('scene');
  const elSvg = document.getElementById('svg');
  const elMass = document.getElementById('mass');
  const elSmall = document.getElementById('small');
  const elRing = document.getElementById('ring');
  const elGuideSmall = document.getElementById('guide-small');
  const elGuideRing = document.getElementById('guide-ring');
  const elFocusSmall = document.getElementById('focus-small');
  const elFocusRing = document.getElementById('focus-ring');
  const elCoordSmall = document.getElementById('coord-small');
  const elCoordRing = document.getElementById('coord-ring');
  const elCoordSmallXY = document.getElementById('coord-small-xy');
  const elCoordSmallA = document.getElementById('coord-small-a');
  const elCoordRingXY = document.getElementById('coord-ring-xy');
  const elCoordRingA = document.getElementById('coord-ring-a');
  const elAttractor = document.getElementById('attractor');
  const elLockup = document.getElementById('lockup');
  const elClaim = document.getElementById('claim');
  const elHint = document.getElementById('hint');
  const elBg = document.getElementById('bg');

  if (!stage || !scene || !elSvg || !elMass || !elSmall || !elRing) return;

  elMass.setAttribute('r', String(massR));
  elSmall.setAttribute('r', String(smallR));
  elRing.setAttribute('r', String(ringR));
  elRing.setAttribute('stroke-width', String(ringSW));
  elSmall.style.opacity = '1';
  elRing.style.opacity = '1';

  function ueberdeckung(): number {
    if (window.innerHeight <= window.innerWidth) return 1.12;
    return window.innerWidth <= 640 ? 2.3 : 1.45;
  }

  let scale = 1;
  let offX = 0;
  let offY = 0;
  let docked = false;
  let transitioning = false;

  function svgRestTransform(): string {
    return 'translate(' + offX + 'px,' + offY + 'px) scale(' + scale + ') ' +
      'translate(' + CX + 'px,' + CY + 'px) scale(' + MARK_SCALE + ') translate(' + (-CX) + 'px,' + (-CY) + 'px)';
  }

  function svgRestParts(): { scale: number; tx: number; ty: number } {
    return {
      scale: scale * MARK_SCALE,
      tx: offX + scale * CX * (1 - MARK_SCALE),
      ty: offY + scale * CY * (1 - MARK_SCALE)
    };
  }

  function layout(): void {
    if (!stage || !scene || !elSvg) return;
    const rect = stage.getBoundingClientRect();
    const containScale = Math.min(rect.width / 1920, rect.height / 1080);
    const coverScale = Math.max(rect.width / 1920, rect.height / 1080);
    scale = Math.min(coverScale, containScale * ueberdeckung());
    offX = (rect.width - 1920 * scale) / 2;

    const OPTISCH_HOCH = 0.045;
    offY = rect.height * (0.5 - OPTISCH_HOCH) - CY * scale;
    scene.style.transform = 'translate(' + offX + 'px,' + offY + 'px) scale(' + scale + ')';
    if (!docked) { elSvg.style.transform = svgRestTransform(); }

    if (elLockup) {
      if (rect.height > rect.width) {
        const randPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rand')) || 56;
        const lx = CX + ((randPx - offX) / scale - CX) / MARK_SCALE;
        elLockup.style.left = lx.toFixed(1) + 'px';
        if (elClaim) elClaim.style.left = rect.width <= 640 ? lx.toFixed(1) + 'px' : '';
      } else {
        elLockup.style.left = '';
        if (elClaim) elClaim.style.left = '';
      }
    }
  }

  let sanftTimer: ReturnType<typeof setTimeout> | 0 = 0;
  function sanftSetzen(): void {
    const t = 'transform .45s cubic-bezier(0.22,1,0.36,1)';
    if (scene) scene.style.transition = t;
    if (!docked && !transitioning && elSvg) elSvg.style.transition = t;
    clearTimeout(sanftTimer);
    sanftTimer = setTimeout(() => {
      if (scene) scene.style.transition = '';
      if (!docked && !transitioning && elSvg) elSvg.style.transition = '';
    }, 700);
  }

  function neuRechnen(): void {
    sanftSetzen();
    layout();
    requestAnimationFrame(() => {
      layout();
      requestAnimationFrame(layout);
    });
  }
  window.addEventListener('resize', neuRechnen);
  if (window.ResizeObserver) { new ResizeObserver(neuRechnen).observe(stage); }
  layout();

  // ── Parallax ──
  const PARALLAX_FACTOR = 0.25;
  function updateParallax(): void {
    if (!elBg) return;
    const slack = Math.max(0, elBg.clientWidth * 1.28 - elBg.clientHeight);
    const offset = Math.min(slack, window.scrollY * PARALLAX_FACTOR);
    elBg.style.setProperty('--photo-y', (-offset) + 'px');
    (window as unknown as { __fotoY?: number }).__fotoY = -offset;
    const tiefeNeu = (window as unknown as { __tiefeNeu?: () => void }).__tiefeNeu;
    if (tiefeNeu) tiefeNeu();
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
  updateParallax();

  // ── Editorial Character Scrub ──
  if (elLockup) {
    const z: HTMLElement[] = [];
    const lauf = (knoten: Node) => {
      const kinder = Array.from(knoten.childNodes);
      for (const k of kinder) {
        if (k.nodeType === 3) {
          const roh = k.nodeValue || '';
          const frag = document.createDocumentFragment();
          for (let i = 0; i < roh.length; i++) {
            const c = roh.charAt(i);
            if (c === ' ' || c === '\u00A0' || c === '\n' || c === '\t') {
              frag.appendChild(document.createTextNode(c));
              continue;
            }
            const sp = document.createElement('span');
            sp.className = 'om-lz';
            sp.textContent = c;
            frag.appendChild(sp);
            z.push(sp);
          }
          knoten.replaceChild(frag, k);
        } else if (k.nodeType === 1) {
          lauf(k);
        }
      }
    };
    lauf(elLockup);

    if (z.length > 0) {
      const FENSTER = 9;
      const ANTEIL = 0.7;
      const werte = new Array(z.length);
      const weich = (t: number) => t * t * (3 - 2 * t);

      const rechnen = () => {
        const strecke = Math.min(window.innerWidth, window.innerHeight) * ANTEIL;
        let p = strecke > 0 ? window.pageYOffset / strecke : 1;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        const n = z.length;
        const spanne = FENSTER / (n + FENSTER);
        for (let i = 0; i < n; i++) {
          let a = (p - (n - 1 - i) / (n + FENSTER)) / spanne;
          a = a < 0 ? 0 : a > 1 ? 1 : a;
          const o = Math.round((1 - weich(a)) * 50) / 50;
          if (werte[i] === o) continue;
          werte[i] = o;
          z[i].style.opacity = String(o);
        }
      };

      let offen = false;
      const anstossen = () => {
        if (offen) return;
        offen = true;
        requestAnimationFrame(() => { offen = false; rechnen(); });
      };
      rechnen();
      window.addEventListener('scroll', anstossen, { passive: true });
      window.addEventListener('resize', anstossen);
    }
  }

  // ── Celestial Orbital Simulation ──
  const BASE_OMEGA = 2 * Math.PI / 1.3;
  const RAMP_SEC = 0.5;
  const RADIAL_POW = 1.25;
  const DECAY_POW = 2.2;
  const SPEED_FLOOR = 0.35;
  const MIN_LOOPS = 2.2;
  const TAU_SHAPE = 0.35;
  const MAX_SHAPE_RATE = 700;
  const TAU_ANGLE = 0.5;
  const E_HOME_ENGAGE = 0.1;
  const HOME_ENGAGE_ANGLE = 1.2;
  const SPRING_K = 160;
  const SPRING_D = 16;
  const GATE_TIME = 0.5;
  const EPS_ANGLE_TIGHT = 0.01;
  const EPS_VEL = 0.05;
  const EPS_SHAPE = 5;
  const WAKE_THRESH = 0.05;

  interface GuideInfo {
    cx: number; cy: number; rx: number; ry: number; rot: number; opacity: number;
    focusX: number; focusY: number;
  }

  interface Satellite {
    homeR: number; homeA: number; dirSign: number; apoOffset: number;
    reachMax: number; coreMinD: number;
    theta: number; thetaVel: number; curApo: number; curPeri: number; curApoAng: number;
    resting: boolean; loopsAccum: number; activeTime: number; gateElapsed: number; accel: number;
    x: number; y: number;
    guide: GuideInfo | null;
  }

  function attr(el: Element | null, name: string, wert: string | number): void {
    if (!el) return;
    const zw = (el as unknown as { __zw?: Record<string, string | number> }).__zw ||
               ((el as unknown as { __zw: Record<string, string | number> }).__zw = {});
    if (zw[name] === wert) return;
    zw[name] = wert;
    el.setAttribute(name, String(wert));
  }

  function text(el: Element | null, wert: string): void {
    if (!el) return;
    const zt = (el as unknown as { __zt?: string }).__zt;
    if (zt === wert) return;
    (el as unknown as { __zt: string }).__zt = wert;
    el.textContent = wert;
  }

  function zeichneBahn(
    sat: Satellite,
    elGuide: Element | null,
    elFocus: Element | null,
    elCoord: Element | null,
    elXY: Element | null,
    elA: Element | null
  ): void {
    const g = sat.guide;
    if (!g) {
      attr(elGuide, 'opacity', 0);
      attr(elFocus, 'opacity', 0);
      attr(elCoord, 'opacity', 0);
      return;
    }
    const cx = g.cx.toFixed(1);
    const cy = g.cy.toFixed(1);
    const op = g.opacity.toFixed(3);
    attr(elGuide, 'cx', cx); attr(elGuide, 'cy', cy);
    attr(elGuide, 'rx', g.rx.toFixed(1)); attr(elGuide, 'ry', g.ry.toFixed(1));
    attr(elGuide, 'transform', 'rotate(' + g.rot.toFixed(2) + ' ' + cx + ' ' + cy + ')');
    attr(elGuide, 'opacity', op);
    attr(elFocus, 'cx', g.focusX.toFixed(1)); attr(elFocus, 'cy', g.focusY.toFixed(1));
    attr(elFocus, 'opacity', op);
    const lx = (g.focusX + 10).toFixed(1);
    attr(elXY, 'x', lx); attr(elXY, 'y', (g.focusY + 5).toFixed(1));
    text(elXY, Math.round(g.focusX) + ', ' + Math.round(g.focusY));
    attr(elA, 'x', lx); attr(elA, 'y', (g.focusY + 24).toFixed(1));
    text(elA, 'a ' + sat.accel.toFixed(1));
    attr(elCoord, 'opacity', op);
  }

  const MAX_SCHRITT = 1 / 180;
  function weichBegrenzt(schrittVal: number, deckel: number): number {
    if (!(deckel > 0)) return schrittVal;
    return deckel * Math.tanh(schrittVal / deckel);
  }

  const CORE_MIN_D_SMALL = massR + smallR + 6;
  const CORE_MIN_D_RING = massR + ringOut + 6;

  function makeSat(homeR: number, homeA: number, dirSign: number, apoOffset: number, reachMax: number, coreMinD: number): Satellite {
    return {
      homeR, homeA, dirSign, apoOffset, reachMax, coreMinD,
      theta: homeA, thetaVel: 0, curApo: homeR, curPeri: homeR, curApoAng: homeA,
      resting: true, loopsAccum: 0, activeTime: 0, gateElapsed: 0, accel: 0,
      x: CX + homeR * Math.cos(homeA), y: CY + homeR * Math.sin(homeA),
      guide: null
    };
  }

  const small = makeSat(smallD, smallA, 1, 0, 900, CORE_MIN_D_SMALL);
  const ring  = makeSat(ringD,  ringA,  1, 0.5, 900, CORE_MIN_D_RING);

  function normAngle(a: number): number {
    a = a % (2 * Math.PI);
    if (a > Math.PI) a -= 2 * Math.PI;
    if (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function stepSat(sat: Satellite, dt: number, env: number, dirToMouse: number, reachToMouse: number): void {
    const wasResting = sat.resting;
    if (sat.resting && env < WAKE_THRESH) return;
    if (wasResting) { sat.loopsAccum = 0; sat.activeTime = 0; sat.gateElapsed = 0; }
    sat.resting = false;
    sat.activeTime += dt;

    const targetPeri = sat.homeR - env * Math.max(0, sat.homeR - sat.coreMinD);
    const targetSepMag = env * Math.min(reachToMouse, sat.reachMax);
    const targetApo = targetPeri + targetSepMag;

    const zielKlick = dirToMouse + sat.apoOffset;
    const mischung = clamp01(env / (WAKE_THRESH * 4));
    const targetApoAng = sat.theta + normAngle(zielKlick - sat.theta) * mischung;

    const kShape = 1 - Math.exp(-dt / TAU_SHAPE);
    const maxShapeStep = MAX_SHAPE_RATE * dt;
    sat.curApo += weichBegrenzt((targetApo - sat.curApo) * kShape, maxShapeStep);
    sat.curPeri += weichBegrenzt((targetPeri - sat.curPeri) * kShape, maxShapeStep);

    const kAngle = 1 - Math.exp(-dt / TAU_ANGLE);
    sat.curApoAng += normAngle(targetApoAng - sat.curApoAng) * kAngle;

    const A = (sat.curApo + sat.curPeri) / 2;
    const e = (sat.curApo - sat.curPeri) / (sat.curApo + sat.curPeri);
    const r = A * (1 - e * e) / (1 - e * Math.cos(sat.theta - sat.curApoAng));

    const rampT = clamp01(sat.activeTime / RAMP_SEC);
    const rampIn = rampT * rampT * (3 - 2 * rampT);
    const loopsProgress = clamp01(sat.loopsAccum / MIN_LOOPS);
    const decelEnvelope = 1 - (1 - SPEED_FLOOR) * Math.pow(loopsProgress, DECAY_POW);
    const radialTerm = Math.pow(sat.homeR / r, RADIAL_POW);
    const keplerSpeed = sat.dirSign * BASE_OMEGA * rampIn * decelEnvelope * radialTerm;

    const signedErr = normAngle(sat.theta - sat.homeA);

    if (sat.loopsAccum >= MIN_LOOPS) { sat.gateElapsed += dt; } else { sat.gateElapsed = 0; }
    const loopGate = clamp01(sat.gateElapsed / GATE_TIME);
    const homingWeight = clamp01(1 - e / E_HOME_ENGAGE) * clamp01(1 - Math.abs(signedErr) / HOME_ENGAGE_ANGLE) * loopGate;

    const kinematicPull = (keplerSpeed - sat.thetaVel) * 40;
    const springPull = -SPRING_K * signedErr - SPRING_D * sat.thetaVel;
    const accel = kinematicPull * (1 - homingWeight) + springPull * homingWeight;
    sat.accel = accel;
    sat.thetaVel += accel * dt;
    sat.theta += sat.thetaVel * dt;
    sat.loopsAccum += Math.abs(sat.thetaVel) * dt / (2 * Math.PI);

    const rNow = A * (1 - e * e) / (1 - e * Math.cos(sat.theta - sat.curApoAng));
    sat.x = CX + rNow * Math.cos(sat.theta);
    sat.y = CY + rNow * Math.sin(sat.theta);

    sat.guide = (e > 0.01) ? {
      cx: CX + A * e * Math.cos(sat.curApoAng), cy: CY + A * e * Math.sin(sat.curApoAng),
      rx: A, ry: A * Math.sqrt(Math.max(0, 1 - e * e)),
      rot: (sat.curApoAng * 180) / Math.PI, opacity: Math.min(0.9, e * 2.2),
      focusX: CX + (sat.curApo - sat.curPeri) * Math.cos(sat.curApoAng),
      focusY: CY + (sat.curApo - sat.curPeri) * Math.sin(sat.curApoAng)
    } : null;

    if (
      homingWeight > 0.999 && Math.abs(signedErr) < EPS_ANGLE_TIGHT && Math.abs(sat.thetaVel) < EPS_VEL &&
      Math.abs(sat.curApo - sat.homeR) < EPS_SHAPE && Math.abs(sat.curPeri - sat.homeR) < EPS_SHAPE &&
      env < WAKE_THRESH
    ) {
      sat.resting = true; sat.thetaVel = 0; sat.guide = null;
    }
  }

  function resolveCoreDistance(sat: Satellite): void {
    if (sat.resting) return;
    const dx = sat.x - CX;
    const dy = sat.y - CY;
    const d = Math.hypot(dx, dy);
    if (d > 0 && d < sat.coreMinD) {
      const k = sat.coreMinD / d;
      sat.x = CX + dx * k; sat.y = CY + dy * k;
    }
  }

  const attractor = { x: CX, y: CY };
  let clickT0: number | null = null;
  const ENV_HOLD_SEC = 0.9;
  const ENV_RELEASE_SEC = 1.8;

  let hintDismissed = false;
  let hintBereit = false;

  function updateHint(): void {
    if (!hintBereit || !elHint) return;
    elHint.style.transition = 'opacity .6s ease';
    elHint.style.opacity = (docked || transitioning || hintDismissed) ? '0' : '0.55';
  }

  // ── Palette Cycling on Click (Script 8 from gravity-design.de) ──
  const COLORS = ['#B481F8', '#96B7D8', '#BB9B1B'];
  let colorIdx = 0;
  document.addEventListener('click', () => {
    colorIdx = (colorIdx + 1) % COLORS.length;
    document.documentElement.style.setProperty('--accent', COLORS[colorIdx]);
  });

  function onStageClick(clientX: number, clientY: number): void {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const rawX = (clientX - rect.left - offX) / scale;
    const rawY = (clientY - rect.top - offY) / scale;
    attractor.x = CX + (rawX - CX) / MARK_SCALE;
    attractor.y = CY + (rawY - CY) / MARK_SCALE;
    clickT0 = performance.now();

    small.loopsAccum = 0;
    ring.loopsAccum = 0;

    hintDismissed = true;
    updateHint();
    if (elAttractor) {
      elAttractor.setAttribute('cx', String(attractor.x));
      elAttractor.setAttribute('cy', String(attractor.y));
    }
  }
  stage.addEventListener('click', (e) => onStageClick(e.clientX, e.clientY));

  function currentEnv(now: number): number {
    if (clickT0 === null) return 0;
    const t = (now - clickT0) / 1000;
    if (t <= ENV_HOLD_SEC) return 1;
    const u = (t - ENV_HOLD_SEC) / ENV_RELEASE_SEC;
    if (u >= 1) return 0;
    return 1 - u * u * (3 - 2 * u);
  }

  // ── Docking to Header on Scroll ──
  const DOCK_THRESHOLD = 24;
  const UNDOCK_THRESHOLD = 8;
  const SPINUP_SEC = 0.85;
  const FLIGHT_SEC = 1.8;
  const DOCK_GAP = 24;
  const DOCK_MARGIN = 1;

  function brandDockLinks(): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rand')) || 56;
  }
  function brandDockOben(): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--brand-oben')) || 41;
  }
  function nurWortmarke(): boolean { return window.innerWidth <= 640; }
  const FLIGHT_EASE = 'cubic-bezier(0.45, 0, 0.15, 1)';

  let currentAnim: Animation | null = null;
  const logoLeft = Math.min(CX - massR, smallHome.x - smallR, ringHome.x - ringOut);
  const logoRight = Math.max(CX + massR, smallHome.x + smallR, ringHome.x + ringOut);
  const logoTop = Math.min(CY - massR, smallHome.y - smallR, ringHome.y - ringOut);
  const logoW = logoRight - logoLeft;
  let dockScrollY = 0;

  function transformStr(p: { scale: number; tx: number; ty: number }): string {
    return 'translate(' + p.tx + 'px,' + p.ty + 'px) scale(' + p.scale + ')';
  }

  function dockedSvgParts(): { scale: number; tx: number; ty: number } {
    if (nurWortmarke()) {
      const ruhe = svgRestParts();
      return {
        scale: ruhe.scale,
        tx: -ruhe.scale * (logoRight + logoW * 1.5),
        ty: ruhe.ty + dockScrollY
      };
    }
    const brandTextEl = document.getElementById('brandText') as SVGGraphicsElement | null;
    const textBox = brandTextEl ? brandTextEl.getBBox() : { x: 0, y: 0, width: 100, height: 28 };
    const textLeft = brandDockLinks() + textBox.x;
    const textBottom = brandDockOben() + textBox.y + textBox.height;
    const targetScale = (textBox.width / logoW) * DOCK_MARGIN;
    return {
      scale: targetScale,
      tx: textLeft - targetScale * logoLeft,
      ty: (textBottom + DOCK_GAP) - targetScale * logoTop + dockScrollY
    };
  }

  function dockLogo(): void {
    if (docked || transitioning || !elSvg) return;
    transitioning = true;
    docked = true;
    document.documentElement.classList.add('logo-gedockt');

    dockScrollY = window.scrollY;
    currentAnim = null;
    elSvg.getAnimations().forEach((a) => a.cancel());
    elSvg.style.transition = 'none';
    elSvg.style.position = 'fixed';
    elSvg.style.left = '0';
    elSvg.style.top = (-dockScrollY) + 'px';
    elSvg.style.transform = svgRestTransform();
    updateHint();

    if (small.resting) { small.resting = false; small.loopsAccum = 0; small.activeTime = 0; }
    if (ring.resting) { ring.resting = false; ring.loopsAccum = 0; ring.activeTime = 0; }
    clickT0 = null;

    setTimeout(() => {
      attractor.x = CX - 420;
      attractor.y = CY - 320;
      clickT0 = performance.now();

      const restParts = svgRestParts();
      const dockParts = dockedSvgParts();
      const midParts = {
        scale: restParts.scale + (dockParts.scale - restParts.scale) * 0.2,
        tx: restParts.tx + (dockParts.tx - restParts.tx) * 0.8,
        ty: restParts.ty + (dockParts.ty - restParts.ty) * 0.8
      };

      if (!elSvg) return;
      elSvg.style.transition = 'none';
      const anim = elSvg.animate([
        { transform: transformStr(restParts), offset: 0 },
        { transform: transformStr(midParts), offset: 0.6 },
        { transform: transformStr(dockParts), offset: 1 }
      ], { duration: FLIGHT_SEC * 1000, easing: FLIGHT_EASE, fill: 'forwards' });

      currentAnim = anim;
      const fertig = () => {
        if (currentAnim !== anim) return;
        currentAnim = null;
        if (elSvg) elSvg.style.transform = transformStr(dockParts);
        anim.cancel();
        transitioning = false;
        updateHint();
        checkScrollState();
      };
      anim.onfinish = fertig;
      anim.oncancel = fertig;
    }, SPINUP_SEC * 1000);
  }

  function undockLogo(): void {
    if (!docked || transitioning || !elSvg) return;
    transitioning = true;
    docked = false;
    document.documentElement.classList.remove('logo-gedockt');

    dockScrollY = window.scrollY;
    elSvg.style.top = (-dockScrollY) + 'px';

    attractor.x = CX + 320;
    attractor.y = CY + 220;
    clickT0 = performance.now();
    small.loopsAccum = 0;
    ring.loopsAccum = 0;

    currentAnim = null;
    elSvg.getAnimations().forEach((a) => a.cancel());
    const startParts = dockedSvgParts();
    const restParts2 = svgRestParts();
    const midParts2 = {
      scale: startParts.scale + (restParts2.scale - startParts.scale) * 0.75,
      tx: startParts.tx + (restParts2.tx - startParts.tx) * 0.3,
      ty: startParts.ty + (restParts2.ty - startParts.ty) * 0.3
    };

    elSvg.style.transition = 'none';
    const anim2 = elSvg.animate([
      { transform: transformStr(startParts), offset: 0 },
      { transform: transformStr(midParts2), offset: 0.4 },
      { transform: transformStr(restParts2), offset: 1 }
    ], { duration: FLIGHT_SEC * 1000, easing: FLIGHT_EASE, fill: 'forwards' });

    currentAnim = anim2;
    const fertig2 = () => {
      if (currentAnim !== anim2) return;
      currentAnim = null;
      if (elSvg) {
        elSvg.style.transform = svgRestTransform();
        anim2.cancel();
        elSvg.style.position = 'absolute';
        elSvg.style.left = '0';
        elSvg.style.top = '0';
      }
      transitioning = false;
      updateHint();
      checkScrollState();
    };
    anim2.onfinish = fertig2;
    anim2.oncancel = fertig2;
  }

  function checkScrollState(): void {
    const y = window.scrollY;
    if (transitioning && !docked && elSvg) { elSvg.style.top = (-y) + 'px'; }
    if (!docked && !transitioning && y > DOCK_THRESHOLD) { dockLogo(); }
    else if (docked && !transitioning && y < UNDOCK_THRESHOLD) { undockLogo(); }
  }
  window.addEventListener('scroll', checkScrollState, { passive: true });

  window.addEventListener('om:kopf-da', () => {
    hintBereit = true;
    updateHint();
  });

  // ── Entrance Setup ──
  function setupIntro(sat: Satellite, thetaOffset: number, apoStart: number, periStart: number): void {
    sat.resting = false;
    sat.theta = sat.homeA - sat.dirSign * thetaOffset;
    sat.curApo = apoStart;
    sat.curPeri = periStart;
    sat.curApoAng = sat.theta;
  }
  setupIntro(small, 4.0, 1500, 500);
  setupIntro(ring, 4.6, 1650, 600);

  let revealed = false;
  let lastFrame = performance.now();

  function frame(now: number): void {
    const dt = Math.min(0.033, (now - lastFrame) / 1000);
    lastFrame = now;
    const env = currentEnv(now);
    const dirToMouse = Math.atan2(attractor.y - CY, attractor.x - CX);
    const reachToMouse = Math.hypot(attractor.x - CX, attractor.y - CY);

    let rest = dt;
    while (rest > 1e-6) {
      const h = rest > MAX_SCHRITT ? MAX_SCHRITT : rest;
      stepSat(small, h, env, dirToMouse, reachToMouse);
      stepSat(ring, h, env, dirToMouse, reachToMouse);
      resolveCoreDistance(small);
      resolveCoreDistance(ring);
      rest -= h;
    }

    if (!revealed && small.resting && ring.resting) {
      revealed = true;
      updateHint();
    }

    const dxSum = (small.x - smallHome.x) + (ring.x - ringHome.x);
    const dySum = (small.y - smallHome.y) + (ring.y - ringHome.y);
    const recoilX = Math.max(-16, Math.min(16, -dxSum * 0.045));
    const recoilY = Math.max(-16, Math.min(16, -dySum * 0.045));
    if (elMass) {
      elMass.setAttribute('transform', 'translate(' + recoilX + ' ' + recoilY + ')');
      elMass.setAttribute('cx', String(CX));
      elMass.setAttribute('cy', String(CY));
    }

    if (elSmall) {
      elSmall.setAttribute('cx', String(small.x));
      elSmall.setAttribute('cy', String(small.y));
    }
    if (elRing) {
      elRing.setAttribute('cx', String(ring.x));
      elRing.setAttribute('cy', String(ring.y));
    }

    zeichneBahn(small, elGuideSmall, elFocusSmall, elCoordSmall, elCoordSmallXY, elCoordSmallA);
    zeichneBahn(ring, elGuideRing, elFocusRing, elCoordRing, elCoordRingXY, elCoordRingA);

    if (elAttractor) {
      elAttractor.setAttribute('opacity', String(Math.min(0.9, env * 1.8)));
    }

    requestAnimationFrame(frame);
  }

  elMass.setAttribute('cx', String(CX));
  elMass.setAttribute('cy', String(CY));
  stepSat(small, 0.016, 0, 0, 0);
  stepSat(ring, 0.016, 0, 0, 0);
  resolveCoreDistance(small);
  resolveCoreDistance(ring);
  requestAnimationFrame(frame);

  // ── Reveal Sequence on Image Load ──
  let gezeigt = false;
  const kopfzeilen = [
    document.getElementById('brand'),
    document.getElementById('lockup'),
    document.getElementById('claim'),
    document.getElementById('nav')
  ];

  function zeigen(): void {
    if (gezeigt) return;
    gezeigt = true;
    requestAnimationFrame(() => {
      if (elBg) elBg.classList.add('is-loaded');
      kopfzeilen.forEach((el) => { if (el) el.classList.add('is-da'); });
      window.dispatchEvent(new Event('om:kopf-da'));
    });
  }

  const img = new Image();
  img.onload = () => {
    if (img.decode) { img.decode().then(zeigen, zeigen); } else { zeigen(); }
  };
  img.onerror = zeigen;
  img.src = '/portrait.jpg';
  if (img.complete && img.naturalWidth) { img.onload(new Event('load')); }
  setTimeout(zeigen, 2000);
}
