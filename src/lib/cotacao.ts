export type Arredondamento = "nenhum" | "inteiro" | "90" | "00";
export type CategoriaCotacao = { id: string; nome: string; slug?: string; ativo: boolean; ordem: number; margem_pct?: number; taxa_pct?: number; lucro_brl?: number };
export type DadosCotacao = { gerente: boolean; config: { dolar: number; dolar_atualizado_em: string; arredondamento: Arredondamento; dolar_tipo: "ask" | "bid"; dolar_acrescimo_pct: number }; categorias: CategoriaCotacao[] };

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
