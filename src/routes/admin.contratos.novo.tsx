import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { MODELOS } from "@/lib/contratos/modelos/catalogo";
import { modeloImplementado, obterModelo } from "@/lib/contratos/campos";
import { criarContrato } from "@/lib/contratos/assistente";
import { carregarDadosLoja, faltaNaConfiguracao } from "@/lib/contratos/loja-config";
import { obterProdutoAdmin } from "@/lib/admin-produtos";

export const Route = createFileRoute("/admin/contratos/novo")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  validateSearch: (busca: Record<string, unknown>): { produto?: string } => {
    const produto = busca["produto"];
    return typeof produto === "string" && produto !== "" ? { produto } : {};
  },
  head: () => ({
    meta: [
      { title: "Novo contrato — Painel Guara iPhones" },
      { name: "description", content: "Escolha o modelo de contrato." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EscolherModelo,
});

function EscolherModelo() {
  const navigate = useNavigate();
  const { produto: produtoId } = Route.useSearch();

  // Quando veio de "Gerar contrato deste aparelho", o catálogo preenche o que
  // já sabe sobre o produto.
  const { data: produto } = useQuery({
    queryKey: ["admin", "produto", produtoId],
    queryFn: () => obterProdutoAdmin(produtoId as string),
    enabled: Boolean(produtoId),
  });

  const { data: loja, isPending } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });
  const faltando = loja ? faltaNaConfiguracao(loja) : [];
  const bloqueado = Boolean(loja) && faltando.length > 0;

  const criar = useMutation({
    mutationFn: (slug: string) =>
      criarContrato(
        obterModelo(slug),
        produto
          ? {
              id: produto.id,
              nome: produto.nome,
              cor: produto.cor ?? "",
              condicao: produto.condicao,
              preco: Number(
                produto.em_promocao && produto.preco_promocional !== null
                  ? produto.preco_promocional
                  : (produto.preco ?? 0),
              ),
            }
          : undefined,
      ),
    onSuccess: (id) => navigate({ to: "/admin/contratos/$id/preencher", params: { id } }),
    onError: () => toast.error("Não foi possível criar o contrato."),
  });

  return (
    <AdminShell
      titulo="Preencha os contratos"
      acoes={
        <Link
          to="/admin/contratos"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Voltar
        </Link>
      }
    >
      <p className="max-w-2xl text-sm text-muted-foreground">
        Escolha o modelo. Vamos perguntar tudo passo a passo e gerar o PDF no final.
      </p>

      {produto && (
        <p className="mt-3 inline-flex rounded-full border border-violet/40 bg-accent px-3 py-1 text-sm text-accent-foreground">
          Aproveitando os dados de “{produto.nome}” do catálogo.
        </p>
      )}

      {bloqueado && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Complete os dados da loja antes de criar um contrato.
          </p>
          <p className="mt-1 text-sm text-amber-900/80">Falta preencher: {faltando.join(", ")}.</p>
          <Link
            to="/admin/contratos/configuracao"
            className="mt-3 inline-flex min-h-11 items-center rounded-full border border-amber-700/30 bg-background px-4 text-sm font-semibold text-foreground hover:border-violet"
          >
            Preencher dados da loja
          </Link>
        </div>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {MODELOS.map((modelo) => {
          const pronto = modeloImplementado(modelo.slug);
          const indisponivel = bloqueado || isPending || !pronto || criar.isPending;

          return (
            <li key={modelo.slug}>
              <button
                type="button"
                disabled={indisponivel}
                onClick={() => criar.mutate(modelo.slug)}
                className="flex h-full w-full flex-col items-start gap-2 rounded-lg border border-border bg-background p-5 text-left transition-colors hover:border-violet disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border"
              >
                <span className="font-display text-base font-semibold text-foreground">
                  {modelo.nome}
                </span>
                <span className="text-sm text-muted-foreground">{modelo.quandoUsar}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-violet-deep">
                  {pronto ? (
                    <>
                      Começar
                      <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                    </>
                  ) : (
                    <span className="text-muted-foreground">Em preparação</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </AdminShell>
  );
}
