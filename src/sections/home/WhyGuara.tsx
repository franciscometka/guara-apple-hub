import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import recepcao from "@/assets/images/recepcao.webp.asset.json";
import lounge from "@/assets/images/lounge-apple.webp.asset.json";

const itens = [
  {
    n: "01",
    titulo: "Loja física, endereço fixo.",
    texto:
      "Vitrine na Av. Manoel Ribas, em galeria comercial no centro de Guarapuava. Você entra, vê o aparelho na mão e conversa olho no olho.",
  },
  {
    n: "02",
    titulo: "Atendimento que as pessoas fazem questão de comentar.",
    texto:
      "Não é discurso nosso: é o que aparece repetido nas avaliações do Google. Você entra, é atendido por gente que entende de Apple, e sai sabendo exatamente o que está levando.",
  },
  {
    n: "03",
    titulo: "Produto original, condição descrita antes.",
    texto:
      "Lacrado é lacrado. Seminovo tem a condição real informada antes da compra, sem surpresa depois.",
  },
  {
    n: "04",
    titulo: "Assistência técnica na própria loja.",
    texto:
      "Diagnóstico primeiro, orçamento no WhatsApp e só depois o conserto. Nada é feito sem a sua aprovação.",
  },
  {
    n: "05",
    titulo: "Preço que compete de verdade.",
    texto:
      "“Mais em conta da cidade” foi cliente que escreveu, não a gente. Compare antes de fechar em qualquer outro lugar.",
  },
];

export function WhyGuara() {
  return (
    <Section variant="off" labelledBy="por-que-guara" id="por-que-guara">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="por-que-guara"
            align="left"
            eyebrow="Somos apaixonados pela Apple"
            title="Por que a Guara"
            subtitle="Loja de verdade, com gente de verdade atendendo — e o preço na mesa desde o começo."
          />
          <RevealGroup className="mt-12 space-y-8">
            {itens.map((item) => (
              <RevealItem key={item.n}>
                <div className="border-t border-border pt-6">
                  <span className="text-sm font-semibold text-violet-deep">
                    {item.n}
                  </span>
                  <h3 className="type-h3 mt-3 text-foreground">{item.titulo}</h3>
                  <p className="mt-3 text-muted-foreground">{item.texto}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure>
            <img
              src={recepcao.url}
              alt="Balcão de atendimento da Guara iPhones em ripado de madeira"
              loading="lazy"
              decoding="async"
              className="aspect-3/4 w-full rounded-lg bg-muted object-cover"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Nosso balcão de atendimento na loja.
            </figcaption>
          </figure>
          <figure>
            <img
              src={lounge.url}
              alt="Espaço de espera da loja com a maçã iluminada na parede e poltronas"
              loading="lazy"
              decoding="async"
              className="aspect-3/4 w-full rounded-lg bg-muted object-cover"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Espaço de espera para quem está sendo atendido.
            </figcaption>
          </figure>
        </Reveal>

      </div>
    </Section>
  );
}
