/**
 * ============================================================
 *  CONFIGURAÇÃO CENTRAL DA FLYBATERIAS
 * ============================================================
 *  Todos os dados comerciais do site ficam AQUI.
 *  Para trocar telefone, WhatsApp, horários, serviços ou redes
 *  sociais, edite somente este arquivo — o site inteiro se atualiza.
 *
 *  ⚠️  Itens marcados com "PENDENTE" precisam ser confirmados pela
 *      empresa antes da publicação oficial. Nada aqui deve ser
 *      inventado: se uma informação não for confirmada, deixe como
 *      `null` / `false` e o site simplesmente não a exibe.
 * ============================================================
 */

export const site = {
  name: "FlyBaterias",
  legalName: "FlyBaterias", // PENDENTE: razão social para Política de Privacidade
  cnpj: null as string | null, // PENDENTE
  slogan: "Energia que acompanha você.",
  description:
    "Baterias automotivas em Salvador e região. Atendimento especializado pelo WhatsApp para encontrar a bateria certa para o seu veículo.",

  /** Endereço oficial do site. Defina NEXT_PUBLIC_SITE_URL no ambiente de produção. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.flybaterias.com.br").replace(/\/$/, ""),

  contact: {
    /**
     * PENDENTE: número real do WhatsApp, somente dígitos, com DDI + DDD.
     * O número abaixo é o MESMO placeholder do mockup do Instagram.
     */
    whatsapp: "5571999999999",
    /** PENDENTE: telefone para o botão "Ligar agora" (formato internacional). */
    phone: "+5571999999999",
    phoneDisplay: "(71) 99999-9999",
    /** Enquanto `true`, o site avisa no console que os contatos são provisórios. */
    isPlaceholder: true as boolean,
    email: null as string | null, // PENDENTE
  },

  /** Endereço físico. Deixe `null` se a empresa não atende em loja. */
  address: null as null | {
    street: string;
    district: string;
    city: string;
    state: string;
    postalCode: string;
    lat?: number;
    lng?: number;
  },

  region: {
    city: "Salvador",
    state: "BA",
    label: "Salvador e região",
    /**
     * PENDENTE: bairros/municípios com atendimento CONFIRMADO.
     * Enquanto vazio, o site não lista locais — apenas convida o
     * cliente a consultar pelo WhatsApp.
     */
    confirmedAreas: [] as string[],
  },

  /**
   * PENDENTE: horários reais. Exemplo de preenchimento:
   * [{ days: "Segunda a sexta", hours: "8h às 18h" }, { days: "Sábado", hours: "8h às 12h" }]
   */
  hours: [] as { days: string; hours: string }[],

  /**
   * Serviços. Ficam DESATIVADOS até a empresa confirmar.
   * Quando `true`, aparecem automaticamente em diferenciais, FAQ e SEO.
   */
  services: {
    delivery: false as boolean, // PENDENTE: "Entrega" (citado no mockup do Instagram)
    onSiteInstallation: false as boolean, // PENDENTE: "Troca/instalação no local"
    batteryTest: false as boolean, // PENDENTE: "Teste gratuito de bateria"
  },

  /** PENDENTE: formas de pagamento confirmadas (ex.: ["Pix", "Cartão de crédito", "Dinheiro"]). */
  paymentMethods: [] as string[],

  /** PENDENTE: política de garantia (texto curto). Enquanto null, usa "conforme o fabricante". */
  warrantyNote: null as string | null,

  social: {
    instagram: "https://www.instagram.com/flybaterias/", // PENDENTE: confirmar perfil
    facebook: null as string | null,
    googleBusiness: null as string | null, // link do Perfil da Empresa no Google
  },

  developer: {
    name: "Conectfly",
    url: "https://www.conectfly.com.br", // PENDENTE: confirmar site oficial da Conectfly
  },
} as const;

export type Site = typeof site;
