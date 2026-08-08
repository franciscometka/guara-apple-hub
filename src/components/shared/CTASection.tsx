import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

import { Section } from "@/components/layout/Section";
import { AnimatedGlow } from "@/components/ui/AnimatedGlow";
import { Button } from "@/components/ui/GuaraButton";
import { Reveal } from "@/components/ui/Reveal";
import {
  CONTATO,
  WA_MESSAGES,
  trackWhatsApp,
  waLink,
} from "@/lib/whatsapp";

export function CTASection() {
  return (
    <Section variant="dark" labelledBy="cta-final" className="text-center">
      <AnimatedGlow className="top-auto -bottom-20 h-[70vh]" animate={false} />
      <Reveal className="relative mx-auto max-w-[720px]">
        <h2 id="cta-final" className="type-h2 text-white">
          Ficou com dúvida? Chama no WhatsApp.
        </h2>
        <p className="type-body-lg mx-auto mt-5 text-white/65">
          Modelo, valor, disponibilidade ou conserto — manda a mensagem que a
          gente responde no horário de atendimento.
        </p>
        <div className="mt-9 flex justify-center">
          <Button
            variant="whatsapp"
            size="lg"
            href={waLink(WA_MESSAGES.ctaFinal)}
            external
            onClick={() => trackWhatsApp("cta_final")}
          >
            <WhatsAppIcon size={20} variant="white" />
            Falar no WhatsApp agora
          </Button>
        </div>
        <p className="mt-6 text-sm text-white/50">{CONTATO.horarioResumo}</p>
      </Reveal>
    </Section>
  );
}
