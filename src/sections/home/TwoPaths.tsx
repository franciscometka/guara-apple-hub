import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { PathCard } from "@/components/shared/PathCard";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";
import showroom from "@/assets/images/showroom.webp.asset.json";
import imgBancada from "@/assets/images/bancada-reparo.jpg";

export function TwoPaths() {
  return (
    <Section variant="off" labelledBy="caminhos">
      <SectionHeading
        id="caminhos"
        eyebrow="Como podemos ajudar"
        title="Comprar ou consertar?"
        subtitle="Dois caminhos, o mesmo atendimento: você fala com quem entende do aparelho."
      />
      <RevealGroup className="mt-14 grid gap-7 md:grid-cols-2">
        <PathCard
          titulo="Quero comprar"
          texto="iPhone, iPad, Apple Watch, AirPods, Mac e acessórios. Lacrados e seminovos revisados, com nota fiscal e garantia."
          cta="Ver produtos"
          href="/produtos"
          imagem={showroom.url}
          alt="Salão da loja com prateleiras iluminadas de acessórios Apple e mesas de atendimento"
        />
        <PathCard
          titulo="Meu iPhone deu problema"
          texto="Tela, bateria, conector, câmera, placa ou aparelho molhado. Diagnóstico primeiro, orçamento no WhatsApp, você aprova."
          cta="Pedir orçamento"
          href={waLink(WA_MESSAGES.generico)}
          external
          onClick={() => trackWhatsApp("servico")}
          imagem={imgBancada}
          alt="Técnico realizando reparo em placa de iPhone na bancada"
        />
      </RevealGroup>
    </Section>
  );
}
