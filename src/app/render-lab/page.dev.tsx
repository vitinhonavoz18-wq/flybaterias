"use client";

/**
 * Laboratório de renderização (somente em desenvolvimento).
 * Usado por scripts/render-assets.mjs para gerar as imagens estáticas
 * da bateria (fallback do 3D, vitrine e imagem de compartilhamento).
 */
import { useEffect, useRef } from "react";
import { createBatteryScene, type BatteryVariant } from "@/components/three/batteryScene";

export default function RenderLab() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const variant = (qs.get("variant") || "hero") as BatteryVariant;
    const angle = Number(qs.get("angle") ?? -0.55);
    const tilt = Number(qs.get("tilt") ?? 0);
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    let scene: ReturnType<typeof createBatteryScene> | null = null;
    document.fonts.ready.then(() => {
      scene = createBatteryScene(ref.current!, {
        variant,
        angle,
        tilt,
        autoRotate: false,
        entrance: false,
        maxDpr: 2,
        onReady: () => {
          scene?.setActive(false);
          document.body.dataset.ready = "true";
        },
      });
    });
    return () => scene?.dispose();
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
