/**
 * ============================================================
 *  CAMPANHAS PROMOCIONAIS TEMPORÁRIAS
 * ============================================================
 *  Edite as campanhas em `campaigns.json`.
 *
 *  Como funciona:
 *   - O build gera o site ORIGINAL e uma versão para cada campanha que
 *     ainda não terminou (variável NEXT_PUBLIC_CAMPAIGN=<id>).
 *   - O Worker do Cloudflare escolhe, a cada visita, qual versão servir
 *     usando o relógio do servidor. Ao fim do prazo, o site volta sozinho
 *     à identidade original — sem novo deploy.
 *   - Para criar Natal, Ano Novo, Carnaval…: adicione um item no JSON.
 * ============================================================
 */
import data from "./campaigns.json";

export type Campaign = {
  id: string;
  enabled: boolean;
  name: string;
  theme: "black" | "default";
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  timeZone: string;
  texts: {
    bar: string;
    barShort: string;
    eyebrow: string;
    headline: string;
    subheadline: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    urgency: string;
    terms: string;
    finalTitle: string;
    finalLead: string;
    finalCta: string;
    productCta: string;
    badge: string;
    productNote: string;
    seoTitle: string;
    seoDescription: string;
  };
  whatsappMessage: string;
  rules: { promoBar: boolean; countdown: boolean; replaceHero: boolean; productBadges: boolean; ogImage?: string };
};

export const campaigns = data.campaigns as Campaign[];

/** Campanha desta versão do build (null = site original). */
export const activeCampaign: Campaign | null =
  campaigns.find((c) => c.enabled && c.id === process.env.NEXT_PUBLIC_CAMPAIGN) ?? null;

/** Preço promocional calculado a partir de um preço REAL cadastrado. */
export function promoPrice(price: number, c: Campaign | null = activeCampaign) {
  if (!c) return price;
  return Math.round(price * (100 - c.discountPercent)) / 100;
}
