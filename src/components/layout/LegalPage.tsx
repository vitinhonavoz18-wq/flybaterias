import Header from "./Header";
import Footer from "./Footer";
import ContactBar from "./ContactBar";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="conteudo" className="pt-[var(--header-h)]">
        <article className="container-fly max-w-3xl py-16 md:py-24">
          <p className="eyebrow text-volt">Documento</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.4rem)]">{title}</h1>
          <p className="mt-3 text-sm text-steel">Última atualização: {updated}</p>
          <div className="mt-10 space-y-5 leading-relaxed text-white/80 [&_h2]:mt-10 [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
      <Footer />
      <ContactBar />
    </>
  );
}
