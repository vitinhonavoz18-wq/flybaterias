import { site } from "@/config/site";
import { activeCampaign } from "@/config/campaigns";

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const phoneUrl = () => `tel:${site.contact.phone}`;

/** Durante uma campanha, os botões gerais usam a mensagem da campanha. */
const campaignMsg = activeCampaign?.whatsappMessage;

export const messages = {
  default: campaignMsg ?? "Olá! Vim pelo site da FlyBaterias e gostaria de atendimento.",
  specialist: campaignMsg ?? "Olá! Vim pelo site da FlyBaterias e gostaria de falar com um especialista sobre baterias.",
  quote: campaignMsg ?? "Olá! Vim pelo site da FlyBaterias e gostaria de solicitar um orçamento de bateria.",
  urgent: campaignMsg ?? "Olá! Vim pelo site da FlyBaterias e preciso de uma bateria agora.",
  campaign: campaignMsg ?? "Olá! Vim pelo site da FlyBaterias e gostaria de atendimento.",
  category: (name: string) =>
    activeCampaign
      ? `${activeCampaign.whatsappMessage}\n\nTenho interesse em: ${name.toLowerCase()}.`
      : `Olá! Vim pelo site da FlyBaterias e gostaria de consultar a disponibilidade e os valores de ${name.toLowerCase()}.`,
  product: (brand: string, model: string) =>
    activeCampaign
      ? `${activeCampaign.whatsappMessage}\n\nTenho interesse na bateria ${brand} ${model}.`
      : `Olá! Vim pelo site da FlyBaterias e gostaria de consultar o valor da bateria ${brand} ${model}.`,
  tech: (tech: string) =>
    `Olá! Vim pelo site da FlyBaterias e gostaria de saber se meu veículo usa bateria ${tech}.`,
  region: (place: string) =>
    `Olá! Vim pelo site da FlyBaterias e gostaria de saber como funciona o atendimento na minha região.\n\nBairro/CEP: ${place}`,
};

export type VehicleQuery = {
  make: string;
  model: string;
  year: string;
  engine: string;
  startStop: string;
  district: string;
};

/** Mensagem do seletor inteligente (formato definido pela FlyBaterias). */
export function vehicleMessage(v: VehicleQuery) {
  const lines = [
    activeCampaign?.whatsappMessage ?? "Olá! Vim pelo site da FlyBaterias e gostaria de consultar uma bateria para meu veículo.",
    "",
    `Marca: ${v.make || "-"}`,
    `Modelo: ${v.model || "-"}`,
    `Ano: ${v.year || "-"}`,
    `Motorização: ${v.engine || "-"}`,
  ];
  if (v.startStop) lines.push(`Start-Stop: ${v.startStop}`);
  lines.push(`Bairro: ${v.district || "-"}`, "", "Gostaria de saber as opções disponíveis e os valores.");
  return lines.join("\n");
}
