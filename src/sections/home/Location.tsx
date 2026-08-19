import { Truck, Navigation } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { OpenNowBadge } from "@/components/shared/OpenNowBadge";
import { Button } from "@/components/ui/GuaraButton";
import { CONTATO, mapsRoute, trackWhatsApp } from "@/lib/whatsapp";
import fachada from "@/assets/images/fachada.webp";

export function Location() {
  return (
    <Section labelledBy="localizacao" id="localizacao">
      <SectionHeading
        id="localizacao"
        align="left"
        eyebrow="Onde estamos"
        title="No centro de Guarapuava"
        subtitle="Loja com vitrine na Av. Manoel Ribas, em galeria comercial. Passe pra ver o aparelho de perto ou deixar o seu pra diagnóstico."
      />
      <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="type-caption text-muted-foreground">Endereço</p>
              <p className="mt-1 text-foreground">{CONTATO.endereco}</p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground">Horário de atendimento</p>
              <div className="mt-1 text-foreground">
                {CONTATO.horarios.map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </div>
              <div className="mt-3">
                <OpenNowBadge />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Truck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 text-violet"
                  aria-hidden="true"
                />
                Retirada na loja ou entrega combinada — fale com a gente pelo WhatsApp.
              </p>
            </div>
            <div>
              <p className="type-caption text-muted-foreground">Telefone</p>
              <p className="mt-1 text-foreground">{CONTATO.telefoneExibicao}</p>
            </div>
          </div>
          <div className="mt-9">
            <Button
              variant="secondary"
              href={mapsRoute()}
              external
              onClick={() => trackWhatsApp("localizacao")}
            >
              <Navigation size={20} strokeWidth={1.5} aria-hidden="true" />
              Traçar rota no Google Maps
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <img
            src={fachada}
            alt="Fachada da loja Guara iPhones com letreiro, Instagram e telefone"
            width={382}
            height={510}
            loading="lazy"
            decoding="async"
            className="aspect-4/5 w-full rounded-lg bg-muted object-cover"
          />
        </Reveal>
      </div>
    </Section>
  );
}
