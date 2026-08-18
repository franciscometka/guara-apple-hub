import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { criarProduto, type DadosProduto } from "@/lib/admin-produtos";

export const Route = createFileRoute("/admin/produtos/novo")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Novo produto — Painel Guara iPhones" },
      {
        name: "description",
        content: "Cadastre um novo produto no catálogo da Guara iPhones.",
      },
      { property: "og:title", content: "Novo produto — Painel Guara iPhones" },
      {
        property: "og:description",
        content: "Cadastre um novo produto no catálogo da Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NovoProduto,
});

function NovoProduto() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const criar = useMutation({
    mutationFn: (v: { dados: DadosProduto; foto: File | null }) =>
      criarProduto(v.dados, v.foto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "produtos"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      navigate({ to: "/admin" });
    },
  });

  return (
    <AdminShell titulo="Novo produto">
      <ProdutoForm
        salvando={criar.isPending}
        erro={criar.error ? "Não foi possível salvar o produto." : null}
        onSubmit={(dados, foto) => criar.mutate({ dados, foto })}
      />
    </AdminShell>
  );
}
