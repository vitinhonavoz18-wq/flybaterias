import { MapPin, ShieldCheck, MessageCircle, Wrench } from "lucide-react";
import { CarSilhouette } from "./CarSilhouette";
import HeroBattery3D from "@/components/three/HeroBattery3D";
import { WhatsAppIcon, Bolt } from "@/components/ui/icons";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import { site } from "@/config/site";

const d = (ms: number) => ({ ["--delay" as string]: `${ms}ms` });

export default function Hero() {
  const trust = [
    { icon: Wrench, text: "Orientação especializada" },
    { icon: ShieldCheck, text: "Garantia conforme o fabricante" },
    { icon: MessageCircle, text: "Atendimento rápido pelo WhatsApp" },
  ];

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-[var(--header-h)]">
      {/* ----- cenário ----- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_72%_38%,#0b3a99_0%,rgba(6,20,47,0)_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_70%_70%,rgba(255,208,0,0.16)_0%,rgba(6,20,47,0)_70%)]" />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(60%_60%_at_70%_45%,#000_20%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-abyss" />
      </div>

      <div className="container-fly grid min-h-[calc(100svh-var(--header-h))] items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-24">
        {/* ----- texto ----- */}
        <div className="relative z-10 max-w-2xl">
          <p className="fade-up inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2 pr-4 text-[0.82rem] text-white/80" style={d(80)}>
            <span className="grid size-6 place-items-center rounded-full bg-volt text-ink">
              <MapPin className="size-3.5" strokeWidth={2.5} />
            </span>
            Baterias automotivas em <strong className="font-semibold text-white">{site.region.label}</strong>
          </p>

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.6rem,9.6vw,3.6rem)] sm:text-[clamp(3.2rem,5.4vw,4.2rem)]">
            <span className="line-mask">
              <span style={d(120)}>Seu carro</span>
            </span>
            <span className="line-mask">
              <span style={d(220)}>não pode parar.</span>
            </span>
            <span className="line-mask">
              <span style={d(340)} className="text-volt">
                Sua energia
              </span>
            </span>
            <span className="line-mask">
              <span style={d(440)} className="text-volt">
                também não.
              </span>
            </span>
          </h1>

          <p className="lead fade-up mt-6 max-w-xl text-[1.08rem] md:text-[1.15rem]" style={d(560)}>
            Encontre a bateria ideal para seu veículo com atendimento especializado, qualidade e praticidade em Salvador e região.
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={d(660)}>
            <a href="#seletor" data-magnetic className="btn btn-volt w-full sm:w-auto">
              <Bolt className="size-4" />
              Encontrar minha bateria
            </a>
            <a
              href={whatsappUrl(messages.specialist)}
              target="_blank"
              rel="noopener"
              data-track="whatsapp_click"
              data-track-location="hero"
              data-track-label="especialista"
              data-magnetic
              className="btn btn-ghost w-full sm:w-auto"
            >
              <WhatsAppIcon className="size-5 text-whatsapp" />
              Falar com um especialista
            </a>
          </div>

          <ul className="fade-up mt-10 grid gap-3 text-[0.9rem] text-white/80 sm:grid-cols-3 sm:gap-4" style={d(780)}>
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon className="size-[18px] shrink-0 text-volt" strokeWidth={2} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ----- palco: carro + bateria ----- */}
        <div className="relative mx-auto w-full max-w-[680px] lg:max-w-none" aria-hidden="true">
          <div data-hero-stage className="relative aspect-[5/4] w-full">
            {/* carro ao fundo, em "plano de estúdio" */}
            <CarSilhouette className="fade-up absolute -right-[16%] bottom-[36%] w-[112%] max-w-none opacity-75 [mask-image:linear-gradient(90deg,transparent_0%,#000_22%)] lg:-right-[20%] lg:w-[118%]" />
            {/* piso refletivo */}
            <div className="absolute inset-x-[-20%] bottom-[11%] h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent" />
            {/* brilho de energia sob a bateria */}
            <div className="absolute bottom-[5%] left-[42%] h-[26%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.4),rgba(255,208,0,0))] blur-xl" />
            <picture>
              <source srcSet="/renders/battery-hero.avif" type="image/avif" />
              <img
                src="/renders/battery-hero.webp"
                width={868}
                height={666}
                alt=""
                fetchPriority="high"
                className="hero-battery absolute bottom-[4%] left-[42%] w-[68%] -translate-x-1/2 drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
              />
            </picture>
            {/* versão 3D interativa (substitui a imagem quando estiver pronta) */}
            <HeroBattery3D />
            {/* anel de energia */}
            <svg className="absolute bottom-[1%] left-[42%] w-[80%] -translate-x-1/2" viewBox="0 0 400 60" fill="none">
              <ellipse cx="200" cy="30" rx="196" ry="26" stroke="#FFD000" strokeOpacity="0.55" strokeWidth="1.2" pathLength={990} className="energy-flow" />
              <ellipse cx="200" cy="30" rx="196" ry="26" stroke="#5b9bff" strokeOpacity="0.25" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* indicador de rolagem */}
      <a href="#seletor" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.25em] text-white/50 lg:flex" aria-label="Rolar para o seletor de baterias">
        Role
        <span className="block h-10 w-px overflow-hidden bg-white/15">
          <span className="block h-1/2 w-full animate-[scrollhint_2s_ease-in-out_infinite] bg-volt" />
        </span>
      </a>
    </section>
  );
}
