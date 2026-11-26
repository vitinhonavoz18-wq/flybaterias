"use client";
/* eslint-disable @next/next/no-img-element */
/**
 * Composição das imagens de compartilhamento (somente desenvolvimento).
 * /og-lab/        → public/og-image.jpg
 * /og-lab/?v=bf   → public/og-black-friday.jpg
 */
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getVariant = () => new URLSearchParams(window.location.search).get("v") || "";

export default function OgLab() {
  const v = useSyncExternalStore(subscribe, getVariant, () => "");
  if (v === "bf") {
    return (
      <div style={{ width: 1200, height: 630 }} className="relative overflow-hidden bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_75%_at_78%_45%,rgba(0,71,187,0.6)_0%,rgba(10,10,12,0)_65%)]" />
        <div className="absolute bottom-[60px] left-[740px] h-[100px] w-[420px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.5),transparent)] blur-xl" />
        <img src="/renders/battery-hero.webp" alt="" className="absolute bottom-[18px] right-[34px] w-[440px]" />
        <div className="absolute left-[60px] top-[52px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-volt/50 bg-volt/10 px-5 py-2 text-[22px] font-extrabold uppercase tracking-[0.18em] text-volt">⚡ Black Friday FlyBaterias</span>
          <div className="mt-4 flex items-end gap-5">
            <span className="bf-discount !text-[210px]" style={{ animation: "none" }}>30%</span>
            <span className="bf-off !text-[86px]" style={{ animation: "none" }}>OFF</span>
          </div>
          <span className="bf-sub !text-[40px]">em todas as baterias</span>
          <p className="mt-6 text-[24px] font-semibold text-white/80">Até 30/11 · Salvador e região</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: 1200, height: 630 }} className="relative overflow-hidden bg-abyss">
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_75%_45%,#0b3a99_0%,rgba(6,20,47,0)_65%)]" />
      <div className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_70%_at_75%_50%,#000,transparent)]" />
      <div className="absolute bottom-[70px] left-[640px] h-[120px] w-[520px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.45),transparent)] blur-xl" />
      <img src="/renders/battery-hero.webp" alt="" className="absolute bottom-[60px] right-[40px] w-[560px]" />
      <div className="absolute left-[64px] top-[60px] w-[600px]">
        <img src="/brand/flybaterias-logo-dark.webp" alt="" className="h-[96px] w-auto" />
        <h1 className="display mt-10 text-[64px]">
          Seu carro não pode parar. <span className="text-volt">Sua energia também não.</span>
        </h1>
        <p className="mt-6 text-[24px] text-steel">Baterias automotivas em Salvador e região</p>
      </div>
    </div>
  );
}
