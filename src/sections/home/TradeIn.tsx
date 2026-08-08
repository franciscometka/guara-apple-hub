import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/GuaraButton";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

export function TradeIn() {
  return (
    <Section variant="tint" labelledBy="troca" id="troca" narrow>
      {/* TODO: [CONFIRMAR: a loja faz trade-in?] — o FAQ trata isso como
          possibilidade a confirmar, então o texto aqui também não afirma que
          a troca existe. Se o Adriano confirmar que faz, dá pra voltar pra
          uma headline afirmativa ("Seu iPhone atual vale desconto no próximo"). */}
      <SectionHeading
        id="troca"
        align="center"
        eyebrow="Seu aparelho atual"
        title="Quer usar seu iPhone usado como parte do pagamento?"
        subtitle="Manda o modelo e o estado do aparelho no WhatsApp. A gente confirma na hora se dá pra abater no valor do novo e quanto ele vale."
      />
      <Reveal className="mt-10 flex justify-center">
        <Button
          variant="primary"
          href={waLink(WA_MESSAGES.troca)}
          external
          onClick={() => trackWhatsApp("produto")}
        >
          <WhatsAppIcon size={18} variant="white" />
          Avaliar meu aparelho
        </Button>
      </Reveal>
    </Section>
  );
}
