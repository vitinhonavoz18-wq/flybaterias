import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="container-fly grid min-h-[70vh] place-items-center pt-[var(--header-h)] text-center">
        <div>
          <p className="eyebrow text-volt">Erro 404</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Essa página ficou sem energia.</h1>
          <Link href="/" className="btn btn-volt mt-8">
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
