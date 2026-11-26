/**
 * Cena 3D da bateria (Three.js puro — sem frameworks extras, para manter
 * o pacote leve). Modelada com proporções reais de uma bateria automotiva
 * 60Ah (242 x 175 x 175 mm). Usada:
 *  - na seção interativa (rotação por mouse/toque, pontos de informação);
 *  - no laboratório de renderização, para gerar as imagens estáticas (fallback).
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type BatteryVariant = "hero" | "car" | "efb" | "agm" | "heavy" | "moto";

type VariantSpec = {
  L: number; // comprimento (x)
  W: number; // largura (z)
  H: number; // altura (y)
  caseColor: string;
  lidColor: string;
  insetColor: string;
  accent: string;
  label: string;
  tech: string;
};

const SPECS: Record<BatteryVariant, VariantSpec> = {
  hero: { L: 2.42, W: 1.75, H: 1.75, caseColor: "#16181d", lidColor: "#121418", insetColor: "#0047BB", accent: "#FFD000", label: "12V", tech: "AUTOMOTIVA" },
  car: { L: 2.42, W: 1.75, H: 1.75, caseColor: "#16181d", lidColor: "#121418", insetColor: "#0047BB", accent: "#FFD000", label: "12V", tech: "CONVENCIONAL" },
  efb: { L: 2.42, W: 1.75, H: 1.75, caseColor: "#e9edf3", lidColor: "#0b2a66", insetColor: "#0047BB", accent: "#FFD000", label: "12V", tech: "EFB · START-STOP" },
  agm: { L: 2.42, W: 1.75, H: 1.75, caseColor: "#0d0e11", lidColor: "#0d0e11", insetColor: "#FFD000", accent: "#FFD000", label: "12V", tech: "AGM · START-STOP" },
  heavy: { L: 3.3, W: 1.73, H: 2.2, caseColor: "#16181d", lidColor: "#121418", insetColor: "#0047BB", accent: "#FFD000", label: "12V", tech: "HEAVY DUTY" },
  moto: { L: 1.5, W: 0.87, H: 1.45, caseColor: "#16181d", lidColor: "#121418", insetColor: "#0047BB", accent: "#FFD000", label: "12V", tech: "MOTO" },
};

export type HotspotDef = { id: string; pos: THREE.Vector3; normal: THREE.Vector3 };

export type SceneOptions = {
  variant?: BatteryVariant;
  interactive?: boolean;
  autoRotate?: boolean;
  /** Ângulo inicial (radianos) — usado nas imagens estáticas. */
  angle?: number;
  tilt?: number;
  entrance?: boolean;
  hotspotEls?: Map<string, HTMLElement>;
  onReady?: () => void;
  onFirstInteraction?: () => void;
  maxDpr?: number;
};

/* ---------- textura do rótulo (desenhada em canvas) ---------- */
function makeLabelTexture(spec: VariantSpec, aspect: number) {
  const w = 1024;
  const h = Math.round(w / aspect);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const dark = spec.caseColor === "#e9edf3" ? false : true;

  const bg = g.createLinearGradient(0, 0, w, h);
  if (dark) {
    bg.addColorStop(0, "#0a1a3d");
    bg.addColorStop(0.55, "#06142F");
    bg.addColorStop(1, "#030a1a");
  } else {
    bg.addColorStop(0, "#0b3a99");
    bg.addColorStop(1, "#06142F");
  }
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);

  // faixa diagonal azul royal
  g.fillStyle = "#0047BB";
  g.beginPath();
  g.moveTo(w * 0.62, h);
  g.lineTo(w * 0.86, 0);
  g.lineTo(w, 0);
  g.lineTo(w, h);
  g.closePath();
  g.fill();
  g.fillStyle = "#1e6bff";
  g.beginPath();
  g.moveTo(w * 0.8, h);
  g.lineTo(w, h * 0.28);
  g.lineTo(w, h);
  g.closePath();
  g.fill();

  // faixa amarela de velocidade
  g.fillStyle = spec.accent;
  g.beginPath();
  g.moveTo(w * 0.56, h);
  g.lineTo(w * 0.8, 0);
  g.lineTo(w * 0.835, 0);
  g.lineTo(w * 0.595, h);
  g.closePath();
  g.fill();

  // raio
  const bx = w * 0.07;
  const by = h * 0.2;
  const s = h * 0.0048;
  g.save();
  g.translate(bx, by);
  g.scale(s, s);
  g.fillStyle = spec.accent;
  g.beginPath();
  g.moveTo(58, 0);
  g.lineTo(10, 58);
  g.lineTo(38, 58);
  g.lineTo(22, 100);
  g.lineTo(72, 36);
  g.lineTo(44, 36);
  g.closePath();
  g.fill();
  g.restore();

  // tipografia
  const font = "'Archivo Variable', 'Arial Black', Arial, sans-serif";
  g.fillStyle = "#ffffff";
  g.font = `900 ${Math.round(h * 0.42)}px ${font}`;
  g.textBaseline = "alphabetic";
  g.fillText(spec.label, w * 0.25, h * 0.58);
  g.font = `700 ${Math.round(h * 0.062)}px ${font}`;
  if ("letterSpacing" in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
  g.fillStyle = spec.accent;
  g.fillText(spec.tech, w * 0.255, h * 0.72);

  // linha fina
  g.fillStyle = "rgba(255,255,255,0.25)";
  g.fillRect(w * 0.08, h * 0.79, w * 0.46, 2);

  // pictogramas de segurança (como em rótulos reais)
  const icons = 6;
  for (let i = 0; i < icons; i++) {
    const x = w * 0.08 + i * h * 0.105;
    const y = h * 0.84;
    const r = h * 0.04;
    g.strokeStyle = "rgba(255,255,255,0.75)";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(x + r, y + r, r, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.fillRect(x + r - 2, y + r * 0.45, 4, r * 0.9);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, "rgba(0,0,0,0.85)");
  grd.addColorStop(0.45, "rgba(0,0,0,0.45)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/* ---------- modelo ---------- */
function buildBattery(spec: VariantSpec) {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  const { L, W, H } = spec;
  const lidH = H * 0.13;
  const caseH = H - lidH;
  const r = Math.min(L, W) * 0.03;

  const caseMat = track(
    new THREE.MeshPhysicalMaterial({ color: spec.caseColor, roughness: 0.42, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35 })
  );
  const lidMat = track(
    new THREE.MeshPhysicalMaterial({ color: spec.lidColor, roughness: 0.5, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.4 })
  );
  const insetMat = track(
    new THREE.MeshPhysicalMaterial({ color: spec.insetColor, roughness: 0.35, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2 })
  );
  const leadMat = track(new THREE.MeshStandardMaterial({ color: "#a9aeb6", roughness: 0.32, metalness: 0.95 }));
  const plasticDark = track(new THREE.MeshStandardMaterial({ color: "#08090b", roughness: 0.6 }));
  const redMat = track(new THREE.MeshStandardMaterial({ color: "#d62828", roughness: 0.45 }));
  const blueMat = track(new THREE.MeshStandardMaterial({ color: "#0b1f4a", roughness: 0.45 }));
  const accentMat = track(new THREE.MeshStandardMaterial({ color: spec.accent, roughness: 0.4, emissive: spec.accent, emissiveIntensity: 0.15 }));

  // corpo
  const body = new THREE.Mesh(track(new RoundedBoxGeometry(L, caseH, W, 5, r)), caseMat);
  body.position.y = caseH / 2;
  group.add(body);

  // ressalto de fixação na base
  const ledge = new THREE.Mesh(track(new RoundedBoxGeometry(L + 0.02, H * 0.05, W + 0.09, 3, 0.02)), caseMat);
  ledge.position.y = H * 0.025;
  group.add(ledge);

  // nervuras nas laterais curtas
  const ribGeo = track(new RoundedBoxGeometry(0.035, caseH * 0.72, W * 0.06, 2, 0.012));
  for (const sx of [-1, 1]) {
    for (let i = -1; i <= 1; i++) {
      const rib = new THREE.Mesh(ribGeo, caseMat);
      rib.position.set(sx * (L / 2 + 0.012), caseH * 0.5, i * W * 0.28);
      group.add(rib);
    }
  }

  // tampa
  const lid = new THREE.Mesh(track(new RoundedBoxGeometry(L + 0.03, lidH, W + 0.03, 5, r * 1.2)), lidMat);
  lid.position.y = caseH + lidH / 2 - 0.005;
  group.add(lid);
  const topY = caseH + lidH;

  // painel central da tampa (cor da variante)
  const inset = new THREE.Mesh(track(new RoundedBoxGeometry(L * 0.5, 0.03, W * 0.44, 3, 0.012)), insetMat);
  inset.position.set(0, topY + 0.01, W * 0.12);
  group.add(inset);

  // tira de respiro frontal
  const vent = new THREE.Mesh(track(new RoundedBoxGeometry(L * 0.78, 0.022, W * 0.06, 2, 0.008)), plasticDark);
  vent.position.set(0, topY + 0.006, W * 0.42);
  group.add(vent);

  // alça rebatida
  const handle = new THREE.Mesh(track(new RoundedBoxGeometry(L * 0.07, 0.035, W * 0.9, 3, 0.014)), plasticDark);
  handle.position.set(0, topY + 0.02, 0);
  group.add(handle);
  const pivotGeo = track(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 20));
  for (const sz of [-1, 1]) {
    const p = new THREE.Mesh(pivotGeo, plasticDark);
    p.rotation.x = Math.PI / 2;
    p.position.set(0, topY - 0.01, sz * (W / 2 + 0.03));
    group.add(p);
  }

  // polos
  const tz = -W / 2 + W * 0.17;
  const tx = L / 2 - L * 0.12;
  const scale = Math.min(1, L / 2.42) * 0.5 + 0.5;
  const padGeo = track(new THREE.CylinderGeometry(0.16 * scale, 0.17 * scale, 0.05, 32));
  const postGeo = track(new THREE.CylinderGeometry(0.072 * scale, 0.088 * scale, 0.2 * scale, 32));
  const ringGeo = track(new THREE.TorusGeometry(0.135 * scale, 0.022 * scale, 12, 40));
  const terminals: THREE.Vector3[] = [];
  for (const [i, sx] of [-1, 1].entries()) {
    const pad = new THREE.Mesh(padGeo, plasticDark);
    pad.position.set(sx * tx, topY + 0.025, tz);
    group.add(pad);
    const post = new THREE.Mesh(postGeo, leadMat);
    post.position.set(sx * tx, topY + 0.05 + 0.1 * scale, tz);
    group.add(post);
    const ring = new THREE.Mesh(ringGeo, i === 1 ? redMat : blueMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(sx * tx, topY + 0.055, tz);
    group.add(ring);
    terminals.push(new THREE.Vector3(sx * tx, topY + 0.25 * scale, tz));
  }

  // símbolos + e −
  const barGeo = track(new THREE.BoxGeometry(0.13 * scale, 0.012, 0.03 * scale));
  const plus1 = new THREE.Mesh(barGeo, redMat);
  plus1.position.set(tx - 0.3 * scale, topY + 0.006, tz);
  const plus2 = plus1.clone();
  plus2.rotation.y = Math.PI / 2;
  const minus = new THREE.Mesh(barGeo, accentMat);
  minus.position.set(-tx + 0.3 * scale, topY + 0.006, tz);
  group.add(plus1, plus2, minus);

  // rótulo frontal
  const labelW = L * 0.88;
  const labelH = caseH * 0.68;
  const labelTex = track(makeLabelTexture(spec, labelW / labelH));
  const labelMat = track(new THREE.MeshPhysicalMaterial({ map: labelTex, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 }));
  const label = new THREE.Mesh(track(new THREE.PlaneGeometry(labelW, labelH)), labelMat);
  label.position.set(0, caseH * 0.5, W / 2 + 0.002);
  group.add(label);

  // centraliza o modelo
  group.position.y = -H / 2;

  const hotspots: HotspotDef[] = [
    { id: "polos", pos: terminals[1].clone().add(new THREE.Vector3(0, 0, 0)), normal: new THREE.Vector3(0, 1, 0.2) },
    { id: "tampa", pos: new THREE.Vector3(-L * 0.18, topY + 0.03, W * 0.3), normal: new THREE.Vector3(0, 1, 0.4) },
    { id: "rotulo", pos: new THREE.Vector3(L * 0.05, caseH * 0.42, W / 2 + 0.01), normal: new THREE.Vector3(0, 0, 1) },
    { id: "caixa", pos: new THREE.Vector3(L / 2 + 0.02, caseH * 0.35, 0), normal: new THREE.Vector3(1, 0, 0) },
  ];
  hotspots.forEach((h) => (h.pos.y -= H / 2));

  return { group, hotspots, size: { L, W, H }, dispose: () => disposables.forEach((d) => d.dispose()) };
}

/* ---------- cena ---------- */
export function createBatteryScene(canvas: HTMLCanvasElement, opts: SceneOptions = {}) {
  const variant = opts.variant ?? "hero";
  const spec = SPECS[variant];
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const maxDpr = opts.maxDpr ?? (window.innerWidth < 768 ? 1.5 : 1.75);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  // iluminação cinematográfica: chave branca, recorte azul, preenchimento amarelo
  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(-4, 6, 6);
  const rim = new THREE.DirectionalLight("#2f74ff", 5.5);
  rim.position.set(5, 3, -5);
  const rim2 = new THREE.DirectionalLight("#4d8bff", 2.5);
  rim2.position.set(-6, 2, -4);
  const fill = new THREE.PointLight("#ffd000", 4, 12, 1.6);
  fill.position.set(-3.6, -1.2, 3.4);
  scene.add(key, rim, rim2, fill, new THREE.AmbientLight("#9fb6ff", 0.25));

  const pivot = new THREE.Group();
  scene.add(pivot);
  const model = buildBattery(spec);
  pivot.add(model.group);

  // sombra de contato
  const shadowTex = makeShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.7 });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(spec.L * 1.7, spec.W * 2.0, 1);
  shadow.position.y = -spec.H / 2 - 0.005;
  scene.add(shadow);

  // enquadramento automático pela esfera envolvente
  const radius = Math.sqrt(spec.L ** 2 + spec.W ** 2 + spec.H ** 2) / 2;
  const target = new THREE.Vector3(0, 0, 0);
  function frame(width: number, height: number) {
    const aspect = width / Math.max(1, height);
    camera.aspect = aspect;
    const vFov = (camera.fov * Math.PI) / 180;
    const fitH = radius / Math.sin(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fitW = radius / Math.sin(hFov / 2);
    const dist = Math.max(fitH, fitW) * 1.04;
    camera.position.set(0, dist * 0.3, dist * 0.954);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || canvas.clientWidth || 600;
    const h = parent?.clientHeight || canvas.clientHeight || 400;
    renderer.setSize(w, h, false);
    frame(w, h);
  }
  resize();

  // estado de rotação
  let rotY = opts.angle ?? -0.55;
  let tilt = opts.tilt ?? 0;
  let velY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastInteraction = -10_000;
  let interacted = false;
  const autoRotate = (opts.autoRotate ?? true) && !reduceMotion;
  const entranceStart = performance.now();
  const doEntrance = (opts.entrance ?? true) && !reduceMotion;

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    if (!interacted) {
      interacted = true;
      opts.onFirstInteraction?.();
    }
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = dx * 0.0085;
    rotY += velY;
    tilt = THREE.MathUtils.clamp(tilt + dy * 0.004, -0.35, 0.45);
    lastInteraction = performance.now();
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    lastInteraction = performance.now();
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") rotY -= 0.25;
    else if (e.key === "ArrowRight") rotY += 0.25;
    else return;
    e.preventDefault();
    lastInteraction = performance.now();
  };
  if (opts.interactive) {
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y"; // rolagem vertical continua funcionando no celular
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("keydown", onKey);
  }

  const tmp = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  function updateHotspots() {
    const els = opts.hotspotEls;
    if (!els || els.size === 0) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    pivot.updateMatrixWorld();
    for (const hs of model.hotspots) {
      const el = els.get(hs.id);
      if (!el) continue;
      tmp.copy(hs.pos).applyMatrix4(pivot.matrixWorld);
      nrm.copy(hs.normal).normalize().transformDirection(pivot.matrixWorld);
      camDir.copy(camera.position).sub(tmp).normalize();
      const facing = nrm.dot(camDir);
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * w;
      const y = (-tmp.y * 0.5 + 0.5) * h;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.dataset.visible = facing > 0.12 && entranceDone ? "true" : "false";
    }
  }

  let entranceDone = !doEntrance;
  let raf = 0;
  let active = true;
  let last = performance.now();
  let readyCalled = false;

  function tick(now: number) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    let entranceK = 1;
    if (doEntrance && !entranceDone) {
      const t = Math.min(1, (now - entranceStart) / 1500);
      entranceK = 1 - Math.pow(1 - t, 3);
      if (t >= 1) entranceDone = true;
    }

    if (!dragging) {
      if (Math.abs(velY) > 0.0001) {
        rotY += velY;
        velY *= 0.92;
      }
      if (autoRotate && now - lastInteraction > 2600) rotY += dt * 0.32;
      tilt += (0.0 - tilt) * Math.min(1, dt * 1.2) * (now - lastInteraction > 2600 ? 1 : 0);
    }

    pivot.rotation.y = rotY - (1 - entranceK) * 1.6;
    pivot.rotation.x = tilt;
    pivot.position.y = -(1 - entranceK) * 0.8;
    const s = 0.82 + 0.18 * entranceK;
    pivot.scale.setScalar(s);
    shadowMat.opacity = 0.7 * entranceK;

    renderer.render(scene, camera);
    updateHotspots();
    if (!readyCalled) {
      readyCalled = true;
      opts.onReady?.();
    }
    if (active) raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }
  start();

  const ro = new ResizeObserver(() => resize());
  if (canvas.parentElement) ro.observe(canvas.parentElement);

  return {
    setActive(v: boolean) {
      active = v;
      if (v) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    renderOnce() {
      renderer.render(scene, camera);
    },
    dispose() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("keydown", onKey);
      model.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      shadow.geometry.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

export type BatteryScene = ReturnType<typeof createBatteryScene>;
