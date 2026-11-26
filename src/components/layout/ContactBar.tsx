import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl, phoneUrl, messages } from "@/lib/whatsapp";
import { activeCampaign } from "@/config/campaigns";

/** Barra fixa no celular (WhatsApp | Ligar agora) e botão flutuante no desktop. */
export default function ContactBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-abyss/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <a href={whatsappUrl(messages.urgent)} target="_blank" rel="noopener" data-track="whatsapp_click" data-track-location="mobile_bar" className="btn btn-whatsapp !min-h-[52px] !px-3">
            <WhatsAppIcon className="size-5" /> {activeCampaign ? `Pedir ${activeCampaign.discountPercent}% OFF` : "WhatsApp"}
          </a>
          <a href={phoneUrl()} data-track="phone_click" data-track-location="mobile_bar" className="btn btn-ghost !min-h-[52px] !px-4">
            <Phone className="size-[18px]" /> Ligar agora
          </a>
        </div>
      </div>

      <a
        href={whatsappUrl(messages.default)}
        target="_blank"
        rel="noopener"
        data-track="whatsapp_click"
        data-track-location="floating"
        aria-label="Falar com a FlyBaterias no WhatsApp"
        className="group fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-0 overflow-hidden rounded-full bg-whatsapp pl-4 pr-4 text-[#04210f] shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] transition-[gap,padding] duration-500 ease-[var(--ease-out-expo)] hover:gap-3 hover:pr-6 md:inline-flex"
      >
        <WhatsAppIcon className="size-6 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold transition-[max-width] duration-500 ease-[var(--ease-out-expo)] group-hover:max-w-[220px]">{activeCampaign ? `Garantir ${activeCampaign.discountPercent}% OFF` : "Preciso de uma bateria"}</span>
      </a>
    </>
  );
}
