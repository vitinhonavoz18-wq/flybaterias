import { whatsappUrl, messages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

const steps = [
  { n: "01", title: "Fale com a gente", text: "Entre em contato pelo WhatsApp." },
  { n: "02", title: "Informe seu veículo", text: "Envie modelo, ano e demais informações necessárias." },
  { n: "03", title: "Encontre a bateria certa", text: "Receba orientação sobre as opções disponíveis." },
  { n: "04", title: "Combine seu atendimento", text: "Nossa equipe orienta você sobre a compra e os próximos passos." },
];

export default function Journey() {
  return (
    <section aria-labelledby="jor-title" className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]" />
      <div className="container-fly relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-reveal className="eyebrow text-volt">Como funciona</p>
            <h2 id="jor-title" data-reveal style={{ ["--delay" as string]: "80ms" }} className="display mt-4 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)]">
              A bateria certa para o seu carro está a uma conversa de distância.
            </h2>
          </div>
          <a data-reveal href={whatsappUrl(messages.default)} target="_blank" rel="noopener" data-track="whatsapp_click" data-track-location="journey" className="btn btn-volt shrink-0 self-start md:self-auto">
            <WhatsAppIcon className="size-5" /> Começar agora
          </a>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* linha de energia conectando as etapas (cresce com a rolagem) */}
          <div aria-hidden="true" className="absolute bottom-0 left-[21px] top-0 w-0.5 bg-white/10 md:bottom-auto md:left-0 md:right-0 md:top-[21px] md:h-0.5 md:w-auto">
            <div className="scroll-grow-y size-full bg-gradient-to-b from-volt to-volt/40 md:hidden" />
            <div className="scroll-grow-x size-full bg-gradient-to-r from-volt via-volt to-volt/30 max-md:hidden" />
          </div>
          {steps.map((s, i) => (
            <li key={s.n} data-reveal style={{ ["--delay" as string]: `${i * 140}ms` }} className="relative pl-16 md:pl-0 md:pt-16">
              <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-volt/50 bg-ink text-[0.85rem] font-bold text-volt shadow-[0_0_0_6px_var(--color-ink)]">
                {s.n}
              </span>
              <h3 className="text-[1.25rem] font-bold [font-stretch:110%]">{s.title}</h3>
              <p className="mt-2 text-steel">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
