import { Truck } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function DeliveryBanner() {
  return (
    <Section variant="tint" labelledBy="entrega" id="entrega" narrow>
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet/10 text-violet">
            <Truck size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
        </Reveal>
        <SectionHeading
          id="entrega"
          align="center"
          eyebrow="Entrega"
          title="Não está em Guarapuava? A gente leva até você."
          subtitle="Entregamos em até 100 km a partir do centro de Guarapuava. Manda sua cidade no WhatsApp que a gente confirma se cobre."
        />
      </div>
    </Section>
  );
}
