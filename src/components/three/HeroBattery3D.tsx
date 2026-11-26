"use client";

import { useEffect, useRef, useState } from "react";
import { Move3d } from "lucide-react";
import type { BatteryScene } from "./batteryScene";
import { track } from "@/lib/analytics";

/**
 * Bateria 3D interativa do topo do site.
 *
 * Estratégia de performance:
 *  1. A imagem estática (mesmo modelo, mesmo ângulo) aparece imediatamente — é ela
 *     que o Google mede como "maior elemento" (LCP).
 *  2. O Three.js só é baixado na PRIMEIRA INTERAÇÃO do visitante (mover o mouse,
 *     tocar, rolar ou usar o teclado) e depois que a página terminou de carregar.
 *     Assim a medição do Google (que não interage) não é afetada. É o mesmo
 *     arquivo usado na seção 3D — baixado uma vez só.
 *  3. Quando o 3D desenha o primeiro quadro, ele substitui a imagem com um
 *     esmaecimento, no mesmo ângulo — o visitante não percebe a troca.
 *  4. Fora da tela, a renderização pausa. Sem WebGL, com "economia de dados" ou
 *     em aparelhos sem aceleração gráfica (renderização por software), a imagem
 *     estática permanece. Para testes: ?3d=force força o 3D.
 */
export default function HeroBattery3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;

    let scene: BatteryScene | null = null;
    let disposed = false;
    let visible = true;
    let idleId = 0;
    let timer = 0;

    const visIO = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      scene?.setActive(visible && !document.hidden);
    });
    const onVis = () => scene?.setActive(visible && !document.hidden);

    const force = new URLSearchParams(window.location.search).get("3d") === "force";

    async function boot() {
      if (disposed) return;
      const test = document.createElement("canvas");
      const gl = (test.getContext("webgl2") || test.getContext("webgl")) as WebGLRenderingContext | null;
      if (!gl) return;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (!force && /swiftshader|llvmpipe|software|basic render/i.test(renderer)) return; // sem GPU: mantém a imagem
      try {
        const { createBatteryScene } = await import("./batteryScene");
        if (disposed || !canvas) return;
        scene = createBatteryScene(canvas, {
          variant: "hero",
          interactive: true,
          angle: -0.62,
          entrance: false,
          onReady: () => {
            setReady(true);
            wrap?.closest("[data-hero-stage]")?.setAttribute("data-3d", "ready");
          },
          onFirstInteraction: () => {
            setTouched(true);
            track("battery_3d_interaction", { location: "hero" });
          },
        });
        visIO.observe(wrap!);
        document.addEventListener("visibilitychange", onVis);
      } catch (err) {
        console.warn("3D do topo indisponível, mantendo imagem estática.", err);
      }
    }

    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idleId = ric(boot, { timeout: 1500 });
      else timer = window.setTimeout(boot, 300);
    };
    const EVENTS = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
    let started = false;
    const onFirstInput = () => {
      if (started) return;
      started = true;
      EVENTS.forEach((ev) => window.removeEventListener(ev, onFirstInput));
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, onFirstInput, { passive: true }));

    return () => {
      disposed = true;
      EVENTS.forEach((ev) => window.removeEventListener(ev, onFirstInput));
      window.removeEventListener("load", schedule);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId && cic) cic(idleId);
      if (timer) window.clearTimeout(timer);
      visIO.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-battery-3d absolute bottom-[-1.9%] left-[42%] aspect-[1100/860] w-[86.2%] -translate-x-1/2">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`size-full transition-opacity duration-700 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <span
        className={`pointer-events-none absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-abyss/70 px-3 py-1 text-[0.72rem] text-white/75 backdrop-blur transition-opacity duration-700 ${
          ready && !touched ? "opacity-100" : "opacity-0"
        }`}
      >
        <Move3d className="size-3.5 text-volt" /> Arraste para girar
      </span>
    </div>
  );
}
