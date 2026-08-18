import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import {
  atualizarProduto,
  obterProdutoAdmin,
  type DadosProduto,
} from "@/lib/admin-produtos";

export const Route = createFileRoute("/admin/produtos/$id/editar")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Editar produto — Painel Guara iPhones" },
      {
        name: "description",
        content: "Edite os dados de um produto do catálogo da Guara iPhones.",
      },
      { property: "og:title", content: "Editar produto — Painel Guara iPhones" },
      {
        property: "og:description",
        content: "Edite os dados de um produto do catálogo da Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditarProduto,
});

function EditarProduto() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: produto, isPending, error } = useQuery({
    queryKey: ["admin", "produto", id],
    queryFn: () => obterProdutoAdmin(id),
  });

  const salvar = useMutation({
    mutationFn: (v: { dados: DadosProduto; foto: File | null }) =>
      atualizarProduto(id, produto!.slug, v.dados, v.foto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      navigate({ to: "/admin" });
    },
  });

  return (
    <AdminShell titulo="Editar produto">
      {isPending && (
        <p className="text-sm text-muted-foreground">Carregando produto…</p>
      )}
      {error && (
        <p className="text-sm text-destructive">
          Não foi possível carregar esse produto.
        </p>
      )}
      {produto && (
        <ProdutoForm
          iniciais={{
            nome: produto.nome,
            categoria: produto.categoria,
            condicao: produto.condicao,
            detalhe: produto.detalhe ?? "",
            preco: produto.preco === null ? null : Number(produto.preco),
            em_estoque: produto.em_estoque,
            destaque: produto.destaque,
            ativo: produto.ativo,
            fotoUrl: produto.fotoUrl,
          }}
          salvando={salvar.isPending}
          erro={salvar.error ? "Não foi possível salvar as alterações." : null}
          onSubmit={(dados, foto) => salvar.mutate({ dados, foto })}
        />
      )}
    </AdminShell>
  );
}
