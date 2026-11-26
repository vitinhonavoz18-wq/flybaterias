"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Contagem regressiva REAL até um horário fixo (com fuso, ex.: -03:00).
 *  - Não reinicia ao atualizar a página (o prazo é absoluto).
 *  - Corrige relógios de celular desajustados usando a hora do servidor,
 *    que o Worker injeta em <html data-server-now>.
 *  - Ao zerar, registra o evento e recarrega a página: o Worker passa a
 *    servir o site original (campanha encerrada).
 */
type Parts = { d: number; h: number; m: number; s: number };

/** Diferença entre a hora do servidor (injetada pelo Worker) e a hora do aparelho. */
function serverSkew() {
  const serverNow = Number(document.documentElement.dataset.serverNow || 0);
  if (!serverNow) return 0;
  const diff = serverNow - performance.timeOrigin;
  return Math.abs(diff) > 5000 ? diff : 0; // ignora diferenças pequenas (latência de rede)
}

function split(ms: number): Parts {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ endsAt, variant = "hero" }: { endsAt: string; variant?: "hero" | "bar" }) {
  const end = Date.parse(endsAt);
  const [left, setLeft] = useState<number | null>(null);
  const expiredOnce = useRef(false);

  useEffect(() => {
    let timer = 0;
    const skew = serverSkew();
    const tick = () => {
      const now = Date.now() + skew;
      const ms = end - now;
      setLeft(ms);
      if (ms <= 0) {
        if (!expiredOnce.current) {
          expiredOnce.current = true;
          if (variant === "hero") track("campaign_expired");
          // evita recarregar em loop caso o servidor ainda responda com a campanha
          try {
            if (!sessionStorage.getItem("fly_campaign_reload")) {
              sessionStorage.setItem("fly_campaign_reload", "1");
              window.setTimeout(() => window.location.reload(), 4000);
            }
          } catch {
            /* sem armazenamento: não recarrega */
          }
        }
        return;
      }
      timer = window.setTimeout(tick, 1000 - (now % 1000) + 5);
    };
    timer = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timer);
  }, [end, variant]);

  const p = left === null ? null : split(left);
  const expired = left !== null && left <= 0;

  if (variant === "bar") {
    return (
      <span className="tabular-nums" aria-hidden={left === null}>
        {p ? (expired ? "Encerrada" : `${p.d}d ${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`) : " "}
      </span>
    );
  }

  const units: [keyof Parts, string][] = [
    ["d", "dias"],
    ["h", "horas"],
    ["m", "min"],
    ["s", "seg"],
  ];

  return (
    <div className="countdown" role="timer" aria-live="off" aria-label={p ? `Faltam ${p.d} dias, ${p.h} horas, ${p.m} minutos e ${p.s} segundos` : "Contagem regressiva"}>
      {expired ? (
        <p className="text-lg font-bold text-volt">Oferta encerrada. Obrigado por participar!</p>
      ) : (
        <ol className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map(([k, label]) => (
            <li key={k} className="countdown-tile">
              <span key={p ? p[k] : "x"} className="countdown-num">
                {p ? pad(p[k]) : "--"}
              </span>
              <span className="countdown-label">{label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
