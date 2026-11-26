import { site } from "@/config/site";
import { getFaq } from "@/config/faq";
import { enabledBrands } from "@/config/catalog";

/** Dados estruturados (LocalBusiness + FAQ) — apenas com informações confirmadas. */
export default function JsonLd() {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": `${site.url}/#empresa`,
    name: site.name,
    slogan: site.slogan,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/flybaterias-logo.png`,
    image: `${site.url}/og-image.jpg`,
    areaServed: [
      { "@type": "City", name: "Salvador", containedInPlace: { "@type": "State", name: "Bahia" } },
      ...site.region.confirmedAreas.map((a) => ({ "@type": "Place", name: a })),
    ],
    knowsAbout: ["Baterias automotivas", "Baterias EFB", "Baterias AGM", "Baterias Start-Stop"],
    brand: enabledBrands().map((b) => ({ "@type": "Brand", name: b.name })),
  };
  if (!site.contact.isPlaceholder) business.telephone = site.contact.phone;
  if (site.address) {
    business.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: "BR",
    };
    if (site.address.lat && site.address.lng) business.geo = { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng };
  }
  const sameAs = [site.social.instagram, site.social.facebook, site.social.googleBusiness].filter(Boolean);
  if (sameAs.length) business.sameAs = sameAs;
  if (site.paymentMethods.length) business.paymentAccepted = site.paymentMethods.join(", ");

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getFaq().map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, inLanguage: "pt-BR" };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([business, website, faq]).replace(/</g, "\\u003c") }}
    />
  );
}
