import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { motion, useReducedMotion } from "motion/react";

import type { Servico } from "@/data/services";
import { RevealItem } from "@/components/ui/Reveal";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ServiceCard({
  servico,
  tone = "dark",
}: {
  servico: Servico;
  tone?: "dark" | "light";
}) {
  const reduce = useReducedMotion();
  const Icon = servico.icon;
  const dark = tone === "dark";

  return (
    <RevealItem className="h-full">
      <motion.article
        {...(reduce ? {} : { whileHover: { y: -6 } })}
        className={cn(
          "flex h-full flex-col rounded-lg border p-6 transition-[border-color,box-shadow] duration-300 md:p-7",
          dark
            ? "border-white/8 bg-white/[0.03] hover:border-violet-soft/50"
            : "border-border bg-background shadow-soft hover:border-violet-glow hover:shadow-card",
        )}
      >
        <Icon
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
          className={dark ? "text-violet-soft" : "text-violet"}
        />
        <h3
          className={cn(
            "font-display mt-5 text-lg font-semibold",
            dark ? "text-white" : "text-foreground",
          )}
        >
          {servico.nome}
        </h3>
        <p
          className={cn("mt-2.5 flex-1 text-sm", dark ? "text-white/60" : "text-muted-foreground")}
        >
          {servico.descricao}
        </p>
        {/* TODO: [CONFIRMAR: PRAZOS REAIS] */}
        <p className={cn("type-caption mt-5", dark ? "text-violet-glow" : "text-violet-deep")}>
          {servico.prazo}
        </p>
        <a
          href={waLink(WA_MESSAGES.assistencia(servico.nome))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("servico")}
          className={cn(
            "mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold transition-colors",
            dark ? "text-white hover:text-violet-glow" : "text-violet-deep hover:text-violet",
          )}
        >
          <WhatsAppIcon size={18} />
          Pedir orçamento
        </a>
      </motion.article>
    </RevealItem>
  );
}
