import { moeda, numero } from "./cotacao";
import { cambioNumero } from "./cotacao-cambio";

/** Categoria (aba). Os campos de frete, lucro e margem extra só vêm para gerente. */
export type CategoriaAba = {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  taxa_pct?: number;
  lucro_brl?: number;
  margem_pct?: number;
};
/** Linha da lista. Os campos da conta só vêm para gerente. */
export type ItemLista = {
  id: string;
  categoria_id: string;
  descricao: string;
  preco_usd: number;
  ordem: number;
  preco_venda: number;
  custo_brl?: number;
  frete_brl?: number;
  lucro_brl?: number;
  lucro_item?: number | null;
  margem_extra_brl?: number;
  antes_arredondar?: number;
  taxa_pct?: number;
  margem_pct?: number;
};
export type ListaCotacao = {
  gerente: boolean;
  dolar: number;
  categorias: CategoriaAba[];
  itens: ItemLista[];
};

const pct = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(valor);
const centavos = (valor: number) => Math.round(valor * 100) / 100;

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

/** Passo a passo da conta (gerente), na mesma ordem da fórmula do servidor. */
export function passosConta(item: ItemLista, dolar: number) {
  const custo = item.custo_brl ?? 0;
  const comFrete = centavos(custo + (item.frete_brl ?? 0));
  const comLucro = centavos(comFrete + (item.lucro_brl ?? 0));
  const passos = [
    `US$ ${numero(item.preco_usd)} × R$ ${cambioNumero(dolar)} = ${moeda(custo)}`,
    `+ ${pct(item.taxa_pct ?? 0)}% de frete = ${moeda(comFrete)}`,
    `+ ${moeda(item.lucro_brl ?? 0)} de lucro = ${moeda(comLucro)}`,
  ];
  if ((item.margem_extra_brl ?? 0) > 0) {
    passos.push(
      `+ ${pct(item.margem_pct ?? 0)}% de margem extra = ${moeda(item.antes_arredondar ?? comLucro)}`,
    );
  }
  passos.push(`arredondado ${moeda(item.preco_venda)}`);
  return passos.join(" → ");
}
