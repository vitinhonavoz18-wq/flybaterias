import { Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { navLinks } from "@/config/nav";
import { whatsappUrl, phoneUrl, messages } from "@/lib/whatsapp";
import CookiePrefsButton from "./CookiePrefsButton";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/8 bg-ink pb-28 pt-16 md:pb-10">
      <div className="container-fly">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-steel">
              {site.slogan} Baterias automotivas com atendimento especializado em {site.region.label}.
            </p>
            {site.social.instagram && (
              <a href={site.social.instagram} target="_blank" rel="noopener" className="mt-6 inline-flex size-11 items-center justify-center rounded-full border border-white/15 hover:border-volt hover:text-volt" aria-label="Instagram da FlyBaterias">
                <InstagramIcon className="size-5" />
              </a>
            )}
          </div>

          <nav aria-label="Rodapé">
            <h2 className="eyebrow text-white/50">Navegação</h2>
            <ul className="mt-5 grid gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/80 hover:text-volt">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-white/50">Contato</h2>
            <ul className="mt-5 grid gap-4 text-white/80">
              <li>
                <a href={whatsappUrl(messages.default)} target="_blank" rel="noopener" data-track="whatsapp_click" data-track-location="footer" className="inline-flex items-center gap-3 hover:text-volt">
                  <WhatsAppIcon className="size-5 text-whatsapp" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={phoneUrl()} data-track="phone_click" data-track-location="footer" className="inline-flex items-center gap-3 hover:text-volt">
                  <Phone className="size-5 text-volt" /> {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-volt" />
                {site.address ? `${site.address.street}, ${site.address.district} — ${site.address.city}/${site.address.state}` : `Atendimento em ${site.region.label}`}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-white/50">Horários</h2>
            {site.hours.length > 0 ? (
              <ul className="mt-5 grid gap-2 text-white/80">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-volt" />
                    <span>
                      {h.days}
                      <br />
                      <span className="text-steel">{h.hours}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 flex items-start gap-3 text-white/80">
                <Clock className="mt-0.5 size-5 shrink-0 text-volt" /> Consulte os horários de atendimento pelo WhatsApp.
              </p>
            )}
          </div>
        </div>

        <div className="hairline mt-14" />
        <div className="mt-6 flex flex-col gap-4 text-[0.82rem] text-steel md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. Todos os direitos reservados.
            {site.cnpj && <> CNPJ {site.cnpj}.</>}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a href="/politica-de-privacidade/" className="hover:text-white">
                Política de privacidade
              </a>
            </li>
            <li>
              <a href="/termos-de-uso/" className="hover:text-white">
                Termos de uso
              </a>
            </li>
            <li>
              <CookiePrefsButton />
            </li>
          </ul>
          <p>
            Desenvolvido pela{" "}
            <a href={site.developer.url} target="_blank" rel="noopener" className="font-semibold text-white/80 hover:text-volt">
              {site.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
