import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import {
  alternarAtivo,
  excluirProduto,
  listarProdutosAdmin,
} from "@/lib/admin-produtos";
import { CATEGORIAS_DB } from "@/lib/produtos-shared";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Produtos — Painel Guara iPhones" },
      {
        name: "description",
        content: "Gerencie o catálogo de produtos da Guara iPhones.",
      },
      { property: "og:title", content: "Produtos — Painel Guara iPhones" },
      {
        property: "og:description",
        content: "Gerencie o catálogo de produtos da Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProdutos,
});

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor,
  );

function AdminProdutos() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const { data: produtos = [], isPending, error } = useQuery({
    queryKey: ["admin", "produtos"],
    queryFn: listarProdutosAdmin,
  });

  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "produtos"] });
    queryClient.invalidateQueries({ queryKey: ["produtos"] });
  };

  const toggle = useMutation({
    mutationFn: (v: { id: string; ativo: boolean }) => alternarAtivo(v.id, v.ativo),
    onSuccess: invalidar,
  });
  const remover = useMutation({
    mutationFn: (id: string) => excluirProduto(id),
    onSuccess: invalidar,
  });

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos.filter(
      (p) =>
        (categoria === "Todas" || p.categoria === categoria) &&
        (termo === "" || p.nome.toLowerCase().includes(termo)),
    );
  }, [produtos, busca, categoria]);

  return (
    <AdminShell
      titulo="Produtos"
      acoes={
        <Link
          to="/admin/produtos/novo"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Novo produto
        </Link>
      }
    >
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar produto por nome"
          className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoria"
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="Todas">Todas as categorias</option>
          {CATEGORIAS_DB.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isPending && (
        <p className="mt-8 text-sm text-muted-foreground">Carregando produtos…</p>
      )}
      {error && (
        <p className="mt-8 text-sm text-destructive">
          Não foi possível carregar os produtos.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {lista.map((p) => (
          <li
            key={p.id}
            className={`flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4 ${
              p.ativo ? "" : "opacity-60"
            }`}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
              {p.fotoUrl ? (
                <img
                  src={p.fotoUrl}
                  alt={p.nome}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-muted-foreground">sem foto</span>
              )}
            </div>

            <div className="min-w-[180px] flex-1">
              <p className="font-medium text-foreground">{p.nome}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {p.categoria} · {p.condicao} ·{" "}
                {p.preco !== null ? formatarPreco(Number(p.preco)) : "sem preço"}
                {p.em_estoque ? "" : " · fora de estoque"}
                {p.destaque ? " · destaque" : ""}
                {p.ativo ? "" : " · INATIVO"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/produtos/$id/editar"
                params={{ id: p.id }}
                aria-label={`Editar ${p.nome}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:border-violet"
              >
                <Pencil size={15} strokeWidth={1.5} aria-hidden="true" />
                Editar
              </Link>
              <button
                type="button"
                onClick={() => toggle.mutate({ id: p.id, ativo: !p.ativo })}
                aria-label={p.ativo ? `Desativar ${p.nome}` : `Ativar ${p.nome}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:border-violet"
              >
                {p.ativo ? (
                  <EyeOff size={15} strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Eye size={15} strokeWidth={1.5} aria-hidden="true" />
                )}
                {p.ativo ? "Desativar" : "Ativar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Excluir "${p.nome}" definitivamente? Essa ação não pode ser desfeita.`,
                    )
                  ) {
                    remover.mutate(p.id);
                  }
                }}
                aria-label={`Excluir ${p.nome}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-destructive/40 px-4 text-sm font-semibold text-destructive hover:bg-destructive/5"
              >
                <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!isPending && lista.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Nenhum produto encontrado com esses filtros.
        </p>
      )}
    </AdminShell>
  );
}
