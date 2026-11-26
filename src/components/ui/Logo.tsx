/* eslint-disable @next/next/no-img-element */
import { site } from "@/config/site";

/** Logomarca oficial (versão para fundo escuro). */
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <img
      src="/brand/flybaterias-logo-dark-320.webp"
      srcSet="/brand/flybaterias-logo-dark-320.webp 320w, /brand/flybaterias-logo-dark.webp 640w"
      sizes="(min-width: 768px) 112px, 96px"
      width={320}
      height={171}
      alt={site.name}
      className={className}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
