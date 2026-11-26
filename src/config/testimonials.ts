/**
 * PROVA SOCIAL — somente avaliações REAIS e AUTORIZADAS.
 * Enquanto a lista estiver vazia, a seção não aparece no site.
 * É proibido inventar clientes, notas, números ou depoimentos.
 */
export type Testimonial = {
  name: string; // como o cliente autorizou ser identificado (ex.: "Carlos S.")
  text: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  source: "Google" | "Instagram" | "WhatsApp (autorizado)";
  date?: string;
  photo?: string; // foto real do atendimento, com autorização
};

export const testimonials: Testimonial[] = [];

/** Resumo oficial do Google (preencha somente com dados reais do Perfil da Empresa). */
export const googleRating: null | { rating: number; count: number; url: string } = null;
