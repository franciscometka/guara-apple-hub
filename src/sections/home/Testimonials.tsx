import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";
import { GOOGLE_REVIEWS_URL } from "@/data/testimonials";

export function Testimonials() {
  return (
    <Section labelledBy="depoimentos" narrow>
      <SectionHeading
        id="depoimentos"
        eyebrow="Avaliações no Google"
        title="A melhor propaganda continua sendo a indicação."
      />
      <TestimonialCarousel />
      {/* TODO: [CONFIRMAR: link do perfil no Google Maps] */}
      <div className="mt-8 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-pink-deep"
        >
          Ver todas as avaliações no Google →
        </a>
      </div>
    </Section>
  );
}
