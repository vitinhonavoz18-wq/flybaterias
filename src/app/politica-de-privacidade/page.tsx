import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a FlyBaterias trata dados pessoais e cookies, conforme a LGPD.",
  alternates: { canonical: "/politica-de-privacidade/" },
};

// ⚠️ Modelo inicial — recomenda-se revisão jurídica antes da publicação oficial.
export default function Page() {
  return (
    <LegalPage title="Política de privacidade" updated="novembro de 2026">
      <p>
        Esta política explica como a {site.legalName}
        {site.cnpj ? ` (CNPJ ${site.cnpj})` : ""} (“FlyBaterias”) trata dados pessoais de quem visita este site, em conformidade com a Lei
        Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
      </p>
      <h2>1. Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Dados que você envia pelo WhatsApp:</strong> ao usar o seletor de baterias ou os botões de contato, o site apenas monta uma
          mensagem (marca, modelo, ano, motorização e bairro do veículo). Esses dados só chegam até nós quando você decide enviá-la pelo WhatsApp.
          O site não armazena essas informações.
        </li>
        <li>
          <strong>Dados de navegação (somente com consentimento):</strong> páginas visitadas, cliques em botões, origem da visita (ex.: anúncio) e
          informações técnicas do dispositivo, coletados por ferramentas como Google Analytics, Google Ads e Meta Pixel.
        </li>
      </ul>
      <h2>2. Para que usamos</h2>
      <ul>
        <li>Responder suas solicitações e enviar orçamentos;</li>
        <li>Entender como o site é utilizado e melhorar a experiência;</li>
        <li>Medir o resultado de campanhas de publicidade.</li>
      </ul>
      <h2>3. Cookies e consentimento</h2>
      <p>
        Cookies de medição e de marketing só são ativados após a sua autorização no aviso de cookies. Você pode alterar sua escolha a qualquer
        momento em “Preferências de cookies”, no rodapé do site. Não enviamos às plataformas de publicidade dados que identifiquem você diretamente
        (como nome, telefone ou endereço).
      </p>
      <h2>4. Compartilhamento</h2>
      <p>
        Os dados podem ser tratados por fornecedores que nos ajudam a operar o site e a comunicação, como Meta (WhatsApp) e Google, sempre de
        acordo com as respectivas políticas de privacidade. Não vendemos dados pessoais.
      </p>
      <h2>5. Seus direitos</h2>
      <p>
        Você pode solicitar a confirmação de tratamento, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, além de revogar
        o consentimento, entrando em contato pelos nossos canais de atendimento{site.contact.email ? ` ou pelo e-mail ${site.contact.email}` : ""}.
      </p>
      <h2>6. Segurança e retenção</h2>
      <p>Adotamos medidas razoáveis de segurança e mantemos os dados apenas pelo tempo necessário para as finalidades descritas ou exigido por lei.</p>
      <h2>7. Atualizações</h2>
      <p>Esta política pode ser atualizada. A versão vigente estará sempre disponível nesta página.</p>
    </LegalPage>
  );
}
