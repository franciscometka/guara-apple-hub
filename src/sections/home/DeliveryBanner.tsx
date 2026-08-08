import { Truck } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/GuaraButton";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

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
          subtitle="Entregamos em até 200 km a partir do centro de Guarapuava — Ponta Grossa, Cascavel, Curitiba e região. Manda sua cidade no WhatsApp que a gente confirma se cobre."
        />
        <Reveal className="mt-10 flex justify-center">
          <Button
            variant="primary"
            href={waLink(WA_MESSAGES.entrega)}
            external
            onClick={() => trackWhatsApp("produto")}
          >
            <WhatsAppIcon size={18} variant="white" />
            Perguntar se entrega na minha cidade
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
