import { BadgeCheck, Compass, MapPin, MessageCircle, ShieldCheck, Truck, Wrench } from "lucide-react";
import { site } from "@/config/site";
import { Bolt } from "@/components/ui/icons";

/** Diferenciais — somente itens verdadeiros; serviços entram quando confirmados em site.ts. */
export default function Differentials() {
  const items = [
    { icon: Compass, title: "Orientação para escolher certo", text: "Conferimos marca, modelo, ano e motorização para indicar a bateria adequada ao seu veículo." },
    { icon: BadgeCheck, title: "Produtos de qualidade", text: "Trabalhamos com baterias de marcas reconhecidas no mercado automotivo." },
    { icon: ShieldCheck, title: "Garantia conforme o fabricante", text: "Você recebe as condições de garantia de cada opção antes de decidir." },
    { icon: MessageCircle, title: "Praticidade no atendimento", text: "Tudo pelo WhatsApp: consulta, orçamento e combinação do atendimento." },
    ...(site.services.delivery ? [{ icon: Truck, title: "Entrega", text: "Levamos a bateria até você, conforme a região." }] : []),
    ...(site.services.onSiteInstallation ? [{ icon: Wrench, title: "Instalação no local", text: "Troca feita por quem entende, onde você estiver." }] : []),
  ];

  return (
    <section aria-labelledby="dif-title" className="relative py-24 md:py-32">
      <div className="container-fly">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Bloco manifesto */}
          <div data-reveal className="relative isolate overflow-hidden rounded-[32px] bg-royal p-8 sm:p-12 lg:col-span-7 lg:row-span-2 lg:min-h-[560px]">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <div className="absolute -right-24 -top-24 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.25),transparent)]" />
              <svg className="absolute -bottom-10 -right-10 w-[75%] text-abyss/40" viewBox="0 0 72 100" fill="currentColor">
                <path d="M58 0 10 58h28L22 100l50-64H44Z" />
              </svg>
              <div className="absolute -bottom-10 right-[30%] h-[60%] w-[3px] -skew-x-[22deg] bg-volt/80 max-lg:hidden" />
              <div className="noise" />
            </div>
            <p className="eyebrow text-volt">Por que a FlyBaterias</p>
            <h2 id="dif-title" className="display mt-5 max-w-xl text-[clamp(2.2rem,4.4vw,3.7rem)]">
              Mais do que vender baterias. <span className="text-volt">A gente entrega confiança.</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-white/85">
              Bateria não é tudo igual. Conte com quem entende para escolher a energia certa e seguir viagem com tranquilidade.
            </p>
            <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-abyss/40 py-2 pl-2 pr-5 text-sm backdrop-blur">
              <span className="grid size-9 place-items-center rounded-full bg-volt text-ink">
                <MapPin className="size-4" />
              </span>
              Atendimento em {site.region.label}
            </div>
          </div>

          {/* Itens em hierarquias diferentes */}
          {items.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              data-reveal
              style={{ ["--delay" as string]: `${i * 90}ms` }}
              className={`group relative overflow-hidden rounded-[28px] border border-white/8 p-7 transition-colors duration-500 hover:border-volt/40 ${
                i === 0 ? "bg-ink lg:col-span-5" : i === 1 ? "bg-white/[0.03] lg:col-span-5" : (items.length - 2) % 3 === 0 ? "bg-white/[0.03] lg:col-span-4" : "bg-white/[0.03] lg:col-span-6"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-volt/10 text-volt transition-colors duration-500 group-hover:bg-volt group-hover:text-ink">
                  <Icon className="size-6" />
                </span>
                <span className="display text-[2.2rem] text-white/10">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 text-[1.2rem] font-bold [font-stretch:108%]">{title}</h3>
              <p className="mt-2 text-[0.95rem] text-steel">{text}</p>
              <Bolt className="absolute -bottom-6 -right-4 size-24 text-white/[0.03] transition-transform duration-700 group-hover:-translate-y-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
