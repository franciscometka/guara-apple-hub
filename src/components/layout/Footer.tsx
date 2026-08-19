import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { footerNav, footerServicos } from "@/data/navigation";
import { OpenNowBadge } from "@/components/shared/OpenNowBadge";
import { useSessao } from "@/hooks/useSessao";
import { CONTATO, WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";
import logoWhite from "@/assets/images/logo/guara-logo-white.png";

export function Footer() {
  const ano = new Date().getFullYear();
  const logado = useSessao();

  return (
    <footer className="border-t border-white/8 bg-ink text-white/60">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-4 md:py-20">
          <div className="md:col-span-1">
            <img
              src={logoWhite}
              alt="Guara iPhones"
              width={190}
              height={109}
              loading="lazy"
              decoding="async"
              className="h-auto w-[190px] object-contain"
            />
            <p className="type-caption mt-3 text-violet-soft">Somos apaixonados pela Apple</p>
            <p className="mt-4 text-sm leading-relaxed">
              Loja Apple e assistência técnica em Guarapuava. Produto original, conserto com
              garantia e atendimento direto no WhatsApp.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={CONTATO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @guaraiphones"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 transition-colors hover:border-violet-soft hover:text-white"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href={CONTATO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Guara iPhones"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 transition-colors hover:border-violet-soft hover:text-white"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a
                href={waLink(WA_MESSAGES.generico)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("rodape")}
                aria-label="WhatsApp da Guara iPhones"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 transition-colors hover:border-violet-soft hover:text-white"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="type-caption font-semibold text-white">
              Navegação
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {footerNav.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex min-h-11 items-center transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="type-caption font-semibold text-white">Serviços</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {footerServicos.map((s) => (
                <li key={s}>
                  <Link
                    to="/assistencia-tecnica"
                    className="flex min-h-11 items-center transition-colors hover:text-white"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="type-caption font-semibold text-white">Contato</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-violet-soft"
                  aria-hidden="true"
                />
                <span>{CONTATO.endereco}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0 text-violet-soft"
                  aria-hidden="true"
                />
                <a
                  href={waLink(WA_MESSAGES.generico)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp("rodape")}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-white"
                >
                  {CONTATO.telefoneExibicao}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-violet-soft"
                  aria-hidden="true"
                />
                <span>
                  {CONTATO.horarios.map((h) => (
                    <span key={h} className="block">
                      {h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
            <div className="mt-5">
              <OpenNowBadge />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/8 py-7 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {ano} Guara iPhones. Todos os direitos reservados.</p>
          {/* TODO: [CONFIRMAR: CNPJ e razão social] */}
          <p className="max-w-[65ch] leading-relaxed">
            Guarapuava/PR · Não somos revenda autorizada Apple. Apple, iPhone, iPad e Mac são marcas
            da Apple Inc.
          </p>
          <Link
            to={logado ? "/minha-conta" : "/entrar"}
            className="min-h-11 shrink-0 items-center transition-colors hover:text-white md:flex"
          >
            {logado ? "Minha conta" : "Entrar"}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
