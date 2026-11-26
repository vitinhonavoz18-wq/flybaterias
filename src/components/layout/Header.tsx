"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { navLinks } from "@/config/nav";
import { whatsappUrl, messages } from "@/lib/whatsapp";
import { site } from "@/config/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-abyss/85 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-ink">
        Pular para o conteúdo
      </a>
      <div className="container-fly flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} — página inicial`} className="shrink-0">
          <Logo priority className="h-11 w-auto md:h-12" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 text-[0.92rem] font-medium text-white/75 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl(messages.default)}
            target="_blank"
            rel="noopener"
            data-track="whatsapp_click"
            data-track-location="header"
            data-magnetic
            className="btn btn-volt hidden !min-h-[44px] !px-5 text-[0.9rem] sm:inline-flex"
          >
            <WhatsAppIcon className="size-[18px]" />
            Pedir pelo WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-white/5 bg-abyss lg:hidden"
      >
        <nav aria-label="Menu mobile" className="container-fly flex h-full flex-col pb-28 pt-6">
          <ul className="flex flex-col">
            {navLinks.map((l, i) => (
              <li key={l.href} className="fade-up border-b border-white/5" style={{ ["--delay" as string]: `${i * 50}ms` }}>
                <a href={l.href} onClick={() => setOpen(false)} className="display flex items-center justify-between py-5 text-[1.9rem]">
                  {l.label}
                  <span className="text-base text-volt">→</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl(messages.default)}
            target="_blank"
            rel="noopener"
            data-track="whatsapp_click"
            data-track-location="mobile_menu"
            className="btn btn-volt mt-8 w-full"
          >
            <WhatsAppIcon className="size-5" /> Falar no WhatsApp
          </a>
          <p className="mt-6 text-sm text-steel">Atendimento em {site.region.label}.</p>
        </nav>
      </div>
    </header>
  );
}
