import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Exportação estática: o site vira arquivos HTML/CSS/JS prontos,
  // que podem ser hospedados em Cloudflare Pages, Vercel, Netlify etc.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // CSS embutido no HTML: elimina uma requisição que bloqueava a primeira pintura.
  experimental: { inlineCss: true },
  // Páginas "*.dev.tsx" (laboratório de renderização) só existem em desenvolvimento.
  pageExtensions: isDev ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
};

export default nextConfig;
