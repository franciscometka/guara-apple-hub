import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Smartphone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { DossieBadge } from "@/components/contratos/StatusBadge";
import {
  listarDossies,
  nomeDoAparelho,
  POR_PAGINA,
  ROTULO_ORIGEM,
  type DossieDaLista,
} from "@/lib/contratos/dossies";
import type { OrigemDossie } from "@/lib/contratos/database";
import { dataParaBR } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/dossies/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Dossiês de aparelhos — Painel Guara iPhones" },
      {
        name: "description",
        content: "Fichas dos aparelhos: contratos, nota fiscal de entrada e fotos.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ListaDossies,
});

const ORIGENS: { valor: OrigemDossie | "todas"; texto: string }[] = [
  { valor: "todas", texto: "Todas as origens" },
  { valor: "venda", texto: ROTULO_ORIGEM.venda },
  { valor: "assistencia", texto: ROTULO_ORIGEM.assistencia },
  { valor: "upgrade_entrada", texto: ROTULO_ORIGEM.upgrade_entrada },
  { valor: "upgrade_venda", texto: ROTULO_ORIGEM.upgrade_venda },
];

function ListaDossies() {
  const [busca, setBusca] = useState("");
  const [origem, setOrigem] = useState<OrigemDossie | "todas">("todas");
  const [pagina, setPagina] = useState(0);

  const termo = busca.trim();
  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "dossies", { termo, origem, pagina }],
    queryFn: () => listarDossies({ busca: termo, origem, pagina }),
  });

  const itens: DossieDaLista[] = data?.itens ?? [];
  const total = data?.total ?? 0;
  const ultimaPagina = Math.max(0, Math.ceil(total / POR_PAGINA) - 1);

  return (
    <AdminShell titulo="Dossiês de aparelhos">
      <p className="text-sm text-muted-foreground">
        Um dossiê por aparelho, criado quando o primeiro contrato gera PDF. É o que a etiqueta de QR
        Code aponta.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(0);
          }}
          placeholder="Buscar por IMEI, modelo ou número de série"
          aria-label="Buscar aparelho por IMEI, modelo ou número de série"
          className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        />
        <select
          value={origem}
          onChange={(e) => {
            setOrigem(e.target.value as OrigemDossie | "todas");
            setPagina(0);
          }}
          aria-label="Filtrar por origem do aparelho"
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {ORIGENS.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      </div>

      {isPending && <p className="mt-8 text-sm text-muted-foreground">Carregando dossiês…</p>}
      {error && (
        <p className="mt-8 text-sm text-destructive">Não foi possível carregar os dossiês.</p>
      )}

      {!isPending && !error && itens.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-background p-8 text-center">
          <Smartphone
            size={28}
            strokeWidth={1.25}
            aria-hidden="true"
            className="mx-auto text-muted-foreground"
          />
          <p className="mt-3 text-sm font-medium text-foreground">
            {termo ? "Nenhum aparelho com esse dado." : "Nenhum dossiê ainda."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            O dossiê nasce junto com o primeiro PDF gerado para o aparelho.
          </p>
        </div>
      )}

      {itens.length > 0 && (
        <ul className="mt-6 space-y-3">
          {itens.map((dossie) => (
            <li key={dossie.id}>
              <Link
                to="/admin/dossies/$id"
                params={{ id: dossie.id }}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-violet"
              >
                <div className="min-w-[200px] flex-1">
                  <p className="font-medium text-foreground">{nomeDoAparelho(dossie)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {dossie.imei1 ? `IMEI ${dossie.imei1}` : "IMEI não informado"}
                    {` · ${ROTULO_ORIGEM[dossie.origem]}`}
                    {` · ${dossie.contratos} ${dossie.contratos === 1 ? "contrato" : "contratos"}`}
                    {` · ${dataParaBR(dossie.criado_em)}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!dossie.token_ativo && (
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      QR desativado
                    </span>
                  )}
                  {dossie.faltando > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {dossie.faltando} {dossie.faltando === 1 ? "anexo" : "anexos"} faltando
                    </span>
                  )}
                  <DossieBadge completo={dossie.faltando === 0} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {total > POR_PAGINA && (
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
