import { site } from "@/config/site";

/**
 * Perguntas frequentes. As respostas que dependem da operação
 * (pagamento, entrega, garantia) são montadas a partir de `site.ts`,
 * para nunca afirmarem algo que a empresa não confirmou.
 */
export type FaqItem = { q: string; a: string };

const list = (items: readonly string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;

export function getFaq(): FaqItem[] {
  const s = site.services;
  const serviceList = [s.delivery && "entrega", s.onSiteInstallation && "instalação no local"].filter(Boolean) as string[];

  return [
    {
      q: "Como saber qual bateria meu carro utiliza?",
      a: "A especificação correta é definida pela montadora e aparece no manual do veículo ou na etiqueta da bateria atual (amperagem em Ah, tecnologia e posição dos polos). Se preferir, use o seletor do site ou envie marca, modelo, ano e motorização pelo WhatsApp — nossa equipe confirma a aplicação correta para você.",
    },
    {
      q: "Como identificar se minha bateria precisa ser trocada?",
      a: "Sinais comuns: partida mais lenta ou “arrastada”, luzes do painel fracas ao ligar o carro, luz da bateria acesa, falhas no sistema Start-Stop, necessidade frequente de “chupeta” e bateria com mais de 2 a 3 anos de uso. Esses sinais também podem indicar problemas no alternador ou no sistema elétrico, por isso o ideal é fazer uma avaliação.",
    },
    {
      q: "Qual a diferença entre uma bateria AGM e EFB?",
      a: "As duas foram criadas para veículos com Start-Stop. A EFB é uma bateria de eletrólito líquido reforçada, com maior resistência a ciclos de partida. A AGM tem o eletrólito absorvido em uma manta de fibra de vidro e suporta descargas mais profundas e maior demanda elétrica. Use sempre a tecnologia especificada pelo fabricante do seu veículo.",
    },
    {
      q: "Vocês atendem na minha região?",
      a:
        site.region.confirmedAreas.length > 0
          ? `Atendemos ${site.region.label}, incluindo ${list(site.region.confirmedAreas)}. Informe seu bairro ou CEP pelo WhatsApp para confirmarmos as opções de atendimento no seu endereço.`
          : `Atendemos ${site.region.label}. Informe seu bairro ou CEP pelo WhatsApp e nossa equipe orienta você sobre as opções de atendimento disponíveis no seu endereço.`,
    },
    {
      q: "Como consultar o valor de uma bateria?",
      a: "Os valores variam conforme o modelo do veículo, a tecnologia e a marca da bateria. Envie os dados do seu carro pelo WhatsApp (ou use o seletor do site) e receba as opções disponíveis com os respectivos valores.",
    },
    {
      q: "Como funciona a garantia?",
      a:
        site.warrantyNote ??
        "As baterias contam com garantia conforme as condições do fabricante. O prazo e as regras variam de acordo com a marca e o modelo — nossa equipe informa as condições de cada opção antes da compra.",
    },
    {
      q: "Quais formas de pagamento estão disponíveis?",
      a:
        site.paymentMethods.length > 0
          ? `Aceitamos ${list(site.paymentMethods)}. Confirme as condições no atendimento pelo WhatsApp.`
          : "As formas de pagamento disponíveis são informadas no atendimento pelo WhatsApp, junto com o orçamento da sua bateria.",
    },
    {
      q: "Vocês realizam entrega e instalação?",
      a:
        serviceList.length > 0
          ? `Sim, oferecemos ${list(serviceList)} conforme a região e a disponibilidade. Consulte pelo WhatsApp as condições para o seu endereço.`
          : "Fale com a nossa equipe pelo WhatsApp e informe sua localização: vamos orientar você sobre as opções de atendimento disponíveis para o seu caso.",
    },
  ];
}
