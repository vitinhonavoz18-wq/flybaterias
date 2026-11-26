import { enabledBrands } from "@/config/catalog";
import { Bolt } from "@/components/ui/icons";
import { activeCampaign } from "@/config/campaigns";

/**
 * Faixa infinita: marcas efetivamente comercializadas + tecnologias.
 * Pausa ao passar o mouse/focar e para com "movimento reduzido".
 */
export default function BrandMarquee() {
  const brands = enabledBrands();
  const promo = activeCampaign
    ? [{ key: "p-campaign", label: `${activeCampaign.texts.eyebrow} · ${activeCampaign.discountPercent}% OFF`, logo: undefined, kind: "promo" as const }]
    : [];
  const items = [
    ...promo,
    ...brands.map((b) => ({ key: `b-${b.name}`, label: b.name, logo: b.logo, kind: "brand" as const })),
    ...["Convencional", "EFB", "AGM", "Start-Stop", "Utilitários"].map((t) => ({ key: `t-${t}`, label: t, logo: undefined, kind: "tech" as const })),
  ];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.key + hidden} className="flex items-center">
          {it.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.logo} alt={hidden ? "" : it.label} className="h-8 w-auto opacity-90" loading="lazy" />
          ) : (
            <span
              className={
                it.kind === "promo"
                  ? "display text-[1.9rem] text-volt md:text-[2.4rem]"
                  : it.kind === "brand"
                  ? "display text-[1.9rem] text-white md:text-[2.4rem]"
                  : "display text-[1.9rem] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.45)] md:text-[2.4rem]"
              }
            >
              {it.label}
            </span>
          )}
          <Bolt className="mx-8 size-5 text-volt md:mx-12" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Marcas e tecnologias" className="relative border-y border-white/8 bg-ink/40 py-7">
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
          {row(true)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
