import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { ConsentDefaults, GtmNoScript, GtmScript } from "@/components/layout/TagManager";
import ClientRuntime from "@/components/ClientRuntime";
import CookieConsent from "@/components/layout/CookieConsent";

const title = "FlyBaterias | Baterias automotivas em Salvador e região";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | FlyBaterias" },
  description:
    "Bateria automotiva em Salvador com atendimento especializado. Encontre a bateria certa para seu carro — convencional, EFB ou AGM — e peça pelo WhatsApp.",
  keywords: ["baterias em Salvador", "loja de baterias em Salvador", "bateria automotiva Salvador", "bateria para carro", "onde comprar bateria em Salvador", "bateria Moura Salvador", "bateria EFB", "bateria AGM"],
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title,
    description: "Seu carro não pode parar. Encontre a bateria ideal com atendimento especializado em Salvador e região.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "FlyBaterias — baterias automotivas em Salvador" }],
  },
  twitter: { card: "summary_large_image", title, images: ["/og-image.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06142F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ConsentDefaults />
        <GtmScript />
      </head>
      <body>
        <GtmNoScript />
        {children}
        <ClientRuntime />
        <CookieConsent />
      </body>
    </html>
  );
}
