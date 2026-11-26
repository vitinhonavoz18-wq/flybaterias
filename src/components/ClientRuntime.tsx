"use client";

import { useEffect } from "react";
import { captureUtm, track, type TrackEvent } from "@/lib/analytics";
import { site } from "@/config/site";

/**
 * Comportamentos globais leves, num único componente:
 *  - revela elementos ao rolar (data-reveal / data-reveal-mask);
 *  - rastreia cliques em links com data-track (sem precisar de JS em cada botão);
 *  - captura parâmetros UTM da campanha;
 *  - efeito magnético discreto em botões (somente desktop).
 */
export default function ClientRuntime() {
  useEffect(() => {
    captureUtm();

    if (site.contact.isPlaceholder) {
      console.warn("[FlyBaterias] Contatos provisórios: atualize WhatsApp e telefone em src/config/site.ts antes de publicar.");
    }

    // Scroll reveal
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "in");
          if (el.hasAttribute("data-reveal-mask")) el.setAttribute("data-reveal-mask", "in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal], [data-reveal-mask]").forEach((el) => io.observe(el));

    // Pausa animações contínuas de seções fora da tela (economiza CPU e bateria do celular)
    const pauseIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "100px 0px" }
    );
    document.querySelectorAll("main > section, footer").forEach((el) => pauseIO.observe(el));

    // Rastreamento por delegação de cliques
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!a) return;
      const event = a.dataset.track as TrackEvent;
      track(event, { cta_location: a.dataset.trackLocation, cta_label: a.dataset.trackLabel });
    };
    document.addEventListener("click", onClick);

    // Botões magnéticos (apenas com mouse e sem preferência de movimento reduzido)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.18;
          const y = (e.clientY - r.top - r.height / 2) * 0.28;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };
        const leave = () => (el.style.transform = "");
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      io.disconnect();
      pauseIO.disconnect();
      document.removeEventListener("click", onClick);
      cleanups.forEach((c) => c());
    };
  }, []);

  return null;
}
