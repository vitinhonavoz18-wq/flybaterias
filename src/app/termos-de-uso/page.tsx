import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Condições de uso do site da FlyBaterias.",
  alternates: { canonical: "/termos-de-uso/" },
};

// ⚠️ Modelo inicial — recomenda-se revisão jurídica antes da publicação oficial.
export default function Page() {
  return (
    <LegalPage title="Termos de uso" updated="novembro de 2026">
      <p>Ao utilizar este site, você concorda com as condições abaixo.</p>
      <h2>1. Finalidade do site</h2>
      <p>
        O site da {site.name} apresenta informações sobre baterias automotivas e facilita o contato com a nossa equipe. Ele não realiza vendas
        diretamente: orçamentos, valores, disponibilidade e condições são informados no atendimento.
      </p>
      <h2>2. Informações técnicas</h2>
      <p>
        Os conteúdos sobre tecnologias de bateria têm caráter educativo. A bateria adequada para cada veículo deve seguir a especificação do
        fabricante e é confirmada pela nossa equipe antes da compra.
      </p>
      <h2>3. Imagens</h2>
      <p>As imagens de baterias exibidas no site são ilustrativas e podem não corresponder exatamente ao produto fornecido.</p>
      <h2>4. Garantia</h2>
      <p>A garantia dos produtos segue as condições de cada fabricante, informadas no momento do atendimento.</p>
      <h2>5. Propriedade intelectual</h2>
      <p>A marca, a identidade visual e os conteúdos deste site pertencem à {site.name}. Marcas de terceiros pertencem aos seus respectivos titulares.</p>
      <h2>6. Contato</h2>
      <p>Dúvidas sobre estes termos podem ser enviadas pelos nossos canais de atendimento.</p>
    </LegalPage>
  );
}
