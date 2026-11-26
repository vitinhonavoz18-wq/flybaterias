import { ArrowRight } from "lucide-react";
import { activeCampaign } from "@/config/campaigns";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import Countdown from "./Countdown";

/** Barra promocional fina no topo (dentro do cabeçalho fixo). */
export default function PromoBar() {
  const c = activeCampaign;
  if (!c || !c.rules.promoBar) return null;
  return (
    <a
      href={whatsappUrl(messages.campaign)}
      target="_blank"
      rel="noopener"
      data-track="whatsapp_click"
      data-track-location="promo_bar"
      className="promo-bar group relative flex h-[var(--promo-h)] items-center justify-center overflow-hidden bg-volt px-4 text-ink"
    >
      <span aria-hidden="true" className="promo-bar-sheen" />
      <span className="relative flex min-w-0 items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[0.06em] [font-stretch:105%] sm:text-[0.8rem]">
        <span aria-hidden="true">⚡</span>
        <span className="truncate sm:hidden">{c.texts.barShort}</span>
        <span className="hidden truncate sm:inline">{c.texts.bar}</span>
        {c.rules.countdown && (
          <span className="hidden items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 text-[0.72rem] font-bold normal-case tracking-normal text-volt lg:inline-flex">
            Termina em <Countdown endsAt={c.endsAt} variant="bar" />
          </span>
        )}
        <span className="ml-1 inline-flex shrink-0 items-center gap-1 underline-offset-2 group-hover:underline">
          <span className="hidden md:inline">Garantir desconto</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  );
}
