import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { GuaraBadge } from "@/components/ui/GuaraBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductColorSelector } from "@/components/product/ProductColorSelector";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { CTASection } from "@/components/shared/CTASection";
import { fotosProdutoQuery, produtosPublicosQuery } from "@/lib/produtos-query";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";
import {
  capacidadesIrmas,
  coresIrmas,
  percentualDesconto,
} from "@/lib/produto-variantes";
import type { ProdutoView } from "@/lib/produtos-shared";
import { cn } from "@/lib/utils";

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export const Route = createFileRoute("/produtos/$slug")({
  loader: async ({ context, params }) => {
    const produtos = await context.queryClient.ensureQueryData(produtosPublicosQuery());
    return { produto: produtos.find((p) => p.slug === params.slug) ?? null };
  },
  head: ({ loaderData }) => {
    const produto = loaderData?.produto;
    if (!produto) {
      return { meta: [{ title: "Produto não encontrado — Guara iPhones" }] };
    }

    const title = `${produto.nome} — Guara iPhones`;
    const preco =
      produto.emPromocao && produto.precoPromocional ? produto.precoPromocional : produto.preco;
    const description = preco
      ? `${produto.nome} por ${formatarPreco(preco)} na Guara iPhones, Guarapuava/PR. ${produto.condicao}, com nota fiscal e garantia.`
      : `${produto.nome} na Guara iPhones, Guarapuava/PR. ${produto.condicao}, com nota fiscal e garantia. Consulte o valor no WhatsApp.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produtos/${produto.slug}` },
        ...(produto.imagem ? [{ property: "og:image", content: produto.imagem }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/produtos/${produto.slug}` }],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { slug } = Route.useParams();
  const { data: produtos } = useSuspenseQuery(produtosPublicosQuery());
  const produto = produtos.find((p) => p.slug === slug);

  if (!produto) return <ProdutoNaoEncontrado />;

  return <ProdutoDetalhe produto={produto} todos={produtos} />;
}

function ProdutoNaoEncontrado() {
  return (
    <Section labelledBy="nao-encontrado" className="pt-32 md:pt-40">
      <h1 id="nao-encontrado" className="type-h1 text-foreground">
        Produto não encontrado
      </h1>
      <p className="type-body-lg mt-5 max-w-[520px] text-muted-foreground">
        Esse produto saiu do catálogo ou o endereço está incorreto. Veja o que temos disponível
        agora — o estoque é rotativo.
      </p>
      <Link
        to="/produtos"
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full grad-cta px-6 text-sm font-semibold text-white"
      >
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        Voltar ao catálogo
      </Link>
    </Section>
  );
}

function ProdutoDetalhe({ produto, todos }: { produto: ProdutoView; todos: ProdutoView[] }) {
  const { data: fotosExtras = [] } = useQuery(fotosProdutoQuery(produto.id));

  const fotos = [produto.imagem, ...fotosExtras].filter(Boolean);
  const cores = coresIrmas(produto, todos);
  const capacidades = capacidadesIrmas(produto, todos);

  const promo =
    produto.emPromocao && produto.precoPromocional != null && produto.preco != null
      ? {
          promocional: produto.precoPromocional,
          original: produto.preco,
          desconto: percentualDesconto(produto.preco, produto.precoPromocional),
        }
      : null;

  return (
    <>
      <Section labelledBy="produto-title" className="pt-32 md:pt-40">
        <Link
          to="/produtos"
          className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep"
        >
          <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
          Voltar ao catálogo
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery fotos={fotos} alt={`${produto.nome} — Guara iPhones, Guarapuava`} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <GuaraBadge>{produto.condicao}</GuaraBadge>
              {!produto.emEstoque && <GuaraBadge tone="dark">Fora de estoque</GuaraBadge>}
              {promo && <GuaraBadge tone="success">-{promo.desconto}%</GuaraBadge>}
            </div>

            <h1 id="produto-title" className="type-h1 mt-4 text-foreground">
              {produto.nome}
            </h1>

            {produto.sku && (
              <p className="mt-3 text-sm text-muted-foreground">SKU: {produto.sku}</p>
            )}

            <div className="mt-7">
              {promo ? (
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-4xl font-semibold text-foreground">
                    {formatarPreco(promo.promocional)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatarPreco(promo.original)}
                  </span>
                </div>
              ) : produto.preco != null ? (
                <span className="font-display text-4xl font-semibold text-foreground">
                  {formatarPreco(produto.preco)}
                </span>
              ) : (
                <span className="font-display text-2xl font-semibold text-foreground">
                  Consulte o valor
                </span>
              )}
            </div>

            <ProductColorSelector cores={cores} />

            {capacidades.length > 0 && <SeletorCapacidade capacidades={capacidades} />}

            {produto.condicao === "Seminovo" && produto.bateria != null && (
              <p className="mt-7 text-sm font-medium text-foreground">
                Bateria: <span className="font-semibold">{produto.bateria}%</span>
              </p>
            )}

            {produto.detalhe && (
              <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
                {produto.detalhe}
              </p>
            )}

            {produto.emEstoque ? (
              <a
                href={waLink(WA_MESSAGES.produto(produto.nome))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("produto")}
                className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full grad-cta px-8 text-sm font-semibold text-white sm:w-auto"
              >
                <WhatsAppIcon size={20} />
                Comprar pelo WhatsApp
              </a>
            ) : (
              <p className="mt-9 text-sm text-muted-foreground">
                Este produto está fora de estoque no momento.{" "}
                <a
                  href={waLink(WA_MESSAGES.produto(produto.nome))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp("produto")}
                  className="link-underline font-semibold text-violet-deep"
                >
                  Pergunte no WhatsApp
                </a>{" "}
                que a gente avisa quando chegar.
              </p>
            )}
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

function SeletorCapacidade({ capacidades }: { capacidades: ReturnType<typeof capacidadesIrmas> }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-foreground">Escolha a Capacidade</h2>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {capacidades.map((c) => (
          <Link
            key={c.valor}
            to="/produtos/$slug"
            params={{ slug: c.slug }}
            aria-current={c.atual ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors",
              c.atual
                ? "border-transparent grad-cta text-white"
                : "border-border bg-background text-foreground hover:border-violet hover:text-violet-deep",
              c.emEstoque ? "" : "opacity-40",
            )}
          >
            {c.valor}
          </Link>
        ))}
      </div>
    </div>
  );
}
