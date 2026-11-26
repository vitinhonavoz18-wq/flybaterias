"use client";

import { useEffect, useState } from "react";
import { tracking } from "@/config/tracking";
import { CONSENT_EVENT, readConsent, saveConsent } from "@/lib/consent";

/**
 * Banner de consentimento (LGPD + Google Consent Mode v2).
 * Só aparece quando há ferramentas de medição configuradas (GTM).
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!tracking.gtmId) return;
    const saved = readConsent();
    if (!saved) {
      const t = window.setTimeout(() => setOpen(true), 1200); // não compete com o carregamento inicial
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      const saved = readConsent();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_EVENT, onOpen);
  }, []);

  if (!open) return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setAnalytics(a);
    setMarketing(m);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cc-title" className="fade-up fixed inset-x-3 bottom-[88px] z-[60] mx-auto max-w-xl rounded-3xl border border-white/10 bg-ink/95 p-5 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:mx-0">
      <h2 id="cc-title" className="font-bold">Sua privacidade</h2>
      <p className="mt-2 text-[0.9rem] text-steel">
        Usamos cookies para medir a audiência e melhorar nossos anúncios, somente com a sua permissão. Saiba mais na{" "}
        <a href="/politica-de-privacidade/" className="text-white underline underline-offset-2">
          Política de privacidade
        </a>
        .
      </p>
      {custom && (
        <div className="mt-4 grid gap-3 text-[0.9rem]">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-3">
            <span>
              <strong className="block">Essenciais</strong>
              <span className="text-steel">Necessários para o site funcionar.</span>
            </span>
            <input type="checkbox" checked disabled className="size-5 accent-[#FFD000]" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-3">
            <span>
              <strong className="block">Medição</strong>
              <span className="text-steel">Google Analytics: estatísticas de uso.</span>
            </span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="size-5 accent-[#FFD000]" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-3">
            <span>
              <strong className="block">Marketing</strong>
              <span className="text-steel">Google Ads e Meta: anúncios e conversões.</span>
            </span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="size-5 accent-[#FFD000]" />
          </label>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {custom ? (
          <button type="button" onClick={() => decide(analytics, marketing)} className="btn btn-volt !min-h-[44px] flex-1">
            Salvar preferências
          </button>
        ) : (
          <>
            <button type="button" onClick={() => decide(true, true)} className="btn btn-volt !min-h-[44px] flex-1">
              Aceitar
            </button>
            <button type="button" onClick={() => decide(false, false)} className="btn btn-ghost !min-h-[44px] flex-1">
              Recusar
            </button>
            <button type="button" onClick={() => setCustom(true)} className="btn !min-h-[44px] px-3 text-sm text-white/70 underline-offset-4 hover:underline">
              Personalizar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
