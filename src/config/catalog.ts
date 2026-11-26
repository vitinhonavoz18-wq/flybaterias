/**
 * ============================================================
 *  CATÁLOGO — categorias, marcas e produtos
 * ============================================================
 *  - Categorias com `enabled: false` não aparecem no site.
 *  - Marcas só aparecem se `enabled: true` (marcas efetivamente vendidas).
 *  - Produtos: cadastre itens reais em `products`. Enquanto a lista
 *    estiver vazia, a vitrine apresenta as LINHAS (categorias) com o
 *    botão "Consultar disponibilidade".
 *  - Nunca cadastre preço/estoque que não seja real. Sem preço → "Consultar valor".
 * ============================================================
 */

export type TechId = "convencional" | "efb" | "agm";

export type Category = {
  id: string;
  name: string;
  short: string;
  /** Texto curto e factual sobre a aplicação da linha. */
  description: string;
  /** Faixa típica de capacidade do segmento (informação educativa, não é estoque). */
  typicalRange: string;
  use: string;
  image: string; // caminho em /public (sem extensão — usamos .avif e .webp)
  enabled: boolean;
};

export const categories: Category[] = [
  {
    id: "automotivas",
    name: "Baterias automotivas",
    short: "Carros",
    description: "Para carros de passeio: hatches, sedãs e SUVs, com ou sem sistema Start-Stop.",
    typicalRange: "Faixa comum: 40Ah a 80Ah",
    use: "Uso urbano e rodoviário",
    image: "/renders/battery-car",
    enabled: true,
  },
  {
    id: "efb",
    name: "Baterias EFB",
    short: "EFB",
    description: "Tecnologia reforçada, indicada para muitos veículos com Start-Stop de entrada.",
    typicalRange: "Mais resistência a ciclos de partida",
    use: "Veículos com Start-Stop",
    image: "/renders/battery-efb",
    enabled: true,
  },
  {
    id: "agm",
    name: "Baterias AGM",
    short: "AGM",
    description: "Para veículos com alta demanda elétrica e Start-Stop avançado, quando especificado pela montadora.",
    typicalRange: "Alta resistência a descargas profundas",
    use: "Start-Stop avançado e frenagem regenerativa",
    image: "/renders/battery-agm",
    enabled: true,
  },
  {
    id: "utilitarios",
    name: "Baterias para utilitários",
    short: "Utilitários",
    description: "Para picapes, vans e veículos de trabalho que exigem mais capacidade.",
    typicalRange: "Faixa comum: 70Ah a 150Ah",
    use: "Picapes, vans e diesel",
    image: "/renders/battery-heavy",
    enabled: true,
  },
  {
    id: "motos",
    name: "Baterias para motocicletas",
    short: "Motos",
    description: "Baterias compactas para motos de baixa e alta cilindrada.",
    typicalRange: "Faixa comum: 4Ah a 14Ah",
    use: "Motos e scooters",
    image: "/renders/battery-moto",
    enabled: false, // PENDENTE: confirmar se a FlyBaterias vende baterias de moto
  },
];

export type Brand = { name: string; logo?: string; enabled: boolean };

/**
 * Marcas comercializadas. Coloque o arquivo oficial da logomarca em
 * /public/brands/ e informe em `logo` (SVG de preferência). Sem logo,
 * o site exibe o nome em tipografia.
 * Não utilize selos de "revendedor autorizado" sem comprovação.
 */
export const brands: Brand[] = [
  { name: "Moura", enabled: true }, // citado no material da empresa (Instagram) — confirmar
  { name: "Heliar", enabled: false },
  { name: "Zetta", enabled: false },
  { name: "Bosch", enabled: false },
  { name: "ACDelco", enabled: false },
  { name: "Pioneiro", enabled: false },
];

export type Product = {
  slug: string;
  brand: string;
  model: string;
  categoryId: string;
  amperage: string; // ex.: "60Ah"
  technology: "Convencional" | "EFB" | "AGM";
  warranty?: string; // só preencha se confirmado
  price?: number; // só preencha se confirmado
  available?: boolean; // só quando houver integração com estoque
  image?: string;
};

/** PENDENTE: cadastrar produtos reais (com fotos autorizadas). */
export const products: Product[] = [];

export const enabledCategories = () => categories.filter((c) => c.enabled);
export const enabledBrands = () => brands.filter((b) => b.enabled);
