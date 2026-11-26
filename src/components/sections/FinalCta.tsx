import { CarSilhouette } from "./CarSilhouette";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";
import { activeCampaign } from "@/config/campaigns";

export default function FinalCta() {
  const c = activeCampaign;
  return (
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden pb-[clamp(220px,32vw,420px)] pt-28 md:pt-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,#0047bb_0%,rgba(6,20,47,0)_70%)]" />
        <div className="absolute inset-x-0 bottom-[7%] h-px bg-gradient-to-r from-transparent via-volt/70 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-[140%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgba(255,208,0,0.12)_180deg,transparent_200deg)]" />
        <CarSilhouette className="scroll-parallax absolute bottom-[2%] left-1/2 w-[min(1100px,135%)] -translate-x-1/2 opacity-70 [--parallax-from:50px] [--parallax-to:0px]" />
        <div className="noise" />
      </div>

      <div className="container-fly relative text-center">
        <picture>
          <source srcSet="/renders/battery-agm.avif" type="image/avif" />
          { }
          <img src="/renders/battery-agm.webp" alt="" loading="lazy" width={706} height={541} className="mx-auto mb-8 w-40 drop-shadow-[0_20px_40px_rgba(255,208,0,0.25)] sm:w-52" />
        </picture>
        <h2 id="final-title" data-reveal className="display mx-auto max-w-4xl text-[clamp(2.6rem,7vw,5.8rem)]">
          {c ? (
            <>
              {c.texts.finalTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-volt">{c.texts.finalTitle.split(" ").slice(-2).join(" ")}</span>
            </>
          ) : (
            <>
              Seu próximo destino <span className="text-volt">começa aqui.</span>
            </>
          )}
        </h2>
        <p data-reveal style={{ ["--delay" as string]: "120ms" }} className="lead mx-auto mt-6 max-w-xl">
          {c ? c.texts.finalLead : "Encontre a bateria ideal para seu veículo e conte com o atendimento da FlyBaterias em Salvador e região."}
        </p>
        <div data-reveal style={{ ["--delay" as string]: "220ms" }} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl(messages.quote)}
            target="_blank"
            rel="noopener"
            data-track="quote_request"
            data-track-location="final_cta"
            data-magnetic
            className="btn btn-volt w-full !min-h-[60px] !px-8 !text-[1.05rem] sm:w-auto"
          >
            <WhatsAppIcon className="size-5" /> {c ? c.texts.finalCta : "Solicitar meu orçamento agora"}
          </a>
          <a href="#seletor" className="btn btn-ghost w-full sm:w-auto">
            Descobrir a bateria ideal
          </a>
        </div>
      </div>
    </section>
  );
}
