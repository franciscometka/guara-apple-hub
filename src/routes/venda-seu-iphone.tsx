import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { createFileRoute } from "@tanstack/react-router";
import { Smartphone, ClipboardCheck, HandCoins } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Button } from "@/components/ui/GuaraButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { CTASection } from "@/components/shared/CTASection";
import { Location } from "@/sections/home/Location";
import { faqVenda } from "@/data/faq";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

const title = "Venda ou troque seu iPhone usado — Guara iPhones";
const description =
  "Quer vender seu iPhone usado ou usar como parte do pagamento em Guarapuava/PR? Manda o modelo e o estado do aparelho no WhatsApp e a gente confirma na hora.";

export const Route = createFileRoute("/venda-seu-iphone")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://guaraiphones.com.br/venda-seu-iphone",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://guaraiphones.com.br/venda-seu-iphone" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqVenda.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: VendaSeuIphonePage,
});

const PASSOS_VENDA = [
  {
    numero: 1,
    icone: Smartphone,
    titulo: "Manda o modelo",
    texto: "Conta pra gente qual iPhone você tem e o estado geral dele.",
  },
  {
    numero: 2,
    icone: ClipboardCheck,
    titulo: "A gente avalia",
    texto:
      "Perguntamos sobre tela, bateria e o que acompanha (caixa, carregador). Com isso já dá pra ter uma ideia do valor.",
  },
  {
    numero: 3,
    icone: HandCoins,
    titulo: "Confirma na loja",
    texto:
      "Com o aparelho em mãos a gente confirma o valor final — seja como troca de entrada ou venda direta.",
  },
];

const CHECKLIST = [
  "Modelo exato do iPhone (ex: iPhone 13, 128GB)",
  "Estado da tela e da bateria",
  "Se funciona tudo certo (câmera, Face ID, botões)",
  "O que acompanha: caixa, carregador, nota fiscal",
];

function VendaSeuIphonePage() {
  return (
    <>
      <section
        aria-labelledby="venda-title"
        className="relative overflow-hidden bg-ink pt-32 pb-20 md:pt-40 md:pb-24"
      >
        <Container className="relative">
          <p className="type-caption text-violet-glow">Seu aparelho atual</p>
          <h1 id="venda-title" className="type-h1 mt-4 max-w-[760px] text-white">
            Quer vender seu iPhone ou usar como parte do pagamento?
          </h1>
          <p className="type-body-lg mt-5 max-w-[560px] text-white/65">
            Manda o modelo e o estado do aparelho no WhatsApp. A gente confirma
            na hora se dá pra abater no valor do próximo iPhone ou comprar
            direto.
          </p>
          <div className="mt-10">
            <Button
              variant="whatsapp"
              size="lg"
              magnetic
              href={waLink(WA_MESSAGES.troca)}
              external
              onClick={() => trackWhatsApp("hero")}
            >
              <WhatsAppIcon size={20} variant="white" eager />
              Avaliar meu aparelho
            </Button>
          </div>
        </Container>
      </section>

      <Section labelledBy="passos-venda">
        <SectionHeading
          id="passos-venda"
          align="left"
          eyebrow="Como funciona"
          title="Três passos pra saber quanto vale"
          subtitle="Sem enrolação: a conversa começa no WhatsApp e termina com o valor confirmado na loja."
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PASSOS_VENDA.map((passo) => {
            const Icone = passo.icone;
            return (
              <RevealItem key={passo.numero}>
                <div className="h-full rounded-lg border border-border bg-background p-7 shadow-soft">
                  <Icone
                    size={24}
                    strokeWidth={1.5}
                    className="text-violet"
                    aria-hidden="true"
                  />
                  <h3 className="font-display mt-5 text-lg font-semibold text-foreground">
                    {passo.numero}. {passo.titulo}
                  </h3>
                  <p className="mt-2.5 text-sm text-muted-foreground">
                    {passo.texto}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <Section variant="tint" labelledBy="checklist-venda" narrow>
        <SectionHeading
          id="checklist-venda"
          eyebrow="O que mandar"
          title="Adianta a avaliação com essas informações"
        />
        <Reveal className="mt-12">
          <ul className="space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="text-base text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mt-10">
          <Button
            variant="whatsapp"
            size="lg"
            magnetic
            href={waLink(WA_MESSAGES.troca)}
            external
            onClick={() => trackWhatsApp("produto")}
          >
            <WhatsAppIcon size={20} variant="white" />
            Falar no WhatsApp
          </Button>
        </Reveal>
      </Section>

      <Section variant="off" labelledBy="faq-venda" narrow>
        <SectionHeading
          id="faq-venda"
          eyebrow="Dúvidas frequentes"
          title="Antes de negociar seu aparelho"
        />
        <FAQAccordion items={faqVenda} />
      </Section>

      <Location />
      <CTASection />
    </>
  );
}
