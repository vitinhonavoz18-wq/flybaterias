/**
 * Configuração de rastreamento (Google Tag Manager / GA4 / Google Ads / Meta Pixel).
 *
 * Recomendação: carregue GA4, Google Ads e Meta Pixel DENTRO do Google Tag
 * Manager. Assim o site só precisa do ID do GTM e todas as tags respeitam o
 * Consent Mode v2 configurado aqui.
 */
export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  /** Tempo (ms) para ignorar o mesmo evento repetido — evita disparos duplicados. */
  dedupeWindowMs: 1200,
  consentStorageKey: "fly_consent_v1",
  utmStorageKey: "fly_utm_v1",
} as const;
