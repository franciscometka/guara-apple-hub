import { useState } from "react";
import { Calculator, Copy, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { campoCotacao, decimal, moeda, numero } from "@/lib/cotacao";
import {
  passosConta,
  textoListaWhatsapp,
  type CategoriaAba,
  type ItemLista,
} from "@/lib/cotacao-lista";

export type LinhaCotacao = {
  id: string;
  categoria_id: string;
  descricao: string;
  usd: string;
  /** Lucro próprio da linha (R$); vazio = usa o lucro padrão da aba. Só gerente. */
  lucro: string;
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
  onEditar: (id: string, patch: Partial<Pick<LinhaCotacao, "descricao" | "usd" | "lucro">>) => void;
  onExcluir: (id: string) => void;
  onAjustar: (patch: { taxa_pct?: number; lucro_brl?: number }) => Promise<void>;
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
  onAjustar,
}: Props) {
  const [busca, setBusca] = useState("");
  const [conta, setConta] = useState<string | null>(null);
  const colunas = gerente
    ? "sm:grid-cols-[minmax(0,1fr)_9rem_9rem_13rem_6rem]"
    : "sm:grid-cols-[minmax(0,1fr)_9rem_13rem_6rem]";
  const termo = busca.trim().toLowerCase();
  const visiveis = termo ? linhas.filter((l) => l.descricao.toLowerCase().includes(termo)) : linhas;

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
          {gerente && categoria.taxa_pct !== undefined && (
            <CampoRapido
              rotulo="Frete (%)"
              exibicao={`Frete: ${numero(categoria.taxa_pct)}%`}
              inicial={String(categoria.taxa_pct).replace(".", ",")}
              max={100}
              onSalvar={(v) => onAjustar({ taxa_pct: v })}
            />
          )}
          {gerente && categoria.lucro_brl !== undefined && (
            <CampoRapido
              rotulo="Lucro padrão (R$)"
              exibicao={`Lucro padrão: ${moeda(categoria.lucro_brl)}`}
              inicial={String(categoria.lucro_brl).replace(".", ",")}
              onSalvar={(v) => onAjustar({ lucro_brl: v })}
            />
          )}
          <Button variant="outline" className="min-h-11" onClick={() => void copiarLista()}>
            <Copy />
            Copiar lista
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background">
        <div
          className={`hidden gap-3 border-b border-border bg-muted/50 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground sm:grid ${colunas}`}
        >
          <span>Descrição</span>
          <span>Custo (US$)</span>
          {gerente && <span>Lucro (R$)</span>}
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
                <div className={`grid items-center gap-3 px-4 py-3 ${colunas}`}>
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
                  {gerente && (
                    <input
                      aria-label="Lucro (R$)"
                      inputMode="decimal"
                      placeholder={numero(categoria.lucro_brl ?? 0)}
                      title="Em branco usa o lucro padrão da aba"
                      className={campoCotacao}
                      value={l.lucro}
                      onChange={(e) => onEditar(l.id, { lucro: e.target.value })}
                    />
                  )}
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
                  <p className="border-l-2 border-primary bg-muted/30 px-4 py-3 text-sm leading-relaxed">
                    {passosConta(p, dolar)}
                  </p>
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

/** Valor da aba editável em um clique (só gerente). Enter salva, Esc cancela. */
function CampoRapido({
  rotulo,
  exibicao,
  inicial,
  max,
  onSalvar,
}: {
  rotulo: string;
  exibicao: string;
  inicial: string;
  max?: number;
  onSalvar: (valor: number) => Promise<void>;
}) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(inicial);

  async function confirmar() {
    setEditando(false);
    const valor = decimal(texto);
    if (!Number.isFinite(valor) || valor < 0 || (max !== undefined && valor > max)) {
      toast.error(`${rotulo}: valor inválido.`);
      return;
    }
    if (valor === decimal(inicial)) return;
    try {
      await onSalvar(valor);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    }
  }

  if (editando) {
    return (
      <label className="flex items-center gap-2 text-sm font-medium">
        {rotulo}
        <input
          autoFocus
          inputMode="decimal"
          aria-label={rotulo}
          className={`${campoCotacao} min-h-11 w-28`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onBlur={() => void confirmar()}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setEditando(false);
          }}
        />
      </label>
    );
  }
  return (
    <button
      type="button"
      className="rounded-md px-2 py-1 text-sm font-medium underline decoration-dotted underline-offset-4 hover:bg-muted"
      title={`Clique para editar: ${rotulo}`}
      onClick={() => {
        setTexto(inicial);
        setEditando(true);
      }}
    >
      {exibicao}
    </button>
  );
}
