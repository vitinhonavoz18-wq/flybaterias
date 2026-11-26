"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { whatsappUrl, messages } from "@/lib/whatsapp";

type Tech = {
  id: "convencional" | "efb" | "agm";
  name: string;
  full: string;
  summary: string;
  how: string;
  idealFor: string;
  cycles: 1 | 2 | 3; // resistência relativa a ciclos de carga/descarga
};

const techs: Tech[] = [
  {
    id: "convencional",
    name: "Convencional",
    full: "Chumbo-ácido inundada",
    summary: "A bateria mais comum da frota brasileira, com ótimo custo-benefício para veículos sem Start-Stop.",
    how: "As placas de chumbo ficam mergulhadas em eletrólito líquido (solução de ácido sulfúrico).",
    idealFor: "Carros sem sistema Start-Stop e com demanda elétrica convencional.",
    cycles: 1,
  },
  {
    id: "efb",
    name: "EFB",
    full: "Enhanced Flooded Battery",
    summary: "Uma evolução da convencional, reforçada para suportar as partidas frequentes do Start-Stop.",
    how: "Mantém o eletrólito líquido, mas com placas reforçadas e materiais que aumentam a resistência a ciclos.",
    idealFor: "Veículos com Start-Stop de entrada, quando especificado pela montadora.",
    cycles: 2,
  },
  {
    id: "agm",
    name: "AGM",
    full: "Absorbent Glass Mat",
    summary: "Tecnologia de alto desempenho para veículos com grande consumo elétrico e Start-Stop avançado.",
    how: "O eletrólito fica absorvido em mantas de fibra de vidro entre as placas — não há líquido livre.",
    idealFor: "Start-Stop avançado, frenagem regenerativa e veículos com muitos recursos eletrônicos.",
    cycles: 3,
  },
];

/** Corte esquemático de uma célula — muda conforme a tecnologia. */
function CellDiagram({ tech }: { tech: Tech["id"] }) {
  const plates = Array.from({ length: 7 });
  return (
    <svg viewBox="0 0 360 260" className="mx-auto w-full max-w-[440px]" role="img" aria-label={`Diagrama esquemático de uma célula de bateria ${tech.toUpperCase()}`}>
      <defs>
        <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f63e0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0047bb" stopOpacity="0.85" />
        </linearGradient>
        <pattern id="mat" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#ffd000" strokeOpacity="0.55" strokeWidth="2" />
        </pattern>
      </defs>
      {/* caixa */}
      <rect x="20" y="30" width="320" height="210" rx="18" fill="#0d1428" stroke="#ffffff" strokeOpacity="0.15" />
      {/* eletrólito líquido */}
      {tech !== "agm" && (
        <g>
          <rect x="30" y="70" width="300" height="160" rx="10" fill="url(#liq)" />
          <path d="M30 72 Q 67 62 105 72 T 180 72 T 255 72 T 330 72" stroke="#5b9bff" strokeWidth="2" fill="none" className="wave" />
        </g>
      )}
      {/* placas */}
      {plates.map((_, i) => {
        const x = 52 + i * 40;
        const positive = i % 2 === 0;
        return (
          <g key={i}>
            {tech === "agm" && i < plates.length - 1 && <rect x={x + 10} y="62" width="20" height="168" fill="url(#mat)" />}
            {tech === "efb" && i < plates.length - 1 && <rect x={x + 17} y="66" width="6" height="164" fill="#ffd000" fillOpacity="0.35" />}
            <rect x={x} y="56" width="10" height="176" rx="2" fill={positive ? "#8b94a7" : "#525c70"} stroke={tech === "efb" ? "#ffd000" : "none"} strokeOpacity="0.6" strokeWidth={tech === "efb" ? 1.5 : 0} />
          </g>
        );
      })}
      {/* polos */}
      <rect x="62" y="12" width="26" height="22" rx="4" fill="#a9aeb6" />
      <rect x="272" y="12" width="26" height="22" rx="4" fill="#a9aeb6" />
      <text x="75" y="8" textAnchor="middle" fill="#ff6b6b" fontSize="14" fontWeight="700">+</text>
      <text x="285" y="8" textAnchor="middle" fill="#5b9bff" fontSize="14" fontWeight="700">−</text>
    </svg>
  );
}

export default function BatteryTech() {
  const [i, setI] = useState(0);
  const t = techs[i];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="panel relative overflow-hidden p-6 sm:p-10">
        <div aria-hidden="true" className="absolute -left-20 -top-20 size-64 rounded-full bg-royal/30 blur-3xl" />
        <div key={t.id} className="step-in relative">
          <CellDiagram tech={t.id} />
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.8rem] text-steel">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-sm bg-[#8b94a7]" /> Placas de chumbo
            </span>
            {t.id !== "agm" && (
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-royal-2" /> Eletrólito líquido
              </span>
            )}
            {t.id === "efb" && (
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-volt/60" /> Reforço das placas
              </span>
            )}
            {t.id === "agm" && (
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-sm bg-volt/60" /> Manta de fibra de vidro
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div role="tablist" aria-label="Tecnologias de bateria" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {techs.map((x, n) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={n === i}
              aria-controls="tech-panel"
              onClick={() => setI(n)}
              className={`rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition-colors ${n === i ? "bg-volt text-ink" : "text-white/70 hover:text-white"}`}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div id="tech-panel" role="tabpanel" key={t.id} className="step-in mt-8">
          <p className="eyebrow text-steel">{t.full}</p>
          <h3 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">{t.name}</h3>
          <p className="lead mt-4">{t.summary}</p>
          <dl className="mt-6 grid gap-4">
            <div className="border-t border-white/8 pt-4">
              <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-volt">Como funciona</dt>
              <dd className="mt-1 text-white/85">{t.how}</dd>
            </div>
            <div className="border-t border-white/8 pt-4">
              <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-volt">Indicada para</dt>
              <dd className="mt-1 text-white/85">{t.idealFor}</dd>
            </div>
            <div className="border-t border-white/8 pt-4">
              <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-volt">Resistência a ciclos (comparativo)</dt>
              <dd className="mt-3 flex gap-1.5">
                <span className="sr-only">Nível {t.cycles} de 3</span>
                {[1, 2, 3].map((n) => (
                  <span key={n} aria-hidden="true" className={`h-2 flex-1 rounded-full transition-colors duration-500 ${n <= t.cycles ? "bg-volt" : "bg-white/10"}`} />
                ))}
              </dd>
            </div>
          </dl>
          <p className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[0.9rem] text-white/80">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-volt" />
            Use sempre a tecnologia especificada pelo fabricante do veículo. Trocar uma tecnologia por outra sem validação técnica pode comprometer o funcionamento do carro.
          </p>
          <a href={whatsappUrl(messages.tech(t.name))} target="_blank" rel="noopener" data-track="whatsapp_click" data-track-location="tech" className="btn btn-ghost mt-6">
            Descobrir a bateria ideal
          </a>
        </div>
      </div>
    </div>
  );
}
