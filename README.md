# FlyBaterias — Site oficial

Site institucional e de vendas da **FlyBaterias** (baterias automotivas em Salvador e região).
Objetivo principal: transformar visitantes em conversas comerciais no **WhatsApp**.

## Tecnologias

| Item | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | Páginas geradas em HTML estático: rápido e barato de hospedar |
| Estilo | Tailwind CSS 4 | Design system centralizado em `src/app/globals.css` |
| 3D | Three.js puro (carregado sob demanda) | Sem frameworks extras; só baixa quando o visitante chega na seção 3D |
| Animações | CSS + IntersectionObserver + scroll-driven animations | Zero biblioteca extra; respeita "movimento reduzido" |
| Ícones | lucide-react | Leve, importação individual |
| Fonte | Archivo (variável: peso + largura), servida localmente | Sem dependência do Google Fonts |

## Como rodar

```bash
npm install
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # gera o site estático na pasta out/
npm run test:e2e     # testes automatizados (após o build)
npm run check        # typecheck + lint + build + testes
```

## Onde editar as informações da empresa

**Tudo fica em `src/config/`** — não é preciso mexer nos componentes:

| Arquivo | Conteúdo |
|---|---|
| `site.ts` | WhatsApp, telefone, endereço, horários, serviços (entrega/instalação), pagamento, garantia, redes sociais, link da Conectfly |
| `catalog.ts` | Linhas de baterias, marcas vendidas e produtos (preço só se for real) |
| `faq.ts` | Perguntas frequentes (respostas se adaptam ao `site.ts`) |
| `testimonials.ts` | Avaliações reais — a seção só aparece com 3 ou mais |
| `vehicles.ts` | Sugestões de marcas/modelos do seletor (não é base de aplicação) |
| `tracking.ts` | Google Tag Manager e consentimento |

Base de aplicação validada (qual bateria serve em cada carro): implementar em `src/lib/applications.ts`.

## ⚠️ Pendências comerciais (antes de publicar)

- [ ] **WhatsApp e telefone reais** em `site.ts` (hoje: `71 99999-9999`, placeholder do mockup) e mudar `isPlaceholder` para `false`
- [ ] Confirmar **marcas vendidas** (`catalog.ts` — hoje só Moura, citada no material do Instagram)
- [ ] Confirmar se vende **baterias de moto** (linha desativada)
- [ ] Confirmar **entrega / instalação no local / teste de bateria** (`site.ts → services`)
- [ ] **Horários**, **formas de pagamento**, **regra de garantia**, **endereço** (se houver loja), **razão social/CNPJ**
- [ ] **Bairros/municípios atendidos** confirmados (`site.ts → region.confirmedAreas`)
- [ ] Perfil do **Instagram** (link)
- [ ] **Fotos reais e autorizadas** dos produtos e logomarcas oficiais das marcas (`public/brands/`)
- [ ] Avaliações reais (Google) para ativar a seção de prova social
- [ ] Revisão jurídica da Política de Privacidade e dos Termos de Uso

## Rastreamento (Google Ads / GA4 / Meta)

1. Crie um contêiner no Google Tag Manager e defina `NEXT_PUBLIC_GTM_ID` (ex.: `GTM-XXXXXXX`) no ambiente de hospedagem.
2. O banner de cookies só aparece quando o GTM está configurado. Consent Mode v2 inicia **tudo negado**.
3. Eventos enviados ao `dataLayer` (configure gatilhos "Evento personalizado" no GTM):

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | Qualquer botão de WhatsApp | `cta_location`, `lead_stage=intent` |
| `phone_click` | Botão "Ligar" | `cta_location` |
| `quote_request` | Pedido de orçamento (seletor / CTA final) | `source` |
| `selector_start` / `selector_step` / `selector_complete` | Uso do seletor | `step`, `vehicle_make`, `vehicle_year` |
| `product_inquiry` | Consulta de linha/produto | `category` ou `product` |
| `region_check` | Consulta de atendimento por bairro | — |
| `battery_3d_interaction`, `faq_open` | Engajamento | — |

- UTMs, `gclid`, `fbclid` etc. são guardados na sessão e anexados como `campaign_*`.
- Eventos repetidos em menos de 1,2 s são ignorados (evita duplicidade).
- Nenhum dado pessoal (bairro, CEP, telefone) é enviado às plataformas.
- Clique no WhatsApp = **intenção**. Venda real deve ser importada depois (conversões offline do Google Ads / CRM).

## Publicação (produção)

- **Site:** https://flybaterias.conectfly.com.br
- **Infraestrutura:** Cloudflare Workers (Worker `flybaterias`, conta da Conectfly) com domínio personalizado. O certificado SSL é automático (`*.conectfly.com.br`).
- **Como funciona:** o `next build` gera o site estático em `out/`; `scripts/build-worker.mjs` empacota esses arquivos dentro do Worker (`worker/index.mjs`), que os entrega com cabeçalhos de segurança (CSP, HSTS, X-Frame-Options…), cache, ETag, HTTPS obrigatório, barra final canônica e página 404.
- **Publicar manualmente:** `CLOUDFLARE_API_TOKEN=... npm run deploy`
- **Deploy automático:** `.github/workflows/deploy.yml`. Em todo push e PR, roda typecheck, lint, build e testes E2E. Em push na `main`, publica se tudo passar. Requer o secret `CLOUDFLARE_API_TOKEN` no GitHub (permissões: *Workers Scripts: Edit* e *Workers Routes: Edit*, conta da Conectfly).
- **Histórico de versões e rollback:** Cloudflare → Workers & Pages → `flybaterias` → *Deployments*: cada publicação fica registrada e pode ser revertida com um clique. Pelo terminal: `npx wrangler deployments list` e `npx wrangler rollback`.
- **Logs:** *Observability* ativado no Worker (Cloudflare → `flybaterias` → *Logs*).
- **Testar o site publicado:** `E2E_BASE=https://flybaterias.conectfly.com.br npm run test:e2e`

## Imagens geradas a partir do modelo 3D

As imagens da bateria (`public/renders/`) e a imagem de compartilhamento (`public/og-image.jpg`) são geradas pelo próprio modelo 3D:

```bash
npm run dev -- -p 3100        # em um terminal
npm run render:assets          # renders da bateria (WebP + AVIF)
node scripts/render-og.mjs     # imagem de compartilhamento
```

As páginas `render-lab` e `og-lab` (`*.dev.tsx`) existem **somente** em desenvolvimento.
A logomarca com fundo transparente é gerada por `scripts/process-logo.py`.

## Resultados medidos (build local, novembro/2026)

Lighthouse 12, página inicial:

| Perfil | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 | 0,6 s | 0 |
| Mobile (simulado, 4G lento) | 94–96 | 100 | 100 | 100 | 2,6–3,0 s | 0,001 |
| Mobile (throttling real DevTools) | 88–91 | 100 | 100 | 100 | 1,8–2,4 s | 0 |

O LCP *observado* (sem simulação) acontece na primeira pintura (~0,2 s). A métrica simulada penaliza os scripts do React carregados no início. Valide após a publicação no [PageSpeed Insights](https://pagespeed.web.dev/) (dados reais de usuários aparecem após algumas semanas de tráfego).

Desenvolvido pela Conectfly.
