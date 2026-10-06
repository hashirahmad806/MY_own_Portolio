/**
 * depth-canvas.ts
 *
 * WebGL 2.5D Depth Displacement Shader Engine from gravity-design.de:
 * - Compiles custom vertex and fragment shaders for depth map displacement
 * - Uses /portrait.jpg as RGB texture and /tiefenkarte.png as depth displacement map
 * - Smooth pointermove interpolation with inertia (TRAEGHEIT = 3.2, STAERKE = 0.008)
 * - Seamless fallback to CSS portrait on reduced-motion, mobile touch, or WebGL absence
 */

export function initDepthCanvas(): void {
  if (typeof window === 'undefined') return;

  const STAERKE = 0.008;
  const SPANNE = 0.68;
  const ANKER = 0.12;
  const TRAEGHEIT = 3.2;
  const ZOOM = 1.28;
  const MAX_PIXEL = 4.2e6;

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const leinwand = document.getElementById('bgTiefe') as HTMLCanvasElement | null;
  const elBg = document.getElementById('bg') as HTMLElement | null;
  if (!leinwand || !elBg) return;

  let gl: WebGLRenderingContext | null = null;
  try {
    gl = leinwand.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
      preserveDrawingBuffer: true,
    });
  } catch {
    gl = null;
  }
  if (!gl) return;

  const VS = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const FS = `
    precision highp float;
    uniform sampler2D uFoto;
    uniform sampler2D uTiefe;
    uniform vec2 uSkala;
    uniform vec2 uOffset;
    uniform vec2 uSchub;
    uniform float uAnker;
    uniform float uSpanne;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv * uSkala + uOffset;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
      }
      float d = texture2D(uTiefe, uv).r;
      float t = 1.0 - exp(-max(0.0, d - uAnker) / uSpanne);
      vec2 p = uv + uSchub * t;
      gl_FragColor = texture2D(uFoto, clamp(p, 0.0, 1.0));
    }
  `;

  function baue(typ: number, quelle: string): WebGLShader | null {
    if (!gl) return null;
    const sh = gl.createShader(typ);
    if (!sh) return null;
    gl.shaderSource(sh, quelle);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
    return sh;
  }

  const vs = baue(gl.VERTEX_SHADER, VS);
  const fs = baue(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  if (!prog) return;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uFoto = gl.getUniformLocation(prog, 'uFoto');
  const uTiefe = gl.getUniformLocation(prog, 'uTiefe');
  const uSkala = gl.getUniformLocation(prog, 'uSkala');
  const uOffset = gl.getUniformLocation(prog, 'uOffset');
  const uSchub = gl.getUniformLocation(prog, 'uSchub');
  const uAnker = gl.getUniformLocation(prog, 'uAnker');
  const uSpanne = gl.getUniformLocation(prog, 'uSpanne');

  gl.uniform1i(uFoto, 0);
  gl.uniform1i(uTiefe, 1);
  gl.uniform1f(uAnker, ANKER);
  gl.uniform1f(uSpanne, SPANNE);
  gl.clearColor(0, 0, 0, 0);

  function textur(bild: HTMLImageElement, einheit: number): WebGLTexture | null {
    if (!gl) return null;
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + einheit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bild);
    return t;
  }

  let texFoto: WebGLTexture | null = null;
  let texTiefe: WebGLTexture | null = null;
  let bereit = false;
  const an = true;
  let zielX = 0, zielY = 0, mx = 0, my = 0, kennt = false;
  let laeuft = false, zuletzt = 0, nochMal = false;
  let bgOben = 0, bgH = 0, bgW = 0;
  const letzt = [NaN, NaN, NaN, NaN, NaN, NaN];

  function messen(): void {
    if (!gl || !leinwand || !elBg) return;
    let y = 0;
    for (let n: HTMLElement | null = elBg; n; n = n.offsetParent as HTMLElement | null) {
      y += n.offsetTop;
    }
    bgOben = y;
    bgH = elBg.offsetHeight;
    bgW = elBg.clientWidth;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = bgW, h = window.innerHeight;
    const px = w * h * dpr * dpr;
    if (px > MAX_PIXEL) dpr *= Math.sqrt(MAX_PIXEL / px);
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (leinwand.width !== bw || leinwand.height !== bh) {
      leinwand.width = bw;
      leinwand.height = bh;
      gl.viewport(0, 0, bw, bh);
      letzt[0] = NaN;
    }
  }

  function zeichnen(): void {
    if (!bereit || !gl) return;
    const vh = window.innerHeight;
    const bildW = Math.max(bgW * ZOOM, bgH);
    const bildH = bildW;
    const fx = window.innerHeight > bgW ? 0.38 : 1;
    const bildX = (bgW - bildW) * fx;
    const bildY = (window as unknown as { __fotoY?: number }).__fotoY || 0;

    let klebe = window.pageYOffset - bgOben;
    if (klebe < 0) klebe = 0;
    const maxKlebe = bgH - vh;
    if (klebe > maxKlebe) klebe = maxKlebe < 0 ? 0 : maxKlebe;

    const sx = bgW / bildW, sy = vh / bildH;
    const ox = -bildX / bildW, oy = (klebe - bildY) / bildH;
    const hx = an ? -mx * STAERKE : 0;
    const hy = an ? -my * STAERKE : 0;

    if (
      sx === letzt[0] && sy === letzt[1] &&
      ox === letzt[2] && oy === letzt[3] &&
      hx === letzt[4] && hy === letzt[5]
    ) {
      return;
    }
    letzt[0] = sx; letzt[1] = sy; letzt[2] = ox;
    letzt[3] = oy; letzt[4] = hx; letzt[5] = hy;

    gl.uniform2f(uSkala, sx, sy);
    gl.uniform2f(uOffset, ox, oy);
    gl.uniform2f(uSchub, hx, hy);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function schritt(jetzt: number): void {
    const dt = zuletzt ? Math.min(0.05, (jetzt - zuletzt) / 1000) : 1 / 60;
    zuletzt = jetzt;
    const k = Math.min(1, dt * TRAEGHEIT);
    const dx = zielX - mx, dy = zielY - my;
    mx += dx * k;
    my += dy * k;
    zeichnen();
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001 || nochMal) {
      nochMal = false;
      requestAnimationFrame(schritt);
    } else {
      laeuft = false;
      zuletzt = 0;
    }
  }

  function anstossen(): void {
    nochMal = true;
    if (laeuft) return;
    laeuft = true;
    zuletzt = 0;
    requestAnimationFrame(schritt);
  }

  function laden(quelle: string, dann: (img: HTMLImageElement | null) => void): void {
    const bild = new Image();
    bild.onload = () => dann(bild);
    bild.onerror = () => dann(null);
    bild.src = quelle;
  }

  laden('/tiefenkarte.png', (karte) => {
    if (!karte) return;
    laden('/portrait.jpg', (foto) => {
      if (!foto) return;
      try {
        texTiefe = textur(karte, 1);
        texFoto = textur(foto, 0);
      } catch {
        return;
      }
      bereit = true;
      messen();
      zeichnen();

      function uebernehmen(): void {
        if (!elBg) return;
        if (!elBg.classList.contains('is-loaded')) {
          setTimeout(uebernehmen, 60);
          return;
        }
        elBg.classList.add('is-tiefe');
        anstossen();
      }
      uebernehmen();
    });
  });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    zielX = (e.clientX / window.innerWidth - 0.5) * 2;
    zielY = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!kennt) {
      kennt = true;
      mx = zielX;
      my = zielY;
    }
    anstossen();
  }, { passive: true });

  window.addEventListener('scroll', anstossen, { passive: true });
  window.addEventListener('resize', () => { messen(); anstossen(); });
  (window as unknown as { __tiefeNeu?: () => void }).__tiefeNeu = anstossen;

  leinwand.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    bereit = false;
    elBg.classList.remove('is-tiefe');
  });
}
