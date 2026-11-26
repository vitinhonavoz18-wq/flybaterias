import { site } from "@/config/site";

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const phoneUrl = () => `tel:${site.contact.phone}`;

export const messages = {
  default: "Olá! Vim pelo site da FlyBaterias e gostaria de atendimento.",
  specialist: "Olá! Vim pelo site da FlyBaterias e gostaria de falar com um especialista sobre baterias.",
  quote: "Olá! Vim pelo site da FlyBaterias e gostaria de solicitar um orçamento de bateria.",
  urgent: "Olá! Vim pelo site da FlyBaterias e preciso de uma bateria agora.",
  category: (name: string) =>
    `Olá! Vim pelo site da FlyBaterias e gostaria de consultar a disponibilidade e os valores de ${name.toLowerCase()}.`,
  product: (brand: string, model: string) =>
    `Olá! Vim pelo site da FlyBaterias e gostaria de consultar o valor da bateria ${brand} ${model}.`,
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
    "Olá! Vim pelo site da FlyBaterias e gostaria de consultar uma bateria para meu veículo.",
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
