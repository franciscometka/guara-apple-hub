export type Arredondamento = "nenhum" | "inteiro" | "90" | "00";
export type CategoriaCotacao = { id: string; nome: string; slug?: string; ativo: boolean; ordem: number; margem_pct?: number; taxa_pct?: number };
export type ResultadoCotacao = { preco_venda: number; dolar?: number; dolar_base?: number; dolar_fonte?: "ao_vivo" | "manual" | "salvo"; dolar_provedor?: string; dolar_cotado_em?: string; dolar_acrescimo_pct?: number; custo_brl?: number; margem_pct?: number; taxa_pct?: number; preco_sem_taxa?: number; preco_bruto?: number; arredondamento?: Arredondamento };
export type HistoricoCotacao = ResultadoCotacao & { id: string; categoria_id: string; categoria_nome: string; descricao: string; preco_usd: number; dolar: number; criado_por_nome: string; created_at: string };
export type DadosCotacao = { gerente: boolean; config: { dolar: number; dolar_atualizado_em: string; arredondamento: Arredondamento; dolar_tipo: "ask" | "bid"; dolar_acrescimo_pct: number }; categorias: CategoriaCotacao[]; historico: HistoricoCotacao[] };
export type EntradaCotacao = { categoria_id: string; preco_usd: number; dolar: number; descricao: string; margem_pct?: number; dolar_fonte?: "ao_vivo" | "manual" | "salvo" };

export function decimal(valor: string): number {
  const texto = valor.trim().replace(/\s/g, "");
  if (!texto) return NaN;
  const normalizado = texto.includes(",") && texto.includes(".")
    ? texto.replace(/\./g, "").replace(",", ".") : texto.replace(",", ".");
  return /^\d+(\.\d+)?$/.test(normalizado) ? Number(normalizado) : NaN;
}
export const moeda = (valor: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
export const numero = (valor: number) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
export const dataHora = (valor: string) => new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(valor));
export const campoCotacao = "min-h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function validarEntradaCotacao(entrada: EntradaCotacao) {
  if (!entrada.categoria_id || !Number.isFinite(entrada.dolar) || entrada.dolar <= 0 || !Number.isFinite(entrada.preco_usd) || entrada.preco_usd <= 0) throw new Error("Informe uma categoria, dólar e preço maiores que zero.");
  if (entrada.margem_pct !== undefined && (!Number.isFinite(entrada.margem_pct) || entrada.margem_pct < 0 || entrada.margem_pct > 100)) throw new Error("Margem deve estar entre 0 e 100%.");
  return entrada;
}