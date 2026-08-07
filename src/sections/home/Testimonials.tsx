import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";

export function Testimonials() {
  return (
    <Section labelledBy="depoimentos" narrow>
      <SectionHeading
        id="depoimentos"
        eyebrow="Quem já comprou"
        title="Clientes de Guarapuava e região"
      />
      <TestimonialCarousel />
    </Section>
  );
}
