import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/service/ServiceCard";
import { StepsTimeline } from "@/components/service/StepsTimeline";
import { servicos } from "@/data/services";

export function ServicesPreview() {
  const destaques = servicos.filter((s) => s.destaque).slice(0, 6);

  return (
    <Section variant="dark" labelledBy="assistencia">
      <SectionHeading
        id="assistencia"
        tone="dark"
        eyebrow="Assistência técnica"
        title="Conserto feito na bancada, não no chute"
        subtitle="Diagnóstico antes, orçamento por escrito no WhatsApp e serviço só depois da sua aprovação."
      />
      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destaques.map((s) => (
          <ServiceCard key={s.id} servico={s} />
        ))}
      </RevealGroup>
      <StepsTimeline />
    </Section>
  );
}

