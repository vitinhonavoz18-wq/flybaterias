import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactBar from "@/components/layout/ContactBar";
import Hero from "@/components/sections/Hero";
import CampaignHero from "@/components/campaign/CampaignHero";
import { activeCampaign } from "@/config/campaigns";
import BrandMarquee from "@/components/sections/BrandMarquee";
import SelectorSection from "@/components/sections/SelectorSection";
import Battery3DSection from "@/components/sections/Battery3DSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import BatteryTech from "@/components/sections/BatteryTech";
import Differentials from "@/components/sections/Differentials";
import Coverage from "@/components/sections/Coverage";
import Journey from "@/components/sections/Journey";
import SocialProof from "@/components/sections/SocialProof";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import JsonLd from "@/components/seo/JsonLd";

const delay = (ms: number) => ({ ["--delay" as string]: `${ms}ms` });

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main id="conteudo">
        {activeCampaign?.rules.replaceHero ? <CampaignHero campaign={activeCampaign} /> : <Hero />}
        <BrandMarquee />
        <SelectorSection />

        <section id="baterias" aria-labelledby="vit-title" className="relative py-24 md:py-32">
          <div className="container-fly">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p data-reveal className="eyebrow text-volt">Linhas de baterias</p>
                <h2 id="vit-title" data-reveal style={delay(80)} className="display mt-4 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)]">
                  Energia certa para cada tipo de veículo.
                </h2>
              </div>
              <p data-reveal style={delay(160)} className="lead max-w-sm">
                Do hatch ao utilitário: escolha a linha e consulte as opções disponíveis com quem entende.
              </p>
            </div>
            <div data-reveal style={delay(120)}>
              <ProductShowcase />
            </div>
          </div>
        </section>

        <Battery3DSection />

        <section id="tecnologias" aria-labelledby="tec-title" className="relative bg-ink py-24 md:py-32">
          <div className="container-fly">
            <p data-reveal className="eyebrow text-volt">Tecnologias</p>
            <h2 id="tec-title" data-reveal style={delay(80)} className="display mb-14 mt-4 max-w-3xl text-[clamp(2.1rem,4.6vw,3.6rem)]">
              Cada veículo exige a energia certa.
            </h2>
            <div data-reveal style={delay(140)}>
              <BatteryTech />
            </div>
          </div>
        </section>

        <Differentials />
        <Journey />
        <Coverage />
        <SocialProof />

        <section id="duvidas" aria-labelledby="faq-title" className="py-24 md:py-32">
          <div className="container-fly grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p data-reveal className="eyebrow text-volt">Dúvidas frequentes</p>
              <h2 id="faq-title" data-reveal style={delay(80)} className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]">
                Perguntas que todo motorista faz.
              </h2>
              <p data-reveal style={delay(160)} className="lead mt-5 max-w-sm">
                Não encontrou sua resposta? Fale com a nossa equipe pelo WhatsApp.
              </p>
            </div>
            <div data-reveal style={delay(120)}>
              <Faq />
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
      <ContactBar />
    </>
  );
}
