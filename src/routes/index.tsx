import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/sections/home/Hero";
import { TrustBar } from "@/components/shared/TrustBar";
import { TwoPaths } from "@/sections/home/TwoPaths";
import { ProductsPreview } from "@/sections/home/ProductsPreview";
import { ServicesPreview } from "@/sections/home/ServicesPreview";
import { Testimonials } from "@/sections/home/Testimonials";
import { Location } from "@/sections/home/Location";
import { FAQ } from "@/sections/home/FAQ";
import { CTASection } from "@/components/shared/CTASection";
import { CONTATO, WHATSAPP } from "@/lib/whatsapp";

const title = "Guara iPhones — Loja Apple e Assistência Técnica em Guarapuava";
const description =
  "iPhone, iPad, Apple Watch, AirPods e Mac em Guarapuava/PR. Produtos originais com garantia e assistência técnica com orçamento no WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Guara iPhones",
          description,
          telephone: `+${WHATSAPP}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Manoel Ribas, 1945, Sala 7",
            addressLocality: "Guarapuava",
            addressRegion: "PR",
            addressCountry: "BR",
          },
          openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-15:00"],
          email: CONTATO.email,
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <TwoPaths />
      <ProductsPreview />
      <ServicesPreview />
      <Testimonials />
      <Location />
      <FAQ />
      <CTASection />
    </>
  );
}
