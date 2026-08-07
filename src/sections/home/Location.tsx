import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { OpenNowBadge } from "@/components/shared/OpenNowBadge";
import { Button } from "@/components/ui/GuaraButton";
import { CONTATO, mapsRoute, trackWhatsApp } from "@/lib/whatsapp";
import fachada from "@/assets/images/fachada.webp.asset.json";

export function Location() {
  return (
    <Section variant="off" labelledBy="localizacao" id="localizacao">
      <SectionHeading
        id="localizacao"
        align="left"
        eyebrow="Onde estamos"
        title="No centro de Guarapuava"
        subtitle="Loja com vitrine na Av. Manoel Ribas, em galeria comercial. Passe pra ver o aparelho de perto ou deixar o seu pra diagnóstico."
      />
      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <ul className="space-y-7">
            <li className="flex gap-4">
              <MapPin
                size={22}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-violet"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold text-foreground">Endereço</h3>
                <p className="mt-1 text-muted-foreground">{CONTATO.endereco}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock
                size={22}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-violet"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Horário de atendimento
                </h3>
                <div className="mt-1 text-muted-foreground">
                  {CONTATO.horarios.map((h) => (
                    <p key={h}>{h}</p>
                  ))}
                </div>
                <div className="mt-3">
                  <OpenNowBadge />
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone
                size={22}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-violet"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold text-foreground">Telefone</h3>
                <p className="mt-1 text-muted-foreground">
                  {CONTATO.telefoneExibicao}
                </p>
              </div>
            </li>
          </ul>
          <p className="mt-8 rounded-md bg-violet-tint px-5 py-4 text-sm text-violet-deep">
            Retirada na loja ou entrega combinada — fale com a gente pelo
            WhatsApp.
          </p>
          <div className="mt-9">
            <Button
              variant="secondary"
              href={mapsRoute()}
              external
              onClick={() => trackWhatsApp("localizacao")}
            >
              <Navigation size={18} strokeWidth={1.5} aria-hidden="true" />
              Traçar rota no Google Maps
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="space-y-6">
          <figure className="overflow-hidden rounded-lg bg-muted">
            <img
              src={fachada.url}
              alt="Fachada da loja Guara iPhones com letreiro, Instagram e telefone"
              loading="lazy"
              decoding="async"
              className="aspect-3/4 w-full object-cover md:aspect-4/5"
            />
          </figure>
          <MapEmbed />
        </Reveal>
      </div>
    </Section>
  );
}
