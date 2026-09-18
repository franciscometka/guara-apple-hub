import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { ProductColorSelector } from "@/components/product/ProductColorSelector";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { AnimatedGlow } from "@/components/ui/AnimatedGlow";
import { GuaraBadge } from "@/components/ui/GuaraBadge";
import { coresIrmas, precoEfetivo } from "@/lib/produto-variantes";
import { produtosPublicosQuery } from "@/lib/produtos-query";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export function DestaqueLancamentoSection() {
  const { data: produtos } = useSuspenseQuery(produtosPublicosQuery());
  const reduce = useReducedMotion();
  const elegiveis = useMemo(
    () =>
      produtos
        .filter((produto) => produto.destaque && produto.emEstoque)
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)),
    [produtos],
  );
  const [slugSelecionado, setSlugSelecionado] = useState<string | null>(null);
  const principal = elegiveis[0];

  if (!principal) return null;

  const selecionado =
    (slugSelecionado ? produtos.find((produto) => produto.slug === slugSelecionado) : null) ??
    principal;
  const cores = coresIrmas(selecionado, produtos).map((cor) => ({
    ...cor,
    atual: cor.slug === selecionado.slug,
  }));
  const preco = precoEfetivo(selecionado);
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section
      aria-labelledby="destaque-lancamento-title"
      className="relative overflow-hidden bg-ink py-24 md:py-32 lg:py-36"
    >
      <AnimatedGlow className="top-1/2 h-full -translate-y-1/2" />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <motion.div
            key={selecionado.imagem}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease }}
            className="relative mx-auto flex aspect-square w-full max-w-[580px] items-center justify-center"
          >
            <div
              aria-hidden="true"
              className="absolute inset-[15%] rounded-full bg-violet/15 blur-3xl"
            />
            <img
              src={selecionado.imagem}
              alt={selecionado.nome}
              loading="eager"
              fetchPriority="high"
              width={800}
              height={800}
              className="relative h-full w-full object-contain"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
          >
            <motion.div variants={item}>
              <GuaraBadge className="bg-violet text-primary-foreground">Lançamento</GuaraBadge>
            </motion.div>
            <motion.p variants={item} className="mt-6 text-sm font-semibold text-violet-glow">
              Chegou o mais novo da Apple
            </motion.p>
            <motion.h2
              variants={item}
              id="destaque-lancamento-title"
              className="type-h1 mt-3 text-primary-foreground"
            >
              {selecionado.nome}
            </motion.h2>
            <motion.div variants={item} className="mt-5">
              <GuaraBadge tone="dark">{selecionado.condicao}</GuaraBadge>
            </motion.div>
            <motion.p variants={item} className="mt-7 font-display text-3xl font-semibold text-primary-foreground md:text-4xl">
              {preco === null ? "Consulte o valor" : formatarPreco(preco)}
            </motion.p>
            <motion.p variants={item} className="type-body-lg mt-6 max-w-[560px] text-primary-foreground/70">
              O iPhone mais avançado já criado — direto na loja física de Guarapuava, com garantia e nota fiscal.
            </motion.p>

            <motion.div variants={item}>
              <ProductColorSelector cores={cores} onSelect={setSlugSelecionado} dark />
            </motion.div>

            <motion.div variants={item} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link
                to="/produtos/$slug"
                params={{ slug: selecionado.slug }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full grad-cta px-8 text-sm font-semibold text-primary-foreground transition-[filter,transform] duration-200 hover:scale-[1.02] hover:brightness-110"
              >
                Ver detalhes
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
              </Link>
              <a
                href={waLink(WA_MESSAGES.produto(selecionado.nome))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("produto")}
                className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-glow"
              >
                <WhatsAppIcon size={18} />
                Consultar no WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}