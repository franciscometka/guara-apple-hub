import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { AnimatedGlow } from "@/components/ui/AnimatedGlow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { CTASection } from "@/components/shared/CTASection";
import { TrustBar } from "@/components/shared/TrustBar";
import { produtos, type Categoria } from "@/data/products";
import fachada from "@/assets/images/fachada.webp";

const title = "Produtos Apple em Guarapuava — Guara iPhones";
const description =
  "iPhone, iPad, Apple Watch, AirPods, Mac e acessórios em Guarapuava/PR. Lacrados e seminovos revisados, com nota fiscal e garantia.";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/produtos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/produtos" }],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const [categoria, setCategoria] = useState<Categoria | "Todos">("Todos");
  const lista =
    categoria === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoria);

  return (
    <>
      <section
        aria-labelledby="produtos-title"
        className="relative overflow-hidden bg-ink pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <img
          src={fachada}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,12,0.92),rgba(10,9,12,0.7))]"
        />
        <AnimatedGlow className="h-[45vh]" />
        <Container className="relative">
          <p className="type-caption text-violet-glow">Loja</p>
          <h1 id="produtos-title" className="type-h1 mt-4 max-w-[720px] text-white">
            Produtos Apple com procedência
          </h1>
          <p className="type-body-lg mt-5 max-w-[560px] text-white/65">
            Aparelhos lacrados e seminovos revisados. A condição real vem
            descrita antes da compra e o valor você consulta no WhatsApp.
          </p>
        </Container>
      </section>

      <TrustBar />

      <Section labelledBy="catalogo">
        <SectionHeading
          id="catalogo"
          align="left"
          title="Catálogo"
          subtitle="Estoque rotativo — se não achar o modelo aqui, pergunta no WhatsApp que a gente confirma a disponibilidade."
        />
        <div className="mt-10">
          <CategoryFilter ativa={categoria} onChange={setCategoria} />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {lista.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </AnimatePresence>
        </div>
        {lista.length === 0 && (
          <p className="mt-12 text-muted-foreground">
            Nenhum produto listado nesta categoria agora. Fala com a gente no
            WhatsApp que verificamos o estoque.
          </p>
        )}
      </Section>

      <CTASection />
    </>
  );
}
