import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, Building2, FileText, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { DossieBadge, StatusBadge } from "@/components/contratos/StatusBadge";
import {
  buscarPorImei,
  listarContratos,
  POR_PAGINA,
  type ContratoDaLista,
} from "@/lib/contratos/contratos";
import { MODELOS, nomeDoModelo } from "@/lib/contratos/modelos/catalogo";
import { carregarDadosLoja, faltaNaConfiguracao } from "@/lib/contratos/loja-config";
import type { StatusContrato } from "@/lib/contratos/database";
import { dataParaBR } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/contratos/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Contratos — Painel Guara iPhones" },
      {
        name: "description",
        content: "Contratos e dossiês de aparelhos da Guara iPhones.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ListaContratos,
});

const STATUS: { valor: StatusContrato | "todos"; texto: string }[] = [
  { valor: "todos", texto: "Todos os status" },
  { valor: "rascunho", texto: "Rascunho" },
  { valor: "pdf_gerado", texto: "PDF gerado" },
  { valor: "assinado", texto: "Assinado" },
  { valor: "arquivado", texto: "Arquivado" },
  { valor: "cancelado", texto: "Cancelado" },
];

/** O termo digitado parece um IMEI? Aí a busca passa pelos dossiês. */
const pareceImei = (termo: string) =>
  /^\d{4,15}$/.test(termo.replace(/\D+/g, "")) && termo.replace(/\D+/g, "").length >= 6;

function ListaContratos() {
  const [busca, setBusca] = useState("");
  const [modeloSlug, setModeloSlug] = useState("todos");
  const [status, setStatus] = useState<StatusContrato | "todos">("todos");
  const [pagina, setPagina] = useState(0);

  const { data: loja } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });
  const faltando = loja ? faltaNaConfiguracao(loja) : [];
  const configIncompleta = Boolean(loja) && faltando.length > 0;

  const termo = busca.trim();
  const porImei = pareceImei(termo);

  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "lista", { termo, modeloSlug, status, pagina, porImei }],
    queryFn: async () => {
      if (porImei) {
        const itens = await buscarPorImei(termo);
        return { itens, total: itens.length };
      }
      return listarContratos({ busca: termo, modeloSlug, status, pagina });
    },
  });

  const itens: ContratoDaLista[] = data?.itens ?? [];
  const total = data?.total ?? 0;
  const ultimaPagina = Math.max(0, Math.ceil(total / POR_PAGINA) - 1);

  return (
    <AdminShell
      titulo="Contratos"
      acoes={
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/contratos/configuracao"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
          >
            <Building2 size={16} strokeWidth={1.5} aria-hidden="true" />
            Dados da loja
          </Link>
          <Link
            to="/admin/contratos/novo"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            Novo contrato
          </Link>
        </div>
      }
    >
      <p className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">
        <AlertTriangle size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
        Os textos dos contratos são modelos. Confirme com o advogado da loja antes de usar.
      </p>

      {configIncompleta && (
        <div className="mt-4 rounded-lg border border-border bg-background p-4">
          <p className="text-sm font-medium text-foreground">
            Complete os dados da loja antes de emitir contratos.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Falta preencher: {faltando.join(", ")}.
          </p>
          <Link
            to="/admin/contratos/configuracao"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:border-violet"
          >
            Preencher agora
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(0);
          }}
          placeholder="Buscar por cliente, CPF, IMEI ou número"
          aria-label="Buscar contrato por cliente, CPF, IMEI ou número"
          className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        />
        <select
          value={modeloSlug}
          onChange={(e) => {
            setModeloSlug(e.target.value);
            setPagina(0);
          }}
          aria-label="Filtrar por modelo de contrato"
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="todos">Todos os modelos</option>
          {MODELOS.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.nome}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusContrato | "todos");
            setPagina(0);
          }}
          aria-label="Filtrar por status"
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {STATUS.map((s) => (
            <option key={s.valor} value={s.valor}>
              {s.texto}
            </option>
          ))}
        </select>
      </div>

      {isPending && <p className="mt-8 text-sm text-muted-foreground">Carregando contratos…</p>}
      {error && (
        <p className="mt-8 text-sm text-destructive">Não foi possível carregar os contratos.</p>
      )}

      {!isPending && !error && itens.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-background p-8 text-center">
          <FileText
            size={28}
            strokeWidth={1.25}
            aria-hidden="true"
            className="mx-auto text-muted-foreground"
          />
          <p className="mt-3 text-sm font-medium text-foreground">Nenhum contrato ainda.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os contratos emitidos pelo assistente aparecem aqui, junto com o dossiê de cada
            aparelho.
          </p>
        </div>
      )}

      {itens.length > 0 && (
        <ul className="mt-6 space-y-3">
          {itens.map((contrato) => (
            <li key={contrato.id}>
              <Link
                to="/admin/contratos/$id"
                params={{ id: contrato.id }}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-violet"
              >
                <div className="min-w-[200px] flex-1">
                  <p className="font-medium text-foreground">
                    {contrato.numero} · {nomeDoModelo(contrato.modelo_slug)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {contrato.cliente_nome ?? "Cliente não informado"}
                    {contrato.dossie?.modelo ? ` · ${contrato.dossie.modelo}` : ""}
                    {contrato.dossie?.imei1 ? ` · IMEI ${contrato.dossie.imei1}` : ""}
                    {` · ${dataParaBR(contrato.criado_em)}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={contrato.status} />
                  <DossieBadge completo={false} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!porImei && total > POR_PAGINA && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={pagina === 0}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            Anterior
          </button>
          <p className="text-sm text-muted-foreground">
            Página {pagina + 1} de {ultimaPagina + 1}
          </p>
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(ultimaPagina, p + 1))}
            disabled={pagina >= ultimaPagina}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </AdminShell>
  );
}
