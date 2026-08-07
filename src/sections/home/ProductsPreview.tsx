import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { produtos } from "@/data/products";

export function ProductsPreview() {
  const destaques = produtos.filter((p) => p.destaque).slice(0, 6);

  return (
    <Section labelledBy="produtos-destaque">
      <SectionHeading
        id="produtos-destaque"
        eyebrow="Loja"
        title="Aparelhos disponíveis agora"
        subtitle="Lacrados e seminovos revisados, com a condição real informada antes da compra. Valores atualizados no WhatsApp."
      />
      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destaques.map((p) => (
          <ProductCard key={p.id} produto={p} />
        ))}
      </RevealGroup>
      <Reveal className="mt-12 flex justify-center">
        <Link
          to="/produtos"
          className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-pink-deep"
        >
          Ver todos os produtos
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}
