import { useState } from "react";
import { Calculator, Copy, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { campoCotacao, moeda, numero } from "@/lib/cotacao";
import { cambioNumero } from "@/lib/cotacao-cambio";
import { textoListaWhatsapp, type CategoriaAba, type ItemLista } from "@/lib/cotacao-lista";

export type LinhaCotacao = {
  id: string;
  categoria_id: string;
  descricao: string;
  usd: string;
  ordem: number;
};

type Props = {
  categoria: CategoriaAba;
  gerente: boolean;
  linhas: LinhaCotacao[];
  precos: Map<string, ItemLista>;
  pendentes: Set<string>;
  desatualizado: boolean;
  dolar: number;
  novaId: string | null;
  onAdicionar: () => void;
  onEditar: (id: string, patch: Partial<Pick<LinhaCotacao, "descricao" | "usd">>) => void;
  onExcluir: (id: string) => void;
  onMargem: (margem: number) => Promise<void>;
};

export function CotacaoAba({
  categoria,
  gerente,
  linhas,
  precos,
  pendentes,
  desatualizado,
  dolar,
  novaId,
  onAdicionar,
  onEditar,
  onExcluir,
  onMargem,
}: Props) {
  const [busca, setBusca] = useState("");
  const [conta, setConta] = useState<string | null>(null);
  const [editandoMargem, setEditandoMargem] = useState(false);
  const [margemTexto, setMargemTexto] = useState("");
  const termo = busca.trim().toLowerCase();
  const visiveis = termo ? linhas.filter((l) => l.descricao.toLowerCase().includes(termo)) : linhas;

  async function confirmarMargem() {
    const valor = Number(margemTexto.replace(",", "."));
    setEditandoMargem(false);
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      toast.error("Margem deve estar entre 0 e 100%.");
      return;
    }
    if (valor === categoria.margem_pct) return;
    try {
      await onMargem(valor);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível alterar a margem.");
    }
  }
  async function copiarLista() {
    const texto = textoListaWhatsapp(
      linhas.map((l) => ({
        descricao: l.descricao,
        preco_usd: Number(precos.get(l.id)?.preco_usd ?? 0),
        preco_venda: precos.get(l.id)?.preco_venda ?? 0,
      })),
    );
    if (!texto) {
      toast.error("Nenhum produto com descrição e custo para copiar.");
      return;
    }
    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Lista copiada para o WhatsApp.");
    } catch {
      toast.error("Não foi possível copiar a lista.");
    }
  }
  async function copiarPreco(id: string) {
    const p = precos.get(id);
    if (!p) return;
    try {
      await navigator.clipboard.writeText(moeda(p.preco_venda));
      toast.success("Preço copiado.");
    } catch {
      toast.error("Não foi possível copiar o preço.");
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="min-h-11" onClick={onAdicionar}>
            <Plus />
            Adicionar produto
          </Button>
          <label className="relative block">
            <span className="sr-only">Buscar por descrição</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Buscar por descrição"
              className={`${campoCotacao} min-h-11 w-56 pl-9`}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {gerente &&
            categoria.margem_pct !== undefined &&
            (editandoMargem ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                Margem desta aba (%)
                <input
                  autoFocus
                  inputMode="decimal"
                  aria-label="Margem desta aba (%)"
                  className={`${campoCotacao} min-h-11 w-24`}
                  value={margemTexto}
                  onChange={(e) => setMargemTexto(e.target.value)}
                  onBlur={() => void confirmarMargem()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") setEditandoMargem(false);
                  }}
                />
              </label>
            ) : (
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm font-medium underline decoration-dotted underline-offset-4 hover:bg-muted"
                title="Clique para editar a margem"
                onClick={() => {
                  setMargemTexto(String(categoria.margem_pct).replace(".", ","));
                  setEditandoMargem(true);
                }}
              >
                Margem desta aba: {String(categoria.margem_pct).replace(".", ",")}%
              </button>
            ))}
          <Button variant="outline" className="min-h-11" onClick={() => void copiarLista()}>
            <Copy />
            Copiar lista
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background">
        <div className="hidden grid-cols-[minmax(0,1fr)_9rem_13rem_6rem] gap-3 border-b border-border bg-muted/50 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground sm:grid">
          <span>Descrição</span>
          <span>Custo (US$)</span>
          <span>Preço de venda</span>
          <span className="text-right">Ações</span>
        </div>
        <ul>
          {visiveis.map((l) => {
            const p = precos.get(l.id);
            const sujo = pendentes.has(l.id) || desatualizado;
            const tem = Boolean(p) && Number(p?.preco_usd) > 0;
            return (
              <li key={l.id} className="border-b border-border last:border-b-0">
                <div className="grid items-center gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_13rem_6rem]">
                  <input
                    aria-label="Descrição do produto"
                    autoFocus={l.id === novaId}
                    placeholder="Ex.: iPhone 17 Pro 256GB"
                    maxLength={500}
                    className={campoCotacao}
                    value={l.descricao}
                    onChange={(e) => onEditar(l.id, { descricao: e.target.value })}
                  />
                  <input
                    aria-label="Custo em US$"
                    inputMode="decimal"
                    placeholder="0,00"
                    className={campoCotacao}
                    value={l.usd}
                    onChange={(e) => onEditar(l.id, { usd: e.target.value })}
                  />
                  <p
                    aria-live="polite"
                    className={`break-words font-display text-2xl font-semibold text-primary transition-opacity ${sujo ? "opacity-50" : ""}`}
                  >
                    {tem && p ? moeda(p.preco_venda) : "R$ —"}
                  </p>
                  <div className="flex justify-end gap-1">
                    {gerente && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ver a conta"
                        aria-expanded={conta === l.id}
                        disabled={!tem}
                        onClick={() => setConta(conta === l.id ? null : l.id)}
                      >
                        <Calculator />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Copiar preço"
                      disabled={!tem}
                      onClick={() => void copiarPreco(l.id)}
                    >
                      <Copy />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir linha"
                      onClick={() => onExcluir(l.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                {gerente && conta === l.id && p && tem && (
                  <div className="space-y-1 border-l-2 border-primary bg-muted/30 px-4 py-3 text-sm">
                    <p>
                      US$ {numero(p.preco_usd)} × {cambioNumero(dolar)} ={" "}
                      {moeda(p.preco_sem_taxa ?? 0)}
                    </p>
                    <p>
                      + {p.taxa_pct}% de taxa = {moeda(p.custo_brl ?? 0)}
                    </p>
                    <p>
                      + {p.margem_pct}% de margem = {moeda(p.preco_bruto ?? 0)}
                    </p>
                    <p className="font-semibold">Arredondado: {moeda(p.preco_venda)}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {visiveis.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {linhas.length === 0
              ? "Nenhum produto nesta aba. Use “Adicionar produto”."
              : "Nenhum produto encontrado."}
          </p>
        )}
      </div>
    </div>
  );
}
