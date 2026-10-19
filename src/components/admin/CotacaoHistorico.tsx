import type { DadosCotacao } from "@/lib/cotacao";
import { campoCotacao, dataHora, moeda, numero } from "@/lib/cotacao";

export function CotacaoHistorico({ dados, busca, categoria, onBusca, onCategoria }: { dados: DadosCotacao; busca: string; categoria: string; onBusca: (value: string) => void; onCategoria: (value: string) => void }) {
  return <section className="mt-12 border-t border-border pt-8">
    <h2 className="font-display text-xl font-semibold">Histórico de cotações</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <input type="search" aria-label="Buscar cotação por descrição" placeholder="Buscar por descrição" className={campoCotacao} value={busca} onChange={e => onBusca(e.target.value)} />
      <select aria-label="Filtrar cotações por categoria" className={campoCotacao} value={categoria} onChange={e => onCategoria(e.target.value)}>
        <option value="">Todas as categorias</option>{dados.categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
    </div>
    <ul className="mt-5 space-y-3">{dados.historico.map(h => <li key={h.id} className="rounded-lg border border-border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="break-words font-semibold">{h.descricao || h.categoria_nome}</p><p className="mt-1 text-sm text-muted-foreground">{h.categoria_nome} · {dataHora(h.created_at)} · {h.criado_por_nome}</p></div><strong className="text-xl text-primary">{moeda(h.preco_venda)}</strong></div>
      <p className="mt-3 text-sm text-muted-foreground">US$ {numero(h.preco_usd)} · Dólar {moeda(h.dolar)}</p>
      {dados.gerente && <p className="mt-1 text-sm text-muted-foreground">Custo {moeda(h.custo_brl ?? 0)} · Margem {h.margem_pct}% · Taxa {h.taxa_pct}%</p>}
    </li>)}</ul>
    {dados.historico.length === 0 && <p className="mt-6 text-sm text-muted-foreground">Nenhuma cotação salva encontrada.</p>}
  </section>;
}