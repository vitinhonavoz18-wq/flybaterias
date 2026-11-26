import { Star } from "lucide-react";
import { testimonials, googleRating } from "@/config/testimonials";

/** Aparece apenas quando houver avaliações reais cadastradas. */
export default function SocialProof() {
  if (testimonials.length < 3) return null;
  return (
    <section aria-labelledby="sp-title" className="py-24 md:py-32">
      <div className="container-fly">
        <p data-reveal className="eyebrow text-volt">Quem já foi atendido</p>
        <h2 id="sp-title" data-reveal className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]">
          Energia aprovada por quem roda todo dia.
        </h2>
        {googleRating && (
          <a href={googleRating.url} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 text-steel hover:text-white">
            <Star className="size-4 fill-volt text-volt" /> {googleRating.rating.toFixed(1).replace(".", ",")} no Google · {googleRating.count} avaliações
          </a>
        )}
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name + t.text.slice(0, 10)} data-reveal className="panel p-7">
              {t.rating && (
                <p className="flex gap-1">
                  <span className="sr-only">{t.rating} de 5 estrelas</span>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-volt text-volt" />
                  ))}
                </p>
              )}
              <blockquote className="mt-4 text-white/85">“{t.text}”</blockquote>
              <p className="mt-5 text-sm text-steel">
                {t.name} · {t.source}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
