"use client";

import { tracking } from "@/config/tracking";
import { activeCampaign } from "@/config/campaigns";

/**
 * Camada de eventos (dataLayer) para GTM / GA4 / Google Ads / Meta Pixel.
 *
 * Todos os eventos de clique são "intenção de contato" (lead_stage: "intent").
 * Venda efetivada NÃO acontece no site — ela deve ser registrada depois,
 * por importação de conversões offline (Google Ads) ou CRM.
 *
 * Regras de privacidade: nunca envie nome, telefone, e-mail, bairro ou CEP
 * do visitante nos eventos.
 */
export type TrackEvent =
  | "whatsapp_click"
  | "phone_click"
  | "product_inquiry"
  | "selector_start"
  | "selector_step"
  | "selector_complete"
  | "quote_request"
  | "region_check"
  | "battery_3d_interaction"
  | "faq_open"
  | "campaign_view"
  | "campaign_expired";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const lastFired = new Map<string, number>();
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"];

/** Guarda os parâmetros de campanha da primeira página visitada na sessão. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const qs = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = qs.get(k);
      if (v) found[k] = v.slice(0, 120);
    });
    if (Object.keys(found).length && !sessionStorage.getItem(tracking.utmStorageKey)) {
      sessionStorage.setItem(tracking.utmStorageKey, JSON.stringify(found));
    }
  } catch {
    /* navegação privada: segue sem UTM */
  }
}

export function getUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(tracking.utmStorageKey) || "{}");
  } catch {
    return {};
  }
}

export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const key = event + JSON.stringify(params);
  const now = Date.now();
  if (now - (lastFired.get(key) || 0) < tracking.dedupeWindowMs) return; // evita duplicidade
  lastFired.set(key, now);

  const utm = getUtm();
  const payload = {
    event,
    lead_stage: event === "whatsapp_click" || event === "phone_click" || event === "quote_request" ? "intent" : "engagement",
    page_path: window.location.pathname,
    campaign_source: utm.utm_source,
    campaign_medium: utm.utm_medium,
    campaign_name: utm.utm_campaign,
    // Campanha promocional ativa nesta versão do site (ex.: black-friday-2026)
    promo_campaign: activeCampaign?.id,
    promo_discount: activeCampaign?.discountPercent,
    ...params,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (process.env.NODE_ENV !== "production") console.debug("[track]", payload);
}
