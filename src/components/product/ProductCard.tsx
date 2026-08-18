import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { motion, useReducedMotion } from "motion/react";

import { useEffect, useRef, useState } from "react";
import type { ProdutoView } from "@/lib/produtos-shared";
import { GuaraBadge } from "@/components/ui/GuaraBadge";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

export function ProductCard({ produto }: { produto: ProdutoView }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const info = { preco: produto.preco, emEstoque: produto.emEstoque };
  const emEstoque = produto.emEstoque;

  // Imagem em cache já pode estar completa antes do onLoad ser anexado.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <motion.article
      layout
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-violet-glow hover:shadow-card ${
        emEstoque ? "" : "opacity-60"
      }`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      {...(reduce ? {} : { whileHover: { y: -6 } })}
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-background p-6">
        {!loaded && (
          <div className="shimmer absolute inset-0 -z-10" aria-hidden="true" />
        )}
        <div className="relative flex aspect-[3/4] h-full max-h-[82%] items-center justify-center">
          <img
            ref={imgRef}
            src={produto.imagem}
            alt={`${produto.nome} disponível na Guara iPhones, Guarapuava`}
            loading="lazy"
            width={800}
            height={800}
            onLoad={() => setLoaded(true)}
            className="h-full w-full object-contain transition-transform duration-400 group-hover:scale-105"
          />
        </div>
        <div className="absolute top-4 left-4">
          {emEstoque ? (
            <GuaraBadge>{produto.condicao}</GuaraBadge>
          ) : (
            <GuaraBadge tone="dark">Fora de estoque</GuaraBadge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {produto.nome}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {produto.detalhe}
        </p>
        {info?.preco != null && (
          <p className="mt-2 font-display text-xl font-semibold text-foreground">
            {formatarPreco(info.preco)}
          </p>
        )}
        {emEstoque && (
          <a
            href={waLink(WA_MESSAGES.produto(produto.nome))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("produto")}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep transition-colors hover:text-violet"
          >
            <WhatsAppIcon size={18} />
            {info?.preco != null ? "Falar no WhatsApp" : "Consultar valor no WhatsApp"}
          </a>
        )}
      </div>
    </motion.article>
  );
}
