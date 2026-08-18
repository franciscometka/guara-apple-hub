import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/sections/home/Hero";
import { TrustBar } from "@/components/shared/TrustBar";
import { TwoPaths } from "@/sections/home/TwoPaths";
import { ProductsPreview } from "@/sections/home/ProductsPreview";
import { TradeIn } from "@/sections/home/TradeIn";
import { TaglineBanner } from "@/components/shared/TaglineBanner";
import { ServicesPreview } from "@/sections/home/ServicesPreview";
import { Testimonials } from "@/sections/home/Testimonials";
import { Location } from "@/sections/home/Location";
import { DeliveryBanner } from "@/sections/home/DeliveryBanner";
import { FAQ } from "@/sections/home/FAQ";
import { CTASection } from "@/components/shared/CTASection";
import { CONTATO, WHATSAPP } from "@/lib/whatsapp";
import { produtosPublicosQuery } from "@/lib/produtos-query";
import fachada from "@/assets/images/fachada.webp";

const title = "Guara iPhones — Loja Apple e Assistência Técnica em Guarapuava";
const description =
  "Somos apaixonados pela Apple. iPhone, iPad, Apple Watch, AirPods e Mac em Guarapuava/PR, com atendimento que vira comentário nas avaliações e assistência técnica no WhatsApp.";
const ogImage = `https://guara-apple-hub.lovable.app${fachada}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: "/" },
      // Começa a baixar o modelo 3D do Hero em paralelo com o JS, sem
      // esperar o chunk do Three.js terminar de baixar e executar pra só
      // então disparar o fetch via useGLTF.preload.
      {
        rel: "preload",
        as: "fetch",
        href: "/models/iphone.glb",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Guara iPhones",
          description,
          telephone: `+${WHATSAPP}`,
          image: ogImage,
          sameAs: [CONTATO.instagram],
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
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(produtosPublicosQuery());
  },
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <TwoPaths />
      <ProductsPreview />
      <TradeIn />
      <TaglineBanner />
      <ServicesPreview />
      <Testimonials />
      <Location />
      <DeliveryBanner />
      <FAQ />
      <CTASection />
    </>
  );
}
