"use client";

import { tracking } from "@/config/tracking";

export type ConsentState = { analytics: boolean; marketing: boolean; ts: number };

export const CONSENT_EVENT = "fly:open-consent";

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(tracking.consentStorageKey);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

/** Salva a escolha e atualiza o Consent Mode v2 do Google. */
export function saveConsent(analytics: boolean, marketing: boolean) {
  const state: ConsentState = { analytics, marketing, ts: Date.now() };
  try {
    localStorage.setItem(tracking.consentStorageKey, JSON.stringify(state));
  } catch {
    /* sem armazenamento: a escolha vale só nesta visita */
  }
  ensureGtag();
  window.gtag!("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
  window.dataLayer?.push({ event: "consent_update", consent_analytics: analytics, consent_marketing: marketing });
  return state;
}

export const openConsent = () => window.dispatchEvent(new Event(CONSENT_EVENT));

/** O gtag precisa enviar o objeto "arguments" original para o GTM reconhecer o comando. */
function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}
