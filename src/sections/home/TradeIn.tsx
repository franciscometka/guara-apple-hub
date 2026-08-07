import { MessageCircle } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/GuaraButton";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

export function TradeIn() {
  return (
    <Section variant="tint" labelledBy="troca" id="troca" narrow>
      <SectionHeading
        id="troca"
        eyebrow="Troca com desconto"
        title="Seu iPhone atual vale desconto no próximo."
        subtitle="A gente avalia o seu aparelho e abate no valor do novo. Manda o modelo e o estado no WhatsApp que te passamos quanto vale."
      />
      <Reveal className="mt-10 flex justify-center">
        <Button
          variant="primary"
          href={waLink(WA_MESSAGES.troca)}
          external
          onClick={() => trackWhatsApp("produto")}
        >
          <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
          Avaliar meu aparelho
        </Button>
      </Reveal>
    </Section>
  );
}
