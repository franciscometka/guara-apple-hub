import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { listarPerfis } from "@/lib/admin-clientes";
import { excluirCadastroCliente } from "@/lib/clientes.functions";

export const Route = createFileRoute("/admin/clientes")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Clientes — Painel Guara iPhones" },
      {
        name: "description",
        content: "Cadastros de clientes da Guara iPhones.",
      },
      { property: "og:title", content: "Clientes — Painel Guara iPhones" },
      {
        property: "og:description",
        content: "Cadastros de clientes da Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminClientes,
});

const formatarData = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));

function AdminClientes() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const excluir = useServerFn(excluirCadastroCliente);

  const {
    data: clientes = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["admin", "clientes"],
    queryFn: listarPerfis,
  });

  const remover = useMutation({
    mutationFn: (id: string) => excluir({ data: { id } }),
    onSuccess: () => {
      setErro(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "clientes"] });
    },
    onError: () => setErro("Não foi possível excluir esse cadastro. Tente novamente."),
  });

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter((c) =>
      [c.nome, c.email, c.telefone].filter(Boolean).some((v) => v!.toLowerCase().includes(termo)),
    );
  }, [clientes, busca]);

  return (
    <AdminShell titulo="Clientes">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome, e-mail ou telefone"
        aria-label="Buscar cliente"
        className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
      />

      {isPending && <p className="mt-8 text-sm text-muted-foreground">Carregando cadastros…</p>}
      {error && (
        <p className="mt-8 text-sm text-destructive">Não foi possível carregar os cadastros.</p>
      )}
      {erro && <p className="mt-6 text-sm text-destructive">{erro}</p>}

      <ul className="mt-6 space-y-3">
        {lista.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4"
          >
            <div className="min-w-[200px] flex-1">
              <p className="font-medium text-foreground">{c.nome || "Sem nome informado"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {c.email || "sem e-mail"} · {c.telefone || "sem telefone"} · cadastro em{" "}
                {formatarData(c.criado_em)}
              </p>
            </div>
            <button
              type="button"
              disabled={remover.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    `Excluir o cadastro de "${c.nome || c.email || "cliente"}"? Isso remove a conta e os dados dessa pessoa e não pode ser desfeito.`,
                  )
                ) {
                  remover.mutate(c.id);
                }
              }}
              aria-label={`Excluir cadastro de ${c.nome || c.email || "cliente"}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
            >
              <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
              Excluir cadastro
            </button>
          </li>
        ))}
      </ul>

      {!isPending && lista.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Nenhum cadastro encontrado.</p>
      )}
    </AdminShell>
  );
}
