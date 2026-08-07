import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { faq } from "@/data/faq";

export function FAQ() {
  return (
    <Section variant="off" labelledBy="faq" narrow>
      <SectionHeading
        id="faq"
        eyebrow="Dúvidas frequentes"
        title="O que a gente mais responde no WhatsApp"
      />
      <FAQAccordion items={faq} />
    </Section>
  );
}
