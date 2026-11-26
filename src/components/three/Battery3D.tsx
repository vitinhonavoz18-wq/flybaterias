"use client";

import { useEffect, useRef, useState } from "react";
import type { BatteryScene } from "./batteryScene";
import { track } from "@/lib/analytics";

export type Hotspot = { id: string; title: string; text: string };

/**
 * Bateria 3D com carregamento sob demanda:
 *  - mostra uma imagem estática (gerada do mesmo modelo) imediatamente;
 *  - só baixa o Three.js quando a seção se aproxima da tela;
 *  - pausa a renderização fora da tela;
 *  - se o navegador não tiver WebGL, permanece a imagem estática.
 */
export default function Battery3D({ hotspots }: { hotspots: Hotspot[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hsRefs = useRef(new Map<string, HTMLElement>());
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    let scene: BatteryScene | null = null;
    let disposed = false;
    let visible = false;

    const visIO = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      scene?.setActive(visible && !document.hidden);
    });

    const loadIO = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        loadIO.disconnect();
        try {
          const test = document.createElement("canvas");
          if (!(test.getContext("webgl2") || test.getContext("webgl"))) return;
          const { createBatteryScene } = await import("./batteryScene");
          if (disposed) return;
          scene = createBatteryScene(canvas, {
            variant: "hero",
            interactive: true,
            hotspotEls: hsRefs.current,
            onReady: () => setReady(true),
            onFirstInteraction: () => track("battery_3d_interaction"),
          });
          visIO.observe(wrap);
        } catch (err) {
          console.warn("3D indisponível, exibindo imagem estática.", err);
        }
      },
      { rootMargin: "300px 0px" }
    );
    loadIO.observe(wrap);

    const onVis = () => scene?.setActive(visible && !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      loadIO.disconnect();
      visIO.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-[4/3.4] w-full select-none sm:aspect-[4/3]">
      <picture>
        <source srcSet="/renders/battery-hero.avif" type="image/avif" />
        { }
        <img
          src="/renders/battery-hero.webp"
          width={868}
          height={666}
          loading="lazy"
          alt="Bateria automotiva em visualização tridimensional"
          className={`absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      </picture>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Bateria 3D: arraste para girar. Use as setas do teclado para girar."
        className={`absolute inset-0 size-full outline-none transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />

      {/* Pontos de informação (posicionados pelo 3D a cada quadro) */}
      {ready &&
        hotspots.map((h, i) => (
          <div
            key={h.id}
            ref={(el) => {
              if (el) hsRefs.current.set(h.id, el);
              else hsRefs.current.delete(h.id);
            }}
            data-visible="false"
            className="group/hs pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-300 data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
          >
            <button
              type="button"
              onClick={() => setOpenId(openId === h.id ? null : h.id)}
              aria-expanded={openId === h.id}
              aria-label={h.title}
              className="pointer-events-auto relative -ml-4 -mt-4 grid size-8 place-items-center rounded-full bg-volt text-[0.75rem] font-bold text-ink shadow-[0_0_0_6px_rgba(255,208,0,0.18)] group-data-[visible=false]/hs:pointer-events-none"
            >
              {i + 1}
              <span className="pulse-dot absolute inset-0 rounded-full" />
            </button>
          </div>
        ))}

      <div className="sr-only" aria-live="polite">
        {ready ? "Visualização 3D carregada." : ""}
      </div>

      {openId && (
        <div className="step-in absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/10 bg-abyss/90 p-4 backdrop-blur-md sm:inset-x-auto sm:right-4 sm:w-80">
          <p className="font-semibold">{hotspots.find((h) => h.id === openId)?.title}</p>
          <p className="mt-1 text-sm text-steel">{hotspots.find((h) => h.id === openId)?.text}</p>
          <button type="button" onClick={() => setOpenId(null)} className="mt-2 text-sm font-semibold text-volt">
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
