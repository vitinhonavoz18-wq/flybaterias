import { Clock, MapPin, ShieldCheck } from "lucide-react";
import type { Campaign } from "@/config/campaigns";
import HeroBattery3D from "@/components/three/HeroBattery3D";
import { WhatsAppIcon, Bolt } from "@/components/ui/icons";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import Countdown from "./Countdown";

const d = (ms: number) => ({ ["--delay" as string]: `${ms}ms` });

/** Partículas de energia: posições fixas (sem aleatoriedade → sem diferença servidor/navegador). */
const PARTICLES = [
  [8, 92, 0, 7.5, "y"], [16, 70, 1.8, 9, "b"], [24, 88, 3.2, 8, "y"], [33, 76, 0.6, 10, "b"],
  [42, 95, 2.4, 7, "y"], [51, 82, 4.1, 9.5, "y"], [60, 90, 1.1, 8.5, "b"], [68, 72, 3.6, 7.8, "y"],
  [76, 86, 0.3, 9.2, "b"], [84, 94, 2.9, 8.2, "y"], [91, 78, 1.5, 10.5, "y"], [97, 88, 4.6, 7.2, "b"],
] as const;

function DiscountSeal({ percent }: { percent: number }) {
  return (
    <div className="seal pointer-events-none absolute right-[2%] top-[6%] z-20 size-[30%] min-w-[104px] max-w-[170px]" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="seal-ring absolute inset-0 size-full">
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="#0b0b0d" stroke="#FFD000" strokeWidth="3" />
        <text fill="#FFD000" fontSize="15" fontWeight="800" letterSpacing="4.6">
          <textPath href="#seal-circle">BLACK FRIDAY ⚡ FLYBATERIAS ⚡ BLACK FRIDAY ⚡ FLYBATERIAS ⚡</textPath>
        </text>
      </svg>
      <div className="absolute inset-[22%] grid place-items-center rounded-full bg-volt text-ink shadow-[0_0_40px_rgba(255,208,0,0.55)]">
        <span className="text-center leading-none">
          <span className="seal-num block font-black [font-stretch:110%]">{percent}%</span>
          <span className="seal-off block font-extrabold tracking-[0.2em]">OFF</span>
        </span>
      </div>
    </div>
  );
}

export default function CampaignHero({ campaign: c }: { campaign: Campaign }) {
  const [num, unit] = c.texts.headline.split(" "); // "30%" | "OFF"
  return (
    <section id="inicio" aria-labelledby="hero-title" className="bf-hero relative isolate overflow-hidden pt-[var(--header-h)]">
      {/* ----- cenário ----- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_74%_40%,rgba(0,71,187,0.55)_0%,rgba(10,10,12,0)_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_30%_at_70%_78%,rgba(255,208,0,0.18)_0%,rgba(10,10,12,0)_70%)]" />
        <div className="bf-beam absolute -top-[6vh] left-[58%] h-[86vh] max-h-[900px] w-[38vw] -translate-x-1/2" />
        <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(55%_55%_at_70%_50%,#000_10%,transparent_75%)]" />
        {PARTICLES.map(([x, y, delay, dur, color], i) => (
          <span
            key={i}
            className={`particle ${color === "y" ? "particle-y" : "particle-b"}`}
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-abyss" />
      </div>

      <div className="container-fly grid min-h-[calc(100svh-var(--header-h))] items-center gap-6 pb-14 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-4 lg:pb-20">
        {/* ----- oferta ----- */}
        <div className="relative z-10 min-w-0">
          <h1 id="hero-title" className="m-0">
            <span className="fade-up inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 py-1.5 pl-2 pr-4 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-volt [font-stretch:112%]" style={d(60)}>
              <span className="grid size-6 place-items-center rounded-full bg-volt text-ink">
                <Bolt className="size-3" />
              </span>
              {c.texts.eyebrow}
            </span>{" "}
            <span className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1 sm:gap-x-4">
              <span className="bf-discount" data-text={num}>
                {num}
              </span>{" "}
              <span className="bf-off fade-up" style={d(420)}>
                {unit}
              </span>
            </span>{" "}
            <span className="bf-sub fade-up" style={d(520)}>
              {c.texts.subheadline}
            </span>
          </h1>

          <p className="lead fade-up mt-5 max-w-xl text-[1.04rem] md:text-[1.12rem]" style={d(620)}>
            {c.texts.lead}
          </p>

          <div className="fade-up mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={d(700)}>
            <a
              href={whatsappUrl(messages.campaign)}
              target="_blank"
              rel="noopener"
              data-track="whatsapp_click"
              data-track-location="bf_hero"
              data-track-label="cta_30off"
              data-magnetic
              className="btn btn-volt bf-cta w-full !min-h-[58px] !whitespace-normal py-3 text-center !text-[0.95rem] uppercase leading-tight tracking-[0.02em] sm:w-auto sm:!whitespace-nowrap sm:!text-[1rem]"
            >
              <WhatsAppIcon className="size-5" />
              {c.texts.ctaPrimary}
            </a>
            <a href="#seletor" data-magnetic className="btn btn-ghost w-full !min-h-[58px] !whitespace-normal text-center sm:w-auto sm:!whitespace-nowrap">
              {c.texts.ctaSecondary}
            </a>
          </div>

          {c.rules.countdown && (
            <div className="fade-up mt-8 max-w-md" style={d(800)}>
              <p className="mb-3 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-white/70">
                <Clock className="size-4 text-volt" /> A oferta termina em
              </p>
              <Countdown endsAt={c.endsAt} />
            </div>
          )}

          <ul className="fade-up mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.86rem] text-white/75" style={d(880)}>
            <li className="flex items-center gap-2 font-semibold text-volt">
              <Clock className="size-4" /> {c.texts.urgency}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-volt" /> Salvador e região
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-volt" /> Garantia conforme o fabricante
            </li>
          </ul>
        </div>

        {/* ----- palco: baterias em profundidade ----- */}
        <div className="relative mx-auto w-full min-w-0 max-w-[680px] lg:max-w-none lg:self-start lg:pt-[10vh]" aria-hidden="true">
          <div data-hero-stage className="relative aspect-[5/4] w-full">
            {/* baterias ao fundo (profundidade) */}
            <picture>
              <source srcSet="/renders/battery-agm.avif" type="image/avif" />
              <img src="/renders/battery-agm.webp" width={706} height={541} alt="" loading="lazy" className="bf-depth absolute bottom-[26%] left-[-4%] w-[40%] opacity-70 blur-[1.5px] brightness-75" />
            </picture>
            <picture>
              <source srcSet="/renders/battery-efb.avif" type="image/avif" />
              <img src="/renders/battery-efb.webp" width={706} height={541} alt="" loading="lazy" className="bf-depth bf-depth-2 absolute bottom-[30%] right-[-6%] w-[38%] opacity-60 blur-[2px] brightness-[0.6]" />
            </picture>
            {/* piso refletivo e brilho */}
            <div className="absolute inset-x-[-20%] bottom-[11%] h-px bg-gradient-to-r from-transparent via-volt/50 to-transparent" />
            <div className="absolute bottom-[5%] left-[42%] h-[26%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,208,0,0.45),rgba(255,208,0,0))] blur-xl" />
            {/* bateria principal (mesma geometria do topo original → troca 3D sem salto) */}
            <picture>
              <source srcSet="/renders/battery-hero.avif" type="image/avif" />
              <img
                src="/renders/battery-hero.webp"
                width={868}
                height={666}
                alt=""
                fetchPriority="high"
                className="hero-battery absolute bottom-[4%] left-[42%] w-[68%] -translate-x-1/2 drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
              />
            </picture>
            <HeroBattery3D />
            <svg className="absolute bottom-[1%] left-[42%] w-[80%] -translate-x-1/2" viewBox="0 0 400 60" fill="none">
              <ellipse cx="200" cy="30" rx="196" ry="26" stroke="#FFD000" strokeOpacity="0.6" strokeWidth="1.4" pathLength={990} className="energy-flow" />
              <ellipse cx="200" cy="30" rx="196" ry="26" stroke="#5b9bff" strokeOpacity="0.25" strokeWidth="1" />
            </svg>
            <DiscountSeal percent={c.discountPercent} />
          </div>
        </div>
      </div>

      <p className="container-fly relative -mt-6 pb-8 text-[0.72rem] leading-relaxed text-white/45 lg:-mt-10">{c.texts.terms}</p>
    </section>
  );
}
