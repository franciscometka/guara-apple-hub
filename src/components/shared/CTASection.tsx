import { MessageCircle } from "lucide-react";
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
        <h2 id="cta-final" className="text-h2 text-white">
          Chama no WhatsApp. A resposta vem rápido.
        </h2>
        <p className="text-body-lg mx-auto mt-5 text-white/65">
          Dúvida sobre modelo, valor, disponibilidade ou conserto — manda
          mensagem que a gente te responde no horário comercial.
        </p>
        <div className="mt-9 flex justify-center">
          <Button
            variant="whatsapp"
            size="lg"
            href={waLink(WA_MESSAGES.ctaFinal)}
            external
            onClick={() => trackWhatsApp("cta_final")}
          >
            <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
            Falar no WhatsApp agora
          </Button>
        </div>
        <p className="mt-6 text-sm text-white/50">{CONTATO.horarioResumo}</p>
      </Reveal>
    </Section>
  );
}
