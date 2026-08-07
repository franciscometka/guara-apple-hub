import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Button } from "@/components/ui/GuaraButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/service/ServiceCard";
import { StepsTimeline } from "@/components/service/StepsTimeline";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { CTASection } from "@/components/shared/CTASection";
import { Location } from "@/sections/home/Location";
import { servicos, GARANTIA } from "@/data/services";
import { faqAssistencia } from "@/data/faq";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

const title = "Assistência Técnica de iPhone em Guarapuava — Guara iPhones";
const description =
  "Troca de tela, bateria, conector de carga, câmera e reparo de placa em Guarapuava/PR. Diagnóstico primeiro, orçamento no WhatsApp e garantia no serviço.";

export const Route = createFileRoute("/assistencia-tecnica")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/assistencia-tecnica" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/assistencia-tecnica" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqAssistencia.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: AssistenciaPage,
});

function AssistenciaPage() {
  return (
    <>
      <section
        aria-labelledby="assistencia-title"
        className="relative overflow-hidden bg-ink pt-32 pb-20 md:pt-40 md:pb-24"
      >
        <Container className="relative">

          <p className="type-caption text-violet-glow">Assistência técnica</p>
          <h1
            id="assistencia-title"
            className="type-h1 mt-4 max-w-[760px] text-white"
          >
            Seu iPhone consertado por quem abre, testa e explica
          </h1>
          <p className="type-body-lg mt-5 max-w-[560px] text-white/65">
            Diagnóstico antes do serviço, orçamento por escrito no WhatsApp e
            nada feito sem a sua aprovação.
          </p>
          <div className="mt-10">
            <Button
              variant="whatsapp"
              size="lg"
              magnetic
              href={waLink(WA_MESSAGES.generico)}
              external
              onClick={() => trackWhatsApp("hero")}
            >
              <WhatsAppIcon size={20} />
              Pedir orçamento no WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      <Section labelledBy="servicos">
        <SectionHeading
          id="servicos"
          align="left"
          eyebrow="O que fazemos"
          title="Serviços disponíveis"
          subtitle="Do reparo simples à microssoldagem de placa. Se o problema não estiver na lista, manda mensagem que a gente avalia."
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s) => (
            <ServiceCard key={s.id} servico={s} tone="light" />
          ))}
        </RevealGroup>
      </Section>

      <Section variant="dark" labelledBy="processo">
        <SectionHeading
          id="processo"
          tone="dark"
          eyebrow="Como funciona"
          title="Quatro passos, zero surpresa"
        />
        <StepsTimeline />
      </Section>


      <Section variant="tint" labelledBy="garantia">
        <SectionHeading
          id="garantia"
          eyebrow="Garantia"
          title="Você sai da loja sabendo exatamente o que foi feito"
        />
        <RevealGroup className="mt-14 grid gap-7 md:grid-cols-3">
          {GARANTIA.map((g) => (
            <RevealItem key={g.titulo}>
              <div className="h-full rounded-lg border border-violet-glow/30 bg-background p-7 shadow-soft">
                <ShieldCheck
                  size={24}
                  strokeWidth={1.5}
                  className="text-violet"
                  aria-hidden="true"
                />
                <h3 className="font-display mt-5 text-lg font-semibold text-foreground">
                  {g.titulo}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground">{g.texto}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12">
          <p className="text-sm text-muted-foreground">
            {/* TODO: [CONFIRMAR: prazos exatos de garantia por serviço] */}
            Os prazos de garantia variam conforme o serviço e a peça — sempre
            informados junto com o orçamento.
          </p>
        </Reveal>
      </Section>

      <Section variant="off" labelledBy="faq-assistencia" narrow>
        <SectionHeading
          id="faq-assistencia"
          eyebrow="Dúvidas frequentes"
          title="Antes de trazer seu aparelho"
        />
        <FAQAccordion items={faqAssistencia} />
      </Section>

      <Location />
      <CTASection />
    </>
  );
}
