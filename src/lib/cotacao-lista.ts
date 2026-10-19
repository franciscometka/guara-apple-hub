export type CategoriaAba = {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  margem_pct?: number;
  taxa_pct?: number;
};
export type ItemLista = {
  id: string;
  categoria_id: string;
  descricao: string;
  preco_usd: number;
  ordem: number;
  preco_venda: number;
  preco_sem_taxa?: number;
  custo_brl?: number;
  preco_bruto?: number;
  margem_pct?: number;
  taxa_pct?: number;
};
export type ListaCotacao = { gerente: boolean; categorias: CategoriaAba[]; itens: ItemLista[] };

/** "R$ 7.990" quando inteiro, "R$ 7.990,50" quando tem centavos (formato de mensagem). */
export function precoCurto(valor: number) {
  const inteiro = Number.isInteger(valor);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: inteiro ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/** Texto para colar no WhatsApp: uma linha por produto, só descrição e preço de venda. */
export function textoListaWhatsapp(
  itens: Pick<ItemLista, "descricao" | "preco_venda" | "preco_usd">[],
) {
  return itens
    .filter((i) => i.descricao.trim() && i.preco_usd > 0)
    .map((i) => `${i.descricao.trim()} — ${precoCurto(i.preco_venda)}`)
    .join("\n");
}
