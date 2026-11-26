"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { enabledCategories, products } from "@/config/catalog";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Vitrine premium. Enquanto não houver produtos reais cadastrados,
 * apresenta as LINHAS de baterias (categorias) com consulta pelo WhatsApp.
 */
export default function ProductShowcase() {
  const cats = enabledCategories();
  const [active, setActive] = useState(0);
  const cat = cats[active];
  const catProducts = products.filter((p) => p.categoryId === cat.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      {/* Palco do produto */}
      <div className="panel sheen relative isolate min-h-[360px] overflow-hidden sm:min-h-[460px]">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-royal/25 to-transparent" />
          <div className="absolute left-1/2 top-[18%] size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,155,255,0.35),transparent)]" />
          <div className="absolute bottom-[14%] left-1/2 h-[10%] w-[60%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.35),transparent)] blur-md" />
        </div>
        <span aria-hidden="true" className="display pointer-events-none absolute left-6 top-5 text-[clamp(3.5rem,10vw,7.5rem)] text-white/[0.05]">
          {cat.short}
        </span>
        <div key={cat.id} className="step-in absolute inset-0 grid place-items-center p-8">
          <picture>
            <source srcSet={`${cat.image}.avif`} type="image/avif" />
            { }
            <img src={`${cat.image}.webp`} alt={`Ilustração de ${cat.name.toLowerCase()}`} width={706} height={541} loading="lazy" className="max-h-[300px] w-auto max-w-[88%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)] sm:max-h-[380px]" />
          </picture>
        </div>
        <div className="absolute inset-x-6 bottom-5 flex items-end justify-between text-[0.78rem] text-steel">
          <span>Imagem ilustrativa</span>
          <span className="tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(cats.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Seleção de linha e detalhes */}
      <div className="flex flex-col">
        <div role="tablist" aria-label="Linhas de baterias" className="flex flex-wrap gap-2">
          {cats.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${c.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const n = (i + (e.key === "ArrowRight" ? 1 : cats.length - 1)) % cats.length;
                  setActive(n);
                  document.getElementById(`tab-${cats[n].id}`)?.focus();
                }
              }}
              className="chip aria-selected:!border-volt aria-selected:!bg-volt aria-selected:!text-ink"
            >
              {c.short}
            </button>
          ))}
        </div>

        <div key={cat.id} id={`panel-${cat.id}`} role="tabpanel" aria-labelledby={`tab-${cat.id}`} className="step-in mt-8 flex flex-1 flex-col">
          <h3 className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">{cat.name}</h3>
          <p className="lead mt-4">{cat.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/8 p-4">
              <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-steel">Aplicação</dt>
              <dd className="mt-1 font-semibold">{cat.use}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 p-4">
              <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-steel">Referência</dt>
              <dd className="mt-1 font-semibold">{cat.typicalRange}</dd>
            </div>
          </dl>

          {catProducts.length > 0 && (
            <ul className="mt-6 grid gap-2">
              {catProducts.map((p) => (
                <li key={p.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 p-4">
                  <span>
                    <strong className="block">
                      {p.brand} {p.model}
                    </strong>
                    <span className="text-sm text-steel">
                      {p.amperage} · {p.technology}
                      {p.warranty && ` · Garantia ${p.warranty}`}
                    </span>
                  </span>
                  <a
                    href={whatsappUrl(messages.product(p.brand, p.model))}
                    target="_blank"
                    rel="noopener"
                    onClick={() => (track("product_inquiry", { product: p.slug }), track("whatsapp_click", { cta_location: "product_card" }))}
                    className="btn btn-ghost !min-h-[40px] !px-4 text-sm"
                  >
                    {p.price ? p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Consultar valor"}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-8">
            <a
              href={whatsappUrl(messages.category(cat.name))}
              target="_blank"
              rel="noopener"
              onClick={() => (track("product_inquiry", { category: cat.id }), track("whatsapp_click", { cta_location: "showcase" }))}
              className="btn btn-volt w-full sm:w-auto"
            >
              <WhatsAppIcon className="size-5" />
              Consultar preços
              <ArrowUpRight className="size-4" />
            </a>
            <p className="mt-3 text-[0.82rem] text-steel">Valores e disponibilidade são informados no atendimento.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
