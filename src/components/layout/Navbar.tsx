import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/navigation";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { useSessao } from "@/hooks/useSessao";
import { Button } from "@/components/ui/GuaraButton";
import { Container } from "@/components/layout/Container";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import markBlack from "@/assets/images/logo/guara-mark-black.png";
import markWhite from "@/assets/images/logo/guara-mark-white.png";

export function Navbar() {
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const solid = scrolled || open;
  const logado = useSessao();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between md:h-18">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <img
              src={solid ? markBlack : markWhite}
              alt="Guara iPhones"
              width={57}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <span
              className={cn(
                "font-display text-lg font-bold tracking-tight",
                solid ? "text-foreground" : "text-white",
              )}
            >
              Guara<span className="text-violet">iPhones</span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "link-underline text-sm font-medium transition-colors",
                      solid
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-white/70 hover:text-white",
                    )}
                    activeProps={{
                      className: solid ? "text-foreground" : "text-white",
                    }}
                    activeOptions={{ exact: link.to === "/" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              to={logado ? "/minha-conta" : "/entrar"}
              className={cn(
                "link-underline text-sm font-medium transition-colors",
                solid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/70 hover:text-white",
              )}
            >
              {logado ? "Minha conta" : "Entrar"}
            </Link>
            <Button
              variant="whatsapp"
              size="sm"
              href={waLink(WA_MESSAGES.generico)}
              external
              onClick={() => trackWhatsApp("navbar")}
            >
              <WhatsAppIcon size={18} variant="white" eager />
              WhatsApp
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-md md:hidden",
              solid ? "text-foreground" : "text-white",
            )}
          >
            {open ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-background md:hidden"
          >
            <Container>
              <nav aria-label="Navegação principal" className="py-6">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="flex min-h-12 items-center border-b border-border text-base font-medium text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={logado ? "/minha-conta" : "/entrar"}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-border text-base font-medium text-foreground"
                    >
                      {logado ? "Minha conta" : "Entrar"}
                    </Link>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button
                    variant="whatsapp"
                    href={waLink(WA_MESSAGES.generico)}
                    external
                    full
                    onClick={() => {
                      trackWhatsApp("navbar");
                      setOpen(false);
                    }}
                  >
                    <WhatsAppIcon size={20} variant="white" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
