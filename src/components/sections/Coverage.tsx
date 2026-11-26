"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { site } from "@/config/site";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Mapa estilizado de Salvador (península entre a Baía de Todos-os-Santos e o Atlântico). */
function SalvadorMap() {
  const coast =
    "M58 60 C92 78 118 96 132 122 C146 150 140 176 150 204 C160 232 150 262 128 286 C112 304 104 322 116 340 L132 352 C170 356 214 346 252 330 C300 310 342 286 378 250 C410 218 436 178 452 132 C462 102 470 74 476 40 L476 20 L58 20 Z";
  const dots = [
    { x: 150, y: 318, d: 0 },
    { x: 210, y: 300, d: 400 },
    { x: 274, y: 272, d: 800 },
    { x: 330, y: 236, d: 1200 },
    { x: 392, y: 178, d: 300 },
    { x: 230, y: 214, d: 700 },
    { x: 300, y: 160, d: 1100 },
    { x: 200, y: 140, d: 500 },
    { x: 420, y: 96, d: 900 },
    { x: 360, y: 110, d: 1500 },
  ];
  return (
    <div className="relative aspect-[5/4] w-full [mask-image:linear-gradient(180deg,transparent_0%,#000_22%)]">
      <svg viewBox="0 0 520 400" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <pattern id="dotgrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="#5b9bff" fillOpacity="0.55" />
          </pattern>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0e2756" />
            <stop offset="1" stopColor="#0a1d42" />
          </linearGradient>
          <clipPath id="landclip">
            <path d={coast} />
          </clipPath>
        </defs>
        <path d={coast} fill="url(#land)" />
        <rect width="520" height="400" fill="url(#dotgrid)" clipPath="url(#landclip)" />
        <path d={coast} fill="none" stroke="#5b9bff" strokeOpacity="0.6" strokeWidth="1.5" />
        {/* rotas animadas */}
        <path d="M150 318 C220 300 260 260 300 160 S 400 110 420 96" fill="none" stroke="#FFD000" strokeWidth="2" strokeLinecap="round" pathLength={990} className="energy-flow" />
        <path d="M200 140 C240 190 280 230 330 236" fill="none" stroke="#FFD000" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" pathLength={990} className="energy-flow" style={{ animationDelay: "-2s" }} />
        <text x="24" y="250" fill="#9aabc8" fontSize="11" letterSpacing="2" transform="rotate(-72 24 250)">
          BAÍA DE TODOS-OS-SANTOS
        </text>
        <text x="300" y="372" fill="#9aabc8" fontSize="11" letterSpacing="2" transform="rotate(-28 300 372)">
          OCEANO ATLÂNTICO
        </text>
        <text x="250" y="80" fill="#ffffff" fontSize="20" fontWeight="800" letterSpacing="1">
          SALVADOR
        </text>
      </svg>
      {dots.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pulse-dot absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt"
          style={{ left: `${(p.x / 520) * 100}%`, top: `${(p.y / 400) * 100}%`, ["--delay" as string]: `${p.d}ms` }}
        />
      ))}
    </div>
  );
}

export default function Coverage() {
  const [place, setPlace] = useState("");
  const href = whatsappUrl(messages.region(place.trim() || "(informar)"));
  return (
    <section id="atendimento" aria-labelledby="cov-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-fly grid items-center gap-12 lg:grid-cols-2">
        <div data-reveal className="panel relative order-2 min-w-0 overflow-hidden p-4 sm:p-8 lg:order-1">
          <SalvadorMap />
          <p className="mt-2 text-center text-[0.78rem] text-steel">Mapa ilustrativo</p>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <p data-reveal className="eyebrow text-volt">Atendimento regional</p>
          <h2 id="cov-title" data-reveal style={{ ["--delay" as string]: "80ms" }} className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            Onde você estiver, conte com a FlyBaterias.
          </h2>
          <p data-reveal style={{ ["--delay" as string]: "160ms" }} className="lead mt-5 max-w-lg">
            Precisando de uma bateria em Salvador ou região? Informe sua localização e nossa equipe orientará você sobre as opções de atendimento disponíveis.
          </p>

          {site.region.confirmedAreas.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.region.confirmedAreas.map((a) => (
                <li key={a} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/80">
                  {a}
                </li>
              ))}
            </ul>
          )}

          <form
            data-reveal
            style={{ ["--delay" as string]: "240ms" }}
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              track("region_check");
              track("whatsapp_click", { cta_location: "coverage" });
              window.open(href, "_blank", "noopener");
            }}
          >
            <label htmlFor="cov-input" className="mb-2 block text-sm font-semibold">
              Seu bairro ou CEP
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-steel" />
                <input
                  id="cov-input"
                  className="field !pl-12"
                  placeholder="Ex.: Itapuã ou 41000-000"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  maxLength={80}
                  autoComplete="postal-code"
                />
              </div>
              <button type="submit" className="btn btn-volt w-full !whitespace-normal text-center sm:w-auto sm:self-start">
                <WhatsAppIcon className="size-5" /> Consultar atendimento na minha região
              </button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[0.82rem] text-steel">
              <Navigation className="size-3.5" /> A informação é enviada somente para a nossa equipe, pelo WhatsApp.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
